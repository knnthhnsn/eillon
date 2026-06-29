# Run log — weekly_search_to_restock · EXP-010

**Date:** 2026-06-29  
**Automation:** `weekly_search_to_restock`  
**Experiment:** EXP-010 — Copenhagen appointment discovery (about)  
**Branch:** `growth/search-exp-010-copenhagen-discovery`  
**Status:** keep (QGS 17)

## Context

Skipped EXP-008/013/023/024/033 (open cursor PRs for search_to_restock). Selected unblocked EXP-010 (priority 96) for local/Copenhagen niche intent → Beles restock path.

## Hypothesis

If we publish Copenhagen niche perfume discovery content on `about.html` with FAQ schema, studio trust copy, and Beles restock CTA, then local and studio-intent searchers will convert to restock list visits or appointment requests, because query-matched copy answers how to find and experience EILLON in Copenhagen before purchase.

## Changes

| File | Change |
|---|---|
| `about.html` | FAQ schema + visible studio/Copenhagen FAQ; studio appointment CTA + analytics; Beles restock trust block; primary restock CTA; meta keywords |
| `growth/state.json` | Lock during run |

## Scoring

| Dimension | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 3 |
| technical_quality | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **QGS** | **17** |

## QA

```bash
npm ci
npm run growth:qa  # pass
```

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-010-ai-review.md`
- Verdict: `pass_with_notes` (Bugbot unavailable; manual checklist)

## Measurement (14–28d)

- Organic impressions/clicks for "niche perfume Copenhagen" cluster (GSC)
- `beles_cta_click` with labels `about_restock`, `about_faq_restock`
- `studio_appointment_click` label `about_studio`

## Lock footer

`lock_status` cleared to `unlocked` at run end.
