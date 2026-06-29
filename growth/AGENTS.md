# Growth Folder — Agent Instructions

Files in `/growth` are the **persistent brain** of EILLON growth.

## Rules

1. **Read** `program.md` before any growth work.
2. **Never overwrite** `results.tsv` history — append rows only.
3. **Append** dated sections to `memory.md` — do not delete prior facts.
4. **Keep** files concise but operational — no placeholder fluff.
5. **Validate** JSON/YAML/TSV after edits (`npm run growth:validate-ledger`, `npm run growth:state`).
6. **One experiment** per automation run.
7. Changes to `autonomy-policy.md` or loop safety rules → **AI hard review required** (zero block findings).
8. Do not store PII, secrets, or raw customer emails in growth files.
9. Mark automations `pending_registration` unless verified in Cursor UI.
10. TSV columns are **tab-separated** — preserve header exactly.

## File update matrix

| File | Update when |
|---|---|
| results.tsv | Every experiment ends |
| runs/*.md | Every experiment ends |
| memory.md | Durable fact learned |
| insights.md | Demand/conversion signal shifts |
| backlog.md | New experiment or status change |
| baseline.md | Site architecture/routes change |
| state.json | Run start/end, lock, focus |
| automation-registry.md | Automation registered or run completed |

## Scoring

Use `growth/scorecard.md` and `npm run growth:score`.

## Parent instructions

See root `/AGENTS.md`.
