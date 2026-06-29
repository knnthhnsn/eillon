# Run log — EXP-032 · monthly_brand_system

**Date:** 2026-06-29  
**Automation:** monthly_brand_system (`f43c09a4-7395-11f1-a8a0-cafc5ef88358`)  
**Loop type:** brand_safety / design_system  
**Branch:** cursor/brand-consistency-audit-0b64  
**Status:** keep

## Hypothesis

If we audit one weak brand surface and codify canonical Letter promise copy in DESIGN.md, then newsletter signup surfaces will present consistent trust language, because drifted promises (especially on `/shipping`) weaken quiet-commerce credibility.

## Surface selected

**Footer Letter promise** (scope option 4 of 5).

Alternatives considered:
- Homepage hero copy — on-brand; CTA hierarchy note only (store vs Beles) — deferred
- Beles proof layer — strong; IFRA disclaimer present
- Journal voice — consistent with DESIGN.md SEO rules
- CSS CTA components — documented as secondary finding in DESIGN.md (sx-btn parity)

## Brand audit

### Letter promise drift (before)

| Page | Promise copy | Issue |
|---|---|---|
| index.html + site-nav.js | Seasonal letters only: studio notes, restock windows, and private appointment openings. | Canonical ✓ |
| craftsmanship.html | …on composition, restock windows… | Topic drift |
| wear.html | …on wear… studio appointments | Wording drift |
| store.html | Studio notes… chapter openings — one letter at a time | Different structure |
| shipping.html | Private purchase links and studio letters before the public boutique opens. | **Unverified purchase-access claim** |
| journal.html | …composition, materials, and restock windows | Topic drift |
| about.html | Restock windows, chapter openings, and maison letters… | Different structure |

### Fix

All six editorial `.sx-letter` promise paragraphs aligned to canonical footer copy. DESIGN.md updated with Letter rules and CTA class map (`.qbtn` / `.sx-btn` / `.btn--primary`).

### Forbidden phrase scan

```
rg -i "everyone is obsessed|smell irresistible|…|chase you" --glob '*.html' --glob '*.js'
→ CLEAN: zero matches in site HTML/JS
```

### Secondary CTA audit note

`.sx-btn` in `site.css` mirrors `.qbtn` in `home.css` — previously undocumented. Now mapped in DESIGN.md (EXP-030 partial).

## Changed files

- DESIGN.md
- about.html, craftsmanship.html, journal.html, shipping.html, store.html, wear.html
- growth/state.json (lock during run)

## Scoring

```bash
npm run growth:score -- --intent 2 --brand 3 --conversion 2 --discoverability 1 --measurement 2 --technical 3 --complexity 0 --risk 0
```

**qualified_growth_score:** 13  
**brand_risk_penalty:** 0

## QA

- `npm run growth:qa` — pass
- AI review: `growth/runs/2026-06-29-monthly_brand_system-EXP-032-ai-review.md`

## Lock footer

`growth/state.json` → `lock_status: unlocked`, `active_experiment_id: null`
