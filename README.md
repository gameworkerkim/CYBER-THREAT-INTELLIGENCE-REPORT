# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

[![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)](https://www.first.org/tlp/)
[![License](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN-lightgrey?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)
[![Updated](https://img.shields.io/badge/Last%20Update-2026--04--27-informational?style=flat-square)](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

*This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.*

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | Cyworld CEO, CEO Betalabs Inc. · Independent Threat Intelligence Analyst |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI SaaS 보안, Fork 체인 거버넌스 리스크 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Report — Featured

> 🆕 **2026-04-27 발행**

### 라이트코인(Litecoin) MWEB 제로데이 사건 — '오래된 PoW' 신화의 균열

**13블록 reorg, 5주 silent patch, 그리고 Fork 블록체인 산업 전반의 구조적 유지보수 결함**
*A patch-gap attack disguised as a zero-day — and what 24 months of GitHub data say about every Bitcoin/Ethereum fork*

2026년 4월 25일 발생한 라이트코인 메인넷의 13블록 체인 재구성 사건에 대한 전체 분석. (i) 5주 전 비공개로 패치되어 있었던 MWEB 합의 결함, (ii) DoS와 결합된 3-스테이지 코디네이티드 공격 패턴, (iii) NEAR Intents 등 크로스체인 인프라로의 손실 이전, (iv) **비트코인·이더리움 본가와 그 fork 계열(LTC·DOGE·BCH·BSV·BTG·Verge / ETC·ETHW·Polygon·BNB Chain 등)의 24개월 GitHub 활동·기여자·보안 패치 간격 정량 비교**, (v) DAXA 회원 거래소 대상 5단계 단계적 조치(D-1~D-5) 및 KoFIU·금융위·금감원 권고를 포함한다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0427-LITECOIN` |
| **심각도** | 🔴 HIGH — 자산 직접 손실 + 거래소 컴플라이언스 영향 |
| **분류** | `TLP:GREEN` |
| **분석 차원** | 합의 익스플로잇 · CVD 위반 · Fork 체인 거버넌스 · 한국 컴플라이언스 |
| **참고 자료** | 27개 외부 레퍼런스 + 4개 정량 비교 표 (BTC fork 7종 + ETH fork 7종) |

**📄 리포트 다운로드**

* 🇰🇷 [한국어 Markdown](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md)
* 🇬🇧 [English Markdown](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_EN.md)


> **본 리포트의 한 줄 결론**: *"이것은 제로데이가 아니라 N-day의 silent patch가 만든 patch-gap 공격이었다. 그리고 라이트코인 코어 메인테이너 풀은 그 갭을 닫기에 너무 얇다 — 이는 fork 블록체인 산업 전반에 적용되는 진단이다."*

---

## 📚 Report Index — 전체 리포트 목록

| ID | 발행일 | 제목 | 심각도 | 언어 | 다운로드 |
| --- | --- | --- | --- | --- | --- |
| [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md) | 2026-04-27 | 라이트코인 MWEB 제로데이 사건 — 13블록 reorg, silent patch, Fork 체인 구조 리스크 정량 분석 | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_EN.md) · [DOCX](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.docx) |
| [`CTI-2026-0420-VERCEL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md) | 2026-04-20 | Vercel 보안 침해 사건 — AI SaaS 공급망 공격 및 ShinyHunters 위협 평가 | 🔴 HIGH | KR · EN | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md) · [EN](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_EN.md) · [PDF](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| [`CTI-2026-0320-CORUNA`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 사이버 무기 공급망의 붕괴와 국가 안보 위협 — Coruna iOS Exploit Kit 사례 분석 | 🔴 CRITICAL | KR | [KR](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md) |

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.

---

## 🗂️ By Category — 주제별 분류

### 🔗 블록체인 합의·Fork 체인 리스크 (Blockchain Consensus & Fork Chain Risk)

PoW/PoS 합의 결함, 51% 공격, chain reorg, silent patch + delayed disclosure 등 블록체인 코어 레이어 위협. **Fork 체인의 본가 대비 유지보수 격차에 대한 정량 분석**도 본 카테고리에 포함된다.

* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md) — Litecoin MWEB silent patch · 13블록 reorg · 24개월 fork 비교 분석 (BTC/ETH 본가 vs fork 7종 + 7종)

### 🌐 공급망 공격 (Supply Chain Attacks)

공격자가 최종 표적이 아닌 '신뢰하는 제3자 벤더'를 먼저 침해하여 간접 접근하는 공격 유형. SolarWinds, Salesloft-Drift 이후 2025–2026년에 가장 빠르게 증가한 카테고리.

* [`CTI-2026-0420-VERCEL`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md) — Vercel × Context.ai × ShinyHunters (AI SaaS OAuth 공급망 침해)

### 📱 모바일·제로데이 위협 (Mobile & Zero-Day)

iOS·Android 등 모바일 플랫폼을 대상으로 하는 국가급 감시 도구 및 상업적 익스플로잇 킷 분석.

* [`CTI-2026-0320-CORUNA`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit (CVE-2024-23222) 및 사이버 무기 공급망

### 🕵️ 위협 행위자 프로파일 (Threat Actor Profiles)

특정 APT 그룹·사이버 범죄 단체의 TTP·캠페인·귀속 정보 정리.

* **ShinyHunters** (UNC6040/UNC6240/UNC6661/UNC6671) — [CTI-2026-0420 §5 참고](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md#5-%EC%9C%84%ED%98%91-%ED%96%89%EC%9C%84%EC%9E%90-%EB%B6%84%EC%84%9D-shinyhunters)
* **UNC6353·UNC6691·Operation Zero** — [CTI-2026-0320 §3 참고](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md#3-%EC%82%AC%EC%9D%B4%EB%B2%84-%EB%AC%B4%EA%B8%B0-%EA%B3%B5%EA%B8%89%EB%A7%9D-%EA%B0%9C%EB%B0%9C%EC%97%90%EC%84%9C-%EB%B2%94%EC%A3%84%ED%99%94%EA%B9%8C%EC%A7%80)
* **합의 익스플로잇 actor** (EOA `0xfF18652A...F6Fc10` 클러스터) — [CTI-2026-0427 §2.2 참고](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md#22-%EA%B3%B5%EA%B2%A9-%EC%8B%9C%ED%80%80%EC%8A%A4--3-%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80-%EC%BD%94%EB%94%94%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%93%9C-%EA%B3%B5%EA%B2%A9)

### 💰 Web3·암호화폐 생태계 (Web3 & Crypto)

DeFi·CEX·스테이블코인·NFT 마켓플레이스 관련 침해 사건 및 국내(DAXA·KoFIU·특금법) 컴플라이언스 관점 분석.

* [`CTI-2026-0427-LITECOIN`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md) — 라이트코인 ETF 자산의 첫 합의 익스플로잇과 한국 5대 거래소 노출 평가
* [`CTI-2026-0420-VERCEL` §8](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md#8-web3%EA%B0%80%EC%83%81%ED%99%94%ED%8F%90-%EC%82%B0%EC%97%85%EC%97%90-%EB%AF%B8%EC%B9%98%EB%8A%94-%EC%98%81%ED%96%A5) — Vercel 침해가 Web3 프런트엔드 인프라에 미치는 영향
* [`CTI-2026-0320-CORUNA` §4](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md#4-%EC%A0%9C%EB%A1%9C%EB%8D%B0%EC%9D%B4-%EC%B7%A8%EC%95%BD%EC%A0%90-%EA%B1%B0%EB%9E%98-%EC%83%9D%ED%83%9C%EA%B3%84--%EA%B5%AC%EC%A1%B0-%ED%94%8C%EB%9E%AB%ED%8F%BC-%EA%B1%B0%EB%9E%98-%ED%9D%94%EC%A0%81) — 제로데이 거래 생태계와 암호화폐 기반 결제 구조

### 🇰🇷 한국 사이버 안보·금융 컴플라이언스 정책 (Korea Cybersecurity & Financial Compliance Policy)

국내 정부·공공기관·방산업체·가상자산 거래소를 대상 위협 분석과 제도적 대응 권고. **DAXA·KoFIU·금융위·금감원 권고도 본 카테고리에 포함**.

* [`CTI-2026-0427-LITECOIN` §6](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0427-LITECOIN_KR.md#6-%ED%95%9C%EA%B5%AD-%EC%8B%9C%EC%9E%A5-%EC%8B%9C%EC%82%AC%EC%A0%90-%EB%B0%8F-%EC%A6%89%EC%8B%9C-%EC%A1%B0%EC%B9%98-%EA%B6%8C%EA%B3%A0-strengthened) — DAXA 5단계 단계적 조치(D-1~D-5) + 회원 거래소 T+0/T+1주/T+1개월 액션 + KoFIU/FSC/FSS 권고
* [`CTI-2026-0320-CORUNA` §6–§8](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md#6-%ED%95%9C%EA%B5%AD-%EC%A0%95%EB%B6%80-%EC%82%AC%EC%9D%B4%EB%B2%84-%EC%95%88%EB%B3%B4-%ED%98%84%ED%99%A9%EA%B3%BC-%EC%9C%84%ED%98%91-%EB%B6%84%EC%84%9D) — 한국 정부 사이버 안보 구조의 취약점과 '사이버 안보 뉴딜' 제언
* [`CTI-2026-0420-VERCEL` §8.2](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0420-VERCEL_KR.md#82-%ED%95%9C%EA%B5%AD-web3-%EC%83%9D%ED%83%9C%EA%B3%84-%EA%B4%80%EC%A0%90) — DAXA 회원 거래소·국내 Web3 발행사 관점

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
* **CVD (Coordinated Vulnerability Disclosure)** — 취약점 공개 표준 (CTI-2026-0427 적용)

---

## 📝 Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0427-LITECOIN_KR.md   → 2026년 4월 27일 발행, Litecoin MWEB 사건, 한국어 Markdown
  CTI-2026-0427-LITECOIN_EN.md   → 동일 사건의 영문판
  CTI-2026-0427-LITECOIN_KR.docx → 한국어 Word 정식본
  CTI-2026-0420-VERCEL_KR.md     → 2026년 4월 20일 발행, Vercel 사건, 한국어
  CTI-2026-0320-CORUNA_KR.md     → 2026년 3월 20일 발행, Coruna 분석, 한국어
```

* `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자)
* `LANG` — `KR` (한국어) / `EN` (영어) / `JP` (일본어) / `CN` (중국어)
* `ext` — `md` (기본) / `pdf`·`docx` (정식 배포본)

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

|  |  |
| --- | --- |
| **총 리포트 수** | 3 |
| **커버 언어** | 한국어, English |
| **관측 위협 행위자** | ShinyHunters · UNC6353 · UNC6691 · Operation Zero · Litecoin MWEB EOA cluster · 외 다수 |
| **분석 차원** | 공급망 공격 · 모바일 제로데이 · 위협 행위자 프로파일 · Web3·암호화폐 · **블록체인 합의·Fork 체인 리스크 (신규)** · 한국 사이버 안보·금융 컴플라이언스 정책 |
| **최근 업데이트** | 2026-04-27 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*

*"성숙한 PoW 체인의 '오래됨' 자체는 보안의 증거가 아니다. 코드는 메인테이너의 손에서만 살아있다. 그리고 fork 체인은 그 손이 본가의 1/10도 되지 않는 곳에서 태어난다." — CTI-2026-0427*
