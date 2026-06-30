# Run Log — weekly_search_to_restock (blocked)

**Date:** 2026-06-29  
**Automation:** `weekly_search_to_restock`  
**Experiment:** none (blocked)  
**Branch:** `cursor/beles-restock-signup-experiment-26a1`  
**Status:** blocked

## Context read

- AGENTS.md, program.md, autonomy-policy.md, ai-review.md, state.json, results.tsv, backlog.md, memory.md, DESIGN.md

## Precheck

| Gate | Result |
|---|---|
| Lock held | no (proceeded) |
| Open `growth/*` PRs | 0 |
| Open search_to_restock PRs (cursor/beles-restock-signup-*) | 5+ |
| `npm run growth:next -- --loop search_to_restock` | EXP-008 (priority 160) |

## Block reason

Per loop manifest (`max_open_prs: 1` for `search_to_restock`) and automation prompt: **skip if open PR exists for loop search_to_restock**.

All eligible `seo_content` backlog items for this loop already have open draft PRs:

| EXP | Title | Open PR(s) |
|---|---|---|
| EXP-008 | Journal → Beles → restock internal links | #99, #94, #89, #84, #79, #71, … |
| EXP-013 | Oil-rich parfum journal piece | #95, #91, #74, #31, … |
| EXP-023 | Skin scent landing FAQ | #85, #574f, … |
| EXP-024 | Sample-first buying guide | #48 |
| EXP-033 | Genderless niche Copenhagen | #52 |
| EXP-010 | Copenhagen appointment (about) | #80 |

No unblocked `seo_content` experiment remains. EXP-018 (`llms.txt`) is `technical_seo` and outside allowed paths for this loop (`llms.txt` not listed).

## Hypothesis

N/A — run blocked before diff.

## QA

Not run (no code changes).

## AI hard review

Not run (no code changes).

## Decision

**blocked** — human action required: merge or close stale search_to_restock drafts to unblock the loop.

## Next when unblocked

1. Merge best candidate among EXP-008 / EXP-013 / EXP-023 (highest priority, QA-passing)
2. Re-run `weekly_search_to_restock`; next likely EXP-024 or EXP-033

## Lock footer

`lock_status` cleared to `unlocked` at end of run.
