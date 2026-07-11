| id             | CTI-2026-0601-GREYVIBE                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| title          | Attackers in the Grey Zone — GREYVIBE's Ukraine-Targeted Operations Armed with GenAI                             |
| subtitle       | 'AI-assisted malware development' and the collapse of attribution, seen through five campaigns of spearphishing, fake CAPTCHAs, and lure sites |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                  |
| email          | <gameworker@gmail.com>                                                                                          |
| github         | gameworkerkim                                                                                                   |
| date           | 2026-06-01                                                                                                      |
| classification | TLP:GREEN                                                                                                       |
| severity       | HIGH                                                                                                            |
| lang           | en                                                                                                              |
| tags           | AI-Assisted-Malware · Cyber-Espionage · Russia-Ukraine · Attribution-Decay · ClickFix · RAT · Hybrid-Threat    |
| threat\_actors | GREYVIBE (Russian-speaking · aligned with Kremlin interests · linked to cybercrime ecosystem)                    |
| cve            | N/A (TTP-centric analysis)                                                                                      |
| frameworks     | MITRE ATT&CK · Diamond Model · Admiralty Code · STIX/TAXII                                                      |
| license        | CC BY-NC-SA 4.0                                                                                                 |


# Attackers in the Grey Zone — GREYVIBE's Ukraine-Targeted Operations Armed with GenAI

> **Report ID** `CTI-2026-0601-GREYVIBE` · **Published** 2026-06-01 · **Classification** `TLP:GREEN` · **Severity** 🟠 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*'AI-assisted malware development' and the collapse of attribution, seen through five campaigns of spearphishing, fake CAPTCHAs, and lure sites*

---


## Table of Contents

1. Executive Summary (TL;DR)
2. Opening — "Where attribution melts"
3. Threat Actor Overview — GREYVIBE Profile
4. Attack Chain Analysis — Five Campaigns
5. Tool Analysis — PhantomRelay · LegionRelay · FallSpy
6. AI Usage Analysis — GenAI as a 'development assistant' and attribution decay
7. Cybercrime Nexus — Evidence of a state–crime hybrid
8. Korea Perspective — A preview of NK actor playbooks
9. Detection & Mitigation Recommendations
10. Conclusion
11. References

---


## Executive Summary (TL;DR)

On May 29, 2026, Finnish security firm WithSecure disclosed a previously undocumented threat actor, **GREYVIBE**. The group has continuously targeted Ukraine and Ukraine-related organizations since at least August 2025, and is assessed to use Russian and operate in Russian time zones. The objective of the activity is intelligence collection in the context of the Russia–Ukraine war, aligned with Kremlin state interests.

This case goes beyond yet another cyber-espionage campaign for two reasons. First, the group employed **multiple vectors**—spearphishing, fake CAPTCHA pages, and disguised lure sites—against a broad target set spanning military, government, civilian, and corporate entities. Second, and more importantly, multiple indicators show the group **directly used generative AI (GenAI) and LLMs for malware development, infrastructure, image generation, and post-compromise command writing**.

WithSecure describes GREYVIBE as "a group of low-to-medium sophistication that commits operational security mistakes." What this report focuses on, however, is not the sophistication level but the fact that **AI assistance erodes the attribution system itself**. Traditional clustering based on stable technical artifacts loses reliability when actors can frequently generate, refactor, and replace components with AI.

### Key Judgments

| #    | Judgment                                                                                                                                | Confidence             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | GREYVIBE operates via **social-engineering-centric multi-entry vectors**, not a single CVE. Because it targets human trust rather than a patchable flaw, technical patching alone will not stop it.                                  | **High**        |
| KJ-2 | The group used GenAI (Ideogram, ChatGPT, Gemini) as an **assistant across the malware development lifecycle**. This closes technical capability gaps, accelerates development, and reduces reliance on off-the-shelf tools that leave attribution fingerprints. | **High**        |
| KJ-3 | AI usage **structurally lowers attribution confidence**. When artifacts are frequently replaced, IOC- and code-similarity-based clustering is neutralized. This is a threat direction that generalizes to all espionage actors.                            | **Medium-High** |
| KJ-4 | Paradoxically, AI assistance **injected a design flaw into LegionRelay**, exposing backend functionality. This is a signal that GREYVIBE may not be a pure state actor.                                    | **Medium**      |
| KJ-5 | The group sits in the **state–crime hybrid** zone. Evidence includes an ISO builder linked to TrickBot/UAC-0098, PhantomRelay variants spanning seemingly unrelated crime clusters, and XMRig miners.            | **Medium**      |
| KJ-6 | GREYVIBE's playbook (ClickFix fake CAPTCHAs, disguised Zoom pages, charity and adult-site lures) substantially overlaps recent TTPs of North Korea–linked actors targeting Korea (e.g., Kimsuky). It is a **preview from a domestic defense perspective**. | **Medium-High** |

---


## 1. Opening — "Where attribution melts"

Attribution is the foundation of threat intelligence. We cluster and track actors using stable artifacts such as code similarity, infrastructure reuse, command habits, and tool fingerprints. This methodology rests on an implicit premise: that actors change their tools and habits relatively slowly.

GREYVIBE shakes that premise. The group left indicators of generating loaders, obfuscation scripts, backend infrastructure, post-compromise commands, and even lure images with generative AI assistance. WithSecure researcher Mohammad Kazem Hassan Nejad assessed that if actors can frequently generate, restructure, and replace operational components with AI assistance, traditional clustering based on stable technical artifacts may lose reliability over time.

In other words, AI amplifies attack impact while **blurring the defender's tracking coordinate system**. That is why GREYVIBE draws industry attention despite being assessed as "low-to-medium sophistication." The fact that even a non-sophisticated group can make attribution hard with AI assistance alone is itself a shift in the threat model.

---


## 2. Threat Actor Overview — GREYVIBE Profile

| Field       | Detail                                                       |
| -------- | -------------------------------------------------------- |
| Name       | GREYVIBE (named by WithSecure; newly disclosed)                             |
| Activity start    | At least since August 2025 (ongoing)                                    |
| Language / timezone   | Russian-speaking · operates in Russian time zones                                     |
| Alignment       | Kremlin state interests (intelligence collection in the Russia–Ukraine war)                                |
| Target set      | Military · government · civilian · corporate (Ukraine and Ukraine-related organizations)                    |
| Sophistication   | Low–medium (numerous operational security mistakes)                                        |
| Character       | State–crime hybrid — indicators of current/former cybercriminal links                     |
| Key differentiator   | Direct use of GenAI/LLM for malware development, infrastructure, and lure generation                       |

Despite state-aligned activity, some GREYVIBE members are assessed as current or former cybercriminals, creating links to the broader Russian cybercrime ecosystem. WithSecure assessed that the group sits in the **grey zone** between cybercrime and state-aligned activity, complicating attribution and blurring the traditional distinction between the two categories.

---


## 3. Attack Chain Analysis — Five Campaigns

GREYVIBE operated at least five distinct attack chains against its targets.

| Campaign           | Entry Vector                                          | Delivered Payload                                                  |
| ------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **PhantomMail**   | Spearphishing email → malicious ZIP/RAR on Google Drive or 4sync     | JS loader executes lure document, then launches PhantomRelay (PowerShell RAT)        |
| **PhantomClick**  | ClickFix-style fake CAPTCHA on impersonation domains (Zoom / LAPAS)        | Induces user to execute commands → initiates PhantomRelay infection chain                    |
| **PrincessClub**  | Fake Ukrainian adult club site (later versions capture audio/video via WebRTC) | Android: FallSpy / Windows: PhantomRelayV1 or LegionRelay |
| **DroneLink**     | Website impersonating a Ukrainian military support charity                          | WireGuard + LegionRelay                                  |
| **Nebo**          | FallSpy sample mimicking a Russian-language login screen                     | Induces Ukrainian military personnel to believe they are accessing a "Russian military terminal"                       |

Each chain precisely targets the psychology of the victim (wartime conditions, military curiosity, charitable motives). Nebo in particular shows sophisticated psychological design that reverses the target's caution by impersonating access to an adversary (Russian) system. PhantomClick's ClickFix-style fake CAPTCHA weaponizes the everyday action of "prove you are human," causing users to execute malicious commands themselves.

---


## 4. Tool Analysis — PhantomRelay · LegionRelay · FallSpy

| Tool              | Platform      | Core Capabilities                                                                                     |
| --------------- | -------- | ----------------------------------------------------------------------------------------- |
| **PhantomRelay**    | Windows  | PowerShell-based RAT. Host profiling; execution of PowerShell scripts and Windows commands                                 |
| **PhantomRelayV1**  | Windows  | PhantomRelay variant. Adds a custom watchdog persistence mechanism                                             |
| **LegionRelay**     | Windows  | Lightweight PowerShell RAT. File enumeration/exfiltration, screenshots, browser data theft, Telegram/WhatsApp data exfiltration, RDP access configuration         |
| **FallSpy**         | Android  | Spyware. Collects sensitive data from infected devices                                                                    |

LegionRelay's broad feature set targets communications, financial, and identity data at scale. Combined messenger (Telegram/WhatsApp) data exfiltration and browser credential theft mean a single infection can expose the target's entire digital life. FallSpy's Android targeting makes clear that mobile devices of military and government personnel are part of the attack surface.

---


## 5. AI Usage Analysis — GenAI as a 'Development Assistant' and Attribution Decay

GREYVIBE's diverse delivery vectors and tools are assessed to stem from AI platform usage. Platforms and purposes with observed indicators:

- **Ideogram AI** — lure image generation
- **OpenAI ChatGPT · Google Gemini** — LegionRelay development; assistance with obfuscation/loader scripts, backend infrastructure, and post-compromise command writing

WithSecure assessed that GREYVIBE's AI use provided three advantages:

1. **Closing capability gaps** — AI assistance fills missing technical expertise.
2. **Accelerating the development lifecycle** — speeds tool creation and refactoring.
3. **Evading attribution** — reduces reliance on existing malware and tools that leave attribution fingerprints.

The third is the heaviest from a defense perspective. When stable artifacts disappear, IOC matching and code-similarity clustering—core tools of threat intelligence—slow down. That is why this report uses `Attribution-Decay` as a core tag.

Yet AI assistance was a double-edged sword. AI **injected a design flaw** into LegionRelay that exposed the malware's backend functionality. That is a mistake a sophisticated state actor would be unlikely to make, and thus a signal that GREYVIBE is hard to treat as a pure state actor. In short, AI lowers the barrier to entry while creating **a new class of operational security mistakes** — the proposition that "an LLM is a spreadsheet, not an oracle" applies to attackers as well.

---


## 6. Cybercrime Nexus — Evidence of a State–Crime Hybrid

WithSecure assessed GREYVIBE's cybercrime-ecosystem links at **medium confidence**, and involvement of current/former criminal members at **low-to-medium confidence**, based on:

- Access to and use of an ISO builder suspected of links to the TrickBot gang and **UAC-0098**
- Presence of PhantomRelay variants across seemingly unrelated crime clusters (July 2025–February 2026 Microsoft Teams voice-phishing campaigns; late February–late March 2026 KongTuke ClickFix delivery chains)
- VirusTotal uploads of early development/test samples (operational security mistakes)
- Internet slang in development artifact naming ("letsrollboyos", "totallyunsus", "cuteuwu")
- XMRig miners deployed on some LegionRelay-infected machines

WithSecure stated it is unclear whether these members were absorbed into a state-sponsored group, operate independently under state direction, or form a hybrid team. That ambiguity itself is a feature of the modern threat environment.

---


## 7. Korea Perspective — A Preview of NK Actor Playbooks

GREYVIBE targeted Ukraine, but its playbook is far from distant for Korean defenders.

- **TTP overlap** — Social engineering via ClickFix-style fake CAPTCHAs, disguised Zoom/meeting pages, and fake install pages substantially overlaps recent TTPs of North Korea–linked actors targeting Korea (e.g., Kimsuky's fake security-software install pages and fake Webex pages). GREYVIBE's campaign structure should be read as a preview of patterns domestic defenders will soon face.
- **Generalization of AI-assisted malware** — As GenAI lowers barriers, low-to-medium sophistication actors can rapidly replace and generate tools. Actors targeting Korean enterprises and institutions can shorten IOC lifetimes the same way. A shift **from IOC-centric defense to behavior- and TTP-centric defense** is essential.
- **Policy implications of attribution decay** — The practice of deciding "which group did this" from stable artifacts in domestic incident response is shaken. Threat hunting and detection rules must be built on **behavior patterns** (ClickFix induction, PowerShell RAT behavior, messenger data-exfiltration sequences), not tool fingerprints.
- **Mobile targeting** — FallSpy-class Android spyware reminds us that mobile devices of military, government, and corporate personnel are a primary attack surface. MTD/mobile EDR adoption should be considered.

---


## 8. Detection & Mitigation Recommendations

1. **Shift to behavior-based detection** — Do not rely solely on IOC matching. Alert on **behavior patterns** such as ClickFix-style user induction, PowerShell RAT reconnaissance/exfiltration sequences, messenger (Telegram/WhatsApp) data access, and RDP configuration changes.
2. **Block ClickFix and fake CAPTCHAs** — Detect and block pages that induce users to execute clipboard commands. Strengthen user education so that any request to "paste a command to pass the CAPTCHA" is treated as a compromise attempt.
3. **Control attachments and downloads** — Restrict by policy the execution of scripts (JS, LNK, PowerShell) inside ZIP/RAR files hosted on external services such as Google Drive and 4sync.
4. **Harden PowerShell** — Enable Constrained Language Mode, script-block logging, and AMSI; monitor anomalous PowerShell child processes.
5. **Mobile defense** — Apply MTD/mobile EDR to devices of military, government, and sensitive roles; block sideloading (direct APK install).
6. **Hunt lure infrastructure** — Register newly registered domains impersonating charities, meeting software, or adult sites as threat-hunting targets; watch for WebRTC-based audio/video capture lure pages.
7. **Humility in attribution** — For actors whose artifacts change rapidly with AI assistance, withhold definitive attribution and accumulate assessments on a multi-source, multi-confidence (Admiralty Code) basis.

---


## 9. Conclusion

GREYVIBE is not a "sophisticated" group. It left operational security mistakes and exposed its own malware backend through an AI-injected design flaw. Yet this case matters for one reason: **it showed that AI assistance can make attribution hard even for unsophisticated actors.**

Traditional threat intelligence was built on the premise that "actors change slowly." GenAI collapses that premise. In an environment where loaders, obfuscation, infrastructure, and lures are regenerated on a days-long cycle, clustering tied to stable artifacts ages quickly. The center of gravity of defense must move from *what it was built with* (artifact) to *how it behaves* (behavior).

And this threat does not stay in Ukraine. ClickFix fake CAPTCHAs, disguised meeting pages, and social-engineering lures—GREYVIBE's grammar—are already used or soon to be adopted by actors targeting Korea. Attackers in the grey zone respect neither borders nor classification systems.

---


## References

[1] Mohammad Kazem Hassan Nejad, "GREYVIBE", WithSecure Labs, 2026-05. <https://labs.withsecure.com/publications/greyvibe>

[2] Ravie Lakshmanan, "New Russian-Linked GREYVIBE Targets Ukraine with AI-Powered Cyberattacks", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/new-russian-linked-greyvibe-targets.html>

[3] "ClickFix Malware Campaign Exploits ... (ClickFix technique background)", The Hacker News, 2025-08. <https://thehackernews.com/2025/08/clickfix-malware-campaign-exploits.html>

[4] "Some Members of Conti Group Targeting Ukraine (UAC-0098 background)", The Hacker News, 2022-09. <https://thehackernews.com/2022/09/some-members-of-conti-group-targeting.html>

---


© 2026 Dennis Kim (김호광) · This document was prepared for public release in an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
