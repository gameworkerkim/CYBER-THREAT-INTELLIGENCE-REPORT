# Startup Security Guide & LLM CISO

> 스타트업을 위한 오픈소스 정보보호 가이드, 체크리스트, 그리고 LLM 기반 가상 CISO 페르소나 프로젝트입니다.

[English](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Startup_Security_Guide/README_EN.md) | [Repository](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

---

## 왜 LLM CISO가 필요한가?

**스타트업은 보안에 취약하다.** 리소스는 제한적이고, 전담 CISO를 둘 여력은 없으며, 보안은 항상 "나중에" 하기로 미뤄진다. 그러나 창업 첫날부터 쌓이는 고객 데이터와 내부 기술 자산은 이미 공격자의 표적이다. 법적 의무는 규모와 무관하게 적용된다. 많은 기업들이 규정은 알지만 실제 현실에서 무너지는 경우가 많다. 재벌의 자회사인 티빙, CU 역시 보안 문제로 곤혹을 치루었고, 코스닥 상장사인 패스트캠퍼스 역시 보안 문제로 개인 정보 유출 사건을 최근 겪었다.

2026년 상반기, 국내에서 발생한 세 건의 사고는 이 문제가 더 이상 남의 일이 아님을 보여준다:

- **티빙(Tving) 개인정보 유출 (2026.06):** CI(Connecting Information)와 환불 계좌번호까지 포함된 대규모 유출로 개인정보보호위원회의 '중대 침해사고' 판단을 받았다. 유출된 CI는 다른 서비스의 데이터와 교차 검증되어 피해가 배가되는 구조다. (CTI-2026-0604-TVING)
- **CU 편의점 택배 해킹 (2026.06):** 단순한 웹 취약점을 통한 침투로 CI, 주소, 전화번호 등 9개 이상 항목이 유출되었다. 흥신소 불법 조회와 2차 범죄로까지 연계되었다. (CTI-2026-0604-CU_BREACH)
- **패스트캠퍼스/데이원컴퍼니 GitHub 마스터키 탈취 (2026.06):** GitHub 마스터키 하나가 탈취되어 내부 시스템에 30일간 잠복, 누적 회원 70만 명 이상의 개인정보가 유출되었다. 회사는 사고 인지까지 약 30일이 소요되었고, 고객 공지는 사실상 72시간 이상 지연되었다. (CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY)

**공통점:** 세 사건 모두 "설정 실수 한 번" 또는 "취약점 관리 소홀"에서 시작되었고, 피해 규모는 조직 규모에 반비례했다. 스타트업일수록 사고 대응 체계가 없어 탐지 지연, 공지 지연, 수습 실패로 이어지는 패턴이다.

스타트업에 필요한 것은 수천만 원짜리 보안 솔루션이 아니다. **무엇을 먼저 해야 하는지 아는 것**, 그리고 **정기적으로 체크할 수 있는 시스템**이다.

---

## 핵심 가설

**LLM은 스타트업의 최초 CISO가 될 수 있다.**

2026년 현재, Claude 4, GPT-4o, DeepSeek V3 등 퍼블릭 LLM과 Ollama 기반 로컬 LLM은 다음과 같은 능력을 갖추었다:

- 구조화된 보안 체크리스트 기반 평가 및 누락 항목 식별
- 클라우드 IAM 정책, 네트워크 ACL, 암호화 설정 등 기술 구성 분석
- KISA 안전성 확보조치 기준, 개인정보보호법 등 법규 준수 여부 검토
- 발견된 취약점에 대한 구체적인 조치 코드 및 설정 가이드 생성

기업 기밀이 포함된 정보는 로컬 LLM(Ollama)으로 에어갭 환경에서 처리하고, 일반적인 정책 평가는 퍼블릭 LLM으로 수행하는 **하이브리드 모델**을 통해 실무 투입이 가능한 수준이다.

이 프로젝트는 이 가설을 코드와 프롬프트로 구현한다.

---

## 프로젝트 구조

```
Startup_Security_Guide/
├── README.md                       # 본 문서: 프로젝트 개요
├── ROADMAP.md                      # Phase 3+ 로드맵 & 기능 명세 (SKIL→MCP→교정→봇)
├── ROADMAP_EN.md
├── STARTUP_SECURITY_GUIDE_KR.md    # Phase 1: 보안 가이드 & 체크리스트
├── LLM_CISO_PROMPT_KR.md           # Phase 2: LLM CISO 프롬프트 (SKIL 원천)
├── LLM_CISO_DASHBOARD.md           # Phase 3: 대시보드 UI/API 기획
├── skil/                           # M0: Security Knowledge & Intelligence Layer
├── mcp/                            # M1: MCP 서버 (예정)
├── skills/                         # Cursor + Claude/GPT/Ollama Skills
├── hooks/                          # M2: pre-commit 교정 훅 (예정)
└── llms.txt                        # LLM 인덱싱용 요약
```

👉 **상세 로드맵·기능 명세:** [ROADMAP.md](./ROADMAP.md)  
👉 **SKIL 조회:** [skil/README.md](./skil/README.md) · `node skil/query.mjs control:aws-iam-mfa`  
👉 **멀티 LLM Skills:** [skills/README.md](./skills/README.md)

### Phase 1: STARTUP_SECURITY_GUIDE_KR.md

스타트업이 창업 단계별로 수행해야 할 보안 조치를 정리한 종합 가이드입니다. KISA 정보보안 가이드를 기반으로 하되, 다음 영역을 심층 확장했습니다.

**주요 섹션:**

| 섹션 | 내용 |
|------|------|
| 클라우드 보안 | AWS(15항목), GCP(12항목), Azure(10항목), Vercel(10항목) 별 체크리스트. IAM 최소권한, 네트워크 보안, 암호화, 로깅, CSPM 도구, CI/CD 시크릿 관리 |
| Google Workspace 보안 | 관리 콘솔 설정(Gmail·Drive·Docs·제3자 앱·엔드포인트), SPF·DKIM·DMARC, DLP 규칙, 외부 공유 감사 루틴 |
| DRM·문서 보안 | 문서 등급 분류 체계, Google Drive IRM, DRM 도구 비교(Fasoo·MarkAny·Locklizard 등), 소스코드 보안, 퇴사자 SaaS 계정 회수 |
| KISA 법규 준수 | 개인정보 안전조치 6가지, 암호화 적용 기준표, 접속기록 관리 기준, CPO/CISO 의무, 해외 진출 시 GDPR·CCPA·PIPL 검토 |
| 사고 대응 | NIST SP 800-61 기반 6단계, 유형별(BEC·랜섬웨어·개인정보 유출) 대응 절차, 사고 보고 체계도 |
| Stage-Gate 체크 | 개발 완료부터 프로덕션 런칭까지 게이트별 통과 조건 |

**사용 방법:** 브라우저에서 열어 체크리스트 항목을 하나씩 확인하거나, LLM에 전체 문서를 컨텍스트로 제공하여 "우리 회사 기준으로 이 체크리스트를 검토해줘"라고 지시할 수 있습니다.

### Phase 2: LLM_CISO_PROMPT_KR.md

LLM에 CISO 역할을 부여하는 페르소나 프롬프트와 도메인별 진단 프롬프트 모음입니다. System Prompt를 설정하면 LLM이 보안 전문가처럼 행동하며 평가, 진단, 조치 가이드를 제공합니다.

**주요 구성:**

| 구성 요소 | 설명 |
|-----------|------|
| 기본 CISO 페르소나 | 15년 경력의 실용적 CISO 역할 정의. NIST CSF 기반 평가 방법론, 응답 형식 표준화 |
| 한국 법규 전문 모듈 | 개인정보보호법, 정보통신망법, 부정경쟁방지법 전문 지식 추가 — KISA 기준 평가 가능 |
| 기술 실무 모듈 | IAM 정책·네트워크 ACL·IaC 코드 분석 능력 부여 |
| 도메인별 진단 프롬프트 | 클라우드 / Google Workspace / DRM / KISA 법규 준수 / 종합 퀵스캔 — 각 도메인별 25~31개 평가 항목 |
| 프롬프트 체인 | 6단계 멀티스텝 진단 체인: Context Gathering → 병렬 도메인 진단 → 교차 분석 → 종합 보고서 → 실행 계획 |
| Ollama Modelfile | 로컬 LLM을 위한 CISO 커스텀 모델 생성 스크립트. 에어갭 환경에서 민감 데이터 처리 |
| TypeScript/Node.js 통합 | Claude·GPT·DeepSeek API 호출 코드, Ollama Provider 구현, Vercel Serverless Function |

**사용 방법 — 퍼블릭 LLM:**

```
1. LLM_CISO_PROMPT_KR.md의 "2.1 기본 CISO 페르소나" 섹션을 System Prompt로 복사
2. 원하는 도메인 진단 프롬프트를 User Message로 입력
3. 회사 상황(Context)을 구체적으로 기재하여 평가 요청
```

**사용 방법 — 로컬 LLM (Ollama):**

```bash
# 1. Ollama 설치 (macOS)
brew install ollama

# 2. 모델 다운로드
ollama pull llama3:8b        # 또는 gemma3:12b, exaone3.5 (한국어 최적화)

# 3. CISO Modelfile 생성 (LLM_CISO_PROMPT_KR.md 5.2절 참조)
cat > Modelfile << 'EOF'
FROM llama3:8b
SYSTEM """당신은 스타트업을 위한 가상 CISO입니다..."""
PARAMETER temperature 0.3
EOF

# 4. 커스텀 모델 생성
ollama create ciso-local -f Modelfile

# 5. 진단 실행
ollama run ciso-local "우리 스타트업(5인, AWS 사용)의 클라우드 보안을 평가해줘."

# 6. 보안 보고서 자동 생성 (Shell Script)
# LLM_CISO_PROMPT_KR.md 5.4절의 ciso-daily-check.sh 참조
```

**사용 방법 — TypeScript/Node.js (Vercel 배포):**

```bash
# 1. 프로젝트 클론
git clone https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT.git
cd CYBER-THREAT-INTELLIGENCE-REPORT/Startup_Security_Guide

# 2. 패키지 설치 (LLM_CISO_PROMPT_KR.md 7.6절 package.json 참조)
npm install

# 3. 환경 변수 설정
export ANTHROPIC_API_KEY="sk-ant-..."
export CISO_MODE="public"   # 또는 "local" (Ollama 모드)

# 4. 진단 실행
npm run assess -- --domain cloud --context '{"stage":"seed","teamSize":5,"cloudProvider":"aws"}'
```

### Phase 3: SKIL → MCP → 자기 교정 → 대시보드·봇

Phase 2 프롬프트를 **SKIL(Security Knowledge & Intelligence Layer)** 로 확장·재정의한 뒤, MCP로 실행 가능한 에이전트를 만들고, LLM 실수를 MCP가 검증·수정·보고한 다음, Slack/Telegram·팀 공유로 협업한다. UI 상세는 [LLM_CISO_DASHBOARD.md](./LLM_CISO_DASHBOARD.md), 전체 명세는 [ROADMAP.md](./ROADMAP.md).

| 마일스톤 | 내용 | 상태 |
|----------|------|------|
| **M0 SKIL** | `skil/` + multi-LLM Skills (`SYSTEM_PROMPT.md`). 시드 35 IDs. 가이드 전항목 이관은 고도화 중 | 🔄 진행 중 |
| **M1 MCP** | SKIL 조회 + Gitleaks/Trivy (이후 Prowler) MVP 서버 | 📋 |
| **M2 자기 교정** | L1~L4 실수 정의, validate→report→optional fix, pre-commit | 📋 |
| **M3 대시보드** | Next.js 현황판·진단 이력·컴플라이언스·교정 리포트 뷰 | 📋 |
| **M4 봇·협업** | Slack/Telegram 봇, 팀 공유, RBAC | 📋 |
| **M5 Production** | Auth, 멀티테넌시, 감사 로그, Hybrid LLM 기본값 | 📋 |

---

## 개발 로드맵

```
Phase 1 ✅          Phase 2 ✅               Phase 3 🔄                         Phase 4 📋
보안 가이드    →    LLM CISO 프롬프트   →   SKIL → MCP → 자기교정 → 봇/공유   →   통합 모니터링
& 체크리스트         (SKIL 원천 지식)         + 대시보드 UI                         (Wazuh/SIEM)
                                              │
                                              ├─ M0: SKIL 구조화 + Cursor Skills
                                              ├─ M1: MCP (SKIL · Gitleaks · Trivy)
                                              ├─ M2: LLM 실수 검증·수정·보고
                                              ├─ M3: Web 대시보드
                                              ├─ M4: Slack / Telegram / 팀 공유(RBAC)
                                              └─ M5: Production 하드닝
```

**실행 순서:** (1) SKIL 정의·구조화 → (2) MCP MVP → (3) 자기 교정 루프 → (4) 대시보드 → (5) 알림·협업 → (6) Phase 4 SIEM.

최종 목표는 체크리스트 뷰어가 아니라, **구조화된 지식(SKIL) + 도구 실행(MCP) + 교정 루프**로 인프라를 점검하고, 팀이 봇·대시보드로 공유하는 가상 CISO 체계다. 상세: [ROADMAP.md](./ROADMAP.md).

---

## Similar Projects & References (Awesome LLM CISO)

이 프로젝트와 유사한 오픈소스 및 연구 프로젝트를 평가와 함께 정리합니다. 2026년 6월 기준입니다.

### A. 직접적 유사 프로젝트 (Virtual CISO / AI Security Advisor)

| 프로젝트 | Stars | 평가 |
|----------|-------|------|
| [intuitem/ciso-assistant-community](https://github.com/intuitem/ciso-assistant-community) | 4.1k | **강력 추천.** 오픈소스 GRC 플랫폼의 표준. ISO 27001, NIST CSF, SOC 2, GDPR, PCI DSS 등 150개 이상 프레임워크에 대한 자동 제어 매핑을 제공한다. Python/Django 기반으로, 현재는 LLM 기능이 통합되어 있지 않으나 자연어 질의 및 자동 증거 분석을 접목할 여지가 크다. LLM CISO 프로젝트의 **벤치마크 대상**이다. |
| [sarfaraz-munir/Claude-Code-Cyber-agents](https://github.com/sarfaraz-munir/Claude-Code-Cyber-agents) | N/A | **직접 경쟁.** Claude Code용 계층형 CISO 에이전트 스웜. 위험 관리, 컴플라이언스, 위협 인텔리전스, 취약점 관리, 사고 대응 등 10개 전문 에이전트로 구성된다. TypeScript 기반이며 MCP 툴과 Claude Code 스킬을 포함한다. 스웜 아키텍처는 참고할 만하나, 한국 법규(KISA) 커버리지가 없고 로컬 LLM 지원이 부재하다. |
| [SiteQ8/CISO-Dashboard](https://github.com/SiteQ8/CISO-Dashboard) | 3 | **참고용.** 오픈소스 CISO 대시보드 UI 레퍼런스. KPI, 통제 커버리지, 인시던트, 리스크 상태를 한눈에 보여준다. JavaScript 기반이며, 대시보드 UI 설계 시 어떤 지표를 어떻게 배치할지 참고할 수 있다. LLM 기능은 없다. |
| [l9rins/aws-cloud-security-policy-advisor](https://github.com/l9rins/aws-cloud-security-policy-advisor) | N/A | **도메인 참고.** AI 기반 AWS 보안 정책 어드바이저. 스타트업과 개발자를 위해 IAM 최소권한 정책, 암호화 표준, CIS 벤치마크 기반 컴플라이언스 체크리스트를 생성한다. 단일 클라우드(AWS)에 특화되어 있고 멀티 클라우드, SaaS 보안, DRM을 다루지 않는다. |
| [michael-markevich/startup-security-checklist](https://github.com/michael-markevich/startup-security-checklist) | N/A | **체크리스트 참고.** 초기 스타트업을 위한 보안 필수 항목 컬렉션. LLM 기능 없이 정적인 체크리스트만 제공한다. STARTUP_SECURITY_GUIDE_KR.md의 간소화된 영문 버전에 가깝다. |

### B. LLM + 보안 자동화 도구

| 프로젝트 | Stars | 평가 |
|----------|-------|------|
| [kennedyraju55/gdpr-compliance-checker](https://github.com/kennedyraju55/gdpr-compliance-checker) | N/A | **아키텍처 참고.** 로컬 Gemma 4 LLM(Ollama)을 사용한 GDPR 컴플라이언스 체커. 모든 처리가 로컬에서 이루어져 데이터 프라이버시를 보장한다. 한국 법규(KISA)로 확장하면 본 프로젝트와 동일한 패턴이 된다. |
| [Sbharadwaj05/sb-siem-mcp](https://github.com/Sbharadwaj05/sb-siem-mcp) | 10 | **통합 패턴 참고.** LLM을 Wazuh SIEM에 연결하는 MCP 서버. 자연어 위협 탐지, 알람 분석, 컴플라이언스 체크를 28개 보안 도구로 수행한다. LLM CISO가 실제 보안 인프라와 연동되는 방식을 보여준다. |
| [LakshyaJ1/HivePro_Assignment](https://github.com/LakshyaJ1/HivePro_Assignment) | N/A | **RAG 패턴 참고.** 증거 기반 자동화 사이버보안 리스크 평가 시스템. NIST SP 800-53 통제를 하이브리드 RAG로 검색하고, LLM을 통해 CISO 수준의 리스크 브리핑을 생성한다. |
| [PrayasPanda/llm-redteam](https://github.com/PrayasPanda/llm-redteam) | 1 | **레드팀 모듈.** LLM 자동화 보안 감사 프레임워크. 다중 카테고리 레드티밍 공격으로 모델 견고성과 안전성을 평가한다. LLM CISO의 보안 테스트 모듈로 활용 가능하다. |

### C. 스타트업 보안 & AI 거버넌스 참고자료

| 프로젝트 | Stars | 평가 |
|----------|-------|------|
| [rushout09/llm-security-startups](https://github.com/rushout09/llm-security-startups) | 15 | **시장 조사.** LLM 보안 스타트업 목록. LLM 방화벽, 레드티밍 도구, 가드레일, AI 보안 태세 관리 회사를 망라한다. LLM CISO 프로젝트의 경쟁/보완 생태계 파악에 유용하다. |
| [AIShieldLabs/ai-secure-checklist](https://github.com/AIShieldLabs/ai-secure-checklist) | N/A | **AI 보안 특화.** 스타트업을 위한 50개 항목의 AI 보안 평가 체크리스트. MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, EU AI Act를 커버한다. 스타트업이 AI를 배포하는 경우 본 프로젝트의 보완 자료로 활용할 수 있다. |
| [AnimeshShaw/agentic-ai-security-guide](https://github.com/AnimeshShaw/agentic-ai-security-guide) | 1 | **경영진 대상.** CISO, CTO, 이사회 구성원을 위한 에이전틱 AI 보안 가이드. 위협, OWASP LLM Top 10, 거버넌스, 컴플라이언스 프레임워크와 12개월 액션 플랜을 포함한다. LLM CISO의 지식 베이스 확장에 참고할 수 있다. |
| [overcrash66/LocalGuard](https://github.com/overcrash66/LocalGuard) | 4 | **LLM 보안 평가.** 로컬 우선 LLM 안전 감사 도구. OWASP LLM Top 10, MITRE ATLAS, NIST AI RMF를 통합하여 모델의 보안 취약성, 안전 준수, 성능 신뢰성을 평가한다. |

### D. 기반 인프라 도구 (LLM CISO 연동 대상)

| 프로젝트 | Stars | 평가 |
|----------|-------|------|
| [semgrep/semgrep](https://github.com/semgrep/semgrep) | 12k+ | 정적 분석 표준. 30개 이상 언어 지원, YAML 규칙 기반, CI/CD 통합 용이. LLM CISO가 취약점 진단 근거로 활용할 수 있다. |
| [prowler-cloud/prowler](https://github.com/prowler-cloud/prowler) | 14k | 오픈소스 CSPM 1위. AWS, GCP, Azure, Kubernetes에 대한 300개 이상의 CIS·GDPR·PCI DSS 통제를 점검한다. LLM CISO의 클라우드 진단 엔진으로 연동 가능하다. |
| [aquasecurity/trivy](https://github.com/aquasecurity/trivy) | 24k | 컨테이너 이미지, 파일시스템, Git 레포지토리, IaC의 취약점을 스캔한다. CI/CD 파이프라인에 통합하기 쉽다. |
| [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) | 17k | Git 레포지토리 내 하드코딩된 시크릿 탐지. Pre-commit hook으로 사용 가능. |
| [wazuh/wazuh](https://github.com/wazuh/wazuh) | 11k | 오픈소스 SIEM/XDR. 엔드포인트 보안, 위협 탐지, 컴플라이언스 모니터링을 통합한다. Phase 4의 통합 모니터링 체계에서 백엔드로 연동 검토 중이다. |

### E. 관련 CTI 리포트 (본 저장소)

| 리포트 ID | 제목 | 관련성 |
|-----------|------|--------|
| CTI-2026-0604-TVING | 티빙 개인정보 대량 유출 사고 | CI·DI 유출, 보안 설정 오류의 파급력 |
| CTI-2026-0604-CU_BREACH | CU 편의점 택배 웹 취약점 해킹 | 웹 취약점 관리 부재의 결과 |
| CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY | 패스트캠퍼스 GitHub 마스터키 탈취 | 시크릿 관리·탐지 체계 부재 |
| CTI-2026-0420-VERCEL | Vercel 보안 침해 (AI SaaS 공급망) | 클라우드·CI/CD 공급망 위협 |
| CTI-2026-0611-MIASMA_SPRINGBLIGHT | Miasma 웜 Azure 패키지 대량 감염 | 공급망 공격이 모든 조직에 미치는 영향 |
| CTI-2026-0605-CLAUDECODE | Claude Code GitHub Action 권한 우회 | LLM/CI/CD 보안 취약점 |
| Awesome Static Analysis Security Tools | 오픈소스 SAST 도구 컬렉션 | DevSecOps 파이프라인 구축 참고 |
| LAON VaultGuard | 멀티 LLM 시크릿 탐지 도구 | 소스코드 내 하드코딩 시크릿 사전 차단 |

### 종합 평가

| 기준 | 본 프로젝트의 차별점 |
|------|---------------------|
| **범위** | 클라우드 + SaaS(Google Workspace) + DRM + KISA 법규 + 사고대응을 하나의 가이드로 통합. 유사 프로젝트는 대부분 단일 도메인에 집중한다. |
| **LLM 지원** | 퍼블릭(Claude/GPT/DeepSeek)과 로컬(Ollama)을 모두 지원하는 하이브리드 아키텍처. 유사 프로젝트 중 양쪽을 모두 지원하는 경우가 드물다. |
| **한국 법규** | KISA 안전성 확보조치, 개인정보보호법, 정보통신망법을 프롬프트에 내장. 영문 프로젝트는 한국 법규를 다루지 않는다. |
| **스타트업 특화** | Pre-Seed부터 Series A까지 성장 단계별 체크리스트, Stage-Gate 컴플라이언스, 제한된 예산을 고려한 무료 도구 우선 추천. |
| **실행 가능성** | 구체적인 CLI 명령어, API 코드, Modelfile, Vercel 배포 설정까지 포함하여 즉시 실행 가능하다. |

---

## 기술 스택

| 계층 | 기술 | 용도 |
|------|------|------|
| 지식 | SKIL (YAML/JSON Schema) | MCP·Cursor Skill 공통 지식 기반 |
| 프로토콜 | MCP (Model Context Protocol) | 도구 호출·검증·스캔 |
| 언어 | TypeScript (Strict), Node.js 22 | MCP 서버, CLI, API |
| 프레임워크 | Next.js 15 (App Router) | Phase 3 대시보드 (M3) |
| 호스팅 | Vercel | API 엔드포인트 및 프론트엔드 |
| 데이터베이스 | Vercel Postgres | 진단·교정 이력 |
| 캐시 | Vercel KV (Redis) | 진단 결과 캐시 |
| LLM - Public | Claude (Anthropic), GPT-4o (OpenAI), DeepSeek | 고성능 진단 (검증은 MCP) |
| LLM - Local | Ollama + Llama 3 / Gemma 3 / EXAONE 3.5 | 에어갭 민감 데이터 진단 |
| 보안 도구 | Gitleaks, Trivy, Prowler, Semgrep | MCP 백엔드 스캐너 |
| 배포 | Vercel Cron Jobs | 정기 자동 진단 |
| 알림 | Slack Bot, Telegram Bot, Resend (Email), Notion API | M4 진단·교정 알림 |
| 협업 | 팀 공유 + RBAC, JIRA/Linear (후속) | M4~M5 |
| 인증 | NextAuth.js (Google OAuth) | 대시보드 사용자 인증 |
| SIEM (Phase 4) | Wazuh | 통합 모니터링 |

---

## 기여 방법

이 프로젝트는 오픈소스로 운영되며, 다음과 같은 기여를 환영합니다:

- **체크리스트 보강:** 누락된 보안 항목 또는 최신 위협 사례 추가
- **SKIL 구조화:** 가이드·프롬프트를 YAML/JSON Controls·Policies로 변환
- **MCP 도구:** Gitleaks/Trivy/Prowler 연동 및 자기 교정 검증기
- **프롬프트·Skill 개선:** LLM 응답 품질 및 Cursor Skill 고도화
- **다국어 번역:** 영문, 일문, 중문 버전의 가이드/프롬프트 작성
- **대시보드·봇:** Web UI, Slack/Telegram, 팀 공유(RBAC)
- **레퍼런스 추가:** 유사 프로젝트 및 관련 자료 제보

GitHub Issues 또는 Pull Request를 통해 참여할 수 있습니다. 모든 기여는 CC BY-NC-SA 4.0 라이선스를 따릅니다.

---

## 라이선스 및 주의사항

본 가이드와 프롬프트는 교육 및 방어 목적으로 제공됩니다. 실제 보안 체계 수립과 규제 대응은 개별 기업의 상황에 따라 달라지며, 중대한 법적 판단은 반드시 전문가의 검토가 필요합니다. LLM 진단은 보조 도구이며, 자동화된 평가 결과를 맹신해서는 안 됩니다.

---

## 연락처

| 채널 | 정보 |
|------|------|
| Email | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| GitHub | [github.com/gameworkerkim](https://github.com/gameworkerkim) |
| Repository | [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |

---

> Maintained by [Dennis Kim](mailto:gameworker@gmail.com) | (c) 2026 | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
