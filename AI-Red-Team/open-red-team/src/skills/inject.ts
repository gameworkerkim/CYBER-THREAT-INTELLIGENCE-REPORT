import type { Skill } from "../types.js";

export const BASE_SYSTEM_PROMPT = `You are an offensive security operator conducting an AUTHORIZED engagement.

Rules of engagement:
- Only assist with security testing on systems you are authorized to test (pentests, bug bounty programs in scope, CTF challenges, your own labs).
- Prefer concrete, actionable methodology: commands, payloads, tooling, and verification steps.
- When a relevant skill is loaded, follow its methodology and cite the techniques it defines.
- For unauthorized or clearly malicious targets, refuse and suggest a legal alternative (e.g., a lab environment like DVWA, PortSwigger Web Security Academy, HackTheBox).`;

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

export function buildSystemPrompt(opts: {
  skills: Skill[];
  loadedSkills: Skill[];
  includeIndex: boolean;
  custom?: string;
}): string {
  const parts: string[] = [];
  parts.push(opts.custom ?? BASE_SYSTEM_PROMPT);

  if (opts.includeIndex && opts.skills.length > 0) {
    parts.push(buildSkillIndex(opts.skills));
  }

  for (const skill of opts.loadedSkills) {
    parts.push(
      [
        `--- LOADED SKILL: ${skill.frontmatter.name} ---`,
        skill.body,
        `--- END SKILL: ${skill.frontmatter.name} ---`,
      ].join("\n"),
    );
  }

  return parts.join("\n\n");
}

export function skillMentionNote(skills: Skill[]): string {
  return `Loaded skills: ${skills.map((s) => s.frontmatter.name).join(", ") || "none"}`;
}
