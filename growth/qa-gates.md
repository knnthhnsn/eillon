# EILLON Growth QA Gates

**Updated:** 2026-06-28

## Discovered commands

| Gate | Command | Status |
|---|---|---|
| Install | `npm ci \|\| npm install` | available (`growth:qa` runs `npm ci` if GSAP vendor deps missing) |
| Build | `npm run build` | available |
| Link verify | `npm run verify:links` | available |
| Copy verify | `npm run verify:copy` | available |
| Stock verify | `npm run verify` | available |
| Full verify | `npm run verify:all` | available |
| Funnel smoke | `npm run smoke:funnel` | available |
| Lighthouse CI | `npm run lighthouse:ci` | available (heavy) |
| Full CI | `npm run ci` | available |
| Lint | — | **unavailable** (no eslint config) |
| Typecheck | — | **unavailable** (plain JS) |
| Unit tests | — | **unavailable** |

## Growth-specific commands

| Command | Purpose |
|---|---|
| `npm run growth:validate-ledger` | Validate `results.tsv` header, status enum, loop_type, score math |
| `npm run growth:validate-backlog` | Validate `backlog.md` loop_type column matches program.md allowlist |
| `npm run growth:ledger-insights` | Summarize last N ledger rows (rework/blocked patterns) |
| `npm run growth:state` | Print/validate `state.json` |
| `npm run growth:precheck` | Exit non-zero if lock held or ≥3 open growth PRs (automation start gate) |
| `npm run growth:lock-check` | Exit non-zero if lock held only (review/digest automations) |
| `npm run growth:auto-merge-cap` | Exit non-zero if L2b rolling 7-day auto-merge cap reached |
| `npm run growth:score` | Compute qualified_growth_score |
| `npm run growth:next` | Select highest-priority backlog experiment |
| `npm run growth:check-exp-shipped` | Exit non-zero if EXP already has content keep row in ledger |
| `npm run growth:validate-branch-name` | Enforce `growth/<loop>-exp-NNN-<slug>`; reject `cursor/*` |
| `npm run growth:qa` | Run minimum keep gate for growth changes |

## Ledger status rules

Valid `results.tsv` status values: **`keep`**, **`rework`**, **`discard`**, **`blocked`** only.

- Do **not** use `pending_registration`, `pending_review`, or registry states as ledger status
- Track automation registration in `growth/automation-registry.md` (see EXP-031)
- Backlog `loop` column must match `program.md` loop_type values — enforced by `npm run growth:validate-backlog` (EXP-026 had invalid `objection_to_trust`)
- `keep` requires `qualified_growth_score >= 13` and `brand_risk_penalty <= 1` (enforced by validate-ledger)

## Minimum keep gate (code experiments)

Before marking **keep** on any code change:

- [ ] `npm run build` passes
- [ ] `npm run verify:all` passes (or failures pre-existing and documented)
- [ ] No unsupported product/stock/restock/certification claims added
- [ ] No PII in analytics payloads or UTMs
- [ ] No secrets committed
- [ ] Critical links not broken (`verify:links`)
- [ ] `brand_risk_penalty <= 1`
- [ ] Result appended to `growth/results.tsv`
- [ ] Run log created in `growth/runs/`
- [ ] **AI hard review** artifact `*-ai-review.md` validated (`npm run growth:validate-ai-review`)

## Minimum keep gate (docs-only experiments)

- [ ] Markdown/YAML/JSON valid
- [ ] No fake automation "active" claims
- [ ] Autonomy policy not loosened without review
- [ ] Result logged

## Brand safety checks

- [ ] No forbidden patterns (see `DESIGN.md`)
- [ ] No "exotic/oriental/ancient secret/seductive" framing
- [ ] No fake scarcity or guaranteed longevity claims
- [ ] Cultural references precise, not flattening
- [ ] Beles notes align with `data/products.js` and `beles.html`

## Accessibility checks (when touching UI)

- [ ] Semantic headings in order
- [ ] Form labels / `aria-*` on new inputs
- [ ] Color contrast reasonable (EILLON palette)
- [ ] Mobile layout spot-check at 390px width

## Metadata / SEO checks (when touching pages)

- [ ] Unique `<title>` and meta description
- [ ] Canonical URL correct
- [ ] Run `npm run build:sitemap` if routes added
- [ ] Structured data valid JSON-LD if added

## Privacy checks (when touching forms/analytics)

- [ ] Follow `scripts/analytics.js` event naming
- [ ] No email/name/phone in event props
- [ ] UTM params only standard five; no PII in `utm_content`
- [ ] Consent pattern preserved on waitlist forms

## Performance checks (when touching homepage)

- [ ] Prefer defer/lazy patterns already used on `index.html`
- [ ] No new render-blocking scripts without justification
- [ ] Run Lighthouse if hero/LCP touched

## Mobile layout

- [ ] Chapter pages: waitlist form usable on mobile
- [ ] Nav/footer from `site-nav.js` not broken

## Failure handling

If gate fails:
1. Fix if trivial and in-scope
2. Else mark `rework` or `discard` in ledger
3. Document in run log
4. Release lock in `state.json`
