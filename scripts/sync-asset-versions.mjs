#!/usr/bin/env node
/**
 * Keep cache-bust query strings in sync across all HTML and bump when min assets change.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const versionsPath = join(root, 'data/asset-versions.json');

const TRACKED = [
  { key: 'stylesMinCss', file: 'styles.min.css', patterns: [/styles\.min\.css\?v=\d+/g] },
  { key: 'siteMinCss', file: 'site.min.css', patterns: [/site\.min\.css\?v=\d+/g] },
  { key: 'homeMinCss', file: 'home.min.css', patterns: [/home\.min\.css\?v=\d+/g] },
  { key: 'lettersMinCss', file: 'letters.min.css', patterns: [/letters\.min\.css\?v=\d+/g] },
  { key: 'siteShadersJs', file: 'scripts/site-shaders.js', patterns: [/site-shaders\.js\?v=\d+/g] },
  { key: 'sharedInteractionsJs', file: 'scripts/shared-interactions.min.js', patterns: [/shared-interactions\.min\.js\?v=\d+/g] },
  { key: 'globalCoreJs', file: 'scripts/global-core.min.js', patterns: [/global-core\.min\.js\?v=\d+/g] },
  { key: 'productsJs', file: 'data/products.js', patterns: [/products\.js\?v=\d+/g] },
];

const JS_PATCHES = [
  { key: 'lettersMinCss', file: 'scripts/letters-lazy.js', pattern: /letters\.min\.css\?v=\d+/g },
];

function hashFile(rel) {
  return createHash('sha256').update(readFileSync(join(root, rel))).digest('hex').slice(0, 12);
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === 'artifacts') continue;
      walkHtml(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function replaceVersion(text, patterns, version) {
  let next = text;
  for (const pattern of patterns) {
    next = next.replace(pattern, (match) => match.replace(/\d+$/, String(version)));
  }
  return next;
}

const ASSET_STAMP_KEYS = ['siteMinCss', 'sharedInteractionsJs', 'productsJs', 'stylesMinCss'];

const ASSET_STAMP_BLOCK_RE =
  /<meta name="eillon-asset-stamp" content="[^"]*" \/>\s*<script>\/\* eillon-asset-stamp \*\/[\s\S]*?<\/script>\s*/;

const ASSET_STAMP_SCRIPT =
  '<script>/* eillon-asset-stamp */(function(){try{var m=document.querySelector(\'meta[name=eillon-asset-stamp]\');if(!m)return;var s=m.content,k=\'eillon:assets:\'+location.pathname,p=sessionStorage.getItem(k);sessionStorage.setItem(k,s);if(p&&p!==s&&!/[?&]refresh=1/.test(location.search)){location.replace(location.pathname+\'?refresh=1\'+location.hash);}}catch(e){}})();</script>\n  ';

function assetStampContent(versions) {
  return ASSET_STAMP_KEYS.map((key) => versions[key] ?? 0).join('.');
}

function assetStampBlock(versions) {
  return `<meta name="eillon-asset-stamp" content="${assetStampContent(versions)}" />\n  ${ASSET_STAMP_SCRIPT}`;
}

function syncAssetStamp(html, versions) {
  const block = assetStampBlock(versions);
  if (ASSET_STAMP_BLOCK_RE.test(html)) {
    return html.replace(ASSET_STAMP_BLOCK_RE, `${block}`);
  }
  return html.replace(
    /(<meta charset="UTF-8" \/>)/,
    `$1\n  ${block}`,
  );
}

const versions = JSON.parse(readFileSync(versionsPath, 'utf8'));
versions.hashes ||= {};

for (const item of TRACKED) {
  const hash = hashFile(item.file);
  const prevHash = versions.hashes[item.file];
  if (prevHash && prevHash !== hash) {
    versions[item.key] = Number(versions[item.key] || 0) + 1;
    console.log(`↑ ${item.key} → v=${versions[item.key]} (${item.file} changed)`);
  } else if (!prevHash && versions[item.key] == null) {
    versions[item.key] = 1;
  }
  versions.hashes[item.file] = hash;
}

let htmlCount = 0;
for (const file of walkHtml(root)) {
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const item of TRACKED) {
    after = replaceVersion(after, item.patterns, versions[item.key]);
  }
  after = syncAssetStamp(after, versions);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    htmlCount += 1;
  }
}

writeFileSync(versionsPath, `${JSON.stringify(versions, null, 2)}\n`);

let jsCount = 0;
for (const item of JS_PATCHES) {
  const file = join(root, item.file);
  const before = readFileSync(file, 'utf8');
  const after = replaceVersion(before, [item.pattern], versions[item.key]);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    jsCount += 1;
  }
}

console.log(`✓ asset versions synced (${htmlCount} HTML, ${jsCount} JS files patched)`);
