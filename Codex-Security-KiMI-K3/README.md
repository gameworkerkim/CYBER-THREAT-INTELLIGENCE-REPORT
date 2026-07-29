# Codex Open Security

> **Open-weight alternative to OpenAI Codex Security** — CLI and TypeScript SDK for finding security vulnerabilities using **DeepSeek V4, Kimi K3, and Qwen**.

[English](#english) | [한국어](#한국어)

---

## English

`@gameworkerkim/codex-open-security` is an open-weight fork of OpenAI's [Codex Security](https://github.com/openai/codex-security), replacing the proprietary OpenAI backend with open-weight models (DeepSeek, Kimi K3, Qwen) using the OpenAI-compatible API format.

### Why?

OpenAI Codex Security requires `@openai/codex` — a closed-source Rust binary. This fork:

- Replaces the native binary with direct `openai` SDK calls
- Supports **DeepSeek V4**, **Kimi K3**, and **Qwen3** via their OpenAI-compatible endpoints
- Maintains the same CLI interface and report format (JSON, SARIF, Markdown)
- Runs entirely on open-weight model infrastructure

### Quick Start

```bash
npm install @gameworkerkim/codex-open-security

# Set your API key (any OpenAI-compatible provider)
export DEEPSEEK_API_KEY="sk-..."

# Scan a repository
npx codex-open-security scan . --provider deepseek

# Use Kimi K3
npx codex-open-security scan . --provider kimi

# Use Qwen
npx codex-open-security scan . --provider qwen --model qwen-max

# Deep scan with reasoning model
npx codex-open-security scan . --provider deepseek --model deepseek-reasoner --severity medium
```

### Supported Providers

| Provider | Models | Base URL | Env Var |
|----------|--------|----------|---------|
| **DeepSeek** | `deepseek-chat` (V4), `deepseek-reasoner` (V4-Pro) | `api.deepseek.com` | `DEEPSEEK_API_KEY` |
| **Kimi K3** | `kimi-k3` | `api.moonshot.cn/v1` | `MOONSHOT_API_KEY` |
| **Qwen** | `qwen-max`, `qwen-plus` | `dashscope-intl.aliyuncs.com/compatible-mode/v1` | `DASHSCOPE_API_KEY` |

### TypeScript SDK

```ts
import { SecurityScanner, saveReport } from "@gameworkerkim/codex-open-security";

const scanner = new SecurityScanner("deepseek", "deepseek-chat");
const result = await scanner.scan({
  target: "./my-app",
  severity: "medium",
});

console.log(`Found ${result.summary.total} findings`);

const paths = await saveReport(result, "./reports", "markdown");
```

### CLI Options

```
codex-open-security scan [target]

Options:
  -p, --provider <provider>  deepseek | kimi | qwen (default: deepseek)
  -m, --model <model>        Model ID override
  -k, --api-key <key>        API key
  -o, --output <dir>         Output directory (default: ./security-reports)
  -f, --format <format>      json | sarif | markdown (default: markdown)
  -s, --severity <level>     Filter: critical | high | medium | low (default: low)
  --paths <paths...>         Specific files to scan
```

### Architecture

```
codex-open-security (Node.js CLI)
├── SecurityScanner (scanner.ts)
│   ├── Provider abstraction (providers.ts)
│   │   ├── DeepSeek (api.deepseek.com)
│   │   ├── Kimi K3 (api.moonshot.cn)
│   │   └── Qwen (dashscope.aliyuncs.com)
│   └── OpenAI SDK client (openai npm)
├── Reporter (reporter.ts)
│   ├── JSON output
│   ├── SARIF 2.1.0 output
│   └── Markdown report
└── CLI (commander)
```

### Comparison: Original vs Fork

| Feature | OpenAI Codex Security | Codex Open Security |
|---------|----------------------|---------------------|
| Backend | `@openai/codex` (Rust binary, closed-source) | `openai` npm SDK (open-source) |
| Models | GPT-5.6 series only | DeepSeek V4, Kimi K3, Qwen |
| API base URL | Hardcoded in Rust binary | Configurable per provider |
| Cost tracking | Per-token nanodollar pricing | Provider-native pricing |
| Multi-agent | Native Codex agent orchestration | Single-model, batch-based |
| Plugins | Python plugin system (`_bundled_plugin/`) | Prompt-based analysis |
| Structured output | OpenAI response_format (native) | OpenAI-compatible response_format |
| License | Apache 2.0 | Apache 2.0 (same) |

### Limitations

1. **No native Codex agent** — This fork uses direct chat completions. It does not support the multi-agent workflow (`features.multi_agent_v2`) or plugin system.
2. **No Python plugin** — The bundled `_bundled_plugin/` (Python security scanning skills) is OpenAI-specific. This fork uses prompt engineering instead.
3. **No interactive login** — Requires API key via environment variable or `--api-key` flag.
4. **No scan history / workbench** — State management (`scans list/show/rerun/compare`) is not implemented.
5. **No bulk-scan / CSV mode** — Not yet available.

---

## 한국어

`@gameworkerkim/codex-open-security`는 OpenAI의 [Codex Security](https://github.com/openai/codex-security)를 오픈웨이트 모델(DeepSeek, Kimi K3, Qwen)에서 동작하도록 포팅한 포크입니다.

### 왜 만들었나?

OpenAI Codex Security는 `@openai/codex`라는 Rust 바이너리에 의존합니다. 이 포크는:

- 네이티브 바이너리 의존성을 제거하고 `openai` npm SDK로 대체
- **DeepSeek V4**, **Kimi K3**, **Qwen3**의 OpenAI 호환 API를 지원
- 동일한 CLI 인터페이스와 리포트 포맷(JSON, SARIF, Markdown) 유지
- 완전히 오픈웨이트 인프라 위에서 동작

### 빠른 시작

```bash
npm install @gameworkerkim/codex-open-security

# API 키 설정
export DEEPSEEK_API_KEY="sk-..."

# 스캔 실행
npx codex-open-security scan . --provider deepseek

# Kimi K3 사용
npx codex-open-security scan . --provider kimi

# Qwen 사용
npx codex-open-security scan . --provider qwen --model qwen-max
```

### 지원 제공자

| 제공자 | 모델 | 엔드포인트 | 환경변수 |
|--------|------|------------|----------|
| **DeepSeek** | `deepseek-chat` (V4), `deepseek-reasoner` (V4-Pro) | `api.deepseek.com` | `DEEPSEEK_API_KEY` |
| **Kimi K3** | `kimi-k3` | `api.moonshot.cn/v1` | `MOONSHOT_API_KEY` |
| **Qwen** | `qwen-max`, `qwen-plus` | `dashscope-intl.aliyuncs.com/compatible-mode/v1` | `DASHSCOPE_API_KEY` |

### 라이선스

Apache 2.0 — OpenAI Codex Security 원본 라이선스 유지.

---

**Dennis Kim** · [github.com/gameworkerkim](https://github.com/gameworkerkim) · CTI-2026-0729
