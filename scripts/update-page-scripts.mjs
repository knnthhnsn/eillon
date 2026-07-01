#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const editorial = `<script src="/scripts/global-core.min.js?v=1" defer></script>
  <script src="/scripts/shared-interactions.min.js?v=1" defer></script>`;

const beles = `<script src="/scripts/global-core.min.js?v=1" defer></script>
  <script src="/scripts/shared-interactions.min.js?v=1" defer></script>
  <script src="/scripts/beles-shop.min.js?v=1" defer></script>`;

const chapter = `<script src="/scripts/global-core.min.js?v=1" defer></script>
  <script src="/scripts/shared-interactions.min.js?v=1" defer></script>
  <script src="/scripts/chapter-interactions.min.js?v=1" defer></script>`;

const map = {
  'beles.html': beles,
  'asmara.html': chapter,
  'massawa.html': chapter,
  'ritual.html': chapter,
  'store.html': editorial,
};

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory() && name !== 'node_modules') walk(p);
    else if (name.endsWith('.html')) {
      const rel = relative(root, p).replace(/\\/g, '/');
      if (rel === 'index.html') continue;
      let content = readFileSync(p, 'utf8');
      if (!/script\.js/.test(content)) continue;
      const replacement = map[rel] || map[name] || editorial;
      const next = content.replace(
        /\s*<script src="[^"]*script\.js[^"]*" defer><\/script>\s*/g,
        `\n  ${replacement}\n`,
      );
      if (next !== content) {
        writeFileSync(p, next);
        console.log('updated', rel);
      }
    }
  }
}

walk(root);
