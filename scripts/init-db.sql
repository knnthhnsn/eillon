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
);

CREATE INDEX IF NOT EXISTS preorders_created_at_idx
  ON preorders (created_at DESC);

CREATE INDEX IF NOT EXISTS preorders_payment_intent_idx
  ON preorders (stripe_payment_intent);

CREATE INDEX IF NOT EXISTS preorders_type_status_idx
  ON preorders (preorder_type, payment_status);
