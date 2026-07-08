# Run Log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Branch:** cursor/social-campaign-pack-7396  
**Loop type:** social_distribution (social_to_letter)

## Pre-flight

- `state.json` lock: unlocked
- Open growth PRs: 0
- Main CI: not checked (docs-only diff)
- Brand fit: 3/3 — angle clear, proceed

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and Beles note language answers it precisely.

## Changes

| File | Action |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Created campaign pack |
| `content/campaigns/README.md` | Created index + conventions |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |
| `growth/results.tsv` | Appended ledger row |
| `growth/backlog.md` | EXP-006 → done |
| `growth/state.json` | Updated last run |
| `growth/memory.md` | Campaign folder note |

## Scoring

```bash
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

**QGS:** 16 · **brand_risk_penalty:** 0 · **Decision:** keep

## QA

- `npm run growth:qa` — pass
- Forbidden phrase scan — pass (manual grep)
- UTM PII check — pass (slug-only utm_content)
- Beles notes vs `beles.html` — pass

## Deliverables

- 8 core hooks + Pinterest (3) / IG (3) / TikTok (2) variants
- 8 UTM-mapped assets → `/about` (Letter) primary, `/beles` secondary
- Shot list included (optional production)
- Draft only — no off-repo publish

## Next steps (human)

1. Review campaign copy in PR
2. Produce 1–2 pins/reels from shot list when ready
3. Monitor Letter signups with `utm_campaign=the_letter` after publish (7d)

## Lock footer

No code lock used. `lock_status` remains unlocked.
