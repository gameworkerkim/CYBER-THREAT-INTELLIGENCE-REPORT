| id             | CTI-2026-0527-GLASSWORM                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | GlassWorm C2 인프라 동시 차단 - 개발자를 노린 자가전파형 공급망 웜의 전모                                                                                                                                                                  |
| subtitle       | 블록체인·P2P·정상 웹서비스를 결합한 4중 C2, 그리고 암호화폐 지갑으로 번지는 공급망 위협                                                                                                                                                              |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | ko                                                                                                                                                                                                              |
| tags           | | Supply-Chain | VS-Code-Extension | Self-Propagating-Worm | Crypto-Wallet-Theft | Solana-C2 | Developer-Targeting | | ------------ | ---------------- | --------------------- | ------------------- | --------- | ------------------ | |
| threat\_actors | | GlassWorm operators (likely Russia/CIS-nexus cybercriminals) | | ------------------------------------------------------------ |                                                                                  |
| frameworks     | | MITRE ATT&CK | NIST SP 800-161 (C-SCRM) | SLSA | STIX/TAXII | | ------------ | ------------------------ | ---- | ---------- |                                                                                       |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# GlassWorm C2 인프라 동시 차단 - 개발자를 노린 자가전파형 공급망 웜의 전모

> **리포트 ID** `CTI-2026-0527-GLASSWORM` · **발행일** 2026-05-27 · **분류** `TLP:GREEN` · **심각도** 🔴 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*블록체인·P2P·정상 웹서비스를 결합한 4중 C2, 그리고 암호화폐 지갑으로 번지는 공급망 위협*

---

## 목차

1. 요약 (TL;DR)
2. 사건 개요 - 무엇이 차단되었나
3. 공격 메커니즘 - 4중 C2와 자가전파 구조
4. 페이로드 분석 - 자격증명·암호화폐 지갑 탈취
5. 위협 행위자 분석
6. 한국에 미치는 영향
7. Web3·암호화폐 생태계에 미치는 영향
8. 대응 방안
9. IoC 및 탐지 지표
10. 결론과 권고
11. 참고 문헌

---

## 요약 (TL;DR)

2026년 5월 27일, CrowdStrike는 Google·Shadowserver 재단과 공조하여 자가전파형 소프트웨어 공급망 캠페인 **GlassWorm**의 명령제어(C2) 채널 4개를 동시에 차단했다고 발표했다. GlassWorm은 최소 2025년 초부터 소스 코드 저장소·클라우드 플랫폼·CI/CD 파이프라인·패키지 레지스트리에 접근 권한을 가진 소프트웨어 개발자를 표적으로 삼아왔다.

이 캠페인의 본질은 단순한 멀웨어가 아니라 **개발자 워크스테이션을 1차 거점으로 삼아 하위 조직과 사용자 수천 곳으로 번지는 force-multiplier(전력 증폭기)** 구조다. 공격자는 Microsoft VS Code 마켓플레이스와 Open VSX 양쪽에 트로이목마화된 확장 프로그램을 배포했으며, 이는 VS Code 포크인 Cursor·Positron·Windsurf·VSCodium 사용자까지 포괄한다. 침해된 npm·Python 패키지를 통한 전파도 확인됐다.

특히 주목할 점은 **C2 회복탄력성을 위한 4중 채널 설계**다. Solana 블록체인의 트랜잭션 메모 필드를 데드드롭으로 사용하고, BitTorrent DHT P2P 네트워크에서 설정값을 조회하며, Google Calendar 이벤트 제목을 데드드롭으로 활용하고, 상용 VPS의 직접 연결을 병행했다. 이번 takedown으로 4개 채널이 동시에 무력화되어 감염 호스트는 더 이상 신규 명령·페이로드를 수신할 수 없게 됐다.

### Key Judgments

| #    | 판단                                                                                                                                                  | 신뢰도        |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | GlassWorm의 핵심 위협은 개발자 환경을 매개로 한 **연쇄 증폭(blast radius)**이며, C2 takedown은 신규 명령 수신을 차단했을 뿐 이미 유출된 자격증명·지갑 키는 회수되지 않는다. 침해된 개발자 계정의 사후 정리가 필수다.          | **High**   |
| KJ-2 | **블록체인(Solana)·P2P(BitTorrent DHT)·정상 서비스(Google Calendar)를 데드드롭으로 결합한 4중 C2** 설계는 향후 공급망 멀웨어의 표준이 될 가능성이 높다. 단일 도메인 차단 기반의 전통적 대응으로는 무력화가 불가능하다. | **High**   |
| KJ-3 | 페이로드가 **GitHub/NPM/OpenVSX 토큰과 암호화폐 지갑**을 우선 탈취하도록 설계된 점은, Web3·블록체인 개발팀이 일반 SW 기업보다 직접적 표적임을 시사한다.                                                  | **High**   |
| KJ-4 | 멀웨어가 CIS(독립국가연합) 지역 호스트에서 실행을 종료하고 러시아어 주석을 포함한 점에 근거해 CrowdStrike는 러시아 기반 사이버 범죄 조직을 유력 배후로 지목했다. 단, 코드 유출·모방 가능성을 고려하면 단정은 이르다.                  | **Medium** |

---

## 1. 사건 개요 - 무엇이 차단되었나

CrowdStrike는 Google 및 Shadowserver 재단과 함께 GlassWorm과 연계된 모든 C2 채널을 동시에 차단했다고 2026년 5월 27일 공식 발표했다. GlassWorm은 작년 등장 이후 "다각적(multi-pronged) 캠페인"을 전개해왔으며, 누적으로 도난당한 개발자 자격증명을 이용해 300개 이상의 GitHub 저장소를 오염시킨 것으로 집계됐다.

이 사건이 갖는 의미는 개별 멀웨어 박멸이 아니라, **소프트웨어 공급망이라는 공격면 자체가 현대 컴퓨팅에서 가장 파급력 큰 표면 중 하나임을 재확인**시킨 데 있다. CrowdStrike는 "패키지나 확장 프로그램을 오염시키는 진입 장벽은 낮지만, 잠재적 폭발 반경(blast radius)은 막대하다"고 평가했다. 개발 환경·빌드 파이프라인·코드 저장소가 충분히 보호되지 않는 한, 소프트웨어를 소비하는 모든 조직은 그것을 생산하는 모든 주체의 리스크를 그대로 상속받는다.

## 2. 공격 메커니즘 - 4중 C2와 자가전파 구조

### 2.1 배포 경로

GlassWorm은 두 개의 주요 마켓플레이스 — Microsoft VS Code Marketplace와 Open VSX — 양쪽에 악성 확장 프로그램을 게시했다. 이 이중 게시 전략의 핵심은 **VS Code 포크 생태계 전체를 포괄**한다는 점이다. Cursor, Positron, Windsurf, VSCodium 등은 Open VSX를 확장 소스로 사용하므로, 단일 악성 확장이 다수의 AI 코딩 IDE 사용자에게 도달한다. 여기에 더해 침해된 npm 및 Python 패키지를 통한 전파 경로도 병행됐다.

### 2.2 4중 C2 채널 - takedown 회피 설계

GlassWorm을 기술적으로 특이하게 만든 것은 회복탄력성을 위한 4개의 서로 다른 C2 해석 계층이다.

| # | 채널                       | 메커니즘                                                |
| --- | ------------------------ | --------------------------------------------------- |
| ① | **Solana 블록체인 데드드롭**     | C2 서버 주소를 블록체인 트랜잭션의 memo 필드에 저장. 검열·차단이 사실상 불가능     |
| ② | **BitTorrent DHT P2P**   | 분산 해시 테이블 P2P 네트워크를 조회하여 설정 데이터 수신                   |
| ③ | **Google Calendar 데드드롭** | 정상 서비스인 캘린더 이벤트 제목에서 C2 서버 주소를 추출 (정상 트래픽으로 위장)      |
| ④ | **상용 VPS 직접 연결**         | 일반 VPS 제공업체에 호스팅된 C2 인프라에 직접 접속                      |

CrowdStrike의 평가에 따르면, 블록체인·P2P·정상 웹서비스를 해석 계층으로 결합한 이 구조는 takedown에 강인하도록 설계됐다 — 여러 겹의 간접 참조 뒤에 실제 C2 서버를 숨기는 "동적 전면(dynamic front)" 방식이다. 이번 공동 작전은 4개 채널을 동시에 무력화함으로써 이 다중 방어선을 한 번에 무너뜨렸다.

## 3. 페이로드 분석 - 자격증명·암호화폐 지갑 탈취

GlassWorm 공격의 최종 목표는 자격증명 수집·암호화폐 지갑 유출·시스템 프로파일링 기능을 갖춘 데이터 절취 프레임워크 배포다.

후속 변종은 **GlassWormRAT**이라는 WebSocket 기반 JavaScript RAT을 배포해 웹 브라우저 데이터를 탈취하고 임의 코드를 실행했다. 여기에는 스크린샷·키 입력·클립보드 내용 등 민감 정보를 수집하는 Google Chrome 확장 프로그램 설치도 포함된다.

Endor Labs 연구진의 분석에 따르면, 멀웨어는 활성화되면 호스트에서 개발자 자격증명(GitHub, NPM, OpenVSX 토큰, 암호화폐 지갑)을 탐색하며, 이를 통해 저장소와 패키지 업로드 권한을 추가로 침해한다. 즉 **하나의 감염이 새로운 악성 패키지 배포 권한으로 이어지는 자가전파 고리**가 완성된다.

감염된 호스트는 은밀한 인프라로 전환된다 — SOCKS 프록시, 은닉 VNC(HVNC) 서버, 그리고 WebRTC나 별도 Node.js 프로세스를 통한 원격 실행 노드. 이는 공격자에게 기업·개인 네트워크로의 익명 접근 경로와 추가 전파 플랫폼을 동시에 제공한다.

## 4. 위협 행위자 분석

CrowdStrike는 GlassWorm 운영자를 "충분한 자원을 갖춘, 끈질긴(well-resourced and persistent)" 행위자로 규정했다. 귀속 근거는 두 가지다. 첫째, 멀웨어가 CIS(독립국가연합) 국가에 위치한 시스템에서 실행을 종료한다는 점. 둘째, 코드에 러시아어 주석이 포함돼 있다는 점. 이를 바탕으로 러시아 기반 사이버 범죄 조직을 유력한 배후로 지목했다.

다만 본 리포트는 이 귀속을 **Medium 신뢰도**로 평가한다. CIS 회피 로직과 러시아어 주석은 강한 정황이지만, 위협 행위자가 의도적으로 거짓 깃발(false flag)을 심거나 유출된 코드를 모방하는 사례도 존재하기 때문이다.

## 5. 한국에 미치는 영향

GlassWorm 사건은 한국 언론에서 거의 다뤄지지 않았으나, 국내 개발 생태계에 직접적 함의를 갖는다.

첫째, **국내 개발자의 VS Code 계열 IDE 의존도가 매우 높다.** Cursor·Windsurf 등 AI 코딩 IDE는 한국 스타트업·블록체인 팀에서 빠르게 확산 중이며, 이들은 모두 Open VSX 확장 생태계를 공유한다. 단일 악성 확장이 국내 다수 팀에 동시 도달할 수 있는 구조다.

둘째, **국내 다수 기업이 npm·PyPI 공개 패키지를 무비판적으로 의존**한다. GlassWorm이 침해된 패키지를 전파 경로로 사용한 만큼, 국내 CI/CD 파이프라인도 간접 오염 위험에 노출돼 있다.

셋째, 본 분석가가 이전 `CTI-2026-0422-MCP` 리포트에서 지적한 **북한 연계 UNC1069(Sapphire Sleet)의 Axios npm 패키지 침해**와 동일한 공급망 표면을 공유한다. 한국은 북한의 우선 표적국으로서, 이러한 자가전파형 공급망 웜이 사회 혼란·자금 탈취 목적으로 변형·재사용될 가능성을 국가 안보 차원에서 다뤄야 한다.

## 6. Web3·암호화폐 생태계에 미치는 영향

GlassWorm은 일반 공급망 멀웨어와 달리 **Web3 산업을 구조적으로 더 위험하게 만든다.** 근거는 세 가지다.

첫째, 페이로드가 **암호화폐 지갑을 명시적 탈취 대상**으로 지정한다. 브라우저 확장형 지갑(MetaMask, Phantom 등)과 로컬 지갑 파일이 1차 표적이다.

둘째, C2 인프라 자체가 **Solana 블록체인을 데드드롭으로 활용**한다. 이는 공격 인프라와 Web3 인프라의 경계가 무너지고 있음을 상징한다. 온체인 데이터 조회 도구를 사용하는 블록체인 개발팀은 정상 트래픽과 악성 C2 트래픽을 구분하기가 더욱 어렵다.

셋째, 본 분석가가 `CTI-2026-0422-MCP`에서 경고한 **"멀티시그인데 괜찮다"는 착각**과 정확히 맞물린다. 멀티시그 서명자들이 동일 호스트에서 동일 VS Code 계열 IDE를 사용한다면, GlassWorm 감염 단 한 건으로 멀티시그가 단일 장애점으로 축퇴된다. GitHub/NPM 토큰 탈취는 곧 스마트컨트랙트 배포 권한, 프런트엔드 배포 파이프라인 탈취로 이어질 수 있다.

## 7. 대응 방안

### 7.1 즉시 조치 (감염 가정 기반)

1. **개발자 자격증명 전면 회전** — GitHub·NPM·OpenVSX Personal Access Token을 모두 폐기·재발급한다. C2 takedown은 신규 명령 수신만 차단했을 뿐, 이미 유출된 토큰은 여전히 유효하다.
2. **암호화폐 지갑 마이그레이션** — 개발 머신에 지갑을 둔 적이 있다면, 신규 시드로 생성한 지갑으로 자산을 즉시 이전한다. 기존 지갑은 침해된 것으로 간주한다.
3. **VS Code 계열 확장 감사** — 설치된 모든 확장의 게시자·서명·최근 업데이트를 점검하고, Open VSX에서 받은 확장은 별도 검증 게이트를 적용한다.
4. **브라우저 확장 점검** — 무단 설치된 Chrome 확장(특히 스크린샷·키입력·클립보드 권한 보유)을 제거한다.

### 7.2 구조적 대응

1. **자산은 개발 머신과 분리한다.** Web3 팀은 대량 자산을 콜드월렛·HSM 기반 다자서명으로 격리하고, 실제 서명 기기에는 IDE·확장·개발 도구를 설치하지 않는다.
2. **CI/CD 시크릿을 단기 토큰화한다.** 장기 PAT 대신 OIDC 기반 단기 토큰, 환경별 최소 권한 원칙을 적용한다.
3. **의존성 SBOM과 lockfile pinning**을 의무화하고, npm/PyPI 신규 의존성에 자동 격리 기간(quarantine)을 둔다.
4. **온체인 C2 탐지를 모니터링에 포함한다.** Solana memo 필드, BitTorrent DHT 조회, 비정상 Google Calendar API 호출 등 비전통적 C2 시그널을 SIEM 규칙으로 추가한다.

## 8. IoC 및 탐지 지표

> ⚠️ 본 섹션은 공개 발표 시점 기준이며, 운용 적용 전 최신 위협 인텔리전스를 재확인할 것.

| 유형         | 지표/행위                                                        |
| ---------- | ------------------------------------------------------------ |
| 멀웨어 패밀리    | GlassWorm, GlassWormRAT (WebSocket 기반 JS RAT)               |
| 탈취 대상      | GitHub/NPM/OpenVSX 토큰, 암호화폐 지갑, 브라우저 데이터, 스크린샷·키입력·클립보드 |
| C2 채널      | Solana 트랜잭션 memo 필드, BitTorrent DHT, Google Calendar 이벤트 제목, 상용 VPS |
| 호스트 전환 행위  | SOCKS 프록시·HVNC 서버·WebRTC/Node.js 원격 실행 노드 생성              |
| 회피 특성      | CIS 지역 호스트에서 실행 종료, 러시아어 코드 주석                            |
| 배포 채널      | VS Code Marketplace·Open VSX 악성 확장, 침해된 npm·Python 패키지   |

## 9. 결론과 권고

GlassWorm C2 takedown은 명백한 방어 측 성과이지만, 동시에 **공급망 멀웨어의 진화 방향을 압축적으로 보여주는 경고**다. 블록체인·P2P·정상 클라우드 서비스를 데드드롭으로 결합한 4중 C2는, 단일 도메인 차단에 의존하는 전통적 대응이 더 이상 충분하지 않음을 증명한다.

핵심 권고는 다음과 같다.

1. **개발자 환경은 신뢰 경계의 핵심 자산**이다. 개발 머신 침해는 곧 조직 전체와 모든 다운스트림 사용자의 침해다.
2. **takedown ≠ 복구.** 이미 유출된 자격증명·지갑 키는 별도로 무효화·이전해야 한다.
3. Web3 조직은 **자산·서명 권한·개발 환경의 3중 격리**를 기본값으로 삼아야 한다.
4. 비전통적 C2(온체인·P2P·정상 서비스 데드드롭) 탐지 역량을 SOC에 내재화해야 한다.

---

## 참고 문헌 (References)

[1] Ravie Lakshmanan, "GlassWorm Malware Takedown Disrupts Developer Supply Chain Attack Infrastructure", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/glassworm-malware-takedown-disrupts.html>

[2] CrowdStrike, "Inside CrowdStrike's Takedown of a Developer-Targeting Botnet", 2026-05. <https://www.crowdstrike.com/en-us/blog/inside-crowdstrike-takedown-of-a-developer-targeting-botnet/>

[3] Truesec, "GlassWorm: Self-Propagating VSCode Extension", 2025. <https://www.truesec.com/hub/blog/glassworm-self-propagating-vscode-extension>

[4] Kiran Raj (Endor Labs), "Invisible Threats: GlassWorm Unicode VSCode", Endor Labs. <https://www.endorlabs.com/reports/invisible-threats-glassworm-unicode-vscode>

[5] Dennis Kim, "MCP를 노리는 지능형 공격, 잠복형 공격 - 구조적 문제인가", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
