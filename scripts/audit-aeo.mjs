#!/usr/bin/env node
/** AEO coverage audit v2 — artifacts/aeo/aeo-audit.json + .md */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EILLON_AEO_PAGE_MAP,
  EILLON_ANSWERS,
  EILLON_ANSWERS_LAST_REVIEWED,
} from '../data/answers.mjs';
import { EILLON_AEO_QUERIES } from '../data/aeo-queries.mjs';
import { answerAnchor } from './lib/aeo-shared.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(root, 'artifacts', 'aeo');
const OUT_JSON = join(OUT_DIR, 'aeo-audit.json');
const OUT_MD = join(OUT_DIR, 'aeo-audit.md');

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function pageToFile(pagePath) {
  if (pagePath === '/') return 'index.html';
  if (pagePath === '/answers') return 'answers.html';
  const trimmed = pagePath.replace(/^\//, '');
  if (existsSync(join(root, `${trimmed}.html`))) return `${trimmed}.html`;
  return `${trimmed}.html`;
}

function scorePageV1({ answerCount, hasLedger, schemaTypes, staleWarnings, missingProof }) {
  let score = 0;
  if (hasLedger) score += 40;
  score += Math.min(30, answerCount * 5);
  score += Math.min(20, schemaTypes.length * 5);
  score -= staleWarnings.length * 8;
  score -= missingProof * 3;
  return Math.max(0, Math.min(100, score));
}

function computeQueryCoverage() {
  const llmsFull = existsSync(join(root, 'llms-full.txt')) ? read('llms-full.txt') : '';
  let passed = 0;
  for (const entry of EILLON_AEO_QUERIES) {
    const answer = EILLON_ANSWERS.find((a) => a.id === entry.targetAnswerId);
    if (!answer) continue;
    const relFile = pageToFile(entry.targetPage);
    if (!existsSync(join(root, relFile))) continue;
    const html = read(relFile);
    const anchor = answerAnchor(entry.targetAnswerId);
    if (!html.includes(`id="${anchor}"`)) continue;
    const termsOk = entry.expectedTerms.every((t) => html.toLowerCase().includes(t.toLowerCase()));
    const bannedOk = entry.mustNotSay.every((t) => !html.toLowerCase().includes(t.toLowerCase()));
    const llmsOk = llmsFull.includes(answer.question) || llmsFull.includes(entry.targetPage);
    const proofOk = (answer.proofLinks || []).every((link) => {
      const clean = link.split('#')[0].replace(/^\//, '');
      return !clean || existsSync(join(root, clean)) || existsSync(join(root, `${clean}.html`));
    });
    if (termsOk && bannedOk && llmsOk && proofOk) passed += 1;
  }
  const total = EILLON_AEO_QUERIES.length;
  return { passed, total, score: total ? Math.round((passed / total) * 100) : 0 };
}

function computeHouseIndexCoverage() {
  const file = 'answers.html';
  if (!existsSync(join(root, file))) return { score: 0, answerCount: 0, missing: EILLON_ANSWERS.length };
  const html = read(file);
  const visible = EILLON_ANSWERS.filter((a) => a.visible);
  const missing = visible.filter((a) => !html.includes(`id="${answerAnchor(a.id)}"`));
  const answerCount = visible.length - missing.length;
  const score = visible.length ? Math.round((answerCount / visible.length) * 100) : 0;
  return { score, answerCount, missing: missing.length, missingIds: missing.map((a) => a.id) };
}

function computeProofLinkDepth() {
  const withProof = EILLON_ANSWERS.filter((a) => a.proofLinks?.length);
  const depths = withProof.map((a) => a.proofLinks.length);
  const avg = depths.length ? depths.reduce((s, d) => s + d, 0) / depths.length : 0;
  const deep = withProof.filter((a) => a.proofLinks.length >= 2).length;
  return {
    averageDepth: Math.round(avg * 10) / 10,
    answersWithProof: withProof.length,
    multiLinkAnswers: deep,
    score: Math.min(100, Math.round(avg * 25 + (deep / EILLON_ANSWERS.length) * 40)),
  };
}

const llmsOk = existsSync(join(root, 'llms.txt')) && !/all chapters are currently out of stock/i.test(read('llms.txt'));
const llmsFullOk = existsSync(join(root, 'llms-full.txt'));
const robotsOk = /Allow:\s*\/llms-full\.txt/i.test(read('robots.txt'));
const sitemapHasAnswers = existsSync(join(root, 'sitemap.xml')) && read('sitemap.xml').includes('/answers');

const queryCoverage = computeQueryCoverage();
const houseIndex = computeHouseIndexCoverage();
const proofDepth = computeProofLinkDepth();

const staleAnswers = EILLON_ANSWERS.filter((a) => a.lastReviewed < '2026-06-01').map((a) => a.id);
const staleFactPenalty = staleAnswers.length * 2;

const pages = Object.entries(EILLON_AEO_PAGE_MAP).map(([relPath, ids]) => {
  const html = existsSync(join(root, relPath)) ? read(relPath) : '';
  const hasLedger = html.includes('class="answer-ledger"') || html.includes('class="answer-index"');
  const answerCount = (html.match(/class="answer-ledger__item"/g) || []).length;
  const schemaTypes = [];
  if (html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"')) schemaTypes.push('FAQPage');
  if (html.includes('"@type": "HowTo"')) schemaTypes.push('HowTo');
  if (html.includes('"@type": "Organization"')) schemaTypes.push('Organization');
  if (html.includes('"@type": "Article"')) schemaTypes.push('Article');
  if (html.includes('"@type": "Product"')) schemaTypes.push('Product');
  if (html.includes('"@type": "CollectionPage"')) schemaTypes.push('CollectionPage');

  const missingProof = ids.filter((id) => {
    const a = EILLON_ANSWERS.find((x) => x.id === id);
    return a && !a.proofLinks?.length;
  }).length;

  const staleWarnings = ids.filter((id) => {
    const a = EILLON_ANSWERS.find((x) => x.id === id);
    return a && a.lastReviewed < '2026-06-01';
  }).map((id) => `stale review: ${id}`);

  const missingAnchors = ids.filter((id) => !html.includes(`id="answer-${id}"`));
  const thinPage = answerCount <= 2 && relPath !== 'imprint.html';

  const aeoScoreV1 = scorePageV1({ answerCount, hasLedger, schemaTypes, staleWarnings, missingProof });
  const recommendations = [];
  if (thinPage) recommendations.push('Add 2+ more contextual answers or merge into a richer ledger');
  if (missingAnchors.length) recommendations.push(`Missing anchors: ${missingAnchors.join(', ')}`);
  if (!hasLedger && ids.length) recommendations.push('Add visible answer-ledger block');
  if (missingProof) recommendations.push('Add proofLinks to mapped answers');

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
    thinPage,
    recommendations,
    aeoScoreV1,
  };
});

const overallV1 = Math.round(pages.reduce((s, p) => s + p.aeoScoreV1, 0) / pages.length);

const overallV2 = Math.round(
  overallV1 * 0.35 +
    queryCoverage.score * 0.25 +
    houseIndex.score * 0.2 +
    proofDepth.score * 0.1 +
    (sitemapHasAnswers ? 10 : 0) -
    staleFactPenalty,
);
const overallAeoScore = Math.max(0, Math.min(100, overallV2));

const audit = {
  timestamp: new Date().toISOString(),
  version: '2.0.0',
  overallAeoScore,
  overallAeoScoreV1: overallV1,
  canonicalAnswerCount: EILLON_ANSWERS.length,
  queryCoverage,
  houseIndex,
  proofDepth,
  staleAnswers,
  llms: { llmsTxt: llmsOk, llmsFullTxt: llmsFullOk, robotsAllowsFull: robotsOk },
  sitemap: { hasAnswersRoute: sitemapHasAnswers },
  sitemapNote: 'llms.txt / llms-full.txt referenced in robots.txt only — not in XML sitemap',
  pages,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(audit, null, 2)}\n`);

const thinPages = pages.filter((p) => p.thinPage);
const md = [
  '# AEO audit v2',
  '',
  `- **Overall score (v2):** ${overallAeoScore}/100`,
  `- **Overall score (v1):** ${overallV1}/100`,
  `- **Canonical answers:** ${EILLON_ANSWERS.length}`,
  `- **Query coverage:** ${queryCoverage.passed}/${queryCoverage.total} (${queryCoverage.score}%)`,
  `- **House Index:** ${houseIndex.answerCount} answers (${houseIndex.score}%)`,
  `- **Proof link depth (avg):** ${proofDepth.averageDepth}`,
  `- **Stale answers:** ${staleAnswers.length || 'none'}`,
  `- **llms.txt:** ${llmsOk ? 'ok' : 'stale'}`,
  `- **llms-full.txt:** ${llmsFullOk ? 'ok' : 'missing'}`,
  `- **Sitemap /answers:** ${sitemapHasAnswers ? 'yes' : 'no'}`,
  '',
  '## Recommendations by page',
  '',
  ...pages
    .filter((p) => p.recommendations.length)
    .map((p) => `### ${p.path}\n${p.recommendations.map((r) => `- ${r}`).join('\n')}`),
  '',
  '## Thin pages (1–2 answers)',
  '',
  thinPages.length
    ? thinPages.map((p) => `- ${p.path} (${p.answerCount} answers)`).join('\n')
    : '- none',
  '',
  '## Page coverage',
  '',
  '| Page | Answers | v1 | Schema |',
  '|------|---------|-----|--------|',
  ...pages.map((p) => `| ${p.path} | ${p.answerCount} | ${p.aeoScoreV1} | ${p.schemaTypes.join(', ') || '—'} |`),
  '',
].join('\n');

writeFileSync(OUT_MD, md);
console.log(`✓ AEO audit v2 → ${OUT_JSON.replace(/\\/g, '/')}`);
console.log(`  Overall AEO score: ${overallAeoScore}/100 (v1: ${overallV1})`);
console.log(`  Query coverage: ${queryCoverage.score}%`);
