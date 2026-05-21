# 🛡️ YellowKey — Windows BitLocker Bypass Zero-Day

> **Cyber Threat Intelligence (CTI) Primary Report**
> *CVE-2026-45585 · Security Feature Bypass · CVSS 6.8 (Important)*

`TLP:CLEAR` · `CTI-2026-0521-YELLOWKEY`

| Field | Value |
| --- | --- |
| **Report ID** | `CTI-2026-0521-YELLOWKEY` |
| **Date** | 2026-05-21 (KST) |
| **Category** | Endpoint / Full-Disk Encryption Bypass |
| **CVE** | CVE-2026-45585 |
| **CVSS** | 6.8 (Medium) / MS Severity: Important |
| **Exploitability** | Exploitation More Likely (MS assessment) |
| **Current Status** | No official patch released · interim mitigations only |
| **PoC Disclosure** | Public (GitHub) — CVD violation |
| **Physical Access** | Required (no remote exploitation) |
| **TLP** | `TLP:CLEAR` |

---

## 1. Executive Summary

On 20 May 2026, Microsoft released interim mitigations for a zero-day vulnerability dubbed **"YellowKey" (CVE-2026-45585)** that defeats BitLocker, the full-disk encryption feature of Windows. The flaw does not target BitLocker's encryption algorithm itself, but instead abuses the trust-handling behavior of the surrounding Windows Recovery Environment (WinRE).

The vulnerability was disclosed by an anonymous researcher known as **"Chaotic Eclipse" (alias Nightmare-Eclipse)**, who published a proof-of-concept (PoC) on GitHub without going through the formal Coordinated Vulnerability Disclosure (CVD) process. In its official advisory, Microsoft explicitly noted that this PoC release violated responsible-disclosure best practice.

While the attack requires physical access, it needs **no software installation, no existing credentials, and no network access** — making it a substantial threat to lost/stolen devices and unattended endpoints. An official security update is not yet available, so organizations must rely on manual mitigations.

---

## 2. Affected Systems

- Windows 11 Version 26H1 (x64)
- Windows 11 Version 25H2 (x64)
- Windows 11 Version 24H2 (x64)
- Windows Server 2025
- Windows Server 2025 (Server Core installation)

Devices configured with BitLocker in **TPM-only protection mode** are at the highest exposure. Many enterprises default to TPM-only for the convenience of silent boot without a PIN, which broadens the attack surface considerably.

---

## 3. Technical Analysis

### 3.1 Attack Chain

1. The attacker places a specially crafted `FsTx` file onto a USB drive or the EFI partition.
2. The USB device is connected to a target endpoint with BitLocker enabled.
3. The device is booted into the Windows Recovery Environment (WinRE).
4. Holding the `Ctrl` key during boot spawns a shell with unrestricted access to the encrypted volume.

### 3.2 Root Cause

The core issue lies not in BitLocker encryption but in the **trust assumptions of the recovery environment**. During WinRE boot, the FsTx automatic-recovery utility (`autofstx.exe`) runs automatically, triggering a Transactional NTFS (TxF) replay. This replay allows the `\System Volume Information\FsTx` directory of one volume to modify the contents of another volume. As a result, a critical security configuration file (`winpeshl.ini`) is deleted, opening a bypass path that spawns an unrestricted shell in the pre-boot recovery sequence.

Security researcher Will Dormann confirmed that the PoC works, and pointed out that — more fundamental than the TPM-only bypass itself — the deeper flaw is that **one volume's FsTx directory can modify another volume**.

---

## 4. Mitigations (Microsoft Guidance)

### 4.1 Option A — Modify the WinRE Image

1. Mount the WinRE image on each device.
2. Mount the system registry hive of the mounted WinRE image.
3. Remove the `autofstx.exe` entry from the Session Manager `BootExecute` (REG_MULTI_SZ) value.
4. Save and unload the registry hive.
5. Unmount and commit the updated WinRE image.
6. Re-establish BitLocker trust for WinRE.

### 4.2 Option B — Switch to TPM+PIN (Recommended)

For already-encrypted devices, switch from TPM-only to **TPM+PIN** mode via PowerShell, the command line, or Control Panel. Requiring a PIN at boot effectively blocks the YellowKey attack.

For unencrypted devices, enable "Require additional authentication at startup" via Microsoft Intune or Group Policy (GPO), and set "Configure TPM startup PIN" to "Require startup PIN with TPM."

> ⚠️ **Caution**: Nightmare-Eclipse has claimed to possess a separate PoC that bypasses TPM+PIN protection. Option B should therefore be regarded as a present-time blocker rather than a definitive resolution.

---

## 5. Threat Actor Context

**"Chaotic Eclipse" (alias Nightmare-Eclipse)**, who disclosed YellowKey, is an actor that has been releasing a series of zero-days without authorization as a protest against how MSRC handles vulnerability reports. Prior disclosures include the local privilege-escalation vulnerabilities **"BlueHammer"** and **"RedSun"**, indicating a deliberate, sustained disclosure campaign rather than an isolated incident.

This protest-driven full-disclosure pattern suggests the likelihood of further unauthorized releases of undisclosed vulnerabilities, warranting continuous monitoring of the same actor's activity.

---

## 6. Response Recommendations

| Priority | Recommendation |
| --- | --- |
| **Asset Identification** | Immediately inventory affected Windows 11 / Server 2025 build endpoints and prioritize devices using TPM-only BitLocker |
| **Prioritized Rollout** | Apply TPM+PIN first to high-risk devices carried by executives, field staff, and travelers handling sensitive data |
| **Policy Enforcement** | Enforce multi-factor (TPM+PIN) protection across all enterprise endpoints via GPO or Intune |
| **Mitigation Validation** | Because the WinRE image modification is a recovery-image change rather than a standard patch, test thoroughly before deployment |
| **Physical Security** | Re-examine lost/stolen device procedures and physical access controls |
| **Monitoring** | Continuously track the release of an official patch and any further disclosures by the same actor |

---

## 7. Sources

- **Microsoft Security Response Center (MSRC)** — CVE-2026-45585 Advisory — <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-45585>
- **The Hacker News** — Microsoft Releases Mitigation for YellowKey — <https://thehackernews.com/2026/05/microsoft-releases-mitigation-for.html>
- **SecurityWeek** — Microsoft Rolls Out Mitigations for YellowKey — <https://www.securityweek.com/microsoft-rolls-out-mitigations-for-yellowkey-bitlocker-bypass/>
- **Help Net Security** — YellowKey BitLocker bypass mitigation — <https://www.helpnetsecurity.com/2026/05/20/yellowkey-bitlocker-mitigation-cve-2026-45585/>

> **Verification Note**: This report's facts were confirmed through the official MSRC advisory and cross-validation across four independent security outlets. A Korean-language Daum article referred to the actor only as "Nightmare Eclipse," but per the primary English sources and MSRC the official alias is "Chaotic Eclipse" (= Nightmare-Eclipse). Some tool references such as "UnDefend" could not be directly confirmed in primary sources and were therefore excluded from the body.

---

## ⚖️ Disclaimer

1. This report is an **independent analysis based on publicly available OSINT materials and press reporting**, and does not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. Vulnerability information reflects the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

**© 2026 Dennis Kim (HoKwang Kim)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*CVE-2026-45585 (YellowKey) Primary Report*
