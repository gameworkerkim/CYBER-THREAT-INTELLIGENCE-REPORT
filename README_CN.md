# 🛡️ Cyber Threat Intelligence Report

> **独立网络威胁情报报告存档**
> *Independent Cyber Threat Intelligence Archive · 基于OSINT的防御性研究*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)
![Last Update](https://img.shields.io/badge/Last%20Update-2026--05--30-informational?style=flat-square)

🌐 **语言 (Languages):** [한국어](README.md) · [English](README_EN.md) · **中文** · [日本語](README_JP.md)

本仓库是一个收集与发布**公开网络威胁情报（Open CTI）报告**的独立存档，用于防御、研究与政策制定目的。所有报告均基于OSINT撰写，不代表任何组织、机构或国家的官方立场。

---

## 📇 关于分析者 (About the Analyst)

|  |  |
| --- | --- |
| **姓名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **角色 (Role)** | CEO, Betalabs Inc. · 独立威胁情报分析师 |
| **专长领域** | Web3/区块链安全、供应链攻击、零日生态、朝鲜/国家背景威胁、AI/LLM安全 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新报告 — 精选 (Latest Reports — Featured)

> 🆕 **2026-05-30 发布** — 韩国媒体未报道的4项威胁，以四种语言（KR·EN·JP·CN）同步公开

### 1. AI智能体掌握方向盘 — 首例被观测到的LLM主导型入侵

*从Marimo CVE-2026-39987预认证RCE到内部数据库窃取：一小时内完成的四阶段自主横移*

Sysdig TRT记录在案的**首例“AI智能体主导型”入侵**。以暴露的Marimo笔记本预认证RCE为起点，一个LLM智能体自主执行了整条链路——窃取云凭证 → 从AWS Secrets Manager获取SSH密钥 → 经SSH堡垒机横移 → 完整导出内部PostgreSQL。

| 项目 | 值 |
| --- | --- |
| **报告ID** | `CTI-2026-0530-MARIMO` |
| **严重度** | 🔴 CRITICAL |
| **CVE** | `CVE-2026-39987`（CVSS 9.3 · CISA KEV） |
| **下载** | [🇰🇷 KR](CTI-2026-0530-MARIMO_KR.md) · [🇬🇧 EN](CTI-2026-0530-MARIMO_EN.md) · [🇯🇵 JP](CTI-2026-0530-MARIMO_JP.md) · [🇨🇳 CN](CTI-2026-0530-MARIMO_CN.md) |

### 2. 未修补的Critical RCE — Gogs git rebase 参数注入漏洞

*一个让任意已认证用户掌控自托管Git服务器的9.4分缺陷，以及跨租户入侵*

恶意分支名将`--exec`标志注入`git rebase`，在服务器上执行任意代码。自向维护者报告（2026-03-17）以来仍**未修补**，且已存在公开的Metasploit模块。

| 项目 | 值 |
| --- | --- |
| **报告ID** | `CTI-2026-0530-GOGS` |
| **严重度** | 🔴 HIGH |
| **CVE** | 未分配（Rapid7评定 CVSS 9.4） |
| **下载** | [🇰🇷 KR](CTI-2026-0530-GOGS_KR.md) · [🇬🇧 EN](CTI-2026-0530-GOGS_EN.md) · [🇯🇵 JP](CTI-2026-0530-GOGS_JP.md) · [🇨🇳 CN](CTI-2026-0530-GOGS_CN.md) |

### 3. JINX-0164 — 瞄准加密企业的macOS恶意软件与供应链威胁行为者

*LinkedIn社会工程、AUDIOFIX与MINIRAT，以及@velora-dex/sdk npm供应链投毒*

一个借LinkedIn招聘诱饵攻陷开发者端点、继而移动至CI/CD与代码分发基础设施的经济动机集群。与朝鲜集群TTP相似，但无基础设施重叠（Wiz）。

| 项目 | 值 |
| --- | --- |
| **报告ID** | `CTI-2026-0530-JINX` |
| **严重度** | 🔴 HIGH |
| **威胁行为者** | JINX-0164（与朝鲜TTP相似，无基础设施重叠） |
| **下载** | [🇰🇷 KR](CTI-2026-0530-JINX_KR.md) · [🇬🇧 EN](CTI-2026-0530-JINX_EN.md) · [🇯🇵 JP](CTI-2026-0530-JINX_JP.md) · [🇨🇳 CN](CTI-2026-0530-JINX_CN.md) |

### 4. ChatGPhish — 把AI摘要变成钓鱼界面的ChatGPT渲染器信任缺陷

*对Markdown链接与图片的隐式信任、间接提示注入，以及二维码跳板*

`chatgpt.com`渲染器信任所摘要第三方页面中的Markdown链接/图片，自动加载并以可点击元素呈现。可实现钓鱼、伪造系统警告、二维码跳板以及IP/UA/Referer泄露（Permiso Security）。

| 项目 | 值 |
| --- | --- |
| **报告ID** | `CTI-2026-0530-CHATGPHISH` |
| **严重度** | 🟠 MEDIUM |
| **CVE** | 未分配（Bugcrowd报告，厂商回复“无法复现”） |
| **下载** | [🇰🇷 KR](CTI-2026-0530-CHATGPHISH_KR.md) · [🇬🇧 EN](CTI-2026-0530-CHATGPHISH_EN.md) · [🇯🇵 JP](CTI-2026-0530-CHATGPHISH_JP.md) · [🇨🇳 CN](CTI-2026-0530-CHATGPHISH_CN.md) |

### 5. KelpDAO LayerZero 桥接攻击 — 链下验证基础设施的单点故障

*跨链桥安全的结构性弱点与链下验证者（off-chain verifier）集中化风险*

对一起LayerZero桥接路径入侵事件的分析，剖析**链下验证基础设施的单点故障**（而非链上合约）如何直接导致资产被窃。

| 项目 | 值 |
| --- | --- |
| **报告ID** | `CTI-2026-0528-KELPDAO` |
| **严重度** | 🔴 HIGH |
| **分类** | Web3 / 跨链桥安全 |
| **下载** | [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇯🇵 JP](CTI-2026-0528-KELPDAO_JA.md) · [🇨🇳 CN](CTI-2026-0528-KELPDAO_ZH.md) |

---

## 📚 报告索引 — 完整列表 (Report Index)

> 💡 新报告在发布时添加到本表**最上方**。命名规则：`CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`。

| ID | 发布日期 | 标题 | 严重度 | 语言 |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_CN.md) | 2026-05-30 | AI智能体主导型入侵 — Marimo CVE-2026-39987 + LLM自主横移 | 🔴 CRITICAL | KR·EN·JP·CN |
| [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_CN.md) | 2026-05-30 | 未修补的Gogs git rebase参数注入RCE（CVSS 9.4） | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_CN.md) | 2026-05-30 | JINX-0164 — 瞄准加密的macOS恶意软件与供应链威胁 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_CN.md) | 2026-05-30 | ChatGPhish — ChatGPT渲染器信任缺陷（间接提示注入） | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_ZH.md) | 2026-05-28 | KelpDAO LayerZero桥接攻击 — 链下验证基础设施的单点故障 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md) | 2026-05-27 | GlassWorm — 自我传播的VS Code/OpenVSX供应链蠕虫 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_ZH.md) | 2026-05-27 | Gitea漏洞分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_ZH.md) | 2026-05-27 | AI挖矿劫持活动分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) | 2026-05-26 | Kimsuky（APT43）的PebbleDash·AppleSeed新分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) | 2026-05-26 | 英国对俄加密资产制裁动向 | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_CN.md) | 2026-05-24 | 同时发生的双重威胁（Two Concurrent Threats）分析 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) | 2026-05-22 | EDR绕过威胁分析（EDR3） | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) | 2026-05-21 | YellowKey — Windows BitLocker绕过零日 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) | 2026-05-21 | 2026朝鲜黑客趋势 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub内部仓库入侵分析 | 🔴 HIGH | KR |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20ZH.md) | 2026-05-20 | FAST16分析报告 | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Exchange Server安全漏洞 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI生成的设备码钓鱼PhaaS | 🔴 HIGH | KR |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupal核心最高危零日（无补丁） | 🔴 CRITICAL | KR |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel入侵分析 | 🔴 HIGH | KR |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) | 2026-05-17 | 朝鲜利用LLM的黑客行动 — 智能体防御 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNS侧信道 | 🟠 MEDIUM | KR |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | 俄罗斯RAT（LNK/RDP） | 🔴 HIGH | KR |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | 2026-05-10 | 朝鲜Lazarus滥用git hooks | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Mythos AI漏洞分析 | 🔴 HIGH | EN |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) | 2026-05-07 | ScarCruft（APT37）分析 | 🔴 HIGH | KR·EN·JP |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | Vibe — 人工智能黑客时代 | 🟠 MEDIUM | KR |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub威胁分析 | 🔴 HIGH | KR |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | CVE-2026-31431 'Copy Fail'漏洞 | 🔴 HIGH | KR |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | 莱特币漏洞分析 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20cn.MD) | 2026-04-22 | 瞄准MCP的智能型·潜伏型攻击 — 是否为结构性问题 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel安全入侵 — AI SaaS供应链与ShinyHunters | 🔴 HIGH | KR·EN |
| [`CTI-2026-0320-CORUNA`](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) | 2026-03-20 | 网络武器供应链的崩塌 — Coruna iOS Exploit Kit | 🔴 CRITICAL | KR·EN·CN |

> ℹ️ 部分较早条目的标题/严重度系根据存档文件名与提交信息整理，建议以报告正文为准核实。

---

## 🗂️ 按主题分类 (By Category)

### 🤖 AI/LLM安全

* `CTI-2026-0530-MARIMO` — LLM智能体主导的自主入侵（首次观测）
* `CTI-2026-0530-CHATGPHISH` — ChatGPT渲染器信任缺陷/间接提示注入
* `CTI-2026-0527-AICRYPTOJACK` — AI挖矿劫持
* `CTI-2026-0517-AICYBER` — 朝鲜利用LLM的黑客行动/智能体防御
* `CTI-2026-0422-MCP` — 针对MCP的智能型·潜伏型攻击

### 🌐 供应链攻击

* `CTI-2026-0530-JINX` — JINX-0164 macOS / npm（@velora-dex/sdk）
* `CTI-2026-0530-GOGS` · `CTI-2026-0527-GITEA` — 自托管Git服务器RCE
* `CTI-2026-0527-GLASSWORM` — 自我传播的VS Code/OpenVSX蠕虫
* `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` — GitHub仓库入侵
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters

### 🕵️ 威胁行为者画像

* `CTI-2026-0530-JINX` — JINX-0164（经济动机，与朝鲜TTP相似）
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` — Kimsuky（APT43）
* `CTI-2026-0510-LAZARUS-GITHOOKS` — Lazarus
* `CTI-2026-0507-SCARCRUFT` — ScarCruft（APT37）
* `CTI-2026-0521-DPRK-TRENDS` — 朝鲜黑客趋势

### 💰 Web3与加密生态

* `CTI-2026-0528-KELPDAO` — KelpDAO LayerZero桥接攻击
* `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` — 加密资产制裁动向
* `CTI-2026-0427-LITECOIN` — 莱特币漏洞

### 🪟 端点·操作系统·零日

* `CTI-2026-0521-YELLOWKEY` — Windows BitLocker绕过零日
* `CTI-2026-0520-DRUPAL` — Drupal核心零日
* `CTI-2026-0520-EXCHANGE` — Exchange Server漏洞
* `CTI-2026-0522-EDR3` — EDR绕过
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit

---

## 🧭 方法论 (Methodology)

### Traffic Light Protocol (TLP)

| 标签 | 含义 | 本仓库 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 可社区共享、可公开 | **默认** |
| 🟡 TLP:AMBER | 仅限组织内部共享 | 不适用 |
| 🔴 TLP:RED | 仅限指定接收者 | 不适用 |

### 严重度 (Severity)

| 等级 | 含义 | 响应时间 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 直接关乎国家安全/大规模民用损害 | 立即 |
| 🔴 **HIGH** | 行业/生态广泛影响 | 24–72小时 |
| 🟠 **MEDIUM** | 仅限特定企业/组织 | 7日内 |
| 🟡 **LOW** | 认知/观察级 | 30日内 |

### 框架参考

* **MITRE ATT&CK** / **MITRE ATLAS** — TTP与AI威胁映射
* **NIST SP 800-61** — 事件响应生命周期
* **NIST SP 800-207** — 零信任架构
* **NIST AI RMF** / **OWASP LLM Top 10** — AI/LLM风险管理
* **STIX/TAXII** — 威胁情报交换
* **Mandiant/Wiz UNC与集群命名** — 威胁行为者归类

---

## 📝 命名规则 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

示例:
  CTI-2026-0530-MARIMO_KR.md   → 2026年5月30日发布，Marimo事件，韩语Markdown
  CTI-2026-0530-MARIMO_EN.md   → 同一事件的英文版
  CTI-2026-0528-KELPDAO_ZH.md  → KelpDAO事件，中文版
```

* `SUBJECT` — 代表主题的关键词（大写）
* `LANG` — `KR/KO`（韩语）/ `EN`（英语）/ `JP/JA`（日语）/ `CN/ZH`（中文）
* `ext` — `md`（默认）/ `pdf`（正式分发版）

---

## 🤝 联系与贡献 (Contact & Contribution)

| 渠道 | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 报告反馈·更正·线索 |
| **GitHub Issues** | [创建issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC更新·参考资料建议 |
| **线索保护** | 敏感线索请通过Signal·ProtonMail等安全渠道联系。 |

---

## ⚖️ 免责声明 (Disclaimer)

1. 本仓库所有报告均为基于**公开OSINT资料与媒体报道**的独立分析，不代表任何相关组织、机构或企业的官方立场。
2. 内容仅供**教育、防御、研究与政策制定目的**使用，严禁用于攻击、入侵或非法活动。
3. IoC与漏洞信息以发布时为准，实际使用前务必重新核实最新状态。
4. 作者对因直接或间接使用本资料而产生的任何损害概不负责。

---

## 📊 仓库统计 (Repository Stats)

|  |  |
| --- | --- |
| **报告总数** | 33+ |
| **覆盖语言** | 한국어 · English · 日本語 · 中文 |
| **观测到的威胁行为者** | JINX-0164 · Lazarus · Kimsuky（APT43）· ScarCruft（APT37）· ShinyHunters · UNC6353 等 |
| **最近更新** | 2026-05-30 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*“今日的国家战略资产，会成为明日的网络犯罪工具。” — CTI-2026-0320*
