# AI Hard Review — EXP-008

**Date:** 2026-06-29
**Automation:** 40bf91e3-7391-11f1-a8a0-cafc5ef88358
**Branch:** growth/internal_linking-exp-008-journal-beles-restock-links
**Bugbot runs:** 3 (manual checklist — Bugbot MCP unavailable in Cloud Agent; per ai-review.md escalation)
**Verdict:** pass_with_notes

## Summary

Strengthened journal → Beles → restock funnel: journal index boutique card now points to `/beles#waitlist` with analytics; `the-bottle` and `beles-batch-bl001` gained article-page restock CTAs; `fico-d-india` CTA received analytics label. No new claims, forbidden copy, or broken links. Re-verified on 2026-06-29T14:30Z cron: canonical branch up to date with `origin/main` (c714cf6); `npm ci` + `npm run growth:qa` pass; zero block findings on manual Bugbot checklist.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/fico-d-india.html | CTA subcopy still reads "Out of stock" while sibling articles use "Awaiting next release" | pre-existing; acceptable inconsistency with verify:copy pass |
| warn | journal.html | Boutique card now has dual links (restock + chapter) | intentional funnel clarity |
| praise | journal/the-bottle.html | In-body link to chapter + restock before primary CTA | n/a |
| praise | journal/beles-batch-bl001.html | Added missing article-page restock CTA with analytics | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — no stock dates or guarantees added
- [x] Privacy / analytics — `beles_cta_click` labels only; no PII
- [x] SEO / metadata — no canonical or JSON-LD changes
- [x] A11y — existing article-page CTA pattern reused
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
