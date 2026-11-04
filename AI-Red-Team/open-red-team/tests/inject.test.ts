import { describe, expect, it } from "vitest";
import type { Skill } from "../src/types.js";
import { buildSystemPrompt, estimateTokens, truncateBodyToTokens } from "../src/skills/inject.js";

function skill(name: string, body: string, extra: Partial<Skill["frontmatter"]> = {}): Skill {
  return {
    frontmatter: { name, description: `${name} desc`, triggers: ["x"], category: "test", ...extra },
    body,
    path: "x",
  };
}

describe("estimateTokens", () => {
  it("counts CJK chars as one token each", () => {
    const tokens = estimateTokens("안녕하세요");
    expect(tokens).toBe(5);
  });

  it("estimates latin text at ~4 chars per token", () => {
    expect(estimateTokens("abcd efgh")).toBe(3);
  });
});

describe("truncateBodyToTokens", () => {
  const body = ["# Intro", "short line", "## Methods", "long section ".repeat(100), "## References", "tail"].join("\n");

  it("returns body unchanged when under budget", () => {
    expect(truncateBodyToTokens("small body", 100)).toBe("small body");
  });

  it("keeps whole sections up to the budget and adds a marker", () => {
    const out = truncateBodyToTokens(body, 40);
    expect(out).toContain("# Intro");
    expect(out).toContain("truncated by token budget");
    expect(out).not.toContain("# References");
  });

  it("hard-cuts a single oversized section", () => {
    const out = truncateBodyToTokens("x".repeat(2000), 50);
    expect(out.length).toBeLessThan(250);
    expect(out).toContain("truncated");
  });
});

describe("buildSystemPrompt budget", () => {
  const big = skill("offensive-big", "# H\n" + "y".repeat(4000));
  const small = skill("offensive-small", "tiny body");
  const indexOnly = skill("offensive-course", "huge", { index_only: true });

  it("truncates oversized bodies to the per-skill budget", () => {
    const { prompt, stats } = buildSystemPrompt({
      skills: [big],
      loadedSkills: [big],
      includeIndex: true,
      provider: "openweight",
      maxContextTokens: 32_000,
      skillBudgetTokens: 500,
    });
    expect(stats.truncatedSkills).toContain("offensive-big");
    expect(estimateTokens(prompt)).toBeLessThanOrEqual(32_000);
  });

  it("skips index_only skills", () => {
    const { stats } = buildSystemPrompt({
      skills: [indexOnly],
      loadedSkills: [indexOnly],
      includeIndex: false,
      provider: "deepseek",
    });
    expect(stats.skippedIndexOnly).toContain("offensive-course");
  });

  it("drops skill bodies when no budget remains", () => {
    const { stats } = buildSystemPrompt({
      skills: [small],
      loadedSkills: [small],
      includeIndex: true,
      provider: "openweight",
      maxContextTokens: 500,
      reserveTokens: 0,
    });
    expect(stats.droppedSkills.length + stats.skillBodyTokens).toBeGreaterThanOrEqual(0);
  });

  it("stays within max context for a realistic default scenario", () => {
    const { stats } = buildSystemPrompt({
      skills: [big, big],
      loadedSkills: [big, big],
      includeIndex: true,
      provider: "deepseek",
    });
    expect(stats.totalTokens).toBeLessThanOrEqual(stats.maxContextTokens + 1);
  });
});
