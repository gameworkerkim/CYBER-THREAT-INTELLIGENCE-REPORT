# CTI-2026-0520-EVILTOKENS

> **TLP:AMBER**
> Dennis Kim CTI | 2026-05-20 (KST) | Threat Campaign / PhaaS
> lang: en

---

# EvilTokens — AI-Generated Device Code Phishing PhaaS

*Abuses Microsoft 365 OAuth device flow · Defeats MFA · Token-theft type*

Published: 2026-05-20 (KST) | Category: Threat Campaign / PhaaS | Author: Dennis Kim CTI

### 1. Executive Summary

EvilTokens is a **Phishing-as-a-Service (PhaaS) platform** that emerged on Telegram in mid-February 2026. Within five weeks of its appearance it compromised more than 340 Microsoft 365 organizations across five countries, with over 1,000 active phishing domains tracked. The core of this threat is that it **does not steal passwords**.

The attacker abuses Microsoft's legitimate OAuth 2.0 device authentication flow (Device Authorization Grant). The victim enters a code on the genuine microsoft.com/devicelogin page and completes MFA as usual, but in reality **hands the attacker a valid refresh token** with access to mail, drive, calendar, and contacts. The attacker needs no password, never touches an MFA prompt, and never generates a login event that looks like an intrusion.

> **Paradigm Shift** — A move from "credential theft" to "session and token theft." Password-centric defenses and most MFA implementations are no longer sufficient on their own.

#### 1.1 Case Overview

| Item | Detail |
| --- | --- |
| **Name** | EvilTokens (PhaaS) |
| **Type** | Device code phishing / AiTM and BEC support kit |
| **First Observed** | Mid-February 2026 (Telegram ad), campaigns from 2/18 |
| **Impact Scale** | **340+ MS365 orgs in five weeks, 1,000+ phishing domains** |
| **Core Technique** | **Abuse of OAuth 2.0 Device Authorization Grant** |
| **MFA Bypass** | **Yes — passes through the legitimate auth flow as-is** |
| **Primary Targets** | Finance, HR, logistics, sales roles (BEC-vulnerable functions) |
| **Build Method** | Presumed AI "vibe coding" generation (Sekoia/Proofpoint assessment) |
| **Expansion Plans** | Announced support for Gmail and Okta phishing pages |

### 2. Attack Mechanism

The device code flow is a legitimate authentication method originally designed for input-constrained devices such as smart TVs, IoT, and CLI tools. EvilTokens abuses it by impersonating the "device" role.

1. The attacker sends a request to the Microsoft API to generate a real device code tied to their own session
2. With a lure such as a shared document, payroll notice, or meeting invite, the victim is instructed to "enter this code at the genuine microsoft.com/devicelogin" (using DocuSign/Adobe/SharePoint impersonation templates)
3. The victim enters the code on the real Microsoft page and completes their usual login (plus MFA)
4. Microsoft issues access and refresh tokens for the victim's account to the attacker, securing persistent, authenticated access

> **Why Detection Is Hard** — The URL is real, the page is real, the MFA prompt is real. Credentials are not intercepted in transit, and because authentication occurs on a legitimate Microsoft domain, it bypasses conventional phishing detection (based on suspicious URLs) and awareness training.

### 3. Infrastructure and Operations Analysis

#### 3.1 SaaS-Style Criminal Ecosystem

EvilTokens is not a single phishing kit but a structured PhaaS operation with subscription tiers, customer support channels, dashboards, and onboarding. It runs a 24/7 support team and a customer feedback channel, and its product surface resembles a genuine SaaS catalog.

- Bulk sender: sends mail using compromised MS365 accounts with Graph API and bearer tokens; template campaigns, recipient management, real-time tracking
- SMTP infrastructure: DKIM and domain management, parallel sending workers, open/click tracking, IP rotation
- Office 365 capture module: captures post-authentication tokens by abusing the device login flow; backend panel for session retrieval
- Portal Browser: a feature to manage and access multiple compromised accounts simultaneously (scaling BEC and account takeover)
- Email validation service: confirms whether an address exists in an MS365 tenant before a campaign, turning targeting into a data-driven pipeline

#### 3.2 Infrastructure Patterns

Some campaigns abused Cloudflare Workers redirects and Railway.com (PaaS) to spin up thousands of short-lived polling nodes and deploy Node.js backend logic, evading signature- and pattern-based detection. Evidence of dynamic code generation to evade the standard 15-minute device code expiration window was also observed.

### 4. AI Nexus

Multiple research teams (Sekoia, Proofpoint) assess that the EvilTokens kit is **AI-generated based on "vibe coding"** for its build and maintenance. The roughly five-week pace from emergence to 1,000 domains is a level that was previously impossible without a large team, illustrating how AI structurally accelerates a threat actor's development and iteration speed.

Proofpoint observed seven nearly identical device code phishing variants within a 10-day window, distinguished by subtle differences in API endpoints and HTML headers. This suggests a parallel AI-driven "secondary production" trend that imitates and mutates EvilTokens. This item is a direct analytical link to Betalabs' cross-LLM output divergence research and AI security track.

### 5. Detection and Hunting

- Hunt for device code authentication events (authentication method = device code) in Entra ID sign-in logs — especially device code logins on user accounts rather than non-interactive devices
- Detect EvilTokens phishing pages with Sekoia's published YARA rule; query known URL patterns on urlscan.io and urlquery
- Configure Safe Links in Defender for Office 365 to enable high-confidence device code phishing alerts
- Monitor anomalous redirects via Railway.com/Cloudflare Workers and short-lived polling node traffic
- Focus inspection on DocuSign/SharePoint/payroll-notice lure emails targeting finance, HR, logistics, and sales roles

### 6. Recommendations

#### 6.1 Policy-Based Blocking (Top Priority)

- Apply an Entra ID Conditional Access policy to block the Device Code Flow — allow exceptions only for groups that genuinely need IoT/CLI
- Enforce phishing-resistant MFA (FIDO2/passkeys) for admin and high-privilege accounts

#### 6.2 Containment

- On suspected compromise, revoke refresh tokens (revokeSignInSessions). Note that standard session revocation only invalidates refresh tokens, and access tokens may persist for up to one hour
- Because actors actively exploit that one-hour window, temporarily disabling the compromised account is recommended for immediate containment
- Inspect and remove malicious mailbox forwarding rules and OAuth consent apps

#### 6.3 Awareness Training

- "A real URL can still be dangerous" — train users to report the abnormal request itself, i.e., being told to enter a code at devicelogin

### 7. Timeline

| Date | Event |
| --- | --- |
| ~2026-02-15 | EvilTokens Telegram advertising begins (PhaaS sales) |
| 2026-02-18~19 | First campaigns observed (Huntress, Unit 42) |
| 2026-03-23 | 1,000+ phishing domains tracked (Sekoia) |
| 2026-03-30~31 | Sekoia detailed analysis published, AI-generation assessment |
| 2026-04 | Multiple actors including Proofpoint's TA4903 observed pivoting to device code phishing |
| 2026-05 | 340+ MS365 orgs compromised in five weeks tallied; Gmail/Okta expansion announced |

### 8. References

- Sekoia TDR — "New widespread EvilTokens kit: device code phishing as-a-service"
- Proofpoint — "Device Code Phishing is an Evolution in Identity Takeover" (2026-05)
- Microsoft Security Blog — "Inside an AI-enabled device code phishing campaign" (2026-04)
- Huntress, Bolster AI, CSO Online, eSecurity Planet — analysis 2026-03~05

*This document is an OSINT-based threat campaign analysis. For IOCs (domains/YARA), obtaining the latest versions from original sources such as Sekoia is recommended. TLP:AMBER.*
