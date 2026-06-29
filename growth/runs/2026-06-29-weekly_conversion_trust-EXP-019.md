# Run log — EXP-019

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-019 — Shipping page → Beles restock link  
**Branch:** cursor/conversion-trust-points-9420  
**Loop type:** internal_linking

## Hypothesis

If we add a Beles restock trust block and CTA on the shipping FAQ page, then visitors researching delivery policy will join the waitlist, because shipping questions often occur late in the consideration funnel when purchase intent is forming.

## Changes

| File | Change |
|---|---|
| `shipping.html` | Restock trust section, FAQ schema Q&A, `beles_cta_click` + proof section |
| `site.css` / `site.min.css` | `.shipping-restock` layout and trust list styling |
| `growth/state.json` | Run lock (cleared below) |

## Scoring

```
intent 2 · brand 3 · conversion 3 · discoverability 1 · measurement 2 · technical 3
complexity 0 · brand_risk 0 → QGS 14 (keep)
```

## QA

- `npm run growth:qa` — pass

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-019-ai-review.md`
- Verdict: pass_with_notes (0 block findings)

## Measurement (14d)

- `beles_cta_click` where `label=shipping_faq`
- `proof_section_viewed` where `section=shipping_restock`
- Compare shipping page sessions → Beles waitlist submit rate vs prior baseline

## Lock footer

`state.json` lock cleared; `active_experiment_id` null; `last_successful_loop` → EXP-019.
