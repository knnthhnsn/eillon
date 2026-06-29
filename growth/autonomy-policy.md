# EILLON Growth Autonomy Policy

**Version:** 1.0  
**Effective:** 2026-06-28  
**Human review required to change this file.**

## Purpose

Define what autonomous agents, Cursor Automations, and Cloud Agents may do inside the EILLON repository without additional approval.

## Autonomy levels

| Level | Name | Allowed |
|---|---|---|
| L0 | Read-only | Inspect repo, read `/growth/*`, run read-only commands |
| L1 | Docs & drafts | L0 + create/update docs, rules, prompts, draft branches, draft content |
| L2 | Code PRs | L1 + open PRs with QA-passing code changes (no auto-merge) |
| L3 | Production-adjacent | **Human only** — deploy, email send, ads, pricing, claims |

**Current default for automations:** L1–L2 (PRs allowed, never auto-merge).

## Allowed without further approval

- Inspect repo and `/growth/*`
- Create or update docs, Cursor rules, automation prompts
- Create safe internal scripts under `scripts/growth/`
- Create growth experiment branches (`growth/*`)
- Draft SEO/content pages and campaign kits
- Improve copy, metadata, internal links (no false claims)
- Add privacy-conscious analytics events **only** following `scripts/analytics.js` patterns
- Run `npm run build`, `verify:*`, `smoke:funnel`, `growth:*` scripts
- Open a PR if Cursor Automation supports it (**never auto-merge**)

## Requires human review

- Production deploy or promotion
- Auto-merge of any PR
- Sending email campaigns or transactional changes
- Paid ads or ad copy publication off-repo
- Price, SKU, or availability changes
- Claims about stock, restock dates, IFRA, certifications, awards, reviews, press, testimonials
- Checkout/payment changes
- Sending personal data to new third parties
- Destructive DB migrations or data deletion
- Deleting major content
- Increasing automation autonomy level
- **Changes to this autonomy policy**

## Forbidden

- `git push --force` to shared branches
- Hard reset on shared branches
- Deleting production data
- Touching production DB schema destructively
- Exposing or committing secrets/API keys
- Scraping in violation of platform ToS
- Fabricating facts, testimonials, reviews, or availability
- Sending PII to analytics payloads
- Auto-merging automation PRs
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

When unsure: mark experiment `pending_review` in `results.tsv` and stop.
