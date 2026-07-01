#!/usr/bin/env node
/** AEO build orchestrator — answers sync, blocks, schema, llms files. */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  EILLON_ANSWERS,
  EILLON_ANSWERS_VERSION,
  EILLON_ANSWERS_LAST_REVIEWED,
} from '../data/answers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function syncAnswersJs() {
  const body = `/** EILLON canonical answers — browser mirror. Source: data/answers.mjs */
window.EILLON_ANSWERS_VERSION = '${EILLON_ANSWERS_VERSION}';
window.EILLON_ANSWERS_LAST_REVIEWED = '${EILLON_ANSWERS_LAST_REVIEWED}';
window.EILLON_ANSWERS = ${JSON.stringify(EILLON_ANSWERS, null, 2)};
`;
  writeFileSync(join(root, 'data/answers.js'), body);
  console.log('✓ data/answers.js');
}

function run(script) {
  execSync(`node scripts/${script}`, { cwd: root, stdio: 'inherit' });
}

syncAnswersJs();
run('generate-llms.mjs');
run('render-answer-blocks.mjs');
run('build-aeo-schema.mjs');
console.log('AEO build complete.');
