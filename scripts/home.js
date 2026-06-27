/* EILLON homepage — signature interaction: the pinned landscape sequence.
   Desktop: native sticky + scroll progress for zoom and phases.
   Mobile: GSAP ScrollTrigger pin + normalizeScroll (iOS scroll-thread sync).
   Falls back to a static composition under reduced motion. */
(function initMvLand() {
  'use strict';

  var land = document.querySelector('.mv-land');
  if (!land) return;

  var sticky = land.querySelector('.mv-land__sticky');
  if (!sticky) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var mode = null;
  var lastPhase = -1;
  var landTrigger = null;
  var normalizeActive = false;

  function setPhase(phase) {
    if (phase === lastPhase) return;
    lastPhase = phase;
    land.dataset.phase = String(phase);
  }

  function applyProgress(p) {
    land.style.setProperty('--p', p.toFixed(3));
    setPhase(p >= 0.62 ? 2 : (p >= 0.32 ? 1 : 0));
  }

  function disableNormalizeScroll() {
    if (normalizeActive && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.normalizeScroll(false);
      normalizeActive = false;
    }
  }

  function destroyGsapPin() {
    if (landTrigger) {
      landTrigger.kill();
      landTrigger = null;
    }
    disableNormalizeScroll();
    land.classList.remove('mv-land--pin-js');
    land.style.removeProperty('--p');
  }

  /* --- desktop scroll driver --- */
  var ticking = false;
  var scrollTotal = 0;

  function measureDesktop() {
    scrollTotal = land.offsetHeight - window.innerHeight;
  }

  function updateDesktop() {
    ticking = false;
    if (scrollTotal <= 0) {
      setPhase(2);
      return;
    }
    var rect = land.getBoundingClientRect();
    applyProgress(clamp(-rect.top / scrollTotal, 0, 1));
  }

  function onDesktopScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateDesktop);
    }
  }

  function onDesktopResize() {
    measureDesktop();
    onDesktopScroll();
  }

  function disableDesktop() {
    window.removeEventListener('scroll', onDesktopScroll);
    window.removeEventListener('resize', onDesktopResize);
  }

  function enableDesktop() {
    lastPhase = -1;
    measureDesktop();
    window.addEventListener('scroll', onDesktopScroll, { passive: true });
    window.addEventListener('resize', onDesktopResize);
    updateDesktop();
  }

  function enableMobileFallback() {
    lastPhase = -1;
    land.classList.remove('mv-land--pin-js');
    land.removeAttribute('data-phase');
    land.style.removeProperty('--p');
  }

  function enableMobileGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      enableMobileFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (ScrollTrigger.isTouch) {
      ScrollTrigger.normalizeScroll(true);
      normalizeActive = true;
    }

    lastPhase = -1;
    land.classList.add('mv-land--pin-js');

    landTrigger = ScrollTrigger.create({
      trigger: land,
      start: 'top top',
      end: 'bottom bottom',
      pin: sticky,
      pinType: 'fixed',
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        applyProgress(self.progress);
      }
    });

    applyProgress(landTrigger.progress);
    ScrollTrigger.refresh();
  }

  function disableMobile() {
    destroyGsapPin();
    land.removeAttribute('data-phase');
  }

  function evaluate() {
    if (reduceMq.matches) {
      disableDesktop();
      disableMobile();
      mode = null;
      lastPhase = -1;
      land.dataset.phase = '0';
      land.style.removeProperty('--p');
      return;
    }

    var nextMode = mobileMq.matches ? 'mobile' : 'desktop';
    if (nextMode === mode) return;

    if (mode === 'desktop') disableDesktop();
    if (mode === 'mobile') disableMobile();

    mode = nextMode;

    if (mode === 'mobile') enableMobileGsap();
    else enableDesktop();
  }

  evaluate();
  var changeHandler = function () { evaluate(); };
  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', changeHandler);
    mobileMq.addEventListener('change', changeHandler);
  } else {
    reduceMq.addListener(changeHandler);
    mobileMq.addListener(changeHandler);
  }

  window.addEventListener('load', function () {
    if (mode === 'mobile' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
})();

(function initNameMarquee() {
  'use strict';

  var track = document.querySelector('.mv-name__track');
  var segment = track && track.querySelector('.mv-name__segment');
  if (!track || !segment) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  track.appendChild(segment.cloneNode(true));

  var offset = 0;
  var speed = 0.28;
  var loopW = 0;

  function measure() {
    var segments = track.querySelectorAll('.mv-name__segment');
    if (segments.length < 2) return;
    var first = segments[0].getBoundingClientRect();
    var second = segments[1].getBoundingClientRect();
    loopW = second.left - first.left;
    if (loopW > 0) {
      while (offset <= -loopW) offset += loopW;
      while (offset > 0) offset -= loopW;
    }
  }

  function ensureFill() {
    measure();
    if (!loopW) return;
    while (track.scrollWidth < window.innerWidth + loopW * 2) {
      track.appendChild(segment.cloneNode(true));
    }
    measure();
  }

  ensureFill();
  window.addEventListener('resize', ensureFill);
  window.addEventListener('load', ensureFill);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ensureFill);
  }

  function step() {
    if (loopW > 0) {
      offset -= speed;
      if (offset <= -loopW) offset += loopW;
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }
    window.requestAnimationFrame(step);
  }

  step();
})();
