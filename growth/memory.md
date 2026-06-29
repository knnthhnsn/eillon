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

### Wins

- **EXP-004 shipped:** `/journal/what-does-fico-d-india-smell-like` — FAQ schema, smell-intent cluster, QGS 18.
- **EXP-005 shipped:** Beles `.shop__restock-trust` microcopy above waitlist form — one email, no charge, privacy; QGS 15.
- **First L2b auto-merge:** PR #44 squash-merged at `790ad6f` via `pr_growth_auto_merge` (0 block findings, CI green).
- **EXP-031 done:** 10 growth automations verified active in Cursor UI.
- **Sitemap:** 19 indexed URLs (was 17); prickly-pear + smell-intent journal live.
- **AI hard review protocol** live (`growth/ai-review.md`); replaces human review gate in growth loop.

### Lessons

- Vercel free-tier deploy quota can block prod from receiving pin fixes — temporary jsDelivr CDN pin on `index.html` (`@94b69cc`) until quota resets.
- Mobile GSAP scroll pins need `normalizeScroll` + ordered pin chain (house → maison) on iOS Safari; many iterative fixes in window.
- Lazy GSAP loading caused mobile jitter — eager/defer script tags restored (`0ab1ab9`).
- Baseline must track CDN workarounds and conversion-surface copy (trust blocks), not just routes.

### Next focus

- EXP-008 (journal → Beles internal links) — highest backlog priority.
- Monitor Beles restock form conversion 14d post EXP-005.
- Monitor GSC prickly-pear + smell-intent clusters 14–28d post EXP-003/004.
