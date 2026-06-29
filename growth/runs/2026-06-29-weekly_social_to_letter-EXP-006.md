# Run Log — weekly_social_to_letter / EXP-006

**Date:** 2026-06-29T08:34Z  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Loop:** social_to_letter  
**Branch:** cursor/social-campaign-pack-8554  
**Decision:** keep

## Context check

- `state.json` lock: unlocked
- Open growth PRs: 0
- CI on main: not checked (docs-only; no code gate required beyond growth:qa)

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection "prickly pear = candy" is common and Beles answers it with precise note language.

## Changes

| File | Change |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Campaign pack (8 hooks, 3 platform variant sets, UTM table, shot list) |
| `content/campaigns/README.md` | Campaign folder index |
| `growth/results.tsv` | Ledger row appended |
| `growth/backlog.md` | EXP-006 marked done |
| `growth/state.json` | Run metadata updated |
| `growth/memory.md` | First campaign kit logged |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |

## Scoring

```bash
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 2 |
| measurement | 3 |
| technical_quality | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **QGS** | **18** |

## QA

- [x] Brand safety vs DESIGN.md forbidden list
- [x] UTM params — no PII
- [x] AI hard review artifact validated
- [x] Ledger appended (not overwritten)
- [x] Draft only — no social posting

## Next steps (human)

1. Review campaign copy in PR
2. Produce assets from shot list when ready
3. Publish off-repo only after approval
4. Monitor Letter signups with `utm_campaign=the_letter` (7d check)

## Lock footer

No lock set (docs-only run). `lock_status` remains unlocked.
