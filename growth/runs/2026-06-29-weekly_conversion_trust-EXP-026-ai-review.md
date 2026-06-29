# AI Hard Review — EXP-026

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Branch:** cursor/conversion-trust-points-be33
**Bugbot runs:** 0 (Bugbot unavailable — manual checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Added one Beles FAQ entry and matching FAQPage JSON-LD for longevity on skin. Copy cites existing studio wear methodology from `craftsmanship.html#wear-testing` and `beles.html` wear profile, with explicit no-guarantee framing. No new product claims beyond published studio observations.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | beles.html:FAQ | FAQ schema now has 5 questions while visible FAQ has more entries — pre-existing partial sync | accepted: new longevity Q added to both HTML FAQ and JSON-LD; full FAQ/schema parity is out of scope for this run |

## Checklist sign-off

- [x] Brand (DESIGN.md) — quiet, precise; no forbidden phrases; no fake guarantees
- [x] Claims / products.js — longevity language matches craftsmanship wear-testing section and wear profile dl
- [x] Privacy / analytics — no analytics or PII changes
- [x] SEO / metadata — FAQPage JSON-LD extended; internal link to `/craftsmanship#wear-testing` verified
- [x] A11y (if UI) — FAQ uses existing `dl.faq-list` pattern inside `<details>`
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
