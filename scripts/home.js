/* EILLON homepage — GSAP ScrollTrigger pinned sequences (house, maison). */
(function initHomeScrollPins() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var pinState = { mobile: false, triggers: [], normalizer: null };

  function enableMobileScrollNormalize() {
    if (pinState.normalizer) return pinState.normalizer;

    pinState.normalizer = ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: false,
      type: 'touch,wheel,pointer'
    });
    document.documentElement.classList.add('mv-normalize-scroll');
    return pinState.normalizer;
  }

  function disableMobileScrollNormalize() {
    ScrollTrigger.normalizeScroll(false);
    pinState.normalizer = null;
    document.documentElement.classList.remove('mv-normalize-scroll');
  }

  function mobilePinType() {
    return pinState.normalizer ? 'fixed' : 'transform';
  }
  var ctx = null;
  var layoutRebuildTimer = null;

  function refreshPins() {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }

  function houseScrollDistance(mobile) {
    return Math.round(window.innerHeight * (mobile ? 1.25 : 1.9));
  }

  function landScrollDistance(land) {
    return Math.max(land.offsetHeight - window.innerHeight, 0);
  }

  function pinScrollEnd(getDistance) {
    return function () {
      var distance = typeof getDistance === 'function' ? getDistance() : getDistance;
      return '+=' + distance;
    };
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

    function houseShift() {
      var overflow = stage.scrollHeight - window.innerHeight + 28;
      if (overflow <= 0) return 0;
      return mobile ? overflow : Math.min(overflow, 96);
    }

    function revealAll() {
      gsap.set(lines, { opacity: 1, y: 0 });
      gsap.set(lede, { opacity: 1, y: 0 });
      gsap.set(laws, { opacity: 1, x: 0 });
      gsap.set(grid, { y: 0 });
    }

    gsap.set(house, { '--house-p': 0 });
    gsap.set(grid, { y: 0 });
    gsap.set(lines, { opacity: 0, y: mobile ? 20 : 36 });
    gsap.set(lede, { opacity: 0, y: mobile ? 16 : 28 });
    gsap.set(laws, { opacity: 0, x: mobile ? 16 : 28 });

    var houseScroll = houseScrollDistance(mobile);
    var tl = gsap.timeline({ paused: true });

    tl.to(house, { '--house-p': 1, duration: 1, ease: 'none' }, 0);

    lines.forEach(function (line, i) {
      tl.to(line, { opacity: 1, y: 0, duration: 0.14, ease: 'none' }, 0.04 + i * (mobile ? 0.08 : 0.11));
    });

    if (mobile) {
      tl.to(laws, { opacity: 1, x: 0, duration: 0.12, stagger: 0.06, ease: 'none' }, 0.28)
        .to(lede, { opacity: 1, y: 0, duration: 0.18, ease: 'none' }, 0.46)
        .to(grid, { y: function () { return -houseShift(); }, duration: 0.28, ease: 'none' }, 0.58);
    } else {
      tl.to(lede, { opacity: 1, y: 0, duration: 0.2, ease: 'none' }, 0.42)
        .to(laws, { opacity: 1, x: 0, duration: 0.12, stagger: 0.08, ease: 'none' }, 0.62)
        .to(grid, { y: function () { return -houseShift(); }, duration: 0.22, ease: 'none' }, 0.72);
    }

    return ScrollTrigger.create({
      id: 'mv-house',
      trigger: house,
      start: 'top top',
      end: pinScrollEnd(function () { return houseScrollDistance(mobile); }),
      pin: house,
      pinType: mobile ? mobilePinType() : 'fixed',
      pinSpacing: true,
      pinReparent: false,
      animation: tl,
      scrub: mobile && pinState.normalizer ? 0.35 : true,
      anticipatePin: mobile && pinState.normalizer ? 1 : 0,
      fastScrollEnd: !mobile,
      refreshPriority: 0,
      invalidateOnRefresh: true,
      onLeave: revealAll,
      onLeaveBack: function () {
        gsap.set(grid, { y: 0 });
      }
    });
  }

  function initLand(mobile) {
    var land = document.querySelector('.mv-land');
    if (!land) return null;

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

    if (mobile) {
      var sticky = land.querySelector('.mv-land__sticky');
      if (!sticky) return null;

      land.classList.add('mv-land--pin-js');

      var pinned = ScrollTrigger.create({
        id: 'mv-land',
        trigger: land,
        start: 'top top',
        end: pinScrollEnd(function () { return landScrollDistance(land); }),
        pin: sticky,
        pinType: mobilePinType(),
        pinSpacing: true,
        anticipatePin: pinState.normalizer ? 1 : 0,
        fastScrollEnd: true,
        refreshPriority: 1,
        pinReparent: false,
        scrub: pinState.normalizer ? 0.35 : true,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          applyProgress(self.progress);
        }
      });

      applyProgress(pinned.progress);
      return pinned;
    }

    land.classList.add('mv-land--scroll-js');

    var st = ScrollTrigger.create({
      id: 'mv-land',
      trigger: land,
      start: 'top top',
      end: pinScrollEnd(function () { return landScrollDistance(land); }),
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
    ScrollTrigger.refresh();

    var landSt = initLand(mobile);
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

    var scrollY = window.scrollY;

    teardown(pinState.triggers);
    ScrollTrigger.refresh();
    pinState.triggers = runPinSetup(pinState.mobile);
    refreshPins();
    requestAnimationFrame(function () {
      ScrollTrigger.scroll(scrollY);
      ScrollTrigger.update();
    });
  }

  function scheduleLayoutRebuild() {
    if (layoutRebuildTimer) window.clearTimeout(layoutRebuildTimer);
    layoutRebuildTimer = window.setTimeout(rebuildPins, 80);
  }

  function startPins() {
    if (ctx) return;

    ctx = gsap.context(function () {
      var mm = gsap.matchMedia();

      mm.add('(max-width: 900px)', function () {
        pinState.mobile = true;
        enableMobileScrollNormalize();
        pinState.triggers = runPinSetup(true);
        return function () {
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
      fn();
    } else {
      window.addEventListener('load', fn, { once: true });
    }
  }

  whenLayoutReady(startPins);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (pinState.triggers.length) scheduleLayoutRebuild();
    });
  }

  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', function () {
      if (reduceMq.matches && ctx) {
        ctx.revert();
        ctx = null;
        pinState.triggers = [];
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
