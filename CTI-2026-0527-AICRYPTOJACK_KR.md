| id             | CTI-2026-0527-AICRYPTOJACK                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | AI 챗봇 추천을 악용한 크립토재킹 - 검색 포이즈닝을 넘어선 새로운 전달 벡터                                                                                                                                                                       |
| subtitle       | LLM이 추천한 다운로드 링크가 악성 사이트로, GPU를 노린 채굴·원격접근·랜섬웨어 복합 캠페인                                                                                                                                                              |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-27                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | HIGH                                                                                                                                                                                                            |
| lang           | ko                                                                                                                                                                                                              |
| tags           | | AI-Search-Poisoning | Cryptojacking | LLM-Recommendation | DLL-Sideloading | ScreenConnect | GPU-Mining | | ------------------- | ------------ | ----------------- | --------------- | ------------ | ---------- | |
| threat\_actors | | Unattributed (GPU-mining 동기 금전형 행위자) | | ------------------------------------- |                                                                                                  |
| frameworks     | | MITRE ATT&CK (T1574 DLL Side-Loading · T1496 Resource Hijacking · T1219 Remote Access) | NIST SP 800-83 | | -------------------------------------------------------------------------------------- | ------------- | |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# AI 챗봇 추천을 악용한 크립토재킹 - 검색 포이즈닝을 넘어선 새로운 전달 벡터

> **리포트 ID** `CTI-2026-0527-AICRYPTOJACK` · **발행일** 2026-05-27 · **분류** `TLP:GREEN` · **심각도** 🔴 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*LLM이 추천한 다운로드 링크가 악성 사이트로, GPU를 노린 채굴·원격접근·랜섬웨어 복합 캠페인*

---

## 목차

1. 요약 (TL;DR)
2. 공격 개요 - AI 검색 포이즈닝의 부상
3. 공격 체인 분석 - DLL 사이드로딩에서 채굴까지
4. 표적 선정 - GPU 채굴 수익 극대화 전략
5. 한국에 미치는 영향
6. Web3·암호화폐 생태계에 미치는 영향
7. 대응 방안
8. IoC 및 탐지 지표
9. 결론과 권고
10. 참고 문헌

---

## 요약 (TL;DR)

2026년 5월 26일 Microsoft Defender Experts와 Microsoft Defender 보안 연구팀은, AI 챗봇과의 상호작용을 악성 다운로드 사이트 노출 메커니즘으로 활용하는 활성 크립토재킹 캠페인을 경고했다. Microsoft는 이를 "기존 검색 결과를 넘어 사회공학을 확장하고, 악성 소프트웨어 추천의 가시성을 높이는 신흥 전달 기법"으로 규정했다.

이 캠페인은 CrystalDiskInfo·HWMonitor·Display Driver Uninstaller·FurMark·K-Lite Codec Pack·PDFgear 같은 정상 시스템 유틸리티를 사칭한다. 표적은 고성능 GPU 보유자다 — 무차별 대량 감염이 아니라 **채굴 가치가 높은 시스템을 선별**하는 전략이다. 150개 이상의 악성 도메인이 식별됐다.

캠페인의 목표는 단순 채굴에 그치지 않는다. 위협 행위자는 ScreenConnect 배포를 통해 침해 호스트에 지속적 원격 접근을 확보하며, 이는 데이터 절취·횡적 이동·랜섬웨어 등 후속 활동으로 이어질 수 있다. 초기에는 SEO 포이즈닝으로 검색엔진을 오염시켰으나, 2026년 4월 이후 관측된 변종은 **사용자가 LLM 기반 도구에 소프트웨어 다운로드를 문의했을 때 생성된 응답 안에 공격자 통제 도메인 링크가 제시**되는 방식으로 진화했다.

### Key Judgments

| #    | 판단                                                                                                                                            | 신뢰도        |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | **AI 검색 포이즈닝**은 전통적 SEO 포이즈닝의 직접적 확장이며, LLM의 신뢰성 후광(halo) 때문에 사용자 클릭률이 검색결과보다 높을 가능성이 크다. 향후 가장 빠르게 성장할 멀웨어 전달 벡터다.                            | **High**   |
| KJ-2 | 이 캠페인의 본질적 위험은 채굴이 아니라 **ScreenConnect를 통한 지속적 원격 접근**이다. 채굴은 즉각 수익화 수단일 뿐, 동일 접근이 데이터 절취·랜섬웨어로 전환될 수 있다.                                      | **High**   |
| KJ-3 | 고성능 GPU 표적 선정은 **암호화폐 채굴자·AI 연구자·게이머·블록체인 개발자**가 우선 피해군임을 시사한다. 이는 Web3·AI 커뮤니티가 직접 표적임을 의미한다.                                                | **Medium-High** |
| KJ-4 | DLL 사이드로딩·process hollowing·Defender 예외 등록·분석도구 탐지 시 채굴 중단 등 **정교한 회피 기법**을 갖춰, 일반 사용자가 자력으로 탐지하기 어렵다.                                        | **High**   |

---

## 2. 공격 개요 - AI 검색 포이즈닝의 부상

공격은 사용자가 검색엔진에서 신뢰할 만한 시스템 유틸리티·하드웨어 모니터링 소프트웨어를 찾을 때 시작된다. SEO 포이즈닝 기법으로 조작된 악성 사이트가 검색 결과 상단에 노출된다.

그러나 2026년 4월 이후 관측된 변종에서는 진입 경로가 변했다. 사용자가 **AI 챗봇에 소프트웨어 다운로드 추천을 문의하면, 생성된 응답 안에 공격자 통제 도메인 링크가 제시**되는 것이다. Microsoft는 이를 관측된 패턴과 상관 데이터에 기반한 분석이라고 전제하면서도, AI 검색 결과 포이즈닝이라는 신흥 기법과 일치하며 전통적 SEO 포이즈닝을 기존 검색엔진 너머로 확장한 것이라고 평가했다.

각 악성 사이트에는 눈에 띄는 다운로드 버튼이 있고, 이를 누르면 `gleeze[.]com`의 캠페인별 서브도메인에서 ZIP 아카이브를 내려받는다. 이 인프라는 위협 행위자가 자주 사용하는 동적 DNS 제공업체 Dynu와 연관돼 있다. 150개 이상의 악성 도메인이 악성 도구를 배포하는 것으로 식별됐다.

## 3. 공격 체인 분석 - DLL 사이드로딩에서 채굴까지

| 단계 | 행위                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------- |
| ①   | 사용자가 ZIP 다운로드 → 정상 실행파일 + 악성 DLL(`autorun.dll`) 포함                                                  |
| ②   | 실행파일 실행 시 `autorun.dll` **사이드로딩** → `msiexec.exe`로 2차 악성 DLL(`vcredist_x64.dll`) 설치             |
| ③   | `vcredist_x64.dll`은 **ScreenConnect 설치 패키지** → `193.42.11[.]108`(공격자 서버)에 지속 접속 시도                 |
| ④   | ScreenConnect 세션이 `SimpleRunPE.exe` 실행 통로로 사용됨                                                       |
| ⑤   | Registry Run 키·예약작업으로 **지속성 확보**, Microsoft Defender 예외 등록, 안티분석 점검, **process hollowing**으로 채굴코드 실행 |
| ⑥   | 일부 침해에서는 PowerShell로 바이너리를 원격 드라이브에서 가져와 `vlc.exe`로 위장 저장·예약작업 생성 후 자기 삭제                            |
| ⑦   | hollowed 바이너리가 공격자 서버와 통신, 호스트 정보 전송, 런타임에 채굴기 아카이브 다운로드·실행                                          |

지원되는 채굴기는 **gminer, lolMiner, SRBMiner-MULTI** 세 가지다. 바이너리는 지속성 아티팩트를 재생성하고 Defender 예외를 재설정하여 제거에 저항한다. 또한 실행 중인 프로세스를 감시하다가 다음 분석 도구가 탐지되면 즉시 채굴기를 종료한다 — `taskmgr.exe`, `processhacker.exe`/`processhacker2.exe`, `procexp.exe`/`procexp64.exe`, `systeminformer.exe`. 이는 사용자가 작업관리자를 열어 이상 징후를 찾으려 할 때 채굴을 멈춰 탐지를 회피하는 전형적 수법이다.

## 4. 표적 선정 - GPU 채굴 수익 극대화 전략

이 캠페인은 일반적인 암호화폐 채굴 시도보다 의도적이다. 무차별 대량 감염 대신 **GPU 채굴 수율을 극대화하는 엔드포인트를 전략적으로 선별**한다. 사칭 대상 소프트웨어(CrystalDiskInfo, HWMonitor, FurMark, Display Driver Uninstaller 등)가 모두 고성능 GPU 사용자가 즐겨 찾는 유틸리티라는 점이 이를 뒷받침한다.

중요한 것은 캠페인의 목표가 금전적 동기에만 그치지 않는다는 점이다. 위협 행위자는 ScreenConnect를 통해 침해 호스트에 지속적 원격 접근을 확립하며, 이는 데이터 절취·횡적 이동·랜섬웨어 같은 후속 활동에 활용될 수 있다.

## 5. 한국에 미치는 영향

이 캠페인은 한국 언론에서 거의 다뤄지지 않았으나, 국내 사용자에게 특히 위험하다.

첫째, **국내 AI 챗봇 사용률이 급증**하고 있다. 사용자들이 점점 더 검색엔진 대신 LLM에 "○○ 프로그램 어디서 받아?"라고 묻는 행태가 보편화되면서, AI 검색 포이즈닝의 표적 면적이 빠르게 넓어지고 있다.

둘째, **국내 고성능 GPU 보유층이 두텁다.** 게이머, AI/딥러닝 연구자, 암호화폐 채굴자, 블록체인 개발자 등 GPU 집약적 사용자군이 정확히 이 캠페인의 표적이다. 사칭 대상 유틸리티(HWMonitor, FurMark 등)는 국내 PC 커뮤니티에서도 표준적으로 권장되는 도구다.

셋째, **ScreenConnect 같은 정상 원격관리도구(RMM)의 악용**은 국내 보안 솔루션이 정상 트래픽으로 오인하기 쉬워 탐지가 지연된다. process hollowing으로 Microsoft 서명 바이너리 아래에서 채굴이 돌아가면, 일반 사용자는 물론 일부 EDR도 놓칠 수 있다.

## 6. Web3·암호화폐 생태계에 미치는 영향

Web3·AI 커뮤니티는 이 캠페인의 **1차 표적군**에 해당한다.

첫째, **블록체인 개발자와 채굴자는 고성능 GPU 워크스테이션을 운용**한다. 이들은 정확히 캠페인이 노리는 "채굴 가치 높은 시스템"이며, 동시에 암호화폐 지갑·노드 키·배포 자격증명을 같은 머신에 둔 경우가 많다.

둘째, ScreenConnect를 통한 지속적 원격 접근은 단순 채굴을 넘어 **지갑 탈취·시드 추출·트랜잭션 변조**로 확장될 수 있다. 본 분석가가 `CTI-2026-0422-MCP`에서 경고한 "단일 머신에 자산·서명 권한·개발 도구가 집중된 구조"가 그대로 악용된다.

셋째, **AI 챗봇을 통한 도구 추천 악용**은 본 분석가가 MCP 리포트에서 다룬 "편향 주입·추천 조작" 위협의 실전 사례다. LLM이 매개하는 신뢰가 그대로 공격 표면이 되며, Web3 개발자처럼 새로운 도구를 자주 탐색하는 집단일수록 노출이 크다.

## 7. 대응 방안

### 7.1 사용자·개인 개발자

1. **소프트웨어는 항상 공식 사이트에서 직접 다운로드**한다. AI 챗봇이나 검색 결과의 다운로드 링크를 맹신하지 않고, 도메인을 직접 확인한다(공식 도메인 북마크 권장).
2. **다운로드한 실행파일의 디지털 서명을 확인**하고, ZIP에 정상 EXE와 정체불명 DLL이 함께 들어있으면 사이드로딩을 의심한다.
3. **GPU 사용률·발열 이상**을 모니터링한다. 단, 채굴기가 분석도구 실행 시 멈추므로, 작업관리자를 열지 않은 상태에서의 백그라운드 발열·팬 소음을 관찰한다.
4. **암호화폐 지갑은 GPU 작업용 머신과 분리**한다. 채굴·렌더링·게이밍 머신에 핫월렛을 두지 않는다.

### 7.2 조직·SOC

1. **RMM 도구 사용 정책 수립** — 승인되지 않은 ScreenConnect·AnyDesk·TeamViewer 설치를 탐지·차단한다. 정상 RMM과 악용을 구분하는 행위 기반 규칙을 적용한다.
2. **DLL 사이드로딩 탐지** — `autorun.dll`, `vcredist_x64.dll`의 비정상 경로 로딩, `msiexec.exe`의 비정상 DLL 설치 행위를 EDR 규칙으로 추가한다.
3. **Defender 예외 변조 모니터링** — Defender 제외 목록에 대한 무단 추가를 경보 대상으로 설정한다.
4. **process hollowing 탐지** — Microsoft 서명 바이너리가 비정상 메모리 영역에서 코드를 실행하는 패턴을 감시한다.
5. **악성 인프라 차단** — `gleeze[.]com` 서브도메인, `193.42.11[.]108`, Dynu 동적 DNS 관련 의심 도메인을 차단 목록에 추가한다.

## 8. IoC 및 탐지 지표

> ⚠️ 본 섹션은 공개 발표 시점 기준이며, 운용 적용 전 최신 위협 인텔리전스를 재확인할 것.

| 유형          | 지표                                                                       |
| ----------- | ------------------------------------------------------------------------ |
| 사칭 소프트웨어    | CrystalDiskInfo, HWMonitor, Display Driver Uninstaller, FurMark, K-Lite Codec Pack, PDFgear |
| 악성 DLL      | `autorun.dll`, `vcredist_x64.dll`                                        |
| 위장 실행파일     | `SimpleRunPE.exe`, `vlc.exe`(위장명)                                        |
| C2/배포 인프라   | `gleeze[.]com` 서브도메인, `193.42.11[.]108`, Dynu 동적 DNS                     |
| 채굴기         | gminer, lolMiner, SRBMiner-MULTI                                         |
| RMM 악용      | ScreenConnect (무단 배포)                                                    |
| 지속성         | Registry Run 키, 예약작업(Scheduled Task)                                     |
| 회피 기법       | DLL 사이드로딩, process hollowing, Defender 예외 등록, 분석도구 탐지 시 채굴 중단        |
| 악성 도메인 규모   | 150개 이상                                                                  |

## 9. 결론과 권고

이 캠페인은 **AI 보조 전달, 소프트웨어 사칭, 지속적 접근의 결합**이 위협 행위자가 현대 사용자 행태에 사회공학과 수익화 전략을 어떻게 적응시키는지를 보여준다. 핵심은 두 가지다.

첫째, **신뢰의 위치가 이동했다.** 사용자는 이제 검색 결과보다 AI 챗봇의 답변을 더 신뢰하며, 공격자는 정확히 그 신뢰를 노린다. AI 검색 포이즈닝은 SEO 포이즈닝의 다음 세대다.

둘째, **채굴은 입구일 뿐 출구가 아니다.** ScreenConnect를 통한 지속 접근은 언제든 데이터 절취·랜섬웨어로 전환될 수 있다. "그냥 채굴 멀웨어"라는 안일한 분류는 위험하다.

권고:

1. 소프트웨어는 **공식 출처에서만** 받고, AI·검색 추천 링크를 검증 없이 신뢰하지 않는다.
2. **RMM 도구 거버넌스**를 수립하고 무단 설치를 차단한다.
3. **암호화폐 지갑·서명 권한을 GPU 작업 머신에서 분리**한다.
4. DLL 사이드로딩·process hollowing·Defender 예외 변조를 SOC 탐지 규칙에 내재화한다.

---

## 참고 문헌 (References)

[1] Ravie Lakshmanan, "AI Chatbot Recommendations Redirect Users to Cryptojacking Malware Sites", The Hacker News, 2026-05-27. <https://thehackernews.com/2026/05/ai-chatbot-recommendations-redirect.html>

[2] Microsoft Defender Experts & Microsoft Defender Security Research Team, "Poisoned Search Results: GPU Mining Cryptojacking Campaign Abusing ScreenConnect & Microsoft .NET Utilities", Microsoft Security Blog, 2026-05-26. <https://www.microsoft.com/en-us/security/blog/2026/05/26/poisoned-search-results-gpu-mining-cryptojacking-campaign-abusing-screenconnect-microsoft-net-utilities/>

[3] Dennis Kim, "MCP를 노리는 지능형 공격, 잠복형 공격 - 구조적 문제인가", CTI-2026-0422-MCP, 2026-04-22. <https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/Cti%202026%200422%20mcp%20kr.MD>

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
