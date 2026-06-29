# Run log — EXP-020 · weekly_search_to_restock

**Date:** 2026-06-29  
**Automation:** `weekly_search_to_restock`  
**Branch:** `growth/search-exp-020-craftsmanship-beles-restock`  
**Loop:** search_to_restock · internal_linking  
**Status:** keep

## Context

- Skipped EXP-008/013/023/024/033/011/019 — open cursor PRs for same search loop experiments
- Picked EXP-020 (craftsmanship → Beles restock) as highest-priority unblocked search-funnel item
- 0 open `growth/*` PRs; state lock acquired

## Hypothesis

If we add a Beles restock trust block and tracked CTA on `/craftsmanship` with internal links from the journal Fico cluster, then formulation-curious search visitors will reach the waitlist with stronger product context, because craftsmanship proof answers composition questions before signup.

## Changes

| File | Change |
|---|---|
| `craftsmanship.html` | `shop__restock-trust` block; CTA → `/beles#waitlist` with `craftsmanship_restock` analytics |
| `journal/fico-d-india.html` | Link to `/craftsmanship#wear-testing` in oil-rich section |
| `journal/what-does-fico-d-india-smell-like.html` | Link to wear-testing methodology in comparison list |

## QGS

| intent | brand | conversion | discoverability | measurement | technical | complexity | risk | **QGS** |
|--------|-------|------------|-----------------|-------------|-----------|------------|------|---------|
| 2 | 3 | 3 | 2 | 2 | 3 | 0 | 0 | **15** |

## QA

```bash
npm run growth:qa  # pass
```

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-020-ai-review.md`
- Verdict: **pass_with_notes** (Bugbot unavailable; manual checklist, 0 block findings)

## Monitor (14d)

- `beles_cta_click` label `craftsmanship_restock` vs journal labels
- Journal → craftsmanship click-through (if section events added later)
- Restock form starts from `/craftsmanship` referrer in Vercel WA

## Footer

- Lock released: yes
- Ledger appended: yes
