# Elli Hansen — Asmara

A quiet-luxury, editorial single-page website built around the Asmara flacon.

## Structure

```
.
├── index.html        Page structure & content
├── styles.css        Palette, typography, layout, motion
├── script.js         Reveal animations, parallax, shop logic
└── perfume-bottle.png  Hero & product image
```

## Run locally

The site is **fully static** — no build step required.

### Easiest

Just open `index.html` in your browser (double-click). Google Fonts will load over the network.

### Recommended (for clean local URLs)

From the project folder, run any one of these:

```powershell
# Python (preinstalled on most systems)
python -m http.server 8000

# Node (no install)
npx serve .

# PHP
php -S localhost:8000
```

Then open <http://localhost:8000>.

## Design notes

- **Palette** — warm ivory, soft cream, sand, champagne gold, warm ink. No black/gold cliché.
- **Typography** — `Fraunces` (variable serif, optical sizing) for editorial display, `Inter` for body. Italic Fraunces for accents.
- **Composition** — generous whitespace, edge-positioned metadata, sculpted product framing.
- **Motion** — soft fades on scroll (`IntersectionObserver`), gentle bottle parallax, subtle pointer-driven micro-tilt on hero (only on fine pointer devices), smooth nav background on scroll. Honors `prefers-reduced-motion`.
- **Sections** — Nav · Hero · Editorial line · Story · Notes · The Bottle (craft) · Mood · Press quote · Boutique · Footer.

## Customisation

- Adjust palette tokens in `:root` at the top of `styles.css`.
- Swap `perfume-bottle.png` with a higher-resolution master if available; the layout is built around its native aspect ratio.
- Sizes / prices live as `data-*` attributes on the `.size` buttons in `index.html`.
