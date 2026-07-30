# Codex Open Security

> Open-weight alternative to [OpenAI Codex Security](https://github.com/openai/codex-security) — CLI + TypeScript SDK for vulnerability scanning with **DeepSeek V4**, **Kimi K3**, and **Qwen**.

[English](#english) · [한국어](#한국어) · [日本語](#日本語)

| | |
|---|---|
| **Preferred distribute** | **Docker** (`ghcr.io/<owner>/codex-open-security`) |
| Package | `@gameworkerkim/codex-open-security` `0.1.0` |
| Runtime | Node.js ≥ 22 (inside the image) |
| License | [CC BY-NC-SA 4.0](./LICENSE) |
| Report | [CTI-2026-0729-CODEX-OPEN-SECURITY](./CTI-2026-0729-CODEX-OPEN-SECURITY_KR.md) |

---

## English

### What it is

OpenAI Codex Security depends on `@openai/codex`, a closed-source Rust binary. This fork calls DeepSeek / Kimi / Qwen over OpenAI-compatible APIs and writes **Markdown · JSON · SARIF** reports. **Docker is the recommended way to run it** — no local Node install required.

### Docker (recommended)

**Build locally**

```bash
cd Codex-Security-KiMI-K3
docker build -t codex-open-security:local .
# or: npm run docker:build
```

**Run**

```bash
export DEEPSEEK_API_KEY="sk-..."   # or MOONSHOT_API_KEY / DASHSCOPE_API_KEY

# Help / list providers
docker run --rm codex-open-security:local --help
docker run --rm codex-open-security:local providers

# Scan the current directory; write reports to ./security-reports
mkdir -p security-reports
docker run --rm \
  -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro \
  -v "$PWD/security-reports":/reports \
  -w /workspace \
  codex-open-security:local \
  scan /workspace -o /reports --provider deepseek

# Other providers
docker run --rm -e MOONSHOT_API_KEY \
  -v "$PWD":/workspace:ro -v "$PWD/security-reports":/reports -w /workspace \
  codex-open-security:local \
  scan /workspace -o /reports --provider kimi

docker run --rm -e DASHSCOPE_API_KEY \
  -v "$PWD":/workspace:ro -v "$PWD/security-reports":/reports -w /workspace \
  codex-open-security:local \
  scan /workspace -o /reports -p qwen -m qwen-plus -f sarif
```

**Compose**

```bash
export DEEPSEEK_API_KEY="sk-..."
# optional: SCAN_TARGET=/path/to/repo REPORT_DIR=./out
docker compose run --rm scan scan /workspace -o /reports --provider deepseek
```

**GHCR (after CI publish)**

```bash
docker pull ghcr.io/<github-owner>/codex-open-security:latest
docker run --rm -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro -v "$PWD/security-reports":/reports -w /workspace \
  ghcr.io/<github-owner>/codex-open-security:latest \
  scan /workspace -o /reports
```

Publish workflow: [`.github/workflows/codex-open-security-docker.yml`](../.github/workflows/codex-open-security-docker.yml)  
- Manual: Actions → **Publish Codex Open Security Docker image**  
- Tag: `codex-open-security-v0.1.0` → pushes `:0.1.0` and `:latest`

Paths inside the container:

| Host | Container |
|------|-----------|
| Repo to scan | `/workspace` (mount read-only) |
| Report output | `/reports` (mount writable; pass `-o /reports`) |

### API keys

| Provider | Env var (primary) | Also accepted |
|----------|-------------------|---------------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

Exit codes: `0` = no critical/high · `1` = critical or high found · `2` = failed (missing key, bad provider, …).

### CLI options (same in Docker / Node)

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

### Node / npm (optional)

```bash
cd Codex-Security-KiMI-K3
npm install && npm run build
export DEEPSEEK_API_KEY="sk-..."
node bin/codex-open-security.mjs scan . -o ./security-reports
```

```ts
import { SecurityScanner, saveReport } from "@gameworkerkim/codex-open-security";
const scanner = new SecurityScanner("deepseek");
const result = await scanner.scan({ target: "./my-app", severity: "medium" });
await saveReport(result, "./reports", "markdown");
```

### Limitations

1. No Codex multi-agent / plugin runtime — single-model batch chat completions  
2. API key only (no OAuth)  
3. No scan history / workbench  
4. Model IDs must match what the provider actually serves  

---

## 한국어

### 무엇인가

OpenAI Codex Security의 오픈웨이트 포크입니다. DeepSeek / Kimi / Qwen API로 코드를 스캔하고 Markdown·JSON·SARIF 리포트를 만듭니다. **배포·실행은 Docker를 권장**합니다 (로컬 Node 설치 불필요).

### Docker (권장)

**이미지 빌드**

```bash
cd Codex-Security-KiMI-K3
docker build -t codex-open-security:local .
# 또는: npm run docker:build
```

**실행**

```bash
export DEEPSEEK_API_KEY="sk-..."

docker run --rm codex-open-security:local providers

mkdir -p security-reports
docker run --rm \
  -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro \
  -v "$PWD/security-reports":/reports \
  -w /workspace \
  codex-open-security:local \
  scan /workspace -o /reports --provider deepseek
```

**Compose**

```bash
export DEEPSEEK_API_KEY="sk-..."
docker compose run --rm scan scan /workspace -o /reports --provider deepseek
```

**GHCR**

```bash
docker pull ghcr.io/<github-owner>/codex-open-security:latest
docker run --rm -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro -v "$PWD/security-reports":/reports -w /workspace \
  ghcr.io/<github-owner>/codex-open-security:latest \
  scan /workspace -o /reports
```

- Actions에서 **Publish Codex Open Security Docker image** 수동 실행  
- 또는 태그 `codex-open-security-v0.1.0` 푸시 → `:0.1.0` + `:latest`

| 호스트 | 컨테이너 |
|--------|----------|
| 스캔할 저장소 | `/workspace` (ro 마운트) |
| 리포트 출력 | `/reports` (`-o /reports`) |

### API 키

| 제공자 | 주 환경변수 | 대체 |
|--------|-------------|------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

종료 코드: `0` = critical/high 없음 · `1` = critical/high 있음 · `2` = 실패.

### Node / npm (선택)

```bash
cd Codex-Security-KiMI-K3
npm install && npm run build
export DEEPSEEK_API_KEY="sk-..."
node bin/codex-open-security.mjs scan . -o ./security-reports
```

### 제한 사항

1. 멀티에이전트·플러그인 미지원  
2. API 키만 (OAuth 없음)  
3. 스캔 이력 / workbench 미구현  
4. 모델 ID는 제공자 실제 서비스명과 일치해야 함  

---

## 日本語

### 概要

OpenAI Codex Security のオープンウェイト版フォークです。DeepSeek / Kimi / Qwen API でスキャンし、Markdown・JSON・SARIF を出力します。**配布・実行は Docker を推奨**します（ローカルに Node 不要）。

### Docker（推奨）

**ビルド**

```bash
cd Codex-Security-KiMI-K3
docker build -t codex-open-security:local .
# または: npm run docker:build
```

**実行**

```bash
export DEEPSEEK_API_KEY="sk-..."

docker run --rm codex-open-security:local providers

mkdir -p security-reports
docker run --rm \
  -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro \
  -v "$PWD/security-reports":/reports \
  -w /workspace \
  codex-open-security:local \
  scan /workspace -o /reports --provider deepseek
```

**Compose**

```bash
export DEEPSEEK_API_KEY="sk-..."
docker compose run --rm scan scan /workspace -o /reports --provider deepseek
```

**GHCR**

```bash
docker pull ghcr.io/<github-owner>/codex-open-security:latest
docker run --rm -e DEEPSEEK_API_KEY \
  -v "$PWD":/workspace:ro -v "$PWD/security-reports":/reports -w /workspace \
  ghcr.io/<github-owner>/codex-open-security:latest \
  scan /workspace -o /reports
```

- Actions の **Publish Codex Open Security Docker image** を手動実行  
- またはタグ `codex-open-security-v0.1.0` を push → `:0.1.0` と `:latest`

| ホスト | コンテナ |
|--------|----------|
| スキャン対象 | `/workspace`（ro マウント） |
| レポート出力 | `/reports`（`-o /reports`） |

### API キー

| プロバイダ | 主な環境変数 | 代替 |
|------------|--------------|------|
| DeepSeek | `DEEPSEEK_API_KEY` | `OPENAI_API_KEY` |
| Kimi K3 | `MOONSHOT_API_KEY` | `KIMI_API_KEY`, `OPENAI_API_KEY` |
| Qwen | `DASHSCOPE_API_KEY` | `QWEN_API_KEY`, `OPENAI_API_KEY` |

終了コード: `0` = critical/high なし · `1` = critical/high あり · `2` = 失敗。

### Node / npm（任意）

```bash
cd Codex-Security-KiMI-K3
npm install && npm run build
export DEEPSEEK_API_KEY="sk-..."
node bin/codex-open-security.mjs scan . -o ./security-reports
```

### 制限事項

1. マルチエージェント / プラグイン未対応  
2. API キーのみ（OAuth なし）  
3. スキャン履歴 / workbench 未実装  
4. モデル ID は各プロバイダの実名と一致させること  

---

## Architecture

```
Docker image (node:22-slim)
└── ENTRYPOINT node /app/bin/codex-open-security.mjs
    ├── SecurityScanner → DeepSeek / Kimi / Qwen (openai SDK)
    └── Reporter → Markdown / JSON / SARIF
```

| File | Role |
|------|------|
| `Dockerfile` | Multi-stage build → runtime image |
| `docker-compose.yml` | Local scan helper (`/workspace` + `/reports`) |
| `.dockerignore` | Keep build context small |
| `.github/workflows/codex-open-security-docker.yml` | Build & push to GHCR |

## Comparison

| Feature | OpenAI Codex Security | Codex Open Security |
|---------|----------------------|---------------------|
| Backend | `@openai/codex` (closed Rust) | `openai` npm SDK |
| Distribute | npm / vendor CLI | **Docker (primary)** · npm optional |
| Models | GPT series | DeepSeek V4, Kimi K3, Qwen |
| Auth | OAuth + API key | API key only |
| Reports | JSON / SARIF / Markdown | Same |
| License | Apache 2.0 (upstream) | **CC BY-NC-SA 4.0** (this fork) |

---

**Dennis Kim** · [github.com/gameworkerkim](https://github.com/gameworkerkim) · CTI-2026-0729
