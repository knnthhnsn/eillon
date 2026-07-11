#!/usr/bin/env node
/**
 * Build route-specific JS bundles from split sources + legacy script.js concat.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const scriptsDir = join(root, 'scripts');

const BUNDLE_VERSION = '1';

const SPLITS = [
  { name: 'global-core', src: 'global-core.js' },
  { name: 'home-critical', src: 'home-critical.js' },
  { name: 'home-interactions', includes: ['interactions-core.js', 'home-interactions.js'] },
  { name: 'shared-interactions', includes: ['interactions-core.js', 'shared-interactions.js'] },
  { name: 'beles-shop', src: 'beles-shop.js' },
  { name: 'chapter-interactions', src: 'chapter-interactions.js' },
  { name: 'preorder', src: 'preorder.js' },
];

function minify(inputPath, outputPath) {
  execSync(`npx terser "${inputPath}" -o "${outputPath}" -c -m`, {
    cwd: root,
    stdio: 'pipe',
  });
}

function concatFiles(relativePaths, outputPath) {
  const body = relativePaths
    .map((rel) => readFileSync(join(scriptsDir, rel), 'utf8'))
    .join('\n\n');
  writeFileSync(outputPath, body);
}

function buildBundle({ name, includes }) {
  const outDir = scriptsDir;
  if (includes) {
    const combined = join(outDir, `.${name}.combined.js`);
    concatFiles(includes, combined);
    minify(combined, join(outDir, `${name}.min.js`));
  } else {
    const src = join(outDir, `${name}.js`);
    if (!existsSync(src)) {
      throw new Error(`Missing source: ${src}`);
    }
    minify(src, join(outDir, `${name}.min.js`));
  }
  console.log(`✓ ${name}.min.js`);
}

/** Legacy full bundle for pages still on script.js during migration. */
function buildLegacyScript() {
  const parts = [
    'global-core.js',
    'interactions-core.js',
    'shared-interactions.js',
    'beles-shop.js',
    'chapter-interactions.js',
  ];
  const combined = join(root, '.script.combined.js');
  concatFiles(parts, combined);
  writeFileSync(join(root, 'script.js'), readFileSync(combined, 'utf8'));
  minify(combined, join(root, 'script.min.js'));
  console.log('✓ script.js + script.min.js (legacy concat)');
}

for (const split of SPLITS) {
  buildBundle(split);
}

buildLegacyScript();

const stamp = `/* EILLON JS splits v${BUNDLE_VERSION} — built ${new Date().toISOString()} */\n`;
for (const split of SPLITS) {
  const minPath = join(scriptsDir, `${split.name}.min.js`);
  if (existsSync(minPath)) {
    const content = readFileSync(minPath, 'utf8');
    if (!content.startsWith('/* EILLON')) {
      writeFileSync(minPath, stamp + content);
    }
  }
}

console.log('JS split build complete.');
