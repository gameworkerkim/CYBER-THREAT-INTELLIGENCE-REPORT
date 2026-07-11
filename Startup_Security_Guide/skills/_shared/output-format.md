# Finding output format

Return assessments in this structure (Markdown + JSON block when possible):

## Summary
One paragraph + overall score 0–100 and grade A–F.

## Findings

For each finding:

```json
{
  "id": "F-001",
  "severity": "CRITICAL",
  "title": "...",
  "description": "...",
  "impact": "...",
  "remediation": "...",
  "legalBasis": "policy:pipa-29",
  "domain": "cloud",
  "skilRefs": ["control:aws-iam-mfa"],
  "effort": "low"
}
```

## Roadmap
Top 3–5 actions with timeframe: immediate | short-term | mid-term | long-term.

## Compliant
List what already looks OK.
