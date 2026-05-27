# 🛡️ サイバー脅威インテリジェンスレポート (Cyber Threat Intelligence Report)

> **独立サイバー脅威インテリジェンスレポートアーカイブ**
> *Independent Cyber Threat Intelligence Archive · OSINT ベースの防御的研究*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20ZH%20%7C%20JA-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--28-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

本リポジトリは、防御・研究・政策立案を目的とした**公開サイバー脅威インテリジェンス（Open CTI）レポート**を収集・発行する独立したアーカイブです。すべてのレポートは OSINT に基づいて作成され、特定の組織・機関・国家の公式見解を代表するものではありません。

🌐 **他の言語で読む / Read in other languages:** [한국어](README.md) · [English](README_EN.md) · [中文](README_CN.md)

---

## 📇 アナリストについて

|  |  |
| --- | --- |
| **氏名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **役職 (Role)** | Betalabs Inc. CEO · 独立脅威インテリジェンスアナリスト · 元 Cyworld Z CEO |
| **専門分野** | Web3・ブロックチェーンセキュリティ、サプライチェーン攻撃、ゼロデイエコシステム、北朝鮮・国家背景脅威、AI SaaS セキュリティ |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新レポート — 注目

> 🆕 **2026-05-28 発行（KelpDAO 事件は 4 言語同時発行）**

### KelpDAO LayerZero ブリッジハッキング — オフチェーン検証インフラの単一障害点を狙った高度な攻撃

**1-of-1 DVN、RPC ノードポイズニング、そして DeFi 全体へ波及したシステミックリスク**

2026年4月18日、北朝鮮系 Lazarus Group の下部組織 TraderTraitor が KelpDAO の LayerZero ブリッジインフラを攻撃し、**116,500 rsETH（約2億9,200万ドル）** を窃取した。攻撃者はスマートコントラクトのバグではなく、オフチェーン検証インフラの 1-of-1 DVN 単一障害点と RPC ノードポイズニングを精密に突いた。**2026年最大の DeFi ハッキング事件**であり、北朝鮮がわずか2件の攻撃で 2026 年の世界の暗号資産ハッキング被害の76%を占める結果をもたらした事件である。

| 項目 | 値 |
| --- | --- |
| **レポートID** | `CTI-2026-0528-KELPDAO` |
| **深刻度** | 🔴 CRITICAL |
| **分類** | `TLP:GREEN` |
| **脅威アクター** | Lazarus Group（TraderTraitor · 北朝鮮系） |
| **言語** | KR · EN · ZH · JA |

**📄 ダウンロード：** [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇨🇳 ZH](CTI-2026-0528-KELPDAO_ZH.md) · [🇯🇵 JA](CTI-2026-0528-KELPDAO_JA.md)

---

## 📚 レポートインデックス — 全レポート一覧

> 💡 新規レポートは発行時点に合わせて本表の**最上段**に追加されます。ファイル命名規則は `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` です。

| ID | 発行日 | タイトル | 深刻度 | 言語 |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_JA.md) | 2026-05-28 | KelpDAO LayerZero ブリッジハッキング — オフチェーン検証インフラの単一障害点 | 🔴 CRITICAL | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md) | 2026-05-27 | GlassWorm C2 インフラの同時テイクダウン — 開発者を狙う自己増殖型サプライチェーンワーム | 🔴 HIGH | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_JA.md) | 2026-05-27 | Gitea コンテナレジストリの未認証露出（CVE-2026-27771）— 4年間放置された「プライベート」という幻想 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) · [JA](CTI-2026-0527-GITEA_JA.md) |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_JA.md) | 2026-05-27 | AI チャットボットの推奨を悪用したクリプトジャッキング — 検索ポイズニングを超える新たな配信ベクトル | 🔴 HIGH | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) | 2026-05-26 | 英国政府によるロシア暗号資産制裁 — 国家レベルのデジタル資産制裁動向 | 🟠 MEDIUM | [KR](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [PDF](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.pdf) |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) | 2026-05-26 | Kimsuky（APT43）PebbleDash · AppleSeed 新規分析 | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [PDF](CTI-2026-0526-KIMSUKY-PEBBLEDASH.pdf) |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_JP.md) | 2026-05-24 | 同時発生した二つの脅威分析 (Two Concurrent Threats) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [PDF](CTI-2026-0524-DUALTHREAT_KR.pdf) |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) | 2026-05-22 | EDR バイパス手法 3 段階分析 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) · [PDF](CTI-2026-0522-EDR3_KR.pdf) |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) | 2026-05-21 | Windows BitLocker バイパスゼロデイ（YellowKey） | 🔴 HIGH | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) | 2026-05-21 | 2026 年北朝鮮ハッキングトレンド総合分析 | 🔴 HIGH | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20JA.md) | 2026-05-20 | FAST16 レポート | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub 内部リポジトリハッキング — 従業員デバイス侵害による 3,800+ 内部リポ流出 | 🔴 HIGH | [Report](CTI-2026-0520-GITHUB.md) |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Microsoft Exchange Server セキュリティ脆弱性 | 🔴 HIGH | [Report](CTI-2026-0520-EXCHANGE.md) |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupal コア最高危険度脆弱性緊急警報 — ゼロデイ、パッチなし | 🔴 CRITICAL | [Report](CTI-2026-0520-DRUPAL.md) |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI 生成デバイスコードフィッシング PhaaS | 🔴 HIGH | [Report](CTI-2026-0520-EVILTOKENS.md) |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel ハッキング事件分析 | 🟠 MEDIUM | [Report](CTI-2026-0520-CPANEL.md) |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) | 2026-05-17 | 北朝鮮による LLM を用いたハッキング — AI サイバー攻撃とエージェント防御 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | ロシア系 RAT — LNK/RDP 制御経路分析 | 🔴 HIGH | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNS サイドチャネル更新 | 🟠 MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | 2026-05-10 | 北朝鮮 Lazarus Git Hooks ハッキングレポート | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [PRESS PDF](CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.pdf) |
| [`CTI-2026-0510-MYTHOS`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Claude Mythos AI 脆弱性分析 | 🔴 HIGH | [Report](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_JP.md) | 2026-05-07 | ScarCruft（APT37）キャンペーン分析 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | Vibe、人工知能ハッキングの時代 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub セキュリティ事件分析 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | 'Copy Fail' セキュリティレポート（CVE-2026-31431） | 🟠 MEDIUM | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | Litecoin 脆弱性レポート | 🔴 HIGH | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20jp.MD) | 2026-04-22 | MCP を狙う高度かつ潜伏型攻撃 — 構造的問題か | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel セキュリティ侵害事件 — AI SaaS サプライチェーン攻撃と ShinyHunters 脅威評価 | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](Analysis%20EN.MD) | 2026-03-20 | サイバー兵器サプライチェーンの崩壊と国家安全保障の脅威 — Coruna iOS Exploit Kit ケース分析 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

---

## 🗂️ カテゴリー別

### 🌐 サプライチェーン攻撃 (Supply Chain Attacks)

攻撃者が最終標的ではなく「信頼される第三者ベンダー」を先に侵害して間接的アクセスを得る攻撃タイプ。SolarWinds、Salesloft-Drift 以降、2025–2026 年に最も急速に増加したカテゴリー。

* [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md) — GlassWorm 4 重 C2（Solana · BitTorrent DHT · Google Calendar · VPS）の同時テイクダウン
* [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_JA.md) — Gitea コンテナレジストリの未認証露出（CVE-2026-27771）
* [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — 従業員デバイス侵害による 3,800+ GitHub 内部リポ流出
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — 北朝鮮 Lazarus の Git Hooks サプライチェーン攻撃
* [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub セキュリティ事件分析
* [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20jp.MD) — Anthropic MCP サプライチェーン攻撃（潜伏型攻撃を含む）
* [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) — Vercel × Context.ai × ShinyHunters（AI SaaS OAuth サプライチェーン侵害）

### 📱 モバイル・ゼロデイ脅威 (Mobile & Zero-Day)

iOS・Android 等モバイルプラットフォームを対象とする国家級監視ツールおよび商用エクスプロイトキットの分析。

* [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) — Windows BitLocker バイパスゼロデイ
* [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal コア最高危険度脆弱性（ゼロデイ、パッチなし）
* [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Microsoft Exchange Server セキュリティ脆弱性
* [`CTI-2026-0320-CORUNA`](Analysis%20EN.MD) — Coruna iOS Exploit Kit（CVE-2024-23222）とサイバー兵器サプライチェーン

### 🕵️ 脅威アクタープロファイル (Threat Actor Profiles)

特定の APT グループ・サイバー犯罪組織の TTP・キャンペーン・帰属情報の整理。

* **Lazarus Group / TraderTraitor（北朝鮮）** — [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_JA.md), [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md)
* **Kimsuky / APT43（北朝鮮）** — [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md)
* **ScarCruft / APT37（北朝鮮）** — [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_JP.md)
* **北朝鮮総合トレンド** — [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md), [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md)
* **ShinyHunters**（UNC6040/UNC6240/UNC6661/UNC6671）— [`CTI-2026-0420-VERCEL` §5](CTI-2026-0420-VERCEL_EN.md)
* **UNC1069 / Sapphire Sleet（北朝鮮）** — [`CTI-2026-0422-MCP` §3.3](Cti%202026%200422%20mcp%20jp.MD)
* **UNC6353·UNC6691·Operation Zero** — [`CTI-2026-0320-CORUNA` §3](Analysis%20EN.MD)
* **ロシア系 RAT オペレーター** — [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md), [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md)

### 💰 Web3・暗号資産エコシステム (Web3 & Crypto)

DeFi・CEX・ステーブルコイン・NFT マーケットプレイスに関する侵害事件と、韓国国内（DAXA・KoFIU・特定金融情報法）のコンプライアンス観点の分析。

* [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_JA.md) — KelpDAO LayerZero ブリッジハッキング（2.92億ドル、2026 年最大の DeFi ハッキング）
* [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_JA.md) — AI チャットボット推奨を悪用した GPU 標的クリプトジャッキング
* [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_JA.md) — 暗号資産ウォレット・NPM トークン窃取、Solana ブロックチェーン C2
* [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) — 英国政府によるロシア暗号資産制裁
* [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) — Litecoin 脆弱性レポート
* [`CTI-2026-0420-VERCEL` §8](CTI-2026-0420-VERCEL_EN.md) — Vercel 侵害が Web3 フロントエンドインフラに与える影響
* [`CTI-2026-0320-CORUNA` §4](Analysis%20EN.MD) — ゼロデイ取引エコシステムと暗号資産ベースの決済構造

### 🤖 AI セキュリティと LLM 脅威 (AI Security & LLM Threats)

LLM・AI エージェント・MCP など AI システムを対象とする新たな攻撃面の分析。

* [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_JA.md) — AI 検索ポイズニング、LLM 推奨の悪用
* [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) — 北朝鮮による LLM を用いたハッキング、エージェント防御
* [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS サイドチャネル
* [`CTI-2026-0510-MYTHOS`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Claude Mythos AI 脆弱性
* [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — Vibe、人工知能ハッキングの時代
* [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20jp.MD) — MCP 潜伏型攻撃とバイアス注入

### 🇰🇷 韓国サイバーセキュリティ政策 (Korea Cybersecurity Policy)

韓国国内政府・公共機関・防衛産業を対象とする脅威分析と制度的対応の提言。

* [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) — 韓国国内を標的とする Kimsuky 新キャンペーン
* [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_JP.md) — 同時発生した二つの脅威（韓国国内への影響）
* [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) — 2026 年北朝鮮ハッキングトレンド総合
* [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_JP.md) — 韓国人士を標的とする ScarCruft キャンペーン
* [`CTI-2026-0320-CORUNA` §6–§8](Analysis%20EN.MD) — 韓国政府サイバーセキュリティ構造の脆弱性と「サイバーセキュリティ・ニューディール」提言
* [`CTI-2026-0420-VERCEL` §8.2](CTI-2026-0420-VERCEL_EN.md) — DAXA 加盟取引所・韓国国内 Web3 発行体の観点

---

## 🧭 分析方法論

本アーカイブのすべてのレポートは以下の標準に従います。

### Traffic Light Protocol (TLP) 分類

| ラベル | 意味 | 本リポジトリ基準 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | コミュニティ内共有可能、対外公開可能 | **本リポジトリの既定値** |
| 🟡 TLP:AMBER | 組織内部共有限定 | 該当なし |
| 🔴 TLP:RED | 個別受信者限定 | 該当なし |

### 深刻度等級

| 等級 | 意味 | 対応時間 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 国家安全保障・大規模民間被害に直結する脅威 | 即時 |
| 🔴 **HIGH** | 産業・エコシステムに広範な影響 | 24–72 時間 |
| 🟠 **MEDIUM** | 特定企業・組織群に限定的影響 | 7 日以内 |
| 🟡 **LOW** | 認知・観察レベル | 30 日以内 |

### 確度評価

各 Key Judgment は **High / Medium / Low** の 3 段階で確度を明示し、一次資料と二次報道・公開 CTI 資料を相互検証します。

### フレームワーク参照

* **MITRE ATT&CK** — TTP マッピングの標準
* **NIST SP 800-61** — インシデント対応ライフサイクル
* **NIST SP 800-161** — サイバーサプライチェーンリスクマネジメント（C-SCRM）
* **NIST SP 800-190** — コンテナセキュリティ
* **NIST SP 800-207** — ゼロトラストアーキテクチャ
* **STIX/TAXII** — 脅威インテリジェンス交換標準
* **Mandiant UNC/APT ネーミング** — 脅威アクタークラスタリング

---

## 📝 ファイル命名規則

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

例：
  CTI-2026-0528-KELPDAO_KR.md    → 2026年5月28日発行、KelpDAO 事件、韓国語 Markdown
  CTI-2026-0528-KELPDAO_EN.md    → 同事件の英語版
  CTI-2026-0528-KELPDAO_ZH.md    → 中国語版
  CTI-2026-0528-KELPDAO_JA.md    → 日本語版
```

* `SUBJECT` — レポートの主題を代表するキーワード（大文字）
* `LANG` — `KR`（韓国語）/ `EN`（英語）/ `ZH` または `CN`（中国語）/ `JA` または `JP`（日本語）
* `ext` — `md`（既定）/ `pdf`（正式配布版）

---

## 🤝 連絡先と貢献

| チャネル | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — レポートのフィードバック・訂正・通報 |
| **GitHub Issues** | [イシュー作成](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 更新・参考文献追加の提案 |
| **通報の保護** | 機微な通報は Signal・ProtonMail などのセキュアチャネルでお問い合わせください。 |

本リポジトリは個人研究プロジェクトであり、PR は歓迎しますが、レポート本文の修正は慎重に審査されます。

---

## ⚖️ 免責事項

1. 本リポジトリのすべてのレポートは、**公開された OSINT 資料および報道**に基づく独立した分析であり、関連する組織・機関・企業の公式見解を代表するものではありません。
2. レポートの内容は**教育・防御・研究・政策立案目的**にのみ使用されるべきであり、攻撃・侵害・違法活動への使用は厳に禁じます。
3. IoC・脆弱性情報は発行時点を基準とし、実際の適用前には必ず最新の状態を再確認してください。
4. 著者は本資料の直接的・間接的使用により生じたいかなる損害についても責任を負いません。

---

## 📊 リポジトリ統計

|  |  |
| --- | --- |
| **総レポート数** | 30+ |
| **対応言語** | 韓国語、English、中文、日本語 |
| **観測された脅威アクター** | Lazarus Group · TraderTraitor · Kimsuky/APT43 · ScarCruft/APT37 · UNC1069/Sapphire Sleet · ShinyHunters · UNC6353/UNC6691 · Operation Zero · GlassWorm operators · その他多数 |
| **最終更新** | 2026-05-28 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
