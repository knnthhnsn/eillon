# Run log — EXP-008

**Date:** 2026-06-29
**Automation:** 40bf91e3-7391-11f1-a8a0-cafc5ef88358
**Experiment:** EXP-008 — Internal links: Journal → Beles → Restock
**Loop:** internal_linking
**Branch:** growth/internal_linking-exp-008-journal-beles-restock-links

## Hypothesis

If we strengthen internal links from journal articles to `/beles#waitlist` with consistent restock CTAs and `beles_cta_click` analytics labels, then journal readers will convert to restock signups at a higher rate, because several articles previously dead-ended on the chapter page without pointing to the waitlist form.

## Changed files

- journal.html — boutique card restock link + dual CTA paths
- journal/the-bottle.html — in-body Beles/restock links; article CTA → `#waitlist` + analytics
- journal/beles-batch-bl001.html — article-page restock CTA; related journal link
- journal/fico-d-india.html — analytics label on existing restock CTA
- growth/state.json — lock during run (cleared below)

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-cron_growth_experiment-EXP-008-ai-review.md

## QGS: 16 — keep

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 2 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |

## Measure

Compare `beles_cta_click` with labels `journal_*` → `restock_form_submitted` on `/beles` over 14d vs prior baseline. Watch journal entry pages as referral source in Vercel WA.

## Lock footer

`lock_status` cleared to `unlocked`; `active_experiment_id` null; `last_successful_loop` EXP-008.

## 12:30Z cron re-verification

- Rebased `growth/internal_linking-exp-008-journal-beles-restock-links` onto latest `origin/main` (c714cf6)
- `npm ci` + `npm run growth:qa` — pass
- Manual Bugbot checklist — zero block findings (Bugbot MCP unavailable)
- AI review artifact validated; opening PR from canonical `growth/*` branch
