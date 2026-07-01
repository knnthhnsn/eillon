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

if (!/POSTHOG_BRIDGE_EVENTS/.test(analytics)) {
  failures.push('scripts/analytics.js: missing POSTHOG_BRIDGE_EVENTS whitelist');
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
if (!/posthogBridge\s*===\s*true/.test(analytics)) {
  failures.push('scripts/analytics.js: bridge must only activate when posthogBridge === true');
}
if (!/posthog\.capture/.test(analytics)) {
  failures.push('scripts/analytics.js: missing posthog.capture call');
}
if (!/if\s*\(\s*!enabled/.test(analytics)) {
  failures.push('scripts/analytics.js: posthog.capture must be guarded by enabled flag');
}

if (failures.length) {
  console.error('✗ PostHog bridge verification failed:\n');
  failures.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('✓ PostHog bridge verification passed');
