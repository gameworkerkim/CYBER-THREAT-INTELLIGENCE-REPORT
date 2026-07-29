| id             | CTI-2026-0729-CODEX-OPEN-SECURITY                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| title          | Codex Open Security — OpenAI Codex Security의 오픈웨이트 전환 분석 및 포팅 보고서                                                          |
| subtitle       | GPT-5.6 → DeepSeek V4/Kimi K3/Qwen: 폐쇄형 보안 스캐너를 오픈웨이트로 전환할 때의 아키텍처 결정과 위협 모델 변화                                |
| author         | Dennis Kim / HoKwang Kim                                                                                        |
| email          | gameworker@gmail.com                                                                                             |
| github         | gameworkerkim                                                                                                    |
| date           | 2026-07-29                                                                                                       |
| updated        | 2026-07-29 (v1.0)                                                                                                |
| classification | TLP:GREEN                                                                                                        |
| severity       | INFO                                                                                                             |
| lang           | ko                                                                                                               |
| tags           | Open-Source · Code-Scanning · DevSecOps · Open-Weight · DeepSeek · Kimi-K3 · Qwen · Supply-Chain · AI-Security |
| threat_actors  | 없음 (오픈웨이트 전환 기술 분석)                                                                          |
| frameworks     | MITRE ATT&CK · CWE-798 · NIST SP 800-53 SA-11 · OWASP Top 10      |
| license        | CC BY-NC-SA 4.0                                                                                                  |

# Codex Open Security — OpenAI Codex Security의 오픈웨이트 전환 분석 및 포팅 보고서

> **리포트 ID** `CTI-2026-0729-CODEX-OPEN-SECURITY` · **발행일** 2026-07-29 · **분류** `TLP:GREEN`
> **저자** Dennis Kim / HoKwang Kim · gameworker@gmail.com · [@gameworkerkim](https://github.com/gameworkerkim)

*GPT-5.6 → DeepSeek V4/Kimi K3/Qwen: 폐쇄형 보안 스캐너를 오픈웨이트로 전환할 때의 아키텍처 결정과 위협 모델 변화*

---

## 1. 배경

2026년 7월, OpenAI는 `@openai/codex-security`를 공개했다. 이는 GPT-5.6 계열 모델을 백엔드로 사용하는 CLI + TypeScript SDK 기반의 코드 보안 취약점 스캐너다. 그러나 이 도구는 `@openai/codex`라는 **폐쇄형 Rust 바이너리**에 의존하며, API 엔드포인트와 모델 선택이 하드코딩되어 있다.

Vibe Quant Insight #001에서 분석한 바와 같이, 2026년 7월 현재 DeepSeek V4, Kimi K3, Qwen3 등 오픈웨이트 모델이 프론티어 성능에 도달했으며, 코드 분석 태스크에서도 폐쇄형 모델과 동등하거나 우수한 성능을 보인다.

이 보고서는 OpenAI Codex Security를 오픈웨이트 모델로 전환(`@gameworkerkim/codex-open-security`)하는 과정의 기술적 분석, 아키텍처 결정, 그리고 남은 과제를 문서화한다.

---

## 2. 원본 아키텍처 분석 — `@openai/codex-security`

### 2.1 의존성 체인

```
codex-security CLI (Node.js)
  ├── @openai/codex-sdk (TypeScript wrapper)
  │     └── @openai/codex (Rust binary, closed-source)
  │           ├── Multi-agent orchestration
  │           ├── Plugin marketplace
  │           └── Direct OpenAI API calls (hardcoded endpoint)
  └── _bundled_plugin/ (Python security scanning skills)
```

### 2.2 폐쇄형 의존성이 만드는 위험

| 위험 | 설명 |
|------|------|
| **API 종속성** | OpenAI API 장애 시 전체 파이프라인 중단 |
| **공급망 단일 장애점** | `@openai/codex` 바이너리 하나가 모든 보안 스캔의 유일 통로 |
| **검증 불가능성** | Rust 바이너리의 내부 로직 감사 불가 |
| **비용 예측 불가** | GPT-5.6 계열의 가격 정책이 벤더에 의해 일방적으로 결정됨 |
| **수출 통제 리스크** | API 접근이 규제 대상이 될 경우 모든 CI 파이프라인이 영향을 받음 |

### 2.3 포팅 시 핵심 도전 과제

| 컴포넌트 | 원본 | 포팅 접근법 |
|----------|------|-------------|
| 모델 호출 | `@openai/codex` Rust 바이너리 | `openai` npm SDK → DeepSeek/Kimi/Qwen API |
| 인증 | ChatGPT OAuth + API Key | API Key only (환경변수) |
| 비용 추적 | 세션 JSONL 파일 파싱 | Provider-native pricing 반영 |
| 멀티에이전트 | `features.multi_agent_v2` | 미지원 (단일 모델 배치 처리) |
| 플러그인 | Python `_bundled_plugin/` | 프롬프트 엔지니어링 기반 |
| 구조화 출력 | `response_format: { type: "json_object" }` | OpenAI 호환 포맷 사용 |
| 스캔 이력 | `~/.codex/sessions/` local DB | 미구현 (향후 추가) |

---

## 3. 포팅된 아키텍처 — `@gameworkerkim/codex-open-security`

### 3.1 의존성 그래프

```
codex-open-security CLI (Node.js, TypeScript)
  ├── openai npm SDK
  │     └── OpenAI-compatible REST API
  │           ├── DeepSeek (api.deepseek.com)
  │           ├── Kimi K3 (api.moonshot.cn)
  │           └── Qwen (dashscope-intl.aliyuncs.com)
  ├── Commander (CLI framework)
  └── Zero native dependencies
```

### 3.2 설계 원칙

1. **Zero native binary dependency** — 순수 TypeScript + npm만으로 동작
2. **Provider abstraction** — `providers.ts`에서 제공자 설정을 중앙 관리
3. **OpenAI-compatible protocol** — OpenAI SDK가 지원하는 모든 호환 API를 provider 추가만으로 지원
4. **Batch-based scan** — 단일 모델 호출로 5개 파일씩 배치 처리

### 3.3 모델 선택 매트릭스

| 사용 사례 | 추천 모델 | 이유 |
|-----------|-----------|------|
| **일반 코드 보안 스캔** | DeepSeek V4 (`deepseek-chat`) | 가성비 최상 ($0.27/1M input), SWE-bench 80.6 |
| **딥 다이브 분석** | DeepSeek V4-Pro (`deepseek-reasoner`) | Chain-of-thought 추론, 복잡한 취약점 패턴 탐지 |
| **프론트엔드 코드** | Kimi K3 (`kimi-k3`) | Frontend Code Arena 1위, JSX/TSX 분석 특화 |
| **멀티랭귀지 대량 스캔** | Qwen3-Max (`qwen-max`) | 다국어 취약점 패턴 인식 우수 |
| **CI 통합 (비용 제약)** | Qwen3-Plus (`qwen-plus`) | $0.80/1M input, 대량 스캔에 적합 |

---

## 4. CTI 함의 — 오픈웨이트 보안 도구의 등장

### 4.1 위협 모델의 변화

이 포크가 단순한 "무료 대체제" 이상인 이유는 세 가지다:

1. **검증 가능한 보안 도구** — 폐쇄형 바이너리가 없는 구조는 도구 자체의 공급망 공격 표면을 줄인다. `@openai/codex` Rust 바이너리를 신뢰해야 하는 원본과 달리, 이 포크는 모든 코드가 감사 가능하다.

2. **다중 제공자 리던던시** — 단일 LLM 제공자의 장애나 정책 변경이 전체 보안 스캔 파이프라인을 중단시키지 않는다. DeepSeek 장애 → Kimi K3 fallback, Kimi K3 비용 급등 → Qwen으로 전환.

3. **온프렘 전환 경로** — API 기반이지만, DeepSeek V4와 Qwen3의 오픈웨이트 가중치를 자체 GPU 클러스터에 배포하면 완전한 오프라인 보안 스캔이 가능하다. 이는 망분리 환경(금융·국방)에서 결정적 차이를 만든다.

### 4.2 공격자 관점

오픈웨이트 모델 기반 보안 도구의 확산은 공격자에게도 동일한 기능을 제공한다:

- 악성코드 개발자가 Kimi K3로 자신의 코드를 보안 스캔 → 탐지 회피 최적화
- LLM 보조 리버스 엔지니어링(한화비전 사례 참조)의 경제성이 더욱 개선됨

이는 보안 도구의 민주화가 **공격과 방어 양측에 대칭적으로 적용된다**는 점을 재확인한다.

---

## 5. 남은 과제

| 과제 | 심각도 | 비고 |
|------|--------|------|
| Python 플러그인 미지원 | Medium | 원본의 `_bundled_plugin/` (Python security skills) 없음 |
| 멀티에이전트 미지원 | Low | 단일 모델로도 충분한 정확도 확보 가능 |
| 스캔 이력 관리 | Low | `scans list/show/rerun/compare` 미구현 |
| CSV 벌크 스캔 | Low | 다수 레포지토리 일괄 스캔 미지원 |
| 비용 추적 UI | Low | Provider-native pricing만 제공 |
| 응답 포맷 호환성 | Medium | 일부 모델(Kimi K3)에서 JSON structured output 미지원 가능성 |

---

## 6. 결론

OpenAI Codex Security의 오픈웨이트 전환은 기술적으로 실행 가능하며, DeepSeek V4와 Kimi K3의 현재 벤치마크 성능을 고려할 때 실무에서 충분한 정확도를 기대할 수 있다.

핵심 제약은 `@openai/codex` Rust 바이너리가 제공하는 멀티에이전트 오케스트레이션과 Python 플러그인 시스템의 부재다. 그러나 단일 모델 + 프롬프트 엔지니어링만으로도 OWASP Top 10 및 CWE Top 25 수준의 취약점 탐지에는 충분한 정확도를 확보할 수 있다.

오픈웨이트 진영이 프론티어 성능에 도달한 현 시점에서, 보안 도구의 오픈웨이트 전환은 더 이상 "가능한가"의 문제가 아니라 "얼마나 빨리"의 문제다.

---

## 변경 이력

| 버전 | 일자       | 내용                                                          |
| ---- | ---------- | ------------------------------------------------------------- |
| v1.0 | 2026-07-29 | 최초 발행 — OpenAI Codex Security 분석 및 오픈웨이트 포팅 보고 |

---

**© 2026 Dennis Kim (김호광) · Cyber Threat Intelligence Division** gameworker@gmail.com · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*본 리포트는 교육·연구 목적의 기술 분석입니다. TLP:GREEN — 커뮤니티 내 공유 가능.*
