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
const tbt = report.audits?.['total-blocking-time']?.numericValue ?? 0;

const budgets = {
  /* CI passes LH_PERF_MIN/LH_LCP_MAX_MS via run-lighthouse-ci.mjs (defaults 60 / 4500). */
  performanceMin: Number(process.env.LH_PERF_MIN || 85),
  lcpMaxMs: Number(process.env.LH_LCP_MAX_MS || 3000),
  clsMax: Number(process.env.LH_CLS_MAX || 0.1),
  tbtMaxMs: Number(process.env.LH_TBT_MAX_MS || 0),
  tbtWarnMs: Number(process.env.LH_TBT_WARN_MS || 1000),
};

const failures = [];
const warnings = [];

if (perf < budgets.performanceMin) failures.push(`performance ${perf} < ${budgets.performanceMin}`);
if (lcp > budgets.lcpMaxMs) failures.push(`LCP ${Math.round(lcp)}ms > ${budgets.lcpMaxMs}ms`);
if (cls > budgets.clsMax) failures.push(`CLS ${cls.toFixed(3)} > ${budgets.clsMax}`);
if (budgets.tbtMaxMs > 0 && tbt > budgets.tbtMaxMs) {
  failures.push(`TBT ${Math.round(tbt)}ms > ${budgets.tbtMaxMs}ms`);
}
if (tbt > budgets.tbtWarnMs) {
  warnings.push(`TBT ${Math.round(tbt)}ms > ${budgets.tbtWarnMs}ms warning budget`);
}

if (failures.length) {
  console.error(`\n✗ Lighthouse budget failed for ${path}:\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

if (warnings.length) {
  console.warn(`\n⚠ Lighthouse budget warnings for ${path}:\n`);
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

console.log(`✓ Lighthouse budget OK — performance ${perf}, LCP ${Math.round(lcp)}ms, CLS ${cls.toFixed(3)}, TBT ${Math.round(tbt)}ms`);
