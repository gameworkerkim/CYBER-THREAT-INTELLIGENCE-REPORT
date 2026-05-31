| id             | CTI-2026-0601-GREYVIBE                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| title          | 회색지대의 공격자 — GenAI로 무장한 GREYVIBE의 우크라이나 표적 작전                                                                     |
| subtitle       | 스피어피싱·가짜 캡차·미끼 사이트 5개 캠페인으로 본 'AI 보조 멀웨어 개발'과 귀속(attribution)의 붕괴                                                |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                  |
| email          | <gameworker@gmail.com>                                                                                          |
| github         | gameworkerkim                                                                                                   |
| date           | 2026-06-01                                                                                                      |
| classification | TLP:GREEN                                                                                                       |
| severity       | HIGH                                                                                                            |
| lang           | ko                                                                                                              |
| tags           | AI-Assisted-Malware · Cyber-Espionage · Russia-Ukraine · Attribution-Decay · ClickFix · RAT · Hybrid-Threat    |
| threat\_actors | GREYVIBE (러시아어 사용 · 크렘린 이해관계 정렬 · 사이버범죄 생태계 연계)                                                                 |
| cve            | N/A (TTP 중심 분석)                                                                                                 |
| frameworks     | MITRE ATT&CK · Diamond Model · Admiralty Code · STIX/TAXII                                                      |
| license        | CC BY-NC-SA 4.0                                                                                                 |


# 회색지대의 공격자 — GenAI로 무장한 GREYVIBE의 우크라이나 표적 작전

> **리포트 ID** `CTI-2026-0601-GREYVIBE` · **발행일** 2026-06-01 · **분류** `TLP:GREEN` · **심각도** 🟠 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*스피어피싱·가짜 캡차·미끼 사이트 5개 캠페인으로 본 'AI 보조 멀웨어 개발'과 귀속(attribution)의 붕괴*

---


## 목차

1. 요약 (TL;DR)
2. 시작하는 말 — "귀속이 녹아내리는 자리"
3. 위협 행위자 개요 — GREYVIBE 프로파일
4. 공격 체인 분석 — 5개 캠페인
5. 도구 분석 — PhantomRelay · LegionRelay · FallSpy
6. AI 활용 분석 — '개발 보조'로서의 GenAI와 귀속 붕괴
7. 사이버범죄 연계 — 국가-범죄 혼성(hybrid)의 증거
8. 한국 관점 — NK 행위자 플레이북의 예고편
9. 탐지·완화 권고
10. 결론
11. 참고 문헌

---


## 요약 (TL;DR)

2026년 5월 29일, 핀란드 보안기업 WithSecure는 이전까지 문서화되지 않은 위협 행위자 **GREYVIBE**를 공개했다. 이 그룹은 최소 2025년 8월부터 우크라이나 및 우크라이나 관련 기관을 지속적으로 표적해 왔으며, 러시아어를 사용하고 러시아 시간대에서 활동하는 것으로 평가된다. 활동의 목표는 러-우 전쟁 맥락에서의 정보수집으로, 크렘린의 국가 이해관계와 정렬된다.

본 사건이 단순한 또 하나의 사이버첩보 캠페인을 넘어서는 이유는 두 가지다. 첫째, 그룹은 군·정부·민간·기업을 아우르는 폭넓은 표적군을 상대로 **스피어피싱, 가짜 캡차 페이지, 위장 미끼 사이트** 등 다중 벡터를 운용했다. 둘째, 그리고 더 중요하게, 그룹은 **생성형 AI(GenAI)와 LLM을 멀웨어 개발·인프라·이미지 생성·침투 후 명령 작성에 직접 활용**한 정황이 다수 포착됐다.

WithSecure는 GREYVIBE를 "운영보안 실수를 저지르는 저~중간 수준의 정교함을 가진 그룹"으로 묘사한다. 그러나 본 리포트가 주목하는 본질은 정교함의 수준이 아니라 **AI 보조가 귀속(attribution) 체계 자체를 침식**한다는 점이다. 안정적 기술 산출물(artifact)에 기반한 전통적 군집화(clustering) 기법은, 행위자가 AI로 구성요소를 빈번하게 생성·리팩터링·교체할 수 있는 환경에서 신뢰도를 잃는다.

### Key Judgments

| #    | 판단                                                                                                                                | 신뢰도             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | GREYVIBE는 단일 CVE가 아니라 **사회공학 중심의 다중 진입 벡터**로 운용된다. 패치 가능한 결함이 아니라 인간 신뢰를 표적하므로, 기술 패치만으로는 차단되지 않는다.                                  | **High**        |
| KJ-2 | 그룹은 GenAI(Ideogram·ChatGPT·Gemini)를 **멀웨어 개발 라이프사이클 전반의 보조 도구**로 사용했다. 이는 기술적 역량 격차를 메우고, 개발 속도를 높이며, 귀속 단서가 되는 기성 도구 의존을 줄이는 효과를 낸다. | **High**        |
| KJ-3 | AI 활용은 **귀속의 신뢰도를 구조적으로 떨어뜨린다.** 산출물이 자주 교체되면 기존 IOC·코드 유사도 기반 군집화가 무력화된다. 이는 모든 첩보 행위자에게 일반화될 위협 방향이다.                            | **Medium-High** |
| KJ-4 | 역설적으로 AI 보조는 **LegionRelay에 설계 결함을 주입**해 백엔드 기능을 노출시켰다. 이는 GREYVIBE가 순수 국가행위자가 아닐 가능성을 시사하는 신호다.                                    | **Medium**      |
| KJ-5 | 그룹은 **국가-범죄 혼성(hybrid)** 영역에 위치한다. TrickBot/UAC-0098 연계 ISO 빌더, 무관해 보이는 범죄 클러스터에 걸친 PhantomRelay 변종, XMRig 채굴기가 그 근거다.            | **Medium**      |
| KJ-6 | GREYVIBE의 플레이북(ClickFix 가짜 캡차, 위장 Zoom 페이지, 자선·성인 사이트 미끼)은 한국을 표적하는 북한 연계 행위자(예: Kimsuky)의 최근 TTP와 상당 부분 중첩된다. **국내 방어 관점의 예고편**이다. | **Medium-High** |

---


## 1. 시작하는 말 — "귀속이 녹아내리는 자리"

위협 인텔리전스의 근간은 귀속이다. 우리는 코드 유사도, 인프라 재사용, 명령 습관, 도구 지문 같은 안정적 산출물을 단서로 행위자를 군집화하고 추적한다. 이 방법론은 행위자가 자신의 도구와 습관을 비교적 천천히 바꾼다는 암묵적 전제 위에 서 있다.

GREYVIBE는 이 전제를 흔든다. 이 그룹은 로더, 난독화 스크립트, 백엔드 인프라, 침투 후 명령, 심지어 미끼 이미지까지 생성형 AI의 보조로 만들어낸 정황을 남겼다. WithSecure 연구원 Mohammad Kazem Hassan Nejad는 행위자가 운영 흔적의 구성요소를 AI 보조로 빈번하게 생성·재구성·교체할 수 있다면, 안정적 기술 산출물에 기반한 전통적 군집화가 시간이 지날수록 신뢰도를 잃을 수 있다고 분석했다.

다시 말해, AI는 공격의 폭발력을 키우는 동시에 **방어자의 추적 좌표계를 흐린다.** GREYVIBE가 "저~중간 수준의 정교함"으로 평가되면서도 위협 인텔리전스 업계의 주목을 받는 이유가 여기에 있다. 정교한 그룹이 아니어도, AI 보조만으로 귀속을 어렵게 만들 수 있다는 사실 자체가 위협 모델의 전환이다.

---


## 2. 위협 행위자 개요 — GREYVIBE 프로파일

| 항목       | 내용                                                       |
| -------- | -------------------------------------------------------- |
| 명칭       | GREYVIBE (WithSecure 명명, 신규)                             |
| 활동 개시    | 최소 2025년 8월 이후 (지속 중)                                    |
| 언어·시간대   | 러시아어 사용 · 러시아 시간대 활동                                     |
| 정렬       | 크렘린 국가 이해관계 (러-우 전쟁 정보수집)                                |
| 표적군      | 군 · 정부 · 민간 · 기업 (우크라이나 및 우크라이나 관련 기관)                    |
| 정교함 평가   | 저~중간 (운영보안 실수 다수)                                        |
| 성격       | 국가-범죄 혼성(hybrid) — 현/전직 사이버범죄자 연계 정황                     |
| 핵심 차별점   | GenAI/LLM을 멀웨어 개발·인프라·미끼 생성에 직접 활용                       |

GREYVIBE는 국가 정렬 활동에도 불구하고, 일부 구성원이 현직 또는 전직 사이버범죄자로 추정되어 더 넓은 러시아 사이버범죄 생태계와도 연결고리를 갖는다. WithSecure는 이 그룹이 사이버범죄와 국가 정렬 활동 사이의 **회색지대**에 위치하며, 이로 인해 귀속이 복잡해지고 두 범주의 전통적 구분이 흐려진다고 평가했다.

---


## 3. 공격 체인 분석 — 5개 캠페인

GREYVIBE는 표적에 대해 최소 다섯 개의 구분되는 공격 체인을 운용했다.

| 캠페인           | 진입 벡터                                          | 전달 페이로드                                                  |
| ------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **PhantomMail**   | 스피어피싱 이메일 → Google Drive·4sync의 악성 ZIP/RAR     | JS 로더로 미끼 문서 실행 후 PhantomRelay(PowerShell RAT) 구동        |
| **PhantomClick**  | 위장 도메인의 ClickFix식 가짜 캡차 (Zoom·LAPAS 사칭)        | 사용자에게 명령 실행 유도 → PhantomRelay 감염 체인 개시                    |
| **PrincessClub**  | 가짜 우크라이나 성인 클럽 사이트 (후속본은 WebRTC 영상통화로 음성·영상 캡처) | Android: FallSpy / Windows: PhantomRelayV1 또는 LegionRelay |
| **DroneLink**     | 우크라이나군 지원 자선재단 사칭 웹사이트                          | WireGuard + LegionRelay                                  |
| **Nebo**          | 러시아어 로그인 화면을 모방한 FallSpy 샘플                     | 우크라이나 군 인력이 '러시아 군 단말 접속'으로 오인하도록 유도                       |

각 체인은 표적의 심리(전쟁 상황, 군 인력의 호기심, 자선 동기)를 정밀하게 겨냥한다. 특히 Nebo는 적국(러시아) 시스템에 접속하는 것처럼 위장해 표적의 경계심을 역이용하는 정교한 심리 설계를 보인다. PhantomClick의 ClickFix식 가짜 캡차는 "사람임을 증명하라"는 일상적 동작을 무기화한 사회공학으로, 사용자가 스스로 악성 명령을 실행하게 만든다.

---


## 4. 도구 분석 — PhantomRelay · LegionRelay · FallSpy

| 도구              | 플랫폼      | 핵심 기능                                                                                     |
| --------------- | -------- | ----------------------------------------------------------------------------------------- |
| **PhantomRelay**    | Windows  | PowerShell 기반 RAT. 호스트 프로파일링, PowerShell 스크립트·Windows 명령 실행                                 |
| **PhantomRelayV1**  | Windows  | PhantomRelay 변종. 커스텀 워치독(watchdog) 지속성 메커니즘 추가                                             |
| **LegionRelay**     | Windows  | 경량 PowerShell RAT. 파일 열거·유출, 스크린샷, 브라우저 데이터 탈취, Telegram·WhatsApp 데이터 유출, RDP 접근 설정         |
| **FallSpy**         | Android  | 스파이웨어. 감염 단말에서 민감 데이터 수집                                                                    |

LegionRelay는 기능 폭이 넓은 만큼 표적의 통신·금융·신원 데이터를 광범위하게 노린다. 메신저(Telegram·WhatsApp) 데이터 유출과 브라우저 자격증명 탈취가 결합되면, 단일 감염이 곧 표적의 디지털 생활 전반의 노출로 직결된다. FallSpy의 Android 표적화는 군·정부 인력의 모바일 단말이 공격면임을 분명히 한다.

---


## 5. AI 활용 분석 — '개발 보조'로서의 GenAI와 귀속 붕괴

GREYVIBE의 다양한 전달 벡터와 도구는 AI 플랫폼 활용에서 비롯된 것으로 평가된다. 활용 정황이 포착된 플랫폼과 용도는 다음과 같다.

- **Ideogram AI** — 미끼 이미지 생성
- **OpenAI ChatGPT · Google Gemini** — LegionRelay 개발, 난독화·로더 스크립트, 백엔드 인프라, 침투 후 명령 작성 보조

WithSecure는 GREYVIBE의 AI 사용이 세 가지 이점을 제공한다고 분석했다.

1. **역량 격차 보완** — 부족한 기술 전문성을 AI 보조로 메운다.
2. **개발 라이프사이클 가속** — 도구 생성·리팩터링 속도를 높인다.
3. **귀속 회피** — 귀속 단서가 되는 기존 멀웨어·도구 의존을 줄인다.

세 번째가 방어 관점에서 가장 무겁다. 안정적 산출물이 사라지면, IOC 매칭과 코드 유사도 기반 군집화라는 위협 인텔리전스의 핵심 도구가 둔화된다. 이것이 본 리포트가 `Attribution-Decay`(귀속 붕괴)를 핵심 태그로 삼은 이유다.

다만 AI 보조는 양날의 검이었다. AI가 LegionRelay에 **설계 결함**을 주입해 멀웨어의 백엔드 기능이 노출됐다. 정교한 국가행위자라면 저지르지 않을 실수라는 점에서, 이는 GREYVIBE를 순수 국가행위자로 보기 어렵게 만드는 신호이기도 하다. 즉, AI는 진입 장벽을 낮추는 동시에 **새로운 종류의 운영보안 실수**를 만들어낸다 — "LLM은 엑셀이지 오라클이 아니다"라는 명제가 공격자 측에도 그대로 적용되는 셈이다.

---


## 6. 사이버범죄 연계 — 국가-범죄 혼성(hybrid)의 증거

WithSecure는 다음 근거로 GREYVIBE의 사이버범죄 생태계 연계를 **중간 신뢰도**로, 현/전직 범죄자 구성원 관여를 **저~중간 신뢰도**로 평가했다.

- TrickBot 갱 및 **UAC-0098**과 연계가 의심되는 ISO 빌더에 대한 접근·사용 정황
- 서로 무관해 보이는 범죄 클러스터(2025년 7월~2026년 2월 Microsoft Teams 보이스피싱 캠페인, 2026년 2월 말~3월 말 KongTuke ClickFix 전달 체인)에 걸친 PhantomRelay 변종의 존재
- 초기 개발·테스트 샘플의 VirusTotal 업로드 (운영보안 실수)
- 개발 산출물 명명 규칙에 사용된 인터넷 은어 ("letsrollboyos", "totallyunsus", "cuteuwu")
- 일부 LegionRelay 감염 머신에 배포된 XMRig 채굴기

WithSecure는 이들 구성원이 국가지원 그룹에 흡수됐는지, 국가 지시 하에 독립 운용하는지, 혼성 팀을 이뤘는지는 불분명하다고 밝혔다. 이 모호함 자체가 현대 위협 환경의 특징이다.

---


## 7. 한국 관점 — NK 행위자 플레이북의 예고편

GREYVIBE는 우크라이나를 표적했지만, 그 플레이북은 한국 방어 관점에서 결코 먼 이야기가 아니다.

- **TTP 중첩** — ClickFix식 가짜 캡차, 위장 Zoom/회의 페이지, 가짜 설치 페이지를 통한 사회공학은 한국을 표적하는 북한 연계 행위자(예: Kimsuky의 위장 보안 SW 설치 페이지·가짜 Webex 페이지)의 최근 TTP와 상당히 겹친다. GREYVIBE의 캠페인 구조는 국내 방어자가 곧 마주할 패턴의 예고편으로 읽어야 한다.
- **AI 보조 멀웨어의 일반화** — GenAI로 진입 장벽이 낮아지면, 저~중간 정교함의 행위자도 빠르게 도구를 교체·생성한다. 국내 기업·기관을 노리는 행위자 역시 같은 경로로 IOC 수명을 단축시킬 수 있다. **IOC 중심 방어에서 행위(behavior)·TTP 중심 방어로의 전환**이 필수다.
- **귀속 붕괴의 정책적 함의** — 국내 침해사고 대응에서 "어느 그룹의 소행인가"를 안정적 산출물로 판정하던 관행이 흔들린다. 위협 헌팅·탐지룰을 도구 지문이 아니라 **행위 패턴(ClickFix 유도, PowerShell RAT 행위, 메신저 데이터 유출 시퀀스)** 위에 세워야 한다.
- **모바일 표적화** — FallSpy류 Android 스파이웨어는 군·정부·기업 임직원의 모바일 단말이 1차 공격면임을 상기시킨다. 모바일 EDR/MTD 도입 검토가 필요하다.

---


## 8. 탐지·완화 권고

1. **행위 기반 탐지로 전환** — IOC 매칭에만 의존하지 말고, ClickFix식 사용자 유도, PowerShell 기반 RAT의 정찰·유출 시퀀스, 메신저(Telegram·WhatsApp) 데이터 접근, RDP 설정 변경 같은 **행위 패턴**에 경보를 건다.
2. **ClickFix·가짜 캡차 차단** — 사용자가 클립보드 명령을 직접 실행하도록 유도하는 페이지를 탐지·차단한다. "캡차 통과를 위해 명령을 붙여넣으라"는 모든 요청은 침해 시도로 간주하도록 사용자 교육을 강화한다.
3. **첨부·다운로드 통제** — Google Drive·4sync 등 외부 호스팅의 ZIP/RAR 내 스크립트(JS·LNK·PowerShell) 실행을 정책으로 제한한다.
4. **PowerShell 강화** — Constrained Language Mode, 스크립트 블록 로깅, AMSI를 활성화하고, 비정상 PowerShell 자식 프로세스를 모니터링한다.
5. **모바일 방어** — 군·정부·민감 직군 단말에 MTD/모바일 EDR를 적용하고, 사이드로딩(APK 직접 설치)을 차단한다.
6. **미끼 인프라 헌팅** — 자선재단·회의 SW·성인 사이트를 사칭하는 신규 도메인을 위협 헌팅 대상으로 등록하고, WebRTC 기반 음성·영상 캡처 유도 페이지를 경계한다.
7. **귀속에 대한 겸손** — AI 보조로 산출물이 빠르게 변하는 행위자에 대해서는 단정적 귀속을 보류하고, 다중 출처·다중 신뢰도(Admiralty Code) 기반으로 평가를 누적한다.

---


## 9. 결론

GREYVIBE는 "정교한" 그룹이 아니다. 운영보안 실수를 남기고, AI가 주입한 설계 결함으로 자기 멀웨어의 백엔드를 노출했다. 그럼에도 이 사건이 중요한 이유는 단 하나다 — **AI 보조는 정교하지 않은 행위자조차 귀속을 어렵게 만들 수 있다는 것을 보여줬기 때문이다.**

전통적 위협 인텔리전스는 "행위자는 천천히 변한다"는 전제 위에 세워졌다. GenAI는 이 전제를 무너뜨린다. 로더·난독화·인프라·미끼가 며칠 단위로 재생성되는 환경에서, 안정적 산출물에 묶인 군집화는 빠르게 낡는다. 방어의 무게중심은 *무엇으로 만들어졌는가*(artifact)에서 *어떻게 행동하는가*(behavior)로 옮겨가야 한다.

그리고 이 위협은 우크라이나에 머물지 않는다. ClickFix 가짜 캡차, 위장 회의 페이지, 사회공학 미끼라는 GREYVIBE의 문법은 한국을 노리는 행위자들이 이미 구사하거나 곧 채택할 문법이다. 회색지대의 공격자는 국경도, 분류 체계도 존중하지 않는다.

---


## 참고 문헌 (References)

[1] Mohammad Kazem Hassan Nejad, "GREYVIBE", WithSecure Labs, 2026-05. <https://labs.withsecure.com/publications/greyvibe>

[2] Ravie Lakshmanan, "New Russian-Linked GREYVIBE Targets Ukraine with AI-Powered Cyberattacks", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/new-russian-linked-greyvibe-targets.html>

[3] "ClickFix Malware Campaign Exploits ... (ClickFix 기법 배경)", The Hacker News, 2025-08. <https://thehackernews.com/2025/08/clickfix-malware-campaign-exploits.html>

[4] "Some Members of Conti Group Targeting Ukraine (UAC-0098 배경)", The Hacker News, 2022-09. <https://thehackernews.com/2022/09/some-members-of-conti-group-targeting.html>

---


© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
