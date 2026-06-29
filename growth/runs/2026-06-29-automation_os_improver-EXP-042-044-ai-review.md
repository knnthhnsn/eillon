# AI Hard Review — EXP-042–044 (OS bundle)

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Branch:** growth/os-2026-06-29
**Bugbot runs:** 0 (docs/scripts-only; self-checklist per ai-review.md)
**Verdict:** pass_with_notes

## Summary

Three targeted OS improvements from ledger-insights and remote branch evidence. EXP-042 adds branch bootstrap for Cloud Agent default `cursor/*` assignment. EXP-043 wires check-exp-shipped into weekly experiment prompts. EXP-044 adds docs-only precheck and pr_growth_review ai-review validation. No autonomy policy changes; no QA gate removal; no safety loosening.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| warn | bootstrap-growth-branch.mjs | Cannot override Cloud Agent task branch assignment in all environments | documented in prompts; agents must run bootstrap step 0 |
| praise | check-state.mjs | docs-only mode unblocks compass/digest on main | n/a |
| praise | ledger-insights.mjs | cursor/* proliferation warning | n/a |

## Checklist sign-off

- [x] Brand (DESIGN.md) — no brand-facing copy changed
- [x] Claims / products.js — untouched
- [x] Privacy / analytics — untouched
- [x] SEO / metadata — no public SEO changes
- [x] A11y (if UI) — N/A
- [x] Ledger + run log ready
- [x] Autonomy policy not loosened
- [x] No auto-merge enablement added

## QA commands

- npm run growth:qa — pass
- npm run growth:validate-ledger — pass
- npm run growth:validate-branch — pass
- npm run growth:validate-ai-review — pass
- npm run growth:precheck — pass
- npm run growth:precheck-docs — pass (on main would pass lock/PR checks)
