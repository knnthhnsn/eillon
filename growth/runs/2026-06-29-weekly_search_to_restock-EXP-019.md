# Run log — EXP-019

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Experiment:** EXP-019 — Shipping page → Beles restock link
**Loop:** internal_linking (search_to_restock)
**Branch:** growth/search-exp-019-shipping-beles-link

## Context

`growth:next` selected EXP-008 (priority 160) but open PR #58 already covers that experiment. Selected EXP-019 as next eligible search_to_restock item without an open PR.

## Hypothesis

If we add a contextual Beles restock link on shipping.html for buyers researching delivery before purchase, then shipping-page visitors will reach the restock list with clearer next-step framing, because delivery and sample questions often precede signup interest.

## Changed files

- shipping.html — Beles section with restock + chapter links and analytics
- growth/state.json — lock during run (cleared below)
- growth/backlog.md — EXP-019 marked done
- growth/memory.md — durable note on shipping funnel gap
- growth/results.tsv — ledger row appended

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_search_to_restock-EXP-019-ai-review.md

## QGS: 14 — keep

| Component | Score |
|---|---|
| intent | 2 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 2 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |

## Measure

Compare `beles_cta_click` with label `shipping_restock` → `restock_form_submitted` on `/beles` over 14d. Watch `/shipping` as referral source in Vercel WA.

## Lock footer

`lock_status` cleared to `unlocked`; `active_experiment_id` null; `last_successful_loop` EXP-019.
