#!/usr/bin/env node
/** Exit non-zero if experiment_id already has a content keep row in results.tsv */
import { isExperimentShipped, readLedgerRows } from './ledger-utils.mjs';

const expId = process.argv[2];
if (!expId || !/^EXP-\d{3}[a-z]?$/.test(expId)) {
  console.error('Usage: npm run growth:check-exp-shipped -- EXP-NNN');
  process.exit(1);
}

const rows = readLedgerRows();
if (isExperimentShipped(expId, rows)) {
  const match = rows.find(
    (r) => r.experiment_id === expId && r.status === 'keep' && r.loop_type !== 'automation_os'
  );
  console.error(
    `BLOCKED: ${expId} already shipped (ledger row ${match?.rowNum}, ${match?.loop_type}, ${match?.automation_id}). Pick another EXP or mark backlog done.`
  );
  process.exit(1);
}

console.log(`OK: ${expId} not yet shipped in ledger`);
