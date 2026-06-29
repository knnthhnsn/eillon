# Automation: Automation OS Improver

**automation_id:** `automation_os_improver`  
**Trigger:** Monthly (1st 10:00 Copenhagen) or manual only

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/ai-review.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

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

1. Review last 10 `results.tsv` rows for patterns (`rework`, `blocked`, invalid statuses)
   - If fewer than 10 rows: also read `growth/memory.md` (Previous failures), `growth/runs/*.md`, and `growth/automation-registry.md` failure modes
2. Propose 1–3 targeted OS improvements tied to evidence
3. Implement on branch `growth/os-YYYY-MM-DD`
4. Run `npm run growth:qa` (auto-runs `npm ci` if `node_modules` incomplete)
5. **AI hard review** — light self-checklist for docs/scripts-only; full Bugbot if touching autonomy policy
6. Write `growth/runs/YYYY-MM-DD-automation_os_improver-EXP-OS-NNN-ai-review.md`; run `npm run growth:validate-ai-review`
7. PR with rationale tied to failed/rework/blocked experiments
8. Append ledger row with `loop_type` `automation_os`

## Ledger rules (do not regress)

- **Status** must be one of: `keep`, `rework`, `discard`, `blocked`
- Automation registration state belongs in `automation-registry.md`, not as a ledger status
- `npm run growth:validate-ledger` validates status, loop_type, and score arithmetic

## Stop if

No evidence-based improvement (don't change for change's sake)
