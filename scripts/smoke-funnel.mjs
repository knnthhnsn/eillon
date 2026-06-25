#!/usr/bin/env node
/**
 * Smoke-test the Beles demand funnel HTML against the local static server.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8765);
const BASE = `http://127.0.0.1:${PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      // server still starting
    }
    await wait(250);
  }
  throw new Error(`Server did not start at ${url}`);
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  await waitForServer(`${BASE}/beles`);
  const res = await fetch(`${BASE}/beles`);
  const html = await res.text();

  const checks = [
    ['id="proof"', 'proof section'],
    ['id="waitlist"', 'waitlist section'],
    ['data-size="50"', 'size interest control'],
    ['Eillon Hansen', 'studio authorship'],
    ['Join restock list', 'restock CTA label'],
    ['accord-fruit-550.webp', 'optimized accord WebP'],
  ];

  const failures = checks.filter(([needle]) => !html.includes(needle)).map(([, label]) => label);
  if (failures.length) {
    throw new Error(`Missing funnel markers: ${failures.join(', ')}`);
  }

  console.log('✓ Beles demand funnel smoke test passed');
} finally {
  server.kill('SIGTERM');
  await wait(300);
}
