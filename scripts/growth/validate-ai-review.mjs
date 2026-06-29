#!/usr/bin/env node
/** Validate AI hard review artifact before keep/PR */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node scripts/growth/validate-ai-review.mjs <path-to-*-ai-review.md>');
  process.exit(1);
}

const file = resolve(path);
if (!existsSync(file)) {
  console.error(`Missing AI review artifact: ${file}`);
  process.exit(1);
}

const text = readFileSync(file, 'utf8');
const required = [
  /^#\s+AI Hard Review/m,
  /\*\*Verdict:\*\*\s*(pass_with_notes|pass|fail)/i,
  /##\s+Findings/i,
  /##\s+Checklist sign-off/i,
];

const missing = required.filter((re) => !re.test(text));
if (missing.length) {
  console.error('AI review artifact missing required sections:', missing.length);
  process.exit(1);
}

const verdictMatch = text.match(/\*\*Verdict:\*\*\s*(pass_with_notes|pass|fail)/i);
const verdict = verdictMatch?.[1]?.toLowerCase();

if (verdict === 'fail') {
  console.error('AI review verdict is fail — fix blockers before ship');
  process.exit(1);
}

const openBlocks = [...text.matchAll(/\|\s*block\s*\|/gi)].length;
const unresolvedBlock = /\|\s*block\s*\|[^|\n]*\|\s*open\s*\|/i.test(text);
if (openBlocks > 0 && unresolvedBlock) {
  console.error('AI review has unresolved block findings');
  process.exit(1);
}

console.log(`OK: AI hard review validated (${verdict}) — ${file}`);
