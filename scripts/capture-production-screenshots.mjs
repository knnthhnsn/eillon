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

function rootLifecyclePass(html) {
  return (
    /Awaiting next release/i.test(html) &&
    !html.includes('<p class="mv-chapter__status">Out of stock</p>') &&
    !/six letters folded/i.test(html)
  );
}

async function fetchRootHtml(path) {
  const res = await fetch(`${ORIGIN}${path}${path.includes('?') ? '&' : '?'}audit=${AUDIT}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  return res.text();
}

const screenshots = [];
const assertions = [];

try {
  await mkdir(OUT, { recursive: true });

  const homepageHtml = await fetchRootHtml('/');
  const indexHtml = await fetchRootHtml('/index.html');
  const rootPass = rootLifecyclePass(homepageHtml);
  const indexPass = rootLifecyclePass(indexHtml);

  assertions.push({ pass: rootPass, label: 'homepage_root_lifecycle' });
  assertions.push({ pass: indexPass, label: 'index_html_root_lifecycle' });

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${ORIGIN}/?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(1200);
  const heroPath = join(OUT, 'homepage-hero.png');
  await page.screenshot({ path: heroPath, fullPage: false });
  screenshots.push(heroPath.replace(/\\/g, '/'));

  await page.evaluate(() => {
    const chapter = document.querySelector('#collection, .mv-chapter--beles, [data-chapter="beles"]');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(800);
  const chapterPath = join(OUT, 'homepage-beles-chapter.png');
  await page.screenshot({ path: chapterPath, fullPage: false });
  screenshots.push(chapterPath.replace(/\\/g, '/'));

  await page.goto(`${ORIGIN}/?audit=${AUDIT}#letters`, { waitUntil: 'networkidle', timeout: 90000 });
  await wait(2500);

  const dispatchExists = await page
    .waitForSelector('.correspondence[data-letter-id="beles-dispatch"]', { timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  let dispatchVisible = dispatchExists;
  let dispatchOpenActionsVisible = false;

  if (dispatchExists) {
    const deskPath = join(OUT, 'homepage-letters-desk.png');
    await page.screenshot({ path: deskPath, fullPage: false });
    screenshots.push(deskPath.replace(/\\/g, '/'));
    await page.click('.correspondence[data-letter-id="beles-dispatch"]', { force: true });
    await page.waitForSelector('.letter-reader.is-active', { timeout: 15000 });
    await page.waitForSelector('.letter-sheet__action--restock[href*="/beles#waitlist"]', { timeout: 15000 });
    await wait(1200);
    const openPath = join(OUT, 'homepage-beles-dispatch-open.png');
    await page.screenshot({ path: openPath, fullPage: false });
    screenshots.push(openPath.replace(/\\/g, '/'));
    dispatchOpenActionsVisible = await page
      .locator('.letter-sheet__action--restock[href*="/beles#waitlist"]')
      .isVisible();
  }

  assertions.push({ pass: dispatchVisible, label: 'beles_dispatch_visible' });
  assertions.push({ pass: dispatchOpenActionsVisible, label: 'beles_dispatch_restock_action_visible' });

  await page.goto(`${ORIGIN}/index.html?audit=${AUDIT}`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(() => {
    const chapter = document.querySelector('#collection, .mv-chapter--beles');
    if (chapter) chapter.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(800);
  const indexChapterPath = join(OUT, 'index-html-beles-chapter.png');
  await page.screenshot({ path: indexChapterPath, fullPage: false });
  screenshots.push(indexChapterPath.replace(/\\/g, '/'));

  await browser.close();

  const report = {
    captured_at: new Date().toISOString(),
    origin: ORIGIN,
    audit: AUDIT,
    rootPass,
    indexPass,
    dispatchVisible,
    dispatchOpenActionsVisible,
    screenshots,
    assertions,
    pass: rootPass && indexPass && dispatchVisible && dispatchOpenActionsVisible,
  };

  await writeFile(join(OUT, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  if (!report.pass) {
    const failed = [];
    if (!rootPass) failed.push('root');
    if (!indexPass) failed.push('index');
    if (!dispatchVisible) failed.push('dispatch');
    if (!dispatchOpenActionsVisible) failed.push('dispatch_actions');
    console.error(`✗ Production visual parity failed: ${failed.join(', ')}`);
    process.exit(1);
  }

  console.log(`✓ Production visual parity passed → artifacts/screenshots/production/`);
} catch (err) {
  console.error('✗ Production visual capture failed:', err.message);
  process.exit(1);
}
