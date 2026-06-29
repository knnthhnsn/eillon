# Run log — EXP-026

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Experiment:** EXP-026 — Beles FAQ: longevity without guarantees
**Loop:** conversion_copy (objection_to_trust)
**Branch:** cursor/conversion-trust-points-9303
**Lock:** locked → unlocked

## Hypothesis

If we add an explicit Beles FAQ answer on longevity with observed studio wear figures and a no-guarantee disclaimer, then high-intent visitors with longevity hesitation will proceed to restock signup, because the objection is answered in the FAQ before submit.

## Context read

- [x] AGENTS.md
- [x] growth/program.md
- [x] growth/autonomy-policy.md
- [x] growth/state.json
- [x] growth/backlog.md
- [x] DESIGN.md

## Changed files

| File | Summary |
|---|---|
| beles.html | FAQ longevity Q&A + FAQPage JSON-LD entry; link to wear guide |

## QA

| Gate | Result |
|---|---|
| npm run growth:qa | pass |
| npm run build | pass |
| npm run verify:all | pass |
| brand safety | pass |
| privacy | pass |

## Scores

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 1 |
| technical | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | 14 |

## Decision

**Status:** keep

## Notes

Longevity is a top objection in memory.md; wear profile already stated 8–10h but FAQ lacked a direct answer.

## Durable learnings (for memory.md)

- Beles FAQ now addresses longevity with studio-observed figures and explicit non-guarantee framing.

## Follow-ups

- Monitor restock_form_started → submitted on `/beles#waitlist` over 14d; compare FAQ expand rate if instrumented later.

## AI hard review

- growth/runs/2026-06-29-weekly_conversion_trust-EXP-026-ai-review.md — pass
