# CTI-2026-0520-EVILTOKENS

> **TLP:AMBER**
> Dennis Kim CTI | 2026-05-20 (KST) | Threat Campaign / PhaaS

---

## 한국어 (Korean)

# EvilTokens — AI 생성 디바이스 코드 피싱 PhaaS

*Microsoft 365 OAuth 디바이스 흐름 악용 · MFA 무력화 · 토큰 탈취형*

발행일: 2026-05-20 (KST) | 분류: 위협 캠페인 / PhaaS | 작성: Dennis Kim CTI

### 1. 핵심 요약 (Executive Summary)

EvilTokens는 2026년 2월 중순 텔레그램에서 등장한 **Phishing-as-a-Service(PhaaS) 플랫폼**으로, 등장 5주 만에 5개국 340개 이상의 Microsoft 365 조직을 침해했고 1,000개 이상의 활성 피싱 도메인이 추적되었다. 이 위협의 핵심은 **비밀번호를 훔치지 않는다**는 점이다.

공격자는 Microsoft의 정식 OAuth 2.0 디바이스 인증 흐름(Device Authorization Grant)을 악용한다. 피해자는 실제 microsoft.com/devicelogin 페이지에서 코드를 입력하고 평소대로 MFA까지 완료하지만, 실제로는 메일·드라이브·캘린더·연락처에 접근 가능한 **유효한 리프레시 토큰을 공격자에게 넘기게 된다**. 공격자는 비밀번호가 필요 없고, MFA 프롬프트를 건드리지 않으며, 침입처럼 보이는 로그인 이벤트도 만들지 않는다.

> **패러다임 전환** — "자격증명 탈취"에서 "세션·토큰 탈취"로의 이동. 비밀번호 중심 방어와 대부분의 MFA 구현만으로는 더 이상 충분하지 않다.

#### 1.1 사안 개요

| 항목 | 내용 |
| --- | --- |
| **명칭** | EvilTokens (PhaaS) |
| **유형** | 디바이스 코드 피싱 / AiTM·BEC 지원 키트 |
| **최초 관측** | 2026년 2월 중순 (텔레그램 광고), 캠페인 2/18~ |
| **피해 규모** | **5주 내 340+ MS365 조직, 1,000+ 피싱 도메인** |
| **핵심 기법** | **OAuth 2.0 Device Authorization Grant 악용** |
| **MFA 우회** | **예 — 정식 인증 흐름을 그대로 거침** |
| **주요 표적** | 재무·HR·물류·영업 직군 (BEC 취약 역할) |
| **제작 방식** | AI "바이브 코딩" 생성 추정 (Sekoia·Proofpoint 평가) |
| **확장 계획** | Gmail, Okta 피싱 페이지 지원 예고 |

### 2. 공격 메커니즘 (Attack Mechanism)

디바이스 코드 흐름은 본래 스마트TV·IoT·CLI 등 입력이 제한된 기기를 위해 설계된 정식 인증 방식이다. EvilTokens는 "기기" 역할을 가장해 이를 악용한다.

1. 공격자가 Microsoft API에 요청을 보내 자신의 세션에 연결된 실제 디바이스 코드를 생성
2. 공유 문서·급여 통지·회의 초대 등 미끼와 함께, 피해자에게 "정식 microsoft.com/devicelogin에서 이 코드를 입력하라"고 안내 (DocuSign·Adobe·SharePoint 사칭 템플릿 사용)
3. 피해자가 실제 Microsoft 페이지에서 코드를 입력하고 평소 로그인(+MFA) 완료
4. Microsoft가 공격자에게 피해자 계정의 액세스 토큰·리프레시 토큰 발급 → 지속적·인증된 접근 확보

> **탐지가 어려운 이유** — URL도 진짜, 페이지도 진짜, MFA 프롬프트도 진짜다. 자격증명이 전송 구간에서 가로채지지 않으며, 정상 Microsoft 도메인에서 인증이 일어나므로 기존 피싱 탐지(의심 URL 기반)와 인식 교육을 우회한다.

### 3. 인프라 및 운영 분석 (Infrastructure)

#### 3.1 SaaS형 범죄 생태계

EvilTokens는 단일 피싱 키트가 아니라 구독 등급·고객 지원 채널·대시보드·온보딩을 갖춘 구조화된 PhaaS 운영이다. 24/7 지원팀과 고객 피드백 채널까지 운영하며, 제품 표면은 실제 SaaS 카탈로그처럼 보인다.

- 벌크 발송기: 침해된 MS365 계정과 Graph API·bearer 토큰으로 메일 발송, 템플릿 캠페인·수신자 관리·실시간 추적
- SMTP 인프라: DKIM·도메인 관리, 병렬 발송 워커, 오픈/클릭 추적, IP 로테이션
- Office 365 캡처 모듈: 디바이스 로그인 흐름 악용으로 인증 후 토큰 캡처, 세션 조회용 백엔드 패널
- Portal Browser: 다수 침해 계정을 동시 관리·접근하는 기능 (BEC·계정 탈취 확장)
- 이메일 검증 서비스: 캠페인 전 MS365 테넌트에 해당 주소 존재 여부 확인 → 데이터 기반 표적 파이프라인화

#### 3.2 인프라 패턴

일부 캠페인은 Cloudflare Workers 리다이렉트와 Railway.com(PaaS)을 악용해, 수천 개의 단명(short-lived) 폴링 노드를 생성하고 Node.js 백엔드 로직을 배포함으로써 시그니처·패턴 기반 탐지를 우회했다. 동적 코드 생성으로 디바이스 코드의 표준 15분 만료 창을 회피한 정황도 관측되었다.

### 4. AI 연계 관점 (AI Nexus)

복수 연구팀(Sekoia, Proofpoint)은 EvilTokens 키트가 **"바이브 코딩" 기반 AI 생성**으로 제작·유지되는 것으로 평가한다. 등장에서 1,000개 도메인까지 약 5주라는 속도는 과거 대규모 팀 없이는 불가능했던 수준으로, AI가 위협 행위자의 개발·반복 속도를 구조적으로 끌어올린 사례다.

Proofpoint는 10일 창에서 거의 동일해 보이는 7종의 디바이스 코드 피싱 변종을 관측했는데, API 엔드포인트·HTML 헤더의 미세한 차이로 구분된다. 이는 EvilTokens를 모방·변형하는 AI 기반 "2차 제작" 흐름이 동시에 진행 중임을 시사한다. 본 항목은 Betalabs의 교차-LLM 출력 분기 연구 및 AI 보안 트랙과 직접 연결되는 분석 포인트다.

### 5. 탐지 및 헌팅 (Detection & Hunting)

- Entra ID 로그인 로그에서 디바이스 코드 인증(authentication method = device code) 이벤트 헌팅 — 특히 비대화형 기기가 아닌 사용자 계정의 디바이스 코드 로그인
- Sekoia 공개 YARA 룰로 EvilTokens 피싱 페이지 탐지, urlscan.io·urlquery에서 알려진 URL 패턴 조회
- Defender for Office 365의 Safe Links 구성 → 고신뢰 디바이스 코드 피싱 알림 활성화
- Railway.com·Cloudflare Workers 경유 비정상 리다이렉트, 단명 폴링 노드 트래픽 모니터링
- 재무·HR·물류·영업 직군 대상 DocuSign·SharePoint·급여 통지 미끼 메일 집중 점검

### 6. 대응 권고 (Recommendations)

#### 6.1 정책 기반 차단 (최우선)

- Entra ID 조건부 액세스로 디바이스 코드 흐름(Device Code Flow) 차단 정책 적용 — 실제 IoT/CLI 필요 그룹만 예외 허용
- 관리·고권한 계정에 대한 피싱 저항형 MFA(FIDO2/패스키) 강제

#### 6.2 침해 대응 (Containment)

- 침해 의심 시 리프레시 토큰 폐기(revokeSignInSessions). 단, 표준 세션 폐기는 리프레시 토큰만 무효화하고 액세스 토큰은 최대 1시간 잔존할 수 있음
- 행위자가 그 1시간 창을 적극 악용하므로, 즉각 봉쇄를 위해 침해 계정을 일시 비활성화 권장
- 악성 메일함 전달 규칙·OAuth 동의 앱 점검 및 제거

#### 6.3 인식 교육

- "URL이 진짜여도 위험할 수 있다" — devicelogin에 코드를 입력하라는 비정상 요청 자체를 신고 대상으로 교육

### 7. 타임라인 (Timeline)

| 일시 | 이벤트 |
| --- | --- |
| 2026-02-15경 | EvilTokens 텔레그램 광고 개시 (PhaaS 판매) |
| 2026-02-18~19 | 최초 캠페인 관측 (Huntress, Unit 42) |
| 2026-03-23 | 1,000+ 피싱 도메인 추적 (Sekoia) |
| 2026-03-30~31 | Sekoia 상세 분석 공개, AI 생성 추정 평가 |
| 2026-04 | Proofpoint TA4903 등 다수 행위자 디바이스 코드 피싱 전환 관측 |
| 2026-05 | 5주 내 340+ MS365 조직 침해 집계, Gmail·Okta 확장 예고 |

### 8. 출처 (References)

- Sekoia TDR — "New widespread EvilTokens kit: device code phishing as-a-service"
- Proofpoint — "Device Code Phishing is an Evolution in Identity Takeover" (2026-05)
- Microsoft Security Blog — "Inside an AI-enabled device code phishing campaign" (2026-04)
- Huntress, Bolster AI, CSO Online, eSecurity Planet — 2026-03~05 분석

*본 문서는 공개 출처 기반의 위협 캠페인 분석이다. IOC(도메인·YARA)는 Sekoia 등 원 출처에서 최신본 확보 권장. TLP:AMBER.*

---

## English

# EvilTokens — AI-Generated Device Code Phishing PhaaS

*Abuses Microsoft 365 OAuth device flow · Defeats MFA · Token-theft type*

Published: 2026-05-20 (KST) | Category: Threat Campaign / PhaaS | Author: Dennis Kim CTI

### 1. Executive Summary

EvilTokens is a **Phishing-as-a-Service (PhaaS) platform** that emerged on Telegram in mid-February 2026. Within five weeks of its appearance it compromised more than 340 Microsoft 365 organizations across five countries, with over 1,000 active phishing domains tracked. The core of this threat is that it **does not steal passwords**.

The attacker abuses Microsoft's legitimate OAuth 2.0 device authentication flow (Device Authorization Grant). The victim enters a code on the genuine microsoft.com/devicelogin page and completes MFA as usual, but in reality **hands the attacker a valid refresh token** with access to mail, drive, calendar, and contacts. The attacker needs no password, never touches an MFA prompt, and never generates a login event that looks like an intrusion.

> **Paradigm Shift** — A move from "credential theft" to "session and token theft." Password-centric defenses and most MFA implementations are no longer sufficient on their own.

#### 1.1 Case Overview

| Item | Detail |
| --- | --- |
| **Name** | EvilTokens (PhaaS) |
| **Type** | Device code phishing / AiTM and BEC support kit |
| **First Observed** | Mid-February 2026 (Telegram ad), campaigns from 2/18 |
| **Impact Scale** | **340+ MS365 orgs in five weeks, 1,000+ phishing domains** |
| **Core Technique** | **Abuse of OAuth 2.0 Device Authorization Grant** |
| **MFA Bypass** | **Yes — passes through the legitimate auth flow as-is** |
| **Primary Targets** | Finance, HR, logistics, sales roles (BEC-vulnerable functions) |
| **Build Method** | Presumed AI "vibe coding" generation (Sekoia/Proofpoint assessment) |
| **Expansion Plans** | Announced support for Gmail and Okta phishing pages |

### 2. Attack Mechanism

The device code flow is a legitimate authentication method originally designed for input-constrained devices such as smart TVs, IoT, and CLI tools. EvilTokens abuses it by impersonating the "device" role.

1. The attacker sends a request to the Microsoft API to generate a real device code tied to their own session
2. With a lure such as a shared document, payroll notice, or meeting invite, the victim is instructed to "enter this code at the genuine microsoft.com/devicelogin" (using DocuSign/Adobe/SharePoint impersonation templates)
3. The victim enters the code on the real Microsoft page and completes their usual login (plus MFA)
4. Microsoft issues access and refresh tokens for the victim's account to the attacker, securing persistent, authenticated access

> **Why Detection Is Hard** — The URL is real, the page is real, the MFA prompt is real. Credentials are not intercepted in transit, and because authentication occurs on a legitimate Microsoft domain, it bypasses conventional phishing detection (based on suspicious URLs) and awareness training.

### 3. Infrastructure and Operations Analysis

#### 3.1 SaaS-Style Criminal Ecosystem

EvilTokens is not a single phishing kit but a structured PhaaS operation with subscription tiers, customer support channels, dashboards, and onboarding. It runs a 24/7 support team and a customer feedback channel, and its product surface resembles a genuine SaaS catalog.

- Bulk sender: sends mail using compromised MS365 accounts with Graph API and bearer tokens; template campaigns, recipient management, real-time tracking
- SMTP infrastructure: DKIM and domain management, parallel sending workers, open/click tracking, IP rotation
- Office 365 capture module: captures post-authentication tokens by abusing the device login flow; backend panel for session retrieval
- Portal Browser: a feature to manage and access multiple compromised accounts simultaneously (scaling BEC and account takeover)
- Email validation service: confirms whether an address exists in an MS365 tenant before a campaign, turning targeting into a data-driven pipeline

#### 3.2 Infrastructure Patterns

Some campaigns abused Cloudflare Workers redirects and Railway.com (PaaS) to spin up thousands of short-lived polling nodes and deploy Node.js backend logic, evading signature- and pattern-based detection. Evidence of dynamic code generation to evade the standard 15-minute device code expiration window was also observed.

### 4. AI Nexus

Multiple research teams (Sekoia, Proofpoint) assess that the EvilTokens kit is **AI-generated based on "vibe coding"** for its build and maintenance. The roughly five-week pace from emergence to 1,000 domains is a level that was previously impossible without a large team, illustrating how AI structurally accelerates a threat actor's development and iteration speed.

Proofpoint observed seven nearly identical device code phishing variants within a 10-day window, distinguished by subtle differences in API endpoints and HTML headers. This suggests a parallel AI-driven "secondary production" trend that imitates and mutates EvilTokens. This item is a direct analytical link to Betalabs' cross-LLM output divergence research and AI security track.

### 5. Detection and Hunting

- Hunt for device code authentication events (authentication method = device code) in Entra ID sign-in logs — especially device code logins on user accounts rather than non-interactive devices
- Detect EvilTokens phishing pages with Sekoia's published YARA rule; query known URL patterns on urlscan.io and urlquery
- Configure Safe Links in Defender for Office 365 to enable high-confidence device code phishing alerts
- Monitor anomalous redirects via Railway.com/Cloudflare Workers and short-lived polling node traffic
- Focus inspection on DocuSign/SharePoint/payroll-notice lure emails targeting finance, HR, logistics, and sales roles

### 6. Recommendations

#### 6.1 Policy-Based Blocking (Top Priority)

- Apply an Entra ID Conditional Access policy to block the Device Code Flow — allow exceptions only for groups that genuinely need IoT/CLI
- Enforce phishing-resistant MFA (FIDO2/passkeys) for admin and high-privilege accounts

#### 6.2 Containment

- On suspected compromise, revoke refresh tokens (revokeSignInSessions). Note that standard session revocation only invalidates refresh tokens, and access tokens may persist for up to one hour
- Because actors actively exploit that one-hour window, temporarily disabling the compromised account is recommended for immediate containment
- Inspect and remove malicious mailbox forwarding rules and OAuth consent apps

#### 6.3 Awareness Training

- "A real URL can still be dangerous" — train users to report the abnormal request itself, i.e., being told to enter a code at devicelogin

### 7. Timeline

| Date | Event |
| --- | --- |
| ~2026-02-15 | EvilTokens Telegram advertising begins (PhaaS sales) |
| 2026-02-18~19 | First campaigns observed (Huntress, Unit 42) |
| 2026-03-23 | 1,000+ phishing domains tracked (Sekoia) |
| 2026-03-30~31 | Sekoia detailed analysis published, AI-generation assessment |
| 2026-04 | Multiple actors including Proofpoint's TA4903 observed pivoting to device code phishing |
| 2026-05 | 340+ MS365 orgs compromised in five weeks tallied; Gmail/Okta expansion announced |

### 8. References

- Sekoia TDR — "New widespread EvilTokens kit: device code phishing as-a-service"
- Proofpoint — "Device Code Phishing is an Evolution in Identity Takeover" (2026-05)
- Microsoft Security Blog — "Inside an AI-enabled device code phishing campaign" (2026-04)
- Huntress, Bolster AI, CSO Online, eSecurity Planet — analysis 2026-03~05

*This document is an OSINT-based threat campaign analysis. For IOCs (domains/YARA), obtaining the latest versions from original sources such as Sekoia is recommended. TLP:AMBER.*
