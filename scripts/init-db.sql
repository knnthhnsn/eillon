CREATE TABLE IF NOT EXISTS waitlist_signups (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_slug TEXT NOT NULL DEFAULT 'beles',
  source TEXT NOT NULL DEFAULT 'waitlist',
  size TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  consent_marketing BOOLEAN NOT NULL DEFAULT TRUE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, product_slug)
);

CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
  ON waitlist_signups (created_at DESC);

CREATE INDEX IF NOT EXISTS waitlist_signups_product_slug_idx
  ON waitlist_signups (product_slug);
