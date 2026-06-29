# Run log: ci_failure_repair — PR #44 CI green

**Date:** 2026-06-29  
**Automation:** `ci_failure_repair`  
**Trigger:** check_suite on `growth/conversion_copy-exp-005-beles-restock-trust-microcopy` @ `3e4ddd7`  
**PR:** #44 (EXP-005 Beles restock trust microcopy)

## Diagnosis

CI is **green** on the trigger branch and on `main` after auto-merge.

| Run | Branch | SHA | Result | Failing step |
|---|---|---|---|---|
| 28365598358 | growth/conversion_copy-exp-005-beles-restock-trust-microcopy | 3e4ddd7 | **success** | — |
| 28365741558 | main (post-merge) | 9c91e6f | **success** | — |

All `npm run ci` steps passed: build, verify:all, smoke:funnel, lighthouse:ci (performance 79, LCP 3797ms, CLS 0.000).

## Historical failure (not on trigger branch)

Run `28364108098` on `cursor/conversion-trust-points-2357` failed at **lighthouse:ci** with performance 58 &lt; 60 (runner flake). That branch was superseded by PR #44 which passes.

## Local reproduction note

Cloud Agent VM lacks `python` binary (only `python3`). GitHub Actions ubuntu-latest provides `python`, so CI passes there. `scripts/smoke-funnel.mjs` and `scripts/run-lighthouse-ci.mjs` spawn `python`; local repro on this VM fails at smoke:funnel with `ENOENT`. Not a CI blocker.

## Action taken

No code fix required. Trigger fired on a passing check suite (3/3 checks passed).

## Lock

`lock_status`: unlocked (no code experiment started)
