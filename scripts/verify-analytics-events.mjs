#!/usr/bin/env node
/**
 * Guard analytics wiring — no duplicate scene-rail clicks, required event hooks present.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

const sceneRail = read('scripts/scene-rail.js');
const hasDataAnalytics = /dataset\.analyticsEvent\s*=\s*['"]scene_nav_clicked['"]/.test(sceneRail);
const hasManualSceneTrack = /track\s*\(\s*['"]scene_nav_clicked['"]/.test(sceneRail);
if (hasDataAnalytics && hasManualSceneTrack) {
  failures.push('scripts/scene-rail.js: scene_nav_clicked is tracked both via data-analytics-event and manual track()');
}
if (!/scene_viewed/.test(sceneRail)) {
  failures.push('scripts/scene-rail.js: missing scene_viewed tracking');
}
if (!/#nav,\s*\.nav,\s*\.site-nav,\s*\[data-site-nav\]/.test(sceneRail)) {
  failures.push('scripts/scene-rail.js: navOffset must query #nav, .nav, .site-nav, [data-site-nav]');
}

const letters = read('scripts/letters.js');
if (!/function runStages/.test(letters)) {
  failures.push('scripts/letters.js: missing runStages (opened letters stay invisible without is-ink)');
}
if (!/letter_action_clicked/.test(letters)) {
  failures.push('scripts/letters.js: missing letter_action_clicked tracking');
}
if (!/archive_to_beles_click/.test(letters)) {
  failures.push('scripts/letters.js: missing archive_to_beles_click tracking');
}
if (!/markRestockSource\s*\(\s*['"]letter_archive['"]\s*\)/.test(letters)) {
  failures.push('scripts/letters.js: missing markRestockSource("letter_archive") for waitlist actions');
}
const markIdx = letters.indexOf('markRestockSource');
const actionIdx = letters.indexOf("track('letter_action_clicked'");
const archiveIdx = letters.indexOf("track('archive_to_beles_click'");
if (markIdx === -1 || actionIdx === -1 || archiveIdx === -1 || !(markIdx < actionIdx && actionIdx < archiveIdx)) {
  failures.push('scripts/letters.js: waitlist actions must call markRestockSource before letter_action_clicked before archive_to_beles_click');
}

const scriptJs = read('script.js');
if (!/size_interest_selected/.test(scriptJs)) {
  failures.push('script.js: missing size_interest_selected tracking');
}

const analytics = read('scripts/analytics.js');
const preorder = read('scripts/preorder.js');
const preorderWebhook = read('api/stripe-webhook.js');
const serverAnalytics = read('lib/server-analytics.js');
if (!/POSTHOG_BRIDGE_EVENTS/.test(analytics)) {
  failures.push('scripts/analytics.js: missing PostHog bridge event allowlist');
}
if (!/bridgeToPosthog/.test(analytics)) {
  failures.push('scripts/analytics.js: missing PostHog bridge helper');
}
if (!/EILLON_ANALYTICS_CONFIG/.test(analytics)) {
  failures.push('scripts/analytics.js: missing EILLON_ANALYTICS_CONFIG (posthogBridge default off)');
}
if (!/sanitizeBridgeProps/.test(analytics)) {
  failures.push('scripts/analytics.js: missing PII sanitization for PostHog bridge');
}
if (!/isLikelyPiiValue/.test(analytics) || !/sanitizeAnalyticsProps/.test(analytics) || !/sanitizeAttribution/.test(analytics)) {
  failures.push('scripts/analytics.js: missing frontend PII-value filtering for events and UTM context');
}
if (!/restock_anchor_reached/.test(analytics)) {
  failures.push('scripts/analytics.js: missing restock_anchor_reached tracking');
}
if (!/proof_link_clicked/.test(analytics)) {
  failures.push('scripts/analytics.js: missing proof_link_clicked tracking');
}

for (const event of [
  'preorder_page_viewed',
  'preorder_offer_selected',
  'preorder_checkout_started',
  'preorder_checkout_returned_success',
  'preorder_checkout_cancelled',
  'preorder_proof_link_clicked',
]) {
  if (!preorder.includes(event)) {
    failures.push(`scripts/preorder.js: missing ${event} tracking`);
  }
  if (!analytics.includes(`'${event}'`)) {
    failures.push(`scripts/analytics.js: POSTHOG_BRIDGE_EVENTS missing ${event}`);
  }
}

if (!serverAnalytics.includes('preorder_paid_completed') || !preorderWebhook.includes('trackPreorderPaid')) {
  failures.push('Stripe webhook: missing preorder_paid_completed server event');
}

if (/\b(email|customer_email|stripe_session_id|stripe_payment_intent)\s*:/.test(preorder)) {
  failures.push('scripts/preorder.js: frontend analytics or checkout payload must not include PII/payment identifiers');
}

const requiredBindings = [
  ['bindProofLinks', 'proof links'],
  ['bindScentAtlas', 'scent atlas'],
  ['bindObjectDetails', 'object detail'],
  ['bindLetterArchive', 'letters archive'],
  ['observeRestockAnchor', 'restock anchor'],
];
for (const [fn, label] of requiredBindings) {
  if (!new RegExp(`function\\s+${fn}|const\\s+${fn}\\s*=`).test(analytics)) {
    failures.push(`scripts/analytics.js: missing ${label} binding (${fn})`);
  }
}

if (failures.length) {
  console.error('✗ Analytics verification failed:\n');
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('✓ Analytics verification passed');
