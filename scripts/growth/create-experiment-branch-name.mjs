#!/usr/bin/env node
/** Generate growth experiment branch name */
import { EXPERIMENT_BRANCH } from './branch-utils.mjs';

const args = process.argv.slice(2);
const loop = args[0] || 'exp';
const id = args[1] || 'EXP-000';
const slug = (args[2] || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
const name = `growth/${loop}-${id.toLowerCase()}-${slug}`;

if (!EXPERIMENT_BRANCH.test(name)) {
  console.error(`Generated branch "${name}" does not match growth/<loop>-exp-NNN-<slug>`);
  process.exit(1);
}

console.log(name);
