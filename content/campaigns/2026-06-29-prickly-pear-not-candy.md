# Campaign: Prickly pear, but not candy

**EXP ID:** EXP-006  
**Date:** 2026-06-29  
**Loop:** social_to_letter  
**Automation:** weekly_social_to_letter  
**Status:** draft — do not post without human review

## Hypothesis

If we publish a social kit that names the prickly-pear-as-candy objection and answers it with green-pink, mineral Beles language, then sensory-curious social visitors will subscribe to The Letter or discover Beles, because the angle matches niche buyer hesitation and EILLON voice.

## Campaign angle

Most prickly pear perfumes read sweet and synthetic. Beles · Fico d'India does not: cactus water, pear skin, hibiscus, mineral air, warm stone — airy, close-wearing, composed in Copenhagen. The post holds the fruit against stone, not syrup.

**Brand fit:** 3 — quiet, sensory, memory-led, objection-aware without shouting.

## Primary destination

| Path | URL | CTA |
|---|---|---|
| **The Letter** (primary) | `https://eillon.maison/about#letter` | Subscribe — studio notes, sent slowly |
| **Beles discovery** (secondary) | `https://eillon.maison/beles` | Join the Beles restock list |

## UTM plan

Base rules per `/growth/utm-system.md`. No PII in any parameter.

### Path A — The Letter (social_to_letter)

| Platform | utm_source | utm_medium | utm_campaign | utm_content |
|---|---|---|---|---|
| Pinterest | pinterest | pin | the_letter | pin-not-candy-stone |
| Instagram feed | instagram | social | the_letter | feed-pear-skin |
| Instagram story | instagram | story | the_letter | story-green-pink |
| Instagram bio | instagram | bio | the_letter | bio-letter-slow |
| TikTok | tiktok | video | the_letter | reel-mineral-air |

**Example (Pinterest):**

```
https://eillon.maison/about?utm_source=pinterest&utm_medium=pin&utm_campaign=the_letter&utm_content=pin-not-candy-stone#letter
```

**Example (Instagram story):**

```
https://eillon.maison/about?utm_source=instagram&utm_medium=story&utm_campaign=the_letter&utm_content=story-green-pink#letter
```

### Path B — Beles discovery (high-intent variant)

| Platform | utm_source | utm_medium | utm_campaign | utm_content |
|---|---|---|---|---|
| Pinterest | pinterest | pin | prickly_pear_parfum | pin-cactus-water |
| Instagram feed | instagram | social | prickly_pear_parfum | feed-fico-d-india |
| TikTok | tiktok | video | prickly_pear_parfum | reel-skin-close |

**Example (TikTok → Beles):**

```
https://eillon.maison/beles?utm_source=tiktok&utm_medium=video&utm_campaign=prickly_pear_parfum&utm_content=reel-skin-close#waitlist
```

## Hooks & captions (8)

Shared voice: short, declarative, sensory. Lowercase-friendly. No hashtag storms.

1. **Prickly pear, but not candy.** Green-pink fruit, cactus water, mineral air — held close to skin.
2. **Fico d'India without the syrup.** Pear skin, hibiscus, warm stone. Composed in Copenhagen.
3. **Most prickly pear perfumes go sweet.** Beles goes airy — watery fruit, soft musk, desert stone.
4. **The fruit is sun-warmed. The finish is mineral.** An oil-rich parfum that wears close.
5. **Cactus water, not candy gloss.** A chapter for wrists, collarbone, and the hours after.
6. **Green-pink. Not gourmand.** Prickly pear held against mineral air.
7. **If you skip fruit scents for being too sweet** — try one built on pear skin and stone.
8. **Studio notes on prickly pear, restock windows, and chapter openings** — one letter at a time.

## Platform variants

### Pinterest

**Pin title:** Prickly pear, but not candy · Beles · Fico d'India  
**Pin description:** Most prickly pear perfumes read sweet. Beles · Fico d'India is green-pink and mineral — cactus water, pear skin, hibiscus, warm stone. Oil-rich parfum composed in Copenhagen. Subscribe to The Letter for studio notes, or discover Beles.  
**Visual:** Macro pear skin on warm stone; or Beles bottle on sandstone neutral.  
**Link:** Path A — `pin-not-candy-stone`  
**Alt pin:** Cactus pad with fruit, mineral aqua palette — Path B `pin-cactus-water`

### Instagram

**Feed caption (Path A — Letter):**

```
prickly pear, but not candy.

green-pink fruit. cactus water. mineral air.
composed in copenhagen — worn close to skin.

the letter: studio notes, restock windows, chapter openings.
sent slowly → link in bio
```

**Feed caption (Path B — Beles):**

```
fico d'india without the syrup.

pear skin · hibiscus · warm stone
an oil-rich prickly pear parfum — airy, watery, close-wearing.

beles · fico d'india — restock list in bio
```

**Story frames (3-card sequence):**

1. Text on pear-skin texture: "prickly pear, but not candy."
2. Text on stone/mineral background: "cactus water · mineral air · warm stone"
3. Sticker/link: "the letter → studio notes, sent slowly" → Path A story UTM

**Bio line (optional swap):** `Prickly pear without the syrup → The Letter`

### TikTok

**Hook (on-screen, 0–2s):** "prickly pear perfumes are usually candy sweet."  
**Body (3–8s):** Slow macro: pear skin, water droplet on cactus pad, cut to Beles bottle on neutral stone.  
**Supers:** `not candy · cactus water · mineral air · copenhagen`  
**End card:** "the letter — link in bio" (Path A) or "beles restock list" (Path B)  
**Caption:** green-pink fruit against stone. fico d'india, composed slow. no syrup.  
**Duration:** 12–18s, no trending audio required — ambient room tone or silence preferred.

## Shot list (optional)

| # | Shot | Use | Notes |
|---|---|---|---|
| 1 | Macro pear skin, side light | Pin, Reel opener | Warm, not glossy |
| 2 | Cactus pad with single fruit | Pin, Story card 1 | Green-pink palette |
| 3 | Water droplet on pear skin | Reel transition | Slow pour, no splash cliché |
| 4 | Beles bottle on sandstone | Feed, end card | Neutral background per DESIGN.md |
| 5 | Wrist apply, close crop | Reel mid | Collarbone/wrist only — no face required |
| 6 | Mineral stone surface, empty | Story card 2 | Text overlay friendly |
| 7 | Studio flat lay: bottle + paper letter edge | Letter CTA variant | La Belle Aurore accent optional |

No founder VO. No fake UGC or testimonial quotes.

## CTA copy (on-brand)

- **The Letter:** "Subscribe — studio notes, sent slowly."
- **Beles:** "Join the Beles restock list — we write when bottles return."
- **Do not use:** scarcity countdown, "don't miss out", guaranteed longevity, influencer cadence.

## Measurement

- **7d:** UTM-tagged sessions to `/about#letter` and `/beles`; newsletter form starts (`product_slug=all`).
- **30d:** Letter submit rate vs organic baseline; Beles restock form rate from `prickly_pear_parfum` campaign.
- **Review:** `/docs/growth-measurement.md` — compare `utm_campaign=the_letter` content slugs.

## Brand safety checklist

- [x] No forbidden phrases (DESIGN.md)
- [x] No false stock, restock dates, or testimonials
- [x] Notes align with `data/products.js` / `beles.html`
- [x] UTM slugs contain no PII
- [x] Draft only — human posts off-repo

## Related assets

- `/beles` — product truth
- `/journal/fico-d-india` — education link for caption comments
- `/journal/what-does-fico-d-india-smell-like` — smell-intent support
- `/prickly-pear-parfum` — discovery landing (optional bio alternate)
