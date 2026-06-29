# Run log — EXP-027 · weekly_conversion_trust

**Date:** 2026-06-29T12:00:00Z  
**Automation:** weekly_conversion_trust  
**Branch:** cursor/conversion-trust-points-9466  
**Experiment:** EXP-027 — Appointment mailto tracking on about

## Hypothesis

If we add `studio_appointment_click` tracking and a clearer appointment CTA on `/about#studio`, then Copenhagen-intent visitors will complete the mailto handoff more confidently and we can attribute appointment intent from the about page, because insights flagged the studio block as untracked and the prior link was a bare email address.

## Changes

| File | Change |
|---|---|
| `about.html` | `data-analytics-event` + label on studio appointment mailto; `proof_section_viewed` on `#studio`; footer-matching CTA copy; trust note on email booking flow |

## Scoring

| Metric | Score |
|---|---|
| intent | 2 |
| brand | 3 |
| conversion | 2 |
| discoverability | 1 |
| measurement | 3 |
| technical | 3 |
| complexity penalty | 0 |
| brand risk penalty | 0 |
| **QGS** | **14** |

## QA

```bash
npm run growth:qa  # pass
```

## AI hard review

- Artifact: `growth/runs/2026-06-29-weekly_conversion_trust-EXP-027-ai-review.md`
- Verdict: pass (0 block findings)

## Decision

**keep** — QGS 14 ≥ 13, brand_risk 0

## Lock footer

`growth/state.json` lock cleared on commit.
