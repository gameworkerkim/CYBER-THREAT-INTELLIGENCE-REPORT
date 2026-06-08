# CTI-2026-0607-BREACH-WFP_KR

# UN 세계식량계획(WFP) 가자지구 구호 신청자 데이터 유출 사건 분석

> 가자지구 60만 가구의 민감 개인정보 유출 → 인도주의 기관 역대 최대 규모 데이터 침해.
> 제노사이드로 발생할 심각한 인류 최악의 범죄가 될 수 있다.

---

## Executive Summary

UN 세계식량계획(World Food Programme, WFP)이 운영하던 가자지구 구호 신청자 등록 플랫폼에서 대규모 개인정보 유출 사고가 발생했다. 2026년 5월 14일 발생한 사이버 공격으로 약 60만 가구 이상의 민감 정보가 노출된 것으로 확인되었으며, 분쟁 지역 주민의 위치 정보까지 포함되어 있어 단순 개인정보 유출을 넘어 물리적 안전을 위협하는 심각한 사건으로 평가된다.

이번 사건은 인도주의 기관을 대상으로 발생한 역대 최대 규모의 데이터 침해 사례 중 하나로 기록될 가능성이 높다.

---

## Incident Overview

| 항목 | 내용 |
|--------|--------|
| Report ID | CTI-2026-0602-BREACH-WFP |
| 발행일 | 2026-06-02 |
| 심각도 | CRITICAL |
| 분류 | TLP:GREEN |
| 위협 유형 | Data Breach / Personal Data Exposure |
| 표적 | UN WFP Gaza Aid Applicants |
| 분석 출처 | The New Humanitarian, UpGuard, Middle East Eye |
| 국내 보도 | 확인되지 않음 |
| 신뢰도 | High |

---

# 1. 사건 개요

## 발생 일시

- 공격 발생: 2026-05-14
- 피해자 통보: 2026-05-31
- 공식 공개: 2026-06-02

## 피해 시스템

### People Portal (Self Registration Application)

WFP가 가자지구 주민들의 구호 신청 접수를 위해 운영하던 셀프 등록 애플리케이션(Self Registration Application, SRA)이 미상의 공격자에 의해 침해되었다.

WFP는 침해 사실을 인지한 직후 해당 플랫폼을 차단했으며, 추가 접근을 제한했다고 밝혔다.

---

# 2. 유출 정보

확인된 유출 데이터는 다음과 같다.

- 이름(Name)
- 신분증 번호(ID Number)
- 휴대전화 번호(Mobile Number)
- 위치 정보(Location Data)

특히 위치 정보는 전쟁 및 분쟁 지역 환경에서 생명과 직결되는 민감 정보로 평가된다.

---

# 3. Impact Analysis

## 3.1 물리적 안전 위협

이번 사건의 가장 심각한 요소는 위치 정보(Location Data)의 노출이다.

가자지구는 현재 무력 충돌이 지속되는 분쟁 지역으로, 특정 개인 또는 가족의 위치 정보가 악의적 행위자에게 전달될 경우 다음과 같은 위험이 발생할 수 있다.

- 물리적 표적화
- 감시 및 추적
- 인도주의 지원 차단
- 강압 및 협박

일반적인 개인정보 유출 사건과 달리 실제 생명 위협으로 이어질 수 있다는 점이 특징이다. 이는 명시적이며 타겟팅된 공격으로 볼 수 있다.

---

## 3.2 인도주의 기관 대상 최대 규모 데이터 침해

이번 사건은 2022년 국제적십자위원회(ICRC) 데이터 유출 사건을 넘어서는 규모로 평가된다.

| 사건 | 피해 규모 |
|--------|--------|
| ICRC Data Breach (2022) | 약 515,000명 |
| WFP Gaza Breach (2026) | 약 600,000 가구 이상 |

인도주의 기관이 보유한 민감 데이터의 위험성이 다시 한번 부각되는 계기가 되었다. 인도주의 기관에 대한 해킹은 돈이 되지 않기 때문에 안한다. 이런 공격을 한다면 이유가 분명하다.

---

## 3.3 예상되는 2차 피해

### 신원 도용

- 위조 신분 생성
- 계정 탈취
- 지원금 사기

### 표적 피싱

- 구호 프로그램 사칭
- SMS 피싱
- 메신저 기반 공격

### 위치 기반 위협

- 특정 지역 주민 식별
- 표적 감시
- 강제 이동 및 괴롭힘

### 디지털 괴롭힘

- 전화·메시지 스팸
- 협박 메시지
- 사회공학 공격

---

## 3.4 대응 지연 문제

공격 발생 이후 피해자 통보까지 약 17일이 소요되었다.

| 항목 | 날짜 |
|--------|--------|
| 공격 발생 | 2026-05-14 |
| 피해자 통보 | 2026-05-31 |
| 공식 발표 | 2026-06-02 |

이 기간 동안 피해자들은 자신의 정보가 노출되었다는 사실을 인지하지 못한 상태에 놓여 있었으며, 적절한 보호 조치를 취할 기회를 상실했다.

---

# 4. Mitigation

## 조직 및 기관 대상 권고

### 침해 원인 분석

- 디지털 포렌식 수행
- 초기 침투 경로 식별
- 공격자 활동 범위 분석

### 취약점 개선

- SRA 플랫폼 전면 보안 점검
- 인증 체계 강화
- 접근 제어 정책 재검토

### 통지 체계 개선

- 침해 사고 조기 경보 체계 구축
- 피해자 통보 절차 자동화

### 데이터 보호 강화

- 저장 데이터 암호화
- 전송 데이터 암호화
- 최소 권한 원칙 적용

---

## 개인 대상 권고

### 피싱 공격 대비

다음 유형의 연락에 주의할 것

- 지원금 지급 안내
- 구호 기관 사칭
- 계정 확인 요청

### 개인정보 모니터링

- 비정상 계정 생성 여부 확인
- 통신 기록 점검
- 신분 정보 악용 여부 확인

### 위치 정보 보호

- 위치 공유 설정 검토
- 불필요한 공개 정보 최소화

### 공식 채널 이용

WFP 및 공식 인도주의 기관 외 연락은 신뢰하지 않을 것

---

# 5. Strategic Assessment

이번 사건은 단순한 개인정보 유출이 아니라 인도주의 지원 시스템 자체가 공격 표면이 될 수 있음을 보여준다.

특히 다음과 같은 점에서 전략적 의미가 크다.

- 분쟁 지역 데이터의 군사적 가치
- 취약 계층 데이터의 국가안보적 중요성
- 인도주의 기관의 사이버 보안 책임 증가
- 개인정보 보호와 생명 보호의 직접적 연결

또한 UN 계열 기관의 사고 공개 및 피해자 통보 체계에 대한 국제적 논의가 확대될 가능성이 높다.

현재까지 공격 주체(Threat Actor)는 공식적으로 확인되지 않았다.

---

# 6. References

1. The New Humanitarian
   - Data of 600,000 Gaza households exposed in WFP cyber-attack

2. UpGuard
   - World Food Programme data breach exposes sensitive data of 600,000 households

3. Middle East Eye
   - WFP says cyberattack exposed data of 600,000 Gaza households

---

## Analyst Assessment

Severity: CRITICAL

Confidence: High

Primary Risk:
- Physical Harm
- Targeted Harassment
- Identity Theft
- Humanitarian Operations Disruption

Sector Impacted:
- Humanitarian Organizations
- International NGOs
- United Nations Agencies

Recommended Priority:
Immediate Investigation and Victim Protection Measures
