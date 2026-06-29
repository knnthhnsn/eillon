#!/usr/bin/env node
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateBranchForAutomation } from './branch-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const statePath = join(__dirname, '../../growth/state.json');
const forAutomation = process.argv.includes('--for-automation');
const MAX_OPEN_GROWTH_PRS = 3;

let state;
try {
  state = JSON.parse(readFileSync(statePath, 'utf8'));
} catch (e) {
  console.error('Invalid state.json:', e.message);
  process.exit(1);
}

const required = [
  'schema_version',
  'lock_status',
  'open_growth_prs_count',
  'autonomy_level',
  'current_focus',
];

for (const k of required) {
  if (!(k in state)) {
    console.error(`Missing key: ${k}`);
    process.exit(1);
  }
}

if (typeof state.lock_status !== 'string') {
  console.error('lock_status must be a string');
  process.exit(1);
}

if (!Number.isInteger(state.open_growth_prs_count) || state.open_growth_prs_count < 0) {
  console.error('open_growth_prs_count must be a non-negative integer');
  process.exit(1);
}

if (forAutomation) {
  const branchResult = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  });
  const branch = branchResult.stdout?.trim();
  if (branchResult.status === 0 && branch) {
    const branchCheck = validateBranchForAutomation(branch);
    if (!branchCheck.ok) {
      console.error(branchCheck.message);
      process.exit(1);
    }
  }

  if (state.lock_status === 'locked') {
    console.error(
      'BLOCKED: lock_status is locked — another experiment may be in progress. Exit without changes.'
    );
    process.exit(1);
  }
  if (state.open_growth_prs_count >= MAX_OPEN_GROWTH_PRS) {
    console.error(
      `BLOCKED: open_growth_prs_count is ${state.open_growth_prs_count} (max ${MAX_OPEN_GROWTH_PRS}). Exit without opening a new growth PR.`
    );
    process.exit(1);
  }
  console.log(`OK: automation preflight passed (branch=${branch || 'unknown'}, unlocked, PR cap clear)`);
}

console.log(JSON.stringify(state, null, 2));
