| id             | CTI-2026-0730-WEMIX |
| -------------- | ------------------- |
| title          | WEMIX Serial Hacks: Smart-Contract Privilege Abuse, Structural Limits of Audits, and a Remediation Framework |
| subtitle       | An audit report is a spreadsheet, not an oracle. |
| author         | Dennis Kim / HoKwang Kim |
| email          | gameworker@gmail.com |
| github         | gameworkerkim |
| date           | 2026-07-30 |
| updated        | 2026-07-30 (v1.0) |
| classification | TLP:CLEAR |
| severity       | HIGH |
| lang           | en |
| tags           | WEMIX · Stablecoin · Smart-Contract · Key-Management · Audit-Industry · Credential-Theft · Bridge · OpSec |
| threat_actors  | Unknown (2026 owner-key compromise vector unpublished; 2025 case was credential leak to public storage) |
| frameworks     | MITRE ATT&CK · Admiralty Code |
| license        | CC BY-NC-SA 4.0 |

# WEMIX Serial Hacks: Smart-Contract Privilege Abuse, Structural Limits of Audits, and a Remediation Framework

> **Report ID** `CTI-2026-0730-WEMIX` · **Published** 2026-07-30 · **Classification** `TLP:CLEAR` · **Severity** 🔴 HIGH
> **Author** Dennis Kim / HoKwang Kim · gameworker@gmail.com · [@gameworkerkim](https://github.com/gameworkerkim)

*An audit report is a spreadsheet, not an oracle.*

---

## Table of Contents

1. Key Judgment Summary
2. Consolidated Timeline
3. Vulnerability Technical Analysis
4. Why Audits Failed to Prevent This
5. Remediation Framework
6. Similar Incident Comparison — This Is Not WEMIX's Problem Alone
7. Policy and Regulatory Implications
8. Conclusion
- Appendix A. Verification Notes (Admiralty Code)
- Appendix B. Key References

---

## 1. Key Judgment Summary

| # | Judgment | Confidence | Basis |
|---|---|---|---|
| 1 | This incident was not a smart-contract logic bug but a **privilege (credential) breach**. In other words, it was not a case of "the code malfunctioned" but of "the code executed exactly as designed." | High | The issuer's own notice explicitly cites "owner privilege takeover" as the cause |
| 2 | Concentrating mint authority in a single owner account amplified damage without an upper bound. One key = unlimited minting | High | A single-transaction-scale issuance of 5.22 million tokens was not blocked |
| 3 | 120+ audits and a CertiK Skynet AAA rating could not prevent this class of incident. Audit scope and the point of failure never overlapped in the first place | High | Audit scope covers on-chain code; the incident occurred in off-chain key management |
| 4 | Detection failure enlarged the damage. An external on-chain analyst discovered it first; official acknowledgment by the issuer came roughly four hours later | High | Multiple press reports align |
| 5 | The 2025 incident (authentication-key leak) and the 2026 incident (owner privilege takeover) belong to the **same failure family**. Both times, it was "credentials, not code" that was breached | Medium–High | The exact compromise path for the 2026 incident remains undisclosed |
| 6 | Unauthorized minting in a collateralized stablecoin is not mere theft but an **attack on peg trust itself** | High | WEMIX$ was backed by USDC.e collateral |

> One-line summary: **An audit report is a spreadsheet, not an oracle.** It is a tool that helps with calculation, not a oracle that declares future safety.

---

## 2. Consolidated Timeline

### 2.1 July 2026 Incident

| Time (KST) | Event |
|---|---|
| 2026-07-08 | WEMIX listed on U.S. exchange Kraken; global liquidity expansion announced |
| Around 2026-07-08 | Wemade unveiled StableNet, a KRW stablecoin–dedicated Layer 1 |
| 2026-07-26 18:17–18:18 | Owner privilege takeover on WEMIX$-related smart contracts; unauthorized mint transactions executed |
| Shortly thereafter | 5,225,525 WEMIX$ minted without authorization → converted to 30,736 WEMIX + 724,198.27 USDC.e |
| Subsequently | Moved via Chainlink CCIP · PLAY Bridge to Ethereum / BNB Smart Chain → re-swapped to ETH, USDT, dispersed across multiple wallets, partial CEX inflow |
| Evening 2026-07-26 | On-chain analyst Specter first publicly flagged suspicious transactions on X |
| Around 2026-07-26 22:00 | WEMIX officially acknowledged the security incident via its website (approx. 4 hours after external first report) |
| 2026-07-27 | Full bridge halt (CCIP suspended, PLAY Bridge paused), liquidity pool trading halted and foundation liquidity recalled, WEMIX$ module · PNIX DEX suspended, partial game blockchain/NFT functions restricted |
| 2026-07-27 | Freeze-cooperation requests sent to exchanges and stablecoin issuers; attacker wallet tracing initiated |
| 2026-07-27 (approx. 23 hours post-incident) | Circumstances of privilege takeover **unconfirmed** publicly. Full review of related contracts with external experts underway |

**Damage scale:** Approx. KRW 7.6–7.7 billion (issuer and press estimates). Confirmed stablecoin outflow: approx. USD 724,000 equivalent in USDC.e.

### 2.2 February 2025 Incident (Prior Event)

| Time | Event |
|---|---|
| Late 2024–early 2025 | Developer uploaded authentication keys for NILE NFT platform monitoring to a security-weak shared storage location |
| Approx. 2 months thereafter | Attacker dwell time. Permission verification and preparation within normal traffic |
| 2025-02-28 | Abnormal withdrawal of 8,654,860 WEMIX from Play Bridge Vault (approx. KRW 900 million at the time) — 15 withdrawal rounds in total |
| Early March 2025 (approx. 4 days after incident) | WEMIX publicly disclosed the incident |
| 2025-06 | Trading support terminated (delisting) on domestic KRW-market exchanges under DAXA |

The interval between the two incidents is approximately one year and five months. In between, WEMIX announced authentication-key rotation and security-system overhaul.

---

## 3. Vulnerability Technical Analysis

### 3.1 Precise Location of the Failure Point

Decomposing blockchain security incidents into the following four layers makes the position of both WEMIX incidents clear.

| Layer | Content | Representative Incident Type | WEMIX Applicability |
|---|---|---|---|
| L1 Protocol | Consensus, nodes, PoA validators | 51% attack, validator collusion | Not applicable |
| L2 Contract Logic | Reentrancy, overflow, price oracle manipulation | Cream, Euler type | Not applicable |
| **L3 Privilege · Credentials** | **Owner keys, multisig configuration, authentication keys, deployment pipeline** | **Ronin, Harmony, Orbit Bridge type** | **Both 2025 and 2026 incidents** |
| L4 Operations · Governance | Detection, disclosure, response procedures, internal controls | Delayed disclosure, response failure | Both incidents |

**Key point:** Most industry audit budgets and marketing language concentrate on L2, while the overwhelming majority of large fund-outflow incidents occur at L3.

### 3.2 Three Structural Defects

**① Single Owner Privilege**

An `mint()` function bearing the `onlyOwner` modifier is entirely normal from a code perspective. The problem is that the owner is a single EOA (or an account controlled by a single key). In this structure, what the attacker obtains is not merely "the right to call a function" but **the currency-issuance authority itself**.

```
Risk function = f(privilege strength, number of privilege holders, time delay, amount cap)

WEMIX$ mint()  = f(unlimited issuance, effectively 1, 0 seconds, none)
Safe design    = f(capped issuance, m-of-n multisig, 24–48h timelock, daily cap)
```

**② Absence of Privilege Tier Separation**

Mint, burn, pause, transferOwnership, and upgradeTo are functions of entirely different risk grades. Bundling them under one owner privilege multiplies damage on compromise. Especially when `transferOwnership` can execute immediately without a timelock, the attacker can **exclude legitimate operators** immediately after breach.

**③ Absence of Detection · Circuit Breaker**

5.22 million unauthorized mints were not blocked in real time, and an external analyst discovered them first. Any one of the following would have substantially reduced damage:

- Issuance anomaly alert → on-call response (minute-scale)
- Daily issuance cap (rate limit) enforced at contract level → excess automatically reverts
- Guardian privilege for immediate pause → simultaneous freeze of bridge and pools

### 3.3 Stablecoin-Specific Amplification Effect

General utility-token theft and unauthorized minting of a collateralized stablecoin differ in character.

| Dimension | General Token Theft | Unauthorized Mint of Collateralized Stablecoin |
|---|---|---|
| Primary damage | Stolen amount | Stolen amount |
| Secondary damage | Market price decline | **Issuance vs. collateral collapse → peg break** |
| Tertiary damage | Holder loss | All services using it for payment/settlement halt |
| Recovery difficulty | Compensation · burn | Reserve re-verification, supply re-audit, peg-trust rebuild |
| Regulatory risk | Disclosure violation | **Escalates to debate over legitimacy of reserve regulation itself** |

WEMIX$ maintained value through USDC.e collateral. The moment the attacker exchanged unauthorized mints for collateral assets (USDC.e) and exfiltrated them, this became not theft but **peg destruction via reserve withdrawal**. Supply increased while collateral decreased.

### 3.4 MITRE ATT&CK Mapping (Includes Estimates)

| Tactic | Technique | Application | Confidence |
|---|---|---|---|
| Credential Access | T1552.001 Credentials In Files | 2025 incident: authentication keys leaked to shared storage | High (issuer confirmed) |
| Initial Access | T1078 Valid Accounts | Legitimate owner credentials used to execute normal transactions | High |
| Initial Access | T1195.002 Supply Chain Compromise: Software | Possible deployment pipeline/dependency compromise | Low (unconfirmed hypothesis) |
| Initial Access | T1566 Phishing | Possible social engineering against operators | Low (unconfirmed hypothesis) |
| Defense Evasion | T1070 Indicator Removal / disguised as normal function calls | Appears as normal transactions to audit and monitoring | Medium |
| Impact | T1657 Financial Theft | Unauthorized mint followed by cross-chain money laundering | High |
| Impact | T1565 Data Manipulation | Total supply manipulation | High |

The initial compromise vector for the 2026 incident (key leak, insider, phishing, pipeline compromise — which one) is **currently undisclosed**. Low-confidence items in the mapping above should be treated as hypotheses only.

---

## 4. Why Audits Failed to Prevent This

This section is the core of the report. WEMIX was not a project that skipped audits. The fact that it received **far more than industry average** makes the severity sharper.

| Fact | Source |
|---|---|
| CertiK CEO public statement: WEMIX conducted 120+ audits with CertiK (well above industry average) | CertiK official blog, 2025 KBW panel |
| WEMIX holds CertiK Skynet AAA rating, achieved by only a handful of projects worldwide | CertiK official blog |
| WEMIX mainnet achieved CertiK security score 90.2 (top 5%) as of 2023, then displayed certification mark | WEMIX team official technical blog |
| CertiK–WEMIX partnership expansion topics include "Korean stablecoin innovation" | CertiK official blog (2025-10) |
| WEMIX appears in upper ranks of Skynet leaderboard alongside Bitcoin, Ethereum, etc. | CertiK Skynet leaderboard |

In other words, **audit volume, rating, monitoring product, and partnership were all top-tier — yet incidents occurred twice.** This does not reduce to the competence of a specific audit firm; it is a structural problem of the audit regime itself.

### 4.1 Mismatch Between Audit Scope and Point of Failure

| What Audits Actually Verify | Where This Incident Occurred |
|---|---|
| Whether contract code has reentrancy, overflow, or logic errors | None (not applicable) |
| Whether only privileged accounts can call mint | Yes — and the attacker became that privileged account |
| Whether function access modifiers are correctly applied | They were |
| Where and how owner keys are stored | **Outside audit scope** |
| Whether developers commit credentials to repositories | **Outside audit scope** |
| Whether operator endpoints, CI/CD, and back office are secure | **Outside audit scope (separate pentest contract required)** |
| Whether detection and blocking occur within minutes of incident | **Outside audit scope (monitoring product domain)** |

Audit reports typically include a sentence such as "owner keys are assumed to be managed securely." This incident exploded inside exactly that **assumption**. The report was not wrong. It simply did not answer the question that caused the incident.

### 4.2 Five Illusions of the Audit Regime

| # | Illusion | Reality |
|---|---|---|
| 1 | Scope illusion: "Audit complete = project safe" | Audit complete = no known patterns found in specific contracts at a specific commit |
| 2 | Snapshot illusion: audited code = production code | After upgrades, migrations, and privilege transfers, deployed bytecode may differ from the audited version. Even Skynet methodology separates audit freshness and audit coverage for this reason |
| 3 | Assumption illusion: off-chain is assumed safe | Most large outflows occur inside that assumption |
| 4 | Recommendation illusion: centralization risk is noted | Notes are recommendations only; obligation to fix and decision authority remain with the project. Often closed as "centralization risk acknowledged and accepted" |
| 5 | Incentive illusion: audits are independent verification | Audit fees are paid by the auditee. The same structural conflict of interest as credit-rating agencies exists. Grades, scores, and certification marks are also consumed as marketing assets |

### 4.3 Paradox of Rating Systems: What Is Being Scored?

CertiK Skynet scores aggregate multiple categories: code security, fundamentals, operational resilience, governance, market stability, community trust. The problem is how this composite score is consumed:

- Project: markets with a single label such as "AAA rating"
- Investors · users: misread as "audit passed = principal safe"
- Actual risk: composite score is also influenced by **variables unrelated to security**, such as community votes and market metrics

A high composite score is a valid signal that "this project spent heavily on security." It is not a valid signal that "this project's mint keys are protected by multisig." **Investors need the latter; what circulates in the market is the former.**

Notably, the WEMIX team itself explicitly described in a 2023 technical blog that audits cannot prevent all incidents. The incident did not occur from lack of awareness. **The gap between awareness and execution** caused it.

---

## 5. Remediation Framework

### 5.1 Layered Response Matrix

| Layer | Control | Specific Requirement | Priority |
|---|---|---|---|
| Contract | Privilege dispersion | Transfer mint authority to 3-of-5+ multisig; signer keys physically and organizationally separated | P0 |
| Contract | Timelock | 24–48 hour delay on mint, upgrade, owner transfer. Public events emitted during delay window | P0 |
| Contract | Issuance cap | Daily/per-block mint limit hardcoded. Excess reverts. Cap changes themselves subject to timelock | P0 |
| Contract | Circuit breaker | Guardian role (no mint, pause only) for immediate halt. Pause immediate; unpause requires multisig + timelock | P0 |
| Contract | Collateral invariant | On-chain verification: `totalSupply <= collateralBalance * k`. Violation blocks mint entirely | P1 |
| Key management | HSM/MPC | Migrate owner keys to HSM or MPC threshold signing. Plaintext key files fully prohibited | P0 |
| Key management | Rotation · audit log | Regular rotation, log all signature requests, two or more approvers | P1 |
| Pipeline | Secret scanning | Pre-commit + push-protection enforced on repositories, org-wide history scan, automatic invalidation on leak | P0 (directly prevents 2025 recurrence) |
| Pipeline | Deployment verification | CI enforces hash comparison of deployed bytecode vs. audited version. Mismatch blocks deployment | P1 |
| Detection | On-chain anomaly detection | Real-time alerts + on-call for supply changes, owner changes, large mints, anomalous bridge outflows | P0 |
| Detection | Response SLA | Target: detection → guardian pause within 15 minutes; first disclosure within 2 hours | P0 |
| Governance | Privilege transparency | Continuous public documentation of owner address, multisig composition, timelock parameters, guardian entity | P1 |
| Governance | Incident disclosure policy | Predefined disclosure criteria, channels, and deadlines. Abolish "announce after investigation completes" practice | P0 |
| Verification | Operational security audit | Separate from code audit: key management, internal controls, pentest at least annually. Summary published | P1 |

### 5.2 Reference Implementation Concept (Solidity Pseudocode)

```solidity
// Purpose: minimum structure so that compromise of one key does not lead to unlimited minting
// Core = multisig + timelock + issuance cap + immediate pause + collateral invariant

contract GuardedStablecoin is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE   = keccak256("MINTER");   // held only by multisig contract
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN"); // pause only, no mint authority

    uint256 public dailyMintCap;        // timelock required on change
    uint256 public mintedToday;
    uint256 public currentDay;
    uint256 public constant TIMELOCK = 24 hours;

    IERC20 public immutable collateral;  // e.g., USDC.e
    address public immutable reserve;    // reserve custody address

    struct MintRequest { uint256 amount; address to; uint256 readyAt; bool executed; }
    mapping(bytes32 => MintRequest) public queue;

    // Stage 1: schedule mint. Immediate mint is impossible
    function requestMint(address to, uint256 amount)
        external onlyRole(MINTER_ROLE) whenNotPaused returns (bytes32 id)
    {
        id = keccak256(abi.encode(to, amount, block.timestamp));
        queue[id] = MintRequest(amount, to, block.timestamp + TIMELOCK, false);
        emit MintRequested(id, to, amount, block.timestamp + TIMELOCK); // public monitoring window
    }

    // Stage 2: execute after timelock. Verify cap and collateral invariant simultaneously
    function executeMint(bytes32 id) external onlyRole(MINTER_ROLE) whenNotPaused {
        MintRequest storage r = queue[id];
        require(!r.executed && r.readyAt != 0 && block.timestamp >= r.readyAt, "not ready");

        if (block.timestamp / 1 days != currentDay) {
            currentDay = block.timestamp / 1 days;
            mintedToday = 0;
        }
        require(mintedToday + r.amount <= dailyMintCap, "daily cap");           // blocks unlimited mint
        require(totalSupply() + r.amount <= collateral.balanceOf(reserve), "undercollateralized"); // peg protection

        mintedToday += r.amount;
        r.executed = true;
        _mint(r.to, r.amount);
    }

    // Immediate pause possible alone; unpause via multisig
    function emergencyPause() external onlyRole(GUARDIAN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
```

**Design intent summary**

| Control | Effect in compromise scenario |
|---|---|
| MINTER = multisig | Single key compromise cannot even schedule a mint |
| Timelock + event | Exposed to external monitors immediately on scheduling; 24-hour response window |
| Daily cap | Loss remains finite even in worst case. Single-tx 5.22M mint impossible |
| Collateral invariant | Contract rejects peg-collapse-type issuance |
| Guardian pause | Stops bleeding immediately after detection without human approval chain |

### 5.3 Sample Detection Rules

```
RULE-01  supply_anomaly
  IF  totalSupply change rate (5 min) > 1%  OR  single-tx mint amount > daily average issuance * 3
  THEN  P1 alert + guardian on-call + automatic bridge rate-limit reduction

RULE-02  privileged_call
  IF  event IN (OwnershipTransferred, RoleGranted, Upgraded, CapChanged)
  THEN  P0 alert (notify unconditionally even if change was expected) + cross-check change-reason ticket

RULE-03  reserve_drain
  IF  reserve address USDC.e balance decreases AND totalSupply does not decrease
  THEN  P0 alert + automatic mint halt

RULE-04  bridge_exfil
  IF  single-address bridge-out amount (1h) > threshold OR new address moves large assets cross-chain
  THEN  P1 alert + temporary path suspension + auto-generate exchange freeze request template
```

RULE-03 directly targets the core pattern of this incident (supply increase + collateral decrease).

### 5.4 Checklist for Audit Commissioners

If the following items are absent from an audit contract, that audit cannot prevent this class of incident.

| Category | Verification Question | Typically Included in Audit |
|---|---|---|
| Scope | Does audited commit hash match actually deployed bytecode | Partial |
| Scope | Are proxy · upgrade paths and admin contracts in scope | Partial |
| Privilege | Is full list of privileged functions documented with holder, delay, and cap for each | Partial |
| Privilege | Does report state whether owner is EOA or multisig, and what threshold | Often omitted |
| Keys | Key storage method (HSM/MPC/plaintext), access personnel, rotation policy verified | **Not included** |
| Pipeline | Pentest of CI/CD, deployment servers, operator endpoints | **Separate contract** |
| Operations | Detection–response drills (tabletop, breach simulation) performed | **Not included** |
| Post-audit | Are disposition status (fix/accept) and rationale for noted centralization risks published | Partial |

### 5.5 Required Changes in the Audit Industry

| Current | Required Transition |
|---|---|
| Code-audit centric | Expand to **Operational Security Audit (OpSec Audit)** bundling code + key management + operational security |
| Composite rating label (AAA, etc.) | Itemized public breakdown. Especially expose "privileged-function authority structure" as an independent always-on indicator |
| Point-in-time snapshot | Continuous deployed-bytecode comparison + real-time privilege-change tracking |
| Close after recommendation | **Mandatory disclosure of residual risk** for unremediated high-severity items |
| Auditee pays all costs | Parallel third-party-commissioned audits (exchanges, foundations, insurers) to reduce conflict of interest |

---

## 6. Similar Incident Comparison — This Is Not WEMIX's Problem Alone

| Incident | Period | Scale | Root Cause Layer | Code Bug |
|---|---|---|---|---|
| Orbit Bridge (Oozys) | 2024-01 | Approx. USD 81.5 million | Privilege · credentials (L3) | No |
| WEMIX Play Bridge Vault | 2025-02 | Approx. KRW 900 million | Authentication-key leak (L3) | No |
| Upbit hot wallet | 2025-11 | Approx. KRW 44.5 billion | Private-key guessability vulnerability (L3) | Partial |
| WEMIX$ contract | 2026-07 | Approx. KRW 7.7 billion | Owner privilege takeover (L3) | No |

H1 2026 virtual-asset hack losses are estimated at approx. KRW 1.6 trillion, with North Korea–linked threat groups prominently active. What this statistic implies is clear: **Funds exit through people and keys, not contract logic.** Industry defense budgets are structurally allocated in the opposite direction — that is the sector's structural problem.

Smart contracts are now largely standardized, and successful contracts are replicated. Many projects struggle to analyze contracts themselves and should also be viewed as at-risk. Structural stability therefore demands baseline security guidance for contracts. Structural limitations are inherent in ERC20 Solidity design.

---

## 7. Policy and Regulatory Implications

Korea pursued second-phase legislation after the Virtual Asset User Protection Act (including stablecoin regulation), but debate over issuer requirements and political scheduling has delayed progress. This incident occurred in that regulatory gap.

| Issue | Question Raised by This Incident |
|---|---|
| Issuer requirements | Will issuance structures that cannot block unauthorized minting at contract level be permitted |
| Reserve regulation | Is reserve verification by accounting audit alone sufficient. Is on-chain collateral invariant enforcement impossible |
| Technical requirements | Will multisig · timelock · issuance caps for mint authority be **codified as licensing requirements** |
| Incident disclosure | Will disclosure deadlines after breach awareness be normalized (2025: 4 days; 2026: 4 hours) |
| Audit regulation | Will scope-disclosure obligations be imposed when using "audit complete" in advertising |
| Cross-border recovery | Effectiveness of international cooperation procedures for freezing and recovering bridge-routed funds |

Especially the last item: once again, funds dispersed across Ethereum and BSC into multiple wallets within hours. Issuer freeze requests were sent after funds had already moved. **Detection delay translates directly into recovery failure.**

---

## 8. Conclusion

WEMIX's two incidents are not different accidents. They are the second déjà vu of the same failure.

- 2025: Credentials were stored in the wrong place
- 2026: Credentials were stolen, and that single credential meant full currency-issuance authority

Both times, contract code executed exactly as designed. 120+ audits and an AAA rating did not prevent this — not because audits were negligent, but because **the questions audits answer and the domain where incidents occur were different from the start.**

When a system that claims decentralization depends on a single administrator key, that key becomes the system's Achilles heel. Whether it is explicitly coded in the contract or stored in an off-chain file somewhere, the outcome is the same.

True security comes not from the stamp on an audit report but from three things: **dispersed authority, bounded loss, and minute-scale detection.** The first two must be engraved in code on the contract; the last must be engraved in procedure in the organization. The report comes after that.

---

## Appendix A. Verification Notes (Admiralty Code)

| Item | Status | Confidence |
|---|---|---|
| Incident time 2026-07-26 18:17–18:18 KST | Multiple press reports align | A2 |
| Unauthorized mint volume 5,225,525 WEMIX$ | Issuer notice | A1 |
| Conversion details 30,736 WEMIX / 724,198.27 USDC.e | Issuer notice | A1 |
| Damage scale KRW 7.6–7.7 billion | Press estimate; may vary with market price | B2 |
| Official acknowledgment approx. 4 hours after external first report | Multiple press reports align | A2 |
| Fund path: via CCIP · PLAY Bridge → Ethereum/BSC → ETH · USDT dispersion | Issuer and press | A2 |
| Cause unconfirmed at approx. 23 hours post-incident | Press reporting | A2 |
| 2025-02-28 Play Bridge Vault 8,654,860 WEMIX outflow | Issuer notice and press | A2 |
| 2025 incident cause: authentication keys uploaded to shared storage, approx. 2 months dwell, 15 withdrawals | Issuer explanation | B2 |
| 2025-06 domestic KRW-market trading support termination | Press | A2 |
| CertiK 120+ audits, AAA Skynet rating | CertiK official announcement (self-reported) | B1 |
| WEMIX mainnet security score 90.2 (2023) | WEMIX own technical blog | B2 |
| **"80+ audit reports held", "most recent audit completed 2026-05-27"** | **Figures in original draft. Classified unverified in this document. Direct confirmation needed on Skynet project page** | **F (judgment withheld)** |
| Specific compromise vector for 2026 incident | Undisclosed by issuer | F (judgment withheld) |
| Judgment that structure was single-owner EOA | Inference from public information. Contract verification needed to confirm whether owner address was multisig | C3 (estimate) |

**Corrections from original draft:**

1. Retained 2025 incident as "2025-02-28" while noting some press used "last March" based on disclosure date
2. Specified DAXA trading-support termination as June 2025
3. Replaced "approx. 30,000" with exact figure 30,736 for conversion quantity
4. Added Chainlink CCIP and PLAY Bridge to fund-movement path
5. Corrected on-chain analyst spelling from Spetor to Specter
6. Separated audit-report count and most recent audit date as unverified items
7. Downgraded single-owner EOA structure claim from confirmed fact to estimate

---

## Appendix B. Key References

- WEMIX Foundation official notice (2026-07-27) and X account
- Hankyung, Herald Economy, Asia Economy, The Elec, M Economy News, NewsPim, Jaegyeong Ilbo, Dailyian (2026-07-27–28 coverage)
- CoinTelegraph Korea, incident response and service suspension scope (2026-07-27)
- Digital Times editorial, private stablecoin structure issues (2026-07-28)
- CertiK official blog: CertiK–WEMIX partnership expansion (2025-10)
- CertiK Skynet: project page, security leaderboard, Skynet Score methodology documentation
- WEMIX team technical blog: blockchain audit service explainer (2023)
- Beopryul Shinmun (Hwawoo), top 10 domestic virtual-asset issues in 2026 and second-phase legislation status (2026-01)
- Bizwatch, stablecoin bill National Assembly discussion delay (2026-06)
- Security News, Upbit breach and Orbit Bridge incident coverage
