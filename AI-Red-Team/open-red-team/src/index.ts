import { loadConfig } from "./config.js";
import { loadSkills, getSkillByName } from "./skills/loader.js";
import { matchSkills, extractExplicitSkills, stripExplicitDirectives } from "./skills/trigger.js";
import { buildSystemPrompt } from "./skills/inject.js";
import { BaseProvider } from "./providers/base.js";
import { DeepSeekProvider } from "./providers/deepseek.js";
import { GlmProvider } from "./providers/glm.js";
import { OpenWeightProvider } from "./providers/openweight.js";
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
    opts?: { skills?: string[]; onDelta?: (delta: string) => void },
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

    const systemPrompt = buildSystemPrompt({
      skills: this.skills,
      loadedSkills: loaded,
      includeIndex: this.config.includeIndex,
    });

    this.history.push({ role: "user", content: input });
    const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...this.history];

    const content = await this.provider.chat(messages, opts?.onDelta);
    this.history.push({ role: "assistant", content });

    return {
      content,
      matchedSkills: loaded.map((s) => s.frontmatter.name),
      provider: this.config.provider,
      model: this.config.model,
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
