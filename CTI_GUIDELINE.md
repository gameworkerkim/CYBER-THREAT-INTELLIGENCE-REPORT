# CTI 리포트 발행 가이드라인 · 템플릿

> **대상:** [CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT) 루트 MD  
> **사이트:** [cti.vibequant.cc](https://cti.vibequant.cc/) (Docs와 동일 UX: 추천 · 그룹 · 검색)  
> **원칙:** GitHub MD 원천 → `VibeQuant/content` 빌드 → Cloudflare Pages  
> **작성자 표기:** Dennis Kim · 前 싸이월드 대표  
> 칼럼 가이드와 동일 스키마: [COLUMN_GUIDELINE](https://github.com/gameworkerkim/vibe-investing/blob/main/02.Investment%20Idea%20Column/COLUMN_GUIDELINE.md) · [COLUMN_TEMPLATE](https://github.com/gameworkerkim/vibe-investing/blob/main/02.Investment%20Idea%20Column/COLUMN_TEMPLATE.md)

이 파일(`CTI_GUIDELINE.md` / `CTI_TEMPLATE.md`)은 사이트 목록에 올라가지 않습니다.

---

## 1. frontmatter (신규 필수)

```yaml
---
title: "리포트 제목"
subtitle: "부제 한 줄"
description: "80–120자. 카드·OG·meta description용."
abstract: |
  2–4문장. 쟁점·영향·권고 힌트.
summary_for_ai: |
  (선택) 에이전트용. TLP·전제·한계 명시.
date: 2026-07-18
author: "Dennis Kim"
lang: ko
tags: [Weekly-Brief, Korea-Impact]
keywords: ["주간 CTI", "의료 인프라"]
group: weekly
featured: false
featured_rank: 99
schema_type: TechArticle
tlp: GREEN
severity: HIGH
draft: false
---
```

| 필드 | 용도 |
|------|------|
| `title` / `description` | SEO · OG · 카드 |
| `abstract` / `summary_for_ai` | llms.txt · 인용 · GEO |
| `date` | sitemap · JSON-LD |
| `featured` / `featured_rank` | 추천 섹션 |
| `group` | 주제 그룹 (없으면 파일명 규칙) |
| `tlp` / `severity` | CTI 메타 (표시용) |
| `draft: true` | 사이트·sitemap 제외 |

---

## 2. 그룹 ID

| ID | 표시 |
|----|------|
| `weekly` | 주간 브리프 |
| `dprk` | 북한 · Lazarus · Kimsuky |
| `ai-supply` | AI · LLM 공급망 |
| `korea-breach` | 한국 침해 · 국내 |
| `apt-global` | APT · 글로벌 위협 |
| `vuln-patch` | 취약점 · 패치 |
| `crypto-web3` | 크립토 · Web3 |
| `cloud-saas` | 클라우드 · SaaS |
| `other` | 기타 CTI |

---

## 3. 본문 구조

```text
---
frontmatter
---

# 제목
## 부제 (선택)
날짜 / 저자

---

## 1. 요약 / 핵심
(표·메타만으로 시작하지 말 것)
```

- H1 하나. 파일명 `CTI-YYYY-MMDD-TOPIC_LANG.md` 권장.
- 기존 파이프 테이블 헤더는 빌드가 스킵하지만, **신규는 frontmatter 우선**.

---

## 4. 체크리스트

- [ ] `title`, `description`, `date`, `draft`
- [ ] `description` 문장 완결 (120자 내)
- [ ] TLP·면책 (필요 시)
- [ ] 추천 시 `featured` + `featured_rank`

---

## 5. 복사 템플릿

`CTI_TEMPLATE.md` 참고.
