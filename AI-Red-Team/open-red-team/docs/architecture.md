# Architecture

**Languages:** English (base) · [한국어](ko/architecture.md) · [日本語](ja/architecture.md) · [中文](zh/architecture.md)

## Overview

The Open Red Team middleware reproduces the Claude Skills system (progressive disclosure + trigger-based
on-demand loading) for models that only expose OpenAI-compatible APIs (DeepSeek, GLM, open-weight).

## Components

```
┌─────────────────────────────────────────────────────────────┐
│                          CLI / Library                       │
│                    src/cli.ts  ·  src/index.ts               │
├─────────────────────────────────────────────────────────────┤
│  Skill Engine                      Provider Layer            │
│  ┌──────────────────────┐          ┌──────────────────┐     │
│  │ loader.ts            │          │ base.ts          │     │
│  │  - SKILL.md parsing  │          │  - OpenAI-compat  │     │
│  │  - frontmatter/body  │          │    req/streaming  │     │
│  ├──────────────────────┤          ├──────────────────┤     │
│  │ trigger.ts           │          │ deepseek.ts      │     │
│  │  - keyword/regex     │          │ glm.ts           │     │
│  │  - scoring/ranking   │          │ openweight.ts    │     │
│  ├──────────────────────┤          │  (Ollama/vLLM/   │     │
│  │ inject.ts            │          │   LM Studio, …)  │     │
│  │  - system prompt     │          └──────────────────┘     │
│  │    assembly          │                                   │
│  └──────────────────────┘                                   │
├─────────────────────────────────────────────────────────────┤
│                     skills/ (ported SKILL.md)                │
└─────────────────────────────────────────────────────────────┘
```

## Data flow (one turn)

```
User input
   │
   ▼
1. Trigger matching ──────────► Matched skills (by score, capped at maxSkills)
   │
   ▼
2. System prompt assembly
   │  ├─ Base prompt (operator persona, rules of engagement)
   │  ├─ Skill index (every skill: name + description + trigger hints)
   │  └─ Selected skill bodies (full SKILL.md body)
   ▼
3. Provider call (OpenAI-compatible chat.completions)
   │
   ▼
4. Response streaming → user
```

## Skill format

Ported skills keep the original `SKILL.md` structure and extend the frontmatter.

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sqli"
  - "sqlmap"
  - "sql 인젝션"
category: web
model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---

# SQL Injection — Offensive Testing Methodology
...
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier (matches directory name) |
| `description` | Yes | Summary always injected into the index (kept short, ≤ 200 chars) |
| `triggers` | Yes | Auto-load keywords / regex (`/regex/` form), English + Korean |
| `category` | Yes | Porting category (web, infrastructure, api, cloud, ai, wireless, …) |
| `model_note` | No | Model-specific notes |
| `source` | No | Original source (attribution) |

## Progressive disclosure

The core principle of Claude Skills — **skill bodies enter the context only when needed**:

1. **Index (description) is always injected** — 79 skills × ~150 chars ≈ 3K tokens.
2. **Bodies load only on trigger match** — capped at `ORT_MAX_SKILLS` (default 3).
3. **Explicit loading** — `/use offensive-sqli` or the `--skills` flag.

## Provider abstraction

All targets expose OpenAI-compatible APIs, so a single `BaseProvider` (openai SDK) is used.

| Provider | baseURL | Auth | Notes |
|----------|---------|------|-------|
| DeepSeek | `https://api.deepseek.com/v1` | Bearer API key | `deepseek-reasoner` returns `reasoning_content` separately |
| GLM | `https://open.bigmodel.cn/api/paas/v4` | Bearer API key | Some models return a `reasoning_content` field |
| Open-weight | Ollama `http://localhost:11434/v1`, vLLM, … | any/dummy | Context length and format vary per model |

## Context budget

- Average skill body is 8–15K tokens → full index + up to 3 bodies ≈ 50K tokens.
- DeepSeek 64K–128K, GLM-4 128K, Qwen2.5 32K+ → workable with default settings.
- For small open-weight models: `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off` recommended.
