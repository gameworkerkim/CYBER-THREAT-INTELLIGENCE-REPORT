# Model Compatibility Matrix

**Languages:** English (base) · [한국어](ko/model-matrix.md) · [日本語](ja/model-matrix.md) · [中文](zh/model-matrix.md)

## DeepSeek

| Item | Value |
|------|-------|
| API | `https://api.deepseek.com/v1` — OpenAI-compatible |
| Models | `deepseek-chat` (V3, 64K), `deepseek-reasoner` (R1) |
| Context | 64K (128K beta) |
| System prompt | Supported |
| Streaming | Supported |
| Function calling | Supported (limited) |

Notes:
- `deepseek-reasoner` supports system prompt injection but generates CoT internally → slower with large skill bodies
- High instruction-following with offensive prompts
- Near temperature 1.0 in reasoning mode it may drift from skill instructions — `deepseek-chat` recommended

## GLM (Zhipu BigModel)

| Item | Value |
|------|-------|
| API | `https://open.bigmodel.cn/api/paas/v4` — OpenAI-compatible |
| Models | `glm-4-plus`, `glm-4-air`, `glm-4-flash` |
| Context | 128K |
| System prompt | Supported |
| Streaming | Supported |
| Function calling | Supported |

Notes:
- Some models return a separate `reasoning_content` field — middleware merges it
- Tool-use message format differs slightly from OpenAI — irrelevant for text chat
- `glm-4-flash` has a free tier; suitable for large skill index injection

## Open-weight (Ollama / vLLM / LM Studio)

| Item | Value |
|------|-------|
| API | Ollama `http://localhost:11434/v1`, vLLM `.../v1` — OpenAI-compatible |
| Models | `qwen2.5:32b`, `deepseek-r1:32b`, `llama3.1:70b`, `mistral:7b`, … |
| Context | Model-dependent (4K–128K) |
| System prompt | Mostly supported |
| Streaming | Supported |

Notes:
- 7B-class models lose instruction adherence with more than one skill body → `ORT_MAX_SKILLS=1`
- Quantized GGUF models reproduce detailed payloads (SQLi/shellcode) poorly — 32B+ recommended
- Ollama: extend context with `keep_alive`/`num_ctx`
- **Uncensored GGUF labs (LM Studio)**: for AI red-team testing where web-model censorship and
  default safety alignment get in the way, see the
  [Uncensored Open-Weight Models guide](uncensored-models.md) — LM Studio exposes an
  OpenAI-compatible API at `http://localhost:1234/v1` that plugs directly into the
  `openweight` provider. Isolated, authorized environments only.

## Common constraints

| Item | Claude (original) | OpenAI-compatible models (this project) |
|------|-------------------|------------------------------------------|
| Native skill system | Yes | No → reproduced by middleware |
| Tool execution (Bash, …) | Yes | No → tool commands suggested only |
| Multi-turn agent loop | Yes | Limited → CLI session substitute |

## Recommended settings

| Scenario | provider | model | ORT_MAX_SKILLS |
|----------|----------|-------|----------------|
| Cloud, high performance | deepseek | deepseek-chat | 3 |
| China region | glm | glm-4-plus | 3 |
| Free tier | glm | glm-4-flash | 2 |
| Local 32B+ | openweight | qwen2.5:32b | 2 |
| Local 7B–14B | openweight | qwen2.5:14b | 1 |
