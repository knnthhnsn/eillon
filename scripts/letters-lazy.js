/* EILLON — lazy-load letters bundle near #letters (independent of GSAP pins). */
(function initLettersLazyLoad() {
  'use strict';

  var section = document.getElementById('letters');
  if (!section) return;

  var loaded = false;
  var cssHref = 'letters.min.css?v=26';
  var scriptQueue = ['data/letters.js?v=15', '/scripts/letters.js?v=20'];

  function loadScripts(index) {
    if (index >= scriptQueue.length) return;
    var script = document.createElement('script');
    script.src = scriptQueue[index];
    script.onload = function () { loadScripts(index + 1); };
    script.onerror = function () {
      if (typeof console !== 'undefined') {
        console.warn('[eillon letters] failed to load', scriptQueue[index]);
      }
      loadScripts(index + 1);
    };
    document.body.appendChild(script);
  }

  function loadLettersBundle() {
    if (loaded) return;
    loaded = true;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);

    loadScripts(0);
  }

  if (location.hash === '#letters') {
    loadLettersBundle();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadLettersBundle, { timeout: 5000 });
    } else {
      window.addEventListener('load', function () {
        setTimeout(loadLettersBundle, 1200);
      }, { once: true });
    }
    return;
  }

  var done = false;
  var observer;

  function run() {
    if (done) return;
    done = true;
    if (observer) observer.disconnect();
    loadLettersBundle();
  }

  observer = new IntersectionObserver(function (entries) {
    if (entries.some(function (entry) { return entry.isIntersecting; })) run();
  }, { rootMargin: '560px 0px' });

  observer.observe(section);

  window.addEventListener('load', function () {
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight + 560) run();
  }, { once: true });
})();
