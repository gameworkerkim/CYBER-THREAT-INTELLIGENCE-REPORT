| id             | CTI-2026-0530-GOGS                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | 未修补的Critical RCE — Gogs git rebase 参数注入漏洞                                                                               |
| subtitle       | 一个让任意已认证用户掌控自托管Git服务器的9.4分缺陷，以及跨租户入侵                                                                                    |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | zh                                                                                                                     |
| tags           | Argument-Injection · RCE · Self-Hosted-Git · Supply-Chain · Cross-Tenant · Unpatched                                  |
| threat_actors  | 不适用（PoC·Metasploit模块公开）                                                                                                |
| cve            | 未分配CVE（Rapid7评定 CVSS 9.4）                                                                                              |
| frameworks     | MITRE ATT&CK · NIST SP 800-61（事件响应） · STIX/TAXII                                                                       |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# 未修补的Critical RCE — Gogs git rebase 参数注入漏洞

> **报告ID** `CTI-2026-0530-GOGS` · **发布日期** 2026-05-30 · **分类** `TLP:GREEN` · **严重度** 🔴 HIGH
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*一个让任意已认证用户掌控自托管Git服务器的9.4分缺陷，以及跨租户入侵*

---

## 目录

1. 摘要 (TL;DR)
2. 漏洞分析 — `--exec` 参数注入
3. 攻击场景 — 从无权限账户到服务器接管
4. 影响范围与暴露规模
5. 取证痕迹与检测
6. 缓解建议（补丁缺失情形下）
7. 韩国视角 — 自托管Git的盲区
8. 结论
9. 参考文献

---

## 摘要 (TL;DR)

2026年5月28日，Rapid7披露了流行的自托管Git服务**Gogs**中的一个严重漏洞，它允许**任意已认证用户在服务器上执行任意代码**。目前尚未分配CVE标识，但Rapid7将其评定为CVSS 9.4。

核心发生在Gogs的*“Rebase before merging”*合并操作中。当攻击者用**恶意分支名**创建拉取请求时，该分支名会被注入到`git rebase`命令的`--exec`标志中，导致在每次提交重放后执行任意shell命令。无需管理员权限，也无需与其他用户交互。

更严重的是，该缺陷**于2026年3月17日报告给维护者，但截至发布时仍未修补**，且Rapid7已发布一个对Linux和Windows均可自动攻击的**Metasploit模块**。简言之，武器已公开，补丁却没有。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                | 置信度           |
| ---- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| KJ-1 | 这是典型的**参数注入（argument injection）**：用户输入（分支名）被原样传入shell命令参数，除认证外几乎没有任何前提条件。                                            | **High**      |
| KJ-2 | **未修补 + 公开Metasploit模块**的组合几乎消除了实战利用的门槛。暴露的实例面临即时风险。                                                              | **High**      |
| KJ-3 | 在共享服务器环境中，**跨租户（cross-tenant）入侵**成为可能——一个用户可读取他人的私有仓库。                                                            | **High**      |
| KJ-4 | 默认配置（允许注册与创建仓库）的实例风险最高。缓解可行，但不能替代根本性补丁。                                                                            | **Medium-High**|
| KJ-5 | 自托管Git是源代码、凭证与CI流水线的单一信任锚点，因此该缺陷可成为**供应链入侵的桥头堡**。                                                                | **Medium-High**|

---

## 1. 漏洞分析 — `--exec` 参数注入

Gogs是用Go编写的轻量级自托管Git服务，作为GitHub的自托管替代被广泛使用。该缺陷发生在合并PR时使用`git rebase`的*“Rebase before merging”*选项中。

`git rebase`将某分支的提交序列重放到另一基础分支之上以创建线性历史。它可接收**在每次提交重放后执行shell命令的`--exec`标志**作为参数。Gogs在合并时将用户可控的**分支名**未经充分清洗便传入`git rebase`调用。因此，若攻击者在分支名中嵌入`--exec`形式的载荷，该命令便会在合并过程中于服务器主机上执行。

> 研究员Jonah Burgess（Rapid7）：“该漏洞允许任意已认证用户通过创建带恶意分支名的拉取请求，在‘Rebase before merging’合并操作中将`--exec`标志注入`git rebase`，从而在服务器上实现RCE。”

受影响平台为Windows、Linux、macOS等**所有受支持的平台**。

---

## 2. 攻击场景 — 从无权限账户到服务器接管

该漏洞的危险性在于**几乎没有前提条件**。

| 场景 | 前提 | 攻击路径 |
| --- | --- | --- |
| ① 默认配置实例 | 允许注册与创建仓库（默认值） | 创建账户 → 创建仓库（自动成为所有者） → 在设置中开启rebase合并 → 独立运行整条利用链 |
| ② 拥有写权限者 | 对已启用rebase合并的仓库拥有write权限 | 直接利用 |
| ③ 仓库创建受限环境 | 对任意已启用rebase合并的仓库拥有write权限 | 经该仓库利用 |

场景①尤为严重：*“任何注册用户创建仓库即自动成为其所有者，启用rebase合并只是设置中的一个开关，整条利用链无需任何其他用户交互即可运行。”*

成功后，攻击者可入侵服务器、访问实例上的所有仓库、转储凭证、移动到网络中其他可达系统，并篡改所托管仓库的代码。最重要的是，它会导致**跨租户数据泄露**，读取同一共享服务器上其他用户的私有仓库。

---

## 3. 影响范围与暴露规模

- **估计暴露实例**：约1,141个面向互联网的Gogs实例。鉴于大多数部署位于VPN或内网之后，**实际数量预计更高**。
- **武器化程度**：Rapid7发布了对Linux与Windows目标自动化整条利用链的Metasploit模块。该模块支持两种模式——(a) 在攻击者账户下创建、利用并删除临时仓库的默认模式，(b) 针对攻击者已拥有write/merge权限仓库的模式。
- **补丁状态**：尽管已于2026-03-17报告给维护者，截至发布时**仍未修补**。

---

## 4. 取证痕迹与检测

据Rapid7，攻击痕迹因模式而异。

- **自建并删除仓库模式**：服务器日志中留下的痕迹实际上只有**一条HTTP 500错误**——事后分析中难以与正常错误区分。
- **利用既有仓库模式**：会留下额外的痕迹，检测可能性相对更高。

检测建议：

1. 监控与PR合并事件关联的异常HTTP 500模式。
2. 对异常分支名（含特殊字符或`--exec`类令牌）的创建事件设警报。
3. 检测由Gogs进程派生的意外shell/子进程行为。
4. 追踪新账户 → 创建仓库 → 开启rebase → 合并这一短时间连锁行为。

---

## 5. 缓解建议（补丁缺失情形下）

在缺乏根本补丁时，Rapid7建议的临时缓解如下。

1. **限制注册** — 在`app.ini`中设置`DISABLE_REGISTRATION = true`，阻止不受信任用户创建账户。
2. **限制仓库创建** — 在`app.ini`中设置`MAX_CREATION_LIMIT = 0`，防止用户创建自己的仓库。
3. **审计rebase合并设置** — 全面检查启用rebase合并的仓库，并在不必要处关闭。
4. **网络隔离** — 移除直接的互联网暴露，将其置于VPN/内网/访问控制之后。
5. **考虑替代方案** — 若补丁提供不确定，可将迁移至维护活跃的替代品（如Forgejo/Gitea）作为中期课题评估（但须核对版本，因Gitea系软件亦有各自的漏洞历史）。

---

## 6. 韩国视角 — 自托管Git的盲区

在韩国的初创公司、研究室与中小SI环境中，Gogs/Gitea类自托管Git因*“轻量且免费”*被广泛使用，但存在以下盲区。

- **资产清单缺失** — “仅供内部使用的Git”这种认知往往使其被排除在安全资产清单与漏洞扫描范围之外。
- **CI/CD信任链** — Git服务器不仅是源代码的信任起点，也是部署密钥、Webhook与CI运行器令牌的信任起点。服务器被接管可蔓延为构建流水线投毒。
- **跨租户风险** — 在托管多个团队/项目的共享实例上，该缺陷成为一个团队窃取另一团队私有代码的路径。

建议：无论是否暴露于互联网，韩国运营方都应**立即将自家Gogs实例纳入资产清单**，应用§5的缓解措施，并跟踪补丁进展。

---

## 7. 结论

该漏洞不是新技术，而是一个经典错误——**在shell参数中信任用户输入**。然而三重条件——(1)除认证外无前提条件，(2)存在公开的Metasploit模块，(3)无根本补丁——叠加使其实战风险极高。

自托管Git是组织最敏感资产——源代码、凭证、部署流水线——的单一信任锚点。最大的风险是以“它是内部的，所以没事”的假设放任此类系统不管。在补丁到来之前，消除暴露与加固配置不是可选项，而是必需。

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "Critical Gogs RCE Vulnerability Lets Any Authenticated User Execute Arbitrary Code", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/critical-gogs-rce-vulnerability-lets.html>

[2] Jonah Burgess, "Authenticated RCE via Argument Injection in Gogs (Unfixed)", Rapid7, 2026-05. <https://www.rapid7.com/blog/post/ve-authenticated-rce-via-argument-injection-gogs-unfixed/>

[3] Rapid7, "Metasploit module — Gogs git rebase argument injection RCE", GitHub PR #21515. <https://github.com/rapid7/metasploit-framework/pull/21515>

[4] Atlassian, "Merging vs. Rebasing", Git Tutorials. <https://www.atlassian.com/git/tutorials/merging-vs-rebasing>

[5] Git Documentation, "git-rebase — `--exec` option". <https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---execltcmdgt>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立CTI存档（TLP:GREEN）公开发布。
联系: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
