# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20CN-lightgrey?style=flat-square)
![Last Update](https://img.shields.io/badge/Last%20Update-2026--05--30-informational?style=flat-square)

🌐 **언어 (Languages):** **한국어** · [English](README_EN.md) · [中文](README_CN.md) · [日本語](README_JP.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

*This repository is an independent archive of open-source cyber threat intelligence (CTI) reports, intended for defensive, research, and policy purposes. All reports are OSINT-based and do not represent the official position of any organization.*

---

## 📇 About the Analyst

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · Independent Threat Intelligence Analyst |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## ⭐ Latest Reports — Featured

> 🆕 **2026-05-30 발행** — 한국 언론 미보도 위협 4건을 4개 언어(KR·EN·JP·CN)로 동시 공개

### 1. AI 에이전트가 운전대를 잡다 — LLM 주도형 침해의 첫 관측 사례

*Marimo CVE-2026-39987 사전인증 RCE에서 내부 DB 탈취까지, 1시간 미만의 4단계 자율 피벗*

Sysdig TRT가 기록한 **최초의 "AI 에이전트 주도형 침해"**. 노출된 Marimo 노트북의 사전인증 RCE를 시작으로, 클라우드 자격증명 탈취 → AWS Secrets Manager SSH 키 회수 → SSH 베스천 경유 → 내부 PostgreSQL 전체 덤프까지 전 과정을 LLM 에이전트가 자율 운용했다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0530-MARIMO` |
| **심각도** | 🔴 CRITICAL |
| **CVE** | `CVE-2026-39987` (CVSS 9.3 · CISA KEV) |
| **다운로드** | [🇰🇷 KR](CTI-2026-0530-MARIMO_KR.md) · [🇬🇧 EN](CTI-2026-0530-MARIMO_EN.md) · [🇯🇵 JP](CTI-2026-0530-MARIMO_JP.md) · [🇨🇳 CN](CTI-2026-0530-MARIMO_CN.md) |

### 2. 미패치 Critical RCE — Gogs git rebase 인자 주입 취약점

*인증된 일반 사용자가 셀프호스팅 Git 서버를 장악하는 9.4점 결함, 그리고 교차 테넌트 침해*

악성 브랜치명으로 `git rebase`의 `--exec` 플래그를 주입해 서버에서 임의 코드를 실행한다. 메인테이너 보고(2026-03-17) 이후에도 **미패치**이며 공개 Metasploit 모듈까지 존재한다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0530-GOGS` |
| **심각도** | 🔴 HIGH |
| **CVE** | 미부여 (Rapid7 산정 CVSS 9.4) |
| **다운로드** | [🇰🇷 KR](CTI-2026-0530-GOGS_KR.md) · [🇬🇧 EN](CTI-2026-0530-GOGS_EN.md) · [🇯🇵 JP](CTI-2026-0530-GOGS_JP.md) · [🇨🇳 CN](CTI-2026-0530-GOGS_CN.md) |

### 3. JINX-0164 — 가상자산 기업을 겨냥한 macOS 멀웨어·공급망 위협 행위자

*LinkedIn 사회공학, AUDIOFIX·MINIRAT, 그리고 @velora-dex/sdk npm 공급망 침해*

LinkedIn 채용 미끼로 개발자 단말을 장악한 뒤 CI/CD·코드 배포 인프라로 이동하는 금전 동기 클러스터. 북한 클러스터와 기법은 유사하나 인프라 중첩은 없다(Wiz).

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0530-JINX` |
| **심각도** | 🔴 HIGH |
| **위협 행위자** | JINX-0164 (DPRK 기법 유사, 인프라 중첩 없음) |
| **다운로드** | [🇰🇷 KR](CTI-2026-0530-JINX_KR.md) · [🇬🇧 EN](CTI-2026-0530-JINX_EN.md) · [🇯🇵 JP](CTI-2026-0530-JINX_JP.md) · [🇨🇳 CN](CTI-2026-0530-JINX_CN.md) |

### 4. ChatGPhish — AI 요약을 피싱 표면으로 바꾸는 ChatGPT 렌더러 신뢰 결함

*마크다운 링크·이미지의 암묵적 신뢰, 간접 프롬프트 인젝션, 그리고 QR 코드 피벗*

`chatgpt.com` 렌더러가 요약 대상 제3자 페이지의 마크다운 링크·이미지를 신뢰해 자동 로드·클릭 요소로 노출한다. 피싱·가짜 시스템 경고·QR 피벗과 IP/UA/Referer 유출이 가능하다(Permiso Security).

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0530-CHATGPHISH` |
| **심각도** | 🟠 MEDIUM |
| **CVE** | 미부여 (Bugcrowd 보고, 벤더 재현 불가 회신) |
| **다운로드** | [🇰🇷 KR](CTI-2026-0530-CHATGPHISH_KR.md) · [🇬🇧 EN](CTI-2026-0530-CHATGPHISH_EN.md) · [🇯🇵 JP](CTI-2026-0530-CHATGPHISH_JP.md) · [🇨🇳 CN](CTI-2026-0530-CHATGPHISH_CN.md) |

### 5. KelpDAO LayerZero 브리지 해킹 — 오프체인 검증 인프라의 단일 장애점

*크로스체인 브리지 보안의 구조적 약점과 오프체인 검증자(off-chain verifier) 집중화 리스크*

LayerZero 기반 브리지 경로에서 발생한 침해 사건 분석. 온체인 컨트랙트가 아닌 **오프체인 검증 인프라의 단일 장애점**이 어떻게 자산 탈취로 직결되는지를 다룬다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0528-KELPDAO` |
| **심각도** | 🔴 HIGH |
| **분류** | Web3·크로스체인 브리지 보안 |
| **다운로드** | [🇰🇷 KR](CTI-2026-0528-KELPDAO_KR.md) · [🇬🇧 EN](CTI-2026-0528-KELPDAO_EN.md) · [🇯🇵 JP](CTI-2026-0528-KELPDAO_JA.md) · [🇨🇳 CN](CTI-2026-0528-KELPDAO_ZH.md) |

---

## 📚 Report Index — 전체 리포트 목록

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.

| ID | 발행일 | 제목 | 심각도 | 언어 |
| --- | --- | --- | --- | --- |
| [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_KR.md) | 2026-05-30 | AI 에이전트 주도형 침해 — Marimo CVE-2026-39987 + LLM 자율 피벗 | 🔴 CRITICAL | KR·EN·JP·CN |
| [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_KR.md) | 2026-05-30 | 미패치 Gogs git rebase 인자 주입 RCE (CVSS 9.4) | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_KR.md) | 2026-05-30 | JINX-0164 — 가상자산 겨냥 macOS 멀웨어·공급망 위협 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_KR.md) | 2026-05-30 | ChatGPhish — ChatGPT 렌더러 신뢰 결함(간접 프롬프트 인젝션) | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_KR.md) | 2026-05-28 | KelpDAO LayerZero 브리지 해킹 — 오프체인 검증 인프라의 단일 장애점 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_KR.md) | 2026-05-27 | GlassWorm — VS Code/OpenVSX 자기전파형 공급망 웜 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_KR.md) | 2026-05-27 | Gitea 취약점 분석 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_KR.md) | 2026-05-27 | AI 크립토재킹 캠페인 분석 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) | 2026-05-26 | 김수키(APT43)의 PebbleDash·AppleSeed 신규 분석 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) | 2026-05-26 | 영국의 러시아 가상자산 제재 동향 | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_KR.md) | 2026-05-24 | 동시 발생 이중 위협(Two Concurrent Threats) 분석 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_KR.md) | 2026-05-22 | EDR 우회 위협 분석 (EDR3) | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_KR.md) | 2026-05-21 | YellowKey — Windows BitLocker 우회 제로데이 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_KR.md) | 2026-05-21 | 2026 북한 해킹 트렌드 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) | 2026-05-20 | GitHub 내부 저장소 침해 분석 | 🔴 HIGH | KR |
| [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20KR.md) | 2026-05-20 | FAST16 분석 리포트 | 🟠 MEDIUM | KR·EN·JP·CN |
| [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) | 2026-05-20 | Exchange Server 보안 취약점 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) | 2026-05-20 | EvilTokens — AI 생성 디바이스 코드 피싱 PhaaS | 🔴 HIGH | KR |
| [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) | 2026-05-20 | Drupal 코어 최고위험 제로데이 (패치 부재) | 🔴 CRITICAL | KR |
| [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) | 2026-05-20 | cPanel 침해 분석 | 🔴 HIGH | KR |
| [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_KR.md) | 2026-05-17 | 북한의 LLM 활용 해킹 — 에이전틱 방어 | 🔴 HIGH | KR·EN |
| [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) | 2026-05-14 | ChatGPT DNS 사이드채널 | 🟠 MEDIUM | KR |
| [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) | 2026-05-14 | 러시아 RAT (LNK/RDP) | 🔴 HIGH | KR |
| [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) | 2026-05-10 | 북한 Lazarus의 git hooks 악용 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0510-MYTHOS-AI-VULN`](Cti%202026%200510%20mythos%20ai%20vuln.MD) | 2026-05-10 | Mythos AI 취약점 분석 | 🔴 HIGH | EN |
| [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_KR.md) | 2026-05-07 | ScarCruft(APT37) 분석 | 🔴 HIGH | KR·EN·JP |
| [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) | 2026-05-05 | 바이브 — 인공지능 해킹의 시대 | 🟠 MEDIUM | KR |
| [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) | 2026-05-03 | GitHub 위협 분석 | 🔴 HIGH | KR |
| [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) | 2026-04-30 | CVE-2026-31431 'Copy Fail' 취약점 | 🔴 HIGH | KR |
| [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20kr.MD) | 2026-04-27 | 라이트코인 취약점 분석 | 🟠 MEDIUM | KR·EN |
| [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20kr.MD) | 2026-04-22 | MCP를 노리는 지능형·잠복형 공격 — 구조적 문제인가 | 🔴 HIGH | KR·EN·JP·CN |
| [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_KR.md) | 2026-04-20 | Vercel 보안 침해 — AI SaaS 공급망·ShinyHunters | 🔴 HIGH | KR·EN |
| [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) | 2026-03-20 | 사이버 무기 공급망 붕괴 — Coruna iOS Exploit Kit | 🔴 CRITICAL | KR·EN·CN |

> ℹ️ 일부 과거 리포트의 제목·심각도 표기는 아카이브 파일명·커밋 메시지에서 정리한 것으로, 본문 기준으로 재확인을 권장합니다.

---

## 🗂️ By Category — 주제별 분류

### 🤖 AI/LLM 보안 (AI & LLM Security)

AI 에이전트·LLM을 표적으로 하거나 공격에 활용하는 신종 위협. 2026년 가장 빠르게 부상한 카테고리.

* `CTI-2026-0530-MARIMO` — LLM 에이전트 주도형 자율 침해 (최초 관측)
* `CTI-2026-0530-CHATGPHISH` — ChatGPT 렌더러 신뢰 결함·간접 프롬프트 인젝션
* `CTI-2026-0527-AICRYPTOJACK` — AI 크립토재킹
* `CTI-2026-0517-AICYBER` — 북한의 LLM 활용 해킹·에이전틱 방어
* `CTI-2026-0422-MCP` — MCP 지능형·잠복형 공격

### 🌐 공급망 공격 (Supply Chain Attacks)

신뢰하는 제3자 벤더·패키지·개발 인프라를 매개로 한 간접 침해.

* `CTI-2026-0530-JINX` — JINX-0164 macOS·npm(@velora-dex/sdk) 공급망
* `CTI-2026-0530-GOGS` · `CTI-2026-0527-GITEA` — 셀프호스팅 Git 서버 RCE
* `CTI-2026-0527-GLASSWORM` — VS Code/OpenVSX 자기전파형 웜
* `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` — GitHub 저장소 침해
* `CTI-2026-0420-VERCEL` — Vercel × Context.ai × ShinyHunters

### 🕵️ 위협 행위자 프로파일 (Threat Actor Profiles)

특정 APT·사이버 범죄 클러스터의 TTP·캠페인·귀속.

* `CTI-2026-0530-JINX` — JINX-0164 (금전 동기, DPRK 기법 유사)
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` — 김수키(APT43)
* `CTI-2026-0510-LAZARUS-GITHOOKS` — Lazarus
* `CTI-2026-0507-SCARCRUFT` — ScarCruft(APT37)
* `CTI-2026-0521-DPRK-TRENDS` — 북한 해킹 트렌드 종합

### 💰 Web3·암호화폐 생태계 (Web3 & Crypto)

DeFi·브리지·CEX·스테이블코인 침해 및 가상자산 규제·제재 동향.

* `CTI-2026-0528-KELPDAO` — KelpDAO LayerZero 브리지 해킹
* `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` — 가상자산 제재 동향
* `CTI-2026-0427-LITECOIN` — 라이트코인 취약점

### 🪟 엔드포인트·OS·제로데이 (Endpoint, OS & Zero-Day)

* `CTI-2026-0521-YELLOWKEY` — Windows BitLocker 우회 제로데이
* `CTI-2026-0520-DRUPAL` — Drupal 코어 제로데이
* `CTI-2026-0520-EXCHANGE` — Exchange Server 취약점
* `CTI-2026-0522-EDR3` — EDR 우회
* `CTI-2026-0320-CORUNA` — Coruna iOS Exploit Kit

---

## 🧭 Methodology — 분석 방법론

### Traffic Light Protocol (TLP) 분류

| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 커뮤니티 내 공유·대외 공개 가능 | **이 저장소의 기본값** |
| 🟡 TLP:AMBER | 조직 내부 공유 한정 | 해당 없음 |
| 🔴 TLP:RED | 개별 수령자 한정 | 해당 없음 |

### 심각도 등급 (Severity)

| 등급 | 의미 | 대응 시간 |
| --- | --- | --- |
| 🔴 **CRITICAL** | 국가안보·대규모 민간 피해 직결 | 즉시 |
| 🔴 **HIGH** | 산업·생태계 광범위 영향 | 24–72시간 |
| 🟠 **MEDIUM** | 특정 기업·조직군 제한 영향 | 7일 이내 |
| 🟡 **LOW** | 인지·관찰 수준 | 30일 이내 |

### 프레임워크 참조

* **MITRE ATT&CK** / **MITRE ATLAS** — TTP·AI 위협 매핑
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **NIST AI RMF** / **OWASP LLM Top 10** — AI/LLM 위험 관리
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant/Wiz UNC·클러스터 네이밍** — 위협 행위자 분류

---

## 📝 Naming Convention — 파일 명명 규칙

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0530-MARIMO_KR.md   → 2026년 5월 30일 발행, Marimo 사건, 한국어 Markdown
  CTI-2026-0530-MARIMO_EN.md   → 동일 사건의 영문판
  CTI-2026-0528-KELPDAO_ZH.md  → KelpDAO 사건, 중국어판
```

* `SUBJECT` — 리포트 주제를 대표하는 키워드 (대문자)
* `LANG` — `KR/KO` (한국어) / `EN` (영어) / `JP/JA` (일본어) / `CN/ZH` (중국어)
* `ext` — `md` (기본) / `pdf` (정식 배포본)

---

## 🤝 Contact & Contribution

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 리포트 피드백·정정·제보 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC 업데이트·레퍼런스 추가 제안 |
| **제보 보호** | 민감한 제보는 Signal·ProtonMail 등 보안 채널로 문의해 주십시오. |

---

## ⚖️ Disclaimer — 면책 조항

### 한국어

1. 본 저장소의 모든 리포트는 **공개된 OSINT 자료와 언론 보도**를 기반으로 한 독립적 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 리포트 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용되어야 하며, 공격·침해·불법 활동에 사용하는 것을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 반드시 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직접적·간접적 사용으로 발생하는 어떠한 손해에 대해서도 책임지지 않습니다.

### English

1. All reports are **independent analyses based on publicly available OSINT materials and press reporting**, and do not represent the official position of any referenced organization.
2. The content is intended **solely for educational, defensive, research, and policy purposes**. Use for offensive, intrusive, or illegal activities is strictly prohibited.
3. IoCs and vulnerability information reflect the time of publication; verify the latest state before operational use.
4. The author assumes no liability for damages arising from direct or indirect use of these materials.

---

## 📊 Repository Stats

|  |  |
| --- | --- |
| **총 리포트 수** | 33+ |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **관측 위협 행위자** | JINX-0164 · Lazarus · Kimsuky(APT43) · ScarCruft(APT37) · ShinyHunters · UNC6353 외 다수 |
| **최근 업데이트** | 2026-05-30 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
