#!/usr/bin/env node
/** Verify AEO assets, lifecycle alignment, visible answers, and schema parity. */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EILLON_AEO_PAGE_MAP, EILLON_ANSWERS } from '../data/answers.mjs';
import { AEO_MARKER_START } from './lib/aeo-shared.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory() && name !== 'node_modules') walkHtml(p, out);
    else if (name.endsWith('.html')) out.push(p.slice(root.length + 1).replace(/\\/g, '/'));
  }
  return out;
}

// llms.txt lifecycle
const llms = existsSync(join(root, 'llms.txt')) ? read('llms.txt') : '';
if (/all chapters are currently out of stock/i.test(llms)) {
  failures.push('llms.txt still says all chapters are out of stock');
}
if (/Ritual — Out of stock/i.test(llms)) {
  failures.push('llms.txt says Ritual out of stock');
}

const lifecycle = read('data/lifecycle.js');
for (const [slug, label] of [
  ['beles', 'Awaiting next release'],
  ['asmara', 'In development'],
  ['massawa', 'In development'],
  ['petricor', 'In development'],
  ['ritual', 'Studio archive'],
]) {
  if (!llms.includes(label)) {
    failures.push(`llms.txt missing lifecycle label "${label}" for ${slug}`);
  }
  const lifecycleLabel = lifecycle.match(new RegExp(`${slug}:[\\s\\S]*?statusLabel:\\s*'([^']+)'`))?.[1];
  if (lifecycleLabel && !llms.includes(lifecycleLabel)) {
    failures.push(`llms.txt lifecycle for ${slug} differs from data/lifecycle.js (${lifecycleLabel})`);
  }
}

if (!existsSync(join(root, 'llms-full.txt'))) {
  failures.push('llms-full.txt missing');
}

const robots = read('robots.txt');
if (!/Allow:\s*\/llms-full\.txt/i.test(robots)) {
  failures.push('robots.txt must Allow /llms-full.txt');
}

// Required answer blocks
for (const rel of ['/beles', '/craftsmanship', '/wear', '/journal']) {
  const file = rel === '/journal' ? 'journal.html' : `${rel.slice(1)}.html`;
  const html = read(file);
  if (!html.includes('class="answer-ledger"') && !html.includes(AEO_MARKER_START)) {
    failures.push(`${file}: missing answer-ledger block`);
  }
}

// Duplicate anchors (per page)
for (const relPath of Object.keys(EILLON_AEO_PAGE_MAP)) {
  const html = read(relPath);
  const seen = new Set();
  for (const m of html.matchAll(/\bid="(answer-[^"]+)"/g)) {
    if (seen.has(m[1])) failures.push(`${relPath}: duplicate answer anchor #${m[1]}`);
    seen.add(m[1]);
  }
}

// FAQPage visible parity
for (const relPath of Object.keys(EILLON_AEO_PAGE_MAP)) {
  const html = stripComments(read(relPath));
  const scriptMatch = html.match(/<script[^>]*id="eillon-aeo-schema"[^>]*>([\s\S]*?)<\/script>/);
  if (!scriptMatch) continue;
  try {
    const data = JSON.parse(scriptMatch[1].trim());
    const graph = data['@graph'] || [];
    for (const node of graph) {
      if (node['@type'] !== 'FAQPage') continue;
      for (const q of node.mainEntity || []) {
        const name = q.name;
        if (name && !html.includes(name)) {
          failures.push(`${relPath}: FAQPage question not visible — "${name}"`);
        }
      }
    }
  } catch {
    failures.push(`${relPath}: could not parse eillon-aeo-schema JSON`);
  }
}

// Product / Ritual offers
const ritual = read('ritual.html');
if (/"offers"\s*:/.test(stripComments(ritual))) {
  failures.push('ritual.html: Product schema must not include offers');
}

const beles = read('beles.html');
if (!/"OutOfStock"/.test(beles) && !/OutOfStock/.test(beles)) {
  failures.push('beles.html: Product schema should remain OutOfStock');
}

// Journal Article schema
const allHtml = walkHtml(root);
for (const rel of allHtml.filter((p) => p.startsWith('journal/') && p !== 'journal.html')) {
  const html = read(rel);
  if (!/"@type":\s*"Article"/.test(html)) {
    failures.push(`${rel}: missing Article schema`);
  }
}

// answers.html House Index
if (!existsSync(join(root, 'answers.html'))) {
  failures.push('answers.html missing — House Index route');
} else {
  const answersHtml = read('answers.html');
  if (!answersHtml.includes('class="answer-index"') && !answersHtml.includes('answer-index-page')) {
    failures.push('answers.html: missing House Index layout');
  }
  if (!answersHtml.includes('https://eillon.maison/answers')) {
    failures.push('answers.html: missing canonical URL');
  }
}

if (existsSync(join(root, 'sitemap.xml'))) {
  const sitemap = read('sitemap.xml');
  if (!sitemap.includes('/answers')) {
    failures.push('sitemap.xml missing /answers route');
  }
}

if (!existsSync(join(root, 'data/answers.js'))) {
  failures.push('data/answers.js missing — run npm run build:aeo');
}

if (failures.length) {
  console.error('✗ AEO verification failed:\n');
  failures.forEach((f) => console.error(`  • ${f}`));
  process.exit(1);
}

console.log(`✓ AEO verification passed (${EILLON_ANSWERS.length} canonical answers)`);
