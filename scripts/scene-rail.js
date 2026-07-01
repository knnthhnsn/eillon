/* EILLON — Homepage scene rail: theatre program / house map navigation. */
(function initSceneRail() {
  'use strict';

  if (!document.body?.dataset?.navHome) return;

  var SCENES = [
    { id: 'threshold', label: 'Threshold', short: 'I', selector: '#hero' },
    { id: 'name', label: 'The Name', short: 'II', selector: '#name' },
    { id: 'memory', label: 'House of Memory', short: 'III', selector: '#maison' },
    { id: 'world', label: 'World', short: 'IV', selector: '#world' },
    { id: 'beles', label: 'Beles', short: 'V', selector: '#collection' },
    { id: 'atlas', label: 'Scent Atlas', short: 'VI', selector: '#palette' },
    { id: 'object', label: 'Object', short: 'VII', selector: '#craft' },
    { id: 'wear', label: 'Wear', short: 'VIII', selector: '#wear' },
    { id: 'letters', label: 'Letters', short: 'IX', selector: '#letters' },
    { id: 'studio', label: 'Restock / Studio', short: 'X', selector: '#studio' },
  ];

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');
  var rail = null;
  var buttons = [];
  var seenScenes = Object.create(null);
  var activeId = null;
  var ticking = false;

  function prefersReduced() {
    return reduceMq.matches;
  }

  function navOffset() {
    var nav = document.querySelector('#nav, .nav, .site-nav, [data-site-nav]');
    return (nav ? nav.offsetHeight : 56) + 12;
  }

  function buildRail() {
    var nav = document.createElement('nav');
    nav.className = 'scene-rail';
    nav.id = 'sceneRail';
    nav.setAttribute('aria-label', 'Homepage scenes');

    var inner = document.createElement('div');
    inner.className = 'scene-rail__inner';

    var title = document.createElement('p');
    title.className = 'scene-rail__program';
    title.textContent = 'Program';
    inner.appendChild(title);

    var list = document.createElement('ol');
    list.className = 'scene-rail__list';
    list.setAttribute('role', 'list');

    SCENES.forEach(function (scene) {
      var li = document.createElement('li');
      li.className = 'scene-rail__item';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scene-rail__btn';
      btn.dataset.sceneId = scene.id;
      btn.dataset.analyticsEvent = 'scene_nav_clicked';
      btn.dataset.analyticsScene = scene.id;
      btn.dataset.analyticsLabel = scene.label;
      btn.dataset.analyticsSource = 'scene_rail';
      btn.setAttribute('aria-label', 'Go to ' + scene.label);
      btn.innerHTML =
        '<span class="scene-rail__roman" aria-hidden="true">' + scene.short + '</span>' +
        '<span class="scene-rail__label">' + scene.label + '</span>' +
        '<span class="scene-rail__tick" aria-hidden="true"></span>';
      btn.addEventListener('click', function () {
        scrollToScene(scene.id);
        if (mobileMq.matches && rail) {
          rail.classList.remove('scene-rail--open');
          rail.classList.add('scene-rail--collapsed');
          var toggleBtn = rail.querySelector('.scene-rail__toggle');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
      li.appendChild(btn);
      list.appendChild(li);
      buttons.push({ scene: scene, btn: btn, el: document.querySelector(scene.selector) });
    });

    inner.appendChild(list);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'scene-rail__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'sceneRailList');
    toggle.innerHTML =
      '<span class="scene-rail__toggle-mark" aria-hidden="true"></span>' +
      '<span class="scene-rail__toggle-copy">' +
        '<span class="scene-rail__toggle-scene">Program</span>' +
        '<span class="scene-rail__toggle-hint">House scenes</span>' +
      '</span>' +
      '<span class="scene-rail__toggle-chevron" aria-hidden="true"></span>';
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      if (!mobileMq.matches) return;
      var open = !rail.classList.contains('scene-rail--open');
      rail.classList.toggle('scene-rail--open', open);
      rail.classList.toggle('scene-rail--collapsed', !open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    list.id = 'sceneRailList';
    inner.insertBefore(toggle, list);

    nav.appendChild(inner);
    document.body.appendChild(nav);
    rail = nav;

    buttons.forEach(function (entry) {
      entry.el = document.querySelector(entry.scene.selector);
    });
  }

  function setActive(id) {
    if (activeId === id) return;
    activeId = id;
    var activeEntry = null;
    buttons.forEach(function (entry) {
      var on = entry.scene.id === id;
      entry.btn.classList.toggle('is-active', on);
      entry.btn.setAttribute('aria-current', on ? 'true' : 'false');
      if (on) activeEntry = entry;
    });
    if (rail) {
      rail.dataset.activeScene = id || '';
      var toggleScene = rail.querySelector('.scene-rail__toggle-scene');
      var toggleMark = rail.querySelector('.scene-rail__toggle-mark');
      if (activeEntry && toggleScene) {
        toggleScene.textContent = activeEntry.scene.short + ' · ' + activeEntry.scene.label;
      }
      if (activeEntry && toggleMark) {
        toggleMark.textContent = activeEntry.scene.short;
      }
    }
  }

  function trackSceneView(id) {
    if (seenScenes[id]) return;
    seenScenes[id] = true;
    window.EILLON_ANALYTICS?.track?.('scene_viewed', { scene: id, page: '/' });
  }

  function sceneAtCenter() {
    var center = window.innerHeight * 0.42;
    var best = null;
    var bestDist = Infinity;

    buttons.forEach(function (entry) {
      if (!entry.el) return;
      var rect = entry.el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var mid = rect.top + rect.height * 0.5;
      var dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = entry.scene.id;
      }
    });

    return best;
  }

  function updateActive() {
    ticking = false;
    var id = sceneAtCenter();
    if (id) {
      setActive(id);
      trackSceneView(id);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActive);
  }

  function scrollToScene(id) {
    var entry = buttons.find(function (b) { return b.scene.id === id; });
    if (!entry || !entry.el) return;
    var top = entry.el.getBoundingClientRect().top + window.scrollY - navOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: prefersReduced() ? 'auto' : 'smooth' });
    setActive(id);
    trackSceneView(id);
  }

  function refreshElements() {
    buttons.forEach(function (entry) {
      entry.el = document.querySelector(entry.scene.selector);
    });
    updateActive();
  }

  function boot() {
    buildRail();
    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', refreshElements, { passive: true });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.addEventListener('refresh', refreshElements);
    }

    mobileMq.addEventListener('change', function () {
      var isMobile = mobileMq.matches;
      rail?.classList.toggle('scene-rail--mobile', isMobile);
      if (isMobile) {
        rail?.classList.add('scene-rail--collapsed');
        rail?.classList.remove('scene-rail--open');
        rail?.querySelector('.scene-rail__toggle')?.setAttribute('aria-expanded', 'false');
      } else {
        rail?.classList.remove('scene-rail--collapsed', 'scene-rail--open');
      }
    });
    rail?.classList.toggle('scene-rail--mobile', mobileMq.matches);
    if (mobileMq.matches) {
      rail?.classList.add('scene-rail--collapsed');
    }

    document.addEventListener('click', function (event) {
      if (!mobileMq.matches || !rail?.classList.contains('scene-rail--open')) return;
      if (rail.contains(event.target)) return;
      rail.classList.remove('scene-rail--open');
      rail.classList.add('scene-rail--collapsed');
      rail.querySelector('.scene-rail__toggle')?.setAttribute('aria-expanded', 'false');
    });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(boot, { timeout: 2200 });
  } else {
    requestAnimationFrame(boot);
  }
})();
