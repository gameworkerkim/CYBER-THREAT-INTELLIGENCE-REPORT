# IronWorm — Analysis of a Rust/eBPF-Based Self-Replicating npm Supply Chain Worm

> **A self-propagating infostealer targeting Web3 and cryptocurrency developers**
> *Rust ELF Payload × eBPF Rootkit × npm preinstall Self-Replication*

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0605-IRONWORM` |
| **Publication Date** | 2026-06-05 |
| **Severity** | 🔴 HIGH — Self-propagating supply chain compromise and developer credential theft |
| **Classification** | `TLP:GREEN` |
| **Threat Type** | Self-Propagating Supply Chain Worm / Credential & Crypto Stealer |
| **Target** | Software developers, especially in the cryptocurrency and Web3 sectors |
| **First Observed** | 2026-06-04 (suspicious republication of packages in the Arweave/WeaveDB ecosystem) |
| **Attribution** | Unconfirmed — partial overlap hypothesis with DPRK TTPs (Low) |
| **Korea Coverage** | No KISA or security press coverage as of publication |
| **Confidence** | High (tradecraft) / Low (attribution) |

---

## 1. Executive Summary

A new self-replicating supply chain attack named "IronWorm" has been confirmed in the wild. It is a heavyweight infostealer **written in Rust** and concealed behind an **eBPF rootkit**, targeting software developers, especially the **cryptocurrency and Web3 ecosystem**, where exposed secrets can be monetized immediately. Its operating model mirrors the Shai-Hulud lineage that emerged in September 2025 and reshaped the npm threat landscape in 2026. IronWorm weaponizes stolen credentials to inject itself into victims’ GitHub repositories and directly publishes trojanized packages to the npm registry, enabling **propagation without human intervention**.

Initial detection originated from multiple npm packages in the Arweave/WeaveDB ecosystem being suspiciously republished within a short time window. Packages published by the compromised account `asteroiddao` appeared normal on the surface, but contained an approximately **976KB Linux ELF binary** hidden inside the `tools/` directory. The binary was designed to execute silently during installation through an **npm `preinstall` hook**.

This incident occurred in the **same week** as a sequence of related supply chain events: the Miasma worm compromised the Red Hat npm scope on June 1, 2026, and the Phantom Gyp campaign struck 57 packages, including @vapi-ai/server-sdk, on June 3. The npm ecosystem is therefore no longer facing isolated events, but has entered a persistent threat phase of **multiple self-propagating worms operating concurrently**.

---

## 2. Key Judgments

- **KJ-1 (High):** IronWorm inherits the Shai-Hulud formula of "compromised trusted maintainer privileges → automated republication," but significantly increases detection and analysis difficulty through a **Rust native binary plus eBPF rootkit**. Compared with earlier script-based worms, it has stronger EDR evasion and persistence characteristics.
- **KJ-2 (High):** Because it uses a **`preinstall` hook execution** model, the payload runs at `npm install` time, before application code execution and without warning. Both CI/CD pipelines and developer workstations are primary infection surfaces.
- **KJ-3 (Medium):** Because the targeting is concentrated on cryptocurrency and Web3 and focuses on credentials, API keys, and wallets, compromise can produce **immediate fund theft and secondary supply chain propagation** at the same time.
- **KJ-4 (Low):** The focus on crypto and Web3 developers overlaps with typical motivations of DPRK-linked actors, but **attribution cannot be concluded** from currently public evidence. The possibility of copycat actors reusing public worm source code cannot be excluded.

---

## 3. Technical Analysis

- **Language / Form:** Rust-compiled ELF, approximately 976KB, hidden in the `tools/` directory.
- **Execution Trigger:** npm `preinstall` lifecycle hook; runs immediately during installation and does not require import.
- **Concealment:** eBPF rootkit-based stealth, blocking process and network visibility to evade user and EDR observation.
- **Collection Targets:** Developer and CI credentials, API keys, cryptocurrency wallets and keys.
- **Propagation:** Injects into victim GitHub repositories using stolen credentials, then publishes trojanized packages to npm for self-replication.
- **Observed Entry Point:** Republication cluster involving Arweave/WeaveDB-related packages and publisher account `asteroiddao`.

> Comparison: Miasma (Phantom Gyp) used a `binding.gyp`-based bypass that avoided `preinstall` and `postinstall`, whereas IronWorm takes the opposite approach by using `preinstall` directly while strengthening post-execution stealth through a **native binary plus rootkit**.

---

## 4. MITRE ATT&CK Mapping

| Tactic | Technique | ID |
| --- | --- | --- |
| Initial Access | Supply Chain Compromise: SW Dependencies | T1195.002 |
| Execution | User Execution: Malicious Package (preinstall) | T1204.003 |
| Persistence / Evasion | Rootkit (eBPF) | T1014 |
| Credential Access | Unsecured Credentials / Cloud & npm Tokens | T1552 |
| Collection | Data from Local System (wallet/keys) | T1005 |
| Lateral / Propagation | Compromise Software Supply Chain (self-replication) | T1195 |

---

## 5. Korea Impact and Response

### 5.1 Domestic Exposure Assessment

- **Direct impact on Korean Web3 and blockchain developers.** Korean Web3 development organizations, including Kaia (formerly Klaytn), DeSci, NFT, DeFi, and game token projects, depend heavily on npm, and many store cryptocurrency wallets and exchange API keys in development environments. This aligns precisely with IronWorm’s target profile.
- **Exchange and fintech CI/CD risk.** If build pipelines at DAXA member exchanges or fintech firms pull infected npm packages, the impact can expand beyond simple information leakage into **operational credential and signing-key theft, creating fund and smart contract threats**.
- **Targeting of solo and small developers.** One-person studios and researchers with limited staffing often have weak token rotation and isolated build systems, making them likely footholds for self-propagating worms.

### 5.2 Korean Government and Institutional Response Perspective

- **KISA / KrCERT:** A **consolidated security notice and IoC distribution** is needed for the sequence of npm supply chain worms from Shai-Hulud to Miasma to IronWorm. An "open-source registry install-hook threats" section should be added as an annex to KISA’s software supply chain security guide.
- **Ministry of Science and ICT (MSIT):** SBOM and software supply chain security mandate policies should explicitly include **registry install-time threats**. Public and private development standards should incorporate a recommended "new package cooldown" block.
- **Financial Security Institute (FSI) and the financial sector:** Financial build pipelines should control direct installation of external npm packages through private registry mirrors and approved version pinning, and CI secrets should be made short-lived.
- **National Intelligence Service (NIS) / National Cyber Security Center (NCSC):** Given the cryptocurrency and Web3 targeting, DPRK linkage should be monitored **with attribution still unconfirmed**, and threat intelligence sharing with virtual asset service providers (VASPs) should be strengthened.
- **DAXA / KoFIU:** Under the Act on Reporting and Using Specified Financial Transaction Information framework, VASP development and operations security reviews should consider adding a "supply chain install-time compromise" scenario.

### 5.3 Immediate Checklist for Korean Organizations

1. Introduce a **private npm registry or proxy mirror**, block direct external installation, and pin versions.
2. Apply a **cooldown block policy** for new or recently published packages, such as delaying installation for N hours after publication.
3. Disable **lifecycle script execution** such as `preinstall` and `postinstall` with `--ignore-scripts`, and operate an exception allowlist.
4. Isolate **cryptocurrency wallets and exchange API keys** from developer and CI environments; avoid local storage and use short-lived tokens.
5. If suspicious installation history exists, **rotate all GitHub PATs, npm tokens, and cloud keys**, and review GitHub Actions secrets.
6. Consider applying **kernel and runtime visibility tooling**, including eBPF monitoring and runtime EDR, to address eBPF-based stealth.
7. Retrospectively review installation history for packages published by `asteroiddao` and Arweave/WeaveDB-related packages.

---

## 6. Analytic Outlook

IronWorm shows that npm supply chain worms are **evolving and specializing** across three axes: (1) scripts to native binaries, (2) visible execution to rootkit concealment, and (3) broad targeting to sector-specific targeting of Web3 and crypto. Its occurrence in the same week as Miasma and Phantom Gyp is circumstantial evidence that public worm frameworks are being copied and improved by multiple actors. Defensive focus must shift from "malicious package detection" to **"install-time trust controls + short-lived credentials + self-propagation containment."** The Korean Web3 and game token ecosystem is a highly suitable target profile and therefore requires proactive controls.

---

## 7. References

- Cyberpress — "IronWorm Campaign Targets Developers Through Malicious npm Packages" (2026-06-04)
- GBHackers — "IronWorm npm Attack Steals Developer Secrets" (2026-06-04)
- StepSecurity — "Miasma npm Supply Chain Attack: Self-Spreading Worm via Phantom Gyp"
- Unit 42 (Palo Alto Networks) — "The npm Threat Landscape" (Updated 2026-06-02)
- The CyberSec Guru — "Red Hat npm Packages Compromised: Technical Analysis of Miasma Worm"

---

## ⚖️ Disclaimer

This report is an independent defensive and research-oriented analysis based on public OSINT sources and media reporting. It does not represent the official position of any organization. Attribution remains unconfirmed, and assessed attribution is marked with Low confidence. IoCs are current as of publication and should be revalidated before operational use. The author assumes no liability for damages arising from direct or indirect use of this material.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
gameworker@gmail.com · github.com/gameworkerkim
