# EILLON Design Review — Final Report

**Date:** 2026-06-18  
**Branch:** `design-review-eillon-2026-06-18`  
**Checkpoint:** `591daccde409ba36f61447b2e5f6a42f421a247e`  
**Commit:** `5914bac`

---

## Overall findings

### Strongest parts of original design
- Homepage hero, model showcase, and cinematic Red Sea collection panel
- Editorial typography (Fraunces + Inter) and restrained color palette
- Beles chapter page depth (sizes, accord profile, composition)
- Clear maison vs boutique information architecture
- Quiet-luxury copy tone without generic clichés

### Weakest parts
- Boutique product cards: duplicate status UI, undifferentiated Beles/Ritual
- `--font-sans` / `--font-serif` undefined on store captions
- Footer link sets inconsistent across pages
- Maison palette section felt like a generic four-card SaaS grid
- CSS cache version split (v=105 vs v=107) risking stale styles

### Biggest inconsistencies
- Store card visual language (Beles mood-only vs scene+bottle siblings)
- Footer patterns (3 variants)
- Status labeling (Ritual same as purchasable chapters)

---

## External design-review findings

| Suggestion | Decision | Reasoning |
|------------|----------|-----------|
| Refine store card hierarchy | **Accepted** | Critical for boutique credibility |
| Differentiate Ritual as lab | **Accepted** | Prevents false commerce signal |
| Unify footer | **Accepted** | Low risk, improves cohesion |
| Fix caption typography tokens | **Accepted** | Visible quality regression |
| Add contact page | **Rejected** | Brand rule; studio mailto sufficient |
| Discovery/sample kit | **Rejected** | Not in product scope |
| Full rebrand / black-gold | **Rejected** | Damages existing identity |
| Show all 4 cards in home collection | **Rejected** | Beles lead positioning intentional; palette covers four worlds |

---

## Design-system changes

| Area | Change |
|------|--------|
| Colors | Semantic aliases (`--color-canvas`, `--color-ink`, scent accents) |
| Type | 10-level scale with `clamp()`; display uses tokens |
| Spacing | `--space-1` through `--space-8`, `--space-section` |
| Layout | `--content-max`, `--text-max`, `--grid-gap` |
| Buttons | Unchanged shapes; token-aligned spacing |
| Forms | Existing underline style preserved |
| Motion | `--duration-fast/reveal/slow` documented |

---

## Page improvements

| Page | Changes | Expected effect |
|------|---------|-----------------|
| **Home** | Palette numbered cards, hover, token type | Less generic grid; clearer scent-world sequence |
| **Store** | Lead/lab cards, single caption status, 3-col guide, footer | Boutique feels finished; Beles leads; Ritual reads archival |
| **Beles** | Footer imprint, CSS v=108 | Consistent shell with siblings |
| **Asmara/Massawa/Ritual** | Visuals reveal, story border, footer | Shared chapter family |
| **Journal** | Title class, unified footer | Removes inline style hack |
| **Legal** | CSS v=108 | Cache consistency |

---

## Component improvements

| Component | Change |
|-----------|--------|
| Navigation | No structural change (documented dual implementation) |
| Product cards | `--lead` / `--lab` modifiers; caption shows chapter |
| Chapter heroes | Unchanged structure; visuals gain reveal |
| Forms | Unchanged; existing system adequate |
| Footers | Unified six-link pattern |
| Buttons | Store hero primary spacing tweak |

---

## Responsive improvements

| Viewport | Improvement |
|----------|-------------|
| Desktop | Store card hierarchy clearer; status guide balanced |
| Tablet | Status guide collapses to 1 column at 900px |
| Mobile | Caption typography fixed; palette single column preserved |

---

## Before/after references

| Pair | Primary change visible |
|------|------------------------|
| `before/store-desktop-1440.png` → `after/store-desktop-1440.png` | Single caption, Beles border, Ritual muted |
| `before/store-mobile-390.png` → `after/store-mobile-390.png` | Caption fonts, chapter labels |
| `before/home-desktop-1440.png` → `after/home-desktop-1440.png` | Palette 01–04 numbers |
| `before/ritual-desktop-1440.png` → `after/ritual-desktop-1440.png` | "Lab study" label |
| `before/journal-desktop-1440.png` → `after/journal-desktop-1440.png` | Full footer links |

---

## Remaining concerns

- Home collection preview still shows Beles only (intentional; copy could be refined in content pass)
- Two nav implementations (home inline vs injected) — functional but not visually identical
- Beles store card still mood-only vs scene+bottle for other chapters — acceptable lead treatment
- Orphan CSS: `.cart-panel`, `.store-updates` — no HTML consumers; safe to remove in future cleanup
- Asset quality (some bottle composites) — needs human art-direction review
- ChatGPT Pro external review not executed — independent audit used instead

---

## Deployment readiness

**Ready with minor manual checks**

Before deploy:
1. Review `design-review/before/` vs `design-review/after/` screenshot pairs
2. Spot-check live waitlist forms on Beles + one chapter page
3. Verify store grid on iOS Safari (caption legibility over video)
4. Confirm no console errors on `/store` product grid render

---

## Files changed

- `styles.css` — tokens, palette, store cards, status guide, journal, chapter story
- `script.js` — store card caption, duplicate status fix, lead/lab classes
- `index.html` — palette data-num, CSS v=108
- `store.html`, `journal.html`, chapter pages — footer, CSS v=108
- All other HTML — CSS/script cache versions
- `design-review/*` — audit, design-system, implementation-plan, screenshots
- `scripts/capture-key-screenshots.sh` — screenshot tooling
