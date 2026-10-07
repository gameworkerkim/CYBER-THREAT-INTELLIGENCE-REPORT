# Heimdallr — Core Concept

> LLM multi-agent autonomous penetration testing + cybersecurity knowledge accumulation system
> A **defense-first, authorization-verified** SaaS (Node.js + Neon + Cloudflare free tier) that inherits the ARTEX concept

---

> ## 🚨 Security & Abuse Warning — Read First
>
> Like ARTEX, Heimdallr is a **powerful autonomous offensive tool whose LLM can independently carry out reconnaissance, exploitation, and data exfiltration**. The purpose of this project is **not to aid attacks**, but to help defenders understand, detect, and block autonomous AI attacks.
>
> - **Unauthorized use is a crime.** Do not scan, probe, or exploit any system unless you own it or have explicit written authorization. Unauthorized intrusion into a network is illegal in most jurisdictions.
> - **Domain verification proves ownership, not authorization to attack.** Heimdallr's verification token only proves that "the person who controls this domain requested the test." Testing a real target still requires legal authority over that asset.
> - **Prefer local isolated environments.** For learning and research, use intentionally vulnerable environments you own (OWASP Juice Shop, DVWA, etc.).
>
> **The user assumes all legal responsibility and consequences.**

---

## 1. The Name

**Heimdallr** (Heimdall) is the Norse god who guards the Bifröst bridge and watches over the realm of the gods. With senses so keen he can hear the grass grow across the nine worlds, he stands watch — and when danger comes, he blows the **Gjallarhorn** to warn of Ragnarök.

The name captures this project's identity:

- **Watchman** — not an attacker, but a **guardian that detects intrusion and raises the alarm**.
- **Gatekeeper** — the symbol of an **authorization gate** that only legitimate owners may pass (the Bifröst bridge = domain verification).
- **Proactive warning** — the defense-first philosophy of accumulating attack knowledge **beforehand** to prepare.

> In short, Heimdallr is not an "attack tool," but a **"guardian that learns autonomous AI attacks in advance, permits experiments only to verified owners, and returns the results as defensive knowledge."**

---

## 2. Background: Starting from ARTEX

Heimdallr inherits the core concept of **ARTEX** (`Autumn-27/ARTEX`, AGPL-3.0).

| ARTEX core concept | How Heimdallr inherits it |
|---|---|
| LLM multi-agent autonomous pentest (planner/worker) | Reimplemented in Node.js with the same multi-agent structure |
| Dual graph (asset graph + exploration graph) | Knowledge/asset/exploration structured as graphs |
| Human-in-the-loop conversation | Real-time intervention from the dashboard |
| Report generation | Optional report export (Markdown/PDF/CSV) |
| Defense & detection artifacts (Sigma/Suricata/MISP) | Extended into **CyberSecurityWiki** |

Where ARTEX is a "locally installed autonomous pentest framework," Heimdallr turns it into a **web SaaS that anyone can use immediately**, adds **domain ownership verification + 24-hour limits** to prevent abuse, and focuses on accumulating results as **reusable knowledge (Wiki)**.

---

## 3. Core Principles (3 Pillars)

1. **Defense-first** — a tool that helps defenders understand, detect, and block autonomous AI attacks, not one that sells offensive capability.
2. **Authorization-first** — "domain ownership proof + domain-based email + 24-hour limit" forces only legitimate owners to request tests.
3. **Knowledge-first** — every test's techniques, know-how, and detection rules are accumulated into **CyberSecurityWiki** for reuse by other LLMs/MCPs.

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend · API (Cloudflare Pages + Workers, Node.js/Next.js) │
│    Dashboard · Domain verification · LLM keys · Reports · Wiki│
└──────────────┬──────────────────────────────────────────────┘
               │
   ┌───────────┴───────────────┐
   │  Control Plane (Worker)   │
   │  Auth · Authorization ·    │
   │  Scheduling               │
   └───────────┬───────────────┘
               │
   ┌───────────┴─────────────────────────────┐
   │  Agent Runtime (step-based, Queue + DO)  │
   │  planner · worker · mainagent            │
   └───┬──────────────────┬──────────────────┘
       │                  │
┌──────┴──────┐   ┌───────┴─────────┐
│  Neon        │   │  Cloudflare      │
│  PostgreSQL  │   │  KV / D1 / R2    │
│  (asset/explo-│  │  (tokens/session/│
│   ration/wiki)│   │   reports)       │
└──────────────┘   └─────────────────┘
        ▲
        │ MCP / llms.txt (external LLM reference)
   CyberSecurityWiki
```

| Layer | Role | Tech |
|---|---|---|
| Frontend/API | Dashboard, verification, reports | Next.js (Cloudflare Pages/Workers) |
| Control Plane | Auth, authorization, scheduling | Cloudflare Workers + Durable Objects |
| Agent Runtime | planner/worker/mainagent multi-agent | Cloudflare Queues + Durable Objects (step execution) |
| Database | Asset/exploration/Wiki knowledge graphs | **Neon** (serverless PostgreSQL, Hyperdrive) |
| Auxiliary storage | Tokens, sessions, report files | Cloudflare KV / D1 / R2 |
| Knowledge delivery | External LLM/MCP reference | `llms.txt` + MCP server + REST |

---

## 5. Core Features

### 5-1. BYOK Dashboard (Bring Your Own Key)

- Users enter their **own LLM API key** (Anthropic/OpenAI/OpenAI-compatible) → the server stores the key **encrypted** and the dashboard drives agents with it.
- Principle: **the platform never owns your key.** Serverless + BYOK means **the user bears token cost**; the platform provides compute only.
- Multilingual UI (Korean, English, Chinese, Japanese).

### 5-2. Domain Ownership Verification (Obfuscated Token + 24h)

To request a test, you must prove you actually **control the target domain**:

1. **Issue obfuscated token** — Heimdallr generates a random/obfuscated text.
2. **Place in a subdirectory** — the user places that text at a subdirectory of the domain (e.g., `https://domain/.well-known/heimdallr/<token>`).
3. **Verify** — Heimdallr fetches the path over HTTP and checks for a match (similar to Google Search Console / Let's Encrypt HTTP-01).
4. **24-hour limited authorization** — on success, testing is allowed for that domain (and registered scope) for **24 hours only**. Re-verification is required after expiry.

> **Domain-based email requirement:** the requester must have an email belonging to the target domain (e.g., `admin@domain.com`). **Free-email domains (gmail.com, naver.com, daum.net, kakao.com, etc.) cannot be used as test targets.** This enforces the dual ownership signal of "my domain + my domain email" to block abuse.

### 5-3. LLM Multi-agent Pentest

- Reimplements ARTEX's planner/worker/mainagent structure in Node.js.
- Autonomous reconnaissance → vulnerability discovery → graph accumulation within the verified domain/scope.
- Because of Cloudflare free-tier CPU limits, agents execute **step-by-step** (Queues + Durable Objects) rather than in one long-running request.

### 5-4. CyberSecurityWiki (Knowledge Accumulation)

- Accumulates each test's **techniques, know-how, detection rules, and remediations** into a structured wiki.
- Exposes `llms.txt` + MCP server + REST API so **other LLMs/MCPs can reference** it.
- See `cybersecurity-wiki.md` for details.

### 5-5. Report Export (Optional)

- After a test, export reports as **Markdown / PDF / CSV (finding list)**.
- A **defender-oriented report** option that includes detection rules (Sigma) and a hardening checklist.

---

## 6. Tech Stack

| Area | Choice | Rationale |
|---|---|---|
| Language | **Node.js (TypeScript)** | Cloudflare edge-native, rich MCP/LLM ecosystem |
| Frontend/API | **Next.js** (Cloudflare Pages + Workers) | Single codebase, static + API unified |
| Database | **Neon** (serverless PostgreSQL) | Has free tier, TCP via Cloudflare Hyperdrive |
| Auxiliary storage | Cloudflare KV / D1 / R2 | Stateless data (tokens, sessions, reports) |
| Agent execution | Cloudflare Queues + Durable Objects | Step-based execution within free-tier CPU limits |
| Knowledge delivery | `llms.txt` + MCP server + REST | Easy reference by external LLMs |

---

## 7. Abuse-Prevention Guardrails

| Guardrail | Description |
|---|---|
| Domain ownership verification | Subdirectory obfuscated-token check |
| Domain-based email | Excludes free-email domains (gmail, naver, daum, kakao, etc.) |
| 24-hour authorization | Only 24h after verification; re-verify on expiry |
| Fixed scope | Blocks targeting outside the verified domain/registered scope |
| Intercept approval | Human approval before dangerous tool calls |
| Audit logging | Records every execution and request |
| Defense-first output | Results feed back as detection rules and hardening guidance |

---

## 8. License & Legal Notice

- Follows ARTEX's AGPL-3.0 spirit; final license (AGPL-3.0 or compatible) to be confirmed at implementation.
- Domain verification proves ownership only; it does **not** guarantee legal authority to test a real target. Explicit ownership/operational/contractual authority is still required.
- The user assumes all legal responsibility and consequences.

---

## 9. Roadmap (Proposal)

| Phase | Content |
|---|---|
| M0 | Finalize concept/differentiation/architecture docs (this document set) |
| M1 | Dashboard MVP + domain verification + BYOK key management |
| M2 | Multi-agent runtime (planner/worker) + Neon graph |
| M3 | CyberSecurityWiki + `llms.txt`/MCP delivery |
| M4 | Report export + automatic detection-rule generation |
| M5 | Full i18n + free-tier deployment optimization |
