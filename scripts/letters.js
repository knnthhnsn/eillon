/* EILLON — Beautiful Letters: art-directed desk, physical paper, staged opening. */
(function initBeautifulLetters() {
  'use strict';

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');

  /* Fixed art-directed positions — only letter content shuffles */
  var DESK_PLACES = [
    { silhouette: 'envelope', tx: -248, ty: -182, rot: -7.8, z: 2, s: 0.98 },
    { silhouette: 'trifold', tx: 80, ty: -244, rot: 5.2, z: 5, s: 1.06 },
    { silhouette: 'deckle', tx: 276, ty: -58, rot: 8.8, z: 3, s: 1 },
    { silhouette: 'postal', tx: -214, ty: 80, rot: -5.2, z: 4, s: 1.02 },
    { silhouette: 'bifold', tx: 174, ty: 148, rot: 6.8, z: 2, s: 0.97 },
    { silhouette: 'curl', tx: -12, ty: 204, rot: -2.6, z: 6, s: 1.04 },
  ];

  var MOBILE_PLACES = [
    { silhouette: 'envelope', tx: 0, ty: 0, rot: -2.5, z: 1, s: 1 },
    { silhouette: 'trifold', tx: 24, ty: 168, rot: 2.2, z: 2, s: 0.98 },
    { silhouette: 'deckle', tx: -18, ty: 336, rot: -1.8, z: 3, s: 1.01 },
    { silhouette: 'postal', tx: 14, ty: 504, rot: 2.8, z: 4, s: 0.97 },
    { silhouette: 'bifold', tx: -20, ty: 672, rot: -2, z: 5, s: 1 },
    { silhouette: 'curl', tx: 16, ty: 840, rot: 1.6, z: 6, s: 0.99 },
  ];

  function prefersReduced() { return reduceMq.matches; }

  function shuffleArray(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function scriptLine(text) {
    return escapeHtml(text || '');
  }

  function formatMessage(text) {
    return escapeHtml(text || '').replace(/\n\n+/g, '<br /><br />').replace(/\n/g, '<br />');
  }

  function coverTitle(letter) {
    return letter.coverTitle || letter.title || '';
  }

  function coverFragment(letter) {
    return letter.coverFragment || letter.subtitle || '';
  }

  function letterName(letter) {
    return letter.heading || coverTitle(letter);
  }

  function waxSealClass(letter) {
    return letter.seal === 'logo' ? ' correspondence__wax--logo' : '';
  }

  function embossHTML(letter) {
    var logo = letter.seal === 'logo';
    return (
      '<span class="correspondence__emboss' + (logo ? ' correspondence__emboss--logo' : '') + '" aria-hidden="true">' +
        (logo ? '' : '<span>E</span>') +
      '</span>'
    );
  }

  function waxSealHTML(letter, extraClass) {
    return (
      '<span class="correspondence__wax' + waxSealClass(letter) + (extraClass || '') + '" aria-hidden="true">' +
        (letter.seal === 'logo' ? '' : '<span>E</span>') +
      '</span>'
    );
  }

  function paperLayers() {
    return (
      '<span class="correspondence__grain" aria-hidden="true"></span>' +
      '<span class="correspondence__edge" aria-hidden="true"></span>'
    );
  }

  /* ---------- Closed letter silhouettes ---------- */
  function closedEnvelopeHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--envelope">' +
        '<span class="correspondence__env-back" aria-hidden="true"></span>' +
        '<span class="correspondence__grain" aria-hidden="true"></span>' +
        '<span class="correspondence__env-liner" aria-hidden="true"></span>' +
        '<span class="correspondence__env-peek" aria-hidden="true"></span>' +
        '<span class="correspondence__env-flap" aria-hidden="true"></span>' +
        '<span class="correspondence__env-fold-line" aria-hidden="true"></span>' +
        '<span class="correspondence__env-face">' +
          '<span class="correspondence__face">' +
            '<span class="correspondence__script">' + scriptLine(coverTitle(letter)) + '</span>' +
            '<span class="correspondence__label">' + scriptLine(letter.mark) + '</span>' +
          '</span>' +
        '</span>' +
        waxSealHTML(letter) +
      '</span>'
    );
  }

  function closedTrifoldHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--trifold">' +
        '<span class="correspondence__paper">' +
          paperLayers() +
          '<span class="correspondence__fold correspondence__fold--a" aria-hidden="true"></span>' +
          '<span class="correspondence__fold correspondence__fold--b" aria-hidden="true"></span>' +
          '<span class="correspondence__face">' +
            '<span class="correspondence__script">' + scriptLine(coverTitle(letter)) + '</span>' +
            '<span class="correspondence__label">' + scriptLine(coverFragment(letter)) + '</span>' +
          '</span>' +
        '</span>' +
      '</span>'
    );
  }

  function closedDeckleHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--deckle">' +
        '<span class="correspondence__paper">' +
          paperLayers() +
          '<span class="correspondence__deckle-edge" aria-hidden="true"></span>' +
          '<span class="correspondence__face">' +
            '<span class="correspondence__script">' + scriptLine(coverTitle(letter)) + '</span>' +
          '</span>' +
          '<span class="correspondence__post" aria-hidden="true"></span>' +
        '</span>' +
      '</span>'
    );
  }

  function closedPostalHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--postal">' +
        '<span class="correspondence__env-back" aria-hidden="true"></span>' +
        '<span class="correspondence__grain" aria-hidden="true"></span>' +
        '<span class="correspondence__env-flap correspondence__env-flap--mini" aria-hidden="true"></span>' +
        '<span class="correspondence__face">' +
          '<span class="correspondence__script correspondence__script--small">' + scriptLine(coverTitle(letter)) + '</span>' +
          '<span class="correspondence__label">' + scriptLine(coverFragment(letter)) + '</span>' +
        '</span>' +
        waxSealHTML(letter, ' correspondence__wax--postal') +
      '</span>'
    );
  }

  function closedBifoldHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--bifold">' +
        '<span class="correspondence__paper">' +
          paperLayers() +
          embossHTML(letter) +
          '<span class="correspondence__face">' +
            '<span class="correspondence__script">' + scriptLine(coverTitle(letter)) + '</span>' +
            '<span class="correspondence__label">' + scriptLine(letter.mark) + '</span>' +
          '</span>' +
        '</span>' +
      '</span>'
    );
  }

  function closedCurlHTML(letter) {
    return (
      '<span class="correspondence__cast" aria-hidden="true"></span>' +
      '<span class="correspondence__body correspondence__body--curl">' +
        '<span class="correspondence__paper">' +
          paperLayers() +
          '<span class="correspondence__curl-corner" aria-hidden="true"></span>' +
          '<span class="correspondence__face">' +
            '<span class="correspondence__script">' + scriptLine(coverTitle(letter)) + '</span>' +
            '<span class="correspondence__fragment">' + scriptLine(coverFragment(letter)) + '</span>' +
          '</span>' +
        '</span>' +
      '</span>'
    );
  }

  function closedHTML(letter, silhouette) {
    switch (silhouette) {
      case 'envelope': return closedEnvelopeHTML(letter);
      case 'trifold': return closedTrifoldHTML(letter);
      case 'deckle': return closedDeckleHTML(letter);
      case 'postal': return closedPostalHTML(letter);
      case 'bifold': return closedBifoldHTML(letter);
      case 'curl': return closedCurlHTML(letter);
      default: return closedEnvelopeHTML(letter);
    }
  }

  function foldMarksHTML(silhouette) {
    switch (silhouette) {
      case 'trifold':
        return (
          '<span class="letter-sheet__fold letter-sheet__fold--h1" aria-hidden="true"></span>' +
          '<span class="letter-sheet__fold letter-sheet__fold--h2" aria-hidden="true"></span>'
        );
      case 'bifold':
        return '<span class="letter-sheet__fold letter-sheet__fold--v" aria-hidden="true"></span>';
      case 'deckle':
        return '<span class="letter-sheet__fold letter-sheet__fold--h1" aria-hidden="true"></span>';
      default:
        return '<span class="letter-sheet__fold letter-sheet__fold--light" aria-hidden="true"></span>';
    }
  }

  function buildOpenSheetHTML(letter, silhouette) {
    var format = letter.format || 'archive';
    return (
      '<article class="letter-sheet letter-sheet--' + format + '" data-silhouette="' + silhouette + '">' +
        '<div class="letter-sheet__cast" aria-hidden="true"></div>' +
        '<div class="letter-sheet__paper">' +
          '<span class="letter-sheet__grain" aria-hidden="true"></span>' +
          '<span class="letter-sheet__deckle" aria-hidden="true"></span>' +
          foldMarksHTML(silhouette) +
          '<div class="letter-sheet__content">' +
            '<p class="letter-sheet__meta">' +
              '<span class="letter-sheet__mark">' + scriptLine(letter.mark) + '</span>' +
              '<span class="letter-sheet__date">' + scriptLine(letter.dateline) + '</span>' +
            '</p>' +
            '<p class="letter-sheet__heading">' + scriptLine(letterName(letter)) + '</p>' +
            '<p class="letter-sheet__salute">' + scriptLine(letter.salute || coverFragment(letter)) + '</p>' +
            '<p class="letter-sheet__message" id="letterReaderTitle">' + formatMessage(letter.body || letter.excerpt) + '</p>' +
            '<p class="letter-sheet__sign">' + scriptLine(letter.sign || letter.title || 'Eillon') + '</p>' +
          '</div>' +
          '<span class="letter-sheet__monogram" aria-hidden="true">E</span>' +
        '</div>' +
      '</article>'
    );
  }

  function createCorrespondence(letter, place, index) {
    var item = document.createElement('li');
    item.className = 'correspondence-wrap correspondence-wrap--' + place.silhouette + ' correspondence-wrap--' + (letter.format || 'archive');
    item.dataset.silhouette = place.silhouette;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'correspondence';
    btn.dataset.letterId = letter.id;
    btn.setAttribute('aria-label', 'Open letter: ' + letterName(letter) + '. ' + letter.excerpt);
    btn.innerHTML = closedHTML(letter, place.silhouette);

    btn.style.transitionDelay = prefersReduced() ? '0ms' : (40 + index * 50) + 'ms';
    item.appendChild(btn);
    item._btn = btn;
    layoutPlace(item, place);
    return item;
  }

  function layoutPlace(item, place) {
    item.style.setProperty('--tx', place.tx + 'px');
    item.style.setProperty('--ty', place.ty + 'px');
    item.style.setProperty('--rot', place.rot + 'deg');
    item.style.setProperty('--z', String(place.z));
    item.style.setProperty('--s', String(place.s));
  }

  function LetterArchiveSection(section) {
    if (!section) return null;

    var table = section.querySelector('.mv-letters__table');
    var reader = document.getElementById('letterReader');
    var readerFocus = reader && reader.querySelector('.letter-reader__focus');
    var letters = window.EILLON_LETTERS || [];
    var openId = null;
    var lastFocus = null;
    var clearOpen = null;

    function places() {
      return mobileMq.matches ? MOBILE_PLACES : DESK_PLACES;
    }

    function render() {
      if (!table || !letters.length) return;
      table.innerHTML = '';
      table.setAttribute('aria-label', 'Correspondence on the archive table');

      var ordered = shuffleArray(letters);
      var slots = places();

      ordered.forEach(function (letter, i) {
        if (i >= slots.length) return;
        var place = slots[i];
        var item = createCorrespondence(letter, place, i);
        var btn = item._btn;
        btn.addEventListener('click', function () { openLetter(letter.id, btn, item); });
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLetter(letter.id, btn, item);
          }
        });
        table.appendChild(item);
      });

      requestAnimationFrame(function () { table.classList.add('is-ready'); });
    }

    function findLetter(id) {
      for (var i = 0; i < letters.length; i += 1) {
        if (letters[i].id === id) return letters[i];
      }
      return null;
    }

    function openLetter(id, btn, wrap) {
      var letter = findLetter(id);
      if (!letter || !reader || !readerFocus || openId) return;

      var silhouette = wrap.dataset.silhouette || 'envelope';
      openId = id;
      lastFocus = btn;
      table.classList.add('has-open');
      wrap.classList.add('is-chosen');

      if (window.EILLON_ANALYTICS?.track) {
        window.EILLON_ANALYTICS.track('letter_opened', { letter_id: id, scene: 'letters' });
      }

      readerFocus.innerHTML = buildOpenSheetHTML(letter, silhouette);
      var sheet = readerFocus.querySelector('.letter-sheet');

      reader.classList.add('is-active');
      reader.setAttribute('aria-hidden', 'false');
      document.body.classList.add('letter-reading');

      reader.querySelector('.letter-reader__close').focus();

      if (prefersReduced()) {
        sheet.classList.add('is-arrived', 'is-flat', 'is-ink');
        bindLetterReadDepth(sheet, id);
        return;
      }

      clearOpen = runStages(sheet, [
        { at: 180, cls: 'is-arrived' },
        { at: 520, cls: 'is-flat' },
        { at: 680, cls: 'is-ink' },
      ], function () {
        bindLetterReadDepth(sheet, id);
      });
    }

    function bindLetterReadDepth(sheet, letterId) {
      if (!sheet || sheet.dataset.readBound) return;
      sheet.dataset.readBound = '1';
      var depths = { half: false, full: false };
      var onScroll = function () {
        var max = sheet.scrollHeight - sheet.clientHeight;
        if (max <= 0) {
          if (!depths.full) {
            depths.full = true;
            window.EILLON_ANALYTICS?.track?.('letter_completed', { letter_id: letterId, scene: 'letters' });
          }
          return;
        }
        var ratio = sheet.scrollTop / max;
        if (!depths.half && ratio >= 0.5) {
          depths.half = true;
          window.EILLON_ANALYTICS?.track?.('letter_read_depth', { letter_id: letterId, depth: 'half', scene: 'letters' });
        }
        if (!depths.full && ratio >= 0.92) {
          depths.full = true;
          window.EILLON_ANALYTICS?.track?.('letter_completed', { letter_id: letterId, scene: 'letters' });
          sheet.removeEventListener('scroll', onScroll);
        }
      };
      sheet.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    function closeLetter() {
      if (!reader || !openId) return;
      var closingId = openId;
      var sheet = readerFocus.querySelector('.letter-sheet');

      function done() {
        if (window.EILLON_ANALYTICS?.track) {
          window.EILLON_ANALYTICS.track('letter_closed', { letter_id: closingId, scene: 'letters' });
        }
        openId = null;
        if (clearOpen) clearOpen();
        reader.classList.remove('is-active');
        reader.setAttribute('aria-hidden', 'true');
        readerFocus.innerHTML = '';
        document.body.classList.remove('letter-reading');
        table.classList.remove('has-open');
        table.querySelectorAll('.is-chosen').forEach(function (el) { el.classList.remove('is-chosen'); });
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }

      if (!sheet || prefersReduced()) {
        done();
        return;
      }

      sheet.classList.add('is-closing');
      sheet.classList.remove('is-ink', 'is-flat', 'is-arrived');
      setTimeout(done, 720);
    }

    if (reader) {
      reader.querySelector('.letter-reader__close').addEventListener('click', closeLetter);
      reader.querySelector('.letter-reader__veil').addEventListener('click', closeLetter);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && reader.classList.contains('is-active')) {
          e.preventDefault();
          closeLetter();
        }
      });
    }

    mobileMq.addEventListener('change', render);
    render();
    return { render: render, close: closeLetter };
  }

  function boot() {
    var lettersSection = document.getElementById('letters');
    if (lettersSection) LetterArchiveSection(lettersSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
