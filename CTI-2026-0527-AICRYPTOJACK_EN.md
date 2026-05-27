| id             | CTI-2026-0527-AICRYPTOJACK                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | Cryptojacking Abusing AI Chatbot Recommendations — A New Delivery Vector Beyond Search Poisoning                                                                                                                    |
| subtitle       | LLM-recommended download links lead to malicious sites; a GPU-targeting mining, remote-access, and ransomware composite campaign                                                                                   |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | en                                                                                                                                                                                                              |
| tags           | | AI-Search-Poisoning | Cryptojacking | LLM-Recommendation | DLL-Sideloading | ScreenConnect | GPU-Mining | | ------------------- | ------------ | ----------------- | --------------- | ------------ | ---------- | |
| threat\_actors | | Unattributed (GPU-mining-motivated financial actor) | | --------------------------------------------------- |                                                                                |
| frameworks     | | MITRE ATT&CK (T1574 DLL Side-Loading · T1496 Resource Hijacking · T1219 Remote Access) | NIST SP 800-83 | | -------------------------------------------------------------------------------------- | ------------- | |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# Cryptojacking Abusing AI Chatbot Recommendations — A New Delivery Vector Beyond Search Poisoning

> **Report ID** `CTI-2026-0527-AICRYPTOJACK` · **Published** 2026-05-27 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LLM-recommended download links lead to malicious sites; a GPU-targeting mining, remote-access, and ransomware composite campaign*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Campaign Overview — The Rise of AI Search Poisoning
3. Attack Chain Analysis — From DLL Side-Loading to Mining
4. Target Selection — Maximizing GPU Mining Yield
5. Impact on Korea
6. Impact on the Web3 / Crypto Ecosystem
7. Mitigations
8. IoCs and Detection Indicators
9. Conclusion and Recommendations
10. References

---

## Executive Summary (TL;DR)

On May 26, 2026, Microsoft Defender Experts and the Microsoft Defender Security Research Team warned of an active cryptojacking campaign that uses interactions with AI chatbots as a mechanism for surfacing malicious download sites. Microsoft characterized this as "an emerging delivery technique that extends social engineering beyond conventional search results and increases the visibility of malicious software recommendations."

The campaign impersonates legitimate system utilities such as CrystalDiskInfo, HWMonitor, Display Driver Uninstaller, FurMark, K-Lite Codec Pack, and PDFgear. The targets are owners of high-performance GPUs — a strategy of **selecting systems with high mining value** rather than indiscriminate mass infection. More than 150 malicious domains have been identified.

The campaign's goals do not stop at mining. The threat actors establish persistent remote access to compromised hosts via ScreenConnect deployments, which can lead to follow-on activity such as data theft, lateral movement, or ransomware. Initially they poisoned search engines via SEO poisoning, but variants observed since April 2026 have evolved such that **when a user asks an LLM-based tool for software download recommendations, attacker-controlled domain links are presented within the generated response.**

### Key Judgments

| #    | Judgment                                                                                                                          | Confidence |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | **AI search poisoning** is a direct extension of traditional SEO poisoning, and because of the LLM's halo of trust, user click-through is likely higher than from search results. It is the fastest-growing future malware delivery vector. | **High**   |
| KJ-2 | The essential risk of this campaign is not mining but **persistent remote access via ScreenConnect**. Mining is merely the immediate monetization; the same access can pivot to data theft or ransomware. | **High**   |
| KJ-3 | High-performance GPU targeting suggests that **crypto miners, AI researchers, gamers, and blockchain developers** are the priority victim pool. This means the Web3/AI community is a direct target. | **Medium-High** |
| KJ-4 | With sophisticated evasion — DLL side-loading, process hollowing, Defender exclusion registration, and halting mining when analysis tools are detected — ordinary users find it hard to detect on their own. | **High**   |

---

## 2. Campaign Overview — The Rise of AI Search Poisoning

The attack begins when users search for trusted system utilities and hardware-monitoring software on search engines. Malicious sites, gamed via SEO poisoning, surface at the top of the results.

However, in variants observed since April 2026, the entry path has shifted. When users **ask AI chatbots for software download recommendations, attacker-controlled domain links are presented within the generated responses.** Microsoft, while noting this is based on observed patterns and correlated data, assessed that it is consistent with the emerging technique of AI search result poisoning — an extension of traditional SEO poisoning beyond conventional search engines.

Each malicious site has a prominent download button that retrieves a ZIP archive from a campaign-specific subdomain of `gleeze[.]com`, an infrastructure associated with Dynu, a dynamic DNS provider frequently used by threat actors. More than 150 malicious domains have been identified serving the malicious tools.

## 3. Attack Chain Analysis — From DLL Side-Loading to Mining

| Step | Behavior                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------- |
| ①    | User downloads ZIP → contains a legitimate executable + a malicious DLL (`autorun.dll`)            |
| ②    | On launch, `autorun.dll` is **side-loaded** → installs a second malicious DLL (`vcredist_x64.dll`) via `msiexec.exe` |
| ③    | `vcredist_x64.dll` is a **ScreenConnect installer package** → continuously attempts contact with `193.42.11[.]108` (attacker server) |
| ④    | The ScreenConnect session serves as a conduit for executing `SimpleRunPE.exe`                       |
| ⑤    | **Persistence** via Registry Run keys / scheduled tasks, Microsoft Defender exclusion registration, anti-analysis checks, and **process hollowing** to run mining code |
| ⑥    | In some compromises, a PowerShell script fetches the binary from a remote drive, stores it disguised as `vlc.exe`, creates a scheduled task, then deletes itself |
| ⑦    | The hollowed binary communicates with the attacker server, transmits host info, downloads the appropriate miner archive at runtime, and executes it |

Three miners are supported: **gminer, lolMiner, SRBMiner-MULTI.** The binary recreates persistence artifacts and re-configures Defender exclusions to resist removal. It also watches running processes and immediately terminates the miner if any of these analysis tools are detected — `taskmgr.exe`, `processhacker.exe`/`processhacker2.exe`, `procexp.exe`/`procexp64.exe`, `systeminformer.exe`. This is a classic technique to halt mining when a user opens Task Manager to look for anomalies.

## 4. Target Selection — Maximizing GPU Mining Yield

This campaign is more deliberate than typical cryptocurrency mining efforts. Instead of indiscriminate mass infection, it **strategically opts for endpoints that maximize GPU mining yield.** That all the impersonated software (CrystalDiskInfo, HWMonitor, FurMark, Display Driver Uninstaller, etc.) is favored by high-performance GPU users supports this.

Critically, the campaign's goals are not merely financially motivated. The threat actors establish persistent remote access to compromised hosts via ScreenConnect, which can be leveraged for follow-on activity such as data theft, lateral movement, or ransomware.

## 5. Impact on Korea

This campaign was barely covered by Korean media, yet it is especially dangerous for domestic users.

First, **AI chatbot usage in Korea is surging.** As users increasingly ask LLMs "Where do I download X?" instead of using search engines, the attack surface of AI search poisoning is expanding rapidly.

Second, **Korea has a thick base of high-performance GPU owners.** Gamers, AI/deep-learning researchers, crypto miners, and blockchain developers — GPU-intensive user groups — are precisely this campaign's targets. The impersonated utilities (HWMonitor, FurMark, etc.) are also standard recommendations in Korean PC communities.

Third, **abuse of legitimate remote management tools (RMM) like ScreenConnect** is easily mistaken for normal traffic by domestic security solutions, delaying detection. When mining runs under a Microsoft-signed binary via process hollowing, even some EDRs — let alone ordinary users — may miss it.

## 6. Impact on the Web3 / Crypto Ecosystem

The Web3/AI community falls into this campaign's **primary target group.**

First, **blockchain developers and miners operate high-performance GPU workstations.** They are precisely the "high mining-value systems" the campaign targets, and they often keep crypto wallets, node keys, and deployment credentials on the same machine.

Second, persistent remote access via ScreenConnect can extend beyond mere mining to **wallet theft, seed extraction, and transaction tampering.** The "single machine concentrating assets, signing rights, and dev tools" structure this analyst warned about in `CTI-2026-0422-MCP` is abused directly.

Third, **abuse of AI chatbot tool recommendations** is a real-world case of the "bias injection / recommendation manipulation" threat this analyst covered in the MCP report. The trust mediated by the LLM becomes the attack surface itself, and groups like Web3 developers who frequently explore new tools face greater exposure.

## 7. Mitigations

### 7.1 Users / Individual Developers

1. **Always download software directly from official sites.** Do not blindly trust download links from AI chatbots or search results; verify the domain directly (bookmarking official domains is recommended).
2. **Verify the digital signature** of downloaded executables, and suspect side-loading if a ZIP contains a legitimate EXE alongside an unknown DLL.
3. **Monitor abnormal GPU utilization / heat.** Since the miner halts when analysis tools run, observe background heat/fan noise without opening Task Manager.
4. **Separate crypto wallets from GPU-work machines.** Do not keep hot wallets on mining/rendering/gaming machines.

### 7.2 Organizations / SOC

1. **Establish RMM tool policy** — detect and block unauthorized installs of ScreenConnect, AnyDesk, TeamViewer. Apply behavior-based rules distinguishing legitimate RMM from abuse.
2. **Detect DLL side-loading** — add EDR rules for abnormal-path loading of `autorun.dll`, `vcredist_x64.dll`, and abnormal DLL installation behavior by `msiexec.exe`.
3. **Monitor Defender exclusion tampering** — alert on unauthorized additions to the Defender exclusion list.
4. **Detect process hollowing** — watch for Microsoft-signed binaries executing code from abnormal memory regions.
5. **Block malicious infrastructure** — add `gleeze[.]com` subdomains, `193.42.11[.]108`, and suspect Dynu dynamic-DNS domains to blocklists.

## 8. IoCs and Detection Indicators

> ⚠️ This section reflects the time of public disclosure; re-verify the latest threat intelligence before operational use.

| Type             | Indicator                                                                |
| ---------------- | ------------------------------------------------------------------------ |
| Impersonated SW  | CrystalDiskInfo, HWMonitor, Display Driver Uninstaller, FurMark, K-Lite Codec Pack, PDFgear |
| Malicious DLLs   | `autorun.dll`, `vcredist_x64.dll`                                        |
| Disguised EXE    | `SimpleRunPE.exe`, `vlc.exe` (disguised name)                            |
| C2/distribution  | `gleeze[.]com` subdomains, `193.42.11[.]108`, Dynu dynamic DNS           |
| Miners           | gminer, lolMiner, SRBMiner-MULTI                                         |
| RMM abuse        | ScreenConnect (unauthorized deployment)                                  |
| Persistence      | Registry Run keys, Scheduled Tasks                                       |
| Evasion          | DLL side-loading, process hollowing, Defender exclusion registration, halting mining when analysis tools detected |
| Malicious domains | 150+                                                                    |

## 9. Conclusion and Recommendations

This campaign demonstrates how the combination of **AI-assisted delivery, software impersonation, and persistent access** shows threat actors adapting social engineering and monetization strategies to modern user behavior. Two points are key.

First, **the locus of trust has shifted.** Users now trust AI chatbot answers more than search results, and attackers target exactly that trust. AI search poisoning is the next generation of SEO poisoning.

Second, **mining is the entrance, not the exit.** Persistent access via ScreenConnect can pivot to data theft or ransomware at any time. The complacent classification of "just mining malware" is dangerous.

Recommendations:

1. Obtain software **only from official sources**, and never trust AI/search recommendation links without verification.
2. Establish **RMM tool governance** and block unauthorized installs.
3. **Separate crypto wallets and signing rights from GPU-work machines.**
4. Build DLL side-loading, process hollowing, and Defender-exclusion-tampering detection into SOC rules.

---

## References

[1] Ravie Lakshmanan, "AI Chatbot Recommendations Redirect Users to Cryptojacking Malware Sites", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/ai-chatbot-recommendations-redirect.html>

[2] Microsoft Defender Experts & Microsoft Defender Security Research Team, "Poisoned Search Results: GPU Mining Cryptojacking Campaign Abusing ScreenConnect & Microsoft .NET Utilities", Microsoft Security Blog, 2026-05-26. <https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/>

[3] Dennis Kim, "Sophisticated and Dormant Attacks Targeting MCP — A Structural Problem?", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
