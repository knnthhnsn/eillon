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
- `/journal/what-does-fico-d-india-smell-like` smell-intent article shipped (EXP-004, 2026-06-29).
- Sitemap 19 URLs.

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

**Window:** 74 commits on `origin/main` @ `c714cf6` (7 days).

### Shipped experiments

- **EXP-003** — `/prickly-pear-parfum` discovery landing with FAQ schema and Beles CTAs (`32a9790`).
- **EXP-004** — `/journal/what-does-fico-d-india-smell-like` smell-intent article (`9a40e0a`).
- **EXP-005** — Beles `#shopRestockTrust` microcopy above waitlist form; L2b auto-merge via PR #44 (`790ad6f`).
- **EXP-031** — 10 growth automations verified active in Cursor UI; L2b policy live (`f693e9c`, `f5679c9`).

### Wins

- Growth OS fully scaffolded: rules, prompts, registry, QA scripts, AI hard review gate.
- Sitemap expanded to **19 URLs** (was 17).
- First L2b conditional auto-merge succeeded (CI green, ai-review pass_with_notes, 0 blocks).

### Lessons

- Digest must use `git fetch origin main` — local `main` can lag by several merges.
- GSAP homepage pins: eager script load, ordered ScrollTrigger init, `normalizeScroll` for iOS Safari, chain Maison pin to house pin end.
- Defer `letters` bundle for Lighthouse; do not lazy-load GSAP before pin init.
- Vercel deploy quota can block prod updates; jsDelivr CDN pin (`knnthhnsn/eillon@94b69cc/scripts/home.js`) is valid interim hotfix.
- Monitor Beles `restock_form_started` → `submitted` 14d post EXP-005.

### Next priority

EXP-008 — internal links Journal → Beles → Restock.
