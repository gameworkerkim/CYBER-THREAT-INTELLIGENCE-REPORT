# Roadmap

**Languages:** English (base) · [한국어](ko/roadmap.md) · [日本語](ja/roadmap.md) · [中文](zh/roadmap.md)

## Porting status — complete

Porting order: **Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**,
followed by the remaining claude-red categories. All 79 skills across 23 categories are ported.

| Phase | Category | Skills | Status |
|-------|----------|-------:|--------|
| 1 | Web Application | 16 |  |
| 2 | Infrastructure & Red Team | 7 |  |
| 3 | API Security | 2 |  |
| 4 | Cloud | 1 |  |
| 5 | AI Security | 1 |  |
| 6 | Active Directory | 2 |  |
| 7 | Auth & Identity | 2 |  |
| 8 | Wireless | 14 |  |
| 9 | Mobile | 1 |  |
| 10 | IoT & Embedded | 1 |  |
| 11 | Exploit Development | 6 |  |
| 12 | Fuzzing & Vuln Research | 4 |  |
| 13 | Reconnaissance | 2 |  |
| 14 | Container & Kubernetes | 2 |  |
| 15 | CI/CD & Pipeline | 2 |  |
| 16 | Cryptography | 2 |  |
| 17 | Privilege Escalation | 2 |  |
| 18 | Post-Exploitation | 3 |  |
| 19 | Forensics & C2 | 2 |  |
| 20 | Supply Chain | 2 |  |
| 21 | Social Engineering | 2 |  |
| 22 | Network Attacks | 1 |  |
| 23 | Utility | 2 |  |
| — | **Total** | **79** |  |

## Middleware roadmap

- [x] OpenAI-compatible provider abstraction (DeepSeek/GLM/Ollama)
- [x] Skill loader + frontmatter parsing
- [x] Trigger engine (keyword/regex, scoring; English + Korean keywords)
- [x] Progressive disclosure (index always injected + bodies on demand)
- [x] CLI (`ort chat / ask / skills`)
- [x] Web dashboard (sessions, audit, OIDC, metrics)
- [x] Token budget engine (context limits, section truncation, index_only)
- [x] History token budget (oldest-first trimming, droppedTurns marker)
- [x] Session isolation per operator (SessionStore, X-Ort-Session, OIDC sub ownership)
- [x] Scope guardrails (deny before model call), fail-closed startup (exit 1)
- [x] Local accounts (SQLite): admin/admin forced password change, HMAC tokens
- [x] Dashboard runtime settings (scope/budget/engine live mutation, admin role)
- [x] Streaming fallback + reasoning_content capture
- [x] LangFuse tracing + Prometheus /metrics + JSONL audit (prompt SHA-256)
- [x] Deployment & operations: base/infra compose split, ollama-pull & vllm-preflight gating,
      required secrets, Keycloak realm, Grafana dashboards, offline transfer scripts (skopeo/
      crane), Trivy SBOM + Cosign signing
- [x] Test suite (73 tests) + retrieval quality baseline + CI (typecheck/build/test/docker build/scan)
- [x] Multilingual documentation (EN base / KO / JA / ZH) + compliance controls table
- [ ] Ollama `num_ctx` auto-expansion
- [ ] Embedding-based semantic matching (RAG) — optional replacement for keyword matching
- [x] Multi-turn tool execution loop (Kali integration) — **blocked**: out of scope for this
  release. Open AI Red Team is methodology-injection middleware for authorized engagements;
  it does not execute commands on the host. Revisit only after the P0 controls (scope denial,
  session isolation, history budget, fail-closed auth) remain stable.

## Planned extensions (evaluated proposals)

All items respect the product boundary: methodology injection, operator-controlled, no
autonomous execution.

| Priority | Item | Notes |
|----------|------|-------|
| High | Approval-based propose-execute bridge | The operator reviews and approves LLM-suggested commands; approved commands run in an **isolated sandbox** and results feed back to the model. Semi-automated, never autonomous |
| High | Skill-to-tool mapping registry | Per-skill metadata mapping to the tooling each skill requires (sqlmap, nmap, Burp Suite, …) — connects skills to real workflows |
| Medium | Methodology quality benchmark | LLM-as-a-Judge scoring of specificity, actionability, and context fit — a regression gate for middleware output quality |
| Medium | CI/CD red-team suggestion gate | GitHub Actions integration posting skill-based review suggestions as PR comments (suggestion only, no execution) |
| Low | Community skill marketplace | Reviewed community-contributed `SKILL.md` catalog for new attack methodologies |

## Pending live verification

- [ ] First hosted CI gate run (workflow exists at the repo root with path filters; local runs verified)
- [ ] Live vLLM serving verification (requires GPU infrastructure)
- [ ] Keycloak OIDC round-trip verification (realm import + dashboard token exchange)
- [ ] SQLite backup/restore drill (documented procedure, not yet exercised)

## Release history

| Version | Contents |
|---------|----------|
| 0.1.0 | Middleware + first 27 skills, provider abstraction, CLI, docs |
| 0.2.0 | Full claude-red port (79 skills / 23 categories), multilingual docs, user manual |
| 0.3.0 | Renamed to Open AI Red Team |
| 0.4.0 | Token budget, 30 tests, scope guardrails, LangFuse/OIDC/metrics, deployment tooling |
| 0.5.0 | P0 hardening: scope denial (0 calls), session isolation, history budget, fail-closed, PoC compose, required secrets, 63 tests, retrieval baseline, compliance doc |
| 0.6.0 | SQLite local accounts (admin/admin forced change), dashboard Settings tab, roadmap/docs update |
