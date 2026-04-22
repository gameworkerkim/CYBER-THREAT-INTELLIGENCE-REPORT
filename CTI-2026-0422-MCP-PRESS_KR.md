---
id: CTI-2026-0422-MCP-PRESS
type: "Press Release"
title: "[보도자료] MCP의 구조적 RCE 결함·잠복형 공격·북한 공급망 위협에 관한 독립 CTI 리포트 공개"
report_ref: "CTI-2026-0422-MCP"
issued_by: "Dennis Kim (김호광) · 독립 위협 인텔리전스 연구자"
date: "2026-04-22"
embargo: "즉시 배포"
lang: ko
classification: "TLP:GREEN"
license: "보도·인용 자유 (출처 표기)"
---

# [보도자료] MCP 구조적 결함·잠복형 공격·북한 공급망 위협에 관한 독립 CTI 리포트 공개

**— 2026-04-22 즉시 배포 —**

## 핵심 요지

- Anthropic의 MCP(Model Context Protocol)에 **설계 수준의 원격 명령 실행(RCE) 결함**이 확인됨에도, Anthropic은 *"의도된 동작"*이라며 근본 패치를 거부하고 있다.
- 영향 규모: 공식 SDK 기반 **1억 5천만 회 이상 다운로드**, 공개 MCP 서버 **7,000개 이상**, 취약 인스턴스 **최대 20만 개**, 관련 CVE **6건**.
- 본 리포트는 이 문제를 단일 취약점이 아닌 **공급망·국가안보 차원의 구조적 위협**으로 재정의하며, 2026-03-31 **북한 연계 UNC1069(Sapphire Sleet)의 Axios NPM 침해**를 *잠복형 MCP(sleeper MCP)* 시나리오의 선행 사례로 제시한다.

---

## 1. 발행 개요

| 항목 | 내용 |
|---|---|
| 리포트 제목 | **MCP를 노리는 지능형 공격, 잠복형 공격 - 구조적 문제인가** |
| 리포트 ID | `CTI-2026-0422-MCP` |
| 공개일 | 2026년 4월 22일 |
| 분류 | `TLP:GREEN` (자유 배포·인용 가능) |
| 심각도 | 🔴 HIGH — 공급망·국가안보 복합 위협 |
| 저자 | Dennis Kim (김호광 / HoKwang Kim), 독립 위협 인텔리전스 연구자 |
| 원문 공개 | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) |
| 지원 언어 | 한국어 · 영어 · 중국어 · 일본어 (Markdown) / 한국어 PDF |
| 참고 문헌 | 24건 외부 자료 교차 검증 (OX Security, Google GTIG, Microsoft, PNAS, arXiv 등) |

---

## 2. 리포트의 핵심 결론

### (1) MCP의 결함은 "버그"가 아닌 "설계"

OX Security 연구팀이 2026년 4월 공개한 보고서에 따르면, Anthropic의 MCP 공식 SDK(Python·TypeScript·Java·Rust)는 **STDIO 전송 경로**에서 OS 명령 문자열을 받은 즉시 실행하며, MCP 핸드셰이크 실패 여부와 관계없이 공격자의 명령이 호스트에서 이미 실행된 상태가 된다. 샌드박스·입력 정화·허용 목록 등 기본 방어 장치가 모두 누락되어 있다.

OX Security는 실제 결제 고객을 보유한 6개 상용 서비스에서 명령 실행을 성공적으로 입증했으며, 해당 결함은 **Cursor, VS Code, Windsurf, Claude Code, Gemini-CLI** 등 주요 AI IDE와 **LangFlow, Flowise, LiteLLM, LangChain, LettaAI** 등 오픈소스 프레임워크에 공통으로 존재한다.

### (2) 관련 CVE 6건

`CVE-2025-49596` (MCP Inspector) · `CVE-2025-54136` (Cursor) · `CVE-2025-54994` (`@akoskm/create-mcp-server-stdio`) · `CVE-2026-22252` (LibreChat) · `CVE-2026-22688` (WeKnora) · `CVE-2026-30615` (Windsurf, 제로-클릭).

### (3) 가장 위협적인 미래 공격 — "Sleeper MCP"

Anthropic 자신이 2024년에 발표한 *Sleeper Agents* 논문(arXiv:2401.05566)과 Microsoft의 *Trigger in the Haystack*(2026) 연구를 결합하면, 앞으로 가장 현실화 가능성이 높은 공격은 **수개월간 정상 동작하다가 특정 트리거(날짜·환경변수·대화 키워드)가 들어오는 순간에만 악성 분기로 전환**되는 MCP 서버다. 발견-패치가 아니라 *발견-트리거*의 경주이며, 수백만 인스턴스 중 단 하나만 트리거되어도 공급망 전체로 확산된다.

### (4) 북한 공급망 공격과의 연결선 — 국가 안보 사안

**2026년 3월 31일 Axios NPM 패키지 침해** 사건은 Google Threat Intelligence Group과 Microsoft Threat Intelligence에 의해 북한 연계 위협행위자 **UNC1069**(Microsoft 명칭 **Sapphire Sleet**)의 소행으로 공식 귀속되었다. 악성 버전이 레지스트리에 노출된 시간은 단 3시간이었지만, 주간 다운로드 1억 회 이상인 axios 사용자의 약 3%가 그 짧은 창 안에 노출되었으며, 공격자는 `plain-crypto-js`라는 악성 의존성을 이용해 Windows·macOS·Linux에 **WAVESHAPER.V2 RAT**을 배포했다.

리포트는 이 사건이 *Sleeper MCP*에 필요한 **레지스트리 탈취, postinstall 훅, 다중 플랫폼 페이로드 분기, 자가 파괴** 기법 일체가 이미 북한 위협행위자에 의해 실전 숙달되었음을 증명하는 선행 사례라고 분석한다. 대한민국을 포함한 주요 표적국을 대상으로 한 MCP 생태계 오염 실험이 단기적으로 반복될 가능성이 높으며, 중장기적으로는 **여론 왜곡·사회 혼란·국가 간 "둠스데이 공격" 시나리오**까지 설계 목표가 확장될 수 있다.

### (5) Web3 업계의 특수 위험 — 멀티시그 신화의 붕괴

대부분의 Web3 프로젝트는 멀티시그(Gnosis Safe 등)로 자산을 보호한다고 설명하지만, 실제 현장에서는 서명자 2~3명이 **동일 호스트 OS** 위에서 MetaMask·Phantom·Rabby 같은 동일 지갑 확장을 사용한다. 같은 호스트에 MCP가 설치되어 있다면, 단 하나의 오염된 MCP만으로 멀티시그는 **단일 장애점(single point of failure)**으로 귀결된다. Google Cloud는 대부분의 암호화폐 MCP 서버가 *"에이전트에 개인키를 직접 주입하는"* 모델을 전제로 하고 있어, 2026년 초의 **OpenClaw ClawJacked** 류 사건이 반복될 수 있다고 경고한 바 있다.

### (6) RCE가 없어도 위험한 편향 주입 공격

MCP는 코드 실행에 도달하지 않아도, LLM의 컨텍스트 원천을 제어함으로써 **확증 편향·앵커링·프레이밍** 등을 통해 수개월~수년에 걸친 **의사결정 드리프트**를 유발할 수 있다. Knipper et al. (2025)은 주요 LLM의 인지 편향 민감도를 평균 17.8~57.3%로 보고했고, PNAS 2025년 논문은 LLM이 인간 편향을 재현할 뿐 아니라 **증폭(amplify)**시킬 수 있음을 실증했다.

---

## 3. 권고 사항 (요약)

1. 모든 MCP 서버는 기본적으로 **비신뢰(untrusted)**로 취급하고, 서명·샌드박스·허용 목록 없이는 운영 환경에 올리지 않는다.
2. 자산 대량 보관은 MCP가 접근할 수 없는 **외부 에스크로·콜드월렛·HSM 기반 다자 서명**으로 분리하고, 실제 서명 기기에는 MCP·AI 확장을 설치하지 않는다.
3. 멀티시그는 **머신·네트워크·물리 위치** 기준으로 분산한다. 동일 호스트에서의 멀티시그는 멀티시그가 아니다.
4. MCP는 **분기 1회 이상의 공식 감사 대상**으로 지정하고 SBOM, CVE, 의미 드리프트, 카나리 응답, 정보 다양성을 병행 점검한다.
5. 국가 차원에서는 북한 연계 MCP 공급망 오염 시나리오를 **국가 사이버 안보 과제**로 편입하고, 공공 부문 AI 도구 조달에 공급망 검증 의무화를 도입할 것을 제언한다.

---

## 4. 인용 가능 코멘트 (저자 Dennis Kim)

> *"MCP 문제는 특정 벤더 하나의 실수가 아니라, AI 에이전트 생태계가 속도를 우선하며 감수한 구조적 트레이드오프의 첫 번째 결산입니다. 지금 질문해야 할 것은 MCP를 쓰느냐 마느냐가 아니라, MCP와 함께 어떤 격리·검증·감사 레이어를 반드시 함께 설치할 것인가입니다."*

> *"가장 위험한 공격은 지금 터지는 공격이 아니라, 수개월 뒤에 터지도록 심어진 공격입니다. 북한은 Axios 사건에서 그 기법을 이미 완성 단계까지 끌어올렸고, MCP는 바로 그 기법이 가장 잘 먹히는 토양입니다."*

> *"대한민국의 Web3 기업과 일반 스타트업 모두가 반드시 해야 할 일은, 지갑 물량을 MCP와 연결되지 않는 외부 에스크로로 옮기는 것입니다. 멀티시그라는 단어를 반복해도, 그 서명들이 같은 노트북 위에서 만들어진다면 그것은 단일 장애점입니다."*

---

## 5. FAQ — 취재·기사 작성 시 자주 묻는 질문

**Q1. 이 리포트는 Anthropic을 비판하는 것인가?**
A. 특정 기업을 공격하는 것이 아니라, Anthropic이 공개적으로 *"의도된 동작"*으로 분류한 설계 선택이 다운스트림 전체 생태계에 어떤 구조적 위험을 남기는지를 분석한 문서다. OX Security의 공식 보고서와 24건의 외부 자료를 교차 검증했다.

**Q2. 일반 기업이 지금 당장 해야 할 가장 중요한 조치는?**
A. ① 개발자 머신에 설치된 MCP 목록을 작성(SBOM), ② 운영 지갑 잔액을 일일 한도 이상 두지 않고 나머지를 외부 에스크로로 이전, ③ 서명용 기기에서 MCP·AI 확장을 제거하는 세 가지다.

**Q3. 북한 UNC1069와 MCP를 직접 연결하는 확정 증거가 있는가?**
A. 본 리포트는 UNC1069의 Axios NPM 침해를 **직접적인 MCP 공격 증거가 아니라 공급망 기법의 실전 숙달 사례**로 제시한다. MCP가 동일한 배포 표면(npm/pip, postinstall, 멀티플랫폼 페이로드)을 공유하기 때문에, 같은 행위자가 MCP 쪽으로 기법을 이식할 가능성이 매우 높다는 분석이다.

**Q4. 한국 정부·규제기관이 취할 수 있는 조치는?**
A. 공공 부문 및 금융권의 AI 도구 조달 가이드라인에 MCP 서버 SBOM 제출과 잠복형 트리거 사전 탐지 요건을 포함하는 방안이 가장 즉각적이며 실효적이다. 자세한 제언은 리포트 §7에 정리되어 있다.

**Q5. 기사에 인용해도 되는가? 로열티가 있는가?**
A. 본 리포트는 **TLP:GREEN / CC BY-NC-SA 4.0**으로 배포되며, 출처(저자·리포트 ID)를 밝히면 기사·블로그·학술 자료 등에 자유롭게 인용 가능하다. 상업적 이용 시에는 저자와 사전 협의를 부탁드린다.

---

## 6. 리포트 다운로드

| 언어 | 형식 | 링크 |
|---|---|---|
| 🇰🇷 한국어 | Markdown | [`CTI-2026-0422-MCP_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_KR.md) |
| 🇰🇷 한국어 | PDF (정식본) | [`CTI-2026-0422-MCP_KR.pdf`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_KR.pdf) |
| 🇬🇧 English | Markdown | [`CTI-2026-0422-MCP_EN.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_EN.md) |
| 🇨🇳 中文 (簡體) | Markdown | [`CTI-2026-0422-MCP_CN.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_CN.md) |
| 🇯🇵 日本語 | Markdown | [`CTI-2026-0422-MCP_JP.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0422-MCP_JP.md) |

---

## 7. 저자 및 연락처

**Dennis Kim (김호광 / HoKwang Kim)** — 독립 사이버 위협 인텔리전스 분석가. 싸이월드 Z 전 CEO, Betalabs Inc. 대표. Microsoft Azure MVP (2015–2023). Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/MCP 보안을 주 연구 영역으로 한다.

- **Email**: [gameworker@gmail.com](mailto:gameworker@gmail.com)
- **GitHub**: [github.com/gameworkerkim](https://github.com/gameworkerkim)
- **CTI 아카이브**: [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

*본 보도자료와 원문 리포트는 공개된 OSINT 자료와 언론 보도를 바탕으로 한 독립적 분석이며, 특정 기관·기업의 공식 입장을 대변하지 않습니다.*

---

© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division · `TLP:GREEN`
