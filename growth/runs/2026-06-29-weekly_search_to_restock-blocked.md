# Run log — weekly_search_to_restock (blocked)

**Date:** 2026-06-29  
**Automation:** `weekly_search_to_restock`  
**Trigger:** cron `*/30 * * * *`  
**Status:** blocked  
**Verdict:** No new PR — open `search_to_restock` experiments already in flight

## Preconditions

| Check | Result |
|---|---|
| `state.json` lock | was unlocked → locked for run → unlocked at end |
| Open `growth/*` PRs | 0 (formal count) |
| Main CI | green |
| `brand_risk_penalty` | n/a (no diff) |

## Backlog selection

`npm run growth:next` returned **EXP-008** (internal_linking, priority 160) — not eligible for `search_to_restock` loop (`seo_content`).

Eligible `seo_content` backlog for Search-to-Restock:

| ID | Experiment | Status |
|---|---|---|
| EXP-003 | Prickly pear discovery landing | done (main) |
| EXP-004 | Fico d'India smell article | done (main) |
| EXP-013 | Oil-rich parfum journal | open PR #95, #91, #74 |
| EXP-023 | Skin scent journal FAQ | open PR #85, #35 |
| EXP-024 | Sample-first buying guide | open PR #48 |
| EXP-033 | Genderless niche Copenhagen | open PR #52 |

Related loop PRs also open: EXP-010 (#80), EXP-011 (#96, #59), EXP-020 (#69).

## Stop reason

Per `/growth/autonomy-policy.md` §Automation safety (5) and `/growth/loop-manifest.yml` (`search_to_restock.max_open_prs: 1`):

> Do not open a new growth PR if same `loop_type` already has an open PR.

All eligible `search_to_restock` / `seo_content` backlog items either shipped on `main` or have open draft PRs on `cursor/beles-restock-signup-experiment-*` branches. Opening another PR would duplicate in-flight work.

## Recommended human action

1. Review and merge or close stale draft PRs (especially duplicates for EXP-008, EXP-013).
2. After merge, mark backlog rows `done` and append ledger rows for shipped EXPs (013, 023, 024, etc.).
3. Re-run `weekly_search_to_restock` — next unblocked candidate likely **EXP-033** or **EXP-016/017** (technical_seo, no open PR).

## Footer

- Lock released: yes  
- Ledger appended: yes (`blocked` row)  
- PR opened: no  
