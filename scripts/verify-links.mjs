#!/usr/bin/env node
/**
 * Verify internal root-relative links in HTML point at existing files.
 */
import { readFileSync, existsSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory() && name !== 'node_modules' && name !== '.git') walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
}

walk(root);

const hrefPattern = /href="(\/(?!\/)[^"#?]+)/g;
const failures = [];

for (const file of htmlFiles) {
  const text = readFileSync(file, 'utf8');
  let match;
  while ((match = hrefPattern.exec(text)) !== null) {
    let target = match[1];
    if (target.endsWith('/')) target = target.slice(0, -1);
    const rel = target.replace(/^\//, '');
    const candidates = [
      join(root, rel),
      join(root, `${rel}.html`),
      join(root, rel, 'index.html'),
    ];
    if (!candidates.some((p) => existsSync(p))) {
      failures.push(`${file.replace(root + '\\', '').replace(root + '/', '')} → ${target}`);
    }
  }
}

if (failures.length) {
  console.error(`\n✗ Broken internal links (${failures.length}):\n`);
  [...new Set(failures)].slice(0, 40).forEach((f) => console.error(`  - ${f}`));
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
  process.exit(1);
}

console.log(`✓ Internal links OK (${htmlFiles.length} HTML files checked)`);
