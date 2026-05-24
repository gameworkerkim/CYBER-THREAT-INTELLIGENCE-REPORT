# Two Concurrent Threats: Hosting Infrastructure Takeover and a Self-Propagating Supply-Chain Worm

> **LiteSpeed cPanel Plugin CVSS 10.0 RCE (CVE-2026-48172) · Mini Shai-Hulud npm Worm — New Waves (TeamPCP)**
> *Active exploitation underway · Direct exposure for the Korean hosting & developer ecosystem · OSINT-based defensive analysis*

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0524-DUALTHREAT` |
| **Published** | 2026-05-24 (KST) |
| **Classification (TLP)** | 🟢 TLP:GREEN — Freely shareable within the community (attribution required) |
| **Severity** | 🔴 **CRITICAL** — Active exploitation + self-propagating worm (immediate response) |
| **Threats Covered** | ① CVE-2026-48172 (LiteSpeed User-End cPanel Plugin, CVSS 10.0)<br>② Mini Shai-Hulud npm worm — two new May waves (TeamPCP) |
| **Threat Actor** | TeamPCP (aliases: DeadCatx3 · PCPcat · ShellForce · CipherForce) / threat ② only |
| **Frameworks** | MITRE ATT&CK · NIST SP 800-61 · NIST SP 800-207 (Zero Trust) |
| **Author** | Dennis Kim · Independent Threat Intelligence Analyst · gameworker@gmail.com |

---

## Executive Summary

In May 2026, two high-risk threats — superficially unrelated but sharing the same structural lesson — became simultaneously active. Both abuse a **"trusted default privilege"** and **"trusted automation pipeline,"** which the attacker legitimately hijacks to escalate privileges, and both create direct exposure for Korea's web-hosting industry and developer ecosystem.

- **Threat ① — LiteSpeed cPanel Plugin RCE (CVE-2026-48172, CVSS 10.0):** On shared hosting, any cPanel user (including an attacker or a compromised account) can execute arbitrary scripts as root via a single call to the `lsws.redisAble` JSON-API. No authentication gap or race condition is required, and it is **already being actively exploited in the wild.**
- **Threat ② — Mini Shai-Hulud npm Worm New Waves (TeamPCP):** Of the two new May waves, one used a **credential-free initial access** technique, while the other set the **highest single-hour package-creation count** of any Shai-Hulud worm to date. April's impersonating package `@bitwarden/cli 2026.4.0` steals cloud, CI/CD, and developer-workstation credentials on install and self-propagates to every npm package the victim can publish.
- **Common lesson:** Both incidents abuse "legitimately granted privilege/trust" rather than "a stolen password." Credential rotation alone is therefore insufficient; least-privilege (Zero Trust) and trust-boundary redesign are the core countermeasures.

---

## Key Judgments

| # | Judgment | Confidence |
| --- | --- | --- |
| **KJ-1** | CVE-2026-48172 is an Incorrect Privilege Assignment flaw. In shared-hosting environments, a single malicious or compromised tenant can pivot directly to full server (root) takeover. Active exploitation has been confirmed by the vendor. | **High** |
| **KJ-2** | Korea has many SMB web hosts and resellers running the cPanel/WHM + LiteSpeed combination. Given the structural nature of shared hosting (hundreds of tenants per server), domestic exposure is likely. | **Medium** |
| **KJ-3** | Mini Shai-Hulud's "credential-free initial access" scrapes OIDC tokens directly from runner memory and exchanges them for npm publish rights, so a legitimate release pipeline publishes malicious packages carrying valid SLSA provenance. Provenance alone cannot guarantee safety. | **High** |
| **KJ-4** | A fail-safe that destroys the user's home directory (`rm -rf ~/`) in response to token revocation has been observed. The conventional response of "isolate host, then revoke credentials" can therefore trigger data destruction. | **High** |
| **KJ-5** | Rising copycat activity is reducing the accuracy of future TeamPCP attribution, so defending at the level of "Shai-Hulud-family TTPs" is more robust than assuming a single actor. | **Medium** |

---

## 1. LiteSpeed cPanel Plugin RCE — CVE-2026-48172

### 1.1 Overview

| Field | Value |
| --- | --- |
| **CVE** | `CVE-2026-48172` |
| **CVSS** | **10.0** (CRITICAL · maximum severity) |
| **Vulnerability Type** | Incorrect Privilege Assignment → privilege escalation / root RCE |
| **Affected Product** | LiteSpeed User-End cPanel Plugin. The WHM plugin is not directly affected |
| **Affected Versions** | v2.3 – v2.4.4 (all below v2.4.5) |
| **Fixed Version** | **Fixed in v2.4.5** / recommended minimum v2.4.7 (bundled in WHM Plugin v5.3.1.0) |
| **Exploitation Status** | **Active exploitation confirmed in the wild** (2026-05, 0-day) |
| **Discoverer** | Security researcher David Strydom |

### 1.2 Technical Analysis

The root cause is a logic flaw in the plugin's `lsws.redisAble` JSON-API endpoint. By default this endpoint is **exposed to every logged-in cPanel user**, making the attack surface extremely broad.

- No authentication gap or race condition is required. With a valid cPanel session, a single malformed API call with specific parameter values is sufficient to escalate to root.
- The core defect is mishandling of the Redis enable/disable feature, where user input flows unchecked into an elevated-privilege context.
- It is especially catastrophic on shared hosting — hundreds of tenants on a single server already hold valid cPanel sessions, so one malicious tenant or one already-compromised account can pivot to a full server takeover.

### 1.3 Impact Assessment

| Dimension | Impact |
| --- | --- |
| **Confidentiality** | Exposure of files, databases, and key material for every tenant on the same server (root access) |
| **Integrity** | Web shell / backdoor / cryptominer installation, content tampering, supply-chain watering-hole |
| **Availability** | Full server outage, ransom, and log deletion that obstructs incident analysis |
| **Spread** | On reseller / multi-tenant hosting, one server compromise cascades to many customers |

### 1.4 Detection

LiteSpeed's IoC check command. No output means no exploitation; if there is output, validate and block the listed IPs and investigate post-compromise activity.

```bash
grep -rE "cpanel_jsonapi_func=redisAble" /var/cpanel/logs /usr/local/cpanel/logs/ 2>/dev/null
```

### 1.5 Remediation

| Priority | Action |
| --- | --- |
| **1** | Immediately upgrade to LiteSpeed WHM Plugin v5.3.1.0 (bundled with cPanel plugin v2.4.7), which includes additional attack-vector hardening. |
| **2** | If immediate patching is not possible, remove the user-end plugin as a mitigation:<br>`/usr/local/lsws/admin/misc/lscmctl cpanelplugin --uninstall` |
| **3** | Run the grep command in §1.4 to check for exploitation → block suspicious IPs, perform detailed log analysis. |
| **4** | If compromise is suspected, rotate all server passwords, API tokens, and SSH keys, and audit for web shells, cron jobs, and new users. |
| **5** | Review the cumulative May advisories on the same server: pre-auth bypass CVE-2026-41940 (CVSS 9.8) and other clustered cPanel-ecosystem advisories. |

---

## 2. Mini Shai-Hulud npm Worm — New Waves (TeamPCP)

### 2.1 Overview

| Field | Value |
| --- | --- |
| **Campaign** | Mini Shai-Hulud (4th-generation Shai-Hulud-family variant) |
| **Threat Actor** | TeamPCP (aliases DeadCatx3 · PCPcat · ShellForce · CipherForce), financially motivated, active since 2024 |
| **Key Incidents** | `@bitwarden/cli 2026.4.0` impersonating package (April)<br>TanStack OIDC hijacking wave (May 11, CVE-2026-45321)<br>AntV and others — 300+ versions auto-published in 22 minutes on May 19 |
| **Detecting Vendors** | Endor Labs · Wiz · SafeDep · Socket · StepSecurity · Snyk · Unit 42 · Akamai, et al. |
| **Associated CVE** | CVE-2026-45321 (assigned to the TanStack wave only) |

### 2.2 Analysis of the @bitwarden/cli Impersonating Package

A malicious npm package, `@bitwarden/cli 2026.4.0`, impersonating the legitimate Bitwarden CLI password manager (250K+ monthly downloads), was published. On install it runs a multi-stage payload that steals credentials from cloud providers, CI/CD systems, and developer workstations, then backdoors and self-propagates to every npm package the victim can publish.

- Altered execution path → run malicious loader → download and extract a Bun archive from GitHub → execute the JavaScript payload.
- C2 evasion: github.com traffic is typically not flagged by security tools and cannot be traced back to an actor-owned domain. Stolen data is concealed with asymmetric encryption.

### 2.3 Credential-Free Initial Access — A New Technique

Every prior wave began with a "stolen credential" — this new wave did not. The attack flow is as follows.

| Step | Action |
| --- | --- |
| **1** | Abuse of a PR workflow misconfiguration in TanStack's GitHub Actions CI. A fork PR triggered a workflow with write access to the base repository's cache. |
| **2** | Attacker code poisoned the cache and lay dormant (~8 hours). A legitimate maintainer merge triggered the standard release workflow, which loaded the poisoned cache. |
| **3** | The worm scraped OIDC tokens directly from runner memory → obtained publish credentials via the npm token-exchange endpoint. |
| **4** | No npm token was ever "stolen" and the publish workflow itself was not compromised, making the attack invisible and yielding valid SLSA Build Level 3 provenance. (May 11, 19:20–19:26 UTC — 84 malicious versions across 42 @tanstack packages) |

### 2.4 Destructive Fail-Safe (Wiper)

The May 11 payload installs a persistent background daemon (`gh-token-monitor`) that polls `api.github.com/user` every 60 seconds using the stolen GitHub token. If the token is revoked and an **HTTP 40x** is returned, it executes `rm -rf ~/`, destroying the user's home directory. The daemon auto-exits after 24 hours.

> ⚠️ **Response warning:** The conventional first response — "isolate the host, then immediately revoke credentials" — can trigger the wiper. Token revocation and isolation must be carefully staged until you have verified that no destructive fail-safe is armed locally.

### 2.5 MITRE ATT&CK Mapping

| Tactic | Technique (ID) | Application in This Campaign |
| --- | --- | --- |
| Initial Access | Supply Chain Compromise (T1195.002) | Distribution of poisoned npm/PyPI packages |
| Execution | npm preinstall hook / `__init__.py` injection | Automatic payload execution on install |
| Credential Access | Steal Application Access Token (T1528) | Extraction/exchange of OIDC tokens from runner memory |
| Persistence | Scheduled Task/Daemon (T1543) | `gh-token-monitor` (LaunchAgent/systemd) |
| Exfiltration | Exfil over Web Service (T1567) | GitHub dead-drop · Session messenger · typosquat domains |
| Impact | Data Destruction (T1485) | `rm -rf ~/` wiper on token revocation |
| Propagation | Lateral Tool Transfer (worm) | Republishing every package the victim can publish |

### 2.6 Indicators of Compromise (IoC) & Hunting

- Exfil channels / C2: `git-tanstack[.]com` (typosquat), `filev2.getsession.org`, `api.masscan.cloud`, and a `transformers.pyz` dropper hosted on `git-tanstack.com`.
- Exposure window: audit CI runs after `2026-05-11T19:20Z`. Check for unexpected npm publish events and outbound connections to the domains above.
- Use `npm token list` and revoke any unrecognized tokens. However, **valid SLSA provenance is NOT proof of safety** — match against the payload SHA-256 instead.
- Hunt for downstream propagation: if any of your own packages were published from a CI run during the exposure window, those versions may also be poisoned. Hunt your GitHub organization for suspicious repositories and workflow changes.

---

## 3. Korea Perspective & Integrated Recommendations

### 3.1 Korean Ecosystem Exposure

| Target | Exposure Pattern |
| --- | --- |
| **Web Hosts / Resellers** | Many domestic SMB hosts and resellers run cPanel/WHM + LiteSpeed. One shared-server compromise cascades to all tenant customers (threat ①) |
| **Dev Shops / Startups** | Heavy use of npm/PyPI dependencies and GitHub Actions CI/CD. Misconfigured OIDC trust exposes them to the self-propagating worm (threat ②) |
| **Web3 / Fintech** | Frontend and wallet SDKs depend on the npm supply chain. Build-pipeline poisoning translates directly into user-asset risk |
| **Public Sector / Finance** | Indirect supply-chain exposure via outsourced development and package reuse. Monitoring of KISA / FSI advisories is required |

### 3.2 Integrated Priority Recommendations

| # | Action | Target Threat |
| --- | --- | --- |
| **1** | **Immediately upgrade the LiteSpeed cPanel plugin to v2.4.7+, or remove the user-end plugin** | **① Immediate** |
| **2** | grep the redisAble logs and hunt for shared-server compromise | ① 24h |
| **3** | Minimize GitHub Actions OIDC trust scope (limit to workflow/branch); block fork-PR cache writes | ② Zero Trust |
| **4** | Pin dependencies, verify lockfiles, match SHA-256 hashes (do not blindly trust SLSA provenance) | ② Supply Chain |
| **5** | Recognize wiper risk: carefully stage token revocation/isolation; secure backups first | ② IR Process |
| **6** | Treat CI/CD credentials as privileged tokens — scope tightly, rotate regularly, audit-log publish events | ①② Common |

### 3.3 Synthesis — A Shared Structure of "Abuse of Privilege and Trust"

The two threats are superficially unrelated yet share an identical structure. CVE-2026-48172 abuses a "privilege exposed by default to every user," while Mini Shai-Hulud abuses "trust granted to an automation pipeline (OIDC)" — both legitimately. Neither relies on "intrusion" or "password theft" in the traditional sense.

The core of defense therefore lies beyond credential rotation, in redesigning trust boundaries. Least-privilege (NIST SP 800-207 Zero Trust), reduction of default-exposed privileges, explicit scoping of automation trust, and a verification posture that does not equate provenance/signatures with safety are the fundamental responses to both threats.

---

## Appendix A. References

1. **The Hacker News.** *"LiteSpeed cPanel Plugin CVE-2026-48172 Exploited to Run Scripts as Root."* <https://thehackernews.com/2026/05/litespeed-cpanel-plugin-cve-2026-48172.html>
2. **GBHackers.** *"LiteSpeed cPanel Plugin 0-Day Exploited for Server Root Access."* <https://gbhackers.com/litespeed-cpanel-plugin-0-day-exploited/>
3. **Cyber Security News.** *"LiteSpeed cPanel Plugin 0-Day Exploited in the wild."* <https://cybersecuritynews.com/litespeed-cpanel-plugin-0-day-exploited/>
4. **Unit 42 (Palo Alto).** *"The npm Threat Landscape: Attack Surface and Mitigations (Updated May 21)."* <https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/>
5. **Akamai.** *"Mini Shai-Hulud: The Worm Returns and Goes Public."* <https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public>
6. **Wiz.** *"Mini Shai-Hulud Strikes Again: TanStack + more npm Packages Compromised."* <https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised>
7. **StepSecurity.** *"TeamPCP's Mini Shai-Hulud Is Back."* <https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem>
8. **Snyk.** *"TanStack npm Packages Hit by Mini Shai-Hulud."* <https://snyk.io/blog/tanstack-npm-packages-compromised/>
9. **SecurityWeek.** *"Bitwarden NPM Package Hit in Supply Chain Attack."* <https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/>
10. **Tenable.** *"Mini Shai-Hulud Supply Chain Attack CVE-2026-45321 FAQ."* <https://www.tenable.com/blog/mini-shai-hulud-frequently-asked-questions>

---

## Appendix B. Disclaimer

1. This report is an independent analysis based on publicly available OSINT materials and press/vendor security advisories, and does not represent the official position of any referenced organization.
2. The content is intended solely for educational, defensive, research, and policy purposes; use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication (2026-05-24); always re-verify the latest state before operational use.
4. The author assumes no liability for any damages arising from the direct or indirect use of these materials.

---

**© 2026 Dennis Kim** · Cyber Threat Intelligence Division
📧 gameworker@gmail.com · 🔗 <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT>
