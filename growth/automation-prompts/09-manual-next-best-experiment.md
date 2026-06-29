# Automation: Manual Next Best Experiment

**automation_id:** `manual_next_best_experiment`  
**Trigger:** Manual

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Execute the single highest-priority eligible experiment from backlog.

## Steps

0. Run `npm run growth:bootstrap-branch -- experiment <loop> <EXP-ID> <slug>` when implementing code/content
1. Run `npm run growth:precheck` — exit if lock held, ≥3 open growth PRs, or branch is not `growth/*`
2. Run `npm run growth:next`
3. Confirm experiment not done/blocked — run `npm run growth:check-exp-shipped -- <EXP-ID>`
4. Execute full master loop from program.md for that EXP ID
5. Run `npm run growth:validate-branch` after bootstrap
6. QA → **AI hard review** (Bugbot + `*-ai-review.md`) → score → PR → ledger → run log

## One experiment only

Then stop.

## AI hard review

Mandatory before PR or `keep`. Follow `/growth/ai-review.md`:
- Bugbot on `branch changes` with `.cursor/BUGBOT.md` custom instructions
- Fix all **block** findings; validate artifact with `npm run growth:validate-ai-review`
