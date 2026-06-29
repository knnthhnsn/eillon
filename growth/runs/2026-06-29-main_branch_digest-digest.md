# Main Branch Digest

**Date:** 2026-06-29  
**Automation:** main_branch_digest  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Base:** `origin/main` @ `4c04c10`  
**Commits:** 70

## Summary

Main shipped substantial homepage motion/perf work, Phase 2–4 infra (CI, analytics, sitemap), and the first growth experiment batch: prickly-pear discovery landing (EXP-003), Fico d'India smell journal (EXP-004), Beles restock trust microcopy (EXP-005), plus full growth OS with L2b auto-merge. Sitemap grew from ~17 to **19 URLs**; two new SEO routes are live.

## Growth (8 commits)

| Commit | Summary | EXP |
|---|---|---|
| `32a9790` | Growth OS scaffold, `/prickly-pear-parfum` discovery landing, favicon | EXP-003 |
| `a6c33f0` | AI hard review protocol; automation registry sync | EXP-002 |
| `f693e9c` | MCP setup docs, conditional auto-merge policy (L2b) | EXP-002 |
| `2d91bbe` | Save-order docs for remaining automations | EXP-031 |
| `9a40e0a` | Journal: *What does Fico d'India smell like?* + FAQ schema | EXP-004 |
| `f5679c9` | Reddit Agent-Reach login, auto-merge wiring, state sync | EXP-031 |
| `790ad6f` | Beles restock trust microcopy block above `#waitlist` (PR #44) | EXP-005 |
| `9c91e6f` | Auto-merge run ledger for EXP-005 | — |

**Shipped experiment IDs:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 (all already `done` in backlog).

**Notable:** First L2b conditional auto-merge succeeded on PR #44 (790ad6f). Ten growth automations verified active in Cursor UI.

## Performance (18+ commits)

- **Image weight:** WebP `picture` variants for editorial pages (`d1cd430`).
- **Homepage Lighthouse:** Critical CSS, lazy bundles, CSS marquee replacing JS carousel, page-loader removal (`5547413`, `a6b3dea`).
- **Letters bundle:** Deferred load for Lighthouse; wax-seal Python step skipped in CI (`0ab1ab9`, `ea60689`).
- **Scroll pins:** Extensive GSAP ScrollTrigger fixes — mobile jitter, iOS Safari stabilization, `normalizeScroll` (`0ab1ab9` → `4c04c10`).
- **GSC / mobile editorial:** Coverage and UX pass (`19aa0eb`, `afda8eb`).

Homepage remains the perf risk surface (hero media + pins); ongoing iteration, not resolved.

## Content (25+ commits)

- **SEO landings:** `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` with internal links to Beles.
- **Homepage editorial:** WebGL shader bands, House of Memory leopard backdrop + headline layout, infinite name/logo carousel, horizontal hero intro track.
- **Letters:** Beautiful Letters sky archive + wax seals (`13c83de`).
- **Product/editorial:** Wear imagery refresh, chapter shader bands, Beles accord image optimization.
- **Trust/copy:** Phase 3 proof layer, lifecycle labels, CVR 43933485 publish, studio authorship corrections (`6e04d95`, `291538f`, `b17f343`).

## Infra (6 commits)

| Commit | Summary |
|---|---|
| `baae843` | Phase 2: analytics funnel events, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3: proof layer, consent recording, auto-generated sitemap |
| `b3619e2` | Phase 4: demand-sprint CI, lifecycle copy sweep, Ballpark study kit |
| `ea60689` | Vercel build fix — skip Python wax-seal in CI |
| `b17f343` | P0 trust/legal: chapter lifecycle, Asmara geography, shipping schema, privacy, imprint |
| `d3943a4` | Sitemap refresh after route additions |

Analytics events unchanged in this window (still missing newsletter-distinct and `journal_to_beles_click` — see backlog EXP-007, EXP-035).

## Baseline drift

**Updated in this run:** `growth/baseline.md`

- Added routes: `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like`
- Sitemap count: 19 URLs
- Beles conversion path: trust microcopy block (`.shop__restock-trust`)
- SEO gaps partially closed; journal cluster extended
- Favicon committed (`images/favicon.jpeg`)

## Backlog impact

No status changes required — EXP-001 through EXP-005 and EXP-031 already marked `done`. Next highest priority remains **EXP-008** (journal → Beles internal links).

## Measure / watch

- GSC impressions/clicks for prickly-pear and smell-intent queries (14–28d)
- `/beles` `restock_form_started` → `restock_form_submitted` after EXP-005 trust block
- Homepage Lighthouse scores after pin stabilization commits

## Lock

Repo unlocked. No code changes in this digest run — docs only.
