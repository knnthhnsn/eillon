/** Shared growth branch naming rules (program.md + OS improver prompt) */
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

export const EXPERIMENT_BRANCH_PATTERN = /^growth\/[a-z_]+-exp-\d{3}[a-z]?-[a-z0-9-]+$/;
export const OS_BRANCH_PATTERN = /^growth\/os-\d{4}-\d{2}-\d{2}$/;

export function getCurrentBranch() {
  const r = spawnSync('git', ['branch', '--show-current'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    return '';
  }
  return r.stdout.trim();
}

/** @returns {{ ok: true } | { ok: false, message: string }} */
export function validateGrowthBranch(name) {
  if (!name) {
    return { ok: false, message: 'No branch name (detached HEAD?) — use growth/<loop>-exp-NNN-<slug> or growth/os-YYYY-MM-DD' };
  }

  if (name === 'main' || name === 'master') {
    return { ok: true };
  }

  if (name.startsWith('cursor/')) {
    return {
      ok: false,
      message: `branch "${name}" uses cursor/* — rename to growth/<loop>-exp-NNN-<slug> via npm run growth:branch (or growth/os-YYYY-MM-DD for OS improver)`,
    };
  }

  if (OS_BRANCH_PATTERN.test(name) || EXPERIMENT_BRANCH_PATTERN.test(name)) {
    return { ok: true };
  }

  return {
    ok: false,
    message: `branch "${name}" must match growth/<loop>-exp-NNN-<slug> or growth/os-YYYY-MM-DD (OS improver)`,
  };
}
