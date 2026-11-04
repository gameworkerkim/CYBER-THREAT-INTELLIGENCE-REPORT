# 架构

**语言:** [English](../architecture.md)（基准） · [한국어](architecture.md) · [日本語](architecture.md) · 中文（本文档）

## 概述

Open Red Team 中间件在仅提供 OpenAI 兼容 API 的模型（DeepSeek、GLM、开源权重）上
复现 **Claude Skills 系统**（渐进式披露 + 基于触发器的按需加载）。

## 组件

```
┌─────────────────────────────────────────────────────────────┐
│                          CLI / Library                       │
│                    src/cli.ts  ·  src/index.ts               │
├─────────────────────────────────────────────────────────────┤
│  Skill Engine                      Provider Layer            │
│  ┌──────────────────────┐          ┌──────────────────┐     │
│  │ loader.ts            │          │ base.ts          │     │
│  │  - SKILL.md 解析     │          │  - OpenAI 兼容    │     │
│  │  - frontmatter/body  │          │    请求/流式输出  │     │
│  ├──────────────────────┤          ├──────────────────┤     │
│  │ trigger.ts           │          │ deepseek.ts      │     │
│  │  - 关键词/正则匹配   │          │ glm.ts           │     │
│  │  - 打分/排序         │          │ openweight.ts    │     │
│  ├──────────────────────┤          │  (Ollama/vLLM/   │     │
│  │ inject.ts            │          │   LM Studio 等)   │     │
│  │  - 系统提示词组装    │          └──────────────────┘     │
│  └──────────────────────┘                                   │
├─────────────────────────────────────────────────────────────┤
│                     skills/ (已移植的 SKILL.md)              │
└─────────────────────────────────────────────────────────────┘
```

## 数据流（单轮）

```
用户输入
   │
   ▼
1. 触发器匹配 ──────────────► 命中的技能（按得分排序，受 maxSkills 限制）
   │
   ▼
2. 系统提示词组装
   │  ├─ 基础提示词（操作员人设、交战规则）
   │  ├─ 技能索引（全部技能：name + description + 触发器提示）
   │  └─ 选定技能正文（完整 SKILL.md 内容）
   ▼
3. 调用提供商（OpenAI 兼容 chat.completions）
   │
   ▼
4. 响应流式输出 → 用户
```

## 技能格式

已移植技能保持原有的 `SKILL.md` 结构，并扩展 frontmatter。

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sqli"
  - "sqlmap"
  - "sql 인젝션"
category: web
model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---

# SQL Injection — Offensive Testing Methodology
...
```

### 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 技能标识符（与目录名一致） |
| `description` | 是 | 始终注入索引的摘要（≤ 200 字符） |
| `triggers` | 是 | 自动加载关键词/正则（`/regex/` 形式），英/韩 |
| `category` | 是 | 移植类别（web、infrastructure、api、cloud、ai、wireless 等） |
| `model_note` | 否 | 模型相关注意事项 |
| `source` | 否 | 原始出处（署名） |

## 渐进式披露的复现

Claude Skills 的核心原理 — **技能正文仅在需要时进入上下文**：

1. **索引（description）始终注入** — 79 个技能 × 约 150 字符 ≈ 3K token。
2. **正文仅在触发器命中时注入** — 默认上限 3 个（`ORT_MAX_SKILLS`）。
3. **显式加载** — `/use offensive-sqli` 或 `--skills` 参数。

## 提供商抽象

所有目标都提供 OpenAI 兼容 API，因此统一使用单个 `BaseProvider`（openai SDK）。

| 提供商 | baseURL | 认证 | 备注 |
|--------|---------|------|------|
| DeepSeek | `https://api.deepseek.com/v1` | Bearer API key | `deepseek-reasoner` 单独返回 `reasoning_content` |
| GLM | `https://open.bigmodel.cn/api/paas/v4` | Bearer API key | 部分模型返回 `reasoning_content` 字段 |
| Open-weight | Ollama `http://localhost:11434/v1`、vLLM 等 | any/dummy | 上下文长度与格式因模型而异 |

## 上下文预算管理

- 技能正文平均 8–15K token → 完整索引 + 最多 3 个正文 ≈ 50K token。
- DeepSeek 64K–128K、GLM-4 128K、Qwen2.5 32K+ → 默认设置可容纳。
- 小型开源权重模型建议 `ORT_MAX_SKILLS=1`、`ORT_INCLUDE_INDEX=off`。
