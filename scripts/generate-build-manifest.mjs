#!/usr/bin/env node
/**
 * Generate build-manifest.json — deploy fingerprint (not committed; generated at build/deploy).
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function matchVersion(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : null;
}

function gitSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function countLetters(lettersJs) {
  return (lettersJs.match(/\bid:\s*['"][^'"]+['"]/g) || []).length;
}

function hasBelesDispatch(lettersJs) {
  return /id:\s*['"]beles-dispatch['"]/.test(lettersJs);
}

const index = read('index.html');
const homeJs = read('scripts/home.js');
const lettersData = read('data/letters.js');
const lifecycle = read('data/lifecycle.js');

const manifest = {
  commitSha: gitSha(),
  builtAt: new Date().toISOString(),
  assets: {
    homeJs: matchVersion(index, /home\.js\?v=(\d+)/),
    homeMinCss: matchVersion(index, /home\.min\.css\?v=(\d+)/),
    dataLettersJs: matchVersion(homeJs, /data\/letters\.js\?v=(\d+)/),
    lettersJs: matchVersion(homeJs, /\/scripts\/letters\.js\?v=(\d+)/),
    lettersMinCss: matchVersion(homeJs, /letters\.min\.css\?v=(\d+)/),
  },
  lifecycleVersion:
    matchVersion(lifecycle, /EILLON_LIFECYCLE_VERSION\s*=\s*['"]([^'"]+)['"]/) || '1.0.0',
  lettersCount: countLetters(lettersData),
  hasBelesDispatch: hasBelesDispatch(lettersData),
};

writeFileSync(join(root, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('✓ build-manifest.json generated');
