/* EILLON homepage — GSAP ScrollTrigger pinned sequences (house, maison). */
(function initHomeScrollPins() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var pinState = { mobile: false, triggers: [], ctx: null };
  var refreshTimer = null;

  function viewportHeight() {
    if (window.visualViewport && window.visualViewport.height > 0) {
      return window.visualViewport.height;
    }
    return window.innerHeight;
  }

  function sectionScrollTop(el) {
    var node = el.parentElement && el.parentElement.classList.contains('pin-spacer')
      ? el.parentElement
      : el;
    return Math.round(node.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0));
  }

  function mobilePinOptions() {
    return {
      pinType: 'fixed',
      pinReparent: false,
      anticipatePin: 0,
      scrub: true,
      fastScrollEnd: true
    };
  }

  function desktopPinOptions() {
    return {
      pinType: 'fixed',
      pinReparent: false,
      anticipatePin: 0,
      scrub: true,
      fastScrollEnd: true
    };
  }

  function landScrollDistanceDesktop(land) {
    return Math.max(land.offsetHeight - viewportHeight(), 0);
  }

  function refreshPins() {
    ScrollTrigger.sort();
    ScrollTrigger.refresh(true);
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
      pin: pinTarget,
      pinSpacing: true,
      animation: tl,
      invalidateOnRefresh: true,
      onLeave: revealAll,
      onLeaveBack: function () {
        gsap.set(grid, { y: 0, force3D: true });
      }
    };

    if (mobile) {
      Object.assign(pinConfig, {
        start: 'top top',
        end: pinScrollEnd(function () { return houseScrollDistance(true); }),
        refreshPriority: 0
      }, mobilePinOptions());
    } else {
      var houseStart = sectionScrollTop(house);
      var houseScroll = houseScrollDistance(false);
      Object.assign(pinConfig, {
        start: houseStart,
        end: houseStart + houseScroll,
        refreshPriority: 0
      }, desktopPinOptions());
    }

    return ScrollTrigger.create(pinConfig);
  }

  function initLand(mobile) {
    var land = document.querySelector('.mv-land');
    var house = document.querySelector('.mv-house');
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
      if (!house || !sticky) return null;

      land.classList.add('mv-land--pin-js');
      land.removeAttribute('data-phase');

      gsap.set(title, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
      gsap.set(laws, { opacity: 0, y: 0, visibility: 'hidden', force3D: true });
      gsap.set(sign, { opacity: 0, y: 0, visibility: 'hidden', force3D: true });
      if (mediaImg) gsap.set(mediaImg, { scale: 1.02, force3D: true });

      var tl = gsap.timeline({ paused: true });

      if (mediaImg) {
        tl.to(mediaImg, { scale: 1.08, duration: 1, ease: 'none', force3D: true }, 0);
      }

      tl.to(title, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0)
        .to(title, { opacity: 0, visibility: 'hidden', duration: 0.1, ease: 'none', force3D: true }, 0.26)
        .to(laws, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0.32)
        .to(laws, { opacity: 0, visibility: 'hidden', duration: 0.1, ease: 'none', force3D: true }, 0.58)
        .to(sign, { opacity: 1, y: 0, visibility: 'visible', duration: 0.12, ease: 'none', force3D: true }, 0.64);

      var pinConfig = {
        id: 'mv-land',
        trigger: house,
        start: 'bottom top',
        end: pinScrollEnd(function () { return landScrollDistance(true); }),
        pin: sticky,
        pinSpacing: true,
        animation: tl,
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onLeave: revealAllLand,
        onLeaveBack: function () {
          gsap.set(title, { opacity: 1, y: 0, visibility: 'visible', force3D: true });
          gsap.set(laws, { opacity: 0, y: 0, visibility: 'hidden', force3D: true });
          gsap.set(sign, { opacity: 0, y: 0, visibility: 'hidden', force3D: true });
          if (mediaImg) gsap.set(mediaImg, { scale: 1.02, force3D: true });
        }
      };

      Object.assign(pinConfig, mobilePinOptions());
      return ScrollTrigger.create(pinConfig);
    }

    if (!house) return null;

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

    var landStart = sectionScrollTop(land);
    var landScroll = landScrollDistanceDesktop(land);

    var st = ScrollTrigger.create({
      id: 'mv-land',
      trigger: land,
      start: landStart,
      end: landStart + landScroll,
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

    if (mobile) {
      var landSt = initLand(mobile);
      return [houseSt, landSt].filter(Boolean);
    }

    ScrollTrigger.refresh();
    var landStDesktop = initLand(false);
    refreshPins();
    return [houseSt, landStDesktop].filter(Boolean);
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

    [].forEach.call(document.querySelectorAll('.mv-house__display-line, .mv-house__display em, .mv-house__lede, .mv-house__laws li'), function (el) {
      gsap.set(el, { clearProps: 'opacity,transform' });
    });

    [].forEach.call(document.querySelectorAll('.mv-land__title, .mv-land__laws, .mv-land__sign'), function (el) {
      gsap.set(el, { clearProps: 'opacity,transform,visibility' });
    });
  }

  function scheduleRefresh() {
    if (refreshTimer) window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(rebuildPins, 80);
  }

  function rebuildPins() {
    if (!pinState.triggers.length) return;

    var scrollY = window.scrollY || 0;
    var mobile = pinState.mobile;
    teardown(pinState.triggers);
    ScrollTrigger.refresh();
    pinState.triggers = runPinSetup(mobile);
    window.scrollTo(0, scrollY);
    ScrollTrigger.update();
  }

  function bootMobilePins() {
    pinState.mobile = true;
    document.documentElement.classList.add('mv-home-mobile-pins');
    pinState.triggers = runPinSetup(true);
    refreshPins();
  }

  function bootDesktopPins() {
    pinState.mobile = false;
    pinState.triggers = runPinSetup(false);
  }

  function startPins() {
    if (pinState.ctx) return;

    pinState.ctx = gsap.context(function () {
      var mm = gsap.matchMedia();

      mm.add('(max-width: 900px)', function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            requestAnimationFrame(bootMobilePins);
          });
        });

        window.addEventListener('resize', scheduleRefresh);
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', scheduleRefresh);
        }

        return function () {
          window.removeEventListener('resize', scheduleRefresh);
          if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', scheduleRefresh);
          }
          document.documentElement.classList.remove('mv-home-mobile-pins');
          teardown(pinState.triggers);
          pinState.triggers = [];
          pinState.mobile = false;
        };
      });

      mm.add('(min-width: 901px)', function () {
        bootDesktopPins();

        window.addEventListener('resize', scheduleRefresh);

        return function () {
          window.removeEventListener('resize', scheduleRefresh);
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
        scheduleRefresh();
      }
    });
  }

  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', function () {
      if (reduceMq.matches && pinState.ctx) {
        pinState.ctx.revert();
        pinState.ctx = null;
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
