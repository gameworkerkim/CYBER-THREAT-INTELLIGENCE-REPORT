| id             | CTI-2026-0527-GLASSWORM                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | GlassWorm C2 基础设施同步封锁 —— 针对开发者的自传播供应链蠕虫全貌                                                                                                                                                                          |
| subtitle       | 结合区块链、P2P 与合法网络服务的四重 C2，以及蔓延至加密钱包的供应链威胁                                                                                                                                                                              |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | zh                                                                                                                                                                                                              |
| tags           | | Supply-Chain | VS-Code-Extension | Self-Propagating-Worm | Crypto-Wallet-Theft | Solana-C2 | Developer-Targeting | | ------------ | ---------------- | --------------------- | ------------------- | --------- | ------------------ | |
| threat\_actors | | GlassWorm operators（可能为俄罗斯/独联体背景网络犯罪团伙） | | -------------------------------------------- |                                                                                          |
| frameworks     | | MITRE ATT&CK | NIST SP 800-161 (C-SCRM) | SLSA | STIX/TAXII | | ------------ | ------------------------ | ---- | ---------- |                                                                                       |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# GlassWorm C2 基础设施同步封锁 —— 针对开发者的自传播供应链蠕虫全貌

> **报告 ID** `CTI-2026-0527-GLASSWORM` · **发布日期** 2026-05-27 · **分类** `TLP:GREEN` · **严重程度** 🔴 HIGH
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*结合区块链、P2P 与合法网络服务的四重 C2，以及蔓延至加密钱包的供应链威胁*

---

## 目录

1. 摘要 (TL;DR)
2. 事件概述 —— 何物被封锁
3. 攻击机制 —— 四重 C2 与自传播结构
4. 载荷分析 —— 凭据与加密钱包窃取
5. 威胁行为者分析
6. 对韩国的影响
7. 对 Web3 / 加密生态的影响
8. 应对方案
9. IoC 与检测指标
10. 结论与建议
11. 参考文献

---

## 摘要 (TL;DR)

2026 年 5 月 27 日，CrowdStrike 联合 Google 与 Shadowserver 基金会，宣布同步封锁与自传播软件供应链行动 **GlassWorm** 相关的全部四条命令控制（C2）通道。至少自 2025 年初起，GlassWorm 运营者就有系统地以软件开发者为目标——这一群体拥有对源代码仓库、云平台、CI/CD 流水线与软件包注册表的访问权限。

该行动的本质并非简单的恶意软件，而是一种**以开发者工作站为桥头堡、向下游数千个组织与用户扩散的"力量倍增器"结构**。攻击者向 Microsoft VS Code 应用市场与 Open VSX 双重发布木马化扩展，从而触及 Cursor、Positron、Windsurf、VSCodium 等 VS Code 分支用户。通过被污染的 npm 与 Python 软件包传播的路径亦已确认。

尤为值得关注的是其**为抵御封锁而设计的四重 C2 架构**：将 Solana 区块链交易的 memo 字段用作"死信箱"，从 BitTorrent DHT P2P 网络查询配置数据，滥用 Google Calendar 事件标题作为死信箱，并并行运行对商用 VPS 的直接连接。本次封锁同时使四条通道失效，被感染主机已无法再接收新指令或载荷。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                          | 置信度        |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | GlassWorm 的核心威胁是通过开发者环境产生的**链式放大（blast radius）**；C2 封锁仅阻断了新指令的接收，已外泄的凭据与钱包密钥并未被收回。被入侵账户的事后清理至关重要。 | **High**   |
| KJ-2 | 将**区块链（Solana）、P2P（BitTorrent DHT）与合法服务（Google Calendar）**结合为死信箱的四重 C2 设计，很可能成为未来供应链恶意软件的标准。基于单一域名封锁的传统应对无法将其消除。 | **High**   |
| KJ-3 | 载荷优先窃取 **GitHub/NPM/OpenVSX 令牌与加密钱包**，表明 Web3／区块链团队比一般软件企业更直接成为目标。 | **High**   |
| KJ-4 | 基于恶意软件在独联体（CIS）地区主机上终止执行、且代码含俄语注释，CrowdStrike 将其归因于可能位于俄罗斯的网络犯罪团伙。但考虑到代码泄露或模仿的可能性，定论尚早。 | **Medium** |

---

## 1. 事件概述 —— 何物被封锁

CrowdStrike 联合 Google 与 Shadowserver 基金会，于 2026 年 5 月 27 日正式宣布同步封锁与 GlassWorm 相关的全部 C2 通道。GlassWorm 自去年出现以来开展了"多管齐下的行动"，据称利用窃取的开发者凭据污染了超过 300 个 GitHub 仓库。

本事件的意义不在于消灭单个恶意软件，而在于再次确认：**软件供应链本身是现代计算中最具影响力的攻击面之一**。CrowdStrike 评估认为"污染一个软件包或扩展的门槛很低，但潜在的爆炸半径却极为巨大"。只要开发者环境、构建流水线与代码仓库保护不足，每一个消费软件的组织都会继承所有软件生产者的风险。

## 2. 攻击机制 —— 四重 C2 与自传播结构

### 2.1 分发路径

GlassWorm 向两大应用市场——Microsoft VS Code 应用市场与 Open VSX——同时发布恶意扩展。这一双重发布策略的关键在于**覆盖了整个 VS Code 分支生态**。Cursor、Positron、Windsurf、VSCodium 均以 Open VSX 作为扩展来源，因此单个恶意扩展可触及多款 AI 编码 IDE 的用户。此外，通过被污染的 npm 与 Python 软件包的传播路径同时并行。

### 2.2 四重 C2 —— 抗封锁设计

| # | 通道                       | 机制                                                  |
| --- | ------------------------ | --------------------------------------------------- |
| ① | **Solana 区块链死信箱**        | 将 C2 服务器地址存储于区块链交易的 memo 字段，几乎无法审查或封锁              |
| ② | **BitTorrent DHT P2P**   | 查询分布式哈希表 P2P 网络以接收配置数据                              |
| ③ | **Google Calendar 死信箱**  | 从合法服务的日历事件标题中提取 C2 服务器地址（伪装为正常流量）                   |
| ④ | **商用 VPS 直接连接**          | 直接接入托管于商用 VPS 提供商的 C2 基础设施                          |

据 CrowdStrike 评估，这种将区块链、P2P 与合法网络服务结合为解析层的结构，旨在抵御封锁——是一种将真实 C2 服务器隐藏于多层间接引用之后的"动态前端"。本次联合行动通过同步使全部通道失效，一举瓦解了这道多重防线。

## 3. 载荷分析 —— 凭据与加密钱包窃取

GlassWorm 攻击的最终目标是投递一套具备凭据采集、加密钱包外泄与系统画像能力的数据窃取框架。

后续变种部署了名为 **GlassWormRAT** 的基于 WebSocket 的 JavaScript RAT，用以窃取 Web 浏览器数据并运行任意代码。这包括安装一个收集截图、按键、剪贴板内容等敏感信息的 Google Chrome 扩展。

据 Endor Labs 研究人员分析，恶意软件一旦激活，便在主机上搜寻开发者凭据（GitHub、NPM、OpenVSX 令牌、加密钱包），从而进一步入侵仓库与软件包上传权限。换言之，**一次感染即可获得新的恶意软件包发布权限，由此完成自传播闭环**。

被感染主机被转化为隐蔽基础设施——SOCKS 代理、隐藏 VNC（HVNC）服务器，以及通过 WebRTC 或派生 Node.js 进程的远程执行节点。这同时为攻击者提供了进入企业与个人网络的匿名访问通道与进一步传播的平台。

## 4. 威胁行为者分析

CrowdStrike 将 GlassWorm 运营者描述为"资源充足且持续性强"。归因依据有二：其一，恶意软件在位于独联体（CIS）国家的系统上终止执行；其二，代码中含有俄语注释。据此，可能位于俄罗斯的网络犯罪团伙被认定为可能的行为者。

不过，本报告将该归因评为 **Medium 置信度**。规避 CIS 的逻辑与俄语注释是有力的旁证，但确有威胁行为者故意植入假旗或模仿泄露代码的案例。

## 5. 对韩国的影响

GlassWorm 在韩国媒体中几乎未获报道，但对国内开发生态具有直接含义。

第一，**韩国开发者对 VS Code 系列 IDE 的依赖度极高**。Cursor、Windsurf 等 AI 编码 IDE 在韩国初创企业与区块链团队中迅速普及，且均共享 Open VSX 扩展生态。单个恶意扩展可同时触及国内众多团队。

第二，**许多国内企业不加甄别地依赖公共 npm/PyPI 软件包**。由于 GlassWorm 将被污染的软件包用作传播路径，国内 CI/CD 流水线同样面临间接污染风险。

第三，它与本分析师在此前 `CTI-2026-0422-MCP` 报告中指出的**朝鲜关联组织 UNC1069（Sapphire Sleet）的 Axios npm 入侵**共享同一供应链攻击面。作为朝鲜的优先目标国，韩国必须在国家安全层面应对此类自传播供应链蠕虫被改造、重用于社会扰乱或资金窃取的可能性。

## 6. 对 Web3 / 加密生态的影响

与一般供应链恶意软件不同，GlassWorm **在结构上使 Web3 更加危险**，理由有三。

第一，载荷将**加密钱包指定为明确的窃取目标**。浏览器扩展型钱包（MetaMask、Phantom 等）与本地钱包文件是首要目标。

第二，C2 基础设施本身**将 Solana 区块链用作死信箱**。这象征着攻击基础设施与 Web3 基础设施之间界限的崩塌。使用链上数据查询工具的区块链开发团队更难区分正常流量与恶意 C2 流量。

第三，它与本分析师在 `CTI-2026-0422-MCP` 中警示的**"有多签就安全"的错觉**精确契合。若多签签名者在同一主机上使用同一 VS Code 系列 IDE，单次 GlassWorm 感染即可使多签退化为单点故障。窃取 GitHub/NPM 令牌可直接导致智能合约部署权限与前端部署流水线被劫持。

## 7. 应对方案

### 7.1 即时措施（假设已被入侵）

1. **全面轮换开发者凭据** —— 作废并重新签发所有 GitHub、NPM、OpenVSX 个人访问令牌。C2 封锁仅阻断了新指令接收，已泄露的令牌仍然有效。
2. **迁移加密钱包** —— 若钱包曾置于开发机器上，应立即将资产转移至以新种子生成的钱包。原钱包视为已被入侵。
3. **审计 VS Code 系列扩展** —— 检查所有已安装扩展的发布者、签名与最近更新，并对来自 Open VSX 的扩展施加单独的验证关卡。
4. **检查浏览器扩展** —— 移除未经授权的 Chrome 扩展（尤其具有截图／按键／剪贴板权限者）。

### 7.2 结构性措施

1. **将资产与开发机器分离**。Web3 团队应将大额资产隔离于冷钱包／基于 HSM 的多签，并在实际签名设备上不安装 IDE、扩展或开发工具。
2. **将 CI/CD 密钥短期令牌化**。以基于 OIDC 的短时令牌与各环境最小权限取代长期 PAT。
3. **强制实施依赖项 SBOM 与 lockfile 锁定**，并对新增 npm/PyPI 依赖项设置自动隔离期（quarantine）。
4. **将链上 C2 检测纳入监控**。将 Solana memo 字段、BitTorrent DHT 查询、异常 Google Calendar API 调用等非传统 C2 信号添加为 SIEM 规则。

## 8. IoC 与检测指标

> ⚠️ 本节以公开披露时点为准，投入运营使用前请重新核实最新威胁情报。

| 类型          | 指标／行为                                                          |
| ----------- | ------------------------------------------------------------ |
| 恶意软件家族      | GlassWorm、GlassWormRAT（基于 WebSocket 的 JS RAT）               |
| 窃取目标        | GitHub/NPM/OpenVSX 令牌、加密钱包、浏览器数据、截图／按键／剪贴板                  |
| C2 通道       | Solana 交易 memo 字段、BitTorrent DHT、Google Calendar 事件标题、商用 VPS |
| 主机转化行为      | 创建 SOCKS 代理、HVNC 服务器、WebRTC/Node.js 远程执行节点                  |
| 规避特征        | 在 CIS 地区主机上终止执行、含俄语代码注释                                      |
| 分发渠道        | VS Code 应用市场／Open VSX 恶意扩展、被污染的 npm/Python 软件包             |

## 9. 结论与建议

GlassWorm C2 封锁是明确的防御方胜利，但同时也是**对供应链恶意软件演进方向的浓缩警示**。将区块链、P2P 与合法云服务结合为死信箱的四重 C2，证明依赖单一域名封锁的传统应对已不再充分。

核心建议如下：

1. **开发者环境是信任边界的核心资产**。开发机器被入侵即等同于整个组织及所有下游用户被入侵。
2. **封锁 ≠ 恢复**。已泄露的凭据与钱包密钥须单独作废与迁移。
3. Web3 组织应将**资产、签名权限、开发环境的三重隔离**设为默认。
4. 须将非传统 C2（链上／P2P／合法服务死信箱）的检测能力内建于 SOC。

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "GlassWorm Malware Takedown Disrupts Developer Supply Chain Attack Infrastructure", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/glassworm-malware-takedown-disrupts.html>

[2] CrowdStrike, "Inside CrowdStrike's Takedown of a Developer-Targeting Botnet", 2026-05. <https://www.crowdstrike.com/en-us/blog/inside-crowdstrike-takedown-of-a-developer-targeting-botnet/>

[3] Truesec, "GlassWorm: Self-Propagating VSCode Extension", 2025. <https://www.truesec.com/hub/blog/glassworm-self-propagating-vscode-extension>

[4] Kiran Raj (Endor Labs), "Invisible Threats: GlassWorm Unicode VSCode", Endor Labs. <https://www.endorlabs.com/reports/invisible-threats-glassworm-unicode-vscode>

[5] Dennis Kim, "针对 MCP 的高级与潜伏型攻击——是否为结构性问题", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立 CTI 档案（TLP:GREEN）公开发布。
联系方式：<gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
