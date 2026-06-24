(() => {
  'use strict';

  const UTM_KEY = 'eillon_utm';
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const CHAPTER_PATHS = new Set(['beles', 'asmara', 'massawa', 'ritual']);

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

  const track = (name, props = {}) => {
    if (!name) return;
    const payload = { name, ...getContext(), ...props };
    if (isLocal) {
      console.debug('[eillon analytics]', payload);
    }
    if (typeof window.va === 'function') {
      window.va('event', payload);
    }
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

      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => send('INP', entry.duration));
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch {
      // PerformanceObserver unavailable.
    }
  };

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target.closest('[data-analytics-event]');
      if (!target) return;
      track(target.dataset.analyticsEvent, {
        label: target.dataset.analyticsLabel || undefined,
      });
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
  };

  window.EILLON_ANALYTICS = { track, getUtm, getContext };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
