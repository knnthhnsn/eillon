#!/usr/bin/env node
/** Validate growth experiment branch naming per program.md */
const BRANCH_PATTERN = /^growth\/[a-z_]+-exp-\d{3}[a-z]?-[a-z0-9-]+$/;

const name = process.argv[2] || process.env.GITHUB_HEAD_REF || '';
if (!name) {
  console.error('Usage: npm run growth:validate-branch-name -- growth/<loop>-exp-NNN-<slug>');
  console.error('Do not use cursor/* branches — they bypass growth PR cap and duplicate work.');
  process.exit(1);
}

if (name.startsWith('cursor/')) {
  console.error(
    `BLOCKED: branch "${name}" uses cursor/* — rename to growth/<loop>-exp-NNN-<slug> via npm run growth:branch`
  );
  process.exit(1);
}

if (!BRANCH_PATTERN.test(name)) {
  console.error(`BLOCKED: branch "${name}" does not match growth/<loop>-exp-NNN-<slug>`);
  console.error('Example: growth/conversion_copy-exp-008-journal-beles-links');
  process.exit(1);
}

console.log(`OK: branch name "${name}"`);
