# AI Hard Review — EXP-013

**Date:** 2026-06-29
**Automation:** weekly_search_to_restock
**Branch:** growth/search-exp-013-oil-rich-parfum
**Bugbot runs:** 1 (Bugbot unavailable in Cloud Agent session; manual checklist per `/growth/ai-review.md` + `.cursor/BUGBOT.md`)
**Verdict:** pass_with_notes

## Summary

Journal article `/journal/what-is-oil-rich-parfum` answers oil-rich parfum search intent with FAQ schema, Beles restock CTA (`journal_oil_rich_parfum` analytics label), internal links from prickly-pear landing and Fico d'India cluster, journal index feature, and sitemap route. No forbidden copy; longevity framed as typical unfold without guarantees; availability language matches Beles awaiting next release.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | journal/fico-d-india.html | Existing restock CTA lacks `data-analytics-event` | pre-existing; out of EXP-013 scope |
| praise | journal/what-is-oil-rich-parfum.html | FAQ JSON-LD + canonical + breadcrumb valid | n/a |
| praise | journal.html | Featured entry + ItemList count updated to 05 | n/a |
| praise | prickly-pear-parfum.html | Cluster link to new article added | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — quiet, sensory, precise; no forbidden phrases
- [x] Claims / products.js — Beles notes and availability language consistent
- [x] Privacy / analytics — `beles_cta_click` on primary CTA only; no PII
- [x] SEO / metadata — unique title/description, canonical, FAQ schema, sitemap
- [x] A11y — skip link, semantic article structure, descriptive links
- [x] Ledger + run log ready

## QA commands

- npm run growth:qa — pass
