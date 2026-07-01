#!/usr/bin/env node
/** Generate JSON-LD from visible answer blocks — must match on-page text. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AEO_SCHEMA_MARKER_END,
  AEO_SCHEMA_MARKER_START,
  getAnswersForPage,
} from './lib/aeo-shared.mjs';
import { EILLON_AEO_PAGE_MAP } from '../data/answers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://eillon.maison';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${ORIGIN}/#organization`,
  name: 'EILLON',
  url: `${ORIGIN}/`,
  email: 'care@eillon.maison',
  taxID: '43933485',
  identifier: { '@type': 'PropertyValue', propertyID: 'CVR', value: '43933485' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Copenhagen',
    postalCode: '1050',
    addressRegion: 'Capital Region of Denmark',
    addressCountry: 'DK',
  },
  sameAs: [
    'https://www.instagram.com/eillon',
    'https://www.pinterest.com/eillon',
  ],
  founder: {
    '@type': 'Organization',
    name: 'Eillon Hansen & Kenneth Hansen',
  },
};

function buildFaqEntity(answer, pageUrl) {
  return {
    '@type': 'Question',
    name: answer.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer.longAnswer
        ? `${answer.shortAnswer} ${answer.longAnswer}`
        : answer.shortAnswer,
      url: `${pageUrl}#answer-${answer.id}`,
    },
  };
}

function buildHowToSteps(answers) {
  return answers
    .filter((a) => a.schemaType === 'HowTo' && a.visible)
    .map((a) => ({
      '@type': 'HowToStep',
      name: a.question.replace(/\?$/, ''),
      text: a.longAnswer ? `${a.shortAnswer} ${a.longAnswer}` : a.shortAnswer,
      url: `${ORIGIN}${a.sourcePage}#answer-${a.id}`,
    }));
}

function schemaForPage(relPath, answers) {
  const pagePath = relPath === 'index.html' ? '/' : `/${relPath.replace(/\.html$/, '').replace(/\\/g, '/')}`;
  const pageUrl = `${ORIGIN}${pagePath === '/index' ? '/' : pagePath}`;
  const graph = [];

  const faqAnswers = answers.filter((a) => a.visible && a.schemaType === 'FAQPage');
  if (faqAnswers.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#aeo-faq`,
      mainEntity: faqAnswers.map((a) => buildFaqEntity(a, pageUrl)),
    });
  }

  const howToSteps = buildHowToSteps(answers);
  if (howToSteps.length && relPath === 'wear.html') {
    graph.push({
      '@type': 'HowTo',
      '@id': `${pageUrl}#aeo-howto`,
      name: 'How to wear and store EILLON parfum',
      description: 'Application, storage, and layering guidance for oil-rich EILLON parfums.',
      step: howToSteps,
    });
  }

  if (['about.html', 'index.html', 'imprint.html'].includes(relPath)) {
    graph.push({ ...ORGANIZATION });
  }

  if (!graph.length) return '';

  return `${AEO_SCHEMA_MARKER_START}
  <script type="application/ld+json" id="eillon-aeo-schema">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
  </script>
${AEO_SCHEMA_MARKER_END}`;
}


function stripLegacyFaqPage(html) {
  return stripLegacyTypeFromGraph(html, 'FAQPage');
}

function stripLegacyTypeFromGraph(html, type) {
  return html.replace(
    /<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g,
    (match, jsonText) => {
      try {
        const data = JSON.parse(jsonText);
        const graph = data['@graph'];
        if (!Array.isArray(graph)) return match;
        const filtered = graph.filter((node) => node['@type'] !== type);
        if (filtered.length === graph.length) return match;
        data['@graph'] = filtered;
        return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/^/gm, '    ')}\n  </script>`;
      } catch {
        return match;
      }
    },
  );
}

function injectSchema(relPath, html) {
  const answers = getAnswersForPage(relPath);
  const block = schemaForPage(relPath, answers);
  const region = `${AEO_SCHEMA_MARKER_START}[\\s\\S]*?${AEO_SCHEMA_MARKER_END}`;

  if (relPath === 'beles.html') {
    html = stripLegacyFaqPage(html);
  }
  if (relPath === 'wear.html') {
    html = stripLegacyTypeFromGraph(html, 'HowTo');
  }

  if (block) {
    if (new RegExp(region).test(html)) {
      html = html.replace(new RegExp(region), block.trim());
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `  ${block.trim()}\n</head>`);
    }
  } else if (new RegExp(region).test(html)) {
    html = html.replace(new RegExp(region), '');
  }

  return html;
}

let updated = 0;
for (const relPath of Object.keys(EILLON_AEO_PAGE_MAP)) {
  const filePath = join(root, relPath);
  if (!existsSync(filePath)) continue;
  const before = readFileSync(filePath, 'utf8');
  const after = injectSchema(relPath, before);
  if (after !== before) {
    writeFileSync(filePath, after);
    updated += 1;
    console.log(`✓ AEO schema → ${relPath}`);
  }
}

console.log(`AEO schema build complete (${updated} pages).`);
