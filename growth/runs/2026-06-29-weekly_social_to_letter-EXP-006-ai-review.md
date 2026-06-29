# AI Hard Review — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Branch:** cursor/social-campaign-pack-6753
**Bugbot runs:** 0 (Bugbot unavailable; manual checklist completed per ai-review.md escalation)
**Verdict:** pass_with_notes

## Summary

Campaign kit EXP-006 drafts 10 hooks plus Pinterest, Instagram, and TikTok variants driving to The Letter (`/about`) with Beles as secondary. Beles note language matches `data/products.js`. UTM plan uses allowed values only; no PII in params. No forbidden DESIGN.md phrases detected. Draft-only — no off-repo publish.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| note | growth/runs/* | Bugbot unavailable in Cloud Agent session | Manual checklist completed; verdict pass_with_notes |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | UTM table maps all 8 assets with allowed campaign values | n/a |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | Beles notes align with products.js pyramid | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — notes match Beles; no false stock or restock dates
- [x] Privacy / analytics — UTM slugs only; no email/name in utm_content
- [x] SEO / metadata — n/a (campaign doc only)
- [x] A11y — n/a
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
