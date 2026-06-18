#!/usr/bin/env node
/**
 * Capture EILLON page screenshots for design review.
 * Usage: node scripts/capture-screenshots.mjs [before|after]
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const phase = process.argv[2] === 'after' ? 'after' : 'before';
const OUT_DIR = path.join(ROOT, 'design-review', phase);
const BASE = process.env.EILLON_BASE_URL || 'http://localhost:8080';

const VIEWPORTS = [
  { tag: 'desktop-1440', width: 1440, height: 1000 },
  { tag: 'desktop-1920', width: 1920, height: 1080 },
  { tag: 'laptop-1280', width: 1280, height: 800 },
  { tag: 'tablet-1024', width: 1024, height: 1366 },
  { tag: 'tablet-768', width: 768, height: 1024 },
  { tag: 'mobile-430', width: 430, height: 932 },
  { tag: 'mobile-390', width: 390, height: 844 },
  { tag: 'mobile-360', width: 360, height: 800 },
];

const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'store', path: '/store' },
  { slug: 'beles', path: '/beles' },
  { slug: 'asmara', path: '/asmara' },
  { slug: 'massawa', path: '/massawa' },
  { slug: 'ritual', path: '/ritual' },
  { slug: 'journal', path: '/journal' },
  { slug: 'journal-fico', path: '/journal/fico-d-india' },
  { slug: 'journal-bottle', path: '/journal/the-bottle' },
  { slug: 'privacy', path: '/privacy' },
  { slug: 'terms', path: '/terms' },
  { slug: 'imprint', path: '/imprint' },
];

const HOME_SECTIONS = [
  { id: 'hero', selector: '.hero' },
  { id: 'model', selector: '.model-row' },
  { id: 'maison', selector: '#maison' },
  { id: 'collection', selector: '#collection' },
  { id: 'palette', selector: '#palette' },
  { id: 'object', selector: '#craft' },
  { id: 'atmosphere', selector: '.atmosphere' },
  { id: 'wear', selector: '#wear' },
  { id: 'footer', selector: '.footer' },
];

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => {
    document.body.classList.add('is-loaded');
    const veil = document.querySelector('.veil');
    if (veil) veil.style.display = 'none';
  });
  await page.waitForTimeout(600);
}

async function capturePage(browser, pageDef, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const url = `${BASE}${pageDef.path}`;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await settle(page);

    const filename = `${pageDef.slug}-${viewport.tag}.png`;
    await page.screenshot({
      path: path.join(OUT_DIR, filename),
      fullPage: true,
    });

    if (pageDef.slug === 'home' && viewport.tag === 'desktop-1440') {
      for (const section of HOME_SECTIONS) {
        const el = await page.$(section.selector);
        if (!el) continue;
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(200);
        await el.screenshot({
          path: path.join(OUT_DIR, `home-${section.id}-${viewport.tag}.png`),
        });
      }
    }
  } catch (err) {
    console.error(`Failed ${url} @ ${viewport.tag}:`, err.message);
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  console.log(`Capturing ${phase} screenshots → ${OUT_DIR}`);
  for (const viewport of VIEWPORTS) {
    for (const pageDef of PAGES) {
      process.stdout.write(`  ${pageDef.slug} ${viewport.tag}…\n`);
      await capturePage(browser, pageDef, viewport);
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
