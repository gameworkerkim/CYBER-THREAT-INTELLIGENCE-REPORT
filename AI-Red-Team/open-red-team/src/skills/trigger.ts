import type { Skill, SkillMatch } from "../types.js";

interface CompiledTrigger {
  keyword?: string;
  regex?: RegExp;
}

function compileTrigger(trigger: string): CompiledTrigger {
  const regexMatch = trigger.match(/^\/(.+)\/([a-z]*)$/);
  if (regexMatch) {
    try {
      return { regex: new RegExp(regexMatch[1], regexMatch[2]) };
    } catch {
      return { keyword: trigger };
    }
  }
  return { keyword: trigger.toLowerCase() };
}

function scoreKeyword(text: string, keyword: string): number {
  const lower = text.toLowerCase();
  if (keyword.length <= 4 && /^[a-z0-9]+$/.test(keyword)) {
    const re = new RegExp(`\\b${keyword}\\b`, "i");
    return re.test(text) ? 2 : 0;
  }
  if (lower.includes(keyword)) {
    return keyword.length >= 4 ? 2 : 1;
  }
  if (keyword.includes(" ")) {
    const parts = keyword.split(" ").filter((p) => p.length >= 3);
    const hits = parts.filter((p) => lower.includes(p)).length;
    if (hits >= 2) return hits;
  }
  return 0;
}

export function matchSkills(skills: Skill[], input: string, maxSkills: number): SkillMatch[] {
  const matches: SkillMatch[] = [];

  for (const skill of skills) {
    let score = 0;
    const matchedTriggers: string[] = [];
    for (const trigger of skill.frontmatter.triggers) {
      const compiled = compileTrigger(trigger);
      let hit = false;
      if (compiled.regex) {
        try {
          if (compiled.regex.test(input)) hit = true;
        } catch {
          /* ignore */
        }
      } else if (compiled.keyword && scoreKeyword(input, compiled.keyword) > 0) {
        hit = true;
      }
      if (hit) {
        score += compiled.keyword ? scoreKeyword(input, compiled.keyword!) : 3;
        matchedTriggers.push(trigger);
      }
    }
    if (score > 0) {
      matches.push({ skill, score, matchedTriggers });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, maxSkills);
}

export function extractExplicitSkills(input: string, skills: Skill[]): Skill[] {
  const requested: Skill[] = [];
  const slashRe = /\/use\s+([a-z0-9_-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = slashRe.exec(input)) !== null) {
    const found = skills.find((s) => s.frontmatter.name.toLowerCase() === m![1].toLowerCase());
    if (found && !requested.includes(found)) requested.push(found);
  }
  return requested;
}

export function stripExplicitDirectives(input: string): string {
  return input.replace(/\/use\s+[a-z0-9_-]+/gi, "").trim();
}
