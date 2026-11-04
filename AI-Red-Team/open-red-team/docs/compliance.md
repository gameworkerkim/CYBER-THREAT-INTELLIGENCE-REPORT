# Compliance Controls

**Languages:** English (base) · [한국어](ko/compliance.md) · [日本語](ja/compliance.md) · [中文](zh/compliance.md)

This table separates what **this system does in code** from what **the operator/organization must
still do**. Open AI Red Team is methodology-injection middleware for authorized engagements —
it is not a compliance certification and does not, by itself, satisfy ISMS-P, financial security
regulations, PCI-DSS, or NIST.

## Implemented controls (enforced in code)

| Control ID | Function | Enforcement point |
|------------|----------|-------------------|
| SCOPE-1 | Out-of-scope hosts/IPs are refused **before any model call** | `src/safety.ts` + `src/index.ts` (`decision: deny`, provider call count = 0) |
| SCOPE-2 | Declared engagement scope injected into the system prompt and recorded in audit/traces | `ORT_SCOPE` / `ORT_SCOPE_DOMAINS` |
| SCOPE-3 | Dashboard refuses to start without a declared scope | `ORT_SCOPE_MODE=open` required for lab mode |
| AUTH-1 | Dashboard API closed by default: bearer token or OIDC mandatory | startup exits 1 without auth unless `ORT_ALLOW_ANONYMOUS=1` |
| AUTH-2 | OIDC (Keycloak) RS256/JWKS verification; sessions are bound to the token `sub` | `src/dashboard/oidc.ts`, `X-Ort-Session` |
| AUTH-3 | `/metrics` is authenticated (`ORT_METRICS_TOKEN` or the dashboard auth) | `src/dashboard/server.ts` |
| SESS-1 | Per-operator conversation isolation (in-memory sessions, LRU cap, idle eviction) | `src/sessions.ts` |
| AUDIT-1 | JSONL audit entries: ts, sessionId, operator, decision, flaggedTargets, matchedSkills, prompt SHA-256 (no prompt plaintext) | `ORT_AUDIT_LOG` |
| AUDIT-2 | `ORT_AUDIT_REQUIRED=1` fails the request when the audit write fails | `src/dashboard/server.ts` |
| BUDGET-1 | Context budget: skill bodies truncated, history trimmed, oversized skills `index_only` | `src/skills/inject.ts`, `src/index.ts` |
| OBS-1 | Prometheus metrics (requests, latency, tokens, RSS) | `/metrics` |
| OBS-2 | LangFuse tracing — **off by default**; enabling exports full prompt/response text to LangFuse | `LANGFUSE_*` |

## Operator / organization responsibilities (not in code)

| Control ID | Responsibility | Applies to |
|------------|----------------|------------|
| ORG-1 | Network separation (망분리), transfer-zone malware scanning, offline media handling | organization |
| ORG-2 | Account provisioning and RBAC policy in Keycloak; operator identity management | organization |
| ORG-3 | Secret custody: API keys, Keycloak/DB passwords, signing keys (Cosign), token rotation | organization |
| ORG-4 | Audit log retention periods, protected storage, and review procedures | organization |
| ORG-5 | Image signing/scanning gates in Harbor (Trivy adapter, Cosign policies) | organization |
| ORG-6 | Engagement authorization records (rules of engagement, scope sign-off) | operator |
| ORG-7 | Model weight provenance and license review for imported GGUF/HF assets | organization |

## Mapping notes (informational)

- **ISMS-P / financial security regulations**: AUDIT-*, AUTH-*, ORG-1..5 support access-control and
  logging obligations, but the controls above are technical components — certification requires
  the organization's own procedures.
- **PCI-DSS**: relevant testing methodology lives in the skills (e.g., V5.3.4 references); this
  product does not process cardholder data.
- **NIST**: technique mapping follows MITRE ATT&CK references inside the skills; the product itself
  implements only the controls in the first table.

Any control **not listed in the implemented table** must be assumed to be an operator
responsibility. Do not claim this product satisfies it.
