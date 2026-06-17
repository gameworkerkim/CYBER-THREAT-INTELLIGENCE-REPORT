# Startup Security Guide & LLM CISO

> An open-source security guide, compliance checklist, and LLM-based virtual CISO persona for startups -- with specialized coverage for foreign companies entering the Korean market.

---

## The Problem

**Startups are vulnerable.** Limited resources, no dedicated CISO, and security always deferred to "later." But customer data and intellectual property accumulate from day one -- and legal obligations apply regardless of company size.

Three incidents from Korea in the first half of 2026 demonstrate that one misconfiguration can cascade into existential damage:

- **Tving Data Breach (2026.06):** Mass exposure of CI (Connecting Information, Korea's digital identity key) and refund bank account numbers. Classified as a "major breach" by the Personal Information Protection Commission. The leaked CI enables cross-service identity correlation, multiplying the damage. (CTI-2026-0604-TVING)
- **CU Convenience Store Delivery Hack (2026.06):** A simple web vulnerability led to the exfiltration of CI, addresses, phone numbers, and 9+ other data fields. The leaked data was linked to illegal private investigator inquiries and secondary crimes. (CTI-2026-0604-CU_BREACH)
- **FastCampus / DayOne Company GitHub Master Key Theft (2026.06):** A single GitHub master key was exfiltrated, granting attackers 30 days of undetected access to internal systems. Over 700,000 user records were exposed. The company took approximately 30 days to detect the breach, and customer notification was delayed beyond 72 hours. (CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY)

**The common thread:** All three began with a single misconfiguration or a single overlooked vulnerability. None required sophisticated zero-days. The damage was inversely proportional to organizational maturity.

What startups need is not a $100K security suite. It is **knowing what to do first**, and **a system to check it regularly**.

---

## The Core Hypothesis

**An LLM can serve as a startup's first CISO.**

As of mid-2026, Claude 4, GPT-4o, and DeepSeek V3 -- alongside locally-run models via Ollama -- can:

- Evaluate structured security checklists and identify gaps
- Analyze cloud IAM policies, network ACLs, and encryption configurations
- Review compliance against KISA (Korea Internet & Security Agency) standards, GDPR, CCPA, and cross-jurisdictional requirements
- Generate concrete remediation code and configuration guides for discovered issues

A **hybrid model** -- where proprietary data stays on-premise with local LLMs (Ollama) and general policy assessment uses public LLMs -- makes this production-ready today.

This project implements that hypothesis in code and prompts.

---

## Why This Matters for Foreign Startups Entering Korea

Korea is Asia's fourth-largest economy and a strategic launch market for SaaS, fintech, AI, and consumer platforms. But its data protection regime presents unique challenges that differ significantly from GDPR and CCPA:

| Dimension | GDPR (EU) | CCPA/CPRA (US/CA) | PIPA (Korea) |
|-----------|-----------|-------------------|--------------|
| **Regulator** | National DPA per member state | California AG / CPPA | Personal Information Protection Commission |
| **Breach Notification** | 72 hours to DPA | Without unreasonable delay | 72 hours to data subject; 24 hours to KISA for ISPs |
| **Data Protection Officer** | Required for most processors | Not required (but privacy officer recommended) | CPO required for ALL entities, regardless of size |
| **Encryption** | Appropriate technical measures | Reasonable security | **Mandatory AES-256** for unique identifiers (RRN, passport, etc.), SHA-256+ for passwords |
| **Access Logs** | Retention per purpose | Not specified | **Mandatory 6 months minimum**; monthly review for ISPs |
| **Cross-border Transfer** | Adequacy decision / SCCs / BCR | No specific restriction | **Data subject consent required** for overseas transfer |
| **Penalties** | Up to 4% of global turnover or EUR 20M | Up to $7,500 per violation | Up to KRW 30M fines + **criminal liability** |
| **Resident Registration Number** | N/A | N/A | **Collection prohibited** unless specifically required by law |

**Key Insight:** A GDPR-compliant EU startup is not automatically PIPA-compliant in Korea. The Korean law has stricter encryption mandates, mandatory access logging, and a universal CPO requirement that has no equivalent in GDPR or CCPA. Violations carry criminal penalties, not just civil fines.

This project's LLM CISO persona includes jurisdiction-aware compliance modules that flag these gaps automatically.

---

## Project Structure

```
Startup_Security_Guide/
├── README.md                        # Korean README
├── README_EN.md                     # This document: English README
├── STARTUP_SECURITY_GUIDE_KR.md     # Phase 1: Korean guide & checklist
├── STARTUP_SECURITY_GUIDE_EN.md     # Phase 1: English guide (with jurisdiction comparison)
├── LLM_CISO_PROMPT_KR.md            # Phase 2: Korean CISO prompt system
├── LLM_CISO_PROMPT_EN.md            # Phase 2: English CISO prompt system (cross-jurisdiction)
├── LLM_CISO_DASHBOARD.md            # Phase 3: Dashboard design (Korean)
├── LLM_CISO_DASHBOARD_EN.md         # Phase 3: Dashboard design (English)
└── llms.txt                         # LLM-friendly index
```

### Phase 1: STARTUP_SECURITY_GUIDE_EN.md

A comprehensive, stage-gated security guide covering the startup lifecycle from pre-seed to Series A. Based on KISA guidelines and the MINARC framework ([startup-security.netlify.app](https://startup-security.netlify.app/)), extended with:

- **Cloud Security:** Per-provider checklists for AWS (15 items), GCP (12 items), Azure (10 items), and Vercel (10 items). IAM least privilege, network security, encryption, logging, CSPM tools, CI/CD secrets management.
- **Google Workspace Security:** Admin console configuration (Gmail, Drive, Docs, third-party apps, endpoint management), SPF/DKIM/DMARC, DLP rules, external sharing audit routine.
- **DRM & Document Security:** Classification framework, Google Drive IRM, DRM tool comparison, source code protection, offboarding account revocation.
- **Cross-Jurisdictional Compliance:** Side-by-side comparison of GDPR, CCPA, and PIPA requirements. What an EU/US startup must change to operate legally in Korea.
- **Incident Response:** NIST SP 800-61-based six-stage framework with Korea-specific reporting deadlines.
- **Stage-Gate Compliance:** Release gate criteria from development through production launch.

**Usage:** Open in a browser to follow the checklist, or provide the full document as context to an LLM and ask: "Evaluate our company against this checklist."

### Phase 2: LLM_CISO_PROMPT_EN.md

A persona prompt system that transforms any LLM into a virtual CISO with explicit cross-jurisdictional expertise. Includes:

| Component | Description |
|-----------|-------------|
| Base CISO Persona | 15-year veteran CISO with pragmatic, action-oriented style. NIST CSF-based methodology, standardized response format. |
| Korea Compliance Module | Deep knowledge of PIPA, Network Act, Unfair Competition Prevention Act. KISA security standards. |
| GDPR/CCPA Module | EU and US privacy law expertise for cross-referencing compliance gaps. |
| Cross-Jurisdiction Diff Module | **New.** Specifically detects where GDPR/CCPA compliance does NOT satisfy Korean requirements, and vice versa. |
| Domain Assessment Prompts | Cloud / Google Workspace / DRM / KISA compliance / GDPR compliance / Quick scan. Each with 25-31 evaluation items. |
| Prompt Chain | 6-step multi-stage assessment: Context Gathering -> Parallel Domain Assessment -> Cross-Jurisdiction Gap Analysis -> Synthesis -> Final Report -> Action Plan. |
| Ollama Modelfile | Custom model creation script for air-gapped local CISO operation. |
| TypeScript/Node.js Integration | API invocation code for Claude, GPT, DeepSeek. Ollama Provider implementation. Vercel Serverless Function. |

**Usage -- Public LLM:**

```
1. Copy the "Base CISO Persona" section from LLM_CISO_PROMPT_EN.md as System Prompt
2. Copy the desired domain assessment prompt as User Message
3. Provide specific company context (jurisdiction, data types, stage)
```

**Usage -- Local LLM (Ollama):**

```bash
# 1. Install Ollama
brew install ollama            # macOS
# or: curl -fsSL https://ollama.ai/install.sh | sh  # Linux

# 2. Pull a model
ollama pull llama3:8b          # or gemma3:12b, qwen2.5:14b

# 3. Create CISO custom model (see LLM_CISO_PROMPT_EN.md section 5.2)
cat > Modelfile << 'EOF'
FROM llama3:8b
SYSTEM """You are a Virtual CISO for startups, specializing in cross-jurisdictional
compliance (GDPR, CCPA, PIPA/Korea). You identify gaps where compliance in one
jurisdiction does not satisfy another..."""
PARAMETER temperature 0.3
EOF

ollama create ciso-global -f Modelfile

# 4. Run assessment
ollama run ciso-global "We are a US-based SaaS startup (Series A, 25 employees, AWS + Google Workspace)
expanding into Korea. We comply with CCPA. What additional measures do we need for PIPA?"
```

**Usage -- TypeScript/Node.js (Vercel deployment):**

```bash
git clone https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT.git
cd CYBER-THREAT-INTELLIGENCE-REPORT/Startup_Security_Guide

# Install dependencies (see LLM_CISO_PROMPT_EN.md section 7.6)
npm install

# Set environment
export ANTHROPIC_API_KEY="sk-ant-..."
export CISO_MODE="public"   # or "local" for Ollama

# Run cross-jurisdiction assessment
npm run assess -- --domain cross-jurisdiction \
  --context '{"homeCountry":"us","targetCountry":"kr","stage":"series-a","teamSize":25}'
```

### Phase 3: LLM_CISO_DASHBOARD_EN.md

Web-based CISO dashboard design document. Planned implementation with Next.js + Vercel + TypeScript:

- Security scoreboard (overall score, per-domain scores, risk-tiered issue counts)
- Automated assessment scheduler (cron-based periodic evaluation, Slack/Email reports)
- Remediation roadmap tracker (sprint-based security tasks, JIRA/Linear integration)
- Compliance scorecard (KISA, GDPR, CCPA compliance status visualization)
- LLM provider selector (Public Claude/GPT/DeepSeek, Local Ollama, Hybrid mode)

---

## Development Roadmap

```
Phase 1 (Done)     Phase 2 (Done)      Phase 3 (Planned)    Phase 4 (Planned)
     |                   |                     |                    |
     v                   v                     v                    v
Security Guide     LLM CISO Persona      Web Dashboard        Unified Monitoring
& Checklist        & Prompt System                             Framework
                                           |                    |
                                           +-- CLI MVP          +-- Wazuh/XDR integration
                                           +-- Web UI           +-- Real-time alerts
                                           +-- Cron automation  +-- SIEM integration
                                           +-- Multi-LLM        +-- Team dashboard
```

The end goal is a self-hosted dashboard that startups access daily. Not merely a checklist viewer, but an integrated monitoring system where the LLM periodically scans infrastructure, detects anomalies, and prioritizes remediation actions -- functioning as an always-on virtual CISO.

---

## Similar Projects & References (Awesome LLM CISO)

Curated evaluation of open-source and research projects relevant to AI-assisted security governance. Current as of June 2026.

### A. Directly Comparable Projects (Virtual CISO / AI Security Advisor)

| Project | Stars | Assessment |
|----------|-------|------------|
| [intuitem/ciso-assistant-community](https://github.com/intuitem/ciso-assistant-community) | 4.1k | **Benchmark.** The definitive open-source GRC platform. Supports 150+ frameworks (ISO 27001, NIST CSF, SOC 2, GDPR, PCI DSS, NIS2, DORA, HIPAA) with automatic control mapping. Python/Django. Currently lacks LLM integration, but the structured compliance knowledge base makes it a natural candidate for LLM augmentation. This is the north star for what an LLM CISO could orchestrate. |
| [sarfaraz-munir/Claude-Code-Cyber-agents](https://github.com/sarfaraz-munir/Claude-Code-Cyber-agents) | N/A | **Direct competitor.** Hierarchical CISO agent swarm for Claude Code. 10 specialist agents covering risk governance, compliance, threat intelligence, vulnerability management, incident response, and AI security. TypeScript-based with MCP tools. Swarm architecture is noteworthy, but lacks Korean jurisdiction support and local LLM capability. |
| [SiteQ8/CISO-Dashboard](https://github.com/SiteQ8/CISO-Dashboard) | 3 | **UI reference.** Open-source CISO dashboard showing KPIs, control coverage, incidents, and risk posture. JavaScript. Good reference for dashboard metrics and layout. No LLM functionality. |
| [l9rins/aws-cloud-security-policy-advisor](https://github.com/l9rins/aws-cloud-security-policy-advisor) | N/A | **Domain reference.** AI-powered AWS security policy advisor for startups. Generates IAM least-privilege policies, encryption standards, and compliance checklists based on CIS Benchmarks, SOC 2, and GDPR. Single-cloud (AWS) focus; no multi-cloud or cross-jurisdiction capability. |
| [michael-markevich/startup-security-checklist](https://github.com/michael-markevich/startup-security-checklist) | N/A | **Checklist reference.** Security essentials checklist for early-stage startups. Static, no LLM integration. Similar to a simplified English version of STARTUP_SECURITY_GUIDE_EN.md. |

### B. LLM + Security Automation Tools

| Project | Stars | Assessment |
|----------|-------|------------|
| [kennedyraju55/gdpr-compliance-checker](https://github.com/kennedyraju55/gdpr-compliance-checker) | N/A | **Architecture reference.** Local Gemma 4 LLM (Ollama) for GDPR compliance checking. 100% private processing. Demonstrates the local-LLM-for-compliance pattern. Extending this to include Korean PIPA would replicate this project's hybrid approach. |
| [Sbharadwaj05/sb-siem-mcp](https://github.com/Sbharadwaj05/sb-siem-mcp) | 10 | **Integration pattern.** MCP server connecting LLMs to Wazuh SIEM. Natural language threat hunting, alert analysis, compliance checks through 28 security tools. Shows how an LLM CISO can interface with real security infrastructure. |
| [LakshyaJ1/HivePro_Assignment](https://github.com/LakshyaJ1/HivePro_Assignment) | N/A | **RAG pattern.** Evidence-first automated risk assessment system. Retrieves NIST SP 800-53 controls via hybrid RAG and generates CISO-level briefings through constrained LLM narration. |
| [PrayasPanda/llm-redteam](https://github.com/PrayasPanda/llm-redteam) | 1 | **Red team module.** Automated security auditing framework for LLMs. Multi-category red teaming attacks to evaluate model robustness and safety. Useful as a security testing module within an LLM CISO platform. |
| [raghu-007/LLM-Powered-Kubernetes-Security-Compliance-for-AI](https://github.com/raghu-007/LLM-Powered-Kubernetes-Security-Compliance-for-AI) | 2 | **K8s compliance.** LLM-powered Kubernetes security compliance auditing for AI/ML workloads. Demonstrates LLM-for-compliance in an infrastructure context. |

### C. Startup Security & AI Governance References

| Project | Stars | Assessment |
|----------|-------|------------|
| [rushout09/llm-security-startups](https://github.com/rushout09/llm-security-startups) | 15 | **Market landscape.** Curated list of LLM security startups. Covers LLM firewalls, red-teaming tools, guardrails, and AI security posture management companies. Useful for understanding the competitive ecosystem. |
| [AIShieldLabs/ai-secure-checklist](https://github.com/AIShieldLabs/ai-secure-checklist) | N/A | **AI security specialized.** 50-point AI security assessment for startups. Covers MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, and EU AI Act. Useful supplement when the startup itself deploys AI. |
| [AnimeshShaw/agentic-ai-security-guide](https://github.com/AnimeshShaw/agentic-ai-security-guide) | 1 | **Leadership guidance.** Agentic AI security guide for CISOs, CTOs, and board members. Covers threats, OWASP LLM Top 10, governance, compliance frameworks, and a 12-month action plan. Good knowledge base source. |
| [overcrash66/LocalGuard](https://github.com/overcrash66/LocalGuard) | 4 | **LLM security audit.** Local-first LLM safety auditing tool. Integrates OWASP LLM Top 10, MITRE ATLAS, and NIST AI RMF. Evaluates models for vulnerabilities, safety compliance, and reliability. |

### D. Infrastructure Tools (LLM CISO Integration Targets)

| Project | Stars | Assessment |
|----------|-------|------------|
| [semgrep/semgrep](https://github.com/semgrep/semgrep) | 12k+ | Static analysis standard. 30+ languages, YAML rules, easy CI/CD integration. Can serve as the vulnerability detection backend for an LLM CISO. |
| [prowler-cloud/prowler](https://github.com/prowler-cloud/prowler) | 14k | #1 open-source CSPM. 300+ controls across AWS, GCP, Azure, Kubernetes. Covers CIS, GDPR, PCI DSS, and other frameworks. Natural integration target for cloud assessment by LLM CISO. |
| [aquasecurity/trivy](https://github.com/aquasecurity/trivy) | 24k | Container image, filesystem, Git repo, and IaC vulnerability scanning. CI/CD-friendly. |
| [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) | 17k | Hardcoded secret detection in Git repos. Pre-commit hook support. |
| [wazuh/wazuh](https://github.com/wazuh/wazuh) | 11k | Open-source SIEM/XDR. Endpoint security, threat detection, compliance monitoring. Under consideration as Phase 4 backend for unified monitoring. |

### E. Related CTI Reports (This Repository)

| Report ID | Title | Relevance |
|-----------|-------|-----------|
| CTI-2026-0604-TVING | Tving OTT Platform Personal Data Breach | CI exposure, misconfiguration impact |
| CTI-2026-0604-CU_BREACH | CU Delivery Service Web Vulnerability Hack | Unpatched web vulnerability consequences |
| CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY | FastCampus GitHub Master Key Theft | Secret management and detection failure |
| CTI-2026-0420-VERCEL | Vercel Security Breach (AI SaaS Supply Chain) | Cloud/CI/CD supply chain threats |
| CTI-2026-0611-MIASMA_SPRINGBLIGHT | Miasma Worm Azure Package Mass Infection | Supply chain attack impact on all organizations |
| CTI-2026-0605-CLAUDECODE | Claude Code GitHub Action Privilege Bypass | LLM/CI/CD security vulnerabilities |
| Awesome Static Analysis Security Tools | Open-source SAST Tools Collection | DevSecOps pipeline construction |
| LAON VaultGuard | Multi-LLM Secret Detection Tool | Pre-commit hardcoded secret prevention |

### Differentiating Factors

| Criterion | How This Project Differs |
|-----------|--------------------------|
| **Scope** | Cloud + SaaS (Google Workspace) + DRM + KISA compliance + GDPR + CCPA + incident response in a unified guide. Most similar projects focus on a single domain. |
| **LLM Support** | Hybrid architecture supporting both public (Claude/GPT/DeepSeek) and local (Ollama) LLMs. Few comparable projects support both modes. |
| **Cross-Jurisdiction** | Explicit coverage of GDPR vs. CCPA vs. PIPA legal differences. The cross-jurisdiction compliance diff module has no equivalent in any listed project. |
| **Startup-Specific** | Stage-gated checklists from Pre-Seed to Series A. Free/open-source tool recommendations accounting for limited budgets. |
| **Execution Readiness** | Concrete CLI commands, API code, Modelfiles, Vercel deployment configuration -- ready to deploy, not just conceptual. |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Language | TypeScript (Strict), Node.js 22 | API server, CLI tools |
| Framework | Next.js 15 (App Router) | Phase 3 dashboard |
| Hosting | Vercel | API endpoints and frontend |
| Database | Vercel Postgres | Assessment history |
| Cache | Vercel KV (Redis) | Assessment result cache |
| LLM - Public | Claude (Anthropic), GPT-4o (OpenAI), DeepSeek | High-capability assessments |
| LLM - Local | Ollama + Llama 3 / Gemma 3 | Air-gapped sensitive data processing |
| Scheduling | Vercel Cron Jobs | Automated periodic assessments |
| Notifications | Slack Webhook, Resend (Email), Notion API | Assessment result delivery |
| Auth | NextAuth.js (Google OAuth) | Dashboard user authentication |

---

## Contributing

This project is open-source and welcomes contributions:

- **Checklist enhancements:** Additional security items or emerging threat coverage
- **Prompt improvements:** Prompt engineering to improve LLM assessment quality
- **Jurisdiction coverage:** Adding more countries to the cross-jurisdictional compliance module (Japan's APPI, Singapore's PDPA, China's PIPL, etc.)
- **Dashboard development:** Phase 3 web dashboard implementation
- **Reference additions:** Similar projects and relevant resources

Contribute via GitHub Issues or Pull Requests. All contributions follow the CC BY-NC-SA 4.0 license.

---

## License and Disclaimer

This guide and prompt system are provided for educational and defensive purposes. Actual security architecture and regulatory compliance depend on each company's specific circumstances. Critical legal decisions require professional review. LLM assessments are assistive tools; automated evaluation results should not be relied upon as sole grounds for compliance decisions.

---

## Contact

| Channel | Info |
|---------|------|
| Email | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| GitHub | [github.com/gameworkerkim](https://github.com/gameworkerkim) |
| Repository | [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |

---

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) | (c) 2026 | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
