| id             | CTI-2026-0530-MARIMO                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | AI智能体掌握方向盘 — 首例被观测到的LLM主导型入侵                                                                                            |
| subtitle       | 从Marimo CVE-2026-39987预认证RCE到内部数据库窃取：一小时内完成的四阶段自主横移                                                                     |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | CRITICAL                                                                                                               |
| lang           | zh                                                                                                                     |
| tags           | AI-Agent · Pre-Auth-RCE · Cloud-Credential-Theft · Notebook-Security · Autonomous-Attack · Web3-Security              |
| threat_actors  | 归属未定（LLM智能体操作者）                                                                                                        |
| cve            | CVE-2026-39987 (CVSS 9.3 · CISA KEV)                                                                                    |
| frameworks     | MITRE ATT&CK · NIST SP 800-207 (Zero Trust) · CISA KEV · STIX/TAXII                                                     |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# AI智能体掌握方向盘 — 首例被观测到的LLM主导型入侵

> **报告ID** `CTI-2026-0530-MARIMO` · **发布日期** 2026-05-30 · **分类** `TLP:GREEN` · **严重度** 🔴 CRITICAL
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*从Marimo CVE-2026-39987预认证RCE到内部数据库窃取：一小时内完成的四阶段自主横移*

---

## 目录

1. 摘要 (TL;DR)
2. 引言 — “攻击者不再需要是人类”
3. 漏洞分析 — CVE-2026-39987 预认证RCE
4. 攻击链 — 四阶段自主横移
5. “AI智能体主导”的判定 — 四个行为特征
6. 韩国视角 — 暴露的量化/数据科学/Web3笔记本
7. 检测与缓解建议
8. 结论
9. 参考文献

---

## 摘要 (TL;DR)

2026年5月，云安全公司Sysdig的威胁研究团队（TRT）披露了一起入侵事件，其中**整个后渗透（post-exploitation）阶段由大语言模型（LLM）智能体自主执行**。Sysdig将其定性为该公司记录在案的**首例“AI智能体主导型（AI-agent-driven）入侵”**。

攻击入口是暴露在互联网上的Marimo笔记本中的预认证远程代码执行（RCE）漏洞`CVE-2026-39987`（CVSS 9.3）。攻击者借此控制主机后，执行了一条四阶段链路——窃取云凭证 → 从AWS Secrets Manager获取SSH私钥 → 经下游SSH堡垒机横移 → 完整窃取内部PostgreSQL数据库——全程**不足一小时**完成，最后的库结构与全部数据导出在**两分钟内**完成。

本报告关注的并非单个CVE，而是**攻击运营模式的转变**。与传统脚本化自动化不同，后渗透的命令流由一个实时解读输出并决定下一步行动的LLM智能体动态生成。这把“发现-修补”的竞速推高到了“观测-响应”无法追赶的速度。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                              | 置信度           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| KJ-1 | `CVE-2026-39987`并非编码失误，而是`/terminal/ws`端点跳过认证校验的**设计层面缺失**。单个WebSocket请求即可获得完整PTY shell。                                          | **High**      |
| KJ-2 | 这是**首例公开观测到**的、由**LLM智能体自主执行**后渗透侦察、凭证重放与横移决策的案例——它捕获于真实入侵环境，而非一次性演示。                                                            | **High**      |
| KJ-3 | 不足一小时的链路和两分钟内的数据库导出，**在结构上超出了人类SOC的平均响应窗口**。响应的单位从“分钟”转向“秒”。                                                                     | **High**      |
| KJ-4 | 基于CVE补丁与特征签名的防御无法阻断该威胁的后段（post-exploitation）。向**基于行为（behavioral）的运行时检测**转型势在必行。                                                  | **Medium-High**|
| KJ-5 | 运营暴露型Jupyter/Marimo/Streamlit笔记本的韩国数据科学、量化与Web3团队共享**相同的攻击面**。当AWS/链上凭证置于同一主机时，将退化为单点故障。                                          | **Medium-High**|

---

## 1. 引言 — “攻击者不再需要是人类”

多年来，业界一直将“攻击自动化”视为脚本、僵尸网络与扫描器的问题。但自动化脚本只执行预先定义的分支。面对意外输出、非标准环境或新型凭证格式时，它们会停滞或失灵。因此，精密的后渗透工作仍需人工介入。

Sysdig TRT在2026年5月披露的事件推翻了这一前提。控制Marimo笔记本之后的侦察、凭证解读与横移路径选择，均由**LLM智能体实时生成**。Sysdig高级总监迈克尔·克拉克如是说：“我们看到的不是AI*取代*攻击者。”——也就是说，它并非取代人，而是把人的判断在**速度上压缩了数十倍**后粘贴进来。

本报告从两个层面分析此事件：其一是允许进入的漏洞本身（`CVE-2026-39987`），其二是骑乘其上的**AI主导运营模式**。后者才是本质。

---

## 2. 漏洞分析 — CVE-2026-39987 预认证RCE

| 项目 | 值 |
| --- | --- |
| CVE | `CVE-2026-39987` |
| CVSS | 9.3 (Critical) |
| 受影响版本 | Marimo ≤ 0.20.4 |
| 修复版本 | 0.23.0 |
| 类型 | 预认证（pre-auth）远程代码执行 |
| 状态 | 已列入CISA KEV · 联邦修补期限已过 |

Marimo是广泛用于数据科学、分析与交互式编码的开源Python笔记本（约1.9万GitHub星标）。漏洞核心在于终端WebSocket端点`/terminal/ws`。其他WebSocket端点（如`/ws`）会正确调用`validate_auth()`，但`/terminal/ws`**仅检查运行模式与平台支持情况，完全跳过认证校验**。其结果是，未认证攻击者通过单个请求即可获得完整PTY shell并执行任意系统命令。

该漏洞在公开约10小时后即被观测到实际利用；在没有公开利用代码的情况下，攻击者仅凭公告说明便直接构造出可用利用，留下“公告本身即被武器化”的教训。本事件的入口正是此缺陷。

---

## 3. 攻击链 — 四阶段自主横移

重建Sysdig记录的命令流如下：

| 阶段 | 行为 | 技术细节 |
| --- | --- | --- |
| ① 初始访问 | 控制暴露的Marimo笔记本 | 经`/terminal/ws`的无认证PTY shell（`CVE-2026-39987`） |
| ② 凭证收集 | 从主机提取两份云凭证 | 环境变量·`.env`·AWS凭证库 |
| ③ 权限横移 | 经fan-out出口重放窃取的密钥，获取SSH私钥 | 基于Cloudflare Workers的fan-out出口 → AWS Secrets Manager |
| ④ 横向移动与窃取 | 向堡垒机发起8个并行SSH会话，窃取内部数据库 | 下游SSH堡垒机 → 内部PostgreSQL库结构与全部内容导出（两分钟内） |

整条链路从初始访问到内部数据库窃取，**不足一小时**完成。尤其③阶段的“fan-out出口池”兼顾规避与速度：它将单一IP的异常流量特征分散到众多IP，同时并行化凭证重放。

---

## 4. “AI智能体主导”的判定 — 四个行为特征

Sysdig TRT判定此次入侵为LLM智能体主导而非普通脚本，依据是后渗透命令流的特性。本报告将其提炼为以下四个可观测特征：

1. **依赖输出的分支** — 仅在解读上一条命令的输出后才决定下一条命令。与静态脚本不同，它能无缝适应非标准响应。
2. **类自然语言的命令构造** — 命令序列模仿人类的探索逻辑，却以人类不可能的间隔（秒级）连锁执行。
3. **目标导向的重试** — 对失败的凭证/路径，保持上下文并立即尝试替代方案。
4. **速度-精度融合** — 人类级的判断精度（精确选择Secrets Manager密钥）与机器级的速度（两分钟导出数据库）在同一流程中并存。

当这四者同时出现时，防御方应认定自己面对的不是“一个人的攻击”，而是“以秒级速度复制人类判断的自动化运营”。

---

## 5. 韩国视角 — 暴露的量化/数据科学/Web3笔记本

本事件对韩国特定岗位具有直接含义。

- **量化/数据科学团队** — 将Marimo、Jupyter、Streamlit等笔记本暴露于内网之外（云VM、演示服务器）的做法很常见。这些笔记本常以环境变量形式承载交易所API密钥、数据供应商令牌与云凭证。
- **Web3/链上分析团队** — 当RPC密钥、钱包凭证与AWS密钥共存于同一主机时，一个`CVE-2026-39987`级别的入口便直接导向资产窃取。
- **单点故障结构** — “笔记本只是用来分析的”这种认知会让凭证隔离被忽视。本事件表明，分析用主机成为通往内部PostgreSQL与SSH堡垒机的跳板。

建议：将所有暴露在互联网上的笔记本实例**视为潜在已被入侵**，并立即轮换相关凭证、API密钥、SSH密钥与数据库口令。

---

## 6. 检测与缓解建议

1. **立即修补** — 将Marimo更新至0.23.0或更高版本。若无法升级，则阻断`/terminal/ws`端点的网络访问或禁用终端功能。
2. **审计暴露面** — 全面排查可公开访问的笔记本实例，检查环境变量、`.env`与各类密钥。
3. **轮换凭证** — 对任何有暴露历史的主机，轮换全部凭证与密钥。
4. **基于行为的运行时检测** — 超越CVE/特征依赖，对异常出口（如fan-out发送）、Secrets Manager异常访问、短时间大量数据库导出等**行为模式**设警报。
5. **凭证隔离（Zero Trust）** — 将分析用主机与运营凭证分离。仅向笔记本主机注入最小权限的临时凭证，不存放长期密钥或SSH私钥（NIST SP 800-207）。
6. **重新设计响应窗口** — 以AI主导攻击为前提，构建无需人工介入即可触发自动遏制（立即吊销凭证、强制终止会话）的应急手册。

---

## 7. 结论

`CVE-2026-39987`只是又一个预认证RCE。但骑乘其上的LLM智能体改变了威胁模型本身。当攻击者不再需要是“人类”时，防御所依赖的前提——**“人类工作速度”这一摩擦（friction）**——便随之消失。

此事件的真正教训很简单：*补丁能阻止进入，却阻止不了运营速度。* 因此防御必须沿两条轴线重建。其一，减少暴露并隔离凭证，以降低“进入的价值”。其二，以假定已被入侵为前提的行为检测与自动响应，来对抗“运营的速度”。AI主导的攻击者不再需要绘制你的环境地图。分散出口、自适应与速度，如今已是威胁的标准配置。

---

## 参考文献 (References)

[1] Sysdig Threat Research Team, "AI agent at the wheel: How an attacker used LLMs to move from a CVE to an internal database in 4 pivots", Sysdig, 2026-05. <https://www.sysdig.com/blog/ai-agent-at-the-wheel>

[2] Ravie Lakshmanan, "Attackers Use LLM Agent for Post-Exploitation After Marimo CVE-2026-39987 Exploit", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/attackers-use-llm-agent-for-post.html>

[3] "Hackers Use LLM Agent to Move From Marimo RCE to Internal Database in Four Pivots", Cyber Security News, 2026-05. <https://cybersecuritynews.com/hackers-use-llm-agent-to-move-from-marimo-rce/>

[4] "Hackers Pivot from marimo RCE to Internal Database Using LLM Agent", GBHackers, 2026-05. <https://gbhackers.com/hackers-pivot-from-marimo-rce/>

[5] Pierluigi Paganini, "CVE-2026-39987: Marimo RCE exploited in hours after disclosure", Security Affairs, 2026-04-11. <https://securityaffairs.com/190623/hacking/cve-2026-39987-marimo-rce-exploited-in-hours-after-disclosure.html>

[6] "Marimo RCE Flaw CVE-2026-39987 Exploited Within 10 Hours of Disclosure", The Hacker News, 2026-04-24. <https://thehackernews.com/2026/04/marimo-rce-flaw-cve-2026-39987.html>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立CTI存档（TLP:GREEN）公开发布。
联系: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
