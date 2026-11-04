# Uncensored Open-Weight Models — Local AI Red Team Lab Guide

**Languages:** English (base) · [한국어](ko/uncensored-models.md) · [日本語](ja/uncensored-models.md) · [中文](zh/uncensored-models.md)

> ## WARNING— READ BEFORE USE
>
> Web-based LLMs are heavily censored, and local LLMs (Gemma, Qwen, …) ship with default safety
> alignment. Both constrain AI red-team testing. This guide combines **LM Studio** with
> **uncensored GGUF quantized models** from Hugging Face to test models without restrictions
> in a **local environment**.
>
> - Uncensored models are a **double-edged sword**: useful for red teams, but equally capable of
>   helping malicious actors. Run **all tests in an isolated, offline local environment** and make
>   sure generated artifacts never leave it.
> - **Authorized scope only.** Every test must happen within a pre-authorized engagement scope
>   and comply with applicable law and your organization's security policy.
> - **Extreme quantization trades accuracy**: Q2_K is fast but lossy; prefer Q4_K_M or better
>   for precise vulnerability analysis or code generation.

---

## 1. Install LM Studio

1. **Download and install**
   - Get the installer for your OS from the official site: <https://lmstudio.ai/>

2. **Change the model storage directory (important)**
   - LM Studio stores models on the system drive by default, which can run out of space.
     Change the directory **before** downloading large GGUF files.
   - **GUI**: LM Studio →  **Settings** (bottom left) → **Models Directory** → **Change / Browse**
     → create a folder on a drive with enough free space → **restart**.
   - **Note**: if models are already downloaded, move the files into the new folder first,
     then change the path.

## 2. Download uncensored GGUF models

1. **Hugging Face model page**
   - A collection of **uncensored (Heretic/Uncensored)** Qwen-based quantized models,
     with variants optimized for ≤ 16 GB VRAM:
   - **URL**: `https://huggingface.co/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/tree/main`

2. **Pick a quantization for your VRAM** (Files and versions tab)

   | Quant | Size | VRAM | Notes |
   |-------|------|------|-------|
   | **Q2_K** (2-bit) | ~3 GB | 4–8 GB (RTX 3050/4050, …) | Fastest, but ~80–85 % quality; errors possible in code/math |
   | **Q4_K_M** (4-bit) | ~5 GB | 8 GB | **Best balance** (~95–97 % quality) — recommended for most red-team work |
   | **Q8_0** (8-bit) | ~8 GB | 12 GB+ | Near-lossless (99 %+) |

3. **Place the model file**
   - Move the downloaded `.gguf` into the folder from step 1 using LM Studio's expected layout:
     `models_dir/publisher/model_name/model_file.gguf`
   - **Example**:
     `aaa/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/Qwen3.8-9B-Distill-uncensored-heretic.Q2_K.gguf`

## 3. Load the model and run tests

1. Restart LM Studio → **Chat** tab → select the downloaded model from the dropdown above the input box.
2. The model loads into VRAM automatically; chat becomes available once loaded.
   (On an RTX 4090, Q2_K reaches roughly 300 tokens/sec.)
3. Apply red-team prompts — uncensored models follow instructions without safety refusals,
   enabling analysis of policy/security scenarios, vulnerability analysis, and attack-scenario
   generation **within the authorized lab scope only**.

## 4. Vision (VLM) — optional

To use vision-language models with image input you also need the `mmproj` file:

1. Download `Qwen3.8-9B-Distill-uncensored-heretic.mmproj-Q8_0.gguf` (~624 MB) from the model page.
2. Rename it with an `mmproj-` prefix (e.g. `mmproj-Qwen3.8-…mmproj-Q8_0.gguf`).
3. Put it in the same folder as the main `.gguf` model file.

## 5. Connect Open AI Red Team to LM Studio

LM Studio exposes an **OpenAI-compatible API** on `http://localhost:1234/v1` — plug it straight
into the middleware's `openweight` provider:

```bash
OPENWEIGHT_BASE_URL=http://localhost:1234/v1 \
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF \
OPENWEIGHT_API_KEY=lm-studio \
node dist/src/cli.js chat --provider openweight
```

Env form (`.env`):

```dotenv
ORT_PROVIDER=openweight
OPENWEIGHT_BASE_URL=http://localhost:1234/v1
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF
OPENWEIGHT_API_KEY=lm-studio
# smaller models → tighten the budget
ORT_MAX_CONTEXT=32768
ORT_SKILL_BUDGET=6000
```

> Note: quantized models reproduce detailed payloads less reliably — set
> `ORT_MAX_SKILLS=1` and `ORT_INCLUDE_INDEX=off` for ≤ 14B models (see
> [Model Matrix](../model-matrix.md)).

## 6. Precautions — repeat 

- **Isolation**: run every test in an isolated, offline local environment; manage outputs so
  nothing leaks outside.
- **Quantization trade-off**: Q2_K prioritizes speed/VRAM at a large accuracy cost. For precise
  vulnerability analysis or code generation use Q4_K_M or better if VRAM allows.
- **Legal & ethical responsibility**: all testing with uncensored models must stay inside a
  **pre-authorized scope** and comply with applicable law and organizational security policy.

## Summary

| Step | Task | Note |
|:-----|:-----|:-----|
| **1. Install** | Install LM Studio, move the models directory to a large drive | `Settings → Models Directory` |
| **2. Download** | Get the uncensored GGUF (Q2_K / Q4_K_M, …) matching your VRAM from Hugging Face | Q2_K: 4–8 GB VRAM, Q4_K_M: 8 GB VRAM recommended |
| **3. Place** | `models_dir/publisher/model/file.gguf` layout | LM Studio recognition requires it |
| **4. Run** | Select the model in the Chat tab and run red-team prompts | add `mmproj` file for vision |
| **5. Integrate** | Point the `openweight` provider at `http://localhost:1234/v1` | OpenAI-compatible, no adapter needed |
