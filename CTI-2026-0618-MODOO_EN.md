---
title: "Modoo Entrepreneurship — Analysis of Unauthorized Access to Private Data of 5,000 Successful Applicants on a Government Public Entrepreneurship Platform"
document_id: CTI-2026-0618-MODOO
analyst: "Dennis Kim (HoKwang Kim, 김호광)"
affiliation: "CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure MVP"
email: gameworker@gmail.com
github: github.com/gameworkerkim
date: 2026-06-18
tlp: CLEAR
language: en
---

# Modoo Entrepreneurship Data Breach

## Analysis of Unauthorized Access to Private Data of 5,000 Successful Applicants on a Government Public Entrepreneurship Platform

**Document ID:** CTI-2026-0618-MODOO
**Published:** June 18, 2026
**Analyst:** Dennis Kim (김호광 / HoKwang Kim) — CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure ex-MVP
**TLP:** CLEAR
**Incident Date:** June 15, 2026

---

## Executive Summary

This report analyzes a data breach that occurred on June 15, 2026, on "Modoo Entrepreneurship" (*Modoo Chang-eop*), a public entrepreneurship audition platform sponsored by the Ministry of SMEs and Startups (MSS) and operated by the Korea Institute of Startup & Entrepreneurship Development. Immediately after the profiles of 5,000 first-round successful applicants were published at 09:00 on June 15, multiple IPs gained unauthorized access to the platform's **private data fields** and exfiltrated email addresses, idea (business-model) summaries, and **judge evaluation comments**.

Two features distinguish this incident from ordinary government-site personal-data leaks. First, the leaked material goes beyond simple PII to include **participants' core assets—business-idea summaries and confidential evaluation comments**—i.e., it has the character of trade-secret / intellectual-property (IP) infringement. Second, the likely mechanism is not external system hacking but **data scraping that abused the platform's own access-control flaw through a normal interface**.

> Factual findings in this report are based on MSS statements and media coverage (Herald Business, Money Today, etc., 2026-06-17~18). **Technical descriptions of the breach mechanism are the analyst's assessment based on public information and are not a confirmed root cause.** The precise cause will be established by the National Cyber Security Center and KISA incident investigation.

### Key Judgments

| # | Judgment | Confidence |
|---|---|---|
| KJ-1 | The breach was likely not an external intrusion but **automated scraping by multiple IPs of private fields left accessible at profile-publication time due to Broken Access Control**. | Medium |
| KJ-2 | Because leaked data includes idea summaries and evaluation comments, this incident is assessed as **infringement of participant IP assets and confidential evaluation information**, beyond PII leakage. | High |
| KJ-3 | Immediately after the leak, successful applicants received targeted advertising/phishing emails citing their nicknames—"policy support success roadmap," "securing R&D grants," etc.—showing that **leaked data is already being used in social-engineering attacks**. | High |
| KJ-4 | With 63,000 applicants and 12.6:1 competition, the large platform launched on a short timeline; a **security-validation gap from launch-first development** is a plausible structural cause. | Medium |
| KJ-5 | This is a **precedent incident** from which the same risk can transfer to the July Phase-2 project (selection scale doubled to 10,000) and linked projects (Modoo Ideas, AI competition). | Medium-High |

### Incident Assessment Overview

| Item | Assessment |
|---|---|
| **Incident type** | Unauthorized access to and leakage of private data (Data Exposure / Unauthorized Access) |
| **Estimated mechanism** | Automated data collection based on access-control flaw (BOLA/IDOR suspected) — *analyst assessment* |
| **Affected population** | 5,000 first-round successful applicants (of 63,000 total applicants) |
| **Leaked information** | Email addresses, idea (business-model) summaries, judge evaluation comments |
| **Confirmed not leaked (MSS)** | Real names, mobile numbers, full challenge applications (detailed ideas) — no access/leak cases to date |
| **Accessing parties** | 9 IPs (MSS statement) |
| **Exposure window** | 2026-06-15 09:00 ~ 16:00 (~7 hours) |
| **Secondary harm** | Targeted advertising/phishing emails confirmed |
| **Operational impact** | Damage to government trust, exposure of participant IP assets, risk transfer to follow-on projects |

---

## 1. Incident Overview and Timeline

### 1.1 Platform Background

"Modoo Entrepreneurship" is a public entrepreneurship audition project announced by MSS at the National Entrepreneurship Era Strategy Meeting on March 25, 2026. It is an open platform anyone can join with concise idea-centric documents; the Korea Institute of Startup & Entrepreneurship Development operates it. Key figures:

| Item | Detail |
|---|---|
| Total applicants | ~63,000 |
| Competition ratio | 12.6 to 1 |
| First-round successful | 5,000 (selected 2026-06-16) |
| Final support scale | Top winner up to KRW 1 billion prize/investment linkage |
| Personal-data recipients (notice) | Korea Institute of Startup & Entrepreneurship Development, Small Enterprise and Market Service, Shinhan Card |
| Collected information | Nickname, email, mobile number, real name, gender, date of birth |

The platform separates profile fields into **public/private**. Public fields are nickname, follower count, and round advancement; **optional private fields are email address, idea summary, and self-introduction**. That those private fields were the leak targets is central.

### 1.2 Incident Timeline (Confirmed Facts)

| Date/Time | Event |
|---|---|
| 2026-06-15 09:00 | Profiles of 5,000 first-round successful applicants **published**. Unauthorized access attempts to private information begin immediately |
| 2026-06-15 09:00~16:00 | 9 IPs gain unauthorized access to private data (email, idea summary, evaluation comments) |
| ~2026-06-15 16:00 | MSS blocks unauthorized access paths |
| 2026-06-16 | Official announcement of 5,000 first-round successful applicants (launch ceremony) |
| (After leak) | Successful applicants receive nickname-specific "policy support success roadmap" and "R&D grant support" advertising/phishing emails |
| 2026-06-18 13:00 | MSS reports personal-data leak to KISA |
| 2026-06-18 | Apology posted on Modoo Entrepreneurship website; victim report center opened. Incident investigation begun with National Cyber Security Center et al. Individual notices to all successful applicants |

---

## 2. Leaked-Data Analysis

### 2.1 Classification and Sensitivity of Leaked Information

| Data Type | Classification | Sensitivity | Notes |
|---|---|---|---|
| **Email address** | PII | Medium | Primary identifier for targeted phishing. Combined with nickname, amplifies social-engineering effect |
| **Idea (business-model) summary** | Trade secret / IP | **High** | Participant's core asset. Many deliberately set this private |
| **Judge evaluation comments** | Confidential internal evaluation | **High** | Damages fairness and confidentiality of evaluation. Sensitive for both judges and participants |

MSS confirmed that **additional PII such as real names and mobile numbers, and full challenge applications (detailed ideas), have no access/leak cases to date**. The leak appears limited to private profile fields, but inclusion of IP assets and internal evaluations determines the weight of this incident.

### 2.2 Why "Idea Leakage" Is the Essence

Ordinary personal-data leaks raise concerns about PII misuse (spam, identity theft). On an entrepreneurship audition platform, however, **the idea summary is the participant's business asset**. MSS itself has treated startup ideas as core assets and operated an "idea escrow" system; failure of a government platform to protect them also raises policy-consistency issues.

Evaluation-comment leakage is another dimension. When evaluations written under a confidentiality premise are exposed, future candor of evaluation is damaged and judges face legal and reputational risk. If evaluation information reaches competing participants, **the fairness of the selection process itself comes under suspicion**.

---

## 3. Breach Mechanism Analysis (Analyst Assessment)

> This section is a **hypothetical assessment** derived from public incident circumstances, not a confirmed investigation result. The actual cause will be confirmed by KISA and National Cyber Security Center investigation.

### 3.1 Key Circumstance — "Private Access Immediately After Publication"

The most important clue is MSS's explanation that **"access attempts to private information began immediately after profiles were published."** This strongly suggests the following sequence:

1. At 09:00 on June 15, 5,000 public profiles were posted at once (nickname, followers, round information)
2. Public profiles are internally referenced by user identifiers (user ID, sequence numbers, etc.)
3. Private fields (email, idea summary, evaluation comments) are assessed to have been **queryable via API or object reference using the same identifiers**
4. 9 IPs enumerated identifiers and automatically collected private fields

### 3.2 Suspected Vulnerability — Broken Object-Level Authorization (BOLA/IDOR)

The above circumstances match a classic **access-control flaw** pattern.

| Item | Detail |
|---|---|
| **Vulnerability type (suspected)** | BOLA (Broken Object-Level Authorization) / IDOR (Insecure Direct Object Reference). #1 in OWASP API Security Top 10 (API1) |
| **MITRE ATT&CK** | T1190 (Exploit Public-Facing Application), T1213 (Data from Information Repositories), TA0009 (Collection) |
| **Mechanism** | Client UI does not display private fields, but the backend API does not verify requester authorization at object level, so knowing the identifier returns private fields |
| **Automation** | Concentrated access from 9 IPs over 7 hours suggests script-based bulk collection (scraping), not manual work |

This pattern repeatedly appears in government/public platforms launched on short timelines. The frontend hides fields as "private," but **API responses still include the data, or a separate endpoint returns data without authorization checks**.

### 3.3 Alternative Hypotheses

- **Misconfiguration:** Private flags temporarily disabled during a profile-publication batch job.
- **Insider / recipient-path leak:** Leak via personal-data recipients (startup institute, market service, Shinhan Card) or operations outsourcing. However, the statement of "external access from 9 IPs" weighs more toward the external-collection hypothesis.
- **Credential theft:** Operator-account compromise. However, a leak limited to private fields better matches a limited access-control flaw than full DB compromise.

---

## 4. Secondary-Harm Analysis — Targeted Social Engineering

Leaked data is already being used in attacks. Successful applicants received emails titled **"policy support success roadmap"** that precisely cited their nicknames, and advertising emails claiming to help secure national R&D grants. One applicant recognized the leak after receiving a message mentioning a nickname and email they had never shared.

| Stage | Attack Pattern |
|---|---|
| Data acquisition | Nickname + email + success status + (partial) idea context |
| Trust building | Cite success fact and nickname to create a sense of "government/official linkage" |
| Induce follow-on action | Possible consulting, payment, or information-entry prompts under R&D grant / policy-funding pretenses |
| Risk | Can expand into targeted phishing and fraud abusing successful applicants' expectations |

Abusing the **positive context of being selected** is the danger of this social engineering. Victims easily mistake the mail for post-selection guidance.

---

## 5. Public-Sector and Government Impact Analysis

### 5.1 Direct Impact

- **Damage to trust in a government-led program:** An incident in a flagship project directly promoted by MSS and highlighted by the Prime Minister nominee (Minister Han Seong-sook) at the launch ceremony—direct hit to policy trust.
- **Policy-consistency problem:** A government that pledged to protect ideas as core assets (idea escrow) leaked idea summaries on its own platform.
- **Legal risk:** Possible violation of personal-data safety-measure duties under the Personal Information Protection Act; potential damages claims by affected participants. (Note: Concurrent reporting that TVING users filed KRW 300,000-per-person damages suits for personal-data leakage.)

### 5.2 Risk Transfer to Follow-On Programs

The **Phase-2 project scheduled for July doubles selection scale from 5,000 to 10,000**, with linked projects including the Intellectual Property Office's "Modoo Ideas" and the Ministry of Science and ICT's "AI competition." If the access-control flaw revealed in Phase 1 transfers unchanged to follow-on platforms sharing the same architecture, **harm scale can expand proportionally**. Structural security validation must precede Phase-2 launch.

### 5.3 Implications for Public Platforms Generally

| Implication | Detail |
|---|---|
| Speed–security tradeoff | Structural problem in which large public platforms launch on policy timelines and security validation is deprioritized |
| Missing API authorization | Classic flaw where "private" is only a UI label and API/object-level authorization is omitted |
| Missing data classification | Treating PII and IP assets (ideas, evaluations) at the same level; insufficient differential protection for high-sensitivity data |
| Outsourcing / recipient management | Information dispersed across multiple agencies; unclear responsibility boundaries |

---

## 6. Indicators and Detection

> Currently published technical IOCs are limited. Below are detection perspectives based on reported facts and response to similar incidents.

### 6.1 Confirmed Indicators

| Type | Value |
|---|---|
| Accessing parties | 9 IPs (specific IPs unpublished) |
| Exposure window | 2026-06-15 09:00 ~ 16:00 |
| Phishing email subject (example) | "Policy support success roadmap" |
| Phishing lure | "Support securing national R&D grants" |

### 6.2 Detection Recommendations for Similar Flaws (BOLA/IDOR)

- Detect patterns where a single or few IPs **query large volumes of objects via sequential identifiers (user_id, sequence numbers)**
- **Abnormally many profile/resource queries in a short time** from the same session/IP (rate anomaly)
- Logs of **non-owner requests that succeed without authorization failure** against API endpoints returning private fields
- Direct API calls unrelated to normal UI flow (anomalous User-Agent, missing Referer, etc.)

---

## 7. Response and Recurrence-Prevention Recommendations

### 7.1 Immediate Actions (Incident Response)

- Specifically notify all 5,000 affected applicants of leaked fields, with phishing-caution guidance (completed/in progress)
- Report and block domains/accounts sending phishing/advertising mail abusing leaked data
- Urgently review and block authorization logic on endpoints that returned private fields (the June 15 16:00 path block was emergency containment; root-cause patch still required)
- Preserve full access logs and precisely analyze the collection scope of the 9 IPs

### 7.2 Structural Recurrence Prevention

| Area | Recommendation |
|---|---|
| **Authorization design** | Enforce object-level authorization on all APIs. UI "private" must be backed by backend authorization |
| **Data classification** | Separately classify PII and IP assets (ideas, evaluations); apply separate encryption, least access, and audit to high-sensitivity data |
| **API gateway** | Apply rate limiting, anomalous-query detection, and identifier-enumeration blocking at gateway level |
| **Pre-launch validation** | Mandate penetration testing (especially BOLA/IDOR-centric API security tests) before public-platform launch |
| **Outsourcing management** | Document data flows and responsibility boundaries among recipients/operators; access auditing |
| **Apply to Phase 2 first** | Apply the same checks before July Phase-2 and linked projects (Modoo Ideas, AI competition) launch |

### 7.3 Policy Recommendations

- Institutionalize a **security gate independent of launch schedules** for government public platforms
- Establish separate guidelines protecting entrepreneurship-platform **idea and evaluation information at trade-secret level** (consistent with the government's idea-escrow philosophy)
- Establish IP-exposure impact assessment and remediation procedures for victims when breaches occur

---

## 8. Closing — When "Private" Was Not Private

The lesson is simple. **Hiding something on screen does not protect the data.** Email, ideas, and evaluation comments marked "private" appear to have been queryable from the backend with only an identifier; nine IPs systematically collected that gap for seven hours from the moment public profiles were posted.

What makes this incident heavy is that what leaked was not mere contact information but **business ideas participants deliberately set private, and evaluation comments written under a fairness premise**. In an entrepreneurship audition, ideas are assets, and evaluation confidentiality is procedural legitimacy. The government platform exposed the very assets the government pledged to protect.

While 60,000 people competed at 12.6:1, security validation did not keep pace. Phase 2 in July doubles the scale. To avoid repeating the same flaw for twice the people, look at authorization logic first—not the launch schedule.

> The question is one: **"On our platform, is 'private' a UI promise or a backend guarantee?"** As long as the answer stays the former, the next incident is only a matter of time.

---

## Appendix A: References and Sources

- **Herald Business (2026-06-18):** Bu Ae-ri, "'Modoo Entrepreneurship' successful-applicant personal data leaked… 'idea summaries also stolen'"
  - URL: https://biz.heraldcorp.com/article/10775754
- **Money Today Unicorn Factory (2026-06-17):** "[Exclusive] 'Modoo Entrepreneurship' that drew 60,000, personal-data leak suspicion… government 'investigating'"
  - URL: https://www.mt.co.kr/future/2026/06/17/2026061713382194585
- **News1 (2026-06-16):** "5,000 take first step in 'Modoo Entrepreneurship'… three talent traits Minister Han Seong-sook cited"
- **MSS / Modoo Entrepreneurship website:** Apology and victim report center notice (2026-06-18)
- **Reference (concurrent case):** Reporting on TVING user personal-data leak damages suits (Herald Business)

---

## Appendix B: Analyst Information and Distribution

| Item | Detail |
|---|---|
| **Analyst** | Dennis Kim (김호광 / HoKwang Kim) |
| **Affiliation** | CEO, Betalabs Inc. (Seoul) / Independent CTI Analyst / Microsoft Azure ex-MVP |
| **Email** | gameworker@gmail.com |
| **GitHub** | github.com/gameworkerkim |
| **Web3Paper** | web3paper.net/ko |
| **Document ID** | CTI-2026-0618-MODOO |
| **TLP** | CLEAR — freely distributable (attribution recommended) |
| **Distribution language** | English (translated from Korean original) |

Factual findings in this report are based on public media coverage and MSS statements. Technical descriptions of the breach mechanism (Section 3) are the analyst's assessment based on public circumstances and are not a confirmed root cause. Precise cause and responsibility will be established by KISA and National Cyber Security Center investigation. Policy implications and recommendations are the analyst's views.

---

*End of Document*
