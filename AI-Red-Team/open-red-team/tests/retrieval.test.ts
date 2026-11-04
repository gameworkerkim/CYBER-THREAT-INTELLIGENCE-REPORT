import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSkills } from "../src/skills/loader.js";
import { matchSkills } from "../src/skills/trigger.js";

interface FixtureEntry {
  query: string;
  skill: string;
  k: number;
}

const fixtures = JSON.parse(
  readFileSync(new URL("./fixtures/retrieval.json", import.meta.url), "utf-8"),
) as FixtureEntry[];

// Committed baseline: thresholds measured on the keyword engine at v0.5.0.
// A lower hit rate means the trigger engine regressed.
const TOP1_MIN = 0.85;
const TOP3_MIN = 0.95;

describe("retrieval quality baseline", () => {
  it(`top-1 >= ${TOP1_MIN} and top-3 >= ${TOP3_MIN} on ${fixtures.length} representative queries`, async () => {
    const skills = await loadSkills("./skills");
    let top1 = 0;
    let top3 = 0;
    const misses: string[] = [];
    for (const f of fixtures) {
      const results = matchSkills(skills, f.query, f.k).map((m) => m.skill.frontmatter.name);
      if (results[0] === f.skill) top1 += 1;
      if (results.slice(0, 3).includes(f.skill)) top3 += 1;
      else misses.push(`"${f.query}" -> ${results.join(", ") || "none"} (expected ${f.skill})`);
    }
    const top1Rate = top1 / fixtures.length;
    const top3Rate = top3 / fixtures.length;
    console.log(`top-1: ${top1Rate.toFixed(2)}, top-3: ${top3Rate.toFixed(2)}${misses.length ? `\nmisses:\n${misses.join("\n")}` : ""}`);
    expect(top1Rate).toBeGreaterThanOrEqual(TOP1_MIN);
    expect(top3Rate).toBeGreaterThanOrEqual(TOP3_MIN);
  });
});

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web Application",
  infrastructure: "Infrastructure & Red Team",
  api: "API Security",
  cloud: "Cloud",
  ai: "AI Security",
  "active-directory": "Active Directory",
  auth: "Auth & Identity",
  wireless: "Wireless",
  mobile: "Mobile",
  iot: "IoT & Embedded",
  "exploit-dev": "Exploit Development",
  fuzzing: "Fuzzing & Vuln Research",
  recon: "Reconnaissance",
  container: "Container & Kubernetes",
  cicd: "CI/CD & Pipeline",
  crypto: "Cryptography",
  privesc: "Privilege Escalation",
  "post-exploitation": "Post-Exploitation",
  forensics: "Forensics & C2",
  "supply-chain": "Supply Chain",
  "social-engineering": "Social Engineering",
  network: "Network Attacks",
  utility: "Utility",
};

describe("catalog matches README", () => {
  it("per-category counts and totals match the README table", async () => {
    const skills = await loadSkills("./skills");
    const counts = new Map<string, number>();
    for (const s of skills) {
      counts.set(s.frontmatter.category, (counts.get(s.frontmatter.category) ?? 0) + 1);
    }

    const readme = readFileSync(join(process.cwd(), "README.md"), "utf-8");
    const rowRe = /\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|/g;
    const readmeCounts = new Map<string, number>();
    let m: RegExpExecArray | null;
    while ((m = rowRe.exec(readme)) !== null) {
      readmeCounts.set(m[1].trim(), Number(m[2]));
      readmeCounts.set(m[3].trim(), Number(m[4]));
    }

    for (const [category, label] of Object.entries(CATEGORY_LABELS)) {
      const disk = counts.get(category) ?? 0;
      const doc = readmeCounts.get(label);
      expect(doc, `README entry for "${label}" (folder "${category}")`).toBe(disk);
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(79);
  });
});
