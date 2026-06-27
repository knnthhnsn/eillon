#!/usr/bin/env node
/**
 * CI Lighthouse: start dev server, audit homepage, enforce budget.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const reportPath = join(root, 'lighthouse-report-ci.json');
const url = 'http://127.0.0.1:8080/';
const port = '8080';
const budgets = {
  performanceMin: Number(process.env.LH_PERF_MIN || 60),
  lcpMaxMs: Number(process.env.LH_LCP_MAX_MS || 4500),
  clsMax: Number(process.env.LH_CLS_MAX || 0.1),
};

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, cwd: root, ...opts });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

function waitForServer(maxMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { redirect: 'follow' });
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > maxMs) return reject(new Error('Dev server did not start in time'));
      setTimeout(tick, 400);
    };
    tick();
  });
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: port },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOut = '';
server.stdout.on('data', (d) => { serverOut += d; });
server.stderr.on('data', (d) => { serverOut += d; });

try {
  await waitForServer();
  await run('npx', [
    'lighthouse',
    url,
    '--only-categories=performance',
    '--form-factor=mobile',
    '--screenEmulation.mobile',
    '--throttling-method=devtools',
    '--output=json',
    `--output-path=${reportPath}`,
    '--chrome-flags=--headless',
    '--quiet',
  ]);
  await run('node', ['scripts/check-lighthouse-budget.mjs', reportPath], {
    env: {
      ...process.env,
      LH_PERF_MIN: String(budgets.performanceMin),
      LH_LCP_MAX_MS: String(budgets.lcpMaxMs),
      LH_CLS_MAX: String(budgets.clsMax),
    },
  });
} finally {
  server.kill('SIGTERM');
}
