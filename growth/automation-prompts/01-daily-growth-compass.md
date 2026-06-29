# Automation: Daily Growth Compass

**automation_id:** `daily_growth_compass`  
**Recommended trigger:** Cron — weekdays 08:00 Europe/Copenhagen  
**Repo:** knnthhnsn/eillon · `main`  
**Autonomy:** L1 docs-only (no code PR unless human approved)

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Research demand shifts, review analytics if available, update insights/backlog/memory, and recommend the next best experiment. **No code changes** unless trivial docs-only corrections.

## Branch policy

Work on `main` for docs-only updates to `growth/**` OR create branch `growth/compass-YYYY-MM-DD` for PR if touching non-growth files.

## Allowed tools

Read, write, grep, shell (`npm run growth:*` only)

## Allowed paths

`growth/**`, `content/campaigns/**` (create drafts only)

## Forbidden

`api/**`, HTML product pages, auto-merge, deploy, secrets, fake claims

## Steps

1. Check `growth/state.json` lock — exit if locked
2. Read `growth/baseline.md`, `growth/insights.md`, `market-research/beles-demand-sprint.md`
3. If Agent-Reach MCP available: one demand cluster research → cite in `research-sources.md` format
4. Update `growth/insights.md` with dated snapshot
5. Re-rank top 3 items in `growth/backlog.md` if evidence changed
6. Append durable facts to `growth/memory.md`
7. Choose recommended next experiment ID with rationale
8. Score today's compass run (intent 2, brand 3, measurement 2 typical)
9. Append row to `growth/results.tsv`
10. Create `growth/runs/YYYY-MM-DD-daily_growth_compass-compass.md`

## QA gates

- validate-ledger
- no unsupported claims
- no PII stored

## Stop conditions

- Missing analytics: continue docs-only, note blocker in run log
- CI failing on main: exit with status blocked
- Another automation holds lock

## Human review

Required before any code/HTML experiment implementation (defer to manual_next_best_experiment).

## Output format

Run log + updated insights/backlog/memory + ledger row. End with: **Next experiment: EXP-XXX** and **Open PRs: N**.
