| id             | CTI-2026-0527-GLASSWORM                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | Simultaneous Takedown of GlassWorm C2 Infrastructure — Anatomy of a Self-Propagating Supply Chain Worm Targeting Developers                                                                                        |
| subtitle       | Four-channel C2 combining blockchain, P2P, and legitimate web services, and a supply chain threat spreading to crypto wallets                                                                                      |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | en                                                                                                                                                                                                              |
| tags           | | Supply-Chain | VS-Code-Extension | Self-Propagating-Worm | Crypto-Wallet-Theft | Solana-C2 | Developer-Targeting | | ------------ | ---------------- | --------------------- | ------------------- | --------- | ------------------ | |
| threat\_actors | | GlassWorm operators (likely Russia/CIS-nexus cybercriminals) | | ------------------------------------------------------------ |                                                                                  |
| frameworks     | | MITRE ATT&CK | NIST SP 800-161 (C-SCRM) | SLSA | STIX/TAXII | | ------------ | ------------------------ | ---- | ---------- |                                                                                       |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# Simultaneous Takedown of GlassWorm C2 Infrastructure — Anatomy of a Self-Propagating Supply Chain Worm Targeting Developers

> **Report ID** `CTI-2026-0527-GLASSWORM` · **Published** 2026-05-27 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*Four-channel C2 combining blockchain, P2P, and legitimate web services, and a supply chain threat spreading to crypto wallets*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Incident Overview — What Was Taken Down
3. Attack Mechanism — Four-Channel C2 and Self-Propagation
4. Payload Analysis — Credential and Crypto Wallet Theft
5. Threat Actor Analysis
6. Impact on Korea
7. Impact on the Web3 / Crypto Ecosystem
8. Mitigations
9. IoCs and Detection Indicators
10. Conclusion and Recommendations
11. References

---

## Executive Summary (TL;DR)

On May 27, 2026, CrowdStrike, in partnership with Google and the Shadowserver Foundation, announced the simultaneous disruption of all four command-and-control (C2) channels associated with the self-propagating software supply chain campaign **GlassWorm**. Since at least early 2025, GlassWorm operators have systematically targeted software developers — a population with access to source code repositories, cloud platforms, CI/CD pipelines, and package registries.

The essence of this campaign is not a simple piece of malware but a **force-multiplier structure that uses developer workstations as a beachhead to spread to thousands of downstream organizations and users.** The attackers published trojanized extensions to both the Microsoft VS Code Marketplace and Open VSX, reaching users of VS Code forks such as Cursor, Positron, Windsurf, and VSCodium. Propagation through compromised npm and Python packages was also confirmed.

Most notable is the **four-channel C2 design built for takedown resilience.** It used the memo field of Solana blockchain transactions as a dead drop, queried the BitTorrent DHT P2P network for configuration data, abused Google Calendar event titles as a dead drop, and ran direct connections to commercial VPS infrastructure. This takedown simultaneously neutralized all four channels, so infected hosts can no longer receive new commands or payloads.

### Key Judgments

| #    | Judgment                                                                                                                                                                          | Confidence |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | The core threat of GlassWorm is **chained amplification (blast radius)** through developer environments; the C2 takedown only blocks new command reception, while already-exfiltrated credentials and wallet keys are not recovered. Post-incident cleanup of compromised accounts is essential. | **High**   |
| KJ-2 | The four-channel C2 design combining **blockchain (Solana), P2P (BitTorrent DHT), and legitimate services (Google Calendar)** as dead drops is likely to become a standard for future supply chain malware. Traditional domain-blocking responses cannot neutralize it. | **High**   |
| KJ-3 | The payload's prioritized theft of **GitHub/NPM/OpenVSX tokens and crypto wallets** indicates Web3/blockchain teams are more directly targeted than general software firms. | **High**   |
| KJ-4 | CrowdStrike attributed the activity to likely Russia-based cybercriminals based on the malware terminating on CIS-region hosts and containing Russian-language comments. Given the possibility of code leakage or imitation, however, definitive attribution is premature. | **Medium** |

---

## 1. Incident Overview — What Was Taken Down

CrowdStrike, together with Google and the Shadowserver Foundation, officially announced on May 27, 2026 the simultaneous disruption of all C2 channels associated with GlassWorm. Since its emergence last year, GlassWorm has conducted a "multi-pronged campaign," and is said to have poisoned more than 300 GitHub repositories using stolen developer credentials.

The significance of this incident lies not in eradicating an individual malware strain, but in reaffirming that **the software supply chain itself is one of the most consequential attack surfaces in modern computing.** CrowdStrike assessed that "the barrier to poisoning a package or extension is low, but the potential blast radius is enormous." As long as developer environments, build pipelines, and code repositories remain under-protected, every organization that consumes software inherits the risk of everyone who produces it.

## 2. Attack Mechanism — Four-Channel C2 and Self-Propagation

### 2.1 Distribution Path

GlassWorm published malicious extensions to both major marketplaces — the Microsoft VS Code Marketplace and Open VSX. The key to this dual-publishing strategy is that it **covers the entire VS Code fork ecosystem.** Cursor, Positron, Windsurf, and VSCodium all use Open VSX as their extension source, so a single malicious extension reaches users of multiple AI coding IDEs. In addition, propagation paths through compromised npm and Python packages ran in parallel.

### 2.2 Four-Channel C2 — Takedown-Evasion Design

| # | Channel                       | Mechanism                                                       |
| --- | --------------------------- | --------------------------------------------------------------- |
| ① | **Solana blockchain dead drop** | Stores C2 server addresses in the memo field of blockchain transactions; effectively impossible to censor or block |
| ② | **BitTorrent DHT P2P**          | Queries the distributed hash table P2P network to retrieve configuration data |
| ③ | **Google Calendar dead drop**   | Extracts C2 server addresses from calendar event titles of a legitimate service (disguised as normal traffic) |
| ④ | **Direct commercial VPS**       | Connects directly to C2 infrastructure hosted on commercial VPS providers |

Per CrowdStrike, this structure combining blockchain, P2P, and legitimate web services as resolution layers was designed to be resilient against takedowns — a "dynamic front" hiding the actual C2 servers behind multiple layers of indirection. This joint operation collapsed all four lines at once by neutralizing all channels simultaneously.

## 3. Payload Analysis — Credential and Crypto Wallet Theft

The end goal of GlassWorm attacks is to deliver a data-theft framework with credential harvesting, crypto wallet exfiltration, and system profiling capabilities.

Later iterations deployed a WebSocket-based JavaScript RAT called **GlassWormRAT** to steal web browser data and run arbitrary code. This includes installing a Google Chrome extension that collects sensitive data such as screenshots, keystrokes, and clipboard content.

According to Endor Labs researchers, once active, the malware searches the host for developer credentials (GitHub, NPM, OpenVSX tokens, crypto wallets), enabling further compromise of repositories and package uploads. In other words, **a self-propagation loop is completed** in which one infection leads to new malicious package publishing rights.

Infected hosts are converted into covert infrastructure — SOCKS proxies, hidden VNC (HVNC) servers, and remote execution nodes via WebRTC or spawned Node.js processes. This simultaneously gives attackers anonymized access into corporate and personal networks and a platform to propagate further.

## 4. Threat Actor Analysis

CrowdStrike described the GlassWorm operators as "well-resourced and persistent." Attribution rests on two grounds: first, the malware terminates execution on systems located in CIS (Commonwealth of Independent States) countries; second, the code contains Russian-language comments. On this basis, Russia-based cybercriminals were identified as the likely actor.

This report, however, rates this attribution at **Medium confidence.** CIS-avoidance logic and Russian-language comments are strong circumstantial evidence, but cases exist where threat actors deliberately plant false flags or imitate leaked code.

## 5. Impact on Korea

GlassWorm was barely covered by Korean media, yet it carries direct implications for the domestic development ecosystem.

First, **Korean developers' dependence on VS Code-family IDEs is very high.** AI coding IDEs such as Cursor and Windsurf are spreading rapidly among Korean startups and blockchain teams, and all share the Open VSX extension ecosystem. A single malicious extension can reach many domestic teams simultaneously.

Second, **many domestic firms depend uncritically on public npm/PyPI packages.** Since GlassWorm used compromised packages as a propagation path, domestic CI/CD pipelines are also exposed to indirect poisoning risk.

Third, it shares the same supply chain surface as the **North Korea-linked UNC1069 (Sapphire Sleet) Axios npm compromise** that this analyst noted in the earlier `CTI-2026-0422-MCP` report. As a priority target of North Korea, Korea must address — at the national security level — the possibility that such self-propagating supply chain worms could be modified and reused for social disruption or fund theft.

## 6. Impact on the Web3 / Crypto Ecosystem

Unlike general supply chain malware, GlassWorm makes **Web3 structurally more dangerous,** for three reasons.

First, the payload designates **crypto wallets as an explicit theft target.** Browser-extension wallets (MetaMask, Phantom, etc.) and local wallet files are primary targets.

Second, the C2 infrastructure itself **uses the Solana blockchain as a dead drop.** This symbolizes the collapse of the boundary between attack infrastructure and Web3 infrastructure. Blockchain dev teams using on-chain data query tools find it even harder to distinguish legitimate traffic from malicious C2 traffic.

Third, it dovetails precisely with the **"multisig means we're safe" illusion** this analyst warned about in `CTI-2026-0422-MCP`. If multisig signers use the same VS Code-family IDE on the same host, a single GlassWorm infection collapses the multisig into a single point of failure. Theft of GitHub/NPM tokens can lead directly to hijacking of smart contract deployment rights and frontend deployment pipelines.

## 7. Mitigations

### 7.1 Immediate Actions (assume breach)

1. **Rotate all developer credentials** — revoke and reissue all GitHub, NPM, and OpenVSX Personal Access Tokens. The C2 takedown only blocked new command reception; already-leaked tokens remain valid.
2. **Migrate crypto wallets** — if a wallet was ever on a development machine, immediately move assets to a wallet generated from a new seed. Treat the old wallet as compromised.
3. **Audit VS Code-family extensions** — review the publisher, signature, and recent updates of all installed extensions, and apply a separate verification gate to extensions from Open VSX.
4. **Check browser extensions** — remove unauthorized Chrome extensions (especially those with screenshot/keystroke/clipboard permissions).

### 7.2 Structural Measures

1. **Separate assets from development machines.** Web3 teams should isolate bulk assets in cold wallets / HSM-based multisig, and not install IDEs, extensions, or dev tools on actual signing devices.
2. **Tokenize CI/CD secrets short-term.** Use OIDC-based short-lived tokens and per-environment least-privilege instead of long-lived PATs.
3. **Mandate dependency SBOM and lockfile pinning,** and apply an automatic quarantine period for new npm/PyPI dependencies.
4. **Include on-chain C2 detection in monitoring.** Add non-traditional C2 signals — Solana memo fields, BitTorrent DHT queries, abnormal Google Calendar API calls — as SIEM rules.

## 8. IoCs and Detection Indicators

> ⚠️ This section reflects the time of public disclosure; re-verify the latest threat intelligence before operational use.

| Type            | Indicator / Behavior                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| Malware family  | GlassWorm, GlassWormRAT (WebSocket-based JS RAT)                                   |
| Theft targets   | GitHub/NPM/OpenVSX tokens, crypto wallets, browser data, screenshots/keystrokes/clipboard |
| C2 channels     | Solana transaction memo field, BitTorrent DHT, Google Calendar event titles, commercial VPS |
| Host conversion | Creation of SOCKS proxies, HVNC servers, WebRTC/Node.js remote execution nodes    |
| Evasion traits  | Terminates on CIS-region hosts, Russian-language code comments                    |
| Distribution    | Malicious VS Code Marketplace / Open VSX extensions, compromised npm/Python packages |

## 9. Conclusion and Recommendations

The GlassWorm C2 takedown is a clear defensive win, but also a **compressed warning of how supply chain malware is evolving.** A four-channel C2 combining blockchain, P2P, and legitimate cloud services as dead drops proves that traditional responses relying on single-domain blocking are no longer sufficient.

Key recommendations:

1. **The developer environment is a core asset of the trust boundary.** Compromise of a dev machine equals compromise of the whole organization and all downstream users.
2. **Takedown ≠ recovery.** Already-leaked credentials and wallet keys must be separately invalidated and migrated.
3. Web3 organizations should make **triple isolation of assets, signing rights, and dev environments** the default.
4. Detection of non-traditional C2 (on-chain / P2P / legitimate-service dead drops) must be built into the SOC.

---

## References

[1] Ravie Lakshmanan, "GlassWorm Malware Takedown Disrupts Developer Supply Chain Attack Infrastructure", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/glassworm-malware-takedown-disrupts.html>

[2] CrowdStrike, "Inside CrowdStrike's Takedown of a Developer-Targeting Botnet", 2026-05. <https://www.crowdstrike.com/en-us/blog/inside-crowdstrike-takedown-of-a-developer-targeting-botnet/>

[3] Truesec, "GlassWorm: Self-Propagating VSCode Extension", 2025. <https://www.truesec.com/hub/blog/glassworm-self-propagating-vscode-extension>

[4] Kiran Raj (Endor Labs), "Invisible Threats: GlassWorm Unicode VSCode", Endor Labs. <https://www.endorlabs.com/reports/invisible-threats-glassworm-unicode-vscode>

[5] Dennis Kim, "Sophisticated and Dormant Attacks Targeting MCP — A Structural Problem?", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
