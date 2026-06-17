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
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'waitlist',
      size TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function upsertSignup({ email, source, size }) {
  const query = getSql();
  await query`
    INSERT INTO waitlist_signups (email, source, size)
    VALUES (${email}, ${source}, ${size || null})
    ON CONFLICT (email) DO UPDATE SET
      source = EXCLUDED.source,
      size = COALESCE(EXCLUDED.size, waitlist_signups.size),
      updated_at = NOW()
  `;
}

async function listSignups() {
  const query = getSql();
  return query`
    SELECT email, source, size, created_at, updated_at
    FROM waitlist_signups
    ORDER BY created_at DESC
  `;
}

module.exports = { ensureTable, upsertSignup, listSignups };
