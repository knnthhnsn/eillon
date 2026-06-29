#!/usr/bin/env node
/** Summarize recent results.tsv rows for automation_os_improver and compass runs */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(__dirname, '../../growth/results.tsv');

const limitArg = process.argv.find((a) => a.startsWith('--last='));
const lastN = limitArg ? Math.max(1, Number(limitArg.split('=')[1]) || 10) : 10;

const raw = readFileSync(LEDGER, 'utf8').trimEnd().replace(/\r\n/g, '\n');
const lines = raw.split('\n');
const header = lines[0].split('\t');
const col = Object.fromEntries(header.map((name, i) => [name, i]));
const rows = lines.slice(1).map((line, i) => {
  const cols = line.split('\t');
  return {
    rowNum: i + 2,
    date: cols[col.date],
    experiment_id: cols[col.experiment_id],
    automation_id: cols[col.automation_id],
    loop_type: cols[col.loop_type],
    status: cols[col.status],
    qgs: cols[col.qualified_growth_score],
    notes: cols[col.notes],
  };
});

const total = rows.length;
const recent = rows.slice(-lastN);

console.log(`Ledger insights (last ${recent.length} of ${total} rows)\n`);

const statusCounts = {};
for (const row of recent) {
  statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
}

console.log('Status counts:');
for (const [status, count] of Object.entries(statusCounts).sort()) {
  console.log(`  ${status}: ${count}`);
}

const attention = recent.filter((r) => ['rework', 'blocked', 'discard'].includes(r.status));
if (attention.length) {
  console.log('\nAttention rows (rework/blocked/discard):');
  for (const row of attention) {
    console.log(`  ${row.experiment_id} (${row.status}) — ${row.automation_id}: ${row.notes.slice(0, 120)}`);
  }
} else {
  console.log('\nNo rework/blocked/discard rows in window.');
}

const invalidStatusHint = recent.some((r) => /pending/i.test(r.status));
if (invalidStatusHint) {
  console.log('\nWARN: pending_* status found — use blocked + automation-registry.md instead.');
}

const shippedInWindow = recent.filter(
  (r) => r.status === 'keep' && r.loop_type !== 'automation_os'
);
const shippedIds = [...new Set(shippedInWindow.map((r) => r.experiment_id))];
if (shippedIds.length) {
  console.log(`\nShipped content experiments in window: ${shippedIds.join(', ')}`);
}

const expIds = recent.map((r) => r.experiment_id);
const dupes = expIds.filter((id, i) => expIds.indexOf(id) !== i);
if (dupes.length) {
  console.log(`\nWARN: duplicate experiment_id in window: ${[...new Set(dupes)].join(', ')}`);
}

const automationCounts = {};
for (const row of recent) {
  automationCounts[row.automation_id] = (automationCounts[row.automation_id] || 0) + 1;
}
const noisy = Object.entries(automationCounts).filter(([, c]) => c >= 2);
if (noisy.length) {
  console.log('\nRepeated automation_id in window (possible duplicate branches):');
  for (const [id, count] of noisy) {
    console.log(`  ${id}: ${count} rows`);
  }
}

if (total < lastN) {
  console.log(
    `\nNote: ledger has ${total} rows (< ${lastN}). Also read growth/memory.md, growth/runs/*.md, and growth/automation-registry.md.`
  );
}

console.log('\nSuggested follow-ups:');
if (attention.some((r) => r.status === 'blocked')) {
  console.log('  - Check growth/automation-registry.md and growth/state.json known_blockers');
}
if (attention.some((r) => r.status === 'rework')) {
  console.log('  - Read linked run logs; add backlog items for fixable rework paths');
}
if (dupes.length) {
  console.log('  - Duplicate experiment_id rows may be meta (auto-merge) — run growth:check-exp-shipped before re-running an EXP');
}
console.log('  - Run npm run growth:validate-backlog and growth:validate-ledger after edits');
console.log('  - Experiment branches must be growth/* — run growth:validate-branch-name before PR');
