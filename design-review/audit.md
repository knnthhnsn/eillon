# EILLON Visual Design Audit

**Date:** 2026-06-18  
**Branch:** `design-review-eillon-2026-06-18`  
**Baseline commit:** `d278635`  
**Screenshots:** `design-review/before/`

## Method

- Full local codebase review across all routes
- 104 baseline screenshots at 8 viewports x 12 pages (+ homepage sections)
- Live site reference: https://eillon.maison/
- External ChatGPT Pro review **not available** in cloud agent environment

---

## Critical issues (score 20-25)

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| Store | All | Boutique product cards | Duplicate status labels (image-label + caption overlay) | 22 | store-desktop-1440.png | Skip image-label in store card JS; caption-only | Shared | Low |
| Store | All | Product grid | Beles not visually distinguished as lead chapter | 21 | store-desktop-1440.png | Full-width lead row, refined shadow/border | Page | Low |
| Global | All | CSS tokens | --font-sans / --font-serif referenced but undefined | 20 | N/A | Add aliases in :root | Global | Low |

## High priority (score 16-19)

| Page | Viewport | Component | Problem | Severity | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|----------|-------|------|
| Store | All | Ritual card | Reads like standard ecommerce card | 19 | Desaturated veil, uppercase lab hint | Shared | Low |
| Homepage | All | Maison palette | Generic four-card grid | 18 | Chapter index labels, border-led cards | Page | Low |
| Store | Desktop | Status guide | 3 items in 2-column grid | 17 | 3-column grid desktop | Page | Low |
| Global | All | Navigation | Restock CTA too prominent | 17 | Quieter muted pill | Global | Low |
| Store | All | Collection panel | Missing tonal scrim on video | 16 | Store-specific gradient scrim | Page | Low |

## Strongest existing elements

- Homepage hero cinematic quality and veil loader
- Chapter page shared shop--chapter template
- Editorial typography pairing (Fraunces + Inter)
- Red Sea collection video integration
- Restrained out-of-stock language

## Weakest existing elements

- Boutique card duplicate labeling
- Generic card shadows
- Palette section lacking editorial hierarchy
- Inconsistent CSS token naming
- Navigation CTA visual weight
