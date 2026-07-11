# Run: EXP-042 - manual_release_hardening

**Date:** 2026-07-11
**Agent:** Codex
**Branch:** main (dirty shared workspace; scoped EXP-042 diff)
**Loop type:** technical_seo
**Lock:** locked -> unlocked

## Hypothesis

If we remove the oversized favicon request and delayed mobile hero font repaint, then mobile search visitors will reach stable homepage content faster; if we replace retired sitemap pings with verifiable crawl readiness and authenticated API submission, then Search Console operations remain actionable instead of silently calling dead endpoints.

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
| `images/favicon-64.png`, `images/apple-touch-icon-180.png` | Purpose-sized PNG icons replace the 2000px, 408 KB JPEG request. |
| Public HTML files | All 24 favicon references now use the 5 KB icon; the homepage uses the 180px Apple touch icon. |
| `index.html` | Mobile hero remains on the immediate Georgia fallback instead of repainting when deferred Cormorant finishes loading. Desktop typography is unchanged. |
| `scripts/gsc-sitemap.mjs` | Validates local/live robots and sitemap state, canonical HTTPS URLs, critical/private route inclusion, and lastmod values; optionally submits through the authenticated Search Console API. |
| `package.json` | Adds `verify:gsc`, `gsc:verify`, and `gsc:submit`; the local GSC gate now runs in `verify:all`. |

## Evidence

- Live pre-change Lighthouse: performance 81, LCP 3194 ms, FCP 1864 ms, TBT 287 ms, CLS 0.
- The live LCP trace attributed 2368 ms to text render delay; the mobile H1 repainted when the deferred Cormorant class arrived.
- Local transfer weight fell from 1,302,216 bytes to 898,789 bytes (31%); the 408,348-byte favicon request was replaced by a 5,001-byte icon.
- Final local Lighthouse CI: performance 71, LCP 3116 ms, TBT 654 ms, CLS 0. Local text compression differs from Vercel, so the live post-deploy run is the production comparison.
- Google documents the unauthenticated sitemap ping as retired; robots.txt discovery and the authenticated Search Console API are the supported paths.

## QA

| Gate | Result |
|---|---|
| `npm.cmd run growth:qa` | pass |
| `npm.cmd run ci` | pass |
| `npm.cmd run test:visual` | pass - 26 desktop/mobile screenshots |
| `npm.cmd run verify:gsc` | pass - 23 local canonical URLs |
| `npm.cmd run gsc:verify` | pass - live robots and sitemap discoverability |
| Browser QA | pass - homepage, store, and preorder; no overflow or console errors |
| Checkout state | pass - both local founder checkout actions enabled |
| `git diff --check` | run before commit |
| AI hard review | `growth/runs/2026-07-11-manual_release_hardening-EXP-042-ai-review.md` |

## Scores

| Component | Score |
|---|---:|
| intent | 2 |
| brand_fit | 3 |
| conversion | 2 |
| discoverability | 3 |
| measurement | 3 |
| technical | 3 |
| complexity_penalty | 1 |
| brand_risk_penalty | 0 |
| **qualified_growth_score** | **15** |

## Decision

**Status:** keep

## Deployment boundary

Production deployment was explicitly requested by the user. The release is deployed from a clean worktree created from the reviewed commit so unrelated working files cannot enter the Vercel payload.

**Lock:** locked -> unlocked
