# CTI-2026-0510-MYTHOS-AI-VULN

## "AI는 새 취약점을 발견한 것이 아니라, 오래된 취약점을 싸게 만들었다"
### Rival Security 분석에 대한 CTI 검증 보고서 — Claude Mythos × CVE-2026-4747 × CVE-2007-3999

---

| 항목 | 내용 |
|---|---|
| **보고서 ID** | CTI-2026-0510-MYTHOS-AI-VULN |
| **발행일** | 2026-05-10 |
| **TLP 등급** | TLP:GREEN |
| **분류** | AI Threat Intelligence / Vulnerability Research / Defensive Strategy |
| **핵심 키워드** | LLM, Combinatorial Creativity, CVE-2026-4747, CVE-2007-3999, RPCSEC_GSS, FreeBSD NFS, MIT Kerberos, Vulnerability Economics |
| **원문 출처** | Rival Security, "Mythos 'Discovered' a CVE Already in Its Training Data — and That's Still Worrying" (Jake Feiglin, 2026-05-05) |
| **연관 보고서** | Anthropic Red Team, "Claude Mythos Preview" (red.anthropic.com, 2026-04-07); Project Glasswing 발표 |
| **작성** | Web3Paper Threat Intelligence Desk |

---

## 1. 요약 (Executive Summary)

Anthropic은 2026년 4월 자사 모델 **Claude Mythos**가 "AI가 자율적으로 발견·익스플로잇한 최초의 원격 커널 취약점"이라며 **CVE-2026-4747** (FreeBSD NFS 원격 코드 실행)을 공개했다. 이는 17년간 인간 검토와 수백만 회의 자동 테스트를 견뎌낸 취약점이며, ~$50의 컴퓨트 비용으로 발견되었다고 보고되었다.

이에 대해 **Rival Security의 Jake Feiglin** (2026-05-05)은 다음과 같이 반박했다:

1. **CVE-2026-4747은 사실상 신규 취약점이 아니다.** FreeBSD의 RPCSEC_GSS 코드는 MIT Kerberos 5의 `librpcsecgss` 코드와 거의 동일하며, 동일한 결함은 이미 **2007년 CVE-2007-3999** (그리고 그 패치 결함인 CVE-2007-4743)로 공개되어 있었다.
2. Mythos가 한 일은 "새 발견"이 아니라 **학습 데이터에 이미 존재하던 취약점 패턴을 새로운 코드베이스에 적용**한 **조합적 창의성(combinatorial creativity)**에 가깝다.
3. **그럼에도 불구하고 위협은 줄지 않는다.** 오히려 더 우려스럽다 — LLM이 안전하지 않은 패턴을 학습하여 그것을 새 코드에 재생산(regurgitate)하고 있고, 동시에 공격자에게 **수십 년 묵은 취약점을 새 코드베이스에서 자동으로 찾아내는 능력**을 ~$50 단위 가격으로 제공한다.

본 보고서는 이 주장을 검증하고, 한국 기업·금융권·블록체인 업계가 취해야 할 방어 포지셔닝을 정리한다.

**핵심 결론:** 위협의 본질은 "AI가 생각해낸 신규 제로데이"가 아니라, **취약점 발견의 한계비용이 $50 수준으로 붕괴**한 점이다. 이는 공격 경제학을 비대칭적으로 공격자 우위로 이동시킨다.

---

## 2. 사건 개요 (Incident Background)

### 2.1 Anthropic의 주장 (Project Glasswing)

| 항목 | 내용 |
|---|---|
| 발표 | 2026년 4월, Anthropic Red Team |
| 모델 | Claude Mythos Preview |
| 주요 사례 | CVE-2026-4747 (FreeBSD NFS RCE, 17년 묵은 취약점) |
| 익스플로잇 | 6개 RPC 패킷에 분산된 20-gadget ROP 체인, 96-byte 버퍼 한계 우회, 비인증 원격 root |
| 비용 | 단일 익스플로잇 발견 ~$50, 1,000회 캠페인 총 ~$20,000 |
| 부가 결과 | OpenBSD TCP SACK (27년 묵음), FFmpeg H.264 (16년 묵음), Linux 커널 LPE 다수, Firefox 147에서 181건 익스플로잇, 모든 주요 OS·브라우저에서 수천 건의 1~20년 묵은 제로데이 |
| Anthropic 입장 | "이 능력을 명시적으로 학습시키지 않았다. 코드·추론·자율성의 일반적 향상의 결과로 emerge한 것" |

### 2.2 Rival Security의 반박 (2026-05-05)

Rival Security의 Jake Feiglin은 Mythos의 가장 상세히 공개된 사례인 **CVE-2026-4747**을 직접 분석한 결과:

- 해당 취약점이 발생한 **FreeBSD의 RPCSEC_GSS 구현**은 MIT Kerberos 5의 `lib/rpc/svc_auth_gss.c` 코드와 **사실상 동일한 계보**를 공유한다.
- 이 코드 라인의 결함은 **2007년 9월 5일** 이미 공개되었다 — `svcauth_gss_validate()` 함수의 스택 기반 버퍼 오버플로(CVE-2007-3999), 그리고 그 최초 패치가 일부 환경에서 버퍼 길이를 올바르게 검사하지 못해 추가 버퍼 오버플로 공격이 가능했던 CVE-2007-4743.
- 즉 Mythos는 **MIT Kerberos에서 공개되었던 19년 전 취약점 패턴을 FreeBSD라는 다른 트리에서 재발견**한 것에 가깝다.

> Rival Security 인용: *"In the case of CVE-2026-4747, the finding of the vulnerability itself seems much more an instance of combinatorial creativity, with AI making a discovery already within its training data."*

---

## 3. 기술적 비교 분석: CVE-2007-3999 ↔ CVE-2026-4747

### 3.1 코드 계보 (Code Lineage)

| 구분 | CVE-2007-3999 | CVE-2026-4747 |
|---|---|---|
| 영향 대상 | MIT Kerberos 5 (krb5) 1.4 ~ 1.6.2 | FreeBSD NFS (RPCSEC_GSS) |
| 실제 모듈 | `lib/rpc/svc_auth_gss.c` | RPCSEC_GSS (NFSv4 보안 컴포넌트) |
| 결함 함수 | `svcauth_gss_validate()` | (Anthropic 공개 수준에 따라) RPC 메시지 검증 경로 |
| 결함 종류 | Stack-based Buffer Overflow | Remote Code Execution (버퍼 처리 미흡, 6패킷 분산 체인 익스플로잇) |
| 트리거 | 긴 문자열을 RPC 메시지에 포함 | 다중 RPC 패킷 분산 페이로드 |
| 영향 범위 | kadmind 등 krb5 사용 데몬 / 서드파티 앱 | 엔터프라이즈·연구기관 NFS 스토리지 시스템 수천 대 |
| 발견 주체 | 인간 보안 연구자 (2007년) | Claude Mythos (2026년) |
| 코드 공유 경로 | Dug Song의 RPCSEC_GSS 구현 (Reversing of All Wrongs) → MIT Kerberos → 다수 Linux 배포판 → FreeBSD base tree로 분기 |

### 3.2 왜 두 코드가 비슷한가 — 역사적 맥락

- **1997년 IETF가 RPCSEC_GSS 표준을 RFC 2203으로 발표.**
- 미시간 대학교 **CITI(Center for Information Technology Integration)**가 NFSv4·RPCSEC_GSS·커널 컴포넌트의 다수를 자금 지원·구현.
- 같은 시기, **Dug Song**의 RPCSEC_GSS 코드가 MIT Kerberos에 흡수되었고, 이후 거의 모든 Linux 배포판이 동일한 구현을 채택.
- **FreeBSD는 base OS를 통합 리포지토리로 유지**하기 때문에 RPCSEC_GSS 코드가 Kerberos 트리와 **사실상 동형(virtually identical)** 구조로 존재.
- 결과적으로 2007년 MIT Kerberos에서 공개된 결함은 **FreeBSD 트리 안에 19년간 잠재**해 있었다.

### 3.3 핵심 통찰

> **Mythos는 새 패턴을 만들어낸 것이 아니라, 학습 데이터에 이미 들어있던 결함 패턴(CVE-2007-3999 계열)을 다른 코드베이스(FreeBSD)에 적용했다.**

이는 **수학·과학에서 LLM이 만드는 "재발견(rediscovery)"** 현상과 동일한 메커니즘이다. 새로운 정리(theorem)를 발명하지는 않지만, A 분야에서 알려진 결과를 B 분야로 옮기는 능력은 충분히 유효하다.

---

## 4. 핵심 쟁점: "조합적 창의성(Combinatorial Creativity)"의 의미

### 4.1 정의

조합적 창의성이란 (Schapiro et al., arXiv:2509.21043 등에서 정식화된 개념):
- **이미 알려진 요소들의 새로운 결합**으로 신규성·유용성을 갖는 산출물을 만드는 능력.
- 학습 데이터의 단순 암기(memorization)와도 다르고, 진정한 새로운 발견(true discovery)과도 다른 중간 영역.

### 4.2 보안 영역에서 이 구분이 중요한 이유

| 입장 | 논리 | 함의 |
|---|---|---|
| **"새 제로데이 발견"으로 보는 입장 (Anthropic)** | 모델이 27년 묵은 OpenBSD TCP SACK, 16년 묵은 FFmpeg, 17년 묵은 FreeBSD NFS 등 인간이 못 찾은 결함을 자율 발견 | AI를 인간 보안 연구자의 대체재로 평가, 패치 사이클의 근본적 재설계 필요 |
| **"조합적 재발견"으로 보는 입장 (Rival Security)** | 모델이 학습 데이터에 이미 있던 결함 패턴을 다른 코드베이스에 적용 | "AI 능력의 한계"는 줄어들지만, **위협의 본질은 더 심각** — 한계비용 붕괴와 학습 데이터 오염의 이중 위협 |

### 4.3 두 입장이 모두 동의하는 위험

**중요 포인트:** Rival Security의 분석은 Anthropic의 위협 평가를 깎아내리지 않는다. 오히려 **다른 차원에서 더 우려스럽다**고 본다.

- 만약 Mythos가 진정한 신규 취약점을 만들어내고 있다면, 그것은 정점급 보안 연구자의 자동화이므로 인간이 따라잡기 어려우나 **모델 capability가 한계에 부딪히면 멈출 가능성**이 있다.
- 만약 Mythos가 조합적 재발견에 능하다면, **현재 LLM이 "안전하지 않은 코드 패턴"을 학습하여 그것을 새 코드에 재주입(regurgitate)**하고 있다는 뜻이다. 이는:
  - **2026년 현재 AI가 작성·구성하는 코드 안에 19년 묵은 결함이 다시 심어지고 있을 가능성**
  - 공격자도 동일한 도구로 **이 새로 심어진 옛 결함**을 자동 탐지·익스플로잇 가능

> Rival Security 인용: *"FreeBSD's CVE was caused by human negligence in the early 2000s. But, in 2026, decades-old flaws are being baked directly into our systems faster than ever. LLMs, as they configure our environments and write new code, regurgitate the same insecure patterns they were trained on."*

---

## 5. 보안 경제학의 붕괴 (Security Economics Shift)

이 문제의 진짜 충격은 **capability**가 아니라 **cost**에 있다.

### 5.1 Anthropic 자체 공개 수치

| 지표 | 수치 | 의미 |
|---|---|---|
| 단일 익스플로잇 발견 비용 | ~$50 | "지나서 보면 그렇다(hindsight)"는 단서 포함 |
| 1,000회 캠페인 총 비용 | ~$20,000 | 주요 오픈소스 1개 프로젝트 단위 |
| Anthropic 직원 생산성 | 약 4배 향상 | Mythos 사용 시 |
| Cybench CTF | 100% 포화 | 인간 평가 벤치마크 한계 도달 |
| SWE-bench Pro | 77.8% (vs Opus 4.6의 53.4%) | 코드 추론 능력 |
| CyberGym 취약점 재현 | 83.1% (vs 66.6%) | 보안 도메인 재현성 |
| Firefox 147 익스플로잇 | 181건 (vs Opus 4.6의 2건) | 90배 증가 |

### 5.2 Checkmarx · Kiteworks · Barracuda의 시장 데이터

- **LLM이 작동 중인 CVE 익스플로잇을 10~15분, 약 $1에 생성**하는 사례 관측 (Checkmarx).
- 2028년에는 1분 이내로 단축될 것으로 전망.
- 평균 **취약점 발생부터 익스플로잇까지의 시간(time-to-exploit) = -7일** (CISA·Kiteworks 데이터). 즉 익스플로잇이 CVE 공개보다 7일 먼저 도는 시대.
- 평균 **중대 취약점 패치 완료 시간 = 74일.**
- eCrime 침투 후 lateral movement까지 **breakout time = 29분.**
- Barracuda CISO 분석: 향후 5년 내 **공격자가 수비자보다 더 많은 CVE를 먼저 발견**(55~72%)할 것으로 예측.

### 5.3 ZeroFox의 경고: 취약점 정보의 상품화

Mythos가 진짜로 바꾼 것은 *기술적 능력*이 아니라 **"전문가 팀 + 분기 단위 시간 + 막대한 인건비"가 필요했던 작업이 예산 한 줄짜리 항목으로 이동했다는 점**.

- 경쟁사 의존성 그래프 전체에 대한 "정찰 스캔(competitive intelligence scan)"이 ~$20K 단위로 가능.
- 익스플로잇 발견 후 **공급망 파트너가 발견을 무기화하지 않고 보유**하는 시나리오의 등장 (책임 공개 회피, 경쟁 압박 도구화).

---

## 6. 위협 영향 평가 (Threat Impact Assessment)

### 6.1 위협 시나리오 매트릭스

| 시나리오 | 가능성 | 영향도 | 우선 대응 |
|---|---|---|---|
| **S1.** 공격자가 LLM으로 한국 기업 의존성 그래프를 자동 스캔, 1~2년 묵은 결함 대량 발굴 | 매우 높음 | 매우 높음 | SBOM 의무화, 의존성 가시화 |
| **S2.** 국가지원 APT(GTG-1002, APT28 PROMPTSTEAL 등)가 Mythos급 모델을 작전 백본으로 사용 | 이미 발생 (Anthropic 공개) | 매우 높음 | 위협 헌팅, AI 행위 패턴 IOC |
| **S3.** AI가 코드 생성 시 학습 데이터의 안전하지 않은 패턴(예: 19년 전 RPCSEC_GSS 패턴)을 재주입 | 높음 | 중~높음 | AI 코딩 출력에 대한 SAST 강제 |
| **S4.** NVD가 enrichment를 중단(2026-04-14)한 상태에서 CVE 폭증, 우선순위 판단 불가 | 이미 발생 | 매우 높음 | EPSS, KEV 카탈로그 기반 우선순위 재설계 |
| **S5.** 한국 거래소·핀테크·웹3 인프라의 NFS·RPC·Kerberos 의존 컴포넌트에 동형 결함 잠재 | 중~높음 | 매우 높음 | RPCSEC_GSS·NFSv4 사용 자산 식별 및 패치 검증 |
| **S6.** AI가 발견한 취약점을 partner가 비공개 보유(stockpiling) | 중간 | 매우 높음 | 공급망 계약·공개 의무 조항 강화 |

### 6.2 한국 환경 특이 위험

| 도메인 | 위험 |
|---|---|
| **금융 / 거래소 / 코인 거래소** (DAXA, KoFIU 영역) | 장기간 패치되지 않은 NFS·RPC 인프라가 백오피스에 잔존할 가능성. AI 자동화 스캔에 노출되면 거래소 핫월렛·콜드월렛 분리 경계 침범 위험. |
| **K-콘텐츠 / 미디어 인프라** | FFmpeg 16년 묵은 H.264 결함과 유사 패턴이 K-콘텐츠 트랜스코딩 파이프라인에 잔존 가능성. |
| **공공·국방·연구기관** | NFSv4 + Kerberos 조합은 학술·연구·국방 환경에 광범위. CVE-2026-4747 직접 영향 가능권. |
| **AI 코딩 도입 기업 (vibe coding)** | LLM이 생성한 코드에 RPC·인증·암호 처리 결함이 재주입될 가능성. |
| **블록체인 / Web3 인프라** | 노드 RPC·검증자 통신·스테이블코인 발행 시스템에 RPC 패턴 결함이 재현될 위험. |

---

## 7. 방어 권고 (Defense Recommendations)

### 7.1 단기 조치 (0~30일)

1. **자산 인벤토리 — RPC·NFS·Kerberos 라인업 식별**
   - FreeBSD 13.x / 14.x 사용 자산 전수 조사.
   - MIT Kerberos 5 · `librpcsecgss` 사용 라이브러리 식별 (특히 NFSv4 운영 환경).
   - CVE-2026-4747 패치 적용 상태 검증.
2. **SBOM 강제 적용**
   - 공급망 전 구간에서 SBOM(Software Bill of Materials) 생성·갱신 의무화.
   - SPDX·CycloneDX 표준 채택, Sigstore 서명 검증.
3. **AI 코딩 출력에 대한 강제 검증 라인**
   - Cursor, Claude Code, Windsurf 등 AI IDE 출력에 대한 SAST(Semgrep, CodeQL) 자동 통과 미흡 시 머지 차단.
   - 특히 RPC·인증·암호·버퍼 처리 코드 경로에 대한 룰 강화.

### 7.2 중기 조치 (30~180일)

4. **위협 우선순위 체계 전환**
   - NVD enrichment 중단(2026-04-14)에 대응하여 **EPSS + CISA KEV + 자체 공격 표면** 기반 가중 우선순위 모델 구축.
   - CVSS 단독 의존 폐기.
5. **AI 자동화 스캔 가정 하의 Red Team 운영**
   - 외부 위협 모델에 "공격자가 ~$50/exploit으로 의존성 그래프 전체를 스캔한다"를 명시적 가정으로 반영.
   - 자체 제품 의존성에 대해 동일한 AI 도구로 사전 스캔 수행.
6. **데이터 계층 방어 강화 (Varonis 권고 참조)**
   - 익스플로잇이 fool-proof가 아닌 "blast radius 축소"가 핵심 — 과권한(over-privilege) 식별·축소.
   - 평균 dwell time(수 주)을 단축하기 위한 데이터 행위 모니터링.

### 7.3 장기 조치 (180일 이상)

7. **AI 출력 코드 패턴 거버넌스**
   - 사내 AI 코드 생성에 대한 "안전 패턴 화이트리스트" 적용.
   - 19년 묵은 결함이 재주입되지 않도록 학습 데이터 오염 모델링 도입.
8. **공급망 AI 발견 취약점 공개 의무화 계약 조항**
   - 협력사가 AI로 발견한 취약점을 stockpile하지 못하도록 NDA·MSA 조항 신설.
9. **AI Threat Intelligence 구독·자체 생산 체계 구축**
   - GTG-1002 / PROMPTSTEAL / Mythos급 AI 작전 IOC 수집 및 자체 룰 셋 생산.

---

## 8. 결론 (Bottom Line)

### Anthropic은 옳다, Rival Security도 옳다 — 다른 부분에서

| 질문 | Anthropic의 답 | Rival Security의 답 | 본 보고서의 결론 |
|---|---|---|---|
| Mythos는 진정한 신규 제로데이를 발견했는가? | 그렇다 | 적어도 CVE-2026-4747은 학습 데이터의 조합적 재발견에 가깝다 | **가장 상세히 공개된 사례에 한해, 조합적 재발견 가설이 더 설득력 있다** |
| 그래서 위협이 줄어드는가? | 줄지 않는다 | **오히려 다른 측면에서 더 위험하다** | 동의 — 비용 붕괴 + 학습 데이터 오염은 capability 진정성보다 더 광범위한 위협 |
| 방어자는 무엇을 해야 하는가? | 패치 가속, AppSec에 AI 통합 | 동일 + AI가 재주입하는 옛 패턴 차단, AI 출력에 대한 SAST 강제 | 양쪽 모두 + **취약점 발견 한계비용 = $50 가정의 위협 모델** |

### 핵심 메시지

> **AI가 새로운 취약점을 만든 것이 아니라, 오래된 취약점을 "찾는 비용"을 무너뜨렸다.**

- 19년 묵은 RPCSEC_GSS 결함이 FreeBSD 트리에서 발견된 것은 **"AI의 마법"이 아니라 "동일한 결함이 여러 트리에 복제되어 있다"**는 사실의 폭로다.
- 이는 모든 한국 기업의 의존성 그래프에 똑같이 적용된다 — 우리도 어느 트리에 무엇이 복제되어 있는지 모른다.
- 진짜 방어선은 패치 속도가 아니라 **"내가 가진 모든 코드 트리 사이의 패턴 동형성을 가시화하는 능력"**이다.
- 그리고 그 능력 자체가 이제 **공격자에게 ~$50/회로 제공**된다는 사실을 위협 모델에 즉시 반영해야 한다.

---

## 9. 참고 자료 (References)

| # | 출처 | 발행일 | 비고 |
|---|---|---|---|
| 1 | Rival Security, "Mythos 'Discovered' a CVE Already in Its Training Data" (Jake Feiglin) | 2026-05-05 | 본 보고서의 1차 분석 대상 |
| 2 | Anthropic Red Team, "Claude Mythos Preview" | 2026-04-07 | 원 발표 |
| 3 | NVD CVE-2007-3999 (svcauth_gss_validate stack-based buffer overflow) | 2007-09-05 | 학습 데이터의 원형 |
| 4 | NVD CVE-2007-4743 (CVE-2007-3999 패치 결함) | 2007-09-06 | 동일 패턴 보강 |
| 5 | Schapiro et al., "Combinatorial Creativity: A New Frontier in Generalization Abilities" (arXiv:2509.21043) | 2025 | 이론적 프레임 |
| 6 | VentureBeat, "Mythos Autonomously Exploited Vulnerabilities That Survived 27 Years" | 2026-04 | 종합 영향 분석 |
| 7 | ZeroFox, "The Claude Mythos Problem: AI Vulnerability Scanning Has Trust Issues" | 2026-04 | 경제학·공급망 분석 |
| 8 | Varonis, "The Map is Not the Territory: Anthropic Mythos and Data Security" | 2026-04 | Blast radius 관점 |
| 9 | Kiteworks, "What NIST's NVD Retreat and Claude Mythos Mean for Enterprise Data Security" | 2026-04 | NVD 위기 |
| 10 | Barracuda CISO, "How will Anthropic's Mythos change vulnerability discovery?" | 2026-05-06 | 5년 시나리오 모델 |
| 11 | Checkmarx, "Application Security Guide to Claude Mythos" | 2026-04 | 익스플로잇 생성 비용 |
| 12 | Cyderes, "Why the Mythos Release Should Be on Every Security Leader's Radar" | 2026-04 | 국가지원 APT 사례 (GTG-1002, PROMPTSTEAL) |
| 13 | RFC 2203 — RPCSEC_GSS Protocol Specification | 1997 | 표준 계보 |

---

**End of Report — CTI-2026-0510-MYTHOS-AI-VULN — TLP:GREEN**
