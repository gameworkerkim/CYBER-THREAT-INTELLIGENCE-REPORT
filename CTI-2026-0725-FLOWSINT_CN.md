---
title: "Flowsint — OSINT 图探索工具评测"
subtitle: "面向网络安全分析师和 OSINT 调查人员的开源 Maltego 替代方案"
description: "对 reconurge 开发的开源 OSINT 图探索工具 Flowsint 的全面评测。涵盖功能、架构、Enricher、竞争格局、安全考量和 CTI 工作流评估。"
abstract: |
  Flowsint 是一个 Apache 2.0 许可的开源 OSINT 图探索平台，已迅速获得 7,400 多个 GitHub 星标。它定位为 Maltego 的开源替代方案，具有本地优先的隐私架构、基于 Docker 的部署以及覆盖域名、IP、电子邮件、加密货币钱包和社交媒体的模块化 Enricher 生态系统。本报告对其能力、安全态势以及 CTI 分析师的运营适配性进行了结构化评测。
date: 2026-07-25
author: "Dennis Kim"
lang: zh
tags:
  - OSINT
  - Open-Source-Tool
  - Graph-Investigation
  - Tool-Review
  - Flowsint
  - Maltego-Alternative
  - Reconnaissance
keywords:
  - Flowsint
  - OSINT
  - 图调查
  - Maltego 替代品
  - 开源工具
  - 网络安全工具
  - Enricher
group: tool-review
featured: false
schema_type: TechArticle
tlp: GREEN
severity: INFO
draft: false
---

| id             | CTI-2026-0725-FLOWSINT                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| 标题            | Flowsint — OSINT 图探索工具评测                                                          |
| 副标题          | 面向网络安全分析师和 OSINT 调查人员的开源 Maltego 替代方案                                |
| 作者            | Dennis Kim (HoKwang Kim)                                                                |
| 邮箱            | <gameworker@gmail.com>                                                                  |
| github         | gameworkerkim                                                                            |
| 日期            | 2026-07-25                                                                               |
| 分类            | TLP:GREEN                                                                                |
| 严重性          | INFO                                                                                     |
| 语言            | zh                                                                                      |
| 标签            | OSINT · Open-Source-Tool · Graph-Investigation · Tool-Review · Flowsint                 |
| 仓库            | [reconurge/flowsint](https://github.com/reconurge/flowsint)                              |
| 星标            | 7,400+                                                                                   |
| 许可证          | Apache 2.0                                                                               |
| 框架            | N/A (工具评测)                                                                           |

# Flowsint — OSINT 图探索工具评测

> **报告 ID** `CTI-2026-0725-FLOWSINT` | **发布日期** 2026-07-25 | **分类** `TLP:GREEN` | **严重性** INFO
> **作者** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)

*面向网络安全分析师和 OSINT 调查人员的开源 Maltego 替代方案*

---

## 目录

1. 项目概述
2. 核心功能与架构
3. Enricher 生态系统
4. 竞争对比
5. 安全考量
6. CTI 工作流运营评估
7. 结论
8. 参考文献

---

## 1. 项目概述

**Flowsint** (`reconurge/flowsint`) 是一个 Apache 2.0 许可的开源 OSINT 图探索工具，专为需要通过可视化图接口映射实体间关系的网络安全分析师、记者和调查人员设计。

| 属性               | 详情                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| 仓库               | [github.com/reconurge/flowsint](https://github.com/reconurge/flowsint) |
| 许可证             | Apache 2.0                                                             |
| GitHub 星标        | 7,400+                                                                 |
| Fork 数            | 935                                                                    |
| 提交数             | 871                                                                    |
| 主要语言           | Python (后端), TypeScript (前端)                                       |
| 开发阶段           | 早期开发 (pre-1.0, 活跃)                                               |
| 网站               | [flowsint.io](https://flowsint.io)                                     |

### 核心原则

- **道德调查**：仅用于合法、道德的 OSINT 和威胁情报研究
- **透明性**：Apache 2.0 许可的完全开源代码库
- **验证**：自动化的 Enricher，可交叉引用多个数据源
- **本地优先隐私**：所有数据默认存储在用户本地机器上

Flowsint 在其 `ETHICS.md` 和 `DISCLAIMER.md` 中明确禁止用于未经授权的监控、人肉搜索 (doxxing)、骚扰或政治操纵。

---

## 2. 核心功能与架构

### 2.1 可视化图探索

主要界面是一个交互式节点-边图可视化。分析师创建实体（域名、IP、个人、组织、电子邮件地址、加密货币钱包），并通过自动化 Enrichment 和手动链接来探索关系。

### 2.2 系统架构

| 组件                | 技术                | 角色                                    |
| ------------------- | ------------------- | --------------------------------------- |
| `flowsint-app`      | TypeScript (Vite)   | 交互式图前端 UI                         |
| `flowsint-api`      | FastAPI (Python)    | REST API、认证、事件流                  |
| `flowsint-core`     | Python              | 编排器、Celery 任务、Vault              |
| `flowsint-enrichers` | Python             | Enricher 模块和扫描逻辑                  |
| `flowsint-types`    | Pydantic             | 数据模型和类型定义                      |
| 数据库 (图)         | Neo4j               | 实体-关系图存储                         |
| 数据库 (关系型)     | PostgreSQL          | 用户账户、配置、元数据                  |
| 缓存 / 队列         | Redis + Celery      | 任务队列和缓存                          |

### 2.3 部署模型

通过 Docker Compose 完全容器化。单条命令部署：

```
git clone https://github.com/reconurge/flowsint.git
cd flowsint
make prod
```

支持 Linux、macOS 和 Windows。团队/服务器部署通过内部前端代理架构开箱即用，仅暴露端口 5173；PostgreSQL、Redis、Neo4j 和 API 绑定到 localhost，仅可通过代理访问。

### 2.4 关键设计决策

| 决策                      | 影响                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| 本地优先存储              | 无云依赖；数据主权得到保障                                               |
| 仅 Docker Compose         | 无裸机安装路径；需要熟悉 Docker                                         |
| Neo4j 作为图数据库        | 通过 Cypher 进行强大的关系查询，但增加学习曲线                           |
| 团队内部代理              | 单端口暴露简化网络连接，生产环境需要 HTTPS                               |
| 模块化单体仓库            | 清晰的关注点分离；Enricher 可独立开发                                    |

---

## 3. Enricher 生态系统

Enricher 是自动化模块，以实体为输入，生成相关实体或元数据。Flowsint 随附了广泛的 Enricher 集合。

### 3.1 域名 Enricher

| Enricher              | 功能                                          |
| --------------------- | --------------------------------------------- |
| Reverse DNS           | 查找指向某个 IP 的域名                        |
| DNS Resolution        | 将域名解析为 IP 地址                          |
| Subdomain Discovery   | 枚举子域名                                    |
| WHOIS Lookup          | 检索域名注册数据                              |
| Domain to Website     | 将域名转换为网站实体                          |
| Domain to Root Domain | 提取根域名                                    |
| Domain to ASN         | 将域名映射到自治系统编号 (ASN)                |
| Domain History        | 检索历史域名数据                              |

### 3.2 IP 与 ASN Enricher

| Enricher       | 功能                                  |
| -------------- | ------------------------------------- |
| IP Information | 地理位置和网络详细信息                |
| IP to ASN      | 将 IP 映射到自治系统 (AS)             |
| ASN to CIDRs   | 检索某个 ASN 的 IP 范围              |
| CIDR to IPs    | 枚举某个范围内的单个 IP               |

### 3.3 身份与联系方式 Enricher

| Enricher                | 功能                                                |
| ----------------------- | --------------------------------------------------- |
| Maigret                 | 在 2,500 多个社交平台上搜索用户名                   |
| Email to Gravatar       | 从电子邮件查找 Gravatar 个人资料                    |
| Email to Breaches       | 将电子邮件与泄露数据库交叉引用                      |
| Email to Domains        | 查找与电子邮件关联的域名                            |
| Phone to Breaches       | 将电话号码与泄露数据库交叉引用                      |
| Individual to Org       | 查找组织隶属关系                                    |
| Individual to Domains   | 查找与个人关联的域名                                |

### 3.4 组织与基础设施 Enricher

| Enricher                 | 功能                                      |
| ------------------------ | ----------------------------------------- |
| Organization to ASN      | 查找组织拥有的 ASN                        |
| Organization Information | 检索公司注册详细信息                      |
| Organization to Domains  | 查找组织拥有的域名                        |

### 3.5 加密货币 Enricher

| Enricher               | 功能                              |
| ---------------------- | --------------------------------- |
| Wallet to Transactions | 检索交易历史                      |
| Wallet to NFTs         | 识别钱包持有的 NFT                |

### 3.6 网站 Enricher

| Enricher              | 功能                                    |
| --------------------- | --------------------------------------- |
| Website Crawler       | 爬取并映射网站结构                      |
| Website to Links      | 提取所有外部链接                        |
| Website to Domain     | 从 URL 提取域名                         |
| Website to Webtrackers | 识别追踪/分析脚本                      |
| Website to Text       | 提取纯文本内容                          |

### 3.7 集成 Enricher

| Enricher        | 功能                                          |
| --------------- | --------------------------------------------- |
| N8n Connector   | 将 Flowsint 连接到 N8n 自动化工作流            |

---

## 4. 竞争对比

### 4.1 直接对比

| 工具              | 许可证            | 类型             | 与 Flowsint 的主要差异                                         |
| ----------------- | ----------------- | ---------------- | --------------------------------------------------------------- |
| **Maltego**       | 商业 (Freemium)   | 图 OSINT         | 行业标准，成熟的 Transform 库，付费层级                        |
| **SpiderFoot**    | GPL-3.0           | 自动化扫描       | 200 多个 OSINT 源，CLI 优先，更强的自动化能力                  |
| **Recon-ng**      | MIT               | CLI 框架         | Metasploit 风格模块化侦察，纯终端操作                           |
| **SpectraGraph**  | 开源              | 图工作室         | 交互式图工作区，类似的可视化方法                                |
| **PANO**          | 开源              | 图 + AI          | 时间线视图 + 超出 Flowsint 范围的 AI 辅助                       |
| **Helix**         | 开源              | 身份图           | D3.js 实时关系图，以身份映射为核心                              |
| **Flowintel**     | 开源              | 案例管理         | 调查案例/协作管理，而非探索                                    |

### 4.2 Flowsint 的定位

Flowsint 占据了一个独特的细分领域：

- **Maltego 替代方案**：最常被引述为 Maltego 基于图的 OSINT 工作流的开源替代品
- **可视化优先**：与 SpiderFoot 和 Recon-ng（CLI 为中心）不同，Flowsint 优先考虑交互式可视化探索
- **本地隐私**：大多数竞品要么需要云账户，要么会回传遥测数据
- **Reconurge 生态系统**：与兄弟工具（Recontrack, Reconcrawl）紧密集成
- **平衡方法**：将自动化 Enricher 与手动图操作相结合

---

## 5. 安全考量

### 5.1 已报告的漏洞

Flowsint 处于早期开发阶段，已有多项 CVE 被报告。分析师在将其部署到敏感环境之前应评估自身的风险承受能力。

| CVE ID              | 类型                        | 描述                                                                      | 状态            |
| -------------------- | --------------------------- | ------------------------------------------------------------------------ | --------------- |
| CVE-2026-32311       | OS 命令注入                 | `org_to_asn` Enricher 易受通过构造输入的命令注入攻击                     | 已报告          |
| CVE-2026-44352       | 访问控制                    | 用户可查看其他用户的草图日志 (pre-v1.2.3)                                | 1.2.3 中已修复  |
| CVE-2026-42156       | Cypher 查询注入             | 通过未净化的实体输入进行图查询注入                                       | 已报告          |

### 5.2 运营安全建议

1. **网络隔离**：在隔离的 VLAN 或专用分析 VM 中部署
2. **不要暴露到公网**：内部代理架构专为 LAN/可信网络使用而设计。如需要公网访问，请在前方放置带 HTTPS 终止的反向代理
3. **轮换默认密钥**：`.env` 文件中的 `AUTH_SECRET`、`MASTER_VAULT_KEY_V1` 和 `NEO4J_PASSWORD` 附带占位值。在任何部署之前生成唯一值
4. **监控更新**：跟踪 [CHANGELOG.md](https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md) 和 GitHub Security Advisories 以获取补丁
5. **生产就绪状态**：在当前开发阶段，Flowsint 最适合用于研究和测试环境，而非生产级分析师工作流

### 5.3 供应链风险

- 来自多名贡献者的 871 次提交；无单一供应商锁定
- Docker 镜像从 GitHub Container Registry (`ghcr.io`) 拉取；尽可能验证镜像签名
- Python 依赖链通过 `uv`/`pyproject.toml` 管理；部署前使用 `pip-audit` 或类似工具进行审计

---

## 6. CTI 工作流运营评估

### 6.1 Flowsint 适用的环节

| CTI 工作流阶段            | Flowsint 的实用性                                      | 评级        |
| ------------------------- | ------------------------------------------------------- | ----------- |
| 初始侦察                   | 域名/IP/ASN Enricher 提供快速映射                       | 高          |
| 实体归属                   | Maigret、电子邮件-泄露匹配、钱包追踪                    | 中-高       |
| 基础设施映射               | ASN-to-CIDRs、反向 DNS、子域名发现                      | 高          |
| 关系发现                   | 使用 Neo4j Cypher 查询进行图可视化                       | 高          |
| 报告生成                   | 截图/导出图；无内置报告模板                              | 低-中       |
| 团队协作                   | 服务器部署支持多用户；暂无 RBAC                          | 中          |
| 证据保全                   | 本地存储；无内置监管链功能                               | 低          |

### 6.2 推荐用例

- 从单个指标映射攻击者基础设施（域名、IP、ASN）
- 在勒索软件/APT 调查中追踪加密货币钱包关系
- 跨泄露数据库和社交平台交叉引用电子邮件地址和用户名
- 为供应链风险评估构建组织关联图

### 6.3 生产级 CTI 的局限性

- 没有用于向 SIEM/SOAR 平台以编程方式导出图的 API
- 没有内置的 IoC 共享格式（尚不支持 STIX/MISP 导出）
- 早期阶段的稳定性——版本间可能存在破坏性变更
- 文档不完整；仅通过 Discord 提供社区支持

---

## 7. 结论

Flowsint 是一个前景广阔的开源 OSINT 图探索工具，作为 Maltego 替代方案已迅速获得社区关注（7,400 多个星标）。其本地优先的隐私架构、广泛的 Enricher 生态系统以及基于 Docker 的部署使其对个人分析师和小型团队都非常易用。

**优势**：可视化图探索、模块化 Enricher 架构、零云依赖、Apache 2.0 许可、覆盖域名/IP/电子邮件/加密货币/社交媒体的 Enricher 生态系统。

**劣势**：早期开发阶段（pre-1.0）、存在需要监控的已记录 CVE、无 STIX/MISP 导出、仅支持 Docker 部署、文档不完整。

**结论**：适用于 CTI 研究和实验环境。在未进行额外安全加固和隔离之前，尚不推荐用于生产级分析师流水线。该项目的发展轨迹（871 次提交、活跃的社区、快速的星标增长）值得持续关注——它有潜力成为开源 OSINT 工具包中的标准工具。

> **免责声明**：Flowsint 仅设计用于合法、道德的调查和研究目的。未经授权的监控、人肉搜索、骚扰或任何非法使用均受项目 ETHICS.md 指南的禁止。

---

## 8. 参考文献

[1] reconurge/flowsint -- GitHub 仓库. <https://github.com/reconurge/flowsint>

[2] Flowsint 官方网站. <https://flowsint.io>

[3] Flowsint ETHICS.md. <https://github.com/reconurge/flowsint/blob/main/ETHICS.md>

[4] Flowsint DISCLAIMER.md. <https://github.com/reconurge/flowsint/blob/main/DISCLAIMER.md>

[5] Flowsint CHANGELOG.md. <https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md>

[6] Maltego -- 商业 OSINT 图平台. <https://www.maltego.com>

[7] SpiderFoot -- 开源 OSINT 自动化. <https://github.com/smicallef/spiderfoot>

[8] Recon-ng -- Web 侦察框架. <https://github.com/lanmaster53/recon-ng>

---

(c) 2026 Dennis Kim (HoKwang Kim) | 独立 CTI 档案 (TLP:GREEN)
联系方式: <gameworker@gmail.com> | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
