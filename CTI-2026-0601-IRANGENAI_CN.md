| id             | CTI-2026-0601-IRANGENAI                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| title          | 西方AI的武器化 — 伊朗的GenAI辅助网络作战及向朝鲜的能力扩散                                                                                       |
| subtitle       | 通过对FT报道的事实核查，审视作为"生产力倍增器"的LLM、Web3掠夺生态与对朝鲜半岛的威胁汇聚                                                                       |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                            |
| email          | <gameworker@gmail.com>                                                                                                    |
| github         | gameworkerkim                                                                                                             |
| date           | 2026-06-01                                                                                                                |
| classification | TLP:GREEN                                                                                                                 |
| severity       | HIGH                                                                                                                      |
| lang           | zh                                                                                                                        |
| tags           | AI-Assisted-Operations · Nation-State · Iran · DPRK · Web3-Theft · Social-Engineering · ClickFix · Deepfake · Sanctions-Evasion · Capability-Diffusion |
| threat\_actors | APT42 (Charming Kitten / Mint Sandstorm) · Storm-2035 · 多个伊朗APT集群 /（半岛）Lazarus · BlueNoroff(TA444) · Kimsuky · Famous Chollima |
| cve            | CVE-2025-8088（WinRAR，伊朗APT42漏洞利用路径研究参考）                                                                                 |
| frameworks     | MITRE ATT&CK · Diamond Model · Admiralty Code · STIX/TAXII                                                                |
| license        | CC BY-NC-SA 4.0                                                                                                           |


# 西方AI的武器化 — 伊朗的GenAI辅助网络作战及向朝鲜的能力扩散

> **报告编号** `CTI-2026-0601-IRANGENAI` · **发布日** 2026-06-01 · **分类** `TLP:GREEN` · **严重度** 🟠 HIGH
> **作者** Dennis Kim（金镐光）· <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*通过对FT报道的事实核查，审视作为"生产力倍增器"的LLM、Web3掠夺生态与对朝鲜半岛的威胁汇聚*

---

## 目录

1. 摘要（TL;DR）
2. 引言 —— "是Excel，而非神谕"
3. 事实核查 —— 对FT八项主张的验证
4. 威胁行为者概述 —— 伊朗APT生态
5. AI运用分析 —— 是"生产力倍增"而非"能力跃迁"
6. Web3余波 —— 掠夺生态与国家-犯罪混合
7. 韩国视角 —— 朝鲜关联与能力扩散
8. 检测与缓解建议
9. 结论
10. 参考文献

---

## 1. 摘要（TL;DR）

2026年5月下旬，英国《金融时报》（FT，Jacob Judah）报道称，与伊朗关联的行为者正将ChatGPT、Gemini等西方LLM整合进其网络与信息作战的各个环节 [1]。报道内容涵盖恶意软件开发、母语级阿拉伯语与希伯来语钓鱼、实战军事研究（无人机制导、电子战）以及宣传战（深度伪造）。

本报告：(1) 以一手公开来源交叉验证上述主张；(2) 从威胁情报视角将"前所未有的速度"这一框架修正为**生产力倍增器（force multiplier）**；(3) 分析该趋势如何通过**Web3掠夺生态**与**向朝鲜关联行为者的能力扩散**汇聚到朝鲜半岛。

核心信息很简单：**AI并未给国家行为者一件新武器，而只是提升了既有TTP的速度、规模、语言质量与可扩展性。** 也正因为这种放大，能力的*跨国扩散（diffusion）*被加速 —— 当伊朗打磨出的社会工程语法与朝鲜的加密货币掠夺机器结合时，韩国的Web3、国防与金融科技部门便进入第一射程。

### 关键判断（Key Judgments）

| #    | 判断                                                                                                                          | 置信度          |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ------------ |
| KJ-1 | FT的核心主张（伊朗滥用LLM；AI辅助恶意软件/钓鱼/军事研究；大型科技公司的封禁应对）经一手来源（Google GTIG、OpenAI公开报告）交叉验证。                                              | **High**     |
| KJ-2 | 但"前所未有的速度"并非能力的质变，而是**生产力的提升**。GTIG一贯评估为*主导的是生产力而非新颖性*。                                                                      | **High**     |
| KJ-3 | "阿联酋每日50万+次AI辅助攻击""嘲讽特朗普的深度伪造"属**当局/单一媒体引用层级**，不应作为独立技术验证的事实呈现。                                                            | **Medium**   |
| KJ-4 | AI辅助真正的安全含义在于**跨国能力扩散的加速**。门槛降低后，相同TTP会在伊朗→俄罗斯→朝鲜集群间迅速扩散。                                                                    | **Medium-High** |
| KJ-5 | **Web3是AI武器化的首要变现界面。** 朝鲜Lazarus于2025年从Bybit盗取14亿美元以上；AI驱动的冒充将2025年加密货币损失推升至创纪录的170亿美元。                                     | **High**     |
| KJ-6 | 伊朗正打磨的LLM辅助社会工程（深度伪造视频通话、伪造会议页面、长期人设）**与BlueNoroff/Famous Chollima的剧本汇聚**。韩国处于该汇聚的最前线。                                       | **Medium-High** |

---

## 2. 引言 —— "是Excel，而非神谕"

媒体写道，伊朗正借AI以"前所未有的速度"建设网络战能力。情报分析师的任务，就是检验这个形容词。

先说结论：报道中的**事实**大多属实。但**框架**需要修正。Google威胁情报组（GTIG）经一年多观测后得出结论：AI赋予的不是新颖性，而是对既有工作的生产力提升 [3][4]。LLM不会*代替*侦察，而是使其*更快*；不会*发明*漏洞利用，而是将其*整理*；不会*创造*钓鱼，而是将其*本地化并量产*。

这正是本档案库一贯坚持的命题 —— **LLM是Excel，而非神谕。** 它是加速运算的工具，而非降下前所未有答案的神示。攻击方亦然。AI降低门槛、提升作战密度的同时，也制造出**新型的运营安全失误**（例如AI注入恶意软件的设计缺陷）[参见：CTI-2026-0601-GREYVIBE]。

真正的问题在别处。门槛降低意味着**能力在国家间扩散得更快。** 本报告后半部分将阐释这一扩散的终点为何是朝鲜半岛。

---

## 3. 事实核查 —— 对FT八项主张的验证

| #   | FT主张                                          | 结论          | 依据                                              |
| --- | --------------------------------------------- | ----------- | ----------------------------------------------- |
| 1   | FT报道伊朗滥用ChatGPT/Gemini                        | ✅ 确认        | FT原文（Judah）[1]，多家转载                             |
| 2   | 恶意软件开发 + 流利阿拉伯语/希伯来语钓鱼                        | ✅ 确认        | FT [1]、Google GTIG [3][4]                       |
| 3   | 阿联酋每日50万+次"ChatGPT辅助"攻击                       | ⚠️ 当局引用     | FT引用阿联酋表态；"ChatGPT助力"的因果未经独立验证                  |
| 4   | 针对以色列国民的钓鱼浪潮（部分招募情报合作）                        | ✅ 确认        | FT [1]，与APT42模式一致                               |
| 5   | 嘲讽特朗普的深度伪造宣传视频                                | ⚠️ FT单一来源   | 与冲突相关AI虚假信息态势一致，但无第二一手来源                        |
| 6   | 利用AI研究F-35干扰                                  | ✅ 确认        | Google GTIG（2025-01）：F-35干扰、反无人机、导弹防御研究 [3]     |
| 7   | 无人机制导、电子战等实战军事研究                              | ✅ 确认        | FT对约300篇伊朗军事期刊文章（近5年）的分析 [1]                    |
| 8   | 谷歌/OpenAI检测并封禁伊朗关联账户                          | ✅ 确认        | OpenAI（Storm-2035、APT42）、Google GTIG [3][4]     |

**补充事实：** 伊朗境内对ChatGPT的访问在两端均被封锁 —— OpenAI（国际制裁）与伊朗当局（审查）。伊朗行为者仍通过规避手段使用，说明**制裁规避**并非副产品，而是这些作战的结构性动机。同样逻辑直接适用于后文的朝鲜。

---

## 4. 威胁行为者概述 —— 伊朗APT生态

| 项目        | 内容                                                       |
| --------- | -------------------------------------------------------- |
| 核心行为者     | **APT42**（Charming Kitten / Mint Sandstorm）—— IRGC关联间谍   |
| 影响力行动     | **Storm-2035** —— 针对选举/舆论的IO团体                           |
| 集群规模      | 观测到10+伊朗团体滥用Gemini；APT42约占伊朗AI提示的30% [4]                 |
| 立场        | IRGC国家利益 · 制裁规避                                          |
| 目标群       | 国防 · 中东据点 · 以色列 · 美国政府/企业                                |

**APT42在攻击全生命周期中的LLM运用：**

- **侦察/翻译** —— 摘要/翻译有关美国航空航天防御系统、以哈冲突、中国国防工业趋势的公开信息 [3]
- **钓鱼/人设** —— 撰写/本地化/语法修正安全主题诱饵，维持长期伪装人设 [4]
- **开发辅助** —— 研究WinRAR漏洞（**CVE-2025-8088**）的利用路径；辅助开发基于Python的Google Maps抓取器与基于Rust的SIM管理工具 [5]
- **入侵后研究** —— 卫星信号干扰、电子战、无人机型号、F-35干扰、以色列导弹防御 [3]

GTIG追踪的部分实验性恶意软件家族（如运行时与LLM联动的PROMPTFLUX）与活动（HonestCue、CoinBait、ClickFix类）也出现在该生态中 [4]。然而GTIG将其评估为**效率提升，而非新颖能力。**

---

## 5. AI运用分析 —— 是"生产力倍增"而非"能力跃迁"

生成式AI给攻击者的不是"新刀"，而是"更快的磨刀石"。分阶段而言：

1. **侦察/目标画像** —— 公开信息摘要/翻译缩短学习曲线。
2. **钓鱼/社会工程** —— 量产母语级多语种诱饵；维持长期（数周）人设。这使依赖语法/词汇错误的反钓鱼启发式失效。
3. **开发辅助** —— *整理*脚本、工具、利用路径（而非发明）。
4. **影响力行动** —— 量产深度伪造/虚假信息，但触达与产出量不成正比（参见Storm-2035较低的Breakout Scale评级）。

> **核心修正：** "前所未有的速度"是*规模与效率*的变化，而非*能力的质变*。CrowdStrike《2026全球威胁报告》评估AI驱动攻击同比增长89%，平均横向移动（breakout）时间缩短至29分钟 [6] —— 关键指标是"既有攻击的加速"，而非"新型攻击"。

此修正之所以重要，在于它改变了威胁模型。防御的重心必须从*由什么构成*（artifact/IOC）转向*如何行动*（behavior/TTP）。

---

## 6. Web3余波 —— 掠夺生态与国家-犯罪混合

AI武器化的首要**变现界面是Web3**。原因是结构性的 —— 加密货币 (1) 最利于制裁规避；(2) 一旦窃取即可即时套现/洗钱；(3) 目标（开发者、项目贡献者、交易所员工）分散且易受社会工程攻击。

**以数字看Web3掠夺：**

- 2025年2月，朝鲜关联的**Lazarus**从交易所**Bybit**盗取14亿美元以上的以太坊 —— 加密货币史上最大规模利用事件 [27]
- AI驱动的冒充将2025年加密货币损失推升至创纪录的**170亿美元** [26]
- 进入2026年，朝鲜关联入侵持续：**Drift（2.85亿美元）**、**Zerion（10万美元，AI增强社会工程）** [23]
- Lazarus累计盗取约**67亿美元**加密货币，挪用于AI与导弹开发 [28]

**国家-犯罪混合的常态化：** 正如GREYVIBE案例所示（与俄罗斯网络犯罪生态关联），并在伊朗、朝鲜案例中再次确认，现代国家行为者正从纯粹间谍演化为**间谍+犯罪变现的混合**形态。Web3是该混合模式的核心资金来源。

**韩国Web3视角（DAXA/特金法）：** 国内DAXA会员交易所、Web3发行方与DeFi项目贡献者，正处于同一威胁的射程内。以**开发者招聘、投资会议或审计协作**为伪装的接触，是国内项目日常暴露的载体。合规（KoFIU可疑交易报告、旅行规则）有助于*事后*资金追踪，却无法*事前*阻断入侵 —— 需另行部署基于行为的检测。

---

## 7. 韩国视角 —— 朝鲜关联与能力扩散

这是本报告最为看重之处。伊朗案例对韩国并非直接威胁 —— 但**当该剧本扩散至朝鲜时，韩国便成为最前线。**

### 7.1 伊朗-朝鲜：制裁规避动机的同构性

伊朗与朝鲜在以下三点上**同构（isomorphic）**：(1) 同处严厉国际制裁之下；(2) 将网络作战作为规避制裁的国家收入/能力事业；(3) 通过规避手段武器化西方LLM。两国在导弹与军事领域的合作早有观测；在网络领域，TTP、基础设施与洗钱路径的间接*学习*亦极有可能（置信度：Medium）。

### 7.2 朝鲜的AI运用已趋成熟

朝鲜并非处于"学习AI"的阶段，而是处于"以AI实现产业化"的阶段。

- **IT人员伪装（Famous Chollima / WageMole / Jasper Sleet）** —— 以盗用身份+深度伪造视频通过财富500强招聘，利用AI扩展（AIApply、Final Round AI）自动填写申请并实时应答面试 [24][25]
- **深度伪造视频通话（BlueNoroff/TA444 —— GhostCall · GhostHire）** —— 伪造Zoom/Teams、克隆Calendly诱骗Web3高管/开发者；通话中出现真实高管的深度伪造形象 [26][29]
- **直接运用LLM** —— 朝鲜集群（如UNC2970）使用Gemini，并有ChatGPT/Cursor活动与2026年第一季度约1200万美元钱包公钥外泄相关联 [4][30]
- **国内占比** —— 据AhnLab 2026展望，2024.10~2025.09事后分析中，Lazarus 31次、**Kimsuky 27次**，是针对韩国威胁的常量 [31]

### 7.3 能力扩散（Capability Diffusion）的机制

门槛降低意味着能力被**更快地复制与扩散**。具体扩散路径：

- **TTP汇聚** —— APT42打磨的ClickFix伪造验证码、伪装会议页面与长期人设社会工程，已与朝鲜BlueNoroff、Kimsuky的伪造安全软件/伪造Webex/深度伪造视频通话剧本**高度重叠**。
- **公开报告的悖论** —— GTIG/WithSecure的披露有助于防御方，同时也成为其他国家行为者的**免费教材**。一个行为者的成功TTP会借AI辅助迅速被复制。
- **IOC寿命缩短** —— 当AI以数日为周期再生成工具/基础设施/诱饵时，以IOC为中心的防御迅速过时。国内防御方须转向**以行为/TTP为中心**的检测。

### 7.4 对韩国防御的含义

1. **从IOC转向行为** —— 以ClickFix自执行诱导、PowerShell RAT侦察/外泄序列、即时通讯（Telegram/KakaoTalk）数据访问、深度伪造通话诱导作为检测基线。
2. **核验招聘/投资/审计协作** —— 对针对Web3/国防/金融科技岗位的多次外部接触（编程挑战/演示/面试）强制实施带外身份核验。
3. **移动攻击面** —— 在假设存在FallSpy类Android间谍软件与移动深度伪造通话的前提下部署MTD/移动EDR。
4. **对归因保持谦逊** —— 对借AI快速变更产物的行为者暂缓断定式归因，依Admiralty Code积累多来源、多置信度评估。

---

## 8. 检测与缓解建议

1. **转向基于行为的检测** —— 勿仅依赖IOC匹配；对自执行诱导（ClickFix）、PowerShell RAT侦察/外泄序列、即时通讯数据访问、RDP配置变更告警。
2. **应对深度伪造视频通话** —— 将新建/一次性会议账户、仿冒Zoom/Teams链接、"安装此音频修复工具"请求视为入侵尝试；对通话中诱导的敏感操作（安装/键入）立即中止并核验。
3. **以多语种钓鱼为前提开展培训** —— 以"AI生成的钓鱼不再生硬"为前提重设安全意识培训；废弃依赖语法质量的规则。
4. **附件/下载管控** —— 限制外部托管（网盘/文件共享）的ZIP/RAR内脚本（JS/LNK/PowerShell）执行。
5. **加固PowerShell** —— 启用受限语言模式、脚本块日志、AMSI；监控异常子进程。
6. **Web3岗位专项管控** —— 隔离开发者终端；硬件钱包/多签；隔离运行编程挑战/面试客户端；检测凭证/会话令牌窃取。
7. **快速打补丁** —— 及时修复已知漏洞（如CVE-2025-8088）。AI通过*整理*而非*发现*来加速漏洞利用。
8. **威胁狩猎** —— 针对APT42/Charming Kitten与Lazarus/BlueNoroff/Kimsuky的公开TTP/IOC运行狩猎规则。

---

## 9. 结论

FT报道的事实部分大体属实。但"前所未有的速度"这一修辞，导致对威胁*性质*的误读。伊朗所得的**不是新武器，而是更快的工作台** —— LLM是Excel，而非神谕。

真正的安全含义在于能力的**跨国扩散加速**。门槛降低后，伊朗打磨的社会工程语法被朝鲜的加密货币掠夺机器迅速复制。Bybit的14亿美元、累计67亿美元、2025年170亿美元的冒充损失，均表明这一扩散已在被*变现*。

而其终点便是韩国。Web3发行方、DAXA交易所、国防/金融科技岗位以及开发者个人都是第一射程。灰色地带的攻击者既不尊重国界，也不尊重分类体系。这正是防御坐标必须从*由什么构成*转向*如何行动*的原因。

---

## 10. 参考文献

[1] Jacob Judah，"Western AI models turbocharging Iran's cyber operations"，《金融时报》，2026-05。（多家转载）

[2] "Iran Uses Western AI for Cyber Warfare — FT"，Realist English，2026-05-31。

[3] "Adversarial Misuse of Generative AI"，Google Cloud / GTIG，2025-01-29。<https://cloud.google.com/blog/topics/threat-intelligence/adversarial-misuse-generative-ai>

[4] "Google Flags Gemini Abuse by China, Iran, North Korea and Russia"，OpenSourceForU，2026-02-12。（GTIG后续汇总）

[5] "Google Discloses Gemini AI Abuse by APT Groups"，The National CIO Review，2026-02-13。

[6] CrowdStrike，《2026全球威胁报告》（经摘要报道），2026-03。

[23] "North Korean Hackers Hit Zerion With AI Social Engineering Attack"，MEXC News，2026-04-15。

[24] "North Korea lures engineers to rent identities in fake IT worker scheme"，BleepingComputer，2025-12-04。

[25] "North Korean APTs Use AI to Enhance IT Worker Scams"，Dark Reading，2026-03-06。

[26] "North Korea-Linked Hackers Use Deepfake Video Calls to Target Crypto Workers"，Decrypt，2026-01-27。

[27] "Google: North Korean hackers use AI-deepfakes to target crypto"，CoinGeek，2025-09-10。

[28] "Inside UNC1069: How North Korea Is Using AI Deepfakes and macOS Malware"，2026-03-12。

[29] "Inside North Korea's New Deepfake Crypto Scam (GhostCall · GhostHire)"，BeInCrypto，2025-10-28。

[30] "Inside Lazarus: How North Korea uses AI to industrialize attacks on developers"，Expel，2026-04-23。

[31] "AI May Enhance Lazarus Group's Crypto Attacks in 2026, AhnLab Predicts"，2026展望。

[相关] CTI-2026-0601-GREYVIBE —— GenAI辅助恶意软件开发与归因崩解（俄乌案例）。

---

© 2026 Dennis Kim（金镐光）· Cyber Threat Intelligence Division
本文档为独立CTI档案库（TLP:GREEN）公开之用，基于公开OSINT。不代表任何组织、机构或国家的官方立场，并刻意省略攻击技术的操作流程与漏洞利用细节。
联系：<gameworker@gmail.com> · GitHub：[gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
