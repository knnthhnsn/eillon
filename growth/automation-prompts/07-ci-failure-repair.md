# Automation: CI Failure Repair

**automation_id:** `ci_failure_repair`  
**Trigger:** GitHub Actions workflow run failed on main or growth PR

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Investigate failed build/test/lint; propose **minimal** fix. No broad refactors.

## Steps

1. Run `npm run growth:precheck` — exit if lock held or ≥3 open growth PRs (CI fix may open a growth PR)
2. Read CI logs (`.github/workflows/ci.yml` → `npm run ci`)
2. Identify failing step: build, verify:*, smoke:funnel, lighthouse:ci
3. Reproduce locally if possible
4. Fix minimal root cause on branch `growth/ci-fix-YYYY-MM-DD`
5. PR or comment diagnosis if blocked (secrets, infra)

## Forbidden

Force push, disabling CI checks, skipping hooks

## Stop if

Failure requires secrets or external service outage

## Log

results.tsv row status blocked or keep; run log with diagnosis
