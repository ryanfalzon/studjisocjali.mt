(function () {
  /* ====== SETTINGS ====== */
  // Enquiries are emailed by Formspree (formspree.io). Paste the form's ID here:
  // the part after /f/ in the endpoint Formspree shows, e.g. https://formspree.io/f/xyzabcde -> 'xyzabcde'.
  var FORMSPREE_FORM_ID = 'mppwkabg';
  var FORM_ENDPOINT = 'https://formspree.io/f/' + FORMSPREE_FORM_ID;
  var DEFAULT_LANG = 'mt';
  // Translations live in i18n/<lang>.json.
  var LANGS = ['mt', 'en'];
  /* ====================== */

  var META = {
    o: { label: 'O-Level', cls: 'bg-sun' },
    i: { label: 'Intermediate', cls: 'bg-mint' },
    a: { label: 'A-Level', cls: 'bg-pink' }
  };
  var DICT = {};
  var lang = DEFAULT_LANG, tab = 'o';

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var q = (location.search.match(/[?&]lang=(mt|en)/) || [])[1];
  lang = q || store('ss-lang') || DEFAULT_LANG;
  if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

  function load(l) {
    if (DICT[l]) return Promise.resolve(DICT[l]);
    return fetch('i18n/' + l + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { DICT[l] = d; return d; });
  }
  function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  function t(k) { return (DICT[lang] && DICT[lang].strings[k]) || ''; }
  var $ = function (s) { return document.querySelector(s); };

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function slide(marker, btn) {
    if (!marker || !btn) return;
    marker.style.width = btn.offsetWidth + 'px'; marker.style.height = btn.offsetHeight + 'px';
    marker.style.transform = 'translate(' + btn.offsetLeft + 'px,' + btn.offsetTop + 'px)';
  }
  function moveMarkers() {
    slide($('.lang .knob'), document.querySelector('.lang [aria-pressed="true"]'));
    slide($('.tabs .ind'), document.querySelector('.tabs [aria-selected="true"]'));
  }
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function setPressed(l) {
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
  }

  function renderSubject(animate, dir) {
    var m = META[tab], d = DICT[lang].subjects[tab];
    var card = $('#subject-card');
    card.className = 'subject-card sticker ' + m.cls;
    $('#subject-panel').style.setProperty('--dx', ((dir || 1) * 28) + 'px');
    $('#subject-kick').textContent = d.kicker;
    $('#subject-title').textContent = d.title;
    $('#subject-blurb').textContent = d.blurb;
    $('#subject-label').textContent = m.label;
    var ol = $('#subject-topics'); ol.textContent = '';
    d.topics.forEach(function (name, i) {
      var li = document.createElement('li'), n = document.createElement('span');
      n.textContent = String(i + 1); li.appendChild(n); li.appendChild(document.createTextNode(name));
      if (animate) { li.className = 'in'; li.style.setProperty('--i', i); }
      ol.appendChild(li);
    });
    if (animate) restart(card, 'bump');
    document.querySelectorAll('[data-tab]').forEach(function (b) {
      var on = b.getAttribute('data-tab') === tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      if (on) $('#subject-panel').setAttribute('aria-labelledby', b.id);
    });
    moveMarkers();
  }

  // A key missing from the JSON leaves the element's existing text in place.
  function applyLang(animate) {
    document.documentElement.lang = lang;
    if (DICT[lang].title) document.title = DICT[lang].title;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v) el.textContent = v; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-ph')); if (v) el.setAttribute('placeholder', v); });
    setPressed(lang);
    renderSubject(animate, 1);
    if (!$('#f-alert').hidden) $('#f-alert').textContent = t($('#f-alert').getAttribute('data-key'));
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = b.getAttribute('data-lang'); if (next === lang) return;
      setPressed(next);
      moveMarkers(); restart($('.lang svg'), 'spin');
      document.documentElement.classList.add('lang-out');
      Promise.all([load(next), wait(REDUCED ? 0 : 200)])
        .then(function () {
          lang = next; store('ss-lang', next); applyLang(true);
          restart($('.tag'), 'pop');
        })
        .catch(function (err) { console.error('Could not load language "' + next + '"', err); setPressed(lang); moveMarkers(); })
        .then(function () { document.documentElement.classList.remove('lang-out'); });
    });
  });
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var ORDER = ['o', 'i', 'a'];
  function go(next) {
    if (next === tab || !DICT[lang]) return;
    var dir = ORDER.indexOf(next) > ORDER.indexOf(tab) ? 1 : -1; tab = next; renderSubject(true, dir);
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { go(b.getAttribute('data-tab')); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      e.preventDefault(); var nb = tabs[(i + d + tabs.length) % tabs.length]; go(nb.getAttribute('data-tab')); nb.focus();
    });
  });
  $('#subject-enquire').addEventListener('click', function () { var r = document.getElementById('f-level-' + tab); if (r) r.checked = true; });

  var menuBtn = $('.menu-btn'), links = $('#nav-links');
  var scrim = $('.scrim');
  function setMenu(open) { links.classList.toggle('open', open); scrim.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  scrim.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  /* scroll reveal: content stays visible at rest; each block plays its entrance as it approaches the screen */
  if (!REDUCED && 'IntersectionObserver' in window) {
    var targets = [['.band', ''], ['#services .section-head', 'rv-kids'], ['.services', 'rv-kids rv-tilt'], ['#subjects', ''], ['#how h2', ''], ['.steps', 'rv-kids'],
    ['#reviews .reviews', 'rv-kids'], ['.contact-info', 'rv-kids'], ['.form', ''], ['.foot', 'rv-kids']];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        (el.getAttribute('data-rv') || '').split(' ').forEach(function (c) { if (c) el.classList.add(c); });
        el.classList.add('rv-go');
      });
    }, { rootMargin: '0px 0px 60px 0px' });
    targets.forEach(function (tg) {
      var el = $(tg[0]); if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
      el.setAttribute('data-rv', tg[1]); io.observe(el);
    });
  }

  var form = $('#enquiry'), alertEl = $('#f-alert'), send = $('#f-send');
  function showAlert(key) { alertEl.setAttribute('data-key', key); alertEl.textContent = t(key); alertEl.hidden = false; }
  form.addEventListener('input', function () { alertEl.hidden = true; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var name = String(fd.get('name') || '').trim(), contact = String(fd.get('contact') || '').trim(), level = fd.get('level');
    if (!name || !contact || !level || !$('#f-consent').checked) { showAlert('fErr'); return; }
    if (fd.get('_gotcha')) return;
    if (!FORMSPREE_FORM_ID) { console.error('Enquiry form: FORMSPREE_FORM_ID is not set in js/main.js'); showAlert('fFail'); return; }
    send.disabled = true; send.textContent = t('fSending');
    var payload = {
      name: name, contact: contact, level: level, exam: fd.get('exam') || '-', message: fd.get('message') || '-', language: lang === 'mt' ? 'Malti' : 'English',
      _subject: 'Mistoqsija ġdida / New enquiry — ' + name + ' (' + level + ')'
    };
    // An email address in the contact field becomes the reply-to address of the notification.
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) payload.email = contact;
    fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (res) {
        if (res && res.ok === false) throw new Error('rejected');
        var first = name.split(/\s+/)[0];
        $('#ok-title').textContent = t('okTitle').replace('{name}', first);
        $('#form-fields').hidden = true; $('#form-ok').hidden = false; $('#ok-title').setAttribute('tabindex', '-1'); $('#ok-title').focus();
      })
      .catch(function () { showAlert('fFail'); })
      .then(function () { send.disabled = false; send.textContent = t('fSend'); });
  });
  $('#ok-again').addEventListener('click', function () { form.reset(); $('#form-ok').hidden = true; $('#form-fields').hidden = false; $('#f-name').focus(); });

  $('#year').textContent = String(new Date().getFullYear());
  load(lang)
    .then(function () { applyLang(false); })
    .catch(function (err) { console.error('Could not load language "' + lang + '"', err); });
  moveMarkers();
  requestAnimationFrame(function () { requestAnimationFrame(function () { $('.lang').classList.add('ready'); $('.tabs').classList.add('ready'); }); });
  window.addEventListener('resize', moveMarkers);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveMarkers);
})();
