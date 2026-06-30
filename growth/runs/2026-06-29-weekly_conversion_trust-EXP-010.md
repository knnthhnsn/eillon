# Run log — weekly_conversion_trust · EXP-010

**Date:** 2026-06-29  
**Automation:** `weekly_conversion_trust`  
**Branch:** `cursor/conversion-trust-points-96b7`  
**Loop type:** `local_discovery` (Copenhagen appointment path)

## Hypothesis

If we strengthen the about page studio block with explicit appointment expectations and tracked mailto CTAs, then Copenhagen-intent visitors will request studio visits more confidently, because hours, location, reply-by-email steps, and no-payment clarity are visible before contact.

## Change

- `about.html` — studio visit block with hours, expectation copy, tracked appointment CTA; press enquiry analytics; newsletter trust microcopy
- `site.css` / `site.min.css` — `.about-studio__*` styles on leopard shader band

Includes measurement gap from **EXP-027** (about appointment mailto tracking) in the same surface.

## QGS

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 1 |
| measurement | 3 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |
| **qualified_growth_score** | **16** |

## QA

- `npm run growth:qa` — pass (build, verify:all)

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-010-ai-review.md`
- Verdict: `pass_with_notes` (Bugbot unavailable; manual checklist)

## Monitor (14d)

- `studio_appointment_click` with label `about_studio` vs `footer` / `homepage_footer`
- `proof_section_viewed` for `about_studio`

## Lock footer

- `growth/state.json` → `lock_status: unlocked`, `active_experiment_id: null`
