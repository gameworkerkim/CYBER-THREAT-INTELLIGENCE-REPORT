# CYBER THREAT INTELLIGENCE REPORT — CRITICAL
## 사이버 무기 공급망의 붕괴와 국가 안보 위협

> **Coruna iOS Exploit Kit 사례 분석 및 제로데이 거래 생태계 연구**
> — 한국 정부 사이버 안보 정책에 대한 시사점과 대응 전략 —

**저자:** HoKwang Kim | gameworker@gmail.com
**GitHub:** https://github.com/gameworkerkim/

---

| 항목 | 내용 |
|------|------|
| 분류 | 위협 인텔리전스 / 정책 분석 리포트 |
| 위협 수준 | 🔴 CRITICAL (긴급 대응 필요) |
| 분석 대상 | Coruna iOS Exploit Kit (CVE-2024-23222) |
| 영향 범위 | iOS 13.0 ~ 17.2.1 / 한국 정부·공공기관 포함 |
| 작성 목적 | 방어·연구·정책 수립 — 교육 목적 공개 |
| 작성일 | 2026년 3월 20일 |
| 분류 기준 | OSINT 기반 공개 위협 인텔리전스 |

---

## 목차

1. [개요 (Executive Summary)](#1-개요)
2. [Coruna iOS Exploit Kit 기술 분석](#2-기술-분석)
3. [사이버 무기 공급망: 개발에서 범죄화까지](#3-공급망)
4. [제로데이 취약점 거래 생태계](#4-거래-생태계)
5. [취약점 확산 속도의 가속화: VBScript에서 WebKit까지](#5-확산-가속화)
6. [한국 정부 사이버 안보 현황과 위협 분석](#6-한국-현황)
7. [문제 진단: 현행 대응 체계의 한계](#7-문제-진단)
8. [대안 제시: 국제 협력·커뮤니티·AI 기반 방어 전략](#8-대안)
9. [결론](#9-결론)
10. [참고문헌](#참고문헌)

---

## 1. 개요 (Executive Summary)

사이버 무기는 더 이상 국가의 전유물이 아니다. 본 리포트는 미국 방위산업체 Trenchant(L3Harris 자회사)에서 개발된 것으로 강하게 의심되는 **Coruna iOS Exploit Kit**이 내부자 유출을 통해 러시아 사이버 무기 브로커에게 판매되고, 이후 중국 금전 목적 해킹 집단에까지 전파된 과정을 분석한다.

이 사례는 세 가지 핵심 패러다임 전환을 상징한다:

1. **국가급 사이버 전략 자산의 민간화(Democratization of Cyber Weapons)** 가 이미 현실화되었다.
2. **제로데이 취약점의 국가 독점 사용 기간**이 과거 수년에서 수개월로 급격히 단축되었다.
3. **한국을 포함한 아시아 지역 정부기관**이 이러한 고도화된 공격의 직접적 표적이 되고 있다.

> 💡 **핵심 메시지:** 오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다. 한국 정부는 실시간 국제 협력, AI 기반 모니터링, 그리고 제도적 대응 체계의 전면 재설계가 필요한 시점에 있다.

---

## 2. Coruna iOS Exploit Kit 기술 분석

### 2.1 개요 및 CVE 분석

Coruna는 iOS 13.0~17.2.1을 표적으로 하는 고도의 상업적 원격 익스플로잇 킷(Exploit Kit)으로, 사용자의 어떠한 조작 없이 악성 웹페이지 방문만으로 기기를 완전히 장악하는 **'원클릭(1-Click)' 공격 체인**을 구현한다.

| 항목 | 내용 |
|------|------|
| CVE | CVE-2024-23222 |
| 영향 범위 | iOS 13.0 ~ 17.2.1 (전 세계 수억 기기) |
| 패치 버전 | iOS 17.3+ (2024년 1월 패치) |
| 공격 유형 | 1-Click WebKit RCE → 완전 기기 장악 |
| 개발 의심 주체 | Trenchant / L3Harris (미국 방위산업체) |
| 실제 악용 사례 | 우크라이나 정부 표적 공격, 암호화폐 피싱 |

### 2.2 8단계 공격 체인

```
WebKit RCE → PAC 우회 → 샌드박스 탈출 → 권한 상승
```

- **Stage 0** — `group_loader.html`: 공격 진입점, HTML 래퍼 및 모듈 오케스트레이션
- **Stage 1** — `platform_module.js`: iOS 버전, 기기 모델, 잠금 모드 감지
- **Stage 2** — `stage1_wasm_primitives.js`: CVE-2024-23222 타입 혼란으로 arbitrary read/write 달성
- **Stage 3** — `stage2_pac_bypass.js`: Intl.Segmenter vtable 오염을 통한 PAC 우회
- **Stage 4** — `stage3_sandbox_escape.js`: Mach-O 빌더 + ARM64 가젯 체인으로 샌드박스 탈출 (~147KB)
- **Stage 5** — `stage4_payload_stub.js`: 암호화 페이로드 전달 스텁
- **Stage 6** — `stage5_main_payload.js`: PLASMAGRID 스테이저 (AES 암호화, ~292KB)
- **Stage 7** — `stage6_binary_blob.bin`: PGP 암호화 최종 바이너리 (~227KB)

### 2.3 C2 인프라 및 침해지표(IOC)

| 지표 유형 | 값 | 용도 |
|----------|-----|------|
| C2 도메인 | `8df7.cc` | IP 동기화 텔레메트리 |
| API 엔드포인트 | `https://8df7.cc/api/ip-sync/sync` | 피해자 IP 수집 |
| Google Analytics | `G-LKHD0572ES` | 방문자 추적 및 캠페인 관리 |
| 캠페인 ID | `CHMKNI9DW334E60711` | 공격 캠페인 식별자 |
| 모듈 솔트 | `cecd08aa6ff548c2` | SHA-256 모듈 파일명 해싱 키 |
| 피싱 벡터 | 가짜 암호화폐 거래소 사이트 | UNC6691 초기 접근 수단 |

> ⚠️ **주요 탈취 대상:** 암호화폐 지갑 복구 구문(Seed Phrase), 사진 앱 내 QR 코드, Apple Notes 내 민감정보, iCloud Keychain 자격증명, 기기 핑거프린트

---

## 3. 사이버 무기 공급망: 개발에서 범죄화까지

### 3.1 공급망 흐름도

```
[개발] Trenchant / L3Harris (미국)
    ↓ 내부자 유출 — 피터 윌리엄스
[중개] Operation Zero (러시아 사이버 무기 브로커)
    ↓
[1차 사용] UNC6353 (러시아 연계 국가 행위자)
    → 2025년 여름, 우크라이나 정부·군사 인사 표적 공격
    ↓
[2차 확산] UNC6691 (중국 기반 금전 목적 사이버 범죄)
    → 2025년 말, 가짜 암호화폐 사이트 통한 대규모 탈취
```

| 단계 | 시기 | 행위자 | 역할 / 표적 |
|------|------|--------|------------|
| 개발 | ~2024 | Trenchant / L3Harris (미국) | 정부·민간 감시업체 대상 제한 공급 |
| 내부자 유출 | 2024~2025 | 피터 윌리엄스 (전 직원) | Operation Zero에 익스플로잇 킷 판매 |
| 중개 유통 | 2025 상반기 | Operation Zero (러시아 브로커) | 사이버 무기 마켓플레이스 유통 |
| 국가급 사용 | 2025년 여름 | UNC6353 (러시아 연계) | 우크라이나 정부·군사 인사 표적 공격 |
| 범죄 전용 | 2025년 말 | UNC6691 (중국 기반 금전목적) | 가짜 암호화폐 사이트 피싱·자산 탈취 |

### 3.2 Operation Zero — 러시아 기반 사이버 무기 브로커

Operation Zero는 국가급 제로데이 취약점 및 익스플로잇 킷의 매입·재판매를 전문으로 하는 러시아 기반 사이버 무기 중개 마켓플레이스다. Telegram 채널과 다크웹 기반 에스크로 시스템을 통해 거래를 진행하며, iOS·Android 제로데이에 대해 수백만 달러 수준의 가격을 제시한 바 있다.

> 🚨 **전략적 시사점:** 충분한 자금력을 갖춘 집단이라면 누구나 국가급 사이버 무기를 구매 가능한 상품으로 접근할 수 있게 되었다.

---

## 4. 제로데이 취약점 거래 생태계 — 구조, 플랫폼, 거래 흔적

### 4.1 취약점 시장의 계층 구조

| 시장 구분 | 특징 | 대표 사례 |
|----------|------|----------|
| 화이트 마켓 | 합법적 버그 바운티, 벤더 공개 패치 | HackerOne, Bugcrowd, Apple Security Bounty |
| 그레이 마켓 | 정부·민간 감시업체 대상 비공개 거래 | Zerodium, Crowdfense, Exodus Intelligence |
| 블랙 마켓 | 다크웹·Telegram 기반 익명 거래, 규제 없음 | Operation Zero, 다크웹 포럼 |

### 4.2 암호화폐 기반 결제 구조와 거래 추적

사이버 무기 거래의 주요 결제 수단으로 **비트코인(BTC)** 이 선호되는 이유:

- 탈중앙화 구조로 은행 동결·제재 회피 가능
- CoinJoin, Wasabi Wallet, Samourai Wallet 등 믹싱 기법으로 추적 회피
- P2P 특성으로 국경을 초월한 즉시 결제 가능

> 📊 Chainalysis 2024년 보고서에 따르면, 사이버 범죄 연관 불법 암호화폐 거래 규모는 2023년 기준 약 240억 달러에 달하며, 전체 불법 거래의 약 40%는 거래소 KYC를 통해 식별 가능한 것으로 나타났다.

### 4.3 알려진 거래 인프라 (방어 목적 공개 IOC)

- **Telegram 채널:** 다수의 비공개 채널이 제로데이 입찰에 활용 (Recorded Future, 2024)
- **에스크로 서비스:** Monero(XMR) 기반 다크웹 에스크로 플랫폼 — USDT·BTC 혼용
- **브로커 네트워크:** Zerodium(합법), Operation Zero, 러시아·동유럽 기반 미확인 브로커
- **지불 패턴:** 거래당 수십만~수백만 달러 규모, BTC → XMR 변환 후 최종 수령 패턴

---

## 5. 취약점 확산 속도의 가속화: VBScript에서 WebKit까지

### 5.1 역사적 맥락: 국가 독점 시대의 종언

| 취약점/도구 | 최초 활용 추정 | 공개/유출 시점 | 독점 기간 | 비고 |
|------------|--------------|--------------|---------|------|
| VBScript IE 취약점 | ~2012 | ~2016~2017 | 약 4~5년 | 특정 국가 APT 전용 활용 |
| Stuxnet (CVE-2010-2568) | ~2007~2008 | 2010년 | 약 2~3년 | 이란 핵시설 표적 |
| EternalBlue (MS17-010) | ~2012~2013 | 2017년 (Shadow Brokers) | 약 4~5년 | WannaCry 악용 |
| CVE-2021-30860 (FORCEDENTRY) | ~2020 | 2021년 (CitizenLab) | 약 1~2년 | Pegasus 사용 |
| CVE-2024-23222 (Coruna) | ~2023 | 2024~2025년 | **약 1년 미만** | 민간 범죄 조직까지 전파 |

### 5.2 확산 가속화의 메커니즘

1. **사이버 무기 브로커 시장의 성숙화** — Operation Zero 같은 전문 중개 플랫폼의 등장
2. **내부자 위협의 증가** — 피터 윌리엄스 사례처럼 방산업체 내부자에 의한 의도적 유출
3. **OSINT 연구기관의 발전** — CitizenLab, Mandiant, Google Project Zero의 신속한 역분석
4. **취약점의 '재발견' 현상** — 복수의 독립 연구자가 동시 발견하는 빈도 증가

> 📌 RAND Corporation 연구(2017): 제로데이 취약점 평균 수명 약 6.9년 → 현재 고급 모바일 제로데이는 **1~2년 이하**로 단축. 국가 독점 사용 기간은 **수개월 수준**으로 접어들었다.

### 5.3 함의: 방어자의 대응 시간 압박

VBScript 취약점이 수년간 특정 국가에서만 사용되었던 것과 달리, 오늘날의 고급 모바일 익스플로잇은 개발된 지 수개월 내에 범죄 집단의 도구로 전락할 수 있다. 패치 적용 속도가 느린 한국 정부·공공기관 환경에서 이 문제는 더욱 심각하다.

---

## 6. 한국 정부 사이버 안보 현황과 위협 분석

### 6.1 주요 사이버 공격 현황

| 연도 | 주요 사건 | 배후 추정 | 피해 규모 |
|------|----------|----------|---------|
| 2009 | 7·7 DDoS 공격 | 북한 연계 추정 | 청와대·국방부 등 주요 사이트 마비 |
| 2013 | 3·20 사이버 테러 | 북한 Lazarus | 방송·금융기관 PC 4만 8천여 대 파괴 |
| 2016 | 국방망 해킹 사건 | 북한 추정 | 작전계획 5015 등 국방 기밀 유출 의혹 |
| 2021 | 한국원자력연구원 해킹 | Kimsuky (북한) | 내부 시스템 무단 접근 |
| 2022~2024 | APT 지속 공격 | 북한·중국 복합 | 정부·방산·연구기관 지속 침투 |

### 6.2 한국 정부 사이버 안보 구조의 취약점

- **부처 분산형 대응 체계:** 국가정보원, 과학기술정보통신부, 국방부, 경찰청 등의 분산된 역할로 실시간 통합 대응 지연
- **레거시 시스템 의존도:** 구형 운영체제·소프트웨어 사용 비율 높아 패치 관리 어려움
- **모바일 기기 보안 정책 미비:** iOS 익스플로잇에 대한 정부 공무원 모바일 보안 정책 미비
- **국제 위협 인텔리전스 공유 제한:** Five Eyes 등 주요 동맹에서 제외, 실시간 공유 제한
- **전문 인력 부족:** 위협 규모 대비 분석 전문 인력 부족

### 6.3 현 위협 시나리오

> 🔴 **집중 모니터링 권고:** 외교부, 국방부, 국가정보원, 핵심 방산업체 임직원의 모바일 기기에 대한 Zero-Trust 보안 아키텍처 도입이 시급하다.

---

## 7. 문제 진단: 현행 대응 체계의 한계

### 7.1 국가 수준의 대응 공백

무기수출통제 협약(Wassenaar Arrangement)이 사이버 무기에 적용되지만, 내부자 유출이나 다크웹 기반 거래는 규제 사각지대에 놓여 있다.

### 7.2 한국 특유의 대응 한계

1. **정보 공유 체계의 파편화** — 침해사고 정보가 기관 간 실시간으로 공유되지 않아 반복 피해 발생
2. **위협 인텔리전스의 수동적 수집** — 사후 분석 의존, 능동적 위협 헌팅(Threat Hunting) 역량 부족
3. **국제 협력 네트워크의 제한성** — 다국적 공급망 구조에 대한 대응 체계 미흡

---

## 8. 대안 제시: 국제 협력·커뮤니티·AI 기반 방어 전략

### 8.1 각국 보안 그룹과의 협력 강화

| 협력 기관 | 협력 내용 | 기대 효과 |
|----------|----------|---------|
| 미국 CISA | 제로데이 취약점 조기 경보, IOC 공유 | 공격 인지 시간 수개월 단축 |
| 영국 NCSC | APT 캠페인 분석 공유 | 한국 표적 공격 사전 탐지 |
| NATO CCDCOE | 사이버 훈련·전략 연구 협력 | 방어 역량 국제 수준 제고 |
| Interpol Cybercrime | 사이버 범죄 공조 수사 | Operation Zero 유형 브로커 추적 |
| FIRST (글로벌 CERT) | 침해사고 공유 및 대응 조율 | 사이버 무기 확산 조기 차단 |

### 8.2 국가 간 실시간 위협 커뮤니티 확대

- **MITRE ATT&CK + STIX/TAXII** 표준 기반 자동화된 국제 위협 인텔리전스 공유 플랫폼 구축
- **민관 공동 대응 체계:** 삼성, LG, 카카오, 네이버 등 대형 기술기업의 보안 인텔리전스를 정부와 실시간 공유

> 📊 ENISA(2023): 실시간 위협 인텔리전스 공유 체계 구축 시 침해사고 탐지 시간 **평균 60% 단축**, 피해 규모 **40% 이상 감소**

### 8.3 인공지능 기반 사이버 보안 모니터링

**권고 AI 기반 도구:**
- **AI 기반 모바일 위협 방어(MTD):** Lookout, Zimperium — 디바이스 레벨 실시간 익스플로잇 탐지
- **그래프 신경망 기반 C2 통신 탐지:** DNS·네트워크 트래픽 비정상 패턴 탐지
- **LLM 기반 위협 인텔리전스 분석:** 대용량 OSINT 데이터에서 새로운 위협 패턴 자동 추출
- **취약점 예측 모델:** CVE 데이터 학습을 통한 제로데이 고위험 코드 영역 사전 식별

**한국 정부 AI 보안 모니터링 로드맵:**

| 단계 | 기간 | 핵심 과제 | 기대 성과 |
|------|------|----------|---------|
| 1단계 — 기반 구축 | 1~2년 | STIX/TAXII 기반 국제 CTI 연동, AI 탐지 파일럿 구축 | 탐지 시간 30% 단축 |
| 2단계 — 확장 | 2~3년 | 전 정부부처 AI 탐지 시스템 배포, 민관 공유 플랫폼 구축 | 커버리지 80% 이상 |
| 3단계 — 완성 | 3~5년 | 자율 위협 헌팅, 국제 실시간 공유 완성, AI 정책 대응 통합 | 선진국 수준 대응 체계 |

---

## 9. 결론

Coruna iOS Exploit Kit 사례는 미국 방위산업에서 탄생한 정밀 도구가 내부자 위협 → 러시아 브로커 → 중국 사이버 범죄 집단을 거쳐 일반 시민의 암호화폐 탈취에 사용되기까지의 과정을 통해, 사이버 무기 공급망이 이미 심각하게 오염되어 있음을 증명한다.

VBScript 취약점이 수년간 특정 국가만 사용했던 것과 달리, 오늘날 제로데이는 개발 후 수개월 만에 범죄 집단의 도구로 전락한다. **한국은 이 위협의 직접적 표적이다.**

> 🔑 **최종 권고:** 한국 정부는 사이버 안보 예산과 인력을 현재 수준에서 최소 3배 이상 확대하고, 국제 협력·AI 도입·실시간 커뮤니티 구축의 세 축을 동시에 추진하는 **'사이버 안보 뉴딜'** 에 나서야 한다. Coruna는 경고였다. 다음은 더 정교하고 더 빠를 것이다.

---

## 참고문헌

### I. 기술 분석 및 위협 인텔리전스

> [1] Tran, D. (2024). *coruna_analysis: Technical analysis of Coruna iOS exploit kit*. GitHub Repository. https://github.com/34306/coruna_analysis
>
> [2] CVE-2024-23222 Detail. (2024). *National Vulnerability Database*. https://nvd.nist.gov/vuln/detail/CVE-2024-23222
>
> [3] Apple Security Advisory. (2024). About the security content of iOS 17.3 and iPadOS 17.3. *Apple Product Security*.
>
> [4] Mandiant Threat Intelligence. (2025). *UNC6353 and the Russian Cyber Weapon Supply Chain*. Google Cloud / Mandiant.
>
> [5] Recorded Future. (2024). *Inside Operation Zero: The Broker of Nation-State Zero-Day Exploits*. Recorded Future Intelligence Cloud.
>
> [6] Kaspersky GReAT. (2024). *From State Secrets to Cybercrime Tools: The Exploit Leak Economy*. Kaspersky Securelist.

### II. 암호화폐 및 거래 추적

> [7] Chainalysis. (2024). *The Chainalysis 2024 Crypto Crime Report*. https://go.chainalysis.com/crypto-crime-2024
>
> [8] Chainalysis. (2025). *Cryptocurrency and Cyber Weapons: 2025 Annual Report on Illicit Crypto Flows*.
>
> [9] Europol. (2024). *Internet Organised Crime Threat Assessment (IOCTA) 2024*.

### III. 제로데이 취약점 거래 생태계

> [10] Ablon, L., & Bogart, A. (2017). *Zero Days, Thousands of Nights*. RAND Corporation. https://doi.org/10.7249/RR1751
>
> [11] Frei, S., May, M., Fiedler, U., & Plattner, B. (2006). Large-Scale Vulnerability Analysis. *ACM Workshop on LSAD*. doi:10.1145/1162549.1162554
>
> [12] Herley, C., & Florêncio, D. (2010). Nobody Sells Gold for the Price of Silver. *Economics of Information Security and Privacy*, Springer.
>
> [13] Bilge, L., & Dumitras, T. (2012). Before We Knew It: An Empirical Study of Zero-Day Attacks. *ACM CCS 2012*. doi:10.1145/2382196.2382284

### IV. 내부자 위협 및 사이버 무기 민간화

> [14] Insider Threat Task Force. (2022). *Insider Threat Mitigation Guide*. CISA.
>
> [15] Scott-Railton, J. et al. (2021). *Pegasus vs Predator*. The Citizen Lab, University of Toronto.
>
> [16] Deibert, R. J. (2015). Cyberspace Under Siege. *Journal of Democracy*, 26(3), 64–78. doi:10.1353/jod.2015.0051

### V. AI 기반 사이버 보안 및 국제 협력

> [17] ENISA. (2023). *Threat Intelligence and Sharing*. European Union Agency for Cybersecurity.
>
> [18] Lin, H., & Smeets, M. (2023). The Emerging Norms on Offensive Cyber Operations. *Journal of Conflict & Security Law*, 28(1). doi:10.1093/jcsl/krad002
>
> [19] Shu, X. et al. (2020). Threat Intelligence-Driven Dynamic Access Control for Industrial IoT. *IEEE TII*. doi:10.1109/TII.2020.2975341
>
> [20] Mirsky, Y. et al. (2023). The Threat of Offensive AI to Organizations. *Computers & Security*, 124, 103032. doi:10.1016/j.cose.2022.103032

### VI. 한국 사이버 안보

> [21] KISA. (2024). *2024 Korea Cybersecurity Report*. Ministry of Science and ICT, Republic of Korea.
>
> [22] NIS. (2023). *2023 Cyber Threat Trend Report*. National Intelligence Service, Republic of Korea.
>
> [23] Kim, J., & Park, S. (2023). Challenges and Strategies for South Korea's Cybersecurity Policy. *Korean Journal of International Studies*, 21(2), 135–162.
>
> [24] Sanger, D. E., & Markoff, J. (2024). *Cyber Weapons and the New Rules of War*. Stanford Internet Observatory.

---

*본 리포트는 공개된 OSINT 자료 및 위협 인텔리전스 보고서 기반으로 작성된 교육·방어 목적의 보안 분석 문서입니다.*
*분석된 취약점(CVE-2024-23222)은 iOS 17.3 이상에서 패치 완료되었습니다.*
