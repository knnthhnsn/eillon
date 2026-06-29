# Run log — automation_os_improver — EXP-037

**Date:** 2026-06-29  
**Automation:** automation_os_improver  
**Branch:** growth/os-2026-06-29  
**Loop type:** automation_os

## Evidence reviewed

Ledger (6 rows after EXP-036 rebase). Patterns:

| Source | Pattern |
|---|---|
| EXP-002b | `blocked` — registration blockers belong in registry, not ledger |
| EXP-036 | Ledger validation + npm ci bootstrap shipped on this branch |
| program.md step 2 | Requires exit if lock or ≥3 open PRs |
| check-state.mjs (pre-037) | Only validated JSON schema — did not enforce exit |

## Hypothesis

If we add `npm run growth:precheck` (`check-state.mjs --for-automation`), then scheduled agents exit before wasted work when another experiment holds the lock or the growth PR cap is reached, because program.md and autonomy-policy already require this gate but tooling did not enforce it.

## Changes

1. `scripts/growth/check-state.mjs` — `--for-automation` flag; exit 1 on lock or PR cap
2. `package.json` — `growth:precheck` script
3. `growth/program.md`, `growth/qa-gates.md` — document precheck
4. Automation prompts 01, 02, 09, 10 — call precheck at run start
5. `.cursor/rules/30-cursor-automation-safety.mdc` — reference precheck

## Scoring

```
intent 2, brand 3, conversion 2, discoverability 1, measurement 3, technical 3
complexity 1, risk 0 → QGS 13
```

## QA

- npm run growth:validate-ledger — pass
- npm run growth:precheck — pass
- npm run growth:validate-ai-review — pass
- npm run growth:qa — pass

## Decision

**Status:** keep  
**AI review:** growth/runs/2026-06-29-automation_os_improver-EXP-037-ai-review.md

Lock: unlocked
