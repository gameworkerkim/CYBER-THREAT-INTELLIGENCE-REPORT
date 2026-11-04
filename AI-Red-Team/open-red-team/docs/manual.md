# Open AI Red Team — User Manual

**Languages:** English (base) · [한국어](ko/manual.md) · [日本語](ja/manual.md) · [中文](zh/manual.md)

## 1. Installation

Requirements: Node.js ≥ 18.18, npm.

```bash
git clone <this-repository>
cd open-red-team
npm install
npm run build
cp .env.example .env
```

## 2. Configuration

Edit `.env` — all settings are environment variables.

| Variable | Default | Description |
|----------|---------|-------------|
| `ORT_PROVIDER` | `deepseek` | Default provider: `deepseek` \| `glm` \| `openweight` |
| `ORT_SKILLS_DIR` | `./skills` | Directory containing ported skills |
| `ORT_AUTO_LOAD` | `on` | Trigger-based automatic skill loading |
| `ORT_MAX_SKILLS` | `3` | Max skills auto-loaded per turn |
| `ORT_INCLUDE_INDEX` | `on` | Include skill descriptions in system prompt |
| `DEEPSEEK_API_KEY` | — | DeepSeek API key |
| `DEEPSEEK_MODEL` | `deepseek-chat` | DeepSeek model |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeek endpoint |
| `GLM_API_KEY` | — | Zhipu BigModel API key |
| `GLM_MODEL` | `glm-4-plus` | GLM model |
| `GLM_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` | GLM endpoint |
| `OPENWEIGHT_BASE_URL` | `http://localhost:11434/v1` | Ollama/vLLM/LM Studio endpoint |
| `OPENWEIGHT_MODEL` | `qwen2.5:32b` | Local model name |
| `OPENWEIGHT_API_KEY` | `ollama` | Dummy key (Ollama ignores it) |

## 3. Providers

### DeepSeek

```bash
# platform.deepseek.com → API Keys
export DEEPSEEK_API_KEY=sk-...
npx ort chat --provider deepseek
```

### GLM (Zhipu BigModel)

```bash
# open.bigmodel.cn → API Keys
export GLM_API_KEY=...
npx ort chat --provider glm --model glm-4-flash
```

### Open-weight (Ollama)

```bash
ollama pull qwen2.5:32b
ollama serve
# OPENWEIGHT_BASE_URL=http://localhost:11434/v1 (default)
npx ort chat --provider openweight --model qwen2.5:32b
```

### vLLM / LM Studio

Any OpenAI-compatible server works — point `OPENWEIGHT_BASE_URL` at its `/v1` endpoint.
LM Studio exposes it at `http://localhost:1234/v1`. For uncensored GGUF labs (testing where
web-model censorship and default safety alignment get in the way), see the
[Uncensored Open-Weight Models guide](uncensored-models.md). ⚠️ Isolated, authorized
environments only.

## 4. CLI Reference

### `ort chat` — interactive session

```
npx ort chat [--provider <p>] [--model <m>] [--skills <s1,s2>]

In-session commands:
  /skills        list all skills
  /reset         clear conversation history
  /exit          quit
In-message directives:
  /use <skill>   force-load a skill for the current turn
```

### `ort ask` — single-turn query

```
npx ort ask "How do I test for SQL injection?" --provider deepseek
```

### `ort skills` — skill inspection

```
npx ort skills list             # all skills (name, category, description)
npx ort skills show <name>      # full skill body
```

## 5. Library API

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",          // or "glm" | "openweight"
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
  autoLoad: true,                // trigger-based loading
  maxSkills: 3,
  includeIndex: true,
});

await ort.init();                // load skills from disk
ort.listSkills();                // [{frontmatter, body, path}]

const result = await ort.chat("SQL 인젝션 테스트 방법", {
  skills: ["offensive-sqli"],    // force-load
  onDelta: (d) => process.stdout.write(d),  // streaming
});
// result: { content, matchedSkills, provider, model }

ort.reset();                     // clear history
```

## 6. Skill System

Each skill is a `SKILL.md` with extended frontmatter:

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sql 인젝션"
category: web
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---
```

- **Progressive disclosure** — only descriptions stay in the system prompt (index);
  full skill bodies load when triggers match.
- **Triggers** — keywords (English + Korean) and `/regex/` patterns.
- **Explicit loading** — `/use offensive-sqli` in a message or `--skills` flag.

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `401` / auth error | Check the API key env var for your provider |
| Skills not loading | Verify `ORT_SKILLS_DIR`; run `npx ort skills list` |
| No skill matched | Use `/use <skill>` or add keywords to the skill's `triggers` |
| Small local model ignores skills | `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off`, use ≥ 32B models |
| Ollama context overflow | Increase `num_ctx` in Ollama settings |

## 9. Web Dashboard

A browser-based management dashboard for multi-operator, audited operations.

```bash
npx ort dashboard                          # http://localhost:8081
ORT_DASHBOARD_TOKEN=secret npx ort dashboard   # bearer-token protected
```

| Tab | Function |
|-----|----------|
| Chat | Streaming chat with auto-loaded skills shown as chips |
| Skills | Search/filter all 79 skills by name, category, or trigger; view full bodies |
| Audit | Recent interactions from the JSONL audit log |
| Config | Read-only configuration with masked keys, scope and auth status |

| Chat | Skills |
|------|--------|
| ![Chat](../assets/screenshots/dashboard-chat.png) | ![Skills](../assets/screenshots/dashboard-skills.png) |
| **Audit** | **Config** |
| ![Audit](../assets/screenshots/dashboard-audit.png) | ![Config](../assets/screenshots/dashboard-config.png) |

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `ORT_DASHBOARD_PORT` | `8081` | Listen port |
| `ORT_DASHBOARD_TOKEN` | *(empty)* | Bearer token for `/api/*`. Empty = unauthenticated (dev only) |
| `ORT_OIDC_ISSUER` | *(empty)* | Keycloak/OIDC issuer — when set, API requires a valid OIDC access token (takes precedence over the static token) |
| `ORT_OIDC_AUDIENCE` | *(empty)* | Expected `aud` claim |
| `ORT_AUDIT_LOG` | *(empty)* | JSONL audit log path (each chat completion appended: time, provider, model, matched skills, lengths, operator, scope) |

Docker:

```bash
docker compose --profile dashboard up -d   # http://localhost:8081
```

The frontend has no external assets (no CDN) and works fully offline — suitable for air-gapped
networks. For enterprise SSO, set `ORT_OIDC_ISSUER` to your Keycloak realm (the middleware
verifies RS256 JWTs against the realm's JWKS) or put Keycloak in front via a reverse proxy
and disable `ORT_DASHBOARD_TOKEN`.

## 10. Guardrails, Budget & Observability

### Context budget (prevents overflow)

Skill bodies are injected up to a token budget — models never receive a silently overflowing
context. Defaults per provider:

| Provider | Context limit | Per-skill budget |
|----------|---------------|------------------|
| deepseek | 64,000 | 16,000 |
| glm | 128,000 | 24,000 |
| openweight | 32,000 | 8,000 |

Override with `ORT_MAX_CONTEXT`, `ORT_SKILL_BUDGET`, `ORT_RESERVE_TOKENS`. Oversized skill bodies
are truncated section-by-section (marked with `… [truncated by token budget]`); skills marked
`index_only` in their frontmatter (e.g., the 554 KB `offensive-windows-boundaries`) are never
injected as a body — read them with `ort skills show <name>`.

### Engagement scope guardrails

| Variable | Effect |
|----------|--------|
| `ORT_SCOPE` | Declared engagement description — injected into the system prompt and recorded in audit/traces |
| `ORT_SCOPE_DOMAINS` | Comma-separated in-scope hosts/domains. Hosts outside this list are flagged and the operator is advised to confirm scope |
| `ORT_OPERATOR` | Identity recorded in audit entries and LangFuse traces |

### Observability

- **LangFuse**: set `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASEURL` — every
  chat is traced (input, output, provider, model, matched skills, scope, token counts).
- **Prometheus**: the dashboard exposes `/metrics` (`ort_chat_requests_total`,
  `ort_chat_duration_seconds_total`, `ort_http_requests_total`, …). The compose monitoring
  profile scrapes it automatically.

## 11. Security & Ethics

- Skills describe offensive methodology for **authorized testing only**.
- Never run against systems without written permission.
- For practice, use labs: PortSwigger Web Security Academy, DVWA, HackTheBox, TryHackMe.
