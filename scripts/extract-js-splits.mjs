#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lines = readFileSync(join(root, 'script.js'), 'utf8').split('\n');

const slice = (start, end) => lines.slice(start - 1, end).join('\n');

const globalCore = `/* EILLON global-core — shared helpers, no pre-LCP DOM work */
(() => {
  'use strict';
  const E = window.EILLON = window.EILLON || {};
  E.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  E.finePointer = window.matchMedia('(pointer: fine)').matches;
  E.mobileLayout = window.matchMedia('(max-width: 900px)');
  E.isLocalDev = /^(localhost|127\\.0\\.0\\.1)$/.test(window.location.hostname);
  E.saveData = navigator.connection?.saveData === true;
  E.readScrollY = () => window.scrollY || window.pageYOffset || 0;
${slice(14, 90)}
  E.isIOS = isIOS;
  E.canPlayWebmVp9 = canPlayWebmVp9;
  E.needsFlatVideoFallback = needsFlatVideoFallback;
  E.addVideoSource = addVideoSource;
  E.ensureLazyVideoSource = ensureLazyVideoSource;
  E.configureBottleVideo = configureBottleVideo;
  E.playVideoSafe = playVideoSafe;
})();
`;

const homeCritical = `/* EILLON home-critical — pre-LCP homepage essentials only */
(() => {
  'use strict';
  document.body.classList.add('is-loaded');
})();
`;

const interactionsBody = `${slice(95, 457)}\n\n${slice(1141, 1326)}\n\n${slice(1729, 1774)}`
  .replace(/const readScrollY = \(\) => window\.scrollY \|\| window\.pageYOffset \|\| 0;\r?\n/g, '');

const interactionsCore = `/* EILLON interactions-core — reveals, nav, waitlist, anchors */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = E.finePointer ?? window.matchMedia('(pointer: fine)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const readScrollY = E.readScrollY;
${interactionsBody}
})();
`;

const homeInteractions = `/* EILLON home-interactions — post-hero homepage wrapper (logic in interactions-core) */
(() => {
  'use strict';
  if (window.EILLON?.__HOME_INTERACTIONS_BOOTED__) return;
  if (window.EILLON) window.EILLON.__HOME_INTERACTIONS_BOOTED__ = true;
})();
`;

const sharedBody = `${slice(1328, 1727)}\n\n${slice(1776, 1810)}`;

const sharedInteractions = `/* EILLON shared-interactions — product grid, bottle explorer, is-loaded */
(() => {
  'use strict';
  if (document.body.dataset.navHome !== 'true') {
    document.body.classList.add('is-loaded');
  }
  if (window.EILLON?.__SHARED_INTERACTIONS_BOOTED__) return;
  if (window.EILLON) window.EILLON.__SHARED_INTERACTIONS_BOOTED__ = true;

  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playVideoSafe = E.playVideoSafe || (() => {});
${sharedBody}
})();
`;

const belesShop = `/* EILLON beles-shop — size selector, sticky restock, shop video */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const playVideoSafe = E.playVideoSafe || (() => {});
  const saveData = E.saveData ?? navigator.connection?.saveData === true;

${slice(744, 1139)}
})();
`;

const chapterInteractions = `/* EILLON chapter-interactions — chapter video + status sync */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const configureBottleVideo = E.configureBottleVideo || (() => ({ mode: 'none' }));
  const playVideoSafe = E.playVideoSafe || (() => {});
  const ensureLazyVideoSource = E.ensureLazyVideoSource || (() => false);
  const saveData = E.saveData ?? navigator.connection?.saveData === true;

${slice(459, 742)}

${slice(1351, 1368)}
  applyChapterPageStatus();
})();
`;

const out = join(root, 'scripts');
writeFileSync(join(out, 'global-core.js'), globalCore);
writeFileSync(join(out, 'home-critical.js'), homeCritical);
writeFileSync(join(out, 'interactions-core.js'), interactionsCore);
writeFileSync(join(out, 'home-interactions.js'), homeInteractions);
writeFileSync(join(out, 'shared-interactions.js'), sharedInteractions);
writeFileSync(join(out, 'beles-shop.js'), belesShop);
writeFileSync(join(out, 'chapter-interactions.js'), chapterInteractions);
console.log('✓ Extracted split source files from script.js');
