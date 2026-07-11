const {
  PREORDER_CONSENT_VERSION,
  PREORDER_PRODUCTS,
  getPreorderProductById,
} = require('../data/preorder-products');

function isPaidPreordersEnabled(env = process.env) {
  return env.ENABLE_PAID_PREORDERS === 'true';
}

function getSiteOrigin(value = process.env.SITE_URL) {
  if (!value) throw new Error('SITE_URL is not configured');
  const parsed = new URL(value);
  const localHttp = parsed.protocol === 'http:'
    && ['localhost', '127.0.0.1', '::1', '[::1]'].includes(parsed.hostname);
  if (parsed.protocol !== 'https:' && !localHttp) {
    throw new Error('SITE_URL must use https outside local development');
  }
  return parsed.origin;
}

function getPreorderRuntimeStatus(env = process.env) {
  const missing = new Set();
  const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'DATABASE_URL', 'SITE_URL'];
  required.forEach((key) => {
    if (!String(env[key] || '').trim()) missing.add(key);
  });

  let siteOrigin = null;
  if (!missing.has('SITE_URL')) {
    try {
      siteOrigin = getSiteOrigin(env.SITE_URL);
    } catch {
      missing.add('SITE_URL');
    }
  }

  const stripePrices = {};
  PREORDER_PRODUCTS.filter((product) => product.enabled === true).forEach((product) => {
    const value = String(env[product.stripePriceEnvKey] || '').trim();
    if (!/^price_[A-Za-z0-9_]+$/.test(value)) {
      missing.add(product.stripePriceEnvKey);
      return;
    }
    stripePrices[product.id] = value;
  });

  const featureEnabled = isPaidPreordersEnabled(env);
  const configured = missing.size === 0;
  return {
    featureEnabled,
    configured,
    enabled: featureEnabled && configured,
    missing: [...missing],
    siteOrigin,
    stripePrices,
  };
}

function getPublicPreorderProducts(env = process.env) {
  const runtime = getPreorderRuntimeStatus(env);
  return PREORDER_PRODUCTS.map((product) => ({
    id: product.id,
    productSlug: product.productSlug,
    title: product.title,
    type: product.type,
    price: product.price,
    currency: product.currency,
    description: product.description,
    expectedShipWindow: product.expectedShipWindow,
    refundPolicySummary: product.refundPolicySummary,
    creditPolicy: product.creditPolicy,
    enabled: runtime.enabled && product.enabled === true && Boolean(runtime.stripePrices[product.id]),
  }));
}

module.exports = {
  PREORDER_CONSENT_VERSION,
  PREORDER_PRODUCTS,
  getPreorderProductById,
  getPublicPreorderProducts,
  getPreorderRuntimeStatus,
  getSiteOrigin,
  isPaidPreordersEnabled,
};
