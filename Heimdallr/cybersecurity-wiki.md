# Heimdallr — CyberSecurityWiki 설계

> LLM 이 해킹 기법·방어 노하우를 축적하고, 다른 LLM·MCP 가 참조하는 지식 시스템

---

## 1. 목적

ARTEX 의 산출물(리포트·탐지 규칙)은 "실행하고 나면 버려지는" 정적 파일에 가깝습니다. Heimdallr 의 **CyberSecurityWiki** 는 이 한계를 넘어, 매 실행의 산출물을 **기계가 읽고 재사용할 수 있는 살아있는 지식**으로 환원합니다.

- **지식 축적**: 공격 기법(TTP)·탐지 규칙·하드닝 체크리스트를 구조화해 저장.
- **외부 참조**: 다른 LLM·MCP 에이전트가 `llms.txt` / MCP server / REST API 로 직접 조회.
- **방어 중심**: 지식은 "어떻게 뚫리는가"와 함께 "어떻게 막고 탐지하는가"를 쌍으로 담습니다.

---

## 2. 핵심 원칙

1. **쌍(Pair) 구조** — 공격 기법(Attack)과 대응(Defense/Detection)을 한 엔트리에 묶습니다. "공격만" 가르치는 지식은 만들지 않습니다.
2. **기계 판독 우선** — 사람이 읽는 문서보다 **LLM/MCP 가 바로 파싱할 수 있는 구조**(스키마·`llms.txt`·JSON)를 우선합니다.
3. **출처·검증 표기** — 각 지식은 출처(어떤 실행/어떤 소스)와 신뢰도를 기록합니다. "재현 불가한 주장은 규칙이 아니다"는 ARTEX 의 원칙을 계승.
4. **방어 우선 게이트** — 민감한 원본 페이로드는 위키에 그대로 남기지 않고, **탐지·완화에 필요한 부분만** 정제해 저장합니다.

---

## 3. 지식 스키마 (초안)

```
wiki_entry
  id, slug, title, lang
  type: [technique | detection | hardening | tool | incident | concept]
  category: [recon | injection | auth | lateral_movement | priv_esc | exfil | ...]
  severity, confidence (low/medium/high)
  attack: { mitre_attack_id[], description, steps[], prerequisites }
  defense: { detection_rules[], hardening[], remediation[] }
  references: [{ source_type, source_ref, url }]
  provenance: { origin_task_id, author, created_at, updated_at }
  status: [draft | reviewed | published]
```

### 엔트리 예시 (SQLi)

```yaml
slug: sql-injection-login-bypass
type: technique
category: injection
mitre_attack: [T1190]
attack:
  description: "로그인 폼의 SQL 인젝션을 통한 인증 우회"
  steps: [ "인젝션 지점 식별", "boolean 기반 확인", "우회 페이로드" ]
defense:
  detection_rules: [ "sigma/sql_injection_login.yml" ]
  hardening: [ "파라미터화 쿼리", "WAF 규칙", "최소 권한 DB 계정" ]
  remediation: [ "..."]
provenance: { origin_task_id: "task_123", confidence: high }
```

---

## 4. 저장 계층

| 계층 | 기술 | 역할 |
|---|---|---|
| 원본 지식 | **Neon (PostgreSQL)** | 정규화된 위키 엔트리·버전·출처 |
| 검색/임베딩 | 벡터 저장(옵션, pgvector 또는 Workers 벡터화) | 의미 검색 |
| 정적 배포 | Cloudflare Pages / R2 | `llms.txt`, 사이트맵, 공개 읽기용 스냅샷 |
| 캐시 | KV | 자주 조회하는 엔트리 캐시 |

---

## 5. 외부 LLM/MCP 참조 인터페이스

### 5-1. `llms.txt` (LLM 지향)

- 루트 `llms.txt` + 카테고리별 `llms/*.txt`.
- 표준 형식(URL + 설명 한 줄)으로 LLM 크롤러·에이전트가 바로 수집.

```
# CyberSecurityWiki
> Heimdallr 의 방어 중심 사이버 보안 지식 기반

## Techniques
- https://heimdallr.example/wiki/sql-injection: SQL 인젝션 공격과 탐지·하드닝
...
```

### 5-2. MCP Server

- Heimdallr 를 **MCP 서버**로 노출 → Claude·다른 에이전트가 도구로 호출.
- 제공 도구(예시): `wiki_search(q)`, `wiki_get(slug)`, `wiki_list(category)`, `mitre_lookup(id)`.
- 방어자 관점 가드: 원본 익스플로잇 페이로드가 아니라 **탐지·완화 지식**을 우선 반환.

### 5-3. REST API

- `GET /wiki/{slug}`, `GET /wiki?category=...`, `GET /llms.txt`.
- 언어 파라미터(`?lang=ko|en|zh|ja`).

---

## 6. 지식 축적 경로 (생성 → 검증 → 배포)

```
[에이전트 실행 산출물] → [정제/구조화] → [검토(review)] → [게시] → [배포]
        │                    │              │            │
   findings, facts,     원본 페이로드     사람/LLM 리뷰    llms.txt·MCP·REST
   detection 규칙        제거·완화 중심       confidence    Pages/R2 스냅샷
```

1. **수집**: 작업에서 나온 `finding`·탐지 규칙·하드닝 항목을 후보 엔트리로 추출.
2. **정제**: 민감/과잉 정보 제거, "공격+방어 쌍" 완성, 스키마 정규화.
3. **검토**: 사람 또는 검증 LLM 이 `confidence` 부여(재현 불가 → `draft` 유지).
4. **게시**: `reviewed/published` 로 승격.
5. **배포**: `llms.txt`·MCP·REST·공개 페이지 갱신.

---

## 7. 방어 우선 가드레일

| 항목 | 규칙 |
|---|---|
| 페이로드 최소화 | 완전한 익스플로잇 코드는 저장하지 않고 탐지 시그니처·완화에 필요한 조각만 |
| 쌍 구조 강제 | attack 이 있으면 defense/detection 필수 |
| 접근 제어 | 공개 범위(방어 지식)와 비공개 범위(상세 PoC) 분리 |
| 출처 필수 | provenance 없으면 게시 불가 |
| 검토 게이트 | 재현·검증 없는 규칙은 `draft` 로 격리 |

---

## 8. 외부 표준 연동

- **MITRE ATT&CK**: 엔트리 ↔ `mitre_attack_id` 매핑, Navigator 레이어 생성.
- **Sigma / Suricata**: 탐지 규칙을 표준 포맷으로 저장·변환(`sigma convert`).
- **MISP / STIX**: 침해지표를 MISP 이벤트·STIX 객체로 내보내기.
- **OWASP / CWE**: 웹 취약점 엔트리 ↔ CWE ID 매핑.

---

## 9. 구현 단계

| 단계 | 산출물 |
|---|---|
| W1 | 스키마 + Neon 저장 + 기본 CRUD API |
| W2 | `llms.txt` 생성기 + 공개 페이지 |
| W3 | MCP server(검색/조회 도구) |
| W4 | 에이전트 산출물 자동 수집·정제 파이프라인 |
| W5 | 검토 게이트 + confidence + 버전 관리 |
| W6 | ATT&CK/Sigma/MISP 연동 + 의미 검색(임베딩) |

---

## 10. 참고

- ARTEX 한국어판의 방어·탐지 자료 구조: [`jiwoochris/artex-ko`](https://github.com/jiwoochris/artex-ko) `docs/defense-ko.md`, `detections/` (Sigma/Suricata/MISP/ATT&CK)
- `llms.txt` 표준: [llmstxt.org](https://llmstxt.org)
