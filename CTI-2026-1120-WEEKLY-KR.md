<!-- --- id: CTI-2026-1120-WEEKLY title: "2026년 11월 중순 위협 브리프 — 공급망과 표적, 두 갈래로 들어오는 공격" title_en: "Mid-November 2026 Threat Brief — Supply Chain and Targeting, the Two Roads In" subtitle: "옵티마이즐리 공급망 공격, 라자루스 PHP2Shell, 김수키 NodeLinkRAT, NHN두레이·코인원 유출" description: "옵티마이즐리 공급망 공격, 라자루스 PHP2Shell 표적 목록, 김수키 NodeLinkRAT, NHN두레이·코인원 유출을 묶어 북한형 공급망·표적 공격의 특징과 대응을 정리했다." abstract: | 2026년 11월 12일부터 16일 사이 공개된 다섯 사건을 한 문서로 정리했다. 옵티마이즐리 Web Experimentation의 가입 절차 결함으로 178개 조직 웹사이트에 악성 스크립트가 배포됐고, 라자루스 연계 조직의 PHP2Shell 표적 목록에 한국 서버·도메인 30곳이 올랐으며, 김수키 추정 세력이 국회 세미나 참석자에게 신종 NodeLinkRAT을 유포했다. 같은 주 NHN두레이와 코인원 상담 수탁사에서 업무자료와 개인정보가 유출됐다. 다섯 건 중 북한 연계로 평가된 것은 두 건이며, 옵티마이즐리와 국내 유출 두 건은 공개 귀속이 없다. 북한 공격의 최근 특징(공급망을 발판으로 삼고, 사람과 조직을 정밀하게 고르는 방식)을 정리하고 조직·개인 대응 절차를 제시한다. TLP:CLEAR. 투자·법률 자문 아님. summary_for_ai: | CTI weekly brief (KO), id CTI-2026-1120-WEEKLY, date 2026-11-20, TLP:CLEAR, group weekly, severity HIGH. Covers five incidents disclosed 2026-11-12 to 2026-11-16: (1) Optimizely Web Experimentation supply-chain compromise (signup-flow flaw, 188 snippets / 178 organisations found by Report URI, crypto clipper + card skimmer + cookie/screenshot theft + routing of iOS devices to Coruna/DarkSword exploit kits; UNATTRIBUTED, financially motivated). (2) CYFIRMA: Lazarus-ecosystem operators staging PHP2Shell (CVE-2026-109618/109619) against a 216-host list in 10 countries, 30 in South Korea; listing is targeting, not confirmed compromise; 581-host figure is an adversary claim. (3) Genians: suspected Kimsuky (moderate confidence) reply-based spear phishing of a National Assembly seminar attendee, aNotepad dead-drop C2, new NodeLinkRAT on Node.js. (4) NHN Dooray account takeover via password-reset code guessing plus leaked Open API keys; no public attribution. (5) Coinone customer-support vendor MetaM server breach exposing consultation records; no public attribution. Only (2) and (3) are assessed as DPRK-linked. Do not describe (1), (4), (5) as North Korean operations. Analytic section describes recent DPRK tradecraft: supply chain as a foothold, precise targeting, abuse of legitimate services, fast N-day weaponisation with AI assistance, dual financial and espionage mandate. Figures for crypto theft differ by vendor (TRM Labs, Chainalysis, BitOK) and are estimates. Not investment or legal advice. date: 2026-11-20 updated: 2026-11-20 author: "Dennis Kim (김호광 / HoKwang Kim)" github: "gameworkerkim" lang: ko tags: - Weekly-Brief - Korea-Impact - DPRK - Supply-Chain - Lazarus - Kimsuky keywords: - "옵티마이즐리 공급망 공격" - "OPTIMJACK" - "PHP2Shell" - "라자루스" - "김수키" - "NodeLinkRAT" - "NHN두레이" - "코인원 메타엠" - "북한 해킹 동향" group: weekly featured: false featured_rank: 99 schema_type: TechArticle classification: "TLP:CLEAR" severity: HIGH confidence: "B2" license: "CC BY-NC-SA 4.0" draft: false robots: index,follow --- -->

# 2026년 11월 중순 위협 브리프 — 공급망과 표적, 두 갈래로 들어오는 공격

**— 옵티마이즐리 공급망 공격, 라자루스 PHP2Shell, 김수키 NodeLinkRAT, NHN두레이·코인원 유출 종합 분석과 북한형 공격 대응 가이드**

Nov 20, 2026 · Dennis Kim · Cyworld 전 대표

| 항목 | 내용 |
| --- | --- |
| 문서 유형 | 사이버 위협 인텔리전스(CTI) 주간 사건 분석 리포트 |
| 기준일 | 2026년 11월 20일 (KST) |
| 대상 기간 | 2026년 11월 12일 ~ 11월 16일 공개 사건 (준비 단계는 6월까지 소급) |
| 위협 분류 | 클라이언트 측 공급망 침해 / 국가배후 표적 공격 / SaaS 계정 탈취 / 수탁사 침해 |
| 위협 행위자 | Lazarus 생태계(평가), Kimsuky(평가, 중간 신뢰도), 미귀속 금전 목적 행위자 |
| 종합 위험도 | **High** (조직 유형에 따라 Critical ~ Medium, 4장 참조) |
| 조사 상태 | 전 건 진행 중. 옵티마이즐리 상태 페이지는 11월 18일 기준 미해결 표기 |
| TLP | TLP:CLEAR |

> 이 문서는 1차 요약본을 원문 출처와 대조해 보강한 것이다. 요약본과 달라진 부분은 8장 "원 요약본 대비 정정 사항"에 따로 모았다.

---

## 0. 핵심 요약 (Executive Summary)

1. **옵티마이즐리 공급망 공격(OPTIMJACK)**: 11월 16일, 공격자가 Optimizely Web Experimentation의 계정 가입 절차 결함을 이용해 고객 프로젝트의 "Project JavaScript" 필드에 악성 코드를 써넣었다. 변조된 스니펫은 옵티마이즐리 CDN에서 정상 인증서로 배포됐다. Report URI는 점검한 1,611개 스니펫 중 188개(178개 조직)에서 감염을 확인했다.
2. **악성코드는 다목적 키트였다**: 가상화폐 주소 바꿔치기, 결제 카드 스키밍, 쿠키·화면 캡처 탈취, iOS 기기를 Coruna·DarkSword 익스플로잇 킷 도메인으로 보내는 라우팅이 한 스크립트에 들어 있었다.
3. **라자루스 PHP2Shell 표적 목록**: CYFIRMA가 확보한 10개국 216개 표적 목록에 한국 서버·도메인 30곳이 포함됐다. 목록 등재는 "표적화"이지 "침해 확인"이 아니다. 581개 호스트라는 수치는 공격자 측 주장이다.
4. **김수키 추정 NodeLinkRAT**: 국회 세미나 실제 참석자에게 국회의원실 선임비서관을 사칭해 접근했다. 첫 메일에 첨부를 일부러 빼 회신을 받아낸 뒤 악성 파일을 보냈고, 공개 메모장 서비스를 명령 채널로 썼다. 지니언스의 귀속 신뢰도는 "중간"이다.
5. **NHN두레이·코인원 유출**: 두레이는 비밀번호 찾기 인증번호 반복 입력과 오픈 API 키 유출이 겹쳤고, 코인원은 거래 시스템이 아니라 고객 상담 수탁사(메타엠) 서버가 뚫렸다. 두 건 모두 공개된 귀속은 없다.
6. **귀속을 구분해야 한다**: 다섯 건 중 북한 연계로 평가된 것은 3번과 4번, 두 건이다. 옵티마이즐리 건은 금전 목적의 미귀속 행위자이며, 북한과 연결하는 공개 근거는 없다.
7. **그럼에도 한 묶음으로 읽어야 하는 이유**: 다섯 건의 진입 지점은 모두 본체가 아니라 주변이다. 제3자 스크립트, 런타임, 협업 SaaS, 상담 외주, 그리고 사람. 이 구조는 북한 조직이 2025~2026년에 가장 큰 성과를 낸 방식과 겹친다. 북한의 공격은 공급망으로 발판을 만들고 표적을 정밀하게 골라 수확하는 2단 구조로 수렴하고 있다.
8. **유출 정보는 다음 표적 공격의 재료다**: 두레이의 조직도·연락처·업무 맥락, 코인원의 주민등록번호·지갑주소·거래식별번호는 사칭과 스피어 피싱의 정확도를 끌어올린다. 귀속과 무관하게 유출 이후의 2차 공격에 대비해야 한다.

---

## 1. 사건 개요 (Situation)

### 1.1 통합 타임라인

시각 표기는 출처 기준이다. 옵티마이즐리 건은 UTC, 국내 건은 KST.

| 일시 | 사건 |
| --- | --- |
| 6월 18일 | 김수키 추정 캠페인의 메모장 C2에 XenoRAT 변종 게시 (Genians) |
| 9월 9일 ~ 13일 | 국회 세미나 개최(9일), 사칭 메일 발송(12일), 피해자 회신 후 악성 압축파일 전달(13일) |
| 9월 17일 | 옵티마이즐리 공격자의 인젝터 `webshell[.]lol`, 터키 사이트에서 최초 관측 (Report URI) |
| 10월 16일 | 메모장 C2에 NodeLinkRAT 설치 코드 게시 |
| 10월 21일 | PHP2Shell 패치 배포 (PHP 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35) |
| 10월 22일 ~ 29일 | CYFIRMA 권고 V1~V4. 216개 표적, 스캔 노드 21개, 공격자 주장 581개 호스트 |
| 10월 28일 | 공격자 채널에서 한국·일본·미국·태국·인도네시아·인도 IP 대역을 유망 표적으로 언급 (국내 보도) |
| 11월 12일 04:00경 | 코인원 상담 수탁사 메타엠 서버 침입. 코인원 09:20경 인지 |
| 11월 12일 22:00 ~ 13일 새벽 | NHN두레이 일부 고객사 계정 무단 접근, 오픈 API 키 악용 호출 |
| 11월 13일 | 두레이, API 키 전량 폐기·API 중단 공지. KISA 신고 |
| 11월 13일 ~ 16일 | 옵티마이즐리 공격자의 선행 공격. Kissmetrics·StorifyMe·Minute Media 스크립트 경유 |
| 11월 14일 | 두레이, 업무자료·개인정보 유출 확인 공지. 개인정보보호위원회 신고. 메타엠 안내문 게시 |
| 11월 15일 | 코인원 유출 공지. 국내 언론, CYFIRMA 보고서의 한국 표적 30곳 보도 |
| 11월 16일 04:21 UTC | 옵티마이즐리 스니펫 최초 변조 관측 (BBC 프로젝트) |
| 11월 16일 13:43 UTC | 카드 스키머 모듈 추가 |
| 11월 16일 17:13 ~ 17:57 UTC | 두 번째 iOS 라우터 추가, iOS 18.6 이하 대상 Coruna 프레임 주입 |
| 11월 16일 20:40 ~ 21:10 UTC | 대량 정리. 21:52 기준 1개 스니펫만 잔존 |
| 11월 16일 | 지니언스, NodeLinkRAT 분석 보고서 공개 |
| 11월 17일 ~ 18일 | 옵티마이즐리 사고 인정(17일), 가입 절차 결함과 "고객의 5% 미만 영향" 공지(18일) |
| 11월 19일 | 금융감독원, 전 가상자산사업자 CISO 대상 해킹 대응회의 (예정 보도 기준) |

### 1.2 옵티마이즐리 공급망 공격 (OPTIMJACK)

**무엇이 뚫렸나.** 옵티마이즐리 CDN이 해킹된 것이 아니다. 공격자는 고객이 직접 편집할 수 있는 설정 필드에 대한 쓰기 권한을 얻었고, CDN은 받은 내용을 그대로 배포했다. 옵티마이즐리는 11월 18일 공지에서 공격자가 Web Experimentation 계정 가입 절차의 결함으로 표적 고객 계정의 사용자를 가장해 스크립트를 넣었다고 설명했다. 결함의 구체적 작동 방식, CVE, 영향 버전 범위는 공개되지 않았다.

**왜 막지 못했나.** 변조된 파일은 `cdn.optimizely.com`에서 유효한 인증서와 함께 내려왔다. 도메인 허용 목록만으로 구성한 방어는 이 경로를 신뢰된 1차 스크립트로 취급한다. Report URI 조사에서 제한적인 `script-src`를 둔 CSP는 점검 대상 256개 사이트 중 24곳에서 페이로드를 차단했지만, `'strict-dynamic'`이나 `'unsafe-eval'`을 허용한 정책은 통과시켰다.

**페이로드 구성.**

| 단계 | 기능 | 비고 |
| --- | --- | --- |
| 로더 | Project JavaScript에 삽입, 외부 `track.js` 로드 | 하루 동안 26회 재빌드 |
| 클리퍼 | 복사·붙여넣기되는 지갑 주소를 공격자 주소로 교체 | BTC, ETH/EVM, TRON, SOL, TON, LTC, BCH, DOGE 8개 지갑 |
| 카드 스키머 | 폼 제출과 외부 요청에서 카드번호·유효기간·CVV 수집 | 13:43 UTC부터. Stripe·Adyen 등 교차 출처 iframe 결제는 범위 밖 |
| 쿠키·화면 탈취 | HttpOnly가 아닌 쿠키, URL, html2canvas 화면 캡처 | 백그라운드 비콘 전송 |
| iOS 분기 | 기기 버전 식별 후 숨은 iframe으로 익스플로잇 킷 도메인 연결 | iOS 13~17 Coruna, 18.x DarkSword, iOS 26은 식별만 |

**피해 규모.** 온체인으로 확인된 탈취액은 약 7,000달러 수준이다. 이 숫자는 지갑 입금만 센 것이고, 탈취된 카드·쿠키·기기 수는 알려지지 않았다. 감염이 확인된 조직에는 Zoom, BBC, CNN, Fox News, Salesforce, GitLab, HSBC, IKEA, Equifax, Air France-KLM, Ledger, 그리고 옵티마이즐리 자사가 포함된다. 업종별로는 금융 32곳, 기술·SaaS 23곳, 유통 20곳 순이다. 노출 시간은 대부분의 사이트에서 약 16시간이다.

**귀속.** 미귀속이다. 공개 분석은 이 행위자를 금전 목적 그룹으로 본다. Coruna와 DarkSword는 익스플로잇 킷 이름이지 행위자 이름이 아니며, 과거 이 킷을 쓴 것으로 알려진 그룹과 이번 공격자를 잇는 공개 근거도 없다. Coruna의 배경은 본 저장소의 [`CTI-2026-0320-CORUNA_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0320-CORUNA_KR.md) 참조.

### 1.3 라자루스 연계 PHP2Shell 표적화

**취약점.** PHP2Shell은 PHP 코어의 비인증 원격 코드 실행 결함 두 건(CVE-2026-109618, CVE-2026-109619, CVSS v4.0 9.2)을 묶어 부르는 이름이다. 결함이 애플리케이션이 아니라 PHP 엔진에 있으므로 WordPress, Magento, Laravel 등 위에 올라간 코드가 깨끗해도 영향을 받는다. 취약점 자체의 분석은 [`CTI-2026-10-22-PHP_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-10-22-PHP_KR.md)에 있다.

**캠페인.** CYFIRMA는 폐쇄형 I2P 채널에서 한국어로 과업을 나누는 운영자들을 관찰했다. 이들은 공개 PoC를 가져와 로컬 AI 모델로 우선순위를 매기고 실험 환경에서 검증한 뒤, 탐지를 피하려 낮은 빈도로 스캔 노드를 돌려가며 표적을 건드렸다.

| 국가 | 표적 수 | 국가 | 표적 수 |
| --- | --- | --- | --- |
| 미국 | 49 | 태국 | 16 |
| 일본 | 47 | UAE | 14 |
| 인도 | 31 | 인도네시아 | 10 |
| **한국** | **30** | 호주 | 10 |
| 사우디아라비아 | 5 | 싱가포르 | 4 |

우선 표적 산업은 정부, 은행·금융, 통신, 핵심 인프라, 물류·항공, 제조, 온라인 거래 플랫폼이다. 침투 후 행동으로는 PHP 웹셸 설치, cron·SSH 키 등록, `wp-config.php`·`.env`·DB 자격증명·API 키 수집, 내부망 수평 이동이 보고됐다.

**확인된 것과 아닌 것.**

| 구분 | 내용 |
| --- | --- |
| 확인 | 216개 표적 목록 원본 확보, 두 CVE의 성격과 점수, 저빈도 점검·초기 악용 시도 지속 |
| 평가 | 라자루스 생태계의 북한 연계 운영자, 금전과 첩보의 이중 임무 |
| 미확인 | 581개 호스트(공격자 주장), 호스트별 악용 성공 여부, 웹셸 설치 주장(자체 보고) |
| 한국 30곳 | 실제 공격이 이뤄졌는지, 침해에 성공했는지 확인되지 않음. IP 끝자리는 마스킹 공개 |

귀속 신뢰도는 10월 22일 V1에서 라자루스 연계 "중간"이었고 10월 29일 V4에서 "높음"으로 올랐다. CYFIRMA 스스로 언어만으로는 귀속이 되지 않는다고 적었고, 초기 판에서는 한국어권 범죄 조직 가능성도 열어 뒀다. 무엇이 신뢰도를 올렸는지는 공개 본문에 없다.

### 1.4 김수키 추정 NodeLinkRAT 캠페인

**표적 선정.** 공격자는 9월 9일 국회 세미나에 실제로 참석한 사람을 골랐다. 9월 12일 국회의원실 선임비서관 명의로 "세미나 사례비 관련 서류 요청" 메일을 보내면서 신청서를 일부러 첨부하지 않았다. 피해자가 첨부가 없다고 회신하자 그때 악성 압축파일을 보냈다. 피해자가 먼저 요청한 파일이 되므로 의심이 낮아진다.

**감염 체인.**

```
[회신 유도 메일] -> 웹메일 대용량 첨부 링크의 ZIP
        |
        v
[.hwp.lnk 바로가기]  아이콘은 GitHub 저장소에서 로드
        |  숨김 PowerShell (식별자 치환 난독화)
        v
[curl.exe] -> 국내 무료 호스팅(dothome)에서 2단계 스크립트
        |  정상 HWP 사례비 신청서를 열어 위장, LNK 삭제
        v
[%APPDATA%에 VBS + UPA.ps1 드롭]
        |  예약 작업 CommonMaintenanceHost, 38분 주기
        v
[anotepad.com 메모] -> 표식 사이 Base64를 메모리에서 실행
        |
        v
[페이로드 교체: XenoRAT -> 정찰·클라우드 유출 -> 문서 탈취 -> NodeLinkRAT]
```

**메모장 C2의 의미.** 공격자는 임플란트를 건드리지 않고 메모 내용만 바꿔 페이로드를 교체했다. 6월 XenoRAT, 9월 정찰 스크립트(백신·텔레그램 폴더·최근 파일 목록을 Dropbox와 MEGA로 전송), 9월 28일 문서 탈취(Office·PDF·HWP·이미지), 10월 16일 NodeLinkRAT 순이다. 한 시점의 코드나 C2 주소만 보고는 공격 전체를 재구성할 수 없다.

**NodeLinkRAT.** 공식 Node.js 런타임을 내려받아 설치한 뒤 그 위에서 `teamview.js`를 실행한다. Socket.IO로 C2에 붙고 AES-256-GCM으로 통신을 암호화하며, 명령 실행, 파일 탈취, 실시간 화면 열람이 가능하다. 서명된 정상 `node.exe` 안에서 돌기 때문에 정적 시그니처 탐지를 피한다.

**귀속.** 지니언스 시큐리티 센터는 김수키 활동으로 평가하되 신뢰도를 "중간"으로 제시했다. 근거는 유출용 Dropbox 계정이 2025년 대북 전문가 대상 피싱에 쓰인 주소와 연결되는 점, 네이버 MYBOX 피싱 키트가 2024년 12월 김수키 캠페인과 일치하는 점, XenoRAT 샘플 3종이 같은 사용자 정의 GUID를 공유하는 점, 네이버 로그인 위장 도메인이다. 다른 조직의 모방 가능성은 배제하지 않았다. 실제 피해나 자료 유출 여부는 공개되지 않았다.

### 1.5 NHN두레이 침해

- **경로 1, 계정 탈취**: 외부인이 비밀번호 찾기 과정의 인증번호를 반복 입력해 인증을 통과한 뒤 일부 계정의 비밀번호를 바꾸고 로그인했다. 허용 시도 횟수와 검증 방식은 공개되지 않았다.
- **경로 2, API 키**: 오픈 API의 보안 취약점으로 일부 인증키가 유출됐고, 이 키를 이용한 외부 호출이 확인됐다.
- **유출 항목**: 고객사 업무자료(프로젝트, 드라이브, 메신저, 캘린더, 메일), 임직원 ID·이름·외부 메일·전화번호·부서·직급·직책·회사.
- **조치**: 공격 IP 차단, 비밀번호 찾기 인증 강화, 서비스·관리자 API 키 전량 폐기, API 일시 중단.
- **미공개**: 피해 고객사 수, 유출 인원, 자료 건수와 용량, 공공기관 피해 여부, 두 경로 사이의 연관성. 두레이는 민간과 공공 부문에 모두 공급되는 서비스다.

### 1.6 코인원 상담 수탁사(메타엠) 침해

- **경로**: 코인원 본체가 아니라 고객 상담 업무를 위탁받은 메타엠의 서버가 침입당했다. 코인원은 회원 계정, 거래, 지갑 시스템이 수탁사 서버와 분리돼 있고 직접 침입 정황은 없다고 밝혔다.
- **유출 가능 항목**: 이름, 이메일, 전화번호, 생년월일, 계좌번호, 비밀번호, 주민등록번호, 신분증 발급일자, 자택 주소, 지갑주소, 거래ID(TXID). 고객이 상담 중 직접 남긴 정보라 사람마다 항목이 다르다.
- **통지 시차**: 인지는 12일 09:20경, 공지는 15일이다. 메타엠 안내문이 하루 먼저 올라왔다.
- **확산 가능성**: 메타엠은 여러 기업의 상담을 맡는 업체이고, 다른 고객사 영향도 조사 대상이다.
- **업계 맥락**: 같은 시기 빗썸(그룹웨어 경유, 고객 844명·임직원 715명), 플라이빗(고객 40명), 고팍스(이용자 7명·임직원 2명, 11월 6일 협박 메일 후 입출금·매매 중단), 프라뱅(핫월렛에서 약 1억 원 탈취)에서 사고가 이어졌다. 금융위원회에 따르면 9월 30일부터 11월 3일까지 금융권 37개사에서 40건의 침해사고가 신고됐다.

### 1.7 확인되지 않은 정보의 구분

| 주장 | 상태 |
| --- | --- |
| 옵티마이즐리 공격이 북한 소행 | 근거 없음. 공개 분석은 미귀속 금전 목적 행위자로 분류 |
| 옵티마이즐리를 통해 iPhone이 실제로 감염됨 | 미확인. 익스플로잇 킷으로의 연결은 확인, 악용 성공은 입증되지 않음 |
| 영향 조직은 178곳 | 하한선. 표본 1,611개 중 확인된 수치이며 실제는 더 많을 수 있음 |
| 라자루스가 한국 서버 30곳을 침해 | 미확인. 표적 목록 등재만 확인 |
| 두레이·코인원 유출이 라자루스 캠페인과 연결 | 확인된 연관성 없음 |
| 김수키 캠페인으로 국회 자료가 유출 | 미공개. 표적은 세미나 참석자 개인이며 피해 여부는 발표되지 않음 |

---

## 2. 사건별 특징

### 2.1 다섯 사건의 공통 구조

| 사건 | 실제로 뚫린 곳 | 피해가 나타난 곳 | 신뢰를 빌린 대상 |
| --- | --- | --- | --- |
| 옵티마이즐리 | SaaS의 가입 절차와 설정 필드 | 178개 조직의 웹사이트 방문자 | 벤더 CDN 도메인과 인증서 |
| PHP2Shell | 언어 런타임 | 그 위에서 도는 모든 애플리케이션 | 패치된 애플리케이션이라는 안도감 |
| NodeLinkRAT | 한 사람의 메일함과 PC | 정책 커뮤니티 문서와 인맥 | 실제 행사 참석 사실, 정상 클라우드, 서명된 node.exe |
| NHN두레이 | 비밀번호 찾기와 오픈 API | 고객사 업무자료와 조직 정보 | 협업 도구 계정 |
| 코인원 | 상담 수탁사 서버 | 거래소 고객의 신원·금융 정보 | 위탁 계약 |

본체는 한 곳도 정면으로 뚫리지 않았다. 다섯 건 모두 방어 주체가 직접 통제하지 않는 지점에서 시작됐다.

### 2.2 공급망 공격의 무게중심 이동

지금까지 공급망 공격은 주로 패키지 저장소(npm, PyPI)와 빌드 파이프라인의 문제였다. 옵티마이즐리 건은 무게중심이 **쓰기 권한을 가진 SaaS**로 옮겨갈 수 있음을 보여준다. 고객 웹페이지에 코드를 밀어 넣을 수 있는 서비스(A/B 테스트, 태그 매니저, 분석, 채팅 위젯, 동의 관리 도구)는 모두 같은 위험을 진다. 공격자는 그 서비스의 인프라가 아니라 "누가 그 필드를 고칠 수 있는가"만 장악하면 된다.

### 2.3 표적 공격의 정밀화

김수키 추정 캠페인은 세 가지를 보여준다.

- **사실에 기반한 미끼**: 가짜 행사가 아니라 실제 열린 세미나와 실제 참석 사실을 썼다.
- **회신 유도**: 악성 파일을 피해자가 요청한 형태로 만들어 첫 메일의 보안 검사를 비켜 갔다.
- **운영 중 교체**: 같은 메모장 C2가 6월부터 10월까지 네 종류의 페이로드를 차례로 실었다. 임플란트는 그대로 두고 내용물만 바꿨다.

라자루스 측 캠페인은 대량 스캔처럼 보이지만 표적 산업을 미리 정하고, 반응이 나쁜 노드는 버리며, 저빈도로 움직였다. 무차별 살포가 아니라 선별된 목록에 대한 조용한 접근이다.

### 2.4 주변부 유출의 2차 효과

두레이와 코인원에서 나간 정보는 그 자체의 피해로 끝나지 않는다.

- 조직도, 직급, 연락처, 메신저 대화, 일정은 **누구를 사칭해 누구에게 무엇을 요청하면 통하는지** 알려준다.
- 지갑주소와 TXID는 **실제 거래 내역을 인용하는 사칭**을 가능하게 한다. 2025년 코인베이스 사례에서 범죄자는 유출된 고객 정보로 직원을 사칭해 고객이 스스로 코인을 보내게 만들었다.
- 주민등록번호와 신분증 발급일자는 **명의도용과 본인확인 우회**의 재료다.

---

## 3. 위협 분석

### 3.1 MITRE ATT&CK 매핑

| 사건 | 전술 | 기법 | ID |
| --- | --- | --- | --- |
| 옵티마이즐리 | Initial Access | Compromise Software Supply Chain | T1195.002 |
| 옵티마이즐리 | Initial Access | Drive-by Compromise | T1189 |
| 옵티마이즐리 | Collection | Input Capture / Clipboard Data / Screen Capture | T1056 / T1115 / T1113 |
| 옵티마이즐리 | Execution | Exploitation for Client Execution | T1203 |
| PHP2Shell | Reconnaissance | Active Scanning | T1595 |
| PHP2Shell | Initial Access | Exploit Public-Facing Application | T1190 |
| PHP2Shell | Persistence | Web Shell / Cron / SSH Authorized Keys | T1505.003 / T1053.003 / T1098.004 |
| PHP2Shell | Credential Access | Credentials In Files | T1552.001 |
| NodeLinkRAT | Initial Access | Spearphishing Link | T1566.002 |
| NodeLinkRAT | Execution | Malicious File (LNK) / PowerShell | T1204.002 / T1059.001 |
| NodeLinkRAT | Persistence | Scheduled Task | T1053.005 |
| NodeLinkRAT | Command and Control | Dead Drop Resolver | T1102.001 |
| NodeLinkRAT | Exfiltration | Exfiltration to Cloud Storage | T1567.002 |
| NHN두레이 | Credential Access | Brute Force (인증번호 반복 입력) | T1110 |
| NHN두레이 | Defense Evasion / Lateral Movement | Application Access Token | T1550.001 |
| 코인원 | Initial Access | 수탁사 서버 침입 경로 미공개 | - |
| 코인원 | Collection | Data from Information Repositories | T1213 |

### 3.2 기존 방어 수단의 유효성

| 방어 수단 | 이번 사건에서의 효과 | 이유 |
| --- | --- | --- |
| 도메인 허용 목록 | 무력 | 악성 코드가 신뢰 도메인에서 내려옴 |
| 제한적 CSP (`script-src`, `connect-src`) | 부분 유효 | 256곳 중 24곳 차단. `'strict-dynamic'`·`'unsafe-eval'` 허용 시 통과 |
| 결제 iframe 분리 | 유효 | 교차 출처 결제 프레임의 카드 정보는 스키머가 읽지 못함 |
| HttpOnly 쿠키 | 유효 | 스크립트가 읽을 수 없는 쿠키는 탈취 대상에서 제외 |
| 애플리케이션 업데이트 | 무력 (PHP2Shell) | 결함이 런타임에 있음. 코어 패치 후 워커 전체 재시작 필요 |
| 파일 시그니처 기반 백신 | 약함 (NodeLinkRAT) | 서명된 node.exe와 정상 클라우드 서비스 악용 |
| 행위 기반 EDR | 유효 | 웹 서버 프로세스의 셸 실행, 공개 메모장 주기 접속 같은 행위는 드러남 |
| 본체 시스템 망분리 | 부분 유효 (코인원) | 거래 시스템은 지켰지만 수탁사에 있던 개인정보는 범위 밖 |

---

## 4. 위험도 평가 (Risk Assessment)

### 4.1 사건별 평가

| 사건 | 귀속 | 귀속 신뢰도 | 한국 관련성 | 위험도 |
| --- | --- | --- | --- | --- |
| 옵티마이즐리 | 미귀속 금전 목적 | 해당 없음 | 간접. 감염 사이트 방문자와 국내 도입 기업 | High |
| PHP2Shell | 라자루스 생태계 | 중간 → 높음 (CYFIRMA) | 직접. 표적 30곳 | Critical (미패치 인터넷 노출 PHP) |
| NodeLinkRAT | 김수키 | 중간 (Genians) | 직접. 국회·정책 커뮤니티 | High |
| NHN두레이 | 공개 귀속 없음 | 해당 없음 | 직접. 민간·공공 고객사 | High |
| 코인원 | 공개 귀속 없음 | 해당 없음 | 직접. 거래소 고객 | High |

### 4.2 조직 유형별 위험도

| 조직·개인 유형 | 위험도 | 근거 |
| --- | --- | --- |
| 인터넷에 노출된 미패치 PHP 서버 운영 기관 (정부·금융·통신·제조·물류) | **Critical** | 실제 악용 진행 중, 표적 목록에 한국 포함 |
| 가상자산 거래소·커스터디·Web3 기업 | **Critical** | 북한 수익의 중심 표적, 외주·그룹웨어 경유 사고 연속 |
| 결제·로그인 페이지에 제3자 스크립트를 싣는 서비스 | **High** | 벤더의 쓰기 권한이 곧 자사 페이지의 실행 권한 |
| 외교·안보·대북 정책 연구자, 국회·정당 관계자, 기자 | **High** | 실명·실제 일정 기반 표적 피싱의 상시 대상 |
| 두레이 등 협업 SaaS를 쓰는 기업·기관 | **High** | 업무 맥락 유출 후 사칭 공격 가능성 |
| 코인원 상담 이력이 있는 고객 | **High** | 신원·금융·거래 정보 조합 유출 가능 |
| 구형 iOS 사용자 | **Medium ~ High** | iOS 18.7.3 미만, 26.3 미만은 익스플로잇 킷 대상 |
| 그 외 일반 이용자 | **Medium** | 카드·쿠키 노출 가능성은 방문 사이트에 따라 다름 |

### 4.3 종합 판단

위험의 크기를 정하는 것은 조직의 방어 수준이 아니라 **의존하는 제3자의 수와 그들에게 준 권한**이다. 자사 보안이 견고해도 스크립트 벤더, 런타임, 협업 도구, 상담 외주 가운데 하나가 열리면 결과는 같다. 이번 주의 다섯 건은 그 네 종류의 문이 닷새 사이에 모두 열릴 수 있다는 것을 보여줬다.

---

## 5. 북한 해킹의 최근 특징 — 공급망으로 들어와 표적에서 거둔다

이 장은 이번 주 사건에 한정하지 않고 2025~2026년 공개 자료를 종합했다. 조직명과 수치는 벤더마다 다르고 추정치다.

### 5.1 2단 구조: 공급망은 발판, 표적은 수확

북한 조직의 대형 사건은 대체로 같은 순서를 밟는다. 신뢰받는 제3자를 먼저 오염시키고(공급망), 그 안에서 원하는 사람과 시스템을 골라(표적), 준비가 끝나면 짧은 시간에 거둔다.

| 사건 | 공급망 단계 | 표적 단계 |
| --- | --- | --- |
| 바이비트 (2025.2, 약 15억 달러) | 거래소가 쓰던 Safe 멀티시그 플랫폼 개발자 장비 침해, 서명 화면 변조 | 특정 거래소의 콜드월렛 이체 승인 |
| Axios npm (2026.3) | 주간 약 1억 회 다운로드 패키지의 유지보수자 계정 탈취 | 감염된 환경 중 가치 있는 서명·배포 파이프라인 |
| Drift Protocol (2026.4, 약 2억 8,500만 달러) | 위장 퀀트 회사와 실제 투자로 수개월간 신뢰 구축 | 핵심 기여자의 사전 서명 유도, 관리자 권한 장악 |
| 바이낸스 (2026.10, 약 63억 달러) | 변조된 개발 도구, 가짜 채용 과제, 사내 AI 도구 악용 | 지갑 인프라 담당자와 서명 권한. 5개월 준비, 약 20분 유출 |
| AI 코딩 도구 설정 변조 (Google 보고) | 사내 코드 저장소의 AI 도구 설정 파일에 자동 실행 백도어 | 북미·유럽 가상자산 기업 개발자 |
| 국내 문서관리 솔루션 (국정원 2025 연례보고서) | 국내 문서관리 솔루션 3종의 취약점으로 관리자 계정 생성 | 도입 기관의 민감 자료. 제품별 최소 700건 ~ 최대 260만 건 |

이번 주의 라자루스·김수키 건은 이 구조의 양 끝을 각각 보여준다. PHP2Shell 캠페인은 **런타임이라는 공통 기반**을 통해 여러 산업에 한꺼번에 발을 들이려는 시도이고, NodeLinkRAT 캠페인은 **한 사람을 고르는 일**의 정밀도를 보여준다.

FBI는 11월 12일 경보에서 북한 행위자가 화상회의 사칭 수법으로 18개월 동안 4억 달러 이상을 탈취했고, 몰래 녹화한 피해자 웹캠 영상 900여 건을 확보해 다음 사칭에 활용했으며, 다운로드 규모가 큰 오픈소스 라이브러리의 유지보수자도 노렸다고 밝혔다. 사람을 속이는 작업과 공급망을 노리는 작업이 같은 조직 안에서 이어져 있다는 뜻이다.

본 저장소의 관련 문서: [`CTI-2026-1101-NORTHKOREA-BINANCE-REPORT_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-1101-NORTHKOREA-BINANCE-REPORT_KR.md), [`CTI-2026-0521-DPRK-TRENDS_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-0521-DPRK-TRENDS_KR.md), [`CTI-2026-1015-DPRK-LAPTOP-FARM_KR.md`](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT/blob/main/CTI-2026-1015-DPRK-LAPTOP-FARM_KR.md).

### 5.2 정상 서비스 뒤에 숨는다

차단하기 어려운 정상 인프라를 쓴다. 이번 김수키 추정 캠페인만 봐도 공개 메모장(명령), Dropbox와 MEGA(유출), GitHub(아이콘), 국내 무료 호스팅(스크립트와 문서 수신), 공식 Node.js 런타임(실행)이 동원됐다. 악성 IP와 해시를 막는 방식은 이 구성 앞에서 한계가 분명하다.

### 5.3 패치 공개에서 무기화까지의 시간이 줄었다

PHP2Shell 패치는 10월 21일에 나왔고, CYFIRMA는 10월 22일에 이미 운영자들의 표적 논의를 관찰했다. 공개 PoC를 로컬 AI 모델로 선별·검증하는 과정이 보고됐다. 별도로 Aviatrix는 라자루스 연계 행위자가 같은 취약점으로 유럽 정부 기관에 침투한 뒤 에이전트형 AI로 후속 작업을 2시간 안에 끝냈다고 분석했다(단일 벤더 분석). 지니언스는 8~9월 김수키가 로컬 LLM과 AI 코딩 에이전트로 미끼 문서를 양산한 흔적을 보고했다.

AI가 새로운 공격을 만든 것은 아니다. 표적 조사, 미끼 제작, 취약점 선별, 침투 후 작업처럼 사람 손이 많이 가던 단계를 줄였다. 방어 측의 패치 주기와 대응 시간이 같은 폭으로 줄지 않으면 격차가 벌어진다.

### 5.4 경제: 탈취의 산업화

| 지표 | 수치 | 출처 |
| --- | --- | --- |
| 2026년 북한 귀속 가상자산 탈취액 | 약 74억 달러 (10월 29일까지) | TRM Labs |
| 2026년 전 세계 해킹 피해액 중 북한 비중 | 85% (TRM), 약 89% (Chainalysis, 10월 말) | 벤더별 상이 |
| 2017년 이후 누적 | 약 128억 달러 | TRM Labs |
| 2026년 1~10월 사건 수 | 38건, 약 76억 달러 | BitOK |
| 화상회의 사칭 수법 피해 | 18개월간 4억 달러 이상 | FBI (2026.11.12) |
| 2025년 국내외 가상자산 탈취 | 2조 원 이상 | 국정원 2025 연례보고서 |

특징은 건수가 아니라 건당 규모다. 수익의 대부분이 소수의 대형 사건에서 나오고, 그 사건들은 스마트컨트랙트 버그가 아니라 키·서버·서명 절차와 그것을 다루는 사람을 겨냥했다. 여기에 위장 취업 IT 인력의 급여, 탈취 자산의 다단계 세탁이 더해져 하나의 사업 구조를 이룬다.

국내 거래소의 연속 사고는 이 맥락에서 읽어야 한다. 코인원·빗썸·플라이빗 사고의 귀속은 공개되지 않았다. 다만 핵심 시스템이 아니라 상담 외주와 그룹웨어가 뚫렸다는 사실은, 북한 조직이 해외에서 반복해 온 "주변에서 시작해 서명 권한으로 이동"하는 경로의 첫 단계가 국내에도 열려 있음을 뜻한다.

### 5.5 정치: 정책 결정 과정과 사람을 수집한다

김수키 계열의 목적은 금전이 아니라 정보다. 표적은 국회, 정당, 외교·안보 부처, 대북 정책 연구자, 기자, 탈북민 단체다. 이번 캠페인이 수집 대상으로 삼은 것도 문서와 이미지, 메신저 폴더 정보, 최근 파일 목록이었다. 수집 대상은 세 가지로 정리된다.

- **내용**: 정책 초안, 회의 자료, 미공개 평가
- **관계**: 누가 누구와 일하는지, 누구의 요청이면 열어보는지
- **다음 발판**: 탈취한 계정과 대화 맥락으로 더 높은 표적을 사칭

한 사람의 감염은 그 사람의 인맥 전체를 다음 공격의 재료로 만든다. 선거, 국정감사, 남북·북미 현안 같은 일정에 맞춰 미끼 주제가 바뀌지만 방식은 같다.

### 5.6 사회 인프라: 파괴보다 사전 침투

라자루스 측 표적 목록의 우선 산업은 정부, 금융, 통신, 핵심 인프라, 물류·항공, 제조였다. 국정원은 2026년 전망에서 주요 인프라를 겨냥한 다목적 공세를 위협으로 꼽았고, 2025년에는 방산·IT·보건 분야 기술 탈취가 확대됐다고 밝혔다. ESET은 11월 라자루스가 가짜 채용으로 유럽 드론 업계를 노린 활동을 보고했다. 위장 취업 IT 인력의 침투 범위도 방산·항공우주·에너지로 넓어졌다는 보고가 있다.

이번 조사 범위에서 2026년 국내 기반시설에 대한 파괴형 공격이 북한 소행으로 공개 귀속된 사례는 확인하지 못했다. 드러난 활동은 접근 권한 확보와 정찰 단계다. 다만 확보된 접근 권한은 금전 탈취, 첩보, 교란 가운데 어느 쪽으로든 쓸 수 있다. 협업 도구, 문서관리 솔루션, 그룹웨어, 상담 외주처럼 여러 기관이 함께 쓰는 서비스는 사실상 사회 인프라이며, 한 번의 침해가 다수 기관으로 번지는 지점이다.

### 5.7 요약: 여섯 가지 특징

| 특징 | 내용 | 이번 주 사례 |
| --- | --- | --- |
| 공급망을 발판으로 | 본체 대신 벤더, 런타임, 패키지, 외주를 먼저 친다 | PHP 런타임 표적화 |
| 정밀한 표적 선정 | 실제 일정·관계·직무에 근거해 사람을 고른다 | 세미나 실제 참석자 |
| 정상 서비스 악용 | 공개 메모장, 클라우드, 서명된 런타임 | aNotepad, Dropbox, MEGA, Node.js |
| 빠른 무기화와 AI 보조 | 패치 다음 날 표적 논의, AI로 PoC 선별 | PHP2Shell |
| 금전과 첩보의 이중 임무 | 같은 접근 권한을 두 목적에 쓴다 | 라자루스 표적 산업 구성 |
| 긴 준비, 짧은 실행 | 수개월 잠복 후 수십 분 내 실행 | 6월 C2 가동, 10월 신규 RAT 투입 |

---

## 6. 대응 (Response)

### 6.1 조직 대응 — 공급망

**제3자 스크립트와 쓰기 권한 관리**

- [ ] 운영 페이지가 불러오는 모든 제3자 스크립트 목록을 만든다. 결제·로그인·지갑 화면은 따로 표시한다.
- [ ] 각 벤더 콘솔에서 **누가 배포 코드를 고칠 수 있는지** 감사한다. 미사용 계정과 API 토큰을 정리하고 SSO와 MFA를 강제한다.
- [ ] 결제·인증·출금 화면에서는 A/B 테스트와 마케팅 스크립트를 뺀다. 필요하면 검토된 버전을 자체 호스팅한다.
- [ ] CSP를 적용한다. `script-src`와 `connect-src`를 좁히고, `'unsafe-eval'`과 `'strict-dynamic'`의 필요성을 재검토하며, 위반 보고를 수집한다.
- [ ] 결제 입력은 결제사의 교차 출처 iframe에 둔다. 세션 쿠키는 HttpOnly로 설정한다.
- [ ] 스크립트 변경 감시를 건다. 벤더가 내려주는 파일의 해시나 크기 변화, 새 외부 도메인 호출을 경보로 받는다.

**옵티마이즐리 도입 기업의 즉시 점검**

- [ ] Project JavaScript와 실험 코드에서 부록 A의 도메인, `atob(`, 낯선 동적 로더를 찾는다. 정리 전에 변조 스니펫과 로그를 보존한다.
- [ ] 11월 16일 해당 페이지에서 입력된 카드와 HttpOnly가 아닌 쿠키의 비밀값은 노출된 것으로 보고 교체한다.
- [ ] 노출 구간의 방문자와 임직원을 식별하고 개인정보·결제 사고 통지 의무를 법무와 검토한다.
- [ ] 관리 대상 Apple 기기를 최신 iOS로 올린다. 노출된 기기는 재부팅에 기대지 말고 조사한다.

**런타임과 패치**

- [ ] 실제 웹 요청을 처리하는 PHP 버전을 확인한다. CLI 바이너리 버전과 다를 수 있다.
- [ ] 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 이상으로 올리고 **모든 워커를 완전히 재시작**한다. reload로 남은 구 워커는 여전히 취약하다.
- [ ] 침해가 의심되는 호스트는 재시작 전에 휘발성 증거를 먼저 확보한다.
- [ ] 지원이 끝난 브랜치(8.1 이하)는 인터넷에서 분리하거나 이전한다.
- [ ] 10월 17일부터 로그를 소급 점검한다. 비정상 multipart POST, 업로드가 없는 엔드포인트의 upload-progress 필드, 워커 크래시, 새 `.php`·`.phtml`·`.phar` 파일, `.user.ini`·`.htaccess` 변경을 본다.
- [ ] 가장 강한 신호는 PHP나 웹 서버 프로세스가 셸이나 다운로드 도구를 실행하는 행위다. 침해가 확인되면 신뢰 이미지로 재구축하고 PHP 워커가 닿을 수 있던 비밀값을 모두 교체한다.

**수탁사와 SaaS**

- [ ] 상담 채널에서 주민등록번호, 비밀번호, 신분증 정보를 받지 않도록 절차와 화면을 바꾼다. 이미 쌓인 기록은 마스킹하거나 삭제한다.
- [ ] 수탁사에 넘기는 개인정보 항목과 보관 기간을 최소화하고 계약에 침해 통지 시한, 접근 통제, 점검 권한을 넣는다.
- [ ] 수탁사 한 곳이 여러 고객사를 맡는 구조라면 고객사 간 데이터 분리 방식을 확인한다.
- [ ] 협업 도구의 비밀번호 재설정 절차에 시도 횟수 제한, 지연, 알림이 있는지 확인한다. 관리자와 임원 계정은 피싱 저항형 MFA(FIDO2)를 쓴다.
- [ ] API 키를 주기적으로 교체하고 범위와 IP를 제한한다. 두레이 이용 기관은 재발급된 키로 연동을 다시 구성하고, 12~13일 API 호출 이력을 확인한다.
- [ ] 협업 도구에 저장된 비밀값(다른 시스템 계정, 토큰, 접속 정보)을 찾아 교체한다.

### 6.2 조직 대응 — 표적 공격

- [ ] 메일 게이트웨이와 단말에서 압축파일 속 `.lnk`, 이중 확장자(`.hwp.lnk`) 실행을 차단하거나 경보한다.
- [ ] 다음 행위를 탐지 규칙으로 만든다. 예약 작업 `CommonMaintenanceHost`, 공개 메모장 사이트로의 주기적 접속, `C:\Users\Public` 아래의 Node.js 폴더와 `teamview.js`, 승인되지 않은 MEGAcmd 설치, PowerShell의 `curl.exe` 호출.
- [ ] PowerShell 스크립트 블록 로깅을 켜고 초기 실행 로그를 보존한다.
- [ ] 외부 행사 참석자, 자문위원, 대외 발언이 잦은 임직원을 고위험군으로 지정해 별도 교육과 단말 보호를 적용한다.
- [ ] 사례비·원고료·자문료 요청은 메일 회신이 아니라 기관 대표번호나 기존 연락처로 재확인하는 절차를 둔다.
- [ ] 유출 사고 이후에는 "자사 임직원이 사칭된다"는 전제로 거래처와 고객에게 주의 공지를 낸다.

### 6.3 조직 대응 — 가상자산·개발 조직

- [ ] 서명 권한에 닿는 모든 경로(사람, 노트북, 세션, CI/CD, 사내 AI 도구)를 키와 같은 등급으로 관리한다.
- [ ] 서명 환경을 일반 업무망과 분리하고, 대액 이체에는 다자 승인, 시간 지연, 자동 차단 장치를 둔다.
- [ ] 의존성을 잠그고(lockfile, 해시 검증) 배포 계정에 FIDO2 기반 MFA를 요구한다.
- [ ] AI 코딩 도구의 설정 파일을 형상 관리와 무결성 점검 대상에 넣는다. 저장소를 여는 것만으로 명령이 실행되는 설정을 금지한다.
- [ ] 면접·화상회의 중 받은 코드와 "업데이트" 요청은 격리 환경에서만 실행한다.
- [ ] 원격 근무자의 신원, 기기 위치, 접속 IP의 불일치를 상시 점검한다.

### 6.4 개인 대응

**모든 이용자**

1. iPhone과 iPad를 iOS 18.7.3 이상 또는 26.3 이상으로 올린다. 페이지가 1분마다 저절로 새로고침되는 증상이 있었다면 기기 점검을 받는다.
2. 가상화폐를 보낼 때 붙여넣은 주소 전체를 원본과 대조한다. 앞뒤 몇 글자만 보지 않는다. 자주 쓰는 주소는 출금 화이트리스트에 등록한다.
3. 11월 16일 전후 해외 대형 사이트에서 카드를 직접 입력했다면 명세서를 확인하고, 의심 거래가 있으면 카드사에 재발급을 요청한다.
4. 여러 사이트에서 같은 비밀번호를 쓰지 않는다. 주요 계정에 MFA를 켠다.

**코인원 상담 이력이 있는 고객**

1. 코인원 비밀번호와, 같은 비밀번호를 쓴 다른 서비스의 비밀번호를 바꾼다. OTP를 재등록한다.
2. 상담 중 계좌 비밀번호를 남겼다면 은행에서 즉시 변경한다.
3. 명의도용 방지 서비스(엠세이퍼)에 가입해 신규 휴대폰 개통을 막고, 신용정보사의 명의 보호 서비스를 검토한다.
4. 신분증 발급일자가 유출 항목에 포함됐다면 신분증 재발급을 검토한다.
5. 코인원, 금융감독원, 수사기관을 자칭하며 "자산을 안전한 지갑으로 옮기라"거나 원격 제어 앱 설치를 요구하는 연락은 모두 사기로 본다. 내 지갑주소와 거래 내역을 정확히 말해도 마찬가지다.

**두레이 이용 기관의 임직원**

1. 비밀번호를 바꾸고 로그인 이력을 확인한다.
2. 동료, 임원, 거래처 명의의 송금·자료·인증 요청은 다른 채널로 확인한다. 유출된 업무 맥락을 인용하는 사칭이 올 수 있다.

**정책·연구·언론 종사자**

1. 실제 참석한 행사를 언급하는 메일이라도 발신 주소와 도메인을 확인한다.
2. 첨부가 빠진 메일에 회신한 뒤 받은 대용량 첨부 링크의 압축파일은 특히 조심한다. 문서 아이콘인데 바로가기(.lnk)이면 열지 않는다.
3. 사례비·자문료 서류는 의원실이나 기관 대표번호로 전화해 확인한다.
4. 업무 PC와 개인 PC를 분리하고, 메신저 데스크톱 앱에 민감 자료를 쌓아 두지 않는다.

### 6.5 신고 채널

| 상황 | 채널 |
| --- | --- |
| 침해사고, 해킹 의심 | 한국인터넷진흥원(KISA) 118 |
| 개인정보 유출 | 개인정보보호위원회, KISA 개인정보침해 신고센터 |
| 금융 피해, 사칭 | 금융감독원 1332, 거래 금융회사 지급정지 요청 |
| 사이버 범죄 | 경찰청 사이버범죄 신고시스템(ECRM), 112 |
| 국가배후 의심 | 국가정보원 111 |

---

## 7. 결론 및 시사점

1. **보안 경계는 계약서의 범위와 같아야 한다.** 스크립트 벤더, 런타임, 협업 도구, 수탁사에 준 권한을 자사 자산 목록에 올리고 같은 기준으로 감사해야 한다. 이번 주의 다섯 건 가운데 본체가 뚫린 사건은 없다.
2. **귀속은 신중하게, 방어는 귀속과 무관하게.** 다섯 건을 모두 북한으로 묶으면 분석이 틀리고, 북한 건만 따로 보면 대비가 늦는다. 미귀속 범죄 조직이 연 길을 국가배후 조직이 다시 쓰고, 그 반대도 일어난다.
3. **북한형 공격의 핵심은 조합이다.** 공급망으로 넓게 들어와 표적을 좁게 고른다. 방어도 두 층이어야 한다. 넓은 층은 의존성과 쓰기 권한의 통제, 좁은 층은 고위험 인원과 서명 권한의 보호다.
4. **유출은 사건의 끝이 아니라 다음 사건의 준비물이다.** 조직 정보와 신원 정보가 나간 직후 몇 주가 사칭 공격의 성공률이 가장 높은 구간이다.
5. **속도가 변수다.** 패치 다음 날 표적 논의가 시작되는 환경에서는 월 단위 패치 주기와 수동 대응이 통하지 않는다. 탐지와 초동 조치의 자동화가 필요하고, 최종 통제는 사람과 절차가 맡아야 한다. LLM은 엑셀이지 오라클이 아니다.

---

## 8. 원 요약본 대비 정정 사항

| 원 요약본 내용 | 원문 출처 기준 |
| --- | --- |
| 해커가 옵티마이즐리 "시스템에 침투"해 스크립트 삽입 | 계정 가입 절차 결함으로 표적 고객 계정 사용자를 가장해 고객 프로젝트 설정 필드에 코드를 삽입. CDN 자체는 침해되지 않음 |
| 178개 기업이 영향 | 점검한 1,611개 스니펫 중 188개, 178개 조직. 하한선이며 옵티마이즐리는 "고객의 5% 미만"이라고만 밝힘 |
| 악성코드에 Coruna·DarkSword가 "포함" | 스크립트는 iOS 기기를 익스플로잇 킷 도메인으로 연결. 악용 성공은 입증되지 않음 |
| "구형 iOS" 대상 | iOS 13~17은 Coruna, 18.x는 DarkSword. 18.7.3 이상과 26.3 이상은 패치됨 |
| 기능은 정보 탈취와 지갑 주소 교체 | 카드 스키머, 쿠키·화면 캡처 탈취가 추가로 있음 |
| 라자루스가 국내 서버 30곳을 "표적으로 삼아" 웹셸 배포 시도 | 표적 목록 등재는 확인. 30곳에 대한 실제 공격과 침해 성공 여부는 미확인. 581개 호스트는 공격자 주장 |
| 라자루스 귀속을 단정 | CYFIRMA 평가. 10월 22일 중간, 10월 29일 높음으로 상향 |
| PHP 코어 RCE (국내 보도는 Windows 환경으로 설명) | 공개 기술 분석은 Apache mod_php와 PHP-FPM 등 실행 방식 전반을 영향 범위로 본다. 점검을 Windows에 한정하면 안 됨 |
| 킴수키가 국회 세미나 참석자 대상 피싱으로 NodeLinkRAT 유포 | 지니언스 귀속 신뢰도는 중간. 캠페인은 6월부터이고 NodeLinkRAT 투입은 10월. 회신 유도 방식과 메모장 C2가 핵심. 실제 피해는 미공개 |
| NHN두레이에서 자료와 개인정보 유출 | 비밀번호 찾기 인증번호 반복 입력에 의한 계정 탈취와 오픈 API 키 유출, 두 경로. 피해 규모는 미공개 |
| 코인원 "외주업체 서버 해킹" | 수탁사는 메타엠. 유출 항목은 고객별로 다르며 계좌번호·신분증 발급일자·지갑주소·TXID 포함. 거래·지갑 시스템 직접 침입 정황은 없음 |
| 다섯 사건을 한 흐름으로 서술 | 북한 연계 평가는 라자루스·김수키 두 건. 옵티마이즐리, 두레이, 코인원은 공개 귀속 없음 |

---

## 부록 A. IOC (침해 지표)

공개 보고서에 실린 지표만 옮겼다. 도메인과 IP는 `[.]`로 무력화했다. 인프라는 빠르게 교체되므로 차단 전에 원출처의 최신 목록과 대조한다. 오래된 IP는 무관한 사업자가 재사용할 수 있다.

**A-1. 옵티마이즐리 (OPTIMJACK)** — 출처: Report URI

| 유형 | 지표 | 용도 |
| --- | --- | --- |
| 도메인 | `1688360[.]cc` | 주 C2. `track.js`, `card.php`, `hit.php`, `html2canvas.min.js` |
| 도메인 | `5vobauua3ojpklx[.]icu`, `eil786npto9u5bq[.]icu` | iOS 라우터 (`boot.js`) |
| 도메인 | `l7bcsnwc7nzr3uo[.]icu`, `je4ft3gn8vxudum[.]icu`, `q1ls1ho9x7wsxlu[.]icu`, `p55abnw2pnsz0bo[.]icu`, `1y69gy2mdzaltz1[.]icu`, `gm38duxoihbmy5o[.]icu`, `ios-hack[.]icu` | 공격자 인프라 |
| 도메인 | `webshell[.]lol`, `linkforge[.]cc` | 선행 공격 인젝터 (`get.js`) |
| 전역 변수 | `window._k7`, `window.__k7b` | 페이로드 표식 |
| 문자열 | `data-channel-code="02111110"`, `BIGNIAO` | 페이로드 속성·코드 |
| 탐지 힌트 | Project JavaScript 내 `atob(` | 난독화된 로더 |

**A-2. PHP2Shell 캠페인** — 출처: CYFIRMA

| 유형 | 지표 | 용도 |
| --- | --- | --- |
| IP / URL | `92[.]118[.]112[.]100`, `hxxp://92[.]118[.]112[.]100/nfs` | 2단계 로더 배포 (인자 `php`로 실행) |
| MD5 | `b61a098fc62a2c2696e196dca78da71a` | `nfs` 2단계 |
| User-Agent | `php2shell-scan/109618`, `Mozilla/5.0 (php2shell-poc)` | 스캐너·PoC |
| 응답 문자열 | `JACKALPOC` | 코드 실행 확인용 카나리 |
| 소스 IP | 권고 V1~V4의 전체 목록 | 원출처에서 최신본 확인 |

스캔 노드 21개는 이미 감염된 제3자 서버일 수 있다. 차단은 하되 귀속 근거로 쓰지 않는다.

**A-3. NodeLinkRAT 캠페인** — 출처: Genians (SecurityOnline 정리)

| 유형 | 지표 | 용도 |
| --- | --- | --- |
| IP | `103[.]81[.]116[.]10` | XenoRAT C2 |
| IP:포트 | `207[.]148[.]112[.]166:3000` | NodeLinkRAT C2 (Socket.IO) |
| 도메인 | `epaper[.]dothome[.]co[.]kr` | 2단계 스크립트 |
| 도메인 | `oppsite[.]dothome[.]co[.]kr` | 문서 유출 수신 |
| 도메인 | `nid[.]weffm[.]p-e[.]kr` | 네이버 로그인 위장 |
| 저장소 | `github[.]com/norrisk983/hukushima` | LNK 아이콘 경로 |
| 표식 | `887wgJs8`, `nfJgcBI` | 메모 내 Base64 구간 구분자 |
| GUID | `200b1ad6-f1ff-49de-aa9c-b07d2615cdec` | XenoRAT 프로젝트 |
| 파일 | `*.hwp.lnk`, `UPA.ps1`, `j1u3ulqPQeRHnA.Jcu`, `teamview.js`, `unins000.dat` | 로더·임플란트·표식 |
| 예약 작업 | `CommonMaintenanceHost` (38분 주기) | 지속성 |
| 경로 | `C:\Users\Public\` 아래 Node.js 폴더, `%LOCALAPPDATA%\MEGAcmd` | 설치 흔적 |

유출에 쓰인 Dropbox 계정 주소는 원출처에서 확인한다. Node.js 설치 폴더명은 2차 정리본 안에서 표기가 엇갈린다(`Musicjs`와 `Music`). 지니언스 원문으로 확인한 뒤 규칙에 반영한다. `anotepad.com`은 정상 서비스이므로 도메인 차단보다 주기적 접속 행위를 탐지 대상으로 삼는다.

**A-4. NHN두레이, 코인원**

공개된 기술 지표가 없다. 각 사의 개별 통지와 KISA 공지를 기준으로 한다.

## 부록 B. 용어 정리

| 용어 | 설명 |
| --- | --- |
| 공급망 공격 | 표적이 신뢰하는 제3자(벤더, 패키지, 외주)를 먼저 침해해 표적에 도달하는 공격 |
| 스니펫 | 웹사이트에 삽입해 외부 서비스의 코드를 불러오는 짧은 자바스크립트 |
| 클리퍼 | 복사한 지갑 주소를 공격자 주소로 바꿔치기하는 악성코드 |
| 스키머 | 결제 화면에서 카드 정보를 가로채는 스크립트 |
| 익스플로잇 킷 | 여러 취약점을 묶어 방문만으로 기기를 장악하도록 만든 도구 |
| CSP | 페이지가 불러오고 접속할 수 있는 출처를 제한하는 브라우저 보안 정책 |
| 웹셸 | 웹 서버에 심어 원격 명령을 실행하는 스크립트 |
| N-day | 패치가 공개됐지만 아직 적용되지 않은 취약점 |
| 스피어 피싱 | 특정 인물에 맞춰 만든 표적형 피싱 |
| 데드 드롭 | 공개 서비스의 게시물에 명령을 올려 두고 감염 단말이 가져가게 하는 C2 방식 |
| RAT | 감염 단말을 원격 조종하는 악성코드 |
| 수탁사 | 개인정보 처리 업무를 위탁받은 외부 업체 |
| TXID | 블록체인 거래 식별번호 |

## 부록 C. 참고 출처

### 옵티마이즐리

- Report URI, *World's Largest Brands Infected With Malware Via Optimizely* — https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/
- StepSecurity, *OPTIMJACK* — https://www.stepsecurity.io/blog/optimjack-optimizely-hosted-scripts-crypto-clipper-card-skimmer
- Deepwatch, *CA-26-048: OPTIMJACK* — https://www.deepwatch.com/labs/ca-26-048-optimjack-optimizely-web-experimentation-supply-chain-attack/
- BleepingComputer — https://www.bleepingcomputer.com/news/security/optimizely-supply-chain-attack-delivers-malware-to-cnn-fox-news-bbc-salesforce-sites/
- Security Today, 옵티마이즐리 11월 18일 공지 — https://securitytoday.com/articles/2026/11/18/optimizely-patches-signup-flaw-after-attackers-inject-malicious-code.aspx
- CMSWire, 상태 페이지 경과 — https://www.cmswire.com/digital-experience/optimizely-works-through-web-experimentation-security-incident/
- Straiker, Coruna·DarkSword 연결 분석 — https://www.straiker.ai/blog/optimizely-attack-coruna-darksword-ios-exploits
- Packetlabs, 선행 공격과 노출 시간 — https://www.packetlabs.net/posts/optimizely-supply-chain-attack
- Upwind — https://www.upwind.io/blog/the-optimizely-attack-when-a-trusted-vendor-can-write-to-your-website

### 라자루스 · PHP2Shell

- CYFIRMA, *Suspected DPRK Campaign staging PHP2Shell* (V1~V4) — https://www.cyfirma.com/research/cyfirma-threat-advisory-suspected-dprk-campaign-staging-php2shell-targeting-against-global-php-infrastructure/
- CYFIRMA, *PHP2Shell Vulnerability Under Active Exploitation* — https://www.cyfirma.com/blogs/php2shell-vulnerability-under-active-exploitation-are-you-affected-and-what-should-you-do-today/
- Datadog Security Labs, 수정 버전 — https://securitylabs.datadoghq.com/articles/php2shell-critical-vulnerabilities-in-php/
- Sansec — https://sansec.io/research/php2shell
- BankInfoSecurity, CISA 경고 — https://www.bankinfosecurity.com/php2shell-actively-exploited-us-cybersecurity-agency-warns-a-33219
- 연합뉴스(네이트) — https://m.news.nate.com/view/20261115n01924
- 세계일보 — https://www.segye.com/newsView/20261115501757
- 서울경제, 침해 여부 미확인 — https://m.sedaily.com/article/20114478
- Aviatrix, 유럽 정부 기관 침해 분석 — https://aviatrix.ai/threat-research-center/php2shell-exploitation-government-cve-2026-109618-lazarus-ai-assisted-hacking/

### 김수키 · NodeLinkRAT

- SecurityOnline (Genians 보고서 정리) — https://securityonline.info/kimsuky-nodelinkrat-malware-spearphishing
- 서울경제 — https://m.sedaily.com/article/20114701
- VOA 한국어 — https://www.voakorea.com/a/korea-kimsuky-hacking/8224252.html
- 아주경제 — https://www.ajunews.com/view/20261116102157622
- Korea JoongAng Daily — https://www.koreajoongangdaily.com/korea/north-korealinked-hackers-suspected-of-targeting-national-assembly-seminar-attendee/12974662

### NHN두레이

- 보안뉴스, API 서비스 차단 — https://www.boannews.com/news/articleView.html?idxno=147258
- 보안뉴스, 유출 확인 — https://www.boannews.com/news/articleView.html?idxno=147282
- 펜앤마이크 — https://www.pennmike.com/news/articleView.html?idxno=131956
- 글로벌이코노믹 — https://www.g-enews.com/article/ICT/2026/11/2026111319410653883d7a510102_1

### 코인원 · 가상자산 업계

- 한국경제 — https://www.hankyung.com/article/2026111570777
- 알파경제(Investing.com) — https://kr.investing.com/news/stock-market-news/article-2176274
- 딜사이트 — https://dealsite.co.kr/articles/172859
- 디지털투데이 — https://www.digitaltoday.co.kr/news/articleView.html?idxno=715823
- 이투데이, 2차 사칭 위험 — https://www.etoday.co.kr/news/view/2648599
- 알파경제, 금융권 침해사고 집계 — https://www.alphabiz.co.kr/news/articleView.html?idxno=196954

### 북한 위협 동향

- FBI FLASH AC-111226-MS (2026-11-12) — https://www.ic3.gov/CSA/2026/261112.pdf
- TRM Labs — https://www.trmlabs.com/resources/blog/north-korea-has-stolen-usd-128-billion-in-crypto-usd-74-billion-of-it-in-2026
- 데이터넷, 북한 공격 동향 종합 — https://www.datanet.co.kr/news/articleView.html?idxno=300260
- 전자신문 — https://www.etnews.com/20261102000370
- 한국일보, 바이낸스 초기 조사 보고서 — https://www.hankookilbo.com/news/article/A2026110408480003526
- 한국경제, 국정원 2025 연례보고서 — https://www.hankyung.com/article/2026051062717
- 보안뉴스, 국정원 2026 전망 — https://m.boannews.com/html/detail.html?tab_type=1&idx=141394
- VOA 한국어, 북한 사이버 위협 모음 — https://www.voakorea.com/z/8426
- BitOK 집계 보도 — https://bitcoinfoundation.org/news/security/north-korean-hackers-stole-7-61-billion-in-crypto-in-2026-without-breaking-code/

---

*본 리포트는 2026년 11월 20일 기준 공개 정보를 바탕으로 작성되었으며, 조사가 진행 중인 사안이므로 이후 사실관계가 변경될 수 있다. 교육·방어·연구 목적의 자료이며 투자 또는 법률 자문이 아니다.*

**© 2026 Dennis Kim (김호광)** · [github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
