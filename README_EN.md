# 🛡️ Cyber Threat Intelligence Report

> **🌐 Languages | 言語選択:**
> [🇰🇷 한국어](./README.md) · **🇬🇧 English** · [🇨🇳 中文(簡體)](./README_CN.md) · [🇯🇵 日本語](./README_JP.md)

> **Independent Cyber Threat Intelligence Archive**
> *OSINT-based Defensive Research · Multilingual Distribution*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20CN%20%7C%20JP-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--10-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/commits/main)
[![Reports](https://img.shields.io/badge/Reports-8-orange?style=flat-square)](#-report-index)

---

This repository is an **independent open cyber threat intelligence (CTI) archive** for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization, agency, or government. Core focus areas: **Web3 / blockchain security, AI / MCP security, supply chain attacks, North Korean and state-sponsored threats, and Korean cybersecurity policy**.

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **Name** | Dennis Kim (김호광 / HoKwang Kim) |
| **Role** | CEO, Betalabs Inc. · Independent Threat Intelligence Analyst · Former CEO, Cyworld Z · Long-tenured Microsoft Azure MVP |
| **Specialties** | Web3 & blockchain security · AI / MCP security · supply chain attacks · zero-day ecosystem · North Korean & state-sponsored threats · Korean cybersecurity policy |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |
| **Publication** | [Web3Paper](https://web3paper.net/ko) — Korean / English blockchain media |

---

## ⭐ Latest Report — Featured

> 🆕 **Published 2026-05-10 · Simultaneous 4-language release**

### Lazarus Group's New Concealment Technique: `.git/hooks/` as a Second-Stage Loader for the Contagious Interview / TaskJacker Campaign

The North Korean Lazarus Group (MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima) has introduced a new technique that **conceals the second-stage malware loader of its fake-recruitment campaign inside the `.git/hooks/` directory**. Because this directory is not tracked by git itself, **it never appears in PR diffs, code review, or SAST scans**. Simply running `git pull` is enough for a target's credentials, crypto wallets, and SSH keys to be exfiltrated — without ever executing a single line of code from the cloned repository.

**Key insight:** North Korea is now actively adopting AI LLMs to perform real-time language- and platform-porting for evasion. This is the **5th evolution** of the campaign — npm packages (2022~) → fake video-conferencing tools (2024) → 338-package npm campaign (2025) → VS Code Tasks (2026 Q1) → git hooks.

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0510-LAZARUS-GITHOOKS` |
| **Severity** | 🔴 HIGH — Direct targeting of Korean developers, exchanges, and Web3 entities |
| **TLP** | `TLP:GREEN` |
| **Threat Actor** | Lazarus Group / Famous Chollima / Sapphire Sleet (DPRK Reconnaissance General Bureau) |
| **Cumulative Damage** | $6.75B+ stolen since 2017 (Chainalysis); $2.02B in 2025 alone |
| **Sources** | OpenSourceMalware (primary) + Microsoft, Cisco Talos, Abstract Security cross-verification |

**📄 Report Downloads (4 languages)**

| Language | Markdown | PDF |
| --- | --- | --- |
| 🇰🇷 Korean | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) (official) |
| 🇬🇧 English | [`CTI-2026-0510-LAZARUS-GITHOOKS_EN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | — |
| 🇨🇳 Chinese (Simplified) | [`CTI-2026-0510-LAZARUS-GITHOOKS_CN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | — |
| 🇯🇵 Japanese | [`CTI-2026-0510-LAZARUS-GITHOOKS_JP.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | — |

**📰 Press Release**

* 🇰🇷 [Korean Press Release (1-page summary + Lazarus historical losses + Korean impact + FAQ)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx)

---

## 🗞️ Recent Highlights

### 2026-05-10 · Mythos × CVE-2026-4747 — "AI Did Not Discover New Vulnerabilities; It Made Old Ones Cheap"
A CTI verification of Rival Security's analysis arguing that the FreeBSD NFS RCE Anthropic announced as "the first remote-kernel exploit autonomously discovered by an AI" is in fact a homologous defect to a 19-year-old MIT Kerberos `librpcsecgss` flaw.
[KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md)

### 2026-05-07 · ScarCruft's Total Capture of a Yanbian Gaming Platform
APT37 (DPRK)'s sqgame compromise as a case study of **espionage targeting North Korean defectors and human-rights activists**, with toolchain lineage tracing through the lexical analysis of the codename `zhuagou(抓狗)`.
[KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf)

### 2026-04-30 · Copy Fail (CVE-2026-31431) — Root on Every Major Linux in 732 Bytes
**Discovered by Theori's Lee Tae-yang with AI assistance from Xint Code**. A 9-year-old Linux kernel privilege escalation with a container-escape primitive.
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD)

### 2026-04-27 · Litecoin MWEB Zero-Day Incident
Quantitative analysis of the **13-block reorg, silent patch, and fork-chain structural risks**. The Litecoin Foundation's CVD violations and implications for exchange and ETF governance.
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf)

---

## 📚 Report Index

| ID | Date | Title | Severity | Languages | Downloads |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | 2026-05-10 | Lazarus Group's `.git/hooks/` Concealment Technique — Contagious Interview / TaskJacker Campaign | 🔴 HIGH | KR · EN · CN · JP | [KR](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [Press KR](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) | 2026-05-10 | AI Did Not Discover New Vulnerabilities — It Made Old Ones Cheap (Mythos × CVE-2026-4747 × CVE-2007-3999) | 🔴 HIGH | KR | [KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) |
| [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_EN.md) | 2026-05-07 | ScarCruft's Total Capture of a Yanbian Gaming Platform — APT37's sqgame Compromise & Defector-Targeted Espionage | 🔴 HIGH | KR · EN · JP | [KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | Copy Fail (CVE-2026-31431) — Root on Every Major Linux in 732 Bytes; 9-Year-Old Kernel LPE + Container Escape | 🔴 CRITICAL | KR | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | Litecoin MWEB Zero-Day Incident — Quantitative Analysis of 13-Block Reorg, Silent Patch & Fork-Chain Structural Risk | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) | 2026-04-22 | Targeted & Sleeper Attacks on MCP — A Structural Problem? | 🔴 HIGH | KR · EN · CN · JP | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) · [CN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) · [JP](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) · [PDF](./CTI-2026-0422-MCP_KR.pdf) · [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) · [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel Security Breach — AI SaaS Supply Chain Attack & ShinyHunters Threat Assessment | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Vercel_%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%89%E1%85%A1%E1%84%80%E1%85%A5%E1%86%AB_%E1%84%87%E1%85%AE%E1%86%AB%E1%84%89%E1%85%A5%E1%86%A8%E1%84%85%E1%85%B5%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | The Collapse of the Cyber Weapons Supply Chain & National Security — A Coruna iOS Exploit Kit Case Study | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 New reports are added to the **top** of this table at publication time. See [Naming Convention](#-naming-convention).

---

## 🗂️ By Category

### 🤖 AI Security · MCP · LLM
Security risks of AI agents, Model Context Protocol (MCP), and LLM-based systems. Sleeper attack models, model supply chain poisoning, and the economics of AI-assisted vulnerability discovery.

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — Verifying Claude Mythos's "combinatorial creativity" hypothesis & the collapse of vulnerability economics
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) — North Korea's AI-LLM-driven real-time language and platform porting pattern
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) — MCP structural RCE, Sleeper MCP, Web3 wallet attack surface, and bias-injection attacks

### 🌐 Supply Chain Attacks
Attacks where adversaries breach a trusted third-party vendor rather than the final target. The fastest-growing category in 2025–2026 since SolarWinds and Salesloft–Drift.

* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) — Lazarus × fake recruitment × `.git/hooks/` concealment (developer workstation infiltration)
* [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_EN.md) — APT37 × sqgame gaming platform compromise (defector-targeted)
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) — MCP supply chain × Axios NPM compromise (UNC1069) × marketplace poisoning
* [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth supply chain breach)

### 🐧 Kernel & Infrastructure Vulnerabilities
Defects targeting the Trusted Computing Base — Linux kernel, hypervisors, container runtimes — and their cross-distribution and cross-environment impact.

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — FreeBSD NFS RCE (CVE-2026-4747) and its homology with MIT Kerberos (CVE-2007-3999)
* [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) — Copy Fail (CVE-2026-31431); 9-year-old Linux kernel LPE + container escape primitive

### 📱 Mobile & Zero-Day Threats
Analysis of state-grade surveillance tools and commercial exploit kits targeting iOS, Android, and other mobile platforms.

* [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) and the cyber-weapons supply chain

### 💰 Web3 & Crypto Ecosystem
Breaches and incidents in DeFi, centralized exchanges, stablecoins, and NFT marketplaces; Korean compliance perspectives (DAXA, KoFIU, the Specific Financial Information Act).

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) — Recommendations for protecting deploy keys at DAXA exchanges and Web3 issuers
* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) — Litecoin MWEB zero-day, 13-block reorg, exchange & ETF governance implications
* [`CTI-2026-0422-MCP §4`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) — Single-machine risk in MCP-wallet integrations and external-escrow design principles
* [`CTI-2026-0420-VERCEL §8`](./CTI-2026-0420-VERCEL_EN.md) — How the Vercel breach affects Web3 frontend infrastructure
* [`CTI-2026-0320-CORUNA §4`](./CTI-2026-0320-CORUNA_KR.md) — The zero-day market ecosystem and crypto-based payment structures

### 🕵️ Threat Actor Profiles
TTPs, campaigns, and attribution information for specific APT groups and cybercrime syndicates.

* **Lazarus Group / Famous Chollima / G1052** (DPRK; cumulative $6.75B+ in crypto theft) — [CTI-2026-0510-LAZARUS-GITHOOKS](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md)
* **APT37 / ScarCruft / RedAnt** (DPRK; defector & human-rights activist targeting) — [CTI-2026-0507](./CTI-2026-0507-SCARCRUFT_EN.md)
* **UNC1069 / Sapphire Sleet** (DPRK-aligned; supply chain poisoning) — [CTI-2026-0422 §3.3](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD)
* **ShinyHunters** (UNC6040 / UNC6240 / UNC6661 / UNC6671) — [CTI-2026-0420 §5](./CTI-2026-0420-VERCEL_EN.md)
* **UNC6353 · UNC6691 · Operation Zero** — [CTI-2026-0320 §3](./CTI-2026-0320-CORUNA_KR.md)

### 🇰🇷 Korea Cybersecurity Policy
Threat analyses and policy recommendations for Korean government, public agencies, and defense industry.

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5, §8`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) — Joint advisory by DAXA / KISA / NIS / KoFIU and LinkedIn Korea takedown channel recommendations
* [`CTI-2026-0507-SCARCRUFT §7`](./CTI-2026-0507-SCARCRUFT_EN.md) — Defector / activist protection regime and gaming-platform monitoring recommendations
* [`CTI-2026-0422-MCP §3.3`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) — DPRK MCP supply chain poisoning and the case for elevating MCP to a national-security agenda
* [`CTI-2026-0320-CORUNA §6–§8`](./CTI-2026-0320-CORUNA_KR.md) — Structural weaknesses of Korea's cyber security architecture and the "Cyber Security New Deal" proposal

---

## 📰 Press Releases

To support timely use by journalists, editors, and researchers, each report has a press-release companion summarizing key statistics, quotes, FAQs, and contacts. All press releases are released under `TLP:GREEN` and may be freely cited (attribution required).

| Report | Korean | English |
| --- | --- | --- |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | [Press KR (docx)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) | — |
| `CTI-2026-0422-MCP` | [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) | [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |

---

## 📡 Distribution Channels

Reports are also available through the following channels:

| Channel | Use | Link |
| --- | --- | --- |
| **GitHub (this repo)** | Primary publication, full-version source | [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| **Web3Paper** | Korean / English analytical columns | [web3paper.net/ko](https://web3paper.net/ko) |
| **LinkedIn** | English column summaries with industry implications | *(profile link forthcoming)* |
| **Facebook** | Korean current-affairs commentary & discussion | *(profile link forthcoming)* |

> 📩 **Citation & redistribution policy**: All reports are released under `TLP:GREEN` and may be freely cited. **Attribution is required**: `Dennis Kim, 김호광, gameworker@gmail.com / https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT`.

---

## 🧭 Methodology

All reports in this archive follow these standards.

### Traffic Light Protocol (TLP) Classification

| Label | Meaning | This Repo |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | Limited disclosure to the community, public sharing permitted | **Default for this repo** |
| 🟡 TLP:AMBER | Limited internal sharing | Not used |
| 🔴 TLP:RED | Personal-disclosure only | Not used |

### Severity Ratings

| Level | Meaning | Response Window |
| --- | --- | --- |
| 🔴 **CRITICAL** | Direct national-security or large-scale civilian impact | Immediate |
| 🔴 **HIGH** | Wide industry- / ecosystem-level impact | 24–72 hours |
| 🟠 **MEDIUM** | Limited impact on specific organization classes | Within 7 days |
| 🟡 **LOW** | Awareness or observational | Within 30 days |

### Confidence Levels

Each Key Judgment is annotated with **High / Medium-High / Medium / Low** confidence, with primary sources cross-validated against secondary press and public CTI material. Lexical and circumstantial inferences are explicitly flagged as such.

### Frameworks Referenced

* **MITRE ATT&CK** (Enterprise + Mobile) — TTP mapping standard
* **NIST SP 800-61** — Incident response lifecycle
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX / TAXII** — Threat intelligence exchange standard
* **Mandiant UNC / APT naming** — Threat actor clustering
* **Traffic Light Protocol 2.0** (FIRST.org) — Information sharing classification

---

## 📝 Naming Convention

```
CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>

Main reports:
  CTI-2026-0510-LAZARUS-GITHOOKS_KR.md  → 2026-05-10, Korean Markdown
  CTI-2026-0510-LAZARUS-GITHOOKS_EN.md  → English version of the same incident
  CTI-2026-0422-MCP_KR.pdf              → Korean PDF official copy

Derivative documents (using SUBTYPE):
  CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx → Korean press release
  CTI-2026-0422-MCP-PRESS_EN.md                → English press release
```

* `SUBJECT` — Keyword for the report topic (uppercase; multi-word linked with hyphens).
* `SUBTYPE` — Optional. Distinguishes documents derived from the main report (`PRESS`, `BRIEF`, `SLIDES`, etc.).
* `LANG` — `KR` (Korean) / `EN` (English) / `JP` (Japanese) / `CN` (Chinese, simplified).
* `ext` — `md` (default) / `pdf` (official copy) / `docx` (editable).

> ⚠️ **Legacy filename note**: Some early reports were uploaded with space-encoded filenames (e.g., `Cti%202026%200422%20mcp%20kr.MD`). New reports follow the standard above; older filenames will be normalized progressively.

---

## 🤝 Contact & Contribution

| Channel | Use |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — Feedback, corrections, tips, press inquiries |
| **GitHub Issues** | [Open an issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC updates, reference additions |
| **Source protection** | Sensitive tips (especially related to defector / activist security) should reach me via Signal, ProtonMail, or other secure channels. |

This repository is a personal research project. Pull requests are welcome, though edits to report bodies are reviewed conservatively.

---

## ⚖️ Disclaimer

1. All reports in this repository are **independent analyses based on publicly available OSINT material and press reporting** and do not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. Some analyses (especially toolchain lineage and lexical inferences) are based on circumstantial cues and are explicitly flagged as non-conclusive attribution.
5. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## 📊 Repository Stats

|  |  |
| --- | --- |
| **Total reports** | **8** |
| **Languages covered** | Korean, English, Chinese (Simplified), Japanese |
| **Threat actors / research areas tracked** | Lazarus Group / Famous Chollima · APT37 / ScarCruft · UNC1069 / Sapphire Sleet · ShinyHunters · UNC6353 · UNC6691 · Operation Zero · TeamPCP · others |
| **CVEs covered** | 15+ (CVE-2026-31431, CVE-2026-4747, CVE-2007-3999, CVE-2024-23222, MCP series — 6 CVEs, etc.) |
| **Multilingual lineup** | LAZARUS-GITHOOKS (4 languages) · MCP (4 languages) · SCARCRUFT (3 languages) · VERCEL · LITECOIN (2 languages each) |
| **Press releases** | 3 (KR×2 · EN×1) |
| **Last update** | 2026-05-10 |

---

> **🌐 Languages | 言語選択:**
> [🇰🇷 한국어](./README.md) · **🇬🇧 English** · [🇨🇳 中文(簡體)](./README_CN.md) · [🇯🇵 日本語](./README_JP.md)

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/) · [web3paper.net](https://web3paper.net/ko)

> *"Every time defenders close one channel, Lazarus moves to a deeper one within six months." — CTI-2026-0510-LAZARUS-GITHOOKS*
> *"AI did not create new vulnerabilities — it collapsed the cost of finding old ones." — CTI-2026-0510-MYTHOS*
> *"732 bytes can topple a decade of trust." — CTI-2026-0430*
> *"With MCP, the question is not 'use it or not' but 'what to install it alongside.'" — CTI-2026-0422*
> *"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
