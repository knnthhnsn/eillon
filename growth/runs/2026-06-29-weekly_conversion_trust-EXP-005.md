# Run: EXP-005 · weekly_conversion_trust

**Date:** 2026-06-29  
**Agent:** Cursor Cloud Agent  
**Branch:** cursor/conversion-trust-points-91f5  
**Loop type:** conversion_copy  
**Lock:** locked → unlocked

## Hypothesis

If we add visible trust microcopy above the Beles restock form (what joining means, size interest only, unsubscribe path), then high-intent visitors on `/beles#waitlist` will complete signup because purchase-expectation and list-intent hesitations are resolved at submit time, because consent copy referenced “above” text that was hidden on desktop (`shop__cta-caption` touch-only).

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
| beles.html | Pre-form `shop__form-trust` block; consent wording; remove hidden caption |
| site.css | Trust block typography + chapter-shader-band colors |
| site.min.css | Rebuilt minified site CSS |

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

Root cause: `.shop__cta-caption { display: none }` with visibility only under `@media (hover: none)`. Trust copy existed in HTML but not on desktop viewports.

## Durable learnings (for memory.md)

- Beles waitlist consent must reference copy visible on all viewports, not touch-only captions.

## Follow-ups

- Monitor `restock_form_started` → `restock_form_submitted` rate on `/beles` in Vercel WA after merge.
