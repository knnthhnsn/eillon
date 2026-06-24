const crypto = require('crypto');
const { ensureTable, listSignups } = require('../lib/db');
const { getClientIp, checkRateLimit } = require('../lib/rate-limit');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function safeEqual(a, b) {
  if (!a || !b) return false;
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`waitlist-admin:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
    json(res, 429, { error: 'Too many requests' });
    return;
  }

  const adminKey = process.env.WAITLIST_ADMIN_KEY;
  if (!adminKey) {
    json(res, 503, { error: 'Admin access is not configured' });
    return;
  }

  if (!safeEqual(String(req.headers['x-admin-key'] || ''), adminKey)) {
    json(res, 401, { error: 'Unauthorized' });
    return;
  }

  try {
    await ensureTable();
    const signups = await listSignups();
    json(res, 200, { count: signups.length, signups });
  } catch (err) {
    console.error('waitlist admin failed', err);
    json(res, 500, { error: 'Could not load signups' });
  }
};
