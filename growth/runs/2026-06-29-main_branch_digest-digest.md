# Main Branch Digest — 2026-06-29

**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Branch analyzed:** `main` @ `32a9790`  
**Commit count:** 61

## Summary

Main shipped a major homepage visual/performance iteration (WebGL shaders, GSAP scroll pins, name marquee, Beautiful Letters), Phase 2–4 infra (CI, analytics funnel, auto-sitemap, trust/legal fixes), and the **growth OS + EXP-003 prickly-pear discovery landing** in a single capstone commit (`32a9790`). EXP-004 (Fico d'India smell journal) is **not on main** — it lives on open `growth/*` branches pending merge.

## Shipped experiments (main)

| EXP ID | Status on main | Commit / evidence |
|---|---|---|
| EXP-001 | done | `32a9790` — `growth/baseline.md`, program, scorecard |
| EXP-002 | done | `32a9790` — rules, automation prompts, QA scripts, autonomy policy |
| EXP-003 | done | `32a9790` — `/prickly-pear-parfum`, sitemap entry |
| EXP-004 | **not merged** | Open on `growth/search_to_restock-exp-004-*` branches |
| EXP-031 | **pending** | Automation registration not in main growth OS commit |

## Commits by category

### Growth (3 commits, 1 capstone)

| Commit | Date | Summary |
|---|---|---|
| `32a9790` | 2026-06-29 | Growth OS scaffold (EXP-001/002), EXP-003 `/prickly-pear-parfum`, favicon.jpeg site-wide, `content/campaigns/` scaffold, growth scripts |
| `d3943a4` | 2026-06-28 | Sitemap refresh (editorial routes) |
| `b3619e2` | 2026-06-25 | Phase 4 demand-sprint CI, lifecycle copy sweep, Ballpark study kit |

### Performance (~22 commits, Jun 27–28 cluster)

| Commit | Date | Summary |
|---|---|---|
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel / scroll-pin jitter; defer letters bundle for Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders — immediate content paint |
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee (Lighthouse) |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI (Vercel build fix) |
| `d1cd430` | 2026-06-24 | Display-sized WebP + `<picture>` for editorial images |
| `19aa0eb` | 2026-06-27 | GSC coverage, mobile editorial UX, Lighthouse pass |
| `6e04d95` | 2026-06-25 | Performance fixes bundled with Phase 3 |

**Theme:** Homepage GSAP ScrollTrigger pins stabilized after ~15 iterative fixes (hero, Maison, House of Memory). WebGL section shaders added then scoped. Name marquee moved from JS orbit to CSS time-based loop. Letters bundle deferred for LCP.

### Content (~12 commits)

| Commit | Date | Summary |
|---|---|---|
| `32a9790` | 2026-06-29 | Prickly-pear SEO landing (EXP-003) |
| `13c83de` | 2026-06-28 | Beautiful Letters — sky archive, wax seals |
| `ce1a452` | 2026-06-27 | Wear page close-skin imagery; House of Memory backdrop |
| `4141493` | 2026-06-27 | Journal water-tone refinement |
| `291538f` | 2026-06-25 | CVR 43933485 publish; studio authorship; Beles accord images |
| `b17f343` | 2026-06-25 | P0 trust/legal — lifecycle labels, Asmara geography, shipping schema, privacy, imprint |
| `6fb50cf` | 2026-06-23 | Editorial site styles; inner-page heroes; footer logo refresh |

### Infra (~5 commits)

| Commit | Date | Summary |
|---|---|---|
| `baae843` | 2026-06-25 | Phase 2 — analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | 2026-06-25 | Phase 3 — proof layer, consent recording, auto-generated sitemap |
| `b3619e2` | 2026-06-25 | Phase 4 — demand-sprint CI, Ballpark study launch kit |
| `3b28f7f` | 2026-06-27 | WebGL shader infrastructure (site-wide bands) |
| `afda8eb` | 2026-06-27 | Mobile horizontal bleed fix (editorial pages) |

## Architecture changes (baseline updated)

| Change | Detail |
|---|---|
| New route | `/prickly-pear-parfum` — FAQ schema, Beles CTA (EXP-003) |
| Sitemap | 18 public URLs (was 17) |
| Favicon | `images/favicon.jpeg` committed and wired site-wide |
| Growth OS | `/growth/*` persistent experiment loop on main |
| Campaign scaffold | `content/campaigns/.gitkeep` |
| CI | `.github/workflows/ci.yml` — build, verify, smoke, lighthouse |
| API | Rate limits on waitlist endpoints (Phase 2) |
| Analytics | Funnel events in `scripts/analytics.js` (unchanged event names vs baseline table) |

**Not on main:** `/journal/what-does-fico-d-india-smell-like` (EXP-004).

## Backlog adjustments

On **main**, backlog already correct:

- EXP-001, EXP-002, EXP-003 → `done`
- EXP-004 → `next` (highest priority eligible)
- EXP-031 → `pending` (automation UI registration)

No status changes required for main-shipped IDs beyond confirming EXP-003 closure.

## Durable learnings → memory.md

- GSAP pin init order matters — measure scroll positions after layout settles.
- Defer heavy bundles (letters, wax-seal Python) for Lighthouse; eager GSAP for mobile pins.
- Baseline drift: always cross-check sitemap URL count vs route table after SEO ships.
- Growth OS on main enables scheduled automations; EXP-031 registration still human-gated.

## Next focus (from main backlog)

1. **EXP-004** — Fico d'India smell journal (branch ready, merge pending)
2. **EXP-005** — Beles restock form trust microcopy
3. **EXP-008** — Journal → Beles internal links

## Run footer

- Lock: not acquired (read-only digest)
- Baseline: updated 2026-06-29
- Open growth PRs on main: 0
