const { ensureTable, upsertSignup } = require('../lib/db');
const { notifyWaitlistSignup } = require('../lib/waitlist-notify');
const { getClientIp, checkRateLimit } = require('../lib/rate-limit');
const { CONSENT_NOTICE_VERSION } = require('../lib/consent');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRODUCTS = new Set(['beles', 'asmara', 'massawa', 'ritual', 'all']);
const VALID_SOURCES = new Set(['waitlist', 'newsletter', 'store', 'product-card', 'footer']);
const VALID_SIZES = new Set(['sample', '50', '100']);

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
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
  const name = String(payload.name || '').trim().slice(0, 120) || null;
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
      size,
      productSlug,
      name,
      utm,
      consentMarketing,
      consentNoticeVersion: payload.consent_notice_version || CONSENT_NOTICE_VERSION,
    });
    json(res, 200, { ok: true });

    notifyWaitlistSignup(signup).catch((err) => {
      console.error('waitlist notify failed', err);
    });
  } catch (err) {
    console.error('waitlist signup failed', err);
    json(res, 500, { error: 'Could not save signup' });
  }
};
