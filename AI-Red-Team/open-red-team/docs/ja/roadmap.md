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
- [x] 多言語ドキュメント（EN基準 / KO / JA / ZH）
- [ ] Ollama `num_ctx` 自動拡張
- [ ] 埋め込みベースの意味マッチング（RAG）— キーワードマッチングの代替オプション
- [x] マルチターンツール実行ループ（Kali連携）— **blocked**: 本リリースの範囲外。Open AI Red Team は
  許可された任務の方法論をモデルコンテキストへ注入するミドルウェアであり、ホスト上でコマンドを実行しません。
  P0統制（範囲拒否・セッション分離・履歴予算・fail-closed認証）が安定してからのみ再検討します。
