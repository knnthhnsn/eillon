#!/usr/bin/env node
/**
 * Complete care@ forward + Fix DNS via Chrome CDP.
 * Requires Chrome with --remote-debugging-port=9222 and a logged-in Porkbun session.
 */
import { chromium } from 'playwright-core';

const DOMAIN = process.env.EMAIL_DOMAIN || 'eillon.maison';
const FORWARD_TO = process.env.CARE_FORWARD_EMAIL || 'kennethchristoffer@gmail.com';
const ALIAS = process.env.CARE_EMAIL_ALIAS || 'care';
const CDP_URL = process.env.CHROME_CDP_URL || 'http://127.0.0.1:9222';
const EMAIL_URL = `https://porkbun.com/account/domainsSpeedy/${DOMAIN}/email`;
const WAIT_LOGIN_MS = Number(process.env.PORKBUN_LOGIN_WAIT_MS || 600000);

async function waitForLogin(page) {
  const start = Date.now();
  while (Date.now() - start < WAIT_LOGIN_MS) {
    const url = page.url();
    if (!url.includes('/account/login')) return true;
    await page.waitForTimeout(2000);
    try {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch {
      await page.goto(EMAIL_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
  }
  return false;
}

async function ensureForward(page) {
  const body = await page.textContent('body');
  const hasForward =
    body?.includes(`${ALIAS}@`) &&
    body?.toLowerCase().includes(FORWARD_TO.toLowerCase());

  if (hasForward) {
    console.log(`Forward ${ALIAS}@${DOMAIN} → ${FORWARD_TO} already exists`);
    return;
  }

  for (const sel of [
    'input[name="username"]',
    'input#username',
    'input[name="email_prefix"]',
    'input[placeholder*="username" i]',
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.fill(ALIAS);
      console.log(`Filled prefix (${sel})`);
      break;
    }
  }

  for (const sel of [
    'input[name="forward_to"]',
    'input[name="destination"]',
    'input[name="forward"]',
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.fill(FORWARD_TO);
      console.log(`Filled destination (${sel})`);
      break;
    }
  }

  const create = page.getByRole('button', {
    name: /create email forward|create forward|add forward|add email forward/i,
  });
  if (await create.count()) {
    await create.first().click();
    console.log('Clicked create forward');
    await page.waitForTimeout(4000);
    return;
  }

  throw new Error('Could not find email forward create form on Porkbun page');
}

async function fixDns(page) {
  const fixDnsBtn = page.getByRole('button', { name: /fix dns/i });
  if (!(await fixDnsBtn.count())) {
    console.log('Fix DNS button not found (MX may already be configured)');
    return;
  }
  await fixDnsBtn.first().click();
  console.log('Clicked Fix DNS');
  await page.waitForTimeout(1500);
  const ok = page.getByRole('button', { name: /^ok$/i });
  if (await ok.count()) {
    await ok.first().click();
    console.log('Confirmed Fix DNS');
  }
  await page.waitForTimeout(4000);
}

async function main() {
  console.log(`Porkbun care@ setup: ${ALIAS}@${DOMAIN} → ${FORWARD_TO}`);
  console.log(`Connecting to CDP at ${CDP_URL}`);

  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  let page = context.pages().find((p) => p.url().includes('porkbun'));
  if (!page) {
    page = context.pages().find((p) => p.url().startsWith('http')) || await context.newPage();
  }

  if (!page.url().includes('porkbun')) {
    await page.goto(EMAIL_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  }

  if (page.url().includes('/account/login')) {
    console.log('Waiting for Porkbun login in the open Chrome window…');
    const loggedIn = await waitForLogin(page);
    if (!loggedIn) {
      throw new Error('Timed out waiting for Porkbun login');
    }
    if (!page.url().includes('/email')) {
      await page.goto(EMAIL_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
    }
  }

  console.log('Logged in. URL:', page.url());
  await ensureForward(page);
  await fixDns(page);

  const body = await page.textContent('body');
  const ok =
    body?.includes(`${ALIAS}@`) &&
    body?.toLowerCase().includes(FORWARD_TO.toLowerCase());
  console.log('Forward visible on page:', ok);

  await browser.close();
  console.log('Done. Run: node scripts/check-email-dns.mjs');
}

main().catch((err) => {
  console.error('Setup failed:', err.message || err);
  process.exit(1);
});
