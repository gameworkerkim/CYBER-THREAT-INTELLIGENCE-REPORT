#!/usr/bin/env bash
# Layer 2 — vulnerability scan + SBOM generation (Trivy)
#
# Scans a container image for CVEs (OS packages, language deps, IaC, secrets)
# and emits an SBOM (SPDX / CycloneDX) for supply-chain compliance.
#
# Usage:
#   ./scan.sh IMAGE[:TAG] [OUT_DIR]
#   IMAGE=open-ai-red-team:latest OUT=artifacts/sbom ./scan.sh
# Env:
#   EXIT_ON=HIGH,CRITICAL   # fail when findings at/above this severity
#   SKIP_PUSH=0             # set 0 to only scan pushed images (registry mode)
set -euo pipefail

IMAGE="${1:-${IMAGE:-open-ai-red-team:latest}}"
OUT="${2:-${OUT:-artifacts/sbom}}"
EXIT_ON="${EXIT_ON:-HIGH,CRITICAL}"

mkdir -p "$OUT"
base=$(echo "$IMAGE" | tr '/:' '__')

run_trivy() {
  if command -v trivy >/dev/null 2>&1; then
    trivy "$@"
  else
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
      -v "$(pwd)/$OUT":/out aquasec/trivy "$@"
  fi
}

echo "==> scanning $IMAGE (fail on $EXIT_ON)"
run_trivy image --severity "$EXIT_ON" --exit-code 1 --ignore-unfixed \
  --no-progress "$IMAGE"

echo "==> generating SBOM (SPDX + CycloneDX)"
run_trivy image --format spdx-json  --output "/out/$base.spdx.json"  --no-progress "$IMAGE"
run_trivy image --format cyclonedx  --output "/out/$base.cyclonedx.json" --no-progress "$IMAGE"

echo "done: $OUT/$base.{spdx,cyclonedx}.json"
