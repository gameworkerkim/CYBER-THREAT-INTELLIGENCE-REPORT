import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, join } from "node:path";
import type { Skill, SkillFrontmatter } from "../types.js";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseSimpleYaml(raw: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  let currentList: string[] | null = null;
  let listKey: string | null = null;

  for (const line of raw.split(/\r?\n/)) {
    if (/^\s*#/.test(line) || line.trim() === "") continue;
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && listKey) {
      currentList!.push(listItem[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const value = kv[2].trim();
      if (value === "") {
        listKey = key;
        currentList = [];
        out[key] = currentList;
      } else {
        listKey = null;
        currentList = null;
        out[key] = value.replace(/^["']|["']$/g, "");
      }
    } else if (listKey && currentList && line.trim() !== "") {
      currentList.push(line.trim());
    }
  }
  return out;
}

export function parseSkill(content: string, path: string): Skill {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`Skill at ${path} has no valid frontmatter`);
  }

  const fm = parseSimpleYaml(match[1]);
  const frontmatter: SkillFrontmatter = {
    name: String(fm.name ?? ""),
    description: String(fm.description ?? ""),
    triggers: Array.isArray(fm.triggers)
      ? fm.triggers.map((t) => String(t))
      : typeof fm.triggers === "string"
        ? [fm.triggers]
        : [],
    category: String(fm.category ?? "uncategorized"),
    model_note: fm.model_note !== undefined ? String(fm.model_note) : undefined,
    source: fm.source !== undefined ? String(fm.source) : undefined,
    index_only: fm.index_only === true || fm.index_only === "true",
  };

  if (!frontmatter.name) throw new Error(`Skill at ${path} has no name`);
  if (!frontmatter.description) throw new Error(`Skill at ${path} has no description`);

  return {
    frontmatter,
    body: content.slice(match[0].length).trim(),
    path,
  };
}

export async function loadSkillFromFile(filePath: string): Promise<Skill> {
  const content = await readFile(filePath, "utf-8");
  return parseSkill(content, filePath);
}

export async function loadSkills(skillsDir: string): Promise<Skill[]> {
  const skills: Skill[] = [];
  const base = resolve(process.cwd(), skillsDir);

  async function walk(dir: string): Promise<void> {
    let entries: string[];
    try {
      entries = await readdir(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry);
      const info = await stat(full).catch(() => null);
      if (!info) continue;
      if (info.isDirectory()) {
        await walk(full);
      } else if (entry === "SKILL.md" || entry.endsWith(".skill.md")) {
        skills.push(await loadSkillFromFile(full));
      }
    }
  }

  await walk(base);
  skills.sort((a, b) => a.frontmatter.name.localeCompare(b.frontmatter.name));
  return skills.map((s) => ({ ...s, path: relative(process.cwd(), s.path) }));
}

export function getSkillByName(skills: Skill[], name: string): Skill | undefined {
  const n = name.toLowerCase();
  return skills.find((s) => s.frontmatter.name.toLowerCase() === n);
}
