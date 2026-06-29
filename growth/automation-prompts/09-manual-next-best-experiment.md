# Automation: Manual Next Best Experiment

**automation_id:** `manual_next_best_experiment`  
**Trigger:** Manual

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Execute the single highest-priority eligible experiment from backlog.

## Steps

1. Run `npm run growth:next`
2. Confirm experiment not done/blocked; check lock + open PR limits
3. Execute full master loop from program.md for that EXP ID
4. Branch via `npm run growth:branch <loop> <EXP-ID> <slug>`
5. QA → score → PR → ledger → run log

## One experiment only

Then stop.

## Human review

Per experiment type (claims, routes, analytics)
