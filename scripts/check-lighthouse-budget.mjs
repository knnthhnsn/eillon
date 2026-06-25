#!/usr/bin/env node
/**
 * Assert Lighthouse performance budgets from a JSON report.
 * Usage: node scripts/check-lighthouse-budget.mjs lighthouse-report-latest.json
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node scripts/check-lighthouse-budget.mjs <report.json>');
  process.exit(1);
}

const report = JSON.parse(readFileSync(path, 'utf8'));
const perf = Math.round((report.categories?.performance?.score ?? 0) * 100);
const lcp = report.audits?.['largest-contentful-paint']?.numericValue ?? Infinity;
const cls = report.audits?.['cumulative-layout-shift']?.numericValue ?? Infinity;

const budgets = {
  performanceMin: Number(process.env.LH_PERF_MIN || 85),
  lcpMaxMs: Number(process.env.LH_LCP_MAX_MS || 3000),
  clsMax: Number(process.env.LH_CLS_MAX || 0.1),
};

const failures = [];
if (perf < budgets.performanceMin) failures.push(`performance ${perf} < ${budgets.performanceMin}`);
if (lcp > budgets.lcpMaxMs) failures.push(`LCP ${Math.round(lcp)}ms > ${budgets.lcpMaxMs}ms`);
if (cls > budgets.clsMax) failures.push(`CLS ${cls.toFixed(3)} > ${budgets.clsMax}`);

if (failures.length) {
  console.error(`\n✗ Lighthouse budget failed for ${path}:\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`✓ Lighthouse budget OK — performance ${perf}, LCP ${Math.round(lcp)}ms, CLS ${cls.toFixed(3)}`);
