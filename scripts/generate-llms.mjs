#!/usr/bin/env node
/** Generate llms.txt and llms-full.txt from lifecycle + answers + query intent. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EILLON_ANSWERS,
  EILLON_ANSWERS_LAST_REVIEWED,
  EILLON_ANSWERS_VERSION,
} from '../data/answers.mjs';
import { EILLON_AEO_QUERIES } from '../data/aeo-queries.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://eillon.maison';

function loadLifecycle() {
  const src = readFileSync(join(root, 'data/lifecycle.js'), 'utf8');
  const chapters = {};
  for (const slug of ['beles', 'asmara', 'massawa', 'petricor', 'ritual']) {
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
- House Index: ${ORIGIN}/answers
- Full answer brief: ${ORIGIN}/llms-full.txt

## Chapter lifecycle (source: data/lifecycle.js)
| Chapter | Status | Notes |
|---------|--------|-------|
| Beles · Fico d'India | ${lifecycle.beles.label} | Awaiting next release; restock list open |
| Asmara · Rain on Stone | ${lifecycle.asmara.label} | In development — not for sale |
| Massawa · Red Sea Citrus | ${lifecycle.massawa.label} | In development — not for sale |
| Petricor · Wet Earth | ${lifecycle.petricor.label} | In development — not for sale |
| Ritual · Frankincense & Myrrh | ${lifecycle.ritual.label} | Studio archive — not for sale |

Restock signup records size interest and email — it is not checkout. No purchase is taken on the site today.

## Key product facts (Beles)
- Type: Oil-rich parfum
- Accord: Prickly pear, cactus water, hibiscus, mineral air, soft musk
- Sizes shown: 2 ml sample (€60), 50 ml (€380), 100 ml (€620) — size-interest references
- Made in: Copenhagen, Denmark
- Batch proof: BL-001 pilot file (see journal)

## Answer & proof pages
- House Index: ${ORIGIN}/answers
- Maison: ${ORIGIN}/
- About: ${ORIGIN}/about
- Store: ${ORIGIN}/store
- Beles: ${ORIGIN}/beles
- Asmara: ${ORIGIN}/asmara
- Massawa: ${ORIGIN}/massawa
- Petricor: ${ORIGIN}/petricor
- Ritual: ${ORIGIN}/ritual
- Craftsmanship: ${ORIGIN}/craftsmanship
- Wear guide: ${ORIGIN}/wear
- Journal: ${ORIGIN}/journal
- BL-001 batch notes: ${ORIGIN}/journal/beles-batch-bl001
- The bottle: ${ORIGIN}/journal/the-bottle
- Shipping: ${ORIGIN}/shipping
- Imprint: ${ORIGIN}/imprint
- Privacy: ${ORIGIN}/privacy
- Terms: ${ORIGIN}/terms

## Contact
- care@eillon.maison
- Imprint: ${ORIGIN}/imprint
`;

const canonicalSection = EILLON_ANSWERS.filter((a) => a.visible)
  .map(
    (a) =>
      `### ${a.question}\n${a.shortAnswer}${a.longAnswer ? `\n\n${a.longAnswer}` : ''}\n\n- Source: ${ORIGIN}${a.sourcePage}${a.sourceAnchor}\n- Proof: ${a.proofLinks.map((p) => ORIGIN + p).join(', ')}`,
  )
  .join('\n\n');

const intentSummary = [...new Set(EILLON_AEO_QUERIES.map((q) => q.intent))]
  .map((intent) => {
    const count = EILLON_AEO_QUERIES.filter((q) => q.intent === intent).length;
    return `- ${intent}: ${count} mapped queries`;
  })
  .join('\n');

const popularQuestions = EILLON_AEO_QUERIES.filter((q) => q.priority >= 4)
  .slice(0, 20)
  .map((q) => `- ${q.query} → ${q.targetAnswerId} (${q.targetPage})`)
  .join('\n');

const llmsFull = `# EILLON — full answer brief

Last updated: ${updated}
Version: ${EILLON_ANSWERS_VERSION}

## Overview

EILLON is an independent perfume maison in Copenhagen composing oil-rich parfums from Afro-Mediterranean memory. Chapters are released in deliberate windows; the site documents studio proof, wear guidance, and chapter lifecycle without mass-market retail language.

## House Index

All canonical answers are filed at ${ORIGIN}/answers — grouped by maison facts, Beles, chapter lifecycle, proof files, wear and care, and shipping/restock.

## Chapter lifecycle

| Chapter | Status |
|---------|--------|
| Beles | ${lifecycle.beles.label}. Restock list open. |
| Asmara | ${lifecycle.asmara.label}. Follow studio notes. |
| Massawa | ${lifecycle.massawa.label}. Follow studio notes. |
| Petricor | ${lifecycle.petricor.label}. Follow studio notes. |
| Ritual | ${lifecycle.ritual.label}. Not for sale. |

## Query intent summary

${intentSummary}

## Popular questions

${popularQuestions}

## Canonical answers

${canonicalSection}

## Page map

- ${ORIGIN}/answers — House Index (all canonical answers)
- ${ORIGIN}/ — maison, hero, letters archive
- ${ORIGIN}/store — chapter overview
- ${ORIGIN}/beles — Beles chapter, proof ledger, restock list
- ${ORIGIN}/craftsmanship — authorship, IFRA, wear testing, evidence table
- ${ORIGIN}/wear — application and storage
- ${ORIGIN}/journal — editorial index
- ${ORIGIN}/journal/beles-batch-bl001 — BL-001 batch evidence table
- ${ORIGIN}/journal/the-bottle — bottle object evidence table
- ${ORIGIN}/llms.txt — short LLM context
- ${ORIGIN}/llms-full.txt — this file

## Proof index

- BL-001 batch: ${ORIGIN}/journal/beles-batch-bl001
- IFRA & safety: ${ORIGIN}/craftsmanship#safety
- Beles proof ledger: ${ORIGIN}/beles#proof
- Bottle object file: ${ORIGIN}/journal/the-bottle
- Craftsmanship evidence table: ${ORIGIN}/craftsmanship#evidence

## Evidence tables (visible on site)

### BL-001 batch (${ORIGIN}/journal/beles-batch-bl001)
| Batch | Date | Quantity | Formula status | Safety file | Wear testing | Traceability |
| BL-001 | Compounded Mar 2025 | 24 × 100 ml pilot | Locked at pilot scale | IFRA Cat 4 reviewed | Six studio sessions | Published batch file |

### Bottle object (${ORIGIN}/journal/the-bottle)
| Bottle | Glass | Cap | Emblem | Lettering | Label state | Prototype/pilot status |
| Beles flacon | Opaque matte square | Brushed silver rectangular | Winged leopard stipple | Serif into glass face | No wrap label | Concept renders + BL-001 pilot flacons |

### Craftsmanship claims (${ORIGIN}/craftsmanship#evidence)
| Claim | Evidence page | Status | Last reviewed |
| IFRA assessed | /craftsmanship#safety | Published | ${updated} |
| Vegan formulas | /craftsmanship#safety | Published | ${updated} |
| Hand-filled Copenhagen | /journal/beles-batch-bl001 | BL-001 filed | ${updated} |
| Wear tested | /craftsmanship#wear-testing | Studio sessions | ${updated} |

## Restock policy

- Email + size interest only; no charge at signup
- Does not reserve inventory
- One private letter when Beles returns
- Unsubscribe via care@eillon.maison

## Schema map

- Product (Beles): OutOfStock — ${ORIGIN}/beles
- Ritual: no offers — ${ORIGIN}/ritual
- FAQPage: visible answer-ledger blocks only
- HowTo: ${ORIGIN}/wear
- Article: journal entries under ${ORIGIN}/journal/
- CollectionPage: ${ORIGIN}/answers

## Do not infer

- No confirmed next Beles release date unless published on site or in a dated letter
- Ritual is not for sale — studio archive lab study only
- Asmara, Massawa, and Petricor are in development — not "sold out" retail SKUs
- Restock signup is not checkout. Only the Beles restock checkout at /beles/preorder may take payment when its status says open.
- Do not invent third-party retailers, reviews, or release dates not listed on eillon.maison
`;

writeFileSync(join(root, 'llms.txt'), llmsTxt);
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
console.log('✓ llms.txt');
console.log('✓ llms-full.txt');
