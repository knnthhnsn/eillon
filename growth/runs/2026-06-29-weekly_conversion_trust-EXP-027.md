# Run log — EXP-027

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Experiment:** EXP-027 — Appointment mailto tracking on about
**Loop:** analytics_measurement
**Branch:** cursor/conversion-trust-points-f3e2

## Hypothesis

If we add `studio_appointment_click` analytics and a clearer appointment CTA on the about studio block, then Copenhagen appointment intent becomes measurable and easier to act on, because the studio section was the only major appointment surface without tracking or a dedicated request link.

## Changed files

- about.html — studio proof section, trust microcopy, appointment CTA with analytics
- growth/state.json — run lock (cleared below)

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_conversion_trust-EXP-027-ai-review.md

## QGS: 15 — keep

## Measure

Compare `studio_appointment_click` with `label=about_studio` vs footer/home labels over 14d. Watch proof_section_viewed for `about_studio`.

## Lock footer

Lock cleared 2026-06-29T13:00:00Z — experiment complete.
