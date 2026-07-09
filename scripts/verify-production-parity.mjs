#!/usr/bin/env node
/**
 * Production parity — compare live origin against repo lifecycle + asset expectations.
 *
 * Usage:
 *   VERIFY_PRODUCTION=true npm run verify:production
 *   EILLON_ORIGIN=https://deployment.vercel.app EXPECT_COMMIT_SHA=<sha> VERIFY_PRODUCTION=true npm run verify:production
 *   PARITY_OUT=deploy-url EILLON_ORIGIN=... VERIFY_PRODUCTION=true node scripts/verify-production-parity.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = (process.env.EILLON_ORIGIN || 'https://eillon.maison').replace(/\/$/, '');
const COMPARE_DEPLOY_ORIGIN = process.env.COMPARE_DEPLOY_ORIGIN?.replace(/\/$/, '') || null;
const OUT_DIR = join(root, 'artifacts', 'parity');
const OUT_BASENAME = process.env.PARITY_OUT || 'latest';
const VERIFY_TARGET =
  process.env.VERIFY_TARGET ||
  (OUT_BASENAME === 'deploy-url'
    ? 'deployment-url'
    : OUT_BASENAME === 'production-alias'
      ? 'production-alias'
      : ORIGIN.includes('vercel.app')
        ? 'deployment-url'
        : 'production-alias');
const OUT_JSON = join(OUT_DIR, `${OUT_BASENAME}.json`);
const OUT_MD = join(OUT_DIR, `${OUT_BASENAME}.md`);
const strict = process.env.VERIFY_PRODUCTION === 'true' || process.argv.includes('--required');
const maxAttempts = process.env.VERIFY_PRODUCTION_RETRY === 'true' ? 5 : 1;
const retryDelayMs = Number(process.env.VERIFY_PRODUCTION_RETRY_DELAY_MS || 25000);

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

function matchVersion(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : null;
}

function repoExpectations() {
  const lettersData = read('data/letters.js');
  const homeJs = read('scripts/home.js');
  const index = read('index.html');
  return {
    lettersCount: (lettersData.match(/\bid:\s*['"][^'"]+['"]/g) || []).length,
    hasBelesDispatch: /id:\s*['"]beles-dispatch['"]/.test(lettersData),
    expectedAssets: {
      homeJs: matchVersion(index, /home\.js\?v=(\d+)/),
      homeMinCss: matchVersion(index, /home\.min\.css\?v=(\d+)/),
      dataLettersJs: matchVersion(homeJs, /data\/letters\.js\?v=(\d+)/),
      lettersJs: matchVersion(homeJs, /\/scripts\/letters\.js\?v=(\d+)/),
      lettersMinCss: matchVersion(homeJs, /letters\.min\.css\?v=(\d+)/),
    },
    expectedCommitSha: process.env.EXPECT_COMMIT_SHA || null,
  };
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function marker(found, label) {
  return { label, found: Boolean(found) };
}

function routeResult(label, url, expected, found, pass, notes = []) {
  return { route: label, url, expected, found, pass, notes };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shaMatches(expected, live) {
  if (!expected || !live) return true;
  const e = expected.trim();
  const l = live.trim();
  return l === e || l.startsWith(e.slice(0, 7)) || e.startsWith(l.slice(0, 7));
}

async function fetchText(origin, path, audit) {
  const url = `${origin}${path}${path.includes('?') ? '&' : '?'}audit=${audit}`;
  const res = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`${url} returned ${res.status}`);
  }
  return { url, body: await res.text() };
}

function checkRootLifecycle(html, routeLabel) {
  const failures = [];
  const notes = [];
  const found = [];
  const awaiting = /Awaiting next release/i.test(html);
  const staleBeles = html.includes('<p class="mv-chapter__status">Out of stock</p>');
  const sixLetters = /six letters folded/i.test(html);
  const houseLetters = /house letters folded/i.test(html);

  found.push(marker(awaiting, 'awaiting_next_release'));
  found.push(marker(!staleBeles, 'beles_status_not_out_of_stock'));
  found.push(marker(!sixLetters, 'archive_not_six_letters'));
  found.push(marker(houseLetters, 'numberless_archive_copy'));

  if (!awaiting) {
    failures.push(`${routeLabel}: missing "Awaiting next release"`);
    notes.push('Missing Awaiting next release');
  }
  if (staleBeles) {
    failures.push(`${routeLabel}: Beles status still "Out of stock"`);
    notes.push('Found <p class="mv-chapter__status">Out of stock</p>');
  }
  if (sixLetters) {
    failures.push(`${routeLabel}: still says "six letters folded"`);
    notes.push('Found "six letters folded"');
  }
  if (!houseLetters) {
    failures.push(`${routeLabel}: missing numberless archive copy ("house letters folded")`);
    notes.push('Missing house letters folded archive lede');
  }

  return { failures, notes, found, pass: failures.length === 0 };
}

function rootIsCurrent(html) {
  return (
    /Awaiting next release/i.test(html) &&
    !html.includes('<p class="mv-chapter__status">Out of stock</p>') &&
    !/six letters folded/i.test(html)
  );
}

async function runParityCheck() {
  const audit = String(Date.now());
  const failures = [];
  const classifications = [];
  const routes = [];
  const repo = repoExpectations();

  const pageDefs = [
    { path: '/', label: 'homepage' },
    { path: '/index.html', label: 'index-html' },
    { path: '/store', label: 'store' },
    { path: '/beles', label: 'beles' },
    { path: '/asmara', label: 'asmara' },
    { path: '/massawa', label: 'massawa' },
    { path: '/petricor', label: 'petricor' },
    { path: '/ritual', label: 'ritual' },
  ];

  const assetDefs = [
    { path: '/data/letters.js', label: 'data-letters-js' },
    {
      path: `/scripts/home.js${repo.expectedAssets.homeJs ? `?v=${repo.expectedAssets.homeJs}` : ''}`,
      label: 'home-js',
    },
    { path: '/build-manifest.json', label: 'build-manifest' },
  ];

  const html = Object.create(null);
  const assets = Object.create(null);
  const urls = Object.create(null);

  for (const page of pageDefs) {
    try {
      const { url, body } = await fetchText(ORIGIN, page.path, audit);
      html[page.label] = body;
      urls[page.label] = url;
    } catch (err) {
      failures.push(`Could not fetch ${page.label}: ${err.message}`);
      routes.push(routeResult(page.label, `${ORIGIN}${page.path}`, [], [], false, [err.message]));
    }
  }

  for (const asset of assetDefs) {
    try {
      const { url, body } = await fetchText(ORIGIN, asset.path, audit);
      assets[asset.label] = body;
      urls[asset.label] = url;
    } catch (err) {
      const msg = `Could not fetch ${asset.label}: ${err.message}`;
      if (strict || asset.label !== 'build-manifest') failures.push(msg);
      routes.push(routeResult(asset.label, `${ORIGIN}${asset.path}`, [], [], false, [msg]));
    }
  }

  if (html.homepage) {
    const root = checkRootLifecycle(html.homepage, 'live /');
    failures.push(...root.failures);
    routes.push(
      routeResult('homepage', urls.homepage, ['Root lifecycle current'], root.found, root.pass, root.notes),
    );
  }

  if (html['index-html']) {
    const root = checkRootLifecycle(html['index-html'], 'live /index.html');
    failures.push(...root.failures);
    routes.push(
      routeResult('index-html', urls['index-html'], ['Root lifecycle current'], root.found, root.pass, root.notes),
    );
  }

  if (html.homepage && html['index-html']) {
    const homeOk = rootIsCurrent(html.homepage);
    const indexOk = rootIsCurrent(html['index-html']);
    if (indexOk && !homeOk) {
      const msg = 'clean URL root stale: /index.html is current but / (clean URL) is stale';
      failures.push(msg);
      classifications.push('clean_url_root_stale');
      routes.push(
        routeResult('classification', ORIGIN, ['Clean URL parity'], [marker(true, 'clean_url_root_stale')], false, [msg]),
      );
    }
    if (!indexOk && homeOk) {
      const msg = 'index.html stale: / is current but /index.html is stale';
      failures.push(msg);
      classifications.push('index_html_stale');
    }
  }

  if (html.store && html.homepage) {
    const storeCurrent =
      /Awaiting next release/i.test(html.store) &&
      !html.store.includes('<p class="mv-chapter__status">Out of stock</p>');
    const homeStale = html.homepage.includes('<p class="mv-chapter__status">Out of stock</p>');

    if (storeCurrent && homeStale) {
      const msg = 'root HTML stale: /store shows current lifecycle but / homepage still shows Out of stock';
      failures.push(msg);
      classifications.push('root_html_stale');
      routes.push(
        routeResult('classification', ORIGIN, ['Store vs root'], [marker(true, 'root_html_stale')], false, [msg]),
      );
    }
  }

  if (COMPARE_DEPLOY_ORIGIN) {
    try {
      const deployFetch = await fetchText(COMPARE_DEPLOY_ORIGIN, '/', audit);
      const deployCurrent = rootIsCurrent(deployFetch.body);
      const aliasCurrent = html.homepage ? rootIsCurrent(html.homepage) : false;
      if (deployCurrent && !aliasCurrent) {
        const msg = `domain alias stale: deploy ${COMPARE_DEPLOY_ORIGIN} is current but ${ORIGIN} is stale`;
        failures.push(msg);
        classifications.push('domain_alias_stale');
        classifications.push('deploy_url_current_alias_stale');
        routes.push(
          routeResult(
            'classification',
            ORIGIN,
            ['Deploy vs alias'],
            [marker(true, 'deploy_url_current_alias_stale')],
            false,
            [msg],
          ),
        );
      }
    } catch (err) {
      failures.push(`Could not compare deploy origin ${COMPARE_DEPLOY_ORIGIN}: ${err.message}`);
    }
  }

  if (assets['data-letters-js']) {
    const notes = [];
    const hasDispatch = /beles-dispatch/.test(assets['data-letters-js']);
    if (repo.hasBelesDispatch && !hasDispatch) {
      failures.push('live data/letters.js: missing beles-dispatch');
      notes.push('beles-dispatch not found');
    }
    routes.push(
      routeResult(
        'data-letters-js',
        urls['data-letters-js'],
        ['Contains beles-dispatch'],
        [marker(hasDispatch, 'beles_dispatch_in_data')],
        notes.length === 0,
        notes,
      ),
    );
  }

  if (assets['home-js']) {
    const notes = [];
    const found = [];
    const liveHome = assets['home-js'];
    let assetStale = false;

    for (const [key, label, pattern] of [
      ['dataLettersJs', 'data_letters_version', /data\/letters\.js\?v=(\d+)/],
      ['lettersJs', 'letters_script_version', /\/scripts\/letters\.js\?v=(\d+)/],
    ]) {
      const expected = repo.expectedAssets[key];
      const liveVersion = matchVersion(liveHome, pattern);
      const ok = expected && liveVersion === expected;
      found.push(marker(ok, label));
      if (expected && !ok) {
        assetStale = true;
        const msg = `live scripts/home.js: ${key} version ${liveVersion || 'missing'} !== repo ${expected}`;
        failures.push(msg);
        notes.push(msg);
      }
    }

    if (assetStale) {
      classifications.push('asset_version_stale');
    }

    routes.push(
      routeResult(
        'home-js',
        urls['home-js'],
        ['data/letters.js version matches repo', 'scripts/letters.js version matches repo'],
        found,
        notes.length === 0,
        notes,
      ),
    );
  }

  for (const label of ['asmara', 'massawa', 'petricor']) {
    if (!html[label]) continue;
    const notes = [];
    const found = [];
    for (const [pattern, msg, key] of [
      [/Out of stock/i, `live ${label}: contains "Out of stock"`, 'no_out_of_stock'],
      [/Notify when back/i, `live ${label}: contains "Notify when back"`, 'no_notify_when_back'],
      [/returns to the boutique/i, `live ${label}: contains "returns to the boutique"`, 'no_returns_boutique'],
    ]) {
      const hit = pattern.test(stripComments(html[label]));
      found.push(marker(!hit, key));
      if (hit) {
        failures.push(msg);
        notes.push(msg);
      }
    }
    routes.push(routeResult(label, urls[label], ['Chapter lifecycle clean'], found, notes.length === 0, notes));
  }

  if (html.ritual) {
    const visible = stripComments(html.ritual);
    const notes = [];
    const found = [];
    if (/Out of stock/i.test(html.ritual)) {
      failures.push('live ritual: contains "Out of stock"');
      notes.push('Found "Out of stock"');
      found.push(marker(false, 'no_out_of_stock'));
    } else {
      found.push(marker(true, 'no_out_of_stock'));
    }
    if (/restock/i.test(visible)) {
      failures.push('live ritual: visible copy contains "restock"');
      notes.push('Visible copy contains "restock"');
      found.push(marker(false, 'no_restock_copy'));
    } else {
      found.push(marker(true, 'no_restock_copy'));
    }
    if (/"offers"\s*:/.test(html.ritual)) {
      failures.push('live ritual: Product schema contains "offers"');
      notes.push('Schema contains "offers"');
      found.push(marker(false, 'no_schema_offers'));
    } else {
      found.push(marker(true, 'no_schema_offers'));
    }
    routes.push(routeResult('ritual', urls.ritual, ['Studio archive copy clean'], found, notes.length === 0, notes));
  }

  if (assets['build-manifest']) {
    const notes = [];
    const found = [];
    try {
      const liveManifest = JSON.parse(assets['build-manifest']);
      if (repo.hasBelesDispatch && liveManifest.hasBelesDispatch !== true) {
        const msg = 'live build-manifest.json: hasBelesDispatch is not true';
        failures.push(msg);
        notes.push(msg);
        found.push(marker(false, 'hasBelesDispatch'));
      } else {
        found.push(marker(true, 'hasBelesDispatch'));
      }

      if (repo.lettersCount && liveManifest.lettersCount !== repo.lettersCount) {
        const msg = `live build-manifest.json: lettersCount ${liveManifest.lettersCount} !== repo ${repo.lettersCount}`;
        failures.push(msg);
        notes.push(msg);
        found.push(marker(false, 'lettersCount'));
      } else {
        found.push(marker(true, 'lettersCount'));
      }

      if (repo.expectedCommitSha && liveManifest.commitSha) {
        const ok = shaMatches(repo.expectedCommitSha, liveManifest.commitSha);
        found.push(marker(ok, 'commitSha'));
        if (!ok) {
          const msg = `live build-manifest.json: commitSha ${liveManifest.commitSha.slice(0, 7)} !== expected ${repo.expectedCommitSha.slice(0, 7)}`;
          failures.push(msg);
          notes.push(msg);
          classifications.push('manifest_commit_mismatch');
        }
      } else {
        found.push(marker(true, 'commitSha_skipped'));
      }

      for (const [key, manifestKey] of [
        ['dataLettersJs', 'dataLettersJs'],
        ['lettersJs', 'lettersJs'],
        ['homeJs', 'homeJs'],
      ]) {
        const expected = repo.expectedAssets[key];
        const live = liveManifest.assets?.[manifestKey];
        if (expected && live && live !== expected) {
          const msg = `live build-manifest assets.${manifestKey} ${live} !== repo ${expected}`;
          failures.push(msg);
          notes.push(msg);
          classifications.push('asset_version_stale');
        }
      }
    } catch (err) {
      const msg = `Could not parse live build-manifest.json: ${err.message}`;
      failures.push(msg);
      notes.push(msg);
    }
    routes.push(
      routeResult('build-manifest', urls['build-manifest'], ['Deploy manifest valid'], found, notes.length === 0, notes),
    );
  } else if (strict) {
    failures.push('live build-manifest.json not available');
  }

  return {
    timestamp: new Date().toISOString(),
    origin: ORIGIN,
    verifyTarget: VERIFY_TARGET,
    compareDeployOrigin: COMPARE_DEPLOY_ORIGIN,
    audit,
    strict,
    attempt: null,
    pass: failures.length === 0,
    repo,
    classifications: [...new Set(classifications)],
    routes,
    failures,
  };
}

function writeMarkdown(report) {
  const lines = [
    '# Production parity report',
    '',
    `- **Origin:** ${report.origin}`,
    `- **Verify target:** ${report.verifyTarget || 'unknown'}`,
    `- **Compare deploy:** ${report.compareDeployOrigin || 'none'}`,
    `- **Timestamp:** ${report.timestamp}`,
    `- **Pass:** ${report.pass ? 'yes' : 'no'}`,
    `- **Strict:** ${report.strict}`,
    `- **Attempt:** ${report.attempt}/${report.maxAttempts}`,
  ];

  if (report.classifications?.length) {
    lines.push('', '## Classifications', ...report.classifications.map((c) => `- ${c}`));
  }

  if (report.failures?.length) {
    lines.push('', '## Failures', ...report.failures.map((f) => `- ${f}`));
  }

  lines.push('', '## Routes');
  for (const route of report.routes) {
    lines.push('', `### ${route.route}`, `- URL: ${route.url}`, `- Pass: ${route.pass ? 'yes' : 'no'}`);
    if (route.notes?.length) {
      lines.push('- Notes:', ...route.notes.map((n) => `  - ${n}`));
    }
  }

  return `${lines.join('\n')}\n`;
}

let report = null;
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  report = await runParityCheck();
  report.attempt = attempt;
  report.maxAttempts = maxAttempts;

  if (report.pass) break;

  if (attempt < maxAttempts) {
    console.warn(`Attempt ${attempt}/${maxAttempts} failed — retrying in ${retryDelayMs}ms…`);
    await wait(retryDelayMs);
  }
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(OUT_MD, writeMarkdown(report));

if (report.failures.length) {
  console.error(`✗ Production parity failed (${ORIGIN}) [attempt ${report.attempt}/${maxAttempts}]:\n`);
  report.failures.forEach((msg) => console.error(`  • ${msg}`));
  if (report.classifications.length) {
    console.error('\nClassifications:');
    report.classifications.forEach((msg) => console.error(`  • ${msg}`));
  }
  console.error(`\nReport: ${OUT_JSON.replace(/\\/g, '/')}`);
  console.error(`Summary: ${OUT_MD.replace(/\\/g, '/')}`);
  process.exit(1);
}

console.log(`✓ Production parity passed (${ORIGIN}) [attempt ${report.attempt}/${maxAttempts}]`);
console.log(`Report: ${OUT_JSON.replace(/\\/g, '/')}`);
console.log(`Summary: ${OUT_MD.replace(/\\/g, '/')}`);
