#!/usr/bin/env node
/** Validate growth experiment or OS improver branch naming per program.md */
import { getCurrentBranch, validateGrowthBranch } from './branch-utils.mjs';

const useCurrent = process.argv.includes('--current');
const positional = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const name = useCurrent
  ? getCurrentBranch()
  : positional[0] || process.env.GITHUB_HEAD_REF || '';

if (!name && !useCurrent) {
  console.error('Usage: npm run growth:validate-branch-name -- growth/<loop>-exp-NNN-<slug>');
  console.error('       npm run growth:validate-branch-name -- --current');
  console.error('Do not use cursor/* branches — they bypass growth PR cap and duplicate work.');
  process.exit(1);
}

const result = validateGrowthBranch(name);
if (!result.ok) {
  console.error(`BLOCKED: ${result.message}`);
  console.error('Example experiment: growth/conversion_copy-exp-008-journal-beles-links');
  console.error('Example OS improver: growth/os-2026-06-29');
  process.exit(1);
}

if (name === 'main' || name === 'master') {
  console.log(`OK: on ${name} (branch naming check skipped)`);
} else {
  console.log(`OK: branch name "${name}"`);
}
