#!/usr/bin/env bash
# Layer 2 — image signing & verification (Cosign / Sigstore)
#
# Signs images with a key pair so Harbor can block unsigned images,
# guaranteeing immutable, verifiable artifacts inside the network.
#
# Usage:
#   ./sign.sh IMAGE[:TAG]                    # sign (creates cosign.key if missing)
#   ./sign.sh IMAGE[:TAG] --verify           # verify against cosign.pub
# Env:
#   COSIGN_PASSWORD=...                      # key passphrase
#   COSIGN_EXPERIMENTAL=1                    # enable keyless mode (optional)
set -euo pipefail

IMAGE="${1:?usage: sign.sh IMAGE[:TAG] [--verify]}"
VERIFY="${2:-}"

run_cosign() {
  if command -v cosign >/dev/null 2>&1; then
    cosign "$@"
  else
    docker run --rm -e COSIGN_PASSWORD -v "$(pwd)":/work -w /work \
      gcr.io/projectsigstore/cosign "$@"
  fi
}

if [ "$VERIFY" = "--verify" ]; then
  echo "==> verifying $IMAGE"
  run_cosign verify --key cosign.pub "$IMAGE"
  echo "verification OK."
  exit 0
fi

[ -f cosign.key ] || run_cosign generate-key-pair
echo "==> signing $IMAGE"
run_cosign sign --key cosign.key "$IMAGE"
echo "signed."
