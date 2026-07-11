---
name: ciso-kisa
description: >-
  Assess Korean PIPA/KISA compliance: CPO appointment, privacy policy, encryption
  standards, access logs, stage-gate, and GDPR/CCPA gap analysis for foreign
  startups entering Korea. Use when the user mentions KISA, PIPA, 개인정보보호법,
  CPO, 처리방침, or Korea market entry compliance.
---

# CISO KISA / PIPA

## Instructions

1. Apply [ciso-core](../ciso-core/SKILL.md).
2. SKIL policies: `policy:pipa-29`, `policy:pipa-30`, `policy:pipa-31`, KISA safety policies.
3. For US/EU companies: also apply `policy:gap-gdpr-to-pipa-cpo`, `policy:gap-ccpa-to-pipa-encryption`.
4. Never invent article numbers — lookup via `node ../../skil/query.mjs policy:pipa-29`.

## Multi-LLM

Paste [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md); attach `skil/policies/pipa.json` and `skil/controls/stage-gate.json`.
