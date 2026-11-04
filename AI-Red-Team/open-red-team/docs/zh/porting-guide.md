# 移植指南

**语言:** [English](../porting-guide.md)（基准） · [한국어](porting-guide.md) · [日本語](porting-guide.md) · 中文（本文档）

将 claude-red 技能（SKILL.md）移植为模型无关技能的规则与流程。

## 移植顺序

```
Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security
       ↓ （全库扩展）
Active Directory → Auth & Identity → Wireless → Mobile → IoT & Embedded →
Exploit Development → Fuzzing & Vuln Research → Reconnaissance →
Container & Kubernetes → CI/CD & Pipeline → Cryptography →
Privilege Escalation → Post-Exploitation → Forensics & C2 →
Supply Chain → Social Engineering → Network Attacks → Utility
```

23 个类别（79 个技能）全部完成。

## 转换规则

### 1. 扩展 Frontmatter

保留原始 frontmatter（`name`、`description`），并添加以下字段。

| 添加字段 | 规则 |
|----------|------|
| `triggers` | 触发技能的 6–14 个关键词。小写，包含同义词/工具名/攻击名（英/韩）。正则使用 `/.../` 形式 |
| `category` | 移植类别（与原始目录一致） |
| `model_note` | （可选）模型相关注意事项 |
| `source` | `https://github.com/SnailSploit/Claude-Red (MIT)` |

### 2. 移除 Claude 依赖

- "Claude Code"、"Claude.ai"、"claude-skills.json"、"Claude Skills 系统" → 模型中立措辞
- 例如：`cat SKILL.md | claude --system-file -` → 中间件 `--skills` 参数用法
- Anthropic API/模型名引用 → 以 OpenAI 兼容提供商为基准泛化

### 3. 保留正文（Markdown）

- 攻击方法论正文原样保留（技术内容与模型无关）
- 工具命令保留（Kali/安全工具与平台无关）
- 提示词载荷部分保留（攻击目标是*被测系统*，而非操作模型）

### 4. 旧格式处理

部分上游技能没有 YAML frontmatter，而是使用 `# SKILL:`、`## Metadata`、`## Description`、
`## Trigger Phrases`、`## Instructions for Claude` 章节。
`scripts/fetch-skills.ts` 会检测两种格式并转换：

- `## Description` → frontmatter 的 `description`
- `## Metadata` / `## Trigger Phrases` → 删除（由生成的 frontmatter 替代）
- `## Instructions for Claude` → `## Instructions`

### 5. 验证清单

- [ ] 有效的 YAML frontmatter（name/description/triggers/category）
- [ ] 每个技能至少 6 个触发器关键词
- [ ] 正文中无 Claude 特有措辞（`grep -ri claude` — 仅允许 `source` 字段）
- [ ] `description` ≤ 200 字符（索引注入成本）

## 自动化

```bash
# 从上游 claude-red 全量获取并转换 79 个技能
npm run fetch:skills
```

`scripts/fetch-skills.ts` 的处理流程：

1. 从 GitHub raw 下载每个 SKILL.md
2. 解析 frontmatter → 自动生成 `triggers`/`category`/`source`
3. 替换正文中的 Claude 特有措辞（正则规则表）
4. 保存到 `skills/<category>/<name>/SKILL.md`
