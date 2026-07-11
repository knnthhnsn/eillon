const crypto = require('crypto');
const {
  ensurePreordersTable,
  getPreorderSummary,
  listPreorders,
} = require('../lib/db');
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
  const rate = checkRateLimit(`preorder-admin:${ip}`, { limit: 30, windowMs: 60_000 });
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
    await ensurePreordersTable();
    const limit = Math.min(Math.max(parseInt(String(req.query?.limit || '100'), 10) || 100, 1), 500);
    const offset = Math.max(parseInt(String(req.query?.offset || '0'), 10) || 0, 0);
    const [preorders, summary] = await Promise.all([
      listPreorders({ limit, offset }),
      getPreorderSummary(),
    ]);
    json(res, 200, {
      count: preorders.length,
      total: Number(summary.total_records) || 0,
      limit,
      offset,
      summary: {
        total_paid_preorders: Number(summary.total_paid_preorders) || 0,
        sample_preorder_count: Number(summary.sample_preorder_count) || 0,
        bottle_deposit_count: Number(summary.bottle_deposit_count) || 0,
        paid_amount_total: Number(summary.paid_amount_total) || 0,
        currency: 'eur',
      },
      preorders,
    });
  } catch (err) {
    console.error('preorder admin failed', err);
    json(res, 500, { error: 'Could not load preorders' });
  }
};
