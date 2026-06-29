# AI Hard Review — EXP-013

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock (7dc7ab5c-7394-11f1-a8a0-cafc5ef88358)
**Branch:** cursor/beles-restock-signup-experiment-e728
**Bugbot runs:** 0 (Bugbot unavailable — manual checklist per `/growth/ai-review.md` escalation)
**Verdict:** pass_with_notes

## Summary

Manual AI hard review of EXP-013 journal article `/journal/oil-rich-parfum-explained`. Zero block findings. Copy aligns with `data/products.js` Beles notes, DESIGN.md voice, and existing wear/craftsmanship pages. FAQ + Article JSON-LD valid; sitemap updated to 19 routes; internal links verified by `npm run verify:links`.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/oil-rich-parfum-explained.html CTA | Primary restock CTA lacks `data-analytics-event` | accepted — matches existing journal article pattern (fico-d-india.html); follow-up EXP-035 |
| praise | journal/oil-rich-parfum-explained.html:87-95 | Smell/format query answered in first 120 words | — |
| praise | journal/oil-rich-parfum-explained.html JSON-LD | FAQPage + Article schema valid | — |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — Beles notes match; awaiting-next-release language only
- [x] Privacy / analytics — no PII; no new event props
- [x] SEO / metadata — unique title, canonical, hreflang, sitemap route
- [x] A11y — skip link, semantic headings, form N/A on article
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
