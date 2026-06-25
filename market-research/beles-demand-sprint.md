# Beles Proof & Demand Sprint (10–14 days)

Objective: measure whether qualified niche-fragrance buyers understand Beles, trust the house, accept the price architecture, and join the next release.

## Funnel under test

```text
Qualified landing → Beles view → Proof section → Size interest → Form start → Signup
```

## Production URLs (with tracking)

Share one of these entry links in Ballpark or interviews:

- **Homepage path:** `https://eillon.maison/?utm_source=ballpark&utm_medium=study&utm_campaign=beles-proof-sprint`
- **Direct Beles path:** `https://eillon.maison/beles?utm_source=ballpark&utm_medium=study&utm_campaign=beles-proof-sprint#proof`

UTM values are captured in waitlist signups and Vercel Analytics events.

## Analytics events to review (Vercel dashboard)

- `page_view`, `chapter_view`, `proof_section_viewed`
- `size_interest_selected`, `restock_form_started`, `restock_form_submitted`, `restock_form_error`
- `web_vital` (LCP, CLS, INP)

Build the funnel: landing → `/beles` → proof → size → form start → submit.

## Ballpark study

Launch the prepared mobile-first Ballpark study against the URLs above. Target **5–8** niche-fragrance buyers.

After sessions, compare:

1. Ballpark task completion and comprehension scores
2. Vercel funnel drop-off by step
3. Verbatim objections (price, trust, availability language, proof gaps)

Change only the highest-confidence barrier identified — do not expand the site further until behavior data supports it.

## Next demand test (after compliant sample batch)

When a real compliant sample batch exists, run a **small paid sample release** before a full boutique expansion.
