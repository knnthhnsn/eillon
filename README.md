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

### Static preview (clean URLs)

Production uses Vercel `cleanUrls` (`/beles`, not `/beles.html`). Match that locally:

```bash
# Recommended — pull, verify out-of-stock copy, start server
npm run start:local
# or
bash scripts/start-local.sh
```

Or without pull:

```bash
python3 scripts/dev-server.py
# or
npm run dev
```

Verify your files are the out-of-stock version (not waitlist-open):

```bash
npm run verify
```

Open <http://localhost:8080/store> — all four cards should say **Out of stock**.

If you still see **Waitlist open** / **In production**, you are on an old copy of the repo. Run `git pull origin main` and restart the dev server.

Plain `python -m http.server` does **not** rewrite URLs — use `/beles.html` instead, or switch to the dev server above.

Waitlist API requires `npx vercel dev` with `DATABASE_URL` configured.

Optional signup notifications (Resend):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key |
| `WAITLIST_NOTIFY_EMAIL` | Your email(s), comma-separated |
| `RESEND_FROM` | Verified sender, e.g. `EILLON <care@eillon.maison>` |
| `WAITLIST_NOTIFY_ON_UPDATE` | Set to `true` to also email when someone re-submits |

Notifications are sent after each **new** signup. Re-submits are skipped unless `WAITLIST_NOTIFY_ON_UPDATE=true`. A failed notification never blocks the signup.

### care@eillon.maison (receiving)

Public `mailto:care@eillon.maison` links require Porkbun email forwarding + MX records. See [docs/care-email-setup.md](docs/care-email-setup.md). Quick check: `node scripts/check-email-dns.mjs`.

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
