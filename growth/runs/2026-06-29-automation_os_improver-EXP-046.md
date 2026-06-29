# Run log — EXP-046

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop:** automation_os

## Hypothesis

If we enforce `growth/<loop>-exp-NNN-<slug>` and reject `cursor/*` via `growth:validate-branch-name`, then agents cannot bypass the growth PR cap and duplicate-branch pattern, because autonomy-policy requires `growth/*` branches but Cloud Agents default to `cursor/*`.

## Evidence

- Open PRs #57–82 overwhelmingly use `cursor/social-campaign-pack-*`, `cursor/growth-experiment-execution-*`
- EXP-005 branch on ledger uses correct `growth/conversion_copy-exp-005-*` pattern

## Changes

- `scripts/growth/validate-branch-name.mjs`
- `scripts/growth/create-experiment-branch-name.mjs` — normalized loop slug + stderr reminder
- `package.json`, `qa-gates.md`, experiment prompts

## QA

- `growth:validate-branch-name -- growth/internal_linking-exp-008-journal-beles` → OK
- `growth:validate-branch-name -- cursor/growth-experiment-execution-4853` → blocked

## Decision

**keep** — QGS 14
