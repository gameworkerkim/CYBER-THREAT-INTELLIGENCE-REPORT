# 🛡️ Cyber Threat Intelligence Report

> **독립 사이버 위협 인텔리전스 리포트 아카이브**
> *Independent Cyber Threat Intelligence Archive · OSINT-based Defensive Research*

![TLP](https://img.shields.io/badge/TLP-GREEN-2ECC71?style=flat-square)
![Purpose](https://img.shields.io/badge/Purpose-Education%20%26%20Defense-blue?style=flat-square)
![Language](https://img.shields.io/badge/Language-KR%20%7C%20EN%20%7C%20JP%20%7C%20ZH-lightgrey?style=flat-square)
![Updated](https://img.shields.io/badge/Last%20Update-2026--06--04-informational?style=flat-square)

🌐 **언어 / Languages:** **한국어 (이 문서)** · [English](README_EN.md) · [日本語](README_JP.md) · [中文](README_CN.md)

본 저장소는 방어·연구·정책 수립 목적의 **공개 사이버 위협 인텔리전스(Open CTI) 리포트**를 수집·발행하는 독립 아카이브입니다. 모든 리포트는 OSINT 기반으로 작성되며, 특정 조직·기관·국가의 공식 입장을 대변하지 않습니다.

---

## 📇 분석가 소개 (About the Analyst)

|  |  |
| --- | --- |
| **이름 (Name)** | Dennis Kim (김호광 / HoKwang Kim) |
| **역할 (Role)** | CEO, Betalabs Inc. · 전 CyworldZ CEO · 독립 위협 인텔리전스 분석가 |
| **전문 분야** | Web3·블록체인 보안, 공급망 공격, 제로데이 생태계, 북한·국가배후 위협, AI/LLM 보안 |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) |
| **GitHub** | [@gameworkerkim](https://github.com/gameworkerkim/) |

---

## 최신 리포트 (Latest — Featured)

> 🆕 **2026-06-04 발행**

### 사칭에서 코드 실행까지 한 묶음 — IBM WebSphere 동시 공개 3종의 연쇄 위험

**CVE-2026-8644 / 9311 / 9319 (CVSS 9.0–9.1)** · 자바 미들웨어 역직렬화 RCE, 인증 우회, 그리고 "정식 Fix Pack이 아직 없다"는 함정

IBM이 6월 1일 WebSphere Application Server 8.5·9.0을 대상으로 세 건의 치명적 취약점을 동시 공개했다. 사칭(8644)이 '접근'을, RCE(9311·9319)가 '실행'을 제공하는 연쇄 구조이며, 정식 Fix Pack은 3Q2026 목표로 아직 미배포라 현재는 임시픽스·보상통제가 유일한 즉시 대응이다. 국내 은행·보험·공공의 핵심 자바 EE 미들웨어라 영향도가 크다.

| 항목 | 값 |
| --- | --- |
| **리포트 ID** | `CTI-2026-0604-WEBSPHERE` |
| **심각도** | 🔴 CRITICAL |
| **분류** | `TLP:GREEN` |
| **CVE** | CVE-2026-8644 · CVE-2026-9311 · CVE-2026-9319 |

**📄 리포트:** [🇰🇷 KR](CTI-2026-0604-WEBSPHERE.md) · [🇬🇧 EN](CTI-2026-0604-WEBSPHERE_EN.md) · [🇯🇵 JA](CTI-2026-0604-WEBSPHERE_JA.md) · [🇨🇳 ZH](CTI-2026-0604-WEBSPHERE_ZH.md)

---

## 📚 전체 리포트 목록 (Report Index)

> 💡 새 리포트는 발행 시점에 맞춰 본 표의 **최상단**에 추가됩니다. 파일 명명 규칙은 `CTI-YYYY-MMDD-<SUBJECT>_<LANG>.md` 입니다.
> ※ 심각도(Severity)는 주제 기준 참고치이며, 각 리포트 본문의 평가가 우선합니다.

| 발행일 | ID / 제목 | 심각도 | 언어 |
| --- | --- | --- | --- |
| 2026-06-04 | [`CTI-2026-0604-WEBSPHERE`](CTI-2026-0604-WEBSPHERE.md) — IBM WebSphere 동시 공개 3종 (역직렬화 RCE·인증 우회) | 🔴 CRITICAL | [KR](CTI-2026-0604-WEBSPHERE.md) · [EN](CTI-2026-0604-WEBSPHERE_EN.md) · [JA](CTI-2026-0604-WEBSPHERE_JA.md) · [ZH](CTI-2026-0604-WEBSPHERE_ZH.md) |
| 2026-06-03 | [`CTI-2026-0603-NETSCALER`](CTI-2026-0603-NETSCALER_KR.md) — Citrix NetScaler 메모리 오버리드 대규모 악용 (CVE-2026-3055) | 🔴 CRITICAL | [KR](CTI-2026-0603-NETSCALER_KR.md) · [EN](CTI-2026-0603-NETSCALER_EN.md) |
| 2026-06-01 | [`CTI-2026-0601-IRANGENAI`](CTI-2026-0601-IRANGENAI_KR.md) — 이란의 생성형 AI를 이용한 전쟁 | 🔴 HIGH | [KR](CTI-2026-0601-IRANGENAI_KR.md) · [EN](CTI-2026-0601-IRANGENAI_EN.md) · [JP](CTI-2026-0601-IRANGENAI_JP.md) · [CN](CTI-2026-0601-IRANGENAI_CN.md) |
| 2026-06-01 | [`CTI-2026-0601-GREYVIBE`](CTI-2026-0601-GREYVIBE_KR.md) — GenAI로 무장한 GREYVIBE의 우크라이나 표적 작전 | 🔴 HIGH | [KR](CTI-2026-0601-GREYVIBE_KR.md) |
| 2026-05-30 | [`CTI-2026-0530-MARIMO`](CTI-2026-0530-MARIMO_KR.md) — MARIMO (권고문 무기화·공개-악용 압축) | 🔴 HIGH | [KR](CTI-2026-0530-MARIMO_KR.md) · [EN](CTI-2026-0530-MARIMO_EN.md) · [JP](CTI-2026-0530-MARIMO_JP.md) · [CN](CTI-2026-0530-MARIMO_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-JINX`](CTI-2026-0530-JINX_KR.md) — JINX | 🔴 HIGH | [KR](CTI-2026-0530-JINX_KR.md) · [EN](CTI-2026-0530-JINX_EN.md) · [JP](CTI-2026-0530-JINX_JP.md) · [CN](CTI-2026-0530-JINX_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-GOGS`](CTI-2026-0530-GOGS_KR.md) — Gogs Git 서버 취약점 | 🔴 HIGH | [KR](CTI-2026-0530-GOGS_KR.md) · [EN](CTI-2026-0530-GOGS_EN.md) · [JP](CTI-2026-0530-GOGS_JP.md) · [CN](CTI-2026-0530-GOGS_CN.md) |
| 2026-05-30 | [`CTI-2026-0530-CHATGPHISH`](CTI-2026-0530-CHATGPHISH_KR.md) — ChatGPhish (ChatGPT 사칭 피싱) | 🔴 HIGH | [KR](CTI-2026-0530-CHATGPHISH_KR.md) · [EN](CTI-2026-0530-CHATGPHISH_EN.md) · [JP](CTI-2026-0530-CHATGPHISH_JP.md) · [CN](CTI-2026-0530-CHATGPHISH_CN.md) |
| 2026-05-28 | [`CTI-2026-0528-KELPDAO`](CTI-2026-0528-KELPDAO_KR.md) — KelpDAO (Web3·DeFi 위협) | 🔴 HIGH | [KR](CTI-2026-0528-KELPDAO_KR.md) · [EN](CTI-2026-0528-KELPDAO_EN.md) · [JA](CTI-2026-0528-KELPDAO_JA.md) · [ZH](CTI-2026-0528-KELPDAO_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GLASSWORM`](CTI-2026-0527-GLASSWORM_KR.md) — GlassWorm (공급망 자가전파 웜) | 🔴 CRITICAL | [KR](CTI-2026-0527-GLASSWORM_KR.md) · [EN](CTI-2026-0527-GLASSWORM_EN.md) · [JA](CTI-2026-0527-GLASSWORM_JA.md) · [ZH](CTI-2026-0527-GLASSWORM_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-GITEA`](CTI-2026-0527-GITEA_KR.md) — Gitea CVE 취약점 | 🔴 HIGH | [KR](CTI-2026-0527-GITEA_KR.md) · [EN](CTI-2026-0527-GITEA_EN.md) · [JA](CTI-2026-0527-GITEA_JA.md) · [ZH](CTI-2026-0527-GITEA_ZH.md) |
| 2026-05-27 | [`CTI-2026-0527-AICRYPTOJACK`](CTI-2026-0527-AICRYPTOJACK_KR.md) — AI 크립토재킹 | 🟠 MEDIUM | [KR](CTI-2026-0527-AICRYPTOJACK_KR.md) · [EN](CTI-2026-0527-AICRYPTOJACK_EN.md) · [JA](CTI-2026-0527-AICRYPTOJACK_JA.md) · [ZH](CTI-2026-0527-AICRYPTOJACK_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS`](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) — 영국의 러시아 암호화폐 제재 분석 | 🟠 MEDIUM | [KO](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_KO.md) · [EN](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_EN.md) · [JA](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_JA.md) · [ZH](CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS_ZH.md) |
| 2026-05-26 | [`CTI-2026-0526-KIMSUKY-PEBBLEDASH`](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) — 김수키(APT43) PebbleDash·AppleSeed | 🔴 HIGH | [KR](CTI-2026-0526-KIMSUKY-PEBBLEDASH.md) · [EN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_EN.md) · [JP](CTI-2026-0526-KIMSUKY-PEBBLEDASH_JP.md) · [CN](CTI-2026-0526-KIMSUKY-PEBBLEDASH_CN.md) |
| 2026-05-24 | [`CTI-2026-0524-DUALTHREAT`](CTI-2026-0524-DUALTHREAT_KR.md) — 동시 발생 이중 위협 (LiteSpeed·Shai-Hulud) | 🔴 HIGH | [KR](CTI-2026-0524-DUALTHREAT_KR.md) · [EN](CTI-2026-0524-DUALTHREAT_EN.md) · [JP](CTI-2026-0524-DUALTHREAT_JP.md) · [CN](CTI-2026-0524-DUALTHREAT_CN.md) |
| 2026-05-22 | [`CTI-2026-0522-EDR3`](CTI-2026-0522-EDR3_KR.md) — EDR 우회 위협 | 🔴 HIGH | [KR](CTI-2026-0522-EDR3_KR.md) · [EN](CTI-2026-0522-EDR3_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-YELLOWKEY`](CTI-2026-0521-YELLOWKEY_KR.md) — Windows BitLocker 우회 제로데이 | 🔴 CRITICAL | [KR](CTI-2026-0521-YELLOWKEY_KR.md) · [EN](CTI-2026-0521-YELLOWKEY_EN.md) |
| 2026-05-21 | [`CTI-2026-0521-DPRK-TRENDS`](CTI-2026-0521-DPRK-TRENDS_KR.md) — 2026 북한 해킹 동향 | 🟠 MEDIUM | [KR](CTI-2026-0521-DPRK-TRENDS_KR.md) · [EN](CTI-2026-0521-DPRK-TRENDS_EN.md) |
| 2026-05-20 | [`CTI-2026-0520-GITHUB`](CTI-2026-0520-GITHUB.md) — GitHub 내부 저장소 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-GITHUB.md) |
| 2026-05-20 | [`CTI-2026-0520-FAST16`](CTI-2026-0520-FAST16%20KR.md) — FAST16 | 🔴 HIGH | [KR](CTI-2026-0520-FAST16%20KR.md) · [EN](CTI-2026-0520-FAST16%20EN.md) · [JA](CTI-2026-0520-FAST16%20JA.md) · [ZH](CTI-2026-0520-FAST16%20ZH.md) |
| 2026-05-20 | [`CTI-2026-0520-EXCHANGE`](CTI-2026-0520-EXCHANGE.md) — Exchange Server 취약점 | 🔴 HIGH | [KR · EN](CTI-2026-0520-EXCHANGE.md) |
| 2026-05-20 | [`CTI-2026-0520-EVILTOKENS`](CTI-2026-0520-EVILTOKENS.md) — EvilTokens (AI 디바이스 코드 피싱 PhaaS) | 🔴 HIGH | [KR](CTI-2026-0520-EVILTOKENS.md) |
| 2026-05-20 | [`CTI-2026-0520-DRUPAL`](CTI-2026-0520-DRUPAL.md) — Drupal 코어 최고위험 제로데이 (패치 없음) | 🔴 CRITICAL | [KR](CTI-2026-0520-DRUPAL.md) |
| 2026-05-20 | [`CTI-2026-0520-CPANEL`](CTI-2026-0520-CPANEL.md) — cPanel 해킹 | 🔴 HIGH | [KR](CTI-2026-0520-CPANEL.md) |
| 2026-05-17 | [`CTI-2026-0517-AICYBER`](CTI-2026-0517-AICYBER_KR.md) — 북한의 LLM을 이용한 해킹 / AI 사이버 공격·에이전트 방어 | 🔴 HIGH | [KR](CTI-2026-0517-AICYBER_KR.md) · [EN](CTI-2026-0517-AICYBER_EN.md) · [PDF](2026-05-17_AI-Cyber-Attack-Agentic-Defense_KR.pdf) |
| 2026-05-14 | [`CTI-2026-0514-CTRL_RussianRAT`](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) — 러시아 RAT (LNK·RDP) | 🔴 HIGH | [KO](CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO.md) |
| 2026-05-14 | [`CTI-2026-0514-ChatGPT_DNS_SideChannel`](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) — ChatGPT DNS 사이드채널 | 🟠 MEDIUM | [KO](CTI-2026-0514-ChatGPT_DNS_SideChannel_KO.md) |
| 2026-05-10 | [`CTI-2026-0510-LAZARUS-GITHOOKS`](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) — 북한 Lazarus git hooks 은닉 기법 | 🔴 HIGH | [KR](CTI-2026-0510-LAZARUS-GITHOOKS_KR.md) · [EN](CTI-2026-0510-LAZARUS-GITHOOKS_EN.md) · [JP](CTI-2026-0510-LAZARUS-GITHOOKS_JP.md) · [CN](CTI-2026-0510-LAZARUS-GITHOOKS_CN.md) · [PDF](CTI-2026-0510-LAZARUS-GITHOOKS_KR.pdf) |
| 2026-05-10 | [`CTI-2026-0510-MYTHOS-AI`](Cti%202026%200510%20mythos%20ai%20vuln.MD) — Mythos AI 취약점 | 🔴 HIGH | [KR](Cti%202026%200510%20mythos%20ai%20vuln.MD) |
| 2026-05-07 | [`CTI-2026-0507-SCARCRUFT`](CTI-2026-0507-SCARCRUFT_KR.md) — ScarCruft(APT37) 캠페인 | 🔴 HIGH | [KR](CTI-2026-0507-SCARCRUFT_KR.md) · [EN](CTI-2026-0507-SCARCRUFT_EN.md) · [JP](CTI-2026-0507-SCARCRUFT_JP.md) · [PDF](CTI-2026-0507-SCARCRUFT_KR.pdf) |
| 2026-05-05 | [`CTI-2026-0505-VIBE`](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) — 바이브: 인공지능 해킹의 시대 | 🟠 MEDIUM | [KR](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE.md) · [PDF](바이브_인공지능_해킹의_시대_CTI-2026-0505-VIBE_김호광.pdf) |
| 2026-05-03 | [`CTI-2026-0503-GITHUB`](CTI-2026-0503-GITHUB_KR.md) — GitHub 위협 분석 | 🔴 HIGH | [KR](CTI-2026-0503-GITHUB_KR.md) |
| 2026-04-30 | [`CTI-2026-0430-COPYFAIL`](Cti%20205%200430%20CopyFail%20kr.MD) — CopyFail (CVE-2026-31431) | 🔴 HIGH | [KR](Cti%20205%200430%20CopyFail%20kr.MD) |
| 2026-04-27 | [`CTI-2026-0427-LITECOIN`](Cti%202026%200427%20litecoin%20kr.MD) — 라이트코인 취약점 | 🟠 MEDIUM | [KR](Cti%202026%200427%20litecoin%20kr.MD) · [EN](Cti%202026%200427%20litecoin%20en.MD) · [PDF](CTI-2026-0427-LITECOIN_KR.pdf) |
| 2026-04-22 | [`CTI-2026-0422-MCP`](Cti%202026%200422%20mcp%20kr.MD) — MCP를 노리는 지능형·잠복형 공격 | 🔴 HIGH | [KR](Cti%202026%200422%20mcp%20kr.MD) · [EN](Cti%202026%200422%20mcp%20en.MD) · [JP](Cti%202026%200422%20mcp%20jp.MD) · [CN](Cti%202026%200422%20mcp%20cn.MD) · [PDF](CTI-2026-0422-MCP_KR.pdf) · [PRESS](CTI-2026-0422-MCP-PRESS_KR.md) |
| 2026-04-20 | [`CTI-2026-0420-VERCEL`](CTI-2026-0420-VERCEL_KR.md) — Vercel 보안 침해 (AI SaaS 공급망·ShinyHunters) | 🔴 HIGH | [KR](CTI-2026-0420-VERCEL_KR.md) · [EN](CTI-2026-0420-VERCEL_EN.md) · [PDF](Vercel_%EB%B3%B4%EC%95%88%EC%82%AC%EA%B1%B4_%EB%B6%84%EC%84%9D%EB%A6%AC%ED%8F%AC%ED%8A%B8_CTI-2026-0420.pdf) |
| 2026-03-20 | [`CTI-2026-0320-CORUNA`](CTI-2026-0320-CORUNA_KR.md) — Coruna iOS Exploit Kit·사이버 무기 공급망 | 🔴 CRITICAL | [KR](CTI-2026-0320-CORUNA_KR.md) · [EN](Analysis%20EN.MD) · [ZH](Analysis%20ZH%20中文版.md) |

---

## 주제별 분류 (By Category)

### 🌐 공급망 공격 (Supply Chain Attacks)
신뢰하는 제3자 벤더·오픈소스 패키지·개발 인프라를 먼저 침해해 간접 접근하는 공격 유형.
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0527-GLASSWORM` · `CTI-2026-0527-GITEA` · `CTI-2026-0530-GOGS` · `CTI-2026-0524-DUALTHREAT` · `CTI-2026-0520-GITHUB` · `CTI-2026-0503-GITHUB` · `CTI-2026-0420-VERCEL`

### 🔓 제로데이·취약점 (Zero-Day & Vulnerabilities)
패치 전·악용 중인 취약점과 경계·미들웨어·웹 플랫폼 결함 분석.
* `CTI-2026-0604-WEBSPHERE` · `CTI-2026-0603-NETSCALER` · `CTI-2026-0521-YELLOWKEY` · `CTI-2026-0520-DRUPAL` · `CTI-2026-0520-EXCHANGE` · `CTI-2026-0520-CPANEL` · `CTI-2026-0430-COPYFAIL` · `CTI-2026-0320-CORUNA`

### 🕵️ 북한·국가배후 위협 (DPRK & State-Sponsored)
APT 그룹의 TTP·캠페인·귀속 분석.
* `CTI-2026-0526-KIMSUKY-PEBBLEDASH` (APT43) · `CTI-2026-0510-LAZARUS-GITHOOKS` · `CTI-2026-0507-SCARCRUFT` (APT37) · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0514-CTRL_RussianRAT`

### 🤖 AI·LLM 위협 (AI / LLM Threats)
생성형 AI·LLM·MCP를 공격에 활용하거나 표적으로 삼는 위협.
* `CTI-2026-0601-GREYVIBE` · `CTI-2026-0601-IRANGENAI` · `CTI-2026-0530-CHATGPHISH` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0520-EVILTOKENS` · `CTI-2026-0517-AICYBER` · `CTI-2026-0514-ChatGPT_DNS_SideChannel` · `CTI-2026-0510-MYTHOS-AI` · `CTI-2026-0505-VIBE` · `CTI-2026-0422-MCP`

### 💰 Web3·암호화폐 (Web3 & Crypto)
DeFi·CEX·스테이블코인 침해 및 제재·컴플라이언스 분석.
* `CTI-2026-0528-KELPDAO` · `CTI-2026-0527-AICRYPTOJACK` · `CTI-2026-0526-UK_RUSSIA_CRYPTO_SANCTIONS` · `CTI-2026-0427-LITECOIN`

### 🇰🇷 한국 사이버 안보 정책 (Korea Cybersecurity Policy)
국내 정부·공공·금융·방산 대상 위협과 제도적 대응 권고.
* `CTI-2026-0320-CORUNA` · `CTI-2026-0420-VERCEL` · `CTI-2026-0521-DPRK-TRENDS` · `CTI-2026-0604-WEBSPHERE`

---

## 🧭 분석 방법론 (Methodology)

### Traffic Light Protocol (TLP)
| 라벨 | 의미 | 본 저장소 기준 |
| --- | --- | --- |
| 🟢 **TLP:GREEN** | 커뮤니티 내 공유·대외 공개 가능 | **기본값** |
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
* **MITRE ATT&CK** — TTP 매핑 표준
* **NIST SP 800-61** — 사고 대응 수명주기
* **NIST SP 800-207** — Zero Trust Architecture
* **STIX/TAXII** — 위협 인텔리전스 교환 표준
* **Mandiant UNC/APT 네이밍** — 위협 행위자 클러스터링

각 Key Judgment는 **High / Medium / Low** 신뢰도를 명시하며, 1차 자료와 2차 공개 CTI를 교차 검증합니다.

---

## 파일 명명 규칙 (Naming Convention)

```
CTI-YYYY-MMDD-<SUBJECT>_<LANG>.<ext>

예시:
  CTI-2026-0604-WEBSPHERE_EN.md   → 2026-06-04 발행, WebSphere 분석, 영문 Markdown
  CTI-2026-0603-NETSCALER_KR.md   → 2026-06-03 발행, NetScaler 분석, 한국어
```
* `SUBJECT` — 리포트 주제 키워드 (대문자)
* `LANG` — `KR/KO` (한국어) · `EN` (영어) · `JP/JA` (일본어) · `CN/ZH` (중국어)
* `ext` — `md` (기본) · `pdf` (정식 배포본)

---

## 연락·기여 (Contact & Contribution)

| 채널 | 용도 |
| --- | --- |
| **Email** | [gameworker@gmail.com](mailto:gameworker@gmail.com) — 피드백·정정·제보 |
| **GitHub Issues** | [이슈 생성](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/issues) — IoC·레퍼런스 추가 제안 |
| **제보 보호** | 민감 제보는 Signal·ProtonMail 등 보안 채널로 문의 |

---

## 면책 조항 (Disclaimer)

1. 본 저장소의 모든 리포트는 **공개 OSINT 자료·언론 보도** 기반의 독립 분석이며, 관련 조직·기관·기업의 공식 입장을 대변하지 않습니다.
2. 내용은 **교육·방어·연구·정책 수립 목적**으로만 사용해야 하며, 공격·침해·불법 활동 사용을 엄격히 금지합니다.
3. IoC·취약점 정보는 발행 시점 기준이며, 실제 적용 전 최신 상태를 재확인해야 합니다.
4. 저자는 본 자료의 직간접 사용으로 발생하는 어떠한 손해에도 책임지지 않습니다.

---

## 저장소 통계 (Repository Stats)

|  |  |
| --- | --- |
| **총 리포트 수** | 37 (시리즈 기준) |
| **커버 언어** | 한국어 · English · 日本語 · 中文 |
| **주요 위협 행위자** | Lazarus · Kimsuky(APT43) · ScarCruft(APT37) · ShinyHunters · GREYVIBE · 외 다수 |
| **최근 업데이트** | 2026-06-04 |

---

**© 2026 Dennis Kim (김호광)** · Cyber Threat Intelligence Division
[gameworker@gmail.com](mailto:gameworker@gmail.com) · [github.com/gameworkerkim](https://github.com/gameworkerkim/)

*"오늘의 국가 전략 자산이 내일의 사이버 범죄 도구가 된다." — CTI-2026-0320*
