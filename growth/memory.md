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

- Autonomy default L1–L2; L2b conditional auto-merge enabled for eligible `growth/*` PRs (2026-06-29).
- Favicon switched to `images/favicon.jpeg` (committed 2026-06-29).

## Shipped on main (2026-06-29 digest)

- **EXP-003** `/prickly-pear-parfum` — prickly-pear discovery landing with FAQ schema and journal links.
- **EXP-004** `/journal/what-does-fico-d-india-smell-like` — smell-intent article; sitemap now 19 URLs.
- **EXP-005** Beles `.shop__restock-trust` microcopy above waitlist (one email, no charge, privacy); auto-merged PR #44 via L2b.
- **EXP-031** Ten growth automations verified in Cursor UI; `pr_growth_auto_merge` active.
- **Growth OS** complete: AI hard review gate, automation prompts, QA/score scripts, autonomy policy v1.1.

## Performance lessons (2026-06-29)

- Homepage GSAP ScrollTrigger pins require eager script load — lazy GSAP caused mobile jitter (fixed).
- iOS Safari needs `normalizeScroll` and careful pin chaining (Maison → House of Memory); multiple follow-up commits on main.
- Vercel deploy quota workaround: home scroll pin script temporarily loaded from jsDelivr (`c714cf6`).
- CI: Python wax-seal step split from main build to fix Vercel failures.

## Automation wins (2026-06-29)

- First L2b auto-merge succeeded (EXP-005, 0 block findings, CI green).
- Agent-Reach: Reddit authenticated as eillonofficial; 8/15 channels active per state.json.
- Codebase memory indexed (~10k nodes) for faster agent context.
