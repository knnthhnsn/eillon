# EILLON AI Hard Review Protocol

**Replaces human review gates for growth experiments.** Every code or content experiment must pass AI hard review before `keep`, PR open, or merge.

## When required

| Change type | AI hard review |
|---|---|
| HTML / routes / sitemap | **Required** |
| Journal / landing / SEO copy | **Required** |
| Analytics / forms | **Required** |
| Campaign docs only | **Required** (brand + UTM) |
| `growth/**` docs-only compass | Light review (self-checklist) |
| `autonomy-policy.md` / safety rules | **Required** + block on any `block` finding |

## How to run (agents)

1. Finish the experiment diff on branch `growth/<loop>-<EXP-ID>-<slug>`.
2. Run `npm run growth:qa`.
3. Launch **Bugbot** (readonly) on **`branch changes`** against `main`.
   - Custom instructions: use `.cursor/BUGBOT.md` + this file + `DESIGN.md` forbidden phrases.
   - Severity bar: **zero `block` findings** to ship.
4. Fix every **block** finding; re-run Bugbot until clean or mark `rework`.
5. Write artifact: `growth/runs/YYYY-MM-DD-<automation_id>-<experiment_id>-ai-review.md` (template below).
6. Run `npm run growth:validate-ai-review -- <path-to-ai-review.md>`.
7. Only then: open PR, append ledger as `keep`, unlock state.

## Hard review checklist (Bugbot + self)

### Block (must fix before ship)

- [ ] False stock, restock date, IFRA, award, testimonial, or press claims
- [ ] Forbidden copy per `DESIGN.md` (exotic, oriental, seductive, ancient secret, etc.)
- [ ] PII in analytics events, UTM params, or growth files
- [ ] Secrets or API keys in diff
- [ ] Broken internal links / wrong canonical / invalid JSON-LD
- [ ] Autonomy violation: auto-merge, destructive git, `api/**` without scope
- [ ] Beles notes contradict `data/products.js` or `beles.html`
- [ ] Missing experiment ID / hypothesis / QGS in PR body (growth PRs)

### Warn (fix or document in ai-review artifact)

- [ ] Weak meta description or duplicate title
- [ ] Missing `data-analytics-*` on new primary CTA
- [ ] Mobile layout risk on waitlist forms
- [ ] New render-blocking scripts on homepage

### Pass criteria

- **pass** — zero block findings, all warn addressed or accepted with rationale
- **pass_with_notes** — zero block; warns documented in artifact
- **fail** — any block finding unresolved → status `rework`, no PR

## Artifact template

```markdown
# AI Hard Review — EXP-XXX

**Date:** YYYY-MM-DD
**Automation:** <automation_id>
**Branch:** growth/...
**Bugbot runs:** N
**Verdict:** pass | pass_with_notes | fail

## Summary

One paragraph.

## Findings

| Severity | Location | Finding | Resolution |
|---|---|---|---|
| block | file:line | ... | fixed / open |

## Checklist sign-off

- [ ] Brand (DESIGN.md)
- [ ] Claims / products.js
- [ ] Privacy / analytics
- [ ] SEO / metadata
- [ ] A11y (if UI)
- [ ] Ledger + run log ready

## QA commands

- npm run growth:qa — pass/fail
```

## PR body (growth experiments)

Include:

- EXP ID + hypothesis
- QGS breakdown
- Link to `*-ai-review.md` path
- QA commands run

## Escalation

If Bugbot unavailable: run manual checklist in this file, document gap in artifact, set verdict `pass_with_notes` with **Bugbot unavailable** — do not skip checklist sections.

Never mark `keep` without a validated `*-ai-review.md` artifact for code/content experiments.
