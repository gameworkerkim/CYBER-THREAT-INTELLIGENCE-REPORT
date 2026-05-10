# 🛡️ Cyber Threat Intelligence Report

> **🌐 Languages | 언어 선택:**
> **🇰🇷 한국어** · [🇬🇧 English](./README_EN.md) · [🇨🇳 中文(簡體)](./README_CN.md) · [🇯🇵 日本語](./README_JP.md)

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20CN%20%7C%20JP-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--10-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/commits/main)
[![Reports](https://img.shields.io/badge/Reports-8-orange?style=flat-square)](#-report-index--전체-리포트-목록)

---

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다. **Web3·블록체인 보안, AI/MCP 보안, 공급망 공격, 북한·국가배후 위협, 한국 사이버 안보 정책**을 핵심 관심 영역으로 다룹니다.

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · Independent Threat Intelligence Analyst · Former CEO, Cyworld Z · Long-tenured Microsoft Azure MVP |
| **전문 분야** | Web3·블록체인 보안 · AI/MCP 보안 · 공급망 공격 · 제로데이 생태계 · 북한·국가배후 위협 · 한국 사이버 안보 정책 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |
| **Publication** | [Web3Paper](https://web3paper.net/ko) — 한국어/영문 블록체인 미디어 |

---

## Latest Report — Featured

> 🆕 **2026-05-10 발행 · 4개 언어 동시 공개**

### Lazarus Group의 새로운 은닉 기법: `.git/hooks/`를 2단 로더로 사용한 Contagious Interview·TaskJacker 캠페인

북한 Lazarus Group(MITRE ATT&CK G1052 — Contagious Interview / Famous Chollima)이 가짜 채용 캠페인의 2단 악성코드 로더를 **`.git/hooks/`** 디렉터리에 은닉하는 새로운 기법을 도입했다. 이 디렉터리는 Git이 자체적으로 추적하지 않는 사각지대로, **코드 리뷰·정적 분석·PR diff 어디에도 노출되지 않는다.** 표적 개발자가 단지 `git pull` 한 번을 실행하는 것만으로 자격증명·암호화폐 지갑·SSH 키가 탈취된다.

**핵심 분석:** 북한은 이제 AI LLM을 적극 도입해 탐지 회피용 실시간 언어·플랫폼 포팅을 수행하고 있다. npm 패키지(2022~) → 가짜 화상회의 도구(2024) → 대규모 npm 캠페인 338개(2025) → VS Code Tasks(2026 Q1)에 이은 **5번째 진화**다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0510-LAZARUS-GITHOOKS` |
| **심각도** | 🔴 HIGH — 한국 개발자·거래소·Web3 직접 표적 |
| **분류** | `TLP:GREEN` |
| **위협 행위자** | Lazarus Group / Famous Chollima / Sapphire Sleet (북한 정찰총국) |
| **누적 피해** | 2017년 이후 67.5억 달러+ (Chainalysis), 2025년 단일 20.2억 달러 |
| **참고 자료** | OpenSourceMalware (1차) + Microsoft·Cisco Talos·Abstract Security 교차 검증 |

**📄 리포트 다운로드 (4개 언어)**

| 언어 | Markdown | PDF |
| --- | --- | --- |
| 🇰🇷 한국어 | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | [`CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) (정식본) |
| 🇬🇧 English | [`CTI-2026-0510-LAZARUS-GITHOOKS_EN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) | — |
| 🇨🇳 中文 (簡體) | [`CTI-2026-0510-LAZARUS-GITHOOKS_CN.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) | — |
| 🇯🇵 日本語 | [`CTI-2026-0510-LAZARUS-GITHOOKS_JP.md`](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) | — |

**보도자료**

* 🇰🇷 [한국어 보도자료 (1페이지 요약 + 라자루스 누적 피해 + 한국 여파 + FAQ)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx)

---

## 🗞️ Recent Highlights

### 2026-05-10 · Mythos × CVE-2026-4747 — "AI는 새 취약점을 발견한 것이 아니라 오래된 취약점을 싸게 만들었다"
Anthropic이 "AI 자율 발견한 첫 원격 커널 익스플로잇"으로 발표한 FreeBSD NFS RCE는 사실상 19년 전 공개된 MIT Kerberos `librpcsecgss` 결함의 동형 결함이라는 Rival Security의 분석 검증.
[KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md)

### 2026-05-07 · ScarCruft, 연변 게이밍 플랫폼을 통째로 점령한 공급망 공격
APT37(북한)의 sqgame 침해 사례로 본 **탈북민·인권 활동가 표적 첩보 작전**과 도구 계보 추적. 코드명 `zhuagou(抓狗)` 어휘론적 분석.
[KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf)

### 2026-04-30 · Copy Fail (CVE-2026-31431) — 732바이트로 모든 주요 리눅스에 루트
**Theori 이태양 + Xint Code AI 보조 발굴**. 9년 묵은 Linux 커널 권한상승 + 컨테이너 탈출 프리미티브 분석.
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD)

### 2026-04-27 · Litecoin MWEB 제로데이 사건
**13블록 reorg, silent patch, Fork 체인 구조 리스크** 정량 분석. 라이트코인 재단 CVD 위반 의혹과 거래소·ETF 거버넌스 함의.
[KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf)

---

## Report Index — 전체 리포트 목록

| ID | 발행일 | 제목 | 심각도 | 언어 | 다운로드 |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | 2026-05-10 | Lazarus Group의 `.git/hooks/` 은닉 기법 — Contagious Interview·TaskJacker 캠페인 | 🔴 HIGH | KR · EN · CN · JP | [KR](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](./CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [CN](./CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [JP](./CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [PDF](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) · [Press KR](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) | 2026-05-10 | AI는 새 취약점을 발견한 것이 아니라, 오래된 취약점을 싸게 만들었다 — Mythos × CVE-2026-4747 × CVE-2007-3999 | 🔴 HIGH | KR | [KR](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) |
| [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_KR.md) | 2026-05-07 | ScarCruft, 연변 게이밍 플랫폼을 통째로 점령한 공급망 공격 — APT37 sqgame 침해 및 탈북민 표적 첩보 작전 | 🔴 HIGH | KR · EN · JP | [KR](./CTI-2026-0507-SCARCRUFT_KR.md) · [EN](./CTI-2026-0507-SCARCRUFT_EN.md) · [JP](./CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](./CTI-2026-0507-SCARCRUFT_KR.pdf) |
| [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | Copy Fail (CVE-2026-31431) — 732바이트로 모든 주요 리눅스에 루트, 9년 묵은 커널 권한상승 + 컨테이너 탈출 | 🔴 CRITICAL | KR | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) |
| [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) | 2026-04-27 | 라이트코인 MWEB 제로데이 사건 — 13블록 reorg, silent patch, Fork 체인 구조 리스크 정량 분석 | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20en.MD) · [PDF](./CTI-2026-0427-LITECOIN_KR.pdf) |
| [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) | 2026-04-22 | MCP를 노리는 지능형 공격, 잠복형 공격 — 구조적 문제인가 | 🔴 HIGH | KR · EN · CN · JP | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20en.MD) · [CN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20cn.MD) · [JP](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20jp.MD) · [PDF](./CTI-2026-0422-MCP_KR.pdf) · [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) · [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) | 2026-04-20 | Vercel 보안 침해 사건 — AI SaaS 공급망 공격 및 ShinyHunters 위협 평가 | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Vercel_%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%89%E1%85%A1%E1%84%80%E1%85%A5%E1%86%AB_%E1%84%87%E1%85%AE%E1%86%AB%E1%84%89%E1%85%A5%E1%86%A8%E1%84%85%E1%85%B5%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 사이버 무기 공급망의 붕괴와 국가 안보 위협 — Coruna iOS Exploit Kit 사례 분석 | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 [Naming Convention](#-naming-convention--파일-명명-규칙) 섹션 참고.

---

## By Category — 주제별 분류

### 🤖 AI 보안·MCP·LLM (AI Security, MCP, LLM)
AI 에이전트·MCP(Model Context Protocol)·LLM 기반 시스템의 보안 리스크. 잠복형(sleeper) 공격 모델, 모델 공급망 오염, AI 자율 취약점 발견의 경제학.

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — Claude Mythos의 "조합적 창의성" 가설 검증 및 취약점 경제학 붕괴
* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — 북한의 AI LLM 활용 실시간 언어·플랫폼 포팅 패턴 분석
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) — MCP 구조적 RCE, Sleeper MCP, Web3 지갑 공격면 및 편향 주입 공격

### 공급망 공격 (Supply Chain Attacks)
공격자가 최종 표적이 아닌 '신뢰하는 제3자 벤더'를 먼저 침해하는 공격 유형. SolarWinds, Salesloft-Drift 이후 2025–2026년에 가장 빠르게 증가한 카테고리.

* [`CTI-2026-0510-LAZARUS-GITHOOKS`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — Lazarus × 가짜 채용 × `.git/hooks/` 은닉 (개발자 워크스테이션 침투)
* [`CTI-2026-0507-SCARCRUFT`](./CTI-2026-0507-SCARCRUFT_KR.md) — APT37 × sqgame 게이밍 플랫폼 침해 (탈북민 표적)
* [`CTI-2026-0422-MCP`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) — MCP 공급망 × Axios NPM 침해(UNC1069) × 마켓플레이스 포이즈닝
* [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth 공급망 침해)

### 커널·인프라 취약점 (Kernel & Infrastructure)
리눅스 커널·하이퍼바이저·컨테이너 런타임 등 시스템 신뢰 기반(Trusted Computing Base)을 직접 공격하는 결함 분석.

* [`CTI-2026-0510-MYTHOS-AI-VULN`](./CTI-2026-0510-MYTHOS-AI-VULN_KR.md) — FreeBSD NFS RCE (CVE-2026-4747) 및 MIT Kerberos 동형 결함 (CVE-2007-3999)
* [`CTI-2026-0430-COPYFAIL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%20205%200430%20CopyFail%20kr.MD) — Copy Fail (CVE-2026-31431) · 9년 묵은 Linux 커널 권한상승 + 컨테이너 탈출

### 모바일·제로데이 위협 (Mobile & Zero-Day)
iOS·Android 등 모바일 플랫폼을 대상으로 하는 국가급 감시 도구 및 상업적 익스플로잇 킷 분석.

* [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) 및 사이버 무기 공급망

### Web3·가상화폐 생태계 (Web3 & Crypto)
DeFi·CEX·스테이블코인·NFT 마켓플레이스 관련 침해 사건 및 국내(DAXA·KoFIU·특금법) 컴플라이언스 관점 분석.

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — DAXA 5대 거래소·Web3 발행사 deploy 키 보호 권고
* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200427%20litecoin%20kr.MD) — Litecoin MWEB 제로데이, 13블록 reorg, 거래소·ETF 거버넌스 함의
* [`CTI-2026-0422-MCP §4`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) — MCP-지갑 통합의 단일 머신 구조 리스크와 외부 에스크로 설계 원칙
* [`CTI-2026-0420-VERCEL §8`](./CTI-2026-0420-VERCEL_KR.md) — Vercel 침해가 Web3 프런트엔드 인프라에 미치는 영향
* [`CTI-2026-0320-CORUNA §4`](./CTI-2026-0320-CORUNA_KR.md) — 제로데이 거래 생태계와 암호화폐 기반 결제 구조

### 위협 행위자 프로파일 (Threat Actor Profiles)
특정 APT 그룹·사이버 범죄 단체의 TTP·캠페인·귀속 정보 정리.

* **Lazarus Group / Famous Chollima / G1052** (북한, 누적 67.5억 달러+ 가상자산 도난) — [CTI-2026-0510-LAZARUS-GITHOOKS](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md)
* **APT37 / ScarCruft / RedAnt** (북한, 탈북민·인권 활동가 표적) — [CTI-2026-0507](./CTI-2026-0507-SCARCRUFT_KR.md)
* **UNC1069 / Sapphire Sleet** (북한 연계, 공급망 오염 실전) — [CTI-2026-0422 §3.3](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD)
* **ShinyHunters** (UNC6040/UNC6240/UNC6661/UNC6671) — [CTI-2026-0420 §5](./CTI-2026-0420-VERCEL_KR.md)
* **UNC6353·UNC6691·Operation Zero** — [CTI-2026-0320 §3](./CTI-2026-0320-CORUNA_KR.md)

### 한국 사이버 안보 정책 (Korea Cybersecurity Policy)
국내 정부·공공기관·방산업체 대상 위협 분석과 제도적 대응 권고.

* [`CTI-2026-0510-LAZARUS-GITHOOKS §5, §8`](./CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — DAXA·KISA·NIS·KoFIU 공동 경보 및 LinkedIn Korea takedown 채널 권고
* [`CTI-2026-0507-SCARCRUFT §7`](./CTI-2026-0507-SCARCRUFT_KR.md) — 탈북민·인권 활동가 보호 체계 및 연계 게이밍 플랫폼 모니터링 권고
* [`CTI-2026-0422-MCP §3.3`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD) — 북한 MCP 공급망 오염 가능성과 '국가 안보 사안화' 제언
* [`CTI-2026-0320-CORUNA §6–§8`](./CTI-2026-0320-CORUNA_KR.md) — 한국 정부 사이버 안보 구조의 취약점과 '사이버 안보 뉴딜' 제언

---

## Press Releases — 보도자료 아카이브

기자·편집자·연구자가 리포트 내용을 즉시 활용할 수 있도록, 핵심 통계·인용구·FAQ·연락처를 정리한 요약본을 보도자료 형식으로 별도 제공합니다. 모든 보도자료는 `TLP:GREEN` 하에 자유 인용 가능합니다(출처 표기 필수).

| 리포트 | 한국어 | English |
| --- | --- | --- |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | [Press KR (docx)](./CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx) | — |
| `CTI-2026-0422-MCP` | [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) | [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |

---

## Distribution Channels — 배포 채널

리포트는 GitHub 외에 다음 채널에서도 확인하실 수 있습니다.

| 채널 | 용도 | 링크 |
| --- | --- | --- |
| **GitHub (이 저장소)** | 1차 발행, 풀버전 자료 | [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| **Web3Paper** | 한국어/영문 분석 칼럼 | [web3paper.net/ko](https://web3paper.net/ko) |
| **LinkedIn** | 영문 칼럼 요약 + 산업·기업 시사점 | *(프로필 링크 추가 예정)* |
| **Facebook** | 한국어 시사 코멘트 + 디스커션 | *(프로필 링크 추가 예정)* |

> 📩 **인용·재배포 정책**: 모든 리포트는 `TLP:GREEN` 하에 자유 인용 가능합니다. **출처 표기 필수** — `Dennis Kim, 김호광, gameworker@gmail.com / https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT`.

---

## Methodology — 분석 방법론

본 아카이브의 모든 리포트는 다음 표준을 따릅니다.

### Traffic Light Protocol (TLP) 분류

| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 커뮤니티 내 공유 가능, 대외 공개 가능 | **이 저장소의 기본값** |
| 🟡 TLP:AMBER | 조직 내부 공유 한정 | 해당 없음 |
| 🔴 TLP:RED | 개별 수령자 한정 | 해당 없음 |

### 심각도 등급 (Severity)

| 등급 | 의미 | 대응 시간 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 국가안보·대규모 민간 피해 직결 위협 | 즉시 |
| 🔴 **HIGH** | 산업·생태계 광범위 영향 | 24–72시간 |
| 🟠 **MEDIUM** | 특정 기업·조직군 제한 영향 | 7일 이내 |
| 🟡 **LOW** | 인지·관찰 수준 | 30일 이내 |

### 신뢰도 평가 (Confidence)

각 Key Judgment는 **High / Medium-High / Medium / Low** 단계로 신뢰도를 명시하며, 1차 자료와 2차 언론·공개 CTI 자료를 교차 검증합니다. 어휘론적·정황적 추론은 별도로 표기됩니다.

### 프레임워크 참조

* **MITRE ATT&CK** (Enterprise + Mobile) — TTP 매핑의 표준
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링
* **Traffic Light Protocol 2.0** (FIRST.org) — 정보 공유 분류 표준

---

## Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>

예시 (메인 리포트):
  CTI-2026-0510-LAZARUS-GITHOOKS_KR.md  → 2026년 5월 10일 발행, 한국어 Markdown
  CTI-2026-0510-LAZARUS-GITHOOKS_EN.md  → 동일 사건의 영문판
  CTI-2026-0422-MCP_KR.pdf              → MCP 사건의 한국어 PDF 정식본

예시 (파생 문서 — SUBTYPE 사용):
  CTI-2026-0510-LAZARUS-GITHOOKS-PRESS_KR.docx → 한국어 보도자료
  CTI-2026-0422-MCP-PRESS_EN.md                → 영문 보도자료
```

* `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자, 하이픈으로 다중 단어 연결).
* `SUBTYPE` — 선택 항목. 메인 리포트에서 파생된 문서(`PRESS`, `BRIEF`, `SLIDES` 등) 구분.
* `LANG` — `KR` (한국어) / `EN` (영어) / `JP` (일본어) / `CN` (중국어, 간체).
* `ext` — `md` (기본) / `pdf` (정식 배포본) / `docx` (편집용).

> **레거시 파일명 안내**: 일부 초기 리포트는 GitHub 업로드 과정에서 공백·소문자 인코딩이 적용되어 있습니다 (예: `Cti%202026%200422%20mcp%20kr.MD`). 신규 리포트부터는 위 표준을 적용합니다. 점진적으로 정규화 예정.

---

## Contact & Contribution

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 리포트 피드백·정정·제보·취재 요청 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 업데이트·레퍼런스 추가 제안 |
| **제보 보호** | 민감한 제보(특히 탈북민·인권 활동가 보안 사안)는 Signal·ProtonMail 등 보안 채널로 문의해 주십시오. |

본 저장소는 개인 연구 프로젝트로, 기여 PR은 환영하나 리포트 본문 수정은 신중히 검토됩니다.

---

## Disclaimer — 면책 조항

1. 본 저장소의 모든 리포트는 **공개된 OSINT 자료와 언론 보도**를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 리포트 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 반드시 최신 상태를 재확인해야 합니다.
4. 일부 분석(특히 도구 계보·어휘론적 추론)은 정황적 단서에 기반하며, 단정적 귀속이 아님이 명시됩니다.
5. 저자는 본 자료의 직접적·간접적 사용으로 발생하는 어떠한 손해에 대해서도 책임지지 않습니다.

---

## Repository Stats

|  |  |
| --- | --- |
| **총 리포트 수** | **8** |
| **커버 언어** | 한국어, English, 中文(簡體), 日本語 |
| **관측 위협 행위자** | Lazarus Group / Famous Chollima · APT37 / ScarCruft · UNC1069 / Sapphire Sleet · ShinyHunters · UNC6353 · UNC6691 · Operation Zero · TeamPCP · 외 다수 |
| **커버 CVE** | 15+ (CVE-2026-31431, CVE-2026-4747, CVE-2007-3999, CVE-2024-23222, MCP 계열 6건 등) |
| **다국어 라인업** | LAZARUS-GITHOOKS (4개 언어) · MCP (4개 언어) · SCARCRUFT (3개 언어) · VERCEL · LITECOIN (각 2개 언어) |
| **보도자료 수** | 3 (KR×2 · EN×1) |
| **최근 업데이트** | 2026-05-10 |

---

> **Languages | 언어 선택:**
> **한국어** · [🇬🇧 English](./README_EN.md) · [🇨🇳 中文(簡體)](./README_CN.md) · [🇯🇵 日本語](./README_JP.md)

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/) · [web3paper.net](https://web3paper.net/ko)

> *"Lazarus는 한 통로를 막을 때마다 6개월 안에 더 깊은 곳으로 옮겨간다." — CTI-2026-0510-LAZARUS-GITHOOKS*
> *"AI는 새로운 취약점을 만든 것이 아니라, 오래된 취약점을 찾는 비용을 무너뜨렸다." — CTI-2026-0510-MYTHOS*
> *"732 bytes can topple a decade of trust." — CTI-2026-0430*
> *"MCP를 '쓸 것인가 말 것인가'가 아니라 '무엇과 함께 설치할 것인가'가 문제다." — CTI-2026-0422*
> *"오늘의 국가 전략 자산은 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
