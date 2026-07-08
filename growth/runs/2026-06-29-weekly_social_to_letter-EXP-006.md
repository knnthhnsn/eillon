# Run log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Branch:** cursor/social-campaign-pack-23bf  
**Loop:** social_to_letter  
**Decision:** keep

## Context check

- `state.json`: unlocked, 0 open growth PRs
- Backlog item EXP-006 selected (brand_fit 5, social_distribution loop)
- No HTML changes required — campaign doc only

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection "prickly pear = candy" is common and Beles answers it with precise note language.

## Changes

| File | Change |
|---|---|
| `content/campaigns/README.md` | Scaffold + index |
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Full campaign pack (8 hooks, 3 platforms, UTM plan, shot list) |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |
| `growth/results.tsv` | Ledger row appended |
| `growth/backlog.md` | EXP-006 marked done |
| `growth/memory.md` | Campaign folder note |
| `growth/state.json` | Run metadata updated |

## QA

- Brand safety: pass (DESIGN.md forbidden list scanned)
- UTM: pass (no PII, allowed values per utm-system.md)
- AI hard review: pass_with_notes (Bugbot unavailable; manual checklist)
- `npm run growth:qa`: pass
- `npm run growth:validate-ledger`: pass

## Score

```
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

**qualified_growth_score:** 16 (keep threshold ≥ 13)

## Next steps (human)

1. Review campaign copy before any off-repo posting
2. Produce visuals per shot list (optional)
3. Monitor Letter signups with `utm_campaign=the_letter` after publish (7d signal)

## Lock

No lock set (docs-only). `lock_status`: unlocked
