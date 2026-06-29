# Run log — EXP-013

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock (7dc7ab5c-7394-11f1-a8a0-cafc5ef88358)  
**Experiment:** EXP-013 — "Oil-rich parfum explained" journal piece  
**Loop:** search_to_restock · seo_content  
**Branch:** cursor/beles-restock-signup-experiment-e728 (canonical name: growth/search-exp-013-oil-rich-parfum-explained)

## Hypothesis

If we publish `/journal/oil-rich-parfum-explained` with FAQ schema, educational copy answering oil-rich parfum search intent in the first 120 words, and Beles restock CTAs, then oil-rich parfum search-intent visitors will reach `/beles#waitlist` with clearer format context, because the page matches educational query language and links the format to Beles as a living example.

## Context

EXP-004 (`/journal/what-does-fico-d-india-smell-like`) remains on open PR #21 — not merged to main. This run advances the search_to_restock cluster with EXP-013 (next seo_content backlog item) rather than duplicating EXP-004.

## Changed files

- `journal/oil-rich-parfum-explained.html` (new article + FAQ schema)
- `journal.html` (featured entry, count 04)
- `journal/fico-d-india.html` (internal link)
- `beles.html` (oil-rich section link)
- `prickly-pear-parfum.html` (internal link)
- `scripts/site-nav.js` (search panel entry)
- `scripts/generate-sitemap.mjs` + `sitemap.xml`
- `growth/state.json`, `growth/backlog.md`, `growth/results.tsv`, `growth/memory.md`

## QA

- `npm run growth:qa` — **pass**
- `npm run growth:validate-ai-review -- growth/runs/2026-06-29-weekly_search_to_restock-EXP-013-ai-review.md` — **pass**

## Scores

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

## Follow-ups

- Monitor GSC for "oil-rich parfum" / "oil rich parfum meaning" cluster (14–28d)
- Merge or close duplicate EXP-004 PRs (#16–#21); keep one canonical PR
- EXP-035 journal_to_beles_click analytics event for new journal CTAs

## Lock

Lock cleared in `state.json` at run end.
