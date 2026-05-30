# 🛡️ Cyber Threat Intelligence Report

> **Independent Cyber Threat Intelligence Archive**
> *OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)
![Last Update](https://img.shields.io/badge/Last%20Update-2026--05--30-informational?style=flat-square)

🌐 **Languages:** [한국어](README.md) · **English** · [中文](README_CN.md) · [日本語](README_JP.md)

This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization, agency, or government.

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **Name** | Dennis Kim (김호광 / HoKwang Kim) |
| **Role** | CEO, Betalabs Inc. · Independent Threat Intelligence Analyst |
| **Focus** | Web3/blockchain security, supply chain attacks, the zero-day ecosystem, North Korean/state-nexus threats, AI/LLM security |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Reports — Featured

> 🆕 **Published 2026-05-30** — four threats not covered by Korean media, released simultaneously in four languages (KR·EN·JP·CN)

### 1. AI Agent at the Wheel — The First Observed LLM-Driven Intrusion

*From Marimo CVE-2026-39987 pre-auth RCE to internal DB exfiltration: a four-stage autonomous pivot in under an hour*

Sysdig TRT's **first recorded "AI-agent-driven" intrusion**. Starting from a pre-auth RCE on an exposed Marimo notebook, an LLM agent autonomously ran the whole chain — cloud credential theft → SSH key retrieval from AWS Secrets Manager → pivot via SSH bastion → full internal PostgreSQL dump.

| Item | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0530-MARIMO` |
| **Severity** | 🔴 CRITICAL |
| **CVE** | `CVE-2026-39987` (CVSS 9.3 · CISA KEV) |
| **Download** | [🇰🇷 KR](CTI-2026-0530-MARIMO_KR.md) · [🇬🇧 EN](CTI-2026-0530-MARIMO_EN.md) · [🇯🇵 JP](CTI-2026-0530-MARIMO_JP.md) · [🇨🇳 CN](CTI-2026-0530-MARIMO_CN.md) |

### 2. Unpatched Critical RCE — Gogs git rebase Argument Injection

*A 9.4 flaw letting any authenticated user seize a self-hosted Git server, plus cross-tenant compromise*

A malicious branch name injects the `--exec` flag into `git rebase`, executing arbitrary code on the server. **Unpatched** since the maintainer report (2026-03-17), with a public Metasploit module available.

| Item | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0530-GOGS` |
| **Severity** | 🔴 HIGH |
| **CVE** | None assigned (Rapid7-rated CVSS 9.4) |
| **Download** | [🇰🇷 KR](CTI-2026-0530-GOGS_KR.md) · [🇬🇧 EN](CTI-2026-0530-GOGS_EN.md) · [🇯🇵 JP](CTI-2026-0530-GOGS_JP.md) · [🇨🇳 CN](CTI-2026-0530-GOGS_CN.md) |

### 3. JINX-0164 — A macOS Malware & Supply-Chain Threat Actor Targeting Crypto Firms

*LinkedIn social engineering, AUDIOFIX & MINIRAT, and the @velora-dex/sdk npm supply-chain compromise*

A financially motivated cluster that seizes developer endpoints via LinkedIn recruitment lures, then moves to CI/CD and code-distribution infrastructure. TTP overlap with DPRK clusters, but no infrastructure overlap (Wiz).

| Item | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0530-JINX` |
| **Severity** | 🔴 HIGH |
| **Threat Actor** | JINX-0164 (DPRK-TTP overlap, no infra overlap) |
| **Download** | [🇰🇷 KR](CTI-2026-0530-JINX_KR.md) · [🇬🇧 EN](CTI-2026-0530-JINX_EN.md) · [🇯🇵 JP](CTI-2026-0530-JINX_JP.md) · [🇨🇳 CN](CTI-2026-0530-JINX_CN.md) |

### 4. ChatGPhish — A ChatGPT Renderer Trust Flaw That Turns AI Summaries Into a Phishing Surface

*Implicit trust of Markdown links & images, indirect prompt injection, and the QR-code pivot*

The `chatgpt.com` renderer trusts Markdown links/images from a summarized third-party page, auto-loading them and surfacing them as clickable elements. Enables phishing, fake system alerts, QR pivots, and IP/UA/Referer leakage (Permiso Security).

| Item | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0530-CHATGPHISH` |
| **Severity** | 🟠 MEDIUM |
| **CVE** | None assigned (Bugcrowd report; vendor replied "could not reproduce") |
| **Download** | [🇰🇷 KR](CTI-2026-0530-CHATGPHISH_KR.md) · [🇬🇧 EN](CTI-2026-0530-CHATGPHISH_EN.md) · [🇯🇵 JP](CTI-2026-0530-CHATGPHISH_JP.md) · [🇨🇳 CN](CTI-2026-0530-CHATGPHISH_CN.md) |

### 5. KelpDAO LayerZero Bridge Hack — A Single Point of Failure in Off-Chain Verification Infrastructure

*Structural weaknesses of cross-chain bridge security and the centralization risk of off-chain verifiers*

Analysis of a compromise on a LayerZero-based bridge path, examining how a **single point of failure in off-chain verification infrastructure** — not the on-chain contracts — leads directly to asset theft.

| Item | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0528-KELPDAO` |
| **Severity** | 🔴 HIGH |
| **Category** | Web3 / cross-chain bridge security |
| **Download** | [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇯🇵 JP](CTI-2026-0528-KELPDAO_JA.md) · [🇨🇳 CN](CTI-2026-0528-KELPDAO_ZH.md) |

---

## 📚 Report Index — Full List

> 💡 New reports are added to the **top** of this table at publication. Naming convention: `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`.

| ID | Date | Title | Severity | Languages |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_EN.md) | 2026-05-30 | AI-agent-driven intrusion — Marimo CVE-2026-39987 + autonomous LLM pivot | 🔴 CRITICAL | KR·EN·JP·CN |
| [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_EN.md) | 2026-05-30 | Unpatched Gogs git rebase argument injection RCE (CVSS 9.4) | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_EN.md) | 2026-05-30 | JINX-0164 — macOS malware & supply-chain threat targeting crypto | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_EN.md) | 2026-05-30 | ChatGPhish — ChatGPT renderer trust flaw (indirect prompt injection) | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_EN.md) | 2026-05-28 | KelpDAO LayerZero bridge hack — single point of failure in off-chain verification | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_EN.md) | 2026-05-27 | GlassWorm — self-propagating VS Code/OpenVSX supply-chain worm | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_EN.md) | 2026-05-27 | Gitea vulnerability analysis | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_EN.md) | 2026-05-27 | AI cryptojacking campaign analysis | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) | 2026-05-26 | Kimsuky (APT43) PebbleDash & AppleSeed — new analysis | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) | 2026-05-26 | UK sanctions on Russian crypto — trends | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_EN.md) | 2026-05-24 | Two Concurrent Threats — analysis | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_EN.md) | 2026-05-22 | EDR evasion threat analysis (EDR3) | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_EN.md) | 2026-05-21 | YellowKey — Windows BitLocker bypass zero-day | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_EN.md) | 2026-05-21 | North Korea hacking trends 2026 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub internal repository breach analysis | 🔴 HIGH | KR |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20EN.md) | 2026-05-20 | FAST16 analysis report | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Exchange Server vulnerability | 🔴 HIGH | KR·EN |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI-generated device-code phishing PhaaS | 🔴 HIGH | KR |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupal core critical zero-day (no patch) | 🔴 CRITICAL | KR |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel compromise analysis | 🔴 HIGH | KR |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_EN.md) | 2026-05-17 | North Korea's LLM-enabled hacking — agentic defense | 🔴 HIGH | KR·EN |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNS side channel | 🟠 MEDIUM | KR |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | Russian RAT (LNK/RDP) | 🔴 HIGH | KR |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | 2026-05-10 | North Korea Lazarus git hooks abuse | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Mythos AI vulnerability analysis | 🔴 HIGH | EN |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_EN.md) | 2026-05-07 | ScarCruft (APT37) analysis | 🔴 HIGH | KR·EN·JP |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | Vibe — The Age of AI Hacking | 🟠 MEDIUM | KR |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub threat analysis | 🔴 HIGH | KR |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | CVE-2026-31431 'Copy Fail' vulnerability | 🔴 HIGH | KR |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20en.MD) | 2026-04-27 | Litecoin vulnerability analysis | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20en.MD) | 2026-04-22 | Intelligent & sleeper attacks targeting MCP — a structural problem | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_EN.md) | 2026-04-20 | Vercel breach — AI SaaS supply chain & ShinyHunters | 🔴 HIGH | KR·EN |
| [`CTI-2026-0320-CORUNA`](Analysis%20EN.MD) | 2026-03-20 | Collapse of the cyber-weapons supply chain — Coruna iOS Exploit Kit | 🔴 CRITICAL | KR·EN·CN |

> ℹ️ Titles/severities for some older entries are derived from archive filenames and commit messages; verify against the report body.

---

## 🗂️ By Category

### 🤖 AI & LLM Security

* `CTI-2026-0530-MARIMO` — LLM-agent-driven autonomous intrusion (first observed)
* `CTI-2026-0530-CHATGPHISH` — ChatGPT renderer trust flaw / indirect prompt injection
* `CTI-2026-0527-AICRYPTOJACK` — AI cryptojacking
* `CTI-2026-0517-AICYBER` — North Korea's LLM-enabled hacking / agentic defense
* `CTI-2026-0422-MCP` — intelligent & sleeper attacks on MCP

### 🌐 Supply Chain Attacks

* `CTI-2026-0530-JINX` — JINX-0164 macOS / npm (@velora-dex/sdk)
* `CTI-2026-0530-GOGS` · `CTI-2026-0527-GITEA` — self-hosted Git server RCE
* `CTI-2026-0527-GLASSWORM` — self-propagating VS Code/OpenVSX worm
* `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` — GitHub repository breaches
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters

### 🕵️ Threat Actor Profiles

* `CTI-2026-0530-JINX` — JINX-0164 (financially motivated, DPRK-TTP overlap)
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` — Kimsuky (APT43)
* `CTI-2026-0510-LAZARUS-GITHOOKS` — Lazarus
* `CTI-2026-0507-SCARCRUFT` — ScarCruft (APT37)
* `CTI-2026-0521-DPRK-TRENDS` — North Korea hacking trends

### 💰 Web3 & Crypto

* `CTI-2026-0528-KELPDAO` — KelpDAO LayerZero bridge hack
* `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` — crypto sanctions trends
* `CTI-2026-0427-LITECOIN` — Litecoin vulnerability

### 🪟 Endpoint, OS & Zero-Day

* `CTI-2026-0521-YELLOWKEY` — Windows BitLocker bypass zero-day
* `CTI-2026-0520-DRUPAL` — Drupal core zero-day
* `CTI-2026-0520-EXCHANGE` — Exchange Server vulnerability
* `CTI-2026-0522-EDR3` — EDR evasion
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit

---

## 🧭 Methodology

### Traffic Light Protocol (TLP)

| Label | Meaning | This repo |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | Community-shareable, public | **Default** |
| 🟡 TLP:AMBER | Internal sharing only | N/A |
| 🔴 TLP:RED | Named recipients only | N/A |

### Severity

| Level | Meaning | Response time |
| --- | --- | --- |
| 🔴 **CRITICAL** | National-security / large-scale civilian impact | Immediate |
| 🔴 **HIGH** | Broad industry/ecosystem impact | 24–72h |
| 🟠 **MEDIUM** | Limited to specific orgs | Within 7 days |
| 🟡 **LOW** | Awareness/observation | Within 30 days |

### Framework References

* **MITRE ATT&CK** / **MITRE ATLAS** — TTP & AI-threat mapping
* **NIST SP 800-61** — incident-response lifecycle
* **NIST SP 800-207** — Zero Trust Architecture
* **NIST AI RMF** / **OWASP LLM Top 10** — AI/LLM risk management
* **STIX/TAXII** — threat-intelligence exchange
* **Mandiant/Wiz UNC & cluster naming** — threat-actor clustering

---

## 📝 Naming Convention

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

Examples:
  CTI-2026-0530-MARIMO_KR.md   → published 2026-05-30, Marimo, Korean Markdown
  CTI-2026-0530-MARIMO_EN.md   → English edition of the same event
  CTI-2026-0528-KELPDAO_ZH.md  → KelpDAO event, Chinese edition
```

* `SUBJECT` — uppercase keyword representing the topic
* `LANG` — `KR/KO` (Korean) / `EN` (English) / `JP/JA` (Japanese) / `CN/ZH` (Chinese)
* `ext` — `md` (default) / `pdf` (formal distribution)

---

## 🤝 Contact & Contribution

| Channel | Purpose |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — feedback, corrections, tips |
| **GitHub Issues** | [Open an issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC updates, reference suggestions |
| **Source protection** | For sensitive tips, please use secure channels such as Signal/ProtonMail. |

---

## ⚖️ Disclaimer

1. All reports are **independent analyses based on publicly available OSINT materials and press reporting**, and do not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## 📊 Repository Stats

|  |  |
| --- | --- |
| **Total reports** | 33+ |
| **Languages** | Korean · English · Japanese · Chinese |
| **Observed threat actors** | JINX-0164 · Lazarus · Kimsuky (APT43) · ScarCruft (APT37) · ShinyHunters · UNC6353 · and others |
| **Last update** | 2026-05-30 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
