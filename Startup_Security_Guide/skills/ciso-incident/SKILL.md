---
name: ciso-incident
description: >-
  Run startup incident response playbooks: phishing/BEC, ransomware, personal
  data breach (Korea notification), and offboarding. Use when the user reports
  a security incident, breach, ransomware, phishing click, or urgent IR help.
---

# CISO Incident Response

## Instructions

1. Apply [ciso-core](../ciso-core/SKILL.md). Stay calm, ordered, SLA-oriented.
2. Match trigger → playbook via [reference.md](reference.md) or `node ../../skil/query.mjs --kind playbook`.
3. For personal data breach, include Korea reporting notes from `playbook:personal-data-breach`.
4. Do not claim to notify regulators for the user — provide checklist and urge legal/CPO action.

## Multi-LLM

Paste [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md); attach `skil/playbooks/incident.json`.
