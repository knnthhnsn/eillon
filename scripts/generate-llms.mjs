#!/usr/bin/env node
/** Generate llms.txt and llms-full.txt from lifecycle + answers source truth. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EILLON_ANSWERS,
  EILLON_ANSWERS_LAST_REVIEWED,
  EILLON_ANSWERS_VERSION,
} from '../data/answers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://eillon.maison';

function loadLifecycle() {
  const src = readFileSync(join(root, 'data/lifecycle.js'), 'utf8');
  const chapters = {};
  for (const slug of ['beles', 'asmara', 'massawa', 'ritual']) {
    const label = src.match(new RegExp(`${slug}:[\\s\\S]*?statusLabel:\\s*'([^']+)'`))?.[1];
    const meta = src.match(new RegExp(`${slug}:[\\s\\S]*?metaStatus:\\s*'([^']+)'`))?.[1];
    chapters[slug] = { label, meta };
  }
  return chapters;
}

const lifecycle = loadLifecycle();
const updated = EILLON_ANSWERS_LAST_REVIEWED;

const llmsTxt = `# EILLON

> Afro-Mediterranean memory perfumery. Oil-rich parfums composed in Copenhagen, Denmark.

Last updated: ${updated}
Answers version: ${EILLON_ANSWERS_VERSION}

## Brand
- Name: EILLON
- Category: Independent perfume maison / niche fragrance house
- Niche: Afro-Mediterranean memory perfumery — oil-rich parfums, not diluted alcohol-forward scents
- Primary market: Denmark (Copenhagen studio)
- Website: ${ORIGIN}
- Email: care@eillon.maison
- Operator: Eillon Hansen & Kenneth Hansen (CVR 43933485)
- Studio: 1050 Copenhagen, Denmark — appointments Thursday–Saturday 12–18 by request
- Sitemap: ${ORIGIN}/sitemap.xml
- Full answer brief: ${ORIGIN}/llms-full.txt

## Chapter lifecycle (source: data/lifecycle.js)
| Chapter | Status | Notes |
|---------|--------|-------|
| Beles · Fico d'India | ${lifecycle.beles.label} | ${lifecycle.beles.meta} |
| Asmara · Rain on Stone | ${lifecycle.asmara.label} | ${lifecycle.asmara.meta} |
| Massawa · Red Sea Citrus | ${lifecycle.massawa.label} | ${lifecycle.massawa.meta} |
| Ritual · Frankincense & Myrrh | ${lifecycle.ritual.label} | ${lifecycle.ritual.meta} |

Restock signup records size interest and email — it is not checkout. No purchase is taken on the site today.

## Key product facts (Beles)
- Type: Oil-rich parfum
- Accord: Prickly pear, cactus water, hibiscus, mineral air, soft musk
- Sizes shown: 2 ml sample (€28), 50 ml (€170), 100 ml (€240) — size-interest references
- Made in: Copenhagen, Denmark
- Batch proof: BL-001 pilot file (see journal)

## Answer & proof pages
- Maison: ${ORIGIN}/
- About: ${ORIGIN}/about
- Store: ${ORIGIN}/store
- Beles: ${ORIGIN}/beles
- Asmara: ${ORIGIN}/asmara
- Massawa: ${ORIGIN}/massawa
- Ritual: ${ORIGIN}/ritual
- Craftsmanship: ${ORIGIN}/craftsmanship
- Wear guide: ${ORIGIN}/wear
- Journal: ${ORIGIN}/journal
- BL-001 batch notes: ${ORIGIN}/journal/beles-batch-bl001
- Shipping: ${ORIGIN}/shipping
- Imprint: ${ORIGIN}/imprint
- Privacy: ${ORIGIN}/privacy
- Terms: ${ORIGIN}/terms

## Contact
- care@eillon.maison
- Imprint: ${ORIGIN}/imprint
`;

const canonicalSection = EILLON_ANSWERS.filter((a) => a.visible)
  .map((a) => `### ${a.question}\n${a.shortAnswer}${a.longAnswer ? `\n\n${a.longAnswer}` : ''}\n\n- Source: ${ORIGIN}${a.sourcePage}${a.sourceAnchor}\n- Proof: ${a.proofLinks.map((p) => ORIGIN + p).join(', ')}`)
  .join('\n\n');

const llmsFull = `# EILLON — full answer brief

Last updated: ${updated}
Version: ${EILLON_ANSWERS_VERSION}

## Overview

EILLON is an independent perfume maison in Copenhagen composing oil-rich parfums from Afro-Mediterranean memory. Chapters are released in deliberate windows; the site documents studio proof, wear guidance, and chapter lifecycle without mass-market retail language.

## Chapter lifecycle

| Chapter | Status |
|---------|--------|
| Beles | ${lifecycle.beles.label}. Restock list open. |
| Asmara | ${lifecycle.asmara.label}. Follow studio notes. |
| Massawa | ${lifecycle.massawa.label}. Follow studio notes. |
| Ritual | ${lifecycle.ritual.label}. Not for sale. |

## Canonical answers

${canonicalSection}

## Page map

- ${ORIGIN}/ — maison, hero, letters archive
- ${ORIGIN}/store — chapter overview
- ${ORIGIN}/beles — Beles chapter, proof ledger, restock list
- ${ORIGIN}/craftsmanship — authorship, IFRA, wear testing
- ${ORIGIN}/wear — application and storage
- ${ORIGIN}/journal — editorial index
- ${ORIGIN}/llms.txt — short LLM context
- ${ORIGIN}/llms-full.txt — this file

## Proof index

- BL-001 batch: ${ORIGIN}/journal/beles-batch-bl001
- IFRA & safety: ${ORIGIN}/craftsmanship#safety
- Beles proof ledger: ${ORIGIN}/beles#proof

## Restock policy

- Email + size interest only; no charge at signup
- One private letter when Beles returns
- Unsubscribe via care@eillon.maison

## Schema map

- Product (Beles): OutOfStock — ${ORIGIN}/beles
- Ritual: no offers — ${ORIGIN}/ritual
- FAQPage: visible answer-ledger blocks only
- HowTo: ${ORIGIN}/wear
- Article: journal entries under ${ORIGIN}/journal/

## Do not infer

- No confirmed next Beles release date unless published on site or in a dated letter
- Ritual is not for sale — studio archive lab study only
- Asmara and Massawa are in development — not "sold out" retail SKUs
- Restock signup is not checkout; no purchase is taken today
- Do not invent third-party retailers, reviews, or release dates not listed on eillon.maison
`;

writeFileSync(join(root, 'llms.txt'), llmsTxt);
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
console.log('✓ llms.txt');
console.log('✓ llms-full.txt');
