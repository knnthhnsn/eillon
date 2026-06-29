# EILLON Growth Measurement

**Updated:** 2026-06-28

## Primary KPIs

| KPI | Definition | Source |
|---|---|---|
| Qualified sessions | Sessions with UTM or organic landing on beles/journal/campaign | Vercel WA |
| Restock signup rate | `restock_form_submitted` / form views | WA + Neon DB |
| Letter signup rate | waitlist API `product_slug=all` / form views | DB |
| Appointment intent | `studio_appointment_click` | WA |
| Organic discovery | Impressions, clicks, CTR | Search Console (manual) |
| Journal → Beles | Click path (needs EXP-035 event) | WA |

## Conversion definitions

- **Restock conversion:** successful POST `/api/waitlist` with `product_slug=beles`
- **Letter conversion:** successful POST with `product_slug=all`
- **Appointment:** mailto click (proxy, not booking)

## Event catalog (implemented)

| Event | File |
|---|---|
| `page_view` | analytics.js |
| `chapter_view` | analytics.js |
| `proof_section_viewed` | analytics.js |
| `web_vital` | analytics.js |
| `homepage_primary_cta_click` | analytics.js |
| `studio_appointment_click` | analytics.js |
| `size_interest_selected` | script.js |
| `restock_form_started` | script.js |
| `restock_form_submitted` | script.js |
| `restock_form_error` | script.js |

## Event wishlist (document before implement)

`newsletter_form_view` · `newsletter_signup_submit` · `beles_cta_click` · `journal_to_beles_click` · `campaign_landing_cta_click` · `faq_expand` · `private_appointment_view`

## UTM review rhythm

- Weekly: top 5 `utm_campaign` by sessions
- Monthly: add/remove variants in `growth/utm-system.md`
- Never put PII in utm_content

## Success windows

| Window | Read |
|---|---|
| 7 days | CTR, initial signups, crawl/index status |
| 30 days | Restock rate delta vs baseline, organic impressions trend |
| 90 days | Keep/discard experiment pattern; scale content cluster |

## Privacy

- Vercel WA only in production
- No email in client events
- GDPR: privacy.html is source of truth
- DB holds emails server-side — not for agent export

## Weekly review template

```markdown
## Week of YYYY-MM-DD
- Organic: 
- Restock submits (beles): 
- Letter submits: 
- Top UTM: 
- Experiments shipped: 
- Next: 
```

## Dashboard wishlist

- Vercel WA custom events dashboard
- Neon SQL view: signups by source/utm/week
- Search Console API → growth/runs/ (future)
