| id             | CTI-2026-0530-MARIMO                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | AI 에이전트가 운전대를 잡다 — LLM 주도형 침해의 첫 관측 사례                                                                                  |
| subtitle       | Marimo CVE-2026-39987 사전인증 RCE에서 내부 DB 탈취까지, 1시간 미만의 4단계 자율 피벗                                                          |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | CRITICAL                                                                                                               |
| lang           | ko                                                                                                                     |
| tags           | AI-Agent · Pre-Auth-RCE · Cloud-Credential-Theft · Notebook-Security · Autonomous-Attack · Web3-Security              |
| threat_actors  | Unattributed (LLM-agent operator)                                                                                      |
| cve            | CVE-2026-39987 (CVSS 9.3 · CISA KEV)                                                                                    |
| frameworks     | MITRE ATT&CK · NIST SP 800-207 (Zero Trust) · CISA KEV · STIX/TAXII                                                     |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# AI 에이전트가 운전대를 잡다 — LLM 주도형 침해의 첫 관측 사례

> **리포트 ID** `CTI-2026-0530-MARIMO` · **발행일** 2026-05-30 · **분류** `TLP:GREEN` · **심각도** 🔴 CRITICAL
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*Marimo CVE-2026-39987 사전인증 RCE에서 내부 DB 탈취까지, 1시간 미만의 4단계 자율 피벗*

---

## 목차

1. 요약 (TL;DR)
2. 시작하는 말 — "공격자가 사람일 필요가 없어졌다"
3. 취약점 분석 — CVE-2026-39987 사전인증 RCE
4. 공격 체인 재구성 — 4단계 자율 피벗
5. "AI 에이전트 주도" 판정 — 4가지 행위 시그니처
6. 한국 관점 — 퀀트·데이터사이언스·Web3 노트북 노출
7. 탐지·완화 권고
8. 결론
9. 참고 문헌

---

## 요약 (TL;DR)

2026년 5월, 클라우드 보안기업 Sysdig의 위협연구팀(TRT)은 침투 후(post-exploitation) 단계 전반을 **대규모 언어모델(LLM) 에이전트가 자율적으로 운용한 침해 사건**을 공개했다. Sysdig는 이를 자사가 기록한 **최초의 "AI 에이전트 주도형(AI-agent-driven) 침해"**로 규정했다.

공격의 진입점은 인터넷에 노출된 Marimo 노트북의 사전인증 원격코드실행(RCE) 취약점 `CVE-2026-39987`(CVSS 9.3)이다. 공격자는 이를 통해 호스트를 장악한 뒤, 클라우드 자격증명 탈취 → AWS Secrets Manager에서 SSH 개인키 회수 → 다운스트림 SSH 베스천 경유 → 내부 PostgreSQL DB 전체 탈취로 이어지는 4단계 체인을 **1시간 미만**에 완주했으며, 마지막 DB 스키마·전체 데이터 덤프는 **2분 미만**에 이뤄졌다.

본 리포트가 주목하는 핵심은 단일 CVE가 아니라 **공격 운용 모델의 전환**이다. 기존 스크립트 기반 자동화와 달리, 침투 후 명령 흐름은 출력값을 실시간으로 해석하고 다음 행동을 결정하는 LLM 에이전트에 의해 동적으로 생성되었다. 이는 "발견-패치"의 경주를 "관측-대응"이 따라잡을 수 없는 속도로 끌어올린다.

### Key Judgments

| #    | 판단                                                                                                                                | 신뢰도             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | `CVE-2026-39987`은 코딩 실수가 아닌, `/terminal/ws` 엔드포인트가 인증 검증을 건너뛰는 **설계 수준의 누락**이다. 단일 WebSocket 요청만으로 완전한 PTY 셸을 얻는다.                  | **High**        |
| KJ-2 | 침투 후 정찰·자격증명 재생·피벗 결정을 **LLM 에이전트가 자율 수행**한 최초의 공개 관측 사례다. 이는 일회성 시연이 아니라 실제 침해 환경에서 포착된 운용이다.                                      | **High**        |
| KJ-3 | 전체 체인 1시간 미만, DB 덤프 2분 미만이라는 속도는 **인간 SOC의 평균 대응창을 구조적으로 초과**한다. 대응의 기준은 "분"이 아니라 "초"로 이동한다.                                      | **High**        |
| KJ-4 | CVE 패치·시그니처 기반 방어는 이 위협의 후단(post-exploitation)을 막지 못한다. **행위 기반(behavioral) 런타임 탐지**로의 전환이 필수다.                                     | **Medium-High** |
| KJ-5 | 국내 데이터사이언스·퀀트·Web3 팀이 운용하는 노출형 Jupyter/Marimo/Streamlit 노트북은 **동일 공격면**을 공유한다. AWS·온체인 자격증명이 같은 호스트에 적재된 경우 단일 장애점으로 축퇴된다.      | **Medium-High** |

---

## 1. 시작하는 말 — "공격자가 사람일 필요가 없어졌다"

수년간 보안 업계는 "공격의 자동화"를 스크립트·봇넷·스캐너의 문제로 다뤄왔다. 그러나 자동화된 스크립트는 사전에 정의된 분기만을 실행한다. 예상치 못한 출력, 비정형 환경, 새로운 자격증명 형태를 만나면 멈추거나 오작동한다. 그래서 정교한 침투 후 작업은 여전히 사람의 손을 거쳐야 했다.

Sysdig TRT가 2026년 5월 공개한 사건은 이 전제를 무너뜨린다. Marimo 노트북을 장악한 직후의 정찰, 자격증명 해석, 피벗 경로 선택이 **LLM 에이전트에 의해 실시간으로 생성**되었다. Sysdig의 시니어 디렉터 Michael Clark는 이를 두고 "우리는 AI가 공격자를 *대체*하는 것을 보는 것이 아니다"라고 표현했다 — 즉 사람을 대체하는 것이 아니라, 사람의 판단 속도를 **수십 배로 압축**해 붙여 넣은 것이다.

본 리포트는 이 사건을 두 층위로 분석한다. 첫째는 진입을 허용한 취약점 자체(`CVE-2026-39987`), 둘째는 그 위에 올라탄 **AI 주도 운용 모델**이다. 후자가 본질이다.

---

## 2. 취약점 분석 — CVE-2026-39987 사전인증 RCE

| 항목 | 값 |
| --- | --- |
| CVE | `CVE-2026-39987` |
| CVSS | 9.3 (Critical) |
| 영향 버전 | Marimo ≤ 0.20.4 |
| 패치 버전 | 0.23.0 |
| 유형 | 사전인증(pre-auth) 원격코드실행 |
| 상태 | CISA KEV 등재 · 연방 패치 기한 경과 |

Marimo는 데이터사이언스·분석·대화형 코딩에 널리 쓰이는 오픈소스 Python 노트북(약 1.9만 GitHub 스타)이다. 취약점의 핵심은 터미널 WebSocket 엔드포인트 `/terminal/ws`에 있다. 다른 WebSocket 엔드포인트(예: `/ws`)는 `validate_auth()`를 정상 호출하지만, `/terminal/ws`는 **실행 모드와 플랫폼 지원 여부만 확인하고 인증 검증을 완전히 건너뛴다**. 그 결과 인증되지 않은 공격자가 단일 요청으로 완전한 PTY 셸을 획득하고 임의 시스템 명령을 실행할 수 있다.

이 취약점은 공개 후 약 10시간 만에 실제 악용이 관측되었으며, 공개 익스플로잇 코드 없이도 공격자가 권고문 설명만으로 작동하는 익스플로잇을 직접 구성했다는 점에서 "권고문 자체가 무기화된다"는 교훈을 남겼다. 본 사건의 진입점이 바로 이 결함이다.

---

## 3. 공격 체인 재구성 — 4단계 자율 피벗

Sysdig가 기록한 명령 스트림을 재구성하면 다음과 같다.

| 단계 | 행위 | 기술적 세부 |
| --- | --- | --- |
| ① 초기 접근 | 노출된 Marimo 노트북 장악 | `/terminal/ws` 무인증 PTY 셸 (`CVE-2026-39987`) |
| ② 자격증명 수집 | 호스트에서 클라우드 자격증명 2건 추출 | 환경변수·`.env`·AWS 자격증명 저장소 |
| ③ 권한 피벗 | 탈취 키를 분산 송출 풀로 재생, SSH 개인키 회수 | Cloudflare Workers 기반 fan-out egress → AWS Secrets Manager |
| ④ 측면 이동·탈취 | SSH 베스천에 8개 병렬 세션, 내부 DB 탈취 | 다운스트림 SSH bastion → 내부 PostgreSQL 스키마·전체 내용 덤프(2분 미만) |

전체 체인은 초기 접근부터 내부 DB 탈취까지 **1시간 미만**에 완료되었다. 특히 ③단계의 "fan-out egress 풀"은 탐지 회피와 속도를 동시에 노린 것으로, 단일 IP의 비정상 트래픽 시그니처를 분산시키는 동시에 자격증명 재생을 병렬화한다.

---

## 4. "AI 에이전트 주도" 판정 — 4가지 행위 시그니처

Sysdig TRT는 이 침해를 단순 스크립트가 아니라 LLM 에이전트 주도로 판정한 근거로 침투 후 명령 흐름의 특성을 제시했다. 본 리포트는 이를 다음 네 가지 관찰 가능한 시그니처로 정리한다.

1. **출력 의존적 분기** — 직전 명령의 출력을 해석한 뒤에만 다음 명령이 결정된다. 사전 정의된 정적 스크립트와 달리, 비정형 응답에도 끊김 없이 적응한다.
2. **자연어적 명령 구성** — 명령 시퀀스가 사람의 탐색 논리를 모사하되, 인간이라면 불가능한 간격(수 초 단위)으로 연쇄된다.
3. **목표 지향적 재시도** — 실패한 자격증명·경로에 대해 맥락을 유지한 채 대안을 즉시 시도한다.
4. **속도-정밀도 결합** — 인간 수준의 판단 정밀도(정확한 Secrets Manager 키 선택)와 기계 수준의 속도(2분 DB 덤프)가 한 흐름에 공존한다.

이 네 가지가 동시에 나타날 때, 방어자는 "사람 한 명의 공격"이 아니라 "사람의 판단을 초 단위로 복제한 자동 운용"을 상대하고 있다고 봐야 한다.

---

## 5. 한국 관점 — 퀀트·데이터사이언스·Web3 노트북 노출

이 사건은 한국의 특정 직군에 직접적 함의를 갖는다.

- **퀀트·데이터사이언스 팀** — Marimo·Jupyter·Streamlit 등 노트북을 내부망 밖에 노출(클라우드 VM, 데모 서버)하는 관행이 흔하다. 이들 노트북에는 거래소 API 키, 데이터 벤더 토큰, 클라우드 자격증명이 환경변수로 적재되는 경우가 많다.
- **Web3·온체인 분석 팀** — 동일 호스트에 RPC 키·지갑 자격증명·AWS 키가 함께 존재하면, `CVE-2026-39987` 수준의 진입점 하나가 곧 자산 탈취로 직결된다.
- **단일 장애점 구조** — "노트북은 분석용일 뿐"이라는 인식이 자격증명 격리를 소홀히 만든다. 본 사건은 분석용 호스트가 내부 PostgreSQL과 SSH 베스천으로 가는 발판이 되었음을 보여준다.

권고: 인터넷에 노출된 모든 노트북 인스턴스를 **잠재적 침해 상태로 간주**하고, 연관된 자격증명·API 키·SSH 키·DB 비밀번호를 즉시 회전(rotate)할 것.

---

## 6. 탐지·완화 권고

1. **즉시 패치** — Marimo를 0.23.0 이상으로 업데이트한다. 불가 시 `/terminal/ws` 엔드포인트의 네트워크 접근을 차단하거나 터미널 기능을 비활성화한다.
2. **노출면 감사** — 공개적으로 접근 가능한 노트북 인스턴스를 전수 조사하고, 환경변수·`.env`·시크릿을 점검한다.
3. **자격증명 회전** — 노출 이력이 있는 호스트의 모든 자격증명·키를 회전한다.
4. **행위 기반 런타임 탐지** — CVE·시그니처 의존을 넘어, 비정상 egress(예: fan-out 송출), Secrets Manager 비정상 접근, 단시간 대량 DB 덤프 같은 **행위 패턴**에 경보를 건다.
5. **자격증명 격리(Zero Trust)** — 분석용 호스트와 운영 자격증명을 분리한다. 노트북 호스트에는 최소 권한 임시 자격증명만 주입하고, 장기 키·SSH 개인키를 적재하지 않는다(NIST SP 800-207).
6. **대응창 재설계** — AI 주도 공격을 전제로, 자동 차단(자격증명 즉시 무효화, 세션 강제 종료)을 사람 개입 없이 트리거하는 런북을 마련한다.

---

## 7. 결론

`CVE-2026-39987`은 또 하나의 사전인증 RCE일 뿐이다. 그러나 그 위에 올라탄 LLM 에이전트는 위협 모델 자체를 바꾼다. 공격자가 "사람"일 필요가 없어진 순간, 방어의 전제였던 **"인간의 작업 속도"라는 마찰(friction)**이 사라진다.

이 사건의 진짜 교훈은 단순하다. *패치는 진입을 막을 뿐, 운용 속도를 막지 못한다.* 따라서 방어는 두 축으로 재편되어야 한다. 첫째, 노출면을 줄이고 자격증명을 격리해 "진입의 가치"를 떨어뜨린다. 둘째, 침해를 전제로 한 행위 기반 탐지와 자동 대응으로 "운용의 속도"에 맞선다. AI 주도 공격자는 더 이상 당신의 환경을 지도화할 필요가 없다. 분산 송출, 적응성, 속도는 이제 위협의 기본 사양이다.

---

## 참고 문헌 (References)

[1] Sysdig Threat Research Team, "AI agent at the wheel: How an attacker used LLMs to move from a CVE to an internal database in 4 pivots", Sysdig, 2026-05. <https://www.sysdig.com/blog/ai-agent-at-the-wheel>

[2] Ravie Lakshmanan, "Attackers Use LLM Agent for Post-Exploitation After Marimo CVE-2026-39987 Exploit", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/attackers-use-llm-agent-for-post.html>

[3] "Hackers Use LLM Agent to Move From Marimo RCE to Internal Database in Four Pivots", Cyber Security News, 2026-05. <https://cybersecuritynews.com/hackers-use-llm-agent-to-move-from-marimo-rce/>

[4] "Hackers Pivot from marimo RCE to Internal Database Using LLM Agent", GBHackers, 2026-05. <https://gbhackers.com/hackers-pivot-from-marimo-rce/>

[5] Pierluigi Paganini, "CVE-2026-39987: Marimo RCE exploited in hours after disclosure", Security Affairs, 2026-04-11. <https://securityaffairs.com/190623/hacking/cve-2026-39987-marimo-rce-exploited-in-hours-after-disclosure.html>

[6] "Marimo RCE Flaw CVE-2026-39987 Exploited Within 10 Hours of Disclosure", The Hacker News, 2026-04-24. <https://thehackernews.com/2026/04/marimo-rce-flaw-cve-2026-39987.html>

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
