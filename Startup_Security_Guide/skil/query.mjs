#!/usr/bin/env node
/**
 * SKIL query CLI — lookup by ID, domain, tag, or list all.
 * Usage:
 *   node query.mjs control:aws-iam-mfa
 *   node query.mjs --domain cloud
 *   node query.mjs --tag mfa
 *   node query.mjs --list
 *   node query.mjs --rebuild-index
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

function loadJson(rel) {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
}

function collectAll() {
  const items = [];

  for (const file of readdirSync(join(ROOT, "controls"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(join("controls", file));
    for (const c of doc.controls || []) items.push({ ...c, _kind: "control", _file: `controls/${file}` });
  }
  for (const file of readdirSync(join(ROOT, "policies"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(join("policies", file));
    for (const p of doc.policies || []) items.push({ ...p, _kind: "policy", _file: `policies/${file}` });
  }
  for (const file of readdirSync(join(ROOT, "playbooks"))) {
    if (!file.endsWith(".json")) continue;
    const doc = loadJson(join("playbooks", file));
    for (const p of doc.playbooks || []) items.push({ ...p, _kind: "playbook", _file: `playbooks/${file}` });
  }
  return items;
}

function rebuildIndex(items) {
  const index = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    count: items.length,
    ids: items.map((i) => ({
      id: i.id,
      kind: i._kind,
      title: i.title,
      domain: i.domain || null,
      severity: i.severity || null,
      tags: i.tags || [],
      file: i._file,
    })),
  };
  writeFileSync(join(ROOT, "index.json"), JSON.stringify(index, null, 2) + "\n");
  return index;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`SKIL query — Security Knowledge & Intelligence Layer

Usage:
  node query.mjs <id>              Lookup exact ID (e.g. control:aws-iam-mfa)
  node query.mjs --domain <name>   Filter by domain
  node query.mjs --tag <tag>       Filter by tag
  node query.mjs --kind <kind>     control | policy | playbook
  node query.mjs --list            List all IDs
  node query.mjs --rebuild-index   Regenerate index.json
`);
    process.exit(0);
  }

  const items = collectAll();

  if (args.includes("--rebuild-index")) {
    const index = rebuildIndex(items);
    console.log(JSON.stringify({ ok: true, count: index.count }, null, 2));
    return;
  }

  if (args.includes("--list")) {
    console.log(JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, kind: i._kind })), null, 2));
    return;
  }

  const domainIdx = args.indexOf("--domain");
  if (domainIdx !== -1) {
    const d = args[domainIdx + 1];
    const hit = items.filter((i) => i.domain === d || (i.tags || []).includes(d));
    console.log(JSON.stringify(hit, null, 2));
    return;
  }

  const tagIdx = args.indexOf("--tag");
  if (tagIdx !== -1) {
    const t = args[tagIdx + 1];
    const hit = items.filter((i) => (i.tags || []).includes(t));
    console.log(JSON.stringify(hit, null, 2));
    return;
  }

  const kindIdx = args.indexOf("--kind");
  if (kindIdx !== -1) {
    const k = args[kindIdx + 1];
    const hit = items.filter((i) => i._kind === k);
    console.log(JSON.stringify(hit, null, 2));
    return;
  }

  const id = args.find((a) => !a.startsWith("--"));
  const hit = items.find((i) => i.id === id);
  if (!hit) {
    console.error(JSON.stringify({ error: "not_found", id, hint: "node query.mjs --list" }));
    process.exit(1);
  }
  console.log(JSON.stringify(hit, null, 2));
}

main();
