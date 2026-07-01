# EILLON release checklist

Run before treating a production deploy as authoritative.

## Local gates

```bash
npm run build
npm run verify:all
npm run smoke:funnel
npm run test:dispatch-funnel
npm run lighthouse:ci
npm run test:visual
npm run test:production-visual
```

## Post-deploy gates

```bash
EXPECT_COMMIT_SHA=<sha> VERIFY_PRODUCTION=true npm run verify:production
EILLON_ORIGIN=https://eillon.maison npm run verify:cache
```

Deploy URL check (after Vercel deploy):

```bash
EILLON_ORIGIN=https://<deployment-url> EXPECT_COMMIT_SHA=<sha> VERIFY_PRODUCTION=true npm run verify:production
EILLON_ORIGIN=https://eillon.maison COMPARE_DEPLOY_ORIGIN=https://<deployment-url> EXPECT_COMMIT_SHA=<sha> VERIFY_PRODUCTION=true PARITY_OUT=production-alias npm run verify:production
```

Wait for manifest propagation:

```bash
EILLON_ORIGIN=https://eillon.maison EXPECT_COMMIT_SHA=<sha> node scripts/wait-for-production-manifest.mjs
```

## GitHub Actions

Run **Release production** (`.github/workflows/release-production.yml`) after Vercel reports success.

Inputs:
- `expected_sha` — commit to verify (defaults to workflow SHA)
- `production_origin` — alias to verify (default `https://eillon.maison`)
- `verify_only` — default true; parity only
- `deploy_with_vercel_cli` — optional CLI deploy (requires Vercel secrets; writes `artifacts/parity/deployment-url.txt`)

Workflow must pass:
- `artifacts/parity/production-alias.json` — **pass**
- `/` and `/index.html` both show **Awaiting next release**
- No **Out of stock** on `/`
- No **six letters folded**
- `build-manifest.json` commit matches expected SHA
- Beles Dispatch in live `data/letters.js`

## Manual UX checks

- [ ] Beles Dispatch visible in House Archive
- [ ] Dispatch **Join restock list** lands on `/beles#waitlist`
- [ ] Scene Rail, letters, proof ledger, sticky restock card intact
- [ ] `/store` and `/beles` lifecycle copy current

## If `/` is stale but `/beles` is current

See [`deployment-truth.md`](deployment-truth.md) — likely `clean_url_root_stale` or `domain_alias_stale`. Redeploy, confirm cache headers, re-run release workflow.
