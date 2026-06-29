# Automation: Weekly Conversion & Trust

**automation_id:** `weekly_conversion_trust`  
**Trigger:** Cron Thursday 11:00 Europe/Copenhagen

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Improve **one** conversion surface or trust gap (form microcopy, FAQ, CTA, appointment path, error state).

## Priority surfaces

`/beles#waitlist`, footer newsletter, about studio block, shipping FAQ, wear guide

## Rules

- No fake urgency, stock counts, or guarantees
- Analytics events only via existing `scripts/analytics.js` patterns
- One file cluster max (≤6 files)

## Steps

1. Run `npm run growth:precheck`; then set `state.json` lock_status to `locked` for this run
2. Select backlog item (e.g. EXP-027) — skip if `npm run growth:check-exp-shipped -- <EXP-ID>` fails
3. Branch via `npm run growth:branch <loop> <EXP-ID> <slug>` — never `cursor/*`
4. Hypothesis + minimal diff
5. `npm run growth:qa`
6. AI hard review per `/growth/ai-review.md` — Bugbot + `*-ai-review.md`
7. PR + ledger + run log

## Stop if

Change requires product truth not in products.js / beles.html
