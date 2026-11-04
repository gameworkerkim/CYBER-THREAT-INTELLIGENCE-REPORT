# Open Red Team — 사용 매뉴얼

**언어:** [English](../manual.md)(기준) · 한국어(본 문서) · [日本語](manual.md) · [中文](manual.md)

## 1. 설치

요구사항: Node.js ≥ 18.18, npm.

```bash
git clone <이-저장소>
cd open-red-team
npm install
npm run build
cp .env.example .env
```

## 2. 설정

`.env` 파일을 편집합니다 — 모든 설정은 환경변수입니다.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `ORT_PROVIDER` | `deepseek` | 기본 프로바이더: `deepseek` \| `glm` \| `openweight` |
| `ORT_SKILLS_DIR` | `./skills` | 포팅된 스킬이 있는 디렉토리 |
| `ORT_AUTO_LOAD` | `on` | 트리거 기반 스킬 자동 로딩 |
| `ORT_MAX_SKILLS` | `3` | 턴당 자동 로딩 최대 스킬 수 |
| `ORT_INCLUDE_INDEX` | `on` | 시스템 프롬프트에 스킬 설명(인덱스) 포함 |
| `DEEPSEEK_API_KEY` | — | DeepSeek API 키 |
| `DEEPSEEK_MODEL` | `deepseek-chat` | DeepSeek 모델 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | DeepSeek 엔드포인트 |
| `GLM_API_KEY` | — | 즈푸 빅모델 API 키 |
| `GLM_MODEL` | `glm-4-plus` | GLM 모델 |
| `GLM_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` | GLM 엔드포인트 |
| `OPENWEIGHT_BASE_URL` | `http://localhost:11434/v1` | Ollama/vLLM/LM Studio 엔드포인트 |
| `OPENWEIGHT_MODEL` | `qwen2.5:32b` | 로컬 모델명 |
| `OPENWEIGHT_API_KEY` | `ollama` | 더미 키 (Ollama는 무시) |

## 3. 프로바이더

### DeepSeek

```bash
# platform.deepseek.com → API Keys
export DEEPSEEK_API_KEY=sk-...
npx ort chat --provider deepseek
```

### GLM (즈푸 빅모델)

```bash
# open.bigmodel.cn → API Keys
export GLM_API_KEY=...
npx ort chat --provider glm --model glm-4-flash
```

### 오픈웨이트 (Ollama)

```bash
ollama pull qwen2.5:32b
ollama serve
# OPENWEIGHT_BASE_URL=http://localhost:11434/v1 (기본값)
npx ort chat --provider openweight --model qwen2.5:32b
```

### vLLM / LM Studio

OpenAI 호환 서버라면 모두 동작 — `OPENWEIGHT_BASE_URL`을 해당 서버의 `/v1` 엔드포인트로 지정합니다.

## 4. CLI 레퍼런스

### `ort chat` — 대화형 세션

```
npx ort chat [--provider <p>] [--model <m>] [--skills <s1,s2>]

세션 내 명령:
  /skills        스킬 목록 출력
  /reset         대화 히스토리 초기화
  /exit          종료
메시지 내 지시어:
  /use <skill>   현재 턴에 스킬 강제 로딩
```

### `ort ask` — 1회성 질의

```
npx ort ask "SQL 인젝션 테스트 방법" --provider deepseek
```

### `ort skills` — 스킬 조회

```
npx ort skills list             # 전체 스킬 (이름, 카테고리, 설명)
npx ort skills show <name>      # 스킬 본문 전체 출력
```

## 5. 라이브러리 API

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",          // "glm" | "openweight" 선택 가능
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
  autoLoad: true,                // 트리거 기반 로딩
  maxSkills: 3,
  includeIndex: true,
});

await ort.init();                // 스킬 디스크에서 로드
ort.listSkills();                // [{frontmatter, body, path}]

const result = await ort.chat("SQL 인젝션 테스트 방법", {
  skills: ["offensive-sqli"],    // 강제 로딩
  onDelta: (d) => process.stdout.write(d),  // 스트리밍
});
// result: { content, matchedSkills, provider, model }

ort.reset();                     // 히스토리 초기화
```

## 6. 스킬 시스템

각 스킬은 frontmatter가 확장된 `SKILL.md` 파일입니다:

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

- **Progressive disclosure** — 시스템 프롬프트에는 설명(인덱스)만 상주하고, 트리거 매칭 시에만 스킬 본문이 로딩됩니다.
- **트리거** — 키워드(한·영)와 `/regex/` 패턴 지원.
- **명시적 로딩** — 메시지 내 `/use offensive-sqli` 또는 `--skills` 플래그.

## 7. 트러블슈팅

| 증상 | 해결 |
|------|------|
| `401` / 인증 오류 | 해당 프로바이더의 API 키 환경변수 확인 |
| 스킬이 로딩되지 않음 | `ORT_SKILLS_DIR` 확인, `npx ort skills list` 실행 |
| 매칭되는 스킬이 없음 | `/use <skill>` 사용 또는 스킬 `triggers`에 키워드 추가 |
| 소형 로컬 모델이 스킬을 무시함 | `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off`, 32B 이상 모델 사용 권장 |
| Ollama 컨텍스트 초과 | Ollama 설정에서 `num_ctx` 확장 |

## 8. 보안 및 윤리

- 스킬은 **허가된 테스트 전용** 공격 방법론입니다.
- 서면 허가 없이 실제 시스템에 절대 사용하지 마십시오.
- 연습용: PortSwigger Web Security Academy, DVWA, HackTheBox, TryHackMe.
