# Run log — main_branch_digest

**Date:** 2026-06-29  
**Automation:** main_branch_digest (`c5438c23-7395-11f1-a8a0-cafc5ef88358`)  
**Trigger:** cron `*/30 * * * *` @ 2026-06-29T13:30:00Z  
**Window:** last 7 days on `origin/main`  
**HEAD:** `c714cf6` — Load home scroll pin script from jsDelivr until Vercel deploy quota resets.  
**Commit count:** 74

## Summary

Main shipped substantial **growth OS + SEO content + conversion copy** alongside heavy **homepage perf/pin stabilization** and **Phase 2–4 infra** (analytics, CI, sitemap, legal). Six backlog experiments are now live on main (EXP-001 through EXP-005, EXP-031). Baseline drift fixed: two new public routes and sitemap URL count 17 → 19.

## Shipped experiments (main)

| EXP | Loop | Shipped | Notes |
|---|---|---|---|
| EXP-001 | measurement | 2026-06-29 | Baseline + growth OS scaffold |
| EXP-002 | automation_os | 2026-06-29 | Rules, prompts, QA scripts, autonomy policy |
| EXP-003 | seo_content | 2026-06-29 | `/prickly-pear-parfum` discovery landing |
| EXP-004 | seo_content | 2026-06-29 | `/journal/what-does-fico-d-india-smell-like` |
| EXP-005 | conversion_copy | 2026-06-29 | Beles restock trust microcopy (PR #44, L2b auto-merge) |
| EXP-031 | automation_os | 2026-06-29 | 10 Cursor automations verified in UI |

Backlog statuses for these IDs were already `done`; no backlog edits required.

## Commits by category

### Growth (8)

| Commit | Summary |
|---|---|
| `32a9790` | Growth OS, prickly pear discovery landing, favicon |
| `f693e9c` | Automation registry, MCP setup, conditional auto-merge |
| `2d91bbe` | Save order for remaining growth automations |
| `a6c33f0` | AI hard review protocol + registry sync |
| `f5679c9` | Reddit login, auto-merge, Agent-Reach sync |
| `9a40e0a` | EXP-004 smell-intent journal article |
| `790ad6f` | EXP-005 Beles trust microcopy (#44) |
| `9c91e6f` | EXP-005 auto-merge ledger entry |

### Content (12+)

| Commit | Summary |
|---|---|
| `32a9790` | `/prickly-pear-parfum` landing (EXP-003) |
| `9a40e0a` | Smell-intent journal + internal links (EXP-004) |
| `790ad6f` | Beles FAQ/trust copy above restock form |
| `6fb50cf` | Editorial site styles, inner-page heroes |
| `b17f343` | P0 trust/legal: lifecycle labels, privacy, imprint |
| `291538f` | CVR publish, studio authorship, Beles accord images |
| `b3619e2` | Phase 4 lifecycle copy sweep, Ballpark kit |
| `ce1a452` | Wear close-skin imagery refresh |
| `4141493` | Journal water tones |
| `19aa0eb` | GSC coverage, mobile editorial UX |
| `d3943a4` | SEO sitemap refresh |
| `d1cd430` | Editorial WebP variants for Lighthouse |

### Perf (35+)

Homepage GSAP ScrollTrigger pins, WebGL shader bands, CSS marquee, letters bundle defer, critical CSS, mobile iOS normalizeScroll chain, Maison/house pin ordering — commits `5547413` through `c714cf6`. Notable fixes:

- `0ab1ab9` — Mobile carousel/pin jitter; defer letters for Lighthouse
- `5547413` — Critical CSS, lazy bundles, CSS marquee
- `0e92d94`–`c714cf6` — Mobile pin stabilization + jsDelivr CDN hotfix for deploy quota

### Infra (6)

| Commit | Summary |
|---|---|
| `baae843` | Phase 2: analytics funnel, API rate limits, CI, security headers |
| `6e04d95` | Phase 3: proof layer, consent, auto sitemap, perf fixes |
| `b3619e2` | Phase 4 demand sprint CI |
| `ea60689` | Skip Python wax-seal in CI (Vercel build fix) |
| `f693e9c` | L2b conditional auto-merge policy wiring |
| `32a9790` | Favicon → `images/favicon.jpeg` |

## Baseline drift (fixed this run)

| Item | Was | Now on main |
|---|---|---|
| Sitemap URLs | 17 | **19** |
| `/prickly-pear-parfum` | missing | live (EXP-003) |
| `/journal/what-does-fico-d-india-smell-like` | missing | live (EXP-004) |
| Journal articles | 3 + hub | **4 + hub** |
| High-intent SEO gap | prickly pear landing missing | **partially closed** |
| Beles conversion | form only | trust microcopy above `#waitlist` |

Analytics events unchanged this window (no new `va()` events shipped).

## Durable learnings → `memory.md`

- L2b auto-merge proven on EXP-005; monitor Beles form funnel 14d
- GSAP mobile pins: eager load + ordered init + iOS `normalizeScroll` + pin chaining
- Vercel deploy quota can block prod; jsDelivr CDN pin is valid interim hotfix
- Always digest from `origin/main`, not stale local `main`

## Next eligible backlog

**EXP-008** — Journal → Beles internal links (priority 160, `internal_linking`)

## Actions taken

- [x] Digest run log (this file)
- [x] `growth/baseline.md` route + SEO sync
- [x] `growth/memory.md` append
- [x] Backlog verified (shipped EXP IDs already `done`)
- [ ] `growth/results.tsv` — no new experiment; digest only

**Lock:** none · **Branch:** `cursor/growth-main-branch-digest-aaa4`
