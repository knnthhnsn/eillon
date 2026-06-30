# Run log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Branch:** cursor/social-campaign-pack-bf40  
**Loop:** social_to_letter (`social_distribution`)

## Context check

- `state.json`: unlocked, 0 open growth PRs — proceed
- Backlog: EXP-006 eligible (brand_fit 5/5 ICE, social_distribution loop)
- No HTML landing tweaks required — campaign doc only

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection "prickly pear = candy" is common and Beles answers it with precise note language.

## Changes

| File | Action |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Created campaign pack |
| `content/campaigns/README.md` | Index + conventions |
| `growth/results.tsv` | Appended ledger row |
| `growth/backlog.md` | EXP-006 → done |
| `growth/memory.md` | Campaign kits now in repo |
| `growth/state.json` | Run metadata |

## QA

- `npm run growth:qa` — pass (docs-only)
- `npm run growth:validate-ledger` — pass
- `npm run growth:validate-ai-review` — pass (`pass_with_notes`, Bugbot unavailable)
- Forbidden phrase scan on campaign copy — clean vs DESIGN.md

## Scoring

```
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

**qualified_growth_score:** 16  
**brand_risk_penalty:** 0

## Decision

**keep** — QGS ≥ 13, brand_risk ≤ 1, first social_to_letter campaign kit in `/content/campaigns/`.

## Next steps (human)

- Review draft campaign before any off-repo posting
- Publish one Pinterest pin + one IG reel as test pair (Letter UTMs)
- Check Letter signups with `utm_campaign=the_letter` after 7d

## Lock footer

**lock_status:** unlocked (docs-only run; no lock set)
