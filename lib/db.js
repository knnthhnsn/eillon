const { neon } = require('@neondatabase/serverless');
const { CONSENT_NOTICE_VERSION } = require('./consent');


let sql;

function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not configured');
    sql = neon(url);
  }
  return sql;
}

async function ensureTable() {
  const query = getSql();
  await query`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'waitlist',
      size TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS product_slug TEXT NOT NULL DEFAULT 'beles'
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN NOT NULL DEFAULT FALSE
  `;
  await query`
    ALTER TABLE waitlist_signups
      ALTER COLUMN consent_marketing SET DEFAULT FALSE
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS consent_notice_version TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS utm_source TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS utm_medium TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS utm_campaign TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS name TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS signup_intent TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS selection_label TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS format_price INTEGER
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS currency TEXT
  `;
  await query`
    ALTER TABLE waitlist_signups
      ADD COLUMN IF NOT EXISTS page_path TEXT
  `;
  await query`
    UPDATE waitlist_signups
    SET signup_intent = CASE
      WHEN product_slug = 'all' THEN 'letter'
      WHEN product_slug = 'beles' THEN 'next_restock'
      WHEN product_slug = 'ritual' THEN 'studio_study'
      ELSE 'future_release'
    END
    WHERE signup_intent IS NULL
  `;

  await query`
    ALTER TABLE waitlist_signups
      DROP CONSTRAINT IF EXISTS waitlist_signups_email_key
  `;
  await query`
    CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_product_slug_idx
      ON waitlist_signups (email, product_slug)
  `;
  await query`
    CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
      ON waitlist_signups (created_at DESC)
  `;
  await query`
    CREATE INDEX IF NOT EXISTS waitlist_signups_product_slug_idx
      ON waitlist_signups (product_slug)
  `;
}

async function ensurePreordersTable() {
  const query = getSql();
  await query`
    CREATE TABLE IF NOT EXISTS preorders (
      id BIGSERIAL PRIMARY KEY,
      product_slug TEXT NOT NULL,
      preorder_type TEXT NOT NULL CHECK (preorder_type IN ('sample_preorder', 'bottle_deposit')),
      stripe_session_id TEXT NOT NULL UNIQUE,
      stripe_payment_intent TEXT,
      customer_email TEXT,
      amount_total INTEGER NOT NULL CHECK (amount_total >= 0),
      currency TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      fulfillment_status TEXT NOT NULL DEFAULT 'pending',
      size_interest TEXT,
      source TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await query`
    CREATE INDEX IF NOT EXISTS preorders_created_at_idx
      ON preorders (created_at DESC)
  `;
  await query`
    CREATE INDEX IF NOT EXISTS preorders_payment_intent_idx
      ON preorders (stripe_payment_intent)
  `;
  await query`
    CREATE INDEX IF NOT EXISTS preorders_type_status_idx
      ON preorders (preorder_type, payment_status)
  `;
}

async function createPreorder({
  productSlug,
  preorderType,
  stripeSessionId,
  stripePaymentIntent,
  customerEmail,
  amountTotal,
  currency,
  paymentStatus,
  fulfillmentStatus = 'pending',
  sizeInterest,
  source,
  utmSource,
  utmMedium,
  utmCampaign,
  metadata = {},
  createdAt,
}) {
  const query = getSql();
  const rows = await query`
    INSERT INTO preorders (
      product_slug, preorder_type, stripe_session_id, stripe_payment_intent,
      customer_email, amount_total, currency, payment_status, fulfillment_status,
      size_interest, source, utm_source, utm_medium, utm_campaign, metadata_json, created_at
    )
    VALUES (
      ${productSlug},
      ${preorderType},
      ${stripeSessionId},
      ${stripePaymentIntent || null},
      ${customerEmail || null},
      ${Number(amountTotal) || 0},
      ${String(currency || 'eur').toLowerCase()},
      ${paymentStatus || 'unpaid'},
      ${fulfillmentStatus},
      ${sizeInterest || null},
      ${source || null},
      ${utmSource || null},
      ${utmMedium || null},
      ${utmCampaign || null},
      CAST(${JSON.stringify(metadata || {})} AS JSONB),
      ${createdAt || new Date().toISOString()}
    )
    ON CONFLICT (stripe_session_id) DO UPDATE SET
      stripe_payment_intent = COALESCE(EXCLUDED.stripe_payment_intent, preorders.stripe_payment_intent),
      customer_email = COALESCE(EXCLUDED.customer_email, preorders.customer_email),
      amount_total = EXCLUDED.amount_total,
      currency = EXCLUDED.currency,
      payment_status = CASE
        WHEN preorders.payment_status IN ('refunded', 'partially_refunded') THEN preorders.payment_status
        ELSE EXCLUDED.payment_status
      END,
      size_interest = COALESCE(EXCLUDED.size_interest, preorders.size_interest),
      source = COALESCE(EXCLUDED.source, preorders.source),
      utm_source = COALESCE(EXCLUDED.utm_source, preorders.utm_source),
      utm_medium = COALESCE(EXCLUDED.utm_medium, preorders.utm_medium),
      utm_campaign = COALESCE(EXCLUDED.utm_campaign, preorders.utm_campaign),
      metadata_json = EXCLUDED.metadata_json,
      updated_at = NOW()
    RETURNING *, (xmax = 0) AS is_new
  `;
  return rows[0] || null;
}

async function getPreorderBySession(stripeSessionId) {
  const query = getSql();
  const rows = await query`
    SELECT *
    FROM preorders
    WHERE stripe_session_id = ${stripeSessionId}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function listPreorders({ limit = 100, offset = 0 } = {}) {
  const query = getSql();
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  return query`
    SELECT id, product_slug, preorder_type, stripe_session_id, stripe_payment_intent,
           customer_email, amount_total, currency, payment_status, fulfillment_status,
           size_interest, source, utm_source, utm_medium, utm_campaign,
           metadata_json, created_at, updated_at
    FROM preorders
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;
}

async function getPreorderSummary() {
  const query = getSql();
  const rows = await query`
    SELECT
      COUNT(*) FILTER (WHERE payment_status = 'paid')::int AS total_paid_preorders,
      COUNT(*) FILTER (WHERE payment_status = 'paid' AND preorder_type = 'sample_preorder')::int AS sample_preorder_count,
      COUNT(*) FILTER (WHERE payment_status = 'paid' AND preorder_type = 'bottle_deposit')::int AS bottle_deposit_count,
      COALESCE(SUM(amount_total) FILTER (WHERE payment_status = 'paid'), 0)::bigint AS paid_amount_total,
      COUNT(*)::int AS total_records
    FROM preorders
  `;
  return rows[0] || {
    total_paid_preorders: 0,
    sample_preorder_count: 0,
    bottle_deposit_count: 0,
    paid_amount_total: 0,
    total_records: 0,
  };
}

async function markPreorderRefunded({ stripePaymentIntent, fullyRefunded = true }) {
  const query = getSql();
  const paymentStatus = fullyRefunded ? 'refunded' : 'partially_refunded';
  const fulfillmentStatus = fullyRefunded ? 'cancelled' : 'pending';
  const rows = await query`
    UPDATE preorders
    SET payment_status = ${paymentStatus},
        fulfillment_status = ${fulfillmentStatus},
        updated_at = NOW()
    WHERE stripe_payment_intent = ${stripePaymentIntent}
    RETURNING *
  `;
  return rows[0] || null;
}

async function markPreorderExpired(stripeSessionId) {
  const query = getSql();
  const rows = await query`
    UPDATE preorders
    SET payment_status = 'expired', updated_at = NOW()
    WHERE stripe_session_id = ${stripeSessionId}
      AND payment_status NOT IN ('paid', 'refunded', 'partially_refunded')
    RETURNING *
  `;
  return rows[0] || null;
}

async function upsertSignup({
  email,
  source,
  size,
  productSlug,
  name,
  signupIntent,
  selectionLabel,
  formatPrice,
  currency,
  pagePath,
  utm = {},
  consentMarketing = false,
  consentNoticeVersion = CONSENT_NOTICE_VERSION,
}) {
  const query = getSql();
  const rows = await query`
    INSERT INTO waitlist_signups (
      email, product_slug, source, size, name,
      signup_intent, selection_label, format_price, currency, page_path,
      utm_source, utm_medium, utm_campaign,
      consent_marketing, consent_at, consent_notice_version
    )
    VALUES (
      ${email},
      ${productSlug || 'beles'},
      ${source},
      ${size || null},
      ${name || null},
      ${signupIntent || null},
      ${selectionLabel || null},
      ${Number.isInteger(formatPrice) ? formatPrice : null},
      ${currency || null},
      ${pagePath || null},
      ${utm.utm_source || null},
      ${utm.utm_medium || null},
      ${utm.utm_campaign || null},
      ${consentMarketing},
      NOW(),
      ${consentNoticeVersion}
    )
    ON CONFLICT (email, product_slug) DO UPDATE SET
      source = EXCLUDED.source,
      size = COALESCE(EXCLUDED.size, waitlist_signups.size),
      name = COALESCE(EXCLUDED.name, waitlist_signups.name),
      signup_intent = COALESCE(EXCLUDED.signup_intent, waitlist_signups.signup_intent),
      selection_label = COALESCE(EXCLUDED.selection_label, waitlist_signups.selection_label),
      format_price = COALESCE(EXCLUDED.format_price, waitlist_signups.format_price),
      currency = COALESCE(EXCLUDED.currency, waitlist_signups.currency),
      page_path = COALESCE(EXCLUDED.page_path, waitlist_signups.page_path),
      utm_source = COALESCE(EXCLUDED.utm_source, waitlist_signups.utm_source),
      utm_medium = COALESCE(EXCLUDED.utm_medium, waitlist_signups.utm_medium),
      utm_campaign = COALESCE(EXCLUDED.utm_campaign, waitlist_signups.utm_campaign),
      consent_marketing = EXCLUDED.consent_marketing,
      consent_at = EXCLUDED.consent_at,
      consent_notice_version = EXCLUDED.consent_notice_version,
      updated_at = NOW()
    RETURNING
      email,
      product_slug,
      source,
      size,
      name,
      signup_intent,
      selection_label,
      format_price,
      currency,
      page_path,
      created_at,
      updated_at,
      (xmax = 0) AS is_new
  `;

  const row = rows[0];
  return {
    email: row.email,
    productSlug: row.product_slug,
    source: row.source,
    size: row.size,
    name: row.name,
    signupIntent: row.signup_intent,
    selectionLabel: row.selection_label,
    formatPrice: row.format_price,
    currency: row.currency,
    pagePath: row.page_path,
    isNew: Boolean(row.is_new),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listSignups({ limit = 100, offset = 0 } = {}) {
  const query = getSql();
  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const safeOffset = Math.max(offset, 0);
  return query`
    SELECT email, product_slug, source, size, name, status,
           signup_intent, selection_label, format_price, currency, page_path,
           consent_marketing, consent_at, consent_notice_version,
           created_at, updated_at
    FROM waitlist_signups
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;
}

async function countSignups() {
  const query = getSql();
  const rows = await query`SELECT COUNT(*)::int AS total FROM waitlist_signups`;
  return rows[0]?.total ?? 0;
}

module.exports = {
  ensureTable,
  upsertSignup,
  listSignups,
  countSignups,
  ensurePreordersTable,
  createPreorder,
  getPreorderBySession,
  listPreorders,
  getPreorderSummary,
  markPreorderRefunded,
  markPreorderExpired,
};
