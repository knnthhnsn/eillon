# Run log — EXP-005

**Date:** 2026-06-29
**Automation:** growth_experiment_execution
**Experiment:** EXP-005 — Beles restock form trust microcopy
**Loop:** conversion_copy

## Hypothesis

If we add clearer trust microcopy near the Beles restock form explaining restock note expectations, size interest-only, and sample-first path, then hesitant visitors will submit at higher rates, because objections include sample-first hesitation and uncertainty about payment commitment.

## Changed files

- beles.html — trust block, consent, mobile caption, a11y
- script.js — success message + dynamic consent fallback
- styles.css, site.css — trust block styling (light + dark band)
- styles.min.css, site.min.css, script.min.js — rebuilt

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-growth_experiment_execution-EXP-005-ai-review.md

## QGS: 15 — keep

| Component | Score |
|---|---|
| intent | 3 |
| brand | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 2 |
| technical | 3 |
| complexity | 0 |
| risk | 0 |

## Measurement plan

Compare `restock_form_started` → `restock_form_submitted` rate on `/beles#waitlist` vs pre-change baseline in Vercel WA (7d signal, 30d decision).

## Lock footer

- lock_status cleared in state.json at run end
