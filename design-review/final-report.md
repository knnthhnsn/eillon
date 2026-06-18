# EILLON Design Review — Final Report

**Date:** 2026-06-18  
**Branch:** `design-review-eillon-2026-06-18`  
**Commits:** `cfd2921` (checkpoint) → `d352648` (design refinement)

---

## Overall findings

### Strongest parts of original design
- Cinematic homepage hero with veil loader and bottle video
- Coherent maison narrative (editorial homepage vs boutique store)
- Chapter pages share a strong `shop--chapter` atmospheric template
- Fraunces + Inter typography pairing feels niche and intentional
- Out-of-stock language is honest and on-brand

### Weakest parts
- Boutique product cards showed duplicate status labels (badge + caption)
- Beles did not read as the lead chapter in the store grid
- Ritual card looked like a standard product, not an archival lab study
- Maison palette section felt like a generic four-card SaaS grid
- Undefined CSS variables (`--font-sans`, `--font-serif`) broke caption typography
- Navigation Restock CTA competed with primary links

### Biggest inconsistencies
- Card shadows and glass panels vs border-led editorial elsewhere
- Status guide 2-column layout with 3 items
- Journal page inline styles vs token-based system
- Legal page width (680px) vs editorial content (720px)

---

## External design-review findings

**ChatGPT Pro review:** Not executed (no browser access to ChatGPT in cloud agent).

| Suggestion | Decision | Reasoning |
|------------|----------|-----------|
| Boutique card duplicate labels | **Accepted** | Clear usability and visual noise issue |
| Beles lead distinction | **Accepted** | Brand requires first chapter prominence |
| Ritual archival differentiation | **Accepted** | Prevents false commerce signal |
| Palette editorial numbering | **Accepted** | Low risk, strengthens narrative |
| Complete rebrand | **Rejected** | Against brief |
| Per-chapter color theming | **Rejected** | Theme-park risk |
| Remove pill buttons | **Rejected** | Established brand pattern |
| Add contact page | **Rejected** | Out of scope |

---

## Design-system changes

- **Colors:** Semantic aliases (`--color-canvas`, `--color-ink`, scent accents)
- **Type:** `--text-display-xl` through `--text-caption` scale
- **Spacing:** `--space-1` through `--space-8`, `--space-section`
- **Layout:** `--content-max`, `--text-max`, `--page-gutter`, `--grid-gap`
- **Buttons:** Unchanged shapes; nav Restock quieted
- **Forms:** Underline focus border transition
- **Motion:** `--duration-reveal`, `--duration-fast`, `--duration-editorial`

---

## Page improvements

| Page | Changes | Expected effect |
|------|---------|-----------------|
| `/` | Palette chapter indices, border-led cards | More editorial, less template |
| `/store` | Beles lead row, Ritual archival, scrim, status guide 3-col, caption-only labels | Clear hierarchy, readable over video |
| `/beles` | Inherited form focus + gutter tokens | Consistent with system |
| `/asmara`, `/massawa`, `/ritual` | Chapter story italic + text-max | Cohesive memory sections |
| `/journal` | Removed inline styles | Matches design tokens |
| Legal pages | `--content-max` alignment | Consistent reading width |

---

## Component improvements

- **Navigation:** Quieter Restock pill (muted color, softer border)
- **Product cards:** No default shadow; hover translate only; boutique caption typography fixed
- **Chapter heroes:** Unchanged structure (already strong)
- **Forms:** Visible focus on waitlist fields
- **Palette cards:** Chapter index eyebrows, hover lift
- **Store scrim:** Gradient over Red Sea video for card legibility

---

## Responsive improvements

- **Desktop:** Beles full-width lead card in 2-column boutique grid; 3-column status guide
- **Tablet:** Status guide collapses to 1 column at 900px
- **Mobile:** Boutique 2-column grid preserved; tighter gaps; captions remain readable

---

## Before/after references

104 screenshot pairs captured locally:

- **Before:** `design-review/before/`
- **After:** `design-review/after/`

Key comparison files:
- `home-desktop-1440.png`, `home-palette-desktop-1440.png`
- `store-desktop-1440.png`, `store-mobile-390.png`
- `beles-mobile-390.png`, `ritual-desktop-1440.png`
- `journal-desktop-1440.png`

(Screenshots excluded from git — 74MB per set. Regenerate with `npm run screenshots`.)

---

## Remaining concerns

- Asset quality for Asmara/Massawa scent images (content, not CSS)
- Live deployment cache may need CSS `?v=` bump on HTML files
- ChatGPT external review not performed — human visual pass recommended
- Beles full-width card on mobile adds vertical length (acceptable for lead product)

---

## Deployment readiness

**Ready with minor manual checks**

- All 12 routes return 200 locally
- Waitlist functionality preserved (no form logic changed)
- Reduced-motion behavior preserved
- Recommended before deploy: visual pass on `/store` at 390px and 1440px; verify cache bust on `styles.css`
