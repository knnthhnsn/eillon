#!/usr/bin/env node
/** Inject visible answer-ledger blocks into static HTML pages. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AEO_MARKER_END,
  AEO_MARKER_START,
  getAnswersForPage,
  renderAnswerLedger,
  renderHouseIndex,
} from './lib/aeo-shared.mjs';
import { EILLON_AEO_PAGE_MAP } from '../data/answers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAGE_TITLES = {
  'index.html': { title: 'Maison answers', lede: 'Filed answers for the house—memory, place, and studio practice.' },
  'beles.html': { title: 'Beles answer file', lede: 'Chapter I facts: accord, availability, restock, and proof cross-references.' },
  'craftsmanship.html': { title: 'Craft & proof answers', lede: 'Authorship, safety assessment, traceability, and wear records.' },
  'wear.html': { title: 'Wear & care answers', lede: 'Application, storage, and chapter pairing—filed from the care guide.' },
  'journal.html': { title: 'Journal answer index', lede: 'Editorial cross-links to canonical house facts.' },
};

function injectLedger(relPath, html) {
  if (relPath === 'answers.html') {
    const block = renderHouseIndex();
    const region = `${AEO_MARKER_START}[\\s\\S]*?${AEO_MARKER_END}`;
    if (new RegExp(region).test(html)) {
      return html.replace(new RegExp(region), block.trim());
    }
    if (html.includes('</main>')) {
      return html.replace('</main>', `${block}\n  </main>`);
    }
    return html;
  }

  const answers = getAnswersForPage(relPath);
  if (!answers.length) return html;

  const meta = PAGE_TITLES[relPath] || {};
  const block = renderAnswerLedger(answers, meta);
  const region = `${AEO_MARKER_START}[\\s\\S]*?${AEO_MARKER_END}`;

  if (new RegExp(region).test(html)) {
    return html.replace(new RegExp(region), block.trim());
  }

  if (html.includes('</main>')) {
    return html.replace('</main>', `${block}\n  </main>`);
  }
  return html;
}

let updated = 0;
for (const relPath of Object.keys(EILLON_AEO_PAGE_MAP)) {
  const filePath = join(root, relPath);
  if (!existsSync(filePath)) {
    console.warn(`skip missing ${relPath}`);
    continue;
  }
  const before = readFileSync(filePath, 'utf8');
  const after = injectLedger(relPath, before);
  if (after !== before) {
    writeFileSync(filePath, after);
    updated += 1;
    console.log(`✓ answer blocks → ${relPath}`);
  }
}

console.log(`Answer ledger render complete (${updated} pages).`);
