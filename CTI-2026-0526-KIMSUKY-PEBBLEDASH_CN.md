# CTI-2026-0526-KIMSUKY-PEBBLEDASH

**Kimsuky（APT43）全新 PebbleDash · AppleSeed 工具集分析**

> 首个基于 Rust 的后门、滥用 VSCode · Cloudflare 隧道，以及 LLM 生成代码的痕迹

**🌐 Language:** [한국어](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [English](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [日本語](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · **中文**

![TLP](https://img.shields.io/badge/TLP-CLEAR-brightgreen) ![Actor](https://img.shields.io/badge/Actor-Kimsuky%20(APT43)-red) ![Attribution](https://img.shields.io/badge/Attribution-DPRK-blue) ![Confidence](https://img.shields.io/badge/Confidence-Medium--High-orange)

---

| 项目 | 内容 |
| --- | --- |
| **文档分类** | TLP:CLEAR — 可公开分发 / 基于公开情报的分析 |
| **威胁行为体** | Kimsuky（APT43、Ruby Sleet、Black Banshee、Sparkling Pisces、Velvet Chollima、Springtail） |
| **归属国家** | 朝鲜（DPRK）— 评估为侦察总局（RGB）下属 |
| **主要目标** | 韩国公共/私营部门（政府、国防、医疗、机械、能源），部分巴西、德国国防机构 |
| **撰写日期** | 2026年5月26日 |
| **作者** | Dennis Kim，Betalabs Inc. / 独立 CTI 分析师 |
| **一手来源** | Kaspersky GReAT（Securelist, 2026-05-14） |
| **置信度** | 归属：中高（Medium-High）/ 技术分析：高（High） |

---

## 1. 执行摘要

2026年5月14日，Kaspersky GReAT 公开了对朝鲜关联威胁行为体 **Kimsuky（APT43）** 近期行动的分析报告。本 CTI 从韩国防御者视角重构该一手分析，并梳理 **PebbleDash 与 AppleSeed** 两个恶意软件族群的新变种与战术变化。

核心并非单纯出现新恶意软件，而是 **攻击工具的质变**。Kimsuky 用此前几乎不使用的 **Rust 语言** 编写了首个后门（HelloDoor），滥用正规工具 **VSCode 远程隧道** 与 **Cloudflare Quick Tunnel** 隐藏 C2，更重要的是 **在恶意代码内部发现了疑似 LLM 生成的痕迹**。

### 主要发现

- 初始访问通过伪装为文档的附件（`.JSE`/`.PIF`/`.SCR`/`.EXE`）配合精巧的 **鱼叉式钓鱼** 与即时通讯接触实现。
- 投放的恶意软件分为 **PebbleDash 族群**（HelloDoor、httpMalice、MemLoad→httpTroy）与 **AppleSeed 族群**（AppleSeed、HappyDoor）。
- **HelloDoor** 是 Kimsuky 首个基于 Rust 的 DLL 后门，评估为开发早期阶段，发现 LLM 生成代码迹象（表情符号调试日志）。
- AppleSeed 族群将窃取韩国政府公认认证目录 `C:\GPKI` 确立为标志性能力 — 重心转向数据窃取。
- PebbleDash 族群聚焦 **国防/军事部门**，目标扩展至韩国以外的巴西、德国国防机构。
- 后渗透阶段滥用正规工具 **VSCode** 与 **DWAgent** — 旨在规避传统 C2 检测。

### 威胁速览

| 新颖性 | 目标契合度（韩国） | 检测难度 |
| --- | --- | --- |
| 高 — 引入 Rust·LLM·隧道 | 极高 — EUC-KR·GPKI·韩国托管 | 高 — 正规工具·隧道的 LotL |

---

## 2. 背景 — Kimsuky 与两个恶意软件族群

Kimsuky 是 Kaspersky 于 2013 年首次识别的韩语 APT 组织，活动已超过十年。虽然相比其他朝鲜关联组织技术成熟度相对较低，但在 **定制化鱼叉式钓鱼的制作能力** 上表现出色。

值得注意的是，**PebbleDash 本是 Lazarus Group 使用的平台**，但 Kimsuky 自至少 2021 年起将其占用，并持续派生自有变种。

| 区分 | PebbleDash 族群 | AppleSeed 族群 |
| --- | --- | --- |
| **首次确认** | Lazarus 起源 → 2021 年起 Kimsuky 专用 | 2019 年（当前 v2.1） |
| **主要目标** | 国防/军事/医疗（全球，含巴西/德国） | 政府机关（主要为韩国） |
| **核心能力** | 高级远程控制后门 | 信息窃取（文档/截图/键盘记录/GPKI） |
| **投放形式** | JSE/EXE/SCR/PIF 投放器 | 以 JSE 投放器为主 |

两族群投放方式重叠、目标趋于收敛，并 **以相同被盗证书签名、共享相同互斥体模式**。Kaspersky 以 **中高（Medium-High）置信度** 评估单一行为体同时控制两个族群。

---

## 3. 威胁行为体画像 — Kimsuky

### 3.1 组织概况与别名

Kimsuky 是评估为 **朝鲜侦察总局（RGB）下属** 的国家支持型黑客组织。据信约于 2012 年为对韩国、美国等发动网络攻击而组建。与以大型单次事件闻名的 Lazarus（索尼影业）、BlueNoroff（孟加拉央行）不同，Kimsuky 的特征是 **日复一日、悄然持续的间谍型攻击**。

名称由来也颇有意思。2013 年 Kaspersky 从一名朝鲜黑客的邮箱账户取名，发布了 **「Kimsukyang」** 报告，去掉末尾「ang」简化为「Kimsuky」，便是如今名称的起源。简言之，Kimsuky 即 **「由侦察总局运营的国家网络间谍部队」**，是一支以键盘而非武器窃取情报的军队。

| 厂商 | 名称 |
| --- | --- |
| **Mandiant** | APT43 |
| **Microsoft** | Emerald Sleet（原 THALLIUM） |
| **CrowdStrike** | Velvet Chollima |
| **其他** | Black Banshee、Archipelago、Sparkling Pisces、Springtail、Ruby Sleet 等 |

### 3.2 目标与战略意图

Kimsuky 的情报收集优先级与 RGB 的使命一致，即 **获取支撑朝鲜外交、安全与核战略的情报**。目标包括政府机关、外交/安全智库、国防承包商、学术机构，以及政治家、记者、人权活动人士、脱北者等个人。

- **2020 年 10 月以前：** 聚焦与朝鲜半岛外交/安全政策相关的政府、外交机构与智库。
- **2020.10–2021.10：** 临时转向医疗/制药领域以获取新冠应对情报。
- **资金筹措：** 利用窃取的个人信息与算力参与加密货币挖矿/洗钱。

其核心武器是 **定制化社会工程 + 精巧恶意软件框架的结合**。

### 3.3 重大事件沿革

| 时期 | 事件 | 内容/意义 |
| --- | --- | --- |
| 2013 | 冒充青瓦台/政府的恶意邮件 | 利用 HWP 漏洞，此后攻击的原型 |
| **2014** | **韩国水力原子力（KHNP）入侵** | 核电图纸泄露与停运威胁，令组织名声大噪 |
| 2016 | 冒充青瓦台/统一部/外交部邮件 | 涉第四次核试验与萨德，与 KHNP 同一账户 |
| 2021 | 原子力研究院、KAI、大宇造船、首尔大医院 | 核能/国防/航天/医疗核心技术目标 |
| **2021.04** | **中央选举管理委员会 PC 入侵** | 涉密文件泄露，2023 年联合检查才发现 |
| 2022.12 | 冒充太永浩议员办公室的钓鱼 | 国防/外交/统一专家目标，记者冒充手法 |
| 2023 | 配合韩美联演的攻击 / stake.com | 窃取约 4.1 亿美元以太坊 |
| 2024 | 冒充 SBS 记者、延世大教授、统一部 | 冒充日本外务省、朝鲜人权大使等跨国行动 |
| 2025 | 滥用首尔市民账户 / KT·LG U+ 嫌疑 | 冒充体检报告/银行的恶意邮件，涉电信入侵 |
| 2026.01 | 恶意二维码钓鱼（Quishing） | FBI 警报 — 窃取密码、指纹等 |

### 3.4 这个组织究竟有多危险？

Kimsuky 的危险之处不在于一次性的「大事件」，而在于 **将国家级间谍活动持续不断地进行了十余年**。与靠抢劫银行登上头条的 Lazarus 不同，Kimsuky 是悄然窃取情报的「影子型」组织，这也正是公众对其知之甚少的原因。然而其目标与影响绝不轻微。

- **🛡️ 直接关乎国家安全：** 瞄准核电（KHNP）、原子力研究院、国防（KAI）与航天技术，直接或间接助力朝鲜的武器与卫星计划。
- **🗳️ 侵蚀民主根基：** 2021 年中央选管 PC 感染、涉密文件泄露直到 2023 年才被发现 — 体现其隐蔽性与长期潜伏。
- **🎭 针对个人的精准社会工程：** 冒充记者、教授、外交官，克隆新闻媒体网站，仅改动邮箱地址一个字符，使用连专家都难以识别的新型恶意文件。
- **🌍 跨境目标：** 不仅是韩国，还瞄准美、英、日的政府、研究机构与媒体，冒充自由亚洲电台、日本外务省等。
- **💰 并行的牟利型攻击：** 除情报窃取外，还参与如 stake.com 约 4.1 亿美元加密货币窃取 — 规避制裁并充当政权资金来源。
- **🔄 不断进化：** 新冠期间窃取疫苗情报，2026 年引入二维码钓鱼（Quishing），紧跟社会议题与技术趋势迅速切换手法。

> **⚠ 要点**
> Kimsuky 的真正威胁不在于「华丽」，而在于 **持续性、隐蔽性与目标的精准性**。政府机关、研究机构、媒体、专家个人均可能成为目标，一次不慎的点击便可能导致国家机密泄露。本报告涉及的 PebbleDash·AppleSeed 行动，正是这一古老威胁 **借助 Rust、AI 与隧道在 2026 年变得更加精巧的面貌**。

### 3.5 制裁与国际应对动向

- **2023.06：** 韩国政府 **在全球率先将 Kimsuky 列为对朝独立制裁对象**，韩美联合发布安全公告。
- **2024.05：** 美国政府追加发布 Kimsuky 警告。
- **2026.01：** FBI 就恶意二维码鱼叉式钓鱼发出紧急警报。
- **学界/业界：** Kaspersky、Genians、ESTsecurity、高丽大学信息保护研究生院等持续追踪。

> **▶ 与本报告的关联：** 上述沿革中一贯的模式（瞄准韩国政府/国防/医疗/学术、韩语社会工程、HWP/文档伪装、利用韩国基础设施）在本报告的 **PebbleDash·AppleSeed 行动（2025–2026）中原样重现**。工具是新的，但目标选择与作战逻辑延续了十余年的 Kimsuky 脉络。

---

## 4. 初始访问（Initial Access）

Kimsuky 发送精心制作的鱼叉式钓鱼邮件诱使收件人打开附件，有时也通过即时通讯直接接触。附件通常是 **包含投放器的压缩文件**，伪装为报价单、招聘启事、通知、问卷、政府文件等。

| # | 文件名（伪装主题） | 检测日期 | 投放恶意软件 |
| --- | --- | --- | --- |
| 1 | [附表第8号] 个人信息请求书（个人信息保护法施行规则）.hwp.jse | 2025-08-28 | HelloDoor |
| 2 | 2026年上半年 国内研究生 硕士夜间课程 委托教育生 选拔材料.hwpx.jse | 2025-12-14 | httpMalice |
| 3 | security_20260126.scr | 2026-01-26 | Reger Dropper → MemLoad → httpTroy |
| 4 | 卢贤贞女士.pdf.jse | 2026-01-28 | AppleSeed chain |
| 5 | 面向国民的服务管理运营体系 现场检查 凭证（草案）.pif | 2026-02-05 | Pidoc Dropper → HappyDoor |

值得注意的是，诱饵文件名 **精准模仿真实的韩国公共行政、教育与个人信息行政文档**。相比高超的黑客技术，**基于对韩国社会理解的社会工程入侵** 才是其主要手法。

### 4.1 投放器执行机制

- **JSE 投放器：** 用 JScript 解码 Base64 数据块（诱饵 + 载荷），以随机文件名存入 `C:\ProgramData`。通过 `powershell.exe -windowstyle hidden certutil -decode` 二次解码后，以 `regsvr32.exe /s` 或 `rundll32.exe` 执行。
- **Reger Dropper (.SCR)：** 使用硬编码 XOR 密钥 `#RsfsetraW#@EsfesgsgAJOPj4eml;`。
- **Pidoc Dropper (.PIF)：** 单字节 XOR（`0xFF`），以填充数据与加密字符串完全混淆。

---

## 5. 新型恶意软件深度分析

### 5.1 HelloDoor — Kimsuky 首个基于 Rust 的后门

2025 年 8 月首次识别的 **Rust 语言 DLL 后门**，因 Rust 是 Kimsuky 极少使用的语言而最受关注。功能有限、通信结构简单，评估为 **开发早期阶段**。

| 项目 | 内容 |
| --- | --- |
| **持久化** | 在 `HKCU\...\Run` 键注册值名 `tdll` |
| **C2 通信** | HTTP / TryCloudflare 临时隧道（难以追踪） |
| **按令牌端口** | 提权时 `5555`，未提权时 `5554` |
| **加密** | Base64 解码后 RC4（密钥：`fwr3errsettwererfs`） |
| **查询格式** | `aaaaaaaaaa=2&bbbbbbbbbb=[UID]&cccccccccc=1` |

> **⚠ LLM 生成代码迹象**
> 发现疑似由 LLM 而非人类程序员生成的表情符号调试日志（✅ 端口监听中、❌ 端口占用、🔍 检测到 regsvr32 父进程）。同时仍保留 `result send fail`、`decrytion failed`、`autorum failed` 等拼写错误，可解读为 AI 生成后由人工手动编辑的痕迹。Kaspersky 在 BlueNoroff 的 PowerShell 窃取程序中也观测到类似迹象。

### 5.2 httpMalice — 最新 PebbleDash 后门变种

约于 2025 年 12 月出现的最新 PebbleDash 系后门。**v1.9 使用 HTTP/HTTPS**，旧版 **v1.8 使用 Dropbox API** 作为 C2。

- 按权限分支持久化：提权时创建 `CacheDB` 服务（显示名 Administrator），未提权时在 `HKCU\...\Run` 注册 `Everything 1.9a-[filesize]`。
- 主机画像使用 `chcp 949`（EUC-KR）→ **明确表明目标为韩语用户**。
- 数据经 **ChaCha20** 加密后 Base64，密钥/随机数由缓冲区指针地址派生。
- UID：`[volume serial]{8}_[elevation status]`；通过 `m=` 参数运行 13 种操作模式。

它兼具两族群特征（高完整性 SID `S-1-12-12288` 执行 = PebbleDash；`m=` 参数 + PowerShell 采集 = AppleSeed），再次印证两族群由单一行为体控制。

### 5.3 MemLoad → httpTroy 链

MemLoad 是规避检测的加载器，先进行反虚拟机检查与侦察以评估目标价值，之后才将最终后门 **反射式加载到内存**。已观测到 V2（2025.3）与 V3（2025.9），今年的变种是 V3 的小幅修改版。

- 持久化：提权时 `ChromeCheck`，未提权时 `EdgeCheck`（每分钟执行 regsvr32）。
- ID：依据能否写入 `system32` 判定权限，前缀 `A-`（管理员）或 `U-`（普通）。
- 用 RC4 密钥 `#RsfsetraW#@EsfesgsgAJOPj4eml;`（与 Reger Dropper 相同）解密载荷后调用 `hello` 导出函数。

最终载荷为负责长期访问与数据外泄的 **httpTroy**。在 ADS `[path]:HUI` 创建标志文件，C2 为 `file.bigcloud.n-e[.]kr`。

### 5.4 AppleSeed 族群 — 将 GPKI 证书窃取作为标志

AppleSeed 于 2019 年出现（当前 v2.1），分为 Dropper 型与 Spy 型。自 2022 年起的核心变化是 **采集 `C:\GPKI` 目录** 的功能，该路径存放韩国政府用于公务员与政府系统认证的数字证书，对国家行政入侵而言风险极高。Troll Stealer 中也实现了相同功能。

**HappyDoor** 是 AhnLab 于 2024 年公开的基于 AppleSeed 的后门，共享相同的字符串混淆、采集数据类型与 RSA 加密。被以 **中（Medium）置信度** 评估为由 AppleSeed 演化而来的高级变种。

---

## 6. 分析焦点 — 为何选择 Rust？

比起 HelloDoor 是 Kimsuky 首个 Rust 后门这一事实，**「为何是现在、偏要用 Rust」** 的问题更能揭示威胁走向。可评估为检测规避、开发便利与供给现实交叠的结果。

### 6.1 检测规避 — 使既有特征码失效

以 C/C++ 多年积累的 PebbleDash 特征码与 YARA 规则已被杀软/EDR 学习。用 Rust 重写会 **改变编译产物的结构本身** — 静态链接使二进制膨胀，函数边界、字符串布局与控制流不同，并混入独特的名称修饰。这相当于给同一后门 **换上「新衣」以重置检测曲线**，与包括 Lazarus、BlueNoroff 在内众多 APT 近年的 Rust/Go 迁移趋势一脉相承。

### 6.2 LLM 辅助开发 — 降低门槛的 AI

表情符号调试日志与残留拼写错误并存，暗示开发者 **首次借助 AI 处理不熟悉的语言**。Rust 以所有权与借用检查器（borrow checker）而闻名，门槛颇高，而 LLM 可大幅降低其学习成本。若出自纯粹的人类专家之手，便不会留下如此生涩的痕迹。这表明其处于 **AI 提升开发效率、但尚未实现完全自动化的过渡期**。

### 6.3 次要动机 — Rust 自身的优势（目前有限）

- 内存安全减少崩溃 → 提升后门稳定性与隐蔽性。
- 跨平台编译与丰富的 crates 便于功能集成。
- 静态链接最小化外部依赖。

但由于 HelloDoor 是 **早期阶段产物**，目前难以认为稳定性是主要动机。核心是 **检测规避 + AI 辅助开发** 的组合。

> **▶ 防御者应关注的信号：** 比「为何用 Rust」更重要的是追踪 **未来 6–12 个月内 PebbleDash 核心后门（httpMalice 级）是否被用 Rust 重写**。一旦确认全面迁移，基于特征码的检测或需大幅重新设计。

---

## 7. 后渗透 — 滥用正规工具（LotL）

### 7.1 滥用 VSCode 远程隧道

滥用正规 Visual Studio Code 的远程隧道功能构建隐蔽远程访问。它不投放恶意软件，而是下载正规 VSCode CLI 创建隧道，因而 **检测点显著减少**。在非交互上下文中，认证默认选择 **GitHub 账户**。

- JSE 方式：隧道名 `bizeugene`，将生成的 `vscode.dev/tunnel` URL 与设备码 POST 至被盗韩国站点（`yespp.co[.]kr`）。
- 全新 Go 安装器（`vscode_payload`）：将调试与隧道 URL 发送至 **Slack WebHook**。

结果是目标设备与 **微软所有的服务器** 通信，用户无法察觉该流量源自攻击者。

### 7.2 滥用 DWAgent 远程管理工具

DWAgent 是正规 RMM 工具，被以两种方式滥用：在 httpMalice 感染主机上安装，或制作独立安装器。安装器与 Reger Dropper 共享相同 RC4 密钥与代码结构，并通过攻击者账户的 `config.json` 立即激活远程会话（经由正规中继 `node*.dwservice[.]net`）。

---

## 8. 基础设施与受害情况

Kimsuky 利用韩国免费域名托管服务 **내도메인.한국（naedomain.hankook）**（`.p-e.kr`、`.o-r.kr`、`.n-e.kr`、`.r-e.kr`、`.kro.kr`）模仿正规站点，后端基础设施多托管于 InterServer VPS。由于众多行为体共用该服务，仅凭此不能作为独立归属依据。此外还以被盗的韩国正规网站作 C2，并通过 Cloudflare、VSCode、Ngrok 隧道隐藏基础设施。

受害分析中，发现上传至 httpMalice 的 Dropbox C2 的感染日志，各受害者文件夹内的 `user.txt` 以 **韩语** 记录目标信息（「장악/已掌控」「http 存在」「DWService 存在」），显示攻击者手动管理受害者的迹象。

### 8.1 归属（Attribution）

- 两族群多数样本 **以相同被盗证书签名**，共享互斥体模式。
- 自 2021 年起，PebbleDash 仅在 Kimsuky 攻击中被发现。
- 技术上与 Microsoft **Ruby Sleet**、Mandiant **Cerium → APT43** 关联。
- 综合评估：**以中高（Medium-High）置信度归因于 Kimsuky 关联族群**。

---

## 9. MITRE ATT&CK 映射

| 战术 | 技术 | 观测内容 |
| --- | --- | --- |
| Initial Access | T1566.001 Spearphishing Attachment | 文档伪装的 JSE/PIF/SCR 附件 |
| Execution | T1059.001/.007 PowerShell/JScript | certutil 解码、JScript 投放器 |
| Execution | T1218.010/.011 Regsvr32/Rundll32 | 载荷执行（LOLBin） |
| Persistence | T1547.001 Run Keys | tdll、Everything 1.9a |
| Persistence | T1543.003 Windows Service | CacheDB 服务 |
| Persistence | T1053.005 Scheduled Task | ChromeCheck / EdgeCheck |
| Defense Evasion | T1620 Reflective Loading | MemLoad 内存加载 |
| Defense Evasion | T1553.002 Code Signing | 被盗的韩国机构证书 |
| Defense Evasion | T1564.004 ADS | httpTroy :HUI 流 |
| C2 | T1572 Protocol Tunneling | VSCode·Cloudflare·Ngrok |
| C2 | T1102 Web Service | Dropbox·Slack WebHook |
| C2 | T1219 Remote Access Software | DWAgent |
| Collection | T1056.001 Keylogging | AppleSeed Spy |
| Exfiltration | T1041 Exfil over C2 | GPKI 证书/文档外泄 |

---

## 10. 检测与响应建议

### 10.1 即时检测点

- 在邮件网关拦截双扩展名附件（`.hwp.jse`、`.pdf.jse`、`.scr`、`.pif`）。
- 检测 `regsvr32.exe /s` 与 `rundll32.exe` 执行 `C:\ProgramData` 中随机名文件的模式。
- 对 PowerShell `certutil -decode` + `-windowstyle hidden` 组合告警。
- 检查计划任务 `ChromeCheck`/`EdgeCheck` 与服务 `CacheDB`。
- 监控异常的 `code.exe tunnel`，以及 `*.trycloudflare.com` / `vscode.dev/tunnel` / `*.dwservice.net` 通信。
- 检测对 `C:\GPKI` 目录的未授权访问/压缩/外泄 — 政府机构优先。

### 10.2 组织层面响应

- 在代理/DNS 层审查流向 naedomain.hankook 系免费域名的非业务通信。
- 对 VSCode、DWAgent 等 RMM/开发工具实施白名单，并监控 GitHub 设备认证流程。
- 国防、政府、医疗部门应认识到自身是 **PebbleDash 优先目标**，强化鱼叉式钓鱼演练与 EDR 规则。
- 将附录 IOC 立即应用于 SIEM/EDR/防火墙，并对历史日志进行回溯狩猎（retro-hunt）。

---

## 11. 韩国政府及相关当局的对策

Kimsuky 是韩国政府 **在全球率先列为对朝独立制裁对象** 的黑客组织。鉴于其为韩国特化型威胁，各组织不应止步于接收全球 IOC，而应积极利用国内的报告与响应体系。

### 11.1 安全事件报告渠道

政府建议，若判断自身成为朝鲜鱼叉式钓鱼的目标，**无论是否实际发生入侵** 都应报告。

| 机构 | 报告电话 | 职责 |
| --- | --- | --- |
| **国家情报院（NIS）** | **111** | 统筹国家背景网络威胁，应对公共/关键基础设施 |
| **警察厅** | **182** | 网络犯罪侦查与刑事应对 |
| **韩国互联网振兴院（KISA）** | **118** | 民间安全事件受理、原因分析、技术支援 |
| **保护Nara / KrCERT/CC** | **boho.or.kr** | 在线黑客/勒索软件报告，中小企业支援 |

### 11.2 法定报告义务（信息通信网法）

- 信息通信服务提供者依据 **第48条之3**，须在知悉安全事件后 **24小时内** 向科学技术信息通信部长官或 KISA 报告。
- 逾 24 小时报告或不报告者，依第76条处 **3千万韩元以下罚款**。
- 依第48条之4，须保全/提交相关资料并配合现场调查。
- 若伴随个人信息泄露，须依个人信息保护法 **另行提交泄露通报**。

### 11.3 政府的先发与外交应对

- **对朝独立制裁：** 将 Kimsuky 列为独立制裁对象，并与韩美对朝鲜 IT 人员的联合制裁相衔接。
- **韩美协作与国际合作：** 持续发布联合安全公告。
- **官民威胁情报共享：** 通过 KISA 的 **C-TAS** 共享情报，并运行实时态势传达。
- **网络危机预警：** 运行正常–关注–注意–警戒–严重五级预警体系。

> **▶ 建议：** 政府、国防、医疗等 PebbleDash 优先目标部门，应将 IOC 立即同步至 C-TAS 与自有 EDR，并为 GPKI 访问行为启用专门审计日志。疑似入侵时遵守 24 小时报告义务，并优先获取内存/磁盘镜像以保全证据。

---

## 12. 分析师评估

本次行动的意义在于 Kimsuky 正借助 LLM **迅速刷新「不够精密的组织」这一成见**。采用 Rust、对正规工具的 LotL 滥用、以隧道隐藏基础设施，均是朝着加大检测与归属难度演进。

尤其是 **LLM 生成代码的迹象**，暗示朝鲜威胁行为体处于 **AI 提升开发效率、但尚未达到完全自动化的过渡期**。Kaspersky 同样评估道，AI 虽可自动化部分攻击，但构建完全自动化的攻击绝非易事。换言之，**AI 加速威胁但不取代威胁**，而综合追踪恶意软件、初始向量、目标、后渗透与最终意图的传统方法依然有效。

对韩国的启示十分清晰。EUC-KR 目标化、对韩国行政文档的精准模仿、GPKI 窃取、韩国免费托管 C2 等，使 **该威胁本质上是韩国特化型**。与其被动接收全球厂商的 IOC，**自建针对韩语诱饵模式与 GPKI 访问行为的本地化检测逻辑** 才是核心对策。

---

## 附录 A. 失陷指标（IOC）

### A.1 文件哈希（MD5）

| 分类 | MD5 | 备注 |
| --- | --- | --- |
| JSE Dropper | `995a0a49ae4b244928b3f67e2bfd7a6e` | →HelloDoor |
| JSE Dropper | `52f1ff082e981cbdfd1f045c6021c63f` | →httpMalice |
| JSE Dropper | `9fe43e08c8f446554340f972dac8a68c` | →httpMalice |
| JSE Dropper | `8e15c4d4f71bdd9dbc48cd2cabc87806` | →AppleSeed |
| Reger Dropper | `65fc9f06de5603e2c1af9b4f288bb22c` | security_*.scr |
| Reger Dropper | `c19aeaedbbfc4e029f7e9bdface495b9` | secu.scr |
| Pidoc Dropper | `8983ffa6da23e0b99ccc58c17b9788c7` | .pif |
| AppleSeed | `a7f0a18ac87e982d6f32f7a715e12532` | Dropper |
| AppleSeed | `f4465403f9693939fe9c439f0ab33610` | Dropper |
| AppleSeed | `5c373c2116ab4a615e622f577e22e9be` | Dropper |
| HappyDoor | `d1ec20144c83bba921243e72c517da5e` | |
| MemLoad | `58ac2f65e335922be3f60e57099dc8a3` | |
| MemLoad | `f73ba062116ea9f37d072aa41c7f5108` | jhsakqvv.dat |
| httpTroy | `7e0825019d0de0c1c4a1673f94043ddb` | config.db |
| httpMalice | `08160acf08fccecde7b34090db18b321` | |
| httpMalice | `94faed9af49c98a89c8acc55e97276c9` | |
| HelloDoor | `c42ae004badddd3017adadbdd1421e00` | |
| VSCode 安装器 | `9ca5f93a732f404bbb2cee848f5bbda0` | xipbkmaw.exe |
| DWAgent 安装器 | `678fb1a87af525c33ba2492552d5c0e2` | |

### A.2 域名与 C2

| 指标（Indicator） | 类型 | 关联恶意软件 |
| --- | --- | --- |
| `opedromos1.r-e[.]kr` | Domain | AppleSeed C2 |
| `morames.r-e[.]kr` | Domain | AppleSeed C2 |
| `load.ssangyongcne.o-r[.]kr` | Domain | MemLoad C2 |
| `load.yju.o-r[.]kr` | Domain | MemLoad C2 |
| `attach.docucloud.o-r[.]kr` | Domain | MemLoad C2 |
| `load.supershop.o-r[.]kr` | Domain | MemLoad C2 |
| `load.erasecloud.n-e[.]kr` | Domain | MemLoad C2 |
| `cms.spaceyou.o-r[.]kr` | Domain | HappyDoor C2 |
| `erp.spaceme.p-e[.]kr` | Domain | HappyDoor C2 |
| `file.bigcloud.n-e[.]kr` | Domain | httpTroy C2 |
| `load.auraria[.]org` | Domain | httpTroy C2 |
| `female-disorder-beta-metropolitan.trycloudflare[.]com` | Tunnel | HelloDoor C2 |
| `www.pyrotech.co[.]kr/.../default.php` | 被盗站点 | httpMalice C2 |
| `newjo-imd[.]com/.../default.php` | 被盗站点 | httpMalice C2 |
| `www.yespp.co[.]kr/.../out.php` | 被盗站点 | VSCode 隧道窃取 |

> ※ 上述指标基于 Kaspersky GReAT 的公开分析（2026-05-14）。仅限防御用途，应用前请在自有环境中评估误报可能性。

---

## 附录 B. 来源

1. Kaspersky GReAT (Sojun Ryu), ["Kimsuky targets organizations with PebbleDash-based tools"](https://securelist.com/kimsuky-appleseed-pebbledash-campaigns/119785/), Securelist, 2026-05-14.
2. Gen Digital Threat Labs, "DPRK's Playbook: Kimsuky's HttpTroy and Lazarus's New BLINDINGCAN Variant", 2025-10.
3. AhnLab ASEC, HappyDoor 分析报告, 2024.
4. Microsoft, "Latest intelligence on North Korean and Chinese threat actors" (Ruby Sleet), CyberWarCon, 2024-11.
5. Mandiant/Google Cloud, "APT43 / Mapping DPRK Groups to Government".

---

**作者：** Dennis Kim，Betalabs Inc. / 独立 CTI 分析师
**分发：** [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*本文档为基于公开情报（OSINT）综合重构的威胁情报分析，旨在用于防御性信息共享。所有一手技术分析均源自 Kaspersky GReAT，并附有作者的解读与评估。*

`TLP:CLEAR` · `CTI-2026-0526-KIMSUKY-PEBBLEDASH` · Dennis Kim CTI
