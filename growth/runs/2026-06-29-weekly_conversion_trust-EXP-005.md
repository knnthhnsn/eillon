# Run log — weekly_conversion_trust · EXP-005

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Branch:** cursor/conversion-trust-points-d266  
**Loop:** objection_to_trust / conversion_copy

## Hypothesis

If we place explicit trust microcopy (restock note, no charge today, size-as-interest) visible before the Beles waitlist form on desktop, then hesitant buyers evaluating price/availability will complete signup, because consent currently references copy hidden by `display:none` on `.shop__cta-caption`.

## Change

- Added `.shop__form-trust` block with lede + three trust points before `#waitlistForm`
- Self-contained consent copy (removed "described above")
- Removed redundant hidden `.shop__cta-caption` from Beles waitlist
- Updated `aria-describedby` on submit button to `#shopFormTrust`
- CSS in `styles.css` + dark-band overrides in `site.css`

## Files changed

beles.html, styles.css, styles.min.css, site.css, site.min.css

## QA

```bash
npm run growth:qa  # pass
```

## AI review

`growth/runs/2026-06-29-weekly_conversion_trust-EXP-005-ai-review.md` — pass_with_notes (Bugbot unavailable)

## Score

QGS 15 — intent 3, brand 3, conversion 3, discoverability 1, measurement 1, technical 3, complexity 0, risk 0

## Lock footer

lock_status: unlocked  
active_experiment_id: null  
last_successful_loop: EXP-005
