# Run log — EXP-005

**Date:** 2026-06-29
**Automation:** manual_next_best_experiment
**Experiment:** EXP-005 — Beles restock form trust microcopy
**Loop:** conversion_copy
**Branch:** growth/conversion_copy-exp-005-beles-restock-trust-microcopy

## Hypothesis

If we add explicit trust microcopy above the Beles restock form (one email, no charge, privacy, size-as-interest-only), then qualified visitors complete signup at a higher rate, because price and availability objections are answered before submit.

## Changed files

- beles.html — trust block, consent, caption, FAQ, schema
- site.css, site.min.css — `.shop__restock-trust` styles
- script.js, script.min.js — Beles success message, consent notice version bump

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-manual_next_best_experiment-EXP-005-ai-review.md

## QGS: 15 — keep

## Measure

Compare `restock_form_started` → `restock_form_submitted` on `/beles#waitlist` over 14d vs prior baseline.
