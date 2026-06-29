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

1. Select backlog item (e.g. EXP-005, EXP-027)
2. Hypothesis + minimal diff
3. `npm run growth:qa`
4. PR + ledger + run log

## Stop if

Change requires product truth not in products.js / beles.html
