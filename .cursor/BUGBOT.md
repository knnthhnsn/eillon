# Bugbot / PR review focus — EILLON Growth

When reviewing growth PRs, prioritize:

1. **False claims** — stock, restock dates, IFRA, awards, testimonials
2. **Forbidden copy** — see DESIGN.md list
3. **PII in analytics/UTM**
4. **Autonomy violations** — auto-merge hints, api/secrets changes
5. **Missing ledger** — growth PRs should reference EXP ID and scores
6. **SEO** — broken canonicals, missing titles, invalid JSON-LD
7. **A11y** — form labels, contrast on new CTAs

Growth experiments should include in PR body:
- Hypothesis
- qualified_growth_score breakdown
- QA commands run

Canonical policy: `/growth/autonomy-policy.md`
