# Changelog — Development Log

All notable changes to Open AI Red Team are recorded here.

## [0.5.0] — 2026-11-04

### Added
- **Scope enforcement (deny before call)** — out-of-scope hosts/IPs are refused in `chat()`
  with zero provider calls (`decision: deny`, fixed reply, SSE `denied` event); validated IP
  octet regex, version-string and filename false-positive filters; dashboard refuses to start
  without a declared scope unless `ORT_SCOPE_MODE=open`
- **Per-operator session isolation** — `SessionStore` (LRU cap, idle eviction), `X-Ort-Session`
  header, session-scoped reset, OIDC `sub` ownership (foreign session → 404), frontend
  `sessionStorage` support, `/api/session` introspection
- **History token budget** — conversation history trimmed oldest-first against
  `maxContext - reserve` with `[earlier turns omitted]` marker and `droppedTurns` reporting
  (CLI + SSE `done`)
- **Fail-closed auth & audit** — dashboard exits 1 without token/OIDC (`ORT_ALLOW_ANONYMOUS=1`
  for labs); `/metrics` requires `ORT_METRICS_TOKEN` or dashboard auth; `ORT_AUDIT_REQUIRED=1`
  fails requests when the audit write fails; audit fields now include sessionId, operator,
  decision, flaggedTargets and prompt SHA-256 (no prompt plaintext); LangFuse disclosure in
  Config tab and docs
- **PoC compose prepares the model** — `ollama-pull` one-shot (ort waits for it),
  healthcheck requires LLM backend `ok`, `vllm-preflight` fails fast with a clear message when
  weights are missing
- **Secrets & observability stack** — infra moved to `docker-compose.infra.yml` with required
  secrets (`${VAR:?}`), Keycloak realm import (`ort-dashboard` client + audience), Prometheus
  bearer-token scrape of `ort:8081/metrics`, Grafana dashboard provisioning; Loki removed
  (no collector shipped)
- **Tests: 63 across 12 files** — scope deny (provider call count = 0), session isolation,
  history trimming, provider streaming fallback + reasoning_content, OIDC verification
  (expiry/audience/signature), dashboard fail-closed startup / 401 / denied / audit-required,
  retrieval quality baseline (top-1 ≥ 0.85, top-3 ≥ 0.95 on 30 fixtures), README catalog
  consistency, CLI version match
- **CI** — docker build + Trivy scan gate added to the workflow

### Changed
- CLI version now reads `package.json` (was hardcoded 0.1.0)
- `compliance.md` (EN/KO/JA/ZH) separates code-enforced controls from operator responsibilities;
  README use-case sections link to it
- Product boundary documented: methodology-injection middleware, no host tool execution;
  roadmap marks the tool-execution loop `blocked`

### Removed
- Loki service/config (no log collector shipped with the stack)

## [Unreleased]

### Added
- **Local accounts (SQLite)** — `ORT_DB_PATH` database with users/settings tables
  (`better-sqlite3`); default **admin/admin** seeded on first start with a forced password
  change (`403 password change required` gate); HMAC-signed login tokens (12 h TTL,
  `ORT_AUTH_SECRET` env or persisted secret); `POST /api/auth/login`, `GET /api/auth/me`,
  `POST /api/auth/change-password`; auth priority OIDC > local > static token > anonymous
- **Dashboard runtime settings** — Settings tab + `GET/PUT /api/settings` (admin role):
  scope, domains, mode, operator, context budget, skill budget, reserve, maxSkills,
  includeIndex, autoLoad are applied live via a runtime store (DB > env > default);
  provider/model/API-key changes still require a restart
- Login screen + forced password-change modal in the dashboard UI
- Manual section "Review Findings & Verification Status" (EN/KO/JA/ZH):
  accumulated 4-round review findings with resolved status (P0/P1/P2) and the
  remaining known limitations (CI hosted-gate unexercised, vLLM/Keycloak live
  round-trip pending infra, dual-use image CMD, flaggedTargets in denial audit)
- **Uncensored open-weight model guide** (`docs/uncensored-models.md`, EN/KO/JA/ZH) —
  LM Studio + uncensored GGUF quantization setup (Q2_K/Q4_K_M/Q8_0), folder layout, vision
  `mmproj`, and direct integration with the `openweight` provider via
  `http://localhost:1234/v1`. Prominent warnings: isolated/offline environments,
  authorized scope only, quantization accuracy trade-offs.
- Model matrix & manual links to the new guide; README documentation index updated (4 languages)
- **Web management dashboard** (`ort dashboard`) for multi-operator, audited operations
  - Express API: `/api/health` (backend reachability), `/api/config` (masked keys),
    `/api/skills`, `/api/skills/:name`, `/api/chat` (SSE streaming), `/api/audit` (JSONL), `/api/reset`
  - Bearer-token auth (`ORT_DASHBOARD_TOKEN`) on `/api/*`
  - JSONL audit log (`ORT_AUDIT_LOG`) — compliance-friendly interaction records
  - Zero-build vanilla-JS frontend (Chat / Skills / Audit / Config tabs), no CDN — air-gap ready
  - Docker Compose `dashboard` profile (port 8081, read-only, audit volume)
- Deployment & operations tooling for air-gapped / on-premises environments

## [0.4.0] — 2026-11-04

### Added
- **Token budget engine** (`src/skills/inject.ts`) — model context limits (deepseek 64K /
  glm 128K / open-weight 32K, `ORT_MAX_CONTEXT`), per-skill body budgets (`ORT_SKILL_BUDGET`),
  section-aware truncation, `index_only` flag for oversized skills (auto-marked in sync script).
  Fixes context overflow: e.g. windows-boundaries (554 KB ≈ 138K tokens) is now index-only.
- **Test suite (vitest, 30 tests)** — loader / trigger / inject budget / config / safety;
  `npm test` + CI workflow for the subproject
- **Code-level safety guardrails** (`src/safety.ts`) — `ORT_SCOPE` engagement declaration
  injected into the prompt and audited; `ORT_SCOPE_DOMAINS` flags out-of-scope targets;
  `ORT_OPERATOR` recorded in audit/traces
- **Streaming fallback** — non-streaming retry when streaming fails; `reasoning_content`
  captured (DeepSeek reasoner / GLM) instead of discarded
- **Prometheus `/metrics`** on the dashboard (http/chat counters, durations, tokens, RSS)
- **OIDC (Keycloak) verification** for the dashboard API (`ORT_OIDC_ISSUER`,
  `ORT_OIDC_AUDIENCE`) — RS256 JWT + JWKS validation, replaces/augments the static token
- **LangFuse tracing** (`src/observability.ts`) — every chat is traced with input/output/
  metadata (provider, model, matched skills, scope, token counts) when
  `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY` are set
- **LICENSE** file (MIT + claude-red attribution)

### Changed
- Compose: `ort` now runs the dashboard server (daemon-friendly, healthcheck); interactive
  CLI moved to a `cli` profile; PoC defaults point at Ollama (11434/v1); vLLM `read_only`
  removed (needs writable cache); Loki added to the monitoring profile; Prometheus scrapes
  `ort:8081/metrics`
- Fixed npm bin path (`./dist/src/cli.js`) and package `files`/`main`/`types`
- `systemPrompt` custom option now actually wired into prompt assembly
- `scripts/fetch-skills.ts`: retry with backoff, rate limiting, code-fence-aware Claude
  replacement, description fallback, automatic `index_only` marking
  - `Dockerfile` — multi-stage, non-root user, read-only rootfs support, healthcheck
  - `docker-compose.yml` — 5-layer stack with profiles: `ort` (app), `serving` (vLLM),
    `poc` (Ollama), `auth` (Keycloak), `observability` (LangFuse), `monitoring` (Prometheus/Grafana)
  - `scripts/offline/export-images.sh` / `import-images.sh` — skopeo/crane (fallback: docker save/load)
    image transfer across network separation (망분리)
  - `scripts/offline/export-models.sh` — offline transfer of vLLM (Hugging Face) / Ollama model weights
  - `scripts/sbom/scan.sh` — Trivy CVE scan + SBOM (SPDX/CycloneDX) generation
  - `scripts/sbom/sign.sh` — Cosign image signing / verification
  - `deploy/monitoring/` — Prometheus scrape config (vLLM/Ollama metrics), Grafana datasource provisioning
- `docs/deployment.md` — 5-layer deployment architecture (offline transfer, registry security,
  LLM serving, red-team app hardening, auth/audit/monitoring) in EN/KO/JA/ZH

## [0.3.0] — 2026-11-04

### Changed
- Renamed project in all documentation from **Open Red Team** to **Open AI Red Team**
  (README ×4 languages, docs, CLI description, .env.example header, parent repo index)

## [0.2.0] — 2026-11-04

### Added
- Full port of the claude-red library: **79 skills / 23 categories**
  (Active Directory, Auth & Identity, Wireless, Mobile, IoT & Embedded, Exploit Development,
  Fuzzing & Vuln Research, Reconnaissance, Container & Kubernetes, CI/CD & Pipeline,
  Cryptography, Privilege Escalation, Post-Exploitation, Forensics & C2, Supply Chain,
  Social Engineering, Network Attacks, Utility)
- Korean + English trigger keywords for every skill; short-keyword word-boundary matching
- Multilingual documentation — English (base), Korean, Japanese, Chinese:
  README ×4, user manual `docs/manual.md` ×4
- README purpose sections: Claude Red replacement & extension, explicit features,
  LLM extension for Red Team, compliance use cases (public/financial institutions),
  cost reduction, internal information protection

### Changed
- English rewritten as the canonical base language of all docs

## [0.1.0] — 2026-11-04

### Added
- Initial release — middleware + first 27 ported skills (Web Application 16,
  Infrastructure & Red Team 7, API Security 2, Cloud 1, AI Security 1)
- OpenAI-compatible provider abstraction (DeepSeek / GLM / open-weight)
- Skill engine: SKILL.md loader, trigger matcher (keyword/regex + scoring),
  progressive disclosure system prompt assembly
- CLI: `ort chat` (interactive, `/use` directives), `ort ask`, `ort skills list|show`
- `scripts/fetch-skills.ts` — upstream sync with legacy & frontmatter format handling
- Docs: architecture, porting guide, model matrix, roadmap
