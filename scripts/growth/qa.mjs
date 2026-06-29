#!/usr/bin/env node
/** Minimum growth QA gate — runs build + verify:all */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true });
  return r.status === 0;
}

let ok = true;
ok = run('node', ['scripts/growth/validate-ledger.mjs']) && ok;
ok = run('node', ['scripts/growth/check-state.mjs']) && ok;
ok = run('npm', ['run', 'build']) && ok;
ok = run('npm', ['run', 'verify:all']) && ok;

if (!ok) {
  console.error('\n growth:qa FAILED');
  process.exit(1);
}
console.log('\n growth:qa PASSED');
