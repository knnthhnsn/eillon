# AI Hard Review — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Branch:** cursor/social-campaign-pack-002e
**Bugbot runs:** 0 (Bugbot unavailable in cloud session; manual checklist completed)
**Verdict:** pass_with_notes

## Summary

Campaign kit for EXP-006 reframes prickly pear as mineral/skin-close to address the “too sweet” objection. Primary CTA drives to The Letter (`/about`, `utm_campaign=the_letter`); secondary Beles restock UTMs use `prickly_pear_parfum`. All Beles note language matches `beles.html` and `data/products.js`. No forbidden phrases, PII in UTMs, or fabricated claims. Draft only — no off-repo publish.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | campaign doc | Bugbot not run in cloud session | Manual DESIGN.md + UTM checklist completed per ai-review.md escalation |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | UTM table maps all 8 assets with no PII | n/a |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | CTA copy matches `/about` Letter section | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — Beles notes accurate; no restock dates or guarantees
- [x] Privacy / analytics — UTM params contain no email, name, or user id
- [x] SEO / metadata — n/a (campaign doc only)
- [x] A11y — n/a (no UI changes)
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
