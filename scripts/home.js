/* EILLON homepage — signature interaction: the pinned landscape sequence.
   Native sticky positioning + scroll progress (no scroll hijacking).
   Falls back to a static, fully-legible composition only under reduced motion.
   All reveal entrances are handled by the shared engine. */
(function () {
  'use strict';

  var land = document.querySelector('.mv-land');
  if (!land) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ticking = false;
  var bound = false;
  var lastPhase = -1;
  var scrollTotal = 0;

  function measure() {
    scrollTotal = land.offsetHeight - window.innerHeight;
  }

  function update() {
    ticking = false;
    if (scrollTotal <= 0) {
      if (lastPhase !== 2) {
        lastPhase = 2;
        land.dataset.phase = '2';
      }
      return;
    }

    var rect = land.getBoundingClientRect();
    var p = clamp(-rect.top / scrollTotal, 0, 1);
    if (!mobileMq.matches) land.style.setProperty('--p', p.toFixed(3));

    var phase = p >= 0.62 ? 2 : (p >= 0.32 ? 1 : 0);
    if (phase !== lastPhase) {
      lastPhase = phase;
      land.dataset.phase = String(phase);
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  function enable() {
    if (bound) return;
    bound = true;
    lastPhase = -1;
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();
  }

  function onResize() {
    measure();
    onScroll();
  }

  function disable() {
    if (!bound) return;
    bound = false;
    lastPhase = -1;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    land.style.removeProperty('--p');
  }

  function evaluate() {
    if (reduceMq.matches) {
      disable();
      land.dataset.phase = '0';
    } else {
      enable();
    }
  }

  evaluate();
  var changeHandler = function () { evaluate(); };
  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', changeHandler);
    mobileMq.addEventListener('change', changeHandler);
  } else if (reduceMq.addListener) {
    reduceMq.addListener(changeHandler);
    mobileMq.addListener(changeHandler);
  }
})();

(function initNameMarquee() {
  'use strict';

  var track = document.querySelector('.mv-name__track');
  if (!track) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMq.matches) return;

  Array.from(track.children).forEach(function (child) {
    track.appendChild(child.cloneNode(true));
  });

  var offset = 0;
  var speed = 0.28;
  var halfW = 0;

  function measure() {
    halfW = track.scrollWidth / 2;
  }

  measure();
  window.addEventListener('resize', measure);

  function step() {
    offset -= speed;
    if (halfW > 0) {
      if (offset <= -halfW) offset += halfW;
      if (offset > 0) offset -= halfW;
    }
    track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    window.requestAnimationFrame(step);
  }

  step();
})();
