# Run log — automation_os_improver

**Date:** 2026-06-29
**Automation:** automation_os_improver
**Experiment:** EXP-040 — OS scope guard for improver runs
**Branch:** growth/os-2026-06-29
**Bundle:** EXP-036–040 (growth OS safety bundle)

## Hypothesis

If we add an explicit allowed-scope section to the OS improver prompt and revert out-of-scope files before PR, then OS bundles stay reviewable and avoid accidental public SEO drift, because `growth/os-2026-06-29` initially included unrelated `sitemap.xml` lastmod changes from rebase/build.

## Evidence (ledger insights)

- Last 10 rows: 1 blocked (EXP-002b registration), 0 rework
- Duplicate experiment_id EXP-005 (expected: manual + auto-merge rows)
- Repeated automation_id counts signal parallel branch risk — addressed by EXP-037/038 precheck rollout
- Unrelated sitemap drift found in OS branch diff during PR prep

## Changes (EXP-040)

- `growth/automation-prompts/10-automation-os-improver.md` — allowed scope + pre-PR diff check
- Reverted `sitemap.xml` to match `main`
- Backlog + memory updated

## Prior bundle (EXP-036–039, same branch)

| EXP | Change |
|---|---|
| EXP-036 | Ledger validation + QA npm ci bootstrap |
| EXP-037 | `growth:precheck` automation gate |
| EXP-038 | `growth:ledger-insights` + precheck on prompts 03–05 |
| EXP-039 | `growth:auto-merge-cap` for L2b policy |

## QA

- npm run growth:precheck — pass
- npm run growth:validate-ledger — pass
- npm run growth:ledger-insights — pass
- npm run growth:auto-merge-cap — pass
- npm run growth:qa — pass

## AI hard review

`growth/runs/2026-06-29-automation_os_improver-EXP-040-ai-review.md` — pass_with_notes

## Decision

**keep** — QGS 14, brand_risk 0. Open PR for human merge (OS bundle not L2b auto-merge eligible without explicit review).
