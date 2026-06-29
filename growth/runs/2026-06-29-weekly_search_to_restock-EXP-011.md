# Run log — EXP-011

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Experiment:** EXP-011 — FAQ schema expansion on wear.html
**Loop:** technical_seo (search_to_restock automation)
**Branch:** growth/search-exp-011-wear-faq-schema
**Lock:** locked → unlocked

## Hypothesis

If we expand FAQ schema and a visible FAQ block on wear.html with Beles restock links, then skin-scent and wear-intent visitors will reach the restock form with clearer application guidance, because the page answers how close oil-rich parfums wear before the CTA.

## Context

Skipped EXP-008/013/023/024/033 — open cursor PRs already cover those search_to_restock experiments. EXP-011 was unblocked (no open PR).

## Changed files

- wear.html — FAQPage JSON-LD, visible FAQ section, Beles restock CTA + analytics
- journal/what-does-fico-d-india-smell-like.html — internal link to `/wear#faq`
- prickly-pear-parfum.html — internal link to `/wear#faq`

## QA

| Gate | Result |
|---|---|
| npm run growth:qa | pass |
| npm run build | pass |
| npm run verify:all | pass |
| AI review | growth/runs/2026-06-29-weekly_search_to_restock-EXP-011-ai-review.md |

## Scores

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | **16** |

## Decision

**Status:** keep

## Measure

Monitor GSC impressions for wear/skin-scent queries on `/wear` over 14–28d; compare `beles_cta_click` with labels `wear_faq_restock` and `wear_chapter_beles` vs prior baseline.

## Follow-ups

Merge or close duplicate cursor PRs for EXP-013/023/024/033 to reduce search_to_restock queue.
