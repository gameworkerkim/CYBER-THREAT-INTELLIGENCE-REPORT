---
title: "北朝鮮、自国中央銀行を攻撃した「育成ハッカー」を逮捕か"
subtitle: "Daily NK：元軍事サイバー要員が中央銀行・貿易銀行に侵入し暗号資産で洗浄したとの報道 — 未検証の単一情報源と内部統制の亀裂シグナル"
description: "2026-07-12に平壌で国家保衛機関が自国中央銀行・貿易銀行ハッキング容疑の内部ハッカーを逮捕したとするDaily NK報道を整理。資金洗浄経路、発覚経緯、20億ドル見出しの誤解、検証限界を分離する。"
abstract: |
  Daily NK（平壌の匿名情報源）によれば、2026-07-12に北朝鮮当局は体制が育成した精鋭ハッカー集団を逮捕したとされる。
  彼らは中央銀行および貿易銀行の内部ネットワークに侵入し、海外の暗号資産ウォレット・中国ブローカー・新義州・恵山などの国境ルートで洗浄したという。
  発覚は外貨決済承認の不一致と不審な海外IPアクセスと説明され、「20億ドル」の見出しはChainalysisが集計した2025年の北朝鮮関連窃取総額との混同に注意が必要である。
  本報告は独立検証の欠如を明示しつつ、インターネット制限や国外向け攻撃の急減など副次シグナルと内部統制の含意を整理する。
summary_for_ai: |
  CTI brief (JA), id CTI-2026-0726-DPRK-BANK-HACKERS, date 2026-07-26, TLP:GREEN, severity MEDIUM.
  Source: Daily NK anonymous Pyongyang sources via CoinDesk/ForkLog/TokenPost. Alleged arrest 2026-07-12 of ex-military cyber personnel + Kim Chaek / PUST recruits for hacking DPRK Central Bank and Foreign Trade Bank; laundering via crypto/Chinese brokers/border cash.
  Caveat: not independently verified. “$2B” headlines often conflate Chainalysis 2025 aggregate with this incident (amount unknown).
date: 2026-07-26
author: "Dennis Kim"
lang: ja
tags:
  - DPRK
  - Lazarus
  - Insider-Threat
  - Cryptocurrency-Laundering
  - Central-Bank
  - Daily-NK
keywords:
  - 北朝鮮 ハッカー逮捕
  - 中央銀行ハッキング
  - 貿易銀行
  - 暗号資産洗浄
  - Daily NK
  - Chainalysis 20億ドル
  - 内部脅威
group: dprk
featured: true
featured_rank: 1
schema_type: TechArticle
tlp: GREEN
severity: MEDIUM
draft: false
robots: index,follow
---

| id             | CTI-2026-0726-DPRK-BANK-HACKERS                                                      |
| -------------- | ------------------------------------------------------------------------------------ |
| タイトル        | 北朝鮮、自国中央銀行を攻撃した「育成ハッカー」を逮捕か                                   |
| サブタイトル    | Daily NK単一情報源の逮捕報道 · 未検証 · 20億ドル見出しの注意                             |
| 著者            | Dennis Kim (HoKwang Kim)                                                             |
| メール          | <gameworker@gmail.com>                                                               |
| github         | gameworkerkim                                                                         |
| 日付            | 2026-07-26                                                                            |
| 分類            | TLP:GREEN                                                                             |
| 重大度          | MEDIUM                                                                                |
| 言語            | ja                                                                                    |
| タグ            | DPRK · Insider-Threat · Cryptocurrency-Laundering · Central-Bank                      |
| フレームワーク  | N/A（事案ブリーフ · OSINT）                                                            |

# 北朝鮮、自国中央銀行を攻撃した「育成ハッカー」を逮捕か

> **報告書ID** `CTI-2026-0726-DPRK-BANK-HACKERS` | **発行日** 2026-07-26 | **分類** `TLP:GREEN` | **重大度** MEDIUM  
> **著者** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)  
> **注意** 本報告は Daily NK の匿名情報源に基づく公開報道を再構成した OSINT ブリーフであり、**独立検証されていない**。

---

## はじめに

北朝鮮が暗号資産や韓日などを標的に、収益・混乱目的のハッキング作戦を展開してきたことは周知の事実である。その「矛」が主人を刺したという報道が出た。政権が育成した精鋭ハッカーが自国の中央銀行と貿易銀行をハッキングして資金を奪い、当局が逮捕したという内容だ。サイバー安保・制裁・内部統制の観点から経緯を整理する。

---

## 1. 事案概要 — 誰が、何を、どうしたか

**2026年7月12日**、平壌の潜伏先で国家保衛機関が緊急逮捕を行ったとされる。拘束対象は政権が育成した精鋭ハッカー集団と報じられた。

韓国メディア **Daily NK** が平壌の匿名情報源を引用したところによると、彼らは **朝鮮民主主義人民共和国中央銀行** と **貿易銀行** の内部ネットワークに侵入した。両機関はそれぞれ国家資金の発行・管理と、外貨・貿易決済を担う金融システムの中核である。

組織の中核は **軍事サイバー情報部隊出身の元軍人** とされ、**金策工業総合大学** と **平壌科学技術大学（PUST）** の優秀な IT 人材を取り込み拡大したという。軍事級のハッキング技術、Telegram などの暗号化メッセンジャー、中国製無線機器などの使用が報じられている。

### 資金洗浄経路 — 中国ブローカーと国境現金

奪取資金は海外の暗号資産ウォレットへ送金された後、**中国ブローカー** 経由でドル・人民元に現金化され、**新義州・恵山** などの国境都市の連絡員を通じて再び北朝鮮へ密輸されたという。少額分割送金、暗号化メッセンジャー、未登録携帯などの回避手法も言及される。

---

## 2. どう発覚したか — 「不一致」の痕跡

当局が **外貨決済承認過程の不一致** と **不審な海外IPアクセス記録** を捕捉したという説明である。外部ハッキング圧力を意識し、オンラインデータに加え手書き検証の監査を併用する文脈が示される。暗号化された暗号資産関連トラフィックを追跡して平壌の潜伏先を特定し、現場では数十万ドル相当の機材と偽名義携帯が押収されたとされる。

事件直後、両銀行に武装警備を配置し、平壌全域に無線傍受車両を投入するなどの非常態勢に入ったという後続記述がある。

---

## 3. 文脈 — 「20億ドル」の誤解と内部崩壊のシグナル

一部見出しの **「20億ドル窃取ハッカー」** 表現は、本件単一事件の被害額ではない。**Chainalysis** によると **2025年の北朝鮮関連ハッカーによる世界の暗号資産窃取総額は約20億ドル** であり、**TRM Labs** は2026年4月時点で北朝鮮関連行為者が世界の暗号資産ハッキング・詐欺被害の約 **76%** を占めると推定した。**本件の奪取規模は未確認**である。

それでも含意は大きい。Kimsuky・Lazarus など海外標的（Ronin 約6.2億ドル、Harmony 約1億ドルなど）に集中してきたパターンと異なり、**政権が訓練した要員が自国金庫を襲った** という叙述は内部統制の亀裂を示唆する。

Daily NK 引用情報源：

> *「彼らは国家を守るために技術を学んだが、国庫を略奪した。」*

厳しい量刑が予想される理由である。

---

## 4. 限界と示唆 — 未検証の単報、それでも意味ある信号

本報道は Daily NK の匿名情報源に依存し、**独立検証されていない**。情報統制下の内部確認は常に困難だ。ただし7月12日頃から約1週間、北朝鮮のインターネット利用が部分的に遮断され、北朝鮮発ハッキング試行が急減したという観測が併記されれば、副次シグナルとして見る余地はある。

世界で最も活動的な国家ハッキング勢力の「アキレス腱」が内部にある可能性を問う。矛が主人を向け始めたなら、体制内部の亀裂を測るバロメーターとなる。

---

## 参考資料

| 媒体 | タイトル | リンク |
|---|---|---|
| CoinDesk (EN) | North Korea arrests hackers accused of laundering stolen bank funds through crypto | https://www.coindesk.com/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| CoinDesk (KO) | 북한, 암호화폐를 통해 국가 은행에서 탈취한 자금 세탁 혐의로 해커 체포 | https://www.coindesk.com/ko/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| ForkLog | North Korean IT Specialists Arrested for Laundering State Funds via Cryptocurrency | https://forklog.com/en/north-korean-it-specialists-arrested-for-laundering-state-funds-via-cryptocurrency/ |
| CoinMarketCap | North Korea arrests ex-military hackers for $2 billion crypto theft | https://coinmarketcap.com/community/articles/6a64ea695999a46d92c159fc/ |
| CoinCentral | North Korea Arrests Hackers Who Stole From State Banks and Laundered Funds Through Crypto | https://coincentral.com/north-korea-arrests-hackers-who-stole-from-state-banks-and-laundered-funds-through-crypto/ |
| TokenPost (KO) | 북한, 중앙은행·무역은행 해킹 조직 적발…암호화폐로 자금세탁 | https://www.tokenpost.kr/article/195050 |
