# Automation: Monthly Brand System

**automation_id:** `monthly_brand_system`  
**Trigger:** Cron 1st of month 09:00 Europe/Copenhagen

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Audit brand consistency across one weak surface; update DESIGN.md or propose improvements (loop: brand_safety / design_system).

## Steps

0. Run `npm run growth:bootstrap-branch -- experiment brand_safety EXP-032 brand-audit`
1. Run `npm run growth:precheck` — exit if lock held or ≥3 open growth PRs
2. Pick one weak surface (see Scope)
3. Run `npm run growth:check-exp-shipped -- <EXP-ID>` when executing a numbered backlog EXP
4. Forbidden phrase scan + minimal fix PR
5. AI hard review before PR; ledger + run log

## Scope (one per run)

Pick one: homepage hero copy · beles proof layer · journal voice · footer Letter promise · CSS CTA components

## Output

- Brand audit section in run log
- PR updating DESIGN.md and/or one page fix
- Forbidden phrase scan report (grep forbidden list from DESIGN.md)

## AI hard review

Required before PR — Bugbot on branch changes; zero **block** findings for DESIGN.md policy edits.

## No auto-merge
