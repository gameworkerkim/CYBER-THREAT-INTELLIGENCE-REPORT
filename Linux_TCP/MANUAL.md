# MANUAL — CVE-2026-98432 방어 도구 사용 메뉴얼

## 1. 공통 요구사항

| 도구 | 대상 OS | 권한 | 의존성 |
|---|---|---|---|
| tcpopt_syn_detector.py | Linux | root 또는 CAP_NET_RAW | Python 3.6+ (표준 라이브러리만) |
| cve-2026-98432-host-check.sh | Linux | 불필요(일부만 권장) | bash, coreutils, (선택) ss |
| suricata.rules / snort3.rules | Suricata 6/7, Snort 3 | 서비스 계정 | 해당 엔진 |
| detect-tcpopt.zeek | Zeek 4+ | 서비스 계정 | Zeek |
| tcp_race_reproducer.py | Linux | root (CAP_NET_RAW) | Python 3.6+ |
| lab/*.sh | Linux (빌드 호스트) | 일반 사용자 | gcc·make·bison·flex·bc·libelf-dev·cpio·qemu |

> 개발/문서는 macOS에서도 가능하지만, 패킷·커널 관련 도구의 실제 실행은 Linux 전용입니다.

## 2. 네트워크 감지기 (tcpopt_syn_detector.py)

### 2.1 옵션 일람

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--iface` | eth0 | 감시 인터페이스 (lo 가능 → 로컬 검증용) |
| `--promisc` | off | 무차별 모드 |
| `--snap-len` | 96 | 캡처 스냅 길이 (헤더만 필요) |
| `--window` | 10.0 | 소스 집계 창 (초) |
| `--rto-min` | 0.2 | 이보다 짧은 동일 seq 재전송을 race_grooming으로 판정 (초) |
| `--threshold` | 3 | 창 내 SYN 수가 넘으면 syn_ipopt_probe 발화 |
| `--format` | json | `json` 또는 `text` |
| `--log` | 없음 | 파일 추가 기록 (SIEM 수집용) |
| `--selftest` | - | 파서/판정 로직 자체 검증 후 종료 |

### 2.2 실행 예

```bash
# 기본 (JSON Lines, stdout)
sudo python3 detector/tcpopt_syn_detector.py --iface eth0 --format json

# 파일 로그 병행
sudo python3 detector/tcpopt_syn_detector.py --iface eth0 \
    --log /var/log/tcpopt-syn.jsonl

# 텍스트 포맷 + 임계값 강화 (오탐 감소)
sudo python3 detector/tcpopt_syn_detector.py --iface eth0 --format text \
    --window 30 --threshold 5 --rto-min 0.5
```

### 2.3 JSON 이벤트 스키마

```json
{"ts":"2026-10-30T12:00:01","event":"race_grooming","severity":"high",
 "src_ip":"203.0.113.7","dst_ip":"192.0.2.10","sport":40000,"dport":443,
 "opt_types":[7,68],"opt_hex":"070304010808a1b2c3d4e5","retx_count":6,
 "inter_arrival_ms":18}
```

- `event`: `syn_ipopt` / `syn_ipopt_probe` / `race_grooming`
- `opt_types`: IP 옵션 타입 번호 (7=RR, 68=TS, 131=LSRR, 137=SSRR, 134=CIPSO, 148=RouterAlert)
- `retx_count` / `inter_arrival_ms`: race_grooming 전용 재전송 통계

### 2.4 systemd 서비스 예 (상시 운영)

```ini
# /etc/systemd/system/tcpopt-syn-detector.service
[Unit]
Description=CVE-2026-98432 SYN/IP-option detector
After=network-online.target

[Service]
ExecStart=/usr/bin/python3 /opt/cve-2026-98432-detection/detector/tcpopt_syn_detector.py --iface eth0 --format json --log /var/log/tcpopt-syn.jsonl
Restart=always
AmbientCapabilities=CAP_NET_RAW
CapabilityBoundingSet=CAP_NET_RAW
NoNewPrivileges=true
ProtectSystem=strict
ReadOnlyPaths=/

[Install]
WantedBy=multi-user.target
```

### 2.5 로그 연동 팁

- `--log` 파일을 Filebeat/Fluentd로 수집 → Elasticsearch/Splunk
- severity별 경보 룰: `race_grooming`(high)은 즉시, `syn_ipopt_probe`(medium)는
  5분 창 2회 이상, `syn_ipopt`(info)는 집계 통계용으로만

## 3. 호스트 점검 (cve-2026-98432-host-check.sh)

```bash
bash detector/cve-2026-98432-host-check.sh; echo $?
```

출력 예:

```
== CVE-2026-98432 host check ==
kernel: 6.6.158-aws (parsed 6.6.158)
patch status: VULNERABLE
distro: Ubuntu 22.04 LTS
net.mptcp.enabled: 0
net.ipv4.tcp_migrate_req: 0
MPTCP listeners: none
IPv4 TCP listeners (attack surface):
LISTEN 0 128 0.0.0.0:443 0.0.0.0:*
VERDICT=VULNERABLE
NOTES=kernel series 6.6 needs patch level 159;Ubuntu backport - verify with: ubuntu-security-status / CVE page;
```

- **exit 0**: 패치됨/비영향 → 점검 종료
- **exit 2**: 취약 → 패치 계획 수립, 노출 축소 (권고: `docs/fix-commit-analysis.md` §7, CTI 리포트 대응 권고 참조)
- **exit 3**: 판정 불가(백포트/EOL 시리즈) → 배포판 권고 페이지 확인

자산 전수 점검 예:

```bash
for h in $(cat hosts.txt); do
  ssh "$h" 'bash -s' < detector/cve-2026-98432-host-check.sh > "report-$h.txt" 2>&1
  echo "$h exit=$?"
done
```

## 4. IDS/NSM 배포

### 4.1 Suricata

```bash
sudo cp ids/suricata.rules /etc/suricata/rules/
# suricata.yaml의 rule-files에 추가:
#   - suricata.rules
sudo systemctl restart suricata
```

### 4.2 Snort 3

```bash
sudo cp ids/snort3.rules /usr/local/etc/rules/
# snort.lua의 ips.include에 추가 후:
snort -c /usr/local/etc/snort/snort.lua -R /usr/local/etc/rules/snort3.rules -i eth0
```

burst 억제(rate_filter) 예 — local.lua:

```lua
ips = {
  rules = [[
    include /usr/local/etc/rules/snort3.rules
  ]]
}
rate_filter = {
  { gid = 1, sid = 2026103001, track = 'by_src', count = 3, seconds = 10,
    new_action = 'alert', timeout = 60 }
}
```

### 4.3 Zeek

```bash
# site/local.zeek에:
@load /opt/cve-2026-98432-detection/ids/detect-tcpopt.zeek
# 또는 일회성:
zeek -C local.zeek ids/detect-tcpopt.zeek
```

`notice.log`에서 `note=TCPOPT_SYN` 메시지 조회:

```bash
zcat notice.log.gz 2>/dev/null | zeek-cut note msg sub | grep CVE-2026-98432
```

## 5. 리프로듀서 (tcp_race_reproducer.py)

> 검증 전용. `--mode race`는 미패치 커널에서 크래시를 유발할 수 있으므로
> 격리 VM/루프백에서만, `--confirm-lab ISOLATED-LAB-ONLY` 지정 시에만 실행됩니다.
> 프로덕션 대상 사용 금지.

### 5.1 옵션 일람

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--target` | 127.0.0.1:4444 | 대상 리스너 IP:PORT |
| `--src` | 자동 | 출발지 IP (UDP connect 트릭으로 결정) |
| `--mode` | smoke | `smoke` / `groom` / `race` |
| `--opt-types` | rr,ts | 부착할 옵션 (rr, ts, lsrr, ssrr 콤마 구분) |
| `--count` | 10 | smoke: 독립 SYN 개수 |
| `--retx` | 8 | groom/race: 반복 재전송 수 |
| `--iterations` | 50 | race: 스레드당 시도 수 |
| `--threads` | 4 | race: 병렬 플로우 수 |
| `--sport-base` | 40000 | 출발지 포트 시작값 |
| `--delay` | 0.0 | 패킷 간 지연 (초) |
| `--confirm-lab` | - | race 모드 필수: `ISOLATED-LAB-ONLY` |

### 5.2 시나리오별 예

```bash
# A. 감지기 S1 검증 (루프백, 안전)
sudo python3 reproducer/tcp_race_reproducer.py --target 127.0.0.1:4444 --mode smoke --count 5

# B. 감지기 S2/race_grooming 검증 (안전)
sudo python3 reproducer/tcp_race_reproducer.py --target 127.0.0.1:4444 --mode groom --retx 8

# C. KASAN 검증랩에서 패치 효과 확인 (격리 VM 전용)
sudo python3 reproducer/tcp_race_reproducer.py \
    --target 127.0.0.1:4444 --mode race \
    --iterations 200 --threads 8 \
    --confirm-lab ISOLATED-LAB-ONLY
```

### 5.3 실행 전 확인사항

- 대상에 TCP 리스너 존재 (`python3 -m http.server 4444`, `nc -l 4444` 등)
- 루프백 테스트 시 감지기 인터페이스는 `--iface lo`
- 반대편에서 감지기 로그에 해당 5-tuple 이벤트가 올라오는지 확인

## 6. QEMU 패치 검증랩

전체 런북은 `lab/README.md` 참조. 요약:

```bash
cd lab
./01-build-kernel.sh both        # 취약/수정 커널 KASAN 빌드 (30~90분/커널)
./02-build-initramfs.sh          # 정적 리스너 initramfs
./03-boot-qemu.sh fixed          # 수정 커널 부팅 → race 재현 → KASAN 무보고 확인
./03-boot-qemu.sh vuln           # 취약 커널 부팅 → race 재현 → 간헐적 KASAN 보고 확인
```

판정 grep:

```bash
grep -i "use-after-free" build/console-vuln.log    # 취약: 간헐 보고
grep -i "use-after-free" build/console-fixed.log   # 수정: 반드시 무보고
```

## 7. 트러블슈팅

| 증상 | 원인/대응 |
|---|---|
| `permission denied` (감지기/리프로듀서) | root 또는 `setcap cap_net_raw+p` 부여 |
| `cannot open eth0` | 인터페이스명 확인 (`ip link`). 로컬 테스트는 `--iface lo` |
| smoke 모드 `no SYNACK` | 대상 리스너 미기동, 방화벽, 또는 `--target` 오기재 |
| 감지기에 이벤트 없음 | 인터페이스 미스매치(트래픽 경로 확인), `--window/--threshold` 과도 |
| race_grooming 미발화 | `--delay` 기본 0 유지, groom 모드 `--retx` 증가, 감지기 `--rto-min` 확인 |
| host-check `UNKNOWN` | 정상: 백포트 커널. 배포판 권고로 판정 |
| KASAN 보고 안 나옴(취약 커널) | 레이스 승률 낮음 — 스레드/반복 증가, 리프로듀서 병렬 실행 |
| initramfs 빌드 실패 | `glibc-static`(Debian/Ubuntu) 또는 `gcc-static` 설치 |
| qemu `-enable-kvm` 실패 | `/dev/kvm` 권한(사용자 kvm 그룹) 또는 KVM 없이 실행 가능(느림) |

## 8. 참고 자료

- 분석: `docs/fix-commit-analysis.md`
- 특징 요약: `FEATURES.md`
- CTI 리포트: 상위 디렉터리 `CTI-2026-1030-TCP_KR.md`
