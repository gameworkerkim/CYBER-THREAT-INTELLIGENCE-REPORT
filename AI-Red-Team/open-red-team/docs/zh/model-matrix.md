# 模型兼容矩阵

**语言:** [English](../model-matrix.md)（基准） · [한국어](model-matrix.md) · [日本語](model-matrix.md) · 中文（本文档）

## DeepSeek

| 项目 | 值 |
|------|-----|
| API | `https://api.deepseek.com/v1` — OpenAI 兼容 |
| 模型 | `deepseek-chat`（V3, 64K）、`deepseek-reasoner`（R1） |
| 上下文 | 64K（128K 测试版） |
| 系统提示词 | 支持 |
| 流式输出 | 支持 |
| 函数调用 | 支持（有限） |

备注：
- `deepseek-reasoner` 支持系统提示词注入，但内部生成 CoT → 注入大段技能正文时响应延迟增加
- 对攻击性提示词的指令遵循率高
- 推理模式下温度接近 1.0 时容易偏离技能指令 — 推荐 `deepseek-chat`

## GLM（智谱 BigModel）

| 项目 | 值 |
|------|-----|
| API | `https://open.bigmodel.cn/api/paas/v4` — OpenAI 兼容 |
| 模型 | `glm-4-plus`、`glm-4-air`、`glm-4-flash` |
| 上下文 | 128K |
| 系统提示词 | 支持 |
| 流式输出 | 支持 |
| 函数调用 | 支持 |

备注：
- 部分模型单独返回 `reasoning_content` 字段 — 中间件负责合并
- 工具调用时的消息格式与 OpenAI 略有差异 — 纯文本聊天不受影响
- `glm-4-flash` 有免费额度，适合注入大规模技能索引

## 开源权重（Ollama / vLLM / LM Studio）

| 项目 | 值 |
|------|-----|
| API | Ollama `http://localhost:11434/v1`、vLLM `.../v1` — OpenAI 兼容 |
| 模型 | `qwen2.5:32b`、`deepseek-r1:32b`、`llama3.1:70b`、`mistral:7b` 等 |
| 上下文 | 因模型而异（4K–128K） |
| 系统提示词 | 大多支持 |
| 流式输出 | 支持 |

备注：
- 7B 级模型注入超过一个技能正文后指令遵循率骤降 → `ORT_MAX_SKILLS=1`
- GGUF 量化模型对详细载荷（SQLi/Shellcode）的复现能力较差 — 建议 32B 以上
- Ollama 可通过 `keep_alive`/`num_ctx` 扩展上下文
- **无审查 GGUF 实验室（LM Studio）**：当 Web 模型审查与默认安全对齐构成限制时，参见
  [无审查开源权重模型指南](uncensored-models.md) — LM Studio 在 `http://localhost:1234/v1`
  暴露 OpenAI 兼容 API，可直接接入 `openweight` 提供商。⚠️ 仅限隔离、授权环境使用。

## 共同限制

| 项目 | Claude（原始） | OpenAI 兼容模型（本项目） |
|------|----------------|---------------------------|
| 原生技能系统 | 有 | 无 → 由中间件复现 |
| 工具执行（Bash 等） | 有 | 无 → 仅给出工具命令 |
| 多轮代理循环 | 有 | 有限 → 以 CLI 会话替代 |

## 推荐配置

| 场景 | provider | model | ORT_MAX_SKILLS |
|------|----------|-------|----------------|
| 云端高性能 | deepseek | deepseek-chat | 3 |
| 中国区域 | glm | glm-4-plus | 3 |
| 免费额度 | glm | glm-4-flash | 2 |
| 本地 32B+ | openweight | qwen2.5:32b | 2 |
| 本地 7B–14B | openweight | qwen2.5:14b | 1 |
