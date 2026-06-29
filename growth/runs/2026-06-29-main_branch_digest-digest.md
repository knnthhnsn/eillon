# Main branch digest — 2026-06-29

**Automation:** `main_branch_digest`  
**Window:** last 7 days (`git log --since="7 days ago"`)  
**Source ref:** `origin/main` @ `c714cf6`  
**Commit count:** 74  
**Triggered:** 2026-06-29T15:00:00Z (cron)

## Summary

Main shipped substantial homepage motion/perf work, three growth experiments (EXP-003/004/005), and the full growth OS scaffold with L2b auto-merge proven on EXP-005. Baseline drift detected: sitemap now 19 URLs (was 17 in `baseline.md`); two new SEO routes and Beles trust microcopy not yet reflected — fixed in this run.

## Shipped experiment IDs

| EXP | Title | Merge commit | Status |
|---|---|---|---|
| EXP-001 | Baseline + growth OS setup | (pre-window / main) | done |
| EXP-002 | Cursor rules + automation scaffolding | (pre-window / main) | done |
| EXP-003 | Prickly pear discovery landing | `32a9790` | done |
| EXP-004 | Journal: What does Fico d'India smell like? | `9a40e0a` | done |
| EXP-005 | Beles restock form trust microcopy | `790ad6f` (#44) | done |
| EXP-031 | Cursor automation registration | `f5679c9` | done |

## Commits by category

### Growth (8)

| Commit | Message |
|---|---|
| `32a9790` | Add growth OS, prickly pear discovery landing, and favicon |
| `9a40e0a` | Ship EXP-004 journal article on Fico d'India smell |
| `790ad6f` | Ship EXP-005 Beles restock form trust microcopy (#44) |
| `9c91e6f` | Log EXP-005 auto-merge: pr_growth_auto_merge run ledger |
| `a6c33f0` | Add AI hard review protocol and sync automation registry |
| `2d91bbe` | Document save order for all six remaining growth automations |
| `f693e9c` | Sync automation registry, add MCP setup, conditional auto-merge |
| `f5679c9` | Complete growth OS setup: Reddit login, auto-merge, Agent-Reach sync |

### Performance (22)

| Commit | Message |
|---|---|
| `c714cf6` | Load home scroll pin script from jsDelivr until Vercel deploy quota resets |
| `94b69cc` | Fix mobile Maison pin by chaining to house and fixing refresh order |
| `de93013` | Fix mobile Maison pin lock by anchoring start to house pin end |
| `a5d83e3` | Fix mobile Maison GSAP pin by excluding CSS fallback overrides |
| `4c04c10` | Stabilize mobile scroll pins for iOS Safari |
| `0e92d94` | Fix mobile section pin jitter with GSAP normalizeScroll |
| `0ab1ab9` | Fix mobile carousel and scroll-pin jitter; defer letters bundle for Lighthouse |
| `a6b3dea` | Remove homepage page loaders so content shows immediately |
| `5547413` | Improve homepage Lighthouse with critical CSS, lazy bundles, CSS marquee |
| `ea60689` | Fix Vercel build by skipping Python wax-seal step in CI |
| `3838a29` | Fix desktop scroll jitter in Maison and House of Memory pins |
| `020acf7` | Fix homepage scroll pins after layout settles; remove mobile scroll hijacking |
| `e971673` | Fix homepage scroll locks by initializing pins in order |
| `d3943a4` | Smooth mobile Maison scroll, fix orbit clipping, refresh SEO sitemap |
| `19aa0eb` | Improve GSC coverage, mobile editorial UX, and Lighthouse performance |
| `afda8eb` | Fix mobile horizontal bleed on homepage and editorial pages |
| `fddb56b` | Fix subpage cream gap by stopping main from flex-growing |
| `a4029dd` | Target House of Memory head spotlight; remove subpage footer gap |
| `d1cd430` | Optimize editorial images with display-sized WebP variants |
| `6e04d95` | Phase 3 proof layer, consent recording, auto-generated sitemap, perf fixes |
| `bde6f0e` | Fix name marquee loop seam with time-based position |
| `04fbafc` | Halve orbit logo size and fix homepage marquee loop seam |

### Content (18)

| Commit | Message |
|---|---|
| `13c83de` | Add Beautiful Letters experience with sky archive backdrop and wax seals |
| `ce1a452` | Replace wear imagery with close-skin shots; update House of Memory backdrop |
| `959f669` | Use black-leopard-red background on House of Memory section |
| `c0dd254` | Remove Desert fruit image from House of Memory section |
| `99c46f4` | Reposition House of Memory principles beside headline |
| `fc397fe` | Set House of Memory headline to three explicit lines |
| `291538f` | Publish CVR 43933485; correct studio authorship; optimize Beles accord images |
| `b17f343` | Fix P0 trust and legal gaps: lifecycle labels, Asmara geography, shipping schema |
| `6fb50cf` | Add editorial site styles; refresh inner pages with solid footer logo |
| `4141493` | Fix homepage name shader visibility; refine journal water tones |
| `3a18cad` | Slide hero sideways into name section with pinned horizontal intro track |
| `e5ad344` | Remove hero scroll lock so threshold section scrolls naturally |
| `6050039` | Remove hero zoom scroll so intro photo stays static |
| `7f8014c` | Add infinite EILLON and logo carousel to name section |
| `6f94513` | Use logo.png emblem in name section carousel |
| `d8ed434` | Refine homepage name marquee with larger type, faster scroll |
| `b3619e2` | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark study kit |
| `32a9790` | Prickly pear discovery landing + favicon (also growth) |

### Infra (6)

| Commit | Message |
|---|---|
| `baae843` | Phase 2 analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3 proof layer, consent recording, auto-generated sitemap (also perf) |
| `b3619e2` | Phase 4 demand sprint CI, lifecycle copy sweep (also content) |
| `f693e9c` | Sync automation registry, MCP setup, conditional auto-merge (also growth) |
| `ea60689` | Fix Vercel build by skipping Python wax-seal step (also perf) |
| `c714cf6` | jsDelivr CDN pin for scroll script when Vercel deploy quota blocked (also perf) |

### Visual / motion (20 — cross-cutting, not duplicated above)

WebGL shader bands (`ee372e6` through `8106b72`), GSAP scroll pins for hero/house/Maison (`c7ddcfd` through `bab1e09`), House of Memory layout iterations, chapter shader extensions (`03d7fed`, `54ea49f`). These are brand/experience work; monitor Lighthouse and mobile pin stability.

## Architecture changes (baseline impact)

| Change | Detail |
|---|---|
| New routes | `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` |
| Sitemap | 19 public URLs (was 17 in baseline) |
| Beles conversion | Trust microcopy block above `#waitlist` (EXP-005) |
| Analytics | No new events this window; existing funnel from Phase 2 unchanged |
| API | Rate limits from Phase 2; no schema changes |
| Favicon | `images/favicon.jpeg` |

## Backlog sync

EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 already marked `done` in `backlog.md`. No status changes required.

## Next eligible experiments

1. **EXP-008** — Journal → Beles internal links (highest priority)
2. **EXP-007** — Newsletter distinct analytics events
3. **EXP-010** — Copenhagen appointment discovery

## Actions taken this run

- [x] Digest written
- [x] `baseline.md` updated for route/sitemap/conversion drift
- [x] `memory.md` appended with durable learnings
- [ ] `results.tsv` — not appended (digest-only run)

## Lock

Repo unlocked. No code changes beyond docs.
