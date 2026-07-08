# AI Hard Review — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Branch:** cursor/social-campaign-pack-0787
**Bugbot runs:** 0 (campaign docs only; manual checklist completed per Bugbot unavailable path)
**Verdict:** pass

## Summary

Social campaign kit EXP-006 ("Prickly pear, but not candy.") adds draft hooks, Pinterest/IG/TikTok variants, UTM-mapped landing URLs to Beles restock and The Letter, and an optional shot list. Copy is sensory and objection-aware; no false stock dates, testimonials, or forbidden phrases. All UTM slugs are lowercase content descriptors without PII.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | Notes align with beles.html pyramid (pear skin, cactus water, mineral air) | n/a |
| praise | content/campaigns/2026-06-29-prickly-pear-not-candy.md | Dual funnel documented with UTM table per growth/utm-system.md | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases; no influencer cadence
- [x] Claims / products.js — no restock dates; restock framed as list signup only
- [x] Privacy / analytics — UTM params contain no PII
- [x] SEO / metadata — n/a (draft campaign doc, no HTML routes)
- [x] A11y — n/a
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
- npm run growth:validate-ai-review — pass
