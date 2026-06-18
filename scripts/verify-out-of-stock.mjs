#!/usr/bin/env node
/**
 * Verify local repo has out-of-stock marketing (not waitlist-open / in-production).
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;

function read(rel) {
  return readFileSync(`${root}/${rel}`, 'utf8');
}

let rev = 'unknown';
try {
  rev = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
} catch {
  // not a git repo
}

const products = read('data/products.js');
const beles = read('beles.html');
const script = read('script.js');

const failures = [];

if (products.includes('Waitlist open') || products.includes('waitlist-open')) {
  failures.push('data/products.js still has waitlist-open / Waitlist open');
}
if (products.includes('In production') || products.includes('in-production')) {
  failures.push('data/products.js still has in-production');
}
if (!products.includes("statusLabel: 'Out of stock'")) {
  failures.push('data/products.js missing Out of stock statusLabel');
}
if (beles.includes('Waitlist open') || beles.includes('JOIN THE WAITLIST')) {
  failures.push('beles.html still has waitlist marketing copy');
}
if (script.includes('product.status !== \'waitlist-open\'')) {
  failures.push('script.js still uses old waitlist-open overlay logic');
}

if (failures.length) {
  console.error(`\n✗ Out-of-stock marketing NOT ready (git ${rev})\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  console.error('\nRun: git pull origin main\n');
  process.exit(1);
}

console.log(`✓ Out-of-stock marketing OK (git ${rev})`);
console.log('  Store grid → Out of stock on all chapters');
console.log('  Beles → Boutique — Out of stock, Notify when back');
