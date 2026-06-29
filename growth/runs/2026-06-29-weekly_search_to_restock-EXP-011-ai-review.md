# AI Hard Review — EXP-011

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-011-wear-faq-schema
**Bugbot runs:** 0 (Bugbot unavailable; manual checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Expanded `/wear` with FAQPage JSON-LD and a visible FAQ block answering skin-scent and close-wear questions, with Beles restock CTAs and analytics labels. Internal links from prickly-pear landing and Fico d'India smell article point to `/wear#faq`. No false stock or longevity guarantees; notes align with Beles chapter copy.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | wear.html | `info-page__faq-cta` class has no dedicated CSS | acceptable — inherits btn--primary spacing |
| praise | wear.html | FAQ schema matches visible FAQ copy; no guarantee language | n/a |
| praise | wear.html | Beles CTA uses `beles_cta_click` with `wear_faq_restock` label | n/a |
| praise | journal/what-does-fico-d-india-smell-like.html | Internal link to `/wear#faq` | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — awaiting release language only; no fixed hour guarantees
- [x] Privacy / analytics — event props are labels only, no PII
- [x] SEO / metadata — FAQ JSON-LD valid; existing canonical unchanged
- [x] A11y — FAQ uses semantic dl/dt/dd; CTA labeled
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
