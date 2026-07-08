# Run: main_branch_digest · digest

**Date:** 2026-06-29  
**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Base ref:** `origin/main` @ `c714cf6`  
**Commits:** 74

## Summary

Main shipped growth OS scaffolding, three conversion/SEO experiments (EXP-003/004/005), homepage performance and scroll-pin stabilization, editorial/visual upgrades (shaders, letters, wear imagery), and earlier-phase infra (CI, analytics, legal). **No new commits** landed on `origin/main` since the prior digest snapshot at `c714cf6`; this run refreshes baseline drift and memory.

## Commits by category

### Growth (8)

| Commit | Date | Summary |
|---|---|---|
| `32a9790` | 2026-06-29 | Growth OS scaffold, `/prickly-pear-parfum` landing (EXP-003), favicon |
| `a6c33f0` | 2026-06-29 | AI hard review protocol + automation registry sync |
| `2d91bbe` | 2026-06-29 | Document save order for remaining growth automations |
| `f693e9c` | 2026-06-29 | Automation registry, MCP setup, conditional auto-merge (L2b) |
| `f5679c9` | 2026-06-29 | Growth OS completion: Reddit login, auto-merge, Agent-Reach sync |
| `9a40e0a` | 2026-06-29 | **EXP-004** — journal smell-intent article + sitemap |
| `790ad6f` | 2026-06-29 | **EXP-005** — Beles restock trust microcopy (PR #44) |
| `9c91e6f` | 2026-06-29 | EXP-005 auto-merge ledger entry |

**Shipped EXP IDs:** EXP-001 (baseline), EXP-002 (OS), EXP-003 (prickly pear landing), EXP-004 (smell article), EXP-005 (trust microcopy), EXP-031 (automation registration). All already `done` in backlog.

### Performance (14+)

| Commit | Date | Summary |
|---|---|---|
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee — Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove page loaders for immediate content paint |
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel/pin jitter; defer letters bundle |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI build |
| `d1cd430` | 2026-06-24 | WebP picture elements for editorial images |
| `19aa0eb` | 2026-06-27 | GSC coverage, mobile editorial UX, Lighthouse |
| `0e92d94`–`de93013` | 2026-06-29 | Mobile scroll-pin stabilization (normalizeScroll, iOS Safari, Maison pin anchoring) |
| `94b69cc` | 2026-06-29 | Fix mobile Maison pin by chaining to house pin + refresh order |
| `c714cf6` | 2026-06-29 | Temporary jsDelivr CDN for `home.js` @ `94b69cc` (Vercel deploy quota) |
| `3838a29`–`020acf7` | 2026-06-28 | Desktop/mobile GSAP pin jitter fixes |

### Content (40+)

| Theme | Commits | Highlights |
|---|---|---|
| Homepage editorial | `ee372e6`–`959f669`, `7b4e21b`–`7b8014c` | WebGL shader bands, House of Memory leopard backdrop, name carousel, headline layout |
| Letters | `13c83de` | Beautiful Letters archive with wax seals |
| Wear / journal | `ce1a452`, `4141493` | Close-skin wear imagery; journal water tones |
| Product / proof | `291538f`, `03d7fed`, `54ea49f` | Beles accord images, chapter shader bands |
| Editorial refresh | `6fb50cf` | Inner-page heroes, footer logo, gallery fixes |
| Lifecycle / research | `b3619e2` | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark kit |

### Infra (6)

| Commit | Date | Summary |
|---|---|---|
| `b17f343` | 2026-06-25 | P0 trust/legal: lifecycle labels, Asmara geography, shipping schema, privacy, imprint |
| `baae843` | 2026-06-25 | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | 2026-06-25 | Phase 3: proof layer, consent recording, auto-generated sitemap |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI |
| `d3943a4` | 2026-06-28 | Sitemap refresh (orbit/mobile fixes bundle) |
| `f693e9c` | 2026-06-29 | MCP example config, growth automation registry |

## Architecture changes (baseline delta)

| Area | Before | After |
|---|---|---|
| Routes | 17 indexed URLs | **19** — added `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` |
| Beles conversion | Form only | Trust microcopy block above `#waitlist` (EXP-005) |
| Growth OS | — | `/growth/*`, Cursor rules, automation prompts, scoring/QA scripts |
| Auto-merge | Human only | L2b conditional auto-merge for eligible `growth/*` PRs |
| Favicon | — | `images/favicon.jpeg` committed |
| Homepage scripts | Self-hosted `home.js` | Temporary jsDelivr CDN pin @ `94b69cc` until Vercel deploy quota resets |
| Analytics events | Unchanged set | No new events shipped; measurement gaps remain |

## Incremental since last digest

**None** — `origin/main` unchanged at `c714cf6`.

## Backlog adjustments

No status changes required — EXP-001 through EXP-005 and EXP-031 already marked `done`.

## Follow-ups

1. Monitor GSC for prickly-pear and smell-intent clusters (14–28d post EXP-003/004).
2. Monitor Beles `restock_form_started` → `submitted` ratio post EXP-005 (14d).
3. Next eligible experiment: **EXP-008** (journal → Beles internal links).
4. Revert jsDelivr CDN pin to self-hosted `/scripts/home.js` after next successful Vercel deploy.
5. Continue mobile pin QA on iOS Safari after normalizeScroll + Maison chaining fixes.

## Lock

**Lock:** unlocked (read-only digest run)
