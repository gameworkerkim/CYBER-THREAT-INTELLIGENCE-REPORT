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
[Uncensored Open-Weight Models guide](uncensored-models.md). Isolated, authorized
environments only.

## 4. CLI Reference

### `ort chat` — interactive session

`ort` requires a global install (`npm i -g .`); otherwise run `node dist/src/cli.js` in place of `ort`.

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
| `ORT_DB_PATH` | `./data/ort.db` | SQLite database for local accounts and runtime settings |
| `ORT_AUTH_SECRET` | *(auto)* | HMAC secret for login tokens (generated and persisted in the DB when empty) |
| `ORT_DISABLE_LOCAL_AUTH` | `0` | `1` disables local accounts (OIDC/static-token only) |
| `ORT_DASHBOARD_TOKEN` | *(empty)* | Static bearer token (alternative to local accounts) |
| `ORT_OIDC_ISSUER` | *(empty)* | Keycloak/OIDC issuer — when set, API requires a valid OIDC access token (takes precedence) |
| `ORT_OIDC_AUDIENCE` | *(empty)* | Expected `aud` claim |
| `ORT_METRICS_TOKEN` | *(empty)* | Token for `/metrics` (falls back to dashboard auth when empty) |
| `ORT_AUDIT_LOG` | *(empty)* | JSONL audit log path (sessionId, operator, decision, matched skills, prompt SHA-256 — no prompt plaintext) |
| `ORT_AUDIT_REQUIRED` | `0` | `1` fails requests when the audit write fails |

### Local accounts (SQLite)

The dashboard seeds a default **admin / admin** account on first start and forces a password
change before any other API use (`403 password change required`). Login issues an HMAC-signed
token (12 h TTL) accepted as `Authorization: Bearer <token>`.

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | `{username, password}` → `{token, username, role, mustChangePassword}` |
| `GET /api/auth/me` | Current user (`username`, `role`, `mustChangePassword`) |
| `POST /api/auth/change-password` | `{currentPassword, newPassword}` (min 8 chars) |

Login protection: failed attempts per username+IP are rate-limited
(`ORT_LOGIN_MAX_ATTEMPTS` default 5, `ORT_LOGIN_LOCK_MS` default 5 min) with HTTP 429.
Login success/failure, password changes, and user management actions are written to the
audit log as `event: "auth"` records.

### User management (admin role)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/users` | List users (admin only) |
| `POST /api/users` | Create a user `{username, password, role}` — new users must change their password on first login |
| `PUT /api/users/:username/reset-password` | Reset to a temporary password (forces change on next login) |
| `DELETE /api/users/:username` | Delete a user (self-deletion is refused) |

### Audit log rotation

The JSONL audit log rotates automatically (single rotation to `<file>.1`) when it exceeds
`ORT_AUDIT_MAX_BYTES` (default 10 MiB). CLI chats are audited too when `ORT_AUDIT_LOG` is set.

### SQLite data management

- Database path: `ORT_DB_PATH` (default `./data/ort.db`; `/data/ort.db` in Docker with the
  `./data` volume mounted).
- **Backup**: copy the `.db` file while the server is stopped (WAL mode keeps `-wal`/`-shm`
  sidecar files next to it — back them up together).
- The DB stores scrypt password hashes, the auth signing secret and runtime settings —
  protect it like any credential store.
- First login is always **admin / admin**; the API stays locked (`403 password change
  required`) until the password is changed.

### Runtime settings (Settings tab)

Admins can change scope, budget and engine settings from the dashboard (Settings tab,
`GET/PUT /api/settings`). Database values override environment variables; an empty value falls
back to the env. Mutable keys: `ORT_SCOPE`, `ORT_SCOPE_DOMAINS`, `ORT_SCOPE_MODE`,
`ORT_OPERATOR`, `ORT_MAX_CONTEXT`, `ORT_SKILL_BUDGET`, `ORT_RESERVE_TOKENS`, `ORT_MAX_SKILLS`,
`ORT_INCLUDE_INDEX`, `ORT_AUTO_LOAD`. Provider/model/API-key changes still require a restart.

Sessions: the client sends `X-Ort-Session`; the server issues a session id in the first `session`
SSE event and returns it again in `done`/`denied`. Sessions are in-memory (LRU cap, idle eviction) —
**they do not survive a server restart** (disk persistence is out of scope for this release).

Docker:

```bash
docker compose up -d ort    # http://localhost:8081
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
| `ORT_SCOPE` | Declared engagement description — injected into the system prompt and recorded in audit/traces. Required for the dashboard (unless `ORT_SCOPE_MODE=open`) |
| `ORT_SCOPE_DOMAINS` | Comma-separated in-scope hosts/domains. Hosts outside this list are **refused before any model call** (SSE `denied`, CLI `decision: DENIED`) |
| `ORT_SCOPE_MODE` | `open` disables the domain check (local lab only) |
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

## 12. Review Findings & Verification Status

Accumulated review findings (4 rounds) and their current status.

### P0 — critical findings, resolved and measured

| # | Finding | Status |
|---|---------|--------|
| 1 | Full skill-body injection caused context overflow (single skill ~138K tokens) | Token budget engine + 6 oversized skills marked `index_only`; runtime prompt measured in the ~6-8K token range |
| 2 | No tests at all | vitest suite: 80 tests across 15 files (English + Korean retrieval baselines, HTTP/auth/session/safety) |
| 3 | App was CLI-only; `docker compose up -d` did not work | Express dashboard + `command: ["dashboard"]` in compose |
| 4 | No scope enforcement; everything reached the model | `decision: deny` returns before the provider call — verified with a call counter (0 calls) |
| 5 | Fail-open startup (no auth / no scope) | Both refuse to start with exit code 1 |

### P1 — reliability & operations, resolved

| # | Finding | Status |
|---|---------|--------|
| 6 | LangFuse audit not wired to code | `recordChat` tracing + JSONL audit with `promptSha256` (no prompt plaintext) |
| 7 | Keycloak (OIDC) not wired to code | OIDC middleware: discovery + JWKS + RS256 verification |
| 8 | Broken npm bin path (`npx ort` impossible) | Fixed to `dist/src/cli.js` |
| 9 | No LICENSE file | Added (MIT + claude-red attribution) |
| 10 | `reasoning_content` discarded; streaming hardcoded | Reasoning captured + non-streaming fallback |
| 11 | All secrets defaulted to `change-me` | Infra split into `docker-compose.infra.yml` with required `${VAR:?}` substitutions |
| 12 | PoC profile LLM defaults mismatched | Ollama defaults + `depends_on: ollama-pull` gating |
| 13 | Shared conversation history across operators | `SessionStore` (LRU + idle eviction) + OIDC `sub` ownership |
| 14 | Unbounded history growth | Per-turn token budget + `[earlier turns omitted]` marker |
| 15 | No retrieval-quality baseline | 30-query fixture suite with committed thresholds (top-1 ≥ 0.85, top-3 ≥ 0.95) |
| 16 | No login brute-force protection | Per username+IP lockout (`ORT_LOGIN_MAX_ATTEMPTS`, HTTP 429) + auth events audited |
| 17 | No user management | Admin API + Settings-tab UI: create / reset-password / delete (new users forced to change password) |
| 18 | Audit log grows unbounded; CLI un-audited | Rotation at `ORT_AUDIT_MAX_BYTES`; `ort chat`/`ask` write JSONL entries |
| 19 | No Korean retrieval baseline | 30 Korean fixtures: measured top-1 0.93 / top-3 1.00, thresholds 0.85/0.95 committed |

### P2 — polish & boundaries, resolved

- CLI version hardcoded (0.1.0) → loaded from `package.json`
- Dead metrics/route labels → counters and route labels cleaned up
- `compliance.md` / architecture control tables in 4 languages
- `index_only` skills show a "본문 미주입" badge in the Skills tab

### Known limitations (non-critical)

1. **CI workflow**: lives at the repository root `.github/workflows/open-red-team.yml`
   (GitHub only executes workflows there) with path filters for this subproject. Local runs are
   verified; the hosted gate itself has not been exercised.
2. **vLLM runtime / Keycloak OIDC round-trip**: code, compose and realm configuration are
   validated; live verification requires GPU/Docker infrastructure (not available in the
   review environment).
3. **Image default `CMD` is `chat`** (interactive); compose overrides it to `dashboard`.
   Intentional dual use.
4. **Denied requests record `flaggedTargets`** (hosts only, never prompt plaintext) in the
   audit log — informational by design.
