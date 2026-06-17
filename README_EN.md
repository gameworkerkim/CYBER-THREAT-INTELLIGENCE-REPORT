# 🛡️ Cyber Threat Intelligence Report

> **Independent Cyber Threat Intelligence Archive**
> *OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--06--04-informational?style=flat-square)

🌐 **Languages:** [한국어](README.md) · **English (this document)** · [日本語](README_JP.md) · [中文](README_CN.md)

This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **Name** | Dennis Kim (김호광 / HoKwang Kim) |
| **Role** | CEO, Betalabs Inc. · Former CEO, Cyworld Z · Independent Threat Intelligence Analyst |
| **Focus** | Web3/blockchain security, supply chain attacks, the zero-day ecosystem, DPRK/state-sponsored threats, AI/LLM security |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Report — Featured

> 🆕 **Published 2026-06-04**

### From Spoofing to Code Execution in One Bundle — Three Simultaneously Disclosed IBM WebSphere Flaws

**CVE-2026-8644 / 9311 / 9319 (CVSS 9.0–9.1)** · Java middleware deserialization RCE, authentication bypass, and the "no official Fix Pack yet" trap

On June 1, IBM simultaneously disclosed three critical flaws in WebSphere Application Server 8.5 and 9.0. Spoofing (8644) provides "access" and the RCE pair (9311·9319) provides "execution" — a chainable bundle. The official Fix Pack is targeted for 3Q2026 and not yet released, so Interim Fixes and compensating controls are the only immediate response. As business-critical Java EE middleware across Korean banking, insurance, and the public sector, its impact is significant.

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0604-WEBSPHERE` |
| **Severity** | 🔴 CRITICAL |
| **Classification** | `TLP:GREEN` |
| **CVE** | CVE-2026-8644 · CVE-2026-9311 · CVE-2026-9319 |

**📄 Report:** [🇰🇷 KR](CTI-2026-0604-WEBSPHERE.md) · [🇬🇧 EN](CTI-2026-0604-WEBSPHERE_EN.md) · [🇯🇵 JA](CTI-2026-0604-WEBSPHERE_JA.md) · [🇨🇳 ZH](CTI-2026-0604-WEBSPHERE_ZH.md)

---

## ⭐ Awesome Security Series: Startup Security Guide & LLM CISO

> 🆕 **Published 2026-06-17** -- Essential security guide for startups entering the Korean market

As demonstrated by the Tving, CU, and FastCampus breaches, a single misconfiguration at a startup can cascade into a massive data leak. Foreign startups entering Korea face an additional layer of risk: the Korean **Personal Information Protection Act (PIPA)** imposes requirements that GDPR and CCPA do not -- mandatory CPO for ALL entities, AES-256 encryption, 6-month access logs, prohibition on collecting Resident Registration Numbers, and criminal liability for violations.

This guide integrates stage-gated security checklists, cloud security (AWS/GCP/Azure/Vercel), Google Workspace security, DRM, and KISA compliance into a single resource -- and provides a **prompt system that turns any LLM into a virtual CISO** capable of detecting compliance gaps between GDPR/CCPA and PIPA automatically. Supports both public LLMs (Claude, GPT, DeepSeek) and local LLMs (Ollama, air-gapped).

👉 [**Explore the Startup Security Guide →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

| Language | Guide | LLM CISO Prompts | Dashboard |
|----------|-------|-----------------|-----------|
| 한국어 | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_KR.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_KR.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD.md) |
| English | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_EN.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_EN.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD_EN.md) |

**Key features:**
- **29-item** stage-gated security checklist (Pre-Seed through Series A)
- **25-dimension GDPR vs. CCPA vs. PIPA compliance gap matrix** with LLM auto-detection
- **Cloud security** -- AWS (15 items), GCP (12), Azure (10), Vercel (10)
- **Google Workspace security** -- Gmail/Drive/Docs admin console settings + SPF/DKIM/DMARC
- **DRM & document security** -- Classification, IRM, source code protection, offboarding
- **Incident response** -- NIST SP 800-61 framework + Korea-specific regulatory deadlines
- **LLM CISO persona** -- Ollama local mode for air-gapped sensitive data processing

> *"If your startup is entering the Korean market, read this guide before your first commit."*

---

## 📚 Report Index

> 💡 New reports are added at the **top** of this table on publication. Naming convention: `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`.
> ※ Severity is an indicative, topic-level estimate; each report's own assessment is authoritative.

| Date | ID / Title | Severity | Languages |
| --- | --- | --- | --- |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE_EN.md) — Three simultaneous IBM WebSphere flaws (deserialization RCE · auth bypass) | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JA](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_EN.md) — Citrix NetScaler memory overread mass exploitation (CVE-2026-3055) | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_EN.md) — Iran's use of generative AI in warfare | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [CN](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GREYVIBE's GenAI-armed operation targeting Ukraine | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_EN.md) — MARIMO (advisory weaponization · disclosure-to-exploitation compression) | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [CN](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_EN.md) — JINX | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [CN](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_EN.md) — Gogs Git server vulnerability | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [CN](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_EN.md) — ChatGPhish (ChatGPT impersonation phishing) | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [CN](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_EN.md) — KelpDAO (Web3/DeFi threat) | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_EN.md) — GlassWorm (self-propagating supply chain worm) | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_EN.md) — Gitea CVE vulnerability | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JA](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_EN.md) — AI cryptojacking | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) — UK sanctions on Russian crypto | 🟠 MEDIUM | [KO](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) — Kimsuky (APT43) PebbleDash·AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_EN.md) — Two concurrent threats (LiteSpeed · Shai-Hulud) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) — EDR evasion threat | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) — Windows BitLocker bypass zero-day | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) — North Korea hacking trends 2026 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — GitHub internal repository compromise | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20EN.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Exchange Server vulnerability | 🔴 HIGH | [KR · EN](CTI-2026-0520-EXCHANGE.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) — EvilTokens (AI-generated device-code phishing PhaaS) | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal core max-severity zero-day (no patch) | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) — cPanel hacking | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) — DPRK LLM-enabled hacking / AI cyber-attack & agentic defense | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) — Russian RAT (LNK · RDP) | 🔴 HIGH | [KO](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS side channel | 🟠 MEDIUM | [KO](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) — DPRK Lazarus git-hooks concealment | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Mythos AI vulnerability | 🔴 HIGH | [KR](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) — ScarCruft (APT37) campaign | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — Vibe: The Age of AI Hacking | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub threat analysis | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) — CopyFail (CVE-2026-31431) | 🔴 HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) — Litecoin vulnerability | 🟠 MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20en.MD) — Intelligent & sleeper attacks targeting MCP | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) · [PRESS](CTI-2026-0422-MCP-PRESS_EN.md) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) — Vercel breach (AI SaaS supply chain · ShinyHunters) | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](Analysis%20EN.MD) — Coruna iOS Exploit Kit · cyber-weapon supply chain | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20中文版.md) |

---

## 🗂️ By Category

### 🌐 Supply Chain Attacks
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0527-GLASSWORM` · `CTI-2026-0527-GITEA` · `CTI-2026-0530-GOGS` · `CTI-2026-0524-DUALTHREAT` · `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` · `CTI-2026-0420-VERCEL`

### 🔓 Zero-Day & Vulnerabilities
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0603-NETSCALER` · `CTI-2026-0521-YELLOWKEY` · `CTI-2026-0520-DRUPAL` · `CTI-2026-0520-EXCHANGE` · `CTI-2026-0520-CPANEL` · `CTI-2026-0430-COPYFAIL` · `CTI-2026-0320-CORUNA`

### 🕵️ DPRK & State-Sponsored
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` (APT43) · `CTI-2026-0510-LAZARUS-GITHOOKS` · `CTI-2026-0507-SCARCRUFT` (APT37) · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0514-CTRL_RussianRAT`

### 🤖 AI / LLM Threats
* `CTI-2026-0601-GREYVIBE` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0530-CHATGPHISH` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0520-EVILTOKENS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0514-ChatGPT_DNS_SideChannel` · `CTI-2026-0510-MYTHOS-AI` · `CTI-2026-0505-VIBE` · `CTI-2026-0422-MCP`

### 💰 Web3 & Crypto
* `CTI-2026-0528-KELPDAO` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` · `CTI-2026-0427-LITECOIN`

### 🇰🇷 Korea Cybersecurity Policy
* `CTI-2026-0320-CORUNA` · `CTI-2026-0420-VERCEL` · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0604-WEBSPHERE`

---

## 🧭 Methodology

### Traffic Light Protocol (TLP)
| Label | Meaning | This repo |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | Community-shareable, public | **Default** |
| 🟡 TLP:AMBER | Org-internal only | N/A |
| 🔴 TLP:RED | Named recipients only | N/A |

### Severity
| Grade | Meaning | Response window |
| --- | --- | --- |
| 🔴 **CRITICAL** | National-security / large-scale civilian impact | Immediate |
| 🔴 **HIGH** | Broad industry / ecosystem impact | 24–72h |
| 🟠 **MEDIUM** | Limited to specific firms / groups | Within 7 days |
| 🟡 **LOW** | Awareness / observation | Within 30 days |

### Framework references
* **MITRE ATT&CK** · **NIST SP 800-61** (Incident Response) · **NIST SP 800-207** (Zero Trust) · **STIX/TAXII** · **Mandiant UNC/APT naming**

Each Key Judgment states **High / Medium / Low** confidence, cross-validating primary sources with secondary open CTI.

---

## 📝 Naming Convention

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>
```
* `SUBJECT` — uppercase keyword for the topic
* `LANG` — `KR/KO` · `EN` · `JP/JA` · `CN/ZH`
* `ext` — `md` (default) · `pdf` (formal release)

---

## 🤝 Contact & Contribution

| Channel | Use |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — feedback, corrections, tips |
| **GitHub Issues** | [Open an issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC / reference suggestions |
| **Source protection** | For sensitive tips, use secure channels (Signal, ProtonMail) |

---

## ⚖️ Disclaimer

1. All reports are **independent analyses based on public OSINT and press reporting** and do not represent the official position of any referenced organization.
2. Content is intended **solely for educational, defensive, research, and policy purposes**. Offensive, intrusive, or illegal use is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## 📊 Repository Stats

|  |  |
| --- | --- |
| **Total reports** | 37 (series) |
| **Languages** | 한국어 · English · 日本語 · 中文 |
| **Key threat actors** | Lazarus · Kimsuky (APT43) · ScarCruft (APT37) · ShinyHunters · GREYVIBE · and others |
| **Last update** | 2026-06-04 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
