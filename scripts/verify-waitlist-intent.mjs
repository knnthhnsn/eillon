#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const { PRODUCTS, getInterestSelection } = require('../lib/product-interest');
const port = Number(process.env.WAITLIST_QA_PORT || 8768);
const base = `http://127.0.0.1:${port}`;
const chapterSlugs = ['beles', 'oliva', 'asmara', 'massawa', 'petricor', 'ritual'];
const failures = [];

const productsContext = {
  window: {},
  document: { dispatchEvent() {} },
  Event: class Event {},
};
vm.runInNewContext(readFileSync(new URL('../data/products.js', import.meta.url), 'utf8'), productsContext);
const browserProducts = productsContext.window.EILLON_PRODUCTS;

for (const slug of chapterSlugs) {
  const browserProduct = browserProducts.find((product) => product.slug === slug);
  const serverProduct = PRODUCTS[slug];
  if (!browserProduct || !serverProduct) {
    failures.push(`${slug}: missing browser or server catalog entry`);
    continue;
  }

  for (const [size, format] of Object.entries(serverProduct.formats)) {
    const browserFormat = browserProduct.formats.find((item) => item.id === size);
    if (!browserFormat || browserFormat.price !== format.price || browserFormat.currency !== 'EUR') {
      failures.push(`${slug} ${size}: browser/server format mismatch`);
    }
  }
}

const adminHtml = readFileSync(new URL('../waitlist-admin.html', import.meta.url), 'utf8');
for (const marker of ['Signed up for', 'Intent', 'Entry point', 'Page', 'selection_label', 'signup_intent']) {
  if (!adminHtml.includes(marker)) failures.push(`waitlist admin missing ${marker}`);
}

const backendChecks = [
  ['../api/waitlist.js', ['getInterestSelection', 'signupIntent', 'selectionLabel', 'formatPrice', 'pagePath']],
  ['../lib/db.js', ['signup_intent', 'selection_label', 'format_price', 'currency', 'page_path']],
  ['../lib/waitlist-notify.js', ['Signed up for', 'Entry point', 'pagePath']],
];
for (const [relativePath, markers] of backendChecks) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  for (const marker of markers) {
    if (!source.includes(marker)) failures.push(`${relativePath}: missing ${marker}`);
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${base}/`);
      if (response.ok) return;
    } catch {
      // Retry while the local server starts.
    }
    await wait(200);
  }
  throw new Error(`Waitlist QA server did not start at ${base}`);
}

async function launchBrowser() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || process.env.CHROME_PATH;
  return chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true, channel: 'chrome' });
}

let browser;
try {
  await waitForServer();
  browser = await launchBrowser();
  const context = await browser.newContext({ reducedMotion: 'reduce' });

  for (const slug of chapterSlugs) {
    const page = await context.newPage();
    let capturedPayload;
    let resolvePayload;
    const payloadReceived = new Promise((resolve) => { resolvePayload = resolve; });

    await page.route('**/api/waitlist', async (route) => {
      capturedPayload = route.request().postDataJSON();
      const interest = getInterestSelection(capturedPayload.product_slug, capturedPayload.size);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          signup: {
            product_slug: slug,
            size: interest.size,
            signup_intent: interest.signupIntent,
            selection_label: interest.selectionLabel,
            format_price: interest.formatPrice,
            currency: interest.currency,
            page_path: capturedPayload.page_path,
          },
        }),
      });
      resolvePayload();
    });

    await page.goto(`${base}/${slug}?waitlist-qa=1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const form = page.locator('[data-waitlist-form][data-product-slug]').first();
    await form.waitFor({ state: 'attached' });

    if (slug === 'beles') {
      await page.locator('.size[data-size="50"]').click();
    } else {
      const formatControl = form.locator('input[name="size"][value="50"]');
      await formatControl.waitFor({ state: 'attached' });
      await form.locator('.chapter-formats__option:has(input[name="size"][value="50"])').click();
    }

    await form.locator('input[type="email"]').fill(`${slug}@example.com`);
    await form.locator('input[name="name"]').fill(`QA ${slug}`);
    await form.evaluate((element) => element.requestSubmit());
    await Promise.race([
      payloadReceived,
      wait(5000).then(() => { throw new Error(`${slug}: signup payload timed out`); }),
    ]);

    const interest = getInterestSelection(slug, '50');
    if (capturedPayload.product_slug !== slug) failures.push(`${slug}: wrong product in payload`);
    if (capturedPayload.size !== '50') failures.push(`${slug}: wrong size in payload`);
    if (capturedPayload.page_path !== `/${slug}`) failures.push(`${slug}: wrong page path in payload`);
    if (capturedPayload.consent_marketing !== true) failures.push(`${slug}: consent missing from payload`);

    const status = page.locator('.shop__waitlist-status').first();
    await status.waitFor({ state: 'attached' });
    const statusText = (await status.textContent()) || '';
    if (!statusText.includes(interest.selectionLabel)) {
      failures.push(`${slug}: confirmation does not name exact selection`);
    }

    await page.close();
  }

  const store = await context.newPage();
  await store.goto(`${base}/store?waitlist-qa=prices`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await store.locator('.product-card--shop').first().waitFor({ state: 'attached' });
  for (const slug of chapterSlugs) {
    const maxPrice = Math.max(...Object.values(PRODUCTS[slug].formats).map((format) => format.price));
    const priceText = (await store.locator(`#card-${slug} .product-card__shop-highest-price`).textContent()) || '';
    if (!priceText.includes(`\u20ac${maxPrice}`) || !priceText.includes('100 ml')) {
      failures.push(`${slug}: shop card does not show highest 100 ml price`);
    }
  }
  await store.close();
  await context.close();
} finally {
  await browser?.close().catch(() => {});
  server.kill('SIGTERM');
}

if (failures.length) {
  console.error(`Waitlist intent QA failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Waitlist intent QA passed (6 chapters, exact format payloads and shop prices)');
