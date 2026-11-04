# Open AI Red Team — 사용 매뉴얼

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

OpenAI 호환 서버라면 모두 동작 — `OPENWEIGHT_BASE_URL`을 해당 서버의 `/v1` 엔드포인트로
지정합니다. LM Studio는 `http://localhost:1234/v1`에 노출합니다. 웹 모델 검열·기본 안전
정렬이 제약이 되는 무검열 GGUF 랩 테스트는 [무검열 오픈웨이트 모델 가이드](uncensored-models.md)
참고. 격리·허가된 환경에서만 사용하십시오.

## 4. CLI 레퍼런스

### `ort chat` — 대화형 세션

`ort`는 글로벌 설치(`npm i -g .`)가 필요하며, 아니면 `ort` 대신 `node dist/src/cli.js`를 사용하세요.

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

## 9. 웹 대시보드

다중 운영자·감사가 가능한 브라우저 기반 관리 대시보드입니다.

```bash
npx ort dashboard                          # http://localhost:8081
ORT_DASHBOARD_TOKEN=secret npx ort dashboard   # Bearer 토큰 보호
```

| 탭 | 기능 |
|----|------|
| Chat | 스트리밍 채팅 + 자동 로딩된 스킬이 칩으로 표시 |
| Skills | 79개 스킬을 이름·카테고리·트리거로 검색/필터, 본문 열람 |
| Audit | JSONL 감사 로그의 최근 상호작용 조회 |
| Config | 키 마스킹된 읽기 전용 설정 |

| Chat | Skills |
|------|--------|
| ![Chat](../../assets/screenshots/dashboard-chat.png) | ![Skills](../../assets/screenshots/dashboard-skills.png) |
| **Audit** | **Config** |
| ![Audit](../../assets/screenshots/dashboard-audit.png) | ![Config](../../assets/screenshots/dashboard-config.png) |

환경변수:

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `ORT_DASHBOARD_PORT` | `8081` | 리슨 포트 |
| `ORT_DASHBOARD_TOKEN` | *(없음)* | `/api/*`용 Bearer 토큰. 비어 있으면 인증 없음(개발 전용) |
| `ORT_AUDIT_LOG` | *(없음)* | JSONL 감사 로그 경로 (채팅 완료 시각·프로바이더·모델·매칭 스킬·길이 기록) |

Docker:

```bash
docker compose up -d ort    # http://localhost:8081
```

프론트엔드는 외부 자산(CDN)이 없어 완전 오프라인 동작 — 에어갭 환경에 적합합니다.
기업 SSO는 리버스 프록시 앞단에 Keycloak(OIDC)을 두고 `ORT_DASHBOARD_TOKEN`을 비활성화하십시오.

## 10. 가드레일·예산·관측

### 컨텍스트 예산 (오버플로 방지)

스킬 본문은 토큰 예산까지만 주입됩니다 — 모델에 조용히 오버플로된 컨텍스트가 전달되지 않습니다.
프로바이더별 기본값: deepseek 64K/16K, glm 128K/24K, openweight 32K/8K (컨텍스트 한도/스킬당 예산).
`ORT_MAX_CONTEXT`, `ORT_SKILL_BUDGET`, `ORT_RESERVE_TOKENS`로 재정의 가능. 초과 본문은 섹션 단위로
잘리고(`… [truncated by token budget]`), `index_only` 스킬(예: 554KB `offensive-windows-boundaries`)은
본문 주입 없이 인덱스만 유지됩니다 — `ort skills show <name>`으로 열람.

### 임무 스코프 가드레일

| 변수 | 효과 |
|------|------|
| `ORT_SCOPE` | 신고된 임무 설명 — 시스템 프롬프트에 주입되고 감사·트레이스에 기록. 대시보드 기동 필수(`ORT_SCOPE_MODE=open` 예외) |
| `ORT_SCOPE_DOMAINS` | 범위 내 호스트/도메인(쉼표 구분). 범위 밖 대상은 **모델 호출 전에 거절**(SSE `denied`, CLI `decision: DENIED`) |
| `ORT_SCOPE_MODE` | `open`이면 도메인 검사 해제(로컬 랩 전용) |
| `ORT_OPERATOR` | 감사 항목·LangFuse 트레이스에 기록되는 운영자 식별자 |

세션은 인메모리(LRU 상한, 유휴 축출)이며 **서버 재시작 후 초기화**됩니다 — 디스크 영속은 이번 릴리스 범위 밖입니다.

### 관측

- **LangFuse**: `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY`/`LANGFUSE_BASEURL` 설정 시 모든 채팅 트레이싱.
- **Prometheus**: 대시보드 `/metrics` 노출, compose monitoring 프로파일이 자동 수집.

## 11. 보안 및 윤리

- 스킬은 **허가된 테스트 전용** 공격 방법론입니다.
- 서면 허가 없이 실제 시스템에 절대 사용하지 마십시오.
- 연습용: PortSwigger Web Security Academy, DVWA, HackTheBox, TryHackMe.
