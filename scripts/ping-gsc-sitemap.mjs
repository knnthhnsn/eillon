#!/usr/bin/env node
/**
 * Notify search engines that sitemap.xml was updated.
 * Google deprecated unauthenticated sitemap ping (returns 404); rely on
 * robots.txt + Search Console submission + accurate lastmod instead.
 *
 * Usage: npm run gsc:ping
 */
const SITEMAP = 'https://eillon.maison/sitemap.xml';
const GOOGLE_PING = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`;
const BING_PING = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`;

const sitemapRes = await fetch(SITEMAP, { redirect: 'follow' });
if (!sitemapRes.ok) {
  console.error(`✗ Sitemap fetch failed (${sitemapRes.status}) — ${SITEMAP}`);
  process.exit(1);
}
const body = await sitemapRes.text();
if (!body.includes('<urlset') || !body.includes('flacon-beles-1100.webp')) {
  console.error('✗ Sitemap missing expected WebP image entries');
  process.exit(1);
}
console.log(`✓ Sitemap live — ${SITEMAP} (${body.match(/<url>/g)?.length ?? 0} URLs)`);

const googleRes = await fetch(GOOGLE_PING, { method: 'GET', redirect: 'follow' });
if (googleRes.status === 404) {
  console.log('ℹ Google sitemap ping deprecated (404) — use Search Console + robots.txt lastmod');
} else if (!googleRes.ok) {
  console.warn(`⚠ Google ping unexpected status (${googleRes.status})`);
} else {
  console.log('✓ Google sitemap ping OK');
}

const bingRes = await fetch(BING_PING, { method: 'GET', redirect: 'follow' });
if (!bingRes.ok) {
  console.warn(`⚠ Bing sitemap ping failed (${bingRes.status})`);
} else {
  console.log(`✓ Bing sitemap ping OK — ${SITEMAP}`);
}
