# EILLON Automation Registry

**Updated:** 2026-06-29  
**Truth rule:** Status is `active` only after verified in Cursor Automations UI.

| automation_id | name | status | trigger | schedule (Copenhagen) |
|---|---|---|---|---|
| daily_growth_compass | Daily Growth Compass | **active** | cron | Weekdays 08:00 |
| weekly_search_to_restock | Weekly Search-to-Restock | **active** | cron | Monday 09:00 |
| weekly_social_to_letter | Weekly Social-to-Letter | **active** | cron | Wednesday 10:00 |
| weekly_conversion_trust | Weekly Conversion & Trust | **active** | cron | Thursday 11:00 |
| monthly_brand_system | Monthly Brand System | **active** | cron | 1st of month 09:00 |
| pr_growth_review | PR Growth Review | **active** | git PR opened/updated | — |
| pr_growth_auto_merge | PR Growth Auto-Merge | **active** | git CI passed on PR | — |
| ci_failure_repair | CI Failure Repair | **active** | git CI failed | — |
| main_branch_digest | Main Branch Digest | **active** | cron | Sunday 18:00 |
| manual_next_best_experiment | Manual Next Best Experiment | **active** | manual | — |
| automation_os_improver | Automation OS Improver | **active** | cron | 1st of month 10:00 |

---

## AUT-01 daily_growth_compass

- **Prompt:** `growth/automation-prompts/01-daily-growth-compass.md`
- **Repo:** `knnthhnsn/eillon` · branch `main`
- **Optional:** Agent-Reach CLI (`docs/growth-mcp-setup.md`), codebase-memory-mcp
- **Verified:** 2026-06-29 · UI list confirmed

---

## AUT-02 weekly_search_to_restock

- **Prompt:** `growth/automation-prompts/02-weekly-search-to-restock.md`
- **Verified:** 2026-06-29

---

## AUT-03 weekly_social_to_letter

- **Prompt:** `growth/automation-prompts/03-weekly-social-to-letter.md`
- **Verified:** 2026-06-29

---

## AUT-04 weekly_conversion_trust

- **Prompt:** `growth/automation-prompts/04-weekly-conversion-trust.md`
- **Verified:** 2026-06-29

---

## AUT-05 monthly_brand_system

- **Prompt:** `growth/automation-prompts/05-monthly-brand-system.md`
- **Verified:** 2026-06-29

---

## AUT-06 pr_growth_review

- **Prompt:** `growth/automation-prompts/06-pr-growth-review.md`
- **Tools:** GitHub (PR comment)
- **Verified:** 2026-06-29

---

## AUT-06b pr_growth_auto_merge

- **Prompt:** `growth/automation-prompts/11-pr-growth-auto-merge.md`
- **Trigger:** GitHub — checks completed successfully on PR to `main`
- **Tools:** Read, Terminal (`gh pr merge`), GitHub PR comment
- **Policy:** L2b in `growth/autonomy-policy.md`
- **Verified:** 2026-06-29 · UI list confirmed

---

## AUT-07 ci_failure_repair

- **Prompt:** `growth/automation-prompts/07-ci-failure-repair.md`
- **Verified:** 2026-06-29

---

## AUT-08 main_branch_digest

- **Prompt:** `growth/automation-prompts/08-main-branch-digest.md`
- **Verified:** 2026-06-29

---

## AUT-09 manual_next_best_experiment

- **Prompt:** `growth/automation-prompts/09-manual-next-best-experiment.md`
- **Verified:** 2026-06-29

---

## AUT-10 automation_os_improver

- **Prompt:** `growth/automation-prompts/10-automation-os-improver.md`
- **Verified:** 2026-06-29

---

## Registration checklist

See `/docs/cursor-automations-setup.md` and `/docs/growth-mcp-setup.md`.

**Verified active count:** 11/11

**Note:** User UI shows 14 total automations — 3 may be unrelated or legacy duplicates outside this registry.
