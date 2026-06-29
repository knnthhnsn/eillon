#!/usr/bin/env node
/** Generate growth experiment branch name */
const args = process.argv.slice(2);
const loop = args[0] || 'exp';
const id = args[1] || 'EXP-000';
const slug = (args[2] || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
console.log(`growth/${loop}-${id.toLowerCase()}-${slug}`);
