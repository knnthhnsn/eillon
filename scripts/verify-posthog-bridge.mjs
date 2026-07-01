#!/usr/bin/env node
/**
 * Verify optional PostHog analytics bridge is safe and off by default.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const analytics = readFileSync(join(root, 'scripts/analytics.js'), 'utf8');
const failures = [];

const DISPATCH_FUNNEL_EVENTS = [
  'letter_opened',
  'letter_action_clicked',
  'archive_to_beles_click',
  'restock_anchor_reached',
];

if (!/POSTHOG_BRIDGE_EVENTS/.test(analytics)) {
  failures.push('scripts/analytics.js: missing POSTHOG_BRIDGE_EVENTS whitelist');
}
for (const event of DISPATCH_FUNNEL_EVENTS) {
  if (!new RegExp(`['"]${event}['"]`).test(analytics)) {
    failures.push(`scripts/analytics.js: POSTHOG_BRIDGE_EVENTS missing ${event}`);
  }
}
if (!/bridgeToPosthog/.test(analytics)) {
  failures.push('scripts/analytics.js: missing bridgeToPosthog helper');
}
if (!/posthogBridge:\s*false/.test(analytics) && !/posthogBridge\s*===\s*true/.test(analytics)) {
  failures.push('scripts/analytics.js: posthogBridge must default off');
}
if (!/sanitizeBridgeProps/.test(analytics)) {
  failures.push('scripts/analytics.js: missing PII sanitization');
}
if (!/PII_PROPERTY_KEYS/.test(analytics)) {
  failures.push('scripts/analytics.js: missing PII_PROPERTY_KEYS set');
}
for (const key of ['email', 'name', 'phone', 'address']) {
  if (!new RegExp(`['"]${key}['"]`).test(analytics)) {
    failures.push(`scripts/analytics.js: PII_PROPERTY_KEYS must include ${key}`);
  }
}
if (!/posthogBridge\s*===\s*true/.test(analytics)) {
  failures.push('scripts/analytics.js: bridge must only activate when posthogBridge === true');
}
if (!/posthog\.capture/.test(analytics)) {
  failures.push('scripts/analytics.js: missing posthog.capture call');
}
if (!/if\s*\(\s*!enabled/.test(analytics)) {
  failures.push('scripts/analytics.js: posthog.capture must be guarded by enabled flag');
}
if (/posthog\.capture\([^)]*props[^)]*\)(?![\s\S]*sanitizeBridgeProps)/.test(analytics)) {
  // ensure capture uses sanitized props — bridgeToPosthog calls sanitizeBridgeProps
}
if (!/posthog\.capture\(eventName,\s*sanitizeBridgeProps\(props\)\)/.test(analytics)) {
  failures.push('scripts/analytics.js: posthog.capture must use sanitizeBridgeProps(props)');
}
if (/posthog\.capture\([^)]*form[^)]*\)/i.test(analytics)) {
  failures.push('scripts/analytics.js: must not forward raw form values to posthog.capture');
}

if (failures.length) {
  console.error('✗ PostHog bridge verification failed:\n');
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('✓ PostHog bridge verification passed');
