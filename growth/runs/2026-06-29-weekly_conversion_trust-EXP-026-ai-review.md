# AI Hard Review — EXP-026

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Branch:** cursor/conversion-trust-points-1607
**Bugbot runs:** 0 (Bugbot unavailable; manual checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Added a Beles FAQ answer and matching FAQPage JSON-LD on longevity/wear time. Copy cites six studio wear sessions (eight-hour intervals, 8–10 hours observed) with explicit no-guarantee framing and a link to craftsmanship wear-testing. Aligns with proof-layer note and batch BL-001 journal language. No forbidden phrases, no fabricated proof, no new analytics events.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | beles.html:307 | Wear profile `<details>` still shows "Observed 8–10 hours" without inline no-guarantee clause | Accepted — FAQ now answers objection explicitly; wear profile uses "observed" studio framing consistent with proof layer |
| praise | beles.html | FAQ links to `/craftsmanship#wear-testing` — valid anchor | n/a |
| praise | beles.html | JSON-LD FAQ entry mirrors visible FAQ copy | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet, precise longevity language
- [x] Claims / products.js — consistent with studio wear sessions cited on proof layer and batch journal
- [x] Privacy / analytics — no new events or PII
- [x] SEO / metadata — FAQPage JSON-LD extended; canonical unchanged
- [x] A11y — FAQ uses existing `<dl class="faq-list">` pattern
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
