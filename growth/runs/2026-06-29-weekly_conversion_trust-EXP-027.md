# Run log — EXP-027

**Date:** 2026-06-29
**Automation:** weekly_conversion_trust
**Experiment:** EXP-027 — Appointment mailto tracking on about
**Loop:** analytics_measurement
**Branch:** cursor/conversion-trust-points-6e50

## Hypothesis

If we add `studio_appointment_click` analytics and explicit trust microcopy on the about studio block (matching the homepage footer pattern), then local/studio-intent visitors will request appointments with measurable attribution, because the path closes the tracking gap and answers “what happens next” before the mailto.

## Changed files

- about.html — studio proof section, trust copy, appointment CTA with analytics
- site.css, site.min.css — `.about-studio__visit` styles in leopard band

## QA

- npm run growth:qa — pass
- AI review: growth/runs/2026-06-29-weekly_conversion_trust-EXP-027-ai-review.md

## QGS: 16 — keep

## Measure

Compare `studio_appointment_click` where `label=about_studio` vs `homepage_footer` / `footer` over 14d; watch `proof_section_viewed` for `about_studio`.

## Lock cleared

`growth/state.json` lock_status → unlocked at run end.
