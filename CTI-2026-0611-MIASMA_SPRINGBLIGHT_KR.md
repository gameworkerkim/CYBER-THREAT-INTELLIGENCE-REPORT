# CTI-2026-0611 | Microsoft 공급망 공격 — Miasma(Spring Blight) 웜에 의한 Azure 패키지 대량 감염

> **⚠️ 경보 등급: 심각 (CRITICAL)**
> **최초 발행: 2026-06-11** | **버전: v1.0** | **언어: 한국어**
> **작성자: HoKwang Kim (Dennis Kim)** · Betalabs Inc. · [gameworker@gmail.com](mailto:gameworker@gmail.com)
> **ORCID:** [0009-0002-0962-2175](https://orcid.org/0009-0002-0962-2175) · **GitHub:** [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

---

## 요약 (Executive Summary)

2026년 6월 초, `Miasma`(일명 **'Spring Blight'**)라는 자기 복제형 워밍 악성코드가 Microsoft 공식 PyPI 패키지(`durationtask` v1.5.1~1.5.3)를 감염 매개체로 삼아 Azure Functions 생태계 전반에 침투했다. 이 웜은 GitHub Actions 시크릿과 Azure OIDC 인증 해시를 탈취해 개발자 환경을 통해 은밀히 자가 전파했으며, **6월 8일 단 105초 만에 Microsoft 공식 GitHub 저장소 73개를 비활성화**하는 초고속 공급망 사고로 이어졌다.

탈취된 시크릿은 공개 저장소(`Miasma: The Spring Blight`)에 JSON 형식으로 노출되었으며, 일부 CI/CD 파이프라인도 직·간접 영향을 받은 것으로 추정된다. Microsoft Azure 및 관련 오픈소스 생태계를 사용하는 모든 조직은 즉각적인 자격 증명 순환과 공급망 무결성 검증이 필요하다.

---

## 목차

1. [사건 개요](#1-사건-개요)
2. [공격 벡터 및 감염 경로](#2-공격-벡터-및-감염-경로)
3. [기술 분석](#3-기술-분석)
4. [MITRE ATT&CK 매핑](#4-mitre-attck-매핑)
5. [침해지표 (IoC)](#5-침해지표-ioc)
6. [영향 범위](#6-영향-범위)
7. [대응 권고 (Recommendations)](#7-대응-권고-recommendations)
8. [분석가 평가 및 한계](#8-분석가-평가-및-한계)
9. [참고 자료](#9-참고-자료)

---

## 1. 사건 개요

| 항목 | 내용 |
|---|---|
| **사고 명칭** | Miasma / Spring Blight 공급망 공격 |
| **최초 발견** | 2026년 6월 초 (정확한 날짜 미확인) |
| **주요 사건 발생** | 2026년 6월 8일 |
| **감염 매개체** | PyPI 패키지 `durationtask` v1.5.1 ~ v1.5.3 |
| **피해 규모** | Microsoft 공식 GitHub 저장소 73개 비활성화 |
| **비활성화 소요 시간** | 105초 |
| **주요 피해** | GitHub Actions 시크릿, Azure OIDC 인증 해시 탈취; CI/CD 파이프라인 영향 |
| **공격자 귀속** | 미상 (TBD) |
| **위협 카테고리** | 공급망 공격, 자기 복제형 웜, 자격 증명 탈취 |

---

## 2. 공격 벡터 및 감염 경로

### 2.1 초기 침투: 악성 PyPI 패키지

공격자는 Microsoft 공식 PyPI 패키지 `durationtask`의 세 버전(v1.5.1, v1.5.2, v1.5.3)에 악성 코드를 삽입했다. 이 패키지는 Azure Functions 관련 개발 환경에서 광범위하게 사용되어, 설치 시점에 `preinstall` 훅을 통해 초기 페이로드를 실행했다.

```
감염 흐름:
개발자 환경에서 durationtask 설치
  └─> preinstall 훅 실행
        └─> Bun 런타임 활용 초기 페이로드 드롭
              └─> GitHub Actions 환경변수 / Secret 수집
                    └─> Azure OIDC 토큰 / 관리 ID 해시 추출
                          └─> 탈취 자격 증명으로 인접 저장소 감염 (자기 복제)
```

### 2.2 자가 전파 메커니즘

Miasma 웜의 핵심은 **자기 복제 능력**에 있다. 일단 개발자 환경에 침투하면:

1. GitHub Actions 워크플로우 내 `GITHUB_TOKEN` 및 기타 환경 시크릿을 수집
2. Azure OIDC 인증 흐름에서 사용되는 토큰 해시를 추출
3. 탈취한 자격 증명을 이용해 연결된 저장소에 악성 패키지 버전을 재배포
4. 공개 저장소(`Miasma: The Spring Blight`)에 수집한 시크릿을 JSON으로 업로드

### 2.3 대규모 비활성화 촉발

2026년 6월 8일, GitHub의 자동화된 보안 시스템 또는 내부 탐지 메커니즘이 이상 활동을 감지해 **105초라는 극히 짧은 시간 내에** Microsoft 공식 저장소 73개를 일괄 비활성화했다. 이 속도는 자동화된 대응 시스템의 개입을 강하게 시사한다.

---

## 3. 기술 분석

### 3.1 악성 패키지 분석

- **패키지명:** `durationtask`
- **악성 버전:** v1.5.1, v1.5.2, v1.5.3
- **감염 메커니즘:** `setup.py` 또는 `pyproject.toml` 내 `preinstall` 훅
- **런타임 활용:** Bun(JavaScript 런타임) — Node.js 환경 없이도 실행 가능한 경량 실행 환경 활용

### 3.2 탈취 대상 자격 증명

| 자격 증명 유형 | 탈취 방법 | 피해 수준 |
|---|---|---|
| GitHub Actions Secrets | 환경변수 덤프 | 높음 |
| Azure OIDC 인증 해시 | 토큰 인터셉트 | 매우 높음 |
| GitHub Token (`GITHUB_TOKEN`) | 워크플로우 환경 접근 | 높음 |
| Azure 관리 ID | OIDC 연동 흐름 탈취 | 매우 높음 |

### 3.3 데이터 유출 경로

탈취된 자격 증명은 공개 GitHub 저장소(`Miasma: The Spring Blight`)에 JSON 형식으로 업로드되었다. 이는 공격자가 피해 규모를 과시하거나, 후속 공격을 위해 다른 위협 행위자에게 데이터를 공개적으로 노출했을 가능성을 시사한다.

---

## 4. MITRE ATT&CK 매핑

| Tactic | Technique ID | Technique Name | 관련 행위 |
|---|---|---|---|
| Initial Access | T1195.001 | Supply Chain Compromise: Compromise Software Dependencies | 악성 PyPI 패키지 배포 |
| Execution | T1059.007 | Command and Scripting Interpreter: JavaScript | Bun 런타임 실행 |
| Persistence | T1053 | Scheduled Task/Job | preinstall 훅 실행 |
| Credential Access | T1552.001 | Unsecured Credentials: Credentials In Files | GitHub Secrets 수집 |
| Credential Access | T1528 | Steal Application Access Token | Azure OIDC 토큰 탈취 |
| Lateral Movement | T1550.001 | Use Alternate Authentication Material: Application Access Token | 탈취 토큰으로 저장소 이동 |
| Exfiltration | T1567.001 | Exfiltration Over Web Service: Exfiltration to Code Repository | 공개 GitHub 저장소에 시크릿 업로드 |

---

## 5. 침해지표 (IoC)

> ⚠️ 아래 IoC는 현재까지 공개된 정보를 기반으로 작성되었으며, 추가 분석에 따라 업데이트될 수 있습니다.

### 5.1 악성 패키지

| 유형 | 값 | 비고 |
|---|---|---|
| PyPI Package | `durationtask==1.5.1` | 악성 버전 |
| PyPI Package | `durationtask==1.5.2` | 악성 버전 |
| PyPI Package | `durationtask==1.5.3` | 악성 버전 |

### 5.2 행위 기반 IoC

| 유형 | 값/패턴 | 비고 |
|---|---|---|
| 프로세스 | `bun` 실행 로그 (preinstall 단계) | 비정상 Bun 실행 |
| GitHub 저장소 | `Miasma: The Spring Blight` (공개 저장소명) | 유출 데이터 저장소 |
| 파일 패턴 | JSON 형식의 시크릿 덤프 파일 | 유출 데이터 형식 |
| 네트워크 | GitHub API 대량 호출 (비정상 빈도) | 자기 복제 활동 |

---

## 6. 영향 범위

### 6.1 직접 피해

- **Microsoft 공식 GitHub 저장소 73개** 비활성화 (2026-06-08, 105초 이내)
- Azure Functions 관련 개발 도구 및 SDK 저장소 포함 추정
- GitHub Actions 시크릿 및 Azure OIDC 자격 증명 다수 유출

### 6.2 간접 피해

- `durationtask` 악성 버전을 설치한 **모든 개발자 환경** 잠재적 침해
- 영향 받은 CI/CD 파이프라인을 통해 배포된 **소프트웨어 패키지**의 무결성 훼손 가능성
- Azure Functions를 사용하는 **하위 조직(downstream organizations)** 의 연쇄 피해 가능성

### 6.3 영향 받는 조직 유형

- Azure Functions / Azure DevOps 사용 조직
- Microsoft 공개 저장소 의존성 사용 조직
- Python 기반 CI/CD 파이프라인 운영 조직 (특히 GitHub Actions + Azure 연동)

---

## 7. 대응 권고 (Recommendations)

### 🔴 즉각 조치 (24시간 이내)

1. **자격 증명 즉시 순환 (Rotate)**
   - 모든 Azure OIDC 토큰 및 관리 ID(Managed Identity) 재발급
   - GitHub Actions 시크릿 전체 교체
   - Azure Service Principal 자격 증명 재생성

2. **악성 패키지 제거**
   - `durationtask` v1.5.1 ~ v1.5.3 즉시 제거
   - `pip list` 또는 `pip freeze`로 설치 버전 확인 후 안전 버전으로 다운그레이드 또는 제거
   - `requirements.txt`, `pyproject.toml`, `setup.py` 의존성 목록 점검

3. **침해 여부 확인**
   - CI/CD 로그에서 비정상 `bun` 실행 흔적 조회
   - GitHub Actions 워크플로우 실행 이력 검토
   - 공개 저장소 `Miasma: The Spring Blight`에 자사 시크릿 노출 여부 확인

### 🟡 단기 조치 (7일 이내)

4. **공급망 무결성 검증**
   - 현재 사용 중인 PyPI 패키지 전체에 대해 해시 검증 수행
   - `pip-audit` 또는 `safety` 도구를 CI/CD에 통합
   - Azure Artifacts 또는 프라이빗 패키지 피드 사용 검토

5. **모니터링 강화**
   - GitHub Advanced Security 경보 활성화
   - Azure Defender for DevOps 정책 강화
   - SIEM에 preinstall 훅 실행 탐지 룰 추가

### 🟢 중장기 조치 (30일 이내)

6. **공급망 보안 정책 수립**
   - 사용 허가된 PyPI 패키지 화이트리스트 관리
   - 외부 패키지 버전 고정(pin) 정책 적용
   - SBOM(소프트웨어 자재 명세서) 생성 및 관리 도입

---

## 8. 분석가 평가 및 한계

### 평가

본 사고는 **소프트웨어 공급망 공격의 정교화 수준이 급격히 높아지고 있음**을 보여주는 사례다. 특히:

- **자기 복제 메커니즘**은 단순한 악성 패키지 배포를 넘어 웜 수준의 자가 전파 능력을 구현했으며
- **105초라는 비활성화 시간**은 Microsoft와 GitHub의 자동화 보안 대응 체계가 작동했음을 시사하지만, 그 이전에 이미 광범위한 피해가 발생했을 가능성이 높다
- **OIDC 토큰을 탈취 대상으로 삼은 점**은 단순 토큰 기반을 넘어 클라우드 IAM 체계 전반에 대한 위협으로 진화하고 있음을 의미한다

공격자 귀속(Attribution)은 현재 미상이며, 국가 지원 위협 행위자 또는 고도로 숙련된 금전적 동기의 그룹이 관여했을 가능성을 배제할 수 없다.

### ⚠️ 분석 한계

- 본 보고서는 **공개 정보에 기반한 독립 분석**으로, Microsoft 또는 GitHub의 공식 사고 분석 결과가 아님
- 악성 버전의 상세 코드 분석 및 해시값은 공식 확인 전까지 잠정적으로 처리
- 피해 저장소 목록 및 유출 시크릿의 정확한 범위는 Microsoft 공식 발표 시 업데이트 예정

---

## 9. 참고 자료

- Microsoft Security Response Center (MSRC): https://msrc.microsoft.com/
- GitHub Security Advisories: https://github.com/advisories
- PyPI Advisory Database: https://pypi.org/security/
- MITRE ATT&CK Supply Chain Compromise: https://attack.mitre.org/techniques/T1195/
- CISA Supply Chain Risk Management: https://www.cisa.gov/supply-chain

---

<sub>© 2026 HoKwang Kim (Dennis Kim) · Betalabs Inc. · This report is released under independent research and is provided for informational purposes. All findings are based on publicly available information at the time of writing.</sub>

<sub>📌 리포트 파일명: `CTI-2026-0611-MIASMA_SPRINGBLIGHT_KR.md` | 시리즈: CYBER-THREAT-INTELLIGENCE-REPORT</sub>
