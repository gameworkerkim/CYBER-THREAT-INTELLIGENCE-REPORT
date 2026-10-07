# Heimdallr (헤임달)

> ARTEX 컨셉을 계승한 **LLM 멀티 에이전트 자율 모의 침투 테스트 + 사이버 보안 지식 축적** 시스템
> Node.js + Neon + Cloudflare 프리티어 · 방어 중심 · 권한 검증 기반

---

> ## 🚨 보안·오남용 경고
>
> Heimdallr 는 LLM 이 스스로 정찰·침투·자료 반출까지 수행할 수 있는 강력한 자율 공격 도구입니다. **자신이 소유하거나 서면으로 명시적 허가를 받은 대상에 대해서만, 방어·탐지 역량을 기르는 목적으로** 사용하십시오. 허가 없는 사용은 정보통신망법·개인정보보호법 위반 등 범죄가 됩니다. **모든 법적 책임과 결과는 사용자 본인이 부담합니다.**

---

## 문서 목차

| 문서 | 설명 | 언어 |
|---|---|---|
| [concept_KR.md](concept_KR.md) | 기본 컨셉 (한국어) | 🇰🇷 |
| [concept_EN.md](concept_EN.md) | Core Concept (English) | 🇺🇸 |
| [concept_CN.md](concept_CN.md) | 核心概念 (中文) | 🇨🇳 |
| [concept_JP.md](concept_JP.md) | 基本コンセプト (日本語) | 🇯🇵 |
| [differentiation.md](differentiation.md) | 차별화 요소 | 🇰🇷 |
| [dashboard.md](dashboard.md) | 대시보드 개발 설계 | 🇰🇷 |
| [cybersecurity-wiki.md](cybersecurity-wiki.md) | CyberSecurityWiki 설계 | 🇰🇷 |
| [roadmap.md](roadmap.md) | 개발 로드맵 | 🇰🇷 |

---

## 한 줄 요약

> **"자율 AI 침투를 '검증된 소유자에게만' 허락하고, 그 결과를 '재사용 가능한 방어 지식'으로 환원하는 Cloudflare 프리티어 SaaS."**

## 핵심 특징

- **BYOK 대시보드** — 사용자가 자신의 LLM 키를 넣고 브라우저에서 바로 사용 (키는 암호화 저장, 플랫폼 미소유).
- **도메인 소유권 검증** — 서브 디렉터리 난독화 토큰 + 도메인 기반 이메일 + **24시간 한정** 권한.
- **LLM 멀티 에이전트** — ARTEX 의 planner/worker 구조를 Node.js 로 재구현.
- **CyberSecurityWiki** — 해킹 기법·탐지 규칙·하드닝을 축적해 `llms.txt`/MCP/REST 로 외부 LLM 이 참조.
- **다국어** — 한국어·영어·중국어·일본어.
- **보고서 내보내기** — 마크다운/PDF/CSV (방어자용 탐지 규칙 포함).

## 원본 참고

- ARTEX 원본: [Autumn-27/ARTEX](https://github.com/Autumn-27/ARTEX)
- ARTEX 한국어판: [jiwoochris/artex-ko](https://github.com/jiwoochris/artex-ko)
