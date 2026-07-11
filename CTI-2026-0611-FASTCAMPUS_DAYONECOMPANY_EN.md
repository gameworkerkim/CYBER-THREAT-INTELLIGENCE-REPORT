# CTI-2026-0611 | FastCampus (Day1Company) Personal-Data Breach — Analysis of a Long-Dwell Intrusion via GitHub Master-Account Key Theft

> **⚠️ Alert Level: HIGH**
> **First Published: 2026-06-11** | **Last Updated: 2026-06-19** | **Version: v1.1** | **Language: English**
> **Author: HoKwang Kim (Dennis Kim)** · Betalabs Inc. · <gameworker@gmail.com>
> **ORCID:** [0009-0002-0962-2175](https://orcid.org/0009-0002-0962-2175) · **GitHub:** [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
> **lang:** en

> **📌 v1.1 Change Log (2026-06-19):** This update preserves the v1.0 body (Chapters 1–12) unchanged and adds **Appendix A — v1.1 Update (8-day post-incident tracking)** at the end. Key updates: ① confirmation that this incident is part of a **simultaneous 'GitHub credential theft' incident cluster**, not a standalone case; ② harm expansion to **large-enterprise B2B corporate-training students and instructors (including Samsung Electronics)**; ③ **government (KISA / Broadcasting and Media Communications Commission) recommendations prohibiting credential storage on developer platforms**; ④ **concretization of regulatory and class-action risk** (TVING class-action precedent; Logos / SKT fine precedents).

One-line summary: Detection of GitHub credential theft was slow, and because sensitive information of corporate-training students and instructors at important Korean IT enterprises was also compromised, victims may become targets of social-engineering hacking and smartphone/telecom-infrastructure attacks. More critical than TVING.

---


## Executive Summary

A large-scale personal-data breach occurred at **Day1Company Co., Ltd.**, which operates leading Korean online education platforms including **FastCampus, Coloso, Myright, ZeroBase, Newsspresso, Lispick, Shiny English, and Wannerspeak**.

The attacker stole the **GitHub service master-account key** used by Day1Company and first entered the service on **May 9, 2026**. The company recognized the possibility of an incident on **June 8**—about **30 days after initial intrusion**. Leaked information includes names, email addresses, phone numbers, and encrypted passwords; for some customers, addresses, job/title information, and parcel-order memos are also assessed to have been included.

Another problem this report highlights is **notification delay**. Although the company reported to authorities on June 9—the day after recognition (June 8)—the public notice to affected customers was posted only around **16:00 on June 11**. A notification gap of effectively **about 72 hours or more** from recognition raises serious issues under Personal Information Protection Act notification duties and victim protection.

Given the nature of a lecture business with many outsourced and short-term workers cycling in and out, information-security monitoring may have been absent. It is highly possible that an internal employee account with some privileges was compromised and cascading access followed.

> **(v1.1 reinforcement)** Post-incident tracking shows this case shares the **same intrusion pattern as the concurrent TVING (recognized 6/3) incident (developer-platform credential theft → cloud/DB access)** and is reassessed as part of the **June cluster of domestic service personal-data breaches**. See **Appendix A**.

---


## Table of Contents

1. [Incident Timeline](#1-incident-timeline)
2. [Attack Technique Analysis](#2-attack-technique-analysis)
3. [Scope of Leaked Information](#3-scope-of-leaked-information)
4. [Notification Delay — Critical Analysis](#4-notification-delay--critical-analysis)
5. [MITRE ATT&CK Mapping](#5-mitre-attck-mapping)
6. [Indicators of Compromise (IoC)](#6-indicators-of-compromise-ioc)
7. [Impact Scope and Secondary-Harm Potential](#7-impact-scope-and-secondary-harm-potential)
8. [Recommendations — For Affected Customers](#8-recommendations--for-affected-customers)
9. [GitHub · Google Account · GCP Protection Guide](#9-github--google-account--gcp-protection-guide)
10. [Recommendations for Enterprise Security Administrators](#10-recommendations-for-enterprise-security-administrators)
11. [Analyst Assessment and Limitations](#11-analyst-assessment-and-limitations)
12. [References](#12-references)
- **[Appendix A. v1.1 Update (2026-06-19)](#appendix-a-v11-update-2026-06-19--8-day-post-incident-tracking)**

---


## 1. Incident Timeline

```
[Unknown time]        GitHub master-account key (Secret/Token) stolen
       │
       ▼
2026-05-09          First confirmed service intrusion
       │             (~30 days of failed intrusion detection)
       │
       ▼
2026-06-08          Day1Company recognizes possible incident
                    → Threat blocking and remediation begun
       │
       ▼
2026-06-09          Reported to relevant authorities (KISA, etc.)
       │
       ▼
2026-06-10          First media reporting of the incident
                    (no formal customer notice yet)
       │
       ▼
2026-06-11 ~16:00   FastCampus notice posted
                    "Personal Information Leakage Notice [Day1Company]"
```

| Item                   | Date/Time                  |
| -------------------- | ------------------- |
| **Estimated first intrusion**         | May 9, 2026         |
| **Incident recognition**            | June 8, 2026         |
| **Detection-failure period**         | **~30 days**           |
| **Authority report**            | June 9, 2026         |
| **Affected-customer notice**         | ~16:00 June 11, 2026 |
| **Recognition → notice elapsed** | **~72–80 hours**       |

---


## 2. Attack Technique Analysis

### 2.1 Initial Access Vector: GitHub Master-Account Key Theft

Synthesizing the official notice and media reporting, the attacker achieved initial access by stealing the **GitHub service master-account key (API Token / Secret)** used by Day1Company.

Common paths for GitHub master-account key theft include:

```
Possible theft paths (not officially confirmed; based on common patterns):

① Hardcoded secret exposure in the code repository
   (token stored in plaintext in source or config files)

② CI/CD pipeline environment-variable theft
   (exposed in GitHub Actions workflow config)

③ Developer local-environment compromise
   (malware on developer PC; theft of .gitconfig or ~/.git-credentials)

④ GitHub OAuth token theft via phishing
   (lure to fake login page)

⑤ OAuth permission abuse by third-party apps/services
   (token leakage from linked services)
```

### 2.2 Long Dwell: ~30 Days of Detection Evasion

The most serious technical problem is that **the intrusion went undetected for about 30 days from first entry (May 9) to recognition (June 8)**. This suggests:

- Absence of continuous monitoring of GitHub access logs
- SIEM/DLP alerts for anomalous data-access patterns unset or nonfunctional
- Principle of least privilege (PoLP) not applied to master-account keys
- Audit logs of API token/secret usage not reviewed

### 2.3 Data-Exfiltration Method

The attacker is assessed to have used the GitHub master-account key to access Day1Company's **service infrastructure** and exfiltrate personal data from customer databases or related storage. Beyond simple code-repository access, the GitHub master-account key may have provided broad privileges via **OIDC/OAuth connections to linked cloud infrastructure (including GCP)**.

---


## 3. Scope of Leaked Information

### 3.1 Officially Confirmed Leaked Fields

| Leaked Field     | Scope       | Sensitivity       |
| --------- | -------- | --------- |
| Name        | All affected customers | Medium         |
| Email address    | All affected customers | High        |
| Phone number      | All affected customers | **Very high** |
| Encrypted password | All affected customers | **High**    |
| Address        | Customers who entered it    | **Very high** |
| Job / title     | Customers who entered it    | Medium         |
| Parcel-order memo  | Assessed for relevant customers | Medium         |

> ⚠️ Payment information (card numbers, etc.) was not held on the platform and is stated by the company not to have been leaked

### 3.2 Affected Services

All Day1Company brands are expected to be in the potential impact zone.

- **FastCampus** — Korea's largest IT/job-skills education platform
- **Coloso** — Creative education platform (700,000+ cumulative members)
- **Myright**
- **ZeroBase**
- **Newsspresso**
- **Lispick**
- **Shiny English**
- **Wannerspeak**

### 3.3 Practical Risk of "Encrypted Passwords"

The company announced passwords were leaked "encrypted," but that does not guarantee safety.

- If the hash algorithm is weak (MD5, SHA-1) or applied without salt, restoration via rainbow tables or GPU cracking is possible
- Leaked email+password combinations can be used immediately for **credential-stuffing attacks**
- Reuse of the same email/password on other services (Naver, Kakao, finance) can cause **cascading harm**

---


## 4. Notification Delay — Critical Analysis

### 4.1 Timeline Reconstruction

> **Recognition: June 8 → Authority report: June 9 → Media: June 10 → Customer notice: ~16:00 June 11**

Day1Company recognized the incident on June 8 and reported to authorities on June 9. However, **public notice to the affected customers themselves was not issued until ~16:00 on June 11**—a notification gap of about **72–80 hours** from recognition.

More serious is that **media reported first (June 10)**. Victims likely first learned their information had leaked from news articles rather than the company's official notice.

### 4.2 Possible Personal Information Protection Act Violation

Article 34 of the Personal Information Protection Act (notification and reporting of personal-data leakage, etc.) provides:

> **"When a personal information controller becomes aware that personal information has been leaked, it shall without delay notify the relevant data subject."**

The key phrase is **"without delay."** Legal and case-law interpretation generally tends to treat this as **within 72 hours**; the EU GDPR also specifies the same standard. Day1Company, despite being a listed company, was slow.

| Duty        | Standard                   | Day1Company Response                 | Assessment |
| --------- | -------------------- | ------------------------- | --- |
| Authority report     | Without delay after recognition        | Next day after recognition (June 9)            | Prompt |
| Victim notification    | Without delay after recognition        | ~72–80 hours after recognition (afternoon June 11) | Delayed |
| Adequacy of notice content | Circumstances, fields, harm-minimization methods | Circumstances partly vague; scale "under confirmation"    | Insufficient |

### 4.3 Problems in the Notice Content

Analysis of the official notice (fastcampus.co.kr/info/notices/1960) shows the following problems.

**① "Stolen at an unknown time" — opaque description of circumstances**

> *"The GitHub service master-account key value was stolen at an unknown time and"*

The notice was posted without knowing when or how the key was stolen. It appears the notice was issued under criticism that hacking-incident notices were delayed. This means **the notice was published before root-cause analysis was complete**, making it hard for victims to understand and respond accurately.

**② Leakage scale "under assessment"**

At notice time, even the exact number of victims had not been identified. Victims received a notice while unclear whether they themselves were affected.

**③ Absence of practical compensation measures**

The notice states compensation plans will be prepared after the leakage scale is confirmed. For affected customers, no practical measures—**credit-monitoring services, compensation criteria, dedicated support channels**—were offered to relieve immediate anxiety.

**④ Intrusion duration (~30 days) not emphasized**

The fact that the attacker remained inside for **about 30 days from May 9 to June 8** is not stated in the notice. The scope of information leaked during that period may be far broader than listed fields; victims have a right to know. This will be clarified later through forensics and KISA reports.

### 4.4 Comparison: Gap Versus Domestic and International Response Cases

| Item       | Strong practice (reference)            | Day1Company        |
| -------- | -------------------- | ------------- |
| Customer notification speed | Within 24–48 hours of recognition     | After ~72–80 hours  |
| Scale identification | Stated at notification              | "Under confirmation"        |
| Compensation | Presented with notification           | Undetermined            |
| Cause transparency   | Detailed intrusion-path description          | "Unknown time"      |
| Victim support   | Dedicated report portal, free credit monitoring | Phone/email inquiry guidance only |

**In conclusion, Day1Company's response may fall short of even the minimum legal-duty threshold, and was a passive response far from victim-centered crisis communication.**

---


## 5. MITRE ATT&CK Mapping

| Tactic          | Technique ID | Technique Name                              | Related Behavior               |
| --------------- | ------------ | ------------------------------------------- | ------------------- |
| Initial Access  | T1552.001    | Unsecured Credentials: Credentials In Files | GitHub master-account key theft |
| Initial Access  | T1078        | Valid Accounts                              | Service access with stolen account key    |
| Persistence     | T1098        | Account Manipulation                        | Continued use of master-account key      |
| Discovery       | T1087        | Account Discovery                           | Access to accounts and DBs in the service    |
| Collection      | T1213        | Data from Information Repositories          | Collection from customer personal-data databases   |
| Exfiltration    | T1041        | Exfiltration Over C2 Channel                | External exfiltration of personal data          |
| Defense Evasion | T1078.004    | Valid Accounts: Cloud Accounts              | Detection evasion via legitimate account-key use  |

---


## 6. Indicators of Compromise (IoC)

> ⚠️ Publicly available information is extremely limited; the IoCs below require update after official investigation results are published.

### 6.1 Basic Incident Information

| Item        | Value                           |
| --------- | --------------------------- |
| Victim organization     | Day1Company Co., Ltd.                   |
| Business registration number    | 810-86-00658                |
| Affected services    | FastCampus, Coloso, Myright, ZeroBase, and others |
| First confirmed intrusion date | 2026-05-09                  |
| Incident recognition date    | 2026-06-08                  |

### 6.2 How Victims Can Confirm

- Day1Company customer center: ☎ 02-501-9396
- Email: <customer-service@day1company.co.kr>
- FastCampus notice: <https://fastcampus.co.kr/info/notices/1960>

---


## 7. Impact Scope and Secondary-Harm Potential

### 7.1 Primary Harm

- Leakage of names, emails, phone numbers, encrypted passwords, addresses (partial), jobs (partial)
- Payment information confirmed not leaked (per company statement)

### 7.2 Secondary-Harm Scenarios

**① Credential Stuffing**

Login attempts on other services (Naver, Kakao, Coupang, Toss, banking apps) using leaked email + password combinations. Same-password reuse risks **cascading multi-account takeover**.

**② Spear Phishing**

Name + email + phone combinations enable highly customized phishing emails/texts. Beware of messages impersonating "FastCampus security alerts."

**③ Smishing**

Phone-number leakage enables malicious-URL texts impersonating "personal-data leak notices."

**④ Voice-Phishing Linkage**

Name + phone + job combinations can be abused for social-engineering attacks (voice phishing, agency impersonation).

**⑤ Address-Information Abuse**

For customers who entered addresses, potential use as a basis for physical threats (illegal visits, etc.) or further social engineering.

---


## 8. Recommendations — For Affected Customers

### Immediate Actions (Today)

**1. Immediately change FastCampus (Day1Company) account password**

**2. Replace passwords on all services using the same password**

Immediately change passwords on every service (email, finance, shopping, SNS) using the same or similar password.

> **Password principle:** Different password per service + 12+ characters + mix of upper/lower/number/special characters

**3. Immediately enable 2FA on major services**

Enable OTP- or authenticator-app-based 2FA on Naver, Kakao, Google, finance apps, FastCampus, and all major services.

**4. Immediately ignore suspicious contact**

- Beware of emails/texts/calls impersonating "FastCampus / Day1Company"
- Do not click URLs; immediately refuse any re-request for personal data

### Short-Term Actions (Within 3 Days)

**5. Email-account security check**

- Check access history of the leaked email account (overseas IP access)
- Check for anomalous email auto-forwarding rules

**6. Strengthen financial-transaction monitoring**

- Check internet-banking login history
- Check card statements for anomalous transactions
- If needed, register with the Korea Federation of Banks personal-data exposure accident-prevention system: <https://pd.kfb.or.kr/>

**7. File harm reports**

- KISA: ☎ 118
- Personal Information Infringement Report Center: <https://privacy.kisa.or.kr>
- National Police Agency Cyber Investigation Bureau: ☎ 182

---


## 9. GitHub · Google Account · GCP Protection Guide

This section provides a practical guide to protect Google/GCP environments linked to **GitHub master-account key theft**, the core intrusion path. Day1Company's infrastructure is GCP-based (storage.googleapis.com domain confirmed in business information).

---

### 9-A. GitHub Account and Organization Protection

#### Authentication Hardening

| Action                              | Method                                                                          | Priority   |
| ------------------------------- | --------------------------------------------------------------------------- | ----- |
| **Mandate 2FA**                   | GitHub Settings → Password and authentication → Enable 2FA (TOTP or hardware key) | Required    |
| **Register Passkey**                  | Settings → Passkeys → Add passkey                                           | Strongly recommended |
| **Re-review SSH keys**                   | Settings → SSH and GPG keys → immediately delete unused keys                                   | Required    |
| **Audit OAuth app access**            | Settings → Applications → Authorized OAuth Apps                          | Recommended    |
| **Least-privilege Personal Access Tokens** | Settings → Developer settings → Personal access tokens → minimize Scopes, set expiry | Required    |

#### Secret Management

```
# Detect hardcoded secrets in the repository (gitleaks)
brew install gitleaks        # macOS
gitleaks detect --source .   # scan current repository

# Full scan including history with truffleHog
pip install truffleHog
trufflehog git file://. --only-verified
```

| Secret-Management Principle               | Description                                                                  |
| ----------------------- | ------------------------------------------------------------------- |
| **Never hardcode**          | Do not put tokens/keys directly in `.env`, `config.yaml`, `settings.py`, etc.               |
| **Use GitHub Secrets**   | Register CI/CD secrets under Settings → Secrets and variables → Actions          |
| **Enable Secret Scanning** | Settings → Code security → enable Secret scanning (including Push protection) |
| **Check `.gitignore`**     | Add `.env`, `*.pem`, `*_key.json`, `credentials*` patterns                 |
| **Least-privilege tokens + expiry**      | Personal Access Token: allow only needed scopes; set expiry ≤ 90 days                  |

#### Organization Security Settings

```
Organization Settings → Member privileges:
  Require 2FA for all members
  Require SAML SSO (Enterprise plan)
  Base permissions: Read (least privilege)

Organization Settings → Code security:
  Dependabot alerts
  Secret scanning
  Push protection (block pushes containing secrets)

Organization Settings → Audit log:
  Enable Audit log streaming → SIEM integration
```

#### Immediate Response on Compromise

```
# List all Personal Access Tokens via GitHub CLI
gh auth token                           # confirm current token
# → On the web: Settings > Developer settings > PATs > Revoke all

# Bulk-check organization OAuth app permissions
# Settings → Third-party access → Restrict access
```

---

### 9-B. Google Account Protection

#### Account Security Hardening

| Action                    | Location                                  | Priority       |
| --------------------- | ----------------------------------- | --------- |
| **Enable 2-Step Verification**        | myaccount.google.com → Security → 2-Step Verification  | Required        |
| **Register Google Passkey** | myaccount.google.com → Security → Passkey | Strongly recommended     |
| **Register security key (hardware)**     | Register FIDO2 keys such as YubiKey                | Required for high-risk accounts |
| **Advanced Protection Program**        | g.co/advancedprotection             | Recommended for org admins |
| **Review app passwords**         | Check legacy app-password list; delete unused        | Required        |

#### Access Auditing

```
Google account security checklist

myaccount.google.com → Security:
  Check recent security activity for anomalies
  Connected devices → immediately sign out unrecognized devices
  Review third-party app access (remove unnecessary apps)
  Check email auto-forwarding rules (Gmail → Settings → Forwarding and POP/IMAP)
  Keep recovery email/phone up to date
```

#### Google Workspace (Administrators)

```
admin.google.com:
  Security → 2-Step Verification → force organization-wide
  Security → Advanced settings → limit session duration
  Reports → Audit → detect anomalous login activity
  Users → minimize Super Admin accounts
  Apps → Google Workspace → Drive → review external sharing settings
```

---

### 9-C. Google Cloud Platform (GCP) Protection

GCP is accessible via GitHub Actions OIDC federation; GitHub master-account key theft can cascade.

#### IAM and Access Control

| Action                 | Method                                                           | Priority   |
| ------------------ | ------------------------------------------------------------ | ----- |
| **Minimize service-account keys**   | Prefer prohibiting service-account JSON key issuance → use OIDC/Workload Identity         | Required    |
| **Least privilege (PoLP)** | IAM roles: ban Primitive roles (Owner, Editor) → use Predefined roles | Required    |
| **Audit service-account keys**    | Immediately delete unused keys                                                  | Required    |
| **Organization policy**          | Apply `constraints/iam.disableServiceAccountKeyCreation`        | Strongly recommended |

```
# List GCP service-account keys
gcloud iam service-accounts list --project=[PROJECT_ID]
gcloud iam service-accounts keys list \
  --iam-account=[SA_EMAIL] \
  --project=[PROJECT_ID]

# Delete keys unused for 90+ days
gcloud iam service-accounts keys delete [KEY_ID] \
  --iam-account=[SA_EMAIL] \
  --project=[PROJECT_ID]

# Query anomalous IAM policy-change history (Cloud Audit Logs)
gcloud logging read \
  'logName="projects/[PROJECT_ID]/logs/cloudaudit.googleapis.com%2Factivity" \
   AND protoPayload.methodName="SetIamPolicy"' \
  --limit=50 --format=json
```

#### Monitoring and Detection

```
# Enable Security Command Center
gcloud services enable securitycenter.googleapis.com

# Confirm Cloud Audit Logs fully enabled
gcloud projects get-iam-policy [PROJECT_ID] \
  --format=json | grep auditLogConfigs

# Configure VPC Service Controls (sensitive-data protection)
gcloud services enable accesscontextmanager.googleapis.com
```

| Monitoring Item          | GCP Service                     | Description                |
| ---------------- | --------------------------- | ----------------- |
| **Full API-call audit** | Cloud Audit Logs            | Record all data-access history   |
| **Anomalous-behavior detection**     | Security Command Center     | Automatic alerts on anomalous access      |
| **Service-account abuse detection** | IAM Recommender             | Auto-identify excessive privileges       |
| **Data-leak prevention**    | Cloud DLP                   | Detect exfiltration of data containing personal information |
| **Network anomalies**      | VPC Flow Logs + Cloud Armor | Detect anomalous traffic        |

#### Immediate GCP Response on Suspected Compromise

```
# 1. Immediately disable all service-account keys
gcloud iam service-accounts disable [SA_EMAIL] --project=[PROJECT_ID]

# 2. Immediately revoke OAuth tokens (project-wide)
gcloud projects remove-iam-policy-binding [PROJECT_ID] \
  --member="serviceAccount:[SA_EMAIL]" \
  --role="[ROLE]"

# 3. Block anomalous source IPs (Cloud Armor)
gcloud compute security-policies rules create 1000 \
  --security-policy=[POLICY_NAME] \
  --src-ip-ranges=[SUSPICIOUS_IP] \
  --action=deny-403

# 4. Contact Cloud Incident support
# https://cloud.google.com/support/docs/incident-response
```

#### Workload Identity Federation — GitHub CI/CD Without Service-Account Keys

Recommended architecture that fully removes service-account keys and replaces them with GitHub OIDC:

```
# .github/workflows/deploy.yml
jobs:
  deploy:
    permissions:
      id-token: write   # required for OIDC token issuance
      contents: read
    steps:
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/[NUM]/locations/global/workloadIdentityPools/[POOL]/providers/[PROVIDER]'
          service_account: '[SA_EMAIL]'
          # No JSON key file needed → key-theft risk eliminated at source
```

```
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --project=[PROJECT_ID] \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Register GitHub OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project=[PROJECT_ID] \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

---


## 10. Recommendations for Enterprise Security Administrators

### Immediate Actions (Within 24 Hours)

1. **Immediately rotate GitHub master-account keys and all Personal Access Tokens**
2. **Full audit of GCP service-account keys; delete unused keys**
3. **Full review of 90 days of GitHub Audit Log** — analyze anomalous access IPs and time windows
4. **Rotate all secrets across CI/CD pipelines**
5. **Review database access logs** — check for anomalous bulk-query (SELECT *) patterns

### Short-Term Actions (Within 7 Days)

6. **Force 2FA for all GitHub Organization members**
7. **Enable Secret Scanning + Push Protection**
8. **Migrate to Workload Identity Federation** (remove service-account keys)
9. **Stream GitHub Audit Log into SIEM**
10. **Re-review least privilege for personal-data access** — improve architectures that allow master accounts direct customer-DB access

### Medium-/Long-Term Actions (Within 30 Days)

11. **Establish an IR playbook** — include recognition → customer notification within 24 hours
12. **Introduce regular security-audit systems** — quarterly full checks of GitHub tokens and GCP service-account keys
13. **Real-time monitoring of personal-data access logs** — adopt DLP solutions
14. **Consider Zero Trust architecture migration**

---


## 11. Analyst Assessment and Limitations

### Assessment

This incident is a compound case overlapping a **technical failure of GitHub master-account key management**, an **operational failure of ~30 days of missed detection**, and a **legal/ethical failure of 72+ hours of notification delay**.

In particular, that **"a key stolen at an unknown time was used for a month"** suggests even minimal monitoring of GitHub access events was absent. GitHub provides Audit Log and token-access records by default; SIEM integration could have detected anomalous behavior much earlier.

Notification delay is more serious. If victims first learned of the leak from media rather than the company's official notice, that can be interpreted as **prioritizing corporate image management over victim protection**. The Personal Information Protection Commission should investigate possible Personal Information Protection Act violations, and practical compensation measures should be prepared promptly.

### Analysis Limitations

- Attacker attribution, exact theft method, and actual victim count unconfirmed pending official investigation
- Hash algorithm type and salt application for leaked passwords not publicly confirmed
- Additional leaked fields (parcel memos, etc.) need official confirmation
- GCP-linked harm cannot be confirmed from currently public information

---


## 12. References

- Day1Company official notice: <https://fastcampus.co.kr/info/notices/1960>
- ZDNet Korea reporting (2026-06-11): <https://zdnet.co.kr/view/?no=20260611163532>
- Nate News exclusive (2026-06-10): <https://news.nate.com/view/20260610n32287>
- Personal Information Protection Commission — personal-data infringement report: <https://privacy.kisa.or.kr>
- KISA Personal Information Infringement Report Center: ☎ 118
- GitHub security docs — Secret Scanning: <https://docs.github.com/en/code-security/secret-scanning>
- GitHub Audit Log docs: <https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization>
- GCP Workload Identity Federation: <https://cloud.google.com/iam/docs/workload-identity-federation>
- GCP security recommendations: <https://cloud.google.com/security/best-practices>
- MITRE ATT&CK T1552.001: <https://attack.mitre.org/techniques/T1552/001/>
- Personal Information Protection Act Article 34 (personal-data leak notification/reporting): [https://www.law.go.kr/법령/개인정보보호법](https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8%EB%B2%95)

---
---


# Appendix A. v1.1 Update (2026-06-19) — 8-Day Post-Incident Tracking

> **Update scope:** This appendix reflects facts additionally confirmed between 6/12 and 6/19 after v1.0 publication (6/11). The v1.0 body was preserved unmodified; verification/revision of hypotheses in the body is separately summarized in **A.6**.

## A.1 Update Summary (TL;DR)

| Update Item | v1.0 (6/11) | v1.1 (6/19) Update |
| --- | --- | --- |
| **Incident character** | Day1Company standalone incident | Part of a **simultaneous 'GitHub credential theft' incident cluster** |
| **Same-pattern incidents** | (Unrecognized) | TVING (recognized 6/3), ST Unitas, BGF Networks (CU POST), etc. — June cluster |
| **Affected population** | General members + instructors assessed | **Large-enterprise B2B corporate-training students (incl. Samsung Electronics) notified**; **instructor harm officially confirmed** |
| **Authority trends** | Recognition/reporting only covered | **KISA / Broadcasting and Media Communications Commission recommend prohibiting credential storage on developer platforms** / CI·resident-number segregated-storage timeline shortened by 4 months |
| **Legal risk** | Notification-delay criticism level | **Class action (TVING 1,051-person precedent) · fines (Logos KRW 500M · SKT record fine precedents)** risk concretized |
| **Leakage scale** | "Under confirmation" | Day1 scale still unpublished. Peer TVING observed at **up to 13 million** (industry estimate) |

## A.2 Additional Timeline (Incident-Cluster View)

```
2026-06-03   TVING breach recognized — AWS access-key revocation + GitHub credential replacement reported
2026-06-04   BGF Networks (CU POST) unauthorized-access indicators confirmed (parcel operations)
2026-06-08   Day1Company recognizes incident
2026-06-09   Day1Company reports to authorities
2026-06-11   Day1Company customer notice (v1.0 published)
2026-06-12   'GitHub key theft' industrial-pattern analysis coverage expands / Day1 B2B·instructor harm reported
             Broadcasting and Media Communications Commission advances CI·resident-number segregated-storage timeline by 4 months
~2026-06-14  TVING users (1,051) file class (damages) suit (KRW 300,000 per person claimed)
2026-06-16   Authorities' recommendation prohibiting credential storage on developer platforms reported
2026-06-19   v1.1 update (this appendix)
```

> Day1Company's own **leakage scale, compensation plan, and authority disposition** remain officially unpublished as of 6/19. That means the "scale unspecified · compensation undetermined" state flagged in v1.0 has not been resolved after eight days.

## A.3 'GitHub Credential Theft' Incident Cluster — Lateral Analysis

In June, security-industry analysis argued that the **common intrusion clue in domestic online-service personal-data breaches is converging on 'credential-management failure in developer repositories (GitHub).'** The core is not mere personal-data leakage but attacks targeting development/operations access privileges that then reach DBs.

| Item | Day1Company | TVING |
| --- | --- | --- |
| **Recognition** | 2026-06-08 | 2026-06-03 |
| **Core intrusion clue** | GitHub master-account key theft | GitHub credential replacement + AWS access-key revocation reported |
| **Cloud** | GCP assessed | AWS |
| **Leakage scale** | Unpublished ("under confirmation") | Up to 13 million observed (industry estimate) |
| **Additional concern** | 30-day long dwell | Indicators of **unauthorized query execution** by hackers → concern of prior system takeover |
| **Legal development** | Unpublished | 1,051-user class action (KRW 300,000 per person claimed) |

**Key insight — "DB access / system takeover is more serious than information leakage"**

GitHub is not a DB server but where source code, design docs, internal control logic, and hardcoded secrets gather. When GitHub credentials are stolen, the threat does not stop at member-data leakage. If encryption algorithms and key-management logic in source are also exposed, **the company's safety claim of "encrypted passwords" itself can be neutralized.** This supports at the cluster level the "encryption ≠ safety" argument raised in v1.0 §3.3. Because Day1Company's access was also via a GitHub master key, the same decryption/system-takeover risk cannot be excluded.

> In cloud-based services, the core security question has moved from "where is the server" to **"who can enter, with what privileges."** This incident cluster is empirical evidence of that proposition.

## A.4 B2B Cascading Exposure — Supply-Chain View

The most important newly confirmed fact in v1.1 is that **harm expanded beyond general B2C members into the B2B corporate-training domain**.

- **Large-enterprise corporate-training student notices:** Day1Company has operated in-house training programs for specific enterprises; leakage notices were also sent to employees of large Korean firms including Samsung Electronics. This indicates Day1Company was in a **processor (entrusted processing) position for client-employee information**, raising issues of responsibility allocation between entruster and processor and clients' secondary-notification duties.
- **Instructor (outsourced workforce) harm officially confirmed:** Instructors are confirmed among affected parties. This directly touches the v1.0 summary hypothesis of **"many outsourced/short-term workers, absent security monitoring"** (verification results in A.6).

**Supply-Chain Risk Assessment**

| Exposure Path | Affected Population | Additional Risk |
| --- | --- | --- |
| B2C members | General students | Credential stuffing · smishing (body §7.2) |
| B2B entrustment | Large-enterprise employees | Combined with job/affiliation → **targeted spearphishing**; social-engineering entry to client internal networks |
| Instructors · partners | Outsourced workforce | Combined with settlement/contract info → **BEC (business email compromise)** risk |

## A.5 Regulatory and Legal Risk Reassessment

Synthesizing concurrent incidents and recent Personal Information Protection Commission (PIPC) disposition precedents, regulatory and litigation risk facing Day1Company is more concrete than at the v1.0 assessment point.

| Comparative Precedent | Key Facts | Implications for Day1Company |
| --- | --- | --- |
| **Law firm Logos** (PIPC fine KRW 500M) | Admin-account theft leaked ~180,000 litigation documents; **notification delayed 1+ year after recognition**; unencrypted storage · inadequate access control | Notification delay and safety-measure duty violations as **core fine grounds** mean Day1's 72–80 hour delay and 30-day missed detection may be assessed as aggravating factors |
| **SKT USIM leak** (record fine; CEO charged · police investigation) | Administrative suit against fine; expanded to criminal investigation | Large incidents can unfold as **administrative disposition → criminal liability → civil litigation** in three stages |
| **TVING class action** (1,051 users, KRW 300,000 each) | Contests not only "safety-measure duty violation" but also **minimum-collection principle violation at collection/processing stage** | Day1 may also face broad challenges on **lawfulness of collection and entrustment management** of member, instructor, and B2B information |

**Personal Information Protection Act Issues (Updated)**

1. **Article 34 notification/reporting duty** — 72–80 hour delay (body §4.2). Delay magnitude is smaller than Logos, but "without delay" violation risk remains.
2. **Safety-measure duty (Article 29)** — Master-key hardcoding, 30-day missed detection, and inadequate access control are core.
3. **Collection minimization · entrustment (Articles 3 · 26)** — New front opened by TVING class action. Adequacy of processor management/supervision in B2B entrustment structures may be contested.

> ⚠️ This item is a risk assessment based on public information; actual unlawfulness and disposition severity will be determined by PIPC investigation and judicial judgment. This is not legal advice.

## A.6 Verification / Revision of v1.0 Analysis

For transparent tracking, post-hoc verification results of major v1.0 judgments are stated.

| v1.0 Judgment | v1.1 Verification Result | Status |
| --- | --- | --- |
| "Many outsourced/short-term workers; possible absent security monitoring" | Instructors confirmed among affected. Consistent with workforce-structure hypothesis | **Partially verified** (cannot conclude intrusion cause was a workforce account) |
| "Encryption ≠ safety; decryption · credential-stuffing risk" | Peer incident (TVING) raised industry consensus concern that source exposure can neutralize encryption | **Reinforced** |
| "Possible broad GCP-linked privileges" | No newly confirmed direct evidence (TVING is an AWS case) | **Remains unconfirmed** |
| "Standalone enterprise security failure" | Revealed as an **industrial pattern** via June cluster (TVING · BGF · ST Unitas, etc.) | **Revised/expanded** |
| "Notification delay · absent compensation plan" | Scale and compensation still unpublished after 8 days | **Continued deterioration** |

**Most important revision:** The v1.0 frame treating this as Day1Company's individual failure must be expanded to interpret it as a **structural vulnerability common to Korea's SaaS/platform industry: developer-platform credential management**.

## A.7 Updated Recommendations (Additions)

### For Affected Customers (B2B Students Added)

- **Employees who took FastCampus/Day1 courses via company email** may have company email, employee ID, and job combined and exposed; recommend **notifying the corporate security team and requesting targeted-phishing caution**.
- Instructors and partners should watch for **BEC** attempts impersonating settlement/contract channels.

### For Enterprise Security Administrators (Cluster Lessons)

1. **Rotate GitHub + cloud credentials together** — As in the TVING case, revoke and replace GitHub credentials and AWS/GCP keys **as a set** (replacing only one allows bypass).
2. **Prepare for source encryption-logic exposure** — Separate key management (KMS/Secret Manager) from code; under an exposure assumption, **immediately rotate the encryption keys themselves**.
3. **Isolate entrustment (B2B) data** — Separate client-employee information with distinct tenants/access controls; pre-define **processor → entruster notification SLAs** for incidents.
4. **Segregated storage of combining identifiers such as CI and resident numbers** — Apply preemptively as authorities advance segregated-storage duty timelines.
5. **Codify developer-platform credential-storage prohibition** — Enforce authority recommendations as internal policy and code-review gates (Push Protection + pre-commit blocking).

## A.8 v1.1 Additional References

- News1 (2026-06-12) — Severity of GitHub key theft and DB-access attacks: <https://www.news1.kr/it-science/security-hacking/6190664>
- IT Daily (2026-06-16) — GitHub as hacking path; caution on credentials in source: <http://www.itdaily.kr/news/articleView.html?idxno=239883>
- iNews24 (2026-06-12) — Day1 leak; concern for large-enterprise corporate-training students: <https://www.inews24.com/view/1975944>
- Digital Daily (2026-06-11) — Day1Company leak; instructor harm confirmed: <https://m.ddaily.co.kr/page/view/2026061115551484107>
- Boan News — Why TVING focuses on GitHub more than DB leakage: <https://m.boannews.com/html/detail.html?idx=144054>
- RightKnow News (~2026-06-14) — TVING users (1,051) damages suit: <https://www.rightknow.co.kr/news/articleView.html?idxno=34269>
- Namuwiki — 2026 personal-data breach incidents (cluster list): <https://namu.wiki/w/개인%20정보%20유출%20사태>

## A.9 Analysis Limitations (v1.1 Update)

- Day1Company's **exact leakage scale, compensation plan, and authority disposition** remain unpublished as of 6/19; scale and legal assessments in this appendix are estimates based on peer precedents.
- **Common intrusion patterns** with peer incidents such as TVING are based on security-industry analysis and report circumstances; Day1's final intrusion path cannot be asserted as identical (official forensics incomplete).
- Scale figures such as "13 million" (TVING) are **industry observations/estimates**, not confirmed announcements.
- B2B harm scope (which clients) exists only in partial reporting; full confirmation pending.

---

© 2026 HoKwang Kim (Dennis Kim) · Betalabs Inc. · This report is independent research based on public information and is not the official position of Day1Company or related agencies. Prepared for informational purposes.

📌 Report filename: `CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_EN.md` | Series: CYBER-THREAT-INTELLIGENCE-REPORT | **Version v1.1 (updated 2026-06-19)**
