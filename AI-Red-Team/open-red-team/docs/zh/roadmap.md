# 路线图

**语言:** [English](../roadmap.md)（基准） · [한국어](roadmap.md) · [日本語](roadmap.md) · 中文（本文档）

## 移植状态 — 全部完成

移植顺序：**Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**，
随后扩展至 claude-red 其余类别。23 个类别、79 个技能全部移植完成。

| 阶段 | 类别 | 技能数 | 状态 |
|------|------|-------:|------|
| 1 | Web Application | 16 | ✅ |
| 2 | Infrastructure & Red Team | 7 | ✅ |
| 3 | API Security | 2 | ✅ |
| 4 | Cloud | 1 | ✅ |
| 5 | AI Security | 1 | ✅ |
| 6 | Active Directory | 2 | ✅ |
| 7 | Auth & Identity | 2 | ✅ |
| 8 | Wireless | 14 | ✅ |
| 9 | Mobile | 1 | ✅ |
| 10 | IoT & Embedded | 1 | ✅ |
| 11 | Exploit Development | 6 | ✅ |
| 12 | Fuzzing & Vuln Research | 4 | ✅ |
| 13 | Reconnaissance | 2 | ✅ |
| 14 | Container & Kubernetes | 2 | ✅ |
| 15 | CI/CD & Pipeline | 2 | ✅ |
| 16 | Cryptography | 2 | ✅ |
| 17 | Privilege Escalation | 2 | ✅ |
| 18 | Post-Exploitation | 3 | ✅ |
| 19 | Forensics & C2 | 2 | ✅ |
| 20 | Supply Chain | 2 | ✅ |
| 21 | Social Engineering | 2 | ✅ |
| 22 | Network Attacks | 1 | ✅ |
| 23 | Utility | 2 | ✅ |
| — | **合计** | **79** | ✅ |

## 中间件路线图

- [x] OpenAI 兼容提供商抽象（DeepSeek/GLM/Ollama）
- [x] 技能加载器 + frontmatter 解析
- [x] 触发器引擎（关键词/正则、打分；英/韩关键词）
- [x] 渐进式披露（索引常驻 + 正文按需）
- [x] CLI（`ort chat / ask / skills`）
- [x] 多语言文档（EN 基准 / KO / JA / ZH）
- [ ] Ollama `num_ctx` 自动扩展
- [ ] 基于嵌入的语义匹配（RAG）— 关键词匹配的替代选项
- [ ] 多轮工具执行循环（Kali 集成）
