# Run Log — weekly_search_to_restock · EXP-033

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock  
**Experiment:** EXP-033 — Genderless niche fragrance Copenhagen page  
**Branch:** cursor/beles-restock-signup-experiment-81c6  
**Loop:** search_to_restock · seo_content  
**Status:** keep

## Hypothesis

If we publish `/journal/genderless-niche-perfume-copenhagen` with FAQ schema, Copenhagen/geo context, and Beles restock links, then genderless niche perfume search intent will convert to restock list visits with clearer maison framing, because query-matched copy answers format and location questions before the CTA.

## Context

Skipped EXP-008, EXP-013, EXP-023, EXP-024 — open draft PRs exist for those search_to_restock experiments (#42, #31, #35, #48). Selected EXP-033 as next eligible seo_content item without an open PR.

## Changes

- `journal/genderless-niche-perfume-copenhagen.html` — new article (FAQ + Article JSON-LD)
- `journal.html` — featured entry, grid entry for smell article, ItemList 05 entries
- `journal/what-does-fico-d-india-smell-like.html` — internal link to genderless article
- `prickly-pear-parfum.html` — internal link to genderless article
- `scripts/generate-sitemap.mjs` + `sitemap.xml` — route added (20 URLs)

## QA

```bash
npm run growth:qa
npm run growth:validate-ai-review -- growth/runs/2026-06-29-weekly_search_to_restock-EXP-033-ai-review.md
```

## AI hard review

`growth/runs/2026-06-29-weekly_search_to_restock-EXP-033-ai-review.md` — pass_with_notes (zero block findings)

## Score

| Dimension | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 3 |
| measurement | 2 |
| technical_quality | 3 |
| complexity_penalty | −1 |
| brand_risk_penalty | 0 |
| **QGS** | **16** |

## Follow-ups

- Monitor GSC for "genderless niche perfume Copenhagen" cluster (14–28d)
- Merge or close duplicate search PRs (#31, #35, #42, #48) to reduce review queue
- EXP-035 journal_to_beles_click analytics event

## Lock footer

`state.json` lock cleared at run end.
