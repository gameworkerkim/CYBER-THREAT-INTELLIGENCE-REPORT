# 部署与运营 — 物理隔离 / 本地部署

**语言:** [English](../deployment.md)（基准） · [한국어](deployment.md) · [日本語](deployment.md) · 中文（本文档）

本文介绍如何在金融、公共机构和企业环境中部署 Open AI Red Team。核心在于充分利用其
物理隔离与本地部署特性，同时满足韩国监管要求（网络隔离·망분리、电子金融监督规定等）。

## 推荐架构 — 5 层

```
① 离线转入层                ② 容器安全/镜像仓库层              ③ LLM 推理服务层
   （互联网区）                 （内网）                           （内网）
┌──────────────────┐   ┌──────────────────────────────┐   ┌───────────────────────┐
│ skopeo / crane   │   │ Harbor（私有镜像仓库）        │   │ vLLM（生产）           │
│ docker save/load │──►│ Trivy（CVE + SBOM）          │──►│ Ollama（PoC）          │
│ 模型权重          │   │ Cosign（签名/校验）           │   │ OpenAI 兼容 /v1        │
└──────────────────┘   └──────────────────────────────┘   └───────────┬───────────┘
                                                                       │
④ 红队应用层                  ⑤ 认证·审计·监控层                       │
┌──────────────────────────────┐   ┌──────────────────────────────┐   │
│ ort（Open AI Red Team）      │◄──┤ Keycloak（OIDC, SSO, RBAC）  │◄──┘
│ 非 root/只读/资源限制         │   │ LangFuse（LLM 审计）          │
└──────────────────────────────┘   │ Prometheus + Grafana + Loki  │
                                   └──────────────────────────────┘
```

---

## 第 1 层 — 离线转入（网络隔离）

在网络隔离环境中，必须在互联网区识别并下载所有资源（LLM 权重、Docker 镜像、软件包），
**经恶意代码检查后**转入内网。

### 镜像导出（互联网区）

```bash
# skopeo（无需 Docker 守护进程）或 crane、docker save — 见 scripts/offline/
./scripts/offline/export-images.sh
# 自定义列表: IMAGES="harbor.example.com/repo/app:v1 ..." ./scripts/offline/export-images.sh
```

生成 `artifacts/images/*.tar` 及 SHA-256 校验和。转入**之前**必须使用组织的
防病毒/恶意代码解决方案进行扫描（金融安全院指南）。

### 镜像导入（内网）

```bash
./scripts/offline/import-images.sh
# 推送到内网 Harbor:
HARBOR=harbor.internal.example.com/open-red-team ./scripts/offline/import-images.sh
```

### 模型权重

```bash
# vLLM 格式（Hugging Face）
MODEL_ID=Qwen/Qwen2.5-32B-Instruct ./scripts/offline/export-models.sh
# Ollama 格式（PoC）
MODE=ollama OLLAMA_MODEL=qwen2.5:32b ./scripts/offline/export-models.sh
```

### Harbor 复制（tar 文件的替代方案）

在互联网区 Harbor 中配置到内网 Harbor 的**复制规则**。需要经过批准的跨区传输路径，
并对每个复制工件进行审计记录。

---

## 第 2 层 — 容器安全与私有镜像仓库

金融/公共机构对镜像漏洞扫描和 SBOM 生成事实上是强制要求。

| 工具 | 作用 |
|------|------|
| **Harbor** | 本地私有镜像仓库的事实标准。集成 Trivy 扫描适配器 — 推送时自动扫描、基于策略阻断拉取 |
| **Trivy** | 扫描操作系统软件包、语言依赖、IaC 配置、密钥。生成 SBOM（SPDX/CycloneDX）满足供应链安全要求 |
| **Cosign** | 镜像签名与校验（Sigstore）。与 Harbor 联动，阻断未签名镜像部署 |

### 扫描 + SBOM

```bash
# 发现 HIGH/CRITICAL 即失败，输出 SPDX + CycloneDX SBOM
./scripts/sbom/scan.sh open-ai-red-team:latest artifacts/sbom
```

### 签名 + 校验

```bash
./scripts/sbom/sign.sh open-ai-red-team:latest          # 生成 cosign.key 并签名
./scripts/sbom/sign.sh open-ai-red-team:latest --verify # 以 cosign.pub 校验
```

### Harbor 配置要点

1. 在内网安装 Harbor（离线安装包）。
2. 项目 → **配置**：启用"防止运行存在漏洞的镜像"（Trivy 适配器）。
3. 为部署节点创建仅拉取的机器人账户。
4. （可选）Cosign 集成 — 仅允许已签名镜像的策略。

---

## 第 3 层 — LLM 推理服务

Open AI Red Team 支持所有 OpenAI 兼容后端。按需求选择：

| 后端 | 适用场景 | 备注 |
|------|----------|------|
| **vLLM** | 生产（推荐） | PagedAttention + Continuous Batching — 并发场景下吞吐约为 Ollama 的 5 倍。OpenAI 兼容 `/v1`。金融行业本地部署的标准趋势 |
| **Ollama** | PoC / 开发 / 边缘 | 单命令部署、本地权重管理简单。不适合生产级并发 |
| **NVIDIA NIM** | 可选 | 已持有 NVIDIA AI Enterprise 许可时可获得支持合同 + FIPS 验证镜像。仅限 NVIDIA GPU |

```bash
# 生产: vLLM（serving 配置文件）→ 应用
docker compose --profile serving up -d
docker compose up -d ort

# PoC: Ollama（poc 配置文件）
docker compose --profile poc up -d
```

应用通过 OpenAI 兼容 base URL 连接（`docker-compose.yml` 中已配置）：

```
OPENWEIGHT_BASE_URL=http://vllm:8000/v1
```

使用云 API（DeepSeek/GLM）时设置 `ORT_PROVIDER=deepseek`/`glm` 及相应密钥 —
仅在任务数据允许出网时使用。

---

## 第 4 层 — 红队应用

`ort` 通过仓库 `Dockerfile` 容器化，经 Harbor 部署。

已应用的加固措施：

- **非 root 用户**（`ort`）运行阶段
- **只读根文件系统**（`read_only: true` + `tmpfs /tmp`）
- **资源限制**（CPU/内存上限）
- **能力移除**（`cap_drop: ALL`）与 `no-new-privileges`
- `skills/` 随镜像分发 — 部署后完全离线运行

### Web 管理面板（多操作员·审计）

内置浏览器管理面板（`ort dashboard`）：带技能匹配徽章的流式对话、技能搜索/浏览、
JSONL 审计追踪、脱敏配置查看。无外部资源（无 CDN），完全离线运行。
使用 `ORT_DASHBOARD_TOKEN` 保护，或在前端放置 Keycloak（OIDC）。

```bash
docker compose --profile dashboard up -d   # http://localhost:8081（ORT_DASHBOARD_TOKEN 认证）
```

### 手动运行

```bash
docker build -t open-ai-red-team:latest .
docker run --rm -it --read-only --tmpfs /tmp \
  -e ORT_PROVIDER=openweight \
  -e OPENWEIGHT_BASE_URL=http://vllm:8000/v1 \
  -e OPENWEIGHT_MODEL=qwen2.5-32b \
  --network redteam_redteam open-ai-red-team:latest chat
```

---

## 第 5 层 — 认证、审计与监控

### 访问控制 — Keycloak

- 隔离网络内的 OIDC 兼容 IdP → 操作员 SSO + RBAC
- 满足审计日志和监管要求（类 BAIT/VAIT 监督体系）
- Compose 配置文件 `auth`；生产环境建议使用 `--import-realm`

```bash
docker compose --profile auth up -d   # http://localhost:8080
```

### LLM 可观测性与审计 — LangFuse

- 收集提示词、响应、token、延迟 → 兼顾运营质量与审计追踪
- 本地部署，任务数据完全自主可控

```bash
docker compose --profile observability up -d   # http://localhost:3000
```

### 基础设施监控 — Prometheus / Grafana（+ Loki 可选）

- vLLM `/metrics`、Ollama `/metrics` 已在 `deploy/monitoring/prometheus/prometheus.yml` 中预配置
- Grafana 数据源已预置
- Loki（可选）：日志聚合与保留

```bash
docker compose --profile monitoring up -d   # Grafana http://localhost:3001
```

---

## 工具汇总

| 层级 | 推荐工具 | 作用 |
|------|----------|------|
| 镜像仓库 | **Harbor** | 私有镜像存储、Trivy 集成扫描、签名校验 |
| 扫描/SBOM | **Trivy** | CVE 扫描、SBOM（SPDX/CycloneDX）、IaC/密钥扫描 |
| 签名 | **Cosign** | 镜像完整性、签名校验 |
| 编排 | **Docker Compose**（小规模）/ **Kubernetes**（大规模） | 容器编排、网络策略、密钥管理 |
| LLM 推理 | **vLLM**（生产）/ **Ollama**（PoC） | OpenAI 兼容 API、高吞吐推理 |
| 认证 | **Keycloak** | OIDC IdP、SSO、RBAC、审计日志 |
| 可观测性 | **LangFuse**、**Prometheus/Grafana** | LLM 可观测性、基础设施监控 |

## 优先级

1. **最优先**：Harbor + Trivy — 为所有镜像建立漏洞扫描与 SBOM 流水线（基本安全要求）。
2. **生产环境**：LLM 推理选择 vLLM，通过应用的 OpenAI 兼容提供商设置对接。
3. **网络隔离应对**：互联网区用 skopeo/crane 将镜像保存为 tar → 安全检查 → 导入内网 Harbor。
4. **审计与合规**：以 Keycloak 管控访问，以 LangFuse 记录所有 LLM 交互。

该架构最大化 Open AI Red Team 的模型中立性与物理隔离支持，同时满足韩国金融与公共机构
对供应链安全、网络隔离和可审计性的要求。
