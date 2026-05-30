| id             | CTI-2026-0530-JINX                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | JINX-0164 — 瞄准加密企业的macOS恶意软件与供应链威胁行为者                                                                                  |
| subtitle       | LinkedIn社会工程、AUDIOFIX与MINIRAT，以及@velora-dex/sdk npm供应链投毒                                                              |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | zh                                                                                                                     |
| tags           | Crypto-Targeting · macOS-Malware · Supply-Chain · Social-Engineering · CI-CD-Abuse · DPRK-Adjacent                    |
| threat_actors  | JINX-0164（经济动机 · 与朝鲜集群TTP相似，无基础设施重叠）                                                                                   |
| cve            | N/A（威胁行为者活动 · npm供应链）                                                                                                  |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Wiz集群命名                                                          |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# JINX-0164 — 瞄准加密企业的macOS恶意软件与供应链威胁行为者

> **报告ID** `CTI-2026-0530-JINX` · **发布日期** 2026-05-30 · **分类** `TLP:GREEN` · **严重度** 🔴 HIGH
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LinkedIn社会工程、AUDIOFIX与MINIRAT，以及@velora-dex/sdk npm供应链投毒*

---

## 目录

1. 摘要 (TL;DR)
2. 威胁行为者画像 — JINX-0164
3. 攻击链 — 从LinkedIn到CI/CD
4. 恶意软件分析 — AUDIOFIX · MINIRAT
5. 供应链投毒 — @velora-dex/sdk
6. 与朝鲜集群的相似与差异
7. 韩国视角 — 交易所与Web3开发团队的威胁评估
8. 检测与缓解建议
9. 结论
10. 参考文献

---

## 摘要 (TL;DR)

2026年5月28日，Wiz（CIRT与Research）披露了一个此前未记录的威胁行为者**JINX-0164**，其以窃取数字资产为目的瞄准加密货币组织。该集群**至少自2025年中期起活动**，几乎完全聚焦于**macOS**。

攻击流程为：(1) 借LinkedIn招聘/商务提案社会工程接近开发者 → (2) 诱导至伪装成Microsoft Teams等的虚假会议页面 → (3) 下载定制macOS RAT → (4) 窃取凭证与钱包数据 → (5) 从被入侵的员工笔记本横向移动至**代码分发系统与CI/CD基础设施**。该行为者还进一步展示了**npm供应链投毒**能力。

该行为者与BlueNoroff、Contagious Interview、UNC1069（Sleet）等朝鲜集群**手法相似但无基础设施重叠**；Wiz将其归类为经济动机集群，未将其归因于国家支持。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                | 置信度           |
| ---- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| KJ-1 | JINX-0164通过将招聘诱饵社会工程与定制macOS恶意软件相结合，精准瞄准**加密开发者**。目标岗位清晰。                                                          | **High**      |
| KJ-2 | 它超越单纯的端点窃取，将**横向移动至CI/CD与代码分发基础设施**作为核心目标——面向供应链，将一次入侵放大为下游的多次入侵。                                                  | **High**      |
| KJ-3 | 对`@velora-dex/sdk` 4.9.1的木马化，是**将正规DeFi工具包转化为感染载体**的实证案例；导入时一个shell脚本即拉取MINIRAT。                                  | **High**      |
| KJ-4 | 观测到其与朝鲜集群在TTP上的相似性及Astrill VPN的使用，但**因缺乏基础设施重叠而归因未定**。应同时考虑模仿与独立集群两种可能。                                            | **Medium**    |
| KJ-5 | 韩国交易所、Web3建设者与DeFi团队因macOS采用率高、LinkedIn招聘活跃而暴露于**相同攻击面**。当多签/热钱包密钥与开发端点共存时，风险被放大。                                  | **Medium-High**|

---

## 1. 威胁行为者画像 — JINX-0164

| 项目 | 值 |
| --- | --- |
| 名称 | JINX-0164（Wiz命名） |
| 活动时期 | 至少自2025年中期起 |
| 动机 | 经济（financial gain）— 数字资产窃取 |
| 目标 | 加密货币组织/开发者（聚焦macOS） |
| 核心恶意软件 | AUDIOFIX（Python）、MINIRAT（Go） |
| C2 | HTTPS通信、共享基础设施（如`datahub[.]ink`） |
| 辅助工具 | Astrill VPN等 |
| 归因 | 未定（与朝鲜集群TTP相似，无基础设施重叠） |

JINX-0164在LinkedIn上运营**高可信度的虚假资料**（逼真的从业经历与人脉）；部分账户系被劫持或专为该活动创建、并在攻击后删除。研究人员（Wiz的Shira Ayal等）将多起入侵调查合并为一个命名集群。

---

## 2. 攻击链 — 从LinkedIn到CI/CD

| 阶段 | 行为 | 细节 |
| --- | --- | --- |
| ① 接近 | 通过LinkedIn发出商务/招聘提案 | 建立信任后发送虚假会议邀请 |
| ② 诱导 | 虚假会议页面 | 伪装成Microsoft Teams等的仿冒域名 |
| ③ 感染 | 下载并运行macOS RAT | 伪装为`coreaudiod`（系统音频驱动），保存为`ChromeUpdater`，经`launchctl`执行 |
| ④ 窃取 | 通过Python恶意软件采集敏感信息 | 密码管理器、浏览器、iCloud Keychain凭证；本地管理员凭证；SSH密钥；配置/控制台历史；加密钱包与扩展信息；活跃的Discord/Slack/Telegram会话 |
| ⑤ 扩散 | 横向移动至CI/CD与代码分发基础设施 | 注入AUDIOFIX载荷；篡改源代码以入侵更多端点并窃取钱包凭证 |

关键在于⑤阶段。JINX-0164把被入侵的开发者笔记本**视为跳板而非终点**。其目标是抵达代码分发系统与开发基础设施，将一次入侵放大为下游的多次入侵。

---

## 3. 恶意软件分析 — AUDIOFIX · MINIRAT

**AUDIOFIX** — 一个编译后的Python二进制，执行广泛的自动信息窃取。它伪装为系统音频驱动（`coreaudiod`），以文件名`ChromeUpdater`保存，并经`launchctl`运行。窃取对象包括：密码管理器、Web浏览器与iCloud Keychain中的凭证；本地管理员凭证；SSH密钥；配置/控制台历史文件；加密浏览器扩展信息与钱包地址；活跃的Discord、Slack与Telegram会话。

**MINIRAT** — 一个基于Go的轻量后门。它不执行AUDIOFIX那样的广泛自动窃取，但提供**持久远程访问、命令执行与文件移动**功能。两个恶意软件家族均通过HTTPS与C2通信，并共享公共基础设施（如`datahub[.]ink`）。恶意软件先识别操作系统，再下载特定于架构的载荷。

---

## 4. 供应链投毒 — @velora-dex/sdk

2026年4月7日，JINX-0164实施了一次供应链行动，对npm包**`@velora-dex/sdk` 4.9.1**进行木马化。该包是用于VeloraDEX去中心化交易所上代币兑换、限价单与delta交易的正规DeFi工具包。

恶意版本在`dist/index.js`中**追加了三行**，使得每当该包被导入时，便从远程服务器下载一个shell脚本。该脚本投递macOS专用二进制**MINIRAT**。（此次投毒此前已由SafeDep与StepSecurity观测并披露。）

此手法的本质是**将受信任的代码库转化为感染载体**。开发者将正规依赖引入项目这一正常行为，便成为感染触发点。在某些情形下，还观测到**篡改源代码本身**以实现进一步的凭证窃取，尤其针对加密货币钱包。

---

## 5. 与朝鲜集群的相似与差异

| 比较项 | JINX-0164 | 朝鲜集群（BlueNoroff · Contagious Interview · UNC1069） |
| --- | --- | --- |
| 目标 | 加密/开发者 | 相同 |
| 社会工程 | 招聘/商务诱饵 | 相同（类似Contagious Interview） |
| 平台 | 聚焦macOS | 含macOS、多平台 |
| VPN | 使用Astrill VPN | 多见使用Astrill VPN |
| 仿冒域名类型 | 相似 | 相似 |
| **基础设施重叠** | **无** | — |

在TTP、工具与目标方面的相似性十分显著，但Wiz因**未确认基础设施重叠**而未将其与公开追踪的朝鲜团体相联系。因此本报告对**两种**可能性均保持开放——(a) 模仿朝鲜TTP的独立经济动机集群，或(b) 尚未识别、基础设施仍相互分离的关联——并建议进一步观测。过早的国家归因有误归因风险。

---

## 6. 韩国视角 — 交易所与Web3开发团队的威胁评估

JINX-0164类威胁在韩国语境下的含义：

- **macOS普及** — 韩国交易所与Web3初创开发团队的macOS采用率高，恰与该活动的目标平台一致。
- **LinkedIn招聘暴露** — 活跃的招聘/社交活动拓宽了社会工程入口。“海外招聘者的会议邀请”是常见模式，因而戒备往往松懈。
- **密钥共存风险** — 当钱包扩展、热钱包密钥、SSH密钥与CI令牌共存于开发端点时，单个端点入侵会同时蔓延为资产窃取与供应链投毒。
- **供应链信任** — 未经验证即采用外部npm/SDK依赖的做法，使韩国DeFi/基础设施项目直接暴露于`@velora-dex/sdk`式投毒。

---

## 7. 检测与缓解建议

1. **社会工程意识** — 将“LinkedIn招聘者会议链接 → 安装/运行会议应用”模式列为高风险；阻止运行来自未验证域名的安装程序。
2. **macOS行为检测** — 通过EDR监控`launchctl`持久化、`coreaudiod`/`ChromeUpdater`伪装进程，以及异常HTTPS C2（如`datahub[.]ink`类）。
3. **供应链验证** — 对npm/SDK依赖应用版本锁定、哈希校验、`postinstall`钩子审计与SBOM管理。若曾使用`@velora-dex/sdk`，应立即检查对4.9.1的暴露情况。
4. **密钥隔离** — 将钱包签名权限与热钱包密钥从开发端点分离，迁移至专用签名设备（冷/硬件）——与`CTI-2026-0422-MCP` §4建议相衔接。
5. **CI/CD完整性** — 对代码分发流水线应用提交签名、运行器隔离与制品签名，以在横向移动时检测篡改。
6. **IOC拦截** — 将共享C2基础设施与仿冒域名加入拦截列表（最新IOC见Wiz Technical Annex）。

---

## 8. 结论

JINX-0164恰好位于2026年威胁版图的交汇点：“加密 + macOS + 供应链”。它展示的模式——以招聘诱饵攻陷开发者端点、移动至CI/CD、并将受信任的包武器化——瞄准的不是单一组织，而是**整个生态系统的信任链**。

国家归因仍未确定，而这种不确定性本身就具有启示意义。在朝鲜TTP被商业化、被模仿并扩散的趋势下，防御者应少关注*“谁干的”*，多关注*“滥用了哪种信任”*。招聘信任、包信任、开发基础设施信任——这三者是该活动的目标，同样也是防御的起点。

---

## 参考文献 (References)

[1] Wiz CIRT & Wiz Research (Shira Ayal et al.), "Threat Actor Targets Crypto Organizations — JINX-0164", Wiz Blog, 2026-05. <https://www.wiz.io/blog/threat-actors-target-crypto-orgs>

[2] Ravie Lakshmanan, "JINX-0164 Targets Cryptocurrency Firms with Fake Recruiter Lures and macOS Malware", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/jinx-0164-targets-cryptocurrency-firms.html>

[3] "New Threat Actor Jinx-0164 Targets Crypto Developers on macOS", Infosecurity Magazine, 2026-05. <https://www.infosecurity-magazine.com/news/jinx-0164-crypto-developers-macos/>

[4] "JINX-0164 Threat Actor Using LinkedIn Social Engineering to Deploy Custom macOS Malware", Cyber Security News, 2026-05. <https://cybersecuritynews.com/jinx-0164-threat-actor-using-linkedin-social-engineering/>

[5] "JINX-0164 Uses LinkedIn Lures to Deploy Custom macOS Malware", GBHackers, 2026-05. <https://gbhackers.com/jinx-0164-uses-linkedin-lures/>

[6] SafeDep & StepSecurity, "@velora-dex/sdk 4.9.1 npm supply chain compromise (MINIRAT)", 2026-04（Wiz引用）.

---

© 2026 Dennis Kim (김호광) · 本文档作为独立CTI存档（TLP:GREEN）公开发布。
联系: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
