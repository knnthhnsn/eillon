(function () {
  if (!window.__EILLON_ANALYTICS_BOOT__) {
    window.__EILLON_ANALYTICS_BOOT__ = true;
    window.va = window.va || function va() { (window.vaq = window.vaq || []).push(arguments); };
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const appendScript = (src) => {
      const el = document.createElement('script');
      el.src = src;
      el.defer = true;
      document.head.appendChild(el);
    };
    appendScript('/scripts/analytics.js?v=1');
    var loadShaders = function () {
      appendScript('/scripts/site-shaders.js?v=53');
    };
    var shaderTargets = document.querySelectorAll('.mv-shader, .mv-house, .mv-land, .mv-shader-band');
    if (document.body.dataset.navHome === 'true' && shaderTargets.length && 'IntersectionObserver' in window) {
      var shadersLoaded = false;
      var loadOnce = function () {
        if (shadersLoaded) return;
        shadersLoaded = true;
        observer.disconnect();
        loadShaders();
      };
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) loadOnce();
      }, { rootMargin: '180px 0px' });
      shaderTargets.forEach(function (target) { observer.observe(target); });
    } else if (document.readyState === 'complete') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadShaders, { timeout: 3000 });
      } else {
        setTimeout(loadShaders, 1500);
      }
    } else {
      window.addEventListener('load', function onLoad() {
        window.removeEventListener('load', onLoad);
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadShaders, { timeout: 3000 });
        } else {
          setTimeout(loadShaders, 1500);
        }
      });
    }
    if (!isLocal) {
      appendScript('/_vercel/insights/script.js');
      appendScript('/_vercel/speed-insights/script.js');
    }
  }

  const body = document.body;
  const isHome = body.dataset.navHome === 'true';
  const current = body.dataset.navCurrent || '';
  const waitlistHref = body.dataset.navWaitlist || '/beles#waitlist';
  const homeHref = isHome ? '#top' : '/';
  const sectionHref = (hash) => (isHome ? hash : `/${hash}`);

  const links = [
    { id: 'maison', href: sectionHref('#maison'), label: 'Maison', i18n: 'nav.maison' },
    { id: 'about', href: '/about', label: 'About', i18n: 'nav.about' },
    { id: 'collection', href: sectionHref('#collection'), label: 'Collection', i18n: 'nav.collection' },
    { id: 'palette', href: sectionHref('#palette'), label: 'Palette', i18n: 'nav.palette' },
    { id: 'boutique', href: '/store', label: 'Boutique', i18n: 'nav.boutique' },
  ];

  const currentAttr = (id) => (current === id ? ' aria-current="page"' : '');

  const navLinks = links
    .map((link) => `<a href="${link.href}" data-i18n="${link.i18n}"${currentAttr(link.id)}>${link.label}</a>`)
    .join('\n        ');

  const mobileLinks = links
    .map((link) => `<a href="${link.href}" data-menu-link data-i18n="${link.i18n}"${currentAttr(link.id)}>${link.label}</a>`)
    .join('\n      ');

  const shellHtml = `
  <header class="nav" id="nav">
    <div class="nav__inner">
      <a href="${homeHref}" class="nav__brand" aria-label="EILLON home">
        <picture>
          <source type="image/webp" srcset="/images/eillon_logo_nav.webp" />
          <img class="nav__brand-logo" src="/images/eillon_logo_transparent.png" width="200" height="64" alt="EILLON" decoding="async" fetchpriority="low" />
        </picture>
      </a>

      <nav class="nav__links" aria-label="Primary">
        ${navLinks}
      </nav>

      <div class="nav__actions">
        <button class="nav__story" type="button" data-maison-story-open aria-haspopup="dialog">Our story</button>
        <button class="nav__menu" type="button" aria-label="Menu" data-i18n-aria="nav.menu" aria-controls="mobileNav" aria-expanded="false" id="menuToggle">
          <span></span>
          <span></span>
        </button>
        <button class="nav__icon" type="button" aria-label="Search" data-i18n-aria="nav.search" aria-controls="searchPanel" aria-expanded="false" id="searchToggle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="20" y1="20" x2="16" y2="16"></line>
          </svg>
        </button>
        <a class="nav__waitlist" href="${waitlistHref}" data-i18n="nav.restock">Restock</a>
      </div>
    </div>
  </header>

  <div class="mobile-nav" id="mobileNav" aria-hidden="true" inert>
    <button class="mobile-nav__backdrop" type="button" tabindex="-1" data-menu-close aria-label="Close menu"></button>
    <div class="mobile-nav__panel">
      ${mobileLinks}
      <button type="button" class="mobile-nav__story" data-maison-story-open data-i18n="nav.story">Our story</button>
    </div>
  </div>

  <div class="search-panel" id="searchPanel" role="dialog" aria-modal="true" aria-labelledby="searchTitle" aria-hidden="true" inert>
    <button class="search-panel__backdrop" type="button" tabindex="-1" data-search-close aria-label="Close search"></button>
    <div class="search-panel__surface">
      <div class="search-panel__head">
        <p class="eyebrow" id="searchTitle">Find a detail</p>
        <button class="search-panel__close" type="button" data-search-close aria-label="Close search">Close</button>
      </div>
      <label class="search-panel__field">
        <span class="sr-only">Search the site</span>
        <input type="search" id="siteSearch" placeholder="Try palette, bottle, boutique..." autocomplete="off" />
      </label>
      <div class="search-panel__results" id="searchResults" aria-live="polite">
        <a href="${sectionHref('#palette')}" data-search-item data-search-keywords="palette maison scent worlds desert fruit rain stone red sea citrus resin">
          <span>Maison Palette</span>
          <small>The scent worlds of EILLON</small>
        </a>
        <a href="/beles#composition" data-search-item data-search-keywords="beles fico d'india composition prickly pear cactus water hibiscus">
          <span>Beles composition</span>
          <small>Full note pyramid on the product page</small>
        </a>
        <a href="/prickly-pear-parfum" data-search-item data-search-keywords="prickly pear parfum perfume cactus water skin scent niche fico d'india">
          <span>Prickly pear parfum</span>
          <small>Discovery guide — Beles · Fico d'India</small>
        </a>
        <a href="/skin-scent-parfum" data-search-item data-search-keywords="skin scent close wearing intimate parfum oil-rich niche copenhagen beles">
          <span>Skin scent parfum</span>
          <small>Close-wearing oil-rich fragrance guide</small>
        </a>
        <a href="${sectionHref('#craft')}" data-search-item data-search-keywords="bottle flacon cap square matte glass emblem leopard lettering">
          <span>The Bottle</span>
          <small>Object details and materials</small>
        </a>
        <a href="/beles" data-search-item data-search-keywords="beles fico d'india parfum oil prickly pear product waitlist">
          <span>Beles · Fico d'India</span>
          <small>Oil-rich parfum — full product page</small>
        </a>
        <a href="/asmara" data-search-item data-search-keywords="asmara rain on stone in development chapter">
          <span>Asmara · Rain on Stone</span>
          <small>Chapter II — in development</small>
        </a>
        <a href="/massawa" data-search-item data-search-keywords="massawa red sea citrus in development chapter">
          <span>Massawa · Red Sea Citrus</span>
          <small>Chapter III — in development</small>
        </a>
        <a href="/ritual" data-search-item data-search-keywords="ritual frankincense myrrh lab studio archive">
          <span>Ritual · Frankincense & Myrrh</span>
          <small>Studio archive — lab study</small>
        </a>
        <a href="/journal" data-search-item data-search-keywords="journal editorial fico d'india bottle article">
          <span>Journal</span>
          <small>Studio notes and articles</small>
        </a>
        <a href="/store" data-search-item data-search-keywords="store boutique collection beles asmara massawa ritual chapters">
          <span>The Boutique</span>
          <small>All fragrance chapters</small>
        </a>
        <a href="${waitlistHref}" data-search-item data-search-keywords="restock beles fico d'india awaiting release join list">
          <span>Beles restock list</span>
          <small>Awaiting next release</small>
        </a>
        <a href="/wear" data-search-item data-search-keywords="wear application pulse points spray skin hair scarf storage layering season mood fragrance care guide">
          <span>Fragrance care guide</span>
          <small>Apply, store, layer, and choose a scent</small>
        </a>
        <a href="${sectionHref('#stockists')}" data-search-item data-search-keywords="stockist studio appointment copenhagen private visit store">
          <span>Appointments</span>
          <small>Copenhagen studio and stockists</small>
        </a>
        <a href="/about" data-search-item data-search-keywords="about eillon maison story ethos copenhagen founder history origin">
          <span>About EILLON</span>
          <small>Maison story and ethos</small>
        </a>
        <a href="/craftsmanship" data-search-item data-search-keywords="craftsmanship production sourcing sustainability manufacturing ingredients natural synthetic copenhagen">
          <span>Craftsmanship</span>
          <small>How EILLON parfums are made</small>
        </a>
        <a href="/shipping" data-search-item data-search-keywords="shipping returns delivery EU regions 30 days">
          <span>Shipping &amp; returns</span>
          <small>Delivery and return policy</small>
        </a>
        <a href="${sectionHref('#maison')}" data-search-item data-search-keywords="maison story eillon red sea memory afro mediterranean copenhagen">
          <span>The Maison</span>
          <small>EILLON universe and story</small>
        </a>
      </div>
      <p class="search-panel__empty" id="searchEmpty" hidden>No matching section yet.</p>
    </div>
  </div>`;

  const maisonModalHtml = `
  <div class="maison-modal" id="maisonModal" role="dialog" aria-modal="true" aria-labelledby="maisonModalTitle" aria-hidden="true" inert>
    <button class="maison-modal__backdrop" type="button" tabindex="-1" data-maison-story-close aria-label="Close maison story"></button>
    <div class="maison-modal__surface">
      <div class="maison-modal__head">
        <p class="eyebrow" id="maisonModalTitle">The Maison</p>
        <button class="maison-modal__close" type="button" data-maison-story-close aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="maison-modal__body">
        <h2 class="display maison-modal__title">Perfume from <em>place, memory &amp; skin.</em></h2>
        <p>
          EILLON is an independent perfume house in Copenhagen — composing intimate, genderless parfums from Afro-Mediterranean memory. Red Sea air, desert fruit at high noon, rain on old city stone, café spice, sacred resin, and warm skin held close.
        </p>
        <p>
          Each fragrance is a chapter. Beles begins with prickly pear. Asmara follows rain on stone. Massawa turns toward the coast. Ritual studies frankincense in the lab. Formulas and objects are developed together — never rushed.
        </p>
        <ul class="maison-modal__ethos">
          <li>Oil-rich parfums worn close — unfolding slowly on skin.</li>
          <li>Genderless compositions built from place, not trend.</li>
          <li>Transparent release windows through restock notes and letters.</li>
          <li>Hand-finished in Copenhagen in small batches.</li>
        </ul>
        <div class="maison-modal__links">
          <a href="/about" class="btn btn--ghost">Full maison story <span class="arrow">→</span></a>
          <a href="/craftsmanship" class="link-arrow"><span>Craftsmanship</span><span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </div>`;

  const anchor = document.querySelector('.skip-link') || body.firstElementChild;
  const insertAfterAnchor = (html) => {
    if (anchor) anchor.insertAdjacentHTML('afterend', html);
    else body.insertAdjacentHTML('afterbegin', html);
  };

  if (!document.getElementById('nav')) {
    insertAfterAnchor(shellHtml);
  }

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let maisonReturnFocus = null;
  let maisonModal = null;

  const syncPageLock = () => {
    const modal = document.getElementById('maisonModal');
    const locked =
      document.getElementById('searchPanel')?.classList.contains('is-open') ||
      document.getElementById('mobileNav')?.classList.contains('is-open') ||
      modal?.classList.contains('is-open');
    document.body.style.overflow = locked ? 'hidden' : '';
  };

  const closeOtherOverlays = () => {
    const mobileNav = document.getElementById('mobileNav');
    const menuToggle = document.getElementById('menuToggle');
    if (mobileNav?.classList.contains('is-open')) {
      menuToggle?.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileNav.inert = true;
    }

    const searchPanel = document.getElementById('searchPanel');
    const searchToggle = document.getElementById('searchToggle');
    if (searchPanel?.classList.contains('is-open')) {
      searchPanel.classList.remove('is-open');
      searchPanel.setAttribute('aria-hidden', 'true');
      searchPanel.inert = true;
      searchToggle?.setAttribute('aria-expanded', 'false');
    }
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

  const openMaisonModal = (trigger) => {
    if (!maisonModal) return;
    closeOtherOverlays();
    maisonReturnFocus = trigger || document.activeElement;
    maisonModal.classList.add('is-open');
    maisonModal.setAttribute('aria-hidden', 'false');
    maisonModal.inert = false;
    syncPageLock();
    const closeBtn = maisonModal.querySelector('[data-maison-story-close]:not(.maison-modal__backdrop)');
    setTimeout(() => (closeBtn || maisonModal).focus(), 80);
    if (window.EILLON_I18N) window.EILLON_I18N.applyLang(window.EILLON_I18N.getLang());
  };

  const closeMaisonModal = ({ restoreFocus = true } = {}) => {
    if (!maisonModal) return;
    maisonModal.classList.remove('is-open');
    maisonModal.setAttribute('aria-hidden', 'true');
    maisonModal.inert = true;
    syncPageLock();
    if (restoreFocus && maisonReturnFocus && typeof maisonReturnFocus.focus === 'function') {
      maisonReturnFocus.focus();
    }
  };

  const bindMaisonModal = () => {
    if (!document.getElementById('maisonModal')) {
      body.insertAdjacentHTML('beforeend', maisonModalHtml);
    }
    maisonModal = document.getElementById('maisonModal');
    if (!maisonModal || maisonModal.dataset.bound === 'true') return;
    maisonModal.dataset.bound = 'true';

    closeMaisonModal({ restoreFocus: false });

    maisonModal.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => closeMaisonModal({ restoreFocus: false }));
    });
  };

  const mountMaisonModal = () => bindMaisonModal();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMaisonModal);
  } else {
    mountMaisonModal();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-maison-story-open]');
    if (opener) {
      e.preventDefault();
      bindMaisonModal();
      openMaisonModal(opener);
      return;
    }
    if (e.target.closest('[data-maison-story-close]')) {
      closeMaisonModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!maisonModal?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeMaisonModal();
    keepFocusInside(maisonModal, e);
  });

  window.addEventListener('pageshow', () => {
    bindMaisonModal();
    closeMaisonModal({ restoreFocus: false });
    document.body.style.overflow = '';
  });

  window.EILLON_MAISON_MODAL = {
    open: (trigger) => {
      bindMaisonModal();
      openMaisonModal(trigger);
    },
    close: closeMaisonModal,
  };

  const editorialFooterHtml = `
  <footer class="footer" data-footer-upgraded="true">
    <div class="footer__top">
      <div class="footer__news">
        <span class="sx-eyebrow">The Letter</span>
        <h3 class="footer__news-title">News from EILLON,<br />sent slowly.</h3>
        <form class="footer__form" data-waitlist-form data-product-slug="all" data-source="footer" novalidate>
          <input type="email" name="email" placeholder="Your email" aria-label="Email address" autocomplete="email" required />
          <input type="text" name="website" class="shop__honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button type="submit">Subscribe <span class="arrow">→</span></button>
        </form>
        <p class="footer__promise">Seasonal letters only: studio notes, restock windows, and private appointment openings.</p>
        <p class="footer__status" aria-live="polite"></p>
        <div class="footer__visit" id="studio">
          <span class="footer__visit-label">Copenhagen studio</span>
          <p>EILLON — 1050 Copenhagen, Denmark</p>
          <p>Private fragrance appointments, Thursday to Saturday, 12–18.</p>
          <a href="mailto:care@eillon.maison?subject=Beles%20studio%20appointment" data-analytics-event="studio_appointment_click" data-analytics-label="footer">Request an appointment <span class="arrow">→</span></a>
        </div>
      </div>
      <div class="footer__cols">
        <div>
          <h4>Maison</h4>
          <ul>
            <li><a href="/about">About EILLON</a></li>
            <li><a href="/craftsmanship">Craftsmanship</a></li>
            <li><a href="/journal">Editorial Journal</a></li>
            <li><a href="/store">The Boutique</a></li>
          </ul>
        </div>
        <div>
          <h4>Boutique</h4>
          <ul>
            <li><a href="/beles">Beles · Fico d'India</a></li>
            <li><a href="/store">All chapters</a></li>
            <li><a href="${waitlistHref}">Restock list</a></li>
          </ul>
        </div>
        <div>
          <h4>Care</h4>
          <ul>
            <li><a href="mailto:care@eillon.maison">Contact</a></li>
            <li><a href="/wear">Fragrance care guide</a></li>
            <li><a href="/shipping">Shipping &amp; returns</a></li>
            <li><a href="/beles#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li><a href="https://www.instagram.com/eillon" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.pinterest.com/eillon" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
            <li><a href="https://open.spotify.com/search/EILLON%20beles" target="_blank" rel="noopener noreferrer">Spotify</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer__brand" aria-hidden="true">
      <picture>
        <source type="image/webp" srcset="/images/eillon_logo_veil.webp" />
        <img src="/images/eillon_logo_transparent.png" width="640" height="200" alt="" loading="lazy" decoding="async" />
      </picture>
    </div>
    <div class="footer__legal">
      <span>© EILLON — Copenhagen</span>
      <span class="footer__legal-links">
        <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/imprint">Imprint</a>
      </span>
    </div>
  </footer>`;

  const mountEditorialFooter = () => {
    if (isHome || !body.classList.contains('editorial-page')) return;
    const legacy = document.querySelector('footer.editorial-page__footer');
    if (!legacy || legacy.dataset.upgraded === 'true') return;
    legacy.outerHTML = editorialFooterHtml;
  };

  const finishNav = () => {
    mountEditorialFooter();
    document.dispatchEvent(new CustomEvent('eillon:nav-ready'));
    if (typeof window.__EILLON_MOUNT_SHADERS__ === 'function') {
      window.__EILLON_MOUNT_SHADERS__();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finishNav);
  } else {
    finishNav();
  }
})();
