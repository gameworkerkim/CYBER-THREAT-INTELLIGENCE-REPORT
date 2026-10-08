<!--
---
id: CTI-2026-1008-FortiBleed
title: "FortiBleed는 끝나지 않았다 — FBI·비밀경호국 경고로 본 FortiGate 자격 증명 탈취 캠페인"
title_en: "FortiBleed Is Not Over — FBI and Secret Service Warn on FortiGate Credential Theft"
subtitle: "패치로 끝나는 취약점이 아니라, 이미 열쇠를 잃어버린 사건이다"
description: "FortiBleed는 끝나지 않았다. 패치만으로는 유출된 열쇠를 회수할 수 없다. FBI·비밀경호국이 86,644개 자격 증명의 현행 악용을 경고한다."
abstract: |
  2026-10-06 FBI·USSS 공동 권고. FortiBleed 캠페인은 여전히 활성이다. 6월 19일 기준 유효 Fortinet 장치 자격 증명 86,644개 이상, 194개국.
  원인은 새 CVE가 아니라 자격 증명 재사용과 레거시 SHA-256 저장, 인터넷 노출 관리 포털이다. 패치만으로는 이미 유출된 열쇠를 회수할 수 없다.
  계정 감사·세션 종료를 먼저, 재설정을 그다음. TLP:CLEAR. 법률·투자 권유 아님. 공격 재현 가이드 아님.
summary_for_ai: |
  CTI analytical column (KO), id CTI-2026-1008-FortiBleed, date 2026-10-08, TLP:CLEAR, group vuln-patch.
  FBI/USSS CSA 261006 (2026-10-06): FortiBleed still active. 86,644+ valid Fortinet device credentials, 194 countries as of 2026-06-19.
  Not a memory-bleed CVE; reused/leaked creds + weak SHA-256 storage + internet-exposed FortiGate SSL VPN/admin. Linked INC/Lynx ransomware operators.
  Defense order: out-of-band recovery, account inventory, kill sessions, then reset; phishing-resistant MFA; PBKDF2; pull admin off the internet. Not a how-to. Not legal/investment advice.
date: 2026-10-08
updated: 2026-10-08
author: "Dennis Kim (김호광 / HoKwang Kim)"
email: "gameworker@gmail.com"
github: "gameworkerkim"
lang: ko
tags:
  - FortiBleed
  - FortiGate
  - Credential-Theft
  - FBI
  - VPN
  - Patch
keywords:
  - "FortiBleed"
  - "FortiGate"
  - "자격 증명"
  - "FBI"
  - "SSL VPN"
  - "비밀경호국"
group: vuln-patch
featured: true
featured_rank: 1
og_image: "https://vibequant.cc/og/fortibleed.jpg"
image: "https://vibequant.cc/og/fortibleed.jpg"
schema_type: TechArticle
classification: "TLP:CLEAR"
severity: CRITICAL
confidence: "A2"
license: "CC BY-NC-SA 4.0"
draft: false
robots: index,follow
canonical: "https://cti.vibequant.cc/cti/fortibleed/"
---

<!--
  HEAD 참조 (렌더링 안 됨 · 빌드 자동 주입 · 주석 풀지 말 것)
  <title>FortiBleed는 끝나지 않았다 — FBI·비밀경호국 경고로 본 FortiGate 자격 증명 탈취 캠페인 · VibeQuant CTI</title>
  <meta name="description" content="FortiBleed는 끝나지 않았다. 패치만으로는 유출된 열쇠를 회수할 수 없다. FBI·비밀경호국이 86,644개 자격 증명의 현행 악용을 경고한다.">
  <meta name="robots" content="index,follow">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "FortiBleed는 끝나지 않았다 — FBI·비밀경호국 경고로 본 FortiGate 자격 증명 탈취 캠페인",
    "author": { "@type": "Person", "name": "김호광 (Dennis Kim)" },
    "datePublished": "2026-10-08",
    "keywords": ["FortiBleed", "FortiGate", "자격 증명", "FBI", "SSL VPN", "비밀경호국"]
  }
  </script>
-->

# FortiBleed는 끝나지 않았다 — FBI·비밀경호국 경고로 본 FortiGate 자격 증명 탈취 캠페인

## 패치로 끝나는 취약점이 아니라, 이미 열쇠를 잃어버린 사건이다

![어두운 서버랙의 방화벽에서 붉은 빛이 새어 나온다](https://vibequant.cc/og/fortibleed.jpg)

*경계 장비에서 새는 열쇠. FortiBleed는 패치로 끝나지 않는다.*

**김호광** 싸이월드 전 대표 / 2026년 10월 8일

> **분류**: TLP:CLEAR | **문서유형**: 분석 칼럼 (Analytical Column) | **작성일**: 2026-10-08

2026년 10월 6일(현지 시각), 미국 연방수사국(FBI)과 비밀경호국(USSS)이 공동 사이버보안 권고를 내고 FortiBleed 캠페인이 여전히 활성 상태라고 경고했다. 6월에 처음 보고된 이 캠페인은 6월 19일 기준 194개국에서 86,644개 이상의 유효한 Fortinet 장치 자격 증명을 확보했고, 공격자는 지금도 그 자격 증명으로 인터넷에 노출된 방화벽을 스캔하고 있다고 전했다.

이 칼럼의 결론은 하나다. FortiBleed는 패치로 끝나는 취약점이 아니라 "이미 열쇠를 잃어버린" 사건이다. 펌웨어를 올렸다고 안심할 수 없고, 비밀번호와 세션과 계정 목록을 전부 다시 의심해야 한다.

## 사건 개요 - FortiBleed란 무엇인가?

FortiBleed는 인터넷에 노출된 Fortinet FortiGate 방화벽과 SSL VPN 게이트웨이를 노린 글로벌 자격 증명 탈취 캠페인이다. 2026년 6월 SOCRadar와 Hudson Rock이 처음 문서화했고, 러시아어를 쓰는 조직이 운영하는 것으로 추정된다.

| 항목 | 내용 |
| --- | --- |
| 최초 보고 | 2026년 6월, SOCRadar·Hudson Rock |
| 공격 대상 | 인터넷 노출 FortiGate 방화벽, SSL VPN 게이트웨이 |
| 추정 행위자 | 러시아어권 초기 접근 브로커(IAB) |
| 탈취 규모 | 유효 장치 자격 증명 86,644개 이상, 194개국 (6월 19일 기준) |
| 연계 랜섬웨어 | INC, Lynx (운영자 중첩 확인) |
| 최신 경고 | FBI·USSS 공동 권고, 2026년 10월 6일 |

이름에 "Bleed"가 붙었지만 Heartbleed 같은 메모리 유출 버그가 아니다. 장치가 인증 정보를 계속 흘려보내도록 만든다는 의미에 가깝다.

## 원인 - 새로운 CVE가 아니라 "재사용된 열쇠"

FBI·USSS는 이 캠페인이 재사용되거나 유출된 자격 증명, 그리고 레거시 SHA-256 비밀번호 저장 방식을 악용한다고 밝혔다. 즉 근본 원인은 코드 결함이 아니라 운영 관행의 문제인 것이다.

첫째, 자격 증명 재사용이다. 공격자는 과거 유출 덤프와 인포스틸러 로그에서 얻은 계정으로 크리덴셜 스터핑과 패스워드 스프레이를 돌린다. 한 번 유출된 비밀번호를 바꾸지 않은 장치는 문을 열어둔 것과 같다.

둘째, 약한 해시 저장 방식이다. 반복 연산이 거의 없는 SHA-256 계열 해시는 GPU로 초당 수십억 번 대입할 수 있다. 반복 연산으로 비용을 키우는 PBKDF2와 달리, 해시만 손에 넣으면 오프라인 크래킹이 불과 몇 분에서 몇 시간이라는 현실적인 시간 안에 끝난다.

셋째, 관리 인터페이스와 SSL VPN의 인터넷 노출이다. 노출된 포털이 없으면 스캔도, 스터핑도 시작되지 않는다. 그래서 펌웨어 패치만으로는 이미 유출된 열쇠를 회수할 수 없다.

## 공격 흐름 - 5단계 캠페인

FortiBleed는 방화벽을 출입구가 아니라 "도청 장치"로 바꾼다는 점이 핵심이다. 장치 하나를 장악한 뒤 그 장치를 지나가는 인증 트래픽 전체를 수확한다.

1. **정찰**: 인터넷에 노출된 FortiGate SSL VPN·관리 포털을 대규모로 식별한다.
2. **초기 접근**: 유출 덤프와 인포스틸러 로그의 계정으로 크리덴셜 스터핑·패스워드 스프레이를 수행한다.
3. **수집**: Go로 작성된 FortigateSniffer를 배포해 RADIUS, NTLM, Kerberos, LDAP 등 24개 프로토콜의 인증 트래픽을 수동적으로 가로채 자격 증명과 해시를 모은다.
4. **오프라인 크래킹**: 해시를 GPU 가속 클러스터로 보내 Hashcat·Hashtopolis로 푼다. 크래킹된 계정은 허니팟을 걸러내고, 조직을 매핑하고, 매출과 네트워크 구조로 고가치 표적을 우선순위화한다.
5. **측면 이동과 지속성**: AD 열거, Kerberos 검증, SMB 인증으로 내부로 들어가고, 네트워크 공유의 데이터를 빼낸다. 방화벽에 새 관리자 계정을 만들고 탈취한 세션 쿠키로 접근을 유지한다.

FBI·USSS가 공개한 침해 계정명에는 `fortiAdmin`, `forticloud-sync`, `forticloud-tech`, `support_fortinet`, `adminsslvpn`, `fgtsecure`, `IT_Manager`, `Technical_support` 등이 있다. 벤더나 지원 계정처럼 보이게 지은 이름이 많다는 점에 주목해야 할 것이다. 무심코 넘어가는 계정명에 속으면 안 된다.

## 피해 범위

확인된 수치만으로도 FortiBleed는 전 세계 FortiGate 운영 조직 전체가 점검 대상이라는 뜻이다. 아래 수치 중 앞의 두 개는 FBI·USSS 권고와 The Hacker News 보도로 확인되고, 나머지는 초기 보안업계 분석에서 나온 수치다.

| 지표 | 규모 | 출처 성격 |
| --- | --- | --- |
| 유효 장치 자격 증명 | 86,644개 이상 (6월 19일 기준) | FBI·USSS 권고, THN |
| 피해 국가 | 194개국 | FBI·USSS 권고, THN |
| 공격 대상 FortiGate | 430,000대 이상 | 초기 업계 분석 |
| 랜섬웨어 암호화 피해 조직 | 최소 12곳 | 초기 업계 분석 |
| 주요 표적 업종 | 제조, 기술, 물류 | 초기 업계 분석 |
| 집중 지역 | 라틴아메리카, 아시아태평양 | 초기 업계 분석 |

아시아태평양이 집중 지역이라는 점은 한국 조직에도 직접적인 의미가 있다. 국내 중견 제조·물류 기업은 FortiGate를 SSL VPN 겸 경계 방화벽으로 쓰는 경우가 많고, 관리 인력이 적어 비밀번호 순환과 계정 감사가 밀리기 쉽다.

## 현재 상태 - 10월에도 캠페인은 살아 있다

FBI·USSS의 10월 6일 권고는 공격자가 이전에 얻은 자격 증명으로 인터넷 노출 Fortinet 방화벽을 계속 스캔하고 있다고 밝혔다. 6월 최초 보고 이후 넉 달이 지났지만 수확한 열쇠를 아직 쓰고 있다는 뜻이다.

| 시점 | 사건 |
| --- | --- |
| 2026년 10월 6일 | FBI·USSS 공동 권고: 캠페인 활성 지속, 계정 삭제로 인한 장치 잠김 경고 |
| 2026년 7월 | FortiBleed와 INC·Lynx 랜섬웨어 운영자 중첩 보도 |
| 2026년 6월 | CISA, 피싱 방지 인증·세션 종료·비밀번호 재설정·PBKDF2 적용 권고 |
| 2026년 6월 19일 | 유효 자격 증명 86,644개, 194개국 집계 |
| 2026년 6월 | SOCRadar·Hudson Rock이 캠페인 최초 문서화 |

권고는 침해가 의심되면 장치를 격리하고, 아티팩트와 로그를 수집하고, FBI·USSS에 신고한 뒤 대응 조치를 적용하라고 안내한다. 국내 조직이라면 KISA 인터넷침해대응센터(118) 신고가 같은 역할을 한다.

## 리스크 분석

가장 큰 리스크는 "패치를 했으니 끝났다"는 착각이다. FortiBleed의 위험은 다섯 갈래로 나뉜다.

| 리스크 | 무엇이 벌어지는가 | 심각도 |
| --- | --- | --- |
| 자체 방화벽 잠김 | 공격자가 원래 관리자 계정을 삭제하거나 비밀번호를 바꿔 조직을 장치에서 차단한다. 대역 외 복구 수단이 없으면 복구가 어렵다. | 매우 높음 |
| 다중 랜섬웨어 | 초기 접근 브로커가 접근 권한을 INC·Lynx 등 하위 조직에 판매한다. 오늘 털린 접근이 몇 주 뒤 다른 랜섬웨어 이름으로 나타날 수 있다. | 매우 높음 |
| 신뢰 경계 붕괴 | 방화벽을 지나는 RADIUS·LDAP·Kerberos 트래픽에서 AD 서비스 계정, 메일, DB 계정까지 수확된다. 피해가 방화벽에서 끝나지 않는다. | 높음 |
| 은밀한 지속성 | `forticloud-sync`처럼 정상 계정을 흉내 낸 관리자 계정과 탈취한 세션 쿠키가 비밀번호 재설정 후에도 남는다. | 높음 |
| 데이터 유출 | 측면 이동 후 네트워크 공유의 민감 데이터가 빠져나가 이중 갈취의 재료가 된다. | 높음 |

특히 첫 번째 리스크는 사고 대응 자체를 막는다. 방화벽 관리 권한을 잃으면 차단 정책을 바꾸거나 로그를 확보하는 일부터 막힌다.

## 대응 방안

순서가 중요하다. 비밀번호부터 바꾸면 공격자가 만든 백도어 계정과 세션은 그대로 남는다. 계정 감사와 세션 종료를 먼저, 재설정을 그다음에 한다.

### 오늘 해야 할 일 (24시간 이내)

- [ ] **대역 외 복구 경로 확인**: 콘솔 포트·로컬 관리 계정 등 잠김에 대비한 복구 수단이 실제로 작동하는지 점검한다.
- [ ] **계정 인벤토리 감사**: 모든 관리자·VPN 계정을 목록화하고, 위에 열거한 의심 계정명이나 만든 기억이 없는 계정을 비활성화한다.
- [ ] **세션 전면 종료**: 활성 SSL VPN 세션과 관리자 세션을 모두 끊어 탈취된 세션 쿠키를 무효화한다.
- [ ] **자격 증명 재설정**: Fortinet VPN·관리자 비밀번호를 전부 재설정하고, 방화벽을 거친 AD 서비스 계정과 LDAP 바인드 계정도 함께 바꾼다.
- [ ] **관리 인터페이스 비노출**: 관리 GUI·SSH를 공용 인터넷에서 닫고 신뢰된 내부망이나 관리 전용망으로만 허용한다.
- [ ] **침해 여부 확인**: Hudson Rock의 FortiBleed Checker로 자사 장치가 유출 목록에 있는지 조회한다.

### 이번 주에 해야 할 일

- [ ] **피싱 방지 MFA**: 원격 접속과 관리자 계정 전부에 FIDO2 등 피싱 방지 MFA를 적용한다.
- [ ] **PBKDF2 전환**: FortiOS 7.2.11 이상에서 관리자 자격 증명을 PBKDF2로 저장하고 레거시 SHA-256 해시를 제거한다.
- [ ] **로그 헌팅**: 방화벽·VPN·인증·도메인 컨트롤러 로그에서 신규 계정 생성, 비정상 지역 로그인, 대량 Kerberos 요청, SMB 인증 급증을 찾는다.
- [ ] **펌웨어 업그레이드**: FortiOS 7.4, 7.6, 8.0 계열 최신 버전으로 올리고 FortiCloud SSO 관련 CVE(CVE-2025-59718, CVE-2025-59719, CVE-2026-24858) 조치 상태를 확인한다.

### 침해가 확인되면

장치를 격리하고, 로그와 설정 백업을 증거로 보존한 뒤, KISA(118)와 수사기관에 신고한다. 방화벽을 지난 모든 계정을 유출된 것으로 간주하고 도메인 전체 비밀번호 재설정과 krbtgt 이중 재설정까지 검토해야 한다.

## 맺으며, 보안 장비는 가장 먼저 의심해야 할 자산이다

FortiBleed는 경계 장비가 뚫리면 그 장비가 조직 전체의 인증 정보를 모으는 수집기가 된다는 사실을 보여준다. 방화벽은 지키는 장비이면서 동시에 가장 많은 비밀이 지나가는 장비다.

이번 사건에서 필요한 것은 새로운 보안 제품이 아니다. 노출을 줄이고, 비밀번호를 순환하고, 계정 목록을 정기적으로 보고, 해시를 강하게 저장하는 기본기다. 기본기가 무너진 자리에 86,644개의 열쇠가 쌓였다.

## 참고 자료

- [FBI Warns FortiBleed Remains Active After Amassing 86,644 Fortinet Device Credentials](https://thehackernews.com/2026/10/fbi-warns-fortibleed-remains-active.html) — The Hacker News, 2026년 10월 7일
- [FBI·USSS 공동 사이버보안 권고(CSA 261006)](https://www.ic3.gov/CSA/2026/261006.pdf) — IC3, 2026년 10월 6일
- [FortiBleed 최초 보도: Fortinet 공격 캠페인](https://thehackernews.com/2026/06/attackers-exploit-three-fortinet.html) — The Hacker News, 2026년 6월
- [FortiBleed 5단계 캠페인 분석](https://thehackernews.com/2026/06/fortibleed-targeted-fortigate-firewalls.html) — The Hacker News, 2026년 6월
- [CISA, Fortinet 고객 대상 조치 권고](https://thehackernews.com/2026/06/cisa-warns-fortinet-customers-as.html) — The Hacker News, 2026년 6월
- [FortiBleed와 INC·Lynx 랜섬웨어 연계](https://thehackernews.com/2026/07/fortibleed-credential-theft-linked-to.html) — The Hacker News, 2026년 7월
