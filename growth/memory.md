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

## Paid preorder architecture (2026-07-10)

- The codebase now contains a Beles-only hosted Stripe Checkout path at `/beles/preorder`; it is not a general cart.
- The 2026-06-28 "no checkout" fact remains true for production until this work is deployed and `ENABLE_PAID_PREORDERS=true` with complete Stripe, webhook, site-origin, and Neon configuration.
- Founder offers are a €28 2 ml sample preorder and a €30 refundable bottle reservation deposit. No full-bottle balance is collected on this page.
- Signed Stripe webhooks, not the browser success page, create the Neon preorder record and drive paid-completion analytics.
- The generated sitemap now contains 23 routes, including the indexable founder file; success and admin views remain `noindex`.

## Product image construction truth (2026-07-10)

- The current catalog in `data/products.js` contains six products: Beles, Oliva, Asmara, Massawa, Petricor, and Ritual.
- The clear flacon body is a true cube: physical width, depth, and glass-body height are equal. Angled imagery must show substantial side depth, never a narrow slab.
- The grey concentration strip is one continuous belt around all four vertical faces at one aligned height and thickness; it must visibly cross each exposed corner.
- Approved `-final` source files currently exist for Asmara, Massawa, Petricor, and Ritual. Beles and Oliva use their current approved sources.
- For new angled renders, use `images/campaigns/cubic-flacon-2026-07/masters/angles/beles-cube-wraparound-master.png` as the construction reference and reject any shallow-side or front-only-band draft.
- Social publishing remains human-led; generated campaign imagery is an editorial asset, not evidence of stock or manufacturing tolerances.
- The neutral stone/catalogue direction in EXP-040 was rejected for new editorial and social use. The accepted replacement language is optical tension, architectural scale, asymmetric movement, controlled chromatic refraction, and dark negative space; use `content/campaigns/luxury-motion-visual-system.md` for selection.
