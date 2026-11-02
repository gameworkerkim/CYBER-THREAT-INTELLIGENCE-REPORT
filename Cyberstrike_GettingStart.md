# CyberStrike 한글 사용 매뉴얼

> **AI 기반 공격적 보안 하네스(Offensive Security Harness)** — 대상을 설명하면 도구 선택·에이전트 배치·취약점 테스트·보고서 작성을 자율 수행합니다. 본 매뉴얼은 **공식 문서(docs.cyberstrike.io, 한국어판 · v1.1.16)** 를 기준으로 문서입니다.

| 항목 | 값 |
| --- | --- |
| 공식 문서(한글) | https://docs.cyberstrike.io/ko/docs/getting-started/ |
| 저장소 | https://github.com/CyberStrikeus/CyberStrike |
| 버전 기준 | v1.1.16 |
| 라이선스 | AGPL-3.0-only |
| 커뮤니티 | https://discord.gg/dr97wVJVbn |

---

## 사용 전 반드시 읽을 것

> - CyberStrike는 **명시적·서면 허가를 받은 시스템**에만 사용합니다. 권한 없는 대상 테스트는 **불법**이며, 한국에서는 정보통신망법 위반에 해당할 수 있습니다.
> - **에이전트는 샌드박싱되지 않습니다.** 권한 시스템은 "실행 전 확인"을 돕는 UX 기능일 뿐, 보안 격리가 아닙니다. 실제 격리가 필요하면 **Docker 컨테이너 또는 VM 안에서 실행**하세요(공식 SECURITY.md 권고).
> - 자율 에이전트는 셸 실행·파일 조작 등 강력한 행위를 연쇄할 수 있습니다. **범위(scope)를 제한하고 실행을 모니터링**하세요.
> - 설치 스크립트(`curl … | bash`, `iwr … | iex`)는 **실행 전 내용을 검토**하세요.

남의 시스템을 침입할 경우 그 책임은 가볍지 않습니다.
---

## 목차

1. [CyberStrike란?](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#1-cyberstrike%EB%9E%80)
2. [시스템 요구 사항](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#2-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)
3. [설치](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#3-%EC%84%A4%EC%B9%98)
4. [AI 제공자 연결 및 인증](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#4-ai-%EC%A0%9C%EA%B3%B5%EC%9E%90-%EC%97%B0%EA%B2%B0-%EB%B0%8F-%EC%9D%B8%EC%A6%9D)
5. [첫 번째 평가 실행](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#5-%EC%B2%AB-%EB%B2%88%EC%A7%B8-%ED%8F%89%EA%B0%80-%EC%8B%A4%ED%96%89)
6. [하네스 구성 요소](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#6-%ED%95%98%EB%84%A4%EC%8A%A4-%EA%B5%AC%EC%84%B1-%EC%9A%94%EC%86%8C)
7. [에이전트 구조](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#7-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EA%B5%AC%EC%A1%B0)
8. [핵심 기능 — Vortex · HackBrowser · Bolt · MCP](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#8-%ED%95%B5%EC%8B%AC-%EA%B8%B0%EB%8A%A5--vortex--hackbrowser--bolt--mcp)
9. [구성(Configuration)](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#9-%EA%B5%AC%EC%84%B1configuration)
10. [주요 슬래시 명령](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#10-%EC%A3%BC%EC%9A%94-%EC%8A%AC%EB%9E%98%EC%8B%9C-%EB%AA%85%EB%A0%B9)
11. [키보드 단축키](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#11-%ED%82%A4%EB%B3%B4%EB%93%9C-%EB%8B%A8%EC%B6%95%ED%82%A4)
12. [실전 시나리오](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#12-%EC%8B%A4%EC%A0%84-%EC%8B%9C%EB%82%98%EB%A6%AC%EC%98%A4)
13. [트러블슈팅 & 팁](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#13-%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85--%ED%8C%81)
14. [안전 사용 가이드라인](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#14-%EC%95%88%EC%A0%84-%EC%82%AC%EC%9A%A9-%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8)
15. [레퍼런스](https://claude.ai/chat/c6dee16e-c109-40ab-a2a9-5a64a60673b8#15-%EB%A0%88%ED%8D%BC%EB%9F%B0%EC%8A%A4)

---

## 1. CyberStrike란?

CyberStrike는 **AI 펜테스터가 함께 일하는** 구조입니다. 웹 앱·API·네트워크 같은 대상을 설명하면, 하나의 **대화형 인터페이스**로 제어를 유지하는 동안 하네스가 크롤링·트래픽 분석·인젝션 테스트·권한 검사·결과 간 체인 발견 등 무거운 작업을 처리합니다.

내부적으로 다음을 결합합니다.

- **100개 이상**의 보안 도구
- **15개 이상**의 전문 에이전트
- OWASP WSTG 기반 **65개 이상**의 결정론적 테스트 스크립트
- 전용 엔진 4종: 웹 크롤링(**HackBrowser**), 트래픽 분석(**Vortex**), 컨테이너화 도구(**Bolt**), 외부 통합(**MCP**)

> 모델·제공자 선택지는 넓습니다(공식 문서 기준 **230개 이상 제공자 · 9,000개 이상 모델**). 기존 Claude/GPT/Copilot 구독을 그대로 쓰거나 로컬 모델로 완전 오프라인 구동도 가능합니다. 특히 제약이 풀린 오픈 웨이트 중국산 모델을 사용하면 더 효과적입니다.

[CyberStrike 설치 및 첫 실행](https://docs.cyberstrike.io/docs/images/gifs/g01-first-run.gif)

---

## 2. 시스템 요구 사항

| 요구 사항 | 최소 | 권장 |
| --- | --- | --- |
| 운영 체제 | macOS 12+, Ubuntu 20.04+, Windows 10+ | macOS 14+, Ubuntu 22.04+ |
| RAM | 4 GB | 8 GB |
| 디스크 공간 | 500 MB | 2 GB |
| Node.js | 18.0+ | 20.0+ |

> 격리 실행을 권장하므로, 실제로는 전용 VM/호스트에 위 사양을 확보하는 것이 안전합니다.

---

## 3. 설치

### 3.1 npm (권장)

```bash
# 1) 설치
npm install -g @cyberstrike-io/cyberstrike@latest

# 2) 설치 확인
cyberstrike --version
```

[설치 후 Cyberstrike TUI](https://docs.cyberstrike.io/docs/images/screenshots/s01-installation.png)

### 3.2 curl (Linux / macOS)

```bash
curl -fsSL https://cyberstrike.io/install | bash
```

### 3.3 iwr (Windows / PowerShell)

```powershell
iwr -useb https://cyberstrike.io/install.ps1 | iex
```

> **주의** — 스크립트는 실행 전 반드시 검토하세요. 설치 스크립트는 저장소(github.com/CyberStrikeus/CyberStrike)에서 확인할 수 있습니다.

### 3.4 아직 제공되지 않는 방식 (출시 예정)

| 방식 | 상태 |
| --- | --- |
| Bun | 출시 예정 |
| Homebrew (macOS) | 출시 예정 |
| Docker 이미지 | 출시 예정 (현재는 npm 또는 curl 사용) |

> 일부 외부 글/README에는 `brew install …` 또는 `scoop install cyberstrike`가 보일 수 있으나, **공식 문서(v1.1.16) 기준으로는 아직 정식 제공되지 않습니다.** 설치는 npm / curl / iwr을 사용하세요.

---

## 4. AI 제공자 연결 및 인증

CyberStrike는 작동에 **AI 제공자**가 반드시 필요합니다.

### 4.1 지원 제공자

| 제공자 | 무료 티어 | 인증 방법 |
| --- | --- | --- |
| GitHub Copilot | 구독 포함 | OAuth (API 키 불필요) |
| OpenRouter | 예 | API 키 |
| Anthropic | 아니요 | API 키 |
| OpenAI | 아니요 | API 키 |
| Google Gemini | 예 | API 키 |
| Ollama | 예 (로컬) | 없음 |

> **무료로 시작하기** — GitHub Copilot(구독 보유 시), OpenRouter, Google Gemini, 또는 완전 로컬인 Ollama를 쓰면 별도 API 비용 없이 시작할 수 있습니다.

[Cyberstrike 인증 로그인 흐름](https://docs.cyberstrike.io/docs/images/gifs/g02-auth-login.gif)

### 4.2 인증 설정 (`/connect`)

```text
# TUI 안에서 실행
/connect
```

1. 목록에서 제공자를 선택합니다.
2. API 키를 입력합니다. (GitHub Copilot은 OAuth로 인증)
3. 모델은 언제든 변경할 수 있습니다.

```text
/models
```

[Cyberstrike 모델 선택 대화상자](https://docs.cyberstrike.io/docs/images/screenshots/s02-auth.jpg)

### 4.3 환경 변수로 설정 (선택)

```bash
# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
# OpenAI
export OPENAI_API_KEY="sk-..."
# Google
export GOOGLE_GENERATIVE_AI_API_KEY="AI..."
# OpenRouter
export OPENROUTER_API_KEY="sk-or-..."
```

> 영구 적용하려면 쉘 프로필(`~/.bashrc`, `~/.zshrc`)에 추가하세요.

---

## 5. 첫 번째 평가 실행

### 5.1 실행

```bash
cyberstrike
```

입력 프롬프트 · 응답 영역 · 상태 표시줄로 구성된 TUI가 나타납니다.

[Cyberstrike TUI 메인 인터페이스](https://docs.cyberstrike.io/docs/images/screenshots/s03-tui-main.png)

### 5.2 대상 설명

작업을 자연어로 직접 입력하면 하네스가 무엇을 실행할지 결정합니다. **반드시 본인이 소유하거나 허가받은 대상**이어야 합니다.

```text
> Test https://app.example.com for OWASP Top 10 vulnerabilities
```

### 5.3 내부 동작 (파이프라인 8단계)

1. `cyberstrike` **기본 에이전트**가 목표를 읽습니다.
2. `/hackbrowser`가 실행되어 대상을 크롤링하고 HTTP 트래픽을 캡처합니다.
3. **Vortex**가 각 요청을 처리합니다 — 규칙 적용, 이상 징후 표시.
4. `wstg-agent`가 요청 신호에 따라 전문 에이전트를 배치합니다.
5. **13개 WSTG 전문가**가 인젝션·인증 우회·IDOR·세션 결함·암호화 문제 등을 테스트합니다.
6. `escalation-hunter`가 발견 사항을 연결해 **복합 취약점**을 탐지합니다.
7. `triage` 에이전트가 HTTP 증거를 재생하여 각 발견을 **독립 검증**합니다.
8. **증거·심각도·해결 방안**이 포함된 분류된 발견 사항을 받습니다.

---

## 6. 하네스 구성 요소

| 레이어 | 내용 |
| --- | --- |
| **에이전트** | 15개 이상 — WSTG 파이프라인, 분류(triage), 에스컬레이션, general, explore |
| **도구** | 100개 이상 내장 — HTTP 재생, 인젝션 프로브, 접근 프로브, 정찰, 코드 검색 |
| **스킬** | 65개 이상 결정론적 WSTG 테스트 스크립트(런타임 로드) |
| **Vortex** | DSL 쿼리·규칙 매칭·신호 상관관계 기반 HTTP 트래픽 엔진 |
| **HackBrowser** | UI 컨텍스트 캡처가 가능한 AI 기반 Chromium 크롤러 |
| **Bolt** | 30개 이상 컨테이너화 보안 도구 (nmap, nuclei, sqlmap, hydra 등) |
| **MCP** | 내장 3종(github-security, cve, osint) + 커스텀 MCP 서버 |

> 사용자는 **하나의 프롬프트**로만 상호작용하고, 나머지는 하네스가 조율합니다.

---

## 7. 에이전트 구조

| 에이전트 | 역할 |
| --- | --- |
| `cyberstrike` | 기본(primary) 에이전트 — 목표 해석, 전체 오케스트레이션 |
| `general` | 범용 작업 처리 |
| `explore` | 탐색·정찰 중심 |
| `wstg-agent` | 요청 신호에 따라 **13개 WSTG 전문가**를 배치하는 디스패처 |
| `triage` | HTTP 증거 재생으로 발견 사항을 독립 검증 |
| `escalation-hunter` | 개별 결과를 연결해 복합·연쇄 취약점 탐지 |
| 커스텀 에이전트 | 사용자 정의 에이전트 추가 가능 |

- 에이전트 전환은 TUI에서 `Tab` 키.
- 엔드투엔드 평가 워크플로우는 **Agentic Pipelines**(Web, Cloud)로 제공됩니다 — https://docs.cyberstrike.io/docs/pipelines/

---

## 8. 핵심 기능 — Vortex · HackBrowser · Bolt · MCP

| 기능 | 설명 | 문서 |
| --- | --- | --- |
| **Vortex** | HTTP 트래픽 엔진. DSL 쿼리로 요청을 질의하고 규칙 매칭·신호 상관관계로 이상 징후를 상관 분석 | [문서](https://docs.cyberstrike.io/ko/docs/features/vortex/) |
| **HackBrowser** | 내장 Chromium 크롤러. 수동/자율 모드로 실제 HTTP 트래픽을 캡처해 프록시 파이프라인으로 전달 | [문서](https://docs.cyberstrike.io/ko/docs/features/hackbrowser/) |
| **Bolt** | 원격 서버에서 컨테이너화 도구(nmap/nuclei/sqlmap/hydra 등 30+) 실행. Ed25519 키 페어링 | [문서](https://docs.cyberstrike.io/ko/docs/features/bolt/) |
| **MCP** | github-security·cve·osint 내장 서버 + 커스텀 MCP 서버 연결로 기능 확장 | [문서](https://docs.cyberstrike.io/ko/docs/features/mcp/) |

---

## 9. 구성(Configuration)

프로젝트 디렉터리에 `cyberstrike.json`을 만들어 기본값을 지정합니다.

```json
{
  "$schema": "https://cyberstrike.io/config.json",
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

해당 디렉터리에서 `cyberstrike`를 실행하면 이 설정이 자동 로드됩니다. TUI에서 `/models`로 모델을 바로 바꿀 수도 있습니다.

### 구성 계층 (우선순위 높은 순)

1. 환경 변수 (최우선)
2. 프로젝트 구성 `cyberstrike.json`
3. 사용자 구성 `~/.config/cyberstrike/cyberstrike.json`
4. 기본값 (최하위)

> 자세한 옵션: https://docs.cyberstrike.io/ko/docs/configuration/

---

## 10. 주요 슬래시 명령

| 명령 | 동작 |
| --- | --- |
| `/connect` | AI 제공자 연결 |
| `/models` | 모델 변경 |
| `/hackbrowser` | 자율 웹 크롤러 시작 |
| `/bolt` | Bolt 보안 도구 서버 관리 |
| `/mcps` | MCP 서버 관리 |
| `/vulnerabilities` | 발견 사항 검토 |
| `/web` | 캡처된 웹 트래픽 검사 |
| `/report` | 보고서 생성 |
| `/help` | 모든 명령 표시 |

---

## 11. 키보드 단축키

| 단축키 | 동작 |
| --- | --- |
| `Enter` | 메시지 전송 |
| `Shift+Enter` | 줄 바꿈 |
| `Escape` | 실행 중인 세션 중단 |
| `Ctrl+P` | 명령 목록 |
| `Tab` | 다음 에이전트 |
| `Ctrl+D` | CyberStrike 종료 |
| `↑` / `↓` | 입력 기록 탐색 |

> 전체 레퍼런스: https://docs.cyberstrike.io/ko/docs/getting-started/keyboard-shortcuts/

---

## 12. 실전 시나리오

> 모든 예시의 대상은 **본인 소유 또는 서면 허가를 받은 시스템**이어야 합니다.

### 12.1 웹 애플리케이션 OWASP 평가 (TUI)

```text
cyberstrike
> Test https://staging.example.com for OWASP Top 10 vulnerabilities
```

하네스가 크롤링 → Vortex 분석 → WSTG 전문가 배치 → triage 검증까지 자율 수행합니다. 완료 후:

```text
/vulnerabilities     # 발견 사항 확인
/report              # 보고서 생성
```

### 12.2 HackBrowser로 인증 트래픽 캡처

```text
/hackbrowser
```

- **수동 모드** — 여러 계정으로 직접 로그인·탐색 → 클릭 뒤의 실제 API 트래픽 캡처
- **자율 모드** — 다중 계정 자격증명·범위 제공 → 자동 크롤링·역할별 트래픽 차이 매핑

캡처된 트래픽은 Vortex와 접근 프로브로 전달되어 IDOR·인가 우회 등을 검증합니다.

### 12.3 무료 / 오프라인(에어갭) 셋업

민감 환경에서는 로컬 모델로 완전 오프라인 구동을 권장합니다.

```text
/connect        # 목록에서 Ollama 선택 (API 키 불필요)
```

이 경우 데이터가 로컬을 벗어나지 않습니다.

### 12.4 원격 도구 분산 실행 (Bolt)

무거운 스캔(nmap/nuclei/sqlmap 등)을 대역폭 좋은 원격 서버에서 돌리고 결과만 로컬 TUI로 받습니다.

```text
/bolt           # Bolt 서버 추가·관리 (Ed25519 페어링)
```

### 12.5 CLI / CI 활용

비대화형 실행·자동화는 CLI 문서를 참고하세요: https://docs.cyberstrike.io/ko/docs/usage/cli/

---

## 13. 트러블슈팅 & 팁

| 증상 | 점검 |
| --- | --- |
| 설치 직후 명령이 안 먹힘 | `cyberstrike --version`으로 설치 확인, Node.js 18+ 여부 확인 |
| "AI 제공자 필요" 오류 | `/connect`로 제공자 연결 또는 환경 변수(`ANTHROPIC_API_KEY` 등) 설정 |
| 비용 부담 | GitHub Copilot·OpenRouter·Gemini 무료 티어, 또는 로컬 Ollama 사용 |
| 모델을 바꾸고 싶음 | TUI에서 `/models`, 또는 `cyberstrike.json`의 `model` 값 수정 |
| 민감 데이터 유출 우려 | Ollama/LM Studio로 오프라인 구동 |
| 세션이 폭주함 | `Escape`로 중단, 범위(scope)를 좁혀 재실행 |
| 격리 실행 | Docker/VM 안에서 구동(공식 권고) |

---

## 14. 안전 사용 가이드라인

1. **인가 먼저** — 서면 범위(scope)·테스트 규칙(RoE) 확보 후에만 실행.
2. **격리 환경** — 샌드박싱이 없으므로 Docker/VM/전용 호스트에서 실행.
3. **범위 강제** — 대상 도메인/네트워크를 명시적으로 제한, 내부망은 인가된 랩으로 한정.
4. **행위 모니터링** — 자율 실행 중 셸·네트워크 행위를 로깅·감시, 이상 시 `Escape`.
5. **데이터 보호** — 민감 대상은 로컬 모델로 오프라인 구동.
6. **공급망 검증** — 설치 스크립트·MCP 서버·플러그인 출처·무결성 확인.
7. **법령 준수** — 정보통신망법 등 관련 법규 준수, 불확실하면 실행하지 않음.

---

## 15. 레퍼런스

**공식 문서 (한국어)**

- 시작하기 — https://docs.cyberstrike.io/ko/docs/getting-started/
- 설치 — https://docs.cyberstrike.io/ko/docs/getting-started/installation/
- 인증 — https://docs.cyberstrike.io/ko/docs/getting-started/authentication/
- 첫 평가 — https://docs.cyberstrike.io/ko/docs/getting-started/first-scan/
- 키보드 단축키 — https://docs.cyberstrike.io/ko/docs/getting-started/keyboard-shortcuts/
- 사용법(TUI/CLI/Web) — https://docs.cyberstrike.io/ko/docs/usage/
- 기능(Vortex/HackBrowser/Bolt/MCP) — https://docs.cyberstrike.io/ko/docs/features/
- 에이전트 — https://docs.cyberstrike.io/ko/docs/agents/
- 파이프라인 — https://docs.cyberstrike.io/ko/docs/pipelines/
- 구성 — https://docs.cyberstrike.io/ko/docs/configuration/

**프로젝트 · 커뮤니티**

- 저장소 — https://github.com/CyberStrikeus/CyberStrike
- 보안 정책(SECURITY.md) — https://github.com/CyberStrikeus/CyberStrike/blob/main/SECURITY.md
- 라이선스(AGPL-3.0) — https://github.com/CyberStrikeus/CyberStrike/blob/main/LICENSE
- Discord — https://discord.gg/dr97wVJVbn
- 릴리스/체인지로그 — https://github.com/CyberStrikeus/CyberStrike/releases

**참고 표준**

- OWASP WSTG — https://owasp.org/www-project-web-security-testing-guide/
- MITRE ATT&CK — https://attack.mitre.org/
- CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks

---

> 주의: 본 문서의 스크린샷/GIF는 공식 문서(docs.cyberstrike.io) 자산을 인용한 것으로, 원본 경로가 변경되면 표시되지 않을 수 있습니다. 오프라인 배포 시에는 해당 이미지를 직접 내려받아 로컬 경로로 교체하세요.
>
> **최종 고지** — 본 매뉴얼은 인가된 보안 테스트·연구·교육 목적의 참고 자료입니다. CyberStrike는 명시적 서면 허가를 받은 시스템에만 사용해야 하며, 무단 사용은 불법입니다.
