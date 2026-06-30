# AI Hard Review — EXP-011

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Branch:** growth/conversion_copy-exp-011-wear-faq-trust
**Bugbot runs:** 0 (Bugbot unavailable in Cloud Agent; manual checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Expanded `/wear` with eight-question FAQ (visible + FAQPage JSON-LD) answering application, closeness, storage, layering, longevity, and sample-first objections using only on-page and craftsmanship wear-testing language. Added calm Beles restock trust block with `beles_cta_click` label `wear_guide_restock` and proof sections `wear_faq` / `wear_restock`. No false stock dates, guarantees, or forbidden copy.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | wear.html | FAQPage longevity answer omits craftsmanship link present in visible FAQ | acceptable — schema text is self-contained; visible FAQ links to `/craftsmanship#wear-testing` |
| praise | wear.html | Longevity copy uses observed-wear framing from craftsmanship.html | n/a |
| praise | wear.html | Restock trust reuses `.shop__restock-trust` pattern from EXP-005 | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — longevity cites studio sessions without guarantees; sample/restock language matches beles.html
- [x] Privacy / analytics — `beles_cta_click` + proof sections only; no PII
- [x] SEO / metadata — FAQPage JSON-LD matches visible FAQ; HowTo schema retained
- [x] A11y — FAQ headings labelled; trust list aria-label; CTA text clear
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
