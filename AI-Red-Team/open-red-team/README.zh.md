# Open AI Red Team

**模型无关的进攻性安全技能集 + 中间件 — Claude Red 的替代与扩展，面向 DeepSeek、GLM 和开源权重模型**

将 [claude-red](https://github.com/SnailSploit/Claude-Red) 技能库（MIT）完整移植，摆脱 Claude 锁定：
同一套红队技能现可运行于 DeepSeek、GLM（智谱）、开源权重模型（Ollama / vLLM / LM Studio）—
支持云端、本地部署和完全离线（物理隔离）环境。

**文档语言:** [English](README.md)（基准） · [한국어](README.ko.md) · [日本語](README.ja.md) · 中文（本文档）

## 目的 — Claude Red 的替代与扩展

| Claude Red（原始） | Open AI Red Team（本项目） |
|--------------------|-------------------------|
| 仅 Claude 可用（Claude 技能系统的 `SKILL.md`） | 模型无关技能：同一方法学可在 **DeepSeek、GLM、开源权重**上运行 |
| 绑定 Anthropic API（数据流出网络） | **本地/物理隔离部署** — 内部数据不离开组织 |
| 厂商定价与数据留存 | **成本降低** — 开源权重模型（零 token 成本）与低成本 API |
| 技能局限于 Claude 原生技能系统 | **扩展** — 触发器引擎、英/韩双语触发器、显式加载、完整 CLI |

## 主要功能

- **79 个已移植技能、23 个类别** — claude-red 全库：Web、Infrastructure & Red Team、
  API Security、Cloud、AI Security、Active Directory、Wireless、Exploit Development、Fuzzing 等
- **面向红队的 LLM 扩展** — 为任意 OpenAI 兼容模型复现 Claude Skills 的渐进式披露与
  基于触发器的按需加载
- **提供商抽象** — DeepSeek、GLM（智谱）、开源权重（Ollama/vLLM/LM Studio/llama.cpp）统一接口
- **触发器引擎** — 关键词 + 正则匹配与打分，韩文、英文触发器关键词
- **显式控制** — `/use <skill>`、`--skills` 参数、自动加载开关、技能索引开关
- **CLI + 库** — 交互式 `ort chat`、单次 `ort ask`、技能查看、TypeScript API
- **Web 管理面板** — 浏览器管理控制台（流式对话、技能浏览器、JSONL 审计追踪、
  脱敏配置）— 多操作员·审计运营，无 CDN，适配物理隔离网络
- **上下文预算引擎** — 按模型的 token 上限＋按节截断技能正文，超大技能 `index_only`
  （防止上下文溢出）
- **安全护栏** — 已申报的任务范围（`ORT_SCOPE`/`ORT_SCOPE_DOMAINS`）与范围外目标标记、
  归属操作员的审计记录
- **合规对接** — Prometheus `/metrics`、OIDC（Keycloak）API 认证、LangFuse 追踪
- **多语言文档** — 英语（基准）、韩语、日语、中文
- **本地部署就绪** — 本地模型确保敏感目标信息留在内部环境

## 截图

| 管理面板 — Chat | 管理面板 — Skills |
|-----------------|-------------------|
| ![Chat 页](assets/screenshots/dashboard-chat.png) | ![Skills 页](assets/screenshots/dashboard-skills.png) |
| **管理面板 — Audit** | **管理面板 — Config** |
| ![Audit 页](assets/screenshots/dashboard-audit.png) | ![Config 页](assets/screenshots/dashboard-config.png) |

## 组成部分

| 目录 | 内容 |
|------|------|
| `skills/` | 已移植技能（模型无关的 `SKILL.md`）— 基于触发器的按需加载 |
| `src/` | 中间件 — 提供商抽象（OpenAI 兼容）、技能加载器、触发器引擎、CLI |
| `docs/` | 架构、用户手册、移植指南、模型矩阵、路线图 |
| `scripts/` | 技能同步/转换工具 |

## 移植状态 — claude-red 全库（79 个技能、23 个类别）

| 类别 | 技能数 | 类别 | 技能数 |
|------|-------:|------|-------:|
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
| Utility | 2 | **合计** | **79** |

## 快速开始

```bash
npm install
npm run build
cp .env.example .env   # 配置 API 密钥
node dist/src/cli.js chat          # 交互式会话（或：npm i -g . → ort chat）
node dist/src/cli.js dashboard     # Web 管理面板（http://localhost:8081）
npm test                           # 运行测试
```

### 支持的提供商

| 提供商 | 端点 | 模型示例 |
|--------|------|----------|
| `deepseek` | `https://api.deepseek.com/v1`（OpenAI 兼容） | `deepseek-chat`, `deepseek-reasoner` |
| `glm` | `https://open.bigmodel.cn/api/paas/v4`（OpenAI 兼容） | `glm-4-plus`, `glm-4-flash` |
| `openweight` | Ollama / vLLM / LM Studio（OpenAI 兼容 `/v1`） | `qwen2.5:32b`, `deepseek-r1:32b` |

## 使用方法

### CLI

`ort` 需要全局安装（`npm i -g .`）— 否则直接运行 `node dist/src/cli.js`。

```bash
npx ort chat --provider deepseek --model deepseek-chat   # 交互式，自动加载技能
npx ort chat --skills offensive-sqli --provider glm      # 强制加载技能
npx ort skills list                                      # 技能列表
npx ort skills show offensive-sqli                       # 输出技能正文
npx ort ask "如何测试这个登录表单的 SQLi" --provider deepseek  # 单次查询
npx ort dashboard                                        # Web 管理面板（http://localhost:8081）
```

### 库

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
});

const reply = await ort.chat("如何测试 SQL 注入？");
console.log(reply);
```

## 应用场景

### 公共机构与金融机构 — 合规驱动

- 依据监管框架（ISMS-P、金融安全规范、PCI-DSS、NIST 等）开展内部红队演练与自查，
  **不将内部系统信息发送至境外云 API**
- 在严格数据治理要求下对电子政务、金融服务进行安全审查

> 代码强制实施的控制与操作员/组织责任的划分，参见[合规控制](docs/compliance.md)。

### 企业 — 内部安全运营

- 为安全团队培训、CTF 备战、授权渗透测试规划、日常漏洞分级提供操作员级方法学库
- 本地部署使专有架构、源代码和目标信息保留在公司内部

### 面向红队的 LLM 扩展

- 将任意 OpenAI 兼容模型转变为上下文感知的红队操作员：
  技能索引 + 按需方法学注入 + 对话历史
- 灵活组合：敏感任务使用本地模型，大批量任务使用云 API

## 成本与数据保护

### 成本降低

| 选项 | token 单价 | 说明 |
|------|------------|------|
| Claude（原始） | 最高价位 | 技能仅 Claude 可用 |
| DeepSeek / GLM API | 低成本 API | 相同技能内容，成本大幅降低 |
| 开源权重（Ollama/vLLM） | **边际成本为零** | 在现有 GPU/硬件上运行 |

### 公共机构 · 金融机构 · 企业内部信息保护

- 使用 `openweight` 提供商时**数据不离开组织** — 目标信息、发现结果和方法学
  保留在本地或物理隔离环境
- 提示词与安全发现无第三方留存
- 企业友好 — 支持代理环境、隔离网络和离线实验室

## 工作原理

1. **技能索引注入** — 将所有技能的 `name` + `description` 注入系统提示词（复现 Claude Skills 的渐进式披露，最小化上下文成本）
2. **触发器匹配** — 将用户输入与各技能的 `triggers`（关键词/正则，英/韩）匹配，将排名前 N 的技能正文注入系统提示词
3. **模型调用** — 通过 OpenAI 兼容 API 向所选提供商发送请求

## 部署与运营（物理隔离 / 本地部署）

金融、公共机构和企业部署（망분리·网络隔离）采用 5 层架构支持：离线转入（skopeo/crane）
→ 镜像仓库安全（Harbor + Trivy + Cosign）→ LLM 推理（vLLM/Ollama）→ 加固后的应用容器
（非 root·只读·资源限制）→ 认证与审计（Keycloak + LangFuse + Prometheus/Grafana）。

```bash
docker build -t open-ai-red-team:latest .       # 构建加固镜像
docker compose --profile poc up -d               # PoC：应用 + Ollama
docker compose --profile serving up -d           # 生产：应用 + vLLM
./scripts/sbom/scan.sh open-ai-red-team:latest   # CVE 扫描 + SBOM
./scripts/offline/export-images.sh               # 物理隔离转入
```

详见：[部署与运营指南](docs/deployment.md)

## 文档

- [用户手册](docs/manual.md) — 安装、提供商、CLI、故障排查
- [架构](docs/architecture.md) — 中间件设计与数据流
- [移植指南](docs/porting-guide.md) — Claude 技能 → 模型无关的转换规则
- [模型矩阵](docs/model-matrix.md) — DeepSeek/GLM/开源权重的特性与限制
- [无审查开源权重模型](docs/uncensored-models.md) — LM Studio + 无审查 GGUF 实验室指南
- [合规控制](docs/compliance.md) — 代码强制实施的内容 vs 操作员责任
- [路线图](docs/roadmap.md) — 移植阶段与中间件规划

## 许可证

MIT。原始技能：[SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red)（MIT）— 各技能 frontmatter 的 `source` 字段注明出处。

> 仅在授权环境中使用（渗透测试、范围内的漏洞赏金、安全研究、CTF）。
