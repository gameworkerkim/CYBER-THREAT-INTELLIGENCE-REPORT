| id             | CTI-2026-0603-NETSCALER                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| title          | CitrixBleed의 세 번째 그림자 — NetScaler 메모리 오버리드의 대규모 악용 재점화                                                    |
| subtitle       | CVE-2026-3055: 3월 공개된 SAML IdP 정보유출 결함이 6월 대규모 악용으로 — "RCE" 라벨과 실제 임팩트의 거리                                |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                           |
| email          | <gameworker@gmail.com>                                                                                   |
| github         | gameworkerkim                                                                                            |
| date           | 2026-06-03                                                                                               |
| classification | TLP:GREEN                                                                                                |
| severity       | CRITICAL                                                                                                 |
| lang           | ko                                                                                                       |
| tags           | Edge-Device · Pre-Auth · Memory-Overread · Session-Hijack · SAML-SSO · CitrixBleed · CISA-KEV            |
| threat\_actors | Unattributed (랜섬웨어·국가배후 혼재 가능성)                                                                          |
| cve            | CVE-2026-3055 (CVSS 9.3 v4.0 · CISA KEV) · 관련 CVE-2026-4368 (CVSS 7.7)                                  |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · NIST SP 800-207 (Zero Trust) · CISA KEV · STIX/TAXII                     |
| license        | CC BY-NC-SA 4.0                                                                                          |

# CitrixBleed의 세 번째 그림자 — NetScaler 메모리 오버리드의 대규모 악용 재점화

> **리포트 ID** `CTI-2026-0603-NETSCALER` · **발행일** 2026-06-03 · **분류** `TLP:GREEN` · **심각도** 🔴 CRITICAL
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*CVE-2026-3055: 3월 공개된 SAML IdP 정보유출 결함이 6월 대규모 악용으로 — "RCE" 라벨과 실제 임팩트의 거리*

---

## 목차

1. 요약 (TL;DR)
2. 시작하는 말 — "경계 장비는 한 번 새면 끝까지 샌다"
3. 취약점 분석 — CVE-2026-3055 메모리 오버리드
4. "RCE"인가 "정보유출"인가 — 임팩트의 정확한 분해
5. 타임라인 — 3월 공개에서 6월 대규모 악용까지
6. 공격 시나리오 — 토큰 탈취에서 SSO·VPN 장악까지
7. 한국 관점 — 경계 게이트웨이 노출면
8. 탐지·완화 권고 — 패치만으로 끝나지 않는다
9. 결론
10. 참고 문헌

---

## 요약 (TL;DR)

Citrix NetScaler ADC/Gateway의 사전인증 메모리 오버리드 취약점 `CVE-2026-3055`이 2026년 6월 초 대규모 실제 악용 단계로 진입했다. Fortinet 위협 인텔리전스팀은 전 세계 인터넷 노출 NetScaler SAML 엔드포인트를 겨냥한 공격 시도가 하루 수천 건 탐지·차단되고 있다고 확인했다.

핵심은 두 가지다. **첫째, 이것은 신규 0-day가 아니다.** Citrix는 이미 3월 23일 권고(CTX696300)로 공개·패치했고, 3월 말 정찰·악용이 시작돼 CISA KEV에 등재됐다. 6월의 사건은 "새 취약점의 등장"이 아니라 **미패치 자산 위에서 악용이 산업적 규모로 확대된 것**이다. **둘째, 임팩트 라벨이 소스마다 갈린다.** 일부 위협 피드는 이를 "RCE(CVSS 9.8)"로 표기하지만, Citrix·Rapid7·Horizon3 등 1차 소스는 **메모리 오버리드에 의한 민감정보 유출(CVSS 9.3, CVSS v4.0)**로 규정한다. 본 리포트는 이 구분을 핵심 분석 축으로 삼는다 — 정확한 임팩트는 *세션 토큰·자격증명의 메모리 누출*이며, 이는 곧 **CitrixBleed(CVE-2023-4966) 계열의 세션 하이재킹**으로 직결된다.

이 구분이 실무에서 결정적인 이유는 대응 절차가 달라지기 때문이다. 정보유출형 결함은 **패치만으로 끝나지 않는다.** 패치 이전에 메모리에서 새어 나간 세션 토큰은 패치 후에도 유효하므로, CitrixBleed의 교훈대로 **활성 세션 강제 종료**가 패치와 동급의 필수 조치다.

> ⚠️ **KISA/KrCERT 권고 반영 여부 확인 필요** — 본 건은 글로벌(Citrix·CISA KEV·Fortinet·Rapid7) 기준으로 정리됐다. 국내 공식 권고 등재·갱신 시점과 차이가 있을 수 있으니, 사내 적용 시 KISA 보안공지와 교차 확인할 것.

### Key Judgments

| #    | 판단                                                                                                                         | 신뢰도             |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | `CVE-2026-3055`의 6월 사건은 신규 취약점이 아니라 3월 공개분의 **대규모 악용 확대(escalation)**다. Fortinet이 일 수천 건 규모의 공격을 확인했다.                       | **High**        |
| KJ-2 | 1차 소스 기준 본 결함의 정확한 임팩트는 **메모리 오버리드에 의한 정보 유출**(CWE-125)이며, 일부 피드의 "RCE" 표기는 과대 표현일 개연성이 높다. 실질 위협은 세션 토큰·자격증명 누출이다.          | **Medium-High** |
| KJ-3 | 누출된 세션 토큰은 패치 후에도 유효하다. 따라서 **패치 + 활성 세션 전면 무효화**가 함께 가야 한다. 패치만 한 조직은 여전히 하이재킹에 노출된다(CitrixBleed의 직접 교훈).                  | **High**        |
| KJ-4 | NetScaler는 SAML IdP로 SSO를 종단하는 경계 장비다. 장악 시 SSO 신뢰 전체가 무너지며, 단일 장애점이 다수 백엔드 애플리케이션 접근으로 확산된다.                                 | **High**        |
| KJ-5 | NetScaler 결함은 역사적으로(CitrixBleed·CVE-2023-3519) 공개 후 수일 내 랜섬웨어·국가배후 양쪽에서 무기화됐다. 국내 금융·대기업·공공의 경계 노출 NetScaler는 즉시 점검 대상이다. | **Medium-High** |

---

## 1. 시작하는 말 — "경계 장비는 한 번 새면 끝까지 샌다"

원격접속 게이트웨이는 공격자에게 가장 가치 있는 표적이다. 하나의 장비가 VPN 종단, 로드밸런싱, 그리고 SAML 기반 SSO를 동시에 떠받치기 때문이다. 경계에서 인증 트래픽이 모이는 지점이 뚫리면, 공격자는 그 뒤에 줄지어 선 내부 애플리케이션 전체에 대한 통행권을 얻는다.

NetScaler의 이력은 이 명제를 반복 증명해 왔다. 2023년의 CitrixBleed(`CVE-2023-4966`)와 `CVE-2023-3519`은 공개 후 **수일 내**에 무기화돼 전 세계 수천 조직을 상대로 랜섬웨어·데이터 탈취 캠페인에 동원됐다. 두 사건의 공통점은 "메모리에서 무언가가 샌다"는 것이었다 — CitrixBleed는 세션 토큰을 누출시켰고, 탈취된 토큰은 MFA를 우회해 세션을 가로챘다.

`CVE-2026-3055`은 그 계보의 연장선이다. 3월에 공개돼 패치까지 나왔지만, 6월 들어 미패치 자산을 겨냥한 악용이 산업적 규모로 확대됐다. 본 리포트는 두 가지를 분리해 본다. 첫째, **무엇이 실제로 새는가**(임팩트의 정확한 분해). 둘째, **왜 패치만으로는 부족한가**(누출된 토큰의 잔존성).

---

## 2. 취약점 분석 — CVE-2026-3055 메모리 오버리드

| 항목       | 값                                                                       |
| -------- | ----------------------------------------------------------------------- |
| CVE      | `CVE-2026-3055`                                                         |
| CVSS     | 9.3 (Critical, CVSS v4.0 · Citrix/Rapid7 기준) — 일부 피드는 9.8로 표기            |
| CWE      | CWE-125 (Out-of-Bounds Read · 메모리 오버리드)                                 |
| 원인       | 입력값 검증 부족(insufficient input validation)                               |
| 전제 조건    | NetScaler ADC/Gateway가 **SAML Identity Provider(IdP)**로 구성된 경우에 한함     |
| 인증 필요    | 없음(사전인증) · 사용자 상호작용 없음                                                  |
| 영향 버전    | 13.1-62.23 미만(표준), 13.1-37.262 미만(FIPS/NDcPP), 14.1-60.58 미만(표준)        |
| 발견       | Citrix 내부 발견                                                            |
| 관련 결함    | `CVE-2026-4368` (CVSS 7.7, 레이스 컨디션 → 세션 혼선), 동일 권고 CTX696300에서 함께 수정    |
| 상태       | CISA KEV 등재 · 2026-06 Fortinet 대규모 악용 확인                                |

NetScaler가 SAML IdP로 동작할 때, 공격자는 특수 제작한 SAML 관련 요청을 보내 메모리 오버리드(경계를 넘는 읽기)를 유발한다. 인증·로그인·사용자 상호작용이 필요 없다. 이 읽기를 통해 공격자는 어플라이언스 프로세스 메모리에서 세션 데이터나 기타 자격증명 등 **민감정보를 추출**할 수 있다. 중요한 제약은 구성 의존성이다 — **기본 구성은 영향을 받지 않으며, SAML IdP로 설정된 시스템만 취약하다.** 다만 SSO를 운용하는 조직에서 SAML IdP 구성은 매우 흔하므로, "기본 구성은 안전"이라는 안내가 곧 "대부분 안전"을 의미하지는 않는다. SAML IdP 사용 여부를 명시적으로 확인해야 하며, 의도치 않게 활성화돼 있을 수 있다.

---

## 3. "RCE"인가 "정보유출"인가 — 임팩트의 정확한 분해

본 리포트가 가장 강조하는 지점이다. 동일 CVE를 두고 소스 간 라벨이 갈린다.

| 출처 계열                         | 임팩트 표기                  | CVSS        |
| ----------------------------- | ----------------------- | ----------- |
| Citrix(CTX696300) · Rapid7 · Horizon3 · Arctic Wolf · Security Affairs | **메모리 오버리드 → 민감정보 유출**  | 9.3 (v4.0)  |
| 일부 위협 인텔 피드                    | "원격코드실행(RCE)"           | 9.8 (표기 상이) |

분석적으로, 1차 벤더 기술서(Citrix)와 주요 취약점 연구기관(Rapid7·Horizon3)의 규정이 더 신뢰할 만하다. 그들은 일관되게 이를 **out-of-bounds read에 의한 정보 유출(information disclosure)**로 기술한다. "RCE" 표기는 ① CVSS 점수를 9.8로 잡은 일부 집계와 함께 전파됐고, ② 경계 장비라는 위치 때문에 최악 시나리오가 과대 일반화된 결과로 보인다.

그렇다면 "정보유출이니 RCE보다 가볍다"인가? **아니다.** 본 결함의 실질 위협은 직접 코드 실행이 아니라, 프로세스 메모리에서 **세션 토큰·자격증명을 누출**시키는 데 있다 — 이는 정확히 CitrixBleed가 그러했던 방식이다. 누출된 세션 토큰은 인증·MFA를 우회해 **유효 세션을 가로채는** 데 쓰이고, 거기서부터 SSO 신뢰 사슬과 내부망으로의 피벗이 시작된다. 즉 임팩트 유형은 "RCE"가 아니라 "**자격증명/세션 누출 → 신원 도용**"이며, 이 정확한 분류가 다음 절의 대응 절차(패치만으로 불충분, 세션 무효화 필수)를 결정한다.

> 실무 함의: CVE의 임팩트 *유형*을 오분류하면 대응 절차가 어긋난다. "RCE"로 보면 "패치하면 끝"으로 오인하기 쉽지만, "정보유출(토큰 누출)"로 정확히 보면 패치 후에도 잔존하는 탈취 토큰을 무효화해야 함이 자명해진다.

---

## 4. 타임라인 — 3월 공개에서 6월 대규모 악용까지

| 시점          | 사건                                                              |
| ----------- | --------------------------------------------------------------- |
| 2026-03-23  | Citrix가 CTX696300 공개, `CVE-2026-3055`·`CVE-2026-4368` 패치 배포     |
| 2026-03-27  | 보안 연구자들이 취약 NetScaler에 대한 능동적 정찰 관측                             |
| 2026-03-30  | 공개 보도로 실제 악용 시작 확인                                              |
| 2026-03-31경 | CISA가 KEV 카탈로그에 등재                                              |
| 2026-06-02  | **Fortinet, 대규모 실제 악용 확인** — 노출 SAML 엔드포인트 대상 일 수천 건 공격 탐지·차단   |

이 곡선이 본 사건의 본질이다. 공개·패치(3월) → 정찰(3월 말) → 초기 악용(3월 말~) → **대규모 악용 확대(6월)**. 패치가 나온 지 두 달이 지났음에도 미패치 자산 모집단이 충분히 커서, 공격자가 대규모 자동 스캐닝·악용으로 전환한 것이다. "패치가 나왔다"와 "조직이 패치했다" 사이의 간극이 그대로 공격 표면으로 남았다.

---

## 5. 공격 시나리오 — 토큰 탈취에서 SSO·VPN 장악까지

CitrixBleed 패턴을 본 건에 투영하면 다음과 같은 체인이 성립한다.

1. **사전인증 메모리 누출** — 노출된 SAML IdP 엔드포인트에 특수 요청을 보내 프로세스 메모리에서 세션 토큰·자격증명을 추출한다. (ATT&CK **T1190**)
2. **세션 하이재킹** — 탈취한 세션 토큰으로 인증·MFA를 우회해 유효 세션을 가로챈다. (**T1539** Steal Web Session Cookie, **T1550.004** Use Alternate Authentication Material)
3. **SSO 신뢰 붕괴** — NetScaler가 SAML IdP이므로, IdP 장악은 그것이 보증하던 다수 백엔드 애플리케이션에 대한 신원 보증의 붕괴를 의미한다. SAML 어서션 조작·IdP 개시 로그인 악용으로 확산된다. (**T1078** Valid Accounts)
4. **지속·피벗** — 경계 VPN 접근을 지속화하고 내부망으로 이동한다. (**T1133** External Remote Services, 이후 측면 이동)

이 체인에서 NetScaler는 단일 장애점으로 기능한다. 경계 하나의 메모리 누출이 SSO 신뢰 전체와 내부 자원 접근으로 번지는 구조다. 역사적으로 이 표면은 **랜섬웨어 그룹과 국가배후 첩보 행위자 양쪽**에서 가장 공격적으로 노려졌다.

---

## 6. 한국 관점 — 경계 게이트웨이 노출면

- **금융·대기업 원격접속** — 국내 금융권·대기업의 상당수가 NetScaler를 VPN 종단·애플리케이션 전달·SSO 게이트웨이로 운용한다. 이들 장비는 정의상 인터넷에 노출돼 있어, SAML IdP 구성 시 본 결함의 직접 표적면이 된다.
- **SSO 신뢰의 집중 위험** — SAML IdP는 다수 사내 시스템의 인증을 한 곳으로 모은다. 편의의 대가로, IdP 한 대의 메모리 누출이 곧 다수 업무 시스템의 신원 보증 붕괴로 직결된다.
- **패치 지연 모집단** — 3월 패치가 나왔음에도 6월에 대규모 악용이 성립했다는 사실 자체가, 글로벌·국내를 막론하고 경계 장비 패치 적용률이 위협 속도를 따라가지 못함을 보여준다. "장비라 건드리기 부담스럽다"는 운영 관성이 그대로 노출 기간이 된다.
- **규제·통지 관점** — 세션·자격증명 누출이 실제 발생했다면 개인정보·인증정보 침해로 이어질 수 있어, 침해 정황 확인 시 관련 신고·통지 의무를 함께 검토해야 한다.

---

## 7. 탐지·완화 권고 — 패치만으로 끝나지 않는다

1. **즉시 패치** — NetScaler ADC/Gateway를 13.1-62.23 / 14.1-60.58(표준) 또는 13.1-37.262(FIPS/NDcPP) 이상으로 갱신한다. 관리 인터페이스·CLI로 적용 버전을 검증한다.
2. **활성 세션 전면 무효화(필수)** — 패치 *이후* 모든 활성 ICA/PCoIP·인증 세션을 강제 종료한다. 패치 이전에 누출된 세션 토큰은 패치 후에도 유효하므로, 세션 무효화 없는 패치는 하이재킹 노출을 남긴다. (CitrixBleed의 직접 교훈)
3. **SAML IdP 구성 확인·축소** — 어플라이언스가 SAML IdP로 구성됐는지 명시적으로 확인한다. IdP 기능이 불필요하면 비활성화해 공격면을 줄이고, 의도치 않게 활성화돼 있지 않은지 점검한다.
4. **침해 지표 헌팅** — Fortinet이 공개한 IoC를 활용해, 비정상 SAML 어서션 활동, 예기치 않은 IdP 개시 로그인, 미식별 IP 대역에서의 접속을 로그에서 조사한다. 패치 전 노출 기간에 대한 소급 점검을 포함한다.
5. **자격증명 회전** — 침해가 의심되면 어플라이언스를 경유했을 수 있는 세션·자격증명을 회전하고, 백엔드 애플리케이션 측 비정상 인증을 함께 점검한다.
6. **경계 자산 상시 인벤토리** — 인터넷 노출 NetScaler 전수를 인벤토리화하고, KEV 등재 경계 장비에 대해서는 "패치 후 세션 무효화"를 표준 런북으로 고정한다.

---

## 8. 결론

`CVE-2026-3055`은 두 가지를 동시에 가르친다. 첫째, **위협의 시계는 공개일이 아니라 패치 적용일에 멈춘다.** 3월에 패치가 나왔어도 적용하지 않은 자산은 6월의 대규모 악용 앞에 그대로 노출됐다. 둘째, **임팩트 유형의 정확한 분류가 대응을 결정한다.** "RCE"라는 과대 라벨에 기대면 "패치하면 끝"으로 오인하지만, 본질이 *세션 토큰 누출*임을 정확히 보면 패치 후 세션 무효화가 자명한 필수 절차가 된다.

이는 직전 리포트(`CTI-2026-0602-FAULTLINE`)의 명제 — *벤더·집계 라벨이 실제 위험을 예측하지 못한다* — 의 또 다른 단면이다. 거기서는 "악용 가능성 낮음"이 먼저 터졌고, 여기서는 "RCE/정보유출"의 분류 차이가 대응 절차를 가른다. 경계 장비 방어의 기준선은 단순하다. *패치는 입구를 닫을 뿐, 이미 새어 나간 것을 회수하지 못한다.* 그러므로 패치와 세션 무효화는 분리될 수 없는 한 쌍이다.

---

## 9. 참고 문헌 (References)

[1] Citrix, "NetScaler ADC and NetScaler Gateway Security Bulletin for CVE-2026-3055 and CVE-2026-4368 (CTX696300)", 2026-03-23. <https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX696300>

[2] Threat-Modeling.com, "Citrix NetScaler SAML IDP Vulnerability (CVE-2026-3055): Large-Scale Exploitation Confirmed by Fortinet", 2026-06-02. <https://threat-modeling.com/citrix-netscaler-saml-idp-cve-2026-3055/>

[3] FortiGuard Labs, "FortiGuard Outbreak Alert: Citrix NetScaler Memory Overread Vulnerability (CVE-2026-3055)", 2026-06. <https://video.fortinet.com/latest/fortiguard-outbreak-alert-short-citrix-netscaler-memory-overread-vulnerability>

[4] Horizon3.ai, "CVE-2026-3055 Citrix NetScaler Memory Overread", 2026-03-31. <https://horizon3.ai/attack-research/vulnerabilities/cve-2026-3055/>

[5] Pierluigi Paganini, "U.S. CISA adds a flaw in Citrix NetScaler to its Known Exploited Vulnerabilities catalog", Security Affairs, 2026-03-31. <https://securityaffairs.com/190197/security/u-s-cisa-adds-a-flaw-in-citrix-netscaler-to-its-known-exploited-vulnerabilities-catalog.html>

[6] Pierluigi Paganini, "Citrix NetScaler critical flaw could leak data, update now", Security Affairs, 2026-03-24. <https://securityaffairs.com/189908/security/citrix-netscaler-critical-flaw-could-leak-data-update-now.html>

[7] Arctic Wolf, "CVE-2026-3055: Citrix NetScaler ADC and NetScaler Gateway Out-of-Bounds Read", 2026-03-23. <https://arcticwolf.com/resources/blog/cve-2026-3055/>

[8] CERT-EU, "Security Advisory 2026-003: Multiple Vulnerabilities in Citrix NetScaler and Citrix ADC", 2026. <https://cert.europa.eu/publications/security-advisories/2026>

[9] CISA, "Known Exploited Vulnerabilities Catalog — CVE-2026-3055". <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
