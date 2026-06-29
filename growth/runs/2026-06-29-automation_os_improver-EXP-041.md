# Run log — automation_os_improver

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Experiment:** EXP-041 — Branch naming guard + check-exp-shipped
**Branch:** growth/os-2026-06-29
**Bundle:** EXP-036–041 (growth OS safety bundle)

## Hypothesis

If we enforce `growth/*` branch naming in `growth:precheck` and add `growth:check-exp-shipped`, then agents stop spawning duplicate `cursor/*` branches and re-shipping done experiments, because ledger-insights shows repeated `automation_id` rows and remote has 10+ `cursor/*` branches per EXP.

## Evidence (ledger insights)

```
Ledger insights (last 10 of 13 rows)
Status counts: keep: 10
No rework/blocked/discard rows in window.
WARN: duplicate experiment_id in window: EXP-005
Repeated automation_id in window:
  manual_next_best_experiment: 3 rows
  automation_os_improver: 5 rows
```

Additional evidence: `git branch -r | grep cursor/conversion-trust` shows 12 parallel branches; same pattern for social-campaign and beles-restock.

## Changes (EXP-041)

- `scripts/growth/branch-utils.mjs` — shared naming rules
- `scripts/growth/validate-branch-name.mjs` — standalone branch check
- `scripts/growth/check-exp-shipped.mjs` — block re-run of shipped EXP IDs
- `scripts/growth/check-state.mjs` — branch validation in `--for-automation` precheck
- `scripts/growth/create-experiment-branch-name.mjs` — validate generated names
- Prompts 09/10 + qa-gates updated

## Prior bundle (EXP-036–040, same branch)

| EXP | Change |
|---|---|
| EXP-036 | Ledger validation + QA npm ci bootstrap |
| EXP-037 | `growth:precheck` automation gate |
| EXP-038 | `growth:ledger-insights` + precheck on prompts 03–05 |
| EXP-039 | `growth:auto-merge-cap` for L2b policy |
| EXP-040 | OS improver scope guard + sitemap drift revert |

## QA

- npm run growth:precheck — pass
- npm run growth:validate-branch — pass
- npm run growth:check-exp-shipped -- EXP-008 — pass
- npm run growth:check-exp-shipped -- EXP-005 — blocked (expected)
- npm run growth:validate-ledger — pass
- npm run growth:ledger-insights — pass
- npm run growth:auto-merge-cap — pass
- npm run growth:qa — pass

## AI hard review

`growth/runs/2026-06-29-automation_os_improver-EXP-041-ai-review.md` — pass_with_notes

## Decision

**keep** — QGS 13, brand_risk 0. Open PR for human merge (OS bundle not L2b auto-merge eligible).
