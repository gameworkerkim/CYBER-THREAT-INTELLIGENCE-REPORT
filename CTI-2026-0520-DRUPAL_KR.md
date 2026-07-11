# CTI-2026-0520-DRUPAL

> **TLP:AMBER**
> Dennis Kim CTI · 2026-05-20 (KST) · Pre-Disclosure Advisory

---

## 🇰🇷 한국어

# Drupal 코어 최고위험 취약점 긴급 경보

*PSA-2026-05-18 · 무인증 원격 공격 가능성 · 패치 공개 임박*

발행일: 2026-05-20 (KST) | 분류: 취약점 사전경보(Pre-Disclosure) | 작성: Dennis Kim CTI

### 1. 핵심 요약 (Executive Summary)

Drupal 보안팀은 2026년 5월 18일 사전 경보 **PSA-2026-05-18**을 발행하고, 모든 지원 브랜치를 대상으로 한 **"최고위험(Highly Critical)"** 등급의 코어 보안 릴리스를 한국시간 5월 21일 새벽(02:00~06:00 KST, 5/20 17:00~21:00 UTC)에 공개할 예정이라고 예고했다.

이 사안의 핵심은 두 가지다.

첫째, Drupal 자체 보안 점수 체계에서 **25점 만점 중 20점**으로, 접근 복잡도(Access Complexity)와 인증 요구사항(Authentication)이 모두 "None"으로 평가되어 **사전 인증이나 권한 없이 원격 익스플로잇이 가능**하다.

둘째, 기술 세부가 패치 공개 시점까지 엠바고 상태이므로, 패치가 공개되는 순간 역공학을 통한 익스플로잇이 "수 시간~수일 내" 등장할 수 있다는 점을 Drupal이 직접 경고했다.

> **⚠️ 권고** — 패치 공개 직후가 가장 위험한 구간이다. 사전에 업그레이드 경로를 정비하고, 공개 즉시 적용할 수 있도록 유지보수 창을 확보하라.

#### 1.1 사안 개요

| 항목 | 내용 |
| --- | --- |
| **식별자** | PSA-2026-05-18 (사전 경보) |
| **대상** | Drupal 코어 — 전 지원 브랜치 (Drupal CMS 아님, 코어 한정) |
| **심각도** | **Highly Critical (25점 만점 중 20점)** |
| **접근 복잡도 / 인증** | **None / None (무인증 원격)** |
| **패치 공개** | 2026-05-20 17:00~21:00 UTC (KST 5/21 02:00~06:00) |
| **악용 현황** | 공개 전 — 미확인 / 공개 후 단기 익스플로잇 출현 경고 |
| **완화 서비스** | Drupal Steward (WAF) 일부 알려진 벡터 보호 |

### 2. 영향 범위 (Affected Scope)

Drupal 보안팀의 사전 공지에 따르면, 패치는 다음 지원 브랜치를 대상으로 제공된다. 종료(EOL) 버전에 대해서는 정식 릴리스가 제공되지 않으나, 사안의 심각성을 고려해 일부 구버전에 대한 best-effort 패치 파일이 별도 제공될 예정이다.

| 브랜치 | 지원 상태 | 조치 |
| --- | --- | --- |
| 11.3.x / 11.2.x | 지원 (현행) | 공개 즉시 패치 적용 |
| 10.6.x / 10.5.x | 지원 (현행) | 공개 즉시 패치 적용 |
| 11.1 / 10.4 | 구 마이너 | 최신 패치 적용 후 11.3/10.6으로 이전 권고 |
| 8.9 / 9.5 | EOL (수명 종료) | 수동 적용용 패치 파일만 제공 (회귀 위험 존재) |

> **⚠️ 주의** — Drupal 8/9는 이미 다수의 미해결 취약점을 안고 있어, Steward나 best-effort 패치로도 완전히 보호되지 않는다. 근본 대응은 지원 버전으로의 이전이다.

### 3. 기술 분석 (Technical Analysis)

패치 공개 전까지 근본 원인과 영향 컴포넌트의 구체적 기술 정보는 엠바고 상태다. 따라서 본 절은 공개된 메타데이터와 Drupal 보안 점수 체계로부터의 추론에 기반한다.

#### 3.1 점수 체계 해석

Drupal의 NIST 기반이 아닌 자체 5축 점수 모델(최대 25점)에서 20점은 매우 높은 값이다. "접근 복잡도 None + 인증 None" 조합은 통상 무인증 RCE 또는 무인증 접근통제 우회를 시사한다. 코어 아키텍처 결함이라는 표현과 함께, 영향 분포(target distribution)가 점수에 반영된 점은 표준 구성에서 광범위하게 노출될 가능성을 의미한다.

#### 3.2 "발표 = 공격 개시" 유형

기술 세부를 패치와 동시 공개하는 방식은, 패치 diff를 통한 1-day 익스플로잇 제작을 사실상 허용한다. Drupalgeddon(SA-CORE-2014-005), Drupalgeddon2(CVE-2018-7600) 등 과거 사례에서 Drupal 코어 무인증 취약점은 공개 후 수 시간 내 대량 스캔·자동화 공격으로 이어진 전례가 있다. 이번 PSA의 경고 문구는 동일한 패턴을 예상하게 한다.

### 4. 탐지 및 모니터링 (Detection)

패치 공개 전 단계에서 운영팀이 준비할 수 있는 탐지·관찰 항목은 다음과 같다.

- 웹 접근 로그에서 비정상 POST 요청, 다량의 익명 요청 패턴, 알려진 Drupal 엔드포인트(`/user`, `/node`, `/jsonapi`, `/rest` 등) 대상 비정상 트래픽 급증 모니터링
- 패치 공개 후, Drupal.org 보안 권고에 포함될 IOC와 완화 정보를 즉시 반영
- Drupal Steward(WAF) 사용 사이트는 알려진 공격 벡터에 한해 즉시 보호되나, 추가 벡터 발견 가능성이 있으므로 코드 업데이트를 대체하지 않음
- WAF/IDS 시그니처는 패치 공개 후 보안 벤더 시그니처 업데이트 주기에 맞춰 갱신

### 5. 대응 권고 (Recommendations)

#### 5.1 패치 공개 전 (오늘)

1. 운영 중인 모든 Drupal 인스턴스의 코어 버전·브랜치 인벤토리 작성
2. 각 브랜치의 최신 패치(버그픽스) 릴리스로 선제 업데이트하여, 보안 패치 적용 시 발생할 수 있는 업그레이드 충돌을 사전 제거
3. KST 5/21 새벽 유지보수 창 확보 및 담당자 대기 체계 구성
4. 백업·롤백 절차 점검 (DB 및 파일시스템)

#### 5.2 패치 공개 직후

1. 보안 릴리스 공개 즉시 적용. "수 시간 내 익스플로잇" 경고를 전제로 최우선 처리
2. 적용 불가 시 임시 격리: 관리 인터페이스 접근 IP 제한, 외부 노출 최소화, WAF 규칙 강화
3. EOL(8.9/9.5) 환경은 수동 패치 적용 후 지원 버전 이전 계획 즉시 착수
4. 적용 후 침해 흔적(웹쉘, 비정상 사용자/노드 생성, 예약작업) 점검

### 6. 타임라인 (Timeline)

| 일시 (UTC) | 이벤트 |
| --- | --- |
| 2026-05-18 | Drupal 보안팀, PSA-2026-05-18 사전 경보 발행 |
| 2026-05-19 | 주요 보안 매체(The Register, Hacker News 등) 보도 시작 |
| 2026-05-20 17:00~21:00 | 코어 보안 릴리스 + 정식 권고 공개 예정 (KST 5/21 02:00~06:00) |
| 공개 직후 | Drupal 경고: 수 시간~수일 내 익스플로잇 출현 가능 |

### 7. 출처 (References)

- Drupal.org — PSA-2026-05-18 (drupal.org/psa-2026-05-18)
- The Register — "Drupal warns admins to brace for highly critical core patch" (2026-05-19)
- The Hacker News — "Drupal to Release Urgent Core Security Updates on May 20" (2026-05-19)
- UC Berkeley ISO / The Drop Times — PSA-2026-05-18 분석

*본 문서는 공개 출처(OSINT) 기반의 사전 경보 분석이며, 패치 공개 후 갱신이 필요하다. TLP:AMBER — 소속 조직 및 신뢰 관계자 내 한정 공유.*

---

## 🇺🇸 English

# Drupal Core Highly Critical Vulnerability — Urgent Advisory

*PSA-2026-05-18 · Unauthenticated remote exploitation likely · Patch release imminent*

Published: 2026-05-20 (KST) | Category: Pre-Disclosure Advisory | Author: Dennis Kim CTI

### 1. Executive Summary

On May 18, 2026, the Drupal Security Team issued advance advisory **PSA-2026-05-18**, announcing a **"Highly Critical"** core security release for all supported branches, scheduled for May 20, 2026, 17:00–21:00 UTC (KST May 21, 02:00–06:00).

Two points define the urgency of this case.

First, on Drupal's own security scoring model the issue rates **20 out of 25**, with both Access Complexity and Authentication assessed as "None" — meaning **remote exploitation is possible without prior authentication or privilege**.

Second, technical details remain embargoed until the patch release. The Drupal team has explicitly warned that working exploits could be reverse-engineered from the patch and emerge "within hours or days" of disclosure.

> **⚠️ Recommendation** — The window immediately after patch release is the most dangerous. Prepare your upgrade path in advance and secure a maintenance window so you can apply the fix the moment it drops.

#### 1.1 Case Overview

| Item | Detail |
| --- | --- |
| **Identifier** | PSA-2026-05-18 (advance advisory) |
| **Target** | Drupal core — all supported branches (core only, not Drupal CMS) |
| **Severity** | **Highly Critical (20 out of 25)** |
| **Access Complexity / Auth** | **None / None (unauthenticated, remote)** |
| **Patch Release** | 2026-05-20 17:00–21:00 UTC (KST 5/21 02:00–06:00) |
| **Exploitation** | Pre-disclosure — none confirmed / short-term exploit emergence expected post-release |
| **Mitigation Service** | Drupal Steward (WAF) protects against some known vectors |

### 2. Affected Scope

Per the Drupal Security Team's advance notice, the patch will cover the following supported branches. No formal release is provided for end-of-life (EOL) versions, but given the severity, best-effort patch files for select legacy versions will be made available separately.

| Branch | Support Status | Action |
| --- | --- | --- |
| 11.3.x / 11.2.x | Supported (current) | Apply patch immediately upon release |
| 10.6.x / 10.5.x | Supported (current) | Apply patch immediately upon release |
| 11.1 / 10.4 | Older minor | Apply latest patch, then migrate to 11.3/10.6 |
| 8.9 / 9.5 | EOL (end of life) | Manual patch files only (regression risk) |

> **⚠️ Caution** — Drupal 8/9 already carry numerous unresolved vulnerabilities and are not fully protected by Steward or best-effort patches. The real remedy is migration to a supported version.

### 3. Technical Analysis

Until the patch is released, the root cause and specific affected components remain embargoed. This section is therefore based on published metadata and inference from Drupal's security scoring model.

#### 3.1 Interpreting the Score

On Drupal's own (non-NIST) five-axis scoring model (max 25), a score of 20 is very high. The "Access Complexity None + Authentication None" combination typically signals unauthenticated RCE or unauthenticated access-control bypass. The reference to a core architecture flaw, together with the fact that target distribution factored into the score, indicates the potential for broad exposure under standard configurations.

#### 3.2 The "Disclosure = Attack Onset" Pattern

Releasing technical details simultaneously with the patch effectively enables 1-day exploit development via patch diffing. In past cases — Drupalgeddon (SA-CORE-2014-005) and Drupalgeddon2 (CVE-2018-7600) — unauthenticated Drupal core flaws led to mass scanning and automated attacks within hours of disclosure. This PSA's warning language anticipates the same pattern.

### 4. Detection & Monitoring

Detection and observation tasks operators can prepare during the pre-disclosure phase:

- Monitor web access logs for anomalous POST requests, high volumes of anonymous requests, and traffic spikes against known Drupal endpoints (`/user`, `/node`, `/jsonapi`, `/rest`, etc.)
- After release, immediately incorporate the IOCs and mitigation details that will be included in the Drupal.org security advisory
- Sites using Drupal Steward (WAF) are protected against known attack vectors immediately, but this does not replace the code update, as additional vectors may be discovered
- Update WAF/IDS signatures in line with security vendor signature release cycles following patch disclosure

### 5. Recommendations

#### 5.1 Before Patch Release (Today)

1. Inventory the core version and branch of every Drupal instance in operation
2. Pre-emptively update each branch to its latest patch (bugfix) release to eliminate upgrade conflicts that may arise when applying the security patch
3. Secure a maintenance window for the early hours of KST 5/21 and establish an on-call response structure
4. Verify backup and rollback procedures (database and filesystem)

#### 5.2 Immediately After Patch Release

1. Apply the security release immediately. Treat as top priority on the assumption of the "exploit within hours" warning
2. If the patch cannot be applied: temporarily isolate — restrict admin interface access by IP, minimize external exposure, harden WAF rules
3. For EOL (8.9/9.5) environments, apply the manual patch and immediately begin planning migration to a supported version
4. After patching, check for indicators of compromise (web shells, anomalous user/node creation, scheduled tasks)

### 6. Timeline

| Time (UTC) | Event |
| --- | --- |
| 2026-05-18 | Drupal Security Team issues advance advisory PSA-2026-05-18 |
| 2026-05-19 | Major security outlets (The Register, Hacker News, etc.) begin coverage |
| 2026-05-20 17:00–21:00 | Core security release + formal advisory expected (KST 5/21 02:00–06:00) |
| Immediately after | Drupal warning: exploits may emerge within hours to days |

### 7. References

- Drupal.org — PSA-2026-05-18 (drupal.org/psa-2026-05-18)
- The Register — "Drupal warns admins to brace for highly critical core patch" (2026-05-19)
- The Hacker News — "Drupal to Release Urgent Core Security Updates on May 20" (2026-05-19)
- UC Berkeley ISO / The Drop Times — PSA-2026-05-18 analysis

*This document is an OSINT-based pre-disclosure analysis and requires updating after the patch is released. TLP:AMBER — share only within your organization and trusted parties.*
