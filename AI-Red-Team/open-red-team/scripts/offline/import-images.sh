#!/usr/bin/env bash
# Layer 1 — offline image import (isolated / internal network)
#
# Loads tar archives exported by export-images.sh into the local Docker
# daemon and optionally pushes them into the internal Harbor registry.
#
# Usage:
#   IN_DIR=/data/artifacts/images ./import-images.sh
#   HARBOR=harbor.internal.example.com/repo ./import-images.sh   # also push to Harbor
set -euo pipefail

IN_DIR="${IN_DIR:-./artifacts/images}"
HARBOR="${HARBOR:-}"

[ -d "$IN_DIR" ] || { echo "error: $IN_DIR not found"; exit 1; }

for archive in "$IN_DIR"/*.tar; do
  [ -e "$archive" ] || continue
  echo "==> loading $archive"
  if command -v skopeo >/dev/null 2>&1; then
    # load into the daemon without `docker load`
    tag=$(skopeo inspect --format '{{.Name}}:{{.Tag}}' "docker-archive:$archive")
    skopeo copy "docker-archive:$archive" "docker-daemon:$tag"
  else
    docker load -i "$archive"
  fi
done

if [ -n "$HARBOR" ]; then
  for archive in "$IN_DIR"/*.tar; do
    [ -e "$archive" ] || continue
    tag=$(skopeo inspect --format '{{.Name}}:{{.Tag}}' "docker-archive:$archive" 2>/dev/null || echo "")
    [ -z "$tag" ] && continue
    echo "==> pushing $tag -> $HARBOR"
    skopeo copy --dest-tls-verify=false "docker-archive:$archive" "docker://$HARBOR/$(basename "$tag" | tr ':' '/')"
  done
fi

echo "done."
