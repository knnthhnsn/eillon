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
- `/prickly-pear-parfum` discovery landing shipped on main (EXP-003, `32a9790`).
- `/journal/what-does-fico-d-india-smell-like` — EXP-004 pending merge (not on main as of 2026-06-29 digest).
- Sitemap **18 URLs** on main.

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

## Main branch digest (2026-06-29)

**Audited:** `main` @ `32a9790` · 60 commits in 7-day window

### Shipped on main

- **EXP-001/002:** Growth OS live (`/growth/*`, Cursor rules, automation prompts, `npm run growth:*`, autonomy policy).
- **EXP-003:** `/prickly-pear-parfum` discovery landing with FAQ schema, sitemap entry (18 URLs), site-nav search.
- **Favicon:** `images/favicon.jpeg` linked across public pages.
- **Infra (Phase 2–4):** CI pipeline, API rate limits, security headers, analytics funnel, auto-sitemap, consent recording, demand sprint CI.
- **Perf:** WebP picture elements, homepage critical CSS / lazy bundles, GSAP pin jitter fixes, CI wax-seal skip.

### Not on main (branch-only / pending merge)

- **EXP-004:** `/journal/what-does-fico-d-india-smell-like` — exists on working branch, not merged.
- **EXP-031:** Automation registration state — working branch ahead of main.

### Lessons

- GSAP ScrollTrigger pins break when scripts lazy-load — keep eager vendor load on homepage.
- Python wax-seal build step must stay optional for Vercel CI.
- Backlog must track **main** ship state, not unmerged branch work.

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
