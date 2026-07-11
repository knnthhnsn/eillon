const { ensurePreordersTable, getPreorderBySession } = require('../lib/db');
const { getClientIp, checkRateLimit } = require('../lib/rate-limit');

const SESSION_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9_]+$/;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`preorder-session:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
    json(res, 429, { error: 'Too many requests' });
    return;
  }

  const sessionId = String(req.query?.session_id || '').trim();
  if (!SESSION_PATTERN.test(sessionId) || sessionId.length > 255) {
    json(res, 400, { error: 'Invalid session reference' });
    return;
  }

  try {
    await ensurePreordersTable();
    const preorder = await getPreorderBySession(sessionId);
    if (!preorder) {
      json(res, 404, { status: 'pending' });
      return;
    }
    json(res, 200, {
      status: preorder.payment_status,
      preorder_type: preorder.preorder_type,
      product_slug: preorder.product_slug,
      amount_total: Number(preorder.amount_total) || 0,
      currency: preorder.currency,
      fulfillment_status: preorder.fulfillment_status,
      size_interest: preorder.size_interest,
      created_at: preorder.created_at,
    });
  } catch (err) {
    console.error('preorder session lookup failed', err);
    json(res, 500, { error: 'Could not confirm preorder' });
  }
};
