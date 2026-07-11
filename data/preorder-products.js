/** Beles paid restock catalog shared by the browser and Vercel functions. */
const EILLON_PREORDER_CONSENT_VERSION = '2026-07-10';

const EILLON_PREORDER_PRODUCTS = [
  {
    id: 'beles-founder-sample',
    productSlug: 'beles',
    title: 'Beles Restock Sample',
    type: 'sample_preorder',
    price: 28,
    currency: 'EUR',
    description: 'A 2 ml discovery vial from the next ready Beles batch.',
    expectedShipWindow:
      'Next ready Beles batch - dispatch begins after batch readiness and final inspection. No fixed release date is guaranteed.',
    refundPolicySummary:
      'Refundable on request before dispatch. After delivery, the published returns policy and mandatory consumer rights apply.',
    creditPolicy:
      'The EUR 28 sample payment is credited toward one 50 ml or 100 ml Beles bottle purchased within 30 days after sample dispatch.',
    stripePriceEnvKey: 'STRIPE_PRICE_BELES_SAMPLE_PREORDER',
    enabled: true,
  },
  {
    id: 'beles-founder-bottle-deposit',
    productSlug: 'beles',
    title: 'Beles Bottle Reservation',
    type: 'bottle_deposit',
    price: 30,
    currency: 'EUR',
    description:
      'A refundable deposit securing a private purchase window for one 50 ml or 100 ml Beles bottle.',
    expectedShipWindow:
      'Private purchase timing follows the next ready Beles batch. The bottle dispatch window is confirmed before any final balance is requested.',
    refundPolicySummary:
      'The EUR 30 deposit is refundable on request before shipment. If already applied to a final bottle order, a cancellation before dispatch includes that EUR 30 amount.',
    creditPolicy:
      'The EUR 30 deposit is credited in full toward the final 50 ml or 100 ml purchase price.',
    stripePriceEnvKey: 'STRIPE_PRICE_BELES_BOTTLE_DEPOSIT',
    enabled: true,
  },
];

function getPreorderProductById(id) {
  return EILLON_PREORDER_PRODUCTS.find((product) => product.id === id) || null;
}

function getPreorderProductByType(productSlug, type) {
  return EILLON_PREORDER_PRODUCTS.find(
    (product) => product.productSlug === productSlug && product.type === type,
  ) || null;
}

const preorderCatalog = {
  PREORDER_CONSENT_VERSION: EILLON_PREORDER_CONSENT_VERSION,
  PREORDER_PRODUCTS: EILLON_PREORDER_PRODUCTS,
  getPreorderProductById,
  getPreorderProductByType,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = preorderCatalog;
}

if (typeof window !== 'undefined') {
  window.EILLON_PREORDER_CONSENT_VERSION = EILLON_PREORDER_CONSENT_VERSION;
  window.EILLON_PREORDER_PRODUCTS = EILLON_PREORDER_PRODUCTS;
  window.EILLON_GET_PREORDER_PRODUCT = getPreorderProductById;
  document.dispatchEvent(new Event('eillon:preorder-products-ready'));
}
