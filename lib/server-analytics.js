const PII_KEYS = new Set([
  'email',
  'name',
  'customer_email',
  'phone',
  'address',
  'stripe_session_id',
  'stripe_payment_intent',
]);

function sanitizeProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => !PII_KEYS.has(key))
      .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value) || value === null)
      .filter(([, value]) => typeof value !== 'string'
        || (!/@|%40/i.test(value) && (value.match(/\d/g) || []).length < 7))
      .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 255) : value]),
  );
}

async function trackPreorderPaid(properties = {}) {
  const safe = sanitizeProperties(properties);
  console.info(JSON.stringify({ kind: 'eillon_server_event', event: 'preorder_paid_completed', ...safe }));

  try {
    const { track } = await import('@vercel/analytics/server');
    await track('preorder_paid_completed', {
      preorder_type: safe.preorder_type || 'unknown',
      source: safe.source || 'unknown',
    });
  } catch (err) {
    console.warn('preorder_paid_completed analytics delivery skipped', err?.message || err);
  }
}

module.exports = { sanitizeProperties, trackPreorderPaid };
