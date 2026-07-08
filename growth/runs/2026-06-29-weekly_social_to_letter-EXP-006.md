# Run log — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."
**Loop:** social_distribution (social_to_letter)

## Hypothesis

If we publish a quiet social kit reframing prickly pear as green-pink and mineral (not candy-sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter, because objection-aware sensory copy matches demand for close-wearing, non-sweet skin scents.

## Changed files

- content/campaigns/2026-06-29-prickly-pear-not-candy.md (new)
- growth/results.tsv (append)
- growth/backlog.md (EXP-006 → done)
- growth/memory.md (campaign folder note)
- growth/state.json (run metadata)

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md — pass_with_notes (0 blocks)

## QGS: 15 — keep

| Component | Score |
|---|---|
| intent | 2 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 2 |
| measurement | 3 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |

## Notes

- Primary landing: `/about#letter` with `utm_campaign=the_letter`
- Secondary discovery path: `/beles` with `utm_campaign=prickly_pear_parfum`
- EXP-007 (newsletter analytics events) would improve post-launch measurement
- Draft only — no social posting from automation

## Lock

No code lock required (docs-only). `lock_status` remains unlocked.
