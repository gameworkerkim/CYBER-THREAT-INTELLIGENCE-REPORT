# LLM CISO Dashboard -- Startup Security Command Center

> **Phase 3 M3:** Web dashboard visualizing SKIL · MCP · self-correction results
> *Full roadmap: [ROADMAP_EN.md](./ROADMAP_EN.md)*

![Phase](https://img.shields.io/badge/Phase-3%20(Dashboard%20M3)-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Planned-lightgrey?style=flat-square)
![Depends](https://img.shields.io/badge/Depends-M0%20SKIL%20%7C%20M1%20MCP-blue?style=flat-square)

---

## Overview

The LLM CISO Dashboard builds on the [Phase 1 Guide](./STARTUP_SECURITY_GUIDE_EN.md) and [Phase 2 Prompt System](./LLM_CISO_PROMPT_EN.md), restructured as **SKIL**, executed and validated via **MCP**, and visualized as a self-hosted web app.

> **Dependency:** Prefer M0 (SKIL) → M1 (MCP) → M2 (self-correction) before M3 (this dashboard). Bots and team sharing are M4.

**Core value proposition:** A founder or engineering lead opens one dashboard and sees, in real time, whether the company is compliant with GDPR, CCPA, and Korean PIPA -- and what to fix next. No security team required.

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
- Weekly/monthly/quarterly automated security assessments (LLM + MCP tools)
- Cron-based execution via Vercel Cron Jobs
- Report delivery: Slack Bot, Telegram Bot, Email (Resend), Notion (M4)
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

### 6. Self-Correction Report (M2)
- Contrast LLM draft findings vs MCP validation
- Correction history by L1–L4 mistake levels
- Approve/reject suggested fixes (auto-apply OFF by default)

### 7. Team Sharing & RBAC (M4)
- Shareable assessment links, issue comments and status
- Roles: Owner / Security Lead / Member / Viewer

### 8. MCP Scan Summary
- Recent Gitleaks / Trivy / Prowler results on the scoreboard

---

## Tech Stack (Planned)

```yaml
Knowledge:
  SKIL: YAML/JSON controls, policies, playbooks, schemas

Agent:
  Protocol: MCP
  Tools: skil_lookup, gitleaks_scan, trivy_scan, prowler_scan, validate_assessment

Frontend:
  Framework: Next.js 15 (App Router)
  Styling: Tailwind CSS + shadcn/ui
  Charts: Recharts / Tremor
  State: Zustand + TanStack React Query

Backend:
  Runtime: Node.js 22 + TypeScript (Strict)
  API: Next.js Route Handlers
  LLM: Anthropic SDK / OpenAI SDK / Ollama REST API
  MCP Client: dashboard jobs → mcp/ server

Infrastructure:
  Hosting: Vercel (Pro)
  Database: Vercel Postgres
  Cache: Vercel KV (Redis)
  Cron: Vercel Cron Jobs
  Auth: NextAuth.js (Google OAuth)

Integration:
  Slack Bot / Telegram Bot: assessment & correction alerts (M4)
  Email: Resend
  Notion: report archive
```

---

## Page Structure (Wireframe)

```
/dashboard                      -> Security overview (scoreboard)
/dashboard/assessment            -> Run assessment & view results
/dashboard/assessment/[id]       -> Detailed assessment report
/dashboard/corrections           -> Self-correction reports (M2)
/dashboard/compliance            -> Cross-jurisdiction compliance map
/dashboard/roadmap               -> Remediation roadmap tracker
/dashboard/team                  -> Team sharing (M4)
/dashboard/settings              -> Company profile & preferences
/dashboard/settings/llm          -> LLM provider configuration
/dashboard/settings/schedule     -> Automated assessment schedule
/dashboard/settings/notifications -> Slack / Telegram / Email
/api/ciso/assess                 -> Assessment API (POST)
/api/ciso/validate               -> MCP validation API (POST)
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

Follow the full Phase 3 sequence in [ROADMAP_EN.md](./ROADMAP_EN.md). Dashboard-centric milestones:

| Milestone | Scope | Prerequisite | Timeline |
|-----------|-------|--------------|----------|
| **M0–M2** | SKIL · MCP · Self-correction | — | See ROADMAP |
| **M3a: MVP UI** | Scoreboard + manual assess (MCP results) | M1 | Week 1–2 |
| **M3b: History** | History, trends, correction views | M2 | Week 2–3 |
| **M3c: Automation** | Cron assessments, schedule UI | M3a | Week 3–4 |
| **M4: Bots** | Slack/Telegram, team share, RBAC | M3b | Week 4–6 |
| **M5: Production** | Auth, multi-tenancy, audit logs | M4 | Week 6–8 |

---

## Quick Start (When Phase 3 M3 Begins)

```bash
# Create project
npx create-next-app@latest startup-ciso-dashboard --typescript --tailwind --eslint

# Install dependencies
npm install @anthropic-ai/sdk openai recharts zustand @tanstack/react-query
npm install next-auth @vercel/postgres @vercel/kv resend
npm install @shadcn/ui

# MCP server runs separately from ../mcp
# Start development
npm run dev
```

---

## Related Documents

- [ROADMAP_EN.md](./ROADMAP_EN.md) -- SKIL → MCP → correction → bots
- [README_EN.md](./README_EN.md) -- Project overview and value proposition
- [STARTUP_SECURITY_GUIDE_EN.md](./STARTUP_SECURITY_GUIDE_EN.md) -- Full security guide with jurisdiction comparison
- [LLM_CISO_PROMPT_EN.md](./LLM_CISO_PROMPT_EN.md) -- LLM CISO persona and prompt system

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) | [github.com/gameworkerkim](https://github.com/gameworkerkim/)
>
> (c) 2026 | LLM CISO Dashboard | Phase 3 M3 (Planned)
