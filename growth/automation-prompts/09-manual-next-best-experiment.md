# Automation: Manual Next Best Experiment

**automation_id:** `manual_next_best_experiment`  
**Trigger:** Manual

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Execute the single highest-priority eligible experiment from backlog.

## Steps

1. Run `npm run growth:precheck` — exit if lock held or ≥3 open growth PRs
2. Run `npm run growth:next` — skips backlog rows with invalid loop_type (run `npm run growth:validate-backlog` if empty)
3. Confirm experiment not done/blocked
4. Execute full master loop from program.md for that EXP ID
5. Branch via `npm run growth:branch <loop> <EXP-ID> <slug>`
6. QA → **AI hard review** (Bugbot + `*-ai-review.md`) → score → PR → ledger → run log

## One experiment only

Then stop.

## AI hard review

Mandatory before PR or `keep`. Follow `/growth/ai-review.md`:
- Bugbot on `branch changes` with `.cursor/BUGBOT.md` custom instructions
- Fix all **block** findings; validate artifact with `npm run growth:validate-ai-review`
