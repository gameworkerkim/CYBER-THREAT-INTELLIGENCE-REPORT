| id             | CTI-2026-0527-GITEA                                                                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | Unauthenticated Exposure of Gitea Container Registry — The Illusion of "Private" Left Unaddressed for Four Years                                                                                                    |
| subtitle       | CVE-2026-27771: Private container images of 30,000 self-hosted instances leaked without authentication                                                                                                            |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | en                                                                                                                                                                                                              |
| tags           | | Authentication-Bypass | Container-Security | Self-Hosted | Supply-Chain | Secret-Leakage | DevOps | | --------------------- | ------------------ | ----------- | ------------ | -------------- | ------ | |
| threat\_actors | | N/A (disclosure stage, no confirmed active exploitation) | | -------------------------------------------------------- |                                                                            |
| cve            | | CVE-2026-27771 | | -------------- |                                                                                                                                                                       |
| frameworks     | | MITRE ATT&CK | NIST SP 800-190 (Container Security) | OWASP Top 10 (A01:Broken Access Control) | | ------------ | ------------------------------------ | ---------------------------------------- | |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# Unauthenticated Exposure of Gitea Container Registry — The Illusion of "Private" Left Unaddressed for Four Years

> **Report ID** `CTI-2026-0527-GITEA` · **Published** 2026-05-27 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*CVE-2026-27771: Private container images of 30,000 self-hosted instances leaked without authentication*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Vulnerability Overview
3. Scope and the Fork Ecosystem
4. Impact on Korea
5. Impact on the Web3 / Crypto Ecosystem
6. Mitigations
7. Conclusion and Recommendations
8. References

---

## Executive Summary (TL;DR)

On May 27, 2026, security researchers (UK-based Noscope) disclosed a vulnerability in **Gitea**, the open-source self-hosted version control platform, that allows unauthenticated remote attackers to pull private container images without an account, password, or prior access. Tracked as `CVE-2026-27771`, it affects **all versions prior to 1.26.2**, which addresses the issue.

According to Noscope, the flaw likely impacts more than 30,000 deployments across over 30 countries and went undetected for nearly four years. The vast majority of exposures are concentrated in China, the U.S., Germany, France, and the U.K., with affected organizations spanning healthcare providers, aerospace manufacturers, retail infrastructure, and ISPs.

The essence of the problem is clear: a container repository an operator designated as "private" did not actually deliver that protection. Anyone on the internet could pull private container images as if they were public, with no account, password, or prior access. This is not a simple bug but a **collapse of trust in the access control model itself.**

### Key Judgments

| #    | Judgment                                                                                                                          | Confidence |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | The core risk of this flaw is not RCE but **secret leakage**. Container images frequently contain API keys, DB credentials, and internal source, so the leak of a single image becomes a stepping stone for follow-on compromise. | **High**   |
| KJ-2 | Given roughly four years undetected, **the possibility that some instances' images were quietly harvested** cannot be excluded. The patch only prevents future exposure; it does not recover past leaks. Exposed secrets must be treated as compromised. | **Medium-High** |
| KJ-3 | Gitea forks (notably **Forgejo, confirmed affected**) must be treated as impacted until independently verified. Self-hosted Git platforms are prone to delayed patching because of the perception "I control it, so it's safe." | **High**   |
| KJ-4 | Self-hosted Gitea is favored by individual developers, small teams, and blockchain startups for cost savings, so damage may concentrate on **organizations with fewer assets but weaker security operations capacity.** | **Medium** |

---

## 2. Vulnerability Overview

`CVE-2026-27771` is an authentication bypass flaw in Gitea's container registry. Under normal operation, a repository marked private should be pullable only by authenticated, authorized holders. In affected versions, however, the private designation failed to deliver the protection operators reasonably expected.

According to Noscope, Gitea's container registry allowed anyone on the internet — with no account, password, or prior access — to pull container images that appear private at first glance from affected instances as if they were public.

No additional technical details are currently available (typical for a responsible-disclosure process), and the CVSS score has not yet been assigned (N/A). However, the conditions — unauthenticated, remote, no prior privilege required — indicate a high practical risk.

## 3. Scope and the Fork Ecosystem

| Item            | Detail                                                       |
| --------------- | ------------------------------------------------------------ |
| Affected versions | All Gitea versions **prior to** 1.26.2                     |
| Fixed version   | Gitea 1.26.2                                                 |
| Est. exposure   | 30,000+ deployments across 30+ countries                     |
| Top exposed     | China, U.S., Germany, France, U.K.                           |
| Affected sectors | Healthcare, aerospace manufacturing, retail infrastructure, ISPs |
| Undetected period | ~4 years                                                   |
| Fork impact     | All Gitea forks should be treated as potentially impacted until verified. **Forgejo confirmed affected.** |

Noscope emphasized that any fork of Gitea should be treated as potentially impacted until independently verified by its respective maintainers. In its own testing, Forgejo was confirmed to be impacted. This again exposes a structural weakness of the fork ecosystem — an upstream flaw silently propagating to numerous downstream projects.

## 4. Impact on Korea

This vulnerability was barely reported by Korean media, yet it directly affects domestic self-hosted environments.

First, **many domestic startups and blockchain teams self-host Gitea/Forgejo to cut GitHub Enterprise costs.** They often deploy Gitea on OCI, AWS, or their own servers and use the container registry feature. Because of the perception "internal network or a server I control," many operate the container registry exposed to the internet.

Second, **Korea's delayed-patching culture** compounds the risk. Self-hosted tools tend to be "install and forget," so a flaw undetected for four years was likely left unaddressed domestically as well.

Third, container images typically contain `.env` files, API keys, DB connection info, and internal source code. If images of domestic fintech/blockchain firms were leaked, this translates directly into **leakage of production infrastructure credentials.**

## 5. Impact on the Web3 / Crypto Ecosystem

For Web3 organizations, this vulnerability can be even more fatal than for general enterprises.

First, **blockchain projects' container images frequently contain node operation keys, RPC endpoint credentials, and deployment scripts.** Image leakage equals infrastructure key leakage and directly threatens mainnet node, indexer, and oracle operations.

Second, many DeFi/NFT startups use self-hosted Gitea to cut GitHub costs. From this analyst's observations across numerous Web3 advisory engagements, it is not rare to see smart contract deployment private keys or multisig operation scripts hardcoded as environment variables inside container images.

Third, the risk is amplified when **combined with the developer-credential theft flow** noted in this analyst's `CTI-2026-0527-GLASSWORM` report. If GlassWorm-class malware steals developer tokens and the Gitea exposure leaks additional secrets inside container images, an attacker can readily hijack the entire deployment pipeline.

## 6. Mitigations

### 6.1 Immediate Actions

1. **Upgrade to Gitea 1.26.2 immediately.** This is the fundamental fix.
2. If patching is not immediately possible, **apply the temporary workaround `[service].REQUIRE_SIGNIN_VIEW=true` in the configuration.** Note this may be unsuitable in environments where some containers are intentionally meant to be public.
3. **For forks such as Forgejo,** check the maintainer's patch notice and, if unconfirmed, treat as affected and apply the same workaround.

### 6.2 Assume-Breach Post-Incident Response

1. **Treat all secrets in exposed container images as compromised** and rotate them — API keys, DB credentials, RPC credentials, deployment keys, everything.
2. **Analyze access logs** — retroactively check container registry pull logs for abnormal access from unauthenticated/external IPs. (Note that four years of logs are unlikely to be retained.)
3. **Image hygiene review** — going forward, remove hardcoded secrets from all container images and switch to build-time secret injection (e.g., BuildKit secret mount).

### 6.3 Structural Measures

1. **Do not expose self-hosted Git platforms directly to the internet.** Place them behind a VPN, reverse-proxy authentication, or IP allowlist.
2. **Never include secrets in the container registry.** Inject secrets at runtime via a dedicated secrets manager such as Vault or KMS.
3. **Formally enroll self-hosted tools in patch management.** End "install and forget" — review versions and CVEs at least quarterly.

## 7. Conclusion and Recommendations

The lesson of `CVE-2026-27771` is that *"a 'private' label is not security."* Access control must be enforced by actual verification logic, not a label, and self-hosted environments are especially prone to being skipped in reviews because of the psychological safety of "I control it."

Key recommendations:

1. **Upgrade to Gitea 1.26.2 immediately,** or apply the `REQUIRE_SIGNIN_VIEW` workaround.
2. **Do not use container images as secret stores.** Assume every credential placed in an image is potentially public.
3. **Formalize self-hosted infrastructure as a patch/exposure management target.**
4. Web3 organizations should fully separate node keys and deployment keys from images and migrate them to an external secrets manager.

---

## References

[1] Ravie Lakshmanan, "Gitea Vulnerability Exposes Private Container Images without Authentication", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/gitea-vulnerability-exposes-private.html>

[2] Noscope, "Gitea Instances Exposing Private Container Images". <https://www.noscope.com/blog/gitea-instances-exposing-private-container>

[3] Gitea, "Release of 1.26.2". <https://blog.gitea.com/release-of-1.26.2/>

[4] Dennis Kim, "Simultaneous Takedown of GlassWorm C2 Infrastructure", CTI-2026-0527-GLASSWORM, 2026-05-27. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
