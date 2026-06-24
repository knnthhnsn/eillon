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

async function upsertSignup({
  email,
  source,
  size,
  productSlug,
  name,
  utm = {},
  consentMarketing = true,
  consentNoticeVersion = CONSENT_NOTICE_VERSION,
}) {
  const query = getSql();
  const rows = await query`
    INSERT INTO waitlist_signups (
      email, product_slug, source, size, name,
      utm_source, utm_medium, utm_campaign,
      consent_marketing, consent_at, consent_notice_version
    )
    VALUES (
      ${email},
      ${productSlug || 'beles'},
      ${source},
      ${size || null},
      ${name || null},
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

module.exports = { ensureTable, upsertSignup, listSignups, countSignups };
