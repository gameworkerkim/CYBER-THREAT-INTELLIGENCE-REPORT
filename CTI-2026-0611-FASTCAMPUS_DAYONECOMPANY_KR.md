# CTI-2026-0611 | 패스트캠퍼스(데이원컴퍼니) 개인정보 유출 — GitHub 마스터 계정 키 탈취를 통한 장기 침투 사고 분석

> **⚠️ 경보 등급: 높음 (HIGH)**
> **최초 발행: 2026-06-11** | **버전: v1.0** | **언어: 한국어**
> **작성자: HoKwang Kim (Dennis Kim)** · Betalabs Inc. · [gameworker@gmail.com](mailto:gameworker@gmail.com)
> **ORCID:** [0009-0002-0962-2175](https://orcid.org/0009-0002-0962-2175) · **GitHub:** [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

---

## 요약 (Executive Summary)

국내 대표 온라인 교육 플랫폼 **패스트캠퍼스, 콜로소, 마이라이트, 제로베이스, 뉴스프레소, 리스픽, 샤이니영어, 워너스픽** 등을 운영하는 **(주)데이원컴퍼니**에서 대규모 개인정보 유출 사고가 발생했다.

공격자는 데이원컴퍼니가 사용 중인 **GitHub 서비스의 마스터 계정 키값을 탈취**한 뒤, **2026년 5월 9일** 최초로 서비스에 침입했다. 회사가 사고 가능성을 인지한 것은 **6월 8일**로, 최초 침입으로부터 **약 30일이 경과한 시점**이었다. 유출된 정보는 이름, 이메일 주소, 전화번호, 암호화된 비밀번호이며, 일부 고객의 경우 주소, 직무·직책 정보, 택배 주문 메모까지 포함된 것으로 추정된다.

그러나 본 리포트가 주목하는 또 다른 문제점은 **공지 지연**이다. 회사는 사고 인지(6월 8일) 다음 날인 6월 9일 당국에 신고했음에도, 피해 고객 대상 공개 공지는 **6월 11일 오후 4시경**에야 게시됐다. 사고 인지로부터 사실상 **약 72시간 이상의 공지 공백**이 발생했으며, 이는 개인정보보호법상 통지 의무 및 피해자 보호의 관점에서 심각한 문제를 내포한다.

---

## 목차

1. [사건 타임라인](#1-사건-타임라인)
2. [공격 기법 분석](#2-공격-기법-분석)
3. [유출 정보 범위](#3-유출-정보-범위)
4. [공지 지연 — 비판적 분석](#4-공지-지연--비판적-분석)
5. [MITRE ATT&CK 매핑](#5-mitre-attck-매핑)
6. [침해지표 (IoC)](#6-침해지표-ioc)
7. [영향 범위 및 2차 피해 가능성](#7-영향-범위-및-2차-피해-가능성)
8. [대응 권고 — 피해 고객용](#8-대응-권고--피해-고객용)
9. [GitHub · Google 계정 · GCP 보호 가이드](#9-github--google-계정--gcp-보호-가이드)
10. [기업 보안 관리자 권고](#10-기업-보안-관리자-권고)
11. [분석가 평가 및 한계](#11-분석가-평가-및-한계)
12. [참고 자료](#12-참고-자료)

---

## 1. 사건 타임라인

```
[불상의 시점]        GitHub 마스터 계정 키값(Secret/Token) 탈취
       │
       ▼
2026-05-09          최초 서비스 침입 확인
       │             (약 30일간 침투 탐지 실패)
       │
       ▼
2026-06-08          데이원컴퍼니 사고 가능성 인지
                    → 위협 차단 및 보완 조치 착수
       │
       ▼
2026-06-09          관계 당국(KISA 등) 신고
       │
       ▼
2026-06-10          언론을 통한 사고 최초 보도
                    (고객 대상 공식 공지 없는 상태)
       │
       ▼
2026-06-11 16:00경  패스트캠퍼스 공지사항 게시
                    "개인정보 유출 통지 [데이원컴퍼니]"
```

| 항목 | 일시 |
|---|---|
| **최초 침입 추정** | 2026년 5월 9일 |
| **사고 인지** | 2026년 6월 8일 |
| **탐지 실패 기간** | **약 30일** |
| **당국 신고** | 2026년 6월 9일 |
| **피해 고객 공지** | 2026년 6월 11일 오후 4시경 |
| **사고 인지 → 공지 경과 시간** | **약 72~80시간** |

---

## 2. 공격 기법 분석

### 2.1 초기 침투 벡터: GitHub 마스터 계정 키값 탈취

공식 공지 및 언론 보도를 종합하면, 공격자는 데이원컴퍼니가 사용하는 **GitHub 서비스의 마스터 계정 키값(API Token / Secret)**을 탈취하는 방식으로 초기 침투에 성공했다.

GitHub 마스터 계정 키값 탈취의 일반적인 경로는 다음과 같다:

```
가능한 탈취 경로 (공식 미확인, 일반적 패턴 기반):

① 코드 저장소 내 하드코딩된 시크릿 노출
   (소스코드 또는 설정 파일에 토큰이 평문으로 저장)

② CI/CD 파이프라인 환경변수 탈취
   (GitHub Actions 워크플로우 설정 파일에 노출)

③ 개발자 로컬 환경 침해
   (개발자 PC 악성코드, .gitconfig 또는 ~/.git-credentials 탈취)

④ 피싱을 통한 GitHub OAuth 토큰 탈취
   (가짜 로그인 페이지 유도)

⑤ 써드파티 앱/서비스의 OAuth 권한 남용
   (연동된 서비스에서 토큰 누출)
```

### 2.2 장기 잠복: 30일간 탐지 회피

가장 심각한 기술적 문제는 **최초 침입(5월 9일)에서 사고 인지(6월 8일)까지 약 30일간 탐지되지 않았다는 점**이다. 이는 다음을 시사한다:

- GitHub 접근 로그에 대한 **상시 모니터링 체계 부재**
- 비정상 데이터 접근 패턴에 대한 **SIEM/DLP 경보 미설정 또는 미작동**
- 마스터 계정 키에 대한 **접근 권한 최소화(PoLP) 미적용**
- API 토큰/시크릿의 **사용 이력 감사(Audit Log) 미검토**

### 2.3 데이터 유출 방식

공격자는 GitHub 마스터 계정 키를 이용해 데이원컴퍼니의 **서비스 인프라에 접근**, 고객 데이터베이스 또는 관련 스토리지에서 개인정보를 유출한 것으로 추정된다. GitHub 마스터 계정 키는 단순 코드 저장소 접근을 넘어, 연동된 **클라우드 인프라(GCP 포함)와의 OIDC/OAuth 연결**로 인해 광범위한 권한을 제공했을 가능성이 있다.

---

## 3. 유출 정보 범위

### 3.1 공식 확인된 유출 항목

| 유출 항목 | 대상 | 민감도 |
|---|---|---|
| 이름 | 전체 피해 고객 | 중 |
| 이메일 주소 | 전체 피해 고객 | 높음 |
| 전화번호 | 전체 피해 고객 | **매우 높음** |
| 암호화된 비밀번호 | 전체 피해 고객 | **높음** |
| 주소 | 입력 고객 | **매우 높음** |
| 직무·직책 | 입력 고객 | 중 |
| 택배 주문 메모 | 해당 고객 추정 | 중 |

> ⚠️ 결제 정보(카드 번호 등)는 플랫폼 내 미보유로 유출되지 않은 것으로 회사 측 발표

### 3.2 영향 받는 서비스

데이원컴퍼니 산하 브랜드 전체가 잠재적 영향권이다:

- **패스트캠퍼스** (FastCampus) — 국내 최대 IT/직무 교육 플랫폼
- **콜로소** (Coloso) — 크리에이티브 교육 플랫폼 (누적 회원 70만+)
- **마이라이트** (Myright)
- **제로베이스** (ZeroBase)
- **뉴스프레소** (Newsspresso)
- **리스픽** (Lispick)
- **샤이니영어** (Shiny English)
- **워너스픽** (Wannerspeak)

### 3.3 "암호화된 비밀번호"의 실질적 위험

회사는 비밀번호가 "암호화"되어 유출됐다고 발표했으나, 이는 안전을 보장하지 않는다:

- 해시 알고리즘이 취약하거나(MD5, SHA-1) 솔트(salt) 없이 적용된 경우, 레인보우 테이블 또는 GPU 기반 크래킹으로 복원 가능
- 유출된 이메일+비밀번호 조합은 **크리덴셜 스터핑 공격**에 즉시 활용될 수 있음
- 동일 이메일/비밀번호를 타 서비스(네이버, 카카오, 금융권)에서도 사용하는 경우 **연쇄 피해** 발생 가능

---

## 4. 공지 지연 — 비판적 분석

### 4.1 타임라인 재구성

> **사고 인지: 6월 8일 → 당국 신고: 6월 9일 → 언론 보도: 6월 10일 → 고객 공지: 6월 11일 오후 4시**

데이원컴퍼니는 6월 8일 사고를 인지하고, 6월 9일 관계 당국에 신고했다. 그러나 **피해 당사자인 고객에 대한 공개 공지는 6월 11일 오후 4시까지 이루어지지 않았다.** 이는 사고 인지 시점으로부터 약 **72~80시간의 공지 공백**에 해당한다.

더 심각한 점은 **언론이 먼저 보도(6월 10일)했다는 것**이다. 피해자들이 자신의 정보가 유출됐다는 사실을 회사의 공식 통보가 아닌 뉴스 기사를 통해 먼저 접했을 가능성이 높다.

### 4.2 개인정보보호법 위반 가능성

「개인정보 보호법」 제34조(개인정보 유출 등의 통지·신고)는 다음을 규정한다:

> **"개인정보처리자는 개인정보가 유출되었음을 알게 되었을 때에는 지체 없이 해당 정보주체에게 알려야 한다."**

여기서 핵심은 **"지체 없이"**다. 법률 및 판례의 일반적 해석상 이는 **72시간 이내**를 기준으로 보는 경향이 있으며, EU GDPR 역시 동일 기준을 명시하고 있다. 데이원컴퍼니의 경우:

| 의무 | 기준 | 데이원컴퍼니 대응 | 평가 |
|---|---|---|---|
| 당국 신고 | 사고 인지 후 지체 없이 | 인지 다음 날(6월 9일) | ✅ 신속 |
| 피해자 통지 | 사고 인지 후 지체 없이 | 인지 약 72~80시간 후(6월 11일 오후) | ⚠️ 지연 |
| 통지 내용 충분성 | 유출 경위, 항목, 피해 최소화 방법 | 경위 일부 모호, 피해 규모 "확인 중" | ⚠️ 미흡 |

### 4.3 공지 내용의 문제점

공식 공지(fastcampus.co.kr/info/notices/1960)의 내용을 분석하면 다음과 같은 문제점이 있다:

**① "불상의 시점에 탈취" — 불투명한 경위 기술**

> *"GitHub 서비스의 마스터 계정 키값이 불상의 시점에 탈취되었으며"*

키값이 언제, 어떤 경위로 탈취되었는지 파악하지 못한 상태에서 공지를 올렸다. 이는 **사고 원인 분석이 완료되기 전에 공지가 발행됐음**을 의미하며, 피해자들이 자신의 피해를 정확히 이해하고 대응하기 어렵게 만든다.

**② 유출 규모 "파악 중"**

공지 시점에 정확한 피해자 수조차 특정하지 못했다. 피해자 입장에서는 자신이 피해 대상인지조차 불명확한 상황에서 공지를 받은 셈이다.

**③ 실질적 피해 보상 방안 부재**

공지 내용에는 "보상안은 유출 피해 규모가 확정된 후 마련할 예정"이라는 내용이 포함되어 있다. 피해를 입은 고객 입장에서는 즉각적인 불안감을 해소할 수 있는 **크레딧 모니터링 서비스 제공, 보상 기준, 전담 지원 채널** 등 실질적 대응책이 전혀 제시되지 않았다.

**④ 침입 지속 기간(30일) 미강조**

공격자가 5월 9일부터 6월 8일까지 **약 30일간 내부에 머물렀다는 사실**은 공지에 명시되어 있지 않다. 이 기간 동안 유출된 정보의 범위가 공지된 항목보다 훨씬 넓을 가능성이 있으며, 피해자들은 이를 알 권리가 있다.

### 4.4 비교: 국내외 사고 대응 사례와의 격차

| 항목 | 우수 사례(참고) | 데이원컴퍼니 |
|---|---|---|
| 고객 통지 속도 | 사고 인지 24~48시간 이내 | 약 72~80시간 이후 |
| 피해 규모 특정 | 통지 시 명시 | "확인 중" |
| 보상 방안 | 통지와 동시에 제시 | 미정 |
| 원인 투명성 | 침투 경로 상세 기술 | "불상의 시점" |
| 피해자 지원 | 전용 신고 포털, 무료 신용 모니터링 | 전화/이메일 문의 안내만 |

**결론적으로, 데이원컴퍼니의 대응은 법적 의무의 최소 충족 수준에도 미치지 못할 가능성이 있으며, 피해자 중심의 위기 커뮤니케이션과는 거리가 먼 소극적 대응이었다.**

---

## 5. MITRE ATT&CK 매핑

| Tactic | Technique ID | Technique Name | 관련 행위 |
|---|---|---|---|
| Initial Access | T1552.001 | Unsecured Credentials: Credentials In Files | GitHub 마스터 계정 키값 탈취 |
| Initial Access | T1078 | Valid Accounts | 탈취한 계정 키로 서비스 접근 |
| Persistence | T1098 | Account Manipulation | 마스터 계정 키 유지 사용 |
| Discovery | T1087 | Account Discovery | 서비스 내 계정 및 DB 접근 |
| Collection | T1213 | Data from Information Repositories | 고객 개인정보 데이터베이스 수집 |
| Exfiltration | T1041 | Exfiltration Over C2 Channel | 개인정보 외부 유출 |
| Defense Evasion | T1078.004 | Valid Accounts: Cloud Accounts | 정상 계정 키 사용으로 탐지 회피 |

---

## 6. 침해지표 (IoC)

> ⚠️ 현재 공개된 정보가 극히 제한적이므로, 아래 IoC는 공식 조사 결과 발표 후 업데이트가 필요합니다.

### 6.1 사고 관련 기본 정보

| 항목 | 값 |
|---|---|
| 피해 기업 | (주)데이원컴퍼니 |
| 사업자 번호 | 810-86-00658 |
| 피해 서비스 | 패스트캠퍼스, 콜로소, 마이라이트, 제로베이스 외 |
| 침입 최초 확인일 | 2026-05-09 |
| 사고 인지일 | 2026-06-08 |

### 6.2 피해자 확인 방법

- 데이원컴퍼니 고객센터: ☎ 02-501-9396
- 이메일: customer-service@day1company.co.kr
- 패스트캠퍼스 공지사항: https://fastcampus.co.kr/info/notices/1960

---

## 7. 영향 범위 및 2차 피해 가능성

### 7.1 1차 피해

- 이름, 이메일, 전화번호, 암호화 비밀번호, 주소(일부), 직무(일부) 유출
- 결제 정보는 미유출 확인 (회사 발표 기준)

### 7.2 2차 피해 시나리오

**① 크리덴셜 스터핑(Credential Stuffing)**

유출된 이메일 + 비밀번호 조합으로 네이버, 카카오, 쿠팡, 토스, 은행 앱 등 타 서비스 로그인 시도. 동일 비밀번호 사용 시 **다중 계정 연쇄 탈취** 위험.

**② 스피어 피싱(Spear Phishing)**

이름 + 이메일 + 전화번호 조합은 고도로 맞춤화된 피싱 이메일/문자 제작에 활용 가능. "패스트캠퍼스 보안 알림" 위장 피싱 메시지 주의 필요.

**③ 스미싱(Smishing)**

전화번호 유출로 인해 "개인정보 유출 안내" 위장 악성 URL 문자 발송 가능.

**④ 보이스 피싱 연계**

이름 + 전화번호 + 직무 정보 조합은 사회공학적 공격(보이스피싱, 기관 사칭)에 악용 가능.

**⑤ 주소 정보 악용**

주소를 입력한 고객의 경우, 실물 위협(불법 방문 등)이나 추가 사회공학 공격의 기초 정보로 활용될 가능성 존재.

---

## 8. 대응 권고 — 피해 고객용

### 🔴 즉각 조치 (오늘 중)

**1. 패스트캠퍼스(데이원컴퍼니) 계정 비밀번호 즉시 변경**

**2. 동일 비밀번호 사용 서비스 전체 비밀번호 교체**

동일하거나 유사한 비밀번호를 사용하는 모든 서비스(이메일, 금융, 쇼핑몰, SNS)의 비밀번호를 즉시 변경한다.

> **비밀번호 원칙:** 서비스마다 다른 비밀번호 사용 + 12자 이상 + 대소문자/숫자/특수문자 혼합

**3. 주요 서비스 2단계 인증(2FA) 즉시 활성화**

네이버, 카카오, 구글, 금융 앱, 패스트캠퍼스 등 모든 주요 서비스에서 OTP 또는 인증 앱 기반 2FA를 활성화한다.

**4. 의심스러운 연락 즉시 무시**

- "패스트캠퍼스 / 데이원컴퍼니" 사칭 이메일·문자·전화 주의
- URL 클릭 금지, 개인정보 재요구 시 즉시 거부

### 🟡 단기 조치 (3일 이내)

**5. 이메일 계정 보안 점검**

- 유출된 이메일 계정 접속 기록 확인 (해외 IP 접속 여부)
- 이메일 자동 전달 규칙 비정상 설정 확인

**6. 금융 거래 모니터링 강화**

- 인터넷뱅킹 로그인 기록 확인
- 카드 명세서 이상 거래 확인
- 필요 시 금융결제원 개인정보 노출자 사고예방시스템 등록: https://pd.kfb.or.kr/

**7. 피해 접수**

- 한국인터넷진흥원(KISA): ☎ 118
- 개인정보침해 신고센터: https://privacy.kisa.or.kr
- 경찰청 사이버수사국: ☎ 182

---

## 9. GitHub · Google 계정 · GCP 보호 가이드

이번 사고의 핵심 침투 경로인 **GitHub 마스터 계정 키 탈취**와 연계된 Google/GCP 환경 보호를 위한 실무 가이드를 제공한다. 데이원컴퍼니의 인프라가 GCP 기반임(사업자 정보 내 storage.googleapis.com 도메인 확인)을 감안했다.

---

### 9-A. GitHub 계정 및 조직(Organization) 보호

#### 🔐 인증 강화

| 조치 | 방법 | 중요도 |
|---|---|---|
| **2FA 필수 적용** | GitHub Settings → Password and authentication → Enable 2FA (TOTP 또는 하드웨어 키) | 🔴 필수 |
| **Passkey 등록** | Settings → Passkeys → Add passkey | 🔴 강력 권고 |
| **SSH 키 재검토** | Settings → SSH and GPG keys → 미사용 키 즉시 삭제 | 🔴 필수 |
| **OAuth 앱 접근 권한 감사** | Settings → Applications → Authorized OAuth Apps 검토 | 🟡 권고 |
| **Personal Access Token 최소 권한** | Settings → Developer settings → Personal access tokens → Scopes 최소화, 만료일 설정 | 🔴 필수 |

#### 🔑 시크릿 관리

```bash
# 저장소 내 하드코딩된 시크릿 탐지 (gitleaks 활용)
brew install gitleaks        # macOS
gitleaks detect --source .   # 현재 저장소 스캔

# truffleHog으로 히스토리 포함 전체 스캔
pip install truffleHog
trufflehog git file://. --only-verified
```

| 시크릿 관리 원칙 | 설명 |
|---|---|
| **절대 하드코딩 금지** | `.env`, `config.yaml`, `settings.py` 등에 토큰/키 직접 기재 금지 |
| **GitHub Secrets 사용** | CI/CD용 시크릿은 Settings → Secrets and variables → Actions에 등록 |
| **Secret Scanning 활성화** | Settings → Code security → Secret scanning 활성화 (Push protection 포함) |
| **`.gitignore` 점검** | `.env`, `*.pem`, `*_key.json`, `credentials*` 패턴 추가 |
| **토큰 최소 권한 + 만료일** | Personal Access Token: 필요한 scope만 허용, 90일 이하 만료 설정 |

#### 🏢 Organization 보안 설정

```
Organization Settings → Member privileges:
  ✅ Require 2FA for all members
  ✅ Require SAML SSO (Enterprise 플랜)
  ✅ Base permissions: Read (최소 권한 원칙)

Organization Settings → Code security:
  ✅ Dependabot alerts
  ✅ Secret scanning
  ✅ Push protection (시크릿 포함 push 차단)

Organization Settings → Audit log:
  ✅ Audit log streaming 활성화 → SIEM 연동
```

#### 🚨 침해 발생 시 즉각 대응

```bash
# GitHub CLI로 전체 Personal Access Token 목록 조회
gh auth token                           # 현재 사용 토큰 확인
# → 웹에서 Settings > Developer settings > PATs > 전체 Revoke

# 조직 단위 OAuth 앱 권한 일괄 확인
# Settings → Third-party access → Restrict access
```

---

### 9-B. Google 계정 보호

#### 🔐 계정 보안 강화

| 조치 | 위치 | 중요도 |
|---|---|---|
| **2단계 인증 활성화** | myaccount.google.com → 보안 → 2단계 인증 | 🔴 필수 |
| **Google Passkey 등록** | myaccount.google.com → 보안 → Passkey | 🔴 강력 권고 |
| **보안 키(하드웨어) 등록** | YubiKey 등 FIDO2 키 등록 | 🟡 고위험 계정 필수 |
| **고급 보호 프로그램** | g.co/advancedprotection | 🟡 조직 관리자 권고 |
| **앱 비밀번호 점검** | 레거시 앱용 앱 비밀번호 목록 확인 및 미사용 삭제 | 🔴 필수 |

#### 🔍 접근 감사

```
Google 계정 보안 점검 체크리스트:

myaccount.google.com → 보안:
  ✅ 최근 보안 활동 이상 여부 확인
  ✅ 연결된 기기 목록 → 미인식 기기 즉시 로그아웃
  ✅ 서드파티 앱 접근 권한 검토 (불필요한 앱 제거)
  ✅ 이메일 자동 전달 규칙 확인 (Gmail → 설정 → 전달 및 POP/IMAP)
  ✅ 복구 이메일/전화번호 최신화
```

#### 🏢 Google Workspace (관리자)

```
admin.google.com:
  ✅ 보안 → 2단계 인증 → 조직 전체 강제 적용
  ✅ 보안 → 고급 설정 → 세션 지속 시간 제한
  ✅ 보고서 → 감사 → 로그인 활동 이상 감지
  ✅ 사용자 → 슈퍼관리자 계정 최소화
  ✅ 앱 → Google Workspace → Drive → 외부 공유 설정 검토
```

---

### 9-C. Google Cloud Platform (GCP) 보호

GCP는 GitHub Actions의 OIDC 연동을 통해 접근 가능하며, GitHub 마스터 계정 키 탈취 시 연쇄 피해가 발생할 수 있다.

#### 🔐 IAM 및 접근 제어

| 조치 | 방법 | 중요도 |
|---|---|---|
| **서비스 계정 키 최소화** | 가능하면 서비스 계정 JSON 키 발급 금지 → OIDC/Workload Identity 사용 | 🔴 필수 |
| **최소 권한 원칙(PoLP)** | IAM 역할: Primitive 역할(Owner, Editor) 사용 금지 → Predefined 역할 사용 | 🔴 필수 |
| **서비스 계정 키 감사** | 미사용 키 즉시 삭제 | 🔴 필수 |
| **조직 정책** | `constraints/iam.disableServiceAccountKeyCreation` 적용 | 🟡 강력 권고 |

```bash
# GCP 서비스 계정 키 목록 조회
gcloud iam service-accounts list --project=[PROJECT_ID]
gcloud iam service-accounts keys list \
  --iam-account=[SA_EMAIL] \
  --project=[PROJECT_ID]

# 90일 이상 미사용 키 삭제
gcloud iam service-accounts keys delete [KEY_ID] \
  --iam-account=[SA_EMAIL] \
  --project=[PROJECT_ID]

# 비정상 IAM 정책 변경 이력 조회 (Cloud Audit Logs)
gcloud logging read \
  'logName="projects/[PROJECT_ID]/logs/cloudaudit.googleapis.com%2Factivity" \
   AND protoPayload.methodName="SetIamPolicy"' \
  --limit=50 --format=json
```

#### 🔍 모니터링 및 탐지

```bash
# Security Command Center 활성화
gcloud services enable securitycenter.googleapis.com

# Cloud Audit Logs 전체 활성화 확인
gcloud projects get-iam-policy [PROJECT_ID] \
  --format=json | grep auditLogConfigs

# VPC Service Controls 설정 (민감 데이터 보호)
gcloud services enable accesscontextmanager.googleapis.com
```

| 모니터링 항목 | GCP 서비스 | 설명 |
|---|---|---|
| **전체 API 호출 감사** | Cloud Audit Logs | 데이터 접근 이력 전수 기록 |
| **이상 행위 탐지** | Security Command Center | 비정상 접근 자동 경보 |
| **서비스 계정 남용 탐지** | IAM Recommender | 과도 권한 자동 식별 |
| **데이터 유출 방지** | Cloud DLP | 개인정보 포함 데이터 유출 탐지 |
| **네트워크 이상** | VPC Flow Logs + Cloud Armor | 비정상 트래픽 탐지 |

#### 🚨 침해 의심 시 GCP 즉각 대응

```bash
# 1. 모든 서비스 계정 키 즉시 비활성화
gcloud iam service-accounts disable [SA_EMAIL] --project=[PROJECT_ID]

# 2. OAuth 토큰 즉시 폐기 (프로젝트 전체)
gcloud projects remove-iam-policy-binding [PROJECT_ID] \
  --member="serviceAccount:[SA_EMAIL]" \
  --role="[ROLE]"

# 3. 비정상 접근 소스 IP 차단 (Cloud Armor)
gcloud compute security-policies rules create 1000 \
  --security-policy=[POLICY_NAME] \
  --src-ip-ranges=[SUSPICIOUS_IP] \
  --action=deny-403

# 4. Cloud Incident 지원팀 연락
# https://cloud.google.com/support/docs/incident-response
```

#### Workload Identity Federation — 서비스 계정 키 없는 GitHub CI/CD

서비스 계정 키를 완전히 제거하고 GitHub OIDC로 대체하는 권장 아키텍처:

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    permissions:
      id-token: write   # OIDC 토큰 발급 필수
      contents: read
    steps:
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/[NUM]/locations/global/workloadIdentityPools/[POOL]/providers/[PROVIDER]'
          service_account: '[SA_EMAIL]'
          # JSON 키 파일 불필요 → 키 탈취 위험 원천 제거
```

```bash
# Workload Identity Pool 생성
gcloud iam workload-identity-pools create "github-pool" \
  --project=[PROJECT_ID] \
  --location="global" \
  --display-name="GitHub Actions Pool"

# GitHub OIDC Provider 등록
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project=[PROJECT_ID] \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

---

## 10. 기업 보안 관리자 권고

### 🔴 즉각 조치 (24시간 이내)

1. **GitHub 마스터 계정 키 및 전체 Personal Access Token 즉시 교체**
2. **GCP 서비스 계정 키 전수 감사 및 미사용 키 삭제**
3. **GitHub Audit Log 90일치 전수 검토** — 비정상 접근 IP 및 시간대 분석
4. **CI/CD 파이프라인 전체 시크릿 로테이션**
5. **데이터베이스 접근 로그 검토** — 대량 데이터 조회(SELECT *) 이상 패턴 확인

### 🟡 단기 조치 (7일 이내)

6. **GitHub Organization 전 멤버 2FA 강제 적용**
7. **Secret Scanning + Push Protection 활성화**
8. **Workload Identity Federation 전환** (서비스 계정 키 제거)
9. **SIEM에 GitHub Audit Log 스트리밍 연동**
10. **개인정보 접근 최소 권한 재검토** — 마스터 계정으로 고객 DB 직접 접근 가능한 구조 개선

### 🟢 중장기 조치 (30일 이내)

11. **침해 대응 플레이북(IR Playbook) 수립** — 인지 → 24시간 내 고객 통지 프로세스 포함
12. **정기 보안 감사 체계 도입** — GitHub 토큰, GCP 서비스 계정 키 분기별 전수 점검
13. **개인정보 접근 로그 실시간 모니터링** — DLP 솔루션 도입
14. **Zero Trust 아키텍처 전환 검토**

---

## 11. 분석가 평가 및 한계

### 평가

이번 사고는 **GitHub 마스터 계정 키 관리 실패**라는 기술적 문제와, **30일간의 탐지 실패**라는 운영 문제, 그리고 **72시간 이상의 공지 지연**이라는 법적·윤리적 문제가 중첩된 복합 사고다.

특히 **"불상의 시점"에 탈취된 키가 한 달간 사용됐다는 점**은 GitHub 접근 이벤트에 대한 최소한의 모니터링도 갖추지 못했음을 시사한다. GitHub는 Audit Log와 Token 접근 기록을 기본 제공하며, 이를 SIEM과 연동했다면 이상 행위를 훨씬 일찍 탐지할 수 있었을 것이다.

공지 지연 문제는 더욱 심각하다. 피해자들이 자신의 정보가 유출됐다는 사실을 회사의 공식 통보보다 언론 보도를 통해 먼저 접했다면, 이는 **피해자 보호보다 기업 이미지 관리를 우선시한 것**으로 해석될 수 있다. 「개인정보 보호법」 위반 여부에 대한 개인정보보호위원회의 조사가 이루어져야 하며, 실질적인 피해 보상 방안이 신속히 마련되어야 한다.

### ⚠️ 분석 한계

- 공격자 귀속(Attribution), 정확한 탈취 방법, 실제 피해자 수는 공식 조사 완료 전 미확인
- 유출된 비밀번호의 해시 알고리즘 종류 및 솔트 적용 여부는 공개 미확인
- 추가 유출 항목(택배 메모 등) 공식 확인 필요
- GCP 연계 피해 여부는 현재 공개된 정보로 확인 불가

---

## 12. 참고 자료

- 데이원컴퍼니 공식 공지: https://fastcampus.co.kr/info/notices/1960
- ZDNet Korea 보도 (2026-06-11): https://zdnet.co.kr/view/?no=20260611163532
- 네이트 뉴스 단독 보도 (2026-06-10): https://news.nate.com/view/20260610n32287
- 개인정보보호위원회 — 개인정보 침해 신고: https://privacy.kisa.or.kr
- KISA 개인정보침해 신고센터: ☎ 118
- GitHub 보안 문서 — Secret Scanning: https://docs.github.com/en/code-security/secret-scanning
- GitHub Audit Log 문서: https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization
- GCP Workload Identity Federation: https://cloud.google.com/iam/docs/workload-identity-federation
- GCP 보안 권고사항: https://cloud.google.com/security/best-practices
- MITRE ATT&CK T1552.001: https://attack.mitre.org/techniques/T1552/001/
- 개인정보 보호법 제34조 (개인정보 유출 통지·신고): https://www.law.go.kr/법령/개인정보보호법

---

<sub>© 2026 HoKwang Kim (Dennis Kim) · Betalabs Inc. · 본 보고서는 공개 정보를 기반으로 한 독립 연구이며, 데이원컴퍼니 또는 관계 기관의 공식 입장이 아닙니다. 정보 제공 목적으로 작성되었습니다.</sub>

<sub>📌 리포트 파일명: `CTI-2026-0611-FASTCAMPUS_DAYONECOMPANY_KR.md` | 시리즈: CYBER-THREAT-INTELLIGENCE-REPORT</sub>
