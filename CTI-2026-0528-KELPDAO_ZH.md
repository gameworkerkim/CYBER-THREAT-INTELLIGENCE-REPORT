| id             | CTI-2026-0528-KELPDAO                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | KelpDAO LayerZero 跨链桥黑客事件 —— 针对链下验证基础设施单点故障的高级攻击                                                                                                                                                                |
| subtitle       | 1-of-1 DVN、RPC 节点投毒，以及蔓延至整个 DeFi 的系统性风险                                                                                                                                                                          |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-28                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | CRITICAL                                                                                                                                                                                                        |
| lang           | zh                                                                                                                                                                                                              |
| tags           | | Web3-Security | DeFi | Lazarus-Group | Cross-Chain | North-Korea | Bridge-Security | RPC-Compromise | | -------------- | --- | ------------- | ----------- | ------------ | --------------- | --------------- | |
| threat\_actors | | Lazarus Group (TraderTraitor · 朝鲜背景) | | -------------------------------------- |                                                                                                              |
| cve            | 不适用（针对链下基础设施设计弱点的攻击，而非智能合约缺陷）                                                                                                                                                                                     |
| frameworks     | | MITRE ATT&CK (T1566, T1499, T1195, T1583) | NIST SP 800-207 (Zero Trust) | | ----------------------------------------- | ---------------------------- |                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# KelpDAO LayerZero 跨链桥黑客事件 —— 针对链下验证基础设施单点故障的高级攻击

> **报告 ID** `CTI-2026-0528-KELPDAO` · **发布日期** 2026-05-28 · **分类** `TLP:GREEN` · **严重程度** 🔴 CRITICAL
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*1-of-1 DVN、RPC 节点投毒，以及蔓延至整个 DeFi 的系统性风险*

---

## 目录

1. 摘要 (TL;DR)
2. 事件概述
3. 技术分析 —— 攻击向量
4. 影响评估 —— 韩国与 Web3 的波及
5. 应对与缓解方案
6. 结论与建议
7. 参考文献

---

## 摘要 (TL;DR)

2026 年 4 月 18 日，**朝鲜关联黑客组织 Lazarus Group 的下属组织 TraderTraitor** 攻击了流动性再质押协议 **KelpDAO** 的 LayerZero 跨链桥基础设施，窃取了 **116,500 rsETH（约 2.92 亿美元）**。这被记录为 **2026 年最大的 DeFi 黑客事件** [1][2]。

尤为值得关注的是，本次攻击并非利用智能合约漏洞或价格预言机操纵等已知漏洞，而是精准地切入了**链下验证基础设施（off-chain infrastructure）**的设计缺陷。由于链上交易本身——签名、消息格式、合约调用——看起来全部正常，现有的链上安全方案未能检测到此次攻击 [1]。

攻击的核心如下：

1. 因 **1-of-1 单一验证者（DVN）** 配置而导致的单点故障（Single Point of Failure）[3]
2. **RPC 节点劫持**：渗透并篡改 LayerZero Labs DVN 所用的 2 个 RPC 节点，并对未经验证的外部 RPC 节点发起 DDoS 攻击，迫使系统故障转移（failover）至被污染的节点 [6]
3. **注入伪造的销毁数据**：通过被篡改的节点，向 DVN 传递伪造数据，使其看起来 rsETH 已在源链上被"销毁"
4. **跨链桥合约的未授权放款**：伪装成已通过正常验证，窃取 116,500 rsETH

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                          | 置信度        |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | 本次事件的根本原因并非智能合约漏洞，而是 **1-of-1 DVN 这一链下验证结构的单点故障**；结合 LayerZero 的默认配置与快速入门长期提供 1/1 结构这一点，应将其定义为**整个生态的结构性风险**。 | **High**   |
| KJ-2 | 攻击在链上层面看起来完全正常，因此传统链上安全方案无法检测。**唯有跨链不变式监控（cross-chain invariant monitoring）**才能提前检测此类攻击。 | **High**   |
| KJ-3 | Lazarus/TraderTraitor 仅凭 **Drift（2.85 亿美元）与 KelpDAO（2.92 亿美元）两起事件，就占据了 2026 年全球加密货币黑客损失的 76%（约 5.77 亿美元）**。这意味着朝鲜威胁是对韩国 Web3 生态实际且迫近的威胁。 | **High**   |
| KJ-4 | 被窃取的 rsETH 在 Aave 等处被复用为无担保借贷的抵押品，使得**单一协议黑客转化为整个 DeFi 的系统性风险**。资产间的互联性成为了传染（contagion）的通道。 | **Medium-High** |
| KJ-5 | Aave 主导的民间联合救助（**DeFi United**）是与 2008 年政府主导救助形成对比的新里程碑，但并非防止同类事件再发的结构性解法，须同时推进上市与抵押标准的改革。 | **Medium**      |

---

## 1. 事件概述

### 1.1 基本信息

| 项目 | 内容 |
|------|------|
| **受害对象** | KelpDAO（基于以太坊的流动性再质押协议，发行 rsETH） |
| **攻击时间** | 2026 年 4 月 18 日 |
| **损失规模** | 116,500 rsETH ≈ 2.92 亿美元（rsETH 流通量的相当部分）[1][11] |
| **攻击路径** | LayerZero 跨链桥 —— 链下验证基础设施（RPC 节点） |
| **幕后** | 与朝鲜侦察总局关联的 Lazarus Group，TraderTraitor 下属组织（LayerZero 官方事后分析、TRM Labs 归因）[3][10] |
| **二次窃取拦截** | KelpDAO 通过暂停（pause）合约拦截了额外超过 1 亿美元（2 笔伪造交易）[11] |
| **事后应对** | KelpDAO 冻结 rsETH 合约；Arbitrum Security Council 冻结约 30,766 ETH（约 7,150 万美元）[8] |

> ⚠️ **数值订正备注**：经一手资料交叉核验，本报告将部分二手报道中混淆的数值确定如下。① Aave 所遭受的坏账约为 **1.237 亿~2.301 亿美元**（攻击者从 Aave 借入约 1.9 亿美元）；部分早期报道的"195 亿美元"系明显错误。② 主要洗钱路径并非 Tornado Cash，而是**通过 THORChain 转换为 BTC**（Tornado Cash 仅在前期资金筹措阶段被小额使用）。

### 1.2 DeFi 生态连锁影响

本次黑客事件并未止于单一协议的损失。攻击者将无担保发行（unbacked）的 rsETH 作为抵押品存入 Aave V3 并借出合法资产，由此产生的影响如下 [4][7][15]。

| 项目 | 内容 |
|------|------|
| **Aave 借款·坏账** | 攻击者从 Aave 借入约 1.9 亿美元，坏账估计约 1.237 亿~2.301 亿美元 |
| **Aave 存款外流** | 48 小时内净流出超过 80 亿美元（部分统计为 100 亿美元） |
| **DeFi 总锁仓价值（TVL）** | 骤降约 130 亿美元（按部分统计，$99.5B → $83.7B） |
| **连锁清算危机** | rsETH 脱锚导致 eMode 等高 LTV 头寸同时逼近清算临界点，"循环（looping）"交易被冻结 |

---

## 2. 技术分析 —— 攻击向量

### 2.1 1-of-1 单一 DVN 配置：根本原因

KelpDAO 的 rsETH 跨链消息传递被配置为仅经过**单一验证者**——LayerZero Labs DVN。在 LayerZero 中，所有跨链消息在目标链执行之前都必须经过一个或多个去中心化验证者网络（DVN）的验证。rsETH 采用了无需第二个 DVN 同意的 1-of-1 结构，这本质上提供了一个单点故障 [1][3]。

责任归属存在争议。LayerZero 主张这是 KelpDAO 无视多 DVN 建议的选择，而 KelpDAO 反驳称 LayerZero 的官方快速入门指南与默认 GitHub 配置（`layerzero.config.ts`）本身就提供了 1/1 结构，且 LayerZero 负责人曾直接确认其安全性 [5][12]。事实上，事发当时活跃的 LayerZero OApp 合约中约有 **40~47% 使用相同的 1-of-1 DVN 配置** [11][12]。事件之后，LayerZero 决定停止为单一验证者配置签署消息，KelpDAO 则将 rsETH 迁移至 **Chainlink CCIP** [5]。

### 2.2 链下 RPC 节点渗透：执行机制

| 阶段 | 说明 |
|------|------|
| **① 内部节点渗透** | 攻击者访问 LayerZero Labs DVN 所用的 RPC 列表，渗透 2 个 RPC 节点，并替换节点上运行的二进制文件 [11] |
| **② DDoS 诱导故障转移** | 对未被入侵（uncompromised）的外部 RPC 节点发起 DDoS 攻击，迫使系统故障转移至被污染的节点 [6][11] |
| **③ 注入伪造数据** | 被篡改的节点向 DVN 发送虚假状态数据，仿佛 rsETH 已在源链上被"销毁（burn）" |
| **④ 跨链桥合约执行** | DVN 将伪造的销毁数据验证为正常，以太坊跨链桥合约遂向攻击者地址放出 116,500 rsETH |

据 Chainalysis 分析，由于 LayerZero 将 1-of-1 RPC 法定人数（quorum）设为默认值，即便只有一个节点被污染，DVN 也会在未与其他节点交叉验证的情况下签署伪造消息 [5]。

### 2.3 现有安全方案的检测失败

由于所有链上交易的签名、消息格式与合约调用看起来都完全正常，传统的基于智能合约的安全方案完全无法检测此次攻击 [1]。要检测它，需要**跨链不变式监控（cross-chain invariant monitoring）**——即持续验证目标链上解锁的代币与源链上销毁的代币在数学上是否一致。

### 2.4 洗钱与冻结

被窃资金中约 1.75 亿美元在约 36 小时内通过 **THORChain** 转换为 BTC，随后的洗钱阶段据分析主要由中国籍中介而非朝鲜处理 [10][30]。前期资金筹措的一部分被追溯至 2018 年因 Lazarus 洗钱被起诉的中国经纪人吴慧慧（Wu Huihui）控制的钱包以及 BTCTurk 黑客事件 [26]。然而，**Arbitrum Security Council** 与执法机构合作，成功冻结了约 30,766 ETH（约 7,150 万美元）[8]。

---

## 3. 影响评估 —— 韩国与 Web3 的波及

### 3.1 对韩国的影响

**① Web3／虚拟资产行业信任危机** —— KelpDAO 也是韩国投资者与开发者社区关注的项目。考虑到 rsETH 曾在主要 Layer2 及 Aave 等处被广泛使用，国内用户的间接损失可能性不能排除。

**② 金融当局监管审查强化** —— 自《虚拟资产用户保护法》施行以来持续强化监管的金融当局，很可能以本次事件为契机严格审视 DeFi 协议的跨链风险管理标准。尤其预计将朝把"链下基础设施"安全水平纳入评估指标的方向发展。

**③ 朝鲜网络威胁认知提升** —— 2026 年初，仅 Drift Protocol（约 2.85 亿美元）与 KelpDAO（约 2.92 亿美元）两起黑客事件，朝鲜就占据了全球加密货币黑客损失额的约 **76%（约 5.77 亿美元）** [24][26]。朝鲜的占比从 2022 年的 22%、2023 年的 37%、2024 年的 39%、2025 年的 64% 升至 2026 年的 76%，创历史新高 [25]。国内安全业界与金融当局之间信息共享体系的强化迫在眉睫。

**④ 国内交易所·DeFi 服务应对** —— 国内主要交易所预计将对 rsETH 及相关衍生品重新审查上市并强化风险评估标准，并可能考虑对具有单一验证者结构的跨链资产引入单独审查。

### 3.2 对 Web3 业界的影响

**① 跨链桥信任下降与迁移** —— 尽管核心漏洞在于 DVN 配置方式而非 LayerZero 协议本身，但对跨链桥安全模型整体的重新审视已不可避免。事实上，包括 KelpDAO（约 15 亿美元）、SolvProtocol（约 6 亿美元）在内、合计 TVL 约 20 亿美元规模的协议正从 LayerZero 迁移至 **Chainlink CCIP**（验证要求至少 16 个独立节点运营者）[9]。

**② 链下安全方案市场快速增长** —— 随着以链上为中心的安全的局限性暴露，对链下基础设施监控、RPC 端点诊断、跨链状态验证方案的需求预计将激增。

**③ 'DeFi United' —— 业界联合救助的新里程碑** —— 由 Aave 主导发起的民间联合救助倡议。**最大贡献者并非最初所传的 LayerZero·EtherFi，而是 Mantle 与 Aave DAO** [15][18]。

| 参与者 | 贡献内容 |
|--------|----------|
| Mantle Treasury | 最多 30,000 ETH（3 年信贷，Lido 质押收益率 +1%） |
| Aave DAO | 25,000 ETH（治理投票进行中）—— 与 Mantle 合计 55,000 ETH（约 1.27 亿美元） |
| Consensys / Joseph Lubin | 最多 30,000 ETH |
| Stani Kulechov（Aave 创始人） | 个人 5,000 ETH |
| EtherFi | 5,000 ETH |
| Lido DAO | 最多 2,500 stETH（约 570 万美元） |
| 其他 | Golem Foundation 1,000 ETH、Aave VP 500 ETH、Ethena·LayerZero·Ink·Frax·Tydro 等 |

截至 4 月 25 日，DeFi United 已筹集约 1.6 亿美元，填补了所需约 2 亿美元的约 80% [17]。这种民间主导的应对与 2008 年政府主导的银行救助形成对比，被评价为体现 DeFi 成熟度的案例。

**④ Aave 全面改革抵押·上市标准** —— Aave 决定将抵押资产评估标准从价格波动性扩展至网络安全、互操作性与底层架构，并引入面向新资产发行方的官方手册以及对资金池间系统性互联的调查。

---

## 4. 应对与缓解方案

### 4.1 跨链桥架构层面

| 类别 | 应对方案 | 优先级 |
|------|----------|----------|
| DVN 配置 | **从单一验证者（1-of-1）转向多验证者（≥2-of-N）** 必行 | ★★★★★ |
| RPC 安全 | RPC 端点访问控制·地理分散·仅限认证节点，RPC 法定人数多元化 | ★★★★★ |
| 状态验证 | 引入轻客户端（Light Client）或基于 ZKP 的密码学验证 | ★★★★☆ |
| 监控 | **跨链不变式监控** —— 实时对照源链销毁量与目标链解锁量 | ★★★★☆ |

### 4.2 DeFi 协议层面

| 类别 | 应对方案 |
|------|----------|
| **上市标准** | 资产上市时将单点故障·链下基础设施安全水平纳入评估指标 |
| **风险参数** | 设置 eMode 等高 LTV 时，将跨链基础设施风险按与价格波动性同等的水平反映 |
| **应急响应** | 借鉴 KelpDAO 迅速冻结合约（额外拦截 1 亿美元+）案例的预警·自动冻结机制 |
| **事后分析共享** | 确立黑客发生时向业界共享详细技术分析·教训的文化 |

### 4.3 监管·政策层面（韩国）

| 类别 | 应对方案 |
|------|----------|
| **监管框架** | 考虑在《虚拟资产用户保护法》中增设"跨链风险评估"项目 |
| **信息共享体系** | 在 KISA、金融安全院与主要交易所之间组建 DeFi 威胁情报共享协议体 |
| **国际协作** | 扩大与 Chainalysis、TRM Labs 等全球链上情报企业的合作 |
| **投资者教育** | 针对"单一验证者跨链桥"等高风险 DeFi 配置制定投资者警示指南 |

### 4.4 安全业界·开发者层面

| 类别 | 应对方案 |
|------|----------|
| **链下安全诊断** | 对 RPC 节点基础设施强制实施定期渗透测试·漏洞诊断 |
| **安全编码** | 在实现跨链桥时分发包含"禁止单点故障"原则的指南 |
| **AI 安全应用** | 运用 AI/机器学习模型检测"伪造销毁"等链下异常征兆 |

---

## 5. 结论与建议

KelpDAO 事件并非单纯的一起黑客事件，而是清楚暴露了**跨链桥的链下验证层**这一防御盲区的结构性事件。链上看起来完全正常，但作为信任之源的链下 RPC 一旦被污染，整个系统便随之崩溃。

生态参与者必须在以下前提下处理跨链资产。

1. **将单一验证者（1-of-1）配置视为不可信（untrusted）**。在没有多 DVN·多 RPC 法定人数的情况下，不上线运营资产。
2. **链上正常 ≠ 安全**。没有跨链不变式监控，便无法检测此类攻击。
3. **资产间的互联性即传染路径**。抵押资产的基础设施风险须与价格风险同等对待。
4. **朝鲜威胁是迫近的国家安全事项**。两起黑客就占据全球损失 76% 的现实，要求立即强化国内治理与信息共享体系。

安全并非速度的反义词，而是为长久维持速度而进行的设计。在跨链生态正被爆炸式采用的当下，放任链下验证层的结构性缺陷，将使日后的损失以复利方式增长。

---

## 参考文献 (References)

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

[15] Decrypt, "Aave Leads 'DeFi United' Push…", 2026-04-24（坏账估计 $123.7M–$230.1M）. <https://decrypt.co/365431/>

[17] CoinDesk, "Aave raises nearly 80% of the $200 million it needs to cover bad debt left by Kelp DAO exploit", 2026-04-26. <https://www.coindesk.com/business/2026/04/26/>

[18] KuCoin, "DeFi United Raises $160M to Cover Aave Bad Debt from KelpDAO Exploit", 2026. <https://www.kucoin.com/news/flash/defi-united-raises-160m-to-cover-aave-bad-debt-from-kelpdao-exploit>

[24] The Block, "North Korea accounts for 76% of 2026 crypto hack losses, with theft since 2017 topping $6 billion: TRM Labs", 2026.

[25] crypto.news, "TRM Labs: North Korea-linked hackers drive 76% of 2026 crypto thefts", 2026. <https://crypto.news/trm-labs-north-korea-linked-hackers-drive-76-of-2026-crypto-thefts/>

[26] TRM Labs, "North Korea Stole 76% of All Crypto Hack Value in 2026 — With Just Two Attacks", 2026. <https://www.trmlabs.com/resources/blog/north-korea-stole-76-of-all-crypto-hack-value-in-2026-with-just-two-attacks>

[30] spaziocrypto, "North Korea: 76% of Crypto Hack Losses in 4 Months, 2026", 2026. <https://en.spaziocrypto.com/defi/north-korea-76-percent-crypto-hack-losses-2026/>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立 CTI 档案（TLP:GREEN）公开发布。
联系方式：<gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
