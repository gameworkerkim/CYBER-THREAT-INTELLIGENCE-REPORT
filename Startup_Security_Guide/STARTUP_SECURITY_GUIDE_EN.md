# Startup Security Guide: Korea Market Entry Edition

> A stage-gated security and compliance guide for startups expanding into South Korea, with cross-jurisdictional comparison of GDPR, CCPA/CPRA, and PIPA requirements.

![Coverage](https://img.shields.io/badge/Coverage-Cloud%20%7C%20Workspace%20%7C%20DRM%20%7C%20KISA%20%7C%20GDPR%20%7C%20CCPA-lightgrey?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-2ECC71?style=flat-square)

---

## Table of Contents

1. [Why This Guide Exists](#1-why-this-guide-exists)
2. [GDPR vs. CCPA vs. PIPA: The Jurisdiction Gap](#2-gdpr-vs-ccpa-vs-pipa-the-jurisdiction-gap)
3. [Stage-Gated Security Checklist](#3-stage-gated-security-checklist)
4. [Cloud Security (AWS, GCP, Azure, Vercel)](#4-cloud-security)
5. [Google Workspace Security (Gmail, Drive, Docs)](#5-google-workspace-security)
6. [DRM & Document Security](#6-drm--document-security)
7. [KISA Compliance: What Changes from GDPR/CCPA](#7-kisa-compliance-what-changes-from-gdprccpa)
8. [Incident Response Framework](#8-incident-response-framework)
9. [Security Organization Roadmap](#9-security-organization-roadmap)
10. [Technical Protection Standards](#10-technical-protection-standards)
11. [Free Resources & Government Support](#11-free-resources--government-support)
12. [Stage-Gate Compliance Checklist](#12-stage-gate-compliance-checklist)

---

## 1. Why This Guide Exists

Korea is Asia's fourth-largest economy and the launch market for numerous global SaaS, fintech, AI, and consumer platforms. It has the world's highest smartphone penetration (95%), 5G adoption rate, and one of the most digitally active populations.

However, Korea's data protection regime -- the **Personal Information Protection Act (PIPA)** -- operates differently from GDPR and CCPA in critical ways. A GDPR-compliant European startup is **not automatically PIPA-compliant** in Korea. A CCPA-compliant US startup faces additional, unfamiliar mandates.

**Common failure modes for foreign startups entering Korea:**

- Assuming GDPR adequacy covers Korea (it does not cover all PIPA requirements)
- Missing the mandatory CPO (Chief Privacy Officer) designation -- required for ALL entities
- Using GDPR-standard encryption (TLS 1.2 + "appropriate" measures) where PIPA mandates **AES-256** for unique identifiers
- Having no access log retention policy where Korea requires **mandatory 6-month minimum** with monthly review for ISPs
- Collecting Resident Registration Numbers (RRNs) without explicit legal basis -- strictly prohibited
- Missing the **24-hour KISA notification** requirement for information communication service providers
- Not realizing that Korean data breach penalties include **criminal liability**, not just fines

This guide is structured to help foreign startups navigate these jurisdictional differences systematically, with concrete checklists and technical standards.

### How to Use This Guide

- **Read Section 2 first** -- the jurisdiction comparison table is the quickest way to identify your compliance gaps
- **Follow Sections 3-10** for the stage-gated implementation plan
- **Use Section 11** to access free Korean government security resources
- **Pass each gate** in Section 12 before advancing to the next stage
- **Pair with LLM_CISO_PROMPT_EN.md** -- feed this guide as context to the LLM CISO for automated compliance checks

---

## 2. GDPR vs. CCPA vs. PIPA: The Jurisdiction Gap

### 2.1 Quick Reference: Key Differences

| Dimension | GDPR (EU/EEA) | CCPA/CPRA (California, US) | PIPA (South Korea) |
|-----------|---------------|---------------------------|---------------------|
| **Full Name** | General Data Protection Regulation | California Consumer Privacy Act / Privacy Rights Act | Personal Information Protection Act |
| **Regulator** | National DPA per member state | California AG / CPPA | Personal Information Protection Commission (PIPC) |
| **Applies To** | Entities processing EU data subjects' data, regardless of location | For-profit entities doing business in CA meeting thresholds | **All entities** processing personal information, regardless of size or location |
| **Scope** | Any information relating to identified/identifiable natural person | Information that identifies, relates to, or could be linked to a consumer/household | Any information that identifies an individual (including CI -- Connecting Information) |
| **DPO / CPO Requirement** | Required for public authorities, large-scale processing, or sensitive data | Not required (though privacy officer recommended) | **CPO required for ALL entities**, regardless of size. No small business exemption. |
| **Legal Basis** | Consent, contract, legal obligation, vital interests, public task, legitimate interest | Opt-out model (right to opt out of sale/sharing) | **Consent-based** (similar to GDPR); legitimate interest is weaker |
| **Consent** | Explicit, informed, specific, unambiguous | Right to opt out of sale; opt-in for minors under 16 | Explicit, informed, specific. **Separate consent** for unique identifiers and sensitive data. |
| **Sensitive Data** | Racial/ethnic origin, political opinions, religious beliefs, trade union membership, genetic, biometric, health, sex life/orientation | Government IDs, account credentials, precise geolocation, race, religion, union membership, contents of communications, genetic data, biometric, health, sex life | **Unique identifiers** (RRN, passport, driver's license, alien registration number), **financial information** (account/card numbers, credit rating), **biometric information**. All require AES-256 encryption. |
| **Unique Identifiers** | No special category beyond personal data | SSN, driver's license, passport are "sensitive" | **Highest protection tier**. Mandatory AES-256 encryption at rest. Collection prohibited unless explicitly required by law. |
| **Password Storage** | "Appropriate technical measures" | "Reasonable security" | **SHA-256/384/512 one-way hashing** mandatory |
| **Encryption at Rest** | Appropriate technical & organizational measures | Reasonable security | **AES-256 mandatory** for unique identifiers and financial/biometric data |
| **Transmission Encryption** | Appropriate measures | Reasonable security | **TLS 1.2+ mandatory** for all data transmissions |
| **Access Logs** | Retention per purpose principle | Not specified | **6 months minimum retention**, 12 months for telecoms. Monthly review for ISPs, semi-annual for others. Tamper-proof storage required. |
| **Breach Notification to Regulator** | 72 hours to DPA | Without unreasonable delay | **24 hours** to KISA for ISPs. No explicit hour limit for non-ISPs, but must notify PIPC "without delay." |
| **Breach Notification to Data Subject** | When likely to result in high risk, without undue delay | Without unreasonable delay | **72 hours** to data subject (all entities) |
| **Cross-Border Transfer** | Adequacy decision, SCCs, BCRs, codes of conduct, certifications | No specific restriction, but must inform consumers | **Data subject consent required** for overseas transfer. Must disclose recipient country, entity, purpose, items, retention period, and method. |
| **Data Retention** | Storage limitation principle | No explicit retention limit | **Destroy without delay** when purpose is achieved. Separate DB storage if required by other laws. |
| **Penalties** | Up to 4% of global annual turnover or EUR 20M (whichever higher) | Up to $7,500 per intentional violation; $2,500 per unintentional | Up to KRW 30M (~$23K) administrative fine + **criminal penalties** (up to 5 years imprisonment or KRW 50M fine for illegal processing/transfer) |
| **Criminal Liability** | Per member state criminal law | No criminal provisions | **Yes.** Illegal processing, transfer, or leak of personal information can result in imprisonment. |

### 2.2 The Top 5 Compliance Traps for Foreign Startups

**Trap 1: CPO Designation (PIPA Article 31)**

GDPR requires a DPO only under specific conditions. CCPA has no DPO requirement. PIPA requires a **CPO for every entity that processes personal information** -- from day one, regardless of company size, headcount, or revenue. A 3-person startup handling customer emails is subject to this. The CPO can be the CEO or an executive, but must be formally designated.

**Trap 2: RRN Collection Prohibition (PIPA Article 24-2)**

Korea's Resident Registration Number (equivalent to SSN) may not be collected **unless explicitly required by law**. Many foreign services ask for government ID as part of identity verification -- this is illegal in Korea unless you have a specific statutory mandate. Alternatives: i-PIN, mobile phone authentication, or accredited digital certificates.

**Trap 3: Encryption Standards are Prescriptive, Not Principle-Based**

GDPR requires "appropriate technical and organizational measures." PIPA's enforcement decree specifies **exact algorithms**: AES-256 for unique identifiers, SHA-256+ for passwords, TLS 1.2+ for transmission. Using AES-128 or bcrypt (even if secure by Western standards) may be non-compliant.

**Trap 4: Access Logging is Mandatory and Specific**

Neither GDPR nor CCPA specify exact access log retention periods. PIPA mandates **minimum 6 months** of access logs (12 months for telecom operators), with **mandatory tamper-proof storage** (WORM or equivalent). Information communication service providers must review logs **monthly**.

**Trap 5: CISOs are Regulated**

Under Korea's Network Act (Article 45-3), information communication service providers above certain size thresholds must designate a **CISO** (separate from CPO) and report this to the regulator. For large organizations, the CISO may not hold other executive positions.

### 2.3 Data Subject Rights Comparison

| Right | GDPR | CCPA/CPRA | PIPA (Korea) |
|-------|------|-----------|--------------|
| Right to be informed | Yes | Yes | Yes (PIPA Article 30 -- privacy policy must be public) |
| Right of access | Yes (Article 15) | Yes (Right to know) | Yes (PIPA Article 35) |
| Right to rectification | Yes (Article 16) | Yes (Right to correct) | Yes (PIPA Article 36) |
| Right to erasure | Yes (Article 17) | Yes (Right to delete) | Yes (PIPA Article 37) |
| Right to restrict processing | Yes (Article 18) | No (but opt-out of sale) | Yes (PIPA Article 37) |
| Right to data portability | Yes (Article 20) | Limited (electronic, to consumer) | Yes (PIPA Article 35-2 -- introduced in 2023 amendment) |
| Right to object | Yes (Article 21) | Opt-out of sale/sharing | Yes (PIPA Article 37) |
| Automated decision-making | Yes (Article 22) | Opt-out of profiling | Yes (PIPA Article 37-2 -- introduced in 2024 amendment) |
| Data transfer right (MyData) | Not explicit | Not explicit | Yes (PIPA Article 35-2, phased introduction) |

### 2.4 Korea-Specific Privacy Policy Requirements

Under PIPA Article 30, the privacy policy must include **12 mandatory items** and be published on the website's first page or accessible via a prominent link:

1. Purpose of collection and use
2. Items collected
3. Retention and use period
4. Third-party provision details (if applicable)
5. Outsourcing (data processing) details (if applicable)
6. Rights and obligations of data subjects
7. Contact information for inquiries and complaints
8. Measures for destruction of personal information
9. Security measures (technical/managerial/physical)
10. CPO name and contact
11. Overseas transfer details (if applicable)
12. Automated decision-making details (if applicable, as of 2024)

---

## 3. Stage-Gated Security Checklist

### Stage 0: Pre-Incorporation (Planning & Ideation)

- [ ] **IP protection plan** -- File patents, trademarks, copyrights before public disclosure (KIPO IP Narae program)
- [ ] **Core asset inventory draft** -- Identify business plans, technical documentation, anticipated customer data
- [ ] **Industry-specific obligations** -- Healthcare (Medical Service Act), finance (Credit Information Act), education have additional laws
- [ ] **Security policy outline in business plan** -- Include security regulations, training plan, and NDA framework
- [ ] **Tech stack security review** -- Pre-screen cloud platforms, frameworks, and SaaS tools for security posture
- [ ] **Korea market: Identify CPO candidate** -- CEO or executive must be designated as CPO upon incorporation

### Stage 1: Incorporation & Business Registration

- [ ] **Business registration + industry compliance check** -- Determine if you qualify as an "information communication service provider" (Network Act Article 2(1)4)
- [ ] **Internal security regulations** -- Data classification, access control, media handling, personal data processing, incident response
- [ ] **NDA templates** -- For employees, contractors, and short-term personnel. Include confidentiality obligations and device usage restrictions.
- [ ] **Physical security assessment** -- Access control, CCTV, server room restrictions, visitor logs
- [ ] **Privacy policy draft** -- Must include all 12 mandatory items (PIPA Article 30)
- [ ] **CPO designation** -- Formal appointment (CEO or executive, documented)
- [ ] **Google Workspace / Microsoft 365 baseline security** -- Enforce 2FA, restrict admin accounts, configure external sharing policy
- [ ] **Korea-specific: Cross-border transfer strategy** -- If data leaves Korea, identify recipient countries and prepare consent mechanisms

### Stage 2: Pre-Launch (Website, App, System Development)

- [ ] **HTTPS (TLS 1.2+) applied to all transmission** -- Let's Encrypt / Cloudflare
- [ ] **Encryption at rest implemented** -- AES-256 for unique identifiers and financial data; SHA-256+ for passwords
- [ ] **Password policy** -- Minimum 10 characters (2 types) or 8 characters (3 types); 3-month expiration
- [ ] **Cloud infrastructure baseline security** -- See [Cloud Security section](#4-cloud-security)
- [ ] **Code security automation** -- SCA (Snyk, Dependabot) + secret detection (GitGuardian, TruffleHog, GitHub Secret Scanning)
- [ ] **Web application security** -- Follow OWASP Top 10 mitigation; apply KISA web development security guide
- [ ] **File upload security** -- Extension whitelist, execution permission removal, web root isolation
- [ ] **Mobile app access permissions minimized** -- Mandatory vs. optional separation; cannot deny service for unmet optional permissions
- [ ] **Outsourcing contracts** -- Data processing agreements (DPAs) for CRM, logistics, payment gateways
- [ ] **RRN alternative implementation** -- i-PIN, mobile phone authentication, or digital certificates (PIPA Article 24-2)
- [ ] **Privacy policy finalized and published** -- First page or prominent link on website
- [ ] **DRM and document security policy** -- See [DRM section](#6-drm--document-security)
- [ ] **Korea-specific: KISA web vulnerability scan scheduled** -- Free for SMEs; book in advance

### Stage 3: Operations (Post-Launch)

- [ ] **Data retention and destruction policy** -- Destroy without delay upon purpose achievement (PIPA Article 21)
- [ ] **Annual web vulnerability assessment** -- KISA free remote scanning service for SMEs
- [ ] **Access log review schedule** -- Monthly for ISPs; semi-annual for general. 6-month minimum retention.
- [ ] **Breach response procedure** -- 72-hour data subject notification template; 24-hour KISA notification for ISPs
- [ ] **Annual employee security training** -- Include phishing, ransomware, deepfake case studies
- [ ] **Antivirus and patch management** -- Auto-update enabled on all endpoints and servers
- [ ] **Regular backup and restore testing** -- Include offline backups for ransomware resilience
- [ ] **Supply chain security management** -- Maintain vendor, external module, and SaaS inventory; quarterly review
- [ ] **Cloud security audit** -- Quarterly IAM permission review, security group audit, logging validation
- [ ] **Google Workspace quarterly review** -- Third-party app permissions, external sharing links, inactive accounts
- [ ] **SaaS account lifecycle management** -- Immediate revocation on departure (Slack, Notion, GitHub, Drive, etc.)
- [ ] **Marketing communications compliance** -- [Advertisement] prefix in subject line; opt-out mechanism included (Network Act Article 50)

### Periodic Assessment Schedule

| Task | Frequency | Notes |
|------|-----------|-------|
| Access log review | **Monthly** | Information communication service providers |
| Access log review | **Semi-annual** | General businesses (6-month retention) |
| Web vulnerability scan | **Annual** | KISA free service available |
| Employee security training | **Annual** | Include phishing and deepfake scenarios |
| Backup restore test | **Quarterly** | Offline backup recommended |
| IAM permission audit | **Quarterly** | Least privilege principle |
| Google Workspace security audit | **Quarterly** | Third-party apps, external sharing |
| Patch, SCA, secret scan | **Continuous** | CI/CD automation recommended |

---

## 4. Cloud Security

### 4.1 Universal Cloud Security Principles

- [ ] **Root account MFA mandatory** -- All cloud platforms
- [ ] **IAM least privilege** -- Grant only necessary permissions; regularly audit and revoke unused
- [ ] **Service accounts for programmatic access** -- Avoid personal account access keys
- [ ] **Access key rotation** -- Maximum 90-day rotation cycle
- [ ] **Temporary credentials** -- Prefer STS/IAM Role-based tokens over long-lived access keys
- [ ] **IAM permission audit** -- At least quarterly

**Network Security:**

- [ ] **Security group/firewall inbound minimized** -- SSH (22) and RDP (3389) restricted to specific IPs
- [ ] **Storage buckets default to private** -- S3, GCS, Blob Storage: Block Public Access enabled
- [ ] **VPC peering and private endpoints** -- Internal traffic should not traverse public internet
- [ ] **WAF (Web Application Firewall)** -- Block SQL Injection, XSS, and other web attacks
- [ ] **DDoS protection** -- Cloudflare, AWS Shield, GCP Cloud Armor

**Logging & Monitoring:**

- [ ] **All API calls logged** -- AWS CloudTrail / GCP Audit Logs / Azure Monitor
- [ ] **Centralized log collection** -- SIEM or log aggregation tool
- [ ] **Anomaly alerts** -- Root account usage, excessive API calls, unusual region access
- [ ] **CSPM tooling** -- AWS Config/Security Hub, GCP Security Command Center, Prisma Cloud

**CI/CD Security (Vercel-specific):**

- [ ] **GitHub Actions secrets encrypted** -- Environment variables and API keys in GitHub Secrets
- [ ] **OIDC federation** -- Avoid long-lived access keys; use workload identity federation
- [ ] **Deployment pipeline security** -- PR review mandatory, branch protection rules
- [ ] **Environment variable scoping** -- Production/Preview/Development separation
- [ ] **Build cache security** -- Verify no sensitive information in build cache
- [ ] **Security headers in vercel.json** -- CSP, HSTS, X-Frame-Options, Permissions-Policy

### 4.2 AWS Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| Root account MFA enabled | [ ] | Hardware MFA recommended |
| IAM user MFA enabled | [ ] | All console users |
| S3 Block Public Access | [ ] | Account-level setting |
| CloudTrail all regions enabled | [ ] | Log file integrity validation on |
| Security Hub enabled | [ ] | CIS benchmark auto-assessment |
| GuardDuty enabled | [ ] | Automated threat detection |
| Config Rules configured | [ ] | Resource compliance monitoring |
| KMS key rotation enabled | [ ] | Annual auto-rotation |
| VPC Flow Logs enabled | [ ] | Network traffic analysis |
| EC2 instances use SSM | [ ] | Session Manager instead of SSH keys |
| Secrets Manager in use | [ ] | No hardcoded credentials |
| RDS encryption enabled | [ ] | At-rest encryption |
| Backup policy (AWS Backup) | [ ] | Daily backup + cross-region replication |

### 4.3 GCP Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| Organization Policy | [ ] | Domain restriction, region restriction |
| Cloud Identity MFA enforced | [ ] | All users 2FA |
| IAM periodic review | [ ] | Use IAM Recommender |
| Security Command Center | [ ] | Standard tier free |
| GCS uniform bucket-level access | [ ] | Public access prevention |
| Cloud Audit Logs (data access) | [ ] | Data access logs enabled |
| VPC Service Controls | [ ] | Data exfiltration perimeter |
| Cloud KMS key rotation | [ ] | Auto-rotation configured |
| Cloud Armor WAF policy | [ ] | XSS/SQLi defense rules |
| Workload Identity | [ ] | GKE to GCP service account mapping |
| Cloud Functions security | [ ] | Ingress: internal only; authentication required |
| Cloud SQL encryption + private IP | [ ] | SSL/TLS enforced; public IP disabled |

### 4.4 Azure Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| Root account MFA | [ ] | Microsoft Authenticator |
| Azure AD Conditional Access | [ ] | Location-based access restriction |
| Azure Defender enabled | [ ] | Servers, containers, storage |
| Storage account public access blocked | [ ] | Shared Key access disabled |
| Key Vault Soft Delete + Purge Protection | [ ] | Data recovery protection |
| NSG rules minimized | [ ] | Inbound rules restricted |
| Azure Policy compliance | [ ] | Built-in initiatives |
| Sentinel or Log Analytics | [ ] | Centralized log collection |
| Managed Identity | [ ] | Replace service principal accounts |
| App Service HTTPS enforced | [ ] | TLS 1.2 minimum |

### 4.5 Vercel Security (Startup-Specific)

| Item | Status | Notes |
|------|--------|-------|
| GitHub integration minimum scope | [ ] | Specific repositories only |
| Deploy Hook protection | [ ] | URL rotation; avoid exposure |
| Environment variables encrypted | [ ] | Production/Preview separation |
| vercel.json security headers | [ ] | CSP, HSTS, Permissions-Policy |
| Serverless Function timeout limit | [ ] | Prevent runaway execution |
| Edge Config security | [ ] | No sensitive data storage |
| Auto-deploy branch restriction | [ ] | Production only from main |
| Team 2FA enforcement | [ ] | All team members |
| API route rate limiting | [ ] | Brute force/DDoS defense |
| GDPR/privacy policy linked | [ ] | Review Vercel Analytics data collection |

---

## 5. Google Workspace Security

### 5.1 Admin Console Global Settings

**Authentication & Access Control:**

- [ ] **2FA enforced for all users** -- Admin Console > Security > 2-Step Verification
- [ ] **Security keys (Passkey/YubiKey) recommended** -- FIDO2/U2F for phishing resistance
- [ ] **Admin accounts minimized** -- Maximum 3 Super Admins; use temporary admin roles
- [ ] **Session length limited** -- Google services session to 7 days or less
- [ ] **Legacy authentication disabled** -- No IMAP/POP3; OAuth 2.0 only
- [ ] **Suspicious login alerts enabled** -- Monitoring for anomalous sign-ins

**Gmail Security:**

- [ ] **External recipient warnings** -- Warning banner when emailing outside organization
- [ ] **Confidential Mode defaults** -- Auto-apply to sensitive emails
- [ ] **Attachment sandboxing (Security Sandbox)** -- Safe attachment preview
- [ ] **Link and external image proxying** -- Phishing link tracking prevention
- [ ] **SPF, DKIM, DMARC configured** -- Email spoofing prevention
- [ ] **Domain spoofing detection** -- Quarantine lookalike domain emails (BEC defense)
- [ ] **Compliance rules** -- Detect sensitive keywords (bank account, RRN) and block/alert
- [ ] **Email forwarding to external domains restricted** -- Prevent stealth exfiltration

**Drive & Docs Security:**

- [ ] **Default sharing scope: Organization only** -- Not "Anyone with link"
- [ ] **Sharing link expiration enforced** -- Maximum 30 days for external sharing
- [ ] **External user warnings** -- Warning when sharing with external users
- [ ] **Download/copy/print restriction (IRM)** -- For sensitive documents
- [ ] **Drive DLP rules active** -- Pattern detection for RRN, credit card, bank account numbers
- [ ] **External sharing audit** -- Quarterly review of "Anyone with link" permissions
- [ ] **Guest user access expiration** -- Auto-expire invited external users

**Third-Party Apps & API Control:**

- [ ] **App access restricted to allowlist** -- Admin Console > Security > API Controls
- [ ] **Marketplace app whitelist** -- Only approved apps installable
- [ ] **Third-party app audit** -- Quarterly review of Gmail/Drive access permissions
- [ ] **OAuth scope verification** -- Review sensitive scopes before approval

**Endpoint & Device Management:**

- [ ] **Device management enabled** -- Device registration required for company data access
- [ ] **Mobile device security policy** -- Screen lock, encryption, remote wipe
- [ ] **Context-Aware Access** -- Only trusted devices/IP ranges

### 5.2 Google Workspace Periodic Audit Routine

| Task | Frequency | Admin Console Path |
|------|-----------|-------------------|
| External sharing link audit | Monthly | Drive > Sharing audit |
| Third-party app permission review | Quarterly | Security > API Controls |
| Inactive user cleanup | Monthly | Directory > Users |
| Admin account audit | Quarterly | Directory > Users > Admins |
| Login audit log review | Weekly | Security > Security Center |
| Gmail routing rule audit | Quarterly | Apps > Gmail > Advanced Settings |
| DLP rule effectiveness review | Quarterly | Security > Data Protection |

---

## 6. DRM & Document Security

### 6.1 Document Classification Framework

| Level | Document Type | DRM Controls |
|-------|---------------|--------------|
| **Confidential** | Technical patents, source code, core algorithms, investment agreements | View/edit/print/copy fully controlled; watermark applied |
| **Restricted** | Financial statements, payroll, HR records, customer PII | View limited to designated personnel; edit/print logged |
| **Internal** | Business plans, meeting minutes, operational manuals | Organization-wide access; external forwarding blocked |
| **Public** | Marketing materials, job postings, IR materials | No DRM |

### 6.2 Google Drive IRM (Information Rights Management)

| Feature | Configuration | Target |
|---------|---------------|--------|
| Download prevention | Drive > File > Disable download for shared link | Confidential docs |
| Copy prevention | Drive > File > "Viewers and commenters cannot download, print, or copy" | Confidential & Restricted |
| Print prevention | Same menu as above | Confidential |
| Expiration date | Share settings > Add access expiration | External sharing |
| Trust rules | Admin Console > Drive > Trust Rules | Block specific domains |

### 6.3 Source Code Protection

- [ ] **Repository visibility: Default private** -- Public requires CISO approval
- [ ] **Pre-commit secret scanning** -- [LAON VaultGuard](https://github.com/gameworkerkim/vibe-investing/tree/main/LAON_VaultGuard), GitGuardian, TruffleHog
- [ ] **`.gitignore` enforcement** -- Block `.env`, `.pem`, `credentials.json`, `*.key` from commits
- [ ] **Branch protection rules** -- No direct push to main; PR review mandatory
- [ ] **GitHub Secret Scanning** -- Enabled (free for public repos)
- [ ] **Quarterly access audit** -- Review collaborators and service accounts

### 6.4 Offboarding SaaS Lifecycle

- [ ] **Offboarding checklist** -- Shared between IT and HR; all accounts revoked on departure day
- [ ] **SSO (Single Sign-On)** -- Google Workspace / Okta / Azure AD for centralized management
- [ ] **SaaS inventory** -- Maintain list of all SaaS services with admin contacts
- [ ] **Monthly account audit** -- Clean up inactive accounts and guest users

---

## 7. KISA Compliance: What Changes from GDPR/CCPA

### 7.1 Personal Information Security Obligations (6 Mandatory Measures)

Under PIPA Article 29 and the Security Standards Notice:

| # | Obligation | Details |
|---|-----------|---------|
| 1 | **Internal management plan** | Documented security policies, designated responsible person (small businesses processing <100K data subjects exempt from writing requirement) |
| 2 | **Access control devices** | Firewall, external network segregation, unauthorized access detection |
| 3 | **Access log integrity** | Access timestamp, IP, processing details; minimum 6-month retention; tamper-proof storage |
| 4 | **Encryption protection** | At-rest and in-transit encryption per standards below |
| 5 | **Antivirus software** | Latest version with auto-update enabled |
| 6 | **Other protective measures** | Physical security, duty separation, security training |

### 7.2 Encryption Standards (Mandatory)

| Data Type | Examples | Encryption | Algorithm |
|-----------|----------|------------|-----------|
| **Unique identifiers** | RRN, passport, alien registration, driver's license | Mandatory at rest | AES-256 |
| **Financial/credit info** | Bank account, card number, credit rating | Mandatory at rest | AES-256 |
| **Biometric data** | Fingerprint, face, iris, voice | Mandatory at rest | AES-256 |
| **Passwords** | All user and admin passwords | One-way hashing | SHA-256/384/512 |
| **Transmission** | All communications containing personal data | Mandatory in transit | TLS 1.2+ |

### 7.3 Access Log Standards

| Entity Type | Review Frequency | Retention Period |
|-------------|-----------------|------------------|
| General businesses | Semi-annual | 6 months |
| Information communication service providers | **Monthly** | 6 months |
| Telecommunications operators | Monthly | **2 years** |

Required log fields: Access timestamp, IP address, processing details. **Tamper-proof storage is mandatory** (separate server, WORM storage, or equivalent).

### 7.4 CPO vs. CISO in Korean Law

| | CPO (Chief Privacy Officer) | CISO (Chief Information Security Officer) |
|---|---|---|
| **Legal basis** | PIPA Article 31 | Network Act Article 45-3 |
| **Applies to** | **All entities** processing personal data (no size exception) | Information communication service providers above certain size thresholds |
| **Role** | Privacy protection oversight, privacy policy, breach response | Information security management system, security policy |
| **Concurrent roles** | CEO/executive can serve as CPO for small entities | Concurrent roles restricted for large entities (assets above thresholds) |

**For foreign startups:** If your Korean subsidiary processes ANY personal information, you must designate a CPO. This is the most common compliance miss.

### 7.5 Key Legal Provisions Summary

| Law | Applies To | Key Obligations | Penalties |
|-----|-----------|-----------------|-----------|
| **PIPA** | All personal data processors | 6 security measures, privacy policy publication, timely destruction | Fines up to KRW 30M + criminal liability |
| **Network Act** | Internet/app-based data collectors | Technical/managerial protection, 24-hour KISA breach report, [Advertisement] label | Fines up to KRW 30M + penalty surcharges |
| **Unfair Competition Prevention Act** | Trade secret holders | Confidentiality management (NDA, classification, inventory) | Up to 5 years imprisonment or KRW 50M fine |

---

## 8. Incident Response Framework

### 8.1 Six-Stage IR Model (NIST SP 800-61)

Preparation -> Identification -> Containment -> Eradication -> Recovery -> Lessons Learned

### 8.2 Korea-Specific Breach Response Deadlines

**For Personal Information Breaches:**

1. **Immediately upon discovery** -- Report to CPO and management
2. **Within 24 hours** -- Report to KISA/PIPC (for ISPs under Network Act)
3. **Within 72 hours** -- Notify affected data subjects (all entities): what was leaked, which items, how to mitigate harm
4. **Without delay** -- Block leakage path and prevent additional exposure
5. **Post-incident** -- Document root cause, corrective actions, and submit to authorities

**For Ransomware:**

1. **Immediately** -- Isolate infected systems from network (physically disconnect)
2. **Never** -- Pay ransom (no guarantee of recovery; may fund further attacks)
3. **Immediately** -- Verify offline backup integrity
4. **Post-incident** -- Determine infection vector and prevent recurrence

**For BEC (Business Email Compromise):**

1. **Immediately** -- Reset compromised account password + force sign-out all sessions
2. **Immediately** -- Notify bank of anomalous transactions; request payment freeze
3. **Full sweep** -- Check email forwarding rules and filters (attacker concealment mechanisms)
4. **Notify counterparties** -- Inform trading partners of potential impersonation

### 8.3 Pre-Incident Preparation Checklist

- [ ] Incident response contact list (CPO, CISO, Legal, PR, IT lead)
- [ ] Media response template (legal-reviewed)
- [ ] Data subject notification template (in Korean)
- [ ] Evidence collection guidelines (disk imaging, log preservation)
- [ ] External expert contacts (law firm, security consultancy, forensic firm)
- [ ] KISA and PIPC reporting procedures documented

---

## 9. Security Organization Roadmap

| Stage | Team Size | Security Responsibility | Mandatory Requirements |
|-------|-----------|------------------------|------------------------|
| **Pre-Seed/Seed** | 1-10 | CEO/CTO dual role | CPO designation (CEO can serve) |
| **Post-Launch** | 10-30 | Designated security lead (can dual-role) | Access control, access log review |
| **Series A** | 30-100 | Dedicated CISO/Security team | ISMS certification preparation |
| **Series B+** | 100+ | Separate CPO and CISO | Size-based obligations (revenue, data subjects) |

---

## 10. Technical Protection Standards

### 10.1 Password Policy

| Combination | Minimum Length | Example |
|-------------|---------------|---------|
| 2 of 3 types (upper/lower, number, special char) | 10 characters | `StartupS3cure!` |
| 3 of 3 types | 8 characters | `S3cure!1` |

- Sequential numbers (12345), phone numbers, dictionary words, keyboard patterns (qwerty) **prohibited**
- Previous N passwords reuse **prohibited** (minimum 5 history)
- Maximum age: 3 months

### 10.2 Office & Endpoint Security Rules

- [ ] Lock PC when away (screensaver at 5 minutes)
- [ ] No unauthorized USB/external HDD/CD media
- [ ] Shred confidential documents; no scratch paper reuse
- [ ] Password-protect shared folders; minimum access
- [ ] Do not open unsolicited email attachments
- [ ] Revoke all SaaS accounts immediately upon departure
- [ ] Quarterly audit of SaaS external sharing links -- restrict "Anyone with link"

---

## 11. Free Resources & Government Support

Korean government agencies provide free security services for startups and SMEs:

| Agency | Service | Description | URL |
|--------|---------|-------------|-----|
| **KISA** | Boho (Internet Protection) | Hacking/virus reporting, free remote web vulnerability scanning for SMEs | [boho.or.kr](https://www.boho.or.kr) |
| **KISA/KCC** | i-Privacy Portal | Privacy protection education, breach reporting | [i-privacy.kr](https://www.i-privacy.kr) |
| **KISA/MOIS** | Privacy Comprehensive Support Portal | Laws, education, policy templates, expert consultation (+82-2-2100-4047) | [privacy.go.kr](https://www.privacy.go.kr) |
| **Win-Win Foundation** | Technology Protection Fence (Ultari) | 24/7 technology leak monitoring, legal advisory (up to KRW 5M) | [ultari.go.kr](https://www.ultari.go.kr) |
| **KIPO** | Trade Secret Protection Center | Trade secret infringement reporting, original proof service | [tradesecret.or.kr](https://www.tradesecret.or.kr) |
| **KISA** | DDoS Shelter | Free DDoS protection for SMEs | [boho.or.kr](https://www.boho.or.kr) |

**Key contact:** KISA privacy consultation hotline: +82-2-2100-4047 (Korean, some English support available).

### Open-Source Security Tools (Free)

| Tool | Purpose | URL |
|------|---------|-----|
| **Semgrep** | Static analysis (SAST) | [semgrep.dev](https://semgrep.dev) |
| **Trivy** | Container/IaC vulnerability scanning | [github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy) |
| **Gitleaks** | Git secret detection | [github.com/gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) |
| **LAON VaultGuard** | Multi-LLM secret detection | [GitHub](https://github.com/gameworkerkim/vibe-investing/tree/main/LAON_VaultGuard) |
| **Checkov** | IaC security scanning | [checkov.io](https://www.checkov.io) |
| **Wazuh** | Open-source SIEM/XDR | [wazuh.com](https://wazuh.com) |
| **Gophish** | Phishing simulation | [getgophish.com](https://getgophish.com) |
| **OWASP ZAP** | Web vulnerability scanner | [zaproxy.org](https://www.zaproxy.org) |
| **Cloudflare Zero Trust** | Up to 50 users free | [cloudflare.com](https://www.cloudflare.com) |

---

## 12. Stage-Gate Compliance Checklist

### Gate 1: Development Complete -> Staging Deploy

- [ ] SCA (Software Composition Analysis) passed (zero Critical/High vulnerabilities)
- [ ] Git secret scan passed (zero hardcoded API keys/passwords)
- [ ] HTTPS applied to all endpoints, including internal
- [ ] Personal data encrypted at rest per PIPA standards
- [ ] Password policy enforced in code
- [ ] File upload security reviewed

### Gate 2: Staging -> Production Deploy

- [ ] Web vulnerability scan completed (OWASP Top 10 cleared)
- [ ] Cloud security configuration reviewed (IAM, network, logging)
- [ ] Privacy policy published and accessible on website
- [ ] Incident response contact list established
- [ ] Backup and restore procedure validated
- [ ] Security headers applied (CSP, HSTS, X-Frame-Options)

### Gate 3: Production Operations (Quarterly Review)

- [ ] IAM permission audit
- [ ] Access log review
- [ ] Google Workspace third-party app and external sharing audit
- [ ] SaaS account lifecycle check
- [ ] DRM and document access log review
- [ ] Backup restore test

---

## Appendix

### A. One-Page Startup Security Checklist

```
[Planning] -- NDA + IP protection -> Security policy outline -> CPO candidate
[Registration] -- Business license -> Internal regulations -> Workspace 2FA
[Development] -- HTTPS + Encryption -> Secret scanning -> Cloud security baseline
[Launch] -- Web vuln scan -> Privacy policy -> Incident response plan
[Operations] -- Periodic audits -> Training -> Backups -> SaaS audits (quarterly)
```

### B. Tech Stack Security Check (TS, Node.js, Vercel)

| Layer | Security Check |
|-------|---------------|
| **Vercel** | Environment variable encryption, Deploy Hook protection, security headers, team 2FA |
| **Next.js** | CSP configuration, API Route authentication, Server Actions security, middleware.ts auth |
| **Node.js** | `helmet` middleware, CORS configuration, rate limiting, input validation (`zod`), `npm audit` |
| **TypeScript** | Strict mode, minimize `any` usage, type-based injection prevention |
| **Database** | Parameterized queries (SQL Injection prevention), connection string encryption |
| **GitHub** | Branch protection, CODEOWNERS, Secret Scanning enabled |

### C. References

- KISA "Information Security Guide for Startups" (2018)
- KISA "SME Information Security Practical Guide"
- MINARC "[Startup Security Framework Guide](https://startup-security.netlify.app/)"
- PIPC "Personal Information Protection Act and Guidelines"
- NIST SP 800-61 (Computer Security Incident Handling Guide)
- NIST SP 800-207 (Zero Trust Architecture)
- MITRE ATT&CK Framework
- GDPR (Regulation (EU) 2016/679)
- CCPA/CPRA (California Civil Code)

### D. LLM CISO Integration

Pair this guide with [LLM_CISO_PROMPT_EN.md](./LLM_CISO_PROMPT_EN.md) for automated compliance assessment using public LLMs (Claude, GPT, DeepSeek) or local LLMs (Ollama). The cross-jurisdiction compliance prompt module specifically detects where your GDPR or CCPA compliance does not satisfy Korean PIPA requirements.

---

**This guide is provided for practical reference. Actual security architecture and regulatory compliance depend on individual company circumstances.**

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) | [github.com/gameworkerkim](https://github.com/gameworkerkim/)
>
> (c) 2026 | Startup Security Guide: Korea Market Entry Edition | [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
