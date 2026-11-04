import { loadConfig } from "./config.js";
import { loadSkills, getSkillByName } from "./skills/loader.js";
import { matchSkills, extractExplicitSkills, stripExplicitDirectives } from "./skills/trigger.js";
import { buildSystemPrompt, BASE_SYSTEM_PROMPT, estimateTokens } from "./skills/inject.js";
import { BaseProvider } from "./providers/base.js";
import { DeepSeekProvider } from "./providers/deepseek.js";
import { GlmProvider } from "./providers/glm.js";
import { OpenWeightProvider } from "./providers/openweight.js";
import {
  loadScopeGuard,
  scopePromptBlock,
  checkScope,
  scopeWarningLine,
  SCOPE_DENIED_REPLY,
} from "./safety.js";
import { initObservability, recordChat } from "./observability.js";
import type { ChatSession } from "./sessions.js";
import type {
  ChatMessage,
  ChatResult,
  OrtConfig,
  OrtOptions,
  ProviderName,
  Skill,
  ScopeDecision,
} from "./types.js";

const HISTORY_RESERVE_TOKENS = 4_096;

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
    this.provider = opts?.providerOverride ?? createProvider(this.config, opts);
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
    opts?: {
      skills?: string[];
      onDelta?: (delta: string) => void;
      onReasoning?: (delta: string) => void;
      session?: ChatSession;
    },
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

    const providerName = this.config.provider;
    const modelName = this.config.model;

    if (scopeCheck && scopeCheck.decision === "deny") {
      void recordChat({
        input: stripped,
        output: SCOPE_DENIED_REPLY,
        provider: providerName,
        model: modelName,
        matchedSkills: [],
        scope: guard?.scope,
        flaggedTargets: scopeCheck.flaggedTargets,
        decision: "deny",
        operator: guard?.operator ?? opts?.session?.operator ?? process.env.ORT_OPERATOR ?? "unknown",
        sessionId: opts?.session?.id,
      });
      return {
        content: SCOPE_DENIED_REPLY,
        matchedSkills: [],
        provider: providerName,
        model: modelName,
        decision: "deny",
        flaggedTargets: scopeCheck.flaggedTargets,
        droppedTurns: 0,
        sessionId: opts?.session?.id,
      };
    }

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

    const historyRef = opts?.session ? opts.session.history : this.history;
    historyRef.push({ role: "user", content: input });

    const historyBudget = stats.maxContextTokens - HISTORY_RESERVE_TOKENS - stats.totalTokens;
    const { trimmed, droppedTurns } = trimHistory(historyRef, Math.max(0, historyBudget));

    let systemContent = warning ? `${prompt}\n\n${warning}` : prompt;
    if (droppedTurns > 0) {
      systemContent += `\n\n[earlier turns omitted: ${droppedTurns} turns trimmed by the context budget]`;
    }

    const messages: ChatMessage[] = [{ role: "system", content: systemContent }, ...trimmed];

    const { content, reasoningLength } = await this.provider.chat(messages, {
      onDelta: opts?.onDelta,
      onReasoning: opts?.onReasoning,
    });
    historyRef.push({ role: "assistant", content });

    const matchedSkills = loaded.map((s) => s.frontmatter.name);
    void recordChat({
      input: stripped,
      output: content,
      provider: providerName,
      model: modelName,
      matchedSkills,
      scope: guard?.scope,
      flaggedTargets: scopeCheck?.flaggedTargets,
      decision: "allow",
      operator: guard?.operator ?? opts?.session?.operator ?? process.env.ORT_OPERATOR ?? "unknown",
      sessionId: opts?.session?.id,
      promptTokens: stats.totalTokens,
      reasoningTokens: reasoningLength,
    });

    return {
      content,
      matchedSkills,
      provider: providerName,
      model: modelName,
      decision: "allow",
      flaggedTargets: [],
      promptTokens: stats.totalTokens,
      maxContextTokens: stats.maxContextTokens,
      reasoningTokens: reasoningLength,
      droppedTurns,
      sessionId: opts?.session?.id,
    };
  }

  reset(): void {
    this.history = [];
  }
}

export function trimHistory(history: ChatMessage[], budget: number): { trimmed: ChatMessage[]; droppedTurns: number } {
  if (budget >= history.reduce((sum, m) => sum + estimateTokens(m.content), 0)) {
    return { trimmed: history, droppedTurns: 0 };
  }
  let idx = 0;
  let droppedTurns = 0;
  while (idx < history.length - 1) {
    const remaining = history.slice(idx);
    const tokens = remaining.reduce((sum, m) => sum + estimateTokens(m.content), 0);
    if (tokens <= budget) break;
    if (history[idx].role === "user") droppedTurns += 1;
    idx += 1;
  }
  if (idx >= history.length) idx = history.length - 1;
  return { trimmed: history.slice(idx), droppedTurns };
}

export function createProvider(config: OrtConfig, opts?: Partial<OrtOptions>): BaseProvider {
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

export type { OrtConfig, OrtOptions, ChatResult, ProviderName, Skill, ChatMessage, ScopeDecision };
export { loadSkills, matchSkills, buildSystemPrompt };
