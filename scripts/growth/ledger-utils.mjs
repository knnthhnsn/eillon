/** Shared helpers for growth ledger reads */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const LEDGER_PATH = join(__dirname, '../../growth/results.tsv');

export const ALLOWED_LOOP_TYPES = new Set([
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

export function readLedgerRows() {
  const raw = readFileSync(LEDGER_PATH, 'utf8').trimEnd().replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  const header = lines[0].split('\t');
  const col = Object.fromEntries(header.map((name, i) => [name, i]));
  return lines.slice(1).map((line, i) => {
    const cols = line.split('\t');
    return {
      rowNum: i + 2,
      date: cols[col.date],
      experiment_id: cols[col.experiment_id],
      automation_id: cols[col.automation_id],
      loop_type: cols[col.loop_type],
      status: cols[col.status],
      notes: cols[col.notes],
    };
  });
}

/** True when a content experiment already has a keep row (excludes automation_os meta rows). */
export function isExperimentShipped(expId, rows = readLedgerRows()) {
  return rows.some(
    (r) => r.experiment_id === expId && r.status === 'keep' && r.loop_type !== 'automation_os'
  );
}
