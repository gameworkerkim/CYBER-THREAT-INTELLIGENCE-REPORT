import type { BaseProvider } from "./providers/base.js";

export type ProviderName = "deepseek" | "glm" | "openweight";

export interface SkillFrontmatter {
  name: string;
  description: string;
  triggers: string[];
  category: string;
  model_note?: string;
  source?: string;
  index_only?: boolean;
}

export interface Skill {
  frontmatter: SkillFrontmatter;
  body: string;
  path: string;
}

export interface SkillMatch {
  skill: Skill;
  score: number;
  matchedTriggers: string[];
}

export interface OrtConfig {
  provider: ProviderName;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  skillsDir: string;
  autoLoad: boolean;
  maxSkills: number;
  includeIndex: boolean;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OrtOptions {
  provider: ProviderName;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  skillsDir?: string;
  autoLoad?: boolean;
  maxSkills?: number;
  includeIndex?: boolean;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  providerOverride?: BaseProvider;
}

export interface ChatResult {
  content: string;
  matchedSkills: string[];
  provider: ProviderName;
  model: string;
  decision: ScopeDecision;
  flaggedTargets: string[];
  promptTokens?: number;
  maxContextTokens?: number;
  reasoningTokens?: number;
  droppedTurns?: number;
  sessionId?: string;
}

export type ScopeDecision = "allow" | "deny";
