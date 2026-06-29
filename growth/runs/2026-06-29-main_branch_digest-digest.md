# Main Branch Digest — 2026-06-29

**automation_id:** `main_branch_digest`  
**window:** 2026-06-22 → 2026-06-29 (7 days)  
**branch:** `main` @ `a5d83e3`  
**commits:** 71

## Summary

A dense week: growth OS shipped and automations registered; three SEO/conversion experiments merged (EXP-003, EXP-004, EXP-005); homepage editorial overhaul (WebGL shaders, GSAP scroll pins, Letters experience); CI/analytics/security infra hardened. First L2b conditional auto-merge (PR #44).

## By category

### Growth (12 commits)

| Commit | Date | Summary | EXP |
|---|---|---|---|
| `32a9790` | 2026-06-29 | Growth OS scaffold, Cursor rules, automation prompts, `/growth/*`, prickly pear landing, favicon | EXP-001, EXP-002, EXP-003 |
| `a6c33f0` | 2026-06-29 | AI hard review protocol + automation registry sync | EXP-002 |
| `2d91bbe` | 2026-06-29 | Document save order for remaining automations | EXP-031 |
| `f693e9c` | 2026-06-29 | MCP setup, conditional auto-merge policy (L2b) | EXP-002 |
| `f5679c9` | 2026-06-29 | Reddit login, Agent-Reach sync, auto-merge completion | EXP-031 |
| `9a40e0a` | 2026-06-29 | Journal: "What does Fico d'India smell like?" + FAQ schema | EXP-004 |
| `790ad6f` | 2026-06-29 | Beles restock form trust microcopy (#44) | EXP-005 |
| `9c91e6f` | 2026-06-29 | Log EXP-005 auto-merge ledger entry | EXP-005 |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark kit | — |
| `6e04d95` | 2026-06-25 | Proof layer, consent recording, auto-generated sitemap | — |
| `baae843` | 2026-06-25 | Analytics funnel, API rate limits, CI pipeline, security headers | — |
| `b17f343` | 2026-06-25 | P0 trust/legal: chapter lifecycle, Asmara geography, shipping schema | — |

**Shipped EXP IDs:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 (all already `done` in backlog).

### Content (8 commits)

| Commit | Date | Summary |
|---|---|---|
| `9a40e0a` | 2026-06-29 | `/journal/what-does-fico-d-india-smell-like` — smell-intent article |
| `32a9790` | 2026-06-29 | `/prickly-pear-parfum` discovery landing (EXP-003) |
| `291538f` | 2026-06-25 | CVR 43933485 publish, studio authorship roles, Beles accord images |
| `ce1a452` | 2026-06-27 | Wear page close-skin imagery refresh |
| `6fb50cf` | 2026-06-23 | Editorial site styles, inner-page heroes, gallery fixes |
| `19aa0eb` | 2026-06-27 | GSC coverage improvements, mobile editorial UX |
| `d3943a4` | 2026-06-28 | SEO sitemap refresh |
| `13c83de` | 2026-06-28 | Beautiful Letters experience (sky archive, wax seals) |

**New public routes:** `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like`  
**Journal count:** 4 articles + hub (was 3).

### Perf (12 commits)

| Commit | Date | Summary |
|---|---|---|
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee (Lighthouse) |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders |
| `0ab1ab9` | 2026-06-28 | Defer letters bundle; fix carousel/pin jitter |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI (numpy build fix) |
| `d1cd430` | 2026-06-24 | WebP picture elements, display-sized variants |
| `19aa0eb` | 2026-06-27 | Lighthouse performance pass |
| `0e92d94`–`a5d83e3` | 2026-06-29 | GSAP normalizeScroll + iOS Safari pin stabilization (4 commits) |
| `3838a29`–`e971673` | 2026-06-28 | Desktop/mobile scroll pin jitter fixes (6 commits) |
| `afda8eb` | 2026-06-27 | Mobile horizontal bleed fix |

**Theme:** Homepage GSAP ScrollTrigger pins remain the primary perf risk; iterative fixes through the week.

### Infra (6 commits + visual stack)

| Commit | Date | Summary |
|---|---|---|
| `baae843` | 2026-06-25 | CI pipeline, analytics funnel, API rate limits, security headers |
| `6e04d95` | 2026-06-25 | Auto-generated sitemap, consent recording, proof layer |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI |
| `ea60689` | 2026-06-28 | Vercel build fix (Python wax-seal split) |
| `f693e9c` | 2026-06-29 | MCP config example, L2b auto-merge policy |
| `32a9790` | 2026-06-29 | Full `/growth/` OS, `.cursor/rules/`, `npm run growth:*` scripts |

**Visual/editorial infra (39 commits, 2026-06-27–28):** WebGL shader bands, name carousel, House of Memory leopard backdrop, hero intro pin track — brand-facing, not growth-measured.

## Architecture changes (baseline delta)

| Area | Before (2026-06-28 baseline) | After (main @ a5d83e3) |
|---|---|---|
| Public routes | 17 sitemap URLs | **19** (+ prickly pear landing, smell-intent journal) |
| Beles conversion | Form only | Form + `#shopRestockTrust` trust microcopy block |
| Growth OS | Not in baseline | `/growth/*`, 10 automation prompts, L2b auto-merge |
| Sitemap | 17 URLs | 19 URLs via `scripts/generate-sitemap.mjs` |
| Analytics events | Unchanged | No new distinct events shipped (EXP-007 still backlog) |
| API | Waitlist endpoint | + rate limits, consent recording (Phase 2–3) |

## Backlog impact

No status changes required — EXP-001 through EXP-005 and EXP-031 already marked `done`.

**Next highest priority (unchanged):** EXP-008 (Journal → Beles internal links).

## Durable learnings

1. **L2b auto-merge works:** PR #44 merged at `790ad6f` with AI hard review pass_with_notes, 0 blocks, CI green.
2. **GSAP pins need iOS-specific handling:** `normalizeScroll` + excluding CSS fallback overrides fixed mobile Maison jitter.
3. **SEO cluster forming:** prickly pear landing + fico-d-india articles + smell-intent journal — monitor GSC 14–28d.
4. **10 automations registered** in Cursor UI (2026-06-29); `pr_growth_auto_merge` awaiting final save per registry.

## Actions taken this run

- [x] Digest written
- [x] `growth/baseline.md` updated (routes, sitemap count, SEO gaps, Beles trust block)
- [x] `growth/memory.md` appended (2026-06-29 section)
- [x] Backlog verified — no changes needed

## Footer

**lock_status:** unlocked (read-only run)  
**next digest window:** 2026-06-30 → 2026-07-06
