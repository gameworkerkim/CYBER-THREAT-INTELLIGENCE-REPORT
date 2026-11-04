# Open AI Red Team

**Model-agnostic offensive security skillset + middleware — the replacement and extension of Claude Red for DeepSeek, GLM, and open-weight models**

A full port of the [claude-red](https://github.com/SnailSploit/Claude-Red) skill library (MIT) that breaks the
Claude lock-in: the same red-team skills now run on DeepSeek, GLM (Zhipu), and open-weight models
(Ollama / vLLM / LM Studio) — in the cloud, on-premises, or fully air-gapped.

**Documentation languages:** English (base) · [한국어](README.ko.md) · [日本語](README.ja.md) · [中文](README.zh.md)

## Purpose — replacing and extending Claude Red

| Claude Red (original) | Open AI Red Team (this project) |
|-----------------------|------------------------------|
| Claude-only skills (`SKILL.md` for the Claude skills system) | Model-agnostic skills: same methodology on **DeepSeek, GLM, open-weight** |
| Bound to Anthropic API (data leaves your network) | **On-prem / air-gapped operation** — internal data never leaves the organization |
| Vendor pricing & retention | **Cost reduction** via open-weight models (zero per-token cost) and lower-cost APIs |
| Skills fixed to Claude's native skill system | **Extended**: trigger engine, bilingual triggers (EN/KO), explicit loading, full CLI |

## Key Features

- **79 ported skills, 23 categories** — complete claude-red library: Web, Infrastructure & Red Team,
  API Security, Cloud, AI Security, Active Directory, Wireless, Exploit Development, Fuzzing, and more
- **LLM extension for Red Team** — reproduces Claude Skills' progressive disclosure and trigger-based
  on-demand loading for any OpenAI-compatible model
- **Provider abstraction** — one interface for DeepSeek, GLM (Zhipu), and open-weight
  (Ollama / vLLM / LM Studio / llama.cpp)
- **Trigger engine** — keyword + regex matching with scoring, English and Korean trigger keywords
- **Explicit control** — `/use <skill>`, `--skills` flag, auto-load on/off, skill index on/off
- **CLI + library** — interactive `ort chat`, one-shot `ort ask`, skill inspection, TypeScript API
- **Web dashboard** — browser-based management console (streaming chat, skill browser, JSONL audit
  trail, masked config) for multi-operator, audited operations; CDN-free for air-gapped networks
- **Context budget engine** — model-aware token limits with section-wise skill truncation and
  `index_only` for oversized skills (no silent context overflow)
- **Safety guardrails** — declared engagement scope (`ORT_SCOPE`/`ORT_SCOPE_DOMAINS`) with
  out-of-scope target flagging, operator-attributed audit records
- **Compliance wiring** — Prometheus `/metrics`, OIDC (Keycloak) API auth, LangFuse tracing
- **Local accounts (SQLite)** — sign-in flow with HMAC tokens; default admin/admin forces a password
  change on first login; scope/budget/engine settings editable from the dashboard Settings tab
- **Multilingual documentation** — English (base), Korean, Japanese, Chinese
- **On-prem ready** — local models keep sensitive target data inside your environment

## Screenshots

| Dashboard — Chat | Dashboard — Skills |
|------------------|--------------------|
| ![Chat tab](assets/screenshots/dashboard-chat.png) | ![Skills tab](assets/screenshots/dashboard-skills.png) |
| **Dashboard — Audit** | **Dashboard — Config** |
| ![Audit tab](assets/screenshots/dashboard-audit.png) | ![Config tab](assets/screenshots/dashboard-config.png) |

## Components

| Directory | Contents |
|-----------|----------|
| `skills/` | Ported skills (model-agnostic `SKILL.md`) — trigger-based on-demand loading |
| `src/` | Middleware — provider abstraction (OpenAI-compatible), skill loader, trigger engine, CLI |
| `docs/` | Architecture, user manual, porting guide, model matrix, roadmap |
| `scripts/` | Skill sync/conversion tooling |

## Port Status — full claude-red library (79 skills, 23 categories)

| Category | Skills | Category | Skills |
|----------|-------:|----------|-------:|
| Web Application | 16 | Fuzzing & Vuln Research | 4 |
| Infrastructure & Red Team | 7 | Reconnaissance | 2 |
| API Security | 2 | Container & Kubernetes | 2 |
| Cloud | 1 | CI/CD & Pipeline | 2 |
| AI Security | 1 | Cryptography | 2 |
| Active Directory | 2 | Privilege Escalation | 2 |
| Auth & Identity | 2 | Post-Exploitation | 3 |
| Wireless | 14 | Forensics & C2 | 2 |
| Mobile | 1 | Supply Chain | 2 |
| IoT & Embedded | 1 | Social Engineering | 2 |
| Exploit Development | 6 | Network Attacks | 1 |
| Utility | 2 | Total | 79 |

## Quickstart

```bash
npm install
npm run build
cp .env.example .env   # set provider API keys
node dist/src/cli.js chat          # interactive session (or: npm i -g . → ort chat)
node dist/src/cli.js dashboard     # web dashboard (http://localhost:8081)
npm test                           # run the test suite
```

### Supported providers

| Provider | Endpoint | Example models |
|----------|----------|----------------|
| `deepseek` | `https://api.deepseek.com/v1` (OpenAI-compatible) | `deepseek-chat`, `deepseek-reasoner` |
| `glm` | `https://open.bigmodel.cn/api/paas/v4` (OpenAI-compatible) | `glm-4-plus`, `glm-4-flash` |
| `openweight` | Ollama / vLLM / LM Studio (OpenAI-compatible `/v1`) | `qwen2.5:32b`, `deepseek-r1:32b` |

## Usage

### CLI

`ort` requires a global install (`npm i -g .`) — otherwise run `node dist/src/cli.js` directly.

```bash
npx ort chat --provider deepseek --model deepseek-chat   # interactive, auto skill loading
npx ort chat --skills offensive-sqli --provider glm      # force-load skills
npx ort skills list                                      # list all skills
npx ort skills show offensive-sqli                       # print a skill body
npx ort ask "How do I test SQLi on this login form?"     # single-turn query
npx ort dashboard                                        # web dashboard (http://localhost:8081)
```

### Library

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
});

const reply = await ort.chat("How do I test SQL injection?");
console.log(reply);
```

## Use Cases

### Public institutions & financial institutions — compliance-driven

- Internal red-team exercises and self-assessments mapped to regulatory frameworks
  (e.g., ISMS-P, financial security regulations, PCI-DSS, NIST) without sending
  **internal system information to foreign cloud APIs**
- Security review of e-government / financial services under strict data-governance rules

> See [Compliance Controls](docs/compliance.md) for exactly which controls the code enforces and
> which remain operator/organization responsibilities.

### Enterprises — internal security operations

- Security team training, CTF prep, authorized pentest planning, and day-to-day
  vulnerability triage with an operator-grade methodology library
- On-prem operation so proprietary architecture, source code, and target details stay inside the company

### LLM extension for Red Team

- Turn any OpenAI-compatible model into a context-aware red-team operator:
  skill index + on-demand methodology injection + conversation history
- Mix and match: sensitive engagements on local models, high-volume work on cloud APIs

## Cost & Data Protection

### Cost reduction

| Option | Per-token cost | Notes |
|--------|----------------|-------|
| Claude (original) | Highest tier | Skills were Claude-only |
| DeepSeek / GLM APIs | Low-cost APIs | Same skill content, fraction of the cost |
| Open-weight (Ollama/vLLM) | **Zero marginal cost** | Run on existing GPU/hardware |

### Internal information protection (공공기관 · 금융기관 · 기업)

- **No data leaves the organization** when using the `openweight` provider — target details,
  findings, and methodology stay on-premises or air-gapped
- No third-party retention of prompts or security findings
- Enterprise-friendly: works behind proxies, in isolated networks, and in offline labs

## How it works

1. **Skill index injection** — every skill's `name` + `description` is injected into the system prompt
   (reproduces Claude Skills progressive disclosure; minimal context cost).
2. **Trigger matching** — user input is matched against each skill's `triggers` (keywords/regex, English + Korean),
   and the top N skill bodies are injected into the system prompt.
3. **Model call** — the request is sent to the selected provider via its OpenAI-compatible API.

**Product boundary**: this release is methodology-injection middleware for authorized engagements.
It does not execute commands on the host and ships no tool-execution agent loop (see
[Roadmap](docs/roadmap.md)). Compliance-relevant controls and the split between what the code
enforces and what the operator must do are documented in [Compliance Controls](docs/compliance.md).

## Deployment & Operations (air-gapped / on-premises)

Financial, public, and enterprise deployments (망분리 / network separation) are covered by a
5-layer architecture: offline transfer (skopeo/crane) → registry security (Harbor + Trivy + Cosign)
→ LLM serving (vLLM / Ollama) → hardened app container (non-root, read-only, limits)
→ auth & audit (Keycloak + LangFuse + Prometheus/Grafana).

```bash
docker build -t open-ai-red-team:latest .       # hardened image (incl. SQLite)
docker compose --profile poc up -d               # PoC: app + Ollama
docker compose --profile serving up -d           # production: app + vLLM
./scripts/sbom/scan.sh open-ai-red-team:latest   # CVE scan + SBOM
./scripts/offline/export-images.sh               # air-gap transfer
```

The dashboard persists local accounts and settings in SQLite at `/data/ort.db`
(volume `./data`). First login: **admin / admin** with a forced password change.

See [Deployment & Operations Guide](docs/deployment.md).

## Documentation

- [User Manual](docs/manual.md) — installation, providers, CLI, troubleshooting
- [Architecture](docs/architecture.md) — middleware design and data flow
- [Porting Guide](docs/porting-guide.md) — Claude skill → model-agnostic conversion rules
- [Model Matrix](docs/model-matrix.md) — DeepSeek/GLM/open-weight characteristics and constraints
- [Uncensored Open-Weight Models](docs/uncensored-models.md) — LM Studio + uncensored GGUF lab guide
- [Compliance Controls](docs/compliance.md) — what the code enforces vs. operator responsibilities
- [Roadmap](docs/roadmap.md) — porting phases and middleware plans

## Verification Status

Accumulated review findings (4 rounds) and their current status. Details: [Manual — Review Findings & Verification Status](docs/manual.md).

### P0 — critical findings, resolved and measured

| # | Finding | Status |
|---|---------|--------|
| 1 | Full skill-body injection → context overflow (single skill ~138K tokens) | Token budget engine + 6 oversized skills `index_only`; runtime prompt measured in the ~6-8K token range |
| 2 | No tests | vitest suite: 63 tests across 12 files |
| 3 | CLI-only app; `up -d` broken | Express dashboard + `command: ["dashboard"]` |
| 4 | No scope enforcement | `deny` returns before the provider call — counter-verified 0 calls |
| 5 | Fail-open startup (no auth / no scope) | Both refuse to start with exit code 1 |

### P1 — reliability & operations, resolved

| # | Finding | Status |
|---|---------|--------|
| 6 | LangFuse audit not wired | `recordChat` tracing + JSONL audit with `promptSha256` (no plaintext) |
| 7 | Keycloak (OIDC) not wired | OIDC middleware: discovery + JWKS + RS256 |
| 8 | Broken npm bin (`npx ort` impossible) | Fixed to `dist/src/cli.js` |
| 9 | No LICENSE | Added (MIT + claude-red attribution) |
| 10 | `reasoning_content` discarded; stream-only | Reasoning captured + non-stream fallback |
| 11 | All secrets `change-me` | `docker-compose.infra.yml` with required `${VAR:?}` |
| 12 | PoC LLM defaults mismatched | Ollama defaults + `ollama-pull` gating |
| 13 | Shared history across operators | `SessionStore` (LRU) + OIDC `sub` ownership |
| 14 | Unbounded history | Turn budget + `[earlier turns omitted]` marker |
| 15 | No retrieval baseline | 30 fixtures, thresholds top-1 ≥ 0.85 / top-3 ≥ 0.95 |

### P2 — polish & boundaries, resolved

CLI version loaded from `package.json` · dead metrics/route labels cleaned · compliance/architecture
control tables in 4 languages · `index_only` badge in the Skills tab.

### Known limitations (non-critical)

1. CI workflow lives at the repository root (path-filtered); local runs verified, hosted gate not yet exercised.
2. vLLM runtime and Keycloak OIDC round-trip are code/config-validated; live verification needs GPU/Docker infra.
3. Image default `CMD` is `chat`; compose overrides it to `dashboard` (intentional dual use).
4. Denied requests record `flaggedTargets` (hosts only — never prompt plaintext) in the audit log.

## Releases

| Version | Contents |
|---------|----------|
| 0.1.0 | Middleware + first 27 skills, provider abstraction, CLI, docs |
| 0.2.0 | Full claude-red port (79 skills / 23 categories), multilingual docs, manual |
| 0.3.0 | Renamed to Open AI Red Team |
| 0.4.0 | Token budget, tests, scope guardrails, LangFuse/OIDC/metrics, deployment tooling |
| 0.5.0 | Scope denial (0 calls), session isolation, history budget, fail-closed, PoC compose, required secrets, retrieval baseline |
| 0.6.0 | SQLite local accounts (admin/admin forced change), dashboard Settings tab |

## License

MIT. Original skills: [SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red) (MIT) — each skill's
frontmatter carries a `source` attribution field.

> Use only in authorized environments (penetration testing, bug bounty in scope, security research, CTF).
