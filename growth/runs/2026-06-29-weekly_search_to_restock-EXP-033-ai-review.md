# AI Hard Review — EXP-033

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** cursor/beles-restock-signup-experiment-81c6 (growth/search-exp-033-genderless-copenhagen)
**Bugbot runs:** 1 (manual checklist — Bugbot unavailable in Cloud Agent session)
**Verdict:** pass_with_notes

## Summary

Journal article answering genderless niche perfume / Copenhagen search intent with FAQ schema, Article JSON-LD, and Beles restock CTA. Notes align with beles.html and DESIGN.md; no false stock or restock-date claims. Internal links added from prickly-pear landing and smell-intent article.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/genderless-niche-perfume-copenhagen.html | No journal_to_beles_click event (EXP-035 backlog) | accepted — beles_cta_click on primary CTA matches existing journal pattern |
| praise | journal/genderless-niche-perfume-copenhagen.html | FAQ schema + canonical + geo tags correct | n/a |
| praise | journal.html | Featured entry + ItemList (05 entries) updated | n/a |
| praise | prickly-pear-parfum.html | Contextual internal link added | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — genderless, oil-rich, awaiting release language only
- [x] Privacy / analytics — beles_cta_click on CTA; no PII
- [x] SEO / metadata — canonical, FAQ JSON-LD, sitemap (20 routes)
- [x] A11y — skip link, article pattern, labeled CTA
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
