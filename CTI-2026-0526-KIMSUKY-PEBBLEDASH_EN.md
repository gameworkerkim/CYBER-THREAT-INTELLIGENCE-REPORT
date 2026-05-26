# CTI-2026-0526-KIMSUKY-PEBBLEDASH

**Kimsuky (APT43) — Analysis of the New PebbleDash · AppleSeed Toolset**

> First Rust-based backdoor, abuse of VSCode · Cloudflare tunneling, and traces of LLM-generated code

**🌐 Language:** [한국어](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · **English** · [日本語](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [中文](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md)

![TLP](https://img.shields.io/badge/TLP-CLEAR-brightgreen) ![Actor](https://img.shields.io/badge/Actor-Kimsuky%20(APT43)-red) ![Attribution](https://img.shields.io/badge/Attribution-DPRK-blue) ![Confidence](https://img.shields.io/badge/Confidence-Medium--High-orange)

---

| Field | Value |
| --- | --- |
| **Classification** | TLP:CLEAR — public distribution permitted / based on open-source analysis |
| **Threat Actor** | Kimsuky (APT43, Ruby Sleet, Black Banshee, Sparkling Pisces, Velvet Chollima, Springtail) |
| **Attribution** | North Korea (DPRK) — assessed as subordinate to the Reconnaissance General Bureau (RGB) |
| **Primary Targets** | South Korean public/private sectors (government, defense, healthcare, machinery, energy); some Brazilian and German defense entities |
| **Date** | May 26, 2026 |
| **Author** | Dennis Kim, Betalabs Inc. / Independent CTI Analyst |
| **Primary Source** | Kaspersky GReAT (Securelist, 2026-05-14) |
| **Confidence** | Attribution: Medium-High / Technical analysis: High |

---

## 1. Executive Summary

On May 14, 2026, Kaspersky GReAT published an analysis of a recent campaign by the North Korea-linked threat actor **Kimsuky (APT43)**. This CTI report reconstructs that primary analysis from a South Korean defender's perspective and summarizes the new variants and tactical shifts across two malware clusters, **PebbleDash and AppleSeed**.

The key finding is not merely the emergence of new malware, but a **qualitative evolution of the attack tooling**. Kimsuky built its first backdoor (HelloDoor) in **Rust**, a language it had rarely used; abused legitimate tools such as **VSCode Remote Tunneling** and **Cloudflare Quick Tunnel** for C2 concealment; and—most notably—left **traces of apparently LLM-generated code inside the malware itself**.

### Key Findings

- Initial access is achieved through sophisticated **spear-phishing** with document-disguised attachments (`.JSE`/`.PIF`/`.SCR`/`.EXE`) and messenger-based approaches.
- The dropped malware splits into the **PebbleDash cluster** (HelloDoor, httpMalice, MemLoad→httpTroy) and the **AppleSeed cluster** (AppleSeed, HappyDoor).
- **HelloDoor** is Kimsuky's first Rust-based DLL backdoor, assessed as early-stage development, with signs of LLM-generated code (emoji debug logs).
- The AppleSeed cluster established theft of the South Korean government PKI directory `C:\GPKI` as a signature capability — shifting its center of gravity toward data exfiltration.
- The PebbleDash cluster focuses on the **defense/military sector**, expanding targets to Brazilian and German defense organizations beyond Korea.
- Post-exploitation abuses legitimate tools **VSCode** and **DWAgent** to evade traditional C2 detection.

### Threat Snapshot

| Novelty | Target Fit (Korea) | Detection Difficulty |
| --- | --- | --- |
| High — Rust/LLM/tunneling adoption | Very High — EUC-KR·GPKI·KR hosting | High — LotL via legit tools/tunneling |

---

## 2. Background — Kimsuky and the Two Malware Clusters

Kimsuky is a Korean-speaking APT group first identified by Kaspersky in 2013 and active for over a decade. Though assessed as less technically sophisticated than other DPRK-linked groups, it excels at **crafting highly targeted spear-phishing**.

Notably, **PebbleDash was originally a Lazarus Group platform**, but Kimsuky appropriated it from at least 2021 and has continuously derived its own variants.

| Aspect | PebbleDash Cluster | AppleSeed Cluster |
| --- | --- | --- |
| **First seen** | Lazarus origin → Kimsuky-exclusive since 2021 | 2019 (currently v2.1) |
| **Primary targets** | Defense/military/healthcare (global, incl. Brazil/Germany) | Government agencies (mainly Korea) |
| **Core capability** | Advanced remote-control backdoors | Information theft (docs, screenshots, keylogging, GPKI) |
| **Delivery** | JSE/EXE/SCR/PIF droppers | Mainly JSE droppers |

Both clusters share overlapping delivery and converging targets, and are **signed with the same stolen certificate and share identical mutex patterns**. Kaspersky assesses with **Medium-High confidence** that a single actor controls both clusters.

---

## 3. Threat Actor Profile — Kimsuky

### 3.1 Overview and Aliases

Kimsuky is a state-backed hacking group assessed as **subordinate to North Korea's Reconnaissance General Bureau (RGB)**. Believed to have been organized around 2012 for cyber operations against South Korea, the US, and others. Unlike Lazarus (Sony Pictures) or BlueNoroff (Bangladesh Bank), which are known for large one-off incidents, Kimsuky is characterized by **quiet, persistent espionage carried out day after day**.

The origin of the name is notable: in 2013 Kaspersky published a report named **"Kimsukyang"** after an email account belonging to a North Korean hacker; dropping the "ang" yielded "Kimsuky." In simple terms, Kimsuky is **"a state cyber-espionage unit run by the RGB"** — an army that steals information with keyboards rather than weapons.

| Vendor | Name |
| --- | --- |
| **Mandiant** | APT43 |
| **Microsoft** | Emerald Sleet (formerly THALLIUM) |
| **CrowdStrike** | Velvet Chollima |
| **Others** | Black Banshee, Archipelago, Sparkling Pisces, Springtail, Ruby Sleet |

### 3.2 Targets and Strategic Objectives

Kimsuky's collection priorities align with the RGB's mission: **acquiring intelligence that supports North Korea's diplomatic, security, and nuclear strategy**. Targets include government agencies, foreign-policy/security think tanks, defense contractors, and academia, as well as individuals such as politicians, journalists, human-rights activists, and defectors.

- **Before Oct 2020:** Government, diplomatic bodies, and think tanks tied to Korean Peninsula policy.
- **Oct 2020 – Oct 2021:** Temporary pivot to healthcare/pharma for COVID-19 response intelligence.
- **Funding:** Cryptocurrency mining/laundering using stolen data and computing power.

Its core weapon is the **combination of tailored social engineering and sophisticated malware frameworks**.

### 3.3 Major Incident History

| Period | Incident | Significance |
| --- | --- | --- |
| 2013 | Blue House/government-spoofing malicious mail | HWP exploit; prototype of later attacks |
| **2014** | **Korea Hydro & Nuclear Power (KHNP) hack** | Reactor blueprints leaked, shutdown threats; made the group famous |
| 2016 | Blue House/MOU/MOFA-spoofing mail | 4th nuclear test & THAAD; same account as KHNP |
| 2021 | KAERI, KAI, DSME, Seoul National Univ. Hospital | Nuclear/defense/aerospace/healthcare core tech |
| **2021.04** | **National Election Commission PC breach** | Classified documents leaked; revealed only in a 2023 joint audit |
| 2022.12 | Rep. Thae Yong-ho office-spoofing phishing | Defense/diplomacy/unification experts; journalist impersonation |
| 2023 | ROK-US joint exercise-timed attacks / stake.com | ~$410M in Ethereum stolen |
| 2024 | SBS reporter, Yonsei professor, MOU impersonation | Multinational (Japan MOFA, NK human-rights envoy spoofing) |
| 2025 | Seoul citizen account abuse / KT·LG U+ suspicion | Health-checkup/bank-spoofing mail; telco-breach involvement |
| 2026.01 | Malicious QR-code phishing (Quishing) | FBI alert — theft of passwords, fingerprints |

### 3.4 How Dangerous Is This Group?

Kimsuky is dangerous not because of one-off "big incidents," but because it has **conducted state-level espionage non-stop for over a decade**. Unlike Lazarus, which grabs headlines by robbing banks, Kimsuky is a quiet "shadow" group — which is precisely why the public knows so little about it. Its targets and impact, however, are anything but minor.

- **🛡️ Direct national-security impact:** Targeting nuclear (KHNP), KAERI, defense (KAI), and aerospace technology, contributing directly and indirectly to North Korea's weapons and satellite programs.
- **🗳️ Undermining democratic foundations:** A 2021 National Election Commission PC infection leaked classified documents, surfacing only in a 2023 audit — illustrating stealth and long-term dwell time.
- **🎭 Precision social engineering against individuals:** Impersonating journalists, professors, and diplomats; cloning press-outlet websites; altering email addresses by a single character; using novel malware that even experts struggle to flag.
- **🌍 Cross-border targeting:** Not only Korea but governments, research institutes, and media in the US, UK, and Japan — including spoofing of Radio Free Asia and Japan's MOFA.
- **💰 Revenue-generating attacks in parallel:** Beyond espionage, ~$410M crypto theft from stake.com — sanctions evasion and a regime funding stream.
- **🔄 Relentless evolution:** From COVID-19 vaccine intelligence to 2026 QR-code phishing (Quishing), instantly adapting to social and technological trends.

> **⚠ Key Point**
> Kimsuky's real threat is not "flashiness" but **persistence, stealth, and target precision**. Any government body, research institute, news outlet, or individual expert can become a target, and a single careless click can lead to national-secret leakage. The PebbleDash·AppleSeed campaign in this report is the **2026 face of this old threat, refined by Rust, AI, and tunneling**.

### 3.5 Sanctions and International Response

- **2023.06:** South Korea became the **first country in the world to designate Kimsuky for independent sanctions**; ROK-US joint security advisory issued.
- **2024.05:** US government issued an additional Kimsuky advisory.
- **2026.01:** FBI issued an urgent alert on malicious QR-code spear-phishing.
- **Academia/industry:** Continuous tracking by Kaspersky, Genians, ESTsecurity, Korea University's Graduate School of Information Security, and others.

> **▶ Connection to this report:** The consistent patterns above (targeting Korean government/defense/healthcare/academia, Korean-language social engineering, HWP/document disguises, Korean infrastructure) are **reproduced verbatim in this report's PebbleDash·AppleSeed campaign (2025–2026)**. The tools are new, but the operational logic continues a decade-long Kimsuky lineage.

---

## 4. Initial Access

Kimsuky sends carefully crafted spear-phishing emails to lure recipients into opening attachments, sometimes approaching targets directly via messengers. Attachments are usually **archives containing droppers**, disguised as quotations, job postings, notices, surveys, or government documents.

| # | Filename (disguise theme) | Detected | Delivered malware |
| --- | --- | --- | --- |
| 1 | [Form No.8] Personal Information Request (PIPA Enforcement Rules).hwp.jse | 2025-08-28 | HelloDoor |
| 2 | H1 2026 Domestic Graduate Master's Evening Program Selection Docs.hwpx.jse | 2025-12-14 | httpMalice |
| 3 | security_20260126.scr | 2026-01-26 | Reger Dropper → MemLoad → httpTroy |
| 4 | Ms. Noh Hyun-jung.pdf.jse | 2026-01-28 | AppleSeed chain |
| 5 | Public Service Management System On-site Inspection Evidence (Draft).pif | 2026-02-05 | Pidoc Dropper → HappyDoor |

Notably, the lure filenames **precisely mimic real South Korean public-administration, education, and privacy documents**. Rather than advanced exploitation, the primary method is **social-engineering intrusion grounded in deep understanding of Korean society**.

### 4.1 Dropper Execution Mechanism

- **JSE dropper:** Decodes Base64 blobs (lure + payload) via JScript, stores random-named files in `C:\ProgramData`. Second-stage decode via `powershell.exe -windowstyle hidden certutil -decode`, then execution via `regsvr32.exe /s` or `rundll32.exe`.
- **Reger Dropper (.SCR):** Hardcoded XOR key `#RsfsetraW#@EsfesgsgAJOPj4eml;`.
- **Pidoc Dropper (.PIF):** Single-byte XOR (`0xFF`), fully obfuscated with dummy data and encrypted strings.

---

## 5. New Malware Deep Dive

### 5.1 HelloDoor — Kimsuky's First Rust-Based Backdoor

A **Rust DLL backdoor** first identified in August 2025, notable because Rust is a language Kimsuky rarely uses. Limited functionality and simple communication suggest **early-stage development**.

| Item | Detail |
| --- | --- |
| **Persistence** | Registers value `tdll` under `HKCU\...\Run` |
| **C2** | HTTP / TryCloudflare temporary tunnel (hard to trace) |
| **Port by token** | `5555` if elevated, `5554` if not |
| **Encryption** | Base64 decode then RC4 (key: `fwr3errsettwererfs`) |
| **Query format** | `aaaaaaaaaa=2&bbbbbbbbbb=[UID]&cccccccccc=1` |

> **⚠ Signs of LLM-Generated Code**
> Emoji debug logs apparently produced by an LLM rather than a human (✅ port listening, ❌ port in use, 🔍 regsvr32 parent-process detection) were found. At the same time, typos like `result send fail`, `decrytion failed`, `autorum failed` remain — interpreted as human manual edits after AI generation. Kaspersky observed similar signs in BlueNoroff's PowerShell stealer.

### 5.2 httpMalice — Latest PebbleDash Backdoor Variant

A PebbleDash-based backdoor that emerged around December 2025. **v1.9 uses HTTP/HTTPS**, while the older **v1.8 uses the Dropbox API** for C2.

- Privilege-based persistence: `CacheDB` service (display name Administrator) if elevated, else `Everything 1.9a-[filesize]` under `HKCU\...\Run`.
- Uses `chcp 949` (EUC-KR) for host profiling → **clearly indicating Korean-speaking targets**.
- Data encrypted with **ChaCha20** then Base64; key/nonce derived from buffer pointer addresses.
- UID: `[volume serial]{8}_[elevation status]`; 13 operation modes via the `m=` parameter.

It carries traits of both clusters (high-integrity SID `S-1-12-12288` execution = PebbleDash; `m=` parameter + PowerShell collection = AppleSeed), reaffirming single-actor control.

### 5.3 MemLoad → httpTroy Chain

MemLoad is an evasion loader that performs anti-VM checks and reconnaissance before **reflectively loading the final backdoor into memory**. V2 (Mar 2025) and V3 (Sep 2025) were observed; this year's variant is a slight modification of V3.

- Persistence: `ChromeCheck` if elevated, else `EdgeCheck` (regsvr32 every minute).
- ID: `A-` (admin) or `U-` (user) prefix based on `system32` write success.
- Decrypts payload with RC4 key `#RsfsetraW#@EsfesgsgAJOPj4eml;` (same as Reger Dropper), then calls the `hello` export.

The final payload is **httpTroy**, for long-term access and exfiltration. It creates a flag file in the ADS `[path]:HUI`; C2 is `file.bigcloud.n-e[.]kr`.

### 5.4 AppleSeed Cluster — GPKI Certificate Theft as a Signature

AppleSeed appeared in 2019 (currently v2.1), split into Dropper and Spy variants. Since 2022 the key change is **collection of the `C:\GPKI` directory**, which holds the digital certificates the South Korean government uses for official authentication — a very high-risk capability for state-administrative intrusion. The same feature exists in Troll Stealer.

**HappyDoor**, disclosed by AhnLab in 2024, is an AppleSeed-based backdoor sharing the same string obfuscation, collected-data types, and RSA encryption. Assessed with **Medium confidence** as an advanced AppleSeed-derived variant.

---

## 6. Analytical Focus — Why Rust?

More telling than the fact that HelloDoor is Kimsuky's first Rust backdoor is the question **"why Rust, why now?"** — assessed as a convergence of detection evasion, development convenience, and supply realities.

### 6.1 Detection Evasion — Neutralizing Existing Signatures

PebbleDash's C/C++ signatures and YARA rules are already learned by AV/EDR. Rewriting in Rust **changes the compiled artifact's structure itself** — static linking bloats binaries; function boundaries, string layout, and control flow differ; unique name mangling appears. It puts a **"new coat" on the same backdoor to reset the detection curve**, mirroring the Rust/Go migration seen across many APTs including Lazarus and BlueNoroff.

### 6.2 LLM-Assisted Development — AI Lowering the Entry Barrier

The coexistence of emoji debug logs and residual typos suggests the developers were **handling an unfamiliar language with AI assistance for the first time**. Rust is notoriously hard to enter (ownership, borrow checker), and an LLM dramatically lowers that learning cost. A pure human expert would not have left such clumsy traces — indicating a **transitional phase where AI boosts productivity but full automation is not yet achieved**.

### 6.3 Secondary Motives — Rust's Own Benefits (Currently Limited)

- Memory safety reduces crashes → improved backdoor stability/stealth.
- Cross-platform compilation and rich crates ease feature integration.
- Static linking minimizes external dependencies.

But since HelloDoor is an **early-stage artifact**, stability is unlikely the main driver. The core is the combination of **detection evasion + AI-assisted development**.

> **▶ Signal for defenders:** More important than "why Rust" is tracking **whether core PebbleDash backdoors (httpMalice-class) get rewritten in Rust within 6–12 months**. If full migration is confirmed, much signature-based detection may need redesign.

---

## 7. Post-Exploitation — Living-off-the-Land (LotL)

### 7.1 Abuse of VSCode Remote Tunneling

Kimsuky abuses legitimate Visual Studio Code Remote Tunneling for covert remote access. Instead of dropping malware, it downloads the legitimate VSCode CLI to create a tunnel, leaving **far fewer detection points**. Authentication defaults to a **GitHub account** in non-interactive contexts.

- JSE method: tunnel name `bizeugene`; POSTs the generated `vscode.dev/tunnel` URL and device code to a compromised Korean site (`yespp.co[.]kr`).
- New Go installer (`vscode_payload`): sends debug/tunnel URLs to a **Slack WebHook**.

The target machine ends up communicating with **Microsoft-owned servers**, so users do not realize the traffic originates from an attacker.

### 7.2 Abuse of the DWAgent RMM Tool

DWAgent, a legitimate RMM tool, is abused either by installing on httpMalice-infected hosts or via a dedicated installer. The installer shares the same RC4 key/structure as Reger Dropper and immediately activates a remote session via an attacker-linked `config.json` (through legitimate relay `node*.dwservice[.]net`).

---

## 8. Infrastructure and Victimology

Kimsuky uses the Korean free domain-hosting service **naedomain.hankook** (`.p-e.kr`, `.o-r.kr`, `.n-e.kr`, `.r-e.kr`, `.kro.kr`) to mimic legitimate sites, with backend infrastructure mostly on InterServer VPS. Since many actors abuse this service, it is not standalone attribution evidence. It also uses compromised legitimate Korean sites as C2 and hides infrastructure via Cloudflare/VSCode/Ngrok tunneling.

Victimology analysis found infection logs uploaded to httpMalice's Dropbox C2, with each victim folder containing a `user.txt` recording target info **in Korean** ("장악/seized", "http exists", "DWService exists") — evidence of manual victim management.

### 8.1 Attribution

- Many samples from both clusters are **signed with the same stolen certificate** and share mutex patterns.
- PebbleDash has been found exclusively in Kimsuky attacks since 2021.
- Technically linked to Microsoft **Ruby Sleet** and Mandiant **Cerium → APT43**.
- Overall assessment: **attributed to a Kimsuky-linked cluster with Medium-High confidence**.

---

## 9. MITRE ATT&CK Mapping

| Tactic | Technique | Observation |
| --- | --- | --- |
| Initial Access | T1566.001 Spearphishing Attachment | Document-disguised JSE/PIF/SCR |
| Execution | T1059.001/.007 PowerShell/JScript | certutil decode, JScript dropper |
| Execution | T1218.010/.011 Regsvr32/Rundll32 | Payload execution (LOLBin) |
| Persistence | T1547.001 Run Keys | tdll, Everything 1.9a |
| Persistence | T1543.003 Windows Service | CacheDB service |
| Persistence | T1053.005 Scheduled Task | ChromeCheck / EdgeCheck |
| Defense Evasion | T1620 Reflective Loading | MemLoad in-memory loading |
| Defense Evasion | T1553.002 Code Signing | Stolen Korean certificates |
| Defense Evasion | T1564.004 ADS | httpTroy :HUI stream |
| C2 | T1572 Protocol Tunneling | VSCode·Cloudflare·Ngrok |
| C2 | T1102 Web Service | Dropbox·Slack WebHook |
| C2 | T1219 Remote Access Software | DWAgent |
| Collection | T1056.001 Keylogging | AppleSeed Spy |
| Exfiltration | T1041 Exfil over C2 | GPKI certificate/document theft |

---

## 10. Detection and Response

### 10.1 Immediate Detection Points

- Block double-extension attachments (`.hwp.jse`, `.pdf.jse`, `.scr`, `.pif`) at the mail gateway.
- Detect `regsvr32.exe /s` and `rundll32.exe` executing random-named files in `C:\ProgramData`.
- Alert on PowerShell `certutil -decode` + `-windowstyle hidden`.
- Check for scheduled tasks `ChromeCheck`/`EdgeCheck` and service `CacheDB`.
- Monitor abnormal `code.exe tunnel`, and `*.trycloudflare.com` / `vscode.dev/tunnel` / `*.dwservice.net` traffic.
- Detect unauthorized access/archiving/exfiltration of `C:\GPKI` — government bodies first.

### 10.2 Organizational Response

- Review non-business traffic to naedomain.hankook free domains at proxy/DNS level.
- Allowlist RMM/dev tools (VSCode, DWAgent) and monitor GitHub device-auth flows.
- Defense/government/healthcare should recognize they are **priority PebbleDash targets**; strengthen spear-phishing drills and EDR rules.
- Apply appendix IOCs to SIEM/EDR/firewalls and retro-hunt historical logs.

---

## 11. Response by the South Korean Government and Authorities

Kimsuky is the hacking group **South Korea was the first in the world to place under independent sanctions**. As a Korea-specific threat, organizations should actively use domestic reporting/response channels rather than merely consuming global IOCs.

### 11.1 Incident Reporting Channels

The government recommends reporting **regardless of whether an actual breach occurred** if you believe you are a target of DPRK spear-phishing.

| Agency | Hotline | Role |
| --- | --- | --- |
| **NIS (National Intelligence Service)** | **111** | State-backed cyber threats, public/critical infrastructure |
| **National Police Agency** | **182** | Cybercrime investigation and criminal response |
| **KISA (Korea Internet & Security Agency)** | **118** | Private-sector incident intake, root-cause analysis, technical support |
| **Boho Nara / KrCERT/CC** | **boho.or.kr** | Online hacking/ransomware reporting, SMB support |

### 11.2 Legal Reporting Obligations (Network Act)

- ICT service providers must report to the Minister of Science and ICT or KISA **within 24 hours** of becoming aware (Article 48-3).
- Late or non-reporting may incur a **fine up to KRW 30 million** (Article 76).
- Article 48-4 requires evidence preservation/submission and cooperation with on-site investigations.
- If personal-data leakage is involved, a **separate breach notification** under the Personal Information Protection Act is required.

### 11.3 Proactive and Diplomatic Measures

- **Independent sanctions:** Kimsuky designated for sanctions, linked to ROK-US joint sanctions on DPRK IT workers.
- **ROK-US cooperation:** Ongoing joint security advisories.
- **Public-private intelligence sharing:** Sharing via KISA's **C-TAS** and real-time situation dissemination.
- **Cyber crisis alerts:** Five-level system (Normal–Attention–Caution–Alert–Severe).

> **▶ Recommendation:** Priority PebbleDash sectors (government, defense, healthcare) should immediately apply IOCs to C-TAS/own EDR and enable dedicated audit logging for GPKI access. On suspected breach, comply with the 24-hour reporting duty and prioritize capturing memory/disk images for evidence.

---

## 12. Analyst Assessment

This campaign's significance is that Kimsuky, via LLMs, is **rapidly updating the perception that it is a "less sophisticated group."** Rust adoption, LotL abuse of legitimate tools, and tunneling-based concealment all evolve toward harder detection and attribution.

The **signs of LLM-generated code** in particular suggest the DPRK actor is in a **transitional phase where AI boosts productivity but full automation is not yet achieved**. Kaspersky likewise notes that while AI may automate parts of an attack, building a fully automated attack is non-trivial. In short, **AI accelerates threats but does not replace them**, and the traditional approach of holistically tracking malware, initial vectors, targets, post-exploitation, and ultimate goals remains valuable.

The implication for Korea is clear. EUC-KR targeting, precise mimicry of Korean administrative documents, GPKI theft, and Korean free-hosting C2 make this **an inherently Korea-specific threat**. Rather than passively consuming global-vendor IOCs, the core countermeasure is **building local detection logic** for Korean-language lure patterns and GPKI access behavior.

---

## Appendix A. Indicators of Compromise (IOC)

### A.1 File Hashes (MD5)

| Category | MD5 | Note |
| --- | --- | --- |
| JSE Dropper | `995a0a49ae4b244928b3f67e2bfd7a6e` | →HelloDoor |
| JSE Dropper | `52f1ff082e981cbdfd1f045c6021c63f` | →httpMalice |
| JSE Dropper | `9fe43e08c8f446554340f972dac8a68c` | →httpMalice |
| JSE Dropper | `8e15c4d4f71bdd9dbc48cd2cabc87806` | →AppleSeed |
| Reger Dropper | `65fc9f06de5603e2c1af9b4f288bb22c` | security_*.scr |
| Reger Dropper | `c19aeaedbbfc4e029f7e9bdface495b9` | secu.scr |
| Pidoc Dropper | `8983ffa6da23e0b99ccc58c17b9788c7` | .pif |
| AppleSeed | `a7f0a18ac87e982d6f32f7a715e12532` | Dropper |
| AppleSeed | `f4465403f9693939fe9c439f0ab33610` | Dropper |
| AppleSeed | `5c373c2116ab4a615e622f577e22e9be` | Dropper |
| HappyDoor | `d1ec20144c83bba921243e72c517da5e` | |
| MemLoad | `58ac2f65e335922be3f60e57099dc8a3` | |
| MemLoad | `f73ba062116ea9f37d072aa41c7f5108` | jhsakqvv.dat |
| httpTroy | `7e0825019d0de0c1c4a1673f94043ddb` | config.db |
| httpMalice | `08160acf08fccecde7b34090db18b321` | |
| httpMalice | `94faed9af49c98a89c8acc55e97276c9` | |
| HelloDoor | `c42ae004badddd3017adadbdd1421e00` | |
| VSCode installer | `9ca5f93a732f404bbb2cee848f5bbda0` | xipbkmaw.exe |
| DWAgent installer | `678fb1a87af525c33ba2492552d5c0e2` | |

### A.2 Domains and C2

| Indicator | Type | Associated malware |
| --- | --- | --- |
| `opedromos1.r-e[.]kr` | Domain | AppleSeed C2 |
| `morames.r-e[.]kr` | Domain | AppleSeed C2 |
| `load.ssangyongcne.o-r[.]kr` | Domain | MemLoad C2 |
| `load.yju.o-r[.]kr` | Domain | MemLoad C2 |
| `attach.docucloud.o-r[.]kr` | Domain | MemLoad C2 |
| `load.supershop.o-r[.]kr` | Domain | MemLoad C2 |
| `load.erasecloud.n-e[.]kr` | Domain | MemLoad C2 |
| `cms.spaceyou.o-r[.]kr` | Domain | HappyDoor C2 |
| `erp.spaceme.p-e[.]kr` | Domain | HappyDoor C2 |
| `file.bigcloud.n-e[.]kr` | Domain | httpTroy C2 |
| `load.auraria[.]org` | Domain | httpTroy C2 |
| `female-disorder-beta-metropolitan.trycloudflare[.]com` | Tunnel | HelloDoor C2 |
| `www.pyrotech.co[.]kr/.../default.php` | Compromised site | httpMalice C2 |
| `newjo-imd[.]com/.../default.php` | Compromised site | httpMalice C2 |
| `www.yespp.co[.]kr/.../out.php` | Compromised site | VSCode tunnel theft |

> ※ These indicators are based on Kaspersky GReAT's public analysis (2026-05-14). Use for defensive purposes only and review for false positives in your environment before applying.

---

## Appendix B. Sources

1. Kaspersky GReAT (Sojun Ryu), ["Kimsuky targets organizations with PebbleDash-based tools"](https://securelist.com/kimsuky-appleseed-pebbledash-campaigns/119785/), Securelist, 2026-05-14.
2. Gen Digital Threat Labs, "DPRK's Playbook: Kimsuky's HttpTroy and Lazarus's New BLINDINGCAN Variant", 2025-10.
3. AhnLab ASEC, HappyDoor analysis report, 2024.
4. Microsoft, "Latest intelligence on North Korean and Chinese threat actors" (Ruby Sleet), CyberWarCon, 2024-11.
5. Mandiant/Google Cloud, "APT43 / Mapping DPRK Groups to Government".

---

**Author:** Dennis Kim, Betalabs Inc. / Independent CTI Analyst
**Distribution:** [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*This document is a threat-intelligence analysis synthesized and reconstructed from open-source intelligence (OSINT) for defensive information sharing. All primary technical analysis originates from Kaspersky GReAT, with the author's interpretation and assessment added.*

`TLP:CLEAR` · `CTI-2026-0526-KIMSUKY-PEBBLEDASH` · Dennis Kim CTI
