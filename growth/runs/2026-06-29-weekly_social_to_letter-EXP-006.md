# Run log — EXP-006

**Date:** 2026-06-29
**Automation:** weekly_social_to_letter
**Experiment:** EXP-006 — Social kit: "Prickly pear, but not candy."
**Loop:** social_to_letter
**Branch:** cursor/social-campaign-pack-0787

## Hypothesis

If we draft a social kit framing Beles as prickly pear without candy sweetness, then niche fragrance seekers on Pinterest, Instagram, and TikTok will click through to Beles restock or The Letter, because sensory copy matches skin-scent and "not too sweet" search language.

## Changed files

- content/campaigns/README.md — campaign index scaffold
- content/campaigns/2026-06-29-prickly-pear-not-candy.md — full campaign pack (10 hooks, 3 platform variants, UTM plan, shot list)
- growth/backlog.md — EXP-006 marked done
- growth/memory.md — campaign kits fact appended
- growth/results.tsv — ledger row appended
- growth/state.json — run metadata updated

## Deliverables

- 10 core hooks in EILLON voice
- Pinterest (3 pins), Instagram (feed/reel/story/bio), TikTok (3 scripts)
- 10 UTM-mapped URLs (7 Beles restock, 3 The Letter)
- Optional 8-shot editorial list

## QA

- npm run growth:qa — pass
- Brand safety: DESIGN.md forbidden phrase scan — clean
- AI review: growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md — pass

## QGS: 16 — keep

## Measure

- 7d: UTM-tagged sessions by `utm_content` on Pinterest/IG/TikTok
- 30d: `restock_form_submitted` rate from `prickly_pear_parfum` and `skin_scent` campaigns vs baseline
- 30d: `product_slug=all` signups from `the_letter` campaign UTMs

## Lock

No code lock required (docs-only). `lock_status` remains unlocked.
