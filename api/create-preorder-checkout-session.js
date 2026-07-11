const Stripe = require('stripe');
const { getClientIp, checkRateLimit } = require('../lib/rate-limit');
const {
  PREORDER_CONSENT_VERSION,
  getPreorderProductById,
  getPreorderRuntimeStatus,
  isPaidPreordersEnabled,
} = require('../lib/preorder-config');

const VALID_BOTTLE_SIZES = new Set(['50', '100']);
const SAMPLE_SHIPPING_COUNTRIES = ['DK', 'SE', 'NO', 'DE', 'FR', 'GB', 'US'];

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 8192) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function cleanText(value, maxLength = 120) {
  return String(value || '')
    .replace(/[\r\n\u0000-\u001f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function cleanAttribution(value, maxLength = 120) {
  const text = cleanText(value, maxLength);
  if (/@|%40/i.test(text) || (text.match(/\d/g) || []).length >= 7) return '';
  return text.replace(/[^a-z0-9._-]/gi, '').slice(0, maxLength);
}

function sameOriginRequest(req, siteOrigin) {
  const origin = req.headers?.origin;
  if (!origin) return true;
  try {
    return new URL(origin).origin === siteOrigin;
  } catch {
    return false;
  }
}

function buildCheckoutSessionParams({ product, stripePrice, siteOrigin, metadata }) {
  const params = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: stripePrice, quantity: 1 }],
    success_url: `${siteOrigin}/preorder-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteOrigin}/beles/preorder?cancelled=1`,
    metadata,
    payment_intent_data: { metadata },
    customer_creation: 'always',
  };

  if (product.type === 'sample_preorder') {
    params.shipping_address_collection = {
      allowed_countries: SAMPLE_SHIPPING_COUNTRIES,
    };
  }
  return params;
}

function validateStripePriceMatchesOffer(price, product, expectedPriceId) {
  const expectedAmount = Math.round(Number(product.price) * 100);
  const valid = price
    && price.id === expectedPriceId
    && price.active === true
    && price.type === 'one_time'
    && !price.recurring
    && Number.isInteger(price.unit_amount)
    && price.unit_amount === expectedAmount
    && String(price.currency || '').toUpperCase() === product.currency;
  if (!valid) {
    throw new Error(`Stripe Price does not match ${product.id}`);
  }
  return true;
}

function createCheckoutHandler(overrides = {}) {
  const deps = {
    Stripe,
    getClientIp,
    checkRateLimit,
    env: process.env,
    ...overrides,
  };

  return async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!isPaidPreordersEnabled(deps.env)) {
    json(res, 503, { error: 'Paid preorders are not enabled' });
    return;
  }

  const ip = deps.getClientIp(req);
  const rate = deps.checkRateLimit(`preorder-checkout:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
    json(res, 429, { error: 'Too many requests. Please try again shortly.' });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    json(res, 400, { error: 'Invalid request body' });
    return;
  }

  const product = getPreorderProductById(cleanText(payload.product_id, 80));
  if (!product || product.enabled !== true) {
    json(res, 400, { error: 'Unknown preorder offer' });
    return;
  }

  let sizeInterest = null;
  if (product.type === 'bottle_deposit') {
    sizeInterest = cleanText(payload.size_interest, 8);
    if (!VALID_BOTTLE_SIZES.has(sizeInterest)) {
      json(res, 400, { error: 'Choose a 50 ml or 100 ml bottle interest' });
      return;
    }
  } else {
    sizeInterest = 'sample';
  }

  const runtime = getPreorderRuntimeStatus(deps.env);
  if (!runtime.enabled) {
    console.error('preorder checkout configuration incomplete', runtime.missing.join(', '));
    json(res, 503, { error: 'Preorder checkout is not configured' });
    return;
  }

  const stripeSecret = deps.env.STRIPE_SECRET_KEY;
  const stripePrice = runtime.stripePrices[product.id];
  const siteOrigin = runtime.siteOrigin;

  if (!sameOriginRequest(req, siteOrigin)) {
    json(res, 403, { error: 'Origin not allowed' });
    return;
  }

  const metadata = {
    preorder_type: product.type,
    product_slug: product.productSlug,
    size_interest: sizeInterest,
    source: cleanAttribution(payload.source, 80) || 'preorder_page',
    utm_source: cleanAttribution(payload.utm_source),
    utm_medium: cleanAttribution(payload.utm_medium),
    utm_campaign: cleanAttribution(payload.utm_campaign),
    consent_version: PREORDER_CONSENT_VERSION,
  };

  const sessionParams = buildCheckoutSessionParams({
    product,
    stripePrice,
    siteOrigin,
    metadata,
  });

  const stripe = new deps.Stripe(stripeSecret);
  try {
    const price = await stripe.prices.retrieve(stripePrice);
    validateStripePriceMatchesOffer(price, product, stripePrice);
  } catch (err) {
    console.error('preorder Stripe Price verification failed', err?.type || err?.message || err);
    json(res, 503, { error: 'Preorder checkout is not configured' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    if (!session.url) throw new Error('Stripe did not return a Checkout URL');
    json(res, 200, { url: session.url, session_id: session.id });
  } catch (err) {
    console.error('preorder checkout session failed', err?.type || err?.message || err);
    json(res, 502, { error: 'Could not open secure checkout' });
  }
  };
}

module.exports = createCheckoutHandler();
module.exports.createCheckoutHandler = createCheckoutHandler;
module.exports.buildCheckoutSessionParams = buildCheckoutSessionParams;
module.exports.cleanAttribution = cleanAttribution;
module.exports.validateStripePriceMatchesOffer = validateStripePriceMatchesOffer;
