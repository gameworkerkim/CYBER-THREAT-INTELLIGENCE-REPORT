# CTI-2026-0510-LAZARUS-GITHOOKS

## North Korean Lazarus Group's New Concealment Technique: `.git/hooks/` as a Second-Stage Loader for the Contagious Interview / TaskJacker Campaign
### English Edition — `TLP:GREEN`

---

| Field | Value |
|---|---|
| **Report ID** | CTI-2026-0510-LAZARUS-GITHOOKS |
| **Publication Date** | 2026-05-10 |
| **TLP** | TLP:GREEN |
| **Severity** | 🔴 HIGH — Direct targeting of Korean developers, exchanges, and Web3 entities |
| **Classification** | Threat Actor Campaign / Supply Chain via Social Engineering / Developer Targeting |
| **Keywords** | Lazarus Group, DPRK, Contagious Interview, TaskJacker, Famous Chollima, BeaverTail, InvisibleFerret, OtterCookie, git hooks, post-merge, post-checkout, MITRE G1052, fake recruiter |
| **Primary Source** | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" (2026-05) |
| **Cross-Verification** | Microsoft Security Blog (2026-03), Abstract Security (2026-03), Cisco Talos (2025-10), Socket (2025-06~10), NVISO Labs (2025-11), Malpedia G1052 |
| **Related Reports** | CTI-2026-0507-SCARCRUFT (APT37, separate DPRK cluster) · CTI-2026-0422-MCP §3.3 (UNC1069/Sapphire Sleet supply chain poisoning) |
| **Author** | Dennis Kim, https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT |

---

## 1. Executive Summary

In May 2026, OpenSourceMalware disclosed a new variant in which the North Korean Lazarus Group (MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima) **conceals the second-stage loader of its fake-recruitment campaign inside the `.git/hooks/` directory**.

This analysis reveals that North Korea is now actively adopting AI LLMs to evade detection and to pivot in real time across the languages and platforms best suited to each target.

### Key Judgments

| # | Judgment | Confidence |
|---|---|---|
| **KJ-1** | Lazarus has progressively evolved its delivery mechanism: npm packages → fake video-conferencing tools → VS Code Tasks → **git hooks**. Each evolution is a direct response to a defender-side block (e.g., the Microsoft VS Code 1.109/1.110 patches in February 2026). | **High** |
| **KJ-2** | Because `.git/hooks/` is **not tracked by git itself**, it is a blind spot invisible to PR diffs and code review. A target who simply runs `clone` and then `pull` or `merge` is compromised without ever executing a single line of code. | **High** |
| **KJ-3** | The primary targets are developers in **blockchain, fintech, and defense**. Korea's exposure is well above the global average due to LinkedIn Korea activity, the concentration of DAXA-listed exchanges and Web3 issuers, and the size of the foreign-currency-paid freelance pool. | **High** |
| **KJ-4** | The final payloads (BeaverTail → InvisibleFerret) specialize in stealing **cryptocurrency wallets (Solana, Exodus), browser credentials, and the macOS Keychain**. The same infrastructure has been linked to the Bybit ($1.4B), Stake ($41M), and CoinEx ($27M) thefts. | **High** |
| **KJ-5** | The true threat of this campaign is not a single technique — it is that Lazarus **weaponizes the moment when developers' guard is naturally down: the recruitment process**. Technical controls alone cannot fully prevent this; **developer OPSEC training and mandated isolated environments must be controls of equal weight**. | **Medium-High** |

---

## 2. Background

### 2.1 Evolution Trajectory of the Contagious Interview Campaign

| Period | Delivery Mechanism | Notable Cases | Defender Response |
|---|---|---|---|
| 2022 ~ 2024 | **npm package typosquatting** | `is-buffer-validator`, `yoojae-validator`, `event-handle-package`, `array-empty-validator`, `react-event-dependency`, `auth-validator`, etc. | Removed via Socket / npm reports |
| 2024 ~ 2025 H1 | **Fake video-conferencing tools** | macOS / Windows binaries impersonating "MiroTalk Studio" and similar | VirusTotal / EDR signatures |
| 2025 H2 | **Large-scale npm campaign** | Socket: 67 packages (2025-06) → **338 packages, 50,000 downloads** (2025-10). New XORIndex loader disclosed | Stronger automated package scanning |
| 2026 Q1 | **Abuse of VS Code / Cursor Tasks** | Auto-execute attribute in `.vscode/tasks.json` exploited. C2: `hxxp://144.172.115[.]189:8080` | **Microsoft VS Code 1.109 (2026-01) and 1.110 (2026-02) changed automatic task execution to OFF by default** |
| **2026 Q2 (current)** | **Concealment in `.git/hooks/`** | OpenSourceMalware (2026-05). BeaverTail downloader injected into `post-merge`, `post-checkout`, and `pre-push` hooks | (No blocking mechanism currently in place) |

Each evolution arrived shortly after a defensive measure against the previous variant. **Every time defenders close one channel, Lazarus moves to a deeper one within roughly three to six months.**

### 2.2 Threat Actor Attribution

This campaign is tracked under the following names:

| Tracker | Cluster Name |
|---|---|
| **MITRE ATT&CK** | **G1052 — Contagious Interview** |
| **CrowdStrike** | Famous Chollima |
| **Microsoft** | Sapphire Sleet (related, partial overlap) |
| **Mandiant** | UNC4034 / DPRK CryptoCore (related) |
| **Lazarus parent group** | (Conventional) Lazarus Group, APT38 |

⚠️ **Caveat**: Contagious Interview is not the entirety of Lazarus's activity — it is a **dedicated sub-cluster for fake-recruitment operations against developers**. It is distinct from APT37 (ScarCruft), Kimsuky, and other DPRK clusters.

---

## 3. Attack Chain Analysis

### 3.1 Five-Stage Infection Flow

```
[1] Reconnaissance & Contact  →  [2] Trust Building  →  [3] Coding-Task Delivery  →  [4] Git Hook Trigger  →  [5] Persistent Backdoor
```

| Stage | Action | Target's Awareness |
|---|---|---|
| **1. Reconnaissance & Contact** | Identify targets on LinkedIn / job boards / freelance platforms (Upwork, Fiverr, etc.). Approach with a fake recruiter persona using AI-generated profile photos | "A company I'm interested in just reached out to me." |
| **2. Trust Building** | A legitimate-looking company domain (WHOIS typically a few weeks to a few months old), an English-language email, and a multi-stage interview process | "This is a normal recruitment process." |
| **3. Coding-Task Delivery** | A private or zipped repository on GitHub / GitLab / Bitbucket. On the surface, an ordinary React, Node, or Python challenge | "The code itself looks fine." |
| **4. Git Hook Trigger** | When the target runs **routine commands** like `git clone`, `git pull`, `git merge`, or `git checkout`, `.git/hooks/post-merge` or `post-checkout` runs silently and downloads BeaverTail | **Not noticed** — most developers never look at `.git/hooks/` |
| **5. Persistent Backdoor** | BeaverTail installs InvisibleFerret (a Python backdoor) which steals credentials and crypto wallets, communicates with C2, and establishes persistent access | Delayed awareness (days to weeks later, when assets are lost) |

### 3.2 Why `.git/hooks/` Is a New Blind Spot

| Property | Description |
|---|---|
| **Excluded from Git tracking** | The `.git/hooks/` directory, **like `.git/` itself, is not tracked by git**. It will never appear in PR diffs, code reviews, or `git log`. |
| **Auto-execution** | A target need not execute a single line of code; a single `git pull` is enough to fire the hook. |
| **Privilege context** | Hooks run with user permissions and have full access to the network, file system, and child-process spawning. |
| **Surface normality** | The repository's actual code (README, source files) may be entirely legitimate. SAST and static analysis pass cleanly. |
| **Developer blind spot** | Even senior developers rarely inspect `.git/hooks/`. It is hidden behind tooling. |

> **Diagnosis**: Git hooks weaponize a **trust asymmetry** — "Git itself is treated as part of the trust boundary, but users never look inside it." What SolarWinds and XZ Utils did to build systems, this campaign does to **individual developer workstations**.

---

## 4. Malware Analysis

### 4.1 BeaverTail (Stage 1 Payload)

| Field | Value |
|---|---|
| **Language / Platform** | JavaScript (Node.js runtime) |
| **Role** | Infostealer + downloader for the second-stage payload (InvisibleFerret) |
| **Target Data** | • Browser credentials (Chrome, Brave, Firefox)<br>• Crypto wallets (Solana CLI keys, Exodus, MetaMask)<br>• macOS Keychain<br>• SSH keys, AWS / GCP credentials |
| **Sandbox Evasion** | Keyword scan for qemu, virtual, parallels, virtualbox, vmware |
| **C2 Communication** | Multiple rotating IPs, HTTP POST exfiltration |
| **Variants** | OtterCookie (Cisco Talos analysis 2025-10, with an additional JavaScript module) |

### 4.2 InvisibleFerret (Stage 2 Payload)

| Field | Value |
|---|---|
| **Language / Platform** | Python (all OS) |
| **Role** | Persistent backdoor, RAT functionality, additional-payload stager |
| **Persistence** | • Linux: cron + systemd user unit<br>• macOS: LaunchAgent (`~/Library/LaunchAgents/`)<br>• Windows: Run key + Scheduled Task |
| **Variants** | TsunamiKit (HiSolutions 2025-04), GolangGhost (Silent Push 2025-04, Go port) |

### 4.3 Toolchain Lineage (2025–2026)

```
BeaverTail (JS)  ──→  InvisibleFerret (Python)  ──→  TsunamiKit (Python, 2025 Q2)
       │
       ├──→  OtterCookie (JS module, 2025-10)
       │
       └──→  GolangGhost (Go, 2025 Q2)        ──→  FrostyFerret (Go, macOS-specific)
                                                            │
                                                            └──→  XORIndex Loader (2025-10)
```

This source-tree branching shows Lazarus's standard operating pattern of **porting identical functionality across multiple language stacks (JS, Python, Go)** to evade EDR detection.

**One-line takeaway: The advance of AI LLMs is enabling North Korea to perform real-time porting for evasion at unprecedented speed.**

---

## 5. Korean Impact Assessment

### 5.1 Why Korean Developers Are Above the Global Average for Exposure

| Factor | Description | Risk Amplification |
|---|---|---|
| **LinkedIn Korea activity** | ~7 million Korean LinkedIn users in 2025; developers and the blockchain segment are among the most active groups | Abundant initial-contact channel |
| **Density of DAXA exchanges and Web3 startups** | Five won-pair exchanges (Upbit, Bithumb, Coinone, Korbit, Gopax) + DAXA member firms + numerous Web3 issuers, all headquartered in Seoul | High target value |
| **Foreign-currency-paid freelance pool** | A growing population of Korean developers active on Upwork / Fiverr / Toptal (especially frontend and smart-contract specialists) | Fake-recruiter approaches feel natural |
| **Accelerated adoption of AI coding tools** | Cursor, Claude Code, Copilot adoption rising → exposure to the `.vscode/tasks.json` variant rises in parallel | The previous variant remains live |
| **Defense / aerospace LinkedIn footprint** | Developers at supplier firms (KAI, LIG Nex1, Hanwha, etc.) publicly browse recruitment listings on LinkedIn | National-security-grade threat |

### 5.2 Threat Scenarios

| Scenario | Likelihood | Impact | Priority |
|---|---|---|---|
| **S1.** Exchange back-office developer's credentials stolen after a fake interview → lateral movement inside the exchange | Very High | Very High | P0 |
| **S2.** A Web3 issuer's Solidity developer leaks a deploy key / multisig seed → token-contract owner takeover | Very High | Very High | P0 |
| **S3.** A freelance developer is infected → backdoors propagate across multiple clients' codebases | High | High | P1 |
| **S4.** A defense-supplier developer is infected → portions of classified weapon-system code leak | Medium-High | Very High | P0 (national security) |
| **S5.** An AI-company ML engineer is infected → model weights / training data leak | Medium | High | P1 |

### 5.3 Historical Loss Magnitude (Lazarus-Attributed)

| Incident | Date | Loss |
|---|---|---|
| Bybit hack | 2025 | **~$1.4 billion** (largest single exchange theft ever) |
| Stake.com hack | 2023 | $41 million |
| CoinEx hack | 2023 | $27 million |
| Atomic Wallet | 2023 | $100 million+ |
| **Cumulative estimate** | 2017–2026 | **$3 billion+** (Chainalysis) |

The fact that **Lazarus's revenue stream funds the DPRK regime's nuclear and missile programs** has been confirmed repeatedly by the U.S. Treasury and UN panel reports. Blocking this campaign is therefore not a routine security matter but a **national-security and sanctions-enforcement matter**.

---

## 6. Indicators of Compromise (IOC)

> ⚠️ These IOCs are cross-extracted from public materials by OpenSourceMalware, Microsoft, Cisco Talos, Abstract Security, and Socket. They change in real time. **Always re-verify the latest state before operational use.**

### 6.1 Network IOCs (representative values, point-in-time)

| Type | Value | Source |
|---|---|---|
| C2 IP | `144.172.115[.]189:8080` | Abstract Security (2026-03) |
| Payload domain | `camdriver[.]pro` (downloads WebCam.zip on macOS) | Abstract Security (2026-03) |
| C2 pattern | HTTP POST accompanied by `excludeFolders` and `scanDir` keywords | Microsoft (2026-03) |

### 6.2 Host IOCs (Behavioral)

| Indicator | Description |
|---|---|
| Base64-encoded payload or `curl` / `wget` download in `.git/hooks/post-merge`, `post-checkout`, or `pre-push` | Git-hook variant |
| New plist created under `~/Library/LaunchAgents/` | macOS persistence |
| New `.desktop` file under `~/.config/autostart/` | Linux persistence |
| New entry in Windows `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` | Windows persistence |
| `node` process whose command line includes `qemu`, `vmware`, `parallels` | BeaverTail sandbox evasion |
| `wscript.exe` running `.vbs` from PowerShell / CMD / a temp directory | OtterCookie variant |
| Suspicious filenames: `WebCam.zip`, `WebCam/`, `update.dmg`, `MiroTalk*.zip` | Fake-conferencing-tool variant |

### 6.3 Behavioral IOCs (Developer-Workstation Hunting)

| Pattern | Suspicious Signal |
|---|---|
| Outbound traffic to an external domain within 1–10 seconds after `git pull` or `git merge` | Possible hook trigger |
| A Node.js process simultaneously importing `clipboard`, `socket.io`, and `axios` | BeaverTail payload signature |
| Python making external calls via `requests`, `subprocess`, and `base64`, then spawning a child process | InvisibleFerret pattern |

---

## 7. Detection Rules / Hunting Queries

### 7.1 Microsoft Defender XDR (KQL — based on Microsoft's public rule, 2026-03)

```kql
DeviceProcessEvents
| where (
    (InitiatingProcessCommandLine has_all ("axios", "const uid", "socket.io")
        and InitiatingProcessCommandLine contains "clipboard") or
    (InitiatingProcessCommandLine has_all ("excludeFolders", "scanDir", "curl ", "POST")) or
    (ProcessCommandLine has_all ("*bitcoin*", "credential", "*recovery*", "curl ")) or
    (ProcessCommandLine has_all ("node", "qemu", "virtual", "parallels", "virtualbox", "vmware", "makelog")) or
    (ProcessCommandLine has_all ("http", "execSync", "userInfo", "windowsHide")
        and ProcessCommandLine has_any ("socket", "platform", "release", "hostname", "scanDir", "upload"))
)
```

### 7.2 Git-Hooks-Specific Hunting (Custom)

#### 7.2.1 macOS / Linux (bash)
```bash
# Search for suspicious patterns in every .git/hooks/ directory under the user's home
find "$HOME" -type d -name "hooks" -path "*/.git/*" 2>/dev/null \
  | while read dir; do
      grep -lE "curl |wget |base64 -d|eval |\$\(.*http" "$dir"/* 2>/dev/null
    done
```

#### 7.2.2 osquery
```sql
SELECT path, sha256, mtime
FROM file
WHERE path LIKE '%/.git/hooks/%'
  AND filename IN ('post-merge', 'post-checkout', 'pre-push', 'post-rewrite', 'pre-commit')
  AND size > 100;
```

#### 7.2.3 Splunk
```spl
index=endpoint sourcetype=osquery
  path="*.git/hooks/*"
  filename IN ("post-merge","post-checkout","pre-push")
| search content="*curl *" OR content="*base64 *" OR content="*wget *"
| stats count by host, path
```

### 7.3 Recommended SIEM Correlation Rule

```
RULE: Contagious Interview Git Hook Trigger
WHEN:
  - process = git (clone|pull|merge|checkout)
  AND followed by within 30 seconds:
    - outbound HTTP/HTTPS to non-organization domain
    - by user-context process (not system)
THRESHOLD: 1 occurrence on developer workstation
ACTION: Alert + auto-quarantine cloned directory
```

---

## 8. Defense Recommendations

### 8.1 Individual Developers

| # | Action | Command / Setting |
|---|---|---|
| 1 | **Inspect hooks immediately after cloning** | `ls -la .git/hooks/` then `cat post-merge post-checkout pre-push 2>/dev/null` |
| 2 | **Disable global hooks path** | `mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks` |
| 3 | **Run assessment code in isolation only** | `docker run --rm -it --network none ubuntu:24.04 bash` (network-isolated container) |
| 4 | **Block npm install scripts** | `npm config set ignore-scripts true` (global default) |
| 5 | **Isolate pip dependencies** | `pip install --no-deps <pkg>`, or enforce `pipx` / `venv` |
| 6 | **5-minute recruiter / company verification rule** | WHOIS domain age, LinkedIn employee history, match against the company's official site |
| 7 | **Hardware-key (YubiKey, etc.) requirement** | Even stolen credentials cannot bypass 2FA |
| 8 | **Permanently separate crypto seeds from the workstation** | Use cold wallets only (Ledger, Trezor); hot keys reserved for transient transactions |

### 8.2 Enterprise

| # | Action | Owner |
|---|---|---|
| 1 | Enterprise Git client policy: enforce `core.hooksPath` to a company-managed directory (MDM / domain policy) | IT / SecOps |
| 2 | **Single-use BYOD separation** for developer workstations — separate corporate work from personal freelance activity by policy | HR + IT |
| 3 | Deploy the KQL / osquery rules in §7 to the EDR fleet | SecOps |
| 4 | Mandatory OPSEC training for new developers — integrated module covering Contagious Interview, SCARCRUFT, and MCP variants | InfoSec / HR |
| 5 | DAXA exchanges and Web3 issuers: **physically and logically separate workstations holding deploy keys / multisig seeds from general development environments (HSM or air-gap)** | CISO / Treasury |
| 6 | In-house GitLab / GitHub Enterprise: automatically scan ZIPs / tarballs ingested from external sources (including `.git/hooks/` content rules) | DevSecOps |

### 8.3 Korea-Specific Recommendations for Exchanges and Web3 Issuers

| Area | Recommendation |
|---|---|
| **DAXA-level** | Add "developer workstation `.git/hooks/` inspection" as a mandatory item in member-firm security checks |
| **Exchange hot-wallet operations** | Multisig signing workstations must be **internet-blocked**, USB-blocked, and use a separate keychain |
| **Web3 issuers** | Smart-contract deploy keys may only be used on a separate air-gap machine and must never be shared with the LinkedIn-active machine used for general development |
| **Hiring freelancers** | Strengthen identity verification for external freelancers; require initial code execution / verification in an isolated environment before accepting any PR |
| **Onboarding / interview phase** | Pre-employment security briefings must explicitly warn: "There may be a fake recruiter on LinkedIn targeting you." |

### 8.4 Policy Recommendations

1. **Joint advisory by KISA / NIS / KoFIU** — regular campaign aimed at developers in exchanges, Web3, and the broader financial sector.
2. **Update DAXA self-regulatory guidelines** — add "issuer's deploy-key-environment separation" to the listing review criteria.
3. **LinkedIn activity guidelines for defense / aerospace suppliers** — explicit policy for security-clearance-holding developers' use of external recruitment platforms.
4. **Cooperation with LinkedIn Korea** — strengthen the reporting channel and proactive takedown for suspected DPRK fake-recruiter profiles.

---

## 9. MITRE ATT&CK Mapping

| Tactic | Technique | ID | Application in This Campaign |
|---|---|---|---|
| Reconnaissance | Gather Victim Identity Information | T1589 | LinkedIn profile scraping, recruitment-info gathering |
| Resource Development | Establish Accounts | T1585 | Fake recruiter / fake company LinkedIn accounts |
| Resource Development | Acquire Infrastructure: Domains | T1583.001 | Newly registered company domains (weeks to months old) |
| Initial Access | Phishing: Spearphishing via Service | T1566.003 | Recruitment lure via LinkedIn DM / email |
| Initial Access | Trusted Relationship | T1199 | Abuse of recruitment-process trust |
| Execution | User Execution: Malicious File | T1204.002 | Target manually runs `git clone` then routine commands |
| Execution | **Event Triggered Execution: Component Object Model Hijacking → Git Hooks (variant)** | T1546 (cluster) | **Core novel technique of this campaign** |
| Persistence | Boot or Logon Autostart Execution | T1547 | LaunchAgent / Run key / cron |
| Defense Evasion | Hide Artifacts: Hidden Files and Directories | T1564.001 | `.git/hooks/` invisible in regular GUIs |
| Defense Evasion | Virtualization/Sandbox Evasion | T1497 | qemu / vmware keyword checks |
| Credential Access | Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Chrome / Brave / Firefox credentials |
| Credential Access | Credentials from Password Stores: Keychain | T1555.001 | macOS Keychain |
| Collection | Data from Local System | T1005 | Crypto wallets, SSH keys |
| Command and Control | Application Layer Protocol: Web Protocols | T1071.001 | HTTP POST exfiltration |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | C2 IP or domain |

**MITRE Group ID**: **G1052 (Contagious Interview)** — `https://attack.mitre.org/groups/G1052`

---

## 10. Bottom Line

### 10.1 One-Line Summary

> **Lazarus moved from npm to fake video-conferencing tools to VS Code Tasks to git hooks. The next evolution is six months away.**

### 10.2 Three Questions This Campaign Forces on Korea

1. **Developers' guard is most relaxed during recruitment. Is your organization protecting that moment?**
2. **`.git/hooks/` was a blind spot. What other blind spots untouched by code review exist on your workstations?** (Next targets may be `.gitattributes` filters, `.npmrc` `prepare`, `.devcontainer/`, or `Makefile`.)
3. **Lazarus is not after a single developer's machine — they are after the assets of Korean exchanges, Web3 issuers, and defense suppliers that one developer is the entry point to. Has your organization measured the blast radius of losing one developer?**

### 10.3 The One Mandatory Action

**Run this single line on every developer workstation today:**

```bash
mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks
```

This single line **immediately neutralizes the git-hook variant of this campaign at the individual level**. Cost: zero. Time: 30 seconds. At the organizational level it can be enforced via MDM / domain policy.

---

## 11. References

| # | Source | Date | Note |
|---|---|---|---|
| 1 | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" | 2026-05 | Primary analysis target of this report |
| 2 | Matteo Bisi, "Lazarus Group Hides Malware in Git Hooks to Target Developers" (msbiro.net) | 2026-05-06 | Secondary commentary |
| 3 | Microsoft Security Blog, "Contagious Interview: Malware delivered through fake developer job interviews" | 2026-03-11 | Provides KQL rule |
| 4 | Abstract Security, "Contagious Interview: Evolution of VS Code and Cursor Tasks Infection Chains Part 2" | 2026-03 | C2 IP disclosed |
| 5 | OpenSourceMalware, "Contagious Interview campaign abuses Microsoft VSCode tasks" | 2025-11-28 | Previous variant |
| 6 | NVISO Labs, "Contagious Interview Actors Now Utilize JSON Storage Services for Malware Delivery" | 2025-11-13 | Toolchain lineage |
| 7 | Cisco Talos, "BeaverTail and OtterCookie evolve with a new Javascript module" | 2025-10-16 | Tool analysis |
| 8 | Socket, "North Korea's Contagious Interview Campaign Escalates: 338 Malicious npm Packages, 50,000 Downloads" | 2025-10-10 | Scale |
| 9 | Socket, "Another Wave: 35 New Malicious npm Packages" | 2025-06-24 | npm evolution |
| 10 | ANY.RUN, "OtterCookie: Analysis of Lazarus Group Malware Targeting Finance and Tech Professionals" | 2025-06-03 | Target analysis |
| 11 | ESET Research, "ESET APT Activity Report Q4 2024–Q1 2025" | 2025-05-12 | Group activity |
| 12 | NTT Security, "Additional Features of OtterCookie Malware Used by WaterPlum" | 2025-05-07 | Variant analysis |
| 13 | HiSolutions, "Rolling in the Deep(Web): Lazarus Tsunami" | 2025-04-25 | TsunamiKit |
| 14 | Silent Push, "Contagious Interview Launches a New Campaign Creating Three Front Companies" | 2025-04-24 | Infrastructure |
| 15 | MITRE ATT&CK, Group G1052 | continually updated | Standard tracker |
| 16 | Malpedia, py.invisibleferret | continually updated | Tool catalog |

---

**End of Report — CTI-2026-0510-LAZARUS-GITHOOKS — TLP:GREEN**

*2026-05-10*
*© 2026 Dennis Kim (김호광) · gameworker@gmail.com · https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT*
