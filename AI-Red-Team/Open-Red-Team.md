# Open AI Red Team

**Open AI Red Team** is a model-agnostic offensive security skillset and middleware — the replacement and extension of
[claude-red](https://github.com/SnailSploit/Claude-Red) (MIT) for **DeepSeek, GLM, and open-weight models**.

- Implementation: [`open-red-team/`](open-red-team/)
- Design & architecture: [`open-red-team/docs/architecture.md`](open-red-team/docs/architecture.md)
- Documentation languages: English (base) · 한국어 · 日本語 · 中文

## Goals

1. Port the Claude-only skillset to any OpenAI-compatible model (DeepSeek, GLM/Zhipu, Ollama/vLLM/LM Studio).
2. Reproduce the Claude Skills system (progressive disclosure + trigger-based on-demand loading) as middleware.
3. Enable on-prem/air-gapped operation for public institutions, financial institutions, and enterprises —
   internal information protection and cost reduction.

## Status — full claude-red library ported (79 skills, 23 categories)

| Category | Skills | Category | Skills |
|----------|-------:|----------|-------:|
| Web Application | 16 | Fuzzing & Vuln Research | 4 |
| Infrastructure & Red Team | 7 | Reconnaissance | 2 |
| API Security | 2 | Container & Kubernetes | 2 |
| Cloud | 1 | CI/CD & Pipeline | 2 |
| AI Security | 1 | Cryptography | 2 |
| Active Directory | 2 | Privilege Escalation | 2 |
| Auth & Identity | 2 | Post-Exploitation | 3 |
| Wireless | 14 | Forensics & C2 | 2 |
| Mobile | 1 | Supply Chain | 2 |
| IoT & Embedded | 1 | Social Engineering | 2 |
| Exploit Development | 6 | Network Attacks | 1 |
| Utility | 2 | **Total** | **79** |

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
