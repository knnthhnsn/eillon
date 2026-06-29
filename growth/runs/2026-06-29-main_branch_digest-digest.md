# Main Branch Digest — 2026-06-29

**automation_id:** `main_branch_digest`  
**trigger:** cron `*/30 * * * *`  
**window:** `git log --since="7 days ago" origin/main` (2026-06-22 → 2026-06-29)  
**main HEAD:** `c714cf6` — Load home scroll pin script from jsDelivr until Vercel deploy quota resets.  
**commits in window:** 74

## Summary

Main received a dense week: full growth OS launch with three shipped experiments (EXP-003/004/005), first L2b conditional auto-merge (PR #44), AI hard review protocol, 10 Cursor Automations registered, a major homepage experience push (WebGL shaders, GSAP scroll pins, name marquee, House of Memory redesign, Beautiful Letters), foundational infra (CI, analytics funnel, API rate limits, sitemap generation, trust/legal fixes), and late-window mobile pin stabilization plus a jsDelivr CDN workaround when Vercel hit deploy quota.

## By category

### Growth (13 commits · EXP-001–005, EXP-031)

| Commit | Summary |
|---|---|
| `32a9790` | Full `/growth/` OS: program, backlog, baseline, memory, automation prompts, QA scripts, scorecard, autonomy policy, Cursor rules, DESIGN.md, AGENTS.md; ships `prickly-pear-parfum.html` (EXP-003); favicon → `images/favicon.jpeg`; `content/campaigns/.gitkeep` scaffold |
| `a6c33f0` | AI hard review protocol (`growth/ai-review.md`); automation registry sync |
| `2d91bbe` | Document save order for remaining growth automations |
| `f693e9c` | Conditional auto-merge policy (L2b); MCP setup docs |
| `f5679c9` | Growth OS completion: Reddit login, Agent-Reach sync, auto-merge enablement |
| `9a40e0a` | **EXP-004** — `/journal/what-does-fico-d-india-smell-like` with FAQ schema, journal index feature, sitemap route (QGS 18) |
| `790ad6f` | **EXP-005** — Beles restock form trust microcopy (`.shop__restock-trust`); PR #44 (QGS 15) |
| `9c91e6f` | Ledger entry for first L2b auto-merge via `pr_growth_auto_merge` |
| (ledger) | EXP-001 baseline + EXP-002 automation scaffolding — QGS 15–16, keep |
| (ledger) | EXP-031 — 10 automations verified in Cursor UI 2026-06-29 |

**Shipped EXP IDs on main:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031  
**Next eligible:** EXP-008 (journal → Beles internal links)

### Performance (15+ commits)

| Commit | Summary |
|---|---|
| `5547413` | Homepage Lighthouse: critical CSS, lazy bundles, CSS marquee |
| `0ab1ab9` | Mobile carousel/pin jitter fix; defer letters bundle |
| `a6b3dea` | Remove homepage page loaders for immediate content |
| `19aa0eb` | GSC coverage, mobile editorial UX, Lighthouse |
| `d1cd430` | Editorial WebP + `<picture>` variants for page weight |
| `ea60689` | Vercel build: skip Python wax-seal step in CI |
| `6e04d95` | Phase 3 proof layer + performance fixes |
| `0e92d94`–`c714cf6` | Mobile GSAP pin stabilization: `normalizeScroll`, iOS Safari fixes, Maison pin chain, jsDelivr CDN fallback for `home.js` when Vercel deploy quota blocks prod |

### Content (40+ commits)

| Theme | Commits | Notes |
|---|---|---|
| Homepage experience | `ee372e6`–`c714cf6` | WebGL shader bands, hero/house pins, name carousel, leopard House of Memory, horizontal intro track |
| Beautiful Letters | `13c83de` | Sky archive backdrop, wax seals |
| Editorial refresh | `6fb50cf`, `ce1a452`, `4141493` | Inner pages, wear close-skin imagery, journal water tones |
| Trust / proof | `b17f343`, `6e04d95`, `291538f`, `790ad6f` | Legal gaps, proof layer, CVR 43933485, Beles restock trust microcopy |
| SEO content | `32a9790`, `9a40e0a`, `d3943a4` | Prickly-pear discovery landing; smell-intent journal article; sitemap refresh |
| Demand research | `b3619e2` | Phase 4 lifecycle copy sweep, Ballpark study kit |

### Infra (6 commits)

| Commit | Summary |
|---|---|
| `baae843` | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3: consent recording, auto-generated sitemap |
| `b3619e2` | Phase 4: demand sprint CI, lifecycle copy sweep |
| `ea60689` | CI build fix (Python wax-seal split) |
| `32a9790` | Growth QA scripts (`npm run growth:qa`), validate-ledger, score-experiment |
| `f693e9c` | L2b conditional auto-merge policy in `autonomy-policy.md` |

## Architecture changes (baseline drift)

| Area | Before (baseline) | Now on main | Action |
|---|---|---|---|
| Routes | 17 indexed pages | **19** — added `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` | Update baseline route table |
| Sitemap | 17 URLs | **19 URLs** | Update baseline SEO state |
| SEO gaps | No prickly pear landing; limited smell-intent journal | **EXP-003/004 shipped** | Remove prickly-pear gap; smell-intent article live |
| Beles conversion | Form only | **Trust microcopy block** above `#waitlist` (EXP-005) | Document in conversion paths |
| Growth OS | Not documented | Full `/growth/` tree + AI hard review + L2b auto-merge | Add OS note |
| Automations | pending_registration | **10 verified active** (EXP-031); `pr_growth_auto_merge` awaiting save | Note in memory |
| Favicon | "verify committed" | `images/favicon.jpeg` site-wide | Mark resolved |
| Homepage script | Local `scripts/home.js` | **jsDelivr CDN** pinned to `@94b69cc` until Vercel quota resets | Note deploy risk |
| Analytics/API | Unchanged event set | No new event names in window | No analytics table change |

## Backlog adjustments

| EXP ID | Main status | Notes |
|---|---|---|
| EXP-001 | done | Already marked |
| EXP-002 | done | Already marked |
| EXP-003 | done | Shipped in `32a9790` |
| EXP-004 | done | Shipped in `9a40e0a` |
| EXP-005 | done | Shipped in `790ad6f` via PR #44 (first L2b auto-merge) |
| EXP-031 | done | 10 automations verified 2026-06-29 |

No backlog row status changes required — all shipped EXP IDs already `done`.

## Next actions

1. Run **EXP-008** — journal → Beles internal links (highest priority)
2. Save `pr_growth_auto_merge` in Cursor Automations UI if not yet saved
3. Monitor GSC for prickly-pear + smell-intent clusters (14–28d post EXP-003/004)
4. Monitor Beles `restock_form_started` → `restock_form_submitted` after EXP-005 trust microcopy
5. Revert jsDelivr CDN pin on `index.html` once Vercel deploy quota resets and `94b69cc` is live in prod
