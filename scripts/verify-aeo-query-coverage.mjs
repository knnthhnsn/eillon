#!/usr/bin/env node
/** Verify AEO query intent coverage against answers, pages, and llms-full.txt */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EILLON_AEO_QUERIES } from '../data/aeo-queries.mjs';
import { getAnswerById } from '../data/answers.mjs';
import { answerAnchor } from './lib/aeo-shared.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function pageToFile(pagePath) {
  if (pagePath === '/') return 'index.html';
  if (pagePath === '/answers') return 'answers.html';
  const trimmed = pagePath.replace(/^\//, '');
  if (existsSync(join(root, `${trimmed}.html`))) return `${trimmed}.html`;
  if (existsSync(join(root, trimmed, 'index.html'))) return `${trimmed}/index.html`;
  return `${trimmed}.html`;
}

function proofLinkExists(href) {
  const clean = href.split('#')[0].replace(/^\//, '');
  if (!clean) return existsSync(join(root, 'index.html'));
  const direct = join(root, clean);
  if (existsSync(direct)) return true;
  const html = join(root, `${clean}.html`);
  return existsSync(html);
}

const llmsFull = existsSync(join(root, 'llms-full.txt')) ? read('llms-full.txt') : '';

let passed = 0;

for (const entry of EILLON_AEO_QUERIES) {
  const label = `"${entry.query}" → ${entry.targetAnswerId}`;
  const answer = getAnswerById(entry.targetAnswerId);

  if (!answer) {
    failures.push(`${label}: target answer missing`);
    continue;
  }

  const relFile = pageToFile(entry.targetPage);
  if (!existsSync(join(root, relFile))) {
    failures.push(`${label}: target page file missing (${relFile})`);
    continue;
  }

  const html = read(relFile);
  const anchor = answerAnchor(entry.targetAnswerId);

  if (!html.includes(`id="${anchor}"`)) {
    failures.push(`${label}: page ${entry.targetPage} missing anchor #${anchor}`);
    continue;
  }

  for (const term of entry.expectedTerms) {
    if (!html.toLowerCase().includes(term.toLowerCase())) {
      failures.push(`${label}: expected term "${term}" not on ${entry.targetPage}`);
    }
  }

  for (const banned of entry.mustNotSay) {
    if (html.toLowerCase().includes(banned.toLowerCase())) {
      failures.push(`${label}: mustNotSay "${banned}" found on ${entry.targetPage}`);
    }
  }

  const llmsHasAnswer = llmsFull.includes(answer.question) || llmsFull.includes(entry.targetPage);
  if (!llmsHasAnswer) {
    failures.push(`${label}: llms-full.txt missing answer or page reference`);
  }

  for (const link of answer.proofLinks || []) {
    if (!proofLinkExists(link)) {
      failures.push(`${label}: proof link missing — ${link}`);
    }
  }

  if (!failures.some((f) => f.startsWith(label))) passed += 1;
}

const total = EILLON_AEO_QUERIES.length;
const score = total ? Math.round((passed / total) * 100) : 0;

console.log(`Query coverage: ${passed}/${total} (${score}%)`);

if (failures.length) {
  console.error('\n✗ AEO query coverage failed:\n');
  failures.forEach((f) => console.error(`  • ${f}`));
  process.exit(1);
}

console.log('✓ AEO query coverage passed');
