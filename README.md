# Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--05--20-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

**언어 (Language):** **한국어** · [English](README_EN.md) · [日本語](README_JP.md) · [中文](README_CN.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

*This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.*

---

## About the Analyst

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · 前 Cyworld Z CEO · Independent Threat Intelligence Analyst · Microsoft Azure MVP |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안, MCP 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## Latest Reports — Featured

> **2026-05-20 발행 — 단일 주간 4건 동시 경보**

5월 셋째 주, 동시다발적으로 공개·악용된 4건의 고위험 취약점을 긴급 분석했습니다. 모두 한국어·영어 병기로 발행되었습니다.

| 리포트 | 핵심 | 심각도 | 다운로드 |
| --- | --- | --- | --- |
| **Drupal 코어 최고위험 취약점** (`CTI-2026-0520-DRUPAL`) | 무인증 원격 익스플로잇, 패치=공격 개시 유형 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| **Exchange OWA 제로데이** (`CTI-2026-0520-EXCHANGE`) | CVE-2026-42897, 활성 악용, 영구 패치 부재 | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| **EvilTokens PhaaS** (`CTI-2026-0520-EVILTOKENS`) | AI 생성 디바이스 코드 피싱, MFA 무력화 | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| **cPanel 인증 우회** (`CTI-2026-0520-CPANEL`) | CVE-2026-41940, CVSS 9.8, 대량 악용 | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |

---

## Report Index — 전체 리포트 목록

| ID | 발행일 | 제목 | 심각도 | 언어 |
| --- | --- | --- | --- | --- |
| `CTI-2026-0520-DRUPAL` | 2026-05-20 | Drupal 코어 최고위험 취약점 긴급 경보 — 무인증 원격, 패치 임박 | CRITICAL | [KR/EN](CTI-2026-0520-DRUPAL.md) |
| `CTI-2026-0520-EXCHANGE` | 2026-05-20 | Microsoft Exchange OWA 제로데이 (CVE-2026-42897) | HIGH | [KR/EN](CTI-2026-0520-EXCHANGE.md) |
| `CTI-2026-0520-EVILTOKENS` | 2026-05-20 | EvilTokens — AI 생성 디바이스 코드 피싱 PhaaS | HIGH | [KR/EN](CTI-2026-0520-EVILTOKENS.md) |
| `CTI-2026-0520-CPANEL` | 2026-05-20 | cPanel & WHM 인증 우회 (CVE-2026-41940) | CRITICAL | [KR/EN](CTI-2026-0520-CPANEL.md) |
| `CTI-2026-0520-FAST16` | 2026-05-20 | Fast16 — Stuxnet 이전 정밀계산 변조 사보타주 멀웨어 | HIGH | [EN](CTI-2026-0520-FAST16%20EN.md) · [KR](CTI-2026-0520-FAST16%20KR.md) · [JP](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) · [PDF](CTI-2026-0520-FAST16%20KR.pdf) |
| `CTI-2026-0517-AICYBER` | 2026-05-17 | AI 사이버 공격과 에이전트형 방어 — 북한의 LLM 활용 해킹 | HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) |
| `CTI-2026-0514-CHATGPT-DNS` | 2026-05-14 | ChatGPT DNS 사이드채널 분석 | MEDIUM | [KR](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| `CTI-2026-0514-RUSSIAN-RAT` | 2026-05-14 | 러시아 RAT / LNK·RDP 공격 체인 분석 | MEDIUM | [KR](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| `CTI-2026-0510-LAZARUS-GITHOOKS` | 2026-05-10 | 북한 Lazarus — .git/hooks 멀웨어 캠페인 | HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| `CTI-2026-0510-MYTHOS` | 2026-05-10 | Mythos AI 취약점 분석 | MEDIUM | [MD](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| `CTI-2026-0507-SCARCRUFT` | 2026-05-07 | ScarCruft (APT37) 캠페인 분석 | HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| `CTI-2026-0505-VIBE` | 2026-05-05 | 바이브 — 인공지능 해킹의 시대 | MEDIUM | [MD](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE.md) · [PDF](%EB%B0%94%EC%9D%B4%EB%B8%8C_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%ED%95%B4%ED%82%B9%EC%9D%98_%EC%8B%9C%EB%8C%80_CTI-2026-0505-VIBE_%EA%B9%80%ED%98%B8%EA%B4%91.pdf) |
| `CTI-2026-0503-GITHUB` | 2026-05-03 | GitHub RCE 취약점 분석 (단일 git push RCE) | HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| `CTI-2026-0430-COPYFAIL` | 2026-04-30 | Copy Fail — Linux 커널 권한상승 (CVE-2026-31431) | HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| `CTI-2026-0427-LITECOIN` | 2026-04-27 | 라이트코인 취약점 분석 | MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| `CTI-2026-0422-MCP` | 2026-04-22 | MCP를 노리는 지능형·잠복형 공격 — 구조적 문제인가? | HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PRESS KR](CTI-2026-0422-MCP-PRESS_KR.md) · [PRESS EN](CTI-2026-0422-MCP-PRESS_EN.md) · [PDF](CTI-2026-0422-MCP_KR.pdf) |
| `CTI-2026-0420-VERCEL` | 2026-04-20 | Vercel 보안 침해 — AI SaaS 공급망 공격 및 ShinyHunters | HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| `CTI-2026-0320-CORUNA` | 2026-03-20 | 사이버 무기 공급망의 붕괴 — Coruna iOS Exploit Kit | CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20%E4%B8%AD%E6%96%87%E7%89%88.md) |

> 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.

---

## By Category — 주제별 분류

### 공급망 공격 (Supply Chain Attacks)

공격자가 최종 표적이 아닌 '신뢰하는 제3자 벤더'를 먼저 침해하여 간접 접근하는 공격 유형. 2025–2026년에 가장 빠르게 증가한 카테고리.

* `CTI-2026-0520-CPANEL` — cPanel/WHM 인증 우회를 통한 호스팅 인프라 대량 장악
* `CTI-2026-0503-GITHUB` — 단일 git push로 GitHub Enterprise RCE
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth 공급망 침해)
* `CTI-2026-0510-LAZARUS-GITHOOKS` — .git/hooks를 악용한 개발자 환경 침투

### AI·LLM·MCP 보안 (AI / LLM / MCP Security)

생성형 AI와 에이전트 인프라를 표적·도구로 삼는 신종 위협. 본 아카이브의 핵심 연구 트랙.

* `CTI-2026-0520-EVILTOKENS` — AI 생성("바이브 코딩") 디바이스 코드 피싱 PhaaS
* `CTI-2026-0517-AICYBER` — 북한의 LLM 활용 해킹과 에이전트형 방어
* `CTI-2026-0514-CHATGPT-DNS` — ChatGPT DNS 사이드채널
* `CTI-2026-0510-MYTHOS` — Mythos AI 취약점
* `CTI-2026-0505-VIBE` — 바이브, 인공지능 해킹의 시대
* `CTI-2026-0422-MCP` — MCP를 노리는 지능형·잠복형 공격

### 모바일·제로데이 위협 (Mobile & Zero-Day)

iOS·Android 등 모바일 플랫폼 대상 국가급 감시 도구 및 상업적 익스플로잇 킷 분석.

* `CTI-2026-0520-DRUPAL` — Drupal 코어 무인증 원격 (패치=공격 개시)
* `CTI-2026-0520-EXCHANGE` — Exchange OWA 제로데이 (CVE-2026-42897)
* `CTI-2026-0430-COPYFAIL` — Linux 커널 권한상승 (CVE-2026-31431)
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit (CVE-2024-23222)

### 위협 행위자 프로파일 (Threat Actor Profiles)

특정 APT 그룹·사이버 범죄 단체의 TTP·캠페인·귀속 정보 정리.

* **Lazarus Group** (북한) — `CTI-2026-0510-LAZARUS-GITHOOKS`
* **ScarCruft / APT37** (북한) — `CTI-2026-0507-SCARCRUFT`
* **북한 LLM 활용 위협** — `CTI-2026-0517-AICYBER`
* **ShinyHunters** (UNC6040/UNC6240/UNC6661) — `CTI-2026-0420-VERCEL`
* **UNC6353·Operation Zero** — `CTI-2026-0320-CORUNA`

### 국가배후 사보타주 (Nation-State Sabotage)

물리 세계에 영향을 미치는 파괴·교란형 사이버 무기.

* `CTI-2026-0520-FAST16` — Stuxnet 5년 전 정밀계산 소프트웨어 변조 멀웨어

### Web3·암호화폐 생태계 (Web3 & Crypto)

DeFi·CEX·스테이블코인 관련 침해 및 국내(DAXA·KoFIU·특금법) 컴플라이언스 관점 분석.

* `CTI-2026-0427-LITECOIN` — 라이트코인 취약점
* `CTI-2026-0420-VERCEL` §8 — Vercel 침해가 Web3 프런트엔드 인프라에 미치는 영향

---

## Methodology — 분석 방법론

### Traffic Light Protocol (TLP) 분류

| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| **TLP:GREEN** | 커뮤니티 내 공유 가능, 대외 공개 가능 | **공개 리포트의 기본값** |
| **TLP:AMBER** | 조직 내부 공유 한정 | 일부 사전경보 리포트 |
| **TLP:RED** | 개별 수령자 한정 | 일부 활성 악용 리포트 |

### 심각도 등급 (Severity)

| 등급 | 의미 | 대응 시간 |
| --- | --- | --- |
| **CRITICAL** | 국가안보·대규모 민간 피해 직결 위협 | 즉시 |
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

## Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0520-EXCHANGE.md     → 2026년 5월 20일 발행, Exchange 사건 (한/영 병기)
  CTI-2026-0507-SCARCRUFT_KR.md → ScarCruft 분석, 한국어
  CTI-2026-0507-SCARCRUFT_JP.md → 동일 사건의 일본어판
```

* `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자)
* `LANG` — `KR` (한국어) / `EN` (영어) / `JP` (일본어) / `CN`·`ZH` (중국어)
* `ext` — `md` (기본) / `pdf` (정식 배포본)

---

## Contact & Contribution

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 리포트 피드백·정정·제보 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 업데이트·레퍼런스 추가 제안 |
| **제보 보호** | 민감한 제보는 Signal·ProtonMail 등 보안 채널로 문의해 주십시오. |

---

## Disclaimer — 면책 조항

1. 본 저장소의 모든 리포트는 **공개된 OSINT 자료와 언론 보도**를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 리포트 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 반드시 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직접적·간접적 사용으로 발생하는 어떠한 손해에 대해서도 책임지지 않습니다.

---

## Repository Stats

|  |  |
| --- | --- |
| **총 리포트 수** | 18+ (시리즈 기준) |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **주요 위협 행위자** | Lazarus · ScarCruft/APT37 · ShinyHunters · UNC6353 · Operation Zero · 외 다수 |
| **핵심 연구 트랙** | AI/LLM/MCP 보안 · 공급망 공격 · 북한·국가배후 위협 · 제로데이 생태계 |
| **최근 업데이트** | 2026-05-20 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산은 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
