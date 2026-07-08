# Main branch digest — 2026-06-29

**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Base:** `origin/main` at `c714cf6`  
**Commits:** 74

## Summary

A dense week: growth OS landed on main, three SEO/conversion experiments shipped (EXP-003–005), first L2b auto-merge executed, and a large homepage performance + scroll-pin stabilization pass. No API route changes; analytics event set unchanged.

## Shipped experiments (main)

| EXP | Commit | What shipped |
|---|---|---|
| EXP-003 | `32a9790` | `/prickly-pear-parfum` discovery landing + growth OS scaffold |
| EXP-004 | `9a40e0a` | `/journal/what-does-fico-d-india-smell-like` smell-intent article |
| EXP-005 | `790ad6f` | Beles `#waitlist` trust microcopy (`shop__restock-trust`) — PR #44 |
| EXP-031 | `f5679c9`, `f693e9c` | Automation registry sync, MCP setup, 10 automations verified in UI |

**Auto-merge:** `9c91e6f` — first L2b squash-merge for EXP-005 (`pr_growth_auto_merge`).

## Commits by category

### Growth (12)

| Hash | Date | Subject |
|---|---|---|
| `32a9790` | 2026-06-29 | Add growth OS, prickly pear discovery landing, and favicon |
| `9a40e0a` | 2026-06-29 | Ship EXP-004 journal article on Fico d'India smell |
| `790ad6f` | 2026-06-29 | Ship EXP-005 Beles restock form trust microcopy (#44) |
| `9c91e6f` | 2026-06-29 | Log EXP-005 auto-merge: pr_growth_auto_merge run ledger |
| `a6c33f0` | 2026-06-29 | Add AI hard review protocol and sync automation registry |
| `2d91bbe` | 2026-06-29 | Document save order for all six remaining growth automations |
| `f693e9c` | 2026-06-29 | Sync automation registry, add MCP setup, conditional auto-merge |
| `f5679c9` | 2026-06-29 | Complete growth OS setup: Reddit login, auto-merge, Agent-Reach sync |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark study launch kit |
| `baae843` | 2026-06-25 | Phase 2 analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | 2026-06-25 | Phase 3 proof layer, consent recording, auto-generated sitemap, performance fixes |
| `19aa0eb` | 2026-06-27 | Improve GSC coverage, mobile editorial UX, and Lighthouse performance |

### Perf (18)

| Hash | Date | Subject |
|---|---|---|
| `5547413` | 2026-06-28 | Improve homepage Lighthouse: critical CSS, lazy bundles, CSS marquee |
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel jitter; defer letters bundle for Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders so content shows immediately |
| `ea60689` | 2026-06-28 | Fix Vercel build by skipping Python wax-seal step in CI |
| `d1cd430` | 2026-06-24 | Optimize editorial images with display-sized WebP variants |
| `0e92d94` | 2026-06-29 | Fix mobile section pin jitter with GSAP normalizeScroll |
| `4c04c10` | 2026-06-29 | Stabilize mobile scroll pins for iOS Safari |
| `a5d83e3` | 2026-06-29 | Fix mobile Maison GSAP pin: exclude CSS fallback overrides |
| `de93013` | 2026-06-29 | Fix mobile Maison pin lock: anchor start to house pin end |
| `94b69cc` | 2026-06-29 | Fix mobile Maison pin by chaining to house and fixing refresh order |
| `3838a29` | 2026-06-28 | Fix desktop scroll jitter in Maison and House of Memory pins |
| `020acf7` | 2026-06-28 | Fix homepage scroll pins after layout settles; remove mobile scroll hijacking |
| `e971673` | 2026-06-28 | Fix homepage scroll locks: init pins in order with measured positions |
| `d3943a4` | 2026-06-28 | Smooth mobile Maison scroll, fix orbit clipping |
| `82e4314` | 2026-06-27 | Restore mobile Maison pin-scroll; refine homepage marquee orbit |
| `afda8eb` | 2026-06-27 | Fix mobile horizontal bleed on homepage and editorial pages |
| `291538f` | 2026-06-25 | Optimize Beles accord profile images |
| `c714cf6` | 2026-06-29 | Load home scroll pin script from jsDelivr until Vercel deploy quota resets |

### Content (38)

Homepage narrative, shaders, House of Memory leopard backdrop, name marquee/orbit carousel, Beautiful Letters wax-seal experience, wear close-skin imagery, editorial inner-page refresh, journal water tones, lifecycle copy sweep, CVR 43933485 publish, studio authorship corrections, headline/layout iterations on House of Memory, hero horizontal intro track, shader bands site-wide.

Representative commits: `6fb50cf`, `13c83de`, `ee372e6`–`3b28f7f`, `ce1a452`, `959f669`–`7b4e21b`, `3a18cad`–`6050039`, `d8ed434`, `b17f343`, `291538f`.

### Infra (7)

| Hash | Date | Subject |
|---|---|---|
| `ea60689` | 2026-06-28 | Fix Vercel build: skip Python wax-seal in CI |
| `baae843` | 2026-06-25 | CI pipeline, API rate limits, security headers |
| `6e04d95` | 2026-06-25 | Auto-generated sitemap |
| `b17f343` | 2026-06-25 | P0 trust/legal gaps: privacy, imprint, shipping schema |
| `c714cf6` | 2026-06-29 | jsDelivr CDN fallback for home-scroll-pin (Vercel quota) |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI |
| `f693e9c` | 2026-06-29 | MCP setup for growth automations |

## Architecture drift vs baseline

| Area | Change | Baseline updated? |
|---|---|---|
| Routes | +`/prickly-pear-parfum`, +`/journal/what-does-fico-d-india-smell-like` | Yes |
| Sitemap | 17 → 19 URLs | Yes |
| Analytics events | No new events | No change |
| API | Rate limits (Phase 2); no new endpoints | No change |
| Conversion UI | Beles restock trust block above form | Yes |

## Backlog status

EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 already marked `done` in `backlog.md` — no adjustment needed.

## Next focus (from backlog)

1. EXP-008 — Journal → Beles internal links  
2. EXP-007 — Newsletter distinct analytics events  
3. EXP-010 — Copenhagen appointment discovery

## Actions taken this run

- Updated `growth/baseline.md` (routes, sitemap count, SEO gaps, bottlenecks, Beles trust UI)
- Appended `growth/memory.md` (2026-06-29 wins/lessons)
- `growth/state.json` `last_run_at` refreshed

**Lock:** unlocked · **Code changes:** docs only
