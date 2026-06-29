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

## Shipped on main (2026-06-29 digest)

### Wins
- **EXP-003:** `/prickly-pear-parfum` discovery landing live with FAQ schema and Beles internal links.
- **EXP-004:** `/journal/what-does-fico-d-india-smell-like` smell-intent article shipped; sitemap 19 URLs.
- **EXP-005:** Beles `#shopRestockTrust` microcopy (one email, no charge, privacy) merged via PR #44 — first L2b auto-merge at `790ad6f`.
- **EXP-031:** 10 growth automations verified in Cursor UI; Agent-Reach Reddit authenticated.
- Growth OS fully scaffolded: rules, prompts, QA scripts, AI hard review protocol, conditional auto-merge (L2b).

### Lessons
- GSAP mobile pin jitter requires `normalizeScroll` + excluding CSS fallback overrides on sticky stages (commits `0e92d94`–`a5d83e3`).
- L2b auto-merge criteria validated: growth/* branch, CI green, ai-review pass_with_notes, 0 block findings.
- Python wax-seal build step must stay split from CI (`ea60689`) — numpy unavailable on Vercel.
- Homepage WebGL shaders + ScrollTrigger pins remain perf/motion risk — monitor Lighthouse and iOS Safari.

### Architecture updates
- New routes: `/prickly-pear-parfum`, `/journal/what-does-fico-d-india-smell-like`.
- Beles conversion path includes trust microcopy block before submit.
- API hardened: rate limits, consent recording (Phase 2–3 infra).
- Analytics events unchanged — EXP-007 (newsletter distinct events) still backlog priority #2.

### Next focus
- EXP-008: Journal → Beles → Restock internal linking (backlog priority #1).
- Monitor GSC for prickly-pear and smell-intent clusters 14–28d post-ship.
- Track `restock_form_started` → `restock_form_submitted` on `/beles` for EXP-005 lift.
