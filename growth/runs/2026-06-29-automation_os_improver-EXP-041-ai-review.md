# AI Hard Review — EXP-041 (OS bundle EXP-036–041)

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Branch:** growth/os-2026-06-29
**Bugbot runs:** 0 (docs/scripts-only; self-checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Added branch naming enforcement and experiment-shipped guard after ledger-insights showed repeated automation runs and remote evidence of 10+ parallel `cursor/*` branches per experiment. Bundle EXP-036–041 strengthens ledger validation, automation preflight, duplicate-branch insights, L2b auto-merge cap, OS scope guard, and branch/exp guards — without loosening autonomy policy, QA gates, or brand safety rules.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | growth:precheck | Blocks cursor/* but cannot prevent Cloud Agent default branch assignment | documented in prompt 10; agents must checkout growth/os-YYYY-MM-DD |
| praise | scripts/growth/branch-utils.mjs | Centralizes branch naming rules | n/a |
| praise | scripts/growth/check-exp-shipped.mjs | Prevents duplicate EXP re-runs | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no brand-facing copy changed
- [x] Claims / products.js — untouched
- [x] Privacy / analytics — untouched
- [x] SEO / metadata — no public SEO changes in EXP-041
- [x] A11y (if UI) — N/A
- [x] Ledger + run log ready
- [x] Autonomy policy not loosened
- [x] No auto-merge enablement added

## QA commands

- npm run growth:qa — pass
- npm run growth:validate-ledger — pass
- npm run growth:validate-branch — pass
- npm run growth:validate-ai-review — pass
