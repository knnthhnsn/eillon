# Main Branch Digest — 2026-06-29

**automation_id:** `main_branch_digest`  
**trigger:** cron `*/30 * * * *`  
**window:** `git log --since="7 days ago" main` (2026-06-22 → 2026-06-29)  
**main HEAD:** `32a9790` — Add growth OS, prickly pear discovery landing, and favicon.  
**commits in window:** 61

## Summary

Main received a large homepage/experience push (WebGL shaders, GSAP scroll pins, name marquee, House of Memory redesign, Beautiful Letters), foundational infra (CI, analytics funnel, API rate limits, sitemap generation, trust/legal fixes), and a growth OS landing commit bundling EXP-001/002 scaffolding plus EXP-003 prickly-pear discovery page and favicon rollout.

## By category

### Growth (4 commits · EXP-001/002/003)

| Commit | Summary |
|---|---|
| `32a9790` | Full `/growth/` OS: program, backlog, baseline, memory, automation prompts, QA scripts, scorecard, autonomy policy, Cursor rules, DESIGN.md, AGENTS.md; ships `prickly-pear-parfum.html`; favicon → `images/favicon.jpeg`; `content/campaigns/.gitkeep` scaffold |
| (ledger) | EXP-001 baseline + EXP-002 automation scaffolding recorded in `results.tsv` |
| (ledger) | EXP-003 prickly-pear discovery landing (`/prickly-pear-parfum`) — QGS 18, keep |
| (ledger) | EXP-002b automation registration — `pending_registration` (manual Cursor UI) |

**Shipped EXP IDs on main:** EXP-001, EXP-002, EXP-003  
**Next on main backlog:** EXP-004 (smell-intent journal — not yet on main)

### Performance (8+ commits)

| Commit | Summary |
|---|---|
| `5547413` | Homepage Lighthouse: critical CSS, lazy bundles, CSS marquee |
| `0ab1ab9` | Mobile carousel/pin jitter fix; defer letters bundle |
| `a6b3dea` | Remove homepage page loaders for immediate content |
| `19aa0eb` | GSC coverage, mobile editorial UX, Lighthouse |
| `d1cd430` | Editorial WebP + `<picture>` variants for page weight |
| `ea60689` | Vercel build: skip Python wax-seal step in CI |
| `6e04d95` | Phase 3 proof layer + performance fixes |
| (many) | GSAP pin init order, scroll jitter, marquee seam fixes |

### Content (35+ commits)

| Theme | Commits | Notes |
|---|---|---|
| Homepage experience | `ee372e6`–`32a9790` | WebGL shader bands, hero/house pins, name carousel, leopard House of Memory, horizontal intro track |
| Beautiful Letters | `13c83de` | Sky archive backdrop, wax seals |
| Editorial refresh | `6fb50cf`, `ce1a452`, `4141493` | Inner pages, wear close-skin imagery, journal water tones |
| Trust / proof | `b17f343`, `6e04d95`, `291538f` | Legal gaps, proof layer, CVR 43933485, studio authorship |
| SEO content | `32a9790`, `d3943a4` | Prickly-pear discovery landing; sitemap refresh |
| Demand research | `b3619e2` | Phase 4 lifecycle copy sweep, Ballpark study kit |

### Infra (6 commits)

| Commit | Summary |
|---|---|
| `baae843` | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3: consent recording, auto-generated sitemap |
| `b3619e2` | Phase 4: demand sprint CI, lifecycle copy sweep |
| `ea60689` | CI build fix (Python wax-seal split) |
| `32a9790` | Growth QA scripts (`npm run growth:qa`), validate-ledger, score-experiment |
| `6fb50cf` | Editorial site styles foundation |

## Architecture changes (baseline drift)

| Area | Before (baseline) | Now on main | Action |
|---|---|---|---|
| Routes | 17 indexed pages | **18** — added `/prickly-pear-parfum` | Update baseline route table |
| Sitemap | 17 URLs | **18 URLs** | Update baseline SEO state |
| SEO gap | "No prickly pear landing" | **Shipped** (EXP-003) | Remove gap; smell-intent journal still open (EXP-004) |
| Favicon | "verify committed" | `images/favicon.jpeg` on all pages | Mark resolved |
| Growth OS | Not documented | Full `/growth/` tree live | Add OS note to baseline |
| Campaigns | No kit library | `content/campaigns/.gitkeep` | Note scaffold only |
| Analytics/API | Unchanged event set | No new event names in window | No analytics table change |

## Backlog adjustments

| EXP ID | Main status | Notes |
|---|---|---|
| EXP-001 | done | Already marked |
| EXP-002 | done | Already marked |
| EXP-003 | done | Shipped in `32a9790` |
| EXP-004 | **next** | Not on main — branch `9a40e0a` exists ahead |
| EXP-031 | **pending** | Automations need Cursor UI save |

No backlog row changes required for main; EXP-005 remains next eligible after EXP-004 merges.

## Branch note

Current branch `cursor/growth-main-branch-digest-fe34` is **4 commits ahead** of main (`a6c33f0`…`9a40e0a`): AI hard review protocol, automation registry sync, conditional auto-merge policy, EXP-004 journal article. Digest scope is main only; merge those commits to update baseline again (+1 route, 19 URLs).

## Next actions

1. Merge EXP-004 branch → main; re-run digest for route/sitemap update
2. Save `pr_growth_auto_merge` in Cursor Automations UI (EXP-031 blocker)
3. Run EXP-005 (Beles restock form trust microcopy) — highest priority after EXP-004
4. Monitor GSC for prickly-pear cluster (14–28d post EXP-003)
