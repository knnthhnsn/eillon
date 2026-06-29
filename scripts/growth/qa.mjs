#!/usr/bin/env node
/** Minimum growth QA gate — runs build + verify:all */
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

function run(cmd, args, { optional = false } = {}) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true });
  if (r.status !== 0 && !optional) {
    return false;
  }
  return r.status === 0;
}

function ensureDependencies() {
  const gsapPath = join(root, 'node_modules', 'gsap', 'dist', 'gsap.min.js');
  if (existsSync(gsapPath)) {
    return true;
  }
  console.log('\n> node_modules incomplete (GSAP missing) — running npm ci');
  return run('npm', ['ci'], { optional: false });
}

let ok = true;
ok = ensureDependencies() && ok;
ok = run('node', ['scripts/growth/validate-ledger.mjs']) && ok;
ok = run('node', ['scripts/growth/check-state.mjs']) && ok;
ok = run('npm', ['run', 'build']) && ok;
ok = run('npm', ['run', 'verify:all']) && ok;

if (!ok) {
  console.error('\n growth:qa FAILED');
  process.exit(1);
}
console.log('\n growth:qa PASSED');
