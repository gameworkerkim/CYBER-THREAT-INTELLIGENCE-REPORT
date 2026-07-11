# CTI-2026-0520-EXCHANGE

> **TLP:RED**
> Dennis Kim CTI | 2026-05-20 (KST) | In-the-Wild Zero-Day

---

## 한국어 (Korean)

# Microsoft Exchange OWA 제로데이 (CVE-2026-42897)

*실제 공격 악용 중 · 영구 패치 부재 · 임시 완화만 가능*

발행일: 2026-05-20 (KST) | 분류: 활성 악용 제로데이(In-the-Wild) | 작성: Dennis Kim CTI

### 1. 핵심 요약 (Executive Summary)

Microsoft는 2026년 5월 14일, 온프레미스 Exchange Server의 Outlook Web Access(OWA) 컴포넌트에 존재하는 제로데이 **CVE-2026-42897**을 공개하고, 이미 **실제 공격에 악용 중**임을 확인했다. 5월 정기 패치(Patch Tuesday) 48시간 뒤에 별도로 공개된 케이스로, **현재까지 영구 패치는 제공되지 않으며 임시 완화책만 존재**한다.

공격자는 특수 제작한 이메일을 표적에게 전송하기만 하면 되며, 사전 인증·자격증명·서버 접근이 전혀 필요 없다. 수신자가 해당 메일을 OWA에서 열고 특정 상호작용 조건이 충족되면 **피해자의 인증된 브라우저 세션 컨텍스트에서 임의 JavaScript가 실행**된다. 이를 통해 세션 토큰 탈취, 메일함 위장(impersonation), 메일 열람·발송, 자동 전달 규칙 삽입 등이 가능하다.

> **핵심** — 위협의 본질은 "서버 장악"이 아니라 "메일함 장악"이다. 비밀번호를 재설정해도 삽입된 전달 규칙은 잔존할 수 있어, 침해 후 정밀 점검이 필수다.

#### 1.1 사안 개요

| 항목 | 내용 |
| --- | --- |
| **CVE** | CVE-2026-42897 |
| **분류** | 스푸핑 / 저장형·반사형 XSS (OWA 웹페이지 생성 시 입력 부적절 처리) |
| **CVSS** | **8.1 (Microsoft) / 6.1 (NIST NVD) — 평가 상이** |
| **인증 요구** | **없음 (무인증, 이메일 발송만으로 개시)** |
| **악용 현황** | **활성 악용 확인 (CISA KEV 등재 5/15)** |
| **영구 패치** | 미제공 (개발 중) |
| **완화 식별자** | EEMS 자동 완화 M2.1.x (URL Rewrite 기반) |
| **연방 시한** | CISA — 2026-05-29까지 완화 의무 (FCEB) |

### 2. 영향 범위 (Affected Scope)

| 대상 | 영향 여부 | 비고 |
| --- | --- | --- |
| Exchange Server 2016 | 영향 | CU23 / Period 2 ESU 등록자만 영구패치 수령 예정 |
| Exchange Server 2019 | 영향 | CU14·CU15 / Period 2 ESU 필요 |
| Exchange Server SE | 영향 | 공개 보안 업데이트로 패치 예정 |
| Exchange Online | 영향 없음 | 클라우드는 비영향 — 마이그레이션 가속 근거 |

> **경고** — Period 1 전용 ESU 고객은 2016/2019 영구 패치 대상에서 제외된다(Period 1은 2026년 4월 종료). 해당 환경은 임시 완화 외 보호 수단이 제한적이므로 마이그레이션이 시급하다.

### 3. 기술 분석 (Technical Analysis)

#### 3.1 공격 체인

1. 공격자가 악성 JavaScript 페이로드가 포함된 HTML 메일을 제작 (OWA 웹페이지 생성 단계의 입력 무력화 미흡 악용)
2. 표적 메일함으로 전달 — 사전 서버 접근 불필요. 전달 경로는 조직의 정상 메일 시스템 자체
3. 수신자가 OWA(브라우저)에서 메일을 열고 특정 상호작용 조건 충족 시, 피해자의 활성 OWA 세션 컨텍스트에서 임의 JS 실행
4. 세션 토큰 탈취 → 메일 열람·외부 유출, 위장 발송, 사일런트 외부 전달 규칙 삽입 등 후속 행위

#### 3.2 영향의 본질

XSS는 흔히 저위험 웹 결함으로 간주되지만, 표적이 기업 메일 서버일 때는 다르다. OWA는 다수 조직에서 브라우저 기반 주 접근점이며, 인증된 세션을 탈취당하면 자격증명 없이도 피해자 권한으로 행위가 가능하다. 데스크톱 Outlook, ActiveSync 등 다른 접근 경로를 통한 악용 사례는 현재까지 확인되지 않았고, 악용은 OWA 메일 렌더링 경로에 한정 관측되었다.

#### 3.3 완화의 한계

Internet Explorer 또는 IE 모드 Edge로 OWA에 접근하는 경우 완화가 동작하지 않는다(IE는 Content Security Policy 미지원). 또한 WAF의 일반적인 "의심 스크립트 차단" 규칙은 권장되지 않는다 — 악성 콘텐츠가 메일 처리 경로를 거쳐 OWA에서 렌더링되는 구조상, WAF는 원본 메시지를 Exchange가 저장·렌더링하는 형태로 보지 못할 수 있기 때문이다. 공식 완화 경로는 Microsoft가 제공하는 EEMS/EOMT다.

### 4. 완화 적용 절차 (Mitigation)

#### 4.1 EEMS 자동 완화 (권장)

EEMS(Exchange Emergency Mitigation Service)는 2021년 9월 도입되어 메일함 역할 서버에서 기본 활성화되어 있다. CVE-2026-42897에 대한 완화 M2.1.x는 이미 게시되어 자동 적용된다.

- 상태 확인: Exchange Health Checker 스크립트 실행 (aka.ms/ExchangeHealthChecker) → HTML 리포트의 EEMS 점검 섹션 확인
- EEMS 비활성 상태라면 즉시 활성화
- 주의: 2023년 3월 누적 업데이트(CU) 이전 버전은 EEMS가 신규 완화를 가져오지 못함

#### 4.2 EOMT 수동 완화 (에어갭 / EEMS 불가 환경)

인터넷 차단 환경이거나 EEMS를 쓸 수 없는 경우, 최신 EOMT(Exchange On-premises Mitigation Tool)를 내려받아 관리자 권한 Exchange Management Shell에서 실행한다.

```powershell
# 단일 서버
.\EOMT.ps1 -CVE "CVE-2026-42897"

# 전체 플릿
Get-ExchangeServer | Where-Object { $_.ServerRole -ne "Edge" } | .\EOMT.ps1 -CVE "CVE-2026-42897"
```

#### 4.3 알려진 부작용 (사용자 사전 공지)

- OWA 일정(Calendar) 인쇄 기능 미작동 → 스크린샷 또는 Outlook 데스크톱 사용
- OWA 읽기 창의 인라인 이미지 비정상 표시 → 이미지를 첨부로 발송
- OWA light(`?layout=light`) 미작동 → 이미 지원 종료된 기능, 운영 영향 없음
- 완화 상세에 "Mitigation invalid for this exchange version" 표기 가능 → 상태가 "Applied"면 정상 적용된 것(표시상 결함)

### 5. 탐지 및 침해 점검 (Detection)

- SIEM에서 비정상 OWA 트래픽 및 의심 URL 파라미터 요청에 대한 알림 설정
- 완화 적용 전 최근 7일치 OWA 로그에서 악용 시도로 의심되는 이상 요청 검토
- 메일함 규칙(특히 외부 자동 전달) 신규 생성·변경 감사 — 비밀번호 재설정 후에도 잔존하는 전달 규칙 확인
- 이상 세션 토큰 사용, 예기치 않은 메일 발송, 인증 계정의 비정상 데이터 접근 패턴 모니터링

> **운영 권고** — 프로덕션에서 무기화된 XSS 재현으로 "취약 증명"을 시도하지 말 것. 완화 증명·노출 증명·통제 증명(EEMS/M2 적용 여부, OWA 노출 인벤토리, IIS 로그 점검)이 더 안전하고 실질적이다.

### 6. 대응 권고 (Recommendations)

1. 온프레미스 Exchange 2016/2019/SE 전수 인벤토리 및 OWA 외부 노출 여부 확인
2. EEMS 활성·연결·M2 적용 상태 확인, 미적용 시 EOMT 수동 적용 (오늘 즉시)
3. 영구 패치는 "patch now, no exceptions" 원칙으로 출시 즉시 적용 계획 수립
4. Period 2 ESU 등록 여부 확인 (2016/2019 영구패치 수령 조건)
5. 중장기: Exchange Online/하이브리드 이전 검토 — 클라우드는 비영향

### 7. 타임라인 (Timeline)

| 일시 | 이벤트 |
| --- | --- |
| 2026-05-12 | 5월 Patch Tuesday — 다수 취약점 패치, 제로데이 미포함 |
| 2026-05-14 | CVE-2026-42897 공개, 활성 악용 확인, EEMS 완화 M2.1.x 배포 |
| 2026-05-15 | CISA KEV 등재, FCEB 연방기관 완화 시한 5/29 부여 |
| 2026-05-18~19 | 추가 분석 보도 — 완화 부작용 및 ESU 적용 격차 부각 |
| 미정 | 영구 보안 업데이트 출시 (SE 공개, 2016/2019는 Period 2 ESU) |

### 8. 출처 (References)

- Microsoft Tech Community — "Addressing Exchange Server May 2026 vulnerability CVE-2026-42897"
- BleepingComputer / Dark Reading / SecurityWeek — 2026-05-15~19 보도
- CISA KEV Catalog (등재일 2026-05-15)
- Centre for Cybersecurity Belgium (CCB) 권고

*본 문서는 공개 출처 기반 분석이다. 위협 행위자 귀속(attribution)은 현재 미공개. 영구 패치 출시 시 갱신 필요. TLP:RED — 명시된 수신자에 한해 공유.*

---

## English

# Microsoft Exchange OWA Zero-Day (CVE-2026-42897)

*Actively exploited in the wild · No permanent patch · Interim mitigation only*

Published: 2026-05-20 (KST) | Category: In-the-Wild Zero-Day | Author: Dennis Kim CTI

### 1. Executive Summary

On May 14, 2026, Microsoft disclosed **CVE-2026-42897**, a zero-day in the Outlook Web Access (OWA) component of on-premises Exchange Server, and confirmed it is **already being exploited in the wild**. Disclosed separately 48 hours after the May Patch Tuesday, **no permanent patch is yet available — only interim mitigations exist**.

An attacker only needs to send a specially crafted email to the target; no prior authentication, credentials, or server access is required. When the recipient opens the email in OWA and certain interaction conditions are met, **arbitrary JavaScript executes in the context of the victim's authenticated browser session**. This enables session token theft, mailbox impersonation, reading and sending mail, and insertion of auto-forwarding rules.

> **Key point** — The essence of this threat is not "server compromise" but "mailbox compromise." Inserted forwarding rules can persist even after a password reset, so thorough post-compromise inspection is essential.

#### 1.1 Case Overview

| Item | Detail |
| --- | --- |
| **CVE** | CVE-2026-42897 |
| **Classification** | Spoofing / stored and reflected XSS (improper input handling during OWA web page generation) |
| **CVSS** | **8.1 (Microsoft) / 6.1 (NIST NVD) — divergent ratings** |
| **Authentication Required** | **None (unauthenticated; initiated by sending an email)** |
| **Exploitation** | **Active exploitation confirmed (CISA KEV listed 5/15)** |
| **Permanent Patch** | Not available (in development) |
| **Mitigation ID** | EEMS automatic mitigation M2.1.x (URL Rewrite based) |
| **Federal Deadline** | CISA — mitigation required by 2026-05-29 (FCEB) |

### 2. Affected Scope

| Target | Affected | Notes |
| --- | --- | --- |
| Exchange Server 2016 | Affected | CU23 / permanent patch only for Period 2 ESU enrollees |
| Exchange Server 2019 | Affected | CU14/CU15 / Period 2 ESU required |
| Exchange Server SE | Affected | To be patched via public security update |
| Exchange Online | Not affected | Cloud is unaffected — basis for accelerating migration |

> **Warning** — Period 1-only ESU customers are excluded from the 2016/2019 permanent patch (Period 1 ended April 2026). These environments have limited protection beyond interim mitigation, making migration urgent.

### 3. Technical Analysis

#### 3.1 Attack Chain

1. The attacker crafts an HTML email containing a malicious JavaScript payload (exploiting insufficient input neutralization during OWA web page generation)
2. Delivered to the target mailbox — no prior server access needed. The delivery path is the organization's own legitimate mail system
3. When the recipient opens the email in OWA (browser) and certain interaction conditions are met, arbitrary JS executes in the victim's active OWA session context
4. Session token theft, leading to follow-on actions: reading and exfiltrating mail, impersonated sending, silent external forwarding rule insertion

#### 3.2 Nature of the Impact

XSS is often dismissed as a low-risk web flaw, but it is different when the target is an enterprise mail server. OWA is the primary browser-based access point for many organizations, and once an authenticated session is stolen, an attacker can act with the victim's privileges without credentials. No exploitation via other access paths such as desktop Outlook or ActiveSync has been confirmed to date; exploitation has been observed only via the OWA mail rendering path.

#### 3.3 Limitations of Mitigation

Mitigation does not work when OWA is accessed via Internet Explorer or Edge in IE mode (IE does not support Content Security Policy). Generic WAF "suspicious script blocking" rules are also not recommended — because malicious content passes through the mail processing path and renders in OWA, the WAF may not see the original message in the form Exchange stores and renders it. The official mitigation path is Microsoft's EEMS/EOMT.

### 4. Mitigation Procedure

#### 4.1 EEMS Automatic Mitigation (Recommended)

EEMS (Exchange Emergency Mitigation Service) was introduced in September 2021 and is enabled by default on Mailbox role servers. Mitigation M2.1.x for CVE-2026-42897 is already published and applied automatically.

- Check status: run the Exchange Health Checker script (aka.ms/ExchangeHealthChecker) and review the EEMS check section of the HTML report
- If EEMS is disabled, enable it immediately
- Note: versions prior to the March 2023 Cumulative Update (CU) cannot pull new mitigations via EEMS

#### 4.2 EOMT Manual Mitigation (Air-Gapped / EEMS-Unavailable Environments)

For internet-blocked environments or where EEMS cannot be used, download the latest EOMT (Exchange On-premises Mitigation Tool) and run it from an elevated Exchange Management Shell.

```powershell
# Single server
.\EOMT.ps1 -CVE "CVE-2026-42897"

# Entire fleet
Get-ExchangeServer | Where-Object { $_.ServerRole -ne "Edge" } | .\EOMT.ps1 -CVE "CVE-2026-42897"
```

#### 4.3 Known Side Effects (Notify Users in Advance)

- OWA Calendar print function does not work → use a screenshot or Outlook desktop
- Inline images in the OWA reading pane display incorrectly → send images as attachments
- OWA light (`?layout=light`) does not work → already a deprecated feature, no operational impact
- Mitigation details may show "Mitigation invalid for this exchange version" → if status is "Applied," it is correctly applied (a display defect)

### 5. Detection and Compromise Inspection

- Set SIEM alerts for anomalous OWA traffic and suspicious URL parameter requests
- Before applying mitigation, review the last 7 days of OWA logs for anomalous requests suspected of exploitation attempts
- Audit creation and modification of mailbox rules (especially external auto-forwarding) — check for forwarding rules persisting even after password reset
- Monitor anomalous session token usage, unexpected mail sending, and abnormal data access patterns by authenticated accounts

> **Operational Recommendation** — Do not attempt to "prove vulnerability" by reproducing weaponized XSS in production. Mitigation proof, exposure proof, and control proof (EEMS/M2 application status, OWA exposure inventory, IIS log review) are safer and more practical.

### 6. Recommendations

1. Inventory all on-premises Exchange 2016/2019/SE and verify OWA external exposure
2. Verify EEMS active/connected/M2 application status; if not applied, apply EOMT manually (immediately, today)
3. Plan to apply the permanent patch immediately upon release under a "patch now, no exceptions" principle
4. Verify Period 2 ESU enrollment (condition for receiving 2016/2019 permanent patch)
5. Mid-to-long term: consider Exchange Online/hybrid migration — cloud is unaffected

### 7. Timeline

| Date | Event |
| --- | --- |
| 2026-05-12 | May Patch Tuesday — many vulnerabilities patched, no zero-day included |
| 2026-05-14 | CVE-2026-42897 disclosed, active exploitation confirmed, EEMS mitigation M2.1.x deployed |
| 2026-05-15 | CISA KEV listing, FCEB federal agency mitigation deadline 5/29 assigned |
| 2026-05-18~19 | Further analysis reported — mitigation side effects and ESU coverage gaps highlighted |
| TBD | Permanent security update release (public for SE; 2016/2019 via Period 2 ESU) |

### 8. References

- Microsoft Tech Community — "Addressing Exchange Server May 2026 vulnerability CVE-2026-42897"
- BleepingComputer / Dark Reading / SecurityWeek — coverage 2026-05-15~19
- CISA KEV Catalog (listed 2026-05-15)
- Centre for Cybersecurity Belgium (CCB) advisory

*This document is an OSINT-based analysis. Threat actor attribution is currently undisclosed. Updating required upon permanent patch release. TLP:RED — share only with named recipients.*
