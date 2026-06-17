(function () {
  if (document.getElementById('nav')) return;

  const body = document.body;
  const isHome = body.dataset.navHome === 'true';
  const current = body.dataset.navCurrent || '';
  const waitlistHref = body.dataset.navWaitlist || '/beles#waitlist';
  const homeHref = isHome ? '#top' : '/';
  const sectionHref = (hash) => (isHome ? hash : `/${hash}`);

  const links = [
    { id: 'maison', href: sectionHref('#maison'), label: 'Maison' },
    { id: 'collection', href: sectionHref('#collection'), label: 'Collection' },
    { id: 'palette', href: sectionHref('#palette'), label: 'Palette' },
    { id: 'boutique', href: '/store', label: 'Boutique' },
  ];

  const currentAttr = (id) => (current === id ? ' aria-current="page"' : '');

  const navLinks = links
    .map((link) => `<a href="${link.href}"${currentAttr(link.id)}>${link.label}</a>`)
    .join('\n        ');

  const mobileLinks = links
    .map((link) => `<a href="${link.href}" data-menu-link${currentAttr(link.id)}>${link.label}</a>`)
    .join('\n      ');

  const html = `
  <header class="nav is-scrolled" id="nav">
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
        <button class="nav__menu" type="button" aria-label="Menu" aria-controls="mobileNav" aria-expanded="false" id="menuToggle">
          <span></span>
          <span></span>
        </button>
        <button class="nav__icon" type="button" aria-label="Search" aria-controls="searchPanel" aria-expanded="false" id="searchToggle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="20" y1="20" x2="16" y2="16"></line>
          </svg>
        </button>
        <a class="nav__waitlist" href="${waitlistHref}">Waitlist</a>
      </div>
    </div>
  </header>

  <div class="mobile-nav" id="mobileNav" aria-hidden="true" inert>
    <button class="mobile-nav__backdrop" type="button" tabindex="-1" data-menu-close aria-label="Close menu"></button>
    <div class="mobile-nav__panel">
      ${mobileLinks}
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
        <a href="${sectionHref('#craft')}" data-search-item data-search-keywords="bottle flacon cap square matte glass emblem leopard lettering">
          <span>The Bottle</span>
          <small>Object details and materials</small>
        </a>
        <a href="/beles" data-search-item data-search-keywords="beles fico d'india parfum oil prickly pear product waitlist">
          <span>Beles · Fico d'India</span>
          <small>Oil-rich parfum — full product page</small>
        </a>
        <a href="/asmara" data-search-item data-search-keywords="asmara rain on stone espresso cardamom jasmine amber chapter">
          <span>Asmara · Rain on Stone</span>
          <small>Chapter II — in production</small>
        </a>
        <a href="/massawa" data-search-item data-search-keywords="massawa red sea citrus orange papaya marine chapter">
          <span>Massawa · Red Sea Citrus</span>
          <small>Chapter III — coming soon</small>
        </a>
        <a href="/ritual" data-search-item data-search-keywords="ritual frankincense myrrh resin lab study incense">
          <span>Ritual · Frankincense & Myrrh</span>
          <small>Lab study — studio archive</small>
        </a>
        <a href="/journal" data-search-item data-search-keywords="journal editorial fico d'india bottle article">
          <span>Journal</span>
          <small>Studio notes and articles</small>
        </a>
        <a href="/store" data-search-item data-search-keywords="store boutique collection beles asmara massawa ritual chapters">
          <span>The Boutique</span>
          <small>All fragrance chapters</small>
        </a>
        <a href="${waitlistHref}" data-search-item data-search-keywords="waitlist beles fico d'india priority access release">
          <span>Beles waitlist</span>
          <small>Priority access at first release</small>
        </a>
        <a href="${sectionHref('#wear')}" data-search-item data-search-keywords="wear application pulse points spray skin hair scarf how to apply parfum">
          <span>Wear</span>
          <small>How to apply EILLON parfum</small>
        </a>
        <a href="${sectionHref('#maison')}" data-search-item data-search-keywords="maison story eillon red sea memory afro mediterranean copenhagen">
          <span>The Maison</span>
          <small>EILLON universe and story</small>
        </a>
      </div>
      <p class="search-panel__empty" id="searchEmpty" hidden>No matching section yet.</p>
    </div>
  </div>`;

  const anchor = document.querySelector('.skip-link') || body.firstElementChild;
  if (anchor) anchor.insertAdjacentHTML('afterend', html);
  else body.insertAdjacentHTML('afterbegin', html);
})();
