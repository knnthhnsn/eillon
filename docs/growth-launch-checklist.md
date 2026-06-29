# EILLON Growth Launch Checklist

Use before enabling scheduled automations on production repo.

## Repo readiness

- [ ] `/growth/` committed to `main`
- [ ] `AGENTS.md`, `DESIGN.md` present
- [ ] `.cursor/rules/*.mdc` present
- [ ] `npm run growth:qa` passes locally
- [ ] `npm run growth:validate-ledger` passes
- [ ] `images/favicon.jpeg` committed (if using new favicon)

## Automation readiness

- [ ] Read `/docs/cursor-automations-setup.md`
- [ ] Register `manual_next_best_experiment` first; dry-run EXP-003 on branch
- [ ] Confirm **no auto-merge** on all automations
- [ ] Update `growth/automation-registry.md` with `active` only after UI verification

## Brand safety

- [ ] DESIGN.md forbidden phrase grep on any pending growth PRs
- [ ] No false restock/stock claims in queue

## Analytics

- [ ] Vercel WA enabled on eillon.maison
- [ ] Test UTM capture: `?utm_source=cursor_automation_test&utm_medium=organic&utm_campaign=beles_restock`
- [ ] Confirm waitlist API receives UTM fields (staging/preview)

## Human approvals needed

- [ ] Brand owner sign-off on automation autonomy level (L1–L2)
- [ ] Any email/paid social still human-only

## Post-launch week 1

- [ ] Daily compass run logs present in `growth/runs/`
- [ ] At least one search or conversion experiment PR opened
- [ ] Review results.tsv for keep/rework ratio
- [ ] Adjust backlog priorities from insights.md
