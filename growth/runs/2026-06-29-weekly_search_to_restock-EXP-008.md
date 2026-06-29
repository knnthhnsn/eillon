# Run log — EXP-008

**Date:** 2026-06-29  
**Automation:** weekly_search_to_restock  
**Experiment:** EXP-008 — Internal links: Journal → Beles → Restock  
**Branch:** growth/search-exp-008-journal-beles-links  
**Status:** keep (QGS 16)

## Hypothesis

If we strengthen internal links from journal articles to Beles `#waitlist` with analytics labels, then journal readers will reach the restock signup with lower friction, because every article surface now has an explicit conversion path.

## Changes

- `journal/beles-batch-bl001.html` — inline restock link + article CTA block
- `journal/the-bottle.html` — CTA → `#waitlist`, body link to Beles chapter
- `journal/fico-d-india.html` — analytics on existing restock CTA
- `journal.html` — restock link on Beles boutique card
- `beles.html` — reciprocal links to smell article and prickly-pear landing

## Scoring

| Dimension | Score |
|---|---|
| intent | 2 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 3 |
| technical_quality | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **QGS** | **16** |

## QA

- `npm run growth:qa` — pass (build, verify:all)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_search_to_restock-EXP-008-ai-review.md`
- Verdict: pass_with_notes (Bugbot unavailable; manual checklist)

## Notes

- Skipped EXP-005 (conversion_copy — wrong loop) and duplicate search content PRs (EXP-013/023 open on cursor/* branches)
- Next search priority: EXP-013 merge or EXP-023 after open PRs clear

## Lock footer

- Lock released: 2026-06-29T10:30:00Z
