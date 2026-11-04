import { loadConfig } from "./config.js";
import { loadSkills, getSkillByName } from "./skills/loader.js";
import { matchSkills, extractExplicitSkills, stripExplicitDirectives } from "./skills/trigger.js";
import { buildSystemPrompt, BASE_SYSTEM_PROMPT } from "./skills/inject.js";
import { BaseProvider } from "./providers/base.js";
import { DeepSeekProvider } from "./providers/deepseek.js";
import { GlmProvider } from "./providers/glm.js";
import { OpenWeightProvider } from "./providers/openweight.js";
import { loadScopeGuard, scopePromptBlock, checkScope, scopeWarningLine } from "./safety.js";
import { initObservability, recordChat } from "./observability.js";
import type {
  ChatMessage,
  ChatResult,
  OrtConfig,
  OrtOptions,
  ProviderName,
  Skill,
} from "./types.js";

export class OpenRedTeam {
  readonly config: OrtConfig;
  readonly skills: Skill[] = [];
  private provider: BaseProvider;
  private history: ChatMessage[] = [];
  private systemPrompt?: string;

  constructor(opts?: Partial<OrtOptions>) {
    this.config = loadConfig({
      provider: opts?.provider,
      model: opts?.model,
      apiKey: opts?.apiKey,
      baseUrl: opts?.baseUrl,
      skillsDir: opts?.skillsDir,
      autoLoad: opts?.autoLoad,
      maxSkills: opts?.maxSkills,
      includeIndex: opts?.includeIndex,
    });
    this.provider = createProvider(this.config, opts);
    this.systemPrompt = opts?.systemPrompt;
    initObservability();
  }

  async init(): Promise<void> {
    this.skills.length = 0;
    this.skills.push(...(await loadSkills(this.config.skillsDir)));
  }

  listSkills(): Skill[] {
    return this.skills;
  }

  getSkill(name: string): Skill | undefined {
    return getSkillByName(this.skills, name);
  }

  async chat(
    input: string,
    opts?: { skills?: string[]; onDelta?: (delta: string) => void; onReasoning?: (delta: string) => void },
  ): Promise<ChatResult> {
    if (this.skills.length === 0) await this.init();

    const explicit = opts?.skills
      ?.map((n) => this.getSkill(n))
      .filter((s): s is Skill => s !== undefined) ?? [];

    const stripped = stripExplicitDirectives(input);
    explicit.push(...extractExplicitSkills(stripped, this.skills));

    const autoMatched = this.config.autoLoad
      ? matchSkills(this.skills, stripped, this.config.maxSkills).map((m) => m.skill)
      : [];

    const loaded: Skill[] = [];
    for (const skill of [...explicit, ...autoMatched]) {
      if (!loaded.includes(skill)) loaded.push(skill);
    }

    const guard = loadScopeGuard();
    const scopeCheck = guard ? checkScope(stripped, guard) : null;
    const warning = scopeCheck ? scopeWarningLine(scopeCheck) : "";

    const base = [this.systemPrompt ?? BASE_SYSTEM_PROMPT];
    if (guard) base.push(scopePromptBlock(guard));

    const { prompt, stats } = buildSystemPrompt({
      skills: this.skills,
      loadedSkills: loaded,
      includeIndex: this.config.includeIndex,
      custom: base.join("\n\n"),
      provider: this.config.provider,
    });

    this.history.push({ role: "user", content: input });
    const systemContent = warning ? `${prompt}\n\n${warning}` : prompt;
    const messages: ChatMessage[] = [{ role: "system", content: systemContent }, ...this.history];

    const { content, reasoningLength } = await this.provider.chat(messages, {
      onDelta: opts?.onDelta,
      onReasoning: opts?.onReasoning,
    });
    this.history.push({ role: "assistant", content });

    const matchedSkills = loaded.map((s) => s.frontmatter.name);
    void recordChat({
      input,
      output: content,
      provider: this.config.provider,
      model: this.config.model,
      matchedSkills,
      scope: guard?.scope,
      flaggedTargets: scopeCheck?.flaggedTargets,
      promptTokens: stats.totalTokens,
      reasoningTokens: reasoningLength,
      operator: guard?.operator ?? process.env.ORT_OPERATOR ?? "unknown",
    });

    return {
      content,
      matchedSkills,
      provider: this.config.provider,
      model: this.config.model,
      promptTokens: stats.totalTokens,
      maxContextTokens: stats.maxContextTokens,
      reasoningTokens: reasoningLength,
    };
  }

  reset(): void {
    this.history = [];
  }
}

function createProvider(config: OrtConfig, opts?: Partial<OrtOptions>): BaseProvider {
  const common = {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    model: config.model,
    temperature: opts?.temperature,
    maxTokens: opts?.maxTokens,
  };
  switch (config.provider) {
    case "deepseek":
      return new DeepSeekProvider(common);
    case "glm":
      return new GlmProvider(common);
    case "openweight":
      return new OpenWeightProvider(common);
    default: {
      const exhaustive: never = config.provider;
      throw new Error(`Unhandled provider: ${String(exhaustive)}`);
    }
  }
}

export type { OrtConfig, OrtOptions, ChatResult, ProviderName, Skill, ChatMessage };
export { loadSkills, matchSkills, buildSystemPrompt };
