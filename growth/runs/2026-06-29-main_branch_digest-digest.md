# Run log — main_branch_digest

**Date:** 2026-06-29  
**Automation:** main_branch_digest  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Source ref:** `origin/main` @ `c714cf6`  
**Commit count:** 74

## Summary

Main shipped a dense week: growth OS + three SEO/conversion experiments (EXP-003/004/005), homepage performance and GSAP pin stabilization, editorial WebGL shaders, Beautiful Letters, and Phase 2–4 infra (CI, analytics, sitemap, trust/legal). First L2b conditional auto-merge landed (EXP-005, PR #44).

## Shipped experiments (main)

| EXP ID | Commit | What shipped |
|---|---|---|
| EXP-001 | (in growth bundle) | Baseline + growth OS scaffold |
| EXP-002 | (in growth bundle) | Cursor rules, automation prompts, QA scripts |
| EXP-003 | `32a9790` | `/prickly-pear-parfum` discovery landing + FAQ schema |
| EXP-004 | `9a40e0a` | `/journal/what-does-fico-d-india-smell-like` smell-intent article |
| EXP-005 | `790ad6f` | Beles restock trust microcopy block + FAQ JSON-LD update |
| EXP-031 | `f5679c9` / registry sync | 10 growth automations registered in Cursor UI |

All above marked `done` in backlog. Monitor EXP-003/004 GSC in 14–28d; EXP-005 conversion via `restock_form_started` → `restock_form_submitted` on `/beles#waitlist` over 14d.

## Commits by category

### Growth (13)

| Hash | Date | Subject |
|---|---|---|
| `32a9790` | 2026-06-29 | Add growth OS, prickly pear discovery landing, and favicon |
| `a6c33f0` | 2026-06-29 | Add AI hard review protocol and sync automation registry |
| `2d91bbe` | 2026-06-29 | Document save order for all six remaining growth automations |
| `f693e9c` | 2026-06-29 | Sync automation registry, add MCP setup, conditional auto-merge |
| `f5679c9` | 2026-06-29 | Complete growth OS setup: Reddit login, auto-merge, Agent-Reach sync |
| `9a40e0a` | 2026-06-29 | Ship EXP-004 journal article on Fico d'India smell |
| `790ad6f` | 2026-06-29 | Ship EXP-005 Beles restock form trust microcopy (#44) |
| `9c91e6f` | 2026-06-29 | Log EXP-005 auto-merge: pr_growth_auto_merge run ledger |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark study launch kit |
| `b17f343` | 2026-06-25 | Fix P0 trust and legal gaps: lifecycle labels, geography, schema, privacy |
| `6e04d95` | 2026-06-25 | Phase 3 proof layer, consent recording, auto-generated sitemap, perf fixes |
| `baae843` | 2026-06-25 | Phase 2 analytics funnel, API rate limits, CI pipeline, security headers |
| `19aa0eb` | 2026-06-27 | Improve GSC coverage, mobile editorial UX, and Lighthouse performance |

### Perf (18)

| Hash | Date | Subject |
|---|---|---|
| `c714cf6` | 2026-06-29 | Load home scroll pin script from jsDelivr until Vercel deploy quota resets |
| `94b69cc`–`0e92d94` | 2026-06-29 | Mobile Maison/house GSAP pin chain, iOS Safari normalizeScroll, jitter fixes |
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel and scroll-pin jitter; defer letters bundle for Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders so content shows immediately |
| `5547413` | 2026-06-28 | Improve homepage Lighthouse: critical CSS, lazy bundles, CSS marquee |
| `ea60689` | 2026-06-28 | Fix Vercel build by skipping Python wax-seal step in CI |
| `3838a29`–`020acf7` | 2026-06-28 | Desktop/mobile scroll pin init order, hero lock removal, jitter fixes |
| `d3943a4` | 2026-06-28 | Smooth mobile Maison scroll, fix orbit clipping, refresh SEO sitemap |
| `afda8eb` | 2026-06-27 | Fix mobile horizontal bleed on homepage and editorial pages |
| `d1cd430` | 2026-06-24 | Optimize editorial images with display-sized WebP variants |

### Content (38)

| Hash | Date | Subject |
|---|---|---|
| `13c83de` | 2026-06-28 | Add Beautiful Letters experience with sky archive backdrop and wax seals |
| `d8ed434`–`7f8014c` | 2026-06-27–28 | Name marquee/carousel, orbit logo, House of Memory layout iterations |
| `3b28f7f`–`ee372e6` | 2026-06-27 | Editorial WebGL shader bands across homepage and inner pages |
| `ce1a452` | 2026-06-27 | Replace wear imagery with close-skin shots; House of Memory backdrop |
| `959f669`–`c0dd254` | 2026-06-27 | House of Memory leopard background, headline/principles layout |
| `291538f` | 2026-06-25 | Publish CVR 43933485, studio authorship roles, Beles accord images |
| `6fb50cf` | 2026-06-23 | Editorial site styles; refresh inner pages, heroes, gallery fixes |

*(Remaining content commits are shader visibility, headline line-break, and layout polish on homepage sections.)*

### Infra (5)

| Hash | Date | Subject |
|---|---|---|
| `baae843` | 2026-06-25 | Analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | 2026-06-25 | Consent recording, auto-generated sitemap, performance fixes |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI |
| `ea60689` | 2026-06-28 | Skip Python wax-seal in CI (numpy build failure fix) |
| `f693e9c` | 2026-06-29 | MCP setup, conditional auto-merge policy sync |

## Architecture drift vs baseline

| Area | Before (2026-06-28 baseline) | After (main @ c714cf6) |
|---|---|---|
| Routes | 17 sitemap URLs | **19** — added `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` |
| Journal | 3 articles | **4** articles |
| Beles conversion | Form only | **Trust microcopy block** above form (EXP-005) |
| Growth OS | Not in baseline | **`/growth/`** live with automations, AI hard review, L2b auto-merge |
| SEO gaps | No prickly-pear landing | **Partially closed** — discovery landing + smell-intent article live |
| Analytics events | Unchanged wishlist | **No new events shipped** — newsletter/journal click events still backlog |
| API | Baseline accurate | Unchanged (`POST /api/waitlist`) |

**Action:** Updated `growth/baseline.md` to reflect routes, sitemap count, journal depth, Beles trust block, and revised SEO gaps.

## Backlog status check

Shipped EXP IDs on main this window: EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 — all already `done` in backlog. No status changes required.

## Next eligible experiments

1. **EXP-008** — Journal → Beles internal links (partial links exist from EXP-003/004; full pass still open)
2. **EXP-007** — Newsletter distinct analytics events
3. **EXP-010** — Copenhagen appointment discovery

## Durable learnings (→ memory.md)

- Always digest from **`origin/main`** — local `main` can lag remote by 10+ commits.
- **L2b auto-merge** proven on EXP-005 (PR #44, 0 block findings, CI green).
- **GSAP pins:** eager script load + ordered init + `normalizeScroll` for iOS; defer letters bundle for Lighthouse.
- **Vercel deploy quota** can block prod; jsDelivr CDN for `home-scroll-pins` is valid hotfix until deploy succeeds.
- **SEO cluster** forming: prickly-pear landing ↔ fico-d-india ↔ smell-like article ↔ Beles.

## Lock

N/A — read-only digest. `lock_status` remains `unlocked`.
