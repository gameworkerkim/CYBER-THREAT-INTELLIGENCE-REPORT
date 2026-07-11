import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type SkilKind = "control" | "policy" | "playbook";

export interface SkilItem {
  id: string;
  title: string;
  domain?: string;
  severity?: string;
  tags?: string[];
  description?: string;
  remediation?: string;
  legalBasis?: string[];
  [key: string]: unknown;
  _kind: SkilKind;
  _file: string;
}

export interface SkilLookupInput {
  id?: string;
  domain?: string;
  tag?: string;
  kind?: SkilKind;
  list?: boolean;
}

function defaultSkilRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // src/ -> mcp/ -> Startup_Security_Guide/skil
  return join(here, "..", "..", "skil");
}

export function getSkilRoot(): string {
  return process.env.SKIL_ROOT?.trim() || defaultSkilRoot();
}

function loadJson(root: string, rel: string): unknown {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

export function collectAll(root = getSkilRoot()): SkilItem[] {
  const items: SkilItem[] = [];

  for (const file of readdirSync(join(root, "controls"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(root, join("controls", file)) as { controls?: Record<string, unknown>[] };
    for (const c of doc.controls || []) {
      items.push({ ...c, _kind: "control", _file: `controls/${file}` } as SkilItem);
    }
  }
  for (const file of readdirSync(join(root, "policies"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(root, join("policies", file)) as { policies?: Record<string, unknown>[] };
    for (const p of doc.policies || []) {
      items.push({ ...p, _kind: "policy", _file: `policies/${file}` } as SkilItem);
    }
  }
  for (const file of readdirSync(join(root, "playbooks"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(root, join("playbooks", file)) as { playbooks?: Record<string, unknown>[] };
    for (const p of doc.playbooks || []) {
      items.push({ ...p, _kind: "playbook", _file: `playbooks/${file}` } as SkilItem);
    }
  }
  return items;
}

export function skilLookup(input: SkilLookupInput, root = getSkilRoot()) {
  const items = collectAll(root);

  if (input.list) {
    return {
      ok: true as const,
      count: items.length,
      ids: items.map((i) => ({
        id: i.id,
        kind: i._kind,
        title: i.title,
        domain: i.domain ?? null,
        severity: i.severity ?? null,
      })),
    };
  }

  if (input.id) {
    const hit = items.find((i) => i.id === input.id);
    if (!hit) {
      return {
        ok: false as const,
        error: "not_found",
        id: input.id,
        hint: "Use list=true or domain/tag filters",
      };
    }
    return { ok: true as const, item: hit };
  }

  let filtered = items;
  if (input.kind) filtered = filtered.filter((i) => i._kind === input.kind);
  if (input.domain) {
    filtered = filtered.filter(
      (i) => i.domain === input.domain || (i.tags || []).includes(input.domain!)
    );
  }
  if (input.tag) filtered = filtered.filter((i) => (i.tags || []).includes(input.tag!));

  if (!input.kind && !input.domain && !input.tag) {
    return {
      ok: false as const,
      error: "invalid_query",
      hint: "Provide id, or domain/tag/kind, or list=true",
    };
  }

  return { ok: true as const, count: filtered.length, items: filtered };
}
