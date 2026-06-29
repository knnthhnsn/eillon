# Run Log — weekly_social_to_letter · EXP-006

**Date:** 2026-06-29  
**Automation:** weekly_social_to_letter  
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."  
**Branch:** cursor/social-campaign-pack-be5b  
**Loop:** social_to_letter (`social_distribution`)

## Pre-flight

- [x] Read AGENTS.md, program.md, autonomy-policy.md, ai-review.md, utm-system.md
- [x] state.json: unlocked, 0 open growth PRs
- [x] Backlog item EXP-006 selected (brand_fit 5, social_distribution loop)
- [x] Campaign angle clear — brand_fit ≥ 2

## Hypothesis

If we publish quiet social hooks positioning prickly pear as mineral and airy—not candy-sweet—then visual-discovery audiences on Pinterest, Instagram, and TikTok will click through to Beles or The Letter, because the copy matches niche buyer language and rejects generic fruit-perfume expectations.

## Changes

| File | Action |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Created campaign pack |
| `growth/results.tsv` | Appended ledger row |
| `growth/backlog.md` | EXP-006 → done |
| `growth/memory.md` | Updated campaigns fact |
| `growth/state.json` | Run metadata |

No HTML changes required.

## QA

```bash
npm run growth:qa          # pass (after npm ci)
npm run growth:validate-ledger
npm run growth:validate-ai-review -- growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md
```

## Scoring

```bash
npm run growth:score -- --intent 3 --brand 3 --conversion 2 --discoverability 2 --measurement 3 --technical 3 --complexity 0 --risk 0
```

**QGS:** 16 · **brand_risk:** 0 · **Decision:** keep

## AI hard review

Artifact: `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md`  
Verdict: pass_with_notes (Bugbot unavailable — manual checklist completed)

## Notes

- First campaign kit in `/content/campaigns/` — fulfills partial EXP-034 scaffold intent
- Dual funnel: Beles discovery (primary product intent) + The Letter (relationship)
- Draft only; human publishes off-repo

## Lock footer

`lock_status`: unlocked (no code lock required for docs-only run)
