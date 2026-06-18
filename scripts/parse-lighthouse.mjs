import { readFileSync } from 'fs';

const path = process.argv[2] || 'lighthouse-report-latest.json';
const d = JSON.parse(readFileSync(path, 'utf8'));

console.log('SCORES:');
for (const [k, v] of Object.entries(d.categories)) {
  console.log(`  ${k}: ${Math.round(v.score * 100)}`);
}

const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'interactive'];
console.log('\nMETRICS:');
for (const id of metrics) {
  const a = d.audits[id];
  if (a) console.log(`  ${id}: ${a.displayValue} (score ${a.score})`);
}

const partial = Object.values(d.audits)
  .filter((a) => a.score !== null && a.score < 1 && a.score > 0)
  .sort((a, b) => a.score - b.score);

console.log('\nPARTIAL FAILURES:');
for (const a of partial.slice(0, 30)) {
  console.log(`  ${a.id}: ${a.score?.toFixed(2)} — ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
}

const zero = Object.values(d.audits).filter((a) => a.score === 0);
console.log('\nZERO SCORE:');
for (const a of zero.slice(0, 25)) {
  console.log(`  ${a.id}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
}
