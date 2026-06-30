#!/usr/bin/env node
/** Validate growth/backlog.md table loop_type column against ledger allowlist */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backlogPath = join(__dirname, '../../growth/backlog.md');

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

const ALLOWED_STATUSES = new Set(['backlog', 'next', 'done', 'cancelled', 'blocked', 'in_progress']);

const backlog = readFileSync(backlogPath, 'utf8');
const rows = backlog
  .split('\n')
  .filter((l) => l.startsWith('| EXP-'))
  .map((l) => {
    const parts = l.split('|').map((s) => s.trim());
    return {
      id: parts[1],
      loop: parts[3],
      status: parts[parts.length - 2].replace(/\*/g, ''),
    };
  });

let errors = 0;
for (const row of rows) {
  if (!ALLOWED_LOOP_TYPES.has(row.loop)) {
    console.error(
      `Backlog ${row.id}: invalid loop "${row.loop}" — must match program.md loop_type values (see validate-ledger.mjs)`
    );
    errors++;
  }
  if (!ALLOWED_STATUSES.has(row.status.toLowerCase())) {
    console.error(`Backlog ${row.id}: invalid status "${row.status}"`);
    errors++;
  }
}

if (errors) {
  console.error(`\nvalidate-backlog FAILED (${errors} issue(s))`);
  process.exit(1);
}

console.log(`OK: ${rows.length} backlog rows (loop_type + status validated)`);
