/** EILLON canonical answers — source of truth for AEO blocks, schema, and llms files. */

export const EILLON_ANSWERS_VERSION = '1.0.0';
export const EILLON_ANSWERS_LAST_REVIEWED = '2026-06-23';

/** @typedef {'FAQPage'|'QAPage'|'HowTo'|'Product'|'Organization'|'Article'|'none'} SchemaType */

/**
 * @type {Array<{
 *   id: string;
 *   group: string;
 *   question: string;
 *   shortAnswer: string;
 *   longAnswer?: string;
 *   sourcePage: string;
 *   sourceAnchor: string;
 *   schemaType: SchemaType;
 *   proofLinks: string[];
 *   lastReviewed: string;
 *   visible: boolean;
 * }>}
 */
export const EILLON_ANSWERS = [
  // —— brand ——
  {
    id: 'what-is-eillon',
    group: 'brand',
    question: 'What is EILLON?',
    shortAnswer:
      'EILLON is an independent perfume maison in Copenhagen composing oil-rich parfums from Afro-Mediterranean memory — place, skin, and slow studio craft.',
    longAnswer:
      'EILLON is a niche fragrance house—not a mass-market label. Chapters are filed like correspondence: composed in Copenhagen, documented in the archive, and released in deliberate windows rather than constant retail rotation.',
    sourcePage: '/about',
    sourceAnchor: '#answer-what-is-eillon',
    schemaType: 'Organization',
    proofLinks: ['/about', '/craftsmanship'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'where-is-eillon-based',
    group: 'brand',
    question: 'Where is EILLON based?',
    shortAnswer: 'EILLON is based in Copenhagen, Denmark (1050), with a private studio open by appointment Thursday–Saturday.',
    sourcePage: '/imprint',
    sourceAnchor: '#answer-where-is-eillon-based',
    schemaType: 'Organization',
    proofLinks: ['/imprint', '/'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'afro-mediterranean-meaning',
    group: 'brand',
    question: 'What does Afro-Mediterranean memory perfumery mean?',
    shortAnswer:
      'It describes EILLON\'s lens: Red Sea and Horn of Africa memory meeting Mediterranean stone, fruit, and skin—composed as oil-rich parfum, not diluted eau de parfum.',
    sourcePage: '/about',
    sourceAnchor: '#answer-afro-mediterranean-meaning',
    schemaType: 'none',
    proofLinks: ['/about', '/'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'who-composes-eillon',
    group: 'brand',
    question: 'Who composes EILLON fragrances?',
    shortAnswer:
      'EILLON fragrances are composed and hand-finished in the Copenhagen studio by the founding team—formula, creative direction, and maison identity documented on the craftsmanship page.',
    sourcePage: '/craftsmanship',
    sourceAnchor: '#answer-who-composes-eillon',
    schemaType: 'none',
    proofLinks: ['/craftsmanship#authorship', '/about'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'copenhagen-studio',
    group: 'brand',
    question: 'What is the Copenhagen studio?',
    shortAnswer:
      'The EILLON studio at 1050 Copenhagen is where formulas are compounded, bottles are hand-finished, and private fragrance appointments are held by request.',
    sourcePage: '/about',
    sourceAnchor: '#answer-copenhagen-studio',
    schemaType: 'Organization',
    proofLinks: ['/about', '/imprint'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  // —— beles ——
  {
    id: 'what-is-beles',
    group: 'beles',
    question: 'What is Beles · Fico d\'India?',
    shortAnswer:
      'Beles · Fico d\'India is EILLON Chapter I—an oil-rich parfum centred on sun-warmed prickly pear, cactus water, hibiscus, and mineral desert air.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-what-is-beles',
    schemaType: 'Product',
    proofLinks: ['/beles', '/journal/fico-d-india'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'what-does-beles-smell-like',
    group: 'beles',
    question: 'What does Beles smell like?',
    shortAnswer:
      'Beles reads airy and watery at first—prickly pear and pear skin—then hibiscus and green leaves over soft musk, mineral air, and warm stone.',
    longAnswer:
      'The accord is built to feel sun-warmed and close to skin: not loud projection, but a green-pink fruit veil that unfolds slowly on pulse points.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-what-does-beles-smell-like',
    schemaType: 'FAQPage',
    proofLinks: ['/beles', '/journal/what-does-fico-d-india-smell-like'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'what-is-fico-d-india',
    group: 'beles',
    question: 'What is Fico d\'India?',
    shortAnswer:
      'Fico d\'India is Italian for prickly pear—the sun-warmed fruit named on the Beles bottle and at the heart of the chapter\'s accord.',
    sourcePage: '/journal/fico-d-india',
    sourceAnchor: '#answer-what-is-fico-d-india',
    schemaType: 'FAQPage',
    proofLinks: ['/journal/fico-d-india', '/beles'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'is-beles-available',
    group: 'beles',
    question: 'Is Beles available to buy?',
    shortAnswer:
      'Beles is awaiting its next release. There is no checkout today—join the restock list to record size interest and receive one private note when bottles return.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-is-beles-available',
    schemaType: 'FAQPage',
    proofLinks: ['/beles#waitlist', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'beles-restock-list',
    group: 'beles',
    question: 'How does the Beles restock list work?',
    shortAnswer:
      'Leave your email and size interest on the Beles page. We send one restock letter when the next batch is ready—no charge today, unsubscribe anytime.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-beles-restock-list',
    schemaType: 'FAQPage',
    proofLinks: ['/beles#waitlist', '/shipping'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'beles-sizes-prices',
    group: 'beles',
    question: 'What sizes and prices are shown for Beles?',
    shortAnswer:
      'The boutique displays 2 ml sample (€28), 50 ml (€170), and 100 ml (€240) as size-interest references—availability follows the next release window.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-beles-sizes-prices',
    schemaType: 'FAQPage',
    proofLinks: ['/beles', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'beles-sample',
    group: 'beles',
    question: 'Is there a Beles sample?',
    shortAnswer:
      'A 2 ml discovery vial is listed for size interest. Samples ship when Beles returns—not as a separate always-on SKU.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-beles-sample',
    schemaType: 'FAQPage',
    proofLinks: ['/beles'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'where-is-beles-made',
    group: 'beles',
    question: 'Where is Beles made?',
    shortAnswer: 'Beles is composed and hand-finished in Copenhagen, Denmark, by EILLON studio.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-where-is-beles-made',
    schemaType: 'FAQPage',
    proofLinks: ['/beles', '/craftsmanship'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'oil-rich-parfum-meaning',
    group: 'beles',
    question: 'What does oil-rich parfum mean?',
    shortAnswer:
      'Oil-rich parfum means a high concentration of fragrance oils in a skin-close base—designed to wear slowly and intimately, not as a loud alcohol-forward spray.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-oil-rich-parfum-meaning',
    schemaType: 'FAQPage',
    proofLinks: ['/beles', '/wear'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'how-long-beles-wears',
    group: 'beles',
    question: 'How long does Beles wear?',
    shortAnswer:
      'Beles is composed for moderate-to-long wear on skin—often six to ten hours depending on pulse point, climate, and layering; heart notes deepen rather than shouting.',
    sourcePage: '/wear',
    sourceAnchor: '#answer-how-long-beles-wears',
    schemaType: 'FAQPage',
    proofLinks: ['/wear', '/craftsmanship#wear-testing'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  // —— chapters ——
  {
    id: 'what-is-asmara',
    group: 'chapters',
    question: 'What is Asmara?',
    shortAnswer:
      'Asmara · Rain on Stone is EILLON Chapter II—a mineral rain and espresso accord still in development. Follow studio notes; it is not sold today.',
    sourcePage: '/asmara',
    sourceAnchor: '#answer-what-is-asmara',
    schemaType: 'FAQPage',
    proofLinks: ['/asmara', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'what-is-massawa',
    group: 'chapters',
    question: 'What is Massawa?',
    shortAnswer:
      'Massawa · Red Sea Citrus is Chapter III—solar coastal citrus and salt-warmed skin—in development. Follow studio notes; it is not sold today.',
    sourcePage: '/massawa',
    sourceAnchor: '#answer-what-is-massawa',
    schemaType: 'FAQPage',
    proofLinks: ['/massawa', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'what-is-ritual',
    group: 'chapters',
    question: 'What is Ritual?',
    shortAnswer:
      'Ritual is a studio archive lab study in frankincense, myrrh, and sacred smoke—not offered for sale. Follow for notes only.',
    sourcePage: '/ritual',
    sourceAnchor: '#answer-what-is-ritual',
    schemaType: 'FAQPage',
    proofLinks: ['/ritual', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'which-chapters-in-development',
    group: 'chapters',
    question: 'Which EILLON chapters are in development?',
    shortAnswer: 'Asmara (Chapter II) and Massawa (Chapter III) are in development—studio notes only, not available to purchase.',
    sourcePage: '/store',
    sourceAnchor: '#answer-which-chapters-in-development',
    schemaType: 'FAQPage',
    proofLinks: ['/store', '/asmara', '/massawa'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'which-chapter-studio-archive',
    group: 'chapters',
    question: 'Which EILLON chapter is a studio archive?',
    shortAnswer: 'Ritual is filed as a studio archive lab study—not for sale and without a purchase offer.',
    sourcePage: '/ritual',
    sourceAnchor: '#answer-which-chapter-studio-archive',
    schemaType: 'FAQPage',
    proofLinks: ['/ritual', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  // —— proof ——
  {
    id: 'what-is-bl001',
    group: 'proof',
    question: 'What is BL-001?',
    shortAnswer:
      'BL-001 is the Beles pilot batch file—twenty-four 100 ml pilot flacons at a locked formula, documented in the archive as traceable house proof.',
    sourcePage: '/journal/beles-batch-bl001',
    sourceAnchor: '#answer-what-is-bl001',
    schemaType: 'Article',
    proofLinks: ['/journal/beles-batch-bl001', '/beles#proof'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'beles-proof',
    group: 'proof',
    question: 'What proof exists for Beles?',
    shortAnswer:
      'Beles proof includes batch BL-001 filing, IFRA assessment notes, wear-testing records, and craftsmanship documentation linked from the Beles proof ledger.',
    sourcePage: '/beles',
    sourceAnchor: '#answer-beles-proof',
    schemaType: 'FAQPage',
    proofLinks: ['/beles#proof', '/journal/beles-batch-bl001', '/craftsmanship'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'beles-ifra',
    group: 'proof',
    question: 'Is Beles IFRA assessed?',
    shortAnswer:
      'Beles formulas are assessed against IFRA standards; safety and batch traceability notes are published on the craftsmanship page.',
    sourcePage: '/craftsmanship',
    sourceAnchor: '#answer-beles-ifra',
    schemaType: 'FAQPage',
    proofLinks: ['/craftsmanship#safety', '/beles#proof'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'is-eillon-vegan',
    group: 'proof',
    question: 'Is EILLON vegan?',
    shortAnswer:
      'EILLON formulas are composed without animal-derived ingredients; full ingredient disclosures ship with each bottle at release.',
    sourcePage: '/craftsmanship',
    sourceAnchor: '#answer-is-eillon-vegan',
    schemaType: 'FAQPage',
    proofLinks: ['/craftsmanship#safety'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'traceability',
    group: 'proof',
    question: 'How does EILLON handle traceability?',
    shortAnswer:
      'Each chapter is filed with batch codes, compounding dates, and archive correspondence—BL-001 is the published Beles pilot traceability record.',
    sourcePage: '/craftsmanship',
    sourceAnchor: '#answer-traceability',
    schemaType: 'FAQPage',
    proofLinks: ['/craftsmanship', '/journal/beles-batch-bl001'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'wear-tested',
    group: 'proof',
    question: 'How was wear tested?',
    shortAnswer:
      'Wear testing is documented on skin and fabric under studio conditions—pulse-point application, hours-long observation, and note on how the accord opens and dries down.',
    sourcePage: '/craftsmanship',
    sourceAnchor: '#answer-wear-tested',
    schemaType: 'FAQPage',
    proofLinks: ['/craftsmanship#wear-testing', '/wear'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  // —— wear ——
  {
    id: 'how-to-apply-oil-rich',
    group: 'wear',
    question: 'How do you apply oil-rich parfum?',
    shortAnswer:
      'Apply once to a pulse point—wrist or collarbone—and let the accord open without rubbing; a light mist on cloth carries a closer trail.',
    sourcePage: '/wear',
    sourceAnchor: '#answer-how-to-apply-oil-rich',
    schemaType: 'HowTo',
    proofLinks: ['/wear'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'how-to-store',
    group: 'wear',
    question: 'How should EILLON parfum be stored?',
    shortAnswer:
      'Store upright, away from direct sun and heat swings; keep the cap sealed between wears to protect the oil-rich base.',
    sourcePage: '/wear',
    sourceAnchor: '#answer-how-to-store',
    schemaType: 'HowTo',
    proofLinks: ['/wear'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'can-chapters-be-layered',
    group: 'wear',
    question: 'Can EILLON chapters be layered?',
    shortAnswer:
      'Chapters can be layered lightly—apply the lighter fruit or citrus accord first, then a resin or amber study; avoid rubbing layers together.',
    sourcePage: '/wear',
    sourceAnchor: '#answer-can-chapters-be-layered',
    schemaType: 'FAQPage',
    proofLinks: ['/wear'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
  {
    id: 'chapter-mood-season',
    group: 'wear',
    question: 'Which chapter fits which mood or season?',
    shortAnswer:
      'Beles suits warm skin and daylight fruit; Asmara reads rain and stone; Massawa carries coastal sun; Ritual is evening resin—see the wear guide for pairing notes.',
    sourcePage: '/wear',
    sourceAnchor: '#answer-chapter-mood-season',
    schemaType: 'FAQPage',
    proofLinks: ['/wear', '/store'],
    lastReviewed: EILLON_ANSWERS_LAST_REVIEWED,
    visible: true,
  },
];

export const EILLON_AEO_PAGE_MAP = {
  'index.html': [
    'what-is-eillon',
    'where-is-eillon-based',
    'afro-mediterranean-meaning',
    'copenhagen-studio',
  ],
  'store.html': [
    'what-is-eillon',
    'which-chapters-in-development',
    'which-chapter-studio-archive',
    'is-beles-available',
  ],
  'beles.html': [
    'what-is-beles',
    'what-does-beles-smell-like',
    'what-is-fico-d-india',
    'is-beles-available',
    'beles-restock-list',
    'beles-sizes-prices',
    'beles-sample',
    'where-is-beles-made',
    'oil-rich-parfum-meaning',
    'beles-proof',
  ],
  'asmara.html': ['what-is-asmara', 'which-chapters-in-development'],
  'massawa.html': ['what-is-massawa', 'which-chapters-in-development'],
  'ritual.html': ['what-is-ritual', 'which-chapter-studio-archive'],
  'journal.html': ['what-is-eillon', 'what-is-beles'],
  'journal/beles-batch-bl001.html': ['what-is-bl001', 'traceability', 'beles-proof'],
  'journal/fico-d-india.html': ['what-is-fico-d-india', 'what-is-beles'],
  'journal/what-does-fico-d-india-smell-like.html': ['what-does-beles-smell-like', 'what-is-fico-d-india'],
  'journal/the-bottle.html': ['what-is-beles', 'oil-rich-parfum-meaning'],
  'wear.html': [
    'how-to-apply-oil-rich',
    'how-to-store',
    'can-chapters-be-layered',
    'chapter-mood-season',
    'how-long-beles-wears',
  ],
  'about.html': [
    'what-is-eillon',
    'afro-mediterranean-meaning',
    'copenhagen-studio',
    'who-composes-eillon',
  ],
  'craftsmanship.html': [
    'who-composes-eillon',
    'beles-ifra',
    'is-eillon-vegan',
    'traceability',
    'wear-tested',
    'beles-proof',
  ],
  'shipping.html': ['beles-restock-list', 'is-beles-available'],
};

export function getAnswerById(id) {
  return EILLON_ANSWERS.find((a) => a.id === id);
}

export function getAnswersForPage(relPath) {
  const ids = EILLON_AEO_PAGE_MAP[relPath] || [];
  return ids.map((id) => getAnswerById(id)).filter(Boolean);
}
