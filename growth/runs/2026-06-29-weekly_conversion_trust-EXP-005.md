# Run: EXP-005 · weekly_conversion_trust

**Date:** 2026-06-29  
**Agent:** Cursor Cloud Agent  
**Branch:** cursor/conversion-trust-points-0259  
**Loop type:** conversion_copy  
**Lock:** locked → unlocked

## Hypothesis

If we show visible waitlist trust microcopy before the Beles form — explaining no charge, one restock email, and size-interest-only behavior — then hesitant high-intent visitors on `/beles#waitlist` will complete signup at a higher rate, because the hidden `.shop__cta-caption` left mobile users without "what happens next" clarity and consent referenced copy that appeared below the form.

## Context read

- [x] AGENTS.md
- [x] growth/program.md
- [x] growth/autonomy-policy.md
- [x] growth/state.json
- [x] growth/backlog.md
- [x] DESIGN.md

## Changes

| File | Summary |
|---|---|
| beles.html | Add `shop__waitlist-promise` before form; fix consent; remove hidden caption |
| site.css | Styles for visible promise on light/dark chapter band |
| site.min.css | Build output |

## QA

| Gate | Result |
|---|---|
| npm run build | pass |
| npm run verify:all | pass |
| brand safety | pass — no forbidden phrases |
| privacy | pass — no new analytics |

## Scores

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | 15 |

## Decision

**Status:** keep

## Notes

Root cause: `.shop__cta-caption` is `display:none` in base styles (only visible on fine-pointer hover media query), so mobile users saw form + consent without the promise text. Consent said "described above" but caption was below.

## Durable learnings (for memory.md)

- Beles waitlist `.shop__cta-caption` was hidden on mobile; use `shop__waitlist-promise` for visible trust copy.

## Follow-ups

- Monitor `restock_form_submitted` rate on Beles vs prior 7d baseline in Vercel WA.
- Consider same pattern for Asmara/Massawa chapter forms if conversion data shows hesitation.
