# 两个并发威胁：主机基础设施被接管与自我传播的供应链蠕虫

> **LiteSpeed cPanel 插件 CVSS 10.0 RCE (CVE-2026-48172) · Mini Shai-Hulud npm 蠕虫新一波攻击 (TeamPCP)**
> *活跃利用正在进行中 · 韩国主机托管与开发生态直接暴露 · 基于 OSINT 的防御分析*

| 项目 | 值 |
| --- | --- |
| **报告 ID** | `CTI-2026-0524-DUALTHREAT` |
| **发布日期** | 2026-05-24 (KST) |
| **分类 (TLP)** | 🟢 TLP:GREEN — 可在社区内自由共享（须注明出处） |
| **严重度** | 🔴 **CRITICAL** — 活跃利用 + 自我传播蠕虫（须立即响应） |
| **涵盖威胁** | ① CVE-2026-48172 (LiteSpeed User-End cPanel Plugin, CVSS 10.0)<br>② Mini Shai-Hulud npm 蠕虫 5 月新增的两波攻击 (TeamPCP) |
| **威胁行为体** | TeamPCP（别名：DeadCatx3 · PCPcat · ShellForce · CipherForce）/ 仅限威胁 ② |
| **框架** | MITRE ATT&CK · NIST SP 800-61 · NIST SP 800-207 (Zero Trust) |
| **作者** | Dennis Kim · 独立威胁情报分析师 · gameworker@gmail.com |

---

## 摘要 (Executive Summary)

2026 年 5 月，两个表面上互不相关、却共享同一结构性教训的高风险威胁同时活跃起来。两个威胁都表现为攻击者以合法方式劫持**"受信任的默认权限"**与**"受信任的自动化流水线"**来提升权限，并对韩国的虚拟主机产业和开发者生态造成直接暴露。

- **威胁 ① — LiteSpeed cPanel 插件 RCE (CVE-2026-48172, CVSS 10.0)：** 在共享主机环境中，任何 cPanel 用户（包括攻击者或被攻陷的账户）只需对 `lsws.redisAble` JSON-API 发起一次调用，即可以 root 权限执行任意脚本。无需绕过认证或赢得竞态条件，且**已在野被活跃利用**。
- **威胁 ② — Mini Shai-Hulud npm 蠕虫新一波攻击 (TeamPCP)：** 在 5 月的两波新攻击中，一波采用了**完全无需凭证的初始访问（credential-free）**技术，另一波则创下历代 Shai-Hulud 蠕虫**单小时最高的软件包生成数量**。4 月的仿冒包 `@bitwarden/cli 2026.4.0` 在安装时即窃取云、CI/CD 与开发者工作站的凭证，并向受害者可发布的所有 npm 包自我传播。
- **共同教训：** 两起事件均利用"合法授予的权限/信任"，而非"被盗取的密码"。因此仅靠凭证轮换并不足以防御；最小权限原则（Zero Trust）与信任边界的重新设计才是核心对策。

---

## 关键判断 (Key Judgments)

| # | 判断 | 置信度 |
| --- | --- | --- |
| **KJ-1** | CVE-2026-48172 属于权限分配错误（Incorrect Privilege Assignment）类型，在共享主机环境中，单个恶意或被攻陷的租户可直接转向对整台服务器（root）的接管。厂商已确认在野利用。 | **High** |
| **KJ-2** | 韩国存在大量使用 cPanel/WHM + LiteSpeed 组合的中小型虚拟主机与代理商；鉴于单台服务器承载数百租户的共享主机结构特性，国内暴露的可能性较高。 | **Medium** |
| **KJ-3** | Mini Shai-Hulud 的"无凭证初始访问"直接从 runner 内存中提取并交换 OIDC 令牌以获取 npm 发布权限，因此合法的发布流水线会带着有效的 SLSA 来源证明（provenance）发布恶意包。仅凭来源证明无法保证安全。 | **High** |
| **KJ-4** | 已观测到一种故障保护（fail-safe）：在令牌被吊销时会销毁用户主目录（`rm -rf ~/`）。因此"先隔离主机、再吊销凭证"这一常规响应反而可能引发数据销毁。 | **High** |
| **KJ-5** | 模仿（copycat）活动的增加正在降低未来对 TeamPCP 归因判断的准确性，因此以"Shai-Hulud 系列 TTP"为单位进行防御，比假设单一行为体更为稳健。 | **Medium** |

---

## 1. LiteSpeed cPanel 插件 RCE — CVE-2026-48172

### 1.1 概述

| 项目 | 值 |
| --- | --- |
| **CVE** | `CVE-2026-48172` |
| **CVSS** | **10.0**（CRITICAL · 最高严重度） |
| **漏洞类型** | 权限分配错误（Incorrect Privilege Assignment）→ 权限提升 / root RCE |
| **受影响产品** | LiteSpeed User-End cPanel Plugin（用户端插件）。WHM 插件不直接受影响 |
| **受影响版本** | v2.3 ～ v2.4.4（v2.4.5 以下全部） |
| **修复版本** | **v2.4.5 已修复** / 建议最低版本 v2.4.7（随 WHM 插件 v5.3.1.0 捆绑） |
| **利用状态** | **已确认在野活跃利用**（2026-05，0-day） |
| **发现者** | 安全研究员 David Strydom |

### 1.2 技术分析

根本原因在于插件的 `lsws.redisAble` JSON-API 端点中存在逻辑缺陷。该端点在默认配置下**向所有已登录的 cPanel 用户开放**，使攻击面极为广泛。

- 无需绕过认证或赢得竞态条件。在持有有效 cPanel 会话的状态下，仅需一次携带特定参数值的畸形 API 调用即可完成到 root 的权限提升。
- 核心缺陷是对 Redis 启用/禁用功能的处理不当（mishandling），用户输入被原样传入提升后的权限上下文。
- 在共享主机环境中尤为致命 ── 单台服务器上数百个租户已持有有效的 cPanel 会话，因此一个恶意租户或一个已被攻陷的账户即可转向对整台服务器的接管（full server takeover）。

### 1.3 影响评估

| 维度 | 影响 |
| --- | --- |
| **机密性** | 同一服务器内所有租户的文件、数据库与密钥材料被暴露（root 访问） |
| **完整性** | 可植入 WebShell、后门、挖矿程序，篡改内容，形成供应链水坑攻击 |
| **可用性** | 整台服务器宕机、勒索、删除日志以阻碍事件分析 |
| **扩散性** | 在代理商/多租户托管中，一台服务器被攻陷会向众多客户连锁扩散 |

### 1.4 检测 (Detection)

LiteSpeed 提供的失陷指标（IoC）检查命令。无输出表示未被利用；若有输出，应核验并封禁相关 IP，并调查事后的入侵活动。

```bash
grep -rE "cpanel_jsonapi_func=redisAble" /var/cpanel/logs /usr/local/cpanel/logs/ 2>/dev/null
```

### 1.5 响应与缓解 (Remediation)

| 优先级 | 措施 |
| --- | --- |
| **1** | 立即升级到 LiteSpeed WHM Plugin v5.3.1.0（捆绑 cPanel 插件 v2.4.7），其中包含额外的攻击向量加固。 |
| **2** | 若无法立即打补丁，可移除用户端插件作为缓解措施：<br>`/usr/local/lsws/admin/misc/lscmctl cpanelplugin --uninstall` |
| **3** | 使用 1.4 的 grep 命令检查利用痕迹 → 封禁可疑 IP，精细分析系统日志。 |
| **4** | 若怀疑已失陷，全面轮换服务器密码、API 令牌与 SSH 密钥，并排查 WebShell、计划任务（cron）与新增用户。 |
| **5** | 累计检查同一服务器 5 月的各项公告：包括认证前绕过 CVE-2026-41940（CVSS 9.8）等 cPanel 生态中集中出现的多项公告。 |

---

## 2. Mini Shai-Hulud npm 蠕虫新一波攻击 (TeamPCP)

### 2.1 概述

| 项目 | 值 |
| --- | --- |
| **行动名称** | Mini Shai-Hulud（Shai-Hulud 系列第 4 代变种） |
| **威胁行为体** | TeamPCP（别名 DeadCatx3 · PCPcat · ShellForce · CipherForce），出于经济动机，自 2024 年起活跃 |
| **主要事件** | `@bitwarden/cli 2026.4.0` 仿冒包（4 月）<br>TanStack OIDC 劫持波（5/11，CVE-2026-45321）<br>AntV 等于 5/19 在 22 分钟内自动发布 300+ 个版本的攻击波 |
| **检测到的安全厂商** | Endor Labs · Wiz · SafeDep · Socket · StepSecurity · Snyk · Unit 42 · Akamai 等 |
| **关联 CVE** | CVE-2026-45321（仅就 TanStack 波分配） |

### 2.2 @bitwarden/cli 仿冒包分析

一个仿冒正版 Bitwarden CLI 密码管理器（月下载量 25 万+）的恶意 npm 包 `@bitwarden/cli 2026.4.0` 被发布。安装时会执行多阶段载荷，窃取云服务商、CI/CD 系统与开发者工作站的凭证，并对受害者可发布的所有 npm 包进行后门植入与自我传播。

- 篡改执行路径 → 运行恶意加载器 → 从 GitHub 下载并解压 Bun 归档 → 执行 JavaScript 载荷。
- C2 规避：github.com 流量通常不会被安全工具标记，也无法回溯到行为体所有的域名。被窃数据以非对称加密进行隐藏。

### 2.3 无凭证初始访问 — 新技术

此前所有攻击波都以"被盗凭证"开始，但这一新波并非如此。攻击流程如下。

| 阶段 | 行为 |
| --- | --- |
| **1** | 利用 TanStack 的 GitHub Actions CI 中 PR 工作流的错误配置。来自 fork 的 PR 触发了对基础仓库缓存具有写权限的工作流。 |
| **2** | 攻击者代码污染缓存并潜伏（约 8 小时）。正式维护者的合并触发标准发布工作流，加载了被污染的缓存。 |
| **3** | 蠕虫直接从 runner 内存中抓取 OIDC 令牌 → 通过 npm 令牌交换端点获取发布凭证。 |
| **4** | npm 令牌从未被"窃取"，发布工作流本身也未受损，因此攻击不可见，并获得有效的 SLSA Build Level 3 来源证明。（5/11 19:20–19:26 UTC，在 @tanstack 的 42 个包中发布 84 个恶意版本） |

### 2.4 破坏性故障保护 (Wiper)

5/11 的载荷会安装一个持久化后台守护进程（`gh-token-monitor`），使用被窃的 GitHub 令牌每 60 秒轮询 `api.github.com/user`。一旦令牌被吊销并返回 **HTTP 40x**，便执行 `rm -rf ~/`，销毁用户主目录。该守护进程在 24 小时后自动退出。

> ⚠️ **响应警告：**"先隔离主机、再立即吊销凭证"这一常规一线响应可能触发擦除器。在确认本地未武装破坏性故障保护之前，必须谨慎分阶段地进行令牌吊销与隔离。

### 2.5 MITRE ATT&CK 映射

| 战术 | 技术 (ID) | 在本行动中的应用 |
| --- | --- | --- |
| Initial Access | Supply Chain Compromise (T1195.002) | 分发被污染的 npm/PyPI 包 |
| Execution | npm preinstall hook / `__init__.py` 注入 | 安装时自动执行载荷 |
| Credential Access | Steal Application Access Token (T1528) | 从 runner 内存提取并交换 OIDC 令牌 |
| Persistence | Scheduled Task/Daemon (T1543) | `gh-token-monitor`（LaunchAgent/systemd） |
| Exfiltration | Exfil over Web Service (T1567) | GitHub dead-drop · Session 通讯软件 · 仿冒抢注域名 |
| Impact | Data Destruction (T1485) | 令牌吊销时的 `rm -rf ~/` 擦除器 |
| Propagation | Lateral Tool Transfer（蠕虫） | 重新发布受害者拥有发布权限的所有包 |

### 2.6 失陷指标 (IoC) 与狩猎

- 外泄通道 / C2：`git-tanstack[.]com`（仿冒抢注）、`filev2.getsession.org`、`api.masscan.cloud`，以及托管于 `git-tanstack.com` 的 `transformers.pyz` 投放器。
- 暴露窗口：审计 `2026-05-11T19:20Z` 之后的 CI 运行。检查异常的 npm publish 事件以及指向上述域名的出站连接。
- 使用 `npm token list` 吊销无法识别的令牌。但请注意，**有效的 SLSA 来源证明并非安全的证据** ── 应改用载荷的 SHA-256 哈希进行比对。
- 排查下游传播：若你自有的包是在暴露窗口期间通过 CI 运行发布的，那些版本也可能已被污染。在组织的 GitHub 中狩猎可疑仓库与工作流变更。

---

## 3. 韩国视角与整合建议

### 3.1 韩国生态暴露

| 对象 | 暴露形态 |
| --- | --- |
| **虚拟主机·代理商** | 大量国内中小型主机商与代理商使用 cPanel/WHM + LiteSpeed 组合。一台共享服务器被攻陷即对入驻客户造成连锁损害（威胁 ①） |
| **开发公司·初创企业** | 广泛使用 npm/PyPI 依赖与 GitHub Actions CI/CD。OIDC 信任配置错误会使其暴露于自我传播蠕虫（威胁 ②） |
| **Web3·金融科技** | 前端与钱包 SDK 依赖 npm 供应链。构建流水线被污染会直接转化为用户资产风险 |
| **公共部门·金融** | 因外包开发与包复用的惯例而存在间接供应链暴露。需持续关注 KISA 与金融保安院的公告 |

### 3.2 整合优先建议

| # | 措施 | 对应威胁 |
| --- | --- | --- |
| **1** | **立即将 LiteSpeed cPanel 插件升级至 v2.4.7+，或移除用户端插件** | **① 立即** |
| **2** | 对 redisAble 日志执行 grep 检查，并狩猎共享服务器是否被攻陷 | ① 24h |
| **3** | 最小化 GitHub Actions OIDC 信任范围（限定到工作流/分支），阻断 fork PR 的缓存写入 | ② Zero Trust |
| **4** | 固定依赖版本、校验锁文件、比对 SHA-256 哈希（不可盲信 SLSA 来源证明） | ② 供应链 |
| **5** | 认知擦除器风险：谨慎分阶段进行令牌吊销/隔离，先确保备份再行动 | ② IR 流程 |
| **6** | 将 CI/CD 凭证视为特权令牌 ── 严格限定作用域、定期轮换、对发布事件进行审计日志记录 | ①② 通用 |

### 3.3 综合 — "对权限与信任的滥用"这一共同结构

这两个威胁表面上互不相关，却共享相同的结构。CVE-2026-48172 滥用的是"默认向所有用户开放的权限"，而 Mini Shai-Hulud 滥用的是"授予自动化流水线的信任（OIDC）"，二者皆以合法方式实施。两者都不依赖传统意义上的"入侵"或"密码窃取"。

因此，防御的核心在于超越凭证轮换，重新设计信任边界。最小权限原则（NIST SP 800-207 Zero Trust）、缩减默认开放的权限、对自动化信任进行显式作用域限定，以及不把来源证明/签名等同于安全的验证姿态，才是应对这两个威胁的根本对策。

---

## 附录 A. 参考资料 (References)

1. **The Hacker News.** *"LiteSpeed cPanel Plugin CVE-2026-48172 Exploited to Run Scripts as Root."* <https://thehackernews.com/2026/05/litespeed-cpanel-plugin-cve-2026-48172.html>
2. **GBHackers.** *"LiteSpeed cPanel Plugin 0-Day Exploited for Server Root Access."* <https://gbhackers.com/litespeed-cpanel-plugin-0-day-exploited/>
3. **Cyber Security News.** *"LiteSpeed cPanel Plugin 0-Day Exploited in the wild."* <https://cybersecuritynews.com/litespeed-cpanel-plugin-0-day-exploited/>
4. **Unit 42 (Palo Alto).** *"The npm Threat Landscape: Attack Surface and Mitigations (Updated May 21)."* <https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/>
5. **Akamai.** *"Mini Shai-Hulud: The Worm Returns and Goes Public."* <https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public>
6. **Wiz.** *"Mini Shai-Hulud Strikes Again: TanStack + more npm Packages Compromised."* <https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised>
7. **StepSecurity.** *"TeamPCP's Mini Shai-Hulud Is Back."* <https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem>
8. **Snyk.** *"TanStack npm Packages Hit by Mini Shai-Hulud."* <https://snyk.io/blog/tanstack-npm-packages-compromised/>
9. **SecurityWeek.** *"Bitwarden NPM Package Hit in Supply Chain Attack."* <https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/>
10. **Tenable.** *"Mini Shai-Hulud Supply Chain Attack CVE-2026-45321 FAQ."* <https://www.tenable.com/blog/mini-shai-hulud-frequently-asked-questions>

---

## 附录 B. 免责声明 (Disclaimer)

1. 本报告是基于公开 OSINT 资料及媒体/厂商安全公告的独立分析，不代表任何相关组织、机构或企业的官方立场。
2. 内容仅应用于教育、防御、研究与政策制定目的，严禁用于攻击、入侵或任何非法活动。
3. IoC 与漏洞信息以发布时点（2026-05-24）为准；在实际运用前务必重新核实最新状态。
4. 作者对因直接或间接使用本资料而产生的任何损害概不负责。

---

**© 2026 Dennis Kim** · Cyber Threat Intelligence Division
📧 gameworker@gmail.com · 🔗 <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT>
