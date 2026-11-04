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
| `ORT_DB_PATH` | `./data/ort.db` | ローカルアカウント・ランタイム設定用 SQLite パス |
| `ORT_AUTH_SECRET` | *(自動)* | ログイントークン HMAC シークレット（空なら生成してDBに保存） |
| `ORT_DISABLE_LOCAL_AUTH` | `0` | `1` でローカルアカウント無効化（OIDC/静的トークンのみ） |
| `ORT_DASHBOARD_TOKEN` | *(なし)* | 静的 Bearer トークン（ローカルアカウントの代替） |
| `ORT_OIDC_ISSUER` | *(なし)* | Keycloak/OIDC 発行者 — 設定時はOIDCアクセストークン必須（優先） |
| `ORT_OIDC_AUDIENCE` | *(なし)* | 期待する `aud` クレーム |
| `ORT_METRICS_TOKEN` | *(なし)* | `/metrics` トークン（空ならダッシュボード認証を適用） |
| `ORT_AUDIT_LOG` | *(なし)* | JSONL監査ログパス（sessionId・operator・decision・一致スキル・プロンプトSHA-256 — 原文なし） |
| `ORT_AUDIT_REQUIRED` | `0` | `1` なら監査書込失敗時にリクエスト失敗 |

### ローカルアカウント（SQLite）

初回起動時にデフォルトアカウント **admin / admin** を生成し、他のAPI利用前にパスワード変更を強制します
（`403 password change required`）。ログインでHMAC署名トークン（12時間）を発行し、
`Authorization: Bearer <token>` で使用します。

| エンドポイント | 用途 |
|----------------|------|
| `POST /api/auth/login` | `{username, password}` → `{token, username, role, mustChangePassword}` |
| `GET /api/auth/me` | 現在ユーザー（`username`, `role`, `mustChangePassword`） |
| `POST /api/auth/change-password` | `{currentPassword, newPassword}`（8文字以上） |

### ランタイム設定（Settingsタブ）

管理者はダッシュボードのSettingsタブからスコープ・予算・エンジン設定を変更できます
（`GET/PUT /api/settings`）。DB値が環境変数より優先され、空値は環境変数へフォールバックします。
変更可能キー: `ORT_SCOPE`, `ORT_SCOPE_DOMAINS`, `ORT_SCOPE_MODE`, `ORT_OPERATOR`,
`ORT_MAX_CONTEXT`, `ORT_SKILL_BUDGET`, `ORT_RESERVE_TOKENS`, `ORT_MAX_SKILLS`,
`ORT_INCLUDE_INDEX`, `ORT_AUTO_LOAD`。プロバイダ/モデル/APIキーの変更は再起動が必要です。

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

## 12. レビュー指摘と検証状況

累積レビュー指摘（4ラウンド）と現状です。

### P0 — 致命的指摘、すべて解決・実測確認

| # | 指摘 | 状態 |
|---|------|------|
| 1 | スキル本文の全量注入 → コンテキストオーバーフロー（単一スキル ~138Kトークン） | トークン予算エンジン + 巨大スキル6種 `index_only`、実行時プロンプト ~6-8Kトークン実測 |
| 2 | テスト皆無 | vitest 63件/12ファイル |
| 3 | CLIのみ → `docker compose up -d` が動作せず | Expressダッシュボード + compose `command: ["dashboard"]` |
| 4 | 範囲強制なし → 全入力をモデルへ送信 | `decision: deny` でプロバイダ呼び出し前に返却 — 呼び出しカウンタで0回を確認 |
| 5 | fail-open起動（無認証/無スコープ） | どちらも exit 1 で拒否 |

### P1 — 信頼性・運用の指摘、解決

| # | 指摘 | 状態 |
|---|------|------|
| 6 | LangFuse監査がコード未連携 | `recordChat` トレーシング + JSONL監査 `promptSha256`（原文なし） |
| 7 | Keycloak（OIDC）未連携 | OIDCミドルウェア: discovery + JWKS + RS256 |
| 8 | npm binパス破損（`npx ort` 不可） | `dist/src/cli.js` に修正 |
| 9 | LICENSEなし | 追加（MIT + claude-red 出典表示） |
| 10 | `reasoning_content` 破棄・ストリーミング固定 | 推論の捕捉 + non-stream フォールバック |
| 11 | シークレットが全て `change-me` | `docker-compose.infra.yml` 分離 + 必須置換 `${VAR:?}` |
| 12 | PoCプロファイルのLLM既定値不一致 | Ollama に整合 + `depends_on: ollama-pull` |
| 13 | 運用者間の履歴共有 | `SessionStore`（LRU・アイドル追い出し）+ OIDC `sub` 帰属 |
| 14 | 履歴の無限増加 | ターン予算 + `[earlier turns omitted]` マーカー |
| 15 | 検索品質の基準線なし | 30クエリfixture + 閾値（top-1 ≥ 0.85、top-3 ≥ 0.95） |

### P2 — 仕上げ・境界、解決

- CLIバージョンのハードコード（0.1.0）→ `package.json` から動的ロード
- 死んだメトリクス・ルートラベル → 整理
- `compliance.md`/アーキテクチャ統制表を4言語で整備
- `index_only` スキルはSkillsタブに「본문 미주입」バッジ

### 既知の制限（軽微）

1. **CIワークフロー**: リポジトリルート `.github/workflows/open-red-team.yml` に配置（GitHubはルートでのみ実行）、
   パスフィルタ適用済み。ローカル実行は検証済み、ホストされたゲートの実動作は未確認。
2. **vLLM実起動 / Keycloak OIDC往復**: コード・compose・realm構成は検証済み。GPU/Dockerインフラ不在のため実起動は未確認。
3. **イメージ既定 `CMD` は `chat`**（対話型）— compose が `dashboard` に上書き。意図的な二重用途。
4. **拒否監査に `flaggedTargets`（ホストのみ、プロンプト原文なし）を記録** — 設計上の情報提供。
