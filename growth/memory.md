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

## Automation lessons (2026-06-29)

- L2b auto-merge shipped (EXP-005, PR #44); cap enforced via `npm run growth:auto-merge-cap` (EXP-039).
- Ledger QGS on main rows 1–6 were arithmetic mismatches — corrected when validate-ledger shipped (EXP-036).
- `growth:precheck` + `growth:ledger-insights` reduce duplicate parallel cursor branches (EXP-037/038).
- Fresh Cloud Agent envs need `npm ci` before build — `growth:qa` bootstraps deps (EXP-036).
- pr_growth_auto_merge: run auto-merge-cap check before merge; 1/3 used in rolling window as of 2026-06-29.

## OS ledger hygiene (2026-06-29)

- EXP-002b used invalid ledger status `pending_registration`; corrected to `blocked`. Registration state belongs in `automation-registry.md` only.
- `validate-ledger.mjs` now enforces status enum, loop_type, date format, and QGS arithmetic.
- `growth:qa` runs `npm ci` when GSAP vendor deps are missing (prevents false QA failures in fresh agent environments).
- Historical ledger rows EXP-001/002/003 had QGS values that did not match component scores; corrected during EXP-036 validation rollout.

## OS automation preflight (2026-06-29)

- `program.md` and autonomy-policy require exit when lock held or ≥3 open growth PRs, but `check-state.mjs` only validated JSON until EXP-037.
- `npm run growth:precheck` wraps `check-state.mjs --for-automation` for scheduled agents; experiment prompts updated to call it at run start.

## OS duplicate branch pattern (2026-06-29)

- Remote shows multiple parallel `cursor/*` branches for the same experiments (e.g. conversion-trust, social-campaign, beles-restock) — agents skipped preflight on prompts 03–05.
- EXP-038: `npm run growth:ledger-insights` summarizes rework/blocked rows; weekly social, conversion-trust, and brand-system prompts now call `growth:precheck` at run start.

## Human decisions (2026-06-28)

- Autonomy default L1–L2; no auto-merge.
- Favicon switched to `images/favicon.jpeg` (ensure committed for prod).
