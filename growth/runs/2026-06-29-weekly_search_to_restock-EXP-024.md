# Run log — weekly_search_to_restock · EXP-024

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock  
**Experiment:** EXP-024 — Sample-first buying guide section  
**Branch:** growth/search-exp-024-sample-first-guide  
**Status:** keep

## Hypothesis

If we publish a journal guide on sample-first niche perfume buying with FAQ schema and Beles restock links, then sample-first search intent will convert to restock list visits with clearer size expectations, because query-matched copy reduces hesitation before signup.

## Changes

| File | Change |
|---|---|
| journal/sample-first-niche-perfume.html | New article — FAQ schema, Beles CTA |
| journal.html | Grid entry + ItemList JSON-LD (05 entries) |
| prickly-pear-parfum.html | Internal link to buying guide |
| scripts/generate-sitemap.mjs | New route |
| sitemap.xml | Regenerated (20 routes) |

## Scoring

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
| **qualified_growth_score** | **16** |

## QA

- `npm run growth:qa` — pass
- AI hard review: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-024-ai-review.md` — pass_with_notes

## Notes

- Skipped EXP-013/023/008 — open draft PRs exist for same loop; selected EXP-024 (no open PR).
- Monitor GSC for sample-first / perfume sample queries in 14–28d.

## Lock footer

`state.json` lock cleared at run end.
