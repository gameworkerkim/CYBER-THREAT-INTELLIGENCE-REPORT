# Linux_TCP — CVE-2026-98432 방어 도구 모음

리눅스 커널 IPv4 TCP 핸드셰이크 경로의 Use-After-Free(CVE-2026-98432)에 대한
**방어 관점** 분석 및 사전 탐지 도구 모음입니다. 익스플로잇 코드는 포함하지 않습니다.

- 취약점: 수정 커밋 `e3f33b0a1d89` ("ipv4: free inet_opt and ireq_opt after an RCU grace period")
- 영향: Linux 4.4 이후, 인증 없이 원격 트리거 가능한 레이스 → UAF (CVSS 9.8)
- 공격 전제 조건: **IPv4 옵션이 부착된 SYN** (정상 트래픽에서 거의 소멸한 패턴 → 탐지 특이도 높음)

## 구성

```
Linux_TCP/
├── docs/fix-commit-analysis.md          # 수정 전후 코드 경로 분석 (레이스 시나리오 A/B)
├── detector/
│   ├── tcpopt_syn_detector.py           # 수동 네트워크 감지기 (SYN+IP옵션, 재전송 레이트)
│   └── cve-2026-98432-host-check.sh     # 호스트 패치 상태/MPTCP/리스너 점검
├── reproducer/
│   └── tcp_race_reproducer.py           # 검증용 트래픽 리프로듀서 (탐지 검증·패치 검증)
├── lab/
│   ├── 01-build-kernel.sh               # 취약/수정 커널 빌드 (KASAN)
│   ├── 02-build-initramfs.sh            # 정적 init + TCP 리스너 → initramfs
│   ├── 03-boot-qemu.sh                  # QEMU 부팅 (hostfwd 4444)
│   └── README.md                        # 런북
└── ids/
    ├── suricata.rules                   # Suricata 6/7 시그니처
    ├── snort3.rules                     # Snort 3 시그니처
    └── detect-tcpopt.zeek               # Zeek 스크립트 (NOTICE 기반)
```

## 사용법

### 1. 네트워크 감지기 (Linux, root 또는 CAP_NET_RAW)

```bash
sudo python3 detector/tcpopt_syn_detector.py --iface eth0 --format json --log /var/log/tcpopt-syn.jsonl
# 사전 검증(로컬에서 원시 패킷 없이 파서 테스트):
python3 detector/tcpopt_syn_detector.py --selftest
```

주요 옵션: `--window 10`(집계 창), `--rto-min 0.2`(레이스 유도 판정 재전송 간격),
`--threshold 3`(소스별 probe 임계).

이벤트:

| event | 의미 |
|---|---|
| `syn_ipopt` | 옵션 부착 SYN 관찰 (info) |
| `syn_ipopt_probe` | 동일 소스에서 창 내 N회 이상 (medium) |
| `race_grooming` | 동일 4-tuple 동일 seq 재전송이 RTO(1초)보다 훨씬 짧음 (high) |

### 2. 호스트 점검

```bash
sudo bash detector/cve-2026-98432-host-check.sh
# exit 0 = 패치됨/비영향, 2 = 취약, 3 = 판정 불가
```

커널 버전은 업스트림 수정 매핑(5.10.272 / 5.15.223 / 6.1.190 / 6.6.159 /
6.12.113 / 6.18.56 / 7.2.10 / 7.3)과 비교합니다. Ubuntu/RHEL 계열은 백포트
번호 체계가 달라 UNKNOWN으로 판정하고 벤더 권고 확인을 안내합니다.

### 3. IDS/NSM

- Suricata: `suricata.rules`를 rules 디렉터리에 추가. `$HOME_NET`은 환경에 맞게 수정.
- Snort 3: `snort3.rules` 사용. Snort 3는 룰 인라인 `threshold` 미지원이므로
  burst 억제는 local.lua의 `rate_filter`로 설정.
- Zeek: `zeek -C local.zeek ids/detect-tcpopt.zeek` 또는 site/local.zeek에서
  `@load /path/to/detect-tcpopt.zeek`.

## 검증 (리프로듀서 + QEMU 랩)

리프로듀서는 익스플로잇이 **아니라** 공격 전제 패턴(옵션 부착 SYN, 고빈도
재전송, 핸드셰이크 완료 직후 파괴)만 재현하는 검증 도구입니다. 탐지 도구
발화 검증과 패치 효과 검증(KASAN)에만 사용합니다.

```bash
# 탐지 도구 발화 검증 (로컬 루프백)
sudo python3 detector/tcpopt_syn_detector.py --iface lo &
python3 -m http.server 4444 &
sudo python3 reproducer/tcp_race_reproducer.py --target 127.0.0.1:4444 --mode smoke --count 5
sudo python3 reproducer/tcp_race_reproducer.py --target 127.0.0.1:4444 --mode groom --retx 8

# 패치 검증 (격리 VM에서만): lab/README.md 런북 참조
cd lab && ./01-build-kernel.sh both && ./02-build-initramfs.sh
./03-boot-qemu.sh vuln     # + reproducer --mode race --confirm-lab ISOLATED-LAB-ONLY
./03-boot-qemu.sh fixed    # 동일 재현 → KASAN 보고 없음 확인
```

- `--mode smoke`: 옵션 부착 SYN 발송 (S1 검증, 안전)
- `--mode groom`: 동일 seq SYN 고빈도 재전송 (S2/race_grooming 검증, 안전)
- `--mode race`: 레이스 창 유도 (미패치 커널 크래시 가능 → 격리 VM 전용,
  `--confirm-lab ISOLATED-LAB-ONLY` 필수)

## 탐지 한계 (알고리즘 성질)

- IP 옵션은 TLS로도 암호화되지 않으므로 암호화된 서비스에도 적용 가능.
- **오탐 요인**: 레거시 라우터/부하분산 장비의 RR·TS 옵션, 일부 헬스체커,
  일부 네트워크 장비의 프라이빗 옵션. 스테이징에서 임계값 튜닝 후 적용 권장.
- 미러링/SPAN 환경에서는 SYNACK 방향(S4 시그널: 비정형 옵션 echo) 검증을
  병행할 수 있으나, 본 도구는 인바운드 SYN 방향만 판정.
- 이 도구들은 공격 시도의 조기 경보용이며, 레이스 성공 여부(메모리 유출)는
  호스트 커널 로그(KASAN/oops)와 대조해야 함.

## 참고

- 수정 커밋: https://git.kernel.org/torvalds/c/e3f33b0a1d89d738e2b913dab519226eaf76e15b
- CVE 레코드: https://www.cve.org/CVERecord?id=CVE-2026-98432
- CTI 리포트: 상위 디렉터리 `CTI-2026-1030-TCP_KR.md`
