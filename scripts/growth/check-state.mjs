#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const statePath = join(__dirname, '../../growth/state.json');
let state;
try {
  state = JSON.parse(readFileSync(statePath, 'utf8'));
} catch (e) {
  console.error('Invalid state.json:', e.message);
  process.exit(1);
}
const required = [
  'schema_version',
  'lock_status',
  'open_growth_prs_count',
  'autonomy_level',
  'current_focus',
];
for (const k of required) {
  if (!(k in state)) {
    console.error(`Missing key: ${k}`);
    process.exit(1);
  }
}
console.log(JSON.stringify(state, null, 2));
