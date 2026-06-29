#!/usr/bin/env node
/** Generate growth experiment branch name (growth/<loop>-exp-NNN-<slug>) */
const args = process.argv.slice(2);
const loop = (args[0] || 'exp').toLowerCase().replace(/[^a-z_]+/g, '_');
const id = (args[1] || 'EXP-000').toUpperCase();
const slug = (args[2] || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const branch = `growth/${loop}-${id.toLowerCase()}-${slug}`;
console.log(branch);
console.error('Use this branch only — never push to cursor/* (bypasses PR cap, causes duplicate PRs).');
