# Deployment truth

Source CI passing (`npm run ci`) is **not** enough to confirm https://eillon.maison serves the latest commit.

Vercel can deploy `/beles`, `/store`, and static assets while `/` (root HTML) remains stale due to CDN edge cache, domain alias drift, or an older `index.html` at the edge.

## Required post-deploy verification

After every production deploy:

```bash
npm run build
VERIFY_PRODUCTION=true npm run verify:production
```

With expected commit (GitHub Actions / manual):

```bash
EXPECT_COMMIT_SHA=<full-or-short-sha> VERIFY_PRODUCTION=true npm run verify:production
```

If Vercel propagation is slow:

```bash
VERIFY_PRODUCTION_RETRY=true VERIFY_PRODUCTION=true npm run verify:production
```

Reports:

- `artifacts/parity/latest.json` — machine-readable
- `artifacts/parity/latest.md` — human summary

## Stale root symptoms

| Symptom | Meaning |
|---------|---------|
| `/beles` current, `/` stale | **Root HTML stale** — homepage cache or alias issue |
| Live says "Out of stock" on `/`, "Awaiting next release" on `/store` | Root HTML stale |
| `build-manifest.json` commitSha ≠ deployed commit | Manifest from older build or deploy not finished |
| Live `data/letters.js` missing `beles-dispatch` | Letters data not deployed or cached |
| Live `scripts/home.js` references old `?v=` for letters | Homepage JS bundle stale |

## Remediation

1. **Redeploy** the latest commit from Vercel dashboard (Production → Redeploy).
2. Confirm **cleanUrls** — `/` serves `index.html` (see `vercel.json`).
3. Inspect **Vercel domain alias** — production domain points at the intended deployment.
4. Check **cache headers** — `/` and `/*.html` must be `max-age=0, must-revalidate` (see `vercel.json`).
5. Confirm **`/index.html`** is not cached immutably at the edge.
6. Run production parity again with retry enabled.

## build-manifest.json

Generated at **build/deploy time only** — not committed to git.

- Local: `npm run build:manifest` after `npm run build`
- Live: `https://eillon.maison/build-manifest.json`
- Parity compares live manifest to repo **source files** (`index.html`, `scripts/home.js`, `data/letters.js`), not a committed manifest artifact.

## GitHub Action

`.github/workflows/production-parity.yml` — manual (`workflow_dispatch`) or daily schedule.

Run this workflow **after** Vercel reports a successful production deploy. It uploads parity artifacts but does not block PR CI.

## Optional visual check

```bash
npm run test:production-visual
```

Captures live homepage screenshots and text assertions to `artifacts/screenshots/production/`.
