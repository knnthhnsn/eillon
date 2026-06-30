# Run log — weekly_conversion_trust · EXP-014

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-014 — Beles size selector UX clarity  
**Branch:** cursor/conversion-trust-points-223e  
**Loop type:** conversion_copy

## Hypothesis

If we add explicit copy below the Beles size selector clarifying that format choice records interest only (not checkout), then first-time restock visitors will submit the waitlist form because sample-vs-bottle uncertainty is resolved before email entry.

## Changes

| File | Change |
|---|---|
| beles.html | Size caption, 2 ml sample label, FAQ + JSON-LD Q&A |
| shipping.html | `id="sample-credit"` anchor for inline link |
| styles.css / styles.min.css | `.shop__size-caption` styles |
| site.css / site.min.css | Dark-band caption + link colors |

## Scoring

```
npm run growth:score -- --intent 3 --brand 3 --conversion 3 --discoverability 1 --measurement 2 --technical 3 --complexity 0 --risk 0
→ QGS 15 (keep)
```

## QA

- `npm run growth:qa` — pass
- AI review: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-014-ai-review.md` — pass_with_notes

## Measurement (14d)

Monitor on `/beles`: `size_interest_selected` distribution vs `restock_form_started` → `restock_form_submitted` rate.

## Lock footer

`state.json` lock cleared at run end.
