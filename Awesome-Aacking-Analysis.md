---
title: "jekil/awesome-hacking 프로젝트 분석 — 서브모듈 기반 보안 도구 큐레이션"
subtitle: "색인·일괄 클론의 실익과, 악성코드 소스·공급망·EDR 충돌 리스크"
description: "jekil/awesome-hacking(awesomehacking.org)의 서브모듈 구조, 클론·갱신 방법, 장단점, 유사 awesome 리스트와의 차이, 격리 환경 실무 권고를 정리했다."
abstract: |
  Alessandro Tanasi(@jekil)의 awesome-hacking은 펜테스트·포렌식·멀웨어·CTI 도구를 주제별 디렉터리로 분류하고, 다수를 git 서브모듈로 고정 커밋 참조한다.
  색인·오프라인 반입에는 유효하나, Malware/Source Code에 실제 악성코드 소스가 포함되어 업무용 재귀 클론은 EDR·정책 위반 위험이 크다.
  git pull만으로는 서브모듈이 갱신되지 않으며, 조직 도입 시 격리 VM·승인·샘플 취급 절차가 전제다.
summary_for_ai: |
  Tech/CTI analysis of github.com/jekil/awesome-hacking (Readme.rst, ~3.9k stars, as of 2026-07).
  Not the same as Hack-with-Github/Awesome-Hacking (link hub only). Recursive clone pulls real malware source samples — lab/VM only.
  Recommend: browse awesomehacking.org for index; selective submodule init; avoid --remote updates without trust review.
date: 2026-07-24
author: "Dennis Kim"
lang: ko
tags:
  - Awesome-Hacking
  - Pentest
  - Tooling
  - Submodule
  - DFIR
  - Malware-Lab
keywords:
  - awesome-hacking
  - jekil
  - awesomehacking.org
  - 펜테스트 도구
  - git submodule
  - 보안웨어 샘플
  - 보안 보안 큐레이션
group: other
featured: true
featured_rank: 2
schema_type: TechArticle
tlp: GREEN
severity: MEDIUM
draft: false
---

# jekil/awesome-hacking 프로젝트 분석 — 서브모듈 기반 보안 도구 큐레이션

| 항목 | 내용 |
|---|---|
| 저장소 | github.com/jekil/awesome-hacking |
| 관리자 | Alessandro Tanasi (@jekil) |
| 공식 사이트 | awesomehacking.org |
| 기본 브랜치 | master |
| README 파일 | `Readme.rst` (reStructuredText, Markdown 아님) |
| 규모 | 약 3.9k stars / 628 forks / 583 commits |
| 저장소 생성 | 2016년 |
| 확인 시점 | 2026년 7월 |

해킹, 펜테스팅, 보안 연구 도구를 주제별로 분류한 큐레이션 저장소다. 단순 링크 목록이 아니라 다수 도구를 **git 서브모듈(submodule)** 로 포함하고 있어, 재귀 클론으로 도구 소스 전체를 한 번에 내려받을 수 있는 구조다.

---

## 1. 저장소 구조

최상위 디렉터리가 곧 카테고리다. 각 디렉터리 하위에 개별 도구가 서브모듈로 고정 커밋 참조 형태로 등록되어 있다.

| 카테고리 | 하위 분류 |
|---|---|
| CTF Tools | — |
| Code Auditing | Static Analysis |
| Cryptography | — |
| Docker | — |
| Forensics | File / Image / Incident Response / Live Analysis / Memory / Misc / Mobile / Network |
| Hardware Hacking | Computer |
| Intelligence | — |
| Library | C / Go / Java / Python / Ruby |
| Live CD - Distributions | — |
| Malware | Dynamic Analysis / Honeypot / Intelligence / Ops / Source Code / Static Analysis |
| Network | Analysis / Fake Services / Packet Manipulation / Sniffer |
| Penetration Testing | DoS / Exploiting / Exploits / Fuzzing / Info Gathering / MITM / Mobile / Password Cracking / Port Scanning / Post Exploitation / Reporting / Services / Training / Web / Wireless |
| Reverse Engineering | — |
| Security | Asset Management / Cloud / DevOps / Endpoint / Identity / Network / Orchestration / Phishing / Privacy |
| Social Engineering | Framework / Harvester / Phishing / Wardialing |

빌드 관련 파일은 `Makefile`, `requirements.txt`(문서 생성용), `.travis.yml`, `.gitmodules`가 있다.

---

## 2. 사용 방법

### 클론

```bash
git clone --recursive https://github.com/jekil/awesome-hacking.git
```

### 업데이트

README는 `git pull` 한 줄만 안내하지만, **이 명령만으로는 서브모듈 내용이 갱신되지 않는다.** `git pull`은 상위 저장소가 참조하는 커밋 포인터만 가져올 뿐이다. 실제 도구 소스까지 반영하려면 다음이 필요하다.

```bash
# 상위 저장소가 가리키는 커밋으로 서브모듈 동기화
git pull
git submodule update --init --recursive

# 각 도구의 최신 원격 브랜치까지 당겨오려면
git submodule update --remote --recursive
```

### 참조 방식

이 저장소는 도구의 **색인(index)** 이다. 각 도구의 설치·사용법은 해당 도구의 공식 문서를 따라야 한다.

---

## 3. 장점

| 번호 | 항목 | 설명 |
|---|---|---|
| 1 | 분류 체계 | 15개 상위 카테고리, 40개 이상 하위 분류로 수백 개 도구를 정리해 탐색 비용이 낮다 |
| 2 | 소스 일괄 확보 | 서브모듈 구조 덕분에 오프라인·격리망 환경으로 도구 소스를 한 번에 반입할 수 있다 |
| 3 | 커밋 고정 | 각 서브모듈이 특정 커밋에 고정되어 있어, 특정 시점의 도구 스냅샷을 재현할 수 있다 |
| 4 | 지속 갱신 | 2026년 등록 CVE 익스플로잇, SBOM 분석 도구, eBPF 기반 메모리 포렌식 등 최신 항목이 반영되어 있어 유지보수가 계속되고 있다 |
| 5 | 커버리지 폭 | 공격 도구뿐 아니라 포렌식, DFIR, 허니팟, CTI, 클라우드·컨테이너 보안까지 포괄한다 |
| 6 | 문서화 자산 | 정적 사이트(awesomehacking.org)로도 발행되어 검색·열람이 가능하다 |

---

## 4. 단점 및 리스크

| 번호 | 항목 | 설명 |
|---|---|---|
| 1 | 실제 악성코드 소스 포함 | Malware/Source Code 카테고리에 Zeus, Mirai, Carberp, TinyNuke, AsyncRAT, Pegasus 디컴파일본, 루트킷 등의 실제 소스가 서브모듈로 포함된다. 업무용 단말에서 재귀 클론 시 EDR·백신 탐지, 격리, 보안 정책 위반 사고로 직결된다 |
| 2 | 클론 비용 | 서브모듈이 수백 개이므로 `--recursive` 클론은 용량과 시간이 크게 소요된다. 색인 열람이 목적이라면 재귀 클론은 불필요하다 |
| 3 | 공급망 리스크 | 상위 저장소는 링크만 관리하며, 실제 코드 신뢰성은 각 서드파티 저장소 소유자에게 의존한다. 서브모듈 대상 저장소가 탈취되거나 소유권이 이전되면 그대로 전파된다. 특정 커밋 고정은 완화 요소이나, `--remote` 갱신 시 이 방어선이 사라진다 |
| 4 | 문서 자체 오류 | README의 업데이트 안내(`git pull`)가 서브모듈 갱신을 실제로 수행하지 못한다 |
| 5 | 링크 부패 | 오래된 항목 중 URL이 깨지거나 프로젝트가 종료된 도구가 존재한다(예: Live Analysis의 OS X Auditor 항목은 링크가 손상된 상태) |
| 6 | 초보자 진입 장벽 | 도구별 사용법, 선택 기준, 학습 경로에 대한 안내가 없다. 유사 기능 도구가 병렬 나열되어 있어 숙련자를 전제로 한다 |
| 7 | CI 노후 | `.travis.yml`을 사용한다. Travis CI는 오픈소스 지원 정책이 축소된 상태로, 빌드 파이프라인이 정상 동작하지 않을 가능성이 있다 |
| 8 | 법적·윤리적 전제 | 수록 도구 상당수는 무단 사용 시 법적 책임이 발생한다. 권한 있는 대상, 통제된 환경, 문서화된 승인 범위 내에서만 사용해야 한다 |

---

## 5. 유사·경쟁 프로젝트

| 프로젝트 | 성격 | jekil 판과의 차이 |
|---|---|---|
| Hack-with-Github/Awesome-Hacking | 보안 분야 awesome 리스트를 모은 상위 인덱스. 스타 규모가 압도적으로 크다 | 도구 소스를 포함하지 않는 순수 링크 허브. 주제별 하위 리스트로 분기하는 구조 |
| carpedm20/awesome-hacking | 해킹 튜토리얼·도구·자료 큐레이션 | 학습 자료와 튜토리얼 비중이 높다 |
| Hunterdii/Awesome-Hacking | 입문자 로드맵과 치트시트를 포함한 리소스 허브 | 초보자 온보딩 자료가 있으나 도구 소스 통합은 없다 |
| 0xh4di/awesome-hacking, vaimalaviya1233/awesome-hacking-list | jekil 판의 사본 또는 포크. 소개 문구와 구조가 동일하다 | 원본 대비 갱신 시점이 뒤처질 수 있으므로 원본 사용이 권장된다 |

---

## 6. 실무 권장 사항

| 상황 | 권장 방식 |
|---|---|
| 도구 탐색·색인 열람 | awesomehacking.org 또는 GitHub 웹 열람. 클론 불필요 |
| 특정 도구만 필요 | `git clone --no-recurse-submodules` 후 필요한 서브모듈만 `git submodule update --init <경로>` |
| 전체 소스 확보 | 격리된 분석 VM 또는 전용 랩 환경에서만 재귀 클론. 업무용 단말·공용 파일서버 금지 |
| 조직 도입 | 보안팀 사전 승인, 저장 위치 예외 처리, 악성코드 샘플 취급 절차와 연동 |

---

## 7. 종합 평가

색인으로서의 가치는 명확하다. 분류 체계가 실무 도메인과 잘 맞고, 최근 항목까지 반영되어 있어 도구 탐색 출발점으로는 여전히 유효하다.

문제는 "한 줄 명령으로 전체 툴셋을 받는다"는 프로젝트의 핵심 세일즈 포인트다. 이 구조는 오프라인 반입에는 유용하지만, 실제 악성코드 소스를 포함한 수백 개 서드파티 저장소를 검증 없이 로컬에 내려받는 행위이기도 하다. 방어 관점에서 보면 클론 한 번이 인시던트 티켓 하나다.

또한 README가 안내하는 갱신 절차가 실제로는 도구를 갱신하지 못한다는 점은, 이 저장소를 "관리되는 툴셋"이 아니라 "색인 + 스냅샷"으로 취급해야 한다는 근거다. 도구 최신성이 필요한 작업이라면 개별 저장소를 직접 추적하는 편이 정확하다.
