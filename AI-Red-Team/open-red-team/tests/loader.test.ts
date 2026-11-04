import { describe, expect, it } from "vitest";
import { parseSkill } from "../src/skills/loader.js";

const FM = `---
name: offensive-sqli
description: "SQL injection testing skill"
triggers:
  - "sql injection"
  - "sqli"
category: web
index_only: true
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---

# Body

Hello world.
`;

describe("parseSkill", () => {
  it("parses frontmatter and body", () => {
    const skill = parseSkill(FM, "skills/web/offensive-sqli/SKILL.md");
    expect(skill.frontmatter.name).toBe("offensive-sqli");
    expect(skill.frontmatter.description).toBe("SQL injection testing skill");
    expect(skill.frontmatter.triggers).toEqual(["sql injection", "sqli"]);
    expect(skill.frontmatter.category).toBe("web");
    expect(skill.frontmatter.index_only).toBe(true);
    expect(skill.frontmatter.source).toContain("Claude-Red");
    expect(skill.body).toContain("# Body");
  });

  it("throws when frontmatter is missing", () => {
    expect(() => parseSkill("# Just a title\n\nbody", "x/SKILL.md")).toThrow(/frontmatter/);
  });

  it("throws when description is empty", () => {
    const bad = `---
name: x
description: ""
triggers: []
category: web
---

body`;
    expect(() => parseSkill(bad, "x/SKILL.md")).toThrow(/description/);
  });
});
