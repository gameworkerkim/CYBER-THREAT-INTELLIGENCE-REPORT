# CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO

---

## 리포트 메타데이터

| 항목 | 내용 |
|------|------|
| **리포트 ID** | CTI-2026-0514-CTRL_RussianRAT_LNK_RDP_KO |
| **발행일** | 2026-05-14 |
| **심각도** | CRITICAL |
| **상태** | 활성 위협 (Active Threat) |
| **발견 기관** | Censys Attack Research Center (ARC) — Andrew Northern |
| **최초 탐지** | 2026년 2월 |
| **공개일** | 2026-03-30 |
| **위협 행위자** | 러시아어권 단일 운영자 (귀속 HIGH confidence) |
| **플랫폼** | Windows (x86/x64) |
| **언어** | 한국어 (KO) |
| **분류** | RAT / 크리덴셜 탈취 / 횡적 이동 / 지속성 |

---

## 목차

1. [개요](#1-개요)
2. [툴킷 구성 요소](#2-툴킷-구성-요소)
3. [초기 침투 — LNK 기반 드로퍼](#3-초기-침투--lnk-기반-다단계-드로퍼)
4. [크리덴셜 피싱 — Windows Hello 위장 UI](#4-크리덴셜-피싱--windows-hello-위장-ui)
5. [키로거](#5-키로거)
6. [RDP 하이재킹 및 FRP 역방향 터널링](#6-rdp-하이재킹-및-frp-역방향-터널링)
7. [러시아 기원 귀속 증거](#7-러시아-기원-귀속-증거-attribution)
8. [침해 지표 (IoCs)](#8-침해-지표-iocs)
9. [탐지 시그니처](#9-탐지-시그니처)
10. [대응 조치](#10-대응-조치)
11. [참고](#11-참고)

---

## 1. 개요

> **[CRITICAL]** Censys ARC 연구원 Andrew Northern이 사전에 기록되지 않은 러시아 기원의 원격접근 툴킷 **CTRL**을 발견했습니다. .NET 기반으로 제작된 이 툴킷은 폴더 아이콘으로 위장한 **단일 LNK 파일 하나**로 전체 침해를 시작하며, Windows Hello 피싱 UI를 통한 크리덴셜 탈취, 지속적 키로깅, RDP 세션 하이재킹, FRP 기반 역방향 터널링을 하나의 통합 프레임워크로 결합합니다.

공개적인 위협 인텔리전스 피드 및 VirusTotal에서 **전혀 탐지되지 않은** 상태입니다.

Censys 평가: *"CTRL 툴킷은 기능 범위보다 운영 보안(OPSEC)을 우선시하는 목적 특화 단일 운영자 툴킷의 트렌드를 보여줍니다. FRP 역방향 터널을 통해 모든 상호작용을 RDP 세션으로 라우팅함으로써, 범용 RAT의 특징인 네트워크 탐지 가능한 비콘 패턴을 완전히 회피합니다."*

---

## 2. 툴킷 구성 요소

세 개의 .NET 실행 파일로 구성. 공통 개발 환경: `C:\Users\Admin\repos\repos\` / .NET Framework 4.7.2 / AES-256-CBC 암호화.

| 구성 요소 | 파일명 | 기능 |
|----------|--------|------|
| **핵심 제어 모듈** | `ctrl.exe` | 암호화 페이로드 로딩 · 네임드 파이프(`ctrlPipe`) C2 에이전트 · Windows Hello 피싱 · RDP 하이재킹 · 키로그 추출 |
| **FRP 래퍼** | `FRPWrapper.exe` | Go DLL(FRP v0.65.0) 메모리 로딩 · RDP(3389) 및 TCP 셸(5267) 역방향 터널 수립 |
| **RDP 래퍼** | `RDPWrapper.exe` | `termsrv.dll` 패치 · 무제한 동시 RDP 세션 활성화 · Windows Defender 제외 목록 자동 추가 |

---

## 3. 초기 침투 — LNK 기반 다단계 드로퍼

### 악성 파일
```
파일명: Private Key #kfxm7p9q_yek.lnk
아이콘: 폴더 (위장)
타임스탬프: 제로화 (포렌식 분석 회피)
```

### 다단계 실행 체인

| 단계 | 방법 | 상세 |
|------|------|------|
| **①** | PowerShell 은닉 실행 | LNK가 숨겨진 창으로 PowerShell 실행 → Base64 블롭 디코딩 및 인메모리 실행 |
| **②** | UAC 우회 | `fodhelper.exe` 기반 UAC 바이패스로 권한 상승 |
| **③** | C2 연결 확인 | `hui228[.]ru:7000`에 연결 확인 후 3개 페이로드 다운로드 |
| **④** | 레지스트리 지속성 | 정상 Explorer 키 하위에 바이너리 값으로 페이로드 저장 (디스크 PE 파일 없음) |
| **⑤** | 스케줄 태스크 등록 | 인코딩된 PowerShell로 예약 작업 생성 → 재부팅 후에도 복원 |

### 레지스트리 지속성 키 (탐지 대상)
```
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\ShellStateVersion1
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\IconSizeVersion1
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\IconUnderlineVersion1
```
> 정상 Explorer 하위 키처럼 위장하여 탐지 회피. 해당 키에 **바이너리 데이터 쓰기** 이벤트 모니터링 권고.

---

## 4. 크리덴셜 피싱 — Windows Hello 위장 UI

WPF(Windows Presentation Foundation) 기반으로 제작된 **실제 Windows Hello PIN 인증 화면과 구별 불가능한** 피싱 UI.

| 기능 | 구현 방식 |
|------|----------|
| **실사용자 정보 표시** | 피해자의 실제 표시 이름, 계정 사진, Windows 테마 자동 감지·반영 |
| **Lottie 애니메이션** | 실제 Windows 애셋에서 추출한 Lottie 애니메이션 사용으로 완벽한 UI 재현 |
| **탈출 방지** | Alt+Tab, Alt+F4, Win 키 차단 — 키보드로 창 닫기 불가 |
| **실제 인증 연동** | 입력된 PIN을 실제 Windows 크리덴셜 프롬프트(UI Automation)에 자동 전달하여 유효성 검증 |
| **성공 시 동작** | PIN 인증 성공 후에도 피싱 창 유지 — 사용자에게 비정상적 동작 전혀 없음 |
| **로그 기록** | `C:\Temp\keylog.txt`에 `[STEALUSER PIN CAPTURED]` 접두사와 함께 저장 |

---

## 5. 키로거

배경 서비스로 실행되는 키보드 후킹 기반 키로거. 모든 키 입력이 지속적으로 기록되며, 크리덴셜 피싱으로 탈취된 PIN도 동일 파일에 통합 저장됩니다.

```
키로그 저장 경로: C:\Temp\keylog.txt
```

---

## 6. RDP 하이재킹 및 FRP 역방향 터널링

| 구성 요소 | 동작 |
|----------|------|
| **RDP 세션 하이재킹** | `termsrv.dll` 패치 + RDP Wrapper로 무제한 동시 RDP 세션 활성화 → 운영자가 피해자 데스크톱 동시 쉐도우/제어 가능 |
| **FRP 역방향 터널** | Go DLL을 인메모리 PE 수동 매핑으로 로드 → RDP(3389) 및 TCP 셸(5267)을 운영자 FRP 서버로 역방향 터널링 |
| **C2 통신 은닉** | 모든 C2 명령 트래픽이 피해자 로컬 네임드 파이프(`ctrlPipe`)를 통해 처리 → 네트워크 비콘 패턴 없음 |
| **이중 모드 설계** | 운영자가 피해자에 `ctrl.exe`를 최초 1회 배포 → 이후 FRP 터널링된 RDP 세션을 통해 `ctrl.exe client`로 상호작용 |
| **하드코딩 C2 없음** | 바이너리에 C2 주소 미포함 → `frpc.toml`이 런타임에 `C:\ProgramData\frp\` 경로에 생성되어 기록 |

---

## 7. 러시아 기원 귀속 증거 (Attribution)

| 증거 유형 | 세부 내용 |
|----------|----------|
| **러시아어 오류 문자열** | FRP 래퍼에 `"Не найдена функция GoMain"` (GoMain 함수를 찾을 수 없습니다) 포함 |
| **러시아 도메인** | C2 도메인: `hui228[.]ru` (러시아 최상위 도메인 `.ru`) |
| **개발자 SID 노출** | LNK 메타데이터에 Windows SID `S-1-5-21-445479930-4070444189-1846254649-1001` 포함 |
| **개발 경로** | PDB 경로: `C:\Users\Admin\repos\repos\` — 단일 개발자 환경 |
| **타임스탬프 위조** | 모든 PE 타임스탬프 2044~2103년으로 위조 → 포렌식 타임라인 분석 방해 |
| **호스팅 인프라** | C2 서버 `194.33.61[.]36`, `109.107.168[.]18`: Partner Hosting LTD (AS215826, 프랑크푸르트) |

---

## 8. 침해 지표 (IoCs)

### 네트워크

```
C2 도메인: hui228[.]ru
C2 포트: hui228[.]ru:7000 (FRP 서버)
TCP 셸 포트: 5267
RDP 포트: 3389 (역방향 터널링)
FRP 릴레이 IP: 194.33.61[.]36 (2026년 1~2월 활성)
FRP 릴레이 IP: 109.107.168[.]18 (2026-02-27 DNS 전환)
페이로드 호스트: 146.19.213[.]155 (오픈 디렉토리, 2026년 2월)
ASN: AS215826 (Partner Hosting LTD, 프랑크푸르트)
```

### 파일 시스템

```
악성 LNK: Private Key #kfxm7p9q_yek.lnk
키로그: C:\Temp\keylog.txt
FRP 설정: C:\ProgramData\frp\frpc.toml
레지스트리: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\ShellStateVersion1
레지스트리: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\IconSizeVersion1
레지스트리: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\IconUnderlineVersion1
```

### 개발자 흔적

```
Windows SID: S-1-5-21-445479930-4070444189-1846254649-1001
PDB 경로: C:\Users\Admin\repos\repos\
오류 문자열: "Не найдена функция GoMain"
.NET 버전: 4.7.2
암호화: AES-256-CBC
```

---

## 9. 탐지 시그니처

```
# Censys 핑거프린트
host.services.protocol: FRPS within PARTNER-HOSTING-LTD ASN (AS215826)

# 탐지 항목 (SOC/EDR)
- ctrlPipe 네임드 파이프 생성 이벤트
- termsrv.dll 비정상 수정 (RDP Wrapper 설치 감지)
- C:\Temp\keylog.txt 파일 생성 알림
- fodhelper.exe 기반 UAC 바이패스 탐지
- Explorer 레지스트리 키에 바이너리 데이터 쓰기
- 인코딩된 PowerShell이 포함된 예약 작업 생성
- 비표준 포트(5267, 7000) 아웃바운드 연결
```

### YARA 탐지 포인트 (수동 작성 참고)
```yara
rule CTRL_RAT_Indicators {
strings:
$ru_str = "Не найдена функция GoMain" wide
$pipe = "ctrlPipe" wide
$pdb = "C:\\Users\\Admin\\repos\\repos\\" ascii
$keylog = "STEALUSER PIN CAPTURED" wide
$frp = "frpc.toml" wide
condition:
2 of them
}
```

---

## 10. 대응 조치

### 즉각 탐지

```bash
# 키로그 파일 존재 확인
Get-ChildItem -Path "C:\Temp\keylog.txt" -ErrorAction SilentlyContinue

# FRP 설정 파일 확인
Get-ChildItem -Path "C:\ProgramData\frp\frpc.toml" -ErrorAction SilentlyContinue

# 레지스트리 이상 키 확인
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer" | 
Select-Object ShellStateVersion1, IconSizeVersion1, IconUnderlineVersion1

# 비정상 예약 작업 확인 (인코딩된 PowerShell 포함)
Get-ScheduledTask | Where-Object { $_.Actions.Execute -match "powershell" } | 
Select-Object TaskName, TaskPath
```

### 차단 및 격리

- 침해 확인 시스템 즉시 네트워크 격리
- `hui228[.]ru`, `194.33.61[.]36`, `109.107.168[.]18` 방화벽/DNS 차단 등재
- AS215826 발 FRP 서버 프로토콜(포트 7000) 트래픽 차단
- `termsrv.dll` 무결성 검사 및 비정상 수정 복원

### 중장기 예방

- EDR에 `fodhelper.exe` 기반 UAC 바이패스 탐지 규칙 추가
- 네트워크 아웃바운드 FRP(포트 7000) 접속 화이트리스트 기반 제어
- **LNK 파일 실행 정책 강화** — 이메일·다운로드 경유 LNK 격리 또는 차단
- Windows Hello PIN 입력 요청 창 외부 출현 시 사용자 주의 훈련
- RDP Wrapper 무단 설치 탐지 — `termsrv.dll` 변경 모니터링
- 정기적 Threat Hunting — 비표준 네임드 파이프(`ctrlPipe` 등) 생성 조회

---

## 11. 참고

| 구분 | 출처 |
|------|------|
| 원본 연구 | [Censys ARC — Under CTRL: Dissecting a Previously Undocumented Russian .Net Access Framework (2026.03.30)](https://censys.com/research) |
| 보도 | [The Hacker News — Russian CTRL Toolkit Delivered via Malicious LNK Files Hijacks RDP via FRP Tunnels (2026.03.30)](https://thehackernews.com) |
| 보도 | [GBHackers — Russian Hackers Deploy CTRL for RDP Hijacking (2026.03.30)](https://gbhackers.com) |

---

*본 리포트는 공개된 보안 인텔리전스를 기반으로 작성되었습니다.* 
*발행: 2026-05-14 | 저자: Dennis Kim (gameworker@gmail.com) | github.com/gameworkerkim*
