# Heimdallr — 대시보드 개발 설계

> Cloudflare 프리티어 기반 웹 대시보드 (Next.js) 설계 문서

---

## 1. 개요

Heimdallr 대시보드는 **"브라우저에서 LLM 키를 넣고, 도메인을 검증하고, 모의 테스트를 실행·관찰하고, 보고서를 내보내는"** 단일 웹 앱입니다.

- 기술: **Next.js (App Router)**, Cloudflare Pages(정적) + Workers(API)
- 언어: 한국어·영어·중국어·일본어 (i18n)
- DB: Neon(PostgreSQL) — 사용자·도메인·작업·결과
- 보조: KV(세션·검증 토큰), R2(보고서 파일), D1(경량 집계)

---

## 2. 페이지/모듈 구성

| # | 화면 | 핵심 기능 |
|---|---|---|
| 1 | **로그인 / 회원가입** | 이메일 기반 인증 (Cloudflare Access 또는 자체 JWT) |
| 2 | **LLM 키 관리** | BYOK 키 입력·암호화 저장·공급자/모델/`max_tokens` 설정 |
| 3 | **도메인 검증** | 난독화 토큰 발급 → 서브 디렉터리 배치 안내 → 검증 → 24h 권한 |
| 4 | **대시보드(홈)** | 활성 작업·검증된 도메인·취약점·토큰 소비·활동 흐름 |
| 5 | **작업(모의 테스트)** | 작업 생성·일시정지·중지, 범위 설정, 에이전트 실시간 관찰 |
| 6 | **탐색/자산 그래프** | 자산 그래프·탐색 체인·커버리지 시각화 |
| 7 | **취약점(Findings)** | 심각도·상태·자산별 집계, CSV 내보내기 |
| 8 | **인터셉트 승인** | 위험 도구 호출 전 사람 승인 |
| 9 | **보고서** | 마크다운/PDF/CSV 내보내기 (방어자용 옵션) |
| 10 | **CyberSecurityWiki** | 지식 조회·기여 (별도 문서 참조) |
| 11 | **설정** | 프로필·언어·동시성·감사 로그 |

---

## 3. 도메인 검증 흐름 (핵심 플로우)

```
[사용자] 도메인 입력 (예: mycompany.com)
   │
   ├─ 1) 이메일 확인: 요청자의 이메일 도메인 == 대상 도메인?
   │      · 무료 이메일(gmail/naver/daum/kakao 등)이면 즉시 거부
   │
   ├─ 2) 토큰 발급: 난독화 토큰 생성 (예: heim-9f3a...)
   │      · KV 에 {domain, token, issuedAt, expiresAt} 저장
   │
   ├─ 3) 배치 안내: 사용자가 아래 경로에 토큰 파일/텍스트 배치
   │      · https://mycompany.com/.well-known/heimdallr/<token>
   │
   ├─ 4) 검증: Worker 가 HTTP GET → 본문/경로 일치 확인
   │      · DNS 확인 + HTTP 상태 200 + 토큰 일치
   │
   ├─ 5) 권한 부여: 성공 시 24시간 한정 authorization 발급
   │      · scope = {domain, subdomains?, 등록 범위}
   │
   └─ 6) 만료 처리: 24h 경과 시 재검증 요구
```

### 검증 토큰 설계

| 항목 | 값 |
|---|---|
| 형식 | `heimdallr-<32바이트 랜덤>` (난독화/무작위) |
| 배치 경로 | `/.well-known/heimdallr/<token>` (또는 등록된 서브 디렉터리) |
| 유효 기간 | 발급 후 짧은 시간(예: 60분) 내 배치·검증 |
| 재사용 | 1회성; 재검증 시 새 토큰 발급 |

---

## 4. BYOK 키 관리 설계

- **입력**: 공급자(anthropic/openai/호환)·API 키·모델·`max_tokens`·선택적 `base_url`.
- **저장**: 키는 **AES-256-GCM 등으로 암호화**해 저장, 평문 로그 금지. (Cloudflare Secrets or Neon 암호화 컬럼)
- **사용**: 에이전트 실행 시에만 복호화 → LLM 호출.
- **원칙**: "플랫폼은 키를 소유하지 않는다" — 키는 사용자 소유, 서버는 전달자.
- **토큰 소비 표시**: 대시보드에서 LLM 토큰 사용량·예상 비용 표시.

### LLM 설정 가이드(ARTEX 경험 반영)

1. **역량 있는 모델 권장**(`claude-opus-4-8`, `gpt-4o` 등) — 소형 모델은 출력 품질·다국어 유지가 떨어짐.
2. **OpenAI 호환 `max_tokens` 함정** — `gpt-4o` 계열은 16,384 이하로 지정(초과 시 `400`).
3. **추론형 모델**은 `max_tokens` 를 넉넉히.

---

## 5. 작업(모의 테스트) 실행 모델

Cloudflare 프리티어는 **CPU 시간 제한(무료 약 10ms/요청)** 이 있으므로, ARTEX 처럼 "한 요청에서 에이전트 루프를 끝까지" 돌릴 수 없습니다.

### step 기반 실행 (Queue + Durable Objects)

```
[Worker API] 작업 생성 → 큐에 메시지 삽입
   │
[Queue]  ──▶ [Durable Object: AgentLoop]
   │            · 상태 보존 (planner/worker 상태)
   │            · 1 step = planner 1회 추론 or worker 1회 도구 실행
   │            · step 완료 → 결과 저장 → 다음 step 큐 재삽입
   └─ 반복 (목표 증명 prove_goal 까지)
```

| 구성 | 역할 |
|---|---|
| Cloudflare Queues | 작업 단계를 순차/병렬로 분배 |
| Durable Objects | 에이전트 루프 상태(탐색 그래프 진행 상태) 보존 |
| Neon | 자산 그래프·탐색 그래프·결과 영속화 |
| KV | 세션·임시 상태 |

> 장시간·무거운 도구 실행(예: 대규모 스캔)은 step 으로 쪼개거나, 필요 시 사용자 측 로컬 러너(옵션)로 오프로드하는 방안을 M2 에서 확정.

---

## 6. Cloudflare 프리티어 리소스 매핑

| 리소스 | 프리티어 한도 | Heimdallr 용도 |
|---|---|---|
| Workers | 100,000 req/일 | API · 검증 · 제어 |
| Pages | 무제한 정적 요청 | 대시보드 UI |
| Queues | 1,000,000 작업/월 | 에이전트 step 분배 |
| Durable Objects | 1,000,000 요청/월 | 에이전트 루프 상태 |
| KV | 100k 읽기/일, 1k 쓰기/일 | 세션·검증 토큰 |
| D1 | 5M 행 읽기/일 | 경량 집계 |
| R2 | 10GB 저장 | 보고서 파일 |
| Neon (외부) | 무료 브랜치(~0.5GB) | 메인 DB |

---

## 7. 데이터 모델 (Neon, 초안)

```
users(id, email, email_domain, created_at)
llm_keys(id, user_id, provider, encrypted_key, model, max_tokens)
domains(id, user_id, domain, verification_status, verified_at, expires_at)
tokens(id, domain_id, token_hash, issued_at, expires_at, used)
tasks(id, user_id, domain_id, scope, status, goal, created_at, finished_at)
assets(id, company_id, type, value, parent_id)
exploration_nodes(id, task_id, type[goal|intent|fact|finding], payload)
exploration_anchors(node_id, asset_id)
findings(id, task_id, asset_id, severity, status, title, description)
reports(id, task_id, format, file_ref, created_at)
wiki_entries(id, ... )   # CyberSecurityWiki 참조
```

---

## 8. 다국어(i18n)

- 프레임워크: `next-intl` 등 표준 i18n, 언어별 라우팅(`/ko`, `/en`, `/zh`, `/ja`).
- 언어: 한국어(기본)·영어·중국어·일본어.
- 산출물(리포트·취약점 제목)은 **사용자 선택 언어로 유도**(프롬프트 지시), 명령·로그·URL 원문은 유지.

---

## 9. 구현 단계 (대시보드)

| 단계 | 산출물 |
|---|---|
| D1 | 로그인·회원가입 + LLM 키 관리(암호화 저장) |
| D2 | 도메인 검증(토큰 발급/검증/24h) |
| D3 | 작업 목록 + 작업 생성 + 범위 설정 |
| D4 | 에이전트 실시간 관찰(SSE) + 탐색/자산 그래프 |
| D5 | 취약점 목록 + 인터셉트 승인 |
| D6 | 보고서 내보내기 + 다국어 완성 |

---

## 10. 참고

- ARTEX 원본 대시보드 화면(중국어)이 UX 레퍼런스가 됨: [artex-demo.vercel.app](https://artex-demo.vercel.app/)
- 한국어판 화면 참조: `jiwoochris/artex-ko` 의 `screenshots/ko/*`
