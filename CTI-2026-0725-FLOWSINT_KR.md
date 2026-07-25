---
title: "Flowsint — OSINT 그래프 탐색 도구 리뷰"
subtitle: "사이버보안 분석가 및 OSINT 조사관을 위한 오픈소스 Maltego 대안"
description: "reconurge의 오픈소스 OSINT 그래프 탐색 도구 Flowsint에 대한 종합 리뷰. 기능, 아키텍처, Enricher, 경쟁 도구 현황, 보안 고려사항, CTI 워크플로우 평가를 다룹니다."
abstract: |
  Flowsint는 Apache 2.0 라이선스의 오픈소스 OSINT 그래프 탐색 플랫폼으로, 7,400개 이상의 GitHub 스타를 빠르게 확보했습니다. 로컬 중심의 프라이버시 아키텍처, Docker 기반 배포, 도메인, IP, 이메일, 암호화폐 지갑, 소셜 미디어를 포괄하는 모듈식 Enricher 생태계를 갖추고 있으며, Maltego의 오픈소스 대안으로 자리매김하고 있습니다. 본 보고서는 Flowsint의 기능, 보안 태세, CTI 분석가를 위한 운영 적합성에 대한 구조화된 리뷰를 제공합니다.
date: 2026-07-25
author: "Dennis Kim"
lang: ko
tags:
  - OSINT
  - Open-Source-Tool
  - Graph-Investigation
  - Tool-Review
  - Flowsint
  - Maltego-Alternative
  - Reconnaissance
keywords:
  - Flowsint
  - OSINT
  - 그래프 탐색
  - Maltego 대안
  - 오픈소스 도구
  - 사이버보안 도구
  - Enricher
group: tool-review
featured: false
schema_type: TechArticle
tlp: GREEN
severity: INFO
draft: false
---

| id             | CTI-2026-0725-FLOWSINT                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| 제목            | Flowsint — OSINT 그래프 탐색 도구 리뷰                                                    |
| 부제            | 사이버보안 분석가 및 OSINT 조사관을 위한 오픈소스 Maltego 대안                                |
| 저자            | Dennis Kim (HoKwang Kim)                                                                |
| 이메일          | <gameworker@gmail.com>                                                                  |
| github         | gameworkerkim                                                                            |
| 날짜            | 2026-07-25                                                                               |
| 분류            | TLP:GREEN                                                                                |
| 심각도          | INFO                                                                                     |
| 언어            | ko                                                                                      |
| 태그            | OSINT · Open-Source-Tool · Graph-Investigation · Tool-Review · Flowsint                 |
| 저장소          | [reconurge/flowsint](https://github.com/reconurge/flowsint)                              |
| 스타            | 7,400+                                                                                   |
| 라이선스        | Apache 2.0                                                                               |
| 프레임워크      | N/A (도구 리뷰)                                                                          |

# Flowsint — OSINT 그래프 탐색 도구 리뷰

> **보고서 ID** `CTI-2026-0725-FLOWSINT` | **발행일** 2026-07-25 | **분류** `TLP:GREEN` | **심각도** INFO
> **저자** Dennis Kim (HoKwang Kim) | <gameworker@gmail.com> | [@gameworkerkim](https://github.com/gameworkerkim)

*사이버보안 분석가 및 OSINT 조사관을 위한 오픈소스 Maltego 대안*

---

## 목차

1. 프로젝트 개요
2. 핵심 기능 및 아키텍처
3. Enricher 생태계
4. 경쟁 도구 비교
5. 보안 고려사항
6. CTI 워크플로우 운영 평가
7. 결론
8. 참고자료

---

## 1. 프로젝트 개요

**Flowsint** (`reconurge/flowsint`)는 Apache 2.0 라이선스의 오픈소스 OSINT 그래프 탐색 도구로, 시각적 그래프 인터페이스를 통해 엔티티 간의 관계를 매핑해야 하는 사이버보안 분석가, 언론인, 조사관을 위해 설계되었습니다.

| 항목               | 상세 정보                                                              |
| ------------------ | ---------------------------------------------------------------------- |
| 저장소             | [github.com/reconurge/flowsint](https://github.com/reconurge/flowsint) |
| 라이선스           | Apache 2.0                                                             |
| GitHub 스타        | 7,400+                                                                 |
| 포크               | 935                                                                    |
| 커밋               | 871                                                                    |
| 주요 언어          | Python (백엔드), TypeScript (프론트엔드)                               |
| 개발 단계          | 초기 개발 (pre-1.0, 활발함)                                            |
| 웹사이트           | [flowsint.io](https://flowsint.io)                                     |

### 핵심 원칙

- **윤리적 조사**: 합법적이고 윤리적인 OSINT 및 위협 인텔리전스 연구에만 사용
- **투명성**: Apache 2.0 라이선스의 완전한 오픈소스 코드베이스
- **검증**: 여러 데이터 소스를 교차 참조하는 자동화된 Enricher
- **로컬 중심 프라이버시**: 모든 데이터는 기본적으로 사용자 머신에 저장

Flowsint는 `ETHICS.md` 및 `DISCLAIMER.md`에 명시된 바와 같이, 무단 감시, 신상 털기(doxxing), 괴롭힘, 정치적 조작 목적의 사용을 명시적으로 금지합니다.

---

## 2. 핵심 기능 및 아키텍처

### 2.1 시각적 그래프 탐색

주요 인터페이스는 대화형 노드-엣지 그래프 시각화입니다. 분석가는 엔티티(도메인, IP, 개인, 조직, 이메일 주소, 암호화폐 지갑)를 생성하고, 자동화된 Enrichment 및 수동 연결을 통해 관계를 탐색합니다.

### 2.2 시스템 아키텍처

| 구성 요소           | 기술                | 역할                                    |
| ------------------- | ------------------- | --------------------------------------- |
| `flowsint-app`      | TypeScript (Vite)   | 대화형 그래프 프론트엔드 UI             |
| `flowsint-api`      | FastAPI (Python)    | REST API, 인증, 이벤트 스트림           |
| `flowsint-core`     | Python              | 오케스트레이터, Celery 작업, 볼트       |
| `flowsint-enrichers` | Python             | Enricher 모듈 및 스캐닝 로직            |
| `flowsint-types`    | Pydantic             | 데이터 모델 및 타입 정의                |
| 데이터베이스 (그래프) | Neo4j              | 엔티티-관계 그래프 저장소               |
| 데이터베이스 (관계형) | PostgreSQL         | 사용자 계정, 설정, 메타데이터           |
| 캐시 / 큐           | Redis + Celery      | 작업 큐 및 캐싱                         |

### 2.3 배포 모델

Docker Compose를 통한 완전한 컨테이너화. 단일 명령어 배포:

```
git clone https://github.com/reconurge/flowsint.git
cd flowsint
make prod
```

Linux, macOS, Windows를 지원합니다. 팀/서버 배포는 내부 프론트엔드 프록시 아키텍처로 기본 지원되며, 포트 5173만 노출됩니다. PostgreSQL, Redis, Neo4j, API는 localhost에 바인딩되어 프록시를 통해서만 접근 가능합니다.

### 2.4 주요 설계 결정

| 결정                      | 영향                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| 로컬 중심 저장소          | 클라우드 종속성 없음; 데이터 주권 보장                                   |
| Docker Compose 전용       | 베어메탈 설치 경로 없음; Docker 숙련도 필요                              |
| Neo4j를 그래프 DB로 채택  | Cypher를 통한 강력한 관계 쿼리, 학습 곡선 존재                           |
| 팀용 내부 프록시          | 단일 포트 노출로 네트워킹 단순화, 프로덕션 환경에서는 HTTPS 필요         |
| 모듈형 모노레포           | 관심사의 명확한 분리; Enricher 독립 개발 가능                            |

---

## 3. Enricher 생태계

Enricher는 엔티티를 입력으로 받아 관련 엔티티 또는 메타데이터를 생성하는 자동화된 모듈입니다. Flowsint는 광범위한 Enricher 세트를 기본 제공합니다.

### 3.1 도메인 Enricher

| Enricher              | 기능                                          |
| --------------------- | --------------------------------------------- |
| Reverse DNS           | IP를 가리키는 도메인 검색                      |
| DNS Resolution        | 도메인을 IP 주소로 해석                        |
| Subdomain Discovery   | 서브도메인 열거                                |
| WHOIS Lookup          | 도메인 등록 데이터 조회                        |
| Domain to Website     | 도메인을 웹사이트 엔티티로 변환                |
| Domain to Root Domain | 루트 도메인 추출                               |
| Domain to ASN         | 도메인을 자율 시스템 번호(ASN)에 매핑          |
| Domain History        | 과거 도메인 데이터 조회                        |

### 3.2 IP 및 ASN Enricher

| Enricher       | 기능                                   |
| -------------- | -------------------------------------- |
| IP Information | 지리 위치 및 네트워크 세부 정보         |
| IP to ASN      | IP를 자율 시스템(AS)에 매핑            |
| ASN to CIDRs   | ASN의 IP 범위 조회                     |
| CIDR to IPs    | 범위 내 개별 IP 열거                   |

### 3.3 신원 및 연락처 Enricher

| Enricher                | 기능                                               |
| ----------------------- | -------------------------------------------------- |
| Maigret                 | 2,500개 이상의 소셜 플랫폼에서 사용자명 검색       |
| Email to Gravatar       | 이메일에서 Gravatar 프로필 검색                    |
| Email to Breaches       | 유출 데이터베이스와 이메일 교차 참조               |
| Email to Domains        | 이메일과 연결된 도메인 검색                        |
| Phone to Breaches       | 유출 데이터베이스와 전화번호 교차 참조             |
| Individual to Org       | 조직 소속 관계 검색                                |
| Individual to Domains   | 개인과 연결된 도메인 검색                          |

### 3.4 조직 및 인프라 Enricher

| Enricher                 | 기능                                      |
| ------------------------ | ----------------------------------------- |
| Organization to ASN      | 조직이 소유한 ASN 검색                     |
| Organization Information | 회사 등록 세부 정보 조회                   |
| Organization to Domains  | 조직이 소유한 도메인 검색                  |

### 3.5 암호화폐 Enricher

| Enricher               | 기능                                  |
| ---------------------- | ------------------------------------- |
| Wallet to Transactions | 거래 내역 조회                        |
| Wallet to NFTs         | 지갑이 보유한 NFT 식별                |

### 3.6 웹사이트 Enricher

| Enricher              | 기능                                    |
| --------------------- | --------------------------------------- |
| Website Crawler       | 웹사이트 구조 크롤링 및 매핑            |
| Website to Links      | 모든 외부 링크 추출                     |
| Website to Domain     | URL에서 도메인 추출                     |
| Website to Webtrackers | 추적/분석 스크립트 식별                |
| Website to Text       | 일반 텍스트 콘텐츠 추출                 |

### 3.7 통합 Enricher

| Enricher        | 기능                                          |
| --------------- | --------------------------------------------- |
| N8n Connector   | Flowsint를 N8n 자동화 워크플로우에 연결        |

---

## 4. 경쟁 도구 비교

### 4.1 직접 비교

| 도구              | 라이선스          | 유형             | Flowsint 대비 주요 차별점                                      |
| ----------------- | ----------------- | ---------------- | --------------------------------------------------------------- |
| **Maltego**       | 상용 (Freemium)   | 그래프 OSINT     | 업계 표준, 성숙한 Transform 라이브러리, 유료 티어               |
| **SpiderFoot**    | GPL-3.0           | 자동화 스캔      | 200개 이상의 OSINT 소스, CLI 중심, 강력한 자동화               |
| **Recon-ng**      | MIT               | CLI 프레임워크   | Metasploit 스타일 모듈식 정찰, 터미널 전용                      |
| **SpectraGraph**  | 오픈소스          | 그래프 스튜디오  | 대화형 그래프 워크스페이스, 유사한 시각적 접근 방식             |
| **PANO**          | 오픈소스          | 그래프 + AI      | 타임라인 뷰 + Flowsint 범위를 넘는 AI 지원                      |
| **Helix**         | 오픈소스          | 신원 그래프      | D3.js 실시간 관계 그래프, 신원 매핑 중심                        |
| **Flowintel**     | 오픈소스          | 케이스 관리      | 탐색이 아닌 조사 케이스/협업 관리                               |

### 4.2 Flowsint의 포지셔닝

Flowsint는 독특한 틈새를 차지하고 있습니다:

- **Maltego 대안**: Maltego의 그래프 기반 OSINT 워크플로우에 대한 오픈소스 대체재로 가장 자주 언급됨
- **시각화 우선**: SpiderFoot 및 Recon-ng(CLI 중심)와 달리, Flowsint는 대화형 시각적 탐색을 우선시합니다
- **로컬 프라이버시**: 대부분의 경쟁 도구는 클라우드 계정이 필요하거나 텔레메트리를 전송합니다
- **Reconurge 생태계**: 형제 도구(Recontrack, Reconcrawl)와의 긴밀한 통합
- **균형 잡힌 접근**: 자동화된 Enricher와 수동 그래프 조작을 결합

---

## 5. 보안 고려사항

### 5.1 보고된 취약점

Flowsint는 초기 개발 단계에 있으며 여러 CVE가 보고되었습니다. 분석가는 민감한 환경에 배포하기 전에 위험 허용도를 평가해야 합니다.

| CVE ID              | 유형                        | 설명                                                                      | 상태            |
| -------------------- | --------------------------- | ------------------------------------------------------------------------ | --------------- |
| CVE-2026-32311       | OS 명령어 주입              | `org_to_asn` Enricher가 조작된 입력을 통한 명령어 주입에 취약            | 보고됨          |
| CVE-2026-44352       | 접근 제어                   | 사용자가 다른 사용자의 스케치 로그를 볼 수 있었음 (pre-v1.2.3)           | 1.2.3에서 패치됨 |
| CVE-2026-42156       | Cypher 쿼리 주입            | 정제되지 않은 엔티티 입력을 통한 그래프 쿼리 주입                        | 보고됨          |

### 5.2 운영 보안 권장사항

1. **네트워크 격리**: 격리된 VLAN 또는 전용 분석 VM에 배포하십시오
2. **공개 인터넷에 노출 금지**: 내부 프록시 아키텍처는 LAN/신뢰 네트워크용으로 설계되었습니다. 공개 접근이 필요한 경우, HTTPS 종료를 수행하는 리버스 프록시를 앞에 배치하십시오
3. **기본 비밀번호 변경**: `.env` 파일에는 `AUTH_SECRET`, `MASTER_VAULT_KEY_V1`, `NEO4J_PASSWORD`에 대한 플레이스홀더 값이 포함되어 있습니다. 배포 전에 고유한 값을 생성하십시오
4. **업데이트 모니터링**: 패치를 위해 [CHANGELOG.md](https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md) 및 GitHub Security Advisories를 추적하십시오
5. **프로덕션 준비 상태**: 현재 개발 단계에서 Flowsint는 프로덕션 분석 워크플로우보다 연구 및 테스트 환경에 더 적합합니다

### 5.3 공급망 위험

- 여러 기여자의 871개 커밋; 단일 벤더 종속 없음
- Docker 이미지는 GitHub Container Registry(`ghcr.io`)에서 가져옵니다. 가능한 경우 이미지 서명을 확인하십시오
- Python 종속성 체인은 `uv`/`pyproject.toml`을 통해 관리됩니다. 배포 전에 `pip-audit` 또는 유사한 도구로 감사하십시오

---

## 6. CTI 워크플로우 운영 평가

### 6.1 Flowsint의 적합 영역

| CTI 워크플로우 단계        | Flowsint 활용도                                         | 평가        |
| ------------------------- | ------------------------------------------------------- | ----------- |
| 초기 정찰                 | 도메인/IP/ASN Enricher가 신속한 매핑 제공               | 높음        |
| 엔티티 귀속               | Maigret, 이메일-유출 매칭, 지갑 추적                    | 중간-높음   |
| 인프라 매핑               | ASN-to-CIDRs, 역방향 DNS, 서브도메인 발견               | 높음        |
| 관계 발견                 | Neo4j Cypher 쿼리를 통한 그래프 시각화                   | 높음        |
| 보고서 생성               | 스크린샷/그래프 내보내기; 내장 보고서 템플릿 없음        | 낮음-중간   |
| 팀 협업                   | 서버 배포로 다중 사용자 지원; RBAC 미구현               | 중간        |
| 증거 보존                 | 로컬 저장소; 내장 연속성 관리 기능 없음                  | 낮음        |

### 6.2 권장 사용 사례

- 단일 지표로부터 공격자 인프라(도메인, IP, ASN) 매핑
- 랜섬웨어/APT 조사에서 암호화폐 지갑 관계 추적
- 유출 데이터베이스 및 소셜 플랫폼 전반에서 이메일 주소와 사용자명 교차 참조
- 공급망 위험 평가를 위한 조직 연계 차트 구축

### 6.3 프로덕션 CTI의 한계

- SIEM/SOAR 플랫폼으로의 프로그래밍 방식 그래프 내보내기를 위한 API 없음
- 내장 IoC 공유 형식 없음 (STIX/MISP 내보내기 미지원)
- 초기 단계 안정성 -- 릴리스 간 주요 변경 가능성 있음
- 문서 미완성; Discord를 통한 커뮤니티 지원만 제공

---

## 7. 결론

Flowsint는 오픈소스 OSINT 그래프 탐색 도구로서, Maltego 대안으로 빠르게 커뮤니티의 주목(7,400+ 스타)을 받고 있는 유망한 프로젝트입니다. 로컬 중심의 프라이버시 아키텍처, 광범위한 Enricher 생태계, Docker 기반 배포 방식은 개인 분석가와 소규모 팀이 접근하기 쉽게 만듭니다.

**강점**: 시각적 그래프 탐색, 모듈식 Enricher 아키텍처, 클라우드 종속성 없음, Apache 2.0 라이선스, 도메인/IP/이메일/암호화폐/소셜 미디어를 포괄하는 Enricher 생태계.

**약점**: 초기 개발 단계(pre-1.0), 모니터링이 필요한 문서화된 CVE 존재, STIX/MISP 내보내기 없음, Docker 전용 배포, 문서 미완성.

**평결**: CTI 연구 및 실험실 환경에 적합합니다. 추가적인 보안 강화 및 격리 없이 프로덕션 분석 파이프라인에 사용하는 것은 아직 권장되지 않습니다. 프로젝트의 발전 궤적(871 커밋, 활발한 커뮤니티, 빠른 스타 증가)은 지속적인 모니터링을 정당화하며, 오픈소스 OSINT 도구 키트의 표준 도구가 될 잠재력을 가지고 있습니다.

> **면책 조항**: Flowsint는 합법적이고 윤리적인 조사 및 연구 목적으로만 설계되었습니다. 무단 감시, 신상 털기, 괴롭힘, 또는 모든 불법적 사용은 프로젝트의 ETHICS.md 가이드라인에 따라 금지됩니다.

---

## 8. 참고자료

[1] reconurge/flowsint -- GitHub 저장소. <https://github.com/reconurge/flowsint>

[2] Flowsint 공식 사이트. <https://flowsint.io>

[3] Flowsint ETHICS.md. <https://github.com/reconurge/flowsint/blob/main/ETHICS.md>

[4] Flowsint DISCLAIMER.md. <https://github.com/reconurge/flowsint/blob/main/DISCLAIMER.md>

[5] Flowsint CHANGELOG.md. <https://github.com/reconurge/flowsint/blob/main/CHANGELOG.md>

[6] Maltego -- 상용 OSINT 그래프 플랫폼. <https://www.maltego.com>

[7] SpiderFoot -- 오픈소스 OSINT 자동화. <https://github.com/smicallef/spiderfoot>

[8] Recon-ng -- 웹 정찰 프레임워크. <https://github.com/lanmaster53/recon-ng>

---

(c) 2026 Dennis Kim (HoKwang Kim) | 독립 CTI 아카이브 (TLP:GREEN)
연락처: <gameworker@gmail.com> | GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
