(function () {
  if (document.getElementById('nav')) return;

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
        <div class="nav__lang" role="group" aria-label="Language">
          <button type="button" class="nav__lang-btn is-active" data-lang-toggle="en" aria-pressed="true">EN</button>
          <button type="button" class="nav__lang-btn" data-lang-toggle="da" aria-pressed="false">DA</button>
          <button type="button" class="nav__lang-btn" data-lang-toggle="sv" aria-pressed="false">SV</button>
        </div>
        <button class="nav__story" type="button" data-maison-story-open aria-haspopup="dialog" data-i18n="nav.story">Our story</button>
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
        <a href="${sectionHref('#craft')}" data-search-item data-search-keywords="bottle flacon cap square matte glass emblem leopard lettering">
          <span>The Bottle</span>
          <small>Object details and materials</small>
        </a>
        <a href="/beles" data-search-item data-search-keywords="beles fico d'india parfum oil prickly pear product waitlist">
          <span>Beles · Fico d'India</span>
          <small>Oil-rich parfum — full product page</small>
        </a>
        <a href="/asmara" data-search-item data-search-keywords="asmara rain on stone out of stock chapter">
          <span>Asmara · Rain on Stone</span>
          <small>Chapter II — out of stock</small>
        </a>
        <a href="/massawa" data-search-item data-search-keywords="massawa red sea citrus out of stock chapter">
          <span>Massawa · Red Sea Citrus</span>
          <small>Chapter III — out of stock</small>
        </a>
        <a href="/ritual" data-search-item data-search-keywords="ritual frankincense myrrh lab out of stock">
          <span>Ritual · Frankincense & Myrrh</span>
          <small>Lab study — out of stock</small>
        </a>
        <a href="/journal" data-search-item data-search-keywords="journal editorial fico d'india bottle article">
          <span>Journal</span>
          <small>Studio notes and articles</small>
        </a>
        <a href="/store" data-search-item data-search-keywords="store boutique collection beles asmara massawa ritual chapters">
          <span>The Boutique</span>
          <small>All fragrance chapters</small>
        </a>
        <a href="${waitlistHref}" data-search-item data-search-keywords="restock beles fico d'india out of stock notify back">
          <span>Beles restock list</span>
          <small>Notify when Beles is back in stock</small>
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
        <a href="/shipping" data-search-item data-search-keywords="shipping returns delivery worldwide 30 days">
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
  </div>

  <div class="maison-modal" id="maisonModal" role="dialog" aria-modal="true" aria-labelledby="maisonModalTitle" aria-hidden="true" inert>
    <button class="maison-modal__backdrop" type="button" tabindex="-1" data-maison-story-close aria-label="Close maison story"></button>
    <div class="maison-modal__surface">
      <div class="maison-modal__head">
        <p class="eyebrow" id="maisonModalTitle">The Maison</p>
        <button class="maison-modal__close" type="button" data-maison-story-close aria-label="Close">Close</button>
      </div>
      <div class="maison-modal__body">
        <h2 class="display maison-modal__title">Perfume from <em>place, memory &amp; skin.</em></h2>
        <p data-lang-block="en">
          EILLON is an independent perfume house in Copenhagen — composing intimate, genderless parfums from Afro-Mediterranean memory. Red Sea air, desert fruit at high noon, rain on old city stone, café spice, sacred resin, and warm skin held close.
        </p>
        <p data-lang-block="da" hidden aria-hidden="true">
          EILLON er et uafhængigt parfumehus i København — intim, kønsløs parfume fra afro-middelhavsminner. Røde Havs-luft, ørkenfrugt, regn på gammel bysten, kaffekrydder, hellig harpiks og varm hud tæt på.
        </p>
        <p data-lang-block="sv" hidden aria-hidden="true">
          EILLON är ett oberoende parfymhus i Köpenhamn — intim, könsneutral parfym från afro-medelhavets minnen. Röda havets luft, ökenfrukt i middagshettan, regn på gammal sten, kaffekryddor, helig harts och varm hud nära.
        </p>
        <p data-lang-block="en">
          Each fragrance is a chapter. Beles begins with prickly pear. Asmara follows rain on stone. Massawa turns toward the coast. Ritual studies frankincense in the lab. Formulas and objects are developed together — never rushed.
        </p>
        <p data-lang-block="da" hidden aria-hidden="true">
          Hver duft er et kapitel. Beles begynder med kaktusfigen. Asmara følger regn på sten. Massawa vender mod kysten. Ritual studerer røgelse i laboratoriet. Formler og objekter udvikles sammen — aldrig forhastet.
        </p>
        <p data-lang-block="sv" hidden aria-hidden="true">
          Varje doft är ett kapitel. Beles börjar med kaktusfikon. Asmara följer regn på sten. Massawa vänder sig mot kusten. Ritual studerar rökelse i labbet. Formler och objekt utvecklas tillsammans — aldrig förhastat.
        </p>
        <ul class="maison-modal__ethos" data-lang-block="en">
          <li>Oil-rich parfums worn close — unfolding slowly on skin.</li>
          <li>Genderless compositions built from place, not trend.</li>
          <li>Transparent release windows through waitlist and letters.</li>
          <li>Hand-finished in Copenhagen in small batches.</li>
        </ul>
        <ul class="maison-modal__ethos" data-lang-block="da" hidden aria-hidden="true">
          <li>Olieholdige parfumer tæt på huden — udfolder sig langsomt.</li>
          <li>Kønsløse kompositioner bygget på sted, ikke trend.</li>
          <li>Gennemsigtige release-vinduer via venteliste og breve.</li>
          <li>Håndafsluttet i København i små batches.</li>
        </ul>
        <ul class="maison-modal__ethos" data-lang-block="sv" hidden aria-hidden="true">
          <li>Oljerika parfymer nära huden — utvecklas långsamt.</li>
          <li>Könsneutrala kompositioner byggda på plats, inte trend.</li>
          <li>Transparenta lanseringsfönster via väntelista och brev.</li>
          <li>Handfärdigade i Köpenhamn i små serier.</li>
        </ul>
        <div class="maison-modal__links">
          <a href="/about" class="btn btn--ghost">Full maison story <span class="arrow">→</span></a>
          <a href="/craftsmanship" class="link-arrow"><span>Craftsmanship</span><span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </div>`;

  const anchor = document.querySelector('.skip-link') || body.firstElementChild;
  if (anchor) anchor.insertAdjacentHTML('afterend', html);
  else body.insertAdjacentHTML('afterbegin', html);
})();
