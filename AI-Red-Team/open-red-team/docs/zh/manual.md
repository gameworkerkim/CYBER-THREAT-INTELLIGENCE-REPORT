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
| `ORT_DASHBOARD_TOKEN` | *(空)* | `/api/*` 的 Bearer 令牌。为空则不鉴权（仅开发） |
| `ORT_AUDIT_LOG` | *(空)* | JSONL 审计日志路径（记录完成时间、提供商、模型、命中技能、长度） |

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
