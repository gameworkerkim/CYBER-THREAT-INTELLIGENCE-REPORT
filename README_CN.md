# 🛡️ 网络威胁情报报告 (Cyber Threat Intelligence Report)

> **独立网络威胁情报报告档案**
> *Independent Cyber Threat Intelligence Archive · 基于 OSINT 的防御研究*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20ZH%20%7C%20JA-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--28-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

本仓库是面向防御、研究与政策制定目的的**公开网络威胁情报（Open CTI）报告**的独立档案。所有报告均基于 OSINT 编写，不代表任何特定组织、机构或国家的官方立场。

🌐 **以其他语言阅读 / Read in other languages:** [한국어](README.md) · [English](README_EN.md) · [日本語](README_JP.md)

---

## 📇 关于分析师

|  |  |
| --- | --- |
| **姓名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **职务 (Role)** | Betalabs Inc. 首席执行官 · 独立威胁情报分析师 · 前 Cyworld Z CEO |
| **专长领域** | Web3·区块链安全、供应链攻击、零日生态系统、朝鲜·国家背景威胁、AI SaaS 安全 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新报告 — 重点关注

> 🆕 **2026-05-28 发布（KelpDAO 事件四语种同步发布）**

### KelpDAO LayerZero 跨链桥黑客事件 — 针对链下验证基础设施单点故障的高级攻击

**1-of-1 DVN、RPC 节点投毒，以及蔓延至整个 DeFi 的系统性风险**

2026 年 4 月 18 日，朝鲜关联 Lazarus Group 下属组织 TraderTraitor 攻击了 KelpDAO 的 LayerZero 跨链桥基础设施，窃取了 **116,500 rsETH（约 2.92 亿美元）**。攻击者并未利用智能合约漏洞，而是精准切入链下验证基础设施的 1-of-1 DVN 单点故障与 RPC 节点投毒，这是 **2026 年最大的 DeFi 黑客事件**，也使朝鲜仅凭两起攻击便占据 2026 年全球加密货币黑客损失的 76%。

| 项目 | 值 |
| --- | --- |
| **报告 ID** | `CTI-2026-0528-KELPDAO` |
| **严重程度** | 🔴 CRITICAL |
| **分类** | `TLP:GREEN` |
| **威胁行为者** | Lazarus Group（TraderTraitor · 朝鲜关联） |
| **语言** | KR · EN · ZH · JA |

**📄 下载：** [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇨🇳 ZH](CTI-2026-0528-KELPDAO_ZH.md) · [🇯🇵 JA](CTI-2026-0528-KELPDAO_JA.md)

---

## 📚 报告索引 — 全部报告列表

> 💡 新报告会按发布时点添加至本表**最上方**。文件命名规则为 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`。

| ID | 发布日期 | 标题 | 严重程度 | 语言 |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_ZH.md) | 2026-05-28 | KelpDAO LayerZero 跨链桥黑客 — 链下验证基础设施的单点故障 | 🔴 CRITICAL | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md) | 2026-05-27 | GlassWorm C2 基础设施同步封锁 — 针对开发者的自传播供应链蠕虫 | 🔴 HIGH | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_ZH.md) | 2026-05-27 | Gitea 容器镜像仓库未授权暴露（CVE-2026-27771）— 被搁置四年的"私有"幻象 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) · [JA](CTI-2026-0527-GITEA_JA.md) |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_ZH.md) | 2026-05-27 | 滥用 AI 聊天机器人推荐的加密劫持 — 超越搜索投毒的新型投递载体 | 🔴 HIGH | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) | 2026-05-26 | 英国政府对俄罗斯的加密货币制裁 — 国家层面的数字资产制裁动向 | 🟠 MEDIUM | [KR](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [PDF](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.pdf) |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) | 2026-05-26 | Kimsuky（APT43）PebbleDash · AppleSeed 新分析 | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [PDF](CTI-2026-0526-KIMSUKY-PEBBLEDASH.pdf) |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_CN.md) | 2026-05-24 | 同时发生的两种威胁分析 (Two Concurrent Threats) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [PDF](CTI-2026-0524-DUALTHREAT_KR.pdf) |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) | 2026-05-22 | EDR 绕过手法三阶段分析 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) · [PDF](CTI-2026-0522-EDR3_KR.pdf) |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) | 2026-05-21 | Windows BitLocker 绕过零日漏洞（YellowKey） | 🔴 HIGH | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) | 2026-05-21 | 2026 年朝鲜黑客趋势综合分析 | 🔴 HIGH | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20ZH.md) | 2026-05-20 | FAST16 报告 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub 内部仓库黑客 — 通过员工设备入侵泄露 3,800+ 内部仓库 | 🔴 HIGH | [Report](CTI-2026-0520-GITHUB.md) |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Microsoft Exchange Server 安全漏洞 | 🔴 HIGH | [Report](CTI-2026-0520-EXCHANGE.md) |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupal 核心最高危漏洞紧急警报 — 零日，无补丁 | 🔴 CRITICAL | [Report](CTI-2026-0520-DRUPAL.md) |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI 生成的设备代码钓鱼 PhaaS | 🔴 HIGH | [Report](CTI-2026-0520-EVILTOKENS.md) |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel 黑客事件分析 | 🟠 MEDIUM | [Report](CTI-2026-0520-CPANEL.md) |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) | 2026-05-17 | 朝鲜利用 LLM 的黑客行为 — AI 网络攻击与代理防御 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | 俄罗斯 RAT — LNK/RDP 控制路径分析 | 🔴 HIGH | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNS 侧信道更新 | 🟠 MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | 2026-05-10 | 朝鲜 Lazarus Git Hooks 黑客报告 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [PRESS PDF](CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.pdf) |
| [`CTI-2026-0510-MYTHOS`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Claude Mythos AI 漏洞分析 | 🔴 HIGH | [Report](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) | 2026-05-07 | ScarCruft（APT37）行动分析 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | Vibe，人工智能黑客时代 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub 安全事件分析 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | 'Copy Fail' 安全报告（CVE-2026-31431） | 🟠 MEDIUM | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | Litecoin 漏洞报告 | 🔴 HIGH | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20cn.MD) | 2026-04-22 | 针对 MCP 的高级与潜伏型攻击 — 是否为结构性问题 | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel 安全入侵事件 — AI SaaS 供应链攻击与 ShinyHunters 威胁评估 | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) | 2026-03-20 | 网络武器供应链的崩塌与国家安全威胁 — Coruna iOS Exploit Kit 案例分析 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

---

## 🗂️ 按类别分类

### 🌐 供应链攻击 (Supply Chain Attacks)

攻击者并不直接攻击最终目标，而是先入侵"受信任的第三方供应商"以获得间接访问的攻击类型。自 SolarWinds、Salesloft-Drift 以来，是 2025–2026 年增长最快的类别。

* [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md) — GlassWorm 四重 C2（Solana · BitTorrent DHT · Google Calendar · VPS）同步封锁
* [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_ZH.md) — Gitea 容器镜像仓库未授权暴露（CVE-2026-27771）
* [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — 通过员工设备入侵导致 3,800+ GitHub 内部仓库泄露
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — 朝鲜 Lazarus 的 Git Hooks 供应链攻击
* [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 安全事件分析
* [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20cn.MD) — Anthropic MCP 供应链攻击（含潜伏型攻击）
* [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) — Vercel × Context.ai × ShinyHunters（AI SaaS OAuth 供应链入侵）

### 📱 移动·零日威胁 (Mobile & Zero-Day)

针对 iOS、Android 等移动平台的国家级监控工具与商业利用工具包分析。

* [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) — Windows BitLocker 绕过零日
* [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal 核心最高危漏洞（零日，无补丁）
* [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Microsoft Exchange Server 安全漏洞
* [`CTI-2026-0320-CORUNA`](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) — Coruna iOS 利用工具包（CVE-2024-23222）与网络武器供应链

### 🕵️ 威胁行为者画像 (Threat Actor Profiles)

特定 APT 团伙、网络犯罪组织的 TTP、行动与归因信息整理。

* **Lazarus Group / TraderTraitor（朝鲜）** — [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_ZH.md), [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md)
* **Kimsuky / APT43（朝鲜）** — [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md)
* **ScarCruft / APT37（朝鲜）** — [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md)
* **朝鲜综合趋势** — [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md), [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md)
* **ShinyHunters**（UNC6040/UNC6240/UNC6661/UNC6671）— [`CTI-2026-0420-VERCEL` §5](CTI-2026-0420-VERCEL_EN.md)
* **UNC1069 / Sapphire Sleet（朝鲜）** — [`CTI-2026-0422-MCP` §3.3](Cti%202026%200422%20mcp%20cn.MD)
* **UNC6353·UNC6691·Operation Zero** — [`CTI-2026-0320-CORUNA` §3](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md)
* **俄罗斯关联 RAT 运营者** — [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md), [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md)

### 💰 Web3·加密生态 (Web3 & Crypto)

涉及 DeFi、CEX、稳定币、NFT 市场的入侵事件，以及韩国国内（DAXA·KoFIU·特定金融信息法）合规视角分析。

* [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_ZH.md) — KelpDAO LayerZero 跨链桥黑客（2.92 亿美元，2026 年最大 DeFi 黑客事件）
* [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_ZH.md) — 滥用 AI 聊天机器人推荐的 GPU 目标加密劫持
* [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md) — 加密钱包·NPM 令牌窃取，Solana 区块链 C2
* [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) — 英国政府对俄罗斯的加密制裁
* [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) — Litecoin 漏洞报告
* [`CTI-2026-0420-VERCEL` §8](CTI-2026-0420-VERCEL_EN.md) — Vercel 入侵对 Web3 前端基础设施的影响
* [`CTI-2026-0320-CORUNA` §4](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) — 零日交易生态系统与基于加密货币的支付结构

### 🤖 AI 安全与 LLM 威胁 (AI Security & LLM Threats)

针对 LLM、AI 代理、MCP 等 AI 系统的新型攻击面分析。

* [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_ZH.md) — AI 搜索投毒、LLM 推荐滥用
* [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) — 朝鲜利用 LLM 的黑客行为、代理防御
* [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS 侧信道
* [`CTI-2026-0510-MYTHOS`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Claude Mythos AI 漏洞
* [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — Vibe，人工智能黑客时代
* [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20cn.MD) — MCP 潜伏型攻击与偏见注入

### 🇰🇷 韩国网络安全政策 (Korea Cybersecurity Policy)

针对韩国国内政府、公共机构、国防工业的威胁分析与制度性应对建议。

* [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) — 针对韩国国内的 Kimsuky 新行动
* [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_CN.md) — 同时发生的两种威胁（韩国国内影响）
* [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) — 2026 年朝鲜黑客趋势综合
* [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) — 针对韩国人士的 ScarCruft 行动
* [`CTI-2026-0320-CORUNA` §6–§8](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) — 韩国政府网络安全结构的薄弱环节与"网络安全新政"建议
* [`CTI-2026-0420-VERCEL` §8.2](CTI-2026-0420-VERCEL_EN.md) — DAXA 成员交易所与韩国国内 Web3 发行方视角

---

## 🧭 方法论

本档案所有报告遵循以下标准。

### Traffic Light Protocol (TLP) 分类

| 标签 | 含义 | 本仓库标准 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 可在社区内共享、可对外公开 | **本仓库默认值** |
| 🟡 TLP:AMBER | 仅限组织内部共享 | 不适用 |
| 🔴 TLP:RED | 仅限个别接收者 | 不适用 |

### 严重程度等级

| 等级 | 含义 | 响应时间 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 直接关系到国家安全·大规模民用损害的威胁 | 立即 |
| 🔴 **HIGH** | 对产业·生态产生广泛影响 | 24–72 小时 |
| 🟠 **MEDIUM** | 对特定企业·组织群产生有限影响 | 7 日内 |
| 🟡 **LOW** | 认知·观察级别 | 30 日内 |

### 置信度评估

各 Key Judgment 以 **High / Medium / Low** 三档明示置信度，与一手资料以及二手新闻·公开 CTI 资料进行交叉核验。

### 参考框架

* **MITRE ATT&CK** — TTP 映射标准
* **NIST SP 800-61** — 事件响应生命周期
* **NIST SP 800-161** — 网络供应链风险管理 (C-SCRM)
* **NIST SP 800-190** — 容器安全
* **NIST SP 800-207** — 零信任架构
* **STIX/TAXII** — 威胁情报交换标准
* **Mandiant UNC/APT 命名** — 威胁行为者聚类

---

## 📝 文件命名规则

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

示例：
  CTI-2026-0528-KELPDAO_KR.md    → 2026年5月28日发布，KelpDAO 事件，韩文 Markdown
  CTI-2026-0528-KELPDAO_EN.md    → 同一事件的英文版
  CTI-2026-0528-KELPDAO_ZH.md    → 中文版
  CTI-2026-0528-KELPDAO_JA.md    → 日文版
```

* `SUBJECT` — 代表报告主题的关键词（大写）
* `LANG` — `KR`（韩文）/ `EN`（英文）/ `ZH` 或 `CN`（中文）/ `JA` 或 `JP`（日文）
* `ext` — `md`（默认）/ `pdf`（正式分发版）

---

## 🤝 联系与贡献

| 渠道 | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 报告反馈、订正、举报 |
| **GitHub Issues** | [创建议题](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 更新、参考文献增补建议 |
| **举报保护** | 敏感举报请通过 Signal、ProtonMail 等安全渠道联系。 |

本仓库为个人研究项目，欢迎贡献 PR，但报告正文修改将经过谨慎审阅。

---

## ⚖️ 免责声明

1. 本仓库所有报告均为**基于公开 OSINT 资料与新闻报道**的独立分析，不代表相关组织、机构、企业的官方立场。
2. 报告内容仅可用于**教育、防御、研究、政策制定目的**，严禁用于攻击、入侵、违法活动。
3. IoC 与漏洞信息以发布时点为准，实际应用前必须重新核实最新状态。
4. 作者对因直接或间接使用本资料所产生的任何损害概不负责。

---

## 📊 仓库统计

|  |  |
| --- | --- |
| **报告总数** | 30+ |
| **覆盖语言** | 韩文、English、中文、日本語 |
| **观测到的威胁行为者** | Lazarus Group · TraderTraitor · Kimsuky/APT43 · ScarCruft/APT37 · UNC1069/Sapphire Sleet · ShinyHunters · UNC6353/UNC6691 · Operation Zero · GlassWorm operators · 等等 |
| **最近更新** | 2026-05-28 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
