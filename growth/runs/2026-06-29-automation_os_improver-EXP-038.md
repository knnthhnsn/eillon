# Run log — automation_os_improver — EXP-038

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Evidence reviewed

Ledger (8 rows after EXP-036/037 rebase). Additional signals:

| Source | Pattern |
|---|---|
| EXP-002b | `blocked` — invalid `pending_registration` status corrected in EXP-036 |
| Remote branches | 3+ parallel `cursor/*` branches for conversion-trust, social-campaign, beles-restock experiments |
| EXP-037 | `growth:precheck` added but prompts 03–05 still used manual/implicit lock checks |
| Ledger size | 8 rows (< 10) — OS improver must read memory + run logs per prompt |

## Hypothesis

If we add `npm run growth:ledger-insights` and wire `growth:precheck` into the remaining experiment automations (03–05), then agents avoid duplicate parallel branches and OS improver runs start with structured failure signals, because remote shows repeated cursor branches per EXP and the ledger alone lacks enough rework history.

## Changes

1. `scripts/growth/ledger-insights.mjs` — summarize last N rows (status counts, attention rows, duplicate hints)
2. `package.json` — `growth:ledger-insights` script
3. Automation prompts 03, 04, 05 — call `growth:precheck` at run start
4. Automation prompt 10 — step 1 uses `growth:ledger-insights`
5. `growth/qa-gates.md`, `growth/backlog.md`, `growth/memory.md` — document EXP-038; fix duplicate EXP-036 backlog row

## Scoring

```
intent 2, brand 3, conversion 2, discoverability 1, measurement 3, technical 3
complexity 1, risk 0 → QGS 13
```

## QA

- npm run growth:ledger-insights — pass
- npm run growth:validate-ledger — pass
- npm run growth:precheck — pass
- npm run growth:validate-ai-review — pass
- npm run growth:qa — pass

## Decision

**Status:** keep  
**AI review:** growth/runs/2026-06-29-automation_os_improver-EXP-038-ai-review.md

Lock: unlocked
