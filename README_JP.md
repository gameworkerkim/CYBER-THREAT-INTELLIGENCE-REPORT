# 🛡️ Cyber Threat Intelligence Report

> **独立系サイバー脅威インテリジェンス・レポートアーカイブ**
> *Independent Cyber Threat Intelligence Archive · OSINTベースの防御研究*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)
![Last Update](https://img.shields.io/badge/Last%20Update-2026--05--30-informational?style=flat-square)

🌐 **言語 (Languages):** [한국어](README.md) · [English](README_EN.md) · [中文](README_CN.md) · **日本語**

本リポジトリは、防御・研究・政策立案を目的とした**公開サイバー脅威インテリジェンス（Open CTI）レポート**を収集・発行する独立系アーカイブです。すべてのレポートはOSINTに基づいて作成され、特定の組織・機関・国家の公式見解を代表するものではありません。

---

## 📇 アナリスト紹介 (About the Analyst)

|  |  |
| --- | --- |
| **氏名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **役割 (Role)** | CEO, Betalabs Inc. · 独立系脅威インテリジェンス・アナリスト |
| **専門分野** | Web3・ブロックチェーンセキュリティ、サプライチェーン攻撃、ゼロデイ・エコシステム、北朝鮮・国家背景の脅威、AI/LLMセキュリティ |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新レポート — 注目 (Latest Reports — Featured)

> 🆕 **2026-05-30 発行** — 韓国メディア未報道の4件の脅威を、4言語（KR·EN·JP·CN）で同時公開

### 1. AIエージェントがハンドルを握る — LLM主導型侵入の初観測事例

*Marimo CVE-2026-39987 事前認証RCEから内部DB窃取まで、1時間未満の4段階自律ピボット*

Sysdig TRTが記録した**初の「AIエージェント主導型」侵入**。露出したMarimoノートブックの事前認証RCEを起点に、LLMエージェントが全チェーン — クラウド認証情報の窃取 → AWS Secrets ManagerからのSSHキー取得 → SSH踏み台経由 → 内部PostgreSQLの全ダンプ — を自律運用した。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0530-MARIMO` |
| **深刻度** | 🔴 CRITICAL |
| **CVE** | `CVE-2026-39987`（CVSS 9.3 · CISA KEV） |
| **ダウンロード** | [🇰🇷 KR](CTI-2026-0530-MARIMO_KR.md) · [🇬🇧 EN](CTI-2026-0530-MARIMO_EN.md) · [🇯🇵 JP](CTI-2026-0530-MARIMO_JP.md) · [🇨🇳 CN](CTI-2026-0530-MARIMO_CN.md) |

### 2. 未パッチのCritical RCE — Gogs git rebase 引数インジェクション脆弱性

*認証された一般ユーザがセルフホスト型Gitサーバを掌握する9.4点の欠陥、そしてクロステナント侵害*

悪性ブランチ名が`git rebase`の`--exec`フラグに注入され、サーバ上で任意コードが実行される。メンテナへの報告（2026-03-17）以降も**未パッチ**で、公開Metasploitモジュールも存在する。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0530-GOGS` |
| **深刻度** | 🔴 HIGH |
| **CVE** | 未付与（Rapid7算定 CVSS 9.4） |
| **ダウンロード** | [🇰🇷 KR](CTI-2026-0530-GOGS_KR.md) · [🇬🇧 EN](CTI-2026-0530-GOGS_EN.md) · [🇯🇵 JP](CTI-2026-0530-GOGS_JP.md) · [🇨🇳 CN](CTI-2026-0530-GOGS_CN.md) |

### 3. JINX-0164 — 仮想資産企業を狙うmacOSマルウェア・サプライチェーン脅威アクター

*LinkedInソーシャルエンジニアリング、AUDIOFIX・MINIRAT、そして@velora-dex/sdk npmサプライチェーン侵害*

LinkedInの採用おとりで開発者端末を掌握し、CI/CD・コード配布インフラへ移動する金銭動機クラスタ。北朝鮮クラスタとTTPは類似するが、インフラ重複はない（Wiz）。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0530-JINX` |
| **深刻度** | 🔴 HIGH |
| **脅威アクター** | JINX-0164（北朝鮮TTP類似、インフラ重複なし） |
| **ダウンロード** | [🇰🇷 KR](CTI-2026-0530-JINX_KR.md) · [🇬🇧 EN](CTI-2026-0530-JINX_EN.md) · [🇯🇵 JP](CTI-2026-0530-JINX_JP.md) · [🇨🇳 CN](CTI-2026-0530-JINX_CN.md) |

### 4. ChatGPhish — AI要約をフィッシング表面に変えるChatGPTレンダラの信頼欠陥

*マークダウンのリンク・画像への暗黙的信頼、間接プロンプトインジェクション、そしてQRコードピボット*

`chatgpt.com`レンダラが要約対象の第三者ページのマークダウンリンク・画像を信頼し、自動ロード・クリック要素として表示する。フィッシング・偽のシステム警告・QRピボット・IP/UA/Referer漏えいが可能（Permiso Security）。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0530-CHATGPHISH` |
| **深刻度** | 🟠 MEDIUM |
| **CVE** | 未付与（Bugcrowd報告、ベンダーは「再現不可」と回答） |
| **ダウンロード** | [🇰🇷 KR](CTI-2026-0530-CHATGPHISH_KR.md) · [🇬🇧 EN](CTI-2026-0530-CHATGPHISH_EN.md) · [🇯🇵 JP](CTI-2026-0530-CHATGPHISH_JP.md) · [🇨🇳 CN](CTI-2026-0530-CHATGPHISH_CN.md) |

### 5. KelpDAO LayerZeroブリッジハック — オフチェーン検証インフラの単一障害点

*クロスチェーンブリッジセキュリティの構造的弱点と、オフチェーン検証者（off-chain verifier）の集中化リスク*

LayerZeroベースのブリッジ経路で発生した侵害事案の分析。オンチェーンのコントラクトではなく、**オフチェーン検証インフラの単一障害点**がどのように資産窃取へ直結するかを扱う。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0528-KELPDAO` |
| **深刻度** | 🔴 HIGH |
| **分類** | Web3 / クロスチェーンブリッジセキュリティ |
| **ダウンロード** | [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇯🇵 JP](CTI-2026-0528-KELPDAO_JA.md) · [🇨🇳 CN](CTI-2026-0528-KELPDAO_ZH.md) |

---

## 📚 レポート索引 — 全リスト (Report Index)

> 💡 新規レポートは発行時に本表の**最上部**へ追加されます。命名規則：`CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`。

| ID | 発行日 | タイトル | 深刻度 | 言語 |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_JP.md) | 2026-05-30 | AIエージェント主導型侵入 — Marimo CVE-2026-39987 + LLM自律ピボット | 🔴 CRITICAL | KR·EN·JP·CN |
| [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_JP.md) | 2026-05-30 | 未パッチのGogs git rebase引数インジェクションRCE（CVSS 9.4） | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_JP.md) | 2026-05-30 | JINX-0164 — 仮想資産を狙うmacOSマルウェア・サプライチェーン脅威 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_JP.md) | 2026-05-30 | ChatGPhish — ChatGPTレンダラ信頼欠陥（間接プロンプトインジェクション） | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_JA.md) | 2026-05-28 | KelpDAO LayerZeroブリッジハック — オフチェーン検証インフラの単一障害点 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md) | 2026-05-27 | GlassWorm — 自己伝播型のVS Code/OpenVSXサプライチェーンワーム | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_JA.md) | 2026-05-27 | Gitea脆弱性分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_JA.md) | 2026-05-27 | AIクリプトジャッキング・キャンペーン分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) | 2026-05-26 | Kimsuky（APT43）のPebbleDash・AppleSeed 新規分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) | 2026-05-26 | 英国による対ロシア仮想資産制裁の動向 | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_JP.md) | 2026-05-24 | 同時発生する二重脅威（Two Concurrent Threats）分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) | 2026-05-22 | EDR回避の脅威分析（EDR3） | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) | 2026-05-21 | YellowKey — Windows BitLockerバイパス・ゼロデイ | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) | 2026-05-21 | 2026 北朝鮮ハッキング動向 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub内部リポジトリ侵害分析 | 🔴 HIGH | KR |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20JA.md) | 2026-05-20 | FAST16 分析レポート | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Exchange Serverセキュリティ脆弱性 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI生成デバイスコード・フィッシングPhaaS | 🔴 HIGH | KR |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupalコア最高危険ゼロデイ（パッチなし） | 🔴 CRITICAL | KR |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel侵害分析 | 🔴 HIGH | KR |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) | 2026-05-17 | 北朝鮮のLLM活用ハッキング — エージェンティック防御 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNSサイドチャネル | 🟠 MEDIUM | KR |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | ロシア製RAT（LNK/RDP） | 🔴 HIGH | KR |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | 2026-05-10 | 北朝鮮LazarusによるgitフックのABUSE | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Mythos AI脆弱性分析 | 🔴 HIGH | EN |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_JP.md) | 2026-05-07 | ScarCruft（APT37）分析 | 🔴 HIGH | KR·EN·JP |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | Vibe — AIハッキングの時代 | 🟠 MEDIUM | KR |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub脅威分析 | 🔴 HIGH | KR |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | CVE-2026-31431 'Copy Fail'脆弱性 | 🔴 HIGH | KR |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | ライトコイン脆弱性分析 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20jp.MD) | 2026-04-22 | MCPを狙う高度・潜伏型攻撃 — 構造的問題か | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel侵害 — AI SaaSサプライチェーンとShinyHunters | 🔴 HIGH | KR·EN |
| [`CTI-2026-0320-CORUNA`](Analysis%20EN.MD) | 2026-03-20 | サイバー兵器サプライチェーンの崩壊 — Coruna iOS Exploit Kit | 🔴 CRITICAL | KR·EN·CN |

> ℹ️ 一部の過去エントリのタイトル・深刻度はアーカイブのファイル名・コミットメッセージから整理したものであり、本文での再確認を推奨します。

---

## 🗂️ カテゴリ別 (By Category)

### 🤖 AI/LLMセキュリティ

* `CTI-2026-0530-MARIMO` — LLMエージェント主導の自律侵入（初観測）
* `CTI-2026-0530-CHATGPHISH` — ChatGPTレンダラ信頼欠陥/間接プロンプトインジェクション
* `CTI-2026-0527-AICRYPTOJACK` — AIクリプトジャッキング
* `CTI-2026-0517-AICYBER` — 北朝鮮のLLM活用ハッキング/エージェンティック防御
* `CTI-2026-0422-MCP` — MCPを狙う高度・潜伏型攻撃

### 🌐 サプライチェーン攻撃

* `CTI-2026-0530-JINX` — JINX-0164 macOS / npm（@velora-dex/sdk）
* `CTI-2026-0530-GOGS` · `CTI-2026-0527-GITEA` — セルフホスト型GitサーバRCE
* `CTI-2026-0527-GLASSWORM` — 自己伝播型のVS Code/OpenVSXワーム
* `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` — GitHubリポジトリ侵害
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters

### 🕵️ 脅威アクター・プロファイル

* `CTI-2026-0530-JINX` — JINX-0164（金銭動機、北朝鮮TTP類似）
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` — Kimsuky（APT43）
* `CTI-2026-0510-LAZARUS-GITHOOKS` — Lazarus
* `CTI-2026-0507-SCARCRUFT` — ScarCruft（APT37）
* `CTI-2026-0521-DPRK-TRENDS` — 北朝鮮ハッキング動向

### 💰 Web3・暗号資産エコシステム

* `CTI-2026-0528-KELPDAO` — KelpDAO LayerZeroブリッジハック
* `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` — 暗号資産制裁の動向
* `CTI-2026-0427-LITECOIN` — ライトコイン脆弱性

### 🪟 エンドポイント・OS・ゼロデイ

* `CTI-2026-0521-YELLOWKEY` — Windows BitLockerバイパス・ゼロデイ
* `CTI-2026-0520-DRUPAL` — Drupalコア・ゼロデイ
* `CTI-2026-0520-EXCHANGE` — Exchange Server脆弱性
* `CTI-2026-0522-EDR3` — EDR回避
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit

---

## 🧭 分析方法論 (Methodology)

### Traffic Light Protocol (TLP)

| ラベル | 意味 | 本リポジトリ |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | コミュニティ内共有・公開可 | **デフォルト** |
| 🟡 TLP:AMBER | 組織内部共有限定 | 該当なし |
| 🔴 TLP:RED | 個別受領者限定 | 該当なし |

### 深刻度 (Severity)

| 等級 | 意味 | 対応時間 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 国家安全保障・大規模民間被害に直結 | 即時 |
| 🔴 **HIGH** | 産業・エコシステムへの広範な影響 | 24–72時間 |
| 🟠 **MEDIUM** | 特定企業・組織群に限定 | 7日以内 |
| 🟡 **LOW** | 認知・観察レベル | 30日以内 |

### フレームワーク参照

* **MITRE ATT&CK** / **MITRE ATLAS** — TTP・AI脅威マッピング
* **NIST SP 800-61** — インシデント対応ライフサイクル
* **NIST SP 800-207** — ゼロトラスト・アーキテクチャ
* **NIST AI RMF** / **OWASP LLM Top 10** — AI/LLMリスク管理
* **STIX/TAXII** — 脅威インテリジェンス交換
* **Mandiant/Wiz UNC・クラスタ命名** — 脅威アクターのクラスタリング

---

## 📝 命名規則 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

例:
  CTI-2026-0530-MARIMO_KR.md   → 2026年5月30日発行、Marimo事案、韓国語Markdown
  CTI-2026-0530-MARIMO_EN.md   → 同一事案の英語版
  CTI-2026-0528-KELPDAO_ZH.md  → KelpDAO事案、中国語版
```

* `SUBJECT` — レポート主題を表すキーワード（大文字）
* `LANG` — `KR/KO`（韓国語）/ `EN`（英語）/ `JP/JA`（日本語）/ `CN/ZH`（中国語）
* `ext` — `md`（デフォルト）/ `pdf`（正式配布版）

---

## 🤝 連絡・貢献 (Contact & Contribution)

| チャネル | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — レポートのフィードバック・訂正・情報提供 |
| **GitHub Issues** | [Issue作成](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC更新・参考資料の提案 |
| **情報提供の保護** | 機微な情報提供はSignal・ProtonMail等の安全なチャネルでご連絡ください。 |

---

## ⚖️ 免責事項 (Disclaimer)

1. 本リポジトリのすべてのレポートは、**公開されたOSINT資料と報道**に基づく独立した分析であり、関連する組織・機関・企業の公式見解を代表するものではありません。
2. 内容は**教育・防御・研究・政策立案の目的**でのみ使用されるべきであり、攻撃・侵害・違法行為への使用を固く禁じます。
3. IoC・脆弱性情報は発行時点のものであり、実運用前に必ず最新状態を再確認してください。
4. 著者は、本資料の直接的・間接的な使用により生じるいかなる損害についても責任を負いません。

---

## 📊 リポジトリ統計 (Repository Stats)

|  |  |
| --- | --- |
| **総レポート数** | 33+ |
| **対応言語** | 한국어 · English · 日本語 · 中文 |
| **観測された脅威アクター** | JINX-0164 · Lazarus · Kimsuky（APT43）· ScarCruft（APT37）· ShinyHunters · UNC6353 ほか |
| **最終更新** | 2026-05-30 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*「今日の国家戦略資産は、明日のサイバー犯罪ツールになる。」 — CTI-2026-0320*
