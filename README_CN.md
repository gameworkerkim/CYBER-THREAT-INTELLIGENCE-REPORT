# Cyber Threat Intelligence Report

> **独立网络威胁情报报告归档库**
> *Independent Cyber Threat Intelligence Archive · 基于OSINT的防御研究*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--20-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

**语言 (Language):** [한국어](README.md) · [English](README_EN.md) · [日本語](README_JP.md) · **中文**

本仓库是一个独立归档库，收集并发布用于防御、研究和政策制定目的的**开源网络威胁情报（CTI）报告**。所有报告均基于OSINT撰写，不代表任何特定组织、机构或国家的官方立场。

---

## 关于分析师 (About the Analyst)

|  |  |
| --- | --- |
| **姓名 (Name)** | Dennis Kim (金昊光 / 김호광) |
| **职务 (Role)** | Betalabs Inc. CEO · 前 Cyworld Z CEO · 独立威胁情报分析师 · Microsoft Azure MVP |
| **专业领域** | Web3·区块链安全、供应链攻击、零日生态、朝鲜·国家背景威胁、AI/LLM安全、MCP安全 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 最新报告 — 重点推荐 (Featured)

> **2026-05-20 发布 — 单周四起同步预警**

5月第三周，针对几乎同时披露并遭利用的4个高危漏洞进行了紧急分析。所有报告均以韩英双语发布。

| 报告 | 要点 | 严重性 | 下载 |
| --- | --- | --- | --- |
| **Drupal核心最高危漏洞** (`CTI-2026-0520-DRUPAL`) | 无需认证的远程利用，"披露即攻击开始"型 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| **Exchange OWA 零日** (`CTI-2026-0520-EXCHANGE`) | CVE-2026-42897，正在被利用，无永久补丁 | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| **EvilTokens PhaaS** (`CTI-2026-0520-EVILTOKENS`) | AI生成的设备码钓鱼，绕过MFA | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| **cPanel 认证绕过** (`CTI-2026-0520-CPANEL`) | CVE-2026-41940，CVSS 9.8，大规模利用 | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |

---

## 报告索引 — 全部报告列表 (Report Index)

| ID | 发布日 | 标题 | 严重性 | 语言 |
| --- | --- | --- | --- | --- |
| `CTI-2026-0520-DRUPAL` | 2026-05-20 | Drupal核心最高危漏洞紧急预警 — 无需认证远程，补丁临近 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| `CTI-2026-0520-EXCHANGE` | 2026-05-20 | Microsoft Exchange OWA 零日 (CVE-2026-42897) | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| `CTI-2026-0520-EVILTOKENS` | 2026-05-20 | EvilTokens — AI生成的设备码钓鱼 PhaaS | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| `CTI-2026-0520-CPANEL` | 2026-05-20 | cPanel & WHM 认证绕过 (CVE-2026-41940) | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |
| `CTI-2026-0520-FAST16` | 2026-05-20 | Fast16 — 早于Stuxnet的精密计算篡改破坏型恶意软件 | HIGH | [EN](CTI-2026-0520-FAST16%20EN.md) · [KR](CTI-2026-0520-FAST16%20KR.md) · [JP](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| `CTI-2026-0517-AICYBER` | 2026-05-17 | AI网络攻击与智能体防御 — 朝鲜利用LLM的黑客活动 | HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) |
| `CTI-2026-0514-CHATGPT-DNS` | 2026-05-14 | ChatGPT DNS 侧信道分析 | MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| `CTI-2026-0514-RUSSIAN-RAT` | 2026-05-14 | 俄罗斯RAT / LNK·RDP 攻击链分析 | MEDIUM | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | 2026-05-10 | 朝鲜 Lazarus — .git/hooks 恶意软件行动 | HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| `CTI-2026-0510-MYTHOS` | 2026-05-10 | Mythos AI 漏洞分析 | MEDIUM | [MD](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| `CTI-2026-0507-SCARCRUFT` | 2026-05-07 | ScarCruft (APT37) 行动分析 | HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| `CTI-2026-0505-VIBE` | 2026-05-05 | Vibe — 人工智能黑客时代 | MEDIUM | [MD](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE.md) · [PDF](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE_%EA%B9%80%ED%98%B8%EA%B4%91.pdf) |
| `CTI-2026-0503-GITHUB` | 2026-05-03 | GitHub RCE 漏洞（单次 git push 实现 RCE） | HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| `CTI-2026-0430-COPYFAIL` | 2026-04-30 | Copy Fail — Linux内核提权 (CVE-2026-31431) | HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| `CTI-2026-0427-LITECOIN` | 2026-04-27 | 莱特币漏洞分析 | MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| `CTI-2026-0422-MCP` | 2026-04-22 | 针对MCP的高级与潜伏型攻击 — 是否为结构性问题？ | HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PRESS KR](CTI-2026-0422-MCP-PRESS_KR.md) · [PRESS EN](CTI-2026-0422-MCP-PRESS_EN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| `CTI-2026-0420-VERCEL` | 2026-04-20 | Vercel 安全入侵 — AI SaaS 供应链攻击与 ShinyHunters | HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| `CTI-2026-0320-CORUNA` | 2026-03-20 | 网络武器供应链的崩溃 — Coruna iOS Exploit Kit | CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

> 新报告在发布时添加至本表**最上方**。命名规则为 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`。

---

## 按类别分类 (By Category)

### 供应链攻击 (Supply Chain Attacks)

攻击者并不直接攻击最终目标，而是先入侵"受信任的第三方供应商"以获得间接访问。2025–2026年增长最快的类别。

* `CTI-2026-0520-CPANEL` — 通过 cPanel/WHM 认证绕过大规模接管托管基础设施
* `CTI-2026-0503-GITHUB` — 单次 git push 实现 GitHub Enterprise RCE
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters（AI SaaS OAuth 供应链入侵）
* `CTI-2026-0510-LAZARUS-GITHOOKS` — 滥用 .git/hooks 渗透开发者环境

### AI·LLM·MCP 安全

以生成式AI与智能体基础设施为目标或工具的新型威胁。本归档库的核心研究方向。

* `CTI-2026-0520-EVILTOKENS` — AI生成（"vibe coding"）的设备码钓鱼 PhaaS
* `CTI-2026-0517-AICYBER` — 朝鲜利用LLM的黑客活动与智能体防御
* `CTI-2026-0514-CHATGPT-DNS` — ChatGPT DNS 侧信道
* `CTI-2026-0510-MYTHOS` — Mythos AI 漏洞
* `CTI-2026-0505-VIBE` — Vibe，人工智能黑客时代
* `CTI-2026-0422-MCP` — 针对MCP的高级与潜伏型攻击

### 移动·零日威胁 (Mobile & Zero-Day)

针对 iOS·Android 等平台的国家级监控工具及商业化漏洞利用套件分析。

* `CTI-2026-0520-DRUPAL` — Drupal核心无需认证远程（披露即攻击开始）
* `CTI-2026-0520-EXCHANGE` — Exchange OWA 零日 (CVE-2026-42897)
* `CTI-2026-0430-COPYFAIL` — Linux内核提权 (CVE-2026-31431)
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit (CVE-2024-23222)

### 威胁行为体画像 (Threat Actor Profiles)

特定APT组织·网络犯罪团伙的TTP·行动·归因信息。

* **Lazarus Group**（朝鲜）— `CTI-2026-0510-LAZARUS-GITHOOKS`
* **ScarCruft / APT37**（朝鲜）— `CTI-2026-0507-SCARCRUFT`
* **朝鲜利用LLM的威胁** — `CTI-2026-0517-AICYBER`
* **ShinyHunters**（UNC6040/UNC6240/UNC6661）— `CTI-2026-0420-VERCEL`
* **UNC6353 · Operation Zero** — `CTI-2026-0320-CORUNA`

### 国家背景破坏行动 (Nation-State Sabotage)

对物理世界造成影响的破坏·扰乱型网络武器。

* `CTI-2026-0520-FAST16` — 比Stuxnet早五年的精密计算篡改恶意软件

### Web3·加密货币生态 (Web3 & Crypto)

涉及 DeFi·CEX·稳定币的入侵事件，并从韩国（DAXA·KoFIU）合规角度分析。

* `CTI-2026-0427-LITECOIN` — 莱特币漏洞
* `CTI-2026-0420-VERCEL` §8 — Vercel入侵对Web3前端基础设施的影响

---

## 分析方法论 (Methodology)

### Traffic Light Protocol (TLP) 分类

| 标签 | 含义 | 本仓库标准 |
| --- | --- | --- |
| **TLP:GREEN** | 可在社区内共享，可对外公开 | **公开报告默认值** |
| **TLP:AMBER** | 仅限组织内部共享 | 部分预警报告 |
| **TLP:RED** | 仅限指定接收者 | 部分正在被利用的报告 |

### 严重性等级 (Severity)

| 等级 | 含义 | 响应时间 |
| --- | --- | --- |
| **CRITICAL** | 直接威胁国家安全·大规模民间损失 | 立即 |
| **HIGH** | 对行业·生态系统造成广泛影响 | 24–72小时 |
| **MEDIUM** | 对特定企业·组织群造成有限影响 | 7天内 |
| **LOW** | 认知·观察级别 | 30天内 |

### 框架参考

* **MITRE ATT&CK** — TTP映射标准
* **NIST SP 800-61** — 事件响应生命周期
* **NIST SP 800-207** — 零信任架构
* **STIX/TAXII** — 威胁情报交换标准
* **Mandiant UNC/APT 命名** — 威胁行为体聚类

---

## 命名规则 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

示例:
  CTI-2026-0520-EXCHANGE.md     -> 2026-05-20发布，Exchange事件（韩/英双语）
  CTI-2026-0507-SCARCRUFT_KR.md -> ScarCruft分析，韩语
  CTI-2026-0507-SCARCRUFT_JP.md -> 同一事件的日语版
```

* `SUBJECT` — 代表报告主题的关键词（大写）
* `LANG` — `KR`（韩语）/ `EN`（英语）/ `JP`（日语）/ `CN`·`ZH`（中文）
* `ext` — `md`（基础）/ `pdf`（正式发布版）

---

## 联系与贡献 (Contact & Contribution)

| 渠道 | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 报告反馈·更正·线索提供 |
| **GitHub Issues** | [创建Issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC更新·补充参考资料建议 |
| **线索保护** | 敏感线索请通过 Signal·ProtonMail 等安全渠道联系。 |

---

## 免责声明 (Disclaimer)

1. 本仓库所有报告均为基于**公开OSINT资料与新闻报道**的独立分析，不代表任何相关组织·机构·企业的官方立场。
2. 报告内容**仅可用于教育·防御·研究·政策制定目的**，严禁用于攻击·入侵·非法活动。
3. IoC·漏洞信息以发布时点为准，实际使用前务必重新核实最新状态。
4. 作者对因直接或间接使用本资料而产生的任何损害不承担责任。

---

## 仓库统计 (Repository Stats)

|  |  |
| --- | --- |
| **报告总数** | 18+（按系列计） |
| **覆盖语言** | 韩语 · English · 日本語 · 中文 |
| **主要威胁行为体** | Lazarus · ScarCruft/APT37 · ShinyHunters · UNC6353 · Operation Zero · 等 |
| **核心研究方向** | AI/LLM/MCP安全 · 供应链攻击 · 朝鲜·国家背景威胁 · 零日生态 |
| **最近更新** | 2026-05-20 |

---

**© 2026 Dennis Kim (金昊光)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"今天的国家战略资产，将成为明天的网络犯罪工具。" — CTI-2026-0320*
