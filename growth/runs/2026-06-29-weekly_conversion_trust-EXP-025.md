# Run log — weekly_conversion_trust · EXP-025

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-025 — Footer Letter promise trust microcopy  
**Branch:** cursor/conversion-trust-points-efb3  
**Loop type:** conversion_copy

## Hypothesis

If we add explicit trust microcopy above the footer Letter form (seasonal frequency, content scope, privacy), then homepage and editorial visitors will subscribe with less hesitation, because newsletter intent is clarified before submit — matching the EXP-005 Beles restock trust pattern.

## Changes

| File | Change |
|---|---|
| `index.html` | `.footer__letter-trust` block before form; consent after form |
| `scripts/site-nav.js` | Same trust block in editorial footer template |
| `styles.css` | Base `.footer__letter-trust` styles (light footer fallback) |
| `home.css` | Dark homepage footer overrides |
| `site.css` | Editorial footer dark overrides |
| `*.min.css` | Rebuilt via `npm run build` |

## Scoring

- QGS: **15** (intent 3, brand 3, conversion 3, discoverability 1, measurement 2, technical 3, complexity 0, risk 0)
- Verdict: **keep**
- AI review: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-025-ai-review.md` — pass_with_notes

## QA

```
npm run growth:qa — PASSED
```

## Monitor

- Footer newsletter `waitlist_form_started` → `waitlist_form_submitted` ratio (source=footer) over 14d
- Compare to Beles restock trust lift from EXP-005

## Lock footer

- Lock cleared; `active_experiment_id` reset to null
