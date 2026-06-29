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

## OS scope guard (2026-06-29)

- EXP-040: `growth/os-2026-06-29` initially included unrelated `sitemap.xml` lastmod drift from a rebase/build — reverted; OS improver prompt now lists allowed paths and requires `git diff origin/main --stat` before PR.

## OS backlog loop validation (2026-06-29)

- EXP-026 backlog row used invalid loop column `objection_to_trust` (loop id, not loop_type) — would fail ledger append; corrected to `conversion_copy` per loop-manifest.
- `npm run growth:validate-backlog` enforces backlog loop column against program.md allowlist; wired into `growth:qa` (EXP-041).
- `growth:next` skips backlog rows with invalid loop types instead of selecting them silently (EXP-043).

## OS precheck completion (2026-06-29)

- EXP-042: prompts 06 (PR review) and 08 (main digest) use `growth:lock-check` only; prompt 07 (CI repair) uses full `growth:precheck` because it may open a growth PR.

## OS duplicate experiment guard (2026-06-29)

- Remote had 20+ open `cursor/*` PRs duplicating EXP-006/008/027 work — agents bypassed `growth/*` branch policy and re-ran backlog items not marked done.
- EXP-044: `npm run growth:check-exp-shipped` + `growth:next` skips EXPs with content `keep` rows in ledger (excludes automation_os meta rows).
- EXP-045: `ledger-insights` no longer false-alarms on notes containing "invalid loop"; prints shipped content EXP IDs in window instead.
- EXP-046: `npm run growth:validate-branch-name` rejects `cursor/*` and enforces `growth/<loop>-exp-NNN-<slug>`; wired into program.md and experiment prompts 02–05, 09.

## Human decisions (2026-06-28)

- Autonomy default L1–L2; no auto-merge.
- Favicon switched to `images/favicon.jpeg` (ensure committed for prod).
