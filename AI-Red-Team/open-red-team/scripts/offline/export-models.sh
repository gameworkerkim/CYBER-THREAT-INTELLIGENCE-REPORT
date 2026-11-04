#!/usr/bin/env bash
# Layer 1 — offline model weight transfer (internet zone)
#
# Downloads open-weight LLMs in Hugging Face format (vLLM-ready) and/or
# exports an Ollama model store, for transfer into the isolated network.
#
# Usage:
#   MODEL_ID=Qwen/Qwen2.5-32B-Instruct ./export-models.sh     # HF format (vLLM)
#   MODE=ollama OLLAMA_MODEL=qwen2.5:32b ./export-models.sh   # Ollama store
#   OUT_DIR=/data/artifacts/models ./export-models.sh
set -euo pipefail

OUT_DIR="${OUT_DIR:-./artifacts/models}"
MODE="${MODE:-hf}"
MODEL_ID="${MODEL_ID:-Qwen/Qwen2.5-32B-Instruct}"
OLLAMA_MODEL="${OLLAMA_MODEL:-qwen2.5:32b}"
HF_TOKEN="${HF_TOKEN:-}"

mkdir -p "$OUT_DIR"

if [ "$MODE" = "ollama" ]; then
  echo "==> pulling Ollama model $OLLAMA_MODEL"
  docker run --rm -v ollama-export:/root/.ollama ollama/ollama pull "$OLLAMA_MODEL"
  echo "==> exporting Ollama store"
  docker run --rm -v ollama-export:/root/.ollama -v "$OUT_DIR":/out alpine \
    tar -czf /out/ollama-store.tar.gz -C /root/.ollama .
  docker volume rm ollama-export || true
  echo "done: $OUT_DIR/ollama-store.tar.gz"
  exit 0
fi

if command -v huggingface-cli >/dev/null 2>&1; then
  huggingface-cli download "$MODEL_ID" --local-dir "$OUT_DIR/$MODEL_ID"
elif [ -n "$HF_TOKEN" ]; then
  docker run --rm -e HUGGING_FACE_HUB_TOKEN="$HF_TOKEN" \
    -v "$OUT_DIR:/out" huggingface/transformers-downloader:latest \
    "$MODEL_ID" --local-dir "/out/$MODEL_ID"
else
  echo "error: huggingface-cli not found. install: pip install -U huggingface_hub"
  exit 1
fi

echo "==> archiving $MODEL_ID"
tar -czf "$OUT_DIR/$(echo "$MODEL_ID" | tr '/' '__').tar.gz" -C "$OUT_DIR" "$MODEL_ID"
echo "done: $OUT_DIR/$(echo "$MODEL_ID" | tr '/' '__').tar.gz"
