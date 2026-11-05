# 로드맵

**언어:** [English](../roadmap.md)(기준) · 한국어(본 문서) · [日本語](roadmap.md) · [中文](roadmap.md)

## 포팅 현황 — 전체 완료

포팅 순서: **Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**,
이후 claude-red 나머지 카테고리 확장. 23개 카테고리 79개 스킬 전체 포팅 완료.

| 단계 | 카테고리 | 스킬 수 | 상태 |
|------|----------|-------:|------|
| 1 | Web Application | 16 |  |
| 2 | Infrastructure & Red Team | 7 |  |
| 3 | API Security | 2 |  |
| 4 | Cloud | 1 |  |
| 5 | AI Security | 1 |  |
| 6 | Active Directory | 2 |  |
| 7 | Auth & Identity | 2 |  |
| 8 | Wireless | 14 |  |
| 9 | Mobile | 1 |  |
| 10 | IoT & Embedded | 1 |  |
| 11 | Exploit Development | 6 |  |
| 12 | Fuzzing & Vuln Research | 4 |  |
| 13 | Reconnaissance | 2 |  |
| 14 | Container & Kubernetes | 2 |  |
| 15 | CI/CD & Pipeline | 2 |  |
| 16 | Cryptography | 2 |  |
| 17 | Privilege Escalation | 2 |  |
| 18 | Post-Exploitation | 3 |  |
| 19 | Forensics & C2 | 2 |  |
| 20 | Supply Chain | 2 |  |
| 21 | Social Engineering | 2 |  |
| 22 | Network Attacks | 1 |  |
| 23 | Utility | 2 |  |
| — | **합계** | **79** |  |

## 미들웨어 로드맵

- [x] OpenAI 호환 Provider 추상화 (DeepSeek/GLM/Ollama)
- [x] 스킬 로더 + frontmatter 파싱
- [x] 트리거 엔진 (키워드/정규식, 스코어링; 한·영 키워드)
- [x] Progressive disclosure (인덱스 상시 주입 + 본문 온디맨드)
- [x] CLI (`ort chat / ask / skills`)
- [x] 웹 대시보드 (세션, 감사, OIDC, 메트릭)
- [x] 토큰 예산 엔진 (컨텍스트 한도, 섹션 절단, index_only) + 히스토리 턴 예산
- [x] 운영자별 세션 분리 (SessionStore, X-Ort-Session, OIDC sub 귀속)
- [x] 범위 가드레일(호출 전 거절) + fail-closed 기동(exit 1)
- [x] 로컬 계정(SQLite): admin/admin 비밀번호 변경 강제, HMAC 토큰
- [x] 대시보드 런타임 설정 (스코프/예산/엔진 즉시 반영, admin 역할)
- [x] 스트리밍 폴백 + reasoning_content 포착, LangFuse·Prometheus·JSONL 감사(SHA-256)
- [x] 배포·운영: base/infra compose 분리, ollama-pull·vllm-preflight 게이트, 시크릿 필수화,
      Keycloak realm, Grafana 대시보드, 오프라인 반입(skopeo/crane), Trivy SBOM + Cosign
- [x] 테스트 80개 + 검색 품질 기준선 + CI (typecheck/build/test/docker build/스캔)
- [x] 다국어 문서 (EN 기준 / KO / JA / ZH) + 컴플라이언스 통제표
- [ ] Ollama num_ctx 자동 확장
- [ ] 임베딩 기반 의미 매칭 (RAG) — 키워드 매칭 대체 옵션
- [x] 멀티턴 도구 실행 루프 (칼리 연동) — **blocked**: 이번 릴리스 범위 밖. Open AI Red Team은
  허가된 임무의 방법론을 모델 컨텍스트에 주입하는 미들웨어이며 호스트에서 명령을 실행하지 않습니다.
  P0 통제(범위 거절·세션 분리·히스토리 예산·fail-closed 인증)가 안정된 뒤에만 재검토합니다.

## 계획된 확장 (평가된 제안)

모든 항목은 제품 경계(방법론 주입, 운영자 통제, 자율 실행 없음)를 준수합니다.

| 우선순위 | 항목 | 비고 |
|----------|------|------|
| 높음 | 승인 기반 제안-실행 브리지 | 운영자가 LLM이 제안한 명령을 검토·승인하면 **격리된 샌드박스**에서 실행하고 결과를 모델에 피드백 — 반자동이며 자율 실행 아님 |
| 높음 | 스킬-도구 매핑 레지스트리 | 각 스킬에 필요한 도구(sqlmap, nmap, Burp Suite 등)를 메타데이터로 연결 — 스킬을 실제 워크플로우와 연결 |
| 중간 | 방법론 유효성 벤치마크 | LLM-as-a-Judge로 구체성·실행 가능성·맥락 적합성을 평가 — 미들웨어 출력 품질의 회귀 게이트 |
| 중간 | CI/CD 레드팀 제안 게이트 | GitHub Actions 연동으로 스킬 기반 검토 제안을 PR 코멘트로 게시 (제안만, 실행 없음) |
| 낮음 | 커뮤니티 스킬 마켓플레이스 | 검증된 커뮤니티 기여 `SKILL.md` 카탈로그 |

## 미검증 실인프라 항목

- [ ] 호스팅된 CI 게이트 첫 실행 (워크플로우는 레포 루트에 존재, 로컬 실행만 검증됨)
- [ ] vLLM 실기동 검증 (GPU 인프라 필요)
- [ ] Keycloak OIDC 왕복 검증 (realm import + 대시보드 토큰 교환)
- [ ] SQLite 백업/복구 훈련 (문서화된 절차, 실습 미시행)

## 릴리스 이력

| 버전 | 내용 |
|------|------|
| 0.1.0 | 미들웨어 + 첫 27개 스킬, 프로바이더 추상화, CLI, 문서 |
| 0.2.0 | claude-red 전체 포팅(79개/23개 카테고리), 다국어 문서, 사용 매뉴얼 |
| 0.3.0 | Open AI Red Team으로 명칭 변경 |
| 0.4.0 | 토큰 예산, 테스트 30개, 스코프 가드레일, LangFuse/OIDC/메트릭, 배포 도구 |
| 0.5.0 | P0 강화: 범위 거절(0호출), 세션 분리, 히스토리 예산, fail-closed, PoC compose, 시크릿 필수화, 테스트 63개, 검색 기준선, 컴플라이언스 문서 |
| 0.6.0 | SQLite 로컬 계정(admin/admin 강제 변경), 대시보드 Settings 탭, 로드맵/문서 갱신 |
