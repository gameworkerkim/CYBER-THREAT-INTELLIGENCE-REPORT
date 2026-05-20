# Cyber Threat Intelligence Report

> **独立系サイバー脅威インテリジェンス・レポート アーカイブ**
> *Independent Cyber Threat Intelligence Archive · OSINTベースの防御研究*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--20-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

**言語 (Language):** [한국어](README.md) · [English](README_EN.md) · **日本語** · [中文](README_CN.md)

本リポジトリは、防御・研究・政策立案を目的とした**オープンソースのサイバー脅威インテリジェンス（CTI）レポート**を収集・公開する独立系アーカイブです。すべてのレポートはOSINTに基づいて作成されており、特定の組織・機関・国家の公式見解を代弁するものではありません。

---

## アナリストについて (About the Analyst)

|  |  |
| --- | --- |
| **氏名 (Name)** | Dennis Kim (キム・ホグァン / 김호광) |
| **役割 (Role)** | Betalabs Inc. CEO · 前 Cyworld Z CEO · 独立系脅威インテリジェンス・アナリスト · Microsoft Azure MVP |
| **専門分野** | Web3・ブロックチェーンセキュリティ、サプライチェーン攻撃、ゼロデイ・エコシステム、北朝鮮・国家支援型脅威、AI/LLMセキュリティ、MCPセキュリティ |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 最新レポート — 注目 (Featured)

> **2026-05-20 公開 — 単一週に4件の同時アラート**

5月第3週、ほぼ同時に公開・悪用された4件の高深刻度脆弱性を緊急分析しました。すべて韓国語・英語併記で公開されています。

| レポート | 要点 | 深刻度 | ダウンロード |
| --- | --- | --- | --- |
| **Drupalコア最高危険度脆弱性** (`CTI-2026-0520-DRUPAL`) | 認証不要のリモート悪用、「公開＝攻撃開始」型 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| **Exchange OWA ゼロデイ** (`CTI-2026-0520-EXCHANGE`) | CVE-2026-42897、実際に悪用中、恒久パッチなし | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| **EvilTokens PhaaS** (`CTI-2026-0520-EVILTOKENS`) | AI生成のデバイスコードフィッシング、MFA無効化 | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| **cPanel 認証バイパス** (`CTI-2026-0520-CPANEL`) | CVE-2026-41940、CVSS 9.8、大規模悪用 | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |

---

## レポート索引 — 全レポート一覧 (Report Index)

| ID | 公開日 | タイトル | 深刻度 | 言語 |
| --- | --- | --- | --- | --- |
| `CTI-2026-0520-DRUPAL` | 2026-05-20 | Drupalコア最高危険度脆弱性 緊急アラート — 認証不要リモート、パッチ間近 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| `CTI-2026-0520-EXCHANGE` | 2026-05-20 | Microsoft Exchange OWA ゼロデイ (CVE-2026-42897) | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| `CTI-2026-0520-EVILTOKENS` | 2026-05-20 | EvilTokens — AI生成デバイスコードフィッシング PhaaS | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| `CTI-2026-0520-CPANEL` | 2026-05-20 | cPanel & WHM 認証バイパス (CVE-2026-41940) | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |
| `CTI-2026-0520-FAST16` | 2026-05-20 | Fast16 — Stuxnet以前の精密計算改ざんサボタージュ・マルウェア | HIGH | [EN](CTI-2026-0520-FAST16%20EN.md) · [KR](CTI-2026-0520-FAST16%20KR.md) · [JP](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| `CTI-2026-0517-AICYBER` | 2026-05-17 | AIサイバー攻撃とエージェント型防御 — 北朝鮮のLLM活用ハッキング | HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) |
| `CTI-2026-0514-CHATGPT-DNS` | 2026-05-14 | ChatGPT DNSサイドチャネル分析 | MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| `CTI-2026-0514-RUSSIAN-RAT` | 2026-05-14 | ロシア製RAT / LNK·RDP攻撃チェーン分析 | MEDIUM | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | 2026-05-10 | 北朝鮮 Lazarus — .git/hooks マルウェアキャンペーン | HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| `CTI-2026-0510-MYTHOS` | 2026-05-10 | Mythos AI 脆弱性分析 | MEDIUM | [MD](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| `CTI-2026-0507-SCARCRUFT` | 2026-05-07 | ScarCruft (APT37) キャンペーン分析 | HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| `CTI-2026-0505-VIBE` | 2026-05-05 | Vibe — AIハッキングの時代 | MEDIUM | [MD](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE.md) · [PDF](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE_%EA%B9%80%ED%98%B8%EA%B4%91.pdf) |
| `CTI-2026-0503-GITHUB` | 2026-05-03 | GitHub RCE 脆弱性 (単一 git push による RCE) | HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| `CTI-2026-0430-COPYFAIL` | 2026-04-30 | Copy Fail — Linuxカーネル権限昇格 (CVE-2026-31431) | HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| `CTI-2026-0427-LITECOIN` | 2026-04-27 | Litecoin 脆弱性分析 | MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| `CTI-2026-0422-MCP` | 2026-04-22 | MCPを狙う高度・潜伏型攻撃 — 構造的な問題か？ | HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PRESS KR](CTI-2026-0422-MCP-PRESS_KR.md) · [PRESS EN](CTI-2026-0422-MCP-PRESS_EN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| `CTI-2026-0420-VERCEL` | 2026-04-20 | Vercel侵害 — AI SaaS サプライチェーン攻撃と ShinyHunters | HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| `CTI-2026-0320-CORUNA` | 2026-03-20 | サイバー兵器サプライチェーンの崩壊 — Coruna iOS Exploit Kit | CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

> 新規レポートは公開時に本表の**最上部**へ追加されます。命名規則は `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` です。

---

## カテゴリ別分類 (By Category)

### サプライチェーン攻撃 (Supply Chain Attacks)

攻撃者が最終標的ではなく「信頼された第三者ベンダー」を先に侵害し、間接的にアクセスする攻撃。2025–2026年に最も急増したカテゴリ。

* `CTI-2026-0520-CPANEL` — cPanel/WHM 認証バイパスによるホスティング基盤の大規模乗っ取り
* `CTI-2026-0503-GITHUB` — 単一 git push による GitHub Enterprise RCE
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters（AI SaaS OAuth サプライチェーン侵害）
* `CTI-2026-0510-LAZARUS-GITHOOKS` — .git/hooks を悪用した開発環境への侵入

### AI・LLM・MCP セキュリティ

生成AIとエージェント基盤を標的・道具とする新型脅威。本アーカイブの中核研究トラック。

* `CTI-2026-0520-EVILTOKENS` — AI生成（「バイブコーディング」）のデバイスコードフィッシング PhaaS
* `CTI-2026-0517-AICYBER` — 北朝鮮のLLM活用ハッキングとエージェント型防御
* `CTI-2026-0514-CHATGPT-DNS` — ChatGPT DNS サイドチャネル
* `CTI-2026-0510-MYTHOS` — Mythos AI 脆弱性
* `CTI-2026-0505-VIBE` — Vibe、AIハッキングの時代
* `CTI-2026-0422-MCP` — MCPを狙う高度・潜伏型攻撃

### モバイル・ゼロデイ脅威 (Mobile & Zero-Day)

iOS・Android などのプラットフォームを標的とする国家級監視ツールおよび商用エクスプロイトキットの分析。

* `CTI-2026-0520-DRUPAL` — Drupalコア 認証不要リモート（公開＝攻撃開始）
* `CTI-2026-0520-EXCHANGE` — Exchange OWA ゼロデイ (CVE-2026-42897)
* `CTI-2026-0430-COPYFAIL` — Linuxカーネル権限昇格 (CVE-2026-31431)
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit (CVE-2024-23222)

### 脅威アクター・プロファイル (Threat Actor Profiles)

特定のAPTグループ・サイバー犯罪集団のTTP・キャンペーン・帰属情報。

* **Lazarus Group**（北朝鮮）— `CTI-2026-0510-LAZARUS-GITHOOKS`
* **ScarCruft / APT37**（北朝鮮）— `CTI-2026-0507-SCARCRUFT`
* **北朝鮮のLLM活用型脅威** — `CTI-2026-0517-AICYBER`
* **ShinyHunters**（UNC6040/UNC6240/UNC6661）— `CTI-2026-0420-VERCEL`
* **UNC6353 · Operation Zero** — `CTI-2026-0320-CORUNA`

### 国家支援型サボタージュ (Nation-State Sabotage)

物理世界に影響を及ぼす破壊・撹乱型のサイバー兵器。

* `CTI-2026-0520-FAST16` — Stuxnetを5年さかのぼる精密計算改ざんマルウェア

### Web3・暗号資産エコシステム (Web3 & Crypto)

DeFi・CEX・ステーブルコイン関連の侵害と、韓国（DAXA・KoFIU）コンプライアンス観点の分析。

* `CTI-2026-0427-LITECOIN` — Litecoin 脆弱性
* `CTI-2026-0420-VERCEL` §8 — Vercel侵害がWeb3フロントエンド基盤に与える影響

---

## 分析方法論 (Methodology)

### Traffic Light Protocol (TLP) 分類

| ラベル | 意味 | 本リポジトリの基準 |
| --- | --- | --- |
| **TLP:GREEN** | コミュニティ内共有可、公開可 | **公開レポートのデフォルト** |
| **TLP:AMBER** | 組織内部共有に限定 | 一部の事前アラート |
| **TLP:RED** | 個別の受領者に限定 | 一部の実悪用レポート |

### 深刻度 (Severity)

| 等級 | 意味 | 対応時間 |
| --- | --- | --- |
| **CRITICAL** | 国家安全保障・大規模な民間被害に直結 | 即時 |
| **HIGH** | 産業・エコシステムへの広範な影響 | 24–72時間 |
| **MEDIUM** | 特定企業・組織群への限定的影響 | 7日以内 |
| **LOW** | 認知・観察レベル | 30日以内 |

### フレームワーク参照

* **MITRE ATT&CK** — TTPマッピングの標準
* **NIST SP 800-61** — インシデント対応ライフサイクル
* **NIST SP 800-207** — ゼロトラスト・アーキテクチャ
* **STIX/TAXII** — 脅威インテリジェンス交換標準
* **Mandiant UNC/APT 命名** — 脅威アクターのクラスタリング

---

## 命名規則 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

例:
  CTI-2026-0520-EXCHANGE.md     -> 2026-05-20公開、Exchange事案（韓/英併記）
  CTI-2026-0507-SCARCRUFT_KR.md -> ScarCruft分析、韓国語
  CTI-2026-0507-SCARCRUFT_JP.md -> 同一事案の日本語版
```

* `SUBJECT` — レポート主題を表すキーワード（大文字）
* `LANG` — `KR`（韓国語）/ `EN`（英語）/ `JP`（日本語）/ `CN`·`ZH`（中国語）
* `ext` — `md`（基本）/ `pdf`（正式配布版）

---

## 連絡・貢献 (Contact & Contribution)

| チャネル | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — レポートへのフィードバック・訂正・情報提供 |
| **GitHub Issues** | [Issue作成](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC更新・参考資料追加の提案 |
| **情報源保護** | 機微な情報提供は Signal・ProtonMail などの安全なチャネルでご連絡ください。 |

---

## 免責事項 (Disclaimer)

1. 本リポジトリのすべてのレポートは、**公開されたOSINT資料と報道**に基づく独立した分析であり、関連する組織・機関・企業の公式見解を代弁するものではありません。
2. レポートの内容は**教育・防御・研究・政策立案の目的のみ**に使用されるべきであり、攻撃・侵害・違法行為への使用は厳格に禁止されます。
3. IoC・脆弱性情報は公開時点のものであり、運用前に必ず最新の状態を再確認してください。
4. 著者は、本資料の直接的・間接的な使用によって生じるいかなる損害についても責任を負いません。

---

## リポジトリ統計 (Repository Stats)

|  |  |
| --- | --- |
| **総レポート数** | 18+（シリーズ基準） |
| **対応言語** | 韓国語 · English · 日本語 · 中文 |
| **主要脅威アクター** | Lazarus · ScarCruft/APT37 · ShinyHunters · UNC6353 · Operation Zero · その他 |
| **中核研究トラック** | AI/LLM/MCPセキュリティ · サプライチェーン攻撃 · 北朝鮮・国家支援型脅威 · ゼロデイ・エコシステム |
| **最終更新** | 2026-05-20 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"今日の国家戦略資産は、明日のサイバー犯罪ツールになる。" — CTI-2026-0320*
