# Run log — EXP-008

**Date:** 2026-06-29
**Automation:** growth_experiment_execution (cron 40bf91e3)
**Experiment:** EXP-008 — Internal links: Journal → Beles → Restock
**Loop:** internal_linking
**Branch:** growth/internal_linking-exp-008-journal-beles-restock

## Hypothesis

If we add consistent Journal → Beles → restock internal links with analytics on every journal surface, then readers who arrive via smell-intent or composition articles will reach `/beles#waitlist` at higher rates, because the conversion path is explicit at index and article level without diluting editorial voice.

## Changed files

- journal.html — per-entry restock links, boutique dual path, manifesto restock line
- journal/fico-d-india.html — analytics on existing restock CTA
- journal/what-does-fico-d-india-smell-like.html — cross-link to bottle article
- journal/the-bottle.html — body link to Beles + fico-d-india; CTA to `#waitlist` with analytics
- journal/beles-batch-bl001.html — restock CTA block, smell-article cross-link
- growth/state.json — lock during run (cleared below)

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-growth_experiment_execution-EXP-008-ai-review.md

## QGS: 16 — keep

Intent 3 · Brand 3 · Conversion 3 · Discoverability 2 · Measurement 2 · Technical 3 · Complexity 0 · Risk 0

## Measure

Track `beles_cta_click` labels `journal_index_*` and `journal_*_article` in Vercel WA over 14d; compare journal landing → restock form starts vs prior baseline.

## Lock footer

`lock_status` cleared to `unlocked`; `active_experiment_id` null; `last_successful_loop` → EXP-008.
