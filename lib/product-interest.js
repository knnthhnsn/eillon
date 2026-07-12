const CURRENCY = 'EUR';

const PRODUCTS = Object.freeze({
  beles: {
    label: "Beles \u00b7 Fico d'India",
    intent: 'next_restock',
    intentLabel: 'Next restock',
    formats: {
      sample: { label: '2 ml sample', price: 60 },
      50: { label: '50 ml bottle', price: 380 },
      100: { label: '100 ml bottle', price: 620 },
    },
  },
  oliva: {
    label: 'Oliva \u00b7 Olive Grove',
    intent: 'future_release',
    intentLabel: 'Future release',
    formats: {
      sample: { label: '2 ml sample', price: 60 },
      50: { label: '50 ml bottle', price: 390 },
      100: { label: '100 ml bottle', price: 640 },
    },
  },
  asmara: {
    label: 'Asmara \u00b7 Rain on Stone',
    intent: 'future_release',
    intentLabel: 'Future release',
    formats: {
      sample: { label: '2 ml sample', price: 68 },
      50: { label: '50 ml bottle', price: 430 },
      100: { label: '100 ml bottle', price: 710 },
    },
  },
  massawa: {
    label: 'Massawa \u00b7 Red Sea Citrus',
    intent: 'future_release',
    intentLabel: 'Future release',
    formats: {
      sample: { label: '2 ml sample', price: 58 },
      50: { label: '50 ml bottle', price: 370 },
      100: { label: '100 ml bottle', price: 600 },
    },
  },
  petricor: {
    label: 'Petricor \u00b7 Wet Earth',
    intent: 'future_release',
    intentLabel: 'Future release',
    formats: {
      sample: { label: '2 ml sample', price: 64 },
      50: { label: '50 ml bottle', price: 410 },
      100: { label: '100 ml bottle', price: 680 },
    },
  },
  ritual: {
    label: 'Ritual \u00b7 Frankincense & Myrrh',
    intent: 'studio_study',
    intentLabel: 'Studio study',
    formats: {
      sample: { label: '2 ml sample', price: 72 },
      50: { label: '50 ml bottle', price: 460 },
      100: { label: '100 ml bottle', price: 760 },
    },
  },
  all: {
    label: 'EILLON Letter',
    intent: 'letter',
    intentLabel: 'The Letter',
    formats: {},
  },
});

function getProductInterest(productSlug) {
  return PRODUCTS[productSlug] || PRODUCTS.beles;
}

function getInterestSelection(productSlug, size) {
  const product = getProductInterest(productSlug);
  const normalizedSize = Object.hasOwn(product.formats, size) ? String(size) : null;
  const format = normalizedSize ? product.formats[normalizedSize] : null;
  const selectionLabel = format
    ? `${product.label} \u00b7 ${format.label} \u00b7 \u20ac${format.price}`
    : product.label;

  return {
    productSlug,
    productLabel: product.label,
    signupIntent: product.intent,
    intentLabel: product.intentLabel,
    size: normalizedSize,
    formatLabel: format?.label || null,
    formatPrice: format?.price ?? null,
    currency: format ? CURRENCY : null,
    selectionLabel,
  };
}

module.exports = {
  CURRENCY,
  PRODUCTS,
  getProductInterest,
  getInterestSelection,
};
