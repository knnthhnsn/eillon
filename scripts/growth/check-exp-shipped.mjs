#!/usr/bin/env node
/** Exit non-zero if experiment_id already has a keep row in results.tsv */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(__dirname, '../../growth/results.tsv');

const expId = process.argv[2];
if (!expId || !/^EXP-\d{3}[a-z]?$/.test(expId)) {
  console.error('Usage: node scripts/growth/check-exp-shipped.mjs EXP-NNN');
  process.exit(1);
}

const raw = readFileSync(LEDGER, 'utf8').trimEnd().replace(/\r\n/g, '\n');
const lines = raw.split('\n');
const header = lines[0].split('\t');
const col = Object.fromEntries(header.map((name, i) => [name, i]));

const shipped = lines.slice(1).filter((line) => {
  const cols = line.split('\t');
  return cols[col.experiment_id] === expId && cols[col.status] === 'keep';
});

if (shipped.length) {
  const notes = shipped[0].split('\t')[col.notes]?.slice(0, 100) || '';
  console.error(
    `BLOCKED: ${expId} already shipped (${shipped.length} keep row(s) in ledger). Pick another experiment via npm run growth:next.`
  );
  if (notes) {
    console.error(`Latest note: ${notes}`);
  }
  process.exit(1);
}

console.log(`OK: ${expId} not yet shipped (no keep rows in ledger)`);
