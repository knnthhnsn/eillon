#!/usr/bin/env node
/** Validate growth AI hard review artifact */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const fileArg = process.argv[2];
if (!fileArg) {
  console.error('Usage: npm run growth:validate-ai-review -- growth/runs/YYYY-MM-DD-<automation>-<EXP>-ai-review.md');
  process.exit(1);
}

const file = resolve(process.cwd(), fileArg);
if (!existsSync(file)) {
  console.error(`Missing ai-review file: ${file}`);
  process.exit(1);
}

const raw = readFileSync(file, 'utf8');
const required = [
  '# AI Hard Review',
  '## QA baseline',
  '## Bugbot findings',
  '## Manual checks',
  '## Decision',
];

const missing = required.filter((h) => !raw.includes(h));
if (missing.length) {
  console.error('Invalid ai-review file — missing sections:', missing.join(', '));
  process.exit(1);
}

if (!/\*\*Decision\*\*\s*\n\s*pass/i.test(raw) && !/## Decision\s*\n\s*pass/i.test(raw)) {
  console.error('ai-review Decision must be `pass` before keep');
  process.exit(1);
}

if (/severity\s*\|\s*block/i.test(raw) && /\|\s*block\s*\|[^|]*\|\s*(?!fixed|resolved|n\/a)/i.test(raw)) {
  const blockRows = raw.match(/\|\s*B\d+\s*\|\s*block\s*\|[^\n]+/gi) || [];
  const unresolved = blockRows.filter((row) => !/fixed|resolved|n\/a/i.test(row));
  if (unresolved.length) {
    console.error('Unresolved block findings:', unresolved.join('; '));
    process.exit(1);
  }
}

console.log(`OK: ai-review validated — ${fileArg}`);
