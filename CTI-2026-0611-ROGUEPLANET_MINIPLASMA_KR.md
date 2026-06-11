# CTI-2026-0611 | RoguePlanet & MiniPlasma — Microsoft Windows 제로데이 익스플로잇 공개

> **⚠️ 경보 등급: 심각 (CRITICAL)**
> **최초 발행: 2026-06-11** | **버전: v1.0** | **언어: 한국어**
> **작성자: HoKwang Kim (Dennis Kim)** · Betalabs Inc. · [gameworker@gmail.com](mailto:gameworker@gmail.com)
> **ORCID:** [0009-0002-0962-2175](https://orcid.org/0009-0002-0962-2175) · **GitHub:** [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

---

## 요약 (Executive Summary)

완전히 패치된 최신 Windows 10/11 시스템에서도 로컬 권한 상승(LPE)을 허용하는 두 건의 제로데이 취약점 그룹, **RoguePlanet**과 **MiniPlasma**가 보안 커뮤니티에 연이어 공개되어 즉각적인 위협을 야기하고 있다.

- **RoguePlanet (CVE-2026-45586):** 레이스 컨디션 기반 LPE로, 완전한 SYSTEM 권한 획득 PoC 코드가 공개됨
- **MiniPlasma (CVE-2026-50507 + CVE-2026-49160):** CTFMON 권한 상승 결함과 'HTTP/2 Bomb' DoS 취약점으로 구성; **이미 실제 공격에 활발히 악용 중**

6월 패치 화요일(KB5094126 등)이 적용되지 않은 모든 Windows 시스템은 즉각적인 패치 적용이 필요하다.

---

## 목차

1. [사건 개요](#1-사건-개요)
2. [취약점 상세 분석](#2-취약점-상세-분석)
3. [MITRE ATT&CK 매핑](#3-mitre-attck-매핑)
4. [침해지표 (IoC)](#4-침해지표-ioc)
5. [영향 범위](#5-영향-범위)
6. [대응 권고 (Recommendations)](#6-대응-권고-recommendations)
7. [분석가 평가 및 한계](#7-분석가-평가-및-한계)
8. [참고 자료](#8-참고-자료)

---

## 1. 사건 개요

| 항목 | 내용 |
|---|---|
| **사고 그룹 A** | RoguePlanet (CVE-2026-45586) |
| **사고 그룹 B** | MiniPlasma (CVE-2026-50507, CVE-2026-49160) |
| **공개 시점** | 2026년 6월 (패치 화요일 전후) |
| **영향 대상** | 완전 패치 상태의 Windows 10 / Windows 11 |
| **취약점 유형** | 로컬 권한 상승(LPE), 서비스 거부(DoS) |
| **악용 상태** | MiniPlasma — **활발히 악용 중 (Actively Exploited)** |
| **PoC 공개** | RoguePlanet — **완전한 PoC 코드 공개** |
| **패치 여부** | 2026년 6월 패치 화요일(KB5094126 등) 포함 |

---

## 2. 취약점 상세 분석

### 2.1 RoguePlanet — CVE-2026-45586

#### 개요

| 항목 | 내용 |
|---|---|
| **CVE** | CVE-2026-45586 |
| **유형** | 로컬 권한 상승 (Local Privilege Escalation, LPE) |
| **원인** | 레이스 컨디션 (Race Condition) |
| **최대 권한** | NT AUTHORITY\SYSTEM (전체 시스템 권한) |
| **PoC 공개** | 예 (완전한 개념 증명 코드 공개) |
| **CVSS** | TBD (공식 점수 확인 필요) |

#### 기술 분석

RoguePlanet은 Windows 커널 또는 시스템 서비스 내의 **레이스 컨디션(경쟁 조건) 취약점**을 악용한다. 공격자는 낮은 권한의 로컬 사용자 계정으로 접근한 뒤, 레이스 컨디션을 트리거하여 **NT AUTHORITY\SYSTEM** 수준의 전체 시스템 권한을 획득할 수 있다.

**주요 특성:**
- 완전히 업데이트된 Windows 10/11 시스템에서도 동작 (패치 적용 전)
- 완전한 PoC 코드가 공개되어 스킬 임계값이 낮아짐
- 일부 보안 전문가는 PoC의 **안정성(reliability)** 에 의문을 제기
- 그러나 커뮤니티 내 신속한 분석과 변형이 이루어질 가능성이 매우 높음

**공격 시나리오:**
1. 공격자가 낮은 권한으로 시스템에 로컬 접근 확보 (피싱, 초기 침투 등)
2. RoguePlanet PoC 또는 변형 코드 실행
3. 레이스 컨디션 성공 시 SYSTEM 권한 획득
4. 이후 자격 증명 덤프, 지속성 유지, 횡적 이동 가능

---

### 2.2 MiniPlasma — CVE-2026-50507 + CVE-2026-49160

#### 개요

| 항목 | 내용 |
|---|---|
| **CVE (권한 상승)** | CVE-2026-50507 |
| **CVE (DoS)** | CVE-2026-49160 |
| **유형 1** | 권한 상승 (Privilege Escalation) — CTFMON 프레임워크 |
| **유형 2** | 서비스 거부 (DoS) — 'HTTP/2 Bomb' |
| **악용 상태** | **활발히 악용 중 (Actively Exploited in the Wild)** |
| **영향 서비스** | Collaborative Translation Framework (CTFMON), HTTP/2 서비스 |

#### CVE-2026-50507: CTFMON 권한 상승

**CTFMON(Collaborative Translation Framework Monitor)** 은 Windows 텍스트 서비스와 언어 입력 처리를 담당하는 시스템 구성 요소다. CVE-2026-50507은 이 프레임워크의 **접근 제어 결함**으로, 낮은 권한의 프로세스가 CTFMON의 특권 컨텍스트를 악용하여 권한을 상승시킬 수 있다.

**공격 특성:**
- Windows 텍스트 서비스가 활성화된 모든 Windows 10/11 환경에 영향
- 이미 실제 위협 행위자에 의해 적극 악용 중
- 원격 코드 실행(RCE)으로의 체이닝 가능성 존재

#### CVE-2026-49160: HTTP/2 Bomb (서비스 거부)

**'HTTP/2 Bomb'** 은 HTTP/2 프로토콜의 헤더 압축 메커니즘(HPACK)을 악용하여 소량의 악성 패킷으로 서버 또는 서비스에 **치명적인 리소스 소진**을 유발하는 서비스 거부 공격이다.

**공격 특성:**
- Windows의 HTTP/2 스택을 처리하는 서비스 전반에 영향
- 소량의 악성 요청으로 대규모 메모리·CPU 소진 유발
- IIS, .NET 기반 웹 서비스, Azure Functions 등 Windows HTTP/2 스택 사용 환경에 위험

---

## 3. MITRE ATT&CK 매핑

| Tactic | Technique ID | Technique Name | 관련 취약점 |
|---|---|---|---|
| Privilege Escalation | T1068 | Exploitation for Privilege Escalation | CVE-2026-45586 (RoguePlanet), CVE-2026-50507 (CTFMON) |
| Execution | T1203 | Exploitation for Client Execution | CVE-2026-45586 PoC 실행 |
| Impact | T1499.004 | Endpoint Denial of Service: Application or System Exploitation | CVE-2026-49160 (HTTP/2 Bomb) |
| Defense Evasion | T1055 | Process Injection | SYSTEM 권한 획득 후 프로세스 인젝션 가능 |
| Credential Access | T1003 | OS Credential Dumping | SYSTEM 권한 획득 후 자격 증명 덤프 가능 |

---

## 4. 침해지표 (IoC)

> ⚠️ 현재 공개된 PoC 기반 행위 지표입니다. 추가 IoC는 공식 분석 결과 발표 후 업데이트 예정.

### 4.1 CVE-2026-45586 (RoguePlanet) 행위 기반 IoC

| 유형 | 패턴/값 | 비고 |
|---|---|---|
| 프로세스 | 낮은 권한 프로세스 → SYSTEM 컨텍스트 이상 전환 | 비정상 권한 상승 탐지 |
| 이벤트 로그 | Windows Security Log: Event ID 4672 (특수 권한 할당) 연속 발생 | 레이스 컨디션 트리거 흔적 |
| 이벤트 로그 | Event ID 4688 (새 프로세스 생성) — 부모 프로세스 권한 불일치 | 비정상 프로세스 생성 |

### 4.2 CVE-2026-50507 (CTFMON LPE) 행위 기반 IoC

| 유형 | 패턴/값 | 비고 |
|---|---|---|
| 프로세스 | `ctfmon.exe` 비정상 자식 프로세스 생성 | CTFMON 악용 탐지 |
| 이벤트 로그 | Event ID 4673 (권한 있는 서비스 호출) — CTFMON 관련 | 이상 호출 패턴 |
| 레지스트리 | `HKLM\SOFTWARE\Microsoft\CTF` 비정상 접근 | CTFMON 프레임워크 조작 |

### 4.3 CVE-2026-49160 (HTTP/2 Bomb) 네트워크 IoC

| 유형 | 패턴/값 | 비고 |
|---|---|---|
| 네트워크 | 소량 HTTP/2 요청 → 비정상적 서버 리소스 급증 | Bomb 패턴 탐지 |
| 성능 | CPU/메모리 급격한 소진 (HTTP/2 처리 중) | DoS 영향 징후 |
| 로그 | IIS/W3SVC 오류 로그: HTTP/2 스트림 처리 실패 급증 | 서비스 장애 |

---

## 5. 영향 범위

### 5.1 영향 받는 시스템

| 시스템 | CVE-2026-45586 | CVE-2026-50507 | CVE-2026-49160 |
|---|---|---|---|
| Windows 10 (모든 버전, 패치 미적용) | ✅ | ✅ | ✅ |
| Windows 11 (모든 버전, 패치 미적용) | ✅ | ✅ | ✅ |
| Windows Server (HTTP/2 사용 환경) | 해당 없음 | 조사 중 | ✅ |

### 5.2 고위험 환경

- **VDI/원격 데스크톱 환경**: 다수 사용자가 동일 시스템 접근 → LPE 공격 위험 극대화
- **HTTP/2 기반 웹 서비스**: IIS, .NET Core, Azure Functions 호스팅 환경
- **보안 솔루션 미배포 엔드포인트**: PoC 공개로 낮아진 공격 임계값

---

## 6. 대응 권고 (Recommendations)

### 🔴 즉각 조치 (24시간 이내)

1. **6월 패치 화요일 업데이트 즉시 적용**
   - **KB5094126** 및 관련 보안 업데이트 즉시 설치
   - Windows Update 설정 확인: 자동 업데이트 활성화 권고
   - WSUS/SCCM 환경: 긴급 패치 배포 태스크 즉시 실행

2. **MiniPlasma 우선 패치** (이미 악용 중)
   - CVE-2026-50507, CVE-2026-49160은 현재 실제 공격에 사용 중
   - 패치 적용 전까지 HTTP/2 서비스 비활성화 또는 접근 제한 검토

3. **행위 기반 탐지 룰 즉시 업데이트**
   - EDR/AV 솔루션의 시그니처 및 행위 탐지 정책 최신화
   - CTFMON 관련 이상 행위 모니터링 룰 추가

### 🟡 단기 조치 (7일 이내)

4. **패치 미적용 시스템 접근 최소화**
   - 패치 불가 레거시 시스템: 네트워크 격리 또는 접근 제어 강화
   - 원격 데스크톱 / VDI 환경: 세션 모니터링 강화

5. **HTTP/2 서비스 점검**
   - IIS 및 .NET 기반 서비스에서 HTTP/2 사용 여부 확인
   - WAF 룰에 HTTP/2 헤더 압축 어뷰징 탐지 로직 추가

6. **이벤트 로그 모니터링 강화**
   - Windows Security Log: Event ID 4672, 4673, 4688 집중 모니터링
   - SIEM 알림 임계값 하향 조정

### 🟢 중장기 조치 (30일 이내)

7. **취약점 관리 프로세스 개선**
   - PoC 공개 취약점에 대한 긴급 패치 SLA 단축 (72시간 이내)
   - 패치 화요일 후 72시간 내 전체 시스템 업데이트 완료 목표 수립

8. **최소 권한 원칙(PoLP) 강화**
   - 사용자 계정 권한 최소화 (LPE 공격의 선행 조건 제거)
   - UAC(사용자 계정 컨트롤) 정책 강화

---

## 7. 분석가 평가 및 한계

### 평가

두 취약점 그룹은 서로 다른 위험 특성을 지닌다:

**RoguePlanet (CVE-2026-45586):** PoC 코드 공개 자체가 위협의 실질적 확산을 의미한다. 레이스 컨디션 익스플로잇은 안정성이 낮을 수 있으나, 오픈소스 커뮤니티와 위협 행위자 모두 이를 빠르게 개선·변형할 능력이 있다. **패치 적용이 완료된 시스템에서의 위협은 즉각 소멸하나, 패치 공백 기간이 가장 위험한 시점이다.**

**MiniPlasma (CVE-2026-50507 + CVE-2026-49160):** 이미 실제 공격에 악용되고 있다는 점에서 RoguePlanet보다 **현재 위협 수준이 더 높다**. 특히 CTFMON은 Windows 텍스트 서비스의 핵심 구성 요소로, 넓은 공격 면(attack surface)을 가진다. HTTP/2 Bomb는 인터넷 노출 서비스 운영 조직에 직접적인 가용성 위협을 제기한다.

두 취약점 모두 공격 체인에서 **초기 침투 이후 단계**에 활용되는 LPE 성격이 강하므로, 초기 침투 방어(이메일 보안, 웹 필터링 등)와 병행하여 대응해야 한다.

### ⚠️ 분석 한계

- 취약점의 정확한 CVSS 점수는 공식 NVD 등록 완료 후 확인 필요
- RoguePlanet PoC의 실제 신뢰성/안정성은 독립 분석 후 재평가 예정
- MiniPlasma의 실제 악용 주체(위협 행위자 귀속)는 현재 미상

---

## 8. 참고 자료

- Microsoft Security Response Center (MSRC) — June 2026 Patch Tuesday: https://msrc.microsoft.com/update-guide/
- NVD CVE-2026-45586: https://nvd.nist.gov/vuln/detail/CVE-2026-45586
- NVD CVE-2026-50507: https://nvd.nist.gov/vuln/detail/CVE-2026-50507
- NVD CVE-2026-49160: https://nvd.nist.gov/vuln/detail/CVE-2026-49160
- CISA Known Exploited Vulnerabilities Catalog: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- MITRE ATT&CK T1068: https://attack.mitre.org/techniques/T1068/

---

<sub>© 2026 HoKwang Kim (Dennis Kim) · Betalabs Inc. · This report is released under independent research and is provided for informational purposes. All findings are based on publicly available information at the time of writing.</sub>

<sub>📌 리포트 파일명: `CTI-2026-0611-ROGUEPLANET_MINIPLASMA_KR.md` | 시리즈: CYBER-THREAT-INTELLIGENCE-REPORT</sub>
