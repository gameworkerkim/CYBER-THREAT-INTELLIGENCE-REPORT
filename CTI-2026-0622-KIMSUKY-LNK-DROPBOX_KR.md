# CTI-2026-0622 | 김수키(Kimsuky) LNK 기반 Dropbox C2 정보탈취 캠페인 분석

**TLP:CLEAR** | 분류: APT / 북한 연계 위협 | 작성일: 2026-06-22 | 언어: KO

---

## 0. Executive Summary

북한 정찰총국 연계로 추정되는 위협 그룹 김수키(Kimsuky / APT43,중국산 악성 코드 덧붙이기로 유명)가 2026년 상반기 한국 기업 실무 담당자를 표적으로 한 정교한 스피어 피싱 캠페인을 운용 중이다. 핵심 미끼는 "개인정보 유출 의심 확인 요청"이라는 민감 소재이며, 악성 LNK 파일(`2603vvip고객현황.lnk`)을 통해 다단계 페이로드를 실행한다. 본 캠페인은 ① 정상 클라우드 서비스(**Dropbox**)를 C2 채널로 악용하고, ② Windows 기본 도구(LOLBin)와 스크립트 기반 실행으로 탐지를 회피하며, ③ 자체 악성코드 의존도를 낮추는 김수키의 최신 전술 변화를 그대로 반영한다.

> **분석 철학 주석:** 본 리포트의 정적/동적 분석 결과(IOC, 실행 흐름)는 단일 샘플 1건과 공개 분석 보고서에 근거한 **재구성**이다. 행위자 귀속(attribution)과 인프라 연계는 패턴 일치에 기반한 **추론**이며, 확정 사실과 분리하여 명시했다.

---

## 1. Key Judgments (핵심 판단)

> Admiralty Code: 출처 신뢰도(A–F) + 정보 신뢰도(1–6)

| # | 판단 | 신뢰도 |
|---|------|--------|
| KJ-1 | `2603vvip고객현황.lnk`는 단일 LNK 내부에 미끼 XLSX와 암호화 페이로드를 동시에 카빙(carving)하여 삽입한 **자기완결형(self-contained) 드로퍼**다. | **A1** (검체 직접 분석) |
| KJ-2 | 본 캠페인의 C2는 자체 도메인이 아닌 **Dropbox 정상 API**를 악용한다. 네트워크 보안 장비가 정상 트래픽으로 오분류할 가능성이 높다. | **A2** (검체 + 복수 보고서 교차) |
| KJ-3 | "개인정보 유출 의심 확인 요청" 소재의 스피어 피싱은 **불특정 다수 살포에서 특정 기업 실무자 대상 정밀 표적으로의 전환**을 보여준다. 다회 메일 교환으로 신뢰 구축 후 악성 파일 실행을 유도한다. | **B2** (ESRC 보도 + 검체 정황 일치) |
| KJ-4 | 행위자는 **김수키(APT43)로 추정**된다. 작업 스케줄러 작업명 패턴, 미끼 문서 재사용, LNK 침투 체인, 다중 C2 운용 등 기존 김수키 TTP와 일치한다. | **B2** (TTP 패턴 일치 기반 추론) |
| KJ-5 | 동일 시기 김수키는 **Python 기반 백도어/다운로더**(C2: `45.95.186[.]232:8080`, "HAPPY" 비콘) 및 **GitHub C2**(`motoralis` 등 계정) 변종도 병행 운용 중이다. 단일 악성코드가 아닌 **모듈형 도구 운용**으로 평가된다. | **A2** (ASEC·포티넷 보고서) |
| KJ-6 | 미끼 XLSX 내부에 **대한민국 정책브리핑 도메인**이 관찰되었다. 정부·공공 연계 사칭 또는 표적 정황으로 추가 조사가 필요하다. | **C3** (단일 관찰, 미확정) |

---

## 2. 행위자 프로파일

| 항목 | 내용 |
|------|------|
| 그룹명 | 김수키(Kimsuky) |
| 별칭 | APT43, Black Banshee, Larva-24005, Velvet Chollima |
| 소속(추정) | 북한 정찰총국(RGB) 연계 |
| 활동 시작 | 최소 2012년 |
| 주요 표적 | 한국 정부·국방·방산·외교 기관, 연구자, 기업 실무 담당자 |
| 작전 목적 | 정보·기술 탈취, 사이버 정찰 (수익형 아님) |
| 제재 지정 | 한국 정부가 세계 최초로 김수키를 대북 독자제재 대상으로 지정 |

---

## 3. 검체 분석 — `2603vvip고객현황.lnk`

### 3.1 파일 식별 정보 (확정 사실)

| 유형 | 값 |
|------|-----|
| 파일명 | `2603vvip고객현황.lnk` |
| 파일 크기 | 약 1MB (정확히 121,594 bytes) |
| MD5 | `c8ce5c23d4644aa089455c479e52dae3` |
| SHA-1 | `c0bd4da40aa929e0f6f851781728719ec71b88ba` |
| SHA-256 | `7f9fe5839a2ffaa627685f673ee5d4ba5a30857c24d4cf141ab408c7a18e3f4a` |
| 위장 아이콘 | XLSX(엑셀 문서) 아이콘 |

### 3.2 LNK 내부 데이터 카빙 구조 (확정 사실)

공격자는 LNK 파일 크기를 고정값(121,594 bytes)으로 맞춰 두고, 실행 시 자기 자신을 읽어 두 구간을 추출한다.

| 구간 | 시작 offset | 종료 offset | 크기 | 처리 |
|------|------------|------------|------|------|
| 미끼 XLSX | `0x12AE` | `0x1BF9A` | `0x1ACEC` | 원본 LNK와 동일명 `.xlsx` 생성 → 실행 (사용자 기만) |
| 암호화 페이로드 | `0x1BF9A` | `0x1DAFA` | — | XOR `0xBF` 복호화 → TAR archive → `C:\ProgramData\NuGetx`에 압축 해제 |

### 3.3 실행 흐름 전체 재구성 (확정 사실)

```
사용자 .lnk 실행
  └─ cmd.exe /k
       └─ SysWOW64 32-bit powershell.exe 실행
            └─ 현재 위치에서 121,594 bytes 크기의 .lnk 검색
                 ├─ [1] LNK 내부 미끼 XLSX 추출 → 실행 (사용자 화면 기만)
                 └─ [2] LNK 후반부 XOR(0xBF) 암호화 TAR 페이로드 추출
                      └─ TAR 압축 해제 (Windows 기본 tar.exe 활용)
                           └─ user-config.js를 C:\ProgramData\vaccine\ 로 이동
                                └─ 작업 스케줄러 등록 (wscript.exe → user-config.js)
                                     └─ 원본 .lnk 및 임시 archive(joyment98) 삭제 (흔적 제거)
```

### 3.4 2단계 — `user-config.js` (확정 사실)

- `Scripting.FileSystemObject` (파일 R/W), `WScript.Shell` (외부 명령 실행)
- 복호화 키: `Secure20@^`
- 다음 단계 페이로드 위치: `C:\ProgramData\NuGetx\Web12.config` (암호화 상태)
- 처리: Base64 디코딩 → **RC4 유사 알고리즘** 복호화 → 임시 `.ps1` 저장 → PowerShell을 **숨김 창(0,1)** 으로 실행
- 최종 페이로드: Base64 인코딩된 RC4 암호화 PowerShell payload (RC4 key = `Secure20@^`)

### 3.5 3단계 — PowerShell 백도어 (난독화 해제 후, 확정 사실)

**C2: Dropbox 정상 API 악용** (자체 C2 도메인 미사용)
- `content.dropboxapi[.]com/2/files/upload`
- `content.dropboxapi[.]com/2/files/download`
- `api.dropboxapi[.]com/2/files/move_v2`
- `api.dropboxapi[.]com/oauth2/token`

**피해자 식별자(Victim ID) 생성 로직**
- 연결된 네트워크 어댑터의 MAC 주소 획득
- MAC 주소 SHA-256 해시의 **앞 4바이트만** hex 사용
- 형식: `Pan05A25_<MAC_SHA256_앞4바이트>`

**수집 정보**
| 항목 | 처리 방식 |
|------|----------|
| OS 버전 | 평문 |
| 공인 IP | RC4 + Base64 (조회: OpenDNS resolver `208.67.222.220`, `myip.opendns[.]com` 질의) |
| 사용자 정보 (`USERDOMAIN@@USERNAME`) | 평문 |
| 실행 중 프로세스 목록 | RC4 + Base64 |

- 수집 데이터 암호화 키: `Se!cure32` (RC4 유사 구조의 `EoR` 함수)

**탈취 데이터 업로드 / 명령 수신 흐름**
1. Dropbox OAuth `access_token` 발급 (`refresh_token`, `client_id`, `client_secret` 사용)
2. 업로드: `/Pan05A25_<hash>/MM:dd---HH:mm.txt` (OS버전 / 암호화 공인IP / USERDOMAIN@@USERNAME / 암호화 프로세스목록)
3. 명령 다운로드 시도: `/Pan05A25_<hash>_cafe`
4. 성공 시 `%TEMP%\cafebucket<random>.bat` 로 저장
5. `cmd.exe /c` 숨김 실행 → Dropbox 원격 파일명을 `_buy`로 변경(처리 완료 표시)
6. 120초 대기 후 로컬 BAT 삭제 (흔적 제거)

---

## 4. 은닉·탐지 회피 기법 (TTPs)

- **데이터 카빙:** XLSX 미끼 + 페이로드를 단일 LNK 내부에 삽입 → 외부 다운로드 없이 자기완결 실행
- **XOR(0xBF) + RC4 + Base64 다중 암호화:** 정적 시그니처 탐지 회피
- **LOLBin / Living-off-the-Land:** `cmd.exe`, `powershell.exe`, `wscript.exe`, 기본 `tar.exe`만 사용 (별도 도구 미투입)
- **정상 클라우드 C2:** Dropbox API를 정상 트래픽으로 위장 (네트워크 장비 오분류 유도)
- **정상 명칭 위장:** `vaccine`, `NuGetx`, `Intel(R) Ethernet2 Connection 1209-LG`(작업명), Norton 등
- **속성 은닉:** `attrib +h +s`로 디렉터리 숨김+시스템 속성
- **흔적 제거:** 원본 LNK·임시 archive·로컬 BAT 자기 삭제
- **작업 스케줄러 지속성:** 재부팅/주기적 재실행

---

## 5. MITRE ATT&CK 매핑

| 전술(Tactic) | 기법(Technique) | ID | 적용 근거 |
|--------------|-----------------|-----|----------|
| Initial Access | Spearphishing Attachment | T1566.001 | LNK 첨부 악성 메일 |
| Execution | Command and Scripting Interpreter: PowerShell | T1059.001 | 숨김 PowerShell 페이로드 |
| Execution | Command and Scripting Interpreter: Visual Basic | T1059.005 | wscript.exe + JS |
| Execution | User Execution: Malicious File | T1204.002 | XLSX 위장 LNK 실행 유도 |
| Persistence | Scheduled Task/Job | T1053.005 | 작업 스케줄러 등록 |
| Defense Evasion | Masquerading | T1036 | XLSX 아이콘·정상 명칭 위장 |
| Defense Evasion | Obfuscated/Encrypted Files | T1027 | XOR/RC4/Base64 다중 암호화 |
| Defense Evasion | Hidden Files and Directories | T1564.001 | attrib +h +s |
| Defense Evasion | Indicator Removal: File Deletion | T1070.004 | LNK/BAT 자기 삭제 |
| Defense Evasion | System Binary Proxy Execution | T1218 | LOLBin (tar.exe 등) |
| Discovery | System Information Discovery | T1082 | OS 버전 수집 |
| Discovery | System Owner/User Discovery | T1033 | USERDOMAIN@@USERNAME |
| Discovery | Process Discovery | T1057 | 프로세스 목록 수집 |
| Collection | Data Encrypted | T1560 | 수집 데이터 RC4+Base64 |
| C2 | Web Service: Bidirectional Communication | T1102.002 | Dropbox API C2 |
| C2 | Application Layer Protocol: Web Protocols | T1071.001 | HTTPS 기반 |
| Exfiltration | Exfiltration Over Web Service | T1567.002 | Dropbox 업로드 |

---

## 6. IOC (Indicators of Compromise)

### 6.1 파일 해시
```
MD5    : c8ce5c23d4644aa089455c479e52dae3
SHA-1  : c0bd4da40aa929e0f6f851781728719ec71b88ba
SHA-256: 7f9fe5839a2ffaa627685f673ee5d4ba5a30857c24d4cf141ab408c7a18e3f4a
```

### 6.2 파일 경로 / 산출물
```
C:\ProgramData\vaccine\
C:\ProgramData\vaccine\user-config.js
C:\ProgramData\vaccine\joyment98
C:\ProgramData\NuGetx\
C:\ProgramData\NuGetx\user-config.js
C:\ProgramData\NuGetx\Web12.config
%TEMP%\cafebucket<random>.bat
```

### 6.3 작업 스케줄러 작업명
```
Intel(R) Ethernet2 Connection 1209-LG
```

### 6.4 네트워크 / C2
```
content.dropboxapi[.]com   (업로드/다운로드)
api.dropboxapi[.]com       (move_v2 / oauth2 token)
208.67.222.220             (OpenDNS resolver — 공인 IP 조회)
myip.opendns[.]com
```

### 6.5 암호화 키 / 식별 문자열
```
Secure20@^      (RC4 key — 2~3단계)
Se!cure32       (수집 데이터 RC4 key)
Pan05A25_       (피해자 식별자 prefix)
_cafe / _buy    (명령 수신/완료 마커)
```

### 6.6 관련 변종 IOC (동일 시기, ASEC·포티넷 — 별도 캠페인)
```
45.95.186[.]232:8080       (Python 백도어 C2)
"HAPPY"                    (감염 비콘 문자열)
magic bytes: 0x99 0x0A 0xBD 0x99 (커스텀 프로토콜)
GitHub 계정: motoralis, God0808RAMA, Pigresy80, entire73, pandora0009, brandonleeodd93-blip
```

---

## 7. 한국 특화 영향 (Korea-Specific Impact)

- **표적 전환:** 불특정 다수 살포 → 특정 기업 실무 담당자 정밀 표적. 다회 메일 교환 기반 사회공학으로 1차 보안 솔루션 차단 시 암호 압축 파일로 재전송하는 우회까지 확인됨(ESRC).
- **KISA / KrCERT:** LNK 기반 침투 및 Dropbox C2 패턴에 대한 침해지표 공유 및 조기 경보 필요.
- **공공/정부 연계 정황:** 미끼 XLSX 내 대한민국 정책브리핑 도메인 관찰(KJ-6) — 정부 사칭/표적 가능성 추가 검증 필요.
- **금융권(KoFIU 연계):** 김수키는 정보 탈취가 1차 목적이나, 정밀 표적 메일이 금융기관 실무자로 확산될 경우 자격증명 탈취 위험.
- **기업 일반:** EDR 미배포 환경에서 LOLBin·정상 클라우드 조합은 기존 시그니처/네트워크 탐지로 식별이 어려움.

---

## 8. 탐지 및 권고 (Detection & Mitigation)

### 8.1 탐지 포인트 (Detection)
- LNK 파일이 `powershell.exe` 또는 `cmd.exe /k`를 호출하는 프로세스 생성 이벤트
- `wscript.exe`가 `C:\ProgramData\*\user-config.js`를 실행하는 패턴
- `tar.exe`가 `C:\ProgramData\` 하위에서 비정상 호출되는 경우
- 엔드포인트에서 `dropboxapi.com` 으로의 신규/비정상 아웃바운드 (특히 비-브라우저 프로세스)
- `myip.opendns.com` / OpenDNS resolver 질의 (일반 업무 PC에서 비정상)
- 정상 어댑터명을 위장한 의심 작업 스케줄러 작업 생성

### 8.2 권고 (Mitigation)
1. **LNK 첨부 차단/격리:** 메일 게이트웨이에서 LNK·이중 확장자 첨부 정책 강화
2. **클라우드 C2 모니터링:** 비-브라우저 프로세스의 Dropbox/GitHub 트래픽 가시성 확보
3. **작업 스케줄러 모니터링:** 비정상 작업명·wscript 연계 작업 탐지
4. **LOLBin 행위 탐지:** `tar.exe`, `wscript.exe`, `powershell.exe`의 비정상 부모-자식 프로세스 체인 룰화
5. **사용자 인식 제고:** "개인정보 유출 확인 요청" 등 민감 소재 + 다회 메일 신뢰 구축형 사회공학 경고
6. **압축 파일 우회 대응:** 암호 압축 첨부에 대한 추가 검사 절차 (1차 차단 후 재전송 시나리오)

---

## 9. 분석 한계 및 후속 과제

- 본 분석은 **단일 검체 1건 + 공개 분석 보고서** 기반 재구성이다. C2 인프라 전체 범위, 피해 규모, 후속 명령(BAT) 내용은 미확보.
- 행위자 귀속(KJ-4)은 TTP 패턴 일치 기반 **추론**이며, 단정적 단계는 아니다.
- KJ-6(정책브리핑 도메인)은 단일 관찰로 확정 불가 — 미끼 문서 추가 수집·연관 분석 필요.
- 후속: ① 동일 Dropbox 계정 연계 캠페인 추적 ② Python 백도어 변종(45.95.186.232)과의 인프라 중첩 여부 ③ 작업 스케줄러 작업명 과거 김수키 사례 대조.

---

## 10. 참고 자료 (References)

- 꿈을꾸는 파랑새 (wezard4u): `2603vvip고객현황.lnk` 검체 분석 (2026.06.22)
- AhnLab ASEC: Python 기반 백도어 유포 악성 LNK 및 유포 방식 변화 (Kimsuky) (2026.04.02)
- Fortinet FortiGuard Labs (Cara Lin): GitHub C2 악용 국내 표적 LNK 캠페인 (2026.04)
- 이스트시큐리티 ESRC: "개인정보 유출 의심 확인 요청" 위장 스피어 피싱 포착 (2026.06)
- SOCPrime: Kimsuky LNK Campaign Drops Python Backdoor via Dropbox C2 (2026.04)

---

*TLP:CLEAR — 자유 배포 가능. 본 문서는 방어 목적의 위협 인텔리전스이며, 공격 재현/악용을 목적으로 하지 않는다.*
