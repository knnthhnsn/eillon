#!/usr/bin/env node
/**
 * Smoke-test the Beles demand funnel and archive-to-Beles bridge against the local static server.
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  const belesRes = await fetch(`${BASE}/beles`);
  const belesHtml = await belesRes.text();

  const belesChecks = [
    ['id="proof"', 'proof section'],
    ['id="waitlist"', 'waitlist section'],
    ['proof-ledger', 'proof ledger'],
    ['proof-ledger__link', 'proof ledger links'],
    ['/journal/beles-batch-bl001', 'BL-001 journal link'],
    ['/about#people', 'studio authorship link'],
    ['beles-restock-sticky', 'sticky restock card'],
    ['data-size="50"', 'size interest control'],
    ['Eillon Hansen', 'studio authorship'],
    ['Join restock list', 'restock CTA label'],
    ['accord-fruit-550.webp', 'optimized accord WebP'],
    ['https://schema.org/OutOfStock', 'Beles OutOfStock schema'],
  ];

  const belesFailures = belesChecks.filter(([needle]) => !belesHtml.includes(needle)).map(([, label]) => label);
  if (/"availability"\s*:\s*"https:\/\/schema\.org\/PreOrder"/i.test(belesHtml)) {
    belesFailures.push('Beles must not use PreOrder schema');
  }

  const lettersData = readFileSync(join(root, 'data/letters.js'), 'utf8');
  const lettersJs = readFileSync(join(root, 'scripts/letters.js'), 'utf8');
  const dispatchChecks = [
    lettersData.includes("id: 'beles-dispatch'") || lettersData.includes('id: "beles-dispatch"'),
    lettersData.includes('/beles#waitlist'),
    lettersData.includes('/journal/beles-batch-bl001'),
    /letter_action_clicked/.test(lettersJs),
    /archive_to_beles_click/.test(lettersJs),
    /markRestockSource\s*\(\s*['"]letter_archive['"]\s*\)/.test(lettersJs),
  ];
  if (!dispatchChecks.every(Boolean)) {
    belesFailures.push('Beles Dispatch data + letter analytics wiring');
  }

  if (belesFailures.length) {
    throw new Error(`Missing funnel markers: ${belesFailures.join(', ')}`);
  }

  console.log('✓ Beles demand funnel smoke test passed');
} finally {
  server.kill('SIGTERM');
  await wait(300);
}
