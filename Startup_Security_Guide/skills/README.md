# LLM CISO Skills — Cursor · Claude · ChatGPT · Ollama

멀티 LLM용 Virtual CISO 스킬 세트. **같은 지식(SKIL)** 을 Cursor Agent Skill과 범용 System Prompt로 공유한다.

## Skill 목록

| Skill | Cursor | 범용 System Prompt | 도메인 |
|-------|--------|-------------------|--------|
| [ciso-core](./ciso-core/) | `SKILL.md` | `SYSTEM_PROMPT.md` | 종합 |
| [ciso-cloud](./ciso-cloud/) | `SKILL.md` | `SYSTEM_PROMPT.md` | AWS/GCP/Azure/Vercel |
| [ciso-workspace](./ciso-workspace/) | `SKILL.md` | `SYSTEM_PROMPT.md` | Google Workspace |
| [ciso-drm](./ciso-drm/) | `SKILL.md` | `SYSTEM_PROMPT.md` | DRM·문서·오프보딩 |
| [ciso-kisa](./ciso-kisa/) | `SKILL.md` | `SYSTEM_PROMPT.md` | PIPA/KISA·관할 갭 |
| [ciso-incident](./ciso-incident/) | `SKILL.md` | `SYSTEM_PROMPT.md` | 사고 대응 |

공유 규칙: [_shared/](./_shared/) · 지식 기반: [../skil/](../skil/)

---

## 1) Cursor

프로젝트 스킬로 쓰려면 이 폴더를 레포에 두고 Agent에게 스킬 이름을 지정한다.

```
@ciso-cloud 우리 AWS 계정 보안 점검해줘. 루트 MFA만 켜져 있어.
```

또는 Cursor User/Project Skills로 `skills/ciso-*` 를 복사:

```bash
# 예: 프로젝트 스킬
mkdir -p .cursor/skills
cp -R Startup_Security_Guide/skills/ciso-cloud .cursor/skills/
cp -R Startup_Security_Guide/skills/ciso-core .cursor/skills/
cp -R Startup_Security_Guide/skills/_shared .cursor/skills/
```

Agent는 `SKILL.md`의 description으로 자동 선택하거나, 사용자가 스킬을 명시한다.

---

## 2) Claude (claude.ai / Claude Code / API)

1. `ciso-cloud/SYSTEM_PROMPT.md` 내용을 **System / Custom instructions**에 붙여넣기
2. (권장) Project Knowledge 또는 첫 메시지에 첨부:
   - `skil/controls/cloud.json`
   - 필요 시 `skil/policies/pipa.json`
3. User 메시지에 회사 컨텍스트 입력

**Claude API 예:**

```bash
# pseudo — Anthropic Messages API
# system = contents of SYSTEM_PROMPT.md
# user = company context + optional SKIL JSON
```

Claude Code: 레포를 연 뒤 `skills/` 와 `skil/` 을 컨텍스트로 참조하도록 지시.

---

## 3) ChatGPT / GPT-4o

1. Custom GPT **Instructions**에 `SYSTEM_PROMPT.md` 붙여넣기  
2. **Knowledge**에 `skil/controls/*.json`, `skil/policies/*.json` 업로드  
3. 또는 채팅에 JSON을 붙여넣고 “이 SKIL을 ground truth로 써”

---

## 4) Gemini / 기타 웹 LLM

동일: System/Instructions에 `SYSTEM_PROMPT.md` + SKIL JSON 첨부.

---

## 5) Ollama (로컬)

```bash
# Modelfile 예
cat > Modelfile << 'EOF'
FROM llama3:8b
SYSTEM """
(여기에 ciso-core/SYSTEM_PROMPT.md 전문 붙여넣기)
"""
PARAMETER temperature 0.3
EOF

ollama create ciso-local -f Modelfile
ollama run ciso-local "5인 스타트업 AWS+GWS, CPO 없음. Top 3 조치."
```

민감 인프라 설정은 로컬 모델만 사용.

---

## 6) SKIL 조회 (모든 LLM 공통 준비)

진단 전에 ID를 조회해 컨텍스트로 넣으면 환각이 줄어든다.

```bash
cd Startup_Security_Guide/skil
node query.mjs control:aws-iam-mfa
node query.mjs --domain cloud
node query.mjs --list
```

---

## 권장 조합

| 상황 | Skill |
|------|-------|
| 뭐부터 해야 할지 모름 | `ciso-core` |
| 클라우드 설정 | `ciso-cloud` |
| Gmail/Drive | `ciso-workspace` |
| 문서·퇴사 | `ciso-drm` |
| 한국 법규 / 해외→한국 | `ciso-kisa` |
| 사고 발생 | `ciso-incident` |

종합 진단: `ciso-core` + 도메인 스킬을 순서대로, 또는 한 대화에서 도메인을 명시.

---

## 고도화 계획

현재는 **스켈레톤 + 시드 SKIL**. 이후 `STARTUP_SECURITY_GUIDE_*.md` / `LLM_CISO_PROMPT_*.md` 본문으로 controls·prompts를 채운다 (ROADMAP M0 고도화).
