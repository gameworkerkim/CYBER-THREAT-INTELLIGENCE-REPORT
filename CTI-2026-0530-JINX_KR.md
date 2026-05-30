| id             | CTI-2026-0530-JINX                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | JINX-0164 — 가상자산 기업을 겨냥한 macOS 멀웨어·공급망 위협 행위자                                                                          |
| subtitle       | LinkedIn 사회공학, AUDIOFIX·MINIRAT, 그리고 @velora-dex/sdk npm 공급망 침해                                                        |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | HIGH                                                                                                                   |
| lang           | ko                                                                                                                     |
| tags           | Crypto-Targeting · macOS-Malware · Supply-Chain · Social-Engineering · CI-CD-Abuse · DPRK-Adjacent                    |
| threat_actors  | JINX-0164 (금전 동기 · 북한 클러스터 기법 유사, 인프라 중첩 없음)                                                                            |
| cve            | N/A (위협 행위자 캠페인 · npm 공급망)                                                                                              |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Wiz 클러스터 네이밍                                                      |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# JINX-0164 — 가상자산 기업을 겨냥한 macOS 멀웨어·공급망 위협 행위자

> **리포트 ID** `CTI-2026-0530-JINX` · **발행일** 2026-05-30 · **분류** `TLP:GREEN` · **심각도** 🔴 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LinkedIn 사회공학, AUDIOFIX·MINIRAT, 그리고 @velora-dex/sdk npm 공급망 침해*

---

## 목차

1. 요약 (TL;DR)
2. 위협 행위자 프로파일 — JINX-0164
3. 공격 체인 — LinkedIn에서 CI/CD까지
4. 멀웨어 분석 — AUDIOFIX · MINIRAT
5. 공급망 침해 — @velora-dex/sdk
6. 북한 클러스터와의 유사성·차이
7. 한국 관점 — 거래소·Web3 개발팀 위협 평가
8. 탐지·완화 권고
9. 결론
10. 참고 문헌

---

## 요약 (TL;DR)

2026년 5월 28일, Wiz(CIRT·Research)는 가상자산 조직을 표적으로 디지털 자산 탈취를 노리는 미기록(undocumented) 위협 행위자 **JINX-0164**를 공개했다. 이 클러스터는 **최소 2025년 중반부터 활동**해 왔으며, 거의 전적으로 **macOS**에 집중한다.

공격 흐름은 (1) LinkedIn 기반 채용·사업 제안 사회공학으로 개발자에게 접근 → (2) Microsoft Teams 등을 사칭한 가짜 회의 페이지로 유인 → (3) macOS 맞춤형 RAT 다운로드 → (4) 자격증명·지갑 정보 탈취 → (5) 침해된 직원 노트북에서 **코드 배포 시스템·CI/CD 인프라로 측면 이동**으로 이어진다. 나아가 이들은 **npm 공급망 침해** 역량까지 입증했다.

본 행위자는 BlueNoroff·Contagious Interview·UNC1069(Sleet) 등 북한 클러스터와 **기법은 유사하나 인프라 중첩은 없으며**, Wiz는 국가배후로 단정하지 않고 금전 동기 클러스터로 분류했다.

### Key Judgments

| #    | 판단                                                                                                                   | 신뢰도             |
| ---- | -------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | JINX-0164는 채용 미끼 사회공학과 macOS 맞춤 멀웨어를 결합해 **가상자산 개발자**를 정밀 표적한다. 표적 직군이 명확하다.                                          | **High**        |
| KJ-2 | 단순 단말 탈취를 넘어 **CI/CD·코드 배포 인프라로의 측면 이동**을 핵심 목표로 삼는다. 이는 단일 침해를 다운스트림 다수 침해로 증폭시키는 공급망 공격 지향이다.                       | **High**        |
| KJ-3 | `@velora-dex/sdk` 4.9.1 트로이목마화는 **합법 DeFi 툴킷을 감염 벡터로 전환**한 실증 사례다. import 시점에 셸 스크립트가 MINIRAT를 내려받는다.                | **High**        |
| KJ-4 | 북한 클러스터와 기법 유사성·Astrill VPN 사용이 관측되나 **인프라 중첩이 없어 귀속은 미확정**이다. 모방 또는 독립 클러스터 가능성을 병행 고려해야 한다.                        | **Medium**      |
| KJ-5 | 국내 거래소·Web3 빌더·DeFi 팀은 macOS 비중이 높고 LinkedIn 채용 활동이 활발해 **동일 공격면**에 노출된다. 멀티시그·핫월렛 키가 개발 단말에 공존하면 위험이 증폭된다.          | **Medium-High** |

---

## 1. 위협 행위자 프로파일 — JINX-0164

| 항목 | 값 |
| --- | --- |
| 명칭 | JINX-0164 (Wiz 명명) |
| 활동 시점 | 최소 2025년 중반 ~ |
| 동기 | 금전(financial gain) — 디지털 자산 탈취 |
| 표적 | 가상자산 조직·개발자 (macOS 집중) |
| 핵심 멀웨어 | AUDIOFIX(Python), MINIRAT(Go) |
| C2 | HTTPS 통신, 공유 인프라(예: `datahub[.]ink`) |
| 보조 도구 | Astrill VPN 등 |
| 귀속 | 미확정 (북한 클러스터 기법 유사, 인프라 중첩 없음) |

JINX-0164는 LinkedIn에 **신뢰도 높은 가짜 프로필**(현실적 경력·인맥)을 운용하며, 일부 계정은 탈취되거나 캠페인 전용으로 생성된 뒤 공격 후 삭제되었다. 연구자(Wiz의 Shira Ayal 외)는 이를 다수 침해 조사 끝에 단일 클러스터로 묶어 명명했다.

---

## 2. 공격 체인 — LinkedIn에서 CI/CD까지

| 단계 | 행위 | 세부 |
| --- | --- | --- |
| ① 접근 | LinkedIn으로 사업·채용 제안 | 신뢰 확보 후 가짜 회의 초대 전달 |
| ② 유인 | 가짜 컨퍼런싱 페이지 | Microsoft Teams 등 사칭 도메인 |
| ③ 감염 | macOS RAT 다운로드·실행 | `coreaudiod`(시스템 오디오 드라이버) 위장, `ChromeUpdater`로 저장, `launchctl`로 실행 |
| ④ 탈취 | Python 멀웨어로 민감정보 수집 | 패스워드 매니저·브라우저·iCloud Keychain 자격증명, 로컬 관리자 자격증명, SSH 키, 설정·콘솔 히스토리, 암호화폐 지갑·확장 정보, Discord·Slack·Telegram 세션 |
| ⑤ 확산 | CI/CD·코드 배포 인프라로 측면 이동 | AUDIOFIX 페이로드 주입, 소스코드 변조로 추가 단말 침해·지갑 자격증명 탈취 |

이 체인의 핵심은 ⑤단계다. JINX-0164는 침해된 개발자 노트북을 **종착점이 아니라 발판**으로 본다. 목표는 코드 배포 시스템과 개발 인프라에 도달해, 하나의 침해를 다운스트림 다수 침해로 증폭시키는 것이다.

---

## 3. 멀웨어 분석 — AUDIOFIX · MINIRAT

**AUDIOFIX** — 컴파일된 Python 바이너리. 광범위한 자동 정보 탈취를 수행한다. 시스템 오디오 드라이버(`coreaudiod`)로 위장하고 `ChromeUpdater` 파일명으로 저장되며 `launchctl`로 실행된다. 탈취 대상에는 다음이 포함된다: 패스워드 매니저·웹브라우저·iCloud Keychain 자격증명, 로컬 관리자 자격증명, SSH 키, 구성/콘솔 히스토리 파일, 암호화폐 브라우저 확장 정보·지갑 주소, 활성 Discord·Slack·Telegram 세션.

**MINIRAT** — Go 기반 경량 백도어. AUDIOFIX 같은 광범위 자동 탈취는 수행하지 않으나, **지속적 원격 접근, 명령 실행, 파일 이동** 기능을 제공한다. 두 멀웨어 모두 HTTPS로 C2와 통신하며 공통 인프라(예: `datahub[.]ink`)를 공유한다. 멀웨어는 OS를 식별한 뒤 아키텍처별 페이로드를 내려받는 구조다.

---

## 4. 공급망 침해 — @velora-dex/sdk

2026년 4월 7일, JINX-0164는 공급망 작전으로 npm 패키지 **`@velora-dex/sdk` 4.9.1**을 트로이목마화했다. 이 패키지는 VeloraDEX 탈중앙거래소에서 토큰 스왑·지정가 주문·델타 트레이딩에 쓰이는 합법 DeFi 툴킷이다.

악성 버전은 `dist/index.js`에 **3줄을 추가**해, 패키지가 import될 때마다 원격 서버에서 셸 스크립트를 내려받도록 했다. 이 스크립트는 macOS 전용 바이너리 **MINIRAT**를 배포했다. (해당 침해는 앞서 SafeDep·StepSecurity가 관측·공개한 바 있다.)

이 수법의 본질은 **신뢰받는 코드베이스를 감염 벡터로 전환**하는 것이다. 개발자가 합법 패키지를 의존성으로 가져오는 정상 행위가 곧 감염 트리거가 된다. 일부 사례에서는 추가 자격증명 탈취(특히 암호화폐 지갑)를 위해 **소스코드 자체를 변조**한 정황도 관측되었다.

---

## 5. 북한 클러스터와의 유사성·차이

| 비교 항목 | JINX-0164 | 북한 클러스터(BlueNoroff·Contagious Interview·UNC1069) |
| --- | --- | --- |
| 표적 | 가상자산·개발자 | 동일 |
| 사회공학 | 채용·사업 제안 미끼 | 동일(Contagious Interview 유사) |
| 플랫폼 | macOS 집중 | macOS 포함 다중 |
| VPN | Astrill VPN 사용 | Astrill VPN 사용 사례 다수 |
| 사칭 도메인 유형 | 유사 | 유사 |
| **인프라 중첩** | **없음** | — |

기법·도구·표적 측면의 유사성은 뚜렷하나, Wiz는 **인프라 중첩이 확인되지 않아** 공개 추적 중인 북한 그룹과 연결하지 않았다. 따라서 본 리포트는 (a) 북한 기법을 모방한 독립 금전 동기 클러스터, (b) 아직 인프라가 분리된 미식별 연계 가능성을 **모두 열어두고** 추가 관측을 권고한다. 섣부른 국가배후 단정은 오귀속 위험이 있다.

---

## 6. 한국 관점 — 거래소·Web3 개발팀 위협 평가

국내 환경에서 JINX-0164류 위협이 갖는 함의는 다음과 같다.

- **macOS 비중** — 국내 거래소·Web3 스타트업 개발팀은 macOS 사용 비중이 높아 본 캠페인의 표적 플랫폼과 정확히 일치한다.
- **LinkedIn 채용 노출** — 활발한 채용·네트워킹 활동이 사회공학 진입점을 넓힌다. "해외 리크루터의 회의 초대"는 흔한 패턴이므로 경계가 느슨하다.
- **키 공존 위험** — 개발 단말에 지갑 확장·핫월렛 키·SSH 키·CI 토큰이 공존하면, 단말 침해 하나가 자산 탈취와 공급망 오염으로 동시에 번진다.
- **공급망 신뢰** — 국내 DeFi·인프라 프로젝트가 외부 npm/SDK 의존성을 무검증으로 채택하는 관행은 `@velora-dex/sdk`형 침해에 그대로 노출된다.

---

## 7. 탐지·완화 권고

1. **사회공학 인식** — "LinkedIn 리크루터의 회의 링크 → 컨퍼런싱 앱 설치/실행" 패턴을 고위험으로 분류하고, 미확인 도메인의 설치 파일 실행을 차단한다.
2. **macOS 행위 탐지** — `launchctl` 영속화, `coreaudiod`/`ChromeUpdater` 위장 프로세스, 비정상 HTTPS C2(예: `datahub[.]ink` 류) 통신을 EDR로 모니터링한다.
3. **공급망 검증** — npm/SDK 의존성에 대해 버전 핀·해시 검증·`postinstall` 훅 감사·SBOM 관리를 적용한다. `@velora-dex/sdk` 사용 이력이 있는 경우 4.9.1 노출 여부를 즉시 점검한다.
4. **키 격리** — 지갑 서명 권한·핫월렛 키를 개발 단말과 분리하고, 전용 서명 기기(콜드/하드웨어)로 이전한다(`CTI-2026-0422-MCP` §4 권고와 연계).
5. **CI/CD 무결성** — 코드 배포 파이프라인에 커밋 서명·러너 격리·아티팩트 서명을 적용해 측면 이동 시 변조를 탐지한다.
6. **IOC 차단** — 공유 C2 인프라·사칭 도메인을 차단 목록에 등록한다(최신 IOC는 Wiz Technical Annex 참조).

---

## 8. 결론

JINX-0164는 "가상자산 + macOS + 공급망"이라는 2026년 위협 지형의 교집합에 정확히 위치한다. 이 행위자가 보여준 패턴 — 채용 미끼로 개발자 단말을 장악하고, 거기서 CI/CD로 이동해 신뢰받는 패키지를 무기화하는 흐름 — 은 단일 조직의 문제가 아니라 **생태계 전체의 신뢰 사슬**을 겨눈다.

국가배후 귀속은 아직 미확정이며, 이 불확실성 자체가 시사점이다. 북한 기법이 상업화·모방되어 확산되는 흐름 속에서, 방어자는 *"누가 했는가"*보다 *"어떤 신뢰를 악용했는가"*에 집중해야 한다. 채용 신뢰, 패키지 신뢰, 개발 인프라 신뢰 — 이 세 가지가 본 캠페인의 표적이며, 동시에 방어의 출발점이다.

---

## 참고 문헌 (References)

[1] Wiz CIRT & Wiz Research (Shira Ayal et al.), "Threat Actor Targets Crypto Organizations — JINX-0164", Wiz Blog, 2026-05. <https://www.wiz.io/blog/threat-actors-target-crypto-orgs>

[2] Ravie Lakshmanan, "JINX-0164 Targets Cryptocurrency Firms with Fake Recruiter Lures and macOS Malware", The Hacker News, 2026-05-28. <https://thehackernews.com/2026/05/jinx-0164-targets-cryptocurrency-firms.html>

[3] "New Threat Actor Jinx-0164 Targets Crypto Developers on macOS", Infosecurity Magazine, 2026-05. <https://www.infosecurity-magazine.com/news/jinx-0164-crypto-developers-macos/>

[4] "JINX-0164 Threat Actor Using LinkedIn Social Engineering to Deploy Custom macOS Malware", Cyber Security News, 2026-05. <https://cybersecuritynews.com/jinx-0164-threat-actor-using-linkedin-social-engineering/>

[5] "JINX-0164 Uses LinkedIn Lures to Deploy Custom macOS Malware", GBHackers, 2026-05. <https://gbhackers.com/jinx-0164-uses-linkedin-lures/>

[6] SafeDep & StepSecurity, "@velora-dex/sdk 4.9.1 npm supply chain compromise (MINIRAT)", 2026-04 (Wiz 인용).

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
