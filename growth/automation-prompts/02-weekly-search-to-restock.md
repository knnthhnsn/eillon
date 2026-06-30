# Automation: Weekly Search-to-Restock

**automation_id:** `weekly_search_to_restock`  
**Trigger:** Cron Monday 09:00 Europe/Copenhagen

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Run **one** SEO/content/landing experiment aimed at Beles restock signup (loop: search_to_restock).

## Branch policy

- Branch: `growth/<loop>-exp-<EXP-ID>-<slug>` via `npm run growth:branch <loop> <EXP-ID> <slug>`
- **Never** push to `cursor/*` — bypasses PR cap and causes duplicate parallel PRs (see remote EXP-006/008 clusters)
- Before PR: `npm run growth:validate-branch-name -- --current`
- One PR max; skip if open PR exists for loop_type search_to_restock
- Never auto-merge

## Allowed paths

`*.html`, `journal/**`, `content/**`, `sitemap.xml`, `scripts/generate-sitemap.mjs`, `growth/**`

## Forbidden

`api/**`, `lib/**`, false product/stock claims

## Steps

1. Run `npm run growth:precheck`; then set `state.json` lock_status to `locked` for this run
2. Pick highest-priority search experiment from backlog (default EXP-003)
3. Write hypothesis per program.md
4. Smallest useful diff (one page or article + internal links + metadata)
5. Run `npm run growth:qa`
6. Score all dimensions; append results.tsv
7. **AI hard review** — Bugbot on branch changes per `/growth/ai-review.md`; write `*-ai-review.md`; `npm run growth:validate-ai-review`
8. Create run log; open PR with scores + ai-review path in body
9. Unlock state

## QA gates

build, verify:all, brand safety (DESIGN.md forbidden phrases), ledger append

## Stop if

brand_risk_penalty ≥ 2, build fails unfixably, lock held

## AI hard review

Required before PR — zero Bugbot **block** findings. See `/growth/ai-review.md`.
