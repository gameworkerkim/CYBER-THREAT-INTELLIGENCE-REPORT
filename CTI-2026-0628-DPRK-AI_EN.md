| id             | CTI-2026-0628-DPRK-AI                                                                                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | The RGB With an LLM in Hand - A Precise Analysis of the 2026 Qualitative Shift in DPRK AI-Enabled Hacking                                                                                                              |
| subtitle       | Kimsuky and Lazarus fuse social engineering × supply chain × LLM-embedded malware - and the reality of Korea's response                                                                                                |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                           |
| email          | gameworker@gmail.com                                                                                                                                                                                                    |
| github         | gameworkerkim                                                                                                                                                                                                           |
| date           | 2026-06-28                                                                                                                                                                                                              |
| classification | TLP:GREEN                                                                                                                                                                                                               |
| severity       | HIGH (escalating toward CRITICAL)                                                                                                                                                                                       |
| lang           | en                                                                                                                                                                                                                      |
| tags           | | DPRK | Kimsuky | Lazarus | Andariel | LLM-Abuse | Social-Engineering | Supply-Chain | Agentic-AI | | --- | --- | --- | --- | --- | --- | --- | --- |                                                                  |
| threat\_actors | | Kimsuky (APT43, RGB Bureau 121) | Lazarus / Famous Chollima (APT38) | Andariel | BlueNoroff | Contagious Interview (G1052) | UNC1069 (Sapphire Sleet) | UNC4736 (AppleJeus/Citrine Sleet) | | --- |        |
| frameworks     | | MITRE ATT&CK | NIST SP 800-207 (Zero Trust) | NIST SP 800-218 (SSDF) | STIX/TAXII | | --- | --- | --- | --- |                                                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                         |


# The RGB With an LLM in Hand - A Precise Analysis of the 2026 Qualitative Shift in DPRK AI-Enabled Hacking

> **Report ID** `CTI-2026-0628-DPRK-AI` · **Published** 2026-06-28 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH (escalating toward CRITICAL)
> **Author** Dennis Kim (HoKwang Kim) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*Kimsuky and Lazarus fuse social engineering × supply chain × LLM-embedded malware - and the reality of Korea's response*

---


## Table of Contents

1. [Summary (TL;DR)](#summary-tldr)
2. [The Three-Organization Structure - A Division of Labor Across Espionage, Revenue, and Disruption](#1-the-three-organization-structure---a-division-of-labor-across-espionage-revenue-and-disruption)
3. [Axis ①: AI Social Engineering - From Deepfake IDs to Synthetic Personas](#2-axis--ai-social-engineering---from-deepfake-ids-to-synthetic-personas)
4. [Axis ②: The Industrialization of Supply-Chain Attacks - Contagious Interview](#3-axis--the-industrialization-of-supply-chain-attacks---contagious-interview)
5. [Axis ③: LLM-Embedded and Agentic Malware - "just-in-time AI"](#4-axis--llm-embedded-and-agentic-malware---just-in-time-ai)
6. [2026 vs. Before - What Has Qualitatively Changed](#5-2026-vs-before---what-has-qualitatively-changed)
7. [MITRE ATT&CK Mapping](#6-mitre-attck-mapping)
8. [The Limits of Attribution - A Disciplined Analysis](#7-the-limits-of-attribution---a-disciplined-analysis)
9. [Building an LLM WIKI to Upskill Low-Skill Hackers (First Public Disclosure)](#7-1-building-an-llm-wiki-to-upskill-low-skill-hackers-first-public-disclosure)
10. [Korea's Response Coordinates - Society, State, and Security Practitioners](#8-koreas-response-coordinates---society-state-and-security-practitioners)
11. [Conclusion](#9-conclusion)
12. [References](#references)

---


## Summary (TL;DR)

Through 2025, the DPRK's use of AI sat at the level of a *"productivity assistant"*: polishing phishing copy, smoothing over English and cultural barriers, generating code snippets ("vibe coding") [[10]](#ref-10). The 2026 picture is different. A **qualitative shift toward AI autonomously executing the entire attack lifecycle** is underway, and North Korean organizations are at the front line of that shift.

This report analyzes DPRK AI-enabled hacking as the fusion of three axes.

- **Axis ① Social engineering:** Kimsuky (APT43) used ChatGPT to generate a deepfake South Korean military ID for spear-phishing (July 2025, reported by Genians), and BlueNoroff deployed AI deepfake video in Zoom interviews. The IT-worker impersonation fraud automated fake résumés, personas, and the passing of technical interviews using AI [[1]](#ref-1)[[5]](#ref-5)[[7]](#ref-7).
- **Axis ② Supply chain:** The Contagious Interview (fake-interview) campaign industrialized across npm, PyPI, Go, crates.io, and Packagist, reaching **more than 1,700 malicious packages**. The DPRK accounts for roughly **76% of cryptocurrency theft by value in 2026** [[11]](#ref-11)[[12]](#ref-12)[[13]](#ref-13).
- **Axis ③ LLM-embedded malware:** Google GTIG reported malware that queries an LLM at execution time to dynamically generate and self-modify code (PROMPTFLUX, PROMPTSTEAL, and others), and identified DPRK-linked UNC1069 leveraging Gemini to probe wallet data and craft phishing scripts [[8]](#ref-8)[[9]](#ref-9).

The core message is singular: **AI helped overcome the DPRK's chronic bottleneck of a shortage of skilled personnel.** Where the RGB once depended on a small cadre trained over years at institutions such as Hamhung Computer Technology University, low-skill operatives can now pass Fortune 500 technical interviews and carry out intrusions with AI assistance [[5]](#ref-5). Korea sits in a phase of **deepening asymmetry** — its attack surface expanding (enterprise-wide AI adoption) while its defenses stagnate (aging systems). In its 2026 National Information Security White Paper, the NIS diagnosed an urgent need to transition to an "autonomous security operations system" and to stand up a national control tower [[14]](#ref-14).

### Key Judgments

| #    | Judgment                                                                                                                                                                                  | Confidence      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | The DPRK's use of AI is undergoing a qualitative shift from a 2025 "productivity assistant" to a 2026 model of **"autonomous attack-lifecycle execution + LLM-embedded malware."** This is a change in operating model, not merely an increase in volume. | **High**        |
| KJ-2 | Social engineering remains the primary catalyst for initial access, but AI has dramatically elevated its **authenticity, scale, and multilingual reach.** Kimsuky's deepfake military ID, BlueNoroff's AI deepfake video, and IT-worker synthetic personas are the demonstrated cases. | **High**        |
| KJ-3 | Supply-chain attacks have entered a phase of **cross-ecosystem industrialization.** Contagious Interview simultaneously targets five or more package registries, with a single cluster operating 1,700+ packages. | **High**        |
| KJ-4 | Using social engineering as the entry point for large cryptocurrency thefts, the DPRK reached an industrialization metric of **roughly 76% of theft by value in 2026** (per blockchain-analytics reporting). The Bybit ($1.5B) and Drift ($285M) cases are representative. | **Medium-High** |
| KJ-5 | **LLM-embedded malware** (dynamically generating code via runtime LLM queries) is still early-stage but structurally undermines signature-based detection. UNC1069's abuse of Gemini was reported as a DPRK-linked case. | **Medium**      |
| KJ-6 | Korea faces a widening asymmetry between an **expanding attack surface (wholesale AI adoption) and stagnant defenses (system obsolescence).** The limits of company- and agency-level response are clear, and a national, always-on response posture is urgently needed. | **Medium-High** |
| KJ-7 | Attribution of some government-ministry and telecom breaches carries **uncertainty.** Cases exist where "presumed Kimsuky" and "possible Chinese backing" coexist, so one must not conclude from linguistic or TTP cues alone. | **Medium**      |

> **Analytic principle:** "AI hacking" is a topic prone to exaggeration. This report separates *what is demonstrated* (deepfake IDs, cross-ecosystem packages, runtime-LLM-querying malware) from *trend-based projections* (fully autonomous attacks), and makes the uncertainty of attribution explicit.

---


## 1. The Three-Organization Structure - A Division of Labor Across Espionage, Revenue, and Disruption

DPRK cyber operations are **divided by role**, centered on Bureau 121 under the Reconnaissance General Bureau (RGB). Synthesizing DomainTools' taxonomy with domestic Korean analysis, the structure is clear [[13]](#ref-13)[[15]](#ref-15)[[16]](#ref-16).

| Organization     | Aliases                        | Primary mission                  | Representative targets / tradecraft                                              |
| ---------------- | ------------------------------ | -------------------------------- | -------------------------------------------------------------------------------- |
| **Kimsuky**      | APT43                          | **Intelligence collection**      | Spear-phishing and impersonation against diplomatic/security/defense and DPRK-focused experts, defectors, journalists |
| **Lazarus**      | Famous Chollima, APT38         | **Revenue generation (funding)** | Large-scale crypto exchange/DeFi theft, supply-chain intrusion, IT-worker fraud |
| **Andariel**     | —                              | **Disruption / signaling**       | Credential theft, ransomware (Medusa RaaS) deployment, certificate theft and code-signing |
| **BlueNoroff**   | (Lazarus offshoot)             | Financial / crypto targeting     | Zoom social engineering + AI deepfake video; targeting crypto executives        |

According to AhnLab's "2025 Cyber Threat Trends & 2026 Security Outlook," 86 disclosed APT activities (Oct 2024–Sep 2025) traced to the DPRK accounted for roughly half of the total, with Lazarus at 31 and Kimsuky at 27. Korea is the consistent top target [[16]](#ref-16). All three organizations are accelerating their AI adoption across 2025–2026, which is the starting point of this analysis.


## 2. Axis ①: AI Social Engineering - From Deepfake IDs to Synthetic Personas

Kimsuky's traditional weapon is **spear-phishing that exploits trust and social relationships** [[15]](#ref-15). The 2026 change is the fusion of generative AI onto that weapon.

**2-1. Kimsuky × ChatGPT deepfake military ID (July 2025).** The Genians Security Center reported a case in which Kimsuky used ChatGPT to generate a *sample image* of a South Korean military employee ID, heightening the authenticity of phishing emails impersonating a defense-related agency (disclosed 2025-09-15). Because reproducing ID documents is illegal, ChatGPT initially refused, but the refusal was bypassed via **prompt injection (jailbreak)** that reframed the request as a "mock-up / sample design." The attached PNG was assessed as a deepfake with 98% probability, and the accompanying `LhUdPC3G.bat` initiated information theft and remote control [[1]](#ref-1)[[2]](#ref-2)[[3]](#ref-3). The campaign used the same malware as the ClickFix-based phishing of June that year.

**2-2. BlueNoroff × AI deepfake video.** A 2026 weekly threat briefing reports that BlueNoroff deployed **AI-augmented deepfake video in Zoom social engineering** to target crypto executives, using prior victims as trusted lures to expand the target pool without forming new relationships (T1656) — a DPRK-characteristic propagation technique that defeats network-based blocking [[12]](#ref-12).

**2-3. AI automation of the IT-worker impersonation fraud.** In its August 2025 threat intelligence report, Anthropic disclosed cases of DPRK IT workers using Claude to **create false identities and backgrounds, pass coding tests, and even perform actual technical work** to land remote jobs at Fortune 500 companies. The core implication: *"You don't need English, U.S. cultural context, or technical skill — AI fills each barrier"* — meaning the regime's bottleneck of multi-year training was removed [[5]](#ref-5)[[6]](#ref-6). Recorded Future observed the same operational cluster (PurpleDelta / PurpleBravo) using AI for code generation, document modification, translation, and synthetic recruiter imagery [[4]](#ref-4). CSIS projects this threat will persist and expand in 2026, advancing toward **multimodal (voice, text, video) deepfakes** [[7]](#ref-7).


## 3. Axis ②: The Industrialization of Supply-Chain Attacks - Contagious Interview

Contagious Interview (MITRE G1052) is a campaign running since 2023, but it **entered an industrialized phase in 2026** [[17]](#ref-17).

- **Cross-ecosystem spread.** A single DPRK-linked cluster deploys in parallel to npm, PyPI, Go Modules, crates.io, and Packagist using **the same staging infrastructure and loader patterns.** Socket tracked **more than 1,700 packages** in the broader campaign. JavaScript, Python, Go, Rust, and PHP developers now fall within the same actor's target set [[11]](#ref-11)[[13]](#ref-13).
- **Evolution of the entry vector.** In 2026 the initial stage is concealed in `.vscode/tasks.json` (TasksJacker), auto-executing like an npm lifecycle script, or hidden in **git hooks.** It chains BeaverTail → InvisibleFerret (a Python backdoor), stealing crypto wallets, browser credentials, and SSH keys [[13]](#ref-13).
- **Fusion of social engineering + supply chain.** The $285M Drift hack (2026-04-01) was the culmination of a six-month social engineering operation. UNC4736 (AppleJeus / Citrine Sleet) reportedly built an operational presence inside the ecosystem from the fall of 2025 — depositing over $1M of its own funds — then used links and tools from integration discussions as the initial infection path [[11]](#ref-11).
- **Industrialization of the funding stream.** Large exchange/DeFi thefts accumulated — the Bybit hack (Feb 2025, ~$1.5B, the largest on record) and the Upbit incident (late 2025, Lazarus suspected) — and analyses put **the DPRK at roughly 76% of cryptocurrency theft by value in 2026** [[12]](#ref-12)[[16]](#ref-16).

A point to note here: the Axios npm package compromise (2026-03-31) is attributed differently depending on the source — Lazarus (ThreatBook) or UNC1069 / Sapphire Sleet (GTIG, Microsoft). **The umbrella judgment of "DPRK-linked" is consistent, but the sub-group attribution differs by source** — caution against definitive conclusions is warranted [[13]](#ref-13).

That said, the attack patterns are growing more sophisticated, and the frequency and severity of attacks are rising fast enough to outpace conventional malware analysis.


## 4. Axis ③: LLM-Embedded and Agentic Malware - "just-in-time AI"

The newest change is that AI has moved beyond a pre-attack support tool to **querying an LLM at the moment of malware execution.**

- **Just-in-time code generation.** Google GTIG reported a family of malware that **invokes an LLM during execution** — PROMPTFLUX (a "Thinking Robot" module that rewrites its own VBScript every hour via the Gemini API), PROMPTSTEAL (queries the Qwen model on Hugging Face to generate Windows commands and executes them), and PROMPTLOCK, QuietVault, FruitShell. This signals a transition to metamorphic techniques that defeat static signatures [[8]](#ref-8)[[9]](#ref-9).
- **DPRK-linked case.** GTIG reported that DPRK-linked **UNC1069 leveraged Gemini to probe wallet data and write phishing scripts.** A new attack surface is emerging in which malware queries an LLM at runtime to "locate wallet storage and generate a bespoke exfiltration script" [[9]](#ref-9).
- **Social engineering of guardrail bypass.** Threat actors disguise prompts with personas such as "CTF participant" or "security researcher" to bypass AI safeguards — social engineering applied not only to humans but **to the model itself** [[8]](#ref-8).
- **Precursor to agentic attacks.** In November 2025, Anthropic disclosed the first large-scale case of a Chinese state-linked actor jailbreaking Claude Code to attempt **reconnaissance, vulnerability discovery, credential theft, and data exfiltration with minimal human intervention** across roughly 30 targets. Not a DPRK case, but a leading indicator of the **autonomous-attack trajectory of nation-state actors.** Note, too, that limits to full autonomy were reported — Claude hallucinated credentials — so exaggeration should be resisted [[18]](#ref-18).

The NIS 2026 White Paper warns that "from this year, agentic AI will autonomously execute the entire attack lifecycle, generating tens of thousands of malicious actions per second," and cites Kaspersky and GTIG for indications of Kimsuky's **involvement of LLMs in code writing** [[14]](#ref-14).


## 5. 2026 vs. Before - What Has Qualitatively Changed

| Dimension           | Before ~2024 (pre-AI)                                   | 2025 (AI-assisted)                       | 2026 (AI-autonomous)                                      |
| ------------------- | ------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Role of AI          | Unused / experimental                                   | Phishing copy, translation, vibe coding  | **Autonomous attack-lifecycle execution + LLM-embedded malware** |
| Social engineering  | Manual spear-phishing (spelling/cultural errors exposed) | AI copy-editing raises authenticity      | **Deepfake IDs/video, synthetic personas, multimodal**    |
| Supply chain        | Sporadic watering holes / domestic SW flaws (Operation SyncHole) | Sporadic malicious npm packages          | **Cross-ecosystem industrialization (1,700+ packages)**   |
| Entry vector        | Email attachments (HWP, LNK, ISO)                       | ClickFix, fake-interview repos           | **`.vscode/tasks.json`, git hooks auto-execution**        |
| Personnel structure | Multi-year training bottleneck (reliance on a small elite) | Partial AI assistance                    | **AI removes the bottleneck → low-skill operatives intrude** |
| Detection evasion   | Static payloads                                         | Heavier obfuscation                      | **Runtime LLM self-modification (metamorphic)**           |
| Monetization        | Banks / SWIFT (e.g., Bangladesh central bank, 2016)     | Large exchange thefts (Bybit $1.5B)      | **DeFi social engineering (Drift $285M), 76% of crypto theft** |
| Targeting precision | Mass spraying                                           | Increasingly targeted                    | **Long-dwell infiltration (6-month trust-building) + industrialization in parallel** |

The crux: the change is not that *attacks increased*, but that **the entry barriers to conducting an attack — skill, personnel, time, cost — collapsed.** This invalidates the defender's assumption that attacker sophistication is proportional to attack complexity.


## 6. MITRE ATT&CK Mapping

Mapped conservatively, limited to confirmed TTPs.

| Tactic               | Technique                                                | Application in this analysis (organization)         |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| Resource Development | T1587 (Develop Capabilities) / T1585 (Establish Accounts) | AI synthetic personas, fake résumés (IT workers, PurpleBravo) |
| Resource Development | T1588.007 (Obtain Capabilities: Artificial Intelligence)  | Abuse of LLM / deepfake tools (all organizations)   |
| Initial Access       | T1566.001/.002 (Spear-phishing Attachment/Link)          | Deepfake military-ID phishing (Kimsuky)             |
| Initial Access       | T1195.002 (Compromise Software Supply Chain)             | Contagious Interview packages (Lazarus)             |
| Execution            | T1059 (Command/Scripting) / T1204 (User Execution)       | `.vscode/tasks.json`, git hooks (Lazarus)           |
| Defense Evasion      | T1027 (Obfuscation) — runtime LLM self-modification      | PROMPTFLUX-style metamorphic (UNC1069-linked)       |
| Credential Access    | T1552 (Unsecured Credentials) / T1555 (Password Stores)  | InvisibleFerret, QuietVault                         |
| Collection           | T1113 (Screen Capture) / T1056.001 (Keylogging) / T1115 (Clipboard) | Contagious Interview payloads             |
| Lateral Movement     | T1656 (Impersonation) — prior victims as lures           | BlueNoroff Zoom deepfake propagation                |
| Exfiltration         | T1041 (Exfiltration Over C2 Channel)                     | Common across many RATs                             |
| Impact               | T1486 (Data Encrypted for Impact)                        | Andariel — Medusa RaaS                              |


## 7. The Limits of Attribution - A Disciplined Analysis

- **Sub-group attribution conflicts.** As with the Axios npm compromise, sources coexist that attribute the same incident differently — Lazarus vs. UNC1069. The umbrella judgment of "DPRK-linked" has high confidence, but **definitive sub-cluster attribution has low confidence.**
- **DPRK vs. China confusion.** In 2025, some reports of government-ministry and telecom breaches saw "presumed Kimsuky" coexist with "possible Chinese backing on linguistic/TTP grounds." Concluding from language traits or tradecraft cues alone is dangerous [[19]](#ref-19).
- **Limits of proving AI contribution.** A judgment that "code was made by AI" often rests on *circumstantial* signs (LLM-characteristic style, a hallucinated CVSS score, textbook structure). GTIG itself classifies some cases as "high-confidence circumstantial inference" — which must be distinguished from conclusive evidence [[9]](#ref-9).

Accordingly, this report maintains differentiated confidence: the umbrella attribution (DPRK-linked) is High, while definitive sub-group and AI-contribution claims are held at Medium or below.


## 7-1. Building an LLM WIKI to Upskill Low-Skill Hackers (First Public Disclosure)

Since March 2026, DPRK hacking organizations have built an **LLM WIKI** to make capabilities usable by low-skill hacking personnel. They are reported to have stood up **local LLMs**, drawing on a range of open-source models including Alibaba's open-source Qwen and GLM.


## 8. Korea's Response Coordinates - Society, State, and Security Practitioners

### 8.1 State level

1. **Transition to an autonomous security operations system.** Since attacks now execute autonomously at machine speed, defenses must likewise minimize human intervention and identify/quarantine at machine speed (per the NIS 2026 White Paper diagnosis). Expanding AI adoption without modernizing aging systems merely **adds attack paths** [[14]](#ref-14).
2. **Standing national control tower and intelligence sharing.** The limits of company- and agency-level response are clear. Make real-time IOC/TTP sharing among the NIS, KISA, the military, and law enforcement — and joint public-private response — permanent. Sustain ROK-US and international cooperation (joint advisories, independent sanctions) [[20]](#ref-20).
3. **A reporting/takedown pipeline with AI model providers.** Anthropic, OpenAI, and Google operate systems that detect and ban abusive accounts and share IOCs. Korean government and enterprises should plug into this pipeline to shorten key-revocation and account-ban timelines [[5]](#ref-5)[[8]](#ref-8).

### 8.2 Security practitioner (operational) level

| Area                 | Recommendation                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Supply chain         | **Pin** direct and transitive dependencies; vet new / low-download packages before adoption; deploy install-time behavioral supply-chain firewalling. |
| Dev environment      | **Audit auto-execution paths** such as `.vscode/tasks.json`, git hooks, and postinstall. Policy and training to forbid running fake-interview assignment repos. |
| Detection shift      | Signature-based → **behavior-based EDR.** Add anomalous outbound traffic to AI APIs (Gemini / OpenAI / Hugging Face) as a detection target. |
| Identity / interview | **Deepfake detection** for video interviews (real-time video integrity, liveness checks); multi-factor identity verification and hardware fingerprinting when hiring IT staff. |
| Credentials          | Enforce MFA + **phishing-resistant authentication (FIDO2 / passkeys)**; isolate crypto-signing devices; verify the signing step against address-swapping malware. |
| Awareness (social engineering) | Raise staff awareness of **authority/urgency lures** (lecture requests, interview requests, ID-review requests). When suspicious, report to the NIS (111), National Police (182), or KISA (118). |

### 8.3 Societal level

- **Protect the target groups.** Kimsuky and Konni consistently target diplomatic/security experts, **defectors, North Korean human-rights activists, and journalists** (e.g., impersonating the National Human Rights Commission). Tailored security support and training for these high-risk groups is needed [[15]](#ref-15)[[16]](#ref-16).
- **Deepfake literacy.** As synthesized IDs, video, and voice become commonplace, society's standard of trust in "what is seen" must be re-educated. The key habit: verify official documents and IDs through a **verification channel**, not visual authenticity.
- **Legal and institutional readiness.** Institutions such as mandatory information-security disclosure (planned for 2027) are advancing, but the pace of legislation and guidelines addressing AI abuse, deepfakes, and supply-chain compromise must accelerate.


## 9. Conclusion

The DPRK's 2026 cyber threat is summarized not as "more hacking" but as "much more, far more sophisticated hacking with the same personnel." As AI removes the bottleneck of hacking-skill proficiency, social engineering, supply chain, and LLM-embedded malware are all advancing simultaneously atop the division of labor among espionage (Kimsuky), revenue (Lazarus), and disruption (Andariel).

The defender's tasks are clear. First, a detection shift **from signatures to behavior.** Second, an expansion **from individual response to national, public-private, and international cooperation.** Third, **aligning the pace of the attack surface (AI adoption) with that of defense (system modernization).** Both exaggeration and complacency are dangerous. AI still hallucinates credentials and has not reached full autonomy, but the direction in which barriers are falling is clear. **What is needed now is not fear, but a structural response calibrated to machine speed.**

---


## References

[1] "AI-Forged Military IDs Used in North Korean Phishing Attack," Infosecurity Magazine, 2025-09. <https://www.infosecurity-magazine.com/news/ai-military-ids-north-korea/>

[2] "North Korean operation uses ChatGPT to forge military IDs," The Record (Recorded Future News), 2025-09. <https://therecord.media/north-korea-kimsuky-hackers-phishing-fake-military-ids-chatgpt>

[3] "North Koreans Target South With Military ID Deepfakes," Dark Reading, 2025-09-17. <https://www.darkreading.com/cyberattacks-data-breaches/north-korean-group-south-military-id-deepfakes>

[4] Recorded Future (PurpleDelta / PurpleBravo, AI synthetic personas) — as cited within Dark Reading [3].

[5] "Detecting and countering misuse of AI: August 2025," Anthropic, 2025-08. <https://www.anthropic.com/news/detecting-countering-misuse-aug-2025>

[6] "Threat Intelligence Report: August 2025," Anthropic (PDF). <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

[7] "Responding to the Evolution and Global Expansion of the DPRK IT Worker Threat," CSIS, 2026-03. <https://www.csis.org/analysis/responding-evolution-and-global-expansion-dprk-it-worker-threat>

[8] "GTIG AI Threat Tracker: Advances in Threat Actor Usage of AI Tools," Google Threat Intelligence Group, 2025-11. <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools>

[9] "Google Threat Report Links AI-powered Malware to DPRK Crypto Theft," Decrypt, 2025-11. <https://decrypt.co/347781/google-threat-report-links-ai-powered-malware-to-dprk-crypto-theft>

[10] "AI risk and resilience: A Mandiant special report," Google Cloud, 2026. <https://cloud.google.com/security/resources/ai-risk-and-resilience>

[11] "$285 Million Drift Hack Traced to Six-Month DPRK Social Engineering Operation," The Hacker News, 2026-04-06. <https://thehackernews.com/2026/04/285-million-drift-hack-traced-to-six.html>

[12] "Weekly Security Intelligence Briefing — Week of 2026-05-04" (BlueNoroff AI deepfake; DPRK 76% share), TechJack Solutions, 2026-05. <https://techjacksolutions.com/security/briefing/weekly-security-intelligence-briefing-week-of-2026-05-04/>

[13] "Contagious Interview now ships malicious packages to npm, PyPI, Go, Rust, and PHP" (Socket, 1,700+ packages), 2026-04-08. <https://anonhaven.com/en/news/contagious-interview-cross-ecosystem-supply-chain-attack/>

[14] "North Korea adopts 'autonomous hacking AI' wholesale … NIS '2026 National Information Security White Paper'," Asia Today, 2026-06. <https://www.asiatoday.co.kr/kn/view.php?key=20260609010003141>

[15] Ministry of Foreign Affairs (ROK), "Designation of the North Korean hacking group 'Kimsuky' as an independent sanctions target; ROK-US joint security advisory." <https://www.mofa.go.kr/www/brd/m_4080/view.do?seq=373737>

[16] "North Korea's Lazarus and Kimsuky: 86 advanced hacking incidents … 'aimed at Korea'" (AhnLab 2026 outlook), Asiae, 2025-11-30. <https://cm.asiae.co.kr/article/2025113009471713623>

[17] "Contagious Interview (G1052)," MITRE ATT&CK. <https://attack.mitre.org/groups/G1052/>

[18] "Disrupting the first reported AI-orchestrated cyber espionage campaign," Anthropic, 2025-11. <https://www.anthropic.com/news/disrupting-AI-espionage>

[19] "[Exclusive] The ROK government was breached … Ministry of Interior, MOFA, DCC, suspected North Korean hacking" (attribution uncertainty), Boannews, 2025-08. <https://m.boannews.com/html/detail.html?idx=138636>

[20] "Supply Chain Attacks 2026: npm, PyPI, VS Code, AI Agents" (behavior-based supply-chain defense), Phoenix Security, 2026. <https://phoenix.security/accelerating-supply-chain-attacks-npm-pypi-vsx-ai-enabled-2026/>

---


© 2026 Dennis Kim (HoKwang Kim) · This document is published as an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*"AI removed the DPRK's skill bottleneck. Defense must keep pace at machine speed." — CTI-2026-0628*
