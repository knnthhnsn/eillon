# Run log — EXP-047

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop:** automation_os

## Hypothesis

If we allow `growth/os-YYYY-MM-DD` in branch validation and wire naming checks into `growth:precheck`, then OS improver runs pass their own guard and experiment automations exit early on `cursor/*` branches, because EXP-046 blocked the OS branch pattern while remote still shows 20+ duplicate `cursor/*` PRs.

## Evidence

- `npm run growth:validate-branch-name -- growth/os-2026-06-29` failed after EXP-046 shipped
- Ledger last 10 rows: all `keep`; 10× `automation_os_improver` (same-day OS bundle)
- Remote: duplicate `cursor/*` branches per EXP-006/008 pattern (memory EXP-044)

## Changes

- `scripts/growth/branch-utils.mjs` — shared experiment + OS branch patterns
- `scripts/growth/validate-branch-name.mjs` — `--current` flag; OS pattern allowed
- `scripts/growth/check-state.mjs` — branch guard in `--for-automation` precheck
- `growth/program.md`, `growth/qa-gates.md`, prompts 02/09/10, `ledger-insights.mjs`

## QA

- `npm run growth:validate-branch-name -- growth/os-2026-06-29` → OK
- `npm run growth:validate-branch-name -- cursor/automation-os-improvements-8e26` → blocked
- `npm run growth:precheck` → OK on `growth/os-2026-06-29`
- `npm run growth:qa` → pass

## Decision

**keep** — QGS 14, brand_risk 0

## Lock

No lock set (docs/scripts only).
