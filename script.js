/* =====================================================
   EILLON — BELES · interactive layer
   Cinematic loader, scroll motion, hero spotlight,
   magnetic CTAs, marquee, shop logic.
   ===================================================== */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer    = window.matchMedia('(pointer: fine)').matches;
  const mobileLayout   = window.matchMedia('(max-width: 900px)');
  const isLocalDev     = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

  const isIOS = () =>
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const canPlayWebmVp9 = () => {
    const probe = document.createElement('video');
    return probe.canPlayType('video/webm; codecs="vp9"') !== '';
  };

  /* iOS and other browsers without VP9 WebM need flat fallbacks (no alpha). */
  const needsFlatVideoFallback = () => isIOS() || !canPlayWebmVp9();

  const addVideoSource = (video, src, type) => {
    const source = document.createElement('source');
    source.src = src;
    source.type = type;
    video.appendChild(source);
  };

  const configureBottleVideo = (video) => {
    if (!(video instanceof HTMLVideoElement)) return { mode: 'none' };

    const webm   = video.dataset.webm;
    const mp4    = video.dataset.mp4;
    const mobile = video.dataset.mobile;
    const useFlat = needsFlatVideoFallback();

    video.innerHTML = '';
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    if (useFlat && mobile) {
      addVideoSource(video, mobile, 'video/mp4');
      video.load();
      return { mode: 'mobile' };
    }

    if (webm) addVideoSource(video, webm, 'video/webm');
    if (mp4)  addVideoSource(video, mp4, 'video/mp4');
    video.load();
    return { mode: 'alpha' };
  };

  const playVideoSafe = (video, retries = 2) => {
    if (!(video instanceof HTMLVideoElement)) return;
    video.muted = true;
    video.defaultMuted = true;
    const attempt = (left) => {
      const playPromise = video.play();
      if (!playPromise || typeof playPromise.catch !== 'function') return;
      playPromise.catch(() => {
        if (left > 0) setTimeout(() => attempt(left - 1), 160);
      });
    };
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      attempt(retries);
      return;
    }
    video.addEventListener('canplay', () => attempt(retries), { once: true });
    video.load();
  };

  /* ---------- 1. CINEMATIC INTRO VEIL ---------- */
  // The veil holds the screen while typography reveals, then curtains slide
  // apart vertically to expose the hero.
  // Timing is anchored to performance.timeOrigin so every visit gets the full
  // sequence regardless of font cache state or script-parse latency.
  const afterVeil = [];
  const minHold = prefersReduced ? 0 : 400;

  let dropped = false;
  const markVeilSeen = () => {
    if (isLocalDev) return;
    try { sessionStorage.setItem('eillon-veil-seen', '1'); } catch (_) {}
  };
  const dropVeil = () => {
    document.body.classList.add('is-loaded');
    markVeilSeen();
    afterVeil.forEach((fn) => fn());
  };
  const releaseVeil = () => {
    if (dropped) return;
    dropped = true;
    const elapsed = performance.now();
    const wait = Math.max(0, minHold - elapsed);
    setTimeout(dropVeil, wait);
  };

  let veilSeen = false;
  if (!isLocalDev) {
    try { veilSeen = sessionStorage.getItem('eillon-veil-seen') === '1'; } catch (_) {}
  }

  const saveData = navigator.connection && navigator.connection.saveData;

  if (prefersReduced || mobileLayout.matches || veilSeen || saveData) {
    dropped = true;
    dropVeil();
  } else {
    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 700)),
      ]).then(releaseVeil);
    } else {
      window.addEventListener('load', releaseVeil);
    }
    setTimeout(releaseVeil, minHold + 500);
  }

  /* ---------- 2. REVEAL ON SCROLL ----------
     Two systems:
       - legacy `.reveal` (simple fade-up)
       - `[data-reveal="..."]` variants: up | right | left | mask | mask-h |
         image | words | stagger | stagger-right | line-h | line-v | scale
  */

  // 2a. Word splitter — recurses through inline elements, wraps each word in
  //     a <span class="word"> and assigns --i for the staggered transition.
  const splitWords = (root) => {
    let counter = 0;
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (part.length === 0) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.style.setProperty('--i', counter++);
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    Array.from(root.childNodes).forEach(walk);
  };

  // Defer word-splitting until after first paint to reduce main-thread work before LCP.
  const scheduleWordSplits = () => {
    document.querySelectorAll('[data-reveal="words"]').forEach(splitWords);
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(scheduleWordSplits, { timeout: 1200 });
  } else {
    setTimeout(scheduleWordSplits, 16);
  }

  // 2b. Stagger — assign --i to direct children for sequential transitions.
  document.querySelectorAll('[data-reveal="stagger"], [data-reveal="stagger-right"]')
    .forEach((el) => {
      Array.from(el.children).forEach((child, i) => {
        child.style.setProperty('--i', i);
      });
    });

  // 2c. Observer — runs for everyone; scroll reveals are brief, finite,
  // and part of the editorial experience. Continuous motion (parallax,
  // marquee, hero spotlight) still honors prefers-reduced-motion.
  const revealEls = document.querySelectorAll('.reveal, [data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 2e. SCROLL PROGRESS BAR ---------- */
  const progressEl = document.querySelector('.scroll-progress');
  if (progressEl) {
    let pTicking = false;
    const updateProgress = () => {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        progressEl.style.setProperty('--progress', p.toFixed(4));
        pTicking = false;
      });
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- 3. NAV BACKGROUND + HIDE ON SCROLL DOWN ---------- */
  const nav = document.getElementById('nav');
  let navTicking = false;
  let lastNavScrollY = window.scrollY;
  const navHideThreshold = 72;
  const navScrollDelta = 6;

  const isNavOverlayOpen = () => (
    document.getElementById('searchPanel')?.classList.contains('is-open')
    || document.getElementById('mobileNav')?.classList.contains('is-open')
  );

  const onNavScroll = () => {
    if (navTicking || !nav) return;
    navTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const delta = y - lastNavScrollY;

      if (y > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');

      if (isNavOverlayOpen() || y <= navHideThreshold) {
        nav.classList.remove('is-hidden');
      } else if (delta > navScrollDelta) {
        nav.classList.add('is-hidden');
      } else if (delta < -navScrollDelta) {
        nav.classList.remove('is-hidden');
      }

      lastNavScrollY = y;
      navTicking = false;
    });
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- 3b. SEARCH PANEL ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('siteSearch');
  const searchItems = searchPanel ? Array.from(searchPanel.querySelectorAll('[data-search-item]')) : [];
  const searchEmpty = document.getElementById('searchEmpty');
  let searchReturnFocus = null;
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let activeOverlay = null;

  const setPageLocked = (locked) => {
    document.body.style.overflow = locked ? 'hidden' : '';
  };

  const keepFocusInside = (container, e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(container.querySelectorAll(focusableSelector))
      .filter((el) => !el.hidden && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const filterSearch = () => {
    if (!searchInput || !searchEmpty) return;
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    searchItems.forEach((item) => {
      const haystack = `${item.textContent} ${item.dataset.searchKeywords || ''}`.toLowerCase();
      const isMatch = !query || haystack.includes(query);
      item.hidden = !isMatch;
      if (isMatch) visibleCount += 1;
    });
    searchEmpty.hidden = visibleCount !== 0;
  };

  const openSearch = () => {
    if (!searchPanel || !searchToggle || !searchInput) return;
    if (typeof closeMenu === 'function') closeMenu({ restoreFocus: false });
    searchReturnFocus = document.activeElement;
    activeOverlay = 'search';
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchPanel.inert = false;
    searchToggle.setAttribute('aria-expanded', 'true');
    setPageLocked(true);
    searchInput.value = '';
    filterSearch();
    setTimeout(() => searchInput.focus(), 80);
  };

  const closeSearch = ({ restoreFocus = true } = {}) => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden', 'true');
    searchPanel.inert = true;
    searchToggle.setAttribute('aria-expanded', 'false');
    if (activeOverlay === 'search') activeOverlay = null;
    setPageLocked(Boolean(activeOverlay));
    if (restoreFocus && searchReturnFocus && typeof searchReturnFocus.focus === 'function') {
      searchReturnFocus.focus();
    }
  };

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', openSearch);
    searchPanel.querySelectorAll('[data-search-close]').forEach((btn) => {
      btn.addEventListener('click', closeSearch);
    });
    searchItems.forEach((item) => item.addEventListener('click', closeSearch));
    searchInput?.addEventListener('input', filterSearch);
    document.addEventListener('keydown', (e) => {
      if (!searchPanel.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeSearch();
      keepFocusInside(searchPanel, e);
    });
  }

  /* ---------- 3d. MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  let menuReturnFocus = null;

  const openMenu = () => {
    if (!menuToggle || !mobileNav) return;
    if (typeof closeSearch === 'function') closeSearch({ restoreFocus: false });
    menuReturnFocus = document.activeElement;
    activeOverlay = 'menu';
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.inert = false;
    setPageLocked(true);
    const firstLink = mobileNav.querySelector('[data-menu-link]');
    setTimeout(() => firstLink?.focus(), 80);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.inert = true;
    if (activeOverlay === 'menu') activeOverlay = null;
    setPageLocked(Boolean(activeOverlay));
    if (restoreFocus && menuReturnFocus && typeof menuReturnFocus.focus === 'function') {
      menuReturnFocus.focus();
    }
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      if (mobileNav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    mobileNav.querySelectorAll('[data-menu-close], [data-menu-link]').forEach((el) => {
      el.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (!mobileNav.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeMenu();
      keepFocusInside(mobileNav, e);
    });
  }

  /* ---------- 4. PARALLAX ---------- */
  // Translate [data-parallax] elements on scroll (default: vertical).
  if (!prefersReduced) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    let pTicking = false;
    const onParallax = () => {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const factor = parseFloat(el.dataset.parallax) || 0.1;
          const offset = y * factor * -1;
          const axis = el.dataset.parallaxAxis || 'y';
          el.style.transform = axis === 'x'
            ? `translate3d(${offset}px, 0, 0)`
            : `translate3d(0, ${offset}px, 0)`;
        });
        pTicking = false;
      });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  /* ---------- 5. HERO — cursor spotlight ---------- */
  // A warm radial light follows the cursor on the hero, blended onto the photo.
  if (!prefersReduced && finePointer) {
    const hero = document.querySelector('.hero');
    if (hero) {
      let mx = 30, my = 50, tx = 30, ty = 50;
      const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width)  * 100;
        ty = ((e.clientY - r.top)  / r.height) * 100;
      };
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', () => { tx = 30; ty = 50; });

      const tick = () => {
        // ease toward the target for a fluid, lagging spotlight
        mx += (tx - mx) * 0.08;
        my += (ty - my) * 0.08;
        hero.style.setProperty('--mx', mx + '%');
        hero.style.setProperty('--my', my + '%');
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  /* ---------- 6. MAGNETIC BUTTONS ---------- */
  // Subtle pull toward cursor on fine pointers.
  if (!prefersReduced && finePointer) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = 14;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 7. INFINITE MARQUEE ---------- */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee && !prefersReduced) {
    marquee.innerHTML += marquee.innerHTML;

    let offset = 0;
    let speed  = 0.35;
    let halfW  = 0;
    const measure = () => { halfW = marquee.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);

    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      speed = 0.35 + Math.min(Math.abs(dy) * 0.04, 1.5) * Math.sign(dy || 1);
    }, { passive: true });

    const step = () => {
      offset -= speed;
      if (offset <= -halfW) offset += halfW;
      if (offset > 0)       offset -= halfW;
      marquee.style.transform = `translate3d(${offset}px, 0, 0)`;
      requestAnimationFrame(step);
    };
    step();
  }

  /* ---------- 7b. HERO BOTTLE VIDEO — sneak loop only, no static fallback ---------- */
  document.querySelectorAll('.hero__bottle').forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;

    const link = video.closest('.hero__bottle-link');
    if (saveData) return;

    let heroVideoStarted = false;

    const revealHeroVideo = () => link?.classList.add('is-video-playing');
    video.addEventListener('loadeddata', revealHeroVideo, { once: true });

    const beginHeroVideo = () => {
      if (heroVideoStarted) return;
      heroVideoStarted = true;

      video.pause();
      video.currentTime = 0;
      video.removeAttribute('autoplay');

      if (prefersReduced) return;

      video.addEventListener('playing', revealHeroVideo, { once: true });
      playVideoSafe(video);
    };

    configureBottleVideo(video);

    if (document.body.classList.contains('is-loaded')) {
      beginHeroVideo();
    } else {
      afterVeil.push(beginHeroVideo);
    }

    document.addEventListener('visibilitychange', () => {
      if (!heroVideoStarted || prefersReduced) return;
      if (document.hidden) video.pause();
      else playVideoSafe(video);
    });
  });

  /* ---------- 7c. CRAFT WINGS VIDEO — play when visible, hold last frame, reset on section leave ---------- */
  const craftSection = document.getElementById('craft');
  const craftMedia   = document.querySelector('.craft__image');
  const craftVideo   = document.querySelector('.craft__video');

  if (craftSection && craftMedia && craftVideo instanceof HTMLVideoElement) {
    const craftInner = craftVideo.closest('.craft__image-inner');
    const { mode } = configureBottleVideo(craftVideo);
    craftVideo.loop = false;
    craftVideo.pause();
    craftVideo.currentTime = 0;

    /* iOS / no-WebM: still bottle. Android + desktop: transparent wings video. */
    if (craftInner && mode === 'mobile') {
      craftInner.classList.add('is-static-fallback');
    } else if (!prefersReduced) {
      let craftAtEnd = false;
      let resetTimer   = 0;

      const holdLastFrame = () => {
        craftAtEnd = true;
        craftVideo.removeAttribute('poster');
        craftVideo.pause();
      };

      const resetCraftVideo = () => {
        craftAtEnd = false;
        craftVideo.pause();
        craftVideo.currentTime = 0;
      };

      const playCraftVideo = () => {
        if (craftAtEnd) return;

        const start = () => {
          if (craftAtEnd) return;
          craftVideo.removeAttribute('poster');
          playVideoSafe(craftVideo, 3);
        };

        if (craftVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          start();
        } else {
          craftVideo.addEventListener('canplay', start, { once: true });
          craftVideo.load();
        }
      };

      craftVideo.addEventListener('ended', holdLastFrame);

      craftVideo.addEventListener('timeupdate', () => {
        const d = craftVideo.duration;
        if (!craftAtEnd && Number.isFinite(d) && d > 0 && craftVideo.currentTime >= d - 0.05) {
          holdLastFrame();
        }
      });

      const mediaObsOpts = mobileLayout.matches
        ? { threshold: 0.12, rootMargin: '48px 0px 0px 0px' }
        : { threshold: 0.25, rootMargin: '0px 0px -5% 0px' };

      const mediaObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) playCraftVideo();
          else if (!craftAtEnd) craftVideo.pause();
        },
        mediaObsOpts
      );

      const sectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) return;
          clearTimeout(resetTimer);
          const delay = mobileLayout.matches ? 320 : 0;
          resetTimer = window.setTimeout(() => {
            const rect = craftSection.getBoundingClientRect();
            const gone = rect.bottom <= 0 || rect.top >= window.innerHeight;
            if (gone) resetCraftVideo();
          }, delay);
        },
        { threshold: 0 }
      );

      mediaObserver.observe(craftMedia);
      sectionObserver.observe(craftSection);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          craftVideo.pause();
        } else {
          const mediaRect = craftMedia.getBoundingClientRect();
          const inMedia = mediaRect.bottom > 0 && mediaRect.top < window.innerHeight * 0.95;
          if (inMedia) playCraftVideo();
          else if (craftAtEnd) craftVideo.pause();
        }
      });
    }
  }

  /* ---------- 7d. MODEL VIDEO — play when parent section in view ---------- */
  const modelSections = document.querySelectorAll('.model-showcase, .ritual--wear, .chapter-visuals');

  if (modelSections.length) {
    if (!prefersReduced) {
      modelSections.forEach((section) => {
        const videos = section.querySelectorAll('[data-model-video]');
        if (!videos.length) return;

        const syncSectionVideos = (inView) => {
          section.classList.toggle('is-inview', inView);
          videos.forEach((video) => {
            if (!(video instanceof HTMLVideoElement)) return;
            if (inView) playVideoSafe(video);
            else video.pause();
          });
        };

        const syncFromViewport = () => {
          const rect = section.getBoundingClientRect();
          const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
          syncSectionVideos(inView);
        };

        let syncTick = 0;
        const requestSync = () => {
          if (syncTick) return;
          syncTick = window.requestAnimationFrame(() => {
            syncTick = 0;
            syncFromViewport();
          });
        };

        if ('IntersectionObserver' in window) {
          const sectionObserver = new IntersectionObserver(
            ([entry]) => syncSectionVideos(entry.isIntersecting),
            { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
          );

          sectionObserver.observe(section);
        }

        window.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);
        requestSync();

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            videos.forEach((video) => video.pause());
            return;
          }
          syncFromViewport();
        });
      });
    } else {
      modelSections.forEach((section) => {
        section.classList.add('is-inview');
        section.querySelectorAll('[data-model-video]').forEach((video) => {
          if (!(video instanceof HTMLVideoElement)) return;
          video.pause();
          video.currentTime = 0;
        });
      });
    }
  }

  /* ---------- 7e. COLLECTION PANEL — Beles showcase background ---------- */
  const collectionPanels = document.querySelectorAll('.collection-panel');
  const collectionVideos = document.querySelectorAll('[data-collection-video]');

  if (collectionPanels.length && collectionVideos.length) {
    if (!prefersReduced) {
      collectionPanels.forEach((panel) => {
        const video = panel.querySelector('[data-collection-video]');
        if (!(video instanceof HTMLVideoElement)) return;

        const syncPanel = (inView) => {
          panel.classList.toggle('is-inview', inView);
        };

        const panelObserver = new IntersectionObserver(
          ([entry]) => {
            const inView = entry.isIntersecting;
            syncPanel(inView);
            if (inView) playVideoSafe(video);
            else video.pause();
          },
          { threshold: 0.15, rootMargin: '0px 0px -2% 0px' }
        );

        panelObserver.observe(panel);

        video.addEventListener('playing', () => {
          panel.classList.add('is-inview');
        }, { once: false });
      });

      document.addEventListener('visibilitychange', () => {
        collectionVideos.forEach((video) => {
          if (!(video instanceof HTMLVideoElement)) return;
          if (document.hidden) {
            video.pause();
            return;
          }
          const panel = video.closest('.collection-panel');
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
          panel.classList.toggle('is-inview', inView);
          if (inView) playVideoSafe(video);
        });
      });
    } else {
      collectionVideos.forEach((video) => {
        if (!(video instanceof HTMLVideoElement)) return;
        video.pause();
        video.currentTime = 0;
      });
    }
  }

  /* ---------- 8. SHOP — SIZE SELECTOR ---------- */
  const sizes = document.querySelectorAll('.size');
  const priceEl = document.querySelector('[data-price]');
  const volumeEl = document.querySelector('[data-volume]');
  const shopImage = document.querySelector('.shop__image');
  const guideButtons = document.querySelectorAll('[data-guide-size]');
  const guideText = document.getElementById('sizeGuideText');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let selectedSize = '100';
  const volumeMap = {
    'sample': '2 ml · discovery vial',
    '50':     '50 ml · 1.7 fl. oz.',
    '100':    '100 ml · 3.4 fl. oz.',
  };
  const sizeLabelMap = {
    'sample': '2 ml sample',
    '50': '50 ml',
    '100': '100 ml',
  };
  const priceMap = {
    'sample': 28,
    '50': 170,
    '100': 240,
  };
  const imageLabelMap = {
    'sample': 'SAMPLE',
    '50': '50 ML',
    '100': '100 ML',
  };
  const shopImageMap = {
    sample: {
      webp: 'images/samples.webp',
      png: 'images/samples.png',
      alt: 'EILLON Beles · Fico d\'India 2 ml discovery sample vials',
    },
    '50': {
      webp: 'images/beles-no-background.webp',
      png: 'images/beles-no-background.png',
      alt: 'EILLON Beles · Fico d\'India 50 ml parfum',
    },
    '100': {
      webp: 'images/beles-no-background.webp',
      png: 'images/beles-no-background.png',
      alt: 'EILLON Beles · Fico d\'India 100 ml parfum',
    },
  };
  const shopImageWebp = shopImage?.querySelector('[data-shop-webp]');
  const shopImageImg = shopImage?.querySelector('[data-shop-img]');
  const shopImageInner = shopImage?.querySelector('.shop__image-inner');
  const shopVideo = shopImage?.querySelector('[data-shop-video]');
  const shopSplashSizes = new Set(['50', '100']);
  const isBelesShop = Boolean(shopImage?.closest('.shop--beles'));

  const syncShopVideo = (shouldPlay) => {
    if (!(shopVideo instanceof HTMLVideoElement) || prefersReduced) return;
    if (!shopImage || !shopSplashSizes.has(shopImage.dataset.productSize)) {
      shopVideo.pause();
      shopVideo.currentTime = 0;
      return;
    }
    if (shouldPlay) playVideoSafe(shopVideo);
    else shopVideo.pause();
  };

  const belesMobileMq = window.matchMedia('(max-width: 900px)');

  const applySplashProgress = (progress) => {
    if (!shopImage) return;
    const clamped = Math.min(1, Math.max(0, progress));
    shopImage.style.setProperty('--splash-progress', clamped.toFixed(3));
    const onBelesMobile = isBelesShop && belesMobileMq.matches;
    if (isBelesShop) {
      shopImage.classList.remove('is-splash-visible');
      if (onBelesMobile) return;
      return;
    }
    if (!onBelesMobile) {
      const splashVisible = clamped > 0.35;
      shopImage.classList.toggle('is-splash-visible', splashVisible);
      if (!canHover.matches) syncShopVideo(clamped > 0.28);
    }
  };

  let splashManual = null;
  let belesRevealTimer = null;

  const clearBelesTimedReveal = () => {
    if (belesRevealTimer) {
      clearTimeout(belesRevealTimer);
      belesRevealTimer = null;
    }
    shopImage?.classList.remove('is-beles-revealing');
    if (isBelesShop && belesMobileMq.matches) syncShopVideo(false);
  };

  const startBelesTimedReveal = () => {
    clearBelesTimedReveal();
    if (!isBelesShop || !belesMobileMq.matches || !shopImage) return;
    if (!shopSplashSizes.has(shopImage.dataset.productSize)) return;

    const delay = prefersReduced ? 600 : 1400;
    belesRevealTimer = setTimeout(() => {
      belesRevealTimer = null;
      shopImage.classList.add('is-beles-revealing');
      syncShopVideo(true);
    }, delay);
  };

  const setShopSplash = (visible) => {
    applySplashProgress(visible ? 1 : 0);
  };

  const updateShopImage = (size) => {
    const asset = shopImageMap[size];
    if (!asset || !shopImage) return;
    if (shopImageWebp) shopImageWebp.srcset = asset.webp;
    if (shopImageImg) {
      shopImageImg.src = asset.png;
      shopImageImg.alt = asset.alt;
    }
    shopImage.dataset.productSize = size;
    splashManual = null;
    if (isBelesShop && belesMobileMq.matches) {
      clearBelesTimedReveal();
      if (shopSplashSizes.has(size)) startBelesTimedReveal();
      return;
    }
    applySplashProgress(0);
    if (!canHover.matches) window.dispatchEvent(new Event('scroll'));
  };
  const guideCopyMap = {
    'sample': 'A first encounter with the sun-warmed accord before choosing a bottle.',
    '50': 'A considered introduction to Beles, ideal for travel or a first bottle.',
    '100': 'Daily wear, gifting, and the fullest expression of the Beles accord.',
  };

  const selectSize = (btn) => {
    sizes.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-checked', 'false');
      b.tabIndex = -1;
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-checked', 'true');
    btn.tabIndex = 0;
    const amount = btn.dataset.amount;
    const size   = btn.dataset.size;
    selectedSize = size || selectedSize;
    if (priceEl  && amount)              priceEl.textContent  = `€ ${amount}`;
    if (volumeEl && volumeMap[size])     volumeEl.textContent = volumeMap[size];
    if (shopImage && imageLabelMap[size]) shopImage.dataset.selectedVolume = imageLabelMap[size];
    updateShopImage(size);
    syncShopVideo(false);
    if (guideText && guideCopyMap[size])  guideText.textContent = guideCopyMap[size];
    guideButtons.forEach((guide) => {
      guide.classList.toggle('is-active', guide.dataset.guideSize === size);
    });
  };

  sizes.forEach((btn, index) => {
    btn.addEventListener('click', () => selectSize(btn));
    btn.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      let nextIndex = index;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + sizes.length) % sizes.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % sizes.length;
      if (e.key === 'Home') nextIndex = 0;
      if (e.key === 'End') nextIndex = sizes.length - 1;
      const next = sizes[nextIndex];
      selectSize(next);
      next.focus();
    });
  });
  guideButtons.forEach((guide) => {
    guide.addEventListener('click', () => {
      const match = document.querySelector(`.size[data-size="${guide.dataset.guideSize}"]`);
      if (!match) return;
      selectSize(match);
      match.focus();
    });
  });

  if (canHover.matches && shopImage) {
    shopImage.addEventListener('mouseenter', () => {
      if (shopSplashSizes.has(shopImage.dataset.productSize)) syncShopVideo(true);
    });
    shopImage.addEventListener('mouseleave', () => syncShopVideo(false));
  }

  if (shopVideo instanceof HTMLVideoElement && prefersReduced) {
    shopVideo.pause();
    shopVideo.currentTime = 0;
  }

  /* ---------- 8d. TOUCH UI — mobile alternatives to hover ---------- */
  const useTouchSplash = () => !canHover.matches && !isBelesShop;

  if (isBelesShop && belesMobileMq.matches) {
    startBelesTimedReveal();
    belesMobileMq.addEventListener('change', (e) => {
      if (e.matches) startBelesTimedReveal();
      else clearBelesTimedReveal();
    });
  } else if (useTouchSplash()) {
    let touchStartX = 0;
    let touchStartY = 0;

    const supportsSplash = () => shopSplashSizes.has(shopImage?.dataset.productSize);

    const updateSplashFromScroll = () => {
      if (!shopImage || !supportsSplash()) {
        applySplashProgress(0);
        return;
      }
      if (splashManual !== null) return;

      const rect = shopImage.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerY = rect.top + rect.height * 0.45;
      const progress = Math.min(1, Math.max(0, (vh * 0.72 - centerY) / (vh * 0.32)));
      applySplashProgress(progress);
    };

    let splashTick = false;
    const queueSplashScroll = () => {
      if (splashTick) return;
      splashTick = true;
      requestAnimationFrame(() => {
        splashManual = null;
        updateSplashFromScroll();
        splashTick = false;
      });
    };

    window.addEventListener('scroll', queueSplashScroll, { passive: true });
    window.addEventListener('resize', queueSplashScroll);
    queueSplashScroll();

    if (shopImageInner) {
      shopImageInner.addEventListener('touchstart', (e) => {
        if (!supportsSplash() || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      shopImageInner.addEventListener('touchend', (e) => {
        if (!supportsSplash()) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;

        splashManual = dx < 0 ? 1 : 0;
        applySplashProgress(splashManual);
      }, { passive: true });
    }
  }

  if (!canHover.matches) {
    const accordCells = document.querySelectorAll('.accord-profile__list > div');
    accordCells.forEach((cell) => {
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.addEventListener('click', () => {
        const wasFocused = cell.classList.contains('is-focused');
        accordCells.forEach((item) => item.classList.remove('is-focused'));
        if (!wasFocused) cell.classList.add('is-focused');
      });
      cell.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        cell.click();
      });
    });

    if ('IntersectionObserver' in window) {
      const noteIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle(
              'is-inview',
              entry.isIntersecting && entry.intersectionRatio >= 0.42
            );
          });
        },
        { threshold: [0, 0.42, 0.55] }
      );
      document.querySelectorAll('.note').forEach((note) => noteIO.observe(note));
    }
  }

  /* ---------- 9. WAITLIST ---------- */
  const waitlistMessages = {
    beles: 'We will write when Beles is back in stock.',
    asmara: 'We will write when Asmara is back in stock.',
    massawa: 'We will write when Massawa is back in stock.',
    ritual: 'We will write if Ritual returns from the lab.',
    all: 'You are on the letter list.',
  };

  const setWaitlistJoined = ({ form, emailInput, submitButton, statusEl, message, isNewsletter }) => {
    if (form) {
      form.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((field) => {
        field.disabled = true;
      });
    }
    if (emailInput) emailInput.value = '';
    if (submitButton) {
      submitButton.disabled = true;
      if (isNewsletter) {
        submitButton.textContent = 'Subscribed';
      } else {
        const label = submitButton.querySelector('.btn__label');
        if (label) label.textContent = 'We will notify you ✓';
        else submitButton.textContent = 'We will notify you ✓';
      }
    }
    if (statusEl) statusEl.textContent = message;
  };

  const submitWaitlistSignup = async ({ email, source, size, product_slug, name }) => {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source, size, product_slug, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  };

  const setupWaitlistForm = (form) => {
    const productSlug = form.dataset.productSlug
      || form.querySelector('[name="product_slug"]')?.value
      || 'beles';
    const source = form.dataset.source || 'waitlist';
    const isNewsletter = productSlug === 'all' || source === 'newsletter';
    const statusEl = form.querySelector('[aria-live="polite"]')
      || form.querySelector('.shop__waitlist-status')
      || form.querySelector('.beles-waitlist-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');
    const storageKey = `eillon-waitlist-${productSlug}`;
    const successMessage = waitlistMessages[productSlug] || 'You are on the list.';

    try {
      if (window.localStorage.getItem(storageKey) === 'true') {
        setWaitlistJoined({
          form,
          emailInput,
          submitButton,
          statusEl,
          message: successMessage,
          isNewsletter,
        });
      }
    } catch {
      // Waitlist still submits if storage is unavailable.
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const honeypot = form.querySelector('input[name="website"]');
      const label = submitButton?.querySelector('.btn__label');
      if (!emailInput) return;
      if (honeypot?.value) return;
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      const originalLabel = label?.textContent;
      const originalButtonText = submitButton?.textContent;
      if (label) label.textContent = 'Saving…';
      else if (submitButton && !isNewsletter) submitButton.textContent = 'Saving…';
      else if (submitButton) submitButton.textContent = 'Subscribing…';
      if (submitButton) submitButton.disabled = true;
      if (statusEl) statusEl.textContent = '';

      const sizeInput = form.querySelector('[name="size"]');
      const size = sizeInput?.value || (productSlug === 'beles' ? selectedSize : null);
      const nameInput = form.querySelector('[name="name"]');
      const name = nameInput?.value?.trim() || null;

      try {
        await submitWaitlistSignup({
          email: emailInput.value.trim(),
          source,
          size,
          product_slug: productSlug,
          name,
        });
        try {
          window.localStorage.setItem(storageKey, 'true');
        } catch {
          // Ignore storage failures.
        }
        setWaitlistJoined({
          form,
          emailInput,
          submitButton,
          statusEl,
          message: successMessage,
          isNewsletter,
        });
      } catch {
        if (label && originalLabel) label.textContent = originalLabel;
        else if (submitButton && originalButtonText) submitButton.textContent = originalButtonText;
        if (submitButton) submitButton.disabled = false;
        if (statusEl) {
          statusEl.textContent = isNewsletter
            ? 'Something went wrong. Please try again.'
            : 'Something went wrong. Please try again or email care@eillon.maison.';
        }
      }
    });
  };

  document.querySelectorAll('[data-waitlist-form]').forEach(setupWaitlistForm);

  /* ---------- 10. PRODUCT GRID RENDER ---------- */
  const isOutOfStock = (product) => (
    product.status === 'out-of-stock' || product.status === 'waitlist-open'
  );

  const STATUS_CLASS = {
    'out-of-stock': 'product-card__status--out-of-stock',
    'waitlist-open': 'product-card__status--out-of-stock',
    'in-production': 'product-card__status--out-of-stock',
    'coming-soon': 'product-card__status--out-of-stock',
    'concept-lab': 'product-card__status--out-of-stock',
  };

  const getStockHint = (product) => {
    if (product.slug === 'ritual') return 'Lab study — not offered';
    return 'Notify when back in stock';
  };

  const buildStoreCardCaption = (product) => {
    const caption = document.createElement('div');
    caption.className = 'product-card__caption';

    const status = document.createElement('span');
    status.className = `product-card__caption-status ${STATUS_CLASS[product.status] || ''}`;
    status.textContent = product.statusLabel;

    const title = document.createElement('span');
    title.className = 'product-card__caption-title';
    title.textContent = `${product.name} · ${product.subtitle}`;

    const hint = document.createElement('span');
    hint.className = 'product-card__caption-hint';
    hint.textContent = getStockHint(product);

    caption.append(status, title, hint);
    return caption;
  };

  const buildNotePyramid = (notes) => {
    const pyramid = document.createElement('div');
    pyramid.className = 'product-card__pyramid';

    [
      ['Top', notes?.top],
      ['Heart', notes?.heart],
      ['Base', notes?.base],
    ].forEach(([label, items]) => {
      if (!items?.length) return;

      const row = document.createElement('div');
      row.className = 'product-card__pyramid-row';

      const labelEl = document.createElement('span');
      labelEl.className = 'product-card__pyramid-label';
      labelEl.textContent = label;

      const notesEl = document.createElement('span');
      notesEl.className = 'product-card__pyramid-notes';
      notesEl.textContent = items.join(' · ');

      row.append(labelEl, notesEl);
      pyramid.appendChild(row);
    });

    return pyramid;
  };

  const appendLazyImage = (img, src, alt) => {
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
  };

  const CHAPTER_SIGNUP_SLUGS = new Set(['beles', 'asmara', 'massawa', 'ritual']);

  const getChapterSignupHref = (slug) => `/${slug}#waitlist`;

  const getOverviewCardHref = (product) => {
    if (CHAPTER_SIGNUP_SLUGS.has(product.slug)) {
      return getChapterSignupHref(product.slug);
    }
    return product.url || '/store';
  };

  const legacyChapterHash = window.location.hash.replace(/^#/, '');
  if (
    CHAPTER_SIGNUP_SLUGS.has(legacyChapterHash)
    && /\/store(?:\.html)?$/.test(window.location.pathname)
  ) {
    window.location.replace(getChapterSignupHref(legacyChapterHash));
  }

  const buildProductCardMedia = (product, cardIsLink = false) => {
    const label = `View ${product.name} · ${product.subtitle}`;
    const bottleAlt = `EILLON ${product.name} · ${product.subtitle} bottle`;
    const isLinked = Boolean(product.url && isOutOfStock(product) && product.slug === 'beles') && !cardIsLink;
    const hasSceneVideo = Boolean(product.sceneVideo);
    const isMoodOnly = Boolean(product.moodImage || hasSceneVideo);
    const isStage = Boolean(product.scentImage && product.image);

    if (isMoodOnly || isStage) {
      const media = document.createElement(isLinked && isMoodOnly && !hasSceneVideo ? 'a' : 'div');
      media.className = `product-card__media product-card__media--showcase${isMoodOnly ? ' product-card__media--mood' : ''}`;
      if (isLinked && isMoodOnly && !hasSceneVideo) {
        media.href = product.url;
        media.setAttribute('aria-label', label);
      } else {
        media.setAttribute('aria-hidden', 'true');
      }

      if (hasSceneVideo && !prefersReduced) {
        const scene = document.createElement('video');
        scene.className = 'product-card__scene';
        scene.dataset.cardSceneVideo = '';
        scene.muted = true;
        scene.loop = true;
        scene.setAttribute('playsinline', '');
        scene.preload = 'none';
        if (product.scenePoster) scene.poster = product.scenePoster;
        const source = document.createElement('source');
        source.src = product.sceneVideo;
        source.type = 'video/mp4';
        scene.appendChild(source);
        media.appendChild(scene);
      } else {
        const scene = document.createElement('img');
        scene.className = 'product-card__scene';
        appendLazyImage(scene, isMoodOnly ? product.moodImage : product.scentImage, isMoodOnly ? bottleAlt : '');
        media.appendChild(scene);
      }

      if (isStage) {
        const veil = document.createElement('span');
        veil.className = 'product-card__veil';
        veil.setAttribute('aria-hidden', 'true');

        const pedestal = document.createElement('div');
        pedestal.className = 'product-card__pedestal';

        const bottle = document.createElement('img');
        bottle.className = 'product-card__bottle';
        appendLazyImage(bottle, product.image, bottleAlt);

        pedestal.appendChild(bottle);
        media.append(veil, pedestal);
      }

      if (isOutOfStock(product)) {
        const imageLabel = document.createElement('span');
        imageLabel.className = 'product-card__image-label product-card__image-label--out-of-stock';

        const statusLine = document.createElement('span');
        statusLine.className = 'product-card__image-label-status';
        statusLine.textContent = product.statusLabel;

        const hintLine = document.createElement('span');
        hintLine.className = 'product-card__image-label-hint';
        hintLine.textContent = getStockHint(product);

        imageLabel.append(statusLine, hintLine);
        media.appendChild(imageLabel);
      }

      const sheen = document.createElement('span');
      sheen.className = 'product-card__sheen';
      sheen.setAttribute('aria-hidden', 'true');
      media.appendChild(sheen);
      return media;
    }

    if (isLinked) {
      const media = document.createElement('a');
      media.className = 'product-card__media';
      media.href = product.url;
      media.setAttribute('aria-label', label);
      const img = document.createElement('img');
      appendLazyImage(img, product.image, bottleAlt);
      media.appendChild(img);
      return media;
    }

    const media = document.createElement('div');
    media.className = 'product-card__media product-card__media--placeholder';
    media.setAttribute('aria-hidden', 'true');
    return media;
  };

  const createProductCard = (product, mode) => {
    const isOverview = mode === 'preview' || mode === 'store';

    if (isOverview) {
      const card = document.createElement('a');
      card.className = `product-card product-card--${product.slug} product-card--compact product-card--link`;
      card.id = `card-${product.slug}`;
      card.href = getOverviewCardHref(product);
      card.setAttribute('aria-label', `${product.name} · ${product.subtitle}`);

      card.appendChild(buildProductCardMedia(product, true));

      if (mode === 'store') {
        card.appendChild(buildStoreCardCaption(product));
      } else if (mode !== 'store') {
        const body = document.createElement('div');
        body.className = 'product-card__body';

        const status = document.createElement('span');
        status.className = `product-card__status ${STATUS_CLASS[product.status] || ''}`;
        status.textContent = product.statusLabel;
        body.appendChild(status);

        const heading = document.createElement('h2');
        heading.append(document.createTextNode(product.name));
        const subtitle = document.createElement('span');
        subtitle.textContent = product.subtitle;
        heading.appendChild(subtitle);
        body.appendChild(heading);

        card.appendChild(body);
      }
      return card;
    }

    const article = document.createElement('article');
    article.className = `product-card product-card--${product.slug}`;
    article.id = product.slug;

    article.appendChild(buildProductCardMedia(product));

    const body = document.createElement('div');
    body.className = 'product-card__body';

    const status = document.createElement('span');
    status.className = `product-card__status ${STATUS_CLASS[product.status] || ''}`;
    status.textContent = product.statusLabel;
    body.appendChild(status);

    const heading = document.createElement('h2');
    heading.append(document.createTextNode(product.name));
    const subtitle = document.createElement('span');
    subtitle.textContent = product.subtitle;
    heading.appendChild(subtitle);
    body.appendChild(heading);

    const chapter = document.createElement('p');
    chapter.className = 'product-card__chapter';
    chapter.textContent = product.chapter;
    body.appendChild(chapter);

    const desc = document.createElement('p');
    desc.className = 'product-card__desc';
    desc.textContent = product.shortDescription;
    body.appendChild(desc);

    if (product.notes) {
      body.appendChild(buildNotePyramid(product.notes));
    }

    const actions = document.createElement('div');
    actions.className = 'product-card__actions';

    if (product.slug === 'beles' && product.waitlistEnabled) {
      const cta = document.createElement('a');
      cta.className = 'btn btn--primary';
      cta.href = '/beles#waitlist';
      cta.innerHTML = `<span class="btn__label">${product.ctaLabel}</span>`;
      actions.appendChild(cta);
    } else if (mode === 'store' && product.waitlistEnabled) {
      const miniForm = document.createElement('form');
      miniForm.className = 'mini-waitlist';
      miniForm.setAttribute('data-waitlist-form', '');
      miniForm.dataset.productSlug = product.slug;
      miniForm.dataset.source = 'product-card';
      miniForm.noValidate = true;

      const email = document.createElement('input');
      email.type = 'email';
      email.name = 'email';
      email.placeholder = `Email for ${product.name} restock`;
      email.autocomplete = 'email';
      email.required = true;

      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'website';
      honeypot.className = 'shop__honeypot';
      honeypot.tabIndex = -1;
      honeypot.setAttribute('autocomplete', 'off');
      honeypot.setAttribute('aria-hidden', 'true');

      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = product.ctaLabel;

      const statusLine = document.createElement('p');
      statusLine.setAttribute('aria-live', 'polite');

      miniForm.append(email, honeypot, btn, statusLine);
      actions.appendChild(miniForm);
    } else if (CHAPTER_SIGNUP_SLUGS.has(product.slug)) {
      const cta = document.createElement('a');
      cta.className = 'btn btn--ghost';
      cta.href = getChapterSignupHref(product.slug);
      cta.innerHTML = `<span>${product.ctaLabel}</span><span class="arrow">→</span>`;
      actions.appendChild(cta);
    } else {
      const cta = document.createElement('a');
      cta.className = 'btn btn--ghost';
      cta.href = product.url || '/store';
      cta.innerHTML = `<span>${product.ctaLabel}</span><span class="arrow">→</span>`;
      actions.appendChild(cta);
    }

    body.appendChild(actions);
    article.appendChild(body);
    return article;
  };

  const getProductsForContainer = (container, products) => {
    const filter = container.dataset.productPreview || container.dataset.productFilter;
    if (filter) {
      return products.filter((product) => product.slug === filter);
    }
    return products;
  };

  const initCardSceneVideos = () => {
    if (prefersReduced) return;
    document.querySelectorAll('[data-card-scene-video]').forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) return;
      const root = video.closest('.product-card, .collection-panel') || video;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) playVideoSafe(video);
          else video.pause();
        },
        { threshold: 0.15, rootMargin: '0px 0px -2% 0px' }
      );
      observer.observe(root);
    });
  };

  const renderProductGrids = () => {
    const products = window.EILLON_PRODUCTS;
    if (!Array.isArray(products)) return;

    document.querySelectorAll('[data-product-preview]').forEach((container) => {
      container.classList.add('product-grid', 'product-grid--collection', 'product-grid--preview');
      getProductsForContainer(container, products).forEach((product) => {
        container.appendChild(createProductCard(product, 'preview'));
      });
    });

    document.querySelectorAll('[data-product-grid]').forEach((container) => {
      const mode = container.dataset.productGridMode || 'store';
      container.classList.add('product-grid--collection', 'product-grid--boutique');
      products.forEach((product) => {
        container.appendChild(createProductCard(product, mode));
      });
      container.querySelectorAll('[data-waitlist-form]').forEach(setupWaitlistForm);
    });
  };

  renderProductGrids();
  initCardSceneVideos();

  /* ---------- 11. SMOOTH ANCHOR SCROLL ---------- */
  const scrollToHashTarget = (hash, { focusEmail = false } = {}) => {
    const id = (hash || window.location.hash).replace(/^#/, '');
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    if (focusEmail) {
      target.querySelector('input[type="email"]')?.focus({ preventScroll: true });
    }
  };

  if (window.location.hash) {
    requestAnimationFrame(() => scrollToHashTarget(window.location.hash, { focusEmail: true }));
  }

  window.addEventListener('hashchange', () => {
    scrollToHashTarget(window.location.hash, { focusEmail: true });
  });

  document.querySelectorAll('a[href*="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.includes('#')) return;
      if (href.startsWith('/') && !href.startsWith(window.location.pathname)) return;
      const hash = href.slice(href.indexOf('#'));
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      const isSamePage = href.startsWith('#') || href.startsWith(window.location.pathname);
      if (!isSamePage) return;
      e.preventDefault();
      history.pushState(null, '', hash);
      scrollToHashTarget(hash, {
        focusEmail: Boolean(target.id === 'waitlist' || target.querySelector('[data-waitlist-form]')),
      });
    });
  });

  /* ---------- MAISON STORY MODAL ---------- */
  const maisonModal = document.getElementById('maisonModal');
  const maisonOpeners = document.querySelectorAll('[data-maison-story-open]');
  let maisonReturnFocus = null;

  const openMaisonModal = () => {
    if (!maisonModal) return;
    if (typeof closeMenu === 'function') closeMenu({ restoreFocus: false });
    if (typeof closeSearch === 'function') closeSearch({ restoreFocus: false });
    maisonReturnFocus = document.activeElement;
    activeOverlay = 'maison';
    maisonModal.classList.add('is-open');
    maisonModal.setAttribute('aria-hidden', 'false');
    maisonModal.inert = false;
    setPageLocked(true);
    const closeBtn = maisonModal.querySelector('[data-maison-story-close]:not(.maison-modal__backdrop)');
    setTimeout(() => (closeBtn || maisonModal).focus(), 80);
    if (window.EILLON_I18N) window.EILLON_I18N.applyLang(window.EILLON_I18N.getLang());
  };

  const closeMaisonModal = ({ restoreFocus = true } = {}) => {
    if (!maisonModal) return;
    maisonModal.classList.remove('is-open');
    maisonModal.setAttribute('aria-hidden', 'true');
    maisonModal.inert = true;
    if (activeOverlay === 'maison') activeOverlay = null;
    setPageLocked(Boolean(activeOverlay));
    if (restoreFocus && maisonReturnFocus && typeof maisonReturnFocus.focus === 'function') {
      maisonReturnFocus.focus();
    }
  };

  if (maisonModal && maisonOpeners.length) {
    maisonOpeners.forEach((btn) => btn.addEventListener('click', openMaisonModal));
    maisonModal.querySelectorAll('[data-maison-story-close]').forEach((btn) => {
      btn.addEventListener('click', closeMaisonModal);
    });
    maisonModal.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', closeMaisonModal));
    document.addEventListener('keydown', (e) => {
      if (!maisonModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeMaisonModal();
      keepFocusInside(maisonModal, e);
    });
  }

  /* ---------- BOTTLE EXPLORER ---------- */
  document.querySelectorAll('[data-bottle-explorer]').forEach((wrap) => {
    const img = wrap.querySelector('[data-bottle-img]') || wrap.querySelector('img');
    if (!img || prefersReduced) return;

    let pointerDown = false;
    const tilt = (x, y) => {
      const rect = wrap.getBoundingClientRect();
      const px = (x - rect.left) / rect.width - 0.5;
      const py = (y - rect.top) / rect.height - 0.5;
      const rotY = px * 18;
      const rotX = py * -10;
      img.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.02)`;
    };

    const reset = () => {
      img.style.transform = '';
      pointerDown = false;
    };

    wrap.addEventListener('pointermove', (e) => {
      if (!pointerDown && e.pointerType !== 'mouse') return;
      tilt(e.clientX, e.clientY);
    });
    wrap.addEventListener('pointerdown', (e) => {
      pointerDown = true;
      wrap.setPointerCapture(e.pointerId);
      tilt(e.clientX, e.clientY);
    });
    wrap.addEventListener('pointerup', reset);
    wrap.addEventListener('pointerleave', reset);
  });
})();
