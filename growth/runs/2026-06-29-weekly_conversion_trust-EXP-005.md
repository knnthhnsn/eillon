# Run log — EXP-005 · weekly_conversion_trust

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust (cron */30)  
**Branch:** cursor/conversion-trust-points-2357  
**Loop:** conversion_copy · Objection-to-Trust

## Hypothesis

If we add visible pre-form trust microcopy on `/beles#waitlist`, then restock-intent visitors will submit with clearer expectations, because the existing caption was hidden on desktop (`display: none`) and consent referenced copy that was not visible above the form.

## Change

- Added `.shop__form-trust` block before waitlist form with lede + three trust points
- Removed hidden `#shopCtaCaption` from Beles waitlist section
- Self-contained consent copy (no "described above" dependency)
- Dark-band color tokens for trust points in `site.css`
- Submit button `aria-describedby` → `#shopFormTrust`

## Files

- `beles.html`
- `styles.css`, `styles.min.css`
- `site.css`, `site.min.css`

## QA

```
npm run growth:qa — PASS
```

## Score

```
npm run growth:score -- --intent 3 --brand 3 --conversion 3 --discoverability 1 --measurement 2 --technical 3 --complexity 0 --risk 0
qualified_growth_score = 15
```

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-005-ai-review.md`
- Verdict: pass_with_notes (Bugbot unavailable)

## Decision

**keep** — QGS 15, brand_risk 0, addresses documented trust gap on primary conversion surface.

## Lock footer

Lock cleared in `growth/state.json` at run end.
