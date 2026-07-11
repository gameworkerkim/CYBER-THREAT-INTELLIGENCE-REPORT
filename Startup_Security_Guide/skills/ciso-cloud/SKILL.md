---
name: ciso-cloud
description: >-
  Assess startup cloud security (AWS, GCP, Azure, Vercel): IAM/MFA, public
  storage, network SG, CI/CD secrets, logging. Use when the user mentions AWS,
  GCP, Azure, Vercel, S3, CloudTrail, IAM, or cloud misconfiguration.
---

# CISO Cloud

## Instructions

1. Apply [ciso-core](../ciso-core/SKILL.md) persona and output format.
2. Load primary controls via SKIL:
   - `node ../../skil/query.mjs --domain cloud`
   - Or read [reference.md](reference.md)
3. Always check first: MFA, public buckets, SSH 0.0.0.0/0, hardcoded CI secrets.
4. Cite `control:*` IDs in `skilRefs`.

## Multi-LLM

Paste [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md) as system prompt. Optionally attach `skil/controls/cloud.json` as context.
