# CTI Report — Twin Incidents Born of Careless Coding

> **"A breach made by a single commit"** — The Taiko bridge hack and TVING: déjà vu

| Field | Detail |
|---|---|
| **Category** | Cyber Threat Intelligence / Secret Management Failure |
| **Date** | 2026-06-28 |
| **TLP** | CLEAR (publicly shareable) |
| **Incidents Covered** | ① Taiko bridge hack (2026-06-22) · ② TVING personal-data breach (2026-06) |
| **Key Keywords** | Hardcoded Secret · Git History · Pre-commit Hygiene · SGX/MrSigner · AWS Access Key |
| lang | en |

Written in plain language so that security professionals who do not code can follow it—but readers should understand that once a private key is committed and pushed, the key must be revoked.

---

## Table of Contents

1. Executive Summary
2. Incident ① — Taiko Bridge Hack (2026-06-22)
   - 2.1 Overview / 2.2 Attack Analysis / 2.3 Post-Incident Response
3. Incident ② — TVING Personal-Data Breach (2026-06)
   - 3.1 Overview / 3.2 Attack Analysis / 3.3 Response and Controversy
4. Comparative Analysis — Different Incidents, Same Failure
   - 4.1 Commonalities / 4.2 Differences
5. Why the Pre-commit Stage Is Critical
6. Defensive Recommendations
7. Closing — Even with LLMs, Complacency Remains
- Appendix — Prior Careless-Coding Precedents
- Sources

---

## 1. Executive Summary

In June 2026, two incidents of entirely different character occurred at nearly the same time. One was a Web3 hack in which roughly **USD 1.7 million (about KRW 2.4 billion)** was withdrawn from the bridge of Ethereum L2 **Taiko**, a zero-knowledge (ZK) rollup. The other was a personal-data breach affecting about **19 million people** at major Korean OTT **TVING**.

The tech stacks, harm types, and industries differ—but **the root cause is the same.**

> ***"Secrets and credentials that should never have entered the code repository (GitHub) were committed, and attackers simply picked them up and used them."***

In other words, both incidents began not with a sophisticated exploit chain or a zero-day, but with a **secret-management failure that should have been caught at the commit stage**. Even the most sophisticated trust models—Taiko's SGX hardware trust, TVING's ISMS certification and DB encryption—were wholly neutralized by a single exposed key, illustrating how easily humans break simple security rules.

---

## 2. Incident ① — Taiko Bridge Hack (2026-06-22)

### 2.1 Overview

- **Target:** Ethereum L2 Taiko (Type-1 ZK-EVM rollup; mainnet launched May 2024)
- **Impact:** Roughly $1.7M withdrawn from bridge and ERC20Vault contracts (primarily ETH and ERC-20 assets)
- **Detection/response:** Real-time detection by Blockaid; root-cause analysis by BlockSec (Phalcon), PeckShield, and Quill Audits. Freeze within hours of the incident
- **Market impact:** TAIKO token fell roughly 10–20%; attacker moved about 2 million TAIKO (~$170K) to MEXC

### 2.2 Attack Analysis

Taiko does not use a single sequencer; it adopted a multi-prover architecture. The proof-generation stack **Raiko** combines Intel SGX attestation with ZK backends (SP1, RISC0) so that forgery requires simultaneously breaking independent proof systems. That multi-structure, however, was **bypassed by a single operational error that enabled easy authentication outside the intended trust model.**

- **Key exposure:** The RSA-3072 private key used for SGX enclave signing was committed as `enclave-key.pem` to the public repository taikoxyz/raiko and was downloadable by anyone. That value must never leave the hardware (enclave).
- **Malicious prover registration:** The L1 contract was designed to trust enclaves matching a stored MrSigner value. Using the stolen key, the attacker called `SgxVerifier.registerInstance` and registered a prover under their control as "legitimate."
- **Forged proof generation:** The trusted prover signed fake L2 state attestations and withdrawal proofs.
- **Asset withdrawal:** Withdrawal requests were submitted on Ethereum L1 without corresponding Taiko L2 deposits (MessageSent events). The contract had no way to reject proofs that passed verification, so assets were drained.

A developer master private key was uploaded to GitHub; the attacker who downloaded it signed withdrawals of L2 coin assets.

> ***The hardware-based trust model itself "worked as designed." It simply trusted the wrong operator (the attacker).***

### 2.3 Post-Incident Response

The Taiko team activated a Security Council multisig to pause the bridge and ERC20Vault, halted block production, and urgently notified all users to **immediately withdraw funds from the bridge**. It also asked CEXs to suspend TAIKO deposits. The decisive reason damage remained relatively limited was **detection and freeze within hours**.

---

## 3. Incident ② — TVING Personal-Data Breach (2026-06)

### 3.1 Overview

- **Target:** Major Korean OTT TVING (MAU 7.7M+)
- **Impact:** About 19.53 million people. IDs, names, dates of birth, gender, phone numbers, and emails leaked along with CI/DI (phone numbers, emails, refund accounts, and passwords were encrypted). CI leakage and resulting second-/third-order phishing risk is the core concern
- **Cascade:** Risk spread via CJ ONE unified-login linked accounts; in the same period, Day1Company (FastCampus) also suffered a GitHub master-account key theft incident

### 3.2 Attack Analysis

Synthesizing reporting based on the KISA incident report, the attack path was as follows:

- **Key exposure:** An AWS access key was hardcoded in source for development convenience, and that code was pushed to GitHub, exposing credentials.
- **Direct DB access:** The attacker used that key to access cloud resources, especially the DB server.
- **Query execution:** With query/modify/delete privileges, large volumes of member data were extracted. The report titled the incident "unauthorized-access breach."

### 3.3 Response and Controversy

- **Detection delay:** The defense stack did not detect the attack; anomalies were noticed only after bulk extraction drove DB CPU to 100%. About 21 hours elapsed from anomalous signs to recognition.
- **Limits of certification:** Despite holding ISMS certification, cloud administrator access keys were exposed in code, revealing a gap between certification and actual security posture.
- **Reporting-timing controversy:** Filing near the statutory 24-hour reporting deadline after recognition drew criticism as a possible "downplaying" attempt.
- **Remediation:** AWS access-key revocation; removal and replacement of hardcoded GitHub credentials; attacker IP blocking; changes to cloud access-control policy.

---

## 4. Comparative Analysis — Different Incidents, Same Failure

| Category | Taiko Bridge Hack | TVING Personal-Data Breach |
|---|---|---|
| **Industry** | Web3 / DeFi (L2 bridge) | OTT / personal-data processing |
| **Exposed secret** | SGX enclave RSA-3072 signing key (enclave-key.pem) | AWS access key (hardcoded) |
| **Exposure path** | Committed to public GitHub repository | Hardcoded and exposed in GitHub repository |
| **Neutralized defenses** | SGX multi-prover hardware trust model | ISMS certification · DB encryption |
| **Core intrusion act** | Malicious prover registration → forged proof generation | Direct DB access with stolen key → query execution |
| **Harm type** | Bridge asset withdrawal (~$1.7M) | Mass personal-data leak (~19.53M people) |
| **Detection method** | External security vendor real-time detection | Post-facto recognition via DB overload (CPU 100%) |
| **Response speed** | Freeze within hours (damage minimized) | Recognition after ~21 hours (damage expanded) |

When large assets left the Taiko bridge, there was no basic Slack/Telegram alerting; an external security firm discovered it.

For TVING, what the monitoring vendor was actually monitoring remains an open question.

### 4.1 Commonality — Carelessly Uploading Keys to GitHub

Both incidents' most sophisticated security controls (hardware enclaves; certification and encryption) rested on the premise **"trust whoever holds this key."** The moment that key was committed to the repository, the entire trust model was handed to the attacker. Regardless of control strength, **if the secret that roots trust is exposed, all higher-layer controls become meaningless.**

### 4.2 Difference — Detection and Response Speed Decided the Outcome

The root cause was the same, but outcomes diverged. Taiko froze within hours via external monitoring and stopped damage around $1.7M—money was directly at stake, so once hit, servers were taken down. TVING failed self-detection and allowed ~19 million extractions over 21 hours. **The effectiveness of the IR plan and detection telemetry determined the scale of harm.**

If you do not notice when large coin assets leave, you should not be running a mainnet. The lesson is that many Web3 projects on GitHub have not properly operated pre-commit controls at the source-management level.

---

## 5. Why the Pre-commit Stage Is Critical

**The core is simple: secrets do not disappear when deleted after they are committed.**

- GitHub retains full commit history. Deleting a key from current code leaves it in past commits. Exposed keys must therefore be **revoked and rotated**, not merely "deleted." (That is why the TVING report listed both "AWS key revocation + credential replacement.")
- Public repositories are searchable worldwide, and bots that automatically scan for credentials run continuously. Time from exposure to abuse is often measured in minutes.
- Defense gravity must therefore move from "respond after exposure" to "block before commit"—the pre-commit stage.

From this view, both incidents were **"accidents that would not have occurred if filtered once just before commit."**

Basic open-source pre-commit security solutions are abundant.

---

## 6. Defensive Recommendations

### 6.1 Pre-commit (Prevent Exposure) — First Line

- **Adopt pre-commit hooks:** Force gitleaks, git-secrets, truffleHog, detect-secrets, etc., as commit hooks to block secret-containing commits entirely.
- **Repository-side secret scanning:** Mandate GitHub Push Protection / Secret Scanning and CI-pipeline scans (prevent developer-PC bypass).
- **Maintain .gitignore:** Default-block patterns such as `*.pem`, `*.key`, `.env`, and credential files. Note that .gitignore is only an aid and does not replace scanning.

### 6.2 Secret Storage Architecture — Structural Fix

- **Ban hardcoding entirely:** Do not put keys/credentials in code; inject at runtime from AWS Secrets Manager / HashiCorp Vault / KMS.
- **Hardware key non-exfiltration principle:** Design out paths by which TEE signing keys such as SGX leave the enclave (build artifacts, test fixtures, backups).
- **Short-lived credentials and least privilege:** Prefer STS/short-lived tokens over long-lived access keys; IAM least privilege; separate key usage scopes.

### 6.3 Post-Exposure Controls and Detection — Minimize Harm

- **Automatic key rotation + immediate revocation procedures:** Codify "revoke + replace," not "delete," as the standard playbook on suspected exposure.
- **Anomalous-behavior detection (telemetry):** Real-time alerts for bulk DB queries and anomalous on-chain withdrawals.
- **Keep IR plans live:** Pre-define and drill freeze, notification, exchange coordination, and reporting procedures.
- **Clean past history:** Remove already-exposed keys via git-history rewrite (BFG, filter-repo), but **always rotate keys first**.

---

## 7. Closing — Even with LLMs, Complacency Remains

Taiko and TVING look unrelated on the surface, but from a security perspective they are **two textbook cases of the same failure**. Cutting-edge zero-knowledge proofs and nationally recognized certification systems both collapsed before **a single key a developer committed**.

> ***Before stopping sophisticated attacks, do not open the door yourself.***

The first place hackers search is keys in public code. Therefore security investment priority, before flashy defense products, should be:

- **(1) Secret blocking at the pre-commit stage**
- **(2) Structural migration to dedicated secret stores**
- **(3) Regular security monitoring**
- **(4) Immediate revoke-and-replace playbooks on exposure**

The lesson both incidents showed in the same month is that humans always err, and systems must be designed and operated assuming the worst case.

---

## Appendix — Prior Careless-Coding Precedents

- **Uber (2016):** Login credentials obtained from a private GitHub repository used to access user DBs in AWS; ~57 million people exposed.
- **Toyota T-Connect (2017–2022):** A partner uploaded source to a public repository with hardcoded DB access keys; exposed for ~5 years (up to ~290,000 people potentially affected).
- **Day1Company (FastCampus, 2026):** Intrusion via GitHub master-account key theft — same-family incident concurrent with TVING.

## Sources

- CoinDesk, "Taiko halts its Ethereum layer-2 network after a bridge exploit" (2026-06-22)
- The Defiant, "Taiko Bridge Drained $1.7M After SGX Signing Key Left Exposed on GitHub"
- Decrypt, "Ethereum Layer-2 Taiko Warns Users to Withdraw Bridge Funds After Security Breach"
- thirdweb / Crypto Times / Quill Audits — Taiko technical analysis
- News1, "GitHub keys targeted by hackers… DB-access attacks more serious than data leaks" (2026-06-12)
- Edaily, "TVING hack expands beyond simple data leak into cloud account-management controversy"
- Boan News, "TVING personal-data breach incident"

---

*This report synthesizes public primary reporting and security-vendor analysis; some technical details (e.g., asset composition) may be corrected when Taiko publishes an official post-mortem.*
