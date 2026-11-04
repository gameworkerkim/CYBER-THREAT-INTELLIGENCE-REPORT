# 合规控制

**语言:** [English](../compliance.md)（基准） · [한국어](compliance.md) · [日本語](compliance.md) · 中文（本文档）

此表区分**本系统在代码中强制实施的控制**与**操作员/组织仍需自行承担的责任**。
Open AI Red Team 是面向授权任务的方法论注入中间件，其本身并不是 ISMS-P、金融安全规范、
PCI-DSS 或 NIST 的合规认证。

## 代码强制实施的控制

| 控制 ID | 功能 | 强制点 |
|---------|------|--------|
| SCOPE-1 | 范围外主机/IP 在**任何模型调用之前**被拒绝 | `src/safety.ts` + `src/index.ts`（`decision: deny`，调用 0 次） |
| SCOPE-2 | 已申报任务范围注入系统提示词并记录到审计/追踪 | `ORT_SCOPE` / `ORT_SCOPE_DOMAINS` |
| SCOPE-3 | 未声明范围时面板拒绝启动 | 实验室模式需 `ORT_SCOPE_MODE=open` |
| AUTH-1 | 面板 API 默认上锁：静态令牌或 OIDC 必填 | 无认证则 exit 1（`ORT_ALLOW_ANONYMOUS=1` 例外） |
| AUTH-2 | OIDC（Keycloak）RS256/JWKS 校验，会话绑定令牌 `sub` | `src/dashboard/oidc.ts`、`X-Ort-Session` |
| AUTH-3 | `/metrics` 需要认证（`ORT_METRICS_TOKEN` 或面板认证） | `src/dashboard/server.ts` |
| SESS-1 | 按操作员隔离对话（内存会话、LRU 上限、空闲淘汰） | `src/sessions.ts` |
| AUDIT-1 | JSONL 审计：ts、sessionId、operator、decision、flaggedTargets、matchedSkills、提示词 SHA-256（不存原文） | `ORT_AUDIT_LOG` |
| AUDIT-2 | `ORT_AUDIT_REQUIRED=1` 时审计写入失败即请求失败 | `src/dashboard/server.ts` |
| BUDGET-1 | 上下文预算：技能正文截断、历史裁剪、超大技能 `index_only` | `src/skills/inject.ts`、`src/index.ts` |
| OBS-1 | Prometheus 指标（请求、延迟、token、RSS） | `/metrics` |
| OBS-2 | LangFuse 追踪 — **默认关闭**；启用后提示词与响应全文将发送至 LangFuse | `LANGFUSE_*` |

## 操作员/组织责任（不在代码中）

| 控制 ID | 责任 | 对象 |
|---------|------|------|
| ORG-1 | 网络隔离（망분리）、传输区恶意代码检查、离线介质管理 | 组织 |
| ORG-2 | Keycloak 账户开通与 RBAC 策略、操作员身份管理 | 组织 |
| ORG-3 | 密钥保管：API 密钥、Keycloak/DB 密码、签名密钥（Cosign）、密钥轮换 | 组织 |
| ORG-4 | 审计日志保留期限、受保护存储与审查流程 | 组织 |
| ORG-5 | Harbor 镜像扫描/签名门禁（Trivy 适配器、Cosign 策略） | 组织 |
| ORG-6 | 任务授权记录（交战规则、范围签署） | 操作员 |
| ORG-7 | 转入 GGUF/HF 模型的来源与许可证审查 | 组织 |

## 映射说明（信息性）

- **ISMS-P / 金融安全规范**：AUDIT-*、AUTH-*、ORG-1..5 为访问控制与日志义务提供技术支撑，
  但取得认证仍需组织自身的流程。
- **PCI-DSS**：本产品不处理卡数据；相关测试方法论存在于技能中（如 V5.3.4 引用）。
- **NIST**：技能内的 MITRE ATT&CK 技法映射为参考；产品本身仅实现第一张表中的控制。

第一张表中**未列出的控制一律视为操作员责任**，请勿声称本产品满足之。
