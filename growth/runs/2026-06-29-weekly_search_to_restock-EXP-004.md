# Run log — EXP-004

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock (7dc7ab5c-7394-11f1-a8a0-cafc5ef88358)  
**Experiment:** EXP-004 — Journal: "What does Fico d'India smell like?"  
**Loop:** search_to_restock · seo_content  
**Branch:** growth/search-exp-004-fico-d-india-smell

## Hypothesis

If we publish `/journal/what-does-fico-d-india-smell-like` with FAQ schema, sensory copy answering the smell query in the first 120 words, and Beles restock CTAs, then Fico d'India search-intent visitors will reach `/beles#waitlist` with clearer product context, because the page matches smell-query language and extends the prickly-pear cluster without duplicating the full chapter.

## Context

Prior automation run (3a9c9597) implemented the article on this branch and logged EXP-004 to `results.tsv`. This run completed the AI hard review pipeline and validated QA on the canonical `growth/*` branch.

## Changed files (this run)

- `growth/ai-review.md` (workflow doc)
- `scripts/growth/validate-ai-review.mjs` (validator)
- `package.json` (`growth:validate-ai-review` script)
- `growth/runs/2026-06-29-weekly_search_to_restock-EXP-004-ai-review.md`
- `growth/runs/2026-06-29-weekly_search_to_restock-EXP-004.md`
- `growth/state.json` (lock/unlock)

## QA

- `npm run growth:qa` — **pass**
- `npm run growth:validate-ai-review -- growth/runs/2026-06-29-weekly_search_to_restock-EXP-004-ai-review.md` — **pass**

## Scores (unchanged from prior run)

| Dimension | Score |
|---|---|
| intent_score | 3 |
| brand_fit_score | 3 |
| conversion_score | 3 |
| discoverability_score | 3 |
| measurement_score | 2 |
| technical_quality_score | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |
| **QGS** | **16** |

## Decision

**keep** — QGS 16 ≥ 13, brand_risk 0, zero block findings in AI hard review.

## PR status

Skipped opening a new PR: three draft PRs already open for search_to_restock / EXP-004 on `cursor/*` branches (#16–#18). Canonical branch `growth/search-exp-004-fico-d-india-smell` pushed with ai-review completion. Recommend human close duplicate cursor PRs and open or retarget one PR from the growth branch.

## Follow-ups

- Close duplicate cursor PRs (#16, #17, #18); merge from `growth/search-exp-004-fico-d-india-smell`
- Monitor GSC for "fico d'india smell" cluster (14–28d)
- EXP-005 restock form trust microcopy (next priority)

## Lock

Lock cleared in `state.json` at run end.
