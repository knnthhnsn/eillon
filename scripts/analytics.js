(() => {
  'use strict';

  const RESTOCK_SOURCE_KEY = 'eillon_restock_source';
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const CHAPTER_PATHS = new Set(['beles', 'asmara', 'massawa', 'ritual']);

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
  ]);

  const PII_PROPERTY_KEYS = new Set([
    'email',
    'name',
    'first_name',
    'last_name',
    'full_name',
    'phone',
    'address',
  ]);

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
        const value = params.get(key);
        if (value) incoming[key] = value.slice(0, 120);
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
      return stored ? JSON.parse(stored) : {};
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
    const out = { ...props };
    delete out.name;
    PII_PROPERTY_KEYS.forEach((key) => {
      delete out[key];
    });
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
    const payload = { name, ...getContext(), ...props };
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
      const send = (metric, value) => {
        track('web_vital', { metric, value: Math.round(value) });
      };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) send('LCP', last.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) send('CLS', entry.value * 1000);
        });
      }).observe({ type: 'layout-shift', buffered: true });

      /* Custom proxy — not official INP (see docs/performance-stage-budget.md). */
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          send('interaction_event_duration', entry.duration);
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
      track(target.dataset.analyticsEvent, props);
    },
    { capture: true },
  );

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
