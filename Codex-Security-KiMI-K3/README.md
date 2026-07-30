# Codex Open Security

> Open-weight alternative to [OpenAI Codex Security](https://github.com/openai/codex-security) — CLI + TypeScript SDK for vulnerability scanning with **DeepSeek V4**, **Kimi K3**, and **Qwen**.

[English](#english) · [한국어](#한국어) · [日本語](#日本語)

| | |
|---|---|
| Package | `@gameworkerkim/codex-open-security` `0.1.0` |
| Runtime | **Node.js ≥ 22** |
| License | [CC BY-NC-SA 4.0](./LICENSE) |
| Report | [CTI-2026-0729-CODEX-OPEN-SECURITY](./CTI-2026-0729-CODEX-OPEN-SECURITY_KR.md) |

---

## English

### What it is

OpenAI Codex Security depends on `@openai/codex`, a closed-source Rust binary with a hardcoded OpenAI backend. This fork:

- Calls providers through the open `openai` npm SDK (OpenAI-compatible APIs)
- Supports **DeepSeek**, **Kimi (Moonshot)**, and **Qwen (DashScope)**
- Emits the same report shapes: **Markdown**, **JSON**, **SARIF 2.1**
- Needs no proprietary binary — only an API key

### Install

**From this repo (recommended while unpublished / developing):**

```bash
cd Codex-Security-KiMI-K3
npm install
npm run build
node bin/codex-open-security.mjs --help
```

**As a package (when published):**

```bash
npm install @gameworkerkim/codex-open-security
npx codex-open-security --help
```

### API keys

Set one env var for the provider you use (or pass `-k` / `--api-key`):

| Provider | Env var (primary) | Also accepted |
|----------|-------------------|---------------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

```bash
export DEEPSEEK_API_KEY="sk-..."
# or
export MOONSHOT_API_KEY="sk-..."
# or
export DASHSCOPE_API_KEY="sk-..."
```

If there are files to scan and no key is set, the CLI exits with a clear error (exit code `2`).

### Usage

```bash
# List providers / models
node bin/codex-open-security.mjs providers
# or: npx codex-open-security providers

# Scan current directory (DeepSeek default)
node bin/codex-open-security.mjs scan .

# Provider + model
node bin/codex-open-security.mjs scan . --provider deepseek --model deepseek-reasoner
node bin/codex-open-security.mjs scan . --provider kimi
node bin/codex-open-security.mjs scan . --provider qwen --model qwen-plus

# Output format & directory
node bin/codex-open-security.mjs scan ./src -o ./security-reports -f markdown
node bin/codex-open-security.mjs scan ./src -f json
node bin/codex-open-security.mjs scan ./src -f sarif

# Minimum severity filter
node bin/codex-open-security.mjs scan . --severity medium

# Specific paths only
node bin/codex-open-security.mjs scan . --paths src/auth.ts src/api.ts

# Pass key on the CLI
node bin/codex-open-security.mjs scan . -p deepseek -k "sk-..."
```

Exit codes: `0` = no critical/high findings · `1` = critical or high found · `2` = scan failed (missing key, bad provider, etc.).

### CLI options

```
codex-open-security scan [target]

  -p, --provider <provider>   deepseek | kimi | qwen   (default: deepseek)
  -m, --model <model>         Model ID override
  -k, --api-key <key>         API key (or use env)
  -o, --output <dir>          Report directory         (default: ./security-reports)
  -f, --format <format>       json | sarif | markdown  (default: markdown)
  -s, --severity <level>      critical | high | medium | low  (default: low)
      --paths <paths...>      Limit to these files (relative to target)
```

### Supported providers

| Provider | Default model | Other models | Base URL |
|----------|---------------|--------------|----------|
| **deepseek** | `deepseek-chat` | `deepseek-reasoner` | `https://api.deepseek.com` |
| **kimi** | `kimi-k3` | — | `https://api.moonshot.cn/v1` |
| **qwen** | `qwen-max` | `qwen-plus` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |

### TypeScript SDK

```ts
import { SecurityScanner, saveReport } from "@gameworkerkim/codex-open-security";

const scanner = new SecurityScanner("deepseek", "deepseek-chat");
const result = await scanner.scan({
  target: "./my-app",
  severity: "medium",
});

console.log(`Found ${result.summary.total} findings`);
await saveReport(result, "./reports", "markdown");
```

### Limitations

1. No Codex multi-agent / plugin runtime — single-model batch chat completions
2. No interactive OAuth login — API key only
3. No scan history / workbench (`list` / `compare` / `rerun`)
4. Model IDs must match what the provider actually serves (especially Moonshot)

---

## 한국어

### 무엇인가

OpenAI Codex Security는 폐쇄형 Rust 바이너리 `@openai/codex`에 의존합니다. 이 포크는:

- `openai` npm SDK로 DeepSeek / Kimi / Qwen OpenAI 호환 API를 직접 호출
- 리포트 포맷 **Markdown · JSON · SARIF** 유지
- 전용 바이너리 없이 API 키만으로 동작

### 설치

**이 저장소에서 (개발·로컬):**

```bash
cd Codex-Security-KiMI-K3
npm install
npm run build
node bin/codex-open-security.mjs --help
```

**패키지 설치 시:**

```bash
npm install @gameworkerkim/codex-open-security
npx codex-open-security --help
```

### API 키

| 제공자 | 주 환경변수 | 대체 |
|--------|-------------|------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

```bash
export DEEPSEEK_API_KEY="sk-..."
```

스캔할 파일이 있는데 키가 없으면 명확한 오류 메시지와 함께 종료 코드 `2`로 끝납니다.

### 사용법

```bash
# 제공자·모델 목록
node bin/codex-open-security.mjs providers

# 현재 디렉터리 스캔 (기본: deepseek)
node bin/codex-open-security.mjs scan .

# 제공자별
node bin/codex-open-security.mjs scan . --provider deepseek --model deepseek-reasoner
node bin/codex-open-security.mjs scan . --provider kimi
node bin/codex-open-security.mjs scan . --provider qwen --model qwen-plus

# 출력
node bin/codex-open-security.mjs scan ./src -o ./security-reports -f markdown
node bin/codex-open-security.mjs scan ./src -f json
node bin/codex-open-security.mjs scan ./src -f sarif

# 심각도 필터 / 특정 파일만
node bin/codex-open-security.mjs scan . --severity medium
node bin/codex-open-security.mjs scan . --paths src/auth.ts src/api.ts

# CLI로 키 전달
node bin/codex-open-security.mjs scan . -p deepseek -k "sk-..."
```

종료 코드: `0` = critical/high 없음 · `1` = critical 또는 high 발견 · `2` = 실패(키 없음, 잘못된 provider 등).

### CLI 옵션

```
codex-open-security scan [target]

  -p, --provider <provider>   deepseek | kimi | qwen   (기본: deepseek)
  -m, --model <model>         모델 ID 지정
  -k, --api-key <key>         API 키 (또는 환경변수)
  -o, --output <dir>          리포트 디렉터리           (기본: ./security-reports)
  -f, --format <format>       json | sarif | markdown  (기본: markdown)
  -s, --severity <level>      critical | high | medium | low  (기본: low)
      --paths <paths...>      지정한 파일만 스캔
```

### TypeScript SDK

```ts
import { SecurityScanner, saveReport } from "@gameworkerkim/codex-open-security";

const scanner = new SecurityScanner("deepseek", "deepseek-chat");
const result = await scanner.scan({
  target: "./my-app",
  severity: "medium",
});

console.log(`발견 ${result.summary.total}건`);
await saveReport(result, "./reports", "markdown");
```

### 제한 사항

1. Codex 멀티에이전트·플러그인 런타임 미지원 (단일 모델 배치 분석)
2. OAuth 로그인 없음 — API 키만
3. 스캔 이력 / workbench 미구현
4. 모델 ID는 각 제공자가 실제로 서비스하는 이름과 일치해야 함

---

## 日本語

### 概要

OpenAI Codex Security はクローズドな Rust バイナリ `@openai/codex` に依存します。このフォークは:

- `openai` npm SDK 経由で DeepSeek / Kimi / Qwen の OpenAI 互換 API を直接呼び出し
- レポート形式 **Markdown · JSON · SARIF** を維持
- 専用バイナリ不要 — API キーのみで動作

### インストール

**このリポジトリから（開発・ローカル）:**

```bash
cd Codex-Security-KiMI-K3
npm install
npm run build
node bin/codex-open-security.mjs --help
```

**パッケージとして:**

```bash
npm install @gameworkerkim/codex-open-security
npx codex-open-security --help
```

### API キー

| プロバイダ | 主な環境変数 | 代替 |
|------------|--------------|------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

```bash
export DEEPSEEK_API_KEY="sk-..."
```

スキャン対象ファイルがあるのにキー未設定の場合は、明確なエラーで終了コード `2` になります。

### 使い方

```bash
# プロバイダ / モデル一覧
node bin/codex-open-security.mjs providers

# カレントディレクトリをスキャン（既定: deepseek）
node bin/codex-open-security.mjs scan .

# プロバイダ別
node bin/codex-open-security.mjs scan . --provider deepseek --model deepseek-reasoner
node bin/codex-open-security.mjs scan . --provider kimi
node bin/codex-open-security.mjs scan . --provider qwen --model qwen-plus

# 出力
node bin/codex-open-security.mjs scan ./src -o ./security-reports -f markdown
node bin/codex-open-security.mjs scan ./src -f json
node bin/codex-open-security.mjs scan ./src -f sarif

# 重要度フィルタ / 特定ファイルのみ
node bin/codex-open-security.mjs scan . --severity medium
node bin/codex-open-security.mjs scan . --paths src/auth.ts src/api.ts

# CLI でキーを渡す
node bin/codex-open-security.mjs scan . -p deepseek -k "sk-..."
```

終了コード: `0` = critical/high なし · `1` = critical または high あり · `2` = 失敗（キー欠如・不正な provider など）。

### CLI オプション

```
codex-open-security scan [target]

  -p, --provider <provider>   deepseek | kimi | qwen   (既定: deepseek)
  -m, --model <model>         モデル ID 上書き
  -k, --api-key <key>         API キー（または環境変数）
  -o, --output <dir>          レポート出力先             (既定: ./security-reports)
  -f, --format <format>       json | sarif | markdown  (既定: markdown)
  -s, --severity <level>      critical | high | medium | low  (既定: low)
      --paths <paths...>      指定ファイルのみスキャン
```

### TypeScript SDK

```ts
import { SecurityScanner, saveReport } from "@gameworkerkim/codex-open-security";

const scanner = new SecurityScanner("deepseek", "deepseek-chat");
const result = await scanner.scan({
  target: "./my-app",
  severity: "medium",
});

console.log(`検出 ${result.summary.total} 件`);
await saveReport(result, "./reports", "markdown");
```

### 制限事項

1. Codex マルチエージェント / プラグイン実行系は未対応（単一モデル・バッチ分析）
2. OAuth ログインなし — API キーのみ
3. スキャン履歴 / workbench 未実装
4. モデル ID は各プロバイダが実際に提供する名称と一致させること

---

## Architecture

```
codex-open-security (Node.js CLI)
├── SecurityScanner (scanner.ts)
│   ├── providers.ts  → DeepSeek / Kimi / Qwen
│   └── openai npm SDK
├── Reporter (reporter.ts) → Markdown / JSON / SARIF
└── CLI (commander) → scan | providers
```

## Comparison

| Feature | OpenAI Codex Security | Codex Open Security |
|---------|----------------------|---------------------|
| Backend | `@openai/codex` (closed Rust) | `openai` npm SDK |
| Models | GPT series (vendor-locked) | DeepSeek V4, Kimi K3, Qwen |
| Auth | ChatGPT OAuth + API key | API key only |
| Multi-agent | Native | Not supported |
| Reports | JSON / SARIF / Markdown | Same |
| License | Apache 2.0 (upstream) | **CC BY-NC-SA 4.0** (this fork) |

---

**Dennis Kim** · [github.com/gameworkerkim](https://github.com/gameworkerkim) · CTI-2026-0729
