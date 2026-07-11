# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--07--11-informational?style=flat-square)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

🌐 **언어 / Languages:** **한국어 (이 문서)** · [English](README_EN.md) · [日本語](README_JP.md) · [中文](README_CN.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 공급망 공격, 제로데이, 북한·국가배후 APT, AI/LLM 위협, Web3·암호화폐, 한국 유출·정책 이슈를 다룹니다. 모든 리포트는 OSINT 기반이며 특정 조직의 공식 입장을 대변하지 않습니다.

LLM/에이전트용 인덱스: [`llms.txt`](llms.txt)

---

## 📇 분석가 소개 (About the Analyst)

| | |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · 전 CyworldZ CEO · 독립 위협 인텔리전스 분석가 |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 최신 리포트 (Latest — Featured)

> 🆕 **2026-07-11 발행**

### Bonzo Finance 오라클 익스플로잇 — Hedera 대출 프로토콜 905만 달러 탈취

**CTI-2026-0711-BONZO** · 🔴 HIGH · TLP:CLEAR

Hedera 기반 대출 프로토콜 Bonzo Finance가 서드파티(Supra) 오라클 가격 조작으로 약 905만 달러를 탈취당한 사건. SAUCE 토큰 가격을 12자리수 부풀려 과다 대출을 실행하고 LayerZero로 이더리움에 브릿징한 공격 메커니즘을 분석합니다.

**📄 리포트:** [🇰🇷 KR](CTI-2026-0711-BONZO_KR.md)

---

> 🆕 **2026-07-11 발행**

### SWIFTVIBE — 72시간 AWS 클라우드 침해 (에이전틱 AI 공격)

**CTI-2026-0711-SWIFTVIBE** · 🔴 HIGH · TLP:GREEN

신규 멀웨어·제로데이 없이 알려진 기법을 초인적 속도·규모로 실행한 에이전틱 AI 클라우드 침해 사례. 암호화 없는 클라우드 인질극과 SOAR/SIEM 대응 한계를 분석합니다.

**📄 리포트:** [🇰🇷 KR](CTI-2026-0711-SWIFTVIBE_KR.md) · [🇬🇧 EN](CTI-2026-0711-SWIFTVIBE_EN.md)

---

> 🆕 **2026-07-08 발행**

### 카카오스타일 지그재그 해킹으로 확정

**CTI-2026-0708-KAKAO** · 🔴 HIGH · TLP:GREEN

다크웹에서 "카카오톡 소스코드 매각"으로 유통되던 주장이 **카카오스타일 지그재그(ZigZag) 해킹**으로 확정된 사건. 표적 오인·소스코드·인프라 유출 파급력을 분석합니다.

**📄 리포트:** [🇰🇷 KR](CTI-2026-0708-KAKAO_KR.md) · [🇬🇧 EN](CTI-2026-0708-KAKAO_EN.md) · [📕 PDF](CTI-2026-0708-KAKAO_KR.pdf)

---

> 🆕 **2026-06-28 발행**

### 북한 AI 활용 해킹의 질적 전환 — Kimsuky·Lazarus·Andariel

**CTI-2026-0628-DPRK-AI** · 🔴 HIGH · TLP:GREEN

사회공학 × 공급망 × LLM 내장 악성코드가 결합된 2026년 북한 해킹의 질적 변화를 분석합니다.

**📄 리포트:** [🇰🇷 KR](CTI-2026-0628-DPRK-AI_KR.md) · [🇬🇧 EN](CTI-2026-0628-DPRK-AI_EN.md) · [🇯🇵 JP](CTI-2026-0628-DPRK-AI_JP.md)

---

> 🆕 **2026-06-11 발행**

### Microsoft 공급망 — Miasma(Spring Blight) Azure 패키지 대량 감염

**CTI-2026-0611-MIASMA_SPRINGBLIGHT** · 🔴 CRITICAL · TLP:GREEN

PyPI `durationtask`를 매개로 Azure Functions 생태계에 침투, **105초 만에 Microsoft 공식 GitHub 저장소 73개 비활성화**.

**📄 리포트:** [🇰🇷 KR](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) · [🇬🇧 EN](CTI-2026-0611-MIASMA_SPRINGBLIGHT_EN.md) · [패치 화요일 KR](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) · [RoguePlanet KR](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md)

---

## Awesome Security Series: Startup Security Guide & LLM CISO

> 🆕 **2026-06-17 발행** — 한국 진출 해외 스타트업을 위한 보안 가이드

티빙·CU·패스트캠퍼스 사고에서 드러난 것처럼, 스타트업은 설정 실수 한 번에 대규모 개인정보 유출로 이어질 수 있습니다. 특히 한국에 진출하는 해외 스타트업은 GDPR/CCPA와 전혀 다른 **한국 개인정보보호법(PIPA)** 의무를 간과하기 쉽습니다.

👉 [**Startup Security Guide 살펴보기 →**](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/tree/main/Startup_Security_Guide)

| 언어 | 가이드 | LLM CISO 프롬프트 | 대시보드 | 로드맵 |
|------|--------|------------------|----------|--------|
| 한국어 | [가이드](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_KR.md) | [프롬프트](Startup_Security_Guide/LLM_CISO_PROMPT_KR.md) | [대시보드](Startup_Security_Guide/LLM_CISO_DASHBOARD.md) | [ROADMAP](Startup_Security_Guide/ROADMAP.md) |
| English | [Guide](Startup_Security_Guide/STARTUP_SECURITY_GUIDE_EN.md) | [Prompts](Startup_Security_Guide/LLM_CISO_PROMPT_EN.md) | [Dashboard](Startup_Security_Guide/LLM_CISO_DASHBOARD_EN.md) | [ROADMAP](Startup_Security_Guide/ROADMAP_EN.md) |

> Phase 3 방향: **SKIL → MCP → 자기 교정 → Slack/Telegram·팀 공유**. 상세는 [ROADMAP.md](Startup_Security_Guide/ROADMAP.md).


---

## Awesome Security Series: Static Analysis Security Tools

오픈소스 SAST 도구 컬렉션 (Semgrep, CodeQL, SonarQube 등).

👉 [**Awesome Static Analysis Security (SAST) Tools →**](Awesome%20Static%20Analysis%20Security%20Tools.md)


---

## Awesome Security Series: LAON VaultGuard

멀티 LLM 교차검증 시크릿 탐지 도구 (티빙 AWS 키 노출 교훈).

👉 [**LAON VaultGuard →**](https://github.com/gameworkerkim/vibe-investing/tree/main/LAON_VaultGuard) · [리포트 KR](CTI-2026-0607-LAON_VaultGuard_KR.md) · [EN](CTI-2026-0607-LAON_VaultGuard_EN.md)


---

## 📚 전체 리포트 목록 (Report Index)

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명: `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md`
> ※ 심각도는 주제 기준 참고치이며, 각 리포트 본문 평가가 우선합니다.

| 발행일 | ID / 제목 | 심각도 | 언어 |
| --- | --- | --- | --- |
| 2026-07-11 | [`CTI-2026-0711-BONZO`](CTI-2026-0711-BONZO_KR.md) — Bonzo Finance 오라클 익스플로잇 (Hedera, $9.05M) | 🔴 HIGH | [KR](CTI-2026-0711-BONZO_KR.md) |
| 2026-07-11 | [`CTI-2026-0711-SWIFTVIBE`](CTI-2026-0711-SWIFTVIBE_KR.md) — 72시간 AWS 클라우드 침해 — 에이전틱 AI 공격 SWIFTVIBE | 🔴 HIGH | [KR](CTI-2026-0711-SWIFTVIBE_KR.md) · [EN](CTI-2026-0711-SWIFTVIBE_EN.md) |
| 2026-07-08 | [`CTI-2026-0708-KAKAO`](CTI-2026-0708-KAKAO_KR.md) — 카카오스타일 지그재그 해킹으로 확정 | 🔴 HIGH | [KR](CTI-2026-0708-KAKAO_KR.md) · [EN](CTI-2026-0708-KAKAO_EN.md) · [PDF](CTI-2026-0708-KAKAO_KR.pdf) |
| 2026-07-05 | [`CTI-2026-0705-WEEKLY`](CTI-2026-0705-WEEKLY_EN.md) — Weekly CTI briefing (EN) | 🟠 MEDIUM | [EN](CTI-2026-0705-WEEKLY_EN.md) |
| 2026-07-05 | [`CTI-2026-0705-KRWEEKLY`](CTI-2026-0705-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | 🟠 MEDIUM | [KR](CTI-2026-0705-KRWEEKLY_KR.md) |
| 2026-07-04 | [`CTI-2026-0704-SCATTEREDSPIDER`](CTI-2026-0704-SCATTEREDSPIDER_KR.md) — Scattered Spider 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0704-SCATTEREDSPIDER_KR.md) · [EN](CTI-2026-0704-SCATTEREDSPIDER_EN.md) |
| 2026-06-28 | [`CTI-2026-0628-GITHUB-KEY-LEAK`](CTI-2026-0628-GITHUB-KEY-LEAK_KR.md) — GitHub 키 유출 사고 분석 | 🔴 HIGH | [KR](CTI-2026-0628-GITHUB-KEY-LEAK_KR.md) · [EN](CTI-2026-0628-GITHUB-KEY-LEAK_EN.md) · [PDF](CTI-2026-0628-GITHUB-KEY-LEAK_KR.pdf) |
| 2026-06-28 | [`CTI-2026-0628-DPRK-AI`](CTI-2026-0628-DPRK-AI_KR.md) — 북한 AI 활용 해킹의 질적 전환 분석 | 🔴 HIGH | [KR](CTI-2026-0628-DPRK-AI_KR.md) · [EN](CTI-2026-0628-DPRK-AI_EN.md) · [JP](CTI-2026-0628-DPRK-AI_JP.md) |
| 2026-06-26 | [`CTI-2026-0626-KRWEEKLY`](CTI-2026-0626-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | 🟠 MEDIUM | [KR](CTI-2026-0626-KRWEEKLY_KR.md) |
| 2026-06-26 | [`CTI-2026-0626-JSDF-USB`](CTI-2026-0626-JSDF-USB_KR.md) — 자위대 USB 관련 위협 | 🔴 HIGH | [KR](CTI-2026-0626-JSDF-USB_KR.md) |
| 2026-06-22 | [`CTI-2026-0622-TAIKOBRIDGE`](CTI-2026-0622-TAIKOBRIDGE_KR.md) — TaikoBridge 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0622-TAIKOBRIDGE_KR.md) |
| 2026-06-22 | [`CTI-2026-0622-KIMSUKY-LNK-DROPBOX`](CTI-2026-0622-KIMSUKY-LNK-DROPBOX_KR.md) — 김수키 LNK·Dropbox 캠페인 | 🔴 HIGH | [KR](CTI-2026-0622-KIMSUKY-LNK-DROPBOX_KR.md) |
| 2026-06-21 | [`CTI-2026-0621-KRWEEKLY`](CTI-2026-0621-KRWEEKLY_KR.md) — 한국 사이버 위협 주간 브리핑 | 🟠 MEDIUM | [KR](CTI-2026-0621-KRWEEKLY_KR.md) |
| 2026-06-18 | [`CTI-2026-0618-PROJECT-CANOPY`](CTI-2026-0618-PROJECT-CANOPY_KR.md) — Project Canopy 칼럼 | 🟠 MEDIUM | [KR](CTI-2026-0618-PROJECT-CANOPY_KR.md) |
| 2026-06-18 | [`CTI-2026-0618-MODOO`](CTI-2026-0618-MODOO_KR.md) — 모두싸인 관련 위협·유출 분석 | 🔴 HIGH | [KR](CTI-2026-0618-MODOO_KR.md) · [EN](CTI-2026-0618-MODOO_EN.md) |
| 2026-06-18 | [`CTI-2026-0618-AISUPPLY`](CTI-2026-0618-AISUPPLY_KR.md) — AI 공급망 위협 | 🔴 HIGH | [KR](CTI-2026-0618-AISUPPLY_KR.md) · [EN](CTI-2026-0618-AISUPPLY_EN.md) |
| 2026-06-16 | [`CTI-2026-0616-UNC6508-REDCAP`](CTI-2026-0616-UNC6508-REDCAP_KR.md) — UNC6508 RedCap 캠페인 | 🔴 HIGH | [KR](CTI-2026-0616-UNC6508-REDCAP_KR.md) · [EN](CTI-2026-0616-UNC6508-REDCAP_EN.md) |
| 2026-06-16 | [`CTI-2026-0616-PRC-INFLUENCE-OPS`](CTI-2026-0616-PRC-INFLUENCE-OPS_KR.md) — 중국 영향 공작 분석 | 🔴 HIGH | [KR](CTI-2026-0616-PRC-INFLUENCE-OPS_KR.md) |
| 2026-06-16 | [`CTI-2026-0616-PHPBB-AUTH-BYPASS`](CTI-2026-0616-PHPBB-AUTH-BYPASS_KR.md) — phpBB 인증 우회 | 🔴 HIGH | [KR](CTI-2026-0616-PHPBB-AUTH-BYPASS_KR.md) |
| 2026-06-12 | [`CTI-2026-0612-QSHING`](CTI-2026-0612-QSHING_KR.md) — 큐싱(Qishing) 위협 | 🔴 HIGH | [KR](CTI-2026-0612-QSHING_KR.md) · [EN](CTI-2026-0612-QSHING_EN.md) |
| 2026-06-12 | [`CTI-2026-0612-ANDROID`](CTI-2026-0612-ANDROID_KR.md) — Android 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0612-ANDROID_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-ROGUEPLANET_MINIPLASMA`](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) — RoguePlanet / MiniPlasma 위협 | 🔴 HIGH | [KR](CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE`](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) — Microsoft 6월 패치 화요일 206개 CVE | 🔴 HIGH | [KR](CTI-2026-0611-MSFT_PATCHTUESDAY_206CVE_KR.md) |
| 2026-06-11 | [`CTI-2026-0611-MIASMA_SPRINGBLIGHT`](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) — Microsoft 공급망: Miasma(Spring Blight) Azure 패키지 감염 | 🔴 CRITICAL | [KR](CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md) · [EN](CTI-2026-0611-MIASMA_SPRINGBLIGHT_EN.md) |
| 2026-06-11 | [`CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY`](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) — 패스트캠퍼스·데이원컴퍼니 GitHub 마스터키 탈취 | 🔴 HIGH | [KR](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md) · [EN](CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_EN.md) |
| 2026-06-07 | [`CTI-2026-0607-LAON_VaultGuard`](CTI-2026-0607-LAON_VaultGuard_KR.md) — LAON VaultGuard — 멀티 LLM 시크릿 탐지 | 🟠 MEDIUM | [KR](CTI-2026-0607-LAON_VaultGuard_KR.md) · [EN](CTI-2026-0607-LAON_VaultGuard_EN.md) |
| 2026-06-07 | [`CTI-2026-0607-BREACH-WFP`](CTI-2026-0607-BREACH-WFP_KR.md) — WFP 침해 관련 분석 | 🔴 HIGH | [KR](CTI-2026-0607-BREACH-WFP_KR.md) |
| 2026-06-05 | [`CTI-2026-0605-LAZARUS-CLICKFIX`](CTI-2026-0605-LAZARUS-CLICKFIX_KR.md) — Lazarus macOS ClickFix 캠페인 | 🔴 HIGH | [KR](CTI-2026-0605-LAZARUS-CLICKFIX_KR.md) · [EN](CTI-2026-0605-LAZARUS-CLICKFIX_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-IRONWORM`](CTI-2026-0605-IRONWORM_KR.md) — IronWorm 공급망 웜 | 🔴 HIGH | [KR](CTI-2026-0605-IRONWORM_KR.md) · [EN](CTI-2026-0605-IRONWORM_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-CLAUDECODE`](CTI-2026-0605-CLAUDECODE_KR.md) — Claude Code GitHub Action 공급망 취약점 | 🔴 HIGH | [KR](CTI-2026-0605-CLAUDECODE_KR.md) · [EN](CTI-2026-0605-CLAUDECODE_EN.md) |
| 2026-06-05 | [`CTI-2026-0605-AI-ZERODAY`](CTI-2026-0605-AI-ZERODAY_KR.md) — AI 생성 제로데이 익스플로잇 | 🔴 HIGH | [KR](CTI-2026-0605-AI-ZERODAY_KR.md) · [EN](CTI-2026-0605-AI-ZERODAY_EN.md) |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE_KR.md) — IBM WebSphere 동시 공개 3종 CVE | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE_KR.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JP](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-04 | [`CTI-2026-0604-TVING`](CTI-2026-0604-TVING_KR.md) — 티빙 개인정보 대량 유출 | 🔴 CRITICAL | [KR](CTI-2026-0604-TVING_KR.md) · [EN](CTI-2026-0604-TVING_EN.md) · [JP](CTI-2026-0604-TVING_JA.md) · [ZH](CTI-2026-0604-TVING_ZH.md) · [PDF](CTI-2026-0604-TVING_KR.pdf) |
| 2026-06-04 | [`CTI-2026-0604-CU_BREACH`](CTI-2026-0604-CU_BREACH_KR.md) — CU 편의점 택배 개인정보 유출 | 🔴 CRITICAL | [KR](CTI-2026-0604-CU_BREACH_KR.md) · [EN](CTI-2026-0604-CU_BREACH_EN.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_KR.md) — Citrix NetScaler 메모리 오버리드 악용 | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-03 | [`CTI-2026-0603-ANDROID-EOP`](CTI-2026-0603-ANDROID-EOP_KR.md) — Android EoP 취약점 | 🔴 HIGH | [KR](CTI-2026-0603-ANDROID-EOP_KR.md) |
| 2026-06-02 | [`CTI-2026-0602-MIRAI-ZERODAY`](CTI-2026-0602-MIRAI-ZERODAY_KR.md) — Mirai 봇넷 제로데이 악용 | 🔴 HIGH | [KR](CTI-2026-0602-MIRAI-ZERODAY_KR.md) · [EN](CTI-2026-0602-MIRAI-ZERODAY_EN.md) |
| 2026-06-02 | [`CTI-2026-0602-MIASMA-RH`](CTI-2026-0602-MIASMA-RH_KR.md) — Miasma RH 위협 | 🔴 HIGH | [KR](CTI-2026-0602-MIASMA-RH_KR.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_KR.md) — 이란의 생성형 AI 전쟁 활용 | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [ZH](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GREYVIBE GenAI 우크라이나 표적 작전 | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) · [EN](CTI-2026-0601-GREYVIBE_EN.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_KR.md) — MARIMO 권고문 무기화 | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [ZH](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_KR.md) — JINX 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [ZH](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_KR.md) — Gogs Git 서버 취약점 | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [ZH](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_KR.md) — ChatGPhish ChatGPT 사칭 피싱 | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [ZH](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_KR.md) — KelpDAO Web3·DeFi 위협 | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JP](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_KR.md) — GlassWorm 공급망 자가전파 웜 | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JP](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_KR.md) — Gitea CVE 취약점 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JP](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_KR.md) — AI 크립토재킹 | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JP](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.md) — 영국의 러시아 암호화폐 제재 | 🟠 MEDIUM | [KR](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JP](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) · [PDF](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KR.pdf) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH_KR.md) — 김수키(APT43) PebbleDash·AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH_KR.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [ZH](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_KR.md) — 동시 발생 이중 위협 (LiteSpeed·Shai-Hulud) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [ZH](CTI-2026-0524-DUALTHREAT_CN.md) · [PDF](CTI-2026-0524-DUALTHREAT_KR.pdf) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_KR.md) — EDR 우회 위협 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) · [PDF](CTI-2026-0522-EDR3_KR.pdf) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_KR.md) — Windows BitLocker 우회 제로데이 | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_KR.md) — 2026 북한 해킹 동향 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB_KR.md) — GitHub 내부 저장소 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB_KR.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16_KR.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16_KR.md) · [EN](CTI-2026-0520-FAST16_EN.md) · [JP](CTI-2026-0520-FAST16_JA.md) · [ZH](CTI-2026-0520-FAST16_ZH.md) · [PDF](CTI-2026-0520-FAST16_KR.pdf) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE_KR.md) — Exchange Server 취약점 | 🔴 HIGH | [KR](CTI-2026-0520-EXCHANGE_KR.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS_KR.md) — EvilTokens AI 디바이스 코드 피싱 PhaaS | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS_KR.md) · [EN](CTI-2026-0520-EVILTOKENS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL_KR.md) — Drupal 코어 최고위험 제로데이 | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL_KR.md) · [EN](CTI-2026-0520-DRUPAL_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL_KR.md) — cPanel 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL_KR.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_KR.md) — 북한 LLM 해킹 / AI 사이버 공격·에이전트 방어 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](CTI-2026-0517-AICYBER_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KR.md) — ChatGPT DNS 사이드채널 | 🟠 MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KR.md) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT_LNK_RDP`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KR.md) — 러시아 RAT (LNK·RDP) | 🔴 HIGH | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KR.md) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](CTI-2026-0510-MYTHOS-AI_KR.md) — Mythos AI 취약점 | 🔴 HIGH | [KR](CTI-2026-0510-MYTHOS-AI_KR.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — Lazarus git hooks 은닉 기법 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [ZH](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_KR.md) — ScarCruft(APT37) 캠페인 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](CTI-2026-0505-VIBE_KR.md) — 바이브: 인공지능 해킹의 시대 | 🟠 MEDIUM | [KR](CTI-2026-0505-VIBE_KR.md) · [EN](CTI-2026-0505-VIBE_EN.md) · [PDF](CTI-2026-0505-VIBE_KR.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](CTI-2026-0430-COPYFAIL_KR.md) — CopyFail (CVE-2026-31431) | 🔴 HIGH | [KR](CTI-2026-0430-COPYFAIL_KR.md) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](CTI-2026-0427-LITECOIN_KR.md) — 라이트코인 취약점 | 🟠 MEDIUM | [KR](CTI-2026-0427-LITECOIN_KR.md) · [EN](CTI-2026-0427-LITECOIN_EN.md) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](CTI-2026-0422-MCP_KR.md) — MCP를 노리는 지능형·잠복형 공격 | 🔴 HIGH | [KR](CTI-2026-0422-MCP_KR.md) · [EN](CTI-2026-0422-MCP_EN.md) · [JP](CTI-2026-0422-MCP_JP.md) · [ZH](CTI-2026-0422-MCP_CN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_KR.md) — Vercel 보안 침해 (AI SaaS 공급망) | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](CTI-2026-0420-VERCEL_KR.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit·사이버 무기 공급망 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](CTI-2026-0320-CORUNA_EN.md) · [ZH](CTI-2026-0320-CORUNA_ZH.md) · [PDF](CTI-2026-0320-CORUNA_KR.pdf) |

---

## 주제별 분류 (By Category)

### 🌐 공급망 공격
`MIASMA_SPRINGBLIGHT` · `IRONWORM` · `CLAUDECODE` · `GLASSWORM` · `WEBSPHERE` · `GITEA` · `GOGS` · `DUALTHREAT` · `GITHUB` · `VERCEL` · `AISUPPLY` · `SWIFTVIBE`

### 🔓 제로데이·취약점
`MSFT_PATCHTUESDAY_206CVE` · `AI-ZERODAY` · `NETSCALER` · `MIRAI-ZERODAY` · `YELLOWKEY` · `DRUPAL` · `EXCHANGE` · `COPYFAIL` · `CORUNA` · `ANDROID-EOP`

### 🕵️ 북한·국가배후 위협
`DPRK-AI` · `KIMSUKY-PEBBLEDASH` · `KIMSUKY-LNK-DROPBOX` · `LAZARUS-GITHOOKS` · `LAZARUS-CLICKFIX` · `SCARCRUFT` · `DPRK-TRENDS` · `AICYBER` · `IRANGENAI` · `UNC6508-REDCAP` · `SCATTEREDSPIDER`

### 🤖 AI·LLM 위협
`SWIFTVIBE` · `AI-ZERODAY` · `CLAUDECODE` · `DPRK-AI` · `GREYVIBE` · `CHATGPHISH` · `AICRYPTOJACK` · `EVILTOKENS` · `AICYBER` · `VIBE` · `MCP` · `AISUPPLY`

### 💰 Web3·암호화폐
`KELPDAO` · `AICRYPTOJACK` · `UK_RUSSIA_CRYPTO_SANCTIONS` · `LITECOIN` · `KAKAO`

### 🇰🇷 한국 사이버 안보·유출
`TVING` · `CU_BREACH` · `FASTCAMPUS_DAYONECOMPANY` · `KAKAO` · `MODOO` · `QSHING` · `GITHUB-KEY-LEAK` · `KRWEEKLY`


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
| **총 리포트 시리즈** | 72+ |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **주요 위협 행위자** | Lazarus · Kimsuky(APT43) · ScarCruft(APT37) · Scattered Spider · UNC6508 · SWIFTVIBE · Miasma · IronWorm · GlassWorm · ShinyHunters · GREYVIBE 외 |
| **최근 업데이트** | 2026-07-11 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
