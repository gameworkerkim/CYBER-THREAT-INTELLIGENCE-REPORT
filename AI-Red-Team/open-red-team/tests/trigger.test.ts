import { describe, expect, it } from "vitest";
import type { Skill } from "../src/types.js";
import { extractExplicitSkills, matchSkills, stripExplicitDirectives } from "../src/skills/trigger.js";

function skill(name: string, triggers: string[]): Skill {
  return {
    frontmatter: { name, description: `${name} desc`, triggers, category: "test" },
    body: "body",
    path: "x",
  };
}

const skills = [
  skill("offensive-sqli", ["sql injection", "sqlmap", "sql 인젝션"]),
  skill("offensive-rce", ["remote code execution", "rce", "command injection"]),
  skill("offensive-cloud", ["aws", "iam", "권한 상승"]),
];

describe("matchSkills", () => {
  it("matches English keywords", () => {
    const m = matchSkills(skills, "how do I run sqlmap?", 3);
    expect(m[0]?.skill.frontmatter.name).toBe("offensive-sqli");
  });

  it("matches Korean keywords", () => {
    const m = matchSkills(skills, "sql 인젝션 테스트", 3);
    expect(m[0]?.skill.frontmatter.name).toBe("offensive-sqli");
  });

  it("does not substring-match short keywords inside words", () => {
    const m = matchSkills(skills, "I reviewed the source code", 3);
    expect(m.find((x) => x.skill.frontmatter.name === "offensive-rce")).toBeUndefined();
  });

  it("caps results at maxSkills and sorts by score", () => {
    const m = matchSkills(skills, "aws iam rce", 2);
    expect(m.length).toBe(2);
    expect(m[0]!.score).toBeGreaterThanOrEqual(m[1]!.score);
  });

  it("returns empty for unrelated input", () => {
    expect(matchSkills(skills, "hello, weather?", 3)).toHaveLength(0);
  });
});

describe("explicit skills", () => {
  it("extracts /use directives", () => {
    const found = extractExplicitSkills("/use offensive-rce and check this", skills);
    expect(found.map((s) => s.frontmatter.name)).toEqual(["offensive-rce"]);
  });

  it("strips /use directives from input", () => {
    expect(stripExplicitDirectives("hello /use offensive-sqli world")).toBe("hello  world");
  });
});
