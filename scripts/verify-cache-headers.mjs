#!/usr/bin/env node
/**
 * Verify Cache-Control headers on production (or EILLON_ORIGIN).
 *
 * Usage:
 *   EILLON_ORIGIN=https://eillon.maison node scripts/verify-cache-headers.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = (process.env.EILLON_ORIGIN || 'https://eillon.maison').replace(/\/$/, '');

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function matchVersion(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : null;
}

function homeJsPath() {
  const index = read('index.html');
  const v = matchVersion(index, /home\.js\?v=(\d+)/);
  const cssV = matchVersion(index, /home\.min\.css\?v=(\d+)/);
  return {
    homeJs: v ? `/scripts/home.js?v=${v}` : '/scripts/home.js',
    homeCss: cssV ? `/home.min.css?v=${cssV}` : '/home.min.css',
  };
}

async function fetchCacheControl(path) {
  const url = `${ORIGIN}${path}${path.includes('?') ? '&' : '?'}header=${Date.now()}`;
  let res = await fetch(url, {
    method: 'HEAD',
    headers: { 'Cache-Control': 'no-cache' },
    redirect: 'follow',
  });
  if (res.status === 405 || !res.ok) {
    res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, redirect: 'follow' });
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.headers.get('cache-control') || '';
}

const paths = homeJsPath();
const checks = [
  { path: '/', expect: (cc) => /max-age=0/i.test(cc) && /must-revalidate/i.test(cc), label: 'root HTML no-store' },
  { path: '/index.html', expect: (cc) => /max-age=0/i.test(cc) && /must-revalidate/i.test(cc), label: 'index.html no-store' },
  {
    path: '/build-manifest.json',
    expect: (cc) => /must-revalidate/i.test(cc) && (/max-age=0/i.test(cc) || /max-age=60/i.test(cc)),
    label: 'manifest short cache',
  },
  {
    path: paths.homeJs,
    expect: (cc) => /max-age=/i.test(cc) && paths.homeJs.includes('?v='),
    label: 'versioned home.js cacheable',
  },
  { path: '/data/letters.js', expect: (cc) => /max-age=/i.test(cc), label: 'letters data cacheable' },
  {
    path: paths.homeCss,
    expect: (cc) => /max-age=/i.test(cc) && paths.homeCss.includes('?v='),
    label: 'versioned home.css cacheable',
  },
  {
    path: '/images/beles-no-background-hi.webp',
    fallback: '/images/beles-no-background.webp',
    expect: (cc) => /immutable/i.test(cc) || /max-age=31536000/i.test(cc),
    label: 'image immutable',
  },
];

const failures = [];

for (const check of checks) {
  const pathsToTry = [check.path, ...(check.fallback ? [check.fallback] : [])];
  let ok = false;
  let lastCc = '';
  let lastErr = null;
  for (const path of pathsToTry) {
    try {
      const cacheControl = await fetchCacheControl(path);
      lastCc = cacheControl;
      if (check.expect(cacheControl)) {
        ok = true;
        break;
      }
    } catch (err) {
      lastErr = err.message;
    }
  }
  if (!ok) {
    failures.push(
      lastErr
        ? `${check.path}: ${lastErr}`
        : `${check.path}: Cache-Control "${lastCc}" failed (${check.label})`,
    );
  }
}

if (failures.length) {
  console.error(`✗ Cache header verification failed (${ORIGIN}):\n`);
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log(`✓ Cache headers OK (${ORIGIN})`);
