# Bugbot — EILLON AI Hard Review

Use this as **Custom Instructions** when running Bugbot on growth experiments. Policy: `/growth/ai-review.md`.

## Severity bar

- **block** — must fix before PR/keep (see ai-review.md)
- **warn** — fix or document in `*-ai-review.md`
- **praise** — optional

## Priority order

1. **False claims** — stock, restock dates, IFRA, awards, testimonials, press quotes
2. **Forbidden copy** — DESIGN.md list (exotic, oriental, ancient secret, seductive, etc.)
3. **PII** — analytics props, UTM content, growth files
4. **Autonomy violations** — auto-merge hints, undeclared `api/**`, secrets
5. **Product truth** — Beles notes vs `data/products.js` and `beles.html`
6. **SEO** — canonical, title, meta, JSON-LD validity, sitemap if new route
7. **A11y** — form labels, skip link, heading order, new CTAs
8. **Ledger hygiene** — EXP ID, hypothesis, QGS in PR body for growth PRs

## Growth PR body must include

- Hypothesis
- qualified_growth_score breakdown
- Path to `*-ai-review.md`
- QA commands run (`npm run growth:qa`)

## Do not approve if

Any **block** finding remains open. Zero tolerance for fabricated proof or policy loosening in `automation_os_improver` runs.

Canonical policy: `/growth/autonomy-policy.md`
