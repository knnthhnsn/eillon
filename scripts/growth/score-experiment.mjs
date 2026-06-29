#!/usr/bin/env node
/** Compute qualified_growth_score from CLI args */
const args = process.argv.slice(2);
function get(name, def = 0) {
  const i = args.indexOf(`--${name}`);
  if (i === -1 || i + 1 >= args.length) return def;
  return Number(args[i + 1]);
}
if (args.includes('--help')) {
  console.log(`Usage: node score-experiment.mjs \\
  --intent 0-3 --brand 0-3 --conversion 0-3 \\
  --discoverability 0-3 --measurement 0-3 --technical 0-3 \\
  --complexity 0-3 --risk 0-3

qualified_growth_score = sum(scores) - complexity - risk`);
  process.exit(0);
}
const scores = {
  intent: get('intent'),
  brand: get('brand'),
  conversion: get('conversion'),
  discoverability: get('discoverability'),
  measurement: get('measurement'),
  technical: get('technical'),
  complexity: get('complexity'),
  risk: get('risk'),
};
for (const [k, v] of Object.entries(scores)) {
  if (Number.isNaN(v) || v < 0 || v > 3) {
    console.error(`Invalid --${k}: ${v} (expected 0-3)`);
    process.exit(1);
  }
}
const qgs =
  scores.intent +
  scores.brand +
  scores.conversion +
  scores.discoverability +
  scores.measurement +
  scores.technical -
  scores.complexity -
  scores.risk;
const keep = qgs >= 13 && scores.risk <= 1;
console.log(JSON.stringify({ ...scores, qualified_growth_score: qgs, keep_recommended: keep }, null, 2));
