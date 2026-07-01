/* EILLON interactions-core — reveals, nav, waitlist, anchors */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = E.finePointer ?? window.matchMedia('(pointer: fine)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const readScrollY = E.readScrollY;
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
        const y = readScrollY();
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
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
  let lastNavScrollY = readScrollY();
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
      const y = readScrollY();
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

  /* ---------- 9. WAITLIST ---------- */
  const CONSENT_NOTICE_VERSION = '2026-06-29';

  const waitlistMessages = {
    beles: 'You are on the Beles restock list — we write when the next batch is ready.',
    asmara: 'We will send studio notes as Asmara develops.',
    massawa: 'We will send studio notes as Massawa develops.',
    ritual: 'You are following the Ritual lab study.',
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

  const submitWaitlistSignup = async ({ email, source, size, product_slug, name, consent_marketing }) => {
    const utm = window.EILLON_ANALYTICS?.getUtm?.() || {};
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source,
        size,
        product_slug,
        name,
        utm_source: utm.utm_source || null,
        utm_medium: utm.utm_medium || null,
        utm_campaign: utm.utm_campaign || null,
        consent_marketing: consent_marketing === true,
        consent_notice_version: CONSENT_NOTICE_VERSION,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  };

  const formHasConsent = (form) => {
    const scope = form.closest('.shop__info, .footer__news, .sx-letter, main, .editorial-page__main') || document;
    if (scope.querySelector('.shop__waitlist-consent, .waitlist-consent')) return true;
    if (form.closest('.footer__news')?.querySelector('.footer__promise')) return true;
    return form.dataset.consentMarketing === 'true';
  };

  const setupWaitlistForm = (form) => {
    const productSlug = form.dataset.productSlug
      || form.querySelector('[name="product_slug"]')?.value
      || 'beles';
    const source = form.dataset.source || 'waitlist';
    const isNewsletter = productSlug === 'all' || source === 'newsletter';

    if (!form.dataset.consentReady) {
      form.dataset.consentReady = 'true';
      const hasConsent = form.parentElement?.querySelector('.shop__waitlist-consent, .waitlist-consent');
      if (!hasConsent) {
        const note = document.createElement('p');
        note.className = form.classList.contains('shop__waitlist') ? 'shop__waitlist-consent' : 'waitlist-consent';
        const purpose = isNewsletter
          ? 'the EILLON letter described above'
          : productSlug === 'beles'
            ? 'the Beles restock note described above'
            : 'studio notes for the chapter you selected';
        note.innerHTML = `By submitting, you agree to receive ${purpose}. Unsubscribe anytime at <a href="mailto:care@eillon.maison?subject=Unsubscribe">care@eillon.maison</a>.`;
        form.insertAdjacentElement('afterend', note);
      }
    }

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

    let formStarted = false;
    emailInput?.addEventListener('focus', () => {
      if (formStarted) return;
      formStarted = true;
      window.EILLON_ANALYTICS?.track?.('restock_form_started', {
        chapter: productSlug,
        source,
      });
    });

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
          consent_marketing: formHasConsent(form),
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
        window.EILLON_ANALYTICS?.track?.('restock_form_submitted', {
          chapter: productSlug,
          source,
          size: size || null,
        });
      } catch {
        window.EILLON_ANALYTICS?.track?.('restock_form_error', {
          chapter: productSlug,
          source,
        });
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
      if (href.includes('#waitlist')) {
        const source = a.dataset.restockSource
          || (a.closest('.scene-rail') ? 'scene_rail' : null)
          || (a.closest('.mv-chapter') ? 'homepage_beles' : null)
          || 'cta';
        window.EILLON_ANALYTICS?.markRestockSource?.(source);
      }
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
})();
