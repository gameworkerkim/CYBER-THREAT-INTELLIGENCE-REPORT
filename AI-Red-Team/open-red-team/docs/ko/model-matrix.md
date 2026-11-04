# 모델 호환 매트릭스

**언어:** [English](../model-matrix.md)(기준) · 한국어(본 문서) · [日本語](model-matrix.md) · [中文](model-matrix.md)

## DeepSeek

| 항목 | 값 |
|------|-----|
| API | `https://api.deepseek.com/v1` — OpenAI 호환 |
| 모델 | `deepseek-chat` (V3, 64K), `deepseek-reasoner` (R1) |
| 컨텍스트 | 64K (128K 베타) |
| System 프롬프트 | 지원 |
| 스트리밍 | 지원 |
| 함수 호출 | 지원 (제한적) |

특이사항:
- `deepseek-reasoner`는 시스템 프롬프트 주입은 지원하나 내부적으로 CoT 생성 → 대용량 스킬 본문 주입 시 응답 지연 증가
- 오프시브 프롬프트 지시 준수율 높음
- reasoning 모드에서 온도 1.0 근처 시 스킬 지시사항 이탈 경향 — `deepseek-chat` 권장

## GLM (즈푸 빅모델)

| 항목 | 값 |
|------|-----|
| API | `https://open.bigmodel.cn/api/paas/v4` — OpenAI 호환 |
| 모델 | `glm-4-plus`, `glm-4-air`, `glm-4-flash` |
| 컨텍스트 | 128K |
| System 프롬프트 | 지원 |
| 스트리밍 | 지원 |
| 함수 호출 | 지원 |

특이사항:
- 일부 모델은 `reasoning_content` 필드를 별도 반환 — 미들웨어에서 병합 처리
- 도구 사용 시 메시지 포맷이 OpenAI와 미세하게 다름 — 텍스트 채팅에선 무관
- `glm-4-flash`는 무료 티어, 대용량 스킬 인덱스 주입에 적합

## 오픈웨이트 (Ollama / vLLM / LM Studio)

| 항목 | 값 |
|------|-----|
| API | Ollama `http://localhost:11434/v1`, vLLM `.../v1` — OpenAI 호환 |
| 모델 | `qwen2.5:32b`, `deepseek-r1:32b`, `llama3.1:70b`, `mistral:7b` 등 |
| 컨텍스트 | 모델별 상이 (4K–128K) |
| System 프롬프트 | 대부분 지원 |
| 스트리밍 | 지원 |

특이사항:
- 7B급 모델은 스킬 본문 1개 이상 주입 시 지시사항 준수율 급감 → `ORT_MAX_SKILLS=1`
- GGUF 양자화 모델은 상세 페이로드(SQLi/쉘코드) 재현력 낮음 — 32B+ 권장
- Ollama는 `keep_alive`/`num_ctx`로 컨텍스트 확장 가능

## 공통 제약

| 항목 | Claude (원본) | OpenAI 호환 모델 (본 프로젝트) |
|------|--------------|-------------------------------|
| 네이티브 스킬 시스템 | O | X → 미들웨어가 재현 |
| 도구 실행 (Bash 등) | O | X → 툴 커맨드만 제시 |
| 멀티턴 에이전트 루프 | O | 제한적 → CLI 세션으로 대체 |

## 권장 설정

| 시나리오 | provider | model | ORT_MAX_SKILLS |
|----------|----------|-------|----------------|
| 클라우드 고성능 | deepseek | deepseek-chat | 3 |
| 중국 리전 | glm | glm-4-plus | 3 |
| 무료 티어 | glm | glm-4-flash | 2 |
| 로컬 32B+ | openweight | qwen2.5:32b | 2 |
| 로컬 7B–14B | openweight | qwen2.5:14b | 1 |
