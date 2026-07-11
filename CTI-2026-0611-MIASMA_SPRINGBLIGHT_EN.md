# CTI-2026-0611 | Microsoft Supply Chain Attack — Mass Azure Package Infection by the Miasma (Spring Blight) Worm

> **⚠️ Alert Grade: CRITICAL**
> **First Published: 2026-06-11** | **Version: v1.0** | **Language: English**
> **Author: Dennis Kim (김호광 / HoKwang Kim)** · Betalabs Inc. · [gameworker@gmail.com](mailto:gameworker@gmail.com)
> **ORCID:** [0009-0002-0962-2175](https://orcid.org/0009-0002-0962-2175) · **GitHub:** [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

---

## Executive Summary

In early June 2026, a self-replicating worm malware family known as `Miasma` (also referred to as **"Spring Blight"**) used Microsoft’s official PyPI package `durationtask` versions v1.5.1 through v1.5.3 as an infection vector to penetrate the broader Azure Functions ecosystem. The worm stole GitHub Actions secrets and Azure OIDC authentication hashes, propagated covertly through developer environments, and culminated in a high-velocity supply chain incident in which **73 official Microsoft GitHub repositories were disabled in only 105 seconds on June 8**.

The stolen secrets were exposed in JSON format in a public repository named `Miasma: The Spring Blight`, and some CI/CD pipelines are assessed to have been directly or indirectly affected. Any organization using Microsoft Azure or the related open-source ecosystem should immediately rotate credentials and validate supply chain integrity.

---

## Table of Contents

1. [Incident Overview](#1-incident-overview)
2. [Attack Vector and Infection Path](#2-attack-vector-and-infection-path)
3. [Technical Analysis](#3-technical-analysis)
4. [MITRE ATT&CK Mapping](#4-mitre-attck-mapping)
5. [Indicators of Compromise (IoC)](#5-indicators-of-compromise-ioc)
6. [Scope of Impact](#6-scope-of-impact)
7. [Recommendations](#7-recommendations)
8. [Analyst Assessment and Limitations](#8-analyst-assessment-and-limitations)
9. [References](#9-references)

---

## 1. Incident Overview

| Field | Details |
|---|---|
| **Incident Name** | Miasma / Spring Blight supply chain attack |
| **First Discovery** | Early June 2026 (exact date unconfirmed) |
| **Major Incident Date** | 2026-06-08 |
| **Infection Vector** | PyPI package `durationtask` v1.5.1 ~ v1.5.3 |
| **Impact Scale** | 73 official Microsoft GitHub repositories disabled |
| **Time to Disable Repositories** | 105 seconds |
| **Primary Impact** | Theft of GitHub Actions secrets and Azure OIDC authentication hashes; CI/CD pipeline impact |
| **Attribution** | Unknown (TBD) |
| **Threat Category** | Supply chain attack, self-replicating worm, credential theft |

---

## 2. Attack Vector and Infection Path

### 2.1 Initial Intrusion: Malicious PyPI Package

The attacker inserted malicious code into three versions of Microsoft’s official PyPI package `durationtask` (v1.5.1, v1.5.2, and v1.5.3). The package is widely used in Azure Functions-related development environments, allowing the initial payload to execute via a `preinstall` hook at installation time.

```
Infection flow:
Install durationtask in a developer environment
  └─> Execute preinstall hook
        └─> Drop initial payload using the Bun runtime
              └─> Collect GitHub Actions environment variables / secrets
                    └─> Extract Azure OIDC tokens / managed identity hashes
                          └─> Infect adjacent repositories using stolen credentials (self-replication)
```

### 2.2 Self-Propagation Mechanism

The core capability of the Miasma worm is **self-replication**. Once it enters a developer environment, it:

1. Collects `GITHUB_TOKEN` and other environmental secrets from GitHub Actions workflows
2. Extracts token hashes used in Azure OIDC authentication flows
3. Uses the stolen credentials to redistribute malicious package versions into connected repositories
4. Uploads collected secrets as JSON to the public repository `Miasma: The Spring Blight`

### 2.3 Triggering Mass Repository Disablement

On June 8, 2026, GitHub’s automated security systems or internal detection mechanisms identified anomalous activity and disabled 73 official Microsoft repositories in bulk within an exceptionally short window of **105 seconds**. The speed strongly suggests intervention by an automated response system.

---

## 3. Technical Analysis

### 3.1 Malicious Package Analysis

- **Package Name:** `durationtask`
- **Malicious Versions:** v1.5.1, v1.5.2, v1.5.3
- **Infection Mechanism:** `preinstall` hook in `setup.py` or `pyproject.toml`
- **Runtime Use:** Bun (JavaScript runtime), a lightweight execution environment that can run without a Node.js environment

### 3.2 Targeted Credentials

| Credential Type | Theft Method | Impact Level |
|---|---|---|
| GitHub Actions Secrets | Environment variable dump | High |
| Azure OIDC authentication hashes | Token interception | Very High |
| GitHub Token (`GITHUB_TOKEN`) | Workflow environment access | High |
| Azure Managed Identity | OIDC integration flow theft | Very High |

### 3.3 Data Exfiltration Path

The stolen credentials were uploaded in JSON format to a public GitHub repository named `Miasma: The Spring Blight`. This suggests the attacker may have intended either to showcase the scale of the compromise or to expose the data publicly for use by other threat actors in follow-on activity.

---

## 4. MITRE ATT&CK Mapping

| Tactic | Technique ID | Technique Name | Related Activity |
|---|---|---|---|
| Initial Access | T1195.001 | Supply Chain Compromise: Compromise Software Dependencies | Distribution of malicious PyPI package |
| Execution | T1059.007 | Command and Scripting Interpreter: JavaScript | Execution of Bun runtime |
| Persistence | T1053 | Scheduled Task/Job | Execution through preinstall hook |
| Credential Access | T1552.001 | Unsecured Credentials: Credentials In Files | Collection of GitHub Secrets |
| Credential Access | T1528 | Steal Application Access Token | Theft of Azure OIDC tokens |
| Lateral Movement | T1550.001 | Use Alternate Authentication Material: Application Access Token | Repository movement using stolen tokens |
| Exfiltration | T1567.001 | Exfiltration Over Web Service: Exfiltration to Code Repository | Upload of secrets to a public GitHub repository |

---

## 5. Indicators of Compromise (IoC)

> ⚠️ The IoCs below are based on publicly available information as of publication and may be updated as further analysis becomes available.

### 5.1 Malicious Packages

| Type | Value | Notes |
|---|---|---|
| PyPI Package | `durationtask==1.5.1` | Malicious version |
| PyPI Package | `durationtask==1.5.2` | Malicious version |
| PyPI Package | `durationtask==1.5.3` | Malicious version |

### 5.2 Behavior-Based IoCs

| Type | Value / Pattern | Notes |
|---|---|---|
| Process | `bun` execution logs during the preinstall phase | Abnormal Bun execution |
| GitHub Repository | `Miasma: The Spring Blight` (public repository name) | Repository storing leaked data |
| File Pattern | Secret dump files in JSON format | Leaked data format |
| Network | High-volume GitHub API calls at abnormal frequency | Self-replication activity |

---

## 6. Scope of Impact

### 6.1 Direct Impact

- **73 official Microsoft GitHub repositories** disabled within 105 seconds on 2026-06-08
- Assessed to include Azure Functions-related development tools and SDK repositories
- Multiple GitHub Actions secrets and Azure OIDC credentials exposed

### 6.2 Indirect Impact

- Potential compromise of **all developer environments** that installed malicious versions of `durationtask`
- Possible integrity compromise of **software packages** distributed through affected CI/CD pipelines
- Potential cascading impact on **downstream organizations** using Azure Functions

### 6.3 Affected Organization Types

- Organizations using Azure Functions / Azure DevOps
- Organizations depending on Microsoft public repository dependencies
- Organizations operating Python-based CI/CD pipelines, especially GitHub Actions integrated with Azure

---

## 7. Recommendations

### 🔴 Immediate Actions (within 24 hours)

1. **Immediately rotate credentials**
   - Reissue all Azure OIDC tokens and Managed Identities
   - Replace all GitHub Actions secrets
   - Regenerate Azure Service Principal credentials

2. **Remove malicious packages**
   - Immediately remove `durationtask` v1.5.1 ~ v1.5.3
   - Check installed versions with `pip list` or `pip freeze`, then downgrade to a safe version or remove the package
   - Review dependency lists in `requirements.txt`, `pyproject.toml`, and `setup.py`

3. **Check for compromise**
   - Search CI/CD logs for abnormal `bun` execution
   - Review GitHub Actions workflow execution history
   - Check whether organizational secrets were exposed in the public repository `Miasma: The Spring Blight`

### 🟡 Short-Term Actions (within 7 days)

4. **Validate supply chain integrity**
   - Perform hash validation across all currently used PyPI packages
   - Integrate `pip-audit` or `safety` into CI/CD
   - Consider using Azure Artifacts or a private package feed

5. **Strengthen monitoring**
   - Enable GitHub Advanced Security alerts
   - Harden Azure Defender for DevOps policies
   - Add SIEM detection rules for preinstall hook execution

### 🟢 Medium- to Long-Term Actions (within 30 days)

6. **Establish supply chain security policy**
   - Maintain an allowlist of approved PyPI packages
   - Apply version pinning policies for external packages
   - Introduce SBOM (Software Bill of Materials) generation and management

---

## 8. Analyst Assessment and Limitations

### Assessment

This incident illustrates the rapidly increasing sophistication of **software supply chain attacks**. In particular:

- The **self-replication mechanism** moved beyond simple malicious package distribution and implemented worm-level autonomous propagation
- The **105-second repository disablement window** suggests Microsoft and GitHub’s automated security response mechanisms were activated, but broad compromise may already have occurred before those controls intervened
- The targeting of **OIDC tokens** indicates that the threat is evolving beyond conventional token theft into a broader challenge to cloud IAM architectures

Attribution remains unknown. The possibility of involvement by a state-sponsored threat actor or a highly skilled financially motivated group cannot be excluded.

### ⚠️ Analytical Limitations

- This report is an **independent analysis based on public information** and is not an official incident analysis from Microsoft or GitHub
- Detailed code analysis and hashes for the malicious versions should be treated as provisional until officially confirmed
- The affected repository list and exact scope of exposed secrets should be updated following any official Microsoft disclosure

---

## 9. References

- Microsoft Security Response Center (MSRC): https://msrc.microsoft.com/
- GitHub Security Advisories: https://github.com/advisories
- PyPI Advisory Database: https://pypi.org/security/
- MITRE ATT&CK Supply Chain Compromise: https://attack.mitre.org/techniques/T1195/
- CISA Supply Chain Risk Management: https://www.cisa.gov/supply-chain

---

<sub>© 2026 Dennis Kim (김호광 / HoKwang Kim) · Betalabs Inc. · This report is released under independent research and is provided for informational purposes. All findings are based on publicly available information at the time of writing.</sub>

<sub>📌 Report filename: `CTI-2026-0611-MIASMA_SPRINGBLIGHT_EN.md` | Series: CYBER-THREAT-INTELLIGENCE-REPORT</sub>
