import type { ProviderName, Skill } from "../types.js";

export interface PromptStats {
  baseTokens: number;
  indexTokens: number;
  skillBodyTokens: number;
  totalTokens: number;
  maxContextTokens: number;
  truncatedSkills: string[];
  skippedIndexOnly: string[];
  droppedSkills: string[];
}

export interface BuildPromptOptions {
  skills: Skill[];
  loadedSkills: Skill[];
  includeIndex: boolean;
  custom?: string;
  provider: ProviderName;
  maxContextTokens?: number;
  skillBudgetTokens?: number;
  reserveTokens?: number;
}

export const DEFAULT_CONTEXT_LIMITS: Record<ProviderName, number> = {
  deepseek: 64_000,
  glm: 128_000,
  openweight: 32_000,
};

export const DEFAULT_SKILL_BUDGETS: Record<ProviderName, number> = {
  deepseek: 16_000,
  glm: 24_000,
  openweight: 8_000,
};

export const DEFAULT_RESERVE_TOKENS = 4_096;

const CJK_RE = /[\u1100-\u11FF\u2E80-\uA4CF\uAC00-\uD7AF\uF900-\uFAFF\uFE30-\uFE4F\uFF65-\uFFDC\u3000-\u303F]/g;

export function estimateTokens(text: string): number {
  if (!text) return 0;
  const cjk = text.match(CJK_RE)?.length ?? 0;
  return cjk + Math.ceil((text.length - cjk) / 4);
}

export function truncateBodyToTokens(body: string, budget: number): string {
  if (estimateTokens(body) <= budget) return body;

  const sections = body.split(/\n(?=#{1,4}\s)/);
  let out = "";
  for (const section of sections) {
    const candidate = out ? `${out}\n${section}` : section;
    if (estimateTokens(candidate) > budget) {
      if (!out) return `${hardCut(candidate, budget)}\n\n… [truncated by token budget]`;
      return `${out}\n\n… [truncated by token budget: ${sections.length} sections total]`;
    }
    out = candidate;
  }
  return out;
}

function hardCut(text: string, budget: number): string {
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (estimateTokens(text.slice(0, mid)) <= budget) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, lo);
}

export function buildSystemPrompt(opts: BuildPromptOptions): { prompt: string; stats: PromptStats } {
  const maxContext =
    opts.maxContextTokens ??
    (Number(process.env.ORT_MAX_CONTEXT ?? 0) || DEFAULT_CONTEXT_LIMITS[opts.provider]);
  const skillBudget =
    opts.skillBudgetTokens ??
    (Number(process.env.ORT_SKILL_BUDGET ?? 0) || DEFAULT_SKILL_BUDGETS[opts.provider]);
  const reserve =
    opts.reserveTokens ?? (Number(process.env.ORT_RESERVE_TOKENS ?? 0) || DEFAULT_RESERVE_TOKENS);

  const stats: PromptStats = {
    baseTokens: 0,
    indexTokens: 0,
    skillBodyTokens: 0,
    totalTokens: 0,
    maxContextTokens: maxContext,
    truncatedSkills: [],
    skippedIndexOnly: [],
    droppedSkills: [],
  };

  const base = opts.custom ?? BASE_SYSTEM_PROMPT;
  stats.baseTokens = estimateTokens(base);

  let indexText = "";
  if (opts.includeIndex && opts.skills.length > 0) {
    indexText = buildSkillIndex(opts.skills);
    stats.indexTokens = estimateTokens(indexText);
  }

  const available = maxContext - reserve - stats.baseTokens - stats.indexTokens;
  const perSkill = available > 0 ? Math.min(skillBudget, Math.floor(available / Math.max(opts.loadedSkills.length, 1))) : 0;

  const bodyParts: string[] = [];
  for (const skill of opts.loadedSkills) {
    if (skill.frontmatter.index_only) {
      stats.skippedIndexOnly.push(skill.frontmatter.name);
      continue;
    }
    if (perSkill <= 0) {
      stats.droppedSkills.push(skill.frontmatter.name);
      continue;
    }
    const bodyTokens = estimateTokens(skill.body);
    let body = skill.body;
    if (bodyTokens > perSkill) {
      body = truncateBodyToTokens(skill.body, perSkill);
      stats.truncatedSkills.push(skill.frontmatter.name);
    }
    stats.skillBodyTokens += estimateTokens(body);
    bodyParts.push(
      `--- LOADED SKILL: ${skill.frontmatter.name} ---\n${body}\n--- END SKILL: ${skill.frontmatter.name} ---`,
    );
  }

  const parts: string[] = [base];
  if (indexText) parts.push(indexText);
  parts.push(...bodyParts);

  const prompt = parts.join("\n\n");
  stats.totalTokens = estimateTokens(prompt);

  return { prompt, stats };
}

export function buildSkillIndex(skills: Skill[]): string {
  const lines = skills.map((s) => {
    const f = s.frontmatter;
    const triggerHint = f.triggers.length > 0 ? f.triggers.slice(0, 3).join(", ") : "";
    return `- ${f.name} [${f.category}]: ${f.description}${triggerHint ? ` (triggers: ${triggerHint})` : ""}`;
  });
  return [
    "Available skills (loaded on demand):",
    lines.join("\n"),
    "",
    'Use "/use <skill-name>" to force-load a skill.',
  ].join("\n");
}

export function skillMentionNote(skills: Skill[]): string {
  return `Loaded skills: ${skills.map((s) => s.frontmatter.name).join(", ") || "none"}`;
}

export const BASE_SYSTEM_PROMPT = `You are an offensive security operator conducting an AUTHORIZED engagement.

Rules of engagement:
- Only assist with security testing on systems you are authorized to test (pentests, bug bounty programs in scope, CTF challenges, your own labs).
- Prefer concrete, actionable methodology: commands, payloads, tooling, and verification steps.
- When a relevant skill is loaded, follow its methodology and cite the techniques it defines.
- For unauthorized or clearly malicious targets, refuse and suggest a legal alternative (e.g., a lab environment like DVWA, PortSwigger Web Security Academy, HackTheBox).`;
