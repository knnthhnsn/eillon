#!/usr/bin/env node
/**
 * Notify Google Search Console that sitemap.xml was updated.
 * Usage: npm run gsc:ping
 */
const SITEMAP = 'https://eillon.maison/sitemap.xml';
const PING = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`;

const res = await fetch(PING, { method: 'GET', redirect: 'follow' });
if (!res.ok) {
  console.error(`✗ GSC sitemap ping failed (${res.status})`);
  process.exit(1);
}
console.log(`✓ GSC sitemap ping OK — ${SITEMAP}`);
