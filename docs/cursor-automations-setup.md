# Cursor Automations Setup — EILLON Growth OS

**Status:** All 10 automations **pending_registration** as of 2026-06-28.

## Prerequisites

1. Growth OS committed to `knnthhnsn/eillon` on `main`
2. Cursor Automations enabled on your plan
3. GitHub repo connected in Cursor
4. Optional MCPs configured (see `.cursor/mcp.json.example`)

## How to register one automation

1. Open Cursor → **Automations** (or use `/automate` in Agents Window)
2. Create new automation
3. Copy prompt from `growth/automation-prompts/NN-<name>.md`
4. Set trigger per `growth/automation-registry.md`
5. Set repo: `knnthhnsn/eillon`, branch `main` for checkout
6. Tools: enable read/write terminal; **disable auto-merge**
7. Save and run test once manually
8. Update `growth/automation-registry.md` status → `active` only after verified

## Recommended registration order

1. `manual_next_best_experiment` — validate loop end-to-end
2. `daily_growth_compass` — docs-only, lowest risk
3. `weekly_conversion_trust` — single-surface PRs
4. `weekly_search_to_restock` — SEO PRs
5. `weekly_social_to_letter` — campaign docs
6. `pr_growth_review` — git PR trigger
7. `ci_failure_repair` — git CI failed
8. `main_branch_digest` — weekly
9. `monthly_brand_system` — monthly
10. `automation_os_improver` — monthly, AI hard review for policy

## Cron reference (Europe/Copenhagen)

| Automation | Cron |
|---|---|
| daily_growth_compass | `0 8 * * 1-5` |
| weekly_search_to_restock | `0 9 * * 1` |
| weekly_social_to_letter | `0 10 * * 3` |
| weekly_conversion_trust | `0 11 * * 4` |
| monthly_brand_system | `0 9 1 * *` |
| main_branch_digest | `0 18 * * 0` |
| automation_os_improver | `0 10 1 * *` |

## MCP setup (optional)

Copy `.cursor/mcp.json.example` → local `.cursor/mcp.json` (gitignored). Fill env vars. Never commit secrets.

| MCP | Used by |
|---|---|
| codebase-memory-mcp | Baseline indexing (manual install) |
| Agent-Reach | daily_growth_compass research |
| GitHub | pr_growth_review, ci_failure_repair |

## Disable / recover

- **Disable:** Automations UI → toggle off
- **Bad PR:** close PR, mark experiment `discard` in results.tsv, clear lock in state.json
- **Lock stuck:** human sets `lock_status: "unlocked"` in state.json
- **Never** force-push main

## Why not registered in initial build

Cursor Automations require per-automation user approval in the Automations editor. `open_automation` MCP is available but bulk silent registration would bypass safety workflow. Prompts are ready to paste.

## Verify active automation

After registration, add to registry:

```markdown
- **Last run:** YYYY-MM-DD
- **Status:** active
- **Verified by:** [human name]
```

Do not mark active from agent session alone.
