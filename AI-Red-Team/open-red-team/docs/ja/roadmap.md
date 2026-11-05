# ロードマップ

**言語:** [English](../roadmap.md)（基準） · [한국어](roadmap.md) · 日本語（本ドキュメント） · [中文](roadmap.md)

## 移植状況 — 全カテゴリ完了

移植順序: **Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**、
その後 claude-red の残りカテゴリへ拡張。23カテゴリ・79スキルすべて移植完了。

| フェーズ | カテゴリ | スキル数 | 状態 |
|----------|----------|-------:|------|
| 1 | Web Application | 16 |  |
| 2 | Infrastructure & Red Team | 7 |  |
| 3 | API Security | 2 |  |
| 4 | Cloud | 1 |  |
| 5 | AI Security | 1 |  |
| 6 | Active Directory | 2 |  |
| 7 | Auth & Identity | 2 |  |
| 8 | Wireless | 14 |  |
| 9 | Mobile | 1 |  |
| 10 | IoT & Embedded | 1 |  |
| 11 | Exploit Development | 6 |  |
| 12 | Fuzzing & Vuln Research | 4 |  |
| 13 | Reconnaissance | 2 |  |
| 14 | Container & Kubernetes | 2 |  |
| 15 | CI/CD & Pipeline | 2 |  |
| 16 | Cryptography | 2 |  |
| 17 | Privilege Escalation | 2 |  |
| 18 | Post-Exploitation | 3 |  |
| 19 | Forensics & C2 | 2 |  |
| 20 | Supply Chain | 2 |  |
| 21 | Social Engineering | 2 |  |
| 22 | Network Attacks | 1 |  |
| 23 | Utility | 2 |  |
| — | **合計** | **79** |  |

## ミドルウェアロードマップ

- [x] OpenAI互換プロバイダ抽象化（DeepSeek/GLM/Ollama）
- [x] スキルローダ + frontmatter パース
- [x] トリガーエンジン（キーワード/正規表現、スコアリング; 英・韓キーワード）
- [x] Progressive disclosure（インデックス常時注入 + 本文オンデマンド）
- [x] CLI（`ort chat / ask / skills`）
- [x] Webダッシュボード（セッション、監査、OIDC、メトリクス）
- [x] トークン予算エンジン（コンテキスト上限、セクション切詰め、index_only）+ 履歴ターン予算
- [x] 運用者別セッション分離（SessionStore、X-Ort-Session、OIDC sub 帰属）
- [x] スコープガードレール（呼び出し前拒否）+ fail-closed起動（exit 1）
- [x] ローカルアカウント（SQLite）: admin/admin パスワード変更強制、HMACトークン
- [x] ダッシュボードランタイム設定（スコープ/予算/エンジン即時反映、adminロール）
- [x] ストリーミングフォールバック + reasoning_content 捕捉、LangFuse・Prometheus・JSONL監査（SHA-256）
- [x] デプロイ・運用: base/infra compose分離、ollama-pull・vllm-preflightゲート、シークレット必須化、
      Keycloak realm、Grafanaダッシュボード、オフライン搬入（skopeo/crane）、Trivy SBOM + Cosign
- [x] テスト80件 + 検索品質基準線 + CI（typecheck/build/test/docker build/スキャン）
- [x] 多言語ドキュメント（EN基準 / KO / JA / ZH）+ コンプライアンス統制表
- [ ] Ollama `num_ctx` 自動拡張
- [ ] 埋め込みベースの意味マッチング（RAG）— キーワードマッチングの代替オプション
- [x] マルチターンツール実行ループ（Kali連携）— **blocked**: 本リリースの範囲外。Open AI Red Team は
  許可された任務の方法論をモデルコンテキストへ注入するミドルウェアであり、ホスト上でコマンドを実行しません。
  P0統制（範囲拒否・セッション分離・履歴予算・fail-closed認証）が安定してからのみ再検討します。

## 計画中の拡張（評価済みの提案）

すべての項目は製品境界（方法論注入、運用者統制、自律実行なし）を遵守します。

| 優先度 | 項目 | 備考 |
|--------|------|------|
| 高 | 承認ベースの提案-実行ブリッジ | 運用者がLLM提案コマンドをレビュー・承認すると**隔離サンドボックス**で実行し、結果をモデルへフィードバック — 半自動であり自律実行ではない |
| 高 | スキル-ツールマッピングレジストリ | 各スキルに必要なツール（sqlmap、nmap、Burp Suite等）をメタデータで接続 — スキルを実ワークフローに紐付け |
| 中 | 方法論の有効性ベンチマーク | LLM-as-a-Judgeによる具体性・実行可能性・文脈適合性の評価 — ミドルウェア出力品質の回帰ゲート |
| 中 | CI/CDレッドチーム提案ゲート | GitHub Actions連携でスキルベースのレビュー提案をPRコメントとして投稿（提案のみ、実行なし） |
| 低 | コミュニティスキルマーケットプレイス | レビュー済みコミュニティ貢献 `SKILL.md` カタログ |

## 未検証の実インフラ項目

- [ ] ホストされたCIゲートの初回実行（ワークフローはリポジトリルートに存在、ローカル実行のみ検証済み）
- [ ] vLLM実起動の検証（GPUインフラが必要）
- [ ] Keycloak OIDC往復の検証（realm import + ダッシュボードトークン交換）
- [ ] SQLiteバックアップ/復元訓練（手順は文書化済み、実践未実施）

## リリース履歴

| バージョン | 内容 |
|------------|------|
| 0.1.0 | ミドルウェア + 最初の27スキル、プロバイダ抽象化、CLI、ドキュメント |
| 0.2.0 | claude-red全移植（79スキル/23カテゴリ）、多言語ドキュメント、ユーザーマニュアル |
| 0.3.0 | Open AI Red Team へ名称変更 |
| 0.4.0 | トークン予算、テスト30件、スコープガードレール、LangFuse/OIDC/メトリクス、デプロイツール |
| 0.5.0 | P0強化: スコープ拒否（0呼び出し）、セッション分離、履歴予算、fail-closed、PoC compose、シークレット必須化、テスト63件、検索基準線、コンプライアンス文書 |
| 0.6.0 | SQLiteローカルアカウント（admin/admin強制変更）、ダッシュボードSettingsタブ、ロードマップ/文書更新 |
