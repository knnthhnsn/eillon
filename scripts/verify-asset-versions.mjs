#!/usr/bin/env node
/** Ensure every HTML page references the same cache-bust versions for shared assets. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const expected = JSON.parse(readFileSync(join(root, 'data/asset-versions.json'), 'utf8'));

const CHECKS = [
  { key: 'stylesMinCss', pattern: /styles\.min\.css\?v=(\d+)/g },
  { key: 'siteMinCss', pattern: /site\.min\.css\?v=(\d+)/g },
  { key: 'homeMinCss', pattern: /home\.min\.css\?v=(\d+)/g },
  { key: 'lettersMinCss', pattern: /letters\.min\.css\?v=(\d+)/g },
  { key: 'siteShadersJs', pattern: /site-shaders\.js\?v=(\d+)/g },
  { key: 'sharedInteractionsJs', pattern: /shared-interactions\.min\.js\?v=(\d+)/g },
  { key: 'globalCoreJs', pattern: /global-core\.min\.js\?v=(\d+)/g },
  { key: 'productsJs', pattern: /products\.js\?v=(\d+)/g },
];

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === 'artifacts') continue;
      walkHtml(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const failures = [];

for (const file of walkHtml(root)) {
  const rel = file.replace(root, '').replace(/^[/\\]/, '').replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');

  for (const check of CHECKS) {
    const matches = [...html.matchAll(check.pattern)].map((m) => m[1]);
    if (!matches.length) continue;

    const want = String(expected[check.key]);
    const bad = matches.filter((v) => v !== want);
    if (bad.length) {
      failures.push(`${rel}: ${check.key} expected v=${want}, found v=${[...new Set(bad)].join(',')}`);
    }
  }
}

if (failures.length) {
  console.error('\n✗ Asset version verification failed\n');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`✓ Asset versions consistent (${walkHtml(root).length} HTML files)`);
