# EILLON Design System

**For humans and coding agents.**  
**Updated:** 2026-06-28

## Brand principles

1. **Memory over marketing** — perfume from place, skin, and recollection
2. **Quiet commerce** — clear CTAs without DTC shouting
3. **Copenhagen precision** — architectural layout, generous whitespace
4. **Afro-Mediterranean atmosphere** — specific, never flattened or exoticized
5. **Close-wearing intimacy** — oil-rich parfums that unfold slowly

## Voice

| Do | Don't |
|---|---|
| Sensory, precise nouns | Hype adjectives, superlatives |
| Short declarative sentences | Influencer cadence |
| Commercial clarity | Fake scarcity, false guarantees |
| "Parfum" / "chapter" / "maison" | "Best seller", "everyone loves" |

### Copy examples (on-brand)

- "Prickly pear, held against mineral air."
- "A green-pink cactus-fruit parfum, built to feel airy, watery, sun-warm, and close to skin."
- "Worn close to the wrist, collarbone, and the hours after."
- "Receive the Beles restock note before the public boutique opens."

### Forbidden copy (grep before ship)

`everyone is obsessed` · `smell irresistible` · `main character` · `luxury vibes` · `dupe` · `compliment getter` · `be unforgettable` · `guaranteed long-lasting` · `seductive` · `exotic` · `oriental` · `ancient secret` · `goddess energy` · `chase you`

## Product truth (Beles · Fico d'India)

Notes direction: prickly pear, cactus water, pear skin, hibiscus, cactus bloom, green leaves, soft musk, mineral air, warm stone.  
Format: oil-rich parfum. Genderless. Current chapter — verify availability via `data/products.js` before any stock language.

## Typography

| Role | Stack | Usage |
|---|---|---|
| Display serif | Cormorant Garamond, Fraunces | Headlines, maison words |
| UI sans | Inter | Eyebrows, buttons, labels |
| Hand | La Belle Aurore | Letters/correspondence only |

Scale: fluid `clamp()` on hero and chapter display type. Avoid shrinking below readable mobile minimums on forms.

## Color & contrast

- Background: `#F3EFE6` (--bg), paper tones
- Ink: `#17150F` (--ink)
- Hero dark: `#060d14` stage with veil gradients
- Maintain WCAG AA for body copy; decorative display type may be large-format only

## Layout rhythm

- Section padding: `clamp()` vertical, `--pad` horizontal on mobile
- Max content width via `--max` / editorial columns
- Homepage: full-bleed hero → pinned narrative sections → letters archive

## Components

### Quiet button `.qbtn`
Uppercase sans, pill radius, ink/paper inversion variant `.qbtn--on-dark`

### Text link `.qlink`
Underline via hover; arrow optional

### Chapter button `.btn--primary`
Label + hover layer; no aggressive pulse animations

### Forms `[data-waitlist-form]`
Email required; honeypot `.shop__honeypot`; status region with `aria-live="polite"`; success copy from `script.js` — keep calm, not celebratory-gimmicky

### Form microcopy rules
- Explain what happens next ("restock note", "letter sent slowly")
- No "Don't miss out!" / countdown unless real and approved
- Beles: size interest optional — copy should clarify sample vs bottle interest without promising dates

## Photography & imagery

- Editorial, human, atmospheric (hero couple, desert road, studio)
- Product: Beles bottle on neutral backgrounds
- No generic stock "perfume splash" clichés
- WebP preferred; explicit dimensions on `<img>`

## Motion

- Homepage GSAP scroll pins: load GSAP before pin init
- CSS marquee for name carousel — stabilize before animating
- Letters: deferred load for performance
- **`prefers-reduced-motion`:** disable marquee, pins, letter animations

## CTA hierarchy

1. **Beles restock** — primary revenue path (`/beles#waitlist`)
2. **The Letter** — relationship (`product_slug=all`)
3. **Studio appointment** — mailto with clear subject
4. **Boutique** — discovery (`/store`)

## Landing page rules

- One primary CTA above fold
- Sensory lede → proof → action
- Internal link to Beles on educational content
- Schema where appropriate (FAQ, Product, Article)

## Campaign page rules

- Store under `content/campaigns/` as markdown kits
- UTM per `growth/utm-system.md`
- Platform-specific hooks; same voice constraints
- No fabricated founder quotes or fake UGC

## SEO content voice

Answer the search question in first 120 words — then maison context.  
Avoid listicle SEO spam. Link to Beles as living example.

## Social / video direction

- Quiet, macro texture (pear skin, stone, glass)
- Captions: short, lowercase-friendly, no hashtag storms
- Video scripts: shot list + supers; optional VO generic only unless founder approves

## Accessibility

- Skip link, semantic landmarks
- Form labels and error states
- `aria-hidden` on decorative carousel
- Proof sections: `data-analytics-section` without blocking a11y tree

## Agent workflow

Edit copy → check forbidden list → verify product truth → run `npm run verify:copy` if lifecycle language touched → score brand_fit in growth experiments.
