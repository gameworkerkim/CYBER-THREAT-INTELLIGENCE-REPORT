# LLM CISO — Development Roadmap & Feature Spec

> Evolution path: **SKIL → MCP → Self-Correction → Collaboration Bots**
> *Last updated: 2026-07-11*

[한국어](./ROADMAP.md) · [README](./README_EN.md)

---

## Strategy Summary

Extend and redefine the Phase 2 prompt system as **SKIL (Security Knowledge & Intelligence Layer)**, connect it to executable agents via MCP, add a feedback loop where MCP validates/corrects/reports LLM mistakes, then expand collaboration via Slack/Telegram and team sharing.

```
Phase 1 ✅        Phase 2 ✅              Phase 3 (In Progress)              Phase 4 (Planned)
Security Guide →  LLM CISO Prompts  →   SKIL → MCP → Correction → Bots  →  Unified Monitoring
& Checklist       (SKIL source)         + Dashboard UI                      (Wazuh/SIEM)
```

| Principle | Description |
|-----------|-------------|
| **Knowledge first** | Restructure prompts into MCP-queryable structured knowledge (SKIL) |
| **Executable** | LLM calls Prowler, Trivy, Gitleaks via MCP — not advice-only |
| **Correction loop** | MCP validates LLM diagnoses, recommendations, and commit mistakes |
| **Collaboration later** | Attach Slack/Telegram/team sharing after SKIL+MCP+correction stabilize |

---

## Phase Status

| Phase | Status | Artifacts |
|-------|--------|-----------|
| **1** Security guide & checklist | ✅ Done | `STARTUP_SECURITY_GUIDE_KR/EN.md` |
| **2** LLM CISO persona & prompts | ✅ Done | `LLM_CISO_PROMPT_KR/EN.md` (SKIL source) |
| **3** SKIL · MCP · Dashboard · Bots | 🔄 In progress | This roadmap M0–M5 |
| **4** Unified monitoring (SIEM/XDR) | 📋 Planned | Wazuh etc. via MCP |

---

## Phase 3 Milestones

### M0 — SKIL Definition & Structuring *(In progress — skeleton done)*

**Seed (2026-07-11):** 35 IDs (controls/policies/playbooks), `query.mjs`, 6 skills with `SYSTEM_PROMPT.md` for Claude/ChatGPT/Ollama. Full guide migration still ongoing.

**Acceptance:** `node skil/query.mjs control:aws-iam-mfa` returns control + remediation + legalBasis. MCP wiring is M1.

---

### M1 — MCP Server Prototype

**Priority tools:** SKIL query (P0) → Gitleaks + Trivy (P1) → Prowler (P2) → Semgrep (P3) → Wazuh (P4 / Phase 4).

**Acceptance:** One successful SKIL lookup + Gitleaks scan via MCP from Cursor/Claude.

---

### M2 — Self-Correction Loop

| Level | Type | MCP response |
|-------|------|--------------|
| L1 | Format / hallucination | Cross-check SKIL → correction |
| L2 | Policy violation | Contrast with scanner → warn/block |
| L3 | Secrets / commits | pre-commit Gitleaks → block + report |
| L4 | Compliance gap | Policy match → compliance report |

Auto-apply is **OFF by default** — report and suggest first; apply only with explicit approval.

---

### M3 — Dashboard Web UI

Scoreboard, MCP-backed assessments, remediation tracker, compliance scorecard, LLM provider selector, correction report view.

---

### M4 — Notifications & Collaboration

Slack Bot, Telegram Bot, Email (Resend), team sharing with comments/status, RBAC (Owner / Security Lead / Member / Viewer).

---

### M5 — Production Hardening

Auth, multi-tenancy, audit logs, rate limits, hybrid LLM defaults (sensitive → Ollama).

---

## Recommended Execution Order

```
1. SKIL structuring (+ Cursor Skill skeletons)
2. MCP server MVP (SKIL + Gitleaks/Trivy)
3. Self-correction loop (validate → report → optional fix)
4. Dashboard UI (consume MCP results)
5. Slack / Telegram / team sharing (RBAC)
6. Phase 4 SIEM & real-time monitoring
```

---

## Target Directory Layout (Phase 3)

```
Startup_Security_Guide/
├── ROADMAP.md / ROADMAP_EN.md
├── skil/          # M0
├── mcp/           # M1
├── skills/        # Cursor Agent Skills
└── hooks/         # M2 pre-commit templates
```

---

## Related Documents

- [README_EN.md](./README_EN.md)
- [STARTUP_SECURITY_GUIDE_EN.md](./STARTUP_SECURITY_GUIDE_EN.md)
- [LLM_CISO_PROMPT_EN.md](./LLM_CISO_PROMPT_EN.md)
- [LLM_CISO_DASHBOARD_EN.md](./LLM_CISO_DASHBOARD_EN.md)

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) · CC BY-NC-SA 4.0 · 2026-07-11
