# QEMU 패치 검증랩 — CVE-2026-98432

취약 커널(`e3f33b0a1d89^`)과 수정 커널(`e3f33b0a1d89`)을 각각 KASAN을 켜고
QEMU에서 부팅해, 리프로듀서 트래픽에 대한 커널 반응 차이(KASAN UAF 보고
유무)로 패치 효과를 검증하는 랩입니다. 탐지 도구 발화 검증에도 사용합니다.

**이 랩에서 만드는 것은 리프로듀서(트래픽 재현)이며, 코드 실행 익스플로잇이
아닙니다.** 리프로듀서는 핸드셰이크 완료+파괴와 SYN 재전송을 겹쳐 레이스
창을 두드릴 뿐, 메모리 유출·페이로드·권한 상승 기능이 없습니다.

## 사전 준비 (Debian/Ubuntu 기준)

```bash
sudo apt install -y git gcc make bison flex bc libelf-dev libssl-dev \
                    cpio qemu-system-x86 gcc-multilib
```

## 1. 빌드

```bash
# 취약+수정 커널 2개 빌드 (커널당 30~90분, ~10GB)
./01-build-kernel.sh both
# KASAN 활성 확인
grep CONFIG_KASAN=y build/config-*   # 두 파일 모두 존재해야 함

# initramfs (정적 TCP 리스너)
./02-build-initramfs.sh
```

## 2. 탐지 도구 발화 검증 (로컬 루프백, VM 불필요)

```bash
# 터미널 1: 리스너
python3 -m http.server 4444

# 터미널 2: 감지기 (lo 인터페이스)
sudo python3 ../detector/tcpopt_syn_detector.py --iface lo --format json

# 터미널 3: 리프로듀서
sudo python3 tcp_race_reproducer.py --target 127.0.0.1:4444 --mode smoke --count 5
sudo python3 tcp_race_reproducer.py --target 127.0.0.1:4444 --mode groom --retx 8
```

기대 결과:

- `smoke` → 감지기에 `syn_ipopt` (info) 이벤트 다수
- `groom` → `race_grooming` (high) 이벤트

## 3. 패치 검증 (QEMU)

```bash
# 수정 커널 부팅
./03-boot-qemu.sh fixed
# 다른 터미널에서:
sudo python3 ../reproducer/tcp_race_reproducer.py \
    --target 127.0.0.1:4444 --mode race \
    --iterations 200 --threads 8 \
    --confirm-lab ISOLATED-LAB-ONLY
```

수 분~수십 분 반복 후 `build/console-fixed.log`를 확인:

```
# 수정 커널: KASAN 보고가 절대 없어야 함 (grep 결과 없음)
grep -i "KASAN\|use-after-free" build/console-fixed.log   # → no output
```

```bash
# 취약 커널 부팅
./03-boot-qemu.sh vuln
# 동일한 리프로듀서 실행
```

취약 커널에서는 다음 형태의 보고가 **간헐적으로** 나타날 수 있습니다:

```
==================================================================
BUG: KASAN: use-after-free in ip_options_build+0x...
Read of size ...
Call Trace:
 ip_build_and_send_pkt
 tcp_v4_send_synack
 tcp_rtx_synack
 tcp_check_req
 ...
==================================================================
```

grep 확인:

```bash
grep -i "use-after-free" build/console-vuln.log
```

### 판정표

| 커널 | KASAN `use-after-free in ip_options_build` | 판정 |
|---|---|---|
| fixed | 없음 | 패치 유효 |
| vuln | (간헐적) 보고 | 취약성 재현 |

### 참고 사항

- **레이스 승률은 낮다.** 싱글 VM에서 수 분 내 보고를 보장하지 않는다.
  승률을 높이려면 `--threads` 증가, 리프로듀서 2~3개 동시 실행,
  `--iterations` 증가를 조합한다. (레이스에서 지면 연결 시도만 실패하므로
  반복은 무해하다.)
- 탐지 도구는 **취약/수정 커널 모두에서 동일하게 발화**한다. 판정 기준은
  KASAN 보고 유무이지 탐지 알람 유무가 아니다.
- KASAN은 오버헤드가 크다. 실제 프로덕션 커널과 타이밍이 다를 수 있으며,
  이는 취약성 판정(존재 여부)에만 영향이 있고 패치 판정에는 영향이 없다.
- `nokaslr`/`kasan_multi_shot`은 랩에서 주소 안정성·연속 보고를 위한 옵션이다.

## 4. 안전 규칙

- `--mode race`는 `--confirm-lab ISOLATED-LAB-ONLY` 없이는 실행되지 않는다.
- `--target`은 반드시 이 랩의 VM 또는 로컬 루프백이어야 한다.
- 미패치 프로덕션 호스트를 대상으로 하면 커널 크래시(DoS)를 유발할 수 있다.

## 파일 구성

```
lab/
├── 01-build-kernel.sh    # 취약/수정 커널 빌드 (KASAN)
├── 02-build-initramfs.sh # 정적 init + TCP 리스너 → initramfs
├── 03-boot-qemu.sh       # QEMU 부팅 (hostfwd 4444)
├── init.c                # pid 1 + 0.0.0.0:4444 리스너
└── README.md
```
