# 🛡️ Cyber Threat Intelligence Report

> **独立网络威胁情报存档**
> *基于 OSINT 的防御研究*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--06--04-informational?style=flat-square)

🌐 **语言 / Languages:** [한국어](README.md) · [English](README_EN.md) · [日本語](README_JP.md) · **中文（本文档）**

本仓库是一个独立存档，收集并发布以防御、研究和政策制定为目的的**公开网络威胁情报（Open CTI）报告**。所有报告均基于 OSINT 编写，不代表任何组织、机构或国家的官方立场。

---

## 📇 分析师简介

|  |  |
| --- | --- |
| **姓名 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **角色 (Role)** | CEO, Betalabs Inc. · 前 Cyworld Z CEO · 独立威胁情报分析师 |
| **专长领域** | Web3／区块链安全、供应链攻击、零日生态、朝鲜／国家支持型威胁、AI/LLM 安全 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ 最新报告（Featured）

> 🆕 **2026-06-04 发布**

### 从身份冒充到代码执行的一揽子风险 — IBM WebSphere 同日披露三大漏洞

**CVE-2026-8644 / 9311 / 9319（CVSS 9.0–9.1）** · Java 中间件反序列化 RCE、身份验证绕过，以及"正式 Fix Pack 尚未发布"的陷阱

6 月 1 日，IBM 同时披露了影响 WebSphere Application Server 8.5 与 9.0 的三个严重漏洞。冒充（8644）提供"接入"，RCE（9311·9319）提供"执行"，构成可链式利用的组合。正式 Fix Pack 目标为 3Q2026 且尚未发布，因此临时修复与补偿性控制是唯一的即时应对。作为韩国银行、保险与公共部门核心的 Java EE 中间件，其影响重大。

| 项目 | 值 |
| --- | --- |
| **报告 ID** | `CTI-2026-0604-WEBSPHERE` |
| **严重度** | 🔴 CRITICAL |
| **分级** | `TLP:GREEN` |
| **CVE** | CVE-2026-8644 · CVE-2026-9311 · CVE-2026-9319 |

**📄 报告:** [🇰🇷 KR](CTI-2026-0604-WEBSPHERE.md) · [🇬🇧 EN](CTI-2026-0604-WEBSPHERE_EN.md) · [🇯🇵 JA](CTI-2026-0604-WEBSPHERE_JA.md) · [🇨🇳 ZH](CTI-2026-0604-WEBSPHERE_ZH.md)

---

## ⭐ Awesome Security Series: 初创企业安全指南 & LLM CISO

> 🆕 **2026-06-17 发布** — 进入韩国市场的初创企业必备安全指南

正如 Tving、CU 和 FastCampus 泄露事件所示，初创企业的一次配置失误就可能导致大规模个人信息泄露。进入韩国市场的海外初创企业面临额外的风险：韩国**个人信息保护法（PIPA）**规定了 GDPR 和 CCPA 没有的要求——所有实体必须指定 CPO、AES-256 加密、6 个月访问日志保存、禁止收集居民登记号码、违规承担刑事责任。

本指南将分阶段的安全检查清单、云安全（AWS/GCP/Azure/Vercel）、Google Workspace 安全、DRM 和 KISA 合规集成到一个资源中，并提供了**可将任何 LLM 转变为虚拟 CISO 的提示词系统**，能够自动检测 GDPR/CCPA 与 PIPA 之间的合规差距。支持公有 LLM（Claude、GPT、DeepSeek）和本地 LLM（Ollama、气隙环境）。

👉 [**查看初创企业安全指南 →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

| 语言 | 指南 | LLM CISO 提示词 | 仪表板 |
|------|------|----------------|--------|
| 한국어 | [指南](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_KR.md) | [提示词](Startup_Security_Guide/LLM_CISO_PROMPT_KR.md) | [仪表板](Startup_Security_Guide/LLM_CISO_DASHBOARD.md) |
| English | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_EN.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_EN.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD_EN.md) |

**主要功能:**
- **29 项**分阶段安全检查清单（Pre-Seed 到 Series A）
- **25 维度 GDPR vs CCPA vs PIPA 合规差距矩阵**（LLM 自动检测）
- **云安全** — AWS（15项）· GCP（12项）· Azure（10项）· Vercel（10项）
- **Google Workspace 安全** — Gmail/Drive/Docs 管理控制台设置 + SPF/DKIM/DMARC
- **DRM·文档安全** — 分类·IRM·源代码保护·离职人员账户处理
- **事件响应** — NIST SP 800-61 框架 + 韩国监管截止期限
- **LLM CISO 角色** — Ollama 本地模式，用于气隙环境下的敏感数据处理

> *"如果您的初创企业要进入韩国市场，请在第一次提交代码之前先阅读本指南。"*

---

## 📚 报告索引（Report Index）

> 💡 新报告在发布时添加至本表**最上方**。命名规则：`CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`
> ※ 严重度（Severity）为基于主题的参考值，各报告正文的评估具有优先性。

| 发布日 | ID / 标题 | 严重度 | 语言 |
| --- | --- | --- | --- |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE_ZH.md) — IBM WebSphere 同日披露三件（反序列化 RCE·身份验证绕过） | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JA](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_EN.md) — Citrix NetScaler 内存越界读取的大规模利用 (CVE-2026-3055) | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_CN.md) — 伊朗利用生成式 AI 的战争 | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [CN](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — 以 GenAI 武装的 GREYVIBE 针对乌克兰的行动 | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_CN.md) — MARIMO（公告武器化·披露至利用的压缩） | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [CN](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_CN.md) — JINX | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [CN](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_CN.md) — Gogs Git 服务器漏洞 | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [CN](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_CN.md) — ChatGPhish（冒充 ChatGPT 的钓鱼） | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [CN](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_ZH.md) — KelpDAO（Web3·DeFi 威胁） | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_ZH.md) — GlassWorm（自传播供应链蠕虫） | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_ZH.md) — Gitea CVE 漏洞 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JA](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_ZH.md) — AI 挖矿劫持 | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) — 英国对俄罗斯加密资产制裁分析 | 🟠 MEDIUM | [KO](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) — Kimsuky（APT43）PebbleDash·AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_CN.md) — 同时发生的双重威胁（LiteSpeed · Shai-Hulud） | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) — EDR 规避威胁 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) — Windows BitLocker 绕过零日 | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) — 2026 朝鲜黑客趋势 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — GitHub 内部仓库入侵 | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20ZH.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Exchange Server 漏洞 | 🔴 HIGH | [KR · EN](CTI-2026-0520-EXCHANGE.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) — EvilTokens（AI 生成设备代码钓鱼 PhaaS） | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal 核心最高危零日（无补丁） | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) — cPanel 黑客攻击 | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) — 朝鲜利用 LLM 的黑客攻击 / AI 网络攻击与智能体防御 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) — 俄罗斯 RAT（LNK · RDP） | 🔴 HIGH | [KO](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS 侧信道 | 🟠 MEDIUM | [KO](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) — 朝鲜 Lazarus 的 git-hooks 隐匿技术 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Mythos AI 漏洞 | 🔴 HIGH | [KR](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) — ScarCruft（APT37）行动 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — Vibe：AI 黑客时代 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 威胁分析 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) — CopyFail（CVE-2026-31431） | 🔴 HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) — 莱特币漏洞 | 🟠 MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20cn.MD) — 针对 MCP 的高级·潜伏型攻击 | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) — Vercel 入侵（AI SaaS 供应链 · ShinyHunters） | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](Analysis%20ZH%20中文版.md) — Coruna iOS Exploit Kit · 网络武器供应链 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20中文版.md) |

---

## 🗂️ 按类别（By Category）

### 🌐 供应链攻击
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0527-GLASSWORM` · `CTI-2026-0527-GITEA` · `CTI-2026-0530-GOGS` · `CTI-2026-0524-DUALTHREAT` · `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` · `CTI-2026-0420-VERCEL`

### 🔓 零日·漏洞
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0603-NETSCALER` · `CTI-2026-0521-YELLOWKEY` · `CTI-2026-0520-DRUPAL` · `CTI-2026-0520-EXCHANGE` · `CTI-2026-0520-CPANEL` · `CTI-2026-0430-COPYFAIL` · `CTI-2026-0320-CORUNA`

### 🕵️ 朝鲜·国家支持型威胁
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH`（APT43）· `CTI-2026-0510-LAZARUS-GITHOOKS` · `CTI-2026-0507-SCARCRUFT`（APT37）· `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0514-CTRL_RussianRAT`

### 🤖 AI / LLM 威胁
* `CTI-2026-0601-GREYVIBE` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0530-CHATGPHISH` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0520-EVILTOKENS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0514-ChatGPT_DNS_SideChannel` · `CTI-2026-0510-MYTHOS-AI` · `CTI-2026-0505-VIBE` · `CTI-2026-0422-MCP`

### 💰 Web3·加密货币
* `CTI-2026-0528-KELPDAO` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` · `CTI-2026-0427-LITECOIN`

### 🇰🇷 韩国网络安全政策
* `CTI-2026-0320-CORUNA` · `CTI-2026-0420-VERCEL` · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0604-WEBSPHERE`

---

## 🧭 分析方法论（Methodology）

### Traffic Light Protocol (TLP)
| 标签 | 含义 | 本仓库 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 可在社区共享·公开 | **默认** |
| 🟡 TLP:AMBER | 仅限组织内部 | 不适用 |
| 🔴 TLP:RED | 仅限指定接收者 | 不适用 |

### 严重度（Severity）
| 等级 | 含义 | 响应时间 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 直接关系国家安全·大规模民用损害 | 立即 |
| 🔴 **HIGH** | 对行业·生态系统广泛影响 | 24–72 小时 |
| 🟠 **MEDIUM** | 限于特定企业·组织群 | 7 天内 |
| 🟡 **LOW** | 认知·观察级别 | 30 天内 |

### 框架参照
* **MITRE ATT&CK** · **NIST SP 800-61**（事件响应）· **NIST SP 800-207**（零信任）· **STIX/TAXII** · **Mandiant UNC/APT 命名**

每条关键判断（Key Judgment）均标注 **High / Medium / Low** 置信度，并对一手资料与二手公开 CTI 进行交叉验证。

---

## 📝 命名规则（Naming Convention）

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>
```
* `SUBJECT` — 代表主题的大写关键词
* `LANG` — `KR/KO` · `EN` · `JP/JA` · `CN/ZH`
* `ext` — `md`（默认）· `pdf`（正式发布版）

---

## 🤝 联系·贡献（Contact & Contribution）

| 渠道 | 用途 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 反馈·更正·线索 |
| **GitHub Issues** | [创建 issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC·参考资料补充建议 |
| **线索保护** | 敏感线索请通过 Signal·ProtonMail 等安全渠道联系 |

---

## ⚖️ 免责声明（Disclaimer）

1. 本仓库所有报告均为基于**公开 OSINT 资料与媒体报道**的独立分析，不代表相关组织、机构或企业的官方立场。
2. 内容**仅供教育、防御、研究与政策制定之用**，严禁用于攻击、入侵或非法活动。
3. IoC 与漏洞信息以发布时点为准，实际应用前请重新确认最新状态。
4. 作者对因直接或间接使用本资料而产生的任何损害概不负责。

---

## 📊 仓库统计（Repository Stats）

|  |  |
| --- | --- |
| **报告总数** | 37（按系列计） |
| **覆盖语言** | 한국어 · English · 日本語 · 中文 |
| **主要威胁行为者** | Lazarus · Kimsuky（APT43）· ScarCruft（APT37）· ShinyHunters · GREYVIBE · 等 |
| **最近更新** | 2026-06-04 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"今日的国家战略资产，将成为明日的网络犯罪工具。" — CTI-2026-0320*
