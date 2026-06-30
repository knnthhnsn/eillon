#!/usr/bin/env node
/**
 * Fail if stockist references appear without an explicit allowlist entry.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const ALLOWLIST = new Set([
  'scripts/verify-stockists.mjs',
  'review-notes/suggestion-triage.md',
  'review-notes/final-report.md',
  'review-notes/implementation-plan.md',
  'review-notes/chatgpt-live-review.md',
  'market-research/panel-asmara-live-2026-06-12.md',
  'market-research/panel-asmara-2026-06-12.md',
]);

const SCAN_DIRS = ['scripts', 'data', 'lib', 'api'];
const SCAN_ROOT_FILES = ['*.html', 'script.js', 'script.min.js'];

const failures = [];

function scanFile(rel) {
  if (ALLOWLIST.has(rel.replace(/\\/g, '/'))) return;
  const text = readFileSync(join(root, rel), 'utf8');
  if (/#stockists\b/i.test(text)) {
    failures.push(`${rel}: contains #stockists anchor`);
  }
  if (/\bstockists?\b/i.test(text)) {
    failures.push(`${rel}: contains stockist/stockists reference`);
  }
}

for (const dir of SCAN_DIRS) {
  const abs = join(root, dir);
  try {
    for (const name of readdirSync(abs)) {
      if (name.endsWith('.js') || name.endsWith('.mjs')) {
        scanFile(`${dir}/${name}`);
      }
    }
  } catch {
    // dir missing
  }
}

for (const name of readdirSync(root)) {
  if (name.endsWith('.html')) scanFile(name);
  if (name === 'script.js' || name === 'script.min.js') scanFile(name);
}

if (failures.length) {
  console.error('\n✗ Stockist references found (not allowlisted)\n');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log('✓ No unallowlisted stockist references');
