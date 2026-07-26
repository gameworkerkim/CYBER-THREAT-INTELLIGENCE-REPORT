---
title: "朝鲜逮捕“自家培养黑客”：涉嫌侵入本国央行并经加密货币洗钱"
subtitle: "Daily NK：前军事网络人员据称入侵中央银行与贸易银行后经加密货币洗钱——未经验证的单源报道与内部管控裂痕信号"
description: "整理 Daily NK 关于 2026-07-12 平壤逮捕涉嫌入侵中央银行、贸易银行的内部黑客报道。区分洗钱路径、发现线索、20亿美元标题误解与验证局限。"
abstract: |
  据 Daily NK（平壤匿名消息源）报道，2026-07-12 朝鲜当局逮捕了一批由政权培养的精锐黑客，指控其侵入中央银行与贸易银行内网，并经由海外加密货币钱包、中国经纪人和新义州、惠山等边境通道洗钱。
  发现线索被描述为外汇结算审批不一致与可疑境外 IP 访问；“20亿美元”标题常与 Chainalysis 统计的 2025 年朝鲜相关窃取总额混淆，本案金额仍未知。
  本简报明确独立验证缺失，并整理互联网部分中断、出境攻击骤减等次级信号及内部管控含义。
summary_for_ai: |
  CTI brief (ZH), id CTI-2026-0726-DPRK-BANK-HACKERS, date 2026-07-26, TLP:GREEN, severity MEDIUM.
  Source: Daily NK anonymous Pyongyang sources via CoinDesk/ForkLog/TokenPost. Alleged arrest 2026-07-12 of ex-military cyber personnel + Kim Chaek / PUST recruits for hacking DPRK Central Bank and Foreign Trade Bank; laundering via crypto/Chinese brokers/border cash.
  Caveat: not independently verified. “$2B” headlines often conflate Chainalysis 2025 aggregate with this incident (amount unknown).
date: 2026-07-26
author: "Dennis Kim"
lang: zh
tags:
  - DPRK
  - Lazarus
  - Insider-Threat
  - Cryptocurrency-Laundering
  - Central-Bank
  - Daily-NK
keywords:
  - 朝鲜黑客逮捕
  - 中央银行黑客攻击
  - 贸易银行
  - 加密货币洗钱
  - Daily NK
  - Chainalysis 20亿美元
  - 内部威胁
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
| 标题            | 朝鲜逮捕“自家培养黑客”：涉嫌侵入本国央行并经加密货币洗钱                                 |
| 副标题          | Daily NK 单源逮捕叙事 · 未验证 · 20亿美元标题警示                                      |
| 作者            | Dennis Kim (HoKwang Kim)                                                             |
| 邮箱            | <gameworker@gmail.com>                                                               |
| github         | gameworkerkim                                                                         |
| 日期            | 2026-07-26                                                                            |
| 分类            | TLP:GREEN                                                                             |
| 严重性          | MEDIUM                                                                                |
| 语言            | zh                                                                                    |
| 标签            | DPRK · Insider-Threat · Cryptocurrency-Laundering · Central-Bank                      |
| 框架            | N/A（事件简报 · OSINT）                                                                |

# 朝鲜逮捕“自家培养黑客”：涉嫌侵入本国央行并经加密货币洗钱

> **报告 ID** `CTI-2026-0726-DPRK-BANK-HACKERS` | **发布日** 2026-07-26 | **分类** `TLP:GREEN` | **严重性** MEDIUM  
> **作者** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)  
> **注意** 本报告基于 Daily NK 匿名消息源的公开报道重构，属 OSINT 简报，**未经独立验证**。

---

## 引言

朝鲜针对加密资产、韩国与日本等目标开展以牟利与制造混乱为目的的黑客行动，已是公开事实。如今有报道称，同一把“矛”刺向了主人：政权培养的精锐黑客据称入侵本国中央银行与贸易银行盗取资金，并被当局逮捕。本文从网络安全、制裁与内部管控视角整理始末。

---

## 1. 事件概要 — 谁、做了什么、如何实施？

据称 **2026年7月12日**，平壤某处藏匿点发生国家保卫机关紧急逮捕行动。被捕者被描述为政权培养的精锐黑客团伙。

韩国媒体 **Daily NK** 援引平壤匿名消息源称，他们侵入了 **朝鲜民主主义人民共和国中央银行** 与 **贸易银行** 的内部网络。两机构分别负责国家资金发行管理，以及对外汇兑与贸易结算，是金融系统核心。

组织核心被描述为 **军事网络情报部队出身的前军人**，并吸纳 **金策工业综合大学**、**平壤科学技术大学（PUST）** 的优秀 IT 人才扩张。报道提及军事级黑客技术、Telegram 等加密即时通讯，以及中国产无线设备等。

### 洗钱路径 — 中国经纪人与边境现金

盗取资金据称先转入海外加密货币钱包，经 **中国经纪人** 兑成美元/人民币现金，再通过 **新义州、惠山** 等边境城市联络人运回朝鲜。小额拆分汇款、加密即时通讯、未登记手机等规避手法亦被提及。

---

## 2. 如何败露？ — “不一致”的痕迹

当局据称发现 **外汇结算审批过程中的不一致** 与 **可疑境外 IP 访问记录**。叙述将其置于双重审计语境——在线数据之外还有手工/纸面核验，因长期面临外部黑客压力。通过对加密货币相关加密流量的追踪定位平壤藏匿点；现场据称查获价值数十万美元的设备与假身份登记手机。

事后两银行据称部署武装警戒，平壤全市投入无线侦听车辆，进入高度戒备。

---

## 3. 语境 — “20亿美元”误解与内部崩解信号

部分标题中的 **“20亿美元窃取黑客”** 并非本案单一损失额。按 **Chainalysis**，**2025年朝鲜相关黑客在全球窃取的加密资产总额约20亿美元**；**TRM Labs** 估计截至2026年4月，相关行为者约占全球加密货币黑客/欺诈损失的 **76%**。**本案盗取金额仍未确认**。

即便如此，含义重大。不同于 Kimsuky、Lazarus 等海外目标模式（如 Ronin 约6.2亿美元、Harmony 约1亿美元），若属实，则是 **政权训练的精英洗劫本国金库**，指向内部管控裂痕。

Daily NK 援引消息源：

> *“他们为保卫国家学会技术，却劫掠了国库。”*

外界预期严厉量刑，原因正在于此。

---

## 4. 局限与启示 — 未验证单源，仍具信号意义

本报道依赖 Daily NK 匿名消息源，**未经独立验证**。在信息管控下核实内部消息始终困难。不过，若同时出现约自7月12日起一周左右的互联网部分中断、以及朝鲜出境黑客尝试骤减等观察，可作为 **次级信号** 参考，而非确证。

它提出一个问题：全球最活跃的国家黑客力量，其“阿喀琉斯之踵”是否在内部控制体系内部。若矛已指向主人，这将成为衡量体制内部裂痕的重要标尺。

---

## 参考资料

| 媒体 | 标题 | 链接 |
|---|---|---|
| CoinDesk (EN) | North Korea arrests hackers accused of laundering stolen bank funds through crypto | https://www.coindesk.com/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| CoinDesk (KO) | 북한, 암호화폐를 통해 국가 은행에서 탈취한 자금 세탁 혐의로 해커 체포 | https://www.coindesk.com/ko/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| ForkLog | North Korean IT Specialists Arrested for Laundering State Funds via Cryptocurrency | https://forklog.com/en/north-korean-it-specialists-arrested-for-laundering-state-funds-via-cryptocurrency/ |
| CoinMarketCap | North Korea arrests ex-military hackers for $2 billion crypto theft | https://coinmarketcap.com/community/articles/6a64ea695999a46d92c159fc/ |
| CoinCentral | North Korea Arrests Hackers Who Stole From State Banks and Laundered Funds Through Crypto | https://coincentral.com/north-korea-arrests-hackers-who-stole-from-state-banks-and-laundered-funds-through-crypto/ |
| TokenPost (KO) | 북한, 중앙은행·무역은행 해킹 조직 적발…암호화폐로 자금세탁 | https://www.tokenpost.kr/article/195050 |
