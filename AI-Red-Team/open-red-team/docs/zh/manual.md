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

## 4. CLI 参考

### `ort chat` — 交互式会话

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

## 8. 安全与伦理

- 技能仅用于**授权测试**的攻击方法论。
- 未经书面许可，绝不用于真实系统。
- 练习环境：PortSwigger Web Security Academy、DVWA、HackTheBox、TryHackMe。
