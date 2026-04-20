# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)]()
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN-lightgrey?style=flat-square)]()
[![Updated](https://img.shields.io/badge/Last%20Update-2026--04--20-informational?style=flat-square)]()

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

*This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.*

---

## 📇 About the Analyst

| | |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | Cyworld CEO , CEO, Betalabs Inc. · Independent Threat Intelligence Analyst |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI SaaS 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Report — Featured

> 🆕 **2026-04-20 발행**

### Vercel 보안 침해 사건 분석

**AI SaaS 공급망 공격 및 ShinyHunters 위협 평가**
*Context.ai 경유 Google Workspace OAuth 탈취 및 잠재적 NPM/GitHub 소프트웨어 공급망 리스크*

미국 프런트엔드 클라우드 개발 플랫폼 Vercel이 2026년 4월 19일 공식 확인한 보안 침해 사건에 대한 전체 분석. AI 에이전트 플랫폼 Context.ai 침해 → Google Workspace OAuth → Vercel 환경 변수로 이어진 5단계 공격 체인과, ShinyHunters 위협 행위자의 2025–2026 캠페인 궤적, 그리고 Web3·가상화폐 산업에 미치는 영향을 다룬다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0420-VERCEL` |
| **심각도** | 🔴 HIGH — 공급망 공격 잠재력 |
| **분류** | `TLP:GREEN` |
| **위협 행위자** | ShinyHunters (UNC6240/UNC6661 연계 가능성) |
| **참고 자료** | 27개 외부 레퍼런스 교차 검증 |

**📄 리포트 다운로드**

- 🇰🇷 [한국어 Markdown](./CTI-2026-0420-VERCEL_KR.md)
- 🇬🇧 [English Markdown](./CTI-2026-0420-VERCEL_EN.md)
- 📕 [한국어 PDF (정식본)](./Vercel_보안사건_분석리포트_CTI-2026-0420.pdf)

---

## 📚 Report Index — 전체 리포트 목록

| ID | 발행일 | 제목 | 심각도 | 언어 | 다운로드 |
| --- | --- | --- | :---: | :---: | :---: |
| [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) | 2026-04-20 | Vercel 보안 침해 사건 — AI SaaS 공급망 공격 및 ShinyHunters 위협 평가 | 🔴 HIGH | KR · EN | [KR](./CTI-2026-0420-VERCEL_KR.md) · [EN](./CTI-2026-0420-VERCEL_EN.md) · [PDF](./Vercel_보안사건_분석리포트_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 사이버 무기 공급망의 붕괴와 국가 안보 위협 — Coruna iOS Exploit Kit 사례 분석 | 🔴 CRITICAL | KR | [KR](./CTI-2026-0320-CORUNA_KR.md) |

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.

---

## 🗂️ By Category — 주제별 분류

### 🌐 공급망 공격 (Supply Chain Attacks)

공격자가 최종 표적이 아닌 '신뢰하는 제3자 벤더'를 먼저 침해하여 간접 접근하는 공격 유형. SolarWinds, Salesloft-Drift 이후 2025–2026년에 가장 빠르게 증가한 카테고리.

- [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth 공급망 침해)

### 📱 모바일·제로데이 위협 (Mobile & Zero-Day)

iOS·Android 등 모바일 플랫폼을 대상으로 하는 국가급 감시 도구 및 상업적 익스플로잇 킷 분석.

- [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) 및 사이버 무기 공급망

### 🕵️ 위협 행위자 프로파일 (Threat Actor Profiles)

특정 APT 그룹·사이버 범죄 단체의 TTP·캠페인·귀속 정보 정리.

- **ShinyHunters** (UNC6040/UNC6240/UNC6661/UNC6671) — [CTI-2026-0420 §5 참고](./CTI-2026-0420-VERCEL_KR.md#5-위협-행위자-분석-shinyhunters)
- **UNC6353·UNC6691·Operation Zero** — [CTI-2026-0320 §3 참고](./CTI-2026-0320-CORUNA_KR.md#3-사이버-무기-공급망-개발에서-범죄화까지)

### 💰 Web3·암호화폐 생태계 (Web3 & Crypto)

DeFi·CEX·스테이블코인·NFT 마켓플레이스 관련 침해 사건 및 국내(DAXA·KoFIU·특금법) 컴플라이언스 관점 분석.

- [`CTI-2026-0420-VERCEL` §8](./CTI-2026-0420-VERCEL_KR.md#8-web3가상화폐-산업에-미치는-영향) — Vercel 침해가 Web3 프런트엔드 인프라에 미치는 영향
- [`CTI-2026-0320-CORUNA` §4](./CTI-2026-0320-CORUNA_KR.md#4-제로데이-취약점-거래-생태계--구조-플랫폼-거래-흔적) — 제로데이 거래 생태계와 암호화폐 기반 결제 구조

### 🇰🇷 한국 사이버 안보 정책 (Korea Cybersecurity Policy)

국내 정부·공공기관·방산업체 대상 위협 분석과 제도적 대응 권고.

- [`CTI-2026-0320-CORUNA` §6–§8](./CTI-2026-0320-CORUNA_KR.md#6-한국-정부-사이버-안보-현황과-위협-분석) — 한국 정부 사이버 안보 구조의 취약점과 '사이버 안보 뉴딜' 제언
- [`CTI-2026-0420-VERCEL` §8.2](./CTI-2026-0420-VERCEL_KR.md#82-한국-web3-생태계-관점) — DAXA 회원 거래소·국내 Web3 발행사 관점

---

## 🧭 Methodology — 분석 방법론

본 아카이브의 모든 리포트는 다음 표준을 따릅니다.

### Traffic Light Protocol (TLP) 분류

| 라벨 | 의미 | 본 저장소 기준 |
| :---: | --- | --- |
| 🟢 **TLP:GREEN** | 커뮤니티 내 공유 가능, 대외 공개 가능 | **이 저장소의 기본값** |
| 🟡 TLP:AMBER | 조직 내부 공유 한정 | 해당 없음 |
| 🔴 TLP:RED | 개별 수령자 한정 | 해당 없음 |

### 심각도 등급 (Severity)

| 등급 | 의미 | 대응 시간 |
| :---: | --- | --- |
| 🔴 **CRITICAL** | 국가안보·대규모 민간 피해 직결 위협 | 즉시 |
| 🔴 **HIGH** | 산업·생태계 광범위 영향 | 24–72시간 |
| 🟠 **MEDIUM** | 특정 기업·조직군 제한 영향 | 7일 이내 |
| 🟡 **LOW** | 인지·관찰 수준 | 30일 이내 |

### 신뢰도 평가 (Confidence)

각 Key Judgment는 **High / Medium / Low** 3단계로 신뢰도를 명시하며, 1차 자료와 2차 언론·공개 CTI 자료를 교차 검증합니다.

### 프레임워크 참조

- **MITRE ATT&CK** — TTP 매핑의 표준
- **NIST SP 800-61** — 사고 대응 수명주기
- **NIST SP 800-207** — Zero Trust Architecture
- **STIX/TAXII** — 위협 인텔리전스 교환 표준
- **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링

---

## 📝 Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0420-VERCEL_KR.md    → 2026년 4월 20일 발행, Vercel 사건, 한국어 Markdown
  CTI-2026-0420-VERCEL_EN.md    → 동일 사건의 영문판
  CTI-2026-0320-CORUNA_KR.md    → 2026년 3월 20일 발행, Coruna 분석, 한국어
```

- `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자)
- `LANG` — `KR` (한국어) / `EN` (영어) / `JP` (일본어) / `CN` (중국어)
- `ext` — `md` (기본) / `pdf` (정식 배포본)

---

## 🤝 Contact & Contribution

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 리포트 피드백·정정·제보 |
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

| | |
| --- | --- |
| **총 리포트 수** | 2 |
| **커버 언어** | 한국어, English |
| **관측 위협 행위자** | ShinyHunters · UNC6353 · UNC6691 · Operation Zero · 외 다수 |
| **최근 업데이트** | 2026-04-20 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
