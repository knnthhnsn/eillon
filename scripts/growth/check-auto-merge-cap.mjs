#!/usr/bin/env node
/** Enforce L2b rolling auto-merge cap from results.tsv + state.json */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const LEDGER = join(root, 'growth/results.tsv');
const STATE = join(root, 'growth/state.json');

const state = JSON.parse(readFileSync(STATE, 'utf8'));
const maxPer7Days = state.auto_merge_policy?.max_per_7_days ?? 3;
const enabled = state.auto_merge_policy?.enabled !== false;

if (!enabled) {
  console.log('OK: auto_merge_policy disabled — cap check skipped');
  process.exit(0);
}

const raw = readFileSync(LEDGER, 'utf8').trimEnd().replace(/\r\n/g, '\n');
const lines = raw.split('\n');
const header = lines[0].split('\t');
const col = Object.fromEntries(header.map((name, i) => [name, i]));

const cutoff = new Date();
cutoff.setUTCDate(cutoff.getUTCDate() - 7);
const cutoffStr = cutoff.toISOString().slice(0, 10);

const merges = [];
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split('\t');
  const automationId = cols[col.automation_id];
  const status = cols[col.status];
  const date = cols[col.date];
  const experimentId = cols[col.experiment_id];

  if (automationId !== 'pr_growth_auto_merge' || status !== 'keep') continue;
  if (date < cutoffStr) continue;

  merges.push({ date, experiment_id: experimentId, notes: cols[col.notes]?.slice(0, 80) });
}

console.log(
  `Auto-merge cap: ${merges.length}/${maxPer7Days} in rolling 7 days (since ${cutoffStr})`
);

if (merges.length) {
  for (const row of merges) {
    console.log(`  ${row.date} ${row.experiment_id} — ${row.notes}`);
  }
}

if (merges.length >= maxPer7Days) {
  console.error(
    `BLOCKED: auto-merge cap reached (${merges.length}/${maxPer7Days}). Do not merge; comment on PR and exit.`
  );
  process.exit(1);
}

console.log('OK: auto-merge cap clear');
