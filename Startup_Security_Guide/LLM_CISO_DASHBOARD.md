# 📊 LLM CISO 대시보드 — 스타트업 보안 현황판

> **Phase 3: 대시보드 UI/UX 및 실시간 모니터링 (작업 예정)**
> *LLM CISO — Vercel + TypeScript + Node.js 기반*

![Phase](https://img.shields.io/badge/Phase-3%20(Dashboard)-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Planned-lightgrey?style=flat-square)

---

## 개요

LLM CISO 대시보드는 [Phase 1 가이드](./STARTUP_SECURITY_GUIDE_KR.md)와 [Phase 2 프롬프트](./LLM_CISO_PROMPT_KR.md)를 기반으로,
스타트업의 보안 상태를 **실시간 대시보드**로 시각화하고 **정기 진단을 자동화**하는 웹 애플리케이션입니다.

---

## 주요 기능 (Planned)

### 1. 보안 현황 대시보드
- 전체 보안 점수 (0~100) 및 등급 (A~F)
- 도메인별 점수: 클라우드 / Google Workspace / DRM / 법규 준수
- 위험 등급별 이슈 카운트 (Critical / High / Medium / Low)
- 시계열 점수 변화 그래프

### 2. 자동 진단 스케줄러
- 주간/월간/분기별 자동 보안 진단
- Slack·Email·Notion으로 리포트 발송
- 이전 진단 대비 개선/악화 항목 하이라이트

### 3. 조치 로드맵 트래커
- Sprint 단위 보안 개선 태스크
- 담당자·기한·진행률 관리
- JIRA·Linear·GitHub Issues 연동

### 4. 컴플라이언스 스코어카드
- KISA·개인정보보호법 준수 현황
- 위반/주의/준수 항목 시각화
- 규제 변경 알림

### 5. LLM 제공자 선택
- 퍼블릭 모드: Claude · GPT · DeepSeek
- 로컬 모드: Ollama (에어갭 보안)
- 하이브리드 모드: 민감 정보만 로컬 처리

---

## 기술 스택 (Planned)

```yaml
Frontend:
  Framework: Next.js 15 (App Router)
  Styling: Tailwind CSS + shadcn/ui
  Charts: Recharts / Tremor
  State: Zustand + React Query

Backend:
  Runtime: Node.js 22 + TypeScript (Strict)
  API: Next.js Route Handlers / API Routes
  LLM: Anthropic SDK / OpenAI SDK / Ollama REST API

Infrastructure:
  Hosting: Vercel (Pro)
  Database: Vercel Postgres / PlanetScale
  Cache: Vercel KV (Redis)
  Cron: Vercel Cron Jobs (정기 진단)
  Auth: NextAuth.js (Google OAuth)

Integration:
  Slack: 진단 결과 알림
  Email: Resend (리포트 발송)
  Notion: 진단 리포트 저장
```

---

## 페이지 구조 (Wireframe)

```
/ciso                          → 대시보드 홈 (보안 현황판)
/ciso/assessment               → 진단 실행 & 결과
/ciso/assessment/[id]          → 진단 상세 리포트
/ciso/roadmap                  → 조치 로드맵 트래커
/ciso/compliance               → 컴플라이언스 스코어카드
/ciso/settings                 → 회사 정보·LLM 설정
/ciso/settings/llm             → LLM 제공자 설정 (Public/Local/Hybrid)
/ciso/settings/schedule        → 자동 진단 스케줄
/api/ciso/assess               → 진단 API (POST)
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

    <TrendChart />      {/* 시계열 점수 변화 */}

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
                  │         │
                  │         └──→ 진단 결과 (JSON)
                  │
                  ├──→ [Database] (PostgreSQL)
                  │         │
                  │         └──→ 과거 진단 이력 저장
                  │
                  └──→ [Dashboard UI] → [User]
                            │
                            └──→ [Slack/Email/Notion] 알림 발송
```

---

## API 설계 (Draft)

### `POST /api/ciso/assess`

```json
// Request
{
  "domain": "cloud | workspace | drm | compliance | all",
  "context": {
    "companyName": "Example Startup",
    "stage": "seed",
    "teamSize": 8,
    "cloudProvider": "aws",
    "workspace": "google",
    "additionalInfo": "루트 MFA만 설정됨, 그 외 기본값"
  }
}

// Response
{
  "id": "assess_20260617_001",
  "date": "2026-06-17T09:00:00Z",
  "overallScore": 72,
  "overallGrade": "B",
  "scores": {
    "cloud": 65,
    "workspace": 85,
    "drm": 60,
    "compliance": 68
  },
  "findings": [...],
  "roadmap": [...]
}
```

### `GET /api/ciso/trend?period=6m`

```json
// Response
{
  "period": "6 months",
  "dataPoints": [
    { "date": "2026-01-17", "score": 45 },
    { "date": "2026-02-17", "score": 52 },
    { "date": "2026-03-17", "score": 58 },
    { "date": "2026-04-17", "score": 63 },
    { "date": "2026-05-17", "score": 68 },
    { "date": "2026-06-17", "score": 72 }
  ],
  "trend": "improving"
}
```

---

## 개발 로드맵

| Milestone | 내용 | 예상 |
|-----------|------|------|
| **M1: MVP** | CLI 기반 진단 + JSON 출력 | 1주 |
| **M2: Web UI** | 대시보드 기본 UI, 수동 진단 | 2주 |
| **M3: Automation** | Cron 진단, Slack 알림, 이력 저장 | 3주 |
| **M4: Advanced** | 멀티 LLM 교차검증, 로컬 Ollama 연동 | 4주 |
| **M5: Production** | 인증, 멀티테넌시, 팀 대시보드 | 6주 |

---

## 시작하기 (Quick Start)

Phase 3 작업 시작 시:

```bash
# 프로젝트 생성
npx create-next-app@latest startup-ciso-dashboard --typescript --tailwind --eslint

# 의존성 설치
npm install @anthropic-ai/sdk openai recharts zustand @tanstack/react-query
npm install next-auth @vercel/postgres @vercel/kv resend

# 개발 서버
npm run dev
```

---

## 관련 문서

- [STARTUP_SECURITY_GUIDE_KR.md](./STARTUP_SECURITY_GUIDE_KR.md) — 보안 가이드 & 체크리스트
- [LLM_CISO_PROMPT_KR.md](./LLM_CISO_PROMPT_KR.md) — LLM CISO 페르소나 & 프롬프트

> **Maintained by:** [Dennis Kim](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)
>
> © 2026 · LLM CISO Dashboard · Phase 3 (Planned)
