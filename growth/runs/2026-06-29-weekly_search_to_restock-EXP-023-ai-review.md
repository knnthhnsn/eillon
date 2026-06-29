# AI Hard Review — EXP-023

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-023-skin-scent
**Bugbot runs:** 1 (manual checklist; Bugbot unavailable in Cloud Agent session)
**Verdict:** pass_with_notes

## Summary

New `/skin-scent-parfum` discovery landing with FAQPage JSON-LD, hero + footer restock CTAs with analytics labels, and internal links from prickly-pear landing, Fico smell journal article, wear guide, and site search. Notes align with `data/products.js` and Beles chapter; no false stock dates or forbidden copy. Zero block findings.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | skin-scent-parfum.html | No dedicated OG image beyond close-skin photo (shared with wear.html) | accepted — on-brand imagery; revisit in EXP-017 |
| praise | skin-scent-parfum.html | FAQ schema + canonical + breadcrumb correct | n/a |
| praise | scripts/site-nav.js | Search overlay entry added for skin scent keywords | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — Beles notes match; awaiting next release language only
- [x] Privacy / analytics — beles_cta_click labels only; no PII
- [x] SEO / metadata — canonical, FAQ JSON-LD, sitemap route added
- [x] A11y — skip link, FAQ dl/dt/dd, hero structure
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
