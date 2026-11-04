# 路线图

**语言:** [English](../roadmap.md)（基准） · [한국어](roadmap.md) · [日本語](roadmap.md) · 中文（本文档）

## 移植状态 — 全部完成

移植顺序：**Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**，
随后扩展至 claude-red 其余类别。23 个类别、79 个技能全部移植完成。

| 阶段 | 类别 | 技能数 | 状态 |
|------|------|-------:|------|
| 1 | Web Application | 16 |  |
| 2 | Infrastructure & Red Team | 7 |  |
| 3 | API Security | 2 |  |
| 4 | Cloud | 1 |  |
| 5 | AI Security | 1 |  |
| 6 | Active Directory | 2 |  |
| 7 | Auth & Identity | 2 |  |
| 8 | Wireless | 14 |  |
| 9 | Mobile | 1 |  |
| 10 | IoT & Embedded | 1 |  |
| 11 | Exploit Development | 6 |  |
| 12 | Fuzzing & Vuln Research | 4 |  |
| 13 | Reconnaissance | 2 |  |
| 14 | Container & Kubernetes | 2 |  |
| 15 | CI/CD & Pipeline | 2 |  |
| 16 | Cryptography | 2 |  |
| 17 | Privilege Escalation | 2 |  |
| 18 | Post-Exploitation | 3 |  |
| 19 | Forensics & C2 | 2 |  |
| 20 | Supply Chain | 2 |  |
| 21 | Social Engineering | 2 |  |
| 22 | Network Attacks | 1 |  |
| 23 | Utility | 2 |  |
| — | **合计** | **79** |  |

## 中间件路线图

- [x] OpenAI 兼容提供商抽象（DeepSeek/GLM/Ollama）
- [x] 技能加载器 + frontmatter 解析
- [x] 触发器引擎（关键词/正则、打分；英/韩关键词）
- [x] 渐进式披露（索引常驻 + 正文按需）
- [x] CLI（`ort chat / ask / skills`）
- [x] Web 面板（会话、审计、OIDC、指标）
- [x] 令牌预算引擎（上下文上限、按节截断、index_only）+ 历史轮次预算
- [x] 按操作员隔离会话（SessionStore、X-Ort-Session、OIDC sub 归属）
- [x] 范围护栏（调用前拒绝）+ fail-closed 启动（exit 1）
- [x] 本地账户（SQLite）：admin/admin 强制改密、HMAC 令牌
- [x] 面板运行时设置（范围/预算/引擎即时生效，admin 角色）
- [x] 流式回退 + reasoning_content 捕获，LangFuse·Prometheus·JSONL 审计（SHA-256）
- [x] 部署与运营：base/infra compose 拆分、ollama-pull·vllm-preflight 门禁、必需密钥、
      Keycloak realm、Grafana 仪表盘、离线转入（skopeo/crane）、Trivy SBOM + Cosign
- [x] 测试 73 项 + 检索质量基准 + CI（typecheck/build/test/docker build/扫描）
- [x] 多语言文档（EN 基准 / KO / JA / ZH）+ 合规控制表
- [ ] Ollama `num_ctx` 自动扩展
- [ ] 基于嵌入的语义匹配（RAG）— 关键词匹配的替代选项
- [x] 多轮工具执行循环（Kali 集成）— **blocked**：不在本版本范围内。Open AI Red Team 是将授权任务的
  方法论注入模型上下文的中间件，不会在主机上执行命令。仅在 P0 控制（范围拒绝·会话隔离·历史预算·
  fail-closed 认证）稳定后才重新评估。

## 版本历史

| 版本 | 内容 |
|------|------|
| 0.1.0 | 中间件 + 首批 27 个技能、提供商抽象、CLI、文档 |
| 0.2.0 | claude-red 全量移植（79 技能/23 类别）、多语言文档、用户手册 |
| 0.3.0 | 更名为 Open AI Red Team |
| 0.4.0 | 令牌预算、测试 30 项、范围护栏、LangFuse/OIDC/指标、部署工具 |
| 0.5.0 | P0 加固：范围拒绝（0 调用）、会话隔离、历史预算、fail-closed、PoC compose、必需密钥、测试 63 项、检索基准、合规文档 |
| 0.6.0 | SQLite 本地账户（admin/admin 强制改密）、面板 Settings 页、路线图/文档更新 |
