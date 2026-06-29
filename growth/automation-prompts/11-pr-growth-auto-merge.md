# Automation: PR Growth Auto-Merge

**automation_id:** `pr_growth_auto_merge`  
**Trigger:** Git pull request — checks completed successfully (target: main)

---

You are a Cursor Cloud Agent in the EILLON repo (automation_id: pr_growth_auto_merge).

Read AGENTS.md, growth/autonomy-policy.md, growth/ai-review.md, .cursor/BUGBOT.md, growth/state.json, growth/results.tsv.

## Mission

**Conditionally squash-merge** growth experiment PRs when AI hard review and CI both pass. This closes the loop without human merge for low-risk growth PRs only.

## Eligible PR criteria (ALL required)

1. Head branch matches `growth/*`
2. Base branch is `main`
3. CI / checks **green** on latest commit
4. PR body contains `EXP-` experiment ID + hypothesis
5. PR body links to `*-ai-review.md` path OR pr_growth_review left a comment with **Verdict: pass** or **pass_with_notes** and **zero block** findings
6. Diff does NOT touch: `api/**`, `lib/**`, `.github/workflows/**`, `growth/autonomy-policy.md`, `vercel.json`, payment/checkout, secrets
7. `brand_risk_penalty <= 1` documented in PR body
8. Not labeled `no-auto-merge` or `human-review`

## Steps

1. Identify PR from trigger context
2. Run `npm run growth:auto-merge-cap` — exit if rolling 7-day cap reached (L2b safety)
3. Run eligibility checks above — if any fail, comment why and **do not merge**
4. Re-run checklist from growth/ai-review.md (read PR diff; do not skip)
5. If zero **block** findings: `gh pr merge <number> --squash --delete-branch`
6. Comment on PR: merged by auto-merge policy + link to ai-review
7. Append results.tsv row (loop_type: automation_os, status: keep) if experiment-linked
8. Update growth/state.json open_growth_prs_count if tracked

## Forbidden

- Merge non-growth PRs
- Merge with any open **block** finding
- Merge if CI failing
- Force push or bypass branch protection
- Merge PRs touching forbidden paths

## Stop if

- Branch protection requires human approval and bot lacks permission
- Ambiguous verdict — comment and exit
- More than 3 growth PRs merged by auto-merge in rolling 7 days (safety cap)

## Human escalation

Comment `@kenneth` (or repo owner) when blocked by branch protection or ambiguous review.
