# AI Hard Review — EXP-004

**Branch:** growth/search-exp-004-fico-d-india-smell  
**Reviewer:** Agent hard review per `.cursor/BUGBOT.md` and `/growth/ai-review.md`  
**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock

## QA baseline

- `npm run growth:qa` — **pass** (build, verify:all, ledger, state)
- `npm run growth:validate-ai-review` — **pass**

## Bugbot findings

| ID | Severity | File | Finding | Resolution |
|---|---|---|---|---|
| B1 | warn | journal/what-does-fico-d-india-smell-like.html | Article CTA lacks `data-analytics-*` attribute | deferred — EXP-035 tracks journal_to_beles_click event |
| B2 | warn | — | Three duplicate draft PRs exist on `cursor/*` branches for same EXP-004 | documented — canonical branch is `growth/search-exp-004-fico-d-india-smell`; human should close duplicates |

No **block** findings.

## Manual checks (BUGBOT.md)

- [x] No false stock/restock/certification claims — "awaiting next release" matches `data/products.js`
- [x] No forbidden copy (DESIGN.md grep clean on new article)
- [x] No PII in analytics/UTM — no analytics changes in diff
- [x] Beles notes align with `data/products.js` and `beles.html`
- [x] Canonical + title + JSON-LD valid on `/journal/what-does-fico-d-india-smell-like`
- [x] Hero image `palette-desert-fruit.webp` exists in repo
- [x] Internal links verified via `npm run verify:links`
- [x] Sitemap updated (19 routes)

## Blockers remaining

None.

## Decision

pass
