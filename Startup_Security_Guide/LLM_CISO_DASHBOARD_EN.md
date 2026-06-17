# LLM CISO Dashboard -- Startup Security Command Center

> Phase 3: Web-based CISO dashboard with cross-jurisdiction compliance visualization (Planned)

![Phase](https://img.shields.io/badge/Phase-3%20(Dashboard)-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Planned-lightgrey?style=flat-square)

---

## Overview

The LLM CISO Dashboard builds on the [Phase 1 Guide](./STARTUP_SECURITY_GUIDE_EN.md) and [Phase 2 Prompt System](./LLM_CISO_PROMPT_EN.md) to deliver a self-hosted web application where startups monitor their security posture, track compliance across jurisdictions, and receive automated assessments from the LLM CISO.

**Core value proposition:** A startup founder or engineering lead opens one dashboard and sees, in real time, whether their company is compliant with GDPR, CCPA, and Korean PIPA -- and what to fix next. No security team required.

---

## Planned Features

### 1. Security Scoreboard
- Overall security score (0-100) and letter grade (A-F)
- Per-domain scores: Cloud / Google Workspace / DRM / GDPR / CCPA / PIPA
- Risk-tiered issue counts (Critical / High / Medium / Low)
- Time-series score trends with improvement/decline indicators

### 2. Cross-Jurisdiction Compliance Map
- Side-by-side jurisdiction comparison view (GDPR vs. CCPA vs. PIPA)
- Gap matrix: 25-dimension compliance grid with color coding
- "Day 1 Readiness" checklist for new market entry
- Regulatory deadline tracker with alerting

### 3. Automated Assessment Scheduler
- Weekly/monthly/quarterly automated security assessments
- Cron-based execution via Vercel Cron Jobs
- Report delivery: Slack, Email (Resend), Notion
- Historical assessment archive with diff-from-previous

### 4. Remediation Roadmap Tracker
- Sprint-based security improvement tasks
- Assignee, deadline, and progress tracking
- Integration with JIRA, Linear, GitHub Issues
- Effort estimates (Low / Medium / High)

### 5. LLM Provider Configuration
- Public mode: Claude, GPT, DeepSeek (selectable)
- Local mode: Ollama (air-gapped, no data exfiltration)
- Hybrid mode: Sensitive data processed locally, general assessment via public LLM
- Provider health status and latency monitoring

---

## Tech Stack (Planned)

```yaml
Frontend:
  Framework: Next.js 15 (App Router)
  Styling: Tailwind CSS + shadcn/ui
  Charts: Recharts / Tremor
  State: Zustand + TanStack React Query

Backend:
  Runtime: Node.js 22 + TypeScript (Strict)
  API: Next.js Route Handlers
  LLM: Anthropic SDK / OpenAI SDK / Ollama REST API
  PDF Generation: @react-pdf/renderer (assessment reports)

Infrastructure:
  Hosting: Vercel (Pro)
  Database: Vercel Postgres
  Cache: Vercel KV (Redis)
  Cron: Vercel Cron Jobs
  Auth: NextAuth.js (Google OAuth)

Integration:
  Slack: Assessment result notifications
  Email: Resend (report delivery)
  Notion: Assessment report archiving
  GitHub: Remediation ticket creation
```

---

## Page Structure (Wireframe)

```
/dashboard                      -> Security overview (scoreboard)
/dashboard/assessment            -> Run assessment & view results
/dashboard/assessment/[id]       -> Detailed assessment report
/dashboard/compliance            -> Cross-jurisdiction compliance map
/dashboard/roadmap               -> Remediation roadmap tracker
/dashboard/settings              -> Company profile & preferences
/dashboard/settings/llm          -> LLM provider configuration
/dashboard/settings/schedule     -> Automated assessment schedule
/api/ciso/assess                 -> Assessment API (POST)
/api/ciso/report/[id]            -> Report API (GET)
/api/ciso/trend                  -> Trend data API (GET)
/api/ciso/jurisdiction-map       -> Jurisdiction compliance data (GET)
```

---

## Component Tree (Planned)

```
<CisoDashboard>
  <Header>
    <CompanySelector />
    <JurisdictionBadges />   <!-- Shows active jurisdictions: GDPR, PIPA, CCPA -->
    <AssessmentTrigger />
    <SettingsMenu />
  </Header>

  <ScoreOverview>
    <OverallScoreGauge score={78} grade="B" />
    <DomainScoreCards>
      <ScoreCard domain="cloud" score={72} />
      <ScoreCard domain="workspace" score={85} />
      <ScoreCard domain="drm" score={60} />
      <ScoreCard domain="gdpr" score={80} />
      <ScoreCard domain="pipa" score={55} />      <!-- Highlight: gap to close -->
      <ScoreCard domain="ccpa" score={75} />
    </DomainScoreCards>
  </ScoreOverview>

  <MainContent>
    <JurisdictionGapPanel>      <!-- Cross-jurisdiction compliance map -->
      <GapMatrix />
      <DayOneChecklist />
    </JurisdictionGapPanel>

    <IssuesPanel>
      <IssueList severity="critical" />
      <IssueList severity="high" />
      <IssueList severity="medium" />
    </IssuesPanel>

    <TrendChart />              <!-- Time-series score evolution -->

    <RoadmapPreview />          <!-- Next 4 sprint tasks -->

    <ComplianceDeadlineTracker />
  </MainContent>

  <Footer>
    <LastAssessment />
    <NextScheduled />
    <ProviderStatus />          <!-- LLM provider health -->
  </Footer>
</CisoDashboard>
```

---

## Data Flow

```
[User / Cron Trigger] --> [Vercel Edge Function]
                              |
                              +--> [LLM Provider] (Claude / GPT / DeepSeek / Ollama)
                              |        |
                              |        +--> Assessment Result (JSON)
                              |
                              +--> [PostgreSQL] (Assessment history)
                              |        |
                              |        +--> Trend data for dashboard
                              |
                              +--> [Vercel KV] (Cached results, rate limiting)
                              |
                              +--> [Dashboard UI] --> [User Browser]
                              |
                              +--> [Slack / Email / Notion] (Notification delivery)
```

---

## API Design (Draft)

### `POST /api/ciso/assess`

```json
// Request
{
  "domain": "cross-jurisdiction | cloud | workspace | drm | gdpr | pipa | all",
  "context": {
    "companyName": "Example Startup Inc.",
    "homeCountry": "us",
    "homeJurisdiction": "ccpa",
    "targetCountry": "kr",
    "targetJurisdiction": "pipa",
    "stage": "series-a",
    "teamSize": 25,
    "cloudProvider": "aws",
    "workspace": "google",
    "dataTypes": ["name", "email", "phone"],
    "processingRRN": false,
    "ispServiceProvider": true
  }
}

// Response
{
  "id": "assess_20260617_001",
  "date": "2026-06-17T09:00:00Z",
  "overallScore": 68,
  "overallGrade": "C",
  "scores": {
    "cloud": 72,
    "workspace": 85,
    "drm": 60,
    "gdpr": 80,
    "ccpa": 75,
    "pipa": 55
  },
  "jurisdictionGaps": [
    {
      "id": "GAP-001",
      "dimension": "CPO Designation",
      "homeRequirement": "Not required (CCPA)",
      "targetRequirement": "Required for ALL entities (PIPA Art. 31)",
      "gap": "CRITICAL",
      "action": "Designate CEO or executive as CPO; document in Korean",
      "effort": "LOW"
    }
  ],
  "findings": [...],
  "dayOneChecklist": [...],
  "roadmap": [...]
}
```

### `GET /api/ciso/trend?period=6m&jurisdiction=pipa`

```json
{
  "jurisdiction": "pipa",
  "period": "6 months",
  "dataPoints": [
    { "date": "2026-01-17", "score": 35 },
    { "date": "2026-02-17", "score": 42 },
    { "date": "2026-03-17", "score": 48 },
    { "date": "2026-04-17", "score": 50 },
    { "date": "2026-05-17", "score": 52 },
    { "date": "2026-06-17", "score": 55 }
  ],
  "trend": "improving",
  "projectedCompliance": "2026-08-15"
}
```

---

## Development Roadmap

| Milestone | Scope | Timeline |
|-----------|-------|----------|
| **M1: CLI MVP** | Command-line assessment tool with JSON output; single LLM provider; basic jurisdiction comparison | Week 1 |
| **M2: Web UI** | Dashboard with scoreboard, manual assessment trigger, basic report view | Week 2-3 |
| **M3: Automation** | Cron-based scheduled assessments, Slack/Email notifications, history storage, trend charts | Week 3-4 |
| **M4: Cross-Jurisdiction** | Jurisdiction gap matrix, compliance map visualization, day-one checklist generation | Week 4-5 |
| **M5: Multi-LLM** | Provider switching (Claude/GPT/DeepSeek/Ollama), hybrid mode, provider health monitoring | Week 5-6 |
| **M6: Production** | Authentication, multi-tenancy, team dashboard, remediation tracker | Week 6-8 |

---

## Quick Start (When Phase 3 Begins)

```bash
# Create project
npx create-next-app@latest startup-ciso-dashboard --typescript --tailwind --eslint

# Install dependencies
npm install @anthropic-ai/sdk openai recharts zustand @tanstack/react-query
npm install next-auth @vercel/postgres @vercel/kv resend
npm install @shadcn/ui

# Start development
npm run dev
```

---

## Related Documents

- [README_EN.md](./README_EN.md) -- Project overview and value proposition
- [STARTUP_SECURITY_GUIDE_EN.md](./STARTUP_SECURITY_GUIDE_EN.md) -- Full security guide with jurisdiction comparison
- [LLM_CISO_PROMPT_EN.md](./LLM_CISO_PROMPT_EN.md) -- LLM CISO persona and prompt system

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) | [github.com/gameworkerkim](https://github.com/gameworkerkim/)
>
> (c) 2026 | LLM CISO Dashboard | Phase 3 (Planned)
