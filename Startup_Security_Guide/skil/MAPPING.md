# SKIL MAPPING — 가이드·프롬프트 → 구조화 지식

> Phase 2 문서를 SKIL ID로 변환하는 규칙. M0 스켈레톤 기준.

## ID 규칙

| Kind | Pattern | 예 |
|------|---------|-----|
| Control | `control:<provider-or-topic>-<slug>` | `control:aws-iam-mfa` |
| Policy | `policy:<law-or-gap>-<slug>` | `policy:pipa-29` |
| Playbook | `playbook:<slug>` | `playbook:personal-data-breach` |
| Domain | `domain:<name>` | `domain:cloud` |

- slug: 소문자, 숫자, 하이픈만
- 법조항은 `policy:pipa-29`처럼 조문 번호를 슬러그에 포함

## 원천 문서 → SKIL

| 원천 | SKIL 대상 |
|------|-----------|
| `STARTUP_SECURITY_GUIDE_KR.md` §3 클라우드 | `controls/cloud.json` |
| `STARTUP_SECURITY_GUIDE_KR.md` §4 GWS | `controls/workspace.json` |
| `STARTUP_SECURITY_GUIDE_KR.md` §5 DRM | `controls/drm.json` |
| `STARTUP_SECURITY_GUIDE_KR.md` §2·§6·§11 | `controls/stage-gate.json`, `policies/pipa.json` |
| `STARTUP_SECURITY_GUIDE_KR.md` §6 안전조치 | `policies/kisa-safety.json` |
| `STARTUP_SECURITY_GUIDE_EN.md` 관할 비교 | `policies/gdpr-ccpa-gap.json` |
| `STARTUP_SECURITY_GUIDE_KR.md` §7 사고대응 | `playbooks/incident.json` |
| `LLM_CISO_PROMPT_*.md` 페르소나·출력형식 | `skills/_shared/`, `schemas/finding.schema.json` |
| `LLM_CISO_PROMPT_*.md` 도메인 진단 항목 | `domains/*.json` + 해당 controls (고도화 시 항목 추가) |

## 변환 체크리스트 (항목 추가 시)

1. 가이드에서 체크리스트 한 줄을 고른다.
2. `control.schema.json` 필드를 채운다 (severity, remediation, legalBasis 필수).
3. 관련 `policy:*`가 없으면 policies에 추가한다.
4. `node query.mjs --rebuild-index` 실행.
5. 해당 도메인 Skill `reference.md`에 ID를 한 줄 추가한다.

## 조회

```bash
cd Startup_Security_Guide/skil
node query.mjs control:aws-iam-mfa
node query.mjs --domain cloud
node query.mjs --tag mfa
node query.mjs --list
node query.mjs --rebuild-index
```

## MCP 연동 (M1 예고)

MCP `skil_lookup` 도구는 본 CLI와 동일 입력을 받는다:

```json
{ "id": "control:aws-iam-mfa" }
{ "domain": "cloud" }
{ "tag": "mfa" }
```

응답은 finding/control JSON 객체 또는 배열.
