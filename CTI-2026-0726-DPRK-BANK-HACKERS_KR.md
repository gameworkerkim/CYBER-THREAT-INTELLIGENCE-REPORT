---
title: "北, 내부 해커가 자국 중앙은행 털었다 — 정권의 칼날이 주인을 물다"
subtitle: "Daily NK 보도: 전직 군사 사이버 요원이 중앙은행·대외무역은행을 해킹하고 암호화폐로 세탁했다는 체포 사건 — 미검증 단보와 내부 통제 균열 신호"
description: "2026-07-12 평양에서 북한 국가정보국이 자국 중앙은행·대외무역은행 해킹 혐의 내부 해커를 체포했다는 Daily NK 보도를 정리한다. 자금세탁 경로, 발각 단서, 20억 달러 오해, 검증 한계를 분리한다."
abstract: |
  Daily NK(평양 익명 소식통)에 따르면 2026-07-12 북한 국가정보국이 전직 군사 사이버 부대 출신·김책공대·평양과기대 IT 인력으로 구성된 내부 해커 집단을 체포했다.
  이들은 중앙은행·대외무역은행 내부망에 침투한 뒤 해외 암호화폐 지갑·중국 브로커·신의주·혜산 연락책을 통해 세탁했다고 한다.
  외화 결제 불일치·해외 IP 접근으로 발각됐다는 서술과 함께, 언론의 “20억 달러” 표현은 Chainalysis가 집계한 2025년 북한 관련 탈취 총액과 혼동되기 쉬움을 분리한다.
  본 보고서는 단보 미검증을 명시하고, 인터넷 차단·해외 해킹 시도 급감 등 부수 시그널과 내부 통제 균열 함의를 정리한다.
summary_for_ai: |
  CTI brief (KO), id CTI-2026-0726-DPRK-BANK-HACKERS, date 2026-07-26, TLP:GREEN, severity MEDIUM.
  Claim source: Daily NK anonymous Pyongyang sources via CoinDesk/ForkLog/TokenPost (2026-07-25 coverage). Arrest alleged 2026-07-12 of ex-military cyber personnel + Kim Chaek / PUST recruits for hacking DPRK Central Bank and Foreign Trade Bank, laundering via crypto wallets, Chinese brokers, Sinuiju/Hyesan cash couriers.
  Detection narrative: FX settlement mismatches + suspicious foreign IPs; encrypted traffic traced to safehouse; gear and burner phones seized; armed bank guards + RF intercept vehicles afterward.
  Caveat: not independently verified. “$2B” headlines often conflate Chainalysis 2025 DPRK-linked crypto theft aggregate (~$2B) and TRM Labs claim (~76% of global crypto hack/fraud losses by Apr 2026) with this single incident (amount unknown).
  Analytic note: if true, elite regime-trained operators hitting domestic treasuries signal internal control fracture vs overseas Lazarus/Kimsuky targeting.
date: 2026-07-26
author: "Dennis Kim"
lang: ko
tags:
  - DPRK
  - Lazarus
  - Insider-Threat
  - Cryptocurrency-Laundering
  - Central-Bank
  - Daily-NK
keywords:
  - 북한 해커 체포
  - 중앙은행 해킹
  - 대외무역은행
  - 암호화폐 세탁
  - Daily NK
  - Chainalysis 20억 달러
  - 내부자 위협
group: dprk
featured: true
featured_rank: 1
schema_type: TechArticle
tlp: GREEN
severity: MEDIUM
draft: false
robots: index,follow
---

| id             | CTI-2026-0726-DPRK-BANK-HACKERS                                                      |
| -------------- | ------------------------------------------------------------------------------------ |
| 제목            | 北, 내부 해커가 자국 중앙은행 털었다 — 정권의 칼날이 주인을 물다                        |
| 부제            | Daily NK 단보 기반 체포 사건 정리 · 미검증 명시 · 20억 달러 오해 분리                    |
| 저자            | Dennis Kim (HoKwang Kim)                                                             |
| 이메일          | <gameworker@gmail.com>                                                               |
| github         | gameworkerkim                                                                         |
| 날짜            | 2026-07-26                                                                            |
| 분류            | TLP:GREEN                                                                             |
| 심각도          | MEDIUM                                                                                |
| 언어            | ko                                                                                    |
| 태그            | DPRK · Insider-Threat · Cryptocurrency-Laundering · Central-Bank                      |
| 프레임워크      | N/A (사건 브리프 · OSINT)                                                             |

# 北, 내부 해커가 자국 중앙은행 털었다 — 정권의 칼날이 주인을 물다

> **보고서 ID** `CTI-2026-0726-DPRK-BANK-HACKERS` | **발행일** 2026-07-26 | **분류** `TLP:GREEN` | **심각도** MEDIUM  
> **저자** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)  
> **주의** 본 보고서는 Daily NK 익명 소식통 기반 공개 보도를 재구성한 OSINT 브리프이며, **독립 검증되지 않았다**.

---

## 들어가며

북한이 가상자산·한국·일본 등을 가리지 않고 수익·혼란 목적의 해킹 작전을 전개해 온 것은 주지의 사실이다. 그런데 그 ‘창’이 주인을 찌른다는 보도가 나왔다. 정권이 양성한 정예 해커가 자국 중앙은행과 대외무역은행을 해킹해 자금을 빼돌렸고, 당국이 이들을 체포했다는 것이다. 사이버 안보·제재·내부 통제 관점에서 전말을 정리한다.

---

## 1. 사건의 개요 — 누가, 무엇을, 어떻게 했나?

2026년 7월 12일, 평양의 한 은신처에서 국가정보국 요원이 긴급 체포 작전을 펼쳤다는 서술이다. 검거 대상은 정권이 양성한 정예 해커 집단으로 보도됐다.

남한 매체 Daily NK가 평양 내 익명 소식통을 인용한 바에 따르면, 이들은 북한 중앙은행(조선민주주의인민공화국 중앙은행)과 대외무역은행의 내부 네트워크에 침투했다. 두 기관은 각각 국가 자금의 발행·관리와 대외 외환·무역 결제를 담당하는 금융 시스템의 핵심이다.

조직 핵심은 군사 사이버 정보 부대 출신 전직 군인으로 서술되며, 김책공업종합대학·평양과학기술대학 우수 IT 인력을 포섭해 확장했다고 한다. 군사급 해킹 기술과 텔레그램 등 암호화 메신저, 중국산 무선 장비 등을 동원했다는 보도가 있다.

### 자금 세탁 경로 — 중국 브로커와 국경 현금

빼돌린 자금은 해외 암호화폐 지갑으로 이체된 뒤 **중국 브로커**를 통해 달러·위안화로 현금화되고, 신의주·혜산 등 국경 도시 연락책을 거쳐 다시 북한으로 밀반입되는 방식으로 세탁됐다는 서술이다. 소액 분할 송금, 암호화 메신저, 미등록 휴대전화 등 탐지 회피 수법도 함께 언급된다.

---

## 2. 어떻게 발각되었나? — ‘불일치’의 흔적

당국이 **외화 결제 승인 과정의 불일치**와 **의심스러운 해외 IP 접근 기록**을 포착했다는 설명이다. 북한은 외부 해킹 위협을 의식해 온라인 데이터뿐 아니라 수기 검증 감사를 병행한다는 맥락이 제시된다. 국가정보국이 암호화폐 거래의 암호화 트래픽을 추적해 평양 은신처를 특정했고, 체포 현장에서는 수십만 달러 상당 장비와 가짜 신분 휴대전화가 압수됐다는 보도다.

사건 직후 두 은행에 무장 경비를 배치하고 평양 전역에 무선 감청 차량을 투입하는 등 초비상 태세에 돌입했다는 후속 서술이 있다.

---

## 3. 맥락과 의미 — ‘20억 달러’의 오해와 내부 붕괴 신호

일부 헤드라인의 **“20억 달러 탈취 해커”** 표현은 이번 단일 사건 피해액이 아니다. Chainalysis 기준 **2025년 한 해 북한 연계 해커의 전 세계 암호화폐 탈취 총액이 약 20억 달러**로 집계되며, TRM Labs는 2026년 4월까지 북한 연계 행위자가 전 세계 암호화폐 해킹·사기 피해액의 약 76%를 차지한다고 추정했다. **이번 사건의 탈취 규모는 미확인**이다.

그럼에도 함의는 크다. 김수키·라자루스 등 해외 표적(로닌 브리지 약 6.2억 달러, 하모니 브리지 약 1억 달러 등)에 집중해 온 패턴과 달리, **정권이 훈련시킨 요원이 자국 금고를 털었다**는 서술은 내부 통제 균열을 시사한다.

Daily NK 인용 소식통:

> *"그들은 국가를 지키기 위해 기술을 배웠지만, 국고를 약탈했다."*

가혹한 형량이 예상된다는 전망이 나오는 이유다.

---

## 4. 한계와 시사점 — 미검증 단보, 그러나 의미 있는 신호

본 보도는 Daily NK 익명 소식통에 의존하며 **독립적으로 검증되지 않았다**. 북한 정보 통제 하에서 내부 소식 확인은 상시 어렵다. 다만 7월 12일경부터 약 일주일간 북한 인터넷 사용이 부분적으로 막히고, 북한발 해킹 시도가 급감했다는 관측이 함께 거론되면 부수 시그널로 볼 여지는 있다.

세계적으로 가장 활동적인 국가 해킹 세력의 ‘아킬레스건’이 내부에 있을 수 있다는 질문을 던진다. ‘창’이 ‘주인’을 겨누기 시작했다면, 체제 내부 균열을 가늠하는 바로미터가 된다.

---

## 참고 자료

| 매체 | 제목 | 링크 |
|---|---|---|
| CoinDesk (EN) | North Korea arrests hackers accused of laundering stolen bank funds through crypto | https://www.coindesk.com/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| CoinDesk (KO) | 북한, 암호화폐를 통해 국가 은행에서 탈취한 자금 세탁 혐의로 해커 체포 | https://www.coindesk.com/ko/business/2026/07/25/north-korea-arrests-hackers-accused-of-laundering-stolen-funds-from-country-s-bank-via-crypto |
| ForkLog | North Korean IT Specialists Arrested for Laundering State Funds via Cryptocurrency | https://forklog.com/en/north-korean-it-specialists-arrested-for-laundering-state-funds-via-cryptocurrency/ |
| CoinMarketCap | North Korea arrests ex-military hackers for $2 billion crypto theft | https://coinmarketcap.com/community/articles/6a64ea695999a46d92c159fc/ |
| CoinCentral | North Korea Arrests Hackers Who Stole From State Banks and Laundered Funds Through Crypto | https://coincentral.com/north-korea-arrests-hackers-who-stole-from-state-banks-and-laundered-funds-through-crypto/ |
| TokenPost (KO) | 북한, 중앙은행·무역은행 해킹 조직 적발…암호화폐로 자금세탁 | https://www.tokenpost.kr/article/195050 |
