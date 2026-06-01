| id             | CTI-2026-0601-IRANGENAI                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| title          | 서방 AI의 무기화 — 이란의 GenAI 보조 사이버전과 북한으로의 학습 전이                                                                              |
| subtitle       | FT 보도 팩트체크로 본 '생산성 증폭'으로서의 LLM, Web3 약탈 생태계와 한반도 위협의 수렴                                                                  |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                            |
| email          | <gameworker@gmail.com>                                                                                                    |
| github         | gameworkerkim                                                                                                             |
| date           | 2026-06-01                                                                                                                |
| classification | TLP:GREEN                                                                                                                 |
| severity       | HIGH                                                                                                                      |
| lang           | ko                                                                                                                        |
| tags           | AI-Assisted-Operations · Nation-State · Iran · DPRK · Web3-Theft · Social-Engineering · ClickFix · Deepfake · Sanctions-Evasion · Capability-Diffusion |
| threat\_actors | APT42 (Charming Kitten / Mint Sandstorm) · Storm-2035 · 다수 이란 APT 클러스터 / (한반도) Lazarus · BlueNoroff(TA444) · Kimsuky · Famous Chollima |
| cve            | CVE-2025-8088 (WinRAR, 이란 APT42 익스플로잇 경로 검토 참조)                                                                          |
| frameworks     | MITRE ATT&CK · Diamond Model · Admiralty Code · STIX/TAXII                                                                |
| license        | CC BY-NC-SA 4.0                                                                                                           |


# 서방 AI의 무기화 — 이란의 GenAI 보조 사이버전과 북한으로의 학습 전이

> **리포트 ID** `CTI-2026-0601-IRANGENAI` · **발행일** 2026-06-01 · **분류** `TLP:GREEN` · **심각도** 🟠 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*FT 보도 팩트체크로 본 '생산성 증폭'으로서의 LLM, Web3 약탈 생태계와 한반도 위협의 수렴*

---

## 목차

1. 요약 (TL;DR)
2. 시작하는 말 — "엑셀이지 오라클이 아니다"
3. 팩트 체크 — FT 보도 8개 주장 검증
4. 위협 행위자 개요 — 이란 APT 생태계
5. AI 활용 분석 — '역량 도약'이 아닌 '생산성 증폭'
6. Web3 여파 — 약탈 생태계와 국가-범죄 혼성
7. 한국 관점 — 북한 연계와 학습 전이(Capability Diffusion)
8. 탐지·완화 권고
9. 결론
10. 참고 문헌

---

## 1. 요약 (TL;DR)

2026년 5월 말, 영국 *Financial Times*(Jacob Judah)는 이란 연계 행위자가 ChatGPT·Gemini 등 서방 LLM을 사이버·정보전 전 단계에 통합하고 있다고 보도했다 [1]. 악성코드 개발, 원어민 수준의 아랍어·히브리어 피싱, 드론 유도·전자전 같은 실전 군사 연구, 그리고 선전전(딥페이크)에 이르는 광범위한 활용이 그 내용이다.

본 리포트는 (1) 해당 보도의 주장을 1차 공개 소스로 교차 검증하고, (2) "전례 없는 속도"라는 과장 프레임을 위협 인텔리전스 관점에서 **'생산성 증폭(force multiplier)'**으로 보정하며, (3) 이 흐름이 **Web3 약탈 생태계**와 **북한 연계 행위자의 학습 전이**를 통해 한반도 위협으로 수렴하는 경로를 분석한다.

핵심 메시지는 단순하다. **AI는 국가 행위자에게 새로운 무기를 주지 않았다. 기존 TTP의 속도·규모·언어 품질·확장성을 끌어올렸을 뿐이다.** 그리고 바로 그 '증폭' 때문에, 능력의 *국가 간 전이(diffusion)*가 빨라진다 — 이란이 다듬은 사회공학 문법이 북한의 암호화폐 약탈 기계와 결합하는 순간, 한국의 Web3·방산·핀테크 부문이 1차 사정권에 들어온다.

### Key Judgments

| #    | 판단                                                                                                                                                | 신뢰도             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | FT 보도의 핵심 주장(이란의 LLM 악용, 악성코드·피싱·군사 연구 보조, 빅테크의 차단 대응)은 1차 소스(Google GTIG, OpenAI 공개 보고)로 교차 검증된다.                                                  | **High**        |
| KJ-2 | 단, "전례 없는 속도"는 능력의 질적 도약이 아니라 **생산성 향상**이다. GTIG의 일관된 평가는 *novelty가 아니라 productivity가 지배적*이라는 것이다.                                                  | **High**        |
| KJ-3 | "UAE 일 50만 건+ AI 조력 공격", "트럼프 조롱 딥페이크"는 **당국/단일 매체 인용 수준**으로, 독립 기술 검증된 사실로 제시해서는 안 된다.                                                            | **Medium**      |
| KJ-4 | AI 보조의 진짜 안보 함의는 **능력의 국가 간 전이 가속**이다. 진입장벽이 낮아지면 동일 TTP가 이란→러시아→북한 클러스터로 빠르게 확산된다.                                                                | **Medium-High** |
| KJ-5 | **Web3는 AI 무기화의 1차 수익화 표면이다.** 북한 라자루스는 2025년 Bybit에서 14억 달러+를 탈취했고, AI 기반 사칭이 2025년 암호화폐 손실을 사상 최대 170억 달러로 끌어올렸다.                                | **High**        |
| KJ-6 | 이란이 다듬는 LLM 보조 사회공학(딥페이크 화상통화·가짜 회의 페이지·장기 페르소나)은 **북한 BlueNoroff/Famous Chollima의 플레이북과 수렴**한다. 한국은 이 수렴의 최전선이다.                                  | **Medium-High** |

---

## 2. 시작하는 말 — "엑셀이지 오라클이 아니다"

언론은 "이란이 AI로 사이버전 역량을 *전례 없는 속도*로 키운다"고 쓴다. 위협 인텔리전스 분석가의 임무는 이 형용사를 검증하는 것이다.

결론부터 말하면, 보도의 **사실(fact)** 대부분은 맞다. 그러나 **프레임(frame)**은 보정이 필요하다. Google 위협인텔리전스그룹(GTIG)이 1년 넘게 관측한 결론은 "AI가 공격자에게 신규 역량(novelty)을 부여한 게 아니라, 기존 작업의 생산성(productivity)을 높였다"는 것이다 [3][4]. 즉 LLM은 정찰을 *대신*하지 않고 *빠르게* 만들며, 익스플로잇을 *발명*하지 않고 *정리*해 주고, 피싱을 *창조*하지 않고 *현지화·대량화*한다.

이것이 본 아카이브가 일관되게 견지하는 명제다 — **LLM은 엑셀이지 오라클이 아니다.** 계산을 가속하는 도구이지, 없던 답을 내려주는 신탁이 아니다. 공격자 측에서도 마찬가지다. AI는 진입 장벽을 낮추고 작전 밀도를 높이지만, 동시에 **새로운 종류의 운영보안 실수**(예: AI가 멀웨어에 주입한 설계 결함)를 만들어낸다 [참고: CTI-2026-0601-GREYVIBE].

문제는 다른 곳에 있다. 진입 장벽이 낮아진다는 것은 곧 **능력이 국가 간에 더 빨리 전이된다**는 뜻이다. 이 리포트의 후반부는 그 전이의 종착지가 왜 한반도인지를 다룬다.

---

## 3. 팩트 체크 — FT 보도 8개 주장 검증

| #   | 보도 주장                                | 검증 등급      | 근거                                                       |
| --- | ------------------------------------ | ---------- | -------------------------------------------------------- |
| 1   | FT가 이란의 ChatGPT·Gemini 악용을 보도        | ✅ 확인       | FT 원문(Judah) [1], 다수 매체 신디케이션                            |
| 2   | 악성코드 개발 + 아랍어·히브리어 정교한 피싱            | ✅ 확인       | FT [1], Google GTIG [3][4]                               |
| 3   | UAE 매일 50만 건+ "ChatGPT 조력" 공격        | ⚠️ 당국 인용   | FT가 UAE 발표 인용. 인과(ChatGPT 기여)는 독립 검증 안 됨                  |
| 4   | 이스라엘 국민 대상 피싱 물결(일부 정보기관 협력 유도)      | ✅ 확인       | FT [1], APT42 패턴과 일치                                     |
| 5   | 트럼프 조롱 딥페이크 선전 영상                    | ⚠️ FT 단독   | 분쟁 관련 AI 허위정보 정황과 일치하나 단독 1차 소스 미확보                       |
| 6   | F-35 전파 교란 연구에 AI 사용                 | ✅ 확인       | Google GTIG(2025-01): F-35 교란·대드론·미사일방어 연구 명시 [3]        |
| 7   | 드론 유도·전자전 등 실전 군사 연구                 | ✅ 확인       | FT의 이란 군사 저널 약 300편 분석(최근 5년) [1]                        |
| 8   | 구글·OpenAI의 이란 연계 계정 탐지·차단            | ✅ 확인       | OpenAI(Storm-2035, APT42 차단), Google GTIG [3][4]         |

**보강 사실:** 이란 내 ChatGPT 접근은 OpenAI(국제 제재)와 이란 당국(검열) 양쪽에서 차단돼 있다. 그럼에도 이란 행위자는 우회 접속으로 이를 사용한다 — 이는 **제재 회피(sanctions-evasion)**가 사이버 작전의 부수효과가 아니라 구조적 동기임을 보여준다. 동일 논리는 뒤에서 다룰 북한에도 그대로 적용된다.

---

## 4. 위협 행위자 개요 — 이란 APT 생태계

| 항목       | 내용                                                              |
| -------- | --------------------------------------------------------------- |
| 핵심 행위자   | **APT42** (Charming Kitten / Mint Sandstorm) — IRGC 연계 국가후원 첩보 |
| 영향력 공작   | **Storm-2035** — 선거·여론 표적 IO 그룹                                 |
| 클러스터 규모  | Gemini 악용 이란 그룹 10개+ 관측, APT42가 이란발 AI 프롬프트의 약 30% 차지 [4]       |
| 정렬       | IRGC 국가 이해관계 · 제재 회피                                            |
| 표적군      | 방산·중동 거점·이스라엘·미국 정부/기업                                          |

**APT42의 LLM 활용 단계(공격 생애주기 전반):**

- **정찰·번역** — 미국 항공우주 방어체계 기술 설명, 이스라엘-하마스 분쟁 동향, 중국 방산 전략 동향 등 공개 정보 요약·번역 [3]
- **피싱·페르소나** — 보안 테마 미끼 작성·현지화·문법 교정, 장기 위장 페르소나 유지 [4]
- **개발 보조** — WinRAR 취약점(**CVE-2025-8088**) 익스플로잇 경로 검토, Python 기반 Google Maps 스크래퍼·Rust 기반 SIM 관리 도구 개발 보조 [5]
- **침투 후 연구** — 위성 신호 교란, 전자전, 무인기 기종, F-35 교란, 이스라엘 미사일 방어 연구 [3]

GTIG가 추적한 일부 실험적 악성코드 계열(PROMPTFLUX 등 LLM 실시간 연동형)과 캠페인(HonestCue·CoinBait·ClickFix류)도 이 생태계에서 보고됐다 [4]. 다만 GTIG는 이를 신규 역량이 아니라 **효율화**로 평가한다.

---

## 5. AI 활용 분석 — '역량 도약'이 아닌 '생산성 증폭'

생성형 AI가 공격자에게 제공하는 것은 "새 칼"이 아니라 "더 빠른 숫돌"이다. 단계별 효과:

1. **정찰·표적 프로파일링** — 공개 정보 요약·번역으로 학습 곡선 단축.
2. **피싱·소셜엔지니어링** — 원어민 수준 다국어 문구의 대량 생성, 장기(수 주) 가짜 페르소나 유지. 문법·어휘 오류에 의존하던 안티피싱 휴리스틱을 무력화한다.
3. **개발 보조** — 스크립트·도구·익스플로잇 경로 *정리* (발명 아님).
4. **영향력 공작** — 딥페이크·허위정보 대량 생산. 단, 도달·확산은 생성량에 비례하지 않는다(Storm-2035의 낮은 Breakout Scale 평가).

> **핵심 보정:** "전례 없는 속도"는 *규모·효율*의 변화이지 *능력의 질적 도약*이 아니다. CrowdStrike 2026 글로벌 위협 보고서는 AI 기반 공격이 전년 대비 89% 증가하고, 평균 침투 후 횡적 이동(breakout) 시간이 29분으로 단축됐다고 평가했다 [6] — 핵심 지표는 "새로운 공격"이 아니라 "기존 공격의 가속"이다.

이 보정이 중요한 이유는, 위협 모델을 바꾸기 때문이다. 방어의 무게중심은 *무엇으로 만들어졌는가*(artifact·IOC)에서 *어떻게 행동하는가*(behavior·TTP)로 옮겨가야 한다.

---

## 6. Web3 여파 — 약탈 생태계와 국가-범죄 혼성

AI 무기화의 **1차 수익화 표면(monetization surface)은 Web3**다. 이유는 구조적이다 — 암호화폐는 (1) 제재 회피에 최적이고, (2) 탈취 즉시 현금화·세탁이 가능하며, (3) 표적(개발자·프로젝트 기여자·거래소 직원)이 분산돼 있어 사회공학에 취약하다.

**수치로 본 Web3 약탈:**

- 2025년 2월, 북한 연계 **Lazarus**가 거래소 **Bybit**에서 14억 달러+ 상당의 이더리움을 탈취 — 암호화폐 사상 최대 익스플로잇 [27]
- AI 기반 사칭 사기가 2025년 암호화폐 손실을 **사상 최대 170억 달러**로 견인 [26]
- 2026년 들어서도 **Drift($2.85억)**, **Zerion($10만, AI 강화 사회공학)** 등 DPRK 연계 침해 지속 [23]
- Lazarus가 누적 약 **67억 달러**의 암호화폐를 탈취해 AI·미사일 개발에 전용했다는 분석 [28]

**국가-범죄 혼성(hybrid)의 일반화:** GREYVIBE 사례에서 보았듯(러시아 사이버범죄 생태계 연계), 그리고 이란·북한 사례에서 재확인되듯, 현대 국가 행위자는 순수 첩보가 아니라 **첩보+범죄 수익화의 혼성** 형태로 진화하고 있다. Web3는 이 혼성 모델의 핵심 자금원이다.

**한국 Web3 관점(DAXA·특금법):** 국내 DAXA 회원 거래소, Web3 발행사, DeFi 프로젝트 기여자는 동일 위협의 직접 사정권에 있다. 특히 **개발자 채용·투자 미팅·감사(audit) 협업**을 가장한 접근은 국내 프로젝트가 일상적으로 노출되는 벡터다. 컴플라이언스(KoFIU 의심거래보고, 트래블룰)는 *사후* 자금추적에 기여하나, *사전* 침해 차단에는 행위 기반 탐지가 별도로 필요하다.

---

## 7. 한국 관점 — 북한 연계와 학습 전이(Capability Diffusion)

이 리포트가 가장 무겁게 보는 지점이다. 이란 사례는 한국에 직접 위협이 아니지만, **그 플레이북이 북한으로 전이될 때 한국이 최전선이 된다.**

### 7.1 이란-북한: 제재 회피 동기의 동형성

이란과 북한은 (1) 강력한 국제 제재 하에 있고, (2) 그 회피를 위해 사이버 작전을 *국가 수익·역량 사업*으로 운용하며, (3) 서방 LLM을 우회 접속으로 무기화한다는 점에서 **동형(isomorphic)**이다. 군사·미사일 분야의 양국 협력은 오랜 관찰 대상이며, 사이버 영역에서도 TTP·인프라·세탁 경로의 *간접 학습*이 일어날 개연성이 높다(신뢰도: Medium).

### 7.2 북한의 AI 활용은 이미 성숙 단계

북한은 "AI를 배우는 단계"가 아니라 "AI로 산업화하는 단계"에 있다.

- **IT 인력 위장(Famous Chollima / WageMole / Jasper Sleet)** — 도난 신원 + 딥페이크 영상으로 포춘 500대 기업 채용을 통과. AIApply·Final Round AI 등 AI 확장으로 지원서 자동작성·실시간 면접 응답을 수행 [24][25]
- **딥페이크 화상통화(BlueNoroff/TA444 — GhostCall·GhostHire)** — 가짜 Zoom·Teams, 클론 Calendly로 Web3 임원/개발자를 유인, 화상통화에 실존 임원 딥페이크 등장 [26][29]
- **LLM 직접 활용** — DPRK 클러스터(UNC2970 등)의 Gemini 사용, 그리고 ChatGPT·Cursor 등을 활용해 2026년 1분기에만 약 1,200만 달러 상당 지갑 공개키 유출 정황 [4][30]
- **국내 점유율** — AhnLab 2026 전망 기준, 2024.10~2025.09 사후분석에서 Lazarus 31건·**Kimsuky 27건**으로, 한국 표적 위협의 상수(常數)다 [31]

### 7.3 학습 전이(Capability Diffusion)의 메커니즘

AI가 진입 장벽을 낮춘다는 것은 **능력이 더 빨리 복제·확산된다**는 의미다. 구체적 전이 경로:

- **TTP 수렴** — 이란 APT42가 다듬는 ClickFix식 가짜 캡차, 위장 회의 페이지, 장기 페르소나 사회공학은 북한 BlueNoroff/Kimsuky의 가짜 보안 SW·가짜 Webex·딥페이크 화상통화 플레이북과 **이미 상당 부분 중첩**된다.
- **공개 사례의 역설** — GTIG·WithSecure 등의 공개 보고는 방어자에게 유용하지만, 동시에 **다른 국가 행위자에게 무료 학습 교본**이 된다. 한 행위자의 성공 TTP는 AI 보조로 빠르게 재현된다.
- **IOC 수명 단축** — AI로 도구·인프라·미끼가 며칠 단위로 재생성되면, IOC 중심 방어는 빠르게 낡는다. 국내 방어자는 **행위(behavior)·TTP 중심**으로 무게중심을 옮겨야 한다.

### 7.4 한국 방어의 함의

1. **IOC → 행위 기반 전환** — ClickFix 유도, PowerShell RAT의 정찰·유출 시퀀스, 메신저(Telegram·KakaoTalk) 데이터 접근, 딥페이크 화상통화 유도 패턴을 탐지 기준으로.
2. **채용·투자·감사 협업 검증** — Web3·방산·핀테크 직군 대상, 외부 다회차 접촉(코딩 챌린지·데모·인터뷰)에 대한 아웃오브밴드 신원검증 절차 의무화.
3. **모바일 공격면** — FallSpy류 Android 스파이웨어, 모바일 딥페이크 통화를 전제로 한 MTD/모바일 EDR 도입.
4. **귀속에 대한 겸손** — AI로 산출물이 빠르게 변하는 행위자에는 단정적 귀속을 보류하고, Admiralty Code 기반 다중 출처·다중 신뢰도 평가를 누적.

---

## 8. 탐지·완화 권고

1. **행위 기반 탐지로 전환** — IOC 매칭에만 의존하지 말고, 사용자 자가실행 유도(ClickFix), PowerShell RAT 정찰·유출 시퀀스, 메신저 데이터 접근, RDP 설정 변경 등 행위 패턴에 경보.
2. **딥페이크 화상통화 대응** — 신규/일회용 회의 계정, 룩어라이크 Zoom·Teams 링크, "오디오 수정 도구 설치" 요청을 침해 시도로 간주. 영상통화 중 민감 동작(설치·키 입력) 유도는 즉시 중단·검증.
3. **다국어 피싱 전제 교육** — "AI 생성 피싱은 더 이상 어색하지 않다"를 전제로 보안 인식 교육 재설계. 문법 품질 의존 룰 폐기.
4. **첨부·다운로드 통제** — 외부 호스팅(드라이브·파일공유)의 ZIP/RAR 내 스크립트(JS·LNK·PowerShell) 실행 정책 제한.
5. **PowerShell 강화** — Constrained Language Mode, 스크립트 블록 로깅, AMSI 활성화 및 비정상 자식 프로세스 모니터링.
6. **Web3 직군 특화 통제** — 개발자 단말 분리, 하드웨어 지갑·다중서명, 코드 챌린지/면접 클라이언트의 격리 실행, 자격증명·세션 토큰 탈취 탐지.
7. **신속 패치** — 알려진 취약점(예: CVE-2025-8088) 신속 적용. AI는 익스플로잇을 *발견*이 아니라 *정리*해 가속한다.
8. **위협 헌팅** — APT42/Charming Kitten, Lazarus/BlueNoroff/Kimsuky의 공개 TTP·IOC 기반 헌팅 룰 상시 운용.

---

## 9. 결론

FT 보도의 사실관계는 대체로 옳다. 그러나 "전례 없는 속도"라는 수사는 위협의 *성격*을 오독하게 만든다. 이란이 얻은 것은 **새로운 무기가 아니라 더 빠른 작업대**다 — LLM은 엑셀이지 오라클이 아니다.

진짜 안보 함의는 능력의 **국가 간 전이 가속**에 있다. 진입 장벽이 낮아지면, 이란이 다듬은 사회공학 문법은 북한의 암호화폐 약탈 기계로 빠르게 복제된다. Bybit 14억 달러, 누적 67억 달러, 2025년 사칭 손실 170억 달러라는 숫자는 그 전이가 이미 *수익화*되고 있음을 보여준다.

그리고 그 종착지에 한국이 있다. Web3 발행사, DAXA 거래소, 방산·핀테크 직군, 그리고 개발자 개개인이 1차 사정권이다. 회색지대의 공격자는 국경도 분류 체계도 존중하지 않는다. 방어의 좌표를 *무엇으로 만들어졌는가*에서 *어떻게 행동하는가*로 옮겨야 하는 이유다.

---

## 10. 참고 문헌 (References)

[1] Jacob Judah, "Western AI models turbocharging Iran's cyber operations", *Financial Times*, 2026-05. (신디케이션 다수)

[2] "Iran Uses Western AI for Cyber Warfare — FT", Realist English, 2026-05-31.

[3] "Adversarial Misuse of Generative AI", Google Cloud / GTIG, 2025-01-29. <https://cloud.google.com/blog/topics/threat-intelligence/adversarial-misuse-generative-ai>

[4] "Google Flags Gemini Abuse by China, Iran, North Korea and Russia", OpenSourceForU, 2026-02-12. (GTIG 후속 업데이트 정리)

[5] "Google Discloses Gemini AI Abuse by APT Groups", The National CIO Review, 2026-02-13.

[6] CrowdStrike, *2026 Global Threat Report* (요약 보도 경유), 2026-03.

[23] "North Korean Hackers Hit Zerion With AI Social Engineering Attack", MEXC News, 2026-04-15.

[24] "North Korea lures engineers to rent identities in fake IT worker scheme", BleepingComputer, 2025-12-04.

[25] "North Korean APTs Use AI to Enhance IT Worker Scams", Dark Reading, 2026-03-06.

[26] "North Korea-Linked Hackers Use Deepfake Video Calls to Target Crypto Workers", Decrypt, 2026-01-27.

[27] "Google: North Korean hackers use AI-deepfakes to target crypto", CoinGeek, 2025-09-10.

[28] "Inside UNC1069: How North Korea Is Using AI Deepfakes and macOS Malware", 2026-03-12.

[29] "Inside North Korea's New Deepfake Crypto Scam (GhostCall·GhostHire)", BeInCrypto, 2025-10-28.

[30] "Inside Lazarus: How North Korea uses AI to industrialize attacks on developers", Expel, 2026-04-23.

[31] "AI May Enhance Lazarus Group's Crypto Attacks in 2026, AhnLab Predicts", 2026 outlook.

[관련] CTI-2026-0601-GREYVIBE — GenAI 보조 멀웨어 개발과 귀속 붕괴(러-우 사례).

---

© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division
본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 하며, 공개 OSINT에 기반한다. 특정 조직·기관·국가의 공식 입장을 대변하지 않으며, 공격 기법의 운용 절차·익스플로잇 세부는 의도적으로 배제했다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*"Today's state strategic asset becomes tomorrow's cybercrime tool." — CTI-2026-0320*
