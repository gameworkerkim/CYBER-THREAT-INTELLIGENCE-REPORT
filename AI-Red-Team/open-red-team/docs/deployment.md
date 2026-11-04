# Deployment & Operations — Air-gapped / On-premises

**Languages:** English (base) · [한국어](ko/deployment.md) · [日本語](ja/deployment.md) · [中文](zh/deployment.md)

This guide describes how to deploy Open AI Red Team in financial, public, and enterprise environments,
maximizing its air-gapped and on-premises capabilities while satisfying Korean regulatory requirements
(network separation / 망분리, electronic financial supervisory regulations, etc.).

## Recommended architecture — 5 layers

```
① Offline transfer layer     ② Registry & image security layer     ③ LLM serving layer
   (internet zone)               (isolated network)                   (internal network)
┌──────────────────┐   ┌──────────────────────────────┐   ┌───────────────────────┐
│ skopeo / crane   │   │ Harbor (private registry)    │   │ vLLM (production)     │
│ docker save/load │──►│ Trivy (CVE + SBOM)           │──►│ Ollama (PoC)          │
│ model weights    │   │ Cosign (sign/verify)         │   │ OpenAI-compatible /v1 │
└──────────────────┘   └──────────────────────────────┘   └───────────┬───────────┘
                                                                       │
④ Red-team application layer       ⑤ Auth / audit / monitoring layer  │
┌──────────────────────────────┐   ┌──────────────────────────────┐   │
│ ort (Open AI Red Team)       │◄──┤ Keycloak (OIDC, SSO, RBAC)   │◄──┘
│ non-root / read-only / limits│   │ LangFuse (LLM audit)         │
└──────────────────────────────┘   │ Prometheus + Grafana + Loki  │
                                   └──────────────────────────────┘
```

---

## Layer 1 — Offline transfer (network separation)

In a 망분리 environment, all assets (LLM weights, Docker images, packages) must be identified and
downloaded in the internet zone, **malware-scanned**, and then carried into the internal network.

### Image export (internet zone)

```bash
# skopeo (no Docker daemon needed) or crane or docker save — see scripts/offline/
./scripts/offline/export-images.sh
# custom list: IMAGES="harbor.example.com/repo/app:v1 ..." ./scripts/offline/export-images.sh
```

Produces `artifacts/images/*.tar` with SHA-256 checksums. Scan these files with the
organization's antivirus/malware solution **before** transfer (금융보안원 guidance).

### Image import (isolated network)

```bash
./scripts/offline/import-images.sh
# push into internal Harbor:
HARBOR=harbor.internal.example.com/open-red-team ./scripts/offline/import-images.sh
```

### Model weights

```bash
# vLLM format (Hugging Face)
MODEL_ID=Qwen/Qwen2.5-32B-Instruct ./scripts/offline/export-models.sh
# Ollama format (PoC)
MODE=ollama OLLAMA_MODEL=qwen2.5:32b ./scripts/offline/export-models.sh
```

### Harbor replication (alternative to tar files)

Configure an internet-zone Harbor with a **replication rule** to the internal Harbor. Requires an
approved cross-zone transfer path and audit logging of every replicated artifact.

---

## Layer 2 — Container security & private registry

Vulnerability scanning and SBOM generation are effectively mandatory in financial/public institutions.

| Tool | Role |
|------|------|
| **Harbor** | De-facto standard on-prem private registry. Integrates Trivy as a scanner adapter: automatic scans on push and policy-based pull blocking |
| **Trivy** | Scans OS packages, language dependencies, IaC configs, and secrets. Generates SBOM (SPDX/CycloneDX) for supply-chain compliance |
| **Cosign** | Signs and verifies images (Sigstore). Harbor can block unsigned images |

### Scan + SBOM

```bash
# fails on HIGH/CRITICAL findings, emits SPDX + CycloneDX SBOMs
./scripts/sbom/scan.sh open-ai-red-team:latest artifacts/sbom
```

### Sign + verify

```bash
./scripts/sbom/sign.sh open-ai-red-team:latest          # creates cosign.key, signs
./scripts/sbom/sign.sh open-ai-red-team:latest --verify # verifies against cosign.pub
```

### Harbor setup (summary)

1. Install Harbor in the internal network (offline installer).
2. Project → **Configuration**: enable "Prevent vulnerable images from running" (Trivy adapter).
3. Robot accounts with pull-only rights for deployment nodes.
4. (Optional) Cosign integration: accept only signed images via admission policies.

---

## Layer 3 — LLM serving

Open AI Red Team supports every OpenAI-compatible backend. Choose per requirements:

| Backend | When | Notes |
|---------|------|-------|
| **vLLM** | Production (recommended) | PagedAttention + continuous batching → ~5× throughput vs Ollama under concurrency. OpenAI-compatible `/v1`. Financial-sector on-prem standard |
| **Ollama** | PoC / dev / edge | One-command deployment, easy local weights. Not for production-scale concurrency |
| **NVIDIA NIM** | Optional | If NVIDIA AI Enterprise is already licensed: support contract + FIPS-validated images. NVIDIA-GPU only |

```bash
# production: vLLM (profile serving), then the app
ORT_LLM_BASE_URL=http://vllm:8000/v1 ORT_LLM_MODEL=qwen2.5-32b docker compose --profile serving up -d
docker compose up -d ort

# PoC: Ollama (profile poc) — the app defaults to Ollama, no override needed
docker compose --profile poc up -d
```

The app connects via the OpenAI-compatible base URL (wired in `docker-compose.yml`,
default `http://ollama:11434/v1` for the PoC profile):

```
OPENWEIGHT_BASE_URL=http://vllm:8000/v1   # production (serving profile)
OPENWEIGHT_BASE_URL=http://ollama:11434/v1 # PoC (default)
```

For cloud APIs (DeepSeek/GLM) set `ORT_PROVIDER=deepseek`/`glm` and the corresponding keys —
only permitted where the engagement data is allowed to leave the network.

---

## Layer 4 — Red-team application

The `ort` container runs the **web dashboard server** (daemon-friendly, healthcheck, Prometheus
`/metrics`, OIDC/static-token auth, JSONL audit). An interactive CLI container is available under
the `cli` profile for manual operation.

Hardening applied to both containers:

- **Non-root user** (`ort`) in the runtime stage
- **Read-only root filesystem** (`read_only: true` + `tmpfs /tmp`)
- **Resource limits** (CPU/memory caps in compose)
- **Capability drop** (`cap_drop: ALL`) and `no-new-privileges`
- `skills/` shipped inside the image — fully offline after deployment

### Web dashboard (multi-operator / audited)

```bash
docker compose up -d ort                # dashboard server, http://localhost:8081
docker compose --profile cli run cli    # interactive CLI (attached TTY)
```

Code-level safety & compliance wiring:

| Concern | Implementation |
|---------|----------------|
| Scope guardrails | `ORT_SCOPE` / `ORT_SCOPE_DOMAINS` — out-of-scope targets flagged |
| Audit trail | `ORT_AUDIT_LOG` JSONL (volume-mounted `/data`) |
| LLM audit | LangFuse tracing via `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `LANGFUSE_BASEURL` |
| SSO/RBAC | `ORT_OIDC_ISSUER` — dashboard verifies Keycloak access tokens (RS256 + JWKS) |
| Metrics | `/metrics` endpoint scraped by Prometheus (`ort:8081`) |
| Context safety | Token budget engine (`ORT_MAX_CONTEXT` / `ORT_SKILL_BUDGET`) — no silent overflow |

### Manual run

```bash
docker build -t open-ai-red-team:latest .
docker run --rm -it --read-only --tmpfs /tmp \
  -e ORT_PROVIDER=openweight \
  -e OPENWEIGHT_BASE_URL=http://vllm:8000/v1 \
  -e OPENWEIGHT_MODEL=qwen2.5-32b \
  --network redteam_redteam open-ai-red-team:latest chat
```

---

## Layer 5 — Authentication, audit & monitoring

### Access control — Keycloak

- OIDC-compatible IdP inside the separated network → SSO + RBAC for operators
- Wired into the application: `ORT_OIDC_ISSUER=http://keycloak:8080/realms/open-red-team` makes
  the dashboard verify Keycloak access tokens (RS256 JWTs against the realm JWKS)
- Satisfies audit-logging and regulatory requirements (BAIT/VAIT-style supervision)
- Compose profile `auth`; realm import recommended via `--import-realm` in production

```bash
docker compose --profile auth up -d   # http://localhost:8080
```

### LLM observability & audit — LangFuse

- Wired into the application code: set `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` /
  `LANGFUSE_BASEURL` on the `ort` service — every chat completion is traced (input, output,
  provider, model, matched skills, scope, token counts)
- On-premises deployment keeps engagement data under full control

```bash
docker compose --profile observability up -d   # http://localhost:3000
```

### Infrastructure monitoring — Prometheus / Grafana / Loki

- The app's `/metrics` (chat counters, durations, tokens) plus vLLM `/metrics` and Ollama
  `/metrics` are pre-wired in `deploy/monitoring/prometheus/prometheus.yml`
- Grafana datasources for Prometheus and Loki pre-provisioned
- Loki included in the monitoring profile for log aggregation and retention

```bash
docker compose --profile monitoring up -d   # Grafana http://localhost:3001 · Loki :3100
```

---

## Tool summary

| Layer | Recommended tools | Role |
|-------|-------------------|------|
| Registry | **Harbor** | Private image storage, Trivy-integrated scanning, signature verification |
| Scan/SBOM | **Trivy** | CVE scan, SBOM (SPDX/CycloneDX), IaC/secret scan |
| Signing | **Cosign** | Image integrity, signature verification |
| Orchestration | **Docker Compose** (small) / **Kubernetes** (large) | Container orchestration, network policies, secrets |
| LLM serving | **vLLM** (prod) / **Ollama** (PoC) | OpenAI-compatible API, high-throughput inference |
| Auth | **Keycloak** | OIDC IdP, SSO, RBAC, audit logging |
| Observability | **LangFuse**, **Prometheus/Grafana** | LLM observability, infrastructure monitoring |

## Priorities

1. **First**: Harbor + Trivy — vulnerability scanning and SBOM for every image (basic compliance requirement).
2. **Production**: serve LLMs with vLLM; connect via the app's OpenAI-compatible provider settings.
3. **Network separation**: export images with skopeo/crane in the internet zone, scan, then import into internal Harbor.
4. **Audit & compliance**: control access with Keycloak and record all LLM interactions with LangFuse.

This architecture maximizes Open AI Red Team's model neutrality and air-gap support while satisfying
the supply-chain security, network separation, and auditability requirements of Korean financial and
public institutions.
