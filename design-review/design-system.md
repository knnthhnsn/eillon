# EILLON Design System — 2026-06-18

Consolidated from the strongest existing homepage patterns. Not a rebrand — a refinement layer.

---

## Color tokens

```css
--color-canvas:      #FAFAF8   /* page background */
--color-paper:       #FFFFFF   /* cards, panels */
--color-stone-light: #ECECEA   /* soft panels */
--color-stone:       #6E6E68   /* muted text accents */
--color-ink:         #1C1C1A   /* primary text */
--color-ink-soft:    #3A3A36   /* body secondary */
--color-muted:       #6E6E66   /* labels, captions */
--color-line:        rgba(28, 28, 26, 0.12)
--color-silver:      #A8A8A2   /* metal accent reference */
--color-sand:        #D4C8B8   /* warm neutral accent */
--color-blush:       #E8C4B8   /* Beles world accent */
--color-sea:         #8BA4A8   /* Massawa accent */
--color-resin:       #8E7349   /* Ritual / gold-dark */
```

Legacy aliases preserved: `--bg`, `--ink`, `--gold`, `--line`, etc.

**Rule:** Scent-specific colors are caption/accent only — never full page themes.

---

## Typography scale

```css
--text-display-xl:  clamp(40px, 6vw, 88px)   /* hero, maison */
--text-display-lg:  clamp(32px, 4.5vw, 56px)  /* chapter visuals, journal */
--text-heading-lg:  clamp(28px, 3.5vw, 40px)
--text-heading-md:  clamp(22px, 2.6vw, 32px) /* palette cards */
--text-heading-sm:  clamp(18px, 2vw, 24px)    /* editorial cards */
--text-body-lg:     clamp(17px, 1.6vw, 19px)
--text-body:        16px
--text-body-sm:     14px
--text-label:       11px
--text-caption:     10px
```

**Families:** `--serif` (Fraunces) for display/editorial; `--sans` (Inter) for UI/labels.

**Rule:** Max 10 practical type levels. Body copy capped at `--text-max` (58ch).

---

## Spacing scale

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  48px
--space-8:  64px
--space-section: clamp(72px, 10vw, 120px)
```

---

## Layout

```css
--page-max:     1480px
--content-max:  720px
--text-max:     58ch
--page-gutter:  clamp(20px, 3vw, 48px)
--section-block:var(--space-section)
--grid-gap:     clamp(18px, 2vw, 28px)
```

---

## Motion

| Token | Value | Use |
|-------|-------|-----|
| `--ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Default transitions |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals |
| `--duration-fast` | 0.35s | Hover, focus |
| `--duration-reveal` | 0.75s | Scroll reveals |
| `--duration-slow` | 1.2s | Editorial video fades |

**Rule:** One ease family sitewide. `prefers-reduced-motion` disables continuous effects only.

---

## Component principles

### Navigation
- Light, precise, uppercase tracked links
- Waitlist CTA: ghost pill, never overpowering
- Current page: subtle underline via `aria-current`

### Buttons
- **Primary:** ink fill slide on hover; uppercase tracked
- **Ghost:** border only; for secondary paths
- **Text link:** `link-arrow` with animated gap
- Radius: pill (`999px`) for CTAs only — not cards

### Product cards (boutique)
- Image-first, 4:5 aspect ratio
- Status integrated in bottom gradient caption
- Beles = lead (`product-card--lead`): warm border accent
- Ritual = lab (`product-card--lab`): muted veil, reduced hover lift
- No inline forms on store grid cards

### Forms
- Underline field style (no boxes)
- Serif italic placeholders
- Calm error/success in serif italic
- `btn--block` for chapter waitlist CTAs

### Chapter heroes
- Scene + bottle composite (chapters) or layered video (Beles)
- Shared `shop--chapter` grid
- Scent variation via imagery only

### Footers
- Unified: About · Craft · Shipping · Privacy · Terms · Imprint
- Uppercase tracked, `--ink-faint`

### Status badges
- Typography-integrated, not pill badges
- "Lab study" for Ritual — never "Out of stock" alone on lab card

---

## CSS cache

All pages: `styles.css?v=108`, `script.js?v=69`
