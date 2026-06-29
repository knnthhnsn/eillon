# Growth Automations — Quick Setup (3 core)

Save each automation in Cursor → **Automations** in this order. Prompts live in `growth/automation-prompts/`.

## 1. Daily Growth Compass

| Field | Value |
|---|---|
| **Name** | Daily Growth Compass |
| **Trigger** | Cron `0 8 * * 1-5` (weekdays 08:00) |
| **Repo / branch** | `knnthhnsn/eillon` · `main` |
| **Tools** | Read, Write, Terminal |
| **Auto-merge** | Off |
| **Prompt** | `growth/automation-prompts/01-daily-growth-compass.md` |

## 2. Weekly Search-to-Restock

| Field | Value |
|---|---|
| **Name** | Weekly Search-to-Restock |
| **Trigger** | Cron `0 9 * * 1` (Monday 09:00) |
| **Repo / branch** | `knnthhnsn/eillon` · `main` |
| **Tools** | Read, Write, Terminal |
| **Auto-merge** | Off |
| **Prompt** | `growth/automation-prompts/02-weekly-search-to-restock.md` |

## 3. PR Growth Review

| Field | Value |
|---|---|
| **Name** | PR Growth Review |
| **Trigger** | GitHub PR opened + updated → `main` |
| **Repo** | `knnthhnsn/eillon` |
| **Tools** | Read, **Comment on PRs** |
| **Auto-merge** | Off |
| **Ignore draft PRs** | On |
| **Prompt** | `growth/automation-prompts/06-pr-growth-review.md` |

## After each save

1. Run **Test** once manually (where available)
2. Set `growth/automation-registry.md` row status → `active` only after verified
3. Update `growth/state.json` — remove automations blocker when all 3 active

## Re-open prefilled form

Ask the agent: *"Open automation prefill for daily_growth_compass"* (or weekly / pr_growth_review).
