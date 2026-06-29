# AI Hard Review — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Branch:** cursor/social-campaign-pack-6ffd
**Bugbot runs:** 0 (docs-only; manual checklist per ai-review.md)
**Verdict:** pass

## Summary

Social-to-letter campaign pack for EXP-006: ten hooks, Pinterest/IG/TikTok variants, full UTM table, shot list, and measurement plan. Primary CTA drives to The Letter on `/about#letter`; secondary variants to Beles restock. No forbidden copy, no false claims, no PII in UTMs.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | UTM table matches utm-system.md allowed values | n/a |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | Beles notes align with DESIGN.md / memory.md | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — note list matches Beles chapter; no stock dates
- [x] Privacy / analytics — UTMs contain no PII; bio rotation slug documented
- [x] SEO / metadata — n/a (draft kit, no new routes)
- [x] A11y — n/a
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
