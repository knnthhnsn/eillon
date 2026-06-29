# AI Hard Review — EXP-024

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-024-sample-first-guide
**Bugbot runs:** 1 (manual checklist per ai-review.md — Bugbot unavailable in Cloud Agent)
**Verdict:** pass_with_notes

## Summary

Journal buying guide for sample-first niche perfume intent with FAQ schema, internal links to Beles restock, prickly-pear landing, smell article, and wear guide. Sample credit and availability language matches beles.html and products.js — no false stock or restock date claims.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| praise | journal/sample-first-niche-perfume.html | FAQ schema + canonical + breadcrumb correct | n/a |
| praise | journal.html | New grid entry + ItemList JSON-LD updated | n/a |
| praise | prickly-pear-parfum.html | Internal link to buying guide in try-it section | n/a |
| warn | journal/sample-first-niche-perfume.html | No dedicated journal_to_beles_click event on inline links | accepted — primary CTA has beles_cta_click |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — sample €28, awaiting-next-release, 30-day credit per beles.html
- [x] Privacy / analytics — beles_cta_click on article CTA only; no PII
- [x] SEO / metadata — canonical, FAQ JSON-LD, sitemap route added
- [x] A11y — skip link, article hero pattern, semantic headings
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
