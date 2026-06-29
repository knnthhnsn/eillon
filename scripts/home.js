/* EILLON homepage — GSAP ScrollTrigger pinned sequences (house, maison). */
(function initHomeScrollPins() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var pinState = { mobile: false, triggers: [], normalizer: null };
  var ctx = null;
  var layoutRebuildTimer = null;

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function viewportHeight() {
    if (window.visualViewport && window.visualViewport.height > 0) {
      return window.visualViewport.height;
    }
    return window.innerHeight;
  }

  function enableMobileScrollNormalize() {
    if (pinState.normalizer) return pinState.normalizer;

    pinState.normalizer = ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: true,
      type: 'touch'
    });
    document.documentElement.classList.add('mv-normalize-scroll');
    return pinState.normalizer;
  }

  function disableMobileScrollNormalize() {
    ScrollTrigger.normalizeScroll(false);
    pinState.normalizer = null;
    document.documentElement.classList.remove('mv-normalize-scroll');
  }

  function houseMobilePinOptions() {
    return {
      pinType: 'transform',
      pinReparent: isIOS(),
      anticipatePin: 1,
      scrub: true,
      fastScrollEnd: true
    };
  }

  function landMobilePinOptions() {
    return {
      pinType: 'transform',
      pinReparent: isIOS(),
      anticipatePin: 0,
      scrub: true,
      fastScrollEnd: true
    };
  }

  function refreshPins() {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }

  function houseScrollDistance(mobile) {
    return Math.round(viewportHeight() * (mobile ? 1.35 : 1.9));
  }

  function landScrollDistance(mobile) {
    return Math.round(viewportHeight() * (mobile ? 2.5 : 1));
  }

  function pinScrollEnd(getDistance) {
    return function () {
      var distance = typeof getDistance === 'function' ? getDistance() : getDistance;
      return '+=' + Math.max(Math.round(distance), 1);
    };
  }

  function readPinScrollY() {
    if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.scroll === 'function') {
      return ScrollTrigger.scroll();
    }
    return window.scrollY || 0;
  }

  function writePinScrollY(y) {
    if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.scroll === 'function') {
      ScrollTrigger.scroll(y);
    } else {
      window.scrollTo(0, y);
    }
    ScrollTrigger.update();
  }

  function initHouse(mobile) {
    var house = document.querySelector('.mv-house');
    var stage = house && house.querySelector('.mv-house__stage');
    var grid = house && house.querySelector('.mv-house__grid');
    if (!house || !stage || !grid) return null;

    house.classList.add('mv-house--pin-js');

    var lines = house.querySelectorAll('.mv-house__display-line, .mv-house__display em');
    var lede = house.querySelector('.mv-house__lede');
    var laws = house.querySelectorAll('.mv-house__laws li');
    var pinTarget = mobile ? stage : house;

    function houseShift() {
      var overflow = stage.scrollHeight - viewportHeight() + 28;
      if (overflow <= 0) return 0;
      return mobile ? overflow : Math.min(overflow, 96);
    }

    function revealAll() {
      gsap.set(lines, { opacity: 1, y: 0, force3D: true });
      gsap.set(lede, { opacity: 1, y: 0, force3D: true });
      gsap.set(laws, { opacity: 1, x: 0, force3D: true });
      gsap.set(grid, { y: 0, force3D: true });
    }

    gsap.set(house, { '--house-p': 0 });
    gsap.set(grid, { y: 0, force3D: true });
    gsap.set(lines, { opacity: 0, y: mobile ? 16 : 36, force3D: true });
    gsap.set(lede, { opacity: 0, y: mobile ? 12 : 28, force3D: true });
    gsap.set(laws, { opacity: 0, x: mobile ? 12 : 28, force3D: true });

    var tl = gsap.timeline({ paused: true });

    tl.to(house, { '--house-p': 1, duration: 1, ease: 'none' }, 0);

    lines.forEach(function (line, i) {
      tl.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        ease: 'none',
        force3D: true
      }, 0.04 + i * (mobile ? 0.08 : 0.11));
    });

    if (mobile) {
      tl.to(laws, { opacity: 1, x: 0, duration: 0.12, stagger: 0.06, ease: 'none', force3D: true }, 0.28)
        .to(lede, { opacity: 1, y: 0, duration: 0.18, ease: 'none', force3D: true }, 0.46)
        .to(grid, { y: function () { return -houseShift(); }, duration: 0.28, ease: 'none', force3D: true }, 0.58);
    } else {
      tl.to(lede, { opacity: 1, y: 0, duration: 0.2, ease: 'none', force3D: true }, 0.42)
        .to(laws, { opacity: 1, x: 0, duration: 0.12, stagger: 0.08, ease: 'none', force3D: true }, 0.62)
        .to(grid, { y: function () { return -houseShift(); }, duration: 0.22, ease: 'none', force3D: true }, 0.72);
    }

    var pinConfig = {
      id: 'mv-house',
      trigger: house,
      start: 'top top',
      end: pinScrollEnd(function () { return houseScrollDistance(mobile); }),
      pin: pinTarget,
      pinSpacing: true,
      animation: tl,
      refreshPriority: 0,
      invalidateOnRefresh: true,
      onLeave: revealAll,
      onLeaveBack: function () {
        gsap.set(grid, { y: 0, force3D: true });
      }
    };

    if (mobile) {
      Object.assign(pinConfig, houseMobilePinOptions());
    } else {
      Object.assign(pinConfig, {
        pinType: 'fixed',
        pinReparent: false,
        scrub: true,
        anticipatePin: 0,
        fastScrollEnd: true
      });
    }

    return ScrollTrigger.create(pinConfig);
  }

  function initLand(mobile) {
    var land = document.querySelector('.mv-land');
    if (!land) return null;

    var sticky = land.querySelector('.mv-land__sticky');
    var title = land.querySelector('.mv-land__title.is-1');
    var laws = land.querySelector('.mv-land__laws.is-2');
    var sign = land.querySelector('.mv-land__sign.is-3');
    var mediaImg = land.querySelector('.mv-land__media img');
    if (!sticky || !title || !laws || !sign) return null;

    function revealAllLand() {
      gsap.set(title, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
      gsap.set(laws, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
      gsap.set(sign, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
      if (mediaImg) gsap.set(mediaImg, { scale: 1.08, force3D: true });
    }

    if (mobile) {
      land.classList.add('mv-land--pin-js');
      land.removeAttribute('data-phase');

      gsap.set(title, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
      gsap.set(laws, { opacity: 0, y: 18, visibility: 'hidden', force3D: true });
      gsap.set(sign, { opacity: 0, y: 18, visibility: 'hidden', force3D: true });
      if (mediaImg) gsap.set(mediaImg, { scale: 1.02, force3D: true });

      var tl = gsap.timeline({ paused: true });

      if (mediaImg) {
        tl.to(mediaImg, { scale: 1.08, duration: 1, ease: 'none', force3D: true }, 0);
      }

      tl.to(title, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0)
        .to(title, { opacity: 0, y: -14, visibility: 'hidden', duration: 0.1, ease: 'none', force3D: true }, 0.26)
        .to(laws, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0.32)
        .to(laws, { opacity: 0, y: -14, visibility: 'hidden', duration: 0.1, ease: 'none', force3D: true }, 0.58)
        .to(sign, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0.64);

      var houseSt = ScrollTrigger.getById('mv-house');
      var landStartPx = houseSt
        ? houseSt.end + viewportHeight()
        : land.offsetTop;
      var landEndPx = landStartPx + landScrollDistance(true);

      var pinConfig = {
        id: 'mv-land',
        trigger: land,
        start: landStartPx,
        end: landEndPx,
        pin: sticky,
        pinSpacing: true,
        animation: tl,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onLeave: revealAllLand,
        onLeaveBack: function () {
          gsap.set(title, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
          gsap.set(laws, { opacity: 0, y: 18, visibility: 'hidden', force3D: true });
          gsap.set(sign, { opacity: 0, y: 18, visibility: 'hidden', force3D: true });
          if (mediaImg) gsap.set(mediaImg, { scale: 1.02, force3D: true });
        }
      };

      Object.assign(pinConfig, landMobilePinOptions());
      return ScrollTrigger.create(pinConfig);
    }

    land.classList.add('mv-land--scroll-js');

    var lastPhase = -1;
    function setPhase(phase) {
      if (phase === lastPhase) return;
      lastPhase = phase;
      land.dataset.phase = String(phase);
    }

    function applyProgress(p) {
      land.style.setProperty('--p', p.toFixed(3));
      setPhase(p >= 0.62 ? 2 : (p >= 0.32 ? 1 : 0));
    }

    var st = ScrollTrigger.create({
      id: 'mv-land',
      trigger: land,
      start: 'top top',
      end: pinScrollEnd(function () { return Math.max(land.offsetHeight - viewportHeight(), 0); }),
      scrub: true,
      invalidateOnRefresh: true,
      refreshPriority: 1,
      onUpdate: function (self) {
        applyProgress(self.progress);
      }
    });

    applyProgress(st.progress);
    return st;
  }

  function runPinSetup(mobile) {
    var houseSt = initHouse(mobile);
    ScrollTrigger.refresh(true);

    var landSt = initLand(mobile);
    ScrollTrigger.refresh(true);
    refreshPins();

    return [houseSt, landSt].filter(Boolean);
  }

  function teardown(triggers) {
    triggers.forEach(function (st) {
      if (st && st.kill) st.kill(true);
    });

    document.querySelectorAll('.mv-house--pin-js').forEach(function (el) {
      el.classList.remove('mv-house--pin-js');
    });
    document.querySelectorAll('.mv-land--pin-js').forEach(function (el) {
      el.classList.remove('mv-land--pin-js');
    });
    document.querySelectorAll('.mv-land--scroll-js').forEach(function (el) {
      el.classList.remove('mv-land--scroll-js');
    });

    var land = document.querySelector('.mv-land');
    if (land) {
      land.removeAttribute('data-phase');
      land.style.removeProperty('--p');
    }

    var house = document.querySelector('.mv-house');
    if (house) {
      house.style.removeProperty('--house-p');
    }

    var grid = document.querySelector('.mv-house__grid');
    if (grid) {
      gsap.set(grid, { clearProps: 'transform' });
    }
  }

  function rebuildPins() {
    if (!pinState.triggers.length) return;

    var scrollY = readPinScrollY();
    teardown(pinState.triggers);
    pinState.triggers = runPinSetup(pinState.mobile);
    refreshPins();
    requestAnimationFrame(function () {
      writePinScrollY(scrollY);
    });
  }

  function scheduleLayoutRebuild() {
    if (layoutRebuildTimer) window.clearTimeout(layoutRebuildTimer);
    layoutRebuildTimer = window.setTimeout(rebuildPins, 150);
  }

  function startPins() {
    if (ctx) return;

    ctx = gsap.context(function () {
      var mm = gsap.matchMedia();

      mm.add('(max-width: 900px)', function () {
        pinState.mobile = true;
        enableMobileScrollNormalize();
        pinState.triggers = runPinSetup(true);
        document.documentElement.classList.add('mv-home-mobile-pins');

        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', scheduleLayoutRebuild);
          window.visualViewport.addEventListener('scroll', ScrollTrigger.update);
        }

        return function () {
          if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', scheduleLayoutRebuild);
            window.visualViewport.removeEventListener('scroll', ScrollTrigger.update);
          }
          document.documentElement.classList.remove('mv-home-mobile-pins');
          teardown(pinState.triggers);
          pinState.triggers = [];
          disableMobileScrollNormalize();
        };
      });

      mm.add('(min-width: 901px)', function () {
        pinState.mobile = false;
        disableMobileScrollNormalize();
        pinState.triggers = runPinSetup(false);
        return function () {
          teardown(pinState.triggers);
          pinState.triggers = [];
        };
      });
    });
  }

  function whenLayoutReady(fn) {
    if (document.readyState === 'complete') {
      requestAnimationFrame(fn);
    } else {
      window.addEventListener('load', function () {
        requestAnimationFrame(fn);
      }, { once: true });
    }
  }

  whenLayoutReady(startPins);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (pinState.triggers.length) {
        scheduleLayoutRebuild();
      }
    });
  }

  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', function () {
      if (reduceMq.matches && ctx) {
        ctx.revert();
        ctx = null;
        pinState.triggers = [];
        disableMobileScrollNormalize();
      }
    });
  }
})();

(function initNameMarquee() {
  'use strict';

  var track = document.querySelector('.mv-name__track');
  var loop = track && track.querySelector('.mv-name__loop');
  if (!track || !loop) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  var speed = 44;
  var ready = false;
  var lastLoopW = 0;
  var resizeTimer;

  track.appendChild(loop.cloneNode(true));

  function readLoopWidth() {
    var loops = track.querySelectorAll('.mv-name__loop');
    if (!loops.length) return 0;

    var width = loops[0].getBoundingClientRect().width;
    if (loops.length > 1) {
      var step = loops[1].getBoundingClientRect().left - loops[0].getBoundingClientRect().left;
      if (step > 0) width = step;
    }

    return Math.round(width);
  }

  function ensureLoops() {
    var loopW = readLoopWidth();
    if (!loopW) return 0;

    var loops = track.querySelectorAll('.mv-name__loop');
    while (track.scrollWidth - parseFloat(getComputedStyle(track).paddingLeft || 0) < window.innerWidth + loopW * 2) {
      track.appendChild(loops[0].cloneNode(true));
    }

    return readLoopWidth();
  }

  function applyMarquee() {
    var loopW = ensureLoops();
    if (!loopW) return;
    if (ready && Math.abs(loopW - lastLoopW) < 2) return;

    lastLoopW = loopW;
    track.style.setProperty('--marquee-shift', loopW + 'px');
    track.style.setProperty('--marquee-duration', (loopW / speed) + 's');

    if (!ready) {
      ready = true;
      track.classList.add('is-marquee-ready');
    }
  }

  function initMarquee() {
    applyMarquee();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initMarquee);
  } else {
    initMarquee();
  }

  window.addEventListener('resize', function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyMarquee, 120);
  });
})();

(function initLettersLazyLoad() {
  'use strict';

  var section = document.getElementById('letters');
  if (!section) return;

  var loaded = false;
  var cssHref = 'letters.min.css?v=23';
  var scriptQueue = ['data/letters.js?v=12', '/scripts/letters.js?v=15'];

  function loadScripts(index) {
    if (index >= scriptQueue.length) return;
    var script = document.createElement('script');
    script.src = scriptQueue[index];
    script.onload = function () { loadScripts(index + 1); };
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
