# Run log — EXP-026

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Experiment:** EXP-026 — Beles FAQ longevity without guarantees
**Loop:** objection_to_trust
**Branch:** cursor/conversion-trust-points-617b

## Hypothesis

If we add a Beles FAQ answer on longevity with observed studio wear figures and explicit no-guarantee framing, then visitors hesitating on performance will complete restock signup at a higher rate, because longevity is a common objection and the answer is visible in the FAQ accordion before submit.

## Changed files

- beles.html — FAQ `<dl>` entry + FAQPage JSON-LD question

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_conversion_trust-EXP-026-ai-review.md

## QGS: 14 — keep

Breakdown: intent 3 · brand 3 · conversion 3 · discoverability 1 · measurement 1 · technical 3 · complexity 0 · risk 0

## Measure

Compare `restock_form_submitted` on `/beles#waitlist` over 14d vs prior baseline; monitor FAQ-related organic queries in GSC for longevity phrasing.

## Lock

- Locked at run start
- Cleared at run end
