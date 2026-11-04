# Open AI Red Team

**モデル非依存の攻撃的セキュリティスキルセット + ミドルウェア — Claude Red の代替・拡張、DeepSeek・GLM・オープンウェイトモデル向け**

[claude-red](https://github.com/SnailSploit/Claude-Red) スキルライブラリ（MIT）を完全移植し、Claude 依存を解消したプロジェクトです。
同じレッドチームスキルが DeepSeek、GLM（Zhipu）、オープンウェイトモデル（Ollama / vLLM / LM Studio）で動作し、
クラウド・オンプレミス・完全オフライン（エアギャップ）環境をすべてサポートします。

**ドキュメント言語:** [English](README.md)（基準） · [한국어](README.ko.md) · 日本語（本ドキュメント） · [中文](README.zh.md)

## 目的 — Claude Red の代替・拡張

| Claude Red（オリジナル） | Open AI Red Team（本プロジェクト） |
|--------------------------|--------------------------------|
| Claude 専用スキル（Claudeスキルシステム用 `SKILL.md`） | モデル非依存スキル: **DeepSeek、GLM、オープンウェイト**で同一手法を使用 |
| Anthropic API 依存（データが外部へ流出） | **オンプレミス／エアギャップ運用** — 内部データが組織外に出ない |
| ベンダー価格・データ保持ポリシー適用 | **コスト削減** — オープンウェイトモデル（トークン単価0円）と低コストAPI |
| Claude ネイティブスキルシステムに固定 | **拡張** — トリガーエンジン、英・韓トリガー、明示的ロード、完全なCLI |

## 主な機能

- **移植済みスキル79個、23カテゴリ** — claude-red 全ライブラリ: Web、Infrastructure & Red Team、
  API Security、Cloud、AI Security、Active Directory、Wireless、Exploit Development、Fuzzing 等
- **Red Team のための LLM 拡張** — Claude Skills の progressive disclosure とトリガーベースの
  オンデマンドロードをあらゆる OpenAI 互換モデルに再現
- **プロバイダ抽象化** — DeepSeek、GLM（Zhipu）、オープンウェイト（Ollama/vLLM/LM Studio/llama.cpp）を単一インターフェースで
- **トリガーエンジン** — キーワード・正規表現マッチング＋スコアリング、韓国語・英語トリガー
- **明示的制御** — `/use <skill>`、`--skills` フラグ、自動ロード on/off、スキルインデックス on/off
- **CLI + ライブラリ** — 対話型 `ort chat`、単発 `ort ask`、スキル確認、TypeScript API
- **Webダッシュボード** — ブラウザベース管理コンソール（ストリーミングチャット、スキルブラウザ、
  JSONL監査証跡、マスク済み設定）— 複数オペレータ・監査運用、CDNなしでエアギャップ対応
- **コンテキスト予算エンジン** — モデル別トークン上限＋セクション単位のスキル切り詰め、
  巨大スキルの `index_only`（コンテキストオーバーフロー防止）
- **安全ガードレール** — 申告済みエンゲージメントスコープ（`ORT_SCOPE`/`ORT_SCOPE_DOMAINS`）と
  範囲外ターゲットのフラグ、オペレータ帰属の監査記録
- **コンプライアンス連携** — Prometheus `/metrics`、OIDC（Keycloak）API認証、LangFuseトレーシング
- **多言語ドキュメント** — 英語（基準）、韓国語、日本語、中国語
- **オンプレミス対応** — ローカルモデルで機微な対象情報を社内環境に保持

## スクリーンショット

| ダッシュボード — Chat | ダッシュボード — Skills |
|-----------------------|-------------------------|
| ![Chat タブ](assets/screenshots/dashboard-chat.png) | ![Skills タブ](assets/screenshots/dashboard-skills.png) |
| **ダッシュボード — Audit** | **ダッシュボード — Config** |
| ![Audit タブ](assets/screenshots/dashboard-audit.png) | ![Config タブ](assets/screenshots/dashboard-config.png) |

## 構成要素

| ディレクトリ | 内容 |
|--------------|------|
| `skills/` | 移植済みスキル（モデル非依存 `SKILL.md`）— トリガーベースのオンデマンドロード |
| `src/` | ミドルウェア — プロバイダ抽象化（OpenAI互換）、スキルローダ、トリガーエンジン、CLI |
| `docs/` | アーキテクチャ、ユーザーマニュアル、移植ガイド、モデルマトリクス、ロードマップ |
| `scripts/` | スキル同期・変換ツール |

## 移植状況 — claude-red 全ライブラリ（79スキル、23カテゴリ）

| カテゴリ | スキル数 | カテゴリ | スキル数 |
|----------|-------:|----------|-------:|
| Web Application | 16 | Fuzzing & Vuln Research | 4 |
| Infrastructure & Red Team | 7 | Reconnaissance | 2 |
| API Security | 2 | Container & Kubernetes | 2 |
| Cloud | 1 | CI/CD & Pipeline | 2 |
| AI Security | 1 | Cryptography | 2 |
| Active Directory | 2 | Privilege Escalation | 2 |
| Auth & Identity | 2 | Post-Exploitation | 3 |
| Wireless | 14 | Forensics & C2 | 2 |
| Mobile | 1 | Supply Chain | 2 |
| IoT & Embedded | 1 | Social Engineering | 2 |
| Exploit Development | 6 | Network Attacks | 1 |
| Utility | 2 | **合計** | **79** |

## クイックスタート

```bash
npm install
npm run build
cp .env.example .env   # APIキー設定
node dist/src/cli.js chat          # 対話セッション（または: npm i -g . → ort chat）
node dist/src/cli.js dashboard     # Webダッシュボード（http://localhost:8081）
npm test                           # テスト実行
```

### 対応プロバイダ

| プロバイダ | エンドポイント | モデル例 |
|-----------|---------------|----------|
| `deepseek` | `https://api.deepseek.com/v1`（OpenAI互換） | `deepseek-chat`, `deepseek-reasoner` |
| `glm` | `https://open.bigmodel.cn/api/paas/v4`（OpenAI互換） | `glm-4-plus`, `glm-4-flash` |
| `openweight` | Ollama / vLLM / LM Studio（OpenAI互換 `/v1`） | `qwen2.5:32b`, `deepseek-r1:32b` |

## 使い方

### CLI

`ort` にはグローバルインストール（`npm i -g .`）が必要です — それ以外は `node dist/src/cli.js` を直接実行してください。

```bash
npx ort chat --provider deepseek --model deepseek-chat   # 対話、スキル自動ロード
npx ort chat --skills offensive-sqli --provider glm      # スキル強制ロード
npx ort skills list                                      # スキル一覧
npx ort skills show offensive-sqli                       # スキル本文表示
npx ort ask "このログインフォームでSQLiをテストする方法" --provider deepseek  # 単発クエリ
npx ort dashboard                                        # Webダッシュボード（http://localhost:8081）
```

### ライブラリ

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
});

const reply = await ort.chat("SQLインジェクションのテスト方法を教えて");
console.log(reply);
```

## ユースケース

### 公的機関・金融機関 — コンプライアンス対応

- 規制フレームワーク（ISMS-P、金融セキュリティ規制、PCI-DSS、NIST 等）に紐づく内部レッドチーム演習・自己点検を
  **内部システム情報を海外クラウドAPIへ送信せずに**実施
- 厳格なデータガバナンス下での電子政府・金融サービスのセキュリティレビュー

### 企業 — 社内セキュリティ運用

- セキュリティチームの教育、CTF対策、許可されたペネトレーションテストの計画、日常の脆弱性トリアージに
  オペレータ級の手法ライブラリを提供
- オンプレミス運用により社内アーキテクチャ・ソースコード・対象情報を社内に保持

### Red Team のための LLM 拡張

- あらゆる OpenAI 互換モデルをコンテキスト認識型レッドチームオペレータへ変換:
  スキルインデックス + オンデマンド手法注入 + 会話履歴
- 機微な任務はローカルモデル、大量処理はクラウドAPIと柔軟に使い分け

## コスト削減と内部情報保護

### コスト削減

| 選択肢 | トークン単価 | 備考 |
|--------|--------------|------|
| Claude（オリジナル） | 最高価格帯 | スキルが Claude 専用だった |
| DeepSeek / GLM API | 低コストAPI | 同じスキル内容、はるかに低コスト |
| オープンウェイト（Ollama/vLLM） | **追加コスト0円** | 保有GPU/ハードウェアで実行 |

### 公的機関・金融機関・企業の内部情報保護

- `openweight` プロバイダ使用時は**データが組織外に出ない** — 対象情報・発見事項・手法が
  オンプレミスまたはエアギャップ環境に保持される
- プロンプトやセキュリティ発見事項の第三者保持なし
- 企業環境に適合 — プロキシ環境、隔離ネットワーク、オフラインラボで動作

## 動作原理

1. **スキルインデックス注入** — 全スキルの `name` + `description` をシステムプロンプトに注入（Claude Skills の progressive disclosure を再現、コンテキストコストを最小化）
2. **トリガーマッチング** — ユーザー入力を各スキルの `triggers`（キーワード/正規表現、英・韓）と照合し、上位N件のスキル本文をシステムプロンプトに注入
3. **モデル呼び出し** — OpenAI互換API経由で選択プロバイダへリクエスト

## デプロイ・運用（エアギャップ / オンプレミス）

金融・公共機関・企業向けデプロイ（망분리・ネットワーク分離対応）は5階層アーキテクチャでサポートします:
オフライン搬入（skopeo/crane）→ レジストリセキュリティ（Harbor + Trivy + Cosign）
→ LLMサービング（vLLM/Ollama）→ 強化済みアプリコンテナ（非root・読み取り専用・リソース制限）
→ 認証・監査（Keycloak + LangFuse + Prometheus/Grafana）。

```bash
docker build -t open-ai-red-team:latest .       # 強化イメージのビルド
docker compose --profile poc up -d               # PoC: アプリ + Ollama
docker compose --profile serving up -d           # 本番: アプリ + vLLM
./scripts/sbom/scan.sh open-ai-red-team:latest   # CVEスキャン + SBOM
./scripts/offline/export-images.sh               # エアギャップ搬入
```

詳細: [デプロイ・運用ガイド](docs/deployment.md)

## ドキュメント

- [ユーザーマニュアル](docs/manual.md) — インストール、プロバイダ、CLI、トラブルシューティング
- [アーキテクチャ](docs/architecture.md) — ミドルウェア設計とデータフロー
- [移植ガイド](docs/porting-guide.md) — Claudeスキル → モデル非依存への変換規則
- [モデルマトリクス](docs/model-matrix.md) — DeepSeek/GLM/オープンウェイトの特性と制約
- [無検閲オープンウェイトモデル](docs/uncensored-models.md) — LM Studio + 無検閲GGUFラボガイド 
- [ロードマップ](docs/roadmap.md) — 移植フェーズとミドルウェア計画

## ライセンス

MIT。元スキル: [SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red)（MIT）— 各スキルの frontmatter の `source` フィールドに出典を明記。

> 許可された環境（ペネトレーションテスト、対象範囲内のバグバウンティ、セキュリティ研究、CTF）でのみ使用してください。
