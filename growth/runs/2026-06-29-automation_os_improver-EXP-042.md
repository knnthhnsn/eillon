# Run log — EXP-042

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Hypothesis

If we add `growth:bootstrap-branch` to checkout valid `growth/*` from Cloud Agent default `cursor/*`, then experiment automations pass precheck instead of spawning parallel orphan branches, because remote shows 119 `cursor/*` vs 22 `growth/*` and EXP-041 precheck only blocks after agents already land on wrong branch.

## Evidence

- `npm run growth:ledger-insights`: 6 automation_os_improver rows in last 10; all keep; duplicate EXP-005 (experiment + auto-merge log)
- EXP-041 ai-review warn: precheck blocks cursor/* but cannot prevent default branch assignment
- `git branch -r | grep cursor` → 119 branches

## Changes

- `scripts/growth/bootstrap-growth-branch.mjs`
- `package.json`: `growth:bootstrap-branch`
- `growth:precheck` error message points to bootstrap
- Prompt 10 step 0: bootstrap before precheck

## QA

- npm run growth:bootstrap-branch -- os — pass (already on growth/os-2026-06-29)
- npm run growth:validate-ledger — pass
- npm run growth:qa — pass

## Decision

**keep** — QGS 14
