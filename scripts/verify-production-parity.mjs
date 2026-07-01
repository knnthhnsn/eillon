#!/usr/bin/env node
/**
 * Compare live https://eillon.maison against repo lifecycle + archive expectations.
 *
 * Usage:
 *   npm run verify:production
 *   VERIFY_PRODUCTION=true npm run verify:production
 *   npm run verify:production:required
 *
 * Not part of default CI unless VERIFY_PRODUCTION=true is set.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = process.env.EILLON_ORIGIN || 'https://eillon.maison';
const AUDIT = String(Date.now());
const OUT_DIR = join(root, 'artifacts', 'parity');
const OUT_FILE = join(OUT_DIR, 'latest.json');
const strict = process.env.VERIFY_PRODUCTION === 'true' || process.argv.includes('--required');

const failures = [];
const routes = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function repoExpectations() {
  const lettersData = read('data/letters.js');
  const lettersCount = (lettersData.match(/\bid:\s*['"][^'"]+['"]/g) || []).length;
  const hasBelesDispatch = /id:\s*['"]beles-dispatch['"]/.test(lettersData);
  let manifest = null;
  try {
    manifest = JSON.parse(read('build-manifest.json'));
  } catch {
    // build-manifest may not exist locally
  }
  return { lettersCount, hasBelesDispatch, manifest };
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

async function fetchText(path) {
  const url = `${ORIGIN}${path}${path.includes('?') ? '&' : '?'}audit=${AUDIT}`;
  const res = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`);
  }
  return { url, body: await res.text() };
}

function marker(found, label) {
  return { label, found: Boolean(found) };
}

function routeResult(label, url, expected, found, pass, notes = []) {
  return { route: label, url, expected, found, pass, notes };
}

const repo = repoExpectations();

const pageDefs = [
  { path: '/', label: 'homepage' },
  { path: '/beles', label: 'beles' },
  { path: '/asmara', label: 'asmara' },
  { path: '/massawa', label: 'massawa' },
  { path: '/ritual', label: 'ritual' },
];

const html = Object.create(null);
const urls = Object.create(null);

for (const page of pageDefs) {
  try {
    const { url, body } = await fetchText(page.path);
    html[page.label] = body;
    urls[page.label] = url;
  } catch (err) {
    failures.push(`Could not fetch ${page.label}: ${err.message}`);
    routes.push(routeResult(page.label, `${ORIGIN}${page.path}`, [], [], false, [err.message]));
  }
}

if (html.homepage) {
  const expected = [
    'Beles status not "Out of stock"',
    'Archive lede not "six letters folded"',
    repo.hasBelesDispatch ? 'Beles dispatch present when repo has beles-dispatch' : null,
  ].filter(Boolean);

  const found = [];
  const notes = [];

  const staleBeles = html.homepage.includes('<p class="mv-chapter__status">Out of stock</p>');
  found.push(marker(!staleBeles, 'beles_status_not_out_of_stock'));
  if (staleBeles) {
    failures.push('live homepage: Beles status still "Out of stock"');
    notes.push('Found <p class="mv-chapter__status">Out of stock</p>');
  }

  const sixLetters = /six letters folded/i.test(html.homepage);
  found.push(marker(!sixLetters, 'archive_not_six_letters'));
  if (sixLetters) {
    failures.push('live homepage: still says "six letters folded"');
    notes.push('Found "six letters folded"');
  }

  if (repo.hasBelesDispatch) {
    let dispatchLive = /beles dispatch/i.test(html.homepage) || html.homepage.includes('beles-dispatch');
    if (!dispatchLive) {
      try {
        const lettersFetch = await fetchText('/data/letters.js');
        urls.lettersData = lettersFetch.url;
        dispatchLive = /beles-dispatch/.test(lettersFetch.body);
        if (!dispatchLive) {
          failures.push('live homepage: repo has beles-dispatch but live data/letters.js does not');
          notes.push('Live data/letters.js missing beles-dispatch');
        } else {
          notes.push('Homepage HTML stale but live data/letters.js has beles-dispatch');
        }
      } catch (err) {
        failures.push(`live data/letters.js fetch failed: ${err.message}`);
      }
    }
    found.push(marker(dispatchLive, 'beles_dispatch_present'));
  }

  routes.push(routeResult('homepage', urls.homepage, expected, found, notes.length === 0, notes));
}

for (const label of ['asmara', 'massawa']) {
  if (!html[label]) continue;
  const notes = [];
  const found = [];

  for (const [pattern, msg, key] of [
    [/Out of stock/i, `live ${label}: contains "Out of stock"`, 'no_out_of_stock'],
    [/Notify when back/i, `live ${label}: contains "Notify when back"`, 'no_notify_when_back'],
    [/returns to the boutique/i, `live ${label}: contains "returns to the boutique"`, 'no_returns_boutique'],
  ]) {
    const hit = pattern.test(stripComments(html[label]));
    found.push(marker(!hit, key));
    if (hit) {
      failures.push(msg);
      notes.push(msg);
    }
  }

  routes.push(
    routeResult(
      label,
      urls[label],
      ['No Out of stock', 'No Notify when back', 'No returns to the boutique'],
      found,
      notes.length === 0,
      notes,
    ),
  );
}

if (html.ritual) {
  const visible = stripComments(html.ritual);
  const notes = [];
  const found = [];

  if (/Out of stock/i.test(html.ritual)) {
    failures.push('live ritual: contains "Out of stock"');
    notes.push('Found "Out of stock"');
    found.push(marker(false, 'no_out_of_stock'));
  } else {
    found.push(marker(true, 'no_out_of_stock'));
  }

  if (/restock/i.test(visible)) {
    failures.push('live ritual: visible copy contains "restock"');
    notes.push('Visible copy contains "restock"');
    found.push(marker(false, 'no_restock_copy'));
  } else {
    found.push(marker(true, 'no_restock_copy'));
  }

  if (/"offers"\s*:/.test(html.ritual)) {
    failures.push('live ritual: Product schema contains "offers"');
    notes.push('Schema contains "offers"');
    found.push(marker(false, 'no_schema_offers'));
  } else {
    found.push(marker(true, 'no_schema_offers'));
  }

  routes.push(
    routeResult(
      'ritual',
      urls.ritual,
      ['No Out of stock', 'No restock in visible copy', 'No schema offers'],
      found,
      notes.length === 0,
      notes,
    ),
  );
}

let liveManifest = null;
try {
  const manifestFetch = await fetchText('/build-manifest.json');
  urls.buildManifest = manifestFetch.url;
  liveManifest = JSON.parse(manifestFetch.body);
  const manifestNotes = [];

  if (repo.hasBelesDispatch && liveManifest.hasBelesDispatch !== true) {
    const msg = 'live build-manifest.json: hasBelesDispatch is not true';
    if (strict) failures.push(msg);
    else manifestNotes.push(msg);
  }

  if (repo.lettersCount && liveManifest.lettersCount !== repo.lettersCount) {
    const msg = `live build-manifest.json: lettersCount ${liveManifest.lettersCount} !== repo ${repo.lettersCount}`;
    if (strict) failures.push(msg);
    else manifestNotes.push(msg);
  }

  if (strict && repo.manifest?.commitSha && liveManifest.commitSha && repo.manifest.commitSha !== liveManifest.commitSha) {
    failures.push(
      `live build-manifest.json: commitSha ${liveManifest.commitSha.slice(0, 7)} !== repo ${repo.manifest.commitSha.slice(0, 7)}`,
    );
    manifestNotes.push('commitSha mismatch');
  }

  routes.push(
    routeResult(
      'build-manifest',
      urls.buildManifest,
      ['hasBelesDispatch matches repo', 'lettersCount matches repo', strict ? 'commitSha matches repo when available' : null].filter(Boolean),
      [
        marker(liveManifest.hasBelesDispatch === repo.hasBelesDispatch, 'hasBelesDispatch'),
        marker(liveManifest.lettersCount === repo.lettersCount, 'lettersCount'),
        marker(!repo.manifest?.commitSha || !liveManifest.commitSha || repo.manifest.commitSha === liveManifest.commitSha, 'commitSha'),
      ],
      manifestNotes.length === 0,
      manifestNotes,
    ),
  );
} catch (err) {
  const msg = `Could not fetch or parse live build-manifest.json: ${err.message}`;
  if (strict) failures.push(msg);
  routes.push(routeResult('build-manifest', `${ORIGIN}/build-manifest.json`, ['Valid build-manifest.json'], [], false, [msg]));
}

const report = {
  timestamp: new Date().toISOString(),
  origin: ORIGIN,
  audit: AUDIT,
  strict,
  pass: failures.length === 0,
  repo,
  routes,
  failures,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`✗ Production parity failed (${ORIGIN}):\n`);
  failures.forEach((msg) => console.error(`  • ${msg}`));
  console.error(`\nReport: ${OUT_FILE.replace(/\\/g, '/')}`);
  process.exit(1);
}

console.log(`✓ Production parity passed (${ORIGIN})`);
console.log(`Report: ${OUT_FILE.replace(/\\/g, '/')}`);
