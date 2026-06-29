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

**Window:** 61 commits on `main` (2026-06-22 → 2026-06-29).

### Wins

- **Growth OS live** (`32a9790`): `/growth/` brain, 7 Cursor rules, 11 automation prompts, DESIGN.md canonical, autonomy L2b policy.
- **EXP-003 shipped:** `/prickly-pear-parfum` discovery landing with FAQ schema, sitemap priority 0.82, journal cross-links.
- **EXP-031:** 10/11 automations verified active in Cursor UI; only `pr_growth_auto_merge` awaiting save.
- **Phase 2–4 infra:** analytics funnel (`scripts/analytics.js`), API rate limits, CI pipeline, consent recording, auto-generated sitemap.
- **Homepage perf:** critical CSS, lazy letters bundle, CSS marquee, deferred non-critical JS — Lighthouse gains without breaking GSAP pins.
- **Editorial motion:** WebGL section shaders site-wide; Beautiful Letters experience with wax seals; wear page close-skin imagery.

### Lessons

- GSAP scroll pins require eager script load — lazy GSAP caused mobile carousel jitter (fixed in `0ab1ab9`).
- Vercel CI must not invoke Python numpy steps — split wax-seal generation from `build:letters` (`ea60689`).
- Homepage motion is high-churn (40+ commits in 7d) — run `npm run ci` after pin/shader batches.
- Baseline had stale SEO gap for prickly-pear landing — digest corrected sitemap count (18 URLs) and route table.

### Shipped EXP IDs (confirmed on main)

EXP-001 · EXP-002 · EXP-003 · EXP-031 — all marked `done` in backlog.

### Next

EXP-004 (Fico d'India smell journal) is highest-priority eligible experiment.
