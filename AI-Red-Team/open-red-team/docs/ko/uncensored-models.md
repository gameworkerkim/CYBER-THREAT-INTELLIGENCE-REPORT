# 무검열 오픈웨이트 모델 — 로컬 AI 레드팀 랩 가이드

**언어:** [English](../uncensored-models.md)(기준) · 한국어(본 문서) · [日本語](uncensored-models.md) · [中文](uncensored-models.md)

> ## 경고 — 사용 전 필독
>
> 웹 기반 LLM은 검열이 강하고, 로컬 LLM(Gemma, Qwen 등)은 기본 안전 정렬이 적용되어
> AI 레드팀 테스트가 제약받는 경우가 많습니다. 본 가이드는 **LM Studio**와 Hugging Face의
> **무검열(uncensored) GGUF 양자화 모델**을 결합하여 **로컬 환경**에서 제한 없이
> 모델을 테스트하는 방법을 설명합니다.
>
> - 무검열 모델은 **양날의 검**입니다. 레드팀에게 유용하지만 악의적 사용자에게도 공격 도구가
>   될 수 있습니다. 모든 테스트는 **격리된 오프라인 로컬 환경**에서 수행하고, 생성물이
>   외부로 유출되지 않도록 관리해야 합니다.
> - **허가된 범위에서만** 테스트하십시오. 사전 허가된 임무 스코프 내에서 관련 법규와 조직의
>   보안 정책을 준수해야 합니다.
> - **극단적 양자화는 정확도를 희생**합니다. Q2_K는 빠르지만 손실이 크며, 정밀한 취약점
>   분석·코드 생성에는 Q4_K_M 이상을 권장합니다.

---

## 1단계: LM Studio 설치 및 기본 설정

1. **다운로드 및 설치**
   - 공식 사이트(<https://lmstudio.ai/>)에서 OS에 맞는 설치 파일을 받아 설치합니다.

2. **모델 저장 경로 변경 (중요)**
   - LM Studio는 기본적으로 모델을 시스템 드라이브에 저장하여 공간 부족을 일으킬 수 있습니다.
     대용량 GGUF를 받기 전에 저장 경로를 반드시 변경하세요.
   - **GUI**: LM Studio 실행 → 좌측 하단 ** Settings** → **Models Directory** →
     **Change / Browse** → 용량이 충분한 드라이브에 새 폴더 생성·지정 → **재시작**.
   - **참고**: 이미 모델을 받았다면 파일을 새 폴더로 복사한 후 경로를 변경하세요.

## 2단계: 무검열 GGUF 모델 다운로드

1. **Hugging Face 모델 페이지**
   - Qwen 기반 **무검열(Heretic/Uncensored)** 양자화 모델 모음, 16GB 이하 VRAM 최적화:
   - **URL**: `https://huggingface.co/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/tree/main`

2. **VRAM에 맞는 양자화 선택** (Files and versions 탭)

   | 양자화 | 크기 | VRAM | 비고 |
   |--------|------|------|------|
   | **Q2_K** (2비트) | 약 3GB | 4~8GB (RTX 3050/4050 등) | 가장 빠름, 품질 ~80–85%, 코드·수학 오류 가능 |
   | **Q4_K_M** (4비트) | 약 5GB | 8GB | **가장 균형 잡힘**(~95–97%), 대부분의 레드팀 테스트 권장 |
   | **Q8_0** (8비트) | 약 8GB | 12GB+ | 거의 무손실(99%+) |

3. **모델 파일 배치**
   - 받은 `.gguf`를 1단계 폴더에 LM Studio 인식 구조로 배치:
     `모델경로/게시자/모델명/파일.gguf`
   - **예시**:
     `aaa/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/Qwen3.8-9B-Distill-uncensored-heretic.Q2_K.gguf`

## 3단계: 모델 로드 및 레드팀 테스트

1. LM Studio 재실행 → **Chat** 탭 → 입력창 위 드롭다운에서 받은 모델 선택.
2. 모델이 자동으로 VRAM에 로드되고 완료되면 채팅 가능
   (RTX 4090 기준 Q2_K는 초당 약 300토큰).
3. 레드팀 프롬프트 적용 — 무검열 모델은 안전 거부 없이 지시를 따르므로, **허가된 랩
   스코프 내에서만** 정책·보안 시나리오 분석, 취약점 분석, 공격 시나리오 생성을 수행합니다.

## 4단계: 비전(VLM) 사용 시 추가 설정

비전-언어 모델로 이미지 입력을 쓰려면 `mmproj` 파일이 필요합니다:

1. 모델 페이지에서 `Qwen3.8-9B-Distill-uncensored-heretic.mmproj-Q8_0.gguf`(약 624MB) 다운로드.
2. 파일명 앞에 `mmproj-` 접두사 부여 (예: `mmproj-Qwen3.8-…mmproj-Q8_0.gguf`).
3. 메인 모델 파일(`.Q2_K.gguf`)과 같은 폴더에 배치.

## 5단계: Open AI Red Team 연동

LM Studio는 `http://localhost:1234/v1`에 **OpenAI 호환 API**를 노출합니다 —
미들웨어의 `openweight` 프로바이더에 그대로 연결하면 됩니다:

```bash
OPENWEIGHT_BASE_URL=http://localhost:1234/v1 \
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF \
OPENWEIGHT_API_KEY=lm-studio \
node dist/src/cli.js chat --provider openweight
```

`.env` 형태:

```dotenv
ORT_PROVIDER=openweight
OPENWEIGHT_BASE_URL=http://localhost:1234/v1
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF
OPENWEIGHT_API_KEY=lm-studio
# 소형 모델 → 예산 축소
ORT_MAX_CONTEXT=32768
ORT_SKILL_BUDGET=6000
```

> 참고: 양자화 모델은 상세 페이로드 재현력이 낮습니다 — 14B 이하 모델은
> `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off` 권장 ([모델 매트릭스](../model-matrix.md)).

## 6단계: 유의사항 — 다시 한번 

- **격리**: 모든 테스트를 격리된 오프라인 로컬 환경에서 수행하고 생성물이 외부로 유출되지 않게 관리.
- **양자화 트레이드오프**: Q2_K는 속도·VRAM 효율 우선, 정확도 손실 큼. 정밀 분석·코드 생성은
  VRAM이 허용하는 선에서 Q4_K_M 이상 사용.
- **법적·윤리적 책임**: 무검열 모델을 사용한 모든 테스트는 **사전 허가된 범위** 내에서,
  관련 법규와 조직 보안 정책을 준수해야 합니다.

## 요약

| 단계 | 핵심 작업 | 비고 |
|:-----|:----------|:-----|
| **1. 설치** | LM Studio 설치 후 모델 저장 경로를 용량 큰 드라이브로 변경 | `Settings → Models Directory` |
| **2. 다운로드** | VRAM에 맞는 무검열 GGUF(Q2_K / Q4_K_M 등)를 Hugging Face에서 수신 | Q2_K: 4~8GB VRAM, Q4_K_M: 8GB 권장 |
| **3. 배치** | `모델경로/게시자/모델명/파일.gguf` 구조 | LM Studio 인식 구조 준수 |
| **4. 실행** | Chat 탭에서 모델 선택 후 레드팀 프롬프트 테스트 | 비전 시 `mmproj` 추가 |
| **5. 연동** | `openweight` 프로바이더를 `http://localhost:1234/v1`로 지정 | OpenAI 호환, 어댑터 불필요 |
