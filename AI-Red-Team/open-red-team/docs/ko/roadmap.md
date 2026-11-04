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
- [x] 다국어 문서 (EN 기준 / KO / JA / ZH)
- [ ] Ollama num_ctx 자동 확장
- [ ] 임베딩 기반 의미 매칭 (RAG) — 키워드 매칭 대체 옵션
- [x] 멀티턴 도구 실행 루프 (칼리 연동) — **blocked**: 이번 릴리스 범위 밖. Open AI Red Team은
  허가된 임무의 방법론을 모델 컨텍스트에 주입하는 미들웨어이며 호스트에서 명령을 실행하지 않습니다.
  P0 통제(범위 거절·세션 분리·히스토리 예산·fail-closed 인증)가 안정된 뒤에만 재검토합니다.
