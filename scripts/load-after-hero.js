/* EILLON — defer GSAP / ScrollTrigger / home pins until hero is painted. */
(function loadAfterHero() {
  'use strict';

  if (!document.body || document.body.dataset.navHome !== 'true') return;

  var MAX_MS = 3200;
  var HOME_INTERACTIONS = '/scripts/home-interactions.min.js?v=1';
  var SCRIPTS = [
    '/scripts/vendor/gsap.min.js?v=1',
    '/scripts/vendor/ScrollTrigger.min.js?v=1',
    '/scripts/home.js?v=53',
  ];
  var fired = false;
  var interactionsQueued = false;

  function loadScript(src, onload) {
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = onload || function () {};
    script.onerror = onload || function () {};
    document.body.appendChild(script);
  }

  function loadChain(index) {
    if (index >= SCRIPTS.length) return;
    loadScript(SCRIPTS[index], function () {
      loadChain(index + 1);
    });
  }

  function deferHouseStairs() {
    var img = new Image();
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = 'images/white-stone-stairs.png';
    img.onload = function () {
      document.documentElement.style.setProperty(
        '--house-stairs-bg',
        'url("images/white-stone-stairs.png")',
      );
      document.documentElement.classList.add('house-stairs-ready');
    };
    img.onerror = function () {
      document.documentElement.classList.add('house-stairs-ready');
    };
  }

  function loadHomeInteractions() {
    if (interactionsQueued) return;
    interactionsQueued = true;
    loadScript(HOME_INTERACTIONS);
  }

  function markReady() {
    if (fired) return;
    fired = true;
    window.__EILLON_HERO_READY__ = true;
    window.dispatchEvent(new CustomEvent('eillon:hero-ready'));
    deferHouseStairs();
    loadChain(0);
    loadHomeInteractions();
  }

  function watchHero() {
    var img = document.querySelector('.mv-hero__img');
    if (!img) {
      markReady();
      return;
    }
    function done() {
      if (img.decode) {
        img.decode().then(markReady).catch(markReady);
      } else {
        markReady();
      }
    }
    if (img.complete && img.naturalWidth) {
      done();
      return;
    }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', markReady, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchHero, { once: true });
  } else {
    watchHero();
  }

  setTimeout(markReady, MAX_MS);

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadHomeInteractions, { timeout: 3800 });
  } else {
    setTimeout(loadHomeInteractions, 3800);
  }
})();
