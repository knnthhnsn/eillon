# Run log — EXP-011 · weekly_conversion_trust

**Date:** 2026-06-29  
**Automation:** weekly_conversion_trust  
**Experiment:** EXP-011 — FAQ schema expansion on wear.html  
**Branch:** growth/conversion_copy-exp-011-wear-faq-trust  
**Loop:** conversion_copy (Objection-to-Trust)

## Hypothesis

If we add a visible wear FAQ with FAQPage schema and a Beles restock trust block on `/wear`, then readers evaluating closeness, longevity, and sample-first objections will click through to the restock list, because hesitations are answered inline before The Letter signup.

## Changes

| File | Change |
|---|---|
| wear.html | FAQ section (8 Q&A), FAQPage JSON-LD, restock trust block + CTA |
| site.css / site.min.css | `.wear-faq` and `.wear-restock` editorial styles |

## Scoring

| Component | Score |
|---|---|
| intent | 3 |
| brand_fit | 3 |
| conversion | 3 |
| discoverability | 2 |
| measurement | 2 |
| technical | 3 |
| complexity_penalty | 0 |
| brand_risk_penalty | 0 |
| **QGS** | **16** |

## Decision

**keep** — QGS 16 ≥ 13, brand_risk 0, QA pass, AI hard review pass_with_notes (0 blocks).

## Monitor (14d)

- `beles_cta_click` label `wear_guide_restock` from `/wear`
- `proof_section_viewed` for `wear_faq` and `wear_restock`
- GSC FAQ rich-result eligibility on wear queries

## Lock

- Started: 2026-06-29T15:00:00Z
- Cleared: 2026-06-29 (end of run)
