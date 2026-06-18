(function () {
  const slug = document.body.dataset.chapterSlug;
  if (!slug) return;

  const chapters = [
    { slug: 'beles', chapter: 'Chapter I', short: 'Beles', name: "Beles · Fico d'India", url: '/beles' },
    { slug: 'asmara', chapter: 'Chapter II', short: 'Asmara', name: 'Asmara · Rain on Stone', url: '/asmara' },
    { slug: 'massawa', chapter: 'Chapter III', short: 'Massawa', name: 'Massawa · Red Sea Citrus', url: '/massawa' },
    { slug: 'ritual', chapter: 'Lab', short: 'Ritual', name: 'Ritual · Frankincense & Myrrh', url: '/ritual' },
  ];

  const current = chapters.find((c) => c.slug === slug);
  if (!current) return;

  const strip = chapters
    .map((c) => {
      const isCurrent = c.slug === slug;
      const attrs = isCurrent ? ' aria-current="page"' : '';
      const label = c.chapter === 'Lab' ? `Lab · ${c.short}` : `${c.chapter.replace('Chapter ', '')} · ${c.short}`;
      return `<a class="chapter-nav__pill${isCurrent ? ' is-active' : ''}" href="${c.url}"${attrs}><span class="chapter-nav__pill-num">${c.chapter === 'Lab' ? 'Lab' : c.chapter.replace('Chapter ', 'Ch. ')}</span><span class="chapter-nav__pill-name">${c.short}</span></a>`;
    })
    .join('');

  const html = `
  <nav class="chapter-nav" id="chapterNav" aria-label="Fragrance chapters">
    <div class="chapter-nav__inner">
      <ol class="chapter-nav__crumbs">
        <li><a href="/">EILLON</a></li>
        <li><a href="/store">Boutique</a></li>
        <li aria-current="page"><span>${current.name}</span></li>
      </ol>
      <div class="chapter-nav__strip" role="navigation" aria-label="Chapter menu">
        ${strip}
        <a class="chapter-nav__back" href="/store" data-i18n="chapter.all">All chapters</a>
      </div>
    </div>
  </nav>`;

  const nav = document.getElementById('nav');
  if (nav) nav.insertAdjacentHTML('afterend', html);
  else document.body.insertAdjacentHTML('afterbegin', html);
})();
