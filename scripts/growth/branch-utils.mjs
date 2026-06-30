/** Shared growth branch naming rules for automations */
export const OS_IMPROVER_BRANCH = /^growth\/os-\d{4}-\d{2}-\d{2}$/;
export const EXPERIMENT_BRANCH = /^growth\/[a-z0-9_]+-exp-\d{3}[a-z]?-[a-z0-9-]+$/;

export function isValidGrowthBranch(name) {
  const branch = name.replace(/^origin\//, '');
  return OS_IMPROVER_BRANCH.test(branch) || EXPERIMENT_BRANCH.test(branch);
}

export function isForbiddenAutomationBranch(name) {
  const branch = name.replace(/^origin\//, '');
  return branch.startsWith('cursor/') || branch === 'main' || branch === 'master';
}

/**
 * @param {string} branchName
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validateBranchForAutomation(branchName) {
  const branch = branchName.replace(/^origin\//, '').trim();

  if (!branch) {
    return { ok: false, message: 'BLOCKED: could not determine current git branch' };
  }

  if (branch.startsWith('cursor/')) {
    return {
      ok: false,
      message: `BLOCKED: branch "${branch}" uses cursor/* — use growth/<loop>-exp-NNN-<slug> or growth/os-YYYY-MM-DD`,
    };
  }

  if (branch === 'main' || branch === 'master') {
    return {
      ok: false,
      message: `BLOCKED: on "${branch}" — checkout a growth/* experiment or OS branch before running automation`,
    };
  }

  if (!branch.startsWith('growth/')) {
    return {
      ok: false,
      message: `BLOCKED: branch "${branch}" must start with growth/`,
    };
  }

  if (!isValidGrowthBranch(branch)) {
    return {
      ok: false,
      message: `BLOCKED: branch "${branch}" must match growth/<loop>-exp-NNN-<slug> or growth/os-YYYY-MM-DD`,
    };
  }

  return { ok: true };
}
