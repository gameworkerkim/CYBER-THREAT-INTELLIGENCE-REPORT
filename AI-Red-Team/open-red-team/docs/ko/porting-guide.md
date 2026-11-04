# 포팅 가이드

**언어:** [English](../porting-guide.md)(기준) · 한국어(본 문서) · [日本語](porting-guide.md) · [中文](porting-guide.md)

claude-red 스킬(SKILL.md)을 모델 비종속 스킬로 포팅하는 규칙과 절차.

## 포팅 순서

```
Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security
       ↓ (전체 라이브러리 확장)
Active Directory → Auth & Identity → Wireless → Mobile → IoT & Embedded →
Exploit Development → Fuzzing & Vuln Research → Reconnaissance →
Container & Kubernetes → CI/CD & Pipeline → Cryptography →
Privilege Escalation → Post-Exploitation → Forensics & C2 →
Supply Chain → Social Engineering → Network Attacks → Utility
```

23개 카테고리(79개 스킬) 전체 완료.

## 변환 규칙

### 1. Frontmatter 확장

원본 frontmatter(`name`, `description`)를 유지하고 아래 필드를 추가합니다.

| 추가 필드 | 규칙 |
|-----------|------|
| `triggers` | 스킬 사용을 유발하는 키워드 6~14개. 소문자, 동의어/툴명/공격명 포함, 한·영. 정규식은 `/.../` 형태 |
| `category` | 포팅 카테고리 (원본 디렉토리와 일치) |
| `model_note` | (선택) 모델별 주의사항 |
| `source` | `https://github.com/SnailSploit/Claude-Red (MIT)` |

### 2. Claude 의존성 제거

- "Claude Code", "Claude.ai", "claude-skills.json", "Claude Skills 시스템" → 모델 중립 표현으로 교체
- 예: `cat SKILL.md | claude --system-file -` → 미들웨어 `--skills` 플래그 사용법
- Anthropic API/모델명 언급 → OpenAI 호환 프로바이더 기준으로 일반화

### 3. 본문(마크다운) 유지

- 공격 방법론 본문은 그대로 유지 (기술 내용은 모델 비종속)
- 툴 커맨드는 그대로 (칼리/보안툴은 플랫폼 비종속)
- 프롬프트 페이로드 섹션은 유지 (공격 대상은 *테스트 대상 시스템*이지, 운영 모델이 아님)

### 4. 레거시 포맷 처리

일부 업스트림 스킬은 YAML frontmatter가 없고 `# SKILL:`, `## Metadata`, `## Description`,
`## Trigger Phrases`, `## Instructions for Claude` 섹션을 사용합니다.
`scripts/fetch-skills.ts`는 두 포맷을 모두 감지하여 변환합니다:

- `## Description` → frontmatter `description`
- `## Metadata` / `## Trigger Phrases` → 제거 (생성된 frontmatter로 대체)
- `## Instructions for Claude` → `## Instructions`

### 5. 검증 체크리스트

- [ ] 유효한 YAML frontmatter (name/description/triggers/category)
- [ ] 스킬당 트리거 키워드 6개 이상
- [ ] 본문 내 Claude 전용 표현 없음 (`grep -ri claude` — `source` 필드만 허용)
- [ ] `description` 200자 이내 (인덱스 주입 비용)

## 자동화

```bash
# 업스트림 claude-red에서 79개 스킬 전체를 내려받아 변환
npm run fetch:skills
```

`scripts/fetch-skills.ts`가 하는 일:

1. GitHub raw에서 각 SKILL.md 다운로드
2. frontmatter 파싱 → `triggers`/`category`/`source` 자동 생성
3. 본문 내 Claude 전용 표현 치환(정규식 규칙 테이블)
4. `skills/<category>/<name>/SKILL.md`로 저장
