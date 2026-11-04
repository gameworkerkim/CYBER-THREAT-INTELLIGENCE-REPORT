# Open Red Team

**모델 비종속(Model-Agnostic) 공격적 보안 스킬셋 + 미들웨어 — DeepSeek, GLM, 오픈웨이트 모델용**

Claude 전용 스킬 라이브러리 [claude-red](https://github.com/SnailSploit/Claude-Red) (MIT)를 포팅하여
DeepSeek, GLM(Zhipu), 오픈웨이트 모델(Ollama/vLLM/LM Studio)에서 동일한 레드팀 스킬을 사용할 수 있게 하는 프로젝트입니다.

## 구성 요소

| 디렉토리 | 내용 |
|----------|------|
| `skills/` | 포팅된 스킬 (모델 비종속 `SKILL.md`) — 트리거 기반 온디맨드 로딩 |
| `src/` | 미들웨어 — Provider 추상화(OpenAI 호환), 스킬 로더, 트리거 엔진, CLI |
| `docs/` | 아키텍처, 포팅 가이드, 모델 호환 매트릭스, 로드맵 |
| `scripts/` | 스킬 동기화/변환 도구 |

## 포팅 현황

포팅 순서: Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security

| 카테고리 | 스킬 수 | 상태 |
|----------|---------|------|
| Web Application | 16 | 완료 |
| Infrastructure & Red Team | 7 | 완료 |
| API Security | 2 | 완료 |
| Cloud | 1 | 완료 |
| AI Security | 1 | 완료 |
| **합계** | **27** | — |

## 빠른 시작

```bash
npm install
npm run build
cp .env.example .env   # API 키 설정
npx ort chat            # 대화형 세션
```

### 지원 프로바이더

| 프로바이더 | 엔드포인트 | 모델 예시 |
|-----------|-----------|----------|
| `deepseek` | `https://api.deepseek.com/v1` (OpenAI 호환) | `deepseek-chat`, `deepseek-reasoner` |
| `glm` | `https://open.bigmodel.cn/api/paas/v4` (OpenAI 호환) | `glm-4-plus`, `glm-4-flash` |
| `openweight` | Ollama/vLLM/LM Studio 등 (OpenAI 호환 `/v1`) | `qwen2.5:32b`, `deepseek-r1:32b` 등 |

## 사용법

### CLI

```bash
# 대화형 세션 (트리거 기반 스킬 자동 로딩)
npx ort chat --provider deepseek --model deepseek-chat

# 특정 스킬 강제 로딩
npx ort chat --skills offensive-sqli --provider glm

# 스킬 목록 출력
npx ort skills list

# 스킬 본문 출력
npx ort skills show offensive-sqli

# 1회성 질의
npx ort ask "이 로그인 폼에서 SQLi 테스트 방법" --provider deepseek
```

### 라이브러리

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
});

const reply = await ort.chat("SQL 인젝션 테스트 방법을 알려줘");
console.log(reply);
```

## 동작 원리

1. **스킬 인덱스 주입** — 모든 스킬의 `name` + `description`을 시스템 프롬프트에 주입 (Claude Skills의 progressive disclosure 재현, 컨텍스트 비용 최소화)
2. **트리거 매칭** — 사용자 입력을 각 스킬의 `triggers`(키워드/정규식)와 매칭, 상위 N개 스킬 본문을 시스템 프롬프트에 주입
3. **모델 호출** — OpenAI 호환 API를 통해 선택된 프로바이더로 요청

## 문서

- [아키텍처](docs/architecture.md) — 미들웨어 설계 및 데이터 흐름
- [포팅 가이드](docs/porting-guide.md) — Claude 스킬 → 모델 비종속 스킬 변환 규칙
- [모델 호환 매트릭스](docs/model-matrix.md) — DeepSeek/GLM/오픈웨이트별 특성과 제약
- [로드맵](docs/roadmap.md) — 카테고리별 포팅 진행 계획

## 라이선스

MIT. 원본 스킬: [SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red) (MIT) — 각 스킬 frontmatter의 `source` 필드에 출처 명시.

> 허가된 환경(authorized penetration testing, 버그바운티, 보안 연구, CTF)에서만 사용하십시오.
