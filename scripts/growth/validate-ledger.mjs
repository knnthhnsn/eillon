#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const LEDGER = join(root, 'growth/results.tsv');
const HEADER =
  'date\texperiment_id\tautomation_id\tbranch_or_commit\tloop_type\thypothesis\tchanged_files\tintent_score\tbrand_fit_score\tconversion_score\tdiscoverability_score\tmeasurement_score\ttechnical_quality_score\tcomplexity_penalty\tbrand_risk_penalty\tqualified_growth_score\tstatus\tnotes';

const ALLOWED_STATUSES = new Set(['keep', 'rework', 'discard', 'blocked']);
const ALLOWED_LOOP_TYPES = new Set([
  'demand_research',
  'seo_content',
  'landing_page',
  'conversion_copy',
  'social_distribution',
  'video_asset',
  'local_discovery',
  'analytics_measurement',
  'brand_system',
  'technical_seo',
  'internal_linking',
  'retention_email',
  'automation_os',
  'brand_safety',
  'measurement',
]);

const SCORE_FIELDS = [
  'intent_score',
  'brand_fit_score',
  'conversion_score',
  'discoverability_score',
  'measurement_score',
  'technical_quality_score',
  'complexity_penalty',
  'brand_risk_penalty',
];

const raw = readFileSync(LEDGER, 'utf8').trimEnd().replace(/\r\n/g, '\n');
const lines = raw.split('\n');
if (lines[0].replace(/\r/g, '') !== HEADER) {
  console.error('Invalid results.tsv header');
  console.error('Expected:', HEADER);
  console.error('Got:     ', lines[0]);
  process.exit(1);
}

const headerCols = HEADER.split('\t');
const colIndex = Object.fromEntries(headerCols.map((name, i) => [name, i]));

function fail(rowNum, message) {
  console.error(`Row ${rowNum}: ${message}`);
  process.exit(1);
}

function parseScore(rowNum, label, value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 3) {
    fail(rowNum, `${label} must be integer 0–3, got "${value}"`);
  }
  return n;
}

for (let i = 1; i < lines.length; i++) {
  const rowNum = i + 1;
  const cols = lines[i].split('\t');
  if (cols.length !== 18) {
    fail(rowNum, `expected 18 columns, got ${cols.length}`);
  }

  const date = cols[colIndex.date];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(rowNum, `invalid date "${date}" (expected YYYY-MM-DD)`);
  }

  const experimentId = cols[colIndex.experiment_id];
  if (!/^EXP-\d{3}[a-z]?$/.test(experimentId)) {
    fail(rowNum, `invalid experiment_id "${experimentId}" (expected EXP-NNN or EXP-NNNx)`);
  }

  const loopType = cols[colIndex.loop_type];
  if (!ALLOWED_LOOP_TYPES.has(loopType)) {
    fail(rowNum, `invalid loop_type "${loopType}"`);
  }

  const status = cols[colIndex.status];
  if (!ALLOWED_STATUSES.has(status)) {
    fail(
      rowNum,
      `invalid status "${status}" — use keep, rework, discard, or blocked (not pending_registration; track registration in automation-registry.md)`
    );
  }

  const scores = {};
  for (const field of SCORE_FIELDS) {
    scores[field] = parseScore(rowNum, field, cols[colIndex[field]]);
  }

  const expectedQgs =
    scores.intent_score +
    scores.brand_fit_score +
    scores.conversion_score +
    scores.discoverability_score +
    scores.measurement_score +
    scores.technical_quality_score -
    scores.complexity_penalty -
    scores.brand_risk_penalty;

  const actualQgs = Number(cols[colIndex.qualified_growth_score]);
  if (!Number.isInteger(actualQgs)) {
    fail(rowNum, `qualified_growth_score must be integer, got "${cols[colIndex.qualified_growth_score]}"`);
  }
  if (actualQgs !== expectedQgs) {
    fail(
      rowNum,
      `qualified_growth_score mismatch: ledger=${actualQgs}, computed=${expectedQgs} from component scores`
    );
  }

  if (status === 'keep' && (actualQgs < 13 || scores.brand_risk_penalty > 1)) {
    fail(
      rowNum,
      `status keep requires QGS ≥ 13 and brand_risk_penalty ≤ 1 (got QGS=${actualQgs}, risk=${scores.brand_risk_penalty})`
    );
  }
}

console.log(`OK: ${lines.length - 1} experiment rows (status, loop_type, scores validated)`);
