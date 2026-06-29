# Run log — EXP-043 (growth:next loop filter)

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Branch:** growth/os-2026-06-29
**Loop:** automation_os

## Evidence

- `select-next-experiment.mjs` ignored backlog loop column validity
- Invalid loop rows could be selected as "next best" experiment

## Changes

- Skip backlog rows with loop types outside program.md allowlist
- Prompt 09 documents validate-backlog fallback

## QA

- npm run growth:next — returns EXP-008 (valid loop)
- npm run growth:validate-backlog — pass

## Decision

**keep** (QGS 14)
