#!/usr/bin/env node
/**
 * Add Porkbun email forwarding MX + SPF records for a domain.
 *
 * Requires env:
 *   PORKBUN_API_KEY
 *   PORKBUN_SECRET_API_KEY
 *   EMAIL_DOMAIN (default: eillon.maison)
 *
 * Does NOT create the forward (care → your inbox) — do that in Porkbun UI:
 * Domain Management → envelope icon → Create Email Forward.
 */

const DOMAIN = process.env.EMAIL_DOMAIN || 'eillon.maison';
const API_KEY = process.env.PORKBUN_API_KEY;
const SECRET = process.env.PORKBUN_SECRET_API_KEY;

if (!API_KEY || !SECRET) {
  console.error('Set PORKBUN_API_KEY and PORKBUN_SECRET_API_KEY from porkbun.com/account/api');
  process.exit(1);
}

const BASE = 'https://api.porkbun.com/api/json/v3';

async function porkbun(path, body = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey: API_KEY, secretapikey: SECRET, ...body }),
  });
  const data = await res.json();
  if (data.status !== 'SUCCESS') {
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
}

async function listRecords() {
  const data = await porkbun(`/dns/retrieve/${DOMAIN}`);
  return data.records || [];
}

async function createRecord(record) {
  await porkbun(`/dns/create/${DOMAIN}`, record);
  console.log(`Created ${record.type} ${record.name || '@'} → ${record.content}`);
}

const needed = [
  { name: '', type: 'MX', content: 'fwd1.porkbun.com', prio: 10, ttl: 600 },
  { name: '', type: 'MX', content: 'fwd2.porkbun.com', prio: 20, ttl: 600 },
  { name: '', type: 'TXT', content: 'v=spf1 include:_spf.porkbun.com ~all', ttl: 600 },
];

function hasRecord(records, type, content) {
  return records.some((r) => r.type === type && r.content === content);
}

async function main() {
  console.log(`Configuring email DNS for ${DOMAIN}…\n`);
  const records = await listRecords();

  for (const record of needed) {
    if (hasRecord(records, record.type, record.content)) {
      console.log(`Skip ${record.type} ${record.content} (already exists)`);
      continue;
    }
    await createRecord(record);
  }

  console.log('\nDNS records added. Wait 1–5 minutes, then run: node scripts/check-email-dns.mjs');
  console.log('\nStill required in Porkbun UI (cannot be done via API):');
  console.log('  1. porkbun.com → Domain Management → eillon.maison → envelope icon');
  console.log('  2. Create forward: care → your personal inbox');
  console.log('  3. Test from a different email address (not the forward destination)');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
