# Porting Guide

claude-red 스킬(SKILL.md)을 모델 비종속 스킬로 포팅하는 규칙과 절차.

## 포팅 순서

```
Web Application → Infrastructure & Red Team → API Security → Cloud → AI Security
```

## 변환 규칙

### 1. Frontmatter 확장

원본 frontmatter(`name`, `description`)를 유지하고 아래 필드를 추가합니다.

| 추가 필드 | 규칙 |
|-----------|------|
| `triggers` | 스킬 사용을 유발하는 키워드 6–12개. 소문자, 동의어/툴명/공격명 포함. 정규식은 `/.../` 형태 |
| `category` | 포팅 단계 카테고리: `web` / `infrastructure` / `api` / `cloud` / `ai` |
| `model_note` | (선택) 모델별 주의사항 |
| `source` | `https://github.com/SnailSploit/Claude-Red (MIT)` |

### 2. Claude 의존성 제거

- "Claude Code", "Claude.ai", "claude-skills.json", "Claude Skills 시스템" 등 Claude 특화 표현 → 모델 중립 표현으로 교체
- 예: `cat SKILL.md | claude --system-file -` → 미들웨어 `--skills` 플래그 사용법
- Anthropic API/모델명 언급 → OpenAI 호환 프로바이더 기준으로 일반화

### 3. 본문(마크다운) 유지

- 공격 방법론 본문은 그대로 유지 (기술 내용은 모델 비종속)
- 툴 커맨드는 그대로 (칼리/보안툴은 플랫폼 비종속)
- 프롬프트 페이로드 섹션은 유지 (대상 모델 공격용 아님, 대상 *시스템* 공격 방법론이므로)

### 4. 검증 체크리스트

- [ ] frontmatter가 유효한 YAML (name/description/triggers/category)
- [ ] triggers에 핵심 키워드 6개 이상
- [ ] 본문 내 Claude 전용 표현 없음 (`grep -ri claude`)
- [ ] description 200자 이내 (인덱스 주입 비용)

## 자동화

```bash
# 원본 claude-red에서 5개 카테고리 스킬을 내려받아 변환
npm run fetch:skills

# 로컬 claude-red 클론이 있다면
npm run fetch:skills -- --source ~/claude-red
```

`scripts/fetch-skills.ts`가 하는 일:
1. GitHub raw에서 대상 카테고리별 SKILL.md 다운로드
2. frontmatter 파싱 → `triggers`/`category`/`source` 자동 생성
3. 본문 내 Claude 전용 표현 치환(정규식 규칙 테이블)
4. `skills/<category>/<name>/SKILL.md`로 저장
