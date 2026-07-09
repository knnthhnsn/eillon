#!/usr/bin/env node
/**
 * Generate sitemap.xml from route config and HTML file mtimes.
 */
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const BASE = 'https://eillon.maison';

const ROUTES = [
  { path: '/', file: 'index.html', priority: '1.0', changefreq: 'weekly', image: 'images/flacon-beles-1100.webp', imageTitle: 'EILLON — Afro-Mediterranean Memory Perfumery' },
  { path: '/answers', file: 'answers.html', priority: '0.78', changefreq: 'weekly', image: 'images/about-studio-1400.webp', imageTitle: 'House Index — EILLON answers, proof & chapter status' },
  { path: '/store', file: 'store.html', priority: '0.95', changefreq: 'weekly', image: 'images/flacon-beles-1100.webp', imageTitle: 'The Boutique — EILLON fragrance chapters' },
  { path: '/beles', file: 'beles.html', priority: '0.9', changefreq: 'weekly', image: 'images/flacon-beles-1100.webp', imageTitle: "Beles · Fico d'India — Oil-rich Parfum" },
  { path: '/prickly-pear-parfum', file: 'prickly-pear-parfum.html', priority: '0.82', changefreq: 'monthly', image: 'images/palette-desert-fruit.webp', imageTitle: 'Prickly pear parfum — Beles · Fico d India' },
  { path: '/oliva', file: 'oliva.html', priority: '0.85', changefreq: 'weekly', image: 'images/scent-oliva-1200.webp', imageTitle: 'Oliva · Olive Grove — Parfum concept' },
  { path: '/asmara', file: 'asmara.html', priority: '0.85', changefreq: 'weekly', image: 'images/scent-asmara-1200.webp', imageTitle: 'Asmara · Rain on Stone — Parfum concept' },
  { path: '/massawa', file: 'massawa.html', priority: '0.85', changefreq: 'weekly', image: 'images/scent-massawa-1200.webp', imageTitle: 'Massawa · Red Sea Citrus — Parfum concept' },
  { path: '/petricor', file: 'petricor.html', priority: '0.85', changefreq: 'weekly', image: 'images/scent-petricor-1200.webp', imageTitle: 'Petricor · Wet Earth — Parfum concept' },
  { path: '/ritual', file: 'ritual.html', priority: '0.8', changefreq: 'monthly', image: 'images/scent-ritual-1200.webp', imageTitle: 'Ritual · Frankincense & Myrrh — Lab study' },
  { path: '/journal', file: 'journal.html', priority: '0.7', changefreq: 'monthly', image: 'images/about-studio-1400.webp', imageTitle: 'EILLON Journal — studio notes from Copenhagen' },
  { path: '/journal/fico-d-india', file: 'journal/fico-d-india.html', priority: '0.75', changefreq: 'monthly', image: 'images/flacon-beles-900.webp', imageTitle: "What Fico d'India means in Beles" },
  { path: '/journal/what-does-fico-d-india-smell-like', file: 'journal/what-does-fico-d-india-smell-like.html', priority: '0.76', changefreq: 'monthly', image: 'images/palette-desert-fruit.webp', imageTitle: "What does Fico d'India smell like" },
  { path: '/journal/the-bottle', file: 'journal/the-bottle.html', priority: '0.75', changefreq: 'monthly', image: 'images/flacon-beles-900.webp', imageTitle: 'The EILLON Beles bottle' },
  { path: '/journal/beles-batch-bl001', file: 'journal/beles-batch-bl001.html', priority: '0.75', changefreq: 'monthly', image: 'images/flacon-beles-900.webp', imageTitle: 'Beles pilot batch BL-001 traceability' },
  { path: '/wear', file: 'wear.html', priority: '0.65', changefreq: 'monthly' },
  { path: '/about', file: 'about.html', priority: '0.75', changefreq: 'monthly', image: 'images/about-origin-1400.webp', imageTitle: 'About EILLON — Copenhagen perfume maison' },
  { path: '/craftsmanship', file: 'craftsmanship.html', priority: '0.75', changefreq: 'monthly', image: 'images/cactus-craft-900.webp', imageTitle: 'Craftsmanship — EILLON parfum production' },
  { path: '/shipping', file: 'shipping.html', priority: '0.55', changefreq: 'yearly' },
  { path: '/privacy', file: 'privacy.html', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', file: 'terms.html', priority: '0.3', changefreq: 'yearly' },
  { path: '/imprint', file: 'imprint.html', priority: '0.3', changefreq: 'yearly' },
];

function lastmodFor(file) {
  const full = join(root, file);
  if (!existsSync(full)) return new Date().toISOString().slice(0, 10);
  return statSync(full).mtime.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const urls = ROUTES.map((route) => {
  const lastmod = lastmodFor(route.file);
  let block = `  <url>\n    <loc>${BASE}${route.path === '/' ? '/' : route.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>`;
  if (route.image) {
    block += `\n    <image:image>\n      <image:loc>${BASE}/${route.image.replace(/^\//, '')}</image:loc>\n      <image:title>${escapeXml(route.imageTitle || route.path)}</image:title>\n    </image:image>`;
  }
  block += '\n  </url>';
  return block;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;

writeFileSync(join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml generated (${ROUTES.length} routes)`);
