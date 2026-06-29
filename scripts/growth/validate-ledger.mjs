#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const LEDGER = join(root, 'growth/results.tsv');
const HEADER =
  'date\texperiment_id\tautomation_id\tbranch_or_commit\tloop_type\thypothesis\tchanged_files\tintent_score\tbrand_fit_score\tconversion_score\tdiscoverability_score\tmeasurement_score\ttechnical_quality_score\tcomplexity_penalty\tbrand_risk_penalty\tqualified_growth_score\tstatus\tnotes';

const raw = readFileSync(LEDGER, 'utf8').trimEnd().replace(/\r\n/g, '\n');
const lines = raw.split('\n');
if (lines[0].replace(/\r/g, '') !== HEADER) {
  console.error('Invalid results.tsv header');
  console.error('Expected:', HEADER);
  console.error('Got:     ', lines[0]);
  process.exit(1);
}
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split('\t');
  if (cols.length !== 18) {
    console.error(`Row ${i + 1}: expected 18 columns, got ${cols.length}`);
    process.exit(1);
  }
}
console.log(`OK: ${lines.length - 1} experiment rows`);
