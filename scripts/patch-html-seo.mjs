#!/usr/bin/env node
/** One-shot SEO + perf head patches for editorial HTML pages. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Inter:wght@300;400;500;600&display=optional';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(full, out);
    } else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function patch(html, file) {
  const base = file.replace(/\\/g, '/');
  if (base.endsWith('/index.html') || base.endsWith('/waitlist-admin.html')) return html;

  let next = html;

  next = next.replace(
    /content="width=device-width, initial-scale=1\.0"/g,
    'content="width=device-width, initial-scale=1.0, viewport-fit=cover"',
  );

  next = next.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Fraunces[^"]+display=swap" rel="stylesheet" \/>/,
    `<link rel="preload" as="style" href="${FONT_URL}" />\n  <link href="${FONT_URL}" rel="stylesheet" media="print" onload="this.media='all'" />\n  <noscript><link href="${FONT_URL}" rel="stylesheet" /></noscript>`,
  );

  next = next.replace(
    /<script src="(\/scripts\/site-nav\.js\?v=\d+)"(?!\s+defer)><\/script>/g,
    '<script src="$1" defer></script>',
  );

  if (next.includes('name="robots"') && !next.includes('name="googlebot"')) {
    next = next.replace(
      /<meta name="robots" content="index, follow" \/>/,
      '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />\n  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />',
    );
  }

  if (next.includes('rel="canonical"') && !next.includes('rel="sitemap"')) {
    const canon = next.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];
    if (canon) {
      next = next.replace(
        /(<link rel="canonical" href="[^"]+" \/>)/,
        `$1\n  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />\n  <link rel="alternate" hreflang="en-dk" href="${canon}" />\n  <link rel="alternate" hreflang="en" href="${canon}" />\n  <link rel="alternate" hreflang="x-default" href="${canon}" />`,
      );
    }
  }

  next = next.replace(/\/site\.min\.css\?v=\d+/g, '/site.min.css?v=59');

  return next;
}

let count = 0;
for (const file of walk(root)) {
  const before = readFileSync(file, 'utf8');
  const after = patch(before, file);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    count += 1;
    console.log('patched', file.replace(root, '').replace(/^[/\\]/, ''));
  }
}
console.log(`Done — ${count} files updated.`);
