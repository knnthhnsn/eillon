# Run log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29T14:00Z  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006  
**Branch:** cursor/social-campaign-pack-0711  
**Loop:** social_to_letter  
**Status:** keep

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and EILLON’s Beles chapter answers it with precise note language.

## Changes

| File | Action |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Created campaign pack |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |
| `growth/results.tsv` | Appended ledger row |
| `growth/backlog.md` | EXP-006 → done |
| `growth/memory.md` | Campaign folder + EXP-006 note |
| `growth/state.json` | Run metadata updated |

## Campaign summary

- **Angle:** Prickly pear reframed — mineral, skin-close, not candy (addresses "too sweet?" objection)
- **Primary CTA:** The Letter (`/about`, `utm_campaign=the_letter`)
- **Secondary CTA:** Beles restock (`/beles`, `utm_campaign=prickly_pear_parfum`)
- **Platforms:** Pinterest (3 pins), Instagram (feed/reel/story), TikTok (2 variants)
- **Hooks:** 10 platform-agnostic captions
- **Shot list:** 6 optional production shots (no founder VO)

## Scoring

```
intent=3 brand=3 conversion=2 discoverability=2 measurement=3 technical=3 complexity=0 risk=0
QGS=16 (keep)
```

## AI hard review

- Verdict: **pass_with_notes** (Bugbot unavailable; manual checklist clean)
- Artifact: `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md`

## QA

- `npm run growth:qa` — see command output below
- `npm run growth:validate-ai-review` — see command output below
- Forbidden phrase scan: clean (no DESIGN.md violations in campaign copy)

## Measurement plan

- 7d: Letter signups (`product_slug=all`) with `utm_campaign=the_letter`
- 30d: Compare UTM content variants; scale best-performing pin/reel
- Secondary: Beles restock submits from `prickly_pear_parfum` UTMs

## Next steps (human)

1. Review campaign doc for publish approval
2. Produce visuals per shot list (existing Beles photography preferred)
3. Schedule posts manually — draft only, no auto-post
4. Monitor Vercel WA for UTM-tagged sessions

## Lock

No code lock required (docs-only). `lock_status` remains unlocked.
