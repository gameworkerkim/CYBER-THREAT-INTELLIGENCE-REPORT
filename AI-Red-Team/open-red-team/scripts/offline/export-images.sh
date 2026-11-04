#!/usr/bin/env bash
# Layer 1 — offline image export (internet zone)
#
# Exports all images required by the stack into portable tar archives,
# so they can be security-scanned and carried into the isolated network
# (air-gapped / 망분리) without touching a container registry from inside.
#
# Usage:
#   IMAGES="a/b:c d/e:f" ./export-images.sh          # custom list
#   ./export-images.sh                               # default stack list
#   OUT_DIR=/data/artifacts/images ./export-images.sh
set -euo pipefail

OUT_DIR="${OUT_DIR:-./artifacts/images}"
IMAGES="${IMAGES:-$(
  cat <<'EOF'
node:22-alpine
vllm/vllm-openai:latest
ollama/ollama:latest
quay.io/keycloak/keycloak:26
postgres:16-alpine
ghcr.io/langfuse/langfuse:latest
prom/prometheus:latest
grafana/grafana:latest
EOF
)}"

mkdir -p "$OUT_DIR"

safe_name() { echo "$1" | tr '/:' '__'; }

for image in $IMAGES; do
  dest="$OUT_DIR/$(safe_name "$image").tar"
  echo "==> exporting $image -> $dest"
  if command -v skopeo >/dev/null 2>&1; then
    # skopeo: no Docker daemon required
    skopeo copy --retry-times 3 "docker://$image" "docker-archive:$dest:$image"
  elif command -v crane >/dev/null 2>&1; then
    crane pull "$image" "$dest"
  else
    docker pull "$image"
    docker save -o "$dest" "$image"
  fi
  echo "    sha256: $(shasum -a 256 "$dest" | awk '{print $1}')"
done

echo "done. transfer $OUT_DIR to the isolated network after AV/malware scan."
