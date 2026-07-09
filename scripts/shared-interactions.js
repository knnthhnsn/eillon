/* EILLON shared-interactions — product grid, bottle explorer, is-loaded */
(() => {
  'use strict';
  if (document.body.dataset.navHome !== 'true') {
    document.body.classList.add('is-loaded');
  }
  if (window.EILLON?.__SHARED_INTERACTIONS_BOOTED__) return;
  if (window.EILLON) window.EILLON.__SHARED_INTERACTIONS_BOOTED__ = true;

  const E = window.EILLON || {};
  const prefersReduced = E.prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playVideoSafe = E.playVideoSafe || (() => {});
  /* ---------- 10. PRODUCT GRID RENDER ---------- */
  const isOutOfStock = (product) => (
    ['awaiting-next-release', 'in-development', 'studio-archive', 'out-of-stock', 'waitlist-open'].includes(product.status)
  );

  const STATUS_CLASS = {
    'awaiting-next-release': 'product-card__status--out-of-stock',
    'in-development': 'product-card__status--out-of-stock',
    'studio-archive': 'product-card__status--out-of-stock',
    'out-of-stock': 'product-card__status--out-of-stock',
    'waitlist-open': 'product-card__status--out-of-stock',
    'in-production': 'product-card__status--out-of-stock',
    'coming-soon': 'product-card__status--out-of-stock',
    'concept-lab': 'product-card__status--out-of-stock',
  };

  const getStockHint = (product) => {
    if (product.slug === 'ritual') return 'Lab study — follow for notes';
    if (product.status === 'in-development') return 'Future chapter — in development';
    if (product.status === 'awaiting-next-release') return 'Join the restock list';
    return 'Notify when back in stock';
  };

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

  const IMAGE_CACHE_BUST = '5';

  const appendLazyImage = (img, src, alt) => {
    const busted = src && !/\?/.test(src) ? `${src}?v=${IMAGE_CACHE_BUST}` : src;
    img.src = busted;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
  };

  const CHAPTER_SIGNUP_SLUGS = new Set(['beles', 'oliva', 'asmara', 'massawa', 'petricor', 'ritual']);

  const getChapterSignupHref = (slug) => `/${slug}#waitlist`;

  const getOverviewCardHref = (product) => {
    if (CHAPTER_SIGNUP_SLUGS.has(product.slug)) {
      return getChapterSignupHref(product.slug);
    }
    return product.url || '/store';
  };

  const buildFlaconMedia = (product) => {
    const media = document.createElement('div');
    media.className = 'product-card__media product-card__media--flacon';

    const img = document.createElement('img');
    img.className = 'product-card__flacon';
    appendLazyImage(img, product.image, `EILLON ${product.name} · ${product.subtitle} flacon`);

    media.appendChild(img);
    return media;
  };

  const formatShopPrice = (product) => {
    const priced = product.formats?.filter((f) => typeof f.price === 'number');
    if (!priced?.length) return null;
    const max = Math.max(...priced.map((f) => f.price));
    return `€${max}`;
  };

  const createShopProductCard = (product) => {
    const card = document.createElement('a');
    card.className = `product-card product-card--shop chapter-shader-band chapter-shader-band--${product.slug} product-card--link`;
    card.id = `card-${product.slug}`;
    card.href = product.url || `/${product.slug}`;

    card.appendChild(buildFlaconMedia(product));

    const body = document.createElement('div');
    body.className = 'product-card__shop-body';

    const title = document.createElement('h3');
    title.className = 'product-card__shop-title';
    title.textContent = product.name;

    const subtitle = document.createElement('p');
    subtitle.className = 'product-card__shop-subtitle';
    subtitle.textContent = product.subtitle;

    const meta = document.createElement('div');
    meta.className = 'product-card__shop-meta';

    const price = formatShopPrice(product);
    if (price) {
      const priceEl = document.createElement('span');
      priceEl.className = 'product-card__shop-price';
      priceEl.textContent = price;
      meta.appendChild(priceEl);
    } else {
      const status = document.createElement('span');
      status.className = `product-card__shop-status product-card__shop-status--${product.status}`;
      status.textContent = product.statusLabel;
      meta.appendChild(status);
    }

    body.append(title, subtitle, meta);
    card.appendChild(body);
    return card;
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

      if (isOutOfStock(product) && !cardIsLink) {
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

      card.appendChild(buildProductCardMedia(product, true));
      card.appendChild(buildStoreCardCaption(product));
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
      if (container.dataset.rendered === 'true') return;
      container.dataset.rendered = 'true';
      container.classList.add('product-grid', 'product-grid--collection', 'product-grid--preview');
      getProductsForContainer(container, products).forEach((product) => {
        container.appendChild(createProductCard(product, 'preview'));
      });
    });

    document.querySelectorAll('[data-product-grid]').forEach((container) => {
      if (container.dataset.rendered === 'true') return;
      container.dataset.rendered = 'true';
      const mode = container.dataset.productGridMode || 'store';

      if (mode === 'shop') {
        container.classList.add('product-grid--shop');
        products.forEach((product) => {
          container.appendChild(createShopProductCard(product));
        });
        document.dispatchEvent(new Event('eillon:shop-grid-ready'));
        const mountShopShaders = () => {
          if (typeof window.__EILLON_MOUNT_SHADERS__ === 'function') {
            window.__EILLON_MOUNT_SHADERS__();
            return true;
          }
          return false;
        };
        if (!mountShopShaders()) {
          let tries = 0;
          const timer = setInterval(() => {
            if (mountShopShaders() || ++tries > 24) clearInterval(timer);
          }, 250);
        }
        return;
      }

      container.classList.add('product-grid--collection', 'product-grid--boutique');
      products.forEach((product) => {
        container.appendChild(createProductCard(product, mode));
      });
      container.querySelectorAll('[data-waitlist-form]').forEach(setupWaitlistForm);
    });
  };

  const mountProductGrids = () => {
    const targets = document.querySelectorAll('[data-product-preview], [data-product-grid]');
    if (!targets.length) return;

    const boot = () => {
      if (!Array.isArray(window.EILLON_PRODUCTS)) return false;
      renderProductGrids();
      initCardSceneVideos();
      return true;
    };

    if (boot()) return;

    const onProducts = () => {
      if (boot()) document.removeEventListener('eillon:products-ready', onProducts);
    };
    document.addEventListener('eillon:products-ready', onProducts);

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        boot();
      });
    }, { rootMargin: '240px 0px', threshold: 0.01 });

    targets.forEach((target) => observer.observe(target));
  };

  mountProductGrids();

  /* ---------- MAISON STORY MODAL ---------- */
  /* Wired in /scripts/site-nav.js — keeps modal markup and handlers in sync. */

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
