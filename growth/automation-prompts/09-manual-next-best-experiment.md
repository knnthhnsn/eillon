# Automation: Manual Next Best Experiment

**automation_id:** `manual_next_best_experiment`  
**Trigger:** Manual

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Execute the single highest-priority eligible experiment from backlog.

## Steps

1. Run `npm run growth:precheck` — exit if lock held or ≥3 open growth PRs
2. Run `npm run growth:next` — skips invalid loops and ledger-shipped EXPs
3. Run `npm run growth:check-exp-shipped -- <EXP-ID>` — exit if already shipped
4. Confirm experiment not done/blocked in backlog
5. Execute full master loop from program.md for that EXP ID
6. Branch via `npm run growth:branch <loop> <EXP-ID> <slug>` — **never** `cursor/*`
7. Before PR: `npm run growth:validate-branch-name -- $(git branch --show-current)`
8. QA → **AI hard review** (Bugbot + `*-ai-review.md`) → score → PR → ledger → run log

## One experiment only

Then stop.

## AI hard review

Mandatory before PR or `keep`. Follow `/growth/ai-review.md`:
- Bugbot on `branch changes` with `.cursor/BUGBOT.md` custom instructions
- Fix all **block** findings; validate artifact with `npm run growth:validate-ai-review`
