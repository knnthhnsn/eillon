#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.RESPONSIVE_QA_PORT || 8767);
const base = `http://127.0.0.1:${port}`;
const viewports = [
  { label: 'phone', width: 390, height: 844 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'tablet-landscape', width: 1024, height: 768 },
];

const routes = Array.from(
  readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>https:\/\/eillon\.maison([^<]*)<\/loc>/g),
  (match) => match[1] || '/',
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  throw new Error(`Responsive QA server did not start at ${base}`);
}

async function launchBrowser() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || process.env.CHROME_PATH;
  return chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true, channel: 'chrome' });
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const failures = [];
let browser;

try {
  await waitForServer();
  browser = await launchBrowser();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of routes) {
      await page.goto(`${base}${route}?responsive-qa=${viewport.label}`, {
        waitUntil: 'load',
        timeout: 30000,
      });
      await page.waitForTimeout(220);

      const result = await page.evaluate(({ label, width }) => {
        const rootEl = document.documentElement;
        const viewportWidth = rootEl.clientWidth;
        const h1Rect = document.querySelector('h1')?.getBoundingClientRect();
        const navRect = document.querySelector('.nav__inner')?.getBoundingClientRect();
        const waitlist = document.querySelector('.shop__waitlist');
        const waitlistParent = waitlist?.parentElement;
        const tables = Array.from(document.querySelectorAll('.info-page__table'));
        const inputs = Array.from(document.querySelectorAll(
          'input[type="email"], input[type="search"], input[type="text"], select, textarea',
        ));
        const storeGrid = document.querySelector('.product-grid--shop');

        return {
          overflow: Math.max(0, rootEl.scrollWidth - viewportWidth),
          h1Outside: Boolean(h1Rect && (h1Rect.left < -1 || h1Rect.right > viewportWidth + 1)),
          navOutside: Boolean(navRect && (navRect.left < -1 || navRect.right > viewportWidth + 1)),
          waitlistRatio: waitlist && waitlistParent
            ? waitlist.getBoundingClientRect().width / waitlistParent.getBoundingClientRect().width
            : 1,
          tablesReady: tables.every((table) => (
            table.dataset.responsiveTable === 'true'
            && Array.from(table.querySelectorAll('tbody tr')).every((row) => (
              Array.from(row.children).every((cell) => Boolean(cell.dataset.label))
            ))
          )),
          mobileTableOverflow: width <= 640 && tables.some((table) => {
            const wrapper = table.closest('.info-page__table-wrap');
            return wrapper && wrapper.scrollWidth > wrapper.clientWidth + 1;
          }),
          undersizedInput: width <= 900 && inputs.some((input) => {
            const inputStyle = getComputedStyle(input);
            const inputRect = input.getBoundingClientRect();
            const isVisible = inputStyle.display !== 'none'
              && inputStyle.visibility !== 'hidden'
              && inputRect.width > 1
              && inputRect.height > 1
              && !input.matches('[type="hidden"], .shop__honeypot');

            return isVisible && Number.parseFloat(inputStyle.fontSize) < 16;
          }),
          storeColumns: storeGrid ? getComputedStyle(storeGrid).gridTemplateColumns.split(' ').length : null,
          expectedStoreColumns: label === 'phone' ? 1 : null,
        };
      }, viewport);

      if (result.overflow > 1) failures.push(`${viewport.label} ${route}: ${result.overflow}px document overflow`);
      if (result.h1Outside) failures.push(`${viewport.label} ${route}: h1 leaves viewport`);
      if (result.navOutside) failures.push(`${viewport.label} ${route}: navigation leaves viewport`);
      if (result.waitlistRatio < 0.9) failures.push(`${viewport.label} ${route}: restock form is not full width`);
      if (!result.tablesReady) failures.push(`${viewport.label} ${route}: responsive table labels missing`);
      if (result.mobileTableOverflow) failures.push(`${viewport.label} ${route}: evidence table still scrolls horizontally`);
      if (result.undersizedInput) failures.push(`${viewport.label} ${route}: form input below 16px`);
      if (result.storeColumns !== null
        && result.expectedStoreColumns
        && result.storeColumns !== result.expectedStoreColumns) {
        failures.push(`${viewport.label} ${route}: expected ${result.expectedStoreColumns} store column, found ${result.storeColumns}`);
      }
    }
  }

  await context.close();
} finally {
  await browser?.close().catch(() => {});
  server.kill('SIGTERM');
}

if (failures.length) {
  console.error(`Responsive QA failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Responsive QA passed (${routes.length} routes x ${viewports.length} viewports = ${routes.length * viewports.length} checks)`);
