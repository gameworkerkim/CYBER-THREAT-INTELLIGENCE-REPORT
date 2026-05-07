# ScarCruft Compromises a Yanbian Gaming Platform — A Wholesale Supply-Chain Takeover

> **APT37's sqgame[.]net intrusion — Cross-platform Windows·Android trojanization, espionage operation against ethnic Koreans and North Korean defectors in Yanbian**
> *New BirdCall(zhuagou) Android variant · Zoho WorkDrive C&C · Simultaneous targeting of Korean digital certificates (.p12) and Hancom documents (.hwp) · China→DPRK tool genealogy*

---

## Document Information

| Item | Detail |
| --- | --- |
| **Report ID** | `CTI-2026-0507-SCARCRUFT` |
| **Classification** | `TLP:GREEN` — Public sharing permitted |
| **Type** | Threat Actor & Supply-Chain Incident Report |
| **Severity** | 🔴 **HIGH** — National security espionage operation; potential physical harm to human targets |
| **Target Sector** | Gaming platforms · Mobile applications · Korean diaspora communities |
| **Target Region** | Yanbian (延边) Korean Autonomous Prefecture, China · DPRK–China border zone |
| **Threat Actor** | **ScarCruft / APT37 / Reaper** (DPRK-aligned espionage group, active since 2012) |
| **Malware** | BirdCall (Windows + new Android port) · RokRAT (first-stage loader) |
| **Internal Codename** | zhuagou (抓狗) — Chinese hacker-community jargon |
| **Activity Window** | November 2024 ~ ongoing (public disclosure: 2026-05-05 by ESET) |
| **Primary Source** | ESET Research, *"A rigged game: ScarCruft compromises gaming platform in a supply-chain attack"* (Filip Jurčacko, 2026-05-05) |
| **Publication Date** | 7 May 2026 |
| **Publisher** | Dennis Kim — [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |

---

## Table of Contents

1. [Summary](#1-summary)
2. [Incident Overview](#2-incident-overview)
3. [Incident Timeline](#3-incident-timeline)
4. [Attack-Chain Technical Analysis](#4-attack-chain-technical-analysis)
5. [ScarCruft / APT37 Threat-Actor Profile](#5-scarcruft--apt37-threat-actor-profile)
6. [BirdCall — Analysis of the New Android Variant](#6-birdcall--analysis-of-the-new-android-variant)
7. [Korea-Specific Threat — Simultaneous `.p12` and `.hwp` Targeting](#7-korea-specific-threat--simultaneous-p12-and-hwp-targeting)
8. [Indicators of Compromise (IoCs)](#8-indicators-of-compromise-iocs)
9. [MITRE ATT&CK Mapping](#9-mitre-attck-mapping)
10. [Response Recommendations](#10-response-recommendations)
11. [Strategic Implications](#11-strategic-implications)
12. [References](#12-references)
13. [Appendix A. Glossary](#appendix-a-glossary)

---

## 1. Summary

On 5 May 2026, the Slovak security vendor ESET disclosed a multi-platform supply-chain attack by the DPRK-aligned APT group **ScarCruft (APT37)**. The target was **sqgame[.]net**, a gaming platform serving the Yanbian (延边) Korean Autonomous Prefecture community in China; both the Windows desktop client update package and the Android game APKs distributed via this platform were trojanized.

The campaign has been active since at least late 2024 — over 18 months — and ESET confirms that some malicious APKs remain published on the official sqgame website at the time of writing. ESET notified sqgame in December 2025 but has not received a response.

**Three issues make this incident decisive.**

**First**, ScarCruft has weaponized a new Android port (zhuagou) of the BirdCall backdoor, which it had previously confined to Windows. ESET identified seven distinct versions, from v1.0 (compiled around October 2024) through v2.0 (around June 2025) — evidence not of a one-off tool but of an **actively developed and operated mobile espionage platform**.

**Second**, the file-extension targeting list explicitly includes Korean public/financial certificate format **`.p12`** and Hancom Office document format **`.hwp`**. This goes beyond intelligence collection: it implies a precision operation aimed at **direct access to victims' Korean financial accounts and government services**.

**Third**, the backdoor's internal codename **zhuagou (抓狗)** is not the literal Chinese phrase ("catching dogs") but rather **established jargon in Chinese hacker, cracking, and game-cheat communities**, used since around 2012 as a standard label for information-collection, credential-theft, and user-tracking modules. This strongly suggests the tool's lineage **originated in Chinese hacker communities and was acquired and upgraded by the DPRK's ScarCruft** (detail in §6.1).

> ⚠ **A grim implication**: Yanbian is the principal first transit region for North Korean defectors. This operation can effectively serve to **identify the names, locations, and contact networks of defectors, their facilitators, and human-rights activists** — a threat that should be classified not merely as cybersecurity but as **physical-safety** risk.

### Key Judgments

| # | Judgment | Confidence |
| --- | --- | --- |
| **KJ-1** | The operation aligns with ScarCruft's established TTPs and is assessed as a DPRK Reconnaissance General Bureau (RGB) espionage campaign. | **High** |
| **KJ-2** | Primary targets are Yanbian-based ethnic Koreans, with North Korean defectors, defector facilitators, and human-rights activists most likely. | **High** |
| **KJ-3** | The simultaneous `.p12` and `.hwp` targeting establishes Korean financial and government-service access as an explicit operational objective. | **Medium** |
| **KJ-4** | The Android BirdCall port is not a one-off implant but ScarCruft's actively maintained mobile espionage platform — seven versions discovered between v1.0 (2024-10) and v2.0 (2025-06). | **High** |
| **KJ-5** | sqgame's silence and the persistence of malicious APKs indicate the **attack surface remains active** at present. | **High** |
| **KJ-6** | Korea-resident ethnic Koreans, defectors, and personnel of associated NGOs and religious organizations are likely targets of the same or related campaigns. | **Medium** |
| **KJ-7** | Synthesizing the hacker-community semantics of the codename zhuagou (抓狗), the tool's direct lineage is assessed to originate from a Chinese hacker-community information-collection module that ScarCruft subsequently acquired and upgraded. | **Medium-High** |

---

## 2. Incident Overview

### 2.1 Targeted Platform Profile

| Item | Detail |
| --- | --- |
| **Platform** | sqgame (primary domain: `sqgame[.]net`; download domain: `sqgame.com[.]cn`) |
| **Service** | Traditional card and board games for the Yanbian region (flagships: 延边红十 / Yanbian Red Ten, 新画图 / New Drawing) |
| **Supported platforms** | Windows · Android · iOS (no iOS trojanization observed) |
| **Hosting IP** | `39.106.249[.]68` — Hangzhou Alibaba Advertising Co., Ltd. |
| **Hosting migration** | 2024-06-01 (to current IP) |
| **User base** | Residents of the Yanbian Korean Autonomous Prefecture; primarily Go-Stop and local card games |

### 2.2 Attack-Chain Summary

| Platform | Compromise Vector | Delivered Payload |
| --- | --- | --- |
| **Windows** | Tampering of the sqgame desktop-client **update package** (`xiazai.sqgame.com[.]cn/dating/20240429.zip`) | Trojanized `mono.dll` → downloader → **RokRAT** → **BirdCall** |
| **Android** | **Repackaging and re-signing** of two game APKs from the sqgame download page (`ybht.apk`, `sqybhs.apk`) | **Android BirdCall (zhuagou)** loaded directly |
| **iOS** | No trojanization observed. ScarCruft likely avoided the cost of bypassing Apple's review process; iPhone usage among defectors is also rare. | — |

### 2.3 Victimology

ESET's analysis prioritizes targets as follows:

1. **Yanbian-resident ethnic Koreans** — sqgame is a platform tailored to traditional Yanbian games, making this primary target group self-evident.
2. **North Korean defectors and facilitators** (brokers, NGO staff, religious activists) — Yanbian is the main first-transit zone for defectors and a top tracking priority for the DPRK regime.
3. **Korea-resident ethnic-Korean families** — identified as secondary targets via contacts, SMS, and call records collected on victim devices.
4. **Holders of Korean government and financial assets** — a separate target group implied by the `.p12` and `.hwp` targeting.

---

## 3. Incident Timeline

| Date | Event |
| --- | --- |
| **2012 ~** | ScarCruft begins operations (registered as MITRE G0067) |
| **2021** | BirdCall (Windows) first identified. ESET attributes it to ScarCruft via private intelligence. South Korean vendors (S2W, AhnLab) publicly report it as a "Matryoshka variant of RokRAT" in the same period. |
| **2024-06-01** | sqgame migrates to its current IP (`39.106.249[.]68`, Alibaba) — estimated establishment of campaign infrastructure |
| **~ October 2024** | Android BirdCall **v1.0** compiled (per ESET analysis) |
| **~ November 2024** | The trojanized `mono.dll` in the sqgame Windows-client update package is first observed in ESET telemetry |
| **2024-11-04** | Compromised Korean site `www.lawwell.co[.]kr` (SK Broadband) begins hosting shellcode |
| **March – July 2025** | Additional Korean sites (`1980food.co[.]kr`, `inodea[.]com`, `colorncopy.co[.]kr`, `sejonghaeun[.]com`, `cndsoft.co[.]kr`) are sequentially recruited to host shellcode, configurations, and a clean mono library |
| **~ June 2025** | Android BirdCall **v2.0** compiled (with strengthened obfuscation) |
| **2025-10** | ESET directly verifies two trojanized Android APKs on the sqgame website |
| **2025-12** | ESET notifies sqgame of the compromise. **No response received.** |
| **2026-05-05** | ESET publicly discloses the analysis on WeLiveSecurity (Filip Jurčacko) |
| **As of 2026-05-05** | ESET confirms that some malicious APKs **remain published** on the official sqgame website |
| **2026-05-07** | This CTI analysis published |

> 📌 **What the June 2024 → October–November 2024 gap implies**: a roughly four-to-five-month preparation window separates infrastructure migration from the start of trojanization. ScarCruft did not weaponize sqgame immediately upon compromise; rather, it conducted **substantial reconnaissance and tool adaptation (notably the new Android port) — characteristic of a precision operation**.

---

## 4. Attack-Chain Technical Analysis

### 4.1 Windows Chain — Four-Stage Multi-Loader

| Stage | Component | Behavior |
| --- | --- | --- |
| **① Update tampering** | `xiazai.sqgame.com[.]cn/dating/20240429.zip` | The legitimate sqgame client auto-downloads via its standard update channel |
| **② Trojanized mono.dll** | `95BDB94F6767A3CCE6D92363BBF5BC84B786BDB0` | A clean mono library is patched with additional code/data, including a downloader |
| **③ Downloader behavior** | (in-memory) | (a) Checks for analysis tools and VM environments — aborts if found; (b) locates the sqgame client process; (c) downloads and executes shellcode from a compromised Korean site; (d) terminates the client process; (e) **automatically replaces the trojanized mono.dll with a clean version** — removing forensic traces |
| **④ RokRAT → BirdCall** | Shellcode payload | RokRAT loads first; RokRAT then downloads and installs the more sophisticated BirdCall |

> 🔑 **TTP of note — self-cleanup**: After completing its work, the downloader automatically replaces the trojanized `mono.dll` with a clean copy, **completely erasing infection traces from post-compromise static analysis**. This is an OPSEC pattern engineered for ScarCruft's long-dwell operations.

### 4.2 Android Chain — Repackaging Model

ScarCruft is assessed not to have obtained sqgame's source code. Instead, it used **decompilation, repackaging, and re-signing** of already-built legitimate APKs.

| Modification | Detail |
| --- | --- |
| **AndroidManifest.xml change** | Entry-point activity changed to malicious code (`com.example.zhuagou.SplashScreen` or `com.mob.util.MobSs`) |
| **Backdoor activity/service additions** | New components registered to execute the malicious code |
| **Permission additions** | Broad permissions requested: contacts, SMS, call logs, external storage, audio recording, location |
| **Original game preserved** | The backdoor invokes the original game activity after launch — preventing user suspicion |

### 4.3 C&C Infrastructure — Abuse of Legitimate Cloud Services

ScarCruft's signature TTP — **C&C built on legitimate cloud services** — persists in this campaign. Android BirdCall supports three cloud providers in code, but operationally uses only Zoho WorkDrive.

| Cloud | Operational Status | Use |
| --- | --- | --- |
| **Zoho WorkDrive** | ✅ Active (12 accounts identified) | Command polling and data exfiltration |
| **pCloud** | Supported in code, not used | Backup channel |
| **Yandex Disk** | Supported in code, not used | Backup channel |

The 12 identified Zoho accounts all use English-name disguise patterns (`tomasalfred37@`, `kalimaxim279@`, `smithbentley0617@`, etc.), assessed as a tactic to avoid the immediate suspicion that Korean or Chinese names would draw from analysts.

### 4.4 Compromised Korean Web Infrastructure

ScarCruft compromised the following Korean infrastructure to host shellcode, BirdCall configuration images (encoded in JPG overlays), and a clean mono library:

| Domain | IP | Hosting Provider | Use |
| --- | --- | --- | --- |
| `1980food.co[.]kr` | `211.239.117[.]117` | Hostway IDC | Android BirdCall configuration image |
| `inodea[.]com` | `114.108.128[.]157` | LG DACOM | Android BirdCall configuration image |
| `www.lawwell.co[.]kr` | `221.143.43[.]214` | SK Broadband | Shellcode + clean mono library |
| `colorncopy.co[.]kr` / `swr.co[.]kr` | `222.231.2[.]20` | LG DACOM | Shellcode |
| `sejonghaeun[.]com` | `222.231.2[.]23` | (IP Manager) | Clean mono library |
| `cndsoft.co[.]kr` | `222.231.2[.]41` | (IP Manager) | Shellcode |

> 📍 **Domestic implication for Korea**: Six Korean domains being recruited as hosting resources in a single campaign confirms that **the security hygiene of Korean SMB web-hosting environments has become a preferred operational asset for DPRK APTs**. KISA and the Ministry of Science and ICT should reassess the effectiveness of their SMB-security inspection programs.

---

## 5. ScarCruft / APT37 Threat-Actor Profile

### 5.1 Group Overview

| Item | Detail |
| --- | --- |
| **Aliases** | ScarCruft · APT37 · Reaper · Group123 · Ricochet Chollima · Inky Squid |
| **Active since** | 2012 ~ present |
| **Suspected attribution** | DPRK Reconnaissance General Bureau (RGB) espionage unit (MITRE G0067) |
| **Primary targets** | South Korean government, defense, media, defectors; selected targets in Japan, the Middle East, and Southeast Asia |
| **Primary motivation** | Espionage — limited financial motivation (distinguishing it from Lazarus) |
| **Distinguishing TTPs** | Legitimate-cloud C&C, Hancom Office (.hwp) exploits, history of Flash zero-day use, Korean-language decoys |

### 5.2 BirdCall — ScarCruft's Signature Backdoor

BirdCall is a Windows C++ backdoor that ESET attributed to ScarCruft via private intelligence reporting in 2021. South Korean vendors S2W and AhnLab publicly described it in the same period as a **"Matryoshka variant of RokRAT"**. BirdCall thus represents an **upper tier of sophistication** within ScarCruft's core RokRAT-family backdoor lineage.

### 5.3 Distinction from Lazarus

ScarCruft is often confused with Lazarus, but the differences are clear:

| Dimension | ScarCruft (APT37) | Lazarus |
| --- | --- | --- |
| **Parent organization** | RGB espionage unit | RGB + Workers' Party Office 41, etc. |
| **Primary motivation** | Pure espionage | Espionage + **foreign-currency acquisition (financial crime)** |
| **Targeted assets** | Government documents, human intelligence, communications | Government + **financial institutions, crypto exchanges, DeFi** |
| **Supply-chain pattern** | Targeted SaaS compromise (e.g., sqgame) | Broad NPM/3CX-style compromises of global developer tooling |

The sqgame operation aligns precisely with the ScarCruft pattern.

---

## 6. BirdCall — Analysis of the New Android Variant

### 6.1 Internal Codename zhuagou (抓狗) — Not Mere Naming, but a Lineage Clue

The internal codename of the Android BirdCall, as identified in the ESET report, is the Chinese **zhuagou (抓狗)**. ESET's text glosses this literally as "catching dogs." This analysis argues that the term goes beyond literal Chinese: it is **established jargon in the Chinese hacker community**.

#### 6.1.1 What zhuagou (抓狗) Means in the Chinese Hacker Community

In Chinese cracking, malware, and game-cheat communities, "抓狗" has been used since approximately 2012 as a standard module-name designation for:

- **Account/credential harvesting** — usernames, passwords, session tokens, certificate files
- **User tracking** — location, behavior, login times, contact-graph mapping
- **Log harvesting** — keystrokes, messages, call logs, etc.
- **Detection and hooking** — hooking target processes for data extraction
- **Target acquisition** — identifying, isolating, and gaining control of victims

In short, "抓狗" is not the literal "catching dogs" a casual Chinese speaker would parse, but **a standard naming convention for information-collection / tracking / credential-theft modules used in the Chinese hacker scene for nearly 14 years**. It is a long-established jargon term widely seen across game cheats, trojans, and banking malware.

#### 6.1.2 What It Means That This Tool Is Named zhuagou

ScarCruft's choice of zhuagou for its Android backdoor is not a matter of naming taste. It encodes three concurrent layers of meaning:

| Layer | Interpretation |
| --- | --- |
| **Literal** | Operators conceive of targets metaphorically as "dogs" — Yanbian ethnic Koreans and defectors are objectified as quarry to be tracked and captured. |
| **Functional** | The backdoor's actual capabilities (information collection, credential theft, tracking) align exactly with the standard feature set of the Chinese-hacker zhuagou module class. |
| **Genealogical** | The tool's direct ancestor is plausibly a member of the Chinese-hacker zhuagou module lineage. ScarCruft did not create the tool ex nihilo; it more likely **acquired, ported, and enhanced the code, ideas, and techniques of an existing Chinese information-collection module**. |

> 📍 **Original contribution of this analysis**: ESET's report treats zhuagou as a literal translation ("catching dogs"). From the perspective of this archive, which has tracked Korean and Chinese hacker-scene activity, **the naming is a decisive lineage clue**. We assess that ScarCruft incorporated an existing Chinese-scene zhuagou-class module, upgraded it, and folded it into its own operations.

#### 6.1.3 Circumstantial Evidence for China → DPRK Tool Acquisition

Circumstantial evidence supporting hypothesis KJ-7:

- A publicly available Windows BirdCall dump (SHA-1: `B06110E0FEB7592872E380B7E3B8F77D80DD1108`) was **uploaded to VirusTotal from China on 15 July 2024**. This sample closely resembles the BirdCall in this campaign, suggesting collection by a Chinese security researcher or analyst.
- The Android port's package name retains `com.example.zhuagou.SplashScreen`, which violates standard package-naming conventions (reverse-DNS domains). **`com.example` is the default sample namespace from Android development tutorials** and reads as a marker of **a quickly repackaged existing codebase**.
- ScarCruft's history of tool acquisition: the group has previously absorbed and reworked external tools, notably RokRAT (first analyzed by Cisco Talos in 2017). The acquisition of the zhuagou lineage continues this pattern.
- A broader China → DPRK cyber-tool transfer pattern: multiple security vendors have reported flows of Chinese-scene game-cheat and banking-trojan tools into DPRK, Iranian, and Russian APT operations. The zhuagou case is interpretable as one instance of this flow.

> ⚠ **Confidence caveat**: This analysis is **lexical and circumstantial inference** rather than a definitive attribution backed by primary technical evidence such as code-equivalence comparisons. Confidence is rated "Medium-High" (KJ-7). A stronger claim would require comparison between the decompiled output of zhuagou-class Chinese-scene tools and the BirdCall Android implementation.

### 6.2 Version History

| Version | Estimated Compile Date | Notable Changes |
| --- | --- | --- |
| **v1.0** | ~ October 2024 | Initial deployment |
| **v1.3 / v1.5** | Early-to-mid 2025 | Command additions and stabilization |
| **v2.0** | ~ June 2025 | **Strengthened obfuscation** (MITRE T1406) |

Seven versions were deployed over roughly eight months — an average refresh interval of 5–6 weeks. This indicates not a one-off tool but an **active operational platform** showing **patterns of evasion aligned with the OS-update cycle and antivirus detection/update cycles**. The cadence is notably similar to Android's security-patch cycle, suggesting **continuous updates targeted at evading Android security improvements**.

### 6.3 Core Capabilities

| Category | Detail |
| --- | --- |
| **Personal data collection** | Contacts, SMS messages, call logs |
| **File collection** | Full directory enumeration of external storage → staging files of targeted extensions |
| **Targeted extensions** | `.jpg .doc .docx .xls .xlsx .ppt .pptx .txt .hwp .pdf .m4a .p12` |
| **Screen capture** | Periodic screenshots when the `scr` flag is enabled |
| **Audio recording** | Microphone-area recording when `rec` is enabled — **restricted to local time 19:00–22:00** |
| **Remote update** | Auto-loads new APK versions via the `MP_SEND_FILE` command |
| **C&C communication** | HTTPS via okhttp3, Zoho WorkDrive API |

> 🔍 **Operational meaning of the 19:00–22:00 audio window**: Restricting audio collection to the evening hours — when targets are most likely to be with family or in private gatherings — is not mere automation but **a HUMINT-augmenting design intended to map the target's family and associates**. This reaffirms the operation's espionage character.

### 6.4 Background Persistence — The Silent-MP3 Trick

A noteworthy technique observed in some versions: **looping playback of a silent MP3 file in the background** to evade the OS's background-process termination policies. This design ensures stable audio capture when recording is enabled and represents a relatively new TTP for sustaining background espionage in mobile environments.

### 6.5 Commands — A Subset of the Windows Set

Android BirdCall implements a **subset of the Windows command set**. Commands not implemented on Android include shell execution (`MP_ACTION_SHELL`), HTTP port scanning (`MP_ACTION_WEBSCAN`), word-processor macro enablement (`MP_ACTIONS_MORE`), and browser credential theft. **However, all core espionage capabilities are ported.**

---

## 7. Korea-Specific Threat — Simultaneous `.p12` and `.hwp` Targeting

### 7.1 `.p12` — Korean Public/Financial Certificates

The PKCS#12 container format `.p12` is a global standard, but **carries a particularly distinctive meaning in Korea**.

| Korean assets stored in `.p12` files |
| --- |
| **Public Certificate (구 공인인증서, now Joint Certificate)** — required for Government24, Hometax, Internet banking, and securities trading |
| **Financial Certificate** — co-issued by banks; combined password + certificate authentication |
| **Code-signing certificates** — for software signing |
| **S/MIME email certificates** — for government and enterprise secure mail |

If a victim's `.p12` is exfiltrated and the corresponding password is captured via keylogging, screen capture, or SMS one-time-code interception, the attacker reaches a state of **direct authenticated login to the victim's Korean bank, brokerage, and government-service accounts**. Given that many Yanbian ethnic Koreans hold Korean certificates for cross-border travel, remittances, and pension reception, this is a decisive asset.

### 7.2 `.hwp` — Hancom Office Documents

`.hwp` is the standard format of Hancom Office and the **de facto standard document format of the Korean government, public agencies, and many Korean enterprises**. ScarCruft has a documented history of `.hwp` exploitation (e.g., EPS-handling flaws).

| Information types implied by `.hwp` targeting |
| --- |
| Official documents from government and public agencies (immigration, tax, welfare, etc.) |
| Documents from Korean NGOs and religious organizations (defector-support NGOs heavily use `.hwp`) |
| Legal materials from law firms and attorneys |
| Community publications: school and church bulletins, etc. |

### 7.3 The Combined Significance of Targeting Both Extensions

The simultaneous appearance of `.p12` and `.hwp` **on the same backdoor's targeted-extension list is not coincidence**. The pairing addresses two operational axes at once:

| Axis | `.hwp` | `.p12` |
| --- | --- | --- |
| **Purpose** | Map the target's Korean social activity (with whom, what is exchanged) | Direct access to the target's Korean assets |
| **Value** | Intelligence value (intel) | Operational value |
| **Combined effect** | **Identification of the target's Korean network → direct authenticated penetration via certificate** | |

> 📍 **Original judgment of this report**: ESET's text simply lists the targeted extensions. From the Korean security community's perspective, the combination of these two extensions should be reinterpreted not as an incidental side-effect of espionage but as **a core pillar of the operation's design**. This report flags this interpretation as the most important Korea-side implication of the incident.

### 7.4 `.m4a` — Additional Significance of Voice Recordings

The inclusion of `.m4a` deserves attention. It is not merely a generic music format but **the default format produced by the native voice-recording apps on iPhone and some Android devices**. By targeting voice files the victim has already recorded — meeting notes, phone-call recordings, voice memos — the attacker complements the backdoor's own time-restricted (19:00–22:00) microphone capture by harvesting **pre-existing audio assets the victim themselves created**.

---

## 8. Indicators of Compromise (IoCs)

### 8.1 File Hashes (SHA-1)

| SHA-1 | Filename | Detection | Description |
| --- | --- | --- | --- |
| `01A33066FBC6253304C92760916329ABD50C3191` | sqybhs.apk | Android/Spy.Agent.EXM | Trojanized game with Android BirdCall **v2.0** |
| `03E3ECE9F48CF4104AAFC535790CA2FB3C6B26CF` | ybht.apk | Android/Spy.Agent.EGE | Android BirdCall **v1.3** |
| `2B81F78EC4C3F8D6CF8F677D141C5D13C35333AF` | sqybhs.apk | Android/Spy.Agent.EGE | Android BirdCall **v1.5** |
| `59A9B9D47AE36411B277544F25AD2CC955D8DD2C` | ybht.apk | Android/Spy.Agent.EGE | Android BirdCall **v1.0** |
| `7356D7868C81499FB4E720F7C9530E5763B4C1D0` | sqybhs.apk | Android/Spy.Agent.EGE | Android BirdCall **v1.0** |
| `FC0C691DB7E2D2BD3B0B4C1E24D18DF72168B7D9` | sqybhs.apk | Android/Spy.Agent.EGE | Android BirdCall **v1.5** |
| `95BDB94F6767A3CCE6D92363BBF5BC84B786BDB0` | mono.dll | Win32/TrojanDownloader.Agent.ILQ | Trojanized mono library |
| `409C5ACAED587F62F7E23DA47F72C4D9EC3144D9` | (downloader) | Win32/TrojanDownloader.Agent.ILQ | RokRAT-loading downloader |
| `B06110E0FEB7592872E380B7E3B8F77D80DD1108` | (BirdCall dump) | Win64/Agent.EGN | Uploaded from China to VT on 2024-07-15 — closely resembles this campaign |

### 8.2 Network IoCs

**Primary compromise infrastructure (sqgame)**
- `sqgame.com[.]cn` / `xiazai.sqgame.com[.]cn` — `39.106.249[.]68` (Alibaba Hangzhou)
- `sqgame[.]net` — compromised primary domain

**Compromised Korean hosting (payload/configuration staging)**
- `1980food.co[.]kr` — `211.239.117[.]117` — Android BirdCall configuration image
- `inodea[.]com` — `114.108.128[.]157` — Android BirdCall configuration image
- `www.lawwell.co[.]kr` — `221.143.43[.]214` — shellcode + clean mono library
- `colorncopy.co[.]kr` / `swr.co[.]kr` — `222.231.2[.]20` — shellcode
- `sejonghaeun[.]com` — `222.231.2[.]23` — clean mono library
- `cndsoft.co[.]kr` — `222.231.2[.]41` — shellcode

**Zoho WorkDrive accounts (12 identified — Android BirdCall C&C)**
- `tomasalfred37@zohomail[.]com`
- `kalimaxim279@zohomail[.]com`
- `smithbentley0617@zohomail[.]com`
- `michaellarrow19@zohomail[.]com`
- `amandakurth94@zohomail[.]com`
- `rexmedina89@zohomail[.]com`
- `alishaross751@zohomail[.]com`
- `jamesdeeds385@zohomail[.]com`
- `joyceluke505@zohomail[.]com`
- `marjoriemiller280@zohomail[.]com`
- `teresadaniels200@zohomail[.]com`
- `michaelgiesen62@zohomail[.]com`

**Other**
- `ipinfo[.]io/json` — location lookup (legitimate service; blocking impacts normal use)

### 8.3 Behavioral-Detection Hints

- Regular calls from Korean IPs to the Zoho WorkDrive API within a single time window (typically 19:00–22:00)
- Presence of `com.example.zhuagou.*` or `com.mob.util.MobSs` package trees on Android devices
- Application behavior that simultaneously searches external storage for `.p12` and `.hwp` files
- Traces of `mono.dll` being modified and then restored to its clean version within minutes

---

## 9. MITRE ATT&CK Mapping

### 9.1 Enterprise (Windows Chain)

| Tactic | Technique | Application |
| --- | --- | --- |
| Resource Development | T1584.004 (Compromise Infrastructure: Server) | Six Korean sites + sqgame compromise |
| Resource Development | T1585.003 (Establish Accounts: Cloud Accounts) | 12 Zoho WorkDrive accounts |
| Resource Development | T1587.001 (Develop Capabilities: Malware) | New Android BirdCall development |
| Resource Development | T1608.001 (Stage Capabilities: Upload Malware) | Trojanized APKs uploaded to sqgame |
| **Initial Access** | **T1195.002 (Supply Chain Compromise: Software)** | sqgame update-server tampering |
| Execution | T1059.003 (Windows Command Shell) | BirdCall shell commands |
| Defense Evasion | T1027.013 / T1140 (encryption/decoding) | Patched-mono.dll shellcode |
| Defense Evasion | T1070.004 (Indicator Removal: File Deletion) | **Self-cleanup — replacing with clean mono** |
| Defense Evasion | T1480.001 (Environmental Keying) | Loading chain encrypted with computer-specific keys |
| Defense Evasion | T1497 (Sandbox Evasion) | VM/analysis-tool checks |
| Credential Access | T1555 (Credentials from Password Stores) | Browser credentials |
| Discovery | T1046 / T1082 / T1083 | Network/system/file enumeration |
| Collection | T1005 / T1056.001 / T1113 / T1115 / T1119 / T1125 / T1560 | Keylogging/screenshots/clipboard/automated collection/webcam/archive |
| C2 | T1071.001 / T1090 / T1102.002 | HTTP/proxy/bidirectional cloud |
| Exfiltration | T1020 / T1041 / T1567.002 | Automated/C2/cloud exfil |

### 9.2 Mobile (Android Chain)

| Tactic | Technique | Application |
| --- | --- | --- |
| **Initial Access** | **T1474.003 (Compromise Software Supply Chain)** | sqgame APK trojanization |
| Defense Evasion | T1406 (Obfuscated Files) | v2.0 obfuscation |
| Defense Evasion | T1407 (Download New Code at Runtime) | Self-update mechanism |
| Defense Evasion | T1541 (Foreground Persistence) | Silent MP3 + startForeground |
| Discovery | T1420 / T1422 / T1426 | File/network/system enumeration |
| Collection | T1429 (Audio Capture) | **Microphone recording (19:00–22:00)** |
| Collection | T1430 (Location Tracking) | Use of ipinfo.io |
| Collection | T1513 (Screen Capture) | Screenshots |
| Collection | T1532 (Archive Collected Data) | Compression/encryption |
| Collection | T1533 (Data from Local System) | **Targeted extensions including `.p12` and `.hwp`** |
| Collection | T1636.002 / .003 / .004 | Call logs/contacts/SMS |
| C2 | T1437.001 / T1481.002 | HTTPS / Zoho WorkDrive bidirectional |
| Exfiltration | T1646 (Exfiltration Over C2 Channel) | Exfiltration to C2 |

---

## 10. Response Recommendations

### 10.1 P0 — Immediate (within 24 hours)

| Audience | Action |
| --- | --- |
| **sqgame users (Yanbian and Korea)** | Isolate device immediately. Run full scans with ESET, V3, or Malwarebytes. Strongly recommend wipe and reset. Assume screen, call, and message records may have been exfiltrated. |
| **Korean financial/government certificate holders who are sqgame users** | **Revoke and reissue `.p12` files immediately.** Change all certificate passwords. Audit the past 30 days of internet-banking, Government24, and Hometax access. |
| **Domestic ISPs and CDNs** | Block the §8.2 IoC domains and IPs. Notify operators of compromised Korean sites. |
| **KISA / Financial Security Institute** | Issue uniform notifications and remediation-inspection guidance to operators of compromised Korean hosting sites. |

### 10.2 P1 — Short-term (within 7 days)

| Audience | Action |
| --- | --- |
| **Defector-support NGOs** | Conduct organization-wide device inspections. On Android, where possible, disable installation from unknown sources and enforce Google Play Protect. |
| **Government and public agencies using Hancom Office** | Strengthen sender verification for external `.hwp` attachments. Audit macro-disabling settings. |
| **NIS / DCC (Defense Counterintelligence Command)** | Reflect this incident in ScarCruft activity assessments. Evaluate the likelihood of expansion to Korea-resident ethnic Koreans and defectors using identical TTPs. |
| **Mobile security vendors** | Apply Android/Spy.Agent.EGE / EXM signatures. Add behavioral rules detecting simultaneous targeted-extension searches. |

### 10.3 P2 — Structural (within 30 days)

| Domain | Recommendation |
| --- | --- |
| **Supply-chain integrity** | Consider mandating code-signing verification on update channels for gaming and social applications. Maintain a separate monitoring track for diaspora-community-targeted apps. |
| **Cloud C&C detection** | Establish behavior-analysis-based detection rules for legitimate-cloud API calls (Zoho WorkDrive, pCloud, Yandex Disk). Pure blocking has high user impact. |
| **Human safety** | Standardize digital-hygiene training programs for defectors and human-rights activists (in coordination with the Ministry of Unification and NGOs). Apply principles of device separation (work/personal), messenger isolation, and no on-device storage of `.p12`. |
| **CTI information sharing** | Strengthen the Korean-language analysis and redistribution of primary sources such as this ESET report. Reduce the lag inherent in current dependence on English primary sources. |

---

## 11. Strategic Implications

### 11.1 What Distinguishes This Operation from Prior ScarCruft Campaigns

| Dimension | Earlier ScarCruft Operations | sqgame Operation |
| --- | --- | --- |
| **Target population** | South Korean government, defense, media | **Civilian diaspora community** |
| **Platform** | Windows-centric | **Windows + Android multi-platform** |
| **Supply-chain shape** | Spear-phishing dominant | **Wholesale takeover of a legitimate gaming platform** |
| **Tool genealogy** | Self-developed RokRAT family | **Acquired/upgraded Chinese zhuagou module (assessed)** |
| **Humanitarian risk** | Information theft | **Identity/location exposure → potential physical harm** |

### 11.2 Humanitarian Perspective

The most concerning aspect of this operation is not data theft. The contacts, SMS, call logs, location, and audio recordings collected from Yanbian-resident ethnic Koreans' and defectors' devices are **directly usable by the DPRK regime to identify the target's family, associates, and concealment routes**.

Historical patterns show that DPRK defector tracking proceeds **digital reconnaissance → in-country tracking via human assets → family hostage-taking and forced repatriation**. Material collected by this BirdCall campaign is sufficient to seed the first stage of that chain.

### 11.3 National-Security Implications

This incident implies the following:

1. **"Koreans outside Korea" must fall within the responsibility scope of South Korean cybersecurity.** The Korean diaspora across Yanbian, Central Asia, and Japan are direct DPRK-APT targets, and cybersecurity support for them should be elevated to a digital-dimension agenda within foreign and unification policy.

2. **The era of mobile-espionage platforms has fully arrived.** Android BirdCall is ScarCruft's first dedicated mobile backdoor. Comparable patterns are likely to spread to other DPRK groups such as Lazarus and Kimsuky.

3. **Legitimate-cloud C&C is now standard practice.** The use of Zoho WorkDrive, pCloud, Yandex Disk, and similar legitimate SaaS for C&C is no longer novel — it is a **standard operational pattern**. Block-only responses have clear limits; the shift toward behavior-based detection is overdue.

4. **SMB-hosting security in Korea.** Six Korean domains were drafted as compromised hosts in this single campaign. The effectiveness and reach of KISA's SMB-security inspection programs warrants reassessment.

5. **The importance of tracking tool acquisition and lineage.** As the zhuagou case suggests, DPRK APTs do not create tools ex nihilo; they repeatedly **acquire and rework existing Chinese- and Russian-scene hacker tools**. Korean CTI analysis must develop the capacity to track **tool genealogy** beyond the IoCs of any single campaign — a multilayered analytical practice combining lexical analysis, source-code comparison, and operator-OPSEC patterns.

> 📍 **Final assessment**: The ScarCruft / sqgame operation is **a paradigmatic case of a state-aligned APT taking wholesale possession of a diaspora community's infrastructure and converting it into a HUMINT asset**. South Korean cybersecurity policy should preemptively prepare for the possibility that this pattern will not remain confined to Yanbian, but extend to the digital infrastructure (community apps, current-affairs media, religious/NGO self-hosting) of Korea-resident ethnic Koreans, Central Asian Koryo-saram, Korean Japanese, and Korean Americans.

---

## 12. References

### 12.1 Primary Sources

1. ESET Research / Filip Jurčacko, *"A rigged game: ScarCruft compromises gaming platform in a supply-chain attack"*, WeLiveSecurity, 2026-05-05. <https://www.welivesecurity.com/en/eset-research/rigged-game-scarcruft-compromises-gaming-platform-supply-chain-attack/>
2. ESET GitHub IoC repository — `eset/malware-ioc/tree/master/scarcruft`. <https://github.com/eset/malware-ioc/tree/master/scarcruft>
3. MITRE ATT&CK G0067 — APT37 (ScarCruft). <https://attack.mitre.org/groups/G0067/>

### 12.2 ScarCruft Background

4. ESET, *"Who's swimming in South Korean waters? Meet ScarCruft's Dolphin"*, 2022-11-30. <https://www.welivesecurity.com/2022/11/30/whos-swimming-south-korean-waters-meet-scarcrufts-dolphin/>
5. S2W, *"Matryoshka — Variant of RokRAT (APT37/ScarCruft)"*, 2021. <https://medium.com/s2wblog/matryoshka-variant-of-rokrat-apt37-scarcruft-69774ea7bf48>
6. AhnLab Security Emergency Response Center (ASEC), *RokRAT analysis report*, 2021. <https://www.ahnlab.com/ko/contents/content-center/30164>

### 12.3 Comparable Supply-Chain Attacks

7. ESET, *"Operation NightScout: Supply-chain attack targets online gaming in Asia"*, 2021-02-01. <https://www.welivesecurity.com/2021/02/01/operation-nightscout-supply-chain-attack-online-gaming-asia/>
8. ESET, *"Linux malware strengthens links between Lazarus and the 3CX supply-chain attack"*, 2023-04-20. <https://www.welivesecurity.com/2023/04/20/linux-malware-strengthens-links-lazarus-3cx-supply-chain-attack/>

### 12.4 Related Reports in This CTI Archive

9. [`CTI-2026-0422-MCP`](./Cti%202026%200422%20mcp%20en.MD) — UNC1069 / Sapphire Sleet and DPRK supply-chain poisoning scenarios
10. [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_EN.md) — comparative supply-chain pattern (ShinyHunters)
11. `CTI-2026-0320-CORUNA` — mobile and zero-day threat ecosystem

---

## Appendix A. Glossary

| Term | Definition |
| --- | --- |
| **ScarCruft (APT37)** | DPRK-aligned espionage APT group active since 2012. Multiple aliases including Reaper, Group123, and Inky Squid. |
| **BirdCall** | ScarCruft's signature backdoor family. Discovered by ESET in 2021. An evolution of RokRAT. Android port added in 2024. |
| **RokRAT** | ScarCruft's first-stage RAT, frequently used as a loader for BirdCall. |
| **zhuagou (抓狗)** | Internal codename of Android BirdCall. Literally "catching dogs" in plain Chinese, but established within the Chinese hacker scene since around 2012 as standard jargon for information-collection / credential-theft / user-tracking modules — suggesting the tool's lineage may originate from the Chinese hacker community. |
| **Yanbian (延边)** | Korean Autonomous Prefecture in eastern Jilin Province, China. Borders the DPRK. The principal first-transit zone for North Korean defectors. |
| **Supply-chain attack** | An attack that compromises a trusted third party (vendor or platform) to gain indirect access to the actual end target. |
| **Trojanization** | Insertion of malicious code into a legitimate program such that the original functionality is preserved while backdoor behavior is added. |
| **`.p12` (PKCS#12)** | Standard container format for certificates and private keys. In Korea, widely used as the Joint Certificate / Financial Certificate format. |
| **`.hwp`** | Standard document format of Hancom Office. The de facto standard format of the South Korean government and public agencies. |
| **Foreground Persistence** | Technique used on Android to evade background-process termination policies, e.g., via the startForeground API or by playing silent media. |
| **Tool genealogy** | An analytical dimension within CTI that traces how the code, ideas, and techniques of a malicious tool originate within one group and propagate to or are acquired by another. |

---

*— End of Report —*

**© 2026 Dennis Kim · Cyber Threat Intelligence Division**
[github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*This report is an independent English-language analysis based primarily on public material from ESET Research. It does not represent the official position of ESET, sqgame, or any related organization.*

`TLP:GREEN` · `CTI-2026-0507-SCARCRUFT` · Published: 2026-05-07

> *"The backdoor's codename was zhuagou. That was not merely a naming choice — it exposed at once the operators' conception of who the targets are and a clue to where the tool itself came from." — CTI-2026-0507*
