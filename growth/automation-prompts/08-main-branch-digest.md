# Automation: Main Branch Digest

**automation_id:** `main_branch_digest`  
**Trigger:** Push to main (weekly digest) or manual

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Summarize shipped changes on main; update baseline if architecture changed; extract durable learnings to memory.

## Steps

1. Run `npm run growth:precheck-docs` — exit if lock held or ≥3 open growth PRs
2. `git log --since="7 days ago" --oneline main`
3. Group by: growth, perf, content, infra
4. Write `growth/runs/YYYY-MM-DD-main_branch_digest-digest.md`
5. If routes/API/analytics changed → update `growth/baseline.md`
6. Append memory.md with dated wins/lessons
7. Adjust backlog statuses for shipped EXP IDs

## No code changes

Docs-only unless critical baseline drift fix

## Stop if

No commits in window — still log "no changes"
