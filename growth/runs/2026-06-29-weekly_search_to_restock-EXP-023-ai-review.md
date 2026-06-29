# AI Hard Review — EXP-023

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-023-skin-scent-faq
**Bugbot runs:** 0 (Bugbot unavailable in Cloud Agent session; manual checklist per growth/ai-review.md)
**Verdict:** pass_with_notes

## Summary

Journal article `/journal/what-is-a-skin-scent` answers skin-scent search intent with FAQ schema (JSON-LD + visible dl), Beles restock CTA, and cluster links from prickly-pear landing and smell-intent article. Notes and availability language align with `data/products.js` and `beles.html`. No forbidden copy; no false stock or longevity guarantees.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/what-is-a-skin-scent.html | No UTM on restock CTA (organic journal path) | accepted — matches EXP-004 journal pattern; label `journal_skin_scent_article` for WA segmentation |
| praise | journal/what-is-a-skin-scent.html | FAQPage schema matches visible FAQ block | n/a |
| praise | journal.html | Featured entry + ItemList + count updated | n/a |
| praise | prickly-pear-parfum.html, what-does-fico-d-india-smell-like.html | Cluster internal links added | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — quiet, sensory, precise; no forbidden phrases
- [x] Claims / products.js — Beles notes match; awaiting next release only
- [x] Privacy / analytics — `beles_cta_click` with label only; no PII
- [x] SEO / metadata — canonical, FAQ JSON-LD, sitemap route added
- [x] A11y — skip link, article landmarks, FAQ dl/dt/dd
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
