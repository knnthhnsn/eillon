#!/usr/bin/env node
/** Validate current git branch against growth naming rules */
import { spawnSync } from 'child_process';
import { validateBranchForAutomation } from './branch-utils.mjs';

const branchResult = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
  encoding: 'utf8',
});
const branch = branchResult.stdout?.trim();

if (branchResult.status !== 0 || !branch) {
  console.error('Could not read current git branch');
  process.exit(1);
}

const result = validateBranchForAutomation(branch);
if (!result.ok) {
  console.error(result.message);
  process.exit(1);
}

console.log(`OK: branch "${branch}" matches growth naming rules`);
