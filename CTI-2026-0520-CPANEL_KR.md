# CTI-2026-0520-CPANEL

> **TLP:RED**
> Dennis Kim CTI | 2026-05-20 (KST) | Mass Exploitation

---

## 한국어 (Korean)

# cPanel & WHM 인증 우회 (CVE-2026-41940)

*CVSS 9.8 · CRLF 인젝션 무인증 RCE급 · 대량 악용 진행 중*

발행일: 2026-05-20 (KST) | 분류: 대량 악용 취약점(Mass Exploitation) | 작성: Dennis Kim CTI

### 1. 핵심 요약 (Executive Summary)

CVE-2026-41940은 cPanel과 WHM(WebHost Manager)의 **사전 인증 인증 우회(pre-auth authentication bypass)** 취약점으로, CVSS **9.8**(일부 평가 10.0)이다. 자격증명 없이 네트워크 접근만으로 **루트 수준 제어를 획득**할 수 있으며, 2단계 인증(2FA)도 이 익스플로잇을 막지 못한다.

이미 **공개 24시간 내 다수 행위자가 무기화**했고, Mirai 봇넷 변종과 'Sorry' 랜섬웨어가 배포되었다. Shadowserver 기준 약 **44,000개 IP가 침해된 것으로 추정**되며, 인터넷 노출 cPanel 인스턴스는 약 150만 개로 집계된다. 특히 실제 공격은 패치 공개(4/28) 약 두 달 전인 2026년 2월 23일까지 거슬러 올라가, 사실상 장기 제로데이로 악용된 정황이 있다.

> **핵심** — 한국 호스팅 사업자와 자체 cPanel 운영 환경도 광범위한 대상이다. 패치 적용 여부와 IOC 스캔 결과를 반드시 확인하라.

#### 1.1 사안 개요

| 항목 | 내용 |
| --- | --- |
| **CVE** | CVE-2026-41940 |
| **분류** | 인증 우회 (Authentication Bypass) — CRLF 인젝션 기반 |
| **CVSS** | **9.8 (NVD) / 일부 평가 10.0** |
| **영향 버전** | **11.40 이후 모든 cPanel & WHM (DNSOnly 포함)** |
| **인증 요구** | **없음 (무인증, 네트워크 접근만)** |
| **2FA 보호** | **무력 (2FA 우회됨)** |
| **악용 현황** | **대량 악용 중 (CISA KEV 등재, 44,000 IP 침해 추정)** |
| **패치 버전** | 11.136.0.5 등 / WP Squared 136.1.7 |
| **제로데이 기간** | 2026-02-23 ~ 04-28 (약 2개월 선행 악용 정황) |

### 2. 기술 분석 (Technical Analysis)

이 취약점은 세 개의 결함이 연쇄(chain)된 구조다.

1. Basic-auth 핸들러가 CRLF(Carriage Return Line Feed) 문자를 정제하지 못해, 공격자가 `Authorization: Basic` 헤더에 임의 헤더 값을 주입
2. 절단된(truncated) 쿠키가 세션의 암호화 계층을 비활성화
3. 세션 캐시가 주입된 값을 재파싱하면서, 미인증 세션을 인증된 세션으로 승격

결과적으로 cpsrvd(cPanel 서비스 데몬)가 인증 발생 전에 새 세션을 디스크에 기록하는 과정에서, 공격자가 newline 인젝션과 변조된 세션 값으로 사전 인증 세션 데이터를 오염시킨다. 이로써 웹사이트·데이터베이스·이메일 계정 등 전체 서버에 대한 접근이 가능해진다.

> **후속 행위 (관측)** — 루트 비밀번호 변경, UID=0 신규 사용자 생성, /root/.ssh/authorized_keys에 악성 SSH 키 추가, 추가 SSH 포트(2222·8080·22000) 개방, /etc/shadow 및 SSH 개인키 탈취, 광범위한 시스템·네트워크 정찰.

### 3. 영향 및 악용 규모 (Impact & Scale)

| 지표 | 수치 / 내용 |
| --- | --- |
| 침해 IP (Shadowserver) | 약 44,000개 (2026-04-30 기준), 5/3 시점 3,540개로 감소 |
| 인터넷 노출 인스턴스 | 약 150만 개 (Shodan/Rapid7) |
| .sorry 암호화 파일 호스트 | 8,859개 중 7,135개가 cPanel/WHM 확인 (Censys) |
| 악용 개시 시점 | 2026-02-23 (KnownHost 확인) — 패치 2개월 전 |
| 표적 | 동남아 정부·군(필리핀 *.mil.ph, 라오스 *.gov.la), MSP·호스팅 |
| 배포 악성코드 | Mirai 봇넷 변종, 'Sorry' 랜섬웨어 |

### 4. 탐지 및 침해 점검 (Detection)

#### 4.1 공식 IOC 스크립트

cPanel은 세션 파일을 스캔하는 IOC 탐지 스크립트(ioc_checksessions_files.sh)를 공식 권고에 게시했다. /var/cpanel/sessions/raw/ 하위 세션 파일에서 인젝션 흔적을 점검한다.

```bash
/bin/bash ./ioc_checksessions_files.sh
```

- 탐지 대상: badpass 출처 세션 내 `token_denied`와 공격자 주입 `cp_security_token` 공존, 사전 인증 세션 내 `authenticated` 속성, 의심 `tfa_verified` 상태, 변조된 다중행 password 값
- **CRITICAL/WARNING 결과 = 침해 정황 → 즉시 대응 필요**

> **주의 (오탐)** — 상위(upstream) cPanel 스크립트의 다중행 pass 정규식은 프로덕션의 모든 인증 세션에서 오탐을 일으킨다는 지적이 있다. 커뮤니티 개선판(로그 교차 상관 포함)을 병행 검토하되, 결과는 반드시 사람이 검증할 것.

#### 4.2 로그 기반 점검

- /usr/local/cpanel/logs/access_log 및 세션 디렉토리에서 예기치 않은 세션, 비정상 로그인, `user=root` 또는 `hasroot=1` 속성이 주입된 세션 파일 검토
- 실패 로그인(POST /login/?login_only=1 → 401) 직후 동일 IP에서 성공적 cpsess 토큰 사용이 이어지는 패턴 상관 분석 (세션 만료·삭제된 경우의 과거 악용 탐지)
- /var/log/wtmp, WHM 접근 로그 감사

### 5. 대응 권고 (Recommendations)

1. 즉시 패치: `/scripts/upcp --force` 로 11.136.0.5 등 패치 버전으로 강제 업데이트, 버전 확인 후 재시작 (`/usr/local/cpanel/cpanel -V`)
2. 즉시 패치 불가 시: 방화벽에서 인바운드 포트 2083·2087·2095·2096 차단
3. IOC 스크립트 실행 → 침해 정황 시 영향 세션 퍼지, root 및 전체 WHM 사용자 비밀번호 강제 재설정
4. 지속성(persistence) 점검: cron 항목, authorized_keys 내 미상 SSH 키, 비표준 SSH 포트, UID=0 신규 계정, WHM hooks 감사 및 제거
5. 관리형 호스팅 이용 시: 제공사에 패치 적용 상태와 클린 IOC 스캔 결과를 서면으로 확인 (속도 차이가 큼 — 일부 사업자는 수 시간 내, 일부는 지연)
6. EOL 버전 운영 시: 패치 미수령 → 지원 버전으로 업그레이드가 유일한 완전 해결책

### 6. 타임라인 (Timeline)

| 일시 | 이벤트 |
| --- | --- |
| 2026-02-23 | 실제 악용 개시 (KnownHost 확인) — 사실상 장기 제로데이 |
| 2026-04-28 | cPanel 패치 공개 (11.136.0.5 등) + IOC 스크립트 게시 |
| 2026-04-29 | 공개 24시간 내 다수 행위자 무기화, Mirai·Sorry 랜섬웨어 배포 (Censys) |
| 2026-04-30 | Shadowserver — 약 44,000 IP 침해 추정 |
| 2026-05-02 | Ctrl-Alt-Intel — 동남아 정부·군·MSP 표적 캠페인 탐지 |
| 2026-05-03 | 침해 IP 추정치 3,540개로 감소, 탐지 스크립트 오탐 보정 업데이트 |

### 7. 출처 (References)

- cPanel 공식 보안 권고 (support.cpanel.net, 04-28-2026) + IOC 스크립트
- The Hacker News — "Critical cPanel Vulnerability Weaponized" / "Auth Vulnerability Identified"
- SOC Prime, CybelAngel, CyCognito, Undercode Testing — 기술 분석 및 규모 집계
- Shadowserver Foundation, Censys, Rapid7, Shodan — 노출·침해 통계

*본 문서는 공개 출처 기반 분석이다. PoC가 공개 유통 중이므로 노출 자산은 즉시 점검할 것. TLP:RED 준하여 취급 권장.*

---

## English

# cPanel & WHM Authentication Bypass (CVE-2026-41940)

*CVSS 9.8 · CRLF injection, unauthenticated RCE-class · Mass exploitation ongoing*

Published: 2026-05-20 (KST) | Category: Mass Exploitation | Author: Dennis Kim CTI

### 1. Executive Summary

CVE-2026-41940 is a **pre-auth authentication bypass** vulnerability in cPanel and WHM (WebHost Manager), rated CVSS **9.8** (some assessments rate it 10.0). With only network access and no credentials, an attacker can **gain root-level control**, and two-factor authentication (2FA) does not stop this exploit.

It was **weaponized by multiple actors within 24 hours of disclosure**, with a Mirai botnet variant and the 'Sorry' ransomware deployed. Shadowserver estimates approximately **44,000 IPs were compromised**, and internet-exposed cPanel instances are counted at around 1.5 million. Notably, real-world attacks trace back to February 23, 2026 — roughly two months before the patch release (4/28) — indicating it was effectively exploited as a long-running zero-day.

> **Key point** — Korean hosting providers and self-managed cPanel environments are also broadly in scope. Be sure to verify patch status and IOC scan results.

#### 1.1 Case Overview

| Item | Detail |
| --- | --- |
| **CVE** | CVE-2026-41940 |
| **Classification** | Authentication Bypass — CRLF injection based |
| **CVSS** | **9.8 (NVD) / some assessments 10.0** |
| **Affected Versions** | **All cPanel & WHM after 11.40 (including DNSOnly)** |
| **Authentication Required** | **None (unauthenticated, network access only)** |
| **2FA Protection** | **Ineffective (2FA bypassed)** |
| **Exploitation** | **Mass exploitation ongoing (CISA KEV listed, ~44,000 IPs compromised)** |
| **Patched Versions** | 11.136.0.5 and others / WP Squared 136.1.7 |
| **Zero-Day Window** | 2026-02-23 ~ 04-28 (evidence of ~2 months of prior exploitation) |

### 2. Technical Analysis

This vulnerability is a chain of three flaws.

1. The Basic-auth handler fails to sanitize CRLF (Carriage Return Line Feed) characters, allowing the attacker to inject arbitrary header values into the `Authorization: Basic` header
2. A truncated cookie disables the session's encryption layer
3. The session cache re-parses the injected values, elevating an unauthenticated session to an authenticated one

As a result, while cpsrvd (the cPanel service daemon) writes a new session to disk before authentication occurs, the attacker poisons the pre-authentication session data with newline injection and tampered session values. This grants access to the entire server, including websites, databases, and email accounts.

> **Follow-on Actions (Observed)** — Changing the root password, creating a new UID=0 user, adding a malicious SSH key to /root/.ssh/authorized_keys, opening additional SSH ports (2222/8080/22000), exfiltrating /etc/shadow and SSH private keys, and extensive system and network reconnaissance.

### 3. Impact and Scale

| Indicator | Figure / Detail |
| --- | --- |
| Compromised IPs (Shadowserver) | ~44,000 (as of 2026-04-30), down to 3,540 as of 5/3 |
| Internet-exposed instances | ~1.5 million (Shodan/Rapid7) |
| Hosts with .sorry encrypted files | 7,135 of 8,859 confirmed as cPanel/WHM (Censys) |
| Exploitation start | 2026-02-23 (KnownHost confirmed) — two months before patch |
| Targets | SE Asia gov/military (Philippines *.mil.ph, Laos *.gov.la), MSPs/hosting |
| Deployed malware | Mirai botnet variant, 'Sorry' ransomware |

### 4. Detection and Compromise Inspection

#### 4.1 Official IOC Script

cPanel published an IOC detection script (ioc_checksessions_files.sh) in its official advisory that scans session files. It checks for injection traces in session files under /var/cpanel/sessions/raw/.

```bash
/bin/bash ./ioc_checksessions_files.sh
```

- Detection targets: co-existence of `token_denied` and attacker-injected `cp_security_token` in badpass-origin sessions, an `authenticated` attribute in pre-auth sessions, suspicious `tfa_verified` states, and tampered multi-line password values
- **CRITICAL/WARNING result = signs of compromise → immediate response required**

> **Caution (False Positives)** — There are reports that the upstream cPanel script's multi-line pass regex produces false positives on every authenticated session in production. Consider community-improved versions (including log cross-correlation) in parallel, but always have a human verify the results.

#### 4.2 Log-Based Inspection

- Review /usr/local/cpanel/logs/access_log and the session directory for unexpected sessions, anomalous logins, and session files with injected `user=root` or `hasroot=1` attributes
- Correlate patterns where a failed login (POST /login/?login_only=1 → 401) is immediately followed by successful cpsess token usage from the same IP (detecting past exploitation where sessions expired or were deleted)
- Audit /var/log/wtmp and WHM access logs

### 5. Recommendations

1. Patch immediately: force-update to a patched version such as 11.136.0.5 with `/scripts/upcp --force`, verify the version, and restart (`/usr/local/cpanel/cpanel -V`)
2. If immediate patching is not possible: block inbound ports 2083/2087/2095/2096 at the firewall
3. Run the IOC script → on signs of compromise, purge affected sessions and force-reset passwords for root and all WHM users
4. Check for persistence: audit and remove cron entries, unknown SSH keys in authorized_keys, non-standard SSH ports, new UID=0 accounts, and WHM hooks
5. If using managed hosting: obtain written confirmation of patch status and a clean IOC scan result from the provider (response speeds vary widely — some within hours, some delayed)
6. For EOL versions: no patch will be received → upgrading to a supported version is the only complete remedy

### 6. Timeline

| Date | Event |
| --- | --- |
| 2026-02-23 | Real-world exploitation begins (KnownHost confirmed) — effectively a long-running zero-day |
| 2026-04-28 | cPanel patch released (11.136.0.5 etc.) + IOC script published |
| 2026-04-29 | Weaponized by multiple actors within 24 hours, Mirai/Sorry ransomware deployed (Censys) |
| 2026-04-30 | Shadowserver — ~44,000 IPs estimated compromised |
| 2026-05-02 | Ctrl-Alt-Intel — campaign targeting SE Asia gov/military/MSPs detected |
| 2026-05-03 | Compromised IP estimate down to 3,540, detection script updated for false-positive correction |

### 7. References

- cPanel official security advisory (support.cpanel.net, 04-28-2026) + IOC script
- The Hacker News — "Critical cPanel Vulnerability Weaponized" / "Auth Vulnerability Identified"
- SOC Prime, CybelAngel, CyCognito, Undercode Testing — technical analysis and scale figures
- Shadowserver Foundation, Censys, Rapid7, Shodan — exposure and compromise statistics

*This document is an OSINT-based analysis. A PoC is in public circulation, so inspect exposed assets immediately. Handle in accordance with TLP:RED.*
