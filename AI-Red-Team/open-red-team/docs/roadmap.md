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
- [x] Scope guardrails (deny before model call), fail-closed startup
- [x] Multilingual documentation (EN base / KO / JA / ZH)
- [x] Test suite + retrieval quality baseline + CI
- [ ] Ollama `num_ctx` auto-expansion
- [ ] Embedding-based semantic matching (RAG) — optional replacement for keyword matching
- [x] Multi-turn tool execution loop (Kali integration) — **blocked**: out of scope for this
  release. Open AI Red Team is methodology-injection middleware for authorized engagements;
  it does not execute commands on the host. Revisit only after the P0 controls (scope denial,
  session isolation, history budget, fail-closed auth) remain stable.
