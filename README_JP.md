# 🛡️ サイバー脅威インテリジェンスレポート (Cyber Threat Intelligence Report)

> **🌐 Languages | 言語選択:**
> [🇰🇷 한국어](./README.md) · [🇬🇧 English](./README_EN.md) · [🇨🇳 中文(簡體)](./README_CN.md) · **🇯🇵 日本語**

> **独立サイバー脅威インテリジェンス・レポート アーカイブ**
> *Independent Cyber Threat Intelligence Archive · OSINT に基づく防御研究 · 多言語配信*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20CN%20%7C%20JP-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--10-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/commits/main)
[![Reports](https://img.shields.io/badge/Reports-8-orange?style=flat-square)](#-レポート索引)

---

本リポジトリは、防御・研究・政策立案を目的とした **公開サイバー脅威インテリジェンス(Open CTI)レポート** を収集・発行する独立アーカイブです。すべてのレポートは OSINT(オープンソースインテリジェンス)に基づき作成され、特定の組織・機関・国家の公式見解を代表するものではありません。中核的な関心領域: **Web3・ブロックチェーン セキュリティ、AI / MCP セキュリティ、サプライチェーン攻撃、北朝鮮および国家支援型脅威、韓国サイバー安全保障政策**。

---

## 📇 アナリストについて (About the Analyst)

|  |  |
| --- | --- |
| **氏名** | Dennis Kim (김호광 / HoKwang Kim) |
| **役職** | Betalabs Inc. CEO · 独立脅威インテリジェンス アナリスト · 元 Cyworld Z CEO · ベテラン Microsoft Azure MVP |
| **専門分野** | Web3・ブロックチェーンセキュリティ · AI / MCP セキュリティ · サプライチェーン攻撃 · ゼロデイ生態系 · 北朝鮮・国家支援型脅威 · 韓国サイバー安全保障政策 |
| **メール** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |
| **媒体** | [Web3Paper](https://web3paper.net/ko) — 韓英バイリンガル ブロックチェーン メディア |

---

## ⭐ 最新レポート — Featured

> 🆕 **2026-05-10 発行 · 4 言語同時公開**

### 北朝鮮 Lazarus Group の新たな隠蔽手法:`.git/hooks/` を 2 段階ローダーとして使用する Contagious Interview / TaskJacker キャンペーン

北朝鮮 Lazarus Group(MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima)が偽装求人キャンペーンの 2 段階マルウェア ローダーを **`.git/hooks/` ディレクトリに隠蔽する**新たな手法を導入した。このディレクトリは **git 自身が追跡しないため**、**PR diff・コードレビュー・SAST スキャンのいずれにも現れない**。標的が `git pull` を一度実行するだけで、コードを 1 行も実行することなく認証情報・暗号通貨ウォレット・SSH 鍵が窃取される。

**核心的洞察:** 北朝鮮は AI LLM を積極的に導入し、検出回避のためのリアルタイム言語・プラットフォーム移植を実施している。本キャンペーンの **5 番目の進化** である — npm パッケージ(2022~)→ 偽 Web 会議ツール(2024)→ 大規模 npm キャンペーン 338 個(2025)→ VS Code Tasks(2026 Q1)→ git hooks。

| 項目 | 値 |
| --- | --- |
| **レポート ID** | `CTI-2026-0510-LAZARUS-GITHOOKS` |
| **深刻度** | 🔴 HIGH — 韓国の開発者・取引所・Web3 を直接の標的とする |
| **TLP** | `TLP:GREEN` |
| **脅威アクター** | Lazarus Group / Famous Chollima / Sapphire Sleet(北朝鮮偵察総局) |
| **累積被害** | 2017 年以降累計 67.5 億ドル+(Chainalysis); 2025 年単年 20.2 億ドル |
| **出典** | OpenSourceMalware(一次)+ Microsoft、Cisco Talos、Abstract Security のクロスチェック |

**📄 レポート ダウンロード(4 言語)**

| 言語 | Markdown | PDF |
| --- | --- | --- |
| 🇰🇷 韓国語 | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf)(正式版) |
| 🇬🇧 英語 | [`CTI-2026-0510-LAZARUS-GITHOOKS_EN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | — |
| 🇨🇳 中国語(簡体) | [`CTI-2026-0510-LAZARUS-GITHOOKS_CN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | — |
| 🇯🇵 日本語 | [`CTI-2026-0510-LAZARUS-GITHOOKS_JP.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | — |

**📰 プレスリリース**

* 🇰🇷 [韓国語プレスリリース(1 ページ要約 + Lazarus 累積被害 + 韓国への影響 + FAQ)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx)

---

## 🗞️ 最近のハイライト

### 2026-05-10 · Mythos × CVE-2026-4747 — 「AI は新しい脆弱性を発見したのではなく、古い脆弱性を見つけるコストを崩落させた」
Anthropic が「AI が自律的に発見した初の遠隔カーネル脆弱性」として発表した FreeBSD NFS RCE が、19 年前に公開された MIT Kerberos `librpcsecgss` 欠陥と相同の欠陥であるという Rival Security の分析を CTI 視点で検証。
[KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md)

### 2026-05-07 · ScarCruft、延辺ゲーミングプラットフォームを丸ごと制圧したサプライチェーン攻撃
APT37(北朝鮮)による sqgame 侵害事例として **脱北者・人権活動家を標的にしたスパイ作戦** を分析。コードネーム `zhuagou(抓狗)` の語彙論的分析。
[KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf)

### 2026-04-30 · Copy Fail (CVE-2026-31431) — 732 バイトで主要 Linux 全てに root 権限
**Theori の Lee Tae-yang と Xint Code の AI 支援により発見**。9 年間潜んでいた Linux カーネル特権昇格 + コンテナ脱出プリミティブ分析。
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD)

### 2026-04-27 · ライトコイン MWEB ゼロデイ事件
**13 ブロック reorg、silent patch、フォーク チェーン構造リスク** の定量分析。ライトコイン財団の CVD 違反疑惑、取引所 / ETF ガバナンスへの含意。
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf)

---

## 📚 レポート索引

| ID | 発行日 | タイトル | 深刻度 | 言語 | ダウンロード |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | 2026-05-10 | Lazarus Group の `.git/hooks/` 隠蔽手法 — Contagious Interview / TaskJacker キャンペーン | 🔴 HIGH | KR · EN · CN · JP | [KR](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [Press KR](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) | 2026-05-10 | AI は新しい脆弱性を発見したのではなく、古い脆弱性を安く見つける時代を作った — Mythos × CVE-2026-4747 × CVE-2007-3999 | 🔴 HIGH | KR | [KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) |
| [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_JP.md) | 2026-05-07 | ScarCruft、延辺ゲーミングプラットフォームを丸ごと制圧したサプライチェーン攻撃 — APT37 sqgame 侵害および脱北者標的諜報作戦 | 🔴 HIGH | KR · EN · JP | [KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | Copy Fail (CVE-2026-31431) — 732 バイトで主要 Linux 全てに root、9 年前のカーネル LPE + コンテナ脱出 | 🔴 CRITICAL | KR | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) | 2026-04-27 | ライトコイン MWEB ゼロデイ事件 — 13 ブロック reorg、silent patch、フォークチェーン構造リスクの定量分析 | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) | 2026-04-22 | MCP を狙う知能型攻撃・潜伏型攻撃 — 構造的問題なのか | 🔴 HIGH | KR · EN · CN · JP | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) · [CN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) · [JP](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) · [PDF](./CTI-2026-0422-MCP_KR.pdf) · [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) · [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel セキュリティ侵害事件 — AI SaaS サプライチェーン攻撃と ShinyHunters 脅威評価 | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Vercel_%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%89%E1%85%A1%E1%84%80%E1%85%A5%E1%86%AB_%E1%84%87%E1%85%AE%E1%86%AB%E1%84%89%E1%85%A5%E1%86%A8%E1%84%85%E1%85%B5%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | サイバー兵器サプライチェーンの崩壊と国家安全保障の脅威 — Coruna iOS Exploit Kit 事例分析 | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 新規レポートは発行時点で本表の **最上段** に追加されます。命名規則は [Naming Convention](#-命名規則) セクション参照。

---

## 🗂️ カテゴリー別

### 🤖 AI セキュリティ · MCP · LLM
AI エージェント・MCP(Model Context Protocol)・LLM ベース システムのセキュリティ リスク。潜伏型(sleeper)攻撃モデル、モデル サプライチェーン汚染、AI 支援脆弱性発見の経済学。

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — Claude Mythos の「組合せ的創造性」仮説検証 + 脆弱性経済学の崩落
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — 北朝鮮による AI LLM 駆動のリアルタイム言語・プラットフォーム移植パターン
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) — MCP 構造的 RCE、Sleeper MCP、Web3 ウォレット攻撃面、バイアス注入攻撃

### 🌐 サプライチェーン攻撃
攻撃者が最終標的ではなく「信頼される第三者ベンダー」を先に侵害する攻撃類型。SolarWinds、Salesloft–Drift 以降、2025–2026 年に最も急速に拡大したカテゴリー。

* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — Lazarus × 偽装求人 × `.git/hooks/` 隠蔽(開発者ワークステーション侵入)
* [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_JP.md) — APT37 × sqgame ゲーミングプラットフォーム侵害(脱北者標的)
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) — MCP サプライチェーン × Axios NPM 侵害(UNC1069) × マーケットプレイス汚染
* [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) — Vercel × Context.ai × ShinyHunters(AI SaaS OAuth サプライチェーン侵害)

### 🐧 カーネル / インフラ脆弱性
Linux カーネル、ハイパーバイザー、コンテナ ランタイム等、システムの信頼基盤(TCB)を直接攻撃する欠陥分析。複数ディストリ・複数環境への横断的影響を中核関心とする。

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — FreeBSD NFS RCE (CVE-2026-4747) と MIT Kerberos の同型欠陥 (CVE-2007-3999)
* [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) — Copy Fail (CVE-2026-31431) · 9 年前の Linux カーネル LPE + コンテナ脱出プリミティブ

### 📱 モバイル / ゼロデイ脅威
iOS、Android 等のモバイル プラットフォームを標的とする国家級監視ツール、商業エクスプロイト キット分析。

* [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) およびサイバー兵器サプライチェーン

### 💰 Web3 / 暗号通貨エコシステム
DeFi、中央集権型取引所(CEX)、ステーブルコイン、NFT マーケットプレイス関連の侵害事件。韓国コンプライアンス観点(DAXA、KoFIU、特金法)を含む。

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — DAXA 5 大取引所と Web3 発行事業者の deploy 鍵保護推奨事項
* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) — ライトコイン MWEB ゼロデイ、13 ブロック reorg、取引所 / ETF ガバナンスへの含意
* [`CTI-2026-0422-MCP §4`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) — MCP-ウォレット統合の単一マシン構造リスクと外部エスクロー設計原則
* [`CTI-2026-0420-VERCEL §8`](./CTI-2026-0420-VERCEL_EN.md) — Vercel 侵害が Web3 フロントエンド インフラに与える影響
* [`CTI-2026-0320-CORUNA §4`](./CTI-2026-0320-CORUNA_KR.md) — ゼロデイ取引エコシステムと暗号通貨ベース決済構造

### 🕵️ 脅威アクター プロファイル
特定 APT グループ・サイバー犯罪団体の TTP・キャンペーン・帰属情報整理。

* **Lazarus Group / Famous Chollima / G1052**(北朝鮮、累計 67.5 億ドル+ の暗号通貨窃取) — [CTI-2026-0510-LAZARUS-GITHOOKS](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md)
* **APT37 / ScarCruft / RedAnt**(北朝鮮、脱北者・人権活動家標的) — [CTI-2026-0507](./CTI-2026-0507-SCARCRUFT_JP.md)
* **UNC1069 / Sapphire Sleet**(北朝鮮連携、サプライチェーン汚染実例) — [CTI-2026-0422 §3.3](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD)
* **ShinyHunters**(UNC6040 / UNC6240 / UNC6661 / UNC6671) — [CTI-2026-0420 §5](./CTI-2026-0420-VERCEL_EN.md)
* **UNC6353 · UNC6691 · Operation Zero** — [CTI-2026-0320 §3](./CTI-2026-0320-CORUNA_KR.md)

### 🇰🇷 韓国サイバー安全保障政策
国内政府・公共機関・防衛産業向け脅威分析と制度的対応の提言。

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5, §8`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) — DAXA / KISA / NIS / KoFIU 共同警報および LinkedIn 韓国 takedown チャネル提言
* [`CTI-2026-0507-SCARCRUFT §7`](./CTI-2026-0507-SCARCRUFT_JP.md) — 脱北者 / 人権活動家保護体制および連携ゲーミング プラットフォーム監視提言
* [`CTI-2026-0422-MCP §3.3`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) — 北朝鮮の MCP サプライチェーン汚染可能性と「国家安全保障案件化」提言
* [`CTI-2026-0320-CORUNA §6–§8`](./CTI-2026-0320-CORUNA_KR.md) — 韓国政府サイバー セキュリティ アーキテクチャの脆弱性と「サイバー セキュリティ ニューディール」提言

---

## 📰 プレスリリース

記者・編集者・研究者がレポートの内容を即時に活用できるよう、核心統計・引用・FAQ・連絡先をまとめた要約版を別途プレスリリース形式で提供しています。すべてのプレスリリースは `TLP:GREEN` の下で自由に引用可能です(出典明記必須)。

| レポート | 韓国語 | English |
| --- | --- | --- |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | [Press KR (docx)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) | — |
| `CTI-2026-0422-MCP` | [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) | [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |

---

## 📡 配信チャネル

レポートは GitHub 以外に以下のチャネルでもご覧いただけます。

| チャネル | 用途 | リンク |
| --- | --- | --- |
| **GitHub(本リポジトリ)** | 一次発行、フルバージョン資料 | [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| **Web3Paper** | 韓国語 / 英語の分析コラム | [web3paper.net/ko](https://web3paper.net/ko) |
| **LinkedIn** | 英語コラム要約 + 業界・企業への含意 | *(プロフィール リンク後日追加)* |
| **Facebook** | 韓国語の時事コメント・ディスカッション | *(プロフィール リンク後日追加)* |

> 📩 **引用・再配布ポリシー**: すべてのレポートは `TLP:GREEN` の下で自由引用可能です。**出典明記必須** — `Dennis Kim, 김호광, gameworker@gmail.com / https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT`。

---

## 🧭 分析方法論

本アーカイブのすべてのレポートは以下の標準に従います。

### Traffic Light Protocol (TLP) 分類

| ラベル | 意味 | 本リポジトリ基準 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | コミュニティ内共有可、対外公開可 | **本リポジトリの既定値** |
| 🟡 TLP:AMBER | 組織内部共有限定 | 該当なし |
| 🔴 TLP:RED | 個別受領者限定 | 該当なし |

### 深刻度等級

| 等級 | 意味 | 対応時間 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 国家安全保障 / 大規模民間被害に直結する脅威 | 即時 |
| 🔴 **HIGH** | 産業 / エコシステム広範影響 | 24–72 時間 |
| 🟠 **MEDIUM** | 特定企業 / 組織群への限定影響 | 7 日以内 |
| 🟡 **LOW** | 認知 / 観察レベル | 30 日以内 |

### 信頼度評価

各 Key Judgment は **High / Medium-High / Medium / Low** 段階で信頼度を明示し、一次資料と二次報道・公開 CTI 資料を交差検証します。語彙論的・状況的推論は別途明記されます。

### 参照フレームワーク

* **MITRE ATT&CK**(Enterprise + Mobile) — TTP マッピング標準
* **NIST SP 800-61** — インシデント対応ライフサイクル
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX / TAXII** — 脅威インテリジェンス交換標準
* **Mandiant UNC / APT 命名** — 脅威アクター クラスタリング
* **Traffic Light Protocol 2.0**(FIRST.org) — 情報共有分類標準

---

## 📝 命名規則

```
CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>

メインレポート:
  CTI-2026-0510-LAZARUS-GITHOOKS_KR.md  → 2026-05-10 発行、韓国語 Markdown
  CTI-2026-0510-LAZARUS-GITHOOKS_EN.md  → 同事件の英語版
  CTI-2026-0422-MCP_KR.pdf              → MCP 事件の韓国語 PDF 正式版

派生文書(SUBTYPE 使用):
  CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx → 韓国語プレスリリース
  CTI-2026-0422-MCP-PRESS_EN.md                → 英語プレスリリース
```

* `SUBJECT` — レポート主題を代表するキーワード(大文字、複数語はハイフンで連結)。
* `SUBTYPE` — 任意。メインレポートからの派生文書(`PRESS`、`BRIEF`、`SLIDES` 等)を区別。
* `LANG` — `KR`(韓国語)/ `EN`(英語)/ `JP`(日本語)/ `CN`(中国語、簡体)。
* `ext` — `md`(既定)/ `pdf`(正式版)/ `docx`(編集用)。

> ⚠️ **レガシー ファイル名について**: 一部の初期レポートは GitHub アップロード過程で空白・小文字エンコーディングが適用されています(例: `Cti%202026%200422%20mcp%20kr.MD`)。新規レポートは上記標準に従い、旧ファイル名は段階的に正規化されます。

---

## 🤝 連絡 / 貢献

| チャネル | 用途 |
| --- | --- |
| **メール** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — レポート フィードバック・訂正・タレコミ・取材依頼 |
| **GitHub Issues** | [Issue 作成](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 更新・参照資料追加提案 |
| **情報源保護** | 機微なタレコミ(特に脱北者 / 活動家のセキュリティ事案)は Signal、ProtonMail 等のセキュア チャネルでお問い合わせください。 |

本リポジトリは個人研究プロジェクトであり、貢献 PR を歓迎しますが、レポート本文の修正は慎重に検討されます。

---

## ⚖️ 免責事項

1. 本リポジトリのすべてのレポートは、**公開された OSINT 資料および報道** に基づく独立分析であり、関連組織・機関・企業の公式見解を代表するものではありません。
2. レポートの内容は **教育・防御・研究・政策立案目的** にのみ使用されるべきであり、攻撃・侵害・違法行為への使用は厳格に禁じられます。
3. IoC・脆弱性情報は発行時点を基準とします。実運用前に最新状態を必ず再確認してください。
4. 一部の分析(特にツール系譜・語彙論的推論)は状況的手がかりに基づき、断定的帰属ではないことを明示します。
5. 著者は本資料の直接的・間接的使用に起因するいかなる損害についても責任を負いません。

---

## 📊 リポジトリ統計

|  |  |
| --- | --- |
| **レポート総数** | **8** |
| **対応言語** | 韓国語、英語、中国語(簡体)、日本語 |
| **追跡脅威アクター / 研究領域** | Lazarus Group / Famous Chollima · APT37 / ScarCruft · UNC1069 / Sapphire Sleet · ShinyHunters · UNC6353 · UNC6691 · Operation Zero · TeamPCP · 他多数 |
| **対応 CVE** | 15+(CVE-2026-31431、CVE-2026-4747、CVE-2007-3999、CVE-2024-23222、MCP 系列 6 件等) |
| **多言語ラインナップ** | LAZARUS-GITHOOKS(4 言語)· MCP(4 言語)· SCARCRUFT(3 言語)· VERCEL · LITECOIN(各 2 言語) |
| **プレスリリース数** | 3(KR×2 · EN×1) |
| **最終更新** | 2026-05-10 |

---

> **🌐 Languages | 言語選択:**
> [🇰🇷 한국어](./README.md) · [🇬🇧 English](./README_EN.md) · [🇨🇳 中文(簡體)](./README_CN.md) · **🇯🇵 日本語**

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/) · [web3paper.net](https://web3paper.net/ko)

> *「防御側が一つの通路を塞ぐたびに、Lazarus は 6 か月以内により深い場所へ移動する。」 — CTI-2026-0510-LAZARUS-GITHOOKS*
> *「AI は新しい脆弱性を作り出したのではなく、古い脆弱性を見つけるコストを崩落させた。」 — CTI-2026-0510-MYTHOS*
> *「732 バイトで 10 年の信頼を覆せる。」 — CTI-2026-0430*
> *「MCP は『使うか使わないか』ではなく『何と一緒にインストールするか』が問題だ。」 — CTI-2026-0422*
> *「今日の国家戦略資産は、明日のサイバー犯罪ツールになる。」 — CTI-2026-0320*
