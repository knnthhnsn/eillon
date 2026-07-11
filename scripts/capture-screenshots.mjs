#!/usr/bin/env node
/**
 * Deterministic Playwright screenshot capture for visual review.
 * Saves to artifacts/screenshots/current/ (gitignored).
 *
 * Usage: npm run test:visual
 *
 * Browser resolution (first match wins):
 *   1. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH — full path to Chrome/Chromium
 *   2. CHROME_PATH — fallback executable path
 *   3. Playwright channel "chrome" (requires Google Chrome installed)
 *
 * If no browser is found: "Install Chrome or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH."
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const { PREORDER_PRODUCTS } = require('../data/preorder-products.js');
const PORT = Number(process.env.PORT || 8766);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(root, 'artifacts', 'screenshots', 'current');
const openPreorderConfig = {
  enabled: true,
  status: 'open',
  products: PREORDER_PRODUCTS.map((product) => ({
    id: product.id,
    productSlug: product.productSlug,
    title: product.title,
    type: product.type,
    price: product.price,
    currency: product.currency,
    description: product.description,
    expectedShipWindow: product.expectedShipWindow,
    refundPolicySummary: product.refundPolicySummary,
    creditPolicy: product.creditPolicy,
    enabled: true,
  })),
};

function resolveBrowserExecutable() {
  return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || process.env.CHROME_PATH || null;
}

async function launchBrowser() {
  const executablePath = resolveBrowserExecutable();
  const launchOpts = { headless: true };
  if (executablePath) {
    launchOpts.executablePath = executablePath;
  } else {
    launchOpts.channel = 'chrome';
  }
  try {
    return await chromium.launch(launchOpts);
  } catch (err) {
    console.error('Install Chrome or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');
    if (!executablePath) {
      console.error('Optional: set CHROME_PATH to a Chromium/Chrome executable.');
    }
    throw err;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      // retry
    }
    await wait(250);
  }
  throw new Error(`Server did not start at ${url}`);
}

async function snap(page, name, opts = {}) {
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: Boolean(opts.fullPage), ...opts });
  return file;
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const captured = [];

try {
  await waitForServer(`${BASE}/`);

  const browser = await launchBrowser();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const desktop = await context.newPage();
  const mobile = await context.newPage();

  await mkdir(OUT, { recursive: true });

  await desktop.setViewportSize({ width: 1440, height: 900 });
  await mobile.setViewportSize({ width: 390, height: 844 });

  /* Homepage desktop */
  await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await wait(1200);
  captured.push(await snap(desktop, 'homepage-desktop-1440', { fullPage: true }));

  await desktop.evaluate(() => window.scrollTo(0, 0));
  captured.push(await snap(desktop, 'homepage-hero', { fullPage: false }));

  const nameSection = desktop.locator('#name');
  if (await nameSection.count()) {
    await nameSection.scrollIntoViewIfNeeded();
    await wait(800);
    captured.push(await snap(desktop, 'homepage-name-carousel', { fullPage: false }));
  }

  const rail = desktop.locator('#sceneRail');
  if (await rail.count()) {
    await rail.hover().catch(() => {});
    await wait(400);
    captured.push(await snap(desktop, 'homepage-scene-rail-active', { fullPage: false }));
  }

  const belesSection = desktop.locator('#collection');
  if (await belesSection.count()) {
    await belesSection.scrollIntoViewIfNeeded();
    await wait(600);
    captured.push(await snap(desktop, 'homepage-beles-section', { fullPage: false }));
  }

  const lettersSection = desktop.locator('#letters');
  if (await lettersSection.count()) {
    await lettersSection.scrollIntoViewIfNeeded();
    await wait(2000);
    captured.push(await snap(desktop, 'homepage-letters-closed', { fullPage: false }));

    const letterBtn = desktop.locator('.correspondence').first();
    if (await letterBtn.count()) {
      try {
        await desktop.evaluate(() => {
          const btn = document.querySelector('.correspondence');
          if (btn) btn.click();
        });
        await wait(1200);
        captured.push(await snap(desktop, 'homepage-letters-open', { fullPage: false }));
        await desktop.locator('.letter-reader__close').click({ force: true, timeout: 5000 }).catch(() => {});
      } catch (err) {
        console.warn('  (skipped homepage-letters-open:', err.message + ')');
      }
    }

    const dispatchOpened = await desktop.evaluate(async () => {
      if (!window.EILLON_LETTERS) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = '/data/letters.js?v=15';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const btn = document.querySelector('.correspondence[data-letter-id="beles-dispatch"]');
      if (!btn) return false;
      btn.click();
      return true;
    });
    if (!dispatchOpened) {
      throw new Error(
        'Beles Dispatch letter missing: expected .correspondence[data-letter-id="beles-dispatch"] on homepage. Add beles-dispatch to data/letters.js and ensure letters archive renders seven slots.',
      );
    }
    await wait(1400);
    captured.push(await snap(desktop, 'homepage-letters-beles-dispatch-open', { fullPage: false }));
    await desktop.locator('.letter-reader__close').click({ force: true, timeout: 5000 }).catch(() => {});
  }

  /* Homepage mobile */
  await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await wait(1200);
  captured.push(await snap(mobile, 'homepage-mobile-390', { fullPage: true }));

  /* Store */
  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.goto(`${BASE}/store`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(desktop, 'store-desktop-1440', { fullPage: true }));

  await mobile.goto(`${BASE}/store`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(mobile, 'store-mobile-390', { fullPage: true }));

  /* Beles proof + shop */
  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.goto(`${BASE}/beles#proof`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(desktop, 'beles-proof-desktop', { fullPage: false }));

  await desktop.goto(`${BASE}/beles#waitlist`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(desktop, 'beles-shop-desktop', { fullPage: false }));

  await mobile.goto(`${BASE}/beles#proof`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(mobile, 'beles-proof-mobile', { fullPage: false }));

  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(`${BASE}/beles#waitlist`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  captured.push(await snap(mobile, 'beles-shop-mobile', { fullPage: false }));

  /* Beles founder preorder (feature disabled by default) */
  await desktop.goto(`${BASE}/beles/preorder`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  const desktopPreorderState = await desktop.evaluate(() => ({
    hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    purchaseButtons: Array.from(document.querySelectorAll('[data-preorder-buy]')).map((button) => button.disabled),
  }));
  if (desktopPreorderState.hasOverflow || desktopPreorderState.purchaseButtons.some((disabled) => !disabled)) {
    throw new Error('Beles preorder desktop must have no horizontal overflow and remain disabled without its feature flag.');
  }
  captured.push(await snap(desktop, 'beles-preorder-hero-desktop', { fullPage: false }));
  await desktop.locator('#offers').scrollIntoViewIfNeeded();
  await wait(400);
  captured.push(await snap(desktop, 'beles-preorder-offers-desktop', { fullPage: false }));

  await mobile.goto(`${BASE}/beles/preorder`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(800);
  const mobilePreorderState = await mobile.evaluate(() => ({
    hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    purchaseButtons: Array.from(document.querySelectorAll('[data-preorder-buy]')).map((button) => button.disabled),
  }));
  if (mobilePreorderState.hasOverflow || mobilePreorderState.purchaseButtons.some((disabled) => !disabled)) {
    throw new Error('Beles preorder mobile must have no horizontal overflow and remain disabled without its feature flag.');
  }
  captured.push(await snap(mobile, 'beles-preorder-hero-mobile', { fullPage: false }));
  await mobile.locator('#founder-sample').scrollIntoViewIfNeeded();
  await wait(400);
  captured.push(await snap(mobile, 'beles-preorder-sample-mobile', { fullPage: false }));
  await mobile.locator('#founder-bottle').scrollIntoViewIfNeeded();
  await wait(400);
  captured.push(await snap(mobile, 'beles-preorder-bottle-mobile', { fullPage: false }));

  /* Simulated launch-ready state: no Stripe or database traffic leaves the test. */
  let checkoutProbePayload = null;
  await desktop.route('**/api/preorder-config', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(openPreorderConfig),
  }));
  await desktop.route('**/api/create-preorder-checkout-session', async (route) => {
    checkoutProbePayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: `${BASE}/preorder-success?session_id=cs_test_visual_probe`,
        session_id: 'cs_test_visual_probe',
      }),
    });
  });
  await desktop.route('**/api/preorder-session?*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      status: 'paid',
      preorder_type: 'sample_preorder',
      product_slug: 'beles',
      amount_total: 2800,
      currency: 'eur',
      fulfillment_status: 'pending',
      size_interest: 'sample',
    }),
  }));
  await desktop.evaluate(() => sessionStorage.removeItem('eillon_utm'));
  await desktop.goto(`${BASE}/beles/preorder?source=visual_smoke&utm_campaign=founder%40example.com`, { waitUntil: 'networkidle', timeout: 45000 });
  await wait(500);
  const openState = await desktop.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[data-preorder-checkout]'));
    const schema = document.getElementById('eillon-preorder-product-schema');
    return {
      buttonCount: buttons.length,
      allEnabled: buttons.every((button) => !button.disabled && button.getAttribute('aria-disabled') === 'false'),
      status: document.querySelector('[data-preorder-status]')?.textContent?.trim(),
      schema: schema ? JSON.parse(schema.textContent) : null,
      storedUtm: sessionStorage.getItem('eillon_utm'),
    };
  });
  if (openState.buttonCount !== 2 || !openState.allEnabled || openState.status !== 'Founder preorder checkout is open') {
    throw new Error('Launch-ready preorder config did not enable both visible checkout controls.');
  }
  if (openState.schema?.offers?.availability !== 'https://schema.org/PreOrder') {
    throw new Error('Launch-ready preorder page did not expose its gated PreOrder schema.');
  }
  if (openState.storedUtm) {
    throw new Error('Frontend analytics stored a likely-PII UTM value.');
  }
  await desktop.locator('#offers').scrollIntoViewIfNeeded();
  await wait(300);
  captured.push(await snap(desktop, 'beles-preorder-open-offers-desktop', { fullPage: false }));

  await desktop.locator('[data-preorder-checkout="beles-founder-sample"]').click();
  await desktop.waitForURL('**/preorder-success?session_id=cs_test_visual_probe', { timeout: 10000 });
  await desktop.locator('#successTitle').waitFor({ state: 'visible', timeout: 5000 });
  await wait(300);
  if (!checkoutProbePayload || checkoutProbePayload.product_id !== 'beles-founder-sample'
    || checkoutProbePayload.size_interest !== 'sample' || checkoutProbePayload.utm_campaign
    || Object.hasOwn(checkoutProbePayload, 'email')) {
    throw new Error('Frontend Checkout request did not preserve the expected no-email payload contract.');
  }
  const successTitle = await desktop.locator('#successTitle').textContent();
  if (successTitle?.trim() !== 'Payment received') {
    throw new Error('Webhook-confirmed success lookup did not render Payment received.');
  }
  captured.push(await snap(desktop, 'beles-preorder-success-confirmed-desktop', { fullPage: false }));

  await mobile.route('**/api/preorder-config', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(openPreorderConfig),
  }));
  await mobile.goto(`${BASE}/beles/preorder?source=visual_smoke`, { waitUntil: 'networkidle', timeout: 45000 });
  await mobile.locator('#founder-sample').scrollIntoViewIfNeeded();
  await wait(300);
  const mobileOpenButtons = await mobile.locator('[data-preorder-checkout]').evaluateAll(
    (buttons) => buttons.map((button) => button.disabled),
  );
  if (mobileOpenButtons.length !== 2 || mobileOpenButtons.some(Boolean)) {
    throw new Error('Launch-ready preorder config did not enable both mobile checkout controls.');
  }
  captured.push(await snap(mobile, 'beles-preorder-open-sample-mobile', { fullPage: false }));

  await desktop.goto(`${BASE}/journal/fico-d-india`, { waitUntil: 'networkidle', timeout: 45000 });
  const preorderBridge = desktop.locator('.preorder-bridge');
  await preorderBridge.scrollIntoViewIfNeeded();
  await wait(400);
  captured.push(await snap(desktop, 'journal-preorder-bridge-desktop', { fullPage: false }));

  /* Search overlay */
  await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 45000 });
  const searchToggle = desktop.locator('#searchToggle');
  if (await searchToggle.count()) {
    await searchToggle.click({ force: true }).catch(() => {});
    await wait(500);
    captured.push(await snap(desktop, 'search-overlay', { fullPage: false }));
  }

  /* Mobile nav */
  await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 45000 });
  const menuToggle = mobile.locator('#menuToggle');
  if (await menuToggle.count()) {
    await menuToggle.click({ force: true }).catch(() => {});
    await wait(500);
    captured.push(await snap(mobile, 'mobile-nav-open', { fullPage: false }));
  }

  await writeFile(
    join(OUT, 'manifest.json'),
    JSON.stringify({ captured_at: new Date().toISOString(), files: captured.map((p) => p.replace(root + (root.includes('\\') ? '\\' : '/'), '').replace(/\\/g, '/')) }, null, 2),
  );

  await browser.close();
  console.log(`✓ Captured ${captured.length} screenshots → artifacts/screenshots/current/`);
} catch (err) {
  console.error('✗ Visual capture failed:', err.message);
  process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
  await wait(300);
}
