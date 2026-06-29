# Run log — EXP-023

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Experiment:** EXP-023 — "Skin scent" journal FAQ + cluster links
**Loop:** search_to_restock (seo_content)
**Branch:** growth/search-exp-023-skin-scent-faq

## Hypothesis

If we publish a journal article explaining what a skin scent is with FAQ schema and Beles internal links, then skin-scent search intent will convert to restock visits with clearer wear expectations, because the article matches how niche buyers phrase close-wearing parfum.

## Selection rationale

Skipped EXP-008/013/010/011/019/020/033 (open PRs for same loop). EXP-023 had no open PR and priority 80 in backlog.

## Changed files

- journal/what-is-a-skin-scent.html (new)
- journal.html, journal/what-does-fico-d-india-smell-like.html, prickly-pear-parfum.html
- scripts/generate-sitemap.mjs, sitemap.xml
- growth/state.json (lock)

## QA

- npm run growth:qa — pass (after `npm ci` for gsap vendor)
- AI review: growth/runs/2026-06-29-weekly_search_to_restock-EXP-023-ai-review.md — pass_with_notes

## QGS: 16 — keep

| Dimension | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 3 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |

## Monitor

- GSC impressions/clicks for "skin scent" cluster (14–28d)
- `beles_cta_click` with label `journal_skin_scent_article` on /beles from journal path

## Lock footer

State unlocked at end of run.
