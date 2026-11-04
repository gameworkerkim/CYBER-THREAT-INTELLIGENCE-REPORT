# 아키텍처

**언어:** [English](../architecture.md)(기준) · 한국어(본 문서) · [日本語](architecture.md) · [中文](architecture.md)

## 개요

Open AI Red Team 미들웨어는 **Claude Skills 시스템**(progressive disclosure + 트리거 기반 온디맨드 로딩)을
OpenAI 호환 API만 제공하는 모델들(DeepSeek, GLM, 오픈웨이트)에 재현하는 레이어입니다.

## 컴포넌트

```
┌─────────────────────────────────────────────────────────────┐
│                          CLI / Library                       │
│                    src/cli.ts  ·  src/index.ts               │
├─────────────────────────────────────────────────────────────┤
│  Skill Engine                      Provider Layer            │
│  ┌──────────────────────┐          ┌──────────────────┐     │
│  │ loader.ts            │          │ base.ts          │     │
│  │  - SKILL.md 파싱     │          │  - OpenAI 호환    │     │
│  │  - frontmatter/body  │          │    요청/스트리밍  │     │
│  ├──────────────────────┤          ├──────────────────┤     │
│  │ trigger.ts           │          │ deepseek.ts      │     │
│  │  - 키워드/정규식 매칭 │          │ glm.ts           │     │
│  │  - 스코어링/랭킹      │          │ openweight.ts    │     │
│  ├──────────────────────┤          │  (Ollama/vLLM/   │     │
│  │ inject.ts            │          │   LM Studio 등)   │     │
│  │  - 시스템 프롬프트    │          └──────────────────┘     │
│  │    조립               │                                   │
│  └──────────────────────┘                                   │
├─────────────────────────────────────────────────────────────┤
│                     skills/ (포팅된 SKILL.md)                │
└─────────────────────────────────────────────────────────────┘
```

## 데이터 흐름 (1턴 처리)

```
사용자 입력
   │
   ▼
1. 트리거 매칭 ──────────────► 매칭된 스킬 목록 (스코어 순, maxSkills 제한)
   │
   ▼
2. 시스템 프롬프트 조립
   │  ┌─ 베이스 프롬프트 (운영자 페르소나, 교전 규칙)
   │  ├─ 스킬 인덱스 (모든 스킬: name + description + 트리거 힌트)
   │  └─ 선택된 스킬 본문 (full SKILL.md body)
   ▼
3. Provider 호출 (OpenAI 호환 chat.completions)
   │
   ▼
4. 응답 스트리밍 → 사용자
```

## 스킬 포맷

포팅된 스킬은 Claude 원본과 동일한 `SKILL.md` 구조를 유지하되, frontmatter를 확장합니다.

```markdown
---
name: offensive-sqli
description: "SQL injection testing skill ..."
triggers:
  - "sql injection"
  - "sqli"
  - "sqlmap"
  - "sql 인젝션"
category: web
model_note: "모델 비종속 — OpenAI 호환 API(DeepSeek/GLM/Ollama 등)에서 동작"
source: "https://github.com/SnailSploit/Claude-Red (MIT)"
---

# SQL Injection — Offensive Testing Methodology
...
```

### 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `name` | O | 스킬 식별자 (디렉토리명과 일치) |
| `description` | O | 인덱스에 항상 주입되는 요약 (짧게, 200자 이하) |
| `triggers` | O | 자동 로딩용 키워드/정규식 (`/regex/` 형식), 한·영 |
| `category` | O | 포팅 카테고리 (web, infrastructure, api, cloud, ai, wireless 등) |
| `model_note` | X | 모델별 주의사항 |
| `source` | X | 원본 출처 (attribution) |

## Progressive Disclosure 재현

Claude Skills의 핵심 원리 — **스킬 본문은 필요할 때만 컨텍스트에 들어간다**:

1. **인덱스(description)는 항상 주입** — 79개 스킬 × 약 150자 ≈ 3K 토큰.
2. **본문은 트리거 매칭 시에만 주입** — 기본 최대 3개(`ORT_MAX_SKILLS`).
3. **명시적 요청** — `/use offensive-sqli` 또는 `--skills` 플래그.

## Provider 추상화

모든 대상이 OpenAI 호환 API를 제공하므로 단일 `BaseProvider`(openai SDK)를 사용합니다.

| 프로바이더 | baseURL | 인증 | 특이사항 |
|-----------|---------|------|---------|
| DeepSeek | `https://api.deepseek.com/v1` | Bearer API key | `deepseek-reasoner`는 `reasoning_content` 별도 반환 |
| GLM | `https://open.bigmodel.cn/api/paas/v4` | Bearer API key | 일부 모델은 `reasoning_content` 필드 반환 |
| Open-weight | Ollama `http://localhost:11434/v1`, vLLM 등 | any/dummy | 컨텍스트 길이·포맷 편차 큼 |

## 컨텍스트 예산 관리

- 스킬 본문 평균 8–15K 토큰 → 전체 인덱스 + 최대 3개 본문 ≈ 50K 토큰.
- DeepSeek 64K–128K, GLM-4 128K, Qwen2.5 32K+ → 기본 설정으로 수용 가능.
- 소형 오픈웨이트 모델은 `ORT_MAX_SKILLS=1`, `ORT_INCLUDE_INDEX=off` 권장.
