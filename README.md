# EILLON — Afro-Mediterranean Memory Perfumery

Static website for [eillon.maison](https://eillon.maison) — an independent perfume maison in Copenhagen.

## Structure

```
.
├── index.html          Maison landing page
├── store.html          Boutique / fragrance catalog
├── beles.html          Beles · Fico d'India product page
├── data/products.js    Product catalog (window.EILLON_PRODUCTS)
├── styles.css          Palette, typography, layout, motion
├── script.js           Reveal animations, product grid, waitlist
├── api/                Vercel serverless (waitlist, admin)
└── journal/            Editorial articles
```

## Run locally

The site is **static** with optional Vercel serverless APIs.

### Static preview

```powershell
python -m http.server 8000
# or
npx serve .
```

Open <http://localhost:8000>. Waitlist API requires `npx vercel dev` with `DATABASE_URL` configured.

### Full stack (waitlist API)

```powershell
npx vercel dev
```

## Brand

- **EILLON** — Afro-Mediterranean memory perfumery
- **Tagline:** Red Sea memories, bottled.
- **First release:** Beles · Fico d'India (waitlist open)
- **Future chapters:** Asmara, Massawa, Ritual (store cards)

## Deploy

Production deploys via Vercel CLI:

```powershell
npx vercel --prod --yes
```
