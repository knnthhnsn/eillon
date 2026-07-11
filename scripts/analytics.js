(() => {
  'use strict';

  const RESTOCK_SOURCE_KEY = 'eillon_restock_source';
  const UTM_KEY = 'eillon_utm';
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const CHAPTER_PATHS = new Set(['beles', 'asmara', 'massawa', 'petricor', 'ritual']);

  window.EILLON_ANALYTICS_CONFIG = window.EILLON_ANALYTICS_CONFIG || { posthogBridge: false };

  const POSTHOG_BRIDGE_EVENTS = new Set([
    'scene_viewed',
    'letter_archive_viewed',
    'letter_opened',
    'letter_action_clicked',
    'archive_to_beles_click',
    'restock_anchor_reached',
    'restock_form_started',
    'restock_form_submitted',
    'size_interest_selected',
    'proof_link_clicked',
    'preorder_page_viewed',
    'preorder_offer_selected',
    'preorder_checkout_started',
    'preorder_checkout_returned_success',
    'preorder_checkout_cancelled',
    'preorder_proof_link_clicked',
  ]);

  const PII_PROPERTY_KEYS = new Set([
    'email',
    'name',
    'first_name',
    'last_name',
    'full_name',
    'phone',
    'address',
    'customer_email',
    'stripe_session_id',
    'stripe_payment_intent',
  ]);

  const isLikelyPiiValue = (value) => typeof value === 'string'
    && (/@|%40/i.test(value) || (value.match(/\d/g) || []).length >= 7);

  const sanitizeAnalyticsProps = (props = {}) => Object.fromEntries(
    Object.entries(props)
      .filter(([key]) => !PII_PROPERTY_KEYS.has(key))
      .filter(([, value]) => value === null || ['string', 'number', 'boolean'].includes(typeof value))
      .filter(([, value]) => !isLikelyPiiValue(value))
      .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 120) : value]),
  );

  const sanitizeAttribution = (value) => {
    const text = String(value || '').replace(/[\r\n\u0000-\u001f]/g, '').trim().slice(0, 120);
    if (!text || isLikelyPiiValue(text)) return '';
    return text;
  };

  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

  const getDeviceClass = () => {
    if (window.matchMedia('(max-width: 900px)').matches) return 'mobile';
    if (window.matchMedia('(max-width: 1200px)').matches) return 'tablet';
    return 'desktop';
  };

  const getChapterFromPath = (path = window.location.pathname) => {
    const slug = path.replace(/^\/+|\/+$/g, '').split('/')[0];
    return CHAPTER_PATHS.has(slug) ? slug : null;
  };

  const captureUtm = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const incoming = {};
      UTM_PARAMS.forEach((key) => {
        const value = sanitizeAttribution(params.get(key));
        if (value) incoming[key] = value;
      });
      if (Object.keys(incoming).length) {
        sessionStorage.setItem(UTM_KEY, JSON.stringify(incoming));
        return incoming;
      }
      const stored = sessionStorage.getItem(UTM_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const getUtm = () => {
    try {
      const stored = sessionStorage.getItem(UTM_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      return Object.fromEntries(
        UTM_PARAMS
          .map((key) => [key, sanitizeAttribution(parsed[key])])
          .filter(([, value]) => Boolean(value)),
      );
    } catch {
      return {};
    }
  };

  const getContext = () => ({
    page: window.location.pathname,
    chapter: getChapterFromPath(),
    referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
    device: getDeviceClass(),
    ...getUtm(),
  });

  const sanitizeBridgeProps = (props = {}) => {
    const out = sanitizeAnalyticsProps(props);
    delete out.name;
    return out;
  };

  const bridgeToPosthog = (eventName, props = {}) => {
    const cfg = window.EILLON_ANALYTICS_CONFIG || {};
    const enabled = cfg.posthogBridge === true || window.EILLON_POSTHOG_BRIDGE === true;
    if (!enabled || !POSTHOG_BRIDGE_EVENTS.has(eventName)) return;
    try {
      if (typeof window.posthog?.capture === 'function') {
        window.posthog.capture(eventName, sanitizeBridgeProps(props));
      }
    } catch {
      // PostHog unavailable — fail silently.
    }
  };

  const track = (name, props = {}) => {
    if (!name) return;
    const payload = { name, ...sanitizeAnalyticsProps({ ...getContext(), ...props }) };
    if (isLocal) {
      console.debug('[eillon analytics]', payload);
    }
    try {
      if (typeof window.va === 'function') {
        window.va('event', payload);
      }
    } catch {
      // Vercel Analytics unavailable — fail silently.
    }
    bridgeToPosthog(name, payload);
  };

  const observeProofSections = () => {
    const nodes = document.querySelectorAll('[data-analytics-section="proof"]');
    if (!nodes.length) return;
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
          if (seen.has(entry.target)) return;
          seen.add(entry.target);
          track('proof_section_viewed', {
            section: entry.target.dataset.analyticsSectionId || entry.target.id || 'proof',
          });
        });
      },
      { threshold: [0.35] },
    );
    nodes.forEach((node) => io.observe(node));
  };

  const observeWebVitals = () => {
    try {
      const sendCls = (value) => {
        track('web_vital', {
          metric: 'CLS',
          value: Math.round(value),
          page: window.location.pathname,
          device: getDeviceClass(),
        });
      };

      const sendLcp = (entry) => {
        const payload = {
          metric: 'LCP',
          value: Math.round(entry.startTime),
          page: window.location.pathname,
          device: getDeviceClass(),
        };
        if (entry.element) {
          payload.lcp_tag = entry.element.tagName?.toLowerCase?.() || undefined;
          const cls = entry.element.className;
          if (typeof cls === 'string' && cls) {
            payload.lcp_class = cls.slice(0, 120);
          }
        }
        if (entry.url) {
          try {
            const parsed = new URL(entry.url, window.location.origin);
            if (parsed.origin === window.location.origin) {
              payload.lcp_url_path = parsed.pathname;
            }
          } catch {
            // ignore malformed URLs
          }
        }
        track('web_vital', payload);
      };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) sendLcp(last);
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) sendCls(entry.value * 1000);
        });
      }).observe({ type: 'layout-shift', buffered: true });

      /* Custom proxy — not official INP (see docs/performance-stage-budget.md). */
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          track('web_vital', {
            metric: 'interaction_event_duration',
            value: Math.round(entry.duration),
            page: window.location.pathname,
            device: getDeviceClass(),
          });
        });
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch {
      // PerformanceObserver unavailable.
    }
  };

  const getRestockSource = () => {
    if (window.EILLON_RESTOCK_SOURCE) return window.EILLON_RESTOCK_SOURCE;
    try {
      return sessionStorage.getItem(RESTOCK_SOURCE_KEY) || null;
    } catch {
      return null;
    }
  };

  const observeRestockAnchor = () => {
    const target = document.getElementById('waitlist');
    if (!target || getChapterFromPath() !== 'beles') return;
    let seen = false;
    const mark = (source) => {
      if (seen) return;
      seen = true;
      track('restock_anchor_reached', {
        chapter: 'beles',
        source: source || getRestockSource() || 'scroll',
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            mark(getRestockSource() || 'scroll');
          }
        });
      },
      { threshold: [0.2] },
    );
    io.observe(target);
    if (window.location.hash === '#waitlist') {
      requestAnimationFrame(() => mark(getRestockSource() || 'direct_url'));
    }
  };

  const bindProofLinks = () => {
    document.querySelectorAll('.proof-ledger__link, .proof-layer__links a[href]').forEach((link) => {
      if (link.dataset.proofBound) return;
      link.dataset.proofBound = '1';
      link.addEventListener('click', () => {
        track('proof_link_clicked', {
          label: link.dataset.analyticsLabel || link.textContent.trim().slice(0, 80),
          href: link.getAttribute('href'),
          chapter: getChapterFromPath() || 'home',
        });
      });
    });
  };

  const bindScentAtlas = () => {
    document.querySelectorAll('.mv-atlas__panel a[href]').forEach((link) => {
      if (link.dataset.atlasBound) return;
      link.dataset.atlasBound = '1';
      link.addEventListener('click', () => {
        const name = link.querySelector('.mv-atlas__name')?.textContent?.trim();
        track('scent_atlas_clicked', { label: name, href: link.getAttribute('href') });
      });
    });
  };

  const bindObjectDetails = () => {
    document.querySelectorAll('.mv-object__detail').forEach((detail) => {
      if (detail.dataset.objectBound) return;
      detail.dataset.objectBound = '1';
      const label = detail.querySelector('h3')?.textContent?.trim();
      const focus = () => track('object_detail_focused', { label });
      detail.addEventListener('focus', focus);
      detail.addEventListener('click', focus);
    });
  };

  const bindAnswerLedger = () => {
    document.querySelectorAll('.answer-ledger__item[data-answer-id]').forEach((item) => {
      if (item.dataset.answerAnalytics) return;
      item.dataset.answerAnalytics = '1';
      const answerId = item.dataset.answerId;
      const seen = { value: false };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.35 || seen.value) return;
            seen.value = true;
            track('answer_block_viewed', {
              answer_id: answerId,
              page: window.location.pathname,
              source_anchor: `#answer-${answerId}`,
            });
          });
        },
        { threshold: [0.35] },
      );
      io.observe(item);
    });

    document.querySelectorAll('.answer-ledger__proof-link').forEach((link) => {
      if (link.dataset.answerProofBound) return;
      link.dataset.answerProofBound = '1';
      link.addEventListener('click', () => {
        const item = link.closest('[data-answer-id]');
        track('answer_proof_link_clicked', {
          answer_id: item?.dataset.answerId || undefined,
          page: window.location.pathname,
          proof_href: link.getAttribute('href') || link.dataset.answerProofHref,
        });
      });
    });
  };

  const bindLetterArchive = () => {
    const section = document.getElementById('letters');
    if (!section || section.dataset.letterAnalytics) return;
    section.dataset.letterAnalytics = '1';
    const seenArchive = { value: false };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25 || seenArchive.value) return;
          seenArchive.value = true;
          track('letter_archive_viewed', { scene: 'letters' });
        });
      },
      { threshold: [0.25] },
    );
    io.observe(section);
  };

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target.closest('[data-analytics-event]');
      if (!target) return;
      const props = {
        label: target.dataset.analyticsLabel || undefined,
        scene: target.dataset.analyticsScene || undefined,
        source: target.dataset.analyticsSource || undefined,
      };
      if (target.dataset.analyticsEvent === 'scene_nav_clicked') {
        props.scene = target.dataset.analyticsScene || target.dataset.analyticsLabel;
        props.source = target.dataset.analyticsSource || 'scene_rail';
      }
      if (target.dataset.analyticsEvent === 'answer_proof_link_clicked') {
        props.answer_id = target.closest('[data-answer-id]')?.dataset.answerId;
        props.proof_href = target.getAttribute('href') || target.dataset.answerProofHref;
        props.page = window.location.pathname;
      }
      if (target.dataset.analyticsEvent === 'answer_index_group_clicked') {
        props.group = target.dataset.analyticsLabel;
        props.page = window.location.pathname;
      }
      track(target.dataset.analyticsEvent, props);
    },
    { capture: true },
  );

  const bindAnswerIndex = () => {
    const index = document.querySelector('.answer-index[data-aeo-ledger="true"]');
    if (!index || index.dataset.indexAnalytics) return;
    index.dataset.indexAnalytics = '1';
    const seenIndex = { value: false };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2 || seenIndex.value) return;
          seenIndex.value = true;
          track('answer_index_viewed', { page: window.location.pathname });
        });
      },
      { threshold: [0.2] },
    );
    io.observe(index);
  };

  const init = () => {
    captureUtm();
    track('page_view');
    const chapter = getChapterFromPath();
    if (chapter) track('chapter_view', { chapter });
    observeProofSections();
    observeWebVitals();
    observeRestockAnchor();
    bindProofLinks();
    bindScentAtlas();
    bindObjectDetails();
    bindLetterArchive();
    bindAnswerLedger();
    bindAnswerIndex();
  };

  window.EILLON_ANALYTICS = {
    track,
    getUtm,
    getContext,
    markRestockSource(source) {
      window.EILLON_RESTOCK_SOURCE = source;
      try {
        sessionStorage.setItem(RESTOCK_SOURCE_KEY, source);
      } catch {
        // sessionStorage unavailable.
      }
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
