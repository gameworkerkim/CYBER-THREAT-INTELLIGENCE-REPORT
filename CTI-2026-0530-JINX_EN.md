| id             | CTI-2026-0530-JINX                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | JINX-0164 — A macOS Malware & Supply-Chain Threat Actor Targeting Crypto Firms                                          |
| subtitle       | LinkedIn social engineering, AUDIOFIX & MINIRAT, and the @velora-dex/sdk npm supply-chain compromise                    |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | en                                                                                                                     |
| tags           | Crypto-Targeting · macOS-Malware · Supply-Chain · Social-Engineering · CI-CD-Abuse · DPRK-Adjacent                    |
| threat_actors  | JINX-0164 (financially motivated · DPRK-cluster TTP overlap, no infra overlap)                                         |
| cve            | N/A (threat-actor campaign · npm supply chain)                                                                          |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Wiz cluster naming                                                |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# JINX-0164 — A macOS Malware & Supply-Chain Threat Actor Targeting Crypto Firms

> **Report ID** `CTI-2026-0530-JINX` · **Published** 2026-05-30 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LinkedIn social engineering, AUDIOFIX & MINIRAT, and the @velora-dex/sdk npm supply-chain compromise*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Threat Actor Profile — JINX-0164
3. Attack Chain — from LinkedIn to CI/CD
4. Malware Analysis — AUDIOFIX & MINIRAT
5. Supply-Chain Compromise — @velora-dex/sdk
6. Similarities and Differences vs. DPRK clusters
7. Korea Perspective — threat assessment for exchanges & Web3 dev teams
8. Detection & Mitigation
9. Conclusion
10. References

---

## Executive Summary (TL;DR)

On May 28, 2026, Wiz (CIRT & Research) disclosed a previously undocumented threat actor, **JINX-0164**, targeting cryptocurrency organizations to facilitate digital-asset theft. The cluster has been active **since at least mid-2025** and focuses almost entirely on **macOS**.

The flow is: (1) LinkedIn-based recruitment/business-proposal social engineering to approach developers → (2) lure to a fake meeting page impersonating Microsoft Teams etc. → (3) download a custom macOS RAT → (4) steal credentials and wallet data → (5) move laterally from the compromised employee laptop to **code-distribution systems and CI/CD infrastructure**. The actor has further demonstrated **npm supply-chain compromise** capability.

The actor shares TTPs with North Korean clusters such as BlueNoroff, Contagious Interview, and UNC1069 (Sleet), but shows **no infrastructure overlap**; Wiz classified it as a financially motivated cluster without attributing it to a state sponsor.

### Key Judgments

| #    | Judgment                                                                                                                  | Confidence      |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | JINX-0164 precisely targets **crypto developers** by combining recruitment-lure social engineering with custom macOS malware. The target role is clear. | **High**        |
| KJ-2 | Beyond mere endpoint theft, it makes **lateral movement to CI/CD and code-distribution infrastructure** a core objective — supply-chain-oriented, amplifying one compromise into many downstream ones. | **High**        |
| KJ-3 | The trojanization of `@velora-dex/sdk` 4.9.1 is a proof case of **turning a legitimate DeFi toolkit into an infection vector**; a shell script fetches MINIRAT at import time. | **High**        |
| KJ-4 | TTP similarity and Astrill VPN use to DPRK clusters are observed, but **attribution is unresolved due to lack of infrastructure overlap**. Imitation and independent-cluster possibilities should be held in parallel. | **Medium**      |
| KJ-5 | Korean exchanges, Web3 builders, and DeFi teams are exposed to the **same attack surface** due to high macOS adoption and active LinkedIn recruiting. Risk is amplified where multisig/hot-wallet keys coexist on dev endpoints. | **Medium-High** |

---

## 1. Threat Actor Profile — JINX-0164

| Item | Value |
| --- | --- |
| Designation | JINX-0164 (Wiz naming) |
| Active since | At least mid-2025 |
| Motivation | Financial gain — digital-asset theft |
| Targets | Cryptocurrency orgs / developers (macOS-focused) |
| Core malware | AUDIOFIX (Python), MINIRAT (Go) |
| C2 | HTTPS comms, shared infrastructure (e.g., `datahub[.]ink`) |
| Auxiliary tools | Astrill VPN, etc. |
| Attribution | Unresolved (DPRK-cluster TTP overlap, no infra overlap) |

JINX-0164 operates **highly credible fake LinkedIn profiles** (realistic employment histories and connections); some accounts were hijacked or created solely for the campaign and later deleted. Researchers (Wiz's Shira Ayal et al.) consolidated multiple intrusion investigations into a single named cluster.

---

## 2. Attack Chain — from LinkedIn to CI/CD

| Stage | Action | Detail |
| --- | --- | --- |
| ① Approach | LinkedIn business/recruitment proposals | Build trust, then send a fake meeting invite |
| ② Lure | Fake conferencing page | Spoofed domains impersonating Microsoft Teams etc. |
| ③ Infection | Download & run macOS RAT | Masquerades as `coreaudiod` (system audio driver), saved as `ChromeUpdater`, executed via `launchctl` |
| ④ Theft | Harvest sensitive data via Python malware | Credentials from password managers, browsers, iCloud Keychain; local admin creds; SSH keys; config/console history; crypto wallet & extension info; active Discord/Slack/Telegram sessions |
| ⑤ Spread | Lateral move to CI/CD & code-distribution infra | Inject AUDIOFIX payloads; modify source code to compromise more endpoints and steal wallet credentials |

The crux is stage ⑤. JINX-0164 treats the compromised developer laptop **not as an endpoint but as a springboard**. The goal is to reach code-distribution systems and dev infrastructure, amplifying one compromise into many downstream ones.

---

## 3. Malware Analysis — AUDIOFIX & MINIRAT

**AUDIOFIX** — a compiled Python binary that performs broad automated information theft. It masquerades as the system audio driver (`coreaudiod`), is saved under the filename `ChromeUpdater`, and runs via `launchctl`. Stolen data includes: credentials from password managers, web browsers, and iCloud Keychain; local admin credentials; SSH keys; config/console history files; crypto browser-extension info and wallet addresses; active Discord, Slack, and Telegram sessions.

**MINIRAT** — a lightweight Go-based backdoor. It does not perform AUDIOFIX's broad automated theft but provides **persistent remote access, command execution, and file movement**. Both malware families communicate with C2 over HTTPS and share common infrastructure (e.g., `datahub[.]ink`). The malware identifies the OS and then downloads an architecture-specific payload.

---

## 4. Supply-Chain Compromise — @velora-dex/sdk

On April 7, 2026, JINX-0164 conducted a supply-chain operation by trojanizing the npm package **`@velora-dex/sdk` 4.9.1**. This package is a legitimate DeFi toolkit used for token swaps, limit orders, and delta trading on the VeloraDEX decentralized exchange.

The malicious version **appended three lines** to `dist/index.js` so that whenever the package was imported, it downloaded a shell script from a remote server. That script delivered the macOS-specific binary **MINIRAT**. (This compromise was earlier observed and disclosed by SafeDep and StepSecurity.)

The essence of this technique is **turning a trusted codebase into an infection vector**. The normal act of a developer pulling in a legitimate dependency becomes the infection trigger. In some cases, the **source code itself was modified** to enable further credential theft, particularly of cryptocurrency wallets.

---

## 5. Similarities and Differences vs. DPRK clusters

| Comparison | JINX-0164 | DPRK clusters (BlueNoroff · Contagious Interview · UNC1069) |
| --- | --- | --- |
| Targets | Crypto / developers | Same |
| Social engineering | Recruitment/business lures | Same (Contagious Interview-like) |
| Platform | macOS-focused | Includes macOS, multi-platform |
| VPN | Uses Astrill VPN | Many Astrill VPN cases |
| Spoofing-domain types | Similar | Similar |
| **Infrastructure overlap** | **None** | — |

The similarities in TTPs, tooling, and targeting are pronounced, but Wiz did not link it to publicly tracked North Korean groups due to **no confirmed infrastructure overlap**. This report therefore holds **both** possibilities open — (a) an independent financially motivated cluster imitating DPRK TTPs, or (b) an unidentified, still infrastructure-separated linkage — and recommends further observation. Premature state attribution risks misattribution.

---

## 6. Korea Perspective — threat assessment for exchanges & Web3 dev teams

Implications of a JINX-0164-style threat in the Korean context:

- **macOS prevalence** — Korean exchange and Web3 startup dev teams have high macOS adoption, exactly matching this campaign's target platform.
- **LinkedIn recruiting exposure** — active recruiting/networking widens the social-engineering entry point. "A meeting invite from an overseas recruiter" is a common pattern, so vigilance is often lax.
- **Key-coexistence risk** — where wallet extensions, hot-wallet keys, SSH keys, and CI tokens coexist on a dev endpoint, a single endpoint compromise spreads simultaneously to asset theft and supply-chain poisoning.
- **Supply-chain trust** — adopting external npm/SDK dependencies without verification leaves Korean DeFi/infra projects directly exposed to `@velora-dex/sdk`-style compromise.

---

## 7. Detection & Mitigation

1. **Social-engineering awareness** — classify the "LinkedIn recruiter meeting link → install/run conferencing app" pattern as high-risk; block execution of installers from unverified domains.
2. **macOS behavioral detection** — monitor `launchctl` persistence, `coreaudiod`/`ChromeUpdater` masquerade processes, and anomalous HTTPS C2 (e.g., `datahub[.]ink`-class) via EDR.
3. **Supply-chain verification** — apply version pinning, hash verification, `postinstall` hook audits, and SBOM management to npm/SDK dependencies. If you have used `@velora-dex/sdk`, immediately check exposure to 4.9.1.
4. **Key isolation** — separate wallet-signing authority and hot-wallet keys from dev endpoints; move them to dedicated signing devices (cold/hardware) — tied to `CTI-2026-0422-MCP` §4 recommendations.
5. **CI/CD integrity** — apply commit signing, runner isolation, and artifact signing to detect tampering during lateral movement.
6. **IOC blocking** — add shared C2 infrastructure and spoofed domains to blocklists (see Wiz Technical Annex for latest IOCs).

---

## 8. Conclusion

JINX-0164 sits precisely at the intersection of the 2026 threat landscape: "crypto + macOS + supply chain." The pattern it shows — seizing developer endpoints via recruitment lures, moving to CI/CD, and weaponizing trusted packages — targets not a single organization but the **trust chain of the entire ecosystem**.

State attribution remains unresolved, and that uncertainty is itself instructive. As DPRK TTPs are commercialized and imitated and spread, defenders should focus less on *"who did it"* and more on *"which trust was abused."* Recruitment trust, package trust, dev-infrastructure trust — these three are the targets of this campaign and, equally, the starting points of defense.

---

## References

[1] Wiz CIRT & Wiz Research (Shira Ayal et al.), "Threat Actor Targets Crypto Organizations — JINX-0164", Wiz Blog, 2026-05. <https://www.wiz.io/blog/threat-actors-target-crypto-orgs>

[2] Ravie Lakshmanan, "JINX-0164 Targets Cryptocurrency Firms with Fake Recruiter Lures and macOS Malware", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/jinx-0164-targets-cryptocurrency-firms.html>

[3] "New Threat Actor Jinx-0164 Targets Crypto Developers on macOS", Infosecurity Magazine, 2026-05. <https://www.infosecurity-magazine.com/news/jinx-0164-crypto-developers-macos/>

[4] "JINX-0164 Threat Actor Using LinkedIn Social Engineering to Deploy Custom macOS Malware", Cyber Security News, 2026-05. <https://cybersecuritynews.com/jinx-0164-threat-actor-using-linkedin-social-engineering/>

[5] "JINX-0164 Uses LinkedIn Lures to Deploy Custom macOS Malware", GBHackers, 2026-05. <https://gbhackers.com/jinx-0164-uses-linkedin-lures/>

[6] SafeDep & StepSecurity, "@velora-dex/sdk 4.9.1 npm supply chain compromise (MINIRAT)", 2026-04 (cited by Wiz).

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
