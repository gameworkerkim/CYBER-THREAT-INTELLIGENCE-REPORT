#!/usr/bin/env bash
# 01-build-kernel.sh - CVE-2026-98432 검증랩: 취약/수정 커널 빌드 (KASAN 포함)
#
# usage: 01-build-kernel.sh [vuln|fixed|both]
# 결과물: build/bzImage-vuln, build/bzImage-fixed (+ .config 사본)
#
# 전제: 리눅스 빌드 도구(gcc, make, bison, flex, bc, libelf-dev, openssl dev)
# 빌드 시간: 커널당 30~90분. 저장 공간: ~10GB/커널.

set -euo pipefail

LAB=$(cd "$(dirname "$0")" && pwd)
OUT=${LAB}/build
SRC=${OUT}/linux.git

FIXED_COMMIT=e3f33b0a1d89d738e2b913dab519226eaf76e15b
VULN_COMMIT=fe4114221364899ab33c3f9574da6b108d3fa79e

MODE=${1:-both}
case "$MODE" in vuln|fixed|both) ;; *) echo "usage: $0 [vuln|fixed|both]" >&2; exit 1 ;; esac

command -v git gcc make bison flex bc >/dev/null || { echo "missing build tools" >&2; exit 1; }
JOBS=$(nproc 2>/dev/null || echo 4)

mkdir -p "$OUT"

if [ ! -d "$SRC/.git" ]; then
    git clone --filter=blob:none --no-checkout \
        https://github.com/torvalds/linux.git "$SRC"
fi
git -C "$SRC" fetch --depth 1 origin "$FIXED_COMMIT" "$VULN_COMMIT"

build_one() {
    local label=$1 commit=$2
    local dir=$OUT/linux-$label
    echo "=== building $label ($commit) ==="
    rm -rf "$dir"
    mkdir -p "$dir"
    git -C "$SRC" --work-tree="$dir" checkout "$commit" -- .
    (
        cd "$dir"
        make defconfig
        ./scripts/config \
            --enable KASAN --enable KASAN_GENERIC --enable KASAN_INLINE \
            --disable MODULES \
            --enable DEVTMPFS --enable DEVTMPFS_MOUNT \
            --enable BLK_DEV_INITRD --enable RD_GZIP \
            --enable PACKET --enable UNIX --enable INET --enable MPTCP \
            --enable SERIAL_8250_CONSOLE --enable KALLSYMS \
            --set-str LOCALVERSION "-cti2026-$label"
        make olddefconfig
        make -j"$JOBS" bzImage
    )
    cp "$dir/.config" "$OUT/config-$label"
    cp "$dir/arch/x86/boot/bzImage" "$OUT/bzImage-$label"
    echo "=== $label done -> $OUT/bzImage-$label ==="
}

[ "$MODE" = vuln ] || [ "$MODE" = both ] && build_one vuln "$VULN_COMMIT"
[ "$MODE" = fixed ] || [ "$MODE" = both ] && build_one fixed "$FIXED_COMMIT"

echo "KASAN 확인: grep CONFIG_KASAN=y $OUT/config-*"
