# Main Branch Digest

**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Branch:** `main` @ `c714cf6`  
**Commits:** 74

## Summary

Heavy week: growth OS went live, three SEO/conversion experiments shipped (EXP-003/004/005), homepage performance and GSAP pin stability received sustained fixes, and L2b conditional auto-merge completed its first merge (PR #44).

## Growth (8 commits)

| Commit | Summary | EXP |
|---|---|---|
| `32a9790` | Growth OS scaffold (`/growth/*`, Cursor rules, automation prompts, QA scripts), EXP-003 `/prickly-pear-parfum` landing, site-wide `favicon.jpeg` | EXP-001, EXP-002, EXP-003 |
| `a6c33f0` | AI hard review protocol (`growth/ai-review.md`, Bugbot gate, validate-ai-review script) | — |
| `2d91bbe` | Quick-setup doc for remaining automation registration | EXP-031 (partial) |
| `f693e9c` | Automation registry sync, MCP setup docs, L2b conditional auto-merge policy | EXP-002 |
| `9a40e0a` | EXP-004 smell-intent journal article + internal links + sitemap | EXP-004 |
| `f5679c9` | Agent-Reach sync, Reddit login scripts, auto-merge registry completion | EXP-031 |
| `790ad6f` | EXP-005 Beles restock trust microcopy (merged PR #44) | EXP-005 |
| `9c91e6f` | Auto-merge run ledger for EXP-005 | EXP-005 |

**Shipped experiments:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031  
**Open growth PRs:** 0  
**First L2b auto-merge:** PR #44 @ `790ad6f` (0 block findings, CI green)

## Performance (18 commits)

Homepage Lighthouse and scroll-pin stability dominated:

- `5547413` — Critical CSS, lazy bundles, CSS marquee (replace JS carousel)
- `0ab1ab9` — Mobile carousel/pin jitter fix; defer letters bundle
- `a6b3dea` — Remove page loaders for immediate content paint
- `ea60689` — Skip Python wax-seal step in CI (Vercel build fix)
- `d1cd430` — WebP picture elements for editorial images
- `19aa0eb` — GSC coverage, mobile editorial UX, Lighthouse pass
- `0e92d94`–`c714cf6` — iOS Safari pin stabilization (`normalizeScroll`, Maison/house pin chaining, jsDelivr fallback for home scroll script during Vercel quota)

**Lesson:** Lazy GSAP loading caused mobile jitter; eager load restored. Pin init order and measured scroll positions matter for ScrollTrigger stability.

## Content (12 commits)

| Area | Commits | Notes |
|---|---|---|
| SEO landings | `32a9790`, `9a40e0a` | `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like` |
| Homepage editorial | `13c83de`, `7f8014c`+ | Beautiful Letters archive, name carousel, House of Memory leopard backdrop |
| Visual system | `ee372e6`–`3b28f7f` | WebGL shader bands (homepage + inner pages); later scoped/refined |
| Product/editorial | `ce1a452`, `291538f` | Wear close-skin imagery; Beles accord WebP optimization |
| Trust/copy | `b17f343`, `b3619e2` | Lifecycle labels, legal gaps, Phase 4 demand sprint copy sweep |

Journal count: **3 → 4 articles** (+ smell-intent piece). Sitemap: **17 → 19 URLs**.

## Infra (10 commits)

| Commit | Area |
|---|---|
| `baae843` | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3: proof layer, consent recording, auto-generated sitemap |
| `b3619e2` | Phase 4: demand sprint CI, Ballpark study kit |
| `6fb50cf` | Editorial site styles, inner-page refresh |
| `d3943a4` | Sitemap refresh after mobile/orbit fixes |
| `32a9790` | `scripts/growth/*` (qa, score, validate-ledger, select-next) |
| `a6c33f0` | `scripts/growth/validate-ai-review.mjs` |

No API route changes in window. Waitlist endpoint unchanged.

## Baseline drift (action taken)

| Item | Before | After |
|---|---|---|
| Routes | 17 indexed pages | + `/prickly-pear-parfum`, + `/journal/what-does-fico-d-india-smell-like` |
| Sitemap URLs | 17 | 19 |
| Beles conversion | Form only | Trust microcopy block above `#waitlist` (EXP-005) |
| Favicon | prior asset | `images/favicon.jpeg` site-wide |
| Growth OS | absent | `/growth/*` + 10 registered automations |
| SEO gap | No prickly-pear landing | **Partially closed** (EXP-003) |

`growth/baseline.md` updated in this run.

## Backlog impact

All shipped EXP IDs already marked `done` in backlog: EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031. No status changes required.

**Next priority unchanged:** EXP-008 (Journal → Beles internal links).

## Measurement watchlist (14–28d)

- GSC impressions/clicks on `/prickly-pear-parfum` and `/journal/what-does-fico-d-india-smell-like`
- Beles `restock_form_started` → `restock_form_submitted` rate post EXP-005
- Homepage Lighthouse scores after pin stabilization series

## Lock status

`growth/state.json` → `unlocked` (digest run; no code experiment)
