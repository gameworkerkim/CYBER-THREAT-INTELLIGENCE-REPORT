---
title: "Trust Infrastructure Compromise — Four Threats Targeting the AI Development Ecosystem, Collaboration Platforms, and Cloud ML Pipelines (2026.06.16–18)"
document_id: CTI-2026-0618-AISUPPLY
analyst: "Dennis Kim (HoKwang Kim, 김호광)"
affiliation: "CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure MVP"
email: gameworker@gmail.com
github: github.com/gameworkerkim
date: 2026-06-18
tlp: CLEAR
language: en
---

# Trust Infrastructure Compromise

## Four Threats Targeting the AI Development Ecosystem, Collaboration Platforms, and Cloud ML Pipelines

**Document ID:** CTI-2026-0618-AISUPPLY
**Published:** June 18, 2026
**Analyst:** Dennis Kim (김호광 / HoKwang Kim) — CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure ex-MVP
**TLP:** CLEAR
**Reporting Period:** June 16–18, 2026

---

## Executive Summary

This report integrates and restructures, from a Korean cyber threat intelligence (CTI) perspective, **four threats disclosed between June 16 and 18, 2026, by global security research organizations (Aikido Security, ESET, Broadcom Symantec, Palo Alto Networks Unit 42) that received almost no coverage in major Korean media**.

The four incidents target superficially different surfaces (developer IDEs, government agencies, enterprise collaboration infrastructure, cloud ML platforms), but **converge on one paradigm: attackers no longer penetrate from "outside" the security perimeter—they weaponize legitimate infrastructure organizations already trust (JetBrains Marketplace, Microsoft Teams relays, Google Cloud buckets, legitimately signed drivers).** This "Trust Infrastructure Compromise" paradigm structurally neutralizes IP reputation, domain blocking, and signature-based detection.

The hacking trend now is to bypass trusted-platform authentication—or to induce mistakes that achieve the same bypass.

### Key Judgments

| # | Judgment | Confidence |
|---|---|---|
| KJ-1 | The AI development-tool ecosystem (IDE plugins, browser extensions) has emerged as a new primary supply-chain vector for credential theft. The target is not source code but **AI provider API keys themselves**, which have direct monetary value. | High |
| KJ-2 | China-linked actors (FishMonger/I-SOON) ported previously Linux-only tooling to Windows, adding kernel-driver-based stealth and expanding cross-platform espionage capability against government targets. | High |
| KJ-3 | A ransomware group for the first time operationally abused Microsoft Teams TURN relays as a C2 channel. This marks maturation of "legitimate cloud-traffic camouflage" and neutralizes network-monitoring-only defense. | High |
| KJ-4 | Predictable bucket-naming conventions in cloud ML pipelines were again confirmed as a structural vulnerability leading to unauthenticated cross-tenant code execution (the second such case this year). | Medium-High |
| KJ-5 | All four incidents have direct or potential impact on Korean AI development organizations, Web3 infrastructure, and public agencies; new threat modeling focused on **"trusted-channel abuse"** rather than mere "data theft" is urgently needed. | Medium-High |

### Threat Assessment Overview

| Incident | Target | Attribution | Sophistication | Korea Impact |
|---|---|---|---|---|
| **A. Malicious JetBrains AI plugins** | Developer IDE / AI API keys | Unattributed (financial motive) | Upper-medium | **High** |
| **B. SprySOCKS Windows variants** | Government agencies | FishMonger (China-linked, I-SOON) | Top-tier | **Medium** |
| **C. DragonForce Backdoor.Turn** | Enterprises (revenue $15M+) | DragonForce RaaS (Scattered Spider–linked) | Top-tier | **High** |
| **D. Google Vertex AI "Pickle in the Middle"** | Cloud ML pipelines | PoC stage (Unit 42 research) | Upper-medium | **Medium** |

---

## 1. Incident A — 15 Malicious AI Plugins on the JetBrains Marketplace

### 1.1 Overview

On June 16–17, 2026, code-security firm **Aikido Security** disclosed an organized malware campaign comprising 15 malicious IDE plugins operating on the JetBrains Marketplace. The plugins were published under seven different seller accounts, with cumulative downloads of about 70,000. Aikido's findings were independently verified by BleepingComputer through code analysis.

### 1.2 Technical Analysis

The plugins impersonate AI coding assistants based on major LLMs such as DeepSeek, OpenAI, and SiliconFlow, and **actually perform the advertised functions**—chat, commit-message generation, code review, bug detection, unit tests. That legitimate behavior is the core of the threat.

| Item | Detail |
|---|---|
| **Attack vector** | IDE plugin (software supply chain) |
| **Theft target** | OpenAI / DeepSeek / SiliconFlow API keys (plaintext) |
| **Trigger** | When the user enters an API key in the settings panel and clicks "Apply" — no separate permission request, consent screen, or UI indication |
| **Exfiltration** | The save() handler transmits the key to a hardcoded C2 server at the same time it stores it. Uses **unencrypted HTTP** |
| **C2 server** | `39.107.60[.]51` (hardcoded) |
| **First published** | Late October 2025 |
| **Latest variant** | June 10, 2026 |
| **Top downloads** | DeepSeek AI Assist (27,727), CodeGPT AI Assistant (25,571) |

The 15 plugins are essentially the same codebase redistributed with different names and packaging, padded with fake five-star reviews. More notable is the **two-stage monetization model**. Per Aikido, operators resell API keys stolen from free users to paying customers, extracting revenue from both sides while the legitimate key owner bears usage costs.

### 1.3 Threat Assessment

IDEs run with full user privileges and no sandbox, holding source code, cloud credentials, signing keys—and now AI service credentials. Even with JetBrains' manual plugin review, malicious logic obfuscated inside legitimate functionality evaded detection. Sophos breach statistics indicate that 66.5% of ransomware-victim organizations cite identity compromise as the key mechanism for subsequent ransomware execution, suggesting local credential theft becomes an entry point for lateral movement.

> An LLM is a spreadsheet, not an oracle. Likewise, an AI coding plugin is not a trusted colleague but a "dependency running with my privileges." If you do not verify the vendor before pasting a key, that key soon becomes the attacker's asset.

---

## 2. Incident B — SprySOCKS Windows Variants (FishMonger)

### 2.1 Overview

On June 16, 2026, **ESET** disclosed discovery of two previously unpublished Windows variants (`WIN_DRV`, `WIN_PLUS`) of the backdoor **SprySOCKS**, previously known as Linux-only. ESET attributed them with **high confidence** to China-linked threat group **FishMonger** (also tracked as Earth Lusca, Aquatic Panda, TAG-22, Red Dev 10; under the Winnti umbrella). FishMonger is assessed to be operated by Chengdu-based contractor **I-SOON**.

### 2.2 Technical Analysis

ESET telemetry shows real-world activity against government agencies in **Honduras, Taiwan, Thailand, and Pakistan** between 2023 and 2024. Both variants are part of SprySOCKS v1.8, retaining the Linux original's core architecture (C&C protocol, encryption, command-handling logic) while substituting Windows-native mechanisms and strengthening stealth.

| Variant | Execution Technique | Key Features |
|---|---|---|
| **WIN_DRV** | Kernel-driver based | Uses two encrypted kernel drivers. `DriverLoader` (`fsdiskbit.sys`) loads `RawWNPF` (`KW1B5206BDC1743FP.dat`) into memory. Hides processes, network connections, files, and registry keys |
| **WIN_PLUS** | Print Spooler abuse | Starts from `spoolsv.exe`, runs a stage-1 loader as a print processor, then injects the backdoor into a new `svchost.exe`. Relatively simpler |

Both variants communicate as DLLs over **TCP, UDP, and WebSocket** C2 channels and support 30+ commands (system-info collection, process enumeration, service management, file management, SOCKS proxy, interactive shell, etc.).

WIN_DRV's `RawWNPF` driver hooks the `NtQuerySystemInformation` system call to remove matching entries from the hidden-process list in output. It also provides **TCP traffic diversion**, delivering commands to arbitrary TCP ports without exposing the backdoor's real listening port.

### 2.3 Key Risks — Leaked Certificates and UEFI Bootkit Indicators

- **Leaked signing certificate:** `DriverLoader` is signed with a digital certificate leaked from the open-source `PastDSE` project on GitHub, enabling load on some older/misconfigured systems. Per ESET, the certificate does not appear to have been revoked to date.
- **UEFI bootkit indicators:** ESET telemetry limitedly suggests that in some attack scenarios a UEFI bootkit component may abuse **CVE-2023-24932** (the Secure Boot bypass exploited by BlackLotus). Strong evidence was not presented.

> That a state-linked actor targeting government, diplomatic, technology, and telecom institutions ported Linux tooling to Windows and added kernel-level stealth shows mature operational adaptation of the arsenal to target OS diversity.

---

## 3. Incident C — DragonForce "Backdoor.Turn" (Microsoft Teams TURN Relay C2)

### 3.1 Overview

On June 16, 2026, the **Broadcom Symantec Threat Hunter Team** disclosed that ransomware group **DragonForce** used a custom Go-based backdoor `Backdoor.Turn` to hide C2 traffic inside **Microsoft Teams TURN (Traversal Using Relays around NAT) relay infrastructure**. This is the **first known malware** to abuse TURN relays this way in the wild. DragonForce has been active since 2023 as a RaaS (ransomware-as-a-service) operation linked to Scattered Spider, evolving into a cartel-like structure.

### 3.2 Attack Timeline (December 2025, U.S. services company)

| Stage | Action | Technique (MITRE ATT&CK) |
|---|---|---|
| 1. Initial access | Exploit SQL/MSSQL server vulnerability | T1190 (Exploit Public-Facing Application) |
| 2. Privilege escalation / defense evasion | BYOVD — abuse Huawei `HWAuidoOs2Ec.sys` (Havoc Process Terminator) and ABYSSWORKER (Palo Alto driver impersonation) | T1068, T1211 |
| 3. Persistence | Remove Limit Blank Password setting, create new accounts, modify firewall rules | T1098, T1562 |
| 4. C2 establishment | Inject `Backdoor.Turn` into legitimate `DbgView64.exe`. Obtain Teams anonymous visitor token → via legitimate MS TURN relay → real C2 over QUIC session | T1071, T1572 |
| 5. Reconnaissance / lateral movement | LDAP/AD search, credential theft, browser credential theft | T1018, T1003 |
| 6. Impact | Data exfiltration then DragonForce ransomware deployment/encryption | T1486 (Data Encrypted for Impact) |

### 3.3 Technical Sophistication

`Backdoor.Turn` was inspired by Praetorian's "Ghost Calls" technique presented at Black Hat 2025 (stealing temporary TURN credentials from Teams/Zoom to create covert tunnels through trusted meeting infrastructure). The key is that **defenders see only C2 traffic destined for legitimate Teams servers**. Domain reputation, IP blocklists, and application-layer inspection all allow Teams traffic, so classic C2 beacon signs (frequent connections to unknown servers, nonstandard ports, self-signed certificates) disappear.

Notably, attackers abused a Huawei driver vulnerability (Havoc Process Terminator) that was **unknown at the time of compromise**. Huntress documented it only in March 2026 after the breach, suggesting the attackers maintain their own vulnerability-research capability. DragonForce claims 579 cumulative victims since June 2023, focusing on organizations with annual revenue of $15M+ (manufacturing, construction, IT, healthcare, retail).

> It is unusual for a ransomware group to use self-developed tooling at the sophistication of `Backdoor.Turn`. "Trusted-channel camouflage" has become a standard tactic not only for state actors but also for financially motivated criminal organizations.

---

## 4. Incident D — Google Vertex AI SDK "Pickle in the Middle"

### 4.1 Overview

On June 16, 2026, **Palo Alto Networks Unit 42** disclosed a vulnerability in the Google Cloud Vertex AI SDK for Python (`google-cloud-aiplatform`) leading to unauthenticated cross-tenant remote code execution (RCE). Researchers named it **"Pickle in the Middle"** and reported it via Google's bug bounty (VRP). No in-the-wild exploitation was observed; Google completed the patch.

### 4.2 Attack Mechanism

The essence is the combination of **predictable bucket naming + missing ownership verification + unsafe deserialization**.

| Stage | Detail |
|---|---|
| 1. Prediction | If the user does not specify `staging_bucket`, the SDK auto-creates a deterministic bucket name based on project ID and region (e.g., `project-vertex-staging-region`) |
| 2. Bucket squatting | Knowing only the victim's project ID (often public), the attacker preemptively creates the same bucket name in their own project. Because GCS bucket names are globally unique, the victim SDK falls back to the attacker's bucket |
| 3. Model interception | When the victim uploads a model, artifacts are stored in the attacker's bucket |
| 4. Race condition | The attacker's Cloud Function triggers on upload and replaces the legitimate model with a malicious version. Unit 42 measured ~**2.5 seconds** from upload to Vertex AI read; in the PoC the attacker replaced within **1.4 seconds** |
| 5. RCE | When a model serialized with pickle/joblib is loaded, arbitrary code executes inside the Google serving container via `__reduce__` |
| 6. Privilege expansion | Payload steals OAuth tokens from the serving-container metadata server. Access possible to other model artifacts (including training weights) in the same Google-managed tenant, BigQuery metadata, access lists, tenant logs, GKE cluster names, and internal container image paths |

### 4.3 Patch and Recurrence

| Version | Date | Action |
|---|---|---|
| v1.144.0 | 2026-03-31 | Added random uuid4 to bucket names (partial mitigation) |
| v1.148.0 | 2026-04-15 | Added bucket ownership verification to `Model.upload()` (complete fix) |

At disclosure, neither Unit 42 nor Google assigned a separate CVE. Notably, this is the **second** predictable-bucket-name flaw this year. Google patched a separate Vertex AI Experiments bucket-squatting flaw in February 2026 (**CVE-2026-2473**, likewise enabling cross-tenant code execution, model theft, and poisoning).

> Interestingly, Unit 42 integrated LLMs into its code-analysis workflow for this research to accelerate discovery. AI is simultaneously an acceleration layer for both attack and defense.

---

## 5. Korea-Specific Impact Analysis

This section separately analyzes direct and potential impacts of the four incidents on the Korean environment.

### 5.1 Incident A (JetBrains) — Korea Impact: **High**

- Korea is a developer market with very high JetBrains IDE usage (IntelliJ IDEA, PyCharm, WebStorm, etc.), deeply embedded especially in startup, fintech, and gaming Kotlin/Java/Python environments.
- Domestic development organizations actively adopting Claude Code, Cursor, ChatGPT, and similar AI coding tools commonly enter OpenAI/Anthropic/DeepSeek API keys into IDE plugins, creating a direct harm path of **key theft → unauthorized billing → account compromise**.
- Non-English marketplace search habits of installing generic-named plugins ("DeepSeek", "AI Assist") without sufficient verification increase risk.

### 5.2 Incident B (SprySOCKS) — Korea Impact: **Medium**

- Korea was not among the directly targeted countries (Honduras, Taiwan, Thailand, Pakistan), but FishMonger/I-SOON lineages have a history of broadly targeting East Asian governments, universities, and technology firms including Korea.
- Korean institutions in diplomacy, unification, defense, semiconductors, and telecom—priorities for China-linked espionage—may be exposed to the same TTPs (public-server n-day exploitation → kernel-driver stealth → long-term dwell).
- That drivers signed with the leaked `PastDSE` certificate remain unrevoked is an immediate inspection reason for Korean public and research institutions running older/misconfigured Windows servers.

### 5.3 Incident C (DragonForce) — Korea Impact: **High**

- Microsoft Teams is the standard collaboration tool for large Korean enterprises, mid-sized firms, and many public agencies; Teams domains and IP ranges are almost universally whitelisted. **That means Korean organizations' network defenses structurally pass Backdoor.Turn-class traffic.**
- Many Korean mid-sized and large enterprises meet DragonForce's targeting criterion (annual revenue $15M+). Manufacturing-, construction-, and IT-services-centric targeting highly overlaps Korea's industrial structure.
- Network-traffic monitoring and domain-reputation blocking—core to existing Korean security operations—are alone insufficient; a shift to **behavioral detection** is urgent.

### 5.4 Incident D (Vertex AI) — Korea Impact: **Medium**

- Domestic AI startups and finance/healthcare/commerce firms adopting GCP Vertex AI for ML serving face potential model-supply-chain risk.
- Korean enterprises' GCP project IDs are often exposed in public repositories, CI logs, and documentation, easily satisfying bucket-squatting preconditions.
- The patch (v1.148.0) is on the client SDK side, so **SDK version checks across notebooks, CI jobs, and training pipelines—not only production—are required**.

---

## 6. Korea Web3 Industry Impact Analysis

Per request, Web3/blockchain-specific impact is analyzed separately. Web3 is especially vulnerable to these four threats because credentials and code integrity map directly to asset control.

| Incident | Web3 Impact Path | Severity |
|---|---|---|
| **A. JetBrains plugins** | Solidity/Rust/Move smart-contract developers enter more than AI keys in IDEs. The same IDE environment often holds RPC endpoint keys, deployment wallet private keys, Infura/Alchemy API keys, and exchange API keys. If the malicious-plugin pattern of hooking key-entry workflows expands, it leads to **direct on-chain asset theft** | Very high |
| **C. Teams C2** | DAOs, foundations, exchanges, and project teams use Teams/Slack/Discord as operations channels. Covert C2 via trusted collaboration channels becomes an entry point for long-term dwell on multisig signer endpoints → treasury theft scenarios | High |
| **D. Vertex AI** | Model-poisoning risk for projects serving on-chain analytics, trading models, and AI-agent DeFi strategies on GCP Vertex AI. Can lead to false signals and strategy manipulation | Medium |
| **B. SprySOCKS** | If state actors long-term target exchange/foundation core infrastructure, cold-wallet operating procedures and internal key-management systems may be exposed | Medium |

### 6.1 Web3-Specific Recommendations

- **Air-gap signing environment separation:** Physically separate smart-contract deployment keys and multisig signing endpoints from general development IDE environments. Never place private keys where cloud sync or IDE plugins can access them.
- **Key isolation for AI coding tools:** Use AI tools for contract audit and code generation, but do not enter RPC/wallet/exchange keys into unverified marketplace plugins.
- **On-chain anomaly monitoring:** Integrate whitelist withdrawal policies and real-time anomalous-transaction alerts for treasuries and hot wallets as part of behavior-based breach detection.

> "An LLM is a spreadsheet, not an oracle" — in Web3 too, AI tools are verification aids, not trust principals to whom keys and signing authority should be delegated.

---

## 7. Public Sector and Government Impact Analysis

Per request, public/government-specific impact and policy implications are analyzed separately.

### 7.1 Direct Threat Mapping

| Incident | Public/Government Impact | Priority Inspection Targets |
|---|---|---|
| **B. SprySOCKS** | Most direct threat. State-linked actors explicitly target government agencies. Diplomacy, defense, telecom priority | MFA, Unification Ministry, defense-related agencies; public-cloud Windows servers |
| **C. DragonForce** | Public agencies and local governments operating Teams-based administrative collaboration. Covert intrusion via whitelisted collaboration traffic | Collaboration platforms on admin/business networks; endpoints without EDR |
| **A. JetBrains** | Public SI and e-government development organizations; national research institutes' development environments. AI-tool adoption spreading | Government unified development environments; public data-analytics organizations |
| **D. Vertex AI** | Agencies running public AI services and national ML projects in the cloud | Public-cloud AI/ML pipelines |

### 7.2 Policy Implications

- **Integrity audits of national research and administrative infrastructure:** SprySOCKS government targeting and unrevoked leaked certificates require public-sector driver inventory and code-signing verification checks—especially immediate inspection of agencies running older Windows servers.
- **Separate threat modeling for "trusted-channel abuse":** Existing public security focuses on "block external intrusion" and "prevent data leakage." These four threats operate inside the trust boundary via Teams TURN relays, legitimate cloud buckets, and legitimately signed drivers. Behavioral detection and Zero Trust architecture must accelerate at the policy level.
- **Extend supply-chain security to AI tools:** As AI coding tools rapidly enter e-government and public SI development environments, whitelist/verification systems for marketplace plugins and extensions are absent. Allowed-plugin policies for public development environments are needed.
- **Cloud ML governance:** Include cloud SDK version management, model-integrity verification, and explicit staging-bucket designation for public AI services in standard operating procedures.

### 7.3 Public-Sector Immediate Recommendation Checklist

- Inventory unsigned/unidentified kernel drivers on Windows endpoints; enable HVCI (Hypervisor-protected Code Integrity) (SprySOCKS response)
- Hunt for anomalous `TeamsMediaRelay` services, Teams.exe memory anomalies (RWX pages), and outbound TCP to nonstandard ports in MS VPN ranges (DragonForce response)
- Audit JetBrains plugins in development organizations; immediately revoke and reissue suspected AI/RPC API keys (JetBrains response)
- Update `google-cloud-aiplatform` SDK to v1.148.0+; specify explicit `staging_bucket` (Vertex AI response)

---

## 8. Indicators of Compromise

### 8.1 Incident A — Malicious JetBrains Plugins

| Type | Value |
|---|---|
| C2 server IP | `39.107.60[.]51` |
| Representative plugin names | DeepSeek AI Assist, CodeGPT AI Assistant, DeepSeek Git Commit, AI Coder Review, Coding Simple Tool |
| Seller accounts (examples) | CodePilot, StackSmith, ZenCoder (7 accounts total) |
| Behavioral indicator | On API-key save, transmit via unencrypted HTTP to hardcoded server |

### 8.2 Incident B — SprySOCKS Windows Variants

| Type | Value |
|---|---|
| Kernel driver (RawWNPF) | On-disk name `KW1B5206BDC1743FP.dat` |
| Loader driver | `fsdiskbit.sys` (ESET naming "DriverLoader") |
| Signing certificate | Leaked certificate from GitHub `PastDSE` project (unrevoked) |
| Related CVE | CVE-2023-24932 (UEFI bootkit indicator, limited) |
| Internal labels | WIN_DRV, WIN_PLUS (SprySOCKS v1.8) |
| C2 channels | TCP / UDP / WebSocket |
| Behavioral indicators | `NtQuerySystemInformation` hooking, Print Spooler (`spoolsv.exe`) abuse, `svchost.exe` injection |

### 8.3 Incident C — DragonForce Backdoor.Turn

| Type | Value |
|---|---|
| Shellcode (Backdoor.Turn) SHA256 | `ce66b8221446c9b6d83f0ce6382f430e519601641e5daaaf1ca7a8a8806cb0b0` |
| Sideload DLL (VirtualBox impersonation) SHA256 | `f174c19902523dcf005fa044b6598403a5e5c0a5982398d1bc0dcc5ec1cd351b` |
| Vulnerable driver (GameDriverx64) SHA256 | `b6628d201c2a68d2a3de2a87de7a5acfe21b101a97928e1c8d5c82102d967383` |
| BYOVD drivers | Huawei `HWAuidoOs2Ec.sys` (Havoc Process Terminator), ABYSSWORKER |
| Injection target process | `DbgView64.exe` |
| Service name (IOC) | `TeamsMediaRelay` |
| Behavioral indicators | Teams anonymous visitor token → MS TURN relay → QUIC session C2. Outbound to nonstandard ports in MS VPN ranges; Limit Blank Password setting removed |
| Initial access | SQL/MSSQL server vulnerability |

### 8.4 Incident D — Google Vertex AI "Pickle in the Middle"

| Type | Value |
|---|---|
| Affected package | `google-cloud-aiplatform` (Python SDK) |
| Vulnerable versions | 1.139.0, 1.140.0, and others below 1.144.0 |
| Patched versions | v1.144.0 (partial), **v1.148.0 (complete)** |
| Related CVE | CVE-2026-2473 (Vertex AI Experiments, separate Feb 2026 patch) |
| Vulnerable pattern | Deterministic bucket name `<project>-vertex-staging-<region>`, missing ownership verification |
| Behavioral indicators | Model upload to unknown external GCS buckets; OAuth token access to serving-container metadata server |

---

## 9. Integrated Defense and Response Recommendations

### 9.1 Common Principle — Responding to Trust Infrastructure Compromise

The shared lesson of all four incidents is **"trust that is not verified becomes attack surface."** The following principles apply to all:

- **Shift to behavior-based detection:** IP reputation, domain blocking, and signatures are powerless against abuse of legitimate infrastructure. Make detection of anomalous behavior patterns (process injection, anomalous token requests, unexpected data flows) the primary defense line.
- **Zero Trust:** Do not default-trust even legitimate domains, valid signatures, or internal collaboration channels.
- **Non-human identity (NHI) management:** Regular rotation and audit of API keys, service accounts, and tokens. Statistics show only 11.1% of organizations continuously rotate and audit non-human credentials.

### 9.2 Immediate Actions by Incident

| Incident | Immediate Action |
|---|---|
| **A** | Full audit of installed JetBrains plugins. If affected plugins were used, immediately revoke and reissue all AI/RPC/exchange API keys. Audit anomalous regions/volumes in external model-request logs |
| **B** | Flag unsigned/unidentified kernel drivers. Enable HVCI. Check older Windows servers against IOCs. Block drivers signed with the leaked `PastDSE` certificate |
| **C** | Hunt `TeamsMediaRelay` services on all endpoints. Kernel-level block of BYOVD driver CVEs and ABYSSWORKER hashes. Immediately ingest Section 8.3 IOCs into SIEM and edge firewalls. Enable Graph API audit logging |
| **D** | Update `google-cloud-aiplatform` to v1.148.0+ (including notebooks, CI, training pipelines). Specify explicit `staging_bucket`. Introduce model-artifact integrity verification |

---

## 10. Closing — The Weaponization of Trust

These four mid-June 2026 cases were discovered or conducted by different actors (financially motivated criminals, state-linked espionage groups, cartel-style ransomware, academic researchers), but share one zeitgeist. **Attackers no longer climb the wall. They wear the masks of things already trusted inside the wall.**

- JetBrains plugins were dangerous **because they worked normally**.
- SprySOCKS drivers loaded **because they were legitimately signed**.
- Backdoor.Turn was invisible **because it was legitimate Teams traffic**.
- Pickle in the Middle was intercepted **because of legitimate bucket-naming conventions**.

Korea's security paradigm has long concentrated on two axes: "block external intrusion" and "prevent data leakage." What these four cases show is the absence of a third axis — **continuous verification of channels, code, and infrastructure already trusted.** The center of gravity of threat has moved beyond data theft to trusted-channel abuse, outcome manipulation, and long-term dwell.

> For public agencies, Web3 foundations, AI startups, and traditional enterprises alike, the question is the same: **"Among the things we trust, what do we not verify?"** That list is the next breach's attack surface.

---

## Appendix A: References and Sources

- **Aikido Security (2026.06.16):** Ilyas Makari, "Multiple JetBrains IDE plugins caught stealing AI keys"
  - URL: https://www.aikido.dev/blog/multiple-jetbrains-ide-plugins-caught-stealing-ai-keys
- **BleepingComputer (2026.06.16):** "Malicious JetBrains Marketplace plugins steal AI API keys from developers"
- **ESET / WeLiveSecurity (2026.06.16):** Martin Smolár, "Fishmonger's arsenal upgraded: SprySOCKS for Windows"
  - URL: https://www.welivesecurity.com/en/eset-research/fishmongers-arsenal-upgraded-sprysocks-windows/
- **Broadcom Symantec Threat Hunter Team (2026.06.16):** "Hidden in Teams: DragonForce Attackers Weaponize Microsoft Teams Relays to Stay Hidden"
  - URL: https://www.security.com/threat-intelligence/dragonforce-msteams-backdoor
- **Help Net Security (2026.06.16):** "Cybercriminals mask malicious communications through Microsoft Teams relays"
- **Palo Alto Networks Unit 42 (2026.06.16):** "Pickle in the Middle – Hijacking Vertex AI Model Uploads for Cross-Tenant RCE"
  - URL: https://unit42.paloaltonetworks.com/hijacking-vertex-ai-model/
- **The Hacker News (2026.06.16~17):** Follow-on coverage of each incident

---

## Appendix B: Analyst Information and Distribution

| Item | Detail |
|---|---|
| **Analyst** | Dennis Kim (김호광 / HoKwang Kim) |
| **Affiliation** | CEO, Betalabs Inc. (Seoul) / Independent CTI Analyst / Microsoft Azure ex-MVP |
| **Email** | gameworker@gmail.com |
| **GitHub** | github.com/gameworkerkim |
| **Document ID** | CTI-2026-0618-AISUPPLY |
| **TLP** | CLEAR — freely distributable (attribution recommended) |
| **Distribution language** | English (translated from Korean original); Chinese Simplified and Japanese planned |

This report integrates and restructures public analyses by Aikido Security, ESET, Broadcom Symantec, and Palo Alto Networks Unit 42 from the perspective of the Korean cyber threat intelligence community. All technical facts are grounded in the original reports; Korea, Web3, and public-agency impact analysis and policy implications are the analyst's views.

---

*End of Document*
