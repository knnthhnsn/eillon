# EILLON Growth Memory

**Durable facts only.** Append dated entries. No PII. No secrets.

## Brand truths (2026-06-28)

- EILLON = independent Copenhagen perfume maison; Afro-Mediterranean Memory Perfumery.
- Voice: quiet, sensory, precise, architectural, intimate, slow, confident.
- Current live chapter: **Beles · Fico d'India** (prickly pear, cactus water, pear skin, hibiscus, green leaves, soft musk, mineral air, warm stone).
- Oil-rich parfums; genderless; close-wearing; slowly unfolding.
- Funnel priority: Beles restock → The Letter → Copenhagen appointments → future purchase readiness.

## Product truths (2026-06-28)

- Beles waitlist active (`beles.html`, `data/products.js`).
- Asmara, Massawa, Ritual are chapter/waitlist surfaces (verify status in products.js before claims).
- No checkout on site; restock list + email are conversion endpoints.
- Appointments via `care@eillon.maison` mailto — no automated booking.

## Conversion truths (2026-06-28)

- Waitlist API: `POST /api/waitlist` with UTM fields.
- Newsletter uses same API with `product_slug=all`.
- Analytics: Vercel WA via `EILLON_ANALYTICS` in production.
- Homepage primary CTA: `/store`; restock CTAs point to `/beles#waitlist`.

## Customer language (2026-06-28)

- Demand clusters to target: prickly pear perfume, fico d'india, cactus water scent, skin scent, oil-rich parfum, niche perfume Copenhagen, sample-first buying.
- Objections to address: too sweet?, how close does it wear?, sample first?, genderless?, longevity claims (avoid guarantees).
- Source: `market-research/beles-demand-sprint.md`, backlog research tasks.

## Search demand (2026-06-28)

- Journal article `/journal/fico-d-india` exists — extend cluster.
- `/prickly-pear-parfum` discovery landing shipped (EXP-003, 2026-06-23).
- Sitemap 18 URLs; beles priority 0.9; prickly-pear-parfum 0.82.

## Social demand (2026-06-28)

- Pinterest/visual search loop undeveloped in repo (backlog EXP-009).
- Campaign kits not yet in `/content/campaigns/`.

## Technical architecture (2026-06-28)

- Static HTML/CSS/JS; Vercel deploy; Neon DB for waitlist.
- CI: build + verify + smoke + lighthouse.
- Growth OS added 2026-06-28 under `/growth/`.

## Analytics facts (2026-06-28)

- Events listed in `growth/baseline.md`.
- UTM sessionStorage key: `eillon_utm`.

## Previous wins (2026-06-28)

- EXP-001/002: Growth OS + rules + automation prompts scaffolded (score 15–16).
- Lighthouse perf work on homepage (lazy letters, CSS marquee, critical CSS) — commits through 0ab1ab9.
- Mobile pin jitter fix: eager GSAP load restored.

## Previous failures (2026-06-28)

- Lazy GSAP loading caused mobile scroll jitter (fixed by restoring defer script tags).
- Vercel build failed when Python numpy required in `build:letters` (fixed: split wax-seal script).

## Automation lessons (2026-06-28)

- Cannot mark Cursor Automations "active" without user registration in Automations editor.
- One experiment per run; max 3 open growth PRs.
- Agent-Reach / codebase-memory-mcp not configured in initial session.

## Human decisions (2026-06-28)

- Autonomy default L1–L2; no auto-merge.
- Favicon switched to `images/favicon.jpeg` (ensure committed for prod).

## Main branch digest (2026-06-29)

**Window:** 61 commits on main (2026-06-22 → 2026-06-29).

### Wins

- Growth OS + EXP-001/002/003 confirmed shipped (`32a9790`): persistent experiment layer, `/prickly-pear-parfum` discovery landing (FAQ schema, sitemap priority 0.82), favicon committed.
- Phase 2–4 infra on main: analytics funnel, API rate limits, CI pipeline, consent recording, auto sitemap generation, demand sprint verification.
- Editorial refresh + P0 trust/legal fixes (lifecycle labels, Asmara geography, shipping schema).
- Homepage motion stabilized after 20+ pin/marquee iteration commits; mobile scroll jitter resolved.
- Beautiful Letters experience shipped with sky archive + wax seals.
- WebGL shader bands extended site-wide (homepage, chapters, proof, shop).

### Lessons

- GSAP ScrollTrigger pins must initialize after layout settles with measured scroll positions; lazy GSAP load caused mobile jitter — eager script tags restored.
- Python/numpy wax-seal build step breaks Vercel CI — keep optional asset generation out of default `npm run build`.
- Homepage visual complexity (WebGL + GSAP pins + letters bundle) is an ongoing Lighthouse tradeoff — defer non-critical bundles.
- EXP-003 closes top prickly-pear SEO gap; monitor GSC indexing/impressions in 14–28d before next cluster page.

### Baseline sync

- Sitemap: 18 URLs (added `/prickly-pear-parfum`).
- Favicon committed; SEO gap for prickly pear closed.
- No new analytics events since Phase 2.
