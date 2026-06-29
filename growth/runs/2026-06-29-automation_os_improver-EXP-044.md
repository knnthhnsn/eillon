# Run log — EXP-044

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Hypothesis

If we add `growth:precheck-docs` for compass/digest automations and require pr_growth_review to validate ai-review artifacts, then docs-only runs work on main without bypassing lock/PR cap and growth PRs cannot merge without a valid review artifact path, because prompt 01 called full precheck on main (always blocked) and L2b auto-merge depends on ai-review links.

## Evidence

- EXP-005 auto-merge required ai-review path in PR body
- Daily compass prompt allowed main but precheck blocked main
- pr_growth_review checklist lacked artifact validation step

## Changes

- `check-state.mjs`: `--docs-only` mode (lock + PR cap; allows main; blocks cursor/*)
- `package.json`: `growth:precheck-docs`
- Prompts 01, 08: precheck-docs
- Prompt 06: validate-ai-review when path in PR body
- `ledger-insights.mjs`: warn when cursor/* branch count >> growth/*

## Decision

**keep** — QGS 14
