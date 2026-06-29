# Main Branch Digest — 2026-06-29

**Automation:** `main_branch_digest`  
**Window:** 7 days (`--since="7 days ago"`)  
**Branch:** `origin/main` @ `c714cf6`  
**Commits:** 74  
**Prior digest:** 2026-06-29 12:30 UTC @ `c714cf6` (same HEAD; incremental since 12:00: `94b69cc`, `c714cf6`)

---

## Summary

Main shipped substantial **growth OS scaffolding**, three **SEO/conversion experiments** (EXP-003/004/005), and a large **homepage performance + GSAP pin stabilization** cycle. First **L2b conditional auto-merge** landed (EXP-005, PR #44). Latest hotfix loads `scripts/home.js` from jsDelivr while Vercel deploy quota resets.

---

## Growth (8 commits)

| Commit | Summary | EXP |
|---|---|---|
| `32a9790` | Growth OS scaffold, `/prickly-pear-parfum` discovery landing, favicon | EXP-001/002/003 |
| `a6c33f0` | AI hard review protocol + automation registry sync | OS |
| `2d91bbe` | Document save order for remaining automations | EXP-031 |
| `f693e9c` | MCP setup, conditional auto-merge policy | EXP-031 |
| `f5679c9` | Reddit login, auto-merge, Agent-Reach sync | EXP-031 |
| `9a40e0a` | Journal: *What does Fico d'India smell like?* + FAQ schema | EXP-004 |
| `790ad6f` | Beles restock trust microcopy (`#shopRestockTrust`) | EXP-005 |
| `9c91e6f` | Auto-merge run ledger for EXP-005 | EXP-005 |

**Shipped experiment IDs (confirmed on main):** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 — all marked `done` in backlog.

**Next eligible (highest priority):** EXP-008 — Journal → Beles internal links.

---

## Content (22+ commits)

| Area | Key commits | Notes |
|---|---|---|
| Discovery SEO | `32a9790` | `/prickly-pear-parfum` with FAQ schema, Beles CTAs |
| Smell-intent journal | `9a40e0a` | `/journal/what-does-fico-d-india-smell-like` |
| Trust / legal | `b17f343` | Chapter lifecycle labels, Asmara geography, shipping schema, privacy, imprint |
| Editorial refresh | `6fb50cf`, `d1cd430`, `291538f` | Inner-page heroes, WebP variants, CVR publish, Beles accord images |
| Lifecycle copy | `b3619e2` | Phase 4 demand sprint CI + copy sweep |
| Wear imagery | `ce1a452` | Close-skin shots |
| Letters experience | `13c83de` | Sky archive backdrop, wax seals |
| Homepage narrative | `959f669`–`c0dd254` (14 commits) | House of Memory leopard backdrop, headline layout iterations |
| Visual shaders | `ee372e6`–`8106b72` (15 commits) | WebGL shader bands homepage + inner pages |
| Name carousel | `7b8014c`, `6f94513`, `d8ed434` | Infinite EILLON/logo marquee |

**Sitemap:** 19 public URLs (was 17 in baseline capture).

---

## Perf (35+ commits)

| Theme | Key commits | Notes |
|---|---|---|
| Lighthouse baseline | `5547413`, `a6b3dea`, `0ab1ab9` | Critical CSS, remove page loaders, defer letters bundle |
| Build fix | `ea60689` | Skip Python wax-seal step in CI (numpy blocker) |
| Mobile editorial | `19aa0eb`, `afda8eb`, `d3943a4` | GSC coverage, horizontal bleed fix, sitemap refresh |
| GSAP scroll pins | `e971673`–`c714cf6` (20 commits) | Ordered init, normalizeScroll, iOS Safari, Maison pin chain |
| Phase 3 perf | `6e04d95` | Auto-generated sitemap, performance fixes |

**Current hotfix:** `c714cf6` — `index.html` loads `scripts/home.js` from jsDelivr (`@94b69cc`) until Vercel deploy quota resets.

---

## Infra (6 commits)

| Commit | Summary |
|---|---|
| `baae843` | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Phase 3: proof layer, consent recording, sitemap automation |
| `b3619e2` | Phase 4: demand sprint CI, Ballpark study kit |
| `f693e9c` | Growth MCP + L2b auto-merge policy in repo |
| `a6c33f0` | AI hard review gate (`growth/ai-review.md`) |
| `c714cf6` | jsDelivr CDN pin for homepage scroll script |

---

## Baseline drift (action taken)

| Item | Before | After |
|---|---|---|
| Routes | 17 indexed pages | +`/prickly-pear-parfum`, +`/journal/what-does-fico-d-india-smell-like` |
| Sitemap count | 17 URLs | 19 URLs |
| Beles conversion | Form only | Trust microcopy block above `#waitlist` |
| SEO gaps | No prickly-pear landing | Landing + smell-intent article shipped |
| Homepage JS | Local `scripts/home.js` | jsDelivr CDN pin (temporary) |
| Analytics/API | Unchanged event set | No new events this window |

→ Updated `/growth/baseline.md`.

---

## Backlog adjustments

No status changes required — EXP-001 through EXP-005 and EXP-031 already `done`.

---

## Durable learnings → memory.md

1. Always digest from `origin/main`, not stale local `main`.
2. GSAP mobile pins need eager load + ordered init + `normalizeScroll` for iOS Safari.
3. L2b auto-merge works when CI green + ai-review pass + zero blocks (PR #44).
4. Vercel deploy quota can block prod; jsDelivr CDN pin is valid interim hotfix.
5. Monitor Beles `restock_form_started` → `submitted` ratio 14d post EXP-005.

---

## Lock / state

- `lock_status`: unlocked (read-only digest)
- No experiment scored this run
