#!/usr/bin/env node
/**
 * Fail if homepage critical path loads heavy bundles before hero-ready.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.html');
const homeCriticalPath = join(root, 'scripts', 'home-critical.js');
const homeCriticalMinPath = join(root, 'scripts', 'home-critical.min.js');

const FORBIDDEN_IN_HOME_CRITICAL = [
  'querySelectorAll(\'[data-reveal="words"]\')',
  'video.canPlayType',
  "document.querySelectorAll('.shop')",
  'ScrollTrigger',
  'gsap',
  'data-bottle-explorer',
  'submitWaitlistSignup',
  '/api/waitlist',
  'document.querySelectorAll(\'[data-waitlist-form]\')',
  'mountProductGrids',
  'EILLON_PRODUCTS',
];

const FORBIDDEN_HOME_SCRIPTS = [
  'script.min.js',
  'beles-shop',
  'chapter-interactions',
];

function fail(msg) {
  console.error(`✗ homepage critical path: ${msg}`);
  process.exit(1);
}

if (!existsSync(indexPath)) fail('index.html missing');

const indexHtml = readFileSync(indexPath, 'utf8');

for (const token of FORBIDDEN_HOME_SCRIPTS) {
  if (indexHtml.includes(token)) {
    fail(`index.html references forbidden script "${token}"`);
  }
}

if (!indexHtml.includes('global-core.min.js')) {
  fail('index.html must load /scripts/global-core.min.js');
}
if (!indexHtml.includes('home-critical.min.js')) {
  fail('index.html must load /scripts/home-critical.min.js');
}
if (!indexHtml.includes('load-after-hero.js')) {
  fail('index.html must load /scripts/load-after-hero.js');
}

const criticalSource = existsSync(homeCriticalPath)
  ? readFileSync(homeCriticalPath, 'utf8')
  : readFileSync(homeCriticalMinPath, 'utf8');

for (const token of FORBIDDEN_IN_HOME_CRITICAL) {
  if (criticalSource.includes(token)) {
    fail(`home-critical bundle contains forbidden token: ${token}`);
  }
}

const loadAfterHero = readFileSync(join(root, 'scripts', 'load-after-hero.js'), 'utf8');
if (!loadAfterHero.includes('home-interactions')) {
  fail('load-after-hero.js must defer home-interactions.js until hero-ready');
}

console.log('✓ homepage critical path — no script.min.js; home-critical is lean; interactions deferred post-hero');
