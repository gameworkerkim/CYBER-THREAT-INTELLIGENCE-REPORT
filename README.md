# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--06--11-informational?style=flat-square)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

🌐 **언어 / Languages:** **한국어 (이 문서)** · [English](README_EN.md) · [日本語](README_JP.md) · [中文](README_CN.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

---

## 📇 분석가 소개 (About the Analyst)

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · 전 CyworldZ CEO · 독립 위협 인텔리전스 분석가 |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 최신 리포트 (Latest — Featured)

> 🆕 **2026-06-11 발행**

### Microsoft 공급망 공격 — Miasma(Spring Blight) 웜에 의한 Azure 패키지 대량 감염

**CTI-2026-0611-MIASMA_SPRINGBLIGHT** · 🔴 CRITICAL · TLP:GREEN

2026년 6월 8일, `Miasma`(Spring Blight)라는 자기 복제형 워밍 악성코드가 Microsoft 공식 PyPI 패키지(`durationtask`)를 감염 매개체로 삼아 Azure Functions 생태계 전반에 침투, **105초 만에 Microsoft 공식 GitHub 저장소 73개를 비활성화**시켰다. GitHub Actions 시크릿과 Azure OIDC 인증 해시가 탈취되어 공개 저장소에 JSON으로 노출됐다. 동시 발행된 **Microsoft 6월 패치 화요일 206개 CVE** 및 RoguePlanet/MiniPlasma 위협도 함께 분석.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0611-MIASMA_SPRINGBLIGHT` · `CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE` · `CTI-2026-0611-ROGUEPLANET_MINIPLASMA` |
| **심각도** | 🔴 CRITICAL |
| **분류** | `TLP:GREEN` |

**📄 리포트:** [🇰🇷 KR - Miasma](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) · [🇰🇷 KR - 패치 화요일](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) · [🇰🇷 KR - RoguePlanet](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md)

---

> 🆕 **2026-06-04 발행**

### 티빙(Tving) · CU 편의점 택배 — 연이은 대규모 개인정보 유출 사고

**CTI-2026-0604-TVING** · **CTI-2026-0604-CU_BREACH** · 🔴 CRITICAL · TLP:GREEN

2026년 6월 2일~4일, 국내 주요 OTT 플랫폼 **티빙**과 **CU 편의점 택배** 서비스에서 연이어 대규모 개인정보 유출 사고가 발생했다. 티빙은 CI·DI·환불 계좌번호까지 유출되어 개인정보보호위원회의 '중대 침해사고' 판단을 받았고, CU는 웹 취약점을 통한 해킹으로 CI·주소·전화번호 등 9개 이상 항목이 유출되어 흥신소 불법 조회·2차 범죄 연계 우려가 제기됐다. 두 사건 모두 '디지털 주민번호' CI가 유출되어 교차 검증 시 피해 파급력이 배가되는 구조다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0604-TVING` · `CTI-2026-0604-CU_BREACH` |
| **심각도** | 🔴 CRITICAL |
| **분류** | `TLP:GREEN` |

**📄 리포트:** [🇰🇷 KR - 티빙](CTI-2026-0604-TVING_KR.md) · [🇬🇧 EN - 티빙](CTI-2026-0604-TVING_EN.md) · [🇯🇵 JA - 티빙](CTI-2026-0604-TVING_JA.md) · [🇨🇳 ZH - 티빙](CTI-2026-0604-TVING_ZH.md) · [📕 PDF - 티빙](CTI-2026-0604-TVING_KR.pdf) · [🇰🇷 KR - CU](CTI-2026-0604-CU_BREACH_KR.md)

---

> 🆕 **2026-06-11 발행**

### 패스트캠퍼스·데이원컴퍼니 — GitHub 마스터키 탈취·30일 잠복 개인정보 유출

**CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY** · 🔴 HIGH · TLP:GREEN

2026년 5월 9일, 공격자가 데이원컴퍼니(패스트캠퍼스·콜로소 운영사)의 **GitHub 마스터 계정 키값을 탈취**해 내부 시스템에 침투했다. 회사가 사고를 인지한 것은 **약 30일이 경과한 6월 8일**이었으며, 피해 고객 대상 공지는 6월 11일 오후에야 게시되어 **사실상 72시간 이상의 공지 공백**이 발생했다. 유출 항목은 이름·이메일·전화번호·암호화된 비밀번호이며, 국내 최대 IT 교육 플랫폼(누적 회원 70만+)의 대규모 유출로 개인정보보호법상 통지 의무·탐지 체계의 심각한 허점을 동시에 드러낸 복합 사고다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY` |
| **심각도** | 🔴 HIGH |
| **분류** | `TLP:GREEN` |

**📄 리포트:** [🇰🇷 KR](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md)


## Awesome Security Series: Startup Security Guide & LLM CISO

> 🆕 **2026-06-17 발행** — 한국 진출 해외 스타트업을 위한 보안 가이드

티빙·CU·패스트캠퍼스 사고에서 드러난 것처럼, 스타트업은 설정 실수 한 번에 대규모 개인정보 유출로 이어질 수 있습니다. 특히 한국에 진출하는 해외 스타트업은 GDPR/CCPA와 전혀 다른 **한국 개인정보보호법(PIPA)** 의 의무(CPO 지정, AES-256 암호화, 접속기록 6개월 보관, 주민번호 수집 금지, 형사처벌)를 간과하기 쉽습니다.

본 가이드는 창업 단계별 보안 체크리스트, 클라우드(AWS·GCP·Azure·Vercel) 보안, Google Workspace 보안, DRM, KISA 법규 준수를 하나의 문서로 통합하고, **LLM을 가상 CISO로 활용**하여 GDPR/CCPA와 한국 PIPA 간 법규 차이를 자동 진단하는 프롬프트 시스템을 제공합니다. 퍼블릭 LLM(Claude·GPT·DeepSeek)과 로컬 LLM(Ollama)을 모두 지원합니다.

👉 [**Startup Security Guide 살펴보기 →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

| 언어 | 가이드 | LLM CISO 프롬프트 | 대시보드 |
|------|--------|------------------|----------|
| 한국어 | [가이드](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_KR.md) | [프롬프트](Startup_Security_Guide/LLM_CISO_PROMPT_KR.md) | [대시보드](Startup_Security_Guide/LLM_CISO_DASHBOARD.md) |
| English | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_EN.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_EN.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD_EN.md) |

**핵심 기능:**
- **29개 항목** 창업 단계별 보안 체크리스트 (Pre-Seed → Series A)
- **25차원 GDPR vs CCPA vs PIPA 법규 갭 매트릭스** (LLM 자동 진단)
- **클라우드 보안** — AWS(15항목)·GCP(12항목)·Azure(10항목)·Vercel(10항목)
- **Google Workspace 보안** — Gmail·Drive·Docs 관리 콘솔 설정 + SPF/DKIM/DMARC
- **DRM·문서 보안** — 등급 분류·IRM·소스코드 보호·퇴사자 계정 회수
- **사고 대응** — NIST SP 800-61 기반 + 한국 규제 마감시한
- **LLM CISO 페르소나** — Ollama 로컬 모드 지원 (에어갭 기밀 데이터 처리)

> *"한국 시장에 진출하는 스타트업이라면, 첫 커밋보다 먼저 이 가이드를 확인하세요."*

---

## Awesome Security Series: Static Analysis Security Tools

보안은 탐지(Inspection)를 넘어, *시작 단계에서의 예방(Prevention)*이 가장 강력합니다.  
특히, 애플리케이션 보안의 기본이 되는 **정적 분석(Static Analysis)** 은 소스 코드만으로 잠재적 취약점을 사전에 차단하는 핵심 방어 수단입니다.

**Semgrep, CodeQL, SonarQube** 등으로 대표되는 오픈소스 정적 분석 도구는 상용 솔루션 못지않은 강력한 보안 규칙과 DevSecOps 파이프라인 친화적인 설계로, 이미 많은 조직에서 보안 테스트의 첫 단계로 자리 잡았습니다.

이에 본 저장소에서도 매주 발행하는 취약점 리포트를 보완하는 의미로, 모든 보안 실무자와 개발자를 위해 엄선된 **오픈소스 SAST 도구 컬렉션**을 공개합니다.

👉 [**Awesome Static Analysis Security (SAST) Tools 살펴보기 →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Awesome%20Static%20Analysis%20Security%20Tools.md)

이 가이드는 **언어별, 범용성, 인기/트렌드별**로 도구를 분류하고, 다음과 같은 핵심 질문에 대한 실질적인 답변을 제공합니다.

- **Semgrep, CodeQL, Horusec**: 빠른 CI/CD 통합이 필요할 때 무엇을 써야 할까?
- **가장 빠르게 성장하는 오픈소스 SAST 도구는 무엇일까?** (2026년 기준 Semgrep이 그 중심에 있습니다)
- **Python만 전문으로 한다면?** (`Bandit + Pylint + Ruff`)
- **완전 무료로 최소한의 보안은 어떻게 갖출 수 있을까?** (권장 스택: `Semgrep CE + Trivy + Gitleaks + Checkov`)
- **Go 언어 환경에 특화된 보안 툴은?** (`gosec`, `staticcheck`, `govulncheck`)

이 외에도 Java/JVM부터 Rust, IaC, 모바일 앱까지 폭넓은 정보를 담았습니다.

> 분석 리포트와 함께 이 툴들을 직접 코드에 적용해 본다면, 단순한 '취약점 탐지' 그 이상의 실질적인 방어 능력을 갖추게 될 것입니다. (티빙 때문에 굳이 찾아 올리는거 맞음)


## Awesome Security Series: LAON VaultGuard — 멀티 LLM 기반 시크릿 탐지 도구

**2026년 6월, 티빙 GitHub 레포에 AWS 액세스 토큰이 하드코딩된 채 공개된 사건**은 단일 설정 실수가 전체 인프라를 위험에 빠뜨릴 수 있음을 보여줬습니다. `gitleaks`, `trufflehog` 같은 정규식 기반 스캐너는 빠르지만 문맥을 이해하지 못합니다. 반면 LLM은 변수명이 평범하거나 조립된 형태의 시크릿도 "의미"로 탐지할 수 있습니다.

이에 본 저장소는 정규식을 넘어 **멀티 LLM 교차검증**으로 Git 레포지토리의 클라우드 프라이빗 키(AWS·Azure·GCP·KT Cloud·Naver Cloud) 노출을 사전 차단하는 오픈소스 도구, **LAON VaultGuard**를 공개합니다.

👉 [**LAON VaultGuard 살펴보기 →**](https://github.com/gameworkerkim/vibe-investing/tree/main/LAON_VaultGuard)

**핵심 특징:**

- **멀티 LLM 교차검증** — Claude, DeepSeek, GPT, MiniMax, Ollama 등 여러 LLM이 동시에 시크릿을 분석·판정 (다수결 모드로 오탐 최소화)
- **완전 오프라인 모드** — Ollama 연동 시 인터넷 없이 로컬에서 모든 분석 수행 (API 키 불필요·소스코드 외부 유출 Zero)
- **VS Code 확장** — 파일 저장 시 실시간 시크릿 하이라이트, Problems 패널 연동
- **Pre-commit Hook** — `git commit` 전 변경 파일 자동 스캔 → 시크릿 감지 시 커밋 차단
- **Semgrep 연동** — XSS·SQLi 등 SAST 결과와 시크릿 탐지 결과를 SARIF로 통합
- **Differential Privacy** — LLM 전송 전 14개 시크릿 패턴 자동 마스킹
- **팀 대시보드** — 같은 네트워크에서 함께 모니터링 가능한 웹 UI (Slack·Telegram·Email 알람)

```bash
npx create-laon-vaultguard    # 대화형 설치 마법사
npx laon-vaultguard scan .    # 현재 레포 스캔
```

> *"공개되기 전에 찾는 것이 공개된 후 수습하는 것보다 백 배 쉽다."* — Tving AWS 키 노출 사건(2026.06)에서 얻은 교훈

---

## 📚 전체 리포트 목록 (Report Index)

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.
> ※ 심각도(Severity)는 주제 기준 참고치이며, 각 리포트 본문의 평가가 우선합니다.

| 발행일 | ID / 제목 | 심각도 | 언어 |
| --- | --- | --- | --- |
| 2026-06-11 | [`CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY`](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) — 패스트캠퍼스·데이원컴퍼니 GitHub 마스터키 탈취·30일 잠복 개인정보 유출 | 🔴 HIGH | [KR](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-ROGUEPLANET_MINIPLASMA`](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) — RoguePlanet / MiniPlasma 위협 | 🔴 HIGH | [KR](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE`](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) — Microsoft 6월 패치 화요일: 206개 CVE 대규모 업데이트 | 🔴 HIGH | [KR](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MIASMA_SPRINGBLIGHT`](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) — Microsoft 공급망 공격: Miasma(Spring Blight) 웜 Azure 패키지 대량 감염 | 🔴 CRITICAL | [KR](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-IRONWORM`](CTI-2026-0605-IRONWORM_KR.md) — IronWorm (공급망 자가전파 웜 변종) | 🔴 HIGH | [KR](CTI-2026-0605-IRONWORM_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-LAZARUS-CLICKFIX`](CTI-2026-0605-LAZARUS-CLICKFIX_EN.md) — 북한 Lazarus macOS ClickFix 캠페인 (Web3·핀테크 임원 표적) | 🔴 HIGH | [EN](CTI-2026-0605-LAZARUS-CLICKFIX_EN.md) · [KR](CTI-2026-0605-LAZARUS-CLICKFIX_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-CLAUDECODE`](CTI-2026-0605-CLAUDECODE_KR.md) — Claude Code GitHub Action 권한 우회·프롬프트 인젝션 공급망 취약점 | 🔴 HIGH | [KR](CTI-2026-0605-CLAUDECODE_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-AI-ZERODAY`](CTI-2026-0605-AI-ZERODAY_KR.md) — AI 생성 제로데이 익스플로잇 최초 탐지 (2FA 우회) | 🟠 MEDIUM / 🔴 HIGH | [KR](CTI-2026-0605-AI-ZERODAY_KR.md) |
| 2026-06-04 | [`CTI-2026-0604-TVING`](CTI-2026-0604-TVING_KR.md) — 티빙(Tving) 개인정보 대량 유출 사고 (CI·DI·계좌번호) | 🔴 CRITICAL | [KR](CTI-2026-0604-TVING_KR.md) · [EN](CTI-2026-0604-TVING_EN.md) · [JA](CTI-2026-0604-TVING_JA.md) · [ZH](CTI-2026-0604-TVING_ZH.md) · [PDF](CTI-2026-0604-TVING_KR.pdf) |
| 2026-06-04 | [`CTI-2026-0604-CU_BREACH`](CTI-2026-0604-CU_BREACH_KR.md) — CU 편의점 택배 개인정보 대량 유출 사고 (웹 취약점·CI 유출·흥신소 연계) | 🔴 CRITICAL | [KR](CTI-2026-0604-CU_BREACH_KR.md) |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE.md) — IBM WebSphere 동시 공개 3종 (역직렬화 RCE·인증 우회) | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JA](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-03 | [`CTI-2026-0603-ANDROID-EOP`](CTI-2026-0603-ANDROID-EOP_KR.md) — Android EoP(Elevation of Privilege) 취약점 | 🔴 HIGH | [KR](CTI-2026-0603-ANDROID-EOP_KR.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_KR.md) — Citrix NetScaler 메모리 오버리드 대규모 악용 (CVE-2026-3055) | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-02 | [`CTI-2026-0602-MIRAI-ZERODAY`](CTI-2026-0602-MIRAI-ZERODAY_KR.md) — Mirai 봇넷 신규 변종 제로데이 악용 (D-Link·Zyxel·산업용 라우터) | 🔴 HIGH | [KR](CTI-2026-0602-MIRAI-ZERODAY_KR.md) |
| 2026-06-02 | [`CTI-2026-0602-MIASMA-RH`](CTI-2026-0602-MIASMA-RH_KR.md) — Miasma RH 위협 | 🔴 HIGH | [KR](CTI-2026-0602-MIASMA-RH_KR.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_KR.md) — 이란의 생성형 AI를 이용한 전쟁 | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [CN](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GenAI로 무장한 GREYVIBE의 우크라이나 표적 작전 | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_KR.md) — MARIMO (권고문 무기화·공개-악용 압축) | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [CN](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_KR.md) — JINX | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [CN](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_KR.md) — Gogs Git 서버 취약점 | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [CN](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_KR.md) — ChatGPhish (ChatGPT 사칭 피싱) | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [CN](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_KR.md) — KelpDAO (Web3·DeFi 위협) | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_KR.md) — GlassWorm (공급망 자가전파 웜) | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_KR.md) — Gitea CVE 취약점 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JA](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_KR.md) — AI 크립토재킹 | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) — 영국의 러시아 암호화폐 제재 분석 | 🟠 MEDIUM | [KO](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) — 김수키(APT43) PebbleDash·AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_KR.md) — 동시 발생 이중 위협 (LiteSpeed·Shai-Hulud) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_KR.md) — EDR 우회 위협 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_KR.md) — Windows BitLocker 우회 제로데이 | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_KR.md) — 2026 북한 해킹 동향 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — GitHub 내부 저장소 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20KR.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Exchange Server 취약점 | 🔴 HIGH | [KR · EN](CTI-2026-0520-EXCHANGE.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) — EvilTokens (AI 디바이스 코드 피싱 PhaaS) | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal 코어 최고위험 제로데이 (패치 없음) | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) — cPanel 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_KR.md) — 북한의 LLM을 이용한 해킹 / AI 사이버 공격·에이전트 방어 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) — 러시아 RAT (LNK·RDP) | 🔴 HIGH | [KO](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS 사이드채널 | 🟠 MEDIUM | [KO](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — 북한 Lazarus git hooks 은닉 기법 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Mythos AI 취약점 | 🔴 HIGH | [KR](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_KR.md) — ScarCruft(APT37) 캠페인 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — 바이브: 인공지능 해킹의 시대 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) — CopyFail (CVE-2026-31431) | 🔴 HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20kr.MD) — 라이트코인 취약점 | 🟠 MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20kr.MD) — MCP를 노리는 지능형·잠복형 공격 | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) · [PRESS](CTI-2026-0422-MCP-PRESS_KR.md) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_KR.md) — Vercel 보안 침해 (AI SaaS 공급망·ShinyHunters) | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit·사이버 무기 공급망 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20中文版.md) |

---

## 주제별 분류 (By Category)

### 🌐 공급망 공격 (Supply Chain Attacks)
신뢰하는 제3자 벤더·오픈소스 패키지·개발 인프라를 먼저 침해해 간접 접근하는 공격 유형.
* `CTI-2026-0611-MIASMA_SPRINGBLIGHT` · `CTI-2026-0605-CLAUDECODE` · `CTI-2026-0605-IRONWORM` · `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0527-GLASSWORM` · `CTI-2026-0527-GITEA` · `CTI-2026-0530-GOGS` · `CTI-2026-0524-DUALTHREAT` · `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` · `CTI-2026-0420-VERCEL`

### 🔓 제로데이·취약점 (Zero-Day & Vulnerabilities)
패치 전·악용 중인 취약점과 경계·미들웨어·웹 플랫폼 결함 분석.
* `CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE` · `CTI-2026-0605-AI-ZERODAY` · `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0603-NETSCALER` · `CTI-2026-0603-ANDROID-EOP` · `CTI-2026-0602-MIRAI-ZERODAY` · `CTI-2026-0521-YELLOWKEY` · `CTI-2026-0520-DRUPAL` · `CTI-2026-0520-EXCHANGE` · `CTI-2026-0520-CPANEL` · `CTI-2026-0430-COPYFAIL` · `CTI-2026-0320-CORUNA`

### 🕵️ 북한·국가배후 위협 (DPRK & State-Sponsored)
APT 그룹의 TTP·캠페인·귀속 분석.
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` (APT43) · `CTI-2026-0510-LAZARUS-GITHOOKS` · `CTI-2026-0507-SCARCRUFT` (APT37) · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0605-LAZARUS-CLICKFIX` · `CTI-2026-0517-AICYBER` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0514-CTRL_RussianRAT`

### 🤖 AI·LLM 위협 (AI / LLM Threats)
생성형 AI·LLM·MCP를 공격에 활용하거나 표적으로 삼는 위협.
* `CTI-2026-0605-AI-ZERODAY` · `CTI-2026-0605-CLAUDECODE` · `CTI-2026-0601-GREYVIBE` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0530-CHATGPHISH` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0520-EVILTOKENS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0514-ChatGPT_DNS_SideChannel` · `CTI-2026-0510-MYTHOS-AI` · `CTI-2026-0505-VIBE` · `CTI-2026-0422-MCP`

### 💰 Web3·암호화폐 (Web3 & Crypto)
DeFi·CEX·스테이블코인 침해 및 제재·컴플라이언스 분석.
* `CTI-2026-0528-KELPDAO` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` · `CTI-2026-0427-LITECOIN`

### 🇰🇷 한국 사이버 안보 정책 (Korea Cybersecurity Policy)
국내 정부·공공·금융·방산 대상 위협과 제도적 대응 권고.
* `CTI-2026-0604-TVING` · `CTI-2026-0604-CU_BREACH` · `CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY` · `CTI-2026-0320-CORUNA` · `CTI-2026-0420-VERCEL` · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0604-WEBSPHERE`

### 🛡️ 클라우드·CI/CD 공급망 보안 (Cloud & CI/CD Supply Chain)
클라우드·GitHub Actions·OIDC·CI/CD를 통한 공급망 공격.
* `CTI-2026-0611-MIASMA_SPRINGBLIGHT` · `CTI-2026-0605-CLAUDECODE` · `CTI-2026-0605-IRONWORM` · `CTI-2026-0527-GLASSWORM`

---

## 🧭 분석 방법론 (Methodology)

### Traffic Light Protocol (TLP)
| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 커뮤니티 내 공유·대외 공개 가능 | **기본값** |
| 🟡 TLP:AMBER | 조직 내부 공유 한정 | 해당 없음 |
| 🔴 TLP:RED | 개별 수령자 한정 | 해당 없음 |

### 심각도 등급 (Severity)
| 등급 | 의미 | 대응 시간 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 국가안보·대규모 민간 피해 직결 | 즉시 |
| 🔴 **HIGH** | 산업·생태계 광범위 영향 | 24–72시간 |
| 🟠 **MEDIUM** | 특정 기업·조직군 제한 영향 | 7일 이내 |
| 🟡 **LOW** | 인지·관찰 수준 | 30일 이내 |

### 프레임워크 참조
* **MITRE ATT&CK** — TTP 매핑 표준
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링

각 Key Judgment는 **High / Medium / Low** 신뢰도를 명시하며, 1차 자료와 2차 공개 CTI를 교차 검증합니다.

---

## 파일 명명 규칙 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0604-WEBSPHERE_EN.md   → 2026-06-04 발행, WebSphere 분석, 영문 Markdown
  CTI-2026-0603-NETSCALER_KR.md   → 2026-06-03 발행, NetScaler 분석, 한국어
```
* `SUBJECT` — 리포트 주제 키워드 (대문자)
* `LANG` — `KR/KO` (한국어) · `EN` (영어) · `JP/JA` (일본어) · `CN/ZH` (중국어)
* `ext` — `md` (기본) · `pdf` (정식 배포본)

---

## 연락·기여 (Contact & Contribution)

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 피드백·정정·제보 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC·레퍼런스 추가 제안 |
| **제보 보호** | 민감 제보는 Signal·ProtonMail 등 보안 채널로 문의 |

---

## 면책 조항 (Disclaimer)

1. 본 저장소의 모든 리포트는 **공개 OSINT 자료·언론 보도** 기반의 독립 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용해야 하며, 공격·침해·불법 활동 사용을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직간접 사용으로 발생하는 어떠한 손해에도 책임지지 않습니다.

---

## 저장소 통계 (Repository Stats)

|  |  |
| --- | --- |
| **총 리포트 수** | 50 (시리즈 기준) |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **주요 위협 행위자** | Lazarus · Kimsuky(APT43) · ScarCruft(APT37) · ShinyHunters · GREYVIBE · Miasma · IronWorm · 외 다수 |
| **최근 업데이트** | 2026-06-11 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
