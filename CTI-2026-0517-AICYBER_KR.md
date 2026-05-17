# AI 사이버 공격의 새로운 패러다임 — 빅테크의 '에이전틱 방어' 대응과 한국 사이버 안보 시사점

> **북한 APT45의 AI 무기화 동향과 한국 방어 체계 전환 권고**
> *AI Threat Tracker (GTIG, 2026-05) 분석 및 한국 정책 함의*

| 항목 | 내용 |
|---|---|
| **리포트 ID** | `CTI-2026-0517-AICYBER` |
| **발행일** | 2026-05-17 |
| **분류** | `TLP:GREEN` |
| **심각도** | **HIGH** — 국가급 위협 행위자의 AI 무기화 가속 |
| **신뢰도** | HIGH (1차 자료 6건 교차 검증) |
| **위협 행위자** | APT45 (DPRK-nexus), 중국 연계 위협 행위자 (China-nexus) |
| **관련 ATT&CK 기법** | T1588.005, T1588.006, T1059.006, T1195.002 |
| **참고 자료** | 6개 1차 자료 (Google, Microsoft, Palo Alto Networks, YTN) |
| **작성자** | Dennis Kim (김호광 / HoKwang Kim) · Betalabs Inc. |

---

## Key Judgments — 핵심 판단

- **(HIGH)** Google Threat Intelligence Group(GTIG)이 차단한 사례는 대규모 언어 모델(LLM)이 **의미론적 논리 결함(semantic logic flaw)** 을 자율적으로 발견·악용하는 데 성공한 최초의 공개 사례이며, 기존 퍼저·정적 분석 도구의 탐지 범위를 구조적으로 벗어난다.
- **(HIGH)** 북한 APT45의 AI 활용은 단순 도구 사용 단계를 넘어 **제로데이 분석·검증의 자동화** 단계에 진입했으며, 한국 표적에 대한 공격 효율을 비대칭적으로 끌어올릴 가능성이 매우 높다.
- **(MEDIUM)** Google · Microsoft · Palo Alto Networks가 전개하는 '에이전틱 방어(Agentic Defense)' 체계는 2026년 내 글로벌 SOC의 사실상 산업 표준으로 자리잡을 것으로 전망된다.
- **(MEDIUM)** 한국의 보안 거버넌스(국정원·KISA·DAXA·금융보안원)는 AI 시대 위협 속도(공격 실행 30분 이내)에 구조적으로 대응하기 어려우며, **SBOM 의무화 · 자국형 보안 에이전트 개발** 등 즉각적 정책 전환이 요구된다.

---

## §1. 사건 개요 — Google의 AI 기반 제로데이 공격 차단

지난 5월 12일 YTN은 Google Threat Intelligence Group(GTIG)이 인공지능(AI)을 악용해 대규모 사이버 공격을 준비하던 해커들의 시도를 선제 차단했다고 보도했다. Google이 발간한 **AI Threat Tracker** 보고서에 따르면, 특정 해커 집단이 AI 모델을 활용해 실제 작동 가능한 '제로데이(zero-day)' 취약점 공격 코드를 개발했으며, 이는 위협 행위자가 AI를 사용해 제로데이 공격 개발에 성공한 최초의 공개 사례로 기록됐다.

Google은 해당 취약점을 개발사에 신속히 통보해 패치를 완료함으로써 대규모 피해를 사전에 차단할 수 있었다. 그러나 이번 사건은 단순한 해킹 시도 이상의 의미를 지닌다. 사이버 공격의 판도가 AI를 중심으로 급속히 재편되고 있음을 여실히 보여주기 때문이다.

## §2. AI로 무장하는 해커들 — TTP 분석

이번에 포착된 공격 코드는 파이썬(Python) 스크립트로 작성되었으며, 대규모 언어 모델(LLM)이 개입했음을 시사하는 명확한 패턴들을 포함하고 있었다. 코드 내에는 과도한 양의 교육용 문서 문자열(educational docstrings)과 실제와 무관한 CVSS 점수(hallucinated CVSS score), 교과서처럼 정제된 포맷이 발견되었는데, 이는 LLM 생성 콘텐츠의 전형적인 특징들이다.

특히 주목할 점은 이 공격이 전통적인 메모리 오류나 입력값 검증 오류가 아닌, 고차원적인 **의미론적 논리 결함(semantic logic flaw)** 을 겨냥했다는 사실이다. 공격자는 AI 모델을 통해 코드의 흐름과 개발자의 의도를 맥락적으로 읽어내며, 하드코딩된 신뢰 가정(hard-coded trust assumption)에서 비롯된 취약점을 찾아냈다. 이는 기존의 퍼저(fuzzer)나 취약점 스캐너로는 탐지가 거의 불가능한 유형의 결함이다.

국가 지원 해킹 집단의 AI 무기화 움직임도 포착됐다. 보고서에 따르면 북한 해킹 그룹 **APT45**(별칭: Andariel, Onyx Sleet)는 AI 모델에 수천 건의 프롬프트를 반복 전송해 취약점을 분석하고 공격 코드의 실행 가능성을 검증하는 연구를 진행 중인 것으로 드러났다. 이는 기존에는 수개월이 걸리던 분석·검증 작업을 자동화함으로써, 제로데이 취약점 공격의 실행 가능성을 대규모로 확보하려는 전략으로 해석된다.

중국 연계 위협 행위자들은 일본 기술 기업의 취약점을 찾아내기 위해 에이전트 도구를 활용, 자율적이고 지속적인 탐색 공격을 수행한 것으로 발견됐으며, 고성능 LLM 서비스에 익명으로 접근하기 위해 **전문 미들웨어(신원 세탁 도구)** 와 **계정 등록 자동화 프로그램**까지 동원하는 정교함을 보여줬다.

### §2.1 MITRE ATT&CK 매핑

| 기법 ID | 명칭 | 이번 사건 관찰 사항 |
|---|---|---|
| `T1588.005` | Obtain Capabilities: Exploits | AI 생성 제로데이 익스플로잇 코드 확보 |
| `T1588.006` | Obtain Capabilities: Vulnerabilities | LLM 기반 의미론적 논리 결함 발굴 |
| `T1059.006` | Command and Scripting Interpreter: Python | LLM 생성 Python 익스플로잇 스크립트 |
| `T1195.002` | Supply Chain Compromise: Software Dependencies | LiteLLM·Trivy·Checkmarx 등 AI 공급망 표적화 |
| `T1583.008` | Acquire Infrastructure: Malvertising | LLM 서비스 익명 접근용 미들웨어·계정 자동화 |

## §3. 빅테크의 대응 — '에이전틱 방어' 체계 출현

Google은 단순히 공격을 차단하는 데 그치지 않고, AI를 방어의 최전선에 투입하고 있다. 지난 4월 Google Cloud Next 2026에서 발표된 **Agentic Defense Portfolio**는 위협 인텔리전스, 보안 운영, 사전 대응 활동을 하나로 통합한 AI 사이버 보안 체계다.

Google은 또한 Wiz 인수를 통해 320억 달러 규모의 사이버 보안 역량을 확보했으며, 이는 국가 수준의 사이버 위협에 대응하기 위한 전략적 판단으로 해석된다. AI가 이제 인간의 속도를 넘어서 위협을 사냥하고, 탐지하고, 수정하는 시대에 접어든 것이다.

Google Cloud의 Mandiant 컨설팅 부문은 2025년 말까지 위협 행위자들이 대규모 언어 모델을 악성코드에 직접 통합해 주문형 코드 생성을 수행하는 단계에 진입했다고 분석했다. 이에 대응해 Google은 Gemini의 추론 능력을 활용해 코드 취약점을 자동으로 수정하는 **CodeMender**와 같은 AI 기반 에이전트를 도입하는 등 방어 전략 자체를 근본적으로 재설계하고 있다.

마이크로소프트 역시 AI를 보안의 핵심 축으로 삼고 있다. 2025년 Ignite 콘퍼런스에서 Microsoft는 완전한 AI 에이전트 중심의 보안 운영 센터(SOC)로의 전환을 선언했다. 네 가지 **Security Copilot 에이전트**는 피싱 분류, 위협 탐색, 동적 위협 탐지, 위협 인텔리전스 브리핑 생성 등 SOC 생애주기 전반에 걸친 작업을 자동화하며, **Predictive Shielding** 기능은 위협 인텔리전스와 그래프 분석을 활용해 공격자의 다음 움직임을 예측하고 사전에 방어 조치를 취한다. 또한 Microsoft는 AI 에이전트의 통합 보안 태세 관리를 위한 **Microsoft Agent 365**를 도입해, 프롬프트 인젝션(prompt injection) 및 데이터 노출과 같은 AI 특화 위협까지 탐지 및 대응 체계를 갖췄다.

## §4. 한국을 향한 위협 — 더 이상 미룰 수 없는 대응 과제

GTIG 보고서가 지목한 북한 해킹 그룹 'APT45'의 AI 무기화 움직임은 한국 입장에서 결코 가볍게 볼 수 없는 신호다. APT45는 오랜 기간 한국의 국방·원자력·금융·암호화폐 거래소를 표적으로 삼아왔으며, **라자루스 그룹(Lazarus Group)** 을 비롯한 북한 연계 위협 행위자들은 이미 SWIFT 금융망 침해, 가상자산 탈취, 공급망 공격 등 다양한 영역에서 세계 최상위권의 공격 역량을 입증해 왔다. 이들이 AI를 통해 제로데이 발굴과 공격 코드 생성의 '시간 단가'를 극적으로 낮추는 데 성공한다면, 한국을 향한 사이버 공격의 빈도와 정교함은 동시에 폭증할 가능성이 매우 높다.

특히 한국은 세계 최고 수준의 광대역 인프라와 디지털 행정 체계, 그리고 글로벌 5위권의 가상자산 거래 시장이라는 '고가치 표적'이 응축된 환경이다. 반면 중소·중견 기업의 보안 인력 부족과 공공기관의 레거시 시스템 의존도는 여전히 구조적 취약점으로 남아 있다. AI 기반 공격이 30분 내에 실행되는 시대에 사람이 로그를 직접 들여다보는 수동적 대응으로는 방어선이 무너질 수밖에 없다.

### §4.1 정책 권고 — 한국형 '에이전틱 방어' 전환 4대 과제

| # | 과제 | 주관 기관 | 시급도 |
|---|---|---|---|
| **1** | 위협 인텔리전스 공유 체계의 AI화 — 국정원·KISA·국군사이버사령부를 축으로 AI 기반 분석·자동화 계층 결합 | 국정원, KISA, 국군사이버사령부 | 즉시 |
| **2** | 가상자산·핀테크 LLM 보안 가이드라인 정비 — 거래소·핀테크 기업의 LLM 활용 보안 표준 수립 | 금융보안원(FSI), DAXA, 금융위 | 24-72시간 |
| **3** | AI 공급망 SBOM 의무화 및 상시 모니터링 — 오픈소스 LLM 패키지·MCP 커넥터·에이전트 오케스트레이션 계층 대상 | KISA, 과기정통부 | 7일 이내 |
| **4** | 자국형 보안 에이전트 개발 및 인력 양성 — 산학협력 기반 한국형 SOC 에이전트 R&D | 과기정통부, 산업부, 산학 컨소시엄 | 30일 이내 정책 수립 |

공격자에게 AI는 이미 무기다. 방어자에게도 AI는 더 이상 선택이 아니라 필수가 됐다. 한국이 AI 시대 사이버 안보 경쟁에서 뒤처지지 않으려면, 지금 이 순간부터 '에이전틱 방어'로의 전환에 속도를 내야 한다.

## §5. 사이버 보안의 미래 — 상시 모니터링과 적극 방어의 시대

Palo Alto Networks의 최신 전망에 따르면 2026년은 **'방어자의 해(year of the defender)'** 로 불릴 만큼, 자율 AI 기반 보안이 AI 기반 신원 공격과 데이터 중독(data poisoning)에 맞서는 핵심 수단으로 부상할 것으로 예측된다. 공격 속도는 이미 2025년에 단 30분 만에 실행되는 사례가 등장할 정도로 극적으로 빨라졌으며, 이는 전통적인 수동적·반응적 방어 체계로는 더 이상 대응이 불가능함을 의미한다.

Google의 John Hultquist GTIG 수석 분석가는 "AI 기반 취약점 무기화 경쟁은 이미 시작됐다"며 "위협 행위자들은 AI를 여러 전선에 걸쳐 활용해 공격의 속도, 규모, 정교함을 높이고 있으며, 국가 지원 집단과 사이버 범죄 조직 모두의 AI 활용을 과소평가해서는 안 된다"고 경고했다.

GTIG 보고서는 또한 AI 공급망 자체가 새로운 공격 표적이 되고 있음을 지적했다. **LiteLLM, Trivy, Checkmarx** 등 오픈소스 코드 저장소를 대상으로 한 공급망 공격(Supply Chain Attack, `T1195.002`) 사례가 확인되었으며, 공격자들은 AI 모델 자체보다는 이를 연결하는 API 커넥터, 오케스트레이션 계층, 스킬 설정 파일 등 취약한 주변 컴포넌트들을 집중적으로 노리고 있다.

지금 우리가 목격하는 것은 단순한 기술적 진보가 아닌, 사이버 안보 패러다임의 전면적인 전환이다. 해커들은 AI로 무기를 만들고, 빅테크는 AI로 방패를 단단히 한다. Google과 Microsoft, Palo Alto Networks 등 글로벌 보안 선도 기업들이 전개하는 상시 모니터링과 적극 방어 체계는 더 이상 미래의 이야기가 아니다. 이미 현장에서 작동하고 있는, AI 시대 사이버 안보의 새로운 현실이다.

---

## References — 참고 자료

### 1차 보도 (Primary Source)
- **YTN**, "AI 사이버 공격의 새로운 패러다임", 2026-05-12 — <https://science.ytn.co.kr/news/view.php?idx=4302>

### 위협 인텔리전스 보고서 (Threat Intelligence Reports)
- **Google Threat Intelligence Group (GTIG)**, "AI Threat Tracker — Trends in AI Misuse by Threat Actors" — <https://blog.google/technology/safety-security/google-threat-intelligence-group-report-ai-threat-trends/>

### 벤더 보안 전략 (Vendor Security Strategy)
- **Google Cloud**, "Next '26: Securing the AI Era — Wiz & Agentic Defense" — <https://cloud.google.com/blog/products/security/next-26-security-ai-era-google-cloud-wiz>
- **Microsoft (Japan Blog)**, "Agents Embedded into Workflows: Security Copilot with Microsoft 365 E5" (Ignite 2025) — <https://blogs.windows.com/japan/2025/11/28/agents-embedded-into-workflows-get-security-copilot-with-microsoft-365-e5/>
- **ZDNet**, "How Microsoft's New Security Agents Help Businesses Stay a Step Ahead of AI-Enabled Hackers" — <https://www.zdnet.com/article/how-microsofts-new-security-agents-help-businesses-stay-a-step-ahead-of-ai-enabled-hackers/>
- **Palo Alto Networks**, "Frontier AI: Impact on Cybersecurity (2026 Forecast)" — <https://www.paloaltonetworks.com/cyberpedia/frontier-ai-impact-on-cybersecurity>

### 관련 프레임워크 (Frameworks Referenced)
- MITRE ATT&CK Framework — <https://attack.mitre.org/>
- NIST SP 800-61 (Computer Security Incident Handling Guide)
- NIST SP 800-207 (Zero Trust Architecture)

---

## Cross-References — 본 저장소 내 관련 리포트

- [`CTI-2026-0420-VERCEL`](./CTI-2026-0420-VERCEL_KR.md) §8 — AI SaaS 공급망 공격이 한국 Web3 생태계에 미치는 영향 (본 리포트 §2.1 `T1195.002` 항목과 교차 참조)
- [`CTI-2026-0320-CORUNA`](./CTI-2026-0320-CORUNA_KR.md) §6 — 한국 정부 사이버 안보 구조의 취약점 (본 리포트 §4.1 정책 권고와 교차 참조)

---

## Document Versions — 다국어·포맷 버전

| 언어 | Markdown | Word |
|---|---|---|
| 한국어 (KR) | [`CTI-2026-0517-AICYBER_KR.md`](./CTI-2026-0517-AICYBER_KR.md) | [`CTI-2026-0517-AICYBER_KR.docx`](./CTI-2026-0517-AICYBER_KR.docx) |
| English (EN) | [`CTI-2026-0517-AICYBER_EN.md`](./CTI-2026-0517-AICYBER_EN.md) | — |

---

## Disclaimer

본 리포트는 공개된 OSINT 자료와 1차 언론 보도를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다. 본 자료는 교육·방어·연구·정책 수립 목적으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division · Betalabs Inc.
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
