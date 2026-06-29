# EILLON Growth Change Policy

**Version:** 1.0 · 2026-06-28

## Scope

Applies to all growth experiments, automation runs, and agent sessions touching eillon.maison.

## Change classes

| Class | Examples | Path |
|---|---|---|
| A — Docs/memory | backlog, insights, campaign drafts | Direct commit or docs PR |
| B — Copy/SEO | metadata, journal, landing HTML | PR required |
| C — Instrumentation | analytics.js events | PR + privacy review |
| D — API/data | waitlist API, DB | **Human required** |
| E — Deploy/config | vercel, env, CI | **Human required** |

## PR rules

- Branch: `growth/<loop>-<exp-id>-<slug>`
- One experiment per PR
- Title format: `[growth] EXP-NNN: short description`
- PR body must include: hypothesis, scores, QA results, rollback plan
- Never auto-merge

## Rollback

- Revert PR if `brand_risk_penalty >= 2` discovered post-merge
- Log rollback in `results.tsv` as new row with status `discard`

## Content claims

Allowed without extra review:
- Sensory descriptions aligned with beles.html / products.js
- Process descriptions from craftsmanship/about

Requires AI hard review:
- Restock dates, batch numbers, stock counts
- IFRA, allergens, certifications
- Press, awards, testimonials
- Comparative claims vs other brands

## Versioning

- `results.tsv` — append only
- `memory.md` — append dated sections
- `autonomy-policy.md` — version bump + human approval
- `program.md` — minor updates via PR; major loop changes need AI hard review
