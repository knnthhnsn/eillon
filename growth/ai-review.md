# EILLON Growth — AI Hard Review

**Version:** 1.0 · 2026-06-29  
**Mandatory before marking any code experiment `keep`.**

## Purpose

Second-pass review after `npm run growth:qa` — catch brand risk, false claims, SEO/a11y regressions, and autonomy violations before PR.

## Workflow

1. **Run QA** — `npm run growth:qa` must pass first.
2. **Bugbot review** — Launch Cursor Bugbot on the experiment branch diff. Custom instructions: `.cursor/BUGBOT.md`.
3. **Triage findings**
   - **Block** — false claims, forbidden copy, PII in analytics, broken canonicals, invalid JSON-LD, missing form a11y, autonomy violations → **fix before PR**
   - **Warn** — style nits, optional measurement gaps → document in ai-review file; fix if trivial
4. **Write run artifact** — `growth/runs/YYYY-MM-DD-<automation_id>-<EXP-ID>-ai-review.md`
5. **Validate** — `npm run growth:validate-ai-review -- growth/runs/...-ai-review.md`

## ai-review.md file template

```markdown
# AI Hard Review — EXP-XXX

**Branch:** growth/...
**Reviewer:** Bugbot + agent triage
**Date:** YYYY-MM-DD

## QA baseline
- npm run growth:qa — pass/fail

## Bugbot findings
| ID | Severity | File | Finding | Resolution |
|---|---|---|---|---|
| B1 | block/warn | path | summary | fixed/deferred |

## Manual checks (BUGBOT.md)
- [ ] No false stock/restock/certification claims
- [ ] No forbidden copy (DESIGN.md)
- [ ] No PII in analytics/UTM
- [ ] Canonical + title + JSON-LD valid on new routes
- [ ] Form a11y if forms touched

## Blockers remaining
None — or list blockers that prevent keep.

## Decision
pass | fail
```

## Pass criteria

- All **block** findings resolved
- `growth:validate-ai-review` exits 0
- `brand_risk_penalty <= 1` after fixes

## References

- `.cursor/BUGBOT.md`
- `/growth/qa-gates.md`
- `/growth/autonomy-policy.md`
- `/DESIGN.md`
