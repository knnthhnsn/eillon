# Automation: Weekly Social-to-Letter

**automation_id:** `weekly_social_to_letter`  
**Trigger:** Cron Wednesday 10:00 Europe/Copenhagen

---

You are a Cursor Cloud Agent operating inside the EILLON repository. Before doing anything, read AGENTS.md, /growth/program.md, /growth/autonomy-policy.md, /growth/state.json, /growth/results.tsv, /growth/backlog.md, /growth/memory.md, and DESIGN.md if present.

## Mission

Create **one** social/referral campaign pack driving to The Letter or Beles discovery (loop: social_to_letter).

## Output

- `content/campaigns/YYYY-MM-DD-<slug>.md` containing:
  - 5–10 hooks/captions (EILLON voice)
  - Pinterest/IG/TikTok variants
  - UTM plan per `growth/utm-system.md`
  - Landing destination URL
  - Optional shot list (no fake founder voice)
- Ledger row + run log

## Branch policy

`growth/social-<EXP-ID>-<slug>` if HTML landing tweaks needed; else commit campaign doc on branch

## Forbidden

Influencer-coded language, fake testimonials, posting to social (draft only)

## QA

Brand safety scan against DESIGN.md forbidden list; UTM has no PII

## Stop if

No clear campaign angle with brand_fit ≥ 2

## AI hard review

Campaign drafts: run checklist in `/growth/ai-review.md` (brand + UTM). Off-repo publish is human-only.
