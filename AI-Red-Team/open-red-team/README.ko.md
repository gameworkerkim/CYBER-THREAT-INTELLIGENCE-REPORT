# Open AI Red Team

**모델 비종속 공격적 보안 스킬셋 + 미들웨어 — Claude Red의 대체 및 확장, DeepSeek·GLM·오픈웨이트 모델용**

[claude-red](https://github.com/SnailSploit/Claude-Red) 스킬 라이브러리(MIT)를 전면 포팅하여 Claude 종속을 해소한 프로젝트입니다.
동일한 레드팀 스킬이 DeepSeek, GLM(즈푸), 오픈웨이트 모델(Ollama / vLLM / LM Studio)에서 동작하며,
클라우드·온프레미스·완전 오프라인(에어갭) 환경을 모두 지원합니다.

**문서 언어:** [English](README.md)(기준) · 한국어(본 문서) · [日本語](README.ja.md) · [中文](README.zh.md)

## 목적 — Claude Red의 대체 및 확장

| Claude Red (원본) | Open AI Red Team (본 프로젝트) |
|-------------------|------------------------------|
| Claude 전용 스킬 (Claude 스킬 시스템용 `SKILL.md`) | 모델 비종속 스킬: **DeepSeek, GLM, 오픈웨이트**에서 동일 방법론 사용 |
| Anthropic API 종속 (데이터가 외부로 유출) | **온프레미스/에어갭 운영** — 내부 데이터가 조직 밖으로 나가지 않음 |
| 벤더 가격·데이터 보존 정책 적용 | **비용 절감** — 오픈웨이트 모델(토큰당 비용 0원) 및 저비용 API |
| Claude 네이티브 스킬 시스템에 고정 | **확장** — 트리거 엔진, 한·영 트리거, 명시적 로딩, 완전한 CLI |

## 명시적 기능

- **포팅된 스킬 79개, 23개 카테고리** — claude-red 전체: Web, Infrastructure & Red Team,
  API Security, Cloud, AI Security, Active Directory, Wireless, Exploit Development, Fuzzing 등
- **Red Team을 위한 LLM 확장** — Claude Skills의 progressive disclosure와 트리거 기반 온디맨드 로딩을
  모든 OpenAI 호환 모델에 재현
- **Provider 추상화** — DeepSeek, GLM(즈푸), 오픈웨이트(Ollama/vLLM/LM Studio/llama.cpp) 단일 인터페이스
- **트리거 엔진** — 키워드·정규식 매칭 + 스코어링, 한글·영문 트리거 키워드
- **명시적 제어** — `/use <skill>`, `--skills` 플래그, 자동 로딩 on/off, 스킬 인덱스 on/off
- **CLI + 라이브러리** — 대화형 `ort chat`, 1회성 `ort ask`, 스킬 조회, TypeScript API
- **웹 대시보드** — 브라우저 기반 관리 콘솔 (스트리밍 채팅, 스킬 브라우저, JSONL 감사 추적,
  마스킹된 설정) — 다중 운영자·감사 운영, CDN 없이 에어갭 네트워크 동작
- **컨텍스트 예산 엔진** — 모델별 토큰 한도 + 섹션 단위 스킬 트랜케이션, 대형 스킬 `index_only`
  (컨텍스트 오버플로 방지)
- **안전장치** — 신고된 임무 스코프(`ORT_SCOPE`/`ORT_SCOPE_DOMAINS`)와 범위 밖 대상 플래깅,
  운영자 귀속 감사 기록
- **컴플라이언스 연동** — Prometheus `/metrics`, OIDC(Keycloak) API 인증, LangFuse 트레이싱
- **다국어 문서** — 영어(기준), 한국어, 일본어, 중국어
- **온프레미스 지원** — 로컬 모델로 민감한 대상 정보를 내부 환경에 유지

## 스크린샷

| 대시보드 — Chat | 대시보드 — Skills |
|-----------------|-------------------|
| ![Chat 탭](assets/screenshots/dashboard-chat.png) | ![Skills 탭](assets/screenshots/dashboard-skills.png) |
| **대시보드 — Audit** | **대시보드 — Config** |
| ![Audit 탭](assets/screenshots/dashboard-audit.png) | ![Config 탭](assets/screenshots/dashboard-config.png) |

## 구성 요소

| 디렉토리 | 내용 |
|----------|------|
| `skills/` | 포팅된 스킬 (모델 비종속 `SKILL.md`) — 트리거 기반 온디맨드 로딩 |
| `src/` | 미들웨어 — Provider 추상화(OpenAI 호환), 스킬 로더, 트리거 엔진, CLI |
| `docs/` | 아키텍처, 사용 매뉴얼, 포팅 가이드, 모델 매트릭스, 로드맵 |
| `scripts/` | 스킬 동기화/변환 도구 |

## 포팅 현황 — claude-red 전체 (79개 스킬, 23개 카테고리)

| 카테고리 | 스킬 수 | 카테고리 | 스킬 수 |
|----------|-------:|----------|-------:|
| Web Application | 16 | Fuzzing & Vuln Research | 4 |
| Infrastructure & Red Team | 7 | Reconnaissance | 2 |
| API Security | 2 | Container & Kubernetes | 2 |
| Cloud | 1 | CI/CD & Pipeline | 2 |
| AI Security | 1 | Cryptography | 2 |
| Active Directory | 2 | Privilege Escalation | 2 |
| Auth & Identity | 2 | Post-Exploitation | 3 |
| Wireless | 14 | Forensics & C2 | 2 |
| Mobile | 1 | Supply Chain | 2 |
| IoT & Embedded | 1 | Social Engineering | 2 |
| Exploit Development | 6 | Network Attacks | 1 |
| Utility | 2 | **합계** | **79** |

## 빠른 시작

```bash
npm install
npm run build
cp .env.example .env   # API 키 설정
node dist/src/cli.js chat          # 대화형 세션 (또는: npm i -g . → ort chat)
node dist/src/cli.js dashboard     # 웹 대시보드 (http://localhost:8081)
npm test                           # 테스트 실행
```

### 지원 프로바이더

| 프로바이더 | 엔드포인트 | 모델 예시 |
|-----------|-----------|----------|
| `deepseek` | `https://api.deepseek.com/v1` (OpenAI 호환) | `deepseek-chat`, `deepseek-reasoner` |
| `glm` | `https://open.bigmodel.cn/api/paas/v4` (OpenAI 호환) | `glm-4-plus`, `glm-4-flash` |
| `openweight` | Ollama/vLLM/LM Studio (OpenAI 호환 `/v1`) | `qwen2.5:32b`, `deepseek-r1:32b` |

## 사용법

### CLI

```bash
npx ort chat --provider deepseek --model deepseek-chat   # 대화형, 스킬 자동 로딩
npx ort chat --skills offensive-sqli --provider glm      # 스킬 강제 로딩
npx ort skills list                                      # 스킬 목록
npx ort skills show offensive-sqli                       # 스킬 본문 출력
npx ort ask "이 로그인 폼에서 SQLi 테스트 방법" --provider deepseek  # 1회성 질의
npx ort dashboard                                        # 웹 대시보드 (http://localhost:8081)
```

### 라이브러리

```typescript
import { OpenRedTeam } from "open-red-team";

const ort = new OpenRedTeam({
  provider: "deepseek",
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  skillsDir: "./skills",
});

const reply = await ort.chat("SQL 인젝션 테스트 방법을 알려줘");
console.log(reply);
```

## 활용처

### 공공기관 · 금융기관 — 컴플라이언스 기반

- 규제 프레임워크(ISMS-P, 금융보안규정, PCI-DSS, NIST 등)에 대응하는 내부 레드팀 훈련·자체 점검을
  **내부 시스템 정보를 해외 클라우드 API로 전송하지 않고** 수행
- 엄격한 데이터 거버넌스 하의 전자정부·금융 서비스 보안 검토

### 기업 — 사내 보안 운영

- 보안팀 교육, CTF 대비, 허가된 침투 테스트 계획 수립, 일상적 취약점 트리아지에 운영자급 방법론 제공
- 온프레미스 운영으로 사내 아키텍처·소스코드·대상 정보가 회사 내부에 유지

### Red Team을 위한 LLM 확장

- 모든 OpenAI 호환 모델을 컨텍스트 인지형 레드팀 운영자로 변환:
  스킬 인덱스 + 온디맨드 방법론 주입 + 대화 히스토리
- 민감한 임무는 로컬 모델, 대량 작업은 클라우드 API로 유연하게 분리 운영

## 비용 절감 및 내부 정보 보호

### 비용 절감

| 선택지 | 토큰당 비용 | 비고 |
|--------|-------------|------|
| Claude (원본) | 최고가 수준 | 스킬이 Claude 전용이었음 |
| DeepSeek / GLM API | 저비용 API | 동일한 스킬 콘텐츠, 훨씬 낮은 비용 |
| 오픈웨이트 (Ollama/vLLM) | **추가 비용 0원** | 보유 GPU/하드웨어에서 실행 |

### 공공기관 · 금융기관 · 기업 내부 정보 보호

- `openweight` 프로바이더 사용 시 **데이터가 조직 밖으로 나가지 않음** — 대상 정보, 발견 사항, 방법론이
  온프레미스 또는 에어갭 환경에 유지
- 프롬프트·보안 발견 사항의 제3자 보존 없음
- 기업 환경 친화적 — 프록시 환경, 격리 네트워크, 오프라인 랩에서 동작

## 동작 원리

1. **스킬 인덱스 주입** — 모든 스킬의 `name` + `description`을 시스템 프롬프트에 주입 (Claude Skills의 progressive disclosure 재현, 컨텍스트 비용 최소화)
2. **트리거 매칭** — 사용자 입력을 각 스킬의 `triggers`(키워드/정규식, 한·영)와 매칭, 상위 N개 스킬 본문을 시스템 프롬프트에 주입
3. **모델 호출** — OpenAI 호환 API를 통해 선택된 프로바이더로 요청

## 배포 및 운영 (에어갭 / 온프레미스)

금융·공공기관·기업 배포(망분리 대응)는 5계층 아키텍처로 지원합니다: 오프라인 반입(skopeo/crane)
→ 레지스트리 보안(Harbor + Trivy + Cosign) → LLM 서빙(vLLM/Ollama) → 강화된 앱 컨테이너
(비루트·읽기전용·리소스 제한) → 인증·감사(Keycloak + LangFuse + Prometheus/Grafana).

```bash
docker build -t open-ai-red-team:latest .       # 강화 이미지 빌드
docker compose --profile poc up -d               # PoC: 앱 + Ollama
docker compose --profile serving up -d           # 프로덕션: 앱 + vLLM
./scripts/sbom/scan.sh open-ai-red-team:latest   # CVE 스캔 + SBOM
./scripts/offline/export-images.sh               # 에어갭 반입
```

상세: [배포 및 운영 가이드](docs/deployment.md)

## 문서

- [사용 매뉴얼](docs/manual.md) — 설치, 프로바이더, CLI, 트러블슈팅
- [아키텍처](docs/architecture.md) — 미들웨어 설계 및 데이터 흐름
- [포팅 가이드](docs/porting-guide.md) — Claude 스킬 → 모델 비종속 변환 규칙
- [모델 매트릭스](docs/model-matrix.md) — DeepSeek/GLM/오픈웨이트 특성과 제약
- [무검열 오픈웨이트 모델](docs/uncensored-models.md) — LM Studio + 무검열 GGUF 랩 가이드 ⚠️
- [로드맵](docs/roadmap.md) — 포팅 단계와 미들웨어 계획

## 라이선스

MIT. 원본 스킬: [SnailSploit/claude-red](https://github.com/SnailSploit/Claude-Red) (MIT) — 각 스킬 frontmatter의 `source` 필드에 출처 명시.

> 허가된 환경(침투 테스트, 범위 내 버그바운티, 보안 연구, CTF)에서만 사용하십시오.
