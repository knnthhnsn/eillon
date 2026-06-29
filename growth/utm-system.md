# EILLON UTM System

**Version:** 1.0 · 2026-06-28

## Parameters

Standard five: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

Captured client-side → `sessionStorage` key `eillon_utm` → attached to waitlist API + `EILLON_ANALYTICS` context.

## Allowed values

### utm_source
`instagram` · `pinterest` · `tiktok` · `youtube_shorts` · `reddit` · `newsletter` · `organic_social` · `founder_note` · `search` · `referral` · `cursor_automation_test`

### utm_medium
`social` · `pin` · `video` · `story` · `bio` · `referral` · `email` · `organic` · `campaign`

### utm_campaign
`beles_restock` · `prickly_pear_parfum` · `skin_scent` · `oil_rich_parfum` · `copenhagen_appointments` · `the_letter` · `fico_d_india` · `visual_search` · `private_studio`

### utm_content
- Short lowercase slug describing creative variant
- Examples: `pin-mineral-air`, `reel-pear-skin`, `story-rest-note`, `bio-letter`
- **Never** email, name, user id, or phone

### utm_term
- Optional search keyword slug for paid/organic search tests
- Example: `prickly-pear-perfume`

## Landing page map

| Campaign | Primary destination | Secondary |
|---|---|---|
| beles_restock | `/beles#waitlist` | `/store` |
| prickly_pear_parfum | `/beles` | `/journal/fico-d-india` |
| fico_d_india | `/journal/fico-d-india` | `/beles#waitlist` |
| the_letter | `/about` (newsletter) | `/` footer form |
| copenhagen_appointments | `/about#studio` | `/` `#studio` |
| visual_search | `/beles` | `/journal` |
| skin_scent / oil_rich_parfum | `/beles` | `/wear` |

## Example URLs

```
https://eillon.maison/beles?utm_source=pinterest&utm_medium=pin&utm_campaign=prickly_pear_parfum&utm_content=pin-mineral-air

https://eillon.maison/journal/fico-d-india?utm_source=instagram&utm_medium=story&utm_campaign=fico_d_india&utm_content=story-green-pink

https://eillon.maison/about?utm_source=newsletter&utm_medium=email&utm_campaign=the_letter&utm_content=issue-01-studio-note
```

## Rules

1. Never store personal data in UTMs
2. Document every campaign asset → UTM variant in campaign markdown
3. Review UTM performance weekly (see `/docs/growth-measurement.md`)
4. Test links with `utm_source=cursor_automation_test` only in staging/preview
5. Persisted server-side only via existing waitlist API fields (`utm_source`, `utm_medium`, `utm_campaign`)

## Social asset template

```markdown
## Asset: [name]
- Platform: pinterest
- utm_source: pinterest
- utm_medium: pin
- utm_campaign: prickly_pear_parfum
- utm_content: [slug]
- Landing: /beles#waitlist
- CTA copy: Receive the Beles restock note before the public boutique opens.
```
