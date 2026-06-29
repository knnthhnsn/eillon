# AI Hard Review — EXP-008

**Date:** 2026-06-29
**Automation:** growth_experiment_execution
**Branch:** growth/internal_linking-exp-008-journal-beles-restock
**Bugbot runs:** 0 (Bugbot MCP unavailable; manual checklist per /growth/ai-review.md)
**Verdict:** pass_with_notes

## Summary

Internal linking experiment strengthens the Journal → Beles → restock funnel across the index and all four article pages. Every journal article now has a primary `/beles#waitlist` CTA with `beles_cta_click` analytics labels; the index adds per-entry restock links and a manifesto restock line. No new product claims; copy uses existing restock framing from DESIGN.md.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/*.html | `beles_cta_click` used instead of dedicated `journal_to_beles_click` event | accepted — EXP-035 owns distinct event; labels differentiate source |
| praise | journal/beles-batch-bl001.html | Added missing `article-page__cta` restock block | n/a |
| praise | journal/the-bottle.html | CTA aligned to `/beles#waitlist` with analytics | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet restock language
- [x] Claims / products.js — no stock dates or guarantees added
- [x] Privacy / analytics — `beles_cta_click` only; no PII in labels
- [x] SEO / metadata — no canonical/title changes; internal links verified
- [x] A11y — existing article CTA patterns preserved
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
