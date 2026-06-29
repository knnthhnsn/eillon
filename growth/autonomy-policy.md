# EILLON Growth Autonomy Policy

**Version:** 1.1  
**Effective:** 2026-06-28  
**Policy changes require AI hard review** (see `/growth/ai-review.md`).

## Purpose

Define what autonomous agents, Cursor Automations, and Cloud Agents may do inside the EILLON repository without additional approval.

## Autonomy levels

| Level | Name | Allowed |
|---|---|---|
| L0 | Read-only | Inspect repo, read `/growth/*`, run read-only commands |
| L1 | Docs & drafts | L0 + create/update docs, rules, prompts, draft branches, draft content |
| L2 | Code PRs | L1 + open PRs with QA-passing code changes (no auto-merge) |
| L3 | Production-adjacent | **Human only** — deploy, email send, ads, pricing, claims |

**Current default for automations:** L1–L2 (PRs allowed). **L2b:** conditional auto-merge for eligible `growth/*` PRs only (see below).

## Conditional auto-merge (L2b)

`pr_growth_auto_merge` may squash-merge when **all** are true:

- Head branch `growth/*`, base `main`
- CI green on latest commit
- AI hard review verdict `pass` or `pass_with_notes` with **zero block** findings
- PR documents EXP ID, hypothesis, QGS, `*-ai-review.md` link
- Diff excludes `api/**`, `lib/**`, workflows, autonomy-policy, checkout
- Label `no-auto-merge` absent
- ≤3 auto-merges in rolling 7 days

Branch protection may still require human approval — automation comments and stops if merge denied.

## Allowed without further approval

- Inspect repo and `/growth/*`
- Create or update docs, Cursor rules, automation prompts
- Create safe internal scripts under `scripts/growth/`
- Create growth experiment branches (`growth/*`)
- Draft SEO/content pages and campaign kits
- Improve copy, metadata, internal links (no false claims)
- Add privacy-conscious analytics events **only** following `scripts/analytics.js` patterns
- Run `npm run build`, `verify:*`, `smoke:funnel`, `growth:*` scripts
- Open a PR if Cursor Automation supports it
- **Auto-merge** eligible `growth/*` PRs only via `pr_growth_auto_merge` when L2b criteria met

## Requires AI hard review (before keep / PR)

All growth experiments touching code or public copy must pass `/growth/ai-review.md` (Bugbot + `*-ai-review.md` artifact).

Review focus:

- New product claims, major new routes, analytics events
- DESIGN.md policy-level changes
- Changes to this autonomy policy
- Campaign kits before off-repo publish (draft in repo still needs brand review artifact)

## Human-only (not delegated to growth automations)

- Production deploy or promotion
- Auto-merge of PRs **outside** L2b criteria (non-growth, forbidden paths, block findings, no ai-review)
- Sending email campaigns or transactional changes
- Paid ads or ad copy publication off-repo
- Price, SKU, or availability changes
- Claims about stock, restock dates, IFRA, certifications, awards, reviews, press, testimonials
- Checkout/payment changes
- Sending personal data to new third parties
- Destructive DB migrations or data deletion
- Deleting major content
- Increasing automation autonomy level

Policy file edits (`autonomy-policy.md`) require **AI hard review** with zero block findings — not human sign-off in the growth loop.

## Forbidden

- `git push --force` to shared branches
- Hard reset on shared branches
- Deleting production data
- Touching production DB schema destructively
- Exposing or committing secrets/API keys
- Scraping in violation of platform ToS
- Fabricating facts, testimonials, reviews, or availability
- Sending PII to analytics payloads
- Auto-merging automation PRs that fail AI hard review or CI
- Infinite self-triggering loops
- Automations recursively triggering each other without lock/guard
- Loosening safety constraints silently in `automation_os_improver`

## Automation safety (mandatory)

1. **One experiment** per automation run
2. **One branch** per experiment (`growth/<loop>-<id>-<slug>`)
3. **One PR** per experiment
4. **Max 3 open growth PRs** at once
5. Do not open a new growth PR if same `loop_type` already has an open PR
6. Event-triggered automations ignore branches matching `growth/*` unless reviewing that branch
7. Scheduled automations **exit** if repo lock is `locked` or CI on `main` is failing
8. Every run writes `/growth/runs/YYYY-MM-DD-<automation_id>-<experiment_id>.md`
9. Every run appends `/growth/results.tsv` (never overwrite)
10. QA gates must pass before proposing code changes
11. Stop safely if required tools/secrets missing

## Lock protocol

- Set `growth/state.json` → `lock_status: "locked"` when starting a code experiment
- Clear lock in run log footer
- If lock older than 24h, human must clear before next code automation

## Escalation

When unsure: run AI hard review; if block findings remain, mark `rework` in `results.tsv` and stop.
