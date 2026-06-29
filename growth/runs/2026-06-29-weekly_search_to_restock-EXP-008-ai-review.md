# AI Hard Review — EXP-008

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-008-journal-beles-links
**Bugbot runs:** 0 (Bugbot unavailable in Cloud Agent session; manual checklist completed)
**Verdict:** pass_with_notes

## Summary

Internal linking experiment: journal articles and index now route readers to `/beles#waitlist` with `beles_cta_click` analytics labels. Beles chapter gains reciprocal links to smell-intent and prickly-pear landing pages. No new routes, claims, or forbidden copy introduced.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/fico-d-india.html:131 | Pre-existing "Out of stock" CTA subcopy (not introduced in diff) | accepted — matches verify-out-of-stock lifecycle label |
| praise | journal/beles-batch-bl001.html | Added missing article-page__cta with restock anchor | n/a |
| praise | journal/the-bottle.html | CTA now points to #waitlist with analytics | n/a |
| praise | beles.html | Reciprocal journal cluster links in oil-rich section | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md)
- [x] Claims / products.js — no note or stock claim changes
- [x] Privacy / analytics — beles_cta_click labels only, no PII
- [x] SEO / metadata — no new routes; internal links verified
- [x] A11y — existing article CTA pattern preserved
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
