# Run Log — EXP-013 · weekly_search_to_restock

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock  
**Branch:** growth/search-exp-013-oil-rich-parfum  
**Loop:** search_to_restock · seo_content

## Hypothesis

If we publish a journal article explaining oil-rich parfum with FAQ schema and Beles internal links, then oil-rich parfum search intent will convert to Beles restock visits with clearer concentration context, because query-matched copy reduces bounce before CTA.

## Selection

- `npm run growth:next` returned EXP-008 (internal linking, priority 160)
- Chose **EXP-013** (same priority 160) — fresh SEO content asset for underrepresented "oil-rich parfum" demand cluster per `growth/insights.md`
- No open `growth/*` PRs; lock acquired; open_growth_prs_count = 0

## Changes

| File | Change |
|---|---|
| `journal/what-is-oil-rich-parfum.html` | New article + FAQ schema + restock CTA |
| `journal.html` | Featured entry, grid entry, ItemList JSON-LD |
| `journal/fico-d-india.html` | Internal link to new article |
| `journal/what-does-fico-d-india-smell-like.html` | Internal link to new article |
| `prickly-pear-parfum.html` | Internal link to new article |
| `scripts/generate-sitemap.mjs` | New route |
| `sitemap.xml` | Regenerated (20 routes) |

## QA

- `npm run growth:qa` — **pass** (build, verify:all)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-013-ai-review.md`
- Verdict: pass_with_notes (0 block findings)

## Score (QGS = 16)

| Dimension | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 3 |
| measurement | 2 |
| technical_quality | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |

**Decision:** keep

## Post-launch review

- Monitor GSC for "oil-rich parfum" / "what is oil-rich parfum" impressions (14–28d)
- Track `beles_cta_click` with label `journal_oil_rich_parfum` on production WA

## Lock footer

- `state.json` lock cleared at run end
- **2026-06-29 14:30 cron:** QA re-verified pass; `growth:validate-ai-review` OK; PR opened on `growth/search-exp-013-oil-rich-parfum`
