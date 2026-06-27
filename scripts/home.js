/* EILLON homepage — signature interaction: the pinned landscape sequence.
   Desktop: native sticky + scroll progress for zoom and phases.
   Mobile: CSS view-timeline scroll-driven fades (no JS during scroll).
   Falls back to a static composition under reduced motion. */
(function () {
  'use strict';

  var land = document.querySelector('.mv-land');
  if (!land) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var mode = null;
  var lastPhase = -1;

  function cssScrollPhases() {
    return mobileMq.matches && (
      CSS.supports('animation-timeline', '--maison') ||
      CSS.supports('animation-timeline', 'view()')
    );
  }

  /* --- desktop scroll driver --- */
  var ticking = false;
  var scrollTotal = 0;

  function setPhase(phase) {
    if (phase === lastPhase) return;
    lastPhase = phase;
    land.dataset.phase = String(phase);
  }

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
    var p = clamp(-rect.top / scrollTotal, 0, 1);
    land.style.setProperty('--p', p.toFixed(3));
    setPhase(p >= 0.62 ? 2 : (p >= 0.32 ? 1 : 0));
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
    land.style.removeProperty('--p');
  }

  function enableDesktop() {
    lastPhase = -1;
    measureDesktop();
    window.addEventListener('scroll', onDesktopScroll, { passive: true });
    window.addEventListener('resize', onDesktopResize);
    updateDesktop();
  }

  function enableMobile() {
    land.style.removeProperty('--p');
    lastPhase = -1;
    if (cssScrollPhases()) {
      land.removeAttribute('data-phase');
      return;
    }
    land.dataset.phase = '0';
  }

  function evaluate() {
    if (reduceMq.matches) {
      disableDesktop();
      mode = null;
      lastPhase = -1;
      land.dataset.phase = '0';
      land.style.removeProperty('--p');
      return;
    }

    var nextMode = mobileMq.matches ? 'mobile' : 'desktop';
    if (nextMode === mode) return;

    disableDesktop();
    mode = nextMode;

    if (mode === 'mobile') enableMobile();
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
