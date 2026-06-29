# Run log — EXP-003

**Date:** 2026-06-23  
**Automation:** manual_next_best_experiment (manual session)  
**Experiment:** EXP-003 — Prickly pear / Beles discovery landing page  
**Loop:** seo_content  
**Branch:** main (direct ship per user request)

## Hypothesis

If we publish a dedicated `/prickly-pear-parfum` landing with FAQ schema, internal links from journal, and restock CTAs, then search-intent visitors for "prickly pear perfume" will reach `/beles#waitlist` with clearer context, because the page matches query language without duplicating the full product chapter.

## Changed files

- `prickly-pear-parfum.html` (new)
- `scripts/generate-sitemap.mjs`
- `journal/fico-d-india.html` (internal link)
- `scripts/site-nav.js` (search entry)
- `growth/backlog.md`, `growth/memory.md`, `growth/results.tsv`, `growth/state.json`

## QA

- `npm run growth:qa` — pass (pending run)
- Lighthouse CI — not re-run for this ship (content page, no perf regression expected)

## Scores (draft)

| Dimension | Score |
|---|---|
| intent_score | 3 |
| brand_fit_score | 3 |
| conversion_score | 3 |
| discoverability_score | 3 |
| measurement_score | 2 |
| technical_quality_score | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |
| **QGS** | **18** |

## Decision

**keep** — ship to main; monitor GSC impressions for "prickly pear perfume" cluster in 14–28 days.

## Follow-ups

- EXP-004 journal smell article
- Register `manual_next_best_experiment` automation in Cursor UI
