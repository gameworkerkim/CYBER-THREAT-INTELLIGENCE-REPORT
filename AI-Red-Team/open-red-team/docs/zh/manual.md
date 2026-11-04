# Open AI Red Team — 用户手册

**语言:** [English](../manual.md)（基准） · [한국어](manual.md) · [日本語](manual.md) · 中文（本文档）

## 1. 安装

要求：Node.js ≥ 18.18、npm。

```bash
git clone <本仓库>
cd open-red-team
npm install
npm run build
cp .env.example .env
```

## 2. 配置

编辑 `.env` — 所有设置均为环境变量。

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ORT_PROVIDER` | `deepseek` | 默认提供商：`deepseek` \| `glm` \| `openweight` |
| `ORT_SKILLS_DIR` | `./skills` | 已移植技能所在目录 |
| `ORT_AUTO_LOAD` | `on` | 基于触发器的技能自动加载 |
| `ORT_MAX_SKILLS` | `3` | 每轮自动加载的技能上限 |
| `ORT_INCLUDE_INDEX` | `on` | 系统提示词中包含技能描述（索引） |
| `DEEPSEEK_API_KEY` | — | DeepSeek API 密钥 |
| `DEEPSEEK_MODEL` | `deepseek-chat` | DeepSeek 模型 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeek 端点 |
| `GLM_API_KEY` | — | 智谱 BigModel API 密钥 |
| `GLM_MODEL` | `glm-4-plus` | GLM 模型 |
| `GLM_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` | GLM 端点 |
| `OPENWEIGHT_BASE_URL` | `http://localhost:11434/v1` | Ollama/vLLM/LM Studio 端点 |
| `OPENWEIGHT_MODEL` | `qwen2.5:32b` | 本地模型名称 |
| `OPENWEIGHT_API_KEY` | `ollama` | 占位密钥（Ollama 会忽略） |

## 3. 提供商

### DeepSeek

```bash
# platform.deepseek.com → API Keys
export DEEPSEEK_API_KEY=sk-...
npx ort chat --provider deepseek
```

### GLM（智谱 BigModel）

```bash
# open.bigmodel.cn → API Keys
export GLM_API_KEY=...
npx ort chat --provider glm --model glm-4-flash
```

### 开源权重（Ollama）

```bash
ollama pull qwen2.5:32b
ollama serve
# OPENWEIGHT_BASE_URL=http://localhost:11434/v1（默认）
npx ort chat --provider openweight --model qwen2.5:32b
```

### vLLM / LM Studio

任何 OpenAI 兼容服务器均可 — 将 `OPENWEIGHT_BASE_URL` 指向其 `/v1` 端点。
LM Studio 暴露于 `http://localhost:1234/v1`。当 Web 模型审查与默认安全对齐构成限制时，
无审查 GGUF 实验室测试参见[无审查开源权重模型指南](uncensored-models.md)。
 仅限隔离、授权环境使用。

## 4. CLI 参考

### `ort chat` — 交互式会话

`ort` 需要全局安装（`npm i -g .`）；否则用 `node dist/src/cli.js` 代替 `ort`。

```
npx ort chat [--provider <p>] [--model <m>] [--skills <s1,s2>]

会话内命令:
  /skills        列出所有技能
  /reset         清空对话历史
  /exit          退出
消息内指令:
  /use <skill>   当前轮强制加载技能
```

### `ort ask` — 单次查询

```
npx ort ask "如何测试 SQL 注入" --provider deepseek
```

### `ort skills` — 技能查看

```
npx ort skills list             # 全部技能（名称、类别、描述）
npx ort skills show <name>      # 输出技能完整正文
```

## 5. 库 API

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",          // 可选 "glm" | "openweight"
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
  autoLoad: true,                // 基于触发器的加载
  maxSkills: 3,
  includeIndex: true,
});

await ort.init();                // 从磁盘加载技能
ort.listSkills();                // [{frontmatter, body, path}]

const result = await ort.chat("如何测试 SQL 注入", {
  skills: ["offensive-sqli"],    // 强制加载
  onDelta: (d) => process.stdout.write(d),  // 流式输出
});
// result: { content, matchedSkills, provider, model }

ort.reset();                     // 清空历史
```

## 6. 技能系统

每个技能是扩展了 frontmatter 的 `SKILL.md` 文件：

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sql 인젝션"
category: web
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---
```

- **渐进式披露** — 系统提示词中常驻的只有描述（索引），触发器命中时才加载技能正文。
- **触发器** — 关键词（英/韩）和 `/regex/` 模式。
- **显式加载** — 消息中的 `/use offensive-sqli` 或 `--skills` 参数。

## 7. 故障排查

| 症状 | 解决办法 |
|------|----------|
| `401` / 认证错误 | 检查对应提供商的 API 密钥环境变量 |
| 技能未加载 | 检查 `ORT_SKILLS_DIR`；运行 `npx ort skills list` |
| 没有技能被匹配 | 使用 `/use <skill>` 或为技能 `triggers` 添加关键词 |
| 小型本地模型忽略技能 | `ORT_MAX_SKILLS=1`、`ORT_INCLUDE_INDEX=off`，建议 32B 以上模型 |
| Ollama 上下文溢出 | 在 Ollama 设置中增大 `num_ctx` |

## 9. Web 管理面板

支持多操作员与审计的浏览器管理面板。

```bash
npx ort dashboard                          # http://localhost:8081
ORT_DASHBOARD_TOKEN=secret npx ort dashboard   # Bearer 令牌保护
```

| 标签页 | 功能 |
|--------|------|
| Chat | 流式对话，自动加载的技能以徽章显示 |
| Skills | 按名称、类别、触发器搜索/筛选全部 79 个技能，查看完整正文 |
| Audit | 查看 JSONL 审计日志中的近期交互 |
| Config | 密钥脱敏后的只读配置 |

| Chat | Skills |
|------|--------|
| ![Chat](../../assets/screenshots/dashboard-chat.png) | ![Skills](../../assets/screenshots/dashboard-skills.png) |
| **Audit** | **Config** |
| ![Audit](../../assets/screenshots/dashboard-audit.png) | ![Config](../../assets/screenshots/dashboard-config.png) |

环境变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ORT_DASHBOARD_PORT` | `8081` | 监听端口 |
| `ORT_DB_PATH` | `./data/ort.db` | 本地账户与运行时设置的 SQLite 路径 |
| `ORT_AUTH_SECRET` | *(自动)* | 登录令牌 HMAC 密钥（为空则生成并存入 DB） |
| `ORT_DISABLE_LOCAL_AUTH` | `0` | `1` 禁用本地账户（仅 OIDC/静态令牌） |
| `ORT_DASHBOARD_TOKEN` | *(空)* | 静态 Bearer 令牌（本地账户的替代方案） |
| `ORT_OIDC_ISSUER` | *(空)* | Keycloak/OIDC 颁发者 — 设置后要求 OIDC 访问令牌（优先） |
| `ORT_OIDC_AUDIENCE` | *(空)* | 期望的 `aud` 声明 |
| `ORT_METRICS_TOKEN` | *(空)* | `/metrics` 令牌（为空则套用面板认证） |
| `ORT_AUDIT_LOG` | *(空)* | JSONL 审计日志路径（sessionId·operator·decision·命中技能·提示词 SHA-256 — 不存原文） |
| `ORT_AUDIT_REQUIRED` | `0` | `1` 时审计写入失败即请求失败 |

### 本地账户（SQLite）

首次启动时创建默认账户 **admin / admin**，并在使用其他 API 前强制修改密码
（`403 password change required`）。登录颁发 HMAC 签名令牌（12 小时），以
`Authorization: Bearer <token>` 使用。

| 端点 | 用途 |
|------|------|
| `POST /api/auth/login` | `{username, password}` → `{token, username, role, mustChangePassword}` |
| `GET /api/auth/me` | 当前用户（`username`、`role`、`mustChangePassword`） |
| `POST /api/auth/change-password` | `{currentPassword, newPassword}`（至少 8 位） |

### 运行时设置（Settings 页）

管理员可在面板 Settings 页修改范围、预算与引擎设置（`GET/PUT /api/settings`）。
DB 值优先于环境变量，空值回退到环境变量。可修改键：`ORT_SCOPE`、`ORT_SCOPE_DOMAINS`、
`ORT_SCOPE_MODE`、`ORT_OPERATOR`、`ORT_MAX_CONTEXT`、`ORT_SKILL_BUDGET`、
`ORT_RESERVE_TOKENS`、`ORT_MAX_SKILLS`、`ORT_INCLUDE_INDEX`、`ORT_AUTO_LOAD`。
提供商/模型/API 密钥变更仍需重启。

Docker：

```bash
docker compose up -d ort    # http://localhost:8081
```

前端不含外部资源（无 CDN），可完全离线运行 — 适合物理隔离网络。
企业 SSO 可在反向代理前放置 Keycloak（OIDC），并停用 `ORT_DASHBOARD_TOKEN`。

## 10. 护栏·预算·可观测性

### 上下文预算（防止溢出）

技能正文仅注入到 token 预算为止 — 不会向模型静默发送溢出的上下文。
按提供商的默认值：deepseek 64K/16K、glm 128K/24K、openweight 32K/8K（上下文上限/单技能预算）。
可用 `ORT_MAX_CONTEXT`、`ORT_SKILL_BUDGET`、`ORT_RESERVE_TOKENS` 覆盖。超限正文按节截断
（`… [truncated by token budget]`）；`index_only` 技能（如 554KB 的 `offensive-windows-boundaries`）
不注入正文、仅保留索引 — 用 `ort skills show <name>` 查看。

### 任务范围护栏

| 变量 | 效果 |
|------|------|
| `ORT_SCOPE` | 已申报任务说明 — 注入系统提示词并记录到审计/追踪。面板启动必需（`ORT_SCOPE_MODE=open` 例外） |
| `ORT_SCOPE_DOMAINS` | 范围内的主机/域名（逗号分隔）。范围外目标在**任何模型调用之前被拒绝**（SSE `denied`、CLI `decision: DENIED`） |
| `ORT_SCOPE_MODE` | `open` 禁用域名检查（仅本地实验室） |
| `ORT_OPERATOR` | 记录到审计条目和 LangFuse 追踪的操作员标识 |

会话为内存存储（LRU 上限、空闲淘汰），**服务器重启后清空** — 磁盘持久化不在本版本范围内。

### 可观测性

- **LangFuse**：设置 `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY`/`LANGFUSE_BASEURL` 后追踪全部对话。
- **Prometheus**：面板暴露 `/metrics`，compose monitoring 配置文件自动采集。

## 11. 安全与伦理

- 技能仅用于**授权测试**的攻击方法论。
- 未经书面许可，绝不用于真实系统。
- 练习环境：PortSwigger Web Security Academy、DVWA、HackTheBox、TryHackMe。

## 12. 评审意见与验证状态

累积评审意见（4 轮）与当前状态。

### P0 — 致命问题，全部解决并经实测确认

| # | 问题 | 状态 |
|---|------|------|
| 1 | 技能正文全量注入 → 上下文溢出（单技能约 138K token） | 令牌预算引擎 + 6 个超大技能 `index_only`，运行时提示词实测约 6-8K token |
| 2 | 完全没有测试 | vitest 63 项/12 个文件 |
| 3 | 只有 CLI → `docker compose up -d` 无法运行 | Express 面板 + compose `command: ["dashboard"]` |
| 4 | 无范围强制 → 全部送往模型 | `decision: deny` 在提供商调用前返回 — 以调用计数器确认 0 次 |
| 5 | fail-open 启动（无认证/无范围） | 两者均以 exit 1 拒绝 |

### P1 — 可靠性与运营问题，已解决

| # | 问题 | 状态 |
|---|------|------|
| 6 | LangFuse 审计未接入代码 | `recordChat` 追踪 + JSONL 审计 `promptSha256`（不存原文） |
| 7 | Keycloak（OIDC）未接入代码 | OIDC 中间件：discovery + JWKS + RS256 |
| 8 | npm bin 路径损坏（`npx ort` 不可用） | 修正为 `dist/src/cli.js` |
| 9 | 无 LICENSE 文件 | 已添加（MIT + claude-red 署名） |
| 10 | `reasoning_content` 丢弃·仅流式 | 捕获推理 + 非流式回退 |
| 11 | 所有密钥默认 `change-me` | 拆分 `docker-compose.infra.yml` + 必需替换 `${VAR:?}` |
| 12 | PoC 配置 LLM 默认值不匹配 | 对齐 Ollama + `depends_on: ollama-pull` |
| 13 | 操作员之间共享历史 | `SessionStore`（LRU·空闲淘汰）+ OIDC `sub` 归属 |
| 14 | 历史无限增长 | 轮次预算 + `[earlier turns omitted]` 标记 |
| 15 | 无检索质量基准 | 30 条 fixture + 阈值（top-1 ≥ 0.85、top-3 ≥ 0.95） |

### P2 — 收尾与边界，已解决

- CLI 版本硬编码（0.1.0）→ 从 `package.json` 动态加载
- 失效指标与路由标签 → 清理
- `compliance.md`/架构控制表 4 种语言
- `index_only` 技能在 Skills 页显示"본문 미주입"徽章

### 已知限制（轻微）

1. **CI 工作流**：位于仓库根目录 `.github/workflows/open-red-team.yml`（GitHub 仅在根目录执行），
   已配置路径过滤。本地运行已验证，托管门禁的实机运行未验证。
2. **vLLM 实机运行 / Keycloak OIDC 往返**：代码、compose、realm 配置已验证；因缺乏 GPU/Docker
   基础设施，实机运行未验证。
3. **镜像默认 `CMD` 为 `chat`**（交互式）— compose 覆盖为 `dashboard`。有意保留的双重用途。
4. **拒绝审计记录 `flaggedTargets`**（仅主机，不含提示词原文）— 设计上的信息性记录。
