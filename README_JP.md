# 🛡️ Cyber Threat Intelligence Report

> **独立サイバー脅威インテリジェンス・アーカイブ**
> *OSINT ベースの防御研究*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--06--04-informational?style=flat-square)

🌐 **言語 / Languages:** [한국어](README.md) · [English](README_EN.md) · **日本語 (この文書)** · [中文](README_CN.md)

本リポジトリは、防御・研究・政策立案を目的とした**公開サイバー脅威インテリジェンス（Open CTI）レポート**を収集・発行する独立アーカイブです。全レポートは OSINT に基づき作成され、特定の組織・機関・国家の公式見解を代表するものではありません。

---

## 📇 アナリスト紹介

|  |  |
| --- | --- |
| **氏名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **役割 (Role)** | CEO, Betalabs Inc. · 元 Cyworld Z CEO · 独立脅威インテリジェンス・アナリスト |
| **専門分野** | Web3・ブロックチェーンセキュリティ、サプライチェーン攻撃、ゼロデイ・エコシステム、北朝鮮・国家支援型脅威、AI/LLM セキュリティ |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新レポート（Featured）

> 🆕 **2026-06-04 公開**

### なりすましからコード実行まで一括りに — IBM WebSphere 同時公開3件

**CVE-2026-8644 / 9311 / 9319 (CVSS 9.0–9.1)** · Java ミドルウェアのデシリアライゼーション RCE、認証バイパス、そして「正式 Fix Pack がまだ無い」という罠

6月1日、IBM は WebSphere Application Server 8.5・9.0 を対象とする3件の重大な脆弱性を同時公開した。なりすまし（8644）が「侵入」を、RCE（9311・9319）が「実行」を提供する連鎖構造であり、正式 Fix Pack は 3Q2026 目標で未リリースのため、暫定修正と代償的統制が唯一の即時対応となる。韓国の銀行・保険・公共部門の基幹 Java EE ミドルウェアであり影響は大きい。

| 項目 | 値 |
| --- | --- |
| **レポート ID** | `CTI-2026-0604-WEBSPHERE` |
| **深刻度** | 🔴 CRITICAL |
| **区分** | `TLP:GREEN` |
| **CVE** | CVE-2026-8644 · CVE-2026-9311 · CVE-2026-9319 |

**📄 レポート:** [🇰🇷 KR](CTI-2026-0604-WEBSPHERE.md) · [🇬🇧 EN](CTI-2026-0604-WEBSPHERE_EN.md) · [🇯🇵 JA](CTI-2026-0604-WEBSPHERE_JA.md) · [🇨🇳 ZH](CTI-2026-0604-WEBSPHERE_ZH.md)

---

## 📚 レポート一覧（Report Index）

> 💡 新規レポートは公開時に本表の**最上段**へ追加されます。命名規則：`CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`
> ※ 深刻度（Severity）はトピック基準の参考値であり、各レポート本文の評価が優先します。

| 公開日 | ID / タイトル | 深刻度 | 言語 |
| --- | --- | --- | --- |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE_JA.md) — IBM WebSphere 同時公開3件（デシリアライゼーション RCE・認証バイパス） | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JA](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_EN.md) — Citrix NetScaler メモリオーバーリードの大規模悪用 (CVE-2026-3055) | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_JP.md) — イランの生成 AI を用いた戦争 | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [CN](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GenAI で武装した GREYVIBE のウクライナ標的作戦 | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_JP.md) — MARIMO（勧告の武器化・公開〜悪用の圧縮） | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [CN](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_JP.md) — JINX | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [CN](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_JP.md) — Gogs Git サーバー脆弱性 | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [CN](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_JP.md) — ChatGPhish（ChatGPT なりすましフィッシング） | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [CN](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_JA.md) — KelpDAO（Web3・DeFi 脅威） | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md) — GlassWorm（自己伝播型サプライチェーンワーム） | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_JA.md) — Gitea CVE 脆弱性 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JA](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_JA.md) — AI クリプトジャッキング | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) — 英国のロシア暗号資産制裁分析 | 🟠 MEDIUM | [KO](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) — Kimsuky（APT43）PebbleDash・AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_JP.md) — 同時発生する二重脅威（LiteSpeed · Shai-Hulud） | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) — EDR 回避脅威 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) — Windows BitLocker バイパス・ゼロデイ | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) — 2026 北朝鮮ハッキング動向 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — GitHub 内部リポジトリ侵害 | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20JA.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Exchange Server 脆弱性 | 🔴 HIGH | [KR · EN](CTI-2026-0520-EXCHANGE.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) — EvilTokens（AI 生成デバイスコード・フィッシング PhaaS） | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal コア最高危険度ゼロデイ（パッチ無し） | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) — cPanel ハッキング | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) — 北朝鮮の LLM を用いたハッキング / AI サイバー攻撃・エージェント防御 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) — ロシア RAT（LNK · RDP） | 🔴 HIGH | [KO](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS サイドチャネル | 🟠 MEDIUM | [KO](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — 北朝鮮 Lazarus の git-hooks 隠蔽手法 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Mythos AI 脆弱性 | 🔴 HIGH | [KR](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_JP.md) — ScarCruft（APT37）キャンペーン | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — Vibe：AI ハッキングの時代 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 脅威分析 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) — CopyFail（CVE-2026-31431） | 🔴 HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) — Litecoin 脆弱性 | 🟠 MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20jp.MD) — MCP を狙う高度・潜伏型攻撃 | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) — Vercel 侵害（AI SaaS サプライチェーン · ShinyHunters） | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit · サイバー兵器サプライチェーン | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20中文版.md) |

---

## 🗂️ カテゴリ別（By Category）

### 🌐 サプライチェーン攻撃
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0527-GLASSWORM` · `CTI-2026-0527-GITEA` · `CTI-2026-0530-GOGS` · `CTI-2026-0524-DUALTHREAT` · `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` · `CTI-2026-0420-VERCEL`

### 🔓 ゼロデイ・脆弱性
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0603-NETSCALER` · `CTI-2026-0521-YELLOWKEY` · `CTI-2026-0520-DRUPAL` · `CTI-2026-0520-EXCHANGE` · `CTI-2026-0520-CPANEL` · `CTI-2026-0430-COPYFAIL` · `CTI-2026-0320-CORUNA`

### 🕵️ 北朝鮮・国家支援型脅威
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH`（APT43）· `CTI-2026-0510-LAZARUS-GITHOOKS` · `CTI-2026-0507-SCARCRUFT`（APT37）· `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0514-CTRL_RussianRAT`

### 🤖 AI / LLM 脅威
* `CTI-2026-0601-GREYVIBE` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0530-CHATGPHISH` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0520-EVILTOKENS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0514-ChatGPT_DNS_SideChannel` · `CTI-2026-0510-MYTHOS-AI` · `CTI-2026-0505-VIBE` · `CTI-2026-0422-MCP`

### 💰 Web3・暗号資産
* `CTI-2026-0528-KELPDAO` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` · `CTI-2026-0427-LITECOIN`

### 🇰🇷 韓国サイバーセキュリティ政策
* `CTI-2026-0320-CORUNA` · `CTI-2026-0420-VERCEL` · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0604-WEBSPHERE`

---

## 🧭 分析方法論（Methodology）

### Traffic Light Protocol (TLP)
| ラベル | 意味 | 本リポジトリ |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | コミュニティ共有・公開可 | **デフォルト** |
| 🟡 TLP:AMBER | 組織内限定 | 該当なし |
| 🔴 TLP:RED | 個別受領者限定 | 該当なし |

### 深刻度（Severity）
| 等級 | 意味 | 対応時間 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 国家安全保障・大規模民間被害に直結 | 即時 |
| 🔴 **HIGH** | 産業・エコシステムへの広範な影響 | 24–72時間 |
| 🟠 **MEDIUM** | 特定企業・組織群に限定 | 7日以内 |
| 🟡 **LOW** | 認知・観察レベル | 30日以内 |

### フレームワーク参照
* **MITRE ATT&CK** · **NIST SP 800-61**（インシデント対応）· **NIST SP 800-207**（ゼロトラスト）· **STIX/TAXII** · **Mandiant UNC/APT 命名**

各 Key Judgment は **High / Medium / Low** の確度を明示し、一次資料と二次公開 CTI をクロス検証します。

---

## 📝 命名規則（Naming Convention）

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>
```
* `SUBJECT` — トピックを表す大文字キーワード
* `LANG` — `KR/KO` · `EN` · `JP/JA` · `CN/ZH`
* `ext` — `md`（標準）· `pdf`（正式版）

---

## 🤝 連絡・貢献（Contact & Contribution）

| チャネル | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — フィードバック・訂正・情報提供 |
| **GitHub Issues** | [Issue 作成](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC・参考文献の追加提案 |
| **情報源保護** | 機微な情報提供は Signal・ProtonMail 等の安全なチャネルで |

---

## ⚖️ 免責事項（Disclaimer）

1. 本リポジトリの全レポートは**公開 OSINT 資料・報道**に基づく独立分析であり、関連する組織・機関・企業の公式見解を代表しません。
2. 内容は**教育・防御・研究・政策立案目的**にのみ使用すべきであり、攻撃・侵害・違法行為への使用を厳禁します。
3. IoC・脆弱性情報は公開時点のものであり、実運用前に最新状態を再確認してください。
4. 著者は本資料の直接・間接の使用により生じたいかなる損害についても責任を負いません。

---

## 📊 リポジトリ統計（Repository Stats）

|  |  |
| --- | --- |
| **総レポート数** | 37（シリーズ基準） |
| **対応言語** | 한국어 · English · 日本語 · 中文 |
| **主要脅威アクター** | Lazarus · Kimsuky（APT43）· ScarCruft（APT37）· ShinyHunters · GREYVIBE · 他多数 |
| **最終更新** | 2026-06-04 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*「今日の国家戦略資産が、明日のサイバー犯罪ツールになる。」— CTI-2026-0320*
