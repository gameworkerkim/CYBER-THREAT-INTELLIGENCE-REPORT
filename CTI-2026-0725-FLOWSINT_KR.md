---
title: "Flowsint — OSINT Graph Exploration Tool Review"
subtitle: "Open-source Maltego alternative for cybersecurity analysts and OSINT investigators"
description: "A comprehensive review of Flowsint, an open-source OSINT graph exploration tool by reconurge. Covers features, architecture, enrichers, competitive landscape, security considerations, and evaluation for CTI workflows."
abstract: |
  Flowsint is an Apache 2.0-licensed OSINT graph exploration platform that has rapidly gained 7,400+ GitHub stars. It positions itself as an open-source alternative to Maltego, with a local-first privacy architecture, Docker-based deployment, and a modular enricher ecosystem covering domains, IPs, email, cryptocurrency wallets, and social media. This report provides a structured review of its capabilities, security posture, and operational fit for CTI analysts.
date: 2026-07-25
author: "Dennis Kim"
lang: ko
tags:
  - OSINT
  - Open-Source-Tool
  - Graph-Investigation
  - Tool-Review
  - Flowsint
  - Maltego-Alternative
  - Reconnaissance
keywords:
  - Flowsint
  - OSINT
  - 그래프 탐색
  - Maltego 대안
  - 오픈소스 도구
  - 사이버보안 도구
  - Enricher
group: tool-review
featured: false
schema_type: TechArticle
tlp: GREEN
severity: INFO
draft: false
---

| id             | CTI-2026-0725-FLOWSINT                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| title          | Flowsint — OSINT Graph Exploration Tool Review                                           |
| subtitle       | Open-source Maltego alternative for cybersecurity analysts and OSINT investigators       |
| author         | Dennis Kim (HoKwang Kim)                                                                |
| email          | <gameworker@gmail.com>                                                                  |
| github         | gameworkerkim                                                                            |
| date           | 2026-07-25                                                                               |
| classification | TLP:GREEN                                                                                |
| severity       | INFO                                                                                     |
| lang           | ko                                                                                      |
| tags           | OSINT · Open-Source-Tool · Graph-Investigation · Tool-Review · Flowsint                 |
| repo           | [reconurge/flowsint](https://github.com/reconurge/flowsint)                              |
| stars          | 7,400+                                                                                   |
| license        | Apache 2.0                                                                               |
| frameworks     | N/A (Tool Review)                                                                        |

# Flowsint — OSINT Graph Exploration Tool Review

> **Report ID** `CTI-2026-0725-FLOWSINT` | **Published** 2026-07-25 | **Classification** `TLP:GREEN` | **Severity** INFO
> **Author** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)

*Open-source Maltego alternative for cybersecurity analysts and OSINT investigators*

---

## Table of Contents

1. Project Overview
2. Core Features & Architecture
3. Enricher Ecosystem
4. Competitive Comparison
5. Security Considerations
6. Operational Assessment for CTI Workflows
7. Conclusion
8. References

---

## 1. Project Overview

**Flowsint** (`reconurge/flowsint`) is an open-source OSINT graph exploration tool under the Apache 2.0 license, designed for cybersecurity analysts, journalists, and investigators who need to map relationships between entities through a visual graph interface.

| Attribute          | Detail                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Repository         | [github.com/reconurge/flowsint](https://github.com/reconurge/flowsint) |
| License            | Apache 2.0                                                             |
| GitHub Stars       | 7,400+                                                                 |
| Forks              | 935                                                                    |
| Commits            | 871                                                                    |
| Primary Languages  | Python (backend), TypeScript (frontend)                                |
| Development Stage  | Early development (pre-1.0, active)                                    |
| Website            | [flowsint.io](https://flowsint.io)                                     |

### Core Principles

- **Ethical investigation**: Exclusively for lawful, ethical OSINT and threat intelligence research
- **Transparency**: Fully open-source codebase with Apache 2.0 licensing
- **Verification**: Automated enrichers that cross-reference multiple data sources
- **Local-first privacy**: All data stored on the user's machine by default

Flowsint explicitly prohibits use for unauthorized surveillance, doxxing, harassment, or political manipulation, as documented in its `ETHICS.md` and `DISCLAIMER.md`.

---

## 2. Core Features & Architecture

### 2.1 Visual Graph Exploration

The primary interface is an interactive node-and-edge graph visualization. Analysts create entities (domains, IPs, individuals, organizations, email addresses, crypto wallets) and explore relationships through automated enrichment and manual linking.

### 2.2 System Architecture

| Component          | Technology          | Role                                    |
| ------------------ | ------------------- | --------------------------------------- |
| `flowsint-app`     | TypeScript (Vite)   | Frontend UI with interactive graph      |
| `flowsint-api`     | FastAPI (Python)    | REST API, authentication, event stream  |
| `flowsint-core`    | Python              | Orchestrator, Celery tasks, vault       |
| `flowsint-enrichers` | Python           | Enricher modules and scanning logic     |
| `flowsint-types`   | Pydantic             | Data models and type definitions        |
| Database (Graph)   | Neo4j               | Entity-relationship graph storage       |
| Database (Relational) | PostgreSQL       | User accounts, configuration, metadata  |
| Cache / Queue      | Redis + Celery      | Task queue and caching                  |

### 2.3 Deployment Model

Fully containerized via Docker Compose. Single-command deployment:

```
git clone https://github.com/reconurge/flowsint.git
cd flowsint
make prod
```

Supports Linux, macOS, and Windows. Team/server deployment is supported out of the box with internal frontend proxy architecture -- only port 5173 is exposed; PostgreSQL, Redis, Neo4j, and the API are bound to localhost and accessible only through the proxy.

### 2.4 Key Design Decisions

| Decision                  | Implication                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| Local-first storage       | No cloud dependency; data sovereignty guaranteed                        |
| Docker Compose only       | No bare-metal install path; requires Docker familiarity                  |
| Neo4j as graph DB         | Powerful relationship queries via Cypher, but adds learning curve        |
| Internal proxy for teams  | Single port exposure simplifies networking but needs HTTPS for production |
| Modular monorepo          | Clean separation of concerns; enrichers can be developed independently   |

---

## 3. Enricher Ecosystem

Enrichers are automated modules that take an entity as input and produce related entities or metadata. Flowsint ships with a broad set.

### 3.1 Domain Enrichers

| Enricher              | Function                                      |
| --------------------- | --------------------------------------------- |
| Reverse DNS           | Find domains pointing to an IP                |
| DNS Resolution        | Resolve domain to IP addresses                |
| Subdomain Discovery   | Enumerate subdomains                          |
| WHOIS Lookup          | Retrieve domain registration data             |
| Domain to Website     | Convert domain to website entity              |
| Domain to Root Domain | Extract root domain                           |
| Domain to ASN         | Map domain to autonomous system number        |
| Domain History        | Retrieve historical domain data               |

### 3.2 IP & ASN Enrichers

| Enricher       | Function                               |
| -------------- | -------------------------------------- |
| IP Information | Geolocation and network details        |
| IP to ASN      | Map IP to autonomous system            |
| ASN to CIDRs   | Retrieve IP ranges for an ASN          |
| CIDR to IPs    | Enumerate individual IPs in a range    |

### 3.3 Identity & Contact Enrichers

| Enricher                | Function                                         |
| ----------------------- | ------------------------------------------------ |
| Maigret                 | Username search across 2,500+ social platforms   |
| Email to Gravatar       | Find Gravatar profile from email                 |
| Email to Breaches       | Cross-reference email against breach databases   |
| Email to Domains        | Find domains associated with email               |
| Phone to Breaches       | Cross-reference phone number against breaches    |
| Individual to Org       | Find organizational affiliations                 |
| Individual to Domains   | Find domains associated with a person            |

### 3.4 Organization & Infrastructure Enrichers

| Enricher                 | Function                                  |
| ------------------------ | ----------------------------------------- |
| Organization to ASN      | Find ASNs owned by an organization        |
| Organization Information | Retrieve company registration details     |
| Organization to Domains  | Find domains owned by an organization     |

### 3.5 Cryptocurrency Enrichers

| Enricher               | Function                              |
| ---------------------- | ------------------------------------- |
| Wallet to Transactions | Retrieve transaction history          |
| Wallet to NFTs         | Identify NFTs held by a wallet        |

### 3.6 Website Enrichers

| Enricher              | Function                                |
| --------------------- | --------------------------------------- |
| Website Crawler       | Crawl and map website structure         |
| Website to Links      | Extract all outbound links              |
| Website to Domain     | Extract domain from URL                 |
| Website to Webtrackers | Identify tracking/analytics scripts    |
| Website to Text       | Extract plain text content              |

### 3.7 Integration Enrichers

| Enricher        | Function                                 |
| --------------- | ---------------------------------------- |
| N8n Connector   | Connect Flowsint to N8n automation workflows |

---

## 4. Competitive Comparison

### 4.1 Direct Comparisons

| Tool             | License          | Type           | Key Differentiator vs Flowsint                                  |
| ---------------- | ---------------- | -------------- | --------------------------------------------------------------- |
| **Maltego**      | Commercial (Freemium) | Graph OSINT    | Industry standard, mature Transform library, paid tiers         |
| **SpiderFoot**   | GPL-3.0          | Automated Scan | 200+ OSINT sources, CLI-first, stronger automation              |
| **Recon-ng**     | MIT              | CLI Framework  | Metasploit-style modular recon, terminal-only                   |
| **SpectraGraph** | Open-Source      | Graph Studio   | Interactive graph workspace, similar visual approach            |
| **PANO**         | Open-Source      | Graph + AI     | Timeline view + AI assistance beyond Flowsint's scope           |
| **Helix**        | Open-Source      | Identity Graph | D3.js real-time relationship graph, identity mapping focus      |
| **Flowintel**    | Open-Source      | Case Management | Investigation case/collaboration management vs exploration     |

### 4.2 Flowsint's Positioning

Flowsint occupies a distinctive niche:

- **Maltego alternative**: Most frequently cited as the open-source replacement for Maltego's graph-based OSINT workflow
- **Visual-first**: Unlike SpiderFoot and Recon-ng (CLI-centric), Flowsint prioritizes interactive visual exploration
- **Local privacy**: Most competitors either require cloud accounts or phone home with telemetry
- **Reconurge ecosystem**: Tight integration with sibling tools (Recontrack, Reconcrawl)
- **Balanced approach**: Combines automated enrichers with manual graph manipulation

---

## 5. Security Considerations

### 5.1 Reported Vulnerabilities

Flowsint is in early development and has several reported CVEs. Analysts should evaluate their risk tolerance before deploying in sensitive environments.

| CVE ID              | Type                        | Description                                                              | Status          |
| -------------------- | --------------------------- | ------------------------------------------------------------------------ | --------------- |
| CVE-2026-32311       | OS Command Injection       | `org_to_asn` enricher vulnerable to command injection via crafted input  | Reported        |
| CVE-2026-44352       | Access Control             | Users could view other users' sketch logs (pre-v1.2.3)                  | Patched in 1.2.3 |
| CVE-2026-42156       | Cypher Query Injection     | Graph query injection through unsanitized entity input                  | Reported        |

### 5.2 Operational Security Recommendations

1. **Network isolation**: Deploy in an isolated VLAN or dedicated analysis VM
2. **Do not expose to public internet**: The internal proxy architecture is designed for LAN/trusted network use. If public access is required, place a reverse proxy with HTTPS termination in front
3. **Rotate default secrets**: The `.env` file ships with placeholder values for `AUTH_SECRET`, `MASTER_VAULT_KEY_V1`, and `NEO4J_PASSWORD`. Generate unique values before any deployment
4. **Monitor updates**: Track the [CHANGELOG.md](https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md) and GitHub Security Advisories for patches
5. **Production readiness**: At this development stage, Flowsint is best suited for research and testing environments rather than production analyst workflows

### 5.3 Supply Chain Risk

- 871 commits from multiple contributors; no single-vendor lock-in
- Docker images pulled from GitHub Container Registry (`ghcr.io`); verify image signatures when available
- Python dependency chain managed via `uv`/`pyproject.toml`; audit with `pip-audit` or similar before deployment

---

## 6. Operational Assessment for CTI Workflows

### 6.1 Where Flowsint Fits

| CTI Workflow Stage        | Flowsint Utility                                    | Rating     |
| ------------------------- | --------------------------------------------------- | ---------- |
| Initial Reconnaissance    | Domain/IP/ASN enrichers provide rapid mapping        | High       |
| Entity Attribution        | Maigret, email-to-breaches, wallet tracing           | Medium-High |
| Infrastructure Mapping    | ASN-to-CIDRs, reverse DNS, subdomain discovery       | High       |
| Relationship Discovery    | Graph visualization with Neo4j Cypher queries         | High       |
| Report Generation         | Screenshot/export graph; no built-in report templates | Low-Medium |
| Team Collaboration        | Server deployment supports multi-user; no RBAC yet   | Medium      |
| Evidence Preservation     | Local storage; no built-in chain-of-custody features  | Low         |

### 6.2 Recommended Use Cases

- Mapping attacker infrastructure (domains, IPs, ASNs) from a single indicator
- Tracing cryptocurrency wallet relationships in ransomware/APT investigations
- Cross-referencing email addresses and usernames across breach databases and social platforms
- Building organizational link charts for supply chain risk assessments

### 6.3 Limitations for Production CTI

- No API for programmatic graph export to SIEM/SOAR platforms
- No built-in IoC sharing format (STIX/MISP export not yet available)
- Early-stage stability -- expect breaking changes between releases
- Documentation is incomplete; community support via Discord only

---

## 7. Conclusion

Flowsint is a promising open-source OSINT graph exploration tool that has rapidly gained community traction (7,400+ stars) as a Maltego alternative. Its local-first privacy architecture, broad enricher ecosystem, and Docker-based deployment make it accessible for individual analysts and small teams.

**Strengths**: Visual graph exploration, modular enricher architecture, zero cloud dependency, Apache 2.0 licensing, Enricher ecosystem coverage across domains/IPs/email/crypto/social media.

**Weaknesses**: Early development stage (pre-1.0), documented CVEs requiring monitoring, no STIX/MISP export, Docker-only deployment, incomplete documentation.

**Verdict**: Suitable for CTI research and lab environments. Not yet recommended for production analyst pipelines without additional security hardening and isolation. The project's trajectory (871 commits, active community, rapid star growth) warrants continued monitoring -- it has the potential to become a standard tool in the open-source OSINT toolkit.

> **Disclaimer**: Flowsint is designed strictly for lawful, ethical investigation and research purposes. Unauthorized surveillance, doxxing, harassment, or any illegal use is prohibited under the project's ETHICS.md guidelines.

---

## 8. References

[1] reconurge/flowsint -- GitHub Repository. <https://github.com/reconurge/flowsint>

[2] Flowsint Official Site. <https://flowsint.io>

[3] Flowsint ETHICS.md. <https://github.com/reconurge/flowsint/blob/main/ETHICS.md>

[4] Flowsint DISCLAIMER.md. <https://github.com/reconurge/flowsint/blob/main/DISCLAIMER.md>

[5] Flowsint CHANGELOG.md. <https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md>

[6] Maltego -- Commercial OSINT Graph Platform. <https://www.maltego.com>

[7] SpiderFoot -- Open-Source OSINT Automation. <https://github.com/smicallef/spiderfoot>

[8] Recon-ng -- Web Reconnaissance Framework. <https://github.com/lanmaster53/recon-ng>

---

(c) 2026 Dennis Kim (HoKwang Kim) | Independent CTI Archive (TLP:GREEN)
Contact: <gameworker@gmail.com> | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
