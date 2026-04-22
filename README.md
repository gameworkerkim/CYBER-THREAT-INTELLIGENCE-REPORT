# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20CN%20%7C%20JP-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--04--22-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

*This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.*

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | Cyworld CEO, CEO of Betalabs Inc. · Independent Threat Intelligence Analyst |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/MCP 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Report — Featured

> 🆕 **2026-04-22 발행**

### MCP를 노리는 지능형 공격, 잠복형 공격 — 구조적 문제인가

**설계에 내재된 RCE, 잠복형 백도어, 그리고 Web3 지갑으로 번지는 공급망 위협**
*Anthropic MCP 구조적 결함 · Sleeper MCP 시나리오 · 북한 UNC1069 공급망 공격과의 연결선 · Web3 지갑·인지 편향 공격면*

Anthropic의 MCP(Model Context Protocol)에서 드러난 **설계 수준의 RCE 결함**을 단일 취약점이 아닌 **공급망·국가안보 차원의 구조 문제**로 재정의한 리포트. OX Security의 2026-04 공개와 다수 CVE(`CVE-2025-49596`, `CVE-2025-54136`, `CVE-2025-54994`, `CVE-2026-22252`, `CVE-2026-22688`, `CVE-2026-30615`)를 정리하고, Anthropic의 *Sleeper Agents* 논문과 Microsoft의 *Trigger in the Haystack* 연구를 결합해 **Sleeper MCP 위협 모델**을 제시한다. 특히 2026-03-31 **Axios NPM 패키지 침해(UNC1069 / Sapphire Sleet)** 를 MCP 공급망 오염 시나리오의 선행 사례로 분석하고, Web3 지갑 환경에서의 단일 머신 리스크와 편향 주입을 통한 의사결정 드리프트까지 다룬다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0422-MCP` |
| **심각도** | 🔴 HIGH — 공급망·국가안보 복합 위협 |
| **분류** | `TLP:GREEN` |
| **위협 행위자** | UNC1069 / Sapphire Sleet (북한 연계, 공급망 오염 실전 사례로 인용) |
| **CVE 커버** | 6건 (MCP Inspector, Cursor, LibreChat, WeKnora, Windsurf 외) |
| **참고 자료** | 24개 외부 레퍼런스 교차 검증 |

**📄 리포트 다운로드 (4개 언어)**

| 언어 | Markdown | PDF |
|---|---|---|
| 🇰🇷 한국어 | [`CTI-2026-0422-MCP_KR.md`](./CTI-2026-0422-MCP_KR.md) | [`CTI-2026-0422-MCP_KR.pdf`](./CTI-2026-0422-MCP_KR.pdf) (정식본) |
| 🇬🇧 English | [`CTI-2026-0422-MCP_EN.md`](./CTI-2026-0422-MCP_EN.md) | — |
| 🇨🇳 中文 (簡體) | [`CTI-2026-0422-MCP_CN.md`](./CTI-2026-0422-MCP_CN.md) | — |
| 🇯🇵 日本語 | [`CTI-2026-0422-MCP_JP.md`](./CTI-2026-0422-MCP_JP.md) | — |

**📰 보도자료**

* 🇰🇷 [한국어 Press Release](./CTI-2026-0422-MCP-PRESS_KR.md)
* 🇬🇧 [English Press Release](./CTI-2026-0422-MCP-PRESS_EN.md)

---

## 📚 Report Index — 전체 리포트 목록

| ID | 발행일 | 제목 | 심각도 | 언어 | 다운로드 |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0422-MCP`](./CTI-2026-0422-MCP_KR.md) | 2026-04-22 | MCP를 노리는 지능형 공격, 잠복형 공격 — 구조적 문제인가 | 🔴 HIGH | KR · EN · CN · JP | [KR](./CTI-2026-0422-MCP_KR.md) · [EN](./CTI-2026-0422-MCP_EN.md) · [CN](./CTI-2026-0422-MCP_CN.md) · [JP](./CTI-2026-0422-MCP_JP.md) · [PDF](./CTI-2026-0422-MCP_KR.pdf) · [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) · [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) | 2026-04-20 | Vercel 보안 침해 사건 — AI SaaS 공급망 공격 및 ShinyHunters 위협 평가 | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](./Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 사이버 무기 공급망의 붕괴와 국가 안보 위협 — Coruna iOS Exploit Kit 사례 분석 | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>` 입니다 ([Naming Convention](#-naming-convention--파일-명명-규칙) 섹션 참고).

---

## 🗂️ By Category — 주제별 분류

### 🤖 AI 보안·MCP (AI Security & MCP)

AI 에이전트·MCP(Model Context Protocol)·LLM 기반 시스템의 보안 리스크, 잠복형(sleeper) 공격 모델, 모델 공급망 오염, 인지 편향 공격면 분석.

* [`CTI-2026-0422-MCP`](./CTI-2026-0422-MCP_KR.md) — MCP 구조적 RCE, Sleeper MCP, Web3 지갑 공격면 및 편향 주입 공격

### 🌐 공급망 공격 (Supply Chain Attacks)

공격자가 최종 표적이 아닌 '신뢰하는 제3자 벤더'를 먼저 침해하여 간접 접근하는 공격 유형. SolarWinds, Salesloft-Drift 이후 2025–2026년에 가장 빠르게 증가한 카테고리.

* [`CTI-2026-0422-MCP`](./CTI-2026-0422-MCP_KR.md) — MCP 공급망 × Axios NPM 침해(UNC1069) × 마켓플레이스 포이즈닝
* [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth 공급망 침해)

### 📱 모바일·제로데이 위협 (Mobile & Zero-Day)

iOS·Android 등 모바일 플랫폼을 대상으로 하는 국가급 감시 도구 및 상업적 익스플로잇 킷 분석.

* [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) 및 사이버 무기 공급망

### 🕵️ 위협 행위자 프로파일 (Threat Actor Profiles)

특정 APT 그룹·사이버 범죄 단체의 TTP·캠페인·귀속 정보 정리.

* **UNC1069 / Sapphire Sleet** (북한 연계·금융 동기) — [CTI-2026-0422 §3.3 참고](./CTI-2026-0422-MCP_KR.md#33-북한의-공급망-오염과-sleeper-mcp-시나리오)
* **ShinyHunters** (UNC6040/UNC6240/UNC6661/UNC6671) — [CTI-2026-0420 §5 참고](./CTI-2026-0420-VERCEL_KR.md#5-%EC%9C%84%ED%98%91-%ED%96%89%EC%9C%84%EC%9E%90-%EB%B6%84%EC%84%9D-shinyhunters)
* **UNC6353·UNC6691·Operation Zero** — [CTI-2026-0320 §3 참고](./CTI-2026-0320-CORUNA_KR.md#3-%EC%82%AC%EC%9D%B4%EB%B2%84-%EB%AC%B4%EA%B8%B0-%EA%B3%B5%EA%B8%89%EB%A7%9D-%EA%B0%9C%EB%B0%9C%EC%97%90%EC%84%9C-%EB%B2%94%EC%A3%84%ED%99%94%EA%B9%8C%EC%A7%80)

### 💰 Web3·암호화폐 생태계 (Web3 & Crypto)

DeFi·CEX·스테이블코인·NFT 마켓플레이스 관련 침해 사건 및 국내(DAXA·KoFIU·특금법) 컴플라이언스 관점 분석.

* [`CTI-2026-0422-MCP` §4](./CTI-2026-0422-MCP_KR.md#4-web3-업계의-특수한-위험---지갑과-단일-머신-구조) — MCP-지갑 통합의 단일 머신 구조 리스크와 외부 에스크로 설계 원칙
* [`CTI-2026-0420-VERCEL` §8](./CTI-2026-0420-VERCEL_KR.md#8-web3%EA%B0%80%EC%83%81%ED%99%94%ED%8F%90-%EC%82%B0%EC%97%85%EC%97%90-%EB%AF%B8%EC%B9%98%EB%8A%94-%EC%98%81%ED%96%A5) — Vercel 침해가 Web3 프런트엔드 인프라에 미치는 영향
* [`CTI-2026-0320-CORUNA` §4](./CTI-2026-0320-CORUNA_KR.md#4-%EC%A0%9C%EB%A1%9C%EB%8D%B0%EC%9D%B4-%EC%B7%A8%EC%95%BD%EC%A0%90-%EA%B1%B0%EB%9E%98-%EC%83%9D%ED%83%9C%EA%B3%84--%EA%B5%AC%EC%A1%B0-%ED%94%8C%EB%9E%AB%ED%8F%BC-%EA%B1%B0%EB%9E%98-%ED%9D%94%EC%A0%81) — 제로데이 거래 생태계와 암호화폐 기반 결제 구조

### 🇰🇷 한국 사이버 안보 정책 (Korea Cybersecurity Policy)

국내 정부·공공기관·방산업체 대상 위협 분석과 제도적 대응 권고.

* [`CTI-2026-0422-MCP` §3.3](./CTI-2026-0422-MCP_KR.md#33-북한의-공급망-오염과-sleeper-mcp-시나리오) — 북한의 MCP 공급망 오염 가능성과 '국가 안보 사안화' 제언
* [`CTI-2026-0320-CORUNA` §6–§8](./CTI-2026-0320-CORUNA_KR.md#6-%ED%95%9C%EA%B5%AD-%EC%A0%95%EB%B6%80-%EC%82%AC%EC%9D%B4%EB%B2%84-%EC%95%88%EB%B3%B4-%ED%98%84%ED%99%A9%EA%B3%BC-%EC%9C%84%ED%98%91-%EB%B6%84%EC%84%9D) — 한국 정부 사이버 안보 구조의 취약점과 '사이버 안보 뉴딜' 제언
* [`CTI-2026-0420-VERCEL` §8.2](./CTI-2026-0420-VERCEL_KR.md#82-%ED%95%9C%EA%B5%AD-web3-%EC%83%9D%ED%83%9C%EA%B3%84-%EA%B4%80%EC%A0%90) — DAXA 회원 거래소·국내 Web3 발행사 관점

---

## 📰 Press Releases — 보도자료 아카이브

기자·편집자·연구자가 리포트 내용을 즉시 활용할 수 있도록, 핵심 통계·인용구·FAQ·연락처를 정리한 요약본을 보도자료 형식으로 별도 제공합니다. 모든 보도자료는 `TLP:GREEN` 하에 자유 인용 가능합니다(출처 표기 필수).

| 리포트 | 한국어 | English |
|---|---|---|
| `CTI-2026-0422-MCP` | [Press KR](./CTI-2026-0422-MCP-PRESS_KR.md) | [Press EN](./CTI-2026-0422-MCP-PRESS_EN.md) |

---

## 🧭 Methodology — 분석 방법론

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

각 Key Judgment는 **High / Medium / Low** 3단계로 신뢰도를 명시하며, 1차 자료와 2차 언론·공개 CTI 자료를 교차 검증합니다.

### 프레임워크 참조

* **MITRE ATT&CK** — TTP 매핑의 표준
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링

---

## 📝 Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>[-<SUBTYPE>]_<LANG>.<ext>

예시 (메인 리포트):
  CTI-2026-0422-MCP_KR.md          → 2026년 4월 22일 발행, MCP 보안, 한국어 Markdown
  CTI-2026-0422-MCP_KR.pdf         → 동일 리포트의 한국어 PDF 정식본
  CTI-2026-0422-MCP_EN.md          → 동일 리포트의 영문판
  CTI-2026-0422-MCP_CN.md          → 중국어(간체) 판
  CTI-2026-0422-MCP_JP.md          → 일본어 판

예시 (파생 문서 — SUBTYPE 사용):
  CTI-2026-0422-MCP-PRESS_KR.md    → 한국어 보도자료
  CTI-2026-0422-MCP-PRESS_EN.md    → 영문 보도자료

예시 (기존 리포트):
  CTI-2026-0420-VERCEL_KR.md       → 2026년 4월 20일 발행, Vercel 사건, 한국어
  CTI-2026-0320-CORUNA_KR.md       → 2026년 3월 20일 발행, Coruna 분석, 한국어
```

* `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자, 하이픈·언더스코어 미사용).
* `SUBTYPE` — 선택 항목. 메인 리포트에서 파생된 문서(`PRESS`, `BRIEF`, `SLIDES` 등)를 구분. 대문자 사용, 하이픈으로 SUBJECT와 연결.
* `LANG` — `KR` (한국어) / `EN` (영어) / `JP` (일본어) / `CN` (중국어, 간체).
* `ext` — `md` (기본) / `pdf` (정식 배포본) / 기타.

---

## 🤝 Contact & Contribution

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 리포트 피드백·정정·제보·취재 요청 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 업데이트·레퍼런스 추가 제안 |
| **제보 보호** | 민감한 제보는 Signal·ProtonMail 등 보안 채널로 문의해 주십시오. |

본 저장소는 개인 연구 프로젝트로, 기여 PR은 환영하나 리포트 본문 수정은 신중히 검토됩니다.

---

## ⚖️ Disclaimer — 면책 조항

### 한국어

1. 본 저장소의 모든 리포트는 **공개된 OSINT 자료와 언론 보도**를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 리포트 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 반드시 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직접적·간접적 사용으로 발생하는 어떠한 손해에 대해서도 책임지지 않습니다.

### English

1. All reports in this repository are **independent analyses based on publicly available OSINT materials and press reporting**, and do not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## 📊 Repository Stats

|  |  |
| --- | --- |
| **총 리포트 수** | 3 |
| **커버 언어** | 한국어, English, 中文(簡體), 日本語 |
| **관측 위협 행위자** | UNC1069 (Sapphire Sleet) · ShinyHunters · UNC6353 · UNC6691 · Operation Zero · 외 다수 |
| **커버 CVE** | 10+ (MCP 계열 6건 포함) |
| **보도자료 수** | 2 (KR · EN) |
| **최근 업데이트** | 2026-04-22 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산은 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
*"MCP를 '쓸 것인가 말 것인가'가 아니라 '무엇과 함께 설치할 것인가'가 문제다." — CTI-2026-0422*
