| id             | CTI-2026-0728-HANWHA                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| title          | The Admin Key Inside Camera Firmware — Hanwha Vision GitHub Token Exposure and CI Pipeline Collapse             |
| subtitle       | Firmware hidden behind layered encryption is a cardboard box in front of an LLM — a single `process.env` line exposed DoD IPs and an org-wide admin token                |
| author         | Dennis Kim / HoKwang Kim                                                                                        |
| email          | gameworker@gmail.com                                                                                             |
| github         | gameworkerkim                                                                                                    |
| date           | 2026-07-28                                                                                                       |
| updated        | 2026-07-28 (v1.0)                                                                                                |
| classification | TLP:GREEN                                                                                                        |
| severity       | HIGH                                                                                                             |
| lang           | en                                                                                                               |
| tags           | Firmware-Security · Hardcoded-Credentials · Supply-Chain · IoT-CCTV · CI-CD-Leakage · Secret-Scanning · Defense-Industrial-Base |
| threat_actors  | None (responsible disclosure by an independent security researcher; no evidence of active exploitation)                                                                          |
| frameworks     | MITRE ATT&CK · CWE-798 (Hardcoded Credentials) · CWE-312 (Cleartext Storage) · NIST SP 800-53 (SC-28, IA-5)      |
| license        | CC BY-NC-SA 4.0                                                                                                  |

# The Admin Key Inside Camera Firmware — Hanwha Vision GitHub Token Exposure and CI Pipeline Collapse

> **Report ID** `CTI-2026-0728-HANWHA` · **Published** 2026-07-28 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim / HoKwang Kim · gameworker@gmail.com · [@gameworkerkim](https://github.com/gameworkerkim)

*Firmware hidden behind layered encryption is a cardboard box in front of an LLM — a single `process.env` line exposed DoD IPs and an org-wide admin token*

---

## Table of Contents

1. Summary (TL;DR)
2. Key Judgments
3. Introduction — "Obfuscation only ever bought boredom"
4. Incident Timeline
5. Technical Analysis — The Dual Encryption Layer and LLM-Assisted Reversing
6. Root Cause — One Line of `process.env` Etches the Whole CI Environment Into the Build Output
7. MITRE ATT&CK / CWE Mapping
8. Exposed Asset Risk Assessment — The Token and the DoD IPs
9. Full-Fleet Survey Results — ~500 Firmware Images, 3 Identical Tokens
10. Disclosure and Response Assessment — A 12-Hour Turnaround and a Public Correction
11. Korean Perspective — Domestic Defense-Industry Affiliates and CTI Implications
12. Detection, Mitigation, and Response Recommendations
13. Conclusion
14. References

---

## 1. Summary (TL;DR)

On July 24, 2026, a security researcher (blog name hhh.hn, pseudonym Austin) disclosed that after analyzing the network camera firmware of Hanwha Vision (formerly Samsung Techwin), they had found the same **GitHub personal access token** embedded in roughly 30 build artifacts of the camera's web admin UI. That token carried **organization-wide admin privileges over hundreds of repositories** inside Hanwha's GitHub organization. The cause was simple — a Vite configuration used to build the camera admin UI had bound a single build-time variable to the entire `process.env` object, so the whole environment of the CI/CD job (build system addresses, internal infrastructure IPs, and the GitHub token included) was baked verbatim into the client-side build output.

The researcher noted that the firmware itself was also doubly encrypted, but that by feeding the `fwupgrader` binary to Ghidra together with **Claude Code**, they were able to unwind the XOR-obfuscated AES-256-CBC key/IV recovery logic within a matter of hours. It's a case that illustrates how "code obfuscation stopped buying anything but time — and now it doesn't even buy much of that."

The exposed CI environment variables also included three IP addresses that appeared to fall within a U.S. Department of Defense (DoD) allocated range, which became a point of controversy. After confirming the details, Hanwha formally replied that **"this addressing scheme has been used internally as a matter of practice since the Samsung Techwin era, and we were not aware that the range had been officially allocated to the DoD,"** and the researcher subsequently retracted and corrected the speculative language in the original post (2026-07-27). The matter was confirmed to be **misuse of a legacy internal addressing scheme**, not evidence of an actual compromise.

Hanwha revoked the token within **12 hours** of the report being filed, which stands out as a fast-response case; however, it has not been publicly confirmed whether the underlying root cause — a build configuration that bakes the entire CI environment into client output — has actually been remediated.

> ⚠️ **Scope limitation** — This report is based on the researcher's personal blog (primary source) and a GeekNews summary article. No official Hanwha Vision security advisory has been identified. Whether the token was ever actually transmitted over the network from the live camera admin UI (i.e., whether it was reachable as an attack surface) remains unverified — the researcher themselves stated they did not have physical access to a device to test this.

---

## Key Judgments

| #    | Judgment                                                                                                                                                   | Confidence         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| KJ-1 | The exposure was not the result of an attack but a **build configuration defect** (a Vite environment variable bound to the entire `process.env`), which incidentally exposed the CI job's full environment in the client build output.                                                          | **High**       |
| KJ-2 | The exposed GitHub token was a single credential with **organization-wide admin privileges**, exposing a **single point of failure (SPOF)** structure in which one build-configuration mistake translates directly into a confidentiality/integrity risk for the organization's entire code estate.                                              | **High**       |
| KJ-3 | The firmware's two-layer encryption (an outer, model-name-derived passphrase, and an inner XOR-obfuscated AES key inside the binary) was once a meaningful line of defense, but **LLM-assisted reverse engineering (Claude Code + Ghidra)** let a single person defeat it in a matter of hours, effectively eliminating its protective value. | **High**       |
| KJ-4 | The use of a DoD-allocated IP range among the exposed CI variables was confirmed — via Hanwha's official reply and the researcher's correction — to be a **coincidental collision with a legacy internal addressing convention dating back to the Samsung Techwin era, not evidence of any substantive Hanwha–U.S. DoD relationship**.                                     | **High**       |
| KJ-5 | Decryption succeeded with the same method for 62% of roughly 500 firmware images, and all three firmware images in which the token was found contained the **exact same token** — indicating that a single CI pipeline's output is reused across multiple model lines.                                             | **Medium-High**|
| KJ-6 | Revoking the token within 12 hours of the report was fast, but publicly available information does not confirm whether the **root cause (the entire `process.env` being exposed by the build script) has actually been fixed** — the risk of recurrence remains.                                                        | **Medium**     |
| KJ-7 | Hanwha Vision, beyond surveillance cameras, is a Hanwha Group affiliate that has historically produced self-propelled howitzer, armored-vehicle, and sentry-robot subsystems, which means this incident arguably extends beyond a single IoT vendor's risk profile into a broader question about **the software supply-chain security maturity of defense-industry-adjacent companies**.                          | **Medium**     |

---

## 2. Introduction — "Obfuscation only ever bought boredom"

What makes this incident interesting from a CTI standpoint is not the leak itself but **the speed at which the path leading to the leak collapsed**. Hanwha had applied at least two layers of encryption to protect its firmware — wrapping the outer tarball with a model-name-derived passphrase, and separately re-wrapping the internal `fwimage.tgz` with its own AES-256-CBC layer. The key and IV were not left as plaintext inside the binary; instead they were scattered via an XOR operation against a static table. As of 2023, this would have been enough of a barrier to exhaust an individual researcher's time and patience.

Instead, the researcher describes handing this obfuscation-breaking work off to **Claude Code to analyze the binary and stepping away**. By the time they returned from dinner, a full explanation of the decryption logic and a complete root filesystem were already waiting. This became a central point of debate in the GeekNews comment thread as well — "obfuscation was never meant to stop attackers; it was meant to bore them into giving up, and nation-state actors and professional criminal groups were always willing to put in that effort anyway. Now LLMs endure the boredom for them."

**The economics of firmware obfuscation have changed.** Relative to the engineering cost a defender pays to apply obfuscation, the cost an attacker (or researcher) pays to defeat it has structurally collapsed thanks to LLM-assisted reverse engineering. This is not a lesson confined to a single incident — it is a shift in the threat model applicable to any embedded/IoT vendor that relies on hardcoding credentials or hiding keys.

---

## 3. Incident Timeline

| Date (2026)      | Event                                                                                       | Notes                                  |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| (Undated, early-to-mid July)   | Researcher downloads publicly available per-model firmware images from Hanwha Vision's website and begins analysis                                              | Interest triggered by discussion of AXIS expanding Linux application support |
| (Undated)           | `binwalk` analysis → identifies a first-layer-encrypted `fwimage.tgz`; unwrapped using Matt Brown's previously published analysis (model-name-based passphrase) | Successful with the `HTWXNP-9300RW` passphrase         |
| (Undated)           | Discovers a second, internally nested encrypted `fwimage.tgz` — the prior method no longer applies                                              |                                        |
| (Undated)           | Analyzes the `fwupgrader` binary with Ghidra + **Claude Code**, defeats the XOR obfuscation → recovers the AES-256-CBC key/IV and obtains the root filesystem | Completed over the course of an evening (per the researcher's account)         |
| (Undated)           | Scans the root filesystem with `trufflehog` → finds the same GitHub token duplicated across roughly 30 files; confirms organization admin privileges                       |                                        |
| (Undated)           | Root-cause analysis — confirms a Vite build variable was set to the entire `process.env`, baking the whole CI environment into the build output                              | Included many variables, such as `GITHUB_NPM_TOKEN`           |
| (Undated)           | Attempts full collection and decryption across roughly 500 camera model firmware images — 62% extraction success, with the same token found again in 3 of them                                  |                                        |
| (Undated)           | Emails Hanwha's public security disclosure channel with the minimum information needed to locate the token                                                            |                                        |
| (Undated, within 12 hours of the report) | Hanwha replies confirming the token has been revoked                                                                        | Regarded as a fast-response case                       |
| 2026-07-24       | Researcher publishes the full analysis on the hhh.hn blog ("My security camera shipped a GitHub admin token…")             | Includes speculation about DoD IPs (in the original text)               |
| 2026-07-25       | GeekNews publishes a domestic Korean summary (by xguru)                                                                | Spreads through the Korean developer community                     |
| 2026-07-27       | Hanwha issues an official reply regarding the DoD IP question — "an internal addressing scheme dating back to the Samsung Techwin era; we were unaware of the DoD allocation; we plan to change the addressing scheme"                | Researcher strikes through and corrects the speculative language in the original post |

**A note on the timeline**: the original source does not specify exact dates for each technical step. Still, both response cycles — report-to-revocation (12 hours) and disclosure-to-correction (roughly 3 days) — show Hanwha responding substantively, which contrasts with the TVING case discussed elsewhere (a last-minute, one-minute-before-deadline response) as a notably different incident-response culture.

---

## 4. Technical Analysis — The Dual Encryption Layer and LLM-Assisted Reversing

### 4.1 First-Layer Encryption — A Model-Name-Based Passphrase

Hanwha Vision's website offers publicly downloadable per-model firmware images. `binwalk` analysis revealed an AI-component tarball alongside an encrypted `fwimage.tgz`. According to previously published third-party analysis (by Matt Brown), the password follows the pattern `HTW` + model number, and this actually worked for the model in question (`HTWXNP-9300RW`). This means **the passphrase construction rule itself was already publicly known**, so this layer had effectively lost all defensive value.

### 4.2 Second-Layer Encryption — In-Binary XOR Obfuscation

Even after the first layer was peeled back, another `fwimage.tgz` existed inside, this time encrypted differently. Analysis of the `fwupgrader` binary revealed:

- The AES key is reassembled at runtime by **XOR-ing against a small static key table** embedded in the binary
- The **IV is stored in plaintext** in the binary
- Decryption is performed by `fwupgrader` shelling out to the `openssl` CLI, and the pieces of this command string are likewise XOR-obfuscated
- The recovered command takes this form:
  ```sh
  openssl enc -md sha256 -aes-256-cbc -d \
    -K <KEY> -iv <IV> -in <INPUT> -out <OUTPUT>
  ```
- The actual key/IV (disclosed by the researcher, shared across the same model line):
  ```text
  KEY = dfa049bb922e63e2decc764af5628068e5b7a2662e479a615b14643e567579b0
  IV  = 53f926801b81454a4f889c9a390db6e6
  ```

### 4.3 Implications of LLM-Assisted Reversing

The researcher explicitly states that this obfuscation-breaking work was carried out by combining Ghidra static analysis with **Claude Code**, dramatically shortening a task that would traditionally have taken a person days. From a CTI standpoint, this suggests the following:

- **The asymmetry of defense cost has inverted**: the approach of "hiding" hardcoded keys inside code/binaries has always relied on raising the cost of reverse engineering enough to delay attackers. LLM-assisted tooling has sharply lowered that cost, meaning obfuscation alone can no longer be expected to buy any meaningful delay.
- Given that **this barrier was already low for nation-state actors and professional groups**, the real news here is that "the bar has dropped low enough for even a low-resourced independent researcher to clear it in a single evening."
- The right defensive response is not stronger obfuscation but a shift toward **architectures that never embed long-lived credentials in the client or firmware in the first place** (see the recommendations in §12).

---

## 5. Root Cause — One Line of `process.env` Etches the Whole CI Environment Into the Build Output

The actual cause of the token exposure had nothing to do with the encryption layers — it was a far more mundane build configuration defect. The camera admin UI is built with **Vite**, and one build-time variable had been set to the entire `process.env` object. As a result, the CI job's entire set of environment variables was hardcoded verbatim into the client bundle:

```js
var W = {
  DATAPORT: "9090",
  GIT_LFS_SKIP_SMUDGE: "1",
  npm_command: "run-script",
  KUBERNETES_SERVICE_PORT_HTTPS: "443",
  GITHUB_NPM_TOKEN: "<snip>:ghp_…REDACTED…",
  npm_config_userconfig: "/home/docker/.npmrc",
  // etc
}
```

This pattern is textbook CWE-798 (Use of Hard-coded Credentials), but because it originated not in application code but in **build tool configuration (Vite's define/env handling)**, it falls into a blind spot that typical secret-scanning practices tend to miss. The source repository itself likely never contained the token (it was injected into the CI job environment), and the problem occurred in the "build output" — a spot that most secret-scanning programs don't cover.

The same bundle of environment variables also included internal infrastructure identifiers (e.g., internal network addresses such as `SWARM_MASTER_NFS_ADDRESS`, `OTEL_ELASTIC_URL`, and `CIMIP`). In other words, this incident should be understood not as a single leaked GitHub token, but as **the mass exposure of an entire CI/CD pipeline's internal configuration into a client-facing product**.

---

## 6. MITRE ATT&CK / CWE Mapping

| Category            | Mapping                                                            | Notes                                                       |
| --------------- | --------------------------------------------------------------- | ---------------------------------------------------------- |
| Vulnerability Type     | **CWE-798** Use of Hard-coded Credentials                       | CI secrets hardcoded into build output (client UI)              |
| Vulnerability Type     | **CWE-312** Cleartext Storage of Sensitive Information            | Plaintext IV in the binary; exposed token stored without encryption           |
| Potential Attack Technique | **T1552.001** Unsecured Credentials: Credentials In Files          | Token found repeated across roughly 30 camera UI files                    |
| Potential Attack Technique | **T1078.004** Valid Accounts: Cloud/SaaS Accounts (GitHub)       | If stolen, the token grants admin-level access across the entire organization's repositories           |
| Potential Follow-on Technique | **T1195.002** Supply Chain Compromise: Compromised Software Dependencies | Abuse of the admin token could enable code repository tampering and supply chain contamination (not observed to have occurred; a theoretical risk) |
| Point of Defensive Failure  | Secret-scanning coverage — the source repository is covered, but **the CI build output (client bundle) is presumed to be uncovered** | See root cause in §5                                           |

This incident should be classified as a **vulnerability disclosure — the discovery and reporting of a pre-existing exposure — rather than an actual breach (incident)**. It should therefore be noted that no attacker's actual TTPs were observed here; the mapping above reflects the potential paths that "would have been possible had it been exploited."

---

## 7. Exposed Asset Risk Assessment — The Token and the DoD IPs

| Exposed Asset                                   | Nature                     | Potential Impact if Exploited                                                              | Actual Confirmed Status                                    |
| -------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| GitHub Token (`GITHUB_NPM_TOKEN`)             | Presumed long-lived PAT (personal access token) | **Admin access to hundreds of repositories** across the organization — enabling code exfiltration, backdoor insertion, release tampering, and other supply-chain attacks | Confirmed revoked within 12 hours of the report. No evidence of actual exploitation has been reported |
| Internal infrastructure variables (`SWARM_MASTER_NFS_ADDRESS`, etc.) | Internal network identifiers           | Could be used as internal infrastructure mapping/reconnaissance material                              | Whether this was disclosed publicly or remediated is unknown                  |
| 3 DoD-allocated IP ranges                          | Reuse of an internal addressing scheme  | Initial speculation: a substantive Hanwha–U.S. DoD connection → **rebutted by Hanwha's official reply and confirmed to be a legacy addressing convention** | **Fully clarified** via Hanwha's reply and the researcher's correction            |
| Full exposure scope of the admin UI itself                         | Unable to verify                | Whether the token was actually transmitted over the network when accessing the admin UI is unconfirmed                          | Unverifiable due to the researcher not having a physical device (stated explicitly in the original blog post)   |

**Assessment of the DoD IP item**: the original blog post initially raised the speculative question of "does Hanwha have a direct connection to the U.S. Department of Defense?" on the grounds that these addresses fell within a DoD-allocated range, and the GeekNews comment section ran with further overreaching interpretations (e.g., "avoidance of Korean-made security products"). However, according to Hanwha's official reply, the actual cause is a **legacy internal addressing convention carried over from the Samsung Techwin era**, and the company itself had not been aware that the range it was using had been officially allocated to the DoD. After confirming this, the researcher struck through the speculative paragraph in the original post and added a correction (2026-07-27). When writing CTI reports, it is essential to **clearly separate a post-clarification factual update from the original narrative**, and this report reflects that corrected fact in KJ-4 accordingly.

That said, it is worth separately noting that the practice of "arbitrarily reusing an IP range officially allocated to the Department of Defense as an internal address" is, in itself, **a flawed network design practice that carries an inherent risk of IP address collision and routing malfunction** — a point Hanwha itself acknowledged, along with stating plans to change its addressing scheme.

---

## 8. Full-Fleet Survey Results — ~500 Firmware Images, 3 Identical Tokens

To determine whether this was a one-off coincidence, the researcher collected virtually all of the roughly 500 firmware images available (out of roughly 600 camera models listed on Hanwha Vision's website) and attempted decryption using the same method across the board.

| Metric                        | Value                     |
| --------------------------- | ---------------------- |
| Number of models targeted for collection            | ~600 (of which ~500 have firmware available) |
| Decryption success rate                 | ~62%                  |
| Number of firmware images in which the GitHub token was found    | 3                     |
| Identity of the discovered tokens          | **All 3 identical**    |

This result suggests two things. First, the cause of the 38% decryption failure rate was not specified, but it likely indicates differing encryption schemes across model generations — meaning the possibility of separate, unexamined exposures in other model families cannot be ruled out. Second, the fact that all three models in which the token was found share the exact same token supports the theory that **a single CI pipeline/build script is reused across the UI builds of multiple model lines** — a textbook supply-chain-style risk pattern in which a single configuration defect propagates across an entire product line.

---

## 9. Disclosure and Response Assessment — A 12-Hour Turnaround and a Public Correction

The researcher sent an email to Hanwha's public security disclosure channel containing only the minimum information needed to locate the token, and Hanwha responded within **12 hours**, having completed revocation of the token. The researcher themselves noted, "this kind of mistake shouldn't have happened, but a response and resolution this fast is rare."

Hanwha subsequently also replied to the DoD IP inquiry with concrete substantiation (the internal addressing scheme dating back to the Samsung Techwin era, acknowledgment of not having been aware of the allocation, and a plan for future changes), and the researcher publicly retracted the speculative narrative in the original post on that basis. This stands as a case in which **substantive, transparent communication was observed both in the vulnerability disclosure response and in the subsequent public correction** — a notable contrast to the TVING case discussed elsewhere (a last-minute response one minute before the disclosure deadline, with dark-pattern notification practices).

Two things nonetheless remain unconfirmed:

1. Whether the underlying root cause — the Vite build configuration exposing the entire `process.env` — has actually been fixed
2. Whether any action (redeployment or forced update) has been taken regarding the older UI build artifacts still present in the firmware of cameras that were already deployed and installed in the field

---

## 10. Korean Perspective — Domestic Defense-Industry Affiliates and CTI Implications

- **The surveillance-equipment/defense-affiliate structure.** Hanwha Vision originated as Samsung Techwin before being folded into the Hanwha Group, and has a history of producing subsystems for the K9 self-propelled howitzer, the K10 ammunition resupply vehicle, the K2 tank, and the SGR-A1 sentry robot. While this particular incident occurred in the web UI of a civilian CCTV product rather than a defense product, the fact that Hanwha Group also includes defense-industry affiliates such as Hanwha Aerospace and Hanwha Defense USA means that **the software supply-chain security boundaries between affiliates sharing common group-wide CI infrastructure** may warrant future scrutiny.
- **A shared risk across domestic IoT/embedded vendors.** As also noted in the GeekNews comment section, hardcoded credentials and risky defaults remain a chronic problem across the IoT industry both domestically and abroad. That said, this case offers a relatively favorable benchmark — a "12-hour response after disclosure" — that domestic vendors could reference when designing their own vulnerability disclosure response processes.
- **The enterprise-asset-ification of surveillance cameras.** As noted in the original source, amid an industry trend (exemplified by AXIS) of redefining cameras as "enterprise network assets that happen to run Linux," domestic CCTV vendors also face a growing need to adopt credential lifecycle management, SBOMs (software bills of materials), and secret scanning as standard components of their build pipelines.

---

## 11. Detection, Mitigation, and Response Recommendations

### For Manufacturers / Embedded-IoT Vendors in General

1. **Extend secret scanning to build outputs** — Beyond source repositories, run trufflehog-class secret scanners as a mandatory final step of the CI pipeline against **build artifacts (client bundles, firmware images, container images)**. This incident demonstrates that even when the source contains no secrets, build-tool configuration defects can still let them leak into artifacts.
2. **Whitelist build variables** — Prohibit patterns in bundler configurations (Vite/Webpack `define`/`env` settings, etc.) that expose the **entire** `process.env` to the client, and instead inject only explicitly required variables via an individual whitelist.
3. **Eliminate long-lived credentials** — Rather than keeping long-lived tokens like GitHub PATs permanently resident in the CI environment, migrate to GitHub Actions OIDC, fine-grained PATs, or short-TTL tokens. Eliminate the underlying structure in which a single token with organization-wide admin privileges is shared across multiple CI jobs.
4. **Redesign firmware encryption** — Stop treating in-binary, XOR-obfuscated key-reassembly schemes as a valid line of defense. Move toward hardware-security-module (HSM/TPM/Secure Element)-based key derivation and per-device unique key issuance.
5. **Audit internal addressing schemes** — Conduct a full audit of any legacy practice of arbitrarily reusing publicly allocated IP ranges (particularly government/defense-allocated ranges) as internal addresses, and migrate to RFC 1918 private address ranges.
6. **Incorporate LLM-assisted reversing into the threat model** — Revisit any practice of designing code/binary obfuscation as a genuine defensive control rather than a mere "time delay." Threat modeling should default to the assumption that "a skilled individual, aided by LLM tooling, can defeat obfuscation overnight."

### Security Disclosure Process (As a Reference Case)

7. This incident's **12-hour token revocation response** and **substantiated reply to a public inquiry** are worth referencing as a benchmark for other companies' vulnerability disclosure response processes.

### For Enterprises Purchasing/Operating Cameras

8. **Network segmentation** — Isolate IoT/CCTV devices on a dedicated VLAN and block outbound internet access as a matter of policy.
9. **Restrict admin UI access** — Limit access to the camera admin web UI to the internal network, and where possible, consider operating cameras exclusively through a separate NVR using a standard protocol such as ONVIF.
10. **Track firmware updates** — Subscribe to the vendor's security advisories and continue monitoring for the release of a firmware patch related to this incident.

---

## 12. Conclusion

At its core, this incident is not "a sophisticated attack" but the simultaneous collapse of **an ordinary build-configuration mistake (the entire `process.env` being exposed) and an outdated defensive assumption (that firmware obfuscation would buy meaningful time)**. Firmware wrapped in two layers of encryption turned out to be nothing more than a single evening's barrier in front of LLM-assisted reversing, and what lay behind it was a single GitHub token with admin privileges across the entire organization. The eye-catching DoD-allocated-IP subplot ultimately turned out to be a coincidental collision with a legacy internal addressing scheme — but the clarification process itself — a response within 12 hours of disclosure, a substantiated reply to a public inquiry, and a swift correction by the original author — remains the most impressive element of this entire episode.

Two questions remain from a CTI perspective. Have you actually checked what your own build pipeline is etching into its client-facing output? And is your obfuscation designed to stop humans — or LLMs?

---

## 13. References

1. hhh.hn (Austin) — "My security camera shipped a GitHub admin token in its login page" (2026-07-24, corrected 2026-07-27) — https://hhh.hn/hanwha-github-token/
2. GeekNews — "GitHub admin token shipped in the web UI login page of Hanwha Vision security cameras" (2026-07-25, summarized by xguru) — https://news.hada.io/topic?id=31784
3. Matt Brown — "Hanwha firmware file decryption" (analysis of the first encryption layer; see original) — https://brownfinesecurity.com/blog/hanwha-firmware-file-decryption
4. Wikipedia — "Hanwha Vision" (company history, former Samsung Techwin, defense-affiliate information) — https://en.wikipedia.org/wiki/Hanwha_Vision
5. NBC News — "Future Tech: Autonomous killer robots are already here" (SGR-A1 reference, as cited in the original) — https://www.nbcnews.com/tech/security/future-tech-autonomous-killer-robots-are-already-here-n105656
6. CWE-798: Use of Hard-coded Credentials — MITRE CWE
7. CWE-312: Cleartext Storage of Sensitive Information — MITRE CWE
8. MITRE ATT&CK — T1552.001, T1078.004, T1195.002

---

## Change Log

| Version | Date       | Description                                                          |
| ---- | ---------- | ------------------------------------------------------------- |
| v1.0 | 2026-07-28 | Initial publication — technical analysis based on the original post and GeekNews summary, incorporating the DoD IP correction |

---

**© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division** gameworker@gmail.com · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*This report is an independent analysis based on public OSINT sources (the researcher's personal blog and a GeekNews summary article) and does not represent the official position of Hanwha Vision or any related organization. This incident is a case of responsible vulnerability disclosure by a researcher, not an actual breach, and it should be noted that Hanwha responded promptly after the report was filed. For educational, defensive, and research purposes only. TLP:GREEN — may be shared within the community and disclosed externally.*
