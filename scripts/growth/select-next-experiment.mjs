#!/usr/bin/env node
/** Print highest-priority backlog experiment ID from growth/backlog.md table */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ALLOWED_LOOP_TYPES, isExperimentShipped, readLedgerRows } from './ledger-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backlog = readFileSync(join(__dirname, '../../growth/backlog.md'), 'utf8');
const ledgerRows = readLedgerRows();

const rows = backlog
  .split('\n')
  .filter((l) => l.startsWith('| EXP-'))
  .map((l) => {
    const parts = l.split('|').map((s) => s.trim());
    return {
      id: parts[1],
      name: parts[2],
      loop: parts[3],
      status: parts[parts.length - 2].replace(/\*/g, ''),
      priority: parseFloat(parts[parts.length - 3]) || 0,
    };
  })
  .filter((r) => {
    if (['done', 'cancelled', 'blocked'].includes(r.status.toLowerCase())) {
      return false;
    }
    if (!ALLOWED_LOOP_TYPES.has(r.loop)) {
      console.error(
        `Skipping ${r.id}: backlog loop "${r.loop}" is invalid — fix in growth/backlog.md (npm run growth:validate-backlog)`
      );
      return false;
    }
    if (isExperimentShipped(r.id, ledgerRows)) {
      console.error(
        `Skipping ${r.id}: already shipped in results.tsv (keep row) — mark backlog done if merged`
      );
      return false;
    }
    return true;
  });

const explicitNext = rows.find((r) => r.status.toLowerCase() === 'next');
const sorted = rows
  .filter((r) => r.status.toLowerCase() !== 'next' || r === explicitNext)
  .sort((a, b) => b.priority - a.priority);

const top = explicitNext || sorted[0];
if (!top) {
  console.log('No eligible experiments in backlog');
  process.exit(0);
}
console.log(JSON.stringify({ next: top.id, name: top.name, priority: top.priority, candidates: (explicitNext ? [explicitNext, ...sorted] : sorted).slice(0, 5) }, null, 2));
