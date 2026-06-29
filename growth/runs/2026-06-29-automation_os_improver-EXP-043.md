# Run log — EXP-043

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Hypothesis

If we wire `growth:check-exp-shipped` into weekly experiment prompts 02–05, then scheduled agents skip already-shipped EXP IDs instead of re-running done work, because EXP-041 only wired the guard to prompt 09 and backlog shows EXP-003/004/005 marked done.

## Evidence

- Ledger has keep rows for EXP-003, EXP-004, EXP-005
- Remote still shows parallel cursor branches for shipped experiments
- Prompt 02 default still referenced EXP-003 (done) — updated to EXP-008

## Changes

- Prompts 02, 03, 04, 05: check-exp-shipped step + bootstrap step
- Prompt 02: branch naming aligned to `growth/<loop>-exp-NNN-<slug>`
- Prompt 04: fixed duplicate step numbering

## Decision

**keep** — QGS 13
