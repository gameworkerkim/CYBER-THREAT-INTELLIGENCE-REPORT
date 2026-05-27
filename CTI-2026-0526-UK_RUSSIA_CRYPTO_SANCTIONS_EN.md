# CTI-2026-0526 — UK Bank-Grade Crypto Sanctions Against Russia's A7 Network

**Architecture, Compliance Shockwaves, and the Convergent State-Actor Evasion Ecosystem (DPRK & Iran)**

| Field | Value |
|---|---|
| Report ID | CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS |
| Classification | TLP:CLEAR — Sanctions & Illicit Finance |
| Date | 26 May 2026 |
| Author | Dennis Kim |
| Languages | KO / ZH / JA / EN |

---

## 1. Executive Summary

On 26 May 2026, the United Kingdom imposed a sanctions package targeting 18 entities and individuals tied to what its Foreign, Commonwealth & Development Office (FCDO) described as the illicit financial infrastructure used to move funds, procure goods, and sustain Russia's war in Ukraine. Two features make this package strategically significant:

- **First bank-grade application to crypto exchanges.** For the first time under the UK's Russia sanctions regime, exchanges are treated like correspondent banks — UK firms must freeze funds, sever correspondent relationships, and trace transactions across the blockchain.
- **Direct targeting of the A7 / A7A5 architecture.** The package strikes the Kremlin-aligned A7 payments network and the ruble-backed stablecoin A7A5, which together have moved sums rivaling half of Russia's annual military spending.

The action does not exist in isolation. It is the latest move in a Western enforcement arc spanning the Garantex takedown, EU 19th/20th sanctions packages, and US OFAC designations.

Critically, the techniques the UK now targets — stablecoin bridging, Kyrgyzstan/UAE corridor routing, chain- and asset-hopping, OTC cash-out — are the **same playbook** independently operated by North Korea's Lazarus Group and Iran's IRGC-aligned networks.

## 2. The 26 May 2026 UK Sanctions Package

### 2.1 Scope and Designations

The FCDO package targets three categories: crypto exchanges, payment/financial firms, and individuals. Among the named entities:

| Entity | Type | Role |
|---|---|---|
| Huobi Global S.A. (HTX) | Global exchange | Services within Russia evasion infrastructure |
| Grinex | Exchange (Kyrgyz) | Successor platform to seized Garantex |
| Meer | Exchange (9 Dec 2024) | Created same day as Grinex / A7A5 |
| Capital Bank | Bank (Kyrgyzstan) | Banking support for A7A5 |
| Bitpapa IC FZC LLC | Exchange/payments | Resources to A7 LLC |
| Exmo Exchange Limited | Exchange | Resources to A7 LLC |
| Aifory LLC | Payments | Resources to A7 LLC |
| Rapira Group LLC | Payments | Resources to A7 LLC |

Designations were issued under the UK's Russia (Sanctions) (EU Exit) Regulations 2019. Sanctions Minister Stephen Doughty said the Kremlin's attempts to launder sanctions relief through dodgy crypto networks would not succeed. Foreign Secretary Yvette Cooper described the strategy as tracking down and shutting off the financial lifelines that sustain Putin's war machine.

### 2.2 The A7 Network — The Central Target

UK officials assess the A7 payments network as having processed over **$90 billion in 2025**, roughly equivalent to half of Russia's annual military spending. Entities connected to A7 are assessed to have used Kyrgyzstan's financial system to route funds through cryptocurrency, with flows tied to Russian oil-sale proceeds and military procurement.

## 3. A7 / A7A5 — Anatomy of a State-Backed Evasion Stack

### 3.1 Ownership and Origin

A7 LLC is a Moscow-based fintech founded in late 2024 under Kremlin support. Its principal figures are:

- **Ilan Shor** — a fugitive Moldovan oligarch granted Russian citizenship, previously convicted in the ~$1B theft from Moldova's banking system (2014) and sanctioned by the US and EU.
- **Promsvyazbank (PSB)** — the Russian state-owned bank serving the defense sector, holding ~49% and itself sanctioned.

President Putin attended a virtual ribbon-cutting for an A7 branch opening in September 2025, underscoring the state-backed nature of the operation.

### 3.2 A7A5 — The Ruble-Backed Bridging Asset

- **Issuer:** Old Vector LLC (Kyrgyzstan); claims 1:1 ruble backing held at PSB.
- **Chains:** Issued on both Ethereum and TRON.
- **Function:** Converts rubles into crypto, then **instantly swappable into mainstream USDT without KYC** — defeating identity-based tracing.
- **Scale:** By January 2026, crossed **$100 billion in cumulative on-chain transactions** in under a year — ~250,000 transfers across 41,000+ accounts — the largest non-dollar stablecoin in the world.

### 3.3 The Kyrgyzstan Corridor

- Russian firms convert rubles into A7A5, regulated under Kyrgyz authorities, sidestepping ruble-payment restrictions.
- A7A5 is swapped for USDT — primarily on Kyrgyz-based exchanges **Grinex** and **Meer** — without identity verification.
- USDT moves into the broader crypto economy, obscuring origin and destination.

Western sanctions cut targets off from SWIFT, correspondent banking, and dollar-clearing; Kyrgyzstan's banking and crypto licensing provided the off-ramp. Grinex was prepared for months as the **successor to Garantex** before US/Germany/Finland seized Garantex's domain and froze ~$26M (mostly Tether) in March. Grinex, A7A5, and Meer were all established on 9 December 2024 — indicating premeditated continuity planning.

## 4. Compliance Shockwaves — Why "Bank-Grade" Changes Everything

### 4.1 From List-Screening to Chain-Tracing

UK financial firms and crypto service providers cannot maintain correspondent relationships with designated entities or process related payments. Per Elliptic, the rules can require tracing across multiple blockchain hops — extending checks **beyond direct counterparties** to any wallet or exchange in a transaction chain.

| Old Posture | New Posture |
|---|---|
| Screen counterparty against SDN list | Trace multi-hop transaction graph |
| Freeze on direct match | Freeze on indirect / downstream exposure |
| Jurisdiction-of-counterparty risk | Cross-chain, cross-asset exposure regardless of user jurisdiction |
| Periodic review | Continuous on-chain monitoring |

### 4.2 Practical Obligations for VASPs and Financial Institutions

- **Cross-chain, cross-asset screening** becomes baseline; A7 interoperability (ETH ↔ TRON ↔ USDT) raises chain/asset-hopping risk.
- **Central Asian and Caucasus corridor diligence** shifts from heightened-risk to default — Kyrgyzstan, and to a lesser extent UAE and Georgia.
- **Indirect exposure liability** — market access to A7A5/RUBx or processing related wallet transactions creates exposure regardless of user location.

### 4.3 Implication for Korean VASPs (DAXA Context)

UK-style multi-hop tracing foreshadows the bar allied jurisdictions may converge toward. Korean VASPs with USDT liquidity and Central Asia / UAE exposure should pre-emptively:

- (a) integrate cross-chain analytics covering TRON and Ethereum A7A5 flows;
- (b) treat Kyrgyz-licensed venues (Grinex, Meer) and downstream wallets as high-risk;
- (c) document tracing methodology to demonstrate good-faith diligence under correspondent-style expectations.

## 5. The Convergent State-Actor Evasion Ecosystem

The UK's targeting of Russia's stack is one front in a broader contest. The **same techniques** — stablecoin reliance, OTC cash-out, multi-hop laundering, permissionless-chain abuse — are independently run by other sanctioned state actors. Modeling these as separate problems misses the shared infrastructure and tradecraft.

### 5.1 North Korea (DPRK) — Lazarus Group

- **Scale:** ~$6 billion+ stolen since 2017, funding weapons programs; a dominant share of 2026 hack losses.
- **Marquee ops:** ~$1.5B from Bybit (Feb 2025, FBI-described largest single heist); ~$290–292M from Kelp DAO via a LayerZero cross-chain bridge single-verifier flaw (18 Apr 2026).
- **Laundering:** stolen assets → BTC → shard → mix → **USDT** → **OTC brokers, typically in China**; Kelp DAO also used stolen tokens as DeFi loan collateral.
- **Off-ramp convergence:** Lazarus historically used **Russian exchange Garantex** — the same platform whose successor (Grinex) the UK just sanctioned — the clearest DPRK–Russia infrastructure overlap.
- **Enforcement:** US DOJ seized ~$15M USDT in a DPRK case (five guilty pleas, Nov 2025).

### 5.2 Iran — IRGC & Nobitex

- **Central bank accumulation:** CBI acquired **$500M+ USDT on TRON** (Nov 2024–Jun 2025); ~$347M to Nobitex.
- **Nobitex hub:** ~11–15M users, ~70% of national volume; ~half of Iran's 2025 activity IRGC-linked; IRGC moved ~$3B since 2023 across 5,000+ addresses.
- **Chains/signaling:** $2B+ on TRON, $317M+ on BNB Chain since Jan 2023; volume spikes correlate with kinetic events — **blockchain as a conflict barometer**.
- **Tradecraft:** advises layering across multiple wallets — directly analogous to the multi-hop obfuscation the UK rules now target.

### 5.3 Convergence Matrix

| Vector | Russia (A7/A7A5) | DPRK (Lazarus) | Iran (IRGC/Nobitex) |
|---|---|---|---|
| Primary driver | Trade / oil revenue | Theft / regime funding | Trade / reserves |
| Core asset | A7A5 → USDT | BTC → USDT | USDT |
| Preferred chains | ETH, TRON | Multi (BTC, ETH, bridges) | TRON, BNB Chain |
| Key corridor/venue | Kyrgyzstan (Grinex, Meer) | China OTC; Garantex (hist.) | Nobitex; UAE/UK fronts |
| Obfuscation | Instant no-KYC swaps | Shard + mix + DeFi loans | Multi-wallet layering |

> **Strategic insight:** all three converge on USDT liquidity, OTC off-ramps, and permissionless chains. Garantex/Grinex sits at the literal intersection of Russian and DPRK flows. Bank-grade, multi-hop tracing — though framed against Russia — degrades the shared infrastructure all three depend on.

## 6. Assessment & Outlook

- **Precedent over package.** The lasting significance is bank-grade exchange treatment and the multi-hop tracing mandate. Expect allied convergence (EU, US, FATF-aligned) toward this standard.
- **Adaptation near-certain.** A7 is repositioning A7A5 as a long-term settlement tool; expect new Kyrgyz/UAE shells, fresh issuers (RUBx already joined banned lists), and DEX/privacy migration.
- **USDT is the chokepoint.** Indispensable to all three; its (limited) seizability on regulated rails makes it the highest-value enforcement leverage.
- **Chain-hopping defeats single-chain monitoring.** ETH ↔ TRON ↔ BNB interoperability makes cross-chain, cross-asset tracing the minimum viable capability.
- **On-chain data as early warning.** Iranian volume spikes preceding kinetic events show monitored flows can serve as a conflict early-warning signal — a CTI fusion opportunity.

## 7. Recommendations

### For VASPs / Exchanges (incl. Korean DAXA members)

- Deploy cross-chain analytics (ETH, TRON, BNB); screen for A7A5, RUBx, and known IRGC/Lazarus address clusters.
- Treat Kyrgyz-licensed venues (Grinex, Meer), Garantex-successor wallets, and Nobitex downstream addresses as high-risk by default.
- Implement multi-hop exposure scoring, not just direct-counterparty SDN screening.
- Document tracing methodology to evidence good-faith diligence.

### For Financial Institutions

- Extend Central Asia / Caucasus / UAE corridor diligence from heightened-risk to baseline.
- Build freeze-and-trace runbooks anticipating indirect / downstream exposure obligations.

### For CTI / Security Teams

- Track Garantex → Grinex → A7A5 infrastructure as a shared Russia–DPRK off-ramp.
- Monitor Lazarus DeFi-bridge TTPs (single-verifier flaws, cross-chain mints) per the Kelp DAO pattern.
- Treat monitored exchange outflow spikes as potential conflict early-warning indicators.

## 8. Sources

Primary reporting and analysis underlying this report:

- Reuters, CoinDesk, The Moscow Times, Coinpedia, DL News, Yahoo/ARY News (UK package, 26 May 2026)
- Elliptic (A7A5 $100B analysis, EU 19th/20th packages, Nobitex/IRGC)
- TRM Labs (Grinex/Garantex succession, IRGC addressing)
- Chainalysis (2026 Crypto Crime / Sanctions Report)
- Foreign Policy and RFE/RL (A7/Shor/Kyrgyzstan)
- 38 North and Arkham (Lazarus cash-out tradecraft)
- UPI/TechBuzz (Kelp DAO); Times of Israel and Al Jazeera (Nobitex/IRGC); US DOJ (DPRK USDT seizure)

---

Prepared by HoKwang Kim (Dennis Kim) — independent cyber threat intelligence analysis.

For informational and research purposes only; not legal, financial, or investment advice.

https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT

HoKwang Kim (Dennis Kim) · gameworker@gmail.com · © 2026 Betalabs Inc.
