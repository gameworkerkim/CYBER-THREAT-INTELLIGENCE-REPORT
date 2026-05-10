# 🛡️ 网络威胁情报报告 (Cyber Threat Intelligence Report)

> **🌐 Languages | 语言选择:**
> [🇰🇷 한국어](./README.md) · [🇬🇧 English](./README_EN.md) · **🇨🇳 中文(簡體)** · [🇯🇵 日本語](./README_JP.md)

> **独立网络威胁情报报告档案库**
> *Independent Cyber Threat Intelligence Archive · 基于OSINT的防御性研究 · 多语种发布*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20CN%20%7C%20JP-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--10-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/commits/main)
[![Reports](https://img.shields.io/badge/Reports-8-orange?style=flat-square)](#-报告索引)

---

本仓库是面向**防御、研究和政策制定**的**独立公开网络威胁情报(Open CTI)报告档案**。所有报告均基于OSINT(公开来源情报)撰写,不代表任何特定组织、机构或国家的官方立场。核心关注领域:**Web3/区块链安全、AI/MCP安全、供应链攻击、朝鲜及国家背景威胁、韩国网络安全政策**。

---

## 📇 关于分析师 (About the Analyst)

|  |  |
| --- | --- |
| **姓名** | Dennis Kim (김호광 / HoKwang Kim) |
| **职务** | Betalabs Inc. CEO · 独立威胁情报分析师 · 前 Cyworld Z CEO · 资深 Microsoft Azure MVP |
| **专业领域** | Web3·区块链安全 · AI/MCP安全 · 供应链攻击 · 零日漏洞生态 · 朝鲜及国家背景威胁 · 韩国网络安全政策 |
| **邮箱** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |
| **媒体平台** | [Web3Paper](https://web3paper.net/ko) — 韩英双语区块链媒体 |

---

## ⭐ 最新报告 — Featured

> 🆕 **2026-05-10 发布 · 4 种语言同步公开**

### 朝鲜 Lazarus Group 新型隐匿技术:将 `.git/hooks/` 用作二阶段加载器的 Contagious Interview / TaskJacker 行动

朝鲜 Lazarus Group(MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima)将其虚假招聘行动的二阶段恶意软件加载器**隐藏在 `.git/hooks/` 目录中**。该目录**不被 git 自身跟踪**,因此**绝不会出现在 PR diff、代码审查、SAST 扫描中**。目标只需运行 `git pull`,无需执行任何代码即可被窃取凭据、加密货币钱包和 SSH 密钥。

**核心洞察:** 朝鲜正在积极引入 AI LLM 实施实时语言与平台移植以规避检测。这是该行动的**第 5 次进化** — npm 包(2022~)→ 虚假视频会议工具(2024)→ 338 个 npm 包大规模行动(2025)→ VS Code Tasks(2026 Q1)→ git hooks。

| 项目 | 值 |
| --- | --- |
| **报告 ID** | `CTI-2026-0510-LAZARUS-GITHOOKS` |
| **严重度** | 🔴 HIGH — 直接针对韩国开发者、交易所及 Web3 实体 |
| **TLP** | `TLP:GREEN` |
| **威胁行为者** | Lazarus Group / Famous Chollima / Sapphire Sleet(朝鲜侦察总局) |
| **累计损失** | 2017 年以来累计 67.5 亿美元+(Chainalysis);2025 年单年 20.2 亿美元 |
| **来源** | OpenSourceMalware(一次)+ Microsoft、Cisco Talos、Abstract Security 交叉验证 |

**📄 报告下载(4 种语言)**

| 语言 | Markdown | PDF |
| --- | --- | --- |
| 🇰🇷 韩国语 | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf)(正式版) |
| 🇬🇧 英语 | [`CTI-2026-0510-LAZARUS-GITHOOKS_EN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | — |
| 🇨🇳 中文(简体) | [`CTI-2026-0510-LAZARUS-GITHOOKS_CN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | — |
| 🇯🇵 日语 | [`CTI-2026-0510-LAZARUS-GITHOOKS_JP.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | — |

**📰 新闻稿**

* 🇰🇷 [韩国语新闻稿(1 页摘要 + Lazarus 历史损失 + 韩国影响 + FAQ)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx)

---

## 🗞️ 近期重点

### 2026-05-10 · Mythos × CVE-2026-4747 — 「AI 并未发现新漏洞,而是让发现旧漏洞变得便宜」
对 Rival Security 分析的 CTI 验证。Anthropic 发布的「AI 自主发现的首个远程内核漏洞」FreeBSD NFS RCE 实际上与 19 年前公开的 MIT Kerberos `librpcsecgss` 缺陷为同源缺陷。
[KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md)

### 2026-05-07 · ScarCruft 完全占领延边游戏平台的供应链攻击
APT37(朝鲜)的 sqgame 入侵案例,展示**针对脱北者及人权活动家的间谍作战**与工具谱系追踪。通过代号 `zhuagou(抓狗)` 的词汇分析。
[KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf)

### 2026-04-30 · Copy Fail (CVE-2026-31431) — 用 732 字节获得所有主流 Linux 的 root 权限
**由 Theori 的 Lee Tae-yang 与 Xint Code 的 AI 辅助发现**。9 年前埋藏的 Linux 内核权限提升 + 容器逃逸原语分析。
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD)

### 2026-04-27 · Litecoin MWEB 零日事件
**13 区块 reorg、silent patch、Fork 链结构风险**的定量分析。莱特币基金会的 CVD 违规嫌疑及对交易所、ETF 治理的影响。
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf)

---

## 📚 报告索引

| ID | 发布日 | 标题 | 严重度 | 语言 | 下载 |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | 2026-05-10 | Lazarus Group 的 `.git/hooks/` 隐匿技术 — Contagious Interview / TaskJacker 行动 | 🔴 HIGH | KR · EN · CN · JP | [KR](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [Press KR](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) | 2026-05-10 | AI 并未发现新漏洞,而是让发现旧漏洞变得便宜 — Mythos × CVE-2026-4747 × CVE-2007-3999 | 🔴 HIGH | KR | [KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) |
| [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_KR.md) | 2026-05-07 | ScarCruft 完全占领延边游戏平台的供应链攻击 — APT37 sqgame 入侵与脱北者间谍作战 | 🔴 HIGH | KR · EN · JP | [KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | Copy Fail (CVE-2026-31431) — 用 732 字节获得所有主流 Linux 的 root,9 年前的内核 LPE + 容器逃逸 | 🔴 CRITICAL | KR | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) | 2026-04-27 | Litecoin MWEB 零日事件 — 13 区块 reorg、silent patch、Fork 链结构风险定量分析 | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) | 2026-04-22 | 针对 MCP 的智能型攻击与潜伏型攻击 — 是结构性问题吗 | 🔴 HIGH | KR · EN · CN · JP | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) · [CN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) · [JP](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) · [PDF](./CTI-2026-0422-MCP_KR.pdf) · [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) · [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel 安全入侵事件 — AI SaaS 供应链攻击与 ShinyHunters 威胁评估 | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Vercel_%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%89%E1%85%A1%E1%84%80%E1%85%A5%E1%86%AB_%E1%84%87%E1%85%AE%E1%86%AB%E1%84%89%E1%85%A5%E1%86%A8%E1%84%85%E1%85%B5%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 网络武器供应链的崩溃与国家安全威胁 — Coruna iOS Exploit Kit 案例分析 | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 新报告将在发布时添加至本表的**最顶端**。命名规则参见 [Naming Convention](#-命名规则) 部分。

---

## 🗂️ 主题分类

### 🤖 AI 安全 · MCP · LLM
AI 智能体、MCP(Model Context Protocol)、LLM 系统的安全风险。潜伏型(sleeper)攻击模型、模型供应链污染、AI 辅助漏洞发现的经济学。

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — Claude Mythos「组合式创造力」假说验证 + 漏洞经济学崩塌
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — 朝鲜 AI LLM 驱动的实时语言与平台移植模式分析
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) — MCP 结构性 RCE、Sleeper MCP、Web3 钱包攻击面与偏见注入攻击

### 🌐 供应链攻击
攻击者不直接攻击最终目标,而是先入侵其信任的第三方供应商。SolarWinds、Salesloft–Drift 之后,2025–2026 年增长最快的类别。

* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — Lazarus × 虚假招聘 × `.git/hooks/` 隐匿(开发者工作站渗透)
* [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_KR.md) — APT37 × sqgame 游戏平台入侵(脱北者目标)
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) — MCP 供应链 × Axios NPM 入侵(UNC1069) × 市场污染
* [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) — Vercel × Context.ai × ShinyHunters(AI SaaS OAuth 供应链入侵)

### 🐧 内核与基础设施漏洞
针对系统可信计算基础(TCB)— Linux 内核、虚拟机管理程序、容器运行时 — 的缺陷分析,关注跨发行版与跨环境影响。

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — FreeBSD NFS RCE (CVE-2026-4747) 与 MIT Kerberos 同源缺陷 (CVE-2007-3999)
* [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) — Copy Fail (CVE-2026-31431) · 9 年前的 Linux 内核 LPE + 容器逃逸原语

### 📱 移动与零日威胁
针对 iOS、Android 等移动平台的国家级监视工具与商业漏洞利用包分析。

* [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) 及网络武器供应链

### 💰 Web3 与加密货币生态
DeFi、中心化交易所(CEX)、稳定币、NFT 市场的入侵事件;韩国合规视角(DAXA、KoFIU、特金法)。

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — DAXA 5 大交易所与 Web3 发行方 deploy 密钥保护建议
* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) — Litecoin MWEB 零日、13 区块 reorg、对交易所与 ETF 治理的影响
* [`CTI-2026-0422-MCP §4`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) — MCP 与钱包集成的单机风险及外部托管设计原则
* [`CTI-2026-0420-VERCEL §8`](./CTI-2026-0420-VERCEL_EN.md) — Vercel 入侵对 Web3 前端基础设施的影响
* [`CTI-2026-0320-CORUNA §4`](./CTI-2026-0320-CORUNA_KR.md) — 零日漏洞交易生态系统与基于加密货币的支付结构

### 🕵️ 威胁行为者档案
特定 APT 组织、网络犯罪团伙的 TTP、活动、归因信息整理。

* **Lazarus Group / Famous Chollima / G1052**(朝鲜;累计 67.5 亿美元+ 加密货币盗窃) — [CTI-2026-0510-LAZARUS-GITHOOKS](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md)
* **APT37 / ScarCruft / RedAnt**(朝鲜;脱北者与人权活动家目标) — [CTI-2026-0507](./CTI-2026-0507-SCARCRUFT_KR.md)
* **UNC1069 / Sapphire Sleet**(朝鲜关联;供应链污染实战) — [CTI-2026-0422 §3.3](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD)
* **ShinyHunters**(UNC6040 / UNC6240 / UNC6661 / UNC6671) — [CTI-2026-0420 §5](./CTI-2026-0420-VERCEL_EN.md)
* **UNC6353 · UNC6691 · Operation Zero** — [CTI-2026-0320 §3](./CTI-2026-0320-CORUNA_KR.md)

### 🇰🇷 韩国网络安全政策
对韩国政府、公共机构、国防产业的威胁分析与制度建议。

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5, §8`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — DAXA / KISA / NIS / KoFIU 联合警报与 LinkedIn 韩国 takedown 渠道建议
* [`CTI-2026-0507-SCARCRUFT §7`](./CTI-2026-0507-SCARCRUFT_KR.md) — 脱北者 / 人权活动家保护体系与游戏平台监控建议
* [`CTI-2026-0422-MCP §3.3`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) — 朝鲜的 MCP 供应链污染可能性与「国家安全议题化」建议
* [`CTI-2026-0320-CORUNA §6–§8`](./CTI-2026-0320-CORUNA_KR.md) — 韩国政府网络安全架构的脆弱性与「网络安全新政」建议

---

## 📰 新闻稿 (Press Releases)

为方便记者、编辑、研究者即时引用报告内容,提供包含核心统计数据、引述、FAQ、联系方式的摘要新闻稿。所有新闻稿均以 `TLP:GREEN` 发布,可自由引用(必须注明出处)。

| 报告 | 韩国语 | 英语 |
| --- | --- | --- |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | [Press KR (docx)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) | — |
| `CTI-2026-0422-MCP` | [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) | [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |

---

## 📡 发布渠道

报告除 GitHub 外,亦可在以下渠道获取:

| 渠道 | 用途 | 链接 |
| --- | --- | --- |
| **GitHub(本仓库)** | 一次发布,完整版资料 | [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| **Web3Paper** | 韩英分析专栏 | [web3paper.net/ko](https://web3paper.net/ko) |
| **LinkedIn** | 英文专栏摘要 + 行业含义 | *(链接稍后添加)* |
| **Facebook** | 韩国时事评论与讨论 | *(链接稍后添加)* |

> 📩 **引用与转载政策**:所有报告以 `TLP:GREEN` 发布,可自由引用。**必须注明出处** — `Dennis Kim, 김호광, gameworker@gmail.com / https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT`。

---

## 🧭 分析方法论

本档案库的所有报告均遵循以下标准。

### Traffic Light Protocol (TLP) 分类

| 标签 | 含义 | 本仓库标准 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 社区内可共享、可对外公开 | **本仓库默认** |
| 🟡 TLP:AMBER | 限组织内部共享 | 不适用 |
| 🔴 TLP:RED | 限个别接收者 | 不适用 |

### 严重度等级

| 等级 | 含义 | 应对时间 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 直接关系国家安全 / 大规模民间损害 | 立即 |
| 🔴 **HIGH** | 行业 / 生态系统级广泛影响 | 24–72 小时 |
| 🟠 **MEDIUM** | 特定企业 / 组织群有限影响 | 7 天内 |
| 🟡 **LOW** | 认知 / 观察级别 | 30 天内 |

### 信心度评估

每项 Key Judgment 标注 **High / Medium-High / Medium / Low** 信心度,基于一手资料与二手新闻、公开 CTI 资料的交叉验证。词汇与情境推论将明确标识。

### 参考框架

* **MITRE ATT&CK**(Enterprise + Mobile)— TTP 映射标准
* **NIST SP 800-61** — 事件响应生命周期
* **NIST SP 800-207** — 零信任架构
* **STIX / TAXII** — 威胁情报交换标准
* **Mandiant UNC / APT 命名** — 威胁行为者聚类
* **Traffic Light Protocol 2.0**(FIRST.org)— 信息共享分类标准

---

## 📝 命名规则

```
CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>

主报告:
  CTI-2026-0510-LAZARUS-GITHOOKS_KR.md  → 2026-05-10 发布,韩国语 Markdown
  CTI-2026-0510-LAZARUS-GITHOOKS_EN.md  → 同事件英语版
  CTI-2026-0422-MCP_KR.pdf              → MCP 事件韩国语 PDF 正式版

衍生文档(使用 SUBTYPE):
  CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx → 韩国语新闻稿
  CTI-2026-0422-MCP-PRESS_EN.md                → 英文新闻稿
```

* `SUBJECT` — 代表报告主题的关键词(大写,多词以连字符连接)。
* `SUBTYPE` — 可选。区分主报告衍生文档(`PRESS`、`BRIEF`、`SLIDES` 等)。
* `LANG` — `KR`(韩国语)/ `EN`(英语)/ `JP`(日语)/ `CN`(中文,简体)。
* `ext` — `md`(默认)/ `pdf`(正式版)/ `docx`(可编辑)。

> ⚠️ **遗留文件名说明**:部分早期报告的文件名因 GitHub 上传过程中的空格编码而不规范(例:`Cti%202026%200422%20mcp%20kr.MD`)。新报告将遵循上述标准,旧文件名将逐步规范化。

---

## 🤝 联系与贡献

| 渠道 | 用途 |
| --- | --- |
| **邮箱** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 报告反馈、订正、提示、采访咨询 |
| **GitHub Issues** | [创建 Issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 更新、参考资料补充建议 |
| **来源保护** | 敏感线索(尤其是脱北者 / 活动家安全相关)请通过 Signal、ProtonMail 等安全渠道联系。 |

本仓库为个人研究项目,欢迎贡献 PR,但报告正文修改将谨慎审核。

---

## ⚖️ 免责声明

1. 本仓库的所有报告均为基于**公开 OSINT 资料及新闻报道**的独立分析,不代表相关组织、机构、企业的官方立场。
2. 报告内容仅可用于**教育、防御、研究、政策制定目的**,严禁用于攻击、入侵、违法活动。
3. IoC 与漏洞信息以发布时点为准,实际应用前请务必再次确认最新状态。
4. 部分分析(尤其是工具谱系、词汇推论)基于情境线索,明确标识为非确定性归因。
5. 作者对本资料的直接或间接使用所引发的任何损害概不负责。

---

## 📊 仓库统计

|  |  |
| --- | --- |
| **报告总数** | **8** |
| **覆盖语言** | 韩国语、英语、中文(简体)、日语 |
| **追踪威胁行为者 / 研究领域** | Lazarus Group / Famous Chollima · APT37 / ScarCruft · UNC1069 / Sapphire Sleet · ShinyHunters · UNC6353 · UNC6691 · Operation Zero · TeamPCP · 等 |
| **覆盖 CVE** | 15+(CVE-2026-31431、CVE-2026-4747、CVE-2007-3999、CVE-2024-23222、MCP 系列 6 件等) |
| **多语种阵容** | LAZARUS-GITHOOKS(4 种语言)· MCP(4 种语言)· SCARCRUFT(3 种语言)· VERCEL · LITECOIN(各 2 种语言) |
| **新闻稿数** | 3(KR×2 · EN×1) |
| **最近更新** | 2026-05-10 |

---

> **🌐 Languages | 语言选择:**
> [🇰🇷 한국어](./README.md) · [🇬🇧 English](./README_EN.md) · **🇨🇳 中文(簡體)** · [🇯🇵 日本語](./README_JP.md)

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/) · [web3paper.net](https://web3paper.net/ko)

> *「防御方每堵住一条通道,Lazarus 就在 6 个月内迁移到更深的地方。」 — CTI-2026-0510-LAZARUS-GITHOOKS*
> *「AI 并未制造新漏洞,而是让发现旧漏洞的成本崩塌。」 — CTI-2026-0510-MYTHOS*
> *「732 字节足以颠覆十年信任。」 — CTI-2026-0430*
> *「MCP 的问题不在于『用还是不用』,而在于『与什么一起安装』。」 — CTI-2026-0422*
> *「今日的国家战略资产,即明日的网络犯罪工具。」 — CTI-2026-0320*
