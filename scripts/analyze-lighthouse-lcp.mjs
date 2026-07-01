#!/usr/bin/env node
/**
 * Parse Lighthouse JSON and write LCP-focused performance analysis.
 *
 * Usage: node scripts/analyze-lighthouse-lcp.mjs [report.json]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(root, 'artifacts', 'performance');
const OUT_JSON = join(OUT_DIR, 'lcp-analysis.json');
const OUT_MD = join(OUT_DIR, 'lcp-analysis.md');

const candidates = [
  process.argv[2],
  join(root, 'lighthouse-report-ci.json'),
  join(root, 'lighthouse-report-latest.json'),
].filter(Boolean);

const reportPath = candidates.find((p) => existsSync(p));
if (!reportPath) {
  console.error('No Lighthouse report found. Run npm run lighthouse:ci first.');
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const audits = report.audits || {};

function auditValue(id) {
  return audits[id]?.numericValue ?? null;
}

function auditDisplay(id) {
  return audits[id]?.displayValue ?? null;
}

function extractLcpElement() {
  const audit = audits['largest-contentful-paint-element'];
  if (!audit?.details?.items?.length) return null;

  let node = null;
  let phases = [];
  for (const item of audit.details.items) {
    if (item.type === 'table' && item.items?.[0]?.node) {
      node = item.items[0].node;
    }
    if (item.type === 'table' && item.items?.[0]?.phase) {
      phases = item.items;
    }
  }
  return {
    selector: node?.selector || null,
    snippet: node?.snippet || null,
    nodeLabel: node?.nodeLabel || null,
    path: node?.path || null,
    phases,
  };
}

function extractNetworkRequests() {
  const audit = audits['network-requests'];
  if (!audit?.details?.items?.length) return [];
  return audit.details.items
    .map((item) => ({
      url: item.url,
      resourceType: item.resourceType,
      transferSize: item.transferSize || 0,
      startTime: item.startTime,
      endTime: item.endTime,
      statusCode: item.statusCode,
    }))
    .sort((a, b) => b.transferSize - a.transferSize);
}

function extractByteWeightByType() {
  const audit = audits['total-byte-weight'];
  const items = audit?.details?.items || [];
  const byType = {};
  for (const item of items) {
    const type = item.label || 'other';
    byType[type] = (byType[type] || 0) + (item.totalBytes || 0);
  }
  return { totalBytes: audit?.numericValue || null, byType, items };
}

function extractRenderBlocking() {
  const audit = audits['render-blocking-resources'];
  if (!audit?.details?.items?.length) return [];
  return audit.details.items.map((item) => ({
    url: item.url,
    wastedMs: item.wastedMs,
    totalBytes: item.totalBytes,
  }));
}

function extractUnused(auditId) {
  const audit = audits[auditId];
  if (!audit?.details?.items?.length) return { wastedBytes: audit?.numericValue || 0, items: [] };
  return {
    wastedBytes: audit.numericValue || 0,
    displayValue: audit.displayValue,
    items: audit.details.items.map((item) => ({
      url: item.url,
      wastedBytes: item.wastedBytes,
      wastedPercent: item.wastedPercent,
      totalBytes: item.totalBytes,
    })),
  };
}

function extractOpportunities() {
  const oppIds = [
    'render-blocking-resources',
    'unused-css-rules',
    'unused-javascript',
    'uses-responsive-images',
    'offscreen-images',
    'unminified-css',
    'unminified-javascript',
    'uses-text-compression',
    'uses-optimized-images',
    'efficient-animated-content',
    'duplicated-javascript',
    'legacy-javascript',
    'font-display',
    'largest-contentful-paint-element',
  ];
  return oppIds
    .filter((id) => audits[id]?.score !== null && audits[id]?.score < 1)
    .map((id) => ({
      id,
      title: audits[id].title,
      score: audits[id].score,
      displayValue: audits[id].displayValue,
      numericValue: audits[id].numericValue,
      description: audits[id].description?.slice(0, 200),
    }))
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
}

function extractBootScripts(network, lcpMs) {
  return network
    .filter((r) => r.resourceType === 'Script' || /\.js(\?|$)/i.test(r.url))
    .filter((r) => r.endTime <= lcpMs + 50 || r.startTime <= lcpMs)
    .map((r) => ({
      url: r.url,
      transferSize: r.transferSize,
      startTime: r.startTime,
      endTime: r.endTime,
      blockingHint: r.endTime > lcpMs * 0.4 ? 'likely_pre_lcp_parse' : 'may_overlap_lcp',
    }))
    .sort((a, b) => b.transferSize - a.transferSize);
}

function classifyLcpElement(lcpElement) {
  const haystack = `${lcpElement?.selector || ''} ${lcpElement?.snippet || ''}`.toLowerCase();
  if (!haystack) return 'unknown';
  if (/<video|data-model-video|\.mp4|\.webm/i.test(lcpElement?.snippet || '')) return 'video';
  if (/<img|picture|\.webp|\.jpg|\.png|\.avif/i.test(lcpElement?.snippet || '')) return 'image';
  if (/h1|h2|p|span|\.word|display|title|text/i.test(haystack)) return 'text';
  return 'unknown';
}

function recommendNextPatch({ lcpType, tbt, lcpMs, scripts, renderBlocking }) {
  if (lcpType === 'text' && tbt > 1000) {
    return 'main_thread_render_delay — defer non-critical JS (home-interactions post-hero), shrink pre-LCP parse, audit below-fold CSS backgrounds';
  }
  if (scripts.some((s) => /script\.min|shared-interactions|beles-shop/i.test(s.url))) {
    return 'route_js_split — ensure homepage does not load shop/chapter bundles before eillon:hero-ready';
  }
  if (renderBlocking.length) {
    return 'render_blocking — defer non-critical stylesheets or inline critical CSS only';
  }
  if (lcpMs > 4500) {
    return 'lcp_budget — hero asset weight or font render delay; run npm run optimize:hero and verify fetchpriority on LCP element only';
  }
  return 'monitor — re-run lighthouse:ci after deploy; compare artifacts/performance/lcp-analysis.json';
}

const performanceScore = Math.round((report.categories?.performance?.score ?? 0) * 100);
const lcpMs = Math.round(auditValue('largest-contentful-paint') || 0);
const cls = auditValue('cumulative-layout-shift');
const tbt = Math.round(auditValue('total-blocking-time') || 0);
const speedIndex = Math.round(auditValue('speed-index') || 0);
const lcpElement = extractLcpElement();
const lcpType = classifyLcpElement(lcpElement);
const network = extractNetworkRequests();
const byteWeight = extractByteWeightByType();
const renderBlocking = extractRenderBlocking();
const unusedCss = extractUnused('unused-css-rules');
const unusedJs = extractUnused('unused-javascript');
const opportunities = extractOpportunities();
const bootScripts = extractBootScripts(network, lcpMs);
const bottleneck = lcpType === 'text' && tbt > 1000 ? 'main_thread_render_delay' : null;
const recommendedNextPatch = recommendNextPatch({
  lcpType,
  tbt,
  lcpMs,
  scripts: bootScripts,
  renderBlocking,
});

const lcpResource = network.find((r) =>
  /cowboy-cowgirl|\.webp|\.jpg|fonts\.gstatic|\.css|\.js/i.test(r.url),
);

const analysis = {
  timestamp: new Date().toISOString(),
  reportPath: reportPath.replace(/\\/g, '/'),
  metrics: {
    performanceScore,
    lcpMs,
    lcpDisplay: auditDisplay('largest-contentful-paint'),
    cls,
    clsDisplay: auditDisplay('cumulative-layout-shift'),
    tbt,
    tbtDisplay: auditDisplay('total-blocking-time'),
    speedIndex,
    speedIndexDisplay: auditDisplay('speed-index'),
  },
  lcpElement,
  lcpElementType: lcpType,
  bottleneck,
  recommendedNextPatch,
  lcpResourceGuess: lcpResource
    ? { url: lcpResource.url, transferSize: lcpResource.transferSize, resourceType: lcpResource.resourceType }
    : null,
  scriptsBeforeLcp: bootScripts.slice(0, 12),
  renderBlocking,
  byteWeight,
  unusedCss,
  unusedJs,
  networkTopBySize: network.slice(0, 15),
  networkEarliest: [...network].sort((a, b) => a.startTime - b.startTime).slice(0, 15),
  opportunities,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(analysis, null, 2)}\n`);

const md = [
  '# LCP analysis',
  '',
  `- **Report:** ${analysis.reportPath}`,
  `- **Performance:** ${performanceScore}`,
  `- **LCP:** ${lcpMs}ms (${auditDisplay('largest-contentful-paint') || 'n/a'})`,
  `- **CLS:** ${cls?.toFixed?.(3) ?? cls}`,
  `- **TBT:** ${tbt}ms`,
  `- **Speed Index:** ${speedIndex}ms`,
  `- **LCP element type:** ${lcpType}`,
  bottleneck ? `- **Bottleneck:** ${bottleneck}` : '',
  `- **Recommended next patch:** ${recommendedNextPatch}`,
  '',
  '## LCP element',
  '',
  lcpElement?.selector ? `- **Selector:** \`${lcpElement.selector}\`` : '- Selector: unknown',
  lcpElement?.snippet ? `- **Snippet:** \`${lcpElement.snippet}\`` : '',
  lcpElement?.nodeLabel ? `- **Label:** ${lcpElement.nodeLabel}` : '',
  '',
  '## Scripts near LCP',
  '',
  ...(bootScripts.length
    ? bootScripts.slice(0, 8).map((s) => `- ${Math.round(s.transferSize / 1024)}KB — ${s.url} (${s.blockingHint})`)
    : ['- none listed']),
  '',
  '## Top opportunities',
  '',
  ...opportunities.slice(0, 8).map((o) => `- **${o.title}** — ${o.displayValue || o.numericValue || ''}`),
  '',
  '## Render-blocking',
  '',
  ...(renderBlocking.length
    ? renderBlocking.map((r) => `- ${r.url} (~${Math.round(r.wastedMs || 0)}ms)`)
    : ['- none listed']),
  '',
  '## Largest transfers',
  '',
  ...network.slice(0, 10).map((r) => `- ${Math.round(r.transferSize / 1024)}KB — ${r.url}`),
  '',
].filter(Boolean);

writeFileSync(OUT_MD, `${md.join('\n')}\n`);

console.log(`✓ LCP analysis written → ${OUT_JSON.replace(/\\/g, '/')}`);
