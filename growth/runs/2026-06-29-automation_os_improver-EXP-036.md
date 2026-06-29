# Run log — automation_os_improver — EXP-036

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Evidence reviewed

Ledger has 4 rows (not 10). Patterns from available data:

| Row | Status | Pattern |
|---|---|---|
| EXP-002b | was `pending_registration` | Invalid ledger status — program.md allows keep/rework/discard/blocked only |
| EXP-002 | keep | Notes reference pending_registration in registry (correct place) |
| memory.md | — | Build failures (GSAP vendor, numpy) caused QA friction |

## Hypothesis

If we enforce canonical ledger statuses and bootstrap dependencies in `growth:qa`, then scheduled agents will fail fast with actionable errors instead of silent invalid ledger rows or opaque build failures, because EXP-002b proved registration blockers were logged with a non-standard status and fresh environments skip npm ci.

## Changes

1. `scripts/growth/validate-ledger.mjs` — status enum, loop_type, date, QGS arithmetic, keep-rule check
2. `scripts/growth/qa.mjs` — `npm ci` when GSAP vendor missing
3. `growth/results.tsv` — EXP-002b status `pending_registration` → `blocked`
4. `growth/automation-prompts/10-automation-os-improver.md` — fallback evidence sources, ledger rules
5. `growth/qa-gates.md` — ledger status rules documented

## Scoring

```
intent 2, brand 3, conversion 2, discoverability 1, measurement 3, technical 3
complexity 1, risk 0 → QGS 13
```

## QA

- npm run growth:validate-ledger — pass
- npm run growth:validate-ai-review — pass
- npm run growth:qa — pass

## Decision

**Status:** keep  
**AI review:** growth/runs/2026-06-29-automation_os_improver-EXP-036-ai-review.md

Lock: unlocked
