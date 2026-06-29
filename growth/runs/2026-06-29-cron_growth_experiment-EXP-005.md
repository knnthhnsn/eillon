# Run log — EXP-005

**Date:** 2026-06-29
**Automation:** 40bf91e3-7391-11f1-a8a0-cafc5ef88358 (cron growth experiment execution)
**Experiment:** EXP-005 — Beles restock form trust microcopy
**Loop:** conversion_copy (objection_to_trust)
**Branch:** growth/objection_to_trust-exp-005-restock-trust-copy
**Lock:** locked → unlocked

## Hypothesis

If we show visible waitlist trust microcopy before the Beles form — explaining no charge, one restock email, and size-interest-only behavior — then hesitant high-intent visitors on `/beles#waitlist` will complete signup at a higher rate, because the hidden `.shop__cta-caption` left mobile users without "what happens next" clarity and consent referenced copy that appeared below the form.

## Context read

- [x] AGENTS.md, program.md, autonomy-policy.md, state.json, backlog.md, results.tsv, memory.md, DESIGN.md, ai-review.md

## Changes

| File | Summary |
|---|---|
| beles.html | Add `shop__waitlist-promise` before form; fix consent; remove hidden caption |
| site.css | Styles for visible promise on light/dark chapter band |
| site.min.css | Build output |

## QA

| Gate | Result |
|---|---|
| npm run growth:qa | pass |
| npm run build | pass |
| npm run verify:all | pass |

## AI hard review

- Artifact: `growth/runs/2026-06-29-cron_growth_experiment-EXP-005-ai-review.md`
- Verdict: pass_with_notes (Bugbot unavailable; manual checklist, zero blocks)

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

Root cause: `.shop__cta-caption` is `display:none` in base styles (only visible in fine-pointer media query), so mobile users saw form + consent without the promise text. Consent said "described above" but caption was below.

## Follow-ups

- Monitor `restock_form_submitted` rate on Beles vs prior 7d baseline in Vercel WA.
- Consider bumping `consent_notice_version` if legal review requires after visible consent change.
