#!/usr/bin/env node
/** AEO coverage audit — artifacts/aeo/aeo-audit.json + .md */
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EILLON_AEO_PAGE_MAP, EILLON_ANSWERS } from '../data/answers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(root, 'artifacts', 'aeo');
const OUT_JSON = join(OUT_DIR, 'aeo-audit.json');
const OUT_MD = join(OUT_DIR, 'aeo-audit.md');

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function scorePage({ answerCount, hasLedger, schemaTypes, staleWarnings, missingProof }) {
  let score = 0;
  if (hasLedger) score += 40;
  score += Math.min(30, answerCount * 5);
  score += Math.min(20, schemaTypes.length * 5);
  score -= staleWarnings.length * 8;
  score -= missingProof * 3;
  return Math.max(0, Math.min(100, score));
}

const llmsOk = existsSync(join(root, 'llms.txt')) && !/all chapters are currently out of stock/i.test(read('llms.txt'));
const llmsFullOk = existsSync(join(root, 'llms-full.txt'));
const robotsOk = /Allow:\s*\/llms-full\.txt/i.test(read('robots.txt'));

const pages = Object.entries(EILLON_AEO_PAGE_MAP).map(([relPath, ids]) => {
  const html = existsSync(join(root, relPath)) ? read(relPath) : '';
  const hasLedger = html.includes('class="answer-ledger"');
  const answerCount = (html.match(/class="answer-ledger__item"/g) || []).length;
  const schemaTypes = [];
  if (html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"')) schemaTypes.push('FAQPage');
  if (html.includes('"@type": "HowTo"')) schemaTypes.push('HowTo');
  if (html.includes('"@type": "Organization"')) schemaTypes.push('Organization');
  if (html.includes('"@type": "Article"')) schemaTypes.push('Article');
  if (html.includes('"@type": "Product"')) schemaTypes.push('Product');

  const missingProof = ids.filter((id) => {
    const a = EILLON_ANSWERS.find((x) => x.id === id);
    return a && !a.proofLinks?.length;
  }).length;

  const staleWarnings = ids.filter((id) => {
    const a = EILLON_ANSWERS.find((x) => x.id === id);
    return a && a.lastReviewed < '2026-06-01';
  }).map((id) => `stale review: ${id}`);

  const missingAnchors = ids.filter((id) => !html.includes(`id="answer-${id}"`));

  return {
    path: `/${relPath.replace(/index\.html$/, '').replace(/\.html$/, '')}`,
    file: relPath,
    answerIds: ids,
    answerCount,
    hasLedger,
    schemaTypes,
    missingAnchors,
    missingProof,
    staleWarnings,
    aeoScore: scorePage({ answerCount, hasLedger, schemaTypes, staleWarnings, missingProof }),
  };
});

const overallScore = Math.round(pages.reduce((s, p) => s + p.aeoScore, 0) / pages.length);

const audit = {
  timestamp: new Date().toISOString(),
  overallAeoScore: overallScore,
  canonicalAnswerCount: EILLON_ANSWERS.length,
  llms: { llmsTxt: llmsOk, llmsFullTxt: llmsFullOk, robotsAllowsFull: robotsOk },
  sitemapNote: 'llms.txt / llms-full.txt referenced in robots.txt only — not in XML sitemap (see docs/aeo-playbook.md)',
  pages,
  staleFacts: pages.flatMap((p) => p.staleWarnings),
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(audit, null, 2)}\n`);

const md = [
  '# AEO audit',
  '',
  `- **Overall score:** ${overallScore}/100`,
  `- **Canonical answers:** ${EILLON_ANSWERS.length}`,
  `- **llms.txt:** ${llmsOk ? 'ok' : 'stale'}`,
  `- **llms-full.txt:** ${llmsFullOk ? 'ok' : 'missing'}`,
  `- **robots Allow llms-full:** ${robotsOk ? 'yes' : 'no'}`,
  '',
  '## Page coverage',
  '',
  '| Page | Answers | Score | Schema |',
  '|------|---------|-------|--------|',
  ...pages.map((p) => `| ${p.path} | ${p.answerCount} | ${p.aeoScore} | ${p.schemaTypes.join(', ') || '—'} |`),
  '',
].join('\n');

writeFileSync(OUT_MD, md);
console.log(`✓ AEO audit → ${OUT_JSON.replace(/\\/g, '/')}`);
console.log(`  Overall AEO score: ${overallScore}/100`);
