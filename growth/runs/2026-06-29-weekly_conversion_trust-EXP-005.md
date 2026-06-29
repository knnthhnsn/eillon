# Run log — EXP-005

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-005 — Beles restock form trust microcopy  
**Branch:** cursor/conversion-trust-points-1594  
**Loop:** conversion_copy (Objection-to-Trust)

## Hypothesis

If we surface calm trust microcopy above the Beles restock form (no charge today, private restock note, size interest only), then first-time visitors hesitant about sample-first buying will submit the form, because clear expectations reduce signup friction without fake urgency.

## Changes

- `beles.html` — `.shop__form-trust` block before waitlist fields; removed hidden caption
- `styles.css` — trust block typography matching chapter patterns
- `site.css` — dark-band color overrides for trust list
- Built `styles.min.css`, `site.min.css`

## QA

```
npm run growth:qa — PASS
```

## Score

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 1 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |
| **QGS** | **14** |

## AI hard review

`growth/runs/2026-06-29-weekly_conversion_trust-EXP-005-ai-review.md` — pass_with_notes (Bugbot unavailable)

## Lock footer

- lock_status: unlocked
- active_experiment_id: null
- last_successful_loop: EXP-005
