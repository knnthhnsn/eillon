# EILLON AEO playbook

Answer Engine Optimization at EILLON means **visible answers first, schema second** — filed like a house index or provenance ledger, never generic SEO blocks or AI-only hidden text.

## Principles

1. **Visible answers** — every canonical answer appears in an `.answer-ledger` block on at least one public page.
2. **Schema follows text** — JSON-LD is generated from `data/answers.mjs` only where matching visible copy exists.
3. **Lifecycle truth** — chapter status always comes from `data/lifecycle.js`; never “all chapters out of stock.”
4. **No inference** — do not claim release dates, stockists, reviews, or checkout flows that are not published.

## Source of truth

| File | Role |
|------|------|
| `data/lifecycle.js` | Chapter status labels, meta copy, schema availability |
| `data/answers.mjs` | Canonical Q&A map (build source) |
| `data/answers.js` | Browser mirror (generated) |
| `data/products.js` | Product cards, formats, notes |
| `llms.txt` | Short LLM context (generated) |
| `llms-full.txt` | Long Markdown answer brief (generated) |

## Build pipeline

```bash
npm run build:aeo   # sync answers.js, llms files, inject blocks + schema
npm run verify:aeo  # lifecycle + visible/schema parity
npm run aeo:audit   # coverage report → artifacts/aeo/
```

`npm run build` runs `build:aeo` automatically.

## Adding a new answer

1. Add an entry to `data/answers.mjs` with `id`, `question`, `shortAnswer`, `sourcePage`, `sourceAnchor`, `schemaType`, `proofLinks`, `visible: true`.
2. Add the `id` to `EILLON_AEO_PAGE_MAP` for each page that should display it.
3. Run `npm run build:aeo`.
4. Run `npm run verify:aeo`.

Anchor format: `#answer-{id}` (e.g. `#answer-what-is-beles`).

## Adding a new chapter status

1. Update `data/lifecycle.js` and `data/products.js`.
2. Regenerate llms: `npm run build:aeo`.
3. Run `npm run verify:lifecycle` and `npm run verify:aeo`.

## Sitemap policy

`llms.txt` and `llms-full.txt` are **not** in `sitemap.xml`. They are discoverable via:

- `robots.txt` (`Allow: /llms.txt`, `Allow: /llms-full.txt`)
- Cross-links in `llms-full.txt` and the answer ledger proof links

This keeps the XML sitemap focused on human-facing pages while LLM crawlers can still fetch context files.

## Schema rules

| Type | Rule |
|------|------|
| **FAQPage** | Only from visible answer-ledger items with `schemaType: 'FAQPage'` |
| **Product (Beles)** | Stays `OutOfStock`; offers point to `#waitlist` |
| **Ritual** | No `offers` in Product schema |
| **HowTo** | Wear page only; steps match visible answers |
| **Article** | Journal articles retain headline, author, publisher, dates, image |
| **Organization** | About / index / imprint — CVR, address, email |

## What not to claim

- Confirmed next Beles release date (unless in a dated letter or page)
- Ritual for sale
- Asmara/Massawa as “sold out” retail — they are **in development**
- Restock signup as checkout
- Fake reviews, third-party retailers, or authority badges

## Verification

```bash
npm run verify:all
npm run aeo:audit
```

Check `artifacts/aeo/aeo-audit.md` for per-page scores and missing anchors.
