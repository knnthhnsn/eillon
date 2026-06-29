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

## Wins (2026-06-29 — main_branch_digest)

- **EXP-003–005 shipped on main:** `/prickly-pear-parfum`, smell-intent journal article, Beles restock trust microcopy.
- **EXP-031:** 10 growth automations verified in Cursor UI; `pr_growth_auto_merge` may still need save in editor.
- **First L2b auto-merge:** PR #44 (EXP-005) squash-merged at `790ad6f` with AI hard review pass_with_notes, 0 blocks, CI green.
- Growth OS live under `/growth/` with AI hard review protocol, scorecard, QA scripts, automation prompts.
- Sitemap now **19 URLs**; prickly-pear and smell-intent routes indexed.

## Lessons (2026-06-29 — main_branch_digest)

- **Baseline drifts quickly** when digest is infrequent — routes and sitemap count lagged shipped EXP-003/004 until this run.
- **Mobile Maison pin** must chain start to House of Memory pin end; CSS sticky fallback conflicts with GSAP pin — exclude overrides.
- **iOS Safari:** `ScrollTrigger.normalizeScroll(true)` plus ordered pin refresh reduces section jitter.
- **Vercel deploy quota:** temporary jsDelivr load for homepage scroll-pin script (`c714cf6`) — revert when quota resets.
- **Lazy GSAP** caused mobile jitter before; eager/defer script order matters for pin init.
- Agent-Reach: Reddit authenticated (`eillonofficial`); Twitter CLI may need browser configure.

## Automation (2026-06-29)

- Autonomy level now **L2b_conditional_auto_merge** for eligible `growth/*` PRs (see `autonomy-policy.md`).
- Codebase memory indexed (~10k nodes) for agent context.
