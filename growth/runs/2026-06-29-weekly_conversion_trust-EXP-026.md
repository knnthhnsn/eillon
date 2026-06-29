# Run log — EXP-026

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-026 — Beles FAQ: longevity without guarantees  
**Branch:** cursor/conversion-trust-points-c571  
**Loop type:** objection_to_trust

## Hypothesis

If we add an explicit longevity FAQ on Beles (observed studio wear hours, no universal guarantee), then restock-intent visitors hesitating on performance will complete signup because the objection is answered in the FAQ block before submit.

## Changes

- `beles.html` — FAQ `<dl>` item + JSON-LD `FAQPage` question for skin longevity

## Scoring

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 1 |
| technical_quality | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **QGS** | **14** |

## QA

- `npm run growth:qa` — pass (after `npm ci`)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-026-ai-review.md`
- Verdict: pass_with_notes (Bugbot unavailable; manual checklist)

## Decision

**keep** — QGS 14, brand_risk 0, QA green.

## Monitor

- Restock form started → submitted rate on `/beles` (14d)
- FAQ expand interactions if instrumented later

## Lock footer

`growth/state.json` lock cleared at run end.
