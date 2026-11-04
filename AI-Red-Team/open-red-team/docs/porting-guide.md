# Porting Guide

**Languages:** English (base) · [한국어](ko/porting-guide.md) · [日本語](ja/porting-guide.md) · [中文](zh/porting-guide.md)

Rules and procedure for porting claude-red skills (SKILL.md) into model-agnostic skills.

## Porting order

```
Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security
       ↓ (full library extension)
Active Directory → Auth & Identity → Wireless → Mobile → IoT & Embedded →
Exploit Development → Fuzzing & Vuln Research → Reconnaissance →
Container & Kubernetes → CI/CD & Pipeline → Cryptography →
Privilege Escalation → Post-Exploitation → Forensics & C2 →
Supply Chain → Social Engineering → Network Attacks → Utility
```

All 23 categories (79 skills) are complete.

## Conversion rules

### 1. Frontmatter extension

Keep the original frontmatter (`name`, `description`) and add the following fields.

| Added field | Rule |
|-------------|------|
| `triggers` | 6–14 keywords that trigger the skill. Lowercase, include synonyms/tool names/attack names, English + Korean. Regex in `/.../` form |
| `category` | Porting category (matches the source directory) |
| `model_note` | (Optional) model-specific notes |
| `source` | `https://github.com/SnailSploit/Claude-Red (MIT)` |

### 2. Removing Claude dependencies

- "Claude Code", "Claude.ai", "claude-skills.json", "Claude Skills system" → model-neutral wording
- e.g. `cat SKILL.md | claude --system-file -` → middleware `--skills` flag usage
- Anthropic API/model mentions → generalized for OpenAI-compatible providers

### 3. Body (markdown) preservation

- The methodology body is kept as-is (techniques are model-agnostic)
- Tool commands are kept (Kali/security tooling is platform-agnostic)
- Prompt payload sections are kept (they target the *system under test*, not the operator model)

### 4. Legacy-format handling

Some upstream skills have no YAML frontmatter; they use `# SKILL:`, `## Metadata`,
`## Description`, `## Trigger Phrases`, `## Instructions for Claude` sections.
`scripts/fetch-skills.ts` detects both formats and converts:

- `## Description` → frontmatter `description`
- `## Metadata` / `## Trigger Phrases` → dropped (replaced by generated frontmatter)
- `## Instructions for Claude` → `## Instructions`

### 5. Verification checklist

- [ ] Valid YAML frontmatter (name/description/triggers/category)
- [ ] ≥ 6 trigger keywords per skill
- [ ] No Claude-specific wording in the body (`grep -ri claude` — only the `source` field)
- [ ] `description` ≤ 200 chars (index injection cost)

## Automation

```bash
# Fetch all 79 skills from upstream claude-red and convert
npm run fetch:skills
```

`scripts/fetch-skills.ts`:

1. Downloads each SKILL.md from GitHub raw
2. Parses frontmatter → auto-generates `triggers`/`category`/`source`
3. Replaces Claude-specific wording in the body (regex rule table)
4. Writes to `skills/<category>/<name>/SKILL.md`
