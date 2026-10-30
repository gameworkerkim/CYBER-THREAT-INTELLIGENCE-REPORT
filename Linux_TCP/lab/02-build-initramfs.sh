#!/usr/bin/env bash
# 02-build-initramfs.sh - 검증랩용 최소 initramfs 빌드 (정적 init + TCP 리스너)
set -euo pipefail

LAB=$(cd "$(dirname "$0")" && pwd)
OUT=${LAB}/build
ROOT=${OUT}/initramfs-root

mkdir -p "$ROOT/proc" "$ROOT/sys" "$ROOT/dev"

if ! gcc -static -O2 -o "$ROOT/init" "$LAB/init.c" 2>"$OUT/init-gcc.log"; then
    cat "$OUT/init-gcc.log" >&2
    echo "static 빌드 실패: glibc-static (Debian/Ubuntu) 또는 gcc-static 설치 필요" >&2
    exit 1
fi

( cd "$ROOT" && find . | cpio -o -H newc 2>/dev/null | gzip > "$OUT/initramfs.cpio.gz" )
echo "initramfs: $OUT/initramfs.cpio.gz"
