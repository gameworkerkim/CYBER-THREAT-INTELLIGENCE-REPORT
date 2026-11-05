# 컴플라이언스 통제

**언어:** [English](../compliance.md)(기준) · 한국어(본 문서) · [日本語](compliance.md) · [中文](compliance.md)

이 표는 **이 시스템이 코드로 강제하는 것**과 **운영자/조직이 여전히 직접 해야 하는 것**을 구분합니다.
Open AI Red Team은 허가된 임무를 위한 방법론 주입 미들웨어이며, 그 자체로 ISMS-P·금융보안규정·
PCI-DSS·NIST를 충족시키는 인증이 아닙니다.

## 코드로 강제되는 통제

| 통제 ID | 기능 | 강제 지점 |
|---------|------|-----------|
| SCOPE-1 | 범위 밖 호스트/IP는 **모델 호출 전에** 거절 | `src/safety.ts` + `src/index.ts` (`decision: deny`, 호출 0회) |
| SCOPE-2 | 신고된 임무 스코프를 시스템 프롬프트에 주입하고 감사·트레이스에 기록 | `ORT_SCOPE` / `ORT_SCOPE_DOMAINS` |
| SCOPE-3 | 스코프 선언 없이는 대시보드 기동 거부 | 랩 모드는 `ORT_SCOPE_MODE=open` 필요 |
| AUTH-1 | 대시보드 API 기본 잠금: 정적 토큰 또는 OIDC 필수 | 인증 없으면 exit 1 (`ORT_ALLOW_ANONYMOUS=1` 예외) |
| AUTH-2 | OIDC(Keycloak) RS256/JWKS 검증, 세션은 토큰 `sub`에 귀속 | `src/dashboard/oidc.ts`, `X-Ort-Session` |
| AUTH-3 | `/metrics` 인증 (`ORT_METRICS_TOKEN` 또는 대시보드 인증) | `src/dashboard/server.ts` |
| AUTH-4 | 로그인 무차별 대입 잠금(사용자명+IP별, HTTP 429) + 로그인 성공/실패 감사 | `src/dashboard/ratelimit.ts`, `event: "auth"` 감사 |
| AUTH-5 | 계정 수명주기 관리(생성/비밀번호 초기화/삭제, admin 역할, 최초 로그인 변경 강제) | `/api/users`, Settings 탭 |
| SESS-1 | 운영자별 대화 격리 (인메모리 세션, LRU 상한, 유휴 축출) | `src/sessions.ts` |
| AUDIT-1 | JSONL 감사: ts, sessionId, operator, decision, flaggedTargets, matchedSkills, 프롬프트 SHA-256 (원문 미기록) | `ORT_AUDIT_LOG` |
| AUDIT-2 | `ORT_AUDIT_REQUIRED=1`이면 감사 기록 실패 시 요청 실패 | `src/dashboard/server.ts` |
| AUDIT-3 | `ORT_AUDIT_MAX_BYTES` 도달 시 감사 로그 로테이션(단일) | `src/auditlog.ts` |
| AUDIT-4 | `ORT_AUDIT_LOG` 설정 시 CLI 채팅도 감사 | `src/index.ts` |
| BUDGET-1 | 컨텍스트 예산: 스킬 본문 절단, 히스토리 트리밍, 대형 스킬 `index_only` | `src/skills/inject.ts`, `src/index.ts` |
| OBS-1 | Prometheus 메트릭 (요청, 지연, 토큰, RSS) | `/metrics` |
| OBS-2 | LangFuse 트레이싱 — **기본 꺼짐**; 켜면 프롬프트·응답 전문이 LangFuse로 전송됨 | `LANGFUSE_*` |

## 운영자/조직 책임 (코드에 없음)

| 통제 ID | 책임 | 대상 |
|---------|------|------|
| ORG-1 | 망분리, 전송 구간 악성코드 검사, 오프라인 매체 관리 | 조직 |
| ORG-2 | Keycloak 계정 발급·RBAC 정책, 운영자 식별 관리 | 조직 |
| ORG-3 | 시크릿 보관: API 키, Keycloak/DB 비밀번호, 서명키(Cosign), 키 순환 | 조직 |
| ORG-4 | 감사 로그 보존 기간·보호 저장소·검토 절차 | 조직 |
| ORG-5 | Harbor의 이미지 스캔/서명 게이트 (Trivy 어댑터, Cosign 정책) | 조직 |
| ORG-6 | 임무 승인 기록 (교전 규칙, 스코프 서명) | 운영자 |
| ORG-7 | 반입 GGUF/HF 모델의 출처 및 라이선스 검토 | 조직 |

## 매핑 참고 (정보 제공)

- **ISMS-P / 금융보안규정**: AUDIT-*, AUTH-*, ORG-1..5가 접근통제·로그 의무를 기술적으로 뒷받침하나,
  인증 취득에는 조직 자체 절차가 필요합니다.
- **PCI-DSS**: 카드데이터는 처리하지 않으며, 관련 시험 방법론은 스킬에 존재합니다(예: V5.3.4 참조).
- **NIST**: 스킬 내 MITRE ATT&CK 기법 매핑이 참조이며, 제품 자체는 첫 표의 통제만 구현합니다.

첫 표에 **없는 통제는 전부 운영자 책임**으로 간주하십시오. 이 제품이 이를 충족한다고 주장하지 마십시오.
