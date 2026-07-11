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

const PAGE_LEDGER_OPTIONS = {
  'index.html': {
    title: 'Filed from the archive',
    lede: 'Canonical answers on memory, place, and studio practice.',
    modifier: 'answer-ledger--home answer-ledger--excerpt answer-ledger--dark',
    limit: 2,
    collapsible: false,
    footerHtml: `<p class="answer-ledger__more"><a href="/answers" class="answer-ledger__more-link sx-link" data-analytics-event="answer_index_viewed" data-analytics-label="home-excerpt">Browse full House Index <span aria-hidden="true">→</span></a></p>`,
  },
  'beles.html': {
    title: 'Beles answer file',
    lede: 'Chapter I facts: accord, availability, restock, and proof cross-references.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
  'beles/preorder.html': {
    title: 'Next restock answers',
    lede: 'Payment, credit, cancellation, and dispatch terms filed before checkout.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'craftsmanship.html': {
    title: 'Craft & proof answers',
    lede: 'Authorship, safety assessment, traceability, and wear records.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'wear.html': {
    title: 'Wear & care answers',
    lede: 'Application, storage, and chapter pairing—filed from the care guide.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'shipping.html': {
    title: 'Shipping & restock answers',
    lede: 'Dispatch windows, restock signup, and purchase flow—filed from studio policy.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'journal.html': {
    title: 'Journal answer index',
    lede: 'Editorial cross-links to canonical house facts.',
    modifier: 'answer-ledger--editorial answer-ledger--compact',
    collapsible: false,
  },
  'about.html': {
    title: 'Maison answers',
    lede: 'Memory, place, and studio practice—filed from the about page.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'store.html': {
    title: 'Chapter & boutique answers',
    lede: 'Lifecycle, availability, and chapter status from the boutique index.',
    modifier: 'answer-ledger--editorial',
    collapsible: true,
  },
  'oliva.html': {
    title: 'Oliva answer file',
    lede: 'Chapter II development status and proof cross-references.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
  'asmara.html': {
    title: 'Asmara answer file',
    lede: 'Chapter III development status and proof cross-references.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
  'massawa.html': {
    title: 'Massawa answer file',
    lede: 'Chapter development status and proof cross-references.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
  'petricor.html': {
    title: 'Petricor answer file',
    lede: 'Chapter V development status and proof cross-references.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
  'ritual.html': {
    title: 'Ritual archive answers',
    lede: 'Lab study status—Ritual is not for sale.',
    modifier: 'answer-ledger--chapter answer-ledger--dark',
    collapsible: true,
  },
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

  const opts = PAGE_LEDGER_OPTIONS[relPath] || {};
  const block = renderAnswerLedger(answers, opts);
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
