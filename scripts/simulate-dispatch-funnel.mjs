#!/usr/bin/env node
/**
 * Simulate Beles Dispatch → restock micro-funnel locally with Playwright.
 *
 * Usage: npm run test:dispatch-funnel
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8767);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = join(root, 'artifacts', 'parity');
const OUT_FILE = join(OUT_DIR, 'dispatch-funnel-local.json');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function readTimeline(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(sessionStorage.getItem('__EILLON_TEST_TIMELINE') || '[]');
    } catch {
      return window.__EILLON_TEST_TIMELINE || [];
    }
  });
}

const result = {
  timestamp: new Date().toISOString(),
  pass: false,
  timeline: [],
  finalUrl: null,
  failures: [],
};

try {
  await waitForServer(`${BASE}/`);

  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    let timeline = [];
    try {
      const stored = sessionStorage.getItem('__EILLON_TEST_TIMELINE');
      if (stored) timeline = JSON.parse(stored);
    } catch {
      // ignore
    }
    window.__EILLON_TEST_TIMELINE = timeline;
    const persist = () => {
      sessionStorage.setItem('__EILLON_TEST_TIMELINE', JSON.stringify(window.__EILLON_TEST_TIMELINE));
    };
    const wrapAnalytics = (analytics) => {
      if (!analytics || analytics.__testHooked) return analytics;
      analytics.__testHooked = true;
      const origMark = analytics.markRestockSource.bind(analytics);
      analytics.markRestockSource = function (source) {
        window.__EILLON_TEST_TIMELINE.push({ kind: 'mark', source });
        persist();
        return origMark(source);
      };
      return analytics;
    };
    const wrapVa = () => {
      if (typeof window.va !== 'function' || window.va.__testHooked) return;
      const orig = window.va;
      window.va = function (...args) {
        if (args[0] === 'event' && args[1]?.name) {
          window.__EILLON_TEST_TIMELINE.push({ kind: 'event', name: args[1].name });
          persist();
        }
        return orig.apply(this, args);
      };
      window.va.__testHooked = true;
    };
    let backed = window.EILLON_ANALYTICS;
    Object.defineProperty(window, 'EILLON_ANALYTICS', {
      configurable: true,
      enumerable: true,
      get() {
        return backed;
      },
      set(v) {
        backed = wrapAnalytics(v);
      },
    });
    if (backed) backed = wrapAnalytics(backed);
    wrapVa();
    window.setInterval(wrapVa, 25);
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/#letters`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => typeof window.EILLON_ANALYTICS?.track === 'function', { timeout: 20000 });
  await wait(1500);

  const dispatchReady = await page
    .waitForSelector('.correspondence[data-letter-id="beles-dispatch"]', { timeout: 20000 })
    .catch(() => null);

  if (!dispatchReady) {
    throw new Error('Beles Dispatch letter missing on homepage');
  }

  await page.click('.correspondence[data-letter-id="beles-dispatch"]', { force: true });
  await page.waitForSelector('.letter-reader.is-active', { timeout: 10000 });
  await page.waitForSelector('.letter-sheet.is-ink .letter-sheet__action--restock[href*="/beles#waitlist"]', {
    timeout: 10000,
  });

  const restockAction = page.locator('.letter-sheet__action--restock[href*="/beles#waitlist"]');
  await Promise.all([
    page.waitForURL(/\/beles#waitlist/, { timeout: 15000 }),
    restockAction.click({ force: true }),
  ]);

  await page.waitForSelector('#waitlist', { timeout: 10000, state: 'visible' });
  await page.waitForFunction(() => typeof window.EILLON_ANALYTICS?.track === 'function', { timeout: 20000 });
  await page.evaluate(() => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  const anchorDeadline = Date.now() + 5000;
  while (Date.now() < anchorDeadline) {
    const timeline = await readTimeline(page);
    if (timeline.some((e) => e.kind === 'event' && e.name === 'restock_anchor_reached')) break;
    await wait(200);
  }
  await wait(300);

  result.finalUrl = page.url();

  if (!result.finalUrl.includes('#waitlist')) {
    throw new Error(`Expected /beles#waitlist, got ${result.finalUrl}`);
  }

  const timeline = await readTimeline(page);
  result.timeline = timeline;
  const eventNames = timeline.filter((e) => e.kind === 'event').map((e) => e.name);

  const requiredEvents = ['letter_opened', 'letter_action_clicked', 'archive_to_beles_click'];
  for (const name of requiredEvents) {
    if (!eventNames.includes(name)) {
      result.failures.push(`Missing event: ${name}`);
    }
  }

  const markIdx = timeline.findIndex((e) => e.kind === 'mark' && e.source === 'letter_archive');
  const archiveIdx = timeline.findIndex((e) => e.kind === 'event' && e.name === 'archive_to_beles_click');
  if (markIdx === -1) {
    result.failures.push('markRestockSource("letter_archive") was not called');
  } else if (archiveIdx === -1 || markIdx > archiveIdx) {
    result.failures.push('markRestockSource("letter_archive") must occur before archive_to_beles_click');
  }

  if (!eventNames.includes('restock_anchor_reached')) {
    result.failures.push('restock_anchor_reached did not fire after Beles #waitlist loaded');
  }

  if (result.failures.length) {
    throw new Error(result.failures.join('; '));
  }

  result.pass = true;
  await browser.close();
  console.log('✓ Dispatch funnel simulation passed');
  console.log(`  Timeline: ${timeline.map((e) => (e.kind === 'mark' ? `mark:${e.source}` : e.name)).join(' → ')}`);
  console.log(`  Landed: ${result.finalUrl}`);
} catch (err) {
  result.failures.push(err.message);
  console.error('✗ Dispatch funnel simulation failed:', err.message);
  process.exitCode = 1;
} finally {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(result, null, 2)}\n`);
  server.kill('SIGTERM');
  await wait(300);
}
