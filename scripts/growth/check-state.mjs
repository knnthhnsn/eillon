#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getCurrentBranch, validateGrowthBranch } from './branch-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const statePath = join(__dirname, '../../growth/state.json');
const forAutomation = process.argv.includes('--for-automation');
const lockOnly = process.argv.includes('--lock-only');
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

function exitIfLocked() {
  if (state.lock_status === 'locked') {
    console.error(
      'BLOCKED: lock_status is locked — another experiment may be in progress. Exit without changes.'
    );
    process.exit(1);
  }
}

if (lockOnly) {
  exitIfLocked();
  console.log('OK: lock check passed (unlocked)');
} else if (forAutomation) {
  exitIfLocked();
  if (state.open_growth_prs_count >= MAX_OPEN_GROWTH_PRS) {
    console.error(
      `BLOCKED: open_growth_prs_count is ${state.open_growth_prs_count} (max ${MAX_OPEN_GROWTH_PRS}). Exit without opening a new growth PR.`
    );
    process.exit(1);
  }
  const branch = getCurrentBranch();
  const branchCheck = validateGrowthBranch(branch);
  if (!branchCheck.ok) {
    console.error(`BLOCKED: ${branchCheck.message}`);
    process.exit(1);
  }
  if (branch && branch !== 'main' && branch !== 'master') {
    console.log(`OK: branch "${branch}" passes growth naming guard`);
  }
  console.log('OK: automation preflight passed (unlocked, PR cap clear, branch valid)');
}

console.log(JSON.stringify(state, null, 2));
