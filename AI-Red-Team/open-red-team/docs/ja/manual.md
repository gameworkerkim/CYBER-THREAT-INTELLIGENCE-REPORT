# Open AI Red Team — ユーザーマニュアル

**言語:** [English](../manual.md)（基準） · [한국어](manual.md) · 日本語（本ドキュメント） · [中文](manual.md)

## 1. インストール

要件: Node.js ≥ 18.18、npm。

```bash
git clone <このリポジトリ>
cd open-red-team
npm install
npm run build
cp .env.example .env
```

## 2. 設定

`.env` を編集します — すべての設定は環境変数です。

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `ORT_PROVIDER` | `deepseek` | デフォルトプロバイダ: `deepseek` \| `glm` \| `openweight` |
| `ORT_SKILLS_DIR` | `./skills` | 移植済みスキルのディレクトリ |
| `ORT_AUTO_LOAD` | `on` | トリガーベースの自動スキルロード |
| `ORT_MAX_SKILLS` | `3` | 1ターンあたりの自動ロード上限 |
| `ORT_INCLUDE_INDEX` | `on` | システムプロンプトにスキル説明（インデックス）を含める |
| `DEEPSEEK_API_KEY` | — | DeepSeek APIキー |
| `DEEPSEEK_MODEL` | `deepseek-chat` | DeepSeekモデル |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeekエンドポイント |
| `GLM_API_KEY` | — | Zhipu BigModel APIキー |
| `GLM_MODEL` | `glm-4-plus` | GLMモデル |
| `GLM_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` | GLMエンドポイント |
| `OPENWEIGHT_BASE_URL` | `http://localhost:11434/v1` | Ollama/vLLM/LM Studioエンドポイント |
| `OPENWEIGHT_MODEL` | `qwen2.5:32b` | ローカルモデル名 |
| `OPENWEIGHT_API_KEY` | `ollama` | ダミーキー（Ollamaは無視） |

## 3. プロバイダ

### DeepSeek

```bash
# platform.deepseek.com → API Keys
export DEEPSEEK_API_KEY=sk-...
npx ort chat --provider deepseek
```

### GLM（Zhipu BigModel）

```bash
# open.bigmodel.cn → API Keys
export GLM_API_KEY=...
npx ort chat --provider glm --model glm-4-flash
```

### オープンウェイト（Ollama）

```bash
ollama pull qwen2.5:32b
ollama serve
# OPENWEIGHT_BASE_URL=http://localhost:11434/v1（デフォルト）
npx ort chat --provider openweight --model qwen2.5:32b
```

### vLLM / LM Studio

OpenAI互換サーバならすべて動作 — `OPENWEIGHT_BASE_URL` をそのサーバの `/v1` エンドポイントに
設定します。LM Studio は `http://localhost:1234/v1` に公開します。Webモデルの検閲・既定の
安全アライメントが制約となる無検閲GGUFラボのテストは
[無検閲オープンウェイトモデルガイド](uncensored-models.md) を参照。
 隔離・許可された環境のみで使用してください。

## 4. CLIリファレンス

### `ort chat` — 対話セッション

`ort` にはグローバルインストール（`npm i -g .`）が必要です。それ以外は `ort` の代わりに `node dist/src/cli.js` を使用してください。

```
npx ort chat [--provider <p>] [--model <m>] [--skills <s1,s2>]

セッション内コマンド:
  /skills        スキル一覧表示
  /reset         会話履歴のクリア
  /exit          終了
メッセージ内ディレクティブ:
  /use <skill>   現在のターンでスキルを強制ロード
```

### `ort ask` — 単発クエリ

```
npx ort ask "SQLインジェクションのテスト方法" --provider deepseek
```

### `ort skills` — スキル確認

```
npx ort skills list             # 全スキル（名前・カテゴリ・説明）
npx ort skills show <name>      # スキル本文の全文表示
```

## 5. ライブラリAPI

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",          // "glm" | "openweight" を選択可
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
  autoLoad: true,                // トリガーベースのロード
  maxSkills: 3,
  includeIndex: true,
});

await ort.init();                // スキルをディスクからロード
ort.listSkills();                // [{frontmatter, body, path}]

const result = await ort.chat("SQLインジェクションのテスト方法", {
  skills: ["offensive-sqli"],    // 強制ロード
  onDelta: (d) => process.stdout.write(d),  // ストリーミング
});
// result: { content, matchedSkills, provider, model }

ort.reset();                     // 履歴のクリア
```

## 6. スキルシステム

各スキルは frontmatter を拡張した `SKILL.md` ファイルです:

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

- **Progressive disclosure** — システムプロンプトには説明（インデックス）のみ常駐し、トリガー一致時のみスキル本文がロードされます。
- **トリガー** — キーワード（英・韓）と `/regex/` パターンに対応。
- **明示的ロード** — メッセージ内の `/use offensive-sqli` または `--skills` フラグ。

## 7. トラブルシューティング

| 症状 | 対処 |
|------|------|
| `401` / 認証エラー | 該当プロバイダのAPIキー環境変数を確認 |
| スキルがロードされない | `ORT_SKILLS_DIR` を確認、`npx ort skills list` を実行 |
| マッチするスキルがない | `/use <skill>` を使用、またはスキルの `triggers` にキーワード追加 |
| 小型ローカルモデルがスキルを無視 | `ORT_MAX_SKILLS=1`、`ORT_INCLUDE_INDEX=off`、32B以上を推奨 |
| Ollamaコンテキスト超過 | Ollama設定の `num_ctx` を拡張 |

## 9. Web ダッシュボード

複数オペレータ・監査対応のブラウザベース管理ダッシュボードです。

```bash
npx ort dashboard                          # http://localhost:8081
ORT_DASHBOARD_TOKEN=secret npx ort dashboard   # Bearerトークン保護
```

| タブ | 機能 |
|------|------|
| Chat | ストリーミングチャット + 自動ロードされたスキルをチップ表示 |
| Skills | 79スキルを名前・カテゴリ・トリガーで検索/絞り込み、本文表示 |
| Audit | JSONL監査ログの直近のやり取りを表示 |
| Config | キーをマスクした読み取り専用設定 |

| Chat | Skills |
|------|--------|
| ![Chat](../../assets/screenshots/dashboard-chat.png) | ![Skills](../../assets/screenshots/dashboard-skills.png) |
| **Audit** | **Config** |
| ![Audit](../../assets/screenshots/dashboard-audit.png) | ![Config](../../assets/screenshots/dashboard-config.png) |

環境変数:

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `ORT_DASHBOARD_PORT` | `8081` | リッスンポート |
| `ORT_DASHBOARD_TOKEN` | *(なし)* | `/api/*` 用 Bearerトークン。空の場合は認証なし（開発専用） |
| `ORT_AUDIT_LOG` | *(なし)* | JSONL監査ログパス（完了時刻・プロバイダ・モデル・一致スキル・文字数を記録） |

Docker:

```bash
docker compose up -d ort    # http://localhost:8081
```

フロントエンドは外部アセット（CDN）なしで完全オフライン動作 — エアギャップ環境に適します。
企業SSOはリバースプロキシの手前に Keycloak（OIDC）を置き、`ORT_DASHBOARD_TOKEN` を無効化してください。

## 10. ガードレール・予算・可観測性

### コンテキスト予算（オーバーフロー防止）

スキル本文はトークン予算までしか注入されません — 静かにオーバーフローしたコンテキストは送られません。
プロバイダ別デフォルト: deepseek 64K/16K、glm 128K/24K、openweight 32K/8K（コンテキスト上限/スキル毎予算）。
`ORT_MAX_CONTEXT`・`ORT_SKILL_BUDGET`・`ORT_RESERVE_TOKENS` で上書き可能。超過本文はセクション単位で
切り詰め（`… [truncated by token budget]`）、`index_only` スキル（例: 554KB `offensive-windows-boundaries`）は
本文注入なしでインデックスのみ維持 — `ort skills show <name>` で閲覧。

### エンゲージメントスコープガードレール

| 変数 | 効果 |
|------|------|
| `ORT_SCOPE` | 申告済みエンゲージメント説明 — システムプロンプトに注入、監査・トレースに記録。ダッシュボード起動に必須（`ORT_SCOPE_MODE=open` 例外） |
| `ORT_SCOPE_DOMAINS` | 範囲内ホスト/ドメイン（カンマ区切り）。範囲外ターゲットは**モデル呼び出し前に拒否**（SSE `denied`、CLI `decision: DENIED`） |
| `ORT_SCOPE_MODE` | `open` ならドメイン検査を無効化（ローカルラボ専用） |
| `ORT_OPERATOR` | 監査エントリ・LangFuseトレースに記録されるオペレータ識別子 |

セッションはインメモリ（LRU上限、アイドル追い出し）で**サーバ再起動後に消えます** — ディスク永続化は本リリースの範囲外です。

### 可観測性

- **LangFuse**: `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY`/`LANGFUSE_BASEURL` 設定時に全チャットをトレース。
- **Prometheus**: ダッシュボードの `/metrics` を compose monitoring プロファイルが自動収集。

## 11. セキュリティと倫理

- スキルは**許可されたテスト専用**の攻撃手法です。
- 書面許可のない実システムに対しては絶対に使用しないでください。
- 練習環境: PortSwigger Web Security Academy、DVWA、HackTheBox、TryHackMe。
