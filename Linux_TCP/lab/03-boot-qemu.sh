#!/usr/bin/env bash
# 03-boot-qemu.sh - 취약/수정 커널을 QEMU로 부팅 (콘솔은 build/console-<label>.log)
#
# usage: 03-boot-qemu.sh <vuln|fixed>
# 종료: qemu 창에서 Ctrl-A X
set -euo pipefail

LAB=$(cd "$(dirname "$0")" && pwd)
OUT=${LAB}/build

T=${1:?usage: 03-boot-qemu.sh <vuln|fixed>}
case "$T" in vuln|fixed) ;; *) echo "usage: $0 <vuln|fixed>" >&2; exit 1 ;; esac

QEMU=$(command -v qemu-system-x86_64 || true)
[ -n "$QEMU" ] || { echo "qemu-system-x86_64 not found" >&2; exit 1; }

[ -f "$OUT/bzImage-$T" ] || { echo "run 01-build-kernel.sh first" >&2; exit 1; }
[ -f "$OUT/initramfs.cpio.gz" ] || { echo "run 02-build-initramfs.sh first" >&2; exit 1; }

KVM=""
[ -e /dev/kvm ] && [ -r /dev/kvm ] && KVM="-enable-kvm"

exec "$QEMU" $KVM \
    -m 2G -smp 4 \
    -nographic -no-reboot \
    -kernel "$OUT/bzImage-$T" \
    -initrd "$OUT/initramfs.cpio.gz" \
    -append "console=ttyS0 nokaslr kasan_multi_shot" \
    -netdev user,id=n0,hostfwd=tcp::4444-:4444 \
    -device virtio-net-pci,netdev=n0 \
    2>&1 | tee "$OUT/console-$T.log"
