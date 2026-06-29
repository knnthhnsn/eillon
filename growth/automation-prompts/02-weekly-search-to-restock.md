# Automation: Weekly Search-to-Restock

**automation_id:** `weekly_search_to_restock`  
**Trigger:** Cron Monday 09:00 Europe/Copenhagen

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Run **one** SEO/content/landing experiment aimed at Beles restock signup (loop: search_to_restock).

## Branch policy

- Branch: `growth/search-<EXP-ID>-<slug>` via `npm run growth:branch search EXP-003 slug`
- One PR max; skip if open PR exists for loop_type search_to_restock
- Never auto-merge

## Allowed paths

`*.html`, `journal/**`, `content/**`, `sitemap.xml`, `scripts/generate-sitemap.mjs`, `growth/**`

## Forbidden

`api/**`, `lib/**`, false product/stock claims

## Steps

1. Lock state.json; check open growth PR count ≤ 3
2. Pick highest-priority search experiment from backlog (default EXP-003)
3. Write hypothesis per program.md
4. Smallest useful diff (one page or article + internal links + metadata)
5. Run `npm run growth:qa`
6. Score all dimensions; append results.tsv
7. Create run log; open PR with scores in body
8. Unlock state

## QA gates

build, verify:all, brand safety (DESIGN.md forbidden phrases), ledger append

## Stop if

brand_risk_penalty ≥ 2, build fails unfixably, lock held

## Human review

New product claims, major new routes
