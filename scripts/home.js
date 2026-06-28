/* EILLON homepage — GSAP ScrollTrigger pinned sequences (house, maison). */
(function initHomeScrollPins() {
  'use strict';

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var started = false;

  function boot() {
    if (started) return true;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return false;
    if (reduceMq.matches) {
      started = true;
      return true;
    }
    started = true;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var pinState = { mobile: false, triggers: [] };
  var ctx = null;
  var layoutRebuildTimer = null;

  function refreshPins() {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }

  function sectionScrollTop(el) {
    return function () {
      var node = el.parentElement && el.parentElement.classList.contains('pin-spacer')
        ? el.parentElement
        : el;
      return Math.round(node.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop));
    };
  }

  function houseScrollDistance(mobile) {
    return Math.round(window.innerHeight * (mobile ? 1.25 : 1.9));
  }

  function landScrollDistance(land) {
    return Math.max(land.offsetHeight - window.innerHeight, 0);
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

    var houseStart = sectionScrollTop(house)();

    return ScrollTrigger.create({
      id: 'mv-house',
      trigger: house,
      start: houseStart,
      end: houseStart + houseScroll,
      pin: house,
      pinType: mobile ? 'transform' : 'fixed',
      pinSpacing: true,
      pinReparent: false,
      animation: tl,
      scrub: true,
      anticipatePin: 0,
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

    var landStart = sectionScrollTop(land)();
    var landScroll = landScrollDistance(land);

    if (mobile) {
      var sticky = land.querySelector('.mv-land__sticky');
      if (!sticky) return null;

      land.classList.add('mv-land--pin-js');

      var pinned = ScrollTrigger.create({
        id: 'mv-land',
        trigger: land,
        start: landStart,
        end: landStart + landScroll,
        pin: sticky,
        pinType: 'transform',
        pinSpacing: true,
        anticipatePin: 0,
        fastScrollEnd: true,
        refreshPriority: 1,
        pinReparent: false,
        scrub: true,
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
    var mobile = pinState.mobile;

    teardown(pinState.triggers);
    ScrollTrigger.refresh();
    pinState.triggers = runPinSetup(mobile);
    refreshPins();
    window.scrollTo(0, scrollY);
    ScrollTrigger.update();
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
        pinState.triggers = runPinSetup(true);
        return function () {
          teardown(pinState.triggers);
          pinState.triggers = [];
        };
      });

      mm.add('(min-width: 901px)', function () {
        pinState.mobile = false;
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

    return true;
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  function loadGsapBundle() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      return Promise.resolve();
    }
    return loadScript('/scripts/vendor/gsap.min.js?v=1').then(function () {
      return loadScript('/scripts/vendor/ScrollTrigger.min.js?v=1');
    });
  }

  function scheduleBoot() {
    if (boot()) return;
    var tries = 0;
    var timer = setInterval(function () {
      if (boot() || ++tries > 60) clearInterval(timer);
    }, 50);
  }

  function startPinLoader() {
    loadGsapBundle().then(scheduleBoot);
  }

  function whenPinsNeeded(callback) {
    var targets = document.querySelectorAll('.mv-house, .mv-land, .mv-intro');
    if (!targets.length || !('IntersectionObserver' in window)) {
      callback();
      return;
    }
    var done = false;
    var run = function () {
      if (done) return;
      done = true;
      observer.disconnect();
      callback();
    };
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) run();
    }, { rootMargin: '160px 0px' });
    targets.forEach(function (target) { observer.observe(target); });
    window.addEventListener('load', function () {
      if (window.scrollY > 48) run();
    }, { once: true });
  }

  whenPinsNeeded(startPinLoader);
})();

(function initNameMarquee() {
  'use strict';

  var track = document.querySelector('.mv-name__track');
  var loop = track && track.querySelector('.mv-name__loop');
  if (!track || !loop) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  var speed = 44;

  track.appendChild(loop.cloneNode(true));

  function readLoopWidth() {
    var loops = track.querySelectorAll('.mv-name__loop');
    if (!loops.length) return 0;

    var prevAnimation = track.style.animation;
    track.style.animation = 'none';

    var width = loops[0].offsetWidth;
    if (loops.length > 1) {
      var step = loops[1].offsetLeft - loops[0].offsetLeft;
      if (step > 0) width = step;
    }

    track.style.animation = prevAnimation;
    return width;
  }

  function applyMarquee() {
    var loopW = readLoopWidth();
    if (!loopW) return;

    var loops = track.querySelectorAll('.mv-name__loop');
    while (track.scrollWidth - parseFloat(getComputedStyle(track).paddingLeft || 0) < window.innerWidth + loopW * 2) {
      track.appendChild(loops[0].cloneNode(true));
    }

    loopW = readLoopWidth();
    if (!loopW) return;

    track.style.setProperty('--marquee-shift', loopW + 'px');
    track.style.setProperty('--marquee-duration', (loopW / speed) + 's');
  }

  applyMarquee();
  window.addEventListener('resize', applyMarquee);
  window.addEventListener('load', applyMarquee);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(applyMarquee);
  }
})();
