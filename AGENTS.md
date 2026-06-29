# EILLON — Agent Instructions

This repository contains the **EILLON growth operating system** alongside the eillon.maison static site.

## Before growth work

1. Read `/growth/program.md`
2. Read `/growth/autonomy-policy.md`
3. Read `/growth/state.json` and `/growth/backlog.md`
4. Read `/growth/results.tsv` (append only — never overwrite)

## Before brand-facing work

1. Read `DESIGN.md`
2. Read `/growth/scorecard.md` for voice constraints

## Rules

- **Never fabricate** product facts, stock, restock dates, reviews, or testimonials
- **Never auto-merge** or **production deploy** without explicit human request
- **Log experiments** to `/growth/results.tsv` and `/growth/runs/`
- **Update** `/growth/memory.md` when learning something durable
- **One experiment** per run; max 3 open `growth/*` PRs
- **Run QA** per `/growth/qa-gates.md` before marking an experiment `keep`
- Use **EILLON voice**: quiet, sensory, precise — never generic DTC perfume copy

## Stack (quick)

Static HTML/CSS/JS · Vercel · Neon waitlist API · `npm run ci` for full gate

## Growth commands

```bash
npm run growth:next
npm run growth:qa
npm run growth:score -- --help
```

Nested growth instructions: `/growth/AGENTS.md`
