# Run log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006  
**Loop:** social_to_letter  
**Branch:** cursor/social-campaign-pack-91a4  
**Status:** keep

## Context check

- `state.json` lock: unlocked
- Open growth PRs: 0
- Main CI: assumed green (no lock/blockers in state)

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and EILLON’s Beles chapter answers it with precise note language.

## Changes

| File | Purpose |
|---|---|
| `content/campaigns/.gitkeep` | Scaffold folder (EXP-034 partial) |
| `content/campaigns/README.md` | Campaign kit index |
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Social kit: 10 hooks, Pinterest/IG/TikTok variants, UTM plan, shot list |

## Campaign summary

- **Angle:** Prickly pear, but not candy — mineral, skin-close Beles framing
- **Brand fit:** 3/3
- **Primary landing:** `/about` (The Letter)
- **Secondary:** `/beles#waitlist`
- **Assets:** 8 UTM variants across Pinterest, Instagram, TikTok

## QA

- Brand safety: DESIGN.md forbidden phrase scan — pass
- UTM: allowed values only; no PII — pass
- AI hard review: `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` — pass_with_notes (Bugbot unavailable; manual checklist)

## Scoring

```bash
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

| Component | Score |
|---|---|
| intent_score | 3 |
| brand_fit_score | 3 |
| conversion_score | 2 |
| discoverability_score | 2 |
| measurement_score | 3 |
| technical_quality_score | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | **16** |

Decision: **keep** (QGS 16 ≥ 13, brand_risk 0)

## Measurement plan

- 7d: UTM-tagged sessions to `/about` with `utm_campaign=the_letter`
- 30d: Letter signups (`product_slug=all`) by `utm_content` variant
- Secondary: Beles restock signups from `prickly_pear_parfum` UTMs

## Next steps (human)

- Review draft kit before any off-repo posting
- Produce visuals per shot list using existing Beles photography where possible
- Rotate bio link `utm_content` weekly per campaign doc

## Lock footer

No code lock held. `state.json` updated at run end.
