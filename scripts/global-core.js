/* EILLON global-core — shared helpers, no pre-LCP DOM work */
(() => {
  'use strict';
  const E = window.EILLON = window.EILLON || {};
  E.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  E.finePointer = window.matchMedia('(pointer: fine)').matches;
  E.mobileLayout = window.matchMedia('(max-width: 900px)');
  E.isLocalDev = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  E.saveData = navigator.connection?.saveData === true;
  E.readScrollY = () => window.scrollY || window.pageYOffset || 0;
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

  const lazyVideoSources = new WeakSet();

  const ensureLazyVideoSource = (video) => {
    if (!(video instanceof HTMLVideoElement)) return false;
    if (lazyVideoSources.has(video)) return true;

    const mp4 = video.dataset.src || video.dataset.mp4;
    if (!mp4) return Boolean(video.querySelector('source') || video.getAttribute('src'));

    addVideoSource(video, mp4, 'video/mp4');
    lazyVideoSources.add(video);
    return true;
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
  E.isIOS = isIOS;
  E.canPlayWebmVp9 = canPlayWebmVp9;
  E.needsFlatVideoFallback = needsFlatVideoFallback;
  E.addVideoSource = addVideoSource;
  E.ensureLazyVideoSource = ensureLazyVideoSource;
  E.configureBottleVideo = configureBottleVideo;
  E.playVideoSafe = playVideoSafe;
})();
