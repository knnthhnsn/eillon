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
