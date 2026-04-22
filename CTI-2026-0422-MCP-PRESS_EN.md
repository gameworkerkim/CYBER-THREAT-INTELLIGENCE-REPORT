---
id: CTI-2026-0422-MCP-PRESS
type: "Press Release"
title: "[PRESS RELEASE] Independent CTI Report on MCP Structural RCE, Sleeper Attacks, and North Korean Supply-Chain Risks Published"
report_ref: "CTI-2026-0422-MCP"
issued_by: "Dennis Kim (김호광 / HoKwang Kim) · Independent Threat Intelligence Analyst"
date: "2026-04-22"
embargo: "Immediate release"
lang: en
classification: "TLP:GREEN"
license: "Quotable with attribution (CC BY-NC-SA 4.0)"
---

# [PRESS RELEASE] Independent CTI Report on MCP Structural RCE, Sleeper Attacks, and North Korean Supply-Chain Risks Published

**— 2026-04-22, For Immediate Release —**

## Headline Findings

- Anthropic's Model Context Protocol (MCP) carries a **design-level remote command execution (RCE) flaw**, and Anthropic has declined to patch the protocol, calling the behavior *"expected."*
- The scale: **150+ million downloads**, **7,000+ publicly accessible MCP servers**, **up to 200,000 vulnerable instances**, and **6 related CVEs**, all rooted in the same root cause.
- The report reframes this not as a single vulnerability but as a **supply-chain and national-security-level structural threat**. It positions the 2026-03-31 **Axios NPM compromise by North Korea-nexus UNC1069 (Sapphire Sleet)** as the precursor case for the "Sleeper MCP" threat model.

---

## 1. Publication Overview

| Item | Details |
|---|---|
| Report title | **Advanced and Dormant Attacks Targeting MCP — Is This a Structural Problem?** |
| Report ID | `CTI-2026-0422-MCP` |
| Publication date | April 22, 2026 |
| Classification | `TLP:GREEN` (may be shared and quoted freely) |
| Severity | 🔴 HIGH — combined supply-chain and national-security threat |
| Author | Dennis Kim (김호광 / HoKwang Kim), Independent Threat Intelligence Analyst |
| Primary distribution | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| Languages | Korean · English · Chinese · Japanese (Markdown) / Korean PDF |
| References | 24 cross-verified external sources (OX Security, Google GTIG, Microsoft, PNAS, arXiv, etc.) |

---

## 2. Core Findings

### (1) MCP's Flaw Is Design, Not a Bug

According to OX Security's April 2026 report, Anthropic's official MCP SDKs (Python, TypeScript, Java, Rust) execute the OS command string passed via STDIO as a subprocess, and the command runs **before** the MCP handshake check. When the handshake fails, the user sees a friendly error, but the attacker's arbitrary command has already executed on the host. Default MCP deployments ship without sandboxing, input sanitization, or allowlists.

OX Security successfully demonstrated live command execution against six production platforms with paying customers. The flaw propagates through every implementation built on the official SDK — including AI IDEs such as **Cursor, VS Code, Windsurf, Claude Code, and Gemini-CLI**, and open-source frameworks such as **LangFlow, Flowise, LiteLLM, LangChain, and LettaAI**.

### (2) Six Related CVEs

`CVE-2025-49596` (MCP Inspector) · `CVE-2025-54136` (Cursor) · `CVE-2025-54994` (`@akoskm/create-mcp-server-stdio`) · `CVE-2026-22252` (LibreChat) · `CVE-2026-22688` (WeKnora) · `CVE-2026-30615` (Windsurf, zero-click).

### (3) The Most Dangerous Future Attack Class — the "Sleeper MCP"

Combining Anthropic's own *Sleeper Agents* paper (arXiv:2401.05566, 2024) with Microsoft's *Trigger in the Haystack* (2026), the report describes a future in which **an MCP server behaves normally for months and then branches malicious only when a specific trigger (date, environment variable, or conversational keyword) is met**. This is a race between discovery and *trigger*, not between discovery and patch. Among millions of deployed instances, a single successful trigger can propagate through what is already a single point in the supply chain.

### (4) A Direct Link to North Korean Supply-Chain Operations — a National-Security Issue

The **March 31, 2026 Axios NPM compromise** has been publicly attributed by Google Threat Intelligence Group and Microsoft Threat Intelligence to the North Korea-nexus actor **UNC1069** (Microsoft designation: **Sapphire Sleet**). The malicious versions were live on the registry for only three hours, but during that window roughly 3% of the 100-million-weekly-downloads axios userbase was exposed. The actor delivered the cross-platform **WAVESHAPER.V2 RAT** to Windows, macOS, and Linux via a malicious dependency named `plain-crypto-js`.

The report argues that this incident demonstrates every technique the Sleeper MCP threat model requires — **registry takeover, post-install hooks, multi-platform payload dispatch, and self-destruction** — has already been industrialized by DPRK operators. Short-term, this capability is likely to be iterated against MCP-adjacent packages in South Korea and other priority states. Medium to long term, the design objective extends beyond financial theft toward **perception manipulation, policy distortion, and ultimately the "doomsday attack" scenarios** framed around inter-state total warfare.

### (5) Web3's Specific Exposure — the Multi-Sig Illusion

Most Web3 projects publicly claim multi-sig protection (Gnosis Safe and similar). In practice, two or three signers often share **the same host OS**, the same browser profile, and the same MetaMask / Phantom / Rabby extension stack. With MCP installed on that same host, a single compromised MCP collapses multi-sig into a **single point of failure**. Google Cloud's December 2025 analysis already warned that most cryptocurrency MCP servers assume an *"inject the private key into the agent"* model — the exact attack surface highlighted by the 2026 **OpenClaw / ClawJacked** incidents.

### (6) The RCE-Free Attack — Bias Injection and Decision Drift

MCP does not need code execution to be dangerous. By controlling the sources of LLM context, MCP can weaponize **confirmation bias, anchoring, and framing** to produce **decision drift** over months to years. Knipper et al. (2025) report average cognitive-bias susceptibility of 17.8–57.3% across major LLMs, and PNAS 2025 shows that LLMs do not merely reproduce human bias — they **amplify** it. MCP audits, the report argues, must therefore include **information-diversity metrics**, not just security logs.

---

## 3. Recommendations (Summary)

1. **All MCP servers are untrusted by default.** No production deployment without signing, sandboxing, and allowlists.
2. **Bulk treasury must live in external escrow** — custodial accounts, cold wallets, HSM-backed multi-sig — that MCP cannot reach. Do **not** install MCP or AI extensions on signing hardware.
3. **Multi-sig must be distributed across machines, networks, and physical locations.** Multi-sig on a single host is not multi-sig.
4. **MCP is a recurring-audit object.** Review SBOM, CVEs, semantic drift, canary responses, and information diversity at least quarterly.
5. **For policymakers:** integrate MCP supply-chain verification into public-sector AI procurement, and treat the DPRK-adjacent sleeper MCP scenario as a national-cybersecurity agenda item, not merely a product-security bug.

---

## 4. Quotable Comments (Author: Dennis Kim)

> *"The MCP problem is not one vendor's mistake. It is the first settlement of the structural trade-off the AI agent ecosystem accepted in exchange for speed. The real question is no longer whether to use MCP, but which isolation, verification, and audit layers must be installed alongside it."*

> *"The most dangerous attacks are not the ones detonating today. They are the ones seeded to detonate months from now. North Korea has already matured those techniques in the Axios incident, and MCP is precisely the soil in which those techniques will thrive."*

> *"For every Web3 company and every ordinary startup in Korea, the single most important thing to do is to move treasury funds into an external escrow that MCP cannot touch. The word 'multi-sig' is meaningless if those signatures are produced on the same laptop."*

---

## 5. Press FAQ

**Q1. Is this report an attack on Anthropic?**
A. It is not. The report analyzes the structural risk that Anthropic's publicly stated *"expected behavior"* position creates for every downstream participant in the ecosystem. All findings are cross-verified against OX Security's original research and 23 additional external sources.

**Q2. What is the single most important action an ordinary company should take right now?**
A. Three steps: (1) build an SBOM of every MCP server installed on developer machines, (2) reduce operational hot-wallet balances below one day's throughput and move the rest to external escrow, (3) remove MCP and AI extensions from any device that holds signing authority.

**Q3. Is there direct evidence linking UNC1069 to MCP attacks?**
A. The report explicitly frames UNC1069's Axios NPM compromise as **a precedent demonstrating operational maturity of supply-chain techniques**, not as a confirmed MCP attack. Because MCP shares the same distribution surface (npm/pip, postinstall hooks, multi-platform payloads), technique portability to MCP is assessed as highly likely.

**Q4. What can governments and regulators actually do?**
A. The most immediate and practical measure is to require MCP-server SBOM submission and sleeper-trigger pre-detection as part of public-sector and financial-sector AI procurement. Full policy recommendations are in §7 of the main report.

**Q5. May we quote this report? Are there royalty or licensing requirements?**
A. The report is distributed under **TLP:GREEN / CC BY-NC-SA 4.0**. It may be quoted freely in news coverage, blogs, and academic work, provided the author and report ID are cited. Commercial use requires prior consultation with the author.

---

## 6. Report Downloads

| Language | Format | Link |
|---|---|---|
| 🇰🇷 Korean | Markdown | [`CTI-2026-0422-MCP_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_KR.md) |
| 🇰🇷 Korean | PDF (reference copy) | [`CTI-2026-0422-MCP_KR.pdf`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_KR.pdf) |
| 🇬🇧 English | Markdown | [`CTI-2026-0422-MCP_EN.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_EN.md) |
| 🇨🇳 Chinese (Simplified) | Markdown | [`CTI-2026-0422-MCP_CN.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_CN.md) |
| 🇯🇵 Japanese | Markdown | [`CTI-2026-0422-MCP_JP.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_JP.md) |

---

## 7. About the Author

**Dennis Kim (김호광 / HoKwang Kim)** is an independent cyber threat intelligence analyst based in Seoul. He is the former CEO of Cyworld Z, the current CEO of Betalabs Inc., and was named a Microsoft Azure MVP from 2015 to 2023. His research areas include Web3 and blockchain security, software supply-chain attacks, zero-day ecosystem analysis, DPRK and state-aligned threat actors, and the emerging AI / MCP attack surface.

- **Email**: [gameworker@gmail.com](mailto:gameworker@gmail.com)
- **GitHub**: [github.com/gameworkerkim](https://github.com/gameworkerkim)
- **CTI archive**: [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*This press release and the underlying report are independent analyses based on publicly available OSINT materials and press reporting, and do not represent the official position of any referenced organization.*

---

© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division · `TLP:GREEN`
