# SKIL — Security Knowledge & Intelligence Layer

구조화된 보안 지식 레이어. LLM·Cursor Skill·(예정) MCP가 동일 ID로 조회한다.

## 빠른 조회

```bash
node query.mjs control:aws-iam-mfa
node query.mjs --list
node query.mjs --rebuild-index
```

## 레이아웃

```
skil/
├── schemas/          # JSON Schema
├── controls/         # control:* 
├── policies/         # policy:*
├── playbooks/        # playbook:*
├── domains/          # domain packs
├── index.json        # ID 인덱스 (rebuild)
├── query.mjs         # CLI 조회
├── MAPPING.md        # 원천 문서 매핑 규칙
└── README.md
```

## 완료 기준 (M0)

- [x] 디렉터리·스키마·시드 데이터
- [x] `query.mjs`로 `control:aws-iam-mfa` 조회 가능
- [x] MAPPING.md
- [ ] 가이드 전 항목 이관 (고도화 — 진행 중 스켈레톤)
- [ ] MCP `skil_lookup` (M1)

상세 매핑: [MAPPING.md](./MAPPING.md)  
Skill 사용: [../skills/README.md](../skills/README.md)
