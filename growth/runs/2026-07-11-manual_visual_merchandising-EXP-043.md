# Run: EXP-043 - manual_visual_merchandising

**Date:** 2026-07-11
**Agent:** Codex
**Branch:** main (dirty shared workspace; scoped EXP-043 diff)
**Loop type:** brand_system
**Lock:** locked -> unlocked
## Hypothesis

If boutique visitors can see each chapter's scent world, transparent bottle, and full note pyramid on hover, then more high-intent visitors will continue to a chapter page because the collection becomes materially legible without lowering perceived value; deferring hover assets and removing duplicate shader execution should preserve or improve performance.

## Context read

- [x] AGENTS.md
- [x] DESIGN.md
- [x] growth/program.md
- [x] growth/autonomy-policy.md
- [x] growth/state.json
- [x] growth/backlog.md
- [x] growth/results.tsv
- [x] growth/scorecard.md
- [x] growth/qa-gates.md

## Changes

| File | Summary |
|---|---|
| `images/store/store-hero-atelier-*.webp` | Generated light architectural boutique backdrop in 960px and 1600px WebP variants. |
| `images/store/bottles/*.webp` | Optimized 360px and 720px alpha WebPs from the approved transparent chapter bottles. |
| `images/store/notes/**` | Fifty-four generated 224px alpha WebPs, one for every verified top, heart, and base note in `data/products.js`. |
| `scripts/shared-interactions.js` | Builds each hover scene from the existing accord collage, approved transparent bottle, and note cutouts; assets hydrate only near the viewport or on pointer/focus intent. |
| `styles.css` | Adds contained crossfades, independent note drift, keyboard focus support, touch fallbacks, and reduced-motion behavior. |
| `store.html`, `site.css` | Adds the responsive hero backdrop, corrects the mobile hero offset, and keeps the first viewport product-led. |
| `scripts/site-nav.js`, `store.html` | Removes duplicate `site-shaders.js` execution and leaves the below-fold shader on the existing idle loader. |
| `store.html` metadata | Corrects social copy from four to six chapters and adds missing Oliva to the six-item CollectionPage schema. |

## Generation

- Built-in image generation created one 16:9 architectural hero and six 3x3 chroma-key specimen boards.
- The boards used the exact 54-note order from `data/products.js`; local chroma removal and cropping produced individual alpha WebPs.
- The delivery set is 68 WebPs totaling 850.6 KiB. The mobile hero is 37.8 KiB and the desktop hero is 122.7 KiB.
- Generated note imagery is decorative (`aria-hidden`, empty alt) and does not create ingredient, stock, or formulation claims.

## Evidence

- Initial desktop load: 84 hover images remain deferred and zero hover images are requested before the collection approaches the viewport.
- All 54 data-driven note paths and 12 transparent bottle variants resolve to files.
- The duplicate shader trace changed from two `site-shaders.js` requests to one idle request.
- Local mobile TBT fell from 924-969 ms to 232 ms; requests fell from 34 to 33.
- Local store Lighthouse after the shader fix: performance 66, SEO 100, accessibility 96, CLS 0.00009. The local server does not compress the 274 KiB CSS payload, so live Vercel is the production comparison.
- Pre-change live store baseline: performance 64, LCP 4018 ms, TBT 934 ms, CLS 0, SEO 100, accessibility 96.

## QA

| Gate | Result |
|---|---|
| `npm.cmd run ci` | pass |
| `npm.cmd run growth:qa` | pass |
| `npm.cmd run test:visual` | pass - 26 desktop/mobile screenshots |
| `npm.cmd run verify:gsc` | pass - 23 canonical URLs |
| Store browser QA | pass - six desktop hovers, 390px touch layout, no horizontal overflow or site console errors |
| Asset mapping | pass - six products, 54 notes, zero missing files |
| `git diff --check` | pass |
| Secret scan | pass |
| AI hard review | `growth/runs/2026-07-11-manual_visual_merchandising-EXP-043-ai-review.md` |

## Scores

| Component | Score |
|---|---:|
| intent | 3 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 2 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 1 |
| **qualified_growth_score** | **13** |

## Decision

**Status:** keep

## Deployment boundary

Production deployment was explicitly requested by the user. Deployment will use the reviewed commit, and unrelated untracked campaign/source files remain outside the commit and Vercel payload.

**Lock:** locked -> unlocked
