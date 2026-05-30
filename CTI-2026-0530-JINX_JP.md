| id             | CTI-2026-0530-JINX                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | JINX-0164 — 仮想資産企業を狙うmacOSマルウェア・サプライチェーン脅威アクター                                                                         |
| subtitle       | LinkedInソーシャルエンジニアリング、AUDIOFIX・MINIRAT、そして@velora-dex/sdk npmサプライチェーン侵害                                                |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | ja                                                                                                                     |
| tags           | Crypto-Targeting · macOS-Malware · Supply-Chain · Social-Engineering · CI-CD-Abuse · DPRK-Adjacent                    |
| threat_actors  | JINX-0164（金銭動機 · 北朝鮮クラスタのTTP類似、インフラ重複なし）                                                                                |
| cve            | N/A（脅威アクターのキャンペーン · npmサプライチェーン）                                                                                        |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Wizクラスタ命名                                                         |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# JINX-0164 — 仮想資産企業を狙うmacOSマルウェア・サプライチェーン脅威アクター

> **レポートID** `CTI-2026-0530-JINX` · **発行日** 2026-05-30 · **分類** `TLP:GREEN` · **深刻度** 🔴 HIGH
> **著者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LinkedInソーシャルエンジニアリング、AUDIOFIX・MINIRAT、そして@velora-dex/sdk npmサプライチェーン侵害*

---

## 目次

1. 要約 (TL;DR)
2. 脅威アクター・プロファイル — JINX-0164
3. 攻撃チェーン — LinkedInからCI/CDまで
4. マルウェア分析 — AUDIOFIX · MINIRAT
5. サプライチェーン侵害 — @velora-dex/sdk
6. 北朝鮮クラスタとの類似点・相違点
7. 韓国の視点 — 取引所・Web3開発チームの脅威評価
8. 検知・緩和の推奨
9. 結論
10. 参考文献

---

## 要約 (TL;DR)

2026年5月28日、Wiz（CIRT・Research）は、デジタル資産窃取を目的に仮想資産組織を標的とする未記録（undocumented）の脅威アクター**JINX-0164**を公開した。本クラスタは**少なくとも2025年中頃から活動**しており、ほぼ全面的に**macOS**に集中する。

攻撃の流れは、(1) LinkedInベースの採用・事業提案ソーシャルエンジニアリングで開発者に接近 → (2) Microsoft Teams等を偽装した偽の会議ページへ誘導 → (3) macOSカスタムRATをダウンロード → (4) 認証情報・ウォレット情報を窃取 → (5) 侵害された従業員ノートPCから**コード配布システム・CI/CDインフラへ横移動**、というものだ。さらに彼らは**npmサプライチェーン侵害**の能力も実証した。

本アクターはBlueNoroff・Contagious Interview・UNC1069（Sleet）等の北朝鮮クラスタと**手法は類似するがインフラ重複はなく**、Wizは国家支援とは断定せず金銭動機クラスタに分類した。

### Key Judgments

| #    | 判断                                                                                                                   | 信頼度            |
| ---- | -------------------------------------------------------------------------------------------------------------------- | -------------- |
| KJ-1 | JINX-0164は採用おとりのソーシャルエンジニアリングとmacOSカスタムマルウェアを組み合わせ、**仮想資産開発者**を精密に標的とする。標的職種が明確だ。                                      | **High**       |
| KJ-2 | 単なる端末窃取を超え、**CI/CD・コード配布インフラへの横移動**を中核目標とする。これは単一の侵害を下流の多数侵害へ増幅させるサプライチェーン志向だ。                                          | **High**       |
| KJ-3 | `@velora-dex/sdk` 4.9.1のトロイの木馬化は、**正規のDeFiツールキットを感染ベクターに転換**した実証事例である。importの時点でシェルスクリプトがMINIRATをダウンロードする。              | **High**       |
| KJ-4 | 北朝鮮クラスタとの手法類似性・Astrill VPNの使用が観測されるが、**インフラ重複がなく帰属は未確定**である。模倣または独立クラスタの可能性を併せて考慮すべきだ。                                  | **Medium**     |
| KJ-5 | 韓国の取引所・Web3ビルダー・DeFiチームはmacOS比率が高くLinkedIn採用活動が活発なため、**同一の攻撃面**に晒される。マルチシグ・ホットウォレットの鍵が開発端末に共存する場合、リスクが増幅される。            | **Medium-High**|

---

## 1. 脅威アクター・プロファイル — JINX-0164

| 項目 | 値 |
| --- | --- |
| 名称 | JINX-0164（Wiz命名） |
| 活動時期 | 少なくとも2025年中頃〜 |
| 動機 | 金銭（financial gain）— デジタル資産窃取 |
| 標的 | 仮想資産組織・開発者（macOS集中） |
| 中核マルウェア | AUDIOFIX（Python）、MINIRAT（Go） |
| C2 | HTTPS通信、共有インフラ（例：`datahub[.]ink`） |
| 補助ツール | Astrill VPN等 |
| 帰属 | 未確定（北朝鮮クラスタのTTP類似、インフラ重複なし） |

JINX-0164はLinkedInに**信頼性の高い偽プロフィール**（現実的な経歴・人脈）を運用し、一部のアカウントは乗っ取られたかキャンペーン専用に作成された後に削除された。研究者（WizのShira Ayalほか）は複数の侵害調査を単一クラスタとしてまとめ命名した。

---

## 2. 攻撃チェーン — LinkedInからCI/CDまで

| 段階 | 行為 | 詳細 |
| --- | --- | --- |
| ① 接近 | LinkedInで事業・採用提案 | 信頼を確保した後、偽の会議招待を送付 |
| ② 誘導 | 偽のカンファレンスページ | Microsoft Teams等を偽装したドメイン |
| ③ 感染 | macOS RATのダウンロード・実行 | `coreaudiod`（システムオーディオドライバ）に偽装、`ChromeUpdater`として保存、`launchctl`で実行 |
| ④ 窃取 | Pythonマルウェアで機微情報を収集 | パスワードマネージャ・ブラウザ・iCloud Keychainの認証情報、ローカル管理者認証情報、SSHキー、設定・コンソール履歴、暗号通貨ウォレット・拡張情報、アクティブなDiscord・Slack・Telegramセッション |
| ⑤ 拡散 | CI/CD・コード配布インフラへ横移動 | AUDIOFIXペイロードを注入、ソースコードを改ざんし追加端末を侵害・ウォレット認証情報を窃取 |

核心は⑤段階だ。JINX-0164は侵害された開発者ノートPCを**終着点ではなく足場**と見なす。目標はコード配布システムと開発インフラに到達し、単一の侵害を下流の多数侵害へ増幅させることだ。

---

## 3. マルウェア分析 — AUDIOFIX · MINIRAT

**AUDIOFIX** — コンパイルされたPythonバイナリ。広範な自動情報窃取を行う。システムオーディオドライバ（`coreaudiod`）に偽装し、`ChromeUpdater`というファイル名で保存され、`launchctl`で実行される。窃取対象には次が含まれる：パスワードマネージャ・Webブラウザ・iCloud Keychainの認証情報、ローカル管理者認証情報、SSHキー、構成/コンソール履歴ファイル、暗号通貨ブラウザ拡張情報・ウォレットアドレス、アクティブなDiscord・Slack・Telegramセッション。

**MINIRAT** — Goベースの軽量バックドア。AUDIOFIXのような広範な自動窃取は行わないが、**持続的なリモートアクセス、コマンド実行、ファイル移動**機能を提供する。両マルウェアはHTTPSでC2と通信し、共通インフラ（例：`datahub[.]ink`）を共有する。マルウェアはOSを識別した後、アーキテクチャ別のペイロードをダウンロードする構造だ。

---

## 4. サプライチェーン侵害 — @velora-dex/sdk

2026年4月7日、JINX-0164はサプライチェーン作戦としてnpmパッケージ**`@velora-dex/sdk` 4.9.1**をトロイの木馬化した。このパッケージはVeloraDEX分散型取引所でトークンスワップ・指値注文・デルタトレーディングに使われる正規のDeFiツールキットだ。

悪性バージョンは`dist/index.js`に**3行を追加**し、パッケージがimportされるたびにリモートサーバからシェルスクリプトをダウンロードするようにした。このスクリプトはmacOS専用バイナリ**MINIRAT**を配布した。（この侵害は先にSafeDep・StepSecurityが観測・公開している。）

この手口の本質は**信頼されるコードベースを感染ベクターに転換**することだ。開発者が正規パッケージを依存関係として取り込む正常な行為が、そのまま感染トリガーになる。一部の事例では追加の認証情報窃取（特に暗号通貨ウォレット）のために**ソースコード自体を改ざん**した形跡も観測された。

---

## 5. 北朝鮮クラスタとの類似点・相違点

| 比較項目 | JINX-0164 | 北朝鮮クラスタ（BlueNoroff · Contagious Interview · UNC1069） |
| --- | --- | --- |
| 標的 | 仮想資産・開発者 | 同じ |
| ソーシャルエンジニアリング | 採用・事業提案のおとり | 同じ（Contagious Interview類似） |
| プラットフォーム | macOS集中 | macOSを含む多プラットフォーム |
| VPN | Astrill VPN使用 | Astrill VPN使用事例多数 |
| 偽装ドメインの種類 | 類似 | 類似 |
| **インフラ重複** | **なし** | — |

手法・ツール・標的面での類似性は顕著だが、Wizは**インフラ重複が確認されないため**公開追跡中の北朝鮮グループと結びつけなかった。よって本レポートは(a)北朝鮮の手法を模倣した独立の金銭動機クラスタ、(b)まだインフラが分離された未識別の連携可能性を**いずれも開いたまま**追加観測を推奨する。早計な国家帰属は誤帰属のリスクがある。

---

## 6. 韓国の視点 — 取引所・Web3開発チームの脅威評価

韓国の環境でJINX-0164類の脅威が持つ含意は次の通り。

- **macOS比率** — 韓国の取引所・Web3スタートアップ開発チームはmacOS使用比率が高く、本キャンペーンの標的プラットフォームと正確に一致する。
- **LinkedIn採用の露出** — 活発な採用・ネットワーキング活動がソーシャルエンジニアリングの入口を広げる。「海外リクルーターの会議招待」はよくあるパターンであり、警戒が緩い。
- **鍵共存リスク** — 開発端末にウォレット拡張・ホットウォレット鍵・SSHキー・CIトークンが共存すると、端末侵害一つが資産窃取とサプライチェーン汚染に同時に波及する。
- **サプライチェーン信頼** — 外部のnpm/SDK依存関係を無検証で採用する慣行は、`@velora-dex/sdk`型侵害にそのまま晒される。

---

## 7. 検知・緩和の推奨

1. **ソーシャルエンジニアリング認識** — 「LinkedInリクルーターの会議リンク → カンファレンスアプリのインストール/実行」パターンを高リスクに分類し、未確認ドメインのインストーラ実行を遮断する。
2. **macOS行動検知** — `launchctl`の永続化、`coreaudiod`/`ChromeUpdater`偽装プロセス、異常なHTTPS C2（例：`datahub[.]ink`類）をEDRで監視する。
3. **サプライチェーン検証** — npm/SDK依存関係にバージョンピン・ハッシュ検証・`postinstall`フック監査・SBOM管理を適用する。`@velora-dex/sdk`の使用履歴がある場合、4.9.1への露出有無を直ちに点検する。
4. **鍵の隔離** — ウォレット署名権限・ホットウォレット鍵を開発端末から分離し、専用署名機器（コールド/ハードウェア）へ移す（`CTI-2026-0422-MCP` §4の推奨と連携）。
5. **CI/CDの完全性** — コード配布パイプラインにコミット署名・ランナー隔離・アーティファクト署名を適用し、横移動時の改ざんを検知する。
6. **IOC遮断** — 共有C2インフラ・偽装ドメインをブロックリストに登録する（最新IOCはWiz Technical Annex参照）。

---

## 8. 結論

JINX-0164は「仮想資産 + macOS + サプライチェーン」という2026年の脅威地形の交点に正確に位置する。このアクターが示したパターン — 採用おとりで開発者端末を掌握し、そこからCI/CDへ移動し、信頼されるパッケージを武器化する流れ — は単一組織の問題ではなく、**エコシステム全体の信頼の鎖**を狙う。

国家帰属は依然未確定であり、この不確実性自体が示唆的だ。北朝鮮の手法が商業化・模倣され拡散する流れの中で、防御側は*「誰がやったか」*よりも*「どの信頼を悪用したか」*に集中すべきである。採用の信頼、パッケージの信頼、開発インフラの信頼 — この3つが本キャンペーンの標的であり、同時に防御の出発点だ。

---

## 参考文献 (References)

[1] Wiz CIRT & Wiz Research (Shira Ayal et al.), "Threat Actor Targets Crypto Organizations — JINX-0164", Wiz Blog, 2026-05. <https://www.wiz.io/blog/threat-actors-target-crypto-orgs>

[2] Ravie Lakshmanan, "JINX-0164 Targets Cryptocurrency Firms with Fake Recruiter Lures and macOS Malware", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/jinx-0164-targets-cryptocurrency-firms.html>

[3] "New Threat Actor Jinx-0164 Targets Crypto Developers on macOS", Infosecurity Magazine, 2026-05. <https://www.infosecurity-magazine.com/news/jinx-0164-crypto-developers-macos/>

[4] "JINX-0164 Threat Actor Using LinkedIn Social Engineering to Deploy Custom macOS Malware", Cyber Security News, 2026-05. <https://cybersecuritynews.com/jinx-0164-threat-actor-using-linkedin-social-engineering/>

[5] "JINX-0164 Uses LinkedIn Lures to Deploy Custom macOS Malware", GBHackers, 2026-05. <https://gbhackers.com/jinx-0164-uses-linkedin-lures/>

[6] SafeDep & StepSecurity, "@velora-dex/sdk 4.9.1 npm supply chain compromise (MINIRAT)", 2026-04（Wiz引用）.

---

© 2026 Dennis Kim (김호광) · 本文書は独立CTIアーカイブ（TLP:GREEN）の公開を目的として作成された。
連絡先: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
