#!/usr/bin/env node
/** Smoke-test the feature-off Beles preorder path and its legal/schema guards. */
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8768);
const BASE = `http://127.0.0.1:${PORT}`;
const PREORDER_ENV_KEYS = [
  'ENABLE_PAID_PREORDERS',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_BELES_SAMPLE_PREORDER',
  'STRIPE_PRICE_BELES_BOTTLE_DEPOSIT',
  'STRIPE_WEBHOOK_SECRET',
  'SITE_URL',
  'DATABASE_URL',
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await wait(250);
  }
  throw new Error(`Server did not start at ${url}`);
}

function mockResponse() {
  const headers = new Map();
  let body = '';
  return {
    statusCode: 200,
    setHeader(name, value) { headers.set(String(name).toLowerCase(), value); },
    end(value = '') { body = String(value); },
    get body() { return body; },
    get headers() { return headers; },
  };
}

async function withPreorderEnv(values, callback) {
  const previous = Object.fromEntries(PREORDER_ENV_KEYS.map((key) => [key, process.env[key]]));
  PREORDER_ENV_KEYS.forEach((key) => {
    if (Object.hasOwn(values, key)) process.env[key] = values[key];
    else delete process.env[key];
  });
  try {
    return await callback();
  } finally {
    PREORDER_ENV_KEYS.forEach((key) => {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    });
  }
}

async function withMutedConsoleError(callback) {
  const original = console.error;
  console.error = () => {};
  try {
    return await callback();
  } finally {
    console.error = original;
  }
}

async function endpointDisabledCheck() {
  await withPreorderEnv({ ENABLE_PAID_PREORDERS: 'false' }, async () => {
    const checkout = require('../api/create-preorder-checkout-session.js');
    const config = require('../api/preorder-config.js');

    const checkoutRes = mockResponse();
    await checkout({ method: 'POST', headers: {}, body: { product_id: 'beles-founder-sample' } }, checkoutRes);
    if (checkoutRes.statusCode !== 503 || !/not enabled/i.test(checkoutRes.body)) {
      throw new Error('Stripe checkout endpoint did not refuse while ENABLE_PAID_PREORDERS=false');
    }

    const configRes = mockResponse();
    await config({ method: 'GET', headers: {} }, configRes);
    const configBody = JSON.parse(configRes.body || '{}');
    if (configRes.statusCode !== 200 || configBody.enabled !== false) {
      throw new Error('Public preorder config did not report feature disabled');
    }

    const { getPreorderProductById, PREORDER_CONSENT_VERSION } = require('../lib/preorder-config.js');
    const { PREORDER_PRODUCTS } = require('../data/preorder-products.js');
    const requiredProductFields = [
      'id', 'productSlug', 'title', 'type', 'price', 'currency', 'description',
      'expectedShipWindow', 'refundPolicySummary', 'creditPolicy', 'stripePriceEnvKey', 'enabled',
    ];
    if (PREORDER_PRODUCTS.length !== 2
      || PREORDER_PRODUCTS.some((product) => requiredProductFields.some((field) => !Object.hasOwn(product, field)))
      || PREORDER_PRODUCTS[0].type !== 'sample_preorder' || PREORDER_PRODUCTS[0].price !== 28
      || PREORDER_PRODUCTS[1].type !== 'bottle_deposit' || PREORDER_PRODUCTS[1].price !== 30) {
      throw new Error('Preorder catalog does not match the two required typed offers');
    }
    const sample = getPreorderProductById('beles-founder-sample');
    const metadata = {
      preorder_type: sample.type,
      product_slug: sample.productSlug,
      size_interest: 'sample',
      source: 'smoke',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      consent_version: PREORDER_CONSENT_VERSION,
    };
    const params = checkout.buildCheckoutSessionParams({
      product: sample,
      stripePrice: 'price_test_sample',
      siteOrigin: 'https://eillon.maison',
      metadata,
    });
    if (params.success_url !== 'https://eillon.maison/preorder-success?session_id={CHECKOUT_SESSION_ID}') {
      throw new Error('Stripe success URL is incorrect');
    }
    if (params.cancel_url !== 'https://eillon.maison/beles/preorder?cancelled=1') {
      throw new Error('Stripe cancel URL is incorrect');
    }
    const metadataKeys = [
      'preorder_type', 'product_slug', 'size_interest', 'source', 'utm_source',
      'utm_medium', 'utm_campaign', 'consent_version',
    ];
    if (params.metadata !== params.payment_intent_data.metadata
      || metadataKeys.some((key) => !Object.hasOwn(params.metadata, key))
      || Object.hasOwn(params.metadata, 'email')) {
      throw new Error('Stripe metadata must be shared with PaymentIntent and omit raw email');
    }
    if (JSON.stringify(params.shipping_address_collection?.allowed_countries)
      !== JSON.stringify(['DK', 'SE', 'NO', 'DE', 'FR', 'GB', 'US'])) {
      throw new Error('Founder sample Checkout shipping regions do not match visible policy');
    }

    checkout.validateStripePriceMatchesOffer({
      id: 'price_test_sample',
      active: true,
      type: 'one_time',
      recurring: null,
      unit_amount: 2800,
      currency: 'eur',
    }, sample, 'price_test_sample');
    let mismatchRejected = false;
    try {
      checkout.validateStripePriceMatchesOffer({
        id: 'price_test_sample', active: true, type: 'one_time', recurring: null,
        unit_amount: 3000, currency: 'eur',
      }, sample, 'price_test_sample');
    } catch {
      mismatchRejected = true;
    }
    if (!mismatchRejected) throw new Error('Stripe Price amount mismatch was not rejected');
    if (checkout.cleanAttribution('founder@example.com') || checkout.cleanAttribution('+45 12 34 56 78')) {
      throw new Error('Checkout attribution sanitizer accepted likely PII');
    }
  });
}

async function runtimeReadinessCheck() {
  const preorderConfig = require('../lib/preorder-config.js');
  const configEndpoint = require('../api/preorder-config.js');
  const checkout = require('../api/create-preorder-checkout-session.js');
  const complete = {
    ENABLE_PAID_PREORDERS: 'true',
    STRIPE_SECRET_KEY: 'sk_test_runtime_smoke',
    STRIPE_PRICE_BELES_SAMPLE_PREORDER: 'price_sample_runtime_smoke',
    STRIPE_PRICE_BELES_BOTTLE_DEPOSIT: 'price_deposit_runtime_smoke',
    STRIPE_WEBHOOK_SECRET: 'whsec_runtime_smoke',
    SITE_URL: 'https://eillon.maison',
    DATABASE_URL: 'postgresql://runtime-smoke.invalid/eillon',
  };

  const ready = preorderConfig.getPreorderRuntimeStatus(complete);
  if (!ready.enabled || ready.missing.length || ready.siteOrigin !== 'https://eillon.maison') {
    throw new Error('Complete preorder runtime configuration did not become ready');
  }
  if (preorderConfig.isPaidPreordersEnabled({ ENABLE_PAID_PREORDERS: 'TRUE' })) {
    throw new Error('Feature flag must require the exact lowercase value true');
  }
  const missingWebhook = preorderConfig.getPreorderRuntimeStatus({ ...complete, STRIPE_WEBHOOK_SECRET: '' });
  if (missingWebhook.enabled || !missingWebhook.missing.includes('STRIPE_WEBHOOK_SECRET')) {
    throw new Error('Checkout readiness did not require webhook configuration');
  }
  const insecureOrigin = preorderConfig.getPreorderRuntimeStatus({ ...complete, SITE_URL: 'http://eillon.maison' });
  if (insecureOrigin.enabled || !insecureOrigin.missing.includes('SITE_URL')) {
    throw new Error('Checkout readiness accepted an insecure production SITE_URL');
  }

  await withPreorderEnv(complete, async () => {
    const res = mockResponse();
    await configEndpoint({ method: 'GET', headers: {} }, res);
    const body = JSON.parse(res.body || '{}');
    if (!body.enabled || body.products.length !== 2 || body.products.some((product) => !product.enabled)) {
      throw new Error('Public config did not expose both offers for a fully ready runtime');
    }
  });

  const createdSessions = [];
  class FakeStripe {
    constructor(secret) {
      if (secret !== complete.STRIPE_SECRET_KEY) throw new Error('Checkout used the wrong Stripe secret');
      this.prices = {
        retrieve: async (id) => ({
          id,
          active: true,
          type: 'one_time',
          recurring: null,
          unit_amount: id === complete.STRIPE_PRICE_BELES_SAMPLE_PREORDER ? 2800 : 3000,
          currency: 'eur',
        }),
      };
      this.checkout = {
        sessions: {
          create: async (params) => {
            createdSessions.push(params);
            return {
              id: `cs_test_runtime_${createdSessions.length}`,
              url: `https://checkout.stripe.com/c/pay/cs_test_runtime_${createdSessions.length}`,
            };
          },
        },
      };
    }
  }
  const readyCheckout = checkout.createCheckoutHandler({
    Stripe: FakeStripe,
    env: complete,
    getClientIp: () => 'runtime-smoke',
    checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }),
  });
  for (const request of [
    { product_id: 'beles-founder-sample', size_interest: 'sample' },
    { product_id: 'beles-founder-bottle-deposit', size_interest: '100' },
  ]) {
    const res = mockResponse();
    await readyCheckout({
      method: 'POST',
      headers: { origin: 'https://eillon.maison' },
      body: {
        ...request,
        source: 'runtime_smoke',
        utm_source: 'test',
        utm_medium: 'test',
        utm_campaign: 'preorder_smoke',
      },
    }, res);
    if (res.statusCode !== 200 || !/checkout\.stripe\.com/.test(JSON.parse(res.body).url)) {
      throw new Error(`Ready Checkout failed for ${request.product_id}`);
    }
  }
  if (createdSessions.length !== 2
    || createdSessions[0].line_items[0].price !== complete.STRIPE_PRICE_BELES_SAMPLE_PREORDER
    || !createdSessions[0].shipping_address_collection?.allowed_countries.includes('DK')
    || createdSessions[1].line_items[0].price !== complete.STRIPE_PRICE_BELES_BOTTLE_DEPOSIT
    || createdSessions[1].shipping_address_collection
    || createdSessions[1].metadata.size_interest !== '100'
    || Object.hasOwn(createdSessions[0].metadata, 'email')) {
    throw new Error('Ready Checkout did not create the exact two hosted Session contracts');
  }

  class WrongAmountStripe extends FakeStripe {
    constructor(secret) {
      super(secret);
      this.prices.retrieve = async (id) => ({
        id, active: true, type: 'one_time', recurring: null, unit_amount: 1, currency: 'eur',
      });
    }
  }
  const wrongAmountCheckout = checkout.createCheckoutHandler({
    Stripe: WrongAmountStripe,
    env: complete,
    getClientIp: () => 'runtime-smoke-wrong-amount',
    checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }),
  });
  const wrongAmountRes = mockResponse();
  await withMutedConsoleError(() => wrongAmountCheckout({
    method: 'POST',
    headers: { origin: 'https://eillon.maison' },
    body: { product_id: 'beles-founder-sample' },
  }, wrongAmountRes));
  if (wrongAmountRes.statusCode !== 503) {
    throw new Error('Checkout endpoint did not reject a mismatched Stripe Price amount');
  }

  await withPreorderEnv({ ENABLE_PAID_PREORDERS: 'true' }, async () => {
    const res = mockResponse();
    await withMutedConsoleError(() => checkout({
        method: 'POST',
        headers: {},
        body: { product_id: 'beles-founder-sample' },
      }, res));
    if (res.statusCode !== 503 || !/not configured/i.test(res.body)) {
      throw new Error('Checkout did not refuse an enabled but incomplete runtime');
    }
  });
}

async function adminAuthCheck() {
  const admin = require('../api/preorder-admin.js');
  const previous = process.env.WAITLIST_ADMIN_KEY;
  process.env.WAITLIST_ADMIN_KEY = 'preorder-admin-smoke-key';
  try {
    const res = mockResponse();
    await admin({ method: 'GET', headers: { 'x-admin-key': 'wrong-key' }, query: {} }, res);
    if (res.statusCode !== 401 || !/Unauthorized/.test(res.body)) {
      throw new Error('Preorder admin API did not reject an invalid admin key');
    }
  } finally {
    if (previous === undefined) delete process.env.WAITLIST_ADMIN_KEY;
    else process.env.WAITLIST_ADMIN_KEY = previous;
  }
}

async function invokeSignedWebhook(handler, event, secret) {
  const Stripe = require('stripe');
  const payload = JSON.stringify(event);
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  const req = Readable.from([Buffer.from(payload)]);
  req.method = 'POST';
  req.headers = { 'stripe-signature': signature };
  const res = mockResponse();
  await handler(req, res);
  return res;
}

async function webhookLifecycleCheck() {
  const Stripe = require('stripe');
  const { createWebhookHandler } = require('../api/stripe-webhook.js');
  const secret = 'whsec_preorder_smoke';
  let record = null;
  let lastCreateInput = null;
  let paidEvents = 0;
  let expiredEvents = 0;
  const deps = {
    Stripe,
    ensurePreordersTable: async () => {},
    createPreorder: async (input) => {
      lastCreateInput = input;
      const isNew = !record;
      const incoming = {
        product_slug: input.productSlug,
        preorder_type: input.preorderType,
        stripe_session_id: input.stripeSessionId,
        stripe_payment_intent: input.stripePaymentIntent,
        customer_email: input.customerEmail,
        amount_total: input.amountTotal,
        currency: input.currency,
        payment_status: input.paymentStatus,
        fulfillment_status: input.fulfillmentStatus,
        size_interest: input.sizeInterest,
        source: input.source,
        utm_source: input.utmSource,
        utm_medium: input.utmMedium,
        utm_campaign: input.utmCampaign,
        metadata_json: input.metadata,
        created_at: input.createdAt,
      };
      if (isNew) record = incoming;
      else if (!['refunded', 'partially_refunded'].includes(record.payment_status)) record = { ...record, ...incoming };
      return { ...record, is_new: isNew };
    },
    markPreorderExpired: async () => { expiredEvents += 1; return record; },
    markPreorderRefunded: async ({ fullyRefunded }) => {
      if (!record) return null;
      record.payment_status = fullyRefunded ? 'refunded' : 'partially_refunded';
      record.fulfillment_status = fullyRefunded ? 'cancelled' : 'pending';
      return record;
    },
    trackPreorderPaid: async () => { paidEvents += 1; },
  };
  const webhook = createWebhookHandler(deps);
  const metadata = {
    preorder_type: 'sample_preorder', product_slug: 'beles', size_interest: 'sample',
    source: 'smoke', utm_source: 'test', utm_medium: 'test', utm_campaign: 'preorder_smoke',
    consent_version: '2026-07-10',
  };
  const completed = {
    id: 'evt_preorder_completed_smoke', object: 'event', type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: { object: {
      id: 'cs_test_preorder_smoke', payment_intent: 'pi_preorder_smoke',
      customer_details: { email: 'founder-smoke@example.invalid' }, amount_total: 2800,
      currency: 'eur', payment_status: 'paid', created: Math.floor(Date.now() / 1000), metadata,
    } },
  };

  await withPreorderEnv({
    STRIPE_SECRET_KEY: 'sk_test_preorder_smoke', STRIPE_WEBHOOK_SECRET: secret,
  }, async () => {
    let res = await invokeSignedWebhook(webhook, completed, secret);
    if (res.statusCode !== 200 || !/received/.test(res.body)) {
      throw new Error('Stripe webhook rejected a correctly signed completed event');
    }
    if (!record || record.product_slug !== 'beles' || record.preorder_type !== 'sample_preorder'
      || record.customer_email !== 'founder-smoke@example.invalid' || record.amount_total !== 2800
      || record.fulfillment_status !== 'pending' || record.source !== 'smoke'
      || lastCreateInput?.metadata?.utm_campaign !== 'preorder_smoke') {
      throw new Error('Completed webhook did not map required preorder fields');
    }
    res = await invokeSignedWebhook(webhook, completed, secret);
    if (res.statusCode !== 200 || paidEvents !== 1) {
      throw new Error('Duplicate completed webhook was not idempotent for paid analytics');
    }

    const expired = {
      id: 'evt_preorder_expired_smoke', object: 'event', type: 'checkout.session.expired',
      created: completed.created, data: { object: { id: completed.data.object.id, metadata } },
    };
    res = await invokeSignedWebhook(webhook, expired, secret);
    if (res.statusCode !== 200 || expiredEvents !== 1) throw new Error('Expired Checkout event was not handled');

    const refunded = {
      id: 'evt_preorder_refunded_smoke', object: 'event', type: 'charge.refunded',
      created: completed.created,
      data: { object: {
        id: 'ch_preorder_smoke', payment_intent: 'pi_preorder_smoke', amount: 2800,
        amount_refunded: 2800, refunded: true, metadata,
      } },
    };
    res = await invokeSignedWebhook(webhook, refunded, secret);
    if (res.statusCode !== 200 || record.payment_status !== 'refunded' || record.fulfillment_status !== 'cancelled') {
      throw new Error('Refund webhook did not update payment and fulfillment state');
    }
    res = await invokeSignedWebhook(webhook, completed, secret);
    if (res.statusCode !== 200 || record.payment_status !== 'refunded' || paidEvents !== 1) {
      throw new Error('Replayed completion regressed a refunded preorder');
    }

    const retryWebhook = createWebhookHandler({ ...deps, markPreorderRefunded: async () => null });
    res = await withMutedConsoleError(() => invokeSignedWebhook(retryWebhook, refunded, secret));
    if (res.statusCode !== 500) throw new Error('Out-of-order preorder refund did not request a Stripe retry');
  });

  const dbSource = readFileSync(new URL('../lib/db.js', import.meta.url), 'utf8');
  if (!/payment_status\s*=\s*CASE[\s\S]*refunded[\s\S]*partially_refunded/.test(dbSource)) {
    throw new Error('Database upsert does not preserve refund states against completion replay');
  }
  for (const fn of ['createPreorder', 'getPreorderBySession', 'listPreorders', 'markPreorderRefunded']) {
    if (!new RegExp(`async function ${fn}\\b`).test(dbSource)) {
      throw new Error(`lib/db.js is missing ${fn}`);
    }
  }
  const initDb = readFileSync(new URL('./init-db.sql', import.meta.url), 'utf8');
  for (const column of [
    'id', 'product_slug', 'preorder_type', 'stripe_session_id', 'stripe_payment_intent',
    'customer_email', 'amount_total', 'currency', 'payment_status', 'fulfillment_status',
    'size_interest', 'source', 'utm_source', 'utm_medium', 'utm_campaign', 'metadata_json',
    'created_at', 'updated_at',
  ]) {
    if (!new RegExp(`\\b${column}\\b`).test(initDb)) {
      throw new Error(`scripts/init-db.sql is missing preorders.${column}`);
    }
  }
  if (!/stripe_session_id\s+TEXT\s+NOT\s+NULL\s+UNIQUE/i.test(initDb)) {
    throw new Error('scripts/init-db.sql does not enforce unique Stripe Checkout sessions');
  }

  const { sanitizeProperties } = require('../lib/server-analytics.js');
  const analyticsProps = sanitizeProperties({
    preorder_type: 'sample_preorder', source: 'founder@example.com', utm_campaign: 'preorder_smoke',
  });
  if (Object.hasOwn(analyticsProps, 'source') || analyticsProps.utm_campaign !== 'preorder_smoke') {
    throw new Error('Server analytics PII sanitizer did not preserve only safe attribution');
  }
}

const server = spawn('python', ['scripts/dev-server.py'], {
  cwd: root,
  env: { ...process.env, PORT: String(PORT), ENABLE_PAID_PREORDERS: 'false' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  await waitForServer(`${BASE}/beles/preorder`);
  const fetched = [];
  for (const path of [
    '/beles/preorder', '/preorder-success', '/preorder-admin', '/scripts/preorder.min.js',
    '/terms', '/privacy', '/shipping',
  ]) {
    const response = await fetch(`${BASE}${path}`);
    fetched.push({ response, body: await response.text() });
  }
  const [
    { response: pageRes, body: page },
    { response: successRes, body: success },
    { response: adminRes, body: admin },
    { body: preorderJs },
    { body: terms },
    { body: privacy },
    { body: shipping },
  ] = fetched;

  const failures = [];
  if (!pageRes.ok) failures.push('preorder page does not exist');
  if (!successRes.ok) failures.push('preorder success page does not exist');
  if (!adminRes.ok) failures.push('preorder admin page does not exist');
  if ((page.match(/data-preorder-checkout=/g) || []).length !== 2) failures.push('expected two checkout controls');
  if ((page.match(/data-preorder-checkout=[^>]+disabled/g) || []).length !== 2) failures.push('checkout controls are not disabled by default');
  if (!/Checking founder preorder/i.test(page)) failures.push('preorder availability-checking copy missing');
  if (!/No full bottle payment today/i.test(page)) failures.push('no-full-bottle-payment disclosure missing');
  if (!/By continuing to secure checkout/i.test(page) || !/founder preorder terms/i.test(page)) failures.push('checkout terms acknowledgement missing');
  for (const marker of [
    'Beles <em>founder release</em>', 'What exists', 'Locked at pilot scale', 'BL-001 on file', 'Pilot flacons exist',
    'Secure founder preorder', 'Expected shipping window', 'Cancel or refund',
    'Beles proof', 'Craftsmanship', 'Shipping', 'Terms', 'Founder file · FAQ',
  ]) {
    if (!page.includes(marker)) failures.push(`preorder page section missing: ${marker}`);
  }
  if (page.indexOf('id="offers"') > page.indexOf('id="founder-file"')) {
    failures.push('paid offers must appear before the founder proof file');
  }
  for (const offerId of ['founder-sample', 'founder-bottle']) {
    const start = page.indexOf(`id="${offerId}"`);
    const end = page.indexOf('</article>', start);
    const offer = page.slice(start, end);
    if (offer.indexOf('data-preorder-checkout=') > offer.indexOf('preorder-offer__details')) {
      failures.push(`${offerId} checkout action must appear before detailed terms`);
    }
  }
  if (/countdown/i.test(page)) failures.push('preorder page contains countdown language');
  if (!/server-side Stripe webhook/i.test(success)) failures.push('success page does not explain webhook confirmation');
  if (/Stripe will send your receipt/i.test(preorderJs)) failures.push('success flow promises an unconfigured Stripe receipt email');
  if (!/payment confirmation from Stripe/i.test(preorderJs)) failures.push('success flow lacks neutral Stripe confirmation guidance');
  if (!/Founder Bottle Reservation/i.test(terms) || !/refundable before shipment/i.test(terms)
    || !/No full bottle payment today/i.test(terms) || !/must match the amount shown by Stripe/i.test(terms)
    || !/does not guarantee a release date/i.test(terms)) {
    failures.push('terms do not cover the complete preorder contract');
  }
  if (!/Stripe acts as payment processor/i.test(privacy) || !/does not receive or store[\s\S]*full card number/i.test(privacy)
    || !/Preorder record/i.test(privacy) || !/not copied into EILLON's Neon preorder table/i.test(privacy)
    || !/currently 10 July 2026/i.test(privacy) || !/Notice version 2026-07-10/i.test(privacy)) {
    failures.push('privacy does not accurately cover Stripe and preorder data boundaries');
  }
  if (!/Founder preorder dispatch/i.test(shipping) || !/dangerous-goods/i.test(shipping)
    || !/Denmark, Sweden, Norway/i.test(page) || !/Returns/i.test(shipping)
    || !/does not imply a fixed date/i.test(shipping)) {
    failures.push('shipping does not cover regions, limitations, returns, and readiness timing');
  }
  if (!/Total paid/i.test(admin) || !/Sample preorders/i.test(admin) || !/Bottle deposits/i.test(admin)
    || !/Paid total/i.test(admin) || !/<th>Email<\/th>/i.test(admin) || !/Source \/ UTM/i.test(admin)
    || !/Export CSV/i.test(admin) || !/x-admin-key/i.test(admin)) {
    failures.push('preorder admin is missing required protected reporting fields');
  }
  const adminApi = readFileSync(new URL('../api/preorder-admin.js', import.meta.url), 'utf8');
  if (!/WAITLIST_ADMIN_KEY/.test(adminApi) || !/timingSafeEqual/.test(adminApi) || !/Cache-Control[^\n]*no-store/.test(adminApi)) {
    failures.push('preorder admin API is not protected by the existing timing-safe admin auth');
  }

  const journalFiles = [
    'journal/fico-d-india.html',
    'journal/what-does-fico-d-india-smell-like.html',
    'journal/beles-batch-bl001.html',
    'journal/the-bottle.html',
  ];
  for (const file of journalFiles) {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    for (const marker of [
      'Reserve the first Beles release', 'Founder sample preorder €28',
      'Bottle reservation deposit €30', '/beles/preorder?source=journal_internal',
    ]) {
      if (!html.includes(marker)) failures.push(`${file} missing founder preorder module marker: ${marker}`);
    }
  }
  if (!/\/beles\/preorder\?source=answers_internal/.test(readFileSync(new URL('../answers.html', import.meta.url), 'utf8'))) {
    failures.push('answers.html is missing the Beles founder preorder link');
  }

  const keywords = readFileSync(new URL('../growth/ad-keywords.csv', import.meta.url), 'utf8');
  for (const keyword of [
    'prickly pear perfume', 'fico d india perfume', 'fig perfume', 'cactus fruit perfume',
    'oil rich parfum', 'niche perfume Copenhagen', 'genderless niche perfume', 'skin scent perfume',
  ]) {
    if (!keywords.includes(keyword)) failures.push(`growth/ad-keywords.csv missing keyword: ${keyword}`);
  }
  const keywordRows = keywords.trim().split(/\r?\n/).slice(1);
  if (keywordRows.length !== 8 || keywordRows.some((row) => !row.endsWith(',beles_founder_preorder,draft_no_spend'))) {
    failures.push('growth/ad-keywords.csv must contain exactly eight no-spend campaign drafts');
  }
  const utmMap = JSON.parse(readFileSync(new URL('../growth/utm-map.json', import.meta.url), 'utf8'));
  for (const channel of [
    'google_search', 'pinterest', 'instagram', 'email_waitlist', 'journal_internal', 'answers_internal',
  ]) {
    if (!utmMap.channels?.[channel]) failures.push(`growth/utm-map.json missing channel: ${channel}`);
  }
  if (utmMap.pii_allowed !== false || utmMap.campaign !== 'beles_founder_preorder'
    || Object.values(utmMap.channels || {}).some((channel) => channel.utm_campaign !== utmMap.campaign || /@/.test(channel.landing))) {
    failures.push('growth/utm-map.json campaign or no-PII contract is invalid');
  }
  const launchPlan = readFileSync(new URL('../growth/preorder-launch-plan.md', import.meta.url), 'utf8');
  if (!/paid checkout disabled by default/i.test(launchPlan) || !/No full-bottle balance is collected/i.test(launchPlan)) {
    failures.push('growth/preorder-launch-plan.md lacks launch safety gates');
  }

  await endpointDisabledCheck();
  await runtimeReadinessCheck();
  await adminAuthCheck();
  await webhookLifecycleCheck();

  const schemaCheck = spawnSync(process.execPath, ['scripts/verify-product-schema-truth.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (schemaCheck.status !== 0) {
    failures.push(`schema truth check failed: ${(schemaCheck.stderr || schemaCheck.stdout).trim()}`);
  }

  if (failures.length) throw new Error(failures.join('; '));
  console.log('✓ Beles preorder smoke test passed (disabled + simulated launch-ready)');
} finally {
  server.kill('SIGTERM');
  await wait(300);
}
