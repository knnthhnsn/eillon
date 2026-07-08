# Campaign: Prickly pear, but not candy.

**EXP-ID:** EXP-006  
**Loop:** social_to_letter  
**Date:** 2026-06-29  
**Status:** draft — do not post without human review  
**Automation:** weekly_social_to_letter

## Hypothesis

If we publish a quiet social kit reframing prickly pear as green-pink and mineral (not candy-sweet), then niche fragrance seekers on Pinterest, Instagram, and TikTok will subscribe to The Letter for studio notes and chapter openings, because objection-aware sensory copy matches demand for close-wearing, non-sweet skin scents.

## Campaign angle

**Brand fit:** 5/5 — sensory, precise, memory-led; answers the “too sweet?” objection without hype.

Prickly pear often arrives in perfume as syrup or candy. Beles · Fico d'India holds the fruit against mineral air, pear skin, and warm stone — airy, watery, close to skin. This kit drives relationship first (The Letter), with a secondary path to Beles discovery for high-intent viewers.

## Primary landing

| Destination | URL | Use |
|---|---|---|
| The Letter (primary) | `https://eillon.maison/about#letter` | IG bio, TikTok profile, Pinterest pin destination |
| Beles discovery (secondary) | `https://eillon.maison/beles` | Reels/stories when product context is already on screen |

**Primary CTA copy:** Subscribe to The Letter — studio notes, restock windows, and chapter openings, sent slowly.  
**Secondary CTA copy:** Receive the Beles restock note before the public boutique opens.

---

## Hooks & captions (8)

Use as-is or trim per platform. Lowercase-friendly; no hashtag storms.

1. Prickly pear, but not candy. Green-pink fruit held against mineral air.
2. Fico d'India — cactus water, pear skin, warm stone. Worn close.
3. When fruit reads as syrup, we pull it back to skin and stone.
4. A green-pink chapter. Airy. Watery. Not loud.
5. Oil-rich parfum for wrists and collarbone — slowly unfolding.
6. Copenhagen studio notes on prickly pear, memory, and close-wearing parfum.
7. If you skip sweet fruit scents, read this chapter slowly.
8. The Letter: restock windows and maison notes — one at a time, never rushed.

---

## Platform variants

### Pinterest

**Pin title (≤100 chars):** Prickly pear parfum — green-pink, mineral, close to skin  
**Pin description:** Beles · Fico d'India — prickly pear, cactus water, pear skin, hibiscus, mineral air. Oil-rich parfum from a Copenhagen maison. Subscribe to The Letter for studio notes and chapter openings.  
**Visual direction:** Macro pear skin texture on warm stone; muted green-pink palette; no splash clichés.  
**Board suggestion:** Skin scents · Niche perfume · Prickly pear  
**Link:** Primary landing with UTM (see Asset A)

**Story pin / idea pin copy (short):**  
Not candy. Mineral air. → The Letter

### Instagram

**Feed caption (long):**  
Prickly pear, but not candy.

Beles · Fico d'India holds the fruit against mineral air — pear skin, cactus water, green leaves, warm stone. An oil-rich parfum, genderless, worn close.

Studio notes and chapter openings arrive through The Letter — sent slowly.

Link in bio → about#letter

**Carousel slide supers (if 3 slides):**  
1. Prickly pear, but not candy.  
2. Green-pink · mineral air · close to skin  
3. The Letter — studio notes, sent slowly

**Reel hook (on-screen, 3s):** too sweet? / not this chapter  
**Reel caption (short):** Fico d'India — airy, watery, skin-close. The Letter in bio.

**Story sticker text:** The Letter →  
**Story CTA:** Subscribe on about — one email, maison notes only

### TikTok

**Hook (0–3s VO or text):** POV: you want prickly pear perfume but not dessert  
**Script beats:**  
- Cut 1: thumb on pear skin macro (2s) — text: "not candy"  
- Cut 2: bottle on stone, slow tilt (3s) — text: "mineral air"  
- Cut 3: wrist apply, close crop (2s) — text: "close to skin"  
- End card: "The Letter — link in bio" (2s)

**Caption:** prickly pear parfum without the sugar rush · Beles · Fico d'India · link in bio for The Letter  
**Comment pin (optional):** Studio notes + restock windows → eillon.maison/about#letter

---

## UTM plan

All links use standard five parameters per `/growth/utm-system.md`. No PII in `utm_content`.

| Asset | Platform | utm_source | utm_medium | utm_campaign | utm_content | Landing |
|---|---|---|---|---|---|---|
| A — Pin mineral air | Pinterest | pinterest | pin | the_letter | pin-mineral-air-not-candy | /about#letter |
| B — Pin green-pink board | Pinterest | pinterest | pin | prickly_pear_parfum | pin-green-pink-chapter | /beles |
| C — Feed carousel | Instagram | instagram | social | the_letter | feed-not-candy-carousel | /about#letter |
| D — Reel pear skin | Instagram | instagram | video | the_letter | reel-pear-skin-mineral | /about#letter |
| E — Story rest note | Instagram | instagram | story | the_letter | story-letter-studio-note | /about#letter |
| F — Bio link | Instagram | instagram | bio | the_letter | bio-letter-not-candy | /about#letter |
| G — TikTok mineral reel | TikTok | tiktok | video | the_letter | reel-not-candy-hook | /about#letter |
| H — TikTok Beles discovery | TikTok | tiktok | video | prickly_pear_parfum | reel-beles-chapter-tease | /beles |
| I — Referral share | referral | referral | referral | the_letter | share-not-candy-kit | /about#letter |

### Example URLs

```
https://eillon.maison/about?utm_source=pinterest&utm_medium=pin&utm_campaign=the_letter&utm_content=pin-mineral-air-not-candy#letter

https://eillon.maison/about?utm_source=instagram&utm_medium=video&utm_campaign=the_letter&utm_content=reel-pear-skin-mineral#letter

https://eillon.maison/beles?utm_source=tiktok&utm_medium=video&utm_campaign=prickly_pear_parfum&utm_content=reel-beles-chapter-tease
```

### Measurement

- Review UTM-tagged sessions in Vercel WA (production) weekly per `/docs/growth-measurement.md`
- Success signal: `newsletter` source submits with `product_slug=all` from social UTMs
- Secondary: `/beles` visits from `prickly_pear_parfum` campaign → restock form starts
- Do **not** use `utm_source=cursor_automation_test` on live links

---

## Optional shot list

No founder VO unless approved. Generic ambient or text-only supers.

| Shot | Duration | Visual | Audio |
|---|---|---|---|
| 1 | 2s | Macro pear skin, side light | Room tone or silence |
| 2 | 3s | Cactus pad dew / green leaf texture | Soft ambient |
| 3 | 2s | Beles bottle on warm stone surface | Silence |
| 4 | 2s | Wrist apply, close crop | Silence |
| 5 | 2s | Copenhagen studio window light (existing editorial) | Silence |
| 6 | 2s | End card: "The Letter" + URL text | Silence |

**Avoid:** perfume splash, influencer reaction faces, "POV main character" framing, fake UGC testimonials.

---

## Brand safety checklist

- [x] No forbidden phrases (DESIGN.md scan)
- [x] No false stock, restock dates, or guarantees
- [x] No influencer-coded language or fake testimonials
- [x] Beles notes align with `beles.html` / product truth
- [x] UTMs contain no PII
- [x] Draft only — human posts off-repo

## Related backlog

- EXP-009 — Pinterest visual search pack (extends Asset A/B)
- EXP-007 — Newsletter distinct analytics events (improves measurement)
