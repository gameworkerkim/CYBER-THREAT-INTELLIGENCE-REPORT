# Cyber Threat Intelligence Report

> **Independent Cyber Threat Intelligence Archive**
> *OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--20-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

**Language:** [한국어](README.md) · **English** · [日本語](README_JP.md) · [中文](README_CN.md)

This repository is an independent archive of **open-source cyber threat intelligence (CTI) reports**, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization, agency, or nation.

---

## About the Analyst

|  |  |
| --- | --- |
| **Name** | Dennis Kim (Kim HoKwang / 김호광) |
| **Role** | CEO, Betalabs Inc. · Former CEO, Cyworld Z · Independent Threat Intelligence Analyst · Microsoft Azure MVP |
| **Focus Areas** | Web3/blockchain security, supply chain attacks, zero-day ecosystems, North Korean / state-backed threats, AI/LLM security, MCP security |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## Latest Reports — Featured

> **Published 2026-05-20 — Four simultaneous advisories in a single week**

In the third week of May, four high-severity vulnerabilities were disclosed and exploited near-simultaneously. All were published bilingually (Korean + English).

| Report | Highlight | Severity | Download |
| --- | --- | --- | --- |
| **Drupal Core Highly Critical** (`CTI-2026-0520-DRUPAL`) | Unauthenticated remote exploit; "disclosure = attack onset" | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| **Exchange OWA Zero-Day** (`CTI-2026-0520-EXCHANGE`) | CVE-2026-42897, actively exploited, no permanent patch | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| **EvilTokens PhaaS** (`CTI-2026-0520-EVILTOKENS`) | AI-generated device code phishing, defeats MFA | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| **cPanel Auth Bypass** (`CTI-2026-0520-CPANEL`) | CVE-2026-41940, CVSS 9.8, mass exploitation | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |

---

## Report Index — Full Report List

| ID | Date | Title | Severity | Languages |
| --- | --- | --- | --- | --- |
| `CTI-2026-0520-DRUPAL` | 2026-05-20 | Drupal Core Highly Critical Advisory — unauthenticated remote, patch imminent | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| `CTI-2026-0520-EXCHANGE` | 2026-05-20 | Microsoft Exchange OWA Zero-Day (CVE-2026-42897) | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| `CTI-2026-0520-EVILTOKENS` | 2026-05-20 | EvilTokens — AI-Generated Device Code Phishing PhaaS | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| `CTI-2026-0520-CPANEL` | 2026-05-20 | cPanel & WHM Authentication Bypass (CVE-2026-41940) | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |
| `CTI-2026-0520-FAST16` | 2026-05-20 | Fast16 — Pre-Stuxnet precision-computation sabotage malware | HIGH | [EN](CTI-2026-0520-FAST16%20EN.md) · [KR](CTI-2026-0520-FAST16%20KR.md) · [JP](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| `CTI-2026-0517-AICYBER` | 2026-05-17 | AI Cyber Attack & Agentic Defense — North Korea's LLM-enabled hacking | HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) |
| `CTI-2026-0514-CHATGPT-DNS` | 2026-05-14 | ChatGPT DNS Side-Channel Analysis | MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| `CTI-2026-0514-RUSSIAN-RAT` | 2026-05-14 | Russian RAT / LNK·RDP Attack Chain Analysis | MEDIUM | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | 2026-05-10 | North Korea Lazarus — .git/hooks malware campaign | HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| `CTI-2026-0510-MYTHOS` | 2026-05-10 | Mythos AI Vulnerability Analysis | MEDIUM | [MD](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| `CTI-2026-0507-SCARCRUFT` | 2026-05-07 | ScarCruft (APT37) Campaign Analysis | HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| `CTI-2026-0505-VIBE` | 2026-05-05 | Vibe — The Age of AI-Driven Hacking | MEDIUM | [MD](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE.md) · [PDF](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE_%EA%B9%80%ED%98%B8%EA%B4%91.pdf) |
| `CTI-2026-0503-GITHUB` | 2026-05-03 | GitHub RCE Vulnerability (single git push RCE) | HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| `CTI-2026-0430-COPYFAIL` | 2026-04-30 | Copy Fail — Linux Kernel privilege escalation (CVE-2026-31431) | HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| `CTI-2026-0427-LITECOIN` | 2026-04-27 | Litecoin Vulnerability Analysis | MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| `CTI-2026-0422-MCP` | 2026-04-22 | Advanced & Sleeper Attacks on MCP — A Structural Problem? | HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PRESS KR](CTI-2026-0422-MCP-PRESS_KR.md) · [PRESS EN](CTI-2026-0422-MCP-PRESS_EN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| `CTI-2026-0420-VERCEL` | 2026-04-20 | Vercel Breach — AI SaaS supply chain attack & ShinyHunters | HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| `CTI-2026-0320-CORUNA` | 2026-03-20 | Collapse of the Cyber-Weapon Supply Chain — Coruna iOS Exploit Kit | CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

> New reports are added to the **top** of this table on publication. The naming convention is `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`.

---

## By Category

### Supply Chain Attacks

Attacks where the adversary first compromises a "trusted third-party vendor" to gain indirect access to the final target. The fastest-growing category in 2025–2026.

* `CTI-2026-0520-CPANEL` — Mass takeover of hosting infrastructure via cPanel/WHM auth bypass
* `CTI-2026-0503-GITHUB` — GitHub Enterprise RCE via a single git push
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth supply chain breach)
* `CTI-2026-0510-LAZARUS-GITHOOKS` — Developer environment intrusion via .git/hooks

### AI / LLM / MCP Security

Emerging threats that target or weaponize generative AI and agentic infrastructure. A core research track of this archive.

* `CTI-2026-0520-EVILTOKENS` — AI-generated ("vibe coding") device code phishing PhaaS
* `CTI-2026-0517-AICYBER` — North Korea's LLM-enabled hacking and agentic defense
* `CTI-2026-0514-CHATGPT-DNS` — ChatGPT DNS side-channel
* `CTI-2026-0510-MYTHOS` — Mythos AI vulnerability
* `CTI-2026-0505-VIBE` — Vibe, the age of AI-driven hacking
* `CTI-2026-0422-MCP` — Advanced & sleeper attacks targeting MCP

### Mobile & Zero-Day

Nation-grade surveillance tools and commercial exploit kits targeting iOS/Android and core platforms.

* `CTI-2026-0520-DRUPAL` — Drupal core unauthenticated remote (disclosure = attack onset)
* `CTI-2026-0520-EXCHANGE` — Exchange OWA zero-day (CVE-2026-42897)
* `CTI-2026-0430-COPYFAIL` — Linux Kernel privilege escalation (CVE-2026-31431)
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit (CVE-2024-23222)

### Threat Actor Profiles

TTPs, campaigns, and attribution for specific APT groups and cybercrime collectives.

* **Lazarus Group** (North Korea) — `CTI-2026-0510-LAZARUS-GITHOOKS`
* **ScarCruft / APT37** (North Korea) — `CTI-2026-0507-SCARCRUFT`
* **North Korean LLM-enabled threats** — `CTI-2026-0517-AICYBER`
* **ShinyHunters** (UNC6040/UNC6240/UNC6661) — `CTI-2026-0420-VERCEL`
* **UNC6353 · Operation Zero** — `CTI-2026-0320-CORUNA`

### Nation-State Sabotage

Destructive / disruptive cyber weapons with physical-world impact.

* `CTI-2026-0520-FAST16` — Precision-computation tampering malware predating Stuxnet by five years

### Web3 & Crypto

Incidents involving DeFi/CEX/stablecoins, analyzed through Korean (DAXA/KoFIU) compliance lenses.

* `CTI-2026-0427-LITECOIN` — Litecoin vulnerability
* `CTI-2026-0420-VERCEL` §8 — Impact of the Vercel breach on Web3 frontend infrastructure

---

## Methodology

### Traffic Light Protocol (TLP)

| Label | Meaning | This Repository |
| --- | --- | --- |
| **TLP:GREEN** | Shareable within the community, public disclosure permitted | **Default for public reports** |
| **TLP:AMBER** | Limited to internal organizational sharing | Some pre-disclosure advisories |
| **TLP:RED** | Named recipients only | Some active-exploitation reports |

### Severity

| Level | Meaning | Response Time |
| --- | --- | --- |
| **CRITICAL** | Direct threat to national security / large-scale civilian harm | Immediate |
| **HIGH** | Broad impact across an industry or ecosystem | 24–72 hours |
| **MEDIUM** | Limited impact on specific organizations | Within 7 days |
| **LOW** | Awareness / observation level | Within 30 days |

### Framework References

* **MITRE ATT&CK** — TTP mapping standard
* **NIST SP 800-61** — Incident response lifecycle
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — Threat intelligence exchange standards
* **Mandiant UNC/APT naming** — Threat actor clustering

---

## Naming Convention

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

Examples:
  CTI-2026-0520-EXCHANGE.md     -> Published 2026-05-20, Exchange incident (KR+EN combined)
  CTI-2026-0507-SCARCRUFT_KR.md -> ScarCruft analysis, Korean
  CTI-2026-0507-SCARCRUFT_JP.md -> Japanese edition of the same report
```

* `SUBJECT` — uppercase keyword representing the report topic
* `LANG` — `KR` (Korean) / `EN` (English) / `JP` (Japanese) / `CN`·`ZH` (Chinese)
* `ext` — `md` (default) / `pdf` (formal distribution copy)

---

## Contact & Contribution

| Channel | Purpose |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — report feedback, corrections, tips |
| **GitHub Issues** | [Create an issue](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC updates, additional references |
| **Source Protection** | For sensitive tips, please reach out via a secure channel such as Signal or ProtonMail. |

---

## Disclaimer

1. All reports in this repository are **independent analyses based on publicly available OSINT materials and press reporting**, and do not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## Repository Stats

|  |  |
| --- | --- |
| **Total Reports** | 18+ (by series) |
| **Languages** | Korean · English · Japanese · Chinese |
| **Key Threat Actors** | Lazarus · ScarCruft/APT37 · ShinyHunters · UNC6353 · Operation Zero · and others |
| **Core Research Tracks** | AI/LLM/MCP security · Supply chain attacks · North Korean / state-backed threats · Zero-day ecosystems |
| **Last Update** | 2026-05-20 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
