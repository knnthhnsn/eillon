# AI Hard Review — EXP-017

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-017-journal-og-images
**Bugbot runs:** 0 (Bugbot unavailable in Cloud Agent; manual checklist per `/growth/ai-review.md`)
**Verdict:** pass_with_notes

## Summary

Journal OG/Twitter image metadata now matches each article hero (webp URLs, width/height, alt). JSON-LD `image` fields aligned. Missing Twitter tags added on batch article. Journal CTAs point to `/beles#waitlist` with `beles_cta_click` analytics labels. No false stock or guarantee claims added.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/fico-d-india.html | Prior OG used product cutout while hero is mood image | fixed — og:image + JSON-LD now beles-mood-1122.webp |
| warn | journal/beles-batch-bl001.html | Missing twitter:image and og dimensions | fixed |
| praise | journal/*.html | Analytics labels on all journal restock CTAs | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no forbidden phrases
- [x] Claims / products.js — "Out of stock" only; no restock dates
- [x] Privacy / analytics — standard beles_cta_click labels; no PII
- [x] SEO / metadata — canonical unchanged; JSON-LD image URLs match og:image
- [x] A11y — og:image:alt added; CTAs unchanged structurally
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
