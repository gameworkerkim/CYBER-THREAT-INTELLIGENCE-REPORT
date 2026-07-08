| id             | CTI-2026-0708-KAKAO                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| title          | "KakaoTalk Source Code for Sale" — Anatomy of a Dark-Web Claim, the Real Target, and the Blast Radius If It's True         |
| subtitle       | Not a data breach but a leak of intellectual property and infrastructure. Title says KakaoTalk, repo names say ZigZag — an extortion pitch built on a misattributed target |
| author         | Dennis Kim / HoKwang Kim                                                                                                  |
| email          | <gameworker@gmail.com>                                                                                                    |
| github         | gameworkerkim                                                                                                             |
| date           | 2026-07-08                                                                                                                |
| classification | TLP:GREEN                                                                                                                 |
| severity       | HIGH (conditional — CRITICAL if verified)                                                                                 |
| lang           | en                                                                                                                        |
| tags           | Source-Code-Sale · Dark-Web · Extortion · Target-Misattribution · Kakao-Style · ZigZag · Supply-Chain · LLM-Weaponization · DPRK-APT · Secret-Sprawl |
| threat_actors  | ExtortionLord (unidentified dark-web forum seller)                                                                        |
| frameworks     | MITRE ATT&CK · NIST SP 800-207 (Zero Trust) · SLSA / SSDF (SP 800-218) · PIPA Art. 34 (Korea)                             |
| license        | CC BY-NC-SA 4.0                                                                                                           |


# "KakaoTalk Source Code for Sale" — Anatomy of a Dark-Web Claim, the Real Target, and the Blast Radius If It's True

> **Report ID** `CTI-2026-0708-KAKAO` · **Published** 2026-07-08 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH (conditional)
> **Author** Dennis Kim / HoKwang Kim · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

🌐 [한국어](CTI-2026-0708-KAKAO_KR.md) · **English (this document)**

*Not a data breach but a leak of intellectual property and infrastructure. The title says KakaoTalk, the repository names say ZigZag — an extortion pitch built on a misattributed target.*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Framing — Not "What's Being Sold" but "What's at Stake"
3. The Claim — Anatomy of the Listing
4. The Real Target — Title Says KakaoTalk, Fingerprints Say ZigZag
5. Credibility Assessment — Why We Can't Trust It Yet
6. Blast Radius If True — Why It Exceeds TVING and CU
7. Three-Breach Severity Comparison — Data Leak vs. Code/Infra Leak
8. Korean Context — The Next Stage of the B2C Breach Chain
9. Detection, Mitigation, and Response Recommendations
10. Conclusion
11. References

---

## 1. Executive Summary (TL;DR)

In early July 2026, a threat actor calling itself **"ExtortionLord"** posted a dark-web forum listing offering **"the full source code, internal network access, and databases of KakaoTalk"** for sale. The offer spans a large collection of internal repositories covering mobile apps, backend services, APIs, infrastructure, AI projects, payments, authentication, logistics, and developer tooling. As proof of access, the seller published what appears to be a list of internal project names; the price is stated as negotiable and the deal is to run through the forum's escrow service. The claim spread quickly through X (formerly Twitter) and other security channels.

**To state this report's conclusion up front: the target appears to be not KakaoTalk itself but one of its affiliates.** And regardless of authenticity, the *nature* of what's at stake belongs to a different category than the recent personal-data breaches.

- **Title and fingerprints don't match.** The listing's title points to "Kakao Talk," but many of the disclosed repository names reference `zigzag` and `ks` (Kakao Style). Naming convention — a technical fingerprint — suggests the real target is not Kakao's messenger but **ZigZag, the fashion e-commerce platform operated by Kakao Style.** In other words, this looks like a **deliberate mislabeling** that borrows the national messenger's name to inflate attention and extortion value — *it's a Kakao affiliate anyway, so why not.*
- **Blast radius — different in kind if true.** Even granting that it's unverified, the combination of source code, internal network access, and DB access is a categorically different event from a data breach. Where June 2026's TVING (5M subscriber records + CI) and CU POST / BGF Networks (personal data + CI) were problems of *leaked data*, this claim is a problem of *leaked blueprints and keys*. Code hands over zero-day vulnerabilities, hardcoded credentials, and business logic wholesale; internal-network access becomes a foothold for supply-chain attacks and follow-on intrusion.

> **Core thesis** — A data leak creates victims; a code/infrastructure leak creates attack infrastructure. The former ends with secondary harm to the individuals leaked; the latter becomes raw material for the next attack against every user who runs that code. As of now (2026-07-08), however, the claim is **unverified** and neither Kakao nor Kakao Style has issued any statement.

> ⚠️ **Unverified matter** — This report is a conditional analysis based on the dark-web listing and public security analysis (Brinztech and others). The reality, scale, and target of any compromise can only be confirmed by an official Kakao / Kakao Style statement or independent verification. Confidence is noted per judgment.

### Key Judgments

| #    | Judgment                                                                                                                                                                                          | Confidence           |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| KJ-1 | The mismatch between the listing title ("Kakao Talk") and the repo naming convention (`zigzag`·`ks`) strongly suggests the real target is **Kakao Style / ZigZag**, not the messenger. Borrowing the national messenger's name is a textbook move to maximize extortion value and attention. | **Medium-High**      |
| KJ-2 | At present the claim is **unverified.** Despite a detailed file list, there is no official confirmation from Kakao / Kakao Style and no independent verification. Large "source-code leak" claims are frequently fabricated or exaggerated for reputation or extortion. | **High**             |
| KJ-3 | ZigZag has a prior 2023 incident in which customer data was exposed via an "infrastructure error." Firms with a breach history are easy marks for actors who **impersonate or resell** by exploiting existing fear. | **Medium-High**      |
| KJ-4 | If true, a source-code leak is **categorically more dangerous** than a standard data breach, because it simultaneously enables zero-day auditing, hardcoded-credential theft, and business-logic mapping. | **High** (conditional) |
| KJ-5 | If the claimed "internal network access" is real, it becomes a foothold for **supply-chain attacks (CI/CD poisoning) and follow-on intrusion**, propagating harm beyond a single org to that service's users and connected services. | **Medium-High** (conditional) |
| KJ-6 | In terms of blast radius, if true this event **categorically exceeds** June 2026's TVING and CU breaches. TVING/CU were problems of "leaked personal data"; this is a problem of "leaked code and keys," with a fundamentally different capacity to generate secondary attacks. | **High** (conditional) |
| KJ-7 | LLMs are the **amplifier** in this scenario. Leaked source code is a top-tier input for mass-producing app-mimicking malware and phishing in seconds, and is especially useful to LLM-leveraging DPRK-linked groups such as Lazarus and Kimsuky. | **Medium** (conditional) |
| KJ-8 | Even if the target is confirmed as ZigZag, a claim circulated under the Kakao brand functions as a **brand and trust risk for the entire Kakao Group**. For a commerce operator like ZigZag, a trust hit is unavoidable regardless of authenticity. | **Medium**           |

---

## 2. Framing — Not "What's Being Sold" but "What's at Stake"

Ninety percent of dark-web listings are fraudulent noise: extortion, exaggeration, resale, impersonation. So the first step of analysis is always the same — start by not believing it. Yet the *nature* of the goods is worth examining independently of authenticity, because the stakes of this particular claim belong to a different category than the personal-data breaches that shook Korea over the past two months.

In June 2026, TVING lost the personal data of 5 million paying subscribers along with CI — an immutable, permanent identifier. Days later, CU convenience-store parcel service (BGF Networks) was hit through a web vulnerability, spilling IDs, passwords, names, addresses, phone numbers, and CI. Both were serious; both were problems of *leaked data*. The victims were identifiable, and the ceiling of harm could be approximated by the number of leaked records.

This Kakao/ZigZag claim is different in kind. The seller offers not personal data but **source code, internal-network access, and database access**. If true, what leaked is not "someone's data" but "the blueprints and keys that protected that data." A data leak creates victims. A code/infrastructure leak creates attack infrastructure. The former's harm is largely fixed at the moment of the leak; the latter's harm keeps regenerating for as long as that code runs and those keys remain valid.

So this report asks two questions, in order:

- **First, is the claim real? (And who was it aimed at in the first place?)**
- **Second, if real, why is it scarier than TVING and CU?**

The answer to the first is "not yet — and even the details of the offered proof don't line up." The answer to the second is "because it's a different category."

---

## 3. The Claim — Anatomy of the Listing

### 3.1 Threat Actor

The seller uses the alias **"ExtortionLord."** The handle itself advertises the business model — *extortion*. On reputation-driven dark-web forums, such a name is both a declaration ("I extort") and a signal that muddies the credibility of the sale. Extortion-type actors have a structural incentive to overstate their access.

### 3.2 Goods Offered

| Item                        | Seller's Claim                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Full source code            | "Full KakaoTalk source code"                                                               |
| Internal network access     | "Internal network access"                                                                  |
| Company database access     | "Access to company databases"                                                              |
| Large internal repositories | A repository collection spanning mobile apps, backend services, APIs, infrastructure, AI projects, payment systems, authentication, logistics, and dev tools |

### 3.3 Purported Evidence

As proof of access, the seller published what appears to be a list of directory/repository names resembling internal project names. This list is the single most important clue in this report — covered in Section 4.

### 3.4 Transaction Terms

Price is stated as **negotiable**, with the deal to proceed through the forum's **escrow service**. The escrow mention is a trust-theater device; it does not, by itself, guarantee that the data is real.

---

## 4. The Real Target — Title Says KakaoTalk, Fingerprints Say ZigZag

Before authenticity, the core issue of this case is the identity of the target. The listing title points to "Kakao Talk" — the national messenger, a service used by virtually the entire population, a name with maximal attention and extortion value. But the repository names the seller offered as evidence contain numerous references to `zigzag` and `ks` (Kakao Style).

A naming convention is an organization's fingerprint. Repo names aren't dressed up like marketing copy; they reveal the actual ownership of internal projects. The repeated `zigzag`·`ks` prefixes strongly suggest this code/access came not from Kakao's messenger but from **ZigZag, the fashion e-commerce platform operated by Kakao Style.** Public security analysis (Brinztech, 2026-07-05) reached the same conclusion — the title references KakaoTalk, but the technical indicators provided (repository naming conventions) suggest the target is specifically the ZigZag platform.

**Why lead with the KakaoTalk name? Three hypotheses.**

- **Maximizing extortion value (leading hypothesis).** "KakaoTalk source code" makes a headline in a way "ZigZag source code" does not, and a headline makes extortion leverage. The national messenger's name is a brand premium that drives up the asking price.
- **Actor's own misattribution.** Since Kakao Style is a Kakao Group affiliate, the actor may have loosely lumped the target under "Kakao."
- **Recycling past history.** ZigZag has a 2023 incident in which customer data was exposed via an "infrastructure error." Firms with a breach history are easy to impersonate/resell against because the "already been breached" fear is easy to trigger — a convenient backdrop for dressing up stale access or a fabricated list as a "new breach."

All three hypotheses point to the likelihood that the actor deliberately hung a bigger, more recognizable name than the actual target. The misattribution both lowers the listing's credibility and shifts the burden of explanation onto Kakao proper — a double effect.

---

## 5. Credibility Assessment — Why We Can't Trust It Yet

### 5.1 What Is Confirmed So Far

| Item                                  | Status                          |
| ------------------------------------- | ------------------------------- |
| Official statement (Kakao/Kakao Style)| None (unconfirmed)              |
| Independent verification              | None                            |
| Actual data sample published          | None (file list only)           |
| Target confirmed                      | Unconfirmed (fingerprints → ZigZag) |

As of 2026-07-08, **no independent evidence exists to confirm the claim.** What the seller published is not a data sample but a "file list," and a list is not proof of access — it is merely text asserting access.

### 5.2 Why Caution Is Warranted — The Structure of Large Code "Leak" Claims

Brinztech's analysis recommends caution for three reasons.

- **Frequent fabrication/exaggeration.** Large source-code "leak" claims are often fabricated or inflated by actors seeking reputation or extortion leverage.
- **Surface collection, not deep intrusion.** More commonly than deep internal-network access, these are files scraped from public or improperly protected repositories. A single misexposed GitHub repo can be repackaged as "the full source code."
- **History that invites impersonation.** Firms with a prior incident, like ZigZag, are easy targets for actors seeking to capitalize on existing fear through "impersonation." The access being sold may no longer exist, or may have been fabricated in the first place.

In short, the existence of a file list is not proof of compromise. The minimum bar for verification is a **reproducible data sample** and **independent cross-confirmation** — both absent right now. Hence the conservative posture.

### 5.3 Actor-Engagement Principle

> **Kakao / Kakao Style and related organizations should not make contact with the seller.** Engaging "ExtortionLord" signals validation of the claim and typically leads to further extortion or double-extortion scenarios.

---

## 6. Blast Radius If True — Why It Exceeds TVING and CU

> *This section is a conditional assessment for the case "if the claim is confirmed true." Until verified, all of Section 6 is explicitly scenario analysis.*

### 6.1 Source-Code Leak — The Blueprints Change Hands

A source-code leak is categorically more dangerous than a standard data breach, for three reasons.

- **Zero-day discovery.** An attacker can statically audit the code to find undiscovered vulnerabilities. An attacker who reads the code before the defender pre-empts the unpatched holes.
- **Hardcoded credential exposure.** DB passwords, API keys, SSL keys, and tokens embedded in the code go over as-is. As the TVING case showed, a *single* hardcoded cloud credential became the gateway into the personal-data DB. When the entire source code leaks, the attacker knows how many such gateways exist before the defender does.
- **Business-logic mapping.** Authentication flows, payment validation, permission schemes, fraud-detection logic — once the platform's proprietary defensive design is exposed, evasion and targeted attacks become far more precise.

### 6.2 Internal-Network Access Leak — The Keys Change Hands

- **Supply-chain attack.** Access to internal dev environments and CI/CD pipelines leads to malicious code injection. A poisoned build masquerades as a legitimate update and is distributed to every user's device. This is a weapon aimed not at a single org but at the entire user base that trusted the service.
- **Follow-on intrusion.** Internal-network access is a foothold for lateral movement into connected services and accounts. If inter-affiliate trust boundaries are loose, a theoretical path opens for an intrusion starting at ZigZag to spread to other Kakao Group services.
- **Trade-secret / IP infringement.** Leakage of proprietary algorithms, recommendation engines, and logistics-optimization logic is both a competitive loss and raw material for cloning and resale.

### 6.3 Impact on Users

- Sophisticated malware/phishing built from the leaked code (mimicking the legitimate app's UI and protocols exactly)
- If payment/auth repositories are real, a monetary-harm path via hardcoded payment keys
- Elevated risk of account takeover and impersonation

### 6.4 The LLM Amplifier — Why a Leak Now Is More Dangerous

The decisive reason this scenario is more dangerous than it would have been three or four years ago is **LLMs.**

- **Instant mass-production of sophisticated malware/phishing.** If KakaoTalk source code leaked, the clone-app and phishing-page production that once required a skilled developer's time is automated in an LLM pipeline that takes the leaked code as input. Malware that mimics the legitimate app down to its UI, protocols, and error strings gets stamped out in seconds.
- **Weaponization by DPRK-linked groups.** DPRK-linked threat groups such as Lazarus and Kimsuky have already been publicly reported to be leveraging LLMs for reconnaissance, scripting, and social engineering. Leaked source code hands them a top-tier input — the internal structure of the target app — before the defender, and faster.
- **If ZigZag, the "female-customer DB" specificity.** If the target is ZigZag, the problem moves to another layer. A large share of ZigZag's customer DB is South Korean women. Should that DB leak, TVING/CU-level secondary crime (smishing, impersonation, targeted phishing) becomes more precise when combined with gender and consumption-pattern data.
- **For a commerce operator, a hit regardless of authenticity.** In any scenario, for ZigZag as a shopping/commerce operator, this event is a major brand and trust hit — regardless of whether it's true. Commerce's asset is ultimately customer trust, and a repeated "already been breached" narrative drives churn on its own.

---

## 7. Three-Breach Severity Comparison — Data Leak vs. Code/Infra Leak

Placing Korea's three major B2C breaches since June 2026 side by side reveals why this claim is categorically heavier. (The Kakao/ZigZag column is a conditional assessment based on the unverified claim.)

| Dimension            | TVING (2026-06)                    | CU POST / BGF Networks (2026-06)      | Kakao/ZigZag claim (2026-07, **unverified**)     |
| -------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Leak/sale nature     | Personal-data DB (leak confirmed)  | Personal-data DB (leak confirmed)     | **Source code · internal access · DB** (sale claim) |
| Core asset           | CI·DI·phone·email·account·password | CI·ID·password·address·phone·email    | **Code · credentials · infra access · business logic** |
| Who is harmed        | Leaked individuals (~5M paid subs) | Leaked CU POST online members         | **The service running the code + its entire user base** |
| Ceiling of harm      | Approximated by record count       | Approximated by record count          | **Hard to define — driven by capacity to generate follow-on attacks** |
| Intrusion vector     | Hardcoded AWS key on GitHub (est.) | Web vulnerability (company notice)    | Undisclosed (file list only)                     |
| Secondary-harm types | Smishing·phishing·credential stuffing | Credential stuffing·smishing       | **Supply-chain poisoning · zero-day · follow-on intrusion · LLM malware** |
| Time axis            | Largely fixed at moment of leak    | Largely fixed at moment of leak       | **Keeps regenerating while code/keys stay valid** |
| Verification status  | Confirmed (KISA report, press)     | Confirmed (company notice, press)     | **Unverified** (no official statement)           |

The key is the last three rows. The harm from TVING/CU is capped at the top by the volume of leaked data — at worst, "secondary harm to N leaked individuals." A code/infra leak, by contrast, has its ceiling set not by data volume but by the number of follow-on attacks that code can produce. One hardcoded key is one intrusion gateway; one zero-day is one mass attack; one poisoned build is a whole-user-base distribution. **A data leak creates victims; a code/infra leak creates attack infrastructure** — that, if true, is why this event categorically exceeds TVING and CU.

That said, this exceedance is **conditional.** With authenticity unconfirmed, the actual severity sits on a wide spectrum ranging from **"extortion marketing that repackages a possible ZigZag source leak as a KakaoTalk source-code leak"** to "a categorically worst-case compromise."

---

## 8. Korean Context — The Next Stage of the B2C Breach Chain

- **A shift in the chain's character.** The H1-2026 B2C breach chain — Coupang → TVING → CU — was entirely about "personal data." This claim foreshadows that the chain could escalate into the higher category of "code and infrastructure." Regardless of reality, it should be read as a signal that threat actors are experimenting with higher-stakes sale narratives against Korean B2C firms.
- **The brand risk of misattribution.** Even if the target is confirmed as ZigZag, a claim circulated under the "KakaoTalk" name functions as a trust risk for the entire Kakao Group. The structure by which an affiliate's incident is transferred to the parent brand is a shared vulnerability of Korea's large conglomerate groups.
- **Secret management as a recurring variable.** The "hardcoded credentials on GitHub" problem seen in the TVING case overlaps with this claim's backdrop narrative (collection from public/poorly protected repos). Secret exposure in code repositories is a repeated failure point for Korean firms and should trigger industry-wide secret-scanning reviews — independent of whether the source-code sale claim is real.
- **Regulatory / investigative issues.** If a real leak is confirmed, it entangles not only PIPA's safeguard obligations but a separate response framework for code/infra leaks (trade secrets, critical-information-infrastructure protection). Korea's current personal-data-centric regulation does not fully capture the category of "code and key" leakage.

---

## 9. Detection, Mitigation, and Response Recommendations

### Kakao / Kakao Style and Similar Target Firms

1. **Full audit of repository exposure.** Immediately check whether source code, IaC, and CI/CD pipelines are exposed to the public internet. Enforce strict ACLs and MFA across developer and CI/CD tooling.
2. **Assume secrets are already public.** Wholesale revoke and rotate DB passwords, API keys, and SSL keys hardcoded in code. Default to STS short-lived credentials / IAM roles instead of long-lived access keys, and enforce secret scanning (GitHub secret scanning, pre-commit hooks, truffleHog-class tools) across all repositories.
3. **Zero-trust segmentation.** Do not rely on perimeter defense alone. Strictly segment internal dev tools and production DBs, and require authentication per session (NIST SP 800-207).
4. **No contact with the extortion actor.** Do not engage the seller. Contact validates the claim and invites double-extortion.
5. **Supply-chain integrity verification.** Block CI/CD-poisoning potential with build reproducibility, signing, and an artifact-integrity regime based on SLSA/SSDF (SP 800-218).

### Regulation / Policy

6. **Establish a code/infra-leak response framework.** Create separate reporting and response standards for "source code, credentials, internal-network access" leaks that personal-data-centric regulation fails to capture.

### Users

7. **Act now.** Change passwords on any service where you reuse your ZigZag/Kakao password, and enable two-factor authentication.
8. **Stay vigilant.** Beware malware/phishing that precisely mimics legitimate apps. Block install files from outside official stores and links of unknown origin by default.
9. **Watch for phishing/smishing.** Whether or not the code-leak claim is true, such events typically accompany impersonation phishing campaigns. Treat targeted phishing that knows your personal details accurately as the default assumption.

---

## 10. Conclusion

A dark-web listing must be interrogated on two fronts at once: **Is it real? And what was it aimed at in the first place?** This Kakao/ZigZag claim wobbles on both. Authenticity is unverified, and the title ("KakaoTalk") and the signature point to ZigZag — a women-oriented commerce platform.

For now, the most probable reading is extortion marketing that fronts the national messenger's name while actually targeting ZigZag. And even that cannot be ruled out as fabrication, exaggeration, or impersonation.

Yet the nature of the stakes is worth recording independent of authenticity. Where June 2026's TVING and CU were events of "leaked data," this claim foreshadows an event of "leaked code and keys." If confirmed true, it exceeds TVING and CU not quantitatively but categorically — because the harm of a data leak is largely fixed at the moment of the leak, while the harm of a code/infra leak keeps regenerating for as long as that code runs and those keys stay valid. And LLMs raise that regeneration speed one more notch.

> **A data leak creates victims; a code/infrastructure leak creates attack infrastructure.** So the question that remains for every company is this: Where is your source code right now? Are the keys embedded in it still valid? And when someone offers to sell it under the name "the source code of a national service," can you prove it isn't yours?

Until it is verified, the most honest state of this case is a question mark. This report keeps that question mark honest — while measuring, in advance, the weight of the case if it turns out to be true.

---

## 11. References

1. Dark-web forum listing — "ExtortionLord," claim to sell KakaoTalk source code / internal access / DB (early July 2026, spread via X and other security channels). *(Primary claim, unverified)*
2. Brinztech — "Analysis of Unverified 'Kakao Style/ZigZag' Breach Claim" (2026-07-05). Identifies ZigZag as the target, analyzes repo naming convention, rules it unverified.
3. CTI-2026-0604-TVING — "5 Million Leaked, 130K Notified" (Dennis Kim). TVING personal-data/CI leak; hardcoded AWS key on GitHub as the intrusion vector.
4. News1 [Exclusive] — TVING's KISA filing cites "unauthorized access and query execution"; AWS key revoked and GitHub credentials rotated (2026-06-05).
5. BGF Networks CU POST notice — Personal-data breach advisory (2026-06-05/06). ID, password, name, DOB, gender, address, email, phone, CI leaked; via web vulnerability.
6. The Scoop — "IDs Nearly All Identical… The Chained Threat Hidden in the CU Hack" (analysis of credential stuffing / CI risk).
7. Microsoft / OpenAI — Public disclosure of state-linked threat actors' use of LLMs (including DPRK-linked groups such as Lazarus and Kimsuky, 2024). *(Basis for LLM-weaponization context)*
8. Namuwiki — "Personal Information Leak Incidents" (2026 leak list) / "TVING Personal Information Leak Incident" (for timeline cross-checking; unofficial source).
9. NIST SP 800-207 Zero Trust Architecture · SP 800-218 SSDF · SLSA Framework.
10. Korea's Personal Information Protection Act (PIPA) Article 34 and its Enforcement Decree (breach-notification requirements).

---

**© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division** · <gameworker@gmail.com> · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*This report is an independent analysis based on public OSINT, the dark-web listing, and public security analysis; it does not represent the official position of any organization, agency, or company. The sale claim it examines is unverified as of the publication date (2026-07-08), and its truth can be confirmed only by an official Kakao / Kakao Style statement or independent verification. Use only for educational, defensive, research, and policy purposes. TLP:GREEN — may be shared within the community and disclosed publicly.*
