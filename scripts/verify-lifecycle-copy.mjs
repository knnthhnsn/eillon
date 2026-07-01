#!/usr/bin/env node
/**
 * Guard lifecycle language on homepage and chapter pages.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

const index = read('index.html');
if (index.includes('<p class="mv-chapter__status">Out of stock</p>')) {
  failures.push('index.html: homepage Beles status still says "Out of stock"');
}
if (/six letters folded/i.test(index)) {
  failures.push('index.html: homepage still says "six letters folded"');
}
if (/\d+\s+letters\s+folded/i.test(index)) {
  failures.push('index.html: use numberless archive copy ("house letters folded on the desk...")');
}

const asmara = read('asmara.html');
if (/Out of stock/i.test(asmara)) {
  failures.push('asmara.html: contains "Out of stock"');
}
if (/Notify when back/i.test(asmara)) {
  failures.push('asmara.html: contains "Notify when back"');
}
if (/returns to the boutique/i.test(stripComments(asmara))) {
  failures.push('asmara.html: visible copy still says "returns to the boutique"');
}

const massawa = read('massawa.html');
if (/Out of stock/i.test(massawa)) {
  failures.push('massawa.html: contains "Out of stock"');
}
if (/Notify when back/i.test(massawa)) {
  failures.push('massawa.html: contains "Notify when back"');
}

const ritual = read('ritual.html');
if (/Out of stock/i.test(ritual)) {
  failures.push('ritual.html: contains "Out of stock"');
}
if (/"offers"\s*:/.test(ritual)) {
  failures.push('ritual.html: Product schema must omit offers');
}

const ritualVisible = stripComments(ritual);
if (/restock/i.test(ritualVisible)) {
  failures.push('ritual.html: visible copy contains "restock" (not allowlisted)');
}

for (const [file, label] of [
  ['asmara.html', 'Asmara'],
  ['massawa.html', 'Massawa'],
]) {
  const html = stripComments(read(file));
  if (/returns to the boutique/i.test(html)) {
    failures.push(`${file}: visible copy contains "returns to the boutique"`);
  }
}

if (failures.length) {
  console.error('✗ Lifecycle copy verification failed:\n');
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('✓ Lifecycle copy verification passed');
