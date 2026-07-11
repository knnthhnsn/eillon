#!/usr/bin/env node
/**
 * Validate Google crawl readiness and optionally submit the sitemap through
 * the authenticated Search Console API.
 *
 * Usage:
 *   node scripts/gsc-sitemap.mjs --local
 *   node scripts/gsc-sitemap.mjs
 *   GSC_ACCESS_TOKEN=... node scripts/gsc-sitemap.mjs --submit
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = new Set(process.argv.slice(2));
const localOnly = args.has('--local');
const shouldSubmit = args.has('--submit');
const siteOrigin = (process.env.GSC_SITE_ORIGIN || 'https://eillon.maison').replace(/\/+$/, '');
const sitemapUrl = `${siteOrigin}/sitemap.xml`;
const robotsUrl = `${siteOrigin}/robots.txt`;
const siteProperty = process.env.GSC_SITE_PROPERTY || `sc-domain:${new URL(siteOrigin).hostname}`;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

async function readInputs() {
  if (localOnly) {
    const [robots, sitemap] = await Promise.all([
      readFile(join(root, 'robots.txt'), 'utf8'),
      readFile(join(root, 'sitemap.xml'), 'utf8'),
    ]);
    return { robots, sitemap, source: 'local files' };
  }

  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetch(robotsUrl, { redirect: 'follow' }),
    fetch(sitemapUrl, { redirect: 'follow' }),
  ]);

  if (!robotsResponse.ok) fail(`robots.txt returned ${robotsResponse.status}`);
  if (!sitemapResponse.ok) fail(`sitemap.xml returned ${sitemapResponse.status}`);

  const contentType = sitemapResponse.headers.get('content-type') || '';
  if (!/xml/i.test(contentType)) fail(`sitemap.xml has unexpected content type: ${contentType || 'missing'}`);

  const [robots, sitemap] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);
  return { robots, sitemap, source: siteOrigin };
}

function validateRobots(robots) {
  const declaredSitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
  if (!declaredSitemaps.includes(sitemapUrl)) {
    fail(`robots.txt must declare ${sitemapUrl}`);
  }
  if (!/^Disallow:\s*\/api\/\s*$/im.test(robots)) {
    fail('robots.txt must keep /api/ out of crawl paths');
  }
}

function validateSitemap(sitemap) {
  if (!/<urlset\b/i.test(sitemap)) fail('sitemap.xml is missing <urlset>');

  const urls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/gim)].map((match) => match[1].trim());
  if (!urls.length) fail('sitemap.xml contains no page URLs');
  if (new Set(urls).size !== urls.length) fail('sitemap.xml contains duplicate page URLs');

  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== siteOrigin || url.protocol !== 'https:' || url.search || url.hash) {
      fail(`sitemap URL is not canonical: ${value}`);
    }
  }

  const requiredPaths = ['/', '/store', '/beles', '/beles/preorder'];
  for (const path of requiredPaths) {
    if (!urls.includes(`${siteOrigin}${path}`)) fail(`sitemap.xml is missing ${path}`);
  }

  const privatePaths = ['/preorder-admin', '/preorder-success', '/waitlist-admin'];
  for (const path of privatePaths) {
    if (urls.some((url) => new URL(url).pathname === path)) fail(`private route leaked into sitemap: ${path}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/gim)].map((match) => match[1].trim());
  if (lastmods.length !== urls.length) fail('every sitemap URL must have one <lastmod> value');
  for (const value of lastmods) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today) fail(`invalid sitemap lastmod: ${value}`);
  }

  return urls.length;
}

async function submitSitemap() {
  const token = process.env.GSC_ACCESS_TOKEN;
  if (!token) {
    fail('GSC_ACCESS_TOKEN is required for --submit (OAuth scope: webmasters)');
  }

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteProperty)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    fail(`Search Console submission returned ${response.status}: ${detail}`);
  }
  console.log(`OK: submitted ${sitemapUrl} for ${siteProperty}`);
}

const { robots, sitemap, source } = await readInputs();
validateRobots(robots);
const urlCount = validateSitemap(sitemap);
console.log(`OK: GSC crawl readiness verified (${urlCount} URLs, ${source})`);

if (shouldSubmit) {
  if (localOnly) fail('--submit cannot be combined with --local');
  await submitSitemap();
} else if (!localOnly) {
  console.log('INFO: sitemap is discoverable through robots.txt; use gsc:submit with an OAuth access token to submit through the Search Console API.');
}
