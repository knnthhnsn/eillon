#!/usr/bin/env node
/**
 * Verify product lifecycle labels match the current commercial truth model.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

let rev = 'unknown';
try {
  rev = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
} catch {
  // not a git repo
}

const products = read('data/products.js');
const beles = read('beles.html');
const ritual = read('ritual.html');

const failures = [];

if (products.includes('waitlist-open') || products.includes('Waitlist open')) {
  failures.push('data/products.js still has waitlist-open / Waitlist open');
}
if (!products.includes("status: 'awaiting-next-release'")) {
  failures.push('data/products.js missing Beles awaiting-next-release status');
}
if (!products.includes("status: 'studio-archive'")) {
  failures.push('data/products.js missing Ritual studio-archive status');
}
if (ritual.includes('Notify when back') && !ritual.includes('Follow the study')) {
  failures.push('ritual.html still uses Notify when back CTA');
}
if (beles.includes('JOIN THE WAITLIST')) {
  failures.push('beles.html still has old waitlist marketing copy');
}

if (failures.length) {
  console.error(`\n✗ Product lifecycle labels NOT ready (git ${rev})\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`✓ Product lifecycle labels OK (git ${rev})`);
