# Run log — pr_growth_review gate (EXP-005)

**Date:** 2026-06-29
**Automation:** pr_growth_review
**PR:** https://github.com/knnthhnsn/eillon/pull/44
**Branch:** growth/conversion_copy-exp-005-beles-restock-trust-microcopy
**Verdict:** pass_with_notes (0 block · 1 suggest · 4 praise)

## Checklist

| Gate | Result |
|---|---|
| Draft/WIP stop | Not draft — proceed |
| EXP ID + hypothesis + QGS in PR body | Present (EXP-005, QGS 15) |
| `*-ai-review.md` linked | growth/runs/2026-06-29-manual_next_best_experiment-EXP-005-ai-review.md (validated pass) |
| Forbidden copy (DESIGN.md) | Clean |
| False stock/availability claims | None — aligns with `data/products.js` awaiting-next-release |
| PII in analytics/UTM | No new events or params |
| SEO metadata/canonical | Unchanged title/canonical; FAQ JSON-LD updated consistently |
| Autonomy policy | growth/* only; no forbidden paths; no auto-merge |
| CI | verify pass; Vercel preview pass |

## Findings summary

- **block:** none
- **suggest:** consent wording in HTML vs API `consent_notice_version` audit trail — acceptable; monitor 14d funnel
- **praise:** on-brand trust microcopy; a11y (`aria-label`, `aria-describedby`); consent version bump; ledger/run hygiene

## L2b auto-merge eligibility

Eligible pending this gate verdict (zero blocks, CI green, ai-review pass).
