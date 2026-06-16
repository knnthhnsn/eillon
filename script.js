/* =====================================================
   EILLON — ASMARA · interactive layer
   Cinematic loader, scroll motion, hero spotlight,
   magnetic CTAs, marquee, shop logic.
   ===================================================== */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer    = window.matchMedia('(pointer: fine)').matches;
  const mobileLayout   = window.matchMedia('(max-width: 900px)');

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
    const attempt = (left) => {
      const playPromise = video.play();
      if (!playPromise || typeof playPromise.catch !== 'function') return;
      playPromise.catch(() => {
        if (left > 0) setTimeout(() => attempt(left - 1), 160);
      });
    };
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) attempt(retries);
    else video.addEventListener('loadeddata', () => attempt(retries), { once: true });
  };

  /* ---------- 1. CINEMATIC INTRO VEIL ---------- */
  // The veil holds the screen while typography reveals, then curtains slide
  // apart vertically to expose the hero.
  // Timing is anchored to performance.timeOrigin so every visit gets the full
  // sequence regardless of font cache state or script-parse latency.
  const afterVeil = [];
  const dropVeil = () => {
    document.body.classList.add('is-loaded');
    afterVeil.forEach((fn) => fn());
  };
  const minHold = prefersReduced ? 1100 : 2700;

  let dropped = false;
  const releaseVeil = () => {
    if (dropped) return;
    dropped = true;
    // performance.now() is elapsed since navigation start — perfect anchor.
    const elapsed = performance.now();
    const wait = Math.max(0, minHold - elapsed);
    setTimeout(dropVeil, wait);
  };

  // Trigger as soon as fonts are ready (or 1500ms timeout).
  if (document.fonts && document.fonts.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(releaseVeil);
  } else {
    window.addEventListener('load', releaseVeil);
  }
  // Hard safety net — never let the veil hang past minHold + 800ms.
  setTimeout(releaseVeil, minHold + 800);

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

  document.querySelectorAll('[data-reveal="words"]').forEach(splitWords);

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

  /* ---------- 3. NAV BACKGROUND ON SCROLL ---------- */
  const nav = document.getElementById('nav');
  let navTicking = false;
  const onNavScroll = () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else                     nav.classList.remove('is-scrolled');
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
  const bagToggle = document.getElementById('bagToggle');
  const cartPanel = document.getElementById('cartPanel');
  const cartBody = document.getElementById('cartBody');
  const cartSummary = document.getElementById('cartSummary');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCheckout = document.getElementById('cartCheckout');
  const cartClear = document.getElementById('cartClear');
  const cartPersonalize = document.getElementById('cartPersonalize');
  const engravingText = document.getElementById('engravingText');
  const engravingCount = document.getElementById('engravingCount');
  const giftWrap = document.getElementById('giftWrap');
  let searchReturnFocus = null;
  let cartReturnFocus = null;
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
    if (typeof closeCart === 'function') closeCart({ restoreFocus: false });
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

  /* ---------- 3c. BAG PANEL ---------- */
  const openCart = () => {
    if (!bagToggle || !cartPanel) return;
    if (typeof closeSearch === 'function') closeSearch({ restoreFocus: false });
    if (typeof closeMenu === 'function') closeMenu({ restoreFocus: false });
    cartReturnFocus = document.activeElement;
    activeOverlay = 'cart';
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    cartPanel.inert = false;
    bagToggle.setAttribute('aria-expanded', 'true');
    setPageLocked(true);
    const closeButton = cartPanel.querySelector('[data-cart-close]:not([tabindex="-1"])');
    setTimeout(() => closeButton?.focus(), 80);
  };

  const closeCart = ({ restoreFocus = true } = {}) => {
    if (!bagToggle || !cartPanel) return;
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartPanel.inert = true;
    bagToggle.setAttribute('aria-expanded', 'false');
    if (activeOverlay === 'cart') activeOverlay = null;
    setPageLocked(Boolean(activeOverlay));
    if (restoreFocus && cartReturnFocus && typeof cartReturnFocus.focus === 'function') {
      cartReturnFocus.focus();
    }
  };

  if (bagToggle && cartPanel) {
    bagToggle.addEventListener('click', openCart);
    cartPanel.querySelectorAll('[data-cart-close]').forEach((el) => {
      el.addEventListener('click', closeCart);
    });
    document.addEventListener('keydown', (e) => {
      if (!cartPanel.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeCart();
      keepFocusInside(cartPanel, e);
    });
  }

  /* ---------- 3d. MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  let menuReturnFocus = null;

  const openMenu = () => {
    if (!menuToggle || !mobileNav) return;
    if (typeof closeSearch === 'function') closeSearch({ restoreFocus: false });
    if (typeof closeCart === 'function') closeCart({ restoreFocus: false });
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
  // Translate any [data-parallax] element vertically with scroll.
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
          el.style.transform = `translate3d(0, ${y * factor * -1}px, 0)`;
        });
        pTicking = false;
      });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
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

  /* ---------- 7b. HERO BOTTLE VIDEO — start after intro veil ---------- */
  document.querySelectorAll('.hero__bottle').forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;

    const link = video.closest('.hero__bottle-link');
    const { mode } = configureBottleVideo(video);

    video.pause();
    video.currentTime = 0;
    video.removeAttribute('autoplay');

    if (prefersReduced) return;

    /* Over photo backgrounds, flat mobile encodes show a cream box — use still. */
    if (mode === 'mobile' && link) {
      link.classList.add('is-static-fallback');
      return;
    }

    let heroVideoStarted = false;

    const beginHeroVideo = () => {
      if (heroVideoStarted) return;
      heroVideoStarted = true;
      video.currentTime = 0;
      playVideoSafe(video);
    };

    if (document.body.classList.contains('is-loaded')) {
      beginHeroVideo();
    } else {
      afterVeil.push(beginHeroVideo);
    }

    document.addEventListener('visibilitychange', () => {
      if (!heroVideoStarted) return;
      if (document.hidden) video.pause();
      else playVideoSafe(video);
    });
  });

  /* ---------- 7c. CRAFT WINGS VIDEO — play when visible, hold last frame, reset on section leave ---------- */
  const craftSection = document.getElementById('craft');
  const craftMedia   = document.querySelector('.craft__image');
  const craftVideo   = document.querySelector('.craft__video');

  if (craftSection && craftMedia && craftVideo instanceof HTMLVideoElement) {
    configureBottleVideo(craftVideo);
    craftVideo.loop = false;
    craftVideo.pause();
    craftVideo.currentTime = 0;

    if (!prefersReduced) {
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

  /* ---------- 8. SHOP — SIZE SELECTOR ---------- */
  const sizes = document.querySelectorAll('.size');
  const priceEl = document.querySelector('[data-price]');
  const volumeEl = document.querySelector('[data-volume]');
  const shopImage = document.querySelector('.shop__image');
  const guideButtons = document.querySelectorAll('[data-guide-size]');
  const guideText = document.getElementById('sizeGuideText');
  let selectedSize = '100';
  const volumeMap = {
    'sample': '2 ml · discovery vial',
    '50':     '50 ml · 1.7 fl. oz.',
    '100':    '100 ml · 3.4 fl. oz.',
    'refill': '100 ml · refill cartridge',
  };
  const sizeLabelMap = {
    'sample': '2 ml sample',
    '50': '50 ml',
    '100': '100 ml',
    'refill': 'Refill',
  };
  const priceMap = {
    'sample': 28,
    '50': 170,
    '100': 240,
    'refill': 180,
  };
  const imageLabelMap = {
    'sample': 'SAMPLE',
    '50': '50 ML',
    '100': '100 ML',
    'refill': 'REFILL',
  };
  const guideCopyMap = {
    'sample': 'A first encounter with the rain-washed accord before choosing a bottle.',
    '50': 'A considered introduction to Asmara, ideal for travel or a first bottle.',
    '100': 'Daily wear, gifting, and the fullest expression of the petrichor accord.',
    'refill': 'For returning wearers who want to keep the rain-washed trail in rotation.',
  };
  const cartStorageKey = 'eillon-asmara-cart';
  const cartOptionsStorageKey = 'eillon-asmara-cart-options';
  const cartItems = new Map();

  const updateEngravingCount = () => {
    if (!engravingText || !engravingCount) return;
    const remaining = engravingText.maxLength - engravingText.value.length;
    engravingCount.textContent = `${remaining} character${remaining === 1 ? '' : 's'} remaining`;
  };

  const saveCart = () => {
    try {
      const payload = Array.from(cartItems.entries());
      window.localStorage.setItem(cartStorageKey, JSON.stringify(payload));
      window.localStorage.setItem(cartOptionsStorageKey, JSON.stringify({
        engraving: engravingText?.value || '',
        giftWrap: Boolean(giftWrap?.checked),
      }));
    } catch {
      // Storage can be disabled; the bag still works for the current page.
    }
  };

  const loadCart = () => {
    try {
      const raw = window.localStorage.getItem(cartStorageKey);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (!Array.isArray(payload)) return;
      payload.forEach(([size, item]) => {
        if (!priceMap[size] || !item || typeof item.quantity !== 'number') return;
        cartItems.set(size, {
          label: sizeLabelMap[size],
          price: priceMap[size],
          quantity: Math.max(1, Math.floor(item.quantity)),
        });
      });
      const optionsRaw = window.localStorage.getItem(cartOptionsStorageKey);
      if (optionsRaw) {
        const options = JSON.parse(optionsRaw);
        if (engravingText && typeof options.engraving === 'string') engravingText.value = options.engraving.slice(0, engravingText.maxLength);
        if (giftWrap) giftWrap.checked = Boolean(options.giftWrap);
        updateEngravingCount();
      }
    } catch {
      try {
        window.localStorage.removeItem(cartStorageKey);
        window.localStorage.removeItem(cartOptionsStorageKey);
      } catch {
        // Ignore storage cleanup failures.
      }
    }
  };

  const getCartCount = () => Array.from(cartItems.values()).reduce((sum, item) => sum + item.quantity, 0);
  const getCartSubtotal = () => Array.from(cartItems.values())
    .reduce((sum, item) => sum + item.quantity * item.price, 0);

  const updateCheckoutLink = () => {
    if (!cartCheckout) return;
    const lines = Array.from(cartItems.values()).map((item) => (
      `${item.quantity} x Asmara ${item.label} - € ${item.price * item.quantity}`
    ));
    const engraving = engravingText?.value.trim();
    const gift = giftWrap?.checked;
    const body = [
      'Hello EILLON,',
      '',
      'I would like to request a purchase for:',
      ...lines,
      '',
      `Engraving: ${engraving || 'None'}`,
      `Gift wrap: ${gift ? 'Yes' : 'No'}`,
      '',
      `Subtotal: € ${getCartSubtotal()}`,
    ].join('\n');
    cartCheckout.href = `mailto:care@eillon.maison?subject=${encodeURIComponent('Asmara order request')}&body=${encodeURIComponent(body)}`;
  };

  const updateBagLabel = () => {
    const totalCount = getCartCount();
    if (bagCountEl) bagCountEl.textContent = `(${totalCount})`;
    if (bagToggle) bagToggle.setAttribute('aria-label', `Open bag, ${totalCount} item${totalCount === 1 ? '' : 's'}`);
  };

  const syncCart = () => {
    saveCart();
    updateBagLabel();
    renderCart();
  };

  const renderCart = () => {
    if (!cartBody || !cartSummary || !cartSubtotal || !cartCheckout) return;
    cartBody.replaceChildren();
    if (!cartItems.size) {
      const empty = document.createElement('p');
      empty.className = 'cart-panel__empty';
      empty.textContent = 'Your bag is empty.';
      cartBody.appendChild(empty);
      cartSummary.hidden = true;
      if (cartPersonalize) cartPersonalize.hidden = true;
      if (cartClear) cartClear.hidden = true;
      cartCheckout.setAttribute('aria-disabled', 'true');
      cartCheckout.tabIndex = -1;
      updateCheckoutLink();
      return;
    }

    cartItems.forEach((item, size) => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const thumb = document.createElement('div');
      thumb.className = 'cart-item__thumb';
      const img = document.createElement('img');
      img.src = 'images/beles-no-background.png';
      img.alt = '';
      thumb.appendChild(img);

      const info = document.createElement('div');
      info.className = 'cart-item__info';
      const top = document.createElement('div');
      top.className = 'cart-item__top';
      const name = document.createElement('span');
      name.className = 'cart-item__name';
      name.textContent = 'Asmara';
      const price = document.createElement('span');
      price.className = 'cart-item__price';
      price.textContent = `€ ${item.price * item.quantity}`;
      top.append(name, price);

      const meta = document.createElement('span');
      meta.className = 'cart-item__meta';
      meta.textContent = item.label;
      const controls = document.createElement('div');
      controls.className = 'cart-item__controls';
      controls.setAttribute('aria-label', `Quantity for Asmara ${item.label}`);
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.setAttribute('aria-label', `Remove one Asmara ${item.label}`);
      minus.textContent = '−';
      const quantity = document.createElement('span');
      quantity.textContent = item.quantity;
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.setAttribute('aria-label', `Add one Asmara ${item.label}`);
      plus.textContent = '+';
      minus.addEventListener('click', () => {
        item.quantity -= 1;
        if (item.quantity <= 0) cartItems.delete(size);
        else cartItems.set(size, item);
        syncCart();
        if (bagStatus) bagStatus.textContent = `Bag updated. ${getCartCount()} item${getCartCount() === 1 ? '' : 's'} remaining.`;
      });
      plus.addEventListener('click', () => {
        item.quantity += 1;
        cartItems.set(size, item);
        syncCart();
        if (bagStatus) bagStatus.textContent = `${item.label} Asmara quantity increased to ${item.quantity}.`;
      });
      controls.append(minus, quantity, plus);
      const remove = document.createElement('button');
      remove.className = 'cart-item__remove';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        cartItems.delete(size);
        syncCart();
        if (bagStatus) bagStatus.textContent = `${item.label} Asmara removed from bag.`;
      });
      info.append(top, meta, controls, remove);
      row.append(thumb, info);
      cartBody.appendChild(row);
    });

    cartSubtotal.textContent = `€ ${getCartSubtotal()}`;
    cartSummary.hidden = false;
    if (cartPersonalize) cartPersonalize.hidden = false;
    if (cartClear) cartClear.hidden = false;
    cartCheckout.setAttribute('aria-disabled', 'false');
    cartCheckout.tabIndex = 0;
    updateCheckoutLink();
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

  /* ---------- 9. ADD TO BAG ---------- */
  const addBtn = document.getElementById('addBag');
  const bagCountEl = document.querySelector('.nav__bag-count');
  const bagStatus = document.getElementById('bagStatus');
  if (addBtn && bagCountEl) {
    addBtn.addEventListener('click', () => {
      const item = cartItems.get(selectedSize) || {
        label: sizeLabelMap[selectedSize],
        price: priceMap[selectedSize],
        quantity: 0,
      };
      item.quantity += 1;
      cartItems.set(selectedSize, item);
      syncCart();
      const label = addBtn.querySelector('.btn__label');
      const original = label.textContent;
      label.textContent = 'Added ✓';
      addBtn.disabled = true;
      const count = getCartCount();
      if (bagStatus) bagStatus.textContent = `${item.label} Asmara added to bag. Bag now contains ${count} item${count === 1 ? '' : 's'}.`;
      openCart();
      setTimeout(() => {
        label.textContent = original;
        addBtn.disabled = false;
      }, 1600);
    });
  }
  cartClear?.addEventListener('click', () => {
    cartItems.clear();
    if (engravingText) engravingText.value = '';
    if (giftWrap) giftWrap.checked = false;
    updateEngravingCount();
    syncCart();
    if (bagStatus) bagStatus.textContent = 'Bag cleared.';
  });
  engravingText?.addEventListener('input', () => {
    updateEngravingCount();
    saveCart();
    updateCheckoutLink();
  });
  giftWrap?.addEventListener('change', () => {
    saveCart();
    updateCheckoutLink();
  });
  loadCart();
  updateEngravingCount();
  updateBagLabel();
  renderCart();

  /* ---------- 10. NEWSLETTER ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  const newsletterStorageKey = 'eillon-newsletter-subscribed';
  const setNewsletterSubscribed = () => {
    const button = newsletterForm?.querySelector('button');
    const input = newsletterForm?.querySelector('input[type="email"]');
    if (!button || !input || !newsletterStatus) return;
    input.value = '';
    input.disabled = true;
    button.disabled = true;
    button.textContent = 'Subscribed';
    newsletterStatus.textContent = 'You are on the letter list.';
  };
  if (newsletterForm && newsletterStatus) {
    try {
      if (window.localStorage.getItem(newsletterStorageKey) === 'true') setNewsletterSubscribed();
    } catch {
      // Newsletter still submits visually if storage is unavailable.
    }
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const button = newsletterForm.querySelector('button');
      if (!input || !button) return;
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
      try {
        window.localStorage.setItem(newsletterStorageKey, 'true');
      } catch {
        // Ignore storage failures.
      }
      setNewsletterSubscribed();
    });
  }

  /* ---------- 11. SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();
