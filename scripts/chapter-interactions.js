/* EILLON chapter-interactions — chapter video + status sync */
(() => {
  'use strict';
  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileLayout = E.mobileLayout ?? window.matchMedia('(max-width: 900px)');
  const configureBottleVideo = E.configureBottleVideo || (() => ({ mode: 'none' }));
  const playVideoSafe = E.playVideoSafe || (() => {});
  const ensureLazyVideoSource = E.ensureLazyVideoSource || (() => false);
  const saveData = E.saveData ?? navigator.connection?.saveData === true;

  /* ---------- SCENT ARCHITECTURE: autonomous composition field ---------- */
  const scentAssetSlug = (note) => String(note || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const scentArchitecturePositions = [
    { x: '10%', y: '17%', size: 'clamp(88px, 10vw, 148px)', duration: '18s', delay: '-7s', path: 'a' },
    { x: '49%', y: '13%', size: 'clamp(94px, 11vw, 164px)', duration: '23s', delay: '-16s', path: 'b' },
    { x: '88%', y: '20%', size: 'clamp(82px, 9vw, 136px)', duration: '20s', delay: '-11s', path: 'c' },
    { x: '17%', y: '50%', size: 'clamp(96px, 12vw, 174px)', duration: '24s', delay: '-18s', path: 'c' },
    { x: '52%', y: '48%', size: 'clamp(108px, 13vw, 190px)', duration: '19s', delay: '-5s', path: 'a' },
    { x: '83%', y: '52%', size: 'clamp(90px, 10vw, 154px)', duration: '22s', delay: '-14s', path: 'b' },
    { x: '11%', y: '82%', size: 'clamp(84px, 10vw, 144px)', duration: '21s', delay: '-9s', path: 'b' },
    { x: '47%', y: '84%', size: 'clamp(100px, 12vw, 178px)', duration: '25s', delay: '-20s', path: 'c' },
    { x: '89%', y: '80%', size: 'clamp(92px, 11vw, 160px)', duration: '20s', delay: '-3s', path: 'a' },
  ];

  const mountScentArchitecture = () => {
    const stage = document.querySelector('[data-scent-architecture]');
    const chapterSlug = document.body.dataset.chapterSlug;
    const products = window.EILLON_PRODUCTS;
    if (!stage || !chapterSlug || !Array.isArray(products)) return false;
    if (stage.dataset.mounted === 'true') return true;

    const product = products.find((item) => item.slug === chapterSlug);
    if (!product?.notes) return false;
    stage.dataset.mounted = 'true';

    const fragment = document.createDocumentFragment();
    const frame = document.createElement('span');
    frame.className = 'scent-architecture__frame';
    const spine = document.createElement('span');
    spine.className = 'scent-architecture__spine';
    const scan = document.createElement('span');
    scan.className = 'scent-architecture__scan';
    fragment.append(frame, spine, scan);

    const groups = [
      ['top', product.notes.top],
      ['heart', product.notes.heart],
      ['base', product.notes.base],
    ];

    let assetIndex = 0;
    groups.forEach(([groupName, notes], groupIndex) => {
      const rail = document.createElement('span');
      rail.className = `scent-architecture__rail scent-architecture__rail--${groupName}`;
      rail.dataset.register = `0${groupIndex + 1}`;
      fragment.appendChild(rail);

      (notes || []).forEach((note) => {
        const position = scentArchitecturePositions[assetIndex];
        if (!position) return;

        const asset = document.createElement('span');
        asset.className = `scent-architecture__asset scent-architecture__asset--${position.path}`;
        asset.dataset.group = groupName;
        asset.style.setProperty('--asset-x', position.x);
        asset.style.setProperty('--asset-y', position.y);
        asset.style.setProperty('--asset-size', position.size);
        asset.style.setProperty('--asset-duration', position.duration);
        asset.style.setProperty('--asset-delay', position.delay);

        const image = document.createElement('img');
        image.width = 224;
        image.height = 224;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.fetchPriority = 'low';
        image.draggable = false;
        image.dataset.src = `/images/store/notes/${chapterSlug}/${scentAssetSlug(note)}-224.webp`;
        image.addEventListener('error', () => asset.remove(), { once: true });

        asset.appendChild(image);
        fragment.appendChild(asset);
        assetIndex += 1;
      });
    });

    stage.appendChild(fragment);

    let assetsLoaded = false;
    let stageInView = false;
    const loadAssets = () => {
      if (assetsLoaded) return;
      assetsLoaded = true;
      stage.querySelectorAll('img[data-src]').forEach((image) => {
        image.src = image.dataset.src;
        delete image.dataset.src;
      });
    };
    const syncMotion = () => {
      stage.classList.toggle('is-active', stageInView && !document.hidden && !prefersReduced);
    };

    if (prefersReduced) {
      stage.classList.add('is-reduced');
      loadAssets();
      return true;
    }

    if (!('IntersectionObserver' in window)) {
      loadAssets();
      stageInView = true;
      syncMotion();
      return true;
    }

    const assetObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;
        loadAssets();
        observer.disconnect();
      },
      { rootMargin: '600px 0px', threshold: 0.01 }
    );
    const motionObserver = new IntersectionObserver(
      ([entry]) => {
        stageInView = entry.isIntersecting;
        syncMotion();
      },
      { rootMargin: '8% 0px', threshold: 0.08 }
    );

    assetObserver.observe(stage);
    motionObserver.observe(stage);
    document.addEventListener('visibilitychange', syncMotion);
    return true;
  };

  if (!mountScentArchitecture()) {
    document.addEventListener('eillon:products-ready', mountScentArchitecture, { once: true });
  }

  /* ---------- 7b. HERO BOTTLE VIDEO — poster first; video after idle ---------- */
  const scheduleHeroVideo = (fn) => {
    const timeout = mobileLayout.matches ? 8000 : 5000;
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout });
    } else {
      setTimeout(fn, timeout);
    }
  };

  document.querySelectorAll('.hero__bottle').forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;

    const link = video.closest('.hero__bottle-link');
    if (saveData) {
      link?.classList.add('is-static-fallback');
      return;
    }

    let heroVideoStarted = false;

    const revealHeroVideo = () => link?.classList.add('is-video-playing');
    video.addEventListener('loadeddata', revealHeroVideo, { once: true });

    const beginHeroVideo = () => {
      if (heroVideoStarted) return;
      heroVideoStarted = true;

      configureBottleVideo(video);

      video.pause();
      video.currentTime = 0;
      video.removeAttribute('autoplay');

      if (prefersReduced) {
        link?.classList.add('is-static-fallback');
        return;
      }

      video.addEventListener('playing', revealHeroVideo, { once: true });
      playVideoSafe(video);
    };

    const queueHeroVideo = () => scheduleHeroVideo(beginHeroVideo);

    queueHeroVideo();

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
            if (inView) {
              ensureLazyVideoSource(video);
              playVideoSafe(video);
            } else {
              video.pause();
            }
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
            if (inView) {
              ensureLazyVideoSource(video);
              playVideoSafe(video);
            } else {
              video.pause();
            }
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
          if (inView) {
            ensureLazyVideoSource(video);
            playVideoSafe(video);
          }
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

  const applyChapterPageStatus = () => {
    const slug = document.body.dataset.chapterSlug;
    if (!slug || !Array.isArray(window.EILLON_PRODUCTS)) return;
    const product = window.EILLON_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return;

    document.querySelectorAll('.stock-status').forEach((el) => {
      el.textContent = product.statusLabel;
    });

    const submitLabel = document.querySelector('[data-waitlist-form] .btn__label');
    if (submitLabel && product.ctaLabel) submitLabel.textContent = product.ctaLabel;

    const submitHover = document.querySelector('[data-waitlist-form] .btn__hover');
    if (submitHover && product.ctaHover) submitHover.textContent = product.ctaHover;
  };

  document.addEventListener('eillon:products-ready', applyChapterPageStatus);
  applyChapterPageStatus();
})();
