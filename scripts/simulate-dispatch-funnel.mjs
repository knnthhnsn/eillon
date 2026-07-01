#!/usr/bin/env node
/**
 * Simulate Beles Dispatch → restock micro-funnel locally with Playwright.
 *
 * Usage: npm run test:dispatch-funnel
 *
 * Browser resolution (first match wins):
 *   1. PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
 *   2. CHROME_PATH
 *   3. Playwright channel "chrome"
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8767);
const BASE = `http://127.0.0.1:${PORT}`;

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

async function installAnalyticsHook(page) {
  await page.waitForFunction(() => typeof window.EILLON_ANALYTICS?.track === 'function', { timeout: 20000 });
  await page.evaluate(() => {
    window.__EILLON_TEST_EVENTS = [];
    sessionStorage.removeItem('__EILLON_TEST_EVENTS');
    const orig = window.EILLON_ANALYTICS.track.bind(window.EILLON_ANALYTICS);
    window.EILLON_ANALYTICS.track = function (name, props) {
      window.__EILLON_TEST_EVENTS.push(name);
      sessionStorage.setItem('__EILLON_TEST_EVENTS', JSON.stringify(window.__EILLON_TEST_EVENTS));
      return orig(name, props);
    };
  });
}

async function readEvents(page) {
  return page.evaluate(() => {
    try {
      const stored = sessionStorage.getItem('__EILLON_TEST_EVENTS');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return window.__EILLON_TEST_EVENTS || [];
  });
}

try {
  await waitForServer(`${BASE}/`);

  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/#letters`, { waitUntil: 'networkidle', timeout: 60000 });
  await installAnalyticsHook(page);
  await wait(1500);

  const dispatchReady = await page.waitForSelector('.correspondence[data-letter-id="beles-dispatch"]', {
    timeout: 20000,
  }).catch(() => null);

  if (!dispatchReady) {
    throw new Error('Beles Dispatch letter missing on homepage (.correspondence[data-letter-id="beles-dispatch"])');
  }

  await page.click('.correspondence[data-letter-id="beles-dispatch"]', { force: true });
  await page.waitForSelector('.letter-reader.is-active', { timeout: 10000 });
  await page.waitForSelector('.letter-sheet.is-ink .letter-sheet__action--restock[href*="/beles#waitlist"]', { timeout: 10000 });

  const restockAction = page.locator('.letter-sheet__action--restock[href*="/beles#waitlist"]');
  await Promise.all([
    page.waitForURL(/\/beles(#waitlist)?/, { timeout: 15000 }),
    restockAction.click({ force: true }),
  ]);
  await wait(1200);

  const finalUrl = page.url();
  if (!/\/beles/.test(finalUrl)) {
    throw new Error(`Expected navigation to /beles, got ${finalUrl}`);
  }
  if (!finalUrl.includes('#waitlist') && !finalUrl.endsWith('/beles')) {
    throw new Error(`Expected #waitlist hash on Beles, got ${finalUrl}`);
  }

  const captured = await readEvents(page);
  const required = ['letter_opened', 'letter_action_clicked', 'archive_to_beles_click'];
  const missing = required.filter((name) => !captured.includes(name));
  if (missing.length) {
    throw new Error(`Missing analytics events: ${missing.join(', ')} (captured: ${captured.join(', ') || 'none'})`);
  }

  await browser.close();
  console.log('✓ Dispatch funnel simulation passed');
  console.log(`  Events: ${[...new Set(captured)].join(', ')}`);
  console.log(`  Landed: ${finalUrl}`);
} catch (err) {
  console.error('✗ Dispatch funnel simulation failed:', err.message);
  process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
  await wait(300);
}
