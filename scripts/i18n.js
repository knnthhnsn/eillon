(function () {
  const STORAGE_KEY = 'eillon-lang';
  const DEFAULT = 'en';
  const LANGS = ['en', 'da', 'sv'];

  const labels = {
    en: {
      'nav.maison': 'Maison',
      'nav.about': 'About',
      'nav.collection': 'Collection',
      'nav.palette': 'Palette',
      'nav.boutique': 'Boutique',
      'nav.restock': 'Restock',
      'nav.preorder': 'Restock',
      'nav.story': 'Our story',
      'nav.search': 'Search',
      'nav.menu': 'Menu',
      'lang.toggle': 'Language',
      'chapter.all': 'All chapters',
      'wear.guide': 'Fragrance care guide',
    },
    da: {
      'nav.maison': 'Maison',
      'nav.about': 'Om os',
      'nav.collection': 'Kollektion',
      'nav.palette': 'Palette',
      'nav.boutique': 'Boutique',
      'nav.restock': 'Genopfyldning',
      'nav.preorder': 'På lager igen',
      'nav.story': 'Vores historie',
      'nav.search': 'Søg',
      'nav.menu': 'Menu',
      'lang.toggle': 'Sprog',
      'chapter.all': 'Alle kapitler',
      'wear.guide': 'Guide til parfumepleje',
    },
    sv: {
      'nav.maison': 'Maison',
      'nav.about': 'Om oss',
      'nav.collection': 'Kollektion',
      'nav.palette': 'Palett',
      'nav.boutique': 'Boutique',
      'nav.restock': 'Åter i lager',
      'nav.preorder': 'Åter i lager',
      'nav.story': 'Vår historia',
      'nav.search': 'Sök',
      'nav.menu': 'Meny',
      'lang.toggle': 'Språk',
      'chapter.all': 'Alla kapitel',
      'wear.guide': 'Guide till parfymvård',
    },
  };

  const getLang = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return LANGS.includes(stored) ? stored : DEFAULT;
    } catch {
      return DEFAULT;
    }
  };

  const applyLang = (lang) => {
    const active = LANGS.includes(lang) ? lang : DEFAULT;
    const dict = labels[active] || labels.en;
    document.documentElement.lang = active;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });
    document.querySelectorAll('[data-lang-block]').forEach((el) => {
      const show = el.dataset.langBlock === active;
      el.hidden = !show;
      el.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      const isActive = btn.dataset.langToggle === active;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const setLang = (lang) => {
    const next = LANGS.includes(lang) ? lang : DEFAULT;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyLang(next);
  };

  window.EILLON_I18N = { getLang, setLang, applyLang };

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.langToggle));
    });
  });
})();
