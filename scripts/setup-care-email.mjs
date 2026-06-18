#!/usr/bin/env node
/**
 * Set up care@eillon.maison → forward inbox + Porkbun MX/SPF.
 *
 * Requires:
 *   PORKBUN_API_KEY
 *   PORKBUN_SECRET_API_KEY
 *   CARE_FORWARD_EMAIL (default: kennethchristoffer@gmail.com)
 *   EMAIL_DOMAIN (default: eillon.maison)
 *
 * Enable API access for the domain in Porkbun dashboard if email/create fails.
 */

const DOMAIN = process.env.EMAIL_DOMAIN || 'eillon.maison';
const FORWARD_TO = process.env.CARE_FORWARD_EMAIL || 'kennethchristoffer@gmail.com';
const ALIAS = process.env.CARE_EMAIL_ALIAS || 'care';
const API_KEY = process.env.PORKBUN_API_KEY;
const SECRET = process.env.PORKBUN_SECRET_API_KEY;
const BASE = 'https://api.porkbun.com/api/json/v3';

if (!API_KEY || !SECRET) {
  console.error('Missing PORKBUN_API_KEY or PORKBUN_SECRET_API_KEY.');
  console.error('Create keys at https://porkbun.com/account/api then re-run this script.');
  process.exit(1);
}

async function porkbun(path, body = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey: API_KEY, secretapikey: SECRET, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== 'SUCCESS') {
    const msg = data.message || res.statusText || JSON.stringify(data);
    throw new Error(msg);
  }
  return data;
}

async function listRecords() {
  const data = await porkbun(`/dns/retrieve/${DOMAIN}`);
  return data.records || [];
}

async function createDnsRecord(record) {
  await porkbun(`/dns/create/${DOMAIN}`, record);
  console.log(`DNS: created ${record.type} ${record.content}`);
}

async function ensureEmailDns() {
  const records = await listRecords();
  const has = (type, content) => records.some((r) => r.type === type && r.content === content);

  const needed = [
    { name: '', type: 'MX', content: 'fwd1.porkbun.com', prio: 10, ttl: 600 },
    { name: '', type: 'MX', content: 'fwd2.porkbun.com', prio: 20, ttl: 600 },
    { name: '', type: 'TXT', content: 'v=spf1 include:_spf.porkbun.com ~all', ttl: 600 },
  ];

  for (const record of needed) {
    if (has(record.type, record.content)) {
      console.log(`DNS: skip ${record.type} ${record.content} (exists)`);
    } else {
      await createDnsRecord(record);
    }
  }
}

async function listForwards() {
  const data = await porkbun(`/email/retrieve/${DOMAIN}`);
  return data.forwards || [];
}

async function ensureForward() {
  const email = `${ALIAS}@${DOMAIN}`;
  const forwards = await listForwards();
  const existing = forwards.find(
    (f) => (f.email || '').toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    if ((existing.forward_to || '').toLowerCase() === FORWARD_TO.toLowerCase()) {
      console.log(`Forward: ${email} → ${FORWARD_TO} (already configured)`);
      return;
    }
    await porkbun('/email/update', {
      domain: DOMAIN,
      id: existing.id,
      email,
      forward_to: FORWARD_TO,
    });
    console.log(`Forward: updated ${email} → ${FORWARD_TO}`);
    return;
  }

  await porkbun('/email/create', {
    domain: DOMAIN,
    email,
    forward_to: FORWARD_TO,
  });
  console.log(`Forward: created ${email} → ${FORWARD_TO}`);
}

async function main() {
  console.log(`Setting up ${ALIAS}@${DOMAIN} → ${FORWARD_TO}\n`);

  await ensureEmailDns();
  await ensureForward();

  console.log('\nDone. Wait 1–5 minutes, then test from a different address than the forward destination.');
  console.log('Verify: node scripts/check-email-dns.mjs');
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message || err);
  if (String(err.message).toLowerCase().includes('api access')) {
    console.error('Enable domain API access in Porkbun → Domain Management → eillon.maison');
  }
  process.exit(1);
});
