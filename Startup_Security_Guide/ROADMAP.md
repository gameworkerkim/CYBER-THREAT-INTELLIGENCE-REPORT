# LLM CISO — 개발 로드맵 & 기능 명세

> **SKIL → MCP → 자기 교정 → 협업 봇** 순으로 진화하는 실행 계획
> *Last updated: 2026-07-11*

[English](./ROADMAP_EN.md) · [README](./README.md)

---

## 전략 요약

기존 Phase 2 프롬프트 시스템을 **SKIL(Security Knowledge & Intelligence Layer)** 로 확장·재정의한 뒤, MCP로 실행 가능한 에이전트로 연결하고, LLM 실수를 MCP가 검증·수정·보고하는 피드백 루프를 만든 다음, Slack/Telegram·팀 공유로 협업 표면을 넓힌다.

```
Phase 1 ✅        Phase 2 ✅              Phase 3 (진행)                    Phase 4 (계획)
보안 가이드   →   LLM CISO 프롬프트  →   SKIL → MCP → 자기교정 → 봇/공유  →  통합 모니터링
& 체크리스트      (SKIL의 원천 지식)      + 대시보드 UI                        (Wazuh/SIEM)
```

| 원칙 | 설명 |
|------|------|
| **지식 먼저** | 프롬프트를 그대로 두지 않고, MCP가 조회 가능한 구조화 지식(SKIL)으로 재구성 |
| **실행 가능** | LLM이 “조언만” 하지 않고 Prowler·Trivy·Gitleaks 등을 MCP로 호출 |
| **교정 루프** | LLM 진단·추천·커밋 실수를 MCP가 검증하고 수정안·리포트를 생성 |
| **협업 나중** | 코어(SKIL+MCP+교정) 안정화 후 Slack/Telegram·팀 공유 부착 |

---

## Phase 현황

| Phase | 상태 | 산출물 |
|-------|------|--------|
| **1** 보안 가이드 & 체크리스트 | ✅ 완료 | `STARTUP_SECURITY_GUIDE_KR/EN.md` |
| **2** LLM CISO 페르소나 & 프롬프트 | ✅ 완료 | `LLM_CISO_PROMPT_KR/EN.md` (SKIL 원천) |
| **3** SKIL · MCP · 대시보드 · 봇 | 🔄 진행 | 본 로드맵 M0~M5 |
| **4** 통합 모니터링 (SIEM/XDR) | 📋 계획 | Wazuh 등 MCP 백엔드 연동 |

---

## Phase 3 마일스톤 (상세)

### M0 — SKIL 정의 & 구조화 *(최우선)*

**목표:** Phase 2 프롬프트·가이드를 MCP가 조회할 수 있는 지식 레이어로 재구성한다. Cursor Agent Skill 세트로도 동일 지식을 소비한다.

**SKIL = Security Knowledge & Intelligence Layer**

| 구성 | 내용 | 형식 (초안) |
|------|------|-------------|
| Controls | KISA 안전조치, NIST CSF, Stage-Gate 체크리스트 | YAML / JSON |
| Policies | 개인정보보호법·정보통신망법 조항 매핑, GDPR/CCPA 갭 | YAML + 참조 ID |
| Playbooks | 사고 대응(BEC·랜섬웨어·유출), 퇴사자 오프보딩 | Markdown → 구조화 스텝 |
| Findings Schema | severity, legalBasis, remediation, domain | JSON Schema |
| Domain Packs | cloud / workspace / drm / compliance 평가 항목 | JSON |

**기능 명세**

- [x] `skil/` 디렉터리: `controls/`, `policies/`, `playbooks/`, `schemas/`
- [x] 가이드·프롬프트 → SKIL 변환 규칙 문서화 (`skil/MAPPING.md`)
- [x] Cursor Skill 스켈레톤 (도메인별) + **Claude/ChatGPT/Ollama용 `SYSTEM_PROMPT.md`**
- [x] `skil/query` 인터페이스 (`skil/query.mjs` — ID·태그·도메인 조회)
- [ ] 가이드 전 항목 SKIL 이관 (고도화 — 시드 35 IDs 완료, 본문 확장 예정)
- [ ] 벡터/임베딩 인덱스는 M1 이후 옵션 (MVP는 구조화 파일 조회)

**완료 기준:** MCP 또는 Skill이 `control:aws-iam-mfa` 같은 ID로 항목·조치·법조항을 반환할 수 있다. → **CLI로 충족** (`node skil/query.mjs control:aws-iam-mfa`). MCP 연동은 M1.

**시드 현황 (2026-07-11):** controls 22 · policies 9 · playbooks 4 · skills 6 (core+5 domains) · multi-LLM SYSTEM_PROMPT 동봉.

---

### M1 — MCP 서버 프로토타입

**목표:** SKIL 조회 + 오픈소스 보안 도구 1~2개를 호출하는 MVP MCP 서버.

**우선 연동 도구**

| 우선순위 | 도구 | 용도 |
|----------|------|------|
| P0 | SKIL query | 지식·체크리스트·법규 조회 |
| P1 | Gitleaks | 시크릿 탐지 (커밋/레포) |
| P1 | Trivy | 컨테이너·IaC·FS 취약점 |
| P2 | Prowler | 클라우드 CSPM (AWS/GCP/Azure) |
| P3 | Semgrep | SAST (선택) |
| P4 | Wazuh | Phase 4 SIEM (예고) |

**기능 명세**

- [ ] MCP 서버: `tools/skil_lookup`, `tools/gitleaks_scan`, `tools/trivy_scan`
- [ ] 입력/출력 JSON Schema 고정 (LLM이 파싱 가능)
- [ ] 로컬 실행 가이드 (stdio MCP)
- [ ] 민감 결과 마스킹 옵션 (시크릿 값 미반환)

**완료 기준:** Cursor/Claude에서 MCP로 SKIL 조회 + Gitleaks 스캔 1회 성공.

---

### M2 — 자기 교정 루프 (LLM 실수 → MCP 검증·보고)

**목표:** 정적 진단을 넘어, LLM 출력·추천·커밋을 MCP가 검증하고 수정안을 제시하는 피드백 루프.

**‘실수’ 레벨 정의**

| Level | 유형 | 예시 | MCP 대응 |
|-------|------|------|----------|
| L1 | 형식·환각 | 존재하지 않는 법조항, 잘못된 CLI | SKIL 교차검증 → 정정 제안 |
| L2 | 정책 위반 | 0.0.0.0/0 SSH, public S3 | 도구 스캔 결과와 대조 → 차단/경고 |
| L3 | 시크릿·커밋 | 하드코딩 키, 위험 커밋 | pre-commit / pre-push에서 Gitleaks 등 실행 → 차단 + 리포트 |
| L4 | 법규 미준수 | CPO 미지정 누락, 암호화 기준 오류 | SKIL policy 매칭 → 준수 갭 리포트 |

**기능 명세**

- [ ] `validate_assessment(result)` — LLM 진단 JSON을 SKIL·스캔 결과와 대조
- [ ] `suggest_fix(finding)` — 수정 패치·설정 스니펫 생성 (실행은 사용자 승인)
- [ ] `report_correction` — 교정 이력 저장 및 알림 페이로드
- [ ] pre-commit hook 템플릿 (Gitleaks + 선택적 SKIL policy check)
- [ ] “자동 적용”은 기본 OFF — 보고·제안 우선, 적용은 명시적 승인

**완료 기준:** 의도적으로 틀린 LLM 진단(가짜 법조항)을 MCP가 L1으로 잡아 수정안을 반환한다.

---

### M3 — 대시보드 Web UI (기존 Phase 3 UI)

**목표:** SKIL/MCP 결과를 시각화하는 Next.js 대시보드.

**기능 명세**

- [ ] 보안 현황판 (Overall Score, 도메인별 점수, 위험 등급 카운트)
- [ ] 진단 실행·이력 (MCP 기반 스캔 결과 포함)
- [ ] 조치 로드맵 트래커 (Sprint, JIRA/Linear 연동 준비)
- [ ] 컴플라이언스 스코어카드 (KISA / GDPR / CCPA)
- [ ] LLM 제공자 선택 (Public / Local / Hybrid)
- [ ] 교정 리포트 뷰 (M2 결과 표시)

---

### M4 — 알림 & 협업 (Slack / Telegram / 팀 공유)

**목표:** 코어 안정화 후 접근성·협업 표면 확대.

**기능 명세**

| 기능 | 설명 |
|------|------|
| Slack Bot | 진단 완료·Critical 이슈·교정 리포트 채널 알림, slash command로 퀵스캔 |
| Telegram Bot | 동일 알림·간단 질의 (모바일 접근) |
| Email | Resend 기반 주간/월간 리포트 (기존 계획 유지) |
| 팀 공유 | 진단 결과 공유 링크, 이슈별 댓글·상태(Open/In Progress/Done) |
| RBAC | Owner / Security Lead / Member / Viewer — 결과·조치 권한 분리 |

**완료 기준:** Critical finding 발생 시 Slack + Telegram에 동일 페이로드 전달, Viewer는 읽기만 가능.

---

### M5 — Production 하드닝

- [ ] NextAuth (Google OAuth) / 멀티테넌시
- [ ] 감사 로그 (누가 어떤 진단을 실행했는지)
- [ ] 레이트 리밋·시크릿 관리 (Vault/환경변수)
- [ ] Hybrid 모드 기본값: 민감 컨텍스트는 Ollama, 일반 정책은 Public LLM

---

## Phase 4 (예고)

| 항목 | 내용 |
|------|------|
| Wazuh / XDR | MCP 도구로 알람 조회·자연어 헌팅 |
| 실시간 알람 | Critical 이벤트를 봇 채널로 즉시 전달 |
| SIEM 통합 | sb-siem-mcp 패턴 참고 |
| 조직 대시보드 | 멀티팀·멀티클라우드 집계 |

---

## 실행 순서 (권장)

```
1. SKIL 정의·구조화 (+ Cursor Skill 스켈레톤)
2. MCP 서버 MVP (SKIL + Gitleaks/Trivy)
3. 자기 교정 루프 (validate → report → optional fix)
4. 대시보드 UI (MCP 결과 소비)
5. Slack / Telegram / 팀 공유 (RBAC)
6. Phase 4 SIEM·실시간 모니터링
```

---

## 목표 디렉터리 구조 (Phase 3)

```
Startup_Security_Guide/
├── README.md
├── ROADMAP.md                 # 본 문서
├── ROADMAP_EN.md
├── STARTUP_SECURITY_GUIDE_*.md
├── LLM_CISO_PROMPT_*.md       # SKIL 원천 (유지)
├── LLM_CISO_DASHBOARD_*.md
├── skil/                      # M0 — 구조화 지식 (신규)
│   ├── controls/
│   ├── policies/
│   ├── playbooks/
│   ├── schemas/
│   └── MAPPING.md
├── mcp/                       # M1 — MCP 서버 (신규)
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── tools/
│   │   └── validators/
│   └── README.md
├── skills/                    # Cursor Agent Skills (신규)
│   ├── ciso-cloud/
│   ├── ciso-workspace/
│   ├── ciso-drm/
│   ├── ciso-kisa/
│   └── ciso-incident/
└── hooks/                     # M2 — pre-commit 템플릿 (신규)
    └── gitleaks-pre-commit.sh
```

---

## 기술 스택 (갱신)

| 계층 | 기술 | 용도 |
|------|------|------|
| 지식 | SKIL (YAML/JSON + Schema) | MCP·Skill 공통 지식 기반 |
| 에이전트 프로토콜 | MCP (Model Context Protocol) | 도구 호출·검증·스캔 |
| 언어 | TypeScript (Strict), Node.js 22 | MCP 서버, CLI, API |
| 프레임워크 | Next.js 15 (App Router) | 대시보드 (M3) |
| LLM | Claude / GPT-4o / DeepSeek / Ollama | 진단 생성 (검증은 MCP) |
| 보안 도구 | Gitleaks, Trivy, Prowler, Semgrep | MCP 백엔드 스캐너 |
| 알림 | Slack Bot API, Telegram Bot API, Resend | M4 |
| 협업 | 팀 공유 + RBAC, JIRA/Linear (후속) | M4~M5 |
| 호스팅 | Vercel | 대시보드·Cron |
| SIEM (Phase 4) | Wazuh | 통합 모니터링 |

---

## 관련 문서

- [README.md](./README.md) — 프로젝트 개요
- [STARTUP_SECURITY_GUIDE_KR.md](./STARTUP_SECURITY_GUIDE_KR.md) — SKIL Controls/Playbooks 원천
- [LLM_CISO_PROMPT_KR.md](./LLM_CISO_PROMPT_KR.md) — SKIL 페르소나·진단 항목 원천
- [LLM_CISO_DASHBOARD.md](./LLM_CISO_DASHBOARD.md) — UI·API 명세

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) · CC BY-NC-SA 4.0 · 2026-07-11
