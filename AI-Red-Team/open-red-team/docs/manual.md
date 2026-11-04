# Open AI Red Team — User Manual

**Languages:** English (base) · [한국어](ko/manual.md) · [日本語](ja/manual.md) · [中文](zh/manual.md)

## 1. Installation

Requirements: Node.js ≥ 18.18, npm.

```bash
git clone <this-repository>
cd open-red-team
npm install
npm run build
cp .env.example .env
```

## 2. Configuration

Edit `.env` — all settings are environment variables.

| Variable | Default | Description |
|----------|---------|-------------|
| `ORT_PROVIDER` | `deepseek` | Default provider: `deepseek` \| `glm` \| `openweight` |
| `ORT_SKILLS_DIR` | `./skills` | Directory containing ported skills |
| `ORT_AUTO_LOAD` | `on` | Trigger-based automatic skill loading |
| `ORT_MAX_SKILLS` | `3` | Max skills auto-loaded per turn |
| `ORT_INCLUDE_INDEX` | `on` | Include skill descriptions in system prompt |
| `DEEPSEEK_API_KEY` | — | DeepSeek API key |
| `DEEPSEEK_MODEL` | `deepseek-chat` | DeepSeek model |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeek endpoint |
| `GLM_API_KEY` | — | Zhipu BigModel API key |
| `GLM_MODEL` | `glm-4-plus` | GLM model |
| `GLM_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` | GLM endpoint |
| `OPENWEIGHT_BASE_URL` | `http://localhost:11434/v1` | Ollama/vLLM/LM Studio endpoint |
| `OPENWEIGHT_MODEL` | `qwen2.5:32b` | Local model name |
| `OPENWEIGHT_API_KEY` | `ollama` | Dummy key (Ollama ignores it) |

## 3. Providers

### DeepSeek

```bash
# platform.deepseek.com → API Keys
export DEEPSEEK_API_KEY=sk-...
npx ort chat --provider deepseek
```

### GLM (Zhipu BigModel)

```bash
# open.bigmodel.cn → API Keys
export GLM_API_KEY=...
npx ort chat --provider glm --model glm-4-flash
```

### Open-weight (Ollama)

```bash
ollama pull qwen2.5:32b
ollama serve
# OPENWEIGHT_BASE_URL=http://localhost:11434/v1 (default)
npx ort chat --provider openweight --model qwen2.5:32b
```

### vLLM / LM Studio

Any OpenAI-compatible server works — point `OPENWEIGHT_BASE_URL` at its `/v1` endpoint.

## 4. CLI Reference

### `ort chat` — interactive session

```
npx ort chat [--provider <p>] [--model <m>] [--skills <s1,s2>]

In-session commands:
  /skills        list all skills
  /reset         clear conversation history
  /exit          quit
In-message directives:
  /use <skill>   force-load a skill for the current turn
```

### `ort ask` — single-turn query

```
npx ort ask "How do I test for SQL injection?" --provider deepseek
```

### `ort skills` — skill inspection

```
npx ort skills list             # all skills (name, category, description)
npx ort skills show <name>      # full skill body
```

## 5. Library API

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",          // or "glm" | "openweight"
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
  autoLoad: true,                // trigger-based loading
  maxSkills: 3,
  includeIndex: true,
});

await ort.init();                // load skills from disk
ort.listSkills();                // [{frontmatter, body, path}]

const result = await ort.chat("SQL 인젝션 테스트 방법", {
  skills: ["offensive-sqli"],    // force-load
  onDelta: (d) => process.stdout.write(d),  // streaming
});
// result: { content, matchedSkills, provider, model }

ort.reset();                     // clear history
```

## 6. Skill System

Each skill is a `SKILL.md` with extended frontmatter:

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sql 인젝션"
category: web
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---
```

- **Progressive disclosure** — only descriptions stay in the system prompt (index);
  full skill bodies load when triggers match.
- **Triggers** — keywords (English + Korean) and `/regex/` patterns.
- **Explicit loading** — `/use offensive-sqli` in a message or `--skills` flag.

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `401` / auth error | Check the API key env var for your provider |
| Skills not loading | Verify `ORT_SKILLS_DIR`; run `npx ort skills list` |
| No skill matched | Use `/use <skill>` or add keywords to the skill's `triggers` |
| Small local model ignores skills | `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off`, use ≥ 32B models |
| Ollama context overflow | Increase `num_ctx` in Ollama settings |

## 8. Security & Ethics

- Skills describe offensive methodology for **authorized testing only**.
- Never run against systems without written permission.
- For practice, use labs: PortSwigger Web Security Academy, DVWA, HackTheBox, TryHackMe.
