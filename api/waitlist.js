const { ensureTable, upsertSignup } = require('../lib/db');
const { notifyWaitlistSignup } = require('../lib/waitlist-notify');
const { getClientIp, checkRateLimit } = require('../lib/rate-limit');
const { CONSENT_NOTICE_VERSION } = require('../lib/consent');
const { getInterestSelection } = require('../lib/product-interest');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRODUCTS = new Set(['beles', 'oliva', 'asmara', 'massawa', 'petricor', 'ritual', 'all']);
const VALID_SOURCES = new Set(['waitlist', 'newsletter', 'store', 'product-card', 'footer']);
const VALID_SIZES = new Set(['sample', '50', '100']);

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePagePath(value, referer) {
  let path = String(value || '').trim();
  if (!path && referer) {
    try {
      path = new URL(referer).pathname;
    } catch {
      path = '';
    }
  }
  if (!path.startsWith('/')) return null;
  return path.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 180) || null;
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 4096) {
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

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`waitlist:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
    json(res, 429, { error: 'Too many requests. Please try again shortly.' });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    json(res, 400, { error: 'Invalid request body' });
    return;
  }

  if (payload.website) {
    json(res, 200, { ok: true });
    return;
  }

  const email = normalizeEmail(payload.email);
  const productSlug = VALID_PRODUCTS.has(payload.product_slug) ? payload.product_slug : 'beles';
  const source = VALID_SOURCES.has(payload.source) ? payload.source : 'waitlist';
  const size = VALID_SIZES.has(payload.size) ? payload.size : null;
  const interest = getInterestSelection(productSlug, size);
  const name = String(payload.name || '').trim().slice(0, 120) || null;
  const pagePath = normalizePagePath(payload.page_path, req.headers?.referer);
  const utm = {
    utm_source: payload.utm_source || null,
    utm_medium: payload.utm_medium || null,
    utm_campaign: payload.utm_campaign || null,
  };

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    json(res, 400, { error: 'Invalid email address' });
    return;
  }

  const consentMarketing = payload.consent_marketing === true;
  const consentRequired = new Set(['waitlist', 'newsletter', 'footer', 'store', 'product-card']);
  if (consentRequired.has(source) && !consentMarketing) {
    json(res, 400, { error: 'Explicit marketing consent required' });
    return;
  }

  try {
    await ensureTable();
    const signup = await upsertSignup({
      email,
      source,
      size: interest.size,
      productSlug,
      name,
      signupIntent: interest.signupIntent,
      selectionLabel: interest.selectionLabel,
      formatPrice: interest.formatPrice,
      currency: interest.currency,
      pagePath,
      utm,
      consentMarketing,
      consentNoticeVersion: payload.consent_notice_version || CONSENT_NOTICE_VERSION,
    });
    json(res, 200, {
      ok: true,
      signup: {
        product_slug: signup.productSlug,
        size: signup.size,
        signup_intent: signup.signupIntent,
        intent_label: interest.intentLabel,
        selection_label: signup.selectionLabel,
        format_price: signup.formatPrice,
        currency: signup.currency,
        page_path: signup.pagePath,
      },
    });

    notifyWaitlistSignup(signup).catch((err) => {
      console.error('waitlist notify failed', err);
    });
  } catch (err) {
    console.error('waitlist signup failed', err);
    json(res, 500, { error: 'Could not save signup' });
  }
};
