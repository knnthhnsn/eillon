#!/usr/bin/env node
/** Print highest-priority backlog experiment ID from growth/backlog.md table */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backlog = readFileSync(join(__dirname, '../../growth/backlog.md'), 'utf8');
const rows = backlog
  .split('\n')
  .filter((l) => l.startsWith('| EXP-'))
  .map((l) => {
    const parts = l.split('|').map((s) => s.trim());
    return {
      id: parts[1],
      name: parts[2],
      status: parts[parts.length - 2].replace(/\*/g, ''),
      priority: parseFloat(parts[parts.length - 3]) || 0,
    };
  })
  .filter((r) => !['done', 'cancelled'].includes(r.status.toLowerCase()));

const explicitNext = rows.find((r) => r.status.toLowerCase() === 'next');
const sorted = rows
  .filter((r) => r.status.toLowerCase() !== 'next' || r === explicitNext)
  .sort((a, b) => b.priority - a.priority);

const top = explicitNext || sorted[0];
if (!top) {
  console.log('No eligible experiments in backlog');
  process.exit(0);
}
console.log(JSON.stringify({ next: top.id, name: top.name, priority: top.priority, candidates: (explicitNext ? [explicitNext, ...sorted] : sorted).slice(0, 5) }, null, 2));
