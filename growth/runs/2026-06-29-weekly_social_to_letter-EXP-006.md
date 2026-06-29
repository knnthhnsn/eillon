# Run log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Branch:** cursor/social-campaign-pack-71b5  
**Loop:** social_to_letter  
**Lock:** none (docs-only)

## Context read

- AGENTS.md, program.md, autonomy-policy.md, ai-review.md, utm-system.md
- state.json (unlocked, 0 open growth PRs)
- backlog.md, results.tsv, memory.md, DESIGN.md

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and Beles · Fico d'India answers it with precise note language.

## Deliverables

| File | Purpose |
|---|---|
| `content/campaigns/README.md` | Campaign folder index (EXP-034 scaffold) |
| `content/campaigns/.gitkeep` | Folder anchor |
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Full campaign pack |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |

## Campaign summary

- **Angle:** Prickly pear without candy sweetness — mineral, watery, close-wearing
- **Primary CTA:** The Letter at `/about#letter`
- **Secondary CTA:** Beles restock at `/beles#waitlist`
- **Assets:** 10 hooks, 3 Pinterest, 3 Instagram, 2 TikTok variants + shot list
- **UTM:** 8 tracked variants per utm-system.md

## Scoring

```bash
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

**QGS:** 16 (keep threshold ≥ 13)

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 2 |
| measurement | 3 |
| technical | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |

## QA

- [x] `npm run growth:qa`
- [x] `npm run growth:validate-ai-review`
- [x] Forbidden phrase scan (manual grep)
- [x] Beles notes verified against beles.html

## Decision

**keep** — draft campaign ready for human publish review. No off-repo posting.

## Backlog updates

- EXP-006 → done
- EXP-034 (campaign folder scaffold) → done (included in this run)

## Memory updates

- First campaign kit landed in `/content/campaigns/` (2026-06-29)

## Next steps (human)

1. Review campaign copy in PR
2. Produce visuals per shot list (optional)
3. Publish to social with UTM links when ready
4. Review UTM performance at 7d per scorecard
