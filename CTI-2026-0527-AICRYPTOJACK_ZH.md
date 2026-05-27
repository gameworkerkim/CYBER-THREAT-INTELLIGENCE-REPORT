| id             | CTI-2026-0527-AICRYPTOJACK                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | 滥用 AI 聊天机器人推荐的加密劫持 —— 超越搜索投毒的新型投递载体                                                                                                                                                                                 |
| subtitle       | LLM 推荐的下载链接指向恶意站点，一场针对 GPU 的挖矿·远程访问·勒索软件复合行动                                                                                                                                                                          |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | zh                                                                                                                                                                                                              |
| tags           | | AI-Search-Poisoning | Cryptojacking | LLM-Recommendation | DLL-Sideloading | ScreenConnect | GPU-Mining | | ------------------- | ------------ | ----------------- | --------------- | ------------ | ---------- | |
| threat\_actors | | 未归因（以 GPU 挖矿为动机的金钱型行为者） | | ------------------------------- |                                                                                                  |
| frameworks     | | MITRE ATT&CK (T1574 DLL Side-Loading · T1496 Resource Hijacking · T1219 Remote Access) | NIST SP 800-83 | | -------------------------------------------------------------------------------------- | ------------- | |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# 滥用 AI 聊天机器人推荐的加密劫持 —— 超越搜索投毒的新型投递载体

> **报告 ID** `CTI-2026-0527-AICRYPTOJACK` · **发布日期** 2026-05-27 · **分类** `TLP:GREEN` · **严重程度** 🔴 HIGH
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LLM 推荐的下载链接指向恶意站点，一场针对 GPU 的挖矿·远程访问·勒索软件复合行动*

---

## 目录

1. 摘要 (TL;DR)
2. 行动概述 —— AI 搜索投毒的兴起
3. 攻击链分析 —— 从 DLL 侧加载到挖矿
4. 目标选定 —— GPU 挖矿收益最大化
5. 对韩国的影响
6. 对 Web3 / 加密生态的影响
7. 应对方案
8. IoC 与检测指标
9. 结论与建议
10. 参考文献

---

## 摘要 (TL;DR)

2026 年 5 月 26 日，Microsoft Defender Experts 与 Microsoft Defender 安全研究团队警告称，一场活跃的加密劫持行动正利用与 AI 聊天机器人的交互作为浮现恶意下载站点的机制。Microsoft 将其描述为"一种将社会工程扩展至传统搜索结果之外、并提高恶意软件推荐可见度的新兴投递技术"。

该行动假冒 CrystalDiskInfo、HWMonitor、Display Driver Uninstaller、FurMark、K-Lite Codec Pack、PDFgear 等正规系统工具。目标是高性能 GPU 持有者——这是一种**选择挖矿价值高的系统**而非无差别大规模感染的策略。已识别出 150 多个恶意域名。

该行动的目标不止于挖矿。威胁行为者通过部署 ScreenConnect 在被入侵主机上建立持久远程访问，这可导向数据窃取、横向移动或勒索软件等后续活动。最初他们通过 SEO 投毒污染搜索引擎，但自 2026 年 4 月以来观察到的变种已演进为：**当用户向基于 LLM 的工具询问软件下载推荐时，生成的响应中会呈现攻击者控制的域名链接**。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                          | 置信度        |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | **AI 搜索投毒**是传统 SEO 投毒的直接延伸，由于 LLM 的信任光环，用户点击率很可能高于搜索结果。它是未来增长最快的恶意软件投递载体。 | **High**   |
| KJ-2 | 该行动的本质风险不是挖矿，而是**通过 ScreenConnect 的持久远程访问**。挖矿仅是即时变现手段，同一访问可转向数据窃取或勒索软件。 | **High**   |
| KJ-3 | 高性能 GPU 目标选定表明**加密矿工、AI 研究者、游戏玩家与区块链开发者**是优先受害群体。这意味着 Web3／AI 社区是直接目标。 | **Medium-High** |
| KJ-4 | 凭借 DLL 侧加载、进程镂空（process hollowing）、Defender 排除项注册，以及检测到分析工具时停止挖矿等精巧的规避手法，普通用户难以自行检测。 | **High**   |

---

## 2. 行动概述 —— AI 搜索投毒的兴起

攻击始于用户在搜索引擎上查找可信的系统工具与硬件监控软件。经 SEO 投毒手法操纵的恶意站点出现在结果顶部。

然而，在自 2026 年 4 月以来观察到的变种中，入口路径发生了变化。当用户**向 AI 聊天机器人询问软件下载推荐时，生成的响应中会呈现攻击者控制的域名链接**。Microsoft 在指出这基于观察到的模式与关联数据的同时评估认为，这与 AI 搜索结果投毒这一新兴技术相一致——是传统 SEO 投毒向传统搜索引擎之外的延伸。

每个恶意站点都有一个醒目的下载按钮，点击后从 `gleeze[.]com` 的行动专属子域名下载 ZIP 压缩包。该基础设施与威胁行为者常用的动态 DNS 提供商 Dynu 相关联。已识别出 150 多个投递恶意工具的恶意域名。

## 3. 攻击链分析 —— 从 DLL 侧加载到挖矿

| 阶段 | 行为                                                                                            |
| --- | --------------------------------------------------------------------------------------------- |
| ①   | 用户下载 ZIP → 含一个正规可执行文件 + 一个恶意 DLL（`autorun.dll`）                                              |
| ②   | 执行时 `autorun.dll` 被**侧加载** → 通过 `msiexec.exe` 安装第二个恶意 DLL（`vcredist_x64.dll`）              |
| ③   | `vcredist_x64.dll` 是 **ScreenConnect 安装包** → 持续尝试联系 `193.42.11[.]108`（攻击者服务器）               |
| ④   | ScreenConnect 会话被用作执行 `SimpleRunPE.exe` 的通道                                                    |
| ⑤   | 通过注册表 Run 键／计划任务实现**持久化**，注册 Microsoft Defender 排除项，反分析检查，以**进程镂空**运行挖矿代码                   |
| ⑥   | 在某些入侵中，PowerShell 脚本从远程驱动器获取二进制文件，伪装为 `vlc.exe` 本地存储、创建计划任务后自我删除                            |
| ⑦   | 被镂空的二进制文件与攻击者服务器通信，传送主机信息，在运行时下载相应的挖矿器压缩包并执行                                                |

支持三种挖矿器：**gminer、lolMiner、SRBMiner-MULTI**。二进制文件会重建持久化痕迹并重新配置 Defender 排除项以抵抗清除。它还监视运行中的进程，一旦检测到以下分析工具之一便立即终止挖矿器——`taskmgr.exe`、`processhacker.exe`/`processhacker2.exe`、`procexp.exe`/`procexp64.exe`、`systeminformer.exe`。这是当用户打开任务管理器查找异常时停止挖矿以规避检测的典型手法。

## 4. 目标选定 —— GPU 挖矿收益最大化

该行动比典型的加密货币挖矿尝试更具针对性。它不进行无差别大规模感染，而是**战略性地选择能最大化 GPU 挖矿收益的端点**。所有被假冒的软件（CrystalDiskInfo、HWMonitor、FurMark、Display Driver Uninstaller 等）都为高性能 GPU 用户所青睐，这一点佐证了上述判断。

关键在于，该行动的目标不仅出于金钱动机。威胁行为者通过 ScreenConnect 在被入侵主机上建立持久远程访问，可用于数据窃取、横向移动或勒索软件等后续活动。

## 5. 对韩国的影响

该行动在韩国媒体中几乎未获报道，但对国内用户尤其危险。

第一，**韩国的 AI 聊天机器人使用率正在激增**。随着用户越来越多地向 LLM 询问"○○ 程序在哪下载？"而非使用搜索引擎，AI 搜索投毒的目标面正迅速扩大。

第二，**韩国的高性能 GPU 持有群体庞大**。游戏玩家、AI／深度学习研究者、加密矿工、区块链开发者等 GPU 密集型用户群正是该行动的目标。被假冒的工具（HWMonitor、FurMark 等）在韩国 PC 社区中也是标准推荐。

第三，**对 ScreenConnect 等正规远程管理工具（RMM）的滥用**易被国内安全方案误认为正常流量，从而延迟检测。当挖矿通过进程镂空在 Microsoft 签名的二进制文件下运行时，不仅普通用户，连部分 EDR 也可能漏检。

## 6. 对 Web3 / 加密生态的影响

Web3／AI 社区属于该行动的**首要目标群体**。

第一，**区块链开发者与矿工运行高性能 GPU 工作站**。他们正是该行动所瞄准的"挖矿价值高的系统"，同时往往将加密钱包、节点密钥与部署凭据置于同一台机器上。

第二，通过 ScreenConnect 的持久远程访问可超越单纯挖矿，扩展至**钱包窃取、种子提取与交易篡改**。本分析师在 `CTI-2026-0422-MCP` 中警示的"单台机器集中了资产、签名权限与开发工具"的结构被直接滥用。

第三，**对 AI 聊天机器人工具推荐的滥用**是本分析师在 MCP 报告中论述的"偏见注入／推荐操纵"威胁的真实案例。由 LLM 中介的信任本身成为攻击面，而像 Web3 开发者这样频繁探索新工具的群体面临更大暴露。

## 7. 应对方案

### 7.1 用户／个人开发者

1. **始终从官方站点直接下载软件**。不盲信 AI 聊天机器人或搜索结果中的下载链接，直接核实域名（建议将官方域名加入书签）。
2. **核实**下载的可执行文件的数字签名；若 ZIP 中同时含有正规 EXE 与来历不明的 DLL，应怀疑侧加载。
3. **监控异常的 GPU 占用／发热**。由于挖矿器在分析工具运行时会停止，应在不打开任务管理器的状态下观察后台发热与风扇噪音。
4. **将加密钱包与 GPU 作业机器分离**。不在挖矿／渲染／游戏机器上放置热钱包。

### 7.2 组织／SOC

1. **制定 RMM 工具策略** —— 检测并阻止未经授权的 ScreenConnect、AnyDesk、TeamViewer 安装。应用区分正规 RMM 与滥用的行为型规则。
2. **检测 DLL 侧加载** —— 为 `autorun.dll`、`vcredist_x64.dll` 的异常路径加载以及 `msiexec.exe` 的异常 DLL 安装行为添加 EDR 规则。
3. **监控 Defender 排除项篡改** —— 将对 Defender 排除列表的未授权添加设为告警对象。
4. **检测进程镂空** —— 监视 Microsoft 签名二进制文件从异常内存区域执行代码的模式。
5. **阻断恶意基础设施** —— 将 `gleeze[.]com` 子域名、`193.42.11[.]108` 及可疑的 Dynu 动态 DNS 域名加入阻断列表。

## 8. IoC 与检测指标

> ⚠️ 本节以公开披露时点为准，投入运营使用前请重新核实最新威胁情报。

| 类型          | 指标                                                                       |
| ----------- | ------------------------------------------------------------------------ |
| 被假冒软件       | CrystalDiskInfo、HWMonitor、Display Driver Uninstaller、FurMark、K-Lite Codec Pack、PDFgear |
| 恶意 DLL      | `autorun.dll`、`vcredist_x64.dll`                                         |
| 伪装可执行文件     | `SimpleRunPE.exe`、`vlc.exe`（伪装名）                                         |
| C2／投递基础设施   | `gleeze[.]com` 子域名、`193.42.11[.]108`、Dynu 动态 DNS                         |
| 挖矿器         | gminer、lolMiner、SRBMiner-MULTI                                          |
| RMM 滥用      | ScreenConnect（未授权部署）                                                     |
| 持久化         | 注册表 Run 键、计划任务                                                            |
| 规避手法        | DLL 侧加载、进程镂空、Defender 排除项注册、检测到分析工具时停止挖矿                               |
| 恶意域名规模      | 150 个以上                                                                  |

## 9. 结论与建议

该行动展示了**AI 辅助投递、软件假冒与持久访问的结合**如何体现威胁行为者将社会工程与变现策略适配于现代用户行为。两点至关重要。

第一，**信任的所在已经转移**。用户如今对 AI 聊天机器人答案的信任超过搜索结果，攻击者正是瞄准这种信任。AI 搜索投毒是 SEO 投毒的下一代。

第二，**挖矿是入口，而非出口**。通过 ScreenConnect 的持久访问随时可转向数据窃取或勒索软件。"不过是挖矿恶意软件"的轻率归类是危险的。

建议：

1. **仅从官方来源**获取软件，绝不在未核实的情况下信任 AI／搜索推荐链接。
2. 建立 **RMM 工具治理**并阻止未授权安装。
3. **将加密钱包与签名权限同 GPU 作业机器分离**。
4. 将 DLL 侧加载、进程镂空、Defender 排除项篡改的检测内建于 SOC 规则。

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "AI Chatbot Recommendations Redirect Users to Cryptojacking Malware Sites", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/ai-chatbot-recommendations-redirect.html>

[2] Microsoft Defender Experts & Microsoft Defender Security Research Team, "Poisoned Search Results: GPU Mining Cryptojacking Campaign Abusing ScreenConnect & Microsoft .NET Utilities", Microsoft Security Blog, 2026-05-26. <https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/>

[3] Dennis Kim, "针对 MCP 的高级与潜伏型攻击——是否为结构性问题", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立 CTI 档案（TLP:GREEN）公开发布。
联系方式：<gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
