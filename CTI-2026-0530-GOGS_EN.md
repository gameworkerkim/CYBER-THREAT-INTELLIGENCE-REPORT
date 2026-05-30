| id             | CTI-2026-0530-GOGS                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | Unpatched Critical RCE — Gogs git rebase Argument Injection                                                             |
| subtitle       | A 9.4 flaw letting any authenticated user seize a self-hosted Git server, plus cross-tenant compromise                  |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | en                                                                                                                     |
| tags           | Argument-Injection · RCE · Self-Hosted-Git · Supply-Chain · Cross-Tenant · Unpatched                                  |
| threat_actors  | N/A (public PoC · Metasploit module)                                                                                   |
| cve            | No CVE assigned (Rapid7-rated CVSS 9.4)                                                                                 |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 (Incident Response) · STIX/TAXII                                                          |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# Unpatched Critical RCE — Gogs git rebase Argument Injection

> **Report ID** `CTI-2026-0530-GOGS` · **Published** 2026-05-30 · **Classification** `TLP:GREEN` · **Severity** 🔴 HIGH
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*A 9.4 flaw letting any authenticated user seize a self-hosted Git server, plus cross-tenant compromise*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Vulnerability Analysis — `--exec` argument injection
3. Attack Scenarios — from a no-privilege account to server takeover
4. Impact and Exposure
5. Forensic Traces and Detection
6. Mitigation (in the absence of a patch)
7. Korea Perspective — the blind spot of self-hosted Git
8. Conclusion
9. References

---

## Executive Summary (TL;DR)

On May 28, 2026, Rapid7 disclosed a critical vulnerability in **Gogs**, a popular self-hosted Git service, that lets **any authenticated user execute arbitrary code on the server**. No CVE identifier has yet been assigned, but Rapid7 rated it CVSS 9.4.

The flaw arises in Gogs' *"Rebase before merging"* operation. When an attacker creates a pull request with a **malicious branch name**, that branch name is injected into the `--exec` flag of `git rebase`, causing an arbitrary shell command to run after each commit is replayed. No admin privileges and no interaction with other users are required.

More serious: the flaw was **reported to the maintainer on March 17, 2026, yet remains unpatched** as of publication, and Rapid7 has published a **Metasploit module** that automates the full chain against both Linux and Windows. In short, the weapon is public and there is no patch.

### Key Judgments

| #    | Judgment                                                                                                                            | Confidence      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | This is a textbook **argument injection**: user input (the branch name) is passed straight into a shell-command argument, with essentially no precondition beyond authentication. | **High**        |
| KJ-2 | The combination of **unpatched + public Metasploit module** all but removes the barrier to real-world exploitation. Exposed instances are at immediate risk. | **High**        |
| KJ-3 | In shared-server environments, **cross-tenant compromise** is possible — one user can read another user's private repositories. | **High**        |
| KJ-4 | Default-configured instances (registration and repo creation enabled) are the most exposed. Mitigation is possible but does not replace a root patch. | **Medium-High** |
| KJ-5 | Self-hosted Git is the single trust anchor for source code, credentials, and CI pipelines, so this flaw can be a **bridgehead for supply chain compromise**. | **Medium-High** |

---

## 1. Vulnerability Analysis — `--exec` argument injection

Gogs is a lightweight self-hosted Git service written in Go, widely used as a self-hosted alternative to GitHub. This flaw occurs in the *"Rebase before merging"* option, which uses `git rebase` to merge a PR.

`git rebase` replays a branch's commit sequence onto another base branch to create linear history. It can take a **`--exec` flag that runs a shell command after each replayed commit**. Gogs passes the user-controlled **branch name** into the `git rebase` invocation without sufficient sanitization. So if an attacker embeds an `--exec`-style payload in the branch name, that command executes on the server host during merge.

> Researcher Jonah Burgess (Rapid7): "The vulnerability allows any authenticated user to achieve RCE on the server by creating a pull request with a malicious branch name that injects the `--exec` flag into `git rebase` during the 'Rebase before merging' merge operation."

The affected platforms are **all supported platforms** — Windows, Linux, and macOS.

---

## 2. Attack Scenarios — from a no-privilege account to server takeover

The danger lies in the **near-total absence of preconditions**.

| Scenario | Precondition | Attack path |
| --- | --- | --- |
| ① Default-config instance | Registration & repo creation enabled (default) | Create account → create repo (auto-owner) → toggle rebase merging in settings → run the full chain solo |
| ② User with write access | Write access to a repo where rebase merging is already enabled | Exploit directly |
| ③ Repo-creation-restricted env | Write access to any repo with rebase merging enabled | Exploit via that repo |

Scenario ① is especially severe: *"any registered user who creates a repo is automatically its owner, enabling rebase merging is a single settings toggle, and the entire exploit chain can be operated without interaction from any other user."*

On success, the attacker can breach the server, access every repository on the instance, dump credentials, move to other network-accessible systems, and tamper with hosted repository code. Above all, it leads to a **cross-tenant data breach**, reading other users' private repositories on the same shared server.

---

## 3. Impact and Exposure

- **Estimated exposed instances**: about 1,141 internet-facing Gogs instances. The actual figure is expected to be higher, since most deployments sit behind VPNs or internal networks.
- **Weaponization level**: Rapid7 published a Metasploit module that automates the full chain against Linux and Windows targets. It supports two modes — (a) a default mode that creates, exploits, and deletes a temporary repo under the attacker's account, and (b) a mode targeting a repo where the attacker already has write/merge access.
- **Patch status**: despite being reported to the maintainer on 2026-03-17, **unpatched** as of publication.

---

## 4. Forensic Traces and Detection

Per Rapid7, traces differ by mode.

- **Self-created-and-deleted-repo mode**: the only trace in server logs is essentially a **single HTTP 500 error** — hard to distinguish from a normal error in post-incident analysis.
- **Existing-repo mode**: additional artifacts remain, giving relatively higher detectability.

Detection recommendations:

1. Monitor anomalous HTTP 500 patterns tied to PR merge events.
2. Alert on creation of abnormal branch names (containing special characters or `--exec`-like tokens).
3. Detect unexpected shell/child processes spawned by the Gogs process.
4. Track short-window chains of new account → repo creation → rebase toggle → merge.

---

## 5. Mitigation (in the absence of a patch)

Rapid7's interim mitigations, given no root patch:

1. **Restrict registration** — set `DISABLE_REGISTRATION = true` in `app.ini` to block untrusted account creation.
2. **Restrict repo creation** — set `MAX_CREATION_LIMIT = 0` in `app.ini` to prevent users from creating their own repos.
3. **Audit rebase merge settings** — review all repos with rebase merging enabled and disable where unnecessary.
4. **Network isolation** — remove direct internet exposure; move behind VPN/internal network/access controls.
5. **Consider alternatives** — if patch availability is uncertain, evaluate mid-term migration to actively maintained alternatives such as Forgejo/Gitea (but verify versions, as Gitea-family software has its own vulnerability history).

---

## 6. Korea Perspective — the blind spot of self-hosted Git

In Korean startups, research labs, and small SI shops, self-hosted Git like Gogs/Gitea is widely used because it is *"lightweight and free,"* but the following blind spots exist.

- **Asset-inventory gaps** — the "internal-only Git" mindset often leaves it out of security asset lists and vulnerability-scan scope.
- **CI/CD trust chain** — the Git server is the trust anchor not only for source code but for deploy keys, webhooks, and CI runner tokens. Server takeover can spread to build-pipeline poisoning.
- **Cross-tenant risk** — on shared instances hosting multiple teams/projects, this flaw becomes a path for one team to exfiltrate another's private code.

Recommendation: regardless of internet exposure, Korean operators should **immediately add their Gogs instances to inventory**, apply the §5 mitigations, and track patch developments.

---

## 7. Conclusion

This is not a new technique but a classic mistake — **trusting user input in a shell argument**. Yet the triple condition — (1) no precondition beyond authentication, (2) a public Metasploit module, and (3) no root patch — makes the real-world risk very high.

Self-hosted Git is the single trust anchor for an organization's most sensitive assets — source code, credentials, deployment pipelines. The greatest risk is leaving such systems unattended under the assumption that "it's internal, so it's fine." Until a patch arrives, removing exposure and hardening configuration is not optional but mandatory.

---

## References

[1] Ravie Lakshmanan, "Critical Gogs RCE Vulnerability Lets Any Authenticated User Execute Arbitrary Code", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/critical-gogs-rce-vulnerability-lets.html>

[2] Jonah Burgess, "Authenticated RCE via Argument Injection in Gogs (Unfixed)", Rapid7, 2026-05. <https://www.rapid7.com/blog/post/ve-authenticated-rce-via-argument-injection-gogs-unfixed/>

[3] Rapid7, "Metasploit module — Gogs git rebase argument injection RCE", GitHub PR #21515. <https://github.com/rapid7/metasploit-framework/pull/21515>

[4] Atlassian, "Merging vs. Rebasing", Git Tutorials. <https://www.atlassian.com/git/tutorials/merging-vs-rebasing>

[5] Git Documentation, "git-rebase — `--exec` option". <https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---execltcmdgt>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
