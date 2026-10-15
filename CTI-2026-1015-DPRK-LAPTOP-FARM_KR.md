---
id: CTI-2026-1015-DPRK-LAPTOP-FARM
title: "북한 '노트북 팜' 사건 — 특징과 시사점"
title_en: "North Korea's Laptop Farms — An Insider Threat That Walks Through Hiring"
subtitle: "방화벽이 아니라 인사·재무가 1차 공격 표면이다"
description: "노트북 팜은 해킹이 아니라 채용을 통과하는 내부자 위협이다. 정상 계정, 미국 조력자, 급여의 외화벌이. 단속이 세질수록 무대는 밖으로 옮아간다."
abstract: |
  노트북 팜은 해킹이 아니라 채용·물류·결제를 정상 경로로 통과하는 내부자 위협이다. 북한 IT 인력은 도용 신분으로 원격 취업하고, 미국 조력자 자택의 노트북을 KVM으로 조종한다.
  2026-10-13 Operation Lonestar Roundup(텍사스 수색, 노트북·KVM 약 187대)와 오하이오 별건 기소, 왕씨 형제 징역, 채프먼 사건을 DOJ 원문으로 정리한다.
  조력자가 단일 실패 지점이다. 목적은 외화벌이에서 ITAR 탈취·갈취로 넓어진다. TLP:CLEAR. 법률·투자 권유 아님.
summary_for_ai: |
  CTI report (KO), id CTI-2026-1015-DPRK-LAPTOP-FARM, date 2026-10-15, TLP:CLEAR, group dprk, severity HIGH, confidence B2.
  Laptop farms: DPRK IT workers hired remotely with stolen or fake US identities; company laptops staged at US facilitator homes with KVM/remote software so sessions appear as US residential IPs. Payroll up to 90% remitted toward regime WMD programs.
  Cases from DOJ: 2026-10-13 Operation Lonestar Roundup (Texas searches, ~187 laptops/KVMs, no arrests on that search) plus separate Ohio indictment (14 charged, 2 US facilitators arrested, ~$3M, 70+ companies). Wang brothers sentenced 108 and 92 months (2026-04-15), ITAR theft, State Dept reward up to $5M. Christina Chapman sentenced 102 months (2025-07-24), 90+ laptops, $17M+, 309 US firms. Do not name Nike; DOJ did not.
  Actors: Famous Chollima / Jasper Sleet / UNC5267 — naming needs reconfirmation. $800M+ 2024 figure is NDTX US Attorney Ryan Raybould, not a Treasury document.
  Detection: hiring, shipping address, remote-access software, timezone vs US IP, shared payroll accounts. Public DOJ email IOCs are short-lived; pattern detection is primary. Not a how-to. Not legal or investment advice.
date: 2026-10-15
updated: 2026-10-15
author: "Dennis Kim (김호광 / HoKwang Kim)"
email: "gameworker@gmail.com"
github: "gameworkerkim"
lang: ko
tags:
  - DPRK
  - Laptop-Farm
  - Insider-Threat
  - Famous-Chollima
  - Hiring-Fraud
  - Sanctions
keywords:
  - "노트북 팜"
  - "북한 IT 인력"
  - "Laptop Farm"
  - "Famous Chollima"
  - "원격 채용 사기"
  - "Operation Lonestar"
group: dprk
featured: true
featured_rank: 1
og_image: "https://vibequant.cc/og/dprk-laptop-farm-20261015.jpg"
image: "https://vibequant.cc/og/dprk-laptop-farm-20261015.jpg"
schema_type: TechArticle
classification: "TLP:CLEAR"
severity: HIGH
confidence: "B2"
license: "CC BY-NC-SA 4.0"
draft: false
robots: index,follow
canonical: "https://cti.vibequant.cc/cti/dprk-laptop-farm-20261015/"
---

<!--
  HEAD 참조 (렌더링 안 됨 · 빌드 자동 주입 · 주석 풀지 말 것)
  <title>북한 '노트북 팜' 사건 — 특징과 시사점 · VibeQuant CTI</title>
  <meta name="description" content="노트북 팜은 해킹이 아니라 채용을 통과하는 내부자 위협이다. 정상 계정, 미국 조력자, 급여의 외화벌이. 단속이 세질수록 무대는 밖으로 옮아간다.">
  <meta name="robots" content="index,follow">
-->

# 북한 '노트북 팜' 사건 — 특징과 시사점

![FBI 수배 전단. 김일(Kim Il)](https://vibequant.cc/og/dprk-laptop-farm-20261015.jpg)

*FBI 공개 수배 전단. 김일(Kim Il). 전신·은행 사기와 컴퓨터 침입 공모 혐의.*

**김호광** 싸이월드 전 대표 / 2026년 10월 15일

> **분류**: TLP:CLEAR | **문서유형**: CTI 리포트 | **작성일**: 2026-10-15
> **심각도**: HIGH | **신뢰도**: B2 | **관련 행위자**: Famous Chollima · Jasper Sleet · UNC5267

## 요약

노트북 팜은 해킹이 아니라 **채용·물류·결제 프로세스를 정상 경로로 통과하는 내부자 위협**이다. 방화벽이나 EDR이 아니라 인사·재무 시스템이 1차 공격 표면이라는 점이 핵심이다.

- **판단 1 — 정상 계정이 공격 벡터다.** 북한 IT 인력은 정식 채용 절차로 계정·노트북·사내 접근권을 합법적으로 받는다. 침투 흔적이 아닌 근무 흔적만 남는다.
- **판단 2 — 미국 내 조력자가 병목이자 약점이다.** 노트북 수령, KVM 설치, 급여 수령은 현지 사람이 해야 한다. 그래서 수사는 조력자 적발에서 시작해 네트워크로 확장된다.
- **판단 3 — 목적이 외화벌이에서 데이터 탈취·갈취로 넓어지고 있다.** 해고 후 소스코드·내부 데이터를 볼모로 금전을 요구한 사례가 보고됐다.
- **판단 4 — 미국 단속이 강화될수록 유럽·아시아로 무대가 옮겨간다.** 한국·일본 기업도 원격 채용을 하는 한 같은 위험에 노출된다.

## 사건 개요와 범행 구조

노트북 팜은 피해 기업이 지급한 업무용 노트북을 미국 내 조력자 자택에 모아 두고, 해외의 북한 IT 인력이 이를 원격 조종하게 만든 위장 거점이다. 기업 입장에서는 미국에 사는 직원이 미국 IP로 접속해 일하는 것처럼 보인다.

![북한 IT 인력의 해외 거점 도용·위장 취업 흐름도](https://vibequant.cc/og/dprk-laptop-farm-flow-20261015.jpg)

*북한 IT 인력이 해외 거점을 통해 위장 취업한 뒤, 가짜 경력을 만들어 금융·기업 시스템에 접근하는 구조.*

위쪽 흐름(① ~ ④)이 위장 취업, 아래쪽 흐름(⑤ ~ ⑦)이 급여 세탁이다. 두 흐름 모두 미국 내 조력자를 거쳐야 하므로, 조력자가 이 구조의 단일 실패 지점이다.

## 주요 특징 (TTP 분석)

이 수법의 본질은 각 레이어가 따로 보면 모두 정상 업무라는 점이다. 채용팀, IT팀, 재무팀이 각자 보는 단면에서는 이상 징후가 잘 드러나지 않는다.

| 레이어 | 공격자가 하는 일 | 왜 기존 통제를 통과하는가 |
| --- | --- | --- |
| 신원 | 도용·위조된 미국인 신분증, 조력자 명의 대여, 가짜 포트폴리오·LinkedIn | 서류 심사와 화상 면접만으로는 실제 인물 여부 확인이 어렵다 |
| 물류 | 기업이 보낸 노트북을 조력자가 자택에서 수령 | 배송지가 미국 주소이므로 정상 직원으로 처리된다 |
| 접속 | KVM 스위치, 원격접속 SW, VPN·프록시로 미국 IP 위장 | 기업 VPN 로그상 접속지가 미국 가정집으로 찍힌다 |
| 금융 | 조력자 계좌·페이퍼컴퍼니로 급여 수령 후 해외 결제 플랫폼으로 이체 | 급여는 미국 은행 계좌로 정상 지급된다 |
| 인력 운용 | 1명이 여러 회사에 동시 취업, 업무를 제3국인에게 재하청 | 각 회사는 다른 회사의 고용 사실을 모른다 |

- **조력자 역할의 확대.** FBI는 2026년 10월 PSA에서 민간 탐지와 단속이 강화되자 북한 측이 미국인 조력자를 더 적극적으로 모집하고, 맡기는 업무 범위도 넓히며, 일부는 업무 자체를 제3국인에게 재하청한다고 밝혔다.
- **관리자 계층의 존재.** 왕씨 형제 사건에서 커자 왕은 중국 선양·단둥을 방문해 해외 측과 협의한 뒤 미국 내 관리자로서 최소 5명의 조력자를 감독했다. 노트북 팜은 개인 부업이 아니라 위계가 있는 조직이다.
- **데이터 탈취로의 전이.** 같은 사건에서 해외 공모자가 AI 기반 장비를 개발하는 캘리포니아 방산업체의 노트북에 무단 접속해 ITAR 통제 기술자료를 빼냈다. 외화벌이 인력이 언제든 정보 수집 인력으로 전환될 수 있다는 뜻이다.

## 규모와 배후

북한 IT 인력 프로그램 전체 수익은 2024년 한 해 8억 달러 이상으로 추산되며, 개별 사건은 수백만~수천만 달러 규모다. 큰 숫자는 수많은 작은 노트북 팜이 합쳐진 결과다.

| 항목 | 내용 | 출처 |
| --- | --- | --- |
| 연간 수익 추정 | 2024년 8억 달러 이상 (텍사스 북부지검장 Ryan Raybould 기자회견 발언) | [Yahoo/NBC DFW](https://www.yahoo.com/news/us/articles/more-100-laptops-linked-north-185301708.html) |
| 상납 비율 | 고액 급여의 최대 90%가 북한 핵·미사일 프로그램으로 유입 | [Yahoo/FOX 4](https://www.yahoo.com/news/articles/fbi-raids-texas-laptop-farms-165455655.html) |
| 1인당 수입 | 개인당 연 최대 30만 달러, 총합 연 수억 달러 (2022년 5월 미 정부 합동 권고) | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) |
| 수익 귀속처 | 북한 국방성 등 WMD 프로그램 관련 제재 대상 기관 | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) |
| 위협 행위자 명칭 | CrowdStrike: Famous Chollima (Microsoft는 Jasper Sleet, Mandiant는 UNC5267로 추적, 명칭은 기억에 의존한 것으로 재확인 필요) | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) |
| 피해 업종 | 헬스케어, 통신, 사이버 지원, 리테일, 제조, 방산 | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) |

원문 초안의 "미 재무부 추산, 2024 회계연도 약 8억 달러"는 이번에 연 원문에서는 연방검사장의 발언으로 확인됐다. 재무부 자료 원문을 인용하려면 별도 확인이 필요하다.

## 주요 적발·처벌 사례

미국의 처벌 수위는 조력자 기준 징역 7~9년대로 굳어지고 있고, 단속은 개별 사건 기소에서 다수 거점 동시 수색으로 커지고 있다.

| 발표일 | 사건 | 핵심 사실 | 결과 |
| --- | --- | --- | --- |
| 2026-10-13 | [Operation Lonestar Roundup + 오하이오 기소](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) | 9월 21-25일 텍사스 40곳 이상 주거지 수색, 노트북·KVM 약 187대 압수 (100대 이상 북텍사스). 별건 오하이오 기소: 2019-2025년 7월, 70곳 이상 기업, 수익 약 300만 달러 | 14명 기소(중국 거주 10명 실명, 2명 봉인), 미국인 조력자 2명 체포. 텍사스 수색 건은 아직 체포 없음 |
| 2026-04-15 | [커자 왕·전싱 왕 형제](https://www.justice.gov/opa/pr/two-us-nationals-sentenced-facilitating-fraudulent-remote-information-technology-worker) | 2021~2024년 10월, 미국인 80명 이상 신분 도용, 100곳 이상 기업 취업, 북한 수익 500만 달러 이상. 방산업체 ITAR 자료 유출 | 징역 108개월(9년), 92개월(7년 8개월). 공범 8명 도주, 국무부 최대 500만 달러 현상금 |
| 2025-07-24 | [크리스티나 채프먼 (애리조나)](https://www.justice.gov/opa/pr/arizona-woman-sentenced-17m-information-technology-worker-fraud-scheme-generated-revenue) | 68명 신분 도용, 미국 기업 309곳 + 해외 2곳 피해, 수익 1,700만 달러 이상. 자택에서 노트북 90대 이상 압수, 49대는 북한 접경 중국 도시 등 해외로 발송 | 징역 102개월(8년 6개월) |

**원문 초안 대비 정정 사항**

- 텍사스 사건에서 "조력자 2명 체포, 중국 총책 등 10여 명 기소"는 실제로는 **오하이오 북부지검의 별건 기소**다. 같은 날 함께 발표됐지만 텍사스 수색 자체에서는 체포가 없었고, 지검장은 거점 운영자 기소가 뒤따를 것이라고 예고했다.
- 채프먼 사건 피해 기업으로 "나이키"가 언급되지만, DOJ 보도자료는 회사명을 밝히지 않고 "TV 방송사, 실리콘밸리 기술기업, 항공우주 제조사, 미국 자동차 회사, 명품 리테일" 등으로만 표현한다. 리포트에서는 실명 인용을 피하는 편이 안전하다.
- 노트북 수: 텍사스는 "187대"(DOJ), 채프먼 자택은 "90대 이상"(DOJ)이 정확한 표현이다.

## 탐지 지표와 헌팅 포인트

단일 지표로는 잡히지 않으므로 채용·엔드포인트·네트워크·급여 신호를 한 사람 기준으로 엮어 보는 것이 핵심이다. 아래는 공개 권고와 사례에서 반복되는 신호를 정리한 것이다.

| 영역 | 의심 신호 | 확인 위치 |
| --- | --- | --- |
| 채용 | 화상 면접 시 카메라 거부·지연, 얼굴과 신분증 불일치, 이력서와 LinkedIn 경력 불일치, 같은 사진·문구를 쓰는 다른 지원자 | ATS, 면접 녹화, 레퍼런스 체크 |
| 물류 | 배송지가 등록 주소와 다름, 입사 직후 배송지 변경 요청, 같은 주소로 여러 직원 장비 배송 | IT 자산관리, 택배 기록 |
| 엔드포인트 | 업무 노트북에 AnyDesk·TeamViewer·RustDesk 등 비승인 원격 SW 설치, KVM-over-IP 장치 연결 흔적, 비정상적 마우스·키 입력 지연 패턴 | EDR, USB·HID 장치 로그 |
| 네트워크 | 미국 주거용 IP에서 접속하지만 근무 시간대가 아시아 시간대에 맞춰짐, 같은 공인 IP를 여러 직원 계정이 공유, 상용 VPN·프록시 경유 | IdP·VPN 로그, 시간대 분석 |
| 급여·재무 | 입사 직후 급여 계좌 변경, 결제 플랫폼·핀테크 계좌 지정, 같은 계좌로 여러 직원 급여 입금 | 급여 시스템, 은행 |
| 행동 | 근무 중 영상회의 회피, 업무 성과가 여러 사람 몫처럼 들쭉날쭉, 해고 직후 데이터 반출 시도·금전 요구 | HR, DLP |

**DOJ 공개 IOC (2026-10-13, 피의자 사용 이메일 계정)**

```
Bright.star.me208@gmail.com
Merrttank.bz@gmail.com
randyryang@gmail.com
michaelb860102@gmail.com
assassinki211@gmail.com
dev.jerryyang@gmail.com
denis.turgenev2021@gmail.com
yesiree.cano825@gmail.com
thomasdenzelbrown@gmail.com
anthonyortega4592@gmail.com
tyler.j.palmi38@gmail.com
```

DOJ는 이 계정들을 채용 시스템의 차단 지표에 추가하라고 권고했다. 다만 일회성 계정이 많아 수명이 짧으므로, 지원자 이메일·연락처 대조용으로만 쓰고 패턴 탐지가 주된 수단이어야 한다.

## 시사점과 전망

단속은 노트북 팜을 없애기보다 형태를 바꾸게 만들 가능성이 높다. CrowdStrike도 이번 작전의 효과는 제한적일 것이며 미국 내 인프라 해체의 시작일 뿐이라고 평가했다.

1. **채용은 이제 보안 통제 지점이다.** 공격자는 취약점이 아니라 HR 프로세스를 이용한다. 원격 채용 신원확인을 IT 보안 정책의 일부로 다뤄야 하며, 인사팀은 사실상 1차 방어선이다.
2. **조력자 모집이 단속의 역풍으로 오히려 늘어난다.** FBI는 탐지가 강화되자 북한이 미국인 조력자를 더 많이, 더 다양한 역할로 쓰고, 업무를 제3국인에게 재하청한다고 밝혔다. 앞으로 노트북 팜은 더 작고 분산된 형태로, 크라우드소싱식 "부업"으로 위장해 모집될 것으로 본다.
3. **외화벌이 → 정보수집 → 갈취의 전환이 쉽다.** 같은 인력이 급여를 받다가 ITAR 자료를 빼내고, 해고되면 탈취 데이터로 금전을 요구한다. 노출된 순간 급여 사기가 아니라 침해 사고로 대응해야 한다.
4. **AI가 진입 장벽을 낮춘다 (분석적 판단).** 이력서·자기소개·코딩 과제는 생성형 AI로, 화상 면접은 실시간 얼굴·음성 변조로 보완될 수 있다. 1인이 여러 회사 업무를 동시에 처리하는 생산성도 AI로 올라간다. 이는 공개 사건 기록이 아닌 추세 판단이다.
5. **무대가 미국 밖으로 넓어진다 (분석적 판단).** 미국의 단속·처벌이 강해질수록 신원확인이 느슨한 국가와 업종으로 이동할 유인이 커진다. 한미 양국은 2023년 10월 이미 공동 권고를 냈다.
6. **한국 기업에 주는 함의.** 원격 개발자를 해외 플랫폼으로 채용하는 블록체인·웹3, 게임, 스타트업이 특히 취약하다. 한국은 "북한이 한국인으로 위장"하기 어렵다는 통념이 있지만, 해외 국적 프리랜서로 위장하면 그 통념은 통하지 않는다. 또 한국 기업이 미국 자회사·미국 고객사와 거래한다면 북한 인력 고용 자체가 미국 제재 위반 리스크로 이어질 수 있다.

## 권고 사항

가장 효과가 큰 통제는 "장비를 받는 사람과 일하는 사람이 같은지"를 입사 시점과 근무 중에 반복 확인하는 것이다.

| 조직 | 권고 |
| --- | --- |
| 인사·채용 | 최종 면접은 대면 또는 신분증을 들고 하는 라이브 영상으로 진행. 신분증 원본 다중 확인, 미국 채용 시 E-Verify 사용. 레퍼런스는 지원자가 준 번호가 아닌 공식 경로로 확인 |
| IT·보안 | 장비는 등록 주소로만 배송하고 배송지 변경은 별도 승인. 비승인 원격접속 SW와 KVM·HID 장치 탐지 규칙 적용. 신규 입사자 90일간 접속 IP·시간대·공유 IP 모니터링 |
| 재무·급여 | 급여 계좌 변경 시 재인증, 결제 플랫폼 계좌 지정 제한, 한 계좌·한 주소에 여러 직원이 묶이는지 정기 대조 |
| 법무·경영 | 의심 시 즉시 해고보다 증거 보전과 수사기관 신고를 먼저 진행 (해고 직후 데이터 갈취 위험). 외주·재하청 계약에 실제 작업자 신원 확인 조항 추가 |
| 위협 인텔리전스 | DOJ·FBI 공개 IOC를 채용 시스템에 반영하되, 패턴 기반 탐지(시간대·공유 IP·장치) 중심으로 운영 |

## 출처

- [DOJ, Justice Department Announces Coordinated Actions to Combat North Korean Remote IT Worker Schemes (2026-10-13)](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker)
- [DOJ, Two U.S. Nationals Sentenced for Facilitating Fraudulent Remote IT Worker Scheme (2026-04-15)](https://www.justice.gov/opa/pr/two-us-nationals-sentenced-facilitating-fraudulent-remote-information-technology-worker)
- [DOJ, Arizona Woman Sentenced for $17M IT Worker Fraud Scheme (2025-07-24)](https://www.justice.gov/opa/pr/arizona-woman-sentenced-17m-information-technology-worker-fraud-scheme-generated-revenue)
- [FBI IC3 PSA (2026-10-13)](https://www.ic3.gov/PSA/2026/PSA261013)
- [CrowdStrike, FBI Disrupts Famous Chollima Operation](https://www.crowdstrike.com/en-us/blog/fbi-disrupts-famous-chollima-operation-with-crowdstrike-assistance)
- [Yahoo/NBC DFW, More than 100 laptops linked to North Korea seized in North Texas](https://www.yahoo.com/news/us/articles/more-100-laptops-linked-north-185301708.html)
- [CBS Texas, North Texas federal officials promise indictments](https://www.cbsnews.com/texas/news/fbi-us-attorney-press-conference-10-13-2026/)
- [BleepingComputer, FBI raids DPRK IT worker laptop farms in Texas](https://www.bleepingcomputer.com/news/security/fbi-raids-dprk-it-worker-laptop-farms-in-texas-us-nationals-arrested/)

FBI PSA와 CrowdStrike 블로그는 DOJ 보도자료의 링크로만 확인했고 본문은 열어보지 않았다.
