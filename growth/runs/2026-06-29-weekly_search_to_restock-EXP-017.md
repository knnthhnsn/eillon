# Run log — weekly_search_to_restock · EXP-017

**Date:** 2026-06-29T16:30Z  
**Automation:** `weekly_search_to_restock`  
**Experiment:** EXP-017 — OG image set for journal articles  
**Branch:** `growth/search-exp-017-journal-og-images`  
**Status:** keep (QGS 14)

## Context

- `growth:next` returned EXP-008 (internal links) but multiple open draft PRs exist for `search_to_restock` seo_content experiments (EXP-008, EXP-013, EXP-023, etc.).
- Selected unblocked **EXP-017** (`technical_seo`, priority 64) — no open PR; fits allowed paths (`journal/**`).

## Hypothesis

If we align journal article OG/Twitter images with hero assets (webp, dimensions, alt) and wire explicit Beles restock CTAs, then social and search referral traffic will reach `/beles#waitlist` with clearer preview cards, because share previews match editorial content and conversion paths are one click away.

## Changes

| File | Change |
|---|---|
| `journal.html` | og:image dimensions + alt |
| `journal/fico-d-india.html` | OG/JSON-LD → beles-mood hero; analytics on CTA |
| `journal/what-does-fico-d-india-smell-like.html` | og:image dimensions + alt |
| `journal/the-bottle.html` | webp OG + dimensions; CTA → `#waitlist` + analytics |
| `journal/beles-batch-bl001.html` | twitter meta + dimensions; restock CTA block + analytics |

## Scoring

```
intent=2 brand=3 conversion=2 discoverability=2 measurement=2 technical=3 complexity=0 risk=0
qualified_growth_score=14
```

## QA

- `npm run growth:qa` — **pass** (after `npm ci` for gsap vendor)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-017-ai-review.md`
- Verdict: `pass_with_notes` (Bugbot unavailable; manual checklist zero blocks)

## Post-merge monitoring

- Social share preview spot-check (4 journal URLs)
- Vercel WA: `beles_cta_click` by label `journal_*` over 14d

## Lock

- Locked at run start; unlocked in footer below.

---
**Lock released:** 2026-06-29T16:45Z · `state.json` → unlocked
