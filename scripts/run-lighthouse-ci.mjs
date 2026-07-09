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
const CHROME_FLAGS = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
].join(' ');
const MAX_LIGHTHOUSE_ATTEMPTS = Number(process.env.LH_ATTEMPTS || 3);

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, cwd: root, ...opts });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function analyzeReport() {
  try {
    await run('node', ['scripts/analyze-lighthouse-lcp.mjs', reportPath], { stdio: 'inherit' });
  } catch (err) {
    console.warn('LCP analysis failed:', err.message);
  }
}

async function runLighthouse(attempt) {
  try {
    await run('npx', [
      'lighthouse',
      url,
      '--only-categories=performance',
      '--form-factor=mobile',
      '--screenEmulation.mobile',
      '--throttling-method=devtools',
      '--output=json',
      `--output-path=${reportPath}`,
      `--chrome-flags=${CHROME_FLAGS}`,
      '--quiet',
    ]);
    return true;
  } catch (err) {
    const retryable = /chrome|chromium|devtools|ECONNREFUSED|spawn/i.test(String(err?.message || err));
    if (attempt < MAX_LIGHTHOUSE_ATTEMPTS && retryable) {
      console.warn(`Lighthouse attempt ${attempt} failed (${err.message}); retrying…`);
      await wait(2500 * attempt);
      return runLighthouse(attempt + 1);
    }
    throw err;
  }
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: port },
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout.on('data', () => {});
server.stderr.on('data', () => {});

let budgetFailed = false;

try {
  await waitForServer();
  await runLighthouse(1);
  try {
    await run('node', ['scripts/check-lighthouse-budget.mjs', reportPath], {
      env: {
        ...process.env,
        LH_PERF_MIN: String(budgets.performanceMin),
        LH_LCP_MAX_MS: String(budgets.lcpMaxMs),
        LH_CLS_MAX: String(budgets.clsMax),
      },
    });
  } catch {
    budgetFailed = true;
  }
} finally {
  server.kill('SIGTERM');
  await analyzeReport();
}

if (budgetFailed) {
  process.exit(1);
}
