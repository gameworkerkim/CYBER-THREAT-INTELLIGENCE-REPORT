---
title: "신뢰 인프라 침투 — AI 개발 생태계·협업 플랫폼·클라우드 ML 파이프라인을 노린 4대 위협 (2026.06.16~18)"
document_id: CTI-2026-0618-AISUPPLY
analyst: "Dennis Kim (HoKwang Kim, 김호광)"
affiliation: "CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure MVP"
email: gameworker@gmail.com
github: github.com/gameworkerkim
date: 2026-06-18
tlp: CLEAR
language: ko
---

# 신뢰 인프라 침투 (Trust Infrastructure Compromise)

## AI 개발 생태계·협업 플랫폼·클라우드 ML 파이프라인을 노린 4대 위협

**문서 ID:** CTI-2026-0618-AISUPPLY
**발행일:** 2026년 6월 18일
**분석가:** Dennis Kim (김호광 / HoKwang Kim) — CEO, Betalabs Inc. / Independent CTI Analyst / Microsoft Azure ex-MVP
**TLP:** CLEAR
**보고 기간:** 2026년 6월 16일 ~ 18일

---

## Executive Summary (요약)

본 보고서는 2026년 6월 16일부터 18일 사이 글로벌 보안 연구 기관(Aikido Security, ESET, Broadcom Symantec, Palo Alto Networks Unit 42)이 공개했으나 **한국 주요 언론에는 거의 보도되지 않은 4건의 위협**을 한국 사이버 위협 인텔리전스(CTI) 관점에서 통합·재구성한 것이다.

네 사건은 표면적으로 서로 다른 표적(개발자 IDE, 정부 기관, 기업 협업 인프라, 클라우드 ML 플랫폼)을 노리지만, **하나의 공통된 패러다임으로 수렴한다 — 공격자가 더 이상 보안 경계의 "외부"에서 침투하지 않고, 조직이 이미 신뢰하는 합법 인프라(JetBrains 마켓플레이스, Microsoft Teams 릴레이, Google Cloud 버킷, 정상 서명 드라이버) 자체를 무기화한다는 점이다.** 이 "신뢰 인프라 침투(Trust Infrastructure Compromise)" 패러다임은 IP 평판·도메인 차단·시그니처 기반 탐지를 구조적으로 무력화한다.

이제 해킹 트랜드는 신뢰된 플랫폼의 인증을 우회하거나 실수로 우회하도록 만들고 있다.

### 핵심 결론 (Key Judgments)

| # | 핵심 판단 | 신뢰도 |
|---|---|---|
| KJ-1 | AI 개발 도구 생태계(IDE 플러그인, 브라우저 확장)가 자격증명 탈취의 신규 1차 공급망 벡터로 부상했다. 표적은 소스코드가 아니라 **AI provider API 키 자체**이며, 이는 직접적 금전 가치를 가진다. | High |
| KJ-2 | 중국 연계 행위자(FishMonger/I-SOON)가 기존 Linux 전용 도구를 Windows로 이식하며 커널 드라이버 기반 은닉을 추가, 정부 표적에 대한 크로스플랫폼 첩보 능력을 확장했다. | High |
| KJ-3 | 랜섬웨어 그룹이 처음으로 Microsoft Teams TURN 릴레이를 C2 채널로 실전 악용했다. 이는 "합법 클라우드 트래픽 위장" 전술의 성숙을 의미하며 네트워크 모니터링 단독 방어를 무력화한다. | High |
| KJ-4 | 클라우드 ML 파이프라인의 예측 가능한 버킷 명명 규칙이 무인증 크로스테넌트 코드 실행으로 이어지는 구조적 취약점이 반복 확인됐다(올해 두 번째). | Medium-High |
| KJ-5 | 네 사건 모두 한국의 AI 개발 조직, Web3 인프라, 공공기관에 직접적 또는 잠재적 영향을 미치며, 특히 "데이터 탈취"가 아닌 "신뢰 채널 악용"이라는 새로운 위협 모델링이 시급하다. | Medium-High |

### 위협 평가 요약 (Threat Assessment Overview)

| 사건 | 표적 | 귀속 | 정교성 | 한국 영향도 |
|---|---|---|---|---|
| **A. JetBrains 악성 AI 플러그인** | 개발자 IDE / AI API 키 | 미귀속 (재정 동기) | 중상 | **높음** |
| **B. SprySOCKS Windows 변종** | 정부 기관 | FishMonger (중국 연계, I-SOON) | 최상위 | **중간** |
| **C. DragonForce Backdoor.Turn** | 기업 (매출 $15M 이상) | DragonForce RaaS (Scattered Spider 연계) | 최상위 | **높음** |
| **D. Google Vertex AI "Pickle in the Middle"** | 클라우드 ML 파이프라인 | PoC 단계 (Unit 42 연구) | 중상 | **중간** |

---

## 1. 사건 A — JetBrains 마켓플레이스 악성 AI 플러그인 15종

### 1.1 개요

2026년 6월 16~17일, 코드 보안 기업 **Aikido Security**가 JetBrains Marketplace에서 동작하는 악성 IDE 플러그인 15종으로 구성된 조직적 멀웨어 캠페인을 공개했다. 이들 플러그인은 7개의 서로 다른 판매자 계정으로 게시되었으며, 누적 다운로드 수는 약 7만 건에 달한다. Aikido의 발견은 BleepingComputer가 독립적으로 코드 분석을 통해 검증했다.

### 1.2 기술 분석

플러그인들은 DeepSeek, OpenAI, SiliconFlow 등 주요 LLM 기반의 AI 코딩 어시스턴트로 위장하며, 채팅·커밋 메시지 생성·코드 리뷰·버그 탐지·유닛 테스트 등 광고된 기능을 **실제로 정상 수행한다.** 바로 이 정상 동작이 위협의 핵심이다.

| 항목 | 내용 |
|---|---|
| **공격 벡터** | IDE 플러그인 (소프트웨어 공급망) |
| **탈취 대상** | OpenAI / DeepSeek / SiliconFlow API 키 (평문) |
| **트리거** | 사용자가 설정 패널에 API 키 입력 후 "Apply" 클릭 시점 — 별도 권한 요청·동의 화면·UI 표시 없음 |
| **유출 방식** | save() 핸들러가 키 저장과 동시에 하드코딩된 C2 서버로 전송. **비암호화 HTTP** 사용 |
| **C2 서버** | `39.107.60[.]51` (하드코딩) |
| **최초 게시** | 2025년 10월 말 |
| **최신 변종** | 2026년 6월 10일 |
| **최다 다운로드** | DeepSeek AI Assist (27,727), CodeGPT AI Assistant (25,571) |

15개 플러그인은 거의 동일한 코드베이스를 이름과 패키징만 바꿔 재배포한 것이며, 가짜 별 5개 리뷰로 신뢰도를 위장했다. 더 주목할 점은 **2단계 수익화 모델**이다. Aikido에 따르면 운용자는 무료 사용자에게서 탈취한 API 키를 유료 고객에게 재판매하여, 정상 키 소유자가 사용 비용을 떠안는 동안 양쪽에서 모두 수익을 창출한다.

### 1.3 위협 평가

IDE는 샌드박스 없이 사용자 전체 권한으로 실행되며, 소스코드·클라우드 자격증명·서명 키, 그리고 이제 AI 서비스 자격증명을 보유한다. JetBrains가 수동 플러그인 검토를 수행함에도 정상 기능 내부에 난독화되어 묻힌 악성 로직은 탐지를 회피했다. Sophos 침해 사고 통계에 따르면 랜섬웨어 피해 조직의 66.5%가 신원 침해를 후속 랜섬웨어 실행의 핵심 메커니즘으로 지목하여, 로컬 자격증명 탈취가 횡적 이동의 진입점이 됨을 시사한다.

> LLM은 엑셀이지 오라클이 아니다. 마찬가지로 AI 코딩 플러그인은 신뢰할 수 있는 동료가 아니라 "내 권한으로 실행되는 의존성(dependency)"이다. 키를 붙여넣기 전에 벤더를 검증하지 않으면, 그 키는 곧 공격자의 자산이 된다.

---

## 2. 사건 B — SprySOCKS Windows 변종 (FishMonger)

### 2.1 개요

2026년 6월 16일, **ESET**는 그동안 Linux 전용으로 알려졌던 백도어 **SprySOCKS**의 미공개 Windows 변종 2종(`WIN_DRV`, `WIN_PLUS`)을 발견했다고 공개했다. ESET는 이를 중국 연계 위협 그룹 **FishMonger**(Earth Lusca, Aquatic Panda, TAG-22, Red Dev 10로도 추적, Winnti 그룹 산하)의 소행으로 **높은 신뢰도**로 귀속했다. FishMonger는 중국 청두 소재 계약업체 **I-SOON**이 운용하는 것으로 추정된다.

### 2.2 기술 분석

ESET 텔레메트리는 2023~2024년 사이 **온두라스, 대만, 태국, 파키스탄**의 정부 기관을 대상으로 한 실제 활동을 보여준다. 두 변종은 SprySOCKS v1.8의 일부로, Linux 원본의 핵심 아키텍처(C&C 프로토콜, 암호화, 명령 처리 로직)를 유지하되 Windows 네이티브 메커니즘으로 대체하고 은닉성을 강화했다.

| 변종 | 실행 기법 | 핵심 특징 |
|---|---|---|
| **WIN_DRV** | 커널 드라이버 기반 | 두 개의 암호화된 커널 드라이버 사용. `DriverLoader`(`fsdiskbit.sys`)가 메모리에 `RawWNPF`(`KW1B5206BDC1743FP.dat`) 로드. 프로세스·네트워크 연결·파일·레지스트리 키 은닉 |
| **WIN_PLUS** | Print Spooler 악용 | `spoolsv.exe`를 기점으로 print processor로 1단계 로더 실행 후 신규 `svchost.exe`에 백도어 인젝션. 상대적으로 단순 |

두 변종 모두 DLL 형태로 **TCP, UDP, WebSocket** 3개 채널로 C2 통신하며 30개 이상의 명령(시스템 정보 수집, 프로세스 열거, 서비스 관리, 파일 관리, SOCKS 프록시, 인터랙티브 셸 등)을 지원한다.

WIN_DRV의 `RawWNPF` 드라이버는 `NtQuerySystemInformation` 시스템 콜을 후킹하여 은닉 프로세스 목록에 일치하는 항목을 출력에서 제거한다. 또한 **TCP 트래픽 우회(diversion)** 기능으로, 백도어의 실제 수신 포트를 노출하지 않고 임의의 TCP 포트로 명령을 전달한다.

### 2.3 핵심 리스크 — 유출 인증서와 UEFI 부트킷 정황

- **유출된 서명 인증서:** `DriverLoader`는 GitHub의 오픈소스 `PastDSE` 프로젝트에서 유출된 디지털 인증서로 서명되어, 일부 구형·오설정 시스템에서 로드가 가능했다. ESET에 따르면 이 인증서는 현재까지 폐기(revoke)되지 않은 것으로 보인다.
- **UEFI 부트킷 정황:** ESET 텔레메트리는 일부 공격 시나리오에서 UEFI 부트킷 컴포넌트가 **CVE-2023-24932**(BlackLotus가 악용한 Secure Boot 우회 결함)를 악용할 가능성을 제한적으로 시사한다. 단, 강한 증거는 제시되지 않았다.

> 정부·외교·기술·통신 기관을 표적으로 한 국가 연계 행위자가 Linux 도구를 Windows로 이식하며 커널 레벨 은닉을 추가했다는 사실은, 표적의 OS 다양성에 맞춰 무기고를 확장하는 성숙한 작전 운용을 보여준다.

---

## 3. 사건 C — DragonForce "Backdoor.Turn" (Microsoft Teams TURN 릴레이 C2)

### 3.1 개요

2026년 6월 16일, **Broadcom Symantec Threat Hunter Team**은 랜섬웨어 그룹 **DragonForce**가 커스텀 Go 기반 백도어 `Backdoor.Turn`을 사용해 C2 트래픽을 **Microsoft Teams TURN(Traversal Using Relays around NAT) 릴레이 인프라** 내부에 은닉한 사례를 공개했다. 이는 야생에서 TURN 릴레이를 이 방식으로 악용한 **최초의 알려진 멀웨어**다. DragonForce는 2023년부터 활동하며 Scattered Spider 그룹과 연계된 것으로 알려진 RaaS(서비스형 랜섬웨어) 운용 조직으로, 카르텔형 구조로 진화했다.

### 3.2 공격 타임라인 (2025년 12월, 미국 서비스 기업 대상)

| 단계 | 행위 | 기법 (MITRE ATT&CK) |
|---|---|---|
| 1. 초기 침투 | SQL/MSSQL 서버 취약점 악용 | T1190 (Exploit Public-Facing Application) |
| 2. 권한 상승·방어 회피 | BYOVD — Huawei `HWAuidoOs2Ec.sys`(Havoc Process Terminator) 및 ABYSSWORKER(Palo Alto 드라이버 위장) 악용 | T1068, T1211 |
| 3. 지속성 확보 | Limit Blank Password 설정 제거, 신규 계정 생성, 방화벽 규칙 수정 | T1098, T1562 |
| 4. C2 수립 | `Backdoor.Turn`을 정상 `DbgView64.exe`에 인젝션. Teams 익명 방문자 토큰 획득 → 정상 MS TURN 릴레이 경유 → QUIC 세션으로 실제 C2 연결 | T1071, T1572 |
| 5. 정찰·횡적 이동 | LDAP/AD 검색, 자격증명 도용, 브라우저 자격증명 탈취 | T1018, T1003 |
| 6. 영향 | 데이터 유출 후 DragonForce 랜섬웨어 배포·암호화 | T1486 (Data Encrypted for Impact) |

### 3.3 기술적 정교성

`Backdoor.Turn`은 Praetorian이 2025년 Black Hat에서 발표한 "Ghost Calls" 기법(Teams/Zoom의 임시 TURN 자격증명을 탈취해 신뢰된 회의 인프라로 은밀한 터널 생성)에서 영감을 받았다. 핵심은 **방어자가 오직 정상 Teams 서버로 향하는 C2 트래픽만 보게 된다**는 점이다. 도메인 평판·IP 차단 리스트·애플리케이션 계층 검사가 모두 Teams 트래픽을 허용하므로, C2 비콘의 전형적 징후(미지 서버 잦은 연결, 비표준 포트, 자체 서명 인증서)가 사라진다.

주목할 점은 공격자가 침해 당시 **알려지지 않았던** Huawei 드라이버 취약점(Havoc Process Terminator)을 악용했다는 사실이다. 이 취약점은 침해 이후인 2026년 3월에야 Huntress가 문서화했으며, 이는 공격자가 자체 취약점 연구 역량을 보유함을 시사한다. DragonForce는 2023년 6월 이후 누적 579건의 피해를 주장하며, 표적은 연 매출 $15M 이상 조직(제조·건설·IT·헬스케어·소매)에 집중된다.

> 랜섬웨어 그룹이 자체 개발 도구를, 그것도 `Backdoor.Turn` 수준의 정교한 커스텀 도구를 사용하는 것은 이례적이다. "신뢰 채널 위장"이 이제 국가 행위자뿐 아니라 재정 동기 범죄 조직에게도 표준 전술이 되었음을 보여준다.

---

## 4. 사건 D — Google Vertex AI SDK "Pickle in the Middle"

### 4.1 개요

2026년 6월 16일, **Palo Alto Networks Unit 42**는 Google Cloud Vertex AI SDK for Python(`google-cloud-aiplatform`)에서 무인증 크로스테넌트 원격 코드 실행(RCE)으로 이어지는 취약점을 공개했다. 연구진은 이를 **"Pickle in the Middle"**로 명명했으며, Google 버그바운티(VRP)를 통해 보고했다. 야생 악용은 관찰되지 않았으며, Google은 패치를 완료했다.

### 4.2 공격 메커니즘

취약점의 본질은 **예측 가능한 버킷 명명 + 소유권 미검증 + 안전하지 않은 역직렬화**의 결합이다.

| 단계 | 내용 |
|---|---|
| 1. 예측 | 사용자가 `staging_bucket`을 명시하지 않으면 SDK가 프로젝트 ID·리전 기반의 결정적 버킷명(예: `project-vertex-staging-region`)을 자동 생성 |
| 2. 버킷 스쿼팅 | 공격자가 피해자의 프로젝트 ID(흔히 공개됨)만 알면, 자신의 프로젝트에 동일 버킷명을 선점 생성. GCS 버킷명은 전역 고유하므로 피해자 SDK가 공격자 버킷으로 폴백 |
| 3. 모델 가로채기 | 피해자가 모델 업로드 시, 아티팩트가 공격자 버킷에 저장됨 |
| 4. 레이스 컨디션 | 공격자의 Cloud Function이 업로드 즉시 트리거되어 정상 모델을 악성 버전으로 교체. Unit 42 측정상 업로드~Vertex AI 읽기까지 약 **2.5초**, PoC에서 공격자는 **1.4초** 내 교체 |
| 5. RCE | pickle/joblib로 직렬화된 모델이 로드될 때 `__reduce__`를 통해 임의 코드가 Google 서빙 컨테이너 내부에서 실행 |
| 6. 권한 확대 | 페이로드가 서빙 컨테이너 메타데이터 서버에서 OAuth 토큰 탈취. 동일 Google 관리 테넌트 내 타 모델 아티팩트(학습 가중치 포함), BigQuery 메타데이터, 접근 목록, 테넌트 로그, GKE 클러스터명, 내부 컨테이너 이미지 경로 접근 가능 |

### 4.3 패치 및 반복성

| 버전 | 날짜 | 조치 |
|---|---|---|
| v1.144.0 | 2026-03-31 | 버킷명에 무작위 uuid4 추가 (1차 완화) |
| v1.148.0 | 2026-04-15 | `Model.upload()`에 버킷 소유권 검증 추가 (완전 수정) |

공개 시점 기준 Unit 42와 Google 모두 별도 CVE를 부여하지 않았다. 주목할 점은 이것이 **올해 두 번째** 예측 가능 버킷명 결함이라는 사실이다. Google은 2026년 2월 Vertex AI Experiments의 별도 버킷 스쿼팅 결함(**CVE-2026-2473**, 동일하게 크로스테넌트 코드 실행·모델 절도·오염 허용)을 패치한 바 있다.

> 흥미로운 점은 Unit 42가 본 취약점 연구에 LLM을 코드 분석 워크플로우에 통합하여 발견 속도를 높였다는 사실이다. AI는 공격과 방어 양쪽의 가속 레이어로 동시에 작동하고 있다.

---

## 5. 한국 영향 분석 (Korea-Specific Impact)

본 섹션은 요청에 따라 네 사건이 한국 환경에 미치는 직접·잠재 영향을 별도로 분석한다.

### 5.1 사건 A (JetBrains) — 한국 영향: **높음**

- 한국은 IntelliJ IDEA, PyCharm, WebStorm 등 JetBrains IDE 사용 비중이 매우 높은 개발자 시장이다. 특히 스타트업·핀테크·게임 업계의 코틀린/자바/파이썬 개발 환경에 깊이 자리잡고 있다.
- Claude Code, Cursor, ChatGPT 등 AI 코딩 도구를 적극 도입하는 국내 개발 조직에서 OpenAI·Anthropic·DeepSeek API 키를 IDE 플러그인에 입력하는 워크플로우가 일반화되어, **키 탈취 → 무단 과금 → 계정 침해**의 직접 피해 경로가 존재한다.
- 비영어권 마켓플레이스 검색 특성상 "DeepSeek", "AI Assist" 등 일반명 플러그인을 충분한 검증 없이 설치하는 관행이 위험을 가중한다.

### 5.2 사건 B (SprySOCKS) — 한국 영향: **중간**

- 직접 표적국(온두라스·대만·태국·파키스탄)에 한국은 포함되지 않았으나, FishMonger/I-SOON 계열은 과거 한국을 포함한 동아시아 정부·대학·기술 기업을 광범위하게 표적해 온 이력이 있다.
- 외교·통일·국방·반도체·통신 등 중국 연계 첩보 우선순위에 해당하는 한국 기관은 동일 TTP(공개 서버 N-day 악용 → 커널 드라이버 은닉 → 장기 잠복)에 노출될 수 있다.
- 유출 인증서(`PastDSE`)로 서명된 드라이버가 미폐기 상태라는 점은, 구형·오설정 Windows 서버를 운용하는 한국 공공·연구 기관에 즉각적 점검 사유가 된다.

### 5.3 사건 C (DragonForce) — 한국 영향: **높음**

- Microsoft Teams는 국내 대기업·중견기업·다수 공공기관의 표준 협업 도구로, Teams 도메인·IP 대역은 거의 예외 없이 화이트리스트에 등록되어 있다. **이는 곧 한국 조직의 네트워크 방어 체계가 Backdoor.Turn류 트래픽을 구조적으로 통과시킨다는 의미다.**
- DragonForce의 표적 기준(연 매출 $15M 이상)에 다수 한국 중견·대기업이 부합한다. 제조·건설·IT 서비스 중심 표적군은 한국 산업 구조와 높은 중첩도를 가진다.
- 기존 한국 보안 운영의 핵심인 네트워크 트래픽 모니터링·도메인 평판 기반 차단이 단독으로는 무력하며, **행위 기반(behavioral) 탐지로의 전환**이 시급하다.

### 5.4 사건 D (Vertex AI) — 한국 영향: **중간**

- GCP Vertex AI를 ML 서빙 기반으로 채택한 국내 AI 스타트업, 금융·헬스케어·커머스 기업의 모델 공급망에 잠재 리스크가 있다.
- 한국 기업의 GCP 프로젝트 ID는 공개 리포지토리·CI 로그·문서에서 노출되는 경우가 많아, 버킷 스쿼팅의 전제 조건이 충족되기 쉽다.
- 패치(v1.148.0)는 클라이언트 SDK 측에 존재하므로, 프로덕션뿐 아니라 **노트북·CI 작업·학습 파이프라인 전반의 SDK 버전 점검**이 필요하다.

---

## 6. 한국 Web3 산업 영향 분석 (Korea Web3 Impact)

요청에 따라 Web3·블록체인 산업에 특화된 영향을 별도 분석한다. Web3는 자격증명과 코드 무결성이 곧 자산 통제권으로 직결되는 특수성 때문에 본 4대 위협에 특히 취약하다.

| 사건 | Web3 영향 경로 | 심각도 |
|---|---|---|
| **A. JetBrains 플러그인** | Solidity/Rust/Move 스마트컨트랙트 개발자가 IDE에 입력하는 것은 AI 키만이 아니다. 동일 IDE 환경에 RPC 엔드포인트 키, 배포용 지갑 프라이빗 키, Infura/Alchemy API 키, 거래소 API 키가 공존한다. 악성 플러그인이 키 입력 워크플로우를 후킹하는 패턴이 확장될 경우 **온체인 자산 직접 탈취**로 이어진다 | 매우 높음 |
| **C. Teams C2** | DAO·재단·거래소·프로젝트 팀이 Teams/Slack/Discord를 운영 채널로 사용. 신뢰 협업 채널을 통한 은밀 C2는 멀티시그 서명자 단말 장기 잠복 → 트레저리 탈취 시나리오의 진입점이 됨 | 높음 |
| **D. Vertex AI** | 온체인 데이터 분석, 트레이딩 모델, AI 에이전트 기반 DeFi 전략을 GCP Vertex AI로 서빙하는 프로젝트의 모델 오염 리스크. 거짓 신호 생성·전략 변조로 이어질 수 있음 | 중간 |
| **B. SprySOCKS** | 국가 행위자가 거래소·재단의 핵심 인프라를 장기 첩보 표적화할 경우, 콜드월렛 운영 절차·내부 키 관리 체계가 노출될 수 있음 | 중간 |

### 6.1 Web3 특화 권고

- **에어갭 서명 환경 분리:** 스마트컨트랙트 배포 키·멀티시그 서명 단말을 일반 개발 IDE 환경과 물리적으로 분리. 프라이빗 키는 어떤 경우에도 클라우드 동기화·IDE 플러그인 접근이 가능한 환경에 두지 않는다.
- **AI 코딩 도구의 키 격리:** 컨트랙트 감사·코드 생성에 AI 도구를 쓰되, 검증되지 않은 마켓플레이스 플러그인에 RPC/지갑/거래소 키를 입력하지 않는다.
- **온체인 이상 모니터링:** 트레저리·핫월렛에 대한 화이트리스트 출금 정책과 실시간 이상 거래 알림 체계를 행위 기반 침해 탐지의 일부로 통합한다.

> "LLM은 엑셀이지 오라클이 아니다" — Web3에서도 AI 도구는 검증 보조 수단일 뿐, 키와 서명 권한을 위임할 신뢰 주체가 아니다.

---

## 7. 공공기관 및 정부 영향 분석 (Public Sector & Government Impact)

요청에 따라 공공·정부 부문에 특화된 영향과 정책 시사점을 별도 분석한다.

### 7.1 직접 위협 매핑

| 사건 | 공공·정부 영향 | 우선 점검 대상 |
|---|---|---|
| **B. SprySOCKS** | 가장 직접적 위협. 국가 연계 행위자가 명시적으로 정부 기관을 표적. 외교·국방·통신 부문 우선 | 외교부·통일부·국방 관련 기관, 공공 클라우드 Windows 서버 |
| **C. DragonForce** | Teams 기반 행정 협업 인프라를 운영하는 공공기관·지자체. 화이트리스트된 협업 트래픽을 통한 은밀 침투 | 행정망·업무망의 협업 플랫폼, EDR 미배포 단말 |
| **A. JetBrains** | 공공 SI·전자정부 개발 조직, 국책 연구기관의 개발 환경. AI 도구 도입 확산 | 정부 통합 개발 환경, 공공 데이터 분석 조직 |
| **D. Vertex AI** | 공공 AI 서비스·국책 ML 과제를 클라우드로 운영하는 기관 | 공공 클라우드 AI/ML 파이프라인 |

### 7.2 정책적 시사점

- **국가 핵심 연구·행정 인프라 무결성 감사:** SprySOCKS의 정부 표적화와 미폐기 유출 인증서 문제는, 공공 부문의 드라이버 인벤토리·코드 서명 검증 체계 점검을 요구한다. 특히 구형 Windows 서버를 운용하는 기관의 즉시 점검이 필요하다.
- **"신뢰 채널 악용"에 대한 별도 위협 모델링:** 기존 공공 보안은 "외부 침입 차단"과 "데이터 유출 방지"에 집중되어 있다. 그러나 Teams TURN 릴레이·정상 클라우드 버킷·정상 서명 드라이버를 악용하는 본 4대 위협은 신뢰 경계 내부에서 작동한다. 행위 기반 탐지(behavioral detection)와 제로트러스트 아키텍처로의 전환이 정책 차원에서 가속되어야 한다.
- **공급망 보안의 AI 도구 확장:** 전자정부·공공 SI 개발 환경에 AI 코딩 도구가 빠르게 도입되는 가운데, 마켓플레이스 플러그인·확장에 대한 화이트리스트·검증 체계가 부재하다. 공공 개발 환경의 허용 플러그인 정책 수립이 필요하다.
- **클라우드 ML 거버넌스:** 공공 AI 서비스의 클라우드 SDK 버전 관리, 모델 무결성 검증, 명시적 스테이징 버킷 지정을 표준 운영 절차에 포함해야 한다.

### 7.3 공공 부문 즉시 권고 체크리스트

- Windows 엔드포인트의 미서명·미식별 커널 드라이버 인벤토리 점검, HVCI(Hypervisor-protected Code Integrity) 활성화 (SprySOCKS 대응)
- `TeamsMediaRelay` 명의 비정상 서비스, Teams.exe 메모리 이상(RWX 페이지), MS VPN 대역의 비표준 포트 향 아웃바운드 TCP 헌팅 (DragonForce 대응)
- 개발 조직의 JetBrains 플러그인 감사, 노출 의심 AI/RPC API 키 즉시 폐기·재발급 (JetBrains 대응)
- `google-cloud-aiplatform` SDK를 v1.148.0 이상으로 갱신, 명시적 `staging_bucket` 지정 (Vertex AI 대응)

---

## 8. 침해 지표 (Indicators of Compromise)

### 8.1 사건 A — JetBrains 악성 플러그인

| 유형 | 값 |
|---|---|
| C2 서버 IP | `39.107.60[.]51` |
| 대표 플러그인명 | DeepSeek AI Assist, CodeGPT AI Assistant, DeepSeek Git Commit, AI Coder Review, Coding Simple Tool |
| 판매자 계정(예시) | CodePilot, StackSmith, ZenCoder (총 7개 계정) |
| 행위 지표 | API 키 저장 시 비암호화 HTTP로 하드코딩 서버에 전송 |

### 8.2 사건 B — SprySOCKS Windows 변종

| 유형 | 값 |
|---|---|
| 커널 드라이버 (RawWNPF) | 디스크 저장명 `KW1B5206BDC1743FP.dat` |
| 로더 드라이버 | `fsdiskbit.sys` (ESET 명명 "DriverLoader") |
| 서명 인증서 | GitHub `PastDSE` 프로젝트 유출 인증서 (미폐기) |
| 관련 CVE | CVE-2023-24932 (UEFI 부트킷 정황, 제한적) |
| 내부 라벨 | WIN_DRV, WIN_PLUS (SprySOCKS v1.8) |
| C2 채널 | TCP / UDP / WebSocket |
| 행위 지표 | `NtQuerySystemInformation` 후킹, Print Spooler(`spoolsv.exe`) 악용, `svchost.exe` 인젝션 |

### 8.3 사건 C — DragonForce Backdoor.Turn

| 유형 | 값 |
|---|---|
| 셸코드 (Backdoor.Turn) SHA256 | `ce66b8221446c9b6d83f0ce6382f430e519601641e5daaaf1ca7a8a8806cb0b0` |
| 사이드로드 DLL (VirtualBox 위장) SHA256 | `f174c19902523dcf005fa044b6598403a5e5c0a5982398d1bc0dcc5ec1cd351b` |
| 취약 드라이버 (GameDriverx64) SHA256 | `b6628d201c2a68d2a3de2a87de7a5acfe21b101a97928e1c8d5c82102d967383` |
| BYOVD 드라이버 | Huawei `HWAuidoOs2Ec.sys` (Havoc Process Terminator), ABYSSWORKER |
| 인젝션 대상 프로세스 | `DbgView64.exe` |
| 서비스명 (IOC) | `TeamsMediaRelay` |
| 행위 지표 | Teams 익명 방문자 토큰 획득 → MS TURN 릴레이 경유 → QUIC 세션 C2. MS VPN 대역 비표준 포트 아웃바운드, Limit Blank Password 설정 제거 |
| 초기 침투 | SQL/MSSQL 서버 취약점 |

### 8.4 사건 D — Google Vertex AI "Pickle in the Middle"

| 유형 | 값 |
|---|---|
| 영향 패키지 | `google-cloud-aiplatform` (Python SDK) |
| 취약 버전 | 1.139.0, 1.140.0 등 1.144.0 미만 |
| 패치 버전 | v1.144.0 (부분), **v1.148.0 (완전)** |
| 관련 CVE | CVE-2026-2473 (Vertex AI Experiments, 2026.02 별건 패치) |
| 취약 패턴 | 결정적 버킷명 `<project>-vertex-staging-<region>`, 소유권 미검증 |
| 행위 지표 | 미지 외부 GCS 버킷으로의 모델 업로드, 서빙 컨테이너 메타데이터 서버 OAuth 토큰 접근 |

---

## 9. 통합 방어 및 대응 권고

### 9.1 공통 원칙 — 신뢰 인프라 침투 대응

네 사건의 공통 교훈은 **"신뢰는 검증되지 않으면 공격면이 된다"**는 것이다. 다음 원칙이 모든 사건에 적용된다.

- **행위 기반 탐지로의 전환:** IP 평판·도메인 차단·시그니처는 합법 인프라 악용 앞에서 무력하다. 비정상 행위 패턴(프로세스 인젝션, 비정상 토큰 요청, 예상 밖 데이터 흐름) 탐지를 1차 방어선으로.
- **제로트러스트:** 합법 도메인·정상 서명·내부 협업 채널이라도 기본 신뢰하지 않는다.
- **비인간 자격증명(NHI) 관리:** API 키·서비스 계정·토큰의 정기 순환·감사. 통계상 조직의 11.1%만이 비인간 자격증명을 지속 순환·감사한다.

### 9.2 사건별 즉시 조치

| 사건 | 즉시 조치 |
|---|---|
| **A** | JetBrains 설치 플러그인 전수 감사. 영향 플러그인 사용 시 모든 AI/RPC/거래소 API 키 즉시 폐기·재발급. 외부 모델 요청 로그의 비정상 지역·볼륨 감사 |
| **B** | 미서명·미식별 커널 드라이버 플래그. HVCI 활성화. 구형 Windows 서버 IOC 점검. `PastDSE` 유출 인증서 서명 드라이버 차단 |
| **C** | 전 엔드포인트에서 `TeamsMediaRelay` 서비스 헌팅. BYOVD 드라이버 CVE·ABYSSWORKER 해시 커널 레벨 차단. 8.3절 IOC를 SIEM·엣지 방화벽에 즉시 수집. Graph API 감사 로깅 활성화 |
| **D** | `google-cloud-aiplatform`을 v1.148.0+로 갱신(노트북·CI·학습 파이프라인 포함). 명시적 `staging_bucket` 지정. 모델 아티팩트 무결성 검증 도입 |

---

## 10. 맺음말 — 신뢰의 무기화

2026년 6월 중순의 이 4건은 서로 다른 행위자(재정 동기 범죄자, 국가 연계 첩보 그룹, 카르텔형 랜섬웨어, 학술 연구진)가 발견하거나 수행했지만, 하나의 시대정신을 공유한다. **공격자는 더 이상 담장을 넘지 않는다. 담장 안에서 이미 신뢰받는 것들의 가면을 쓴다.**

- JetBrains 플러그인은 "정상 작동하기 때문에" 위험했다.
- SprySOCKS 드라이버는 "정상 서명되었기 때문에" 로드되었다.
- Backdoor.Turn은 "정상 Teams 트래픽이기 때문에" 보이지 않았다.
- Pickle in the Middle은 "정상 버킷 명명 규칙이기 때문에" 가로채였다.

한국의 보안 패러다임은 오랫동안 "외부 침입 차단"과 "데이터 유출 방지"라는 두 축에 집중되어 왔다. 그러나 이 4건이 보여주는 것은 세 번째 축의 부재다 — **이미 신뢰하는 채널·코드·인프라에 대한 지속적 검증.** 데이터 탈취를 넘어 신뢰 채널 악용, 결과 변조, 장기 잠복으로 위협의 무게중심이 이동했다.

> 공공기관, Web3 재단, AI 스타트업, 전통 기업 모두에게 질문은 동일하다. **"우리가 신뢰하는 것 중 검증하지 않는 것은 무엇인가?"** 그 목록이 곧 다음 침해의 공격면이다.

---

## 부록 A: 참고 자료 및 출처

- **Aikido Security (2026.06.16):** Ilyas Makari, "Multiple JetBrains IDE plugins caught stealing AI keys"
  - URL: https://www.aikido.dev/blog/multiple-jetbrains-ide-plugins-caught-stealing-ai-keys
- **BleepingComputer (2026.06.16):** "Malicious JetBrains Marketplace plugins steal AI API keys from developers"
- **ESET / WeLiveSecurity (2026.06.16):** Martin Smolár, "Fishmonger's arsenal upgraded: SprySOCKS for Windows"
  - URL: https://www.welivesecurity.com/en/eset-research/fishmongers-arsenal-upgraded-sprysocks-windows/
- **Broadcom Symantec Threat Hunter Team (2026.06.16):** "Hidden in Teams: DragonForce Attackers Weaponize Microsoft Teams Relays to Stay Hidden"
  - URL: https://www.security.com/threat-intelligence/dragonforce-msteams-backdoor
- **Help Net Security (2026.06.16):** "Cybercriminals mask malicious communications through Microsoft Teams relays"
- **Palo Alto Networks Unit 42 (2026.06.16):** "Pickle in the Middle – Hijacking Vertex AI Model Uploads for Cross-Tenant RCE"
  - URL: https://unit42.paloaltonetworks.com/hijacking-vertex-ai-model/
- **The Hacker News (2026.06.16~17):** 각 사건 후속 보도

---

## 부록 B: 분석가 정보 및 배포

| 항목 | 내용 |
|---|---|
| **분석가** | Dennis Kim (김호광 / HoKwang Kim) |
| **소속** | CEO, Betalabs Inc. (Seoul) / Independent CTI Analyst / Microsoft Azure ex-MVP |
| **이메일** | gameworker@gmail.com |
| **GitHub** | github.com/gameworkerkim |
| **문서 ID** | CTI-2026-0618-AISUPPLY |
| **TLP** | CLEAR — 자유 배포 가능 (출처 표기 권장) |
| **배포 언어** | 한국어 (원본), 영어·중국어 간체·일본어 (예정) |

본 보고서는 Aikido Security, ESET, Broadcom Symantec, Palo Alto Networks Unit 42의 공개 분석을 한국 사이버 위협 인텔리전스 커뮤니티의 관점에서 통합·재구성한 것이다. 모든 기술적 사실은 원 보고서에 근거하며, 한국·Web3·공공기관 영향 분석과 정책적 시사점은 본 분석가의 견해이다.

---

*End of Document*
