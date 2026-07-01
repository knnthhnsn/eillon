#!/usr/bin/env node
/**
 * Live production visual parity — homepage hero, chapter, letters.
 *
 * Usage: npm run test:production-visual
 *
 * Saves to artifacts/screenshots/production/ (gitignored).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = process.env.EILLON_ORIGIN || 'https://eillon.maison';
const OUT = join(root, 'artifacts', 'screenshots', 'production');
const AUDIT = Date.now();

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
    throw err;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const assertions = [];
const captured = [];

try {
  await mkdir(OUT, { recursive: true });

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${ORIGIN}/?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(1200);

  const html = await page.content();
  if (html.includes('<p class="mv-chapter__status">Out of stock</p>')) {
    assertions.push({ pass: false, label: 'homepage_beles_not_out_of_stock' });
  } else {
    assertions.push({ pass: true, label: 'homepage_beles_not_out_of_stock' });
  }

  if (/six letters folded/i.test(html)) {
    assertions.push({ pass: false, label: 'homepage_no_six_letters_copy' });
  } else {
    assertions.push({ pass: true, label: 'homepage_no_six_letters_copy' });
  }

  captured.push(
    await page.screenshot({ path: join(OUT, 'homepage-hero.png'), fullPage: false }),
  );

  await page.evaluate(() => {
    const chapter = document.querySelector('.mv-chapter--beles, [data-chapter="beles"], .mv-chapters');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(800);
  await page.screenshot({ path: join(OUT, 'homepage-beles-chapter.png'), fullPage: false });

  await page.goto(`${ORIGIN}/#letters?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(2000);

  const dispatchExists = await page
    .waitForSelector('.correspondence[data-letter-id="beles-dispatch"]', { timeout: 25000 })
    .then(() => true)
    .catch(() => false);

  if (!dispatchExists) {
    assertions.push({ pass: false, label: 'beles_dispatch_visible' });
  } else {
    assertions.push({ pass: true, label: 'beles_dispatch_visible' });
    await page.screenshot({ path: join(OUT, 'homepage-letters-desk.png'), fullPage: false });
    await page.click('.correspondence[data-letter-id="beles-dispatch"]', { force: true });
    await wait(1600);
    await page.screenshot({ path: join(OUT, 'homepage-beles-dispatch-open.png'), fullPage: false });
  }

  const report = {
    captured_at: new Date().toISOString(),
    origin: ORIGIN,
    audit: AUDIT,
    assertions,
    pass: assertions.every((a) => a.pass),
  };

  await writeFile(join(OUT, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  await browser.close();

  if (!report.pass) {
    const failed = assertions.filter((a) => !a.pass).map((a) => a.label);
    console.error(`✗ Production visual parity failed: ${failed.join(', ')}`);
    process.exit(1);
  }

  console.log(`✓ Production visual parity passed → artifacts/screenshots/production/`);
} catch (err) {
  console.error('✗ Production visual capture failed:', err.message);
  process.exit(1);
}
