# AI Hard Review — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Branch:** cursor/social-campaign-pack-3779
**Bugbot runs:** 0 (Bugbot unavailable; manual checklist completed)
**Verdict:** pass_with_notes

## Summary

Campaign kit `content/campaigns/2026-06-29-prickly-pear-not-candy.md` for social_to_letter loop. Eight hooks, Pinterest/IG/TikTok variants, nine UTM-mapped assets, primary landing `/about#letter`, secondary `/beles`. No false claims; forbidden phrase scan clean. Off-repo posting remains human-only.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| note | content/campaigns/2026-06-29-prickly-pear-not-candy.md | First campaign in `/content/campaigns/` | acceptable — EXP-034 scaffold fulfilled |
| note | measurement | Newsletter distinct events not yet shipped (EXP-007) | document in run log; UTM plan still valid |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; quiet sensory voice
- [x] Claims / products.js — Beles notes match; no stock/restock date claims
- [x] Privacy / analytics — UTMs use allowed values; no PII in utm_content
- [x] SEO / metadata — n/a (campaign doc only)
- [x] A11y — n/a
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
