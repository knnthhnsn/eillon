# Main Branch Digest

**Date:** 2026-06-29  
**Automation:** `main_branch_digest`  
**Window:** 2026-06-22 → 2026-06-29 (7 days)  
**Base:** `origin/main` @ `c714cf6`

## Summary

**72 commits** on `main` in the window. Heavy homepage scroll-pin and shader iteration (Jun 27–29); growth OS scaffold and **EXP-003–005** shipped Jun 29; first **L2b conditional auto-merge** (PR #44, EXP-005).

## Growth (OS + experiments)

| Commit | EXP / theme |
|---|---|
| `32a9790` | Growth OS scaffold (`/growth/*`), Cursor rules, **EXP-003** prickly-pear discovery landing, favicon |
| `a6c33f0` | AI hard review protocol; automation registry sync |
| `2d91bbe` | Document save order for remaining automations |
| `f693e9c` | MCP setup, conditional auto-merge (L2b) policy wiring |
| `f5679c9` | Reddit login, auto-merge completion, Agent-Reach sync |
| `9a40e0a` | **EXP-004** — journal “What does Fico d'India smell like?” |
| `790ad6f` | **EXP-005** — Beles restock trust microcopy (PR #44) |
| `9c91e6f` | Auto-merge run ledger for EXP-005 |

**Shipped experiment IDs:** EXP-001, EXP-002, EXP-003, EXP-004, EXP-005, EXP-031 (registry already `done` in backlog).

## Content (SEO + conversion copy)

| Commit | Notes |
|---|---|
| `32a9790` | `/prickly-pear-parfum` — FAQ schema, Beles/journal internal links |
| `9a40e0a` | `/journal/what-does-fico-d-india-smell-like` — smell-intent cluster |
| `790ad6f` | Beles `#waitlist` trust block — one email, no charge, size-as-interest |
| `6fb50cf` | Editorial inner-page style refresh, footer logo, heroes |
| `ce1a452` | Wear page close-skin imagery; House of Memory backdrop |
| `291538f` | CVR 43933485 publish; Beles accord profile images |
| `b3619e2` | Phase 4 demand sprint CI, lifecycle copy, Ballpark kit |
| `b17f343` | P0 trust/legal — chapter labels, Asmara geography, shipping schema |

**Sitemap:** 19 public URLs (was 17 in baseline snapshot).

## Perf (Lighthouse + scroll UX)

| Commit | Notes |
|---|---|
| `5547413` | Critical CSS, lazy bundles, CSS marquee |
| `a6b3dea` | Remove homepage page loaders |
| `0ab1ab9` | Mobile carousel jitter fix; defer letters bundle |
| `d1cd430` | WebP `picture` variants for editorial weight |
| `19aa0eb` | GSC coverage, mobile editorial UX, Lighthouse |
| `0e92d94` | GSAP `normalizeScroll` for mobile pin jitter |
| `4c04c10` | iOS Safari scroll-pin stabilization |
| `de93013`–`94b69cc` | Mobile Maison pin chain anchored to House of Memory pin end |
| Jun 27 cluster | WebGL shader bands, leopard House of Memory, marquee/orbit tuning |

## Infra (CI, API, deploy)

| Commit | Notes |
|---|---|
| `ea60689` | Skip Python wax-seal step in CI (Vercel build fix) |
| `baae843` | Analytics funnel, API rate limits, CI pipeline, security headers |
| `6e04d95` | Proof layer, consent recording, auto-generated sitemap |
| `f693e9c` | Conditional auto-merge + MCP automation tooling |
| `c714cf6` | **Temporary:** load home scroll-pin script from jsDelivr (Vercel deploy quota) |

## Baseline drift fixed

Updated `growth/baseline.md`: new routes, sitemap count, SEO gap list, journal inventory, Beles trust microcopy note.

## Backlog

No status changes — EXP-001–005 and EXP-031 already marked `done`.

## Next focus (from backlog)

EXP-008 internal linking · EXP-007 newsletter analytics · EXP-010 Copenhagen appointment

## Lock

`lock_status: unlocked` — digest run only; no code experiment.
