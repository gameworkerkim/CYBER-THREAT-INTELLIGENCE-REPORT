# Changelog — Development Log

All notable changes to Open AI Red Team are recorded here.

## [Unreleased]

### Added
- **Web management dashboard** (`ort dashboard`) for multi-operator, audited operations
  - Express API: `/api/health` (backend reachability), `/api/config` (masked keys),
    `/api/skills`, `/api/skills/:name`, `/api/chat` (SSE streaming), `/api/audit` (JSONL), `/api/reset`
  - Bearer-token auth (`ORT_DASHBOARD_TOKEN`) on `/api/*`
  - JSONL audit log (`ORT_AUDIT_LOG`) — compliance-friendly interaction records
  - Zero-build vanilla-JS frontend (Chat / Skills / Audit / Config tabs), no CDN — air-gap ready
  - Docker Compose `dashboard` profile (port 8081, read-only, audit volume)
- Deployment & operations tooling for air-gapped / on-premises environments
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
