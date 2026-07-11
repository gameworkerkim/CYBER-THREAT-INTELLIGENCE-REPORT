| id             | CTI-2026-0704-SCATTEREDSPIDER                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------- |
| title          | Scattered Spider — 10대 용의자 Peter Stokes 핀란드→미국 송환과 $800만 크립토 랜섬 기소                                    |
| subtitle       | 헬프데스크 사회공학, MFA 리셋 탈취, DragonForce 랜섬웨어, 그리고 다국적 공조 검거 흐름                                            |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                      |
| email          | <gameworker@gmail.com>                                                                              |
| github         | gameworkerkim                                                                                       |
| date           | 2026-07-04                                                                                          |
| classification | TLP:GREEN                                                                                           |
| severity       | HIGH                                                                                                |
| lang           | ko                                                                                                  |
| tags           | Scattered-Spider · Social-Engineering · Help-Desk-Vishing · MFA-Reset · Crypto-Extortion · Extradition · Law-Enforcement |
| threat_actors  | Scattered Spider (aka UNC3944 · Octo Tempest · 0ktapus · Scatter Swine · Muddled Libra)             |
| cve            | N/A (위협 행위자 캠페인 · 사회공학·헬프데스크 침해)                                                                    |
| frameworks     | MITRE ATT&CK · NIST SP 800-61 · STIX/TAXII · Mandiant/Microsoft 클러스터 네이밍                            |
| license        | CC BY-NC-SA 4.0                                                                                     |

# Scattered Spider — 10대 용의자 Peter Stokes 핀란드→미국 송환과 $800만 크립토 랜섬 기소

> **리포트 ID** `CTI-2026-0704-SCATTEREDSPIDER` · **발행일** 2026-07-04 · **분류** `TLP:GREEN` · **심각도** 🔴 HIGH
> **저자** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*헬프데스크 사회공학, MFA 리셋 탈취, DragonForce 랜섬웨어, 그리고 다국적 공조 검거 흐름*

---

## 목차

1. 요약 (TL;DR)
2. 용의자 프로파일 — Peter Stokes
3. 기소 내용 — 범죄 기록과 혐의 구조
4. Scattered Spider 조직 프로파일
5. 공격 체인 — 헬프데스크에서 크립토 랜섬까지
6. 형사 절차 타임라인과 앞으로의 과정
7. 공범·연계 피의자 현황
8. 한국 관점 — 거래소·기업 헬프데스크 위협 평가
9. 탐지·완화 권고
10. 결론
11. 참고 문헌

---

## 요약 (TL;DR)

2026년 7월 초, 미국 법무부(DOJ)는 사이버 범죄 집단 **Scattered Spider** 소속으로 지목된 19세 **Peter Stokes**를 핀란드에서 미국으로 송환해 시카고 연방법원(일리노이 북부지구)에 기소했다고 발표했다.

Stokes는 미국·에스토니아 이중국적자로, 온라인 핸들 **"Bouquet"·"Spencer"·"Jordan"** 을 사용한 것으로 알려졌다. 그는 2026년 4월 10일 헬싱키 공항에서 일본행 항공편 탑승을 시도하던 중 인터폴 적색수배(Red Notice)에 따라 핀란드 경찰에 체포되었고, 6월 마지막 주 미국으로 인도되어 화요일 시카고 연방법원에 최초 출석했다. 판사는 재판 전까지 신병 구금을 명령했다.

기소의 핵심은 **2025년 5월경 미상의 "명품 주얼리 소매업체"(법정 문서상 Company F) 침해**다. 공격자들은 헬프데스크에 직원을 사칭해 전화를 걸어 다중인증(MFA) 자격증명 리셋을 요청·탈취한 뒤 데이터를 훔치고 **약 800만 달러 규모의 암호화폐 랜섬**을 요구했다. 해당 기업은 지불을 거부했으나, 업무 중단·조사·복구 비용으로 최소 200만 달러의 손실을 입었다.

DOJ는 Scattered Spider가 **100건 이상의 네트워크 침해**에 관여해 **총 1억 달러 이상의 랜섬**을 발생시킨 것으로 추산한다. 이번 검거는 FBI의 장기 작전 **Operation Riptide**의 일환이며, 다국적 공조 수사가 강화되고 있음을 보여주는 사례다.

### Key Judgments

| #    | 판단                                                                                                          | 신뢰도             |
| ---- | ----------------------------------------------------------------------------------------------------------- | --------------- |
| KJ-1 | Stokes 기소는 개별 사건이 아니라 Scattered Spider 네트워크 해체를 위한 **다국적 공조(미·영·핀란드·인터폴)** 흐름의 일부다. 미수에 그친 이번 랜섬에도 불구하고 기소가 성립했다. | **High**        |
| KJ-2 | 이 그룹의 핵심 무기는 멀웨어 취약점 익스플로잇이 아니라 **헬프데스크 대상 사회공학·MFA 리셋 탈취**다. 기술 방어보다 프로세스·인적 방어가 급소다.                       | **High**        |
| KJ-3 | 랜섬 미지불이 확산되고 있다. Company F의 거부는 TRM Labs가 보고한 "피해자의 지불 거부 증가" 추세와 일치하며, 2024년 대비 랜섬 관련 총 크립토 유입이 감소했다.        | **Medium-High** |
| KJ-4 | Stokes는 만 16세로 추정되는 시점(2023년 3월)부터 최소 4건의 침해에 관여했다. 이는 그룹이 **10대 중반을 게이밍·사이버범죄 커뮤니티에서 모집**하는 구조임을 보여준다.       | **High**        |
| KJ-5 | 향후 절차는 유죄인부 협상(plea) 가능성이 높다. 앞서 검거된 다수 공범(Urban, Buchanan 등)이 유죄를 인정한 전례가 있어, **협조·감형 협상 경로**가 유력하다.        | **Medium**      |

---

## 1. 용의자 프로파일 — Peter Stokes

| 항목      | 값                                             |
| ------- | --------------------------------------------- |
| 성명      | Peter Stokes                                  |
| 연령      | 19세                                           |
| 국적      | 미국·에스토니아 이중국적                                 |
| 온라인 핸들  | "Bouquet", "Spencer", "Jordan"                |
| 소속(혐의)  | Scattered Spider                              |
| 체포      | 2026-04-10, 헬싱키 반타 공항 (일본행 탑승 시도 중)           |
| 체포 근거   | 인터폴 적색수배 (Red Notice)                         |
| 송환      | 2026년 6월 마지막 주, 핀란드 → 미국                       |
| 관할      | 미 일리노이 북부지구 연방법원 (시카고)                         |
| 신병      | 재판 전 구금 (구속)                                   |
| 압수물     | 체포 당시 소지 하드디스크에서 약 2TB 상당 데이터 압수              |

Stokes는 스냅챗 등 SNS에 또래 대비 과도한 부(富)와 국제 여행을 과시하고, 이미 검거된 다른 Scattered Spider 조직원 관련 미디어를 공유한 정황이 확인됐다. 수사 기록에는 그가 2025년 3월 드라마 "소프라노스"의 마피아 캐릭터에 조직원 별칭을 붙여 공유한 이미지가 포함되어 있으며, 여기에는 본인으로 추정되는 "Peter"를 포함해 "auth", "domr", "guts" 등 복수의 공범 추정 핸들이 등장한다.

---

## 2. 기소 내용 — 범죄 기록과 혐의 구조

미국 검찰은 봉인 해제된 **6개 항목(six-count)의 상위 형사고발장(superseding criminal complaint)** 으로 Stokes를 기소했다. 혐의 범주는 다음과 같다.

| 혐의 범주                     | 내용                                            |
| ------------------------- | --------------------------------------------- |
| 공모 (Conspiracy)           | Scattered Spider 조직 활동 공모                      |
| 컴퓨터 사기·침입 (Cyber intrusion / Computer fraud) | 무단 네트워크 접근                            |
| 통신 사기 (Wire fraud)         | 전자적 수단을 통한 사기                                  |
| 강요·갈취 (Extortion)         | 랜섬 요구                                          |
| 랜섬웨어 갈취                    | $800만 크립토 랜섬 시도 (Company F)                    |

### 확인된 범죄 기록(혐의 사실)

- **최소 4건의 Scattered Spider 침해**에 가담한 것으로 지목됨.
- 가장 이른 침해는 **2023년 3월, 만 16세 추정 시점** — "온라인 커뮤니케이션 플랫폼"(법정 문서상 **Company H**) 무단 접근.
- **2025년 5월 12일경, 명품 주얼리 소매업체(Company F) 침해** — 기소의 중심 사건.
  - 공격자들은 Company F 직원을 사칭해 헬프데스크에 인증정보(비밀번호·MFA용 모바일 기기) 리셋을 요청.
  - Google Voice 번호로 헬프데스크에 전화.
  - 이후 합법 인터넷 터널링 도구 **ngrok** 을 사용해 기업 데이터센터에 지속적 무단 접근 유지.
  - 데이터 탈취 후 **약 800만 달러 상당 암호화폐 랜섬** 요구.
  - 수사관은 ngrok 사용 흔적을 VPN 프록시 IP → Stokes가 사용한 Microsoft 기기로 연결.

### 피해 규모

- Company F는 **랜섬을 지불하지 않았고**, 보안팀이 침입자를 축출.
- 다만 업무 중단·조사·완화 비용으로 **최소 200만 달러 손실**.
- Scattered Spider 전체로는 **100건+ 침해, 1억 달러+ 랜섬**(DOJ 추산).

---

## 3. Scattered Spider 조직 프로파일

| 항목       | 값                                                          |
| -------- | ---------------------------------------------------------- |
| 명칭       | Scattered Spider                                           |
| 이명(추적명)  | UNC3944 · Octo Tempest · 0ktapus · Scatter Swine · Muddled Libra |
| 등장 시점    | 2022년                                                      |
| 구성       | 미국·영국·캐나다·유럽 출신 영어권 10대·청년의 느슨한 집합체         |
| 모집 경로    | 온라인 게이밍 커뮤니티·사이버범죄 포럼 (주로 10대 중반)                          |
| 동기       | 금전 (크립토 갈취)                                                |
| 핵심 기법    | 사회공학, 헬프데스크 비싱(vishing), MFA 피로 공격(MFA bombing), SMS 피싱, SIM 스와핑 |
| 부가 도구    | Genymobile Android 에뮬레이터(MFA 공격), DragonForce 랜섬웨어 인크립터    |
| 대표 피해자   | Caesars, MGM Resorts, Riot Games, DoorDash, Reddit, MailChimp, Twilio, LastPass, Allianz Life, TfL, Co-op, M&S, Harrods, WestJet, Jaguar Land Rover |

Scattered Spider의 특징은 **소프트웨어 취약점을 먼저 노리지 않는다는 점**이다. 이들은 "사람을 속이는" 데 능하며, IT 헬프데스크에 전화해 직원을 사칭하고 비밀번호·2FA를 리셋한 뒤 네트워크에 진입한다. 이후 별도의 랜섬웨어 조직과 손잡아 시스템을 잠그고 크립토 지불을 요구하는 구조다. FBI·Microsoft·Google Cloud 등이 이 그룹을 최상위 사이버범죄 위협으로 지목해 왔다.

---

## 4. 공격 체인 — 헬프데스크에서 크립토 랜섬까지

| 단계    | 행위                        | 세부 (Company F 사례)                                       |
| ----- | ------------------------- | ------------------------------------------------------- |
| ① 정찰  | 표적 기업 직원 정보 수집            | 소셜미디어·유출 데이터 기반 사칭 시나리오 준비                              |
| ② 접근  | 헬프데스크 비싱                  | Google Voice 번호로 헬프데스크에 전화, 직원 사칭                       |
| ③ 탈취  | MFA·비밀번호 리셋 유도            | "인증정보(비밀번호·MFA 모바일 기기) 리셋 요청" → 관리자 접근권 획득             |
| ④ 지속  | 터널링 도구로 상시 접근 유지          | 합법 도구 **ngrok** 사용 → 데이터센터에 지속적 무단 접근                   |
| ⑤ 절취  | 기업 데이터 탈취                 | 기밀 사업 데이터 확보 (일부 사례에서 시스템 암호화)                          |
| ⑥ 갈취  | 크립토 랜섬 요구                 | 데이터 잠금·유출 위협 → 약 $800만 암호화폐 지불 요구 → **피해 기업 거부**       |

이 체인의 급소는 ②~③단계다. Scattered Spider는 방화벽·EDR 같은 기술 방어를 우회하는 대신, **헬프데스크라는 인적·프로세스 취약점**을 직접 공략한다. MFA조차 "리셋"이라는 정상 운영 절차를 통해 무력화된다.

---

## 5. 형사 절차 타임라인과 앞으로의 과정

### 지금까지의 타임라인

| 시점            | 사건                                                   |
| ------------- | ---------------------------------------------------- |
| 2023-03       | Company H(온라인 커뮤니케이션 플랫폼) 침해 — Stokes 만 16세 추정        |
| 2025-05-12경   | Company F(명품 주얼리 소매업체) 침해, $800만 크립토 랜섬 요구 → 거부       |
| 2026-04-10    | 헬싱키 공항에서 인터폴 적색수배로 체포 (일본행 시도 중)                     |
| 2026-06 말경    | 핀란드 → 미국 송환                                          |
| 2026-07-01경   | DOJ 공식 발표, 시카고 연방법원 최초 출석, 재판 전 구금 명령 (봉인 해제된 6개 항목) |

### 앞으로 예상되는 절차 (미국 연방 형사 절차 일반)

1. **최초 출석·구금 심리 완료** — 이미 진행됨. 판사가 재판 전 구금 명령. 추후 보석 재심 신청 가능하나 도주 우려(외국 도피 시도 이력)로 인용 가능성 낮음.
2. **대배심 정식 기소(Indictment)** — 현재는 형사고발장(complaint) 단계. 검찰이 대배심을 통해 정식 기소장(indictment)을 제출하는 절차로 이행.
3. **기소인부 절차(Arraignment)** — 정식 기소 후 유·무죄 답변. 이 시점에 변호인 선임·증거개시(discovery) 일정 확정.
4. **증거개시·프리트라이얼 모션** — 2TB 압수 데이터, ngrok·VPN·Microsoft 기기 포렌식, SNS·메신저 기록 등 디지털 증거 공방. 위법 수집·증거능력 다툼 예상.
5. **유죄인부 협상(Plea bargaining) 가능성** — 앞서 검거된 공범 다수(아래 §6)가 유죄를 인정하고 협조·감형을 택한 전례가 있어, 협상 경로가 현실적 시나리오.
6. **재판(Trial) 또는 유죄 인정(Guilty plea)** → **양형(Sentencing)** — 공모·통신사기·컴퓨터 사기·갈취는 각 항목별로 중한 법정형이 규정되어 있어, 누적 시 장기 실형 가능성.
7. **자산 몰수·피해 배상(Restitution)** — 크립토 자산 추적·동결 및 피해 기업(최소 $200만 손실) 배상 명령 가능.

> ⚠️ **주의**: 위 절차는 미국 연방 형사절차의 일반적 흐름을 정리한 것이며, 개별 사건의 실제 진행은 검찰 재량·변호 전략·증거 상황에 따라 달라진다. 현재 Stokes는 **무죄 추정 원칙**의 적용을 받는 피의자(용의자)이며, 위 혐의는 아직 유죄가 확정되지 않은 검찰 주장이다.

---

## 6. 공범·연계 피의자 현황

Scattered Spider에 대한 다국적 사법 처리는 계속되고 있으며, Stokes 검거는 그 최신 사례다.

| 인물                     | 국적/지위        | 상태                                                      |
| ---------------------- | ------------ | ------------------------------------------------------- |
| Noah Michael Urban     | 미국, 20세      | 2025년 캘리포니아·플로리다에서 공모·통신사기·신원도용 유죄 인정, 10년 형 선고 (2022–2023년 최소 $80만 크립토 절취 시인) |
| Tyler Robert Buchanan  | 스코틀랜드, 24세   | 2024년 스페인서 체포·미국 송환, 2026년 4월 통신사기·가중신원도용 유죄 인정         |
| Thalha Jubair          | 영국, 19–20세   | 2025년 11월 영국 서더크 형사법원, 컴퓨터오용법 위반 관련 (TfL 공격 연루) — 이후 유죄 인정 보도 |
| Owen Flowers           | 영국, 18세      | 2025년 11월 서더크 형사법원 관련 절차 (TfL 공격 연루)                     |
| 미성년 용의자 (라스베이거스)       | 미국          | 2024년 9월 카지노 공격 관련 체포                                    |
| 2024년 기소 5인            | 미·텍사스/플로리다/노스캐롤라이나 | 최소 $2,700만 크립토 랜섬 관련 기소 (Urban 포함)                    |

이처럼 Scattered Spider는 **개별 검거·기소가 누적되며 네트워크 전체가 해체 압박**을 받고 있다. Stokes 고발장에 등장하는 "auth"(미국 기반, 미성년 시 범행 추정 공범 A) 등 별칭들은 추가 기소로 이어질 수 있다.

---

## 7. 한국 관점 — 거래소·기업 헬프데스크 위협 평가

국내 환경에서 Scattered Spider류 위협이 갖는 함의는 다음과 같다.

- **헬프데스크가 급소** — 국내 거래소·핀테크·대기업은 콜센터·헬프데스크 아웃소싱 비중이 높다. "직원 사칭 → 비밀번호·MFA 리셋" 시나리오는 언어 장벽이 낮아지는 순간(내부자 정보·유출 데이터 결합) 그대로 재현 가능하다.
- **MFA 신뢰의 함정** — MFA를 도입했다는 사실만으로 안심하는 관행이 위험하다. 이 그룹은 취약점이 아니라 **MFA 리셋이라는 정상 절차**를 악용한다.
- **크립토 랜섬 지불 압박** — 국내 기업은 평판·규제(개인정보보호법·전자금융거래법) 리스크로 지불 유혹이 크다. 그러나 Company F 사례처럼 **미지불이 국제적 표준으로 자리잡는 추세**이며, 지불은 추가 표적화를 부른다.
- **다국적 공조의 시사점** — 인터폴 적색수배·핀란드 체포·미국 송환의 흐름은, 국내 피해 발생 시에도 **KoFIU·경찰청 사이버수사대·인터폴 채널을 통한 국제 공조**가 실효적 대응 경로임을 보여준다.

---

## 8. 탐지·완화 권고

1. **헬프데스크 검증 강화** — 비밀번호·MFA 리셋 요청 시 콜백·다중 신원확인·관리자 승인 절차를 의무화한다. "긴급 리셋 요청"을 고위험 이벤트로 분류한다.
2. **MFA 리셋 이벤트 모니터링** — 짧은 시간 내 다수 계정 MFA 재등록, 신규 기기 등록, 비정상 시간대 리셋을 SIEM에서 경보 처리한다.
3. **터널링 도구 탐지** — 기업망 내 **ngrok** 등 합법 터널링 도구의 비인가 실행·아웃바운드 연결을 차단·경보한다.
4. **비싱 인식 교육** — Google Voice 등 임시 번호에서 걸려오는 IT/리크루터 사칭 통화 패턴을 직원·헬프데스크 대상으로 정기 교육한다.
5. **최소권한·세분화** — 헬프데스크 계정과 관리자 계정을 분리하고, 리셋 권한을 최소화한다. 침해 시 측면 이동을 제한한다.
6. **랜섬 대응 정책 사전 수립** — 지불 거부를 기본 원칙으로 하되, 백업·복구·법률·공조(경찰·KoFIU) 연락 체계를 사전에 문서화한다.
7. **IOC·TTP 공유** — Scattered Spider의 MFA 피로·SIM 스와핑·헬프데스크 비싱 TTP를 위협 인텔리전스 피드로 지속 갱신한다.

---

## 9. 결론

Peter Stokes 사건은 "10대·크립토·사회공학"이라는 2026년 사이버 범죄 지형의 교집합을 그대로 보여준다. 이 사건이 주는 함의는 세 가지다.

첫째, **방어의 급소는 기술이 아니라 프로세스**다. 이 그룹은 제로데이가 아니라 헬프데스크 전화 한 통과 MFA 리셋으로 조직에 진입한다. 방어자는 "무엇을 패치할 것인가"보다 *"누가, 어떤 절차로, 무엇을 리셋할 수 있는가"* 를 통제해야 한다.

둘째, **랜섬 미지불이 이기는 전략**으로 굳어지고 있다. Company F는 800만 달러를 거부했고, 200만 달러의 복구 비용을 감수했다. 이는 지불보다 저렴할 뿐 아니라, 추가 표적화를 끊는 선택이다.

셋째, **국경은 더 이상 은신처가 아니다**. 헬싱키 공항 체포부터 미국 송환까지, 인터폴·핀란드·미국의 공조는 크립토 사이버 범죄에 대한 국제 사법 협력이 실효 단계에 진입했음을 보여준다. 동시에, 무죄 추정 원칙 아래 Stokes의 혐의는 아직 재판을 통해 다투어질 검찰 주장임을 잊어서는 안 된다.

---

## 참고 문헌 (References)

[1] U.S. Attorney's Office, Northern District of Illinois / DOJ Criminal Division, "Alleged Member of Criminal Cyber Hacking Group 'Scattered Spider' Arrested in Finland and Extradited to United States", 2026-07-01.

[2] Sergiu Gatlan, "Alleged Scattered Spider hacker extradited to the United States", BleepingComputer, 2026-07. <https://www.bleepingcomputer.com/news/security/alleged-scattered-spider-hacker-extradited-to-the-united-states/>

[3] "Scattered Spider Suspect Extradited to US Over $8M Crypto Ransom Demand", Decrypt, 2026-07. <https://decrypt.co/372665/scattered-spider-suspect-extradited-to-us-over-8m-crypto-ransom-demand>

[4] Mathew J. Schwartz, "Scattered Spider Suspect Extradited From Finland to US", BankInfoSecurity, 2026-07. <https://www.bankinfosecurity.com/scattered-spider-suspect-extradited-from-finland-to-us-a-32140>

[5] "Teen suspect in Scattered Spider hacks is extradited to US", The Record (Recorded Future News), 2026-07. <https://therecord.media/teen-suspect-in-scattered-spider-hacks-extradited-to-us>

[6] Pierluigi Paganini, "Alleged Scattered Spider Hacker Extradited to U.S. to Face Cybercrime Charges", Security Affairs, 2026-07. <https://securityaffairs.com/194613/security/alleged-scattered-spider-hacker-extradited-to-u-s-to-face-cybercrime-charges.html>

[7] "Peter Stokes extradited to US over $8M crypto ransom scheme tied to Scattered Spider", Crypto Briefing, 2026-07. <https://cryptobriefing.com/peter-stokes-extradited-scattered-spider-crypto-ransom/>

[8] TRM Labs, "2025 Ransomware Trends" (Decrypt 인용) — 2025년 랜섬웨어 크립토 갈취 약 $8.5억, 랜섬 관련 총 유입 2024년 $19억 → $13억 감소.

---

© 2026 Dennis Kim (김호광) · 본 문서는 독립 CTI 아카이브(TLP:GREEN) 공개를 목적으로 작성됐다.
문의: <gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)

> **면책**: 본 리포트에 기재된 혐의 사실은 미국 검찰의 형사고발장·언론 보도에 근거한 것이며, Peter Stokes는 유죄가 확정되지 않은 상태에서 무죄 추정 원칙의 적용을 받는다. 본 문서는 위협 인텔리전스·방어 목적의 정리이며 법률 자문이 아니다.
