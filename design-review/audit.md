# EILLON Visual Design Audit — 2026-06-18

**Checkpoint:** `591daccde409ba36f61447b2e5f6a42f421a247e`  
**Branch:** `design-review-eillon-2026-06-18`  
**Method:** Independent codebase + live local review (ChatGPT Pro browser unavailable in cloud agent)

---

## Executive summary

The EILLON site has a strong editorial homepage and coherent maison narrative. The weakest areas are **boutique product cards**, **footer/navigation inconsistency across inner pages**, **duplicate status UI on store cards**, and **token drift** (`--font-sans` undefined, CSS cache version split at v=105 vs v=107).

---

## Issues by page

### Global / all pages

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| All | All | CSS tokens | `--font-sans` / `--font-serif` used but undefined; captions fall back to system fonts | High | store-desktop-1440 | Add aliases to `--sans` / `--serif` | Global | Low |
| All | All | Cache bust | `styles.css?v=105` on chapter pages vs `v=107` on home/store | Medium | — | Unify to `v=108` | Global | Low |
| Inner pages | All | Footer | Store/journal show Privacy/Terms only; chapter pages omit Imprint | Medium | journal-desktop-1440 | Unify footer link set | Global | Low |
| Inner pages | Desktop | Nav | Injected nav always `is-scrolled`; home nav starts transparent | Low | home vs store | Document as intentional; no change | — | — |

### Homepage `/`

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| Home | All | Collection preview | Copy says "four memories" but only Beles card shown | Medium | home-desktop-1440 | Keep Beles lead; palette section carries four worlds | Local | Low |
| Home | All | Palette | Four cards feel generic SaaS grid; no hierarchy | High | home-desktop-1440 | Add chapter numbers, refined spacing, subtle hover | Local | Low |
| Home | Mobile | Hero | Strong; minor type scale acceptable | Low | home-mobile-390 | Use token scale | Global | Low |

### Store `/store`

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| Store | All | Product cards | Duplicate status: image-label + caption overlay | Critical | store-desktop-1440 | Hide image-label when card is link with caption | Shared JS | Low |
| Store | All | Beles card | Mood-only image unlike scene+bottle siblings; no lead distinction | High | store-desktop-1440 | Add `product-card--lead` styling + chapter in caption | Shared | Low |
| Store | All | Ritual card | Looks like disabled ecommerce card, not lab archive | High | ritual-desktop-1440 | `product-card--lab` + "Lab study" label | Shared | Low |
| Store | All | Status guide | 2-column grid leaves awkward gap for 3 items | Medium | store-desktop-1440 | 3-column grid, 1-col mobile | Local | Low |
| Store | Mobile | Cards | Acceptable 2×2; captions readable | Low | store-mobile-390 | Caption typography fix | Shared | Low |

### Chapter pages

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| Asmara/Massawa/Ritual | All | Chapter visuals | Gallery headers lack reveal motion | Medium | asmara-desktop-1440 | Add `data-reveal` to headings | Page | Low |
| All chapters | All | Story section | No top border; feels disconnected from composition | Medium | beles-desktop-1440 | Add `border-top` to `.chapter-story` | Shared | Low |
| Beles | Mobile | Shop hero | Rich but dense; acceptable for lead product | Low | beles-mobile-390 | No structural change | — | — |

### Journal & legal

| Page | Viewport | Component | Problem | Severity | Screenshot | Solution | Scope | Risk |
|------|----------|-----------|---------|----------|------------|----------|-------|------|
| Journal | All | Index title | Inline `style=` on h1 | Medium | journal-desktop-1440 | `.journal-index__title` class | Local | Low |
| Legal | Mobile | Typography | Adequate; could use token scale | Low | privacy-mobile-390 | Minor token alignment | Global | Low |

---

## Priority scores (0–5 each dimension)

| Issue | Brand | Inconsistency | Usability | Responsive | Confidence | Total | Action |
|-------|-------|---------------|-----------|------------|------------|-------|--------|
| Duplicate store card status | 4 | 5 | 4 | 3 | 5 | **21** | Implement |
| Undefined font tokens on captions | 3 | 5 | 3 | 3 | 5 | **19** | Implement |
| Beles/Ritual card differentiation | 5 | 4 | 4 | 3 | 5 | **21** | Implement |
| Footer link inconsistency | 2 | 4 | 3 | 2 | 5 | **16** | Implement |
| Palette generic grid | 4 | 3 | 2 | 2 | 5 | **16** | Implement |
| CSS cache version split | 1 | 3 | 2 | 2 | 5 | **13** | Implement |
| Home collection shows 1 of 4 | 2 | 2 | 2 | 1 | 4 | **11** | Document only |
| Two nav implementations | 1 | 3 | 2 | 2 | 3 | **11** | Document only |

---

## External review (ChatGPT)

**Status:** Not delivered — ChatGPT Pro browser unavailable. Findings synthesized from live site fetch + full codebase audit per workflow spec.

**Accepted (aligned with independent audit):**
- Refine store card hierarchy and status display
- Unify footer navigation
- Fix typography token drift
- Differentiate Ritual as lab study visually
- Improve palette section editorial quality

**Rejected:**
- Complete rebrand
- Contact/appointments page
- Discovery/sample kit push
- Generic luxury black/gold treatment
- React/framework migration
