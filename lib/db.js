const { neon } = require('@neondatabase/serverless');

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
      ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN NOT NULL DEFAULT TRUE
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

async function upsertSignup({ email, source, size, productSlug, utm = {} }) {
  const query = getSql();
  await query`
    INSERT INTO waitlist_signups (
      email, product_slug, source, size, utm_source, utm_medium, utm_campaign
    )
    VALUES (
      ${email},
      ${productSlug || 'beles'},
      ${source},
      ${size || null},
      ${utm.utm_source || null},
      ${utm.utm_medium || null},
      ${utm.utm_campaign || null}
    )
    ON CONFLICT (email, product_slug) DO UPDATE SET
      source = EXCLUDED.source,
      size = COALESCE(EXCLUDED.size, waitlist_signups.size),
      utm_source = COALESCE(EXCLUDED.utm_source, waitlist_signups.utm_source),
      utm_medium = COALESCE(EXCLUDED.utm_medium, waitlist_signups.utm_medium),
      utm_campaign = COALESCE(EXCLUDED.utm_campaign, waitlist_signups.utm_campaign),
      updated_at = NOW()
  `;
}

async function listSignups() {
  const query = getSql();
  return query`
    SELECT email, product_slug, source, size, status, created_at, updated_at
    FROM waitlist_signups
    ORDER BY created_at DESC
  `;
}

module.exports = { ensureTable, upsertSignup, listSignups };
