# Vercel Security Breach Analysis

> **AI SaaS Supply Chain Attack and ShinyHunters Threat Assessment**
> *Google Workspace OAuth Takeover via Context.ai and Potential NPM/GitHub Software Supply Chain Risk*

---

## Document Metadata

| Field | Value |
| --- | --- |
| **Report ID** | CTI-2026-0420-VERCEL |
| **Classification** | TLP:GREEN — Cleared for external sharing |
| **Severity** | **HIGH** — Supply-chain attack potential · broad impact on the developer ecosystem |
| **Target Sector** | Cloud development platforms · SaaS · Web3/blockchain projects |
| **Incident Date** | April 18–19, 2026 (public disclosure: 2026-04-19) |
| **Threat Actor** | Self-proclaimed ShinyHunters (possible UNC6240/UNC6661 linkage) |
| **Publication Date** | April 20, 2026 |
| **Publisher** | Dennis Kim — [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Incident Overview](#2-incident-overview)
3. [Incident Timeline](#3-incident-timeline)
4. [Attack Vector and Technical Analysis](#4-attack-vector-and-technical-analysis)
5. [Threat Actor Analysis: ShinyHunters](#5-threat-actor-analysis-shinyhunters)
6. [Indicators of Compromise (IoC)](#6-indicators-of-compromise-ioc)
7. [Response Actions and Security Recommendations](#7-response-actions-and-security-recommendations)
8. [Implications for the Web3 and Crypto Industry](#8-implications-for-the-web3-and-crypto-industry)
9. [Conclusion and Strategic Implications](#9-conclusion-and-strategic-implications)
10. [References and Sources](#10-references-and-sources)
11. [Appendix A. Glossary](#appendix-a-glossary)

---

## 1. Executive Summary

On April 19, 2026, **Vercel Inc.**, one of the leading frontend cloud development platforms, formally confirmed unauthorized access to its internal systems. The breach did not stem from a vulnerability in Vercel's own product; instead, it originated from a compromise of **Context.ai**, an AI-agent platform used by a Vercel employee. The resulting chain — **Google Workspace OAuth token theft → environment variable enumeration → internal lateral movement** — represents a textbook third-party SaaS supply chain attack.

A threat actor self-identifying as ShinyHunters posted on BreachForums offering Vercel's internal database, access keys, source code, NPM tokens, GitHub tokens, and employee credentials **for USD 2 million (≈ KRW 2.9 billion)**. Vercel CEO Guillermo Rauch publicly assessed that, given the attacker's operational velocity and deep understanding of Vercel's internal systems, the intrusion was **"very likely significantly accelerated by AI."**

> ⚠ **Core Risk**: If NPM and GitHub tokens were in fact exfiltrated, the attacker could inject malicious code into the deployment pipeline of the entire Next.js-based ecosystem — extending far beyond Vercel itself. This holds the potential to escalate into a global software supply chain incident comparable to SolarWinds or Salesloft-Drift. Vercel has officially stated that Next.js, Turbopack, and its open-source supply chain remain safe, but the impact investigation is still ongoing.

### Key Judgments

| # | Judgment | Basis and Confidence |
| --- | --- | --- |
| **KJ-1** | Initial access originated from the Context.ai compromise; there is no evidence of a vulnerability in Vercel's own product. | Explicitly stated in Vercel's official security bulletin and CEO statement. **Confidence: High** |
| **KJ-2** | Environment variables classified as "non-sensitive" served as the decisive pivot for privilege escalation. | Publicly acknowledged by the CEO on X (Twitter). "Non-sensitive" variables are not encrypted at rest and are therefore readable. **Confidence: High** |
| **KJ-3** | If NPM/GitHub token theft is confirmed, a secondary supply-chain attack against the global JavaScript ecosystem becomes a realistic scenario. | Based on claims in the BreachForums listing. Vercel's supply chain audit found Next.js and Turbopack safe. **Confidence: Medium** |
| **KJ-4** | The seller's "ShinyHunters" self-identification may be brand hijacking, but the TTPs are consistent with the 2025–2026 campaigns. | Actors linked to recent ShinyHunters operations denied involvement to BleepingComputer. Mandiant clusters activity as UNC6240, UNC6661, and UNC6671. **Confidence: Medium** |
| **KJ-5** | This incident will become a reference case for the emerging attack pattern: "AI SaaS → identity plane → development ecosystem." | A chain of structurally identical incidents exists, including Salesloft-Drift (Aug 2025), Gainsight, Mixpanel, and Anodot. **Confidence: High** |

---

## 2. Incident Overview

### 2.1 Victim Profile

| Attribute | Detail |
| --- | --- |
| **Company** | Vercel Inc. |
| **Core Business** | Cloud hosting and deployment infrastructure centered on JavaScript frameworks (the developer of Next.js) |
| **Flagship Products** | Next.js · Turbopack · Serverless Functions · Edge Computing · CI/CD Pipeline |
| **IPO Status** | Preparing for a 2026 IPO (days after reporting a 240% revenue surge) |
| **Disclosure Channels** | Official security bulletin (vercel.com) + CEO statement on X (Twitter) · BreachForums listing |
| **Response Partners** | Google Mandiant (incident response) · additional security firms · law enforcement notification |

### 2.2 Attack Chain Summary

The attack unfolded in five distinct stages. Each stage is grounded in Vercel's official security bulletin and in CEO Guillermo Rauch's public account of the incident.

| Stage | Label | Details |
| --- | --- | --- |
| **Step 1** | Third-Party Compromise | The AI-agent platform Context.ai was breached first, placing its Google Workspace OAuth application permissions under attacker control. |
| **Step 2** | Account Takeover (ATO) | Through the OAuth integration, the attacker hijacked the Google Workspace account of a Vercel employee who used Context.ai. |
| **Step 3** | Lateral Movement | Using the compromised employee's Google Workspace identity, the attacker accessed Vercel's internal environments (dashboards and management surfaces). |
| **Step 4** | Env Var Enumeration | The attacker enumerated and read environment variables marked as "non-sensitive" by developers — stored in plaintext. |
| **Step 5** | Privilege Escalation + Exfil | Secrets and tokens harvested from enumerated variables were used to escalate privileges and exfiltrate data. The stolen data was subsequently listed for sale on BreachForums. |

> 📌 The defining feature of this attack chain is that **identity** has become the new center of the attack surface. The attacker did not breach Vercel's network perimeter. A single OAuth-connected SaaS compromise became the bridge from Google Workspace into Vercel's management console — structurally identical to the Salesloft-Drift incident of August 2025.

---

## 3. Incident Timeline

The following table summarizes the publicly disclosed key events in chronological order. All times are based on media reporting and the CEO's public statements.

| Timestamp (UTC / ET) | Event |
| --- | --- |
| **Undisclosed (pre-event)** | Context.ai compromise occurs. A security researcher notifies Vercel; Vercel launches an internal investigation immediately. |
| **2026-04-19 02:02 ET** | A BreachForums administrator account posts a listing titled *"Vercel Database Access Key & Source Code - 19 Apr"*. Asking price: USD 2 million (flexible from USD 500k in BTC), with a "first come, single buyer" condition. |
| **2026-04-19 (afternoon)** | Vercel publishes an official security bulletin titled *"Vercel April 2026 security incident,"* acknowledging an incident "affecting a limited subset of customers" and beginning direct notification of affected customers. |
| **2026-04-19 18:14 ET** | Vercel publishes an IoC: Context.ai's Google Workspace OAuth App ID is formally identified — `110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com`. |
| **2026-04-19 19:21 ET** | CEO Guillermo Rauch publishes a detailed incident rundown on X, explicitly naming the Context.ai → Google Workspace → Vercel environment variable path. |
| **2026-04-20 04:08 UTC** | The CEO confirms supply-chain audit results: Next.js, Turbopack, and open-source projects remain safe — directly rebutting the BreachForums framing of a "Next.js supply-chain risk." |
| **2026-04-20 (this report)** | Mandiant-led incident response is ongoing. Claims circulate on Telegram that the seller directly demanded ransom from Vercel. Vercel has not publicly confirmed any negotiation. |

---

## 4. Attack Vector and Technical Analysis

### 4.1 The Role of Context.ai and OAuth Delegation Abuse

Context.ai is an AI-agent platform for enterprise workflow automation. It integrates with Google Workspace via OAuth and obtains delegated scopes across users' mail, calendar, and drive data. In this incident, by compromising either Context.ai's own systems or its OAuth application credentials, the attacker reached a position from which **tokens belonging to every Google Workspace user who had consented to the app** could be indirectly obtained.

**Intrinsic risks of this architecture:**

| Risk Factor | Technical Explanation |
| --- | --- |
| **Longevity of OAuth tokens** | Refresh tokens are not automatically invalidated by user logout or password changes. Once stolen, they grant persistent access that effectively bypasses MFA. |
| **Secondary SaaS lateral spread** | A Google Workspace account takeover cascades into ATOs on every SaaS tied to "Sign in with Google" — Vercel, Slack, Figma, and beyond. |
| **"Invisible" attack surface** | OAuth app usage has low administrative visibility, and post-consent logging is limited. This compounds the Shadow IT problem created when users connect AI tools autonomously. |
| **AI agent permission amplification** | AI platforms tend to request broad scopes (`gmail.readonly`, `drive`, etc.) in the name of efficiency, giving a single compromise an outsized blast radius. |

### 4.2 The Weakness of "Non-Sensitive" Environment Variables

Vercel maintains a principle that all customer environment variables are encrypted at rest. However, for developer convenience, Vercel offers two classes — "sensitive" and "non-sensitive" — and variables marked as the latter are **readable in plaintext**, not encrypted. The CEO publicly acknowledged that this "non-sensitive" classification was abused as the attacker's pivot for privilege escalation.

> 🔑 **Practical implication**: Many developers classify RPC endpoints, internal API URLs, external service IDs, and analytics keys as "non-sensitive." Yet such values provide attackers with a map of the internal architecture, and some grant a level of access that permits data retrieval from downstream services without additional secrets. **In Web3 projects especially, RPC endpoints and Graph API keys are frequently — and incorrectly — classified as non-sensitive.**

### 4.3 Claimed Data Types and Supply-Chain Blast Radius

According to the evidence and claims put forward by the BreachForums seller, the exfiltrated data is said to include the items below. Note that Vercel has not officially confirmed source-code theft, and the attacker's screenshot more closely resembles an internal IDP (Identity Provider) user schema.

| Data Type | Attacker's Claim | Vercel's Official Position | Supply-Chain Risk |
| --- | --- | --- | --- |
| Employee account data (580 records) | Publicly posted (names, emails, activity timestamps) | Partial exposure acknowledged | 🟡 **Medium** |
| Internal database schema | Screenshot provided | Not confirmed | 🟡 **Medium** |
| Environment variables (non-sensitive) | Access claimed | Officially acknowledged | 🔴 **High** |
| NPM tokens | Offered for sale | Not confirmed · audit result "safe" | 🔴 **Very High** |
| GitHub tokens | Offered for sale | Not confirmed · audit result "safe" | 🔴 **Very High** |
| Source code | Offered for sale | Denied (unconfirmed) | 🟠 **High** |
| Customer API keys | Offered for sale | Partial credential exposure notified | 🔴 **High** |
| Sensitive environment variables (encrypted) | No claim of access | No evidence of access | 🟢 **Low** |

---

## 5. Threat Actor Analysis: ShinyHunters

### 5.1 Overview and 2026 Activity

ShinyHunters is a cybercriminal brand that emerged around 2020, originally centered on bulk data theft and sale via BreachForums. Beginning in 2024, the group pivoted toward cloud-SaaS-based extortion and is today regarded as one of the most active corporate data-theft operations. Google Mandiant (GTIG) tracks activity self-attributed to ShinyHunters not as a single organization but as several clusters — **UNC6040, UNC6240, UNC6661, and UNC6671**.

### 5.2 Major 2025–2026 Campaigns

| Period | Campaign | Core TTPs |
| --- | --- | --- |
| **2024 (Snowflake)** | AT&T, Ticketmaster, Santander, and 100+ others | Credential stuffing against Snowflake customer accounts; systematic targeting of non-MFA accounts. |
| **2025.08 (Drift)** | Salesloft Drift → 760+ Salesforce instances | Theft of Drift OAuth tokens → broad access to connected Salesforce and Google Workspace accounts. Cloudflare, Palo Alto, Zscaler, and Proofpoint were among the victims. |
| **2025.11 (Mixpanel)** | Analytics data exfiltration affecting PornHub, OpenAI, and others | Smishing against Mixpanel employees to exfiltrate analytics datasets. |
| **2026.01 (Vishing)** | Vishing against Okta and enterprise SSO | IT-support impersonation over voice calls to harvest SSO + MFA codes, followed by attacker device MFA enrollment. |
| **2026.03 (Salesforce)** | 300–400 Salesforce Experience Cloud customers | Weaponization of Mandiant's open-source AuraInspector audit tool. Unauthenticated queries against `/s/sfsites/aura` endpoints to exfiltrate CRM data. |
| **2026.03 (TELUS)** | TELUS Digital, 1 PB data theft | Telco/BPO data, including FBI background check records. Ransom demand of USD 65 million. |
| **2026.04 (Anodot)** | Rockstar Games Snowflake (via Anodot) | Customer Snowflake access via the Anodot SaaS analytics platform — the same "third-party SaaS → core data" pattern. |
| **2026.04.19 (Vercel)** | **Vercel (via Context.ai) — this incident** | **AI-agent platform OAuth compromise → Google Workspace → Vercel environment variables. The AI-era evolution of the 2025–2026 pattern.** |

### 5.3 Shared Attack Pattern Elements

ShinyHunters-branded campaigns in 2025–2026 repeatedly exhibit the following common elements. The Vercel incident is a natural evolution of this pattern.

| # | Common TTP | Application in Vercel Incident |
| --- | --- | --- |
| 1 | Third-party SaaS as the initial contact point | ✅ Context.ai |
| 2 | OAuth/SSO token abuse to bypass MFA | ✅ Google Workspace OAuth |
| 3 | Cloud-to-cloud lateral movement between SaaS | ✅ Workspace → Vercel management surface |
| 4 | Ransom demand within 72 hours of data theft | ✅ BreachForums USD 2M sale and extortion |
| 5 | Simultaneous exposure via DLS and forums | ✅ BreachForums + Telegram in parallel |
| 6 | Leverage of reputational damage against the victim | ✅ Timing aligned with Vercel's imminent IPO |

> ⚠ According to BleepingComputer (April 19, 2026), actors linked to recent ShinyHunters operations have denied involvement in the Vercel incident. This suggests that the "ShinyHunters" brand no longer refers to a single organization, and that unrelated threat actors increasingly borrow it for credibility. **A definitive attribution judgment should await Mandiant's final analysis.**

---

## 6. Indicators of Compromise (IoC)

The following IoC was confirmed in Vercel's official security bulletin (2026-04-19) and in related reporting. Google Workspace administrators should audit the OAuth App ID below immediately.

### 6.1 Google Workspace OAuth Application (Primary IoC)

| Type | Value |
| --- | --- |
| **OAuth Client ID** | `110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com` |
| **Associated Service** | Context.ai (AI-agent platform) |
| **Risk** | If a user consented to this app, the attacker can access Google Workspace APIs in that user's context. |

### 6.2 Observed TTPs (MITRE ATT&CK Mapping)

| ATT&CK ID | Tactic / Technique | Application in This Incident |
| --- | --- | --- |
| `T1199` | Trusted Relationship | Abuse of the Context.ai trust relationship |
| `T1528` | Steal Application Access Token | Theft of Google Workspace OAuth tokens |
| `T1550.001` | Use Alternate Authentication: App Token | Impersonation of the Vercel employee via OAuth token |
| `T1078.004` | Valid Accounts: Cloud Accounts | Internal access using a legitimate employee Vercel account |
| `T1580` | Cloud Infrastructure Discovery | Enumeration of Vercel's internal environment variables |
| `T1552.001` | Credentials in Files | Harvesting of secrets from "non-sensitive" environment variables |
| `T1567` | Exfiltration Over Web Service | Data exfiltration and listing on BreachForums |
| `T1657` | Financial Theft / Extortion | USD 2M ransom demand and Telegram-based extortion |

### 6.3 Recommended Audit Queries

Google Workspace administrators should verify the usage history of the OAuth app at the following locations:

- Admin Console → Security → API controls → Domain-wide delegation
- Admin Console → Security → API controls → Manage Third-Party App Access
- Admin Console → Reports → Audit log → OAuth Log Events
- Users Report → Security → Connected Applications (per-user)

---

## 7. Response Actions and Security Recommendations

The recommendations below are grounded in Vercel's official response, the CEO's public statements, Mandiant guidance, and **industry best practices (NIST SP 800-61 and 800-207)**. They are prioritized as P0 (immediate), P1 (within 24 hours), and P2 (within 7 days).

### 7.1 P0 — Immediate Actions for Vercel Customers

| # | Action | Description |
| --- | --- | --- |
| **P0-1** | Secret rotation | Immediately rotate all API keys, tokens, DB credentials, and passwords registered on the Vercel dashboard. NPM and GitHub tokens are the top priority. |
| **P0-2** | Environment variable reclassification | Audit every "non-sensitive" environment variable and reclassify any that contain secrets as "Sensitive." |
| **P0-3** | OAuth app audit | Verify and remove usage history of Client ID `110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj...` within Google Workspace. |
| **P0-4** | Deployment log review | Review Vercel deployment pipeline logs for the past 14 days for abnormal deployments, newly added environments, and permission changes. |
| **P0-5** | Strengthen Deployment Protection | Set Deployment Protection to Standard or higher. Immediately rotate any existing bypass tokens. |

### 7.2 P1 — Within 24 Hours (For All SaaS-Dependent Organizations)

| # | Action | Description |
| --- | --- | --- |
| **P1-1** | Revisit OAuth app allowlist policy | Switch Google Workspace / Microsoft 365 "App access control" to allowlist mode. Bulk-revoke unnecessary AI-agent OAuth permissions. |
| **P1-2** | Enforce MFA everywhere | Apply hardware-key (FIDO2) based MFA across all Vercel, GitHub, NPM, and Google Workspace accounts. |
| **P1-3** | AI tooling inventory | Conduct a full census of approved and unapproved AI-agent tools. Tier risk by data access scope. |
| **P1-4** | Enable secret scanning | Scan all repositories with GitHub Advanced Security or TruffleHog/Gitleaks. Enforce Push Protection. |
| **P1-5** | Minimize NPM/GitHub token scope | Move from classic PATs to fine-grained PATs, GitHub Apps, and OIDC federation. Use granular publish-only tokens for NPM. |

### 7.3 P2 — Strategic (Within 7 Days, Structural Change)

| # | Action | Description |
| --- | --- | --- |
| **P2-1** | Adopt Zero Trust architecture | Require Identity + Device + Context verification for all SaaS access. Implement re-authentication based on session risk. |
| **P2-2** | Supply chain due diligence | Require SOC 2 Type II, ISO 27001, and evidence of OAuth scope minimization from AI SaaS vendors. |
| **P2-3** | Isolate CI/CD pipelines | Migrate build environments to independent OIDC-federation-based environments, separated from individual developer accounts. |
| **P2-4** | Incident tabletop exercises | Run Vercel-scenario tabletop exercises. Validate the integrated legal, PR, and technical response workflow. |

---

## 8. Implications for the Web3 and Crypto Industry

Vercel has become the de facto standard for frontend deployment infrastructure across the global Web3 and DeFi ecosystem. Many DeFi protocols, NFT marketplaces, and stablecoin project web interfaces run on top of Vercel hosting. This incident raises distinctive risks for the crypto ecosystem, summarized below.

### 8.1 Risks Specific to Crypto Projects

| Risk Type | Concrete Scenario |
| --- | --- |
| **Frontend hijack** | If an attacker obtains deployment tokens, they can modify a DApp's frontend JavaScript to redirect user signature requests to attacker-controlled wallets — a potential replay of the BadgerDAO incident (2021, USD 120M loss). |
| **RPC endpoint exposure** | If Alchemy/Infura/QuickNode RPC URLs are misclassified as "non-sensitive" environment variables, attackers can monitor traffic, intercept MEV, and conduct denial-of-service attacks. |
| **Admin wallet address leakage** | If admin address lists for multisig or timelock contracts are stored in environment variables, attackers can leverage them for targeted social engineering. |
| **Price oracle API keys** | Theft of Chainlink Data Feeds, CoinGecko Pro, or CoinMarketCap API keys can enable price manipulation or DoS-induced liquidation triggers. |
| **Subgraph access permissions** | Exposure of access keys for The Graph-based indexers can inflate query costs and facilitate data integrity attacks. |
| **KYC/AML data** | Exposure of credentials to KYC vendors used by CEXs, RWA projects, and stablecoin issuers can cause secondary PII leakage. |

### 8.2 Perspective of the Korean Web3 Ecosystem

A substantial portion of Korean Web3 projects rely on Vercel-based hosting. This includes the frontends of tokens listed on DAXA member exchanges and the official websites of token issuers. The following actions are particularly recommended in connection with this incident:

| Stakeholder | Recommendation |
| --- | --- |
| **DAXA member exchanges** | Consider adding "deployment infrastructure SaaS dependency and supply-chain incident response capability" to the listing review security checklist. |
| **Domestic Web3 issuers** | Re-examine reliance on frontend deployment SaaS such as Vercel, Cloudflare Pages, and Netlify. Re-audit environment variable classifications and rotate deployment tokens. |
| **Stablecoin projects** | For Proof of Reserves (PoR) dashboards hosted on Vercel, audit data feed integrity and verify WAF / SRI enforcement. |
| **Legal and compliance** | Reassess PIPC and KoFIU notification triggers from a supply-chain compromise perspective. Reevaluate possible designation as a substantive custodian under the Specific Financial Information Act (특금법). |

> 💡 **Recommendation**: This incident reaffirms that "infrastructure supply chain" requires the same level of continuous security validation as protocol auditing. **Risk modeling for Web3 projects must extend beyond smart contract audits to cover the full chain — hosting, deployment, CDN, DNS, and wallet-integration SDKs.**

---

## 9. Conclusion and Strategic Implications

The Vercel incident is more than a single corporate breach; it exposes a **structural inflection point in enterprise security in the age of AI**. Three strategic lessons emerge.

### Lesson 1 — "AI agent = supreme-privilege insider"

AI workflow tools demand broad OAuth access to email, files, calendars, and CRM in the name of productivity. In effect, this is equivalent to leasing a "virtual employee with top-tier privileges" from an external vendor. When that vendor is breached, the blast radius instantly expands across the organization. Any AI adoption decision must be accompanied by a threat model that explicitly includes a "third-party SaaS compromise" scenario.

### Lesson 2 — There is no such thing as "non-sensitive"

As publicly acknowledged by the CEO, "non-sensitive" environment variables were the decisive pivot for privilege escalation. Attackers assemble an attack-surface map by aggregating "non-sensitive" fragments. From a Zero Trust perspective, every environment variable, every log, and every piece of metadata must be treated as a potential secret.

### Lesson 3 — Supply chain attacks target the "apex of the pyramid"

Throughout 2025–2026, ShinyHunters has repeatedly struck SaaS "hubs" — Salesloft, Gainsight, Mixpanel, Anodot, and now Context.ai — producing cascading effects across hundreds to thousands of downstream organizations. This is economically rational from the attacker's standpoint. Defenders, in turn, must move beyond perimeter defense and maintain a Third-Party Risk Management (TPRM) program that continuously evaluates "the security posture of the entire trusted vendor ecosystem."

> 📍 **Final judgment**: The officially disclosed impact is limited to "a limited subset of customers," yet depending on whether NPM/GitHub tokens were exfiltrated, a broader reassessment of deployment pipeline trustworthiness across the global Next.js application base may be warranted. **Continued monitoring of Vercel- and Context.ai-related disclosures is recommended for at least the next 30 days.** This report will be updated as additional information becomes available.

---

## 10. References and Sources

This report was produced by cross-referencing primary materials disclosed on April 19–20, 2026 with secondary reporting from dedicated security outlets.

### 10.1 Vercel Official Materials and Primary Reporting

1. *BleepingComputer*, "Vercel confirms breach as hackers claim to be selling stolen data." <https://www.bleepingcomputer.com/news/security/vercel-confirms-breach-as-hackers-claim-to-be-selling-stolen-data/>
2. *The Hacker News*, "Vercel Breach Tied to Context AI Hack Exposes Limited Customer Credentials." <https://thehackernews.com/2026/04/vercel-breach-tied-to-context-ai-hack.html>
3. *CCLeaks* (Detailed Incident Rundown), "Vercel Discloses April 2026 Breach of Internal Systems." <https://ccleaks.com/news/vercel-april-2026-internal-systems-security-incident>
4. *Cryptika Cybersecurity*, "Vercel Confirms Data Breach — Hackers Claim Access to Internal Systems." <https://www.cryptika.com/vercel-confirms-data-breach-hackers-claim-access-to-internal-systems/>
5. *The Information*, "Vercel Confirms Breach After Hackers List Stolen Data for $2M." <https://www.theinformation.com/briefings/vercel-confirms-breach-hackers-list-stolen-data-2m>
6. *The Block*, "Web3 hosting backbone Vercel confirms breach as supposed hacker demands $2M ransom." <https://www.theblock.co/post/398010/web3-hosting-backbone-vercel-confirms-breach-as-supposed-hacker-demands-2-million-ransom>
7. *Cryptopolitan*, "Cloud Dev platform breach tied to compromised AI tool raises alarm." <https://www.cryptopolitan.com/vercel-breach-tied-to-compromised-ai-tool/>
8. *Startup Fortune*, "Vercel Breach Exposes AI Tool Supply Chain Risk Ahead of IPO." <https://startupfortune.com/vercel-breach-exposes-ai-tool-supply-chain-risk-ahead-of-ipo/>
9. *Phemex News*, "Vercel Breach Tied to Compromised AI Tool OAuth App." <https://phemex.com/news/article/vercel-security-breach-linked-to-compromised-thirdparty-ai-tool-74421>
10. *MEXC News*, "Vercel Security Breach Raises Concerns for Crypto Projects." <https://www.mexc.co/news/1038486>

### 10.2 ShinyHunters Threat Actor Analysis

11. *Wikipedia* (latest revision), "ShinyHunters." <https://en.wikipedia.org/wiki/ShinyHunters>
12. *Google Cloud Blog / Mandiant Threat Intelligence Group*, "Tracking the Expansion of ShinyHunters-Branded SaaS Data Theft." <https://cloud.google.com/blog/topics/threat-intelligence/expansion-shinyhunters-saas-data-theft>
13. *Salesforce Ben*, "ShinyHunters 'Breach 400 Companies' via Salesforce Experience Cloud." <https://www.salesforceben.com/shinyhunters-breach-400-companies-via-salesforce-experience-cloud/>
14. *Computer Weekly*, "ShinyHunters Salesforce cyber attacks explained." <https://www.computerweekly.com/feature/ShinyHunters-Salesforce-cyber-attacks-explained-What-you-need-to-know>
15. *Help Net Security*, "ShinyHunters claims new campaign targeting Salesforce Experience Cloud sites." <https://www.helpnetsecurity.com/2026/03/11/shinyhunters-salesforce-aura-data-breach/>
16. *Varonis*, "What Salesforce Organizations Need to Know About ShinyHunters and Vishing." <https://www.varonis.com/blog/salesforce-vishing-threat-unc604>
17. *State of Surveillance*, "ShinyHunters Weaponized a Security Tool to Breach 400 Companies via Salesforce." <https://stateofsurveillance.org/news/shinyhunters-salesforce-aura-400-companies-security-tool-weaponized-2026/>
18. *Hackread*, "ShinyHunters Claims Rockstar Games Snowflake Breach via Anodot." <https://hackread.com/shinyhunters-rockstar-games-snowflake-breach-anodot/>
19. *Cybernews*, "Hackers threaten to leak over 9M Amtrak records via Salesforce." <https://cybernews.com/security/hackers-threaten-amtrak-data-leak/>
20. *Mayhem Code*, "ShinyHunters Hacking Group Explained: 400 Companies Breached." <https://www.mayhemcode.com/2026/03/shinyhunters-hacking-group-explained.html>

### 10.3 OAuth and Google Workspace Supply-Chain Attack Context

21. *Red Canary*, "Breaking down a supply chain attack leveraging a malicious Google Workspace OAuth app." <https://redcanary.com/blog/threat-detection/google-workspace-oauth-attack/>
22. *IronCore Labs*, "The Terrifying Takeaways from the Massive OAuth Breach (Salesloft Drift)." <https://ironcorelabs.com/blog/2025/oath-token-tragedy/>
23. *The Hacker News*, "Google OAuth Vulnerability Exposes Millions via Failed Startup Domains." <https://thehackernews.com/2025/01/google-oauth-vulnerability-exposes.html>
24. *Truffle Security*, "Millions of Accounts Vulnerable due to Google's OAuth Flaw." <https://trufflesecurity.com/blog/millions-at-risk-due-to-google-s-oauth-flaw>
25. *Google Cloud Documentation*, "Best practices for mitigating compromised OAuth tokens for Google Cloud CLI." <https://cloud.google.com/architecture/bps-for-mitigating-gcloud-oauth-tokens>
26. *Material Security*, "How Hackers Exploit Google Workspace Security." <https://material.security/workspace-resources/google-workspace-security-gaps-hackers-exploit-and-how-to-patch-them-today>
27. *Kaspersky Daily*, "Why using Google OAuth in work applications is unsafe." <https://www.kaspersky.com/blog/vulnerability-in-google-oauth/50286/>

---

## Appendix A. Glossary

| Term | Definition |
| --- | --- |
| **OAuth 2.0** | A delegated-authorization standard that lets a third-party application access resources on a user's behalf without requiring the user's password. |
| **Refresh Token** | A long-lived token used to obtain new access tokens after expiry. If stolen, it enables MFA-bypassing persistent access. |
| **Environment Variable** | A configuration value injected at application runtime, commonly used to store secrets such as API keys and database credentials. |
| **Supply Chain Attack** | An attack that first compromises a trusted third-party vendor to indirectly reach the final target, rather than attacking the target directly. |
| **BreachForums** | A major English-language cybercrime forum widely regarded as the successor to RaidForums, hosting numerous data leak listings. |
| **DLS (Data Leak Site)** | A dark web site where threat actors publish samples of stolen data to apply public extortion pressure on victims. |
| **Non-sensitive Variable** | A Vercel environment variable classification that is not encrypted at rest and is therefore readable — the decisive pivot in this incident. |
| **NPM/GitHub Token** | Personal access tokens for the Node.js package manager (NPM) and GitHub APIs, respectively. If stolen, they enable malicious code distribution. |

---

*— End of Report —*

**© 2026 Dennis Kim · Cyber Threat Intelligence Division**
[github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*This report is an independent analysis based on publicly available information and does not represent the official position of any organization referenced herein.*

`TLP:GREEN` · `CTI-2026-0420-VERCEL` · Published: 2026-04-20
