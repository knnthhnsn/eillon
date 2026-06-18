# EILLON Design Implementation Plan — 2026-06-18

## Phase 1 — Global design system ✅

| Change | File | Risk |
|--------|------|------|
| Semantic color + type + spacing tokens | `styles.css` `:root` | Low |
| Font alias fix (`--font-sans` → `--sans`) | `styles.css` | Low |
| CSS `v=108` sitewide | All `.html` | Low |
| Script `v=69` sitewide | All `.html` | Low |
| Unified footer links | `store.html`, `journal.html`, chapter pages | Low |

## Phase 2 — Homepage refinement ✅

| Change | File | Risk |
|--------|------|------|
| Palette cards: chapter numbers, hover, token type | `index.html`, `styles.css` | Low |
| Display uses `--text-display-xl` | `styles.css` | Low |

## Phase 3 — Store refinement ✅

| Change | File | Risk |
|--------|------|------|
| Remove duplicate status on link cards | `script.js` | Low |
| Beles lead card styling | `script.js`, `styles.css` | Low |
| Ritual lab card styling | `script.js`, `styles.css` | Low |
| Caption shows chapter + status | `script.js` | Low |
| Status guide 3-column grid | `styles.css` | Low |
| Store hero uses `--content-max` | `styles.css` | Low |

## Phase 4 — Chapter template ✅

| Change | File | Risk |
|--------|------|------|
| Chapter visuals reveal motion | `asmara.html`, `massawa.html`, `ritual.html` | Low |
| Chapter story border-top | `styles.css` | Low |
| Footer imprint on all chapter pages | `*.html` | Low |

## Phase 5 — Journal and legal ✅

| Change | File | Risk |
|--------|------|------|
| Journal index title class (remove inline style) | `journal.html`, `styles.css` | Low |
| Editorial card heading token | `styles.css` | Low |

## Phase 6 — Motion and polish ✅

| Change | File | Risk |
|--------|------|------|
| Palette card hover | `styles.css` | Low |
| Ritual reduced hover lift | `styles.css` | Low |
| Status guide responsive 1-col | `styles.css` | Low |

---

## Test method

1. `python3 scripts/dev-server.py`
2. Verify routes: `/`, `/store`, `/beles`, `/asmara`, `/massawa`, `/ritual`, `/journal`, `/journal/fico-d-india`, `/journal/the-bottle`, `/privacy`, `/terms`, `/imprint`
3. Desktop 1440 + mobile 390 visual check
4. Keyboard: tab through store cards, waitlist forms
5. `prefers-reduced-motion`: no broken layout
6. Compare `design-review/before/` vs `design-review/after/` screenshots

## Screenshots affected

- `store-desktop-1440.png` — card hierarchy, no duplicate status
- `store-mobile-390.png` — caption typography
- `home-desktop-1440.png` — palette numbers
- `ritual-desktop-1440.png` — lab treatment
- `journal-desktop-1440.png` — title class, footer
- `beles-desktop-1440.png` — footer imprint
