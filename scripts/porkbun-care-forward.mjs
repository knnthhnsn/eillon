#!/usr/bin/env node
/**
 * Automate Porkbun care@ forward + Fix DNS using logged-in Chrome profile.
 */
import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const DOMAIN = 'eillon.maison';
const FORWARD_TO = 'kennethchristoffer@gmail.com';
const ALIAS = 'care';
const EMAIL_URL = `https://porkbun.com/account/domainsSpeedy/${DOMAIN}/email`;
const CHROME_PROFILE = process.env.CHROME_USER_DATA || '/home/ubuntu/.config/google-chrome';

async function main() {
  if (!existsSync(CHROME_PROFILE)) {
    throw new Error(`Chrome profile not found: ${CHROME_PROFILE}`);
  }

  console.log('Launching Chrome with saved session…');
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(EMAIL_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  if (page.url().includes('login')) {
    throw new Error('Still on login page — session may have expired. Log in again in the browser.');
  }

  console.log('On email page:', page.url());

  // Create forward if form exists
  const prefixInput = page.locator('input[name="username"], input[name="email_prefix"], input[placeholder*="username" i], input[placeholder*="email" i]').first();
  const destInput = page.locator('input[name="forward_to"], input[name="destination"], input[type="email"]').filter({ hasNot: page.locator('[name="username"]') }).first();

  if (await prefixInput.count()) {
    await prefixInput.fill(ALIAS);
    if (await destInput.count()) {
      await destInput.fill(FORWARD_TO);
    }
    const createBtn = page.getByRole('button', { name: /create email forward|create forward|add forward/i });
    if (await createBtn.count()) {
      await createBtn.click();
      console.log('Clicked create forward');
      await page.waitForTimeout(2000);
    }
  } else {
    // Maybe forward already exists — check page text
    const body = await page.textContent('body');
    if (body?.includes(`${ALIAS}@${DOMAIN}`) && body?.includes(FORWARD_TO)) {
      console.log('Forward appears to already exist');
    } else {
      console.log('Could not find forward form — may need manual click');
    }
  }

  // Fix DNS button
  const fixDns = page.getByRole('button', { name: /fix dns/i });
  if (await fixDns.count()) {
    await fixDns.click();
    console.log('Clicked Fix DNS');
    const ok = page.getByRole('button', { name: /^ok$/i });
    if (await ok.count()) {
      await ok.click();
      console.log('Confirmed Fix DNS');
    }
    await page.waitForTimeout(3000);
  } else {
    console.log('Fix DNS button not found — MX may already be set');
  }

  const forwards = await page.textContent('body');
  console.log('\nPage mentions care@:', forwards?.includes('care@') || forwards?.includes(ALIAS));
  console.log('Page mentions gmail:', forwards?.toLowerCase().includes('kennethchristoffer@gmail.com'));

  await context.close();
}

main().catch((err) => {
  console.error('Automation failed:', err.message || err);
  process.exit(1);
});
