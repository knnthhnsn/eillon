# Run: main_branch_digest · digest

**Date:** 2026-06-29  
**Agent:** Cloud Agent (main_branch_digest)  
**Branch audited:** `main` @ `32a9790`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Commits:** 60

## Summary

Main received substantial homepage motion/perf work, Phase 2–4 infra (CI, analytics, sitemap, trust/legal), and a growth OS bundle (EXP-001/002/003) including `/prickly-pear-parfum`. EXP-004 smell-intent journal article and EXP-031 automation registration are **not on main** as of this digest.

## Commits by category

### Growth (3 commits / 1 bundle)

| Commit | Date | Summary |
|---|---|---|
| `32a9790` | 2026-06-29 | **EXP-001/002:** Full `/growth` OS, Cursor rules, automation prompts, QA scripts, autonomy policy, AGENTS.md, DESIGN.md. **EXP-003:** `/prickly-pear-parfum` discovery landing, sitemap + site-nav search entry, journal internal links. Site-wide `favicon.jpeg`. `content/campaigns/.gitkeep` scaffold. |

**Shipped EXP IDs on main:** EXP-001, EXP-002, EXP-003

### Performance (12 commits)

| Commit | Date | Summary |
|---|---|---|
| `d1cd430` | 2026-06-24 | WebP `picture` variants for editorial images — Lighthouse weight reduction |
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee — homepage Lighthouse |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders — faster first paint |
| `0ab1ab9` | 2026-06-28 | Defer letters bundle; fix mobile carousel / scroll-pin jitter |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI — Vercel build fix |
| `19aa0eb` | 2026-06-27 | GSC coverage, mobile editorial UX, Lighthouse perf |
| `d3943a4` | 2026-06-28 | Smooth mobile Maison scroll, orbit clipping, sitemap refresh |
| `3838a29`–`6050039` | 2026-06-28 | GSAP ScrollTrigger pin order, jitter, hero scroll-lock removal (8 commits) |

### Content / brand (40 commits)

| Theme | Commits | Highlights |
|---|---|---|
| Editorial refresh | `6fb50cf` | Site styles, inner-page heroes, footer logo, gallery fixes |
| Trust & legal | `b17f343` | Chapter lifecycle labels, Asmara geography, shipping schema, privacy, imprint |
| Proof & lifecycle | `6e04d95`, `291538f`, `b3619e2` | Proof layer, consent recording, CVR 43933485, studio authorship, Ballpark study kit, lifecycle copy sweep |
| WebGL shaders | `ee372e6`–`4141493` | Per-section moving shaders homepage + inner pages; journal water tones |
| House of Memory | `959f669`–`7b4e21b` | Leopard background, headline layout iterations, principles reposition |
| Name section | `7b8014c`–`d8ed434` | Infinite EILLON/logo carousel → CSS marquee refinement |
| Beautiful Letters | `13c83de` | Sky archive backdrop, branded wax seals |
| Wear imagery | `ce1a452` | Close-skin shots; House of Memory backdrop update |
| Mobile UX | `afda8eb`, `82e4314` | Horizontal bleed fix; Maison pin-scroll restore |

### Infra (5 commits)

| Commit | Date | Summary |
|---|---|---|
| `baae843` | 2026-06-25 | Phase 2: analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | 2026-06-25 | Phase 3: proof layer, consent recording, auto-generated sitemap, perf fixes |
| `b3619e2` | 2026-06-25 | Phase 4: demand sprint CI, Ballpark study launch kit |
| `ea60689` | 2026-06-28 | CI: skip Python wax-seal in Vercel build |
| `32a9790` | 2026-06-29 | Growth QA scripts (`npm run growth:*`), automation registry |

**Routes added on main:** `/prickly-pear-parfum`  
**Routes not on main (branch-only):** `/journal/what-does-fico-d-india-smell-like` (EXP-004 pending merge)

## Baseline drift fixed

- Sitemap: 17 → **18 URLs** (added prickly-pear landing)
- Site map table: added `/prickly-pear-parfum`
- SEO gaps: prickly-pear cluster partially addressed; smell-intent journal still open (EXP-004)
- Favicon: `images/favicon.jpeg` committed and linked site-wide

## Backlog adjustments

| EXP | Action | Reason |
|---|---|---|
| EXP-001 | `done` (unchanged) | Shipped in `32a9790` |
| EXP-002 | `done` (unchanged) | Shipped in `32a9790` |
| EXP-003 | `done` (unchanged) | Shipped in `32a9790` |
| EXP-004 | **`next`** | Not on main — reverted premature `done` on working branch |
| EXP-005 | **`backlog`** | Not promoted until EXP-004 merges |
| EXP-031 | **`pending`** | Automation registration not in main commit history |

## Durable learnings (→ memory.md)

- Growth OS is live on main; automations still require Cursor UI registration (EXP-031).
- Prickly-pear discovery path shipped; smell-intent journal is next highest SEO priority.
- Homepage GSAP pins remain fragile — lazy/deferred script loading caused mobile jitter; eager load restored.
- CI wax-seal Python step must stay optional for Vercel builds.
- Phase 2–4 infra (rate limits, consent, auto-sitemap, demand sprint CI) landed before growth OS bundle.

## Decision

**Status:** keep (digest complete)  
**Next experiment on main:** EXP-004
