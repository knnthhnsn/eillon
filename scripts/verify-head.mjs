#!/usr/bin/env node
/**
 * Guard against duplicate hreflang tags and malformed head markup.
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
    if (stat.isDirectory() && !['node_modules', '.git', 'artifacts'].includes(name)) walk(path);
    else if (name.endsWith('.html') && !name.includes('waitlist-admin')) htmlFiles.push(path);
  }
}
walk(root);

const failures = [];

for (const file of htmlFiles) {
  const rel = file.replace(root + (root.includes('\\') ? '\\' : '/'), '').replace(/\\/g, '/');
  const headMatch = readFileSync(file, 'utf8').match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) continue;
  const head = headMatch[1];

  const hreflangMatches = [...head.matchAll(/hreflang="([^"]+)"/gi)];
  const seen = new Map();
  for (const match of hreflangMatches) {
    const lang = match[1].toLowerCase();
    seen.set(lang, (seen.get(lang) || 0) + 1);
  }
  for (const [lang, count] of seen) {
    if (count > 1) {
      failures.push(`${rel}: duplicate hreflang="${lang}" (${count}× in <head>)`);
    }
  }

  const noscriptBlocks = [...head.matchAll(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi)];
  for (const match of noscriptBlocks) {
    const inner = match[1];
    if (/<link[^>]+rel="preload"/i.test(inner)) {
      failures.push(`${rel}: preload link inside <noscript> in <head>`);
    }
    if (/<noscript/i.test(inner)) {
      failures.push(`${rel}: nested <noscript> in <head>`);
    }
  }
}

if (failures.length) {
  console.error('\n✗ Head markup verification failed\n');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`✓ Head markup OK (${htmlFiles.length} HTML files)`);
