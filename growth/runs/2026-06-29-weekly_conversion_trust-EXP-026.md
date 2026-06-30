# Run log — weekly_conversion_trust · EXP-026

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-026 — Beles FAQ: longevity without guarantees  
**Branch:** cursor/growth-conversion-surfaces-728b  
**Loop type:** conversion_copy (Objection-to-Trust)

## Hypothesis

If we add a Beles FAQ answer on longevity with observed studio wear figures and an explicit non-guarantee disclaimer, then high-intent visitors hesitating on performance will proceed to the restock list, because longevity is a top objection and honest framing builds trust without overpromising.

## Changes

- `beles.html` — FAQ `<dl>` entry + FAQPage JSON-LD for "How long does Beles last on skin?"
- Links to `/wear` fragrance care guide for application context

## QA

```
npm run growth:qa — PASS
```

## Scoring

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 1 |
| technical_quality | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 1 |
| **qualified_growth_score** | **14** |

**Decision:** keep

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-026-ai-review.md`
- Verdict: pass_with_notes (Bugbot unavailable; manual checklist clean)

## Monitor

- Restock form starts/submits on `/beles` over 14d
- GSC impressions for longevity-related queries on `/beles`

## Lock footer

- Lock cleared: 2026-06-29
