---
name: ciso-workspace
description: >-
  Assess Google Workspace security: 2SV, admin roles, Drive external sharing,
  SPF/DKIM/DMARC, OAuth third-party apps. Use when the user mentions Gmail,
  Google Workspace, Drive sharing, or BEC/email auth.
---

# CISO Workspace

## Instructions

1. Apply [ciso-core](../ciso-core/SKILL.md).
2. SKIL: `node ../../skil/query.mjs --domain workspace` or [reference.md](reference.md).
3. Priority: 2SV enforce → admin minimize → external sharing → email auth → OAuth audit.

## Multi-LLM

Paste [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md); attach `skil/controls/workspace.json`.
