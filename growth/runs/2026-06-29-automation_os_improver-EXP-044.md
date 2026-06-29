# Run log — EXP-044

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop:** automation_os

## Hypothesis

If we add `growth:check-exp-shipped` and filter shipped EXPs in `growth:next`, then experiment automations stop re-running work already logged as keep, because remote shows 20+ duplicate `cursor/*` PRs for EXP-006/008 while ledger only has keep for EXP-003–005.

## Evidence

- `gh pr list`: 6+ open PRs each for EXP-006, EXP-008, EXP-027 on `cursor/*` branches
- Ledger: EXP-005 keep (conversion_copy) but weekly_conversion_trust prompt still listed EXP-005 as example
- `growth:next` previously ignored ledger when selecting backlog

## Changes

- `scripts/growth/ledger-utils.mjs` — shared ledger read + `isExperimentShipped()`
- `scripts/growth/check-exp-shipped.mjs` — CLI guard
- `scripts/growth/select-next-experiment.mjs` — skip ledger-shipped EXPs
- Updated prompts 02–05, 09 and `program.md` master loop

## QA

- `npm run growth:check-exp-shipped -- EXP-005` → blocked
- `npm run growth:check-exp-shipped -- EXP-008` → OK
- `npm run growth:next` → EXP-008

## Decision

**keep** — QGS 13
