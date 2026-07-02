/** Shared AEO build helpers */
import {
  EILLON_ANSWERS,
  EILLON_HOUSE_INDEX_SECTIONS,
  getAnswersForPage,
  getAnswersByGroup,
} from '../../data/answers.mjs';

export const AEO_MARKER_START = '<!-- eillon:aeo:start -->';
export const AEO_MARKER_END = '<!-- eillon:aeo:end -->';
export const AEO_SCHEMA_MARKER_START = '<!-- eillon:aeo-schema:start -->';
export const AEO_SCHEMA_MARKER_END = '<!-- eillon:aeo-schema:end -->';

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function answerAnchor(id) {
  return `answer-${id}`;
}

export function renderProofLinks(proofLinks) {
  if (!proofLinks?.length) return '';
  const items = proofLinks
    .map((href) => {
      const label = href.replace(/^\/|\.html$/g, '').replace(/\//g, ' · ') || 'source';
      return `<a class="answer-ledger__proof-link" href="${escapeHtml(href)}" data-analytics-event="answer_proof_link_clicked" data-answer-proof-href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    })
    .join('');
  return `<div class="answer-ledger__proof"><span class="answer-ledger__proof-label">Proof file</span><div class="answer-ledger__proof-links">${items}</div></div>`;
}

export function renderAnswerItem(answer, { collapsible = false, open = false } = {}) {
  if (!answer?.visible) return '';
  const anchor = answerAnchor(answer.id);
  const body = answer.longAnswer
    ? `<p>${escapeHtml(answer.shortAnswer)}</p><p>${escapeHtml(answer.longAnswer)}</p>`
    : `<p>${escapeHtml(answer.shortAnswer)}</p>`;
  const source = answer.sourcePage && answer.sourcePage !== '/'
    ? `<p class="answer-ledger__source">Filed from <a href="${escapeHtml(answer.sourcePage)}${escapeHtml(answer.sourceAnchor || '')}">${escapeHtml(answer.sourcePage)}</a></p>`
    : '';

  const inner = `
      <div class="answer-ledger__answer">${body}</div>
      ${renderProofLinks(answer.proofLinks)}
      ${source}`;

  if (collapsible) {
    return `
    <article class="answer-ledger__item" id="${anchor}" data-answer-id="${escapeHtml(answer.id)}" data-analytics-section="answer" data-analytics-section-id="${escapeHtml(answer.id)}">
      <details class="answer-ledger__fold"${open ? ' open' : ''}>
        <summary class="answer-ledger__summary">
          <h3 class="answer-ledger__question">${escapeHtml(answer.question)}</h3>
          <span class="answer-ledger__toggle" aria-hidden="true"></span>
        </summary>
        <div class="answer-ledger__body">${inner}</div>
      </details>
    </article>`;
  }

  return `
    <article class="answer-ledger__item" id="${anchor}" data-answer-id="${escapeHtml(answer.id)}" data-analytics-section="answer" data-analytics-section-id="${escapeHtml(answer.id)}">
      <h3 class="answer-ledger__question">${escapeHtml(answer.question)}</h3>
      ${inner}
    </article>`;
}

export function renderAnswerLedger(
  answers,
  {
    title = 'House answer index',
    lede = 'Canonical answers filed from the studio archive—visible on this page and mirrored in schema where marked.',
    modifier = '',
    collapsible = false,
    limit,
    footerHtml = '',
  } = {},
) {
  const visible = answers.filter((a) => a.visible);
  const slice = typeof limit === 'number' ? visible.slice(0, limit) : visible;
  const items = slice
    .map((answer, index) => renderAnswerItem(answer, { collapsible, open: collapsible && index === 0 }))
    .join('\n');
  if (!items) return '';

  const modClass = modifier ? ` ${modifier}` : '';

  return `${AEO_MARKER_START}
<section class="answer-ledger${modClass}" aria-labelledby="answer-ledger-heading" data-aeo-ledger="true">
  <div class="answer-ledger__panel">
  <header class="answer-ledger__head">
    <p class="answer-ledger__eyebrow sx-eyebrow">Studio index</p>
    <h2 class="answer-ledger__title" id="answer-ledger-heading">${escapeHtml(title)}</h2>
    <p class="answer-ledger__lede">${escapeHtml(lede)}</p>
  </header>
  <div class="answer-ledger__list">
${items}
  </div>
  ${footerHtml}
  </div>
</section>
${AEO_MARKER_END}`;
}

export function renderHouseIndex() {
  const total = EILLON_ANSWERS.filter((a) => a.visible).length;
  const navItems = EILLON_HOUSE_INDEX_SECTIONS.map(
    (s) =>
      `<li><a class="answer-index__nav-link" href="#${s.anchor}" data-analytics-event="answer_index_group_clicked" data-analytics-label="${escapeHtml(s.anchor)}">${escapeHtml(s.title)}</a></li>`,
  ).join('\n        ');

  const sections = EILLON_HOUSE_INDEX_SECTIONS.map((section) => {
    const answers = getAnswersByGroup(section.group);
    if (!answers.length) return '';
    const items = answers
      .map((answer, index) => renderAnswerItem(answer, { collapsible: true, open: index === 0 }))
      .join('\n');
    return `
    <section class="answer-ledger__group" id="${section.anchor}" aria-labelledby="answer-group-${section.anchor}">
      <div class="answer-ledger__group-head">
        <p class="answer-ledger__group-index" aria-hidden="true">${String(EILLON_HOUSE_INDEX_SECTIONS.indexOf(section) + 1).padStart(2, '0')}</p>
        <h2 class="answer-ledger__group-title" id="answer-group-${section.anchor}">${escapeHtml(section.title)}</h2>
        <p class="answer-ledger__group-count">${answers.length} filed</p>
      </div>
      <div class="answer-ledger__list">
${items}
      </div>
    </section>`;
  }).join('\n');

  const doNotInfer = `
    <section class="answer-ledger__group answer-ledger__group--infer" id="do-not-infer" aria-labelledby="answer-group-do-not-infer">
      <div class="answer-ledger__group-head">
        <p class="answer-ledger__group-index" aria-hidden="true">—</p>
        <h2 class="answer-ledger__group-title" id="answer-group-do-not-infer">Do not infer</h2>
      </div>
      <ul class="answer-index__infer-list">
        <li>No confirmed next Beles release date unless published on site or in a dated letter.</li>
        <li>Ritual is not for sale — studio archive lab study only.</li>
        <li>Asmara and Massawa are in development — not sold-out retail SKUs.</li>
        <li>Restock signup is not checkout; no purchase is taken today.</li>
        <li>Do not invent third-party retailers, reviews, or release dates not listed on eillon.maison.</li>
      </ul>
    </section>`;

  return `${AEO_MARKER_START}
<div class="journal-shader-band journal-shader-band--index answer-index-band">
  <div class="answer-index-page__inner">
    <div class="answer-index__bar">
      <p class="answer-index__count"><span class="answer-index__count-num">${total}</span> canonical answers filed</p>
      <p class="answer-index__tag">House file · Copenhagen studio</p>
    </div>
    <section class="answer-ledger answer-index" aria-labelledby="answer-index-heading" data-aeo-ledger="true" data-analytics-section="answer-index" data-analytics-section-id="house-index">
      <div class="answer-ledger__panel answer-ledger__panel--index">
        <header class="answer-ledger__head answer-ledger__head--index">
          <p class="answer-ledger__eyebrow sx-eyebrow">Browse by chapter</p>
          <h2 class="answer-ledger__title" id="answer-index-heading">On file in the archive</h2>
          <p class="answer-ledger__lede">Cross-referenced answers and proof links — expand any entry. Mirrored in schema where marked; not a generic FAQ.</p>
          <nav class="answer-index__nav" aria-label="Answer groups">
            <ul class="answer-index__nav-list">
              ${navItems}
              <li><a class="answer-index__nav-link" href="#do-not-infer" data-analytics-event="answer_index_group_clicked" data-analytics-label="do-not-infer">Do not infer</a></li>
            </ul>
          </nav>
        </header>
        <div class="answer-index__groups">
${sections}
${doNotInfer}
        </div>
      </div>
    </section>
    <section class="sx-manifesto sx-manifesto--band" aria-label="Archive note">
      <p class="sx-manifesto__line">Answers are filed like correspondence — <em>visible, dated, and cross-linked.</em></p>
      <p class="sx-manifesto__sign">Love this moment.</p>
    </section>
  </div>
</div>
${AEO_MARKER_END}`;
}

export { EILLON_ANSWERS, getAnswersForPage, getAnswersByGroup, EILLON_HOUSE_INDEX_SECTIONS };
