# Run Log — EXP-008 · weekly_search_to_restock

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock  
**Branch:** growth/search-exp-008-journal-beles-restock-links  
**Loop:** search_to_restock · internal_linking

## Hypothesis

If we strengthen journal → Beles → restock internal links with analytics on every journal CTA, then journal readers will reach the restock form with measurable attribution, because contextual links and direct `#waitlist` paths reduce friction before signup.

## Selection

- `npm run growth:next` returned **EXP-008** (priority 160, internal linking)
- Branch includes EXP-013 journal article (merged from prior search run); EXP-008 adds linking layer only
- Lock acquired; `open_growth_prs_count` = 1 (EXP-013 PR #114 still open)

## Changes

| File | Change |
|---|---|
| `journal.html` | Boutique card → `#waitlist`; index restock band; analytics labels |
| `journal/fico-d-india.html` | Inline Beles/flacon links; analytics CTA; availability copy fix |
| `journal/the-bottle.html` | Restock CTA + analytics; inline Beles link |
| `journal/beles-batch-bl001.html` | Restock CTA block; cluster links; footer restock link |
| `site.css` / `site.min.css` | Journal index restock band styles |

## QA

- `npm run growth:qa` — **pass** (build, verify:all)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-008-ai-review.md`
- Verdict: pass_with_notes (0 block findings)

## Score (QGS = 15)

| Dimension | Score |
|---|---|
| intent | 2 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 3 |
| technical_quality | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |

**Decision:** keep

## Post-launch review

- Monitor `beles_cta_click` labels: `journal_index_restock`, `journal_index_boutique`, `journal_fico_d_india`, `journal_the_bottle`, `journal_beles_batch` on production WA (14d)
- Compare journal → restock form starts vs prior baseline

## Lock footer

- `state.json` lock cleared at run end
