# Run: EXP-002 · manual_os_build

**Date:** 2026-06-28  
**Agent:** Composer 2.5  
**Branch:** main (OS scaffold)  
**Loop type:** automation_os

## Hypothesis

If we add Cursor rules, automation prompts, registry, QA scripts, and autonomy policy, then scheduled agents can resume growth work safely from the repo alone, because instructions and guardrails are version-controlled.

## Changes

| File | Summary |
|---|---|
| growth/* | Full OS structure |
| .cursor/rules/* | 8 project rules |
| scripts/growth/* | validate, score, qa, next, branch |
| AGENTS.md, DESIGN.md | Root agent + brand canon |
| docs/* | setup, measurement, checklist |
| growth/automation-prompts/* | 10 Cloud Agent prompts |

## QA

| Gate | Result |
|---|---|
| validate-ledger | pass |
| growth:qa | pass |
| automations registered | **0** — pending_registration |

## Scores

qualified_growth_score: **15** — **keep**

## Decision

**Status:** keep (scaffolding); automation registration **pending_registration**

## Follow-ups

- Human: register automations via `/docs/cursor-automations-setup.md`
- Next code experiment: EXP-003 prickly pear landing
