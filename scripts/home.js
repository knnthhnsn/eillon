/* EILLON homepage — GSAP ScrollTrigger pinned sequences (hero, house, maison). */
(function initHomeScrollPins() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

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

  function initIntro(mobile) {
    var intro = document.querySelector('.mv-intro');
    var pin = intro && intro.querySelector('.mv-intro__pin');
    var track = intro && intro.querySelector('.mv-intro__track');
    var hero = intro && intro.querySelector('.mv-hero');
    if (!intro || !pin || !track || !hero) return null;

    intro.classList.add('mv-intro--pin-js');
    hero.classList.add('mv-hero--pin-js');

    var kicker = hero.querySelector('.mv-hero__kicker');
    var word = hero.querySelector('.mv-hero__word');
    var tag = hero.querySelector('.mv-hero__tag');
    var cta = hero.querySelector('.mv-hero__cta');
    var scrollHint = hero.querySelector('.mv-hero__scroll');
    var nameMeta = intro.querySelector('.mv-name__meta');
    var nameSub = intro.querySelector('.mv-name__sub');
    var slideX = function () { return -window.innerWidth; };

    gsap.set(hero, {
      '--hero-scale': 1,
      '--hero-focus-x': mobile ? '46%' : '60%',
      '--hero-focus-y': mobile ? '28%' : '50%',
      '--hero-origin-x': mobile ? '46%' : '60%',
      '--hero-origin-y': mobile ? '28%' : '50%',
      '--hero-veil': 1
    });
    gsap.set(track, { x: 0 });
    gsap.set([tag, cta], { opacity: 0, y: mobile ? 16 : 22 });
    gsap.set(scrollHint, { opacity: 1 });
    if (nameMeta) gsap.set(nameMeta, { opacity: 0, y: mobile ? 14 : 18 });
    if (nameSub) gsap.set(nameSub, { opacity: 0, y: mobile ? 12 : 16 });

    var tl = gsap.timeline({ paused: true });

    tl.to(kicker, { opacity: 0, y: -16, duration: 0.1, ease: 'none' }, 0.04)
      .to(scrollHint, { opacity: 0, duration: 0.08, ease: 'none' }, 0.05)
      .to(word, { y: mobile ? -12 : -18, duration: 0.16, ease: 'none' }, 0.06)
      .to(tag, { opacity: 1, y: 0, duration: 0.12, ease: 'none' }, 0.14)
      .to(cta, { opacity: 1, y: 0, duration: 0.12, ease: 'none' }, 0.2)
      .to(track, { x: slideX, duration: 0.38, ease: 'none' }, 0.48);
    if (nameMeta) tl.to(nameMeta, { opacity: 1, y: 0, duration: 0.1, ease: 'none' }, 0.58);
    if (nameSub) tl.to(nameSub, { opacity: 1, y: 0, duration: 0.1, ease: 'none' }, 0.66);

    return ScrollTrigger.create({
      id: 'mv-intro',
      trigger: intro,
      start: 'top top',
      end: function () {
        return '+=' + Math.round(window.innerHeight * (mobile ? 2.05 : 2.35));
      },
      pin: pin,
      pinType: 'transform',
      pinSpacing: true,
      pinReparent: false,
      animation: tl,
      scrub: mobile ? true : 0.5,
      anticipatePin: mobile ? 0 : 1,
      fastScrollEnd: true,
      refreshPriority: 0,
      invalidateOnRefresh: true
    });
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
      pinType: 'transform',
      pinSpacing: true,
      pinReparent: false,
      animation: tl,
      scrub: mobile ? true : 0.65,
      anticipatePin: mobile ? 0 : 1,
      fastScrollEnd: true,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      onLeave: revealAll,
      onLeaveBack: function () {
        gsap.set(grid, { y: 0 });
      }
    });
  }

  function initLand(mobile) {
    var land = document.querySelector('.mv-land');
    var sticky = land && land.querySelector('.mv-land__sticky');
    if (!land || !sticky) return null;

    land.classList.add('mv-land--pin-js');

    var lastPhase = -1;
    function setPhase(phase) {
      if (phase === lastPhase) return;
      lastPhase = phase;
      land.dataset.phase = String(phase);
    }

    function applyProgress(p) {
      if (!mobile) {
        land.style.setProperty('--p', p.toFixed(3));
      }
      setPhase(p >= 0.62 ? 2 : (p >= 0.32 ? 1 : 0));
    }

    var landStart = sectionScrollTop(land)();
    var landScroll = landScrollDistance(land);

    var st = ScrollTrigger.create({
      id: 'mv-land',
      trigger: land,
      start: landStart,
      end: landStart + landScroll,
      pin: sticky,
      pinType: 'transform',
      pinSpacing: true,
      anticipatePin: mobile ? 0 : 1,
      fastScrollEnd: true,
      refreshPriority: 2,
      pinReparent: false,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        applyProgress(self.progress);
      }
    });

    applyProgress(st.progress);
    return st;
  }

  function runPinSetup(mobile) {
    var introSt = initIntro(mobile);
    ScrollTrigger.refresh();

    var houseSt = initHouse(mobile);
    ScrollTrigger.refresh();

    var landSt = initLand(mobile);
    refreshPins();

    return [introSt, houseSt, landSt].filter(Boolean);
  }

  function teardown(triggers) {
    triggers.forEach(function (st) {
      if (st && st.kill) st.kill(true);
    });

    document.querySelectorAll('.mv-intro--pin-js').forEach(function (el) {
      el.classList.remove('mv-intro--pin-js');
    });
    document.querySelectorAll('.mv-hero--pin-js').forEach(function (el) {
      el.classList.remove('mv-hero--pin-js');
    });
    document.querySelectorAll('.mv-house--pin-js').forEach(function (el) {
      el.classList.remove('mv-house--pin-js');
    });
    document.querySelectorAll('.mv-land--pin-js').forEach(function (el) {
      el.classList.remove('mv-land--pin-js');
    });

    var land = document.querySelector('.mv-land');
    if (land) {
      land.removeAttribute('data-phase');
      land.style.removeProperty('--p');
    }

    var hero = document.querySelector('.mv-hero');
    if (hero) {
      hero.style.removeProperty('--hero-scale');
      hero.style.removeProperty('--hero-focus-x');
      hero.style.removeProperty('--hero-focus-y');
      hero.style.removeProperty('--hero-origin-x');
      hero.style.removeProperty('--hero-origin-y');
      hero.style.removeProperty('--hero-veil');
    }

    var house = document.querySelector('.mv-house');
    if (house) {
      house.style.removeProperty('--house-p');
    }

    var track = document.querySelector('.mv-intro__track');
    if (track) {
      gsap.set(track, { clearProps: 'transform' });
    }

    var nameMeta = document.querySelector('.mv-name__meta');
    var nameSub = document.querySelector('.mv-name__sub');
    if (nameMeta) gsap.set(nameMeta, { clearProps: 'opacity,transform' });
    if (nameSub) gsap.set(nameSub, { clearProps: 'opacity,transform' });

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
})();

(function initNameMarquee() {
  'use strict';

  var track = document.querySelector('.mv-name__track');
  var loop = track && track.querySelector('.mv-name__loop');
  if (!track || !loop) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  track.appendChild(loop.cloneNode(true));

  var offset = 0;
  var speed = 28;
  var loopW = 0;
  var lastTime = 0;

  function measure() {
    var loops = track.querySelectorAll('.mv-name__loop');
    if (!loops.length) return;
    var width = loops[0].getBoundingClientRect().width;
    if (loops.length > 1) {
      var step = loops[1].getBoundingClientRect().left - loops[0].getBoundingClientRect().left;
      if (step > 0) width = step;
    }
    loopW = Math.round(width * 100) / 100;
    if (loopW > 0) {
      offset = ((offset % loopW) + loopW) % loopW;
      if (offset > 0) offset -= loopW;
    }
  }

  function ensureFill() {
    measure();
    if (!loopW) return;
    var loops = track.querySelectorAll('.mv-name__loop');
    while (track.getBoundingClientRect().width < window.innerWidth + loopW * 2) {
      track.appendChild(loops[0].cloneNode(true));
    }
    measure();
  }

  function normalizeOffset() {
    if (loopW <= 0) return;
    while (offset <= -loopW) offset += loopW;
    while (offset > 0) offset -= loopW;
  }

  ensureFill();
  window.addEventListener('resize', ensureFill);
  window.addEventListener('load', ensureFill);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ensureFill);
  }

  function step(now) {
    if (!lastTime) lastTime = now;
    var dt = Math.min(32, now - lastTime);
    lastTime = now;

    if (loopW > 0) {
      offset -= (speed * dt) / 1000;
      normalizeOffset();
      track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
    }

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
})();
