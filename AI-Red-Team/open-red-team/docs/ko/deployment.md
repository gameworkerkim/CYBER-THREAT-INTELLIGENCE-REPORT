# 배포 및 운영 — 에어갭 / 온프레미스

**언어:** [English](../deployment.md)(기준) · 한국어(본 문서) · [日本語](deployment.md) · [中文](deployment.md)

금융·공공기관·기업 환경에 Open AI Red Team을 배포하는 방법을 설명합니다. 에어갭 및 온프레미스
운영 지원 특성을 최대한 활용하면서 국내 규제(망분리, 전자금융감독규정 등)를 충족시키는 계층형
아키텍처를 구성하는 것이 핵심입니다.

## 권장 아키텍처 — 5계층

```
① 오프라인 반입 계층       ② 컨테이너 보안/레지스트리 계층   ③ LLM 서빙 계층
   (인터넷망)                  (내부망)                        (내부망)
┌──────────────────┐   ┌──────────────────────────────┐   ┌───────────────────────┐
│ skopeo / crane   │   │ Harbor (프라이빗 레지스트리) │   │ vLLM (프로덕션)        │
│ docker save/load │──►│ Trivy (CVE + SBOM)           │──►│ Ollama (PoC)          │
│ 모델 가중치       │   │ Cosign (서명/검증)            │   │ OpenAI 호환 /v1       │
└──────────────────┘   └──────────────────────────────┘   └───────────┬───────────┘
                                                                       │
④ 레드팀 애플리케이션 계층    ⑤ 인증·감사·모니터링 계층               │
┌──────────────────────────────┐   ┌──────────────────────────────┐   │
│ ort (Open AI Red Team)       │◄──┤ Keycloak (OIDC, SSO, RBAC)   │◄──┘
│ 비루트/읽기전용/리소스 제한    │   │ LangFuse (LLM 감사)          │
└──────────────────────────────┘   │ Prometheus + Grafana + Loki  │
                                   └──────────────────────────────┘
```

---

## 계층 1 — 오프라인 반입 (망분리)

망분리 환경에서는 인터넷망에서 필요한 모든 자원(LLM 가중치, Docker 이미지, 패키지)을 식별·다운로드한 후
**악성코드 검사를 거쳐** 내부망으로 반입해야 합니다.

### 이미지 내보내기 (인터넷망)

```bash
# skopeo(Docker 데몬 불필요) 또는 crane, docker save — scripts/offline/ 참고
./scripts/offline/export-images.sh
# 사용자 지정 목록: IMAGES="harbor.example.com/repo/app:v1 ..." ./scripts/offline/export-images.sh
```

`artifacts/images/*.tar`와 SHA-256 체크섬이 생성됩니다. 반입 **전에** 조직의 백신/악성코드
솔루션으로 검사하십시오(금융보안원 가이드).

### 이미지 반입 (내부망)

```bash
./scripts/offline/import-images.sh
# 내부 Harbor로 푸시:
HARBOR=harbor.internal.example.com/open-red-team ./scripts/offline/import-images.sh
```

### 모델 가중치

```bash
# vLLM 포맷 (Hugging Face)
MODEL_ID=Qwen/Qwen2.5-32B-Instruct ./scripts/offline/export-models.sh
# Ollama 포맷 (PoC)
MODE=ollama OLLAMA_MODEL=qwen2.5:32b ./scripts/offline/export-models.sh
```

### Harbor 복제 (tar 파일의 대안)

인터넷망 Harbor에서 내부망 Harbor로 **복제 규칙(replication rule)**을 구성합니다. 승인된 구간 전송
경로와 복제 아티팩트별 감사 로깅이 필요합니다.

---

## 계층 2 — 컨테이너 보안 및 프라이빗 레지스트리

금융·공공기관은 이미지 취약점 스캔과 SBOM 생성이 사실상 의무입니다.

| 도구 | 역할 |
|------|------|
| **Harbor** | 온프레미스 프라이빗 레지스트리 사실상 표준. Trivy 스캐너 어댑터 통합 — 푸시 시 자동 스캔, 정책 기반 pull 차단 |
| **Trivy** | OS 패키지·언어 의존성·IaC 설정·시크릿 스캔. SBOM(SPDX/CycloneDX) 생성으로 공급망 보안 요구 충족 |
| **Cosign** | 이미지 서명·검증(Sigstore). Harbor와 연동해 서명되지 않은 이미지 배포 차단 |

### 스캔 + SBOM

```bash
# HIGH/CRITICAL 발견 시 실패, SPDX + CycloneDX SBOM 출력
./scripts/sbom/scan.sh open-ai-red-team:latest artifacts/sbom
```

### 서명 + 검증

```bash
./scripts/sbom/sign.sh open-ai-red-team:latest          # cosign.key 생성 후 서명
./scripts/sbom/sign.sh open-ai-red-team:latest --verify # cosign.pub으로 검증
```

### Harbor 구성 요약

1. 내부망에 Harbor 설치 (오프라인 설치본).
2. 프로젝트 → **구성**: "취약한 이미지 실행 차단" 활성화(Trivy 어댑터).
3. 배포 노드용 pull 전용 로봇 계정 생성.
4. (선택) Cosign 연동 — 서명된 이미지만 허용하는 정책 적용.

---

## 계층 3 — LLM 서빙

Open AI Red Team은 모든 OpenAI 호환 백엔드를 지원합니다. 요구사항에 따라 선택합니다:

| 백엔드 | 사용 시점 | 비고 |
|--------|-----------|------|
| **vLLM** | 프로덕션 (권장) | PagedAttention + Continuous Batching — 동시 요청 시 Ollama 대비 약 5배 처리량. OpenAI 호환 `/v1`. 금융권 온프레미스 표준으로 수렴 |
| **Ollama** | PoC / 개발 / 엣지 | 단일 명령 배포, 로컬 가중치 관리 용이. 프로덕션 규모 동시성에는 부적합 |
| **NVIDIA NIM** | 선택 | NVIDIA AI Enterprise 라이선스 보유 시 지원 계약 + FIPS 검증 이미지 활용. NVIDIA GPU 전용 |

```bash
# 프로덕션: vLLM(serving 프로파일) → 앱
docker compose --profile serving up -d
docker compose up -d ort

# PoC: Ollama(poc 프로파일)
docker compose --profile poc up -d
```

앱은 OpenAI 호환 base URL로 연결됩니다(`docker-compose.yml`에 이미 설정됨):

```
OPENWEIGHT_BASE_URL=http://vllm:8000/v1
```

클라우드 API(DeepSeek/GLM) 사용 시 `ORT_PROVIDER=deepseek`/`glm`과 해당 키를 설정하십시오 —
임무 데이터의 외부 반출이 허용되는 경우에만 사용 가능합니다.

---

## 계층 4 — 레드팀 애플리케이션

`ort`는 저장소의 `Dockerfile`로 컨테이너화되어 Harbor를 통해 배포됩니다.

이미 적용된 강화 조치:

- **비루트 사용자** (`ort`) 런타임 스테이지
- **읽기 전용 루트 파일시스템** (`read_only: true` + `tmpfs /tmp`)
- **리소스 제한** (CPU/메모리 상한)
- **capability 제거** (`cap_drop: ALL`) 및 `no-new-privileges`
- `skills/`가 이미지에 포함 — 배포 후 완전 오프라인 동작

```bash
docker build -t open-ai-red-team:latest .
docker run --rm -it --read-only --tmpfs /tmp \
  -e ORT_PROVIDER=openweight \
  -e OPENWEIGHT_BASE_URL=http://vllm:8000/v1 \
  -e OPENWEIGHT_MODEL=qwen2.5-32b \
  --network redteam_redteam open-ai-red-team:latest chat
```

---

## 계층 5 — 인증·감사·모니터링

### 접근 제어 — Keycloak

- 망분리 환경 내 OIDC 호환 IdP → 운영자 SSO + RBAC
- 감사 로깅 및 규제 요구사항(BAIT/VAIT 유사 감독 체계) 충족
- Compose 프로파일 `auth`; 프로덕션에서는 `--import-realm` 방식 권장

```bash
docker compose --profile auth up -d   # http://localhost:8080
```

### LLM 관측·감사 — LangFuse

- 프롬프트·응답·토큰·지연시간 수집 → 운영 품질과 감사 추적 동시 확보
- 온프레미스 배포로 임무 데이터 완전 통제

```bash
docker compose --profile observability up -d   # http://localhost:3000
```

### 인프라 모니터링 — Prometheus / Grafana (+ Loki 선택)

- vLLM `/metrics`·Ollama `/metrics`가 `deploy/monitoring/prometheus/prometheus.yml`에 사전 연결됨
- Grafana 데이터소스 사전 프로비저닝
- Loki(선택): 로그 집계 및 보존

```bash
docker compose --profile monitoring up -d   # Grafana http://localhost:3001
```

---

## 도구 요약

| 계층 | 권장 도구 | 역할 |
|------|-----------|------|
| 레지스트리 | **Harbor** | 프라이빗 이미지 저장, Trivy 통합 스캔, 서명 검증 |
| 스캔/SBOM | **Trivy** | CVE 스캔, SBOM(SPDX/CycloneDX), IaC/시크릿 스캔 |
| 서명 | **Cosign** | 이미지 무결성, 서명 검증 |
| 오케스트레이션 | **Docker Compose**(소규모) / **Kubernetes**(대규모) | 컨테이너 오케스트레이션, 네트워크 정책, 시크릿 |
| LLM 서빙 | **vLLM**(프로덕션) / **Ollama**(PoC) | OpenAI 호환 API, 고성능 추론 |
| 인증 | **Keycloak** | OIDC IdP, SSO, RBAC, 감사 로깅 |
| 관측 | **LangFuse**, **Prometheus/Grafana** | LLM 관측, 인프라 모니터링 |

## 우선순위

1. **최우선**: Harbor + Trivy — 모든 이미지에 대한 취약점 스캔 및 SBOM 파이프라인 확보(기본 보안 요구사항).
2. **프로덕션**: LLM 서빙은 vLLM, 앱의 OpenAI 호환 프로바이더 설정으로 연동.
3. **망분리 대응**: 인터넷망에서 skopeo/crane으로 이미지 tar 저장 → 보안 검사 → 내부 Harbor 반입.
4. **감사·규정 준수**: Keycloak으로 접근 통제, LangFuse로 모든 LLM 상호작용 기록.

이 아키텍처는 Open AI Red Team의 모델 중립성과 에어갭 지원을 극대화하면서, 국내 금융·공공기관이
요구하는 공급망 보안·망분리·감사 가능성을 동시에 충족합니다.
