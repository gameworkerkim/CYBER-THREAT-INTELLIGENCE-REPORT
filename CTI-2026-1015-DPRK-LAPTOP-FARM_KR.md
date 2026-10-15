<!--
---
id: CTI-2026-1015-DPRK-LAPTOP-FARM
title: "북한 '노트북 팜' 사건 — 특징과 시사점"
title_en: "North Korea's Laptop Farms — An Insider Threat That Walks Through Hiring"
subtitle: "방화벽이 아니라 인사·재무가 1차 공격 표면이다"
description: "노트북 팜은 해킹이 아니라 채용을 통과하는 내부자 위협이다. 정상 계정, 미국 조력자, 급여의 외화벌이. 단속이 세질수록 무대는 밖으로 옮아간다."
abstract: |
  노트북 팜은 해킹이 아니라 채용·물류·결제를 정상 경로로 통과하는 내부자 위협이다. 북한 IT 인력은 도용 신분으로 원격 취업하고, 미국 조력자 자택의 노트북을 KVM으로 조종한다.
  2026-10-13 Operation Lonestar Roundup(텍사스 수색, 노트북·KVM 약 187대, 체포 없음)와 오하이오 별건 기소, 왕씨 형제·채프먼·메릴랜드 봉(Vong) 선고를 정리한다.
  FBI PSA(I-101326-PSA)와 CrowdStrike 블로그 본문을 대조했다. 조력자 업무가 면접 대역·생체 확인까지 넓어졌고, 팜은 더 작고 더 많아졌다. 수익의 85–90%가 정권으로 가며, 최대 운영 주체는 노동당 군수공업부로 추정된다. TLP:CLEAR. 법률·투자 권유 아님.
summary_for_ai: |
  CTI report (KO), id CTI-2026-1015-DPRK-LAPTOP-FARM, date 2026-10-15, TLP:CLEAR, group dprk, severity HIGH, confidence B2.
  Laptop farms: DPRK IT workers hired remotely with stolen or fake US identities; company laptops staged at US facilitator homes with KVM/remote software so sessions appear as US residential IPs. Payroll up to 90% remitted toward regime WMD programs.
  Cases from DOJ: 2026-10-13 Operation Lonestar Roundup (Texas searches, ~187 laptops/KVMs, no arrests on that search) plus separate Ohio indictment (14 charged, 2 US facilitators arrested, ~$3M, 70+ companies). Wang brothers sentenced 108 and 92 months (2026-04-15), ITAR theft, State Dept reward up to $5M. Christina Chapman sentenced 102 months (2025-07-24), 90+ laptops, $17M+, 309 US firms. Do not name Nike; DOJ did not.
  Actors: CrowdStrike attributes the disrupted farms to FAMOUS CHOLLIMA. FBI PSA: largest operator likely the Workers' Party Munitions Industry Department; RGB and nuclear-program bodies also run IT workers. Teams of about a dozen. Do not treat Jasper Sleet or UNC5267 as a confirmed 1:1 alias from these two sources. $800M+ 2024 figure is NDTX US Attorney Ryan Raybould, not a Treasury document. Revenue share 85-90% is the FBI PSA figure.
  Investigation status as of 2026-10-15: Texas searches have no arrests; Ohio facilitators arrested; Wang, Chapman, and Vong sentenced. CrowdStrike (late Sep 2026, tracking since Apr 2025) calls the disruption the start of a broader US infrastructure takedown, geographically limited and unlikely to last. FBI: smaller farms, subcontracting to Pakistan/India/Nigeria, extortion and death threats, clearance and active-duty military laptop hosting.
  Detection: identity-in-depth, not a single indicator or a name ban list. Public DOJ email IOCs are short-lived. Not a how-to. Not legal or investment advice.
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
confidence: "B1"
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

> **분류**: TLP:CLEAR | **문서유형**: CTI 리포트 | **작성일**: 2026-10-15 | **본문 대조**: 2026-10-15
> **심각도**: HIGH | **신뢰도**: B1 | **이번 작전**: Famous Chollima | **추정 주무**: 노동당 군수공업부

## 요약

노트북 팜은 해킹이 아니라 **채용·물류·결제 프로세스를 정상 경로로 통과하는 내부자 위협**이다. 방화벽이나 EDR이 아니라 인사·재무 시스템이 1차 공격 표면이라는 점이 핵심이다.

- **판단 1 — 정상 계정이 공격 벡터다.** 북한 IT 인력은 정식 채용 절차로 계정·노트북·사내 접근권을 합법적으로 받는다. 침투 흔적이 아닌 근무 흔적만 남는다.
- **판단 2 — 미국 내 조력자가 병목이자 약점이다.** 노트북 수령, KVM 설치, 급여 수령은 현지 사람이 해야 한다. FBI는 그 병목을 피하려고 팜 하나의 노트북 수를 줄이고 팜의 개수를 늘린 정황을 확인했다. 수사는 조력자 적발에서 시작해 네트워크로 확장된다.
- **판단 3 — 목적이 외화벌이에서 데이터 탈취·갈취·협박으로 넓어지고 있다.** 해고 후 내부 자료 공개를 빌미로 일시금을 요구하고, 전 관리자와 가족에 대한 살해 협박, 조력자를 보낸 대면 협박까지 FBI가 관찰했다.
- **판단 4 — 미국 단속이 강화될수록 유럽·아시아로 무대가 옮겨간다.** 한국·일본 기업도 원격 채용을 하는 한 같은 위험에 노출된다.

## 사건 개요와 범행 구조

노트북 팜은 피해 기업이 지급한 업무용 노트북을 미국 내 조력자 자택에 모아 두고, 해외의 북한 IT 인력이 이를 원격 조종하게 만든 위장 거점이다. 기업 입장에서는 미국에 사는 직원이 미국 IP로 접속해 일하는 것처럼 보인다.

![북한 IT 인력의 해외 거점 도용·위장 취업 흐름도](https://vibequant.cc/og/dprk-laptop-farm-flow-20261015.jpg)

*북한 IT 인력이 해외 거점을 통해 위장 취업한 뒤, 가짜 경력을 만들어 금융·기업 시스템에 접근하는 구조.*

위쪽 흐름(① ~ ④)이 위장 취업, 아래쪽 흐름(⑤ ~ ⑦)이 급여 세탁이다. 두 흐름 모두 미국 내 조력자를 거쳐야 한다. 조력자는 여전히 병목이지만, 단일 실패 지점으로 남아 있지는 않다. FBI는 2026년 10월 PSA에서, 단속을 피하려고 노트북 수를 줄인 팜을 더 많이 두는 쪽으로 이미 바뀌었다고 밝혔다.

FBI가 본 운영 단위는 군 연령대 남성 십여 명의 팀이다. 팀장은 소속 기관의 상위 관리자에게 보고하고, 이런 팀이 수십 개다. 수익의 85–90%는 북한 정부로 들어가며, 핵무기와 그 밖의 군사 프로그램에 쓰인다. 인력을 굴리는 기관은 하나가 아니다. 최대 운영 주체는 노동당 중앙위원회 군수공업부(무기 연구·개발·조달·생산)로 추정되고, 정찰총국과 핵 프로그램 관련 기관도 따로 돌린다.

CrowdStrike는 노트북 팜이 해외에서 동시에 풀 수 없는 세 가지를 대신한다고 정리했다. 지급 장비를 받아 원격접속이 되게 세팅하는 물리적 거점, 미국 주소와 신원으로 위치 통제와 본인확인을 통과하는 법적 외피, 급여를 받아 빼내는 금융 창구다. 조력자는 빌린 미국의 발자국이다.

장비를 그 발자국으로 보내는 과정도 확인됐다. 노트북을 도난당했다고 허위 신고해 교체품을 팜 주소로 받게 하거나, 배송 중에 이사했다고 주장해 목적지를 바꾼다. 거주지를 돌려 쓰고, IT 인력 파견사를 끼우면 최종 고객의 장비가 파견사 모르게 팜으로 간다. 2026년 5월부터는 캡처 카드를 웹캠처럼 보이게 장치 식별값을 위장하고, 그 위장 장치를 여러 피해 조직에서 재사용했다. 팜 네트워크는 동시에 여러 가짜 인물의 식별값을 공유한다.

## 주요 특징 (TTP 분석)

이 수법의 본질은 각 레이어가 따로 보면 모두 정상 업무라는 점이다. 채용팀, IT팀, 재무팀이 각자 보는 단면에서는 이상 징후가 잘 드러나지 않는다.

| 레이어 | 공격자가 하는 일 | 왜 기존 통제를 통과하는가 |
| --- | --- | --- |
| 신원 | 도용·위조된 미국인 신분증, 조력자 명의 대여, 가짜 포트폴리오·LinkedIn | 서류 심사와 화상 면접만으로는 실제 인물 여부 확인이 어렵다 |
| 물류 | 기업이 보낸 노트북을 조력자가 자택에서 수령 | 배송지가 미국 주소이므로 정상 직원으로 처리된다 |
| 접속 | KVM-over-IP(TinyPilot, PiKVM, GL.iNet 등), 원격접속·RMM, VPN·프록시. 캡처 카드를 웹캠으로 위장 | 기업 VPN 로그상 접속지가 미국 가정집으로 찍힌다 |
| 금융 | 조력자 계좌·페이퍼컴퍼니로 급여 수령 후 해외 결제 플랫폼으로 이체 | 급여는 미국 은행 계좌로 정상 지급된다 |
| 인력 운용 | 1명이 여러 회사에 동시 취업, 업무를 제3국인에게 재하청 | 각 회사는 다른 회사의 고용 사실을 모른다 |

- **조력자에게 맡기는 일이 노트북 보관에 그치지 않는다.** FBI PSA(I-101326-PSA, 2026-10-13)는 탐지와 단속이 세지자 조력자 사용이 늘었다고 밝혔다. 확인된 범위는 면접·회의 대역, 가짜 신원 확인, 소셜·채용 계정 대여, 택배, 소변 검사와 지문 제출, 자택에서 업무 장비의 인터넷 연결 유지다. 경제적 압박을 받는 미국인을 골라 모집한다. 구인 사이트에는 단순 부업처럼 올리고, 중국·동아시아인으로서 잠시 미국 거점이 필요하다거나 우크라이나 전쟁으로 피난 온 동유럽인이라는 이야기를 붙인다. 알고 한 사람과 모르고 한 사람이 섞여 있으며, 어느 쪽이든 위법이다.
- **업무 재하청.** 서구 기업에 들어간 뒤 급여의 일부만 주고 파키스탄·인도·나이지리아 등 프리랜서에게 지원서와 면접, 실무를 넘긴다. 피해자 쪽에서는 북한 개입이 잘 안 보인다. FBI는 국가 조직과 전국 단위 기술 인력을 이 채용 사기에 넣는 나라는 북한뿐이라고 본다.
- **폭력과 갈취.** 해고 뒤 전 관리자와 가족에게 살해 협박을 해 추가 금전을 요구하고, 내부 자료 공개와 평판 훼손으로 일시금을 압박한다. 미국 조력자를 시켜 피해 회사나 팜 운영자의 집에 직접 나타나게 한 경우도 있다. 생명 위협은 911이다.
- **보안 인가와 현역.** 인가가 필요한 방산·정부 계약 자리를 노리고, 현역 미군에게 노트북 보관을 요청한다. 채용 전에 신원조회 업체의 계정으로 도용 신원이 배경조사를 통과하는지를 미리 확인하기도 한다. 배경조사를 통과했다는 사실만으로는 신원이 맞지 않는다.
- **관리자 계층의 존재.** 왕씨 형제 사건에서 커자 왕은 중국 선양·단둥을 방문해 해외 측과 협의한 뒤 미국 내 관리자로서 최소 5명의 조력자를 감독했다. 노트북 팜은 개인 부업이 아니라 위계가 있는 조직이다.
- **데이터 탈취로의 전이.** 같은 사건에서 해외 공모자가 AI 기반 장비를 개발하는 캘리포니아 방산업체의 노트북에 무단 접속해 ITAR 통제 기술자료를 빼냈다. 외화벌이 인력이 언제든 정보 수집 인력으로 전환될 수 있다는 뜻이다.

## 규모와 배후

FBI는 서구 기업에 들어가는 국가 통제 IT 인력을 수천 명으로 본다. 프로그램 전체 수익은 2024년 한 해 8억 달러 이상으로 추산되며, 개별 사건은 수백만~수천만 달러 규모다. 큰 숫자는 수많은 작은 노트북 팜이 합쳐진 결과다.

| 항목 | 내용 | 출처 |
| --- | --- | --- |
| 연간 수익 추정 | 2024년 8억 달러 이상 (텍사스 북부지검장 Ryan Raybould 기자회견 발언) | [Yahoo/NBC DFW](https://www.yahoo.com/news/us/articles/more-100-laptops-linked-north-185301708.html) |
| 상납 비율 | 발생 수익의 85–90%가 북한 정부로. 핵무기와 그 밖의 군사 프로그램 포함 | [FBI IC3 PSA](https://www.ic3.gov/PSA/2026/PSA261013) |
| 1인당 수입 | 개인당 연 최대 30만 달러, 총합 연 수억 달러 (2022년 5월 미 정부 합동 권고) | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) |
| 운영 주체 | 최대 규모는 노동당 중앙위원회 군수공업부로 추정. 정찰총국과 핵 프로그램 관련 기관도 별도 운용. 팀은 군 연령대 남성 십여 명, 이런 팀이 수십 개 | [FBI IC3 PSA](https://www.ic3.gov/PSA/2026/PSA261013) |
| 위협 행위자 명칭 | 이번 해체 대상 팜은 CrowdStrike의 FAMOUS CHOLLIMA. Jasper Sleet·UNC5267은 공개 자료에서 겹쳐 불리지만, 이 두 원문은 동일 집단으로 단정하지 않는다 | [CrowdStrike](https://www.crowdstrike.com/en-us/blog/fbi-disrupts-famous-chollima-operation-with-crowdstrike-assistance) |
| 피해 업종 | DOJ 기소 기준: 헬스케어, 통신, 사이버 지원, 리테일, 제조, 방산. CrowdStrike가 이번 클러스터에서 본 수십 곳: 항공우주, 에너지, 금융, 헬스케어, 사이버보안, 방산 엔지니어링, 정부 기술, 소비자 기술 | [DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker), [CrowdStrike](https://www.crowdstrike.com/en-us/blog/fbi-disrupts-famous-chollima-operation-with-crowdstrike-assistance) |

원문 초안의 "미 재무부 추산, 2024 회계연도 약 8억 달러"는 이번에 연 원문에서는 연방검사장의 발언으로 확인됐다. 재무부 자료 원문을 인용하려면 별도 확인이 필요하다.

## 주요 적발·처벌 사례

선고가 끝난 조력자만 봐도 수위는 갈린다. 왕씨 형제와 채프먼은 징역 7~9년이고, 정부 계약까지 이어진 메릴랜드 봉 사건은 15개월이다. 단속의 형태는 개별 기소에서, 여러 거점을 같은 주에 수색하는 쪽으로 커지고 있다.

| 발표일 | 사건 | 핵심 사실 | 결과 |
| --- | --- | --- | --- |
| 2026-10-13 | [Operation Lonestar Roundup + 오하이오 기소](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker) | 9월 21-25일 텍사스 40곳 이상 주거지 수색, 노트북·KVM 약 187대 압수 (100대 이상 북텍사스). 별건 오하이오 기소: 2019-2025년 7월, 70곳 이상 기업, 수익 약 300만 달러 | 14명 기소(중국 거주 10명 실명, 2명 봉인), 미국인 조력자 2명 체포. 텍사스 수색 건은 아직 체포 없음 |
| 2026-04-15 | [커자 왕·전싱 왕 형제](https://www.justice.gov/opa/pr/two-us-nationals-sentenced-facilitating-fraudulent-remote-information-technology-worker) | 2021~2024년 10월, 미국인 80명 이상 신분 도용, 100곳 이상 기업 취업, 북한 수익 500만 달러 이상. 방산업체 ITAR 자료 유출 | 징역 108개월(9년), 92개월(7년 8개월). 공범 8명 도주, 국무부 최대 500만 달러 현상금 |
| 2025-12-04 | [민 프엉 응옥 봉 (메릴랜드)](https://www.justice.gov/opa/pr/maryland-man-sentenced-conspiracy-commit-wire-fraud) | 2021–2024년, 미국 기업 13곳 이상, 급여 97만 달러 이상. 본인 여권으로 면접을 통과한 뒤 노트북에 원격접속을 열어, 선양의 외국인(존 도, 북한 국적 추정)이 업무를 수행. 버지니아 업체를 통해 FAA 계약 시스템에 접근 | 징역 15개월, 보호관찰 3년. FBI 볼티모어. 2024년 3월 시작된 Domestic Enabler Initiative 선상 |
| 2025-07-24 | [크리스티나 채프먼 (애리조나)](https://www.justice.gov/opa/pr/arizona-woman-sentenced-17m-information-technology-worker-fraud-scheme-generated-revenue) | 68명 신분 도용, 미국 기업 309곳 + 해외 2곳 피해, 수익 1,700만 달러 이상. 자택에서 노트북 90대 이상 압수, 49대는 북한 접경 중국 도시 등 해외로 발송 | 징역 102개월(8년 6개월) |

**원문 초안 대비 정정 사항**

- 텍사스 사건에서 "조력자 2명 체포, 중국 총책 등 10여 명 기소"는 실제로는 **오하이오 북부지검의 별건 기소**다. 같은 날 함께 발표됐지만 텍사스 수색 자체에서는 체포가 없었고, 지검장은 거점 운영자 기소가 뒤따를 것이라고 예고했다.
- 채프먼 사건 피해 기업으로 "나이키"가 언급되지만, DOJ 보도자료는 회사명을 밝히지 않고 "TV 방송사, 실리콘밸리 기술기업, 항공우주 제조사, 미국 자동차 회사, 명품 리테일" 등으로만 표현한다. 리포트에서는 실명 인용을 피하는 편이 안전하다.
- 노트북 수: 텍사스는 "187대"(DOJ), 채프먼 자택은 "90대 이상"(DOJ)이 정확한 표현이다.

## 수사 상태

2026년 10월 13일에 나온 것은 기소 한 건이 아니다. 법무부 발표는 두 사건이고, CrowdStrike 글은 그중 팜 해체를 자기 쪽에서 설명한 것이다. 숫자를 더해 읽으면 안 된다.

1. **텍사스 수색.** Operation Lonestar Roundup. 9월 21–25일, 주거지 40곳 이상, 노트북·KVM 약 187대. 이 수색만 놓고 보면 체포가 없다. 북텍사스 지검장은 거점 운영자 기소가 뒤따를 것이라고 했다.
2. **오하이오 별건 기소.** 같은 날 발표됐지만 텍사스 수색과 사건이 다르다. 14명 기소, 미국인 조력자 2명 체포, 2019–2025년 7월, 기업 70곳 이상, 약 300만 달러.
3. **CrowdStrike가 본 같은 시기의 해체.** Counter Adversary Operations는 2025년 4월부터 2026년 6월까지 페르소나, 기술 지표, 미국 내 컴퓨터를 식별한 뒤, 2026년 9월 하순 FBI와 함께 FAMOUS CHOLLIMA 노트북 팜을 해체했다. 글은 장소를 "미국 여러 곳"이라고만 하고 187대나 텍사스를 적지 않는다. 그래서 이 문장을 텍사스 수색과 별개의 두 번째 압수수색으로 세면 안 된다. 이 클러스터에서 CrowdStrike가 본 피해 조직은 수십 곳이고, 업종은 항공우주·에너지·금융·헬스케어·사이버보안·방산 엔지니어링·정부 기술·소비자 기술로 한 산업에 몰려 있지 않다. 평가는 이렇다. 미국 내 인프라 해체의 시작이지만, 효과는 팜이 걷힌 지역에 한정되고 오래가지 않는다. 상대는 방법을 바꿀 것이다. 작전은 끝나지 않았다.

같은 날 FBI PSA(I-101326-PSA)는 기소문이 아니라 전술 갱신이다. 조력자 사용의 확대, 팜의 소형·분산, 남아시아·서아프리카 재하청, 자료 갈취와 살해 협박, 인가 대상과 현역 군인에 대한 노트북 보관 시도를 적는다.

제도의 시작점은 더 앞이다. 법무부 국가안보부와 FBI는 2024년 3월 DPRK RevGen: Domestic Enabler Initiative를 열어, 미국 내 노트북 팜을 닫고 그 호스트를 기소하는 일을 우선순위로 뒀다. 2025년 1월과 6월에 선행 조치가 있었고, 12월 4일 메릴랜드 봉 선고가 그 선에 있다. 봉은 자신의 여권으로 면접을 통과한 뒤 원격접속을 열어 주었고, 그 경로로 선양의 공모자가 FAA 계약 업무에 쓰이는 시스템에 들어갔다. 신분증 확인을 통과했다는 것이 작업자가 같다는 뜻은 아니다.

2026년 10월 15일 기준으로, 텍사스 수색 대상은 미체포, 오하이오 조력자 2명은 체포, 왕씨 형제와 채프먼·봉은 선고가 끝났다. 중국에 있는 실무자 다수는 기소만 된 상태다.

## 탐지 지표와 헌팅 포인트

단일 지표로는 잡히지 않으므로 채용·엔드포인트·네트워크·급여 신호를 한 사람 기준으로 엮어 보는 것이 핵심이다. 아래는 공개 권고와 사례에서 반복되는 신호를 정리한 것이다.

| 영역 | 의심 신호 | 확인 위치 |
| --- | --- | --- |
| 채용 | 화상 면접에서 얼굴과 신분증 불일치, 이력서·프로필 문구의 재사용, 다른 의심 인물을 레퍼런스로 연결. 구인 사이트의 단순 부업(면접 대역, 자택 노트북 보관). 파견 계약인데 실작업자를 확인하지 않음 | ATS, 면접 녹화, 레퍼런스, 파견 계약 |
| 물류 | 등록 주소와 다른 배송지, 입사 직후 주소 변경, 도난·분실을 이유로 한 교체 장비, 배송 중 긴급 이사, 같은 주거지로 여러 직원 장비 | IT 자산관리, 택배 기록 |
| 엔드포인트 | 비승인 원격 SW(AnyDesk, TeamViewer, RustDesk, Chrome Remote Desktop, Splashtop, RMM), KVM-over-IP, 역할과 무관한 OBS Studio·VDO.Ninja·Homebrew. 캡처 카드가 웹캠으로 잡히거나 같은 장치 식별값이 여러 회사·계정에서 반복 | EDR, USB·HID 장치 로그 |
| 네트워크 | 미국 주거용 IP인데 근무 시간이 아시아 시간대, 여러 직원 계정이 같은 공인 IP, Astrill 등 상용 VPN·프록시 | IdP·VPN 로그, 시간대 분석 |
| 급여·재무 | 입사 직후 급여 계좌 변경, 계좌·주소·연락처를 자주 교체, 가상계좌를 여러 개 만들고 암호자산 전환이 쉬운 은행, 한 계좌에 여러 직원 급여 | 급여 시스템, 은행 |
| 행동 | 영상회의 회피, 성과가 여러 사람 몫, 화면 녹화 파일의 반출, 해고 직후 데이터 공개 협박이나 관리자·가족에 대한 위해 위협 | HR, DLP |

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

DOJ는 이 계정들을 채용 시스템의 차단 지표에 추가하라고 권고했다. 다만 일회성 계정이 많아 수명이 짧다. 지원자 이메일 대조용으로만 쓰고, 판단은 여러 약한 신호를 겹쳐 본다. FBI는 이를 identity in depth라고 부른다. 이름 차단 목록만으로 거르면 쉽게 우회되고, 신분 도용 피해자인 정상 지원자까지 떨어뜨린다. 통제를 세게 걸수록 오탐이 정상 원격 근무자를 해칠 수 있으므로, 신호는 모으고 조치는 사람이 검토한다.

## 시사점과 전망

단속은 노트북 팜을 없애기보다 형태를 바꾸게 만든다. CrowdStrike는 이번 해체가 미국 내 인프라를 걷어내는 시작이라고 보면서도, 효과는 팜이 있던 지역에 그치고 오래가지 않을 것이라고 보았다. 상대는 재건하고, 방법을 바꿀 것이다.

1. **채용은 이제 보안 통제 지점이다.** 공격자는 취약점이 아니라 HR 프로세스를 이용한다. 원격 채용 신원확인을 IT 보안 정책의 일부로 다뤄야 하며, 인사팀은 사실상 1차 방어선이다. 봉 사건이 보여 주듯, 여권과 배경조사를 통과해도 일하는 사람은 다른 사람일 수 있다.
2. **조력자 모집과 팜의 분산은 이미 진행 중이다.** FBI는 탐지가 세지자 미국인 조력자를 더 많은 역할로 쓰고, 업무를 남아시아·서아프리카 프리랜서에게 넘기며, 팜 하나의 노트북 수를 줄이는 대신 팜의 수를 늘렸다고 밝혔다. 구인 사이트에는 면접 대역이나 노트북 보관 같은 부업으로 올라온다. 앞으로의 추정이 아니라 2026년 10월에 확인된 적응이다.
3. **외화벌이 → 정보수집 → 갈취·협박의 전환이 쉽다.** 같은 인력이 급여를 받다가 ITAR 자료를 빼내고, 해고되면 탈취 데이터로 금전을 요구한다. FBI는 살해 협박과 대면 협박까지 보았다. 노출된 순간 급여 사기가 아니라 침해 사고이고, 사람이 위협받으면 수사기관과 911이다.
4. **AI가 진입 장벽을 낮춘다 (분석적 판단).** 이력서·자기소개·코딩 과제는 생성형 AI로, 화상 면접은 실시간 얼굴·음성 변조로 보완될 수 있다. 1인이 여러 회사 업무를 동시에 처리하는 생산성도 AI로 올라간다. 이는 공개 사건 기록이 아닌 추세 판단이다.
5. **무대가 미국 밖으로 넓어진다 (분석적 판단).** 미국의 단속·처벌이 강해질수록 신원확인이 느슨한 국가와 업종으로 이동할 유인이 커진다. 한미 양국은 2023년 10월 이미 공동 권고를 냈다.
6. **한국 기업에 주는 함의.** 원격 개발자를 해외 플랫폼으로 채용하는 블록체인·웹3, 게임, 스타트업이 특히 취약하다. 한국은 "북한이 한국인으로 위장"하기 어렵다는 통념이 있지만, 해외 국적 프리랜서로 위장하면 그 통념은 통하지 않는다. 또 한국 기업이 미국 자회사·미국 고객사와 거래한다면 북한 인력 고용 자체가 미국 제재 위반 리스크로 이어질 수 있다.

## 권고 사항

가장 효과가 큰 통제는 "장비를 받는 사람과 일하는 사람이 같은지"를 입사 시점과 근무 중에 반복 확인하는 것이다.

| 조직 | 권고 |
| --- | --- |
| 인사·채용 | 최종 면접은 대면 또는 신분증을 들고 하는 라이브 영상으로 진행하고, 그 얼굴이 이후 일하는 사람과 같은지 입사 뒤에도 다시 본다. 미국 채용은 E-Verify와 복수 신분증. 레퍼런스는 지원자가 준 번호가 아닌 공식 경로. 이름 차단 목록만으로 탈락시키지 않는다 |
| IT·보안 | 장비는 등록 주소로만 배송하고, 분실 교체와 배송 중 주소 변경은 별도 승인. 파견 인력의 장비가 실제 어디에 있는지를 고객사가 확인. 비승인 원격접속 SW, KVM, 웹캠으로 잡힌 캡처 카드를 탐지. 신규 입사자 90일간 IP·시간대·공유 장치 식별값 모니터링 |
| 재무·급여 | 급여 계좌 변경 시 재인증. 한 계좌·한 주소·자주 바뀌는 계좌에 여러 직원이 묶이는지 정기 대조 |
| 법무·경영 | 의심 시 즉시 해고보다 증거 보전과 신고를 먼저 한다. 해고 직후 데이터 갈취와 위해 협박이 뒤따른다. 외주·재하청 계약에 실제 작업자 확인 조항. 관할 FBI와 IC3(ic3.gov)에 장비 수령 주소, 계정, 화면 자료를 넘긴다 |
| 위협 인텔리전스 | DOJ·FBI 공개 IOC는 채용 대조에만 쓰고, 시간대·공유 IP·공유 장치처럼 수명이 긴 신호로 판단한다. 단일 지표로 자동 차단하지 않는다 |

## 출처

- [DOJ, Justice Department Announces Coordinated Actions to Combat North Korean Remote IT Worker Schemes (2026-10-13)](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-actions-combat-north-korean-remote-it-worker)
- [DOJ, Two U.S. Nationals Sentenced for Facilitating Fraudulent Remote IT Worker Scheme (2026-04-15)](https://www.justice.gov/opa/pr/two-us-nationals-sentenced-facilitating-fraudulent-remote-information-technology-worker)
- [DOJ, Arizona Woman Sentenced for $17M IT Worker Fraud Scheme (2025-07-24)](https://www.justice.gov/opa/pr/arizona-woman-sentenced-17m-information-technology-worker-fraud-scheme-generated-revenue)
- [FBI IC3, North Korean IT Workers Expanding Use of Facilitators, Broadening Recruitment, PSA I-101326-PSA (2026-10-13)](https://www.ic3.gov/PSA/2026/PSA261013)
- [CrowdStrike, U.S. Government Disrupts FAMOUS CHOLLIMA Operation with CrowdStrike Assistance (2026-10-13)](https://www.crowdstrike.com/en-us/blog/fbi-disrupts-famous-chollima-operation-with-crowdstrike-assistance)
- [DOJ, Maryland Man Sentenced for Conspiracy to Commit Wire Fraud (2025-12-04)](https://www.justice.gov/opa/pr/maryland-man-sentenced-conspiracy-commit-wire-fraud)
- [Yahoo/NBC DFW, More than 100 laptops linked to North Korea seized in North Texas](https://www.yahoo.com/news/us/articles/more-100-laptops-linked-north-185301708.html)
- [CBS Texas, North Texas federal officials promise indictments](https://www.cbsnews.com/texas/news/fbi-us-attorney-press-conference-10-13-2026/)
- [BleepingComputer, FBI raids DPRK IT worker laptop farms in Texas](https://www.bleepingcomputer.com/news/security/fbi-raids-dprk-it-worker-laptop-farms-in-texas-us-nationals-arrested/)

FBI PSA와 CrowdStrike 블로그는 2026-10-15에 본문을 열어 DOJ 보도자료와 대조했다. 8억 달러 수치는 여전히 연방검사장 기자회견 인용이고, 재무부 원문은 확인하지 않았다.
