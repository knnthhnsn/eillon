#!/usr/bin/env node
/**
 * Poll live /build-manifest.json until deploy fingerprint matches expectations.
 *
 * Usage:
 *   EILLON_ORIGIN=https://eillon.maison EXPECT_COMMIT_SHA=<sha> node scripts/wait-for-production-manifest.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = (process.env.EILLON_ORIGIN || 'https://eillon.maison').replace(/\/$/, '');
const EXPECT_SHA = process.env.EXPECT_COMMIT_SHA || '';
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 180000);
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 10000);
const OUT = join(root, 'artifacts', 'parity', 'manifest-wait.json');

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function matchVersion(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : null;
}

function repoExpectations() {
  const lettersData = read('data/letters.js');
  const homeJs = read('scripts/home.js');
  const index = read('index.html');
  return {
    lettersCount: (lettersData.match(/\bid:\s*['"][^'"]+['"]/g) || []).length,
    hasBelesDispatch: /id:\s*['"]beles-dispatch['"]/.test(lettersData),
    assets: {
      homeJs: matchVersion(index, /home\.js\?v=(\d+)/),
      dataLettersJs: matchVersion(homeJs, /data\/letters\.js\?v=(\d+)/),
      lettersJs: matchVersion(homeJs, /\/scripts\/letters\.js\?v=(\d+)/),
    },
  };
}

function shaMatches(expected, live) {
  if (!expected || !live) return false;
  const e = expected.trim();
  const l = live.trim();
  return l === e || l.startsWith(e.slice(0, 7)) || e.startsWith(l.slice(0, 7));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchManifest() {
  const url = `${ORIGIN}/build-manifest.json?wait=${Date.now()}`;
  const res = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`);
  }
  return { url, manifest: JSON.parse(await res.text()) };
}

const repo = repoExpectations();
const started = Date.now();
const attempts = [];
let success = false;
let lastError = null;

while (Date.now() - started < TIMEOUT_MS) {
  try {
    const { url, manifest } = await fetchManifest();
    const checks = {
      commitSha: EXPECT_SHA ? shaMatches(EXPECT_SHA, manifest.commitSha) : true,
      hasBelesDispatch: manifest.hasBelesDispatch === true,
      lettersCount: manifest.lettersCount === repo.lettersCount,
      homeJs: !repo.assets.homeJs || manifest.assets?.homeJs === repo.assets.homeJs,
      dataLettersJs: !repo.assets.dataLettersJs || manifest.assets?.dataLettersJs === repo.assets.dataLettersJs,
      lettersJs: !repo.assets.lettersJs || manifest.assets?.lettersJs === repo.assets.lettersJs,
    };
    const pass = Object.values(checks).every(Boolean);
    attempts.push({ at: new Date().toISOString(), url, manifest, checks, pass });
    if (pass) {
      success = true;
      break;
    }
    lastError = `Manifest not ready: ${JSON.stringify(checks)}`;
  } catch (err) {
    lastError = err.message;
    attempts.push({ at: new Date().toISOString(), error: err.message, pass: false });
  }
  await wait(INTERVAL_MS);
}

const report = {
  timestamp: new Date().toISOString(),
  origin: ORIGIN,
  expectCommitSha: EXPECT_SHA,
  timeoutMs: TIMEOUT_MS,
  intervalMs: INTERVAL_MS,
  elapsedMs: Date.now() - started,
  repo,
  success,
  attempts,
  lastError,
};

mkdirSync(join(root, 'artifacts', 'parity'), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);

if (!success) {
  console.error(`✗ Manifest wait timed out (${ORIGIN})`);
  if (lastError) console.error(`  • ${lastError}`);
  console.error(`Report: ${OUT.replace(/\\/g, '/')}`);
  process.exit(1);
}

console.log(`✓ Manifest ready (${ORIGIN})`);
console.log(`Report: ${OUT.replace(/\\/g, '/')}`);
