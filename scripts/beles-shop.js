/* EILLON beles-shop — size selector, sticky restock, shop video */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const playVideoSafe = E.playVideoSafe || (() => {});
  const saveData = E.saveData ?? navigator.connection?.saveData === true;

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
      webp: 'images/beles-no-background.webp?v=1',
      png: 'images/beles-no-background.png?v=1',
      alt: 'EILLON Beles · Fico d\'India 50 ml parfum',
    },
    '100': {
      webp: 'images/beles-no-background.webp?v=1',
      png: 'images/beles-no-background.png?v=1',
      alt: 'EILLON Beles · Fico d\'India 100 ml parfum',
    },
  };
  const shopImageWebp = shopImage?.querySelector('[data-shop-webp]');
  const shopImageImg = shopImage?.querySelector('[data-shop-img]');
  const shopImageInner = shopImage?.querySelector('.shop__image-inner');
  const shopVideo = shopImage?.querySelector('[data-shop-video]');
  const shopSplashSizes = new Set(['50', '100']);
  const isBelesShop = Boolean(shopImage?.closest('.shop--beles'));
  let shopVideoWanted = false;
  let shopVideoPrimed = false;
  let shopVideoPrimeQueued = false;

  const resetShopVideoToStart = () => {
    try { shopVideo.currentTime = 0; } catch (_) {}
  };

  const primeShopVideo = () => {
    if (!(shopVideo instanceof HTMLVideoElement) || prefersReduced || saveData) return;
    if (!shopImage || !shopSplashSizes.has(shopImage.dataset.productSize)) return;
    if (shopVideoPrimed) return;

    shopVideo.muted = true;
    shopVideo.defaultMuted = true;
    shopVideo.preload = 'auto';

    const settle = () => {
      if (shopVideoPrimed || document.hidden) return;
      const playPromise = shopVideo.play();
      if (!playPromise || typeof playPromise.then !== 'function') {
        shopVideoPrimed = true;
        if (!shopVideoWanted) {
          shopVideo.pause();
          resetShopVideoToStart();
        }
        return;
      }

      playPromise
        .then(() => {
          shopVideoPrimed = true;
          if (!shopVideoWanted) {
            shopVideo.pause();
            resetShopVideoToStart();
          }
        })
        .catch(() => {
          shopVideo.load();
        });
    };

    if (shopVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      settle();
    } else {
      shopVideo.addEventListener('canplay', settle, { once: true });
      shopVideo.load();
    }
  };

  const scheduleShopVideoPrime = () => {
    if (shopVideoPrimeQueued) return;
    shopVideoPrimeQueued = true;
    const run = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(primeShopVideo, { timeout: 1800 });
      } else {
        setTimeout(primeShopVideo, 500);
      }
    };
    run();
  };

  const syncShopVideo = (shouldPlay) => {
    if (!(shopVideo instanceof HTMLVideoElement) || prefersReduced) return;
    shopVideoWanted = shouldPlay;
    if (!shopImage || !shopSplashSizes.has(shopImage.dataset.productSize)) {
      shopVideo.pause();
      resetShopVideoToStart();
      return;
    }
    if (shouldPlay) {
      shopVideo.preload = 'auto';
      playVideoSafe(shopVideo);
    }
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
    window.EILLON_ANALYTICS?.track?.('size_interest_selected', { chapter: 'beles', size });
    if (priceEl  && amount)              priceEl.textContent  = `€ ${amount}`;
    if (volumeEl && volumeMap[size])     volumeEl.textContent = volumeMap[size];
    if (shopImage && imageLabelMap[size]) shopImage.dataset.selectedVolume = imageLabelMap[size];
    updateShopImage(size);
    syncShopVideo(false);
    if (guideText && guideCopyMap[size])  guideText.textContent = guideCopyMap[size];
    guideButtons.forEach((guide) => {
      guide.classList.toggle('is-active', guide.dataset.guideSize === size);
    });
    const stickySizeEl = document.getElementById('belesStickySize');
    if (stickySizeEl && sizeLabelMap[size]) {
      stickySizeEl.textContent = `${sizeLabelMap[size]} · size interest`;
    }
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

  const belesRestockSticky = document.getElementById('belesRestockSticky');
  const belesProofLayer = document.getElementById('proof');
  if (belesRestockSticky && belesProofLayer) {
    const stickyMobileMq = window.matchMedia('(max-width: 900px)');
    const syncSticky = (visible) => {
      belesRestockSticky.hidden = !visible;
      belesRestockSticky.classList.toggle('is-visible', visible);
    };
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        if (!stickyMobileMq.matches) {
          syncSticky(false);
          return;
        }
        syncSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    stickyObserver.observe(belesProofLayer);
    stickyMobileMq.addEventListener('change', () => {
      if (!stickyMobileMq.matches) syncSticky(false);
    });
    belesRestockSticky.querySelector('[data-restock-source]')?.addEventListener('click', () => {
      window.EILLON_ANALYTICS?.markRestockSource?.('sticky_card');
    });
    const stickySizeEl = document.getElementById('belesStickySize');
    if (stickySizeEl) stickySizeEl.textContent = `${sizeLabelMap[selectedSize]} · size interest`;
  }

  if (canHover.matches && shopImage) {
    shopImage.addEventListener('mouseenter', () => {
      if (shopSplashSizes.has(shopImage.dataset.productSize)) syncShopVideo(true);
    });
    shopImage.addEventListener('mouseleave', () => syncShopVideo(false));
  }

  if (isBelesShop && shopVideo instanceof HTMLVideoElement && !prefersReduced) {
    scheduleShopVideoPrime();
  }

  if (shopVideo instanceof HTMLVideoElement && prefersReduced) {
    shopVideo.pause();
    resetShopVideoToStart();
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
})();
