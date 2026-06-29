#!/usr/bin/env node
/** Checkout or create a valid growth/* branch when Cloud Agent lands on cursor/* or main */
import { spawnSync } from 'child_process';
import { validateBranchForAutomation } from './branch-utils.mjs';

function git(args, { inherit = false } = {}) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
  });
}

function currentBranch() {
  const result = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  return result.status === 0 ? result.stdout.trim() : '';
}

function branchExists(name) {
  return git(['rev-parse', '--verify', name]).status === 0;
}

function checkoutBranch(target, base) {
  if (branchExists(target)) {
    const result = git(['checkout', target], { inherit: true });
    if (result.status !== 0) {
      process.exit(1);
    }
    return;
  }

  git(['fetch', 'origin'], { inherit: true });
  const remote = `origin/${target}`;
  if (branchExists(remote)) {
    const result = git(['checkout', '-B', target, remote], { inherit: true });
    if (result.status !== 0) {
      process.exit(1);
    }
    return;
  }

  const baseRef = branchExists(base) ? base : branchExists('origin/main') ? 'origin/main' : 'main';
  const result = git(['checkout', '-b', target, baseRef], { inherit: true });
  if (result.status !== 0) {
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const mode = args[0];
const branch = currentBranch();
const check = validateBranchForAutomation(branch);

if (check.ok) {
  console.log(`OK: already on valid growth branch "${branch}"`);
  process.exit(0);
}

if (mode === '--os' || mode === 'os') {
  const today = new Date().toISOString().slice(0, 10);
  const target = `growth/os-${today}`;
  checkoutBranch(target, 'origin/main');
  console.log(`OK: bootstrapped OS branch "${target}" (was "${branch}")`);
  process.exit(0);
}

if (mode === '--experiment' || mode === 'experiment') {
  const loop = args[1];
  const expId = args[2];
  const slug = args[3];
  if (!loop || !expId || !/^EXP-\d{3}[a-z]?$/i.test(expId)) {
    console.error('Usage: npm run growth:bootstrap-branch -- experiment <loop> EXP-NNN [slug]');
    process.exit(1);
  }
  const slugPart = (slug || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const target = `growth/${loop}-${expId.toLowerCase()}-${slugPart}`;
  checkoutBranch(target, 'origin/main');
  console.log(`OK: bootstrapped experiment branch "${target}" (was "${branch}")`);
  process.exit(0);
}

console.error(
  `BLOCKED: branch "${branch}" is not valid for growth automations.\n` +
    'Run one of:\n' +
    '  npm run growth:bootstrap-branch -- os\n' +
    '  npm run growth:bootstrap-branch -- experiment <loop> EXP-NNN <slug>'
);
process.exit(1);
