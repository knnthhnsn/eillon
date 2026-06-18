#!/usr/bin/env node
/**
 * Verify eillon.maison email DNS (MX + SPF for Porkbun forwarding).
 * Usage: node scripts/check-email-dns.mjs
 */

import { execSync } from 'node:child_process';

const DOMAIN = process.env.EMAIL_DOMAIN || 'eillon.maison';

function dig(args) {
  try {
    return execSync(`dig +short ${args} ${DOMAIN}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const mx = dig('MX').split('\n').filter(Boolean);
const txt = dig('TXT').split('\n').filter(Boolean);

const expectedMx = ['fwd1.porkbun.com', 'fwd2.porkbun.com'];
const hasPorkbunMx = expectedMx.every((host) =>
  mx.some((line) => line.toLowerCase().includes(host.toLowerCase())
));

const hasSpf = txt.some((line) => line.includes('v=spf1') && line.includes('_spf.porkbun.com'));

console.log(`Email DNS check for ${DOMAIN}\n`);
console.log('MX records:');
if (mx.length === 0) console.log('  (none — email cannot be received)');
else mx.forEach((line) => console.log(`  ${line}`));

console.log('\nTXT (SPF):');
if (txt.length === 0) console.log('  (none)');
else txt.forEach((line) => console.log(`  ${line}`));

console.log('\nStatus:');
console.log(`  Porkbun MX: ${hasPorkbunMx ? 'OK' : 'MISSING — run Porkbun Fix DNS or scripts/setup-porkbun-email-dns.mjs'}`);
console.log(`  Porkbun SPF: ${hasSpf ? 'OK' : 'MISSING'}`);

if (!hasPorkbunMx) {
  console.log('\nNext: create care@ forward in Porkbun → Email Hosting → envelope icon on eillon.maison');
  process.exit(1);
}
