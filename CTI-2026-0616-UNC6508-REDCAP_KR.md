# UNC6508 의료·군사 연구기관 장기 잠복 공격 분석

> **PRC 연계 사이버 스파이 조직의 14개월 무탐지 침투 및 Google Workspace 이메일 탈취 작전 평가**
> *REDCap 서버 백도어 · INFINITERED 맞춤형 악성코드 · Google Workspace 컴플라이언스 규칙 첫 무기화*

---

## 문서 정보

| 항목 | 내용 |
| --- | --- |
| **리포트 ID** | CTI-2026-0616-UNC6508-REDCAP |
| **분류 (Classification)** | TLP:WHITE — 자유 배포 가능 |
| **심각도 (Severity)** | **HIGH** — 국가 지원 APT · 14개월 무탐지 잠복 · Google Workspace 이메일 탈취 신기법 확인 |
| **대상 산업 (Target Sector)** | 의료·학술 연구기관 · 군사 보건 기관 · 국방 연구소 · 바이오·제약 · AI 연구소 |
| **공격 기간 (Campaign Period)** | 2023년 9월 (최초 침투) — 2025년 11월 (활동 종료 확인) |
| **위협 행위자 (Threat Actor)** | UNC6508 (PRC-nexus, 중국 인민공화국 연계 스파이 조직) |
| **최초 보고 (First Report)** | 2026년 6월 15일 — Google GTIG 공식 보고서 |
| **작성일 (Publication)** | 2026년 6월 16일 |
| **발행 (Publisher)** | Dennis Kim — [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |

---

## 목차

1. [경영진 요약](#1-경영진-요약-executive-summary)
2. [사건 개요](#2-사건-개요)
3. [사건 타임라인](#3-사건-타임라인-incident-timeline)
4. [공격 벡터 및 기술 분석](#4-공격-벡터-및-기술-분석)
5. [INFINITERED 악성코드 상세 분석](#5-infinitered-악성코드-상세-분석)
6. [침해 지표 (IoC)](#6-침해-지표-indicators-of-compromise)
7. [관련 뉴스 및 보도 현황](#7-관련-뉴스-및-보도-현황)
8. [대응 조치 및 보안 권고사항](#8-대응-조치-및-보안-권고사항)
9. [한국 연구·의료 환경에 미치는 영향](#9-한국-연구의료-환경에-미치는-영향)
10. [결론 및 전략적 시사점](#10-결론-및-전략적-시사점)
11. [참고 문헌 및 출처](#11-참고-문헌-및-출처)
12. [부록 A. 용어 정리](#부록-a-용어-정리)

---

## 1. 경영진 요약 (Executive Summary)

2026년 6월 15일, Google 위협 인텔리전스 그룹(GTIG)은 중국 인민공화국(PRC) 연계 사이버 스파이 조직 **UNC6508**이 미국·캐나다의 의료, 학술, 군사 연구기관을 대상으로 **2023년 9월부터 2025년 11월까지 약 26개월(2년 2개월)** 에 걸쳐 무탐지 잠복 작전을 수행했음을 공개했다. GTIG는 이 캠페인을 **높은 신뢰도(High Confidence)** 로 UNC6508에 귀속했다.

초기 침투 경로는 의료·과학 연구 커뮤니티에서 광범위하게 사용되는 웹 기반 임상 데이터 플랫폼 **REDCap(Research Electronic Data Capture) 서버**였다. 공격자는 REDCap 서버에 맞춤형 악성코드 **INFINITERED**를 배포하고, 정상적인 REDCap 시스템 파일을 트로이 목마화하여 소프트웨어 업그레이드 후에도 지속성을 유지하는 정교한 방식을 사용했다.

특히 주목할 점은 **Google Workspace 이메일 컴플라이언스 규칙의 최초 무기화**다. 도메인 관리자 권한 획득 후, 공격자는 "**Patroit**"라는 컴플라이언스 규칙을 생성하여 군사 전략, AI 연구, 의학 주제 등 **약 150개 키워드**가 포함된 이메일 전체를 공격자 제어 Gmail 계정(`BebitaBarefoot774[@]gmail[.]com`)으로 자동 BCC 전달했다. Google은 PRC 연계 위협 행위자가 이 기법을 사용하는 것을 이전까지 한 번도 관찰한 적이 없다고 밝혔다.

> ⚠ **핵심 리스크**: UNC6508의 공격 우선순위 — 국방 정보, 인도·태평양 군사 전략, AI, 무인 항공기(드론), 공세적 사이버 프로그램, 의학 연구 — 는 한국의 전략적 자산과 직접 교차한다. 한국 의료기관·바이오 연구소·국방 연구기관 다수가 REDCap을 운영하고 있으며, Google Workspace를 이메일 플랫폼으로 사용한다. **동일한 TTPs를 활용한 한국 표적 공격 가능성을 배제할 수 없다.**

### 핵심 판단 (Key Judgments)

| # | 판단 | 근거 및 신뢰도 |
| --- | --- | --- |
| **KJ-1** | UNC6508은 PRC 국가 지원 스파이 조직으로 高신뢰도 귀속된다. 수집 우선순위가 중국 국가 전략 이익과 완전히 일치한다. | Google GTIG 공식 보고서, 인프라 오버랩, INFINITERED 일관 사용. **신뢰도: 높음(High)** |
| **KJ-2** | 침투 탐지까지 14개월 이상 소요된 것은 공격자 정교함보다 방어 가시성(Defender Visibility) 부재를 반영한다. | Security Affairs 분석, Dark Reading 보도. **신뢰도: 높음** |
| **KJ-3** | Google Workspace 컴플라이언스 규칙의 이메일 탈취 무기화는 PRC 연계 위협 행위자로부터 처음 관찰된 신기법이다. | Google GTIG 공식 명시. **신뢰도: 높음** |
| **KJ-4** | INFINITERED의 업그레이드 인터셉터 메커니즘은 정기 소프트웨어 업데이트를 재감염 경로로 역전시킨다. | CSO Online, Cybersecurity News 기술 분석. **신뢰도: 높음** |
| **KJ-5** | UNC6508은 의료 연구기관보다 더 광범위한 표적을 추구했을 가능성이 있으며, 한국 포함 아시아 연구기관으로 확장 가능하다. | GTIG: "광범위 표적 추구 가능성 시사" 공식 명시. **신뢰도: 중간(Medium)** |

---

## 2. 사건 개요

### 2.1 위협 행위자 프로파일 — UNC6508

| 항목 | 내용 |
| --- | --- |
| **Mandiant 트래킹명** | UNC6508 |
| **귀속** | 중국 인민공화국(PRC) 연계 (高신뢰도) |
| **GTIG 추적 시작** | 2025년 초 |
| **캠페인 기간** | 2023년 9월 ~ 2025년 11월 (확인 기간, 약 26개월) |
| **분류** | 상대적으로 새롭고 알려지지 않은 스파이 위협 클러스터 |
| **주요 표적** | 의료 연구기관, 학술 센터, 군사 보건 기관, 보건 옹호 단체, 규제기관 |
| **표적 지역** | 미국·캐나다 (북미 중심, 아시아 확장 가능성) |
| **핵심 도구** | INFINITERED 맞춤형 백도어 |
| **신규 기법** | Google Workspace 이메일 컴플라이언스 규칙 무기화 (PRC 연계 최초) |

### 2.2 수집 우선순위 (Intelligence Collection Priorities)

UNC6508의 수집 우선순위는 중국 국가 전략 이익과 정확히 일치한다:

| 수집 분야 | 세부 내용 | 전략적 가치 |
| --- | --- | --- |
| **국방 정보** | 국가 안보 관련 민감 국방 정보 | 군사 우위 확보 |
| **인도·태평양 군사 전략** | 미·캐나다 인도태평양 작전 계획 | 지역 패권 경쟁 |
| **인공지능** | AI 연구 데이터, 알고리즘, 응용 연구 | 기술 우위 탈취 |
| **무인 항공기·차량** | 드론, 무인 지상차량 시스템 연구 | 군사 무인체계 우위 |
| **공세적 사이버** | 네트워크 전쟁 프로그램 | 사이버 작전 역량 |
| **의학 연구** | 신약 개발, 임상시험, 공중보건 정책 | 바이오 기술 탈취 |

> 📌 특이 키워드 "**Chikungunya**": "Patroit" 컴플라이언스 규칙의 150개 키워드 중 치쿤구냐(Chikungunya) 바이러스가 포함됐다. 이 바이러스는 2025년 7월 중국 광둥성에서 발생한 모기 매개 바이러스 감염병이다. 이는 공격자가 **실시간·미션 특화 정보**를 추구했음을 강력히 시사한다 — 단순 장기 스파이를 넘어 즉각적인 국가 의료 위기 대응 정보까지 수집했다는 의미다.

### 2.3 공격 체인 요약 (Attack Chain Summary)

| 단계 | 명칭 | 상세 내용 |
| --- | --- | --- |
| **Step 1** | Initial Access | 외부 노출 REDCap 서버 탐지 · 레거시 버전 다운그레이드 공격(T1689) |
| **Step 2** | Web Shell Deployment | `help.php` 웹쉘 배포 → 파일 업로드·지속성 확보 |
| **Step 3** | Internal Reconnaissance | 내부 정찰 · 데이터베이스·서비스 계정 자격 증명 수집 |
| **Step 4** | INFINITERED Deployment | 침투 3개월 후 INFINITERED 배포 · 정상 REDCap 파일 트로이 목마화 |
| **Step 5** | Credential Harvesting | 로그인 POST 요청에서 평문 자격 증명 암호화 수집 → DB 저장 |
| **Step 6** | Domain Admin Escalation | 수집 자격 증명으로 도메인 관리자 계정 접근 획득 |
| **Step 7** | Google Workspace Abuse | "Patroit" 컴플라이언스 규칙 생성 → 150개 키워드 이메일 Gmail BCC 자동 전달 |
| **Step 8** | Long-term Exfiltration | 14개월+ 무탐지 이메일·데이터 지속 탈취 |

---

## 3. 사건 타임라인 (Incident Timeline)

| 일시 | 이벤트 |
| --- | --- |
| **2023-09** | UNC6508, 북미 의료 연구기관 REDCap 서버 최초 침투 — `help.php` 웹쉘 배포, 내부 정찰 시작 |
| **2023-12 (추정)** | 침투 약 3개월 후 INFINITERED 백도어 배포 · REDCap 정상 파일 트로이 목마화 |
| **2024 상반기** | 수집된 자격 증명으로 내부 네트워크 이동 · 도메인 관리자 계정 접근 획득 |
| **2024 (시점 미상)** | Google Workspace 관리 콘솔에서 "Patroit" 컴플라이언스 규칙 생성 → 이메일 자동 BCC 탈취 시작 |
| **2025 초** | Google GTIG, UNC6508 추적 시작 — Mandiant Consulting, FLARE팀, Workspace Security 협력 분석 |
| **2025-11** | UNC6508 활동 마지막 확인 시점 |
| **2025-11 이후** | GTIG·Mandiant, 사고 대응·역공학 분석 완료 — 피해 조직 통보 및 복구 지원 |
| **2026-06-15** | Google GTIG, 전체 캠페인 공식 보고서 공개 — INFINITERED IoC, "Patroit" 규칙 세부 정보 포함 |
| **2026-06-15** | UNC6508 관련 악성 인프라 차단 조치 완료 (Google 발표) |
| **2026-06-16** | 본 CTI 리포트 발행 (한국 환경 영향 분석 포함) |

---

## 4. 공격 벡터 및 기술 분석

### 4.1 REDCap 서버 — 전략적 진입점 선택

REDCap은 HIPAA 등 규정 준수를 위한 의료·과학 연구 전용 데이터 플랫폼으로, 전 세계 140개국 이상 6,000여 기관에서 사용된다. UNC6508이 REDCap을 진입점으로 선택한 이유는 명확하다:

| 선택 이유 | 설명 |
| --- | --- |
| **광범위 배포** | 북미 의료 연구 커뮤니티 표준 플랫폼 — 단일 취약점으로 수많은 표적 접근 가능 |
| **낮은 보안 가시성** | 보안 솔루션 투자가 집중되는 기업 IT 환경이 아닌 연구 인프라 — 탐지 역량 낮음 |
| **레거시 버전 공존** | REDCap은 설계상 현재·레거시 버전의 병행 운영을 허용 → 다운그레이드 공격(T1689) 가능 |
| **풍부한 데이터** | 임상시험 데이터, 환자 정보, 연구 결과, 군사 관련 의료 연구 모두 포함 |
| **Google Workspace 연동** | 대부분 Google Workspace를 이메일 플랫폼으로 사용 → 이메일 탈취 거점 |

GTIG는 초기 접근 벡터를 정확히 확인하지 못했으나, UNC6508이 **레거시 구버전 REDCap을 적극적으로 탐지**했음을 관찰했다. 이는 현재 버전과 함께 실행되는 구버전을 대상으로 한 다운그레이드 공격의 전형적인 패턴이다.

### 4.2 3단계 자격 증명 수집 및 내부 이동

```
REDCap 서버 침해 후 공격 흐름:

Step 1: help.php 웹쉘 설치
  └─> 파일 업로드·다운로드·쉘 명령 실행 가능

Step 2: 내부 정찰 (Internal Recon)
  └─> DB 계정·서비스 계정 자격 증명 수집
        └─> xc32038474a 접두사로 REDCap 세션 DB에 암호화 저장

Step 3: INFINITERED 배포 (침투 3개월 후)
  └─> REDCap 로그인 POST 요청에서 평문 자격 증명 실시간 캡처
        └─> 암호화 후 세션 DB 저장

Step 4: 도메인 관리자 접근
  └─> 수집된 자격 증명으로 내부 이동
        └─> 도메인 관리자 계정 획득

Step 5: Google Workspace 무기화
  └─> "Patroit" 컴플라이언스 규칙 생성
        └─> 150개 키워드 포함 이메일 → Gmail BCC 자동 전달
```

### 4.3 Google Workspace 이메일 컴플라이언스 규칙 무기화 — 최초 관찰 기법

이 기법이 특히 위험한 이유는 **정상 시스템 기능이 완벽하게 작동하는 것처럼 보이기 때문**이다:

```
"Patroit" 컴플라이언스 규칙 구조:

규칙명: Patroit (Patriot의 의도적 오타)
동작: BCC 전달
대상: 도메인 내 모든 사용자
조건: 약 150개 정규식 키워드 중 하나 이상 포함

키워드 카테고리:
  ├─ 군사 전략 (인도태평양 작전 관련)
  ├─ AI 연구 (알고리즘, 모델, 응용)
  ├─ 무인 시스템 (드론, 자율차량)
  ├─ 사이버 작전 (네트워크 전쟁, 취약점)
  ├─ 의학 연구 (임상시험, 신약, 공중보건)
  └─ 특이 항목: "Chikungunya" (2025년 7월 中광둥성 실시간 발병)

전달 주소: BebitaBarefoot774[@]gmail[.]com

탐지 난이도: 매우 높음
  - 정상 Google Workspace 기능 사용
  - 별도 악성코드·네트워크 이상 없음
  - 이메일이 정상적으로 수신자에게도 전달됨
  - EDR, WAF, 네트워크 IDS 모두 우회
```

> ⚠ **방어 함의**: 이 공격을 탐지하려면 EDR·네트워크 모니터링이 아닌 **Google Workspace 관리 콘솔의 컴플라이언스 규칙 감사**가 필요하다. 대부분의 조직은 이를 정기적으로 검토하지 않는다. The Next Web은 "다른 이상 네트워크 트래픽도 생성하지 않았으며, 이메일 복사가 설계대로 작동하는 합법적인 시스템 기능에 의해 수행됐기 때문"이라고 분석했다.

### 4.4 정교한 작전 보안 (OpSec)

GTIG는 UNC6508이 **정교한 작전 보안(OpSec) 기법**으로 활동을 은폐했다고 명시했다:

| OpSec 기법 | 설명 |
| --- | --- |
| **GUID 구분자 활용** | INFINITERED가 하드코딩된 GUID(`b49e334d-9c01-463e-9bc5-00a6920fb66e`)로 자체 컴포넌트 식별 |
| **암호화 자격 증명 저장** | 탈취 자격 증명을 평문이 아닌 암호화 형태로 DB에 저장 |
| **HTTP Cookie C2** | `REDCAP-TOKEN` 쿠키 파라미터를 통한 C2 통신 — 정상 REDCap 트래픽과 구분 불가 |
| **업그레이드 인터셉터** | 정기 업데이트를 재감염 경로로 역전 — 보안팀이 "업데이트했으니 안전하다"는 판단 불가 |
| **의도적 오타** | 규칙명 "Patroit" — 추적·탐지 방해 목적 |

---

## 5. INFINITERED 악성코드 상세 분석

### 5.1 개요

| 항목 | 내용 |
| --- | --- |
| **악성코드명** | INFINITERED |
| **유형** | 맞춤형 모듈러 백도어 (Custom Modular Backdoor) |
| **표적** | REDCap 웹 애플리케이션 시스템 파일 트로이 목마화 |
| **배포 시점** | 최초 침투 약 3개월 후 |
| **C2 통신** | HTTP Cookie 파라미터 (`REDCAP-TOKEN`) |
| **지속성 메커니즘** | REDCap 업그레이드 패키지 인터셉터 |
| **귀속** | UNC6508 전용 개발 (타 캠페인 미관찰) |

### 5.2 3개 핵심 컴포넌트

**컴포넌트 1 — Dropper / Upgrade Interceptor (드롭퍼·업그레이드 인터셉터)**

```
기능: REDCap 소프트웨어 업그레이드 패키지 인터셉트
메커니즘:
  - 정상 REDCap 업그레이드 프로세스를 가로채
  - 새 업그레이드 패키지에 악성 코드를 주입
  - 하드코딩된 GUID 구분자 사용: b49e334d-9c01-463e-9bc5-00a6920fb66e
효과: 보안팀이 REDCap을 최신 버전으로 업데이트해도 재감염 발생
```

**컴포넌트 2 — Credential Harvester (자격 증명 수집기)**

```
기능: REDCap 로그인 자격 증명 실시간 탈취
메커니즘:
  - HTTP POST 로그인 요청에서 평문 사용자명·비밀번호 캡처
  - 캡처된 자격 증명 암호화 후 저장
  - 저장 위치: REDCap 세션 데이터베이스
  - 저장 접두사: xc32038474a
효과: 모든 REDCap 사용자의 로그인 자격 증명 지속 수집
```

**컴포넌트 3 — Backdoor with C2 (백도어 및 C2)**

```
기능: 지속적 원격 접근 및 명령 실행
메커니즘:
  - REDCap 페이지 로드 시마다 활성화
  - HTTP Cookie 파라미터 REDCAP-TOKEN 감지 및 명령 처리
지원 명령:
  ├─ 원격 쉘 실행 (Remote Shell Execution)
  ├─ SQL 쿼리 실행 (임의 DB 접근)
  ├─ 파일 업로드·다운로드
  ├─ 시스템 정보 수집
  └─ 기타 원격 제어 명령
효과: 완전한 원격 접근 유지, 정상 REDCap 트래픽으로 위장
```

### 5.3 웹쉘 — help.php

INFINITERED 배포 이전에 사용된 초기 웹쉘:

| 항목 | 내용 |
| --- | --- |
| **파일명** | `help.php` |
| **위치** | REDCap 애플리케이션 디렉토리 내 |
| **기능** | 파일 업로더·지속성 유지 (INFINITERED 배포 준비) |
| **위장** | 정상 REDCap 도움말 파일로 위장 |

---

## 6. 침해 지표 (Indicators of Compromise)

### 6.1 파일 IoC

| 유형 | 값 | 비고 |
| --- | --- | --- |
| **웹쉘** | `help.php` | REDCap 앱 디렉토리 내 비정상 위치 |
| **GUID 구분자** | `b49e334d-9c01-463e-9bc5-00a6920fb66e` | INFINITERED 자체 식별자 |
| **DB 접두사** | `xc32038474a` | 세션 DB 내 탈취 자격 증명 저장 위치 |

### 6.2 네트워크 IoC

| 유형 | 값 | 비고 |
| --- | --- | --- |
| **C2 Cookie** | `REDCAP-TOKEN` (HTTP Cookie 파라미터) | INFINITERED C2 트리거 |
| **이메일 탈취 주소** | `BebitaBarefoot774[@]gmail[.]com` | "Patroit" 규칙 전달 대상 |

### 6.3 Google Workspace IoC

| 유형 | 패턴 | 탐지 방법 |
| --- | --- | --- |
| **컴플라이언스 규칙명** | `Patroit` (또는 유사 오타·위장 이름) | Google Admin Console 감사 |
| **외부 BCC 전달** | `@gmail.com` 등 외부 계정으로의 BCC 규칙 | Mail 흐름 정책 검토 |
| **관리자 활동** | 업무 외 시간대 컴플라이언스 규칙 생성·수정 | Admin 감사 로그 |

### 6.4 호스트 기반 탐지

```bash
# help.php 웹쉘 탐지
find /path/to/redcap -name "help.php" -ls
# → REDCap 정상 파일 목록과 비교하여 비정상 위치 확인

# INFINITERED GUID 구분자 탐지
grep -r "b49e334d-9c01-463e-9bc5-00a6920fb66e" /path/to/redcap/
# → 발견 시 즉각 격리

# 세션 DB에서 탈취 자격 증명 저장 접두사 탐지
# MySQL/MariaDB에서:
SELECT * FROM redcap_sessions WHERE session_data LIKE '%xc32038474a%';

# REDCap 최근 수정 파일 탐지
find /path/to/redcap -name "*.php" -newer /path/to/redcap/redcap_v*/index.php \
  -not -path "*/temp/*" -not -path "*/log/*" -ls

# 비정상 아웃바운드 HTTP 연결 탐지 (REDCap 서버에서)
netstat -an | grep ESTABLISHED | grep -v ':80\|:443\|:3306'
# → 외부 연결이 있다면 C2 통신 의심
```

### 6.5 MITRE ATT&CK 매핑

| ATT&CK ID | Tactic / Technique | 본 사건 적용 |
| --- | --- | --- |
| `T1689` | Defense Evasion: Exploit Downgrade | 레거시 REDCap 버전 다운그레이드 공격 |
| `T1505.003` | Persistence: Web Shell | `help.php` 웹쉘 배포 |
| `T1078` | Defense Evasion: Valid Accounts | 탈취 자격 증명으로 정상 계정 사용 |
| `T1056.001` | Credential Access: Keylogging | POST 로그인 요청 자격 증명 실시간 캡처 |
| `T1087` | Discovery: Account Discovery | 내부 계정·서비스 계정 탐색 |
| `T1098.003` | Persistence: Account Manipulation | Google Workspace 컴플라이언스 규칙 생성 |
| `T1114.003` | Collection: Email Forwarding Rule | "Patroit" BCC 이메일 자동 전달 규칙 |
| `T1048.003` | Exfiltration: Exfiltration via Web Service | Gmail로 이메일 탈취 |
| `T1071.001` | C2: Application Layer Protocol — Web | HTTP Cookie 기반 C2 통신 |
| `T1176` | Persistence: Browser Extensions (유사) | REDCap 업그레이드 인터셉터로 재감염 유지 |

---

## 7. 관련 뉴스 및 보도 현황

### 7.1 주요 보도 현황 (2026년 6월 15~16일)

| 매체 | 기사 제목 | 핵심 관점 |
| --- | --- | --- |
| **Google Cloud Blog** | *Public and Private Medical Community Targeted by China-Nexus Threat Actor* | 1차 소스 — GTIG 공식 캠페인 분석 |
| **Dark Reading** | *China-Nexus Actor Spies on US Researchers Undetected for a Year* | "공격자 정교함보다 방어 가시성 부재가 핵심" |
| **Security Affairs** | *China-linked actor UNC6508 spent two years inside medical research networks* | "2년 이상 잠복" — 실제 기간 재확인 |
| **The Register** | *Google says PRC-linked spies hid in medical research networks for more than a year* | GTIG McNamara 인터뷰 — "왜 의료기관에서 드론 정보를?" |
| **The Next Web** | *A built-in Google Workspace feature became a Chinese espionage group's favourite exfiltration tool* | Google Workspace 컴플라이언스 규칙 무기화 심층 분석 |
| **SecurityWeek** | *Chinese Hackers Target Medical, Military, and AI Research in North America* | 피해 조직 규모·예산 규모 보도 |
| **Cybersecurity News** | *PRC-Nexus Hackers Exploit REDCap Servers to Spy on US Medical Research Institutions* | INFINITERED 3개 컴포넌트 기술 분석 |
| **CSO Online** | *China-linked hackers target US, Canada research using legacy REDCap exploits* | 업그레이드 인터셉터 메커니즘 집중 보도 |
| **Help Net Security** | *Chinese hackers breached North American research institutions via REDCap servers* | Google의 인프라 차단 조치 완료 보도 |

### 7.2 주목할 미디어 관점

**Dark Reading의 핵심 분석:**
"이번 발견은 공격자의 정교함보다 방어자의 가시성 부재를 더 잘 드러낸다"고 Security Affairs는 보도했다. 즉, 의료 연구기관들의 보안 모니터링 성숙도 자체가 문제였다는 진단이다.

**The Register의 GTIG McNamara 인터뷰 인용:**
"우리가 내부적으로 가져온 질문 중 하나는: 이것이 주로 의료 연구기관에 나타나는 걸 보고 있다는 것이다. 그들이 왜 무인 드론과 무인 차량 같은 것을 찾고 있는가? 왜 그곳에서 그것을 찾을 것으로 예상하는가?"

**The Next Web의 핵심 통찰:**
이메일 복사가 설계대로 작동하는 합법적인 시스템 기능에 의해 수행됐기 때문에 이상 네트워크 트래픽을 전혀 생성하지 않았다.

---

## 8. 대응 조치 및 보안 권고사항

### 8.1 P0 — 즉각 조치 (24시간 이내)

| # | 조치 항목 | 설명 |
| --- | --- | --- |
| **P0-1** | REDCap 서버 외부 노출 현황 즉시 점검 | 인터넷 직접 노출 인스턴스 확인 — VPN·방화벽 뒤로 즉시 이동 |
| **P0-2** | Google Workspace 컴플라이언스 규칙 전수 감사 | Admin Console → Apps → Gmail → 기본 라우팅 → 컴플라이언스 → 외부 BCC 전달 규칙 전체 검토 |
| **P0-3** | INFINITERED IoC 기반 즉각 스캔 | `help.php`, GUID `b49e334d...`, DB 접두사 `xc32038474a` 전수 탐지 |
| **P0-4** | `BebitaBarefoot774[@]gmail[.]com` 이메일 전달 여부 확인 | Google Admin 메일 흐름 로그에서 해당 주소로의 전달 이력 검색 |
| **P0-5** | 관리자 계정 비밀번호 전면 교체 및 MFA 강제화 | 도메인 관리자·REDCap 관리자 계정 즉시 재설정 |

```bash
# P0-3: INFINITERED 핵심 IoC 스캔 스크립트
echo "=== help.php 웹쉘 탐지 ==="
find /path/to/redcap -name "help.php" 2>/dev/null

echo "=== INFINITERED GUID 탐지 ==="
grep -r "b49e334d-9c01-463e-9bc5-00a6920fb66e" /path/to/redcap/ 2>/dev/null

echo "=== 세션 DB 탈취 자격 증명 접두사 탐지 (MySQL) ==="
mysql -u root -p -e "SELECT session_id, LEFT(session_data,100) \
  FROM redcap_sessions WHERE session_data LIKE '%xc32038474a%' LIMIT 20;"
```

### 8.2 P1 — 단기 조치 (7일 이내)

| # | 조치 항목 | 설명 |
| --- | --- | --- |
| **P1-1** | REDCap 최신 버전 업데이트 + 레거시 버전 완전 제거 | Google 공식 권고 — 레거시 버전이 다운그레이드 공격 표면 제공 |
| **P1-2** | Google Workspace Admin 감사 로그 2023년 9월 이후 전수 검토 | 컴플라이언스 규칙 생성·수정 이벤트 집중 분석 |
| **P1-3** | 2023년 9월 이후 REDCap 접근 로그 이상 분석 | 비인가 접근 패턴, 비업무 시간대 관리자 활동 분석 |
| **P1-4** | 피싱 저항형 MFA 배포 (FIDO2/WebAuthn) | Google 공식 권고 — 도메인 관리자 계정 탈취 전제 조건 차단 |
| **P1-5** | REDCap 서버 파일 무결성 검사 | 공식 릴리스 파일 해시와 현재 파일 비교 — 트로이 목마화 탐지 |

### 8.3 P2 — 전략적 조치 (30일 이내)

| # | 조치 항목 | 설명 |
| --- | --- | --- |
| **P2-1** | REDCap 접근 아키텍처 재설계 | 인터넷 직접 노출 금지 → VPN/ZTNA 뒤 배치 · WAF 앞단 적용 |
| **P2-2** | Google Workspace 컴플라이언스 규칙 변경 알림 자동화 | 신규 컴플라이언스 규칙 생성 시 보안팀 즉시 알림 체계 구성 |
| **P2-3** | SIEM에 UNC6508 TTPs 기반 탐지 룰 추가 | REDCap 비정상 접근 · DB 이상 쿼리 · Gmail 외부 전달 이벤트 실시간 경보 |
| **P2-4** | 위협 인텔리전스 공유 체계 구축 | ISAC(정보 공유·분석 센터) 참여, Google GTIG IOC 자동 수집·적용 |
| **P2-5** | 연구 데이터 접근 최소 권한 원칙 전면 재검토 | 민감 임상 데이터·군사 관련 연구 데이터 접근 권한 감사 |

---

## 9. 한국 연구·의료 환경에 미치는 영향

### 9.1 한국 내 REDCap 운영 현황

REDCap은 한국에서도 대학병원·연구기관을 중심으로 광범위하게 운영된다:

| 기관 유형 | REDCap 주요 활용 | UNC6508 관심도 |
| --- | --- | --- |
| **대학병원 임상시험센터** | 임상시험 데이터 관리·CRF 작성 | 🔴 매우 높음 |
| **의과대학 연구소** | 의료 연구 데이터베이스·코호트 연구 | 🔴 높음 |
| **국방 의학 연구기관** | 군사 의료·부상 패턴 연구 | 🔴 매우 높음 |
| **바이오·제약 연구소** | 신약 임상 데이터·PK/PD 분석 | 🟠 높음 |
| **보건 정책 연구기관** | 공중보건 정책 분석·역학 연구 | 🟠 중간 |

### 9.2 한국 환경의 추가 위험 요소

| 위험 요소 | 설명 |
| --- | --- |
| **Google Workspace 광범위 도입** | 국내 대학·연구기관 이메일 플랫폼으로 Google Workspace 사용 확산 → "Patroit" 유사 기법 직접 적용 가능 |
| **한미 군사 협력 정보** | 한미 연합 군사 의학 연구 데이터는 UNC6508 수집 우선순위인 인도태평양 군사 전략과 직접 관련 |
| **K-바이오 전략적 가치** | 삼성바이오에피스, 셀트리온, 한미약품 등 글로벌 경쟁력 보유 바이오 기업 임상 데이터 |
| **반도체·AI 연구** | KAIST, POSTECH, 서울대 AI 연구소는 UNC6508 수집 우선순위 AI 연구와 직접 연관 |
| **보안 모니터링 성숙도** | 의료 연구 환경의 보안 투자 부족 — 북미와 동일한 "방어 가시성 부재" 문제 내재 |

### 9.3 인도태평양 키워드와 한국 관련성

UNC6508의 "Patroit" 규칙에 포함된 인도태평양 군사 전략 키워드는 다음 한국 관련 정보와 교차한다:

```
UNC6508 수집 관심 ↔ 한국 연구기관 보유 정보:

인도태평양 군사 전략
  └─> 한미 연합 군사 훈련·전략 기획 관련 의료 지원 계획

무인 항공기·자율 시스템
  └─> 한국 드론 작전 의학 연구·무인 구급 시스템

공세적 사이버 프로그램
  └─> 한국 사이버사령부 연계 의료 시스템 보안 연구

의학 연구 (임상시험)
  └─> K-바이오 글로벌 임상시험 데이터 (경쟁 우위 핵심)
```

> 💡 **제언**: 한국 의료·연구기관 보안 담당자는 ① REDCap 버전 즉시 확인 및 업데이트, ② Google Workspace 컴플라이언스 규칙 전수 감사, ③ 외부 이메일 BCC 전달 규칙 탐지 체계 구축을 즉시 수행해야 한다. 특히 군사 의학 연구기관과 AI 연구소는 동일 TTPs를 활용한 표적 공격 가능성을 전제로 사고 대응 체계를 점검해야 한다.

---

## 10. 결론 및 전략적 시사점

UNC6508 캠페인은 네 가지 구조적 경고를 남긴다.

### 교훈 1 — "업데이트하면 안전하다"는 가정은 틀렸다

INFINITERED의 업그레이드 인터셉터는 정기 보안 업데이트를 재감염 경로로 역전시켰다. 보안팀이 REDCap을 최신 버전으로 업데이트한 순간 악성코드가 새 버전에 재주입됐다. **소프트웨어 업데이트 전 파일 무결성 검증, 레거시 버전 완전 제거, 업데이트 후 재스캔**이 필수 프로세스가 됐다.

### 교훈 2 — 정상 기능이 최강의 무기가 된다

Google Workspace 컴플라이언스 규칙은 설계된 대로 정확히 작동했다. EDR, WAF, IDS, SIEM 중 어떤 것도 이를 "공격"으로 탐지할 수 없었다. **시스템 기능의 무기화(Weaponization of Legitimate Features)는 이제 국가 지원 APT의 표준 전술**이 됐으며, 방어자는 자신의 시스템 기능 자체를 잠재적 공격 표면으로 간주해야 한다.

### 교훈 3 — 연구기관 보안은 기업 보안과 다른 접근이 필요하다

14개월 무탐지는 공격자의 능력보다 **연구기관 보안 모니터링의 구조적 취약성**을 드러낸다. 연구기관은 예산·인력·보안 문화 모두에서 기업 환경과 다르다. 연구용 플랫폼(REDCap 등)의 보안을 엔터프라이즈 시스템과 동일한 수준으로 끌어올리는 **특화된 접근 방식과 정책 지원**이 필요하다.

### 교훈 4 — 한국은 동일한 표적 프로파일이다

UNC6508의 수집 우선순위(인도태평양 군사 전략, AI, 의학 연구)는 한국의 전략적 자산과 완전히 일치한다. 한미 군사 동맹의 핵심 당사자이자 글로벌 바이오·AI 연구 강국으로서 한국 연구기관은 동일한 위협 클러스터의 자연스러운 확장 표적이다.

> 📍 **최종 판단**: Google은 UNC6508 관련 악성 인프라를 차단했으나, 위협 조직 자체는 건재하다. 새로운 캠페인에서 동일한 TTPs(REDCap 또는 유사 연구 플랫폼 공략, Google Workspace 무기화)가 재사용될 가능성이 높다. 한국 의료·연구기관의 방어 가시성 확보가 지금 당장 필요하다.

---

## 11. 참고 문헌 및 출처

1. **[1차 소스]** Google GTIG 공식 보고서: *Public and Private Medical Community Targeted by China-Nexus Threat Actor* (2026-06-15): https://cloud.google.com/blog/topics/threat-intelligence/prc-targets-us-medical-research
2. **Dark Reading** — *China-Nexus Actor Spies on US Researchers Undetected for a Year* (2026-06-16): https://www.darkreading.com/threat-intelligence/china-nexus-actor-us-researchers-undetected
3. **Security Affairs** — *China-linked actor UNC6508 spent two years inside medical research networks* (2026-06-15): https://securityaffairs.com/193667/apt/china-linked-actor-unc6508-spent-two-years-inside-medical-research-networks.html
4. **The Register** — *Google says PRC-linked spies hid in medical research networks for more than a year* (2026-06-15): https://www.theregister.com/research/2026/06/15/google-says-prc-linked-spies-hid-in-medical-research-networks-for-more-than-a-year/
5. **The Next Web** — *A built-in Google Workspace feature became a Chinese espionage group's favourite exfiltration tool* (2026-06-15): https://thenextweb.com/news/chinese-hackers-unc6508-google-workspace-redcap-medical-military-research
6. **SecurityWeek** — *Chinese Hackers Target Medical, Military, and AI Research in North America* (2026-06-15): https://www.securityweek.com/chinese-hackers-target-medical-military-and-ai-research-in-north-america/
7. **Cybersecurity News** — *PRC-Nexus Hackers Exploit REDCap Servers to Spy on US Medical Research Institutions* (2026-06-16): https://cybersecuritynews.com/prc-nexus-hackers-exploit-redcap-servers/
8. **CSO Online** — *China-linked hackers target US, Canada research using legacy REDCap exploits* (2026-06-16): https://www.csoonline.com/article/4185582/china-linked-hackers-target-us-canada-research-using-legacy-redcap-exploits.html
9. **Help Net Security** — *Chinese hackers breached North American research institutions via REDCap servers* (2026-06-15): https://www.helpnetsecurity.com/2026/06/15/chinese-hackers-redcap-medical-research-institutions-breach/
10. REDCap 공식 보안 업데이트 안내: https://www.project-redcap.org
11. MITRE ATT&CK T1114.003 (Email Forwarding Rule): https://attack.mitre.org/techniques/T1114/003/
12. MITRE ATT&CK T1689 (Exploit Downgrade): https://attack.mitre.org/techniques/T1689/
13. Google Workspace Admin 보안 모범 사례: https://support.google.com/a/answer/7587183

---

## 부록 A. 용어 정리

| 용어 | 정의 |
| --- | --- |
| **UNC6508** | Google Mandiant가 추적하는 중국 인민공화국 연계 사이버 스파이 위협 클러스터. 의료·군사·AI 연구기관 표적 |
| **REDCap** | Research Electronic Data Capture. 의료·과학 연구용 웹 기반 데이터 관리 플랫폼. HIPAA 규정 준수 설계 |
| **INFINITERED** | UNC6508 전용 맞춤형 모듈러 백도어. REDCap 시스템 파일 트로이 목마화, 업그레이드 인터셉터 포함 |
| **Google Workspace 컴플라이언스 규칙** | 조직 이메일 정책 적용을 위한 Google Workspace 합법 기능. 키워드 기반 이메일 자동 처리·전달 가능 |
| **"Patroit" 규칙** | UNC6508이 생성한 이메일 BCC 탈취 컴플라이언스 규칙. Patriot의 의도적 오타로 추적 방해 |
| **다운그레이드 공격 (T1689)** | 현재 버전과 함께 실행되는 레거시 구버전 소프트웨어를 공격하여 보안 수준을 낮추는 전술 |
| **업그레이드 인터셉터** | INFINITERED 컴포넌트. REDCap 소프트웨어 업그레이드 패키지를 가로채 악성 코드를 재주입 |
| **GUID 구분자** | Globally Unique Identifier. INFINITERED가 자체 컴포넌트 식별에 사용하는 고유 식별자 (`b49e334d-9c01-463e-9bc5-00a6920fb66e`) |
| **PRC-nexus** | People's Republic of China nexus. 중국 국가 이익과 연계된 위협 행위자 분류 표현 |
| **OpSec (작전 보안)** | Operational Security. 공격자가 자신의 활동·신원·인프라를 탐지로부터 보호하는 일련의 기술적·절차적 조치 |
| **피싱 저항형 MFA** | FIDO2/WebAuthn 기반 다중 인증. 피싱으로 탈취 불가능한 물리 키·기기 결합 인증 |

---

*— 문서 끝 (End of Report) —*

**© 2026 Dennis Kim · Cyber Threat Intelligence Division**
[github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*본 리포트는 공개된 정보에 기반한 독립적 분석으로, Google LLC, Mandiant 또는 관련 조직의 공식 입장과 무관합니다.*

`TLP:WHITE` · `CTI-2026-0616-UNC6508-REDCAP` · Published: 2026-06-16
