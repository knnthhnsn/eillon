#!/usr/bin/env node
/**
 * Guard analytics wiring — no duplicate scene-rail clicks, required event hooks present.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

const sceneRail = read('scripts/scene-rail.js');
const hasDataAnalytics = /dataset\.analyticsEvent\s*=\s*['"]scene_nav_clicked['"]/.test(sceneRail);
const hasManualSceneTrack = /track\s*\(\s*['"]scene_nav_clicked['"]/.test(sceneRail);
if (hasDataAnalytics && hasManualSceneTrack) {
  failures.push('scripts/scene-rail.js: scene_nav_clicked is tracked both via data-analytics-event and manual track()');
}

const letters = read('scripts/letters.js');
if (!/function runStages/.test(letters)) {
  failures.push('scripts/letters.js: missing runStages (opened letters stay invisible without is-ink)');
}
if (!/letter_action_clicked/.test(letters)) {
  failures.push('scripts/letters.js: missing letter_action_clicked tracking');
}
if (!/archive_to_beles_click/.test(letters)) {
  failures.push('scripts/letters.js: missing archive_to_beles_click tracking');
}

const scriptJs = read('script.js');
if (!/size_interest_selected/.test(scriptJs)) {
  failures.push('script.js: missing size_interest_selected tracking');
}

const analytics = read('scripts/analytics.js');
const requiredBindings = [
  ['bindProofLinks', 'proof links'],
  ['bindScentAtlas', 'scent atlas'],
  ['bindObjectDetails', 'object detail'],
  ['bindLetterArchive', 'letters archive'],
  ['observeRestockAnchor', 'restock anchor'],
];
for (const [fn, label] of requiredBindings) {
  if (!new RegExp(`function\\s+${fn}|const\\s+${fn}\\s*=`).test(analytics)) {
    failures.push(`scripts/analytics.js: missing ${label} binding (${fn})`);
  }
}

if (failures.length) {
  console.error('✗ Analytics verification failed:\n');
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('✓ Analytics verification passed');
