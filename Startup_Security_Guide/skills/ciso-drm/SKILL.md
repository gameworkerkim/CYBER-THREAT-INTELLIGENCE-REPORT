---
name: ciso-drm
description: >-
  Assess document DRM, classification, Drive IRM, source-code repo protection,
  and offboarding account revocation. Use when the user mentions DRM, document
  classification, IRM, GitHub private repos, or employee offboarding.
---

# CISO DRM

## Instructions

1. Apply [ciso-core](../ciso-core/SKILL.md).
2. SKIL: `node ../../skil/query.mjs --domain drm` or [reference.md](reference.md).
3. Tie offboarding to `playbook:offboarding`.

## Multi-LLM

Paste [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md); attach `skil/controls/drm.json`.
