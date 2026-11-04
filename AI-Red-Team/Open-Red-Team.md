# Open Red Team

**Open Red Team** is a model-agnostic offensive security skillset and middleware that ports the
[claude-red](https://github.com/SnailSploit/Claude-Red) skill library (MIT) to **DeepSeek, GLM, and open-weight models**.

- Implementation: [`open-red-team/`](open-red-team/)
- Design & architecture: [`open-red-team/docs/architecture.md`](open-red-team/docs/architecture.md)

## Goals

1. Port the Claude-only skillset to any OpenAI-compatible model (DeepSeek, GLM/Zhipu, Ollama/vLLM/LM Studio).
2. Reproduce the Claude Skills system (progressive disclosure + trigger-based on-demand loading) as middleware.
3. Port order: **Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security** (all complete).

## Status

| Category | Skills | Status |
|----------|--------|--------|
| Web Application | 16 | ✅ |
| Infrastructure & Red Team | 7 | ✅ |
| API Security | 2 | ✅ |
| Cloud | 1 | ✅ |
| AI Security | 1 | ✅ |
| **Total** | **27** | — |

## Quickstart

```bash
cd open-red-team
npm install
cp .env.example .env   # set provider API keys
npx ort chat            # interactive session
```

## License

MIT. Original skills: [SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red) (MIT).
For authorized security testing only.
