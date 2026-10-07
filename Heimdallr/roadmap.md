# Heimdallr — 개발 로드맵 (상세)

> ARTEX 컨셉을 계승한 방어 중심 자율 모의 침투 + CyberSecurityWiki 시스템의 **순차 개발 계획**
> 상태 표기: `[ ]` 미착수 · `[~]` 진행 중 · `[x]` 완료

---

## 0. 전체 기술 스택 (확정)

| 계층 | 기술 | 비고 |
|---|---|---|
| 런타임 | Node.js 24 + TypeScript 5 | Cloudflare 에지 네이티브 |
| 프레임워크 | **vinext** (Next.js 16 API on Vite 8) + `@cloudflare/vite-plugin` | `create-vinext-app` 으로 스캐폴드(완료) |
| UI | React 19 + Tailwind CSS v4 | App Router, RSC |
| 배포 | Cloudflare Workers (`@vinext/cloudflare deploy`) | 프리티어 대상 |
| 데이터베이스 | **Neon** (serverless PostgreSQL) + **Drizzle ORM** + `drizzle-kit` | Hyperdrive 로 TCP 풀링, 마이그레이션 |
| 보조 저장 | Cloudflare **KV / D1 / R2** | 세션·검증 토큰·보고서 |
| 에이전트 실행 | Cloudflare **Queues + Durable Objects** | step 기반(프리티어 CPU 제한 대응) |
| 인증 | `jose`(JWT) + Web Crypto **PBKDF2** | Workers 호환(네이티브 의존성 無) |
| 암호화 | Web Crypto **AES-256-GCM** (LLM 키) | 마스터 키는 Worker Secret |
| LLM | **Vercel AI SDK**(`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`) | 공급자 통합·엣지 호환 |
| i18n | `next-intl` | `/ko|en|zh|ja` 라우팅 |
| MCP | `@modelcontextprotocol/sdk` (streamable HTTP) | Wiki 참조용 |
| 보고서 | Markdown(생성) + `pdf-lib`(PDF) + CSV | Workers 호환(브라우저리스) |
| CI/CD | GitHub Actions + `@vinext/cloudflare deploy` | main 푸시 자동 배포 |

> ⚠️ **핵심 제약**: Cloudflare Workers 는 **Bash/nmap 등 임의 프로세스를 실행할 수 없습니다.** ARTEX 의 로컬 도구 실행은 "HTTP 기반 테스트(fetch)" 로 대체하고, 필요 시 **옵션 로컬 러너**를 Phase 2 후속으로 검토합니다. 이 제약은 설계 전반에 반영됩니다.

---

## 개발 순서 요약

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
스캐폴드     에이전트     Wiki        보고서       다국어·배포
+대시보드   +Neon 그래프 +지식 축적   +탐지 규칙    최적화
```

- **의존성**: Phase 2 는 Phase 1 의 도메인 검증/키 관리 위에, Phase 3 은 Phase 2 의 에이전트 산출물 위에, Phase 4 는 Phase 2·3 의 결과 위에 얹힙니다.
- **원칙**: 매 Phase 끝에 "동작하는 것"을 남긴다(점진적 MVP). 방어 우선 가드레일은 1.4 에서부터 강제.

---

# Phase 1 — 스캐폴드 + 대시보드 MVP

> **목표**: 브라우저에서 "LLM 키를 넣고, 도메인을 검증하는" 최소 웹 앱이 동작한다.

## 1.1 프로젝트 스캐폴드 `[x]`

- **목표**: vinext 기반 Next.js + Cloudflare 기본 골격과 빌드 파이프라인 확보.
- **사용 기술**: `create-vinext-app`, vinext, Vite 8, Tailwind v4, TypeScript, `@cloudflare/vite-plugin`, `cf`.
- **완료**: ✅ `npm run build` 통과, 기본 라우트(`/`, `/api/hello`) 동작.

## 1.2 인증 (회원가입/로그인)

- **목표**: 이메일+비밀번호 기반 계정과 JWT 세션을 구축해 이후 모든 기능의 접근 통제 기반을 마련.
- **사용 기술**: `jose`(JWT), Web Crypto PBKDF2(비밀번호 해시), httpOnly 쿠키, Neon `users` 테이블.
- **세부 계획**:
  1. `users` 스키마 + Drizzle 마이그레이션.
  2. `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` 라우트 핸들러.
  3. 비밀번호 해시(PBKDF2, salt 포함)·비교, JWT 발급/검증 미들웨어.
  4. 로그인/회원가입 UI + 보호 라우트(미들웨어로 미인증 차단).
- **완료 기준**: 회원가입→로그인→새로고침 세션 유지→로그아웃 동작.

## 1.3 LLM 키 관리 (BYOK)

- **목표**: 사용자가 자신의 LLM 키를 넣고, 암호화해 저장하며, 공급자·모델을 설정.
- **사용 기술**: Web Crypto AES-256-GCM, Worker Secret(마스터 키), Neon `llm_keys` 테이블, Vercel AI SDK 프로바이더.
- **세부 계획**:
  1. `llm_keys` 스키마(`provider`, `encrypted_key`, `model`, `max_tokens`, `base_url`).
  2. 마스터 키 주입 → AES-GCM 암호화 저장/복호화 유틸.
  3. `/api/keys` CRUD(생성·목록·삭제) — 응답에 평문 키 절대 미포함.
  4. 키 입력 UI + 공급자(anthropic/openai/호환) 선택 + `max_tokens` 가이드(OpenAI 16384 함정 안내).
- **완료 기준**: 키 암호화 저장·목록 조회(마스킹)·삭제 동작, 평문 미노출.

## 1.4 도메인 검증 (난독화 토큰 + 24시간)

- **목표**: "내 도메인 + 내 도메인 메일 + 내 서브 디렉터리" 삼중 소유 신호를 기술적으로 강제.
- **사용 기술**: KV(토큰 TTL), `crypto.randomUUID`(토큰), fetch(HTTP 검증), DNS/MX 조회, 무료 이메일 도메인 차단 목록, Neon `domains`/`tokens` 테이블.
- **세부 계획**:
  1. 무료 이메일 도메인 차단 목록(gmail·naver·daum·kakao 등) 모듈.
  2. 요청자 이메일 도메인 == 대상 도메인 검증(불일치/무료면 거부).
  3. 난독화 토큰 발급 → KV 저장(TTL 60분).
  4. `/.well-known/heimdallr/<token>` 배치 안내 UI + 서버 fetch 검증(상태 200 + 본문 일치).
  5. 검증 성공 시 `domains` 에 24시간 만료 authorization 기록, 만료 체크/재검증 플로우.
- **완료 기준**: 검증 성공/실패/만료 플로우 동작, 무료 이메일 도메인 요청 거부.

## 1.5 i18n (한·영·중·일)

- **목표**: 4개 언어 라우팅과 문자열 관리 기반 구축.
- **사용 기술**: `next-intl`, `/ko|en|zh|ja` 로케일 라우팅, 언어 전환 스위처.
- **세부 계획**:
  1. 메시지 파일(`messages/ko.json`, `en.json`, `zh.json`, `ja.json`).
  2. 미들웨어 로케일 감지·리다이렉트.
  3. 언어 전환 UI + 기본 화면 문자열 적용.
- **완료 기준**: 언어 전환 시 전체 기본 화면 문자열이 즉시 반영.

---

# Phase 2 — 멀티 에이전트 런타임 + Neon 그래프

> **목표**: 검증된 범위에서 LLM 멀티 에이전트가 자율 모의 테스트를 수행한다.

## 2.1 Neon 스키마 (자산·탐색 그래프)

- **목표**: ARTEX 의 이중 그래프(자산+탐색)를 Neon 에 재현.
- **사용 기술**: Drizzle ORM, Neon(멱등 마이그레이션).
- **세부 계획**:
  1. `assets`(root_domain/subdomain/ip/service/app/endpoint), `companies`, `task_scope`.
  2. `exploration_nodes`(goal/intent/fact/finding/hint), `exploration_anchors`, `activity`.
  3. `findings`, `tasks` 스키마. 마이그레이션 멱등 적용(부팅 시).
- **완료 기준**: 스키마 적용·CRUD 조회 동작.

## 2.2 Agent Runtime (planner/worker/mainagent)

- **목표**: LLM 멀티 에이전트 루프를 Cloudflare 프리티어 CPU 제한 안에서 step 기반으로 실행.
- **사용 기술**: Vercel AI SDK(`generateText`/`tool`), Cloudflare Queues + Durable Objects, Neon 그래프.
- **세부 계획**:
  1. Durable Object `AgentLoop` 로 작업 상태(planner/worker 진행) 보존.
  2. planner step: 그래프 상황 읽기 → 새 의도(intent) 생성 → frontier 큐.
  3. worker step: 의도 수령 → 도구(HTTP) 실행 → fact/asset/finding 기록.
  4. Queue 로 step 재진입(폐곡선), `prove_goal` 까지 반복.
  5. mainagent: 사람 개입(대화) 인터페이스.
- **완료 기준**: 로컬 취약 앱(Juice Shop 등) 대상 HTTP 기반 1회 왕복 실행.

## 2.3 도구 + 인터셉트 승인

- **목표**: 에이전트의 도구 호출을 제어하고 위험 호출 전 사람 승인.
- **사용 기술**: Vercel AI SDK `tool`, 승인 게이트(DB/KV 상태), SSE 알림.
- **세부 계획**:
  1. HTTP 도구(요청·응답 관찰) + 범위 검증(검증된 도메인 밖 차단).
  2. 위험도 분류 → 승인 필요 도구 게이트.
  3. 승인/거부 UI + 결과를 실행에 반영.
- **완료 기준**: 승인/거부가 도구 실행에 실제 반영.

## 2.4 실시간 관찰 (SSE + 그래프 UI)

- **목표**: 대시보드에서 에이전트 진행을 실시간으로 표시.
- **사용 기술**: 스트리밍 응답(SSE), Durable Objects(구독), 탐색/자산 그래프 시각화(예: `reactflow`/`cytoscape`).
- **세부 계획**:
  1. activity 이벤트 스트림(SSE) API.
  2. 탐색 체인·자산 그래프 시각화 컴포넌트.
  3. 커버리지(범위 내 자산 + 테스트됨 하이라이트).
- **완료 기준**: 대시보드에서 진행이 실시간 갱신.

---

# Phase 3 — CyberSecurityWiki + 지식 축적

> **목표**: 에이전트 산출물이 재사용 가능한 방어 지식으로 축적되고 외부 LLM 이 참조한다.

## 3.1 Wiki 스키마/CRUD

- **목표**: 방어 중심 쌍(attack/defense) 구조의 위키 저장·API.
- **사용 기술**: Drizzle + Neon, REST 라우트 핸들러.
- **세부 계획**:
  1. `wiki_entries` 스키마(attack/defense/provenance/confidence, `cybersecurity-wiki.md` 참조).
  2. `/wiki` CRUD API + 다국어 필드.
  3. 관리 UI(엔트리 작성·검토).
- **완료 기준**: 엔트리 생성·조회·검색 동작.

## 3.2 `llms.txt` + 공개 페이지

- **목표**: LLM 이 표준 형식으로 위키를 수집할 수 있게 배포.
- **사용 기술**: 정적 생성, R2/Pages, `llms.txt` 표준.
- **세부 계획**:
  1. 루트 `llms.txt` + 카테고리별 `llms/*.txt` 생성기.
  2. 공개 읽기 페이지(방어 지식 한정) + R2 스냅샷.
- **완료 기준**: `llms.txt` 를 LLM/크롤러가 수집 가능.

## 3.3 MCP server

- **목표**: Heimdallr 위키를 MCP 서버로 노출해 Claude 등이 도구로 호출.
- **사용 기술**: `@modelcontextprotocol/sdk`(streamable HTTP), Workers.
- **세부 계획**:
  1. `wiki_search`, `wiki_get`, `wiki_list`, `mitre_lookup` 도구.
  2. 방어 우선 가드(원본 페이로드 대신 탐지·완화 지식 우선 반환).
- **완료 기준**: MCP 클라이언트(Claude 등)가 도구 호출 성공.

## 3.4 수집·정제 파이프라인

- **목표**: 실행 산출물 → 위키 후보 자동 추출(방어 우선 정제).
- **사용 기술**: Queue 워커, LLM 요약, 검토 게이트.
- **세부 계획**:
  1. finding/탐지 규칙 → 위키 후보 추출 워커.
  2. 민감·과잉 정보 제거, attack+defense 쌍 완성.
  3. `draft` → 검토 → `published` 승격.
- **완료 기준**: 실행 산출물이 위키 후보로 자동 등록.

---

# Phase 4 — 보고서 + 탐지 규칙

> **목표**: 테스트 결과를 보고서로 내보내고 탐지 규칙으로 환원한다.

## 4.1 보고서 내보내기

- **목표**: 테스트 결과를 다운로드 가능한 파일로 산출.
- **사용 기술**: Markdown 생성, `pdf-lib`(PDF), CSV.
- **세부 계획**:
  1. 작업 데이터 → Markdown 보고서 생성.
  2. PDF 렌더(`pdf-lib`, 브라우저리스) + CSV(취약점 목록).
  3. R2 저장 + 다운로드 링크.
- **완료 기준**: Markdown/PDF/CSV 파일 생성·다운로드.

## 4.2 방어자 보고서

- **목표**: 탐지 규칙·하드닝 체크리스트가 포함된 방어자용 보고서.
- **사용 기술**: Sigma 템플릿, 하드닝 체크리스트 생성.
- **세부 계획**:
  1. 발견 취약점 → Sigma 규칙(YAML) 생성.
  2. 하드닝 체크리스트 자동 생성.
  3. 방어자 보고서 포맷 통합.
- **완료 기준**: 보고서에 규칙·체크리스트 포함.

## 4.3 ATT&CK / Sigma / MISP 연동

- **목표**: 표준 프레임워크와 상호운용.
- **사용 기술**: ATT&CK 데이터 매핑, Sigma YAML, MISP JSON(STIX).
- **세부 계획**:
  1. 엔트리 ↔ MITRE ATT&CK ID 매핑(기법 태그).
  2. Navigator 레이어 JSON 생성.
  3. MISP 이벤트/STIX 내보내기. (※ `sigma convert` 등 Python 툴은 Workers 외부에서 수행)
- **완료 기준**: 표준 포맷(ATT&CK/Sigma/MISP) 산출.

---

# Phase 5 — 다국어 완성 + 프리티어 배포 최적화

> **목표**: 다국어 품질을 올리고 프리티어 한도 안에서 안정 배포한다.

## 5.1 i18n 완성

- **목표**: 전 화면 + 에이전트 산출물의 4개 언어 품질 확보.
- **사용 기술**: `next-intl` 완전 적용, LLM 출력 언어 지시(`langDirective`).
- **세부 계획**:
  1. 전 화면 문자열 번역 완성.
  2. 산출물(리포트·요약) 언어를 사용자 선택 언어로 유도.
- **완료 기준**: 4개 언어 품질 확보.

## 5.2 프리티어 최적화

- **목표**: 무료 한도 안에서 정상 운영.
- **사용 기술**: KV data adapter/Workers Cache, Hyperdrive 풀링, 번들 축소.
- **세부 계획**:
  1. 캐시 전략(KV 데이터 캐시, 정적 자산 캐시).
  2. Neon 커넥션 풀링(Hyperdrive) 및 요청 한도 점검.
  3. 번들/리소스 축소.
- **완료 기준**: 무료 한도 내 정상 운영.

## 5.3 배포·운영

- **목표**: 안정적인 CI/CD 와 모니터링.
- **사용 기술**: GitHub Actions, `@vinext/cloudflare deploy`, Workers 로그/옵저버빌리티.
- **세부 계획**:
  1. main 푸시 → 빌드·배포 자동화.
  2. 로그·오류 추적·감사 로그.
- **완료 기준**: 안정 배포.

---

## 상태 추적

| Phase | 상태 | 비고 |
|---|---|---|
| Phase 1 | `[~]` | 스캐폴드 + 대시보드 MVP (1.1 완료) |
| Phase 2 | `[ ]` | 멀티 에이전트 + Neon |
| Phase 3 | `[ ]` | CyberSecurityWiki |
| Phase 4 | `[ ]` | 보고서 + 탐지 규칙 |
| Phase 5 | `[ ]` | 다국어 + 배포 최적화 |

> 문서 참조: `concept_KR.md`(개념), `differentiation.md`(차별화), `dashboard.md`(대시보드 설계), `cybersecurity-wiki.md`(Wiki 설계)
