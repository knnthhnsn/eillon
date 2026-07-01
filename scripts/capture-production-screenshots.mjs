#!/usr/bin/env node
/**
 * Live production visual parity — homepage hero, chapter, letters.
 *
 * Usage: npm run test:production-visual
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = (process.env.EILLON_ORIGIN || 'https://eillon.maison').replace(/\/$/, '');
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

function assertRootLifecycle(html, label, assertions) {
  if (html.includes('<p class="mv-chapter__status">Out of stock</p>')) {
    assertions.push({ pass: false, label: `${label}_beles_not_out_of_stock` });
  } else {
    assertions.push({ pass: true, label: `${label}_beles_not_out_of_stock` });
  }
  if (/six letters folded/i.test(html)) {
    assertions.push({ pass: false, label: `${label}_no_six_letters_copy` });
  } else {
    assertions.push({ pass: true, label: `${label}_no_six_letters_copy` });
  }
  if (!/Awaiting next release/i.test(html)) {
    assertions.push({ pass: false, label: `${label}_awaiting_next_release` });
  } else {
    assertions.push({ pass: true, label: `${label}_awaiting_next_release` });
  }
}

async function fetchRootHtml(path) {
  const res = await fetch(`${ORIGIN}${path}${path.includes('?') ? '&' : '?'}audit=${AUDIT}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  return res.text();
}

const assertions = [];

try {
  await mkdir(OUT, { recursive: true });

  const homepageHtml = await fetchRootHtml('/');
  assertRootLifecycle(homepageHtml, 'homepage', assertions);

  const indexHtml = await fetchRootHtml('/index.html');
  assertRootLifecycle(indexHtml, 'index_html', assertions);

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${ORIGIN}/?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(1200);
  await page.screenshot({ path: join(OUT, 'homepage-hero.png'), fullPage: false });

  await page.evaluate(() => {
    const chapter = document.querySelector('#collection, .mv-chapter--beles, [data-chapter="beles"]');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(800);
  await page.screenshot({ path: join(OUT, 'homepage-beles-chapter.png'), fullPage: false });

  await page.goto(`${ORIGIN}/?audit=${AUDIT}#letters`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(2500);

  const dispatchExists = await page
    .waitForSelector('.correspondence[data-letter-id="beles-dispatch"]', { timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (!dispatchExists) {
    assertions.push({ pass: false, label: 'beles_dispatch_visible' });
  } else {
    assertions.push({ pass: true, label: 'beles_dispatch_visible' });
    await page.screenshot({ path: join(OUT, 'homepage-letters-desk.png'), fullPage: false });
    await page.click('.correspondence[data-letter-id="beles-dispatch"]', { force: true });
    await page.waitForSelector('.letter-reader.is-active', { timeout: 15000 });
    await page.waitForSelector('.letter-sheet__action--restock[href*="/beles#waitlist"]', { timeout: 15000 });
    await wait(1200);
    await page.screenshot({ path: join(OUT, 'homepage-beles-dispatch-open.png'), fullPage: false });
    const actionVisible = await page.locator('.letter-sheet__action--restock[href*="/beles#waitlist"]').isVisible();
    assertions.push({ pass: actionVisible, label: 'beles_dispatch_restock_action_visible' });
  }

  await page.goto(`${ORIGIN}/index.html?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(() => {
    const chapter = document.querySelector('#collection, .mv-chapter--beles');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(800);
  await page.screenshot({ path: join(OUT, 'index-html-beles-chapter.png'), fullPage: false });

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
