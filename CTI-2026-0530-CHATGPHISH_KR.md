| id             | CTI-2026-0530-CHATGPHISH                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| title          | ChatGPhish — AI 요약을 피싱 표면으로 바꾸는 ChatGPT 렌더러 신뢰 결함                                                                       |
| subtitle       | 마크다운 링크·이미지의 암묵적 신뢰, 간접 프롬프트 인젝션, 그리고 QR 코드 피벗                                                                          |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                          |
| email          | gameworker@gmail.com                                                                                                   |
| github         | gameworkerkim                                                                                                          |
| date           | 2026-05-30                                                                                                             |
| classification | TLP:GREEN                                                                                                              |
| severity       | MEDIUM                                                                                                                  |
| lang           | ko                                                                                                                     |
| tags           | AI-Security · Prompt-Injection · LLM-Phishing · Data-Exfiltration · Indirect-Injection · QR-Pivot                     |
| threat_actors  | N/A (연구 공개 · Permiso Security)                                                                                          |
| cve            | CVE 미부여 (Bugcrowd 보고, 벤더 재현 불가 회신)                                                                                      |
| frameworks     | MITRE ATLAS · OWASP LLM Top 10 (LLM01 Prompt Injection) · NIST AI RMF                                                   |
| license        | CC BY-NC-SA 4.0                                                                                                        |


# ChatGPhish — AI 요약을 피싱 표면으로 바꾸는 ChatGPT 렌더러 신뢰 결함

> **리포트 ID** `CTI-2026-0530-CHATGPHISH` · **발행일** 2026-05-30 · **분류** `TLP:GREEN` · **심각도** 🟠 MEDIUM
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*마크다운 링크·이미지의 암묵적 신뢰, 간접 프롬프트 인젝션, 그리고 QR 코드 피벗*

---

## 목차

1. 요약 (TL;DR)
2. 취약점 분석 — 렌더러의 암묵적 신뢰
3. 세 가지 공격 프리미티브
4. 공격 시나리오 — 정상 웹페이지가 페이로드가 되는 순간
5. 공개 타임라인과 벤더 대응
6. 기업·개인 관점 — "이메일에서 브라우저로" 확장된 공격면
7. 탐지·완화 권고
8. 결론
9. 참고 문헌

---

## 요약 (TL;DR)

2026년 5월 29일, Permiso Security는 OpenAI ChatGPT에서 AI 어시스턴트가 **마크다운 링크·이미지를 암묵적으로 신뢰**하는 데서 비롯되는 취약점을 공개했다. 기법명은 **ChatGPhish**(연구자 Andi Ahmeti).

핵심은 `chatgpt.com` 응답 렌더러가, 어시스턴트가 방금 요약한 **제3자 페이지에서 비롯된 마크다운 링크·이미지 URL을 신뢰**한다는 데 있다. 렌더러는 이 이미지를 자동으로 가져오고(auto-fetch), 링크를 신뢰받는 어시스턴트 UI 안에 **활성 클릭 가능 요소로 노출**한다.

그 결과 공격자는 임의 웹페이지에 작은 페이로드를 심어두기만 하면, 피해자가 그 페이지를 ChatGPT로 요약하는 순간 (1) 공격자 호스팅 이미지가 자동 로드되며 **IP·User-Agent·Referer가 유출**되고, (2) 피싱 링크·가짜 시스템 경고·QR 코드가 **ChatGPT 자체 UI의 시각적 신뢰를 입은 채** 표시된다. 공격이 이메일·첨부에서 **브라우저·AI 요약**으로 이동한다는 점에서 공격면이 크게 넓어진다.

### Key Judgments

| #    | 판단                                                                                                                       | 신뢰도             |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| KJ-1 | 본 결함의 뿌리는 **간접 프롬프트 인젝션**이다. 모델이 자신의 생성 콘텐츠와 외부에서 끌어온 마크다운을 구분하지 못한다.                                                     | **High**        |
| KJ-2 | 어시스턴트 UI의 **시각적 신뢰**가 무기가 된다. 가짜 보안 경고·피싱 링크가 ChatGPT 자체 출력과 구분 불가능하게 렌더링되어, 출처 라벨링이 없다.                                   | **High**        |
| KJ-3 | **QR 코드 피벗**은 데스크톱 URL 방어(블록리스트·호버 프리뷰·패스워드 매니저 도메인 체크)를 전면 우회한다. 목적지는 2차 기기 스캔 후에야 드러난다.                                  | **Medium-High** |
| KJ-4 | 이미지 자동 fetch로 인한 IP·UA·Referer 유출은 표적 정찰·추적에 활용 가능하나, 대화 전체 탈취 수준은 아니다. 영향은 **정보 유출 + 피싱 전달**에 집중된다.                       | **Medium**      |
| KJ-5 | 벤더가 "재현 불가/중복"으로 회신하고 발행 시점 수정 확인이 안 된 만큼, **현재도 취약하다는 전제** 하에 대응해야 한다. (모바일 앱은 특히 미적용 가능성)                               | **Medium**      |

---

## 1. 취약점 분석 — 렌더러의 암묵적 신뢰

ChatGPhish는 메모리 손상이나 인증 우회 같은 전통적 결함이 아니라, **LLM 시스템 고유의 신뢰 경계 붕괴**에서 비롯된다.

사용자가 ChatGPT에 웹페이지 요약을 요청하면, 모델은 해당 페이지(제3자, 미신뢰 콘텐츠)를 가져와 처리한다. 문제는 처리 결과가 어시스턴트 응답창에 렌더링될 때, `chatgpt.com` 렌더러가 **그 페이지에서 비롯된 마크다운 링크·이미지 URL을 어시스턴트 자신의 출력처럼 신뢰**한다는 점이다. 렌더러는 이미지 URL을 자동으로 fetch하고, 링크를 클릭 가능한 활성 요소로 표시한다.

브라우저의 동일 출처 정책(same-origin policy)은 여기서 보호를 제공하지 못한다. AI 어시스턴트가 **사용자의 인증된 컨텍스트**에서 실행되기 때문에, 전통적 웹 보안 경계가 무력화된다. 연구자의 표현대로, ChatGPT는 *"자신이 생성한 콘텐츠와 외부에서 끌어온 공격자 제어 마크다운을 구분하지 못한다."*

---

## 2. 세 가지 공격 프리미티브

Permiso는 이 신뢰 결함에서 파생되는 세 가지 공격 원형을 제시했다.

| # | 프리미티브 | 설명 |
| --- | --- | --- |
| ① | **UI 리드레스 / 피싱** | 공격자 제어 마크다운 링크가 ChatGPT UI 안에 출처 라벨 없이 활성 클릭 요소로 렌더링된다. 사용자는 공격자 주입 URL과 ChatGPT 생성 URL을 구분할 수 없다. |
| ② | **가짜 시스템 경고(스푸핑)** | 렌더러가 공격자 텍스트를 정상 "계정 보안 알림"처럼 스타일링해 표시한다. 어시스턴트 UI의 시각적 신뢰를 그대로 상속한다. |
| ③ | **QR 코드 피벗** | 공격자 S3 버킷에서 자동 렌더된 QR 이미지가 모든 데스크톱 URL 방어를 우회한다. 목적지는 2차 기기로 스캔한 뒤에야 드러나, 브라우저 차단·도메인 체크를 회피한다. |

여기에 더해, 임베드된 이미지의 자동 fetch만으로 피해자의 **IP·User-Agent·Referer**가 공격자 서버에 전달된다(정보 유출).

---

## 3. 공격 시나리오 — 정상 웹페이지가 페이로드가 되는 순간

전형적 시나리오는 다음과 같다.

1. 공격자가 임의의 웹페이지(또는 GitHub의 페이지 등)에 ChatGPT용 지시를 숨겨 심는다. 연구에서는 GitHub의 한 페이지에 가짜 보안 경고용 지시를 주입하는 방식이 시연되었다.
2. 피해자가 업무 중 해당 페이지를 ChatGPT로 요약하도록 요청한다(정상 행위).
3. ChatGPT가 페이지를 처리하면, 숨겨진 지시가 응답에 반영된다 — 피싱 링크, 가짜 계정 보안 경고, 원격 이미지, QR 코드가 신뢰받는 UI 안에 렌더링된다.
4. 동시에 공격자 호스팅 이미지가 자동 로드되며 피해자의 IP·UA·Referer가 유출된다.
5. 피해자가 데스크톱에서 QR을 휴대폰으로 스캔하면, 공격자 S3 버킷 콘텐츠로 이동해 데스크톱 방어를 완전히 우회한다.

이 과정에서 피해자는 *악성 첨부를 열거나 의심스러운 메시지에 반응할 필요가 없다*. "신뢰하는 AI에게 웹페이지 요약을 부탁한다"는 일상적 행위가 곧 트리거다.

---

## 4. 공개 타임라인과 벤더 대응

| 일자 | 사건 |
| --- | --- |
| 2026-04-29 | Permiso가 Bugcrowd를 통해 OpenAI에 최초 보고 — *"Untrusted Markdown Rendering Leads to XSS, Phishing, and Data Exfiltration"* |
| (이후) | OpenAI: 재현 불가(could not be reproduced) 회신, 중복(duplicate) 처리 정황 |
| (이후) | Permiso: 보고 건과 "중복"으로 지목된 건의 차이를 설명하며 추가 정보 요청 → 회신 없음 |
| 2026-05-29 | Permiso, ChatGPhish 공개. 연구자 "수정 적용 여부 미확인 — 안전을 위해 여전히 취약하다고 가정하라" |

연구자는 발행 시점에 **수정 적용 확인을 받지 못했다**고 밝혔다. 본 리포트는 이를 *"현재도 취약하다"는 보수적 전제* 하에 다룬다. 과거 유사한 이미지 마크다운 기반 데이터 유출(2023, Johann Rehberger; `url_safe` 검증 도입)이 불완전하게 완화되었던 전례도 이 전제를 뒷받침한다.

---

## 5. 기업·개인 관점 — "이메일에서 브라우저로" 확장된 공격면

Permiso의 지적대로, 이 결함은 **공격의 무게중심을 이메일에서 브라우저로 이동**시킨다. 조직이 ChatGPT를 리서치·요약에 광범위하게 도입할수록, 직원이 처리하도록 요청하는 임의의 악성 웹페이지가 ChatGPT를 피싱 표면으로 전환할 수 있다.

- **신뢰의 전이** — 사용자는 어시스턴트 출력을 신뢰하도록 학습되어 있다. 그 신뢰가 공격자에게 그대로 상속된다.
- **탐지 공백** — 기존 보안 도구는 이메일·네트워크 트래픽 감시에 맞춰져 있어, 브라우저 안에서 AI가 렌더링한 콘텐츠는 가시성 밖이다.
- **모바일 위험** — 과거 사례에서 모바일 앱은 클라이언트 측 검증이 늦게 적용되는 경향이 있었다. 데스크톱이 완화되어도 모바일은 잔존 위험이 클 수 있다.

이는 본 아카이브가 다룬 MCP 편향 주입(`CTI-2026-0422-MCP` §6)과 같은 계열의 위협 — *"코드 실행 없이 AI 출력 자체를 무기화"* — 의 또 다른 사례다.

---

## 6. 탐지·완화 권고

1. **요약 출력 경계** — AI가 요약·렌더링한 콘텐츠 내 링크·경고를 "외부 미검증 콘텐츠"로 취급하도록 사용자 교육. 어시스턴트 안의 "계정 보안 경고"는 무조건 의심한다.
2. **자동 이미지 로드 제어** — 가능한 경우 클라이언트·기업 정책 수준에서 외부 이미지 자동 fetch를 제한하거나 프록시를 경유시켜 IP·UA·Referer 노출을 차단한다.
3. **QR 경계** — 데스크톱 화면에 렌더된 QR 코드는 신뢰하지 않는다. 스캔 전 출처를 확인할 수 없는 QR은 차단 대상으로 교육한다.
4. **요약 대상 신뢰 등급화** — 미신뢰 외부 페이지를 AI로 요약할 때의 위험을 인지하고, 민감 업무 계정에서는 신뢰 출처로 제한한다.
5. **벤더 패치 추적** — OpenAI의 공식 수정·완화 발표를 추적하고, 모바일 앱 적용 여부를 별도 확인한다.
6. **간접 인젝션 방어 일반화** — OWASP LLM Top 10(LLM01)·MITRE ATLAS·NIST AI RMF에 근거해, 외부 콘텐츠를 처리하는 모든 AI 워크플로에 출력 정제·출처 라벨링·렌더링 경계를 설계 원칙으로 적용한다.

---

## 7. 결론

ChatGPhish는 심각도 자체(정보 유출 + 피싱 전달)로 보면 Critical은 아니다. 그러나 **위협의 성격**이 중요하다. 이는 AI 어시스턴트가 쌓아 올린 *신뢰*를 공격 표면으로 전환하는, LLM 시대의 구조적 취약점 계열에 속한다. 메모리 손상도 권한 상승도 없이, *"모델이 자기 출력과 외부 콘텐츠를 구분하지 못한다"*는 한 가지 사실만으로 피싱·정찰·기기 피벗이 성립한다.

방어의 출발점은 명확하다. **AI 출력은 신뢰의 종착점이 아니라 검증의 시작점**이어야 한다. 사용자가 ChatGPT에게 페이지 요약을 부탁할 때, 그 결과물 안의 링크·경고·QR은 모두 외부 미검증 콘텐츠일 수 있다. AI를 "사람보다 믿는" 인지적 습관 자체가, 이 공격이 노리는 가장 큰 자산이다.

> *민감 페이지를 AI로 요약하기 전에, "이 응답 안의 모든 링크는 외부에서 온 것일 수 있다"는 전제를 먼저 세울 것.*

---

## 참고 문헌 (References)

[1] Ravie Lakshmanan, "ChatGPhish Vulnerability Turns ChatGPT Web Summaries Into a Phishing Surface", The Hacker News, 2026-05-29. <https://thehackernews.com/2026/05/chatgphish-vulnerability-turns-chatgpt.html>

[2] "New ChatGPT Vulnerability Lets Attackers Turn Web Pages Into Phishing Payloads", Cyber Security News, 2026-05-29. <https://cybersecuritynews.com/chatgpt-vulnerability-chatgphish-attack/>

[3] Andi Ahmeti (Permiso Security) via The Register, "ChatGPT blindly trusts browser content, turning the page into a payload", The Register, 2026-05-29. <https://www.theregister.com/research/2026/05/29/chatgpt-prompt-injection-turns-web-pages-into-phishing-lures/>

[4] Tenable Research, "HackedGPT: Novel AI Vulnerabilities Open the Door for Private Data Leakage", 2025-11. <https://www.tenable.com/blog/hackedgpt-novel-ai-vulnerabilities-open-the-door-for-private-data-leakage>

[5] Johann Rehberger, "OpenAI Begins Tackling ChatGPT Data Leak Vulnerability", Embrace The Red, 2023-12. <https://embracethered.com/blog/posts/2023/openai-data-exfiltration-first-mitigations-implemented/>

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
