# EILLON Automation Registry

**Updated:** 2026-06-29  
**Truth rule:** Status is `active` only after verified in Cursor Automations UI.

| automation_id | name | status | trigger | schedule (Copenhagen) |
|---|---|---|---|---|
| daily_growth_compass | Daily Growth Compass | **active** | cron | Weekdays 08:00 |
| weekly_search_to_restock | Weekly Search-to-Restock | **awaiting_save** | cron | Monday 09:00 |
| weekly_social_to_letter | Weekly Social-to-Letter | **pending_registration** | cron | Wednesday 10:00 |
| weekly_conversion_trust | Weekly Conversion & Trust | **pending_registration** | cron | Thursday 11:00 |
| monthly_brand_system | Monthly Brand System | **pending_registration** | cron | 1st of month 09:00 |
| pr_growth_review | PR Growth Review | **active** | git PR opened/updated | — |
| ci_failure_repair | CI Failure Repair | **pending_registration** | git CI failed | — |
| main_branch_digest | Main Branch Digest | **pending_registration** | git push main + weekly | Sunday 18:00 |
| manual_next_best_experiment | Manual Next Best Experiment | **active** | manual | — |
| automation_os_improver | Automation OS Improver | **pending_registration** | cron monthly + manual | 1st of month 10:00 |

---

## AUT-01 daily_growth_compass

- **Prompt:** `growth/automation-prompts/01-daily-growth-compass.md`
- **Repo:** `knnthhnsn/eillon` · branch `main`
- **Branch policy:** docs-only on `main` or `growth/compass-*`; no code without PR
- **Allowed tools:** read, write (growth/*), shell (npm run growth:*)
- **Required MCPs:** none required; optional Agent-Reach for research
- **Allowed paths:** `growth/**`, `content/campaigns/**` (create if needed)
- **Forbidden paths:** `api/**`, production HTML without PR
- **Expected output:** updated insights, backlog priority, memory; results.tsv row; run log
- **QA gates:** validate-ledger, no fake claims
- **Max autonomy:** L1 (docs-only default)
- **AI hard review:** required before PR — `/growth/ai-review.md`, Bugbot, validate-ai-review
- **Last run:** 2026-06-28 (manual OS build)
- **Last result:** insights/backlog seeded
- **Failure mode:** missing analytics access → docs-only research update
- **Recovery:** mark run `blocked` in ledger; do not retry same day

---

## AUT-02 weekly_search_to_restock

- **Prompt:** `growth/automation-prompts/02-weekly-search-to-restock.md`
- **Branch policy:** `growth/search-*` PR only
- **Max open PRs:** 1 for this loop_type
- **QA gates:** build, verify:all, brand safety
- **AI hard review:** new product claims, major new routes

---

## AUT-03 weekly_social_to_letter

- **Prompt:** `growth/automation-prompts/03-weekly-social-to-letter.md`
- **Output:** `content/campaigns/YYYY-MM-DD-<slug>.md` + UTM plan
- **AI hard review:** brand + UTM checklist before PR
- **Human-only:** publishing off-repo

---

## AUT-04 weekly_conversion_trust

- **Prompt:** `growth/automation-prompts/04-weekly-conversion-trust.md`
- **Focus:** one conversion surface (form, FAQ, CTA, trust copy)

---

## AUT-05 monthly_brand_system

- **Prompt:** `growth/automation-prompts/05-monthly-brand-system.md`
- **AI hard review:** DESIGN.md policy-level changes

---

## AUT-06 pr_growth_review

- **Prompt:** `growth/automation-prompts/06-pr-growth-review.md`
- **Trigger:** PR to main (ignore `growth/*` head unless reviewing that PR)
- **Output:** PR comment / review report; no code unless autofix enabled by human

---

## AUT-07 ci_failure_repair

- **Prompt:** `growth/automation-prompts/07-ci-failure-repair.md`
- **Stop if:** failure unrelated to growth PR or requires secrets

---

## AUT-08 main_branch_digest

- **Prompt:** `growth/automation-prompts/08-main-branch-digest.md`
- **Output:** run digest + baseline/memory updates if architecture changed

---

## AUT-09 manual_next_best_experiment

- **Prompt:** `growth/automation-prompts/09-manual-next-best-experiment.md`
- **Uses:** `npm run growth:next`

---

## AUT-10 automation_os_improver

- **Prompt:** `growth/automation-prompts/10-automation-os-improver.md`
- **AI hard review:** required for autonomy policy or safety rule changes (zero block findings)

---

## Registration checklist

See `/docs/cursor-automations-setup.md` for paste-in steps per automation.

**Verified active count:** 3 (daily_growth_compass, pr_growth_review, manual_next_best_experiment — 2026-06-29)

**Note:** Duplicate "Daily Growth Compass" entries in UI — delete the older duplicate and keep one.

**Next:** Save "Weekly Search-to-Restock" (form prefilled 2026-06-29).
