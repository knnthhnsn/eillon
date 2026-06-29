# Run: EXP-023 · weekly_search_to_restock

**Date:** 2026-06-29  
**Agent:** Cursor Cloud Agent  
**Branch:** growth/search-exp-023-skin-scent  
**Loop type:** seo_content (search_to_restock)  
**Lock:** locked → unlocked

## Hypothesis

If we publish a skin scent landing page with FAQ schema and Beles internal links, then skin-scent search intent will convert to Beles restock list visits with clearer close-wearing framing, because query-matched copy reduces bounce before CTA.

## Context read

- [x] AGENTS.md
- [x] growth/program.md
- [x] growth/autonomy-policy.md
- [x] growth/state.json
- [x] growth/backlog.md
- [x] DESIGN.md

## Changes

| File | Summary |
|---|---|
| skin-scent-parfum.html | New discovery landing — skin scent FAQ + Beles CTAs |
| scripts/generate-sitemap.mjs | Route for /skin-scent-parfum |
| sitemap.xml | Regenerated (20 routes) |
| prickly-pear-parfum.html | Internal link to skin scent guide |
| journal/what-does-fico-d-india-smell-like.html | Internal link to skin scent guide |
| wear.html | Skin scent link in application copy |
| scripts/site-nav.js | Search overlay entry |
| growth/state.json | Lock during run |

## QA

| Gate | Result |
|---|---|
| npm run build | pass |
| npm run verify:all | pass |
| brand safety | pass (no forbidden phrases) |
| privacy | pass |

## Scores

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 3 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | **16** |

## Decision

**Status:** keep

## Notes

Skipped duplicate EXP-004/EXP-013 (open search PRs exist). Selected EXP-023 as next eligible search_to_restock seo_content experiment.

AI review: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-023-ai-review.md`

## Durable learnings (for memory.md)

- Skin scent demand cluster now has dedicated landing at `/skin-scent-parfum`.

## Follow-ups

- Monitor GSC for skin-scent queries in 14–28d.
- EXP-008 internal linking cluster when search PR backlog clears.
