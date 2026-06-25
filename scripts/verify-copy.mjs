#!/usr/bin/env node
/**
 * Guard against stale lifecycle, shipping, and legal copy regressions.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const htmlFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory() && !['node_modules', '.git'].includes(name)) walk(path);
    else if (name.endsWith('.html') && !name.includes('waitlist-admin')) htmlFiles.push(path);
  }
}
walk(root);

const RULES = [
  { pattern: /complimentary worldwide shipping/i, reason: 'Use verified shipping regions from /shipping instead of worldwide promise' },
  { pattern: /All chapters currently out of stock/i, reason: 'Use lifecycle labels (awaiting release / in development / studio archive)' },
  { pattern: /Every chapter is currently out of stock/i, reason: 'Use chapter-specific lifecycle copy on /store' },
  { pattern: /Currently out of stock — notify when back/i, reason: 'Use awaiting next release / join restock list language' },
  { pattern: /Notify when Beles returns/i, reason: 'Use Join Beles restock list CTA' },
  { pattern: /Trade registration and VAT details will be published/i, reason: 'CVR should be published on /imprint' },
];

const failures = [];

for (const file of htmlFiles) {
  const rel = file.replace(root + (root.includes('\\') ? '\\' : '/'), '').replace(/\\/g, '/');
  const text = readFileSync(file, 'utf8');
  for (const { pattern, reason } of RULES) {
    if (pattern.test(text)) failures.push(`${rel}: ${reason}`);
  }
}

if (failures.length) {
  console.error(`\n✗ Copy verification failed (${failures.length}):\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`✓ Copy verification OK (${htmlFiles.length} HTML files checked)`);
