| id             | CTI-2026-0530-CHATGPHISH                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | ChatGPhish — 把AI摘要变成钓鱼界面的ChatGPT渲染器信任缺陷                                                                               |
| subtitle       | 对Markdown链接与图片的隐式信任、间接提示注入，以及二维码跳板                                                                                     |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | MEDIUM                                                                                                                  |
| lang           | zh                                                                                                                     |
| tags           | AI-Security · Prompt-Injection · LLM-Phishing · Data-Exfiltration · Indirect-Injection · QR-Pivot                     |
| threat_actors  | N/A（研究公开 · Permiso Security）                                                                                            |
| cve            | 未分配CVE（Bugcrowd报告，厂商回复“无法复现”）                                                                                          |
| frameworks     | MITRE ATLAS · OWASP LLM Top 10 (LLM01 Prompt Injection) · NIST AI RMF                                                   |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# ChatGPhish — 把AI摘要变成钓鱼界面的ChatGPT渲染器信任缺陷

> **报告ID** `CTI-2026-0530-CHATGPHISH` · **发布日期** 2026-05-30 · **分类** `TLP:GREEN` · **严重度** 🟠 MEDIUM
> **作者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*对Markdown链接与图片的隐式信任、间接提示注入，以及二维码跳板*

---

## 目录

1. 摘要 (TL;DR)
2. 漏洞分析 — 渲染器的隐式信任
3. 三种攻击原语
4. 攻击场景 — 正常网页成为载荷的瞬间
5. 披露时间线与厂商响应
6. 企业/个人视角 — “从邮件到浏览器”扩展的攻击面
7. 检测与缓解建议
8. 结论
9. 参考文献

---

## 摘要 (TL;DR)

2026年5月29日，Permiso Security披露了OpenAI ChatGPT中的一个漏洞，其根源在于AI助手对**Markdown链接与图片的隐式信任**。该手法被命名为**ChatGPhish**（研究员Andi Ahmeti）。

核心在于，`chatgpt.com`的响应渲染器会**信任来自助手刚刚摘要过的第三方页面的Markdown链接与图片URL**。渲染器自动抓取（auto-fetch）这些图片，并把链接作为**位于受信任助手UI内的可点击活动元素**呈现。

其结果是，攻击者只需在任意网页上植入一小段载荷；当受害者请求ChatGPT摘要该页面时，(1) 攻击者托管的图片被自动加载，**泄露IP、User-Agent与Referer**，(2) 钓鱼链接、伪造的系统警告与二维码会**披着ChatGPT自身UI的视觉信任**被渲染出来。由于攻击从邮件/附件转向**浏览器/AI摘要**，攻击面显著扩大。

### 关键判断 (Key Judgments)

| #    | 判断                                                                                                                | 置信度           |
| ---- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| KJ-1 | 该缺陷的根源是**间接提示注入**：模型无法区分自身生成的内容与从外部来源拉取的Markdown。                                                                  | **High**      |
| KJ-2 | 助手UI的**视觉信任**被武器化。伪造的安全警告与钓鱼链接以与ChatGPT自身输出无法区分的方式渲染，且无来源标注。                                                       | **High**      |
| KJ-3 | **二维码跳板**完全绕过桌面端URL防御（拦截列表、悬停预览、密码管理器域名检查）。目的地仅在用第二台设备扫描后才显现。                                                      | **Medium-High**|
| KJ-4 | 自动抓取图片导致的IP/UA/Referer泄露可用于目标侦察与追踪，但并非完整对话窃取。影响集中于**信息泄露 + 钓鱼投递**。                                                | **Medium**    |
| KJ-5 | 鉴于厂商回复“无法复现/重复”且发布时未确认修复，防御者必须以**“仍然脆弱”为前提**应对。（移动应用尤其可能未缓解）                                                       | **Medium**    |

---

## 1. 漏洞分析 — 渲染器的隐式信任

ChatGPhish并非源于内存破坏或认证绕过之类的传统缺陷，而是源于**LLM系统固有的信任边界崩塌**。

当用户请求ChatGPT摘要某网页时，模型会抓取并处理该页面（第三方、不受信任的内容）。问题在于，当处理结果在助手响应窗口中渲染时，`chatgpt.com`渲染器会**把来自该页面的Markdown链接与图片URL当作助手自身输出般信任**。渲染器自动抓取图片URL，并将链接显示为可点击的活动元素。

浏览器的同源策略在此无法提供保护，因为AI助手在**用户的已认证上下文**中执行，使传统的Web安全边界失效。正如研究员所言，ChatGPT*“无法分辨自身生成的内容与从外部来源拉取的攻击者可控Markdown。”*

---

## 2. 三种攻击原语

Permiso识别出由该信任缺陷衍生的三种攻击原语。

| # | 原语 | 说明 |
| --- | --- | --- |
| ① | **UI伪装 / 钓鱼** | 攻击者可控的Markdown链接以无来源标注的可点击活动元素在ChatGPT UI内渲染。用户无法区分攻击者注入的URL与ChatGPT生成的URL。 |
| ② | **伪造的系统警告（欺骗）** | 渲染器将攻击者文本样式化为正规的“账户安全”通知来显示，继承助手自身UI的视觉信任。 |
| ③ | **二维码跳板** | 从攻击者S3存储桶自动渲染的二维码图片绕过所有桌面端URL防御。目的地仅在第二台设备扫描后才显现，从而规避浏览器拦截列表与域名检查。 |

除此之外，仅嵌入图片的自动抓取就会把受害者的**IP、User-Agent与Referer**送至攻击者服务器（信息泄露）。

---

## 3. 攻击场景 — 正常网页成为载荷的瞬间

典型场景如下：

1. 攻击者在任意网页（或如GitHub页面）中隐藏面向ChatGPT的指令。研究演示了向GitHub页面注入伪造安全警告指令的方式。
2. 受害者在工作中请求ChatGPT摘要该页面（正常行为）。
3. 当ChatGPT处理该页面时，隐藏指令反映在响应中——钓鱼链接、伪造的账户安全警告、远程图片与二维码在受信任UI内渲染。
4. 与此同时，攻击者托管的图片自动加载，泄露受害者的IP/UA/Referer。
5. 若受害者从桌面用手机扫描该二维码，便会被带往攻击者S3存储桶内容，完全绕过桌面防御。

在整个过程中，受害者*无需打开恶意附件或回应可疑消息*。“请求受信任的AI摘要网页”这一日常行为正是触发点。

---

## 4. 披露时间线与厂商响应

| 日期 | 事件 |
| --- | --- |
| 2026-04-29 | Permiso通过Bugcrowd首次报告给OpenAI——*“Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration”* |
| （之后） | OpenAI：回复“无法复现（could not be reproduced）”；按重复（duplicate）处理 |
| （之后） | Permiso：说明其报告与所谓“重复”之间的差异并请求更多信息 → 未获回应 |
| 2026-05-29 | Permiso公开ChatGPhish。研究员：“修复应用情况未确认——为安全起见，假定其仍然脆弱” |

研究员表示，发布时**修复应用情况未获确认**。本报告以*“仍然脆弱”这一保守前提*处理。此前一例类似的基于图片Markdown的数据泄露（2023年，Johann Rehberger；引入`url_safe`校验）被不完全缓解的先例，也支持这一前提。

---

## 5. 企业/个人视角 — “从邮件到浏览器”扩展的攻击面

正如Permiso所指出，该缺陷**将攻击的重心从邮件转向浏览器**。组织越是广泛地将ChatGPT用于研究/摘要，员工被要求处理的任意恶意网页就越能把ChatGPT变成钓鱼界面。

- **信任的转移** — 用户被训练为信任助手输出。该信任被攻击者直接继承。
- **检测空白** — 现有安全工具针对邮件/网络流量监控进行调优，使浏览器内由AI渲染的内容处于其可见性之外。
- **移动风险** — 在过往案例中，移动应用往往较晚才获得客户端校验。即便桌面端已缓解，移动端的残余风险仍可能很大。

这是与本存档曾讨论的MCP偏见注入（`CTI-2026-0422-MCP` §6）同一系列的威胁——*“无需代码执行即可将AI输出本身武器化”*——的又一案例。

---

## 6. 检测与缓解建议

1. **摘要输出的边界** — 培训用户将AI摘要/渲染内容中的链接与警告视为“外部、未经验证的内容”。对助手内的“账户安全警告”一律保持怀疑。
2. **控制图片自动加载** — 在可行情况下，于客户端/企业策略层面限制外部图片的自动抓取，或经代理路由，以阻断IP/UA/Referer的暴露。
3. **二维码警惕** — 不信任在桌面屏幕上渲染的二维码。培训用户将扫描前无法验证来源的二维码视为应拦截对象。
4. **对摘要对象的信任进行分级** — 认识到用AI摘要不受信任的外部页面的风险；在敏感业务账户上限定为受信任来源。
5. **跟踪厂商补丁** — 关注OpenAI的官方修复/缓解公告，并单独确认移动应用的覆盖情况。
6. **泛化间接注入防御** — 依据OWASP LLM Top 10（LLM01）、MITRE ATLAS与NIST AI RMF，将输出清洗、来源标注与渲染边界作为设计原则，应用于每一个处理外部内容的AI工作流。

---

## 7. 结论

仅就严重度而言（信息泄露 + 钓鱼投递），ChatGPhish并非Critical。但威胁的**性质**才是关键。它属于LLM时代的结构性漏洞系列——把AI助手积累的*信任*转化为攻击面。在没有内存破坏、没有权限提升的情况下，*“模型无法分辨自身输出与外部内容”*这一个事实，就足以促成钓鱼、侦察与设备跳板。

防御的起点很明确：**AI输出应是验证的起点，而非信任的终点。** 当用户请求ChatGPT摘要一个页面时，结果中的每一个链接、警告与二维码都可能是未经验证的外部内容。“比信任人更信任AI”这一认知习惯本身，正是此攻击所瞄准的最大资产。

> *在用AI摘要敏感页面之前，先确立这样的前提：“此响应中的所有链接都可能来自外部。”*

---

## 参考文献 (References)

[1] Ravie Lakshmanan, "ChatGPhish Vulnerability Turns ChatGPT Web Summaries Into a Phishing Surface", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html>

[2] "New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads", Cyber Security News, 2026-05-29. <https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/>

[3] Andi Ahmeti (Permiso Security) via The Register, "ChatGPT blindly trusts browser content, turning the page into a payload", The Register, 2026-05-29. <https://www.theregister.com/research/2026/05/29/chatgpt-prompt-injection-turns-web-pages-into-phishing-lures/>

[4] Tenable Research, "HackedGPT: Novel AI Vulnerabilities Open the Door for Private Data Leakage", 2025-11. <https://www.tenable.com/blog/hackedgpt-novel-ai-vulnerabilities-open-the-door-for-private-data-leakage>

[5] Johann Rehberger, "OpenAI Begins Tackling ChatGPT Data Leak Vulnerability", Embrace The Red, 2023-12. <https://embracethered.com/blog/posts/2023/openai-data-exfiltration-first-mitigations-implemented/>

---

© 2026 Dennis Kim (김호광) · 本文档作为独立CTI存档（TLP:GREEN）公开发布。
联系: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
