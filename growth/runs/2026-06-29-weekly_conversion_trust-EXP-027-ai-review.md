# AI Hard Review — EXP-027

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Branch:** cursor/conversion-trust-points-9466
**Bugbot runs:** 0 (Bugbot unavailable; manual checklist per ai-review.md)
**Verdict:** pass

## Summary

About page studio block now fires `studio_appointment_click` with label `about_studio`, adds `proof_section_viewed` for `about_studio`, and replaces a plain mailto with the same “Request an appointment →” CTA used in the homepage footer. Trust note clarifies email-only booking with human confirmation — no false automation or guarantee claims.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| praise | about.html#studio | Analytics follows existing `data-analytics-event` pattern in analytics.js | n/a |
| praise | about.html#studio | Appointment hours match footer copy (Thu–Sat 12–18) | n/a |
| warn | about.html | Press mailto on #people remains untracked (different intent) | accepted — EXP-027 scope is appointment path only |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet commerce tone
- [x] Claims / products.js — no product or stock claims; studio hours consistent with site
- [x] Privacy / analytics — label only; no PII in event props
- [x] SEO / metadata — no route or schema changes
- [x] A11y — link text descriptive; arrow decorative in span
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
