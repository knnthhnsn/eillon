#!/usr/bin/env node
/**
 * Prefer WebP (and sized variants) in HTML/JS references for Lighthouse + GSC image URLs.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const REPLACEMENTS = [
  [/images\/flacon-beles\.png(\?v=\d+)?/g, 'images/flacon-beles-1100.webp?v=2'],
  [/images\/flacon-(oliva|asmara|massawa|petricor|ritual|ghost)\.png(\?v=\d+)?/g, 'images/flacon-$1-900.webp?v=2'],
  [/images\/flacon-beles-900\.webp\?v=1/g, 'images/flacon-beles-900.webp?v=2'],
  [/images\/flacon-beles-1100\.webp\?v=1/g, 'images/flacon-beles-1100.webp?v=2'],
  [/images\/flacon-(oliva|asmara|massawa|petricor|ritual)-900\.webp\?v=1/g, 'images/flacon-$1-900.webp?v=2'],
  [/https:\/\/eillon\.maison\/images\/flacon-beles\.png/g, 'https://eillon.maison/images/flacon-beles-1100.webp'],
  [/https:\/\/eillon\.maison\/images\/scent-oliva\.jpg/g, 'https://eillon.maison/images/scent-oliva-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/scent-asmara\.jpg/g, 'https://eillon.maison/images/scent-asmara-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/scent-massawa\.jpg/g, 'https://eillon.maison/images/scent-massawa-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/scent-petricor\.jpg/g, 'https://eillon.maison/images/scent-petricor-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/scent-ritual\.jpg/g, 'https://eillon.maison/images/scent-ritual-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/ritual\.jpg/g, 'https://eillon.maison/images/scent-ritual-1200.webp'],
  [/https:\/\/eillon\.maison\/images\/about-origin\.jpg/g, 'https://eillon.maison/images/about-origin-1400.webp'],
  [/https:\/\/eillon\.maison\/images\/cactus-craft\.jpg/g, 'https://eillon.maison/images/cactus-craft-900.webp'],
  [/https:\/\/eillon\.maison\/images\/beles-concept-1100\.jpg/g, 'https://eillon.maison/images/flacon-beles-900.webp'],
  [/https:\/\/eillon\.maison\/images\/eillon_logo_transparent\.png/g, 'https://eillon.maison/images/eillon_logo_nav.webp'],
  [/images\/eillon_logo_transparent\.png/g, 'images/eillon_logo_nav.webp'],
  [/poster="images\/scent-massawa\.jpg"/g, 'poster="images/scent-massawa-1200.webp"'],
  [/images\/scent-oliva\.jpg/g, 'images/scent-oliva-1200.webp'],
  [/images\/scent-asmara\.jpg/g, 'images/scent-asmara-1200.webp'],
  [/images\/scent-massawa\.jpg/g, 'images/scent-massawa-1200.webp'],
  [/images\/scent-petricor\.jpg/g, 'images/scent-petricor-1200.webp'],
  [/images\/scent-ritual\.jpg/g, 'images/scent-ritual-1200.webp'],
  [/images\/ritual\.jpg/g, 'images/scent-ritual-1200.webp'],
  [/images\/beles-concept-1100\.jpg/g, 'images/flacon-beles-900.webp'],
  [/images\/beles-mood-1122\.jpg/g, 'images/flacon-beles-900.webp'],
];

const INTRO_PICTURE = (scent) => `        <picture>
          <source type="image/webp" srcset="images/${scent}-1200.webp" />
          <img src="images/${scent}-1200.webp" width="1200" height="1500" loading="eager" decoding="async" alt="" />
        </picture>`;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === 'artifacts' || name === 'market-research') continue;
      walk(full, acc);
    } else if (/\.(html|js|mjs)$/.test(name) && !name.endsWith('.min.js')) {
      acc.push(full);
    }
  }
  return acc;
}

function patchIntroPicture(html, scentKey) {
  const bare = new RegExp(
    `<div class="product-intro__media" aria-hidden="true">\\s*<img src="images/${scentKey}-1200\\.webp"[^>]+>\\s*</div>`,
    's',
  );
  if (bare.test(html)) {
    html = html.replace(bare, `<div class="product-intro__media" aria-hidden="true">\n${INTRO_PICTURE(scentKey)}\n      </div>`);
  }
  return html;
}

let changed = 0;
for (const file of walk(root)) {
  let text = readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of REPLACEMENTS) text = text.replace(from, to);
  if (file.endsWith('oliva.html')) text = patchIntroPicture(text, 'scent-oliva');
  if (file.endsWith('asmara.html')) text = patchIntroPicture(text, 'scent-asmara');
  if (file.endsWith('massawa.html')) text = patchIntroPicture(text, 'scent-massawa');
  if (file.endsWith('petricor.html')) text = patchIntroPicture(text, 'scent-petricor');
  if (file.endsWith('ritual.html')) text = patchIntroPicture(text, 'scent-ritual');
  if (text !== before) {
    writeFileSync(file, text, 'utf8');
    changed += 1;
    console.log('patched', file.replace(root + '\\', '').replace(root + '/', ''));
  }
}

console.log(`✓ WebP performance patch complete (${changed} files)`);
