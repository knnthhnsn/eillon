# Run: main_branch_digest · digest

**Date:** 2026-06-29  
**Agent:** Cursor Cloud Agent (automation_id: `main_branch_digest`)  
**Branch:** main  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Commits:** 61

## Summary

Main shipped substantial homepage motion/visual work, Phase 2–4 infra (analytics, CI, sitemap), editorial refresh, and the growth OS plus EXP-003 prickly-pear discovery landing. No new conversion analytics events beyond Phase 2 baseline. Baseline updated for `/prickly-pear-parfum` route and sitemap count.

## Shipped by category

### Growth (2 commits)

| Commit | Date | Summary |
|---|---|---|
| `32a9790` | 2026-06-29 | **Growth OS scaffold** (EXP-001/002): `/growth/*`, Cursor rules, automation prompts, QA scripts, autonomy policy, DESIGN.md, AGENTS.md. **EXP-003:** `/prickly-pear-parfum` discovery landing with FAQ schema, journal internal links, sitemap entry (priority 0.82). Site-wide `favicon.jpeg`. |
| `b3619e2` | 2026-06-25 | Phase 4 demand sprint CI, lifecycle copy sweep, Ballpark study launch kit (`market-research/`). |

**Experiment IDs resolved:** EXP-001 (done), EXP-002 (done), EXP-003 (done, shipped in `32a9790`).

### Perf (12 commits)

| Commit | Date | Summary |
|---|---|---|
| `d1cd430` | 2026-06-24 | Display-sized WebP variants + `<picture>` elements for editorial images. |
| `19aa0eb` | 2026-06-27 | GSC coverage, mobile editorial UX, Lighthouse improvements. |
| `afda8eb` | 2026-06-27 | Fix mobile horizontal bleed on homepage and editorial pages. |
| `d3943a4` | 2026-06-28 | Smooth mobile Maison scroll, orbit clipping fix, sitemap refresh. |
| `5547413` | 2026-06-28 | Critical CSS, lazy bundles, CSS marquee for Lighthouse. |
| `a6b3dea` | 2026-06-28 | Remove homepage page loaders — content visible immediately. |
| `0ab1ab9` | 2026-06-28 | Fix mobile carousel/scroll-pin jitter; defer letters bundle for Lighthouse. |
| `ea60689` | 2026-06-28 | Skip Python wax-seal step in CI (Vercel build fix). |
| `6e04d95` | 2026-06-25 | Phase 3 performance fixes (partial — also infra). |
| `fddb56b` | 2026-06-27 | Fix subpage cream gap (`main` flex-grow). |
| `a4029dd` | 2026-06-27 | Remove subpage footer gap. |
| `3838a29` | 2026-06-28 | Fix desktop scroll jitter in Maison and House of Memory pins. |

**Scroll/pin stabilization cluster (2026-06-27 → 2026-06-28):** 20+ commits tuning GSAP ScrollTrigger pins, marquee loop seams, hero horizontal track, and mobile scroll-through — grouped under perf/UX; primary outcome is stable mobile scroll without jitter.

### Content (35 commits)

| Commit | Date | Summary |
|---|---|---|
| `6fb50cf` | 2026-06-23 | Editorial site styles; refresh inner pages (footer logo, heroes, galleries). |
| `b17f343` | 2026-06-25 | P0 trust/legal: chapter lifecycle labels, Asmara geography, shipping schema, privacy, imprint. |
| `291538f` | 2026-06-25 | CVR 43933485 published; studio authorship roles; Beles accord profile images optimized. |
| `ce1a452` | 2026-06-27 | Wear page close-skin imagery; House of Memory backdrop update. |
| `13c83de` | 2026-06-28 | Beautiful Letters experience — sky archive backdrop, branded wax seals. |
| `4141493` | 2026-06-27 | Journal water tones; name shader visibility fix. |
| `3b28f7f` → `8106b72` | 2026-06-27 | WebGL shader bands across homepage, chapters, proof, shop UI (15 commits). |
| `959f669` → `7b4e21b` | 2026-06-27 | House of Memory visual/headline iteration — leopard background, principles layout, headline line breaks (14 commits). |
| `7f8014c`, `6f94513`, `d8ed434` | 2026-06-27–28 | Name section infinite EILLON/logo carousel refinements. |
| `3a18cad`, `c7ddcfd`, `bab1e09`, `04e02fa`, `04fbafc`, `82e4314` | 2026-06-27–28 | Hero horizontal intro track, marquee orbit centering, mobile Maison pin-scroll. |
| `e5ad344`, `6050039`, `020acf7`, `e971673`, `5faf84e`, `a2895d9`, `5f0344d` | 2026-06-28 | Scroll lock/pin behavior tuning for hero and House of Memory sections. |
| `bde6f0e` | 2026-06-28 | Marquee loop seam fix (time-based position, exact width). |
| `54ea49f`, `03d7fed` | 2026-06-27 | Chapter composition shaders and architecture sections. |

### Infra (4 commits)

| Commit | Date | Summary |
|---|---|---|
| `baae843` | 2026-06-25 | Phase 2: analytics funnel (`scripts/analytics.js`), API rate limits, CI pipeline, security headers. |
| `6e04d95` | 2026-06-25 | Phase 3: proof layer, consent recording, auto-generated sitemap (`scripts/generate-sitemap.mjs`), performance fixes. |
| `b3619e2` | 2026-06-25 | Phase 4: demand sprint CI, lifecycle copy verification scripts. |
| `ea60689` | 2026-06-28 | CI: skip Python wax-seal generation on Vercel (also perf). |

## Architecture changes (baseline impact)

| Area | Change | Baseline action |
|---|---|---|
| Routes | New `/prickly-pear-parfum` (EXP-003) | **Updated** — added to site map |
| Sitemap | 17 → 18 URLs; auto-generated via `generate-sitemap.mjs` | **Updated** |
| Analytics | No new events since Phase 2 | No change |
| API | Rate limits from Phase 2 (already on main) | No change |
| Favicon | `images/favicon.jpeg` committed site-wide | **Updated** |
| Growth OS | `/growth/*` persistent experiment layer | Noted in baseline |

## Backlog status check

| ID | Status before | Status after | Notes |
|---|---|---|---|
| EXP-001 | done | done | Baseline + OS — confirmed shipped `32a9790` |
| EXP-002 | done | done | Rules + automation scaffold — confirmed shipped `32a9790` |
| EXP-003 | done | done | Prickly pear landing — confirmed shipped `32a9790` |
| EXP-004 | next | next | No ship in window |

## Durable learnings (→ memory.md)

1. **GSAP pin init order matters** — initialize pins after layout settles with measured scroll positions; lazy GSAP load caused mobile jitter (fixed by eager restore).
2. **CI build deps** — Python/numpy wax-seal script breaks Vercel; split optional asset generation from `npm run build`.
3. **Discovery landing pattern works** — EXP-003 `/prickly-pear-parfum` closes top SEO gap; monitor GSC in 14–28d.
4. **Homepage complexity risk** — WebGL shaders + GSAP pins + letters bundle = ongoing Lighthouse/motion tradeoff; defer non-critical bundles.

## QA

| Gate | Result |
|---|---|
| git log window | 61 commits |
| baseline drift | fixed (prickly-pear route, sitemap count, favicon, SEO gap) |
| backlog sync | no changes needed (EXP-001–003 already done) |

## Decision

**keep** — digest complete; baseline and memory updated.
