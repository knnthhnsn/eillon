#!/usr/bin/env node
/** Guard product structured data against invented commerce and review claims. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'artifacts', 'market-research'].includes(name)) walk(full);
    } else if (name.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}

function rel(file) {
  return file.slice(root.length + 1).replace(/\\/g, '/');
}

function visibleText(html) {
  return html
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/<(script|style|template)\b[^>]*>[^]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&euro;|&#8364;/gi, '€')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function schemaBlocks(html, file) {
  const blocks = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([^]*?)<\/script>/gi)) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      blocks.push({ raw, data: JSON.parse(raw) });
    } catch {
      failures.push(`${rel(file)}: invalid JSON-LD`);
    }
  }
  return blocks;
}

function visit(value, callback) {
  if (!value || typeof value !== 'object') return;
  callback(value);
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, callback));
    return;
  }
  Object.values(value).forEach((item) => visit(item, callback));
}

walk(root);

for (const file of htmlFiles) {
  const path = rel(file);
  const html = readFileSync(file, 'utf8');
  const text = visibleText(html);
  const schemas = schemaBlocks(html, file);
  let hasAggregateRating = false;
  let hasReview = false;
  let hasPreorder = false;

  for (const { raw, data } of schemas) {
    if (/\bPreOrder\b/.test(raw)) hasPreorder = true;
    visit(data, (node) => {
      if (Object.hasOwn(node, 'aggregateRating')) hasAggregateRating = true;
      if (Object.hasOwn(node, 'review') || node['@type'] === 'Review') hasReview = true;
    });
  }

  if (hasAggregateRating && !/data-real-rating\s*=/.test(html)) {
    failures.push(`${path}: aggregateRating requires a visible, real rating record`);
  }
  if (hasAggregateRating && !/\b\d+(?:\.\d+)?\s*(?:\/\s*5|out of 5)\b/i.test(text)) {
    failures.push(`${path}: aggregateRating value is not visible in page copy`);
  }
  if (hasReview && !/data-real-review\s*=/.test(html)) {
    failures.push(`${path}: Review schema requires visible real review markup`);
  }
  if (hasPreorder && path !== 'beles/preorder.html') {
    failures.push(`${path}: PreOrder schema is allowed only on beles/preorder.html`);
  }
  if (hasPreorder && !/(paid founder preorder|paid offer|paid validation window)/i.test(text)) {
    failures.push(`${path}: PreOrder schema has no visible paid preorder copy`);
  }
}

const ritualPath = join(root, 'ritual.html');
if (existsSync(ritualPath)) {
  const ritualHtml = readFileSync(ritualPath, 'utf8');
  for (const { data } of schemaBlocks(ritualHtml, ritualPath)) {
    visit(data, (node) => {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('Product') && Object.hasOwn(node, 'offers')) {
        failures.push('ritual.html: Ritual Product schema must not contain offers');
      }
    });
  }
}

const preorderPagePath = join(root, 'beles', 'preorder.html');
const preorderScriptPath = join(root, 'scripts', 'preorder.js');
if (!existsSync(preorderPagePath)) {
  failures.push('beles/preorder.html: missing preorder page');
} else {
  const html = readFileSync(preorderPagePath, 'utf8');
  const text = visibleText(html);
  for (const phrase of [
    'Founder Sample Preorder',
    '€28',
    'Founder Bottle Reservation',
    '€30',
    'No full bottle payment today',
  ]) {
    if (!text.includes(phrase)) failures.push(`beles/preorder.html: missing visible paid copy "${phrase}"`);
  }
  if (!/data-preorder-checkout/.test(html)) {
    failures.push('beles/preorder.html: no visible checkout controls');
  }
}

if (!existsSync(preorderScriptPath)) {
  failures.push('scripts/preorder.js: missing dynamic preorder schema wiring');
} else {
  const script = readFileSync(preorderScriptPath, 'utf8');
  if (/\bPreOrder\b/.test(script)) {
    if (!/checkoutEnabled/.test(script) || !/injectProductSchema/.test(script)) {
      failures.push('scripts/preorder.js: PreOrder schema must be gated by live checkout state');
    }
    if (!existsSync(preorderPagePath) || !/scripts\/preorder\.min\.js/.test(readFileSync(preorderPagePath, 'utf8'))) {
      failures.push('beles/preorder.html: dynamic PreOrder schema script is not linked');
    }
  }
}

if (failures.length) {
  console.error('✗ Product schema truth verification failed:\n');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`✓ Product schema truth verified (${htmlFiles.length} HTML files)`);
