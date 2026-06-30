# Run log — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."
**Loop:** social_to_letter
**Branch:** cursor/social-campaign-pack-002e

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and EILLON’s Beles chapter answers it with precise note language.

## Changed files

- content/campaigns/2026-06-29-prickly-pear-not-candy.md — full campaign pack (hooks, platform variants, UTM plan, shot list)
- growth/backlog.md — EXP-006 marked done
- growth/results.tsv — ledger row appended
- growth/memory.md — campaign folder + EXP-006 note
- growth/state.json — run metadata updated

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md

## QGS: 16 — keep

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 2 |
| measurement | 3 |
| technical | 3 |
| complexity | 0 |
| brand_risk | 0 |

## Measure

Track UTM-tagged sessions to `/about` (the_letter campaign) and `/beles` (prickly_pear_parfum secondary). Success signal (7d): Letter signups with `product_slug=all` where UTM campaign = `the_letter`. Secondary: `restock_form_submitted` from prickly_pear_parfum UTMs.

## Lock

No lock required — docs-only experiment.
