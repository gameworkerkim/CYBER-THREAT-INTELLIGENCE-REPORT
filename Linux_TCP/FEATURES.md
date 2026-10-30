# FEATURES — CVE-2026-98432 방어 도구 모음의 특징

## 설계 원칙

| 원칙 | 내용 |
|---|---|
| 방어 전용 | 익스플로잇 페이로드·정보 유출·권한 상승 기능 없음. 공격 전제 패턴 재현(리프로듀서)은 검증 목적으로만 한정 |
| 의존성 제로 | Python 도구는 표준 라이브러리만 사용 (scapy 등 서드파티 불필요). bash 도구는 coreutils만 사용 |
| 검증 가능성 | 모든 도구에 `--selftest` 또는 구문 검증 경로 내장. 리프로듀서↔감지기 교차 파싱 테스트 포함 |
| SIEM 친화 | 감지기는 JSON Lines 출력 + 파일 로그. 타임스탬프·5-tuple·옵션 타입·재전송 통계 포함 |
| 안전 장치 | 레이스 모드는 명시적 확인 플래그(`--confirm-lab ISOLATED-LAB-ONLY`) 없이는 실행 거부 |
| 환경 보정 | 판정 불가(백포트 커널)와 판정 가능을 구분해 과탐지/과신을 방지 |

## 도구별 특징

### 1. tcpopt_syn_detector.py (수동 네트워크 감지기)

- **수동형**: 패킷을 보내지 않아 탐지가 공격자에게 노출되지 않음
- **L2 파서 내장**: Ethernet/VLAN 태그(802.1Q/802.1ad)/IPv4 옵션 TLV 파싱을 표준 라이브러리로 자체 구현
- **3단계 이벤트 계층**: `syn_ipopt`(info) → `syn_ipopt_probe`(medium) → `race_grooming`(high)
- **레이스 유도 시그널**: 동일 4-tuple·동일 seq 재전송을 RTO(1초) 대비 간격으로 판정 (`--rto-min`)
- **임계값 조절**: `--window`, `--threshold`, `--rto-min`으로 오탐률 튜닝
- **출력 억제**: 소스별 최소 발화 간격(기본 5초)으로 로그 폭주 방지
- **암호화 서비스에도 유효**: IP 옵션은 TLS로 암호화되지 않으므로 HTTPS 등에도 적용 가능
- **오버헤드 최소**: 스냅 길이 기본 96바이트, 헤더만 파싱

### 2. cve-2026-98432-host-check.sh (호스트 점검)

- **3단계 판정 + exit code**: `PATCHED/NOT_AFFECTED`(0), `VULNERABLE`(2), `UNKNOWN`(3) — CI/자동화에서 직접 사용 가능
- **업스트림 수정 매핑 내장**: 5.10.272 / 5.15.223 / 6.1.190 / 6.6.159 / 6.12.113 / 6.18.56 / 7.2.10 / 7.3
- **백포트 인식**: Ubuntu/RHEL 계열은 버전 매핑이 무의미함을 감지하고 UNKNOWN으로 안내 (과신 방지)
- **노출면 열거**: MPTCP 활성화(`net.mptcp.enabled`), `tcp_migrate_req`(시나리오 B), MPTCP 리스너(`ss -Mltn`), IPv4 리스너 목록
- **머신 판독 출력**: `VERDICT=...`, `NOTES=...` 라인으로 파이프라인 연동
- **특권 불필요**: 대부분 root 없이 동작 (`ss -Mltn`만 커널 다이어그램에 따라 제한)

### 3. IDS 시그니처 (Suricata / Snort 3 / Zeek)

- **3개 엔진 동시 커버**: 시그니처(Suricata·Snort3) + 스크립팅(Zeek) 선택지 제공
- **옵션 타입별 시그니처**: RR(7)/TS(68)/LSRR(131)/SSRR(137) + `ipopts:any` 일반 룰
- **소스 기반 임계값**: Suricata `threshold by_src`로 burst 프로브 억제
- **Zeek 3중 알람**: 단건 관찰 / 임계 burst / 1초 미만 재전송(grooming)을 NOTICE로 분리 발화
- **SID 체계**: `2026103001~` (YYYYMMDD+순번) — 충돌 방지용 고유 식별

### 4. tcp_race_reproducer.py (검증용 리프로듀서)

- **3모드 안전 계층**:
  - `smoke` — 옵션 부착 SYN 독립 발송 (UAF 불가, 탐지 S1 검증)
  - `groom` — 동일 seq 재전송 (req가 살아 있어 UAF 불가, S2 검증)
  - `race` — 파괴+재전송 동시 수행 (UAF 유도 가능 → 격리 VM 전용 확인 플래그 필수)
- **셀프 검증**: 체크섬 벡터, IP/TCP 헤더 길이, 감지기 교차 파싱(자기 프레임이 감지기에 잡히는지) 8종 테스트
- **옵션 빌더**: RR/Timestamp/LSRR/SSRR 조합, 임의 페이로드 바이트(탐지 회피 테스트용)
- **전 과정 raw socket**: 커널 TCP 상태에 의존하지 않아 ISN·재전송 간격을 정밀 제어

### 5. QEMU 패치 검증랩

- **동일 커밋 기준 비교**: `e3f33b0a1d89^`(취약) vs `e3f33b0a1d89`(수정) — 배포판 노이즈 없는 순수 A/B
- **KASAN 내장 빌드**: 패치 효과를 커널이 직접 보고 (`use-after-free in ip_options_build`)
- **모듈리스 커널 + 정적 init**: initramfs가 1개 바이너리로 완결, 빌드 단순화
- **콘솔 로그 보존**: `console-{vuln,fixed}.log`로 사후 grep 분석 가능
- **slirp user-net + hostfwd**: 루트 권한 브리지 없이 호스트→게스트 4444 포워딩

## 한계 (의도된 범위 밖)

| 한계 | 설명 |
|---|---|
| S4 시그널 미구현 | SYNACK 옵션 echo 비일치(유출 성공 징후)는 미러링 환경에서만 판정 가능 — 도구는 인바운드 SYN만 판정 |
| 레이스 승률 비보장 | 취약 커널 KASAN 보고는 간헐적. 판정의 결정적 기준은 fixed 커널 무보고 |
| 암호화 트래픽 내용 분석 없음 | 페이로드 DPI 불필요 (IP 옵션만으로 판정) |
| 클라우드 인스턴스 커널 미지원 | 벤더 백포트 커널은 버전 매핑 불가 → UNKNOWN 안내가 정답 |
| 탐지는 조기 경보 | 레이스 성공 여부 확정은 커널 로그(KASAN/oops)와 대조 필요 |
