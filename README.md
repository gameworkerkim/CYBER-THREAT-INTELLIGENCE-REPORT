# Cyber Threat Intelligence Report
<!--
SEO Keywords: 사이버 위협 인텔리전스, CTI, OSINT, APT, 북한 해킹, 라자루스, 김수키, 공급망 공격, 제로데이, AI 보안, LLM 위협, Web3 보안, 암호화폐 해킹, 개인정보 유출, 한국 사이버 보안, Dennis Kim, 위협 분석, 취약점 분석, 보안 리포트
-->

> **독립 사이버 위협 인텔리전스(CTI) 리포트 아카이브 — OSINT 기반 방어·연구·정책 분석**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research · Supply Chain · Zero-Day · DPRK APT · AI/LLM · Web3*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--10--30-informational?style=flat-square)
[![Ask DeepWiki](https://img.shields.io/badge/Ask-DeepWiki-1F6FEB?style=flat-square)](https://deepwiki.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

**언어 / Languages:** **한국어 (이 문서)** · [English](README_EN.md) · [日本語](README_JP.md) · [中文](README_CN.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI / OSINT) 리포트**를 수집·발행하는 독립 아카이브입니다. 공급망 공격(Supply Chain Attack), 제로데이(Zero-Day), 북한·국가배후 APT( Lazarus / Kimsuky / ScarCruft / Andariel ), AI·LLM 위협, Web3·암호화폐 보안, 한국 개인정보 유출·정책 이슈를 심층 분석합니다. 모든 리포트는 공개 OSINT 기반이며 특정 조직의 공식 입장을 대변하지 않습니다. 다국어(KR/EN/JP/ZH)로 제공됩니다.

LLM/에이전트용 인덱스: [`llms.txt`](llms.txt)

---

## 분석가 소개 (About the Analyst)

| | |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · 전 CyworldZ CEO · 독립 위협 인텔리전스 분석가 |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 최신 리포트 (Latest — Featured)

> ⭐ 새 리포트를 놓치지 않으려면 저장소 우측 상단의 **Star**와 **Watch**를 눌러 주세요. 전체 목록은 아래 [전체 리포트 목록](#전체-리포트-목록-report-index)에 있습니다.

> **2026-10-30 발행**

### 리눅스 커널 TCP Use-After-Free (CVE-2026-98432) — 인증 없는 원격 루트, Ubuntu·RHEL 미수정

**CTI-2026-1030-TCP** · HIGH · TLP:CLEAR

IPv4 TCP 핸드셰이크 경로의 UAF로 인증 없이 원격 루트까지 실증된 취약점. 커널 팀(9.8)과 벤더(5.9~8.1) 간 CVSS 혼선, 배포판별 패치 공백과 그 사이의 대응법을 정리합니다. 방어용 탐지 도구·검증랩은 [`Linux_TCP/`](Linux_TCP/)에 함께 공개합니다(익스플로잇 코드 미포함).

**리포트:** [KR](CTI-2026-1030-TCP_KR.md) · **도구:** [Linux_TCP](Linux_TCP/README.md) · [MANUAL](Linux_TCP/MANUAL.md) · [FEATURES](Linux_TCP/FEATURES.md)

---

> **2026-10-22 발행**

### PHP2Shell — PHP 코어 비인증 RCE 2종 (CVE-2026-109618 / CVE-2026-109619)

**CTI-2026-10-22-PHP** · CRITICAL · TLP:CLEAR

웹 요청을 처리하는 모든 PHP 서버에 영향을 주는 CVSS 9.2 취약점 2건. 공식 공개 전 세부 정보가 유출됐고 허니팟에서 악용 시도가 관측됐습니다. 즉시 업그레이드 대상 버전, SAPI별 위험도, EOL 버전 대응을 다룹니다.

**리포트:** [KR](CTI-2026-10-22-PHP_KR.md)

---

> **2026-10-22 발행**

### eMudhra 중간 CA 개인 키 유출과 CVE-2026-91403 — 브라우저는 막았지만 JVM은 아직 믿는다

**CTI-2026-10-22-OPENJDK** · CRITICAL · TLP:CLEAR

공개 인증서만으로 복구된 중간 CA 개인 키 8개. 기본 설정에서 해지 확인을 하지 않는 Java 환경이 위조 체인을 신뢰하는 문제와 JDK 업그레이드·blocked.certs 교체 대응을 정리합니다.

**리포트:** [KR](CTI-2026-10-22-OPENJDK_KR.md)

---

> **2026-10-15 발행**

### 북한 '노트북 팜' 사건 — 채용을 통과하는 내부자 위협

**CTI-2026-1015-DPRK-LAPTOP-FARM** · HIGH · TLP:CLEAR

방화벽이 아니라 인사·재무가 1차 공격 표면입니다. FBI PSA와 CrowdStrike 자료를 대조해 조력자 역할 확대, 소형·분산화되는 팜, 외화벌이 구조를 분석합니다.

**리포트:** [KR](CTI-2026-1015-DPRK-LAPTOP-FARM_KR.md)

---

> **2026-10-10 발행**

### 아래아 한글은 왜 북한 해킹의 게이트웨이가 되었나

**CTI-2026-1010-HWP** · HIGH · TLP:CLEAR

10년 넘게 북한 APT의 가장 확실한 출입문이었던 HWP. 공문서 생태계의 잠금 효과, 30년 묵은 C 코드, APT37 사례와 포맷 전환만으로 끝나지 않는 이유를 다룹니다.

**리포트:** [KR](CTI-2026-1010-HWP_KR.md) · [EN](CTI-2026-1010-HWP_EN.md) · [JP](CTI-2026-1010-HWP_JA.md) · [ZH](CTI-2026-1010-HWP_CN.md)

---

> **2026-10-08 발행**

### FortiBleed는 끝나지 않았다 — FortiGate 자격 증명 탈취 캠페인

**CTI-2026-1008-FortiBleed** · CRITICAL · TLP:CLEAR

FBI·비밀경호국이 경고한 86,644개 유출 자격 증명의 현행 악용. 패치만으로는 잃어버린 열쇠를 회수할 수 없으며, 계정 감사·세션 종료를 먼저 해야 하는 이유를 정리합니다.

**리포트:** [KR](CTI-2026-1008-FortiBleed.md)

---

## Awesome Security Series: Startup Security Guide & LLM CISO

> **2026-06-17 발행** — 한국 진출 해외 스타트업을 위한 보안 가이드

티빙·CU·패스트캠퍼스 사고에서 드러난 것처럼, 스타트업은 설정 실수 한 번에 대규모 개인정보 유출로 이어질 수 있습니다. 특히 한국에 진출하는 해외 스타트업은 GDPR/CCPA와 전혀 다른 **한국 개인정보보호법(PIPA)** 의무를 간과하기 쉽습니다.

[**Startup Security Guide 살펴보기 →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

| 언어 | 가이드 | LLM CISO 프롬프트 | 대시보드 | 로드맵 |
|------|--------|------------------|----------|--------|
| 한국어 | [가이드](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_KR.md) | [프롬프트](Startup_Security_Guide/LLM_CISO_PROMPT_KR.md) | [대시보드](Startup_Security_Guide/LLM_CISO_DASHBOARD.md) | [ROADMAP](Startup_Security_Guide/ROADMAP.md) |
| English | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_EN.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_EN.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD_EN.md) | [ROADMAP](Startup_Security_Guide/ROADMAP_EN.md) |

> Phase 3 방향: **SKIL → MCP → 자기 교정 → Slack/Telegram·팀 공유**. 상세는 [ROADMAP.md](Startup_Security_Guide/ROADMAP.md).


---

## Awesome Security Series: Static Analysis Security Tools

오픈소스 SAST 도구 컬렉션 (Semgrep, CodeQL, SonarQube 등).

[**Awesome Static Analysis Security (SAST) Tools →**](Awesome%20Static%20Analysis%20Security%20Tools.md)


---

## Awesome Security Series: LAON VaultGuard

멀티 LLM 교차검증 시크릿 탐지 도구 (티빙 AWS 키 노출 교훈).

[**LAON VaultGuard →**](https://github.com/gameworkerkim/vibe-investing/tree/main/LAON_VaultGuard) · [리포트 KR](CTI-2026-0607-LAON_VaultGuard_KR.md) · [EN](CTI-2026-0607-LAON_VaultGuard_EN.md)


---

## Open Security Tools & Guides

방어·검증 목적의 오픈소스 도구와 실무 가이드입니다. 모든 도구는 **본인 소유 또는 서면 허가를 받은 대상**에만 사용하십시오.

| 이름 | 설명 | 링크 |
| --- | --- | --- |
| **Linux_TCP** | CVE-2026-98432 방어 관점 분석·사전 탐지 도구, 수정 커밋 분석, QEMU 패치 검증랩 (익스플로잇 미포함) | [README](Linux_TCP/README.md) · [MANUAL](Linux_TCP/MANUAL.md) |
| **Heimdallr (헤임달)** | ARTEX 컨셉을 계승한 LLM 멀티 에이전트 자율 모의 침투 + 사이버 보안 지식 축적 시스템 (방어 중심·권한 검증 기반) | [README](Heimdallr/README.md) · [Concept KR](Heimdallr/concept_KR.md) · [Roadmap](Heimdallr/roadmap.md) |
| **Codex Open Security** | OpenAI Codex Security의 오픈웨이트 대안 — DeepSeek V4·Kimi K3·Qwen 기반 취약점 스캐닝 CLI·SDK | [README](Codex-Security-KiMI-K3/README.md) · [리포트 KR](Codex-Security-KiMI-K3/CTI-2026-0729-CODEX-OPEN-SECURITY_KR.md) |
| **CVP 신청 가이드** | Anthropic Cyber Verification Program(CVP) 신청 실무 가이드 | [가이드](Claude%20Cyber%20Verification%20Program%20guide.md) |
| **KISA AI 보안 위협 대응 매뉴얼 리뷰** | KISA 「AI 보안 위협 대응 매뉴얼」(2026.7)을 현업 CTI 관점에서 검토 | [리뷰](KISA-AI%20Security%20Threat%20Response%20Manual_Review.md) |

---

## 전체 리포트 목록 (Report Index)

> 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명: `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`
> ※ 심각도는 주제 기준 참고치이며, 각 리포트 본문 평가가 우선합니다.

| 발행일 | ID / 제목 | 심각도 | 언어 |
| --- | --- | --- | --- |
| 2026-10-30 | [`CTI-2026-1030-TCP`](CTI-2026-1030-TCP_KR.md) — 리눅스 커널 TCP Use-After-Free (CVE-2026-98432) | HIGH | [KR](CTI-2026-1030-TCP_KR.md) · [Tools](Linux_TCP/README.md) |
| 2026-10-22 | [`CTI-2026-10-22-PHP`](CTI-2026-10-22-PHP_KR.md) — PHP2Shell — PHP 코어 비인증 RCE 2종 (CVE-2026-109618/109619) | CRITICAL | [KR](CTI-2026-10-22-PHP_KR.md) |
| 2026-10-22 | [`CTI-2026-10-22-OPENJDK`](CTI-2026-10-22-OPENJDK_KR.md) — eMudhra 중간 CA 개인 키 유출과 CVE-2026-91403 (JVM 신뢰 체인) | CRITICAL | [KR](CTI-2026-10-22-OPENJDK_KR.md) |
| 2026-10-15 | [`CTI-2026-1015-DPRK-LAPTOP-FARM`](CTI-2026-1015-DPRK-LAPTOP-FARM_KR.md) — 북한 노트북 팜 — 채용을 통과하는 내부자 위협 | HIGH | [KR](CTI-2026-1015-DPRK-LAPTOP-FARM_KR.md) |
| 2026-10-10 | [`CTI-2026-1010-HWP`](CTI-2026-1010-HWP_KR.md) — 아래아 한글은 왜 북한 해킹의 게이트웨이가 되었나 | HIGH | [KR](CTI-2026-1010-HWP_KR.md) · [EN](CTI-2026-1010-HWP_EN.md) · [JP](CTI-2026-1010-HWP_JA.md) · [ZH](CTI-2026-1010-HWP_CN.md) |
| 2026-10-08 | [`CTI-2026-1008-FortiBleed`](CTI-2026-1008-FortiBleed.md) — FortiBleed — FortiGate 자격 증명 탈취 캠페인 | CRITICAL | [KR](CTI-2026-1008-FortiBleed.md) |
| 2026-10-07 | [`CTI-2026-10-07-Qilin-Japan-Arrest`](CTI-2026-10-07-Qilin-Japan-Arrest.md) — 키린(Qilin) 랜섬웨어 조직원 일본 체포가 의미하는 것 | CRITICAL | [KR](CTI-2026-10-07-Qilin-Japan-Arrest.md) |
| 2026-10-04 | [`CTI-2026-1004-AI-HACKING-TREND`](CTI-2026-1004-AI-HACKING-TREND.md) — AI가 연 것은 새로운 문이 아니라 잠그지 않은 옆문이다 (AI 악용 금융·기업 해킹) | HIGH | [KR](CTI-2026-1004-AI-HACKING-TREND.md) |
| 2026-10-02 | [`CTI-2026-1002-AI-BANK-HACKING`](CTI-2026-1002-AI-BANK-HACKING.md) — 은행이 뚫렸다 — AI 해킹의 시대, 방어의 판을 바꿔야 한다 | HIGH | [KR](CTI-2026-1002-AI-BANK-HACKING.md) |
| 2026-09-13 | [`CTI-2026-0913-CHINA-HACKING`](CTI-2026-0913-CHINA-HACKING.md) — 왜 중국 해커는 한국을 털고 자랑했을까? | MEDIUM | [KR](CTI-2026-0913-CHINA-HACKING.md) |
| 2026-09-10 | [`CTI-2026-0910-KIMSUKY`](CTI-2026-0910-KIMSUKY.md) — 김수키(Kimsuky) AI 무기화 종합 분석 (Operation GitPower 변종) | HIGH | [KR](CTI-2026-0910-KIMSUKY.md) |
| 2026-08-22 | [`CTI-2026-0822-CERT-BREACH`](CTI-2026-0822-Column-KR.md) — 명함 한 장의 무게 — 인증기관 침해는 왜 2차 공격의 시그널인가 | HIGH | [KR](CTI-2026-0822-Column-KR.md) · [EN](CTI-2026-0822-Column-EN.md) · [JP](CTI-2026-0822-Column-JA.md) · [ZH](CTI-2026-0822-Column-CN.md) |
| 2026-08-04 | [`CTI-2026-0804-COLDCARD-RNG`](CTI-2026-0804-COLDCARD-RNG_KR.md) — Coldcard 시드 엔트로피 결함과 8,860만 달러 시드 재현 스위핑 | CRITICAL | [KR](CTI-2026-0804-COLDCARD-RNG_KR.md) |
| 2026-07-30 | [`CTI-2026-0730-WEMIX`](CTI-2026-0730-WEMIX_KR.md) — 위믹스(WEMIX) 연속 해킹 사태 — 오너 권한 침해와 보안 감사의 한계 | HIGH | [KR](CTI-2026-0730-WEMIX_KR.md) · [EN](CTI-2026-0730-WEMIX_EN.md) · [JP](CTI-2026-0730-WEMIX_JP.md) · [ZH](CTI-2026-0730-WEMIX_CN.md) |
| 2026-07-29 | [`CTI-2026-0729-CODEX-OPEN-SECURITY`](Codex-Security-KiMI-K3/CTI-2026-0729-CODEX-OPEN-SECURITY_KR.md) — Codex Open Security — Codex Security의 오픈웨이트 전환 분석 | INFO | [KR](Codex-Security-KiMI-K3/CTI-2026-0729-CODEX-OPEN-SECURITY_KR.md) · [Tool](Codex-Security-KiMI-K3/README.md) |
| 2026-07-28 | [`CTI-2026-0728-HANWHA`](CTI-2026-0728-HANWHA_KR.md) — 한화비전 카메라 펌웨어 GitHub 토큰 노출과 CI 파이프라인 붕괴 | HIGH | [KR](CTI-2026-0728-HANWHA_KR.md) · [EN](CTI-2026-0728-HANWHA_EN.md) · [JP](CTI-2026-0728-HANWHA_JP.md) · [ZH](CTI-2026-0728-HANWHA_CN.md) |
| 2026-07-26 | [`CTI-2026-0726-DPRK-BANK-HACKERS`](CTI-2026-0726-DPRK-BANK-HACKERS_KR.md) — 北 내부 해커의 자국 중앙은행 해킹 보도 (미검증 단보) | MEDIUM | [KR](CTI-2026-0726-DPRK-BANK-HACKERS_KR.md) · [EN](CTI-2026-0726-DPRK-BANK-HACKERS_EN.md) · [JP](CTI-2026-0726-DPRK-BANK-HACKERS_JA.md) · [ZH](CTI-2026-0726-DPRK-BANK-HACKERS_CN.md) |
| 2026-07-25 | [`CTI-2026-0725-FLOWSINT`](CTI-2026-0725-FLOWSINT_KR.md) — Flowsint — 오픈소스 OSINT 그래프 탐색 도구 리뷰 | INFO | [KR](CTI-2026-0725-FLOWSINT_KR.md) · [EN](CTI-2026-0725-FLOWSINT_EN.md) · [JP](CTI-2026-0725-FLOWSINT_JA.md) · [ZH](CTI-2026-0725-FLOWSINT_CN.md) |
| 2026-07-24 | [`CTI-2026-0724-WEEKLY`](CTI-2026-0724-WEEKLY_KR.md) — 주간 사이버 위협 인텔리전스 (7/20–7/24) | CRITICAL | [KR](CTI-2026-0724-WEEKLY_KR.md) · [EN](CTI-2026-0724-WEEKLY_EN.md) · [JP](CTI-2026-0724-WEEKLY_JA.md) · [ZH](CTI-2026-0724-WEEKLY_CN.md) |
| 2026-07-20 | [`CTI-2026-0720-MOFA-KNDA`](CTI-2026-0720-MOFA-KNDA_KR.md) — 국립외교원 온라인교육시스템 장기 해킹 침해 (외교관 개인정보 유출 정황) | CRITICAL | [KR](CTI-2026-0720-MOFA-KNDA_KR.md) · [EN](CTI-2026-0720-MOFA-KNDA_EN.md) · [JP](CTI-2026-0720-MOFA-KNDA_JP.md) |
| 2026-07-20 | [`CTI-2026-0720-IITP`](CTI-2026-0720-IITP_KR.md) — IITP 개인정보접속기록관리 시스템 침해 (7개월 만의 재침해) | HIGH | [KR](CTI-2026-0720-IITP_KR.md) |
| 2026-07-18 | [`CTI-2026-0718-WEEKLY`](CTI-2026-0718-WEEKLY_KR.md) — 주간 사이버 위협 인텔리전스 (7/13–7/18) | HIGH | [KR](CTI-2026-0718-WEEKLY_KR.md) |
| 2026-07-15 | [`CTI-2026-0715-OSTIUM`](CTI-2026-0715-OSTIUM_KR.md) — Ostium OLP Vault 오라클 조작 익스플로잇 ($11.86M–$23.7M) | HIGH | [KR](CTI-2026-0715-OSTIUM_KR.md) |
| 2026-07-15 | [`CTI-2026-0715-LINEYAHOO`](CTI-2026-0715-LINEYAHOO_KR.md) — LY(라인야후) LINE GAME 내부식별자 외부송신 사고 | MEDIUM/HIGH | [KR](CTI-2026-0715-LINEYAHOO_KR.md) |
| 2026-07-13 | [`CTI-2026-0713-NEWJISTOCK`](CTI-2026-0713-NEWJISTOCK_KR.md) — 뉴지스탁 개인정보 유출 (스피어피싱·MTTD 127일) | HIGH | [KR](CTI-2026-0713-NEWJISTOCK_KR.md) |
| 2026-07-11 | [`CTI-2026-0711-WEEKLY`](CTI-2026-0711-WEEKLY_KR.md) — 주간 사이버 위협 인텔리전스 (7/8–7/10) | HIGH | [KR](CTI-2026-0711-WEEKLY_KR.md) |
| 2026-07-11 | [`CTI-2026-0711-BONZO`](CTI-2026-0711-BONZO_KR.md) — Bonzo Finance 오라클 익스플로잇 (Hedera, $9.05M) | HIGH | [KR](CTI-2026-0711-BONZO_KR.md) |
| 2026-07-11 | [`CTI-2026-0711-SWIFTVIBE`](CTI-2026-0711-SWIFTVIBE_KR.md) — 72시간 AWS 클라우드 침해 — 에이전틱 AI 공격 SWIFTVIBE | HIGH | [KR](CTI-2026-0711-SWIFTVIBE_KR.md) · [EN](CTI-2026-0711-SWIFTVIBE_EN.md) |
| 2026-07-08 | [`CTI-2026-0708-KAKAO`](CTI-2026-0708-KAKAO_KR.md) — 카카오스타일 지그재그 해킹으로 확정 | HIGH | [KR](CTI-2026-0708-KAKAO_KR.md) · [EN](CTI-2026-0708-KAKAO_EN.md) · [PDF](CTI-2026-0708-KAKAO_KR.pdf) |
| 2026-07-05 | [`CTI-2026-0705-WEEKLY`](CTI-2026-0705-WEEKLY_EN.md) — Weekly CTI briefing (EN) | MEDIUM | [EN](CTI-2026-0705-WEEKLY_EN.md) |
| 2026-07-05 | [`CTI-2026-0705-KRWEEKLY`](CTI-2026-0705-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | MEDIUM | [KR](CTI-2026-0705-KRWEEKLY_KR.md) |
| 2026-07-04 | [`CTI-2026-0704-SCATTEREDSPIDER`](CTI-2026-0704-SCATTEREDSPIDER_KR.md) — Scattered Spider 위협 분석 | HIGH | [KR](CTI-2026-0704-SCATTEREDSPIDER_KR.md) · [EN](CTI-2026-0704-SCATTEREDSPIDER_EN.md) |
| 2026-06-28 | [`CTI-2026-0628-GITHUB-KEY-LEAK`](CTI-2026-0628-GITHUB-KEY-LEAK_KR.md) — GitHub 키 유출 사고 분석 | HIGH | [KR](CTI-2026-0628-GITHUB-KEY-LEAK_KR.md) · [EN](CTI-2026-0628-GITHUB-KEY-LEAK_EN.md) · [PDF](CTI-2026-0628-GITHUB-KEY-LEAK_KR.pdf) |
| 2026-06-28 | [`CTI-2026-0628-DPRK-AI`](CTI-2026-0628-DPRK-AI_KR.md) — 북한 AI 활용 해킹의 질적 전환 분석 | HIGH | [KR](CTI-2026-0628-DPRK-AI_KR.md) · [EN](CTI-2026-0628-DPRK-AI_EN.md) · [JP](CTI-2026-0628-DPRK-AI_JP.md) |
| 2026-06-26 | [`CTI-2026-0626-KRWEEKLY`](CTI-2026-0626-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | MEDIUM | [KR](CTI-2026-0626-KRWEEKLY_KR.md) |
| 2026-06-26 | [`CTI-2026-0626-JSDF-USB`](CTI-2026-0626-JSDF-USB_KR.md) — 자위대 USB 관련 위협 | HIGH | [KR](CTI-2026-0626-JSDF-USB_KR.md) |
| 2026-06-22 | [`CTI-2026-0622-TAIKOBRIDGE`](CTI-2026-0622-TAIKOBRIDGE_KR.md) — TaikoBridge 위협 분석 | HIGH | [KR](CTI-2026-0622-TAIKOBRIDGE_KR.md) |
| 2026-06-22 | [`CTI-2026-0622-KIMSUKY-LNK-DROPBOX`](CTI-2026-0622-KIMSUKY-LNK-DROPBOX_KR.md) — 김수키 LNK·Dropbox 캠페인 | HIGH | [KR](CTI-2026-0622-KIMSUKY-LNK-DROPBOX_KR.md) |
| 2026-06-21 | [`CTI-2026-0621-KRWEEKLY`](CTI-2026-0621-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | MEDIUM | [KR](CTI-2026-0621-KRWEEKLY_KR.md) |
| 2026-06-18 | [`CTI-2026-0618-PROJECT-CANOPY`](CTI-2026-0618-PROJECT-CANOPY_KR.md) — Project Canopy 칼럼 | MEDIUM | [KR](CTI-2026-0618-PROJECT-CANOPY_KR.md) |
| 2026-06-18 | [`CTI-2026-0618-MODOO`](CTI-2026-0618-MODOO_KR.md) — 모두싸인 관련 위협·유출 분석 | HIGH | [KR](CTI-2026-0618-MODOO_KR.md) · [EN](CTI-2026-0618-MODOO_EN.md) |
| 2026-06-18 | [`CTI-2026-0618-AISUPPLY`](CTI-2026-0618-AISUPPLY_KR.md) — AI 공급망 위협 | HIGH | [KR](CTI-2026-0618-AISUPPLY_KR.md) · [EN](CTI-2026-0618-AISUPPLY_EN.md) |
| 2026-06-16 | [`CTI-2026-0616-UNC6508-REDCAP`](CTI-2026-0616-UNC6508-REDCAP_KR.md) — UNC6508 RedCap 캠페인 | HIGH | [KR](CTI-2026-0616-UNC6508-REDCAP_KR.md) · [EN](CTI-2026-0616-UNC6508-REDCAP_EN.md) |
| 2026-06-16 | [`CTI-2026-0616-PRC-INFLUENCE-OPS`](CTI-2026-0616-PRC-INFLUENCE-OPS_KR.md) — 중국 영향 공작 분석 | HIGH | [KR](CTI-2026-0616-PRC-INFLUENCE-OPS_KR.md) |
| 2026-06-16 | [`CTI-2026-0616-PHPBB-AUTH-BYPASS`](CTI-2026-0616-PHPBB-AUTH-BYPASS_KR.md) — phpBB 인증 우회 | HIGH | [KR](CTI-2026-0616-PHPBB-AUTH-BYPASS_KR.md) |
| 2026-06-12 | [`CTI-2026-0612-QSHING`](CTI-2026-0612-QSHING_KR.md) — 큐싱(Qishing) 위협 | HIGH | [KR](CTI-2026-0612-QSHING_KR.md) · [EN](CTI-2026-0612-QSHING_EN.md) |
| 2026-06-12 | [`CTI-2026-0612-ANDROID`](CTI-2026-0612-ANDROID_KR.md) — Android 위협 분석 | HIGH | [KR](CTI-2026-0612-ANDROID_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-ROGUEPLANET_MINIPLASMA`](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) — RoguePlanet / MiniPlasma 위협 | HIGH | [KR](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE`](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) — Microsoft 6월 패치 화요일 206개 CVE | HIGH | [KR](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MIASMA_SPRINGBLIGHT`](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) — Microsoft 공급망: Miasma(Spring Blight) Azure 패키지 감염 | CRITICAL | [KR](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) · [EN](CTI-2026-0611-MIASMA_SPRINGBLIGHT_EN.md) |
| 2026-06-11 | [`CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY`](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) — 패스트캠퍼스·데이원컴퍼니 GitHub 마스터키 탈취 | HIGH | [KR](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) · [EN](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_EN.md) |
| 2026-06-07 | [`CTI-2026-0607-LAON_VaultGuard`](CTI-2026-0607-LAON_VaultGuard_KR.md) — LAON VaultGuard — 멀티 LLM 시크릿 탐지 | MEDIUM | [KR](CTI-2026-0607-LAON_VaultGuard_KR.md) · [EN](CTI-2026-0607-LAON_VaultGuard_EN.md) |
| 2026-06-07 | [`CTI-2026-0607-BREACH-WFP`](CTI-2026-0607-BREACH-WFP_KR.md) — WFP 침해 관련 분석 | HIGH | [KR](CTI-2026-0607-BREACH-WFP_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-LAZARUS-CLICKFIX`](CTI-2026-0605-LAZARUS-CLICKFIX_KR.md) — Lazarus macOS ClickFix 캠페인 | HIGH | [KR](CTI-2026-0605-LAZARUS-CLICKFIX_KR.md) · [EN](CTI-2026-0605-LAZARUS-CLICKFIX_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-IRONWORM`](CTI-2026-0605-IRONWORM_KR.md) — IronWorm 공급망 웜 | HIGH | [KR](CTI-2026-0605-IRONWORM_KR.md) · [EN](CTI-2026-0605-IRONWORM_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-CLAUDECODE`](CTI-2026-0605-CLAUDECODE_KR.md) — Claude Code GitHub Action 공급망 취약점 | HIGH | [KR](CTI-2026-0605-CLAUDECODE_KR.md) · [EN](CTI-2026-0605-CLAUDECODE_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-AI-ZERODAY`](CTI-2026-0605-AI-ZERODAY_KR.md) — AI 생성 제로데이 익스플로잇 | HIGH | [KR](CTI-2026-0605-AI-ZERODAY_KR.md) · [EN](CTI-2026-0605-AI-ZERODAY_EN.md) |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE_KR.md) — IBM WebSphere 동시 공개 3종 CVE | CRITICAL | [KR](CTI-2026-0604-WEBSPHERE_KR.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JP](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-04 | [`CTI-2026-0604-TVING`](CTI-2026-0604-TVING_KR.md) — 티빙 개인정보 대량 유출 | CRITICAL | [KR](CTI-2026-0604-TVING_KR.md) · [EN](CTI-2026-0604-TVING_EN.md) · [JP](CTI-2026-0604-TVING_JA.md) · [ZH](CTI-2026-0604-TVING_ZH.md) · [PDF](CTI-2026-0604-TVING_KR.pdf) |
| 2026-06-04 | [`CTI-2026-0604-CU_BREACH`](CTI-2026-0604-CU_BREACH_KR.md) — CU 편의점 택배 개인정보 유출 | CRITICAL | [KR](CTI-2026-0604-CU_BREACH_KR.md) · [EN](CTI-2026-0604-CU_BREACH_EN.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_KR.md) — Citrix NetScaler 메모리 오버리드 악용 | CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-03 | [`CTI-2026-0603-ANDROID-EOP`](CTI-2026-0603-ANDROID-EOP_KR.md) — Android EoP 취약점 | HIGH | [KR](CTI-2026-0603-ANDROID-EOP_KR.md) |
| 2026-06-02 | [`CTI-2026-0602-MIRAI-ZERODAY`](CTI-2026-0602-MIRAI-ZERODAY_KR.md) — Mirai 봇넷 제로데이 악용 | HIGH | [KR](CTI-2026-0602-MIRAI-ZERODAY_KR.md) · [EN](CTI-2026-0602-MIRAI-ZERODAY_EN.md) |
| 2026-06-02 | [`CTI-2026-0602-MIASMA-RH`](CTI-2026-0602-MIASMA-RH_KR.md) — Miasma RH 위협 | HIGH | [KR](CTI-2026-0602-MIASMA-RH_KR.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_KR.md) — 이란의 생성형 AI 전쟁 활용 | HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [ZH](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GREYVIBE GenAI 우크라이나 표적 작전 | HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) · [EN](CTI-2026-0601-GREYVIBE_EN.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_KR.md) — MARIMO 권고문 무기화 | HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [ZH](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_KR.md) — JINX 위협 분석 | HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [ZH](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_KR.md) — Gogs Git 서버 취약점 | HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [ZH](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_KR.md) — ChatGPhish ChatGPT 사칭 피싱 | HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [ZH](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_KR.md) — KelpDAO Web3·DeFi 위협 | HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JP](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_KR.md) — GlassWorm 공급망 자가전파 웜 | CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JP](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_KR.md) — Gitea CVE 취약점 | HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JP](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_KR.md) — AI 크립토재킹 | MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JP](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.md) — 영국의 러시아 암호화폐 제재 | MEDIUM | [KR](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JP](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) · [PDF](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.pdf) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_KR.md) — 김수키(APT43) PebbleDash·AppleSeed | HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH_KR.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [ZH](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_KR.md) — 동시 발생 이중 위협 (LiteSpeed·Shai-Hulud) | HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [ZH](CTI-2026-0524-DUALTHREAT_CN.md) · [PDF](CTI-2026-0524-DUALTHREAT_KR.pdf) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_KR.md) — EDR 우회 위협 | HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) · [PDF](CTI-2026-0522-EDR3_KR.pdf) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_KR.md) — Windows BitLocker 우회 제로데이 | CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_KR.md) — 2026 북한 해킹 동향 | MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB_KR.md) — GitHub 내부 저장소 해킹 | HIGH | [KR](CTI-2026-0520-GITHUB_KR.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16_KR.md) — FAST16 | HIGH | [KR](CTI-2026-0520-FAST16_KR.md) · [EN](CTI-2026-0520-FAST16_EN.md) · [JP](CTI-2026-0520-FAST16_JA.md) · [ZH](CTI-2026-0520-FAST16_ZH.md) · [PDF](CTI-2026-0520-FAST16_KR.pdf) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE_KR.md) — Exchange Server 취약점 | HIGH | [KR](CTI-2026-0520-EXCHANGE_KR.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS_KR.md) — EvilTokens AI 디바이스 코드 피싱 PhaaS | HIGH | [KR](CTI-2026-0520-EVILTOKENS_KR.md) · [EN](CTI-2026-0520-EVILTOKENS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL_KR.md) — Drupal 코어 최고위험 제로데이 | CRITICAL | [KR](CTI-2026-0520-DRUPAL_KR.md) · [EN](CTI-2026-0520-DRUPAL_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL_KR.md) — cPanel 해킹 | HIGH | [KR](CTI-2026-0520-CPANEL_KR.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_KR.md) — 북한 LLM 해킹 / AI 사이버 공격·에이전트 방어 | HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](CTI-2026-0517-AICYBER_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KR.md) — ChatGPT DNS 사이드채널 | MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KR.md) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT_LNK_RDP`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KR.md) — 러시아 RAT (LNK·RDP) | HIGH | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KR.md) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](CTI-2026-0510-MYTHOS-AI_KR.md) — Mythos AI 취약점 | HIGH | [KR](CTI-2026-0510-MYTHOS-AI_KR.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — Lazarus git hooks 은닉 기법 | HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [ZH](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_KR.md) — ScarCruft(APT37) 캠페인 | HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](CTI-2026-0505-VIBE_KR.md) — 바이브: 인공지능 해킹의 시대 | MEDIUM | [KR](CTI-2026-0505-VIBE_KR.md) · [EN](CTI-2026-0505-VIBE_EN.md) · [PDF](CTI-2026-0505-VIBE_KR.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 위협 분석 | HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](CTI-2026-0430-COPYFAIL_KR.md) — CopyFail (CVE-2026-31431) | HIGH | [KR](CTI-2026-0430-COPYFAIL_KR.md) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](CTI-2026-0427-LITECOIN_KR.md) — 라이트코인 취약점 | MEDIUM | [KR](CTI-2026-0427-LITECOIN_KR.md) · [EN](CTI-2026-0427-LITECOIN_EN.md) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](CTI-2026-0422-MCP_KR.md) — MCP를 노리는 지능형·잠복형 공격 | HIGH | [KR](CTI-2026-0422-MCP_KR.md) · [EN](CTI-2026-0422-MCP_EN.md) · [JP](CTI-2026-0422-MCP_JP.md) · [ZH](CTI-2026-0422-MCP_CN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_KR.md) — Vercel 보안 침해 (AI SaaS 공급망) | HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](CTI-2026-0420-VERCEL_KR.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit·사이버 무기 공급망 | CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](CTI-2026-0320-CORUNA_EN.md) · [ZH](CTI-2026-0320-CORUNA_ZH.md) · [PDF](CTI-2026-0320-CORUNA_KR.pdf) |

---

## 주제별 분류 (By Category)

### 공급망 공격
`MIASMA_SPRINGBLIGHT` · `IRONWORM` · `CLAUDECODE` · `GLASSWORM` · `WEBSPHERE` · `GITEA` · `GOGS` · `DUALTHREAT` · `GITHUB` · `VERCEL` · `AISUPPLY` · `SWIFTVIBE` · `HANWHA` · `OPENJDK`

### 제로데이·취약점
`MSFT_PATCHTUESDAY_206CVE` · `AI-ZERODAY` · `NETSCALER` · `MIRAI-ZERODAY` · `YELLOWKEY` · `DRUPAL` · `EXCHANGE` · `COPYFAIL` · `CORUNA` · `ANDROID-EOP` · `TCP` · `PHP2Shell` · `OPENJDK` · `FortiBleed` · `COLDCARD-RNG`

### 북한·국가배후 위협
`DPRK-AI` · `KIMSUKY-PEBBLEDASH` · `KIMSUKY-LNK-DROPBOX` · `LAZARUS-GITHOOKS` · `LAZARUS-CLICKFIX` · `SCARCRUFT` · `DPRK-TRENDS` · `AICYBER` · `IRANGENAI` · `UNC6508-REDCAP` · `SCATTEREDSPIDER` · `DPRK-LAPTOP-FARM` · `HWP` · `KIMSUKY` · `DPRK-BANK-HACKERS` · `CHINA-HACKING` · `Qilin-Japan-Arrest`

### AI·LLM 위협
`SWIFTVIBE` · `AI-ZERODAY` · `CLAUDECODE` · `DPRK-AI` · `GREYVIBE` · `CHATGPHISH` · `AICRYPTOJACK` · `EVILTOKENS` · `AICYBER` · `VIBE` · `MCP` · `AISUPPLY` · `AI-BANK-HACKING` · `AI-HACKING-TREND` · `KIMSUKY` · `CODEX-OPEN-SECURITY`

### Web3·암호화폐
`KELPDAO` · `AICRYPTOJACK` · `UK_RUSSIA_CRYPTO_SANCTIONS` · `LITECOIN` · `KAKAO` · `WEMIX` · `COLDCARD-RNG`

### OSINT·도구 리뷰
`FLOWSINT` · `CODEX-OPEN-SECURITY` · `LAON_VaultGuard`

### 한국 사이버 안보·유출
`TVING` · `CU_BREACH` · `FASTCAMPUS_DAYONECOMPANY` · `KAKAO` · `MODOO` · `QSHING` · `GITHUB-KEY-LEAK` · `KRWEEKLY` · `HWP` · `AI-BANK-HACKING` · `CERT-BREACH` · `CHINA-HACKING` · `HANWHA` · `WEEKLY`


---

## 분석 방법론 (Methodology)

### Traffic Light Protocol (TLP)
| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| **TLP:GREEN** | 커뮤니티 내 공유·대외 공개 가능 | **기본값** |
| TLP:AMBER | 조직 내부 공유 한정 | 해당 없음 |
| TLP:RED | 개별 수령자 한정 | 해당 없음 |

### 심각도 등급 (Severity)
| 등급 | 의미 | 대응 시간 |
| --- | --- | --- |
| **CRITICAL** | 국가안보·대규모 민간 피해 직결 | 즉시 |
| **HIGH** | 산업·생태계 광범위 영향 | 24–72시간 |
| **MEDIUM** | 특정 기업·조직군 제한 영향 | 7일 이내 |
| **LOW** | 인지·관찰 수준 | 30일 이내 |

### 프레임워크 참조
* **MITRE ATT&CK** — TTP 매핑 표준
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링


---

## 파일 명명 규칙 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

Examples:
 CTI-2026-0711-SWIFTVIBE_EN.md
 CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md
```
* `LANG` — `KR` (한국어) · `EN` (English) · `JP`/`JA` (日本語) · `ZH`/`CN` (中文)
* `ext` — `md` (default) · `pdf` (distribution copy)


---

## 키워드 (Keywords)

`사이버 위협 인텔리전스` `CTI` `OSINT` `APT` `북한 해킹` `라자루스` `Lazarus` `김수키` `Kimsuky` `APT43` `스카크러프트` `ScarCruft` `APT37` `공급망 공격` `Supply Chain` `제로데이` `Zero-Day` `취약점` `CVE` `AI 보안` `LLM` `인공지능 해킹` `Web3` `블록체인` `암호화폐` `DeFi` `개인정보 유출` `데이터 유출` `한국 사이버 보안` `Korea Cybersecurity` `위협 분석` `Threat Intelligence` `보안 연구` `사고 대응` `MITRE ATT&CK` `IOC` `침해 지표` `PHP2Shell` `리눅스 커널` `Linux Kernel` `FortiBleed` `Qilin` `랜섬웨어` `노트북 팜` `아래아 한글` `HWP` `Dennis Kim` `Betalabs`

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

| | |
| --- | --- |
| **총 리포트 시리즈** | 100+ |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **주요 위협 행위자** | Lazarus · Kimsuky(APT43) · ScarCruft(APT37) · Scattered Spider · UNC6508 · SWIFTVIBE · Miasma · IronWorm · GlassWorm · ShinyHunters · GREYVIBE · Qilin · FortiBleed 캠페인 외 |
| **최근 업데이트** | 2026-10-30 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*

<!-- index:follow -->
