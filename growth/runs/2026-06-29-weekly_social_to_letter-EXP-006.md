# Run: EXP-006 · weekly_social_to_letter

**Date:** 2026-06-29  
**Agent:** Cursor Cloud Agent (automation_id: weekly_social_to_letter)  
**Branch:** cursor/social-campaign-pack-7e97  
**Loop type:** social_distribution  
**Lock:** unlocked (docs-only; no lock taken)

## Hypothesis

If we publish a quiet sensory social kit reframing prickly pear as mineral and skin-close (not sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and Beles restock windows, because the objection “prickly pear = candy” is common and EILLON’s Beles chapter answers it with precise note language.

## Context read

- [x] AGENTS.md
- [x] growth/program.md
- [x] growth/autonomy-policy.md
- [x] growth/ai-review.md
- [x] growth/utm-system.md
- [x] growth/state.json
- [x] growth/backlog.md
- [x] growth/results.tsv
- [x] growth/memory.md
- [x] DESIGN.md

## Pre-flight checks

| Check | Result |
|---|---|
| lock_status | unlocked |
| open_growth_prs_count | 0 (state.json) |
| brand_fit ≥ 2 | 3/3 — clear campaign angle |
| main CI | not blocking (docs-only) |

## Changes

| File | Summary |
|---|---|
| `content/campaigns/2026-06-29-prickly-pear-not-candy.md` | Full social kit: 10 hooks, Pinterest/IG/TikTok variants, UTM plan, shot list |
| `content/campaigns/README.md` | Campaign folder index and conventions (EXP-034 scaffold) |
| `growth/runs/2026-06-29-weekly_social_to_letter-EXP-006-ai-review.md` | AI hard review artifact |
| `growth/results.tsv` | Ledger row appended |
| `growth/backlog.md` | EXP-006, EXP-034 marked done |
| `growth/memory.md` | Campaign folder fact appended |
| `growth/state.json` | Run metadata updated |

## QA

| Gate | Result |
|---|---|
| npm run growth:qa | pass |
| brand safety (DESIGN.md forbidden list) | pass — manual grep |
| UTM privacy (no PII) | pass |
| Beles notes vs products.js | pass |

## Scores

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
| **qualified_growth_score** | **16** |

## Decision

**Status:** keep

## Notes

- Primary CTA: The Letter (`/about`); secondary Beles restock for prickly-pear-intent assets.
- Draft only — no social posting. Human review before off-repo publish.
- Other draft PRs exist for EXP-006 on parallel cursor branches; this run is the canonical pack on `cursor/social-campaign-pack-7e97`.

## Durable learnings (for memory.md)

- First campaign kit shipped under `/content/campaigns/`; EXP-006 angle validated at brand_fit 3.

## Follow-ups

- Close duplicate EXP-006 draft PRs after merge
- 7d: check UTM-tagged Letter signups once assets are published manually
- EXP-007: distinct newsletter analytics events would improve measurement
