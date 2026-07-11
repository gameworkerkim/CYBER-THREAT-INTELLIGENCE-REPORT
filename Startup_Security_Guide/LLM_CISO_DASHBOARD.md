# 📊 LLM CISO 대시보드 — 스타트업 보안 현황판

> **Phase 3 M3: 대시보드 UI/UX** — SKIL·MCP·자기교정 결과를 시각화 (M0~M2 이후)
> *전체 로드맵: [ROADMAP.md](./ROADMAP.md)*

![Phase](https://img.shields.io/badge/Phase-3%20(Dashboard%20M3)-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Planned-lightgrey?style=flat-square)
![Depends](https://img.shields.io/badge/Depends-M0%20SKIL%20%7C%20M1%20MCP-blue?style=flat-square)

---

## 개요

LLM CISO 대시보드는 [Phase 1 가이드](./STARTUP_SECURITY_GUIDE_KR.md)와 [Phase 2 프롬프트](./LLM_CISO_PROMPT_KR.md)를 **SKIL**로 구조화하고, **MCP**로 도구를 실행·검증한 결과를 **실시간 대시보드**로 시각화하는 웹 애플리케이션입니다.

> **의존 관계:** M0(SKIL) → M1(MCP) → M2(자기 교정) 안정화 후 M3(본 대시보드) 구현을 권장합니다. 알림·팀 공유는 M4.

---

## 주요 기능 (Planned)

### 1. 보안 현황 대시보드
- 전체 보안 점수 (0~100) 및 등급 (A~F)
- 도메인별 점수: 클라우드 / Google Workspace / DRM / 법규 준수
- 위험 등급별 이슈 카운트 (Critical / High / Medium / Low)
- 시계열 점수 변화 그래프
- **MCP 스캔 요약** (Gitleaks / Trivy / Prowler 최근 결과)

### 2. 자동 진단 스케줄러
- 주간/월간/분기별 자동 보안 진단 (LLM + MCP 도구)
- Slack·Telegram·Email·Notion으로 리포트 발송 (M4)
- 이전 진단 대비 개선/악화 항목 하이라이트

### 3. 조치 로드맵 트래커
- Sprint 단위 보안 개선 태스크
- 담당자·기한·진행률 관리
- JIRA·Linear·GitHub Issues 연동

### 4. 컴플라이언스 스코어카드
- KISA·개인정보보호법 준수 현황 (SKIL Policies 기반)
- 위반/주의/준수 항목 시각화
- 규제 변경 알림

### 5. LLM 제공자 선택
- 퍼블릭 모드: Claude · GPT · DeepSeek
- 로컬 모드: Ollama (에어갭 보안)
- 하이브리드 모드: 민감 정보만 로컬 처리

### 6. 자기 교정 리포트 (M2)
- LLM 진단 vs MCP 검증 결과 대조
- L1~L4 실수 레벨별 교정 이력
- 수정 제안 승인/거부 워크플로 (자동 적용 기본 OFF)

### 7. 팀 공유 & RBAC (M4)
- 진단 결과 공유 링크, 이슈 댓글·상태 업데이트
- 역할: Owner / Security Lead / Member / Viewer

---

## 기술 스택 (Planned)

```yaml
Knowledge:
  SKIL: YAML/JSON controls, policies, playbooks, schemas

Agent:
  Protocol: MCP (Model Context Protocol)
  Tools: skil_lookup, gitleaks_scan, trivy_scan, prowler_scan, validate_assessment

Frontend:
  Framework: Next.js 15 (App Router)
  Styling: Tailwind CSS + shadcn/ui
  Charts: Recharts / Tremor
  State: Zustand + React Query

Backend:
  Runtime: Node.js 22 + TypeScript (Strict)
  API: Next.js Route Handlers / API Routes
  LLM: Anthropic SDK / OpenAI SDK / Ollama REST API
  MCP Client: connects dashboard jobs to mcp/ server

Infrastructure:
  Hosting: Vercel (Pro)
  Database: Vercel Postgres / PlanetScale
  Cache: Vercel KV (Redis)
  Cron: Vercel Cron Jobs
  Auth: NextAuth.js (Google OAuth)

Integration:
  Slack Bot / Telegram Bot: 진단·교정 알림 (M4)
  Email: Resend
  Notion: 진단 리포트 저장
```

---

## 페이지 구조 (Wireframe)

```
/ciso                          → 대시보드 홈 (보안 현황판)
/ciso/assessment               → 진단 실행 & 결과 (LLM + MCP)
/ciso/assessment/[id]          → 진단 상세 리포트
/ciso/corrections              → 자기 교정 리포트 (M2)
/ciso/roadmap                  → 조치 로드맵 트래커
/ciso/compliance               → 컴플라이언스 스코어카드
/ciso/team                     → 팀 공유·이슈 협업 (M4)
/ciso/settings                 → 회사 정보·LLM·MCP 설정
/ciso/settings/llm             → LLM 제공자 설정 (Public/Local/Hybrid)
/ciso/settings/schedule        → 자동 진단 스케줄
/ciso/settings/notifications   → Slack / Telegram / Email
/api/ciso/assess               → 진단 API (POST)
/api/ciso/validate             → MCP 검증 API (POST)
/api/ciso/report/[id]          → 리포트 API (GET)
/api/ciso/trend                → 추이 데이터 API (GET)
```

---

## 컴포넌트 트리 (Planned)

```
<CisoDashboard>
  <Header>
    <CompanySelector />
    <AssessmentTrigger />
    <SettingsMenu />
  </Header>

  <ScoreOverview>
    <OverallScoreGauge score={78} grade="B" />
    <DomainScoreCards>
      <ScoreCard domain="cloud" score={72} />
      <ScoreCard domain="workspace" score={85} />
      <ScoreCard domain="drm" score={60} />
      <ScoreCard domain="compliance" score={68} />
    </DomainScoreCards>
  </ScoreOverview>

  <MainContent>
    <IssuesPanel>
      <IssueList severity="critical" />
      <IssueList severity="high" />
    </IssuesPanel>

    <McpScanSummary />
    <CorrectionFeed />
    <TrendChart />
    <ComplianceGapTable />
    <RoadmapPreview />
  </MainContent>

  <Footer>
    <LastAssessment />
    <NextScheduled />
  </Footer>
</CisoDashboard>
```

---

## 데이터 흐름

```
[User/CRON] → [Vercel Edge Function]
                  │
                  ├──→ [LLM Provider] (Claude/GPT/DeepSeek/Ollama)
                  │         └──→ 초안 진단 (JSON)
                  │
                  ├──→ [MCP Server]
                  │         ├── skil_lookup
                  │         ├── gitleaks / trivy / prowler
                  │         └── validate_assessment → 교정 리포트
                  │
                  ├──→ [Database] (PostgreSQL)
                  │         └──→ 진단·교정 이력
                  │
                  └──→ [Dashboard UI] → [User]
                            └──→ [Slack / Telegram / Email / Notion] (M4)
```

---

## API 설계 (Draft)

### `POST /api/ciso/assess`

```json
{
  "domain": "cloud | workspace | drm | compliance | all",
  "context": {
    "companyName": "Example Startup",
    "stage": "seed",
    "teamSize": 8,
    "cloudProvider": "aws",
    "workspace": "google",
    "additionalInfo": "루트 MFA만 설정됨, 그 외 기본값"
  },
  "mcp": {
    "runScanners": ["gitleaks", "trivy"],
    "validateWithSkil": true
  }
}
```

응답에 `findings`, `mcpScans`, `corrections`, `roadmap` 포함.

### `POST /api/ciso/validate`

LLM 초안 진단을 MCP가 SKIL·스캔 결과와 대조. L1~L4 교정 배열 반환. 자동 적용 기본 OFF.

### `GET /api/ciso/trend?period=6m`

시계열 점수·trend 필드 반환.

---

## 개발 로드맵 (대시보드 관점)

전체 Phase 3 순서는 [ROADMAP.md](./ROADMAP.md)를 따릅니다.

| Milestone | 내용 | 선행 조건 | 예상 |
|-----------|------|-----------|------|
| **M0~M2** | SKIL · MCP · 자기 교정 | — | ROADMAP 참조 |
| **M3a: MVP UI** | 현황판 + 수동 진단 (MCP 결과 표시) | M1 | 2주 |
| **M3b: History** | 이력·추이·교정 리포트 뷰 | M2 | 1주 |
| **M3c: Automation** | Cron 진단, 스케줄 UI | M3a | 1주 |
| **M4: Bots** | Slack/Telegram, 팀 공유·RBAC | M3b | 2주 |
| **M5: Production** | Auth, 멀티테넌시, 감사 로그 | M4 | 2주 |

---

## 시작하기 (Quick Start)

```bash
npx create-next-app@latest startup-ciso-dashboard --typescript --tailwind --eslint
npm install @anthropic-ai/sdk openai recharts zustand @tanstack/react-query
npm install next-auth @vercel/postgres @vercel/kv resend
# MCP 서버는 ../mcp 에서 별도 기동
npm run dev
```

---

## 관련 문서

- [ROADMAP.md](./ROADMAP.md) — SKIL → MCP → 교정 → 봇 전체 로드맵
- [STARTUP_SECURITY_GUIDE_KR.md](./STARTUP_SECURITY_GUIDE_KR.md)
- [LLM_CISO_PROMPT_KR.md](./LLM_CISO_PROMPT_KR.md)

> **Maintained by:** [Dennis Kim](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)
>
> © 2026 · LLM CISO Dashboard · Phase 3 M3 (Planned)
