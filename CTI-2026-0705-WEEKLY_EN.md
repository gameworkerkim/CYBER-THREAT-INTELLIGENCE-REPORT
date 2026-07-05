# CTI-2026-0705-WEEKLY — Weekly Cyber Threat Intelligence (2026-07-01 to 07-05)

> **TLP: CLEAR** · Unrestricted distribution (OSINT-based)
> **Author**: Dennis Kim (김호광) · Cyber Threat Intelligence Division · gameworker@gmail.com
> **Published**: 2026-07-05 · **Coverage**: 2026-07-01 to 07-05
> **Nature**: OSINT cross-verified summary for defense, research, and policy. Does not represent the official position of any organization, agency, or government.

---

## 0. Executive Summary

This week, attacks targeting the **"axes of trust" — ERP, developer tooling, and AI infrastructure** — dominated. The connecting pattern matters more than any single incident.

- **Industrialization of ERP zero-days**: Oracle PeopleSoft (CVE-2026-35273) and E-Business Suite (CVE-2026-46817) mark the second and third CVSS 9.8 ERP zero-days in eight months. HR, payroll, and payment systems are now the top targets of organized extortion.
- **Cascading supply-chain attacks**: The FBI issued a FLASH alert on TeamPCP. Security tools (Trivy, KICS) and an AI gateway (LiteLLM) became infection vectors — the "weaponization of the protectors." Lazarus bypassed npm v12's new defense (install-script blocking) by shifting execution to **import time**.
- **Autonomous AI attack arrives**: Sysdig documented JadePuffer, the first ransomware operation driven end-to-end by an LLM. The era of "Agentic Threat Actors (ATAs)" has begun.
- **Direct impact on Korea**: Korea's FSS issued a consumer alert after confirming 5,707 card records stolen via payment-page phishing on online shopping malls. Combined with the earlier TVING/CU CI leaks, second-order damage compounds.

**Korea takeaways**: (1) Oracle PeopleSoft/EBS, Adobe ColdFusion, and MS365 are stacks widely deployed across Korean enterprises and the public sector. (2) The Lazarus npm campaign targets Korean developers directly. (3) The card-phishing case is an active, ongoing domestic incident.

---

## 1. Weekly Threat Dashboard

| # | Incident | Type | Severity | Confidence | Direct Korea impact |
|---|---|---|---|---|---|
| 1 | DHS HSIN breach | Government network | High | High | Low (indirect) |
| 2 | Tata Electronics leak | Supply chain / IP | High | High | Medium (component base) |
| 3 | Nissan – Oracle PeopleSoft | ERP zero-day | **Critical** | High | **High** |
| 4 | KR shopping-mall card phishing | Payment phishing | High | High | **Direct** |
| 5 | FBI TeamPCP supply chain | Dev-tool supply chain | **Critical** | High | **High** |
| 6 | MS365 password spray | Account takeover | High | High | **High** |
| 7 | Adobe ColdFusion / Oracle EBS | Multiple vulns | **Critical** | High | **High** |
| 8 | JadePuffer AI ransomware | Autonomous AI attack | High | High | Medium (emerging) |
| 9 | Lazarus npm supply chain | Nation-state / supply chain | High | High | **Direct** |
| 10 | Aptos Move VM flaw | Blockchain infra | High (potential Critical) | High | Medium (crypto) |

*Severity = potential impact. Confidence = level of primary/secondary cross-verification (High = vendor advisory or multiple trusted outlets confirmed).*

---

## THEME A — Supply Chain & Dev Tools: The Axis of Trust Becomes a Weapon

### [T-01] FBI FLASH: TeamPCP Large-Scale Supply-Chain Attacks [^t01]

> **Fact Box**
> - Actor: TeamPCP (emerged Dec 2025 via mass React2Shell exploitation; heavy use of AI tools)
> - Official alert: FBI FLASH `FLASH-20260702-01` (2026-07-02, TLP:CLEAR)
> - Compromised tools: Trivy (container scanner), KICS (IaC scanner), LiteLLM (LLM gateway), Telnyx Python SDK
> - Origin: 2026-03-19 Aqua Trivy compromise (76/77 release tags force-pushed, CVE-2026-33634) → cascaded to LiteLLM PyPI 1.82.7/1.82.8 (03-24)
> - Malware: CanisterWorm (cloud tokens), SANDCLOCK (K8s / wallets), Mini Shai-Hulud (self-replicating npm+PyPI worm)
> - Scale: 1,000+ SaaS environments; ~300GB / ~500k credential sets exfiltrated (Sophos)
> - Sources: FBI IC3, Palo Alto Unit 42, Arctic Wolf, Sophos

**Assessment**: A textbook "trust inversion" where security scanners become the attack vector. CI/CD secrets stolen from Trivy were used to compromise the next targets (KICS, LiteLLM). LiteLLM (~95M monthly downloads) aggregates LLM API keys and cloud credentials by design, giving it a large blast radius.

**MITRE ATT&CK**: T1195.002 (Compromise Software Supply Chain) · T1552 (Unsecured Credentials) · T1543 (Persistence) · T1078 (Valid Accounts)

**Mitigations**:
- Pin GitHub Actions workflows to **verified commit SHA hashes**, not floating tags.
- Organizations using affected versions (esp. 03-19 to 03-24) should **rotate all CI/CD secrets, publishing tokens, and cloud credentials**.
- Search GitHub orgs for `tpcp-docs` / `docs-tpcp` repositories (created by the worm using stolen credentials).
- Roll Trivy/KICS/LiteLLM/Telnyx SDK back to pre-compromise versions; enforce minimum package-age policy.

**Korea impact & response**: LiteLLM, Trivy, and KICS are commonly embedded in the CI/CD of Korean AI startups and cloud-native teams, so **downstream infection is possible even without direct targeting**. In line with KISA supply-chain guidance: (1) adopt SBOMs, (2) run an internal mirror registry with minimum-age policy, (3) move to short-lived OIDC tokens.

---

### [T-02] Lazarus: Rollup-Impersonating npm Packages Target Developer Supply Chains [^t02]

> **Fact Box**
> - Attribution: North Korea-linked Lazarus (TTP overlap, JFrog)
> - Disclosed: 2026-06-30 (JFrog Security Research, researcher Yair Benamou)
> - Malicious packages: `rollup-packages-polyfill-core`, `rollup-runtime-polyfill-core` and 4 others (impersonating legit `rollup-plugin-polyfill-node`, ~295k weekly downloads)
> - Key technique: **execution at import time** → defeats the install-script blocking in npm v12 (shipping July 2026)
> - Targets stolen: AWS/Azure/GCP, **Anthropic Claude & Google Gemini** API keys, SSH keys, crypto wallets, VS Code/Windsurf/Cursor configs
> - Linkage: overlaps with the April 2026 campaign (108 packages / 261 versions; BeaverTail, OtterCookie)
> - Sources: JFrog, The Hacker News, The Next Web

**Assessment**: The key trait is adaptability — when a defense (npm v12) arrived, the actor shifted execution from install to import time. Targeting AI-tool configs and keys shows Lazarus treating the AI dev ecosystem as a new hunting ground.

**MITRE ATT&CK**: T1195.002 · T1059.007 (JavaScript) · T1552.001 (Credentials in Files) · T1071 (C2)

**Mitigations**:
- Pin dependencies via **lockfile + hash verification**; scan for typo/combo-squatting.
- Don't rely on `--ignore-scripts` alone (import-time execution is not blocked) → add runtime behavioral monitoring.
- Use **short-lived, scoped tokens** for cloud/AI keys on dev workstations and CI; never hardcode.

**Korea impact & response**: Korean developers are a **direct target** (Lazarus consistently targets domestic developers and crypto professionals). Beware "Contagious Interview"-style fake-recruitment tasks that induce execution of malicious packages. Route internal npm/PyPI through a controlled proxy registry, and standardize supply-chain threat awareness in developer onboarding.

---

### [T-03] Tata Electronics Leak — Apple/Tesla Component-Chain IP Exposed [^t03]

> **Fact Box**
> - Victim: Tata Electronics (builds ~1/3 of Apple's iPhones in India; Tesla components)
> - Actor: World Leaks ransomware (emerged early 2025; believed rebrand of Hunters International)
> - Scale: **630.4GB, 204,341 files**; posted to dark web 2026-06-12 / Tata confirmed 06-22
> - Content: 52-page Apple circuit-board QC standard, Tesla Model Y NV36 & Model 3 "Highland" drawings, employee passport scans, years of emails/logs
> - Nature: pure data theft/extortion (no encryption; operations uninterrupted)
> - Sources: Reuters, CNBC, TechCrunch, BleepingComputer

**Assessment**: OEMs (Apple/Tesla) have mature security, but **Tier-1 suppliers hold the same IP on smaller budgets**. Hitting the weakest link exposed multiple Fortune 500 companies' IP at once.

**MITRE ATT&CK**: T1657 (Financial Theft/Extortion) · T1567 (Exfiltration over Web)

**Mitigations**: Contractual security requirements/audit rights for suppliers; DLP and access control for partners handling IP; mandatory breach-notification clauses.

**Korea impact & response**: Korean Tier-1/2 manufacturers supplying global OEMs (Samsung, SK, LG) face the **same structural targeting**. Suppliers holding a principal's design/process IP are most at risk. Principals should run supplier security due diligence; suppliers should prioritize design-asset isolation, least privilege, and 3-2-1 backups.

---

## THEME B — Enterprise Zero-Days: ERP and Middleware on the Front Line

### [T-04] Nissan Employee Data Breach via Oracle PeopleSoft Zero-Day (CVE-2026-35273) — **Critical** [^t04]

> **Fact Box**
> - Vulnerability: **CVE-2026-35273** (CVSS **9.8**), PeopleSoft PeopleTools 8.61/8.62 PSEMHUB component; unauthenticated SSRF→RCE over HTTP
> - Timeline: exploited 05-27 to 06-09 (zero-day) → Oracle emergency patch 06-10 → CISA KEV 06-12 → Nissan notified 06-25 → public reporting 06-29
> - Attribution: ShinyHunters (= UNC6240 / Bling Libra); 100+ orgs, 300+ instances; education heavily hit
> - Nissan impact: current/former employees in US, Canada, Mexico, Brazil — contact info, bank accounts, SSNs, tax data
> - Sources: Oracle Advisory, Google/Mandiant, BleepingComputer, SecurityWeek

**Assessment**: Following Cl0p's abuse of EBS CVE-2025-61882 (Aug 2025), this is the second CVSS 9.8 Oracle ERP zero-day in eight months — **ERP is now an industrialized extortion target**. Attackers hid MeshCentral agents disguised as Azure services.

**MITRE ATT&CK**: T1190 (Exploit Public-Facing App) · T1213 · T1219 (Remote Access Software) · T1048 (Exfiltration)

**Mitigations**:
- Patch PeopleTools 8.61/8.62 immediately; **block external access** to `/PSEMHUB/*` and `/PSIGW/HttpListeningConnector`.
- Monitor outbound SMB (TCP/445) from PeopleSoft servers; detect `README-IF-YOU-SEE-THIS...` ransom notes and MeshCentral masquerading agents.
- **Rotate all credentials** reachable from potentially compromised instances.

**Korea impact & response**: PeopleSoft is widely deployed in HR/payroll at Korean enterprises, universities, and public bodies. **Inventorying internet-exposed instances is the top priority.** Because these systems store resident-registration and payroll data in bulk (triggering PIPA breach-notification duties), review access control and log retention alongside patching.

---

### [T-05] Adobe ColdFusion/Campaign Classic Max-Severity Patches + Oracle EBS Active Exploitation — **Critical** [^t05]

> **Fact Box**
> - Adobe ColdFusion: 11 vulns, **six rated CVSS 10.0** (CVE-2026-48276/48277/48281/48316/48282/48283) — file upload, input validation, path traversal → unauthenticated RCE. Fix: ColdFusion 2025 Update 10 / 2023 Update 21
> - Adobe Campaign Classic: **CVE-2026-48286 (10.0)** improper authorization → RCE, on-prem only, fixed in ACC 7.4.3 build 9397
> - Adobe status: "no known in-the-wild exploits" but priority 1; moving to twice-monthly patches from 07-14
> - Oracle EBS: **CVE-2026-46817 (9.8)** in Payments/File Transmissions, unauthenticated over HTTP → **active exploitation confirmed** (Defused honeypots); patched in May CSPU
> - Unverified: "900+ exposed vulnerable EBS instances" was NOT independently confirmed in this review → track
> - Sources: Adobe Advisory, The Hacker News, SecurityWeek, BleepingComputer

**Assessment**: ColdFusion is a historical ransomware favorite; six unauthenticated-RCE 10.0s at once is unusual. EBS is already under active attack — a race against time.

**MITRE ATT&CK**: T1190 · T1505.003 (Web Shell) · T1068 (Privilege Escalation)

**Mitigations**: Patch ColdFusion/EBS **within 72 hours**; keep file-upload disabled by default, enforce authentication if required. Restrict internet-exposed admin consoles.

**Korea impact & response**: ColdFusion persists in Korean legacy/public web systems; EBS in enterprise finance/procurement. **Immediately scan and isolate internet-exposed ColdFusion/EBS admin interfaces.** Treat EBS as a KEV-equivalent emergency patch since exploitation is live.

---

### [T-06] Massive MS365 Password Spray — MFA Bypass via Azure CLI / ROPC [^t06]

> **Fact Box**
> - Detected by: Huntress (published 2026-07-02), tracked 06-12 to 06-26
> - Scale: **81M+ login attempts**, **78 accounts compromised across 64 organizations** (surge on 06-22: 30 identities across 23 businesses)
> - Core mechanism: Azure CLI's **ROPC (Resource Owner Password Credentials, deprecated OAuth)** flow sends credentials straight to the /token endpoint → **bypasses Conditional Access / MFA** enforced at the authorization endpoint
> - Ingress: IPv6 `2a0a:d683::/32` (LSHIY LLC, AS32167); credential-spray volume up 155x over six months
> - Notable: many victims had MFA/CAP enabled but **not covering this flow**. Attacks stopped 07-02 after LSHIY terminated the responsible service
> - Sources: Huntress, The Hacker News, BleepingComputer, SecurityWeek

**Assessment**: The lesson isn't "enable MFA" but "does MFA cover every authentication path?" Root cause was reuse of previously breached, never-rotated credentials.

**MITRE ATT&CK**: T1110.003 (Password Spraying) · T1078 (Valid Accounts) · T1556 (Modify Auth Process) · T1114 (Email Collection)

**Mitigations**:
- Apply CAP to **All users / All cloud apps / All client app types**, including legacy/non-browser flows.
- **Restrict Azure CLI to non-admins**; block legacy grants such as ROPC.
- Prioritize response by **credential validity**, not spray volume; hunt Azure CLI logins and suspicious ROPC activity.

**Korea impact & response**: MS365 adoption is widespread in Korea. Organizations that scoped CAP **to admins only, specific apps only, or non-trusted locations only** are especially exposed. Review Entra ID sign-in logs for Azure CLI/ROPC traces during 06-12 to 06-26, and force-rotate breached-list passwords to defeat combo-list reuse.

---

## THEME C — AI, Blockchain, Government — and Direct Domestic Hits

### [T-07] JadePuffer — First Fully Autonomous "AI Agent" Ransomware [^t07]

> **Fact Box**
> - Documented by: Sysdig Threat Research (2026-07-01); threat named JadePuffer; "Agentic Threat Actor (ATA)"
> - Initial access: internet-exposed **Langflow CVE-2025-3248** (CVSS 9.8, unauthenticated RCE; disclosed Apr 2025, CISA KEV May 2025) → separate production server via **Alibaba Nacos CVE-2021-29441** (auth bypass)
> - Autonomy evidence: failed login → **working fix in 31 seconds**; 600+ payloads carried natural-language reasoning comments; error-diagnosis behavior rather than blind retries
> - Destruction: encrypted **1,342 Nacos config items**; key never stored/transmitted → **recovery impossible even if paid**
> - Sources: Sysdig, The Register, SecurityWeek

**Assessment**: The point is not a novel zero-day but that an AI autonomously chained **known, public vulnerabilities** to hit a real organization. It lowers the skill barrier, yet LLM-generated payloads (natural-language comments) also create new detection opportunities.

**MITRE ATT&CK**: T1190 · T1059 (Command Execution) · T1053 (Scheduled Task/crontab) · T1485 (Data Destruction)

**Mitigations**: Remove/authenticate internet-exposed admin interfaces (Langflow, Nacos, etc.); revoke default credentials. Build detection rules keyed on LLM-generated code signatures (natural-language comments, anomalous iteration).

**Korea impact & response**: Korean AI/data teams frequently expose Langflow, Nacos, and MinIO **without authentication** at the PoC stage. Autonomous attacks scan exposed assets 24/7, so make external-exposure checks of dev/staging infra routine. Use LLMs for defense too — but a human validates the call: an LLM is a spreadsheet, not an oracle.

---

### [T-08] Aptos Move VM Flaw — Theoretical Systemic Risk up to $70B [^t08]

> **Fact Box**
> - Found by: Hexens (CTO Vahe Karapetyan); stale-cache → **type-confusion** bug
> - **Timeline correction**: reported 2026-02-25 → **patched to mainnet 02-27** → **details first publicly disclosed 2026-07-04 via CoinDesk** (post-responsible-disclosure)
> - Power: with a $3,000 server simulating ~1/3 of the validator set, ~90% success; no insider/privileged access needed. Could hijack stablecoin-mint and cross-chain-bridge authority
> - Scale: direct Aptos-native TVL ~$250M / systemic risk up to **$70B** (worst-case assuming mass USDC mint + CCTP movement)
> - Rebuttal: Aptos says "extremely low exploitability in real-world conditions"; third parties (Polygon CTO Mudit Gupta, Grego AI) confirmed the PoC. **No funds lost**
> - Sources: CoinDesk (exclusive), Hexens, ABMedia/BlockTempo

**Assessment**: A rare type-confusion in Move, a language built for type safety. "$70B" is a worst-case theoretical ceiling; in practice this closed with a two-day patch and zero loss — best read as an exemplary response case.

**Mitigations (protocol)**: Aptos-dependent bridges/stablecoins/DeFi should audit their own dependencies, use multi-oracle designs and authority isolation, and pre-establish an emergency war-room.

**Korea impact & response**: The Aptos ecosystem has Korea-linked projects planned (e.g., the KRW1 won-stablecoin), so it is indirectly relevant to Korean crypto users and exchanges. Korean exchanges/custodians should monitor core-vulnerability disclosures of listed/integrated chains and reflect in due diligence the risk of bridge/mint authority stored as on-chain resources.

---

### [T-09] KR Online Shopping-Mall Payment-Page Phishing — 5,707 Card Records (Active, Domestic) [^t09]

> **Fact Box**
> - Announced: Korea FSS consumer alert "Caution" (2026-07-05), based on FSI notification
> - Scale: **5,707 card records** with theft indicators as of 2026-06-29
> - Method: inject **phishing pages resembling the legitimate checkout** into vulnerable malls → capture card number, expiry, CVC plus the **full card PIN and resident-registration number** → then show a "payment error" and redirect to the real checkout so victims don't notice
> - Second-order risk: FSS explicitly warned of **credential stuffing** and follow-on damage
> - Sources: Korea FSS, Edaily, Money Today, Etoday

**Assessment**: Sophisticated phishing/skimming designed to complete a real payment so victims stay unaware. Combined with the earlier TVING/CU CI and PII leaks, it can escalate into targeted, precision phishing.

**MITRE ATT&CK**: T1566 (Phishing) · T1056 (Input Capture) · T1557 (intercepting the web payment flow)

**Mitigations (consumers)**: Requests for the **full resident-registration number or full card PIN at checkout = immediate red flag.** On suspicion, freeze/reissue the card, change the PIN, change reused passwords elsewhere; report to 112 if harmed.

**Korea impact & response (operators/agencies)**: Mall operators should strengthen checkout-page integrity monitoring (script-tamper detection), web-vulnerability scanning, and PG-integration tamper detection. This should be viewed as a stage in the domestic second-order chain **TVING/CU CI leak → precision phishing**, warranting continuous data-combination-risk monitoring across PIPC, FSS, and KISA.

---

### [T-10] DHS HSIN Breach — World Cup Security Coordination Network Exposed [^t10]

> **Fact Box**
> - Target: US DHS HSIN (a "sensitive but unclassified" platform where federal/state/local/private partners share threat intel and emergency response)
> - Timing: breach late May to early June (weeks of dwell time); disclosed 2026-07-01. HSIN servers + a SharePoint collaboration system targeted
> - Sensitivity: used to coordinate security for FIFA World Cup 2026 and America250. Sen. Warner: "unclassified but highly sensitive; exposure risks national security"
> - Status: classified networks unaffected; scope undisclosed; **unattributed**
> - Sources: Nextgov, BleepingComputer, TechCrunch

**Assessment**: Demonstrates the risk of "unclassified but operationally critical" data. Weeks of dwell time allow pattern/operational-intelligence harvesting.

**Korea impact & response**: Direct impact is low, but the lesson transfers: **"non-classified, legacy" information-sharing platforms are the blind spot.** This applies directly to Korean public/inter-agency collaboration networks (event security, disaster-response sharing). Re-examine security tiers and legacy systems that were rated low simply because they are "non-classified."

---

## 2. Strategic Takeaways

1. **The axes of trust are the target.** ERP (Oracle), security tools (Trivy/KICS), AI gateways (LiteLLM), and info-sharing networks (HSIN) — all layers organizations "just trust." Trust itself has become the attack surface.
2. **Patch speed decides survival.** Many incidents this week are CVSS 9.8–10.0 unauthenticated RCE. Adopt a **72-hour patch SLA** for KEV/emergency advisories as an organizational standard.
3. **Credentials are the real currency.** TeamPCP, Lazarus, and the MS365 spray all aim at credentials. Short-lived scoped tokens, OIDC, and full MFA coverage are the core defensive line.
4. **AI accelerates both offense and defense.** JadePuffer (attack autonomy) and Lazarus's AI-key targeting arrived in the same week. Use AI for defense too, but a human validates the call — an LLM is a spreadsheet, not an oracle.
5. **Korea sits at the front line of combination risk.** The domestic chain TVING/CU CI leak → card phishing reaffirms this archive's consistent thesis: impact multiplies not from individual leaks but from **data being combined**.

---

## 3. Immediate Checklist for Korean Organizations

- [ ] Inventory/patch/isolate internet-exposed **Oracle PeopleSoft (8.61/8.62), EBS, Adobe ColdFusion**
- [ ] Expand MS365 **Conditional Access to all users / apps / client types**; restrict Azure CLI / ROPC
- [ ] Pin **GitHub Actions to commit SHAs**, rotate secrets, run an internal mirror registry with minimum-age policy
- [ ] Train developers on **Lazarus npm / fake-recruitment** supply-chain threats; enforce lockfile + hash verification
- [ ] Authenticate/isolate exposed admin interfaces (Langflow, Nacos, MinIO, etc.)
- [ ] Monitor checkout-page integrity; brief customers on **precision phishing** linked to TVING/CU leaks
- [ ] Re-examine security tiers of "non-classified, legacy" info-sharing/collaboration networks

---

## References

Only primary/major sources are listed. Each incident was cross-verified against multiple outlets at time of publication; the links below are representative.

[^t01]: FBI IC3, *FLASH FLASH-20260702-01: TeamPCP* — https://www.ic3.gov/CSA/2026/260702.pdf · Palo Alto Unit 42, "Weaponizing the Protectors" — https://unit42.paloaltonetworks.com/teampcp-supply-chain-attacks/ · Security Affairs — https://securityaffairs.com/194741/cyber-crime/fbi-teampcp-compromised-dev-tools-to-steal-cloud-credentials.html · Arctic Wolf — https://arcticwolf.com/resources/blog/teampcp-supply-chain-attack-campaign-targets-trivy-checkmarx-kics-and-litellm-potential-downstream-impact-to-additional-projects/

[^t02]: The Hacker News, "North Korea-Linked npm Packages Mimic Rollup Polyfills" — https://thehackernews.com/2026/07/north-korea-linked-npm-packages-mimic.html · The Next Web — https://thenextweb.com/news/north-korea-npm-rollup-polyfill-developer-secrets (JFrog Security Research, disclosed 2026-06-30)

[^t03]: Reuters/CNBC — https://www.cnbc.com/2026/06/23/indias-tata-electronics-hit-by-cyber-breach-claiming-to-expose-apple-tesla-trade-secrets.html · TechCrunch — https://techcrunch.com/2026/06/22/tata-electronics-a-major-tech-supplier-to-apple-and-tesla-confirms-data-breach/ · Cybernews — https://cybernews.com/security/tata-electronics-breach-apple-tesla-secret-files/

[^t04]: Oracle Security Alert CVE-2026-35273 (2026-06-10) · BleepingComputer — https://www.bleepingcomputer.com/news/security/nissan-discloses-employee-data-breach-linked-to-oracle-zero-day-attacks/ · SecurityWeek — https://www.securityweek.com/nissan-employee-data-breached-in-oracle-peoplesoft-hack/ · Google/Mandiant (GTIG) attribution to UNC6240

[^t05]: Adobe Security Bulletin (ColdFusion 2025 Update 10 / 2023 Update 21; ACC 7.4.3 build 9397) · The Hacker News — https://thehackernews.com/2026/07/adobe-patches-7-cvss-100-flaws-in.html · BleepingComputer — https://www.bleepingcomputer.com/news/security/adobe-patches-seven-max-severity-coldfusion-campaign-flaws/ · Oracle EBS CVE-2026-46817 exploitation: SecurityWeek — https://www.securityweek.com/exploitation-of-recent-oracle-e-business-suite-vulnerability-begins/

[^t06]: Huntress, "No (Bad) CAP: Inside an Ongoing LSHIY Password Spray Attack" — https://www.huntress.com/blog/lshiy-password-spray-attack · The Hacker News — https://thehackernews.com/2026/07/azure-cli-password-spray-hits-at-least.html · BleepingComputer — https://www.bleepingcomputer.com/news/security/hackers-target-microsoft-365-accounts-with-81-million-login-attempts/

[^t07]: Sysdig Threat Research (2026-07-01) · The Register — https://www.theregister.com/security/2026/07/02/smooth-ai-criminal-drives-first-end-to-end-agentic-ransomware-attack/ · SecurityWeek — https://www.securityweek.com/agentic-ai-used-to-conduct-ransomware-attack-via-langflow/ (Langflow CVE-2025-3248 · Nacos CVE-2021-29441)

[^t08]: CoinDesk (exclusive, 2026-07-04) — https://www.coindesk.com/tech/2026/07/04/how-ethical-hackers-with-just-a-usd3-000-server-found-a-flaw-that-could-ve-put-usd70-billion-in-crypto-at-risk · Hexens reported 2026-02-25 / patched 02-27 · BlockTempo — https://www.blocktempo.com/aptos-move-vm-flaw-hexens-hackers-70-billion-crypto-risk/

[^t09]: Korea FSS consumer alert "Caution" (2026-07-05) · Edaily — https://www.edaily.co.kr/News/Read?newsId=01571126645511568 · Money Today — https://www.mt.co.kr/finance/2026/07/05/2026070418075313755 · Etoday — https://www.etoday.co.kr/news/view/2600190

[^t10]: Nextgov (first report) · BleepingComputer — https://www.bleepingcomputer.com/news/security/dhs-confirms-hackers-breached-hsin-info-sharing-platform/ · TechCrunch — https://techcrunch.com/2026/07/02/us-government-says-it-got-hacked-again/

---

> **Disclaimer**: This report is an OSINT-based summary/analysis for defense, research, and policy purposes and does not represent the official position of any organization, agency, or government. Some figures/attributions may change as investigations progress; items marked "unverified" should be updated after primary-source confirmation.
>
> © 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division
> gameworker@gmail.com · github.com/gameworkerkim · ORCID 0009-0002-0962-2175
> *"Today's national strategic asset becomes tomorrow's cybercrime tool."*
