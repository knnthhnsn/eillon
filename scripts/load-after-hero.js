/* EILLON — defer GSAP / ScrollTrigger / home pins until hero is painted. */
(function loadAfterHero() {
  'use strict';

  if (!document.body || document.body.dataset.navHome !== 'true') return;

  var MAX_MS = 3200;
  var ENHANCEMENT_FALLBACK_MS = 20000;
  var HOME_INTERACTIONS = '/scripts/home-interactions.min.js?v=1';
  var SCRIPTS = [
    '/scripts/vendor/gsap.min.js?v=1',
    '/scripts/vendor/ScrollTrigger.min.js?v=1',
    '/scripts/home.js?v=54',
  ];
  var fired = false;
  var interactionsQueued = false;
  var enhancementsStarted = false;
  var enhancementTimer = 0;

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

  function markHouseStairsReady() {
    if (document.documentElement.classList.contains('house-stairs-ready')) return;
    document.documentElement.classList.add('house-stairs-ready');
    window.dispatchEvent(new CustomEvent('eillon:house-stairs-ready'));
  }

  function pickHouseStairsSrc() {
    var w = window.innerWidth || 1100;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var need = w * dpr;
    if (need <= 820) return '/images/white-stone-stairs-960.webp';
    if (need <= 1280) return '/images/white-stone-stairs-1100.webp';
    return '/images/white-stone-stairs-1400.webp';
  }

  function deferHouseStairs() {
    var src = pickHouseStairsSrc();
    document.documentElement.style.setProperty('--house-stairs-image', "url('" + src + "')");
    var img = new Image();
    img.decoding = 'async';
    img.src = src;
    img.onload = markHouseStairsReady;
    img.onerror = function () {
      var fallback = src.replace('.webp', '.jpg');
      document.documentElement.style.setProperty('--house-stairs-image', "url('" + fallback + "')");
      markHouseStairsReady();
    };
  }

  function loadHomeInteractions() {
    if (interactionsQueued) return;
    interactionsQueued = true;
    loadScript(HOME_INTERACTIONS);
  }

  function startEnhancements() {
    if (enhancementsStarted) return;
    enhancementsStarted = true;
    window.clearTimeout(enhancementTimer);
    window.removeEventListener('wheel', startEnhancements);
    window.removeEventListener('touchstart', startEnhancements);
    window.removeEventListener('keydown', startEnhancements);
    deferHouseStairs();
    loadChain(0);
    loadHomeInteractions();
  }

  function queueEnhancements() {
    var passiveOnce = { passive: true, once: true };
    window.addEventListener('wheel', startEnhancements, passiveOnce);
    window.addEventListener('touchstart', startEnhancements, passiveOnce);
    window.addEventListener('keydown', startEnhancements, { once: true });
    enhancementTimer = window.setTimeout(startEnhancements, ENHANCEMENT_FALLBACK_MS);
  }

  function markReady() {
    if (fired) return;
    fired = true;
    window.__EILLON_HERO_READY__ = true;
    window.dispatchEvent(new CustomEvent('eillon:hero-ready'));
    queueEnhancements();
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
