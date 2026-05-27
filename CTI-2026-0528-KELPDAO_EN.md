| id             | CTI-2026-0528-KELPDAO                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | KelpDAO LayerZero Bridge Hack — A Sophisticated Attack on the Single Point of Failure in Off-Chain Verification Infrastructure                                                                                      |
| subtitle       | 1-of-1 DVN, RPC node poisoning, and systemic risk spreading across DeFi                                                                                                                                            |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-28                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | CRITICAL                                                                                                                                                                                                        |
| lang           | en                                                                                                                                                                                                              |
| tags           | | Web3-Security | DeFi | Lazarus-Group | Cross-Chain | North-Korea | Bridge-Security | RPC-Compromise | | -------------- | --- | ------------- | ----------- | ------------ | --------------- | --------------- | |
| threat\_actors | | Lazarus Group (TraderTraitor · North Korea-nexus) | | -------------------------------------------------- |                                                                                                  |
| cve            | N/A (an attack on off-chain infrastructure design weakness, not a smart contract flaw)                                                                                                                            |
| frameworks     | | MITRE ATT&CK (T1566, T1499, T1195, T1583) | NIST SP 800-207 (Zero Trust) | | ----------------------------------------- | ---------------------------- |                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# KelpDAO LayerZero Bridge Hack — A Sophisticated Attack on the Single Point of Failure in Off-Chain Verification Infrastructure

> **Report ID** `CTI-2026-0528-KELPDAO` · **Published** 2026-05-28 · **Classification** `TLP:GREEN` · **Severity** 🔴 CRITICAL
> **Author** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*1-of-1 DVN, RPC node poisoning, and systemic risk spreading across DeFi*

---

## Table of Contents

1. Executive Summary (TL;DR)
2. Incident Overview
3. Technical Analysis — Attack Vectors
4. Impact Assessment — Korean & Web3 Repercussions
5. Response and Mitigation
6. Conclusion and Recommendations
7. References

---

## Executive Summary (TL;DR)

On April 18, 2026, **TraderTraitor, a subgroup of the North Korea-linked Lazarus Group,** attacked the LayerZero bridge infrastructure of the liquid restaking protocol **KelpDAO**, stealing **116,500 rsETH (approximately USD 292 million)**. This is recorded as the **largest DeFi hack of 2026** [1][2].

Most notable is that this attack drilled precisely into a design weakness of the **off-chain verification infrastructure**, rather than a known vulnerability such as a smart contract bug or price oracle manipulation. Because the on-chain transactions themselves — signatures, message formats, and contract calls — all appeared legitimate, existing on-chain security solutions failed to detect the attack [1].

The core of the attack is as follows:

1. **A single point of failure due to a 1-of-1 single-verifier (DVN) configuration** [3]
2. **RPC node compromise:** infiltrated and tampered with two RPC nodes used by the LayerZero Labs DVN, and launched a DDoS attack on unverified external RPC nodes to force failover to the poisoned nodes [6]
3. **Injection of fake burn data:** through the tampered nodes, delivered forged data to the DVN making it appear that rsETH had been "burned" on the source chain
4. **Unauthorized release of funds from the bridge contract:** disguised as having passed normal verification to steal 116,500 rsETH

### Key Judgments

| #    | Judgment                                                                                                                                                  | Confidence |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | The root cause is not a smart contract bug but **a single point of failure in the off-chain verification structure called the 1-of-1 DVN**; combined with LayerZero's default settings and quickstart presenting a 1/1 configuration, this must be defined as **a structural risk across the entire ecosystem.** | **High**   |
| KJ-2 | Because the attack appeared completely legitimate on-chain, it was undetectable by traditional on-chain security solutions. **Only cross-chain invariant monitoring** can detect this class of attack in advance. | **High**   |
| KJ-3 | Lazarus/TraderTraitor accounted for **76% (~USD 577 million) of global crypto hack losses in 2026 with just two incidents — Drift ($285M) and KelpDAO ($292M).** This means the North Korean threat is a real and imminent threat to Korea's Web3 ecosystem. | **High**   |
| KJ-4 | The stolen rsETH was reused as collateral for uncollateralized borrowing on Aave and elsewhere, so **a single protocol hack metastasized into systemic risk across DeFi.** Inter-asset interconnectivity became the channel of contagion. | **Medium-High** |
| KJ-5 | The Aave-led private consortium bailout (**DeFi United**) is a new milestone contrasting with the 2008 government-led bailouts, but is not a structural solution to prevent recurrence; reform of listing and collateral standards must accompany it. | **Medium** |

---

## 1. Incident Overview

### 1.1 Basic Information

| Item | Detail |
|------|------|
| **Victim** | KelpDAO (Ethereum-based liquid restaking protocol, issuer of rsETH) |
| **Attack date** | April 18, 2026 |
| **Loss scale** | 116,500 rsETH ≈ USD 292 million (a substantial portion of rsETH circulation) [1][11] |
| **Attack path** | LayerZero bridge — off-chain verification infrastructure (RPC nodes) |
| **Attribution** | Lazarus Group linked to North Korea's RGB, TraderTraitor subgroup (LayerZero official post-mortem, TRM Labs attribution) [3][10] |
| **Secondary theft blocked** | KelpDAO blocked over USD 100 million more (2 forged transactions) by pausing the contract [11] |
| **Post-incident response** | KelpDAO froze the rsETH contract; Arbitrum Security Council froze ~30,766 ETH (~USD 71.5 million) [8] |

> ⚠️ **Figure correction note**: Based on cross-verification of primary sources, this report confirms figures confused in some secondary reporting as follows. ① Aave's bad debt was approximately **USD 123.7M–230.1M** (the attacker borrowed about USD 190M from Aave); the "USD 19.5 billion" figure in some early reports is a clear error. ② The main money-laundering route was not Tornado Cash but **BTC conversion via THORChain** (Tornado Cash was used only in small amounts during the pre-funding stage).

### 1.2 DeFi Ecosystem Cascading Effects

This hack did not end as a single-protocol loss. The attacker deposited the unbacked rsETH as collateral into Aave V3 and borrowed legitimate assets, with the following effects [4][7][15].

| Item | Detail |
|------|------|
| **Aave borrowing / bad debt** | Attacker borrowed ~USD 190M from Aave; estimated bad debt ~USD 123.7M–230.1M |
| **Aave deposit outflows** | Over USD 8 billion (some counts USD 10 billion) net outflow within 48 hours |
| **DeFi Total Value Locked (TVL)** | Plunged ~USD 13 billion (per some counts, $99.5B → $83.7B) |
| **Cascading liquidation crisis** | rsETH depeg pushed high-LTV positions such as eMode toward simultaneous liquidation thresholds; "looping" trades frozen |

---

## 2. Technical Analysis — Attack Vectors

### 2.1 The 1-of-1 Single DVN Configuration: Root Cause

KelpDAO's rsETH cross-chain messaging was configured to pass through only **a single verifier**, the LayerZero Labs DVN. In LayerZero, every cross-chain message must be verified by one or more Decentralized Verifier Networks (DVNs) before the destination chain executes it. rsETH used a 1-of-1 structure requiring no agreement from a second DVN, which inherently provides a single point of failure [1][3].

Responsibility is contested. LayerZero claimed it was KelpDAO's choice to ignore the multi-DVN recommendation, while KelpDAO countered that LayerZero's official quickstart guide and default GitHub configuration (`layerzero.config.ts`) themselves presented the 1/1 structure, and that a LayerZero representative directly confirmed its safety [5][12]. In fact, at the time of the incident, roughly **40–47% of active LayerZero OApp contracts** used the same 1-of-1 DVN configuration [11][12]. After the incident, LayerZero decided to stop signing messages for single-verifier configurations, and KelpDAO migrated rsETH to **Chainlink CCIP** [5].

### 2.2 Off-Chain RPC Node Infiltration: Execution Mechanism

| Step | Description |
|------|------|
| **① Internal node infiltration** | The attacker accessed the RPC list used by the LayerZero Labs DVN, infiltrated 2 RPC nodes, and replaced the binaries running on the nodes [11] |
| **② DDoS to induce failover** | Launched a DDoS attack on uncompromised external RPC nodes to force the system to fail over to the poisoned nodes [6][11] |
| **③ Forged data injection** | The tampered nodes sent false state data to the DVN, as if rsETH had been "burned" on the source chain |
| **④ Bridge contract execution** | As the DVN verified the fake burn data as legitimate, the Ethereum bridge contract released 116,500 rsETH to the attacker's address |

According to Chainalysis analysis, because LayerZero left a 1-of-1 RPC quorum as the default, even a single poisoned node led the DVN to sign forged messages without cross-verification against other nodes [5].

### 2.3 Detection Failure of Existing Security Solutions

Because all on-chain transactions' signatures, message formats, and contract calls appeared completely legitimate, traditional smart-contract-based security solutions could not detect the attack at all [1]. Detecting it requires **cross-chain invariant monitoring** — continuously verifying that tokens released on the destination chain mathematically match tokens burned on the source chain.

### 2.4 Money Laundering and Freezing

About USD 175 million of the stolen funds was converted to BTC via **THORChain** within roughly 36 hours, and subsequent laundering stages are assessed to have been handled mainly by Chinese intermediaries rather than North Korea [10][30]. Part of the pre-funding was traced to wallets controlled by Chinese broker Wu Huihui — indicted in 2018 for Lazarus money laundering — and to the BTCTurk hack [26]. However, the **Arbitrum Security Council**, in cooperation with law enforcement, succeeded in freezing ~30,766 ETH (~USD 71.5 million) [8].

---

## 3. Impact Assessment — Korean & Web3 Repercussions

### 3.1 Impact on Korea

**① Trust crisis in the Web3 / virtual asset industry** — KelpDAO was a project of interest in Korea's investor and developer communities. Given that rsETH was widely used across major Layer 2s and on Aave, indirect harm to domestic users cannot be ruled out.

**② Strengthened regulatory scrutiny by financial authorities** — Having tightened regulation since the Virtual Asset User Protection Act took effect, financial authorities are likely to strictly review cross-chain risk management standards for DeFi protocols in light of this incident. In particular, a direction of including the security level of "off-chain infrastructure" in evaluation metrics is expected.

**③ Heightened awareness of the North Korean cyber threat** — In early 2026, with just two hacks — Drift Protocol (~USD 285M) and KelpDAO (~USD 292M) — North Korea accounted for about **76% (~USD 577M)** of global crypto hack losses [24][26]. North Korea's share reached a record high, rising from 22% in 2022, 37% in 2023, 39% in 2024, and 64% in 2025 to 76% in 2026 [25]. Strengthening the information-sharing framework between Korea's security industry and financial authorities is urgent.

**④ Domestic exchange / DeFi service response** — Major domestic exchanges are expected to re-examine listings of rsETH and related derivatives and strengthen risk-assessment standards, and are likely to consider introducing separate review for cross-chain assets with single-verifier structures.

### 3.2 Impact on the Web3 Industry

**① Decline in cross-chain bridge trust and migration** — Although the core vulnerability lay in the DVN configuration rather than the LayerZero protocol itself, a re-examination of cross-chain bridge security models as a whole became unavoidable. In fact, protocols with combined TVL of about USD 2 billion, including KelpDAO (~USD 1.5B) and SolvProtocol (~USD 600M), are migrating from LayerZero to **Chainlink CCIP** (which requires at least 16 independent node operators for verification) [9].

**② Rapid growth of the off-chain security solution market** — As the limits of on-chain-centric security were exposed, demand for off-chain infrastructure monitoring, RPC endpoint diagnostics, and cross-chain state verification solutions is expected to surge.

**③ 'DeFi United' — a new milestone in industry consortium bailouts** — A private consortium bailout initiative launched under Aave's leadership. **The largest contributors were not the initially reported LayerZero/EtherFi, but Mantle and the Aave DAO** [15][18].

| Participant | Contribution |
|--------|----------|
| Mantle Treasury | Up to 30,000 ETH (3-year credit line, Lido staking yield +1%) |
| Aave DAO | 25,000 ETH (governance vote in progress) — combined with Mantle, 55,000 ETH (~USD 127M) |
| Consensys / Joseph Lubin | Up to 30,000 ETH |
| Stani Kulechov (Aave founder) | 5,000 ETH personally |
| EtherFi | 5,000 ETH |
| Lido DAO | Up to 2,500 stETH (~USD 5.7M) |
| Others | Golem Foundation 1,000 ETH, Aave VP 500 ETH, Ethena·LayerZero·Ink·Frax·Tydro, etc. |

As of April 25, DeFi United had raised about USD 160 million, filling roughly 80% of the ~USD 200 million needed [17]. This private-led response contrasts with the government-led bank bailouts of 2008 and is regarded as evidence of DeFi's maturity.

**④ Aave's full overhaul of collateral / listing standards** — Aave decided to expand its collateral asset evaluation criteria beyond price volatility to include cybersecurity, interoperability, and underlying architecture, and to introduce an official playbook for new asset issuers and a systematic investigation of cross-pool interconnectivity.

---

## 4. Response and Mitigation

### 4.1 Cross-Chain Bridge Architecture Level

| Category | Mitigation | Priority |
|------|----------|----------|
| DVN configuration | **Mandatory transition from single verifier (1-of-1) to multi-verifier (≥2-of-N)** | ★★★★★ |
| RPC security | RPC endpoint access control, geographic distribution, authenticated-node-only, RPC quorum diversification | ★★★★★ |
| State verification | Introduce light clients or ZKP-based cryptographic verification | ★★★★☆ |
| Monitoring | **Cross-chain invariant monitoring** — real-time reconciliation of source-chain burn amounts and destination-chain release amounts | ★★★★☆ |

### 4.2 DeFi Protocol Level

| Category | Mitigation |
|------|----------|
| **Listing standards** | Include single-point-of-failure and off-chain infrastructure security level in evaluation metrics when listing assets |
| **Risk parameters** | When configuring high-LTV settings such as eMode, reflect cross-chain infrastructure risk at a level equal to price volatility |
| **Emergency response** | Early-warning and automatic-freeze mechanisms benchmarked on KelpDAO's rapid contract freeze (blocked USD 100M+ more) |
| **Post-mortem sharing** | Establish a culture of sharing detailed technical analysis and lessons with the industry when hacks occur |

### 4.3 Regulatory / Policy Level (Korea)

| Category | Mitigation |
|------|----------|
| **Regulatory framework** | Consider adding a "cross-chain risk assessment" item to the Virtual Asset User Protection Act |
| **Information-sharing system** | Form a DeFi threat-intelligence sharing council among KISA, the Financial Security Institute, and major exchanges |
| **International cooperation** | Expand cooperation with global on-chain intelligence firms such as Chainalysis and TRM Labs |
| **Investor education** | Develop investor warning guidelines for high-risk DeFi configurations such as "single-verifier bridges" |

### 4.4 Security Industry / Developer Level

| Category | Mitigation |
|------|----------|
| **Off-chain security assessment** | Mandate regular penetration testing and vulnerability assessment of RPC node infrastructure |
| **Secure coding** | Distribute guidelines including a "no single point of failure" principle when implementing cross-chain bridges |
| **AI security use** | Use AI/ML models to detect off-chain anomalies such as "fake burns" |

---

## 5. Conclusion and Recommendations

The KelpDAO incident is not merely a single hack but a structural event that clearly exposed the blind spot of the **off-chain verification layer of cross-chain bridges.** The on-chain side appeared perfectly legitimate, but the moment the off-chain RPC — the root of trust — was poisoned, the entire system collapsed.

Ecosystem participants must treat cross-chain assets on the following premises.

1. **Treat single-verifier (1-of-1) configurations as untrusted.** Do not place operational assets without multi-DVN and multi-RPC quorum.
2. **On-chain legitimacy ≠ safety.** Without cross-chain invariant monitoring, this class of attack cannot be detected.
3. **Inter-asset interconnectivity is a contagion path.** The infrastructure risk of collateral assets must be treated on par with price risk.
4. **The North Korean threat is an imminent national security matter.** The reality that two hacks accounted for 76% of global losses demands immediate strengthening of domestic governance and information-sharing frameworks.

Security is not the opposite of speed but a design for sustaining speed over the long term. As the cross-chain ecosystem is being explosively adopted, neglecting the structural flaws of the off-chain verification layer will compound subsequent damage.

---

## References

[1] Chainalysis, "Inside the KelpDAO Bridge Exploit", 2026. <https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/>

[2] Galaxy Research, "KelpDAO/LayerZero Exploit Drains $290m, Freezes DeFi Markets", 2026.

[3] LayerZero, "KelpDAO Incident Statement", 2026-04-19. <https://layerzero.network/blog/kelpdao-incident-statement>

[4] CoinDesk, "Aave rallies DeFi partners to contain fallout from $292 million KelpDAO hack", 2026-04-23. <https://www.coindesk.com/business/2026/04/23/aave-rallies-defi-partners-to-contain-fallout-from-usd292-million-kelpdao-hack>

[5] Bitcoin.com News, "KelpDAO Slams LayerZero After $300M Exploit, Shifts rsETH to Chainlink CCIP", 2026. <https://news.bitcoin.com/kelpdao-slams-layerzero-after-300m-exploit-shifts-rseth-to-chainlink-ccip/>

[6] MEXC News, "LayerZero Labs open letter attempts to explain failures around KelpDAO hack", 2026-05-08. <https://www.mexc.com/news/1080101>

[7] Decrypt, "Aave Leads 'DeFi United' Push to Contain $292M KelpDAO Fallout", 2026-04-24. <https://decrypt.co/365431/aave-leads-defi-united-push-to-contain-292m-kelpdao-fallout>

[8] incrypted, "KelpDAO Accused LayerZero of an Infrastructure Failure Following the Hack", 2026. <https://incrypted.com/en/kelpdao-accused-layerzero-of-an-infrastructure-failure-following-the-hack/>

[9] coinpaper, "LayerZero, Lazarus and KelpDAO: The Full Story Behind the $292M Bridge Exploit", 2026. <https://coinpaper.com/16938/layer-zero-lazarus-and-kelp-dao-the-full-story-behind-the-bridge-exploit>

[10] The Block, "North Korea accounts for 76% of 2026 crypto hack losses…: TRM Labs", 2026. <https://www.theblock.co/post/399569/>

[11] CoinDesk, "Kelp says LayerZero approved setup it blamed for $292 million bridge hack", 2026-05-05. <https://www.coindesk.com/web3/2026/05/05/kelp-claims-that-layerzero-approved-the-setup-it-blamed-for-usd292-million-bridge-hack>

[12] CoinDesk, "Kelp DAO claims LayerZero's default settings are what actually caused the $290 million disaster", 2026-04-20. <https://www.coindesk.com/tech/2026/04/20/kelp-dao-claims-layerzero-s-default-settings-are-what-actually-caused-the-usd290-million-disaster>

[15] Decrypt, "Aave Leads 'DeFi United' Push…", 2026-04-24 (bad debt estimate $123.7M–$230.1M). <https://decrypt.co/365431/>

[17] CoinDesk, "Aave raises nearly 80% of the $200 million it needs to cover bad debt left by Kelp DAO exploit", 2026-04-26. <https://www.coindesk.com/business/2026/04/26/>

[18] KuCoin, "DeFi United Raises $160M to Cover Aave Bad Debt from KelpDAO Exploit", 2026. <https://www.kucoin.com/news/flash/defi-united-raises-160m-to-cover-aave-bad-debt-from-kelpdao-exploit>

[24] The Block, "North Korea accounts for 76% of 2026 crypto hack losses, with theft since 2017 topping $6 billion: TRM Labs", 2026.

[25] crypto.news, "TRM Labs: North Korea-linked hackers drive 76% of 2026 crypto thefts", 2026. <https://crypto.news/trm-labs-north-korea-linked-hackers-drive-76-of-2026-crypto-thefts/>

[26] TRM Labs, "North Korea Stole 76% of All Crypto Hack Value in 2026 — With Just Two Attacks", 2026. <https://www.trmlabs.com/resources/blog/north-korea-stole-76-of-all-crypto-hack-value-in-2026-with-just-two-attacks>

[30] spaziocrypto, "North Korea: 76% of Crypto Hack Losses in 4 Months, 2026", 2026. <https://en.spaziocrypto.com/defi/north-korea-76-percent-crypto-hack-losses-2026/>

---

© 2026 Dennis Kim (김호광) · This document is published as part of an independent CTI archive (TLP:GREEN).
Contact: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
