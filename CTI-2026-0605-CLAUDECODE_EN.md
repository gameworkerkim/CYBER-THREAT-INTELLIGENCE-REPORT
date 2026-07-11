# Claude Code GitHub Action Permission Bypass and Prompt Injection Supply Chain Vulnerability Analysis

> **A new supply chain attack surface created by CI/CD integration of AI coding agents**
> *Indirect Prompt Injection × OIDC Token Theft × Self-Propagating Action Compromise*

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0605-CLAUDECODE` |
| **Publication Date** | 2026-06-05 |
| **Severity** | 🔴 HIGH — Direct CI/CD supply chain and secret theft risk |
| **Classification** | `TLP:GREEN` |
| **CVE / Identifier** | Not assigned (vendor self-assessment) · CVSS v4.0 7.8 |
| **Affected Product** | `anthropics/claude-code-action` < v1.0.94 |
| **Threat Type** | Permission validation bypass + Indirect Prompt Injection → RCE / Secret Exfiltration |
| **Discoverer** | RyotaK (GMO Flatt Security) |
| **Disclosure Window** | 2026-06-02 ~ 06-04 (international reporting) |
| **Korea Coverage** | No KISA or security press coverage as of publication |
| **Confidence** | High (cross-validated through vendor patch and researcher technical disclosure) |

---

## 1. Executive Summary

A vulnerability was disclosed in Anthropic’s Claude Code GitHub Action that could allow an attacker to compromise a public repository using the action with **only a single malicious GitHub issue**. The core issue was the combination of two flaws.

First, the permission validation function `checkWritePermissions` trusted any account whose actor name ended in `[bot]` without performing a real permission check. Because GitHub Apps have implicit read access to public repositories and can create issues or pull requests using only an installation token, an attacker could create a malicious GitHub App, open an issue in a target public repository, and pass the permission check.

Second, after bypassing permission validation, the attacker could conduct **Indirect Prompt Injection** through a malicious issue body disguised as an error message. Claude Code can execute certain Bash commands, including `cat` and `head`, without explicit user approval. This allowed an attacker to read the Linux pseudo-file `/proc/self/environ`, extract workflow process environment variables, especially `ACTIONS_ID_TOKEN_REQUEST_TOKEN` and `ACTIONS_ID_TOKEN_REQUEST_URL`, obtain an OIDC token, and exfiltrate cloud credentials and secrets.

The most serious finding is that **Anthropic’s own action repository, `anthropics/claude-code-action`, used the same vulnerable agent-mode workflow**. If exploitation had succeeded, an attacker could have injected malicious code into the action source itself and propagated compromise to all downstream repositories consuming it, creating a classic supply chain attack path.

RyotaK reported the core bypass in January 2026. Anthropic fixed it within four days and continued additional hardening through the spring. The fix was incorporated in **v1.0.94**. Anthropic assessed the issue at **CVSS v4.0 7.8** and paid a bug bounty. Separately, Anthropic’s official issue triage example workflow was also flagged for a risky misconfiguration: `allowed_non_write_users: "*"`, which allowed any external user to trigger the workflow.

---

## 2. Key Judgments

- **KJ-1 (High):** The essence of this incident is "default write privileges granted to an AI agent + uncritical acceptance of external input." It is not merely a single vulnerability, but an example exposing the **structural attack surface of agentic CI/CD integrations**. Regardless of patch status, the same pattern, including bot trust, unapproved command execution, and environment variable exposure, may be reproducible in other AI coding agents.
- **KJ-2 (High):** No public reporting indicated active exploitation as of publication, but the technique is fully disclosed and **PoC reproduction difficulty is low**. Public repositories that have not applied the patch should be treated as immediately exposed.
- **KJ-3 (Medium):** The highest-priority exposure is **short-lived cloud credentials** for AWS, GCP, and Azure obtained through OIDC tokens, along with repository secrets. Because compromise can undermine code integrity itself, affected organizations need to revalidate build artifact trust, not only rotate tokens.
- **KJ-4 (Medium):** Follow-on analysis from Tenable and others identified another path involving PR head branch checkout plus attacker-controlled `.mcp.json` MCP server startup leading to arbitrary command execution. This means defenders must review not only the permission bypass, but also the **trusted boundary design** itself.

---

## 3. Attack Chain

1. **Initial Access** — The attacker creates and self-installs a malicious GitHub App and obtains an installation token.
2. **Permission Bypass** — The attacker uses the installation token to create an issue or PR in the target public repository. Because the actor name ends in `[bot]`, `checkWritePermissions` returns `true`. Agent mode lacked the additional safeguards present in tag mode, such as `checkHumanActor`.
3. **Prompt Injection** — The attacker inserts a payload into the issue body, disguised as an error message, to induce command execution.
4. **Secret Extraction** — Claude Code reads `/proc/self/environ` using unapproved commands such as `cat` or `head`, obtaining `ACTIONS_ID_TOKEN_REQUEST_TOKEN` and `ACTIONS_ID_TOKEN_REQUEST_URL`.
5. **Privilege Escalation and Exfiltration** — The attacker requests an OIDC token, exfiltrates cloud credentials and secrets, and pushes code.
6. **Potential Supply Chain Propagation** — If the action repository itself is contaminated, compromise can spread to all downstream repositories.

---

## 4. MITRE ATT&CK Mapping

| Tactic | Technique | ID |
| --- | --- | --- |
| Initial Access | Trusted Relationship (abuse of GitHub App trust) | T1199 |
| Execution | Command and Scripting Interpreter (Bash) | T1059.004 |
| Defense Evasion | Abuse Elevation Control / permission validation bypass | T1548 |
| Credential Access | Unsecured Credentials: CI/CD Secrets | T1552.007 |
| Credential Access | Steal Application Access Token (OIDC) | T1528 |
| Supply Chain | Compromise Software Dependencies and Tools | T1195.002 |

---

## 5. Korea Impact and Response

### 5.1 Domestic Exposure Assessment

- **Adoption is expanding among startups, SI firms, and game companies.** Since the second half of 2025, Korean development organizations have rapidly adopted Claude Code for issue triage, code review, and automation. Solo and small teams with limited staffing are especially likely to use default settings, making permission and trigger-scope reviews easy to miss.
- **Risk of chained cloud credential compromise.** Because the primary exposure involves OIDC-based short-lived cloud credentials, Korean environments integrating GitHub Actions with Azure, AWS, or GCP through OIDC have an architecture in which **a single Action compromise can spread across cloud resources**.
- **Direct exposure for public OSS maintainers.** Korean open-source maintainers who applied this action to public repositories, including individual research, fintech, and Web3 SDK projects, could have been targeted through an external issue without additional authentication.

### 5.2 Korean Government and Institutional Response Perspective

- **KISA / KrCERT:** No domestic advisory exists at this time. This issue should be treated as a new category, "CI/CD integration security for AI coding agents," and addressed through either an annex to the **KISA software supply chain security guide** or a dedicated security notice. Recommended core guidance: (1) require `claude-code-action` v1.0.94 or later, (2) prohibit `allowed_non_write_users` wildcards, and (3) enforce least privilege in OIDC trust policies.
- **Ministry of Science and ICT (MSIT):** From an "AI-enabled secure software development" perspective, ISMS-P audit criteria should incorporate **agent permissions and external-input trust boundaries**.
- **Financial Security Institute (FSI) and the financial sector:** OIDC-to-cloud credential theft is a direct threat to financial-sector CI/CD. Reassessment is recommended for cloud security controls under electronic financial supervisory requirements, including separation of privileges, shorter token lifetimes, and build artifact integrity verification.
- **Software supply chain security and SBOM policy linkage:** As Korea advances SBOM and software supply chain security mandates, this incident indicates that **CI/CD actions and AI agents must be explicitly managed as supply chain components**.

### 5.3 Immediate Checklist for Korean Organizations

1. Pin `anthropics/claude-code-action` to **v1.0.94 or later**; SHA pinning is recommended.
2. Remove `allowed_non_write_users` wildcard (`"*"`) from workflows and block external triggers.
3. Minimize **default write privileges** granted to agents and separate issue/PR handling permissions.
4. Tighten **trust conditions** for OIDC-linked cloud roles, including audience and subject, and shorten token lifetimes.
5. If public repositories used the action before the patch, rotate **CI secrets, cloud keys, and npm tokens under an assumption of compromise**.
6. Review the **integrity of in-repository agent configuration files** such as `.mcp.json` and redefine trust boundaries.

---

## 6. Analytic Outlook

This incident exposes the structural contradiction of giving an AI agent human-equivalent trust while allowing it to process external input faster and less critically than a human. It aligns precisely with the 2026 trend in which npm supply chain worms, including Shai-Hulud variants, Miasma, and IronWorm, target GitHub Actions trust boundaries as an attack surface. Future **compound supply chain attacks connecting AI agents, CI/CD, and package registries** are likely to become a standard scenario. Defense must shift from a single patch to four control pillars: (1) external-input trust boundaries, (2) agent command allowlisting, (3) least-privilege and short-lived tokens, and (4) build artifact integrity verification.

---

## 7. References

- The Hacker News — "Claude Code GitHub Action Flaw Let One Malicious Issue Hijack Repositories" (2026-06-04)
- GBHackers — "Claude Code GitHub Actions Flaw Exposes Repositories to Full Compromise" (2026-06-02)
- Cyber Security News — "Claude Code's GitHub Actions Vulnerability Lets Attackers Compromise Any Repository"
- Cyberpress — "Claude Code GitHub Actions Flaw Enables Repository Compromise"
- Tenable Advisory (PR head checkout / `.mcp.json` MCP path)
- Reporter: RyotaK, GMO Flatt Security

---

## ⚖️ Disclaimer

This report is an independent defensive and research-oriented analysis based on public OSINT sources and media reporting. It does not represent the official position of Anthropic or any other organization. IoC and version information are current as of publication and should be revalidated before operational use. The author assumes no liability for damages arising from direct or indirect use of this material.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
gameworker@gmail.com · github.com/gameworkerkim
