/** Shared AEO build helpers */
import { EILLON_ANSWERS, getAnswersForPage } from '../../data/answers.mjs';

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
  return `<p class="answer-ledger__proof"><span class="answer-ledger__proof-label">Proof file</span> ${items}</p>`;
}

export function renderAnswerItem(answer) {
  if (!answer?.visible) return '';
  const anchor = answerAnchor(answer.id);
  const body = answer.longAnswer
    ? `<p>${escapeHtml(answer.shortAnswer)}</p><p>${escapeHtml(answer.longAnswer)}</p>`
    : `<p>${escapeHtml(answer.shortAnswer)}</p>`;
  const source = answer.sourcePage && answer.sourcePage !== '/'
    ? `<p class="answer-ledger__source">Filed from <a href="${escapeHtml(answer.sourcePage)}${escapeHtml(answer.sourceAnchor || '')}">${escapeHtml(answer.sourcePage)}</a></p>`
    : '';

  return `
    <article class="answer-ledger__item" id="${anchor}" data-answer-id="${escapeHtml(answer.id)}" data-analytics-section="answer" data-analytics-section-id="${escapeHtml(answer.id)}">
      <h3 class="answer-ledger__question">${escapeHtml(answer.question)}</h3>
      <div class="answer-ledger__answer">${body}</div>
      ${renderProofLinks(answer.proofLinks)}
      ${source}
    </article>`;
}

export function renderAnswerLedger(answers, { title = 'House answer index', lede = 'Canonical answers filed from the studio archive—visible on this page and mirrored in schema where marked.' } = {}) {
  const items = answers.filter((a) => a.visible).map(renderAnswerItem).join('\n');
  if (!items) return '';

  return `${AEO_MARKER_START}
<section class="answer-ledger" aria-labelledby="answer-ledger-heading" data-aeo-ledger="true">
  <header class="answer-ledger__head">
    <p class="sx-eyebrow">Studio index</p>
    <h2 class="answer-ledger__title" id="answer-ledger-heading">${escapeHtml(title)}</h2>
    <p class="answer-ledger__lede">${escapeHtml(lede)}</p>
  </header>
  <div class="answer-ledger__list">
${items}
  </div>
</section>
${AEO_MARKER_END}`;
}

export { EILLON_ANSWERS, getAnswersForPage };
