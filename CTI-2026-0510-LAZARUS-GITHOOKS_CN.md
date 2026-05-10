# CTI-2026-0510-LAZARUS-GITHOOKS

## 朝鲜 Lazarus Group 新型隐匿技术:将 `.git/hooks/` 用作二阶段加载器的 Contagious Interview / TaskJacker 行动
### 简体中文版 — `TLP:GREEN`

---

| 项目 | 内容 |
|---|---|
| **报告 ID** | CTI-2026-0510-LAZARUS-GITHOOKS |
| **发布日期** | 2026-05-10 |
| **TLP 等级** | TLP:GREEN |
| **严重度** | 🔴 HIGH — 直接针对韩国开发者、交易所及 Web3 实体 |
| **分类** | 威胁行为者行动 / 经社会工程的供应链攻击 / 开发者定向攻击 |
| **核心关键词** | Lazarus Group, DPRK, Contagious Interview, TaskJacker, Famous Chollima, BeaverTail, InvisibleFerret, OtterCookie, git hooks, post-merge, post-checkout, MITRE G1052, fake recruiter |
| **原始来源** | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" (2026-05) |
| **交叉验证** | Microsoft Security Blog (2026-03)、Abstract Security (2026-03)、Cisco Talos (2025-10)、Socket (2025-06~10)、NVISO Labs (2025-11)、Malpedia G1052 |
| **关联报告** | CTI-2026-0507-SCARCRUFT (APT37,独立 DPRK 集群) · CTI-2026-0422-MCP §3.3 (UNC1069/Sapphire Sleet 供应链污染) |
| **作者** | Dennis Kim, https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT |

---

## 1. 执行摘要

OpenSourceMalware 于 2026 年 5 月披露:朝鲜 Lazarus Group(MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima)正在将其虚假招聘行动的二阶段加载器(second-stage loader)**隐藏在 `.git/hooks/` 目录中**。

本次分析显示,朝鲜正在积极引入 AI LLM 用以规避检测,并实时切换到最适合各目标的语言与平台。

### 核心判断 (Key Judgments)

| # | 判断 | 信心度 |
|---|---|---|
| **KJ-1** | Lazarus 的传递机制依次进化:npm 包 → 虚假视频会议工具 → VS Code Tasks → **git hooks**。每一次进化均直接对应于防御方对前一变种的封堵措施(如 2026 年 2 月 Microsoft VS Code 1.109 / 1.110 补丁)。 | **High** |
| **KJ-2** | `.git/hooks/` **本身不被 git 跟踪**,因此是 PR diff、代码审查均看不见的盲区。目标只需执行 `git clone` 后再做 `pull` 或 `merge`,无需运行任何代码即被感染。 | **High** |
| **KJ-3** | 主要目标为**区块链、金融科技、国防领域**的开发者。韩国因 LinkedIn Korea 活跃度、DAXA 上市交易所及 Web3 发行方密集度、外币结算自由职业者群体规模等因素,**暴露程度显著高于全球平均水平**。 | **High** |
| **KJ-4** | 最终载荷(BeaverTail → InvisibleFerret)专门针对**加密货币钱包(Solana、Exodus)、浏览器凭据、macOS Keychain**进行窃取。同一基础设施已被关联到 Bybit($14 亿)、Stake($4,100 万)、CoinEx($2,700 万)等事件。 | **High** |
| **KJ-5** | 本行动的真正威胁不在于单一技术,而在于 Lazarus **将开发者警觉性最低的时刻 — 求职过程 — 武器化**。仅靠技术控制无法完全防止,**开发者 OPSEC 培训与强制使用隔离环境必须同等重视**。 | **Medium-High** |

---

## 2. 背景

### 2.1 Contagious Interview 行动的演化轨迹

| 时期 | 传递机制 | 关键案例 | 防御方对应 |
|---|---|---|---|
| 2022 ~ 2024 | **npm 包 typosquatting** | `is-buffer-validator`、`yoojae-validator`、`event-handle-package`、`array-empty-validator`、`react-event-dependency`、`auth-validator` 等 | 经 Socket / npm 举报后清除 |
| 2024 ~ 2025 H1 | **虚假视频会议工具** | 假冒 "MiroTalk Studio" 等的 macOS / Windows 二进制 | VirusTotal / EDR 签名 |
| 2025 H2 | **大规模 npm 行动** | Socket:67 个包(2025-06)→ **338 个包,5 万次下载**(2025-10),公开新型 XORIndex 加载器 | 自动包扫描强化 |
| 2026 Q1 | **滥用 VS Code / Cursor Tasks** | 利用 `.vscode/tasks.json` 的自动执行属性,C2:`hxxp://144.172.115[.]189:8080` | **Microsoft VS Code 1.109(2026-01)/ 1.110(2026-02)将自动 task 默认改为 OFF** |
| **2026 Q2(当前)** | **隐匿于 `.git/hooks/`** | OpenSourceMalware 2026-05。`post-merge`、`post-checkout`、`pre-push` 钩子注入 BeaverTail 下载器 | (目前无封堵机制) |

每一次进化都发生在前一变种被封堵之后不久。**防御方每堵住一条通道,Lazarus 就在约 3~6 个月内迁移到更深的地方。**

### 2.2 威胁行为者识别 (Attribution)

本行动在以下命名下被跟踪:

| 跟踪方 | 集群名称 |
|---|---|
| **MITRE ATT&CK** | **G1052 — Contagious Interview** |
| **CrowdStrike** | Famous Chollima |
| **Microsoft** | Sapphire Sleet(关联,部分重叠) |
| **Mandiant** | UNC4034 / DPRK CryptoCore(关联) |
| **Lazarus 上层组织** | (传统意义上的)Lazarus Group, APT38 |

⚠️ **注意**: Contagious Interview 并非 Lazarus 的全部活动,而是**专门负责针对开发者的虚假招聘行动的子集群**。与 APT37(ScarCruft)、Kimsuky 等其他 DPRK 集群不同。

---

## 3. 攻击链分析

### 3.1 五阶段感染流程

```
[1] 侦察·接触  →  [2] 建立信任  →  [3] 传递编程任务  →  [4] git hook 触发  →  [5] 持久化后门
```

| 阶段 | 行为 | 目标的认知 |
|---|---|---|
| **1. 侦察·接触** | 在 LinkedIn / 招聘平台 / 自由职业平台(Upwork、Fiverr 等)识别目标。以使用 AI 生成头像的虚假招聘人员人格接触 | "我感兴趣的公司联系上来了" |
| **2. 建立信任** | 看似正常的公司域名(WHOIS 通常为数周至数月)、英文邮件、多阶段面试流程 | "这是正规流程" |
| **3. 传递编程任务** | GitHub / GitLab / Bitbucket 上的私有或 ZIP 仓库。表面上是普通的 React、Node、Python 任务 | "代码本身没有问题" |
| **4. git hook 触发** | 目标执行 `git clone`、`git pull`、`git merge`、`git checkout` 等**日常命令**时,`.git/hooks/post-merge` 或 `post-checkout` 静默执行并下载 BeaverTail | **未察觉** — 大多数开发者不会查看 `.git/hooks/` |
| **5. 持久化后门** | BeaverTail 安装 InvisibleFerret(Python 后门),窃取凭据与加密货币钱包,与 C2 通信,确立持久化访问 | 延迟察觉(数日至数周后,因资产损失才确认) |

### 3.2 为什么 `.git/hooks/` 是新的盲区?

| 属性 | 说明 |
|---|---|
| **Git 不跟踪** | `.git/hooks/` 目录与 `.git/` 本身一样**不被 git 跟踪**。绝不会出现在 PR diff、代码审查、`git log` 中 |
| **自动执行** | 目标无需运行任何一行代码,仅一次 `git pull` 即可触发 hook |
| **权限上下文** | hook 以用户权限运行,具备完全的网络、文件系统、子进程派生能力 |
| **表面正常** | 仓库本身的代码(README、源文件)可能完全正常,SAST / 静态分析全部通过 |
| **开发者盲区** | 即使是资深开发者也鲜有检查 `.git/hooks/` 的习惯,被工具链隐藏起来 |

> **本质诊断**: git hooks 武器化了一种**信任不对称(trust asymmetry)** — "Git 自身被视为信任边界的一部分,但用户从不查看其内部"。SolarWinds 和 XZ Utils 对构建系统所做之事,本行动对**个人开发者工作站**实施。

---

## 4. 主要恶意软件分析

### 4.1 BeaverTail(第一阶段载荷)

| 项目 | 内容 |
|---|---|
| **语言 / 平台** | JavaScript(Node.js 运行时) |
| **作用** | 信息窃取 + 第二阶段载荷(InvisibleFerret)下载器 |
| **目标数据** | • 浏览器凭据(Chrome、Brave、Firefox)<br>• 加密货币钱包(Solana CLI 密钥、Exodus、MetaMask)<br>• macOS Keychain<br>• SSH 密钥、AWS / GCP 凭据 |
| **沙箱规避** | 检查 qemu、virtual、parallels、virtualbox、vmware 等关键字 |
| **C2 通信** | 多 IP 轮换,基于 HTTP POST 的外发 |
| **变种** | OtterCookie(Cisco Talos 2025-10 分析,新增 JavaScript 模块) |

### 4.2 InvisibleFerret(第二阶段载荷)

| 项目 | 内容 |
|---|---|
| **语言 / 平台** | Python(全 OS) |
| **作用** | 持久化后门、RAT 功能、附加载荷 stager |
| **持久化** | • Linux:cron + systemd user unit<br>• macOS:LaunchAgent(`~/Library/LaunchAgents/`)<br>• Windows:Run 键 + Scheduled Task |
| **变种** | TsunamiKit(HiSolutions 2025-04)、GolangGhost(Silent Push 2025-04,Go 移植版) |

### 4.3 工具谱系(2025–2026)

```
BeaverTail (JS)  ──→  InvisibleFerret (Python)  ──→  TsunamiKit (Python, 2025 Q2)
       │
       ├──→  OtterCookie (JS module, 2025-10)
       │
       └──→  GolangGhost (Go, 2025 Q2)        ──→  FrostyFerret (Go, macOS 专用)
                                                            │
                                                            └──→  XORIndex Loader (2025-10)
```

此源代码分支显示了 Lazarus 的标准运营模式 — **将相同功能跨多种语言栈(JS、Python、Go)移植**以规避 EDR 检测。

**一句话总结:AI LLM 的进展使朝鲜实时移植以规避检测的能力达到前所未有的速度。**

---

## 5. 韩国环境影响评估

### 5.1 韩国开发者较全球平均高出的暴露因素

| 因素 | 说明 | 风险放大 |
|---|---|---|
| **LinkedIn Korea 活跃度** | 2025 年韩国 LinkedIn 用户约 700 万,开发者及区块链领域是最活跃群体之一 | 一次接触渠道丰富 |
| **DAXA 交易所及 Web3 创业公司密集** | 五大韩元对交易所(Upbit、Bithumb、Coinone、Korbit、Gopax)+ DAXA 会员公司 + 多家 Web3 发行方总部集中于首尔 | 目标价值高 |
| **外币结算自由职业者池** | 在 Upwork / Fiverr / Toptal 上活跃的韩国开发者人口增长(尤其前端、智能合约) | 虚假招聘人员接触自然不被怀疑 |
| **AI 编程工具采用加速** | Cursor、Claude Code、Copilot 等采用率上升 → `.vscode/tasks.json` 变种暴露面同步上升 | 前一变种依然有效 |
| **国防 / 航空研究人员的 LinkedIn 活动** | KAI、LIG Nex1、Hanwha 等协作公司开发者公开搜索招聘信息 | 国家安全级威胁 |

### 5.2 威胁场景

| 场景 | 可能性 | 影响 | 优先级 |
|---|---|---|---|
| **S1.** 交易所后台开发者在虚假面试后凭据外泄 → 交易所内部系统横向移动 | 极高 | 极高 | P0 |
| **S2.** Web3 发行方 Solidity 开发者泄露 deploy 密钥 / 多签种子 → 代币合约 owner 被夺取 | 极高 | 极高 | P0 |
| **S3.** 自由职业者被感染 → 后门潜伏到多个客户的代码库 | 高 | 高 | P1 |
| **S4.** 国防供应商开发者被感染 → 部分非公开武器系统代码泄露 | 中~高 | 极高 | P0(国家安全) |
| **S5.** AI 公司 ML 工程师被感染 → 模型权重 / 训练数据泄露 | 中 | 高 | P1 |

### 5.3 历史损失规模(归属 Lazarus)

| 事件 | 时间 | 损失规模 |
|---|---|---|
| Bybit hack | 2025 | **约 14 亿美元**(史上最大单一交易所事件) |
| Stake.com hack | 2023 | 4,100 万美元 |
| CoinEx hack | 2023 | 2,700 万美元 |
| Atomic Wallet | 2023 | 1 亿美元+ |
| **累计估计** | 2017~2026 | **30 亿美元+**(Chainalysis) |

**Lazarus 的主要收益直接为朝鲜政权的核 / 导弹项目提供资金**,这一事实经美国财政部和联合国专家组报告反复确认。因此封堵本行动不是单纯的安全事项,而是**国家安全与国际制裁执行事项**。

---

## 6. IOC(Indicators of Compromise)

> ⚠️ 本 IOC 系从 OpenSourceMalware、Microsoft、Cisco Talos、Abstract Security、Socket 公开材料交叉提取,且实时变化。运营应用前**务必再次确认最新状态**。

### 6.1 网络 IOC(代表值,时间点基准)

| 类型 | 值 | 来源 |
|---|---|---|
| C2 IP | `144.172.115[.]189:8080` | Abstract Security(2026-03) |
| 载荷域名 | `camdriver[.]pro`(macOS WebCam.zip 下载) | Abstract Security(2026-03) |
| C2 模式 | HTTP POST 中携带 `excludeFolders`、`scanDir` 关键字 | Microsoft(2026-03) |

### 6.2 主机 IOC(行为)

| 指标 | 说明 |
|---|---|
| `.git/hooks/post-merge`、`post-checkout`、`pre-push` 中含 base64 编码载荷或 `curl` / `wget` 下载调用 | git hook 变种 |
| `~/Library/LaunchAgents/` 中新建 plist | macOS 持久化 |
| `~/.config/autostart/` 中新建 `.desktop` 文件 | Linux 持久化 |
| Windows `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` 中新增条目 | Windows 持久化 |
| `node` 进程命令行中包含 `qemu`、`vmware`、`parallels` 关键字 | BeaverTail 沙箱规避 |
| `wscript.exe` 从 PowerShell / CMD / temp 目录执行 `.vbs` | OtterCookie 变种 |
| 可疑文件名:`WebCam.zip`、`WebCam/`、`update.dmg`、`MiroTalk*.zip` | 虚假视频会议工具变种 |

### 6.3 行为 IOC(开发者工作站狩猎)

| 模式 | 可疑信号 |
|---|---|
| `git pull` 或 `git merge` 后 1~10 秒内向外部域名发起出站连接 | 可能是 hook 触发 |
| Node.js 进程同时导入 `clipboard` + `socket.io` + `axios` 模块 | BeaverTail 载荷签名 |
| Python 通过 `requests` + `subprocess` + `base64` 进行外部调用后立即派生子进程 | InvisibleFerret 模式 |

---

## 7. 检测规则 / 狩猎查询

### 7.1 Microsoft Defender XDR(KQL — 基于 Microsoft 公开规则,2026-03)

```kql
DeviceProcessEvents
| where (
    (InitiatingProcessCommandLine has_all ("axios", "const uid", "socket.io")
        and InitiatingProcessCommandLine contains "clipboard") or
    (InitiatingProcessCommandLine has_all ("excludeFolders", "scanDir", "curl ", "POST")) or
    (ProcessCommandLine has_all ("*bitcoin*", "credential", "*recovery*", "curl ")) or
    (ProcessCommandLine has_all ("node", "qemu", "virtual", "parallels", "virtualbox", "vmware", "makelog")) or
    (ProcessCommandLine has_all ("http", "execSync", "userInfo", "windowsHide")
        and ProcessCommandLine has_any ("socket", "platform", "release", "hostname", "scanDir", "upload"))
)
```

### 7.2 git hooks 专用狩猎(自定义)

#### 7.2.1 macOS / Linux(bash)
```bash
# 在用户 home 下所有 .git/hooks 目录中搜索可疑模式
find "$HOME" -type d -name "hooks" -path "*/.git/*" 2>/dev/null \
  | while read dir; do
      grep -lE "curl |wget |base64 -d|eval |\$\(.*http" "$dir"/* 2>/dev/null
    done
```

#### 7.2.2 osquery
```sql
SELECT path, sha256, mtime
FROM file
WHERE path LIKE '%/.git/hooks/%'
  AND filename IN ('post-merge', 'post-checkout', 'pre-push', 'post-rewrite', 'pre-commit')
  AND size > 100;
```

#### 7.2.3 Splunk
```spl
index=endpoint sourcetype=osquery
  path="*.git/hooks/*"
  filename IN ("post-merge","post-checkout","pre-push")
| search content="*curl *" OR content="*base64 *" OR content="*wget *"
| stats count by host, path
```

### 7.3 SIEM 关联规则建议

```
RULE: Contagious Interview Git Hook Trigger
WHEN:
  - process = git (clone|pull|merge|checkout)
  AND followed by within 30 seconds:
    - outbound HTTP/HTTPS to non-organization domain
    - by user-context process (not system)
THRESHOLD: 1 occurrence on developer workstation
ACTION: Alert + auto-quarantine cloned directory
```

---

## 8. 防御建议

### 8.1 个人开发者

| # | 措施 | 命令 / 设置 |
|---|---|---|
| 1 | **clone 后立即检查 hooks 习惯化** | `ls -la .git/hooks/` 后 `cat post-merge post-checkout pre-push 2>/dev/null` |
| 2 | **全局 hook 路径无效化** | `mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks` |
| 3 | **仅在隔离环境中运行评估代码** | `docker run --rm -it --network none ubuntu:24.04 bash`(网络隔离容器) |
| 4 | **阻止 npm 自动脚本** | `npm config set ignore-scripts true`(全局默认) |
| 5 | **隔离 pip 依赖** | `pip install --no-deps <pkg>` 或强制 `pipx` / `venv` |
| 6 | **5 分钟招聘人员 / 公司验证规则** | WHOIS 域名注册日、LinkedIn 员工历史、与公司官方网站的招聘公告匹配性 |
| 7 | **强制使用硬件密钥(YubiKey 等)** | 即使凭据被盗也无法绕过 2FA |
| 8 | **加密货币种子永久与工作站分离** | 仅使用冷钱包(Ledger、Trezor),热密钥仅限临时交易 |

### 8.2 组织(企业)

| # | 措施 | 责任部门 |
|---|---|---|
| 1 | 全公司 Git 客户端策略:强制 `core.hooksPath` 指向公司管理目录(MDM / 域策略) | IT / SecOps |
| 2 | 开发者工作站**单一用途 BYOD 隔离** — 强制将公司资产与个人自由职业活动分离 | HR + IT |
| 3 | 在 EDR 策略中部署本报告 §7 的 KQL / osquery 规则 | SecOps |
| 4 | 新员工 OPSEC 强制培训 — 整合 Contagious Interview、SCARCRUFT、MCP 变种的统一模块 | InfoSec / HR |
| 5 | DAXA 交易所与 Web3 发行方:**保管 deploy 密钥 / 多签种子的工作站与一般开发环境物理及逻辑完全隔离(HSM 或 air-gap)** | CISO / Treasury |
| 6 | 企业内 GitLab / GitHub Enterprise:对从外部接收的 ZIP / tarball 自动扫描(包括 `.git/hooks/` 内容检查规则) | DevSecOps |

### 8.3 韩国交易所与 Web3 特别建议

| 领域 | 建议 |
|---|---|
| **DAXA 层面** | 在会员公司安全检查项目中,将"开发者工作站 `.git/hooks/` 检查"加入强制项 |
| **交易所热钱包运营** | 多签签名工作站必须**断网**、USB 屏蔽,并使用独立 keychain |
| **Web3 发行方** | 智能合约 deploy 密钥仅在独立 air-gap 机器上使用,与日常 LinkedIn 活动机器绝对不共享 |
| **聘用自由职业者时** | 加强外部自由职业者身份验证流程,接收 PR 前必须先在隔离环境中执行验证 |
| **入职 / 面试阶段** | 入职前安全简报必须明确警告:"针对你的虚假招聘者可能正在 LinkedIn 上等待。" |

### 8.4 政策与制度建议

1. **KISA / NIS / KoFIU 联合警报发布** — 针对交易所、Web3、金融领域开发者的常规活动。
2. **更新 DAXA 自律规则指南** — 将"发行方 deploy 密钥环境隔离"加入交易所上市审查项目。
3. **国防 / 航空供应商 LinkedIn 活动指南** — 关于持有安保等级的开发者使用外部招聘平台的明确政策。
4. **与 LinkedIn 韩国分支机构合作** — 强化对疑似 DPRK 虚假招聘者档案的举报渠道及主动 takedown。

---

## 9. MITRE ATT&CK 映射

| Tactic | Technique | ID | 在本行动中的应用 |
|---|---|---|---|
| Reconnaissance | Gather Victim Identity Information | T1589 | LinkedIn 资料抓取、招聘信息收集 |
| Resource Development | Establish Accounts | T1585 | 虚假招聘 / 虚假公司 LinkedIn 账户 |
| Resource Development | Acquire Infrastructure: Domains | T1583.001 | 新注册公司域名(数周至数月) |
| Initial Access | Phishing: Spearphishing via Service | T1566.003 | 通过 LinkedIn DM / 邮件的招聘伪装 |
| Initial Access | Trusted Relationship | T1199 | 滥用招聘流程中的信任关系 |
| Execution | User Execution: Malicious File | T1204.002 | 目标主动 `git clone` 后执行日常命令 |
| Execution | **Event Triggered Execution: Component Object Model Hijacking → Git Hooks(变体)** | T1546(集群) | **本行动核心新技术** |
| Persistence | Boot or Logon Autostart Execution | T1547 | LaunchAgent / Run 键 / cron |
| Defense Evasion | Hide Artifacts: Hidden Files and Directories | T1564.001 | `.git/hooks/` 在常规 GUI 中不显示 |
| Defense Evasion | Virtualization/Sandbox Evasion | T1497 | qemu / vmware 关键字检查 |
| Credential Access | Credentials from Password Stores: Credentials from Web Browsers | T1555.003 | Chrome / Brave / Firefox 凭据 |
| Credential Access | Credentials from Password Stores: Keychain | T1555.001 | macOS Keychain |
| Collection | Data from Local System | T1005 | 加密货币钱包、SSH 密钥 |
| Command and Control | Application Layer Protocol: Web Protocols | T1071.001 | HTTP POST 外发 |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | C2 IP 或域名 |

**MITRE Group ID**: **G1052(Contagious Interview)** — `https://attack.mitre.org/groups/G1052`

---

## 10. 结论

### 10.1 一句话总结

> **Lazarus 在 npm 被堵后转向虚假视频会议工具,虚假视频会议被堵后转向 VS Code Tasks,VS Code Tasks 被堵后转向 git hooks。下一次进化将在 6 个月内到来。**

### 10.2 本行动向韩国安全环境提出的三个问题

1. **开发者警觉性最低的时刻是求职过程。我们的组织保护了那一刻吗?**
2. **`.git/hooks/` 是盲区,我们工作站上还有哪些未被代码审查触及的盲区?**(下一个目标可能是 `.gitattributes` filter、`.npmrc` `prepare`、`.devcontainer/`、`Makefile`?)
3. **Lazarus 想要的不是单个开发者一台机器,而是以那个人为入口的韩国交易所、Web3 发行方、国防供应商的资产。我们测算过失去一名开发者所造成的 blast radius 吗?**

### 10.3 单一强制建议(One Mandatory Action)

**今日起在所有开发者工作站上执行下列一行命令:**

```bash
mkdir -p ~/.config/git/hooks && git config --global core.hooksPath ~/.config/git/hooks
```

这一行命令在**个人层面立刻无效化本行动的 git hooks 变种**。成本 0 元,时间 30 秒。组织层面可通过 MDM / 域策略强制部署。

---

## 11. 参考资料

| # | 来源 | 发表时间 | 备注 |
|---|---|---|---|
| 1 | OpenSourceMalware.com, "Lazarus Group Uses Git Hooks To Hide Malware" | 2026-05 | 本报告的一次分析对象 |
| 2 | Matteo Bisi, "Lazarus Group Hides Malware in Git Hooks to Target Developers"(msbiro.net) | 2026-05-06 | 二次解读 |
| 3 | Microsoft Security Blog, "Contagious Interview: Malware delivered through fake developer job interviews" | 2026-03-11 | 提供 KQL 规则 |
| 4 | Abstract Security, "Contagious Interview: Evolution of VS Code and Cursor Tasks Infection Chains Part 2" | 2026-03 | 公开 C2 IP |
| 5 | OpenSourceMalware, "Contagious Interview campaign abuses Microsoft VSCode tasks" | 2025-11-28 | 前一变种 |
| 6 | NVISO Labs, "Contagious Interview Actors Now Utilize JSON Storage Services for Malware Delivery" | 2025-11-13 | 工具谱系 |
| 7 | Cisco Talos, "BeaverTail and OtterCookie evolve with a new Javascript module" | 2025-10-16 | 工具分析 |
| 8 | Socket, "North Korea's Contagious Interview Campaign Escalates: 338 Malicious npm Packages, 50,000 Downloads" | 2025-10-10 | 规模 |
| 9 | Socket, "Another Wave: 35 New Malicious npm Packages" | 2025-06-24 | npm 进化 |
| 10 | ANY.RUN, "OtterCookie: Analysis of Lazarus Group Malware Targeting Finance and Tech Professionals" | 2025-06-03 | 目标分析 |
| 11 | ESET Research, "ESET APT Activity Report Q4 2024–Q1 2025" | 2025-05-12 | 组织活动 |
| 12 | NTT Security, "Additional Features of OtterCookie Malware Used by WaterPlum" | 2025-05-07 | 变种分析 |
| 13 | HiSolutions, "Rolling in the Deep(Web): Lazarus Tsunami" | 2025-04-25 | TsunamiKit |
| 14 | Silent Push, "Contagious Interview Launches a New Campaign Creating Three Front Companies" | 2025-04-24 | 基础设施 |
| 15 | MITRE ATT&CK, Group G1052 | 持续更新 | 标准跟踪 |
| 16 | Malpedia, py.invisibleferret | 持续更新 | 工具目录 |

---

**End of Report — CTI-2026-0510-LAZARUS-GITHOOKS — TLP:GREEN**

*2026-05-10*
*© 2026 Dennis Kim (김호광) · gameworker@gmail.com · https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT*
