const Stripe = require('stripe');
const {
  ensurePreordersTable,
  createPreorder,
  markPreorderExpired,
  markPreorderRefunded,
} = require('../lib/db');
const { trackPreorderPaid } = require('../lib/server-analytics');

const PREORDER_TYPES = new Set(['sample_preorder', 'bottle_deposit']);
const DEFAULT_DEPS = {
  Stripe,
  ensurePreordersTable,
  createPreorder,
  markPreorderExpired,
  markPreorderRefunded,
  trackPreorderPaid,
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readRawBody(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += buffer.length;
    if (length > 1024 * 1024) throw new Error('Payload too large');
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function isPreorderSession(session) {
  return session?.metadata?.product_slug === 'beles'
    && PREORDER_TYPES.has(session?.metadata?.preorder_type);
}

async function persistCompletedSession(session, deps = DEFAULT_DEPS) {
  if (!isPreorderSession(session)) return null;
  await deps.ensurePreordersTable();
  const metadata = session.metadata || {};
  return deps.createPreorder({
    productSlug: metadata.product_slug,
    preorderType: metadata.preorder_type,
    stripeSessionId: session.id,
    stripePaymentIntent:
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'eur',
    paymentStatus: session.payment_status || 'unpaid',
    fulfillmentStatus: 'pending',
    sizeInterest: metadata.size_interest || null,
    source: metadata.source || null,
    utmSource: metadata.utm_source || null,
    utmMedium: metadata.utm_medium || null,
    utmCampaign: metadata.utm_campaign || null,
    metadata,
    createdAt: session.created ? new Date(session.created * 1000).toISOString() : undefined,
  });
}

function createWebhookHandler(overrides = {}) {
  const deps = { ...DEFAULT_DEPS, ...overrides };
  return async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    json(res, 503, { error: 'Webhook is not configured' });
    return;
  }

  const signature = req.headers?.['stripe-signature'];
  if (!signature) {
    json(res, 400, { error: 'Missing Stripe signature' });
    return;
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    const stripe = new deps.Stripe(stripeSecret);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.warn('stripe webhook signature rejected', err?.message || err);
    json(res, 400, { error: 'Invalid webhook signature' });
    return;
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const preorder = await persistCompletedSession(event.data.object, deps);
      if (preorder?.payment_status === 'paid' && preorder?.is_new) {
        await deps.trackPreorderPaid({
          preorder_type: preorder.preorder_type,
          source: preorder.source || 'unknown',
          amount_total: Number(preorder.amount_total) || 0,
          currency: preorder.currency,
          utm_source: preorder.utm_source || null,
          utm_medium: preorder.utm_medium || null,
          utm_campaign: preorder.utm_campaign || null,
        });
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      if (isPreorderSession(session)) {
        await deps.ensurePreordersTable();
        await deps.markPreorderExpired(session.id);
      }
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const paymentIntent = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id;
      if (paymentIntent && isPreorderSession(charge)) {
        await deps.ensurePreordersTable();
        const updated = await deps.markPreorderRefunded({
          stripePaymentIntent: paymentIntent,
          fullyRefunded: charge.refunded === true || charge.amount_refunded >= charge.amount,
        });
        if (!updated) {
          throw new Error('Refund arrived before its preorder record; retry required');
        }
      }
    }

    json(res, 200, { received: true });
  } catch (err) {
    console.error('stripe webhook processing failed', event?.type, err);
    json(res, 500, { error: 'Webhook processing failed' });
  }
  };
}

module.exports = createWebhookHandler();
module.exports.createWebhookHandler = createWebhookHandler;
module.exports.isPreorderSession = isPreorderSession;
module.exports.persistCompletedSession = persistCompletedSession;
