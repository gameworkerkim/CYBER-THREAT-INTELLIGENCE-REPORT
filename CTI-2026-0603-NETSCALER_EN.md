| id             | CTI-2026-0603-NETSCALER                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| title          | The Third Shadow of CitrixBleed — Large-Scale Exploitation of a NetScaler Memory Overread Reignites       |
| subtitle       | CVE-2026-3055: a March-disclosed SAML IdP information-disclosure flaw escalates in June — the gap between the "RCE" label and the real impact |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                           |
| email          | <gameworker@gmail.com>                                                                                   |
| github         | gameworkerkim                                                                                            |
| date           | 2026-06-03                                                                                               |
| classification | TLP:GREEN                                                                                                 |
| severity       | CRITICAL                                                                                                 |
| lang           | en                                                                                                       |
| tags           | Edge-Device · Pre-Auth · Memory-Overread · Session-Hijack · SAML-SSO · CitrixBleed · CISA-KEV            |
| threat\_actors | Unattributed (likely a mix of ransomware and state-sponsored actors)                                     |
| cve            | CVE-2026-3055 (CVSS 9.3 v4.0 · CISA KEV) · related CVE-2026-4368 (CVSS 7.7)                              |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · NIST SP 800-207 (Zero Trust) · CISA KEV · STIX/TAXII                     |
| license        | CC BY-NC-SA 4.0                                                                                          |

> ## 🚨 Heads-up: this is a VPN/remote-access issue — check your company's appliances now.
> If your organization runs **Citrix NetScaler Gateway** (the VPN / remote-access front door) or **NetScaler ADC** with **SAML SSO** enabled, you may be directly exposed to active, large-scale exploitation. Don't wait for a formal advisory to land in your inbox — **inventory your internet-facing NetScaler appliances today**, confirm patch level, and (critically) **invalidate active sessions after patching**. The details below explain why patching alone is not enough.

# The Third Shadow of CitrixBleed — Large-Scale Exploitation of a NetScaler Memory Overread Reignites

> **Report ID** `CTI-2026-0603-NETSCALER` · **Published** 2026-06-03 · **Classification** `TLP:GREEN` · **Severity** 🔴 CRITICAL
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*CVE-2026-3055: a March-disclosed SAML IdP information-disclosure flaw escalates in June — the gap between the "RCE" label and the real impact*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Opening — "An edge device, once it leaks, keeps leaking"
3. Vulnerability Analysis — CVE-2026-3055 Memory Overread
4. "RCE" or "Information Disclosure"? — Decomposing the Real Impact
5. Timeline — From March Disclosure to June Mass Exploitation
6. Attack Scenario — From Token Theft to SSO/VPN Takeover
7. Korea Perspective — The Edge-Gateway Exposure
8. Detection & Mitigation — Patching Is Not the End
9. Conclusion
10. References

---

## Executive Summary (TL;DR)

A pre-authentication memory overread vulnerability in Citrix NetScaler ADC/Gateway, `CVE-2026-3055`, has entered large-scale active exploitation in early June 2026. Fortinet's threat intelligence team confirmed that attack attempts targeting internet-facing NetScaler SAML endpoints worldwide are being detected and blocked at a rate of **thousands per day**.

Two points matter most. **First, this is not a new 0-day.** Citrix already disclosed and patched it on **March 23** (advisory CTX696300); reconnaissance and exploitation began in late March, and it was added to the CISA KEV catalog. The June event is not "a new vulnerability emerging" — it is **exploitation scaling to an industrial level against unpatched assets**. **Second, the impact label diverges across sources.** Some threat feeds tag this as "RCE (CVSS 9.8)," but primary sources — Citrix, Rapid7, Horizon3 — characterize it as **information disclosure via a memory overread (CVSS 9.3, CVSS v4.0)**. This report makes that distinction its central analytical axis: the precise impact is *leakage of session tokens and credentials from process memory*, which maps directly to **CitrixBleed-class (CVE-2023-4966) session hijacking**.

Why does the distinction decide everything in practice? Because the remediation procedure changes. An information-disclosure flaw **does not end with a patch.** Session tokens that leaked from memory *before* patching remain valid *after* patching — so, exactly as CitrixBleed taught, **forced invalidation of active sessions** is a mandatory step on par with the patch itself.

> ⚠️ **Verify KISA/KrCERT advisory status** — This report is compiled from global sources (Citrix, CISA KEV, Fortinet, Rapid7). There may be a gap relative to when Korean national advisories are published or updated; cross-check against KISA bulletins before operational application.

### Key Judgments

| #    | Judgment                                                                                                                                          | Confidence      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | The June event around `CVE-2026-3055` is not a new vulnerability but a **large-scale escalation** of the March disclosure. Fortinet confirms attacks at a scale of thousands per day. | **High**        |
| KJ-2 | Per primary sources, the precise impact is **information disclosure via memory overread** (CWE-125); the "RCE" tag in some feeds is likely an overstatement. The real threat is leakage of session tokens and credentials. | **Medium-High** |
| KJ-3 | Leaked session tokens remain valid after patching. Therefore **patch + full active-session invalidation** must go together. Organizations that only patched remain exposed to hijacking (the direct lesson of CitrixBleed). | **High**        |
| KJ-4 | NetScaler terminates SSO as a SAML IdP. Compromising the IdP collapses the entire SSO trust chain, so a single point of failure fans out into access across many backend applications. | **High**        |
| KJ-5 | Historically (CitrixBleed, CVE-2023-3519), NetScaler flaws have been weaponized within days by both ransomware and state-sponsored actors. Internet-facing NetScaler appliances at Korean financial firms, large enterprises, and the public sector are immediate inspection targets. | **Medium-High** |

---

## 1. Opening — "An edge device, once it leaks, keeps leaking"

A remote-access gateway is one of the most valuable targets an attacker can find, because a single appliance simultaneously underpins VPN termination, load balancing, and SAML-based SSO. When the perimeter point where authentication traffic converges is breached, the attacker gains a pass to the entire line of internal applications standing behind it.

NetScaler's track record has proven this proposition repeatedly. In 2023, CitrixBleed (`CVE-2023-4966`) and `CVE-2023-3519` were weaponized **within days** of disclosure and used in ransomware and data-theft campaigns against thousands of organizations worldwide. What both incidents shared was that "something leaks out of memory" — CitrixBleed leaked session tokens, and the stolen tokens bypassed MFA to hijack sessions.

`CVE-2026-3055` is the continuation of that lineage. It was disclosed in March, complete with a patch, yet by June exploitation against unpatched assets had scaled to industrial proportions. This report separates two things: first, **what actually leaks** (a precise decomposition of impact); second, **why patching alone is insufficient** (the persistence of leaked tokens).

---

## 2. Vulnerability Analysis — CVE-2026-3055 Memory Overread

| Item            | Value                                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| CVE             | `CVE-2026-3055`                                                                    |
| CVSS            | 9.3 (Critical, CVSS v4.0 · per Citrix/Rapid7) — some feeds list 9.8                |
| CWE             | CWE-125 (Out-of-Bounds Read · memory overread)                                     |
| Root cause      | Insufficient input validation                                                      |
| Precondition    | Only when NetScaler ADC/Gateway is configured as a **SAML Identity Provider (IdP)** |
| Authentication  | None (pre-auth) · no user interaction                                              |
| Affected builds | Below 13.1-62.23 (standard), below 13.1-37.262 (FIPS/NDcPP), below 14.1-60.58 (standard) |
| Discovery       | Found internally by Citrix                                                          |
| Related flaw    | `CVE-2026-4368` (CVSS 7.7, race condition → session mix-up), fixed in the same advisory CTX696300 |
| Status          | Added to CISA KEV · 2026-06 large-scale exploitation confirmed by Fortinet          |

When NetScaler operates as a SAML IdP, an attacker sends a specially crafted SAML-related request to trigger a memory overread (a read beyond the boundary). No authentication, login, or user interaction is required. Through this read, the attacker can extract **sensitive information** such as session data and other credentials from the appliance's process memory. A key constraint is configuration dependence — **default configurations are unaffected; only systems set up as a SAML IdP are vulnerable.** That said, SAML IdP configuration is very common in organizations running SSO, so "default configurations are safe" does not translate to "most deployments are safe." Whether SAML IdP is in use must be confirmed explicitly, as it may be enabled inadvertently.

---

## 3. "RCE" or "Information Disclosure"? — Decomposing the Real Impact

This is the point this report stresses most. The label for the same CVE diverges between sources.

| Source family                                                            | Impact label                            | CVSS         |
| ------------------------------------------------------------------------ | --------------------------------------- | ------------ |
| Citrix (CTX696300) · Rapid7 · Horizon3 · Arctic Wolf · Security Affairs   | **Memory overread → information disclosure** | 9.3 (v4.0)   |
| Some threat-intel feeds                                                  | "Remote Code Execution (RCE)"           | 9.8 (varies) |

Analytically, the primary vendor technical description (Citrix) and the major vulnerability research labs (Rapid7, Horizon3) are more reliable. They consistently describe this as **information disclosure via an out-of-bounds read.** The "RCE" tag appears to have propagated together with (1) some aggregators scoring the CVSS at 9.8, and (2) a worst-case over-generalization driven by the appliance's perimeter location.

So is it "information disclosure, therefore lighter than RCE"? **No.** The real threat of this flaw is not direct code execution but the **leakage of session tokens and credentials** from process memory — precisely the way CitrixBleed operated. Leaked session tokens are used to bypass authentication and MFA and to **hijack valid sessions**, and from there the pivot into the SSO trust chain and the internal network begins. In other words, the impact *type* is not "RCE" but "**credential/session leakage → identity theft**," and getting this classification right determines the remediation procedure in the next section (patching alone is insufficient; session invalidation is mandatory).

> Practical implication: misclassifying the *type* of a CVE's impact derails the response. Seen as "RCE," it is easy to assume "patch and you're done"; seen accurately as "information disclosure (token leakage)," it becomes self-evident that the leaked tokens persisting after the patch must be invalidated.

---

## 4. Timeline — From March Disclosure to June Mass Exploitation

| Date           | Event                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| 2026-03-23     | Citrix publishes CTX696300, releasing patches for `CVE-2026-3055` and `CVE-2026-4368` |
| 2026-03-27     | Researchers observe active reconnaissance against vulnerable NetScaler instances |
| 2026-03-30     | Public reporting confirms active exploitation has begun                        |
| ~2026-03-31    | CISA adds the flaw to the KEV catalog                                          |
| 2026-06-02     | **Fortinet confirms large-scale active exploitation** — thousands of daily attacks against exposed SAML endpoints detected and blocked |

This curve is the essence of the incident: disclosure/patch (March) → reconnaissance (late March) → initial exploitation (late March onward) → **large-scale escalation (June)**. Two months after the patch shipped, the population of unpatched assets remained large enough that attackers shifted to mass automated scanning and exploitation. The gap between "a patch is available" and "the organization has patched" remained, intact, as the attack surface.

---

## 5. Attack Scenario — From Token Theft to SSO/VPN Takeover

Projecting the CitrixBleed pattern onto this case yields the following chain.

1. **Pre-auth memory leak** — Send a crafted request to an exposed SAML IdP endpoint to extract session tokens and credentials from process memory. (ATT&CK **T1190**)
2. **Session hijacking** — Use the stolen session token to bypass authentication and MFA and seize a valid session. (**T1539** Steal Web Session Cookie, **T1550.004** Use Alternate Authentication Material)
3. **Collapse of SSO trust** — Because NetScaler is the SAML IdP, compromising the IdP means the collapse of the identity assurance it provided to many backend applications. It expands via SAML assertion manipulation and abuse of IdP-initiated logins. (**T1078** Valid Accounts)
4. **Persistence & pivot** — Persist perimeter VPN access and move into the internal network. (**T1133** External Remote Services, followed by lateral movement)

In this chain, NetScaler functions as a single point of failure: a memory leak at one perimeter device spreads into the entire SSO trust and access to internal resources. Historically, this surface has been among the most aggressively targeted by **both ransomware groups and state-sponsored espionage actors**.

---

## 6. Korea Perspective — The Edge-Gateway Exposure

- **Remote access at financial firms and large enterprises** — A significant share of Korean financial institutions and large enterprises run NetScaler as their VPN-termination, application-delivery, and SSO gateway. These appliances are, by definition, internet-facing, so when configured as a SAML IdP they become a direct target surface for this flaw.
- **Concentration risk of SSO trust** — A SAML IdP consolidates authentication for many in-house systems in one place. The price of that convenience is that a memory leak in a single IdP translates directly into the collapse of identity assurance for many business systems.
- **The patch-lag population** — The very fact that large-scale exploitation succeeded in June despite a March patch shows that — globally and domestically alike — edge-device patch adoption rates do not keep pace with threat velocity. The operational inertia of "it's an appliance, so it's risky to touch" becomes, directly, the exposure window.
- **Regulatory & notification angle** — If session or credential leakage actually occurred, it can lead to a breach of personal or authentication data, so any confirmed indication of compromise should be reviewed alongside the relevant reporting and notification obligations.

---

## 7. Detection & Mitigation — Patching Is Not the End

1. **Patch immediately** — Update NetScaler ADC/Gateway to 13.1-62.23 / 14.1-60.58 (standard) or 13.1-37.262 (FIPS/NDcPP) or later. Verify the applied build via the management interface or CLI.
2. **Invalidate all active sessions (mandatory)** — *After* patching, forcibly terminate all active ICA/PCoIP and authentication sessions. Session tokens that leaked before the patch remain valid afterward, so a patch without session invalidation leaves hijacking exposure intact. (The direct lesson of CitrixBleed.)
3. **Confirm & reduce SAML IdP configuration** — Explicitly confirm whether the appliance is configured as a SAML IdP. If the IdP function is unnecessary, disable it to reduce the attack surface, and check that it is not inadvertently enabled.
4. **Hunt for indicators of compromise** — Using the IoCs published by Fortinet, examine logs for abnormal SAML assertion activity, unexpected IdP-initiated logins, and connections from unrecognized IP ranges. Include retrospective review of the exposure window prior to patching.
5. **Rotate credentials** — If compromise is suspected, rotate sessions and credentials that may have transited the appliance, and review backend applications for anomalous authentication.
6. **Maintain a standing edge-asset inventory** — Inventory all internet-facing NetScaler appliances, and for KEV-listed edge devices, fix "patch, then invalidate sessions" as a standard runbook.

---

## 8. Conclusion

`CVE-2026-3055` teaches two things at once. First, **the clock of a threat stops not on the disclosure date but on the patch-application date.** Even with a patch available in March, assets that did not apply it stood fully exposed before the large-scale exploitation of June. Second, **the precise classification of impact type determines the response.** Lean on the overblown "RCE" label and you mistake the situation for "patch and you're done"; see accurately that the essence is *session-token leakage* and post-patch session invalidation becomes a self-evidently mandatory step.

This is another facet of the thesis from the previous report (`CTI-2026-0602-FAULTLINE`) — *that vendor and aggregator labels fail to predict real risk.* There, "exploitation less likely" detonated first; here, the difference between "RCE" and "information disclosure" decides the remediation procedure. The baseline for edge-device defense is simple: *a patch only closes the entrance; it cannot recover what has already leaked out.* Patch and session invalidation are therefore an inseparable pair.

---

## 9. References

[1] Citrix, "NetScaler ADC and NetScaler Gateway Security Bulletin for CVE-2026-3055 and CVE-2026-4368 (CTX696300)", 2026-03-23. <https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX696300>

[2] Threat-Modeling.com, "Citrix NetScaler SAML IDP Vulnerability (CVE-2026-3055): Large-Scale Exploitation Confirmed by Fortinet", 2026-06-02. <https://threat-modeling.com/citrix-netscaler-saml-idp-cve-2026-3055/>

[3] FortiGuard Labs, "FortiGuard Outbreak Alert: Citrix NetScaler Memory Overread Vulnerability (CVE-2026-3055)", 2026-06. <https://video.fortinet.com/latest/fortiguard-outbreak-alert-short-citrix-netscaler-memory-overread-vulnerability>

[4] Horizon3.ai, "CVE-2026-3055 Citrix NetScaler Memory Overread", 2026-03-31. <https://horizon3.ai/attack-research/vulnerabilities/cve-2026-3055/>

[5] Pierluigi Paganini, "U.S. CISA adds a flaw in Citrix NetScaler to its Known Exploited Vulnerabilities catalog", Security Affairs, 2026-03-31. <https://securityaffairs.com/190197/security/u-s-cisa-adds-a-flaw-in-citrix-netscaler-to-its-known-exploited-vulnerabilities-catalog.html>

[6] Pierluigi Paganini, "Citrix NetScaler critical flaw could leak data, update now", Security Affairs, 2026-03-24. <https://securityaffairs.com/189908/security/citrix-netscaler-critical-flaw-could-leak-data-update-now.html>

[7] Arctic Wolf, "CVE-2026-3055: Citrix NetScaler ADC and NetScaler Gateway Out-of-Bounds Read", 2026-03-23. <https://arcticwolf.com/resources/blog/cve-2026-3055/>

[8] CERT-EU, "Security Advisory 2026-003: Multiple Vulnerabilities in Citrix NetScaler and Citrix ADC", 2026. <https://cert.europa.eu/publications/security-advisories/2026>

[9] CISA, "Known Exploited Vulnerabilities Catalog — CVE-2026-3055". <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
