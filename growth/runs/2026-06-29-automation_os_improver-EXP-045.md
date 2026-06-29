# Run log — EXP-045

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop:** automation_os

## Hypothesis

If we replace the notes-based "invalid loop" warn in `ledger-insights` with a shipped-EXP summary, then OS improver runs get accurate signals without false alarms from EXP-043 fix notes.

## Evidence

- EXP-043 ledger notes contain "invalid loop types" — triggered false WARN on every `--last=10` run

## Changes

- `scripts/growth/ledger-insights.mjs` — shipped content EXP list; improved duplicate-ID follow-up text

## Decision

**keep** — QGS 14
