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
| `ORT_DB_PATH` | `./data/ort.db` | 로컬 계정·런타임 설정용 SQLite 경로 |
| `ORT_AUTH_SECRET` | *(자동)* | 로그인 토큰 HMAC 시크릿 (비어 있으면 생성해 DB에 저장) |
| `ORT_DISABLE_LOCAL_AUTH` | `0` | `1`이면 로컬 계정 비활성화(OIDC/정적 토큰 전용) |
| `ORT_DASHBOARD_TOKEN` | *(없음)* | 정적 Bearer 토큰 (로컬 계정의 대안) |
| `ORT_OIDC_ISSUER` | *(없음)* | Keycloak/OIDC 발급자 — 설정 시 OIDC 액세스 토큰 필수 (우선 적용) |
| `ORT_OIDC_AUDIENCE` | *(없음)* | 기대 `aud` 클레임 |
| `ORT_METRICS_TOKEN` | *(없음)* | `/metrics` 토큰 (비어 있으면 대시보드 인증 적용) |
| `ORT_AUDIT_LOG` | *(없음)* | JSONL 감사 로그 경로 (sessionId·operator·decision·매칭 스킬·프롬프트 SHA-256 — 원문 미기록) |
| `ORT_AUDIT_REQUIRED` | `0` | `1`이면 감사 기록 실패 시 요청 실패 |

### 로컬 계정 (SQLite)

최초 기동 시 기본 계정 **admin / admin**을 생성하고, 다른 API 사용 전 비밀번호 변경을 강제합니다
(`403 password change required`). 로그인 시 HMAC 서명 토큰(12시간)을 발급하며
`Authorization: Bearer <token>`으로 사용합니다.

| 엔드포인트 | 용도 |
|-----------|------|
| `POST /api/auth/login` | `{username, password}` → `{token, username, role, mustChangePassword}` |
| `GET /api/auth/me` | 현재 사용자 (`username`, `role`, `mustChangePassword`) |
| `POST /api/auth/change-password` | `{currentPassword, newPassword}` (최소 8자) |

### 런타임 설정 (Settings 탭)

관리자는 대시보드 Settings 탭에서 스코프·예산·엔진 설정을 변경할 수 있습니다
(`GET/PUT /api/settings`). DB 값이 환경변수보다 우선하며, 빈 값은 환경변수로 폴백됩니다.
변경 가능 키: `ORT_SCOPE`, `ORT_SCOPE_DOMAINS`, `ORT_SCOPE_MODE`, `ORT_OPERATOR`,
`ORT_MAX_CONTEXT`, `ORT_SKILL_BUDGET`, `ORT_RESERVE_TOKENS`, `ORT_MAX_SKILLS`,
`ORT_INCLUDE_INDEX`, `ORT_AUTO_LOAD`. 프로바이더/모델/API 키 변경은 재시작이 필요합니다.

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

## 12. 검토 지적 및 검증 현황

누적 검토 지적(4라운드)과 현재 상태입니다.

### P0 — 치명 지적, 전부 해결·실측 확인

| # | 지적사항 | 상태 |
|---|----------|------|
| 1 | 스킬 본문 전량 주입 → 컨텍스트 오버플로 (단일 스킬 ~138K 토큰) | 토큰 예산제 + 대형 스킬 6종 `index_only`, 실행 시 프롬프트 ~6-8K 토큰 실측 |
| 2 | 테스트 전무 | vitest 63건/12파일 |
| 3 | CLI뿐인 앱 → `docker compose up -d` 미동작 | Express 대시보드 + compose `command: ["dashboard"]` |
| 4 | 범위 강제 없음 → 전부 모델에 전달 | `decision: deny` 시 프로바이더 호출 전 반환 — 호출 카운터로 0회 확증 |
| 5 | fail-open 기동 (무인증/무스코프) | 둘 다 exit 1 거부 |

### P1 — 신뢰성·운영 지적, 해결

| # | 지적사항 | 상태 |
|---|----------|------|
| 6 | LangFuse 감사 코드 미연동 | `recordChat` 트레이싱 + JSONL 감사 `promptSha256`(원문 미기록) |
| 7 | Keycloak(OIDC) 코드 미연동 | OIDC 미들웨어: discovery + JWKS + RS256 |
| 8 | npm bin 경로 깨짐 (`npx ort` 불가) | `dist/src/cli.js`로 교정 |
| 9 | LICENSE 없음 | 추가 (MIT + claude-red 고지) |
| 10 | `reasoning_content` 유실·스트리밍 고정 | 추론 포착 + non-stream 폴백 |
| 11 | 시크릿 전부 `change-me` | `docker-compose.infra.yml` 분리 + 필수 치환 `${VAR:?}` |
| 12 | PoC 프로파일 LLM 기본값 불일치 | Ollama 정합 + `depends_on: ollama-pull` |
| 13 | 운영자 간 히스토리 공유 | `SessionStore`(LRU·유휴 축출) + OIDC `sub` 귀속 |
| 14 | 히스토리 무한 누적 | 턴 예산 + `[earlier turns omitted]` 표식 |
| 15 | 검색 품질 기준선 없음 | 30개 fixture + 임계값(top-1 ≥ 0.85, top-3 ≥ 0.95) |

### P2 — 마감·경계, 해결

- CLI 버전 하드코딩(0.1.0) → `package.json` 동적 로드
- 죽은 메트릭·라우트 라벨 → 정리
- `compliance.md`/아키텍처 통제표 4개 국어
- `index_only` 스킬 Skills 탭에 "본문 미주입" 배지

### 알려진 한계 (경미)

1. **CI 워크플로**: 레포 루트 `.github/workflows/open-red-team.yml`에 존재(GitHub는 루트에서만 실행),
   경로 필터 적용. 로컬 실행은 검증, 호스팅 게이트 실동작은 미확인.
2. **vLLM 실기동 / Keycloak OIDC 왕복**: 코드·compose·realm 구성 검증 완료, GPU/Docker 인프라 부재로 실기동 미확인.
3. **이미지 기본 `CMD`는 `chat`** (대화형) — compose가 `dashboard`로 오버라이드. 의도된 이중 용도.
4. **거절 감사에 `flaggedTargets`(호스트만, 프롬프트 원문은 미기록)** 기록 — 설계상 정보 제공용.
