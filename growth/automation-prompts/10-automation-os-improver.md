# Automation: Automation OS Improver

**automation_id:** `automation_os_improver`  
**Trigger:** Monthly (1st 10:00 Copenhagen) or manual only

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Improve the growth OS itself: docs, prompts, scorecard, scripts, rules — **never silently loosen safety**.

## Allowed

- Clarify instructions
- Fix validate-ledger / qa scripts
- Add backlog items from failed runs
- Improve automation prompts

## Forbidden without AI hard review pass

Increasing autonomy level, removing QA gates, allowing auto-merge, or weakening brand_safety / privacy rules — all require Bugbot **block** count zero on the OS diff.

## Steps

1. Review last 10 results.tsv rows for patterns (rework/blocked)
2. Propose 1–3 targeted OS improvements
3. Implement on branch `growth/os-YYYY-MM-DD`
4. PR with rationale tied to failed/rework experiments
5. Log with loop_type automation_os

## Stop if

No evidence-based improvement (don't change for change's sake)
