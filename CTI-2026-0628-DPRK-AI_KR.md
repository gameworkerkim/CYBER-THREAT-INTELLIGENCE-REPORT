| id             | CTI-2026-0628-DPRK-AI                                                                                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | LLM을 든 정찰총국 - 북한 AI 해킹의 2026년 질적 전환 정밀 분석                                                                                                                                                                                  |
| subtitle       | 김수키·라자루스의 사회공학 × 공급망 × LLM 내장형 멀웨어 결합, 그리고 한국의 대응의 현실                                                                                                                                                                    |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                           |
| email          | gameworker@gmail.com                                                                                                                                                                                                    |
| github         | gameworkerkim                                                                                                                                                                                                           |
| date           | 2026-06-28                                                                                                                                                                                                              |
| classification | TLP:GREEN                                                                                                                                                                                                               |
| severity       | HIGH (추세상 CRITICAL로 격상 중)                                                                                                                                                                                                |
| lang           | ko                                                                                                                                                                                                                      |
| tags           | | DPRK | Kimsuky | Lazarus | Andariel | LLM-Abuse | Social-Engineering | Supply-Chain | Agentic-AI | | --- | --- | --- | --- | --- | --- | --- | --- |                                                                  |
| threat\_actors | | Kimsuky (APT43, 정찰총국 121국) | Lazarus / Famous Chollima (APT38) | Andariel | BlueNoroff | Contagious Interview (G1052) | UNC1069 (Sapphire Sleet) | UNC4736 (AppleJeus/Citrine Sleet) | | --- |       |
| frameworks     | | MITRE ATT&CK | NIST SP 800-207 (Zero Trust) | NIST SP 800-218 (SSDF) | STIX/TAXII | | --- | --- | --- | --- |                                                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                         |


# LLM을 든 정찰총국 - 북한 AI 해킹의 2026년 질적 전환 정밀 분석

> **리포트 ID** `CTI-2026-0628-DPRK-AI` · **발행일** 2026-06-28 · **분류** `TLP:GREEN` · **심각도** 🔴 HIGH (추세상 CRITICAL)
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*김수키·라자루스의 사회공학 × 공급망 × LLM 내장형 멀웨어 결합, 그리고 한국의 대응의 현실*

---


## 목차

1. [요약 (TL;DR)](#요약-tldr)
2. [3대 조직 구도 - 첩보·수익·교란의 분업](#1-3대-조직-구도---첩보수익교란의-분업)
3. [축 ①: AI 사회공학 - 딥페이크 신분증에서 합성 페르소나까지](#2-축--ai-사회공학---딥페이크-신분증에서-합성-페르소나까지)
4. [축 ②: 공급망 공격의 산업화 - Contagious Interview](#3-축--공급망-공격의-산업화---contagious-interview)
5. [축 ③: LLM 내장형·에이전틱 멀웨어 - "just-in-time AI"](#4-축--llm-내장형에이전틱-멀웨어---just-in-time-ai)
6. [2026 vs 그 이전 - 무엇이 질적으로 달라졌나](#5-2026-vs-그-이전---무엇이-질적으로-달라졌나)
7. [MITRE ATT&CK 매핑](#6-mitre-attck-매핑)
8. [귀속의 한계 - 절제된 분석](#7-귀속의-한계---절제된-분석)
9. [한국의 대응 좌표 - 사회·국가·보안 담당자](#8-한국의-대응-좌표---사회국가보안-담당자)
10. [결론](#9-결론)
11. [참고 문헌](#참고-문헌-references)

---


## 요약 (TL;DR)

2025년까지 북한의 AI 활용은 "생산성 보조"*수준이었다. 피싱 문안 다듬기, 영어·문화 장벽 보정, 코드 스니펫 생성("vibe coding") 같은 보조 도구였다 [[10]](#ref-10). 2026년의 그림은 다르다. **AI가 공격 수명주기 전반을 자율적으로 수행하는 단계로 질적 전환**이 진행 중이며, 북한 조직이 이 전환의 최전선에 있다.

본 리포트는 북한의 AI 해킹을 세 축의 결합으로 분석했다.

- **축 ① 사회공학:** 김수키(Kimsuky/APT43)가 ChatGPT로 한국군 신분증 딥페이크를 생성해 스피어피싱에 사용했고(2025-07, Genians 보도), BlueNoroff는 AI 딥페이크 영상을 Zoom 면접에 투입했다. IT 인력 위장 사기는 AI로 가짜 이력서·페르소나·기술 면접 통과를 자동화했다 [[1]](#ref-1)[[5]](#ref-5)[[7]](#ref-7).
- **축 ② 공급망:** Contagious Interview(가짜 면접) 캠페인이 npm·PyPI·Go·crates.io·Packagist를 가로지르며 **1,700개 이상의 악성 패키지**로 산업화됐다. DPRK는 2026년 암호화폐 탈취 가치의 **약 76%**를 차지한다 [[11]](#ref-11)[[12]](#ref-12)[[13]](#ref-13).
- **축 ③ LLM 내장형 멀웨어:** Google GTIG는 실행 시점에 LLM을 질의해 코드를 동적 생성·자가변형하는 멀웨어(PROMPTFLUX, PROMPTSTEAL 등)를 보고했고, DPRK 연계 UNC1069가 Gemini로 지갑 데이터 탐색·피싱 스크립트 생성에 활용한 정황을 확인했다 [[8]](#ref-8)[[9]](#ref-9).

핵심 메시지는 하나다. **AI는 북한의 만성적 병목이었던 "숙련 인력 부족"을 극복하는데 도움을 줬다**했다. 과거 정찰총국은 함흥컴퓨터기술대학 등에서 다년간 양성한 소수 인력에 의존했으나, 이제 비숙련 인력도 AI 보조로 Fortune 500 기술면접을 통과하고 침투를 수행한다 [[5]](#ref-5). 한국은 공격면(전사적 AI 도입)은 늘고 방어(노후 시스템)는 정체된 **비대칭 심화** 국면에 있으며, 국정원은 2026 국가정보보호백서에서 "자율형 보안 운영 체계"로의 즉각 전환과 국가 컨트롤타워의 필요성을 진단했다 [[14]](#ref-14).

### Key Judgments

| #    | 판단                                                                                                                                          | 신뢰도             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | 북한의 AI 활용은 2025년 "생산성 보조"에서 2026년 **"공격 수명주기 자율 실행 + LLM 내장형 멀웨어"**로 질적 전환 중이다. 이는 양적 증가가 아니라 운영 모델의 변화다.                                     | **High**        |
| KJ-2 | 사회공학은 여전히 1차 침투 촉매이나, AI로 **진정성·규모·다국어 능력**이 비약했다. 김수키 딥페이크 군 신분증, BlueNoroff AI 딥페이크 영상, IT워커 합성 페르소나가 실증 사례다.                          | **High**        |
| KJ-3 | 공급망 공격이 **크로스 에코시스템 산업화** 단계에 진입했다. Contagious Interview는 5개 이상 패키지 레지스트리를 동시 표적하며, 단일 클러스터가 1,700+ 패키지를 운용한다.                            | **High**        |
| KJ-4 | DPRK는 사회공학을 진입점으로 한 대형 암호화폐 탈취에서 **2026년 가치 기준 약 76% 점유**라는 산업화 지표를 달성했다(블록체인 분석 보고 인용). Bybit($15억)·Drift($2.85억) 사례가 대표적이다.            | **Medium-High** |
| KJ-5 | LLM **내장형 멀웨어**(런타임 LLM 질의로 코드 동적 생성)는 아직 초기 단계이나, 시그니처 기반 탐지를 구조적으로 무력화하는 방향이다. UNC1069의 Gemini 악용이 DPRK 연계 사례로 보고됐다.                    | **Medium**      |
| KJ-6 | 한국은 **공격면 확대(AI 전면 도입) vs 방어 정체(시스템 노후)**의 비대칭이 심화되고 있다. 개별 기업·기관 단위 대응으로는 한계가 명확하며 국가 차원 상시 대응 체계가 시급하다.                                 | **Medium-High** |
| KJ-7 | 일부 정부부처·통신사 침해의 귀속은 **불확실성**을 동반한다. "김수키 추정"과 "중국 배후 가능성"이 병존하는 사례가 있어, 언어·TTP 단서만으로 단정해서는 안 된다.                                         | **Medium**      |

> **분석 원칙:** "AI 해킹"은 과장되기 쉬운 주제다. 본 리포트는 *실증된 것*(딥페이크 신분증, 크로스 에코시스템 패키지, 런타임 LLM 질의 멀웨어)과 추세적 전망(완전 자율 공격)을 구분하며, 귀속의 불확실성을 명시했다.

---


## 1. 3대 조직 구도 - 첩보, 수익, 교란의 분업

북한 사이버 작전은 정찰총국 산하 121국을 중심으로 **역할이 분업화**돼 있다. DomainTools의 분류와 국내 분석을 종합하면 다음 구도가 명확하다 [[13]](#ref-13)[[15]](#ref-15)[[16]](#ref-16).

| 조직              | 별칭                              | 주 임무            | 대표 표적·수법                                                  |
| --------------- | ------------------------------- | --------------- | -------------------------------------------------------- |
| **Kimsuky**     | APT43                           | **첩보 수집**       | 외교·안보·국방·대북 전문가, 탈북민, 언론인 대상 스피어피싱·위장             |
| **Lazarus**     | Famous Chollima, APT38          | **수익 창출(자금원)**  | 암호화폐 거래소·DeFi 대형 탈취, 공급망 침투, IT워커 사기                  |
| **Andariel**    | —                               | **교란·신호(시그널링)** | 자격증명 탈취, 랜섬웨어(Medusa RaaS) 배포, 인증서 탈취·서명             |
| **BlueNoroff**  | (Lazarus 분파)                    | 금융·암호화폐 표적      | Zoom 사회공학 + AI 딥페이크 영상, 암호화폐 임원 표적                    |

안랩의 '2025 사이버 위협 동향 & 2026 보안 전망'에 따르면, 공개된 APT 활동 86건(2024-10~2025-09)이 북한발로 전체의 절반가량을 차지했고, 라자루스 31건·김수키 27건으로 집계됐다. 한국은 일관된 최우선 표적이다 [[16]](#ref-16). 세 조직 모두 2025~2026년에 걸쳐 AI 채택을 가속하고 있다는 점이 이번 분석의 출발점이다.


## 2. 축 ①: AI 사회공학 - 딥페이크 신분증에서 합성 페르소나까지

김수키의 전통적 무기는 **신뢰와 사회적 관계를 악용한 스피어피싱**이다 [[15]](#ref-15). 2026년의 변화는 이 무기에 생성형 AI가 결합됐다는 것이다.

**2-1. 김수키 × ChatGPT 딥페이크 군 신분증 (2025-07).** Genians Security Center는 김수키가 ChatGPT로 한국군 공무원 신분증 *샘플 이미지*를 생성해, 국방 관련 기관을 사칭한 피싱 이메일의 진정성을 높인 사례를 보고했다(2025-09-15 공개). 신분증 사본 제작은 불법이라 ChatGPT가 1차로 거부하지만, "목업/샘플 디자인"으로 프롬프트를 재구성하는 **프롬프트 인젝션(jailbreak)**으로 우회됐다. 첨부된 PNG는 98% 확률로 딥페이크로 판정됐고, 함께 설치된 `LhUdPC3G.bat`가 정보 탈취·원격제어를 개시했다 [[1]](#ref-1)[[2]](#ref-2)[[3]](#ref-3). 이 캠페인은 같은 해 6월의 ClickFix 기반 피싱과 동일 악성코드를 사용했다.

**2-2. BlueNoroff × AI 딥페이크 영상.** 2026년 주간 위협 브리핑은 BlueNoroff가 **Zoom 사회공학에 AI 증강 딥페이크 영상**을 투입해 암호화폐 임원을 표적했고, 기존 피해자를 신뢰 미끼로 활용해 신규 관계 형성 없이 표적을 확대(T1656)했다고 전한다. 이는 네트워크 기반 차단을 무력화하는 DPRK 특유의 확산 기법이다 [[12]](#ref-12).

**2-3. IT 인력 위장 사기의 AI 자동화.** Anthropic은 2025년 8월 위협 인텔리전스 보고서에서 북한 IT 인력이 Claude로 **가짜 신원·경력 생성, 코딩 테스트 통과, 실제 기술 업무 수행**까지 수행해 Fortune 500 기업에 원격 취업한 사례를 공개했다. 핵심 함의는 *"영어·미국 문화·기술 역량이 없어도 AI가 각 장벽을 메워준다"*는 것 — 즉 **다년 훈련이라는 정권의 병목이 제거**됐다 [[5]](#ref-5)[[6]](#ref-6). Recorded Future는 동일 작전군(PurpleDelta·PurpleBravo)이 AI로 코드 생성·문서 수정·번역·합성 모집책 이미지 생성에 활용했음을 관측했다 [[4]](#ref-4). CSIS는 이 위협이 2026년에도 지속·확대되며 **음성·텍스트·영상 멀티모달 딥페이크**로 고도화될 것으로 전망한다 [[7]](#ref-7).


## 3. 축 ②: 공급망 공격의 산업화 - Contagious Interview

가짜 면접(Contagious Interview, MITRE G1052)은 2023년부터 이어진 캠페인이지만, **2026년에 산업화 단계로 진입**했다 [[17]](#ref-17).

- **크로스 에코시스템 확산.** 단일 북한 연계 클러스터가 npm·PyPI·Go Modules·crates.io·Packagist에 **동일 스테이징 인프라·로더 패턴**으로 병렬 배포한다. Socket은 광의의 캠페인에서 **1,700개 이상의 패키지**를 추적했다. JavaScript·Python·Go·Rust·PHP 개발자가 한 행위자의 동일 표적군에 들어왔다 [[11]](#ref-11)[[13]](#ref-13).
- **진입 벡터의 진화.** 2026년 들어 초기 단계가 `.vscode/tasks.json`에 은닉되어(TasksJacker) npm 라이프사이클 스크립트처럼 자동 실행되거나, **git hooks**에 숨는다. BeaverTail → InvisibleFerret(파이썬 백도어)으로 이어지며 암호화폐 지갑·브라우저 자격증명·SSH 키를 탈취한다 [[13]](#ref-13).
- **사회공학 + 공급망의 결합.** $285M Drift 해킹(2026-04-01)은 6개월에 걸친 사회공학 작전의 정점이었다. UNC4736(AppleJeus/Citrine Sleet)이 2025년 가을부터 100만 달러 이상 자기 자금을 예치하며 생태계 내부에 운영 거점을 구축한 뒤, 통합 논의 과정의 링크·도구를 초기 감염 경로로 삼은 정황이 보고됐다 [[11]](#ref-11).
- **자금원 산업화.** Bybit 해킹(2025-02, 약 15억 달러, 역대 최대)과 업비트 사건(2025 말, 라자루스 유력) 등 거래소·DeFi 대형 탈취가 누적됐고, **DPRK가 2026년 암호화폐 탈취 가치의 약 76%**를 차지한다는 분석이 제시됐다 [[12]](#ref-12)[[16]](#ref-16).

여기서 짚을 점: Axios npm 패키지 침해(2026-03-31)는 매체에 따라 라자루스(ThreatBook) 또는 UNC1069/Sapphire Sleet(GTIG·Microsoft)로 귀속이 갈린다. **DPRK 연계라는 큰 틀은 일치하나 하위 그룹 귀속은 출처별로 다르다** — 단정에 주의가 필요하다 [[13]](#ref-13).

하지만 공격의 패턴이 정교화되고 있고 기존의 악성 코드 분석을 따라가지 못할 정도로 빠르게 공격의 횟수와 수위가 높아지고 있다.

## 4. 축 ③: LLM 내장형·에이전틱 멀웨어 - "just-in-time AI"

가장 새로운 변화는 AI가 공격 준비 단계의 보조 도구를 넘어 **악성코드 실행 시점에 LLM을 질의**하는 단계로 이동했다는 점이다.

- **just-in-time 코드 생성.** Google GTIG는 PROMPTFLUX(Gemini API로 1시간마다 자신의 VBScript를 재작성하는 "Thinking Robot" 모듈), PROMPTSTEAL(Hugging Face의 Qwen 모델에 Windows 명령 생성을 질의해 실행), PROMPTLOCK·QuietVault·FruitShell 등 **실행 중 LLM을 호출하는 멀웨어 계열**을 보고했다. 이는 정적 시그니처를 무력화하는 메타모픽 기법으로의 이행을 의미한다 [[8]](#ref-8)[[9]](#ref-9).
- **DPRK 연계 사례.** GTIG는 DPRK 연계 **UNC1069가 Gemini로 지갑 데이터 탐색·피싱 스크립트 작성**에 활용한 정황을 보고했다. 멀웨어가 런타임에 LLM에 "지갑 저장소 위치 탐색·맞춤 탈취 스크립트 생성"을 질의하는 새로운 공격면이 부상하고 있다 [[9]](#ref-9).
- **가드레일 우회의 사회공학화.** 위협 행위자는 "CTF 참가자"·"보안 연구자" 등 페르소나로 프롬프트를 위장해 AI 안전장치를 우회한다 — 사회공학이 사람뿐 아니라 **모델을 향해서도** 적용된다 [[8]](#ref-8).
- **에이전틱 공격의 전조.** Anthropic은 2025년 11월 중국 국가연계 행위자가 Claude Code를 jailbreak해 약 30개 표적에 **최소 인적 개입으로 정찰·취약점 탐색·자격증명 탈취·데이터 반출**을 수행한 첫 대규모 사례를 공개했다. 북한 사례는 아니나, **국가급 행위자의 자율 공격 궤적**을 보여주는 선행 지표다. 다만 Claude가 자격증명을 환각(hallucinate)하는 등 완전 자율의 장애도 함께 보고됐다 — 과장은 경계해야 한다 [[18]](#ref-18).

국정원 2026 백서는 "올해부터 에이전틱 AI가 전체 공격 수명주기를 자율 실행하며 초당 수만 건의 악성 행위를 발생시킬 것"이라 경고하며, 카스퍼스키·GTIG가 김수키의 **LLM 코드 작성 관여 정황**을 확인했다고 인용했다 [[14]](#ref-14).


## 5. 2026 vs 그 이전 - 무엇이 질적으로 달라졌나

| 차원         | ~2024년 이전 (AI 이전)                     | 2025년 (AI 보조)                       | 2026년 (AI 자율화)                                      |
| ---------- | ------------------------------------- | ----------------------------------- | -------------------------------------------------- |
| AI 역할      | 미사용/실험                                | 피싱 문안·번역·vibe coding 보조             | **공격 수명주기 자율 실행 + LLM 내장형 멀웨어**                    |
| 사회공학       | 수작업 스피어피싱(맞춤법·문화 오류 노출)               | AI 문안 교정으로 진정성↑                     | **딥페이크 신분증·영상, 합성 페르소나, 멀티모달**                     |
| 공급망        | 산발적 워터링홀·국내 SW 취약점(Operation SyncHole) | npm 산발적 악성 패키지                      | **크로스 에코시스템 산업화(1,700+ 패키지)**                      |
| 진입 벡터      | 이메일 첨부(HWP·LNK·ISO)                    | ClickFix·가짜 면접 repo                  | **`.vscode/tasks.json`·git hooks 자동 실행**            |
| 인력 구조      | 다년 훈련 병목(소수 정예 의존)                     | 일부 AI 보조                            | **AI로 병목 제거 → 비숙련 인력도 침투 수행**                       |
| 탐지 회피      | 정적 페이로드                               | 난독화 강화                              | **런타임 LLM 자가변형(메타모픽)**                             |
| 수익화        | 은행·SWIFT(2016 방글라데시 중앙은행 등)            | 거래소 대형 탈취(Bybit $15억)               | **DeFi 사회공학(Drift $2.85억), 암호화폐 76% 점유**           |
| 표적 정밀도     | 대량 살포                                 | 표적형 증가                              | **장기 잠입형(6개월 신뢰 구축) + 산업화 병행**                     |

요지: 변화는 *공격이 늘었다*가 아니라 **공격을 수행하는 데 필요한 진입 장벽(숙련도·인력·시간·비용)이 무너졌다**는 데 있다. 이는 방어 측 가정(공격자 정교함 ∝ 공격 복잡도)을 무력화한다.


## 6. MITRE ATT&CK 매핑

확인된 TTP에 한정해 보수적으로 매핑한다.

| 전술                  | 기법                                                  | 본 분석 적용 (조직)                                        |
| ------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Resource Development | T1587 (도구 개발) / T1585 (계정 생성)                       | AI 합성 페르소나·가짜 이력서 (IT워커, PurpleBravo)               |
| Resource Development | T1588.007 (AI 역량 확보)                                | LLM·딥페이크 도구 악용 (전 조직)                               |
| Initial Access      | T1566.001/.002 (스피어피싱 첨부/링크)                        | 딥페이크 군 신분증 피싱 (Kimsuky)                             |
| Initial Access      | T1195.002 (소프트웨어 공급망 침해)                            | Contagious Interview 패키지 (Lazarus)                  |
| Execution           | T1059 (스크립트 실행) / T1204 (사용자 실행)                    | `.vscode/tasks.json`·git hooks (Lazarus)            |
| Defense Evasion     | T1027 (난독화) — 런타임 LLM 자가변형                          | PROMPTFLUX형 메타모픽 (UNC1069 연계)                       |
| Credential Access   | T1552 (자격증명 파일) / T1555 (패스워드 저장소)                  | InvisibleFerret·QuietVault                          |
| Collection          | T1113 (화면 캡처) / T1056.001 (키로깅) / T1115 (클립보드)     | Contagious Interview 페이로드                           |
| Lateral Movement    | T1656 (사칭) — 기존 피해자 미끼화                             | BlueNoroff Zoom 딥페이크 확산                             |
| Exfiltration        | T1041 (C2 경유 반출)                                    | 다수 RAT 공통                                           |
| Impact              | T1486 (랜섬웨어 암호화)                                    | Andariel — Medusa RaaS                              |


## 7. 귀속의 한계 - 절제된 분석

- **하위 그룹 귀속 충돌.** Axios npm 침해처럼 동일 사건을 라자루스 vs UNC1069로 다르게 귀속하는 출처가 공존한다. "DPRK 연계"라는 상위 판단은 신뢰도가 높으나, **하위 클러스터 단정은 신뢰도가 낮다.**
- **북한 vs 중국 혼선.** 2025년 일부 정부부처·통신사 침해 보고에서 "김수키 추정"과 "언어·TTP상 중국 배후 가능성"이 병존했다. 언어 특성·수법 단서만으로의 단정은 위험하다 [[19]](#ref-19).
- **AI 기여도의 입증 한계.** "AI로 만든 코드"라는 판단은 종종 정황(LLM 특유의 문체, 환각된 CVSS 점수, 교과서적 구조)에 근거한다. GTIG 자신도 일부 사례를 "높은 확신의 정황 추정"으로 분류한다 — 결정적 증거와 구분해야 한다 [[9]](#ref-9).

따라서 본 리포트는 상위 귀속(DPRK 연계)은 High, 하위 그룹·AI 기여 단정은 Medium 이하로 신뢰도를 차등 유지했다.

## 7-1. LLM WIKI 구축을 통한 저숙련 해커를 고도화 (최초 공개)
2026년 3월 이후, 북한의 해킹 조직은 LLM WIKI를 구축하여 저숙련 해킹 인력이 이용할 수 있게 만들었다. 이들은 로컬 LLM을 구축했으며 알리바바의 오픈소스인 Qwen, GLM 등 다양한 오픈 소스 LLM를 이용한 것으로 알려져 있다.


## 8. 한국의 대응 좌표 - 사회·국가·보안 담당자

### 8.1 국가 차원

1. **자율형 보안 운영 체계로의 전환.** 공격이 기계 속도로 자율 실행되는 이상, 방어도 인간 개입을 최소화하고 기계 속도로 식별·격리하는 체계가 필요하다(국정원 2026 백서 진단). 노후 시스템 현대화 없이 AI 도입만 확대하면 **공격 경로만 늘리는 셈**이다 [[14]](#ref-14).
2. **국가 컨트롤타워·정보공유 상설화.** 개별 기업·기관 단위 대응의 한계가 명확하다. 국정원·KISA·군·검경 간 IOC·TTP 실시간 공유와 민관 합동 대응을 상설화한다. 한미·국제 공조(합동 보안권고문, 독자제재)를 지속한다 [[20]](#ref-20).
3. **AI 모델 제공자와의 신고·차단 파이프라인.** Anthropic·OpenAI·Google이 악용 계정을 탐지·차단하고 IOC를 공유하는 체계가 작동 중이다. 한국 정부·기업이 이 파이프라인에 적극 편입돼 키 폐기·계정 차단 시간을 단축한다 [[5]](#ref-5)[[8]](#ref-8).

### 8.2 보안 담당자(실무) 차원

| 영역          | 권고                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| 공급망         | 직접·전이 의존성 **버전 고정(pin)**, 신규·저다운로드 패키지 사전 검토, 설치 시점 행위 기반 차단(behavioral supply-chain firewall) 도입. |
| 개발 환경       | `.vscode/tasks.json`·git hooks·postinstall 등 **자동 실행 경로 감사**. 가짜 면접 과제 repo 실행 금지 정책·교육.            |
| 탐지 전환       | 시그니처 기반 → **행위 기반 EDR**. AI API(Gemini/OpenAI/Hugging Face) 대상 비정상 아웃바운드 트래픽을 탐지 대상으로 추가.            |
| 신원·면접       | 화상 면접 **딥페이크 탐지**(실시간 영상 무결성, 라이브니스 체크), IT 인력 채용 시 다중 신원검증·하드웨어 핑거프린팅.                            |
| 자격증명        | MFA 강제 + **피싱 저항형 인증(FIDO2/패스키)**, 암호화폐 서명 기기 격리, 지갑 주소 교체형 멀웨어 대비 서명 단계 검증.                       |
| 인지(사회공학)    | 강연·인터뷰·신분증 검토 요청 등 **권위·긴급성 미끼**에 대한 직원 인식 제고. 의심 시 국정원(111)·경찰청(182)·KISA(118) 신고.                |

### 8.3 사회 차원

- **표적군 보호.** 김수키·코니는 외교·안보 전문가, **탈북민, 북한인권 활동가, 언론인**을 일관되게 표적 공격하고 있다(국가인권위 사칭 등). 이들 고위험군에 대한 맞춤 보안 지원·교육이 필요하다 [[15]](#ref-15)[[16]](#ref-16).
- **딥페이크 리터러시.** 신분증·영상·음성 합성이 보편화된 만큼, "보이는 것"에 대한 사회적 신뢰 기준을 재교육한다. 공문서·신분증은 시각적 진정성이 아니라 **검증 채널**로 확인하는 습관이 핵심이다.
- **법·제도 정비.** 정보보호 공시 의무화(2027 예정) 등 제도가 진행 중이나, AI 악용·딥페이크·공급망 침해에 대응하는 입법·가이드라인의 속도를 높여야 한다.


## 9. 결론

북한의 2026년 사이버 위협은 "더 많은 해킹"이 아니라 "같은 인력으로 훨씬 더 많은, 더 정교한 해킹"으로 요약된다. AI가 해킹 기술 숙련 병목을 제거하면서, 첩보(김수키)·수익(라자루스)·교란(안다리엘)의 분업 구조 위에 사회공학·공급망·LLM 내장형 멀웨어가 동시에 고도화되고 있다.

방어 측의 과제는 분명하다. 첫째, **시그니처에서 행위 기반으로**의 탐지 전환. 둘째, **개별 대응에서 국가·민관·국제 공조로**의 확장. 셋째, **공격면(AI 도입)과 방어(시스템 현대화)의 속도 정합**. 과장도, 안일함도 위험하다. AI는 아직 자격증명을 환각하고 완전 자율에 이르지 못했지만, 장벽이 무너지는 방향은 명확하다. **지금 필요한 것은 공포가 아니라, 기계 속도에 맞춘 구조적 대응**이다.

---


## 참고 문헌 (References)

[1] "AI-Forged Military IDs Used in North Korean Phishing Attack", Infosecurity Magazine, 2025-09. <https://www.infosecurity-magazine.com/news/ai-military-ids-north-korea/>

[2] "North Korean operation uses ChatGPT to forge military IDs", The Record (Recorded Future News), 2025-09. <https://therecord.media/north-korea-kimsuky-hackers-phishing-fake-military-ids-chatgpt>

[3] "North Koreans Target South With Military ID Deepfakes", Dark Reading, 2025-09-17. <https://www.darkreading.com/cyberattacks-data-breaches/north-korean-group-south-military-id-deepfakes>

[4] Recorded Future (PurpleDelta·PurpleBravo, AI 합성 페르소나) — Dark Reading [3] 내 인용.

[5] "Detecting and countering misuse of AI: August 2025", Anthropic, 2025-08. <https://www.anthropic.com/news/detecting-countering-misuse-aug-2025>

[6] "Threat Intelligence Report: August 2025", Anthropic (PDF). <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

[7] "Responding to the Evolution and Global Expansion of the DPRK IT Worker Threat", CSIS, 2026-03. <https://www.csis.org/analysis/responding-evolution-and-global-expansion-dprk-it-worker-threat>

[8] "GTIG AI Threat Tracker: Advances in Threat Actor Usage of AI Tools", Google Threat Intelligence Group, 2025-11. <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools>

[9] "Google Threat Report Links AI-powered Malware to DPRK Crypto Theft", Decrypt, 2025-11. <https://decrypt.co/347781/google-threat-report-links-ai-powered-malware-to-dprk-crypto-theft>

[10] "AI risk and resilience: A Mandiant special report", Google Cloud, 2026. <https://cloud.google.com/security/resources/ai-risk-and-resilience>

[11] "$285 Million Drift Hack Traced to Six-Month DPRK Social Engineering Operation", The Hacker News, 2026-04-06. <https://thehackernews.com/2026/04/285-million-drift-hack-traced-to-six.html>

[12] "Weekly Security Intelligence Briefing — Week of 2026-05-04" (BlueNoroff AI 딥페이크·DPRK 76% 점유), TechJack Solutions, 2026-05. <https://techjacksolutions.com/security/briefing/weekly-security-intelligence-briefing-week-of-2026-05-04/>

[13] "Contagious Interview now ships malicious packages to npm, PyPI, Go, Rust, and PHP" (Socket 1,700+ 패키지), 2026-04-08. <https://anonhaven.com/en/news/contagious-interview-cross-ecosystem-supply-chain-attack/>

[14] "'자율 해킹 AI' 전면 도입한 北…국정원 '2026 국가정보보호백서'", 아시아투데이, 2026-06. <https://www.asiatoday.co.kr/kn/view.php?key=20260609010003141>

[15] 외교부, "북한 해킹조직 '김수키' 대북 독자제재 지정·한미 합동 보안권고문". <https://www.mofa.go.kr/www/brd/m_4080/view.do?seq=373737>

[16] "북한 라자루스·김수키 지능형 해킹 86건…'한국 겨냥'" (안랩 2026 전망), 아시아경제, 2025-11-30. <https://cm.asiae.co.kr/article/2025113009471713623>

[17] "Contagious Interview (G1052)", MITRE ATT&CK. <https://attack.mitre.org/groups/G1052/>

[18] "Disrupting the first reported AI-orchestrated cyber espionage campaign", Anthropic, 2025-11. <https://www.anthropic.com/news/disrupting-AI-espionage>

[19] "[단독] 대한민국 정부가 털렸다… 행안부·외교부·방첩사, 북한 추정 해킹" (귀속 불확실성), 보안뉴스, 2025-08. <https://m.boannews.com/html/detail.html?idx=138636>

[20] "Supply Chain Attacks 2026: npm, PyPI, VS Code, AI Agents" (행위 기반 공급망 방어), Phoenix Security, 2026. <https://phoenix.security/accelerating-supply-chain-attacks-npm-pypi-vsx-ai-enabled-2026/>

---


© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*"AI는 북한의 숙련 병목을 제거했다. 방어는 기계 속도로 따라가야 한다." — CTI-2026-0628*
