# Roadmap

## 포팅 진행

포팅 순서: **Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security**

### Phase 1 — Web Application (완료)

`skills/web/` — 16개 스킬

| 스킬 | 상태 |
|------|------|
| offensive-sqli | 완료 |
| offensive-xss | 완료 |
| offensive-ssrf | 완료 |
| offensive-ssti | 완료 |
| offensive-xxe | 완료 |
| offensive-idor | 완료 |
| offensive-file-upload | 완료 |
| offensive-rce | 완료 |
| offensive-deserialization | 완료 |
| offensive-race-condition | 완료 |
| offensive-request-smuggling | 완료 |
| offensive-open-redirect | 완료 |
| offensive-parameter-pollution | 완료 |
| offensive-graphql | 완료 |
| offensive-waf-bypass | 완료 |
| offensive-business-logic | 완료 |

### Phase 2 — Infrastructure & Red Team (완료)

`skills/infrastructure/` — 7개 스킬

| 스킬 | 상태 |
|------|------|
| offensive-initial-access | 완료 |
| offensive-advanced-redteam | 완료 |
| offensive-edr-evasion | 완료 |
| offensive-shellcode | 완료 |
| offensive-keylogger-arch | 완료 |
| offensive-windows-mitigations | 완료 |
| offensive-windows-boundaries | 완료 |

### Phase 3 — API Security (완료)

`skills/api/` — 2개 스킬

| 스킬 | 상태 |
|------|------|
| offensive-api-security | 완료 |
| offensive-api-abuse | 완료 |

### Phase 4 — Cloud (완료)

`skills/cloud/` — 1개 스킬

| 스킬 | 상태 |
|------|------|
| offensive-cloud | 완료 |

### Phase 5 — AI Security (완료)

`skills/ai/` — 1개 스킬

| 스킬 | 상태 |
|------|------|
| offensive-ai-security | 완료 |

## 향후 확장 (claude-red 전체 78개 스킬)

| 우선순위 | 카테고리 | 스킬 수 |
|----------|----------|---------|
| 1 | Auth & Identity (JWT/OAuth) | 2 |
| 2 | Exploit Development | 6 |
| 3 | Fuzzing & Vuln Research | 4 |
| 4 | Container & Kubernetes | 2 |
| 5 | CI/CD & Pipeline | 2 |
| 6 | Reconnaissance | 2 |
| 7 | Cryptography | 2 |
| 8 | Privilege Escalation | 2 |
| 9 | Post-Exploitation | 3 |
| 10 | Forensics & C2 | 2 |
| 11 | Supply Chain | 2 |
| 12 | Social Engineering | 2 |
| 13 | Network Attacks | 1 |
| 14 | Active Directory | 1 |
| 15 | Mobile | 1 |
| 16 | IoT & Embedded | 1 |
| 17 | Utility | 2 |
| 18 | Wireless | 14 |
| — | **잔여 합계** | **51** |

## 미들웨어 로드맵

- [x] OpenAI 호환 Provider 추상화 (DeepSeek/GLM/Ollama)
- [x] 스킬 로더 + frontmatter 파싱
- [x] 트리거 엔진 (키워드/정규식, 스코어링)
- [x] Progressive disclosure (인덱스 상시 주입 + 본문 온디맨드)
- [x] CLI (`ort chat / ask / skills`)
- [ ] Ollama num_ctx 자동 확장
- [ ] RAG 기반 의미 매칭 (임베딩) — 키워드 매칭 대체 옵션
- [ ] 멀티턴 도구 실행 루프 (칼리 연동)
