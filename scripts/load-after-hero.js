/* EILLON — defer GSAP / ScrollTrigger / home pins until hero is painted. */
(function loadAfterHero() {
  'use strict';

  if (!document.body || document.body.dataset.navHome !== 'true') return;

  var MAX_MS = 3200;
  var SCRIPTS = [
    '/scripts/vendor/gsap.min.js?v=1',
    '/scripts/vendor/ScrollTrigger.min.js?v=1',
    '/scripts/home.js?v=53',
  ];
  var fired = false;

  function loadChain(index) {
    if (index >= SCRIPTS.length) return;
    var script = document.createElement('script');
    script.src = SCRIPTS[index];
    script.defer = true;
    script.onload = function () {
      loadChain(index + 1);
    };
    script.onerror = function () {
      loadChain(index + 1);
    };
    document.body.appendChild(script);
  }

  function markReady() {
    if (fired) return;
    fired = true;
    window.__EILLON_HERO_READY__ = true;
    window.dispatchEvent(new CustomEvent('eillon:hero-ready'));
    loadChain(0);
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
})();
